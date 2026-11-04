# Cuts returned building sheets (renders/<world>/<world>_HOME1.png ...) into map-editor props:
# keys out the magenta, finds each building, puts them in reading order, matches them to the names in the pack,
# scales each to its footprint and writes art/props/<world>_homes|_business|_civic/NN.png plus cut.json (with names).
# Run: python -P tools/packs/import_buildings.py <folder with the PNGs> [more folders]   (extract zips into their own folder first)
import json, os, re, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_build_packs import WORLDS, chunks
from zip_buildings import groups
from zip_build_packs import ROOT
SHEET = {'HOME': 'homes', 'SHOP': 'business', 'CIVIC': 'civic'}
GROW = 1.1   # the art is a little wider than its ground footprint, like the buildings already in the game

def key(im):   # only the magenta joined to the outside is background (plus near-exact #FF00FF trapped inside an arch or ring),
    # so violet roofs, neon signs and glowing liquids inside a building survive
    im = im.convert('RGBA'); a = np.asarray(im).astype(int); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    bg = (r > 150) & (b > 150) & (g < 110) & (np.abs(r - b) < 90)
    m = Image.fromarray(np.pad(np.where(bg, 255, 0), 1, constant_values=255).astype(np.uint8)).copy(); ImageDraw.floodfill(m, (0, 0), 128, thresh=0)
    out = (np.asarray(m)[1:-1, 1:-1] != 128) & ~((r > 235) & (b > 235) & (g < 30))
    im.putalpha(Image.fromarray(np.where(out, 255, 0).astype(np.uint8)).filter(ImageFilter.MinFilter(5))); return im

def boxes(im, want=None):   # retry the merge distance until the count matches the sheet's list
    for gap in (6, 4, 3, 2, 8, 10, 12):
        B = blobs(im, gap)
        if want is None or len(B) == want: return B
    B = blobs(im, 2); A = np.asarray(im.getchannel('A')) > 0
    while len(B) > want:   # one building drawn as separate pieces (a row of homes): join the two side-by-side pieces with the smallest gap
        P = [(max(B[j][0] - B[i][0] - B[i][2], 0), i, j) for i in range(len(B)) for j in range(len(B)) if i != j and B[j][0] >= B[i][0]
             and min(B[i][1] + B[i][3], B[j][1] + B[j][3]) - max(B[i][1], B[j][1]) > 0.5 * min(B[i][3], B[j][3])]
        if not P: break
        _, i, j = min(P); x, y = min(B[i][0], B[j][0]), min(B[i][1], B[j][1])
        B[i] = [x, y, max(B[i][0] + B[i][2], B[j][0] + B[j][2]) - x, max(B[i][1] + B[i][3], B[j][1] + B[j][3]) - y]; B.pop(j)
    while len(B) < want:   # two buildings drawn touching: split the widest piece at its thinnest column
        i = max(range(len(B)), key=lambda k: B[k][2]); x, y, w, h = B[i]; col = A[y + int(h * 0.6):y + h, x:x + w].sum(0)   # buildings that touch meet up high (an arm, a roof); split where their bases part
        lo, hi = int(w * 0.25), int(w * 0.75); c = lo + int(np.argmin(col[lo:hi]))
        B[i:i + 1] = [[x, y, c, h, 1], [x + c, y, w - c, h, 1]]   # 1: a split piece, cleaned of loose bits later
    return B

def main_part(piece):   # keep the biggest connected part of a split piece (drops a neighbour's arm or hook left floating)
    A = np.asarray(piece.getchannel('A').resize((piece.width // 2 or 1, piece.height // 2 or 1))) > 0; H, W = A.shape; lab = np.zeros((H, W), int); n = 0; size = [0]
    for y0 in range(H):
        for x0 in range(W):
            if not A[y0, x0] or lab[y0, x0]: continue
            n += 1; st = [(y0, x0)]; lab[y0, x0] = n; k = 0
            while st:
                y, x = st.pop(); k += 1
                for v, u in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                    if 0 <= v < H and 0 <= u < W and A[v, u] and not lab[v, u]: lab[v, u] = n; st.append((v, u))
            size.append(k)
    if n < 2: return piece
    keep = Image.fromarray(np.where(lab == int(np.argmax(size)), 255, 0).astype(np.uint8)).resize(piece.size, Image.NEAREST)
    a = np.minimum(np.asarray(piece.getchannel('A')), np.asarray(keep)); piece.putalpha(Image.fromarray(a)); return piece

def blobs(im, gap):   # buildings = big connected blobs (on a 1/4 size mask), close bits merged
    a = im.getchannel('A').resize((im.width // 4, im.height // 4)); W, H = a.size; p = a.load(); seen = set(); out = []
    for y in range(H):
        for x in range(W):
            if p[x, y] < 128 or (x, y) in seen: continue
            st = [(x, y)]; seen.add((x, y)); x0 = x1 = x; y0 = y1 = y; n = 0
            while st:
                u, v = st.pop(); n += 1; x0, x1, y0, y1 = min(x0, u), max(x1, u), min(y0, v), max(y1, v)
                for q in ((u + 1, v), (u - 1, v), (u, v + 1), (u, v - 1)):
                    if 0 <= q[0] < W and 0 <= q[1] < H and q not in seen and p[q] >= 128: seen.add(q); st.append(q)
            if n > 40: out.append([x0, y0, x1 - x0 + 1, y1 - y0 + 1])
    for _ in range(50):
        hit = False
        for i in range(len(out)):
            for j in range(i + 1, len(out)):
                A, B = out[i], out[j]
                if A[0] - gap < B[0] + B[2] and B[0] - gap < A[0] + A[2] and A[1] - gap < B[1] + B[3] and B[1] - gap < A[1] + A[3]:
                    l, t = min(A[0], B[0]), min(A[1], B[1]); out[i] = [l, t, max(A[0] + A[2], B[0] + B[2]) - l, max(A[1] + A[3], B[1] + B[3]) - t]; out.pop(j); hit = True; break
            if hit: break
        if not hit: break
    out = [[v * 4 for v in b] for b in out if b[2] * b[3] > 300]
    hs = sorted(b[3] for b in out); gapy = (hs[len(hs) // 2] if hs else 64) * 0.6; rows = []   # reading order by rows
    for b in sorted(out, key=lambda b: b[1] + b[3] / 2):
        cy = b[1] + b[3] / 2
        if rows and cy - rows[-1][0] < gapy: rows[-1][1].append(b)
        else: rows.append([cy, [b]])
    return [b for _, r in rows for b in sorted(r, key=lambda b: b[0])]

def main(folders):
    for folder in folders:
        files = {re.sub(r'\.png$', '', f): os.path.join(folder, f) for f in os.listdir(folder) if f.endswith('.png')}
        d = next((w['dir'] for w in WORLDS if any(k.startswith(w['dir'] + '_') for k in files)), None)
        if not d: print('no world found in', folder); continue
        w = next(w for w in WORLDS if w['dir'] == d); G = groups(w)
        for k, sub in SHEET.items():
            outd = os.path.join(ROOT, 'art/props', f'{d}_{sub}'); os.makedirs(outd, exist_ok=True); cut = []
            for i, L in enumerate(chunks(G[k], 5)):
                f = files.get(f'{d}_{k}{i + 1}')
                if not f: print('  missing', f'{d}_{k}{i + 1}'); continue
                im = key(Image.open(f)); B = boxes(im, len(L))
                if len(B) != len(L): print(f'  {d}_{k}{i + 1}: found {len(B)} buildings, expected {len(L)}: check this sheet')
                for b, (name, fp, _) in zip(B, L):
                    piece = im.crop((b[0], b[1], b[0] + b[2], b[1] + b[3]))
                    if len(b) > 4: piece = main_part(piece)
                    piece = piece.crop(piece.getbbox())
                    fw, fh = map(int, fp.split('x')); tw = max(16, round(fw * 16 * GROW)); th = max(8, round(piece.height * tw / piece.width))
                    small = piece.resize((tw, th), Image.LANCZOS); a = small.getchannel('A').point(lambda v: 255 if v > 140 else 0); small.putalpha(a)
                    n = len(cut); small.save(os.path.join(outd, f'{n:02d}.png'))
                    cut.append({'n': n, 'src': [0, 0, tw, th], 'px': [tw, th], 'name': name, 'h': max(1, fh - 1)})
            json.dump(cut, open(os.path.join(outd, 'cut.json'), 'w', encoding='utf-8'), indent=1)
            print(f'{d}_{sub}: {len(cut)} buildings')

if __name__ == '__main__':
    main(sys.argv[1:])
