> **Applied to the game on 2026-10-13.** The pack's `data/planets.json` was not used: it was built from an older copy of the game (its species numbers are shifted, and it would undo keeper and Ystra edits). Instead the moves were applied by name: 8 of the 9 were already on the right world; Drizzlit and Thunderhead moved from Glacia to Thalassa, and Zib left Sporeholm's pool. Section encounters now come from `data/encounters.json`, checked by `tools/check_habitats.js` on every build.

> **Thin areas filled (2026-10-13):** `tools/fill_encounters.py` gave every area at least 5 distinct wild Alienmon (as they appear at that level, not counting story-gated ones). Fills are marked `"fill": true` in `data/encounters.json`, always suit the habitat (the habitat's signature types first, e.g. Ashpup, Charsprout and Kindlefly on the Ash Trail; Eclipsit and Eclipsor at the Edge of the Void), and come from the area's own world where possible. Sun Forge stays empty by design. The tables below show the pack as delivered, before the fills.

# Alienmon Habitat Logic Pack

This pack decides **which Alienmon live on which world, and exactly where**, so the game never puts a water creature on a fire planet. Every placement follows one set of habitat rules, and a validator checks them automatically.

## What's in the pack

| File | What it is |
| --- | --- |
| `HABITAT_LOGIC.md` | This guide: the rules, every world's habitats, and what changed |
| `alienmon_habitats.csv` | All 300 Alienmon: home world, how to get it, rarity and exact map sections |
| `data/habitat_rules.json` | The 32 habitats, which types are native, tolerated or banned in each, and which map section uses which habitat |
| `data/encounters.json` | The wild encounter table for all 75 encounter sections: species, rarity, weight, levels, method and time of day |
| `data/planets.json` | Your planets file with the 9 misplaced Alienmon moved to worlds they can live on. Drop-in replacement |
| `data/habitat_moves.json` | The 9 moves, with the reason for each |
| `tools/habitat_rules.py` | The rules as code |
| `tools/validate_habitats.py` | Fails the build if anything is placed in a habitat it can't live in, or if any water or ice type appears on Pyros |

## The rules

Every map section with wild Alienmon has one **habitat** (Coral Route is `coast`, Deep Mines is `mine_hot`). Each habitat lists which types are **native** (belong there), **tolerated** (can survive there) or **banned**.

1. **Strong fit:** none of the Alienmon's types is banned, and at least one is native. It can be common.
2. **Weak fit:** none is banned, but none is native either. It only appears as uncommon or rare.
3. **No fit:** any type is banned. It never appears there.
4. **Hard bans** override everything:
   - **Hydro** never appears in fire, desert, city, lab or crater habitats. Pyros has zero water types.
   - **Cryo** never appears anywhere warm: fire, desert, sea, swamp or crater.
   - **Magma** never appears in ice, sea (except undersea vents), swamp or sky.
   - **Plasma** never appears in ice caves, snowfields, sea or swamp (the aurora is the one exception).
5. **Fire plants:** Bio types can live in fire habitats only if they're also Magma or Plasma, like Charsprout.
6. **Families:** a base form lives on its home world. Its evolved forms may also appear wild on a later world, but only where they fit.

### Special habitats that make the logic believable

| Habitat | Where | Why it exists |
| --- | --- | --- |
| `thermal_vent` | Thalassa, Sea Arch Cove | Undersea volcanic vents: the only place Hydro/Magma creatures like Ventlet and Thermoctus can live |
| `aurora` | Glacia, Aurora Route | The aurora is sky plasma, so Cryo/Plasma creatures like Frostflare and Cryoblaze live here |
| `ash_trail` | Dustara, Molten Frontier Ash Trail | Ash fields where fire-adapted plants grow |
| `containment` | Helix Station | No natural wildlife; only escaped Helix specimens (Alloy, Toxin, Volt and a few others) |

## Where each type lives

| Type | Native habitats | Never found in |
| --- | --- | --- |
| **Plasma** | volcanic, volcano, seedpod_field, crater, sun_forge, ash_trail | rock_cave, tropical_shore, scrapyard, swamp, fungal, coast, ruins, tundra, ice_cave, frozen_falls, containment, sky, sky_garden, dark_city, abyss, floating_land, drowned_sea, blighted_forest, thermal_vent |
| **Hydro** | tropical_shore, swamp, coast, frozen_falls, drowned_sea | canyon, rock_cave, volcanic, scrapyard, fungal, neon_city, mine_hot, volcano, containment, dark_city, abyss, seedpod_field, crater, summit, floating_land, sun_forge, crystal_ruins, blighted_forest, void_edge, ash_trail |
| **Bio** | canyon, tropical_shore, swamp, fungal, sky_garden, seedpod_field, floating_land, blighted_forest | rock_cave, volcanic, scrapyard, neon_city, mine_hot, volcano, ice_cave, frozen_falls, containment, sky, abyss, crater, summit, sun_forge, crystal_ruins, void_edge, aurora, thermal_vent, ash_trail |
| **Volt** | canyon, scrapyard, neon_city, containment | rock_cave, swamp, fungal, ruins, mine_hot, volcano, tundra, ice_cave, frozen_falls, sky_garden, dark_city, abyss, crater, floating_land, drowned_sea, sun_forge, crystal_ruins, blighted_forest, void_edge, aurora, ash_trail |
| **Cryo** | tundra, ice_cave, frozen_falls, aurora | canyon, rock_cave, volcanic, tropical_shore, scrapyard, swamp, fungal, coast, neon_city, ruins, mine_hot, volcano, sky, sky_garden, dark_city, abyss, seedpod_field, crater, floating_land, drowned_sea, sun_forge, crystal_ruins, blighted_forest, void_edge, thermal_vent, ash_trail |
| **Magma** | volcanic, mine_hot, volcano, sun_forge, thermal_vent, ash_trail | canyon, tropical_shore, swamp, fungal, coast, neon_city, ruins, tundra, ice_cave, frozen_falls, containment, sky, sky_garden, dark_city, abyss, seedpod_field, summit, floating_land, drowned_sea, crystal_ruins, blighted_forest, void_edge, aurora |
| **Toxin** | swamp, fungal, containment | canyon, tundra, ice_cave, frozen_falls, sky, sky_garden, seedpod_field, crater, summit, floating_land, drowned_sea, sun_forge, crystal_ruins, void_edge, aurora |
| **Swarm** | canyon, swamp | ruins, tundra, frozen_falls, summit, floating_land, drowned_sea, sun_forge, crystal_ruins, blighted_forest, void_edge, thermal_vent |
| **Alloy** | scrapyard, neon_city, mine_hot, containment | tropical_shore, swamp, fungal, ruins, tundra, ice_cave, frozen_falls, sky, sky_garden, abyss, seedpod_field, crater, floating_land, drowned_sea, sun_forge, crystal_ruins, blighted_forest, void_edge, aurora, thermal_vent, ash_trail |
| **Crystal** | rock_cave, ruins, mine_hot, tundra, ice_cave, abyss, crater, summit, crystal_ruins | scrapyard, swamp, fungal, containment, dark_city, blighted_forest, void_edge, ash_trail |
| **Psi** | ruins, sky, sky_garden, floating_land, drowned_sea, crystal_ruins | volcanic, scrapyard, mine_hot, volcano, sun_forge, thermal_vent, ash_trail |
| **Sonic** | rock_cave, coast, neon_city, sky, summit, crystal_ruins | containment, sun_forge, blighted_forest, void_edge, ash_trail |
| **Gravity** | canyon, rock_cave, volcanic, ruins, mine_hot, tundra, sky, dark_city, abyss, seedpod_field, crater, summit, floating_land, void_edge, aurora, ash_trail | frozen_falls, drowned_sea |
| **Void** | rock_cave, fungal, dark_city, abyss, crater, blighted_forest, void_edge | tropical_shore, frozen_falls, sky_garden, seedpod_field, sun_forge, aurora, thermal_vent |

## World by world

### Dustara (levels 2–5)

| Section | Habitat | Wild Alienmon (rarity) |
| --- | --- | --- |
| 009 Rimwalk Trail Part A | canyon | Zib (C), Hivemaw (C), Skitterbit (U), Tiktrill (U) |
| 010 Rimwalk Trail Part B | canyon | Zib (C), Fizzlord (C), Hivemaw (C), Fizzle (R) |
| 011 Cactus Gardens | canyon | Fizzlord (C), Fizzle (U), Skitterdrone (U), Skitterbit (R) |
| 012 Sunset Tunnel B1 | rock_cave | Pebblet (U), Chirpod (U), Shadebit (U), Bouldron (R) |
| 013 Sunset Tunnel B2 | rock_cave | Squawktone (C), Umbrask (C), Blinkit (U), Pebblet (R) |
| 014 Molten Frontier: Tunnel Mouth | volcanic | Cindermole (U), Spindyn (U), Liftant (R), Pebblet (R) |
| 015 Molten Frontier: Ash Trail Part A | ash_trail | Liftant (U), Cindermole (R), Bouldron (R), Orbitusk (R) |
| 016 Molten Frontier: Ash Trail Part B | ash_trail | Hoistant (C), Cindermole (R), Kilnback (R), Liftant (R) |
| 017 Molten Frontier: Palm Isle | tropical_shore | Spinelord (C), Cactling (U), Skitterdrone (R), Blinkit (R) |
| 019 Molten Frontier: Long Dock | tropical_shore | Spinelord (C), Grayvision (U), Cactling (R), Chirpod (R) |
| 020 Molten Frontier: Ridge Path Part A | volcanic | Hoistant (C), Spindyn (R), Pebblet (R), Bouldron (R) |
| 021 Molten Frontier: Ridge Path Part B | volcanic | Kilnback (C), Hoistant (R), Spindyn (R), Orbitusk (R) |
| 024 Molten Frontier: Lava Bridges Part A | volcanic | Kilnback (C), Cindermole (R), Liftant (R), Hoistant (R) |
| 025 Molten Frontier: Lava Bridges Part B | volcanic | Orbitusk (C), Kilnback (R), Spindyn (R), Pebblet (R) |
| 027 Molten Frontier: Shadow Tunnel Mouth | rock_cave | Orbitusk (C), Squawktone (C), Umbrask (C), Shadebit (R) |
| 028 Molten Frontier: Magma Mines Gate | mine_hot | Bouldron (U), Orbitusk (R), Cindermole (R), Kilnback (R) |

**Not found wild on Dustara:** Plasma, Hydro, Cryo, Toxin, Alloy, Crystal.

### Ferrox (levels 5–10)

| Section | Habitat | Wild Alienmon (rarity) |
| --- | --- | --- |
| 034 Scrap Route Part A | scrapyard | Forgemaul (C), Boltling (U), Coilet (U), Rivetoad (U), Gleamgrub (U), Gongit (U), Nutbug (U) |
| 035 Scrap Route Part B | scrapyard | Coilossus (C), Railbeast (C), Gongorr (C), Forgemaul (C), Gearhound (U), Smeltpup (U), Magnub (U) |
| 036 Crane Yard | scrapyard | Dynamotor (C), Scraptitan (C), Railbeast (C), Corrovore (C), Anvilox (C), Magnaxis (C), Screwmantis (R) |
| 038 Furnace Ridge | scrapyard | Dynamotor (C), Scraptitan (C), Coilossus (C), Corrovore (C), Anvilox (C), Gongorr (C), Magnaxis (C) |

**Not found wild on Ferrox:** Plasma, Hydro, Bio, Cryo, Crystal, Psi, Void.

### Sporeholm (levels 9–14)

| Section | Habitat | Wild Alienmon (rarity) |
| --- | --- | --- |
| 045 Lantern Marsh Part A | swamp | Mycora (C), Lumislug (U), Gnatlet (U), Bogeel (U), Moodshroom (U), Stingmire (U), Silkpup (U) |
| 046 Lantern Marsh Part B | swamp | Gnatcloud (C), Sludgeviper (C), Dreamcap (C), Lotudrake (C), Puffspore (U), Lilypod (U), Drippit (U) |
| 047 Mushroom Maze 1F | fungal | Neonmire (C), Rotbloom (C), Lianarch (C), Mycora (C), Lunaweaver (C), Vinewisp (U), Murkling (U) |
| 048 Mushroom Maze 2F | fungal | Neonmire (C), Rotbloom (C), Lianarch (C), Dreamcap (C), Venomarch (C), Lunaweaver (C), Murkwraith (R) |
| 049 Spore Pools | swamp | Gnatcloud (C), Sludgeviper (C), Venomarch (C), Lotudrake (C), Miasmoth (U), Cocoonix (U), Abyssor (R) |

**Not found wild on Sporeholm:** Plasma, Volt, Cryo, Magma, Alloy, Crystal, Sonic, Gravity.

### Thalassa (levels 13–18)

| Section | Habitat | Wild Alienmon (rarity) |
| --- | --- | --- |
| 057 Coral Route Part A | coast | Goozilla (C), Bubblorca (C), Clawfort (C), Stormray (C), Cephalux (C), Pearlord (C), Echoleviah (C), Tidemoon (C), Mistphantom (C), Barnacolos (C), Anchorath (C), Galecry (C), Chronocrick (C), Rustlegrove (C), Divekraken (C), Bubbub (U), Zapfin (U), Conchlet (U), Tidepull (U), Barnacub (U), Gullwhistle (U), Croakle (U), Divebot (U) |
| 058 Coral Route Part B | coast | Goozilla (C), Bubblorca (C), Clawfort (C), Stormray (C), Cephalux (C), Pearlord (C), Echoleviah (C), Tidemoon (C), Mistphantom (C), Barnacolos (C), Anchorath (C), Galecry (C), Chronocrick (C), Rustlegrove (C), Divekraken (C), Crabot (U), Inklet (U), Echofin (U), Fogwisp (U), Krillo (U), Rustlit (U), Drizzlit (U), Krillswarm (R) |
| 059 Sea Arch Cove | thermal_vent | Thermoctus (C), Ventlet (U), Bubbub (R), Zapfin (R) |

**Not found wild on Thalassa:** Plasma, Cryo.

### Neonis (levels 17–22)

| Section | Habitat | Wild Alienmon (rarity) |
| --- | --- | --- |
| 066 Arcade District | neon_city | Bassquake (C), Bulbit (U), Pixbot (U), Ampup (U), Signalet (U), Glitchbug (U), Blackwatt (U), Neonewt (U), Holopup (U), Turbinit (U) |
| 067 Broadcast Route Part A | neon_city | Arclume (C), Datadron (C), Amplion (C), Transmitron (C), Glitchmoth (C), Nullgrid (C), Neonagon (C), Bassquake (C), Piezorn (C), Turbinox (C), Holofox (R) |
| 068 Broadcast Route Part B | neon_city | Arclume (C), Datadron (C), Amplion (C), Transmitron (C), Glitchmoth (C), Nullgrid (C), Neonagon (C), Piezorn (C), Turbinox (C), Filamaw (U), Quartzle (U) |

**Not found wild on Neonis:** Plasma, Hydro, Bio, Cryo, Magma, Toxin.

### Glyphos (levels 20–26)

| Section | Habitat | Wild Alienmon (rarity) |
| --- | --- | --- |
| 075 Coral Ruins Part A | ruins | Glyphling (U), Monolet (U), Shardpup (U), Echoshade (U), Fossilily (U), Chimelet (U), Vortiny (U), Oracub (U), Tarbit (U) |
| 076 Coral Ruins Part B | ruins | Runeguard (C), Obeliskor (C), Prismwolf (C), Memoria (C), Ambroot (C), Chimeral (C), Vortexus (C), Oraclaw (C), Tarpitan (C), Croakoustic (U) |
| 077 Glyph Hollow | ruins | Runeguard (C), Obeliskor (C), Prismwolf (C), Memoria (C), Ambroot (C), Chimeral (C), Vortexus (C), Oraclaw (C), Tarpitan (C), Shardwolf (U) |

**Not found wild on Glyphos:** Plasma, Volt, Cryo, Magma, Swarm, Alloy.

### Pyros (levels 23–29)

| Section | Habitat | Wild Alienmon (rarity) |
| --- | --- | --- |
| 085 Lava Rail Part A | volcano | Ashpup (U), Lavorb (U), Kindlefly (U), Smoglet (U), Scorchscale (U), Charsprout (U) |
| 086 Lava Rail Part B | volcano | Pyroclast (C), Basaltor (C), Phoenixia (C), Obsidimp (U), Drillit (U), Rumblet (U) |
| 087 Deep Mines B1 | mine_hot | Mosaik (C), Obsidrake (C), Drillcrag (C), Tremoroar (C), Basaltor (C) |
| 088 Deep Mines B2 | mine_hot | Mosaik (C), Obsidrake (C), Drillcrag (C), Tremoroar (C), Venomineral (C), Venomite (U) |
| 089 Deep Mines B3 | mine_hot | Pyroclast (C), Coremantle (C), Blazewing (C), Smogshade (C), Venomineral (C) |
| 090 Furnace Ridge (Pyros) | volcano | Coremantle (C), Blazewing (C), Smogshade (C), Phoenixia (C), Cinderhound (U), Scorchwyrm (R) |

**Not found wild on Pyros:** Plasma, Hydro, Volt, Cryo, Psi.

### Glacia (levels 27–33)

| Section | Habitat | Wild Alienmon (rarity) |
| --- | --- | --- |
| 096 Aurora Route Part A | aurora | Glaciryx (C), Cryoblaze (C), Snoblet (U), Floepup (U), Frostmite (U), Frostflare (U) |
| 097 Aurora Route Part B | aurora | Glaciryx (C), Cryoblaze (C), Rimeshard (U), Auroralet (U), Shatterling (U) |
| 098 Crystal Caverns B1 | ice_cave | Rimecrown (C), Frostcolony (C), Thawmaw (C), Hailorb (U), Chillshade (U) |
| 099 Crystal Caverns B2 | ice_cave | Rimecrown (C), Borealix (C), Frostcolony (C), Thawmaw (C) |
| 100 Crystal Caverns B3 | ice_cave | Glaciarch (C), Borealix (C), Hailbringer (C), Whiteout (C) |
| 101 Fossil Dig | tundra | Glaciarch (C), Floelord (C), Hailbringer (C), Whiteout (C), Lichenoth (C), Lichling (U) |
| 102 Frozen Falls | frozen_falls | Floelord (C), Iceburr (U), Icicub (U), Shatterhorn (R) |

**Not found wild on Glacia:** Volt, Magma, Toxin, Alloy.

### Helix Station (levels 30–36)

| Section | Habitat | Wild Alienmon (rarity) |
| --- | --- | --- |
| 109 Containment Wing 1F | containment | Splicelet (U), Vialit (U), Cagebot (U), Nullbot (U), Vexhydra (R) |
| 110 Containment Wing 2F | containment | Chimerax (C), Vialord (C), Wardenix (C), Splicor (U), Bronnix (R) |
| 111 Engineering | containment | Chimerax (C), Vialord (C), Wardenix (C), Stalactrix (U), Nulltron (R) |

**Not found wild on Helix Station:** Plasma, Hydro, Bio, Magma, Swarm, Crystal, Sonic.

### Halo (levels 33–39)

| Section | Habitat | Wild Alienmon (rarity) |
| --- | --- | --- |
| 118 Wind Bridges Part A | sky | Thornvoid (C), Cerebralux (C), Zephyrion (C), Nightmarra (C), Reflix (C), Humlet (U), Levitot (U), Haloette (U), Zephyrling (U) |
| 119 Wind Bridges Part B | sky | Thornvoid (C), Cerebralux (C), Hummingmind (C), Levitaur (C), Halocene (C), Zephyrion (C), Nightmarra (C), Reflix (C), Dreamwisp (U), Thunderhead (U) |
| 120 Floating Gardens | sky_garden | Hummingmind (C), Levitaur (C), Halocene (C), Mindlet (U), Cerebrix (U), Astrochick (U), Bardlet (U), Astrowl (R), Mirrix (R) |

**Not found wild on Halo:** Plasma, Bio, Cryo, Magma, Toxin, Swarm, Alloy.

### Umbra (levels 37–43)

| Section | Habitat | Wild Alienmon (rarity) |
| --- | --- | --- |
| 127 Lantern Streets Part A | dark_city | Ruinmech (C), Sulklet (U), Ruinbot (U), Rotroot (U) |
| 128 Lantern Streets Part B | dark_city | Ruinmech (C), Wellspawn (U), Wailshade (U), Gravebloom (R) |
| 129 The Sinkhole B1 | abyss | Gloomhulk (C), Duskmite (U), Geopip (U), Sulklet (R) |
| 130 The Sinkhole B2 | abyss | Gloomhulk (C), Dusklord (C), Banshriek (C), Gloomhaunt (R) |
| 131 The Sinkhole B3 | abyss | Wellmaw (C), Banshriek (C), Geodome (C), Gloomhaunt (U) |
| 132 The Sinkhole B4 | abyss | Wellmaw (C), Dusklord (C), Geodome (C), Bardseer (U) |

**Not found wild on Umbra:** Plasma, Hydro, Volt, Cryo, Magma, Toxin.

### Starfall Rift (levels 42–48)

| Section | Habitat | Wild Alienmon (rarity) |
| --- | --- | --- |
| 138 Seedpod Fields Part A | seedpod_field | Starbloom (C), Podsentinel (C), Novaling (U), Quasarling (U), Cometlet (U), Meteorb (U), Starsprout (U) |
| 139 Seedpod Fields Part B | seedpod_field | Supernovyx (C), Cometrix (C), Starbloom (C), Podsentinel (C), Prismite (U), Sunbug (U), Podlet (U), Podspawn (U) |
| 141 Crater Rim | crater | Horizar (C), Prismora (C), Solarswarm (C), Eclipsit (U), Foldling (U) |
| 142 Crater Descent B1 | crater | Horizar (C), Prismora (C), Cometrix (C), Solarswarm (C), Stompadon (R) |
| 143 Crater Descent B2 | crater | Supernovyx (C), Quasarus (C), Eclipsor (C), Meteorox (C) |
| 144 Crater Descent B3 | crater | Quasarus (C), Eclipsor (C), Meteorox (C), Novacat (U) |

**Not found wild on Starfall Rift:** Hydro, Volt, Cryo, Magma, Toxin, Alloy, Psi.

### Apex Array (levels 46–52)

| Section | Habitat | Wild Alienmon (rarity) |
| --- | --- | --- |
| 146 Summit Lift | summit | Foldarch (C), Gemmantle (C), Riffrex (C), Cragmajor (C), Gemmling (U), Riffling (U), Cragpull (U), Flarechick (U), Flarehawk (U), Diamite (U), Diamondillo (R), Facetrix (R), Encorex (R), Pyrelyth (R), Citadrake (R) |

**Not found wild on Apex Array:** Hydro, Bio, Volt, Cryo, Magma, Toxin, Swarm, Psi.

### Ystra (levels 55–65)

| Section | Habitat | Wild Alienmon (rarity) |
| --- | --- | --- |
| 154 Floating Continents Part A | floating_land | Riftling (U), Blightling (R), Riftwalker (R), Blightroot (R) |
| 155 Floating Continents Part B | floating_land | Riftwalker (C), Riftling (R), Blightling (R), Blightroot (R) |
| 156 Drowned Seas | drowned_sea | Fractling (R), Fractalith (R), Blightling (R), Blightroot (R) |
| 157 Sun Forge | sun_forge | *None: Ignarch's domain, static legendary only* |
| 158 Crystal Ruins 1F | crystal_ruins | Firstlight (C), Fractalith (C), Fractling (U), Pulsito (R) |
| 159 Crystal Ruins 2F | crystal_ruins | Firstlight (C), Fractalith (C), Pulsito (U), Pulsarion (R) |
| 160 Blighted Forest Part A | blighted_forest | Blightroot (C), Blightling (U), Riftling (R), Riftwalker (R) |
| 161 Blighted Forest Part B | blighted_forest | Blightroot (C), Blightling (R), Riftling (R), Riftwalker (R) |
| 162 Edge of the Void | void_edge | Riftwalker (C), Riftling (R), Firstlight (R) |

**Not found wild on Ystra:** Hydro, Volt, Cryo, Magma, Toxin, Swarm, Alloy.

On Pyros, the only Bio types are fire plants (Charsprout and Phoenixia, Magma/Bio).

Rarity key: C common, U uncommon, R rare. Rare entries marked as spillover in `encounters.json` are extra appearances added so no area feels empty.

## The 9 Alienmon that were in the wrong place

These were placed on worlds where they couldn't live. They've been moved, and `data/planets.json` is already updated.

| Alienmon | Types | Was on | Now on | Why |
| --- | --- | --- | --- | --- |
| Magnaxis | Alloy/Gravity | Sporeholm | Ferrox | Alloy/Gravity can't live in Sporeholm's habitats (fungal, swamp) |
| Cryoblaze | Cryo/Plasma | Thalassa | Glacia | Cryo/Plasma can't live in Thalassa's habitats (coast, thermal_vent) |
| Thermoctus | Hydro/Magma | Neonis | Thalassa | Hydro/Magma can't live in Neonis's habitats (neon_city) |
| Turbinox | Volt/Gravity | Glyphos | Neonis | Volt/Gravity can't live in Glyphos's habitats (ruins) |
| Divekraken | Alloy/Hydro | Pyros | Thalassa | Alloy/Hydro can't live in Pyros's habitats (mine_hot, volcano) |
| Phoenixia | Magma/Bio | Glacia | Pyros | Magma/Bio can't live in Glacia's habitats (aurora, frozen_falls, ice_cave, tundra) |
| Tarpitan | Toxin/Gravity | Glacia | Glyphos | Toxin/Gravity can't live in Glacia's habitats (aurora, frozen_falls, ice_cave, tundra) |
| Venomineral | Crystal/Toxin | Glacia | Pyros | Crystal/Toxin can't live in Glacia's habitats (aurora, frozen_falls, ice_cave, tundra) |
| Drizzlit | Volt/Hydro | Glacia | Thalassa | Volt/Hydro can't live in Glacia's habitats (aurora, frozen_falls, ice_cave, tundra) |

**The one you asked about:** Divekraken (Alloy/Hydro) was on Pyros, the fire planet. It's now on Thalassa with its pre-evolution Divebot.

## Alienmon that aren't wild

| Group | How you get them |
| --- | --- |
| Starters (Sporix, Plazmo, Gloopa lines) | A gift at Vashti's Observatory; later forms by evolving. Abyssor can also appear rarely in the wild in Sporeholm |
| Ystra legendaries | One-time static encounters: Terravox (Floating Continents), Aquelion (Drowned Seas), Ignarch (Sun Forge), Oblivane (Edge of the Void) |
| Seedmother | Story only: regrows in the Reunion. Never caught |
| Other legendaries and story Alienmon | Story encounters, as already set in `quests.json` |

## Encounter details

Each entry in `data/encounters.json` has:

- **weight:** common 10, uncommon 5, rare 1.
- **levels:** set by how far into the world the section is. Evolved forms are 2 levels higher.
- **method:**
  - `walk`: drift grass or open ground.
  - `cave`: caves and dungeons.
  - `surf`: water-type Alienmon in water sections. Single-type water Alienmon can also be caught by fishing.
- **time:** Void and Psi types appear twice as often at night; Plasma and Bio twice as often by day.

## Handoff prompt for Claude Code

```markdown
Add the Alienmon Habitat Logic Pack to the game.
1. Replace data/batches/batch01_kessler/planets.json with the pack's data/planets.json (moves 9 misplaced Alienmon).
2. Copy data/habitat_rules.json and data/encounters.json into data/, and tools/habitat_rules.py and tools/validate_habitats.py into tools/.
3. Switch wild encounters from planet-wide pools to section-level tables from encounters.json: pick by weight, use the levels range, honor method (walk / cave / surf / fishing) and the time-of-day boosts. Keep planet pools as the fallback for any map area not in encounters.json.
4. Show the habitat name and the species found there in the Xenodex area info.
5. Run tools/validate_habitats.py as part of `node tools/build.js`; the build must fail if it fails.
6. Never place an Alienmon anywhere without adding it to encounters.json and passing the validator.
```
