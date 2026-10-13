"""Import a character sheet (ChatGPT layout: big bust top-left, full body top-middle, a 4x4 walk grid top-right with rows
down / up / left / left-alt, battle poses and face portraits below) on a white background.

Writes, for a character key:
  art/characters/<key>_{down,up,left,right}.png        64x64 standing frames (right = mirrored left)
  art/characters/<key>_{down,up,left,right}_w1/_w2.png 64x64 walk frames (used for the player; NPCs use the standing frame)
  art/characters/<key>.png or <key>_big.png             full-body sprite (128x128 for NPCs, 160x160 for the player)
  art/portraits/<key>.png or <key>_big.png              384x384 full-body portrait

Usage: python tools/import_character_sheet.py <sheet.png> <key> [--player] [--holes]
"""
import sys
import numpy as np
from PIL import Image, ImageOps
from scipy import ndimage

COLS = [(952, 1088), (1093, 1228), (1233, 1368), (1368, 1505)]
ROWS = [(22, 203), (203, 383), (384, 575), (575, 758)]
FULL = (560, 10, 925, 732)


HOLES = False


def cut(src, box):
    """Crop, make the outside white transparent, and keep only the biggest figure (drops bits of neighbours)."""
    a = np.asarray(src.crop(box)).astype(int)
    white = (a.min(axis=2) > 226) & ((a.max(axis=2) - a.min(axis=2)) < 22)
    lab, _ = ndimage.label(white)
    edge = set(lab[0, :]) | set(lab[-1, :]) | set(lab[:, 0]) | set(lab[:, -1])
    edge.discard(0)
    fg = ~np.isin(lab, list(edge))
    if HOLES:   # pure-white gaps enclosed by hair strands (don't use on characters with white clothing)
        pure = (a.min(axis=2) > 244) & ((a.max(axis=2) - a.min(axis=2)) < 12)
        pl, pn = ndimage.label(pure)
        if pn:
            ps = ndimage.sum(pure, pl, range(1, pn + 1))
            fg &= ~np.isin(pl, [i + 1 for i, v in enumerate(ps) if v >= 12])
    fl, fn = ndimage.label(fg)
    if fn:
        sizes = ndimage.sum(fg, fl, range(1, fn + 1))
        big = max(sizes)
        fg = np.isin(fl, [i + 1 for i, s in enumerate(sizes) if s > big * 0.15])   # the figure (plus any large detached parts)
    im = Image.fromarray(np.dstack([a.astype('uint8'), np.where(fg, 255, 0).astype('uint8')]), 'RGBA')
    return im.crop(im.getbbox())


def fit(im, size, h):
    s = h / im.height
    im = im.resize((max(1, round(im.width * s)), h), Image.LANCZOS)
    c = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    c.paste(im, ((size - im.width) // 2, size - im.height - 1), im)
    return c


def main(path, key, player):
    src = Image.open(path).convert('RGB')
    C = {(r, c): cut(src, (x0, y0, x1, y1)) for r, (y0, y1) in enumerate(ROWS) for c, (x0, x1) in enumerate(COLS)}
    frames = {'down': [C[(0, 0)], C[(0, 1)], C[(0, 3)]], 'up': [C[(1, 0)], C[(1, 1)], C[(1, 3)]], 'left': [C[(2, 1)], C[(2, 0)], C[(2, 2)]]}
    frames['right'] = [ImageOps.mirror(f) for f in frames['left']]
    for d, (st, w1, w2) in frames.items():
        fit(st, 64, 60).save(f'art/characters/{key}_{d}.png', optimize=True)
        fit(w1, 64, 60).save(f'art/characters/{key}_{d}_w1.png', optimize=True)
        fit(w2, 64, 60).save(f'art/characters/{key}_{d}_w2.png', optimize=True)
    full = cut(src, FULL)
    if player:
        fit(full, 160, 156).save(f'art/characters/{key}_big.png', optimize=True)
        fit(full, 384, 378).save(f'art/portraits/{key}_big.png', optimize=True)
    else:
        fit(full, 128, 124).save(f'art/characters/{key}.png', optimize=True)
        fit(full, 384, 378).save(f'art/portraits/{key}.png', optimize=True)
    print('imported', key)


if __name__ == '__main__':
    HOLES = '--holes' in sys.argv
    main(sys.argv[1], sys.argv[2], '--player' in sys.argv)
