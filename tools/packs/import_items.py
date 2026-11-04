# Cuts the shared-items renders: the 4x4 item icon sheet -> art/ui/items/<item key>.png (24x24, shown in the Bag)
# and the Linker Stash tier sheet (bronze, silver, star; closed row then open row) -> art/ui/stash_<tier>_closed|open.png at map scale.
# Run: python -P tools/packs/import_items.py <icon sheet.png> <stash tiers sheet.png>
import os, sys
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from import_buildings import blobs, key   # edge-joined magenta only, so violet details survive
from zip_build_packs import ROOT
ICONS = ['gel', 'megagel', 'fullgel', 'revive', 'maxrevive', 'cure', 'ether', 'tether', 'stun', 'jammer', 'stasis', 'harmonic', 'singularity', 'dust', 'stash', 'key']
SIZE = 24
BRONZE_W = 16   # the bronze stash body is one tile wide; silver and star keep their size relative to it

def fit(piece, n):   # into an n x n square, keeping the shape, centred, crisp alpha
    piece = piece.crop(piece.getbbox()); s = n / max(piece.size); w, h = max(1, round(piece.width * s)), max(1, round(piece.height * s))
    small = piece.resize((w, h), Image.LANCZOS); small.putalpha(small.getchannel('A').point(lambda v: 255 if v > 120 else 0))
    o = Image.new('RGBA', (n, n)); o.paste(small, ((n - w) // 2, (n - h) // 2)); return o

def icons(f):
    im = key(Image.open(f)); W, H = im.size; out = os.path.join(ROOT, 'art/ui/items'); os.makedirs(out, exist_ok=True)
    for i, k in enumerate(ICONS):
        c, r = i % 4, i // 4; cell = im.crop((c * W // 4, r * H // 4, (c + 1) * W // 4, (r + 1) * H // 4))
        fit(cell, SIZE).save(os.path.join(out, k + '.png'))
    print('icons:', len(ICONS))

def stash(f):
    im = key(Image.open(f)); B = blobs(im, 6)
    if len(B) != 6: print('stash sheet: found', len(B), 'pieces, expected 6'); return
    s = None
    for i, b in enumerate(B):   # reading order: closed bronze, silver, star, then open bronze, silver, star
        piece = im.crop((b[0], b[1], b[0] + b[2], b[1] + b[3])); piece = piece.crop(piece.getbbox())
        if s is None: s = BRONZE_W / piece.width
        w, h = max(1, round(piece.width * s)), max(1, round(piece.height * s)); small = piece.resize((w, h), Image.LANCZOS)
        small.putalpha(small.getchannel('A').point(lambda v: 255 if v > 120 else 0))
        small.save(os.path.join(ROOT, 'art/ui', f'stash_{i % 3 + 1}_{"open" if i >= 3 else "closed"}.png')); print('stash', i % 3 + 1, 'open' if i >= 3 else 'closed', small.size)

if __name__ == '__main__':
    icons(sys.argv[1]); stash(sys.argv[2])
