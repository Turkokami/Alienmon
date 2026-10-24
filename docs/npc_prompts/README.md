# World character pack: 8 new townsfolk per world

Today most maps reuse the same generic people (explorer, wanderer, technician, guard, researcher). This pack gives every world
eight characters of its own, built from its biome and its story, so each world looks and feels different.

## How to render (2 renders per world, 28 in total)
1. New ChatGPT image chat per world.
2. Attach that world's `references/<world>_style_reference.png` (the player and two existing folk of that world, for style and scale).
3. Paste the **front sheet** prompt. Generate at **1536x1024**.
4. In the same chat, paste the **back sheet** prompt. Generate.
5. Check: 8 full-body characters in a 4x2 grid, feet on the same line, nothing cut off or touching a cell edge, white background,
   the back sheet matches the front sheet character for character. **Open each saved file once before zipping.**
6. Save as `<world>_npcs_front.png` and `<world>_npcs_back.png`. Send a few worlds per zip.

When they arrive I cut each sheet into single sprites (front + back), and swap the generic townsfolk on each world for that world's own people.

| # | World | The eight |
|---|---|---|
| 1 | Dustara | Canyon Courier, Crater Stargazer, Dune Farmer, Spice Vendor, Sand Ranger, Seedpod Hunter, Mesa Mechanic, Desert Elder |
| 2 | Ferrox | Crane Operator, Scrap Picker, Railyard Conductor, Forge Smith, Rust Kid Tinkerer, Salvage Trader, Welding Apprentice, Ferrox Foreman |
| 3 | Sporeholm | Mushroom Forager, Spore-mask Researcher, Bog Fisher, Swamp Herbalist, Firefly Lantern Kid, Moss Ranger, Stilt-house Builder, Spore Choir Singer |
| 4 | Thalassa | Dock Hand, Fishmonger, Pearl Diver, Lighthouse Keeper, Harbor Sailor, Beach Kid, Shipwright, Coral Researcher |
| 5 | Neonis | Neon Raver, Holo-ad Promoter, Neon Skater, Arcade Kid, Cable Tech, Noodle Stall Cook, Glitch Hunter, Night Courier |
| 6 | Glyphos | Archaeologist, Mural Copyist, Chime Keeper, Dig Camp Cook, Relic Porter, Rune Scholar, Jungle Guide, Ruins Kid |
| 7 | Pyros | Lava Miner, Ember Lamplighter, Drill Operator, Obsidian Carver, Fire Warden, Cinder Kid, Hot Spring Keeper, Ash Elder |
| 8 | Glacia | Ice Fisher, Aurora Watcher, Sled Courier, Snow Researcher, Fur-trim Trader, Snowball Kid, Ice Climber, Frostmark Baker |
| 9 | Helix Station | Station Engineer, Lab Assistant, Hydroponics Gardener, Docking Pilot, Service Droid, Helix Grunt, Freed Captive, Station Kid |
| 10 | Halo | Sky Pilgrim, Cloud Farmer, Wind Glider, Temple Bellringer, Sky Postman, Kite Kid, Starwatch Monk, Feather Weaver |
| 11 | Umbra | Lantern Lighter, Gravekeeper, Shadow Cartographer, Night Market Vendor, Veiled Mourner, Ghost-story Kid, Void Researcher, Mine Watchman |
| 12 | Starfall Rift | Rift Surveyor, Seedpod Collector, Camp Medic, Meteor Prospector, Rim Camp Cook, Signal Operator, Containment Officer, Star-chart Kid |
| 13 | Apex Array | Telescope Technician, Summit Climber, Star Chart Scholar, Relay Engineer, Quorum Delegate, Mountain Porter, Prime Linker Hopeful, Observatory Kid |
| 14 | Ystra | Ystran Elder, Ystran Seedkeeper, Ystran Scout, Echo Child, Blight Cleanser, Ystran Artisan, Fragment Wanderer, Memory Keeper |

112 characters in 28 renders. Role names are working names; change any you like.
