"""Pre-render project cards from assets/js/projects.js into index.html.

Search engines and no-JS visitors then see the project content as plain HTML;
main.js re-renders the same cards on load (adding filters and case-study modals).

Run after editing projects.js:  python3 scripts/prerender_projects.py
Standard library only.
"""
import html
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
FEATURED = ["madrl-llm", "rag-engine", "predictive-maint"]  # keep in sync with main.js


def load_projects():
    src = (ROOT / "assets/js/projects.js").read_text(encoding="utf-8")
    body = src.split("=", 1)[1].strip().rstrip(";")
    return json.loads(body)


def esc(s):
    return html.escape(str(s), quote=True)


def card(p, featured):
    icon = f'<svg class="icon" aria-hidden="true"><use href="#i-{esc(p.get("icon") or "cpu")}"/></svg>'
    if p.get("metric"):
        badge = f'<span class="metric">{esc(p["metric"])}</span>'
    elif p.get("year"):
        badge = f'<span class="metric soft">{esc(p["year"])}</span>'
    else:
        badge = ""
    label = f'<span class="label">{esc(p["year"])}</span>' if featured and p.get("year") else ""
    tags = "".join(f"<span>{esc(t)}</span>" for t in p["tags"][:4])
    return (
        f'      <button type="button" class="card" data-id="{esc(p["id"])}" aria-haspopup="dialog">'
        f'<div class="card-top"><span class="ico">{icon}</span>{badge}</div>{label}'
        f'<h3>{esc(p["title"])}</h3><p>{esc(p["summary"])}</p>'
        f'<div class="tags">{tags}</div>'
        f'<span class="more">Read case study<svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></span></button>'
    )


def inject(doc, name, content):
    pat = re.compile(rf"(<!--{name}:START-->)(.*?)(<!--{name}:END-->)", re.S)
    return pat.sub(lambda m: f"{m.group(1)}\n{content}\n{m.group(3)}", doc)


def main():
    projects = load_projects()
    feat = [p for pid in FEATURED for p in projects if p["id"] == pid]
    rest = [p for p in projects if p["id"] not in FEATURED]
    index = ROOT / "index.html"
    doc = index.read_text(encoding="utf-8")
    doc = inject(doc, "FEATURED", "\n".join(card(p, True) for p in feat))
    doc = inject(doc, "CARDS", "\n".join(card(p, False) for p in rest))
    index.write_text(doc, encoding="utf-8")
    print(f"Pre-rendered {len(feat)} featured + {len(rest)} project cards.")


if __name__ == "__main__":
    main()
