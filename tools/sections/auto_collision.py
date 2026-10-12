"""First-pass collision for each section, 16 px per tile -> data/collision/<id>.json (hand-correct afterwards).

Rows are strings, one char per tile:  '.' walkable   '#' blocked   ',' tall grass (walkable, wild encounters)
Method: every exit, door, doormat and spawn tile from data/world.json is known ground. Starting from those seeds the
walkable area grows tile by tile into neighbours whose colour and texture match ground already reached (paths,
floors, sand). Dark void around interiors and tiles far from every seed colour stay blocked. Grass is ground whose
colour matches the section's grass sample (if any) rather than its path.

A file whose "edited" flag is true is never overwritten (pass --force to regenerate it anyway).
Usage: python tools/sections/auto_collision.py [ids or planet prefixes...] [--force]
"""
import json, os, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
world = json.load(open(os.path.join(ROOT, 'data/world.json'), encoding='utf-8'))['sections']
args = [a for a in sys.argv[1:] if not a.startswith('--')]
force = '--force' in sys.argv


def lab(rgb):
    """Rough perceptual colour (CIE Lab) for a (...,3) array of 0-255 RGB."""
    c = rgb / 255.0
    c = np.where(c > 0.04045, ((c + 0.055) / 1.055) ** 2.4, c / 12.92)
    xyz = c @ np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]]).T
    xyz /= np.array([0.9505, 1.0, 1.089])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def tiles(img):
    a = np.asarray(img.convert('RGB'), float)
    H, W = a.shape[0] // 16, a.shape[1] // 16
    t = a[:H * 16, :W * 16].reshape(H, 16, W, 16, 3).transpose(0, 2, 1, 3, 4).reshape(H, W, 256, 3)
    L = lab(t)
    mean = L.mean(2)
    # texture: mean distance of each pixel from the tile mean (objects and edges are busy, ground is calm)
    tex = np.linalg.norm(L - mean[:, :, None, :], axis=-1).mean(2)
    return mean, tex, H, W


def build(sid):
    sec = world[sid]
    mean, tex, H, W = tiles(Image.open(os.path.join(ROOT, sec['img'])))
    seeds = set()
    for w in sec['warps']:
        seeds.add(tuple(w['at']))
        if sec['type'] in ('interior',):
            seeds.add(tuple(w['tile']))
    for e, c in sec['edges'].items():
        r = range(c['range'][0], c['range'][1] + 1)
        for k in r:
            for d in range(3):   # the exit path runs a few tiles in from the edge
                seeds.add({'left': (d, k), 'right': (W - 1 - d, k), 'top': (k, d), 'bottom': (k, H - 1 - d)}[e])
    for s in sec['spawns'].values():
        if s:
            seeds.add(tuple(s))
    seeds = {(x, y) for x, y in seeds if 0 <= x < W and 0 <= y < H}
    pal = np.array([mean[y, x] for x, y in seeds])
    tex_cap = max(np.percentile([tex[y, x] for x, y in seeds], 75) * 1.6, 9)
    dark = mean[..., 0] < 8   # void around rooms
    near_pal = np.min(np.linalg.norm(mean[:, :, None, :] - pal[None, None], axis=-1), axis=2)
    ok = (~dark) & (tex < tex_cap) & (near_pal < 22)
    walk = np.zeros((H, W), bool)
    stack = list(seeds)
    for x, y in seeds:
        walk[y, x] = True
    while stack:
        x, y = stack.pop()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < W and 0 <= ny < H and not walk[ny, nx] and ok[ny, nx] \
                    and np.linalg.norm(mean[ny, nx] - mean[y, x]) < 18:
                walk[ny, nx] = True
                stack.append((nx, ny))
    # doors and warps are always passable, and so is the tile you step out onto
    for w in sec['warps']:
        for x, y in (w['tile'], w['at']):
            if 0 <= x < W and 0 <= y < H:
                walk[y, x] = True
    rows = [''.join('.' if walk[y, x] else '#' for x in range(W)) for y in range(H)]
    return rows


todo = [k for k in world if not args or any(k == a or world[k]['dir'].startswith(a) for a in args)]
os.makedirs(os.path.join(ROOT, 'data/collision'), exist_ok=True)
for sid in todo:
    p = os.path.join(ROOT, 'data/collision', sid + '.json')
    if os.path.exists(p) and json.load(open(p)).get('edited') and not force:
        print(sid, 'hand-edited, kept')
        continue
    rows = build(sid)
    json.dump({'id': sid, 'name': world[sid]['name'], 'tiles': world[sid]['tiles'], 'edited': False,
               'legend': {'.': 'walk', '#': 'blocked', ',': 'tall grass'}, 'rows': rows}, open(p, 'w'), indent=1)
    print(sid, world[sid]['name'], f"{sum(r.count('.') + r.count(',') for r in rows)} walkable tiles")
