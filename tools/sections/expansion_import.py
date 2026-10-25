"""World expansion: the owner's 28 new hidden areas (docs/packs_2026_10_25b/world_expansion), two per world, each joined to a
former dead end. Re-runnable.

    python tools/sections/expansion_import.py [--recollide]

For each render in art/raw/expansion/XNN_<world>_<slug>.png (owner art, never modified) it
  * gives it section id 916+NN, writes the game art (64 render px per tile -> 16) to art/kit/<dir>/ and art/sections_game/<dir>/,
  * traces collision with the kit tracer (the world's own road and grass colours), keeps only ground reachable from the entrance,
    opens the entrance band, then applies hand fixes from tools/sections/v3/spec/<id>.json,
  * adds the atlas entry and the matching exit on the parent map, and reopens the parent's sealed edge into a short path.
Then run tools/sections/build_world.py.
"""
import glob, json, os, re, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'v3'))
from kitcol import auto
from kit_import import world_roads, world_grass, apply_spec, edge_runs, slug

RAW = 'art/raw/expansion'
# number: (parent id, parent side, (a, b)); the new area's entrance is the opposite side, same tiles. 24 hangs off 23.
JOIN = {1: ('460', 'right', (3, 8)), 2: ('465', 'top', (14, 19)), 3: ('497', 'top', (13, 18)), 4: ('491', 'right', (10, 12)),
        5: ('719', 'top', (16, 20)), 6: ('720', 'top', (14, 19)), 7: ('783', 'bottom', (9, 11)), 8: ('790', 'left', (9, 11)),
        9: ('654', 'top', (13, 20)), 10: ('647', 'right', (10, 12)), 11: ('557', 'left', (6, 9)), 12: ('561', 'top', (13, 19)),
        13: ('681', 'bottom', (15, 19)), 14: ('688', 'right', (9, 12)), 15: ('526', 'bottom', (10, 12)), 16: ('529', 'right', (9, 12)),
        17: ('621', 'right', (9, 11)), 18: ('618', 'left', (9, 15)), 19: ('114', 'left', (4, 10)), 20: ('588', 'bottom', (17, 20)),
        21: ('827', 'top', (14, 19)), 22: ('821', 'right', (8, 10)), 23: ('755', 'top', (14, 19)), 24: ('939', 'top', (15, 17)),
        25: ('415', 'right', (9, 14)), 26: ('422', 'top', (14, 19)), 27: ('153', 'left', (5, 10)), 28: ('858', 'top', (14, 19))}
# where a render's path meets the edge somewhere other than the guide asked (tools/sections/expansion_samples.json "entrance")
NEWR = {k: tuple(v['entrance']) for k, v in json.load(open('tools/sections/expansion_samples.json', encoding='utf-8')).items() if 'entrance' in v}
SIDE = {k: v['side'] for k, v in json.load(open('tools/sections/expansion_samples.json', encoding='utf-8')).items() if 'side' in v}
OPP = {'left': 'right', 'right': 'left', 'top': 'bottom', 'bottom': 'top'}
KIND = {'left': 'rows', 'right': 'rows', 'top': 'columns', 'bottom': 'columns'}
recol = '--recollide' in sys.argv


def band(side, a, b, W, H, depth):
    """Tiles of an edge band: the range along the edge, `depth` tiles inward."""
    for k in range(a, b + 1):
        for d in range(depth):
            yield {'top': (k, d), 'bottom': (k, H - 1 - d), 'left': (d, k), 'right': (W - 1 - d, k)}[side]


def reach(rows, seeds):
    H, W = len(rows), len(rows[0]); seen = set(s for s in seeds if rows[s[1]][s[0]] != '#'); st = list(seen)
    while st:
        x, y = st.pop()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < W and 0 <= ny < H and (nx, ny) not in seen and rows[ny][nx] != '#': seen.add((nx, ny)); st.append((nx, ny))
    return seen


def carve(rows, side, a, b, maxd=8):
    """Open the sealed edge band of a map: each column/row of the range walks inward until it meets ground (max maxd tiles)."""
    H, W = len(rows), len(rows[0]); g = [list(r) for r in rows]; short = []
    for k in range(a, b + 1):
        path = []
        for d in range(maxd):
            x, y = {'top': (k, d), 'bottom': (k, H - 1 - d), 'left': (d, k), 'right': (W - 1 - d, k)}[side]
            if g[y][x] != '#' and d >= 1: break
            path.append((x, y))
        else:
            short.append(k); continue
        for x, y in path: g[y][x] = '.'
    return [''.join(r) for r in g], short


def main():
    AT = json.load(open('art/sections/atlas.json', encoding='utf-8')); A = {s['id']: s for s in AT['sections']}
    kit = json.load(open('tools/sections/v3/kit.json', encoding='utf-8'))
    files = sorted(glob.glob(f'{RAW}/X*.png'))
    names = {}
    for f in files:
        n = int(os.path.basename(f)[1:3]); names[n] = ' '.join(w.capitalize() if w not in ('of', 'the') else w for w in os.path.basename(f)[:-4].split('_')[2:])
    names = {n: v.replace('Hall of Champions', "Hall of Champions") for n, v in names.items()}
    report = []
    roads = {}
    for f in files:
        n = int(os.path.basename(f)[1:3]); sid = str(916 + n); pid, pside, (a, b) = JOIN[n]
        parent = A[pid] if pid in A else None
        pdir = os.path.dirname(parent['file']).split('/')[-1] if parent else None
        if parent is None:   # hangs off another new area (imported earlier in this loop)
            parent = A[pid]; pdir = os.path.dirname(parent['file']).split('/')[-1]
        name = names[n]; side = SIDE.get(sid, OPP[pside]); na, nb = NEWR.get(sid, (a, b))   # the new area's own opening (side and tiles)
        im = Image.open(f).convert('RGB'); W, H = round(im.width / 64), round(im.height / 64)
        out = f'art/kit/{pdir}/{sid}_hidden_area_{slug(name)}.png'; game = f'art/sections_game/{pdir}/{sid}_{slug(name)}.png'
        os.makedirs(os.path.dirname(out), exist_ok=True)
        small = im.resize((W * 16, H * 16), Image.LANCZOS); small.save(out, optimize=True); small.save(game, optimize=True)
        cp = f'data/collision/{sid}.json'
        if recol or not os.path.exists(cp):
            if pdir not in roads: roads[pdir] = (world_roads(pdir), world_grass(pdir))
            rows, _ = auto(small, 'outdoor', roads=roads[pdir][0], grass=roads[pdir][1])
            g = [list(r) for r in rows]
            for x, y in band(side, a, b, W, H, 2): g[y][x] = '.' if g[y][x] == '#' else g[y][x]
            rows = [''.join(r) for r in g]
            rows, short = carve(rows, side, a, b)
            if short: report.append(f'{sid} {name}: entrance tiles {short} needed more than 8 tiles of carving')
            seen = reach(rows, list(band(side, a, b, W, H, 1)))
            rows = [''.join(c if (x, y) in seen or c == '#' else '#' for x, c in enumerate(r)) for y, r in enumerate(rows)]
        else:
            rows = json.load(open(cp))['rows']
        rows = apply_spec(rows, sid)
        walk = sum(c != '#' for r in rows for c in r); grass = sum(c == ',' for r in rows for c in r)
        if walk < 60 or grass < 6: report.append(f'{sid} {name}: only {walk} walkable / {grass} grass tiles, check by eye')
        json.dump({'id': sid, 'name': name, 'tiles': [W, H], 'edited': True, 'v3': True, 'expansion': True,
                   'legend': {'.': 'walk', '#': 'blocked', ',': 'tall grass'}, 'rows': rows}, open(cp, 'w'))
        ex = f"{side} edge, tile {KIND[side]} {na}–{nb} → {parent['name']}"
        A[sid] = {'id': sid, 'planet': parent['planet'], 'name': name, 'type': 'field', 'size_px': [im.width, im.height], 'tiles': [W, H],
                  'tile_px_render': 64, 'tile_px_game': 16, 'exits': [ex] + [e for e in A.get(sid, {}).get('exits', []) if not e.endswith('→ ' + parent['name'])],
                  'notes': 'world expansion (owner render ' + os.path.basename(f) + ')', 'v3': True, 'kit': sid, 'file': out}
        back = f"{pside} edge, tile {KIND[pside]} {a}–{b} → {name}"
        parent['exits'] = [e for e in parent['exits'] if not e.endswith('→ ' + name)] + [back]
        # the parent's edge was sealed as a dead end: open it into a path to the new area
        pc = json.load(open(f'data/collision/{pid}.json')); prow, short = carve(pc['rows'], pside, a, b)
        if short: report.append(f'{pid} {parent["name"]}: {pside} edge tiles {short} meet no ground within 8 tiles')
        pc['rows'] = prow; json.dump(pc, open(f'data/collision/{pid}.json', 'w'))
        kit[sid] = {'src': os.path.basename(f), 'dir': pdir, 'world': parent['planet'], 'cat': 'Hidden Area', 'title': name, 'name': name, 'alt': False,
                    'type': 'field', 'tiles': [W, H], 'file': out, 'exits': edge_runs(rows), 'expansion': True}
        AT['sections'] = list(A.values())
    json.dump(AT, open('art/sections/atlas.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    json.dump(dict(sorted(kit.items())), open('tools/sections/v3/kit.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    print(len(files), 'areas imported'); print('\n'.join(report) or 'no problems')


if __name__ == '__main__':
    main()
