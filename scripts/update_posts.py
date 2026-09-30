#!/usr/bin/env python3
"""Refresh assets/data/posts.json from the blog's RSS feed.

Runs daily in GitHub Actions (see .github/workflows/update-posts.yml).
Uses only the standard library. If the feed cannot be read, the existing
file is left untouched so the site never breaks.
"""
import json, sys, urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from pathlib import Path

FEED = "https://mlaiinsightshub.blog/feed/"
OUT = Path(__file__).resolve().parent.parent / "assets" / "data" / "posts.json"

def main() -> int:
    try:
        req = urllib.request.Request(FEED, headers={"User-Agent": "portfolio-feed-bot/1.0"})
        with urllib.request.urlopen(req, timeout=20) as r:
            root = ET.fromstring(r.read())
    except Exception as exc:  # network/parse failure -> keep old data
        print(f"Feed unavailable ({exc}); keeping existing posts.json")
        return 0
    posts = []
    for item in root.iterfind("./channel/item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        pub = item.findtext("pubDate")
        cat = item.findtext("category") or "Blog"
        if not (title and link):
            continue
        date = parsedate_to_datetime(pub).date().isoformat() if pub else ""
        posts.append({"title": title, "date": date, "url": link, "tag": cat})
        if len(posts) == 6:
            break
    if posts:
        OUT.write_text(json.dumps(posts, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"Wrote {len(posts)} posts")
    return 0

if __name__ == "__main__":
    sys.exit(main())
