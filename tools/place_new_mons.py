"""Put the owner's 2026-10 Alienmon into the wild on the worlds their looks belong to (re-run after any world rewire).
Only areas whose habitat suits their types get them (data/habitat_rules.json). Idempotent.
    python tools/place_new_mons.py"""
import json

WORLDS = {'Ferrox': [('Cogglet', 6), ('Cyclopper', 2), ('Girderon', 4), ('Rustadillo', 4), ('Tinwing', 5)],
          'Thalassa': [('Brineback', 4), ('Fiddlesnap', 6), ('Squidmiral', 4), ('The Old One', 1)],
          'Sporeholm': [('Glowcroak', 6), ('Gloomtoad', 2), ('Mossback', 4), ('Oozel', 5)],
          'Neonis': [('Boombastadon', 4), ('Squawkbox', 6)], 'Halo': [('Puffloon', 6), ('Stormquill', 3)],
          'Glyphos': [('Lacefin', 5), ('Vitramoth', 4)], 'Dustara': [('Dunetrot', 5)], 'Umbra': [('Hexcoil', 5)], 'Pyros': [('Rumbler', 5)]}
E = json.load(open('data/encounters.json', encoding='utf-8')); H = json.load(open('data/habitat_rules.json', encoding='utf-8'))
A = {m['name']: m for m in json.load(open('data/batches/batch01_kessler/alienmon.json', encoding='utf-8'))}


def fits(types, hab):
    h = H['habitats'].get(hab)
    if not h: return 0
    tol = list(h['tolerated'])
    if hab in ('volcanic', 'volcano', 'sun_forge', 'ash_trail') and 'Bio' in types:
        if not any(t in ('Magma', 'Plasma') for t in types): return 0
        tol.append('Bio')
    for t in types:
        if hab in H['hard_bans'].get(t, []) or t in h.get('banned', []) or t not in h['native'] + tol: return 0
    return 2 if any(t in h['native'] for t in types) else 1


placed = {}
for sid, t in E.items():
    for name, w in WORLDS.get(t['planet'], []):
        m = A[name]; f = fits(m['t'], t['habitat'])
        if not f or any(e['name'] == name for e in t['encounters']): continue
        surf = any(e['method'] == 'surf' for e in t['encounters'])
        if name == 'The Old One' and not surf: continue
        lv = [l for e in t['encounters'] for l in e['levels']]; lo, hi = min(lv), max(lv)
        if m['st'] == 2: lo, hi = hi - 2, hi + 2
        if name == 'The Old One': lo, hi = hi + 8, hi + 12
        meth = 'surf' if name == 'The Old One' else ('walk' if any(e['method'] == 'walk' for e in t['encounters']) else t['encounters'][0]['method'])
        t['encounters'].append({'n': m['n'], 'name': name, 'types': m['t'], 'rarity': 'rare' if w <= 2 else 'uncommon' if f == 1 or w < 5 else 'common',
                                'weight': w if f == 2 else max(1, w // 2), 'levels': [lo, hi], 'method': meth, 'time': 'any'})
        placed[name] = placed.get(name, 0) + 1
# quest Alienmon pinned where their missions send the player (testers could not find them otherwise):
# section -> [(name, weight, levels)]; the weight is kept up to date on every run
PINNED = {'011': [('Cactling', 10.25, [3, 5])],   # Dusty's "Cactling bloom" mission points at Cactus Gardens
          '010': [('Cactling', 2, [3, 5])]}
for sid, pins in PINNED.items():
    t = E.get(sid)
    if not t: continue
    for name, w, lv in pins:
        ex = next((e for e in t['encounters'] if e['name'] == name), None)
        if ex: ex.update(weight=w, levels=lv, time='any'); continue
        m = A.get(name) or next(e for s in E.values() for e in s['encounters'] if e['name'] == name)
        t['encounters'].append({'n': m['n'], 'name': name, 'types': m.get('t') or m.get('types'), 'rarity': 'common', 'weight': w, 'levels': lv, 'method': 'walk', 'time': 'any'})
        placed[name] = placed.get(name, 0) + 1
# every area with surfable water has water Alienmon to find (the water routes were added for surfing but had none),
# and a water route with no table at all borrows the land table of an area it joins, for its island grass
import os, glob
from collections import Counter
Wd = json.load(open('data/world.json', encoding='utf-8'))['sections']
plan = lambda sid: Wd.get(sid, {}).get('pkey')
hydro_on = {}
for sid, tb in E.items():
    for e in tb['encounters']:
        if 'Hydro' in (e.get('types') or []): hydro_on.setdefault(plan(sid), Counter())[e['name']] += 1
sea = Counter()
for sid, tb in E.items():
    for e in tb['encounters']:
        if e['method'] == 'surf' and 'Hydro' in (e.get('types') or []): sea[e['name']] += 1
planet_lv, planet_land = {}, {}
for sid, tb in E.items():
    pk = plan(sid)
    for e in tb['encounters']:
        planet_lv.setdefault(pk, []).extend(e['levels'])
    if tb.get('habitat') and Wd.get(sid, {}).get('type') == 'route' and [e for e in tb['encounters'] if e['method'] == 'walk']:
        planet_land.setdefault(pk, []).append(sid)
info = {e['name']: e for tb in E.values() for e in tb['encounters']}
def linked(sid):
    s = Wd.get(sid, {})
    out = [e['to'] for e in (s.get('edges') or {}).values()] + [w['to'] for w in s.get('warps', [])]
    out += [k for k, o in Wd.items() if any(e['to'] == sid for e in (o.get('edges') or {}).values()) or any(w['to'] == sid for w in o.get('warps', []))]
    return [x for x in out if x in E and E[x]['encounters']]
for f in sorted(glob.glob('data/sections/fluids/*.json')):
    sid = os.path.basename(f)[:-5]; F = json.load(open(f))
    if not F.get('water') or sid not in Wd or Wd[sid]['type'] in ('interior', 'tower', 'arena'): continue
    tb = E.setdefault(sid, {'planet': Wd[sid].get('planet'), 'name': Wd[sid]['name'], 'habitat': None, 'encounters': []})
    if not [e for e in tb['encounters'] if e['method'] != 'surf']:   # no land table: borrow a neighbour's
        nb = linked(sid) or planet_land.get(plan(sid), [])[:1]   # a joined area, else one of this world's routes
        if nb:
            src = E[nb[0]]; tb['habitat'] = tb.get('habitat') or src.get('habitat')
            tb['encounters'] += [dict(e) for e in src['encounters'] if e['method'] != 'surf']
            placed['land table for ' + sid] = 1
    if any(e['method'] == 'surf' for e in tb['encounters']): continue
    lv = [l for e in tb['encounters'] for l in e['levels']] or [l for x in linked(sid) for e in E[x]['encounters'] for l in e['levels']]
    if lv: lo, hi = min(lv), max(lv)
    else: pl = sorted(planet_lv.get(plan(sid)) or [5, 8]); lo, hi = pl[len(pl) // 2], pl[len(pl) * 3 // 4]   # this world's usual levels
    picks = [n for n, _ in (hydro_on.get(plan(sid)) or Counter()).most_common() if n in info][:3]
    for n, _ in sea.most_common():
        if len(picks) >= 3: break
        if n not in picks and n in info: picks.append(n)
    for n, w in zip(picks, (10, 6, 3)):
        m = info[n]
        tb['encounters'].append({'n': m.get('n'), 'name': n, 'types': m.get('types'), 'rarity': 'common' if w >= 6 else 'uncommon', 'weight': w, 'levels': [lo, hi], 'method': 'surf', 'time': 'any'})
    placed['surf for ' + sid] = 1
json.dump(E, open('data/encounters.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('added', placed)
