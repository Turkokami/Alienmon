# Proposal: Kit Briggs as a companion NPC

**Status: proposal only. Nothing here is built.** Book Sync section 7 asks for a proposal to approve first.

## Who Kit is

- **Who they are:** Kit Briggs (they/them) is Hank Briggs's kid and the hero's best friend in the books and the anime.
- **Their saga question:** *Can someone who fixes everything learn they're worth choosing?*
- **Their book beats:**
  - Chosen by Sporix (Book 1).
  - Frees the captives, and their Fungaroth evolves (Book 2).
  - Keeps the Keepers' network running (Book 3).
  - Builds the Vortex lens with Vashti (Book 4).
  - Repairs the Ystran Choir chamber (Book 5).

## What Kit would be in the game

A companion NPC who joins the story on Ferrox and is then part of every major scene. Kit isn't a party member you control. Kit is a friend who:

1. **Turns up in story scenes.** The story engine added for the Book Sync (`data/story.json` scenes and quest `then` lines) can carry Kit's lines with no new code.
2. **Fights beside you at key moments**, through the partner-battle system Sola already uses. Fights against Thorne, Vex and the Ferrox tower crew are already partner battles. Suggested Kit battles:
   - the Containment Wing, Book 2: Kit's Fungaroth roots the cages open;
   - the Crater Descent gravity trap, Book 3: Iceburr;
   - Hank's Iron Wall in The Keepers' Call, Book 3: Kit and Hank together;
   - the Blighted Forest, Book 5: Fungaroth heals the blight.
3. **Stands in town:**
   - Rustvale (Ferrox) after M05, next to Hank;
   - the Dustmere Recovery Bay after M19, with "keeper of the Shards" lines;
   - Ystra's Crystal Ruins after P01, fixing the Choir chamber.

## Kit's team

Each team member, with when it joins in the game:

| Alienmon | Joins | Notes |
| --- | --- | --- |
| The starter neither you nor Sola picked, or Sporix → Mycelith → Fungaroth | Ferrox (M05) | The books give Kit Sporix. In the game, Kit takes whichever starter is left, so all three starter lines always appear. If you picked Sporix, Kit has Gloopa's line. |
| Gleamgrub | Ferrox (M05) | Fits Ferrox's scrap theme, and matches side quest S20, "Scrap for Grub". |
| Iceburr | Glacia (M12) | Book 2: Kit catches it by fixing its frozen leg. |
| Gearhound | Homecoming (M19b) | Book 4: a gift from Hank. |

All of these are in the game data. No types change.

## What it would take

| Piece | Work |
| --- | --- |
| Art | **Kit has no sprite yet.** It needs `art/characters/kit_down/up/left/right.png` (64 px walk frames) and `kit_big.png` (portrait), in the style of the other characters. Placeholder: the `technician` sprite. |
| Data | Kit's lines in `data/story.json` scenes and quest `then` blocks, NPC entries in `data/sections/npcs.json`, and `ally` blocks on 4 battles. |
| Engine | None. The partner-battle code already supports any Alienmon (`ally: {who, mon, lv}`). For "the starter neither of you picked", a third value is needed alongside the existing `'rival'`, about 3 lines in `src/story.js`. |
| Testing | The story bot run, plus one manual run through the four Kit battles. |

Estimate: about half a day with placeholder art.

## Open questions for you

1. **Placement:** should Kit appear from Ferrox onward (the book order), or from the start in Dustmere?
2. **Team:** should Kit always use Sporix as in the books (so a Sporix player meets a second Sporix), or take the leftover starter (suggested)?
3. **Art:** who makes Kit's sprite and portrait? Kit is they/them, and both the books and the game use those pronouns.
4. **Book lines:** a few Book Sync lines currently give Kit's book moments to others. Should they go back to Kit once Kit exists?
   - Vashti builds the Vortex lens "with us".
   - The Keepers' relay is run by Hank.
