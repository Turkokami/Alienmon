# Claude in Chrome: full story playthrough + error catalog

Paste everything below the line into Claude in Chrome. Before you start: open the test link in a normal Chrome window, type
the tester code yourself, and keep the game tab VISIBLE the whole time (a hidden or minimised tab freezes the game).

Test link: https://alienmon-git-maps-v2-turkokami-9144s-projects.vercel.app

---

You are QA-testing Alienmon, a creature-collecting RPG that runs in this browser tab. I am already signed in. Your job is to
PLAY THE MAIN STORY FROM A NEW GAME TO THE END and catalog every problem you find, with a recommended fix for each.
Do not stop at the first problem: note it, work around it if you can, and keep going.

## How to play
- Controls: arrow keys move, Z or Enter = A (talk / confirm / advance text), X = B (back / run), Esc = Start menu.
  Click the game canvas once first so it gets the keys.
- Start: title screen > New game. Pick **Plazmo** as your partner (most story pictures were drawn for Plazmo).
- The quest log (Start > Quests) says where to go next. Follow it. Fly between worlds from Start > Ship once you have the ship.
- Battles: use your strongest moves; heal at Recovery Bays (Nurse). Catch a few Alienmon early so you have a team.
- If you are under-levelled and stuck on one battle for more than ~10 minutes, you may raise your team's levels from the
  browser console with: `G.party.forEach(m=>{m.lv=Math.max(m.lv,LEVEL);m.hp=stat(m,0)})` (put a number for LEVEL), and
  write "TEST ASSIST: levelled to N" in the log. Do not use the console for anything else that changes the game.
- You MAY read state from the console to fill in the log: `G.sec.id` (map number), `SWORLD[G.sec.id].name` (map name),
  and `QUESTS.filter(q=>qs(q.id).state==='active').map(q=>q.id+' step '+qs(q.id).step)` (active quests).

## What to check at every step
1. **Story order:** every picture, scene and dialogue must come AFTER the characters in it have been introduced, and in
   the order the story makes sense. (Example of a bug we just fixed: the "It picked Kit!" picture played before you met Kit.)
2. **Story matches what you see:** if a picture or line says a character has a certain Alienmon (Dax's boulder beast, Hank's
   Anvilox, Captain Marsh's Brineback, Vex's Hexcoil, DJ Static's speaker beast...), that Alienmon must actually be in that
   battle. If text says someone is somewhere, they must be standing there. Names in text must match the name shown in battle.
3. **Can it be completed?** Every quest step must be reachable: the place the quest log names exists, the person is there,
   the item/door/warp works, nothing blocks the path.
4. **Wrong art:** a character drawn with someone else's sprite or portrait, a creature shown with the wrong picture,
   missing/blank images, broken-looking map edges, things floating over the map.
5. **Audio:** voice lines that do not match the text on screen, music that is wrong for the place, sounds that never stop.
6. **Text:** typos, a line that names the wrong starter, `{placeholders}` showing, text cut off, a line repeated twice in a row.
7. **Crashes / freezes:** any red "Error:" box, the game stopping, a battle that never ends. Copy the exact error text.
8. **Originality:** anything that looks or sounds like Pokémon (ball-shaped capture devices, Pokémon names or terms).

## How to log
Keep a running log. After each quest (M01, M02, ...) post a short progress line. At the very end, post the FULL report in
ONE code block, one problem per row, in exactly this format (pipe-separated, no extra columns):

```
ID | Severity | Quest+step | Map (number + name) | What happened | What should happen | Recommended fix
```

- Severity: BLOCKER (cannot continue), MAJOR (story wrong / confusing / wrong art), MINOR (polish, typos).
- Quest+step: e.g. `M05 step 1` from the console line above.
- Recommended fix: be specific: "move the Kit picture to after the Kit meeting scene", "give Dax a Rumbler", "the warp at
  (12,3) on map 022 leads nowhere", "replace the nurse sprite in map 916".

After the table, add: (a) the furthest quest you reached, (b) total play time, (c) any TEST ASSIST you used, and
(d) your top 5 recommendations to make the story clearer or more fun for kids aged 8 to 12.

Go as far as you can through all 27 main quests (M01 to M21, then P01 to P04). If you run out of time, post the report for
everything so far and say where to resume.
