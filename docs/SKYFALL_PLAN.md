# Skyfall: living-sky features (src/skyfall.js)

Six features. All names are working titles and need the owner's OK before launch.

| Feature | Status | How it works |
|---|---|---|
| Skyfall Fronts | built | Each world has its own sky event. Fronts run in 2-hour windows, and about 40% of worlds have one at a time. While a front is on: its two types do 1.3x damage in battles on that world, Alienmon of those types appear twice as often, and the map gets a tint and particles. |
| Skyfall pods | built | During a front, about 45% of outdoor maps get one pod. Step on it: 60% chance of a rare Alienmon (3x Prismatic odds), otherwise items and Stardust. One pod per map per window. |
| Signal Storms | built | One reachable world per 3-hour window hosts a colony of one Alienmon from the rarer half of its wild list. The colony moves to a new map every hour (a trail of 3 maps). The 6th meeting brings out the leader (+5 levels, 8x Prismatic odds). Announced on the Linker. |
| Signal Diving | built | Unlocks with the Bubbub Ride. Gear > Signal Dive while facing water. A three-pulse timing game; each lock shifts the pull toward rarer signals. The antenna improves at 5 Shards (Mk 2) and 10 Shards (Mk 3), which widens the target band. |
| Shard Resonance | built | Battle Bag, once per battle. Calls down any earned Shard's world sky for 5 turns, overriding the local front. |
| Rift Breaches | built (test branch only: needs the real-time arena) | At Starfall Rift, every other 2-hour window, one map gets a tear (needs 9 Shards for the alert). It's a real-time arena fight: you plus 3 Linkers' Alienmon against a corrupted giant that takes 1/6 damage. Calm it and it joins you. |
| World-Echo forms | art pending | Prompt pack docs/echo_prompts (14 Echoes, one per world). Code to add the Echo forms once the renders arrive. |

Gear > Sky Report lists the current fronts, the storm's location and how long until it moves, and any open rift.
Hooks: `skyStep` (sections.js secArrive), the `skf` weight (secWildPick), `skyGround` and `skyDraw` (drawSec), `skyMod` (act), `skyBattleStart` (startBattle), `skyEndTurn` (endTurn), the 'reso' bag entry, the 'dive' scene in loopBody, and arena opts.rift.

## Species added after the 322 (fixed order, because saves store species by position)
- #323-336, World-Echo forms (data/echoes.json, tools/echo_cut.py): rare wild on their own world (~3.5%). Lumislug, Monolet and Vialit borrow their base sprite and stay out of the wild until their front art is re-delivered.
- #337-364, Holopup's world line (data/holopup_line.json, tools/holo_cut.py): Party > Holopup > "Attune a Shard" (any earned Shard; Dustara, Glyphos and Ystra count once reachable) turns it into the world form and offers two moves of the new type. World forms evolve into their final form at level 45. Holofox stays the normal level-30 evolution.
