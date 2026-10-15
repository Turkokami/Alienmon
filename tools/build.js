require('child_process').execSync('node '+JSON.stringify(require('path').join(__dirname,'check_names.js')),{stdio:'inherit'});   // old species names fail the build
require('child_process').execSync('node '+JSON.stringify(require('path').join(__dirname,'check_act1.js')),{stdio:'inherit'});
require('child_process').execSync('node '+JSON.stringify(require('path').join(__dirname,'check_habitats.js')),{stdio:'inherit'});   // every wild Alienmon must live in a habitat that suits its types   // Act 1 must not hint at the Seedmother's truth (Revision 2)
// Merges every batch in data/batches into src/template.html -> www/index.html
// Default (web): art and audio are written to www/assets/ under content-hashed names and the page loads them by URL,
// so browsers and the service worker can cache them forever. `node tools/build.js --inline` instead embeds everything
// as data: URIs in one self-contained www/index.html (the Android / Capacitor build and offline single-file copies).
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.join(__dirname,'..'),www=path.join(root,'www'),INLINE=process.argv.includes('--inline');
const core=JSON.parse(fs.readFileSync(path.join(root,'data/core_battle.json')));
const dirs=fs.readdirSync(path.join(root,'data/batches')).filter(d=>!d.startsWith('.')).sort();
let D=[],P=[],SYS=[];
for(const d of dirs){const b=path.join(root,'data/batches',d);
 const meta=JSON.parse(fs.readFileSync(path.join(b,'batch.json')));
 D=D.concat(JSON.parse(fs.readFileSync(path.join(b,'alienmon.json'))));
 P=P.concat(JSON.parse(fs.readFileSync(path.join(b,'planets.json'))));
 SYS.push({id:meta.system.id,name:meta.system.name,batch:meta.batch});
 console.log('batch',meta.batch,meta.system.name);}

const MIME={'.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.mp3':'audio/mpeg'};
const ASSETS=[];   // every emitted asset URL, for the service worker's offline download
const assetDir=path.join(www,'assets');
if(!INLINE){fs.rmSync(assetDir,{recursive:true,force:true});fs.mkdirSync(assetDir,{recursive:true})}
// one file -> a data: URI (inline build) or a cache-forever URL like assets/sprites/Zib.3f9a1c2e.png
function asset(rel){const p=path.join(root,rel);if(!fs.existsSync(p))return'';const buf=fs.readFileSync(p),ext=path.extname(rel);
 if(INLINE)return'data:'+MIME[ext]+';base64,'+buf.toString('base64');
 const h=crypto.createHash('sha1').update(buf).digest('hex').slice(0,8),out=path.join('assets',path.dirname(rel).replace(/^(art|audio)[\\/]?/,''),path.basename(rel,ext)+'.'+h+ext).split(path.sep).join('/');
 fs.mkdirSync(path.join(www,path.dirname(out)),{recursive:true});fs.writeFileSync(path.join(www,out),buf);ASSETS.push(out);return out}
// every file with this extension in a folder, keyed by file name without extension
function folder(dir,ext){const m={},p=path.join(root,dir);if(fs.existsSync(p))for(const f of fs.readdirSync(p).filter(f=>f.endsWith(ext)).sort())m[f.slice(0,-ext.length)]=asset(dir+'/'+f);return m}

const ART=folder('art/sprites','.png');console.log('art sprites:',Object.keys(ART).length);
const ARTB=folder('art/sprites_back','.png');console.log('back sprites:',Object.keys(ARTB).length);
const OW=folder('art/overworld','.png');
const TITLE=asset('art/ui/title.jpg');
const SHIP=asset('art/ui/ship.png'),CUTS=[0,1,2].map(i=>asset('art/ui/cut_'+i+'.jpg')).filter(Boolean);
const CHAR=folder('art/characters','.png');
const PORTRAITS=folder('art/portraits','.png');
const SPACEART=folder('art/space','.png');   // warp gate, asteroids, Helix patrol ships   // large speaker portraits for dialogue (from the character battle renders)
const SCN=folder('art/scenes','.jpg');
const FX=folder('art/fx','.webp');
const PAINT=fs.existsSync(path.join(root,'data/painted_maps.json'))?fs.readFileSync(path.join(root,'data/painted_maps.json'),'utf8'):'{}';
const WORLDJ=fs.readFileSync(path.join(root,'data/world_map.json'),'utf8');
const WORLDIMG=asset('art/world/molten_frontier.webp');
const MUSIC=asset('audio/save_the_stars.mp3');
const TITLEMUSIC=asset('audio/lets_go_alienmon_title.mp3');
const BATTLEMUSIC=asset('audio/battle_spark.mp3');
// planet sprites seen from space (art/planets/<planetKey>.png) and auto-wired planet scenes
const PLANART=folder('art/planets','.png');
for(const p of P){if(SCN[p.key+'_battle']){p.scene=p.key+'_battle';p.sceneFx=''}if(SCN[p.key+'_keyart'])p.landScene=p.key+'_keyart';}

const j=x=>JSON.stringify(x);
// public address used in share tags (Open Graph needs absolute URLs); override with SITE_URL for a custom domain
// private beta build (the Vercel project with PRIVATE_TESTING=1): shows a feedback link that emails FEEDBACK_EMAIL
// demo builds start fresh every time: the title screen offers New game only (set NEW_GAME_ONLY=0 to bring Continue back)
const NEWONLY=process.env.NEW_GAME_ONLY!=='0';
const BETA=process.env.PRIVATE_TESTING==='1'?{email:process.env.FEEDBACK_EMAIL||'turkokami@gmail.com'}:null;
const SITE=(process.env.SITE_URL||'https://alienmon.vercel.app').replace(/\/$/,'');
// the game's own page: alienmon.com serves the website and the game lives under /play/ (override with PLAY_URL)
const PLAY=(process.env.PLAY_URL||(/^https:\/\/(www\.)?alienmon\.com$/.test(SITE)?SITE+'/play/':SITE+'/'));
const BUILD=crypto.createHash('sha1').update(fs.readFileSync(path.join(root,'src/template.html'))).update(fs.readFileSync(path.join(root,'src/quests.js'))).update(fs.readFileSync(path.join(root,'src/progression.js'))).update(fs.readFileSync(path.join(root,'src/world.js'))).update(fs.readFileSync(path.join(root,'src/sections.js'))).update(fs.readFileSync(path.join(root,'src/extras.js'))).update(fs.readFileSync(path.join(root,'src/story.js'))).update(fs.readFileSync(path.join(root,'data/story.json'))).update(fluidDump()).update(['data/world.json',...(fs.existsSync(path.join(root,'data/collision'))?fs.readdirSync(path.join(root,'data/collision')).sort().map(f=>'data/collision/'+f):[])].filter(f=>fs.existsSync(path.join(root,f))).map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('')).update(j([D,P,PAINT,WORLDJ,ASSETS])).digest('hex').slice(0,10);
const fill={__DATA__:j(D),__PLANETS__:j(P),__TRAITS__:j(core.traits),__SIGS__:j(core.signature_moves),__SYS__:j(SYS),__ART__:j(ART),__ARTB__:j(ARTB),__OW__:j(OW),
 __TITLE__:j(TITLE),__SHIP__:j(SHIP),__CUTS__:j(CUTS),__CHAR__:j(CHAR),__PORTRAITS__:j(PORTRAITS),__SCENES__:j(SCN),__FX__:j(FX),__PAINT__:PAINT,__WORLD__:WORLDJ,__WORLDIMG__:j(WORLDIMG),
 __MUSIC__:j(MUSIC),__TITLEMUSIC__:j(TITLEMUSIC),__BATTLEMUSIC__:j(BATTLEMUSIC),__PLANETART__:j(PLANART),__BUILD__:j(BUILD),__INLINE__:j(INLINE),__SITE__:SITE,__PLAYURL__:PLAY,__BETA__:j(BETA),__NEWONLY__:j(NEWONLY),__MOVEFX__:fs.readFileSync(path.join(root,'data/moves_fx.json'),'utf8')};
// quests: the engine (src/quests.js) is filled in first and then inlined into the template
const QUESTS=JSON.parse(fs.readFileSync(path.join(root,'data/quests.json'),'utf8')).quests;
const qp=path.join(root,'data/quest_places.json'),QPLACE=fs.existsSync(qp)?fs.readFileSync(qp,'utf8'):'{}';
fill.__QUESTENGINE__=fs.readFileSync(path.join(root,'src/quests.js'),'utf8').replace(/__[A-Z]+__/g,k=>({__QUESTS__:j(QUESTS),__QPLACE__:QPLACE})[k]||k);
// progression (docs/PROGRESSION_AND_LEVELING.md): species curves/yields/evolutions, wild tables, Keeper and boss levels
const PROGJ=JSON.parse(fs.readFileSync(path.join(root,'data/progression.json'),'utf8'));
const PROGMIN={species:Object.fromEntries(Object.entries(PROGJ.species).map(([k,v])=>[k,{curve:v.curve,base_yield:v.base_yield,stage:v.stage,stages:v.stages,rarity:v.rarity,evolves:v.evolves,capture_mod:v.capture_mod}])),
 areas:Object.fromEntries(Object.entries(PROGJ.areas).map(([k,a])=>{const t=l=>l&&l.map(x=>({name:x.name,min:x.min,max:x.max,weight:x.weight}));return[k,{levels:a.levels,tier1:t(a.tier1),tier2_after_4_shards:t(a.tier2_after_4_shards),tier3_after_champion:t(a.tier3_after_champion),trainer_levels:a.trainer_levels,trainer_team_size:a.trainer_team_size}]})),
 keepers:PROGJ.keepers,bosses:PROGJ.bosses,rival:PROGJ.rival,legendaries:PROGJ.legendaries};
fill.__PROGENGINE__=fs.readFileSync(path.join(root,'src/progression.js'),'utf8').replace(/__PROGRESSION__/g,j(PROGMIN));
// world logic (docs/world/STORY_PROGRESSION_MASTER.md): gate messages and the ship rules
const WS=JSON.parse(fs.readFileSync(path.join(root,'data/world_state.json'),'utf8'));
const PEOPLE=fs.existsSync(path.join(root,'data/town_people.json'))?fs.readFileSync(path.join(root,'data/town_people.json'),'utf8'):'{}';
// section maps (data/world.json + data/collision/*.json): Gold/Crystal-style screens at 16 px per tile
const SECW=fs.existsSync(path.join(root,'data/world.json'))?JSON.parse(fs.readFileSync(path.join(root,'data/world.json'),'utf8')):{sections:{},arrival:{}};
// walk-behind props (tools/sections/pass_behind.py): those tiles become ':' and their cut-out is drawn over the player standing behind them
// props (data/sections/props_layout.json): {section:[{p:'01_dustara/44',x,y,h?,solid?}]}; x,y = top-left of the footprint (tiles),
// footprint = sprite width in tiles x h rows (default 1), solid props block it. Drawn bottom-aligned on the footprint, depth-sorted with people.
const PL_=fs.existsSync(path.join(root,'data/sections/props_layout.json'))?JSON.parse(fs.readFileSync(path.join(root,'data/sections/props_layout.json'),'utf8')):{},PROPS={};
function props(id,rows){const L=PL_[id];if(!L||!L.length)return rows;const R=rows.map(r=>r.split(''));PROPS[id]=[];
 for(const q of L){const f='art/props/'+q.p+'.png';if(!fs.existsSync(f))continue;const b=fs.readFileSync(f),pw=b.readUInt32BE(16),ph=b.readUInt32BE(20),w=q.w||Math.max(1,Math.round(pw/16)),h=q.h||1;
  PROPS[id].push([asset(f),q.x,q.y,w,h,pw,ph,q.ox||0]);if(q.solid!==false)for(let y=q.y;y<q.y+h;y++)for(let x=q.x;x<q.x+w;x++)if(R[y]&&R[y][x]!==undefined)R[y][x]='#'}
 return R.map(r=>r.join(''))}
const PB=fs.existsSync(path.join(root,'data/sections/pass_behind.json'))?JSON.parse(fs.readFileSync(path.join(root,'data/sections/pass_behind.json'),'utf8')):{},SECOV={};
function behind(id,rows){const p=PB[id];if(!p)return rows;const R=rows.map(r=>r.split(''));for(const[x,y]of p.tiles)if(R[y]&&R[y][x]==='#')R[y][x]=':';return R.map(r=>r.join(''))}
// habitat encounter tables (data/encounters.json): {section: {h: habitat, e: [[name, weight, min, max, method, time]]}} plus habitat descriptions
const ENCJ=JSON.parse(fs.readFileSync(path.join(root,'data/encounters.json'),'utf8')),HABJ=JSON.parse(fs.readFileSync(path.join(root,'data/habitat_rules.json'),'utf8'));
const ENC={s:{},h:{}};for(const[id,s]of Object.entries(ENCJ))ENC.s[id]={h:s.habitat,e:s.encounters.map(e=>[e.name,e.weight,e.levels[0],e.levels[1],e.method,e.time])};
for(const[k,h]of Object.entries(HABJ.habitats))ENC.h[k]=h.description;ENC.r={hab:Object.fromEntries(Object.entries(HABJ.habitats).map(([k,h])=>[k,[h.native,h.tolerated]])),ban:HABJ.hard_bans};
const SECIMG={},SECS={};for(const[id,sec]of Object.entries(SECW.sections)){const cp=path.join(root,'data/collision',id+'.json');if(!sec.img||!fs.existsSync(cp))continue;
 SECIMG[id]=asset(sec.img);SECS[id]={id,name:sec.name,planet:sec.planet,type:sec.type,tiles:sec.tiles,edges:sec.edges,warps:sec.warps,objects:sec.objects,spawns:sec.spawns,npcs:sec.npcs||[],mons:sec.mons||[],zone:sec.zone,pkey:sec.pkey,grid:sec.grid||null,parent:sec.parent||null,dir:sec.dir,rows:props(id,behind(id,fluids(id,JSON.parse(fs.readFileSync(cp,'utf8')).rows))),over:PB[id]?PB[id].pieces:null,props:PROPS[id]||null};
 const ov=path.join(root,'art/sections_over',id+'.png');if(PB[id]&&fs.existsSync(ov))SECOV[id]=asset('art/sections_over/'+id+'.png')}
// open water ('~', Hydro-skiff) and lava ('^', Heat Shield) marked per section in data/sections/fluids/<id>.json; never the outer ring
function fluids(id,rows){const f=path.join(root,'data/sections/fluids',id+'.json');if(!fs.existsSync(f))return rows;const F=JSON.parse(fs.readFileSync(f,'utf8')),R=rows.map(r=>r.split('')),H=R.length,W=R[0].length;
 for(const[k,ch]of[['water','~'],['lava','^']])for(const[x0,y0,x1,y1]of F[k]||[])for(let y=Math.max(1,y0);y<=Math.min(H-2,y1);y++)for(let x=Math.max(1,x0);x<=Math.min(W-2,x1);x++)if(R[y][x]==='#')R[y][x]=ch;return R.map(r=>r.join(''))}
function fluidDump(){const d=path.join(root,'data/sections/fluids');return fs.existsSync(d)?fs.readdirSync(d).sort().map(f=>fs.readFileSync(path.join(d,f),'utf8')).join(''):''}
console.log('section maps:',Object.keys(SECS).length);
fill.__SECENGINE__=(fs.readFileSync(path.join(root,'src/sections.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'src/extras.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'src/story.js'),'utf8')).replace(/__SWORLD__/g,j(SECS)).replace(/__SECIMG__/g,j(SECIMG)).replace(/__SECOV__/g,j(SECOV)).replace(/__ENC__/g,j(ENC)).replace(/__SECARRIVAL__/g,j(SECW.arrival||{})).replace(/__SECQ__/g,j(SECW.quest_spots||{})).replace(/__STASHART__/g,j([asset('art/ui/stash_closed.png'),asset('art/ui/stash_open.png')])).replace(/__STORY__/g,j(JSON.parse(fs.readFileSync(path.join(root,'data/story.json'),'utf8')))).replace(/__RENAMES__/g,j(JSON.parse(fs.readFileSync(path.join(root,'data/renames.json'),'utf8')))).replace(/__KNOCK__/g,j(fs.existsSync(path.join(root,'data/sections/knock_doors.json'))?JSON.parse(fs.readFileSync(path.join(root,'data/sections/knock_doors.json'),'utf8')):{}));
fill.__WORLDENGINE__=fs.readFileSync(path.join(root,'src/world.js'),'utf8').replace(/__WORLDSTATE__/g,j({gates:WS.gates,ship:WS.ship})).replace(/__PEOPLE__/g,PEOPLE).replace(/__SPACE__/g,j(SPACEART));
// function replacer: data can contain "$&"-style sequences that a string replacement would expand
let html=fs.readFileSync(path.join(root,'src/template.html'),'utf8').replace(/__[A-Z]+__/g,k=>k in fill?fill[k]:k);
fs.mkdirSync(www,{recursive:true});
fs.writeFileSync(path.join(www,'index.html'),html);
if(!INLINE)fs.writeFileSync(path.join(www,'asset-manifest.json'),j({build:BUILD,assets:ASSETS}));
// installable PWA: service worker, manifest, icons and the share image
const copy=(from,to)=>{fs.mkdirSync(path.dirname(path.join(www,to)),{recursive:true});fs.copyFileSync(path.join(root,from),path.join(www,to))};
for(const f of fs.readdirSync(path.join(root,'art/ui/icons')))copy('art/ui/icons/'+f,'icons/'+f);
copy('src/manifest.webmanifest','manifest.webmanifest');copy('art/ui/og.jpg','og.jpg');
if(!INLINE)fs.writeFileSync(path.join(www,'sw.js'),fs.readFileSync(path.join(root,'src/sw.js'),'utf8').replace(/__BUILD__/g,j(BUILD)));
const mb=b=>(b/1048576).toFixed(1)+' MB';
console.log('Built www/index.html ('+mb(Buffer.byteLength(html))+(INLINE?', everything inlined':', '+ASSETS.length+' assets in www/assets')+') with',D.length,'Alienmon across',P.length,'planets.');
