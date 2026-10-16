"""Check a world plan without changing anything: python tools/sections/v3/plancheck.py 03_sporeholm
Simulates the plan's collision fixes in memory and reports every problem it can find."""
import json, sys, os
from collections import deque
sys.path.insert(0, os.path.dirname(__file__))
from v3wire import best_run, runs_on, mat_of, SIDES

d = sys.argv[1]
J = lambda p: json.load(open(p, encoding='utf-8'))
P = J(f'tools/sections/v3/plans/{d}.json'); K = J('tools/sections/v3/kit.json'); D = J(f'tools/sections/v3/dossier/{d}.json')
QS = J('data/sections/quest_spots.json'); ST = J('data/story.json')
use, keep, drop = P.get('use', {}), set(P.get('keep', [])), set(P.get('drop', []))
probs = []
ids = set(use) | keep
for i in drop:
    if i in ids: probs.append(f'{i} is both used/kept and dropped')
cur = set(D['sections'])
for i in cur - ids - drop: probs.append(f'current section {i} {D["sections"][i]["name"]} is neither kept, used nor dropped')

def rows0(i):
    if i in use:
        k = use[i]['kit']
        if k not in K: probs.append(f'{i}: unknown kit id {k}'); return None
        return json.load(open(f'data/collision/{k}.json'))['rows']
    p = f'data/collision/{i}.json'
    return json.load(open(p))['rows'] if os.path.exists(p) else None

R = {}
for i in ids:
    r = rows0(i)
    if r is None: probs.append(f'{i}: no collision'); continue
    r = [list(x) for x in r]; f = P.get('fix', {}).get(i, {})
    if f.get('base'): r = [[f['base']] * len(r[0]) for _ in r]
    for k, ch in (('walk', '.'), ('gr', ','), ('block', '#'), ('walk_after', '.')):
        for x0, y0, x1, y1 in f.get(k, []):
            for y in range(y0, y1 + 1):
                for x in range(x0, x1 + 1):
                    if 0 <= y < len(r) and 0 <= x < len(r[0]): r[y][x] = ch
    R[i] = [''.join(x) for x in r]
walk = lambda i, t: i in R and 0 <= t[1] < len(R[i]) and 0 <= t[0] < len(R[i][0]) and R[i][t[1]][t[0]] in '.,'
typ = lambda i: use[i].get('type', K[use[i]['kit']]['type']) if i in use else D['sections'].get(i, {}).get('type')

G = {i: set() for i in ids}
redef = {}
for e in P.get('edges', []): redef.setdefault(e[0], set()).add(e[1]); redef.setdefault(e[2], set()).add(e[3])
for i in keep:   # kept sections keep their other connections
    s = D['sections'].get(i, {})
    for side, t in s.get('edges', {}).items():
        if side not in redef.get(i, ()) and t not in drop: G[i].add(t); G.setdefault(t, set()).add(i)
    for t in s.get('warps_to', []):
        if t not in drop and t != 'back': G[i].add(t); G.setdefault(t, set()).add(i)
for e in P.get('edges', []):
    a, sa, b, sb = e[:4]
    for x, s in ((a, sa), (b, sb)):
        if x not in ids: probs.append(f'edge uses {x}, which is not used/kept'); continue
        if x in R and not runs_on(R[x], s): probs.append(f'edge {x} {s}: no walkable run on that edge')
    G.setdefault(a, set()).add(b); G.setdefault(b, set()).add(a)
for d_ in P.get('doors', []):
    par, t, room = d_[:3]
    for tt in [t] + ([d_[3]] if len(d_) > 3 else []):
        if not walk(par, tt): probs.append(f'door {par} {tt} -> {room}: door tile must be walkable (fix walk)')
        if not walk(par, [tt[0], tt[1] + 1]): probs.append(f'door {par} {tt}: tile below the door is blocked')
    if room in R:
        m = mat_of(R[room]); probs += [f'door room {room}: doormat {x} blocked' for x in m if not walk(room, x)]
    G[par].add(room); G.setdefault(room, set()).add(par)
for par, t, room in P.get('houses', []):
    if walk(par, t): probs.append(f'house {par} {t} -> {room}: house door tile must be BLOCKED (bumped into)')
    if not walk(par, [t[0], t[1] + 1]): probs.append(f'house {par} {t}: tile below the door is blocked')
    G[par].add(room); G.setdefault(room, set()).add(par)
for w in P.get('warps', []):
    a, at, b, bt, aa, af, ba, bf = w
    for s, t in ((a, at), (b, bt), (a, aa), (b, ba)):
        if not walk(s, t): probs.append(f'warp {a}{at}<->{b}{bt}: tile {s} {t} is blocked')
    G[a].add(b); G[b].add(a)
for a, at, b, bt in P.get('stairs', []):
    G[a].add(b); G[b].add(a)
for room, cs in P.get('counters', {}).items():
    for x, y, k in cs:
        if not walk(room, [x, y + 1]) and not walk(room, [x + 1, y]) and not walk(room, [x - 1, y]): probs.append(f'counter {room} {[x, y]}: nothing walkable beside it')
for sid, objs in P.get('objects', {}).items():
    for o in objs:
        t = o['tile']
        if not any(walk(sid, [t[0] + a, t[1] + b]) for a, b in ((0, 1), (0, -1), (1, 0), (-1, 0))): probs.append(f'object {sid} {o["k"]} {t}: nothing walkable beside it')
for sid, sp in P.get('spawns', {}).items():
    for k, t in sp.items():
        if t and not walk(sid, t): probs.append(f'spawn {sid} {k} {t} is blocked')
for g in P.get('gate', []):
    for t in g['tiles']:
        if not walk(g['section'], t): probs.append(f'gate {g["section"]} {t} must be walkable')
# reachability over the plan graph from the arrival
start = P.get('arrival') or next(iter(D['arrival'].values()), {}).get('section')
seen, q = {start}, deque([start])
while q:
    c = q.popleft()
    for n in G.get(c, ()):
        if n not in seen: seen.add(n); q.append(n)
for i in ids:
    if i not in seen and typ(i) != 'interior': probs.append(f'{i} {use.get(i, {}).get("name") or D["sections"].get(i, {}).get("name")} cannot be reached from the arrival {start}')
# story anchors on dropped sections
WQ = {k: v.get('s') for k, v in QS.items() if isinstance(v, dict)}; WQ.update({k: (v if isinstance(v, str) else v.get('s')) for k, v in P.get('quest_spots', {}).items()})
for k, s in WQ.items():
    if s in drop: probs.append(f'quest spot {k} is on dropped section {s} (move it in quest_spots)')
for sc in ST['scenes']:
    if sc['sec'] in drop: probs.append(f'story scene {sc["id"]} plays in dropped section {sc["sec"]} (keep that section or ask)')
for i, s in D['sections'].items():
    if i in drop and s['objects']:
        for o in s['objects']:
            if o['k'] in ('keeper', 'lab', 'legend', 'bay', 'shop'): probs.append(f'dropped {i} had a {o["k"]} object at {o["tile"]}: re-place it')
print(f'{d}: {len(ids)} sections, {len(P.get("edges", []))} edges, reachable {len(seen)}')
print('\n'.join('  - ' + p for p in probs) if probs else '  no problems found')
