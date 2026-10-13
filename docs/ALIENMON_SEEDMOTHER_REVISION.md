# Alienmon Story Revision 2: The Seedmother's Seeds (current canon)

> **Source:** the owner's brief of 2026-10-13. The Revision 2 document itself was never added to the project, so this file records the canon exactly as that brief states it. If the full Revision 2 text turns up, it replaces this file.
> **Where this file disagrees with `docs/SAGA_MASTER_PLAN.md`, `docs/ALIENMON_BOOK_SYNC_CHANGES.md` or Revision 1, this file wins.**

## The canon

- **Act 1 is unchanged.** It covers the Prologue to Ch 8 (Book 1). In Act 1, characters believe the Seedmother stayed behind on Ystra. No hint of the truth comes before Pyros.
- **The reveal happens in Act 2, in four steps:**
  1. **Pyros:** a journal entry with Vashti's damaged Codex line: *"She is scattered so she may live..."*
  2. **Glacia:** Ingrid's fossils show no trace of the Seedmother.
  3. **Halo, the third wind shrine:** Liss reveals the truth, and the full prophecy becomes a key lore item, the **Prophecy Shrine**.
  4. **Umbra, after Shard 8:** Zib's full message, in the Seedmother's voice.
- **The truth:** the Seedmother split her whole self into the seedpods as Oblivane devoured Ystra. Every Alienmon carries a piece of her. Only the dying **Heartroot** is left on Ystra.
- **The prophecy:** *"She is scattered so she may live. Whoever reunites all her children will let the Seedmother grow again, and her world with her."*
- **Reuniting means bonding, never caging.** Every Alienmon stays itself.
- **Project Unity:** Helix cages one of every species because Thorne misreads the prophecy. He thinks holding them all gives him her power, and a way to bring back Elena.
- **The ending:** Oblivane is healed first. Then comes the Reunion: every Keeper and trainer brings their Alienmon through the Warp Gate, and the Seedmother regrows as a world-tree.
- **The Xenodex:** a Heartroot meter grows with species registered, and Ystra blooms at milestones. Completing it unlocks a bonus Unifier epilogue. **Never lock the story ending behind dex completion.**
- **Unchanged rules:** the books win on story, characters and dialogue; game data wins on types, stats and moves.

## Enforced by the build
`tools/check_act1.js` fails the build if any Act 1 quest text, story scene, sign, townsperson line or planet blurb mentions the Heartroot, the prophecy, "piece of her", "every species", Project Unity, or "scattered" next to she, her, children or mother.
