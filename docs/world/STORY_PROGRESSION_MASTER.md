# Alienmon — Story Progression Master (the single source of truth)

> **Story canon:** the Alienmon novels (Books 1-5, planned in `docs/SAGA_MASTER_PLAN.md`) are now the story canon. The books win on story, characters and dialogue; the game data wins on Alienmon types, stats and moves. Every change made to match them is listed in `docs/BOOK_SYNC_CHANGELOG.md`.

This is how the whole game unlocks, step by step, so the story always makes sense and can't be broken. If this file disagrees with another doc, **this file wins**. The machine-readable version is `world_state.json`.

---

## 1. World geography (canon, so travel makes sense)

- **Dustara is home.** Dustmere sits on its canyon rim. A tunnel at the bottom of town leads under the sea to Dustara's volcanic far side: **the Molten Frontier**.
- **The Molten Frontier is the hub region of Dustara.** Its caves, harbor and docks hide ancient **Ystran Relay Gates**: doorways the Alienmon's makers left behind, linked to the Relay Towers.
  - **This is why Signal Shards open new areas:** each Shard strengthens your Linker's resonance, and dormant gates wake up for you.
- **Your own starship** (START → Ship) reaches worlds without a gate. You get launch clearance after your first Shard.
- **Helix's shuttles** (the Fortress Shuttle Pad and the Helix Shuttle Pad) are the only way to reach Helix Station and the Starfall Rift, until you take them.

| Molten Frontier spot | What it is | Leads to | Opens when |
| --- | --- | --- | --- |
| Tunnel to Sunset Canyon | local tunnel | Dustmere | after M03 (rival battle) |
| Palm Isle Recovery Hut | healing | — | always |
| Forge Gate | Relay Gate | Ferrox | after M04, and Forge Miner Dax beaten |
| Port Ember | village + harbor Relay Gate | Thalassa | village always; gate at 2 Shards |
| Deep Sea Ferry | ferry | Glyphos | at 4 Shards (after M09). **M08 cutscene** plays at the dock on the first visit after M07 |
| Magma Mines | deep Relay Gate | Pyros | after M10 (murals) |
| Helix Forge Fortress | dungeon (new interior map) | keycard (M13) | after M12, and the Helix Grunt beaten |
| Fortress Shuttle Pad *(rename from "Fortress Launch Pad")* | Helix shuttle | Helix Station | after M13 (keycard) |
| Shadow Tunnel | Relay Gate | Umbra | at 7 Shards (the mouth is always open; the seal is deeper inside) |
| Helix Shuttle Pad | Helix shuttle | Starfall Rift | after M17 (8 Shards) |

**Ship landing requirements:**

| World | Can land after |
| --- | --- |
| Dustara | always |
| Ferrox | M04 |
| Sporeholm | 1 Shard |
| Thalassa | 2 Shards |
| Neonis | 3 Shards |
| Glyphos | 4 Shards |
| Pyros | 4 Shards + M10 |
| Glacia | 5 Shards |
| Helix Station | shuttle only (M13) |
| Halo | 6 Shards + M15 |
| Umbra | 7 Shards |
| Starfall Rift | 8 Shards + M17 |
| Apex Array | `rift` flag (M19) |
| Ystra | `champ` flag (M21) |

**When a gate, pad or planet is locked:** show the in-world reason from `world_state.json → gates[].blocked_msg`. Never show a bare "Locked".

---

## 2. Step-by-step progression

Columns:
- **Unlocks:** new places and features
- **People change:** who appears, leaves, or says something new
- **Shop:** new shop stock (from the progression pack)

| Step | Main quest | Where | Unlocks | People change | Shop |
| --- | --- | --- | --- | --- | --- |
| 0 | M01 A Partner From the Stars | Dustmere lab | starter, Linker, Bag | Vashti, Sola and Dusty in Dustmere | Stasis, Med Gel, Cure |
| 1 | M02 Zib's Signal | Dustmere bridge | Zib joins | DX-4 hint line | — |
| 2 | M03 First Rival | Dustmere trading post | **Tunnel to the Frontier** | Sola leaves after the battle | — |
| 3 | M04 Into the Molten Frontier | Frontier | Palm Isle Hut, Frontier NPCs | — | — |
| 4 | M05 Sparks on Ferrox | Forge Gate → Ferrox | **Ship launch clearance**; Ferrox side quests; Forgemaul can appear in the wild | Helix scouts seen on Ferrox | Tether, Stun |
| 5 | M06 The Glowing Swamp | Sporeholm (ship) | 2 Shards → **Port Ember gate** | Zib appears in Sporeholm's wild | Harmonic, Mega Gel |
| 6 | M07 Harbor Under Siege | Thalassa | 3 Shards; **Neonis landing** | Vashti moves to Neonis | Revive |
| 7 | M08 Sola's Choice | Deep Sea Ferry dock | `sola_with_helix` | **Sola hidden everywhere until M14** | — |
| 8 | M09 Static on the Line | Neonis Starport | 4 Shards → **Deep Sea Ferry**, Glyphos | Vashti becomes the research giver | — |
| 9 | M10 Murals of Ystra | Glyphos | **Magma Mines** gate | Ystran echo lines unlock (S15) | — |
| 10 | M11 The Light in the Crater | Pyros | 5 Shards → Glacia landing | — | Full Gel |
| 11 | M12 Teeth in the Ice | Glacia | 6 Shards → **Fortress door**, Halo (after M15) | **Grub appears near the fortress** | Singularity |
| 12 | M13 Infiltrate the Forge | Fortress interior | **Helix Keycard → Fortress Shuttle** | — | — |
| 13 | M14 Helix Station | Helix Station | Vex beaten (no Shard) | Rival battle R4 with Sola | — |
| 14 | M15 Sola Turns | Helix Station | `sola_ally`; **Halo landing** | **Sola reappears as an ally** (Neonis and Skyreach lines) | — |
| 15 | M16 Twin Visions | Skyreach Plaza | 7 Shards → **Shadow Tunnel** | — | — |
| 16 | M17 Voices in the Dark | Umbra | 8 Shards → **Helix Shuttle Pad**; Starfall landing | Strand becomes the M18 giver | Max Revive |
| 16b | M17b Harbor Reclaimed (NEW, Book 3) | Thalassa docks | Thalassa's tower core back; the harbor tower relights | Captain Marsh; Strand becomes the M18 giver in Dustmere's plaza | — |
| 17 | M18 Eight Shards Sing | Starfall crater | Novaryx encounter | Sola at the crater | — |
| 18 | M19 Seal the Rift | Starfall | `rift` flag → **Apex Array**; Helix signatures in the wild; Lumivex via S98 | **Helix Grunt replaced**; fortress becomes the Reclaimed Forge (Grub's shop); Technician and Strand get new lines; **Teo and Sola home in Dustmere** | — |
| 18b | M19b Homecoming (NEW, Book 4) | Dustmere, Neonis, Thalassa | Nana Wren's journal, Codex page | Dusty names the Crater Four; DX-4's origin; Thorne's trial; **Vex captured** (moved from the postgame) | — |
| 19 | M20 The Summit | Apex Array | — | Quorum in four halls | — |
| 20 | M21 Prime Linker | Apex Array | `champ` flag → **Ystra**; revisit tier 3 wild tables | Marisol's after-champion line | — |
| 21 | P01–P04 | Ystra, then space | Pillars, Oblivane, Seedmother encounters; Warp Gate teaser | — | — |

**Revisit tier 2** wild tables turn on at 4 Shards (after step 8). See the progression pack.

---

## 3. Continuity fixes for the current build

These are inconsistencies found in today's game data. Claude Code should fix all of them:

1. **Sola at Neonis Starport** is always visible with friendly lines. Hide her from M08 until M15, then show her as an ally.
2. **Legendaries are in random wild pools.** Novaryx is on Starfall, and Terravox, Aquelion, Ignarch, Oblivane and the Seedmother are on Ystra. Empty every `pool.l`. Legendaries become **fixed story encounters** only (rules in `WORLD_POPULATION_RULES.md`).
3. **Signature Alienmon are catchable before their owner is beaten.** Vexhydra can appear on Helix Station before Vex, and the Quorum signatures before the Summit. Gate each signature's wild appearance on beating its owner (list in `world_state.json → data_fixes`).
4. **Keeper team levels** in `planets.json` are above the progression targets: Moor 18, Marsh 24, Static 28, Ingrid 38, Vex 40, Kade 48 and Orra 58. Set them to the progression aces (17, 21, 25, 35, 36, 45 and 60).
5. **The Apex NPC (Marisol)** says "The Quorum stepped aside for you" before you fight them. Use the line "The Quorum waits in four halls" until M21.
6. **The "Fortress Launch Pad"** lets you fly from a villain base in Act 1. Rename it the **Fortress Shuttle Pad** (Helix Station, after the keycard). General space flight uses START → Ship once clearance is granted at M05.
7. **The fortress entrance currently drops you straight on Helix Station.** It should open the Fortress interior dungeon (M13). The station is reached only by the shuttle.
8. **`UNLOCK_ALL=true`** lets players skip the story. Make it false by default, with a "Free roam (playtest)" option in Options for testers.
9. **Losing a battle sends you to the landing pad.** Instead, return to the **last Recovery Bay or Hut used** (`G.lastHeal`), like the classic games.
10. **Vashti's Dustmere line about Ferrox** only fits after M03. Give her stage-based lines from `world_state.json → npc_states`.

---

## 4. Rules that keep the story clean

- **Main quests are strictly linear** (each `prereq` is the previous main quest). Side quests never block the main story, and the main story never needs a side quest.
- **One active main objective at a time**, shown by the tracker so the player always knows where to go next. If the player is lost, any Recovery Bay nurse repeats the current objective ("Dr. Vashti was hoping you'd check the Neonis Starport...").
- **No dead ends:** every locked gate tells you what's needed, and every area has a way back to a Recovery Bay or Hut and to the Frontier, or to your ship once it's unlocked.
- **NPCs change with the story:** use `npc_states` (visible ranges and dialogue per stage). An NPC who leaves in the story disappears from their old spot.
- **Bosses are one-time; Keepers can be rematched after the Champion** (postgame tier).
- **Never lose story items:** key items can't be discarded or sold.
- **Save anywhere except mid-cutscene and mid-battle.** Autosave after every main quest step and every Shard.

---

## 5. Book canon additions

- **New main quests:** M17b Harbor Reclaimed (after M17, before M18) and M19b Homecoming (after M19, before M20).
- **New side quests:** S53 Glitchbug Outbreak (Neonis, after M09); S102 The Keepers' Call (after M17b; finishing it adds the Keepers singing to the sealing).
- **Story scenes** that play once when you walk into a section live in `data/story.json`.
- Full list of changes: `docs/BOOK_SYNC_CHANGELOG.md`.

## 6. Seedmother revision (docs/SEEDMOTHER_REVISION.md)

- **Heartroot counter:** species caught plus story legendaries befriended (a calmed Novaryx or Oblivane), out of every species in the game, so new generations raise the total. It is shown in START > Xenodex (press A). Data lives in `world_state.json` under `heartroot`.
- **Blooms:** at each sixth of the total, part of Ystra blooms (flags `bloom_1` to `bloom_6`) and a Ystran echo returns there.
- **P03 is now The Reunion** (Heartroot, the Reunion cutscene, then the children's choice). It never needs a full Xenodex.
- **Unifier:** every species after P04 unlocks the bonus epilogue, the Unifier title and a golden Linker (flag `unifier`).
