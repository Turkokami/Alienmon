# Alienmon — Placing NPCs and Alienmon on every world

Rules for where people and creatures go on a map and how they behave, so every planet feels alive and fair. They follow the classic handheld RPG conventions.

---

## 1. Every world needs these places
Build every planet map, tile or painted, with:

1. **A landing spot:** the ship pad or Relay Gate exit, with a short safe area of at least 4 tiles with no wild encounters.
2. **A town:**
   - **Recovery Bay:** a nurse inside heals and saves, and a Move Archive NPC is beside her.
   - **Shop:** shopkeeper; stock depends on Shard count.
   - **3–6 townsfolk:** hints and lore.
   - **1 story NPC:** the planet's `npc` from `planets.json`, with stage-based lines.
3. **2–3 routes or zones** between the town and the landmark, each with drift grass or its biome's encounter zone, and trainers.
4. **The Relay Tower or landmark** at the far end from the landing spot, so the player crosses the world to reach it.
5. **One optional area:** a cave, a ruin, or a beach that holds the rare Alienmon and side-quest props.

**Layout rule:** landing spot → town → route 1 → route 2 → tower. Difficulty rises the further you get from the landing spot.

---

## 2. NPC types and behavior

| Type | Where | Behavior |
| --- | --- | --- |
| **Nurse** | Recovery Bay counter | Stationary. Heals the party and storage, saves `G.lastHeal`, repeats the current main objective |
| **Shopkeeper** | Shop counter | Stationary. Stock comes from the shop unlock table |
| **Townsfolk** | Town plazas, doorways, benches | Wander within 2 tiles of home, or stand and turn every few seconds. 1–2 lines each: hints, lore, the next step |
| **Story NPC** | Fixed spot per quest stage | Visible only in its stage range (`npc_states`). Shows a quest marker (! / ?) |
| **Route trainer** | Beside paths, facing the path | Stationary, sometimes turning. **Line of sight** 3–5 tiles straight ahead. When the player enters it: "!" bubble, the trainer walks up and battle starts. Battles once; afterwards gives a tip line |
| **Gatekeeper** | Standing in a chokepoint | Blocks the path until a condition is met (`gates`). Steps aside with a line when it's met |
| **Keeper** | Top of the Relay Tower | Battle once for the Shard; postgame rematch |
| **Wandering Alienmon (decor)** | Town edges | Small friendly creatures that bob around, can't be caught. Makes towns feel alive |

**Placement rules:**
- Never put an NPC on a doorway, a stair, or the only tile of a 1-tile path, unless it's a gatekeeper.
- Keep at least 2 tiles between NPCs. On painted maps, keep at least 26 px apart (the Frontier map already follows this).
- Trainers face paths, not walls. **The player must be able to walk around a trainer's line of sight** if they want to avoid them, except designated "must-fight" trainers before Keepers.
- **Trainer count per world:**

  | World levels | Trainers |
  | --- | --- |
  | early (Lv 2–15) | 3–4 |
  | middle (Lv 15–35) | 5–6 |
  | late | 6–8 |

  The Keeper's tower adds 2 apprentice trainers before the Keeper.
- **Trainer teams** come from that world's encounter table and level band (`progression.json → areas.<key>`):
  - Team size: early 1–2, middle 2–3, late 3–4.
  - Each trainer has a **class + name** (Linker Kai, Miner Bo, Scientist Rhee, Helix Grunt), using existing character art keys.
  - Each team has a theme: a miner uses Gravity and Magma, a swimmer uses Hydro.

---

## 3. Placing Alienmon (wild encounters)

**Encounter zones** are drawn areas on each map. Each zone has an `id`, a biome type and a level offset:

| Zone type | Where | Notes |
| --- | --- | --- |
| Drift grass | grass patches beside paths | the main zone; every route has 2–3 patches |
| Cave floor | inside caves | the whole floor is a zone, at a slightly lower rate |
| Shoreline / shallows | beaches, docks | Hydro-leaning table |
| Lava edge, ice field, ruins, crystal | biome specials | uses the biome-flavored part of the table |
| Deep water | open sea | **later**, needs the Hydro-skiff Linker module (section 5) |

**Rules:**
- **No encounters** in towns, on paved paths, on stairs, inside buildings, within 4 tiles of a landing spot or gate, or before the player has a starter.
- **Rate:** when moving in a zone, roll every 16 px walked (one tile). The chance is **8% in drift grass** (classic tall-grass feel), 5% in caves, and 6% on shorelines. The Molten Frontier trail rate (7% per 22 px) is close to this already.
- **Grace period:** no new encounter for 6 tiles after any battle or after leaving a menu.
- **Which Alienmon appears:** roll the zone's table from `progression.json` (tier 1, then tier 2 after 4 Shards, then tier 3 after Champion). Weights:
  - common: 10
  - evolved: 4
  - rare: 1
  - signature: only once its owner is beaten
- **Level:** random within the table's range, +1 for each zone further from the landing spot, capped at the table maximum.
- **Signal Jammer** (a new shop item, 2 Shards, 35 stardust): no encounters with Alienmon below your lead's level for 200 tiles. The classic repel.
- **Day/night (optional, uses the device clock):** a few Void and Psi Alienmon appear only at night, and some Bio and Plasma only by day. Mark them in the table with `time: night/day`.

### Fixed encounters (visible on the map)
- **Hotspot battlers**, like the pink Alienmon in Dustmere and the plaza creatures in Skyreach, use the world's table at the area's upper levels. You can battle them again after leaving and returning. Interact with them to fight.
- **Legendaries** (remove them from random pools):

  | Legendary | Where | When |
  | --- | --- | --- |
  | Novaryx | Starfall crater rim | M18, Lv 50 |
  | Terravox | Ystra floating continents | postgame, Lv 60 |
  | Aquelion | Ystra seas | postgame, Lv 60 |
  | Ignarch | Ystra sun-forge | postgame, Lv 60 |
  | Oblivane | Ystra, edge of the void | P02, Lv 70 |
  | Seedmother | Ystra crystal grove | after P03, Lv 75 |

  Each appears as a visible sprite and needs **3 Syncs in a row** to capture.
  - If the player defeats a legendary instead of catching it, it comes back after the next Shard or the next postgame quest. It is never lost forever.
- **Gifts:**
  - Zib (M02)
  - 2 freed captives (S90)
  - Lumivex (after S98)
  - one fossil revival on Glyphos (postgame, optional)

---

## 4. Per-world population

For each planet, use `progression.json → areas.<key>` for wild Alienmon, trainer levels and team sizes, and `quests.json` for quest NPCs and props at their listed spots.

**Painted maps already built:** Dustmere, Skyreach Plaza, Neonis Starport and the Molten Frontier. Their NPCs and hotspots are in `data/painted_maps.json` and `data/world_map.json`.

**New painted maps** from `MAP_AND_PLANET_PROMPTS.md` need:
- walk mask
- grass/zone mask
- hotspots: bay, shop, keeper, story NPC, trainers, decor
- quest prop spots

Claude Code draws these masks the same way as the existing maps.
