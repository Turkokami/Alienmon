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
