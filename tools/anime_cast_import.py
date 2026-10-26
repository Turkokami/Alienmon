"""Anime character art that matches the map sprites (owner renders: waist-up bust on the left, full body on the right,
white background, 1536x1024). For each key:
  art/portraits_talk/<key>.png   the bust, cut out (dialogue face)
  art/portraits/<key>.png        the full body on a 384x384 transparent square (people picker, website)
The art each one replaces is kept in art/raw/portraits_talk/old_v2 and art/raw/portraits/old_v1; the render itself goes to
art/raw/anime/<key>.png.

With --sheet liss: a Liss-style character sheet (bust, full body, 4x4 walk grid on the right: rows down / up / left / left)
gives art/characters/<key>.png (front), <key>_up.png and <key>_left/_right.png, 128x128.

Usage: python tools/anime_cast_import.py <render.png> <key>
       python tools/anime_cast_import.py --sheet <sheet.png> <key>
"""
import os, shutil, sys
import numpy as np
from PIL import Image, ImageOps
from scipy import ndimage

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def figures(im, min_frac=0.002):
    """Cut-out mask (outside white made transparent) and the bounding boxes of the figures in it, left to right."""
    a = np.asarray(im.convert('RGB')).astype(int)
    white = (a.min(axis=2) > 236) & ((a.max(axis=2) - a.min(axis=2)) < 18)
    lab, _ = ndimage.label(white)
    edge = set(lab[0, :]) | set(lab[-1, :]) | set(lab[:, 0]) | set(lab[:, -1])
    edge.discard(0)
    fg = ~np.isin(lab, list(edge))
    fg = ndimage.binary_opening(fg, iterations=1)
    fl, fn = ndimage.label(ndimage.binary_dilation(fg, iterations=6))   # sparkles and bubbles join the figure they float beside
    boxes = [s + (i + 1,) for i, s in enumerate(ndimage.find_objects(fl)) if (s[0].stop - s[0].start) * (s[1].stop - s[1].start) > a.shape[0] * a.shape[1] * min_frac]
    return a, fg & (fl > 0), fl, sorted(boxes, key=lambda s: s[1].start)


def crop(a, fg, fl, s, pad=4):
    y0, y1 = max(0, s[0].start - pad), min(a.shape[0], s[0].stop + pad)
    x0, x1 = max(0, s[1].start - pad), min(a.shape[1], s[1].stop + pad)
    own = fg[y0:y1, x0:x1] & (fl[y0:y1, x0:x1] == s[2])   # only this figure, not a neighbour reaching into its box
    rgba = np.dstack([a[y0:y1, x0:x1], own * 255]).astype(np.uint8)
    return Image.fromarray(rgba, 'RGBA')


def keep(path, old):
    if os.path.exists(path) and not os.path.exists(old):
        os.makedirs(os.path.dirname(old), exist_ok=True)
        shutil.copy2(path, old)


def square(im, size):
    im = im.copy()
    im.thumbnail((size, size), Image.LANCZOS)
    out = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    out.paste(im, ((size - im.width) // 2, size - im.height), im)
    return out


def anime(src, key):
    im = Image.open(src)
    a, fg, fl, boxes = figures(im, 0.02)
    big = sorted(boxes, key=lambda s: -(s[0].stop - s[0].start) * (s[1].stop - s[1].start))[:2]
    bust_box, body_box = sorted(big, key=lambda s: s[1].start)
    os.makedirs(f'{APP}/art/raw/anime', exist_ok=True)
    shutil.copy2(src, f'{APP}/art/raw/anime/{key}.png')
    bust = crop(a, fg, fl, bust_box)
    bust.thumbnail((360, 260), Image.LANCZOS)   # about the size of the other talk busts, a little sharper
    keep(f'{APP}/art/portraits_talk/{key}.png', f'{APP}/art/raw/portraits_talk/old_v2/{key}.png')
    bust.save(f'{APP}/art/portraits_talk/{key}.png')
    keep(f'{APP}/art/portraits/{key}.png', f'{APP}/art/raw/portraits/old_v1/{key}.png')
    square(crop(a, fg, fl, body_box), 384).save(f'{APP}/art/portraits/{key}.png')
    print(key, 'bust', bust.size)


def sheet(src, key):
    im = Image.open(src)
    W = im.width
    a, fg, fl, boxes = figures(im, 0.0015)
    grid = [s for s in boxes if s[1].start > W * 0.58]
    rows = []
    for s in sorted(grid, key=lambda s: s[0].start):
        if rows and abs(rows[-1][0][0].start - s[0].start) < 60:
            rows[-1].append(s)
        else:
            rows.append([s])
    rows = [sorted(r, key=lambda s: s[1].start) for r in rows]
    assert len(rows) == 4 and all(len(r) == 4 for r in rows), [len(r) for r in rows]
    os.makedirs(f'{APP}/art/raw/anime', exist_ok=True)
    shutil.copy2(src, f'{APP}/art/raw/anime/{key}_sheet.png')
    frame = lambda s: square(crop(a, fg, fl, s), 128)
    for name, img in ((key, frame(rows[0][0])), (key + '_up', frame(rows[1][0])), (key + '_left', frame(rows[2][0])), (key + '_right', ImageOps.mirror(frame(rows[2][0])))):
        p = f'{APP}/art/characters/{name}.png'
        keep(p, f'{APP}/art/raw/characters/old_v1/{name}.png')
        img.save(p)
    print(key, 'sprites from a', [len(r) for r in rows], 'grid')


if __name__ == '__main__':
    if sys.argv[1] == '--sheet':
        sheet(sys.argv[2], sys.argv[3])
    else:
        anime(sys.argv[1], sys.argv[2])
