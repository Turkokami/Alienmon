"""Turn a walkable town spec into a painted map the game can use.

Usage:  python tools/paint_town.py data/towns/pyros.json [--overlay out.png] [--dry]   (--dry: check and overlay only, write nothing)
        python tools/paint_town.py --all              (rebuild every spec in data/towns)

A spec (data/towns/<planetKey>.json) holds:
  planet   planet key from planets.json            town   name shown in the landing banner
  src      the 1536x1024 town render               S      draw scale (0.21-0.25; smaller = more zoomed out)
  start    [x, y] where the player appears          exitY  walking down past this y leaves town (keep near 1000)
  walk     polygons [[x,y],...] the player can stand in
  nowalk   polygons cut back out of walk (buildings, lamp posts, lava inside a plaza...)
  grass    polygons where wild Alienmon can jump out (only counts where also walkable)
  base     optional: a saved painted map (data/towns/base/<planet>.json, one of the three original hand-made towns)
           whose walk/grass masks, image, start, exit and hotspots are kept; walk/grass/hot in the spec are added on top
  hot      hotspots, same format as data/painted_maps.json:
             {x,y,r,ry?,k,hint?,t?,art?,mon?}  k = bay | shop | npc | keeper | ship | talk | mon | block
             'art' on a talk/npc spot is the dialogue portrait, and with "draw": true the character is also drawn standing there; 'mon' on a mon spot draws that
             Alienmon's overworld sprite there (and makes it the one you battle).
It writes art/scenes/<planet>_town_hd.jpg, updates the planet's entry in data/painted_maps.json, checks that
the start, the exit and every hotspot are reachable, and can draw an overlay (red = blocked, green = grass).
"""
import sys, os, json, base64, glob
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H, CELL = 1536, 1024, 8
GW, GH = W // CELL, H // CELL
REACH = 44   # same reach the game uses to offer an interaction


def poly_mask(polys):
    im = Image.new('L', (GW, GH), 0); d = ImageDraw.Draw(im)
    for p in polys or []:
        # rasterise at cell resolution: a cell counts when its centre is inside the polygon
        d.polygon([((x - CELL / 2) / CELL, (y - CELL / 2) / CELL) for x, y in p], fill=1)
    return np.asarray(im).astype(bool)


def pack(mask):
    bits = mask.reshape(-1)
    out = bytearray(len(bits) // 8)
    for i in np.flatnonzero(bits): out[i >> 3] |= 1 << (i & 7)
    return base64.b64encode(bytes(out)).decode()


def hot_mask(hot):
    """Cells covered by hotspot ellipses (the game treats them as solid)."""
    yy, xx = np.mgrid[0:GH, 0:GW]; cx, cy = xx * CELL + CELL / 2, yy * CELL + CELL / 2
    m = np.zeros((GH, GW), bool)
    for h in hot:
        ry = h.get('ry') or h['r'] / 1.6
        m |= ((h['x'] - cx) / h['r']) ** 2 + ((h['y'] - cy) / ry) ** 2 < 1
    return m


def check(spec, walk):
    """Reachability from the start over walkable cells not covered by hotspots."""
    free = walk & ~hot_mask(spec['hot'])
    sx, sy = spec['start'][0], spec['exitY'] - 30   # the game drops the player here on landing
    probs = []
    if not free[int(sy // CELL), int(sx // CELL)]:
        probs.append(f'landing point ({sx},{sy}) is not walkable')
        return probs
    lab, _ = ndimage.label(free); comp = lab == lab[int(sy // CELL), int(sx // CELL)]
    if not comp[int(spec['exitY'] // CELL):].any() and not comp[min(GH - 1, int((spec['exitY'] - 8) // CELL))].any():
        probs.append('exit line is not reachable')
    yy, xx = np.mgrid[0:GH, 0:GW]; cx, cy = xx * CELL + CELL / 2, yy * CELL + CELL / 2
    for h in spec['hot']:
        if h['k'] == 'block': continue
        ry = h.get('ry') or h['r'] / 1.6
        e = np.sqrt(((h['x'] - cx) / h['r']) ** 2 + ((h['y'] - cy) / ry) ** 2)
        dist = np.hypot(h['x'] - cx, h['y'] - cy); edge = dist - dist / np.maximum(e, 1e-3)
        if not (comp & (edge < REACH - 6)).any():
            probs.append(f"hotspot {h['k']} {h.get('hint') or h.get('art') or h.get('mon') or ''} at ({h['x']},{h['y']}) can't be reached")
    return probs


def overlay(spec, walk, grass, path):
    im = Image.open(os.path.join(ROOT, spec['src'])).convert('RGB').resize((W, H))
    a = np.asarray(im).astype(float)
    big = lambda m: np.kron(m, np.ones((CELL, CELL))).astype(bool)
    bw, bg = big(walk), big(grass)
    a[~bw] = a[~bw] * 0.45 + np.array([200, 0, 0]) * 0.55
    a[bg] = a[bg] * 0.6 + np.array([0, 220, 0]) * 0.4
    out = Image.fromarray(a.astype(np.uint8)); d = ImageDraw.Draw(out)
    col = {'bay': 'cyan', 'shop': 'yellow', 'keeper': 'magenta', 'npc': 'white', 'talk': 'white', 'mon': 'lime', 'ship': 'orange', 'block': 'red'}
    for h in spec['hot']:
        ry = h.get('ry') or h['r'] / 1.6
        d.ellipse([h['x'] - h['r'], h['y'] - ry, h['x'] + h['r'], h['y'] + ry], outline=col.get(h['k'], 'white'), width=3)
        d.text((h['x'] - 20, h['y'] - ry - 14), h['k'] + ' ' + str(h.get('hint') or h.get('art') or h.get('mon') or ''), fill=col.get(h['k'], 'white'))
    sx, sy = spec['start'][0], spec['exitY'] - 30
    d.ellipse([sx - 10, sy - 10, sx + 10, sy + 10], fill='blue'); d.line([(0, spec['exitY']), (W, spec['exitY'])], fill='blue', width=3)
    out.save(path)


def unpack(b64):
    b = base64.b64decode(b64)
    return np.array([(b[i >> 3] >> (i & 7)) & 1 for i in range(GW * GH)], bool).reshape(GH, GW)


def build(spec_path, overlay_path=None, dry=False):
    spec = json.load(open(spec_path, encoding='utf-8'))
    base = json.load(open(os.path.join(ROOT, spec['base']), encoding='utf-8')) if spec.get('base') else None
    if base:   # an original hand-made town: keep everything it had and add the spec's areas and hotspots
        for k in ('S', 'start', 'exitY', 'town'): spec.setdefault(k, base[k])
        spec['hot'] = base['hot'] + spec.get('hot', [])
        spec['src'] = 'art/scenes/' + base['img'] + '.jpg'
    walk = (poly_mask(spec.get('walk')) | (unpack(base['walk']) if base else False)) & ~poly_mask(spec.get('nowalk'))
    grass = (poly_mask(spec.get('grass')) | (unpack(base['grass']) if base else False)) & walk
    img = base['img'] if base else spec['planet'] + '_town_hd'
    probs = check(spec, walk)
    if overlay_path: overlay(spec, walk, grass, overlay_path)
    print(f"{spec['planet']}: {walk.sum()} walkable cells, {grass.sum()} grass cells, {len(spec['hot'])} hotspots" + ('' if not probs else '\n  PROBLEMS:\n  ' + '\n  '.join(probs)))
    if dry: return not probs
    if not base:
        src = Image.open(os.path.join(ROOT, spec['src'])).convert('RGB')
        if src.size != (W, H): src = src.resize((W, H), Image.LANCZOS)
        src.save(os.path.join(ROOT, 'art/scenes', img + '.jpg'), quality=84, optimize=True)
    pm_path = os.path.join(ROOT, 'data/painted_maps.json')
    pm = json.load(open(pm_path, encoding='utf-8'))
    pm[spec['planet']] = {'img': img, 'S': spec.get('S', 0.22), 'w': W, 'h': H, 'cell': CELL, 'walk': pack(walk), 'grass': pack(grass),
                          'start': spec['start'], 'exitY': spec['exitY'], 'town': spec['town'], 'hot': spec['hot']}
    json.dump(pm, open(pm_path, 'w', encoding='utf-8'), ensure_ascii=False)
    return not probs


if __name__ == '__main__':
    args = sys.argv[1:]
    ov = args[args.index('--overlay') + 1] if '--overlay' in args else None
    # data/towns/base/ holds inputs, not specs
    specs = sorted(glob.glob(os.path.join(ROOT, 'data/towns/*.json'))) if '--all' in args else [args[0]]
    ok = all([build(s, ov if len(specs) == 1 else None, '--dry' in args) for s in specs])
    sys.exit(0 if ok else 1)
