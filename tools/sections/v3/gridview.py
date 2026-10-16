"""Gridded picture of map pieces for planning: art with tile numbers, red dash = blocked, green box = tall grass.
    python tools/sections/v3/gridview.py OUT.png ID [ID ...]
IDs are kit ids (tools/sections/v3/kit.json) or current section ids (art in art/sections_game). Up to ~3 per picture."""
import sys, json, glob
from PIL import Image, ImageDraw
out, ids = sys.argv[1], sys.argv[2:]
K = json.load(open('tools/sections/v3/kit.json', encoding='utf-8'))
ims = []
for i in ids:
    f = K[i]['file'] if i in K else glob.glob(f'art/sections_game/*/{i}_*.png')[0]
    g = Image.open(f).convert('RGB'); W, H = g.width // 16, g.height // 16; T = 40
    o = g.resize((W * T, H * T), Image.NEAREST); d = ImageDraw.Draw(o)
    try: rows = json.load(open(f'data/collision/{i}.json'))['rows']
    except Exception: rows = None
    for x in range(W + 1): d.line([(x * T, 0), (x * T, H * T)], fill=(0, 0, 0))
    for y in range(H + 1): d.line([(0, y * T), (W * T, y * T)], fill=(0, 0, 0))
    for y in range(H):
        for x in range(W):
            c = rows[y][x] if rows and y < len(rows) and x < len(rows[y]) else '.'
            if c == '#': d.line([(x * T + 14, y * T + 20), (x * T + 26, y * T + 20)], fill=(255, 0, 0), width=3)
            elif c == ',': d.rectangle([x * T + 6, y * T + 6, x * T + T - 7, y * T + T - 7], outline=(0, 255, 0), width=2)
    for x in range(W): d.text((x * T + 3, 2), str(x), fill=(255, 255, 0))
    for y in range(H): d.text((2, y * T + 3), str(y), fill=(255, 255, 0))
    d.rectangle([0, H * T - 14, W * T, H * T], fill=(0, 0, 0)); d.text((4, H * T - 13), f'{i} {K[i]["cat"] + " - " + K[i]["name"] if i in K else ""}', fill=(255, 255, 255))
    ims.append(o)
c = Image.new('RGB', (sum(m.width for m in ims) + 10 * len(ims), max(m.height for m in ims)))
x = 0
for m in ims: c.paste(m, (x, 0)); x += m.width + 10
c.thumbnail((2400, 1400)); c.save(out); print(out)
