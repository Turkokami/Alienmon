"""Review sheet of every Alienmon next to its Prismatic variant (the same CSS filter the game uses:
hue-rotate(160deg) saturate(1.35) brightness(1.08)). Writes docs/prismatic_sheet.png.  Usage: python tools/prismatic_sheet.py"""
import json, math, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
names = []
for d in sorted(os.listdir(os.path.join(ROOT, 'data/batches'))):
    f = os.path.join(ROOT, 'data/batches', d, 'alienmon.json')
    if os.path.exists(f):
        names += [m['name'] for m in json.load(open(f, encoding='utf-8'))]


def hue(deg):
    c, s = math.cos(math.radians(deg)), math.sin(math.radians(deg))
    return np.array([[0.213 + c * 0.787 - s * 0.213, 0.715 - c * 0.715 - s * 0.715, 0.072 - c * 0.072 + s * 0.928],
                     [0.213 - c * 0.213 + s * 0.143, 0.715 + c * 0.285 + s * 0.140, 0.072 - c * 0.072 - s * 0.283],
                     [0.213 - c * 0.213 - s * 0.787, 0.715 - c * 0.715 + s * 0.715, 0.072 + c * 0.928 + s * 0.072]])


def sat(v):
    return np.array([[0.213 + 0.787 * v, 0.715 - 0.715 * v, 0.072 - 0.072 * v],
                     [0.213 - 0.213 * v, 0.715 + 0.285 * v, 0.072 - 0.072 * v],
                     [0.213 - 0.213 * v, 0.715 - 0.715 * v, 0.072 + 0.928 * v]])


def prismatic(im):
    a = np.asarray(im.convert('RGBA')).astype(float) / 255
    rgb = a[..., :3]
    for M in (hue(160), sat(1.35)):
        rgb = np.clip(rgb @ M.T, 0, 1)
    rgb = np.clip(rgb * 1.08, 0, 1)
    return Image.fromarray((np.dstack([rgb, a[..., 3:]]) * 255).astype('uint8'), 'RGBA')


S, COLS = 96, 10
CW, CH = S * 2 + 16, S + 22
rows = math.ceil(len(names) / COLS)
sheet = Image.new('RGB', (COLS * CW, rows * CH + 40), (24, 18, 40))
d = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype(os.path.join(ROOT, 'www/fonts/PressStart2P-Regular.ttf'), 8)
    big = ImageFont.truetype(os.path.join(ROOT, 'www/fonts/PressStart2P-Regular.ttf'), 14)
except OSError:
    font = big = ImageFont.load_default()
d.text((10, 12), 'Alienmon Prismatic variants: normal (left) / Prismatic (right)', fill=(95, 242, 255), font=big)
for i, n in enumerate(names):
    x, y = (i % COLS) * CW, (i // COLS) * CH + 40
    p = os.path.join(ROOT, 'art/sprites', n + '.png')
    d.rectangle([x + 2, y + 2, x + CW - 3, y + CH - 3], outline=(59, 42, 92))
    if os.path.exists(p):
        im = Image.open(p).convert('RGBA').resize((S, S), Image.LANCZOS)
        sheet.paste(im, (x + 6, y + 4), im)
        pr = prismatic(im)
        sheet.paste(pr, (x + S + 10, y + 4), pr)
    d.text((x + 6, y + S + 8), f'{i + 1:03d} {n}', fill=(232, 224, 255), font=font)
out = os.path.join(ROOT, 'docs/prismatic_sheet.png')
sheet.save(out, optimize=True)
print(out, sheet.size, len(names))
