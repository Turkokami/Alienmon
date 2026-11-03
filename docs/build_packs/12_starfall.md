# Starfall Rift: map builder prompt pack

A nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Keeper: Director Thorne of the Rift containment.

- **Palette:** magenta, violet, star gold, deep space purple, camp canvas tan
- **Materials:** canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear
- **Motifs:** seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons

**Attach to every render:** one finished Starfall Rift map from `art/sections_game/12_starfall/` (a town for buildings and props, a route for terrain), so the art matches. For townsfolk attach `docs/npc_prompts/references/starfall_style_reference.png` if it exists.

**Save renders as** `12_starfall_<sheet>_<number>.png` (for example `12_starfall_buildings_1.png`) and send a few at a time.

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
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.

The objects, in reading order (left to right, top row first):
1. Rim camp tent (4x3 tiles): canvas tent.
2. Field station (5x4 tiles): prefab station.
3. Seedpod greenhouse (5x4 tiles): glass house of pods.
4. Observation post (3x5 tiles): tower.
5. Containment pylon hut (4x3 tiles): hut with a pylon.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each building complete with its roof and a clear front door at the bottom edge, set on no ground at all.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### A2. Buildings, sheet 2
```
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.

The objects, in reading order (left to right, top row first):
1. Camp mess tent (6x4 tiles): big tent.
2. Supply shop module (4x3 tiles): module.
3. Teo's old camp shack (4x3 tiles): old shack.
4. Rift engine platform edge (6x4 tiles): platform.
5. Crater arena gate (6x4 tiles): gate.

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
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.

The objects, in reading order (left to right, top row first):
1. Glowing seedpod (1x1 tiles): pod.
2. Seedpod cluster (2x1 tiles): pods.
3. Meteor chunk (1x1 tiles): rock.
4. Survey flag (1x1 tiles): flag.
5. Star crystal (1x1 tiles): crystal.
6. Camp chair (1x1 tiles): chair.
7. Camp table (2x1 tiles): table.
8. Containment pylon (1x2 tiles): pylon.
9. Sensor tripod (1x2 tiles): tripod.
10. Supply crates (1x1 tiles): crates.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### B2. Outdoor props, sheet 2
```
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.

The objects, in reading order (left to right, top row first):
1. Rover (2x1 tiles): rover.
2. Antenna (1x2 tiles): antenna.
3. Lantern pole (1x2 tiles): lantern.
4. Nebula flower (1x1 tiles): flower.
5. Camp fire (1x1 tiles): fire.
6. Water tank (1x2 tiles): tank.
7. Solar panel (2x1 tiles): panel.
8. Sample cooler (1x1 tiles): cooler.
9. Crater rock pile (2x1 tiles): rocks.
10. Bench (2x1 tiles): bench.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## C. Indoor furniture

### C1. Indoor furniture, sheet 1
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.

The objects, in reading order (left to right, top row first):
1. Camp cot (2x1 tiles): cot.
2. Field desk (2x1 tiles): desk.
3. Sample shelf (2x1 tiles): shelf.
4. Pod incubator (1x1 tiles): incubator.
5. Map table (2x2 tiles): table.
6. Radio station (2x1 tiles): radio.
7. Lockers (2x1 tiles): lockers.
8. Mess table (3x2 tiles): table.
9. Stove (1x1 tiles): stove.
10. Star chart wall (2x1 tiles): chart.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### C2. Indoor furniture, sheet 2
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.

The objects, in reading order (left to right, top row first):
1. Telescope (1x2 tiles): scope.
2. Medical cot (2x1 tiles): cot.
3. Bookcase (2x1 tiles): books.
4. Rug (2x2 tiles): rug.
5. Chair (1x1 tiles): chair.
6. Plant pot (1x1 tiles): pot.
7. Containment console (3x1 tiles): console.
8. Bunk (2x2 tiles): bunk.
9. Shop counter (3x1 tiles): counter.
10. Recovery Bay bed (2x1 tiles): bed with a magenta stripe.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## D. Signs, lights and markers
```
Sprite sheet of separate signs, lights and markers for the Alienmon map builder. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.

The objects, in reading order (left to right, top row first):
1. Route signpost (1x1 tiles): aluminium post with blank boards.
2. Notice board (2x1 tiles): board.
3. Shop sign (1x1 tiles): pod shape.
4. Recovery Bay sign (1x1 tiles): magenta cross.
5. Camp lamp (1x2 tiles): lamp.
6. Rift warning post (1x1 tiles): post.
7. Survey stake (1x1 tiles): stake.
8. Beacon (1x2 tiles): beacon.
9. Wall lamp (1x1 tiles): lamp.
10. Path light (1x1 tiles): light.

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
Sprite sheet of separate treasure chests, items lying on the ground and things that block a path for the Alienmon map builder. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.

The objects, in reading order (left to right, top row first):
1. Treasure chest, closed (1x1 tiles): survey case with star glass.
2. Same chest, open (1x1 tiles): lid up, empty.
3. Supply crate, closed (1x1 tiles): crate.
4. Locked way: energy fence (1x1 tiles): pylons with a cyan field.
5. Locked way: containment field (1x1 tiles): magenta field.
6. Locked way: meteor rubble (1x1 tiles): rubble.
7. Ground pickup sparkle (1x1 tiles): capsule in dust.
8. Hidden item in a pod husk (1x1 tiles): glint.
9. Key item: crystal map (1x1 tiles): map.
10. Key item: rift key (1x1 tiles): key.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each fits one tile (16 x 16 at map scale) except the locked ways, which are one tile wide and may stand a little taller.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## F. Turnaround sheets (one object, four facings)
For everything that looks different from the front, back and sides. In Sprite Studio tick **turn sheet**; on the map, select the prop and press **Turn** to switch facing. **Mirror** flips any prop left to right.

### F1. Camp chair and Rover
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.

Row 1: Camp chair (1x1 tiles): chair.
Row 2: Rover (2x1 tiles): rover.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F2. Bench and Camp cot
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.

Row 1: Bench (2x1 tiles): bench.
Row 2: Camp cot (2x1 tiles): cot.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F3. Field desk and Stove
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.

Row 1: Field desk (2x1 tiles): desk.
Row 2: Stove (1x1 tiles): stove.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F4. Medical cot and Chair
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.

Row 1: Medical cot (2x1 tiles): cot.
Row 2: Chair (1x1 tiles): chair.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F5. Containment console and Bunk
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.

Row 1: Containment console (3x1 tiles): console.
Row 2: Bunk (2x2 tiles): bunk.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F6. Shop counter and Recovery Bay bed
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.

Row 1: Shop counter (3x1 tiles): counter.
Row 2: Recovery Bay bed (2x1 tiles): bed with a magenta stripe.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## G. Ground textures (paint them in Paint: Terrain)
Upload each in Terrain under "From a seamless picture", give it the name and set Ground (walkable, tall grass, water, lava or blocked).

### Crater dust path
```
Seamless tileable top-down ground texture for the Alienmon map builder: Crater dust path, violet dust. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Pod field soil
```
Seamless tileable top-down ground texture for the Alienmon map builder: Pod field soil, soil with sprouts. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Tall nebula grass (wild encounters)
```
Seamless tileable top-down ground texture for the Alienmon map builder: Tall nebula grass (wild encounters), tall magenta grass. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Crater lake water
```
Seamless tileable top-down ground texture for the Alienmon map builder: Crater lake water, violet water with stars. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Meteor rock ground
```
Seamless tileable top-down ground texture for the Alienmon map builder: Meteor rock ground, dark rock. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Star glass ground
```
Seamless tileable top-down ground texture for the Alienmon map builder: Star glass ground, glass with swirls. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

## H. Terrain features
Ponds, cliff pieces, stairs and bridges as separate pieces. After placing one, set its ground with Paint: Walkable (water, ledge, blocked). Cliff pieces: the walkable foot is part of the piece.

### H1. Terrain features, sheet 1
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.

The objects, in reading order (left to right, top row first):
1. Crater pool (5x4 tiles): pool.
2. Crater wall (4x3 tiles): wall with a walkable foot.
3. Crater wall corner (3x3 tiles): corner.
4. Rock stairs (2x3 tiles): stairs.
5. Metal walkway (5x2 tiles): walkway.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### H2. Terrain features, sheet 2
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons.

The objects, in reading order (left to right, top row first):
1. One-way ledge (4x1 tiles): drop.
2. Rift crack (4x2 tiles): glowing crack.
3. Pod bed (3x2 tiles): pods.
4. Cave mouth (3x3 tiles): cave.
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

### Rift Surveyor
```
Walking sprite sheet for one Alienmon townsperson: Rift Surveyor, a surveyor with a staff. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Seedpod Collector
```
Walking sprite sheet for one Alienmon townsperson: Seedpod Collector, a collector with a pod bag. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Camp Medic
```
Walking sprite sheet for one Alienmon townsperson: Camp Medic, a medic. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Meteor Prospector
```
Walking sprite sheet for one Alienmon townsperson: Meteor Prospector, a prospector with a pick. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Rim Camp Cook
```
Walking sprite sheet for one Alienmon townsperson: Rim Camp Cook, a cook. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Signal Operator
```
Walking sprite sheet for one Alienmon townsperson: Signal Operator, an operator with headphones. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Containment Officer
```
Walking sprite sheet for one Alienmon townsperson: Containment Officer, an officer in a suit. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Star-chart Kid
```
Walking sprite sheet for one Alienmon townsperson: Star-chart Kid, a kid with a chart. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Field Ranger
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Field Ranger, a ranger. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Rift Scientist
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Rift Scientist, a scientist. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Quartermaster
```
Walking sprite sheet for one Alienmon townsperson: Quartermaster, a clerk. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Greenhouse Keeper
```
Walking sprite sheet for one Alienmon townsperson: Greenhouse Keeper, a keeper with gloves. World: Starfall Rift, a nebula world around the Rift where the seedpods came from: Rim Camp scientists, pod fields, a crater lake and meteor fields. Palette: magenta, violet, star gold, deep space purple, camp canvas tan. Materials: canvas, aluminium frames, meteor rock, glowing seedpods, star glass, survey gear. Motifs: seedpods, meteors, survey flags, crystals with nebula swirls, containment pylons. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```
