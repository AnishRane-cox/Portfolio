/* Neural network playground: a tiny MLP trained from scratch in the browser. */
(function () {
  const canvas = document.getElementById("nnCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const $ = (id) => document.getElementById(id);
  const N = 200, GRID = 48;
  let data = [], net = null, running = true, epoch = 0, raf = 0, visible = true;
  const off = document.createElement("canvas");
  off.width = off.height = GRID;
  const octx = off.getContext("2d");
  const img = octx.createImageData(GRID, GRID);

  const rnd = () => Math.random();
  const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(6.283185 * rnd());

  function makeData(kind, noise) {
    const pts = [];
    for (let i = 0; i < N; i++) {
      const label = i % 2;
      let x, y;
      if (kind === "circles") {
        const r = label ? 0.35 : 0.85, t = rnd() * 6.283;
        x = r * Math.cos(t) + gauss() * noise * 0.5; y = r * Math.sin(t) + gauss() * noise * 0.5;
      } else if (kind === "xor") {
        x = (rnd() * 2 - 1) * 0.9; y = (rnd() * 2 - 1) * 0.9;
        x += Math.sign(x) * 0.08; y += Math.sign(y) * 0.08;
        const l = x * y > 0 ? 1 : 0;
        x += gauss() * noise * 0.4; y += gauss() * noise * 0.4;
        pts.push({ x, y, l }); continue;
      } else if (kind === "moons") {
        const t = rnd() * Math.PI;
        if (label) { x = 0.5 - Math.cos(t) * 0.7 + 0.1; y = 0.25 - Math.sin(t) * 0.7; }
        else { x = -0.5 + Math.cos(t) * 0.7 - 0.1; y = -0.25 + Math.sin(t) * 0.7; }
        x += gauss() * noise * 0.4; y += gauss() * noise * 0.4;
        x *= 0.95; y *= 1.1;
      } else { // spiral
        const t = (i / N) * 2 * 3.14159 * 1.0 + 0.3 + rnd() * 0.2;
        const r = 0.12 + (t / (2 * 3.14159 * 1.0 + 0.5)) * 0.8, ang = t * 2 + label * 3.14159;
        x = r * Math.cos(ang) + gauss() * noise * 0.25; y = r * Math.sin(ang) + gauss() * noise * 0.25;
      }
      pts.push({ x, y, l: label });
    }
    return pts;
  }

  const acts = {
    tanh: { f: Math.tanh, d: (a) => 1 - a * a },
    relu: { f: (z) => (z > 0 ? z : 0), d: (a) => (a > 0 ? 1 : 0) }
  };

  function makeNet(layers, neurons, actName) {
    const sizes = [2]; for (let i = 0; i < layers; i++) sizes.push(neurons); sizes.push(1);
    const W = [], B = [];
    for (let l = 1; l < sizes.length; l++) {
      const fin = sizes[l - 1], fout = sizes[l], lim = Math.sqrt(6 / (fin + fout));
      W.push(Array.from({ length: fout }, () => Array.from({ length: fin }, () => (rnd() * 2 - 1) * lim)));
      B.push(new Array(fout).fill(0));
    }
    return { sizes, W, B, act: acts[actName] };
  }

  function forward(n, x, y) {
    const A = [[x, y]];
    for (let l = 0; l < n.W.length; l++) {
      const last = l === n.W.length - 1, out = [];
      for (let j = 0; j < n.W[l].length; j++) {
        let z = n.B[l][j]; const w = n.W[l][j], a = A[l];
        for (let k = 0; k < w.length; k++) z += w[k] * a[k];
        out.push(last ? 1 / (1 + Math.exp(-z)) : n.act.f(z));
      }
      A.push(out);
    }
    return A;
  }

  function trainEpoch(n, lr) {
    const idx = data.map((_, i) => i).sort(() => rnd() - 0.5), BS = 16;
    for (let s = 0; s < idx.length; s += BS) {
      const gW = n.W.map((m) => m.map((r) => r.map(() => 0))), gB = n.B.map((b) => b.map(() => 0));
      const batch = idx.slice(s, s + BS);
      for (const i of batch) {
        const p = data[i], A = forward(n, p.x, p.y);
        let delta = [A[A.length - 1][0] - p.l];
        for (let l = n.W.length - 1; l >= 0; l--) {
          const prev = A[l], nd = l > 0 ? new Array(prev.length).fill(0) : null;
          for (let j = 0; j < delta.length; j++) {
            gB[l][j] += delta[j];
            for (let k = 0; k < prev.length; k++) {
              gW[l][j][k] += delta[j] * prev[k];
              if (nd) nd[k] += delta[j] * n.W[l][j][k];
            }
          }
          if (nd) for (let k = 0; k < nd.length; k++) nd[k] *= n.act.d(prev[k]);
          delta = nd;
        }
      }
      const sc = lr / batch.length;
      for (let l = 0; l < n.W.length; l++)
        for (let j = 0; j < n.W[l].length; j++) {
          n.B[l][j] -= sc * gB[l][j];
          for (let k = 0; k < n.W[l][j].length; k++) n.W[l][j][k] -= sc * gW[l][j][k];
        }
    }
    epoch++;
  }

  function metrics() {
    let loss = 0, ok = 0;
    for (const p of data) {
      const o = forward(net, p.x, p.y), q = Math.min(Math.max(o[o.length - 1][0], 1e-7), 1 - 1e-7);
      loss += -(p.l * Math.log(q) + (1 - p.l) * Math.log(1 - q));
      if ((q > 0.5 ? 1 : 0) === p.l) ok++;
    }
    return { loss: loss / data.length, acc: ok / data.length };
  }

  function render() {
    for (let gy = 0; gy < GRID; gy++)
      for (let gx = 0; gx < GRID; gx++) {
        const x = (gx / (GRID - 1)) * 2.4 - 1.2, y = 1.2 - (gy / (GRID - 1)) * 2.4;
        const A = forward(net, x, y), p = A[A.length - 1][0], i = (gy * GRID + gx) * 4;
        // class 1 = blue (37,99,235), class 0 = orange (249,115,22)
        img.data[i] = 249 + (37 - 249) * p; img.data[i + 1] = 115 + (99 - 115) * p; img.data[i + 2] = 22 + (235 - 22) * p;
        img.data[i + 3] = 40 + Math.abs(p - 0.5) * 150;
      }
    octx.putImageData(img, 0, 0);
    const S = canvas.width;
    ctx.clearRect(0, 0, S, S); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, S, S);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(off, 0, 0, S, S);
    for (const p of data) {
      const cx = ((p.x + 1.2) / 2.4) * S, cy = ((1.2 - p.y) / 2.4) * S;
      ctx.beginPath(); ctx.arc(cx, cy, 4.2, 0, 6.283);
      ctx.fillStyle = p.l ? "#2563eb" : "#f97316"; ctx.fill();
      ctx.lineWidth = 1.5; ctx.strokeStyle = "#fff"; ctx.stroke();
    }
    const m = metrics();
    $("sEpoch").textContent = epoch; $("sLoss").textContent = m.loss.toFixed(3);
    $("sAcc").textContent = (m.acc * 100).toFixed(0) + "%";
  }

  function lr() { return parseFloat($("cLr").value); }
  function reset() {
    data = makeData($("cData").value, parseFloat($("cNoise").value));
    net = makeNet(+$("cLayers").value, +$("cNeurons").value, $("cAct").value);
    epoch = 0; render();
  }

  function tick() {
    if (running && visible) { for (let i = 0; i < 3; i++) trainEpoch(net, lr()); render(); }
    raf = requestAnimationFrame(tick);
  }

  [["cLayers", "oLayers"], ["cNeurons", "oNeurons"], ["cLr", "oLr"], ["cNoise", "oNoise"]].forEach(([i, o]) => {
    $(i).addEventListener("input", () => {
      const v = $(i).value; $(o).textContent = i === "cNoise" ? (+v).toFixed(2) : v;
      if (i !== "cLr") reset();
    });
  });
  $("cData").addEventListener("change", reset);
  $("cAct").addEventListener("change", reset);
  $("bReset").addEventListener("click", () => { reset(); running = true; $("bTrain").textContent = "Pause"; });
  $("bTrain").addEventListener("click", () => {
    running = !running; $("bTrain").textContent = running ? "Pause" : "Train";
  });
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(canvas);

  reset();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    running = false; $("bTrain").textContent = "Train";
  }
  tick();
  window.__nn = { get epoch() { return epoch; }, metrics };
})();
