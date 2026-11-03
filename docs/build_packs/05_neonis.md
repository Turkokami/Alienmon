# Neonis: map builder prompt pack

A neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Keeper: Keeper DJ Static.

- **Palette:** magenta, electric cyan, indigo, hot yellow, chrome
- **Materials:** glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh
- **Motifs:** equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam

**Attach to every render:** one finished Neonis map from `art/sections_game/05_neonis/` (a town for buildings and props, a route for terrain), so the art matches. For townsfolk attach `docs/npc_prompts/references/neonis_style_reference.png` if it exists.

**Save renders as** `05_neonis_<sheet>_<number>.png` (for example `05_neonis_buildings_1.png`) and send a few at a time.

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
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.

The objects, in reading order (left to right, top row first):
1. Neon apartment block front (5x5 tiles): tall front with lit windows and a neon trim.
2. Arcade hall (6x4 tiles): big glass front with cabinets glowing inside.
3. Noodle bar (4x3 tiles): open counter with lanterns and steam.
4. Recording studio (5x4 tiles): black front with a speaker-wall door.
5. Holo billboard tower (3x5 tiles): tower with a blank glowing screen.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each building complete with its roof and a clear front door at the bottom edge, set on no ground at all.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### A2. Buildings, sheet 2
```
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.

The objects, in reading order (left to right, top row first):
1. Corner store (4x3 tiles): bright shopfront, vending machines.
2. Courtroom hall (6x4 tiles): columned building with neon trim.
3. Canal-side loft (5x4 tiles): loft over a canal walk.
4. Broadcast kiosk (3x3 tiles): small kiosk with antennae.
5. Megadome gate (6x4 tiles): glowing dome entrance.

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
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.

The objects, in reading order (left to right, top row first):
1. Vending machine pair (2x1 tiles): two glowing machines.
2. Street speaker stack (1x2 tiles): speakers with equalizer lights.
3. Holo ad pillar (1x2 tiles): pillar with a blank hologram.
4. Neon bench (2x1 tiles): bench with underglow.
5. Cable bundle (2x1 tiles): thick cables on the ground.
6. Food cart (2x1 tiles): cart with steaming pots.
7. Bike rack with hoverboards (2x1 tiles): rack.
8. Rain puddle (1x1 tiles): puddle reflecting neon.
9. Planter with neon fern (1x1 tiles): glowing fern.
10. Trash bot (1x1 tiles): cute bin robot.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### B2. Outdoor props, sheet 2
```
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.

The objects, in reading order (left to right, top row first):
1. Antenna mast (1x2 tiles): mast with blinking light.
2. Lantern string (3x1 tiles): colourful lanterns.
3. Graffiti wall piece (2x1 tiles): abstract shapes, no letters.
4. Street vent (1x1 tiles): grate with steam.
5. Payphone-style comm booth (1x2 tiles): booth with a screen.
6. Chrome railing (2x1 tiles): rail.
7. Delivery drone pad (1x1 tiles): pad with a drone.
8. Stacked crates (1x1 tiles): glowing crates.
9. Glitch crystal (1x1 tiles): flickering pixel crystal.
10. Rooftop AC unit (2x1 tiles): fan unit.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## C. Indoor furniture

### C1. Indoor furniture, sheet 1
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.

The objects, in reading order (left to right, top row first):
1. Arcade cabinet row (3x1 tiles): three cabinets with glowing screens.
2. DJ booth (3x2 tiles): decks and lights.
3. Mixing desk (2x1 tiles): sliders and screens.
4. Beanbag pair (1x1 tiles): beanbags.
5. Noodle counter with stools (3x1 tiles): bar counter.
6. Neon bed (2x1 tiles): bed with underglow.
7. Record shelf (2x1 tiles): shelves of records.
8. Holo TV (2x1 tiles): floating screen on a stand.
9. Server rack (1x2 tiles): blinking rack.
10. Glass desk with laptop (2x1 tiles): desk.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### C2. Indoor furniture, sheet 2
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.

The objects, in reading order (left to right, top row first):
1. Gaming chair (1x1 tiles): chair.
2. Claw machine (1x1 tiles): prize machine (plush shapes, no logos).
3. Prize counter (3x1 tiles): counter with plush and trinkets.
4. Courtroom bench (3x1 tiles): long bench.
5. Judge podium (2x1 tiles): tall podium.
6. Sound panel wall (2x1 tiles): foam panels.
7. Plant in chrome pot (1x1 tiles): plant.
8. Kitchenette (2x1 tiles): counter, microwave.
9. Shop counter (3x1 tiles): glossy counter.
10. Recovery Bay bed (2x1 tiles): bed with a cyan stripe.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## D. Signs, lights and markers
```
Sprite sheet of separate signs, lights and markers for the Alienmon map builder. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.

The objects, in reading order (left to right, top row first):
1. Route signpost (1x1 tiles): chrome post with blank glowing arrows.
2. Notice screen (2x1 tiles): blank screen board.
3. Shop neon sign (1x1 tiles): neon shape of a bag.
4. Recovery Bay sign (1x1 tiles): cyan cross shape in neon.
5. Street light (1x2 tiles): curved neon lamp.
6. Traffic light (1x2 tiles): three lights.
7. Holo arrow marker (1x1 tiles): floating arrow.
8. Floor light strip (2x1 tiles): strip.
9. Wall neon tube (1x1 tiles): tube.
10. Rooftop beacon (1x1 tiles): blinking beacon.

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
Sprite sheet of separate treasure chests, items lying on the ground and things that block a path for the Alienmon map builder. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.

The objects, in reading order (left to right, top row first):
1. Treasure chest, closed (1x1 tiles): chrome case with neon seams.
2. Same chest, open (1x1 tiles): lid up, empty.
3. Supply crate, closed (1x1 tiles): glowing delivery crate.
4. Locked way: energy fence (1x1 tiles): chrome posts with a cyan field.
5. Locked way: security shutter (1x1 tiles): neon-edged shutter.
6. Locked way: glitch wall (1x1 tiles): flickering pixel wall.
7. Ground pickup sparkle (1x1 tiles): capsule on wet asphalt.
8. Hidden item in a cable nest (1x1 tiles): glint in cables.
9. Key item: backstage pass (1x1 tiles): glowing lanyard card.
10. Key item: signal decoder (1x1 tiles): small device with a dial.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each fits one tile (16 x 16 at map scale) except the locked ways, which are one tile wide and may stand a little taller.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## F. Turnaround sheets (one object, four facings)
For everything that looks different from the front, back and sides. In Sprite Studio tick **turn sheet**; on the map, select the prop and press **Turn** to switch facing. **Mirror** flips any prop left to right.

### F1. Neon bench and Food cart
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.

Row 1: Neon bench (2x1 tiles): bench with underglow.
Row 2: Food cart (2x1 tiles): cart with steaming pots.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F2. Mixing desk and Noodle counter with stools
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.

Row 1: Mixing desk (2x1 tiles): sliders and screens.
Row 2: Noodle counter with stools (3x1 tiles): bar counter.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F3. Neon bed and Glass desk with laptop
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.

Row 1: Neon bed (2x1 tiles): bed with underglow.
Row 2: Glass desk with laptop (2x1 tiles): desk.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F4. Gaming chair and Prize counter
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.

Row 1: Gaming chair (1x1 tiles): chair.
Row 2: Prize counter (3x1 tiles): counter with plush and trinkets.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F5. Courtroom bench and Judge podium
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.

Row 1: Courtroom bench (3x1 tiles): long bench.
Row 2: Judge podium (2x1 tiles): tall podium.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F6. Shop counter and Recovery Bay bed
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.

Row 1: Shop counter (3x1 tiles): glossy counter.
Row 2: Recovery Bay bed (2x1 tiles): bed with a cyan stripe.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## G. Ground textures (paint them in Paint: Terrain)
Upload each in Terrain under "From a seamless picture", give it the name and set Ground (walkable, tall grass, water, lava or blocked).

### Wet asphalt
```
Seamless tileable top-down ground texture for the Alienmon map builder: Wet asphalt, dark asphalt with neon reflections. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Plaza tiles
```
Seamless tileable top-down ground texture for the Alienmon map builder: Plaza tiles, glossy indigo tiles. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Tall neon grass (wild encounters)
```
Seamless tileable top-down ground texture for the Alienmon map builder: Tall neon grass (wild encounters), tall grass with glowing tips in a park. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Canal water
```
Seamless tileable top-down ground texture for the Alienmon map builder: Canal water, dark water with neon reflections. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Metal grate walkway
```
Seamless tileable top-down ground texture for the Alienmon map builder: Metal grate walkway, grates with light underneath. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Park lawn
```
Seamless tileable top-down ground texture for the Alienmon map builder: Park lawn, short trimmed grass. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

## H. Terrain features
Ponds, cliff pieces, stairs and bridges as separate pieces. After placing one, set its ground with Paint: Walkable (water, ledge, blocked). Cliff pieces: the walkable foot is part of the piece.

### H1. Terrain features, sheet 1
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.

The objects, in reading order (left to right, top row first):
1. Canal basin (5x4 tiles): canal with a stone edge.
2. Building wall (4x3 tiles): wall with a walkable pavement foot.
3. Building corner (3x3 tiles): corner.
4. Metal stairs (2x3 tiles): stairs with neon rails.
5. Canal footbridge (5x2 tiles): arched bridge.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### H2. Terrain features, sheet 2
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam.

The objects, in reading order (left to right, top row first):
1. One-way ledge (4x1 tiles): step down.
2. Rooftop edge (4x2 tiles): roof edge with rail.
3. Park planter bed (3x2 tiles): glowing plants.
4. Undercity tunnel mouth (3x3 tiles): tunnel with lights.
5. Canal island (3x3 tiles): small island with a tree.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## I. Walking townsfolk
One render per person. In Sprite Studio: 3 columns, 4 rows, order down, left, right, up. Then place them from People.

### Neon Raver
```
Walking sprite sheet for one Alienmon townsperson: Neon Raver, glow sticks and a light-up jacket. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Holo-ad Promoter
```
Walking sprite sheet for one Alienmon townsperson: Holo-ad Promoter, a promoter with a floating holo screen. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Neon Skater
```
Walking sprite sheet for one Alienmon townsperson: Neon Skater, a skater with a hoverboard. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Arcade Kid
```
Walking sprite sheet for one Alienmon townsperson: Arcade Kid, a kid with a handheld game. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Cable Tech
```
Walking sprite sheet for one Alienmon townsperson: Cable Tech, a tech with cable coils and tools. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Noodle Stall Cook
```
Walking sprite sheet for one Alienmon townsperson: Noodle Stall Cook, a cook with a ladle and headband. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Glitch Hunter
```
Walking sprite sheet for one Alienmon townsperson: Glitch Hunter, a hunter with a scanner. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Night Courier
```
Walking sprite sheet for one Alienmon townsperson: Night Courier, a courier with a glowing box. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Beat Dancer
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Beat Dancer, a dancer in a sparkly track suit. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Holo Gamer
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Holo Gamer, a gamer with a visor. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Studio Receptionist
```
Walking sprite sheet for one Alienmon townsperson: Studio Receptionist, a receptionist with a headset. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Street Musician
```
Walking sprite sheet for one Alienmon townsperson: Street Musician, a musician with a keytar. World: Neonis, a neon city of music, holograms and arcades, where glitches and lost signals plague the grid. Palette: magenta, electric cyan, indigo, hot yellow, chrome. Materials: glossy panels, neon tubes, holo glass, chrome rails, wet asphalt, speaker mesh. Motifs: equalizer bars, holograms, cables, arcade cabinets, rain puddles reflecting neon, noodle steam. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```
