"""Can the player actually reach and use everything? Checks every section in data/world.json with all the things that
stand on tiles (townsfolk, quest figures, roaming Alienmon, unopened stashes) treated as obstacles:
- every townsperson, counter/object, stash, quest figure and roaming Alienmon has a reachable tile beside it
- every quest point you walk onto or pick up (visit/collect/examine points) is itself reachable
Prints problems; exit code 1 if any.   Usage: python tools/sections/check_reach.py
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
W0 = json.load(open(os.path.join(ROOT, 'data/world.json'), encoding='utf-8'))
world, spots = W0['sections'], W0.get('quest_spots', {})
quests = {q['id']: q for q in json.load(open(os.path.join(ROOT, 'data/quests.json'), encoding='utf-8'))['quests']}
CHAR = {'giver', 'talk', 'battle_trainer', 'battle_rival', 'defeat_boss', 'legendary_encounter', 'deliver', 'show'}
N4 = ((1, 0), (-1, 0), (0, 1), (0, -1))
bad = []
for sid, sec in world.items():
    rows = json.load(open(os.path.join(ROOT, 'data/collision', sid + '.json')))['rows']
    W, H = sec['tiles']
    occ = {}   # tile -> what stands there
    for n in sec.get('npcs', []):
        occ[(n['x'], n['y'])] = 'npc ' + (n.get('wid') or n.get('id') or n['art'])
    for m in sec.get('mons', []):
        occ[(m['x'], m['y'])] = 'mon ' + m['mon']
    for o in sec.get('objects', []):
        occ[tuple(o['tile'])] = 'object ' + o['k']
    for w in sec['warps']:   # a story-locked warp (ship gangways) can't be walked over until its story step: count it as a wall
        if w.get('node'): occ.setdefault(tuple(w['tile']), 'locked warp to ' + w['to'])
    use_pts, char_pts = [], []
    for key, sp in spots.items():
        if sp['s'] != sid:
            continue
        qid, step = key.split(':')
        q = quests.get(qid, {})
        kind = ('giver' if q.get('type') == 'side' else 'main_giver') if step == 'giver' else q['objectives'][int(step)]['type']
        if kind in CHAR:
            occ.setdefault((sp['x'], sp['y']), 'quest ' + key)
            char_pts.append((key, (sp['x'], sp['y'])))
        elif kind in ('visit', 'spot_event', 'collect', 'examine'):
            for p in sp.get('pts') or [[sp['x'], sp['y']]]:
                use_pts.append((key, tuple(p), kind))
    walk = lambda x, y: 0 <= x < W and 0 <= y < H and rows[y][x] in '.,:' and (x, y) not in occ
    # a door into a room whose only way out is back here is no way in: it can't seed the walk
    dead_end = lambda t: t in world and all(w2['to'] in (sid, 'back') for w2 in world[t]['warps']) and not world[t]['edges']
    starts = [tuple(w['tile']) for w in sec['warps'] if not w.get('node') and not dead_end(w['to'])] + [tuple(v) for v in sec['spawns'].values() if v]
    for side, e in sec['edges'].items():
        k = e['range'][0]
        starts.append({'left': (0, k), 'right': (W - 1, k), 'top': (k, 0), 'bottom': (k, H - 1)}[side])
    seen, q = set(), [s for s in starts if walk(*s)]
    seen.update(q)
    while q:
        x, y = q.pop()
        for dx, dy in N4:
            n = (x + dx, y + dy)
            if n not in seen and walk(*n):
                seen.add(n); q.append(n)
    for t, what in occ.items():
        if what.startswith('locked warp'):
            continue
        if what.startswith('npc ') and (rows[t[1]][t[0]] not in '.,:' or any(occ.get((t[0] + dx, t[1] + dy), '').startswith('object') for dx, dy in N4)):
            continue   # standing behind a counter: used through the counter object
        if not any((t[0] + dx, t[1] + dy) in seen for dx, dy in N4):
            bad.append(f"{sid} {sec['name']}: {what} at {t} cannot be reached")
    for key, p, kind in use_pts:
        if kind in ('collect', 'examine'):
            ok = p in seen or any((p[0] + dx, p[1] + dy) in seen for dx, dy in N4)
        else:
            ok = p in seen
        if not ok:
            bad.append(f"{sid} {sec['name']}: quest point {key} {kind} at {p} cannot be reached ({occ.get(p, 'blocked ground')})")
print('\n'.join(bad) if bad else 'everything reachable')
sys.exit(1 if bad else 0)
