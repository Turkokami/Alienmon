# Alienmon — Main Story Quests (in play order)

The 25 main quests, from picking your starter to the Warp Gate teaser. Each one unlocks the next (see **Requires**). The machine-readable version is `quests.json`.

**Signal Shards** come only from the 8 Relay Keepers: Hank (Ferrox), Moor (Sporeholm), Marsh (Thalassa), Static (Neonis), Basalt (Pyros), Ingrid (Glacia), Echo & Iris (Halo) and Kade (Umbra). Admin Vex, Director Thorne, the Quorum and Orra Venn are story bosses with no Shard.


## Act 1

### M01 · A Partner From the Stars
- **Act / area:** Act 1
- **Where it starts:** Dustmere — Dr. Vashti's lab (Crater Observatory) / opening (x 300, y 348)
- **Given by:** Dr. Imogen Vashti (art `vashti`)
- **Requires:** nothing
- **Objectives:**
  1. choose starter: **Sporix|Plazmo|Gloopa** @ Dustmere — Observatory lab (x 300, y 348)
- **Start:** “Dr. Vashti: Twenty years ago the Starfall brought them here. Today, one of them chooses you. / Pick your partner: Sporix, Plazmo or Gloopa.”
- **Complete:** “Dr. Vashti: A perfect match! Your Linker is synced. Take these Stasis Pods, and be kind to your partner.”
- **Rewards:** stasis ×10; gel ×5; flags: has_starter
- **Build notes:** Already implemented (starter scene). Mark complete on starter pick.

### M02 · Zib's Signal
- **Act / area:** Act 1
- **Where it starts:** Dustmere — Steel bridge over the lava falls (x 620, y 398)
- **Given by:** Scout unit DX-4 (art `technician`)
- **Requires:** M01
- **Objectives:**
  1. talk: **DX-4 robot** @ Dustmere — DX-4 robot by the dome homes (x 400, y 342)
  2. visit: **bridge_center** @ Dustmere — Middle of the big bridge (x 850, y 396)
  3. cutscene: **zib_joins** @ Dustmere — Bridge (x 850, y 396)
- **Start:** “DX-4: Bzzt! Unknown signal on the canyon bridge. Frequency... friendly?”
- **Complete:** “A tiny saucer flickers out of the canyon haze and circles your head. It's an Alienmon called Zib, and it decided you're its new captain!”
- **Rewards:** Alienmon gift: Zib; flags: zib_joined
- **Build notes:** Zib is the Seedmother's scout. Give as a gift (add to party or storage). Zib follows the story.

### M03 · First Rival
- **Act / area:** Act 1
- **Where it starts:** Dustmere — Trading post yard (x 1180, y 720)
- **Given by:** Sola Reyes (art `sola`)
- **Requires:** M02
- **Objectives:**
  1. battle rival: **sola_1** @ Dustmere — Trading post (x 1180, y 720)
- **Start:** “Sola: Took the slow starter, huh? Let's see who's the better Linker.”
- **Complete:** “Sola: Not bad... for a beginner. My dad would've liked you. I'm heading out to find him. Don't fall behind!”
- **Rewards:** 150 stardust; flags: rival_1
- **Build notes:** Sola uses the starter strong against yours (Sporix→Plazmo, Plazmo→Gloopa, Gloopa→Sporix).

### M04 · Into the Molten Frontier
- **Act / area:** Act 1
- **Where it starts:** Molten Frontier — Tunnel to Sunset Canyon (x 687, y 300)
- **Given by:** Dusty the wanderer (art `wanderer`)
- **Requires:** M03
- **Objectives:**
  1. visit: **molten_frontier** @ Molten Frontier — Tunnel to Sunset Canyon (x 687, y 300)
  2. visit: **node:bay** @ Molten Frontier — Palm Isle Recovery Hut (x 325, y 614)
  3. talk: **mf2** @ Molten Frontier — Guard (x 558, y 138)
- **Start:** “Dusty: The tunnel at the bottom of town runs clear under the sea to the Molten Frontier. Every Linker's road starts there.”
- **Complete:** “Guard: So you're the new Linker. Helix runs a forge fortress up the ridge. Stay sharp out here.”
- **Rewards:** gel ×3; flags: frontier_open
- **Build notes:** Teaches world map travel, the Recovery Hut, and talking to NPCs.

### M05 · Sparks on Ferrox
- **Act / area:** Act 1
- **Where it starts:** Molten Frontier — Forge Gate (x 873, y 790)
- **Given by:** Hank Briggs (art `hank`)
- **Requires:** M04
- **Objectives:**
  1. battle trainer: **mf12** @ Molten Frontier — Forge Miner Dax (x 894, y 714)
  2. visit: **planet:ferrox** @ Molten Frontier — Forge Gate (x 873, y 790)
  3. spot event: **helix_scouts_ferrox** @ Ferrox Town — Scrapyard crane yard
  4. defeat keeper: **ferrox** @ Ferrox Town — Relay Tower
- **Start:** “Forge Miner Dax: Hank's tower is past this gate. Beat me and I'll let you through.”
- **Complete:** “Hank Briggs: You've got grit, kid. Here's your first Signal Shard. And watch those Helix suits poking around my yard.”
- **Rewards:** Signal Shard #1; 400 stardust; flags: shard_ferrox, helix_seen
- **Build notes:** First Signal Shard. Helix scouts are seen but flee.

### M06 · The Glowing Swamp
- **Act / area:** Act 1
- **Where it starts:** Sporeholm Town — Mirefen village
- **Given by:** Dr. Lysa Moor (art `moor`)
- **Requires:** M05
- **Objectives:**
  1. visit: **planet:sporeholm** @ Molten Frontier — Fortress Launch Pad (x 1093, y 300) (Fly from the Fortress Launch Pad)
  2. battle trainer: **helix_spore_grunt** ×2 @ Sporeholm Town — Spore pools
  3. defeat keeper: **sporeholm** @ Sporeholm Town — Relay Tower
- **Start:** “Dr. Moor: Helix is siphoning my spore pools! Run them off, then show me what you've learned.”
- **Complete:** “Dr. Moor: The swamp is breathing easy again. Take the Shard, and this sample. Something in it glows like the Starfall.”
- **Rewards:** Signal Shard #2; cure ×3; flags: shard_sporeholm


## Act 2

### M07 · Harbor Under Siege
- **Act / area:** Act 2
- **Where it starts:** Molten Frontier — Port Ember (x 300, y 150)
- **Given by:** Captain Delia Marsh (art `marsh`)
- **Requires:** M06
- **Objectives:**
  1. visit: **node:thalassa** @ Molten Frontier — Port Ember (x 300, y 150)
  2. battle trainer: **helix_dock_grunt** ×2 @ Thalassa Town — Port Saltreach docks
  3. defeat keeper: **thalassa** @ Thalassa Town — Harbor Relay Tower
- **Start:** “Captain Marsh: Helix stormed my tower and ripped out its core! Help me clear the docks first.”
- **Complete:** “Captain Marsh: They got away with the core, but you fought like a storm. This Shard is yours.”
- **Rewards:** Signal Shard #3; 800 stardust; flags: shard_thalassa, core_stolen
- **Build notes:** Port Ember (Molten Frontier) is the gateway to Thalassa.

### M08 · Sola's Choice
- **Act / area:** Act 2
- **Where it starts:** Molten Frontier — Deep Sea Ferry (x 300, y 318)
- **Given by:** Sola Reyes (art `sola`)
- **Requires:** M07
- **Objectives:**
  1. cutscene: **sola_leaves** @ Molten Frontier — Deep Sea Ferry (x 300, y 318)
- **Start:** “Sola: Helix says they know where my dad is. They found the crater signal he was chasing.”
- **Complete:** “Sola steps onto a Helix shuttle. "Don't follow me." The doors hiss shut.”
- **Rewards:** flags: sola_with_helix
- **Build notes:** Story beat at the Deep Sea Ferry dock.

### M09 · Static on the Line
- **Act / area:** Act 2
- **Where it starts:** Neonis Starport — Dr. Vashti on the deck (x 307, y 518)
- **Given by:** Dr. Imogen Vashti (art `vashti`)
- **Requires:** M08
- **Objectives:**
  1. talk: **vashti** @ Neonis Starport — Dr. Vashti (x 307, y 518)
  2. defeat keeper: **neonis** @ Neonis Starport — Keeper door at top of stairs (x 196, y 340)
- **Start:** “Dr. Vashti: Every Relay Tower is broadcasting the same pulse... a signal from the Starfall crater. Win Neonis's Shard so we can tune in.”
- **Complete:** “DJ Static: That was a banger! Take the Shard. And hey, that signal? It's coming from the other side of something.”
- **Rewards:** Signal Shard #4; harmonic ×3; flags: shard_neonis, rift_signal

### M10 · Murals of Ystra
- **Act / area:** Act 2
- **Where it starts:** Glyphos Town — Sunken temple ruins
- **Given by:** Ystran echo (art `ystran`)
- **Requires:** M09
- **Objectives:**
  1. visit: **node:glyphos** @ Molten Frontier — Deep Sea Ferry (x 300, y 318) (Deep Sea Ferry)
  2. examine: **mural** ×3 @ Glyphos Town — Mural hall: Ystra, the Devourer, the Seedmother
- **Start:** “Carved walls glow as you approach. Three murals tell a story older than the Starfall.”
- **Complete:** “The murals show it plainly: a dying world called Ystra, a void that ate the stars, and a great tree-mother sending her children away in seedpods. The Alienmon are refugees.”
- **Rewards:** 600 stardust; flags: murals_read
- **Build notes:** No Keeper on Glyphos.


## Act 3

### M11 · The Light in the Crater
- **Act / area:** Act 3
- **Where it starts:** Molten Frontier — Magma Mines (x 1347, y 118)
- **Given by:** Old Basalt (art `basalt`)
- **Requires:** M10
- **Objectives:**
  1. visit: **node:pyros** @ Molten Frontier — Magma Mines (x 1347, y 118) (Magma Mines cave)
  2. talk: **old_basalt** @ Pyros Town — Cinder Hollow lift
  3. defeat keeper: **pyros** @ Pyros Town — Volcano Relay Tower
- **Start:** “Old Basalt: Teo Reyes? Sure, I knew him. Last I saw, he walked into the crater's light and didn't come back.”
- **Complete:** “Old Basalt: Tell Sola her pa was the bravest fool I ever met. Here, your fifth Shard.”
- **Rewards:** Signal Shard #5; flags: shard_pyros, teo_clue

### M12 · Teeth in the Ice
- **Act / area:** Act 3
- **Where it starts:** Glacia Town — Frostmark dig site
- **Given by:** Ingrid Vale (art `ingrid`)
- **Requires:** M11
- **Objectives:**
  1. examine: **fossil_bite** ×3 @ Glacia Town — Three frozen fossil sites in the crystal caverns
  2. defeat keeper: **glacia** @ Glacia Town — Aurora Relay Tower
- **Start:** “Ingrid Vale: The ice holds something you need to see. Fossils... with bite marks the size of moons.”
- **Complete:** “Ingrid Vale: The Devourer isn't a legend. Take the sixth Shard. We'll need every tower standing.”
- **Rewards:** Signal Shard #6; flags: shard_glacia, devourer_real

### M13 · Infiltrate the Forge
- **Act / area:** Act 3
- **Where it starts:** Molten Frontier — Helix Forge Fortress (x 1090, y 252)
- **Given by:** Grub (art `grub`)
- **Requires:** M12
- **Objectives:**
  1. battle trainer: **mf7** @ Molten Frontier — Helix Grunt (x 1038, y 318)
  2. examine: **forge_terminal** @ Molten Frontier — Helix Forge Fortress (x 1090, y 252)
  3. item: **helix_keycard** @ Molten Frontier — Helix Forge Fortress (x 1090, y 252)
- **Start:** “Grub: Psst. I used to work for Helix. Their Forge Fortress has a shuttle keycard in the control room. Get it and you can reach Helix Station.”
- **Complete:** “You swipe a Helix Keycard from the control terminal. The fortress shuttle pad lights up.”
- **Rewards:** helix_keycard ×1; flags: keycard
- **Build notes:** Grub is the junk trader and a secret ex-Helix engineer.

### M14 · Helix Station
- **Act / area:** Act 3
- **Where it starts:** Helix Town — Station decks
- **Given by:** Admin Bronn (art `vex`)
- **Requires:** M13
- **Objectives:**
  1. visit: **planet:helix** @ Molten Frontier — Helix Forge Fortress (x 1090, y 252)
  2. battle trainer: **admin_bronn** @ Helix Town — Engineering bay
  3. defeat boss: **admin_vex** @ Helix Town — Vex's containment arena
- **Start:** “Admin Bronn: Thorne's lost his mind. That Rift will swallow us all. Beat me and I'll open the way to Vex.”
- **Complete:** “Admin Vex: Ugh! Fine. The Director already has what he needs. You're too late.”
- **Rewards:** singularity ×1; flags: vex_defeated
- **Build notes:** Vex is a boss, not a Relay Keeper: no Signal Shard. Bronn leaks Thorne's plan.

### M15 · Sola Turns
- **Act / area:** Act 3
- **Where it starts:** Helix Town — Observation deck
- **Given by:** Sola Reyes (art `sola`)
- **Requires:** M14
- **Objectives:**
  1. cutscene: **sola_joins** @ Helix Town — Observation deck
- **Start:** “Sola: They lied to me. Thorne never wanted to find my dad. He wants to OPEN the thing that took him.”
- **Complete:** “Sola: I'm with you now. Let's finish this, together.”
- **Rewards:** harmonic ×5; flags: sola_ally


## Act 4

### M16 · Twin Visions
- **Act / area:** Act 4
- **Where it starts:** Skyreach Plaza — Grand stairs, tower door (x 772, y 296)
- **Given by:** Echo & Iris (art `twins`)
- **Requires:** M15
- **Objectives:**
  1. examine: **holo_globe** @ Skyreach Plaza — Holo-globe fountain (x 770, y 655)
  2. defeat keeper: **halo** @ Skyreach Plaza — Top of the grand stairs (x 772, y 296)
- **Start:** “Echo & Iris: We already saw you climb these stairs. We also saw the sky tear open.”
- **Complete:** “Echo & Iris: The vision is clear now. The Rift opens at the Starfall crater. Take the seventh Shard.”
- **Rewards:** Signal Shard #7; flags: shard_halo, vision

### M17 · Voices in the Dark
- **Act / area:** Act 4
- **Where it starts:** Molten Frontier — Shadow Tunnel (x 840, y 526)
- **Given by:** Mortimer Kade (art `kade`)
- **Requires:** M16
- **Objectives:**
  1. visit: **node:umbra** @ Molten Frontier — Shadow Tunnel (x 840, y 526) (Shadow Tunnel)
  2. defeat keeper: **umbra** @ Umbra Town — Gravewell Relay Tower
- **Start:** “Mortimer Kade: I built the Rift engine for Thorne. I scratched the logo off my coat the day I understood what it would wake.”
- **Complete:** “Mortimer Kade: Eight Shards. The towers will sing. Go to the crater before Thorne does.”
- **Rewards:** Signal Shard #8; flags: shard_umbra

### M18 · Eight Shards Sing
- **Act / area:** Act 4
- **Where it starts:** Molten Frontier — Helix Shuttle Pad (x 1436, y 704)
- **Given by:** Strand (defector) (art `strand`)
- **Requires:** M17
- **Objectives:**
  1. visit: **node:starfall** @ Molten Frontier — Helix Shuttle Pad (x 1436, y 704) (Helix Shuttle Pad)
  2. cutscene: **novaryx_awakens** @ Starfall Town — Crater rim
  3. legendary encounter: **Novaryx** @ Starfall Town — Crater rim
- **Start:** “Strand: That shuttle goes straight to the crater. Take it. I'm done with Helix.”
- **Complete:** “Your eight Shards rise and resonate. A great signal-winged bird answers the call: Novaryx!”
- **Rewards:** flags: novaryx_met
- **Build notes:** Legendary capture needs 3 successful Syncs in a row (Overcharge).

### M19 · Seal the Rift
- **Act / area:** Act 4
- **Where it starts:** Starfall Town — Rift vortex
- **Given by:** Director Kael Thorne (art `thorne`)
- **Requires:** M18
- **Objectives:**
  1. defeat boss: **director_thorne** @ Starfall Town — Rift vortex
  2. cutscene: **rift_sealed** @ Starfall Town — Rift vortex
- **Start:** “Director Thorne: The Rift is power, child. Power the universe wasted on refugees.”
- **Complete:** “The Shards blaze and the Rift folds shut. From the fading light stumbles Teo Reyes, a crystal Alienmon at his side. Sola runs to him.”
- **Rewards:** 3000 stardust; flags: rift
- **Build notes:** Sets flag 'rift', which unlocks Apex Array.


## Act 5

### M20 · The Summit
- **Act / area:** Act 5
- **Where it starts:** Apex Town — Celestial Observatory summit
- **Given by:** Orra Venn (art `orra`)
- **Requires:** M19
- **Objectives:**
  1. defeat boss: **quorum_marisol** @ Apex Town — Crystal hall
  2. defeat boss: **quorum_harrow** @ Apex Town — Sonic hall
  3. defeat boss: **quorum_saga** @ Apex Town — Plasma hall
  4. defeat boss: **quorum_ostrander** @ Apex Town — Gravity hall
- **Start:** “Orra Venn: The Quorum waits in four halls. Beat them all, then come find me under the great telescope.”
- **Complete:** “General Ostrander: Go on, then. The Prime Linker is waiting.”
- **Rewards:** flags: quorum
- **Build notes:** Quorum: Marisol Fenn (Crystal), Duke Harrow (Sonic), Saga (Plasma), General Ostrander (Gravity).

### M21 · Prime Linker
- **Act / area:** Act 5
- **Where it starts:** Apex Town — Great telescope
- **Given by:** Orra Venn (art `orra`)
- **Requires:** M20
- **Objectives:**
  1. defeat boss: **orra_venn** @ Apex Town — Great telescope
- **Start:** “Orra Venn: My first Linker still works. Let's see if yours can outshine it.”
- **Complete:** “Orra Venn: The Kessler system has a new Prime Linker. Roll the credits, then look up. Ystra is waiting.”
- **Rewards:** 10000 stardust; flags: champ
- **Build notes:** Credits roll. Sets flag 'champ', which unlocks Ystra.


## Postgame

### P01 · Through the Vortex
- **Act / area:** Postgame
- **Where it starts:** World — The Rift Vortex
- **Given by:** Zib (art `technician`)
- **Requires:** M21
- **Objectives:**
  1. visit: **planet:ystra** @ Space — Ystra
- **Start:** “Zib's lights blink in a rhythm you've never seen. It's pointing home.”
- **Complete:** “You step onto shattered Ystra. Floating continents, crystal forests, a dying red sun.”
- **Rewards:** flags: ystra_visited

### P02 · The Devourer
- **Act / area:** Postgame
- **Where it starts:** Ystra Town — Edge of the void
- **Given by:** Seedmother's voice (art `ystran`)
- **Requires:** P01
- **Objectives:**
  1. legendary encounter: **Oblivane** @ Ystra Town — Edge of the void
- **Start:** “A shadow the size of a planet turns its countless eyes toward you.”
- **Complete:** “Oblivane is calm at last. Some say it was never evil. It was only hungry and alone.”
- **Rewards:** flags: oblivane

### P03 · The Seedmother
- **Act / area:** Postgame
- **Where it starts:** Ystra Town — Crystal grove heart
- **Given by:** Seedmother (art `ystran`)
- **Requires:** P02
- **Objectives:**
  1. talk: **seedmother** @ Ystra Town — Crystal grove
  2. choice: **alienmon_future** @ Ystra Town — Crystal grove
- **Start:** “Seedmother: My children found friends among the stars. Tell me, Linker: where do they belong now?”
- **Complete:** “Seedmother: Then it is decided. Take this seed. A gate at the edge of your sky is waking.”
- **Rewards:** seedmother_seed ×1; flags: seedmother
- **Build notes:** The choice changes ending dialogue only. Both paths unlock the Warp Gate teaser.

### P04 · The Warp Gate Hums
- **Act / area:** Postgame
- **Where it starts:** Space — Warp Gate (far edge)
- **Given by:** Dr. Imogen Vashti (art `vashti`)
- **Requires:** P03
- **Objectives:**
  1. visit: **warp_gate** @ Space — Warp Gate
- **Start:** “Dr. Vashti: The Warp Gate just lit up on every scope in the system!”
- **Complete:** “The gate's runes glow cyan and pink... then dim. Not yet. (Batch 2 coming soon.)”
- **Rewards:** flags: warp_teaser
- **Build notes:** Hook for Batch 2. When a batch02 folder exists, this opens the next system.
