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
// planet sprites seen from space (art/planets/<planetKey>.png) and auto-wired planet scenes
const PLANART=folder('art/planets','.png');
for(const p of P){if(SCN[p.key+'_battle']){p.scene=p.key+'_battle';p.sceneFx=''}if(SCN[p.key+'_keyart'])p.landScene=p.key+'_keyart';}

const j=x=>JSON.stringify(x);
// public address used in share tags (Open Graph needs absolute URLs); override with SITE_URL for a custom domain
// private beta build (the Vercel project with PRIVATE_TESTING=1): shows a feedback link that emails FEEDBACK_EMAIL
const BETA=process.env.PRIVATE_TESTING==='1'?{email:process.env.FEEDBACK_EMAIL||'turkokami@gmail.com'}:null;
const SITE=(process.env.SITE_URL||'https://alienmon.vercel.app').replace(/\/$/,'');
const BUILD=crypto.createHash('sha1').update(fs.readFileSync(path.join(root,'src/template.html'))).update(fs.readFileSync(path.join(root,'src/quests.js'))).update(fs.readFileSync(path.join(root,'src/progression.js'))).update(fs.readFileSync(path.join(root,'src/world.js'))).update(j([D,P,PAINT,WORLDJ,ASSETS])).digest('hex').slice(0,10);
const fill={__DATA__:j(D),__PLANETS__:j(P),__TRAITS__:j(core.traits),__SIGS__:j(core.signature_moves),__SYS__:j(SYS),__ART__:j(ART),__ARTB__:j(ARTB),__OW__:j(OW),
 __TITLE__:j(TITLE),__SHIP__:j(SHIP),__CUTS__:j(CUTS),__CHAR__:j(CHAR),__PORTRAITS__:j(PORTRAITS),__SCENES__:j(SCN),__FX__:j(FX),__PAINT__:PAINT,__WORLD__:WORLDJ,__WORLDIMG__:j(WORLDIMG),
 __MUSIC__:j(MUSIC),__TITLEMUSIC__:j(TITLEMUSIC),__PLANETART__:j(PLANART),__BUILD__:j(BUILD),__INLINE__:j(INLINE),__SITE__:SITE,__BETA__:j(BETA)};
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
