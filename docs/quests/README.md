# Alienmon — Story Quests & Side Missions pack

All Batch 1 quests, ready for Claude Code to build into the game.

| File | What it is |
| --- | --- |
| `MAIN_STORY_QUESTS.md` | 25 main story quests in play order, Act 1 → Postgame, with locations, objectives, dialogue and rewards |
| `SIDE_QUESTS.md` | 46 side missions grouped by world |
| `QUEST_LOCATIONS.md` | Every quest location grouped by area, with map coordinates |
| `quests.json` | The same quests as structured data for the game |
| `QUEST_SYSTEM_SPEC.md` | How Claude Code should build the quest system: save data, triggers, rewards, quest log UI, markers |
| `CLAUDE_CODE_PROMPT.txt` | Paste this into Claude Code |
| `world_map.json` | Updated Molten Frontier map data: fixes some NPCs that were stacked on top of each other |

## Where these go in the project
- `quests.json` → `alienmon-app/data/quests.json`
- `world_map.json` → `alienmon-app/data/world_map.json` (replace the old one)
- The `.md` files → `alienmon-app/docs/quests/`
