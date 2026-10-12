"""Place quest givers, props, trainers and spots on the painted town maps.

quests.json was written before most towns were painted, so many town locations have no x/y ("tile map...") or
coordinates that now fall on a wall. This picks a reachable, walkable spot for each of those, clear of hotspots
and of each other, and writes data/quest_places.json ("<quest>:<step>" or "<quest>:giver" -> {x, y}).
Molten Frontier locations are left alone (world_map.json coordinates already fit).

Usage: python tools/place_quests.py      (re-run after editing data/towns/*.json or data/quests.json)
"""
import json, os, base64, hashlib
import numpy as np
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
pm = json.load(open(os.path.join(ROOT, 'data/painted_maps.json'), encoding='utf-8'))
quests = json.load(open(os.path.join(ROOT, 'data/quests.json'), encoding='utf-8'))['quests']
CELL, GW, GH = 8, 192, 128


def unpack(b64):
    b = base64.b64decode(b64)
    return np.array([(b[i >> 3] >> (i & 7)) & 1 for i in range(GW * GH)], bool).reshape(GH, GW)


def free_cells(P):
    """Walkable cells reachable from the landing point, at least 40px from every hotspot edge."""
    walk = unpack(P['walk'])
    yy, xx = np.mgrid[0:GH, 0:GW]
    cx, cy = xx * CELL + 4, yy * CELL + 4
    clear = walk.copy()
    for h in P['hot']:
        ry = h.get('ry') or h['r'] / 1.6
        clear &= ((h['x'] - cx) / (h['r'] + 40)) ** 2 + ((h['y'] - cy) / (ry + 40)) ** 2 >= 1
    lab, _ = ndimage.label(walk)
    sx, sy = P['start'][0], P['exitY'] - 30
    comp = lab == lab[int(sy // CELL), int(sx // CELL)]
    # stay away from the landing area so quest figures don't crowd the arrival point
    far = np.hypot(cx - sx, cy - sy) > 120
    return clear & comp & far, cx, cy


def town_key(loc):
    if not loc or loc.get('area') == 'molten_frontier':
        return None
    return loc.get('planet') if loc.get('planet') in pm else None


places, taken = {}, {}
for q in quests:
    entries = [('giver', q['location'])] if q['type'] == 'side' else []
    entries += [(i, o.get('location')) for i, o in enumerate(q['objectives'])]
    for key, loc in entries:
        t = town_key(loc)
        if not t:
            continue
        P = pm[t]
        cells, cx, cy = free_cells(P)
        cells = cells.copy()
        for (x, y) in taken.get(t, []):
            cells &= np.hypot(cx - x, cy - y) >= 48
        ys, xs = np.nonzero(cells)
        if not len(xs):
            print('no room for', q['id'], key, 'in', t)
            continue
        x0, y0 = loc.get('x'), loc.get('y')
        # a location on top of a painted character or service is meant to be that character: keep it
        if x0 is not None and any(h['k'] in ('talk', 'npc', 'mon', 'keeper', 'bay', 'shop') and np.hypot(h['x'] - x0, h['y'] - y0) < 50 for h in P['hot']):
            taken.setdefault(t, []).append((x0, y0))
            continue
        if x0 is not None and cells[min(GH - 1, int(y0 // CELL)), min(GW - 1, int(x0 // CELL))]:
            taken.setdefault(t, []).append((x0, y0))
            continue    # already on good ground
        if x0 is None:
            # spread quests around town deterministically
            h = int(hashlib.md5(f"{q['id']}:{key}".encode()).hexdigest(), 16)
            i = h % len(xs)
        else:
            i = int(np.argmin(np.hypot(cx[ys, xs] - x0, cy[ys, xs] - y0)))
        x, y = int(cx[ys[i], xs[i]]), int(cy[ys[i], xs[i]])
        places[f"{q['id']}:{key}"] = {'x': x, 'y': y}
        taken.setdefault(t, []).append((x, y))

json.dump(places, open(os.path.join(ROOT, 'data/quest_places.json'), 'w'), indent=1)
print(len(places), 'quest locations placed on painted towns')
