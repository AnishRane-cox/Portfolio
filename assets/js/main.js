(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (n, cls = "icon") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  $("#year").textContent = new Date().getFullYear();

  /* ---- nav ---- */
  const nav = $("#nav"), burger = $("#burger"), links = $("#navLinks");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const setMenu = (open) => {
    links.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  burger.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && links.classList.contains("open")) { setMenu(false); burger.focus(); } });

  // highlight current section in nav
  const navMap = new Map($$('.nav-links a[href^="#"]').map((a) => [a.getAttribute("href").slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      const a = navMap.get(en.target.id); if (!a) return;
      if (en.isIntersecting) { navMap.forEach((x) => x.removeAttribute("aria-current")); a.setAttribute("aria-current", "true"); }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  navMap.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });

  /* ---- reveal + count-up ---- */
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.08 });
    $$(".section .wrap > *, .job, .pillar").forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return; // never hide what's already on screen
      el.classList.add("reveal"); io.observe(el);
    });

    $$("[data-count]").forEach((el) => {
      const target = +el.dataset.count, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
      new IntersectionObserver((e, o) => {
        if (!e[0].isIntersecting) return; o.disconnect();
        const t0 = performance.now();
        (function step(t) {
          const p = Math.min((t - t0) / 900, 1), eased = 1 - Math.pow(1 - p, 3);
          el.textContent = pre + Math.round(target * eased) + suf;
          if (p < 1) requestAnimationFrame(step);
        })(t0);
      }).observe(el);
    });
  }

  /* ---- projects ---- */
  const P = window.PROJECTS || [];
  const FEATURED = ["madrl-llm", "rag-engine", "predictive-maint"];
  const featured = P.filter((p) => FEATURED.includes(p.id));
  const rest = P.filter((p) => !FEATURED.includes(p.id));
  const cats = ["All", ...Array.from(new Set(rest.flatMap((p) => p.cats)))];
  const filters = $("#filters"), cards = $("#cards");
  let active = "All";

  const card = (p, isFeatured) => `
      <button type="button" class="card" data-id="${esc(p.id)}" aria-haspopup="dialog">
        <div class="card-top"><span class="ico">${icon(p.icon || "cpu")}</span>${p.metric ? `<span class="metric">${esc(p.metric)}</span>` : p.year ? `<span class="metric soft">${esc(p.year)}</span>` : ""}</div>
        ${isFeatured && p.year ? `<span class="label">${esc(p.year)}</span>` : ""}
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.summary)}</p>
        <div class="tags">${p.tags.slice(0, 4).map((t) => `<span>${esc(t)}</span>`).join("")}</div>
        <span class="more">Read case study${icon("arrow")}</span>
      </button>`;

  $("#featured").innerHTML = featured.map((p) => card(p, true)).join("");
  function renderFilters() {
    filters.innerHTML = cats.map((c) => `<button type="button" class="chip${c === active ? " on" : ""}" aria-pressed="${c === active}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
  }
  function renderCards() {
    cards.innerHTML = rest.filter((p) => active === "All" || p.cats.includes(active)).map((p) => card(p, false)).join("");
  }
  filters.addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    active = b.dataset.c; renderFilters(); renderCards();
    const again = filters.querySelector(`[data-c="${CSS.escape(active)}"]`); if (again) again.focus();
  });

  const modal = $("#modal"), mBody = $("#mBody");
  let opener = null;
  function openCase(id) {
    const p = P.find((x) => x.id === id); if (!p) return;
    mBody.innerHTML = `
      <p class="kicker">${p.cats.map(esc).join(" · ")}${p.year ? " · " + esc(p.year) : ""}</p>
      <h3 id="mTitle">${esc(p.title)}</h3>
      ${p.metric ? `<p><span class="metric">${esc(p.metric)}</span></p>` : ""}
      <h4>The problem</h4><p>${esc(p.problem)}</p>
      <h4>Approach</h4><ul>${p.approach.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
      <h4>Result</h4><p>${esc(p.result)}</p>
      <div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
      <div class="cta-row">${p.repo ? `<a class="btn btn-sm" href="${esc(p.repo)}" target="_blank" rel="noopener">${icon("github")}View code on GitHub</a>` : `<span class="small muted">${esc(p.note || "Repository not public yet.")}</span>`}</div>`;
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
  }
  document.addEventListener("click", (e) => {
    const c = e.target.closest(".card"); if (!c) return;
    opener = c; openCase(c.dataset.id);
  });
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
  modal.addEventListener("close", () => { if (opener && document.contains(opener)) opener.focus(); });

  renderFilters(); renderCards();

  /* ---- blog feed ---- */
  fetch("assets/data/posts.json").then((r) => r.json()).then((posts) => {
    $("#posts").innerHTML = posts.slice(0, 6).map((p) => {
      const d = p.date ? new Date(p.date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
      return `<a class="post" href="${esc(p.url)}" target="_blank" rel="noopener"><span class="tag">${esc(p.tag || "Blog")}</span><h3>${esc(p.title)}</h3>${d ? `<time datetime="${esc(p.date)}">${d}</time>` : ""}</a>`;
    }).join("");
  }).catch(() => { $("#posts").innerHTML = `<a class="post" href="https://mlaiinsightshub.blog/" target="_blank" rel="noopener"><h3>Read the blog at mlaiinsightshub.blog</h3></a>`; });
})();
