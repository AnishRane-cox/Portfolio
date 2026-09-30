(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  $("#year").textContent = new Date().getFullYear();

  /* ---- nav ---- */
  const nav = $("#nav"), burger = $("#burger"), links = $("#navLinks");
  window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 10), { passive: true });
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  links.addEventListener("click", (e) => { if (e.target.tagName === "A") { links.classList.remove("open"); burger.setAttribute("aria-expanded", false); } });

  /* ---- reveal + count-up ---- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in"); io.unobserve(en.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".section .wrap > *, .tl-item").forEach((el) => { el.classList.add("reveal"); io.observe(el); });

  document.querySelectorAll("[data-count]").forEach((el) => {
    if (reduce) return;
    const target = +el.dataset.count, suf = el.dataset.suffix || "";
    let started = false;
    new IntersectionObserver((e, o) => {
      if (!e[0].isIntersecting || started) return; started = true; o.disconnect();
      const t0 = performance.now();
      (function step(t) {
        const p = Math.min((t - t0) / 1100, 1), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suf;
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }).observe(el);
  });

  /* ---- projects ---- */
  const P = window.PROJECTS || [];
  const cats = ["All", ...Array.from(new Set(P.flatMap((p) => p.cats)))];
  const filters = $("#filters"), cards = $("#cards");
  let active = "All";

  function renderFilters() {
    filters.innerHTML = cats.map((c) => `<button type="button" class="chip${c === active ? " on" : ""}" aria-pressed="${c === active}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
  }
  function renderCards() {
    const list = P.filter((p) => active === "All" || p.cats.includes(active));
    cards.innerHTML = list.map((p) => `
      <button type="button" class="card" data-id="${p.id}">
        <div class="card-top"><span class="ico" aria-hidden="true">${p.icon}</span>${p.metric ? `<span class="metric">${esc(p.metric)}</span>` : p.year ? `<span class="metric soft">${esc(p.year)}</span>` : ""}</div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.summary)}</p>
        <div class="tags">${p.tags.slice(0, 4).map((t) => `<span>${esc(t)}</span>`).join("")}</div>
        <span class="more">Read case study →</span>
      </button>`).join("");
  }
  filters.addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    active = b.dataset.c; renderFilters(); renderCards();
  });

  const modal = $("#modal"), mBody = $("#mBody");
  cards.addEventListener("click", (e) => {
    const c = e.target.closest(".card"); if (!c) return;
    const p = P.find((x) => x.id === c.dataset.id); if (!p) return;
    mBody.innerHTML = `
      <p class="kicker">${p.cats.map(esc).join(" · ")}${p.year ? " · " + esc(p.year) : ""}</p>
      <h3 id="mTitle">${esc(p.title)}</h3>
      <h4>The problem</h4><p>${esc(p.problem)}</p>
      <h4>Approach</h4><ul>${p.approach.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
      <h4>Result</h4><p>${esc(p.result)}</p>
      <div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
      <div class="cta-row">${p.repo ? `<a class="btn btn-sm" href="${p.repo}" target="_blank" rel="noopener">View on GitHub ↗</a>` : `<span class="small muted">${esc(p.note || "Repository not public yet")}</span>`}</div>`;
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
  });
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

  renderFilters(); renderCards();

  /* ---- blog feed ---- */
  fetch("assets/data/posts.json").then((r) => r.json()).then((posts) => {
    $("#posts").innerHTML = posts.map((p) => {
      const d = p.date ? new Date(p.date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
      return `<a class="post" href="${esc(p.url)}" target="_blank" rel="noopener"><span class="tag">${esc(p.tag || "Blog")}</span><h3>${esc(p.title)}</h3><time>${d}</time></a>`;
    }).join("");
  }).catch(() => { $("#posts").innerHTML = `<a class="post" href="https://mlaiinsightshub.blog/" target="_blank" rel="noopener"><h3>Read the blog at mlaiinsightshub.blog</h3></a>`; });

  /* ---- terminal ---- */
  const out = $("#termOut"), form = $("#termForm"), input = $("#termIn");
  const hist = []; let hi = 0;
  const L = (t, cls) => { const d = document.createElement("div"); if (cls) d.className = cls; d.innerHTML = t; out.appendChild(d); out.scrollTop = out.scrollHeight; };
  const cmds = {
    help: () => ["Commands: <b>about</b>, <b>skills</b>, <b>experience</b>, <b>education</b>, <b>projects</b>, <b>blog</b>, <b>contact</b>, <b>whoami</b>, <b>clear</b>"],
    whoami: () => ["Anish Rane · Generative AI &amp; ML Engineer"],
    about: () => ["AI/ML engineer, 3+ years at Weichai Power: production RAG, LSTM predictive maintenance, agentic LLM workflows.", "MSc dissertation: LLM-enhanced multi-agent RL for autonomous driving."],
    skills: () => ["GenAI     : RAG, LangChain/LangGraph, Llama 3.1, Qwen2, Gemma2, GPT-4", "Data      : Pandas, NumPy, SQL, Power BI", "Cloud     : AWS, GCP, Azure ML, Docker, Kubernetes", "Languages : Python, R, C++, JavaScript"],
    experience: () => ["Weichai Power, Pune · May 2023 - present", "  Sales Eng. → Technical-Commercial Eng. → Application Eng. (diesel)", "  AI/ML: RAG +60% match accuracy, LSTM -20% downtime, $1.2M+ revenue impact"],
    education: () => ["MSc ML &amp; AI · Liverpool John Moores University (expected 2027)", "  Dissertation: LLM-enhanced multi-agent RL for autonomous driving", "PG Diploma ML &amp; AI · IIIT Bangalore (distinction)", "B.E. Mechanical (Honours: EVs) · SPPU (distinction)"],
    projects: () => P.map((p, i) => `${i + 1}. ${esc(p.title)}${p.metric ? " [" + esc(p.metric) + "]" : ""}`).concat(["Scroll up to the Projects section for case studies."]),
    blog: () => ['Read more at <a href="https://mlaiinsightshub.blog/" target="_blank" rel="noopener">mlaiinsightshub.blog</a>'],
    contact: () => ["Open to relocating abroad (visa sponsorship required)",'Email: <a href="mailto:anishrane2000@gmail.com">anishrane2000@gmail.com</a>', 'LinkedIn: <a href="https://www.linkedin.com/in/anish-rane" target="_blank" rel="noopener">in/anish-rane</a>', 'GitHub: <a href="https://github.com/AnishRane-cox" target="_blank" rel="noopener">AnishRane-cox</a>'],
    sudo: () => ["Nice try. This portfolio is read-only."],
    clear: () => { out.innerHTML = ""; return []; }
  };
  L("Welcome. Type <b>help</b> to see what you can ask.", "muted");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = input.value.trim(); input.value = ""; if (!raw) return;
    hist.push(raw); hi = hist.length;
    L(`<span class="prompt">$</span> ${esc(raw)}`);
    const name = raw.toLowerCase().split(/\s+/)[0], fn = cmds[name];
    (fn ? fn() : [`command not found: ${esc(name)}. Try <b>help</b>.`]).forEach((l) => L(l));
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && hist.length) { hi = Math.max(0, hi - 1); input.value = hist[hi]; e.preventDefault(); }
    if (e.key === "ArrowDown") { hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ""; e.preventDefault(); }
  });
  $("#term").addEventListener("click", () => input.focus({ preventScroll: true }));
})();
