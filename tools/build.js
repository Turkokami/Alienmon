// Merges every batch in data/batches into src/template.html -> www/index.html
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const core=JSON.parse(fs.readFileSync(path.join(root,'data/core_battle.json')));
const dirs=fs.readdirSync(path.join(root,'data/batches')).filter(d=>!d.startsWith('.')).sort();
let D=[],P=[],SYS=[];
for(const d of dirs){const b=path.join(root,'data/batches',d);
 const meta=JSON.parse(fs.readFileSync(path.join(b,'batch.json')));
 D=D.concat(JSON.parse(fs.readFileSync(path.join(b,'alienmon.json'))));
 P=P.concat(JSON.parse(fs.readFileSync(path.join(b,'planets.json'))));
 SYS.push({id:meta.system.id,name:meta.system.name,batch:meta.batch});
 console.log('batch',meta.batch,meta.system.name);}
const ART={};const sd=path.join(root,'art/sprites');
if(fs.existsSync(sd))for(const f of fs.readdirSync(sd).filter(f=>f.endsWith('.png')).sort())ART[f.slice(0,-4)]='data:image/png;base64,'+fs.readFileSync(path.join(sd,f)).toString('base64');
console.log('art sprites:',Object.keys(ART).length);
const ARTB={};const sb=path.join(root,'art/sprites_back');
if(fs.existsSync(sb))for(const f of fs.readdirSync(sb).filter(f=>f.endsWith('.png')).sort())ARTB[f.slice(0,-4)]='data:image/png;base64,'+fs.readFileSync(path.join(sb,f)).toString('base64');
console.log('back sprites:',Object.keys(ARTB).length);
const tp=path.join(root,'art/ui/title.jpg');const TITLE=fs.existsSync(tp)?'data:image/jpeg;base64,'+fs.readFileSync(tp).toString('base64'):'';
const ui=f=>{const p=path.join(root,'art/ui',f);return fs.existsSync(p)?'data:image/'+(f.endsWith('.png')?'png':'jpeg')+';base64,'+fs.readFileSync(p).toString('base64'):''};
const SHIP=ui('ship.png'),CUTS=[0,1,2].map(i=>ui('cut_'+i+'.jpg')).filter(Boolean);
const CHAR={};const cd=path.join(root,'art/characters');
if(fs.existsSync(cd))for(const f of fs.readdirSync(cd).filter(f=>f.endsWith('.png')).sort())CHAR[f.slice(0,-4)]='data:image/png;base64,'+fs.readFileSync(path.join(cd,f)).toString('base64');
const SCN={};const sd2=path.join(root,'art/scenes');
if(fs.existsSync(sd2))for(const f of fs.readdirSync(sd2).filter(f=>f.endsWith('.jpg')).sort())SCN[f.slice(0,-4)]='data:image/jpeg;base64,'+fs.readFileSync(path.join(sd2,f)).toString('base64');
const FX={};const fd=path.join(root,'art/fx');
if(fs.existsSync(fd))for(const f of fs.readdirSync(fd).filter(f=>f.endsWith('.webp')).sort())FX[f.slice(0,-5)]='data:image/webp;base64,'+fs.readFileSync(path.join(fd,f)).toString('base64');
const PAINT=fs.existsSync(path.join(root,'data/painted_maps.json'))?fs.readFileSync(path.join(root,'data/painted_maps.json'),'utf8'):'{}';
const WORLDJ=fs.readFileSync(path.join(root,'data/world_map.json'),'utf8');
const WORLDIMG='data:image/webp;base64,'+fs.readFileSync(path.join(root,'art/world/molten_frontier.webp')).toString('base64');
const MUSIC='data:audio/mpeg;base64,'+fs.readFileSync(path.join(root,'audio/save_the_stars.mp3')).toString('base64');
const TITLEMUSIC='data:audio/mpeg;base64,'+fs.readFileSync(path.join(root,'audio/lets_go_alienmon_title.mp3')).toString('base64');
// planet sprites seen from space (art/planets/<planetKey>.png) and auto-wired planet scenes
const PLANART={};const pd=path.join(root,'art/planets');
if(fs.existsSync(pd))for(const f of fs.readdirSync(pd).filter(f=>f.endsWith('.png')).sort())PLANART[f.slice(0,-4)]='data:image/png;base64,'+fs.readFileSync(path.join(pd,f)).toString('base64');
for(const p of P){if(SCN[p.key+'_battle']){p.scene=p.key+'_battle';p.sceneFx=''}if(SCN[p.key+'_keyart'])p.landScene=p.key+'_keyart';}
const j=x=>JSON.stringify(x);
let html=fs.readFileSync(path.join(root,'src/template.html'),'utf8')
 .replace('__DATA__',j(D)).replace('__PLANETS__',j(P)).replace('__TRAITS__',j(core.traits)).replace('__SIGS__',j(core.signature_moves)).replace('__SYS__',j(SYS)).replace('__ART__',j(ART)).replace('__ARTB__',j(ARTB)).replace('__TITLE__',j(TITLE)).replace('__SHIP__',j(SHIP)).replace('__CUTS__',j(CUTS)).replace('__CHAR__',j(CHAR)).replace('__SCENES__',j(SCN)).replace('__FX__',j(FX)).replace('__PAINT__',PAINT).replace('__WORLD__',WORLDJ).replace('__WORLDIMG__',j(WORLDIMG)).replace('__MUSIC__',j(MUSIC)).replace('__TITLEMUSIC__',j(TITLEMUSIC)).replace('__PLANETART__',j(PLANART));
fs.mkdirSync(path.join(root,'www'),{recursive:true});
fs.writeFileSync(path.join(root,'www/index.html'),html);
console.log('Built www/index.html with',D.length,'Alienmon across',P.length,'planets.');
