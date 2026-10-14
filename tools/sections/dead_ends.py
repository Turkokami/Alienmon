"""Stoppers for ladders, stairs and mine shafts that are drawn but lead nowhere: walking into one (or pressing A) says why.

Sources: the 'paths drawn in the art but not in the atlas' notes in data/connections_report.md (coordinates right after the
words ladder / stairs / steps / mine / shaft / lift), plus EXTRA below for ones the notes missed.
A stopper goes on each blocked tile in or next to the feature that the player can actually walk up to.
Writes 'stop' objects into data/sections/links.json (old ones are replaced).   Usage: python tools/sections/dead_ends.py
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
world = json.load(open(os.path.join(ROOT, 'data/world.json'), encoding='utf-8'))['sections']
links_p = os.path.join(ROOT, 'data/sections/links.json')
links = json.load(open(links_p, encoding='utf-8'))
MSG = {'ladder': "This ladder is broken. You can't climb it.",
       'stairs': "The stairs are blocked off. You can't go this way.",
       'mine': "This shaft has caved in. There's no way through."}
KIND = {'ladder': 'ladder', 'stairs': 'stairs', 'steps': 'stairs', 'staircase': 'stairs', 'escalator': 'stairs', 'mine': 'mine', 'shaft': 'mine', 'lift': 'ladder'}
OTHER = r'door|dome|portal|arch|shrine|path|bridge|rail|cart|hut|tent|gate|fence|carpet|mat|chest|corridor|terrace|porch|yard|stall|island|ledge'
EXTRA = {}   # {section: [(kind, [(x, y), ...])]} for dead ends the notes missed (the Sunset Tunnel ladders work: they are walkable)


def coords(txt):
    out = []
    for m in re.finditer(r'[\(\[]\s*(\d+)(?:-(\d+))?\s*,\s*(\d+)(?:-(\d+))?\s*[\)\]]|col(?:umn)?s? (\d+)(?:-(\d+))? rows? (\d+)(?:-(\d+))?', txt):
        g = m.groups()
        if g[0] is not None: x0, x1, y0, y1 = g[0], g[1] or g[0], g[2], g[3] or g[2]
        else: x0, x1, y0, y1 = g[4], g[5] or g[4], g[6], g[7] or g[6]
        out.append((m.start(), [(x, y) for x in range(int(x0), int(x1) + 1) for y in range(int(y0), int(y1) + 1)]))
    return out


found = {}
for line in open(os.path.join(ROOT, 'data/connections_report.md'), encoding='utf-8'):
    m = re.match(r'- (\d{3}) ', line)
    if not m or m.group(1) not in world: continue
    for pos, tiles in coords(line):
        before = line[max(0, pos - 60):pos].lower()
        kw = [(k.start(), k.group(0)) for k in re.finditer(r'ladder|staircase|stairs|steps|escalator|mine|shaft|lift|' + OTHER, before)]
        if not kw: continue
        word = kw[-1][1]
        if word in KIND: found.setdefault(m.group(1), []).append((KIND[word], tiles))
for sid, groups in EXTRA.items(): found.setdefault(sid, []).extend(groups)

for objs in links['objects'].values():
    objs[:] = [o for o in objs if o.get('k') != 'stop']
n = 0
for sid, groups in found.items():
    s = world[sid]; rows = json.load(open(os.path.join(ROOT, 'data/collision', sid + '.json')))['rows']; H, W = len(rows), len(rows[0])
    walk = lambda x, y: 0 <= x < W and 0 <= y < H and rows[y][x] in '.,'
    # tiles the player can actually reach: flood from spawns and warp tiles
    seeds = [tuple(v) for v in s.get('spawns', {}).values() if v] + [tuple(w['tile']) for w in s['warps']]
    seen = set(t for t in seeds if walk(*t)); st = list(seen)
    for w in s['warps']:
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            t = (w['tile'][0] + dx, w['tile'][1] + dy)
            if walk(*t) and t not in seen: seen.add(t); st.append(t)
    while st:
        x, y = st.pop()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            t = (x + dx, y + dy)
            if walk(*t) and t not in seen: seen.add(t); st.append(t)
    busy = {tuple(o['tile']) for o in s.get('objects', [])} | {tuple(w['tile']) for w in s['warps']}
    objs = links['objects'].setdefault(sid, []); taken = {tuple(o['tile']) for o in objs}
    for kind, tiles in groups:
        cand = set()
        for x, y in tiles:
            for dx, dy in ((0, 0), (0, 1), (0, -1)) if kind != 'mine' else ((0, 0),):   # the feature itself and the step at either end, not the walls beside it
                cand.add((x + dx, y + dy))
        for x, y in sorted(cand):
            if not (0 <= x < W and 0 <= y < H) or rows[y][x] != '#' or (x, y) in busy or (x, y) in taken: continue
            if not any((x + dx, y + dy) in seen for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))): continue
            objs.append({'tile': [x, y], 'k': 'stop', 't': MSG[kind], 'why': f'dead-end {kind} (tools/sections/dead_ends.py)'}); taken.add((x, y)); n += 1
json.dump(links, open(links_p, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print(n, 'stoppers on', len(found), 'maps')
