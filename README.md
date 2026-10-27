# Anish Rane — Personal Portfolio

[![Live site](https://img.shields.io/badge/Live-anishrane--cox.github.io%2FPortfolio-1D9E75?style=flat-square&logo=githubpages&logoColor=white)](https://anishrane-cox.github.io/Portfolio/)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla%20JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-daily%20blog%20sync-2088FF?style=flat-square&logo=githubactions&logoColor=white)

> Portfolio of a **Generative AI & Machine Learning Engineer** — projects, experience, writing and an **in-browser neural network you can train live**. Zero frameworks, zero build step.

 **[Visit the live site](https://anishrane-cox.github.io/Portfolio/)**

---

## Highlights

- **Neural-network playground** — a small multilayer perceptron written **from scratch in JavaScript** trains in the browser and draws its decision boundary in real time (no ML libraries).
- **Recruiter-first design** — Swiss-minimal design system generated with the [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) skill: "At a glance" facts card, impact metrics, featured case studies, WCAG-AA contrast, keyboard and reduced-motion support.
- **Project case studies** — filterable project cards with modal deep-dives, driven by one data file.
- **Auto-updating blog feed** — a GitHub Actions workflow runs a standard-library Python script every day, pulls the latest posts from the blog's RSS feed and commits them to `posts.json`.
- **SEO** — pre-rendered project HTML for crawlers, JSON-LD (`Person`, `ProfilePage`, `WebSite`), Open Graph/Twitter cards, canonical URL, `sitemap.xml`, `robots.txt` and a custom 404 page.

## Sections

About · Experience · Projects · Skills · Education · Live demo (NN playground) · Writing · Contact

## How It Works

```mermaid
flowchart LR
    RSS[Blog RSS feed] -->|daily cron| GA[GitHub Actions<br/>update_posts.py]
    GA -->|commit| J[assets/data/posts.json]
    P[assets/js/projects.js] --> S[index.html]
    J --> S
    S -->|GitHub Pages| W[Live site]
```

## Structure

```
├── index.html                  # Single-page site
├── 404.html
├── assets/
│   ├── css/style.css           # Design system (responsive, reduced-motion aware)
│   ├── js/projects.js          # ← edit to add / change projects
│   ├── js/playground.js        # In-browser neural network trained from scratch
│   ├── js/main.js              # Nav, filters, case-study modal, blog feed
│   ├── data/posts.json         # Latest blog posts (auto-refreshed)
│   └── Anish_Rane_Resume.pdf
├── scripts/update_posts.py     # RSS → posts.json (stdlib only, fails safe)
├── scripts/prerender_projects.py # projects.js → static HTML cards (run after editing projects)
├── .github/workflows/update-posts.yml
├── sitemap.xml · robots.txt · favicon.svg
└── .nojekyll
```

## Run Locally

```bash
git clone https://github.com/AnishRane-cox/Portfolio.git
cd Portfolio
python3 -m http.server 8000
# open http://localhost:8000
```

**Deploy:** Settings → Pages → *Deploy from branch* → `main` / root. The `.nojekyll` file stops GitHub from running Jekyll.
