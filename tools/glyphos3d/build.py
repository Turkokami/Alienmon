#!/usr/bin/env python3
"""Builds sporeholm3d/glyphos.js (ASSETS.fn.gmap) from the Neonis map function in sporeholm3d/world.js
plus the Glyphos pieces in this folder. Every replacement must match exactly once, so a change to the
Neonis source shows up here as a clear failure instead of a silently broken Glyphos map.
Run from the repo root:  python3 tools/glyphos3d/build.py"""
import os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
WORLD = os.path.join(ROOT, "sporeholm3d", "world.js")
OUT = os.path.join(ROOT, "sporeholm3d", "glyphos.js")

def piece(name):
    with open(os.path.join(HERE, name), encoding="utf8") as f:
        return f.read()

src = open(WORLD, encoding="utf8").read()
# live world.js has an empty nmap stub just before the real one, so take the last
a = src.rindex(",nmap:function(THREE,H){")
start = a + len(",nmap:function(THREE,H){")
# the Neonis function ends where the next map function (or the object) starts
ends = [i for i in (src.find(",tmap:function(THREE,H){", start), src.find("\n}};", start)) if i > 0]
body = src[start:min(ends)]

def rep(old, new, count=1):
    global body
    n = body.count(old)
    if n != count:
        sys.exit("build.py: expected %d match(es), found %d for: %r" % (count, n, old[:90]))
    body = body.replace(old, new)

def cut(a_mark, b_mark, new=""):
    """replace everything from a_mark up to (not including) b_mark"""
    global body
    i = body.find(a_mark)
    j = body.find(b_mark, i + 1)
    if i < 0 or j < 0 or body.count(a_mark) != 1:
        sys.exit("build.py: section not found: %r .. %r" % (a_mark[:60], b_mark[:60]))
    body = body[:i] + new + body[j:]

# (a) ground palette
cut('  const F = (t, d) => P("NN" + t, d);', "\n// ---- materials (the walk-in builder", piece("gy_ground.js").rstrip("\n"))
# (b) shared walk-in / harbour materials in Glyphos tones
cut("const thTex = {", "// Neonis walk-ins:", piece("gy_thmat.js"))
# (c) Glyphos walk-in styles
rep("SHACK.n_arcade.wide = true; SHACK.n_court.wide = true; SHACK.n_lounge.wide = true; SHACK.n_helix.wide = true;",
    "SHACK.n_arcade.wide = true; SHACK.n_court.wide = true; SHACK.n_lounge.wide = true; SHACK.n_helix.wide = true;\n" + piece("gy_mats.js"))
# (d) accent colours: gold, turquoise, pale gold, jade
rep('const NC = ["#ff3ad0", "#2af0ff", "#ffe23a", "#9a5aff"];', 'const NC = ["#ffcf4a", "#3fe0d0", "#ffe9a0", "#7af0b0"];')
# (e) ground pass: winding links, no city sidewalks
rep("tLinks(o.id); if (o.after) o.after(X, Y); nnWalks(X, Y);", "gyLinks(o.id); if (o.after) o.after(X, Y); if (o.walks) nnWalks(X, Y);")
# (f) build pass: Glyphos door signs and the jungle / ruin dressing instead of city blocks
rep("nnSign(b[0], X + b[1], Y + b[2], b[3], b[4]); }", "gySign(b[0], X + b[1], Y + b[2], b[3], b[4]); }")
rep("if (o.build) o.build(X, Y); nnBlocks(X, Y, o); nnDress(X, Y, o); if (o.wild) nnWildDetail(X, Y, o); else nnDetail(X, Y, o); };", "if (o.build) o.build(X, Y); gyBuild(X, Y, o); };")
# (g) links are pushed by the Glyphos scenes
i = body.index("const TLINK = [")
j = body.index("]];", i) + 3
body = body[:i] + "const TLINK = [];" + body[j:]
# (h) and (i) drop the Neonis scenes, Mount Lumen, the parks and districts
cut("// ================= NEONIS SCENES =================", "// ================= NEONIS EXPANSION")
cut("// ================= MOUNT LUMEN", "// ================= WILD DETAIL PASS")
# (i2) live maps-v2: drop the Neonis story places and their detail pass (pocket scenes reached only from Neonis doors)
cut("// ================= NEONIS STORY PLACES", "// small helpers for the new scenes", "const NNSTORY = [];\n")
# (j) the Glyphos kit, jungle and scenes go in just before the assembly
rep("// ================= assemble =================",
    piece("gy_kit.js") + "\n" + piece("gy_jungle.js") + "\n" + piece("gy_scenes.js") + "\n" + piece("gy_places.js") + "\n" + piece("gy_detail.js") + "\n// ================= assemble =================")
# (j1) the lagoon: the shared canal water in the calm green of a glassy sea instead of the Neonis blue
rep('"#0e7fa0"', '"#127a6a"'); rep('"#5ee6dc"', '"#7ee0b4"'); rep('e: "#0a3a4a"', 'e: "#0a4a3a"')
# (j2) interiors: a room may set its own wall height; sandstone rooms get sandstone ribs or none; a place flushes its merged furniture batches
rep("h = S.flat ? S.wallH : S.wallH * (0.85 + R() * 0.3);", "h = P.wallH || (S.flat ? S.wallH : S.wallH * (0.85 + R() * 0.3));")
rep("const ribM = S.fxWall ? FXA.frame() :", "const ribM = S.ribM ? FXA[S.ribM]() : S.fxWall ? FXA.frame() :")
rep('if ((x + y) % 4 === 0 && P.style !== "bunker") limb(', 'if ((x + y) % 4 === 0 && P.style !== "bunker" && !S.noRib) limb(')
rep("const placeWorld = (id) => { const { P, g } = buildPlace(id); if (H && H.windify) {} buildAll(); buildFlora();", "const placeWorld = (id) => { const { P, g } = buildPlace(id); if (H && H.windify) {} buildAll(); buildFlora(); nnDetailFlush();")
# (k) spawn scene and the land beyond
rep('const want = (H && H.scene) || "NA"', 'const want = (H && H.scene) || "YL"')
rep("nnOuter(ORECT.map((id) => SCN[id].rect));", "gyOuter(ORECT.map((id) => SCN[id].rect));")
# (k2) small glow beads use the light ico shape, not the 168-vertex sphere
rep('const nnSp = (bin, O, x, y, z, r, col, gk = "sph") =>', 'const nnSp = (bin, O, x, y, z, r, col, gk = bin === "glow" ? "ico0" : "sph") =>')
# (l) the merged detail batches get one mesh per bin, each with its own material; the leaf bin stays the shared Neonis leaf-card batch;
#     stone, carving, bark and lit are solid
# (live maps-v2, Nov 28: the Neonis flush now also has wood, metal, chrome and fabric bins, with UVs for wood and fabric)
rep('for (const bin of ["lit", "deco", "glow", "leaf", "wood", "metal", "chrome", "fabric"]) { const isL = bin === "leaf",', "for (const bin of Object.keys(NND)) { const isL = bin === \"leaf\",")
rep('const mat = isL ? nnXLeafM() : bin === "glow" ?', "const mat = isL ? nnXLeafM() : GYBIN[bin] ? GYBIN[bin]() : bin === \"glow\" ?")
rep('const m = add(g, mat, [0, 0, 0], [0, 0, 0], bin === "lit" || bin === "wood" || bin === "metal" ? null : "nocol"); m.userData.noLift = true; m.castShadow = bin !== "glow" && bin !== "deco" && bin !== "chrome";',
    'const m = add(g, mat, [0, 0, 0], [0, 0, 0], GYSOLID[bin] || bin === "wood" || bin === "metal" ? null : "nocol"); m.userData.noLift = true; m.castShadow = bin !== "glow" && bin !== "deco" && bin !== "chrome";')

out = "ASSETS.fn.gmap=function(THREE,H){\n// Glyphos (planet 06): generated by tools/glyphos3d/build.py from the Neonis map kit in world.js; edit the pieces in tools/glyphos3d, not this file\n" + body + "\n};\n"
open(OUT, "w", encoding="utf8").write(out)
print("wrote", OUT, len(out), "bytes")
