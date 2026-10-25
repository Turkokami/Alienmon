"""Find tiles marked as walls ('#') that are painted like the open ground around them (players see a path but get blocked).
For each outdoor map: learn the ground colours from its walkable tiles, then flag blocked tiles touching the walkable area whose
pixels are almost all ground colours and that are not busy (no props, edges or objects drawn on them). Flags spread to blocked
tiles next to flagged ones, so whole blocked-off fields show up.
Usage: python tools/sections/check_blocked_ground.py [--grass] [--fix] [--sheet out.png] [ids...]
  --grass only flags tiles painted like the map's own walkable tall grass (the reliable mode).
  --fix   opens the flagged tiles (grass-coloured ones become ',' tall grass, the rest '.'), keeping warps/objects/NPC tiles blocked.
"""
import json, os, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
W = json.load(open(os.path.join(ROOT, 'data/world.json'), encoding='utf-8'))['sections']
OUTDOOR = {'town', 'route', 'field', 'landmark'}
args = [a for a in sys.argv[1:]]
FIX = '--fix' in args
SHEET = args[args.index('--sheet') + 1] if '--sheet' in args else None
only = {a for a in args if a.isdigit()}
Q = 24   # colour quantisation step

def qcols(px):   # pixels (n,3) -> quantised colour keys
    q = (px // Q).astype(np.int32); return q[:, 0] * 10000 + q[:, 1] * 100 + q[:, 2]

report, fixed = {}, 0
for sid, s in sorted(W.items()):
    if s['type'] not in OUTDOOR or (only and sid not in only): continue
    cp = os.path.join(ROOT, 'data/collision', sid + '.json')
    if not os.path.exists(cp) or not os.path.exists(os.path.join(ROOT, s['img'])): continue
    c = json.load(open(cp)); rows = [list(r) for r in c['rows']]; H, Wd = len(rows), len(rows[0])
    a = np.asarray(Image.open(os.path.join(ROOT, s['img'])).convert('RGB').resize((Wd * 16, H * 16))).astype(np.int32)
    tile = lambda x, y: a[y * 16:(y + 1) * 16, x * 16:(x + 1) * 16].reshape(-1, 3)
    walk = [(x, y) for y in range(H) for x in range(Wd) if rows[y][x] in '.,']
    if len(walk) < 10: continue
    # ground palette: the quantised colours covering 90% of walkable pixels
    keys = np.concatenate([qcols(tile(x, y)) for x, y in walk])
    u, n = np.unique(keys, return_counts=True); order = np.argsort(-n); cum = np.cumsum(n[order]) / n.sum()
    ground = set(u[order[:np.searchsorted(cum, 0.90) + 1]].tolist())
    gp = [qcols(tile(x, y)) for x, y in walk if rows[y][x] == ',']
    if gp:
        gu, gn = np.unique(np.concatenate(gp), return_counts=True); go = np.argsort(-gn); gc = np.cumsum(gn[go]) / gn.sum(); grassk = set(gu[go[:np.searchsorted(gc, 0.90) + 1]].tolist())
    else: grassk = set()
    busy_ref = np.median([tile(x, y).std(axis=0).mean() for x, y in walk])
    fl = os.path.join(ROOT, 'data/sections/fluids', sid + '.json'); F = json.load(open(fl)) if os.path.exists(fl) else {}
    wet = {(x, y) for k in ('water', 'lava') for r in F.get(k, []) for x in range(r[0], r[2] + 1) for y in range(r[1], r[3] + 1)}   # water/lava rectangles stay blocked
    keep = wet | {tuple(w['tile']) for w in s.get('warps', [])} | {tuple(o['tile']) for o in s.get('objects', [])} | {(n['x'], n['y']) for n in s.get('npcs', []) if 'x' in n}
    GRASS = '--grass' in args
    gk = list(grassk)
    def groundlike(x, y):
        if (x, y) in keep or rows[y][x] != '#': return False
        k = qcols(tile(x, y))
        if GRASS:   # only blocked tiles painted like this map's own walkable tall grass
            return len(gk) > 0 and np.isin(k, gk).mean() >= 0.85
        frac = np.isin(k, list(ground)).mean()
        return frac >= 0.93 and tile(x, y).std(axis=0).mean() <= busy_ref * 1.6
    flagged = set(); frontier = [(x, y) for x, y in walk]
    seen = set(frontier)
    while frontier:
        x, y = frontier.pop()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 < nx < Wd - 1 and 0 < ny < H - 1 and (nx, ny) not in seen:
                seen.add((nx, ny))
                if groundlike(nx, ny): flagged.add((nx, ny)); frontier.append((nx, ny))
    if flagged:
        report[sid] = (s['name'], len(flagged), sorted(flagged))
        if FIX:
            for x, y in flagged:
                k = qcols(tile(x, y)); rows[y][x] = ',' if grassk and np.isin(k, list(grassk)).mean() > 0.6 and np.isin(k, list(ground - grassk)).mean() < 0.3 else '.'
            c['rows'] = [''.join(r) for r in rows]; open(cp, 'w').write(json.dumps(c)); fixed += len(flagged)

tot = sum(v[1] for v in report.values())
print(f'{len(report)} maps with blocked ground-like tiles, {tot} tiles' + (f' (opened {fixed})' if FIX else ''))
for sid, (name, k, _) in sorted(report.items(), key=lambda kv: -kv[1][1])[:40]: print(f'{sid} {name}: {k}')
if SHEET:
    from PIL import ImageDraw
    ids = sorted(report, key=lambda i: -report[i][1])[:12]; tiles = []
    for sid in ids:
        s = W[sid]; rows = json.load(open(os.path.join(ROOT, 'data/collision', sid + '.json')))['rows']
        im = Image.open(os.path.join(ROOT, s['img'])).convert('RGBA').resize((len(rows[0]) * 16, len(rows) * 16)); ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
        for y, r in enumerate(rows):
            for x, ch in enumerate(r):
                if ch == '#': d.rectangle([x * 16, y * 16, x * 16 + 15, y * 16 + 15], fill=(255, 0, 0, 60))
        for x, y in report[sid][2]: d.rectangle([x * 16, y * 16, x * 16 + 15, y * 16 + 15], fill=(255, 255, 0, 110), outline=(255, 255, 0, 255))
        im.alpha_composite(ov); d = ImageDraw.Draw(im)
        d.text((3, 3), sid + ' ' + s['name'], fill=(255, 255, 255, 255)); tiles.append(im)
    cols = 3; tw, th = tiles[0].size; sh = Image.new('RGB', (tw * cols, th * ((len(tiles) + cols - 1) // cols)), 'black')
    for i, t in enumerate(tiles): sh.paste(t, ((i % cols) * tw, (i // cols) * th))
    sh.save(SHEET)
