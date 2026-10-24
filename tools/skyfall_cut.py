import os, shutil
from PIL import Image, ImageDraw

# Cuts the owner's Skyfall renders (art/raw/skyfall, never modified) into game pieces in art/skyfall.
import sys
APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = APP + '/art/raw/skyfall'
RAW, OUT = APP + '/art/raw/skyfall', APP + '/art/skyfall'
os.makedirs(RAW, exist_ok=True); os.makedirs(OUT, exist_ok=True)

def cutout(im):
    """white background -> transparent, flood-filled from the border so whites inside the art stay"""
    im = im.convert('RGBA'); w, h = im.size
    mask = Image.new('L', (w + 2, h + 2), 0)
    rgb = Image.new('RGB', (w + 2, h + 2), (255, 255, 255)); rgb.paste(im.convert('RGB'), (1, 1))
    ImageDraw.floodfill(rgb, (0, 0), (255, 0, 255), thresh=40)
    px = rgb.load(); a = im.split()[3].load(); out = im.copy(); o = out.load()
    for y in range(h):
        for x in range(w):
            if px[x + 1, y + 1] == (255, 0, 255): o[x, y] = (0, 0, 0, 0)
    return out

def cells(im, cols, rows):
    cw, ch = im.width // cols, im.height // rows
    return [im.crop((c * cw, r * ch, (c + 1) * cw, (r + 1) * ch)) for r in range(rows) for c in range(cols)]

def frames(name, sheet, cols, rows, height):
    """frames of one animation: same crop box for all, so they stay aligned"""
    fs = [cutout(c) for c in cells(Image.open(f'{SRC}/{sheet}'), cols, rows)]
    box = None
    for f in fs:
        b = f.getbbox()
        if b: box = b if not box else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
    for i, f in enumerate(fs):
        f = f.crop(box); f = f.resize((max(1, round(f.width * height / f.height)), height), Image.LANCZOS)
        f.save(f'{OUT}/{name}_{i}.png', optimize=True)
    return len(fs)

def single(name, im, height):
    im = cutout(im); im = im.crop(im.getbbox())
    im.resize((max(1, round(im.width * height / im.height)), height), Image.LANCZOS).save(f'{OUT}/{name}.png', optimize=True)

frames('pod', 'skyfall_pod.png', 4, 1, 48)
frames('rift', 'rift_tear.png', 4, 1, 96)
single('pod_open', Image.open(f'{SRC}/skyfall_pod_open.png'), 48)
for i, c in enumerate(cells(Image.open(f'{SRC}/linker_antenna.png'), 3, 1), 1): single(f'antenna_{i}', c, 64)
st = cells(Image.open(f'{SRC}/signal_storm.png'), 2, 1); single('storm', st[0], 64); single('leader', st[1], 64)
keys = ['dustara', 'ferrox', 'sporeholm', 'thalassa', 'neonis', 'glyphos', 'pyros', 'glacia', 'helix', 'halo', 'umbra', 'starfall', 'apex', 'ystra']
for k, c in zip(keys, cells(Image.open(f'{SRC}/front_icons.png'), 7, 2)): single('front_' + k, c, 64)
# the panel is a full rectangle: no cutout, just resized for the 160x144 screen (drawn at 144x76)
Image.open(f'{SRC}/signal_dive_panel.png').convert('RGB').resize((432, 216), Image.LANCZOS).save(f'{OUT}/dive_panel.png', optimize=True)
print(sorted(os.listdir(OUT)), sum(os.path.getsize(f'{OUT}/{f}') for f in os.listdir(OUT)) // 1024, 'KB')
