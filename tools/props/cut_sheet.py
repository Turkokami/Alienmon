"""Cut a prop sheet (props on a soft blurred backdrop) into transparent sprites.
usage: python tools/props/cut_sheet.py <sheet.png> <planet_dir e.g. 10_halo>
Writes art/props/<planet_dir>/<NN>.png at game scale (render 64 px per tile -> 16 px) and
art/props/<planet_dir>/sheet_numbered.png is NOT written to the repo; the numbered preview goes next to the sheet.
"""
import sys, os, json
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
src, pdir = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(float); H, W = a.shape[:2]
bg = ndimage.gaussian_filter(a, (25, 25, 0))
d = np.linalg.norm(a - bg, axis=2); g = np.linalg.norm(np.stack(np.gradient(a.mean(2))), axis=0)
fg = (d > 34) | (g > 22); fg[:4] = fg[-4:] = False; fg[:, :4] = fg[:, -4:] = False
fg = ndimage.binary_closing(fg, iterations=2); fg = ndimage.binary_fill_holes(fg); fg = ndimage.binary_opening(fg, iterations=2)
lab, n = ndimage.label(fg); sz = ndimage.sum(fg, lab, range(1, n + 1))
fg &= np.isin(lab, [i + 1 for i, s in enumerate(sz) if s > 120])
fg = ndimage.binary_opening(fg, iterations=3)   # cut thin bridges (shadows, glows) between neighbouring props
grp, m = ndimage.label(ndimage.binary_dilation(fg, iterations=1))   # pieces within ~2 px are one prop
objs = ndimage.find_objects(grp); out = []
for i, s in enumerate(objs):
    mask = (grp[s] == i + 1) & fg[s]
    if mask.sum() < 400: continue
    ys, xs = np.where(mask); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    out.append((s[1].start + x0, s[0].start + y0, x1 - x0, y1 - y0, mask[y0:y1, x0:x1]))
out.sort(key=lambda o: ((o[1] + o[3]) // 90, o[0]))
od = os.path.join('art/props', pdir); os.makedirs(od, exist_ok=True)
for f in os.listdir(od):
    if f.endswith('.png'): os.remove(os.path.join(od, f))
rgb = a.astype('uint8'); meta = []
for k, (x, y, w, h, mk) in enumerate(out):
    p = np.dstack([rgb[y:y + h, x:x + w], np.where(mk, 255, 0).astype('uint8')])
    sp = Image.fromarray(p, 'RGBA'); gw, gh = max(1, round(w / 4)), max(1, round(h / 4))
    sp.resize((gw, gh), Image.LANCZOS).save(os.path.join(od, f'{k:02d}.png'), optimize=True)
    meta.append({'n': k, 'src': [int(x), int(y), int(w), int(h)], 'px': [gw, gh], 'tiles_w': max(1, round(w / 64))})
json.dump(meta, open(os.path.join(od, 'cut.json'), 'w'), indent=0)
c = im.copy(); dr = ImageDraw.Draw(c)
for mt in meta:
    x, y, w, h = mt['src']; dr.rectangle([x, y, x + w, y + h], outline=(255, 0, 0)); dr.rectangle([x, y, x + 20, y + 12], fill=(0, 0, 0)); dr.text((x + 2, y + 1), str(mt['n']), fill=(255, 255, 0))
c.save(os.path.splitext(src)[0] + '_numbered.png'); print(pdir, len(meta), 'props')
