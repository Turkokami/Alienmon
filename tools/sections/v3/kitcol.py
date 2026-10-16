"""Automatic collision for a V3 kit scene (render 64 px per tile, game 16 px per tile).

Walkable ground = smooth tiles whose colour matches the scene's road colour, grown from the road at the
middle of each edge (where the kit draws its exits) and from the centre. Tall grass = tufted tiles of the
world's grass colour that touch walkable ground. Everything else is blocked.

    from kitcol import auto
    rows, exits = auto(PIL_image_at_game_size, kind)      # kind: outdoor | interior | cave | tower
exits: {'left': [a,b], ...} runs of walkable tiles on each edge (the longest run per side).
"""
import numpy as np
from collections import deque


def lab(rgb):
    c = rgb / 255.0; c = np.where(c > 0.04045, ((c + 0.055) / 1.055) ** 2.4, c / 12.92)
    xyz = c @ np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]]).T
    xyz /= np.array([0.9505, 1.0, 1.089])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def tile_stats(img):
    a = np.asarray(img.convert('RGB'), float); H, W = a.shape[0] // 16, a.shape[1] // 16
    t = a[:H * 16, :W * 16].reshape(H, 16, W, 16, 3).transpose(0, 2, 1, 3, 4).reshape(H, W, 256, 3)
    L = lab(t); m = L.mean(2); tex = np.linalg.norm(L - m[:, :, None, :], axis=-1).mean(2)
    return m, tex


def flood(ok, seeds):
    H, W = ok.shape; out = np.zeros_like(ok); q = deque()
    for x, y in seeds:
        if 0 <= x < W and 0 <= y < H and ok[y, x] and not out[y, x]: out[y, x] = True; q.append((x, y))
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            X, Y = x + dx, y + dy
            if 0 <= X < W and 0 <= Y < H and ok[Y, X] and not out[Y, X]: out[Y, X] = True; q.append((X, Y))
    return out


def road_colour(m, tex, H, W):
    """The road colour: the smoothest common colour among tiles near the edge middles and the centre."""
    cand = []
    for y in range(H):
        for x in range(W):
            mid = (abs(y - H / 2) < 3 and (x < 2 or x > W - 3)) or (abs(x - W / 2) < 3 and (y < 2 or y > H - 3)) or (abs(x - W / 2) < 3 and abs(y - H / 2) < 3)
            if mid: cand.append((tex[y, x], tuple(m[y, x])))
    cand.sort(); smooth = np.array([c for _, c in cand[:max(6, len(cand) // 3)]])
    best, score = smooth[0], -1
    for c in smooth:
        s = (np.linalg.norm(m - c, axis=-1) < 9).sum()
        if s > score: best, score = c, s
    return best


def grass_patches(m, tex, walk, k=6):
    """Tall-grass patches: compact, evenly coloured, busy-textured blocks of one colour that sit beside the road.
    Tiles are clustered by colour; a cluster's connected blobs count as grass when they fill most of their
    bounding box (drawn as rectangles in the kit) and touch walkable ground."""
    H, W = walk.shape; X = m.reshape(-1, 3); rng = np.random.default_rng(0); C = X[rng.choice(len(X), k, replace=False)]
    for _ in range(12):
        lab_ = np.argmin(((X[:, None] - C[None]) ** 2).sum(-1), 1)
        C = np.array([X[lab_ == i].mean(0) if (lab_ == i).any() else C[i] for i in range(k)])
    lab_ = lab_.reshape(H, W); out = np.zeros((H, W), bool)
    near = np.zeros_like(walk)
    for s_, a_ in ((1, 0), (-1, 0), (1, 1), (-1, 1)): near |= np.roll(walk, s_, a_)
    from scipy import ndimage
    for i in range(k):
        mask = (lab_ == i) & ~walk & (tex > np.percentile(tex, 35))
        comp, n = ndimage.label(mask)
        for j, sl in enumerate(ndimage.find_objects(comp)):
            blob = comp[sl] == j + 1; area = blob.sum(); box = blob.size
            if area < 6 or area > H * W * 0.2: continue
            if area / box < 0.62: continue
            full = np.zeros((H, W), bool); full[sl] = blob
            if not (full & near).any(): continue
            if np.std(m[full], 0).mean() > 6: continue
            out |= full
    return out


def runs(line):
    out, cur = [], []
    for i, v in enumerate(line):
        if v: cur.append(i)
        elif cur: out.append(cur); cur = []
    if cur: out.append(cur)
    return out


def auto(img, kind='outdoor', thr=None, texthr=None, roads=None):
    m, tex = tile_stats(img); H, W = m.shape[:2]
    thr = thr or (16 if kind in ('outdoor', 'plain') else 12); texthr = texthr or (np.percentile(tex, 55) + 2)
    from scipy import ndimage
    smooth = tex < texthr
    # road = a smooth region in one of the world's road colours (learned from its Crossroads pictures); score by area, edges reached and colour match
    X = m[smooth]; rng = np.random.default_rng(1); C = X[rng.choice(len(X), min(6, len(X)), replace=False)]
    for _ in range(15):
        lb = np.argmin(((X[:, None] - C[None]) ** 2).sum(-1), 1); C = np.array([X[lb == i].mean(0) if (lb == i).any() else C[i] for i in range(len(C))])
    cands = list(C) + [np.array(r) for r in (roads or [])]
    best, bscore = None, -1
    for c in cands:
        cand = smooth & (np.linalg.norm(m - c, axis=-1) < thr)
        comp, n = ndimage.label(cand)
        for j in range(1, n + 1):
            r = comp == j; area = r.sum()
            if area < 20: continue
            edges = int(r[0].any()) + int(r[-1].any()) + int(r[:, 0].any()) + int(r[:, -1].any())
            mc = m[r].mean(0); match = min([np.linalg.norm(mc - np.array(q)) for q in (roads or [])] or [99])
            ring = (r[:2].sum() + r[-2:].sum() + r[:, :2].sum() + r[:, -2:].sum()) / area   # mostly a border strip -> not a road
            score = area * (1 + 0.25 * edges) * (2.5 if match < thr else 1) * (0.3 if ring > 0.7 else 1)
            if score > bscore: best, bscore = r, score
    ok = smooth & (np.linalg.norm(m - (m[best].mean(0) if best is not None else road_colour(m, tex, H, W)), axis=-1) < thr)
    if kind in ('interior', 'cave'):   # rooms: floor = the big smooth region in the middle, judged by texture and lightness, not hue (lighting tints it)
        L = m[..., 0]; c = np.median(L[H // 2 - 2:H // 2 + 3, W // 2 - 2:W // 2 + 3])
        smooth = tex < np.percentile(tex[H // 4:3 * H // 4, W // 4:3 * W // 4], 80) + 3
        ok = smooth & (np.abs(L - c) < 22)
        from scipy import ndimage
        ok = ndimage.binary_closing(ok, iterations=1) & smooth | ok
        seeds = [(x, y) for y in range(H // 2 - 2, H // 2 + 3) for x in range(W // 2 - 2, W // 2 + 3)]
    else:
        seeds = [(x, y) for y in range(H) for x in range(W) if best is not None and best[y, x]]
    walk = flood(ok, seeds)
    # keep only the biggest connected walkable region plus anything touching an edge band
    # fill 1-tile pinholes (a stone or flower drawn on the road) so the road isn't speckled with walls
    for _ in range(2):
        P = np.pad(walk, 1); nb = P[:-2, 1:-1].astype(int) + P[2:, 1:-1] + P[1:-1, :-2] + P[1:-1, 2:]
        walk |= (~walk) & (nb >= 3)
    grid = np.full((H, W), '#')
    grid[walk] = '.'
    if kind == 'outdoor':
        grid[grass_patches(m, tex, walk)] = ','
    rows = [''.join(r) for r in grid]
    exits = {}
    for side, line in (('left', [rows[y][0] in '.,' for y in range(H)]), ('right', [rows[y][W - 1] in '.,' for y in range(H)]),
                       ('top', [c in '.,' for c in rows[0]]), ('bottom', [c in '.,' for c in rows[H - 1]])):
        rr = [r for r in runs(line) if len(r) >= 3]
        if rr: exits[side] = [[r[0], r[-1]] for r in rr]
    return rows, exits
