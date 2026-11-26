# Rigged models in the game

The new rigged Alienmon and townsfolk for the first 5 levels. Live on maps-v2 (3d.alienmon.com) since Nov 22.
Add `?rig=0` to the address to play the same build with the old models, for comparison.

## What is new

- `sporeholm3d/m/rig/`: rigged copies. `br_rig_<species>` are the 20 first-level Alienmon with every move as its own animation.
  `tr_<name>` are townsfolk with their own idle, walk and run.
- `sporeholm3d/rigged.js`: points the game at those copies (loaded right after `assets.js`).
- `sporeholm3d/game.js`: the live build plus 12 small hooks, made by `rigtools/patch_built_game.py`.

## The 12 hooks, in plain words (port these into the PC source before a local or PC build)

1. Battle model: if `window.RIGGED[species]` exists, load that instead of the old battle model. Plazmo keeps its flame unless listed.
2. When a move is used, pass the move's name along with "lunge", and wait for the clip's contact time before the target flinches.
3. and 4. The creature controller accepts and stores that move name.
5. The lunge plays the clip named after the move (for example `spore_shot`), sped up so the hit lands on time. Unknown moves fall back to "battle attack" or "battle special" as before.
6. Townsfolk: when a `tr_` model has its own `idle_v2`, `walk_v2` and `run_v2`, keep them.
7. Those models are not turned by Rook's idle offset.
8. The animation lookup uses the model's own clips when it has them, else Rook's retargeted ones as before.
9. Every spawn (map wanderers, wild battles, trainer teams) swaps to the rigged copy listed in `window.RIGMAP`.
10. and 11. Rigged Alienmon on the map blend into their own walk cycle while they move, at a speed matched to how fast they travel.
12. The afterimage trail on slam-type moves copies the model without its animation controller (copying it crashed).

## Nov 23 fixes (test branch fixes-1123, not live yet)

Port these into the PC source too.

13. Townsfolk arm settling (`bn` in game.js, called every frame for each townsperson): the `tr_` models face +X inside their
    group, but the code took +Z as "forward", so it pushed one forearm across the body and the other out to the side.
    DX-4's thin robot arms showed it worst. Now "forward" is worked out from the shoulders: the direction from L_Upperarm to
    R_Upperarm, turned a quarter to the front. The forearm may keep up to 0.2 of its own outward angle (was 0.04, which pulled
    DX-4's hands into his thighs), and it only gets a small forward bend (up to 0.18) when the clip doesn't already have one.
14. Head look-at (`At` in game.js): same wrong "forward", so townsfolk turned their heads sideways when you stood in front of
    them. It now uses the same shoulder-based forward.
15. world.js, all 5 world kits: open walk-in door leaves no longer carry the gold ring (it was left floating beside doors whose
    leaf didn't show, like Your House). Grass tips and seed heads sway with their blades instead of hanging in the air. Window
    frames and sills sit on the real wall surface, sampled from the wall mesh. A door leaf that would swing into a neighbouring
    dome or its own wall swings inward instead.
16. world.js: rooms with a stair notch get a real door (frame, two leaves that swing open, a step and a lamp).

## Nov 23 voice fixes (made by `rigtools/voice_fix.py`; port these into the PC source too)

Run `python rigtools/voice_fix.py sporeholm3d` on a fresh built game. It is safe to run twice; it skips what is already done.

17. `audio/voicebank.json`: 713 clip offsets were 5,802 bytes early, so those lines started with a scrap of the previous line.
    Every start offset now moves forward by 5,802.
18. `VOICELINE` (3 places in game.js): if the full text has no clip, try again without a leading "Name: " (trainer and
    townsfolk lines are stored without the speaker's name).
19. Battle log: after a voiced line, wait for the clip to end (up to 14 s) instead of moving on after 0.9 s, which cut voices off.
20. Sporeholm quest lines: quest text given as a plain string now looks up its clip, so the 79 quest lines speak.

17. Resting palms face the body (Nov 23, game.js `bn`): after the hand is placed, the forearm turns about its own axis so the hand's palm (hand-bone local +Z on the Tripo rig) faces the body's centre line instead of forward. Scaled by the settle weight, so walk/run blend the same way. index.html loads game.js?v=bt3.

## Nov 24 playtest fixes (branch opening-1123, merged into maps-v2; port these into the PC source too)

Copy `sporeholm3d/game.js`, `world.js`, `index.html`, and the new `hudpos.js` and `perf.js` from maps-v2. What changed:

21. Trainer "!" soft-lock (game.js, live since bt3h): if a trainer battle can't start (team fainted, model failed), that trainer gets an 8 s cool-down instead of re-firing every frame; errors are logged; the "!" line auto-advances after 6 s.
22. Load warm-up (end of `startGame`, before the render loop starts): the loading screen stays up while every texture is uploaded, one game step runs (so DX-4's orb light is already off), shaders compile with `compileAsync`, and five warm-up frames render around Rook. This removes the long stutter in the first seconds of play.
23. Talk-box typing runs on real time (46 characters a second), not per frame, so it no longer crawls when the frame rate dips.
24. `hudpos.js` (new): the Objective banner sits at the bottom centre, just above the talk box.
25. Opening walk (game.js + world.js): Dusty stops Rook at the fountain, a lab aide greets him at Dr. Vashti's door, the "long day" line is reworded, and the first objective after the starter is new.
26. Dustara waterfalls are animated (world.js, all 4 Dustara kit copies, plus the lava falls).
27. Battles: Rook's panel always on the left, the enemy's on the right; battle cameras keep Rook's side on the left; enemies turn to face Rook at the "!" and keep facing him all battle.
28. `__brFix` (game.js): battle rigs drop stray unused vertices before sizing, so Dunetrot, Skitterbit, Tiktrill, Liftant, Hivemaw and Cactling load at full size with feet on the ground.
29. world.js: Dustara docks, decks, the DFC3 causeway and the lava and canyon bridges follow the map warp, so rails, planks and pilings line up with the walkable path.
30. world.js: mine doorways (`D.caveMouth`) and the Sunset Tunnel exit show a lantern-lit recess instead of a flat black void.
31. game.js `bi`: the Sunset Tunnel ambush "lanterns go out" overlay is now a soft edge vignette under the battle UI (z-index 14) instead of near-solid black above it.

index.html loads world.js?v=wd8, game.js?v=bt5, hudpos.js?v=1 and perf.js?v=1.
32. Tamsin uses her own rigged model: assets.js adds "tr_tamsin" as a streamed model, and her NPC entry in game.js uses model "tamsin" instead of d032_dust_bell_ringer (assets.js?v=wd4t, game.js?v=bt6).
33. Sunset Tunnel expanded (world.js `sunset1`/`sunset2` grids grow from 40x30 to 78x56, about 4.4x the walkable floor): new chambers on B1 and B2, lantern posts, light baked into the floor texture, and a hidden crawl to the Still Water Shrine (pond and altar). game.js stashes accept a fixed spot, a height offset and a custom message; 7 new Linker stashes save as `stash[id]` in dustara_rpg. index.html loads world.js?v=wd9, game.js?v=bt7.
34. Phone / touch controls: new file `sporeholm3d/touch.js` (loaded before perf.js as touch.js?v=5). It turns on only on touch screens (`pointer: coarse`) or with `?touch=1` in the address (`?touch=0` turns it off); on desktop it does nothing. Left side: floating joystick (push far to run). Right side: drag to turn the camera, pinch to zoom. Buttons: A (talk / confirm, sends KeyE), Jump (Space), B (back, sends Escape or closes Linker screens), Bag (Tab), Map and Menu (calls window.LINKER), and full screen. Taps on dialogs and the prompt line advance them. On phones the help text and key hints are hidden and the HUD is shrunk and tucked to the edges.
35. index.html: viewport meta (`width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover`) plus mobile-web-app-capable and theme-color, so phones render at their real width; loads touch.js?v=5 and game.js?v=bt7m3.
36. game.js `sp` (movement): if no movement key is held, it reads the analog joystick from `window.__TM` (`f` forward, `s` strafe, `run`); keyboard still wins. Graphics presets `Xs` and the startGame `setPixelRatio` multiply their pixel ratio by `window.__PRM` (set by touch.js on phones, 1 when unset), so desktop is unchanged.
37. touch.js v2: on phones the cutscene/talk box keeps room on the left for the speaker portrait (it had covered the name and first words), and in landscape the portrait sits at the same height as the box.
38. touch.js v3: a townsperson's speech bubble (#dlg) no longer hides the joystick, so you can walk away to end it like on desktop (it was trapping phone players). On phones the bubble sits above the buttons, and the "Tab / Start: Bag & Team" line is hidden.
39. game.js: Old Dusty stands at the bonfire (DB2, `dustyFire`) during the "lab" story step too, since his "Every crack in that canyon" line plays there; his market copy (`dusty`, DB4) is hidden for that step (game.js?v=bt7m2).
40. Townsperson chats can be force-closed on phones: touch.js v4 adds a round ✕ on the speech bubble, and B also closes it. game.js sets `window.__closeDlg` in the main loop (hides #dlg, clears the talking NPC `Ri`, stops the voice line) so the close is clean (game.js?v=bt7m3).
41. Objective guidance arrow is bigger: hudpos.js v2 makes #objArrow 40px (was 22px) with a soft green glow; on phones touch.js v5 makes it 34px. index.html loads hudpos.js?v=2.

## Nov 24 stairs + NPC facing fixes (branch stairs-npc-1124, live on maps-v2 Nov 25 together with mobile-touch; port these into the PC source too)

42. Stairs ground check (game.js `et`, `ip`, `sp`): the player's ground ray no longer stops looking 3.2 m above the terrain (new 4th argument `fr`), so tall built stairs and upper floors stay under Rook instead of going invisible. `__gL` keeps the last ground height so the next step is probed from the step, not from under it, and when climbing Rook can trail the surface by at most 0.08 m (was unlimited), which stops the sprint sink.
43. Steep-ground block (game.js `__gT` inside `ip`): Rook can't walk into a steep slope of drawn terrain that sits more than 0.45 m above his feet (face steeper than about 45 degrees, terrain meshes only). This is the waist-deep sink beside the 112 steps: the walk strip is 2 m wide but the drawn slope beside it is wider, so walking up beside the strip put Rook inside it. Now he rides on what you see.
44. NPC facing and walk speed (game.js `__trFace`, `ki`, `$t`, NPC `w`, `Ut`): townsfolk with their own walk clips are turned to face where they walk, measured from each model's shoulders and toes (41 Dustara townsfolk were a quarter turn off, so they walked sideways or backwards). Their walk clip now plays at the speed their feet actually travel, so feet don't slide, and the arm-settle pose fades out while they walk. index.html loads game.js?v=bt8n.
45. world.js (Canyon Steps, DB3/DB4, wd10): canyon walls (D.canyonWalls) now stop at the walk height when the cell inside the lip is lowWalk (steps, canyon floor, bakery path), so they no longer stand 8-16 m tall over the steps and the floor. The 112 steps get exact heights (0.3 m at the top to -15.8 m at the floor, minus the smoothed tile height `cHb`), with a flat square landing where the two flights meet (`cS`, lines up with the bakery path at about -2.8 m). Tread loop split into two flights plus a landing slab; no rope across the landing. index.html world.js?v=wd10.

46. Interiors and textures detail pass, first slice (branch interiors-detail, Nov 25 2026). Port all of this into the PC source:
    - NEW sporeholm3d/roomkit.js (`ASSETS.roomKit(THREE, { add, std, root, seed })`): a shared kit for finished rooms. Thin plaster walls with wood wainscot, baseboard, crown and cap; plank or tile floors; windows with casings, steel grids, glass, a painted canyon view inside the wall, curtains, and cheap sun beams and sun patches; plus props (bookcases with books, wall shelves, plants, rugs, lamps, speakers, frames with art, cushions, clocks, cork board, baskets, crates, string lights). Everything merges into a handful of meshes per room (merged batches by material), at most 2 sun lights plus the lamps that ask for one.
    - NEW textures in sporeholm3d/tex/: rk_plank_d/_n, rk_tile_d/_n, rk_plaster_d/_n, rk_rug1_d, rk_rug2_d, rk_view_d, rk_pave_d/_n (pave not used yet). All original, made by NEW rigtools/make_rk_textures.py (numpy + Pillow, fixed seed, run `python3 rigtools/make_rk_textures.py`). The plaza flagstones are drawn in code, not from a picture.
    - roomkit textures load as 4x4 colour stand-ins and swap to the picture on load; the swap calls texture.dispose() first, because a texture already drawn at 4x4 keeps its small GPU storage otherwise (that showed as flat-coloured floors and rugs).
    - world.js (Dustara kit, buildPlace): a place with `fine: { floor, wins, panel, trimC, dress({ K, X, Z, lite, fy, Y }) }` skips the painted floor and the old block walls and builds through roomKit.shell; its floor sits at 0.065 (door notches and portal rings follow). house1f and house2f now have `fine` definitions: downstairs kitchen (teal cabinets, butcher-block top, blue tile backsplash, sink, cooktop, hood), dining table, living corner (TV between floor speakers, couch, coffee table, rug), stairs, bookcase, reading chair, entry table, gallery; upstairs Rook's room (bed with nightstand, telescope at its window, desk with screen and speakers, cork board, string lights, bookcase, wardrobe, Alienmon posters from the game's own dex art, rug with a board game, bean-bag corner, bench, pendant).
    - world.js SCN.DB2 (Dustmere Plaza): rings of sandstone setts with a terracotta border course and the compass star drawn into a ground painter and onto a thin overlay disc that follows the ground height (the shipped ground picture for DB2 is pre-baked, so the overlay is what shows); a low sandstone kerb round the plaza, open at the roads and the shuttle landing; six big potted desert plants framing the north, west and south entrances.
    - index.html adds roomkit.js?v=rk3 before world.js and loads world.js?v=wd13 (after merging the live stairs/phone-controls work).
47. Interiors detail pass, second slice: Recovery Bay, Dustmere Shop, Abernathy's Bakery (branch interiors-detail, Nov 25 2026). Port into the PC source:
    - rigtools/make_rk_textures.py adds stone(): rk_stone_d / rk_stone_n (cream limestone slabs, 4x4 per 2 m, thin grout); new files tex/rk_stone_d.webp and tex/rk_stone_n.webp.
    - roomkit.js: new "stone" floor material; shell() takes fine.floor "stone" as well as "tile" and plank.
    - world.js recoveryBay gets a fine block: stone floor, arched healing alcove with a glowing basin, curved reception desk, medicine cabinets, waiting lounge with two sofas and a rug, water cooler, records desk, bench and cork board, pendants. The ladder to the attic is unchanged.
    - world.js (Dustara block, before DROOM): dFineRoom / dGoods / dShelfUnit helpers; DFURN.dShop and DFURN.bakery rebuilt with the room kit (old versions kept as dShopOld / bakeryOld as fallbacks). dShop also furnishes Harbor Store, Lantern Shop and the other rooms mapped to it. Each room lays its own textured oval floor and hides the building's old floor disc.
    - world.js Dustara GHT: inside a walk-in room the ground uses that room's own level (the pad the point is most inside wins), so a neighbour's flattened yard no longer rises through the shop floor.
    - index.html loads roomkit.js?v=rk4 and world.js?v=wd14.

## Nov 25 live hotfix: catching and falling (maps-v2, port into the PC source)

48. Battle Linker menu (game.js `Fn`): a save with no pods at all (a new Dustara start has `pods:{stasis:0,harmonic:0}`) showed only "Back", so nothing could be caught. Now the first time this happens the bag gets 5 Stasis Pods ("You found 5 Stasis Pods packed in your bag!", flag `flags.starterPods`); after that an empty bag says "You're out of pods. Shops sell Stasis Pods." index.html loads game.js?v=bt8u.
49. Safety net (new safety.js, loaded after sidequests.js): every 0.1 s it checks the player against `GAME.groundY(x, z, y, 1)` and `GAME.canStand`, remembers the last spot they stood on firmly, and puts them back there with "Back on solid ground" if they are more than 0.6 m under the ground for 0.4 s, hang more than 0.3 m in the air without dropping for 1.6 s (or 5 s airborne in all), or drop 1.2 m into a spot nobody can stand on for 0.6 s. Teleports (more than 6 m in a step) and a hidden player (cutscenes, flights) reset it. Works the same with keyboard, controller and the phone joystick.
50. Talk camera through walls (game.js `ht`, the talk-shot picker): on a tall phone screen the shot in Vashti's lab ("The Cactus Gardens are east...") could sit outside the room, so the frame split between the inside and the wall. The picker now also collects walls, ceilings and big buildings (bounding radius 7 to 60 m) and adds a penalty of 7 to any camera spot whose line to either speaker crosses one, seen from either side, so it picks a spot inside the room. index.html loads game.js?v=bt8w.
51. Vashti's Observatory Lab roof (world.js `defPlace("vashtiLab")` dress): the round room had no roof, so low talk shots showed black sky above the walls. It now has a plastered dome with 16 timber ribs and a brass-studded ring beam (painted canvas texture, its own seeded random so nothing else in the map moves), radius 7.75 x 6.15, 2.6 m high, from 3.15 m. It draws back faces only, so the play camera can still look in from above. Named "nocol" (no collision). index.html loads world.js?v=wd13d.
52. Tamsin in the Cactus Gardens scene (new tamsin-seat.js, loaded after safety.js): she stood where the cacti and the talk camera hid her. Now, until the story moves past the garden (steps field, cactling, map, pack, bonfire, tunnel, stowaway, coral, gate, done), she sits 3 m west and 3.5 m north of her old spot on open dirt, on a flat sandstone rock, eating an apple (bitten red apple with a stem and leaf in her right hand, left hand on her knee). Her body is turned to face 45 degrees whatever way the rig is built inside its group; small plants and pebbles within 1.4 m are cleared so nothing pokes through her. During her intro line ("An explorer sits on a flat rock eating an apple...") the talk camera is set 2.9 m in front of her at seated eye height. After the garden she stands normally and the rock and apple are hidden. Port to the PC source as a story-actor pose plus two small props.

## Nov 25 Observatory move, now live (built Nov 24 on branch dustara-observatory; port these into the PC source too)

Copy `sporeholm3d/world.js`, `game.js`, `linker-data.js` and `index.html` from maps-v2. What changed:

53. world.js (Dustara `dmap` only): two new scenes east of Sola's Yard. DA5 "Observatory Switchbacks" at [120,0] (five rope-railed legs up a banded red hillside) and DA6 "Vashti's Observatory" at [150,0] (grand stair, summit courtyard, the Crater Observatory, a balcony over the town with two coin telescopes). The summit is 26 m up. A path is carved out of DA4's east edge (rows 13-16, x 112-119) with an "OBSERVATORY / 112 steps up" sign.
54. world.js: the old observatory on DB1 is taken off after DB1 builds (dome, telescope, dish, pipes and its walk-in); the hill becomes Stargazers' Hill with a coin telescope aimed at the new dome. Its sign now reads "STARGAZERS' HILL / lookout & garden".
55. world.js: the "Crater Observatory" door (OUTPORTALS) is now on DA6 at [168.46, 11.41]; the lab's "Go outside" door returns to DA6.
56. world.js: far view of the town from the summit. `OBS2.town()` builds low-detail stand-in roofs (data baked into `/*IMPD*/`) for town scenes that are not loaded, hidden whenever the real scene loads. The frontier detail pass takes `D.XLITE` / `D.xClear` so the new slopes and balcony aren't buried in rock stacks.
57. game.js: every Observatory objective points to DA6 (k("DB1") -> k("DA6")); objective and hint text say "over the canyon bridge and up the switchbacks"; Dr. Vashti (outdoor, after the map step), her story NPC and the Lab Aide stand in the DA6 courtyard; the Lab Aide's greeting fires at the top of the grand stair (Ct(161.5,17.5,4.5)). DA5/DA6 are added to G3[1] (act 1 scenes) and the d_town zone; the map manifest gets the two scenes, their exits, the moved door, NPC spots and walk-in, and DB1 is renamed Stargazers' Hill.
58. game.js: Mom's line now reads "Past the fountain, over the canyon bridge and up the switchbacks." Its old voice clip (v3d_dus_0151_mom.mp3) is unmapped because it said "West across the plaza"; record the new line in the next voice pack.
59. linker-data.js: DA5 and DA6 added to the Dustmere Rim zone.

index.html loads world.js?v=wd14ob, game.js?v=bt8ob, linker-data.js?v=cl1ob. The lab's new domed roof (above) stays; only its "Go outside" door now leads to DA6.

## Nov 25 bigger shop, bakery and clinic (interiors slice 2, now live; port into the PC source)

60. Roomier rooms, at least Rook's room size, with the camera at its normal distance:
    - world.js: Recovery Bay grid grows to 18x14; new places `dShopIn` (Dustmere Shop, 16x13, plank floor) and `bakeryIn` (Abernathy's Bakery, 16x13, tile floor), each with a fine room-kit block (shelving and gondolas, east checkout with Stasis Pod capsules; oven, racks, display cases, cafe tables) and the old furniture kept as a fallback. Two OUTPORTALS replace the DB2 walk-ins "Dustmere Shop" and "Abernathy's Bakery" (doors at [52.86, 34.75] and [52.75, 50.4]). The middle pendant in the shop is removed and the bakery's moved to (10.4, 3.6) so they don't block the view.
    - game.js: the DB2 Clerk stands in dShopIn at (14.1, 7); Mr. Abernathy in bakeryIn at (7.75, 4.45); the Recovery Bay nurse at (9.6, 3.15). The shop menu still opens by the Clerk's name.
    - game.js static-mesh merge keeps the room-kit wall side tag: the merge key and the merged mesh and its outline carry `userData.rkEdge`.
    - roomkit.js: wall pieces inside a doorway notch in the outer row, and the corner posts on the outer walls (door jambs), are tagged with that outer wall; world.js doorNotches tags the door, frame, header and lantern with the wall side in fine rooms.
    - cutaway.js: hides the tagged pieces on the camera's side (world-space boxes); restores them when the camera moves.
    - index.html loads roomkit.js?v=rk7, world.js?v=wd20ob, game.js?v=bt9ob, cutaway.js?v=3.


## Nov 26 Dustara outdoor surfaces (now live; port into the PC source)

61. Outdoor surfaces at the interiors' level of detail, with no new meshes or draw calls:
    - new `sporeholm3d/surfaces.js` (loaded before world.js): a world-space (triplanar) shader patch with colour and normal maps. It finds tagged surfaces in the scene every 1.5 s and upgrades their material once, so streamed scenes, walk-ins and merged statics all get it. It chains any patch a material already has (the merged statics' per-vertex glow, Dustara's swatch shader). Phones load the textures at 512 px.
    - new textures `sporeholm3d/tex/ex_*.webp` (adobe, rock, block, roof, grit, dxstone, dxwood; colour + normal), all drawn from noise by `rigtools/make_ex_textures.py`. No photos, no outside art.
    - world.js (Dustara `dmap` only): tags the painted textures in `mk()` (adobe, stone, rock, stalk, shingle), the canyon wall canvas, each ground mesh and its map, the far mesa material (`OBS2.stand`), and the swatch textures through `DXSURF` in `dxT()`. Sandstone domes and walls and the boards are redrawn at full detail in the swatches' own colours; the red rock and canyon keep their own colours and gain rock bedding and relief; the ground gains grain, pebbles and small cracks.
    - index.html loads surfaces.js?v=ex7 and world.js?v=wd23ex.


## Nov 26 blocking fixes and ground seating (now live; port into the PC source)

62. The Crater Observatory door could not be reached: the far-view stand-in pieces that a real scene hides (`K.grounds` with a matching `userData.rect`) were taken out of the floor list but stayed in the wall list, so an invisible stand-in wall sat in front of the door. game.js now removes them from the walls too (both load paths) and puts them back on unload. Walked from the summit courtyard into the lab on a phone-size screen.
63. The market row in Dustmere's south lane (DB4) parted round the rope bridge's head: three stalls west, two east, lemonade stand past the copper stall, so the walk from the road onto the bridge is clear. Walked market → bridge → Oasis Fork end to end along the deck's centre.
64. New `sporeholm3d/seat.js` (loaded before world.js): keeps scattered plants, pebbles and small props on the ground in every world.
    - Each world builder calls `SEAT.run(root, GHT, THREE)` before it returns; game.js calls it again on each assembled scene group 1.5 s and 6 s after it loads (`SEAT.later`), because the scatter fills in over the first frames.
    - Surface = terrain height, or the rock skin where one covers a steep face (skins are tagged `userData.skin`; their raster is kept on the root as `userData.seatSkin`).
    - A plant's parts share one origin across meshes (stem, leaves, bloom, seed tip), so they move together, by the amount the lowest part needs. Tiny things only follow, unless they sit low (pebbles); motes in the air are left alone.
    - Small props are lowered only when they hover over sloped ground, so things set on tables, shelves or walls stay put.
    - The automatic check: `SEAT.check(group, GHT)` counts what still floats (instances and props) and lists the worst. The test page probe (`rigtools/ground_check.js`) runs it on every loaded scene group.
    - index.html: seat.js?v=s4, world.js?v=wd24seat, game.js?v=bt11seat.
65. Feet on the floor, in every world:
    - game.js static-mesh merge (`P`): a new mesh name "floor" means "the player stands on it, it is never a wall". It joins the floor list even when its material has a custom shader (Dustara's swatch shader made the mesa rock and the sandstone terrace count as neither floor nor wall, so feet sank 0.3 to 0.5 m into them).
    - world.js: named "floor": the DA5/DA6 mesa rock skin (near view), the DA6 grand stair slabs, the switchback kerb stones, the observatory terrace, a 6-step sandstone stair in Dustara, the Ferrox wide iron steps.
    - seat.js: the player model's boot soles sat 4 cm under the player's origin; each model under the player is lifted 4 cm once (`userData.__lift`).
    - Checked with a probe that compares the visible floor top under every walkable spot with where the feet land (rigtools/ground_check.js covers the plants and props).
66. Dr. Vashti's Crater Observatory is about 2.2x bigger outside (DA6 build): radius 6.7 m, walls 6.2 m, dome and great telescope scaled to match (FSPEC `d_obsXL`, no walk-in; the lab is its own place). Closed arched double doors replace the open leaves. A sandstone terrace rings it and a red-rock plinth runs down the cliff on its north side. The SE turret came off; the dish moved to (177, 7.6); the planters flank the door at z 13.6. The door is now at [168.46, 13.4] (world.js OUTPORTALS and the game.js map manifest), arrival [168.64, 15.3]; Dr. Vashti's courtyard spot moves to (171.6, 15.6). The far view (`OBS2.stand`) uses the same size.
    - index.html: seat.js?v=s5, world.js?v=wd25fl3, game.js?v=bt12fl2.
67. Route to Dr. Vashti's lab checked end to end (town → canyon bridge → five switchback legs → grand stair → courtyard → the observatory's front door → inside the lab):
    - world.js DA5 ground: every switchback bend gets a round walkable landing (radius 2 tiles), so the bend never pinches the walk.
    - The lab door marker and arrival point moved to the new front door (OUTPORTALS DA6 at 168.46, 13.4; map manifest "Crater Observatory door").
    - index.html: surfaces.js?v=ex8 (adds `three()` for the ground check), world.js?v=wd26turn.
68. Feet on the floor on Sporeholm, Ferrox, Thalassa and Neonis (same check as item 65, spots where the drawn floor sat above the feet near each world's start: Sporeholm 80 → 4, Ferrox 141 → 3, Thalassa 251 → 9, Neonis 292 → 4; what's left is crate and rock tops beside the path):
    - game.js merge: a thin flat piece (named "" or "nocol", opaque, under 0.32 m tall, at least 0.5 m across and 0.8 m² in area) becomes "floor": house plinths, plaza discs, dock boards and stepping stones. Floor buckets are solid even when they hold a single small piece (the 30-vertex minimum skipped lone slabs).
    - game.js: meshes kept out of the merge (custom shaders such as Neonis' PBR stone) are solid too when opaque and not grass, water or "nocol" (Dustara 14 of them, Neonis none).
    - world.js Sporeholm mushrooms: the walkable cap top and the cap's rim lip are "floor", so you stand on the cap you see.
    - Debug only: `?dbgsrc=1` records what went into each merged mesh (userData.src) for the probes.
    - index.html: seat.js?v=s6, world.js?v=wd27ft2, game.js?v=bt13ft3.
69. Dustara restyle toward Kristofer's 12 reference frames (environment look only, no creature designs copied):
    - game.js Dustara day sky: purple-to-pink gradient into a golden horizon; a big ringed planet low in the north-east sky, two small moons and a band of pink clouds (all day-only, no fog). Haze turns lavender pink (#c99ac6); warmer, pinker hemisphere, ambient and sun light. Other worlds untouched.
    - world.js DX pass section 13 "the reference look": violet, teal and pink crystal clusters (instanced, one mesh per colour, never solid) at the foot of the rock, along trail edges and on the deep canyon floor; violet agaves with glowing hearts, cyan glow mushrooms, teal fiddlehead curls and turquoise glow cracks in the dirt; purple banners on the town's wider walkways.
    - world.js Dustara banner texture: a gold ringed planet with teal diamonds (replaces the three diamonds).
    - Speed: software-render test 6.0 → 5.6 fps at the plaza; ground check unchanged (crystals stay out of the solid list).
    - Still to do for the look: the tall rock walls around town hide most of the sky; lowering the far mesas comes next.
    - index.html: world.js?v=wd28st6, game.js?v=bt14st2.

70. Sunset Tunnel grown into a broad cavern (both levels, B1 and B2):
    - world.js: new scalePlace(id, k, ox) grows a place's whole layout k times on each axis. Sunset Tunnel B1 and B2 are now scale 2 (156 × 112 m each, 4× the floor area; walkable floor 1,882 → 7,450 m² on B1 and 1,395 → 5,540 m² on B2). They moved to ox 5000 and 5400 so they don't overlap other places.
    - Paths, rough edges and the place painters (pRect, pCirc, pPath, pRough, dcRough) scale with the layout; boulders, pillars, altar, waystones and pump keep their real size (oCirc / oRect). Walls are 1.7× taller, cave lights spread with the layout, and every dress() call places through X()/Z() so rails, timbers, lanterns, stashes and the arch land in the same spots, just farther apart.
    - The grown floor gets up to 50 violet, teal and pink crystal clusters along the cavern walls, a few glowing cap clumps and up to 8 crystal lights; spots near arrivals, portals and stashes stay clear.
    - game.js: arrivals, portals, item spots, NPC spots and door targets inside a place multiply by the place's scale (placeMeta scg), so a scale-1 place is unchanged.
    - Checked: both arrivals and all four portals stand on floor. Software-render test 24 → 21 fps in B2.
    - index.html: world.js?v=wd29tn4, game.js?v=bt15tn1.

71. Dustara sky over town:
    - world.js horizon (stand pass): the purple Sunset Range east of town is a third of its old height (front row 14-42 m, was 45-130 m; back row 12-20 m, was 26-44 m), so it sits low on the skyline and the pink sky shows above it when you look east or up.
    - Found while checking: from the plaza the camera's default tilt shows only about 9° above the horizon, and the town's own ring of mesa cliffs (22-30 m, 70-110 m away) fills that. Dragging the view up shows the sky; the cliffs themselves are town layout and stay.
    - index.html: world.js?v=wd30sk1.

72. Map screen (M, or the Map button):
    - New mapview.js: the map is now a real top-down picture of the whole world, baked from the game itself (map/<world>/: overview.webp plus 30 m tiles at 16 px per metre, about 30 KB each). Drag to look around; pinch, the wheel, + and − zoom from the whole world down to about 28 px per metre, and the sharp tiles load only for the part you're looking at. The target button jumps back to you.
    - Fog of war: everything is dark until you've walked within about 24 m of it outdoors; it's saved per world (localStorage am_fog_<world>).
    - Your arrow points the way you face. Inside a building or cave you show at its door.
    - Key places are named once found, coloured by kind: Home (teal), shops (gold), arenas and the tower (coral), the Recovery Bay (green), caves and tunnels (violet). Names come from each door's label or the place's own name.
    - linker.js opens it in place of the old block map (mode "map2"; M, Enter or Back closes, arrows/WASD pan, Q/R or +/− zoom) and keeps the old map for any world without a baked picture.
    - Baked so far: Dustara (9 × 12 tiles, 2.3 MB of tiles, 0.6 MB overview). The baker (bake.js / stitch.py) stays outside the repo.
    - index.html: mapview.js?v=1, linker.js?v=mv1.
