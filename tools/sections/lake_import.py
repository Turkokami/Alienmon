"""Lake map re-renders (docs/packs_2026_10_25b/lake_maps): the owner's new art replaces each lake map's art and collision.

    python tools/sections/lake_import.py [ids...]

Owner renders live in art/raw/lakes/<id>_<slug>.png (never modified). tools/sections/lake_rows.json gives per map
"rows" (16 strings of 24, hand-traced on a tile grid: . walk , grass # blocked; water is blocked and marked by kit_fluids.py)
and "exits" (the full atlas exit list, e.g. "bottom edge, tile columns 11–12 → Fjord Islands"). Writes the game art,
data/collision/<id>.json and the atlas exits. Then: kit_fluids.py <ids>, build_world.py.
"""
import glob, json, os, sys
from PIL import Image

L = json.load(open('tools/sections/lake_rows.json', encoding='utf-8'))
AT = json.load(open('art/sections/atlas.json', encoding='utf-8')); A = {s['id']: s for s in AT['sections']}
W = json.load(open('data/world.json', encoding='utf-8'))['sections']
for sid in (sys.argv[1:] or sorted(L)):
    cfg = L[sid]; rows = cfg['rows']
    assert len(rows) == 16 and all(len(r) == 24 for r in rows), sid
    src = glob.glob(f'art/raw/lakes/{sid}_*.png')[0]
    im = Image.open(src).convert('RGB')
    im.resize((24 * 16, 16 * 16), Image.LANCZOS).save(W[sid]['img'], optimize=True)
    c = json.load(open(f'data/collision/{sid}.json'))
    c.update(rows=rows, edited=True, lake_rerender=os.path.basename(src)); json.dump(c, open(f'data/collision/{sid}.json', 'w'))
    f = f'data/sections/fluids/{sid}.json'
    if os.path.exists(f) and not json.load(open(f)).get('hand'): os.remove(f)   # old water no longer matches; kit_fluids redoes it
    A[sid]['exits'] = cfg['exits']; A[sid]['notes'] = 'lake re-render (owner art ' + os.path.basename(src) + ')'
    print(sid, A[sid]['name'], 'walk', sum(ch != '#' for r in rows for ch in r), 'grass', sum(ch == ',' for r in rows for ch in r))
AT['sections'] = list(A.values())
json.dump(AT, open('art/sections/atlas.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
