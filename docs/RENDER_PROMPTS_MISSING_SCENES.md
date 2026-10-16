# Alienmon: render prompts for the missing scenes

These fill the gaps left after the V3 map rebuild (2026-10-16). Drop the finished files into
`art/alienmon extra scenes` with the exact file names below, and they will slot in like the rest of the set.

## Rules for every render (paste this block at the top of each prompt)

> Top-down 3/4 view pixel-art game map, same style, palette, lighting and detail level as the existing Alienmon
> scene set (rich hand-painted pixel art, 64 px per game tile, soft glow from lamps, crisp outlines).
> Seamless edges, no border or frame, no text, letters or numbers, no UI.
> No people, characters or creatures anywhere in the scene.
> No round red-and-white or white balls with a band and a button (nothing that looks like a Pokéball), on shelves,
> tables or the ground. Use crystals, jars, crates, potions or teal orbs instead.
> Walkable ground (roads, floors, sand, plazas) must be clearly flat and open. Everything you can't walk on
> (cliffs, walls, water, machines, furniture, dense plants) must read clearly as solid.
> Rugs and carpets are flat and walkable. Tall grass is drawn as clear, even patches.

**Sizes and openings (important, so the maps join up):**

| Scene type | Size | Openings |
|---|---|---|
| Outdoor maps (Exterior, Entrance, Water Route) | 1536 × 1024 px (24 × 16 tiles) | Roads that leave the map are 5 tiles wide (320 px) and meet the edge squarely. Only draw roads to an edge where an exit is listed. Every other edge is closed with scenery. |
| Rooms (Trial Floor, Keeper Room, Secret Lab, Home) | 1254 × 1254 px (about 20 × 20 tiles) | Entrance doormat is bottom centre, 2 tiles wide, with a clear floor tile above it. |
| Building doors | — | Doors you can enter are 2-tile-wide double doors (red, or the world's door colour), with open ground directly in front. |

---

## Priority 1: missing sections (these leave gaps in the worlds)

### Relay Tower (3 renders each): Dustara, Glyphos, Ystra

These follow the same pattern as `Ferrox - Relay Tower - 01/02/03`:
- **01 Exterior:** a 5-tile road runs left edge to right edge across the lower middle (rows 8–12). The tower stands top-centre, with a 2-tile door at its base facing the road and a small plaza in front. A planter or lamp on each side. All other edges are closed.
- **02 Trial Floor:** a room with the doormat bottom centre and stairs up in the top-right corner. Between them is a puzzle-like maze of world-themed obstacles with clear walkways 2 tiles wide.
- **03 Keeper Room:** stairs down at bottom centre and a framed battle court in the middle. There is a raised spot top-centre where the Keeper stands, with decorations around the walls.

**`Dustara - Relay Tower - 01 Exterior.png`**
> A sandstone relay tower in a red-rock desert frontier town. Sun-baked adobe base, copper antenna dish on top,
> woven awnings, cactus planters, dusty sand road with cart ruts, warm late-afternoon light.

**`Dustara - Relay Tower - 02 Trial Floor.png`**
> Inside the sandstone tower: clay tile floor, stacked sandbags, crates and cactus pots forming the maze,
> rope barriers, wooden stairs up in the top-right corner, woven wall hangings.

**`Dustara - Relay Tower - 03 Keeper Room.png`**
> Top floor of the desert tower: a sand-coloured battle court with a sun emblem in the centre, copper braziers,
> rugs and banners, wooden stairs down at the bottom centre.

**`Glyphos - Relay Tower - 01 Exterior.png`**
> An ancient carved stone relay tower among jungle ruins and glowing glyphs. Teal glyph light along its edges,
> vines and moss, a cracked flagstone road, tide pools and ferns as the closed scenery.

**`Glyphos - Relay Tower - 02 Trial Floor.png`**
> Inside the ruin tower: flagstone floor, toppled pillars and glyph blocks forming the maze, small water channels
> (solid), torches, stone stairs up in the top-right corner.

**`Glyphos - Relay Tower - 03 Keeper Room.png`**
> A temple chamber: a battle court inlaid with a glowing glyph circle, carved pillars, hanging vines,
> stone stairs down at the bottom centre.

**`Ystra - Relay Tower - 01 Exterior.png`**
> An ancient crystal spire in a violet crystal world under a red sun. Faceted crystal tower with floating shards,
> crystal-lined sand path, glasswood trees and shard outcrops as the closed scenery.

**`Ystra - Relay Tower - 02 Trial Floor.png`**
> Inside the crystal spire: smooth pale stone floor, crystal clusters and shard pillars forming the maze,
> soft violet glow, crystal stairs up in the top-right corner.

**`Ystra - Relay Tower - 03 Keeper Room.png`**
> The crystal spire's heart: a battle court ringed by a glowing crystal circle, floating shards, ancient carvings,
> crystal stairs down at the bottom centre.

### Helix Hideout (2 renders each): Sporeholm, Glyphos, Halo, Starfall Rift, Apex Array, Ystra

These follow the same pattern as `Ferrox - Helix Hideout - 01/02`:
- **01 Disguised Entrance:** a 5-tile road runs left edge to right edge across the lower middle. Top-centre is an innocent-looking local building (the disguise) with a plain 2-tile door. Subtle hints show it's really Helix: a faint teal light under the door, a hidden camera, cables, a vent. All other edges are closed.
- **02 Secret Lab:** a white and teal high-tech lab blended with the world's materials. Containment tubes along the top wall, a central console, machines around the walls and open floor, with the doormat at bottom centre.

**`Sporeholm - Helix Hideout - 01 Disguised Entrance.png`**
> A cosy mushroom-cap herbalist cottage on a glowing bog boardwalk path (the disguise); mossy road, giant
> mushrooms and glowing reeds around it; faint teal light under the door.

**`Sporeholm - Helix Hideout - 02 Secret Lab.png`**
> A Helix lab grown into a mushroom root cellar: white panels between living roots, spore-sample tubes,
> teal screens.

**`Glyphos - Helix Hideout - 01 Disguised Entrance.png`**
> A dig-camp storage tent and crate shed among sandy ruins (the disguise); flagstone road, palms and glyph stones.

**`Glyphos - Helix Hideout - 02 Secret Lab.png`**
> A Helix lab hidden in an excavated ruin chamber: ancient carved walls with white lab panels bolted on,
> artifact scanners, glyph tablets in containment cases.

**`Halo - Helix Hideout - 01 Disguised Entrance.png`**
> A small white sky-temple chapel on a floating cloud island (the disguise); golden stone road, blossom trees,
> cloud edges as the closed scenery.

**`Halo - Helix Hideout - 02 Secret Lab.png`**
> A Helix lab under a sky chapel: marble floor, gold trim, white lab pods, wind-energy capacitors, teal holograms.

**`Starfall Rift - Helix Hideout - 01 Disguised Entrance.png`**
> A weathered research field station by the glowing crater (the disguise); purple-pink rocky road, seedpod plants,
> rift cracks as the closed scenery.

**`Starfall Rift - Helix Hideout - 02 Secret Lab.png`**
> A Helix lab studying seedpods: pod incubators, rift-energy coils, violet glow mixed with Helix teal.

**`Apex Array - Helix Hideout - 01 Disguised Entrance.png`**
> A snowy maintenance hut beside an observatory dish (the disguise); paved snow road, pine trees, ice cliffs.

**`Apex Array - Helix Hideout - 02 Secret Lab.png`**
> A Helix lab under the summit: frosted steel walls, star-chart screens, telescope-signal interceptors.

**`Ystra - Helix Hideout - 01 Disguised Entrance.png`**
> An abandoned ancient dwelling on a crystal path (the disguise); glasswood trees, crystal outcrops, red sun light.

**`Ystra - Helix Hideout - 02 Secret Lab.png`**
> A Helix lab drilling into crystal: white panels against raw violet crystal walls, fragment extractors,
> shard containment tubes.

### Apex Array homes (2 renders)

Apex towns have more doors than rooms behind them. These match the existing `Interior rooms` set: the doormat is bottom centre, furniture sits along the walls, the centre is open floor, and the rugs are flat.

**`Apex Array - Interior rooms - 04 Family Home.png`**
> A warm mountain family home: timber and stone walls, a fireplace, a dining table, bunk beds, a star-map rug,
> snowy windows.

**`Apex Array - Interior rooms - 05 Stargazer Cottage.png`**
> A small astronomer's cottage: a telescope by the window, bookshelves, a desk with star charts, a cosy bed,
> a moon-pattern rug.

---

## Priority 2: Water Routes (2 renders each, for worlds that have none)

The Hydro-skiff lets the player cross water, so these add surfing areas and water Alienmon.

Pattern, adjusted from `Glyphos - Water Route`:
- **01 Open Water Route:** open water fills the middle. A sandy or rocky shore strip, 5 tiles deep, runs along the left edge and another along the right edge, and these are the exits. The two shores face each other across the water. Add rocks, reefs and a few small islands, each with a patch of tall grass.
- **02 Island Chain:** water everywhere except one bigger island in the centre and three or four small ones. A shore strip on the left edge is the exit, and a short beach on the right edge is a second exit.

Deep water should be obviously deep and blue (or the world's liquid colour). Shores are flat and walkable.

| File name prefix | Look |
|---|---|
| `Dustara - Water Route` | Red-rock canyon oasis lake, turquoise water, palm shores, sandstone cliffs |
| `Ferrox - Water Route` | Industrial coolant reservoir, teal-green water, rusted pylons and pipes, scrap beaches |
| `Neonis - Water Route` | City canal basin at night, neon reflections, concrete quays, floating platforms |
| `Glacia - Water Route` | Icy fjord, dark blue water, ice floes (solid), snowy shores |
| `Umbra - Water Route` | Dark mirror lake, lantern buoys, black sand shores, faint purple mist |
| `Starfall Rift - Water Route` | Crater lake glowing violet, crystal-rimmed shores, seedpods floating |
| `Apex Array - Water Route` | Meltwater tarn under peaks, clear blue water, stone shores, pines |
| `Ystra - Water Route` | Still crystal lake, pale lavender water, crystal reefs, shard islands |
| `Halo - Water Route` | Cloud-sea lagoon: soft white-blue water between floating islands, golden ruins |
| `Helix Station - Water Route` | Station hydro tank / coolant pool, white-teal deck walkways as shores |

For Pyros, use a lava version instead (crossed with the Heat Shield):

| File name prefix | Look |
|---|---|
| `Pyros - Lava Route` | Molten lava flows (bright orange) with basalt shores and islands, ash grass patches |

---

## Priority 3: fix-up scenes (replace a few old maps that read wrong)

**`Dustara - Extra scenes - 07 Sunset Tunnel Mouth.png`** (outdoor, 1536 × 1024)
> A canyon road (5 tiles wide) that enters from the left edge (rows 5–9) and ends at a big dark tunnel mouth
> carved into a red cliff on the right side, with timber supports and a lantern. The right edge is closed by cliff.

**`Umbra - Extra scenes - 07 Abyss Rim Descent.png`** (outdoor, 1536 × 1024)
> The rim of a huge dark sinkhole: a path enters from the top edge (columns 9–13). It leads to carved stone stairs
> spiralling down into the abyss on the left side, with lanterns on posts and mist below.
> Exits: top edge and right edge (rows 8–12).

---

## Checklist when you send them

- Use the exact file names above. A suffix like ` (1)` for a second option is fine, as with the existing set.
- Make every road that touches an edge 5 tiles wide and square to that edge.
- No people, creatures or ball-like items.
