# Overworld sprites for the new Alienmon (Holopup line, Echoes, evolved Echoes): the owner's 1024x512 sheets
# (art/raw/overworld_new/overworld_sheetNN.png, 4x2 cells, never modified; order in ROSTER.md) -> 128x64 two-frame strips in
# art/overworld named after the species, like the base sprites. One drawing per creature, so the second frame is a small bob.
import os, re
from PIL import Image, ImageDraw
APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = APP + '/art/raw/overworld_new'
OUT = APP + '/art/overworld'

def cutout(im):
    im = im.convert('RGBA'); w, h = im.size
    rgb = Image.new('RGB', (w + 2, h + 2), (255, 255, 255)); rgb.paste(im.convert('RGB'), (1, 1))
    ImageDraw.floodfill(rgb, (0, 0), (255, 0, 255), thresh=40)
    px = rgb.load(); o = im.load()
    for y in range(h):
        for x in range(w):
            if px[x + 1, y + 1] == (255, 0, 255): o[x, y] = (0, 0, 0, 0)
    return im

def frame(b, sy):
    """Fit the figure into a 64x64 frame, feet on the bottom; sy squashes it a little for the bob frame."""
    k = 62 / max(b.size); w, h = max(1, round(b.width * k)), max(1, round(b.height * k * sy))
    f = Image.new('RGBA', (64, 64), (0, 0, 0, 0)); r = b.resize((w, h), Image.LANCZOS)
    f.alpha_composite(r, ((64 - w) // 2, 63 - h)); return f

rows = re.findall(r'^\| (\d\d) \| (.+) \|$', open(RAW + '/ROSTER.md', encoding='utf-8').read(), re.M)
made, bad = [], []
for n, names in rows:
    p = f'{RAW}/overworld_sheet{n}.png'
    try:
        sh = Image.open(p); sh.load()
    except Exception as x:
        bad.append(f'sheet{n} ({type(x).__name__})'); continue
    cw, ch = sh.width // 4, sh.height // 2
    for i, name in enumerate(s.strip() for s in names.split(',')):
        cell = cutout(sh.crop(((i % 4) * cw, (i // 4) * ch, (i % 4 + 1) * cw, (i // 4 + 1) * ch)))
        if not cell.getbbox(): bad.append(name + ' (empty cell)'); continue
        b = cell.crop(cell.getbbox()); strip = Image.new('RGBA', (128, 64), (0, 0, 0, 0))
        strip.alpha_composite(frame(b, 1.0), (0, 0)); strip.alpha_composite(frame(b, 0.94), (64, 0))
        strip.quantize(colors=64, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE).save(f'{OUT}/{name}.png', optimize=True)
        made.append(name)
print(len(made), 'overworld sprites; skipped:', bad)
