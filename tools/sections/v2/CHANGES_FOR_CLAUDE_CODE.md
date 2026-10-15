# Mapupgrade3: changes for Claude Code

**Hand to:** Claude Code in the Alienmon game project, once the v2 renders are saved over `art/sections/...`.
**Source of truth:** `atlas.json` in this pack (version 2). The book is story canon, so where a render and the old map data disagree, follow the render and this atlas.

## 1. Grid rules (every section)
- Edge exits are 6 tiles wide: left/right edges use rows 5–10 and top/bottom edges use columns 5–10. Each band still contains the old rows/columns 7–8, so existing connections keep working, but widen the trigger zones to the full band.
- Tower stairs in the top wall are 4 wide (columns 6–9).
- Interior doormats sit at columns 7–8, row 14. Internal stairs, ladders and hatches use the tiles listed per room in `atlas.json`.
- Building doors are 2 tiles wide. Rebuild collision for each new render. Walkways are at least 4 tiles wide, so the player (1×1.5) must never snag.
- Movement is 4-directional. Every walkway is axis-aligned, so collision can be tile-based with no diagonal slopes.

## 2. Ghost exits removed
- **"Arrival" edge exits are gone.** 14 sections had a left or bottom edge leading to "arrival (landing pad / gate)", which went nowhere. They now have an in-map `arrival_point` (landing pad, Relay Gate ring, jetty, docking pad, lift platform, or the Shadow Tunnel archway in 123). Spawn the player there after flight or warp, and open the ship/warp menu there. The edge behind it is solid. The sections are 004, 029, 041, 052, 062, 072, 082, 093, 105, 114, 123, 136, 146 and 153, plus 169.
- **Drawn doors with no room are gone.** Mines, ruins, shrines and caves (34 in `door_plan.json`) are no longer drawn. Remove their "caved in / sealed" messages. 023 Fortress Gate now shows a solid white wall with no blast door.
- **House doors only appear in towns** (1–2 per town, using the planet's shared house room). The house doors on 007, 022, 026, 029, 072, 127, 128 and 145 are gone.
- **Duplicate Recovery Bay counters dropped:** 053 and 063 already have real Recovery Bay rooms (054, 064). The Docking Ring's shut shop front (105) is also gone.
- The `doors` and `warps` entries in `atlas.json` are now the complete list of enterable points per map. Wire every one, and nothing else.

## 3. Interior exit fixes
| Room | Before | Now |
|---|---|---|
| 001 Your House 1F | doormat only | doormat + stairs up (top-right) → 002 |
| 002 Your House 2F | doormat "back outside" (wrong) | stairs down only (top-right) → 001 |
| 005 Dustmere Recovery Bay | doormat | doormat + attic ladder (top-right) → 165 |
| 165 Recovery Bay Attic | | floor hatch (bottom-left) → 005 |
| 107 / 108 Helix Labs | both had doormats | 107: doormat + stairs up; 108: stairs down only |
| 147–150 Observatory Halls | all had doormats | 147: doormat + up; 148/149: down + up (alternating corners); 150: down only |
| 081 Mural Hall | doormat "outside" | round stone doorway → 080 (book: the hall is behind the round door in the deepest temple chamber) |
| 167 / 168 | | stairs / gangplank → 052 berth |

## 4. Book canon applied to the art
These are art changes only. Story data was already synced in `ALIENMON_BOOK_SYNC_CHANGES.md`.
- **007 Dustmere Bridge:** an ancient pale-stone arch with no railings, carved swirls glowing electric blue, spanning a deep canyon. It is no longer a wooden-and-brass bridge with rune lamps.
- **004 Dustmere:** honey-sandstone domes, a white Recovery Bay with a blue cross, the Observatory up a flight of steps, the Bonfire Ring, and the Reyes house (166) next door to the hero's.
- **001–003:** no TV, game console or Starfall poster. The bedroom has a bunk bed and a telescope by a round window. In the lab, the capsules sit on velvet cushions on a brass table, beside a round green-screen computer.
- **012/013 Sunset Tunnel:** purple stone with blue-flame lanterns on iron hooks.
- **041 Landing Bog:** you land on top of a giant glowing mushroom cap. In **042 Mirefen**, the huts sit on the mushroom caps and the Spore Choir platform is the central cap.
- **052 Port Saltreach:** sunny with clear water. It was never fog-bound in the book.
- **078–080 Temple of Voices:** the temple goes DOWN into the ground, so the top stairs now lead deeper. The section names and IDs stay the same. 080 is a puzzle chamber with no Keeper ring.
- **105–113 Helix:** "the Station" is a silver twisting-ladder station, white inside.
- **140 Teo's Old Camp:** six years abandoned.
- **153–163 Ystra:** barren gray crystal, per the Seedmother Revision. 163 is the empty crater with the faint Heartroot glow.
- Every planet now uses its own building style. The Dustara cream-dome look was being applied everywhere.

## 5. Bigger book-vs-map conflicts (not changed, decide later)
These would change the section graph, so v2 keeps the current connections:
- In the book, the Dustmere bridge sits at the canyon bottom down a path behind the bakery, the road out goes west to the Sunset Tunnel, and the Cactus Gardens are out the back past the Gateposts.
- The Book 1 ghost-ship logbook is in the ship's hold (167), not the lighthouse (056).
- The saga places Grub's junk trading at Port Ember. The game has Grub's Workshop on Ferrox (033).
- In the saga, Kade's Lab is at the bottom of the Sinkhole. In v2 its door is in 132 Sinkhole B4.
- In the saga, Vex fights on the Observation Deck and escapes. The game keeps a separate 113 arena.
- Book 1 says Nana Wren's notebook is locked in the Dandelion's drawer, while the saga finds her journal in the attic (165).
