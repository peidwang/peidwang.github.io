#!/usr/bin/env python3
"""Generate browser-readable bibliography data from the editable BibTeX files.

Run this after editing any file in contents/*.bib:

    python3 scripts/sync_bibliography.py

GitHub Actions runs it automatically before every deployment.
"""

from __future__ import annotations

import json
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent
CONTENTS_DIRECTORY = PROJECT_ROOT / "contents"
OUTPUT_FILE = CONTENTS_DIRECTORY / "bibliography-content.js"

BIBLIOGRAPHY_FILES = {
    "inprep": CONTENTS_DIRECTORY / "inprep.bib",
    "papers": CONTENTS_DIRECTORY / "papers.bib",
}


def main() -> None:
    bibliography = {
        section: path.read_text(encoding="utf-8")
        for section, path in BIBLIOGRAPHY_FILES.items()
    }

    serialized = json.dumps(bibliography, ensure_ascii=False, indent=2)
    output = (
        "// GENERATED FILE — DO NOT EDIT BY HAND.\n"
        "// Edit contents/*.bib, then run: python3 scripts/sync_bibliography.py\n\n"
        f"window.BIB_DATA = {serialized};\n"
    )

    OUTPUT_FILE.write_text(output, encoding="utf-8")
    print(f"Updated {OUTPUT_FILE.relative_to(PROJECT_ROOT)}")


if __name__ == "__main__":
    main()
