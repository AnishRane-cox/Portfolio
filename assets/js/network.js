/* Animated neural-network hero background (canvas, no libraries). */
(function () {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h, dpr, nodes = [], visible = true, raf;
  const mouse = { x: -999, y: -999 };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(90, Math.max(28, (w * h) / 15000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 1.2
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const maxD = 130;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > w) a.vx *= -1;
      if (a.y < 0 || a.y > h) a.vy *= -1;
      const dx = a.x - mouse.x, dy = a.y - mouse.y, md = Math.hypot(dx, dy);
      if (md < 120 && md > 0) { a.x += (dx / md) * 0.8; a.y += (dy / md) * 0.8; }
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < maxD) {
          ctx.strokeStyle = "rgba(37,99,235," + (0.18 * (1 - d / maxD)) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const near = md < 140;
      ctx.fillStyle = near ? "rgba(37,99,235,0.85)" : "rgba(71,85,105,0.45)";
      ctx.beginPath(); ctx.arc(a.x, a.y, near ? a.r + 1 : a.r, 0, 6.283); ctx.fill();
    }
  }

  function loop() { if (visible) draw(); raf = requestAnimationFrame(loop); }

  resize();
  window.addEventListener("resize", resize);
  canvas.parentElement.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  canvas.parentElement.addEventListener("mouseleave", () => { mouse.x = mouse.y = -999; });
  new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(canvas);
  if (reduce) { draw(); } else { loop(); }
})();
