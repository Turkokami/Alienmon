# Alienmon — Progression & Leveling Logic

How Alienmon level up, gain stats, learn moves and evolve, and how fast the player moves through the story. It uses the classic Game Boy Advance era monster-collecting structure in Alienmon terms:
- a 100-level cap and growth curves
- base stats plus hidden individual and training values, applied on level-up
- a type-based physical/special split
- level evolution
- badge-style obedience
- scaled EXP

The game reads `progression.json`; this file explains it.

---

## 1. How it maps to the classic structure

| Classic mechanic | Alienmon version | In the game today |
| --- | --- | --- |
| Levels 1–100 | Same. Starters and gifts begin at **Lv 5** | ✔ |
| EXP from defeating opponents | Same, using the **scaled EXP formula** (section 3) | Simple formula; replace |
| EXP from catching | A successful Transfer Beam capture gives full defeat EXP | Not yet |
| Exp. Share | **EXP Link** on the Linker, on by default. The battler gets 100% and the rest of the party gets 50%. Can be turned off in Options for a classic GBA feel | Not yet |
| 6 growth curves | **Glitch, Swift, Standard, Steady, Ancient, Pulse** (section 2) | Only Standard |
| Base stats | Each species' `s` array: HP, Atk, Def, SpA, SpD, Spe | ✔ |
| IVs (0–31, hidden) | **Potential**, 0–31 per stat, shown as 1–5 ★ | Not yet |
| EVs (510 max) | **Training Points (TP)**, 500 max and 250 per stat. Gained silently from every defeat, added to stats **only on level-up** (section 4) | Not yet |
| Nature | **Temperament**, +10% / −10% to two stats | Not yet |
| Physical/special by **type** (GBA) | **Already how Alienmon works:** the move's type decides which stats are used (section 5) | ✔ |
| 4 moves, learn by level | Same. The player chooses which move to forget | Game auto-forgets the weakest move; change |
| Level evolution | Same; starters evolve at **16 / 36**. Plus **Resonance** evolutions (Shards or places) and future **Bond** evolutions | Level evolutions ✔ |
| Badge obedience | **Shard Sync Limit** (section 7) | Not yet |
| Less EXP when far over-leveled | Built into the scaled formula | Not yet |

---

## 2. Growth curves (EXP needed to reach level n)

| Curve | EXP to Lv 100 | Formula | Used by | Count |
| --- | --- | --- | --- | --- |
| **Glitch** (erratic) | 600,000 | n≤50: n³(100−n)/50 · 50–68: n³(150−n)/100 · 68–98: n³·⌊(1911−10n)/3⌋/500 · 98–100: n³(160−n)/100 | 2-stage Volt and Alloy lines | 56 |
| **Swift** (fast) | 800,000 | ⌊0.8n³⌋ | Swarm types, small weak lines | 18 |
| **Standard** (medium fast) | 1,000,000 | n³ | most Alienmon | 146 |
| **Steady** (medium slow) | 1,059,860 | ⌊1.2n³ − 15n² + 100n − 140⌋ | starters and 3-stage lines | 51 |
| **Ancient** (slow) | 1,250,000 | ⌊1.25n³⌋ | legendaries and the mythic | 6 |
| **Pulse** (fluctuating) | 1,640,000 | n≤15: n³(⌊(n+1)/3⌋+24)/50 · 15–36: n³(n+14)/50 · 36–100: n³(⌊n/2⌋+32)/50 | single-stage oddities | 23 |

Each species' curve is in `progression.json → species.<name>.curve`. Each Alienmon stores its total EXP. Its level is the highest n where `curve(n) ≤ xp`.

---

## 3. EXP formula (scaled)

```
exp = floor( (B × L / 5) × ((2L + 10) / (L + Lp + 10))^2.5 ) + 1
  × 1.5  opponent belongs to a trainer, Keeper or boss
  × 1.2  winner's Bond is high (future Bond system)
  × 0.5  party members who didn't battle (EXP Link)
```
- **B:** the defeated species' `base_yield`. That's roughly BST × 0.18 for first stages, × 0.32 middle, × 0.45 final, × 0.36 single-stage, × 0.62 legendary.
- **L:** the opponent's level. **Lp:** the level of the Alienmon receiving EXP.
- **Scaling:** far above the opponent, the bracket shrinks, so grinding weak Alienmon gives very little. Below the opponent, it grows, so underleveled teams catch up.
- **Classic mode** (Options, EXP Link off): only Alienmon that took part in the battle share EXP, split evenly, like the GBA games.

---

## 4. Stats, Potential, Training Points and Temperament

```
HP    = floor((2B + P + floor(T/4)) × L / 100) + L + 10
Other = floor((floor((2B + P + floor(T/4)) × L / 100) + 5) × temperament)
```
- **B:** base stat. **P:** Potential (0–31). **T:** Training Points in that stat (0–250, 500 max total). **Temperament:** 1.1, 1.0 or 0.9.

**Training Points: gained silently, shown at level-up (GBA style)**
- Every defeated Alienmon gives TP in **its own highest base stat**: 1 TP for first stages, 2 for middle and single-stage, 3 for final stages and bosses. Defeating a speedy Zapfin builds Speed; defeating a bulky Bouldron builds Defense.
- EXP Link members also receive the TP.
- Banked TP is applied **only when stats are recalculated at level-up**. Training against one kind of Alienmon produces big single-stat jumps such as +5 or +7, just like the GBA games.
- **Level-up screen:** after "Mycelith grew to Lv 17!", show a small stats panel with each stat and its gain ("Atk 41 +3"), highlighting gains of 4 or more.
- The summary screen shows TP progress per stat as a small bar.
- A later item, **Neural Reset**, clears a stat's TP.

**Potential**
- Rolled when an Alienmon is caught or gifted.
- Starters, gifts and legendaries guarantee at least 3 stats of 20 or higher.
- Star display: total ÷ 186 × 5, rounded (1–5 ★).

**Temperament**
- Bold (+Def −Atk), Brash (+Atk −Def), Calm (+SpD −Atk), Clever (+SpA −Atk), Hasty (+Spe −Def), Gentle (+SpD −Def), Fierce (+Atk −SpA), Sly (+Spe −SpA). Balanced and Dreamy are neutral.
- Show the boosted stat in red and the lowered stat in blue on the summary.

**Old saves:** P = 15 for every stat, T = 0, and a neutral temperament, so current teams keep their strength.

---

## 5. Physical vs Special: decided by TYPE (GBA style)

Alienmon already works like the GBA games. **The move's type** decides which stats are used, not the individual move.

| Category | Types | Uses |
| --- | --- | --- |
| **Physical** | None (Ram), Alloy, Swarm, Gravity, Magma, Void, Bio | Attack vs Defense |
| **Special** | Plasma, Hydro, Volt, Cryo, Toxin, Crystal, Psi, Sonic | Sp. Atk vs Sp. Def |

- This is the existing `PHYS` set in `src/template.html`. Keep it.
- **Team building matters:** a Toxin/Void Alienmon with huge Sp. Atk still hits with Attack when it uses a Void move. Players should read both the types and the stats.
- **Optional later:** a modern per-move split, where each move gets its own `cat` field, as a v2 "Remaster rules" toggle. Not needed for launch.

---

## 6. Moves and evolution

**Moves**
- Max 4 moves. When a 5th is learned, prompt "Forget a move to learn X?" with a "Don't learn" option.
- Learnset spacing: moves at Lv 1, 4, 7, 11, 15, 20, 25, 30, 36, 42, 48 and 55. Final forms get their signature move at evolution.
- **Move Archive** at Recovery Bays relearns any lower-level move for 100 stardust.

**Evolution** (from `species.<name>.evolves`)
- **Level:** evolves after a battle when its level is at or above the target. B cancels, like the classic games.
- **Resonance:** for example holding Signal Shard 4, holding all 8, the Halo tower roof, or inside the Rift. Checked on level-up.
- **Bond (future):** Bond at maximum plus a level-up.
- **Starters:** Lv 5, evolve at **16** and **36**, Steady curve.

---

## 7. Shard Sync Limit (obedience)

| Signal Shards | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Obey up to | Lv 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50 | all |

- **Who it applies to:** only gifted, traded or legendary Alienmon above the limit. They ignore commands 25% of the time ("Novaryx is listening to the stars…").
- **Alienmon you caught or raised yourself always obey**, like the classic games.
- **Optional Challenge mode:** Alienmon over the limit earn 0 EXP until the next Shard.

---

## 8. Pacing targets

Keeper aces sit 2–3 levels above their world's wild Alienmon, the classic Gym Leader pattern.

### Worlds
| World | Wild Lv | Trainer Lv | Trainer team | Tier 2 revisit (after 4 Shards, Lv 24–32) | Tier 3 revisit (after Champion, Lv 50–60) |
| --- | --- | --- | --- | --- | --- |
| Dustara | 2–6 | 3–8 | 1–2 | yes | yes |
| Ferrox | 5–10 | 6–12 | 1–2 | yes | yes |
| Sporeholm | 9–15 | 10–17 | 2–3 | yes | yes |
| Thalassa | 13–19 | 14–21 | 2–3 | yes | yes |
| Neonis | 17–23 | 18–25 | 2–3 | yes | yes |
| Glyphos | 20–26 | 21–28 | 2–3 | yes | yes |
| Pyros | 23–29 | 24–31 | 2–3 | yes | yes |
| Glacia | 27–33 | 28–35 | 2–3 | — | yes |
| Helix Station | 30–35 | 31–37 | 3–4 | — | yes |
| Halo | 33–39 | 34–41 | 3–4 | — | yes |
| Umbra | 37–43 | 38–45 | 3–4 | — | yes |
| Starfall Rift | 42–48 | 43–50 | 3–4 | — | yes |
| Apex Array | 46–52 | 47–54 | 3–4 | — | yes |
| Ystra | 55–65 | 56–67 | 3–4 | — | — |

**Running into advanced Alienmon later**
- **Tier 1:** each world spawns mostly first-stage Alienmon, with rare evolved ones only where levels allow.
- **Tier 2 (after 4 Shards):** early worlds upgrade their commons to evolved forms at Lv 24–32. For example, Dustmere's cactus gardens get Fizzlord, Skitterdrone and Bouldron.
- **Tier 3 (after Champion):** every world spawns Lv 50–60 final forms.
- **Rule:** an evolved form never appears below its evolution level minus 1.
- **Weights:** common 10, evolved 4, rare 1.
- Full per-species tables with level ranges and chances are in `progression.json → areas.<key>`.

### Keepers (Signal Shards)
| Keeper | Ace | Team size | Levels | Stardust |
| --- | --- | --- | --- | --- |
| Hank Briggs (ferrox) | Lv 12 | 2 | Lv 10, Lv 12 | 720 |
| Dr. Lysa Moor (sporeholm) | Lv 17 | 3 | Lv 15, Lv 15, Lv 17 | 1020 |
| Captain Marsh (thalassa) | Lv 21 | 3 | Lv 19, Lv 19, Lv 21 | 1260 |
| DJ Static (neonis) | Lv 25 | 4 | Lv 23, Lv 23, Lv 23, Lv 25 | 1500 |
| Old Basalt (pyros) | Lv 31 | 4 | Lv 29, Lv 29, Lv 29, Lv 31 | 1860 |
| Ingrid Vale (glacia) | Lv 35 | 4 | Lv 33, Lv 33, Lv 33, Lv 35 | 2100 |
| Echo and Iris (halo) | Lv 41 | 5 | Lv 39, Lv 39, Lv 39, Lv 39, Lv 41 | 2460 |
| Mortimer Kade (umbra) | Lv 45 | 5 | Lv 43, Lv 43, Lv 43, Lv 43, Lv 45 | 2700 |

### Story bosses (no Shard)
- Admin Bronn: Lv 34
- Admin Vex: Lv 36 (4 Alienmon)
- Director Thorne: Lv 52 (5)
- The Quorum: Marisol Lv 54, Duke Harrow 55, Saga 56, General Ostrander 57 (5 each)
- Orra Venn: Lv 60 (6)

The Summit asks for a little extra training, like the classic Elite Four.

### Rival Sola
| Battle | Her ace |
| --- | --- |
| R1 Dustmere | Lv 7 |
| R2 Sporeholm | Lv 15 |
| R3 Deep Sea Ferry dock | Lv 22 |
| R4 Helix Station | Lv 36 |
| R5 Apex Array | Lv 56 |
| R6 Postgame | Lv 70 |

She uses the starter strong against yours, evolved on the same schedule, and adds one Alienmon each time.

### Legendaries (3 Syncs in a row to capture)
- Novaryx: Lv 50
- Terravox, Aquelion, Ignarch: Lv 60
- Oblivane: Lv 70
- Seedmother: Lv 75

---

## 9. Pacing check (simulation)

A normal playthrough on each world: the listed wild battles and trainers, EXP Link on, using these formulas.

| World | Wild levels | Wild battles | Trainers | Your starter after | Keeper ace |
| --- | --- | --- | --- | --- | --- |
| dustara | 2-6 | 8 | 3 | Lv 10 | — |
| ferrox | 5-10 | 8 | 3 | Lv 13 | Lv 12 |
| sporeholm | 9-15 | 10 | 4 | Lv 17 | Lv 17 |
| thalassa | 13-19 | 10 | 4 | Lv 20 | Lv 21 |
| neonis | 17-23 | 10 | 4 | Lv 26 | Lv 25 |
| glyphos | 20-26 | 10 | 4 | Lv 30 | — |
| pyros | 23-29 | 10 | 4 | Lv 33 | Lv 31 |
| glacia | 27-33 | 10 | 4 | Lv 36 | Lv 35 |
| helix | 30-35 | 12 | 4 | Lv 39 | — |
| halo | 33-39 | 12 | 4 | Lv 42 | Lv 41 |
| umbra | 37-43 | 12 | 4 | Lv 46 | Lv 45 |
| starfall | 42-48 | 12 | 4 | Lv 51 | — |
| apex | 46-52 | 12 | 4 | Lv 54 | — |

Total battles to the Summit: about 236.

- The starter stays within about ±2 levels of every Keeper ace.
- The Summit asks for about Lv 57–60: steady progress with no forced grinding until the finale.
- With EXP Link off (Classic mode), expect roughly 30–40% more battles, like the GBA games.

---

## 10. Economy and shop

- **Trainer payout:** 20 × their highest level. **Keeper payout:** 60 × ace level.
- **Wild battles:** 2–6 stardust, plus small drops (Med Gel 5%, Stasis Pod 3%).
- **Losing a battle:** drop 25% of your stardust.

| Shards | New shop items |
| --- | --- |
| 0 | Stasis Pod 50 · Med Gel 15 · Cure Spray 20 |
| 1 | Tether Pulse 30 · Stun Spray 30 |
| 2 | Harmonic Pod 150 · Mega Gel 45 |
| 3 | Revive Spark 80 |
| 5 | Full Gel (heals team) 120 |
| 6 | Singularity Pod 400 (3 per visit) |
| 8 | Max Revive 300 |

## 11. Capture tuning

`capture_mod` multiplies the Sync lock window:
- first stage: 1.0
- middle stage: 0.7
- final stage: 0.45
- legendary: 0.2, and 3 Syncs required

It stacks with the existing HP, status, Beam Cell, Friendly Signal and Zib modifiers.
