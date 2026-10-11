# Quest system spec (for Claude Code)

How to add `quests.json` to the game in `src/template.html`. Keep the current style: no frameworks, everything in the one template, data inlined by `tools/build.js`.

## 1. Data
- Put `quests.json` in `data/quests.json`. Inline it in `build.js` through a new `__QUESTS__` placeholder.
- Each quest has:
  - `id`, `type` (`main` or `side`), `act`, `title`
  - `location`, `giver`, `prereq` (quest ids)
  - `objectives[]`, `dialogue{start,progress,complete}`, `rewards`, `repeatable`, `notes`

## 2. Save state
Add `G.quests = { [id]: { state, step, counts:[...] } }`.
- `state` is `locked`, `available`, `active` or `done`.
- Migrate old saves:
  - If `G.party.length > 0`, mark M01 done.
  - Mark Keeper quests done for any key already in `G.beaten`.
  - Mark trainer quests done for any trainer id already in `G.beaten`.

## 3. Unlocking
A quest becomes **available** when every id in `prereq` is `done`. Main quests auto-activate as soon as they're available. Side quests activate when the player talks to the giver.

## 4. Objective types → engine hooks

| type | Completes when | Hook into |
| --- | --- | --- |
| `choose_starter` | starter picked | starter scene |
| `talk` | player talks to the NPC or hotspot named in `target` (world NPC id like `mf8`, a painted-map hotspot, or a planet NPC) | `paintInteract`, world NPC talk, tile `interact` |
| `visit` | player reaches the place: `planet:<key>`, `node:<key>`, `molten_frontier`, or a named spot (within ~40 px of its x,y) | `enterRegion`, landing, `updWorld` / `updPaint` position checks |
| `examine` / `collect` | interact with `count` quest props at the spot | spawn small sparkle props (drawn `!` markers) at the location; interacting adds to the count |
| `deliver` | the player has the item and talks to the target | `G.items` check plus a talk hook |
| `use_item` | the item is used in battle | battle Bag handler |
| `catch` | an Alienmon of that species is captured (count = number caught during the quest) | capture success in the Sync code |
| `catch_type` / `catch_any` | captured mon has that type / any capture | same |
| `show` | the party contains the species or type when the player talks to the giver | talk hook |
| `win_battle` | wild wins against the named species, or wins in that area, `count` times | `endBattle(true)` |
| `battle_trainer` | a trainer with that id is beaten. `a|b|c` means any of them, counted up to `count`. New trainer ids such as `helix_dock_grunt` or `ferrox_junkers` must be created as NPC trainers at the quest location | `endBattle` uses `tr.bkey` |
| `battle_rival` | Sola battle won | new trainer using `team` with `counter_starter` |
| `defeat_keeper` | `G.beaten[planetKey]` | existing Keeper battles |
| `defeat_boss` | boss trainer beaten (Vex, Thorne, the Quorum, Orra). Create these trainers from `docs/STORY_BIBLE.md` characters | `endBattle` |
| `legendary_encounter` | legendary caught or defeated. Needs `syncs` Syncs in a row (already the design for legendaries) | wild battle with a forced species |
| `cutscene` | play the dialogue lines, then continue | simple `say()` sequence; reuse `cut()` art if useful |
| `item` | the player obtains the key item | reward or prop pickup |
| `xenodex` | number caught ≥ `count` | Xenodex data |
| `choice` | the player picks an option (`options`) | `choose()` |

## 5. Rewards
- `dust` adds to `G.dust`.
- `items` merge into `G.items` and `G.pods`; the pod keys are `stasis`, `harmonic` and `singularity`.
- **Key items** (`helix_keycard`, `ystra_shardlet`, `seedmother_seed`) are new. Store them in `G.key` and show them in the Bag under "Key items".
- `flags` set `G.flags[x]=1`. Story flags `rift` and `champ` already gate Apex and Ystra.
- `shard`: increment `G.shards` once per Keeper (the existing Keeper code already does this, so don't double-count).
- `alienmon_gift` uses `addMon(mk(...))`.

## 6. UI
- **START menu → Quests:** two tabs, Main and Side.
  - Each entry shows the title, the current objective and the location.
  - Selecting a quest shows the description, rewards and a **Track** button.
- **Tracked quest:** a small one-line banner under the area name ("▶ Talk to DX-4"), plus an arrow or pulsing marker on the world map and in the Map viewer pointing to the next location.
- **NPC markers:**
  - yellow `!` over a giver with an available quest
  - grey `?` while that quest is active
  - yellow `?` when it's ready to turn in
- **Notifications:** "Quest started", "Objective complete" and "Quest complete! +rewards" as short dialog lines.

## 7. Placing content
- Coordinates in `quests.json` are pixels on 1536×1024 maps: the Molten Frontier world map and the painted towns.
- Planet towns marked `"note": "tile map..."` don't have coordinates yet. Put those spots on the tile maps for now, and move them when each planet gets a painted walkable map from `docs/MAP_AND_PLANET_PROMPTS.md`.
- New NPCs and trainers named in quests that don't exist yet: create them with existing character art keys. The `giver.art` field suggests one.

## 8. Testing checklist
- [ ] Fresh save: M01 through M05 can be played in order. The quest log and tracker update correctly.
- [ ] Old save loads and migrates without errors.
- [ ] Every side quest can be accepted, progressed and completed. Repeatable quests reset.
- [ ] No reward is granted twice. Shards stay at a maximum of 8.
- [ ] With `UNLOCK_ALL=true` (playtest), quests still follow their `prereq` order.
