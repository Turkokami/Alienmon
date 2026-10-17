# Linker Arena render prompts

Every image the real-time Arena mode needs, as copy-paste ChatGPT prompts, split into batches you can render one at a time.
The build plan is `docs/arena/ARENA_BUILD_PLAN.md`. Every file to render, and whether it exists yet, is listed in `docs/arena/render_tracker.csv`.

These files are generated from the game data by `node tools/arena_prompts.js`. Don't hand-edit the batch files. Change the generator and re-run it, for example after Batch 2 Alienmon are added. Re-running also refreshes the tracker's `done` / `todo` column.

"Linker Arena", the practice court and the cup names are working titles. They need the owner's OK before they appear in game text (CLAUDE.md: no new canon names without asking).

## What gets rendered

| Group | Files | Renders | Saved to |
|---|---|---|---|
| Alienmon pose sheets (6 poses each) | `sprites/sprites_batch_01.md` ... `_17.md` | 322 | `art/arena/raw/<Name>_arena.png` |
| Missing back sprite (Oblivane) | `sprites/sprites_extra.md` | 1 | `art/raw/` then `art/sprites_back/` |
| Arena floors, terrain tiles, hazards | `scenes/arena_scenes_A.md`, `_B.md`, `_C.md` | 47 | `art/arena/scenes/`, `art/arena/raw/tiles/`, `art/arena/raw/hazards/` |
| Type move effects (14 types x 4) | `fx/fx_batch_1` ... `fx_batch_4` | 56 | `art/arena/raw/fx/` |
| Signature move effects | `fx/fx_batch_5`, `fx_batch_6` | 30 | `art/arena/raw/fx/sig_*.png` |
| Common and status effects | `fx/fx_batch_7_common_and_status.md` | 10 | `art/arena/raw/fx/common_*.png` |
| UI (logo, icons, HUD, banners, cups) | `ui/ui_batch_1.md` | 10 | `art/arena/ui/` |
| **Total** | | **476** | |

## Render order (matches the build phases)

| Order | Batch | Unlocks |
|---|---|---|
| 1 | `sprites_batch_01` (starters, Zib, first signature Alienmon) | Phase 1 roster |
| 2 | `fx_batch_7_common_and_status` + `fx_batch_1` (Plasma, Hydro, Bio, Volt) | Phase 1 hits, status and the starter moves |
| 3 | `arena_scenes_A`: Dustara only, plus `arena_scenes_C` practice court | Phase 1 arenas |
| 4 | `ui_batch_1` | Phase 1 HUD and menus |
| 5 | `fx_batch_2` to `fx_batch_6` | Phase 2: every move works |
| 6 | the rest of `arena_scenes_A` and `arena_scenes_B` | Phase 2: all 14 planet arenas |
| 7 | `sprites_batch_02` to `sprites_batch_17`, `sprites_extra` | Phase 2-3: full roster. Until a creature has its sheet, the arena falls back to its front/back sprite with a code bob. |

## How to render

**Pose sheets (Alienmon):**
1. Open a fresh ChatGPT image chat for each Alienmon. Reusing a chat lets the last creature bleed into the next one.
2. Attach the reference sprite named in the prompt (`art/sprites/<Name>.png`, plus `art/sprites_back/<Name>.png` when listed). If a higher-resolution render exists in `art/raw/`, attach that instead.
3. Paste the prompt and generate at 1536x1024 landscape.
4. Check the result:
   - plain white background
   - six poses in a clean 3x2 grid
   - the same creature, same colors, same size in every cell
   - the side poses face RIGHT
   - nothing touching a cell edge

   Regenerate if any cell is off. If ChatGPT keeps breaking the grid, use the single-pose fallback below.
5. Save it as `art/arena/raw/<Name>_arena.png`.

**Effects, tiles, hazards:** ask for a transparent background, or use the key color named in the prompt. Every prompt already says which. Each frame must sit inside its own cell. Beam and arc segments are the only exception: they touch the left and right cell edges so they tile.

**Arena floors** are game-ready JPEGs. Save straight to `art/arena/scenes/<planet>_arena.jpg` at quality 84 (1536x1024).

## Import

```
pip install pillow numpy scipy                        # once
python3 tools/import_arena_sheet.py poses --all       # art/arena/raw/*_arena.png  -> art/arena/poses/<Name>_<pose>.png
python3 tools/import_arena_sheet.py fx --all          # art/arena/raw/{fx,tiles,hazards}/*.png -> art/arena/{fx,tiles,hazards}/*.webp
node tools/arena_prompts.js                           # refresh the tracker
```

- **Pose files:** `side_a`, `side_b` (walk loop facing right; the game mirrors them for left), `atk_front`, `atk_back`, `hurt`, `ko`. All six share one scale and one baseline, so they line up when animated.
- Add `--holes` to a poses import for creatures with see-through gaps, the same rule as `art/holes.json`.
- Keep the raw renders. `art/arena/raw/` is source art, like `art/raw/`, and the build never inlines it.

## Single-pose fallback

If a sheet won't come out clean, render each pose on its own. Use the creature's prompt, but replace the layout lines with the lines below, then generate once per pose:

> Canvas 1024x1024, pure flat white #FFFFFF background. ONE pose only, centered, filling about 70% of the frame, the lowest point of the creature near the bottom. Pose: <paste one pose line from the prompt, e.g. "SIDE A: full side profile facing RIGHT, moving ...">.

Save each one as `art/arena/raw/single/<Name>_<pose>.png`, then place the six singles into a 3x2 white 1536x1024 sheet in this order:

| | 1 | 2 | 3 |
|---|---|---|---|
| Row 1 | side_a | side_b | atk_front |
| Row 2 | atk_back | hurt | ko |

Then import that sheet as usual.

## Style rules every prompt already contains

- **Style:** the creature, environment and effect blocks from `docs/STORY_BIBLE.md` section 2: crisp GBA / 16-bit pixel art, a dark 1-pixel outline, top-left light.
- **Banned:** nothing resembling Pokemon or any other franchise, no Pokeball-like objects, no text (except the logo, countdown and result banner sheets), no photorealism.
- **Kid-friendly (ages 7+):** KO poses are dazed with swirly eyes and stars, never hurt.
- **Sprites set the look:** the attached sprite wins over the lore text if they ever disagree (owner rule, 2026-10-14).
