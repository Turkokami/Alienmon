# Thalassa: map builder prompt pack

An ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Keeper: Keeper Captain Marsh.

- **Palette:** turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass
- **Materials:** weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats
- **Motifs:** anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls

**Attach to every render:** one finished Thalassa map from `art/sections_game/04_thalassa/` (a town for buildings and props, a route for terrain), so the art matches. For townsfolk attach `docs/npc_prompts/references/thalassa_style_reference.png` if it exists.

**Save renders as** `04_thalassa_<sheet>_<number>.png` (for example `04_thalassa_buildings_1.png`) and send a few at a time.

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
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.

The objects, in reading order (left to right, top row first):
1. Whitewashed harbour house (4x3 tiles): white walls, blue shutters, shell trim.
2. Fish market hall (6x4 tiles): open-front hall with ice crates.
3. Harbourmaster office (5x4 tiles): two storeys, a bell and a flagpole (blank flag).
4. Boathouse (5x4 tiles): big doors over water.
5. Lighthouse (3x6 tiles): striped lighthouse with a glowing lamp room.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each building complete with its roof and a clear front door at the bottom edge, set on no ground at all.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### A2. Buildings, sheet 2
```
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.

The objects, in reading order (left to right, top row first):
1. Shell-roof cottage (4x3 tiles): roof tiled with shells.
2. Shipwright yard shed (6x4 tiles): half-built hull on a slipway.
3. Coral research hut (4x3 tiles): hut on stilts with tanks.
4. Pier café (4x3 tiles): little café with an umbrella deck.
5. Arena sea gate (6x4 tiles): arch of coral stone over water steps.

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
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.

The objects, in reading order (left to right, top row first):
1. Mooring bollard pair (1x1 tiles): iron bollards with rope.
2. Lobster trap stack (1x1 tiles): wooden traps.
3. Glass float net (2x1 tiles): net with green glass floats.
4. Anchor (1x1 tiles): big rusty anchor.
5. Buoy (1x1 tiles): red-white buoy.
6. Fish crates with ice (2x1 tiles): crates of silver fish.
7. Beach umbrella and chair (2x2 tiles): striped umbrella.
8. Driftwood bench (2x1 tiles): bench of driftwood.
9. Shell pile (1x1 tiles): pink and cream shells.
10. Coral planter (1x1 tiles): pot with dry coral.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### B2. Outdoor props, sheet 2
```
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.

The objects, in reading order (left to right, top row first):
1. Rowboat on sand (2x1 tiles): blue rowboat.
2. Rope coil and barrel (1x1 tiles): coil on a barrel.
3. Palm tree (2x2 tiles): leaning palm.
4. Beach grass (1x1 tiles): tufts.
5. Tide pool rock (1x1 tiles): rock with a little pool.
6. Gull perch post (1x2 tiles): post with a nest.
7. Sail drying frame (2x2 tiles): sail on a frame.
8. Fishing rod rack (1x1 tiles): rods.
9. Harbour crane (2x3 tiles): small wooden crane.
10. Lantern post (1x2 tiles): brass lantern.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## C. Indoor furniture

### C1. Indoor furniture, sheet 1
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.

The objects, in reading order (left to right, top row first):
1. Captain desk with charts (2x1 tiles): sea charts, compass.
2. Hammock (2x1 tiles): rope hammock.
3. Porthole bed (2x1 tiles): bed under a porthole.
4. Ship wheel wall decor (1x1 tiles): wheel on the wall.
5. Aquarium tank (2x1 tiles): tank with fish and coral.
6. Barrel table (1x1 tiles): barrel with a lantern.
7. Sea chest (1x1 tiles): brass-bound chest (decor).
8. Net and float wall (2x1 tiles): decor net.
9. Galley stove (2x1 tiles): iron stove, kettle.
10. Bookshelf of logbooks (2x1 tiles): logbooks.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### C2. Indoor furniture, sheet 2
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.

The objects, in reading order (left to right, top row first):
1. Fish market counter (3x1 tiles): counter on ice.
2. Diving suit stand (1x2 tiles): brass helmet suit.
3. Shell lamp (1x1 tiles): lamp with a shell shade.
4. Rope ladder to loft (1x2 tiles): ladder.
5. Model ship case (1x1 tiles): ship in a glass case.
6. Plank dining table (2x2 tiles): table with benches.
7. Coral specimen shelf (2x1 tiles): coral pieces.
8. Bunk beds (2x2 tiles): ship bunks.
9. Shop counter (3x1 tiles): driftwood counter.
10. Recovery Bay bed (2x1 tiles): white bed, turquoise stripe.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## D. Signs, lights and markers
```
Sprite sheet of separate signs, lights and markers for the Alienmon map builder. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.

The objects, in reading order (left to right, top row first):
1. Route signpost (1x1 tiles): driftwood post with blank boards.
2. Notice board (2x1 tiles): board with blank notices.
3. Shop sign (1x1 tiles): hanging fish-shaped sign.
4. Recovery Bay sign (1x1 tiles): turquoise sign, white cross shape.
5. Dock lantern (1x2 tiles): brass lantern post.
6. Channel marker (1x2 tiles): striped marker in water.
7. Ship bell post (1x2 tiles): bell on a post.
8. Lighthouse beam lamp (1x1 tiles): lamp head.
9. Wall lantern (1x1 tiles): small brass lantern.
10. Pier number plate (1x1 tiles): blank enamel plate.

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
Sprite sheet of separate treasure chests, items lying on the ground and things that block a path for the Alienmon map builder. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.

The objects, in reading order (left to right, top row first):
1. Treasure chest, closed (1x1 tiles): brass-bound sea chest.
2. Same chest, open (1x1 tiles): lid up, empty.
3. Supply crate, closed (1x1 tiles): cargo crate with rope.
4. Locked way: energy fence (1x1 tiles): brass posts with a cyan field.
5. Locked way: barnacled gate (1x1 tiles): sea gate crusted with barnacles.
6. Locked way: fallen mast (1x1 tiles): broken mast across the dock.
7. Ground pickup sparkle (1x1 tiles): capsule in sand with a glint.
8. Buried item under shells (1x1 tiles): glint under shells.
9. Key item: harbour key (1x1 tiles): brass key with an anchor bow.
10. Key item: tide chart (1x1 tiles): rolled map with a ribbon.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each fits one tile (16 x 16 at map scale) except the locked ways, which are one tile wide and may stand a little taller.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## F. Turnaround sheets (one object, four facings)
For everything that looks different from the front, back and sides. In Sprite Studio tick **turn sheet**; on the map, select the prop and press **Turn** to switch facing. **Mirror** flips any prop left to right.

### F1. Beach umbrella and chair and Driftwood bench
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.

Row 1: Beach umbrella and chair (2x2 tiles): striped umbrella.
Row 2: Driftwood bench (2x1 tiles): bench of driftwood.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F2. Rowboat on sand and Harbour crane
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.

Row 1: Rowboat on sand (2x1 tiles): blue rowboat.
Row 2: Harbour crane (2x3 tiles): small wooden crane.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F3. Captain desk with charts and Hammock
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.

Row 1: Captain desk with charts (2x1 tiles): sea charts, compass.
Row 2: Hammock (2x1 tiles): rope hammock.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F4. Porthole bed and Galley stove
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.

Row 1: Porthole bed (2x1 tiles): bed under a porthole.
Row 2: Galley stove (2x1 tiles): iron stove, kettle.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F5. Fish market counter and Bunk beds
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.

Row 1: Fish market counter (3x1 tiles): counter on ice.
Row 2: Bunk beds (2x2 tiles): ship bunks.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F6. Shop counter and Recovery Bay bed
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.

Row 1: Shop counter (3x1 tiles): driftwood counter.
Row 2: Recovery Bay bed (2x1 tiles): white bed, turquoise stripe.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## G. Ground textures (paint them in Paint: Terrain)
Upload each in Terrain under "From a seamless picture", give it the name and set Ground (walkable, tall grass, water, lava or blocked).

### Beach sand
```
Seamless tileable top-down ground texture for the Alienmon map builder: Beach sand, pale cream sand with shells. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Dock planks
```
Seamless tileable top-down ground texture for the Alienmon map builder: Dock planks, weathered boards running one way. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Tall dune grass (wild encounters)
```
Seamless tileable top-down ground texture for the Alienmon map builder: Tall dune grass (wild encounters), tall pale green grass. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Shallow sea
```
Seamless tileable top-down ground texture for the Alienmon map builder: Shallow sea, turquoise water over sand. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Coral flats
```
Seamless tileable top-down ground texture for the Alienmon map builder: Coral flats, pink and orange coral on pale sand. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Wet rock shelf
```
Seamless tileable top-down ground texture for the Alienmon map builder: Wet rock shelf, dark wet rock with pools. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

## H. Terrain features
Ponds, cliff pieces, stairs and bridges as separate pieces. After placing one, set its ground with Paint: Walkable (water, ledge, blocked). Cliff pieces: the walkable foot is part of the piece.

### H1. Terrain features, sheet 1
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.

The objects, in reading order (left to right, top row first):
1. Tide pool (4x3 tiles): rock pool with starfish shapes.
2. Sea cliff wall (4x3 tiles): pale cliff with a sandy foot.
3. Sea cliff corner (3x3 tiles): corner of the cliff.
4. Dune stairs (2x3 tiles): wooden steps in a dune.
5. Pier section (5x2 tiles): pier over water.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### H2. Terrain features, sheet 2
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls.

The objects, in reading order (left to right, top row first):
1. One-way ledge (4x1 tiles): dune drop.
2. Breakwater rocks (4x2 tiles): line of rocks.
3. Coral bed (3x2 tiles): shallow coral.
4. Sea cave mouth (3x3 tiles): cave entrance at the waterline.
5. Sandbar islet (3x3 tiles): island with a palm.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## I. Walking townsfolk
One render per person. In Sprite Studio: 3 columns, 4 rows, order down, left, right, up. Then place them from People.

### Dock Hand
```
Walking sprite sheet for one Alienmon townsperson: Dock Hand, a dock hand with a rope coil. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Fishmonger
```
Walking sprite sheet for one Alienmon townsperson: Fishmonger, a fishmonger with an apron and a fish. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Pearl Diver
```
Walking sprite sheet for one Alienmon townsperson: Pearl Diver, a diver with goggles and a pouch. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Lighthouse Keeper
```
Walking sprite sheet for one Alienmon townsperson: Lighthouse Keeper, a keeper in a coat with a lamp. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Harbor Sailor
```
Walking sprite sheet for one Alienmon townsperson: Harbor Sailor, a sailor with a striped shirt and cap. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Beach Kid
```
Walking sprite sheet for one Alienmon townsperson: Beach Kid, a kid with a bucket and spade. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Shipwright
```
Walking sprite sheet for one Alienmon townsperson: Shipwright, a shipwright with a mallet and plank. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Coral Researcher
```
Walking sprite sheet for one Alienmon townsperson: Coral Researcher, a researcher with a clipboard and snorkel. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Surfer
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Surfer, a surfer with a board under one arm. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Old Salt
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Old Salt, a bearded sailor with a pipe-free grin and a cap. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Market Clerk
```
Walking sprite sheet for one Alienmon townsperson: Market Clerk, a clerk with a scale. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Ferry Captain
```
Walking sprite sheet for one Alienmon townsperson: Ferry Captain, a captain with a peaked hat. World: Thalassa, an ocean world of harbours, docks, lighthouses and coral coves around Port Saltreach, with a ghost ship and smugglers on the tide. Palette: turquoise, ocean blue, sand cream, weathered wood brown, coral pink, brass. Materials: weathered planks, rope, brass, sailcloth, shells, coral stone, whitewashed plaster, glass floats. Motifs: anchors, nets, buoys, portholes, lighthouses, shell mosaics, gulls. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```
