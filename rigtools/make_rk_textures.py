#!/usr/bin/env python3
"""Room kit textures for Alienmon (own procedural work, CC0).

Makes the tileable surfaces the room kit (sporeholm3d/roomkit.js) uses for upgraded interiors and the plaza:
  rk_plank   honey wood floor boards (colour + normal)
  rk_tile    hand-made terracotta floor tiles with grout (colour + normal)
  rk_plaster warm limewash plaster (colour + normal)
  rk_pave    sandstone flagstone paving for town squares (colour + normal)
  rk_rug1/2  two woven rugs with original desert-star patterns (colour)
  rk_stone   pale honed limestone slabs for clinic and shop floors (colour + normal)
  rk_view    a painted Dustara canyon view seen through windows (colour)
Everything is drawn from noise here; no photos or outside art are used.
Run:  python3 rigtools/make_rk_textures.py   (writes sporeholm3d/tex/rk_*.webp)
"""
import os
import numpy as np
from PIL import Image

OUT = os.path.join(os.path.dirname(__file__), "..", "sporeholm3d", "tex")
RNG = np.random.default_rng(20261125)
N = 1024


def pnoise(n, scale, rng=RNG, aspect=(1.0, 1.0)):
    """Tileable smooth noise: random field filtered in Fourier space. scale ~ feature size in pixels."""
    f = rng.standard_normal((n, n))
    F = np.fft.fft2(f)
    ky = np.fft.fftfreq(n)[:, None] * aspect[0]
    kx = np.fft.fftfreq(n)[None, :] * aspect[1]
    k = np.sqrt(kx ** 2 + ky ** 2)
    filt = np.exp(-(k * scale) ** 2 * 2.0)
    r = np.real(np.fft.ifft2(F * filt))
    r -= r.mean()
    r /= (r.std() + 1e-9)
    return r


def fbm(n, base, octaves=5, aspect=(1.0, 1.0), rng=RNG):
    out = np.zeros((n, n))
    amp, sc, tot = 1.0, base, 0.0
    for _ in range(octaves):
        out += amp * pnoise(n, sc, rng, aspect)
        tot += amp
        amp *= 0.5
        sc /= 2.0
    return out / tot


def blur(a, r):
    """Wrapping box blur (3 passes ~ gaussian)."""
    for _ in range(3):
        acc = np.zeros_like(a)
        for d in range(-r, r + 1):
            acc += np.roll(a, d, axis=1)
        a = acc / (2 * r + 1)
        acc = np.zeros_like(a)
        for d in range(-r, r + 1):
            acc += np.roll(a, d, axis=0)
        a = acc / (2 * r + 1)
    return a


def normal_from_height(h, strength):
    dx = (np.roll(h, -1, axis=1) - np.roll(h, 1, axis=1)) * 0.5 * strength
    dy = (np.roll(h, -1, axis=0) - np.roll(h, 1, axis=0)) * 0.5 * strength
    nx, ny, nz = -dx, dy, np.ones_like(h)
    L = np.sqrt(nx ** 2 + ny ** 2 + nz ** 2)
    n = np.stack([nx / L, ny / L, nz / L], -1)
    return ((n * 0.5 + 0.5) * 255).clip(0, 255).astype(np.uint8)


def hexc(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], float) / 255.0


def save(name, arr, q=88):
    a = arr if arr.dtype == np.uint8 else (np.clip(arr, 0, 1) * 255 + 0.5).astype(np.uint8)
    Image.fromarray(a).save(os.path.join(OUT, name + ".webp"), "WEBP", quality=q, method=6)
    print("wrote", name, a.shape)


def lerp3(a, b, t):
    return a[None, None, :] * (1 - t[..., None]) + b[None, None, :] * t[..., None]


# ------------------------------------------------------------------ wood planks
def planks():
    n = N
    cols = 8  # boards across the tile (tile = 1.6 m in game -> 20 cm boards)
    bw = n // cols
    yy, xx = np.mgrid[0:n, 0:n].astype(float)
    board_id = np.zeros((n, n), int)
    edge = np.zeros((n, n))
    local_u = np.zeros((n, n))
    local_v = np.zeros((n, n))
    for c in range(cols):
        # staggered board ends down this column, wrapping
        y = RNG.integers(0, n)
        ends = []
        while len(ends) == 0 or (ends[-1] - ends[0]) < n:
            ends.append(y)
            y += int(RNG.integers(n // 3, int(n * 0.75)))
        x0, x1 = c * bw, (c + 1) * bw
        for k in range(len(ends) - 1):
            a, b = ends[k], ends[k + 1]
            rows = np.arange(a, b) % n
            bid = c * 100 + k
            board_id[rows[:, None], np.arange(x0, x1)[None, :]] = bid
            local_v[rows[:, None], np.arange(x0, x1)[None, :]] = (np.arange(a, b) - a)[:, None] / max(1, b - a)
            # end grooves
            for e in (a, b - 1):
                edge[(e % n), x0:x1] = 1
        local_u[:, x0:x1] = (np.arange(x0, x1) - x0)[None, :] / bw
        edge[:, x0] = 1
    # grain: long streaks along v, rings by warped stripes
    g1 = fbm(n, 40, 4, aspect=(10.0, 1.0))
    g2 = fbm(n, 6, 3, aspect=(14.0, 1.0))
    uniq = np.unique(board_id)
    tint = {b: RNG.uniform(-1, 1, 3) for b in uniq}
    phase = {b: RNG.uniform(0, 50) for b in uniq}
    T = np.zeros((n, n, 3))
    P = np.zeros((n, n))
    for b in uniq:
        m = board_id == b
        T[m] = tint[b]
        P[m] = phase[b]
    rings = np.sin((xx * 0.16 + g1 * 4.0 + P) * 2.0 + g2 * 1.2)
    grain = 0.5 + 0.5 * rings
    light, dark = hexc("#d8a46a"), hexc("#8a5530")
    col = lerp3(light, dark, (0.28 + 0.34 * grain ** 1.6 * (0.6 + 0.4 * (g2 * 0.5 + 0.5))).clip(0, 1))
    col *= (1 + T * np.array([0.03, 0.025, 0.02]) + T[..., :1] * 0.06)
    col *= (0.92 + 0.1 * (fbm(n, 120, 3) * 0.5 + 0.5))[..., None]
    # knots
    for _ in range(14):
        cx, cy = RNG.integers(0, n, 2)
        r = RNG.uniform(5, 11)
        d = np.sqrt(((xx - cx + n / 2) % n - n / 2) ** 2 + (((yy - cy + n / 2) % n - n / 2) * 0.55) ** 2)
        k = np.exp(-(d / r) ** 2)
        col *= (1 - 0.45 * k)[..., None]
    # gaps and worn bevel near edges
    e = blur(edge, 1)
    e = (e / (e.max() + 1e-9)).clip(0, 1)
    col *= (1 - 0.75 * e)[..., None]
    wear = fbm(n, 30, 3) * 0.5 + 0.5
    col = col * (0.95 + 0.08 * wear[..., None])
    h = 0.6 * grain * 0.15 - e * 2.2 + 0.05 * g2
    save("rk_plank_d", col)
    save("rk_plank_n", normal_from_height(blur(h, 1), 6.0), 92)


# ------------------------------------------------------------------ terracotta tiles
def tiles():
    n = N
    k = 6  # tiles across (tile = 2 m -> 33 cm tiles)
    s = n / k
    yy, xx = np.mgrid[0:n, 0:n].astype(float)
    ti, tj = (xx // s).astype(int), (yy // s).astype(int)
    u, v = (xx % s) / s, (yy % s) / s
    # hand-made: each tile's edges wobble
    wob = fbm(n, 18, 3) * 0.018
    du = np.minimum(u, 1 - u) + wob
    dv = np.minimum(v, 1 - v) - wob
    dmin = np.minimum(du, dv)
    grout = (dmin < 0.022).astype(float)
    groutS = blur(grout, 1)
    base = [hexc("#c2683e"), hexc("#b0573a"), hexc("#cc7a48"), hexc("#a8502e"), hexc("#c87048")]
    idx = (ti * 7 + tj * 13 + (ti * tj) % 5) % len(base)
    col = np.zeros((n, n, 3))
    for i, c in enumerate(base):
        col[idx == i] = c
    # per-tile shading, clouds, speckle, darker fired rims
    tvar = RNG.uniform(0.9, 1.08, (k, k))
    col *= tvar[tj % k, ti % k][..., None]
    cloud = fbm(n, 70, 4)
    col *= (0.9 + 0.12 * cloud)[..., None]
    rim = np.exp(-(dmin / 0.08) ** 2)
    col *= (1 - 0.18 * rim)[..., None]
    sp = (RNG.random((n, n)) < 0.012).astype(float)
    sp = blur(sp, 1) * 6
    col *= (1 - 0.35 * sp.clip(0, 1))[..., None]
    worn = (fbm(n, 40, 3) > 0.9).astype(float)
    col = col * (1 - 0.15 * blur(worn, 2)[..., None]) + hexc("#e8b48a")[None, None, :] * 0.15 * blur(worn, 2)[..., None]
    gc = hexc("#cdbca2") * (0.85 + 0.15 * (fbm(n, 8, 2) * 0.5 + 0.5))[..., None]
    col = col * (1 - groutS[..., None]) + gc * groutS[..., None]
    h = (1 - groutS) * 1.0 + 0.04 * cloud - 0.2 * rim
    save("rk_tile_d", col)
    save("rk_tile_n", normal_from_height(blur(h, 1), 5.0), 92)


# ------------------------------------------------------------------ limewash plaster
def plaster():
    n = N
    low = fbm(n, 220, 4)
    mid = fbm(n, 40, 4)
    strokes = fbm(n, 30, 3, aspect=(1.0, 4.0))
    fine = fbm(n, 3, 2)
    t = (0.62 + 0.14 * low + 0.07 * strokes + 0.03 * fine).clip(0, 1)
    col = lerp3(hexc("#e6cfa8"), hexc("#fbf0da"), t)
    col *= (0.975 + 0.03 * mid)[..., None]
    h = 0.5 * strokes + 0.25 * mid + 0.15 * fine
    save("rk_plaster_d", col)
    save("rk_plaster_n", normal_from_height(blur(h, 1), 2.2), 92)


# ------------------------------------------------------------------ sandstone flagstones (town square)
def pave():
    n = N
    yy, xx = np.mgrid[0:n, 0:n].astype(float)
    # irregular flagstones: wrapped voronoi
    pts = RNG.random((26, 2)) * n
    best = np.full((n, n), 1e9)
    second = np.full((n, n), 1e9)
    owner = np.zeros((n, n), int)
    for i, (px, py) in enumerate(pts):
        dx = np.abs(xx - px)
        dx = np.minimum(dx, n - dx)
        dy = np.abs(yy - py)
        dy = np.minimum(dy, n - dy)
        d = np.sqrt(dx * dx + dy * dy)
        nb = d < best
        second = np.where(nb, best, np.minimum(second, d))
        owner = np.where(nb, i, owner)
        best = np.where(nb, d, best)
    gap = second - best
    joint = (gap < 6 + 1.2 * fbm(n, 10, 2)).astype(float)
    js = blur(joint, 1)
    pal = [hexc("#d8b88a"), hexc("#ccaa7a"), hexc("#e2c49a"), hexc("#c49c6c"), hexc("#d4ae80")]
    col = np.zeros((n, n, 3))
    for i in range(len(pts)):
        col[owner == i] = pal[i % len(pal)] * RNG.uniform(0.92, 1.06)
    strata = np.sin(yy * 0.05 + fbm(n, 80, 3) * 3.0)
    col *= (0.93 + 0.05 * strata + 0.06 * fbm(n, 50, 4))[..., None]
    edge = np.exp(-(gap / 18) ** 2)
    col *= (1 - 0.12 * edge)[..., None]
    gc = hexc("#8a7256")
    col = col * (1 - js[..., None]) + gc * js[..., None]
    h = (1 - js) + 0.08 * strata + 0.06 * fbm(n, 12, 3) - 0.25 * edge
    save("rk_pave_d", col)
    save("rk_pave_n", normal_from_height(blur(h, 1), 5.0), 92)


# ------------------------------------------------------------------ rugs (original desert-star weave)
def rug(name, field, border, accent, light):
    w, hgt = 512, 768
    yy, xx = np.mgrid[0:hgt, 0:w].astype(float)
    u, v = xx / w, yy / hgt
    F, B, A, L = hexc(field), hexc(border), hexc(accent), hexc(light)
    col = np.zeros((hgt, w, 3)) + F
    bx = np.minimum(u, 1 - u) * w
    by = np.minimum(v, 1 - v) * hgt
    bd = np.minimum(bx, by)
    col[bd < 70] = B
    col[(bd >= 18) & (bd < 26)] = L
    col[(bd >= 56) & (bd < 62)] = A
    # stepped triangles along the border
    tooth = ((np.where(bx < by, yy, xx) % 36) < 18)
    band = (bd >= 30) & (bd < 50)
    col[band & tooth] = A
    # field: stepped diamond lattice and a central star medallion
    cu, cv = (u - 0.5) * w, (v - 0.5) * hgt
    lat = (np.abs((cu % 96) - 48) + np.abs((cv % 96) - 48))
    inner = bd >= 70
    col[inner & (np.floor(lat / 8) % 4 == 0)] = L * 0.9 + F * 0.1
    med = np.abs(cu) + np.abs(cv) * 0.75
    star = np.abs(cu) * np.abs(cv) < 900
    col[inner & (med < 150)] = B
    col[inner & (med < 128) & (np.floor(med / 10) % 2 == 0)] = A
    col[inner & (med < 60)] = L
    col[inner & (med < 40) & star] = A
    # weave texture and wear
    weave = 0.92 + 0.08 * ((np.floor(xx / 2) + np.floor(yy / 2)) % 2)
    wear = 1.0
    nz = RNG.standard_normal((hgt, w)) * 0.03
    col = col * (weave + nz)[..., None] * wear
    img = (np.clip(col, 0, 1) * 255).astype(np.uint8)
    save(name, img)


# ------------------------------------------------------------------ the canyon view through windows
def view():
    w, hgt = 1024, 512
    yy, xx = np.mgrid[0:hgt, 0:w].astype(float)
    v = yy / hgt
    sky = lerp3(hexc("#6fb4e6"), hexc("#ffe2b4"), (v / 0.62).clip(0, 1) ** 1.4)
    sun = np.exp(-(((xx - 760) / 140) ** 2 + ((yy - 150) / 110) ** 2))
    col = sky + hexc("#fff0d0")[None, None, :] * sun[..., None] * 0.45
    # thin clouds
    cl = fbm(1024, 40, 4, aspect=(1.0, 5.0))[:hgt]
    col = col * (1 - 0.18 * (cl > 0.6)[..., None] * (v < 0.45)[..., None]) + 0.18 * (cl > 0.6)[..., None] * (v < 0.45)[..., None]
    # layered mesas: far (hazy lilac), mid (rose), near (rust), each a flat-topped silhouette
    def ridge(base, amp, freq, seed, flat):
        r = np.random.default_rng(seed)
        x = np.arange(w)
        y = np.zeros(w) + base
        for k in range(1, 6):
            y += amp / k * np.sin(x / w * np.pi * 2 * freq * k + r.uniform(0, 6.28))
        # mesa tops: quantise heights
        y = np.round(y / flat) * flat
        y = np.convolve(np.pad(y, 6, mode="wrap"), np.ones(13) / 13, mode="same")[6:-6]
        return y
    layers = [(300, 26, 1.0, 11, 18, "#c9a4b8", 0.55), (338, 30, 1.6, 23, 14, "#d9876a", 0.75), (382, 22, 2.3, 37, 10, "#b25a3a", 0.92)]
    for base, amp, fr, sd, fl, c, k in layers:
        top = ridge(base, amp, fr, sd, fl)
        m = yy >= top[None, :]
        shade = (0.86 + 0.14 * np.sin(xx * 0.03 + yy * 0.05)) * (1 - 0.2 * ((yy - top[None, :]) / 120).clip(0, 1))
        cc = hexc(c)[None, None, :] * shade[..., None]
        haze = 1 - k
        cc = cc * (1 - haze) + col * haze
        col = np.where(m[..., None], cc, col)
        # sunlit rim on each mesa top
        rim = (yy >= top[None, :]) & (yy < top[None, :] + 3)
        col = np.where(rim[..., None], col * 0.6 + hexc("#ffd8a0") * 0.4, col)
    # a few tall hoodoo spires on the middle layer
    r = np.random.default_rng(5)
    for _ in range(6):
        x0 = r.uniform(40, w - 40)
        top = r.uniform(230, 300)
        wd = r.uniform(7, 14)
        # a tapering rock spire with a wider cap stone, lit on the sun side
        t = ((yy - top) / (400 - top)).clip(0, 1)
        half = wd * (0.55 + 0.6 * t) + 4 * np.exp(-((yy - top - 6) / 5) ** 2)
        m = (np.abs(xx - x0) < half) & (yy > top) & (yy < 400)
        lit = (xx > x0).astype(float)
        cc = hexc("#c7735a")[None, None, :] * (0.82 + 0.22 * lit)[..., None] * (0.92 + 0.08 * fbm(1024, 6, 2)[:hgt])[..., None]
        col = np.where(m[..., None], cc * 0.8 + col * 0.2, col)
    # desert floor
    fl = yy > 430
    col = np.where(fl[..., None], lerp3(hexc("#e0b07a"), hexc("#c88a56"), ((yy - 430) / 82).clip(0, 1)) * (0.95 + 0.05 * fbm(1024, 20, 3)[:hgt])[..., None], col)
    save("rk_view_d", col, 85)


# ------------------------------------------------------------------ honed limestone (clinic and shop floors)
def stone():
    n = N
    k = 4  # tiles across (tile = 2 m -> 50 cm slabs)
    s = n / k
    yy, xx = np.mgrid[0:n, 0:n].astype(float)
    ti, tj = (xx // s).astype(int), (yy // s).astype(int)
    u, v = (xx % s) / s, (yy % s) / s
    dmin = np.minimum(np.minimum(u, 1 - u), np.minimum(v, 1 - v))
    groutS = blur((dmin < 0.008).astype(float), 1)
    base = [hexc("#e6dccb"), hexc("#ddd1bd"), hexc("#ebe3d4"), hexc("#d8ccb6")]
    idx = (ti * 3 + tj * 5 + (ti * tj) % 3) % len(base)
    col = np.zeros((n, n, 3))
    for i, c in enumerate(base):
        col[idx == i] = c
    tvar = RNG.uniform(0.95, 1.04, (k, k))
    col *= tvar[tj % k, ti % k][..., None]
    cloud = fbm(n, 90, 5)
    col *= (0.95 + 0.05 * cloud)[..., None]
    vein = np.abs(fbm(n, 60, 4, aspect=(1.0, 0.35)))
    vmask = np.exp(-(vein / 0.06) ** 2) * (fbm(n, 120, 2) > 0.2)
    col = col * (1 - 0.12 * vmask[..., None]) + hexc("#b8a88e")[None, None, :] * 0.12 * vmask[..., None]
    sp = blur((RNG.random((n, n)) < 0.004).astype(float), 1) * 4
    col *= (1 - 0.18 * sp.clip(0, 1))[..., None]
    gc = hexc("#c8bca8")
    col = col * (1 - groutS[..., None]) + gc[None, None, :] * groutS[..., None]
    h = (1 - groutS) * 1.0 + 0.02 * cloud
    save("rk_stone_d", col)
    save("rk_stone_n", normal_from_height(blur(h, 1), 3.0), 92)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    planks()
    tiles()
    plaster()
    pave()
    rug("rk_rug1_d", "#1f6f72", "#a8442a", "#e8b84a", "#f2e2c4")
    rug("rk_rug2_d", "#2c3a6e", "#c8803a", "#d84a3a", "#efe0c0")
    view()
    stone()
