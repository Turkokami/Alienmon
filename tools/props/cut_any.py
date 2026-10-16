"""Cut a sheet drawn on a magenta or a soft blurred backdrop.

  python tools/props/cut_any.py props <sheet.png> <out_dir>
      every object on the sheet -> art/props/<out_dir>/<NN>.png at game scale (render 64 px per tile -> 16 px) + cut.json
  python tools/props/cut_any.py folk <sheet.png> <key_prefix> [--names a,b,c,d,e,f]
      a 6 x 4 townsfolk sheet (columns = people, rows = down / up / side / side) ->
      art/characters/<key>.png (48x48 standing, front), <key>_up.png, and art/portraits/<key>.png (384x384, for the editor)
A numbered preview is written next to the sheet (props) so items can be picked by number.
"""
import sys, os, json
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage


def foreground(a):
    """True where the sheet has an object. Magenta sheets: colour key. Blurred sheets: differs from a heavy blur, or has hard edges."""
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    mag = (r > 150) & (b > 150) & (g < 120) & (r - g > 70) & (b - g > 70)
    if mag.mean() > 0.25:
        fg = ~mag
        # magenta fringe left by anti-aliasing: pinkish pixels touching the background go too
        fringe = (r - g > 60) & (b - g > 60) & ndimage.binary_dilation(mag, iterations=2)
        fg &= ~fringe
        return ndimage.binary_opening(fg, iterations=1), True
    bg = ndimage.gaussian_filter(a, (25, 25, 0))
    d = np.linalg.norm(a - bg, axis=2); gr = np.linalg.norm(np.stack(np.gradient(a.mean(2))), axis=0)
    fg = (d > 34) | (gr > 22); fg[:4] = fg[-4:] = False; fg[:, :4] = fg[:, -4:] = False
    fg = ndimage.binary_closing(fg, iterations=2); fg = ndimage.binary_fill_holes(fg); fg = ndimage.binary_opening(fg, iterations=2)
    return fg, False


def biggest(mask, keep=0.15):
    """The biggest piece plus any piece at least `keep` of its size (hats, staffs, held items)."""
    lab, n = ndimage.label(mask)
    if not n: return mask
    sz = ndimage.sum(mask, lab, range(1, n + 1)); top = sz.max()
    return np.isin(lab, [i + 1 for i, s in enumerate(sz) if s >= top * keep])


def props(src, out):
    im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(float)
    fg, mag = foreground(a)
    lab, n = ndimage.label(fg); sz = ndimage.sum(fg, lab, range(1, n + 1))
    fg &= np.isin(lab, [i + 1 for i, s in enumerate(sz) if s > 150])
    if not mag: fg = ndimage.binary_opening(fg, iterations=3)
    grp, m = ndimage.label(ndimage.binary_dilation(fg, iterations=3 if mag else 1))
    items = []
    for i, s in enumerate(ndimage.find_objects(grp)):
        mk = (grp[s] == i + 1) & fg[s]
        if mk.sum() < 500: continue
        ys, xs = np.where(mk); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        items.append((s[1].start + x0, s[0].start + y0, x1 - x0, y1 - y0, mk[y0:y1, x0:x1]))
    items.sort(key=lambda o: ((o[1] + o[3]) // 120, o[0]))
    od = os.path.join('art/props', out); os.makedirs(od, exist_ok=True)
    for f in os.listdir(od):
        if f.endswith('.png'): os.remove(os.path.join(od, f))
    rgb = a.astype('uint8'); meta = []
    for k, (x, y, w, h, mk) in enumerate(items):
        sp = Image.fromarray(np.dstack([rgb[y:y + h, x:x + w], np.where(mk, 255, 0).astype('uint8')]), 'RGBA')
        gw, gh = max(1, round(w / 4)), max(1, round(h / 4))
        sp.resize((gw, gh), Image.LANCZOS).save(os.path.join(od, f'{k:02d}.png'), optimize=True)
        meta.append({'n': k, 'src': [int(x), int(y), int(w), int(h)], 'px': [gw, gh]})
    json.dump(meta, open(os.path.join(od, 'cut.json'), 'w'), indent=0)
    c = im.copy(); dr = ImageDraw.Draw(c)
    for mt in meta:
        x, y, w, h = mt['src']; dr.rectangle([x, y, x + w, y + h], outline=(255, 255, 0), width=2); dr.rectangle([x, y, x + 24, y + 14], fill=(0, 0, 0)); dr.text((x + 2, y + 1), str(mt['n']), fill=(255, 255, 0))
    c.save(os.path.splitext(src)[0] + '_numbered.png'); print(out, len(meta), 'props', '(magenta)' if mag else '(blurred)')


def folk(src, prefix, names):
    im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(float); H, W = a.shape[:2]
    fg, mag = foreground(a); rgb = a.astype('uint8'); cw, ch = W // 6, H // 4; keys = []
    for c in range(6):
        key = f'{prefix}{names[c] if names else c + 1}'; keys.append(key)
        for r, suffix in ((0, ''), (1, '_up')):
            x0, y0 = c * cw, r * ch; mk = biggest(fg[y0:y0 + ch, x0:x0 + cw])
            ys, xs = np.where(mk)
            if not len(ys): print('empty cell', c, r); continue
            by0, by1, bx0, bx1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
            crop = rgb[y0 + by0:y0 + by1, x0 + bx0:x0 + bx1]; al = np.where(mk[by0:by1, bx0:bx1], 255, 0).astype('uint8')
            fig = Image.fromarray(np.dstack([crop, al]), 'RGBA'); fw, fh = fig.size
            # in-game sprite: the sheet is drawn ~4x, so quarter size, fitted into 48x48, feet on the bottom
            s = min(1 / 4, 46 / fh, 46 / fw); small = fig.resize((max(1, round(fw * s)), max(1, round(fh * s))), Image.LANCZOS)
            can = Image.new('RGBA', (48, 48), (0, 0, 0, 0)); can.alpha_composite(small, ((48 - small.width) // 2, 48 - small.height - 1))
            can.save(f'art/characters/{key}{suffix}.png', optimize=True)
            if r == 0:   # crisp full-size art for the editor's People picker
                s2 = min(360 / fh, 360 / fw); big = fig.resize((round(fw * s2), round(fh * s2)), Image.NEAREST if s2 >= 1.5 else Image.LANCZOS)
                p = Image.new('RGBA', (384, 384), (0, 0, 0, 0)); p.alpha_composite(big, ((384 - big.width) // 2, 384 - big.height - 8))
                p.save(f'art/portraits/{key}.png', optimize=True)
    print(prefix, 'townsfolk:', ', '.join(keys), '(magenta)' if mag else '(blurred)')


if __name__ == '__main__':
    mode, src, out = sys.argv[1:4]
    names = sys.argv[sys.argv.index('--names') + 1].split(',') if '--names' in sys.argv else None
    (props if mode == 'props' else lambda s, o: folk(s, o, names))(src, out)
