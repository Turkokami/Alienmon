# Holopup world line sprites: the owner's renders (art/raw/holopup_evos/<art>[_back].png, never modified) -> 192x192 game
# sprites named after the species in art/holo (front) and art/holo_back (back). Damaged files are skipped and listed.
import os, json
from PIL import Image, ImageDraw
APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = APP + '/art/raw/holopup_evos'
OUT = {'': APP + '/art/holo', '_back': APP + '/art/holo_back'}
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

done, bad = 0, []
for e in json.load(open(APP + '/data/holopup_line.json', encoding='utf-8'))['line']:
    for name, art in ((e['stage2'], e['art2']), (e['stage3'], e['art3'])):
        for suf, out in OUT.items():
            p = f'{RAW}/{art}{suf}.png'
            try:
                im = Image.open(p); im.load()
            except Exception as x:
                bad.append(f'{art}{suf}.png ({type(x).__name__})'); continue
            im = cutout(im); im = im.crop(im.getbbox())
            k = 182 / max(im.size); im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
            c = Image.new('RGBA', (192, 192), (0, 0, 0, 0)); c.alpha_composite(im, ((192 - im.width) // 2, 192 - 5 - im.height))
            c.save(f'{out}/{name}.png', optimize=True); done += 1
print(done, 'sprites written; skipped:', bad)
