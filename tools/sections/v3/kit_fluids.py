"""Water ('~', Hydro-skiff) and lava ('^', Heat Shield) for the V3 kit maps, found from the art: blocked tiles whose
colour is open water or molten lava, in pools of 4+ tiles that touch walkable ground. Writes data/sections/fluids/<id>.json
(only for maps that have none written by hand: a file with "hand": true is never touched).
    python tools/sections/v3/kit_fluids.py [--show OUTDIR] [ids...]"""
import json, os, sys, glob
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
SKIP = ('interior', 'tower', 'arena')
NOT = {'409', '420', '551', '775', '747', '753', '818', '823'}   # checked by eye: crystal shrines, void cracks, snow
WET = ('Shore', 'Lake', 'Lagoon', 'Canal', 'Bog', 'Marsh', 'Falls', 'Tarn', 'Pool', 'Channel', 'Shallows', 'Grotto', 'Sea ', 'River', 'Inlet', 'Cove',
       'Tide', 'Water', 'Oasis', 'Reservoir', 'Basin', 'Islands', 'Fjord', 'Tank', 'Mirror', 'Sea', 'Lava', 'Coolant', 'Floe', 'Fen', 'Mire', 'Island', 'Bend', 'Stream', 'Hydro', 'Fork')
# water routes whose water the strict colour test misses (ice floes break up Icy Fjord's water; Cloud Lagoon's is pale): a looser test
RELAX = {'882', '883', '891', '892', '913'}
SURF = {k for k, v in json.load(open('data/encounters.json', encoding='utf-8')).items() if any(e['method'] == 'surf' for e in v['encounters'])}


def classify(img, rows, world='', wet=True, relax=False):
    H, W = len(rows), len(rows[0])
    a = np.asarray(img.convert('RGB').resize((W * 16, H * 16), Image.BOX)).astype(float).reshape(H, 16, W, 16, 3)
    m = a.mean((1, 3)); sd = a.std((1, 3)).mean(-1)
    r, g, b = m[..., 0], m[..., 1], m[..., 2]
    blocked = np.array([[c == '#' for c in row] for row in rows])
    water = wet & blocked & (r < 125) & (b > r + 40) & (b > 70) & (sd < 42) & ~((g > b + 10))   # blue/teal open water, fairly smooth
    if relax: water = wet & blocked & (b > r + 18) & (b > 85) & (sd < 62) & ~((g > b + 10)) & ~((r > 200) & (g > 200))   # bluer than it is red, not white ice
    lava = (world == 'pyros') & blocked & (r > 170) & (r - b > 110) & (g > 50) & (g < 190) & (sd < 60)
    walk = ~blocked
    out = {}
    for k, msk in (('water', water), ('lava', lava)):
        lab, n = ndimage.label(msk); keep = np.zeros_like(msk)
        for i in range(1, n + 1):
            c = lab == i
            if c.sum() < 4: continue
            if not (ndimage.binary_dilation(c) & walk).any(): continue
            keep |= c
        out[k] = keep
    return out


def rects(msk):
    out = []
    H, W = msk.shape
    for y in range(H):
        x = 0
        while x < W:
            if msk[y, x]:
                x0 = x
                while x < W and msk[y, x]: x += 1
                out.append([x0, y, x - 1, y])
            else: x += 1
    return out


def main():
    args = sys.argv[1:]; show = None
    if '--show' in args: i = args.index('--show'); show = args[i + 1]; del args[i:i + 2]
    world = json.load(open('data/world.json', encoding='utf-8'))['sections']
    ids = args or [sid for sid in world if int(sid) >= 400]
    n = 0
    for sid in ids:
        s = world.get(sid)
        if not s or s['type'] in SKIP: continue
        if sid in NOT:
            if os.path.exists(f'data/sections/fluids/{sid}.json') and json.load(open(f'data/sections/fluids/{sid}.json')).get('auto'): os.remove(f'data/sections/fluids/{sid}.json')
            continue
        f = f'data/sections/fluids/{sid}.json'
        if os.path.exists(f) and json.load(open(f)).get('hand'): continue
        rows = json.load(open(f'data/collision/{sid}.json'))['rows']
        img = Image.open(s['img'])
        wet = sid in SURF or any(w in s['name'] for w in WET)
        c = classify(img, rows, s.get('pkey', ''), wet, sid in RELAX)
        F = {'water': rects(c['water']), 'lava': rects(c['lava']), 'auto': True}
        if F['water'] or F['lava']:
            json.dump(F, open(f, 'w')); n += 1
            if show:
                im = img.convert('RGB').resize((len(rows[0]) * 32, len(rows) * 32)); d = ImageDraw.Draw(im, 'RGBA')
                for k, col in (('water', (255, 0, 255, 150)), ('lava', (0, 255, 255, 150))):
                    for x0, y, x1, _ in F[k]: d.rectangle([x0 * 32, y * 32, x1 * 32 + 31, y * 32 + 31], fill=col)
                os.makedirs(show, exist_ok=True); im.save(f'{show}/{sid}.jpg', quality=80)
        elif os.path.exists(f) and json.load(open(f)).get('auto'): os.remove(f)
    print(n, 'maps with water or lava')


if __name__ == '__main__': main()
