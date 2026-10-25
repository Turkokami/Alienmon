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

## Generated (Oct 25, 2026)
All 327 files were generated in ElevenLabs Text to Speech with **Eleven v4**, using the Book 1 audiobook voices where the character is in the book.
The `elevenlabs_voice` column in `all_lines.csv` shows which saved voice was used for each line. Kit is a boy (he/him).

Text changes made before generating (so nothing reads out stage directions or placeholders):
- `{kit}` / `{kit2}` placeholders in m04_050, m04_052, m04_057, m07_122, m07_123 replaced with "your little stowaway" / "the little Alienmon" / "Kit's partner" / "grows!".
- Narration that had slipped into character lines was cut: m10_153 (Kit), m10_165 (Thorne), m18_237 (Tamsin), m18_240 (Pell), m18_242 (Vex), m07_112 (Zib now just "...Bip.").
- `[log]` and `[message]` tags removed (Thorne m14_193–198, Orra m19b_270). Saga and Echo & Iris lines start with `[softly]`.
- Zib's bips use the Peanut voice, as in the audiobook, not Sound Effects.
