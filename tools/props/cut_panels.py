"""Cut a prop sheet laid out as white panels (titled category boxes) into transparent sprites.
usage: python tools/props/cut_panels.py <sheet.png> <planet_dir>   -> art/props/<planet_dir>/<NN>.png + cut.json + <sheet>_numbered.png"""
import sys, os, json
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
src, pdir = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(int)
white = (a.min(2) > 236) & ((a.max(2) - a.min(2)) < 18)
lab, n = ndimage.label(white); sz = ndimage.sum(white, lab, range(1, n + 1))
panels = np.isin(lab, [i + 1 for i, s in enumerate(sz) if s > 20000])          # the big white panel interiors
area = ndimage.binary_fill_holes(panels)                                         # panel interior incl. the props sitting in it
fg = area & ~white
fg = ndimage.binary_opening(fg, iterations=1)
grp, m = ndimage.label(ndimage.binary_dilation(fg, iterations=1))
out = []
for i, s in enumerate(ndimage.find_objects(grp)):
    mk = (grp[s] == i + 1) & fg[s]
    if mk.sum() < 150: continue
    hh, ww = s[0].stop - s[0].start, s[1].stop - s[1].start
    if hh < 34 and ww > 120: continue   # a panel title bar
    if s[0].start < 70: continue        # the sheet banner
    mk = ndimage.binary_fill_holes(mk) & ~(white[s] & ~ndimage.binary_erosion(ndimage.binary_fill_holes(mk), iterations=2)) if False else mk
    ys, xs = np.where(mk); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    out.append((s[1].start + x0, s[0].start + y0, x1 - x0, y1 - y0, mk[y0:y1, x0:x1]))
out.sort(key=lambda o: ((o[1] + o[3]) // 40, o[0]))
od = os.path.join('art/props', pdir); os.makedirs(od, exist_ok=True)
for f in os.listdir(od):
    if f.endswith('.png'): os.remove(os.path.join(od, f))
rgb = a.astype('uint8'); meta = []
SCALE = float(sys.argv[3]) if len(sys.argv) > 3 else 0.5   # sheet px -> game px (props here are drawn ~2x game size)
for k, (x, y, w, h, mk) in enumerate(out):
    al = np.where(mk, 255, 0).astype('uint8')
    # inner white (e.g. a sign face) stays; only white connected to the outside of the sprite is cut
    sp = Image.fromarray(np.dstack([rgb[y:y + h, x:x + w], al]), 'RGBA')
    gw, gh = max(1, round(w * SCALE)), max(1, round(h * SCALE))
    sp.resize((gw, gh), Image.LANCZOS).save(os.path.join(od, f'{k:02d}.png'), optimize=True)
    meta.append({'n': k, 'src': [int(x), int(y), int(w), int(h)], 'px': [gw, gh]})
json.dump(meta, open(os.path.join(od, 'cut.json'), 'w'), indent=0)
c = im.copy(); dr = ImageDraw.Draw(c)
for mt in meta:
    x, y, w, h = mt['src']; dr.rectangle([x, y, x + w, y + h], outline=(255, 0, 0)); dr.rectangle([x, y, x + 16, y + 10], fill=(0, 0, 0)); dr.text((x + 1, y), str(mt['n']), fill=(255, 255, 0))
c.save(os.path.splitext(src)[0] + '_numbered.png'); print(pdir, len(meta), 'props')
