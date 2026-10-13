"""What does crossing water/lava open up? For every section with data/sections/fluids/<id>.json, lists the exits, warps,
townsfolk and objects that become reachable only with the Hydro-skiff / Heat Shield (so story guards can't be skipped).
Usage: python tools/sections/check_fluids.py"""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
world = json.load(open(os.path.join(ROOT, 'data/world.json'), encoding='utf-8'))['sections']
FD = os.path.join(ROOT, 'data/sections/fluids')
N4 = ((1, 0), (-1, 0), (0, 1), (0, -1))
for f in sorted(os.listdir(FD)):
    sid = f[:-5]; F = json.load(open(os.path.join(FD, f)))
    if not (F.get('water') or F.get('lava')) or sid not in world: continue
    sec = world[sid]; rows = [list(r) for r in json.load(open(os.path.join(ROOT, 'data/collision', sid + '.json')))['rows']]; W, H = sec['tiles']
    fl = set()
    for k in ('water', 'lava'):
        for x0, y0, x1, y1 in F.get(k, []):
            for y in range(max(1, y0), min(H - 2, y1) + 1):
                for x in range(max(1, x0), min(W - 2, x1) + 1):
                    if rows[y][x] == '#': fl.add((x, y))
    occ = {(n['x'], n['y']) for n in sec.get('npcs', [])} | {tuple(o['tile']) for o in sec['objects']}
    starts = [tuple(w['tile']) for w in sec['warps']] + [tuple(v) for v in sec['spawns'].values() if v]
    for side, e in sec['edges'].items():
        k = e['range'][0]; starts.append({'left': (0, k), 'right': (W - 1, k), 'top': (k, 0), 'bottom': (k, H - 1)}[side])
    def reach(withf):
        ok = lambda x, y: 0 <= x < W and 0 <= y < H and (x, y) not in occ and (rows[y][x] in '.,' or withf and (x, y) in fl)
        seen = {s for s in starts if ok(*s)}; q = list(seen)
        while q:
            x, y = q.pop()
            for dx, dy in N4:
                n = (x + dx, y + dy)
                if n not in seen and ok(*n): seen.add(n); q.append(n)
        return seen
    a, b = reach(False), reach(True)
    new = {t for t in b - a if rows[t[1]][t[0]] in '.,'}
    adj = lambda t: any((t[0] + dx, t[1] + dy) in new for dx, dy in N4) or t in new
    notes = [f"warp->{w['to']}{' LOCK '+w['node'] if w.get('node') else ''}" for w in sec['warps'] if adj(tuple(w['tile']))]
    notes += [f"npc {n.get('wid') or n.get('id') or n['art']}" for n in sec.get('npcs', []) if adj((n['x'], n['y']))]
    notes += [f"object {o['k']}" for o in sec['objects'] if adj(tuple(o['tile']))]
    print(sid, sec['name'], f"fluid {len(fl)} tiles, new ground {len(new)}", '; '.join(notes))
