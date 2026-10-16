"""Import the owner's V3 world kits ('alienmon extra scenes' folder) as map sections.

    python tools/sections/v3/kit_import.py [--world 02_ferrox] [--force]

For every map-type picture (Spaceport, Residential, Crossroads, Extra scenes, Water Route, Hidden Area, Cave,
Relay Tower, Battle Arena, Helix Hideout, Recovery Bay, Shop, Interior rooms) it:
  * gives it a stable section id (kept in tools/sections/v3/kit.json; new ones count up from 400),
  * writes the game-size art to art/sections_game/<dir>/<id>_<slug>.png (64 render px per tile -> 16 px),
  * writes automatic collision to data/collision/<id>.json, then applies hand fixes from tools/sections/v3/spec/<id>.json
    ({"walk":[[x0,y0,x1,y1]], "block":[...], "gr":[...]} inclusive rects, like V2),
  * records the walkable runs on each edge (the scene's exits) in kit.json.
Pictures named '(1)', '(2)', 'option 2' are alternates: imported (so they can be swapped in) but marked alt.
Night, Battle Background, Tileset and Sprite sheet pictures are not map sections and are skipped here.
Writes an overlay contact sheet per world to tools/sections/v3/review/<dir>.png for checking by eye.
"""
import os, re, sys, json
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(__file__))
from kitcol import auto

SRC = 'C:/Users/turko/Documents/GitHub/Alienmon/art/alienmon extra scenes'
HERE = 'tools/sections/v3'
DIRS = {'Dustara': '01_dustara', 'Ferrox': '02_ferrox', 'Sporeholm': '03_sporeholm', 'Thalassa': '04_thalassa', 'Neonis': '05_neonis',
        'Glyphos': '06_glyphos', 'Pyros': '07_pyros', 'Glacia': '08_glacia', 'Helix Station': '09_helix', 'Halo': '10_halo', 'Umbra': '11_umbra',
        'Starfall Rift': '12_starfall', 'Apex Array': '13_apex', 'Ystra': '14_ystra'}
# category -> (section type, collision kind)
CATS = {'Spaceport': ('landmark', 'outdoor'), 'Residential': ('town', 'outdoor'), 'Crossroads': ('route', 'outdoor'), 'Extra scenes': ('route', 'outdoor'),
        'Water Route': ('route', 'outdoor'), 'Hidden Area': ('field', 'outdoor'), 'Cave': ('cave', 'cave'), 'Relay Tower': ('tower', 'interior'),
        'Battle Arena': ('arena', 'interior'), 'Helix Hideout': ('dungeon', 'interior'), 'Recovery Bay': ('interior', 'interior'),
        'Shop': ('interior', 'interior'), 'Interior rooms': ('interior', 'interior')}


def outdoorish(cat, title):
    """Exteriors drawn as an outdoor scene even when the category is a building."""
    return cat in ('Relay Tower', 'Battle Arena', 'Helix Hideout', 'Cave') and re.search(r'Exterior|Entrance', title)


def parse(f):
    m = re.match(r'(.+?) - (.+?) - (.+)\.png$', f) or re.match(r'(.+?) - (.+?)\.png$', f)
    if not m or m.group(1) not in DIRS: return None
    cat = re.sub(r' \d+$', '', m.group(2)).strip()
    if cat not in CATS: return None
    title = (m.group(3) if m.lastindex >= 3 else '') or cat
    alt = bool(re.search(r'\((\d|organic undefined)\)|option [2-9]|\(test\)', title))
    return DIRS[m.group(1)], m.group(1), cat, title, alt


def slug(s): return re.sub(r'[^a-z0-9]+', '_', s.lower()).strip('_')


def apply_spec(rows, sid):
    p = f'{HERE}/spec/{sid}.json'
    if not os.path.exists(p): return rows
    sp = json.load(open(p)); g = [list(r) for r in rows]
    for k, ch in (('walk', '.'), ('gr', ','), ('block', '#')):
        for x0, y0, x1, y1 in sp.get(k, []):
            for y in range(y0, y1 + 1):
                for x in range(x0, x1 + 1):
                    if 0 <= y < len(g) and 0 <= x < len(g[0]): g[y][x] = ch
    return [''.join(r) for r in g]


def edge_runs(rows):
    H, W = len(rows), len(rows[0]); out = {}
    for side, line in (('left', [rows[y][0] in '.,' for y in range(H)]), ('right', [rows[y][W - 1] in '.,' for y in range(H)]),
                       ('top', [c in '.,' for c in rows[0]]), ('bottom', [c in '.,' for c in rows[H - 1]])):
        rr, cur = [], []
        for i, v in enumerate(line + [False]):
            if v: cur.append(i)
            elif cur:
                if len(cur) >= 2: rr.append([cur[0], cur[-1]])
                cur = []
        if rr: out[side] = rr
    return out


def world_roads(d):
    """Road colours for a world: the edge-reaching smooth region of each of its Crossroads pictures."""
    from kitcol import tile_stats
    from scipy import ndimage
    import numpy as np
    out = []
    for f in sorted(os.listdir(SRC)):
        p = parse(f)
        if not p or p[0] != d or p[2] != 'Crossroads' or p[4]: continue
        im = Image.open(os.path.join(SRC, f)).convert('RGB'); W, H = round(im.width / 64), round(im.height / 64)
        m, tex = tile_stats(im.resize((W * 16, H * 16), Image.LANCZOS))
        sm = tex < np.percentile(tex, 50) + 2
        # the middle cross of a crossroads picture is road
        mid = np.zeros_like(sm); mid[H // 2 - 2:H // 2 + 2, :] = True; mid[:, W // 2 - 2:W // 2 + 2] = True
        if (sm & mid).sum() >= 8: out.append([float(v) for v in np.median(m[sm & mid], axis=0)])
    return out


def main():
    only = sys.argv[sys.argv.index('--world') + 1] if '--world' in sys.argv else None
    force = '--force' in sys.argv
    kp = f'{HERE}/kit.json'; kit = json.load(open(kp, encoding='utf-8')) if os.path.exists(kp) else {}
    by_src = {v['src']: k for k, v in kit.items()}
    nxt = max([int(k) for k in kit] + [399]) + 1
    ROADS = {}
    for f in sorted(os.listdir(SRC)):
        p = parse(f)
        if not p: continue
        d, world, cat, title, alt = p
        if only and d != only: continue
        sid = by_src.get(f)
        if not sid: sid = str(nxt); nxt += 1
        typ, kind = CATS[cat]
        if outdoorish(cat, title): typ, kind = ('landmark' if cat != 'Cave' else 'route'), 'plain'
        if cat in ('Spaceport', 'Residential'): kind = 'plain'   # outdoor ground, but no wild grass in town
        im = Image.open(os.path.join(SRC, f)).convert('RGB')
        W, H = round(im.width / 64), round(im.height / 64)
        name = re.sub(r'^\d+\s*', '', title).strip()
        out = f'art/kit/{d}/{sid}_{slug(cat)}_{slug(name)}.png'
        if force or not os.path.exists(out):
            os.makedirs(os.path.dirname(out), exist_ok=True)
            im.resize((W * 16, H * 16), Image.LANCZOS).save(out, optimize=True)
        g = Image.open(out).convert('RGB')
        cp = f'data/collision/{sid}.json'
        if force or not os.path.exists(cp) or not json.load(open(cp)).get('v3_hand'):
            if d not in ROADS: ROADS[d] = world_roads(d)
            rows, _ = auto(g, kind, roads=ROADS[d] if kind in ('outdoor', 'plain') else None)
        else:
            rows = json.load(open(cp))['rows']
        rows = apply_spec(rows, sid)
        json.dump({'id': sid, 'name': name, 'tiles': [W, H], 'edited': True, 'v3': True, 'legend': {'.': 'walk', '#': 'blocked', ',': 'tall grass'}, 'rows': rows}, open(cp, 'w'))
        kit[sid] = {'src': f, 'dir': d, 'world': world, 'cat': cat, 'title': title, 'name': name, 'alt': alt, 'type': typ, 'tiles': [W, H], 'file': out, 'exits': edge_runs(rows)}
    json.dump(dict(sorted(kit.items())), open(kp, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    review(kit, only)
    print(len(kit), 'kit sections')


def review(kit, only):
    os.makedirs(f'{HERE}/review', exist_ok=True)
    for d in sorted({v['dir'] for v in kit.values()}):
        if only and d != only: continue
        ks = [k for k, v in kit.items() if v['dir'] == d]
        tiles = []
        for k in ks:
            v = kit[k]; g = Image.open(v['file']).convert('RGBA'); W, H = v['tiles']; Z = 2
            o = g.resize((W * 16 * Z, H * 16 * Z), Image.NEAREST); ov = Image.new('RGBA', o.size, (0, 0, 0, 0)); dr = ImageDraw.Draw(ov)
            rows = json.load(open(f'data/collision/{k}.json'))['rows']; T = 16 * Z
            for y, r in enumerate(rows):
                for x, c in enumerate(r):
                    if c == '#': dr.rectangle([x * T, y * T, x * T + T - 1, y * T + T - 1], fill=(255, 0, 0, 80))
                    elif c == ',': dr.rectangle([x * T + 3, y * T + 3, x * T + T - 4, y * T + T - 4], outline=(0, 255, 0, 255), width=2)
            for x in range(W): dr.text((x * T + 2, 1), str(x), fill=(255, 255, 0, 255))
            for y in range(H): dr.text((1, y * T + 2), str(y), fill=(255, 255, 0, 255))
            o.alpha_composite(ov); dd = ImageDraw.Draw(o); dd.rectangle([0, o.height - 14, o.width, o.height], fill=(0, 0, 0))
            dd.text((2, o.height - 13), f"{k} {v['cat']} - {v['name']}{' (alt)' if v['alt'] else ''} {json.dumps(v['exits'])}", fill=(255, 255, 0))
            tiles.append(o.convert('RGB'))
        C = 3; cw = max(t.width for t in tiles); ch = max(t.height for t in tiles)
        sheet = Image.new('RGB', (C * cw, ((len(tiles) + C - 1) // C) * ch), (20, 20, 20))
        for i, t in enumerate(tiles): sheet.paste(t, ((i % C) * cw, (i // C) * ch))
        sheet.save(f'{HERE}/review/{d}.jpg', quality=80)


if __name__ == '__main__':
    main()
