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
json.dump(E, open('data/encounters.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('added', placed)
