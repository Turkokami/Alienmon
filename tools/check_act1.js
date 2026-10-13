// Act 1 must not hint at the Seedmother's truth (Seedmother Revision 2): no Act 1 dialogue, quest text, journal entry,
// story scene, sign or townsperson line may mention the Heartroot, the prophecy or "scattered".
// Act 1 = the Prologue to Ch 8 (Book 1): main quests M01-M10, side quests on the Book 1 worlds, and those worlds' map sections.
// Usage: node tools/check_act1.js   (tools/build.js runs it and fails on a hit)
const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..');
const J=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
// "scattered" only counts next to her (Captain Marsh's logbook is "scattered to the wind" in Act 1 and that's fine)
const BAD={test:t=>/heartroot|prophec|piece of her|every species|project unity/i.test(t)||(/scattered/i.test(t)&&/seedmother|she|her|children|mother/i.test(t))};
const MAIN=['M01','M02','M03','M04','M05','M06','M07','M08','M09','M10'];
const SIDE_AREAS=new Set(['Dustara','Molten Frontier','Ferrox','Sporeholm','Thalassa','Neonis','Glyphos']);
const PLANETS=new Set(['dustara','ferrox','sporeholm','thalassa','neonis','glyphos']);
const SECS=new Set([...Array.from({length:81},(_,i)=>String(i+1).padStart(3,'0')),'167']);   // 001-081 (Dustara to Glyphos) and the ghost ship hold
const quests=J('data/quests.json').quests,act1=new Set(MAIN);
for(const q of quests)if(SIDE_AREAS.has(q.act)||q.id==='S53')act1.add(q.id);
const later=w=>w&&!act1.has(w);   // shown only after a quest outside Act 1
const hits=[];
function scan(where,v){if(typeof v==='string'){if(BAD.test(v))hits.push(where+': '+v.slice(0,110))}else if(Array.isArray(v))v.forEach((x,i)=>scan(where,x));else if(v&&typeof v==='object')for(const[k,x]of Object.entries(v))if(!['location','notes','map','note','id','type','target','prereq'].includes(k))scan(where,x)}
for(const q of quests)if(act1.has(q.id))scan('quest '+q.id,q);
for(const sc of J('data/story.json').scenes||[]){const w=sc.when||{};if(!SECS.has(sc.sec)||later(w.after)||later(w.active))continue;scan('scene '+sc.id,sc.lines)}
const npcFiles=[J('data/sections/npcs.json')];
const planetFiles=fs.readdirSync(path.join(root,'data/sections/planets')).map(f=>J('data/sections/planets/'+f));
for(const P of planetFiles)if(P.npcs)npcFiles.push(P.npcs);
for(const N of npcFiles)for(const[sec,L]of Object.entries(N)){if(!SECS.has(sec)||!Array.isArray(L))continue;for(const n of L)if(!later(n.after))scan('npc '+sec+' '+(n.name||n.art),[n.t,n.pre,n.keyline])}
const objFiles=[J('data/sections/links.json').objects||{}].concat(planetFiles.map(P=>P.objects||{}));
for(const O of objFiles)for(const[sec,L]of Object.entries(O))if(SECS.has(sec)&&Array.isArray(L))for(const o of L)scan('sign '+sec,[o.t,o.label]);
for(const p of J('data/batches/batch01_kessler/planets.json'))if(PLANETS.has(p.key))scan('planet '+p.key,[p.npc,p.tower,p.desc]);
if(hits.length){console.error('Act 1 hints at the Seedmother\'s truth (Revision 2 keeps it for Act 2):\n'+hits.join('\n'));process.exit(1)}
console.log('Act 1 canon OK');
