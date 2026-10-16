"""Auto-place props on V2 sections following the V2 placement rules (STITCHING_GUIDE section 6b), never cutting a path.
usage: python tools/props/place_props.py <section ids...>   -> updates data/sections/props_layout.json for those sections
Palette per section is chosen from PALETTES by planet + section type. Positions are seeded by section id (stable)."""
import json, sys, random
from collections import deque
W = json.load(open('data/world.json', encoding='utf-8')); SEC, QS = W['sections'], W.get('quest_spots', {})
CUT = {}
def size(p):
    d, n = p.split('/'); CUT.setdefault(d, {m['n']: m['px'] for m in json.load(open(f'art/props/{d}/cut.json'))})
    pw, ph = CUT[d][int(n)]; return max(1, round(pw / 16)), ph
D = lambda *ns: [f'01_dustara/{n:02d}' for n in ns]
PALETTES = {   # (planet dir, type) -> list of (kind, props, how many)
 ('01_dustara', 'town'): [('wall', D(44, 45, 46, 47, 48), 2), ('wall', D(52, 53, 49, 51), 1), ('wall', D(8, 9, 13, 15, 17, 19, 21, 23, 7), 3),
                          ('open', D(4, 5, 0, 6, 1), 2), ('open', D(25, 26, 29, 31), 2), ('open', D(2, 3, 10), 1)],
 ('01_dustara', 'route'): [('border', D(74, 76, 77, 81, 82, 83, 68, 75, 85, 92, 93, 107, 86), 3), ('border', D(38, 42), 1)],
 ('01_dustara', 'field'): [('border', D(68, 75, 85, 92, 93, 107, 74, 76), 3)],
 ('01_dustara', 'landmark'): [('border', D(25, 26, 31, 11, 12, 16, 20, 50), 2)],
 ('01_dustara', 'cave'): [('corner', D(79, 97, 103, 102, 96), 2)],
}
AVOID = {'004': [(0, 4, 7, 11), (10, 10, 14, 14)]}   # landing pad, Bonfire Ring (x0, y0, x1, y1)
FRONTIER = {'pyros', 'thalassa'}   # Molten Frontier zones: only neutral gear, no desert plants
NEUTRAL = {'route': [('border', D(11, 12, 14, 16, 18, 20, 22, 24, 38, 42, 50), 2)], 'field': [('border', D(11, 12, 16, 20, 50), 2)],
           'landmark': [('border', D(25, 26, 31, 11, 12, 16, 20), 2)], 'town': [('wall', D(11, 12, 14, 16, 18, 20, 22, 24), 3), ('wall', D(52, 53), 1), ('open', D(25, 26, 31), 2)]}
T = lambda *ns: [f'04_thalassa/{n:02d}' for n in ns]
ZONE_TOWN = {'thalassa': [('wall', T(40, 41, 43, 44, 47, 50, 51), 2), ('wall', T(35, 36, 37, 38, 75, 77, 18, 19), 3), ('wall', T(7, 8, 9, 10, 11, 12), 1),
                          ('open', T(0, 1, 2, 3), 1), ('open', T(23, 24, 26, 28), 2), ('open', T(72, 73), 1)]}
# Towns are laid out by hand like a real street: lamps in straight evenly spaced rows, stalls in a line along the
# shopfronts, planters in pairs either side of a door, benches facing each other. (prop, x, y)
HAND = {
 '153': [('14_ystra/16', 7, 5), ('14_ystra/16', 15, 5), ('14_ystra/16', 21, 5), ('14_ystra/78', 9, 5), ('14_ystra/78', 16, 5), ('14_ystra/37', 18, 9), ('14_ystra/99', 11, 11)],
 '154': [('14_ystra/16', 5, 5), ('14_ystra/16', 12, 5), ('14_ystra/16', 19, 5), ('14_ystra/56', 8, 10)],
 '155': [('14_ystra/16', 5, 5), ('14_ystra/16', 12, 5), ('14_ystra/16', 19, 5), ('14_ystra/46', 16, 9)],
 '156': [('14_ystra/16', 5, 5), ('14_ystra/16', 12, 5), ('14_ystra/16', 19, 5), ('14_ystra/44', 16, 9)],
 '157': [('14_ystra/16', 4, 5), ('14_ystra/16', 17, 5), ('14_ystra/82', 8, 8), ('14_ystra/82', 15, 8)],
 '158': [('14_ystra/70', 2, 4), ('14_ystra/70', 13, 4), ('14_ystra/101', 2, 10)],
 '159': [('14_ystra/70', 1, 3), ('14_ystra/70', 14, 3), ('14_ystra/51', 2, 10)],
 '160': [('14_ystra/16', 5, 5), ('14_ystra/16', 18, 5), ('14_ystra/119', 7, 9)],
 '161': [('14_ystra/16', 5, 5), ('14_ystra/16', 16, 5), ('14_ystra/120', 19, 9)],
 '162': [('14_ystra/16', 4, 5), ('14_ystra/16', 19, 5), ('14_ystra/46', 6, 10)],
 '163': [('14_ystra/16', 2, 5), ('14_ystra/16', 8, 5), ('14_ystra/16', 14, 5), ('14_ystra/102', 5, 10), ('14_ystra/117', 13, 10)],
 '146': [('13_apex/13', 6, 4), ('13_apex/13', 9, 4), ('13_apex/13', 14, 4), ('13_apex/13', 18, 4), ('13_apex/13', 22, 4), ('13_apex/71', 10, 4), ('13_apex/71', 13, 4), ('13_apex/51', 8, 7), ('13_apex/60', 19, 7), ('13_apex/32', 12, 9), ('13_apex/62', 16, 8), ('13_apex/39', 6, 9), ('13_apex/39', 22, 9), ('13_apex/61', 9, 12)],
 '147': [('13_apex/36', 3, 5), ('13_apex/36', 12, 5), ('13_apex/120', 3, 12), ('13_apex/120', 12, 12)],
 '148': [('13_apex/120', 3, 12), ('13_apex/120', 12, 12), ('13_apex/32', 5, 9)],
 '149': [('13_apex/73', 3, 5), ('13_apex/74', 12, 5), ('13_apex/120', 3, 12), ('13_apex/120', 12, 12)],
 '150': [('13_apex/63', 4, 6), ('13_apex/75', 11, 6), ('13_apex/120', 3, 12), ('13_apex/120', 12, 12)],
 '151': [('13_apex/13', 2, 8), ('13_apex/13', 13, 8), ('13_apex/13', 2, 18), ('13_apex/13', 13, 18)],
 '152': [('13_apex/59', 3, 5), ('13_apex/81', 12, 5), ('13_apex/56', 4, 10), ('13_apex/68', 11, 10)],
 '136': [('12_starfall/28', 2, 5), ('12_starfall/28', 7, 5), ('12_starfall/28', 12, 5), ('12_starfall/28', 17, 5), ('12_starfall/28', 22, 5), ('12_starfall/03', 8, 5), ('12_starfall/03', 11, 5), ('12_starfall/01', 8, 8), ('12_starfall/80', 12, 8), ('12_starfall/23', 16, 8), ('12_starfall/09', 19, 11), ('12_starfall/101', 9, 11), ('12_starfall/101', 13, 11), ('12_starfall/50', 22, 11)],
 '137': [('12_starfall/97', 3, 4), ('12_starfall/97', 12, 4), ('12_starfall/109', 12, 11), ('12_starfall/110', 3, 11)],
 '138': [('12_starfall/11', 6, 5), ('12_starfall/11', 17, 5), ('12_starfall/45', 4, 9), ('12_starfall/20', 19, 9)],
 '139': [('12_starfall/11', 6, 5), ('12_starfall/11', 17, 5), ('12_starfall/46', 14, 8)],
 '140': [('12_starfall/28', 8, 4), ('12_starfall/28', 15, 4), ('12_starfall/74', 3, 9), ('12_starfall/01', 19, 9)],
 '141': [('12_starfall/11', 5, 5), ('12_starfall/11', 18, 5), ('12_starfall/40', 11, 9), ('12_starfall/41', 13, 9)],
 '142': [('12_starfall/47', 2, 5), ('12_starfall/19', 13, 5), ('12_starfall/59', 2, 9)],
 '143': [('12_starfall/47', 13, 4), ('12_starfall/72', 2, 9)],
 '144': [('12_starfall/47', 2, 5), ('12_starfall/59', 13, 5)],
 '145': [('12_starfall/11', 3, 4), ('12_starfall/11', 12, 4), ('12_starfall/40', 4, 10), ('12_starfall/38', 11, 11)],
 '123': [('11_umbra/42', 5, 4), ('11_umbra/42', 10, 4), ('11_umbra/79', 2, 6), ('11_umbra/78', 13, 6)],
 '124': [('11_umbra/16', 1, 4), ('11_umbra/16', 6, 4), ('11_umbra/16', 11, 4), ('11_umbra/16', 17, 4), ('11_umbra/16', 22, 4), ('11_umbra/26', 5, 4), ('11_umbra/26', 10, 4), ('11_umbra/26', 13, 4), ('11_umbra/26', 16, 4), ('11_umbra/33', 3, 7), ('11_umbra/35', 8, 7), ('11_umbra/39', 15, 7), ('11_umbra/33', 19, 7), ('11_umbra/01', 6, 10), ('11_umbra/04', 16, 10), ('11_umbra/48', 1, 11), ('11_umbra/48', 22, 11)],
 '125': [('11_umbra/84', 2, 5), ('11_umbra/84', 13, 5)],
 '126': [('11_umbra/26', 3, 12), ('11_umbra/26', 12, 12), ('11_umbra/68', 11, 7)],
 '127': [('11_umbra/16', 5, 4), ('11_umbra/16', 12, 4), ('11_umbra/16', 19, 4), ('11_umbra/05', 8, 9), ('11_umbra/37', 16, 9)],
 '128': [('11_umbra/16', 5, 4), ('11_umbra/16', 12, 4), ('11_umbra/16', 19, 4), ('11_umbra/38', 8, 9), ('11_umbra/01', 16, 9)],
 '129': [('11_umbra/42', 2, 4), ('11_umbra/42', 13, 4), ('11_umbra/81', 2, 8)],
 '130': [('11_umbra/79', 2, 4), ('11_umbra/78', 13, 4), ('11_umbra/42', 2, 8)],
 '131': [('11_umbra/83', 2, 4), ('11_umbra/89', 12, 4), ('11_umbra/42', 13, 9)],
 '132': [('11_umbra/84', 2, 4), ('11_umbra/91', 14, 9), ('11_umbra/42', 2, 9)],
 '133': [('11_umbra/68', 4, 6), ('11_umbra/69', 11, 6), ('11_umbra/26', 3, 12)],
 '134': [('11_umbra/48', 2, 3), ('11_umbra/48', 13, 3)],
 '135': [('11_umbra/84', 2, 6), ('11_umbra/84', 13, 6), ('11_umbra/84', 2, 19), ('11_umbra/84', 13, 19)],
 '114': [('10_halo/17', 7, 4), ('10_halo/17', 14, 4), ('10_halo/39', 16, 4), ('10_halo/40', 20, 4), ('10_halo/39', 21, 4), ('10_halo/05', 9, 10), ('10_halo/05', 14, 10), ('10_halo/00', 6, 10), ('10_halo/00', 19, 10)],
 '115': [('10_halo/16', 1, 5), ('10_halo/16', 6, 5), ('10_halo/16', 12, 5), ('10_halo/16', 17, 5), ('10_halo/16', 22, 5), ('10_halo/07', 7, 5), ('10_halo/07', 10, 5), ('10_halo/07', 13, 5), ('10_halo/07', 16, 5), ('10_halo/00', 6, 8), ('10_halo/01', 16, 8), ('10_halo/32', 2, 11), ('10_halo/33', 6, 11), ('10_halo/34', 16, 11), ('10_halo/32', 20, 11), ('10_halo/71', 1, 12), ('10_halo/71', 22, 12)],
 '116': [('10_halo/08', 3, 5), ('10_halo/08', 12, 5)],
 '117': [('10_halo/08', 2, 12), ('10_halo/08', 13, 12), ('10_halo/27', 12, 6)],
 '118': [('10_halo/17', 5, 5), ('10_halo/17', 11, 5), ('10_halo/17', 17, 5), ('10_halo/17', 8, 9), ('10_halo/17', 15, 9)],
 '119': [('10_halo/17', 5, 5), ('10_halo/17', 11, 5), ('10_halo/17', 17, 5), ('10_halo/17', 8, 9), ('10_halo/17', 15, 9)],
 '120': [('10_halo/17', 5, 5), ('10_halo/17', 11, 5), ('10_halo/17', 17, 5), ('10_halo/17', 8, 9), ('10_halo/17', 15, 9)],
 '121': [('10_halo/71', 4, 2), ('10_halo/71', 11, 2), ('10_halo/16', 2, 10), ('10_halo/16', 13, 10), ('10_halo/16', 2, 19), ('10_halo/16', 13, 19)],
 '122': [('10_halo/71', 2, 5), ('10_halo/71', 13, 5), ('10_halo/71', 2, 20), ('10_halo/71', 13, 20)],
 '105': [('09_helix/16', 3, 4), ('09_helix/16', 9, 4), ('09_helix/16', 15, 4), ('09_helix/16', 21, 4), ('09_helix/184', 8, 8), ('09_helix/43', 10, 8), ('09_helix/44', 13, 8), ('09_helix/184', 16, 8), ('09_helix/170', 2, 11), ('09_helix/172', 3, 11), ('09_helix/196', 18, 11), ('09_helix/36', 20, 11), ('09_helix/36', 21, 11), ('09_helix/69', 8, 12), ('09_helix/69', 15, 12)],
 '106': [('09_helix/69', 12, 4), ('09_helix/36', 3, 12), ('09_helix/36', 12, 12)],
 '107': [('09_helix/103', 3, 12), ('09_helix/105', 11, 12)],
 '108': [('09_helix/104', 4, 12), ('09_helix/106', 11, 12)],
 '109': [('09_helix/16', 3, 3), ('09_helix/16', 12, 3), ('09_helix/16', 3, 12), ('09_helix/16', 12, 12)],
 '110': [('09_helix/16', 2, 11), ('09_helix/16', 13, 11)],
 '111': [('09_helix/196', 11, 11), ('09_helix/36', 3, 12), ('09_helix/36', 4, 12)],
 '112': [('09_helix/69', 3, 4), ('09_helix/69', 12, 4)],
 '113': [('09_helix/41', 2, 4), ('09_helix/41', 13, 4), ('09_helix/16', 2, 21), ('09_helix/16', 13, 21)],
 '093': [('08_glacia/86', 7, 5), ('08_glacia/60', 10, 5), ('08_glacia/60', 15, 5), ('08_glacia/60', 20, 5), ('08_glacia/72', 8, 8), ('08_glacia/73', 12, 8), ('08_glacia/74', 16, 8), ('08_glacia/72', 20, 8), ('08_glacia/113', 2, 11), ('08_glacia/61', 5, 11), ('08_glacia/90', 8, 11), ('08_glacia/90', 15, 11), ('08_glacia/113', 18, 11), ('08_glacia/93', 21, 11)],
 '094': [('08_glacia/154', 2, 5), ('08_glacia/154', 13, 5), ('08_glacia/163', 2, 12), ('08_glacia/163', 13, 12)],
 '095': [('08_glacia/154', 3, 12), ('08_glacia/154', 12, 12), ('08_glacia/86', 3, 7)],
 '096': [('08_glacia/15', 6, 5), ('08_glacia/15', 12, 5), ('08_glacia/15', 18, 5), ('08_glacia/66', 9, 9), ('08_glacia/57', 15, 9)],
 '097': [('08_glacia/15', 5, 5), ('08_glacia/15', 17, 5), ('08_glacia/89', 8, 9), ('08_glacia/86', 16, 9)],
 '098': [('08_glacia/95', 2, 4), ('08_glacia/25', 13, 4), ('08_glacia/95', 13, 10)],
 '099': [('08_glacia/25', 2, 5), ('08_glacia/95', 13, 5), ('08_glacia/93', 2, 10)],
 '100': [('08_glacia/95', 1, 6), ('08_glacia/25', 14, 6), ('08_glacia/93', 3, 10)],
 '101': [('08_glacia/15', 6, 6), ('08_glacia/15', 17, 6), ('08_glacia/128', 3, 11), ('08_glacia/98', 5, 12), ('08_glacia/126', 15, 9)],
 '102': [('08_glacia/15', 5, 6), ('08_glacia/15', 19, 6), ('08_glacia/90', 3, 10), ('08_glacia/93', 15, 10)],
 '103': [('08_glacia/123', 2, 5), ('08_glacia/123', 13, 5), ('08_glacia/123', 2, 19), ('08_glacia/123', 13, 19)],
 '104': [('08_glacia/123', 3, 6), ('08_glacia/123', 12, 6), ('08_glacia/123', 3, 19), ('08_glacia/123', 12, 19)],
 '082': [('07_pyros/15', 7, 5), ('07_pyros/24', 10, 5), ('07_pyros/15', 12, 5), ('07_pyros/24', 13, 5), ('07_pyros/24', 16, 5), ('07_pyros/15', 17, 5), ('07_pyros/24', 18, 5), ('07_pyros/24', 21, 5), ('07_pyros/15', 22, 5), ('07_pyros/77', 8, 8), ('07_pyros/78', 12, 8), ('07_pyros/79', 16, 8), ('07_pyros/77', 20, 8), ('07_pyros/84', 9, 11), ('07_pyros/111', 12, 11), ('07_pyros/97', 15, 11), ('07_pyros/109', 17, 11), ('07_pyros/34', 21, 11), ('07_pyros/89', 8, 12), ('07_pyros/27', 20, 12)],
 '083': [('07_pyros/171', 3, 4), ('07_pyros/171', 12, 4), ('07_pyros/172', 3, 12), ('07_pyros/172', 12, 12)],
 '084': [('07_pyros/161', 11, 6), ('07_pyros/160', 11, 9), ('07_pyros/89', 3, 12), ('07_pyros/89', 12, 12), ('07_pyros/100', 2, 11)],
 '085': [('07_pyros/17', 6, 5), ('07_pyros/17', 12, 5), ('07_pyros/17', 18, 5), ('07_pyros/34', 9, 9), ('07_pyros/89', 15, 9), ('07_pyros/123', 4, 9)],
 '086': [('07_pyros/17', 5, 5), ('07_pyros/17', 17, 5), ('07_pyros/89', 8, 9), ('07_pyros/57', 16, 9), ('07_pyros/57', 12, 13)],
 '087': [('07_pyros/83', 2, 4), ('07_pyros/83', 13, 4), ('07_pyros/57', 2, 9), ('07_pyros/130', 13, 9)],
 '088': [('07_pyros/83', 2, 4), ('07_pyros/83', 13, 4), ('07_pyros/34', 3, 9), ('07_pyros/89', 12, 9)],
 '089': [('07_pyros/83', 2, 4), ('07_pyros/83', 13, 4), ('07_pyros/130', 3, 10), ('07_pyros/57', 12, 10)],
 '090': [('07_pyros/84', 6, 5), ('07_pyros/85', 12, 5), ('07_pyros/84', 18, 5), ('07_pyros/70', 9, 9), ('07_pyros/89', 15, 9)],
 '091': [('07_pyros/18', 3, 4), ('07_pyros/18', 12, 4), ('07_pyros/18', 3, 18), ('07_pyros/18', 12, 18)],
 '092': [('07_pyros/18', 3, 6), ('07_pyros/18', 12, 6), ('07_pyros/18', 3, 19), ('07_pyros/18', 12, 19)],
 # Glyphos (sheet 06_glyphos): camp lanterns and banners, a finds table, cook fire and mess table, dig gear stacked by the tents, glyph stones and braziers in the ruins and temple
 '072': [('06_glyphos/17', 7, 4), ('06_glyphos/17', 15, 4), ('06_glyphos/28', 13, 10), ('06_glyphos/21', 13, 12), ('06_glyphos/26', 5, 9), ('06_glyphos/26', 18, 9)],
 '073': [('06_glyphos/27', 5, 5), ('06_glyphos/35', 6, 5), ('06_glyphos/27', 12, 5), ('06_glyphos/27', 17, 5), ('06_glyphos/35', 18, 5), ('06_glyphos/59', 4, 8), ('06_glyphos/94', 10, 8), ('06_glyphos/114', 15, 8), ('06_glyphos/12', 19, 8), ('06_glyphos/28', 4, 12), ('06_glyphos/28', 5, 12), ('06_glyphos/44', 8, 12), ('06_glyphos/25', 14, 12), ('06_glyphos/02', 18, 12), ('06_glyphos/33', 19, 12)],
 '074': [('06_glyphos/121', 5, 5), ('06_glyphos/121', 10, 5), ('06_glyphos/132', 4, 12), ('06_glyphos/132', 11, 12)],
 '075': [('06_glyphos/35', 6, 5), ('06_glyphos/35', 17, 5), ('06_glyphos/47', 3, 9), ('06_glyphos/47', 20, 9), ('06_glyphos/16', 9, 5)],
 '076': [('06_glyphos/35', 6, 5), ('06_glyphos/35', 17, 5), ('06_glyphos/26', 4, 9), ('06_glyphos/26', 19, 9)],
 '077': [('06_glyphos/47', 7, 5), ('06_glyphos/47', 16, 5), ('06_glyphos/121', 5, 9), ('06_glyphos/121', 18, 9)],
 '078': [('06_glyphos/121', 2, 5), ('06_glyphos/121', 13, 5), ('06_glyphos/121', 2, 15), ('06_glyphos/121', 13, 15)],
 '079': [('06_glyphos/121', 2, 4), ('06_glyphos/121', 13, 4), ('06_glyphos/63', 3, 10), ('06_glyphos/63', 12, 10), ('06_glyphos/121', 2, 18), ('06_glyphos/121', 13, 18)],
 '080': [('06_glyphos/110', 3, 6), ('06_glyphos/110', 12, 6), ('06_glyphos/63', 4, 12), ('06_glyphos/63', 11, 12), ('06_glyphos/121', 2, 18), ('06_glyphos/121', 13, 18)],
 '081': [('06_glyphos/130', 3, 5), ('06_glyphos/130', 12, 5), ('06_glyphos/132', 3, 12), ('06_glyphos/132', 12, 12)],
 # Neonis (sheet 05_neonis): neon lamp + planter rows, four evenly spaced market stalls, benches and vending machines
 '062': [('05_neonis/17', 7, 5), ('05_neonis/10', 8, 5), ('05_neonis/17', 12, 5), ('05_neonis/10', 13, 5), ('05_neonis/17', 17, 5), ('05_neonis/10', 18, 5), ('05_neonis/37', 7, 8), ('05_neonis/38', 11, 8), ('05_neonis/39', 15, 8), ('05_neonis/42', 19, 8), ('05_neonis/04', 2, 12), ('05_neonis/04', 5, 12), ('05_neonis/00', 9, 11), ('05_neonis/00', 13, 11), ('05_neonis/56', 16, 12), ('05_neonis/45', 19, 12), ('05_neonis/46', 20, 12)],
 '063': [('05_neonis/17', 6, 5), ('05_neonis/10', 7, 5), ('05_neonis/17', 12, 5), ('05_neonis/10', 13, 5), ('05_neonis/17', 18, 5), ('05_neonis/10', 19, 5), ('05_neonis/38', 5, 8), ('05_neonis/40', 9, 8), ('05_neonis/39', 13, 8), ('05_neonis/37', 17, 8), ('05_neonis/01', 2, 12), ('05_neonis/01', 6, 12), ('05_neonis/01', 15, 12), ('05_neonis/01', 19, 12), ('05_neonis/46', 21, 12)],
 '066': [('05_neonis/45', 7, 4), ('05_neonis/46', 8, 4), ('05_neonis/47', 15, 4), ('05_neonis/45', 16, 4), ('05_neonis/19', 4, 6), ('05_neonis/19', 19, 6), ('05_neonis/00', 5, 9), ('05_neonis/00', 9, 9), ('05_neonis/43', 15, 8)],
 '067': [('05_neonis/17', 4, 5), ('05_neonis/17', 8, 5), ('05_neonis/17', 15, 5), ('05_neonis/17', 19, 5), ('05_neonis/36', 13, 9)],
 '068': [('05_neonis/17', 4, 4), ('05_neonis/17', 8, 4), ('05_neonis/17', 16, 4), ('05_neonis/17', 20, 4), ('05_neonis/28', 6, 9)],
 '069': [('05_neonis/10', 2, 3), ('05_neonis/10', 13, 3), ('05_neonis/57', 3, 10), ('05_neonis/57', 12, 10), ('05_neonis/10', 2, 20), ('05_neonis/10', 13, 20)],
 '070': [('05_neonis/10', 2, 3), ('05_neonis/10', 13, 3), ('05_neonis/57', 3, 10), ('05_neonis/57', 12, 10), ('05_neonis/10', 2, 20), ('05_neonis/10', 13, 20)],
 '071': [('05_neonis/57', 3, 6), ('05_neonis/57', 12, 6), ('05_neonis/10', 2, 20), ('05_neonis/10', 13, 20)],
 '064': [('05_neonis/10', 2, 5), ('05_neonis/10', 13, 5), ('05_neonis/01', 3, 9), ('05_neonis/01', 11, 9), ('05_neonis/12', 2, 12), ('05_neonis/12', 13, 12)],
 '065': [('05_neonis/46', 5, 8), ('05_neonis/47', 10, 8), ('05_neonis/10', 3, 12), ('05_neonis/10', 12, 12)],
 '170': [('05_neonis/12', 3, 4), ('05_neonis/12', 12, 4)],
 # Thalassa (sheet 04_thalassa), dense harbour layouts: lamps and planters in rows along the shopfronts, a market row of fish stalls, benches and crates along the waterfront
 '052': [('04_thalassa/24', 2, 4), ('04_thalassa/09', 3, 4), ('04_thalassa/09', 6, 4), ('04_thalassa/24', 8, 4), ('04_thalassa/07', 9, 4), ('04_thalassa/07', 12, 4), ('04_thalassa/24', 14, 4), ('04_thalassa/09', 15, 4), ('04_thalassa/09', 17, 4), ('04_thalassa/24', 19, 4), ('04_thalassa/09', 21, 4), ('04_thalassa/59', 7, 7), ('04_thalassa/40', 12, 8), ('04_thalassa/43', 15, 8), ('04_thalassa/44', 18, 8), ('04_thalassa/41', 21, 8), ('04_thalassa/78', 3, 10), ('04_thalassa/01', 6, 10), ('04_thalassa/19', 9, 10), ('04_thalassa/20', 10, 10), ('04_thalassa/37', 13, 10), ('04_thalassa/19', 14, 10), ('04_thalassa/01', 16, 10)],
 '053': [('04_thalassa/25', 2, 5), ('04_thalassa/06', 4, 5), ('04_thalassa/25', 6, 5), ('04_thalassa/09', 7, 5), ('04_thalassa/07', 10, 5), ('04_thalassa/25', 11, 5), ('04_thalassa/07', 12, 5), ('04_thalassa/09', 15, 5), ('04_thalassa/25', 16, 5), ('04_thalassa/06', 18, 5), ('04_thalassa/06', 20, 5), ('04_thalassa/40', 3, 8), ('04_thalassa/43', 7, 8), ('04_thalassa/73', 11, 8), ('04_thalassa/44', 16, 8), ('04_thalassa/49', 20, 8), ('04_thalassa/20', 2, 10), ('04_thalassa/19', 3, 10), ('04_thalassa/02', 6, 10), ('04_thalassa/02', 12, 10), ('04_thalassa/37', 15, 10), ('04_thalassa/18', 16, 10)],
 '054': [('04_thalassa/09', 2, 4), ('04_thalassa/09', 13, 4), ('04_thalassa/02', 3, 7), ('04_thalassa/02', 11, 7), ('04_thalassa/87', 3, 10), ('04_thalassa/87', 11, 10), ('04_thalassa/07', 2, 12), ('04_thalassa/07', 13, 12)],
 '055': [('04_thalassa/20', 4, 6), ('04_thalassa/37', 11, 6), ('04_thalassa/87', 4, 9), ('04_thalassa/87', 10, 9), ('04_thalassa/07', 3, 12), ('04_thalassa/07', 12, 12)],
 '056': [('04_thalassa/09', 2, 3), ('04_thalassa/09', 13, 3), ('04_thalassa/24', 5, 6), ('04_thalassa/24', 10, 6), ('04_thalassa/39', 2, 10), ('04_thalassa/39', 13, 10), ('04_thalassa/24', 5, 16), ('04_thalassa/24', 10, 16), ('04_thalassa/09', 2, 20), ('04_thalassa/09', 13, 20)],
 '057': [('04_thalassa/65', 5, 8), ('04_thalassa/63', 17, 5), ('04_thalassa/19', 8, 5), ('04_thalassa/20', 9, 5), ('04_thalassa/15', 13, 5), ('04_thalassa/72', 20, 8)],
 '058': [('04_thalassa/67', 4, 5), ('04_thalassa/69', 19, 8), ('04_thalassa/73', 14, 5), ('04_thalassa/18', 8, 8), ('04_thalassa/20', 9, 8)],
 '059': [('04_thalassa/72', 9, 9), ('04_thalassa/39', 12, 10), ('04_thalassa/19', 14, 10), ('04_thalassa/37', 15, 10), ('04_thalassa/65', 5, 10)],
 '060': [('04_thalassa/09', 2, 4), ('04_thalassa/09', 13, 4), ('04_thalassa/26', 5, 8), ('04_thalassa/26', 10, 8), ('04_thalassa/26', 5, 14), ('04_thalassa/26', 10, 14), ('04_thalassa/09', 2, 20), ('04_thalassa/09', 13, 20)],
 '061': [('04_thalassa/09', 2, 6), ('04_thalassa/09', 13, 6), ('04_thalassa/26', 5, 5), ('04_thalassa/26', 10, 5), ('04_thalassa/09', 2, 18), ('04_thalassa/09', 13, 18)],
 '167': [('04_thalassa/19', 2, 3), ('04_thalassa/18', 3, 3), ('04_thalassa/38', 12, 3), ('04_thalassa/19', 13, 3), ('04_thalassa/19', 2, 11), ('04_thalassa/38', 13, 11)],
 '168': [('04_thalassa/35', 3, 5), ('04_thalassa/35', 12, 5), ('04_thalassa/18', 3, 11), ('04_thalassa/19', 11, 11)],
 '169': [('04_thalassa/19', 4, 4), ('04_thalassa/18', 5, 4), ('04_thalassa/37', 10, 4), ('04_thalassa/19', 15, 4), ('04_thalassa/18', 16, 4), ('04_thalassa/35', 6, 12), ('04_thalassa/37', 10, 12), ('04_thalassa/19', 14, 12)],
 # Sporeholm (sheet 03_sporeholm): lantern rows along the boardwalk, market stalls at the plaza ends, bench+planter pairs
 '041': [('03_sporeholm/53', 8, 4), ('03_sporeholm/53', 13, 4), ('03_sporeholm/53', 18, 4), ('03_sporeholm/99', 17, 9), ('03_sporeholm/04', 10, 10)],
 '042': [('03_sporeholm/26', 6, 4), ('03_sporeholm/26', 12, 4), ('03_sporeholm/26', 17, 4), ('03_sporeholm/84', 2, 9), ('03_sporeholm/102', 19, 9), ('03_sporeholm/26', 6, 9), ('03_sporeholm/26', 17, 9),
         ('03_sporeholm/03', 9, 11), ('03_sporeholm/04', 13, 11), ('03_sporeholm/99', 1, 4)],
 '045': [('03_sporeholm/62', 8, 5), ('03_sporeholm/62', 16, 5)],
 '046': [('03_sporeholm/62', 6, 5), ('03_sporeholm/62', 18, 5)],
 '047': [('03_sporeholm/22', 2, 4), ('03_sporeholm/22', 13, 4)],
 '048': [('03_sporeholm/22', 1, 5), ('03_sporeholm/22', 14, 5)],
 '049': [('03_sporeholm/62', 5, 5), ('03_sporeholm/62', 18, 5), ('03_sporeholm/03', 14, 9)],
 '050': [('03_sporeholm/145', 1, 2), ('03_sporeholm/145', 14, 2), ('03_sporeholm/197', 1, 18), ('03_sporeholm/197', 13, 18)],
 '051': [('03_sporeholm/144', 2, 5), ('03_sporeholm/144', 12, 5), ('03_sporeholm/150', 1, 19), ('03_sporeholm/150', 14, 19)],
 '043': [('03_sporeholm/117', 2, 5), ('03_sporeholm/117', 13, 5), ('03_sporeholm/04', 2, 8), ('03_sporeholm/04', 11, 8), ('03_sporeholm/112', 10, 5)],
 '044': [('03_sporeholm/118', 2, 6), ('03_sporeholm/118', 2, 9), ('03_sporeholm/118', 13, 6), ('03_sporeholm/118', 13, 9), ('03_sporeholm/163', 4, 10), ('03_sporeholm/163', 10, 10), ('03_sporeholm/117', 2, 12), ('03_sporeholm/117', 13, 12)],
 # Dustara rooms furnished from the Ferrox house/interior designs: furniture against the walls, the centre aisle, doormat, stairs and counters clear
 '001': [('02_ferrox/240', 13, 9), ('02_ferrox/183', 12, 12), ('02_ferrox/165', 2, 12), ('02_ferrox/203', 2, 10), ('02_ferrox/189', 10, 10, 1, {'solid': False, 'h': 2})],
 '002': [('02_ferrox/179', 12, 9), ('02_ferrox/240', 13, 12), ('02_ferrox/203', 2, 13), ('02_ferrox/189', 9, 10, 1, {'solid': False, 'h': 2})],
 '003': [('02_ferrox/196', 3, 12), ('02_ferrox/208', 12, 12)],
 '005': [('02_ferrox/203', 3, 12), ('02_ferrox/203', 12, 12)],
 '006': [('02_ferrox/214', 3, 12), ('02_ferrox/156', 11, 12)],
 '165': [('02_ferrox/156', 4, 4), ('02_ferrox/214', 6, 4), ('02_ferrox/157', 9, 4), ('02_ferrox/172', 12, 6), ('02_ferrox/245', 12, 9), ('02_ferrox/244', 12, 10), ('02_ferrox/241', 7, 8, 1, {'solid': False, 'h': 3})],
 '166': [('02_ferrox/183', 12, 5), ('02_ferrox/180', 12, 8), ('02_ferrox/156', 11, 12), ('02_ferrox/167', 13, 12), ('02_ferrox/155', 3, 5)],
 # Ferrox (sheet 02_ferrox): lamps in straight rows, stalls along the shopfronts, plants either side of doors
 '029': [('02_ferrox/80', 4, 9), ('02_ferrox/80', 8, 9), ('02_ferrox/80', 16, 9), ('02_ferrox/80', 20, 9), ('02_ferrox/66', 18, 4), ('02_ferrox/04', 20, 4)],
 '030': [('02_ferrox/80', 5, 5), ('02_ferrox/30', 7, 5), ('02_ferrox/30', 10, 5), ('02_ferrox/80', 12, 5), ('02_ferrox/66', 13, 5), ('02_ferrox/80', 18, 5), ('02_ferrox/01', 19, 5)],
 '037': [('02_ferrox/106', 11, 5), ('02_ferrox/04', 13, 5), ('02_ferrox/01', 17, 5), ('02_ferrox/107', 18, 5),
         ('02_ferrox/80', 2, 10), ('02_ferrox/80', 7, 10), ('02_ferrox/80', 16, 10), ('02_ferrox/80', 21, 10)],
 '031': [('02_ferrox/30', 6, 12), ('02_ferrox/30', 9, 12)],
 '032': [('02_ferrox/01', 3, 12), ('02_ferrox/66', 11, 12)],
 '033': [('02_ferrox/66', 3, 12), ('02_ferrox/04', 12, 12)],
 '034': [], '035': [], '036': [], '038': [], '039': [], '040': [],
 # routes and landmarks: no random clutter; only purposeful groups (the map art already carries the scenery)
 '007': [], '009': [], '011': [], '014': [], '015': [], '016': [], '017': [], '020': [], '021': [], '022': [], '023': [],
 '024': [], '025': [], '027': [], '028': [],
 '010': [('01_dustara/42', 14, 5)],   # signpost at the fork
 '019': [('04_thalassa/37', 3, 5), ('04_thalassa/35', 4, 5), ('04_thalassa/36', 5, 5), ('04_thalassa/35', 18, 5), ('04_thalassa/37', 19, 5), ('04_thalassa/38', 20, 5)],   # cargo by the ferry
 '026': [('04_thalassa/35', 8, 5), ('04_thalassa/36', 9, 5), ('04_thalassa/35', 14, 5), ('04_thalassa/36', 15, 5)],   # cargo either side of the shuttle ramp
 '004': [   # owner's second mockup (2026-10-15): fountain over the Bonfire Ring, market row with a planter in the middle
  ('01_dustara/26', 0, 4), ('01_dustara/26', 9, 4), ('01_dustara/26', 23, 4),
  ('01_dustara/15', 1, 4), ('01_dustara/19', 8, 4), ('01_dustara/23', 13, 4), ('01_dustara/17', 18, 4),
  ('01_dustara/28', 7, 7), ('01_dustara/44', 8, 7), ('01_dustara/24', 10, 7), ('01_dustara/02', 11, 7),
  ('01_dustara/36', 14, 7), ('01_dustara/13', 15, 7), ('01_dustara/45', 16, 7), ('01_dustara/43', 18, 7), ('01_dustara/15', 20, 7), ('01_dustara/36', 21, 7),
  ('01_dustara/02', 9, 9), ('01_dustara/02', 15, 9), ('01_dustara/06', 17, 9), ('01_dustara/42', 22, 9),
  ('01_dustara/28', 9, 12), ('01_dustara/36', 14, 12), ('01_dustara/67', 10, 12, 2, {'w': 4})],
 '008': [('01_dustara/44', 5, 5), ('01_dustara/45', 17, 5), ('01_dustara/13', 11, 5), ('01_dustara/13', 16, 5),
         ('01_dustara/26', 3, 10), ('01_dustara/26', 8, 10), ('01_dustara/26', 13, 10), ('01_dustara/26', 18, 10)],
 '018': [('04_thalassa/40', 12, 5), ('04_thalassa/44', 14, 5), ('04_thalassa/08', 6, 5), ('04_thalassa/08', 11, 5),
         ('04_thalassa/35', 17, 5), ('04_thalassa/37', 18, 5),
         ('04_thalassa/26', 3, 10), ('04_thalassa/26', 8, 10), ('04_thalassa/26', 13, 10), ('04_thalassa/26', 18, 10),
         ('04_thalassa/00', 4, 7), ('04_thalassa/00', 17, 7)],
}
L = json.load(open('data/sections/props_layout.json'))
for sid in sys.argv[1:]:
    s = SEC[sid]; rows = [list(r) for r in json.load(open(f'data/collision/{sid}.json'))['rows']]; Wt, Ht = s['tiles']
    if s['type'] == 'interior' and sid not in HAND: continue
    pal = ZONE_TOWN[s['zone']] if s['type'] == 'town' and s.get('zone') in ZONE_TOWN else NEUTRAL.get(s['type'], []) if s.get('zone') in FRONTIER else PALETTES.get((s['dir'], s['type']), [])
    rnd = random.Random(int(sid) * 7919)
    walk = lambda x, y: 0 <= x < Wt and 0 <= y < Ht and rows[y][x] in '.,'
    ground = lambda x, y: 0 <= x < Wt and 0 <= y < Ht and rows[y][x] == '.'   # props never stand in tall grass
    keys = set()
    for w in s['warps']: keys |= {tuple(w['tile']), tuple(w['at'])}
    for o in s['objects']: keys.add(tuple(o['tile']))
    for v in s['spawns'].values():
        if v: keys.add(tuple(v))
    for n in s.get('npcs', []): keys.add((n['x'], n['y']))
    for q in QS.values():
        if q.get('s') == sid and 'x' in q: keys.add((q['x'], q['y']))
    for side, e in s['edges'].items():
        for k in range(e['range'][0] - 1, e['range'][1] + 2):
            for dd in range(3): keys.add({'left': (dd, k), 'right': (Wt - 1 - dd, k), 'top': (k, dd), 'bottom': (k, Ht - 1 - dd)}[side])
    for x0, y0, x1, y1 in AVOID.get(sid, []): keys |= {(x, y) for x in range(x0, x1 + 1) for y in range(y0, y1 + 1)}
    near = lambda x, y: any((x + a, y + b) in keys for a in (-1, 0, 1) for b in (-1, 0, 1))
    def reach_ok():
        pts = [p for p in keys if walk(*p)]
        if not pts: return True
        seen = {pts[0]}; q = deque([pts[0]])
        while q:
            x, y = q.popleft()
            for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                if walk(x + a, y + b) and (x + a, y + b) not in seen: seen.add((x + a, y + b)); q.append((x + a, y + b))
        return all(p in seen for p in pts)
    out = []
    hard = set()
    for w in s['warps']: hard |= {tuple(w['tile']), tuple(w['at'])}
    for o in s['objects']:
        if o.get('k') != 'stash': hard.add(tuple(o['tile']))
    for v in s['spawns'].values():
        if v: hard.add(tuple(v))
    if sid in HAND:
        for item in HAND[sid]:
            if len(item) > 4 and item[4].get('solid') is False:
                out.append({'p': item[0], 'x': item[1], 'y': item[2], **item[4]}); continue
            p, x, y = item[:3]; h = item[3] if len(item) > 3 else 1; ext = item[4] if len(item) > 4 else {}
            w = ext.get('w') or size(p)[0]; fp = [(x + i, y + j) for i in range(w) for j in range(h)]
            bad = [t for t in fp if t in hard]   # hand layouts may stand on drawn scenery; only doors, warps, counters and spawns are off limits
            old = [rows[b][a] for a, b in fp]
            for a, b in fp: rows[b][a] = '#'
            if bad or not reach_ok():
                print('  SKIP', p, x, y, 'blocked/key' if bad else 'cuts a path', bad)
                for (a, b), c in zip(fp, old): rows[b][a] = c
            else: out.append({'p': p, 'x': x, 'y': y, **({'h': h} if h > 1 else {}), **ext})
        pal = []
    for kind, props, n in pal:
        for _ in range(n):
            p = rnd.choice(props); w, ph = size(p); cand = []
            for y in range(1, Ht - 1):
                for x in range(1, Wt - w):
                    fp = [(x + i, y) for i in range(w)]
                    if not all(ground(*t) and not near(*t) for t in fp): continue
                    above = all(not walk(x + i, y - 1) for i in range(w)); below = all(walk(x + i, y + 1) for i in range(w))
                    if kind == 'wall' and not (above and below): continue
                    if kind == 'border' and not (above or all(not walk(x + i, y + 1) for i in range(w))): continue
                    if kind == 'corner' and not ((not walk(x - 1, y) or not walk(x + w, y)) and (above or not walk(x, y + 1))): continue
                    if kind == 'open' and not (below and all(walk(x + i, y - 1) for i in range(w))): continue
                    if any(abs(x - o['x']) < 3 and abs(y - o['y']) < 2 for o in out): continue
                    cand.append((x, y))
            rnd.shuffle(cand)
            for x, y in cand:
                fp = [(x + i, y) for i in range(w)]; old = [rows[b][a] for a, b in fp]
                for a, b in fp: rows[b][a] = '#'
                if reach_ok(): out.append({'p': p, 'x': x, 'y': y}); keys.update(fp); break
                for (a, b), c in zip(fp, old): rows[b][a] = c
    L[sid] = out; print(sid, s['type'], s.get('zone') or '', len(out))
json.dump(L, open('data/sections/props_layout.json', 'w'), indent=0)
