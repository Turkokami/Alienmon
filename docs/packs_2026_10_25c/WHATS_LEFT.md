# Alienmon: everything still left (25 Oct 2026)

## A. Renders for you to make (new today)
| Pack | Renders | Why |
|---|---|---|
| Alienmon_Fixes_pack.zip | 2 | Recovery Bay room re-save (last one was cut off) + Pell's talk portrait |
| Alienmon_Cast_Sprites_pack.zip | 38 | Main story cast are still the old small blurry sprites with no back view; Pell has no sprite at all |
| Alienmon_Story_Pictures_Ch11_to_End.zip | 23 | Story pictures stop at chapter 10; the whole second half (Teo's return, Novaryx, Ystra, the Seedmother) has none |
| Alienmon_Story_Pictures_Sporix_Gloopa.zip | 42 | 21 pictures only exist for Plazmo players; Sporix/Gloopa players get words only |

Suggested order: Fixes, then Cast, then Ch11-to-End, then the Sporix/Gloopa versions.

## B. Packs sent earlier, still waiting on
| Pack | Count |
|---|---|
| Music remaining (Ferrox, Sporeholm, Thalassa, Recovery Bay, Caves) | 5 tracks |
| ElevenLabs side quests + Keeper battles | 213 lines |
| Lake maps re-render | 17 maps |
| World expansion (2 new areas per world) | 28 maps |
| Ferrox reservoir (Coolant Reservoir + Reservoir Islands) | 2 maps |

## C. Testing
- Claude in Chrome story playthrough (prompts/Claude_in_Chrome_STORY_PLAYTHROUGH.md). Paste its final table back to me and I fix everything on it.

## D. Things I build next (no renders needed)
1. Fix everything the playthrough finds.
2. Wire each new picture / sprite / song / voice batch as it arrives.
3. Arena sounds: the 20 announcer clips are now identified and filed (three, two, one, go, round one, K.O., victory, sudden death...); the 28 sound effects and 14 music cues are ready to wire. Arena stays test-only.
4. Linker Card Battle port (from alienmon-card-info-pack; rule changes go to Kristofer first).
5. Narration voice lines for the 23 new story pictures (small ElevenLabs add-on once the pictures are in and the words are final).
6. Victory fanfare after Keeper wins; make the new soundtrack the default music (your call).
7. Map fixes still open: the golden-grass field with the two old men (send me a screenshot with the map name), the Crane Overlook dark edge.

## E. Decisions only you can make
1. **Kit: boy or girl?** The book (Ch7: "a boy, he/him", short messy brown hair, oil smudge, brass goggles) and the recorded voices say boy.
   The current in-game Kit sprite/portrait has red spiky hair. The cast pack draws Kit from the book; skip `kit.md` to keep the current look.
2. **Push live?** Cloud backup, soundtrack, story voices, new sprites and today's story fixes are all on the test link only. Live keeps the tester login.
3. **Music default:** new soundtrack or chiptune?

## F. Before a public app launch (not urgent, so they don't surprise us)
- **Kids audience (8 to 12):** app stores have family/kids rules. We already collect no personal data (cloud backup is a code, not an account). We will still need a short privacy policy page and the store age-rating questionnaire.
- **Store listing:** app icons and the Play feature graphic exist; still need 4 to 8 phone screenshots and a short description.
- **Remove the tester login** on launch day.
- **Bug-report button:** needs BUG_GITHUB_TOKEN added in Vercel (owner action) or it stays switched off.
