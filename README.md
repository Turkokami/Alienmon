# Alienmon — Android app project

One game codebase (HTML5 canvas) wrapped as a native Android app with Capacitor. The same `www/` folder will later become the Mac app.

## Folder layout
| Path | What it is |
| --- | --- |
| `src/template.html` | The game engine: rendering, battles, Traits, Linker Sync, space flight |
| `data/core_battle.json` | Trait library and signature moves shared by every batch |
| `data/batches/batch01_kessler/` | Batch 1: 300 Alienmon and 14 planets of the Kessler System |
| `tools/build.js` | Merges all batches into the engine and writes `www/index.html` |
| `www/` | The built game Capacitor packages into the app |
| `art/raw/` | Original ChatGPT renders, named after the Alienmon (e.g. `Gearhound.png`) |
| `art/sprites/` | Cleaned game sprites made from `art/raw` |
| `art/characters/` | Player (boy/girl, 4 directions), NPC and Keeper sprites, named by role (`vashti.png`, `hank.png`...). Planets point to them with `npcArt` and Keeper `art` in `planets.json` |
| `art/scenes/` | Environment scenes used as battle backgrounds and landing scenes. Each planet picks one with `scene` (and an optional color `sceneFx`) in `planets.json` |
| `art/ui/` | Title screen (`title.jpg`), starship sprite (`ship.png`), launch/landing cutscenes (`cut_0-2.jpg`, 640x576), original art sheets, and the Google Play feature graphic (1024x500) |
| `docs/` | Battle/Sync rules, expansion guide, per-Alienmon Trait list |

## Build the Android app
You need Node.js 18+, Android Studio (with an Android SDK and an emulator or a phone in developer mode) and Java 17+.

1. Open a terminal in this folder.
2. `npm install`
3. `npx cap add android` (first time only; creates the `android/` project)
4. Lock the game to portrait: in `android/app/src/main/AndroidManifest.xml`, add `android:screenOrientation="portrait"` to the `<activity>` tag.
5. `npm run android` — builds the game, syncs it into the Android project and opens Android Studio.
6. In Android Studio, press Run to install it on your emulator or phone.

**Offline font:** download `PressStart2P-Regular.ttf` from Google Fonts into `www/fonts/` so text renders without internet.

**App ID:** change `appId` in `capacitor.config.json` to your own reverse domain (for example `com.yourstudio.alienmon`) before the first `npx cap add android`. It can't easily change after you publish.

**Icons and splash:** add a 1024x1024 `assets/icon.png` and `assets/splash.png`, then run `npx @capacitor/assets generate --android`.

## Publish to Google Play
1. Create a Google Play Console developer account (one-time fee).
2. In Android Studio: Build > Generate Signed App Bundle, create an upload key and **back it up**; losing it locks you out of updates.
3. Upload the `.aab` to an internal testing track first, then closed testing, then production.
4. You'll need a privacy policy URL, a content rating questionnaire, screenshots and a store listing.

## Adding Alienmon art
1. Generate the image with the prompt pack and save it as `art/raw/<Name>.png`, using the exact Alienmon name.
2. `pip install pillow numpy scipy` (first time only).
3. `python3 tools/process_art.py art/raw art/sprites art/holes.json` removes the white background, trims, centers and shrinks each image to a 192px sprite with a 64-color palette.
4. `npm run build`. Any Alienmon with a sprite uses it; the rest keep their placeholder pixel sprite.

If a creature has large white gaps inside its shape that should be see-through (like Orbitusk's orbit rings), add it to `art/holes.json`. Battle back views currently use the mirrored front art; dedicated back renders can be added later.

## Day-to-day workflow
- Edit the engine in `src/template.html` or data in `data/`.
- `npm run build` and open `www/index.html` in a browser to test quickly.
- `npm run android` when you want it on a device.

Saves are stored on the device (WebView local storage). The Android back button acts as the B button.

See `docs/PLATFORM_ROADMAP.md` for the Mac plan and `docs/EXPANSION_GUIDE.md` for adding new batches of Alienmon.

## Painted maps (walkable art)
A planet listed in `data/painted_maps.json` is explored by walking over a full illustration instead of the tile map.
Each entry gives the image key (from `art/scenes/`), the scale, a packed walk mask and drift-grass mask (8 px cells),
the start point, the exit line to the landing pad, and hotspots (Recovery Bay, shop, talking NPCs, a battle-ready
Alienmon, and solid blockers). The masks were drawn as polygons; `art/painted/mask_check.png` shows them over the art.

## Playtest switch
`UNLOCK_ALL` in `src/template.html` opens every planet. Set it to `false` to restore Signal Shard gating.

## Attack effects
`art/fx/` holds the move effect sprites, keyed by type in `FXT` inside `src/template.html`.

## World map
`data/world_map.json` drives on-foot travel across `art/world/molten_frontier.webp` (stitched from the six 512px sections in `art/world/molten_frontier_sections/`; the earlier Kessler overview map is kept in `art/world/previous_kessler_map/`): a packed walk mask (8 px cells),
region nodes (each links to a planet key, so entering a node loads that planet's town and pools), and NPCs
(`talk` or `trainer`; trainers build a team from the nearest region's Alienmon and pay out once).
`art/world/walk_check.png` shows the walkable area in clear, blocked in red.
Special node kinds: `bay` opens a Recovery Bay, `space` flies the ship to the star chart. `zones` pick which planet's wild
Alienmon appear by x-position (coast = Thalassa, lava fields = Pyros).

## Music
`audio/save_the_stars.mp3` (96 kbps re-encode of the original in the same folder) loops in the background.
Volume is `MUSIC_VOL` in `src/template.html` (0.18). Players toggle it with the Music option in the START menu or the M key;
the choice is remembered. Browsers only start audio after the first tap or key press.
`audio/lets_go_alienmon_title.mp3` ("Let's Go! Alienmon") plays on the title, character select, intro and starter screens, then crossfades into the gameplay track.

## Built-in chiptune soundtrack
Four original looping tracks are synthesized live with Web Audio (no audio files): Frontier Walk (world map),
Dustmere Breeze (towns), Starlight Drift (space) and Battle Spark (battles). They live in the `CHIP` object in
`src/template.html`: each has a tempo, a chord per bar, and an 8-step melody per bar (`-` holds, `.` rests), so
new tracks are easy to write. The START menu Music option cycles Chip / Song / Off (M key too).
`CHIP_VOL` sets the chiptune volume.
