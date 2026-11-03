# Glyphos: map builder prompt pack

A jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Keeper: the Glyphos Keeper.

- **Palette:** sandstone beige, faded turquoise, moss green, glowing gold, jungle teal
- **Materials:** carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes
- **Motifs:** glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins

**Attach to every render:** one finished Glyphos map from `art/sections_game/06_glyphos/` (a town for buildings and props, a route for terrain), so the art matches. For townsfolk attach `docs/npc_prompts/references/glyphos_style_reference.png` if it exists.

**Save renders as** `06_glyphos_<sheet>_<number>.png` (for example `06_glyphos_buildings_1.png`) and send a few at a time.

| Section | Sheets | Goes into the editor through |
|---|---|---|
| A. Buildings | 2 | Tools: Sprite Studio, Props (Solid rows = how deep the building is) |
| B. Outdoor props | 2 | Sprite Studio, Props |
| C. Indoor furniture | 2 | Sprite Studio, Props |
| D. Signs, lights and markers | 1 | Sprite Studio, Props |
| E. Chests, pickups and locked ways | 1 | Sprite Studio, Props (place them with Place: Items, untick "draw a chest") |
| F. Turnaround sheets | 3 | Sprite Studio with "turn sheet" ticked, then Turn on a placed prop |
| G. Ground textures | 6 | Paint: Terrain, "From a seamless picture" |
| H. Terrain features | 2 | Sprite Studio, Props, then Walkable for the ground |
| I. Walking townsfolk | 12 | Sprite Studio (3 columns, 4 rows, order down, left, right, up), People |


## A. Buildings
One building per cell; doorways sized for a person about 1 tile wide. In Sprite Studio type the first building's width in tiles.

### A1. Buildings, sheet 1
```
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins.

The objects, in reading order (left to right, top row first):
1. Dig camp tent (4x3 tiles): canvas tent with rope lines.
2. HQ tent with awning (6x4 tiles): big tent with tables under an awning.
3. Ruined shrine (4x4 tiles): stepped shrine with glowing glyphs.
4. Temple facade (6x5 tiles): columned temple front with a dark doorway.
5. Bamboo lookout (3x5 tiles): lookout tower.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each building complete with its roof and a clear front door at the bottom edge, set on no ground at all.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### A2. Buildings, sheet 2
```
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins.

The objects, in reading order (left to right, top row first):
1. Archivist hut (4x3 tiles): stone hut with scroll racks.
2. Supply depot (5x4 tiles): crates under a tarp roof.
3. Chime tower (3x5 tiles): tower hung with brass chimes.
4. Mural wall house (5x3 tiles): house built into a mural wall.
5. Sunken arch (5x4 tiles): arch half in water.

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
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins.

The objects, in reading order (left to right, top row first):
1. Broken pillar (1x2 tiles): cracked column with vines.
2. Fallen statue head (2x2 tiles): stone head, calm face, moss.
3. Glyph stone (1x1 tiles): block with glowing glyphs.
4. Chime post (1x2 tiles): post with brass chimes.
5. Dig site grid (3x2 tiles): roped grid with tools.
6. Wheelbarrow of soil (2x1 tiles): barrow.
7. Sieve frame (2x1 tiles): sifting frame.
8. Relic crate (1x1 tiles): padded crate.
9. Camp fire with pot (1x1 tiles): fire.
10. Jungle fern (1x1 tiles): fern.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### B2. Outdoor props, sheet 2
```
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins.

The objects, in reading order (left to right, top row first):
1. Vine-wrapped urn (1x1 tiles): urn.
2. Stone brazier (1x1 tiles): brazier with gold flame.
3. Bamboo fence (2x1 tiles): fence.
4. Rope ladder (1x2 tiles): ladder.
5. Turquoise tile fragments (1x1 tiles): broken tiles.
6. Tall jungle tree (2x3 tiles): tree with roots.
7. Water lily ruin pool (2x2 tiles): small pool.
8. Map table (2x1 tiles): table with maps.
9. Lantern pole (1x2 tiles): lantern.
10. Stone steps fragment (2x1 tiles): loose steps.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## C. Indoor furniture

### C1. Indoor furniture, sheet 1
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins.

The objects, in reading order (left to right, top row first):
1. Camp cot (2x1 tiles): cot.
2. Folding table with relics (2x1 tiles): table.
3. Scroll rack (2x1 tiles): rack.
4. Mural panel (2x1 tiles): painted panel (abstract).
5. Stone altar (2x1 tiles): altar with glyphs.
6. Chime frame (2x1 tiles): frame of chimes.
7. Brass telescope (1x2 tiles): scope.
8. Pottery shelf (2x1 tiles): shelf of pots.
9. Lantern table (1x1 tiles): small table.
10. Supply shelves (2x1 tiles): shelves.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### C2. Indoor furniture, sheet 2
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins.

The objects, in reading order (left to right, top row first):
1. Rug with glyph border (2x2 tiles): rug.
2. Copy desk (2x1 tiles): desk with paper and brushes.
3. Display plinth (1x1 tiles): plinth with a relic.
4. Stone bench (2x1 tiles): bench.
5. Cook station (2x1 tiles): camp stove.
6. Bookshelf (2x1 tiles): books.
7. Glowing crystal font (1x1 tiles): font.
8. Shrine statue (1x2 tiles): calm statue.
9. Shop counter (3x1 tiles): crate counter.
10. Recovery tent bed (2x1 tiles): canvas bed with a turquoise stripe.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## D. Signs, lights and markers
```
Sprite sheet of separate signs, lights and markers for the Alienmon map builder. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins.

The objects, in reading order (left to right, top row first):
1. Route signpost (1x1 tiles): bamboo post with blank boards.
2. Notice board (2x1 tiles): board.
3. Shop sign (1x1 tiles): hanging trowel shape.
4. Recovery sign (1x1 tiles): turquoise cross shape.
5. Torch post (1x2 tiles): torch.
6. Glyph lamp (1x1 tiles): glowing glyph stone.
7. Survey flag (1x1 tiles): flag on a stick.
8. Rope barrier (2x1 tiles): rope between stakes.
9. Wall sconce (1x1 tiles): sconce.
10. Chime marker (1x1 tiles): small chime.

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
Sprite sheet of separate treasure chests, items lying on the ground and things that block a path for the Alienmon map builder. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins.

The objects, in reading order (left to right, top row first):
1. Treasure chest, closed (1x1 tiles): carved stone coffer with turquoise inlay.
2. Same chest, open (1x1 tiles): lid aside, empty.
3. Supply crate, closed (1x1 tiles): dig camp crate.
4. Locked way: energy fence (1x1 tiles): stone posts with a cyan field.
5. Locked way: glyph door (1x1 tiles): stone door with dim glyphs.
6. Locked way: vine curtain (1x1 tiles): thick vines.
7. Ground pickup sparkle (1x1 tiles): capsule on moss with a glint.
8. Buried item mound (1x1 tiles): dig-spot mound.
9. Key item: glyph tablet (1x1 tiles): small carved tablet.
10. Key item: chime key (1x1 tiles): brass chime key.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each fits one tile (16 x 16 at map scale) except the locked ways, which are one tile wide and may stand a little taller.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## F. Turnaround sheets (one object, four facings)
For everything that looks different from the front, back and sides. In Sprite Studio tick **turn sheet**; on the map, select the prop and press **Turn** to switch facing. **Mirror** flips any prop left to right.

### F1. Wheelbarrow of soil and Camp cot
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins.

Row 1: Wheelbarrow of soil (2x1 tiles): barrow.
Row 2: Camp cot (2x1 tiles): cot.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F2. Copy desk and Stone bench
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins.

Row 1: Copy desk (2x1 tiles): desk with paper and brushes.
Row 2: Stone bench (2x1 tiles): bench.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F3. Shop counter and Recovery tent bed
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins.

Row 1: Shop counter (3x1 tiles): crate counter.
Row 2: Recovery tent bed (2x1 tiles): canvas bed with a turquoise stripe.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## G. Ground textures (paint them in Paint: Terrain)
Upload each in Terrain under "From a seamless picture", give it the name and set Ground (walkable, tall grass, water, lava or blocked).

### Jungle dirt path
```
Seamless tileable top-down ground texture for the Alienmon map builder: Jungle dirt path, brown path with leaves. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Ruin flagstones
```
Seamless tileable top-down ground texture for the Alienmon map builder: Ruin flagstones, cracked sandstone with moss. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Tall jungle grass (wild encounters)
```
Seamless tileable top-down ground texture for the Alienmon map builder: Tall jungle grass (wild encounters), tall dense green grass. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Shallow ruin water
```
Seamless tileable top-down ground texture for the Alienmon map builder: Shallow ruin water, turquoise water over tiles. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Mossy ground
```
Seamless tileable top-down ground texture for the Alienmon map builder: Mossy ground, moss with ferns. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Sand dig ground
```
Seamless tileable top-down ground texture for the Alienmon map builder: Sand dig ground, sifted sand with string lines. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

## H. Terrain features
Ponds, cliff pieces, stairs and bridges as separate pieces. After placing one, set its ground with Paint: Walkable (water, ledge, blocked). Cliff pieces: the walkable foot is part of the piece.

### H1. Terrain features, sheet 1
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins.

The objects, in reading order (left to right, top row first):
1. Ruin pool (5x4 tiles): pool with sunken tiles.
2. Ruin wall (4x3 tiles): wall with a walkable foot.
3. Ruin wall corner (3x3 tiles): corner.
4. Temple stairs (2x3 tiles): steps.
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
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins.

The objects, in reading order (left to right, top row first):
1. One-way ledge (4x1 tiles): stone drop.
2. Collapsed column line (4x2 tiles): columns.
3. Fern bed (3x2 tiles): ferns.
4. Grotto mouth (3x3 tiles): cave mouth.
5. Ruin islet (3x3 tiles): island with a pillar.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## I. Walking townsfolk
One render per person. In Sprite Studio: 3 columns, 4 rows, order down, left, right, up. Then place them from People.

### Archaeologist
```
Walking sprite sheet for one Alienmon townsperson: Archaeologist, wide hat and a brush. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Mural Copyist
```
Walking sprite sheet for one Alienmon townsperson: Mural Copyist, easel and paints. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Chime Keeper
```
Walking sprite sheet for one Alienmon townsperson: Chime Keeper, a robe with chimes. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Dig Camp Cook
```
Walking sprite sheet for one Alienmon townsperson: Dig Camp Cook, a cook with a ladle. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Relic Porter
```
Walking sprite sheet for one Alienmon townsperson: Relic Porter, a porter with a padded crate. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Rune Scholar
```
Walking sprite sheet for one Alienmon townsperson: Rune Scholar, glasses and scrolls. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Jungle Guide
```
Walking sprite sheet for one Alienmon townsperson: Jungle Guide, a guide with a machete-free walking stick and map. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Ruins Kid
```
Walking sprite sheet for one Alienmon townsperson: Ruins Kid, a kid with a toy trowel. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Ruin Climber
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Ruin Climber, a climber with chalk and rope. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Field Student
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Field Student, a student with a notebook. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Supply Clerk
```
Walking sprite sheet for one Alienmon townsperson: Supply Clerk, a clerk with a crate list. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Temple Warden
```
Walking sprite sheet for one Alienmon townsperson: Temple Warden, a warden in turquoise robes. World: Glyphos, a jungle world of ancient Ystran ruins, temples, murals and singing chimes, studied by the Dig Camp. Palette: sandstone beige, faded turquoise, moss green, glowing gold, jungle teal. Materials: carved sandstone, turquoise inlay, vines, canvas tents, rope, bamboo, brass chimes. Motifs: glowing glyphs (abstract, not letters), chimes, stepped pyramids, murals, dig tools, tidal pools in ruins. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```
