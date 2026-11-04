# Cuts returned map-builder pack sheets (renders/<world>/<world>_A1_buildings_sheet_1.png, _B2_outdoor_props_sheet_2.png ...) into
# editor props, in the order and with the names the prompts listed, scaled to each object's footprint:
#   A -> art/props/<world>_buildings2 (second designs of the world's own buildings)   B -> <world>_outdoor   C -> <world>_indoor
#   D -> <world>_signs   E -> <world>_interact (world chests, pickups, locked ways)   H -> <world>_features
# F (turnarounds), G (ground textures) and I (townsfolk) go in through Sprite Studio / Terrain / People instead.
# Run: python -P tools/packs/import_sheets.py <folder with the PNGs> [more folders]   (extract zips into their own folder first)
import json, os, re, sys
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_build_packs import WORLDS, chunks
from import_buildings import boxes, key, main_part   # key: only edge-joined magenta is background, so violet glows survive
from zip_build_packs import ROOT

def lists(w):   # code letter -> (sheets of (name, footprint), folder suffix, widen factor)
    return {'A': (chunks(w['buildings'], 5), 'buildings2', 1.1), 'B': (chunks(w['outdoor'], 10), 'outdoor', 1.0), 'C': (chunks(w['indoor'], 10), 'indoor', 1.0),
            'D': ([w['signs']], 'signs', 1.0), 'E': ([[(a, '1x1', b) for a, b in w['interact']]], 'interact', 1.0), 'H': (chunks(w['features'], 5), 'features', 1.0)}

def cut(f, L, grow):
    im = key(Image.open(f)); B = boxes(im, len(L)); out = []
    if len(B) != len(L): print(f'  {os.path.basename(f)}: found {len(B)} objects, expected {len(L)}: check this sheet')
    for b, (name, fp, *_) in zip(B, L):
        piece = im.crop((b[0], b[1], b[0] + b[2], b[1] + b[3]))
        if len(b) > 4: piece = main_part(piece)
        piece = piece.crop(piece.getbbox()); fw, fh = map(int, fp.split('x'))
        tw = max(8, round(fw * 16 * grow)); th = max(4, round(piece.height * tw / piece.width))
        small = piece.resize((tw, th), Image.LANCZOS); small.putalpha(small.getchannel('A').point(lambda v: 255 if v > 140 else 0))
        out.append((small, name, max(1, fh - 1)))
    return out

def main(folders):
    for folder in folders:
        files = {}
        for f in os.listdir(folder):
            m = re.match(r'(\d\d_[a-z]+)_([A-I])(\d+)_.*\.png$', f)
            if m: files[(m.group(1), m.group(2), int(m.group(3)))] = os.path.join(folder, f)
        for d in sorted({k[0] for k in files}):
            w = next(w for w in WORLDS if w['dir'] == d)
            for code, (sheets, sub, grow) in lists(w).items():
                have = [(i, files[(d, code, i + 1)]) for i in range(len(sheets)) if (d, code, i + 1) in files]
                if not have: continue
                outd = os.path.join(ROOT, 'art/props', f'{d}_{sub}'); os.makedirs(outd, exist_ok=True); cj = os.path.join(outd, 'cut.json')
                old = {c['sheet']: dict(c, file=f"{c['n']:02d}.png") for c in json.load(open(cj, encoding='utf-8'))} if os.path.isfile(cj) else {}   # keep sheets imported earlier
                for i, f in have:
                    for j, (im, name, h) in enumerate(cut(f, sheets[i], grow)): old[f'{i + 1}.{j:02d}'] = {'im': im, 'name': name, 'h': h, 'sheet': f'{i + 1}.{j:02d}'}
                cut_ = []
                for n, k in enumerate(sorted(old, key=lambda s: (int(s.split('.')[0]), s))):
                    c = old[k]; im = c.pop('im', None) or Image.open(os.path.join(outd, c.pop('file')))
                    im.save(os.path.join(outd, f'{n:02d}.tmp.png')); cut_.append({'n': n, 'src': [0, 0, im.width, im.height], 'px': [im.width, im.height], 'name': c['name'], 'h': c['h'], 'sheet': k})
                for fn in os.listdir(outd):
                    if re.fullmatch(r'\d+\.png', fn): os.remove(os.path.join(outd, fn))
                for c in cut_: os.replace(os.path.join(outd, f"{c['n']:02d}.tmp.png"), os.path.join(outd, f"{c['n']:02d}.png"))
                json.dump(cut_, open(cj, 'w', encoding='utf-8'), indent=1)
                print(f'{d}_{sub}: {len(cut_)} objects')

if __name__ == '__main__':
    main(sys.argv[1:])
