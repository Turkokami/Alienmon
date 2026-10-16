"""Rebuild art/scene_library (the map editor's Scenes tab) from the owner's scene folder.
usage: python tools/scene_library.py ["C:/Users/turko/Documents/GitHub/Alienmon/art/alienmon extra scenes"]
Files are named '<World> - <Extra scenes|Residential|Crossroads|Interior rooms> - <NN Title>.png'.
Each is shrunk to game size (render 64 px per tile -> 16 px). Pictures removed from the folder are removed here too."""
import os, sys, json, re
from collections import Counter
from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else 'C:/Users/turko/Documents/GitHub/Alienmon/art/alienmon extra scenes'
D = {'Apex Array': '13_apex', 'Dustara': '01_dustara', 'Ferrox': '02_ferrox', 'Glacia': '08_glacia', 'Glyphos': '06_glyphos', 'Halo': '10_halo',
     'Helix Station': '09_helix', 'Neonis': '05_neonis', 'Pyros': '07_pyros', 'Sporeholm': '03_sporeholm', 'Starfall Rift': '12_starfall',
     'Thalassa': '04_thalassa', 'Umbra': '11_umbra', 'Ystra': '14_ystra'}
GROUP = {'extra scenes': 'outdoor', 'residential': 'residential', 'crossroads': 'crossroads', 'interior rooms': 'interior'}
PRE = {'residential': 'res_', 'crossroads': 'x_'}
out, seen, keep = [], set(), set()
for f in sorted(os.listdir(SRC)):
    m = re.match(r'(.+?) - (Extra scenes|Interior rooms|Residential|Crossroads) - (.+)\.(png|jpg|webp)$', f, re.I)
    if not m or m.group(1) not in D:
        continue
    d, g, title = D[m.group(1)], GROUP[m.group(2).lower()], m.group(3)
    slug = PRE.get(g, '') + re.sub(r'[^a-z0-9]+', '_', title.lower()).strip('_')
    k, n = f'{d}/{slug}', 2
    while k in seen:
        k, n = f'{d}/{slug}_{n}', n + 1
    seen.add(k); fp = f'art/scene_library/{k}.png'; keep.add(fp)
    if os.path.exists(fp):
        W, H = [v // 16 for v in Image.open(fp).size]
    else:
        im = Image.open(os.path.join(SRC, f)).convert('RGB')
        W, H = (24, 16) if g != 'interior' or im.size[0] > im.size[1] * 1.2 else (16, 16)
        os.makedirs(os.path.dirname(fp), exist_ok=True)
        im.resize((W * 64, H * 64), Image.LANCZOS).resize((W * 16, H * 16), Image.BOX).save(fp, optimize=True)
    out.append({'id': k, 'dir': d, 'name': re.sub(r'^\d+\s*', '', title), 'kind': 'interior' if g == 'interior' else 'outdoor',
                'group': g, 'tiles': [W, H], 'file': fp})
gone = []
for r, _, fs in os.walk('art/scene_library'):
    for f in fs:
        p = os.path.join(r, f).replace(os.sep, '/')
        if f.endswith('.png') and p not in keep:
            os.remove(p); gone.append(p)
json.dump(out, open('art/scene_library/index.json', 'w', encoding='utf-8'), indent=0, ensure_ascii=False)
print(len(out), 'scenes', dict(Counter(x['group'] for x in out)), 'removed:', gone)
