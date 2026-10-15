"""Auto-place props on V2 sections following the V2 placement rules (STITCHING_GUIDE section 6b), never cutting a path.
usage: python tools/props/place_props.py <section ids...>   -> updates data/sections/props_layout.json for those sections
Palette per section is chosen from PALETTES by planet + section type. Positions are seeded by section id (stable)."""
import json, sys, random
from collections import deque
W = json.load(open('data/world.json', encoding='utf-8')); SEC, QS = W['sections'], W.get('quest_spots', {})
CUT = {}
def size(p):
    d, n = p.split('/'); CUT.setdefault(d, {m['n']: m['px'] for m in json.load(open(f'art/props/{d}/cut.json'))})
    pw, ph = CUT[d][int(n)]; return max(1, round(pw / 16)), ph
D = lambda *ns: [f'01_dustara/{n:02d}' for n in ns]
PALETTES = {   # (planet dir, type) -> list of (kind, props, how many)
 ('01_dustara', 'town'): [('wall', D(44, 45, 46, 47, 48), 2), ('wall', D(52, 53, 49, 51), 1), ('wall', D(8, 9, 13, 15, 17, 19, 21, 23, 7), 3),
                          ('open', D(4, 5, 0, 6, 1), 2), ('open', D(25, 26, 29, 31), 2), ('open', D(2, 3, 10), 1)],
 ('01_dustara', 'route'): [('border', D(74, 76, 77, 81, 82, 83, 68, 75, 85, 92, 93, 107, 86), 3), ('border', D(38, 42), 1)],
 ('01_dustara', 'field'): [('border', D(68, 75, 85, 92, 93, 107, 74, 76), 3)],
 ('01_dustara', 'landmark'): [('border', D(25, 26, 31, 11, 12, 16, 20, 50), 2)],
 ('01_dustara', 'cave'): [('corner', D(79, 97, 103, 102, 96), 2)],
}
AVOID = {'004': [(0, 4, 7, 11), (10, 10, 14, 14)]}   # landing pad, Bonfire Ring (x0, y0, x1, y1)
FRONTIER = {'pyros', 'thalassa'}   # Molten Frontier zones: only neutral gear, no desert plants
NEUTRAL = {'route': [('border', D(11, 12, 14, 16, 18, 20, 22, 24, 38, 42, 50), 2)], 'field': [('border', D(11, 12, 16, 20, 50), 2)],
           'landmark': [('border', D(25, 26, 31, 11, 12, 16, 20), 2)], 'town': [('wall', D(11, 12, 14, 16, 18, 20, 22, 24), 3), ('wall', D(52, 53), 1), ('open', D(25, 26, 31), 2)]}
T = lambda *ns: [f'04_thalassa/{n:02d}' for n in ns]
ZONE_TOWN = {'thalassa': [('wall', T(40, 41, 43, 44, 47, 50, 51), 2), ('wall', T(35, 36, 37, 38, 75, 77, 18, 19), 3), ('wall', T(7, 8, 9, 10, 11, 12), 1),
                          ('open', T(0, 1, 2, 3), 1), ('open', T(23, 24, 26, 28), 2), ('open', T(72, 73), 1)]}
# Towns are laid out by hand like a real street: lamps in straight evenly spaced rows, stalls in a line along the
# shopfronts, planters in pairs either side of a door, benches facing each other. (prop, x, y)
HAND = {
 '004': [   # owner's mockup: lamps between the houses, two market rows, planter+bench pairs, Bonfire Ring framed by banner lamps
  ('01_dustara/26', 0, 4), ('01_dustara/26', 9, 4), ('01_dustara/26', 23, 4), ('01_dustara/15', 1, 4), ('01_dustara/19', 4, 4), ('01_dustara/23', 18, 4),
  ('01_dustara/28', 7, 6), ('01_dustara/44', 8, 6), ('01_dustara/07', 10, 6), ('01_dustara/24', 11, 6),
  ('01_dustara/36', 14, 6), ('01_dustara/45', 15, 6), ('01_dustara/13', 17, 6), ('01_dustara/43', 18, 6), ('01_dustara/15', 20, 6), ('01_dustara/36', 21, 6),
  ('01_dustara/02', 8, 8), ('01_dustara/06', 10, 8), ('01_dustara/02', 15, 8), ('01_dustara/06', 17, 8), ('01_dustara/42', 22, 8),
  ('01_dustara/28', 9, 11), ('01_dustara/36', 14, 11)],
 '008': [('01_dustara/44', 5, 5), ('01_dustara/45', 17, 5), ('01_dustara/13', 11, 5), ('01_dustara/13', 16, 5),
         ('01_dustara/26', 3, 10), ('01_dustara/26', 8, 10), ('01_dustara/26', 13, 10), ('01_dustara/26', 18, 10)],
 '018': [('04_thalassa/40', 12, 5), ('04_thalassa/44', 14, 5), ('04_thalassa/08', 6, 5), ('04_thalassa/08', 11, 5),
         ('04_thalassa/35', 17, 5), ('04_thalassa/37', 18, 5),
         ('04_thalassa/26', 3, 10), ('04_thalassa/26', 8, 10), ('04_thalassa/26', 13, 10), ('04_thalassa/26', 18, 10),
         ('04_thalassa/00', 4, 7), ('04_thalassa/00', 17, 7)],
}
L = json.load(open('data/sections/props_layout.json'))
for sid in sys.argv[1:]:
    s = SEC[sid]; rows = [list(r) for r in json.load(open(f'data/collision/{sid}.json'))['rows']]; Wt, Ht = s['tiles']
    if s['type'] == 'interior': continue
    pal = ZONE_TOWN[s['zone']] if s['type'] == 'town' and s.get('zone') in ZONE_TOWN else NEUTRAL.get(s['type'], []) if s.get('zone') in FRONTIER else PALETTES.get((s['dir'], s['type']), [])
    rnd = random.Random(int(sid) * 7919)
    walk = lambda x, y: 0 <= x < Wt and 0 <= y < Ht and rows[y][x] in '.,'
    ground = lambda x, y: 0 <= x < Wt and 0 <= y < Ht and rows[y][x] == '.'   # props never stand in tall grass
    keys = set()
    for w in s['warps']: keys |= {tuple(w['tile']), tuple(w['at'])}
    for o in s['objects']: keys.add(tuple(o['tile']))
    for v in s['spawns'].values():
        if v: keys.add(tuple(v))
    for n in s.get('npcs', []): keys.add((n['x'], n['y']))
    for q in QS.values():
        if q.get('s') == sid and 'x' in q: keys.add((q['x'], q['y']))
    for side, e in s['edges'].items():
        for k in range(e['range'][0] - 1, e['range'][1] + 2):
            for dd in range(3): keys.add({'left': (dd, k), 'right': (Wt - 1 - dd, k), 'top': (k, dd), 'bottom': (k, Ht - 1 - dd)}[side])
    for x0, y0, x1, y1 in AVOID.get(sid, []): keys |= {(x, y) for x in range(x0, x1 + 1) for y in range(y0, y1 + 1)}
    near = lambda x, y: any((x + a, y + b) in keys for a in (-1, 0, 1) for b in (-1, 0, 1))
    def reach_ok():
        pts = [p for p in keys if walk(*p)]
        if not pts: return True
        seen = {pts[0]}; q = deque([pts[0]])
        while q:
            x, y = q.popleft()
            for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                if walk(x + a, y + b) and (x + a, y + b) not in seen: seen.add((x + a, y + b)); q.append((x + a, y + b))
        return all(p in seen for p in pts)
    out = []
    hard = set()
    for w in s['warps']: hard |= {tuple(w['tile']), tuple(w['at'])}
    for o in s['objects']:
        if o.get('k') != 'stash': hard.add(tuple(o['tile']))
    for v in s['spawns'].values():
        if v: hard.add(tuple(v))
    if sid in HAND:
        for p, x, y in HAND[sid]:
            w, _ = size(p); fp = [(x + i, y) for i in range(w)]
            bad = [t for t in fp if t in hard]   # hand layouts may stand on drawn scenery; only doors, warps, counters and spawns are off limits
            old = [rows[b][a] for a, b in fp]
            for a, b in fp: rows[b][a] = '#'
            if bad or not reach_ok():
                print('  SKIP', p, x, y, 'blocked/key' if bad else 'cuts a path', bad)
                for (a, b), c in zip(fp, old): rows[b][a] = c
            else: out.append({'p': p, 'x': x, 'y': y})
        pal = []
    for kind, props, n in pal:
        for _ in range(n):
            p = rnd.choice(props); w, ph = size(p); cand = []
            for y in range(1, Ht - 1):
                for x in range(1, Wt - w):
                    fp = [(x + i, y) for i in range(w)]
                    if not all(ground(*t) and not near(*t) for t in fp): continue
                    above = all(not walk(x + i, y - 1) for i in range(w)); below = all(walk(x + i, y + 1) for i in range(w))
                    if kind == 'wall' and not (above and below): continue
                    if kind == 'border' and not (above or all(not walk(x + i, y + 1) for i in range(w))): continue
                    if kind == 'corner' and not ((not walk(x - 1, y) or not walk(x + w, y)) and (above or not walk(x, y + 1))): continue
                    if kind == 'open' and not (below and all(walk(x + i, y - 1) for i in range(w))): continue
                    if any(abs(x - o['x']) < 3 and abs(y - o['y']) < 2 for o in out): continue
                    cand.append((x, y))
            rnd.shuffle(cand)
            for x, y in cand:
                fp = [(x + i, y) for i in range(w)]; old = [rows[b][a] for a, b in fp]
                for a, b in fp: rows[b][a] = '#'
                if reach_ok(): out.append({'p': p, 'x': x, 'y': y}); keys.update(fp); break
                for (a, b), c in zip(fp, old): rows[b][a] = c
    L[sid] = out; print(sid, s['type'], s.get('zone') or '', len(out))
json.dump(L, open('data/sections/props_layout.json', 'w'), indent=0)
