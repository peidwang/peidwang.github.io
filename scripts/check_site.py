#!/usr/bin/env python3
"""Check the website for problems before or after deploying.

Run from the website folder:

    python3 scripts/check_site.py

It only reads files and git status; it does not change anything.
"""
import json
import re
import shutil
import subprocess
from pathlib import Path

ROOT = Path(".").resolve()
problems, warnings, notes = [], [], []

def run(cmd):
    r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
    return r.returncode, (r.stdout + r.stderr).strip()

# ---------------------------------------------------------------- git and deployment
if (ROOT / ".git").exists():
    code, out = run(["git", "status", "--porcelain"])
    if out:
        warnings.append(f"Uncommitted changes ({len(out.splitlines())} files). Run: git add . && git commit -m \"...\"")
    run(["git", "fetch", "-q", "origin", "main"])
    code, ahead = run(["git", "rev-list", "--count", "origin/main..HEAD"])
    code2, behind = run(["git", "rev-list", "--count", "HEAD..origin/main"])
    if ahead.isdigit() and int(ahead) > 0:
        problems.append(f"{ahead} commit(s) not pushed yet, so peidwang.com does not show them. Run: git push origin main")
    if behind.isdigit() and int(behind) > 0:
        warnings.append(f"GitHub has {behind} commit(s) you do not have locally. Run: git pull --rebase origin main")
    if ahead == "0" and not out:
        notes.append("Git: everything is committed and pushed.")
else:
    problems.append("This folder is not a git repository.")

# ---------------------------------------------------------------- JavaScript syntax
js_files = [ROOT / "script.js", ROOT / "publications.js"] + sorted((ROOT / "contents").glob("*.js")) + sorted((ROOT / "contents/projects").glob("*.js"))
if shutil.which("node"):
    for f in js_files:
        code, out = run(["node", "--check", str(f)])
        if code:
            problems.append(f"JavaScript error in {f.relative_to(ROOT)}:\n    {out.splitlines()[-1] if out else ''}")
    notes.append(f"JavaScript: checked {len(js_files)} files.")
else:
    notes.append("JavaScript syntax not checked locally (Node.js not installed); GitHub Actions checks it on every push.")

# ---------------------------------------------------------------- bibliography
bib = {name: (ROOT / f"contents/{name}.bib").read_text(encoding="utf-8") for name in ("inprep", "papers")}
generated = (ROOT / "contents/bibliography-content.js").read_text(encoding="utf-8")
try:
    data = json.loads(generated.split("window.BIB_DATA = ", 1)[1].rstrip().rstrip(";"))
    if data != bib:
        problems.append("contents/bibliography-content.js is out of date. Run: python3 scripts/sync_bibliography.py")
except Exception:
    problems.append("contents/bibliography-content.js could not be read. Run: python3 scripts/sync_bibliography.py")

def parse_bibtex(text):
    """Small BibTeX reader with nested-brace support, matching the website's own parser."""
    out, i = [], 0
    while True:
        i = text.find("@", i)
        if i < 0:
            return out
        brace = text.find("{", i)
        comma = text.find(",", brace)
        if brace < 0 or comma < 0:
            return out
        key, fields, i = text[brace + 1:comma].strip(), {}, comma + 1
        while i < len(text):
            while i < len(text) and text[i] in " \t\r\n,":
                i += 1
            if i >= len(text) or text[i] == "}":
                i += 1
                break
            start = i
            while i < len(text) and (text[i].isalnum() or text[i] in "_-"):
                i += 1
            name = text[start:i].lower()
            while i < len(text) and text[i] in " \t=":
                i += 1
            if i < len(text) and text[i] == "{":
                depth, i, vstart = 1, i + 1, i + 1
                while i < len(text) and depth:
                    depth += {"{": 1, "}": -1}.get(text[i], 0)
                    i += 1
                value = text[vstart:i - 1]
            elif i < len(text) and text[i] == '"':
                vstart = i + 1
                i = text.find('"', vstart) + 1
                value = text[vstart:i - 1]
            else:
                vstart = i
                while i < len(text) and text[i] not in ",}":
                    i += 1
                value = text[vstart:i]
            if name:
                fields[name] = value.strip().replace("{", "").replace("}", "")
        out.append((key, fields))

entries = {}
for section, text in bib.items():
    for key, fields in parse_bibtex(text):
        if key in entries:
            problems.append(f"Duplicate BibTeX key: {key}")
        entries[key] = (section, fields)

for key, (section, fields) in entries.items():
    for field, folder in (("pdf", "assets/publications/papers"), ("preview", "assets/publications/previews")):
        if field in fields and not (ROOT / folder / fields[field]).exists():
            problems.append(f"{key}: {field} file not found: {folder}/{fields[field]}")
    if section == "papers" and "preview" not in fields and fields.get("selected") == "true":
        warnings.append(f"{key} is selected for the home page but has no preview image.")
    if "html" in fields and "/doi/abs/" in fields["html"]:
        warnings.append(f"{key}: consider a https://doi.org/... link instead of {fields['html']}")
    if section == "inprep" and "(under review)" in fields.get("journal", "").lower():
        warnings.append(f"{key}: move '(under review)' from journal into status = {{Under review}}")

selected = [k for k, (s, f) in entries.items() if s == "papers" and f.get("selected") == "true"]
notes.append(f"Bibliography: {len(entries)} entries, {len(selected)} selected for the home page.")

# files on disk that no entry uses
used = {f.get("pdf") for _, f in entries.values()} | {f.get("preview") for _, f in entries.values()}
for folder in ("assets/publications/papers", "assets/publications/previews"):
    for f in sorted((ROOT / folder).glob("*")):
        if f.name.startswith("."):
            continue
        if f.name not in used:
            warnings.append(f"Not used by any BibTeX entry but still public: {folder}/{f.name}")

# ---------------------------------------------------------------- research projects
for f in sorted((ROOT / "contents/projects").glob("*.js")):
    text = f.read_text(encoding="utf-8")
    for img in re.findall(r'(?:cardImage|detailImage):\s*"([^"]+)"', text):
        if not (ROOT / img).exists():
            problems.append(f"{f.name}: image not found: {img}")
    keys_block = re.search(r"relatedPublicationKeys:\s*\[(.*?)\]", text, flags=re.S)
    for key in re.findall(r'"([^"]+)"', keys_block.group(1) if keys_block else ""):
        if key not in entries:
            problems.append(f"{f.name}: related publication key not in any .bib file: {key}")
    page = re.search(r'page:\s*"([^"]+)"', text)
    if page and not (ROOT / page.group(1)).exists():
        problems.append(f"{f.name}: page not found: {page.group(1)}")
    if f'contents/projects/{f.name}' not in (ROOT / "research.html").read_text():
        problems.append(f"research.html does not load contents/projects/{f.name}")

# ---------------------------------------------------------------- HTML pages: local files they load
for page in sorted(ROOT.glob("*.html")) + sorted((ROOT / "projects").glob("*.html")):
    html = page.read_text(encoding="utf-8")
    for ref in re.findall(r'(?:src|href)="([^"#?]+)', html):
        if ref.startswith(("http", "mailto:", "data:")):
            continue
        target = ROOT / ref.lstrip("/") if ref.startswith("/") else page.parent / ref
        if not target.resolve().exists():
            problems.append(f"{page.relative_to(ROOT)}: file not found: {ref}")

# ---------------------------------------------------------------- sitemap
sitemap = ROOT / "sitemap.xml"
if sitemap.exists():
    listed = set(re.findall(r"<loc>https://peidwang\.com/([^<]*)</loc>", sitemap.read_text()))
    for page in sorted(ROOT.glob("*.html")) + sorted((ROOT / "projects").glob("*.html")):
        rel = page.relative_to(ROOT).as_posix()
        rel = "" if rel == "index.html" else rel
        if page.name != "404.html" and rel not in listed:
            warnings.append(f"sitemap.xml does not list {rel or 'index.html'}")
else:
    warnings.append("sitemap.xml is missing.")

# ---------------------------------------------------------------- other content files
home = (ROOT / "contents/home-content.js").read_text(encoding="utf-8")
for ref in re.findall(r'hero\w*:\s*"([^"]+)"', home):
    if "/" in ref and not (ROOT / ref).exists():
        problems.append(f"home-content.js: file not found: {ref}")
about = (ROOT / "contents/about-content.js").read_text(encoding="utf-8")
for ref in re.findall(r'(?:image|url):\s*"(assets/[^"]+)"', about):
    if not (ROOT / ref).exists():
        problems.append(f"about-content.js: file not found: {ref}")
script = (ROOT / "script.js").read_text(encoding="utf-8")
if "orcid-id-mono.svg" in script and not (ROOT / "assets/site/orcid-id-mono.svg").exists():
    problems.append("script.js uses assets/site/orcid-id-mono.svg, but the file is missing. Run use_orcid_icon.py again.")
if "orcid.org" not in about:
    warnings.append("About page has no ORCID link.")

css = (ROOT / "styles.css").read_text(encoding="utf-8")
if re.search(r"@import\s+url\([\"\']?https://fonts\.googleapis", css):
    warnings.append("styles.css still loads Google Fonts (blocked in mainland China).")
for font in re.findall(r'url\("(assets/fonts/[^"]+)"\)', css):
    if not (ROOT / font).exists():
        problems.append(f"styles.css: font file not found: {font}")

# ---------------------------------------------------------------- size and stray files
big = sorted(((f.stat().st_size, f) for f in ROOT.rglob("*") if f.is_file() and ".git" not in f.parts and f.suffix.lower() in {".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".webm"}), reverse=True)
for size, f in big:
    if size > 800_000:
        warnings.append(f"Large image/video ({size // 1024} KB): {f.relative_to(ROOT)}")
for f in ROOT.rglob(".DS_Store"):
    if ".git" not in f.parts:
        notes.append(f".DS_Store present (ignored by git, harmless): {f.relative_to(ROOT)}")
        break
for name in ("CNAME", ".nojekyll", ".github/workflows/pages.yml", ".gitignore", "404.html", "robots.txt"):
    if not (ROOT / name).exists():
        problems.append(f"Missing: {name}")

# ---------------------------------------------------------------- report
print("\n=== Website check ===\n")
for title, items in (("PROBLEMS (fix these)", problems), ("WARNINGS (worth a look)", warnings), ("OK / notes", notes)):
    print(f"{title}: {len(items)}")
    for item in items:
        print(f"  - {item}")
    print()
