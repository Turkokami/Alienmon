"""Merge new townsfolk for maps that had nobody (tools/sections/v3/townsfolk_v3.json) into data/sections/npcs.json.
Clerks and nurses stand behind their counter (pinned); everyone else is placed on open ground by build_world.
Idempotent: entries it added carry "v3": true and are replaced on every run.
    python tools/sections/v3/add_townsfolk.py"""
import json
NEW = json.load(open('tools/sections/v3/townsfolk_v3.json', encoding='utf-8'))
NP = json.load(open('data/sections/npcs.json', encoding='utf-8'))
W = json.load(open('data/world.json', encoding='utf-8'))['sections']
for sid in list(NP):
    NP[sid] = [n for n in NP[sid] if not (isinstance(n, dict) and n.get('v3'))]
    if not NP[sid]: del NP[sid]
n_add = 0
for sid, people in NEW.items():
    s = W.get(sid)
    if not s: continue
    rows = json.load(open(f'data/collision/{sid}.json'))['rows']; H, Wd = len(rows), len(rows[0])
    walk = lambda x, y: 0 <= x < Wd and 0 <= y < H and rows[y][x] in '.,'
    for p in people:
        e = {'art': p['art'], 'name': p.get('name', ''), 't': p['t'], 'v3': True}
        kind = {'clerk': 'shop', 'nurse': 'bay'}.get(p.get('role'))
        if kind:
            c = next((o['tile'] for o in s['objects'] if o['k'] == kind), None)
            if c:
                x, y = c
                for dx, dy, face in ((0, -1, 'down'), (0, 1, 'up'), (-1, 0, 'right'), (1, 0, 'left')):
                    if walk(x - dx, y - dy) and 0 <= x + dx < Wd and 0 <= y + dy < H:   # player side is opposite: stand behind
                        e.update(tile=[x + dx, y + dy], stay=True, face=face); break
        NP.setdefault(sid, []).append(e); n_add += 1
json.dump(NP, open('data/sections/npcs.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('added', n_add, 'townsfolk on', len(NEW), 'maps')
