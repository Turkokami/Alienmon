# Live PvP and trading: build plan

Status: **trading by code is built** (Recovery Bay counter > Trade). **Live real-time PvP is planned, not built.**
This plan lists what live PvP needs, in the order it would be built, so nothing done now has to be thrown away later.

## What exists today (and is reused)

- **Battle engine** (`src/template.html`: `startBattle`, `turn`, `act`, `aiMove`, `endBattle`). Turns are already resolved
  in one place: the player picks an action, the opponent picks one, then both resolve by speed/priority. Live PvP keeps this
  exact resolution and only changes where the opponent's choice comes from (another player instead of `aiMove`).
- **Alienmon serialization** (`src/sections.js`: `tradeEncode` / `tradeDecode`). The same format, with the same validation
  (species, level, moves, Potential range, mythic block), describes a team for a PvP lobby.
- **Linker ID** (`G.lid`), a per-save number. It becomes the player's PvP handle until real accounts exist.
- **Server:** the private-beta Vercel project already has a Supabase (Postgres) database attached
  (`POSTGRES_*`, `SUPABASE_*` environment variables), unused so far. Supabase Realtime channels can carry battle turns.

## Phase 1: async "battle codes" (no server)

1. Export your team as a code (6 Alienmon) using the trade format.
2. A friend imports it and battles it, played by the game's AI (`aiMove`), with both teams set to level 50.
3. Results are shown locally only.

This gives player-versus-player teams with no infrastructure, and it exercises team validation and level-50 scaling.

## Phase 2: accounts and cloud saves (the earlier "phase 5")

- Supabase Auth (email magic link or Discord). Saves move to a `saves` table (one row per player) and sync on autosave.
- This is needed before live PvP, so results and anti-cheat checks have a real identity behind them.

## Phase 3: live real-time PvP

**Lobby**
- A `pvp_rooms` table: room code, the two player IDs, both teams (validated server-side), status.
- Create room → share the 4-letter code → friend joins. Or quick-match from a queue table.

**Turns**
- Both players join a Supabase Realtime channel named after the room.
- Each turn, each client sends `{turn, action: move|switch|item|forfeit, index}`.
- The resolver must be **deterministic**: both clients run the same turn with a shared random seed (`rng(roomSeed + turn)`),
  so they always agree on damage, crits and accuracy. The server only relays actions and records the final result.
- Timeouts: 60 s per turn, then a random legal move is picked; 3 timeouts in a row is a forfeit.

**Rules**
- Level 50 flat (levels above 50 scale down, below scale up), 3 or 6 Alienmon, no items in battle (or one each),
  legendaries banned in the standard ruleset.

**Trust**
- Teams are validated server-side: legal species, moves learnable at that level, Potential in range.
- A battle replay log (seed plus both action lists) is stored, so a disputed result can be replayed to check it.

**UI**
- "Link Battle" counter in every Recovery Bay: Create room / Join with code / Quick match / My record.
- Battle screen unchanged, plus "Waiting for opponent..." and a turn timer.

## Trading: built now, and what live trading would add later

Built: **send** (pick an Alienmon → its trade code; it leaves your team) and **receive** (paste a code → it joins your team
or Storage).
- Each code can be redeemed once per save.
- Codes are checksummed, so a typo or an edited code is caught.
- Traded Alienmon above your Shard level may disobey sometimes, the same rule as gifts.

Known limit with no server: someone could give the same code to two different friends and both would receive a copy.
With Phase 2 accounts this goes away: codes are registered in a `trades` table and the server marks each one used.
Live trading (both players online, side-by-side offer and accept) would reuse the PvP room and channel above.
