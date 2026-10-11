"""Place trainers, tower apprentices, townsfolk and fixed legendary spots on every painted town.

Reads data/population.json (classes, names, counts, townsfolk lines), data/painted_maps.json (walk masks and
hotspots) and data/quest_places.json, and writes data/town_people.json. Every spot is reachable from the landing
point, clear of hotspots and quest spots, and away from the landing area. Trainers face along the longest open
path so their line of sight covers a real route (docs/world/WORLD_POPULATION_RULES.md).

Usage: python tools/place_people.py      (re-run after editing towns or population.json)
"""
import json, os, base64, hashlib
import numpy as np
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CELL, GW, GH = 8, 192, 128
load = lambda p: json.load(open(os.path.join(ROOT, p), encoding='utf-8'))
pm, pop, qp = load('data/painted_maps.json'), load('data/population.json'), load('data/quest_places.json')
quests = load('data/quests.json')['quests']
planets = {p['key']: p for p in load('data/batches/batch01_kessler/planets.json')}
LOS = 150   # map px a trainer can see along its facing direction


def unpack(b64):
    b = base64.b64decode(b64)
    return np.array([(b[i >> 3] >> (i & 7)) & 1 for i in range(GW * GH)], bool).reshape(GH, GW)


def h32(s):
    return int(hashlib.md5(s.encode()).hexdigest()[:8], 16)


def quest_spots(town):
    out = []
    for q in quests:
        for key, loc in [('giver', q['location'])] + [(i, o.get('location')) for i, o in enumerate(q['objectives'])]:
            if not loc or loc.get('planet') != town or loc.get('area') == 'molten_frontier':
                continue
            p = qp.get(f"{q['id']}:{key}") or ({'x': loc['x'], 'y': loc['y']} if loc.get('x') is not None else None)
            if p:
                out.append((p['x'], p['y']))
    return out


def facing(walk, x, y):
    """Direction (dx, dy) with the longest walkable run from (x, y), up to the line of sight."""
    best, bd = (0, 1), -1
    for dx, dy in ((0, 1), (0, -1), (1, 0), (-1, 0)):
        n = 0
        for step in range(1, LOS // CELL + 1):
            cx, cy = int((x + dx * step * CELL) // CELL), int((y + dy * step * CELL) // CELL)
            if not (0 <= cx < GW and 0 <= cy < GH and walk[cy, cx]):
                break
            n += 1
        if n > bd:
            best, bd = (dx, dy), n
    return best


out = {}
for town, P in pm.items():
    if town not in planets:
        continue   # interiors such as the fortress get no random population
    walk = unpack(P['walk'])
    yy, xx = np.mgrid[0:GH, 0:GW]
    cx, cy = xx * CELL + 4, yy * CELL + 4
    free = walk.copy()
    for h in P['hot']:
        ry = h.get('ry') or h['r'] / 1.6
        free &= ((h['x'] - cx) / (h['r'] + 46)) ** 2 + ((h['y'] - cy) / (ry + 46)) ** 2 >= 1
    lab, _ = ndimage.label(walk)
    sx, sy = P['start'][0], P['exitY'] - 30
    free &= lab == lab[int(sy // CELL), int(sx // CELL)]
    free &= np.hypot(cx - sx, cy - sy) > 150
    # keep a little margin from mask edges so figures stand on ground, not on its border
    free &= ndimage.binary_erosion(walk, iterations=2)
    for (x, y) in quest_spots(town):
        free &= np.hypot(cx - x, cy - y) >= 70
    taken = []

    def pick(cands, n, min_gap, seed):
        """Farthest-point picks from candidate cells, deterministic per town."""
        ys, xs = np.nonzero(cands)
        pts = [(int(cx[y, x]), int(cy[y, x])) for y, x in zip(ys, xs)]
        chosen = []
        if not pts:
            return chosen
        first = pts[h32(seed) % len(pts)]
        pool = [p for p in pts if all(np.hypot(p[0] - t[0], p[1] - t[1]) >= min_gap for t in taken)]
        if not pool:
            return chosen
        chosen.append(min(pool, key=lambda p: np.hypot(p[0] - first[0], p[1] - first[1])))
        while len(chosen) < n:
            pool = [p for p in pool if all(np.hypot(p[0] - c[0], p[1] - c[1]) >= min_gap for c in chosen)]
            if not pool:
                break
            chosen.append(max(pool, key=lambda p: min(np.hypot(p[0] - c[0], p[1] - c[1]) for c in chosen)))
        taken.extend(chosen)
        return chosen

    plaza = [h for h in P['hot'] if h['k'] in ('bay', 'shop', 'npc')]
    px = np.mean([h['x'] for h in plaza]) if plaza else sx
    py = np.mean([h['y'] for h in plaza]) if plaza else sy - 300
    people = {'trainers': [], 'folk': [], 'legends': []}
    # townsfolk near the plaza
    near_plaza = free & (np.hypot(cx - px, cy - py) < 320)
    for i, (x, y) in enumerate(pick(near_plaza if near_plaza.any() else free, len(pop['townsfolk'].get(town, [])), 70, town + 'folk')):
        art, line = pop['townsfolk'][town][i]
        people['folk'].append({'x': x, 'y': y, 'art': art, 't': [line]})
    # tower apprentices near the Keeper's door
    keeper = next((h for h in P['hot'] if h['k'] == 'keeper'), None)
    if keeper and planets[town].get('keeper'):
        ring = free & (np.hypot(cx - keeper['x'], cy - keeper['y']) > 70) & (np.hypot(cx - keeper['x'], cy - keeper['y']) < 260)
        for i, (x, y) in enumerate(pick(ring, 2, 60, town + 'app')):
            people['trainers'].append({'id': f'{town}_app{i + 1}', 'x': x, 'y': y, 'app': 1})
    # route trainers spread over the rest of the town
    for i, (x, y) in enumerate(pick(free, pop['trainer_count'].get(town, 4), 140, town + 'tr')):
        people['trainers'].append({'id': f'{town}_tr{i + 1}', 'x': x, 'y': y})
    classes, names = pop['classes'][town], pop['names']
    for i, t in enumerate(people['trainers']):
        cls, art = classes[(i + (2 if t.get('app') else 0)) % len(classes)]
        t.update({'cls': 'Apprentice' if t.get('app') else cls, 'art': art, 'name': names[h32(town + t['id']) % len(names)],
                  'face': facing(walk, t['x'], t['y'])})
    if town == 'ystra':   # Terravox, Aquelion and Ignarch wait here after the Champion
        for name, (x, y) in zip(['Terravox', 'Aquelion', 'Ignarch'], pick(free, 3, 220, 'ystra-legends')):
            people['legends'].append({'mon': name, 'x': x, 'y': y, 'lv': 60})
    out[town] = people
    print(f"{town}: {len(people['trainers'])} trainers ({sum(1 for t in people['trainers'] if t.get('app'))} apprentices), {len(people['folk'])} townsfolk, {len(people['legends'])} legendaries")

json.dump(out, open(os.path.join(ROOT, 'data/town_people.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
