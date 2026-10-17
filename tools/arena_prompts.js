// Writes the Linker Arena render prompt pack from the game data (plain Node, built-ins only).
// Output: docs/arena/prompts/{sprites,scenes,fx,ui}/*.md and docs/arena/render_tracker.csv
// Re-run after adding Alienmon or moves: node tools/arena_prompts.js
// Arena shapes are design proposals for the real-time mode; power and accuracy always come from the battle data.
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'),out=path.join(root,'docs/arena/prompts');
const core=JSON.parse(fs.readFileSync(path.join(root,'data/core_battle.json')));
let D=[],P=[];
for(const d of fs.readdirSync(path.join(root,'data/batches')).filter(d=>!d.startsWith('.')).sort()){
 const b=path.join(root,'data/batches',d);
 D=D.concat(JSON.parse(fs.readFileSync(path.join(b,'alienmon.json'))));
 P=P.concat(JSON.parse(fs.readFileSync(path.join(b,'planets.json'))));}
const has=rel=>fs.existsSync(path.join(root,rel));
const TRACK=[];   // [batch file, kind, name, output path]

// ---------- shared style blocks (from docs/STORY_BIBLE.md section 2) ----------
const SPRITE_STYLE='High-quality original pixel art game sprite in a modern Game Boy Advance / 16-bit monster-collecting style. Crisp, even pixel grid where every pixel is a hard square block at roughly 128x128 sprite resolution per pose, upscaled evenly; no blur, no anti-aliasing, no painterly or noisy texture. Controlled palette of 24-32 colors with 3-4 tone cel shading, one light source from the top left, and a consistent dark 1-pixel outline around the whole silhouette. Bold, readable silhouette that still reads clearly when shrunk to 64x64. Always full color.';
const ENV_STYLE='Vibrant, highly detailed pixel art game environment, top-down 3/4 perspective like a modern 16-bit / 32-bit handheld RPG, same style, palette, lighting and detail level as the existing Alienmon scene set. Saturated jewel-tone colors, crisp pixel clusters, soft glowing light sources, crisp outlines.';
const FX_STYLE='Pixel art game special effect in the same crisp 16-bit style as the Alienmon creature sprites: hard square pixels, no blur, no anti-aliasing, no painterly texture, bold readable shapes, 3-4 tone cel shading with a bright core and a darker rim. Effects only: no creatures, no characters, no ground, no text.';
const AVOID='Do not copy or resemble any existing Pokemon, Digimon or other franchise creature, character, logo or UI. No text, letters, numbers, captions, watermarks or UI. No photorealism and no 3D render look. Nothing that looks like a Pokeball (no red-and-white ball with a band and button).';

// ---------- the 14 types: palette and effect language ----------
const TYPE={
 Plasma:{col:'solar orange #ff8a1e, gold #ffd23f, burnt amber #b34700',look:'solar fire, plasma flames and sun flares',key:'#00FF00'},
 Hydro:{col:'ocean blue #2e86de, sky aqua #7fd3ff, deep navy #1b4f8a',look:'water, bubbles, foam and tides',key:'#FF00FF'},
 Bio:{col:'leaf green #3fae49, lime #9be36b, forest green #1f6b2a',look:'spores, vines, leaves, petals and mushroom puffs',key:'#FF00FF'},
 Volt:{col:'electric yellow #ffd400, neon cyan #5ff2ff, dark gold #b38f00',look:'zig-zag electricity, arcs and spark bursts',key:'#FF00FF'},
 Cryo:{col:'ice blue #9fd8ff, frost white, steel blue #5b8fb8',look:'ice crystals, frost, snowflakes and cold mist',key:'#FF00FF'},
 Magma:{col:'magma red #d7262e, lava orange #ff8c2a, basalt maroon #5a1a1a',look:'molten rock, lava globs, cinders and cracked black basalt',key:'#00FF00'},
 Toxin:{col:'acid lime #8be000, poison purple #b45cff, swamp olive #3a5a00',look:'dripping acid, bubbling poison and purple miasma clouds',key:'#FF00FF'},
 Swarm:{col:'amber #d9a032, pollen olive #c7c25a, dark brown #5e3d1a',look:'tiny alien insects, stingers, wings and honeycomb hexes',key:'#FF00FF'},
 Alloy:{col:'steel grey #8a95a5, copper #c87a3a, gunmetal #4a5260',look:'gears, bolts, rivets, steel plates and sparks off metal',key:'#FF00FF'},
 Crystal:{col:'magenta #e23fbf, lilac #c9a6ff, deep plum #7a1f6a',look:'faceted gem shards, prisms and rainbow-edged glints',key:'#00FF00'},
 Psi:{col:'psychic pink #ff74c4, violet #a35cff, deep mauve #7a2a6e',look:'glowing rings, mind waves and floating eye-like sigils (no real eyes)',key:'#00FF00'},
 Sonic:{col:'teal #19c3b0, hot pink #ff4fa3, dark teal #0f6e64',look:'sound rings, equalizer bars and music-note-like shards',key:'#00FF00'},
 Gravity:{col:'earth brown #8a6a4a, slate blue #5b6b8a, deep indigo #3a2b4f',look:'orbiting rocks, bent space lines and heavy stone',key:'#FF00FF'},
 Void:{col:'deep indigo #4a3570, violet #7a4fbf, near-black #140e22 with a bright violet rim',look:'starless dark, shadow wisps, event-horizon rings',key:'#00FF00'}};

// ---------- arena shapes: how a move behaves in real time and what its FX sheet holds ----------
const SHAPE={
 PROJ:{what:'a projectile that flies straight forward and bursts on contact',row1:'4 frames of the projectile in flight, pointing RIGHT, looping (spin or flicker between frames)'},
 LOB:{what:'a lobbed shot that arcs through the air and splashes where it lands',row1:'4 frames of the lobbed glob in flight, pointing RIGHT, slightly wobbling'},
 BEAM:{what:'a straight beam from the user to the edge of its range',row1:'frame 1 the beam START cap (flare at the source), frames 2-3 two versions of a seamlessly TILEABLE horizontal beam MIDDLE segment that fills the cell edge to edge left-right, frame 4 the beam END cap'},
 CHAIN:{what:'a lightning arc that jumps to the nearest foe, then to one more',row1:'frames 1-3 three different seamlessly TILEABLE horizontal arc segments filling the cell edge to edge left-right, frame 4 the arc source flash'},
 WAVE:{what:'a wide wall that rolls forward across the arena, pushing foes back',row1:'4 frames of a wide wall moving RIGHT, seen from top-down 3/4, tall in the cell, looping'},
 CONE:{what:'a short wedge that fans out in front of the user',row1:'4 frames of a wedge fanning out to the RIGHT from the left edge of the cell, growing then fading'},
 ARC:{what:'a melee swipe or bite right in front of the user',row1:'4 frames of a crescent swipe or snapping jaws shape opening to the RIGHT, quick and punchy'},
 DASH:{what:'a charge: the user dashes forward and hits whoever it meets',row1:'4 frames of a motion trail streaking LEFT behind an empty space on the right (the creature is drawn by the game, leave the right third of each cell empty)'},
 BURST:{what:'a ring that blasts outward all around the user',row1:'4 frames of a ring exploding outward, seen from top-down 3/4 (an ellipse twice as wide as it is tall), empty center'},
 ZONE:{what:'an attack that erupts from the ground at a target spot after a short warning',row1:'4 frames of the eruption at a spot on the ground, seen from top-down 3/4, rising then collapsing'},
 RAIN:{what:'a cluster of hits that falls over a target area',row1:'4 frames of several small pieces falling and landing inside an ellipse on the ground, seen from top-down 3/4'},
 FIELD:{what:'a lingering patch on the ground that affects anyone standing in it',row1:'4 frames of a looping ground patch, seen from top-down 3/4 (an ellipse twice as wide as it is tall), gently animated'},
 AURA:{what:'a self buff or heal shown around the user',row1:'4 frames of a looping aura ring around an EMPTY center (the creature is drawn by the game), seen from top-down 3/4'}};

// every move's arena shape and effect picture live in data/arena.json (the game reads the same shapes)
const AJ=JSON.parse(fs.readFileSync(path.join(root,'data/arena.json')));
const MOVEFX=JSON.parse(fs.readFileSync(path.join(root,'data/moves_fx.json')));
const TM_NAMES=JSON.parse(fs.readFileSync(path.join(root,'src/template.html'),'utf8').match(/const TM=\{([\s\S]*?)\};/)[1].replace(/(\w+):\[\[/g,'"$1":[[').replace(/'/g,'"').replace(/\{[^{}]*(\{[^{}]*\})?[^{}]*\}/g,'0').replace(/^/,'{')+'}');
const MOVES={};for(const t of Object.keys(TYPE))MOVES[t]=TM_NAMES[t].map(m=>m[0]).concat((MOVEFX.new[t]||[]).map(m=>m[0])).map(n=>{if(!AJ.moves[n])throw new Error('data/arena.json has no shape for '+n);return[n,...AJ.moves[n]]});
const SIG_SHAPE=core.signature_moves.map(m=>{if(!AJ.signature[m.n])throw new Error('data/arena.json has no shape for '+m.n);return AJ.signature[m.n]});

// ---------- helpers ----------
const pad=n=>String(n).padStart(3,'0');
const q=s=>s.split('\n').map(l=>'> '+l).join('\n');
function write(rel,txt){const p=path.join(out,rel);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,txt);console.log('wrote',path.relative(root,p))}
const sigOwners={};D.forEach(m=>{if(m.sig>=0)(sigOwners[m.sig]=sigOwners[m.sig]||[]).push(m.name)});

// ---------- 1. Alienmon arena pose sheets ----------
function spritePrompt(m){
 const types=m.t.join(' / '),tx=TYPE[m.t[0]];
 const attack=`attacking with a small burst of ${tx.look} touching its body (mouth, hands, horns, tail or core, whatever fits its shape); the real attack effect is added by the game, so keep it small and attached`;
 return [
 `Arena pose sheet for the Alienmon "${m.name}" (${types} type). Use the attached reference sprite as the exact design: same body shape, proportions, colors, markings and details in every pose. Do not redesign it, add accessories or change its colors.`,
 `What it looks like: ${m.lore}`,
 `Canvas 1536x1024, landscape. Pure flat white #FFFFFF background. Six poses of the same creature in a 3-column x 2-row grid of equal 512x512 cells. Each pose is centered in its cell, fills about 70% of the cell, and never touches or crosses a cell edge. Every pose is drawn at the SAME scale, with the bottom of the creature (feet, base or lowest point) on the same line near the bottom of its cell. No grid lines, no labels, no numbers.`,
 `Row 1, cell 1 - SIDE A: full side profile facing RIGHT, moving (if it has legs, mid-stride with the front leg forward; if it flies, wings up; if it floats or slithers, leaning into the motion).`,
 `Row 1, cell 2 - SIDE B: the same side profile facing RIGHT, the other half of the step (legs passing, wings down, or bobbed slightly lower). Together cells 1 and 2 make a 2-frame walk loop.`,
 `Row 1, cell 3 - ATTACK FRONT: 3/4 front view facing slightly LEFT like the reference sprite, lunging toward the viewer, ${attack}.`,
 `Row 2, cell 1 - ATTACK BACK: seen from BEHIND (back view, 3/4 from above), lunging away from the viewer into the distance, the same attack energy at its front.`,
 `Row 2, cell 2 - HURT: 3/4 front view, recoiling backwards from a hit, eyes squeezed shut, body squashed and tilted, two or three small white impact stars touching it.`,
 `Row 2, cell 3 - KO: lying flopped on the ground, dazed with swirly eyes and a few tiny stars circling close above its head. Kid-friendly: no injuries, no blood, no tears in the body.`,
 `Colors: keep the reference palette exactly; its ${m.t[0]} type accents are ${tx.col}.`,
 SPRITE_STYLE+' Same dark 1-pixel outline in every pose. Effects stay touching the body. No shadow, no ground line, no glow halo, no vignette.',
 AVOID].join('\n');}

const order=[...D.filter(m=>m.r==='starter'||m.r==='mascot'),...D.filter(m=>m.r==='signature'),...D.filter(m=>m.r==='normal'),...D.filter(m=>m.r==='legendary'||m.r==='mythic')];
const SB=19,sbatches=[];for(let i=0;i<order.length;i+=SB)sbatches.push(order.slice(i,i+SB));
sbatches.forEach((list,bi)=>{
 const f=`sprites/sprites_batch_${String(bi+1).padStart(2,'0')}.md`;
 let s=`# Linker Arena sprites, batch ${bi+1} of ${sbatches.length}\n\n${list.length} Alienmon, one pose sheet each. ${bi===0?'**Render this batch first:** the starters, Zib and the first signature Alienmon are the Phase 1 launch roster.':''}\n\n`;
 s+='How to render: open a new ChatGPT image chat for each Alienmon, attach its reference sprite, paste the prompt, generate at 1536x1024. Save the result with the exact file name shown. Check: white background, six poses in a clean 3x2 grid, same size and design in every cell, nothing touching a cell edge. Full rules: `docs/arena/prompts/README.md`.\n\n';
 s+='| # | Alienmon | Types | Reference | Save as |\n|---|---|---|---|---|\n';
 list.forEach(m=>s+=`| ${pad(m.n)} | ${m.name} | ${m.t.join(' / ')} | \`art/sprites/${m.name}.png\` | \`art/arena/raw/${m.name}_arena.png\` |\n`);
 s+='\n---\n';
 list.forEach(m=>{
  const sig=m.sig>=0&&core.signature_moves[m.sig]?core.signature_moves[m.sig].n:null;
  s+=`\n## ${pad(m.n)} ${m.name}\n`;
  s+=`- **Types:** ${m.t.join(' / ')} · **Stage:** ${m.st} of ${m.tot}${m.to?` (evolves into ${m.to})`:''} · **Rarity:** ${m.r}${sig?` · **Signature move:** ${sig}`:''}\n`;
  s+=`- **Attach:** \`art/sprites/${m.name}.png\`${has(`art/sprites_back/${m.name}.png`)?` (also attach \`art/sprites_back/${m.name}.png\` to help the back-view pose)`:' (no back sprite yet: see README extra renders)'}\n`;
  s+=`- **Save as:** \`art/arena/raw/${m.name}_arena.png\`\n\n**Prompt:**\n\n${q(spritePrompt(m))}\n`;
  TRACK.push([f,'pose sheet',m.name,`art/arena/raw/${m.name}_arena.png`]);});
 write(f,s);});

// ---------- 2. Arena scenes: floor, terrain tiles, hazard sheet per planet ----------
const ARENA={
 dustara:['a sandstone battle ring sunk into a red-rock desert canyon near the Crater Observatory: packed orange dirt floor with faint cart ruts, low sandstone ring wall, cactus planters, cream dome buildings with cyan windows peeking over the canyon rim, purple Linker League banners with the gold ringed-planet emblem','dust devils: a small swirling sand tornado that wanders and slows anyone inside','craters in packed dirt, cracked dry earth, wind-swept sand ripples, scattered rocks'],
 ferrox:['Hank Briggs\' scrapyard ring: riveted steel deck plates, rusty oil drums, stacked scrap, a crane arm at the edge, yellow-and-black hazard stripes on the border','a magnet crane shadow that drops a scrap pile onto a marked spot','dented and buckled steel plates, oil slicks, bent girders, loose bolts'],
 sporeholm:['Dr. Lysa Moor\'s swamp court: mossy wooden boardwalk square over dark mud, giant glowing mushrooms, hanging vines, misty pools around the edge','spore vents: a mushroom vent that puffs a purple poison cloud','sticky mud pits, spore patches, broken boardwalk planks, crushed mushrooms'],
 thalassa:['Captain Marsh\'s tidal battle deck: a wide wooden ship-deck platform ringed by shallow turquoise water, rope rails, barrels, a mast with a purple League sail','a water geyser that bursts up from a deck grate and knocks foes aside','splintered planks, puddles, washed-up seaweed, cracked deck boards'],
 neonis:['DJ Static\'s neon stage: a dance floor of glowing LED tiles in magenta and cyan, towering speaker stacks, light rigs, cables taped down at the edges, a city skyline glow behind','bass-pulse tiles: a ring of floor tiles that flashes then stuns anyone on it','cracked LED tiles, dark dead tiles, sparking loose cables, scorched stage marks'],
 glyphos:['an ancient obelisk plaza: worn flagstones carved with glowing teal glyphs, broken columns, the tall obelisk at the top edge, sand drifting over the stones','glyph traps: a carved glyph tile that lights up and fires a short beam upward','broken flagstones, rubble piles, cracked glyph tiles, sand drifts'],
 pyros:['Old Basalt\'s lava mine arena: wide black basalt platforms joined by sturdy bridges over a glowing lava lake, mine cart rails, lanterns, ore crates at the edges','lava flares: a bubbling vent that erupts in a short burst of flame','glowing lava cracks, molten pools, scorched basalt, crumbled rock'],
 glacia:['Ingrid Vale\'s frozen lake ring: smooth pale-blue ice floor with snow banks around it, ice spires, pine-like crystal trees, aurora sky reflected in the ice','falling icicles: a shadow marks the spot, then an icicle shatters on it','cracked ice showing dark water below, frost patches, snow piles, ice shards'],
 helix:['a Helix Directive test chamber: steel floor grates, glowing red-and-white hazard lines, holographic monitor panels on the walls, cold sterile lighting (the villains\' arena, a little menacing)','a sweeping laser grid line that crosses the floor','scorched grates, broken floor panels, sparking cables, dented metal'],
 halo:['a floating sky island court: white marble floor with gold inlay, wind shrines with spinning chimes at the corners, clouds and a ringed gas giant far below the edge','wind gusts: a streak of wind that pushes anyone in its lane','cracked marble, holes showing clouds below, fallen chimes, scattered feathers of light'],
 umbra:['Mortimer Kade\'s dark cavern arena: smooth black stone floor lit only by bioluminescent cyan crystals and violet mushrooms around the edge, deep shadows','dark pulses: a creeping circle of darkness that hides anyone inside','cracks seeping violet shadow, shattered crystals, dark puddles'],
 starfall:['a platform on the edge of the Starfall Rift: cracked metal-and-rock platform floating in a swirling purple-and-teal nebula, Helix machinery wrecked at the edges, the Rift glowing in the distance','rift portals: a pair of small glowing portals that teleport anything that enters one to the other','rift tears in the floor, floating rock chunks, cracked metal plates'],
 apex:['the Apex Array championship arena: polished floor with a gold ringed-planet emblem in the center circle, purple Linker League banners, brass trim, cyan light strips, grand stands silhouetted at the edges (no people)','none: the championship floor has no hazards; draw a ring of cyan floor lights that pulse at the start of a round instead','scorch marks, cracked polished tiles, scuffed emblem paint'],
 ystra:['a crystal shrine in a shattered crater: pale crystal floor, broken crystal pillars around the rim, a faint warm glow rising from a deep crack at the top edge, floating rock islands in a strange sky','crystal pulses: a crystal cluster that pulses and restores a little HP to anyone near it','shattered crystal shards, cracked crystal floor, glowing fissures']};
const EXTRA_ARENAS=[
 ['court','Link Battle Court (training and quick-match arena, name pending owner approval)','a clean, friendly practice court inside a Linker League building: polished cream floor with a painted purple boundary line and a gold ringed-planet emblem in the center, brass rails, cyan light strips, supply crates with cyan lights at the corners','none: draw a set of four target pads on the floor instead (round pads with a cyan ring)','scuff marks, small craters, cracked floor tiles'],
 ['lobby','Arena lobby (the building in Dustmere where the Arena mode is entered)',null,null,null]];

function floorPrompt(name,desc){return [
 `Linker Arena battle floor: ${name}. ${desc}.`,
 'Canvas 1536x1024, landscape, seen from top-down 3/4 like the other Alienmon battle maps. The central play area (about 1280x800, centered) is flat, open, clearly walkable ground with only light texture so creature sprites read clearly on top of it. Scenery, walls, props and hazards stay in a border band around the outside; the border clearly reads as solid and blocked. The play area is symmetrical left-to-right so both sides are fair.',
 'No characters, no creatures, no people in the stands. Seamless clean edges, no frame.',
 ENV_STYLE,AVOID].join('\n')}
function tilesPrompt(name,dmg){return [
 `Linker Arena terrain damage tiles for the ${name} arena floor: ${dmg}.`,
 'Canvas 1024x1024. A 4x4 grid of equal 256x256 cells on a fully TRANSPARENT background (if transparency is not possible, use flat pure magenta #FF00FF). Every tile is drawn from top-down 3/4, matching the floor texture and palette of this arena, with soft irregular edges that blend into the floor.',
 'Row 1: four craters, from small to large, the last one scorched.',
 'Row 2: four crack patterns (a short crack, a long crack, a branching crack, a star-shaped impact crack).',
 'Row 3: the arena\'s special ground hazard patch as a 4-frame loop (for example a bubbling pool, a slick or a glowing spot).',
 'Row 4: four loose debris props that sit on the floor (small chunks, scattered pieces).',
 'Nothing crosses a cell edge. No text, no grid lines.',
 ENV_STYLE,AVOID].join('\n')}
function hazardPrompt(name,hz){return [
 `Linker Arena hazard animation for the ${name} arena: ${hz}.`,
 'Canvas 1536x1024 on a fully TRANSPARENT background (if transparency is not possible, use flat pure magenta #FF00FF). A 4-column x 2-row grid of equal 384x512 cells.',
 'Row 1: the hazard in action, 4 frames left to right (start, peak, peak variant, fade). Seen from top-down 3/4 and centered on the bottom middle of each cell, where it touches the ground.',
 'Row 2: the warning telegraph that appears on the ground just before it, 4 frames looping (a glowing ring or marker in the arena\'s colors, gently pulsing).',
 'Nothing crosses a cell edge. No text, no grid lines, no creatures.',
 FX_STYLE,AVOID].join('\n')}
const planetsA=P.slice(0,7),planetsB=P.slice(7);
[[planetsA,'scenes/arena_scenes_A.md','A'],[planetsB,'scenes/arena_scenes_B.md','B']].forEach(([list,f,tag])=>{
 let s=`# Linker Arena scenes, batch ${tag}\n\nThree renders per planet: the battle floor, the terrain damage tiles and the hazard sheet. The planet\'s existing \`art/scenes/<planet>_battle.jpg\` is reused as the arena select card, so no extra key art is needed.\n\n| Planet | Floor | Tiles | Hazard |\n|---|---|---|---|\n`;
 list.forEach(p=>s+=`| ${p.name} | \`art/arena/scenes/${p.key}_arena.jpg\` | \`art/arena/raw/tiles/${p.key}_tiles.png\` | \`art/arena/raw/hazards/${p.key}_hazard.png\` |\n`);
 s+='\n---\n';
 list.forEach(p=>{const [desc,hz,dmg]=ARENA[p.key];
  s+=`\n## ${p.name} (${p.env})${p.keeper?` · Keeper: ${p.keeper.name}`:''}\n\n`;
  s+=`### Floor · save as \`art/arena/scenes/${p.key}_arena.jpg\`\n\n${q(floorPrompt(p.name,desc))}\n\n`;
  s+=`### Terrain tiles · save as \`art/arena/raw/tiles/${p.key}_tiles.png\`\n\n${q(tilesPrompt(p.name,dmg))}\n\n`;
  s+=`### Hazard · save as \`art/arena/raw/hazards/${p.key}_hazard.png\`\n\n${q(hazardPrompt(p.name,hz))}\n`;
  TRACK.push([f,'arena floor',p.name,`art/arena/scenes/${p.key}_arena.jpg`],[f,'arena tiles',p.name,`art/arena/raw/tiles/${p.key}_tiles.png`],[f,'arena hazard',p.name,`art/arena/raw/hazards/${p.key}_hazard.png`]);});
 write(f,s);});
{let f='scenes/arena_scenes_C.md',s='# Linker Arena scenes, batch C: practice court and the Arena lobby\n\nNames marked "pending" are working titles. Confirm them before they appear in game text (CLAUDE.md: no new canon names without asking).\n';
 const [k,name,desc,hz,dmg]=EXTRA_ARENAS[0];
 s+=`\n## ${name}\n\n### Floor · save as \`art/arena/scenes/${k}_arena.jpg\`\n\n${q(floorPrompt(name,desc))}\n\n### Terrain tiles · save as \`art/arena/raw/tiles/${k}_tiles.png\`\n\n${q(tilesPrompt(name,dmg))}\n\n### Targets · save as \`art/arena/raw/hazards/${k}_hazard.png\`\n\n${q(hazardPrompt(name,hz))}\n`;
 TRACK.push([f,'arena floor','Court',`art/arena/scenes/${k}_arena.jpg`],[f,'arena tiles','Court',`art/arena/raw/tiles/${k}_tiles.png`],[f,'arena hazard','Court',`art/arena/raw/hazards/${k}_hazard.png`]);
 s+=`\n## Arena lobby, exterior · save as \`art/arena/scenes/lobby_exterior.png\`\n\nA building for the Dustmere map. Use the same rules as \`docs/RENDER_PROMPTS_MISSING_SCENES.md\` (64 px per tile, 2-tile red double doors with open ground in front).\n\n${q(['Top-down 3/4 view pixel-art game building for the Alienmon town of Dustmere: a round cream-and-sandstone arena dome about 6 tiles wide and 5 tiles tall, a wide brass-trimmed arch over red double doors (2 tiles wide) at the bottom center, glowing cyan light strips around the dome, two purple Linker League banners with the gold ringed-planet emblem, a small scoreboard-like panel above the door showing only abstract shapes (no letters), cactus planters either side.','Canvas 1024x1024 on flat pure white #FFFFFF so it can be cut out. Only the building and its doorstep, no road, no people.',ENV_STYLE,AVOID].join('\n'))}\n`;
 s+=`\n## Arena lobby, interior · save as \`art/arena/scenes/lobby_interior.png\`\n\n${q(['Top-down 3/4 view pixel-art game room, 1254x1254 (about 20x20 tiles at 64 px): the inside of the Dustmere arena lobby. A sign-up counter with brass trim at the top center, a big wall screen showing an abstract bracket diagram (no letters), a trophy cabinet with gem-like trophies, benches, a purple carpet path from the doormat at the bottom center (2 tiles wide, clear floor above it) to the counter, two arched doorways left and right labelled only by glowing icons (a crossed-swords-like double chevron and a star), potted magenta palms.','No people or creatures. Floors clearly walkable, furniture clearly solid.',ENV_STYLE,AVOID].join('\n'))}\n`;
 TRACK.push([f,'building','Arena lobby exterior','art/arena/scenes/lobby_exterior.png'],[f,'room','Arena lobby interior','art/arena/scenes/lobby_interior.png']);
 write(f,s);}

// ---------- 3. Attack effects ----------
function fxPrompt(name,type,shape,pic){const tx=TYPE[type],sh=SHAPE[shape];return [
 `Attack effect sprite sheet for the move "${name}" (${type} type): ${pic}. In the arena it is ${sh.what}.`,
 `Canvas 1536x1024 on a fully TRANSPARENT background (if transparency is not possible, use flat pure ${tx.key==='#00FF00'?'green':'magenta'} ${tx.key}, a color that never appears in the effect). A 4-column x 2-row grid of equal 384x512 cells.`,
 `Row 1: ${sh.row1}.`,
 'Row 2: 4 frames of the impact burst when it hits, from a small flash to the biggest burst to fading sparks, centered in each cell.',
 `Colors: ${tx.col}. Visual language: ${tx.look}.`,
 'Each frame is centered in its cell, and nothing crosses a cell edge except tileable beam or arc segments, which touch the left and right edges exactly. No grid lines, no labels.',
 FX_STYLE,AVOID].join('\n')}
const fxGroups=[['Plasma','Hydro','Bio','Volt'],['Cryo','Magma','Toxin','Swarm'],['Alloy','Crystal','Psi'],['Sonic','Gravity','Void']];
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
fxGroups.forEach((g,gi)=>{
 const f=`fx/fx_batch_${gi+1}_${g.map(t=>t.toLowerCase()).join('_')}.md`;
 let s=`# Linker Arena attack effects, batch ${gi+1}: ${g.join(', ')}\n\nOne sheet per type move (every Alienmon of that type shares it). ${gi===0?'**Render this batch first:** these are the starter and Zib types.':''}\n\n| Type | Move | Arena shape | Save as |\n|---|---|---|---|\n`;
 g.forEach(t=>MOVES[t].forEach(([n,sh])=>s+=`| ${t} | ${n} | ${sh} | \`art/arena/raw/fx/${slug(n)}.png\` |\n`));
 s+='\n---\n';
 g.forEach(t=>{s+=`\n## ${t}\n`;MOVES[t].forEach(([n,sh,pic])=>{
  s+=`\n### ${n} · ${sh} · save as \`art/arena/raw/fx/${slug(n)}.png\`\n\n${q(fxPrompt(n,t,sh,pic))}\n`;
  TRACK.push([f,'move fx',n,`art/arena/raw/fx/${slug(n)}.png`]);});});
 write(f,s);});
[[0,15],[15,30]].forEach(([a,b],i)=>{
 const f=`fx/fx_batch_${5+i}_signature_${i+1}.md`;
 let s=`# Linker Arena attack effects, batch ${5+i}: signature moves ${a+1}-${b}\n\n| Move | Type | Used by | Arena shape | Save as |\n|---|---|---|---|---|\n`;
 const rows=core.signature_moves.slice(a,b).map((m,j)=>[a+j,m]);
 rows.forEach(([k,m])=>s+=`| ${m.n} | ${m.t} | ${(sigOwners[k]||['(unassigned)']).join(', ')} | ${SIG_SHAPE[k][0]} | \`art/arena/raw/fx/sig_${slug(m.n)}.png\` |\n`);
 s+='\n---\n';
 rows.forEach(([k,m])=>{const [sh,pic]=SIG_SHAPE[k];
  s+=`\n### ${m.n} (${m.t}) · ${sh} · save as \`art/arena/raw/fx/sig_${slug(m.n)}.png\`\nUsed by: ${(sigOwners[k]||['(unassigned)']).join(', ')}. Signature moves are bigger and more ornate than type moves.\n\n${q(fxPrompt(m.n,m.t,sh,pic+', grander and more detailed than an ordinary move'))}\n`;
  TRACK.push([f,'signature fx',m.n,`art/arena/raw/fx/sig_${slug(m.n)}.png`]);});
 write(f,s);});
{const f='fx/fx_batch_7_common_and_status.md';
 const C=[
 ['hit_normal','Hit sparks','Row 1: a normal hit, 4 frames of a white-and-yellow star-shaped impact flash. Row 2: a SUPER-EFFECTIVE hit, 4 frames of a bigger, brighter orange-and-gold impact with extra rays.'],
 ['hit_weak','Resisted hit and critical hit','Row 1: a RESISTED hit, 4 frames of a small dull grey-blue puff. Row 2: a CRITICAL hit, 4 frames of a sharp gold star burst with four long rays.'],
 ['status_burn_poison','Status: burn and poison','Row 1: BURN, 4 frames looping of small orange flames flickering upward around an EMPTY center (drawn over the creature). Row 2: POISON, 4 frames looping of lime-and-purple bubbles rising around an empty center.'],
 ['status_shock_freeze','Status: shock and freeze','Row 1: SHOCK, 4 frames looping of yellow-and-cyan sparks crackling around an empty center. Row 2: FREEZE, 4 frames of an ice block forming: frame 1 frost creeping in, frames 2-3 a clear pale-blue ice crystal shell around an empty center, frame 4 the ice shattering into shards.'],
 ['status_confuse_ko','Status: confusion and KO','Row 1: CONFUSION, 4 frames looping of three small pink-and-yellow swirl stars orbiting in a little ring (sits above a creature\'s head). Row 2: KO POOF, 4 frames of a cartoon dust cloud puffing out with tiny stars (when an Alienmon is knocked out; kid-friendly).'],
 ['buffs','Stat up and stat down','Row 1: STAT UP, 4 frames looping of bright cyan upward chevrons rising around an empty center. Row 2: STAT DOWN, 4 frames looping of dull red downward chevrons sinking around an empty center.'],
 ['heal_shield','Heal and shield','Row 1: HEAL, 4 frames of soft green-and-white sparkles and plus-shaped glints rising around an empty center. Row 2: SHIELD, 4 frames of a hexagonal cyan bubble shield flashing on and fading (used by Sturdy Core and similar Traits).'],
 ['movement','Movement','Row 1: DASH DUST, 4 frames of a small dust puff and speed lines trailing LEFT. Row 2: FOOTSTEP DUST, 4 frames of a tiny puff of dust at ground level, seen from top-down 3/4.'],
 ['release','Linker release and recall','Row 1: RELEASE, 4 frames of a cyan-and-gold beam of light landing on the ground and flaring into a ring (an Alienmon entering the arena from its Linker). Row 2: RECALL, 4 frames of the same light shrinking upward into a thin beam.'],
 ['trait_telegraph','Trait trigger and attack warning','Row 1: TRAIT TRIGGER, 4 frames of a bright gold ring flash with a small sparkle (shown when a Trait activates). Row 2: WARNING MARKER, 4 frames looping of a red-orange target ring on the ground, seen from top-down 3/4, pulsing (shown where a heavy attack will land).']];
 let s='# Linker Arena effects, batch 7: common effects and status\n\nShared by every Alienmon, so render these early (they are needed for Phase 1).\n\n| Sheet | Save as |\n|---|---|\n';
 C.forEach(([k,n])=>s+=`| ${n} | \`art/arena/raw/fx/common_${k}.png\` |\n`);s+='\n---\n';
 C.forEach(([k,n,rows])=>{s+=`\n### ${n} · save as \`art/arena/raw/fx/common_${k}.png\`\n\n${q([`Effect sprite sheet for the Alienmon arena: ${n.toLowerCase()}.`,'Canvas 1536x1024 on a fully TRANSPARENT background (if transparency is not possible, use flat pure magenta #FF00FF). A 4-column x 2-row grid of equal 384x512 cells, each frame centered, nothing crossing a cell edge, no grid lines, no labels.',rows,FX_STYLE,AVOID].join('\n'))}\n`;
  TRACK.push([f,'common fx',n,`art/arena/raw/fx/common_${k}.png`]);});
 write(f,s);}

// ---------- 4. UI ----------
{const f='ui/ui_batch_1.md';
 const UI_STYLE='Pixel art game UI in the Alienmon style: chunky pixel frames, brass and gold trim, deep purple panels, glowing cyan accents, crisp 1-pixel dark outlines, no blur, no gradients beyond 3-4 flat tones.';
 const U=[
 ['logo','Arena logo (title pending owner approval)','Canvas 1536x1024 on flat pure white #FFFFFF. The game logo text "LINKER ARENA" in big chunky pixel letters, gold with a brass outline and a cyan inner glow, the gold ringed-planet emblem behind the letters, two small crossed energy streaks (one orange, one cyan) behind it. This is the only image in the pack that may contain text. Spell the text exactly: LINKER ARENA.'],
 ['type_icons','Type icons','Canvas 1536x1024 on a TRANSPARENT background. A 7-column x 2-row grid of equal round badge icons, each about 160x160, one per type, in this order. Row 1: Plasma (orange flame), Hydro (blue droplet), Bio (green leaf-sprout), Volt (yellow bolt), Cryo (ice-blue snowflake), Magma (red-orange volcano), Toxin (lime drip with purple bubble). Row 2: Swarm (amber hex with a tiny wing), Alloy (steel gear), Crystal (magenta gem), Psi (pink ring with a star), Sonic (teal sound rings), Gravity (brown rock with orbit line), Void (violet ring around black). Each badge has a dark outline and a lighter rim. No text.'],
 ['move_buttons','Move buttons and cooldown','Canvas 1536x1024 on a TRANSPARENT background. Row 1: four round touch buttons about 220x220 each, deep purple with brass rims and an empty center (the type icon is drawn on top by the game), in four states: ready (cyan glow ring), pressed (pushed in, darker), cooling down (greyed with a dark pie-wedge sweep showing about one third left), locked (grey with a small padlock-like bar). Row 2: a round analog-stick base and knob for touch movement, a small "swap partner" button with two curved arrows, and a pause button with two bars. No text.'],
 ['hud','HUD panels','Canvas 1536x1024 on a TRANSPARENT background. Row 1: a wide player HUD panel (about 700x160) with a square portrait frame on the left, a long empty HP bar slot, a thinner empty bar under it for the special meter, and three small round team slots; and the same panel mirrored for the opponent. Row 2: separate HP bar fills in green, yellow and red as horizontal strips; a round match timer frame; a small round-counter with three empty pips. All frames empty, no numbers, no text.'],
 ['countdown','Round countdown and banners','Canvas 1536x1024 on a TRANSPARENT background. Big chunky pixel-art banner words, gold with brass outlines and cyan glow, laid out in a 3x2 grid: "3", "2", "1", "GO!", "KO!", "TIME!". This sheet may contain exactly these words and numbers and nothing else. Spell them exactly.'],
 ['results','Result banners','Canvas 1536x1024 on a TRANSPARENT background. Three wide ribbon banners stacked: "VICTORY!" in gold and purple, "TRY AGAIN!" in cyan and silver (friendly, not harsh, for kids), "DRAW" in silver. This sheet may contain exactly these words and nothing else. Spell them exactly.'],
 ['cups','Cup emblems (cup names pending owner approval)','Canvas 1536x1024 on a TRANSPARENT background. A 3x2 grid of six round cup emblems, each about 360x360 with a brass rim: Dust Cup (orange sandstone with a canyon), Tide Cup (blue waves), Volt Cup (yellow bolt on neon), Frost Cup (pale-blue snowflake), Nebula Cup (purple swirl with stars), Prime Cup (gold ringed-planet emblem with a crown of light). No text.'],
 ['trophies','Trophies','Canvas 1536x1024 on flat pure white #FFFFFF. Four trophies in a row, each about 300 px tall: bronze, silver, gold and prismatic (shifting magenta-cyan crystal), each a cup shape with a small ringed planet on top and a sandstone base. No text.'],
 ['mode_cards','Mode select cards','Canvas 1536x1024. A 3x2 grid of six game menu cards, each about 480x460 with a brass frame and a deep purple background, each showing one simple scene with abstract silhouettes of creatures (not any real Alienmon): 1v1 (two creature silhouettes facing off), Tag 3v3 (two rows of three silhouettes), Free-for-All (five silhouettes in a ring), Cups (a trophy on a podium), Battle Codes (a glowing code card passing between two Linker wristwatches), Training (a target pad). No text: the game prints the titles.'],
 ['results_bg','Results screen backdrop','Canvas 1536x1024. A celebratory podium stage inside the Linker League arena: a three-step podium (gold center, silver left, bronze right) in sandstone and brass, purple banners with the gold ringed-planet emblem, confetti in cyan and gold, spotlight beams, empty podium tops (the game places the Alienmon). No people, no text.']];
 let s=`# Linker Arena UI, batch 1\n\nUI is rendered big and scaled down by the game. Text appears only on the logo, countdown and result sheets; every other sheet must have no text.\n\n| Sheet | Save as |\n|---|---|\n`;
 U.forEach(([k,n])=>s+=`| ${n} | \`art/arena/ui/${k}.png\` |\n`);s+='\n---\n';
 U.forEach(([k,n,body])=>{const noText=!['logo','countdown','results'].includes(k);
  s+=`\n### ${n} · save as \`art/arena/ui/${k}.png\`\n\n${q([body,UI_STYLE,noText?AVOID:AVOID.replace('No text, letters, numbers, captions, watermarks or UI. ','No other text, captions or watermarks. ')].join('\n'))}\n`;
  TRACK.push([f,'ui',n,`art/arena/ui/${k}.png`]);});
 write(f,s);}

// ---------- 5. extra renders the pack depends on ----------
{const f='sprites/sprites_extra.md';const miss=D.filter(m=>has(`art/sprites/${m.name}.png`)&&!has(`art/sprites_back/${m.name}.png`));
 let s='# Extra renders: missing back sprites\n\nThe arena shows the back sprite when an Alienmon walks up the screen. These Alienmon have no back sprite yet.\n';
 miss.forEach(m=>{s+=`\n## ${pad(m.n)} ${m.name} · save as \`art/raw/${m.name}_back.png\`, then process into \`art/sprites_back/${m.name}.png\`\n\n${q([`Back view of the Alienmon "${m.name}" (${m.t.join(' / ')} type). Use the attached reference sprite (\`art/sprites/${m.name}.png\`) as the exact design: same body, colors and markings, now seen from behind and slightly above, 3/4 back view facing slightly RIGHT and away from the viewer.`,`What it looks like: ${m.lore}`,SPRITE_STYLE+' Full body visible, centered, filling about 80% of the frame. Pure flat white #FFFFFF background: no shadow, no ground, no glow halo, no vignette.',AVOID].join('\n'))}\n`;
  TRACK.push([f,'back sprite',m.name,`art/sprites_back/${m.name}.png`]);});
 write(f,s);}

// ---------- tracker ----------
const csv=['batch_file,kind,name,output,status',...TRACK.map(r=>[...r,has(r[3])?'done':'todo'].map(v=>/[",]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v).join(','))].join('\n')+'\n';
fs.writeFileSync(path.join(root,'docs/arena/render_tracker.csv'),csv);
const by={};TRACK.forEach(r=>by[r[1]]=(by[r[1]]||0)+1);
console.log('renders:',TRACK.length,JSON.stringify(by));
