# Alienmon: Book Sync Changes for the Game

**Purpose:** Bring the game's story, characters, dialogue and quests in line with the Alienmon book saga (Books 1–5).
**Hand to:** Claude Code, working in the `alienmon-app/` project.
**Also needed:** export the Saga Master Plan doc as Markdown and save it as `docs/SAGA_MASTER_PLAN.md`. It has the full chapter-by-chapter story for every book.

---

## Instructions for Claude Code

The novel series is now the story canon for Alienmon. Before changing anything, read these files fully:

- `docs/SAGA_MASTER_PLAN.md`
- `CLAUDE.md`
- `docs/EPIC_STORY_BIBLE.md`
- `docs/world/STORY_PROGRESSION_MASTER.md`
- `data/quests.json`
- `data/world_state.json`

### Ground rules

- The books win on story, characters and dialogue.
- The game's data wins on Alienmon types, stats and moves. Never change a type to match a book.
- The player is a silent protagonist who can pick any of the three starters. Where a book scene uses Plazmo, Plazmet or Solarach, use the player's own starter line instead. Sola always takes the starter that beats the player's.
- Keep the tone kid-friendly for ages 7 and up. Nobody dies on screen.
- Work in small commits, one section of this file per commit.
- Rebuild with `node tools/build.js` after each commit.

---

## 1. Canon fixes

### 1.1 Renamed Alienmon

These were renamed because they were too close to existing Pokémon names. Confirm every one is fully updated in code, data, dialogue and sprite filenames.

| Old name | New name |
| --- | --- |
| Flarion | Plazmet |
| Rustle | Gleamgrub |
| Shellet | Conchlet |
| Gloomit | Sulklet |
| Bardoracle | Bardseer |
| Magmorb | Lavorb |
| Geodle | Geopip |
| Corrodon | Corrovore |
| Bastionyx | Citadrake |
| Cricketick | Tiktrill |
| Clangit | Gongit |
| Aurorix | Borealix |

- Add a save-file migration that maps any old name or ID to the new one.
- Add a grep test that fails the build if any old name appears anywhere in the project.
- **Careful:** Rustlegrove and Rustlit are real names. Do not touch them. The lowercase English word "rustle" in prose is also fine.

### 1.2 Teo's disappearance

Teo Reyes has been missing for **six years**, not three. Sola was seven when he left. Update the Story Bible, the timeline table and every line of dialogue that mentions it.

### 1.3 Nana Wren's starship

The parked starship that Hank Briggs gives launch clearance for is **Nana Wren's old ship**: small, round, cream-colored, with pink engines and a bubble cockpit. Hank kept it safe for her grandchild. Update the hangar scene and its dialogue.

### 1.4 Nana Wren's badge

Mom's farewell gift is a brass cross-shaped badge with a glowing blue core, stamped "R.B. No. 1". Make it a key item, and have Nurse Coral recognize it at the Molten Frontier Recovery Bay.

---

## 2. Book 1 scenes to add (game Prologue to Ch 8)

| Where | Change |
| --- | --- |
| Cactus Gardens | **Tamsin the Explorer** runs the capture tutorial. She wears a straw hat and a vest covered in patches, one of them a question mark: "the world I never found." Her rule: "A capture isn't taking. It's asking." |
| Starter choice | **Optional:** the unchosen Bio starter runs off, then stows away in the player's bag. Skip this if it fights the starter system. |
| Mushroom Maze | **Strand frees a captured sporeling**, sees the player watching, and puts a finger to his lips. This is the first sign of his defection. |
| Ghost Ship (Thalassa) | The "howl" in the hold is a lost Chirpod. The player sets it free, and it's given as a gift if they choose. |
| Neonis | **New side quest: Glitchbug Outbreak.** A crashed Helix shuttle releases Glitchbugs across the city. Round them up; the last one joins the player. |
| Temple of Voices | Monolet guardians, a mirror light-beam puzzle, and a Chimelet whose note opens the great doors. |
| End of Act 1 | Cutaway: Sola on Helix Station beside Thorne. Thorne says, "Begin Phase Three." Then Zib's eye briefly reflects a giant dark eye opening. |

---

## 3. Book 2 changes (game Ch 9 to 14)

| Where | Change |
| --- | --- |
| Pyros | Old Basalt gives the player Teo's old mining lantern. Ashpup is an encouraged catch here. |
| Pyros, Deep Mines | Teo's first cache recording: "If you find this, Sola, I'm not lost. I'm following them home." |
| Glacia | Teo's second cache holds a crystal map: "the floating gardens beyond the light." Strand quietly tells the player where Helix is digging. |
| Helix Station | After the R4 rival battle, the Observation Deck plays two logs: first "Reyes was an acceptable loss," then Elena's reactor accident. Sola turns against Helix. |
| Helix Station | Sola fights beside the player in the double battle against Vex. Sola's starter reaches its final form during this battle. |
| Helix Station | A **Lumivex hatchling** freed from the captives bonds with Sola. |
| Halo | Liss tells the player she launched the last seedpod, the one carrying Zib, and stayed behind on purpose. |
| Umbra | Before the Shard 8 battle, Kade's schematics show that winning Shard 8 gives Thorne his key. Add a dialogue choice to go ahead anyway. Both answers lead to the battle; only the dialogue changes. |

---

## 4. Book 3 changes (game Ch 15 to 16)

### 4.1 New quests

- **ARC "Harbor Reclaimed" (required before the crater).** The player raids a Helix freighter with Captain Marsh to win back Thalassa's stolen tower core. The harbor tower relights afterward. Marsh: "Now we're even."
- **ARC "The Keepers' Call" (optional).** Short tower-defense battles: Ferrox alongside Hank, and Neonis, where DJ Static broadcasts Thorne's private logs to every world. Completing it adds the Keepers singing to the sealing cutscene.

### 4.2 Story beats

| Where | Change |
| --- | --- |
| Dustmere plaza | **Strand defects.** He lands a stolen shuttle and says, "Field Division. Second Class. Resigning." He flies the player past the cordon. |
| Rim Camp | General Ostrander blocks the player. Tamsin returns and gets them through as their guide. |
| Seedpod Fields | Zib finds his own pod shell. Add a short, quiet scene. |
| Crater Rim | Vex orders Pell to net Zib. Pell refuses and throws the net gun into the crater. |
| Novaryx | Keep both choices: capture, or calm it and be guided. Calm is canon, so give it a short extra scene. |
| Rift Engine | Thornvoid is Gravity/Void. Sola (Squawktone) fights beside the player in a double battle against Thorne. |
| The sealing | The player's starter evolves to its final form during the Signal song. The song's melody is the Spore Choir tune from Sporeholm; reuse that audio. |
| After the sealing | Teo steps out of the closing Rift with his adult Lumivex. He explains that the seal can only be healed from Ystra's side, and the Seedmother is fading. |

---

## 5. Book 4 changes (game Ch 17 to 18)

| Where | Change |
| --- | --- |
| Homecoming festival | Dusty finally names the Crater Four at the bonfire. |
| Recovery Bay attic | **Nana Wren's journal** (key item): she nursed three pods of baby saucers like Zib on the Starfall night, and sang back to the Seedmother's voice. |
| Journal, last page | Reveals that Nana built DX-4 to listen for the scout and watch over her grandchild. DX-4: "I KNEW THAT. PROBABLY." |
| Neonis | A short cutscene of Thorne's trial, where Strand and Vashti testify. |
| Thalassa | **Move Vex's capture** out of the postgame to here. Marsh, Pell and the player catch her aboard a smuggler's freighter. Pell: "Helix Directive! Field Division! ...Former." |
| Quorum, Hall of Crystal | Marisol Fenn (Facetrix) tells how the Crater Four built the first Linker. |
| Quorum, Hall of Sound | Duke Harrow (Encorex) tells how Orra and Vashti sealed the Codex. |
| Quorum, Hall of Fire | Saga whispers one Ystran word when defeated, and Zib flashes every color. |
| Quorum, Hall of Gravity | Ostrander confesses that he saw Teo walk into the light and let him go. |
| Orra's battle | Near the end, Orra targets Zib with a scripted attack. The player chooses **Shield Zib** or **Attack**. Shielding ends the battle and counts as passing. Attacking lets the battle play out normally, and Orra still hands over the torch. |
| Opening the Vortex | Thorne's letter includes a Codex page about "a door that is a road," opened only by a scout and a listener together. The Vortex opens at the Great Telescope through a lens built from Teo's crystal map. Vashti stays behind to hold it open. |

---

## 6. Book 5 changes (postgame on Ystra)

### 6.1 The Pillar tests

| Pillar | Test | What the player does |
| --- | --- | --- |
| Terravox | Strength | The team holds up a falling island together. |
| Aquelion | Memory | It offers to erase a sad memory, and the player refuses. |
| Ignarch | Courage | The player enters the Sun Forge without their partners and hears Nana Wren's voice singing. |

### 6.2 Story beats

| Where | Change |
| --- | --- |
| Crystal Ruins | Saga follows the party through the Vortex and reveals itself as a Ystran echo, and Liss's brother. |
| Map room | Tamsin finds the Ystran explorers' map room. The question-mark symbol is the Ystran word for "the place we haven't found yet." Tamsin stays on Ystra afterward. |
| Blighted Forest | The shadow creatures aren't attacking; they're begging. Rewrite their encounter text to show this. |
| Edge of the Void | **Oblivane** (Void/Gravity) can't be beaten. After a set number of turns a **Listen** command appears, and choosing it starts the Choir song. Oblivane is calmed and released in the story, not caught. If an optional capture exists, it comes only after the credits. |
| The ending choice | Add a third option to "rebuild Ystra" and "keep Kessler": **Both**. It is canon and should be the highlighted default. The Warp Gate wakes either way. |
| Zib's choice | The Seedmother tells Zib his mission is done. He chooses the player. Her line: "A scout's job is to find a home. You found one." |
| Epilogue | One year later. Thorne's letter: "Elena would have liked you. Tell your Zib thank you." Last scene: a new 13-year-old at the Observatory, and one shy capsule nobody picked. |

---

## 7. Optional: Kit Briggs (pause and ask before building)

Kit Briggs (they/them) is Hank's kid and the player's best friend in the books and anime. Write a proposal for adding Kit as a companion NPC from Ferrox onward. Kit's team would be:

- Sporix → Mycelith → Fungaroth, or whichever starter the player left behind
- Gleamgrub
- Iceburr
- Gearhound

Do not build this until the proposal is approved.

---

## 8. Not a game change

Lumislug stays **Toxin** in the game. Book 1's Xenodex wrongly lists it as Bio; that will be fixed in the book, not the game.

---

## Deliverables

1. All changes above, with the game building cleanly.
2. Updated story and quest files, each noting that the books are now story canon:
   - `docs/EPIC_STORY_BIBLE.md`
   - `docs/world/STORY_PROGRESSION_MASTER.md`
   - `data/quests.json`, with the new quests: Harbor Reclaimed, The Keepers' Call, Glitchbug Outbreak
   - `CLAUDE.md`
3. `docs/BOOK_SYNC_CHANGELOG.md`: a table of every change, listing the book and chapter it came from and the files touched.
4. A list of anything that couldn't fit or conflicts with game mechanics, for a decision.
