# Glacia: map builder prompt pack

An ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Keeper: Keeper Ingrid Vale.

- **Palette:** ice blue, white, silver, aurora green and pink, warm lodge red
- **Materials:** packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood
- **Motifs:** auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice

**Attach to every render:** one finished Glacia map from `art/sections_game/08_glacia/` (a town for buildings and props, a route for terrain), so the art matches. For townsfolk attach `docs/npc_prompts/references/glacia_style_reference.png` if it exists.

**Save renders as** `08_glacia_<sheet>_<number>.png` (for example `08_glacia_buildings_1.png`) and send a few at a time.

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
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.

The objects, in reading order (left to right, top row first):
1. Log lodge with snowy roof (5x4 tiles): red door, warm windows, icicles.
2. Igloo home (4x3 tiles): ice-block dome with a tunnel door.
3. Research lab module (5x4 tiles): silver module with antennae.
4. Hot cocoa lodge (5x4 tiles): lodge with a mug-shaped sign (blank) and steam.
5. Sled garage (5x3 tiles): shed with sleds.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each building complete with its roof and a clear front door at the bottom edge, set on no ground at all.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### A2. Buildings, sheet 2
```
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.

The objects, in reading order (left to right, top row first):
1. Aurora watch tower (3x5 tiles): tower with a glass top.
2. Fossil vault (5x4 tiles): stone vault in an ice wall.
3. Ice fishing hut (3x3 tiles): hut on the ice with a hole.
4. Frostmark row house (4x3 tiles): narrow house with a steep roof.
5. Glacier rink gate (6x4 tiles): ice arch with silver doors.

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
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.

The objects, in reading order (left to right, top row first):
1. Snowman-like ice sculpture (1x2 tiles): abstract ice statue, no face.
2. Sled (2x1 tiles): wooden sled.
3. Firewood pile (1x1 tiles): logs with snow.
4. Ice crystal cluster (1x1 tiles): glowing crystals.
5. Snowy pine (2x3 tiles): pine with snow.
6. Frozen bush (1x1 tiles): bush in ice.
7. Ski rack (2x1 tiles): skis.
8. Fire barrel (1x1 tiles): barrel with fire.
9. Fossil in ice block (2x1 tiles): bones in ice.
10. Weather station (1x2 tiles): anemometer.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### B2. Outdoor props, sheet 2
```
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.

The objects, in reading order (left to right, top row first):
1. Snow bench (2x1 tiles): bench.
2. Ice fishing hole (1x1 tiles): hole with rod.
3. Lantern on a pole (1x2 tiles): warm lantern.
4. Snowdrift (2x1 tiles): drift.
5. Supply sled (2x1 tiles): sled with crates.
6. Aurora flower (1x1 tiles): glowing pink-green flower.
7. Signal flare post (1x2 tiles): post.
8. Ice pillar (1x2 tiles): pillar.
9. Mailbox with snow (1x1 tiles): mailbox.
10. Telescope on tripod (1x2 tiles): scope.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## C. Indoor furniture

### C1. Indoor furniture, sheet 1
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.

The objects, in reading order (left to right, top row first):
1. Fireplace (2x2 tiles): stone fireplace.
2. Fur rug (2x2 tiles): rug.
3. Log bed with quilts (2x1 tiles): bed.
4. Cocoa counter (3x1 tiles): counter with mugs.
5. Armchair (1x1 tiles): chair.
6. Lab bench with samples (3x1 tiles): bench.
7. Ice core freezer (1x2 tiles): freezer.
8. Bookshelf (2x1 tiles): books.
9. Coat and boot rack (1x1 tiles): rack.
10. Dining table (2x2 tiles): table.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### C2. Indoor furniture, sheet 2
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.

The objects, in reading order (left to right, top row first):
1. Fossil display (2x1 tiles): display.
2. Radio desk (2x1 tiles): desk.
3. Bunk beds (2x2 tiles): bunks.
4. Kettle stove (1x1 tiles): stove.
5. Map wall (2x1 tiles): map.
6. Ski workshop bench (2x1 tiles): bench.
7. Potted winter plant (1x1 tiles): plant.
8. Knitting chair with basket (1x1 tiles): chair.
9. Shop counter (3x1 tiles): counter.
10. Recovery Bay bed (2x1 tiles): bed with an ice-blue stripe.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## D. Signs, lights and markers
```
Sprite sheet of separate signs, lights and markers for the Alienmon map builder. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.

The objects, in reading order (left to right, top row first):
1. Route signpost (1x1 tiles): post with blank boards and snow.
2. Notice board (2x1 tiles): board.
3. Shop sign (1x1 tiles): snowflake shape.
4. Recovery Bay sign (1x1 tiles): ice-blue cross shape.
5. Lantern post (1x2 tiles): lantern.
6. Trail pole (1x2 tiles): striped pole.
7. Avalanche warning post (1x1 tiles): post with a light.
8. Ice marker (1x1 tiles): flag.
9. Wall lantern (1x1 tiles): lantern.
10. Heat lamp (1x2 tiles): lamp.

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
Sprite sheet of separate treasure chests, items lying on the ground and things that block a path for the Alienmon map builder. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.

The objects, in reading order (left to right, top row first):
1. Treasure chest, closed (1x1 tiles): wooden chest with silver bands and frost.
2. Same chest, open (1x1 tiles): lid up, empty.
3. Supply crate, closed (1x1 tiles): research crate.
4. Locked way: energy fence (1x1 tiles): silver posts with a cyan field.
5. Locked way: ice wall (1x1 tiles): thick clear ice.
6. Locked way: snowdrift (1x1 tiles): huge drift.
7. Ground pickup sparkle (1x1 tiles): capsule in snow.
8. Buried item in snow (1x1 tiles): glint.
9. Key item: lab keycard (1x1 tiles): frosted card.
10. Key item: aurora prism (1x1 tiles): glowing crystal.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each fits one tile (16 x 16 at map scale) except the locked ways, which are one tile wide and may stand a little taller.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## F. Turnaround sheets (one object, four facings)
For everything that looks different from the front, back and sides. In Sprite Studio tick **turn sheet**; on the map, select the prop and press **Turn** to switch facing. **Mirror** flips any prop left to right.

### F1. Sled and Snow bench
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.

Row 1: Sled (2x1 tiles): wooden sled.
Row 2: Snow bench (2x1 tiles): bench.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F2. Supply sled and Log bed with quilts
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.

Row 1: Supply sled (2x1 tiles): sled with crates.
Row 2: Log bed with quilts (2x1 tiles): bed.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F3. Cocoa counter and Armchair
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.

Row 1: Cocoa counter (3x1 tiles): counter with mugs.
Row 2: Armchair (1x1 tiles): chair.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F4. Lab bench with samples and Radio desk
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.

Row 1: Lab bench with samples (3x1 tiles): bench.
Row 2: Radio desk (2x1 tiles): desk.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F5. Bunk beds and Kettle stove
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.

Row 1: Bunk beds (2x2 tiles): bunks.
Row 2: Kettle stove (1x1 tiles): stove.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F6. Ski workshop bench and Knitting chair with basket
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.

Row 1: Ski workshop bench (2x1 tiles): bench.
Row 2: Knitting chair with basket (1x1 tiles): chair.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F7. Shop counter and Recovery Bay bed
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.

Row 1: Shop counter (3x1 tiles): counter.
Row 2: Recovery Bay bed (2x1 tiles): bed with an ice-blue stripe.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## G. Ground textures (paint them in Paint: Terrain)
Upload each in Terrain under "From a seamless picture", give it the name and set Ground (walkable, tall grass, water, lava or blocked).

### Packed snow path
```
Seamless tileable top-down ground texture for the Alienmon map builder: Packed snow path, snow with footprints. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Ice sheet
```
Seamless tileable top-down ground texture for the Alienmon map builder: Ice sheet, blue ice with cracks. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Tall frost grass (wild encounters)
```
Seamless tileable top-down ground texture for the Alienmon map builder: Tall frost grass (wild encounters), tall pale blue grass. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Icy water
```
Seamless tileable top-down ground texture for the Alienmon map builder: Icy water, dark blue water with floes. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Snowfield
```
Seamless tileable top-down ground texture for the Alienmon map builder: Snowfield, soft white snow. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Crystal cave floor
```
Seamless tileable top-down ground texture for the Alienmon map builder: Crystal cave floor, blue stone with crystals. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

## H. Terrain features
Ponds, cliff pieces, stairs and bridges as separate pieces. After placing one, set its ground with Paint: Walkable (water, ledge, blocked). Cliff pieces: the walkable foot is part of the piece.

### H1. Terrain features, sheet 1
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.

The objects, in reading order (left to right, top row first):
1. Frozen pond (5x4 tiles): pond with an ice edge.
2. Glacier cliff wall (4x3 tiles): ice cliff with a walkable foot.
3. Glacier corner (3x3 tiles): corner.
4. Ice stairs (2x3 tiles): carved stairs.
5. Log bridge (5x2 tiles): bridge over a crevasse.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### H2. Terrain features, sheet 2
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice.

The objects, in reading order (left to right, top row first):
1. One-way ledge (4x1 tiles): snow drop.
2. Crevasse (4x2 tiles): crack in ice.
3. Crystal patch (3x2 tiles): crystals.
4. Ice cave mouth (3x3 tiles): cave.
5. Floe island (3x3 tiles): ice floe.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## I. Walking townsfolk
One render per person. In Sprite Studio: 3 columns, 4 rows, order down, left, right, up. Then place them from People.

### Ice Fisher
```
Walking sprite sheet for one Alienmon townsperson: Ice Fisher, a fisher in a fur hat with a rod. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Aurora Watcher
```
Walking sprite sheet for one Alienmon townsperson: Aurora Watcher, a dreamer with a blanket and binoculars. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Sled Courier
```
Walking sprite sheet for one Alienmon townsperson: Sled Courier, a courier with a sled harness. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Snow Researcher
```
Walking sprite sheet for one Alienmon townsperson: Snow Researcher, a scientist in a parka with a sample kit. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Fur-trim Trader
```
Walking sprite sheet for one Alienmon townsperson: Fur-trim Trader, a trader with bundles. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Snowball Kid
```
Walking sprite sheet for one Alienmon townsperson: Snowball Kid, a kid with a snowball. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Ice Climber
```
Walking sprite sheet for one Alienmon townsperson: Ice Climber, a climber with axes and rope. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Frostmark Baker
```
Walking sprite sheet for one Alienmon townsperson: Frostmark Baker, a baker with a tray of buns. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Skier
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Skier, a skier with poles. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Fossil Digger
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Fossil Digger, a digger with a pick. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Lodge Host
```
Walking sprite sheet for one Alienmon townsperson: Lodge Host, a host with a mug. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Lab Technician
```
Walking sprite sheet for one Alienmon townsperson: Lab Technician, a tech with a tablet. World: Glacia, an ice world of glaciers, auroras and the research town Frostmark, with crystal caverns, frozen falls and fossil digs. Palette: ice blue, white, silver, aurora green and pink, warm lodge red. Materials: packed snow, ice blocks, timber logs, fur trim, frosted glass, silver metal, red-painted wood. Motifs: auroras, snowflakes, icicles, warm lit windows, sled runners, fossil bones in ice. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```
