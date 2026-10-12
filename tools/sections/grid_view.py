"""Draw the 16-px tile grid with row/column numbers over a section's game art (and its collision, if any).
Usage: python tools/sections/grid_view.py <id> [out.png] [--scale N]
Collision overlay: red = blocked, green = grass, nothing = walkable; warps/doors drawn as cyan boxes."""
import json, os, sys, glob
from PIL import Image, ImageDraw
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sid = sys.argv[1]
out = sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].startswith('--') else f'{sid}_grid.png'
S = int(sys.argv[sys.argv.index('--scale') + 1]) if '--scale' in sys.argv else 3
f = glob.glob(os.path.join(ROOT, 'art', 'sections_game', '*', sid + '_*.png'))[0]
im = Image.open(f).convert('RGB')
W, H = im.width // 16, im.height // 16
im = im.resize((im.width * S, im.height * S), Image.NEAREST).convert('RGBA')
ov = Image.new('RGBA', im.size, (0, 0, 0, 0))
d = ImageDraw.Draw(ov)
cp = os.path.join(ROOT, 'data', 'collision', sid + '.json')
if os.path.exists(cp):
    rows = json.load(open(cp))['rows']
    for y, r in enumerate(rows):
        for x, c in enumerate(r):
            box = [x * 16 * S, y * 16 * S, (x + 1) * 16 * S - 1, (y + 1) * 16 * S - 1]
            if c == '#': d.rectangle(box, fill=(255, 0, 0, 90))
            elif c == ',': d.rectangle(box, fill=(0, 255, 0, 60))
wp = os.path.join(ROOT, sys.argv[sys.argv.index('--world') + 1] if '--world' in sys.argv else os.path.join('data', 'world.json'))
if os.path.exists(wp):
    sec = json.load(open(wp, encoding='utf-8'))['sections'].get(sid)
    for w in (sec or {}).get('warps', []):
        x, y = w['tile']
        d.rectangle([x * 16 * S, y * 16 * S, (x + 1) * 16 * S - 1, (y + 1) * 16 * S - 1], outline=(0, 255, 255, 255), width=3)
for x in range(W + 1): d.line([(x * 16 * S, 0), (x * 16 * S, im.height)], fill=(255, 0, 255, 140))
for y in range(H + 1): d.line([(0, y * 16 * S), (im.width, y * 16 * S)], fill=(255, 0, 255, 140))
for x in range(W): d.text((x * 16 * S + 3, 2), str(x), fill=(255, 255, 255, 255), stroke_width=2, stroke_fill=(0, 0, 0, 255))
for y in range(H): d.text((2, y * 16 * S + 3), str(y), fill=(255, 255, 255, 255), stroke_width=2, stroke_fill=(0, 0, 0, 255))
Image.alpha_composite(im, ov).convert('RGB').save(out)
print(out)
