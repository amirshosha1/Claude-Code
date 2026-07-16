#!/usr/bin/env python3
"""
build.py — bundles the modular /src into a single self-contained
/dist/dashboard.html that runs offline over file:// with no server,
no CDN, no external dependencies.

How it works:
  * Reads src/index.html
  * Replaces every <link rel="stylesheet" href="css/..."> between the
    <!-- build:css --> markers with an inlined <style> block.
  * Replaces every <script src="js/..."> between the <!-- build:js -->
    markers with an inlined <script> block, IN ORDER.
Because the JS uses a global `App.*` namespace (not ES modules),
ordered concatenation is a correct, reliable bundle.

Usage:
    python3 build.py

Regenerate whenever you change anything in /src. The output
/dist/dashboard.html is what you open on the phone.
"""
import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / "src"
DIST = ROOT / "dist"
DIST.mkdir(exist_ok=True)

html = (SRC / "index.html").read_text(encoding="utf-8")

def inline_css(match):
    href = match.group(1)
    css = (SRC / href).read_text(encoding="utf-8")
    return f"<style>\n/* ==== {href} ==== */\n{css}\n</style>"

def inline_js(match):
    src = match.group(1)
    js = (SRC / src).read_text(encoding="utf-8")
    return f"<script>\n/* ==== {src} ==== */\n{js}\n</script>"

# Inline stylesheets
html = re.sub(r'<link[^>]*href="([^"]+\.css)"[^>]*>', inline_css, html)
# Inline scripts (src=...)
html = re.sub(r'<script[^>]*src="([^"]+\.js)"[^>]*>\s*</script>', inline_js, html)
# Strip build markers/comments
html = re.sub(r'<!--\s*(build:css|endbuild|build:js|core.*|modules.*|bootstrap.*)\s*-->', '', html)

out = DIST / "dashboard.html"
out.write_text(html, encoding="utf-8")
# also emit index.html so a static host serving dist/ as web root
# opens the app at the domain root (https://your-domain/).
(DIST / "index.html").write_text(html, encoding="utf-8")

kb = len(html.encode("utf-8")) / 1024
print(f"Built {out.relative_to(ROOT)} + index.html ({kb:.0f} KB) — offline, self-contained.")
