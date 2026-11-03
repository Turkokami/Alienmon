# Umbra: map builder prompt pack

A dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Keeper: Keeper Mortimer Kade, who studies the void.

- **Palette:** deep purple, midnight blue, lantern amber, ghostly white, moss teal
- **Materials:** dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist
- **Motifs:** lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons

**Attach to every render:** one finished Umbra map from `art/sections_game/11_umbra/` (a town for buildings and props, a route for terrain), so the art matches. For townsfolk attach `docs/npc_prompts/references/umbra_style_reference.png` if it exists.

**Save renders as** `11_umbra_<sheet>_<number>.png` (for example `11_umbra_buildings_1.png`) and send a few at a time.

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
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons.

The objects, in reading order (left to right, top row first):
1. Crooked slate house (4x3 tiles): house with a lit window.
2. Lantern maker shop (4x3 tiles): shop full of lanterns.
3. Shadow inn (6x4 tiles): inn with a porch.
4. Mine winding house (4x5 tiles): tower with a wheel.
5. Kade's study tower (3x5 tiles): narrow tower.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each building complete with its roof and a clear front door at the bottom edge, set on no ground at all.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### A2. Buildings, sheet 2
```
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons.

The objects, in reading order (left to right, top row first):
1. Night market stall row (6x3 tiles): stalls under lanterns.
2. Gravekeeper cottage (4x3 tiles): cottage by a fence.
3. Mirror lake boathouse (4x3 tiles): boathouse.
4. Observatory of the void (5x4 tiles): dome with a dark lens.
5. Lantern pit gate (6x4 tiles): gate.

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
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons.

The objects, in reading order (left to right, top row first):
1. Lantern post (1x2 tiles): amber lantern.
2. Stone marker with a moon carving (1x1 tiles): marker.
3. Iron fence (2x1 tiles): fence.
4. Dead tree (2x3 tiles): tree.
5. Glow moth swarm (1x1 tiles): moths.
6. Mist pool (1x1 tiles): pool.
7. Bench (2x1 tiles): bench.
8. Market stall (2x2 tiles): stall.
9. Candle cluster (1x1 tiles): candles.
10. Mirror shard rock (1x1 tiles): rock.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### B2. Outdoor props, sheet 2
```
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons.

The objects, in reading order (left to right, top row first):
1. Mine cart (2x1 tiles): cart.
2. Bell on a frame (1x2 tiles): bell.
3. Lantern string (3x1 tiles): string.
4. Ghost flower (1x1 tiles): white flower.
5. Well (2x2 tiles): well.
6. Crate stack (1x1 tiles): crates.
7. Moon dial (1x1 tiles): dial.
8. Gargoyle-like statue (1x2 tiles): cute stone creature.
9. Rope fence (2x1 tiles): fence.
10. Fog vent (1x1 tiles): vent.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## C. Indoor furniture

### C1. Indoor furniture, sheet 1
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons.

The objects, in reading order (left to right, top row first):
1. Velvet armchair (1x1 tiles): chair.
2. Lantern workbench (2x1 tiles): bench.
3. Four-poster bed (2x2 tiles): bed.
4. Bookshelf (2x1 tiles): books.
5. Candle chandelier (1x1 tiles): chandelier.
6. Writing desk (2x1 tiles): desk.
7. Mirror (1x2 tiles): mirror.
8. Fireplace (2x2 tiles): fireplace.
9. Specimen cabinet (1x2 tiles): cabinet.
10. Inn bar (3x1 tiles): bar.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### C2. Indoor furniture, sheet 2
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons.

The objects, in reading order (left to right, top row first):
1. Round table (2x2 tiles): table.
2. Trunk (1x1 tiles): trunk.
3. Clock (1x2 tiles): clock.
4. Map of the sinkhole (2x1 tiles): map.
5. Kitchen (2x1 tiles): kitchen.
6. Rug (2x2 tiles): rug.
7. Telescope (1x2 tiles): scope.
8. Bunk (2x2 tiles): bunk.
9. Shop counter (3x1 tiles): counter.
10. Recovery Bay bed (2x1 tiles): bed with a lavender stripe.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## D. Signs, lights and markers
```
Sprite sheet of separate signs, lights and markers for the Alienmon map builder. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons.

The objects, in reading order (left to right, top row first):
1. Route signpost (1x1 tiles): iron post with blank boards.
2. Notice board (2x1 tiles): board.
3. Shop sign (1x1 tiles): lantern shape.
4. Recovery Bay sign (1x1 tiles): amber cross.
5. Street lantern (1x2 tiles): lantern.
6. Sinkhole warning post (1x1 tiles): post.
7. Lantern on a hook (1x2 tiles): lantern.
8. Moon marker (1x1 tiles): marker.
9. Wall lantern (1x1 tiles): lantern.
10. Candle niche (1x1 tiles): niche.

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
Sprite sheet of separate treasure chests, items lying on the ground and things that block a path for the Alienmon map builder. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons.

The objects, in reading order (left to right, top row first):
1. Treasure chest, closed (1x1 tiles): dark wood chest with iron straps and a moon clasp.
2. Same chest, open (1x1 tiles): lid up, empty.
3. Supply crate, closed (1x1 tiles): crate.
4. Locked way: energy fence (1x1 tiles): iron posts with a cyan field.
5. Locked way: iron gate (1x1 tiles): gate.
6. Locked way: shadow mist (1x1 tiles): thick violet mist.
7. Ground pickup sparkle (1x1 tiles): capsule with a glint in the dark.
8. Hidden item under a lantern (1x1 tiles): glint.
9. Key item: moon key (1x1 tiles): key.
10. Key item: void lens (1x1 tiles): lens.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each fits one tile (16 x 16 at map scale) except the locked ways, which are one tile wide and may stand a little taller.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## F. Turnaround sheets (one object, four facings)
For everything that looks different from the front, back and sides. In Sprite Studio tick **turn sheet**; on the map, select the prop and press **Turn** to switch facing. **Mirror** flips any prop left to right.

### F1. Bench and Market stall
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons.

Row 1: Bench (2x1 tiles): bench.
Row 2: Market stall (2x2 tiles): stall.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F2. Mine cart and Velvet armchair
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons.

Row 1: Mine cart (2x1 tiles): cart.
Row 2: Velvet armchair (1x1 tiles): chair.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F3. Four-poster bed and Writing desk
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons.

Row 1: Four-poster bed (2x2 tiles): bed.
Row 2: Writing desk (2x1 tiles): desk.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F4. Inn bar and Bunk
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons.

Row 1: Inn bar (3x1 tiles): bar.
Row 2: Bunk (2x2 tiles): bunk.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F5. Shop counter and Recovery Bay bed
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons.

Row 1: Shop counter (3x1 tiles): counter.
Row 2: Recovery Bay bed (2x1 tiles): bed with a lavender stripe.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## G. Ground textures (paint them in Paint: Terrain)
Upload each in Terrain under "From a seamless picture", give it the name and set Ground (walkable, tall grass, water, lava or blocked).

### Cobble path
```
Seamless tileable top-down ground texture for the Alienmon map builder: Cobble path, dark cobbles with moss. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Night grass
```
Seamless tileable top-down ground texture for the Alienmon map builder: Night grass, blue-black grass. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Tall shade grass (wild encounters)
```
Seamless tileable top-down ground texture for the Alienmon map builder: Tall shade grass (wild encounters), tall dark violet grass. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Mirror lake water
```
Seamless tileable top-down ground texture for the Alienmon map builder: Mirror lake water, still black water with reflections. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Slate paving
```
Seamless tileable top-down ground texture for the Alienmon map builder: Slate paving, slate. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Mine floor
```
Seamless tileable top-down ground texture for the Alienmon map builder: Mine floor, dark rock. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

## H. Terrain features
Ponds, cliff pieces, stairs and bridges as separate pieces. After placing one, set its ground with Paint: Walkable (water, ledge, blocked). Cliff pieces: the walkable foot is part of the piece.

### H1. Terrain features, sheet 1
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons.

The objects, in reading order (left to right, top row first):
1. Mirror pond (5x4 tiles): still pond.
2. Sinkhole rim wall (4x3 tiles): rim with a walkable foot.
3. Sinkhole rim corner (3x3 tiles): corner.
4. Stone stairs (2x3 tiles): stairs.
5. Plank bridge over the abyss (5x2 tiles): bridge.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### H2. Terrain features, sheet 2
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons.

The objects, in reading order (left to right, top row first):
1. One-way ledge (4x1 tiles): drop.
2. Fog hollow (4x2 tiles): mist.
3. Ghost flower bed (3x2 tiles): flowers.
4. Mine shaft mouth (3x3 tiles): mouth.
5. Lake islet (3x3 tiles): islet.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## I. Walking townsfolk
One render per person. In Sprite Studio: 3 columns, 4 rows, order down, left, right, up. Then place them from People.

### Lantern Lighter
```
Walking sprite sheet for one Alienmon townsperson: Lantern Lighter, a lighter with a pole. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Gravekeeper
```
Walking sprite sheet for one Alienmon townsperson: Gravekeeper, a keeper with a shovel and lantern. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Shadow Cartographer
```
Walking sprite sheet for one Alienmon townsperson: Shadow Cartographer, a mapmaker with rolled maps. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Night Market Vendor
```
Walking sprite sheet for one Alienmon townsperson: Night Market Vendor, a vendor with a tray. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Veiled Mourner
```
Walking sprite sheet for one Alienmon townsperson: Veiled Mourner, a gentle figure in a veil. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Ghost-story Kid
```
Walking sprite sheet for one Alienmon townsperson: Ghost-story Kid, a kid with a sheet cape. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Void Researcher
```
Walking sprite sheet for one Alienmon townsperson: Void Researcher, a researcher with a strange lens. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Mine Watchman
```
Walking sprite sheet for one Alienmon townsperson: Mine Watchman, a watchman with a lantern. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Lantern Bearer
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Lantern Bearer, a bearer with two lanterns. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Mist Walker
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Mist Walker, a walker in a grey cloak. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Innkeeper
```
Walking sprite sheet for one Alienmon townsperson: Innkeeper, an innkeeper with a towel. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Lantern Maker
```
Walking sprite sheet for one Alienmon townsperson: Lantern Maker, a maker with tools. World: Umbra, a dark world of perpetual night around Gravewell, with lanterns, old mines, a great sinkhole and a mirror lake. Palette: deep purple, midnight blue, lantern amber, ghostly white, moss teal. Materials: dark slate, iron, aged wood, glass lanterns, velvet, candle wax, mist. Motifs: lanterns everywhere, moths, crooked rooftops, mirrors, fog, carved moons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```
