# One ChatGPT zip with only buildings: 40 new designs per world (homes, shops and businesses, civic buildings and landmarks),
# five per sheet, each prompt naming the exact file its picture comes back as.
# Run: python tools/packs/zip_buildings.py [out_dir]
import os, re, sys, zipfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_build_packs import WORLDS, sheet, chunks
from zip_build_packs import ROOT, map_ref, props_ref
from buildings_more import MORE
from buildings_civic import CIVIC
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'build_pack_zips')
SHOPWORDS = re.compile(r'shop|store|market|hall|office|workshop|lab\b|canteen|bathhouse|boathouse|café|cafe|depot|stall|post|garage|smelter|foundry|library|bar\b|trading|annex|studio|kiosk|vault', re.I)
HOMEWORDS = re.compile(r'home|house|cottage|dwelling|igloo|lodge|chalet|shack|quarters|treehouse|bunker|tent|cabin|module', re.I)
KINDS = [('HOME', 'Homes', 'homes and other houses people live in'), ('SHOP', 'Shops and businesses', 'shops, workshops and businesses'),
         ('CIVIC', 'Civic buildings and landmarks', 'civic buildings, landmarks, ruins and one-off structures')]
EXTRA = {'HOME': 'These are homes: each needs a front door at the bottom edge, windows, and small lived-in touches (a plant, a mat, laundry, a lamp). Make every home clearly different from the others in shape and roof.\n',
         'SHOP': 'These are businesses: each needs a wide front door at the bottom edge and goods, tools or tables out front that show what it does at a glance (no words: shapes only). Make each one clearly different.\n',
         'CIVIC': 'These are public buildings and landmarks: give each a strong unique silhouette. Ruined or abandoned ones still have a clear doorway or gap at the bottom edge.\n'}
NOTE = 'Each building complete with its roof, set on no ground at all, with a clear front entrance on the bottom edge sized for a person about 1 tile wide.\n'

def groups(w):
    home, shop, civic = [], [], []
    for b in w['buildings']: (shop if SHOPWORDS.search(b[0]) else home if HOMEWORDS.search(b[0]) else civic).append(b)
    h, s = MORE[w['dir']]; return {'HOME': home + h, 'SHOP': shop + s, 'CIVIC': civic + CIVIC[w['dir']]}

TOP = """# Alienmon buildings pack: instructions for ChatGPT

{total} building designs for the 14 Alienmon worlds ({sheets} sheets, 5 buildings per sheet): homes, shops and businesses, civic buildings and landmarks.
Each world is a whole world, not one small town, so every building should look clearly different from the others.

## Your job, ChatGPT
1. Work one world folder at a time, in order (`01_dustara`, `02_ferrox` ...). Read its `START_HERE.md`.
2. Render each file in its `prompts/` folder **exactly as written**, one image per prompt. Attach that folder's `references/town_map.png`
   and `references/existing_buildings.png` as the style reference every time.
3. **Give every image back as its own separate PNG file.** Never put two prompts in one image, never crop, never shrink.
4. **Name every file exactly** as the `Return as:` line at the top of its prompt says (for example `03_sporeholm_HOME1.png`).
5. **Sort them into folders.** When a world is finished, zip its pictures as `Alienmon_Buildings_<world folder>.zip` with the folder
   `renders/<world folder>/` inside (for example `renders/03_sporeholm/03_sporeholm_HOME1.png`). Also offer each PNG as its own download.
6. Check each world against `RETURN_FILE_LIST.csv` before handing it back: every row has a file with exactly that name.
7. Redo any picture that breaks a rule: text or letters, a logo, a ball-shaped device, buildings touching, a background that is not flat magenta.

## Style rules
- Match the attached Alienmon map and buildings: the same detailed pixel art, outlines, palette mood and light from the top left.
- Three-quarter top-down view like the maps. One flat pure magenta #FF00FF background, edge to edge.
- No text, letters or numbers (signs stay blank). No logos or emblems. No ball-shaped capture devices, nothing round and red-and-white.
- Original designs only, not resembling Pokemon or any existing game.

## Worlds
| Folder | World | Homes | Shops | Civic | Sheets |
|---|---|---|---|---|---|
{rows}
"""

WSTART = """# {name}: {n} buildings

{line}

Attach `references/town_map.png` and `references/existing_buildings.png` to every prompt. Return each picture with the exact name on its
`Return as:` line, then zip them as `Alienmon_Buildings_{dir}.zip` with `renders/{dir}/` inside.

| Code | Sheet | Buildings | Return as |
|---|---|---|---|
{rows}
"""

def main():
    os.makedirs(OUT, exist_ok=True); base = 'Alienmon_Buildings_Pack'; zp = os.path.join(OUT, base + '.zip'); csv = ['folder,code,buildings,return_file']; top = []; total = sheets = 0
    with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
        for w in WORLDS:
            d, G, rows = w['dir'], groups(w), []
            for k, title, what in KINDS:
                for i, L in enumerate(chunks(G[k], 5)):
                    code = f'{k}{i + 1}'; ret = f'{d}_{code}.png'
                    p = sheet(w, 'buildings', what, L, NOTE + EXTRA[k])
                    z.writestr(f'{base}/{d}/prompts/{code}.md', f'# {code}: {title}, sheet {i + 1}\n\nReturn as: `renders/{d}/{ret}`\n\n```\n{p}\n```\n')
                    names = '; '.join(b[0] for b in L); rows.append(f'| {code} | {title} {i + 1} | {names} | `{ret}` |'); csv.append(f'{d},{code},"{names}",renders/{d}/{ret}'); sheets += 1
            n = sum(len(v) for v in G.values()); total += n
            z.writestr(f'{base}/{d}/START_HERE.md', WSTART.format(name=w['name'], n=n, line=w['line'][0].upper() + w['line'][1:] + '.', dir=d, rows='\n'.join(rows)))
            _, b = map_ref(d, ('town', 'landmark'))
            if b: z.writestr(f'{base}/{d}/references/town_map.png', b)
            b = props_ref(d, only=('_buildings',))
            if b: z.writestr(f'{base}/{d}/references/existing_buildings.png', b)
            top.append(f"| `{d}` | {w['name']} | {len(G['HOME'])} | {len(G['SHOP'])} | {len(G['CIVIC'])} | {len(rows)} |")
        z.writestr(f'{base}/START_HERE_FOR_CHATGPT.md', TOP.format(total=total, sheets=sheets, rows='\n'.join(top)))
        z.writestr(f'{base}/RETURN_FILE_LIST.csv', '\n'.join(csv) + '\n')
    print(os.path.basename(zp), total, 'buildings,', sheets, 'sheets,', round(os.path.getsize(zp) / 1e6, 2), 'MB')

if __name__ == '__main__':
    main()
