"""Check section collision against data/world.json: every exit, warp and spawn must be walkable and all of them
must be reachable from one another (one connected walkable area per section, through 4-way steps).
Prints one line per section; exit code 1 if any section fails.
Usage: python tools/sections/check_sections.py [ids or planet prefixes...]
"""
import json, os, sys
from collections import deque

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
WP = sys.argv[sys.argv.index('--world') + 1] if '--world' in sys.argv else 'data/world.json'
world = json.load(open(os.path.join(ROOT, WP), encoding='utf-8'))['sections']
args = [a for a in sys.argv[1:] if not a.startswith('--') and a != WP]
bad = 0
for sid, sec in world.items():
    if args and not any(sid == a or sec['dir'].startswith(a) for a in args):
        continue
    p = os.path.join(ROOT, 'data/collision', sid + '.json')
    if not os.path.exists(p):
        print(f'{sid} NO COLLISION FILE'); bad += 1; continue
    c = json.load(open(p))
    rows = c['rows']
    W, H = sec['tiles']
    probs = []
    if len(rows) != H or any(len(r) != W for r in rows):
        print(f'{sid} WRONG SIZE: want {W}x{H}, got {len(rows[0]) if rows else 0}x{len(rows)}'); bad += 1; continue
    npc = {(n['x'], n['y']) for n in sec.get('npcs', [])}   # townsfolk stand still, so they block like walls
    walk = lambda x, y: 0 <= x < W and 0 <= y < H and rows[y][x] in '.,' and (x, y) not in npc
    pts = {}
    for side, e in sec['edges'].items():
        r = e['range']
        for k in range(r[0], r[1] + 1):
            pts[f'{side} edge {k}'] = {'left': (0, k), 'right': (W - 1, k), 'top': (k, 0), 'bottom': (k, H - 1)}[side]
    for w in sec['warps']:
        pts[f"{w['kind']}->{w['to']} @{w['tile']}"] = tuple(w['tile'])
    for k, s in sec['spawns'].items():
        if s:
            pts[f'spawn {k}'] = tuple(s)
    for o in sec.get('objects', []):   # objects are used from the tile in front (below) them
        x, y = o['tile']
        if not any(walk(x + dx, y + dy) for dx, dy in ((0, 1), (0, -1), (1, 0), (-1, 0))):
            probs.append(f"object {o['k']} at {o['tile']} has no walkable tile beside it")
    for k, (x, y) in pts.items():
        if not walk(x, y):
            probs.append(f'{k} is on a blocked tile')
    good = [v for v in pts.values() if walk(*v)]
    if good:
        seen = {good[0]}
        q = deque([good[0]])
        while q:
            x, y = q.popleft()
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                n = (x + dx, y + dy)
                if n not in seen and walk(*n):
                    seen.add(n); q.append(n)
        for k, v in pts.items():
            if walk(*v) and v not in seen:
                probs.append(f'{k} is cut off from {next(k2 for k2, v2 in pts.items() if v2 == good[0])}')
    # walkable ground the player can never reach looks open but isn't: report it (a warning, it doesn't fail)
    islands = 0
    if good:
        allw = {(x, y) for y in range(H) for x in range(W) if rows[y][x] in '.,'} - npc
        islands = len(allw - seen)
    n = sum(r.count('.') + r.count(',') for r in rows)
    if probs:
        bad += 1
        print(f"{sid} {sec['name']}: FAIL ({n} walkable) - " + '; '.join(probs))
    else:
        print(f"{sid} {sec['name']}: ok ({n} walkable, {sum(r.count(',') for r in rows)} grass){'' if c.get('edited') else ' [auto, not reviewed]'}" + (f' WARN {islands} unreachable walkable tiles: ' + ' '.join(f'{x},{y}' for x, y in sorted(allw - seen, key=lambda t: (t[1], t[0]))[:40]) if islands else ''))
sys.exit(1 if bad else 0)
