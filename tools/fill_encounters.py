"""Fill thin wild areas: any map area with fewer than MIN distinct wild Alienmon (as they actually appear, after
low-level evolved forms fall back to their earlier form, and leaving out story-gated species) gets extra species
whose types suit its habitat. Prefers the world's own wild list, then base forms of nearby worlds' species.
Writes into data/encounters.json (marked "fill": true) so tools/check_habitats.js checks them like the rest.
Usage: python tools/fill_encounters.py [--dry-run]"""
import json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from habitat_rules import fit, B as HB

MIN = 5
J = lambda f: json.load(open(os.path.join(ROOT, f), encoding='utf-8'))
E = J('data/encounters.json'); A = J('data/batches/batch01_kessler/alienmon.json'); PROG = J('data/progression.json'); P = J('data/batches/batch01_kessler/planets.json')
SP = PROG['species']; BY = {m['name']: m for m in A}
ORDER = ['dustara', 'ferrox', 'sporeholm', 'thalassa', 'neonis', 'glyphos', 'pyros', 'glacia', 'helix', 'halo', 'umbra', 'starfall', 'apex', 'ystra']
PKEY = {'Dustara': 'dustara', 'Ferrox': 'ferrox', 'Sporeholm': 'sporeholm', 'Thalassa': 'thalassa', 'Neonis': 'neonis', 'Glyphos': 'glyphos', 'Pyros': 'pyros',
        'Glacia': 'glacia', 'Helix Station': 'helix', 'Halo': 'halo', 'Umbra': 'umbra', 'Starfall Rift': 'starfall', 'Apex Array': 'apex', 'Ystra': 'ystra'}
GATED = {'Zib', 'Lumivex', 'Vexhydra', 'Bronnix', 'Thornvoid', 'Facetrix', 'Encorex', 'Pyrelyth', 'Citadrake', 'Firstlight', 'Oblivite',
         'Forgemaul', 'Mycora', 'Anchorath', 'Bassquake', 'Basaltor', 'Glaciryx', 'Mirrix', 'Reflix', 'Horizar'}
PREVO = {}
for n, s in SP.items():
    ev = s.get('evolves')
    if ev and ev.get('into') and str(ev.get('method', 'Level')).startswith('Level'): PREVO[ev['into']] = (n, ev['level'])


def shown(name, lv):   # the form that appears at this level
    for _ in range(3):
        p = PREVO.get(name)
        if not p or lv >= p[1] - 1: break
        name = p[0]
    return name


def ok(name): return name in BY and SP.get(name, {}).get('rarity') not in ('legendary', 'mythic', 'starter') and name not in GATED


home = {}
for p in P:
    for t in 'cer':
        for i in p['pool'][t]: home.setdefault(A[i]['name'], p['key'])
added = {}
for sid, sec in E.items():
    if sec['habitat'] == 'sun_forge': continue   # Ignarch's domain: no wild Alienmon by design
    land = [e for e in sec['encounters'] if e['method'] != 'surf' and ok(e['name'])]
    los = [e['levels'][0] for e in sec['encounters']] or [5]; his = [e['levels'][1] for e in sec['encounters']] or [8]
    lo, hi = min(los), max(his)
    have = {shown(e['name'], e['levels'][1]) for e in land}
    if len(have) >= MIN: continue
    pk = PKEY[sec['planet']]; here = ORDER.index(pk)
    method = 'cave' if any(e['method'] == 'cave' for e in sec['encounters']) else 'walk'
    names = {e['name'] for e in sec['encounters']}
    cands = []
    for m in A:
        n = m['name']
        if not ok(n) or n in names or not fit(m['t'], sec['habitat']): continue
        s = shown(n, hi)
        if s in have or not ok(s): continue
        h = home.get(n) or home.get(s)
        if h is None: continue
        dist, f = abs(ORDER.index(h) - here), fit(m['t'], sec['habitat'])
        if sec['habitat'] == 'thermal_vent' and 'Hydro' not in m['t'] and h != pk: continue   # an undersea vent: sea life, not land fire creatures
        if dist > (6 if f == 2 else 2): continue   # a native fit may come from further away (fire species of Pyros for the Ash Trail)
        nat = HB[sec['habitat']][0]; rank = min([nat.index(t) for t in m['t'] if t in nat] or [9])   # the habitat's signature types first (Magma on the Ash Trail)
        cands.append((-f, rank, 0 if h == pk else 1, dist, SP.get(n, {}).get('stage', '9'), n, s))
    cands.sort()
    for c in cands:
        if len(have) >= MIN: break
        n, s = c[5], c[6]
        if s in have: continue
        have.add(s)
        rar = 'uncommon' if c[2] == 0 else 'rare'
        sec['encounters'].append({'n': BY[n]['n'], 'name': n, 'types': BY[n]['t'], 'rarity': rar, 'weight': 5 if rar == 'uncommon' else 2,
                                  'levels': [lo, hi], 'method': method, 'time': 'any', 'fill': True})
        added.setdefault(sid, []).append(f"{s if s == n else n + ' (as ' + s + ')'} [{home.get(n)}]")
for sid, L in added.items(): print(sid, E[sid]['name'], E[sid]['habitat'], '+', ', '.join(L))
if '--dry-run' not in sys.argv:
    json.dump(E, open(os.path.join(ROOT, 'data/encounters.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
