"""Paint Pokéball-like items out of the owner's full-size renders (64 px per tile), then shrink for the game.
A ball = a round outlined object with a red or blue top half over a white bottom half (band + button between).
Each one becomes a plain glossy teal orb: shading kept, two-tone, band and button gone.

NEVER writes to the source picture: the result goes to OUT only.
    python tools/deball.py SRC.png OUT.png [--show DEBUG.png] [--extra x,y,r ...]
--extra paints out a ball the detector missed (centre x,y and radius r in SRC pixels)."""
import os, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage


def find(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    top = ((r > 150) & (r - g > 70) & (r - b > 55)) | ((b > 140) & (b - r > 90) & (b - g > 40))   # strongly coloured caps only (not snow or sky)
    white = (np.minimum(np.minimum(r, g), b) > 150) & (a.max(-1) - a.min(-1) < 45)
    lab, n = ndimage.label(ndimage.binary_closing(top, iterations=1)); hits = []
    for i, sl in enumerate(ndimage.find_objects(lab)):
        blob = lab[sl] == i + 1; area = blob.sum(); h = sl[0].stop - sl[0].start; w = sl[1].stop - sl[1].start
        y1 = sl[0].stop
        if 16 <= w <= 64 and h <= 0.3 * w and area >= 0.4 * w * h:   # a thin stripe across a white ball (the white kind)
            up_ = white[max(0, sl[0].start - w // 3):sl[0].start, sl[1].start:sl[1].stop]; dn = white[y1:y1 + w // 3, sl[1].start:sl[1].stop]
            if up_.size and dn.size and up_.mean() > 0.4 and dn.mean() > 0.3:
                cy = (sl[0].start + y1) / 2; hits.append(((sl[1].start + sl[1].stop) / 2, cy, w * 0.55 + 2)); continue
        if area < 150 or not (16 <= w <= 64) or not (0.35 * w <= h <= 1.05 * w): continue
        if area < 0.45 * w * h: continue                                   # a filled cap, not a thin stripe
        y1 = sl[0].stop; below = white[y1:y1 + max(6, h), sl[1].start:sl[1].stop]
        if below.size == 0 or below.mean() < 0.15: continue
        cx = (sl[1].start + sl[1].stop) / 2; rad = w * 0.62 + 2; cy = sl[0].start + rad - 2   # the cap is the top ~60% of a ball slightly wider than the cap
        # a real ball has a dark outline: most of the ring just outside it is dark
        ang = np.linspace(0, 2 * np.pi, 48, endpoint=False); lum = a.mean(-1)
        xs = np.clip((cx + (rad + 1) * np.cos(ang)).astype(int), 0, a.shape[1] - 1); ys = np.clip((cy + (rad + 1) * np.sin(ang)).astype(int), 0, a.shape[0] - 1)
        xs2 = np.clip((cx + (rad - 0.5) * np.cos(ang)).astype(int), 0, a.shape[1] - 1); ys2 = np.clip((cy + (rad - 0.5) * np.sin(ang)).astype(int), 0, a.shape[0] - 1)
        dark = np.maximum(lum[ys, xs] < 95, lum[ys2, xs2] < 95).mean()
        if dark < 0.45: continue
        hits.append((cx, cy, rad))
    return hits


def paint(a, cx, cy, rad):
    H, W = a.shape[:2]; y0, y1 = int(max(0, cy - rad - 2)), int(min(H, cy + rad + 3)); x0, x1 = int(max(0, cx - rad - 2)), int(min(W, cx + rad + 3))
    yy, xx = np.mgrid[y0:y1, x0:x1]; d = np.sqrt((yy - cy) ** 2 + (xx - cx) ** 2)
    sub = a[y0:y1, x0:x1, :3].astype(float); lum = sub.mean(-1)
    inner = d <= rad - 1.5                                                # inside the black outline
    L = np.where(lum < 100, 0.55, np.clip(lum / 255.0, 0, 1))               # band and button -> mid tone
    shade = np.clip(1.0 - 0.45 * np.clip((yy - cy) / rad, -1, 1) - 0.25 * np.clip((xx - cx) / rad, -1, 1), 0.4, 1.4)
    t = np.clip(0.55 * L + 0.45 * shade / 1.4, 0, 1)
    col = np.stack([40 + 110 * t, 120 + 120 * t, 130 + 110 * t], -1)          # glossy teal orb
    col[(d <= rad * 0.28) & (yy < cy - rad * 0.25) & (xx < cx)] = [225, 250, 250]
    sub[inner] = col[inner]
    a[y0:y1, x0:x1, :3] = sub.astype(a.dtype)


def run(src, out, show=None, extra=()):
    if os.path.abspath(src) == os.path.abspath(out): raise SystemExit('refusing to overwrite the source picture')
    a = np.array(Image.open(src).convert('RGBA')); hits = find(a[..., :3].astype(int)) + list(extra)
    for h in hits: paint(a, *h)
    Image.fromarray(a, 'RGBA').save(out)
    if show:
        s = Image.open(src).convert('RGB'); d = ImageDraw.Draw(s)
        for cx, cy, rad in hits: d.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], outline=(0, 255, 0), width=3)
        s.save(show)
    return hits


if __name__ == '__main__':
    args = [x for x in sys.argv[1:] if not x.startswith('--')]
    show = sys.argv[sys.argv.index('--show') + 1] if '--show' in sys.argv else None
    if show: args.remove(show)
    extra = []
    if '--extra' in sys.argv:
        i = sys.argv.index('--extra') + 1
        while i < len(sys.argv) and not sys.argv[i].startswith('--'):
            extra.append(tuple(float(v) for v in sys.argv[i].split(','))); args.remove(sys.argv[i]); i += 1
    print(len(run(args[0], args[1], show, extra)), 'balls painted out')
