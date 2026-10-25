# World townsfolk: the owner's 4x2 sheets (art/raw/npcs/<world>_npcs_front.png / _back.png, never modified) -> 128x128 overworld
# sprites art/characters/<world>_<role>.png (front, facing down) and <world>_<role>_up.png (back). Roster order = docs/npc_prompts.
import os, json, re
from PIL import Image, ImageDraw
APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW, OUT = APP + '/art/raw/npcs', APP + '/art/characters'
ROSTER = {}
for f in sorted(os.listdir(APP + '/docs/npc_prompts')):
    m = re.match(r'\d+_(\w+)\.md$', f)
    if m: ROSTER[m.group(1)] = re.findall(r'^\| \d+ \| [^|]+ \| `' + m.group(1) + r'_(\w+)\.png` \|$', open(f'{APP}/docs/npc_prompts/{f}', encoding='utf-8').read(), re.M)   # the roster table rows only

def cutout(im):
    im = im.convert('RGBA'); w, h = im.size
    rgb = Image.new('RGB', (w + 2, h + 2), (255, 255, 255)); rgb.paste(im.convert('RGB'), (1, 1))
    ImageDraw.floodfill(rgb, (0, 0), (255, 0, 255), thresh=40)
    px = rgb.load(); o = im.load()
    for y in range(h):
        for x in range(w):
            if px[x + 1, y + 1] == (255, 0, 255): o[x, y] = (0, 0, 0, 0)
    return im

made = []
for world, roles in ROSTER.items():
    for side, suf in (('front', ''), ('back', '_up')):
        p = f'{RAW}/{world}_npcs_{side}.png'
        if not os.path.exists(p): continue
        sh = Image.open(p); cw, ch = sh.width // 4, sh.height // 2
        cells = [cutout(sh.crop((c * cw, r * ch, (c + 1) * cw, (r + 1) * ch))) for r in range(2) for c in range(4)]
        H = max(c.getbbox()[3] - c.getbbox()[1] for c in cells)   # one scale for the whole sheet keeps everyone the same size
        k = 122 / H
        for role, cell in zip(roles, cells):
            b = cell.crop(cell.getbbox()); b = b.resize((max(1, round(b.width * k)), max(1, round(b.height * k))), Image.LANCZOS)
            if b.width > 126: b = b.resize((126, max(1, round(b.height * 126 / b.width))), Image.LANCZOS)
            c = Image.new('RGBA', (128, 128), (0, 0, 0, 0)); c.alpha_composite(b, ((128 - b.width) // 2, 128 - 3 - b.height))
            c.save(f'{OUT}/{world}_{role}{suf}.png', optimize=True); made.append(f'{world}_{role}{suf}')
print(len(made), 'sprites:', ', '.join(sorted({m.rsplit('_up', 1)[0] for m in made})))
# single-character replacements (art/raw/npcs/rook_fix and art/raw/npcs/singles, <sprite>[_up].png, one figure per image) win over the sheet cut
for FIX in (APP + '/art/raw/npcs/rook_fix', APP + '/art/raw/npcs/singles'):
    if not os.path.isdir(FIX): continue
    for f in sorted(os.listdir(FIX)):
        if not f.endswith('.png'): continue
        im = cutout(Image.open(f'{FIX}/{f}')); b = im.crop(im.getbbox()); k = 122 / b.height
        b = b.resize((max(1, round(b.width * k)), 122), Image.LANCZOS)
        if b.width > 126: b = b.resize((126, max(1, round(b.height * 126 / b.width))), Image.LANCZOS)
        c = Image.new('RGBA', (128, 128), (0, 0, 0, 0)); c.alpha_composite(b, ((128 - b.width) // 2, 128 - 3 - b.height)); c.save(f'{OUT}/{f}', optimize=True)
    print('replacements:', len([f for f in os.listdir(FIX) if f.endswith('.png')]))
# the list the build uses to put each world's own people on its maps (only worlds whose sheets exist)
folk = {w: [r for r in roles if os.path.exists(f'{OUT}/{w}_{r}.png')] for w, roles in ROSTER.items()}
json.dump({w: r for w, r in folk.items() if r}, open(APP + '/data/world_folk.json', 'w'), indent=1)
