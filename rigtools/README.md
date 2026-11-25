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

## Nov 24 stairs + NPC facing fixes (branch stairs-npc-1124; port these into the PC source too)

34. Stairs ground check (game.js `et`, `ip`, `sp`): the player's ground ray no longer stops looking 3.2 m above the terrain (new 4th argument `fr`), so tall built stairs and upper floors stay under Rook instead of going invisible. `__gL` keeps the last ground height so the next step is probed from the step, not from under it, and when climbing Rook can trail the surface by at most 0.08 m (was unlimited), which stops the sprint sink.
35. Steep-ground block (game.js `__gT` inside `ip`): Rook can't walk into a steep slope of drawn terrain that sits more than 0.45 m above his feet (face steeper than about 45 degrees, terrain meshes only). This is the waist-deep sink beside the 112 steps: the walk strip is 2 m wide but the drawn slope beside it is wider, so walking up beside the strip put Rook inside it. Now he rides on what you see.
36. NPC facing and walk speed (game.js `__trFace`, `ki`, `$t`, NPC `w`, `Ut`): townsfolk with their own walk clips are turned to face where they walk, measured from each model's shoulders and toes (41 Dustara townsfolk were a quarter turn off, so they walked sideways or backwards). Their walk clip now plays at the speed their feet actually travel, so feet don't slide, and the arm-settle pose fades out while they walk. index.html loads game.js?v=bt8n.
37. world.js (Canyon Steps, DB3/DB4, wd10): canyon walls (D.canyonWalls) now stop at the walk height when the cell inside the lip is lowWalk (steps, canyon floor, bakery path), so they no longer stand 8-16 m tall over the steps and the floor. The 112 steps get exact heights (0.3 m at the top to -15.8 m at the floor, minus the smoothed tile height `cHb`), with a flat square landing where the two flights meet (`cS`, lines up with the bakery path at about -2.8 m). Tread loop split into two flights plus a landing slab; no rope across the landing. index.html world.js?v=wd10.
