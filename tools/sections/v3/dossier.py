"""Write a planning dossier per world (tools/sections/v3/dossier/<dir>.json): the current sections and every story anchor
on them, plus the world's kit pieces with their detected exits. Used to write plans/<dir>.json.
    python tools/sections/v3/dossier.py
"""
import json, os, glob, subprocess
from collections import defaultdict

J = lambda p, d=None: json.load(open(p, encoding='utf-8')) if os.path.exists(p) else d
os.makedirs('tools/sections/v3/dossier', exist_ok=True)
W = J('data/world.json')['sections']; AT = {s['id']: s for s in J('art/sections/atlas.json')['sections']}
L = J('data/sections/links.json'); QS = J('data/sections/quest_spots.json'); ST = J('data/story.json'); KIT = J('tools/sections/v3/kit.json')
NP = J('data/sections/npcs.json'); E = J('data/encounters.json'); WQ = J('data/world.json').get('quest_spots', {})
scenes = defaultdict(list)
for sc in ST['scenes']: scenes[sc['sec']].append({'id': sc['id'], 'when': sc.get('when')})
for d in sorted({s['dir'] for s in W.values()}):
    pf = glob.glob(f'data/sections/planets/{d[:2]}_*.json'); PF = J(pf[0]) if pf else {}
    secs = {}
    for k, s in sorted(W.items()):
        if s['dir'] != d: continue
        secs[k] = {'name': s['name'], 'type': s['type'], 'tiles': s['tiles'], 'kit': AT.get(k, {}).get('kit'),
                   'edges': {e: v['to'] for e, v in s['edges'].items()},
                   'warps_to': sorted({w['to'] for w in s['warps']}),
                   'objects': [{x: o[x] for x in ('tile', 'k', 'to', 'item') if x in o} for o in s['objects'] if o['k'] not in ('sign', 'stop')],
                   'gates': [g for g in L['gates'] if g['section'] == k],
                   'quest_spots': sorted(q for q, v in WQ.items() if v.get('s') == k),
                   'story_scenes': scenes.get(k, []),
                   'npcs': len(NP.get(k, [])) + len(PF.get('npcs', {}).get(k, [])),
                   'wild_table': (E.get(k) or {}).get('habitat'),
                   'apprentices': L['trainers']['apprentices'].get(k) or (PF.get('apprentices') or {}).get(k)}
    arrival = {p: v for p, v in L['arrival'].items() if v['section'] in secs}
    kit = {k: {x: v[x] for x in ('cat', 'name', 'alt', 'type', 'tiles', 'exits')} for k, v in KIT.items() if v['dir'] == d}
    json.dump({'dir': d, 'arrival': arrival, 'sections': secs, 'kit': kit}, open(f'tools/sections/v3/dossier/{d}.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    print(d, len(secs), 'sections', len(kit), 'kit pieces')
