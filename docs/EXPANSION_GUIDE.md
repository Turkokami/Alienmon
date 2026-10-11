# Expanding Alienmon in batches

Alienmon grows the way the big monster franchises do: each **batch** is a new star system with its own planets, story and Alienmon, added on top of everything before it. The engine already supports this; nothing in the code needs to change to add a batch.

## How batches work
- Every batch lives in its own folder under `data/batches/`, named so they sort in release order (`batch01_kessler`, `batch02_<name>`, ...).
- `tools/build.js` loads every batch folder in order and merges them into one game.
- The Warp Gate in space carries the player from system N to system N+1. In Batch 1 it says new systems are coming; it activates automatically once Batch 2 exists.
- Old Alienmon stay catchable forever, and new planets can include returning species.

## What a batch folder contains
| File | Contents |
| --- | --- |
| `batch.json` | `{"batch": 2, "system": {"id": 2, "name": "..."}, "dex_range": [301, 420]}` |
| `alienmon.json` | The new Alienmon, same fields as Batch 1 (see below) |
| `planets.json` | The new planets, each with `"sys": 2` |

## Alienmon fields
| Field | Meaning |
| --- | --- |
| `n` | Xenodex number, continuing from the last batch (Batch 2 starts at 301) |
| `name`, `t` | Name and 1–2 types |
| `st`, `tot`, `to`, `m` | Stage, line length, evolves into, evolution method (`Level N` or a Resonance rule) |
| `s` | Base stats: HP, Atk, Def, Sp. Atk, Sp. Def, Speed |
| `r` | Role: `normal`, `signature`, `legendary`, `mythic`, `mascot`, `starter` |
| `tr` | Index into the Trait library in `core_battle.json` |
| `sig` | Index into the signature moves list, or -1 |
| `lore`, `b` | Xenodex entry and batch number |

## Planet fields
`key`, `name`, `env` (one of the 13 environments or a new one), `lv` (wild level range), `req` (`{"s": shards, "f": "story flag"}`), `x`/`y` position in that system's space map, `r` radius, `col` colors, `ring`, `pool` (common/evolved/rare/legendary Alienmon indexes), `keeper` (name, dialog, team), `npc` and `tower` text.

## Suggested batch size and checklist
Aim for **100–150 Alienmon and 8–12 planets per batch**: enough to feel like a new region without diluting quality.

1. Write the system's story arc (new villain or a continuation, new Keepers, a new legendary trio).
2. Design the Alienmon lines, at least 2 per type, with a few new dual-type combinations.
3. Assign Traits (reuse the library; add new ones to `core_battle.json` with a new mechanic only when the engine supports it).
4. Generate art with the ChatGPT prompt pack template and replace the generated sprites.
5. Build planets, encounter pools and Keeper teams. Level ranges should continue upward from the previous batch's endgame.
6. `npm run build`, playtest the new system end to end, then ship an app update.

## Ideas reserved for later batches
- New types (for example Solar Wind or Quantum) once the 14-type chart is well tested
- Regional forms of Batch 1 Alienmon adapted to new planets
- Trading and online battles between players
- Ship upgrades (faster engines, scanners that reveal rare Alienmon)
