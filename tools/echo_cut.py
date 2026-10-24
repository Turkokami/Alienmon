# World-Echo sprites: the owner's renders (art/raw/echo/<Name>/<Name>[_back].png, never modified) -> 192x192 game sprites
# in art/echo (front) and art/echo_back (back), white background removed. Damaged (truncated) files are skipped and listed.
import os, json
from PIL import Image, ImageDraw
APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = APP + '/art/raw/echo'
OUT = {'': APP + '/art/echo', '_back': APP + '/art/echo_back'}
for d in OUT.values(): os.makedirs(d, exist_ok=True)

def cutout(im):
    im = im.convert('RGBA'); w, h = im.size
    rgb = Image.new('RGB', (w + 2, h + 2), (255, 255, 255)); rgb.paste(im.convert('RGB'), (1, 1))
    ImageDraw.floodfill(rgb, (0, 0), (255, 0, 255), thresh=40)
    px = rgb.load(); o = im.load()
    for y in range(h):
        for x in range(w):
            if px[x + 1, y + 1] == (255, 0, 255): o[x, y] = (0, 0, 0, 0)
    return im

done, bad = [], []
for e in json.load(open(APP + '/data/echoes.json', encoding='utf-8'))['echoes']:
    for suf, out in OUT.items():
        p = f"{RAW}/{e['art']}/{e['art']}{suf}.png"
        if not os.path.exists(p): bad.append(p[len(RAW) + 1:] + ' (missing)'); continue
        try:
            im = Image.open(p); im.load()
        except Exception:
            bad.append(p[len(RAW) + 1:] + ' (damaged)'); continue
        im = cutout(im); im = im.crop(im.getbbox())
        k = 180 / max(im.size); im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
        c = Image.new('RGBA', (192, 192), (0, 0, 0, 0)); c.alpha_composite(im, ((192 - im.width) // 2, 192 - 6 - im.height))
        c.save(f"{out}/{e['art']}.png", optimize=True); done.append(e['art'] + suf)
print(len(done), 'sprites written'); print('skipped:', bad)
