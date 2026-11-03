# Helix Station: map builder prompt pack

A space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Keeper: Admin Vex of the Helix organisation.

- **Palette:** dark steel, clinical white, hazard orange, toxic lime, cold cyan
- **Materials:** steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass
- **Motifs:** the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps

**Attach to every render:** one finished Helix Station map from `art/sections_game/09_helix/` (a town for buildings and props, a route for terrain), so the art matches. For townsfolk attach `docs/npc_prompts/references/helix_style_reference.png` if it exists.

**Save renders as** `09_helix_<sheet>_<number>.png` (for example `09_helix_buildings_1.png`) and send a few at a time.

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
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.

The objects, in reading order (left to right, top row first):
1. Crew quarters module (4x3 tiles): steel module with a sliding door.
2. Lab module (5x4 tiles): white lab with windows of glowing tanks.
3. Hydroponics dome (5x4 tiles): glass dome of plants.
4. Docking ring airlock (4x4 tiles): round airlock door.
5. Comms spire base (3x5 tiles): spire with dishes.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each building complete with its roof and a clear front door at the bottom edge, set on no ground at all.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### A2. Buildings, sheet 2
```
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.

The objects, in reading order (left to right, top row first):
1. Cargo bay shed (6x4 tiles): container stacks.
2. Containment block (5x4 tiles): heavy door with orange lights.
3. Command bridge entrance (6x4 tiles): wide stair to doors.
4. Officer house (4x3 tiles): neat module with plants.
5. Proving grounds gate (6x4 tiles): arena gate with orange light strips.

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
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.

The objects, in reading order (left to right, top row first):
1. Cargo container (2x1 tiles): container.
2. Maintenance robot (1x1 tiles): little robot.
3. Hazard barrier (2x1 tiles): barrier.
4. Coolant pipes (3x1 tiles): pipes.
5. Floor fan grate (1x1 tiles): grate.
6. Scanner arch (2x2 tiles): arch.
7. Grow lamp planter (2x1 tiles): planter.
8. Fuel canister rack (1x1 tiles): canisters.
9. Hover forklift (2x1 tiles): forklift.
10. Antenna dish (2x2 tiles): dish.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### B2. Outdoor props, sheet 2
```
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.

The objects, in reading order (left to right, top row first):
1. Bench (2x1 tiles): steel bench.
2. Terminal post (1x1 tiles): terminal.
3. Specimen tank (1x2 tiles): tank with a sleeping silhouette, not scary.
4. Cable reel (1x1 tiles): reel.
5. Hydroponic tree (1x2 tiles): tree in a tube.
6. Supply crates (1x1 tiles): crates.
7. Lift platform (2x2 tiles): lift.
8. Floor light strip (2x1 tiles): strip.
9. Water recycler (1x2 tiles): recycler.
10. Viewport window frame (3x2 tiles): window with stars.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## C. Indoor furniture

### C1. Indoor furniture, sheet 1
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.

The objects, in reading order (left to right, top row first):
1. Lab bench with tubes (3x1 tiles): bench.
2. Containment pod (1x2 tiles): empty open pod.
3. Bunk with locker (2x2 tiles): bunk.
4. Mess table (3x2 tiles): table.
5. Command console (3x1 tiles): console.
6. Holo map table (2x2 tiles): map.
7. Server racks (2x1 tiles): racks.
8. Medical bed (2x1 tiles): bed.
9. Locker row (2x1 tiles): lockers.
10. Coffee machine (1x1 tiles): machine.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### C2. Indoor furniture, sheet 2
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.

The objects, in reading order (left to right, top row first):
1. Captain chair (1x1 tiles): chair.
2. Sample freezer (1x2 tiles): freezer.
3. Microscope desk (2x1 tiles): desk.
4. Plant shelf under lamps (2x1 tiles): shelf.
5. Weapon-free armor stand (1x2 tiles): empty suit stand.
6. Sofa (2x1 tiles): sofa.
7. Cargo shelf (2x1 tiles): shelf.
8. Wall screen (2x1 tiles): screen.
9. Shop counter (3x1 tiles): counter.
10. Recovery Bay bed (2x1 tiles): bed with a cyan stripe.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## D. Signs, lights and markers
```
Sprite sheet of separate signs, lights and markers for the Alienmon map builder. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.

The objects, in reading order (left to right, top row first):
1. Route sign (1x1 tiles): wall plate with a blank arrow.
2. Notice screen (2x1 tiles): screen.
3. Shop sign (1x1 tiles): crate shape.
4. Recovery Bay sign (1x1 tiles): cyan cross.
5. Ceiling light (1x1 tiles): panel.
6. Warning light (1x1 tiles): orange beacon.
7. Deck number plate (1x1 tiles): blank plate.
8. Floor arrow (1x1 tiles): painted arrow.
9. Wall light strip (1x1 tiles): strip.
10. Emergency lamp (1x1 tiles): red lamp.

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
Sprite sheet of separate treasure chests, items lying on the ground and things that block a path for the Alienmon map builder. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.

The objects, in reading order (left to right, top row first):
1. Treasure chest, closed (1x1 tiles): steel supply case with orange latches.
2. Same chest, open (1x1 tiles): lid up, empty.
3. Supply crate, closed (1x1 tiles): sealed crate.
4. Locked way: energy fence (1x1 tiles): steel posts with a cyan field.
5. Locked way: keycard door (1x1 tiles): sliding door with a red light.
6. Locked way: debris (1x1 tiles): fallen panels.
7. Ground pickup sparkle (1x1 tiles): capsule on deck plate.
8. Hidden item in a vent (1x1 tiles): glint in a vent.
9. Key item: Helix keycard (1x1 tiles): orange keycard.
10. Key item: override chip (1x1 tiles): chip.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each fits one tile (16 x 16 at map scale) except the locked ways, which are one tile wide and may stand a little taller.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## F. Turnaround sheets (one object, four facings)
For everything that looks different from the front, back and sides. In Sprite Studio tick **turn sheet**; on the map, select the prop and press **Turn** to switch facing. **Mirror** flips any prop left to right.

### F1. Hover forklift and Bench
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.

Row 1: Hover forklift (2x1 tiles): forklift.
Row 2: Bench (2x1 tiles): steel bench.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F2. Lab bench with tubes and Bunk with locker
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.

Row 1: Lab bench with tubes (3x1 tiles): bench.
Row 2: Bunk with locker (2x2 tiles): bunk.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F3. Command console and Medical bed
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.

Row 1: Command console (3x1 tiles): console.
Row 2: Medical bed (2x1 tiles): bed.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F4. Captain chair and Microscope desk
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.

Row 1: Captain chair (1x1 tiles): chair.
Row 2: Microscope desk (2x1 tiles): desk.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F5. Sofa and Shop counter
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.

Row 1: Sofa (2x1 tiles): sofa.
Row 2: Shop counter (3x1 tiles): counter.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F6. Recovery Bay bed
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.

Row 1: Recovery Bay bed (2x1 tiles): bed with a cyan stripe.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## G. Ground textures (paint them in Paint: Terrain)
Upload each in Terrain under "From a seamless picture", give it the name and set Ground (walkable, tall grass, water, lava or blocked).

### Deck plate
```
Seamless tileable top-down ground texture for the Alienmon map builder: Deck plate, grey tread plate. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Lab floor
```
Seamless tileable top-down ground texture for the Alienmon map builder: Lab floor, white tiles. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Tall hydro grass (wild encounters)
```
Seamless tileable top-down ground texture for the Alienmon map builder: Tall hydro grass (wild encounters), tall bright grass in a garden. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Coolant water
```
Seamless tileable top-down ground texture for the Alienmon map builder: Coolant water, cyan glowing water. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Grating
```
Seamless tileable top-down ground texture for the Alienmon map builder: Grating, metal grating. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Garden soil
```
Seamless tileable top-down ground texture for the Alienmon map builder: Garden soil, dark soil with sprouts. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

## H. Terrain features
Ponds, cliff pieces, stairs and bridges as separate pieces. After placing one, set its ground with Paint: Walkable (water, ledge, blocked). Cliff pieces: the walkable foot is part of the piece.

### H1. Terrain features, sheet 1
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.

The objects, in reading order (left to right, top row first):
1. Coolant basin (5x4 tiles): basin with rails.
2. Bulkhead wall (4x3 tiles): wall with a walkable foot.
3. Bulkhead corner (3x3 tiles): corner.
4. Metal stairs (2x3 tiles): stairs.
5. Catwalk (5x2 tiles): catwalk.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### H2. Terrain features, sheet 2
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps.

The objects, in reading order (left to right, top row first):
1. One-way ledge (4x1 tiles): drop.
2. Pipe trench (4x2 tiles): trench.
3. Garden bed (3x2 tiles): bed.
4. Hatch to lower deck (3x3 tiles): hatch.
5. Hydro tank island (3x3 tiles): island in a tank.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## I. Walking townsfolk
One render per person. In Sprite Studio: 3 columns, 4 rows, order down, left, right, up. Then place them from People.

### Station Engineer
```
Walking sprite sheet for one Alienmon townsperson: Station Engineer, coveralls and a tool belt. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Lab Assistant
```
Walking sprite sheet for one Alienmon townsperson: Lab Assistant, a white coat and a tablet. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Hydroponics Gardener
```
Walking sprite sheet for one Alienmon townsperson: Hydroponics Gardener, gloves and a watering can. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Docking Pilot
```
Walking sprite sheet for one Alienmon townsperson: Docking Pilot, a flight suit and helmet under one arm. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Service Droid
```
Walking sprite sheet for one Alienmon townsperson: Service Droid, a friendly round droid. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Helix Grunt
```
Walking sprite sheet for one Alienmon townsperson: Helix Grunt, a grunt in a dark uniform with orange trim. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Freed Captive
```
Walking sprite sheet for one Alienmon townsperson: Freed Captive, a tired but hopeful person in a blanket. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Station Kid
```
Walking sprite sheet for one Alienmon townsperson: Station Kid, a kid with a toy rocket. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Helix Scientist
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Helix Scientist, a scientist with goggles. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Helix Enforcer
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Helix Enforcer, a tall enforcer with a visor. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Quartermaster
```
Walking sprite sheet for one Alienmon townsperson: Quartermaster, a clerk with a crate list. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Medic
```
Walking sprite sheet for one Alienmon townsperson: Medic, a medic with a kit. World: Helix Station, a space station run by the Helix organisation and Admin Vex, with labs, containment wings, hydroponics and captives being freed. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Materials: steel deck plate, white lab panels, glass tubes, cables, hazard tape, hydroponic glass. Motifs: the orange ringed-slash shape (as a plain shape, no letters), scanners, containment pods, warning lights, plants under grow lamps. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```
