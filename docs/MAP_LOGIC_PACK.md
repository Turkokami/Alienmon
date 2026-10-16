# Alienmon Map Logic Pack v1
*Built from a study of every Game Boy / GBA Pokémon map set on VGMaps.de (8 games, ~1,050 map entries), cross-checked against exact map dimensions in the community disassemblies of the same games (pret/pokered, pokecrystal, pokeemerald). Written to hand straight to Claude Code for the Alienmon build.*

---

## 0. What was studied

| Game | Platform | Maps on VGMaps | What it's good for |
|---|---|---|---|
| Red / Green / Blue | GB | 186 | Cleanest template: every town, route, and interior as its own section |
| Yellow | GB | 52 | Same world, shows how a remix reuses layouts |
| Gold / Silver | GB(C) | 125 | Two regions linked; gyms as separate puzzle maps |
| Crystal | GB(C) | 124 | Same as G/S plus Battle Tower |
| Trading Card Game | GB | 1 | Hub-and-node overworld (not a walking-route model) |
| FireRed / LeafGreen | GBA | 135 | Gen 1 world rebuilt at GBA size; multi-floor dungeons broken out by floor |
| Ruby / Sapphire | GBA | 263 | Water routes, underwater layers, tide states, puzzle houses |
| Emerald | GBA | 166 | Best "extra content" sections: optional caves, islands, frontier |

**Note on method:** The map images themselves are on a host this workspace can't download from, so the numbers below come from the games' source data (exact), and the layout patterns come from the map catalog plus well-documented knowledge of these maps. Upload 5–10 map screenshots anytime and I'll add a pixel-level pass.

---

## 1. Hard numbers (all converted to walk-steps; 1 step = one 16×16 px tile)

### Screen size
- **Game Boy:** 160×144 px = **10 × 9 steps** on screen. Player is drawn just off-center.
- **GBA:** 240×160 px = **15 × 10 steps** on screen.

### Gen 1–2 maps are built from screen-sized chunks
Gen 1/2 store maps in 2×2-step "blocks." Every outdoor map is a multiple of **10 steps wide × 18 steps tall** (one block-chunk = 5×9 blocks). This is why everything feels tidy: maps snap to screen multiples.

| Map | Steps (W × H) | Shape |
|---|---|---|
| Pallet Town / Lavender / Cinnabar / New Bark | 20 × 18 | Small town = 2×2 screens |
| Viridian / Pewter / Cerulean / Vermilion / Saffron / Fuchsia / Goldenrod | 40 × 36 | City = 4×4 screens |
| Celadon (biggest Gen 1 city) | 50 × 36 | |
| Cherrygrove / Azalea | 40 × 18 | Long thin town |
| Route 1 | 20 × 36 | Short starter route |
| Route 2 / 10 | 20 × 72 | Vertical route |
| Route 3 / 4 | 70–90 × 18 | Horizontal route |
| Route 12 | 20 × 108 | Long vertical (fishing pier) |
| Route 17 / 23 | 20 × 144 | Longest (Cycling Road, Victory approach) |
| Route 20 (sea) | 100 × 18 | Water route |
| Viridian Forest | 34 × 48 | Maze-forest |
| Ilex Forest / National Park | 30 × 54 / 40 × 54 | |
| Mt. Moon 1F | 40 × 36 | One cave floor = one city-sized map |

**Key ratio:** a Gen 1 route is **20 steps wide** (2 screens), and the walkable lane inside it is usually **2–4 steps** wide. The rest is trees, ledges, grass, and water framing.

### Gen 3 (GBA) maps
Stored directly in steps. Sizes snap to multiples of 10/20.

| Map | Steps (W × H) |
|---|---|
| Littleroot / Oldale / Dewford / Verdanturf / Fallarbor / Lavaridge | 20 × 20 |
| Petalburg City | 30 × 30 |
| Mauville / Fortree | 40 × 20 |
| Rustboro / Slateport | 40 × 60 |
| Lilycove (largest city) | 80 × 40 |
| Route 101 (starter) | 20 × 20 |
| Route 102 / 103 | 50 × 20 / 80 × 22 |
| Route 104 / 110 / 120 | 40 × 80–100 |
| Route 111 / 119 | 40 × 140 |
| Route 113 / 123 | 100–140 × 20 |
| Petalburg Woods | 48 × 44 |

### Interiors (steps)

| Building | Gen 1 | Gen 2 | Gen 3 |
|---|---|---|---|
| Player house (per floor) | 8 × 8 | 10 × 8 | 11 × 9 |
| Healing center (Pokémon Center) | 14 × 8 | 10 × 8 | 14 × 9 |
| Shop (Mart) | 8 × 8 | 12 × 8 | 11 × 8 |
| Professor lab | 10 × 12 | 10 × 12 | — |
| Gym | 10 × 14 to 20 × 18 | 10 × 16 | 11 × 20 (up to 9 × 112 for room-chain gyms) |
| Route gatehouse | 8 × 6 to 10 × 8 | 10 × 8 | — |
| Department store floor | — | 16 × 8 | — |

**Takeaway:** interiors are tiny — one screen or slightly more. They never feel empty because every one is packed with furniture along the walls.

---

## 2. The patterns (how the maps are built)

### 2.1 World graph
- The world is a **chain of nodes** (towns) joined by **edges** (routes). Mostly linear for the first third, then branches open, then loops close back so the player can return fast.
- Every town has **2–4 exits**. Every route has **exactly 2 main ends** (plus optional side branches).
- Dungeons (caves, forests, towers) sit **on** routes as an alternate section the route passes through — the player must go through, not around.
- Region maps (Kanto, Johto, Hoenn "In-Game Map" entries) show the overworld is planned first as a node graph, then each section is drawn to fit.

### 2.2 Section seams (how maps connect)
- **Edge connections:** routes and towns join at a shared edge. The road lines up exactly across the seam — same x position, same width. You walk off one map onto the next with no loading screen.
- **Warps:** doors, cave mouths, stairs, ladders. Always a 1-tile trigger with a matching arrival tile on the other side.
- **Rule seen everywhere:** every edge exit and every warp has a destination. No dead seams. (This matches your "no ghost exits" rule.)

### 2.3 Towns
Standard kit, in this order of importance:
1. **Healing center** — near the main entrance the player arrives from, on the main road.
2. **Shop** — close to the healing center (usually same block).
3. **Gym / boss building** — largest footprint, usually at the far end or center so the player passes everything else on the way.
4. **2–4 houses** with talkable NPCs (hints, trades, gifts).
5. **1 landmark** (lab, museum, tower, lighthouse, dock) — gives the town its identity.
6. **Signs:** a town sign at each entrance, one on each major building.
7. **Decor:** flower beds, fences, trees framing the border, a pond or water edge, benches.

Layout grammar:
- Main road runs **between** the town's entrances; buildings line the road with doors facing the road.
- **Doors face south** (bottom of the building). The player walks up into them and comes out facing down. Exterior footprint is roughly 4×4 steps for a house in Gen 1, about 5×4 to 6×5 in Gen 3, with the gym or landmark about 1.5–2× bigger.
- Town borders are solid tree/rock/water walls with gaps only where exits are.

### 2.4 Routes
Route archetypes found across all 8 games:

| Type | Example | Recipe |
|---|---|---|
| Starter lane | Route 1, 101, 29 | Short, 1–2 grass patches, ledges that make a one-way shortcut home |
| Trainer gauntlet | Route 3, 4, 24/25 | Straight path, trainers spaced so each sightline covers the lane |
| Maze / branching | Route 9, 110, 119 | Multiple lanes, cut-trees or boulders to gate side areas |
| Water route | Route 19–21, 124–134 | Surf lane with small islands; dive spots in GBA |
| Long-haul | Route 12, 17, 111 | 100+ steps; broken into themed sub-zones (pier, desert, bridge) |
| Gated route | Route 5–8 | Gatehouses between route and city |
| Bridge / pier | Route 12, 24, 110 | Raised path over water, fishermen trainers |

Common route ingredients:
- **Tall grass patches** (wild encounters): some avoidable, some forced. First route always has an avoidable path.
- **Ledges:** one-way hops downward (south). Used to make the return trip faster and to stop backtracking cheats.
- **Trainers** facing the path, with a sightline of 1–5 tiles. They are spaced so you rarely see two at once.
- **Items** sitting at dead ends and behind small detours — this is what makes dead ends feel worth it.
- **Hidden items** on odd tiles (end of a fence, a lone rock).
- **Signs** at both ends with destination names.
- **Gate obstacles** that need a later ability (cut tree, boulder, water, whirlpool, waterfall) to send the player back later.

### 2.5 Dungeons
- Broken into **separate floor maps** (Mt. Moon 1F/B1F/B2F, Silph Co. 1F–11F, Pokémon Tower 1F–7F, Seafloor Cavern 1–9).
- Each floor is about one city-sized map (Gen 1 Mt. Moon 1F = 40×36).
- Floors connect by ladders/stairs. Most floors have **2–4 ladders**, and only one of them leads onward.
- Dungeons use **state variants**: high/low tide (Shoal Cave), before/after an event (Lilycove, Saffron), underwater layer (Routes 124–134).

### 2.6 Interiors
- Player **enters on a door mat at the bottom center** of the room.
- Furniture lines the **top wall and side walls**, and the middle stays open for walking.
- Healing center: counter across the top, healer center-top, machine beside the healer, PC terminal on one side, benches/plant by the door.
- Shop: clerk behind a counter next to the door, shelves filling the rest.
- House: table + chairs, TV/bookshelf on the top wall, plant in a corner, 1–2 NPCs, stairs in a top corner if it has a second floor.
- Gym: entry hall with a guide NPC, a **puzzle** (switches, spinning tiles, invisible walls, ice, teleport pads), trainers along the puzzle path, the leader at the far end (usually top).

### 2.7 NPC roles
Every NPC does one of these jobs (none are pure filler in the best maps):

| Role | Where they stand | Behavior |
|---|---|---|
| Guide | Town entrance, gym entry | Static, explains a mechanic |
| Blocker | Choke point to unfinished area | Steps aside after a story flag |
| Trainer | Routes, dungeons, gyms | Faces a direction, triggers on sight |
| Hint giver | Houses, healing center | Static or 2-tile wander |
| Gift / trade | Houses | One-time event |
| Ambient walker | Town streets | Random walk in a small box (3×3 to 5×5) |
| Shopkeeper / healer | Behind counters | Static, faces down |
| Rival / boss | Story trigger tile | Scripted walk-in |

Density guide (from the maps):
- **Small town:** 4–6 outdoor NPCs, 1–3 per interior.
- **City:** 8–15 outdoor NPCs.
- **Route:** 3–8 trainers plus 0–2 non-battle NPCs.
- **Dungeon floor:** 2–6 trainers plus items.

---

## 3. Alienmon adaptation rules
Your standing rules come first. Everything below takes the Pokémon patterns and fits them to those rules.

### 3.1 Scale
Your paths are 6 tiles wide (about 3× Pokémon's 2-tile lanes). Scale **outdoor maps ×2.5–3**, but **do not** scale interiors by the same amount — big empty rooms are exactly what you don't want.

| Section type | Pokémon size (steps) | Alienmon target (tiles) |
|---|---|---|
| Main walking path | 2–4 wide | **6 wide** (main), 4 wide (side branches), never under 3 |
| Small town / outpost | 20 × 18–20 | **50 × 45** |
| City / hub | 40 × 36 | **90 × 80** (or split into 2–4 sections) |
| Short route | 20 × 36 | **50 × 90** |
| Long route | 20 × 108+ | Split into **3–5 sections** of about 50 × 90 each, each with its own theme zone |
| Dungeon floor | 40 × 36 | **70 × 60** |
| House interior | 8–11 × 8–9 | **14 × 11** |
| Healing center | 14 × 8–9 | **20 × 13** |
| Shop | 8–12 × 8 | **16 × 12** |
| Gym / boss arena | 10–20 × 14–20 | **24 × 30** (puzzle path is 4 wide) |
| Gatehouse / airlock | 8–10 × 6–8 | **14 × 10** |

**Camera:** keep the classic zoomed-in feel. Show about **15 × 10 tiles** on screen (GBA framing), and scroll the map under the player. With 6-tile paths, the path takes up 40–60% of screen width, which reads clean on a phone.

### 3.2 Paths
- Main path is 6 wide. It may run diagonally in short stretches (step diagonals: 2 tiles across, 2 down, repeat).
- **Break straight lines:** every 12–20 tiles of straight path, add one of: a 1–2 tile jog, a widening (plaza, clearing), a prop island in the middle, or a curve.
- **Lamp posts** along walkway edges every 8–10 tiles, staggered left and right, set just off the path (never on it).
- Paths line up **exactly** across a seam: same tile position, same width, on both sections.

### 3.3 Exits (no ghost exits)
- Every exit is listed in the section's data with a `target_section` and `target_entry`. A build check fails if any exit has no target, or if the target doesn't link back.
- Edge exits are a full 6-tile-wide opening. Mark them visually (path continues to the edge, plus a sign or lamp pair).
- Anything that looks like an exit but isn't (a path to the edge, a cave mouth, a door) must be blocked visibly (fence, rubble, locked door with a "closed" sign) or be real.

### 3.4 Extra sections per world (from Emerald/FRLG optional content)
Each world gets, beyond its main chain:
- **2+ dead-end pockets** with a reward: item, rare Alienmon grass, hint NPC, or lore object.
- **1+ water-edge section** (shore, lake, coolant canal, lava lake on hot worlds) for fishing/surf-type encounters later.
- **2+ wildlife zones**: grass (or the world's equivalent) patches of 6×6 to 12×10, at least one avoidable, one forced.
- **1 optional cave/ruin** with 1–3 floors.
- Save renders to a per-world folder like `Dustara - Extra scenes`.

### 3.5 No empty scenes (prop rules)
- **Outdoor:** at least 1 prop cluster per 10×10 tile area that isn't path. Cluster = 2–4 props from that world's set.
- **Towns:** at least 2 everyday objects near every building (cart, bench, crate, planter, sign, mailbox, antenna).
- **Plazas:** one centerpiece (fountain, beacon, statue, crashed probe) plus 4+ smaller props around it.
- **Interiors:** fill the top wall fully, use 50–70% of the side walls, and keep a 4-wide open lane from the door to every NPC and object you can interact with.

### 3.6 Per-world prop sets (template)
Fill one of these in for each planet:

```
World: Dustara
  ground: sand, cracked clay, metal grate
  border: mesas, rusted hull walls, dune ridges
  path edge: rope posts, solar lamps
  street props: water condenser, scrap cart, awning stall, crate stack, wind chime
  plaza centerpiece: old ship engine fountain
  wild zone: tall dune grass / glowing scrub
  water-edge: oasis pool / coolant canal
  interior kit: hammock, salvage shelves, holo-table, cooler
```

### 3.7 NPCs for Alienmon
Keep the Pokémon role table (2.7). Apply your tone rules:
- **Helix grunts:** blocker or trainer role, serious dialogue, guarding things that matter in the story (never comic filler).
- Every town has at least one NPC tied to the **Seedmother / Ystra** lore thread so the world matches the book canon.
- Ambient walkers move in boxes no bigger than 5×5, and never inside the 6-wide main lane's center 2 tiles (keeps traffic clear).
- Trainers' sightlines: 3–6 tiles (scaled up from Pokémon's 1–5 to match wider paths). Space trainers so that at most one sightline covers any single lane tile.

---

## 4. Construction algorithm (step by step)

1. **World graph first.** List sections as nodes: towns, route sections, dungeon floors, extras. Draw edges for every exit. Check: every node reachable from the start; each main-chain node has ≥2 exits; extras have exactly 1 entrance (dead ends) or loop back.
2. **Size each section** from the table in 3.1. Snap width/height to multiples of 5.
3. **Place seams.** For each edge, fix where the 6-wide opening sits on both sections.
4. **Lay the main path** between seams. Add diagonals and jogs (3.2).
5. **Frame the borders** with world terrain (trees, rocks, hull walls, water). Leave openings only at real exits.
6. **Place buildings** (towns): healing center + shop near the arrival entrance, landmark and gym at the far end/center, houses along the path. Doors face the path, with a 2-tile apron in front of every door.
7. **Place wild zones and water** off the main path. At least one avoidable route around each forced grass zone, except where the story wants a forced encounter.
8. **Add ledges/one-way shortcuts** that return toward the last healing center.
9. **Place trainers and story NPCs** using the role table. Check sightlines.
10. **Place items** at dead ends and detours. 1 visible item per 2 dead ends, 1 hidden item per section.
11. **Dress with props** (3.5), then lamp posts (3.2).
12. **Build interiors** for every door (door mat bottom center, furniture top/sides, open center lane).
13. **Run the validation checks** (section 5).

---

## 5. Validation checklist (make these automated build checks)

- [ ] Every exit/warp has a target, and the target has a return link.
- [ ] Seam openings match position and width on both sides.
- [ ] Main path ≥ 6 wide everywhere (side paths ≥ 4, nothing walkable < 3).
- [ ] No straight path run > 20 tiles without a jog, widening or prop island.
- [ ] Lamp posts every 8–10 tiles along walkways, none blocking a path.
- [ ] Every door has a 2-tile apron and an interior map.
- [ ] Every 10×10 non-path area has ≥ 1 prop cluster; every building has ≥ 2 nearby props.
- [ ] Each world has ≥ 2 dead ends with rewards, ≥ 1 water-edge section, ≥ 2 wildlife zones.
- [ ] Start → every main section reachable (flood fill over walkable tiles + warps).
- [ ] No NPC wander box overlaps a door apron or the center of the main lane.
- [ ] No two trainer sightlines overlap on the same lane tile.
- [ ] Interior: clear 4-wide lane from the door mat to every interactable.

---

## 6. Data format
See `alienmon_map_section.schema.json` (same folder) for the section file format Claude Code should read and write. The `example_section.json` file shows one filled-in town section. `validate_maps.py <folder>` runs the section 5 checks; run on the lone example it correctly flags the 5 neighbor sections that don't exist yet as ghost exits.

---

## Sources
- [VGMaps — Pokémon search results](https://vgmaps.de/search/results?q=Pokemon) and the 8 game pages linked from it
- [pret/pokered map constants](https://github.com/pret/pokered/blob/master/constants/map_constants.asm)
- [pret/pokecrystal map constants](https://github.com/pret/pokecrystal/blob/master/constants/map_constants.asm)
- [pret/pokeemerald layouts](https://github.com/pret/pokeemerald/blob/master/data/layouts/layouts.json)
