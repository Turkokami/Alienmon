# Alienmon — Core Game Rules Reference

The basic rules every system follows. It marks what already works in the game (✔) and what still needs building (☐).

---

## Battle
- ✔ **Turn order:**
  1. Higher **priority** goes first. Priority moves are a small set ("Quick Strike" tier): add a `pri` field to moves.
  2. Then higher **Speed**, using stat stages.
  3. Speed ties are random.
- ✔ **Damage (classic formula):** `((2L/5 + 2) × Power × A/D / 50 + 2) × STAB × type × crit × random(0.85–1.0) × other modifiers`
  - **STAB:** 1.5 (1.8 with a STAB trait).
  - **Critical hits:** about 6% base (tripled by high-crit moves or traits). Crits ignore the defender's positive defense stages and the attacker's negative attack stages.
- ✔ **Physical vs Special by type (GBA style):**
  - **Physical:** None, Alloy, Swarm, Gravity, Magma, Void, Bio
  - **Special:** Plasma, Hydro, Volt, Cryo, Toxin, Crystal, Psi, Sonic
- ✔ **Accuracy:** move accuracy × accuracy/evasion stage modifiers.
- ✔ **Stat stages:** −6 to +6. They reset on switching out and at the end of battle.
- ✔ **Status effects** (one at a time; they last after battle until cured):

  | Status | Effect |
  | --- | --- |
  | Burn | 1/16 HP per turn, physical attack halved |
  | Poison | 1/8 HP per turn |
  | Shock | 25% chance to lose the turn, Speed halved |
  | Freeze | can't act, 20% thaw chance per turn; Plasma moves thaw instantly |
  | Confusion | battle only, 2–5 turns, 33% chance to hit itself |

- ☐ **PP (move uses):** add PP to every move (5–35 by power). Restored at Recovery Bays and by "Ether Gel" items. When every move is out of PP, the Alienmon uses **Struggle**.
- ✔ **Switching** costs your turn. A forced switch after a faint is free.
- ☐ **Running away:** classic odds `escape if (yourSpeed × 128 / foeSpeed + 30 × attempts) mod 256 > random(0–255)`. Running always works if your Speed is higher, and **never from trainers, Keepers, bosses or legendaries**.
- ✔ **Captures** happen only in wild battles. Capturing ends the battle, gives EXP (progression pack), and sends the Alienmon to the party, or to storage if the party already has 6.
- ✔ **Fainting:** the next Alienmon is chosen. If the party is wiped out, the ship can beam in a storage backup. If that's declined or impossible, you lose.
- ☐ **Losing a battle:** drop 25% of your stardust and **return to the last Recovery Bay or Hut used**, fully healed.

## Type chart (from the game data)
✔ ×2 for strong matchups. ×½ against types that counter the attack and against the same type. The None type is always neutral. There are no immunities, which keeps it simple.

| Attacking type | Strong against (×2) | Weak against (×½) |
| --- | --- | --- |
| Plasma | Bio, Swarm | Crystal, Hydro, Plasma |
| Hydro | Plasma, Magma | Bio, Hydro, Volt |
| Bio | Hydro | Bio, Cryo, Plasma, Toxin |
| Volt | Hydro, Alloy | Crystal, Gravity, Volt |
| Cryo | Bio, Gravity | Cryo, Magma |
| Magma | Cryo, Alloy | Hydro, Magma |
| Toxin | Bio, Sonic | Psi, Toxin |
| Swarm | Psi | Gravity, Plasma, Swarm |
| Alloy | Crystal | Alloy, Magma, Volt |
| Crystal | Volt, Plasma | Alloy, Crystal, Sonic |
| Psi | Toxin | Psi, Swarm, Void |
| Sonic | Crystal, Void | Sonic, Toxin |
| Gravity | Swarm, Volt | Cryo, Gravity, Void |
| Void | Psi, Gravity | Sonic, Void |


Dual types multiply: ×4, ×2, ×1, ×½, ×¼. Traits can change matchups: Absorb, Float (immune to Gravity), Thick (halves Plasma and Cryo damage).

## Party, storage and Xenodex
- ✔ **Party:** up to 6. The lead goes out first. ✔ **Storage:** unlimited, managed from the START menu.
- ☐ **Nicknames:** offered on capture, changeable at the Recovery Bay.
- ✔ **Xenodex:** an entry becomes "seen" when encountered and "caught" when captured. ☐ Add filters by world and type, and show where each Alienmon lives (from the encounter tables) once caught.

## Items
- ✔ **Healing:** Med Gel, Mega Gel, Revive Spark, Cure Spray. ✔ **Capture tools:** Tether Pulse, Stun Spray. ✔ **Pods:** Stasis, Harmonic, Singularity.
- ☐ **New items:**
  - Ether Gel (restores PP)
  - Full Gel (heals the whole team)
  - Max Revive
  - Signal Jammer (repel)
  - Neural Reset (clears TP)
  - held items, later
- ☐ **Key items** (Helix Keycard, Ystra Shardlet, Seedmother Seed, Linker modules): their own Bag tab; they can't be sold or discarded.
- **Item rules:** using an item in battle takes your turn. Revives can't be used on a healthy Alienmon. Nothing can be used during a trainer's Alienmon's turn.

## Field abilities: Linker Modules (the classic "HM" gating, optional)
These open optional areas and shortcuts. The **main story never requires them** beyond what quests already give.

| Module | Earned | Opens |
| --- | --- | --- |
| Grapple Line | after Shard 2 (Marsh) | cliff shortcuts and ledges |
| Hydro-skiff | after Shard 4 (Static) | deep water: islands and sea encounters |
| Heat Shield | after Shard 5 (Basalt) | lava-crossing shortcuts on Pyros and the Frontier |
| Lumen Beacon | after Shard 6 (Ingrid) | lights dark caves and ice caverns |
| Gravity Lift | after Shard 7 (the Twins) | floating platforms on Halo and Umbra |

## Saving and options
- ✔ **Saving:** localStorage save from the menu. ☐ Autosave after main quest steps and Shards, ☐ 3 save slots, ✔ export/import (Vercel plan).
- ☐ **Options:**
  - text speed
  - music and sound volume
  - EXP Link and Classic mode
  - battle animations on/off
  - Free roam (playtest)
  - controls help

## Onboarding (first 10 minutes)
1. Choose your character (gender).
2. Choose a starter (M01).
3. Zib joins (M02).
4. The first battle is the rival (M03). Sola explains HP and type advantage.
5. On the way to the tunnel, the Explorer's field test (S04) teaches capture: Tether Pulse, then Stun Spray, then the Transfer Beam.
6. The Frontier introduces the world map, Recovery Huts and trainers.
7. First Keeper.

Short one-line tip pop-ups appear the first time each system shows up (the Bag, storage, the map, the ship). They never block play.
