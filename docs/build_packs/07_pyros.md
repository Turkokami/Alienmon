# Pyros: map builder prompt pack

A volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Keeper: Keeper Old Basalt, an old miner.

- **Palette:** lava orange, deep red, charcoal black, brass, ember yellow, ash grey
- **Materials:** black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber
- **Motifs:** glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns

**Attach to every render:** one finished Pyros map from `art/sections_game/07_pyros/` (a town for buildings and props, a route for terrain), so the art matches. For townsfolk attach `docs/npc_prompts/references/pyros_style_reference.png` if it exists.

**Save renders as** `07_pyros_<sheet>_<number>.png` (for example `07_pyros_buildings_1.png`) and send a few at a time.

| Section | Sheets | Goes into the editor through |
|---|---|---|
| A. Buildings | 2 | Tools: Sprite Studio, Props (Solid rows = how deep the building is) |
| B. Outdoor props | 2 | Sprite Studio, Props |
| C. Indoor furniture | 2 | Sprite Studio, Props |
| D. Signs, lights and markers | 1 | Sprite Studio, Props |
| E. Chests, pickups and locked ways | 1 | Sprite Studio, Props (place them with Place: Items, untick "draw a chest") |
| F. Turnaround sheets | 6 | Sprite Studio with "turn sheet" ticked, then Turn on a placed prop |
| G. Ground textures | 6 | Paint: Terrain, "From a seamless picture" |
| H. Terrain features | 2 | Sprite Studio, Props, then Walkable for the ground |
| I. Walking townsfolk | 12 | Sprite Studio (3 columns, 4 rows, order down, left, right, up), People |


## A. Buildings
One building per cell; doorways sized for a person about 1 tile wide. In Sprite Studio type the first building's width in tiles.

### A1. Buildings, sheet 1
```
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.

The objects, in reading order (left to right, top row first):
1. Basalt miner cottage (4x3 tiles): black stone house with a brass door and a glowing window.
2. Miners' canteen (6x4 tiles): long hall with steam vents and benches outside.
3. Drill rig tower (3x5 tiles): brass drill tower over a glowing borehole.
4. Smelter house (5x5 tiles): brick smelter with a pouring spout.
5. Ember lamp workshop (4x3 tiles): shop with ember lanterns in the window.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each building complete with its roof and a clear front door at the bottom edge, set on no ground at all.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### A2. Buildings, sheet 2
```
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.

The objects, in reading order (left to right, top row first):
1. Hot spring bathhouse (6x4 tiles): tiled bathhouse with steam.
2. Ore depot (5x4 tiles): open shed of ore carts.
3. Lava-proof bunker home (4x3 tiles): rounded bunker with a heavy door.
4. Lookout over the lava sea (3x5 tiles): tower on basalt columns.
5. Magma arena gate (6x4 tiles): basalt gate with brass doors and fire bowls.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each building complete with its roof and a clear front door at the bottom edge, set on no ground at all.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## B. Outdoor props

### B1. Outdoor props, sheet 1
```
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.

The objects, in reading order (left to right, top row first):
1. Ore cart full of glowing ore (2x1 tiles): cart on rails.
2. Drill bit pile (1x1 tiles): big brass bits.
3. Basalt column cluster (1x2 tiles): hexagonal columns.
4. Steam vent (1x1 tiles): vent puffing steam.
5. Ember lantern post (1x2 tiles): lantern.
6. Obsidian shard (1x1 tiles): glassy black shard.
7. Ash-covered shrub (1x1 tiles): grey shrub with red buds.
8. Brass pipe valve (1x1 tiles): valve wheel.
9. Pick and shovel rack (1x1 tiles): tools.
10. Water barrel for cooling (1x1 tiles): barrel with ladle.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### B2. Outdoor props, sheet 2
```
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.

The objects, in reading order (left to right, top row first):
1. Fire-resistant crate (1x1 tiles): ceramic crate.
2. Lava rock bench (2x1 tiles): bench.
3. Cooling trough (2x1 tiles): trough of hissing water.
4. Mine timber stack (2x1 tiles): timbers.
5. Ember flower bed (2x1 tiles): red glowing flowers.
6. Heat shield screen (2x1 tiles): brass screen.
7. Gear winch (1x1 tiles): winch.
8. Sulfur crystal (1x1 tiles): yellow crystal.
9. Charred tree (1x2 tiles): black tree with ember leaves.
10. Signal gong (1x2 tiles): brass gong.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## C. Indoor furniture

### C1. Indoor furniture, sheet 1
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.

The objects, in reading order (left to right, top row first):
1. Forge anvil (1x1 tiles): anvil with hammer.
2. Canteen long table (3x1 tiles): table with stew bowls.
3. Bench pair (2x1 tiles): benches.
4. Iron bunk (2x2 tiles): bunk.
5. Lantern shelf (2x1 tiles): ember lanterns.
6. Ore display case (2x1 tiles): glowing ores.
7. Brass boiler (1x2 tiles): boiler with gauges.
8. Hot bath tub (2x1 tiles): stone tub with steam.
9. Mine map table (2x1 tiles): map.
10. Tool locker (1x2 tiles): locker.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### C2. Indoor furniture, sheet 2
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.

The objects, in reading order (left to right, top row first):
1. Stone hearth (2x1 tiles): hearth.
2. Helmet hooks (1x1 tiles): helmets with lamps.
3. Ceramic tile counter (3x1 tiles): counter.
4. Armchair of iron and leather (1x1 tiles): chair.
5. Crucible stand (1x1 tiles): crucible.
6. Rock collection shelf (2x1 tiles): rocks.
7. Kitchen range (2x1 tiles): range.
8. Rug of woven ash wool (2x2 tiles): rug.
9. Shop counter (3x1 tiles): brass counter.
10. Recovery Bay bed (2x1 tiles): bed with an orange stripe.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## D. Signs, lights and markers
```
Sprite sheet of separate signs, lights and markers for the Alienmon map builder. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.

The objects, in reading order (left to right, top row first):
1. Route signpost (1x1 tiles): iron post with blank boards.
2. Notice board (2x1 tiles): board.
3. Shop sign (1x1 tiles): pickaxe shape.
4. Recovery Bay sign (1x1 tiles): orange cross shape.
5. Ember street lamp (1x2 tiles): lamp.
6. Lava warning post (1x1 tiles): striped post with a red light.
7. Mine level marker (1x1 tiles): brass plate.
8. Heat gauge post (1x2 tiles): gauge.
9. Wall ember lamp (1x1 tiles): lamp.
10. Fire bowl (1x1 tiles): bowl.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Lights glow softly but the glow stays inside the object (no light spilling onto the background).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## E. Chests, ground pickups and locked ways
The game already draws a plain chest, sign, sparkle and locked way for every world. These renders are the world's own versions: place them as props over an item spot and untick "draw a chest here".
```
Sprite sheet of separate treasure chests, items lying on the ground and things that block a path for the Alienmon map builder. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.

The objects, in reading order (left to right, top row first):
1. Treasure chest, closed (1x1 tiles): iron-bound basalt chest with brass corners.
2. Same chest, open (1x1 tiles): lid up, empty.
3. Supply crate, closed (1x1 tiles): ceramic mine crate.
4. Locked way: energy fence (1x1 tiles): basalt posts with a cyan field.
5. Locked way: blast door (1x1 tiles): riveted iron door.
6. Locked way: cooled lava wall (1x1 tiles): black lava rock slab.
7. Ground pickup sparkle (1x1 tiles): capsule on ash with a glint.
8. Buried item in ash (1x1 tiles): glint in ash.
9. Key item: drill key (1x1 tiles): brass key shaped like a drill.
10. Key item: heat badge (1x1 tiles): enamel badge.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each fits one tile (16 x 16 at map scale) except the locked ways, which are one tile wide and may stand a little taller.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## F. Turnaround sheets (one object, four facings)
For everything that looks different from the front, back and sides. In Sprite Studio tick **turn sheet**; on the map, select the prop and press **Turn** to switch facing. **Mirror** flips any prop left to right.

### F1. Ore cart full of glowing ore and Lava rock bench
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.

Row 1: Ore cart full of glowing ore (2x1 tiles): cart on rails.
Row 2: Lava rock bench (2x1 tiles): bench.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F2. Ember flower bed and Bench pair
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.

Row 1: Ember flower bed (2x1 tiles): red glowing flowers.
Row 2: Bench pair (2x1 tiles): benches.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F3. Iron bunk and Hot bath tub
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.

Row 1: Iron bunk (2x2 tiles): bunk.
Row 2: Hot bath tub (2x1 tiles): stone tub with steam.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F4. Ceramic tile counter and Armchair of iron and leather
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.

Row 1: Ceramic tile counter (3x1 tiles): counter.
Row 2: Armchair of iron and leather (1x1 tiles): chair.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F5. Kitchen range and Shop counter
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.

Row 1: Kitchen range (2x1 tiles): range.
Row 2: Shop counter (3x1 tiles): brass counter.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F6. Recovery Bay bed
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.

Row 1: Recovery Bay bed (2x1 tiles): bed with an orange stripe.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## G. Ground textures (paint them in Paint: Terrain)
Upload each in Terrain under "From a seamless picture", give it the name and set Ground (walkable, tall grass, water, lava or blocked).

### Ash path
```
Seamless tileable top-down ground texture for the Alienmon map builder: Ash path, grey ash with ember specks. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Basalt paving
```
Seamless tileable top-down ground texture for the Alienmon map builder: Basalt paving, hexagonal basalt tops. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Tall ember grass (wild encounters)
```
Seamless tileable top-down ground texture for the Alienmon map builder: Tall ember grass (wild encounters), tall dark red grass with glowing tips. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Lava
```
Seamless tileable top-down ground texture for the Alienmon map builder: Lava, bright flowing lava with dark crust. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Obsidian glass ground
```
Seamless tileable top-down ground texture for the Alienmon map builder: Obsidian glass ground, shiny black glass with reflections. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Warm spring water
```
Seamless tileable top-down ground texture for the Alienmon map builder: Warm spring water, milky turquoise water with steam. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

## H. Terrain features
Ponds, cliff pieces, stairs and bridges as separate pieces. After placing one, set its ground with Paint: Walkable (water, ledge, blocked). Cliff pieces: the walkable foot is part of the piece.

### H1. Terrain features, sheet 1
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.

The objects, in reading order (left to right, top row first):
1. Hot spring pool (5x4 tiles): terraced pool with steam.
2. Basalt cliff wall (4x3 tiles): cliff with a walkable foot.
3. Basalt cliff corner (3x3 tiles): corner.
4. Iron stairs (2x3 tiles): stairs.
5. Iron bridge over lava (5x2 tiles): bridge with lamp posts.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### H2. Terrain features, sheet 2
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns.

The objects, in reading order (left to right, top row first):
1. One-way ledge (4x1 tiles): basalt drop.
2. Lava river bend (4x3 tiles): flowing lava.
3. Obsidian field (3x2 tiles): glassy spikes.
4. Mine tunnel mouth (3x3 tiles): timbered tunnel.
5. Lava islet (3x3 tiles): rock island in lava.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## I. Walking townsfolk
One render per person. In Sprite Studio: 3 columns, 4 rows, order down, left, right, up. Then place them from People.

### Lava Miner
```
Walking sprite sheet for one Alienmon townsperson: Lava Miner, a miner in a heat suit and helmet lamp. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Ember Lamplighter
```
Walking sprite sheet for one Alienmon townsperson: Ember Lamplighter, a lamplighter with a long pole. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Drill Operator
```
Walking sprite sheet for one Alienmon townsperson: Drill Operator, an operator with ear muffs and a control box. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Obsidian Carver
```
Walking sprite sheet for one Alienmon townsperson: Obsidian Carver, a carver with a chisel and a glassy statuette. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Fire Warden
```
Walking sprite sheet for one Alienmon townsperson: Fire Warden, a warden in a brass helmet with an extinguisher. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Cinder Kid
```
Walking sprite sheet for one Alienmon townsperson: Cinder Kid, a kid with soot on the nose and a toy drill. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Hot Spring Keeper
```
Walking sprite sheet for one Alienmon townsperson: Hot Spring Keeper, a keeper with a towel and a bucket. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Ash Elder
```
Walking sprite sheet for one Alienmon townsperson: Ash Elder, an elder in a grey shawl with a walking stick. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Furnace Worker
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Furnace Worker, a worker with thick gloves. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Rock Hound
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Rock Hound, a collector with a sample bag. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Canteen Cook
```
Walking sprite sheet for one Alienmon townsperson: Canteen Cook, a cook with a ladle. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Smelter Foreman
```
Walking sprite sheet for one Alienmon townsperson: Smelter Foreman, a foreman with goggles. World: Pyros, a volcanic mining world of lava rivers, black basalt cliffs, Cinder Hollow and deep drill sites, with hot spring terraces and obsidian glass fields. Palette: lava orange, deep red, charcoal black, brass, ember yellow, ash grey. Materials: black basalt blocks, brass plate, riveted iron, obsidian glass, heat-proof ceramic tiles, chain, mine timber. Motifs: glowing cracks, brass pipes, steam, drill bits, ember lanterns, hexagonal basalt columns. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```
