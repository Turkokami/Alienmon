# Book Sync changelog

The Alienmon novels (Books 1–5, planned in `docs/SAGA_MASTER_PLAN.md`) are now the story canon. This table lists every change made to bring the game in line with them. The books win on story, characters and dialogue; the game data wins on types, stats and moves (no types were changed).

**How to read the "Files" column:**

| Short name | File |
| --- | --- |
| Q | `data/quests.json` |
| SP | `data/sections/quest_spots.json` |
| ST | `data/story.json` |
| NP | `data/sections/npcs.json` |
| EB | `docs/EPIC_STORY_BIBLE.md` |
| WS | `data/world_state.json` |
| engine | `src/story.js`, plus hooks in `src/quests.js`, `src/sections.js`, `src/template.html` and `src/world.js` |

## Changes

### Section 1: canon fixes

| Change | From | Where in the game | Files |
| --- | --- | --- | --- |
| Renamed 12 Alienmon (Plazmet, Gleamgrub and ten more; old names only in data/renames.json) | Name check, all books | Everywhere: data, dialogue, docs, sprite files | `data/renames.json`, data, docs, `art/sprites`, `art/sprites_back`, `art/overworld`, `art/raw`, `src/extras.js` (save migration), `tools/check_names.js` (the build fails on old names) |
| Teo has been missing six years (Sola was seven) | Book 1, Ch 1 | Sola after the first rival battle (M03); Old Basalt (M11) | EB, Q |
| The ship Hank clears for launch is Nana Wren's old starship | Book 1, Ch 10 | Launch clearance text after M05; Hank's M05 lines | WS, Q, EB |
| Nana Wren's badge (key item, "R.B. No. 1"), Mom's farewell gift | Book 1, Ch 5 | Given after M03; older saves get it automatically | Q, ST, engine |
| Nurse Coral, Nana Wren's old apprentice, recognises the badge and heals you | Book 1 | Palm Isle, Molten Frontier (section 017) | NP |

### Section 2: Book 1

| Change | From | Where in the game | Files |
| --- | --- | --- | --- |
| Tamsin the Explorer runs the capture tutorial (straw hat, question-mark patch, "A capture isn't taking. It's asking.") | Book 1, Ch 4 | S04 in Cactus Gardens (011), now available after M02 | Q, SP |
| Strand frees a captured sporeling and puts a finger to his lips | Book 1, Ch 13 | Mushroom Maze (047), during M06 | ST |
| The ghost ship's "howl" is a lost Chirpod; take it or let it fly home | Book 1 | S40, Thalassa | Q |
| NEW side quest S53, Glitchbug Outbreak: a crashed Helix shuttle releases Glitchbugs; round them up and the last one joins you | Book 1 | Neonis (063, 066) | Q, SP |
| Temple of Voices: Monolet guardians, a mirror light-beam puzzle, a Chimelet's note opens the great doors | Book 1 | S62, now "The Great Doors" (078–080) | Q, SP, engine (`show` accepts a species line) |
| End of Act 1 cutaway: Sola beside Thorne ("Begin Phase Three"), and Zib's eye reflects a giant dark eye | Book 1, Ch 26 | After M10 | Q |

### Section 3: Book 2

| Change | From | Where in the game | Files |
| --- | --- | --- | --- |
| Old Basalt gives you Teo's old mining lantern (key item); Ashpup is the encouraged catch | Book 2, Ch 2–3 | M11, Cinder Hollow; Ashpup's Pyros wild weight raised | Q, `data/progression.json` |
| Teo's first cache: "If you find this, Sola, I'm not lost. I'm following them home." | Book 2, Ch 4 | New M11 step, Deep Mines B2 (088) | Q, SP, ST (save shift) |
| Teo's second cache: the crystal map, "the floating gardens beyond the light" (key item) | Book 2, Ch 8 | New M12 step, Crystal Caverns B2 (099) | Q, SP, ST |
| Strand quietly tells you where Helix is digging; Pell is "not lost" | Book 2, Ch 8 | Crystal Caverns B1 (098), after M11 until M13 | NP |
| R4 rival battle with Sola, then the Observation Deck plays "Reyes was an acceptable loss" and Elena's reactor log | Book 2, Ch 17–18 | M14 (112) | Q, SP, engine (`rival_stage`) |
| Sola turns and fights beside you against Vex; her starter reaches its final form during the battle | Book 2, Ch 19 | M15 (Vex moved from M14 to M15) | Q, SP, engine (partner battles) |
| A Lumivex hatchling from the captives bonds with Sola | Book 2, Ch 19 | After M15 | Q |
| Liss launched the last seedpod, Zib's, and stayed behind on purpose | Book 2, Ch 21 | After M16 | Q |
| Kade's schematics: Shard 8 is Thorne's key, with a choice to go ahead anyway (both answers lead to the battle) | Book 2, Ch 24–25 | New M17 steps, Kade's Lab (133) | Q, SP, ST |

### Section 4: Book 3

| Change | From | Where in the game | Files |
| --- | --- | --- | --- |
| NEW main quest M17b, Harbor Reclaimed: raid a Helix freighter with Captain Marsh, win back the tower core, and the tower relights ("Now we're even."). Required before the crater | Book 3, Ch 5 | Port Saltreach Docks (052) | Q, SP, ST (older saves past it count it as done) |
| NEW side quest S102, The Keepers' Call: hold the Ferrox tower beside Hank and the Neonis tower beside DJ Static, who broadcasts Thorne's logs. Completing it adds the Keepers singing to the sealing | Book 3, Ch 3–6 | Rustvale (030), Ferrox Tower (039), Voltspire (069) | Q, SP |
| Strand defects in Dustmere's plaza ("Field Division. Second Class. Resigning.") and flies you past the cordon | Book 3, Ch 9 | New first step of M18 (004) | Q, SP, ST |
| Ostrander blocks you at Rim Camp; Tamsin returns as your guide | Book 3, Ch 10 | Rim Camp (136) scenes, plus a Tamsin NPC | ST, NP |
| Zib finds his own pod shell | Book 3, Ch 11 | Seedpod Fields (138) | ST |
| Vex orders Pell to net Zib; Pell throws the net gun into the crater | Book 3, Ch 14 | Crater Rim (141) | ST |
| Novaryx: calm it and be guided (canon, default, with an extra scene) or capture it | Book 3, Ch 13 | New M18 choice at the Crater Rim | Q, engine (`skip_if`, `at`) |
| Thornvoid (Gravity/Void, already in the data); Sola's Squawktone fights beside you against Thorne | Book 3, Ch 20 | M19 (145) | Q |
| The sealing: the Signal song is the Spore Choir tune; your starter reaches its final form; the Keepers sing if you finished S102 | Book 3, Ch 23–24 | M19 cutscene | Q, engine (`evolve`, `lines_if`, the Spore Choir chiptune) |
| Teo steps out of the Rift with his adult Lumivex: the seal can only be healed from Ystra's side, and the Seedmother is fading | Book 3, Ch 25–26 | End of M19 | Q |

### Section 5: Book 4

| Change | From | Where in the game | Files |
| --- | --- | --- | --- |
| NEW main quest M19b, Homecoming: Dusty names the Crater Four at the bonfire | Book 4, Ch 2 | Dustmere plaza (004) | Q, SP, ST |
| Nana Wren's journal (key item): three pods of baby saucers, and she sang back to the Seedmother | Book 4, Ch 4 | M19b, Dustmere Recovery Bay (005) | Q, SP |
| The journal's last page: Nana built DX-4. "I KNEW THAT. PROBABLY." | Book 4, Ch 5 | M19b, DX-4 in the plaza | Q, SP |
| Thorne's trial (Strand and Vashti testify), and his letter with the Codex page (key item) | Book 4, Ch 7–8 | M19b cutscene at the Neonis Starport (062) | Q, SP |
| Vex's capture moved out of the postgame: Marsh, Pell and you catch her on a smuggler's freighter ("...Former.") | Book 4, Ch 9 | M19b, Thalassa docks (052), with Marsh as your partner | Q, SP |
| Orra's invitation to the Summit | Book 4, Ch 10 | End of M19b | Q |
| The Quorum halls: Marisol (the first Linker), Harrow (the sealed Codex), Saga (one Ystran word, and Zib flashes every colour), Ostrander (he let Teo go) | Book 4, Ch 13–16 | M20, one line set per hall | Q |
| Orra targets Zib: Shield Zib ends the battle as a pass; Attack plays on, and Orra still hands over the torch | Book 4, Ch 18 | M21 | Q, engine |
| Opening the Vortex: Thorne's Codex page, a lens from Teo's crystal map, and Vashti stays behind to hold it open; you walk through to Ystra | Book 4, Ch 24–26 | New P01 steps at the Great Telescope (151), plus a Vashti NPC | Q, SP, ST, NP, engine (`go`) |

### Section 6: Book 5

| Change | From | Where in the game | Files |
| --- | --- | --- | --- |
| Pillar tests before each Pillar battle: Terravox (strength: hold an island together, needs 3 partners), Aquelion (memory: refuse to erase it), Ignarch (courage: walk into the Forge alone and hear Nana Wren singing) | Book 5, Ch 4, 6, 8 | Floating Continents (154), Drowned Seas (156), Sun Forge (157) | engine |
| Saga reveals itself as a Ystran echo and Liss's brother | Book 5, Ch 9 | Crystal Ruins 1F (158) | ST, NP |
| Tamsin's map room: the question mark means "the place we haven't found yet"; she stays on Ystra | Book 5, Ch 12 | Crystal Ruins 2F (159) | ST, NP |
| The shadow creatures aren't attacking, they're begging | Book 5, Ch 15 | Blighted Forest (160–161): scene, S111 text, Blightling battle line | ST, Q, engine |
| Oblivane can't be beaten. After 3 turns LISTEN replaces RUN and starts the Choir song; it is calmed and released, not caught. A team wipe also hands over to the Choir. It can optionally be caught only after the credits | Book 5, Ch 18–22 | P02 at the Edge of the Void (162); after P04, an Oblivane encounter there | Q, NP, engine |
| A third ending option, Both, is canon and the highlighted default; the Warp Gate wakes either way | Book 5, Ch 24 | P03 | Q |
| Zib's choice: "A scout's job is to find a home. You found one." | Book 5, Ch 25 | After P03 | Q |
| Epilogue, one year later: Thorne's letter, and the shy capsule nobody picked | Book 5, Ch 26 | After P04; the "Batch 2 coming soon" line is replaced by the open Warp Gate | Q |

### Section 7: Kit Briggs

| Change | From | Where in the game | Files |
| --- | --- | --- | --- |
| Kit Briggs (they/them) built as a companion NPC; Kit's book moments given back to Kit | All books | Gate Plaza meeting, Rustvale, Aurora Route, Containment Wing, Ferrox tower partner battle, Crater Descent, Dustmere, Great Telescope, Crystal Ruins, Blighted Forest | ST, NP, Q, engine (`{kit}` tokens, `ally.mon: 'kit'`, Technician art until Kit's sprite exists) |
| The stowaway: the starter nobody picked runs off at the lab, hides in your bag (a key item) after M03, and chooses Kit on Ferrox | Book 1, Ch 1 | Lab, M03, Gate Plaza (029) | `src/sections.js`, ST, Q |
| A calmed Novaryx can be found and caught at the Crater Rim after the credits | Book 3 / owner decision | Crater Rim (141) after P04 | NP |

### Section 8: not a game change

| Change | From | Where in the game | Files |
| --- | --- | --- | --- |
| Lumislug stays Toxin (the Book 1 Xenodex will be fixed instead) | Book 1 Xenodex | No change | none |

### Docs

| Change | From | Where in the game | Files |
| --- | --- | --- | --- |
| Saga Master Plan and Epic Story Bible added as Markdown; the plan's renamed-Alienmon row now points at `data/renames.json` so the old-name build check passes | n/a | n/a | `docs/SAGA_MASTER_PLAN.md`, `docs/EPIC_STORY_BIBLE.md`, `tools/pdf_to_md.py` |

## Seedmother Revision 1 (history: docs/ALIENMON_SEEDMOTHER_REVISION_1.md, superseded by Revision 2 below)

| Change | From | Where in the game | Files |
| --- | --- | --- | --- |
| Prophecy Mural: a final panel and a key item, "Prophecy Rubbing", carrying the legend | Rev 4.1; Book 1, Ch 25 | M10, Glyphos Mural Hall | Q, `src/story.js` |
| End-of-Act-1 cutaway: "Every species, Sola. When we have them all, she answers to us." | Book 1, Ch 26 | After M10 | Q |
| Ingrid: no fossil of the Seedmother. "There was nothing left to bite." | Book 2, Ch 9 | M12 | Q |
| Project Unity: a sign over the cage halls, the log terminal on Containment Wing 1F, Bronn's lines, the broken collection | Rev 4.1; Book 2, Ch 15–16 | Helix Station (109), S90 | Q, ST, `data/sections/planets/09_helix.json` |
| Thorne's second log adds his plan | Book 2, Ch 18 | M14 | Q |
| Zib's message rewritten: "She is in every one of you..." | Book 2, Ch 26 | After M17 (Shard 8) | Q |
| Static's broadcast exposes Project Unity | Book 3, Ch 6 | S102 | Q |
| Thorne sees barren Ystra: nothing to command; for a heartbeat the Seedmother is whole in the song | Rev 4.3; Book 3, Ch 21, 23 | M19 sealing | Q |
| Teo: the Heartroot is dying | Book 3, Ch 26 | End of M19; Teo in the Reyes house | Q, NP |
| Nana's journal: "pieces of one mother"; the Codex page's second half: no Reunion while Oblivane hungers | Book 4, Ch 4, 8 | M19b | Q |
| Orra: the Unifier chooses a partner over winning; the prophecy is broadcast in the open | Book 4, Ch 18–19 | M21 | Q |
| Every Keeper promises to come through when called | Book 4, Ch 22 | P01, Vashti | Q |
| Ystra is barren; Liss shows the Heartroot | Book 5, Ch 1–2 | End of P01 | Q |
| The Pillars name you "Unifier" ("Nobody said catch.") | Book 5, Ch 8 | After all three Pillar tests | `src/story.js` |
| Blight healing only works a little; Oblivane's light returns but the land stays bare | Book 5, Ch 14, 22 | S111, P02, LISTEN scene | Q, `src/story.js` |
| P03 becomes The Reunion: the Heartroot, everyone comes through the Vortex, the Seedmother grows and holds Oblivane; the children choose where to live (Both default, a line per choice) | Rev 4.2, 4.3; Book 5, Ch 23–25 | P03 (new cutscene step) | Q, ST (save shift) |
| Epilogue: the tree seen through the Warp Gate; "I wanted to own her. You set her free." | Book 5, Ch 26 | After P04 | Q |
| Xenodex: subtitle and a Heartroot page (press A) whose glow grows with caught and befriended species | Rev 4.2 | START > Xenodex | `src/story.js`, `src/template.html` |
| Ystra blooms at each sixth of all species (50 per step with Batch 1's 300), each with a returning Ystran echo; the total grows with new generations | Rev 4.2 | Ystra 153, 154, 156, 158, 160, 163 | `src/story.js`, NP, WS (`heartroot`) |
| Unifier bonus (every species in the game, after the story): epilogue, Unifier title, golden Linker skin | Rev 4.2 | Anywhere, after P04 | `src/story.js`, `src/template.html` |
| Old lines saying the Seedmother is alive, waiting or fading were rewritten | Rev 4.1 | Ystra NPCs, Pyros shrine text, key items | `data/sections/planets/14_ystra.json`, `data/batches/batch01_kessler/planets.json`, `src/world.js` |

**Not done, or worth deciding (Revision 1):**
1. **A real "Codex/journal" screen:** the game has none, so the legend lives in the Prophecy Rubbing key item (Bag > Key Items) and on the Xenodex Heartroot page.
2. **Ystra's maps don't visibly change:** blooming is shown through returning echoes and dialogue, because new map art isn't allowed. Bloomed versions of the Ystra maps could be rendered later.
3. **The Unifier's "Linker skin":** this is the golden device shell, not an in-world outfit, because no player outfit system exists.
4. **The Forge Fortress cage hall:** it's on the classic painted map, so Project Unity is labelled only on Helix Station.

## Book 1 edition of 2026-10-14

The new edition of *The Kessler Signal* (about 100,000 words; it was 85,000) redesigns several Alienmon, makes Helix menacing instead of comic, and no longer has the Seedmother prophecy, the ring-of-Alienmon mural or Thorne's "every species" line in Book 1. The game already matched those last three (Revision 2) and every type the new Xenodex appendix lists (Glitchbug Volt/Swarm, Gleamgrub Toxin/Alloy, Lumislug Toxin, Monolet Gravity/Psi, Chimelet Sonic/Crystal, Anvilox Magma/Alloy, Chirpod Sonic, Bubbub Hydro, Skitterdrone Swarm).

| Change | Book (2026-10-14) | Where in the game | Files |
| --- | --- | --- | --- |
| Xenodex descriptions match the redesigns: Zib's glass dome, one-eyed knee-high Cactling, Pebblet, Fizzle, rust-slug Gleamgrub, Anvilox the Anvil Hound, lime-green Lumislug, lantern-bell Tidaloid, rope-fibre Mycelith, Bubbub in its bubble, pom-pom Chirpod, dish-winged Skitterdrone, striped Glitchbug, standing-stone Monolet, silver-bell Chimelet, and the bigger starters | Ch 1-2, 4, 8-9, 12-13, 15-17, 20, 24, appendix | START > Xenodex, first-catch screen, website Xenodex | `data/batches/batch01_kessler/alienmon.json` |
| Pell and Strand are no longer comic: Pell is a calm field agent ("Helix doesn't lose things. We just collect them later."), Strand is quietly reluctant ("You didn't see that, and I didn't see you.") | Ch 5, 10, 13, 17, 20 | Glacia Fossil Dig pair (098), Strand freeing the sporeling, Helix barracks joke | `data/sections/npcs.json`, `data/story.json`, `data/sections/planets/09_helix.json` |

**Not changed, worth deciding:**
- Sprites still show the old designs where the book redesigned them (Cactling, Gleamgrub, Lumislug, Chirpod, Bubbub, Glitchbug, Monolet, Chimelet, Anvilox, Tidaloid, Mycelith, Skitterdrone, Zib). New art is needed to match.
- The Helix logo is now an orange ring with a diagonal slash; any Helix art with the old twisting-ladder mark needs repainting.
- New book NPCs not in the game: Brann (a grunt with a static-net launcher), Pip (a young grunt's Skitterdrone), Mr. Abernathy (the Dustmere baker). New item: Dr. Moor's Spore tonic.
- Kit stays they/them in the new edition (the website now uses he/him; the book and the game use they/them).
- Later-book gags kept for now: Strand's "...Resigning" (M18) and Pell's "...Former" (M19b) still reference "Field Division, Second Class", which Book 1 now only uses once (Strand, Ch 20).

## Seedmother Revision 2 (docs/ALIENMON_SEEDMOTHER_REVISION.md, current)

| Change | From (file, section) | Where in the game | Files |
| --- | --- | --- | --- |
| Act 1 restored to its book text: the Glyphos Prophecy Mural step, its rubbing, "Every Alienmon is a piece of her" and Thorne's "Every species, Sola" line come out of M10 | Revision 2: "Act 1 is unchanged" | M10 Glyphos | `data/quests.json`, `data/sections/quest_spots.json` |
| Build check: fails on any Act 1 hint (quests, scenes, signs, townsfolk, planet blurbs) | Revision 2: the task's check | Build | `tools/check_act1.js`, `tools/build.js` |
| Old saves: the Act 1 rubbing is removed; a save left on the removed M10 step completes normally; saves past Halo get the Prophecy Shrine | Revision 2 | Save load | `src/story.js`, `data/story.json` (version 7) |
| The Xenodex Heartroot page and its subtitle open only after the Halo reveal | Revision 2: Act 1 unchanged; the Xenodex meter | START > Xenodex | `src/story.js`, `src/template.html` |
| Reveal 1, Pyros: Teo's journal page with Vashti's damaged Codex line, "She is scattered so she may live..." | Revision 2: reveal step 1 | M11, Teo's cache, Deep Mines | `data/quests.json`, `src/story.js` |
| Reveal 2, Glacia: Ingrid's fossils show no trace of the Seedmother (kept from Revision 1) | Revision 2: reveal step 2 | M12 | `data/quests.json` |
| Reveal 3, Halo: at the third wind shrine Liss reveals the truth and the full prophecy, which becomes the Prophecy Shrine lore item; the cutscene uses the Prophecy Mural art | Revision 2: reveal step 3 | M16, new step at the Floating Gardens (120) | `data/quests.json`, `data/sections/quest_spots.json`, `data/story.json` (save shift) |
| Reveal 4, Umbra: Zib's full message, in the Seedmother's own voice | Revision 2: reveal step 4 | After M17 (Shard 8) | `data/quests.json` |
| Project Unity on the Forge Fortress cage hall too (signs beside the lower cage rooms); the Helix Station log terminal explains it | Revision 2: Project Unity | Forge Fortress (painted map), Helix Station 109 | `data/painted_maps.json`, `data/sections/planets/09_helix.json` |
| The Reunion comes through the Warp Gate, which wakes at the Reunion and stays open | Revision 2: the ending | P03 cutscene, P03 and P04 dialogue | `data/quests.json` |
| Spoiler-free Xenodex lore for the Seedmother and Oblivane (no Act 2 reveal in the lore the website uses) | Revision 2: Act 1 unchanged | Xenodex, website | `data/batches/batch01_kessler/alienmon.json` |
| Stale "the Seedmother waits past the void" lines removed from scratch build files | Revision 2: sweep for alive/waiting/fading | Not in the game | `data/sections/tmp/*.json` |
| The Book Sync file and Revision 2 canon are stored in the project; Revision 1 is kept and marked superseded | Task | Docs | `docs/ALIENMON_BOOK_SYNC_CHANGES.md`, `docs/ALIENMON_SEEDMOTHER_REVISION.md`, `docs/ALIENMON_SEEDMOTHER_REVISION_1.md`, `CLAUDE.md`, `docs/EPIC_STORY_BIBLE.md`, `docs/world/STORY_PROGRESSION_MASTER.md` |

**Unchanged from Revision 1, and still correct under Revision 2:**
- the Heartroot meter and the Ystra blooms;
- the Unifier bonus;
- Project Unity on Helix Station;
- the Reunion and the children's choice;
- the Act 2+ dialogue sweep.

## How the new story data works

`src/story.js` explains the new quest fields in its header comment.

- **Follow-ups:** `then` runs when an objective completes and `epilogue` when the whole quest does. They can show lines, give items, key items, flags and Alienmon, evolve your starter, or `go` to a section.
- **Cutscenes:** data-driven `scene`, `lines` and `lines_if`, and an `at` section so they play where the story happens.
- **Choices:** a `default` option.
- **Battles:**
  - `ally` makes a partner fight beside you;
  - `test: 'orra'` runs Orra's test;
  - `listen` makes an encounter that can only be calmed;
  - `rival_stage` holds Sola's ace at a given form.
- **Section scenes:** `data/story.json` plays them once on entering a section.
- **Saves:** `data/story.json` also migrates older saves: inserted objectives move a save's step on, new main quests count as done if you're past them, and missing key items are filled in.

## Decisions (owner, after the first pass)

1. **The stowaway** is in. It stays a story companion in your bag, never a second starter you own, and it becomes Kit's partner, which keeps the three-starter rule.
2. **Double battles** stay as partner battles.
3. **The Spore Choir hum** stays.
4. **Places with no map:** ChatGPT prompts for the six missing locations are in `Alienmon_Book_Locations_Prompts.zip`. Until the maps exist, the scenes stay where they are.
5. **Kit Briggs** is built (see above). The sprite prompt is in the same zip.
6. **Saga as Liss's brother:** left as it is for now. It's one line in `data/story.json` if that changes.
7. **Novaryx:** a calmed Novaryx is catchable after the credits.
8. **Story order changes:** kept as they are.
   - Tamsin's tutorial opens after M02.
   - Vex's defeat moved to M15.
   - The Codex page arrives during Homecoming.
9. **Oblivane:** the fight can't be lost; the Choir takes over if your team falls.
10. **Batch 2 tease:** the "coming soon" line was replaced by the open Warp Gate; the epilogue ends on Oblivane.
