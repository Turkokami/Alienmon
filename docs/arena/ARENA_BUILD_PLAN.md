# Linker Arena: build plan

A real-time arena battle mode for Alienmon. It's inspired by fan games like *Pokemon Arena 2D* (real-time 2D sprite battles, several creatures at once, terrain that deforms) and by *Pokemon Stadium* (cups, rental teams, a battle hub), but built only from Alienmon's own creatures, rules and art.

Status: **planned**. The render prompts are ready in `docs/arena/prompts/`, and the importer is `tools/import_arena_sheet.py`.
Working titles that need owner approval before they appear in game text: **Linker Arena**, **Link Battle Court**, and the six cup names.

---

## 1. The idea in one paragraph

You pick Alienmon from your party, or rentals, and drop into a top-down arena on one of the 14 planets. You steer your Alienmon directly and fire its four moves from four buttons. Each move has a cooldown, and stronger moves have a visible wind-up the opponent can dodge. Type matchups, Traits and status conditions all still matter, but now in real time. Heavy hits crater the floor, freeze it or crack it with lava, so the arena changes as the fight goes on. Modes start with 1v1 against the computer and grow into 3v3 tag battles, cups, Battle Codes against friends' teams, free-for-alls of up to 5, and finally online play.

## 2. Key design decisions

| Decision | Choice | Why |
|---|---|---|
| Camera | **Top-down 3/4**, the same view as the overworld maps | Alienmon sprites are front and back views. A side-view fighter would need new side art for 322 creatures before anything worked. Top-down works on day one with the existing sprites, and the new pose sheets make it better. |
| Code | New `src/arena.js`, inlined by `tools/build.js` like `story.js` and `sections.js` | Keeps the 912-line engine untouched apart from small hooks. |
| Battle maths | **Reuse** the existing type chart (`eff()`) and damage formula | One balance source. A move does the same share of damage in the arena as in turn-based battles. |
| Levels | Flat level 50 (the `docs/PVP_PLAN.md` rule) | Fair matches, and the same rule PvP already plans to use. |
| Legendaries | Banned in standard rules; allowed in a Free/Exhibition rule | Matches `PVP_PLAN.md`. |
| Rewards | Cosmetic and bragging rights only (trophies, titles, a record) until the owner decides otherwise | CLAUDE.md: don't change gameplay balance unless asked. |
| Story | The Arena is a side mode. It never gates or spoils the main story, and no Act 1 Seedmother hints appear in any arena text. | CLAUDE.md story rules. |

## 3. Turning the turn-based rules into real time

**Stats** (`s` in `alienmon.json` = HP, Atk, Def, SpA, SpD, Spe; computed at level 50):
- HP is HP.
- Atk/SpA and Def/SpD go into the existing damage formula unchanged.
- Spe sets walk speed: 90 + Spe x 0.6 px/s at a 64 px tile, so the slowest Alienmon is about 0.5x the fastest. Spe also sets cooldown recovery: up to 15% faster for the fastest Alienmon.

**Moves** come from each Alienmon's own learned moves (up to 4). The cooldown and wind-up follow from power, so every move works with no per-move tuning:

| Power | Role | Cooldown | Wind-up |
|---|---|---|---|
| 1-45 | basic, the button you tap | 0.45 s | none |
| 46-80 | strong | 3 s | 0.15 s |
| 81-100 | heavy | 7 s | 0.5 s, with a red warning marker on the ground |
| 101+ (signature, legendary) | ultimate | 10 s | 0.7 s, with a warning marker |
| 0 (status) | buff, debuff, heal | 8 s | 0.2 s |

- **Accuracy:** a real-time hit either connects or misses on its own. Accuracy below 100 shrinks the hitbox instead: 85 accuracy gives a 15% smaller hitbox.
- **Move shapes:** each move gets a shape that sets how it travels: PROJ, LOB, BEAM, CHAIN, WAVE, CONE, ARC, DASH, BURST, ZONE, RAIN, FIELD or AURA. All 86 assignments (56 type moves plus 30 signatures) are in `tools/arena_prompts.js` (`MOVES`, `SIG_SHAPE`). Those same tables write the effect prompts, so art and behaviour always match.

**Status conditions:**

| Status | Arena effect |
|---|---|
| Burn | 1/16 HP every 2 s; physical damage halved |
| Poison | 1/8 HP every 2 s |
| Shock | Speed halved; 25% chance a move press fizzles |
| Freeze | Frozen solid for 1.5 s, then 3 s of immunity |
| Confusion | Movement controls reversed for 3 s |

**Traits** (all 55 carry over):
- Low-HP boosts, type absorbs, Levitate, Thick Pelt, Pure Core and Keeper's Pride carry over exactly.
- Contact Traits (Flame Body, Spiked Plating...) trigger on ARC and DASH hits.
- "Enters battle" Traits trigger on spawn and on every tag-in.
- "End of every turn" Traits (Regrowth, Accelerator...) tick every 3 s.
- Sturdy Core / Molten Armor shows the shield effect when it saves the Alienmon.
- Sync Traits (Friendly Signal, Skittish, Scout Signal) do nothing in the arena.

**Terrain:**
- The floor is a 24x16 grid of 64 px cells over the 1536x1024 arena.
- HEAVY and ULTIMATE moves change the cells they hit: crater (slows), crack, frozen (slides), lava crack (burns), spore patch (poisons), and so on. The planet sets the tile art; the move's type sets the effect.
- Cells heal back after 20 s, so the arena never becomes unplayable.

## 4. Build phases

Each phase ends with something playable. Ticket IDs follow the repo's commit style, e.g. `[ARENA-P1-03] move cooldowns and wind-ups`.

### Phase 0: Asset pipeline (no gameplay)

| Ticket | Work | Done when |
|---|---|---|
| P0-01 | Prompt pack + generator (`tools/arena_prompts.js`, `docs/arena/prompts/`) | **Done.** 476 renders listed in `docs/arena/render_tracker.csv` |
| P0-02 | Importer (`tools/import_arena_sheet.py`): pose sheets -> 6 aligned 192 px poses; effects/tiles/hazards -> transparent webp | **Done.** Tested on synthetic sheets; re-test on the first real batch |
| P0-03 | `tools/build.js` loads `art/arena/{poses,fx,tiles,hazards,scenes,ui}` with the existing `folder()` helper into `__ARENA__` | The build lists the arena asset counts; a missing folder is not an error |
| P0-04 | Lazy loading | Arena images load only when a match starts (the fighters, the arena and their move effects), never at title. The `--inline` Android build includes them but only decodes on use. |

### Phase 1: Prototype, 1v1 against the computer

Assets needed first: `sprites_batch_01`, `fx_batch_7`, `fx_batch_1`, the Dustara arena, the practice court, `ui_batch_1`.

| Ticket | Work | Done when |
|---|---|---|
| P1-01 | `src/arena.js` skeleton: `arenaStart(teamA, teamB, arenaKey, rules)`, its own update/draw called from `loop()` while `G.mode==='arena'`, and `arenaEnd()` returning to the menu | You can enter and leave an empty arena with no console errors |
| P1-02 | Movement: 8-way keyboard / d-pad / gamepad (the engine already reads `getGamepads`) and the touch stick; collision with the arena border; pose choice (side_a/b mirrored, front, back) with a bob when there is no sheet yet | All 4 directions animate; walking speed follows Spe |
| P1-03 | 4 move buttons, cooldowns and wind-ups from the power table; the touch buttons from `ui/move_buttons` | Every button fires, greys out and refills |
| P1-04 | Shapes PROJ, BEAM, ARC, AURA, BURST (the starter moves) with circle and line hitboxes | All 16 starter-type moves (Plasma, Hydro, Bio, Volt) hit correctly |
| P1-05 | Damage through the shared formula + `eff()`; hit sparks for normal, super-effective, resisted and critical hits; knockback; hurt pose with a white flash; screen shake on heavy hits | Super-effective visibly hits harder; numbers match turn-based for the same matchup |
| P1-06 | KO: KO pose + poof, result banner, back to menu | A full match plays start to finish |
| P1-07 | Computer opponent v1: approach / keep distance / dodge warning markers / use heavy moves when the target is in range; Easy, Normal and Hard set by reaction delay (450/250/120 ms) | Normal beats a new player sometimes and loses to a careful one |
| P1-08 | HUD: HP bars, portraits from the front sprite, timer (99 s), countdown 3-2-1-GO | Matches the UI sheets |
| P1-09 | Entry point: "Arena" on the title menu (playtest only, behind `UNLOCK_ALL`) | Owner can playtest from the live build |

### Phase 2: Every move, every Trait, every arena

| Ticket | Work |
|---|---|
| P2-01 | Remaining shapes: LOB, CHAIN, WAVE, CONE, DASH, ZONE, RAIN, FIELD, so all 56 type moves and 30 signature moves work |
| P2-02 | Status conditions in real time (table above) with the status effects |
| P2-03 | All 55 Traits (rules above), each with the gold Trait-trigger flash and the name shown in a small toast |
| P2-04 | Terrain grid + deformation + 20 s recovery, drawn with each arena's tile sheet |
| P2-05 | 14 planet arenas + practice court, each with its hazard (dust devils, geysers, lava flares, icicles, wind gusts, rift portals...) on a timer, always shown by the warning marker first |
| P2-06 | Arena select screen using the existing `art/scenes/<planet>_battle.jpg` as cards |
| P2-07 | Balance pass: scripted computer-vs-computer runs on every type pair at level 50 should land within 45-55% win rate for evenly matched base-stat totals |

### Phase 3: Stadium-style modes and the Arena building

| Ticket | Work |
|---|---|
| P3-01 | Tag 3v3: bring three Alienmon and swap with the swap button (1.5 s swap cooldown, the Linker release/recall effects) |
| P3-02 | Team picker from party and Storage, and rental teams for players who haven't caught enough yet (ruleset in `data/arena.json`) |
| P3-03 | Cups: six cups of 4 rounds each, with rental or own teams and type or level rules per cup; trophies saved to the save file (save migration through `src/story.js` conventions) |
| P3-04 | Keeper Rematch: every Keeper and story boss with their story teams at level 50, unlocked after you beat them in the story |
| P3-05 | **Battle Codes** (`PVP_PLAN.md` Phase 1, real-time version): paste a friend's team code (`tradeEncode` format, same validation) and fight it against the computer |
| P3-06 | Arena lobby: the dome building in Dustmere plus the interior room (scene prompts in `arena_scenes_C`) and a "Link Battle" counter in every Recovery Bay that opens the Arena menu |
| P3-07 | Record screen: wins and losses per mode, favourite Alienmon, trophies |

### Phase 4: Free-for-all and couch multiplayer

| Ticket | Work |
|---|---|
| P4-01 | Up to 5 Alienmon on the floor at once (any mix of players and computer), last one standing wins; spawn points around the edge |
| P4-02 | Local multiplayer: 2-4 players on gamepads, or 2 on one keyboard; each player picks from their own save or rentals |
| P4-03 | Camera: zoom out to keep everyone on screen, never past 0.6x |
| P4-04 | Performance: 5 fighters + effects at 60 fps on a mid-range Android phone (pool effect objects, cap particles) |

### Phase 5: Online (last, after `PVP_PLAN.md` Phase 2 accounts)

Real-time online play is harder than the turn-based plan in `PVP_PLAN.md`. Turns there are seconds apart; here inputs must stay in sync about 20 times a second.

| Ticket | Work |
|---|---|
| P5-01 | Deterministic simulation: a fixed 20 Hz logic tick, seeded RNG (`rng(roomSeed + tick)`), no `Math.random` or frame-time maths inside `arena.js` logic. Drawing interpolates between ticks. **Build this rule in from Phase 1** so nothing has to be rewritten. |
| P5-02 | Lockstep over Supabase Realtime: each client sends `{tick, inputs}`; 3-tick (150 ms) input delay; stalls show "Waiting for opponent" |
| P5-03 | Rooms: reuse the `pvp_rooms` table and 4-letter codes from `PVP_PLAN.md`; server-side team validation |
| P5-04 | Replays: store the seed plus both input lists, which also settles disputes |
| P5-05 | 1v1 and 3v3 online only; free-for-all online stays out until lockstep proves stable |

## 5. Assets

| Asset | Count | Prompt file | Phase needed |
|---|---|---|---|
| Alienmon pose sheets (side A/B, attack front/back, hurt, KO) | 322 | `prompts/sprites/sprites_batch_01..17.md` | Batch 01 in P1, the rest in P2-P3 (fallback: existing sprites + code bob) |
| Missing back sprite (Oblivane) | 1 | `prompts/sprites/sprites_extra.md` | P2 |
| Arena floors | 15 | `prompts/scenes/arena_scenes_A/B/C.md` | Dustara + court in P1 |
| Terrain damage tile sheets | 15 | same | P2 |
| Hazard sheets | 15 | same | P2 |
| Arena lobby exterior + interior | 2 | `arena_scenes_C.md` | P3 |
| Type move effects | 56 | `prompts/fx/fx_batch_1..4` | Batch 1 in P1 |
| Signature move effects | 30 | `prompts/fx/fx_batch_5..6` | P2 |
| Common + status effects | 10 | `prompts/fx/fx_batch_7` | P1 |
| UI sheets | 10 | `prompts/ui/ui_batch_1.md` | P1 |
| **Total renders** | **476** | | |

**Audio:** no prompts are needed. Arena music uses the code-synthesized `CHIP` tracks: one new fast battle loop per tier (practice, cup, final), plus the existing `battle_spark.mp3`. The sound effects list (hit, super-effective hit, critical hit, KO, countdown beep, GO, wind-up charge, swap) can be synthesized the same way.

**Size budget:** a 192 px pose PNG is about 6-15 KB, so all 322 creatures x 6 poses come to roughly 20-25 MB. The web build serves them as hashed files loaded on demand, which is fine. In the `--inline` Android build they'd add that much to `index.html`. Option: ship only the launch roster inline and fetch the rest when online, or move Android to the asset-folder build. Decide this in P0-04.

## 6. Risks and how they're handled

| Risk | Plan |
|---|---|
| ChatGPT breaks the 3x2 grid or drifts from the design | Attach the reference sprite every time; one creature per fresh chat; single-pose fallback in the prompts README; the importer drops specks and aligns poses |
| Balance: some Alienmon dominate in real time (fast + strong projectiles) | P2-07 automated computer-vs-computer runs; cooldown multipliers per shape live in `data/arena.json`, never in species data |
| Touch controls on small phones | Analog stick bottom-left, 4 move buttons in an arc bottom-right, swap button above them; all 56 px or more |
| Scope creep into online too early | Online is Phase 5 and only after accounts exist; the deterministic-tick rule from Phase 1 keeps that door open at no extra cost |
| Copyright | Take the idea only. No assets, names, UI or code from any Pokemon game or fan game; the prompts ban franchise likenesses |

## 7. Owner decisions needed

1. Approve or rename **Linker Arena**, **Link Battle Court**, and the cups (Dust, Tide, Volt, Frost, Nebula, Prime).
2. Rewards: cosmetic only (default), or should cups give items?
3. Should the Arena be reachable from the title menu for everyone at launch, or only after a story point (for example after the first Keeper)?
4. Android build size: launch roster inline, or switch Android to the asset-folder build?
