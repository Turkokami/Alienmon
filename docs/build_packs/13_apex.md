# Apex Array: map builder prompt pack

A mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Keeper: Keeper Orra Venn; the Quorum of Linkers meets here.

- **Palette:** snow white, deep blue, steel, champion gold, starlight cyan
- **Materials:** granite, steel, gold trim, glass domes, snow, banners
- **Motifs:** telescopes, star charts, laurel shapes, relay dishes, gold stars

**Attach to every render:** one finished Apex Array map from `art/sections_game/13_apex/` (a town for buildings and props, a route for terrain), so the art matches. For townsfolk attach `docs/npc_prompts/references/apex_style_reference.png` if it exists.

**Save renders as** `13_apex_<sheet>_<number>.png` (for example `13_apex_buildings_1.png`) and send a few at a time.

| Section | Sheets | Goes into the editor through |
|---|---|---|
| A. Buildings | 2 | Tools: Sprite Studio, Props (Solid rows = how deep the building is) |
| B. Outdoor props | 2 | Sprite Studio, Props |
| C. Indoor furniture | 2 | Sprite Studio, Props |
| D. Signs, lights and markers | 1 | Sprite Studio, Props |
| E. Chests, pickups and locked ways | 1 | Sprite Studio, Props (place them with Place: Items, untick "draw a chest") |
| F. Turnaround sheets | 7 | Sprite Studio with "turn sheet" ticked, then Turn on a placed prop |
| G. Ground textures | 6 | Paint: Terrain, "From a seamless picture" |
| H. Terrain features | 2 | Sprite Studio, Props, then Walkable for the ground |
| I. Walking townsfolk | 12 | Sprite Studio (3 columns, 4 rows, order down, left, right, up), People |


## A. Buildings
One building per cell; doorways sized for a person about 1 tile wide. In Sprite Studio type the first building's width in tiles.

### A1. Buildings, sheet 1
```
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.

The objects, in reading order (left to right, top row first):
1. Summit chalet (4x3 tiles): chalet.
2. Observatory dome (5x5 tiles): dome.
3. Relay tower base (3x5 tiles): tower.
4. Quorum archive (6x4 tiles): hall.
5. Linker lounge (5x4 tiles): lounge.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each building complete with its roof and a clear front door at the bottom edge, set on no ground at all.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### A2. Buildings, sheet 2
```
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.

The objects, in reading order (left to right, top row first):
1. Summit lift station (5x4 tiles): station.
2. Supply shop (4x3 tiles): shop.
3. Instrument hut (4x3 tiles): hut.
4. Hall of champions gate (6x5 tiles): gate.
5. Grand stadium gate (6x4 tiles): gate.

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
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.

The objects, in reading order (left to right, top row first):
1. Telescope (1x2 tiles): scope.
2. Star chart stand (1x1 tiles): stand.
3. Relay dish (2x2 tiles): dish.
4. Champion statue (1x2 tiles): statue of a hero pose, original.
5. Granite bench (2x1 tiles): bench.
6. Snowy pine (2x3 tiles): pine.
7. Gold laurel planter (1x1 tiles): planter.
8. Flag pole (1x2 tiles): blank flag.
9. Weather vane (1x2 tiles): vane.
10. Instrument crate (1x1 tiles): crate.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### B2. Outdoor props, sheet 2
```
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.

The objects, in reading order (left to right, top row first):
1. Snow lantern (1x2 tiles): lantern.
2. Rope rail (2x1 tiles): rail.
3. Meltwater fountain (2x2 tiles): fountain.
4. Snow drift (2x1 tiles): drift.
5. Cable car cabin (2x2 tiles): cabin.
6. Plaque stone (1x1 tiles): blank plaque.
7. Crystal ice (1x1 tiles): ice.
8. Tarn reeds (1x1 tiles): reeds.
9. Sled (2x1 tiles): sled.
10. Bench with view (2x1 tiles): bench.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## C. Indoor furniture

### C1. Indoor furniture, sheet 1
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.

The objects, in reading order (left to right, top row first):
1. Trophy cabinet (2x1 tiles): cabinet.
2. Archive shelves (2x1 tiles): shelves.
3. Long council table (3x2 tiles): table.
4. Lounge sofa (2x1 tiles): sofa.
5. Telescope control desk (2x1 tiles): desk.
6. Star globe (1x1 tiles): globe.
7. Fireplace (2x2 tiles): fireplace.
8. Bed (2x1 tiles): bed.
9. Reading chair (1x1 tiles): chair.
10. Banner wall (2x1 tiles): blank banners.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### C2. Indoor furniture, sheet 2
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.

The objects, in reading order (left to right, top row first):
1. Map table (2x2 tiles): table.
2. Kitchen (2x1 tiles): kitchen.
3. Locker (1x2 tiles): locker.
4. Plant (1x1 tiles): plant.
5. Podium (1x1 tiles): podium.
6. Rug (2x2 tiles): rug.
7. Bunk (2x2 tiles): bunk.
8. Coffee bar (2x1 tiles): bar.
9. Shop counter (3x1 tiles): counter.
10. Recovery Bay bed (2x1 tiles): bed with a gold stripe.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## D. Signs, lights and markers
```
Sprite sheet of separate signs, lights and markers for the Alienmon map builder. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.

The objects, in reading order (left to right, top row first):
1. Route signpost (1x1 tiles): steel post with blank boards.
2. Notice board (2x1 tiles): board.
3. Shop sign (1x1 tiles): star shape.
4. Recovery Bay sign (1x1 tiles): gold cross.
5. Lamp post (1x2 tiles): lamp.
6. Trail marker (1x1 tiles): marker.
7. Altitude post (1x2 tiles): post.
8. Beacon (1x2 tiles): beacon.
9. Wall lamp (1x1 tiles): lamp.
10. Banner pole (1x2 tiles): pole.

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
Sprite sheet of separate treasure chests, items lying on the ground and things that block a path for the Alienmon map builder. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.

The objects, in reading order (left to right, top row first):
1. Treasure chest, closed (1x1 tiles): steel chest with gold stars.
2. Same chest, open (1x1 tiles): lid up, empty.
3. Supply crate, closed (1x1 tiles): crate.
4. Locked way: energy fence (1x1 tiles): steel posts with a cyan field.
5. Locked way: champion gate (1x1 tiles): gold gate.
6. Locked way: avalanche snow (1x1 tiles): snow.
7. Ground pickup sparkle (1x1 tiles): capsule in snow.
8. Hidden item by a telescope (1x1 tiles): glint.
9. Key item: quorum seal (1x1 tiles): seal.
10. Key item: lens key (1x1 tiles): key.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each fits one tile (16 x 16 at map scale) except the locked ways, which are one tile wide and may stand a little taller.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## F. Turnaround sheets (one object, four facings)
For everything that looks different from the front, back and sides. In Sprite Studio tick **turn sheet**; on the map, select the prop and press **Turn** to switch facing. **Mirror** flips any prop left to right.

### F1. Granite bench and Cable car cabin
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.

Row 1: Granite bench (2x1 tiles): bench.
Row 2: Cable car cabin (2x2 tiles): cabin.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F2. Sled and Bench with view
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.

Row 1: Sled (2x1 tiles): sled.
Row 2: Bench with view (2x1 tiles): bench.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F3. Lounge sofa and Telescope control desk
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.

Row 1: Lounge sofa (2x1 tiles): sofa.
Row 2: Telescope control desk (2x1 tiles): desk.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F4. Bed and Reading chair
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.

Row 1: Bed (2x1 tiles): bed.
Row 2: Reading chair (1x1 tiles): chair.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F5. Podium and Bunk
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.

Row 1: Podium (1x1 tiles): podium.
Row 2: Bunk (2x2 tiles): bunk.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F6. Coffee bar and Shop counter
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.

Row 1: Coffee bar (2x1 tiles): bar.
Row 2: Shop counter (3x1 tiles): counter.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F7. Recovery Bay bed
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.

Row 1: Recovery Bay bed (2x1 tiles): bed with a gold stripe.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## G. Ground textures (paint them in Paint: Terrain)
Upload each in Terrain under "From a seamless picture", give it the name and set Ground (walkable, tall grass, water, lava or blocked).

### Granite path
```
Seamless tileable top-down ground texture for the Alienmon map builder: Granite path, grey stone. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Alpine meadow
```
Seamless tileable top-down ground texture for the Alienmon map builder: Alpine meadow, short grass with snow patches. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Tall alpine grass (wild encounters)
```
Seamless tileable top-down ground texture for the Alienmon map builder: Tall alpine grass (wild encounters), tall grass. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Meltwater tarn
```
Seamless tileable top-down ground texture for the Alienmon map builder: Meltwater tarn, clear cold water. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Snow
```
Seamless tileable top-down ground texture for the Alienmon map builder: Snow, snow. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Plaza stone
```
Seamless tileable top-down ground texture for the Alienmon map builder: Plaza stone, polished stone with gold inlay. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

## H. Terrain features
Ponds, cliff pieces, stairs and bridges as separate pieces. After placing one, set its ground with Paint: Walkable (water, ledge, blocked). Cliff pieces: the walkable foot is part of the piece.

### H1. Terrain features, sheet 1
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.

The objects, in reading order (left to right, top row first):
1. Tarn (5x4 tiles): mountain lake.
2. Mountain cliff wall (4x3 tiles): cliff with a walkable foot.
3. Mountain cliff corner (3x3 tiles): corner.
4. Summit stairs (2x3 tiles): stairs.
5. Rope bridge (5x2 tiles): bridge.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### H2. Terrain features, sheet 2
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars.

The objects, in reading order (left to right, top row first):
1. One-way ledge (4x1 tiles): drop.
2. Scree slope (4x2 tiles): slope.
3. Flower bed (3x2 tiles): bed.
4. Ice cave mouth (3x3 tiles): cave.
5. Tarn islet (3x3 tiles): islet.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## I. Walking townsfolk
One render per person. In Sprite Studio: 3 columns, 4 rows, order down, left, right, up. Then place them from People.

### Telescope Technician
```
Walking sprite sheet for one Alienmon townsperson: Telescope Technician, a technician. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Summit Climber
```
Walking sprite sheet for one Alienmon townsperson: Summit Climber, a climber. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Star Chart Scholar
```
Walking sprite sheet for one Alienmon townsperson: Star Chart Scholar, a scholar. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Relay Engineer
```
Walking sprite sheet for one Alienmon townsperson: Relay Engineer, an engineer. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Quorum Delegate
```
Walking sprite sheet for one Alienmon townsperson: Quorum Delegate, a delegate in a formal coat. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Mountain Porter
```
Walking sprite sheet for one Alienmon townsperson: Mountain Porter, a porter with a frame pack. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Prime Linker Hopeful
```
Walking sprite sheet for one Alienmon townsperson: Prime Linker Hopeful, a determined young Linker. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Observatory Kid
```
Walking sprite sheet for one Alienmon townsperson: Observatory Kid, a kid. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Ace Linker
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Ace Linker, an ace with a gold scarf. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Summit Veteran
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Summit Veteran, a veteran. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Archive Keeper
```
Walking sprite sheet for one Alienmon townsperson: Archive Keeper, a keeper. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Stadium Host
```
Walking sprite sheet for one Alienmon townsperson: Stadium Host, a host. World: Apex Array, a mountain summit of telescopes and relay towers where the Quorum of Linkers meets, with a grand stadium and the Hall of Champions. Palette: snow white, deep blue, steel, champion gold, starlight cyan. Materials: granite, steel, gold trim, glass domes, snow, banners. Motifs: telescopes, star charts, laurel shapes, relay dishes, gold stars. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```
