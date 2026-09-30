# Anish Rane · Portfolio

Static portfolio for ML / AI roles. No build step: plain HTML, CSS and JavaScript, plus a small Python script.

## Structure
- `index.html`: the page
- `assets/css/style.css`: design system (light theme, responsive, reduced-motion aware)
- `assets/js/projects.js`: **edit this to add or change projects**
- `assets/js/network.js`: animated hero network (canvas)
- `assets/js/playground.js`: neural network trained live in the browser (from scratch)
- `assets/js/main.js`: nav, filters, case-study modal, blog feed, terminal
- `assets/data/posts.json`: latest blog posts, refreshed daily by `scripts/update_posts.py` via GitHub Actions

## Deploy (GitHub Pages)
Repo → Settings → Pages → Deploy from branch → `main` / root. The `.nojekyll` file keeps GitHub from running Jekyll.

## Local preview
`python3 -m http.server 8000` then open http://localhost:8000
