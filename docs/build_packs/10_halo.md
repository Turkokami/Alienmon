# Halo: map builder prompt pack

A sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Keeper: the twin Keepers Echo and Iris.

- **Palette:** pastel pink, lavender, cloud white, crystal gold, sky blue
- **Materials:** white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone
- **Motifs:** wings, bells, kites, crystals, floating stones, waterfalls into clouds

**Attach to every render:** one finished Halo map from `art/sections_game/10_halo/` (a town for buildings and props, a route for terrain), so the art matches. For townsfolk attach `docs/npc_prompts/references/halo_style_reference.png` if it exists.

**Save renders as** `10_halo_<sheet>_<number>.png` (for example `10_halo_buildings_1.png`) and send a few at a time.

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
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds.

The objects, in reading order (left to right, top row first):
1. Marble sky cottage (4x3 tiles): white house with a gold dome.
2. Sky temple shrine (5x5 tiles): columns and a bell.
3. Airship dock house (5x4 tiles): house with a mooring mast.
4. Cloud chapel (5x5 tiles): chapel with stained glass (abstract).
5. Oracle library (6x4 tiles): library with a crystal dome.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each building complete with its roof and a clear front door at the bottom edge, set on no ground at all.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### A2. Buildings, sheet 2
```
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds.

The objects, in reading order (left to right, top row first):
1. Skyfarm barn (6x4 tiles): barn with a pink roof.
2. Windmill (3x5 tiles): windmill with sail blades.
3. Feather weaver workshop (4x3 tiles): workshop with hanging feathers.
4. Bell tower (3x5 tiles): tower.
5. Colosseum gate (6x4 tiles): marble gate.

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
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds.

The objects, in reading order (left to right, top row first):
1. Floating stone (1x1 tiles): small floating rock.
2. Crystal cluster (1x1 tiles): gold crystals.
3. Kite post (1x2 tiles): kite on a string.
4. Cloud bush (1x1 tiles): puffy pink bush.
5. Marble bench (2x1 tiles): bench.
6. Bell post (1x2 tiles): bell.
7. Flower arch (3x2 tiles): arch.
8. Wind chime (1x2 tiles): chime.
9. Sky lantern (1x2 tiles): lantern.
10. Fountain (2x2 tiles): fountain.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### B2. Outdoor props, sheet 2
```
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds.

The objects, in reading order (left to right, top row first):
1. Feather plant (1x1 tiles): plant.
2. Gold statue of wings (1x2 tiles): statue.
3. Hay bale (1x1 tiles): bale.
4. Cloud cotton plants (2x1 tiles): plants.
5. Airship mooring post (1x2 tiles): post.
6. Rainbow puddle (1x1 tiles): puddle.
7. Glider rack (2x1 tiles): gliders.
8. Planter urn (1x1 tiles): urn.
9. Blossom tree (2x3 tiles): tree.
10. Telescope (1x2 tiles): scope.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## C. Indoor furniture

### C1. Indoor furniture, sheet 1
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds.

The objects, in reading order (left to right, top row first):
1. Cloud bed (2x1 tiles): puffy bed.
2. Marble table (2x1 tiles): table.
3. Gold chairs (1x1 tiles): chairs.
4. Bookshelf of scrolls (2x1 tiles): shelf.
5. Prayer cushion row (2x1 tiles): cushions.
6. Crystal lamp (1x1 tiles): lamp.
7. Loom with feathers (2x2 tiles): loom.
8. Altar (2x1 tiles): altar.
9. Harp (1x2 tiles): harp.
10. Wardrobe (1x2 tiles): wardrobe.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### C2. Indoor furniture, sheet 2
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds.

The objects, in reading order (left to right, top row first):
1. Reading desk (2x1 tiles): desk.
2. Tea table (1x1 tiles): table.
3. Bird bath (1x1 tiles): bath.
4. Garden planter (2x1 tiles): planter.
5. Mirror (1x2 tiles): mirror.
6. Map of islands (2x1 tiles): map.
7. Bunk (2x2 tiles): bunk.
8. Kitchen (2x1 tiles): kitchen.
9. Shop counter (3x1 tiles): counter.
10. Recovery Bay bed (2x1 tiles): bed with a pink stripe.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## D. Signs, lights and markers
```
Sprite sheet of separate signs, lights and markers for the Alienmon map builder. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds.

The objects, in reading order (left to right, top row first):
1. Route signpost (1x1 tiles): marble post with blank boards.
2. Notice board (2x1 tiles): board.
3. Shop sign (1x1 tiles): feather shape.
4. Recovery Bay sign (1x1 tiles): pink cross.
5. Crystal lamp post (1x2 tiles): lamp.
6. Bell marker (1x1 tiles): bell.
7. Wind sock (1x2 tiles): sock.
8. Cloud edge rail (2x1 tiles): rail.
9. Wall sconce (1x1 tiles): sconce.
10. Banner pole (1x2 tiles): blank banner.

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
Sprite sheet of separate treasure chests, items lying on the ground and things that block a path for the Alienmon map builder. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds.

The objects, in reading order (left to right, top row first):
1. Treasure chest, closed (1x1 tiles): white chest with gold trim.
2. Same chest, open (1x1 tiles): lid up, empty.
3. Supply basket, closed (1x1 tiles): basket.
4. Locked way: energy fence (1x1 tiles): marble posts with a cyan field.
5. Locked way: crystal door (1x1 tiles): gold door.
6. Locked way: cloud bank (1x1 tiles): thick cloud wall.
7. Ground pickup sparkle (1x1 tiles): capsule on grass.
8. Hidden item in flowers (1x1 tiles): glint.
9. Key item: sky bell (1x1 tiles): small bell.
10. Key item: wind feather (1x1 tiles): feather.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each fits one tile (16 x 16 at map scale) except the locked ways, which are one tile wide and may stand a little taller.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## F. Turnaround sheets (one object, four facings)
For everything that looks different from the front, back and sides. In Sprite Studio tick **turn sheet**; on the map, select the prop and press **Turn** to switch facing. **Mirror** flips any prop left to right.

### F1. Marble bench and Cloud bed
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds.

Row 1: Marble bench (2x1 tiles): bench.
Row 2: Cloud bed (2x1 tiles): puffy bed.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F2. Gold chairs and Loom with feathers
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds.

Row 1: Gold chairs (1x1 tiles): chairs.
Row 2: Loom with feathers (2x2 tiles): loom.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F3. Harp and Reading desk
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds.

Row 1: Harp (1x2 tiles): harp.
Row 2: Reading desk (2x1 tiles): desk.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F4. Bunk and Shop counter
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds.

Row 1: Bunk (2x2 tiles): bunk.
Row 2: Shop counter (3x1 tiles): counter.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F5. Recovery Bay bed
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds.

Row 1: Recovery Bay bed (2x1 tiles): bed with a pink stripe.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## G. Ground textures (paint them in Paint: Terrain)
Upload each in Terrain under "From a seamless picture", give it the name and set Ground (walkable, tall grass, water, lava or blocked).

### Marble path
```
Seamless tileable top-down ground texture for the Alienmon map builder: Marble path, white marble tiles with gold seams. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Meadow
```
Seamless tileable top-down ground texture for the Alienmon map builder: Meadow, soft green with flowers. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Tall cloud grass (wild encounters)
```
Seamless tileable top-down ground texture for the Alienmon map builder: Tall cloud grass (wild encounters), tall pale grass. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Sky lagoon water
```
Seamless tileable top-down ground texture for the Alienmon map builder: Sky lagoon water, clear blue water. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Cloud floor
```
Seamless tileable top-down ground texture for the Alienmon map builder: Cloud floor, walkable cloud. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Garden soil
```
Seamless tileable top-down ground texture for the Alienmon map builder: Garden soil, soil. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

## H. Terrain features
Ponds, cliff pieces, stairs and bridges as separate pieces. After placing one, set its ground with Paint: Walkable (water, ledge, blocked). Cliff pieces: the walkable foot is part of the piece.

### H1. Terrain features, sheet 1
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds.

The objects, in reading order (left to right, top row first):
1. Lagoon (5x4 tiles): lagoon.
2. Island edge cliff (4x3 tiles): cliff edge over clouds with a walkable top.
3. Island edge corner (3x3 tiles): corner.
4. Marble stairs (2x3 tiles): stairs.
5. Cloud bridge (5x2 tiles): bridge.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### H2. Terrain features, sheet 2
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds.

The objects, in reading order (left to right, top row first):
1. One-way ledge (4x1 tiles): drop.
2. Waterfall edge (4x2 tiles): waterfall.
3. Flower bed (3x2 tiles): bed.
4. Crystal cave mouth (3x3 tiles): cave.
5. Floating islet (3x3 tiles): islet.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## I. Walking townsfolk
One render per person. In Sprite Studio: 3 columns, 4 rows, order down, left, right, up. Then place them from People.

### Sky Pilgrim
```
Walking sprite sheet for one Alienmon townsperson: Sky Pilgrim, a pilgrim with a staff and robe. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Cloud Farmer
```
Walking sprite sheet for one Alienmon townsperson: Cloud Farmer, a farmer with a basket of fluffy crops. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Wind Glider
```
Walking sprite sheet for one Alienmon townsperson: Wind Glider, a glider pilot with goggles. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Temple Bellringer
```
Walking sprite sheet for one Alienmon townsperson: Temple Bellringer, a ringer with a small bell. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Sky Postman
```
Walking sprite sheet for one Alienmon townsperson: Sky Postman, a postman with wings on the cap. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Kite Kid
```
Walking sprite sheet for one Alienmon townsperson: Kite Kid, a kid with a kite. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Starwatch Monk
```
Walking sprite sheet for one Alienmon townsperson: Starwatch Monk, a monk with a star chart. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Feather Weaver
```
Walking sprite sheet for one Alienmon townsperson: Feather Weaver, a weaver with feather cloth. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Glider Ace
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Glider Ace, an ace with a scarf. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Choir Twin
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Choir Twin, a singer in white. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Library Keeper
```
Walking sprite sheet for one Alienmon townsperson: Library Keeper, a keeper with scrolls. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Airship Captain
```
Walking sprite sheet for one Alienmon townsperson: Airship Captain, a captain with a long coat. World: Halo, a sky world of cloud spires, sky temples, floating farms and gardens, where waterfalls pour off islands into the clouds. Palette: pastel pink, lavender, cloud white, crystal gold, sky blue. Materials: white marble, gold trim, crystal, feathers, sailcloth, flower vines, cloud stone. Motifs: wings, bells, kites, crystals, floating stones, waterfalls into clouds. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```
