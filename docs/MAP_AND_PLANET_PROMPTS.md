# ALIENMON — Map, Planet & Universe Prompt Pack

Every image prompt for the game's places in one file: the full universe map for flying the ship, the Molten Frontier world map, shared space objects, and 7 prompts for each of the 14 planets.

**How to use with ChatGPT**
1. Upload `Alienmon_Story_Bible_for_ChatGPT.md` first, then this file.
2. Say: *"Use the Alienmon bibles. Render prompt [number]."* Or paste a prompt block directly.
3. Make one image per message. If a result drifts off-style, reply: *"Match the Alienmon style blocks exactly and try again."*

**Sizes the game expects**
| Asset | Size | Notes |
| --- | --- | --- |
| Walkable town / scene | 1536×1024 (3:2) | No characters. Becomes a painted walkable map like Dustmere and Skyreach Plaza. |
| Large region / world map | 1536×1024 delivered as 6 sections (3 across × 2 down, 512×512 each) | Same format as the Molten Frontier. Ask ChatGPT for the full image, then ask it to split it into the 6 sections. |
| Universe map | 1536×1024 in 6 sections | See Part 1. |
| Battle background | 1536×1024 | Open ground lower left and upper right. |
| Planet sprite, buildings, ship | 1024×1024 | Pure white #FFFFFF background so it can be cut out. |

**Scale rule for walkable maps:** keep characters out of the picture, but size every doorway, stair and path so a small character about 1/9 of the image height could walk through. Matching scale across maps keeps your player the same size everywhere.

---

## PART 1 — THE ENTIRE GAME UNIVERSE (ship flight map)

The big map you fly the ship across between planets. Render **1-A** as the main map. **1-B** gives the same map with no planets, for a cleaner game background. **1-C** gives a labeled reference copy for planning only (don't use it in the game).

### 1-A · Kessler System universe map (main)
**Size:** 1536×1024, then split into 6 sections (3×2, 512×512 each)
```
A complete top-down pixel-art star map of the Kessler star system, the whole game universe seen from above, used as the flight map a small starship travels across. Center: a warm golden star with soft corona rings. Around it, faint glowing orbit lines connect 14 distinct planets placed across the map like stops on a journey, each clearly different in color and texture:
1 Dustara: orange-red desert world with mesas and a faint purple crater glow (near the center-left, the starting world).
2 Ferrox: rust-orange and steel-gray scrapyard world with metal debris rings.
3 Sporeholm: teal and green bioluminescent fungal jungle world with glowing spots.
4 Thalassa: turquoise ocean world with tiny islands and a thin water-ice ring.
5 Neonis: dark purple city world glowing with neon cyan and magenta lights on its night side.
6 Glyphos: jade-green world with ancient carved stone patterns and sunken ruins.
7 Pyros: black volcanic world cracked with glowing lava rivers.
8 Glacia: pale blue and white ice world with aurora ribbons at its poles.
9 Helix Station: a large dark-steel ring-shaped space station with glowing orange power cores and an orange ringed-slash emblem shape (no text), orbiting a small moon.
10 Halo: a cluster of floating sky islands wrapped in clouds and waterfalls, surrounded by a halo ring.
11 Umbra: a dark violet world with a black sinkhole and drifting broken rocks.
12 Starfall Rift: a desert moon with a huge cracked crater whose center opens into a swirling purple-black vortex.
13 Apex Array: a mountain-peak world crowned with a giant telescope and broadcast towers, starlight beams.
14 Ystra: far out past the Rift, a shattered ancient home world in floating fragments with crystal forests, lit by a dim dying red sun.
Also include: a glittering asteroid belt between the inner and outer planets, soft violet and teal nebula clouds, distant galaxies, comets, and at the far right edge a huge ancient ring-shaped Warp Gate of dark stone with glowing cyan and pink energy (dormant, the doorway to future star systems). Open space between planets so a ship can fly freely. Deep indigo space background with layered starfields. No text, no labels, no ships, no characters.
```
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
### 1-B · Universe map background (no planets)
**Size:** 1536×1024, 6 sections
```
The same Kessler System star map as before but with NO planets and NO station: only the central golden star with corona rings, faint empty orbit lines, the asteroid belt, violet and teal nebula clouds, distant galaxies, comets, layered starfields and the dormant ring-shaped Warp Gate at the far right edge. Leave clear open patches along the orbit lines where planets will be placed by the game. No text, no labels, no ships.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```

### 1-C · Labeled universe map (reference copy only)
**Size:** 1536×1024
```
Render the Kessler System universe map from before again, identical layout, and add small clean pixel-font labels next to each planet: Dustara, Ferrox, Sporeholm, Thalassa, Neonis, Glyphos, Pyros, Glacia, Helix Station, Halo, Umbra, Starfall Rift, Apex Array, Ystra, and the Warp Gate. Labels on dark rounded plates with cyan borders. This copy is a reference map, so text is allowed.
```

### 1-D · Ship flight sprite (top-down)
**Size:** 1024×1024, white background
```
The player's small starship seen from directly above for a space flight map: sleek white-and-cream hull, teal glass cockpit dome, swept fins, two glowing magenta-pink engine pods at the back with a short pink thrust glow. Nose pointing up. Clean silhouette that reads at small size. Centered on a pure flat white #FFFFFF background, no shadow.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```

---

## PART 2 — WORLD MAP: THE MOLTEN FRONTIER (current) + expansions

The Molten Frontier is already in the game. Use **2-A** to re-render it or to make a matching neighbor map, and **2-B / 2-C** to make new world maps in the same format.

### 2-A · Molten Frontier (reference description)
**Size:** 1536×1024 as 6 sections
```
A large top-down 3/4 pixel-art region map called the Molten Frontier: the west third is a turquoise sea with dark basalt sea stacks, a palm-covered harbor village island (Port Ember) with a long wooden dock and a moored ferry boat, a second palm island with a small Recovery Hut, and a south pier to a tiny sandbar. A long rope bridge crosses to the mainland. The east two-thirds is a volcanic ridge of dark purple obsidian cliffs covered in red and orange alien flowers, with winding sand trails, stone stairs, three cave tunnel mouths, lava waterfalls and lava rivers, iron bridges with glowing orange lamp posts, and at the top a huge black-steel Helix forge fortress with an orange ringed-slash emblem (shape only), a stone plaza and landing pad, a satellite relay dish on a side platform, a lantern-lit Forge Gate on a lower trail, and a second landing pad on a platform over the lava in the lower right.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```

### 2-B · New neighbor region (east of the Molten Frontier)
**Size:** 1536×1024 as 6 sections
```
A large top-down 3/4 pixel-art region map that continues EAST of the Molten Frontier: on the left edge the lava ridge and iron bridges taper off into cooling black rock and ash fields, transitioning across the map into frosty highlands with blue crystal outcrops, pine trees dusted with snow, frozen waterfalls and an aurora-lit ice village on the right side. Include winding trails, stone stairs, two cave tunnel mouths, a small Recovery Bay dome with a cyan cross-light, a frozen lake crossed by a wooden bridge, and a cliffside Relay Tower with a glowing beacon. Settled places use the recurring Alienmon look: cream and sandstone dome buildings with glowing cyan windows and light strips, brass and gold trim, purple banners with a gold ringed-planet emblem, tall cyan lamp posts, red-and-yellow striped market awnings, crates with cyan lights.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```

### 2-C · New neighbor region (south: the Bioluminescent Wilds)
**Size:** 1536×1024 as 6 sections
```
A large top-down 3/4 pixel-art region map SOUTH of the Molten Frontier: the top edge starts with red-flowered volcanic cliffs and a turquoise coastline, giving way to a vast bioluminescent jungle of giant teal and purple glowing mushrooms, twisting roots, misty rivers with rope bridges, glowing spore pools, a treetop village on wooden platforms, a mossy temple ruin with carved alien murals, two cave tunnel mouths, a Recovery Bay dome, and a sandy beach with a dock in one corner. Settled places use the recurring Alienmon look: cream and sandstone dome buildings with glowing cyan windows and light strips, brass and gold trim, purple banners with a gold ringed-planet emblem, tall cyan lamp posts, red-and-yellow striped market awnings, crates with cyan lights.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```

---

## PART 3 — SHARED SPACE & TECH OBJECTS
### 3-A · Warp Gate (dormant)
**Size:** 1024×1024, white background
```
A huge ancient ring-shaped Warp Gate floating in space, built from dark alien stone and metal segments with faint dormant cyan and pink runes around the inner rim and an empty dark center. Centered on a pure flat white #FFFFFF background.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
### 3-B · Warp Gate (activated)
**Size:** 1024×1024, white background
```
The same ancient ring-shaped Warp Gate fully activated: bright cyan and pink energy racing around the rim and a swirling shimmering portal in the center showing distant unknown stars. Centered on a pure flat white #FFFFFF background.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
### 3-C · Space backdrop (tileable)
**Size:** 1536×1024
```
A deep-space backdrop of the Kessler system: dark indigo space, layered starfields, soft violet and teal nebula clouds, a distant bright star. Tileable left to right. No planets, no ships.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
### 3-D · Asteroid set
**Size:** 1024×1024, white background
```
A sprite sheet of 9 separate floating space rocks for a flight map on a 3×3 grid: small, medium and large asteroids in dark purple, rusty brown and icy blue, some with glowing crystal veins. Even spacing on a pure flat white #FFFFFF background.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
### 3-E · Helix patrol ship
**Size:** 1024×1024, white background
```
A sleek angular Helix Directive patrol ship seen from above: black and dark-steel hull, glowing orange engine lines, an orange ringed-slash emblem shape on the wings (no text). Nose pointing up. Centered on a pure flat white #FFFFFF background.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
### 3-F · Landing pad
**Size:** 1024×1024, white background
```
A small round starship landing pad seen top-down 3/4: metal deck plates, a glowing orange landing ring, cyan edge lights and short hazard stripes, as one sprite on a pure flat white #FFFFFF background.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
### 3-G · Recovery Bay exterior
**Size:** 1024×1024, white background
```
A Recovery Bay healing center building, top-down 3/4 RPG sprite: cream sandstone dome with glowing cyan windows, a cyan cross-light above an arched door, brass trim, a purple banner with a gold ringed-planet emblem. Whole building visible on a pure flat white #FFFFFF background.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
### 3-H · Ship cockpit view (launch cutscene)
**Size:** 1536×1024
```
Inside the cockpit of the player's small starship looking out the curved teal glass canopy at the Kessler system: glowing cyan control panels, a holographic star map, a small saucer-shaped Alienmon companion floating by the dash, a ringed purple gas giant and stars outside. Cozy, adventurous. No text.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```

---

## PART 4 — THE 14 PLANETS (7 prompts each)

Every planet has these prompts:
- **a · Planet sprite:** the planet as seen in space.
- **b · Landing / key art:** the scene shown when you land.
- **c · Battle background.**
- **d · Walkable town map:** the main town.
- **e · Walkable region map:** large, delivered as 6 sections.
- **f · Relay Tower / landmark building.**
- **g · Interior:** the Keeper's tower arena.

### 01 · Dustara
- **World:** a sunbaked crater-rim desert world at late afternoon
- **Look:** red-orange mesas, cracked sandstone flats, tall cacti, and golden drift grass whose dry blades crackle with tiny blue static sparks; the enormous Starfall Crater sits on the horizon with a faint purple glow
- **Sky:** a dusty violet-to-peach gradient sky with two small moons
- **Palette:** sand gold, terracotta, sage green, dusty violet
- **Town:** Dustmere, a sunset canyon town of cream sandstone dome homes with glowing cyan windows, purple banners with a gold ringed-planet emblem, a domed Recovery Bay, a striped-awning market stall, rope-and-steel bridges over lava-fall canyons, and cactus gardens
- **Landmark:** the Crater Observatory: a white domed observatory with a huge telescope on a cliff edge, pointed at the stars, with a small lab annex
- **Mood:** hopeful, warm, the place every journey starts  ·  **Keeper:** none  ·  **Wild levels:** 2–5

**01a · Planet sprite** (1024×1024, white background)
```
A single round planet floating in space seen from orbit: Dustara, a sunbaked crater-rim desert world at late afternoon. Surface colors sand gold, terracotta, sage green, dusty violet, with visible features hinting at red-orange mesas. Lit from the top left with a dark crescent shadow on the lower right, a thin atmosphere glow. Centered, filling about 70% of the frame, on a pure flat white #FFFFFF background. No stars, no background.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**01b · Landing / key art** (1536×1024)
```
A sweeping establishing shot of Dustara, a sunbaked crater-rim desert world at late afternoon: red-orange mesas, cracked sandstone flats, tall cacti, and golden drift grass whose dry blades crackle with tiny blue static sparks; the enormous Starfall Crater sits on the horizon with a faint purple glow. Sky: a dusty violet-to-peach gradient sky with two small moons. In the middle distance: Dustmere, a sunset canyon town of cream sandstone dome homes with glowing cyan windows, purple banners with a gold ringed-planet emblem, a domed Recovery Bay, a striped-awning market stall, rope-and-steel bridges over lava-fall canyons, and cactus gardens. Palette: sand gold, terracotta, sage green, dusty violet. Mood: hopeful, warm, the place every journey starts. The player's small white-and-cream starship with magenta-pink engines is gliding in to land. No people visible.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**01c · Battle background** (1536×1024)
```
A battle background for Dustara: a wide landscape view of red-orange mesas, cracked sandstone flats, tall cacti, and golden drift grass whose dry blades crackle with tiny blue static sparks; the enormous Starfall Crater sits on the horizon with a faint purple glow. Sky: a dusty violet-to-peach gradient sky with two small moons. Leave flat open ground in the lower left and a raised natural platform in the upper right where two creatures will stand. Palette: sand gold, terracotta, sage green, dusty violet. No creatures, no people, no text.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**01d · Walkable town map** (1536×1024)
```
A walkable top-down 3/4 pixel-art town map on Dustara: Dustmere, a sunset canyon town of cream sandstone dome homes with glowing cyan windows, purple banners with a gold ringed-planet emblem, a domed Recovery Bay, a striped-awning market stall, rope-and-steel bridges over lava-fall canyons, and cactus gardens. Surroundings: red-orange mesas, cracked sandstone flats, tall cacti, and golden drift grass whose dry blades crackle with tiny blue static sparks; the enormous Starfall Crater sits on the horizon with a faint purple glow. Include a Recovery Bay dome with a cyan cross-light, a striped-awning shop stall, a central plaza, several homes, a path leading off the bottom edge toward the landing pad, and the entrance to the planet's Relay Tower near the top. Palette: sand gold, terracotta, sage green, dusty violet. Settled places use the recurring Alienmon look: cream and sandstone dome buildings with glowing cyan windows and light strips, brass and gold trim, purple banners with a gold ringed-planet emblem, tall cyan lamp posts, red-and-yellow striped market awnings, crates with cyan lights.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**01e · Walkable region map** (1536×1024 as 6 sections)
```
A large walkable top-down 3/4 pixel-art region map of Dustara, a sunbaked crater-rim desert world at late afternoon: red-orange mesas, cracked sandstone flats, tall cacti, and golden drift grass whose dry blades crackle with tiny blue static sparks; the enormous Starfall Crater sits on the horizon with a faint purple glow. Include winding trails and stairs, patches of glowing drift grass where wild Alienmon hide, two cave or tunnel mouths, a small outpost with a Recovery Bay dome, a landing pad near one edge, the planet's landmark (the Crater Observatory: a white domed observatory with a huge telescope on a cliff edge, pointed at the stars, with a small lab annex), and natural obstacles from this biome. Palette: sand gold, terracotta, sage green, dusty violet. Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**01f · Relay Tower / landmark building** (1024×1024, white background)
```
A single building sprite in top-down 3/4 RPG perspective: the Crater Observatory: a white domed observatory with a huge telescope on a cliff edge, pointed at the stars, with a small lab annex. Built in the style of Dustara (sand gold, terracotta, sage green, dusty violet), with a glowing Relay Tower beacon on top and a clear front entrance. Whole building visible, centered on a pure flat white #FFFFFF background, no ground scenery.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**01g · Keeper arena interior** (1536×1024)
```
The interior battle arena inside the Relay Tower on Dustara, top-down 3/4 view: a large floor marked with a glowing battle ring, themed decorations reflecting red-orange mesas, the Keeper's raised platform at the top, the entrance door at the bottom, glowing cyan relay machinery humming along the walls. Palette: sand gold, terracotta, sage green, dusty violet. No characters.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```

### 02 · Ferrox
- **World:** a rust-colored scrapyard planet
- **Look:** towering mountains of scrap metal, derelict locomotives on a rusted rail yard, swinging cranes, sparks from welding, pipes and gears half buried in red dirt; drift grass is wiry metallic weeds with copper tips
- **Sky:** a hazy smog-orange sky with drifting smokestack plumes
- **Palette:** rust orange, steel gray, copper, oily teal accents
- **Town:** Rustvale, a shanty town of corrugated-metal shacks and converted rail cars
- **Landmark:** Hank Briggs's Relay Tower: a tall radio mast welded together from scrap metal, girders and old train parts, glowing orange beacon lights at the top
- **Mood:** gritty, industrial, hardworking  ·  **Keeper:** Hank Briggs  ·  **Wild levels:** 5–10

**02a · Planet sprite** (1024×1024, white background)
```
A single round planet floating in space seen from orbit: Ferrox, a rust-colored scrapyard planet. Surface colors rust orange, steel gray, copper, oily teal accents, with visible features hinting at towering mountains of scrap metal. Lit from the top left with a dark crescent shadow on the lower right, a thin atmosphere glow. Centered, filling about 70% of the frame, on a pure flat white #FFFFFF background. No stars, no background.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**02b · Landing / key art** (1536×1024)
```
A sweeping establishing shot of Ferrox, a rust-colored scrapyard planet: towering mountains of scrap metal, derelict locomotives on a rusted rail yard, swinging cranes, sparks from welding, pipes and gears half buried in red dirt; drift grass is wiry metallic weeds with copper tips. Sky: a hazy smog-orange sky with drifting smokestack plumes. In the middle distance: Rustvale, a shanty town of corrugated-metal shacks and converted rail cars. Palette: rust orange, steel gray, copper, oily teal accents. Mood: gritty, industrial, hardworking. The player's small white-and-cream starship with magenta-pink engines is gliding in to land. No people visible.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**02c · Battle background** (1536×1024)
```
A battle background for Ferrox: a wide landscape view of towering mountains of scrap metal, derelict locomotives on a rusted rail yard, swinging cranes, sparks from welding, pipes and gears half buried in red dirt; drift grass is wiry metallic weeds with copper tips. Sky: a hazy smog-orange sky with drifting smokestack plumes. Leave flat open ground in the lower left and a raised natural platform in the upper right where two creatures will stand. Palette: rust orange, steel gray, copper, oily teal accents. No creatures, no people, no text.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**02d · Walkable town map** (1536×1024)
```
A walkable top-down 3/4 pixel-art town map on Ferrox: Rustvale, a shanty town of corrugated-metal shacks and converted rail cars. Surroundings: towering mountains of scrap metal, derelict locomotives on a rusted rail yard, swinging cranes, sparks from welding, pipes and gears half buried in red dirt; drift grass is wiry metallic weeds with copper tips. Include a Recovery Bay dome with a cyan cross-light, a striped-awning shop stall, a central plaza, several homes, a path leading off the bottom edge toward the landing pad, and the entrance to the planet's Relay Tower near the top. Palette: rust orange, steel gray, copper, oily teal accents. Settled places use the recurring Alienmon look: cream and sandstone dome buildings with glowing cyan windows and light strips, brass and gold trim, purple banners with a gold ringed-planet emblem, tall cyan lamp posts, red-and-yellow striped market awnings, crates with cyan lights.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**02e · Walkable region map** (1536×1024 as 6 sections)
```
A large walkable top-down 3/4 pixel-art region map of Ferrox, a rust-colored scrapyard planet: towering mountains of scrap metal, derelict locomotives on a rusted rail yard, swinging cranes, sparks from welding, pipes and gears half buried in red dirt; drift grass is wiry metallic weeds with copper tips. Include winding trails and stairs, patches of glowing drift grass where wild Alienmon hide, two cave or tunnel mouths, a small outpost with a Recovery Bay dome, a landing pad near one edge, the planet's landmark (Hank Briggs's Relay Tower: a tall radio mast welded together from scrap metal, girders and old train parts, glowing orange beacon lights at the top), and natural obstacles from this biome. Palette: rust orange, steel gray, copper, oily teal accents. Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**02f · Relay Tower / landmark building** (1024×1024, white background)
```
A single building sprite in top-down 3/4 RPG perspective: Hank Briggs's Relay Tower: a tall radio mast welded together from scrap metal, girders and old train parts, glowing orange beacon lights at the top. Built in the style of Ferrox (rust orange, steel gray, copper, oily teal accents), with a glowing Relay Tower beacon on top and a clear front entrance. Whole building visible, centered on a pure flat white #FFFFFF background, no ground scenery.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**02g · Keeper arena interior** (1536×1024)
```
The interior battle arena inside the Relay Tower on Ferrox, top-down 3/4 view: a large floor marked with a glowing battle ring, themed decorations reflecting towering mountains of scrap metal, the Keeper's raised platform at the top, the entrance door at the bottom, glowing cyan relay machinery humming along the walls. Palette: rust orange, steel gray, copper, oily teal accents. No characters.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```

### 03 · Sporeholm
- **World:** a glowing fungal swamp world at twilight
- **Look:** giant bioluminescent mushrooms with glowing gills, twisted mangrove roots, still black water with glowing lily pads, purple-green fog and floating spores; drift grass is soft glowing moss reeds
- **Sky:** a deep teal twilight sky seen through a canopy of mushroom caps
- **Palette:** neon lime, violet, moss green, deep teal
- **Town:** Mirefen, a stilt village of wooden huts on mushroom stalks connected by rope bridges
- **Landmark:** Dr. Lysa Moor's Relay Tower: a research mast overgrown with glowing fungus and vines, with a glass greenhouse lab at its base
- **Mood:** mysterious, magical, a little eerie  ·  **Keeper:** Dr. Lysa Moor  ·  **Wild levels:** 9–14

**03a · Planet sprite** (1024×1024, white background)
```
A single round planet floating in space seen from orbit: Sporeholm, a glowing fungal swamp world at twilight. Surface colors neon lime, violet, moss green, deep teal, with visible features hinting at giant bioluminescent mushrooms with glowing gills. Lit from the top left with a dark crescent shadow on the lower right, a thin atmosphere glow. Centered, filling about 70% of the frame, on a pure flat white #FFFFFF background. No stars, no background.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**03b · Landing / key art** (1536×1024)
```
A sweeping establishing shot of Sporeholm, a glowing fungal swamp world at twilight: giant bioluminescent mushrooms with glowing gills, twisted mangrove roots, still black water with glowing lily pads, purple-green fog and floating spores; drift grass is soft glowing moss reeds. Sky: a deep teal twilight sky seen through a canopy of mushroom caps. In the middle distance: Mirefen, a stilt village of wooden huts on mushroom stalks connected by rope bridges. Palette: neon lime, violet, moss green, deep teal. Mood: mysterious, magical, a little eerie. The player's small white-and-cream starship with magenta-pink engines is gliding in to land. No people visible.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**03c · Battle background** (1536×1024)
```
A battle background for Sporeholm: a wide landscape view of giant bioluminescent mushrooms with glowing gills, twisted mangrove roots, still black water with glowing lily pads, purple-green fog and floating spores; drift grass is soft glowing moss reeds. Sky: a deep teal twilight sky seen through a canopy of mushroom caps. Leave flat open ground in the lower left and a raised natural platform in the upper right where two creatures will stand. Palette: neon lime, violet, moss green, deep teal. No creatures, no people, no text.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**03d · Walkable town map** (1536×1024)
```
A walkable top-down 3/4 pixel-art town map on Sporeholm: Mirefen, a stilt village of wooden huts on mushroom stalks connected by rope bridges. Surroundings: giant bioluminescent mushrooms with glowing gills, twisted mangrove roots, still black water with glowing lily pads, purple-green fog and floating spores; drift grass is soft glowing moss reeds. Include a Recovery Bay dome with a cyan cross-light, a striped-awning shop stall, a central plaza, several homes, a path leading off the bottom edge toward the landing pad, and the entrance to the planet's Relay Tower near the top. Palette: neon lime, violet, moss green, deep teal. Settled places use the recurring Alienmon look: cream and sandstone dome buildings with glowing cyan windows and light strips, brass and gold trim, purple banners with a gold ringed-planet emblem, tall cyan lamp posts, red-and-yellow striped market awnings, crates with cyan lights.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**03e · Walkable region map** (1536×1024 as 6 sections)
```
A large walkable top-down 3/4 pixel-art region map of Sporeholm, a glowing fungal swamp world at twilight: giant bioluminescent mushrooms with glowing gills, twisted mangrove roots, still black water with glowing lily pads, purple-green fog and floating spores; drift grass is soft glowing moss reeds. Include winding trails and stairs, patches of glowing drift grass where wild Alienmon hide, two cave or tunnel mouths, a small outpost with a Recovery Bay dome, a landing pad near one edge, the planet's landmark (Dr. Lysa Moor's Relay Tower: a research mast overgrown with glowing fungus and vines, with a glass greenhouse lab at its base), and natural obstacles from this biome. Palette: neon lime, violet, moss green, deep teal. Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**03f · Relay Tower / landmark building** (1024×1024, white background)
```
A single building sprite in top-down 3/4 RPG perspective: Dr. Lysa Moor's Relay Tower: a research mast overgrown with glowing fungus and vines, with a glass greenhouse lab at its base. Built in the style of Sporeholm (neon lime, violet, moss green, deep teal), with a glowing Relay Tower beacon on top and a clear front entrance. Whole building visible, centered on a pure flat white #FFFFFF background, no ground scenery.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**03g · Keeper arena interior** (1536×1024)
```
The interior battle arena inside the Relay Tower on Sporeholm, top-down 3/4 view: a large floor marked with a glowing battle ring, themed decorations reflecting giant bioluminescent mushrooms with glowing gills, the Keeper's raised platform at the top, the entrance door at the bottom, glowing cyan relay machinery humming along the walls. Palette: neon lime, violet, moss green, deep teal. No characters.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```

### 04 · Thalassa
- **World:** a ringed ocean world of islands
- **Look:** turquoise shallows over coral reefs, white sand islands, sea-grass dunes for drift grass, wooden piers, tide pools, and fishing boats; planetary rings arc across the sky
- **Sky:** a bright sea-blue sky with soft fog banks rolling in and the planet's pale rings overhead
- **Palette:** turquoise, ocean blue, sand cream, weathered wood brown
- **Town:** Port Saltreach, a fog-bound harbor town of wooden docks, net sheds and crooked stilt houses
- **Landmark:** Captain Delia Marsh's Relay Tower: a lighthouse-style tower on a rocky point with a rotating signal beacon and an anchor emblem
- **Mood:** breezy, adventurous, salty  ·  **Keeper:** Captain Delia Marsh  ·  **Wild levels:** 13–18

**04a · Planet sprite** (1024×1024, white background)
```
A single round planet floating in space seen from orbit: Thalassa, a ringed ocean world of islands. Surface colors turquoise, ocean blue, sand cream, weathered wood brown, with visible features hinting at turquoise shallows over coral reefs. Lit from the top left with a dark crescent shadow on the lower right, a thin atmosphere glow. Centered, filling about 70% of the frame, on a pure flat white #FFFFFF background. No stars, no background.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**04b · Landing / key art** (1536×1024)
```
A sweeping establishing shot of Thalassa, a ringed ocean world of islands: turquoise shallows over coral reefs, white sand islands, sea-grass dunes for drift grass, wooden piers, tide pools, and fishing boats; planetary rings arc across the sky. Sky: a bright sea-blue sky with soft fog banks rolling in and the planet's pale rings overhead. In the middle distance: Port Saltreach, a fog-bound harbor town of wooden docks, net sheds and crooked stilt houses. Palette: turquoise, ocean blue, sand cream, weathered wood brown. Mood: breezy, adventurous, salty. The player's small white-and-cream starship with magenta-pink engines is gliding in to land. No people visible.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**04c · Battle background** (1536×1024)
```
A battle background for Thalassa: a wide landscape view of turquoise shallows over coral reefs, white sand islands, sea-grass dunes for drift grass, wooden piers, tide pools, and fishing boats; planetary rings arc across the sky. Sky: a bright sea-blue sky with soft fog banks rolling in and the planet's pale rings overhead. Leave flat open ground in the lower left and a raised natural platform in the upper right where two creatures will stand. Palette: turquoise, ocean blue, sand cream, weathered wood brown. No creatures, no people, no text.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**04d · Walkable town map** (1536×1024)
```
A walkable top-down 3/4 pixel-art town map on Thalassa: Port Saltreach, a fog-bound harbor town of wooden docks, net sheds and crooked stilt houses. Surroundings: turquoise shallows over coral reefs, white sand islands, sea-grass dunes for drift grass, wooden piers, tide pools, and fishing boats; planetary rings arc across the sky. Include a Recovery Bay dome with a cyan cross-light, a striped-awning shop stall, a central plaza, several homes, a path leading off the bottom edge toward the landing pad, and the entrance to the planet's Relay Tower near the top. Palette: turquoise, ocean blue, sand cream, weathered wood brown. Settled places use the recurring Alienmon look: cream and sandstone dome buildings with glowing cyan windows and light strips, brass and gold trim, purple banners with a gold ringed-planet emblem, tall cyan lamp posts, red-and-yellow striped market awnings, crates with cyan lights.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**04e · Walkable region map** (1536×1024 as 6 sections)
```
A large walkable top-down 3/4 pixel-art region map of Thalassa, a ringed ocean world of islands: turquoise shallows over coral reefs, white sand islands, sea-grass dunes for drift grass, wooden piers, tide pools, and fishing boats; planetary rings arc across the sky. Include winding trails and stairs, patches of glowing drift grass where wild Alienmon hide, two cave or tunnel mouths, a small outpost with a Recovery Bay dome, a landing pad near one edge, the planet's landmark (Captain Delia Marsh's Relay Tower: a lighthouse-style tower on a rocky point with a rotating signal beacon and an anchor emblem), and natural obstacles from this biome. Palette: turquoise, ocean blue, sand cream, weathered wood brown. Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**04f · Relay Tower / landmark building** (1024×1024, white background)
```
A single building sprite in top-down 3/4 RPG perspective: Captain Delia Marsh's Relay Tower: a lighthouse-style tower on a rocky point with a rotating signal beacon and an anchor emblem. Built in the style of Thalassa (turquoise, ocean blue, sand cream, weathered wood brown), with a glowing Relay Tower beacon on top and a clear front entrance. Whole building visible, centered on a pure flat white #FFFFFF background, no ground scenery.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**04g · Keeper arena interior** (1536×1024)
```
The interior battle arena inside the Relay Tower on Thalassa, top-down 3/4 view: a large floor marked with a glowing battle ring, themed decorations reflecting turquoise shallows over coral reefs, the Keeper's raised platform at the top, the entrance door at the bottom, glowing cyan relay machinery humming along the walls. Palette: turquoise, ocean blue, sand cream, weathered wood brown. No characters.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```

### 05 · Neonis
- **World:** a neon city planet at night
- **Look:** rain-slick streets, glowing neon signs with abstract symbols (no readable text), holographic billboards, humming power plant turbines, cables strung between towers; drift grass is glowing fiber-optic grass in rooftop parks
- **Sky:** a dark indigo night sky lit magenta by the city glow
- **Palette:** magenta, electric cyan, indigo, hot yellow
- **Town:** Neonis Starport and Galactic City: a floating metal landing deck with an orange landing ring, neon signs, holograms, stairs up to the Keeper tower, a purple ringed gas giant in the sky
- **Landmark:** DJ Static's Relay Tower: a radio tower covered in LED rigs, speakers and a rooftop DJ booth broadcasting pirate radio, with sound-wave light patterns
- **Mood:** electric, loud, alive  ·  **Keeper:** DJ Static  ·  **Wild levels:** 17–22

**05a · Planet sprite** (1024×1024, white background)
```
A single round planet floating in space seen from orbit: Neonis, a neon city planet at night. Surface colors magenta, electric cyan, indigo, hot yellow, with visible features hinting at rain-slick streets. Lit from the top left with a dark crescent shadow on the lower right, a thin atmosphere glow. Centered, filling about 70% of the frame, on a pure flat white #FFFFFF background. No stars, no background.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**05b · Landing / key art** (1536×1024)
```
A sweeping establishing shot of Neonis, a neon city planet at night: rain-slick streets, glowing neon signs with abstract symbols (no readable text), holographic billboards, humming power plant turbines, cables strung between towers; drift grass is glowing fiber-optic grass in rooftop parks. Sky: a dark indigo night sky lit magenta by the city glow. In the middle distance: Neonis Starport and Galactic City: a floating metal landing deck with an orange landing ring, neon signs, holograms, stairs up to the Keeper tower, a purple ringed gas giant in the sky. Palette: magenta, electric cyan, indigo, hot yellow. Mood: electric, loud, alive. The player's small white-and-cream starship with magenta-pink engines is gliding in to land. No people visible.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**05c · Battle background** (1536×1024)
```
A battle background for Neonis: a wide landscape view of rain-slick streets, glowing neon signs with abstract symbols (no readable text), holographic billboards, humming power plant turbines, cables strung between towers; drift grass is glowing fiber-optic grass in rooftop parks. Sky: a dark indigo night sky lit magenta by the city glow. Leave flat open ground in the lower left and a raised natural platform in the upper right where two creatures will stand. Palette: magenta, electric cyan, indigo, hot yellow. No creatures, no people, no text.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**05d · Walkable town map** (1536×1024)
```
A walkable top-down 3/4 pixel-art town map on Neonis: Neonis Starport and Galactic City: a floating metal landing deck with an orange landing ring, neon signs, holograms, stairs up to the Keeper tower, a purple ringed gas giant in the sky. Surroundings: rain-slick streets, glowing neon signs with abstract symbols (no readable text), holographic billboards, humming power plant turbines, cables strung between towers; drift grass is glowing fiber-optic grass in rooftop parks. Include a Recovery Bay dome with a cyan cross-light, a striped-awning shop stall, a central plaza, several homes, a path leading off the bottom edge toward the landing pad, and the entrance to the planet's Relay Tower near the top. Palette: magenta, electric cyan, indigo, hot yellow. Settled places use the recurring Alienmon look: cream and sandstone dome buildings with glowing cyan windows and light strips, brass and gold trim, purple banners with a gold ringed-planet emblem, tall cyan lamp posts, red-and-yellow striped market awnings, crates with cyan lights.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**05e · Walkable region map** (1536×1024 as 6 sections)
```
A large walkable top-down 3/4 pixel-art region map of Neonis, a neon city planet at night: rain-slick streets, glowing neon signs with abstract symbols (no readable text), holographic billboards, humming power plant turbines, cables strung between towers; drift grass is glowing fiber-optic grass in rooftop parks. Include winding trails and stairs, patches of glowing drift grass where wild Alienmon hide, two cave or tunnel mouths, a small outpost with a Recovery Bay dome, a landing pad near one edge, the planet's landmark (DJ Static's Relay Tower: a radio tower covered in LED rigs, speakers and a rooftop DJ booth broadcasting pirate radio, with sound-wave light patterns), and natural obstacles from this biome. Palette: magenta, electric cyan, indigo, hot yellow. Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**05f · Relay Tower / landmark building** (1024×1024, white background)
```
A single building sprite in top-down 3/4 RPG perspective: DJ Static's Relay Tower: a radio tower covered in LED rigs, speakers and a rooftop DJ booth broadcasting pirate radio, with sound-wave light patterns. Built in the style of Neonis (magenta, electric cyan, indigo, hot yellow), with a glowing Relay Tower beacon on top and a clear front entrance. Whole building visible, centered on a pure flat white #FFFFFF background, no ground scenery.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**05g · Keeper arena interior** (1536×1024)
```
The interior battle arena inside the Relay Tower on Neonis, top-down 3/4 view: a large floor marked with a glowing battle ring, themed decorations reflecting rain-slick streets, the Keeper's raised platform at the top, the entrance door at the bottom, glowing cyan relay machinery humming along the walls. Palette: magenta, electric cyan, indigo, hot yellow. No characters.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```

### 06 · Glyphos
- **World:** an ancient ruins world at golden dusk
- **Look:** crumbling sandstone temples covered in glowing alien glyphs, painted murals, toppled pillars, floating stone tiles, overgrown courtyards and stairways; drift grass is tall pale grass with glyph-shaped seed heads
- **Sky:** a warm amber dusk sky with long shadows
- **Palette:** sandstone beige, faded turquoise, moss green, glowing gold
- **Town:** an archaeologists' camp of canvas tents, lanterns and dig scaffolding
- **Landmark:** the Ancient Obelisk: a towering black monolith carved with glowing glyphs, surrounded by murals showing a shadow devouring a planet and a mother creature launching seeds into space
- **Mood:** ancient, awe-filled, full of secrets  ·  **Keeper:** none  ·  **Wild levels:** 20–26

**06a · Planet sprite** (1024×1024, white background)
```
A single round planet floating in space seen from orbit: Glyphos, an ancient ruins world at golden dusk. Surface colors sandstone beige, faded turquoise, moss green, glowing gold, with visible features hinting at crumbling sandstone temples covered in glowing alien glyphs. Lit from the top left with a dark crescent shadow on the lower right, a thin atmosphere glow. Centered, filling about 70% of the frame, on a pure flat white #FFFFFF background. No stars, no background.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**06b · Landing / key art** (1536×1024)
```
A sweeping establishing shot of Glyphos, an ancient ruins world at golden dusk: crumbling sandstone temples covered in glowing alien glyphs, painted murals, toppled pillars, floating stone tiles, overgrown courtyards and stairways; drift grass is tall pale grass with glyph-shaped seed heads. Sky: a warm amber dusk sky with long shadows. In the middle distance: an archaeologists' camp of canvas tents, lanterns and dig scaffolding. Palette: sandstone beige, faded turquoise, moss green, glowing gold. Mood: ancient, awe-filled, full of secrets. The player's small white-and-cream starship with magenta-pink engines is gliding in to land. No people visible.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**06c · Battle background** (1536×1024)
```
A battle background for Glyphos: a wide landscape view of crumbling sandstone temples covered in glowing alien glyphs, painted murals, toppled pillars, floating stone tiles, overgrown courtyards and stairways; drift grass is tall pale grass with glyph-shaped seed heads. Sky: a warm amber dusk sky with long shadows. Leave flat open ground in the lower left and a raised natural platform in the upper right where two creatures will stand. Palette: sandstone beige, faded turquoise, moss green, glowing gold. No creatures, no people, no text.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**06d · Walkable town map** (1536×1024)
```
A walkable top-down 3/4 pixel-art town map on Glyphos: an archaeologists' camp of canvas tents, lanterns and dig scaffolding. Surroundings: crumbling sandstone temples covered in glowing alien glyphs, painted murals, toppled pillars, floating stone tiles, overgrown courtyards and stairways; drift grass is tall pale grass with glyph-shaped seed heads. Include a Recovery Bay dome with a cyan cross-light, a striped-awning shop stall, a central plaza, several homes, a path leading off the bottom edge toward the landing pad, and the entrance to the planet's Relay Tower near the top. Palette: sandstone beige, faded turquoise, moss green, glowing gold. Settled places use the recurring Alienmon look: cream and sandstone dome buildings with glowing cyan windows and light strips, brass and gold trim, purple banners with a gold ringed-planet emblem, tall cyan lamp posts, red-and-yellow striped market awnings, crates with cyan lights.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**06e · Walkable region map** (1536×1024 as 6 sections)
```
A large walkable top-down 3/4 pixel-art region map of Glyphos, an ancient ruins world at golden dusk: crumbling sandstone temples covered in glowing alien glyphs, painted murals, toppled pillars, floating stone tiles, overgrown courtyards and stairways; drift grass is tall pale grass with glyph-shaped seed heads. Include winding trails and stairs, patches of glowing drift grass where wild Alienmon hide, two cave or tunnel mouths, a small outpost with a Recovery Bay dome, a landing pad near one edge, the planet's landmark (the Ancient Obelisk: a towering black monolith carved with glowing glyphs, surrounded by murals showing a shadow devouring a planet and a mother creature launching seeds into space), and natural obstacles from this biome. Palette: sandstone beige, faded turquoise, moss green, glowing gold. Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**06f · Relay Tower / landmark building** (1024×1024, white background)
```
A single building sprite in top-down 3/4 RPG perspective: the Ancient Obelisk: a towering black monolith carved with glowing glyphs, surrounded by murals showing a shadow devouring a planet and a mother creature launching seeds into space. Built in the style of Glyphos (sandstone beige, faded turquoise, moss green, glowing gold), with a glowing Relay Tower beacon on top and a clear front entrance. Whole building visible, centered on a pure flat white #FFFFFF background, no ground scenery.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**06g · Keeper arena interior** (1536×1024)
```
The interior battle arena inside the Relay Tower on Glyphos, top-down 3/4 view: a large floor marked with a glowing battle ring, themed decorations reflecting crumbling sandstone temples covered in glowing alien glyphs, the Keeper's raised platform at the top, the entrance door at the bottom, glowing cyan relay machinery humming along the walls. Palette: sandstone beige, faded turquoise, moss green, glowing gold. No characters.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```

### 07 · Pyros
- **World:** a volcanic mining world
- **Look:** black basalt cliffs, rivers of glowing lava, obsidian spires, mine carts on rails, lantern-lit tunnels, ember rain; drift grass is singed red ash-grass that glows at the tips
- **Sky:** a smoky charcoal sky glowing red near the horizon with falling embers
- **Palette:** lava orange, deep red, charcoal black, brass
- **Town:** Cinder Hollow, a mining camp of timber shacks, brass furnaces and rope lifts built into the cliff
- **Landmark:** Old Basalt's Relay Tower: a tower carved into the side of a smoking volcano, with brass mining machinery and a lantern at its peak
- **Mood:** hot, dangerous, rugged  ·  **Keeper:** Old Basalt  ·  **Wild levels:** 23–29

**07a · Planet sprite** (1024×1024, white background)
```
A single round planet floating in space seen from orbit: Pyros, a volcanic mining world. Surface colors lava orange, deep red, charcoal black, brass, with visible features hinting at black basalt cliffs. Lit from the top left with a dark crescent shadow on the lower right, a thin atmosphere glow. Centered, filling about 70% of the frame, on a pure flat white #FFFFFF background. No stars, no background.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**07b · Landing / key art** (1536×1024)
```
A sweeping establishing shot of Pyros, a volcanic mining world: black basalt cliffs, rivers of glowing lava, obsidian spires, mine carts on rails, lantern-lit tunnels, ember rain; drift grass is singed red ash-grass that glows at the tips. Sky: a smoky charcoal sky glowing red near the horizon with falling embers. In the middle distance: Cinder Hollow, a mining camp of timber shacks, brass furnaces and rope lifts built into the cliff. Palette: lava orange, deep red, charcoal black, brass. Mood: hot, dangerous, rugged. The player's small white-and-cream starship with magenta-pink engines is gliding in to land. No people visible.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**07c · Battle background** (1536×1024)
```
A battle background for Pyros: a wide landscape view of black basalt cliffs, rivers of glowing lava, obsidian spires, mine carts on rails, lantern-lit tunnels, ember rain; drift grass is singed red ash-grass that glows at the tips. Sky: a smoky charcoal sky glowing red near the horizon with falling embers. Leave flat open ground in the lower left and a raised natural platform in the upper right where two creatures will stand. Palette: lava orange, deep red, charcoal black, brass. No creatures, no people, no text.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**07d · Walkable town map** (1536×1024)
```
A walkable top-down 3/4 pixel-art town map on Pyros: Cinder Hollow, a mining camp of timber shacks, brass furnaces and rope lifts built into the cliff. Surroundings: black basalt cliffs, rivers of glowing lava, obsidian spires, mine carts on rails, lantern-lit tunnels, ember rain; drift grass is singed red ash-grass that glows at the tips. Include a Recovery Bay dome with a cyan cross-light, a striped-awning shop stall, a central plaza, several homes, a path leading off the bottom edge toward the landing pad, and the entrance to the planet's Relay Tower near the top. Palette: lava orange, deep red, charcoal black, brass. Settled places use the recurring Alienmon look: cream and sandstone dome buildings with glowing cyan windows and light strips, brass and gold trim, purple banners with a gold ringed-planet emblem, tall cyan lamp posts, red-and-yellow striped market awnings, crates with cyan lights.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**07e · Walkable region map** (1536×1024 as 6 sections)
```
A large walkable top-down 3/4 pixel-art region map of Pyros, a volcanic mining world: black basalt cliffs, rivers of glowing lava, obsidian spires, mine carts on rails, lantern-lit tunnels, ember rain; drift grass is singed red ash-grass that glows at the tips. Include winding trails and stairs, patches of glowing drift grass where wild Alienmon hide, two cave or tunnel mouths, a small outpost with a Recovery Bay dome, a landing pad near one edge, the planet's landmark (Old Basalt's Relay Tower: a tower carved into the side of a smoking volcano, with brass mining machinery and a lantern at its peak), and natural obstacles from this biome. Palette: lava orange, deep red, charcoal black, brass. Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**07f · Relay Tower / landmark building** (1024×1024, white background)
```
A single building sprite in top-down 3/4 RPG perspective: Old Basalt's Relay Tower: a tower carved into the side of a smoking volcano, with brass mining machinery and a lantern at its peak. Built in the style of Pyros (lava orange, deep red, charcoal black, brass), with a glowing Relay Tower beacon on top and a clear front entrance. Whole building visible, centered on a pure flat white #FFFFFF background, no ground scenery.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**07g · Keeper arena interior** (1536×1024)
```
The interior battle arena inside the Relay Tower on Pyros, top-down 3/4 view: a large floor marked with a glowing battle ring, themed decorations reflecting black basalt cliffs, the Keeper's raised platform at the top, the entrance door at the bottom, glowing cyan relay machinery humming along the walls. Palette: lava orange, deep red, charcoal black, brass. No characters.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```

### 08 · Glacia
- **World:** a ringed ice world under an aurora
- **Look:** blue glaciers, ice caves with crystal icicles, snowfields, frozen lakes, and a giant ancient Ystra creature frozen inside a glacier wall; drift grass is frosted white tundra grass
- **Sky:** a dark polar sky with green and pink auroras and an icy planetary ring
- **Palette:** ice blue, white, silver, aurora green and pink
- **Town:** Frostmark, a research outpost of insulated domes, snow vehicles and radio antennas
- **Landmark:** Ingrid Vale's Relay Tower: a frosted research mast with heated sensor domes, icicles hanging from its rings
- **Mood:** cold, quiet, majestic  ·  **Keeper:** Ingrid Vale  ·  **Wild levels:** 27–33

**08a · Planet sprite** (1024×1024, white background)
```
A single round planet floating in space seen from orbit: Glacia, a ringed ice world under an aurora. Surface colors ice blue, white, silver, aurora green and pink, with visible features hinting at blue glaciers. Lit from the top left with a dark crescent shadow on the lower right, a thin atmosphere glow. Centered, filling about 70% of the frame, on a pure flat white #FFFFFF background. No stars, no background.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**08b · Landing / key art** (1536×1024)
```
A sweeping establishing shot of Glacia, a ringed ice world under an aurora: blue glaciers, ice caves with crystal icicles, snowfields, frozen lakes, and a giant ancient Ystra creature frozen inside a glacier wall; drift grass is frosted white tundra grass. Sky: a dark polar sky with green and pink auroras and an icy planetary ring. In the middle distance: Frostmark, a research outpost of insulated domes, snow vehicles and radio antennas. Palette: ice blue, white, silver, aurora green and pink. Mood: cold, quiet, majestic. The player's small white-and-cream starship with magenta-pink engines is gliding in to land. No people visible.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**08c · Battle background** (1536×1024)
```
A battle background for Glacia: a wide landscape view of blue glaciers, ice caves with crystal icicles, snowfields, frozen lakes, and a giant ancient Ystra creature frozen inside a glacier wall; drift grass is frosted white tundra grass. Sky: a dark polar sky with green and pink auroras and an icy planetary ring. Leave flat open ground in the lower left and a raised natural platform in the upper right where two creatures will stand. Palette: ice blue, white, silver, aurora green and pink. No creatures, no people, no text.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**08d · Walkable town map** (1536×1024)
```
A walkable top-down 3/4 pixel-art town map on Glacia: Frostmark, a research outpost of insulated domes, snow vehicles and radio antennas. Surroundings: blue glaciers, ice caves with crystal icicles, snowfields, frozen lakes, and a giant ancient Ystra creature frozen inside a glacier wall; drift grass is frosted white tundra grass. Include a Recovery Bay dome with a cyan cross-light, a striped-awning shop stall, a central plaza, several homes, a path leading off the bottom edge toward the landing pad, and the entrance to the planet's Relay Tower near the top. Palette: ice blue, white, silver, aurora green and pink. Settled places use the recurring Alienmon look: cream and sandstone dome buildings with glowing cyan windows and light strips, brass and gold trim, purple banners with a gold ringed-planet emblem, tall cyan lamp posts, red-and-yellow striped market awnings, crates with cyan lights.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**08e · Walkable region map** (1536×1024 as 6 sections)
```
A large walkable top-down 3/4 pixel-art region map of Glacia, a ringed ice world under an aurora: blue glaciers, ice caves with crystal icicles, snowfields, frozen lakes, and a giant ancient Ystra creature frozen inside a glacier wall; drift grass is frosted white tundra grass. Include winding trails and stairs, patches of glowing drift grass where wild Alienmon hide, two cave or tunnel mouths, a small outpost with a Recovery Bay dome, a landing pad near one edge, the planet's landmark (Ingrid Vale's Relay Tower: a frosted research mast with heated sensor domes, icicles hanging from its rings), and natural obstacles from this biome. Palette: ice blue, white, silver, aurora green and pink. Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**08f · Relay Tower / landmark building** (1024×1024, white background)
```
A single building sprite in top-down 3/4 RPG perspective: Ingrid Vale's Relay Tower: a frosted research mast with heated sensor domes, icicles hanging from its rings. Built in the style of Glacia (ice blue, white, silver, aurora green and pink), with a glowing Relay Tower beacon on top and a clear front entrance. Whole building visible, centered on a pure flat white #FFFFFF background, no ground scenery.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**08g · Keeper arena interior** (1536×1024)
```
The interior battle arena inside the Relay Tower on Glacia, top-down 3/4 view: a large floor marked with a glowing battle ring, themed decorations reflecting blue glaciers, the Keeper's raised platform at the top, the entrance door at the bottom, glowing cyan relay machinery humming along the walls. Palette: ice blue, white, silver, aurora green and pink. No characters.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```

### 09 · Helix Station
- **World:** the Helix Directive's orbital space station
- **Look:** dark steel industrial decks and sterile white labs, glowing orange power columns, hazard stripes, orange ringed-slash Helix emblems (shape only, no text), specimen tanks, catwalks over toxic green vats, huge viewports to space; drift grass replaced by glowing hydroponic grass beds
- **Sky:** the black of space through panoramic viewports, with a planet below
- **Palette:** dark steel, clinical white, hazard orange, toxic lime, cold cyan
- **Town:** crew quarters, cargo bays and security checkpoints
- **Landmark:** Admin Vex's arena: a circular containment-test chamber with force-field walls and a raised observation booth
- **Mood:** cold, corporate, sinister  ·  **Keeper:** Admin Vex  ·  **Wild levels:** 30–36

**09a · Planet sprite** (1024×1024, white background)
```
A single round planet floating in space seen from orbit: Helix Station, the Helix Directive's orbital space station. Surface colors dark steel, clinical white, hazard orange, toxic lime, cold cyan, with visible features hinting at dark steel industrial decks and sterile white labs. Lit from the top left with a dark crescent shadow on the lower right, a thin atmosphere glow. Centered, filling about 70% of the frame, on a pure flat white #FFFFFF background. No stars, no background.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**09b · Landing / key art** (1536×1024)
```
A sweeping establishing shot of Helix Station, the Helix Directive's orbital space station: dark steel industrial decks and sterile white labs, glowing orange power columns, hazard stripes, orange ringed-slash Helix emblems (shape only, no text), specimen tanks, catwalks over toxic green vats, huge viewports to space; drift grass replaced by glowing hydroponic grass beds. Sky: the black of space through panoramic viewports, with a planet below. In the middle distance: crew quarters, cargo bays and security checkpoints. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Mood: cold, corporate, sinister. The player's small white-and-cream starship with magenta-pink engines is gliding in to land. No people visible.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**09c · Battle background** (1536×1024)
```
A battle background for Helix Station: a wide landscape view of dark steel industrial decks and sterile white labs, glowing orange power columns, hazard stripes, orange ringed-slash Helix emblems (shape only, no text), specimen tanks, catwalks over toxic green vats, huge viewports to space; drift grass replaced by glowing hydroponic grass beds. Sky: the black of space through panoramic viewports, with a planet below. Leave flat open ground in the lower left and a raised natural platform in the upper right where two creatures will stand. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. No creatures, no people, no text.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**09d · Walkable town map** (1536×1024)
```
A walkable top-down 3/4 pixel-art town map on Helix Station: crew quarters, cargo bays and security checkpoints. Surroundings: dark steel industrial decks and sterile white labs, glowing orange power columns, hazard stripes, orange ringed-slash Helix emblems (shape only, no text), specimen tanks, catwalks over toxic green vats, huge viewports to space; drift grass replaced by glowing hydroponic grass beds. Include a Recovery Bay dome with a cyan cross-light, a striped-awning shop stall, a central plaza, several homes, a path leading off the bottom edge toward the landing pad, and the entrance to the planet's Relay Tower near the top. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Settled places use the recurring Alienmon look: cream and sandstone dome buildings with glowing cyan windows and light strips, brass and gold trim, purple banners with a gold ringed-planet emblem, tall cyan lamp posts, red-and-yellow striped market awnings, crates with cyan lights.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**09e · Walkable region map** (1536×1024 as 6 sections)
```
A large walkable top-down 3/4 pixel-art region map of Helix Station, the Helix Directive's orbital space station: dark steel industrial decks and sterile white labs, glowing orange power columns, hazard stripes, orange ringed-slash Helix emblems (shape only, no text), specimen tanks, catwalks over toxic green vats, huge viewports to space; drift grass replaced by glowing hydroponic grass beds. Include winding trails and stairs, patches of glowing drift grass where wild Alienmon hide, two cave or tunnel mouths, a small outpost with a Recovery Bay dome, a landing pad near one edge, the planet's landmark (Admin Vex's arena: a circular containment-test chamber with force-field walls and a raised observation booth), and natural obstacles from this biome. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**09f · Relay Tower / landmark building** (1024×1024, white background)
```
A single building sprite in top-down 3/4 RPG perspective: Admin Vex's arena: a circular containment-test chamber with force-field walls and a raised observation booth. Built in the style of Helix Station (dark steel, clinical white, hazard orange, toxic lime, cold cyan), with a glowing Relay Tower beacon on top and a clear front entrance. Whole building visible, centered on a pure flat white #FFFFFF background, no ground scenery.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**09g · Keeper arena interior** (1536×1024)
```
The interior battle arena inside the Relay Tower on Helix Station, top-down 3/4 view: a large floor marked with a glowing battle ring, themed decorations reflecting dark steel industrial decks and sterile white labs, the Keeper's raised platform at the top, the entrance door at the bottom, glowing cyan relay machinery humming along the walls. Palette: dark steel, clinical white, hazard orange, toxic lime, cold cyan. No characters.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```

### 10 · Halo
- **World:** a world of floating sky islands
- **Look:** grassy islands floating among pink and lavender clouds, waterfalls pouring off their edges into the sky, crystal halos hovering above shrines, rope and crystal bridges between islands; drift grass is pastel pink wind-grass
- **Sky:** a soft pastel sunrise sky with sun rays through the clouds
- **Palette:** pastel pink, lavender, cloud white, crystal gold
- **Town:** Skyreach Plaza, a circular sandstone plaza around a glowing holo-globe fountain, grand stairs up to the Keeper tower, striped market stalls, magenta palms, waterfalls pouring off the island edges
- **Landmark:** the Twins' Relay Tower: a white temple spire crowned with two mirrored crystal halos, one lavender and one pink
- **Mood:** serene, dreamy, spiritual  ·  **Keeper:** Echo and Iris  ·  **Wild levels:** 33–39

**10a · Planet sprite** (1024×1024, white background)
```
A single round planet floating in space seen from orbit: Halo, a world of floating sky islands. Surface colors pastel pink, lavender, cloud white, crystal gold, with visible features hinting at grassy islands floating among pink and lavender clouds. Lit from the top left with a dark crescent shadow on the lower right, a thin atmosphere glow. Centered, filling about 70% of the frame, on a pure flat white #FFFFFF background. No stars, no background.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**10b · Landing / key art** (1536×1024)
```
A sweeping establishing shot of Halo, a world of floating sky islands: grassy islands floating among pink and lavender clouds, waterfalls pouring off their edges into the sky, crystal halos hovering above shrines, rope and crystal bridges between islands; drift grass is pastel pink wind-grass. Sky: a soft pastel sunrise sky with sun rays through the clouds. In the middle distance: Skyreach Plaza, a circular sandstone plaza around a glowing holo-globe fountain, grand stairs up to the Keeper tower, striped market stalls, magenta palms, waterfalls pouring off the island edges. Palette: pastel pink, lavender, cloud white, crystal gold. Mood: serene, dreamy, spiritual. The player's small white-and-cream starship with magenta-pink engines is gliding in to land. No people visible.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**10c · Battle background** (1536×1024)
```
A battle background for Halo: a wide landscape view of grassy islands floating among pink and lavender clouds, waterfalls pouring off their edges into the sky, crystal halos hovering above shrines, rope and crystal bridges between islands; drift grass is pastel pink wind-grass. Sky: a soft pastel sunrise sky with sun rays through the clouds. Leave flat open ground in the lower left and a raised natural platform in the upper right where two creatures will stand. Palette: pastel pink, lavender, cloud white, crystal gold. No creatures, no people, no text.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**10d · Walkable town map** (1536×1024)
```
A walkable top-down 3/4 pixel-art town map on Halo: Skyreach Plaza, a circular sandstone plaza around a glowing holo-globe fountain, grand stairs up to the Keeper tower, striped market stalls, magenta palms, waterfalls pouring off the island edges. Surroundings: grassy islands floating among pink and lavender clouds, waterfalls pouring off their edges into the sky, crystal halos hovering above shrines, rope and crystal bridges between islands; drift grass is pastel pink wind-grass. Include a Recovery Bay dome with a cyan cross-light, a striped-awning shop stall, a central plaza, several homes, a path leading off the bottom edge toward the landing pad, and the entrance to the planet's Relay Tower near the top. Palette: pastel pink, lavender, cloud white, crystal gold. Settled places use the recurring Alienmon look: cream and sandstone dome buildings with glowing cyan windows and light strips, brass and gold trim, purple banners with a gold ringed-planet emblem, tall cyan lamp posts, red-and-yellow striped market awnings, crates with cyan lights.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**10e · Walkable region map** (1536×1024 as 6 sections)
```
A large walkable top-down 3/4 pixel-art region map of Halo, a world of floating sky islands: grassy islands floating among pink and lavender clouds, waterfalls pouring off their edges into the sky, crystal halos hovering above shrines, rope and crystal bridges between islands; drift grass is pastel pink wind-grass. Include winding trails and stairs, patches of glowing drift grass where wild Alienmon hide, two cave or tunnel mouths, a small outpost with a Recovery Bay dome, a landing pad near one edge, the planet's landmark (the Twins' Relay Tower: a white temple spire crowned with two mirrored crystal halos, one lavender and one pink), and natural obstacles from this biome. Palette: pastel pink, lavender, cloud white, crystal gold. Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**10f · Relay Tower / landmark building** (1024×1024, white background)
```
A single building sprite in top-down 3/4 RPG perspective: the Twins' Relay Tower: a white temple spire crowned with two mirrored crystal halos, one lavender and one pink. Built in the style of Halo (pastel pink, lavender, cloud white, crystal gold), with a glowing Relay Tower beacon on top and a clear front entrance. Whole building visible, centered on a pure flat white #FFFFFF background, no ground scenery.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**10g · Keeper arena interior** (1536×1024)
```
The interior battle arena inside the Relay Tower on Halo, top-down 3/4 view: a large floor marked with a glowing battle ring, themed decorations reflecting grassy islands floating among pink and lavender clouds, the Keeper's raised platform at the top, the entrance door at the bottom, glowing cyan relay machinery humming along the walls. Palette: pastel pink, lavender, cloud white, crystal gold. No characters.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```

### 11 · Umbra
- **World:** a dark world inside a giant sinkhole
- **Look:** a collapsed city tilted into a massive sinkhole, broken skyscrapers leaning at angles, hanging cables, paper lanterns, black flowers with glowing pale centers, purple gloom; drift grass is dark purple grass with faint glowing tips
- **Sky:** a dim violet sky visible only as a ring far above at the sinkhole's edge
- **Palette:** deep purple, midnight blue, lantern amber, ghostly white
- **Town:** Gravewell, a scavenger settlement built on tilted rooftops connected by ladders
- **Landmark:** Mortimer Kade's Relay Tower: a crooked iron tower hung with dozens of lanterns, standing at the edge of the sinkhole's deepest drop
- **Mood:** gloomy, haunting, but strangely beautiful  ·  **Keeper:** Mortimer Kade  ·  **Wild levels:** 37–43

**11a · Planet sprite** (1024×1024, white background)
```
A single round planet floating in space seen from orbit: Umbra, a dark world inside a giant sinkhole. Surface colors deep purple, midnight blue, lantern amber, ghostly white, with visible features hinting at a collapsed city tilted into a massive sinkhole. Lit from the top left with a dark crescent shadow on the lower right, a thin atmosphere glow. Centered, filling about 70% of the frame, on a pure flat white #FFFFFF background. No stars, no background.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**11b · Landing / key art** (1536×1024)
```
A sweeping establishing shot of Umbra, a dark world inside a giant sinkhole: a collapsed city tilted into a massive sinkhole, broken skyscrapers leaning at angles, hanging cables, paper lanterns, black flowers with glowing pale centers, purple gloom; drift grass is dark purple grass with faint glowing tips. Sky: a dim violet sky visible only as a ring far above at the sinkhole's edge. In the middle distance: Gravewell, a scavenger settlement built on tilted rooftops connected by ladders. Palette: deep purple, midnight blue, lantern amber, ghostly white. Mood: gloomy, haunting, but strangely beautiful. The player's small white-and-cream starship with magenta-pink engines is gliding in to land. No people visible.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**11c · Battle background** (1536×1024)
```
A battle background for Umbra: a wide landscape view of a collapsed city tilted into a massive sinkhole, broken skyscrapers leaning at angles, hanging cables, paper lanterns, black flowers with glowing pale centers, purple gloom; drift grass is dark purple grass with faint glowing tips. Sky: a dim violet sky visible only as a ring far above at the sinkhole's edge. Leave flat open ground in the lower left and a raised natural platform in the upper right where two creatures will stand. Palette: deep purple, midnight blue, lantern amber, ghostly white. No creatures, no people, no text.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**11d · Walkable town map** (1536×1024)
```
A walkable top-down 3/4 pixel-art town map on Umbra: Gravewell, a scavenger settlement built on tilted rooftops connected by ladders. Surroundings: a collapsed city tilted into a massive sinkhole, broken skyscrapers leaning at angles, hanging cables, paper lanterns, black flowers with glowing pale centers, purple gloom; drift grass is dark purple grass with faint glowing tips. Include a Recovery Bay dome with a cyan cross-light, a striped-awning shop stall, a central plaza, several homes, a path leading off the bottom edge toward the landing pad, and the entrance to the planet's Relay Tower near the top. Palette: deep purple, midnight blue, lantern amber, ghostly white. Settled places use the recurring Alienmon look: cream and sandstone dome buildings with glowing cyan windows and light strips, brass and gold trim, purple banners with a gold ringed-planet emblem, tall cyan lamp posts, red-and-yellow striped market awnings, crates with cyan lights.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**11e · Walkable region map** (1536×1024 as 6 sections)
```
A large walkable top-down 3/4 pixel-art region map of Umbra, a dark world inside a giant sinkhole: a collapsed city tilted into a massive sinkhole, broken skyscrapers leaning at angles, hanging cables, paper lanterns, black flowers with glowing pale centers, purple gloom; drift grass is dark purple grass with faint glowing tips. Include winding trails and stairs, patches of glowing drift grass where wild Alienmon hide, two cave or tunnel mouths, a small outpost with a Recovery Bay dome, a landing pad near one edge, the planet's landmark (Mortimer Kade's Relay Tower: a crooked iron tower hung with dozens of lanterns, standing at the edge of the sinkhole's deepest drop), and natural obstacles from this biome. Palette: deep purple, midnight blue, lantern amber, ghostly white. Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**11f · Relay Tower / landmark building** (1024×1024, white background)
```
A single building sprite in top-down 3/4 RPG perspective: Mortimer Kade's Relay Tower: a crooked iron tower hung with dozens of lanterns, standing at the edge of the sinkhole's deepest drop. Built in the style of Umbra (deep purple, midnight blue, lantern amber, ghostly white), with a glowing Relay Tower beacon on top and a clear front entrance. Whole building visible, centered on a pure flat white #FFFFFF background, no ground scenery.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**11g · Keeper arena interior** (1536×1024)
```
The interior battle arena inside the Relay Tower on Umbra, top-down 3/4 view: a large floor marked with a glowing battle ring, themed decorations reflecting a collapsed city tilted into a massive sinkhole, the Keeper's raised platform at the top, the entrance door at the bottom, glowing cyan relay machinery humming along the walls. Palette: deep purple, midnight blue, lantern amber, ghostly white. No characters.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```

### 12 · Starfall Rift
- **World:** the Starfall Rift, a crater torn open into a nebula
- **Look:** the original meteor crater cracked open, giant magenta and gold crystal spires, floating boulders, glowing dimensional cracks in the air, shards of another world drifting through; drift grass is glowing pink crystal grass
- **Sky:** a swirling magenta and violet nebula rift dominating the sky, with a dark shape barely visible inside it
- **Palette:** magenta, violet, star gold, deep space purple
- **Town:** Helix drilling rigs and abandoned equipment around the crater rim
- **Landmark:** the Rift Core: a colossal tear in space ringed by eight glowing beacon pylons, with Helix machinery trying to pry it open
- **Mood:** climactic, cosmic, dangerous  ·  **Keeper:** Director Thorne  ·  **Wild levels:** 42–48

**12a · Planet sprite** (1024×1024, white background)
```
A single round planet floating in space seen from orbit: Starfall Rift, the Starfall Rift, a crater torn open into a nebula. Surface colors magenta, violet, star gold, deep space purple, with visible features hinting at the original meteor crater cracked open. Lit from the top left with a dark crescent shadow on the lower right, a thin atmosphere glow. Centered, filling about 70% of the frame, on a pure flat white #FFFFFF background. No stars, no background.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**12b · Landing / key art** (1536×1024)
```
A sweeping establishing shot of Starfall Rift, the Starfall Rift, a crater torn open into a nebula: the original meteor crater cracked open, giant magenta and gold crystal spires, floating boulders, glowing dimensional cracks in the air, shards of another world drifting through; drift grass is glowing pink crystal grass. Sky: a swirling magenta and violet nebula rift dominating the sky, with a dark shape barely visible inside it. In the middle distance: Helix drilling rigs and abandoned equipment around the crater rim. Palette: magenta, violet, star gold, deep space purple. Mood: climactic, cosmic, dangerous. The player's small white-and-cream starship with magenta-pink engines is gliding in to land. No people visible.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**12c · Battle background** (1536×1024)
```
A battle background for Starfall Rift: a wide landscape view of the original meteor crater cracked open, giant magenta and gold crystal spires, floating boulders, glowing dimensional cracks in the air, shards of another world drifting through; drift grass is glowing pink crystal grass. Sky: a swirling magenta and violet nebula rift dominating the sky, with a dark shape barely visible inside it. Leave flat open ground in the lower left and a raised natural platform in the upper right where two creatures will stand. Palette: magenta, violet, star gold, deep space purple. No creatures, no people, no text.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**12d · Walkable town map** (1536×1024)
```
A walkable top-down 3/4 pixel-art town map on Starfall Rift: Helix drilling rigs and abandoned equipment around the crater rim. Surroundings: the original meteor crater cracked open, giant magenta and gold crystal spires, floating boulders, glowing dimensional cracks in the air, shards of another world drifting through; drift grass is glowing pink crystal grass. Include a Recovery Bay dome with a cyan cross-light, a striped-awning shop stall, a central plaza, several homes, a path leading off the bottom edge toward the landing pad, and the entrance to the planet's Relay Tower near the top. Palette: magenta, violet, star gold, deep space purple. Settled places use the recurring Alienmon look: cream and sandstone dome buildings with glowing cyan windows and light strips, brass and gold trim, purple banners with a gold ringed-planet emblem, tall cyan lamp posts, red-and-yellow striped market awnings, crates with cyan lights.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**12e · Walkable region map** (1536×1024 as 6 sections)
```
A large walkable top-down 3/4 pixel-art region map of Starfall Rift, the Starfall Rift, a crater torn open into a nebula: the original meteor crater cracked open, giant magenta and gold crystal spires, floating boulders, glowing dimensional cracks in the air, shards of another world drifting through; drift grass is glowing pink crystal grass. Include winding trails and stairs, patches of glowing drift grass where wild Alienmon hide, two cave or tunnel mouths, a small outpost with a Recovery Bay dome, a landing pad near one edge, the planet's landmark (the Rift Core: a colossal tear in space ringed by eight glowing beacon pylons, with Helix machinery trying to pry it open), and natural obstacles from this biome. Palette: magenta, violet, star gold, deep space purple. Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**12f · Relay Tower / landmark building** (1024×1024, white background)
```
A single building sprite in top-down 3/4 RPG perspective: the Rift Core: a colossal tear in space ringed by eight glowing beacon pylons, with Helix machinery trying to pry it open. Built in the style of Starfall Rift (magenta, violet, star gold, deep space purple), with a glowing Relay Tower beacon on top and a clear front entrance. Whole building visible, centered on a pure flat white #FFFFFF background, no ground scenery.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**12g · Keeper arena interior** (1536×1024)
```
The interior battle arena inside the Relay Tower on Starfall Rift, top-down 3/4 view: a large floor marked with a glowing battle ring, themed decorations reflecting the original meteor crater cracked open, the Keeper's raised platform at the top, the entrance door at the bottom, glowing cyan relay machinery humming along the walls. Palette: magenta, violet, star gold, deep space purple. No characters.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```

### 13 · Apex Array
- **World:** a snowy mountain summit with a giant broadcast array
- **Look:** jagged snowy peaks, a winding mountain trail called Signal Pass, rows of enormous satellite dishes pointed at the stars, wind-whipped flags; drift grass is hardy alpine grass
- **Sky:** a crisp high-altitude sky, deep blue near the top with stars visible even in daytime
- **Palette:** snow white, deep blue, steel, champion gold
- **Town:** the Hall of Linkers, a grand arena hall with a golden starburst emblem over its doors
- **Landmark:** the Prime Linker's arena: an open-air stadium on the summit surrounded by giant dishes, with a starburst emblem on the floor
- **Mood:** triumphant, epic, the final test  ·  **Keeper:** Orra Venn  ·  **Wild levels:** 46–52

**13a · Planet sprite** (1024×1024, white background)
```
A single round planet floating in space seen from orbit: Apex Array, a snowy mountain summit with a giant broadcast array. Surface colors snow white, deep blue, steel, champion gold, with visible features hinting at jagged snowy peaks. Lit from the top left with a dark crescent shadow on the lower right, a thin atmosphere glow. Centered, filling about 70% of the frame, on a pure flat white #FFFFFF background. No stars, no background.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**13b · Landing / key art** (1536×1024)
```
A sweeping establishing shot of Apex Array, a snowy mountain summit with a giant broadcast array: jagged snowy peaks, a winding mountain trail called Signal Pass, rows of enormous satellite dishes pointed at the stars, wind-whipped flags; drift grass is hardy alpine grass. Sky: a crisp high-altitude sky, deep blue near the top with stars visible even in daytime. In the middle distance: the Hall of Linkers, a grand arena hall with a golden starburst emblem over its doors. Palette: snow white, deep blue, steel, champion gold. Mood: triumphant, epic, the final test. The player's small white-and-cream starship with magenta-pink engines is gliding in to land. No people visible.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**13c · Battle background** (1536×1024)
```
A battle background for Apex Array: a wide landscape view of jagged snowy peaks, a winding mountain trail called Signal Pass, rows of enormous satellite dishes pointed at the stars, wind-whipped flags; drift grass is hardy alpine grass. Sky: a crisp high-altitude sky, deep blue near the top with stars visible even in daytime. Leave flat open ground in the lower left and a raised natural platform in the upper right where two creatures will stand. Palette: snow white, deep blue, steel, champion gold. No creatures, no people, no text.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**13d · Walkable town map** (1536×1024)
```
A walkable top-down 3/4 pixel-art town map on Apex Array: the Hall of Linkers, a grand arena hall with a golden starburst emblem over its doors. Surroundings: jagged snowy peaks, a winding mountain trail called Signal Pass, rows of enormous satellite dishes pointed at the stars, wind-whipped flags; drift grass is hardy alpine grass. Include a Recovery Bay dome with a cyan cross-light, a striped-awning shop stall, a central plaza, several homes, a path leading off the bottom edge toward the landing pad, and the entrance to the planet's Relay Tower near the top. Palette: snow white, deep blue, steel, champion gold. Settled places use the recurring Alienmon look: cream and sandstone dome buildings with glowing cyan windows and light strips, brass and gold trim, purple banners with a gold ringed-planet emblem, tall cyan lamp posts, red-and-yellow striped market awnings, crates with cyan lights.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**13e · Walkable region map** (1536×1024 as 6 sections)
```
A large walkable top-down 3/4 pixel-art region map of Apex Array, a snowy mountain summit with a giant broadcast array: jagged snowy peaks, a winding mountain trail called Signal Pass, rows of enormous satellite dishes pointed at the stars, wind-whipped flags; drift grass is hardy alpine grass. Include winding trails and stairs, patches of glowing drift grass where wild Alienmon hide, two cave or tunnel mouths, a small outpost with a Recovery Bay dome, a landing pad near one edge, the planet's landmark (the Prime Linker's arena: an open-air stadium on the summit surrounded by giant dishes, with a starburst emblem on the floor), and natural obstacles from this biome. Palette: snow white, deep blue, steel, champion gold. Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**13f · Relay Tower / landmark building** (1024×1024, white background)
```
A single building sprite in top-down 3/4 RPG perspective: the Prime Linker's arena: an open-air stadium on the summit surrounded by giant dishes, with a starburst emblem on the floor. Built in the style of Apex Array (snow white, deep blue, steel, champion gold), with a glowing Relay Tower beacon on top and a clear front entrance. Whole building visible, centered on a pure flat white #FFFFFF background, no ground scenery.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**13g · Keeper arena interior** (1536×1024)
```
The interior battle arena inside the Relay Tower on Apex Array, top-down 3/4 view: a large floor marked with a glowing battle ring, themed decorations reflecting jagged snowy peaks, the Keeper's raised platform at the top, the entrance door at the bottom, glowing cyan relay machinery humming along the walls. Palette: snow white, deep blue, steel, champion gold. No characters.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```

### 14 · Ystra
- **World:** Ystra, the shattered home world of the Alienmon
- **Look:** huge floating fragments of a dying planet drifting in space, alien teal and magenta flora, bioluminescent trees, crystal formations, and black void cracks where something took bites out of the land; drift grass is glowing teal alien grass
- **Sky:** open space full of drifting planet fragments and a faint dark shadow in the distance
- **Palette:** alien teal, magenta, void black, crystal white
- **Town:** ruins of an ancient Alienmon nesting ground
- **Landmark:** the Seedmother's Shrine: a vast crystal tree-shrine with glowing seedpods hanging from its branches
- **Mood:** haunting, sacred, bittersweet  ·  **Keeper:** none  ·  **Wild levels:** 55–65

**14a · Planet sprite** (1024×1024, white background)
```
A single round planet floating in space seen from orbit: Ystra, Ystra, the shattered home world of the Alienmon. Surface colors alien teal, magenta, void black, crystal white, with visible features hinting at huge floating fragments of a dying planet drifting in space. Lit from the top left with a dark crescent shadow on the lower right, a thin atmosphere glow. Centered, filling about 70% of the frame, on a pure flat white #FFFFFF background. No stars, no background.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**14b · Landing / key art** (1536×1024)
```
A sweeping establishing shot of Ystra, Ystra, the shattered home world of the Alienmon: huge floating fragments of a dying planet drifting in space, alien teal and magenta flora, bioluminescent trees, crystal formations, and black void cracks where something took bites out of the land; drift grass is glowing teal alien grass. Sky: open space full of drifting planet fragments and a faint dark shadow in the distance. In the middle distance: ruins of an ancient Alienmon nesting ground. Palette: alien teal, magenta, void black, crystal white. Mood: haunting, sacred, bittersweet. The player's small white-and-cream starship with magenta-pink engines is gliding in to land. No people visible.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**14c · Battle background** (1536×1024)
```
A battle background for Ystra: a wide landscape view of huge floating fragments of a dying planet drifting in space, alien teal and magenta flora, bioluminescent trees, crystal formations, and black void cracks where something took bites out of the land; drift grass is glowing teal alien grass. Sky: open space full of drifting planet fragments and a faint dark shadow in the distance. Leave flat open ground in the lower left and a raised natural platform in the upper right where two creatures will stand. Palette: alien teal, magenta, void black, crystal white. No creatures, no people, no text.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**14d · Walkable town map** (1536×1024)
```
A walkable top-down 3/4 pixel-art town map on Ystra: ruins of an ancient Alienmon nesting ground. Surroundings: huge floating fragments of a dying planet drifting in space, alien teal and magenta flora, bioluminescent trees, crystal formations, and black void cracks where something took bites out of the land; drift grass is glowing teal alien grass. Include a Recovery Bay dome with a cyan cross-light, a striped-awning shop stall, a central plaza, several homes, a path leading off the bottom edge toward the landing pad, and the entrance to the planet's Relay Tower near the top. Palette: alien teal, magenta, void black, crystal white. Settled places use the recurring Alienmon look: cream and sandstone dome buildings with glowing cyan windows and light strips, brass and gold trim, purple banners with a gold ringed-planet emblem, tall cyan lamp posts, red-and-yellow striped market awnings, crates with cyan lights.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**14e · Walkable region map** (1536×1024 as 6 sections)
```
A large walkable top-down 3/4 pixel-art region map of Ystra, Ystra, the shattered home world of the Alienmon: huge floating fragments of a dying planet drifting in space, alien teal and magenta flora, bioluminescent trees, crystal formations, and black void cracks where something took bites out of the land; drift grass is glowing teal alien grass. Include winding trails and stairs, patches of glowing drift grass where wild Alienmon hide, two cave or tunnel mouths, a small outpost with a Recovery Bay dome, a landing pad near one edge, the planet's landmark (the Seedmother's Shrine: a vast crystal tree-shrine with glowing seedpods hanging from its branches), and natural obstacles from this biome. Palette: alien teal, magenta, void black, crystal white. Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```
**14f · Relay Tower / landmark building** (1024×1024, white background)
```
A single building sprite in top-down 3/4 RPG perspective: the Seedmother's Shrine: a vast crystal tree-shrine with glowing seedpods hanging from its branches. Built in the style of Ystra (alien teal, magenta, void black, crystal white), with a glowing Relay Tower beacon on top and a clear front entrance. Whole building visible, centered on a pure flat white #FFFFFF background, no ground scenery.
Style: high-quality original pixel art in a modern Game Boy Advance / 16-bit handheld RPG style. Crisp even pixel grid, every pixel a hard square block, no blur, no anti-aliasing, no painterly texture. Controlled palette, 3–4 tone cel shading, light from the top left, clean dark outlines. Original design only, not resembling Pokémon or any existing game. No text, no logos, no UI, no watermark.
```
**14g · Keeper arena interior** (1536×1024)
```
The interior battle arena inside the Relay Tower on Ystra, top-down 3/4 view: a large floor marked with a glowing battle ring, themed decorations reflecting huge floating fragments of a dying planet drifting in space, the Keeper's raised platform at the top, the entrance door at the bottom, glowing cyan relay machinery humming along the walls. Palette: alien teal, magenta, void black, crystal white. No characters.
Walkable-map rules: top-down 3/4 perspective; wide, clearly readable walkable ground (paths, plazas, stairs, docks, bridges) clearly separated from blocked terrain (cliffs, water, lava, walls); doors about as tall as a small character; no characters, no creatures and no people anywhere in the image.
Style: vibrant, highly detailed pixel art game environment in a modern 16-bit / 32-bit handheld RPG style, saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, readable shapes. Original designs only, not resembling Pokémon or any existing game. No text, no letters, no logos, no UI, no watermark.
```

---

## PART 5 — Quick fixes for ChatGPT results

| Problem | What to reply |
| --- | --- |
| People or creatures appeared in a map | "Same image, but remove every character and creature." |
| Paths too thin to walk | "Make all walkable paths, stairs and bridges about twice as wide." |
| Looks blurry or painterly | "Redo with a crisp hard-edged pixel grid, no blur, no anti-aliasing." |
| Off-style colors | "Use the palette listed for this planet and the Alienmon settlement motifs." |
| Need the 6 sections | "Split this exact image into 6 equal sections, 3 across and 2 down, with no overlap and no borders." |
| Map edges don't connect to the Molten Frontier | "Make the left edge match the right edge of the Molten Frontier map (lava ridge, iron bridges)." |
