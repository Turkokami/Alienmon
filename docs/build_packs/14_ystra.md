# Ystra: map builder prompt pack

The shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Keeper: the Ystran elders, under the Seedmother.

- **Palette:** alien teal, magenta, void black, crystal white, red sun glow
- **Materials:** living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots
- **Motifs:** seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract)

**Attach to every render:** one finished Ystra map from `art/sections_game/14_ystra/` (a town for buildings and props, a route for terrain), so the art matches. For townsfolk attach `docs/npc_prompts/references/ystra_style_reference.png` if it exists.

**Save renders as** `14_ystra_<sheet>_<number>.png` (for example `14_ystra_buildings_1.png`) and send a few at a time.

| Section | Sheets | Goes into the editor through |
|---|---|---|
| A. Buildings | 2 | Tools: Sprite Studio, Props (Solid rows = how deep the building is) |
| B. Outdoor props | 2 | Sprite Studio, Props |
| C. Indoor furniture | 2 | Sprite Studio, Props |
| D. Signs, lights and markers | 1 | Sprite Studio, Props |
| E. Chests, pickups and locked ways | 1 | Sprite Studio, Props (place them with Place: Items, untick "draw a chest") |
| F. Turnaround sheets | 5 | Sprite Studio with "turn sheet" ticked, then Turn on a placed prop |
| G. Ground textures | 6 | Paint: Terrain, "From a seamless picture" |
| H. Terrain features | 2 | Sprite Studio, Props, then Walkable for the ground |
| I. Walking townsfolk | 12 | Sprite Studio (3 columns, 4 rows, order down, left, right, up), People |


## A. Buildings
One building per cell; doorways sized for a person about 1 tile wide. In Sprite Studio type the first building's width in tiles.

### A1. Buildings, sheet 1
```
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract).

The objects, in reading order (left to right, top row first):
1. Ystran dwelling (4x3 tiles): pale stone house grown with crystal.
2. Crystal lodge (5x4 tiles): lodge of crystal.
3. Seed vault (5x4 tiles): vault door.
4. Memory hall (6x4 tiles): hall.
5. Research dome (5x4 tiles): visitor dome.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each building complete with its roof and a clear front door at the bottom edge, set on no ground at all.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### A2. Buildings, sheet 2
```
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract).

The objects, in reading order (left to right, top row first):
1. Glasswood treehouse (4x5 tiles): treehouse.
2. Ring shrine (4x4 tiles): ring.
3. Sun forge front (6x4 tiles): forge.
4. Fragment farm hut (4x3 tiles): hut.
5. Crystal ring arena gate (6x4 tiles): gate.

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
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract).

The objects, in reading order (left to right, top row first):
1. Crystal growth (1x1 tiles): crystal.
2. Glasswood tree (2x3 tiles): tree.
3. Floating shard (1x1 tiles): shard.
4. Seed pedestal (1x1 tiles): pedestal.
5. Ancient bench (2x1 tiles): bench.
6. Root lantern (1x2 tiles): lantern.
7. Blight crack (1x1 tiles): crack.
8. Crystal pillar (1x2 tiles): pillar.
9. Memory stone (1x1 tiles): stone.
10. Ring gate fragment (2x2 tiles): fragment.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### B2. Outdoor props, sheet 2
```
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract).

The objects, in reading order (left to right, top row first):
1. Glowing fern (1x1 tiles): fern.
2. Void pebble pile (1x1 tiles): pebbles.
3. Water basin (2x2 tiles): basin.
4. Seed planter (2x1 tiles): planter.
5. Broken arch (3x2 tiles): arch.
6. Crystal chimes (1x2 tiles): chimes.
7. Cleansed flower (1x1 tiles): flower.
8. Root bridge post (1x2 tiles): post.
9. Statue of an Alienmon guardian (original creature) (1x2 tiles): statue.
10. Crystal cart (2x1 tiles): cart.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## C. Indoor furniture

### C1. Indoor furniture, sheet 1
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract).

The objects, in reading order (left to right, top row first):
1. Crystal bed (2x1 tiles): bed.
2. Stone table (2x1 tiles): table.
3. Seed shelf (2x1 tiles): shelf.
4. Memory pool (2x2 tiles): pool.
5. Root chair (1x1 tiles): chair.
6. Archive wall (2x1 tiles): wall.
7. Crystal lamp (1x1 tiles): lamp.
8. Loom of light (2x2 tiles): loom.
9. Altar of the Seedmother (2x1 tiles): altar.
10. Research bench (3x1 tiles): bench.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### C2. Indoor furniture, sheet 2
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract).

The objects, in reading order (left to right, top row first):
1. Rug (2x2 tiles): rug.
2. Cupboard (1x2 tiles): cupboard.
3. Planter (1x1 tiles): planter.
4. Kitchen (2x1 tiles): kitchen.
5. Bunk (2x2 tiles): bunk.
6. Mural (2x1 tiles): mural.
7. Window of crystal (2x1 tiles): window.
8. Stool (1x1 tiles): stool.
9. Shop counter (3x1 tiles): counter.
10. Recovery Bay bed (2x1 tiles): bed with a teal stripe.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## D. Signs, lights and markers
```
Sprite sheet of separate signs, lights and markers for the Alienmon map builder. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract).

The objects, in reading order (left to right, top row first):
1. Route marker (1x1 tiles): crystal post with blank faces.
2. Notice stone (2x1 tiles): stone.
3. Shop sign (1x1 tiles): seed shape.
4. Recovery Bay sign (1x1 tiles): teal cross.
5. Root lamp post (1x2 tiles): lamp.
6. Blight warning crystal (1x1 tiles): dark crystal.
7. Memory marker (1x1 tiles): marker.
8. Crystal beacon (1x2 tiles): beacon.
9. Wall crystal (1x1 tiles): crystal.
10. Ring marker (1x1 tiles): ring.

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
Sprite sheet of separate treasure chests, items lying on the ground and things that block a path for the Alienmon map builder. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract).

The objects, in reading order (left to right, top row first):
1. Treasure chest, closed (1x1 tiles): ancient stone casket with crystal.
2. Same chest, open (1x1 tiles): lid aside, empty.
3. Supply basket, closed (1x1 tiles): basket.
4. Locked way: energy fence (1x1 tiles): crystal posts with a cyan field.
5. Locked way: blight thorns (1x1 tiles): dark thorns.
6. Locked way: sealed ring door (1x1 tiles): door.
7. Ground pickup sparkle (1x1 tiles): capsule in crystal moss.
8. Hidden item in roots (1x1 tiles): glint.
9. Key item: Ystra shardlet (1x1 tiles): shard.
10. Key item: Seedmother seed (1x1 tiles): seed.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each fits one tile (16 x 16 at map scale) except the locked ways, which are one tile wide and may stand a little taller.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## F. Turnaround sheets (one object, four facings)
For everything that looks different from the front, back and sides. In Sprite Studio tick **turn sheet**; on the map, select the prop and press **Turn** to switch facing. **Mirror** flips any prop left to right.

### F1. Ancient bench and Crystal cart
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract).

Row 1: Ancient bench (2x1 tiles): bench.
Row 2: Crystal cart (2x1 tiles): cart.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F2. Crystal bed and Root chair
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract).

Row 1: Crystal bed (2x1 tiles): bed.
Row 2: Root chair (1x1 tiles): chair.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F3. Loom of light and Research bench
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract).

Row 1: Loom of light (2x2 tiles): loom.
Row 2: Research bench (3x1 tiles): bench.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F4. Bunk and Shop counter
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract).

Row 1: Bunk (2x2 tiles): bunk.
Row 2: Shop counter (3x1 tiles): counter.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F5. Recovery Bay bed
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract).

Row 1: Recovery Bay bed (2x1 tiles): bed with a teal stripe.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## G. Ground textures (paint them in Paint: Terrain)
Upload each in Terrain under "From a seamless picture", give it the name and set Ground (walkable, tall grass, water, lava or blocked).

### Ancient stone path
```
Seamless tileable top-down ground texture for the Alienmon map builder: Ancient stone path, pale stone. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract).
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Crystal moss
```
Seamless tileable top-down ground texture for the Alienmon map builder: Crystal moss, teal moss with crystals. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract).
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Tall glasswood grass (wild encounters)
```
Seamless tileable top-down ground texture for the Alienmon map builder: Tall glasswood grass (wild encounters), tall translucent grass. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract).
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Still crystal water
```
Seamless tileable top-down ground texture for the Alienmon map builder: Still crystal water, clear water with crystals. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract).
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Blighted ground
```
Seamless tileable top-down ground texture for the Alienmon map builder: Blighted ground, dark purple cracked ground. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract).
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Void rock
```
Seamless tileable top-down ground texture for the Alienmon map builder: Void rock, black rock with stars. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract).
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

## H. Terrain features
Ponds, cliff pieces, stairs and bridges as separate pieces. After placing one, set its ground with Paint: Walkable (water, ledge, blocked). Cliff pieces: the walkable foot is part of the piece.

### H1. Terrain features, sheet 1
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract).

The objects, in reading order (left to right, top row first):
1. Crystal pool (5x4 tiles): pool.
2. Fragment edge cliff (4x3 tiles): cliff over the void with a walkable top.
3. Fragment edge corner (3x3 tiles): corner.
4. Crystal stairs (2x3 tiles): stairs.
5. Root bridge (5x2 tiles): bridge.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### H2. Terrain features, sheet 2
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract).

The objects, in reading order (left to right, top row first):
1. One-way ledge (4x1 tiles): drop.
2. Void crack (4x2 tiles): crack.
3. Crystal garden (3x2 tiles): garden.
4. Shardheart cave mouth (3x3 tiles): cave.
5. Floating islet (3x3 tiles): islet.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## I. Walking townsfolk
One render per person. In Sprite Studio: 3 columns, 4 rows, order down, left, right, up. Then place them from People.

### Ystran Elder
```
Walking sprite sheet for one Alienmon townsperson: Ystran Elder, an elder in flowing robes. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract). Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Ystran Seedkeeper
```
Walking sprite sheet for one Alienmon townsperson: Ystran Seedkeeper, a keeper with seeds. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract). Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Ystran Scout
```
Walking sprite sheet for one Alienmon townsperson: Ystran Scout, a scout with a crystal spear-free staff. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract). Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Echo Child
```
Walking sprite sheet for one Alienmon townsperson: Echo Child, a child with a glowing aura. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract). Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Blight Cleanser
```
Walking sprite sheet for one Alienmon townsperson: Blight Cleanser, a cleanser with a lantern. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract). Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Ystran Artisan
```
Walking sprite sheet for one Alienmon townsperson: Ystran Artisan, an artisan with crystal tools. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract). Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Fragment Wanderer
```
Walking sprite sheet for one Alienmon townsperson: Fragment Wanderer, a wanderer. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract). Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Memory Keeper
```
Walking sprite sheet for one Alienmon townsperson: Memory Keeper, a keeper with a glowing book. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract). Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Ring Warden
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Ring Warden, a warden. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract). Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Glasswood Ranger
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Glasswood Ranger, a ranger. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract). Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Vault Keeper
```
Walking sprite sheet for one Alienmon townsperson: Vault Keeper, a keeper. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract). Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Dome Researcher
```
Walking sprite sheet for one Alienmon townsperson: Dome Researcher, a visiting researcher. World: Ystra, the shattered homeworld of the Alienmon: floating fragments, crystal ruins and glasswood under a dying red sun, threatened by the Devourer and the blight. Palette: alien teal, magenta, void black, crystal white, red sun glow. Materials: living crystal, glasswood, ancient pale stone, void-dark rock, glowing roots. Motifs: seed shapes, rings, crystal growth, floating fragments, blight cracks (dark purple), memory glyphs (abstract). Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```
