# Alienmon story voice pack (ElevenLabs)

Every line of the **main storyline** (27 quests, from waking up in Dustmere to the Warp Gate), ready to voice in ElevenLabs:
327 audio files from 313 lines and 31 voices.

**Match the Alienmon book.** Use the same voices as the Book 1 audiobook for every character who appears in it, so the game and the
book sound like one world. `01_VOICES.md` has a casting description for each character, written from the book's own descriptions,
for anyone not yet voiced.

## Files
- `01_VOICES.md`: the cast, with a Voice Design description, book notes and a preview line for each character.
- `02_PRONUNCIATION.md`: how to say the made-up names (check them against the audiobook).
- `scripts/NN_<quest>.md`: the lines of each quest in story order, grouped by scene, with the voice and file name for each.
- `all_lines.csv`: every line in one table (file, quest, scene, speaker, voice, direction, text), handy for ElevenLabs Projects or batch work.

## How to make them
1. Set up the voices (reuse the audiobook ones first).
2. For each line, pick the voice and paste the text. Use **Eleven v3** (it reads the [softly]-style tags as delivery directions) or Multilingual v2.
3. Kids' game, ages 7+: warm, clear, never scary. Helix villains are calm and cold, never cartoonish.
4. Save as MP3 with the exact file name and send the files in zips (a few quests at a time is fine).
5. Lines that say the starter's name come in three versions (`_sporix`, `_plazmo`, `_gloopa`); the game plays the one that matches the player.
6. Rook (the player) is silent in the game, so he has no lines. Zib only says "Bip": make those with **Sound Effects**, not a voice.
