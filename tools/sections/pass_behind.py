"""Walk-behind props: small blocked props on outdoor maps (lamp posts, banners, signposts, cacti, planters) become walkable,
and their pixels are cut out into an overlay that the game draws in front of the player when the player is behind them.

A prop is a group of at most MAX_TILES blocked tiles that doesn't touch the map edge and has walkable ground below it.
Tiles with doors, counters, chests, ladders and other interactive objects, warps and knock doors are never touched.
Writes data/sections/pass_behind.json  {section: {"tiles": [[x, y], ...], "pieces": [[x, y0, h, base_y], ...]}}
and art/sections_over/<id>.png (transparent, same size as the game art).   Usage: python tools/sections/pass_behind.py [ids...]
"""
import json, os, sys, glob
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MAX_TILES = 2
# hand-picked slim props inside bigger blocked areas (posts and banners merged into a fountain or a building edge)
MANUAL = {'004': {(9, 6), (8, 5), (13, 7)}}   # a tile in a bigger blocked area counts as a slim prop when less than this share of it differs from the ground
OUTDOOR = {'town', 'route', 'field', 'landmark'}
KEEP = {'bay', 'shop', 'house', 'ladder', 'keeper', 'arena', 'lab', 'chest', 'gate'}
world = json.load(open(os.path.join(ROOT, 'data/world.json'), encoding='utf-8'))['sections']
knock = json.load(open(os.path.join(ROOT, 'data/sections/knock_doors.json'), encoding='utf-8'))
only = set(sys.argv[1:])
os.makedirs(os.path.join(ROOT, 'art/sections_over'), exist_ok=True)
out = {}
for sid, s in sorted(world.items()):
    if s['type'] not in OUTDOOR or (only and sid not in only): continue
    cp = os.path.join(ROOT, 'data/collision', sid + '.json')
    img = glob.glob(os.path.join(ROOT, f"art/sections_game/{s['dir']}/{sid}_*.png"))
    if not os.path.exists(cp) or not img: continue
    rows = json.load(open(cp))['rows']; H, W = len(rows), len(rows[0])
    walk = lambda x, y: 0 <= x < W and 0 <= y < H and rows[y][x] in '.,'
    keep = {tuple(o['tile']) for o in s.get('objects', []) if o.get('k') in KEEP}
    keep |= {tuple(w['tile']) for w in s.get('warps', [])} | {(d[0], d[1]) for d in knock.get(sid, [])}
    a = np.asarray(Image.open(img[0]).convert('RGB')).astype(int)
    blocked = np.array([[c == '#' for c in r] for r in rows])
    lab, n = ndimage.label(blocked)
    over = np.zeros((H * 16, W * 16, 4), np.uint8)
    tiles, pieces = [], []
    groups = []
    for i in range(1, n + 1):
        ys, xs = np.where(lab == i)
        comp = list(zip(xs.tolist(), ys.tolist()))
        if len(ys) <= MAX_TILES and xs.min() > 0 and ys.min() > 0 and xs.max() < W - 1 and ys.max() < H - 1: groups.append(comp)
        elif len(ys) > MAX_TILES: groups += [[t] for t in comp if t in MANUAL.get(sid, ())]
    for comp in groups:
        if any(t in keep for t in comp): continue
        if not all(walk(x, y + 1) or (x, y + 1) in comp for x, y in comp): continue   # ground in front of every prop tile
        ok = True; cols = {}
        for x, y in comp:
            # ground colour: the walkable tiles beside and below this one
            ref = [a[ny * 16:(ny + 1) * 16, nx * 16:(nx + 1) * 16].reshape(-1, 3) for nx, ny in ((x - 1, y), (x + 1, y), (x, y + 1)) if walk(nx, ny)]
            if not ref: ok = False; break
            g = np.median(np.concatenate(ref), 0)
            for ty in range(max(0, y - 2), y + 1):   # the prop tile and up to two tiles above it (tall posts and banners)
                if ty < y and not (walk(x, ty) or (x, ty) in comp): continue
                t = a[ty * 16:(ty + 1) * 16, x * 16:(x + 1) * 16]
                m = np.abs(t - g).sum(2) > 70
                if ty < y:   # above the prop only keep the columns the prop itself occupies
                    base = cols.get(x)
                    if base is None or not base.any(): continue
                    band = ndimage.binary_dilation(base, iterations=2)
                    m &= band[None, :]
                else:
                    cols[x] = m.any(0)
                m = ndimage.binary_opening(m, iterations=1) | (m & ndimage.binary_erosion(m))
                sl = over[ty * 16:(ty + 1) * 16, x * 16:(x + 1) * 16]
                sl[m, :3] = t[m]; sl[m, 3] = 255
        if not ok: continue
        base_y = max(y for _, y in comp)
        for x in sorted({x for x, _ in comp}):
            y0 = max(0, min(y for cx, y in comp if cx == x) - 2)
            pieces.append([x, y0, base_y - y0 + 1, base_y])
        tiles += [list(t) for t in comp]
    if tiles:
        Image.fromarray(over, 'RGBA').save(os.path.join(ROOT, 'art/sections_over', sid + '.png'), optimize=True)
        out[sid] = {'tiles': tiles, 'pieces': pieces}
    elif os.path.exists(os.path.join(ROOT, 'art/sections_over', sid + '.png')):
        os.remove(os.path.join(ROOT, 'art/sections_over', sid + '.png'))
P = os.path.join(ROOT, 'data/sections/pass_behind.json')
if only and os.path.exists(P):
    old = json.load(open(P)); old.update(out); out = old
json.dump(out, open(P, 'w'), separators=(',', ':'))
print(len(out), 'maps,', sum(len(v['tiles']) for v in out.values()), 'prop tiles made walk-behind,')
