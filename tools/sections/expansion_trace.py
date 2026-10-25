"""Collision for the world-expansion areas: hand-traced rows, or colour samples (the kit tracer misreads many of them).

    python tools/sections/expansion_trace.py [ids...]

tools/sections/expansion_samples.json gives per section either "rows" (16 strings of 24: . walk , grass # blocked) or "path" and "grass" sample tiles [[x,y],...] (tiles of plain walkable
ground and of tall grass), optional "thr" (colour distance, default 14) and "frac" (share of a tile's pixels that must match,
default 0.55). A tile is grass if enough of its pixels match the grass colours, else ground if enough match the path colours,
else blocked. Ground cut off from the entrance is blocked. Hand fixes in tools/sections/v3/spec/<id>.json still apply after.
Writes data/collision/<id>.json.
"""
import glob, json, os, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__)); sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'v3'))
from kit_import import apply_spec
from expansion_import import JOIN, OPP, band, reach, carve

S = json.load(open('tools/sections/expansion_samples.json', encoding='utf-8'))


def lab(rgb):
    c = rgb / 255.0
    c = np.where(c > 0.04045, ((c + 0.055) / 1.055) ** 2.4, c / 12.92)
    xyz = c @ np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]]).T / np.array([0.9505, 1.0, 1.089])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def palette(L, tiles, T, k=6):
    """A few representative colours of the sample tiles (k-means), so textured ground matches."""
    px = np.concatenate([L[y * T:(y + 1) * T, x * T:(x + 1) * T].reshape(-1, 3) for x, y in tiles])
    rng = np.random.default_rng(0); C = px[rng.choice(len(px), k, replace=False)]
    for _ in range(12):
        lb = np.argmin(((px[:, None] - C[None]) ** 2).sum(-1), 1)
        C = np.array([px[lb == i].mean(0) if (lb == i).any() else C[i] for i in range(k)])
    return C


def match(L, C, thr):
    return (np.sqrt(((L[..., None, :] - C) ** 2).sum(-1)).min(-1) < thr)


def trace(sid):
    n = int(sid) - 916; f = glob.glob(f'art/raw/expansion/X{n:02d}_*.png')[0]; cfg = S[sid]
    W, H = 24, 16
    if 'rows' in cfg:   # traced by hand from the render on a tile grid
        rows = cfg['rows']; assert len(rows) == H and all(len(r) == W for r in rows), sid
    else:
        im = Image.open(f).convert('RGB'); T = 32
        L = lab(np.asarray(im.resize((W * T, H * T), Image.LANCZOS), float))
        thr, frac = cfg.get('thr', 14), cfg.get('frac', 0.55)
        mp = match(L, palette(L, cfg['path'], T), thr).reshape(H, T, W, T).mean((1, 3))
        mg = match(L, palette(L, cfg['grass'], T), cfg.get('gthr', thr)).reshape(H, T, W, T).mean((1, 3)) if cfg.get('grass') else np.zeros((H, W))
        rows = [''.join(',' if mg[y, x] > cfg.get('gfrac', frac) and mg[y, x] >= mp[y, x] else '.' if mp[y, x] > frac else '#' for x in range(W)) for y in range(H)]
    pid, pside, (a, b) = JOIN[n]; side = cfg.get('side', OPP[pside]); a, b = cfg.get('entrance', (a, b))
    short = []
    if 'rows' not in cfg:   # hand-traced rows already draw the entrance as it is in the art
        g = [list(r) for r in rows]
        for x, y in band(side, a, b, W, H, 1): g[y][x] = '.' if g[y][x] == '#' else g[y][x]
        rows, short = carve([''.join(r) for r in g], side, a, b)
    ent = [t for t in band(side, a, b, W, H, 1) if rows[t[1]][t[0]] != '#']
    if not ent: sys.exit(f'{sid}: no open tile on the {side} edge {a}-{b}')
    rows = apply_spec(rows, sid)
    seen = reach(rows, list(band(side, a, b, W, H, 1)))
    rows = [''.join(c if (x, y) in seen else '#' for x, c in enumerate(r)) for y, r in enumerate(rows)]
    c = json.load(open(f'data/collision/{sid}.json')); c['rows'] = rows; c['traced'] = 'expansion_trace'
    json.dump(c, open(f'data/collision/{sid}.json', 'w'))
    walk = sum(ch != '#' for r in rows for ch in r); grass = sum(ch == ',' for r in rows for ch in r)
    print(sid, c['name'], 'walk', walk, 'grass', grass, ('entrance short ' + str(short)) if short else '')


if __name__ == '__main__':
    for sid in (sys.argv[1:] or sorted(S)): trace(sid)
