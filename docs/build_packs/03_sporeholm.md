# Sporeholm: map builder prompt pack

A misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Keeper: Keeper Dr. Lysa Moor, a botanist.

- **Palette:** neon lime, violet, moss green, deep teal, firefly yellow, mushroom red
- **Materials:** living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts
- **Motifs:** glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots

**Attach to every render:** one finished Sporeholm map from `art/sections_game/03_sporeholm/` (a town for buildings and props, a route for terrain), so the art matches. For townsfolk attach `docs/npc_prompts/references/sporeholm_style_reference.png` if it exists.

**Save renders as** `03_sporeholm_<sheet>_<number>.png` (for example `03_sporeholm_buildings_1.png`) and send a few at a time.

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
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots.

The objects, in reading order (left to right, top row first):
1. Mushroom-cap cottage (4x4 tiles): violet cap roof with glowing spots, round door in the stem.
2. Stilt house over the bog (5x4 tiles): wooden house on stilts, ladder down, lantern by the door.
3. Herbalist hut (4x3 tiles): moss-roofed hut with drying herb bundles and jars.
4. Spore lab dome (5x4 tiles): glass greenhouse dome with mushrooms growing inside.
5. Root-arch gate house (5x4 tiles): house built into a giant arching root.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each building complete with its roof and a clear front door at the bottom edge, set on no ground at all.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### A2. Buildings, sheet 2
```
Sprite sheet of separate building exteriors for the Alienmon map builder. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots.

The objects, in reading order (left to right, top row first):
1. Choir amphitheatre stage (6x4 tiles): curved stage under a huge mushroom canopy.
2. Tall toadstool tower home (3x5 tiles): stack of mushroom caps with windows.
3. Lily-pad dock shed (4x3 tiles): boat shed on a big lily pad platform.
4. Firefly lantern workshop (4x3 tiles): hut with jar lanterns in every window.
5. Marsh farmstead barn (6x4 tiles): woven-vine barn with a mushroom-cap roof.

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
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots.

The objects, in reading order (left to right, top row first):
1. Glowcap cluster (1x1 tiles): three small cyan glowing mushrooms.
2. Giant red toadstool (2x2 tiles): big red cap with white spots, no face.
3. Lily pad pair (1x1 tiles): floating pads with a pink bloom.
4. Cattail reeds (1x1 tiles): swamp reeds.
5. Spore puffball (1x1 tiles): round puffball letting out a little spore cloud.
6. Root stool (1x1 tiles): stump seat with moss.
7. Jar lantern on a hook (1x2 tiles): firefly jar on a bent pole.
8. Vine rope fence (2x1 tiles): twisted root posts with vine rope.
9. Herb drying rack (2x1 tiles): rack of herb bundles.
10. Mushroom planter box (2x1 tiles): box of mixed mushrooms.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### B2. Outdoor props, sheet 2
```
Sprite sheet of separate outdoor props for the Alienmon map builder. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots.

The objects, in reading order (left to right, top row first):
1. Fallen hollow log (2x1 tiles): log with moss and tiny mushrooms.
2. Bog stepping stones (2x1 tiles): flat mossy stones in water.
3. Glowing fern (1x1 tiles): fern with luminous tips.
4. Choir bell mushroom (1x2 tiles): bell-shaped mushroom that hums (sound lines faint).
5. Root arch (3x2 tiles): small arch of roots to walk under.
6. Spore sample stand (1x1 tiles): stand with glass tubes.
7. Moss boulder (1x1 tiles): rock covered in moss.
8. Fishing net on poles (2x1 tiles): net drying on poles.
9. Rowboat (2x1 tiles): small wooden rowboat.
10. Hanging moss curtain (2x1 tiles): moss hanging from a branch.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## C. Indoor furniture

### C1. Indoor furniture, sheet 1
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots.

The objects, in reading order (left to right, top row first):
1. Mushroom-stem table (2x1 tiles): table on a thick mushroom stem.
2. Cap stools (1x1 tiles): two small cap stools.
3. Moss bed (2x1 tiles): bed of moss in a root frame.
4. Herb shelf (2x1 tiles): shelf of jars and dried herbs.
5. Brewing cauldron (1x1 tiles): small pot over glowing coals.
6. Spore microscope desk (2x1 tiles): brass microscope and slides.
7. Specimen jar wall (2x1 tiles): shelf of glowing specimen jars.
8. Root wardrobe (1x2 tiles): wardrobe carved in root wood.
9. Hanging jar chandelier (1x1 tiles): cluster of firefly jars.
10. Woven rug (2x2 tiles): round woven rug with mushroom pattern.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### C2. Indoor furniture, sheet 2
```
Sprite sheet of separate indoor furniture and room objects for the Alienmon map builder. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots.

The objects, in reading order (left to right, top row first):
1. Greenhouse planter rows (3x1 tiles): planters of seedlings.
2. Reading nook (2x1 tiles): cushioned root bench with books.
3. Choir robe rack (1x1 tiles): robes on a stand.
4. Bog fisher gear corner (1x1 tiles): waders, net, bucket.
5. Kitchen hearth (2x1 tiles): clay hearth with a mushroom stew pot.
6. Shop counter (3x1 tiles): root-wood counter with jars.
7. Potted giant fern (1x1 tiles): fern in a pot.
8. Bunk beds in a cap (2x2 tiles): bunks in a hollow mushroom.
9. Lab sink (1x1 tiles): stone sink with a pump.
10. Recovery Bay bed (2x1 tiles): soft white bed with a lime stripe.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## D. Signs, lights and markers
```
Sprite sheet of separate signs, lights and markers for the Alienmon map builder. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots.

The objects, in reading order (left to right, top row first):
1. Route signpost (1x1 tiles): twisted root post with blank boards.
2. Notice board (2x1 tiles): moss-framed board.
3. Shop sign (1x1 tiles): hanging jar-shaped sign.
4. Recovery Bay sign (1x1 tiles): round lime sign with a white cross shape.
5. Firefly lamp post (1x2 tiles): post with a big firefly jar.
6. Glowcap path light (1x1 tiles): short glowing mushroom marker.
7. Bog depth marker (1x2 tiles): striped stick in water.
8. Choir banner pole (1x2 tiles): pole with a blank violet banner.
9. Wall jar lamp (1x1 tiles): small wall jar.
10. Trail ribbon (1x1 tiles): ribbon tied to a reed.

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
Sprite sheet of separate treasure chests, items lying on the ground and things that block a path for the Alienmon map builder. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots.

The objects, in reading order (left to right, top row first):
1. Treasure chest, closed (1x1 tiles): root-wood chest with a mushroom-cap lid.
2. Same chest, open (1x1 tiles): lid up, empty.
3. Supply basket, closed (1x1 tiles): lidded woven basket.
4. Locked way: energy fence (1x1 tiles): root posts with a cyan field.
5. Locked way: thorn vine wall (1x1 tiles): thick thorny vines across a path.
6. Locked way: giant fallen cap (1x1 tiles): collapsed mushroom cap blocking the way.
7. Ground pickup sparkle (1x1 tiles): capsule in moss with fireflies.
8. Buried item in moss (1x1 tiles): glint under a moss patch.
9. Key item: lantern of the marsh (1x1 tiles): old jar lantern with a gold lid.
10. Key item: choir reed (1x1 tiles): carved reed whistle.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each fits one tile (16 x 16 at map scale) except the locked ways, which are one tile wide and may stand a little taller.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## F. Turnaround sheets (one object, four facings)
For everything that looks different from the front, back and sides. In Sprite Studio tick **turn sheet**; on the map, select the prop and press **Turn** to switch facing. **Mirror** flips any prop left to right.

### F1. Rowboat and Moss bed
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots.

Row 1: Rowboat (2x1 tiles): small wooden rowboat.
Row 2: Moss bed (2x1 tiles): bed of moss in a root frame.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F2. Spore microscope desk and Shop counter
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots.

Row 1: Spore microscope desk (2x1 tiles): brass microscope and slides.
Row 2: Shop counter (3x1 tiles): root-wood counter with jars.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### F3. Bunk beds in a cap and Recovery Bay bed
```
Turnaround sheet for the Alienmon map builder: each row shows ONE object four times, turned to face four ways. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots.

Row 1: Bunk beds in a cap (2x2 tiles): bunks in a hollow mushroom.
Row 2: Recovery Bay bed (2x1 tiles): soft white bed with a lime stripe.

Columns, left to right, the same in every row: 1 facing down (front, toward the camera), 2 facing up (seen from behind), 3 facing left, 4 facing right. Keep the object identical in every column (same size, colours, wear and details), only turned; its base sits on the same line across the row.
View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## G. Ground textures (paint them in Paint: Terrain)
Upload each in Terrain under "From a seamless picture", give it the name and set Ground (walkable, tall grass, water, lava or blocked).

### Sandy marsh path
```
Seamless tileable top-down ground texture for the Alienmon map builder: Sandy marsh path, pale sand with grass tufts and pebbles. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Moss carpet
```
Seamless tileable top-down ground texture for the Alienmon map builder: Moss carpet, soft deep-green moss with tiny glowing dots. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Tall glow grass (wild encounters)
```
Seamless tileable top-down ground texture for the Alienmon map builder: Tall glow grass (wild encounters), dense tall teal grass with glowing seed heads. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Bog water
```
Seamless tileable top-down ground texture for the Alienmon map builder: Bog water, dark teal water with lily pads and glints. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Root-tangled ground
```
Seamless tileable top-down ground texture for the Alienmon map builder: Root-tangled ground, brown earth with crossing roots. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

### Mycelium floor
```
Seamless tileable top-down ground texture for the Alienmon map builder: Mycelium floor, pale glowing thread patterns on dark soil. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots.
Seen straight from above, even lighting with no shadows cast across it, no objects, no paths or edges, nothing that would show as a repeating shape. The left edge must continue into the right edge and the top into the bottom.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
No text, no emblems. Square canvas 1024x1024.
```

## H. Terrain features
Ponds, cliff pieces, stairs and bridges as separate pieces. After placing one, set its ground with Paint: Walkable (water, ledge, blocked). Cliff pieces: the walkable foot is part of the piece.

### H1. Terrain features, sheet 1
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots.

The objects, in reading order (left to right, top row first):
1. Lily pond (5x4 tiles): dark pond with lily pads and a mossy bank.
2. Mushroom forest wall (4x3 tiles): dense wall of giant stems with a walkable foot.
3. Mushroom forest corner (3x3 tiles): corner of the same wall.
4. Root stairs (2x3 tiles): steps of roots.
5. Plank boardwalk (5x2 tiles): stilt boardwalk over water.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

### H2. Terrain features, sheet 2
```
Sprite sheet of separate terrain features (map pieces) for the Alienmon map builder. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots.

The objects, in reading order (left to right, top row first):
1. One-way ledge (4x1 tiles): mossy drop.
2. Stepping-stone crossing (4x2 tiles): stones across water.
3. Glowcap patch (3x2 tiles): bed of glowing mushrooms.
4. Hollow tree tunnel (3x3 tiles): giant hollow root to walk through.
5. Bog islet (3x3 tiles): small grassy island in water.

View: three-quarter top-down, the same camera as the Alienmon maps (you see the top and the front face of each object). Scale: one map tile is a 16 x 16 pixel square and a person is about 1 tile wide and 1.5 tiles tall; the footprint after each object is in tiles.
Background: one flat pure magenta #FF00FF, edge to edge. Every object stands alone with wide empty magenta space around it, nothing touching, no ground patch or cast shadow on the background (a small contact shadow right under an object is fine).
Each piece is a small patch of this world's ground with the feature on it, the patch edges fading softly to magenta.
Style: detailed modern pixel art matching the attached Alienmon map exactly: the same pixel density, palette mood, dark outlines, soft cel shading and light from the top left. Original designs only, not resembling Pokemon or any existing game.
Rules: no text, letters or numbers anywhere (signs and screens stay blank or show simple shapes); no logos or emblems; no ball-shaped capture devices and no red-and-white spheres; no people or creatures unless asked.
Canvas 1536x1024, landscape.
```

## I. Walking townsfolk
One render per person. In Sprite Studio: 3 columns, 4 rows, order down, left, right, up. Then place them from People.

### Mushroom Forager
```
Walking sprite sheet for one Alienmon townsperson: Mushroom Forager, a mossy cloak and a basket of glowing caps. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Spore-mask Researcher
```
Walking sprite sheet for one Alienmon townsperson: Spore-mask Researcher, a rebreather mask and sample vials. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Bog Fisher
```
Walking sprite sheet for one Alienmon townsperson: Bog Fisher, tall waders and a dripping net. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Swamp Herbalist
```
Walking sprite sheet for one Alienmon townsperson: Swamp Herbalist, herb bundles hanging from the belt. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Firefly Lantern Kid
```
Walking sprite sheet for one Alienmon townsperson: Firefly Lantern Kid, a jar lantern of green fireflies. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Moss Ranger
```
Walking sprite sheet for one Alienmon townsperson: Moss Ranger, a cloak of living leaves and a carved staff. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Stilt-house Builder
```
Walking sprite sheet for one Alienmon townsperson: Stilt-house Builder, rope coils and a plank on one shoulder. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Spore Choir Singer
```
Walking sprite sheet for one Alienmon townsperson: Spore Choir Singer, a long robe with spore patterns. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Bog Wader
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Bog Wader, a wader with a pole and a frog-green raincoat. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Trainer: Glowcap Picker
```
Walking sprite sheet for one Alienmon townsperson: Trainer: Glowcap Picker, a picker with a glowing headband. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Herbal Shopkeeper
```
Walking sprite sheet for one Alienmon townsperson: Herbal Shopkeeper, an apron covered in pockets of seeds. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```

### Choir Conductor
```
Walking sprite sheet for one Alienmon townsperson: Choir Conductor, a tall conductor with a baton of reed. World: Sporeholm, a misty glowing swamp of giant mushrooms and stilt villages around Mirefen, where the Spore Choir sings to the marsh. Palette: neon lime, violet, moss green, deep teal, firefly yellow, mushroom red. Materials: living mushroom caps, twisted root wood, woven vine rope, moss, glass jars, lily pads, stilts. Motifs: glowing gills, fireflies in jars, spore puffs, stilt walkways, lily pads, curling roots. Dress them for this world so they clearly belong here.

Layout: 3 columns x 4 rows of equal cells. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. The whole body in every frame, feet on the same line, the same height in every frame, nothing touching a cell edge.
Match the attached reference sprites exactly: chibi proportions (head about one third of the height), bold dark outline, soft cel shading, bright readable colours, the same size as the player.
Background: one flat pure magenta #FF00FF. No text, no emblems, no ball-shaped capture devices, nothing held like a weapon. Original design, not resembling Pokemon or any existing game.
Canvas 1024x1024.
```
