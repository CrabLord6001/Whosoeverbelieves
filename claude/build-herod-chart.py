#!/usr/bin/env python3
"""Build the Herodian family chart as an SVG.

Scope is deliberately small: the Herodians the New Testament names or
describes, plus the three links needed to connect them (Aristobulus IV and
Herod's four significant wives). The sprawling 71-person version lives in
claude/herod-family-chart.html if the full genealogy is ever wanted.

Colors go through CSS variables with fallbacks so the chart follows the
site's light and dark themes; the fallbacks are the dark palette.

    py claude/build-herod-chart.py            # writes herod-family.svg beside it
"""
import html
import os

W = 1740
BOX_W = 210
PILL_W = 180
VGAP = 62          # space between rows, where the connector bar sits
PILL_H = 40

C = {
    "bg": "var(--chart-bg, #0b1628)",
    "box": "var(--chart-box, #16233d)",
    "box_nt": "var(--chart-box-nt, #241f18)",
    "edge": "var(--chart-edge, rgba(255,255,255,.28))",
    "gold": "var(--chart-gold, #d6b25e)",
    "goldtext": "var(--chart-gold-bright, #e8ca84)",
    "text": "var(--chart-text, #f2eee4)",
    "dim": "var(--chart-dim, #cfc7b6)",
    "line": "var(--chart-line, #b8995a)",
}
SERIF = "Cinzel, 'EB Garamond', Georgia, serif"
BODY = "'EB Garamond', 'Cormorant Garamond', Georgia, serif"

# ---------------------------------------------------------------- people
# x is the center of the box. name is a list so line breaks stay deliberate
# rather than depending on how a font happens to measure.
HEROD = dict(x=1080, name=["Herod the Great"], role="King of Judea, 37 to 4 BC",
             ref=["Matthew 2:1\u201319; Luke 1:5"], nt=True)

WIVES = [
    dict(x=590,  name=["Mariamne I"],  note="the Hasmonean"),
    dict(x=880,  name=["Mariamne II"], note="the high priest's daughter"),
    dict(x=1225, name=["Malthace"],    note="a Samaritan"),
    dict(x=1570, name=["Cleopatra"],   note="of Jerusalem"),
]

G2 = [
    dict(x=590,  name=["Aristobulus IV"], role="d. 7 BC", ref=[], nt=False),
    dict(x=880,  name=["Philip"], role="Herodias's first husband",
         ref=["Matthew 14:3; Mark 6:17"], nt=True),
    dict(x=1110, name=["Herod Archelaus"], role="Ethnarch, 4 BC to AD 6",
         ref=["Matthew 2:22"], nt=True),
    dict(x=1340, name=["Herod Antipas"], role="Tetrarch, 4 BC to AD 39",
         ref=["Matthew 14:1\u201312; Mark 6:14\u201329;",
              "Luke 3:1, 19\u201320; 9:7\u20139;",
              "13:31\u201332; 23:7\u201312; Acts 4:27"], nt=True),
    dict(x=1570, name=["Philip the Tetrarch"], role="Tetrarch, 4 BC to AD 34",
         ref=["Luke 3:1"], nt=True),
]

G3 = [
    dict(x=360, name=["Herod Agrippa I"], role="King, AD 37 to 44",
         ref=["Acts 12:1\u201323"], nt=True),
    dict(x=820, name=["Herodias"], role="Wife of Antipas",
         ref=["Matthew 14:3\u201311; Mark 6:17\u201328;", "Luke 3:19"], nt=True),
]

G4 = [
    dict(x=130, name=["Herod Agrippa II"], role="King from AD 50",
         ref=["Acts 25:13 to 26:32"], nt=True),
    dict(x=360, name=["Berenice"], role="Sister of Agrippa II",
         ref=["Acts 25:13, 23; 26:30"], nt=True),
    dict(x=590, name=["Drusilla"], role="Wife of Felix",
         ref=["Acts 24:24"], nt=True),
    dict(x=820, name=["Salome"], role="Herodias's daughter",
         ref=["Matthew 14:6\u201311; Mark 6:22\u201328"], nt=True),
]

# ------------------------------------------------- rows sized to content
def box_h(p):
    """A two-line name needs a taller box, or the reference falls out of it."""
    h = 14 + 20 * len(p["name"]) + 10
    if p.get("role"):
        h += 19
    h += 18 * len(p.get("ref") or [])
    return h


def row_geom(members, top, fixed=None):
    return (top, fixed if fixed else max(box_h(p) for p in members))


Y_HEROD = row_geom([HEROD], 44)
Y_WIFE = (Y_HEROD[0] + Y_HEROD[1] + VGAP, PILL_H)
Y_G2 = row_geom(G2, Y_WIFE[0] + Y_WIFE[1] + VGAP)
Y_G3 = row_geom(G3, Y_G2[0] + Y_G2[1] + VGAP)
Y_G4 = row_geom(G4, Y_G3[0] + Y_G3[1] + VGAP)
H = Y_G4[0] + Y_G4[1] + 110

# parent -> children, by x, for the descent lines
DESCENT = [
    (HEROD["x"], Y_HEROD, [w["x"] for w in WIVES], Y_WIFE),
    (590,  Y_WIFE, [590], Y_G2),
    (880,  Y_WIFE, [880], Y_G2),
    (1225, Y_WIFE, [1110, 1340], Y_G2),
    (1570, Y_WIFE, [1570], Y_G2),
    (590,  Y_G2, [360, 820], Y_G3),
    (360,  Y_G3, [130, 360, 590], Y_G4),
    (820,  Y_G3, [820], Y_G4),
]

out = []
add = out.append


def esc(s):
    return html.escape(s, quote=False)


def box(p, row):
    top, h = row
    x = p["x"] - BOX_W / 2
    nt = p.get("nt")
    stroke = C["gold"] if nt else C["edge"]
    sw = 2 if nt else 1
    fill = C["box_nt"] if nt else C["box"]
    add(f'<rect x="{x:.0f}" y="{top}" width="{BOX_W}" height="{h}" rx="9" '
        f'fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')
    ty = top + 26
    for line in p["name"]:
        add(f'<text x="{p["x"]}" y="{ty}" text-anchor="middle" font-family="{SERIF}" '
            f'font-size="17" font-weight="600" fill="{C["goldtext"] if nt else C["text"]}">'
            f'{esc(line)}</text>')
        ty += 20
    if p.get("role"):
        add(f'<text x="{p["x"]}" y="{ty + 2}" text-anchor="middle" font-family="{BODY}" '
            f'font-size="13.5" fill="{C["dim"]}">{esc(p["role"])}</text>')
        ty += 19
    for line in (p.get("ref") or []):
        add(f'<text x="{p["x"]}" y="{ty + 2}" text-anchor="middle" font-family="{BODY}" '
            f'font-size="13" fill="{C["gold"]}">{esc(line)}</text>')
        ty += 18


def pill(p):
    top, h = Y_WIFE
    x = p["x"] - PILL_W / 2
    add(f'<rect x="{x:.0f}" y="{top}" width="{PILL_W}" height="{h}" rx="20" '
        f'fill="{C["box"]}" stroke="{C["edge"]}" stroke-width="1" stroke-dasharray="4 4"/>')
    add(f'<text x="{p["x"]}" y="{top + 17}" text-anchor="middle" font-family="{SERIF}" '
        f'font-size="14.5" font-weight="600" fill="{C["text"]}">{esc(p["name"][0])}</text>')
    add(f'<text x="{p["x"]}" y="{top + 32}" text-anchor="middle" font-family="{BODY}" '
        f'font-size="12.5" fill="{C["dim"]}">{esc(p["note"])}</text>')


def descent(px, prow, kids, krow):
    """Down from the parent, across a sibling bar, down into each child."""
    ptop, ph = prow
    y0 = ptop + ph
    y1 = krow[0]
    bar = y0 + (y1 - y0) / 2
    d = [f"M{px} {y0}V{bar:.0f}"]
    lo, hi = min(kids + [px]), max(kids + [px])
    if hi - lo > 0.5:
        d.append(f"M{lo} {bar:.0f}H{hi}")
    for kx in kids:
        d.append(f"M{kx} {bar:.0f}V{y1}")
    add(f'<path d="{" ".join(d)}" fill="none" stroke="{C["line"]}" stroke-width="2" '
        f'shape-rendering="crispEdges"/>')


add(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
    f'width="{W}" height="{H}" role="img" '
    f'aria-label="Family chart of the Herodian dynasty, from Herod the Great to Agrippa II">')
add(f'<title>The Herodian Dynasty</title>')
add(f'<rect width="{W}" height="{H}" fill="{C["bg"]}"/>')

add(f'<text x="{W/2}" y="26" text-anchor="middle" font-family="{SERIF}" font-size="11" '
    f'letter-spacing="3" fill="{C["dim"]}">THE HERODIAN DYNASTY</text>')

for d in DESCENT:
    descent(*d)

box(HEROD, Y_HEROD)
for w in WIVES:
    pill(w)
for p in G2:
    box(p, Y_G2)
for p in G3:
    box(p, Y_G3)
for p in G4:
    box(p, Y_G4)

# ------------------------------------------------------------------ key
ky = Y_G4[0] + Y_G4[1] + 48
add(f'<rect x="40" y="{ky - 22}" width="{W - 80}" height="46" rx="8" '
    f'fill="none" stroke="{C["edge"]}" stroke-width="1"/>')
items = [
    ("box_nt", C["gold"], 2, "Named or described in the New Testament"),
    ("box", C["edge"], 1, "Known from Josephus only"),
    ("pill", C["edge"], 1, "A wife of Herod the Great"),
]
kx = 70
for kind, stroke, sw, label in items:
    dash = ' stroke-dasharray="4 4"' if kind == "pill" else ""
    fill = C["box_nt"] if kind == "box_nt" else C["box"]
    rx = 11 if kind == "pill" else 4
    add(f'<rect x="{kx}" y="{ky - 10}" width="34" height="22" rx="{rx}" fill="{fill}" '
        f'stroke="{stroke}" stroke-width="{sw}"{dash}/>')
    add(f'<text x="{kx + 44}" y="{ky + 6}" font-family="{BODY}" font-size="14.5" '
        f'fill="{C["text"]}">{esc(label)}</text>')
    kx += 44 + len(label) * 7.6 + 46

add(f'<text x="{W - 70}" y="{ky + 6}" text-anchor="end" font-family="{BODY}" '
    f'font-size="13" fill="{C["dim"]}">Josephus, Antiquities 17–18; War 1</text>')
add('</svg>')

here = os.path.dirname(os.path.abspath(__file__))
path = os.path.join(here, "herod-family.svg")
with open(path, "w", encoding="utf-8") as f:
    f.write("\n".join(out) + "\n")
print("wrote", path, os.path.getsize(path), "bytes")
