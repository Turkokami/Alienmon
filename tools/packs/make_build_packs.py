# Writes docs/build_packs/: one prompt pack per world for the map builder (buildings, props, furniture, signs and lights,
# items and locked ways, turnaround sheets, ground textures, terrain features, walking townsfolk), plus a README and a shared items pack.
# Run: python tools/packs/make_build_packs.py
import os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from worlds_a import W as A
from worlds_b import W as B
WORLDS = A + B
OUT = os.path.join(ROOT, 'docs', 'build_packs')

STYLE = ('Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, '
         'soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.')
RULES = ('Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; '
         'no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.')
VIEW = ('View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). '
        'Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.')
BG = ('Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, '
      'no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).')
CANVAS = 'Canvas 1536x1024, landscape.'
# things that look different from the front, back and sides: they get turnaround sheets (down, up, left, right)
TURN = re.compile(r'\b(bench|benches|cart|chair|chairs|armchair|sofa|boat|rowboat|bed|beds|bunk|cot|sled|rover|forklift|handcar|barrow|wheelbarrow|stall|counter|desk|hammock|cabin|crane|tub|stove|range|kiosk|loom|harp|podium|console|bar)\b', re.I)

def block(text): return '```\n' + text.strip() + '\n```'
def chunks(L, n): return [L[i:i + n] for i in range(0, len(L), n)]
def ctx(w): return (f"World: {w['name']}, {w['line']}. Palette: {w['palette']}. Materials: {w['materials']}. Motifs: {w['motifs']}.")
def objs(L): return '\n'.join(f'{i + 1}. {n} ({fp} tiles): {d}.' for i, (n, fp, d) in enumerate(L))

def sheet(w, title, what, L, extra=''):
    return (f"Sprite sheet of separate {what} for the Alienmon map builder. {ctx(w)}\n\nThe objects, in reading order (left to right, top row first):\n{objs(L)}\n\n"
            f"{VIEW}\n{BG}\n{extra}{STYLE}\n{RULES}\n{CANVAS}")

def turn_sheet(w, L):
    rows = '\n'.join(f'Row {i + 1}: {n} ({fp} tiles): {d}.' for i, (n, fp, d) in enumerate(L))
    return (f"Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. {ctx(w)}\n\n{rows}\n\n"
            "Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. "
            "Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.\n"
            f"{VIEW}\n{BG}\n{STYLE}\n{RULES}\n{CANVAS}")

def npc(w, name, desc):
    return (f"Walking sprite sheet for one Alienmon townsperson: {name}, {desc}. {ctx(w)} Dress them for this world so they clearly belong here.\n\n"
            "Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). "
            "Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, "
            "nothing touching a cell edge.\nMatch the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, "
            "soft cel shading, bright readable colours, the same size as the player.\nBackground: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped "
            "capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.\nCanvas 1024x1024.")

def texture(w, name, desc):
    return (f"Seamless tileable top-down ground texture for the Alienmon map builder: {name}, {desc}. {ctx(w)}\n"
            "Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. "
            "The left edge must continue into the right edge and the top into the bottom.\n"
            f"{STYLE}\nNo text, no emblems. Square canvas 1024x1024.")

def world_pack(w):
    n = w['name']; d = w['dir']; out = []
    turners = [x for x in w['outdoor'] + w['indoor'] if TURN.search(x[0])]   # buildings always face the camera
    out.append(f"# {n}: map builder prompt pack\n\n{w['line'][0].upper() + w['line'][1:]}. Keeper: {w['keeper']}.\n\n"
               f"- **Palette:** {w['palette']}\n- **Materials:** {w['materials']}\n- **Motifs:** {w['motifs']}\n\n"
               f"**Attach to every render:** one finished {n} map from `art/sections_game/{d}/` (a town for buildings and props, a route for terrain), "
               f"so the art matches. For townsfolk attach `docs/npc_prompts/references/{d.split('_', 1)[1]}_style_reference.png` if it exists.\n\n"
               f"**Save renders as** `{d}_<sheet>_<number>.png` (for example `{d}_buildings_1.png`) and send a few at a time.\n\n"
               "| Section | Sheets | Goes into the editor through |\n|---|---|---|\n"
               f"| A. Buildings | {len(chunks(w['buildings'], 5))} | Tools: Sprite Studio, Props (Solid rows = how deep the building is) |\n"
               f"| B. Outdoor props | {len(chunks(w['outdoor'], 10))} | Sprite Studio, Props |\n| C. Indoor furniture | {len(chunks(w['indoor'], 10))} | Sprite Studio, Props |\n"
               f"| D. Signs, lights and markers | 1 | Sprite Studio, Props |\n| E. Chests, pickups and locked ways | 1 | Sprite Studio, Props (place them with Place: Items, untick \"draw a chest\") |\n"
               f"| F. Turnaround sheets | {len(chunks(turners, 2))} | Sprite Studio with \"turn sheet\" ticked, then Turn on a placed prop |\n"
               f"| G. Ground textures | {len(w['textures'])} | Paint: Terrain, \"From a seamless picture\" |\n| H. Terrain features | {len(chunks(w['features'], 5))} | Sprite Studio, Props, then Walkable for the ground |\n"
               f"| I. Walking townsfolk | {len(w['npcs'])} | Sprite Studio (3 columns, 4 rows, order down, left, right, up), People |\n")
    out.append('## A. Buildings\nOne building per cell; doorways sized for a person about 1 tile wide. In Sprite Studio type the first building\'s width in tiles.')
    for i, L in enumerate(chunks(w['buildings'], 5)):
        out.append(f"### A{i + 1}. Buildings, sheet {i + 1}\n" + block(sheet(w, 'buildings', 'building exteriors', L, 'Each building complete with its roof and a clear front door at the bottom edge, set on no ground at all.\n')))
    out.append('## B. Outdoor props')
    for i, L in enumerate(chunks(w['outdoor'], 10)):
        out.append(f"### B{i + 1}. Outdoor props, sheet {i + 1}\n" + block(sheet(w, 'outdoor', 'outdoor props', L)))
    out.append('## C. Indoor furniture')
    for i, L in enumerate(chunks(w['indoor'], 10)):
        out.append(f"### C{i + 1}. Indoor furniture, sheet {i + 1}\n" + block(sheet(w, 'indoor', 'indoor furniture and room objects', L)))
    out.append('## D. Signs, lights and markers\n' + block(sheet(w, 'signs', 'signs, lights and markers', w['signs'], 'Lights glow softly but the glow stays inside the object (no light spilling onto the background).\n')))
    out.append('## E. Chests, ground pickups and locked ways\nThe game already draws a plain chest, sign, sparkle and locked way for every world. These renders are the world\'s own versions: place them as props over an item spot and untick "draw a chest here".\n'
               + block(sheet(w, 'interact', 'treasure chests, items lying on the ground and things that block a path', [(a, '1x1', b) for a, b in w['interact']],
                             'Each fits one tile (16 x 16 at map scale) except the locked ways, which are one tile wide and may stand a little taller.\n')))
    out.append('## F. Turnaround sheets (one object, four facings)\nFor everything that looks different from the front, back and sides. In Sprite Studio tick **turn sheet**; on the map, select the prop and press **Turn** to switch facing. **Mirror** flips any prop left to right.')
    for i, L in enumerate(chunks(turners, 2)):
        out.append(f"### F{i + 1}. {' and '.join(x[0] for x in L)}\n" + block(turn_sheet(w, L)))
    out.append('## G. Ground textures (paint them in Paint: Terrain)\nUpload each in Terrain under "From a seamless picture", give it the name and set Ground (walkable, tall grass, water, lava or blocked).')
    for name, desc in w['textures']:
        out.append(f"### {name}\n" + block(texture(w, name, desc)))
    out.append('## H. Terrain features\nPonds, cliff pieces, stairs and bridges as separate pieces. After placing one, set its ground with Paint: Walkable (water, ledge, blocked). Cliff pieces: the walkable foot is part of the piece.')
    for i, L in enumerate(chunks(w['features'], 5)):
        out.append(f"### H{i + 1}. Terrain features, sheet {i + 1}\n" + block(sheet(w, 'features', 'terrain features (map pieces)', L, 'Each piece is a small patch of this world\'s ground with the feature on it, the patch edges fading softly to magenta.\n')))
    out.append('## I. Walking townsfolk\nOne render per person. In Sprite Studio: 3 columns, 4 rows, order down, left, right, up. Then place them from People.')
    for name, desc in w['npcs']:
        out.append(f"### {name}\n" + block(npc(w, name, desc)))
    return '\n\n'.join(out) + '\n'

README = """# Map builder prompt packs

One pack per world, written so every new building, prop, chair, sign, chest, ground and townsperson matches that world's maps and lore.
Each pack has 9 sections (A to I) and every prompt is ready to paste.

## How to render
1. One image chat per world. Attach a finished map from that world (`art/sections_game/<world>/`), and for people the world's style reference.
2. Paste one prompt per message. If a result drifts in style, reply: "Match the attached Alienmon map exactly and try again."
3. Check: magenta background edge to edge, nothing touching, no text, no ball-shaped devices, the turnaround columns match.
4. Save as `<world>_<sheet>_<number>.png`, open each file once, and send a few at a time.

## Getting them into the game (Tools: Sprite Studio)
| Render | In Sprite Studio | Then |
|---|---|---|
| Buildings, props, furniture, signs, chests, features | Props mode, type the first object's width in tiles, Cut, Add ticked items to Props | Place them in Place: Props. Buildings: set Solid rows. |
| Turnaround sheets | Props mode with **turn sheet** ticked | Select a placed prop and press **Turn** to change its facing |
| Townsfolk | Character mode, 3 columns, 4 rows, order down, left, right, up | Add to People, place them in Place: People |
| Ground textures | (not Sprite Studio) Paint: Terrain, From a seamless picture | Paint them like any terrain |

**Mirror** flips any placed prop left to right, so even old props get a second facing.

## Files
| File | World |
|---|---|
"""

SHARED = """# Shared items pack (every world)

Bag and reward icons used across all worlds. One sheet, 4 x 4 grid of equal cells, each icon centred in its cell.

```
Sheet of 16 item icons for the Alienmon game, 4 columns x 4 rows of equal square cells, each icon centred with space around it.
1 Med Gel: a small squeezable gel pack with a green cross shape. 2 Mega Gel: a bigger blue gel pack. 3 Full Gel: a gold gel pack with a star.
4 Revive Spark: a small crystal with a spark inside. 5 Max Revive: a big radiant crystal. 6 Cure Spray: a slim spray can with a leaf shape.
7 Ether Gel: a violet gel vial. 8 Tether Pulse: a small device with a soft glowing ring. 9 Stun Spray: a can with a lightning shape.
10 Signal Jammer: a pocket device with a little antenna. 11 Stasis Pod: a sleek capsule pod, teal and white. 12 Harmonic Pod: a capsule pod with gold rings.
13 Singularity Pod: a dark violet capsule pod with a starry core. 14 Stardust: a small pile of glittering gold-violet dust. 15 Linker Stash: a gold-and-violet capsule with a cyan light.
16 Key item pouch: a leather pouch with a glowing seam.
The pods are smooth capsules or seed shapes, never balls and never red and white.
Background: one flat pure magenta #FF00FF. Style: crisp detailed pixel art, dark outlines, light from the top left, bright readable colours. No text, no logos.
Canvas 1024x1024.
```

## Linker Stash tiers
```
Three versions of the Alienmon Linker Stash, side by side, each standing on its own: 1 bronze tier, a small gold-and-violet capsule with a cyan light;
2 silver tier, the same capsule a little bigger with silver bands; 3 star tier, the same capsule with a crown of tiny star crystals. Then the same three opened (lid split, empty, light off), in a second row.
Three-quarter top-down view like the Alienmon maps, each about one 16 x 16 tile at map scale. Background: one flat pure magenta #FF00FF. Crisp pixel art, dark outlines. No text, no logos, no ball shapes.
Canvas 1536x1024.
```
"""

def main():
    os.makedirs(OUT, exist_ok=True)
    rows = []
    for w in WORLDS:
        f = f"{w['dir']}.md"; open(os.path.join(OUT, f), 'w', encoding='utf-8', newline='\n').write(world_pack(w)); rows.append(f"| [{f}]({f}) | {w['name']} |")
    open(os.path.join(OUT, 'README.md'), 'w', encoding='utf-8', newline='\n').write(README + '\n'.join(rows) + '\n| [00_shared_items.md](00_shared_items.md) | Item icons and Linker Stash tiers for every world |\n')
    open(os.path.join(OUT, '00_shared_items.md'), 'w', encoding='utf-8', newline='\n').write(SHARED)
    n = sum(open(os.path.join(OUT, f'{w["dir"]}.md'), encoding='utf-8').read().count('```\n') // 1 for w in WORLDS) // 2
    print(len(WORLDS), 'worlds,', n, 'prompts')

if __name__ == '__main__':
    main()
