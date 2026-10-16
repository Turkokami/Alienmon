"""Find Pokéball-like items by template matching against balls already confirmed by eye.
    python tools/deball_match.py TEMPLATES.json SRC.png [...]   -> prints JSON hits per file: [[cx, cy, r, score], ...]
TEMPLATES.json: [[src, cx, cy, r], ...] confirmed balls (centre and radius in that src's pixels)."""
import sys, json
import numpy as np, cv2

T = 28   # templates are normalised to radius T/2


def load(p): return cv2.imread(p, cv2.IMREAD_COLOR)


def templates(spec):
    out = []
    for src, cx, cy, r in spec:
        im = load(src); k = r * 1.15
        crop = im[int(cy - k):int(cy + k), int(cx - k):int(cx + k)]
        if crop.size == 0: continue
        out.append(cv2.resize(crop, (T, T), interpolation=cv2.INTER_AREA))
    return out


def match(im, temps, thr=0.72):
    hits = []
    for r in range(8, 34, 2):                       # ball radius in the source picture
        s = (T / 2) / (r * 1.15)
        small = cv2.resize(im, (max(T + 1, int(im.shape[1] * s)), max(T + 1, int(im.shape[0] * s))), interpolation=cv2.INTER_AREA)
        best = None
        for t in temps:
            res = cv2.matchTemplate(small, t, cv2.TM_CCOEFF_NORMED)
            best = res if best is None else np.maximum(best, res)
        ys, xs = np.where(best >= thr)
        for y, x in zip(ys, xs):
            hits.append(((x + T / 2) / s, (y + T / 2) / s, r, float(best[y, x])))
    hits.sort(key=lambda h: -h[3]); keep = []
    for h in hits:   # non-max suppression
        if all((h[0] - k[0]) ** 2 + (h[1] - k[1]) ** 2 > (0.8 * max(h[2], k[2])) ** 2 for k in keep): keep.append(h)
    return keep


if __name__ == '__main__':
    temps = templates(json.load(open(sys.argv[1])))
    out = {}
    for f in sys.argv[2:]:
        out[f] = [[round(a, 1), round(b, 1), c, round(d, 3)] for a, b, c, d in match(load(f), temps)]
    print(json.dumps(out))
