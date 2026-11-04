# Zips docs/build_packs into ONE ChatGPT render pack: instructions, a folder per world (every prompt as its own file with the exact
# name its picture must come back as, plus the reference pictures to attach) and a list of every file expected back.
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


TOP = """# Alienmon build packs: instructions for ChatGPT

This zip holds {total} image prompts for the Alienmon game's map builder: new buildings, props, furniture, signs, chests, turnaround sheets,
ground textures, terrain pieces and walking townsfolk for all 14 worlds, plus shared item icons.

## Your job, ChatGPT
1. Work one folder at a time, in folder order (`00_shared_items`, `01_dustara`, `02_ferrox` ...). Read that folder's `START_HERE.md` first.
2. Render each file in its `prompts/` folder **exactly as written**, one image per prompt, attaching the reference picture its START_HERE names.
3. **Give every image back as its own separate PNG file.** Never put several prompts in one image, never crop, never shrink.
4. **Name every file exactly** as the `Return as:` line at the top of its prompt says, for example `03_sporeholm_A1_buildings_sheet_1.png`
   (world folder, prompt code, prompt name; lowercase, underscores, `.png`). Do not rename or shorten them.
5. **Sort them into folders.** When a folder is finished, put its pictures in a zip named `Alienmon_Renders_<folder>.zip`
   (for example `Alienmon_Renders_03_sporeholm.zip`) laid out as `renders/03_sporeholm/03_sporeholm_A1_buildings_sheet_1.png` and so on.
   Also offer each PNG as its own download.
6. Before handing a folder back, check it against `RETURN_FILE_LIST.csv`: every row for that folder has a file with exactly that name.
7. If a picture breaks a rule below, redo it before returning it.

## Style rules for every picture
- Match the attached Alienmon reference picture: the same detailed pixel art, outlines, palette mood and light from the top left.
- Backgrounds are one flat pure magenta #FF00FF, edge to edge (ground textures fill the whole square instead).
- No text, letters or numbers. No logos or emblems. No ball-shaped capture devices, nothing round and red-and-white.
- Original designs only, not resembling Pokemon or any existing game.

## Folders
| Folder | World | Prompts |
|---|---|---|
{rows}
"""

WSTART = """# {name}: what to render

{line}

## Steps
1. Attach the reference picture named for each kind of prompt (table below).
2. Render the prompts in `prompts/` in order, one image each.
3. Return each image as its own PNG with the exact name on its `Return as:` line, then zip them as `Alienmon_Renders_{dir}.zip` with the folder `renders/{dir}/` inside.

## Which reference to attach
| Prompts | Attach |
|---|---|
| A, B, C, D, E, F (buildings, props, furniture, signs, chests, turnarounds) | `references/town_map.png` and `references/existing_props.png` |
| G, H (ground textures, terrain features) | `references/route_map.png` |
| I (walking townsfolk) | `references/townsfolk_style.png` |

## The prompts ({count})
| Code | What | Return as |
|---|---|---|
{rows}
"""


def ret(d, f): return f'{d}_{f[:-3]}.png'   # A1_buildings_sheet_1.md -> 03_sporeholm_A1_buildings_sheet_1.png


def pfile(d, f, t, p): return f'# {f.split("_")[0]}: {t}\n\nReturn as: `renders/{d}/{ret(d, f)}`\n\n```\n{p}\n```\n'


def main():
    os.makedirs(OUT, exist_ok=True); base = 'Alienmon_Build_Packs'; zp = os.path.join(OUT, base + '_ALL.zip'); csv = ['folder,code,prompt_file,return_file']; top = []
    with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
        sd = '00_shared_items'; sh = open(os.path.join(ROOT, 'docs/build_packs/00_shared_items.md'), encoding='utf-8').read()
        S = [(f'S{i + 1}_{n}.md', t, c) for i, ((n, t), c) in enumerate(zip([('item_icons', 'Item icons'), ('linker_stash_tiers', 'Linker Stash tiers')], re.findall(r'```\n(.*?)\n```', sh, re.S)))]
        rows = '\n'.join(f'| {f.split("_")[0]} | {t} | `{ret(sd, f)}` |' for f, t, _ in S)
        z.writestr(f'{base}/{sd}/START_HERE.md', WSTART.format(name='Shared items', line='Item icons and Linker Stash tiers used in every world. Attach any world\'s existing_props.png for style.', dir=sd, count=len(S), rows=rows))
        for f, t, p in S: z.writestr(f'{base}/{sd}/prompts/{f}', pfile(sd, f, t, p)); csv.append(f'{sd},{f.split("_")[0]},{sd}/prompts/{f},renders/{sd}/{ret(sd, f)}')
        top.append(f'| `{sd}` | Shared items | {len(S)} |'); total = len(S)
        for w in WORLDS:
            d, name = w['dir'], w['name']; md = open(os.path.join(ROOT, 'docs/build_packs', d + '.md'), encoding='utf-8').read(); P = prompts(md); total += len(P)
            rows = '\n'.join(f'| {f.split("_")[0]} | {t} | `{ret(d, f)}` |' for f, t, _ in P)
            z.writestr(f'{base}/{d}/START_HERE.md', WSTART.format(name=name, line=w['line'][0].upper() + w['line'][1:] + '.', dir=d, count=len(P), rows=rows))
            for f, t, p in P: z.writestr(f'{base}/{d}/prompts/{f}', pfile(d, f, t, p)); csv.append(f'{d},{f.split("_")[0]},{d}/prompts/{f},renders/{d}/{ret(d, f)}')
            for nm, kinds in (('town_map', ('town', 'landmark')), ('route_map', ('route', 'field'))):
                src, b = map_ref(d, kinds)
                if b: z.writestr(f'{base}/{d}/references/{nm}.png', b)
            r = os.path.join(ROOT, 'docs/npc_prompts/references', d.split('_', 1)[1] + '_style_reference.png')
            if os.path.isfile(r): z.write(r, f'{base}/{d}/references/townsfolk_style.png')
            b = props_ref(d)
            if b: z.writestr(f'{base}/{d}/references/existing_props.png', b)
            top.append(f'| `{d}` | {name} | {len(P)} |')
        z.writestr(f'{base}/START_HERE_FOR_CHATGPT.md', TOP.format(total=total, rows='\n'.join(top)))
        z.writestr(f'{base}/RETURN_FILE_LIST.csv', '\n'.join(csv) + '\n')
    print(os.path.basename(zp), total, 'prompts', round(os.path.getsize(zp) / 1e6, 2), 'MB')


if __name__ == '__main__':
    main()
