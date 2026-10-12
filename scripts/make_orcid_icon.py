#!/usr/bin/env python3
"""Make the one-color ORCID iD icon used on the About page.

Put the official ORCID iD icon (SVG, from orcid.org) at assets/site/orcid-id.svg, then run
from the website folder:

    python3 scripts/make_orcid_icon.py

This writes assets/site/orcid-id-mono.svg: filled shapes become solid and white shapes
(the letters "iD") become see-through, so the site can color the icon like the others.
"""

import re
import xml.etree.ElementTree as ET
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SOURCE = PROJECT_ROOT / "assets/site/orcid-id.svg"
OUTPUT = PROJECT_ROOT / "assets/site/orcid-id-mono.svg"
SVG = "http://www.w3.org/2000/svg"
SHAPES = {f"{{{SVG}}}{tag}" for tag in ("path", "circle", "rect", "ellipse", "polygon", "polyline")}
WHITE = {"#fff", "#ffffff", "white", "rgb(255,255,255)", "rgb(255, 255, 255)"}


def fill_of(element: ET.Element) -> str:
    match = re.search(r"fill\s*:\s*([^;]+)", element.get("style", ""))
    return (match.group(1) if match else element.get("fill", "")).strip().lower()


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Not found: {SOURCE.relative_to(PROJECT_ROOT)}")

    ET.register_namespace("", SVG)
    source = ET.parse(SOURCE).getroot()
    viewbox = source.get("viewBox") or f"0 0 {source.get('width', '24').rstrip('px')} {source.get('height', '24').rstrip('px')}"
    x, y, width, height = (float(v) for v in viewbox.replace(",", " ").split())

    solid, holes = [], []
    for element in source.iter():
        if element.tag in SHAPES:
            copy = ET.Element(element.tag, {k: v for k, v in element.attrib.items() if k not in ("style", "fill", "class")})
            (holes if fill_of(element) in WHITE else solid).append(copy)
    if not solid:
        raise SystemExit("No filled shapes found in the SVG.")

    svg = ET.Element(f"{{{SVG}}}svg", {"viewBox": viewbox})
    mask = ET.SubElement(ET.SubElement(svg, f"{{{SVG}}}defs"), f"{{{SVG}}}mask", {"id": "cut"})
    ET.SubElement(mask, f"{{{SVG}}}rect", {"x": str(x), "y": str(y), "width": str(width), "height": str(height), "fill": "#fff"})
    for hole in holes:
        hole.set("fill", "#000")
        mask.append(hole)
    group = ET.SubElement(svg, f"{{{SVG}}}g", {"mask": "url(#cut)", "fill": "#000"})
    group.extend(solid)

    ET.ElementTree(svg).write(OUTPUT, encoding="unicode")
    print(f"Wrote {OUTPUT.relative_to(PROJECT_ROOT)} ({len(solid)} solid, {len(holes)} cut-out shapes)")


if __name__ == "__main__":
    main()
