# Zips docs/build_packs into one ChatGPT render pack per world: START_HERE.md, every prompt as its own file, and the
# reference pictures to attach (a town map, a route map, the townsfolk style reference, a sample of the world's props).
# Run: python tools/packs/zip_build_packs.py [out_dir]
import io, json, os, re, sys, zipfile
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_build_packs import WORLDS
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'build_pack_zips')
SEC = json.load(open(os.path.join(ROOT, 'data/world.json'), encoding='utf-8'))['sections']

def png(im):
    b = io.BytesIO(); im.save(b, 'PNG', optimize=True); return b.getvalue()

def map_ref(d, types):   # the first finished map of that kind, enlarged 3x with hard pixels so the style reads clearly
    for t in types:
        for s in SEC.values():
            p = os.path.join(ROOT, s.get('img') or '')
            if s.get('dir') == d and s.get('type') == t and os.path.isfile(p):
                im = Image.open(p).convert('RGB'); return s['name'], png(im.resize((im.width * 3, im.height * 3), Image.NEAREST))
    return None, None

def props_ref(d):   # a strip of the world's existing props on magenta: the style new sheets should match
    ims = []
    for sub in (d + '_props2', d + '_buildings'):
        f = os.path.join(ROOT, 'art/props', sub)
        if os.path.isdir(f): ims += [Image.open(os.path.join(f, n)).convert('RGBA') for n in sorted(os.listdir(f)) if n.endswith('.png')][:8]
    if not ims: return None
    W = sum(i.width for i in ims) + 12 * (len(ims) + 1); H = max(i.height for i in ims) + 24
    o = Image.new('RGBA', (W, H), (255, 0, 255, 255)); x = 12
    for i in ims: o.paste(i, (x, H - 12 - i.height), i); x += i.width + 12
    return png(o.convert('RGB').resize((W * 3, H * 3), Image.NEAREST))

def prompts(md):   # (file name, title, prompt) for every code block, named by its section letter
    out, sec, n = [], '', {}
    for m in re.finditer(r'^(##+) (.+?)\n(.*?)(?=^##+ |\Z)', md, re.M | re.S):
        lvl, title, body = m.groups(); code = re.search(r'```\n(.*?)\n```', body, re.S)
        if lvl == '##': sec = title[0]
        if not code: continue
        k = re.match(r'([A-I]\d+)\. ', title); n[sec] = n.get(sec, 0) + 1
        tag = k.group(1) if k else f'{sec}{n[sec]}'
        slug = re.sub(r'[^a-z0-9]+', '_', re.sub(r'^[A-I]\d*\. ', '', title).lower()).strip('_')[:48]
        out.append((f'{tag}_{slug}.md', title, code.group(1)))
    return out

START = """# Alienmon build pack: {name}

Everything ChatGPT needs to draw new buildings, props, furniture, signs, chests, ground textures, terrain pieces and townsfolk for **{name}**.

## How to render (one chat for this whole world)
1. Upload this zip, or the files in `references/`, at the start of the chat.
2. Say: **"Render prompt A1 exactly as written. Attach references/town_map.png as the style reference."**
3. One prompt per message. Work down the list below.
4. If the style drifts: **"Match the attached Alienmon map exactly and try again."**
5. Check every picture: magenta background edge to edge, nothing touching, no text or letters, no ball-shaped devices.
6. Save each picture as `{dir}_<prompt code>.png` (for example `{dir}_A1.png`), open it once, then send them back a few at a time.

## Which reference to attach
| Prompts | Attach |
|---|---|
| A, B, C, D, E, F (buildings, props, furniture, signs, chests, turnarounds) | `references/town_map.png` and `references/existing_props.png` |
| G, H (ground textures, terrain features) | `references/route_map.png` |
| I (walking townsfolk) | `references/townsfolk_style.png` |

## The prompts ({count})
| Code | What | File |
|---|---|---|
{rows}

`ALL_PROMPTS.md` has every prompt in one file.
"""

def main():
    os.makedirs(OUT, exist_ok=True); made = []
    for w in WORLDS:
        d, name = w['dir'], w['name']; md = open(os.path.join(ROOT, 'docs/build_packs', d + '.md'), encoding='utf-8').read(); P = prompts(md)
        base = f'Alienmon_Build_Pack_{d}'; zp = os.path.join(OUT, base + '.zip')
        with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
            rows = '\n'.join(f'| {f.split("_")[0]} | {t} | `prompts/{f}` |' for f, t, _ in P)
            z.writestr(f'{base}/START_HERE.md', START.format(name=name, dir=d, count=len(P), rows=rows))
            z.writestr(f'{base}/ALL_PROMPTS.md', md)
            for f, t, p in P: z.writestr(f'{base}/prompts/{f}', f'# {f.split("_")[0]}: {t}\n\n```\n{p}\n```\n')
            for nm, kinds in (('town_map', ('town', 'landmark')), ('route_map', ('route', 'field'))):
                src, b = map_ref(d, kinds)
                if b: z.writestr(f'{base}/references/{nm}.png', b)
            r = os.path.join(ROOT, 'docs/npc_prompts/references', d.split('_', 1)[1] + '_style_reference.png')
            if os.path.isfile(r): z.write(r, f'{base}/references/townsfolk_style.png')
            b = props_ref(d)
            if b: z.writestr(f'{base}/references/existing_props.png', b)
            z.writestr(f'{base}/references/shared_items_pack.md', open(os.path.join(ROOT, 'docs/build_packs/00_shared_items.md'), encoding='utf-8').read())
        made.append((zp, len(P), os.path.getsize(zp)))
    for zp, n, sz in made: print(os.path.basename(zp), n, 'prompts', round(sz / 1e6, 2), 'MB')

if __name__ == '__main__':
    main()
