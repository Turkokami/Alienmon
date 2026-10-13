# CLAUDE.md — Alienmon (handoff for Claude Code)

You are picking up **Alienmon**, an original monster-collecting retro RPG that already runs in the browser. The owner (Windows user `turko`) wants three things, in this order:

1. **Import ~80 new renders** from `C:\Users\turko\Downloads\Alienmon` into the right project folders.
2. **Rebuild** the game with the new art.
3. **Deploy it to Vercel** as a public web game, from a GitHub repo.

Read this whole file first. Background lore and art style are in `docs/STORY_BIBLE.md`.

## Story canon: the books

The Alienmon novels (Books 1-5) are the **story canon**: `docs/SAGA_MASTER_PLAN.md` (the books) and `docs/EPIC_STORY_BIBLE.md` (the game's chapter plan).
- The books win on story, characters and dialogue. The game data wins on Alienmon types, stats and moves; never change a type to match a book.
- The player is a silent protagonist with any of the three starters. Book scenes with Plazmo/Plazmet/Solarach use the player's own starter line (`{starter}`, `{starter2}`, `{starter3}` in quest text). Sola always takes the starter that beats the player's (`{rival}` ...).
- Kid-friendly for ages 7 and up. Nobody dies on screen.
- Story features (partner battles, section scenes, cutscenes, choices, save migrations) are documented at the top of `src/story.js`; scenes and save shifts are in `data/story.json`.
- Renamed Alienmon: old names live only in `data/renames.json`; `node tools/build.js` fails if one appears anywhere else.
- **Seedmother revision (canon, wins over the books where they differ):** `docs/SEEDMOTHER_REVISION.md`. The Seedmother is scattered in every Alienmon; only the Heartroot is left on Ystra. Never lock the story ending behind Xenodex completion.
- Every Book Sync change is listed in `docs/BOOK_SYNC_CHANGELOG.md`. Kit Briggs is a proposal awaiting approval: `docs/KIT_BRIGGS_PROPOSAL.md`.

---

## 1. How the project works (important)

- The game is **one HTML file**: `src/template.html` holds all the code (canvas engine, battles, maps, menus, music). It has no framework and no npm runtime dependencies.
- `tools/build.js` (plain Node, built-ins only) reads all data and art, inlines everything as base64, and writes **`www/index.html`**. That single file *is* the game; it works from a file, from Vercel, and inside the Capacitor Android wrapper.
- The template uses placeholders like `__DATA__`, `__ART__` and `__SCENES__`; `build.js` replaces them.
- **Never hand-edit `www/index.html`.** Edit `src/template.html` or the data/art, then run `node tools/build.js`.
- `www/index.html` in the zip you received is already built and matches the live version, so a fresh clone deploys as-is.

### Folder map
| Path | What it is | How the build uses it |
| --- | --- | --- |
| `src/template.html` | All game code | Template for the build |
| `data/batches/batch01_kessler/` | `alienmon.json` (300 creatures), `planets.json` (14 worlds), `batch.json` | Merged; future batches are added the same way (`docs/EXPANSION_GUIDE.md`) |
| `data/core_battle.json` | 55 traits + signature moves | Inlined |
| `data/world_map.json` | Molten Frontier walk mask, entrances, NPCs | Inlined |
| `data/painted_maps.json` | Walkable art towns (Dustmere, Skyreach Plaza, Neonis Starport): masks + hotspots | Inlined |
| `art/sprites/<AlienmonName>.png` | Processed creature sprites, 192px, transparent | Key must equal the exact `name` in `alienmon.json`. Creatures without art fall back to procedural sprites. |
| `art/raw/` | Original creature renders before processing | Not inlined (source only) |
| `art/characters/<key>.png` | Character sprites; `*_big` is a 160px portrait, `*_down/up/left/right` are 64px walk frames, others 128px | Key = art id used in `planets.json` (`npcArt`, `keeper.art`) and in NPC data |
| `art/scenes/<key>.jpg` | Battle backgrounds and landing scenes (1536×1024 max); the `*_hd.jpg` ones are walkable maps | `planets.json` → `scene` picks one. **Auto-wire:** if `art/scenes/<planetKey>_battle.jpg` exists the build uses it as that planet's battle background; `<planetKey>_keyart.jpg` becomes its landing scene. |
| `art/planets/<planetKey>.png` | Planet as seen from space, transparent background | If present it replaces the procedural planet in space flight |
| `art/fx/*.webp` | Attack effect sprites | Inlined |
| `art/world/molten_frontier.webp` | The walkable world map (stitched from 6 sections) | Inlined |
| `art/ui/` | Title, ship, cutscenes, store graphic | Inlined where referenced |
| `audio/` | `lets_go_alienmon_title.mp3` (opening song), `save_the_stars.mp3` (optional gameplay song) | Inlined. Chiptune tracks are synthesized in code (`CHIP` object). |
| `tools/process_art.py` | Removes white background, trims, makes 192px game sprites | Python + Pillow + numpy + scipy |
| `tools/import_renders.py` | **Sorts a folder of renders into the right places** (see step 2) | |

Planet keys: `dustara ferrox sporeholm thalassa neonis glyphos pyros glacia helix halo umbra starfall apex ystra`.

---

## 2. Task 1: import the renders from `C:\Users\turko\Downloads\Alienmon`

1. Install the Python dependencies once: `pip install pillow numpy scipy`
2. Dry run first and read the report:
   ```
   python tools/import_renders.py "C:\Users\turko\Downloads\Alienmon" --dry-run
   ```
   It matches files by name (case-insensitive, ignores numbers, spaces and punctuation):
   - **Alienmon name** (e.g. `054_Cactling.png`) → `art/raw/<Name>.png` + processed `art/sprites/<Name>.png`
   - **Character** (e.g. `sola.png`, `Director Kael Thorne.png`, `boy_down.png`) → `art/characters/<key>.png`
   - **Planet + kind:**
     - battle background → `art/scenes/<planet>_battle.jpg`
     - key art / landing → `art/scenes/<planet>_keyart.jpg`
     - planet orb → `art/planets/<planet>.png`
     - town or region map → `art/maps_incoming/` (see step 5)
   - Files that already have art are listed under **exists** and skipped. Re-run with `--force` to replace them.
3. Look at `import_report.json`. For every **unmatched** file, open the image and identify it using `docs/STORY_BIBLE.md` (creature list, characters, worlds). Then rename or copy it so it matches, and re-run.
   - Creature names must match `alienmon.json` exactly.
   - Character sprite sheets with several poses must be split so each pose is its own file: `boy_down/up/left/right` (walk frames) and `boy_big` (portrait).
4. Run it for real (without `--dry-run`).
5. **Walkable maps (`art/maps_incoming/`)** need a walk mask and hotspots before the game can use them. Follow the pattern in `data/painted_maps.json`:
   - `walk` is a bit-packed base64 mask at 8 px cells over a 1536×1024 image.
   - `hot` lists the Recovery Bay, shop, NPC, keeper, ship and blocker spots.
   - The image goes in `art/scenes/<name>_hd.jpg`.
   - Draw walkable polygons, then verify with an overlay image (red = blocked) before wiring it up.
   - If time is short, skip this step and list these maps for the owner. They still work as landing scenes.
6. Spot-check a few results visually: transparent backgrounds, nothing cropped off.
7. **Never delete anything** from `C:\Users\turko\Downloads\Alienmon`. Copy only.

## 3. Task 2: rebuild and test

```
node tools/build.js
```
- The build prints the Alienmon and planet counts.
- `www/index.html` must stay **under 16 MB** for the Claude artifact preview. That limit doesn't apply on Vercel, but keep it reasonable for phones:
  - Photos and scenes: JPEG q84 or WebP.
  - Sprites: quantized PNG (the tools already do this).
- Open `www/index.html` in a browser (or `npx serve www`) and check:
  - title screen music, new game, starter pick
  - walk Dustmere
  - the START menu: Map, Ship, Party, Storage, Bag
  - one wild battle: attack effects, capture with a pod
  - landing on a planet whose art you just added (new battle background or landing scene)
  - space flight shows any new planet sprites
- Check the browser console for errors.

## 4. Task 3: deploy to Vercel

The repo already contains `vercel.json`:
- install step skipped (no dependencies needed)
- build `node tools/build.js`
- output folder `www`

1. Create a GitHub repo (suggested name `alienmon`) under the owner's account (`Turkokami`), then commit and push. `.gitignore` already excludes `node_modules/` and `android/`.
2. Import the repo in Vercel (dashboard → Add New → Project), or run `npx vercel` then `npx vercel --prod`. Keep the framework preset at **Other**; the settings come from `vercel.json`.
3. After deploying, open the production URL on desktop and on a phone. Confirm the touch controls work and the music starts after the first tap.
4. Give the owner the URL. Optionally add a custom domain in Vercel settings if they ask.

## 5. Ground rules

- **Keep the art style and lore consistent** with `docs/STORY_BIBLE.md`. Don't invent new canon names without asking.
- **Don't change gameplay balance or story text** unless asked. Bug fixes are fine; mention them.
- **Playtest switch:** `UNLOCK_ALL=true` in `src/template.html` opens every planet. Leave it on unless the owner says it's time to lock progression for the public release.
- **Commit in small steps** with clear messages, e.g. "Import 34 Alienmon sprites", "Add Pyros battle background".
- **Finish with a short report:**
  - what was imported, and where
  - what is still unmatched or needs a walk mask
  - the live URL

## 6. Useful references
- `docs/STORY_BIBLE.md`: world, story, characters, creature designs and art style. Use it to identify unmatched renders.
- `docs/MAP_AND_PLANET_PROMPTS.md`: the prompts used to make the environment art, so you know what each map was meant to be.
- `docs/EXPANSION_GUIDE.md`: adding Batch 2 creatures and planets.
- `docs/BATTLE_AND_SYNC.md`: battle and capture rules.
- `README.md`: the long changelog-style notes on every system (painted maps, world map, music, effects).
