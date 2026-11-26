#!/usr/bin/env python3
"""Outdoor surface textures for Alienmon (own procedural work, CC0), Nov 26 2026.

The outdoor half of the room kit's look: real-world surface detail for the open maps, drawn from noise here
(no photos, no outside art, nothing copied from any other game). surfaces.js maps them in world space
(triplanar), so they keep a true size on any building, rock or slope.
  ex_adobe   weathered lime plaster over adobe brick: trowel marks, hairline cracks, rain streaks,
             patches where the plaster has fallen off and the mud bricks show (colour + normal)
  ex_rock    layered desert sandstone: strata bands, cross-bedding, cracks and pits (colour + normal)
  ex_block   cut sandstone blocks with chisel marks and chipped arrises, for stairs, arches, piers (colour + normal)
  ex_roof    barrel clay roof tiles in overlapping courses (colour + normal)
  ex_dxstone Dustara's warm pillowed sandstone blocks (its own swatch palette, full detail)
  ex_dxwood  Dustara's sun-dried boards: grain, knots, nail heads
  ex_grit    ground detail: sand grain, pebbles, wind ripples and small cracks, laid over each map's painted
             ground (grey detail + normal)
Run:  python3 rigtools/make_ex_textures.py   (writes sporeholm3d/tex/ex_*.webp)
"""
import os
import sys
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
from make_rk_textures import pnoise, fbm, blur, normal_from_height, hexc, save, OUT  # noqa: E402

RNG = np.random.default_rng(20261126)
N = 1024


def ridged(n, scale, octaves=4, aspect=(1.0, 1.0)):
    """Thin dark crack lines: 1 - |noise|, sharpened."""
    r = 1.0 - np.abs(fbm(n, scale, octaves, aspect, RNG))
    return r


def cracks(n, scale, width=0.035, keep=0.35):
    """A sparse web of hairline cracks (0..1), only where a low-frequency mask lets them through."""
    v = np.abs(fbm(n, scale, 4, rng=RNG))
    line = np.exp(-(v / width) ** 2)
    mask = (fbm(n, scale * 3, 2, rng=RNG) > (1 - 2 * keep)).astype(float)
    return line * blur(mask, 6)


def grade(col, lo, hi):
    return np.clip((col - lo) / (hi - lo), 0, 1)


def adobe():
    n = N
    # plaster: warm cream lime wash, mottled, with soft trowel sweeps (stretched noise at an angle via two aspects)
    cloud = fbm(n, 220, 5)
    sweep = fbm(n, 40, 3, aspect=(0.35, 1.0)) * 0.6 + fbm(n, 40, 3, aspect=(1.0, 0.4)) * 0.4
    fine = fbm(n, 3, 2)
    base = hexc("#efdcb8")
    col = np.ones((n, n, 3)) * base
    col *= (0.93 + 0.07 * cloud)[..., None]
    col *= (0.975 + 0.025 * sweep)[..., None]
    col *= (0.985 + 0.015 * fine)[..., None]
    # rain and dust streaks running down (vertical in the picture: v is up the wall)
    streak = fbm(n, 30, 3, aspect=(0.08, 1.0))
    streak = np.clip(streak, 0, None) * (fbm(n, 260, 2) > 0.1)
    col *= (1 - 0.06 * streak)[..., None]
    # patches of fallen plaster showing mud brick (about 10% of the wall)
    patch = fbm(n, 150, 4)
    hole = grade(patch, 0.95, 1.12)
    holeEdge = np.clip(grade(patch, 0.86, 0.95) - hole, 0, 1)
    # mud bricks: 8 courses x 4 bricks per tile, running bond (all integers so it tiles)
    rows, cols = 16, 6
    yy, xx = np.mgrid[0:n, 0:n]
    bh = n / rows
    r = (yy // bh).astype(int)
    off = (r % 2) * (n / cols / 2)
    bw = n / cols
    c = (((xx + off) % n) // bw).astype(int)
    fy = (yy % bh) / bh
    fx = (((xx + off) % n) % bw) / bw
    mort = np.minimum(np.minimum(fy, 1 - fy) * bh, np.minimum(fx, 1 - fx) * bw)
    mortar = np.exp(-(mort / 3.0) ** 2)
    bvar = RNG.uniform(0.86, 1.08, (rows, cols + 1))
    brick = np.ones((n, n, 3)) * hexc("#a8724a")
    brick *= bvar[r % rows, c % (cols + 1)][..., None]
    brick *= (0.88 + 0.12 * fbm(n, 6, 3))[..., None]
    straw = (np.abs(fbm(n, 2.5, 2, aspect=(0.25, 1.0))) < 0.05) * 0.12
    brick *= (1 + straw)[..., None]
    brick = brick * (1 - mortar[..., None] * 0.35) + hexc("#8a5e40") * mortar[..., None] * 0.35
    col = col * (1 - hole[..., None]) + brick * hole[..., None]
    col *= (1 - 0.18 * holeEdge)[..., None]
    # hairline cracks in the plaster
    cr = cracks(n, 70, 0.03, 0.4) * (1 - hole)
    col *= (1 - 0.2 * cr)[..., None]
    # damp, darker band at the foot of every tile repeat is NOT baked (tiles stack); a faint pitting instead
    pits = blur((RNG.random((n, n)) < 0.002).astype(float), 1) * 5
    col *= (1 - 0.15 * np.clip(pits, 0, 1))[..., None]
    # height: plaster surface undulates; holes step down; bricks bulge; mortar sinks; cracks cut in
    h = 0.6 * cloud * 0.15 + 0.35 * sweep * 0.25 + 0.08 * fine
    h += (1 - hole) * 1.0
    bulge = np.sin(np.pi * np.clip(fy, 0, 1)) * np.sin(np.pi * np.clip(fx, 0, 1))
    h += hole * (0.25 * bulge - 0.25 * mortar)
    h -= 0.35 * cr
    h -= 0.25 * np.clip(pits, 0, 1)
    save("ex_adobe_d", col)
    save("ex_adobe_n", normal_from_height(blur(h, 1), 6.0), 90)


def rock():
    n = N
    yy = np.mgrid[0:n, 0:n][0].astype(float)
    # strata: wobbling horizontal layers of different thickness and hue
    wob = fbm(n, 260, 3) * 9 + fbm(n, 40, 2) * 2.5
    t = (yy + wob) / n
    layers = np.sin(t * np.pi * 2 * 7) * 0.5 + np.sin(t * np.pi * 2 * 19 + 1.3) * 0.3 + np.sin(t * np.pi * 2 * 41 + 0.4) * 0.2
    band = (layers + 1) / 2
    pal = [hexc("#c9744a"), hexc("#d9925e"), hexc("#b25c3c"), hexc("#e2ad78"), hexc("#a85438")]
    k = np.floor(((t * 13) % 1.0) * len(pal)).astype(int) % len(pal)
    col = np.zeros((n, n, 3))
    for i, p in enumerate(pal):
        col[k == i] = p
    for ch in range(3):
        col[..., ch] = blur(col[..., ch], 3)
    col *= (0.9 + 0.1 * band)[..., None]
    cloud = fbm(n, 120, 5)
    col *= (0.9 + 0.1 * cloud)[..., None]
    grain = fbm(n, 2.0, 2)
    col *= (0.9 + 0.1 * grain)[..., None]
    spk = fbm(n, 0.8, 1)
    col *= (0.94 + 0.06 * spk)[..., None]
    # desert varnish: dark streaks hanging down from ledges
    var = np.clip(fbm(n, 24, 3, aspect=(0.06, 1.0)), 0, None) * (fbm(n, 200, 2) > 0.25)
    col *= (1 - 0.22 * var)[..., None]
    # cracks: mostly vertical joints plus some along the bedding
    jv = np.exp(-(np.abs(fbm(n, 80, 4, aspect=(1.0, 0.15))) / 0.03) ** 2) * blur((fbm(n, 220, 2) > 0.0).astype(float), 8)
    jh = np.exp(-(np.abs(np.sin(t * np.pi * 2 * 7)) / 0.04) ** 2) * (fbm(n, 90, 2) > 0.3)
    cr = np.clip(jv + 0.6 * jh, 0, 1)
    col *= (1 - 0.45 * cr)[..., None]
    pits = blur((RNG.random((n, n)) < 0.003).astype(float), 2) * 8
    col *= (1 - 0.2 * np.clip(pits, 0, 1))[..., None]
    h = 0.25 * band + 0.35 * cloud * 0.4 + 0.12 * grain + 0.05 * spk - 0.9 * cr - 0.3 * np.clip(pits, 0, 1)
    # ledges: stepped profile between layers
    h += 0.4 * np.floor(((t * 7) % 1.0) * 3) / 3
    save("ex_rock_d", col)
    save("ex_rock_n", normal_from_height(blur(h, 1), 7.0), 90)


def block():
    n = N
    rows, cols = 4, 2  # a 2 m tile: 0.5 m courses, 1 m long blocks, offset every other course
    yy, xx = np.mgrid[0:n, 0:n].astype(float)
    bh = n / rows
    r = (yy // bh).astype(int)
    off = (r % 2) * (n / cols / 2) + (r % 4 == 3) * (n / cols / 4)
    bw = n / cols
    c = (((xx + off) % n) // bw).astype(int)
    fy = (yy % bh) / bh
    fx = (((xx + off) % n) % bw) / bw
    jit = fbm(n, 12, 3) * 0.012
    d = np.minimum(np.minimum(fy, 1 - fy) * bh / bw, np.minimum(fx, 1 - fx)) + jit
    joint = np.exp(-(np.clip(d, 0, None) / 0.008) ** 2)
    edge = np.clip(1 - d / 0.035, 0, 1)
    bvar = RNG.uniform(0.9, 1.06, (rows, cols + 2))
    col = np.ones((n, n, 3)) * hexc("#ead2a8")
    col *= bvar[r, c % (cols + 2)][..., None]
    cloud = fbm(n, 90, 5)
    col *= (0.965 + 0.035 * cloud)[..., None]
    # chisel marks: fine diagonal tooling inside each block
    tool = np.sin((xx * 0.9 + yy * 0.6 + fbm(n, 10, 2) * 18) * 0.55) * (fbm(n, 60, 2) > -0.2)
    col *= (0.985 + 0.015 * tool)[..., None]
    grain = fbm(n, 2.0, 2)
    col *= (0.93 + 0.07 * grain)[..., None]
    spk = blur((RNG.random((n, n)) < 0.01).astype(float), 1) * 3
    col *= (1 - 0.1 * np.clip(spk, 0, 1))[..., None]
    chip = edge * (fbm(n, 9, 3) > 0.35)
    col *= (1 - 0.12 * chip)[..., None]
    col = col * (1 - joint[..., None] * 0.6) + hexc("#9a7a56") * joint[..., None] * 0.6
    dust = np.clip(fbm(n, 140, 3), 0, None)
    col *= (1 - 0.05 * dust)[..., None]
    h = 1.0 - joint * 1.0 - 0.5 * edge ** 2 - 0.35 * chip + 0.06 * cloud + 0.03 * tool + 0.03 * grain
    save("ex_block_d", col)
    save("ex_block_n", normal_from_height(blur(h, 1), 5.0), 90)


def roof():
    n = N
    cols, rows = 8, 6  # barrel tiles: 8 across, 6 courses per picture
    yy, xx = np.mgrid[0:n, 0:n].astype(float)
    tw, th = n / cols, n / rows
    ci = (xx // tw).astype(int)
    ri = (yy // th).astype(int)
    fx = (xx % tw) / tw
    fy = (yy % th) / th
    prof = np.sin(np.pi * fx)  # the curved barrel
    alt = (ci % 2 == 0)  # caps and pans alternate
    hgt = np.where(alt, prof, 0.35 - 0.3 * prof)
    # each course overlaps the one below: the lower edge of a tile is a little proud and casts a dark lip
    lip = np.exp(-((1 - fy) / 0.06) ** 2)
    hgt = hgt + 0.25 * fy + 0.3 * lip
    tvar = RNG.uniform(0.82, 1.12, (rows, cols))
    hue = RNG.uniform(-1, 1, (rows, cols))
    base = hexc("#d8703e")
    col = np.ones((n, n, 3)) * base
    col *= tvar[ri % rows, ci % cols][..., None]
    col[..., 1] *= (1 + 0.06 * hue[ri % rows, ci % cols])
    col *= np.where(alt, 0.96 + 0.12 * prof, 0.84 + 0.08 * prof)[..., None]
    col *= (1 - 0.35 * np.exp(-(fy / 0.08) ** 2))[..., None]  # shadow under the course above
    cloud = fbm(n, 80, 4)
    col *= (0.9 + 0.1 * cloud)[..., None]
    lich = np.clip(np.clip(fbm(n, 30, 3), 0.9, None) - 0.9, 0, 0.5) * 0.8
    col = col * (1 - lich[..., None]) + hexc("#c8b98a") * lich[..., None]
    grain = fbm(n, 2.0, 2)
    col *= (0.95 + 0.05 * grain)[..., None]
    h = hgt + 0.04 * grain + 0.05 * cloud
    save("ex_roof_d", col)
    save("ex_roof_n", normal_from_height(blur(h, 1), 9.0), 90)


def grit():
    """Grey detail (0.5 = no change) laid over the painted ground, and its normal map. 3 m tile."""
    n = N
    ripple_w = fbm(n, 100, 3) * 30
    yy, xx = np.mgrid[0:n, 0:n].astype(float)
    rip = np.sin((yy * 0.8 + xx * 0.25 + ripple_w) * 2 * np.pi / 46.0)
    rip = rip * np.clip(fbm(n, 200, 2) * 1.5, 0, 1)  # ripples only in patches
    sand = fbm(n, 1.6, 2)
    clump = fbm(n, 12, 3)
    # pebbles: scattered rounded bumps of a few sizes
    peb = np.zeros((n, n))
    for size, prob in ((2, 0.004), (4, 0.0009), (7, 0.00018)):
        seeds = (RNG.random((n, n)) < prob).astype(float)
        peb = np.maximum(peb, np.clip(blur(seeds, size) * (2 * size + 1) ** 2 * 0.6, 0, 1))
    cr = cracks(n, 90, 0.025, 0.25)
    h = 0.35 * rip + 0.25 * sand + 0.3 * clump + 1.2 * peb - 0.6 * cr
    det = 0.5 + 0.10 * clump + 0.06 * sand + 0.16 * peb - 0.22 * cr - 0.04 * rip
    det = np.clip(det, 0, 1)
    rgb = np.stack([det, det, det], -1)
    save("ex_grit_d", rgb, 86)
    save("ex_grit_n", normal_from_height(blur(h, 1), 5.0), 88)


def dxstone():
    """Dustara's warm sandstone walls at full detail: pillowed blocks of mixed lengths in uneven courses, soft rounded arrises,
    wind-pitted faces, mortar joints, sand-scoured lower edges. Palette taken from Dustara's own sandstone swatch. 2 m tile."""
    n = N
    yy, xx = np.mgrid[0:n, 0:n].astype(float)
    hs = [0.22, 0.28, 0.25, 0.25]  # course heights (fraction of the tile)
    edges = np.cumsum([0] + hs) * n
    r = np.clip(np.searchsorted(edges, yy, side="right") - 1, 0, len(hs) - 1)
    y0, y1 = edges[r], edges[r + 1]
    fy = (yy - y0) / (y1 - y0)
    bh = (y1 - y0)
    # each course gets its own run of block lengths
    starts = []
    for k in range(len(hs)):
        xs, x = [], RNG.uniform(0, n * 0.3)
        lens = RNG.uniform(0.18, 0.42, 12) * n
        x = x - n
        while x < 2 * n:
            xs.append(x); x += lens[len(xs) % 12]
        starts.append(np.array(xs))
    fx = np.zeros((n, n)); bw = np.ones((n, n)); bid = np.zeros((n, n), int)
    for k in range(len(hs)):
        rows = r == k
        st = starts[k]
        xi = np.clip(np.searchsorted(st, xx[rows], side="right") - 1, 0, len(st) - 2)
        a, b = st[xi], st[xi + 1]
        fx[rows] = (xx[rows] - a) / (b - a); bw[rows] = b - a; bid[rows] = xi * 7 + k * 101
    jit = fbm(n, 14, 3) * 0.004 + fbm(n, 3, 2) * 0.0015
    dx = np.minimum(fx, 1 - fx) * bw / n
    dy = np.minimum(fy, 1 - fy) * bh / n
    d = np.minimum(dx, dy) + jit  # distance to the nearest joint, in tile units
    joint = np.exp(-(np.clip(d, 0, None) / 0.0075) ** 2)
    pillow = np.clip(d / 0.075, 0, 1) ** 0.55  # rounded block faces
    rng2 = np.random.default_rng(7)
    bvar = rng2.uniform(0.86, 1.08, 4096)[bid % 4096]
    bhue = rng2.uniform(-1, 1, 4096)[bid % 4096]
    lo, mid, hi = hexc("#cc7a36"), hexc("#eea25a"), hexc("#ffc88a")
    cloud = fbm(n, 70, 5)
    t = np.clip(0.55 + 0.35 * cloud + 0.25 * (pillow - 0.7), 0, 1)
    col = np.where(t[..., None] < 0.5, lo + (mid - lo) * (t[..., None] * 2), mid + (hi - mid) * ((t[..., None] - 0.5) * 2))
    col *= bvar[..., None]
    col[..., 1] *= (1 + 0.015 * bhue)
    # wind pits: small dark round holes, more near block edges
    pits = np.zeros((n, n))
    for size, prob in ((1, 0.003), (2, 0.0006), (4, 0.00012)):
        seeds = (RNG.random((n, n)) < prob).astype(float)
        pits = np.maximum(pits, np.clip(blur(seeds, size) * (2 * size + 1) ** 2 * 0.6, 0, 1))
    pits *= (fbm(n, 40, 2) > 0.0)
    grain = fbm(n, 1.6, 2)
    col *= (0.92 + 0.08 * grain)[..., None]
    col *= (1 - 0.35 * pits)[..., None]
    # fine bedding lines inside the blocks
    bed = np.sin((yy + fbm(n, 30, 3) * 40) * 2 * np.pi / 13.0) * (fbm(n, 90, 2) > 0.1)
    col *= (0.985 + 0.015 * bed)[..., None]
    mortar = hexc("#b47a48")
    col = col * (1 - joint[..., None] * 0.7) + mortar * joint[..., None] * 0.7
    col *= (0.86 + 0.14 * pillow)[..., None]  # joints sit in shade
    h = 0.9 * pillow - 0.9 * joint - 0.5 * pits + 0.05 * cloud + 0.04 * grain + 0.02 * bed
    # baked sun from above, like the painted swatch: top edges of each block catch light, bottom edges fall into shade
    hb = blur(h, 3)
    sun = np.roll(hb, 4, axis=0) - np.roll(hb, -4, axis=0)
    col *= np.clip(1 - 0.9 * sun, 0.6, 1.3)[..., None]
    save("ex_dxstone_d", np.clip(col, 0, 1))
    save("ex_dxstone_n", normal_from_height(blur(h, 1), 6.0), 90)


def dxwood():
    """Sun-dried boards for Dustara: vertical planks with long grain, knots, nail heads and split ends. 1.6 m tile."""
    n = N
    yy, xx = np.mgrid[0:n, 0:n].astype(float)
    nb = 6
    pw = n / nb
    pi = (xx // pw).astype(int)
    fx = (xx % pw) / pw
    off = RNG.uniform(0, n, nb)[pi]
    warp = fbm(n, 60, 3, (1.0, 0.15)) * 25
    g = np.sin((xx + warp) * 2 * np.pi / 19.0 + fbm(n, 20, 2, (1.0, 0.1)) * 3)
    grain = 0.5 + 0.5 * g
    streak = fbm(n, 12, 3, (1.0, 0.08))
    lo, hi = hexc("#7e3e14"), hexc("#d48a4e")
    pv = RNG.uniform(0.82, 1.1, nb)[pi]
    t = np.clip(0.5 + 0.25 * streak + 0.18 * grain, 0, 1)
    col = lo + (hi - lo) * t[..., None]
    col *= pv[..., None]
    gap = np.exp(-(np.minimum(fx, 1 - fx) / 0.03) ** 2)
    col *= (1 - 0.7 * gap)[..., None]
    # bleached, dusty top surface
    dust = np.clip(fbm(n, 150, 3), 0, None)
    col = col * (1 - 0.12 * dust[..., None]) + hexc("#e8c49a") * 0.12 * dust[..., None]
    # nails: two per board every ~0.8 m
    nails = np.zeros((n, n))
    for b in range(nb):
        for ny in (0.1, 0.6):
            for nx in (0.3, 0.7):
                cx, cy = (b + nx) * pw, ((ny * n + off[0] * 0) % n)
                nails = np.maximum(nails, np.exp(-(((xx - cx) ** 2 + (yy - cy) ** 2) / 18.0)))
    col = col * (1 - nails[..., None]) + hexc("#4a3a30") * nails[..., None]
    h = 0.35 * grain + 0.25 * streak - 1.0 * gap + 0.4 * nails
    save("ex_dxwood_d", np.clip(col, 0, 1))
    save("ex_dxwood_n", normal_from_height(blur(h, 1), 5.0), 90)


# ------------------------------------------------------------------ Sporeholm (Nov 26): grey detail layers over the painted colours
def _stamp(n, items, draw):
    """Draw shapes onto a wrapping grey canvas (PIL), so the tile repeats seamlessly. Returns a float array 0..1."""
    from PIL import Image as _I, ImageDraw as _D
    im = _I.new("L", (n, n), 0); d = _D.Draw(im)
    for it in items:
        for ox in (-n, 0, n):
            for oy in (-n, 0, n):
                draw(d, it, ox, oy)
    return np.asarray(im, float) / 255.0


def spcap():
    """Mushroom cap skin: soft lumps, a fine felt of speckle, scattered pores and a few shallow dents. 1.6 m tile, grey detail."""
    n = N
    lump = fbm(n, 70, 3)
    felt = fbm(n, 2.5, 2)
    pores = np.clip((pnoise(n, 3.0) - 1.3) * 2.0, 0, 1)
    pores = blur(pores, 1)
    dent = np.clip(-(fbm(n, 30, 2)) - 0.6, 0, 1)
    h = 0.6 * lump + 0.12 * felt - 1.1 * pores - 0.5 * dent
    det = 0.5 + 0.07 * lump + 0.05 * felt - 0.45 * pores - 0.06 * dent
    rgb = np.repeat(np.clip(det, 0, 1)[..., None], 3, -1)
    save("ex_spcap_d", rgb, 86)
    save("ex_spcap_n", normal_from_height(blur(h, 1), 4.0), 88)


def spfibre():
    """Mushroom stalk: long vertical fibres, shallow grooves, a few torn scars. 1.2 m tile, grey detail; fibres run up the image."""
    n = N
    fib = fbm(n, 5, 3, aspect=(1.0, 0.05))
    groove = ridged(n, 26, 3, aspect=(1.0, 0.08))
    groove = np.clip((groove - 0.75) * 4, 0, 1)
    scar = np.clip(fbm(n, 40, 3) - 1.1, 0, 1) * 2
    h = 0.35 * fib - 0.9 * groove - 0.6 * scar
    det = 0.5 + 0.08 * fib - 0.18 * groove - 0.1 * scar
    rgb = np.repeat(np.clip(det, 0, 1)[..., None], 3, -1)
    save("ex_spfibre_d", rgb, 86)
    save("ex_spfibre_n", normal_from_height(blur(h, 1), 5.0), 88)


def spbark():
    """Old bark: deep vertical furrows between corky plates, cross-cracks on the plates. 1.5 m tile, grey detail."""
    n = N
    w = fbm(n, 60, 2) * 18
    yy, xx = np.mgrid[0:n, 0:n].astype(float)
    fur = ridged(n, 40, 4, aspect=(1.0, 0.12))
    fur = np.clip((fur - 0.6) * 2.6, 0, 1)
    plate = fbm(n, 14, 3)
    cross = np.clip((ridged(n, 30, 3, aspect=(0.25, 1.0)) - 0.85) * 5, 0, 1) * (1 - fur)
    h = -1.2 * fur + 0.35 * plate - 0.5 * cross
    det = 0.5 - 0.3 * fur + 0.06 * plate - 0.12 * cross
    rgb = np.repeat(np.clip(det, 0, 1)[..., None], 3, -1)
    save("ex_spbark_d", rgb, 86)
    save("ex_spbark_n", normal_from_height(blur(h, 1), 7.0), 88)


def sploam():
    """Forest floor under the giant mushrooms: fallen leaves and spore flakes, twigs, moss clumps, small stones. 3 m tile, grey detail."""
    n = N
    r = RNG
    leaves = [(r.uniform(0, n), r.uniform(0, n), r.uniform(6, 15), r.uniform(3, 7), r.uniform(0, 3.14), r.uniform(0.35, 0.8)) for _ in range(900)]
    def leaf(d, it, ox, oy):
        x, y, a, b, t, v = it
        ca, sa = np.cos(t), np.sin(t)
        pts = [(x + ox + ca * a * np.cos(k / 8 * 6.283) - sa * b * np.sin(k / 8 * 6.283) * (1 - 0.35 * abs(np.cos(k / 8 * 6.283))),
                y + oy + sa * a * np.cos(k / 8 * 6.283) + ca * b * np.sin(k / 8 * 6.283) * (1 - 0.35 * abs(np.cos(k / 8 * 6.283)))) for k in range(8)]
        d.polygon(pts, fill=int(v * 255))
    lf = _stamp(n, leaves, leaf)
    twigs = [(r.uniform(0, n), r.uniform(0, n), r.uniform(20, 70), r.uniform(0, 3.14), r.integers(1, 3)) for _ in range(90)]
    def twig(d, it, ox, oy):
        x, y, L, t, w = it
        d.line([(x + ox, y + oy), (x + ox + np.cos(t) * L, y + oy + np.sin(t) * L)], fill=255, width=int(w))
    tw = _stamp(n, twigs, twig)
    stones = [(r.uniform(0, n), r.uniform(0, n), r.uniform(3, 9)) for _ in range(160)]
    def stone(d, it, ox, oy):
        x, y, rr = it
        d.ellipse([x + ox - rr, y + oy - rr * 0.8, x + ox + rr, y + oy + rr * 0.8], fill=255)
    st = blur(_stamp(n, stones, stone), 1)
    mossc = np.clip(fbm(n, 50, 3) * 1.4, 0, 1)
    crumb = fbm(n, 2, 2)
    h = 0.5 * lf + 0.6 * tw + 1.0 * st + 0.4 * mossc * fbm(n, 3, 2) + 0.15 * crumb
    det = 0.5 + 0.2 * (lf - 0.25) - 0.08 * blur(lf, 2) * (1 - lf) + 0.1 * tw - 0.05 * mossc + 0.12 * st + 0.05 * crumb
    rgb = np.repeat(np.clip(det, 0, 1)[..., None], 3, -1)
    save("ex_sploam_d", rgb, 86)
    save("ex_sploam_n", normal_from_height(blur(h, 1), 5.0), 88)


def fxsoil():
    """Ferrox ground: packed rusty dirt with gravel, flakes of scrap, bolts and washers, cart ruts and dried cracks. 3 m tile, grey detail."""
    n = N
    r = RNG
    grav = [(r.uniform(0, n), r.uniform(0, n), r.uniform(2, 6)) for _ in range(1400)]
    def pebble(d, it, ox, oy):
        x, y, rr = it
        d.ellipse([x + ox - rr, y + oy - rr * 0.75, x + ox + rr, y + oy + rr * 0.75], fill=int(150 + rr * 15))
    gv = blur(_stamp(n, grav, pebble), 1)
    flakes = [(r.uniform(0, n), r.uniform(0, n), r.uniform(5, 16), r.uniform(3, 8), r.uniform(0, 3.14)) for _ in range(140)]
    def flake(d, it, ox, oy):
        x, y, a, b, t = it
        ca, sa = np.cos(t), np.sin(t)
        pts = [(x + ox + ca * a * u - sa * b * v, y + oy + sa * a * u + ca * b * v) for u, v in ((-1, -1), (1, -0.7), (0.8, 1), (-0.9, 0.8))]
        d.polygon(pts, fill=255)
    fl = _stamp(n, flakes, flake)
    bolts = [(r.uniform(0, n), r.uniform(0, n), r.uniform(3, 6)) for _ in range(70)]
    def bolt(d, it, ox, oy):
        x, y, rr = it
        d.ellipse([x + ox - rr, y + oy - rr, x + ox + rr, y + oy + rr], outline=255, width=2)
        d.ellipse([x + ox - rr * 0.35, y + oy - rr * 0.35, x + ox + rr * 0.35, y + oy + rr * 0.35], fill=200)
    bo = _stamp(n, bolts, bolt)
    ruts = ridged(n, 12, 3, aspect=(1.0, 0.08))
    cr = cracks(n, 9, width=0.02, keep=0.5)
    clump = fbm(n, 4, 3)
    oil = np.clip((fbm(n, 30, 2) - 0.62) * 4, 0, 1)
    h = 0.9 * gv + 0.6 * fl + 0.7 * bo + 0.25 * ruts - 0.5 * cr + 0.35 * clump
    det = 0.5 + 0.14 * (gv - 0.2) + 0.12 * fl - 0.05 * blur(fl, 2) * (1 - fl) + 0.1 * bo - 0.16 * cr + 0.08 * (clump - 0.5) - 0.1 * oil + 0.04 * (ruts - 0.5)
    rgb = np.repeat(np.clip(det, 0, 1)[..., None], 3, -1)
    print("fxsoil mean", round(float(np.clip(det, 0, 1).mean()), 3))
    save("ex_fxsoil_d", rgb, 86)
    save("ex_fxsoil_n", normal_from_height(blur(h, 1), 5.0), 88)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    which = sys.argv[1:] or ["adobe", "rock", "block", "roof", "grit"]
    for w in which:
        globals()[w]()
