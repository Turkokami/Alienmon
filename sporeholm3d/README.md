# Sporeholm 3D (Vercel project: alienmon-3d)

Static 3D game. Vercel serves this folder as-is (no build step). The Vercel project
`alienmon-3d` uses this folder as its Root Directory, so every push that changes it redeploys.

- `index.html`, `game.js`, `world.js`, `assets.js`: the game
- `m/*.glb`: models (file names include a content hash, cached forever)
- `voice/`: NPC voice lines; `audio/{voice,cries,sfx,ui,amb}/`: drop delivered audio here
- `art/`: cutscene art

Source code lives in `Alienmon/Sporeholm_3D_Game/src`; this folder is the built output.

## Tester gate
`middleware.js` is the same tester login as the 2D beta. It stays open until the Vercel project
`alienmon-3d` has an environment variable `TESTER_CODE`; once set, 3d.alienmon.com asks for the code.
Model files (`m/`) are not gated (they are useless without the game page).
