"""Talk portraits that match the map sprites: cut the front figure (left half) of a cast render in art/raw/cast and keep
its head-to-waist part as art/portraits_talk/<key>.png. The bust it replaces is kept in art/raw/portraits_talk/old_v1.

Usage: python tools/cast_talk_bust.py <key> [<key> ...]
"""
import os, shutil, sys
import numpy as np
from PIL import Image
from scipy import ndimage

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEEP = 0.62   # head to about the waist
WHOLE = {'squidsailor'}   # no waist to cut at: the whole figure


def bust(key):
    src = Image.open(f'{APP}/art/raw/cast/{key}.png').convert('RGB')
    W, H = src.size
    a = np.asarray(src.crop((0, 0, W // 2, H))).astype(int)
    white = (a.min(axis=2) > 232) & ((a.max(axis=2) - a.min(axis=2)) < 20)
    lab, _ = ndimage.label(white)
    edge = set(lab[0, :]) | set(lab[-1, :]) | set(lab[:, 0]) | set(lab[:, -1])
    edge.discard(0)
    fg = ~np.isin(lab, list(edge))
    fl, fn = ndimage.label(fg)
    sizes = ndimage.sum(fg, fl, range(1, fn + 1))
    big = 1 + int(np.argmax(sizes))
    keep = np.isin(fl, [i + 1 for i, s in enumerate(sizes) if s >= sizes[big - 1] * 0.02])   # the figure plus its small loose bits (bubbles, a pipe)
    ys, xs = np.nonzero(fl == big)
    y0, y1 = ys.min(), ys.max()
    if key not in WHOLE:
        y1 = y0 + int((y1 - y0) * KEEP)
    sub = keep[y0:y1 + 1]
    cols = np.nonzero(sub.any(axis=0))[0]
    x0, x1 = cols.min(), cols.max()
    rgba = np.dstack([a[y0:y1 + 1, x0:x1 + 1], (keep[y0:y1 + 1, x0:x1 + 1] * 255)]).astype(np.uint8)
    im = Image.fromarray(rgba, 'RGBA')
    im = im.resize((round(im.width * 209 / im.height), 209), Image.NEAREST)   # pixel art: crisp edges, same height as the other busts
    out = f'{APP}/art/portraits_talk/{key}.png'
    old = f'{APP}/art/raw/portraits_talk/old_v1/{key}.png'
    if os.path.exists(out) and not os.path.exists(old):
        os.makedirs(os.path.dirname(old), exist_ok=True)
        shutil.copy2(out, old)
    im.save(out)
    print(key, im.size)


for k in sys.argv[1:]:
    bust(k)
