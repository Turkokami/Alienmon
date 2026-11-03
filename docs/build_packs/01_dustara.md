# Dustara: map builder prompt pack

A red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Keeper: the Dustara Keeper.

- **Palette:** sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim
- **Materials:** sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass
- **Motifs:** round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet

**Attach to every render:** one finished Dustara map from `art/sections_game/01_dustara/` (a town for buildings and props, a route for terrain), so the art matches. For townsfolk attach `docs/npc_prompts/references/dustara_style_reference.png` if it exists.

**Save renders as** `01_dustara_<sheet>_<number>.png` (for example `01_dustara_buildings_1.png`) and send a few at a time.

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
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet.

The objects, in reading order (left to right, top row first):
1. Domed adobe family home (4x3 tiles): round terracotta dome, arched wooden door, two round windows, a cactus in a clay pot by the step.
2. Two-dome cottage with a courtyard wall (6x4 tiles): two linked domes, a low adobe wall with a gate gap, laundry line.
3. Trading post with striped awning (6x4 tiles): flat-roofed adobe shop, orange and cream striped awning, crates and rugs out front, wide doorway.
4. Water tower and pump house (3x4 tiles): riveted copper tank on bleached-wood legs over a small adobe pump room.
5. Crater observatory annex (5x4 tiles): small adobe dome with a sliding roof slot and a brass telescope peeking out.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each building complete with its roof and a clear front door at the bottom edge, set on no ground at all.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### A2. Buildings, sheet 2
```
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet.

The objects, in reading order (left to right, top row first):
1. Courier relay hut (4x3 tiles): adobe hut with a rooftop signal mast and a satchel rack by the door.
2. Farmhouse with seedpod drying racks (6x4 tiles): long low adobe house, reed racks of drying alien seedpods along the side.
3. Canyon cliff dwelling front (5x4 tiles): doorway and two windows carved into a sandstone wall, wooden ladder, hanging lanterns.
4. Wind-pump workshop (5x4 tiles): adobe workshop with a big spinning wind pump on the roof and a work bench outside.
5. Coliseum gate arch (6x4 tiles): massive sandstone arch with banners (blank), stone steps up, torch bowls either side.

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
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet.

The objects, in reading order (left to right, top row first):
1. Barrel cactus cluster (1x1 tiles): three round cacti, one with a pink flower.
2. Tall branching cactus (1x2 tiles): saguaro-like alien cactus with violet tips.
3. Clay water urns (1x1 tiles): two big painted urns, turquoise bands.
4. Market rug stand (2x1 tiles): wooden frame with folded patterned rugs.
5. Spice sacks (2x1 tiles): open burlap sacks of red, yellow and violet spice.
6. Shade sail on poles (3x2 tiles): triangle of cream cloth stretched on bleached poles.
7. Adobe bench (2x1 tiles): smooth curved bench built into the wall line.
8. Crater-glass rock (1x1 tiles): dark rock with violet glowing glass crystals.
9. Wind chime post (1x2 tiles): post hung with copper tubes and turquoise beads.
10. Hitching rail with saddle bags (2x1 tiles): bleached rail, leather bags.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### B2. Outdoor props, sheet 2
```
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet.

The objects, in reading order (left to right, top row first):
1. Well with pulley (2x2 tiles): round sandstone well, wooden pulley, rope bucket.
2. Seedpod husk pile (1x1 tiles): cracked empty alien seedpod shells, faint glow inside.
3. Dune grass tufts (1x1 tiles): pale gold grass clumps.
4. Bleached creature bones (2x1 tiles): big curved rib bones half in sand.
5. Courier mailbox (1x1 tiles): round adobe mailbox with a copper flag.
6. Fire pit with stones (1x1 tiles): ring of stones, embers.
7. Cart of melons (2x1 tiles): wooden hand cart piled with striped desert melons.
8. Potted agave trio (1x1 tiles): three terracotta pots with spiky blue plants.
9. Sandstone boulder pair (2x1 tiles): two layered red boulders.
10. Lantern string between posts (3x1 tiles): bleached posts with warm paper lanterns.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## C. Indoor furniture

### C1. Indoor furniture, sheet 1
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet.

The objects, in reading order (left to right, top row first):
1. Round adobe hearth (2x2 tiles): built-in clay oven with a curved chimney.
2. Low wooden table with woven mat (2x1 tiles): table set with clay cups.
3. Floor cushions (1x1 tiles): two striped cushions.
4. Hammock bed (2x1 tiles): woven hammock between two posts.
5. Clay shelf niche (2x1 tiles): wall niche shelves with pots and a small cactus.
6. Water jar stand (1x1 tiles): tall jar in a wooden stand with a ladle.
7. Star chart desk (2x1 tiles): desk covered in rolled star maps and a brass lens.
8. Seedpod incubator crate (1x1 tiles): padded crate with a softly glowing pod.
9. Woven storage baskets (1x1 tiles): three lidded baskets.
10. Loom with half-woven rug (2x2 tiles): wooden loom, colourful rug.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### C2. Indoor furniture, sheet 2
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet.

The objects, in reading order (left to right, top row first):
1. Kitchen counter with clay pots (3x1 tiles): adobe counter, hanging peppers.
2. Shop counter with scale (3x1 tiles): wooden counter, brass balance scale.
3. Wall rug (2x1 tiles): hanging rug with geometric canyon pattern.
4. Reading chair (1x1 tiles): bleached-wood chair with a sheepskin-like throw.
5. Bunk bed (2x2 tiles): wooden bunk with patterned blankets.
6. Telescope on tripod (1x2 tiles): brass telescope by a window.
7. Display case of crater glass (2x1 tiles): glass case with violet glowing shards.
8. Copper washbasin (1x1 tiles): basin on a stand, towel.
9. Plant shelf ladder (1x2 tiles): ladder shelf of succulents.
10. Recovery Bay bench (2x1 tiles): clean white bench with turquoise cushions.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## D. Signs, lights and markers
```
Sprite sheet of separate signs, lights and markers for the Alienmon map builder. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet.

The objects, in reading order (left to right, top row first):
1. Route signpost (1x1 tiles): bleached wood post with two blank arrow boards.
2. Notice board (2x1 tiles): adobe-framed board with pinned blank papers.
3. Shop hanging sign (1x1 tiles): round copper sign with a simple pot shape.
4. Recovery Bay sign (1x1 tiles): turquoise sign with a white plus-like cross shape.
5. Street lantern (1x2 tiles): copper lantern on a bleached post, warm light.
6. Torch bowl (1x1 tiles): sandstone bowl with a flame.
7. Crater warning marker (1x1 tiles): striped post with a violet light on top.
8. Trail cairn (1x1 tiles): stacked flat stones with a ribbon.
9. Wall lamp (1x1 tiles): small copper wall lamp.
10. Welcome arch sign board (3x1 tiles): blank wooden board on two posts.

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
Sprite sheet of separate treasure chests, items lying on the ground and things that block a path for the Alienmon map builder. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet.

The objects, in reading order (left to right, top row first):
1. Treasure chest, closed (1x1 tiles): bleached wood chest with copper bands and a turquoise stud.
2. Same chest, open (1x1 tiles): lid up, empty inside.
3. Supply crate, closed (1x1 tiles): courier crate with rope handles.
4. Locked way: energy fence (1x1 tiles): two sandstone posts with a humming cyan field between.
5. Locked way: canyon gate (1x1 tiles): heavy wooden gate with copper bands.
6. Locked way: rockslide (1x1 tiles): pile of red boulders across a path.
7. Ground pickup sparkle (1x1 tiles): small capsule lying in sand with a glint.
8. Buried item mound (1x1 tiles): small mound of disturbed sand with a glint.
9. Key item: crater-glass key (1x1 tiles): violet glowing shard on a copper ring.
10. Key item: courier pass (1x1 tiles): stamped leather tag.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each fits one tile (16 x 16 at map scale) except the locked ways, which are one tile wide and may stand a little taller.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## F. Turnaround sheets (one object, four facings)
For everything that looks different from the front, back and sides. In Sprite Studio tick **turn sheet**; on the map, select the prop and press **Turn** to switch facing. **Mirror** flips any prop left to right.

### F1. Adobe bench and Cart of melons
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet.

Row 1: Adobe bench (2x1 tiles): smooth curved bench built into the wall line.
Row 2: Cart of melons (2x1 tiles): wooden hand cart piled with striped desert melons.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F2. Hammock bed and Star chart desk
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet.

Row 1: Hammock bed (2x1 tiles): woven hammock between two posts.
Row 2: Star chart desk (2x1 tiles): desk covered in rolled star maps and a brass lens.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F3. Loom with half-woven rug and Kitchen counter with clay pots
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet.

Row 1: Loom with half-woven rug (2x2 tiles): wooden loom, colourful rug.
Row 2: Kitchen counter with clay pots (3x1 tiles): adobe counter, hanging peppers.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F4. Shop counter with scale and Reading chair
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet.

Row 1: Shop counter with scale (3x1 tiles): wooden counter, brass balance scale.
Row 2: Reading chair (1x1 tiles): bleached-wood chair with a sheepskin-like throw.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F5. Bunk bed and Recovery Bay bench
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet.

Row 1: Bunk bed (2x2 tiles): wooden bunk with patterned blankets.
Row 2: Recovery Bay bench (2x1 tiles): clean white bench with turquoise cushions.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## G. Ground textures (paint them in Paint: Terrain)
Upload each in Terrain under "From a seamless picture", give it the name and set Ground (walkable, tall grass, water, lava or blocked).

### Packed canyon path
```
Seamless tileable top-down ground texture for the Alienmon map builder: Packed canyon path, packed terracotta sand with small pebbles and wheel ruts. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Sage scrub ground
```
Seamless tileable top-down ground texture for the Alienmon map builder: Sage scrub ground, dry sage-green tufts on gold sand. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Tall desert grass (wild encounters)
```
Seamless tileable top-down ground texture for the Alienmon map builder: Tall desert grass (wild encounters), dense tall gold and sage grass, clearly taller than path. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Oasis water
```
Seamless tileable top-down ground texture for the Alienmon map builder: Oasis water, clear turquoise water with gentle ripples. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Sandstone plaza tiles
```
Seamless tileable top-down ground texture for the Alienmon map builder: Sandstone plaza tiles, warm sandstone flagstones with thin grout. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Crater glass flats
```
Seamless tileable top-down ground texture for the Alienmon map builder: Crater glass flats, dark sand with scattered violet glass glints. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

## H. Terrain features
Ponds, cliff pieces, stairs and bridges as separate pieces. After placing one, set its ground with Paint: Walkable (water, ledge, blocked). Cliff pieces: the walkable foot is part of the piece.

### H1. Terrain features, sheet 1
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet.

The objects, in reading order (left to right, top row first):
1. Oasis pond (5x4 tiles): round turquoise pond with reeds and a sandy rim.
2. Mesa cliff face, straight (4x3 tiles): red layered cliff wall with a walkable sandy foot.
3. Mesa cliff corner (3x3 tiles): outside corner of the same cliff.
4. Canyon stairs (2x3 tiles): sandstone steps cut into a cliff.
5. Rope bridge over a ravine (5x2 tiles): plank rope bridge.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### H2. Terrain features, sheet 2
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet.

The objects, in reading order (left to right, top row first):
1. One-way ledge (4x1 tiles): low sandstone drop the player can hop down.
2. Dry riverbed (4x2 tiles): cracked clay channel with smooth stones.
3. Cactus garden bed (3x2 tiles): raised bed of mixed cacti.
4. Crater rim slice (4x3 tiles): curved rim of glassy dark rock with violet glow.
5. Boulder field (3x2 tiles): scattered red boulders with walkable gaps.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## I. Walking townsfolk
One render per person. In Sprite Studio: 3 columns, 4 rows, order down, left, right, up. Then place them from People.

### Canyon Courier
```
Walking sprite sheet for one Alienmon townsperson: Canyon Courier, a quick courier with a satchel, goggles up, scarf blowing. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Crater Stargazer
```
Walking sprite sheet for one Alienmon townsperson: Crater Stargazer, a dreamy stargazer in a long dusty coat with a brass spyglass. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Dune Farmer
```
Walking sprite sheet for one Alienmon townsperson: Dune Farmer, a farmer in a wide straw hat carrying a seedpod basket. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Spice Vendor
```
Walking sprite sheet for one Alienmon townsperson: Spice Vendor, a cheerful vendor with a striped apron and spice pouches. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Sand Ranger
```
Walking sprite sheet for one Alienmon townsperson: Sand Ranger, a ranger in a sand-coloured cloak with a walking staff. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Seedpod Hunter
```
Walking sprite sheet for one Alienmon townsperson: Seedpod Hunter, an eager kid with a net and a glowing pod in a jar. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Mesa Mechanic
```
Walking sprite sheet for one Alienmon townsperson: Mesa Mechanic, a mechanic in overalls with a wrench and a copper toolbelt. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Desert Elder
```
Walking sprite sheet for one Alienmon townsperson: Desert Elder, a kind elder with a shawl and a carved cane. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Canyon Hiker
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Canyon Hiker, a sturdy hiker with a big backpack and rope coil. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Dust Racer
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Dust Racer, a racer kid with a scarf, goggles and a hover-scooter tucked under one arm. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trading Post Clerk
```
Walking sprite sheet for one Alienmon townsperson: Trading Post Clerk, a clerk in a vest with a ledger and a pencil behind the ear. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Observatory Assistant
```
Walking sprite sheet for one Alienmon townsperson: Observatory Assistant, a young assistant carrying rolled star charts. World: Dustara, a red desert canyon frontier where the story begins: domed adobe homes, a crater observatory, a busy trading post and the crater where the first seedpods fell. Palette: sand gold, terracotta, sage green, dusty violet, sunset orange, turquoise trim. Materials: sun-baked adobe, terracotta tile, sandstone blocks, bleached wood, woven reed shade cloth, copper fittings, turquoise glass. Motifs: round domes, arched doorways, striped awnings, wind chimes, cactus gardens, crater-glass shards that glow faint violet. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```
