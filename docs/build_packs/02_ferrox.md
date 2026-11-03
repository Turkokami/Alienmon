# Ferrox: map builder prompt pack

A rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Keeper: Keeper Hank Briggs, a gruff mechanic.

- **Palette:** rust orange, steel grey, copper, oily teal, hazard yellow, soot black
- **Materials:** corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh
- **Motifs:** cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets

**Attach to every render:** one finished Ferrox map from `art/sections_game/02_ferrox/` (a town for buildings and props, a route for terrain), so the art matches. For townsfolk attach `docs/npc_prompts/references/ferrox_style_reference.png` if it exists.

**Save renders as** `02_ferrox_<sheet>_<number>.png` (for example `02_ferrox_buildings_1.png`) and send a few at a time.

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
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets.

The objects, in reading order (left to right, top row first):
1. Railcar house (5x3 tiles): old boxcar turned home: cut window, door with a step, chimney pipe, potted plant on the roof.
2. Corrugated workshop (6x4 tiles): big roll-up door, sparks glow inside, gear sign shape (blank), oil drums.
3. Crane operator tower (3x5 tiles): tall steel lattice with a glass cab at the top and a ladder.
4. Salvage shop (5x4 tiles): shopfront built from mismatched panels, parts bins outside, wide door.
5. Foundry chimney block (5x5 tiles): brick foundry with two smokestacks and a glowing furnace mouth.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each building complete with its roof and a clear front door at the bottom edge, set on no ground at all.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### A2. Buildings, sheet 2
```
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets.

The objects, in reading order (left to right, top row first):
1. Rustvale row house (4x3 tiles): narrow two-storey iron house with a balcony of mesh.
2. Water reclaimer (4x4 tiles): tanks and pipes around a small pump shed, teal coolant glow.
3. Rail signal box (3x3 tiles): raised cabin with levers visible through the window.
4. Mine headframe (4x5 tiles): steel headframe with a big wheel over a shaft entrance.
5. Dome arena entrance (6x4 tiles): riveted half-dome gate with hazard-striped doors.

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
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets.

The objects, in reading order (left to right, top row first):
1. Oil drum stack (1x1 tiles): three drums, one teal, one rust, one striped.
2. Tyre pile (1x1 tiles): stacked rubber tyres.
3. Scrap heap (2x2 tiles): mound of panels, gears and pipes.
4. Gear wheel leaning on a wall (1x1 tiles): big rusty cog.
5. Rail buffer stop (1x1 tiles): striped buffer at a track end.
6. Rail handcar (2x1 tiles): pump handcar on rails.
7. Coolant pipe run (3x1 tiles): thick copper pipes on brackets with a valve wheel.
8. Steam vent grate (1x1 tiles): floor grate puffing white steam.
9. Magnet crane hook (1x2 tiles): heavy hook with a round magnet on chain.
10. Workbench with vice (2x1 tiles): outdoor bench, tools.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### B2. Outdoor props, sheet 2
```
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets.

The objects, in reading order (left to right, top row first):
1. Parts bins (2x1 tiles): row of open bins with bolts and springs.
2. Welding cart (1x1 tiles): gas bottles on a cart.
3. Chain-link fence piece (2x1 tiles): patched mesh fence.
4. Rusty barrel planter (1x1 tiles): cut barrel with hardy teal plants.
5. Generator (2x1 tiles): chugging generator with cables.
6. Warning cone set (1x1 tiles): three hazard cones.
7. Scrap robot statue (1x2 tiles): friendly sculpture welded from scrap.
8. Pallet stack (1x1 tiles): wooden pallets.
9. Lamp on a pipe pole (1x2 tiles): cage lamp, warm light.
10. Coal cart on rails (2x1 tiles): mine cart full of dark ore.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## C. Indoor furniture

### C1. Indoor furniture, sheet 1
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets.

The objects, in reading order (left to right, top row first):
1. Steel workbench with lamp (3x1 tiles): bench, clamp lamp, scattered tools.
2. Tool wall (2x1 tiles): pegboard of wrenches and spanners.
3. Engine on a stand (2x2 tiles): big engine block on a rolling stand.
4. Locker row (2x1 tiles): dented metal lockers.
5. Cot bed (2x1 tiles): folding cot with a patched blanket.
6. Stove made from a drum (1x1 tiles): barrel stove with a kettle.
7. Crate table with stools (2x2 tiles): cable spool table, two stools.
8. Parts shelf (2x1 tiles): steel shelf of labelled bins (no text).
9. Lathe machine (2x1 tiles): small lathe.
10. Coolant tank (1x2 tiles): glass tank of glowing teal fluid.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### C2. Indoor furniture, sheet 2
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets.

The objects, in reading order (left to right, top row first):
1. Shop counter with till (3x1 tiles): steel counter, chunky mechanical till.
2. Sofa from car seats (2x1 tiles): bench seat sofa.
3. Blueprint table (2x1 tiles): table of rolled blueprints.
4. Welding mask hooks (1x1 tiles): masks and gloves on hooks.
5. Radio set (1x1 tiles): big valve radio.
6. Ceiling-mounted chain hoist (1x1 tiles): hoist with hook.
7. Kitchen corner (2x1 tiles): hot plate, tin mugs, kettle.
8. Bunk beds (2x2 tiles): metal bunk beds.
9. Trophy shelf of gears (2x1 tiles): polished gears as trophies.
10. Recovery Bay counter (3x1 tiles): clean steel counter with a teal stripe.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## D. Signs, lights and markers
```
Sprite sheet of separate signs, lights and markers for the Alienmon map builder. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets.

The objects, in reading order (left to right, top row first):
1. Route signpost (1x1 tiles): pipe post with two blank metal arrows.
2. Notice board (2x1 tiles): riveted board, blank papers.
3. Shop gear sign (1x1 tiles): hanging cog-shaped sign.
4. Hazard stripe barrier (2x1 tiles): yellow-black striped barrier.
5. Cage lamp post (1x2 tiles): industrial lamp.
6. Rail crossing light (1x2 tiles): post with two round lights.
7. Warning beacon (1x1 tiles): spinning orange beacon.
8. Floodlight (1x2 tiles): tall floodlight.
9. Wall caged bulb (1x1 tiles): small wall lamp.
10. Painted arrow on plate (1x1 tiles): steel plate with a painted arrow.

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
Sprite sheet of separate treasure chests, items lying on the ground and things that block a path for the Alienmon map builder. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets.

The objects, in reading order (left to right, top row first):
1. Treasure chest, closed (1x1 tiles): riveted steel toolbox chest with copper corners.
2. Same chest, open (1x1 tiles): lid up, empty.
3. Supply crate, closed (1x1 tiles): stamped shipping crate.
4. Locked way: energy fence (1x1 tiles): two steel posts with a cyan field.
5. Locked way: rolling shutter (1x1 tiles): closed rusty shutter door with a padlock.
6. Locked way: scrap pile (1x1 tiles): heap of scrap blocking the path.
7. Ground pickup sparkle (1x1 tiles): capsule in grease with a glint.
8. Buried item in scrap (1x1 tiles): glint under loose panels.
9. Key item: crane key (1x1 tiles): chunky key on a gear ring.
10. Key item: foundry pass (1x1 tiles): punched metal card.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each fits one tile (16 x 16 at map scale) except the locked ways, which are one tile wide and may stand a little taller.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## F. Turnaround sheets (one object, four facings)
For everything that looks different from the front, back and sides. In Sprite Studio tick **turn sheet**; on the map, select the prop and press **Turn** to switch facing. **Mirror** flips any prop left to right.

### F1. Rail handcar and Magnet crane hook
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets.

Row 1: Rail handcar (2x1 tiles): pump handcar on rails.
Row 2: Magnet crane hook (1x2 tiles): heavy hook with a round magnet on chain.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F2. Welding cart and Coal cart on rails
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets.

Row 1: Welding cart (1x1 tiles): gas bottles on a cart.
Row 2: Coal cart on rails (2x1 tiles): mine cart full of dark ore.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F3. Cot bed and Stove made from a drum
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets.

Row 1: Cot bed (2x1 tiles): folding cot with a patched blanket.
Row 2: Stove made from a drum (1x1 tiles): barrel stove with a kettle.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F4. Shop counter with till and Sofa from car seats
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets.

Row 1: Shop counter with till (3x1 tiles): steel counter, chunky mechanical till.
Row 2: Sofa from car seats (2x1 tiles): bench seat sofa.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F5. Bunk beds and Recovery Bay counter
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets.

Row 1: Bunk beds (2x2 tiles): metal bunk beds.
Row 2: Recovery Bay counter (3x1 tiles): clean steel counter with a teal stripe.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## G. Ground textures (paint them in Paint: Terrain)
Upload each in Terrain under "From a seamless picture", give it the name and set Ground (walkable, tall grass, water, lava or blocked).

### Oily gravel yard
```
Seamless tileable top-down ground texture for the Alienmon map builder: Oily gravel yard, dark gravel with rust flecks and oil sheen. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Steel deck plate
```
Seamless tileable top-down ground texture for the Alienmon map builder: Steel deck plate, diamond-tread steel plates with rivets. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Tall rust grass (wild encounters)
```
Seamless tileable top-down ground texture for the Alienmon map builder: Tall rust grass (wild encounters), tall wiry rust-orange grass with bits of wire. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Coolant water
```
Seamless tileable top-down ground texture for the Alienmon map builder: Coolant water, murky teal water with an oily shimmer. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Rail ballast
```
Seamless tileable top-down ground texture for the Alienmon map builder: Rail ballast, grey crushed stone with sleepers. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Scrap rubble
```
Seamless tileable top-down ground texture for the Alienmon map builder: Scrap rubble, mixed small scrap on dirt. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

## H. Terrain features
Ponds, cliff pieces, stairs and bridges as separate pieces. After placing one, set its ground with Paint: Walkable (water, ledge, blocked). Cliff pieces: the walkable foot is part of the piece.

### H1. Terrain features, sheet 1
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets.

The objects, in reading order (left to right, top row first):
1. Coolant pond (5x4 tiles): teal pool with pipe outlets and a concrete rim.
2. Scrap cliff wall (4x3 tiles): compacted scrap wall with a walkable gravel foot.
3. Scrap cliff corner (3x3 tiles): corner of the same wall.
4. Steel stairs (2x3 tiles): grated stairs with railings.
5. Rail bridge (5x2 tiles): steel girder bridge with a walkway.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### H2. Terrain features, sheet 2
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets.

The objects, in reading order (left to right, top row first):
1. One-way ledge (4x1 tiles): loading-dock drop.
2. Rail track straight (4x1 tiles): track with sleepers.
3. Rail track curve (3x3 tiles): curved track.
4. Mine entrance mouth (3x3 tiles): timbered tunnel mouth with a lamp.
5. Pipe bundle crossing (4x2 tiles): pipes you can walk under.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## I. Walking townsfolk
One render per person. In Sprite Studio: 3 columns, 4 rows, order down, left, right, up. Then place them from People.

### Crane Operator
```
Walking sprite sheet for one Alienmon townsperson: Crane Operator, a hard hat, hi-vis vest and a radio. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Scrap Picker
```
Walking sprite sheet for one Alienmon townsperson: Scrap Picker, a picker with a big sack of salvage and gloves. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Railyard Conductor
```
Walking sprite sheet for one Alienmon townsperson: Railyard Conductor, a conductor with a cap, whistle and lantern. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Forge Smith
```
Walking sprite sheet for one Alienmon townsperson: Forge Smith, a strong smith in a leather apron with tongs. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Rust Kid Tinkerer
```
Walking sprite sheet for one Alienmon townsperson: Rust Kid Tinkerer, a kid with goggles and a little wind-up robot. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Salvage Trader
```
Walking sprite sheet for one Alienmon townsperson: Salvage Trader, a trader in a patched coat with a parts tray. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Welding Apprentice
```
Walking sprite sheet for one Alienmon townsperson: Welding Apprentice, an apprentice with a welding mask pushed up. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Ferrox Foreman
```
Walking sprite sheet for one Alienmon townsperson: Ferrox Foreman, a foreman with a clipboard and a hard hat. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Mine Driller
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Mine Driller, a miner with a headlamp and a hand drill. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Junk Racer
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Junk Racer, a racer in a scrap-armour jacket. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Workshop Clerk
```
Walking sprite sheet for one Alienmon townsperson: Workshop Clerk, a clerk in grease-stained overalls. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Dome Attendant
```
Walking sprite sheet for one Alienmon townsperson: Dome Attendant, an attendant in a striped vest. World: Ferrox, a rusty scrapyard world of cranes, railyards, forges and deep mines, home of Rustvale and the Scrapyard Dome. Palette: rust orange, steel grey, copper, oily teal, hazard yellow, soot black. Materials: corrugated iron, riveted steel plate, salvaged railcar panels, copper pipe, chain, rubber tyres, welded mesh. Motifs: cranes, gears, rivets, warning stripes, patched-together repairs, steam vents, magnets. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```
