// Fails the build if a wild Alienmon is placed in a habitat it can't live in (data/encounters.json against data/habitat_rules.json),
// or if a world's wild pool holds a species that fits none of that world's habitats. Same rules as tools/habitat_rules.py.
// Usage: node tools/check_habitats.js
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'),J=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const H=J('data/habitat_rules.json'),E=J('data/encounters.json'),A=J('data/batches/batch01_kessler/alienmon.json'),P=J('data/batches/batch01_kessler/planets.json'),W=J('data/world.json').sections;
const FIRE=new Set(['volcanic','volcano','sun_forge','ash_trail']);
// 2 = strong fit (a native type), 1 = tolerated only, 0 = can't live there
function fit(types,hab){const h=H.habitats[hab];if(!h)return 0;let tol=h.tolerated;
 if(FIRE.has(hab)&&types.includes('Bio')){if(!types.some(t=>t==='Magma'||t==='Plasma'))return 0;tol=tol.concat(['Bio'])}
 for(const t of types){if((H.hard_bans[t]||[]).includes(hab))return 0;if(!h.native.includes(t)&&!tol.includes(t))return 0}
 return types.some(t=>h.native.includes(t))?2:1}
const names=new Set(A.map(m=>m.name)),bad=[];let slots=0;
for(const[sid,sec]of Object.entries(E)){if(!W[sid])bad.push(sid+': not a map section');
 for(const e of sec.encounters){slots++;if(!names.has(e.name))bad.push(`${sid} ${sec.name}: unknown Alienmon ${e.name}`);
  else if(!fit(e.types,sec.habitat))bad.push(`${sid} ${sec.name} (${sec.habitat}): ${e.name} ${e.types.join('/')}`);
  if(sec.planet==='Pyros'&&e.types.some(t=>t==='Hydro'||t==='Cryo'))bad.push(`water or ice type on Pyros: ${e.name}`)}}
const habs={};for(const sec of Object.values(H.sections))(habs[sec.planet.toLowerCase().replace(/ station| rift| array/,'')]||(habs[sec.planet.toLowerCase().replace(/ station| rift| array/,'')]=new Set())).add(sec.habitat);
for(const p of P){const hs=habs[p.key];if(!hs)continue;for(const t of['c','e','r'])for(const i of p.pool[t]){const m=A[i];if(m&&![...hs].some(h=>fit(m.t,h)))bad.push(`${p.name} wild pool: ${m.name} ${m.t.join('/')} fits none of ${[...hs].join(', ')}`)}}
if(bad.length){console.error('HABITAT ERRORS:\n'+bad.join('\n'));process.exit(1)}
console.log(`habitats OK: ${slots} encounter slots in ${Object.keys(E).length} sections`);
