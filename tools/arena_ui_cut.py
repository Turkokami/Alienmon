"""Cut the Linker Arena UI sheets (art/arena/ui/*.png, 1536x1024) into the pieces the game draws: art/arena/uicut/<name>.png.
Pieces are found as separate opaque blobs on each sheet, read left to right, top to bottom, and named from the
layouts in docs/arena/prompts/ui/ui_batch_1.md. White-backed sheets (logo, trophies) get their white keyed out first.
    python tools/arena_ui_cut.py"""
import os
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC, OUT = os.path.join(ROOT, 'art/arena/ui'), os.path.join(ROOT, 'art/arena/uicut')
TYPES = ['Plasma', 'Hydro', 'Bio', 'Volt', 'Cryo', 'Magma', 'Toxin', 'Swarm', 'Alloy', 'Crystal', 'Psi', 'Sonic', 'Gravity', 'Void']
# sheet -> (names in reading order, rows, max size of the longest side in the game)
# sheet -> list of (name, (x0, y0, x1, y1) region of the 1536x1024 sheet, max size of the longest side in the game)
def grid(prefix_names, cols, rows, size, y0=0, y1=1024):
    w, h = 1536 / cols, (y1 - y0) / rows
    return [(n, (round(c * w), round(y0 + r * h), round((c + 1) * w), round(y0 + (r + 1) * h)), size)
            for i, n in enumerate(prefix_names) for r, c in [divmod(i, cols)]]
SHEETS = {
    'countdown': grid(['cd_3', 'cd_2', 'cd_1', 'cd_go', 'cd_ko', 'cd_time'], 3, 2, 96),
    'results': grid(['res_win', 'res_lose', 'res_draw'], 1, 3, 160),
    'type_icons': grid(['ty_' + t.lower() for t in TYPES], 7, 2, 48),
    'move_buttons': grid(['btn_ready', 'btn_pressed', 'btn_cool', 'btn_locked'], 4, 1, 128, 0, 430)
                    + [('stick', (0, 430, 640, 1024), 128), ('swap', (640, 430, 1088, 1024), 96), ('pause', (1088, 430, 1536, 1024), 96)],
    'hud': None,   # irregular layout: separate blobs
    'cups': grid(['cup_%d' % i for i in range(1, 7)], 3, 2, 96),
    'trophies': grid(['trophy_%d' % i for i in range(1, 7)], 3, 2, 96),
    'logo': [('logo', (0, 0, 1536, 1024), 320)],
}
HUD = (['panel_l', 'panel_r', 'bar_g', 'bar_y', 'bar_r', 'timer', 'pips'], 2, 240)

def alpha_of(a):
    if a[..., 3].min() < 250: return a[..., 3] > 40
    rgb = a[..., :3].astype(int); white = rgb.min(-1) > 236
    lab, _ = ndimage.label(white); edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    return ~np.isin(lab, list(edge))


def save(im, name, size):
    w, h = im.size; k = min(1.0, size / max(w, h))
    im.resize((max(1, round(w * k)), max(1, round(h * k))), Image.LANCZOS).save(os.path.join(OUT, name + '.png'), optimize=True)


def cut_regions(sheet, regions):
    a = np.asarray(Image.open(os.path.join(SRC, sheet + '.png')).convert('RGBA')).copy()
    fg = alpha_of(a); a[..., 3] = np.where(fg, a[..., 3], 0)
    for name, (x0, y0, x1, y1), size in regions:
        c = a[y0:y1, x0:x1]; ys, xs = np.nonzero(c[..., 3] > 40)
        if not len(ys): print('  empty', name); continue
        save(Image.fromarray(c[ys.min():ys.max() + 1, xs.min():xs.max() + 1]), name, size)
    print(sheet, '->', ', '.join(r[0] for r in regions))


def cut_blobs(sheet, names, rows, size):
    a = np.asarray(Image.open(os.path.join(SRC, sheet + '.png')).convert('RGBA')).copy()
    fg = alpha_of(a); a[..., 3] = np.where(fg, a[..., 3], 0)
    lab, n = ndimage.label(ndimage.binary_dilation(fg, iterations=6))
    boxes = [b for b in ndimage.find_objects(lab) if (b[0].stop - b[0].start) * (b[1].stop - b[1].start) > 1500]
    band = a.shape[0] / rows
    boxes.sort(key=lambda b: (int(((b[0].start + b[0].stop) / 2) // band), b[1].start))
    if len(boxes) != len(names): print(f'  {sheet}: found {len(boxes)} pieces, expected {len(names)}')
    for name, b in zip(names, boxes): save(Image.fromarray(a[b]), name, size)
    print(sheet, '->', ', '.join(names[:len(boxes)]))


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for s, regions in SHEETS.items():
        if not os.path.exists(os.path.join(SRC, s + '.png')): continue
        if regions is None: cut_blobs(s, *HUD)
        else: cut_regions(s, regions)
