/* ---------- world logic: data/world_state.json, rules in docs/world/STORY_PROGRESSION_MASTER.md ----------
   Gates, ship clearance, landing rules, who stands where at each story stage, wild-encounter gating and
   where you wake up after losing. Inlined by tools/build.js after the quest and progression engines. */
const WSTATE=__WORLDSTATE__;
const mDone=id=>!!(G&&G.quests&&G.quests[id]&&G.quests[id].state==='done');
// Free roam (skip the story locks) exists only in the private beta and local test builds
const canFreeRoam=()=>!!BETA||(!INLINE&&/^(localhost|127\.|\[::1\])/.test(location.hostname));   // the Android app (inline build) also runs on localhost: no free roam there
const freeRoam=()=>!!(G&&G.opt&&G.opt.freeRoam&&canFreeRoam());
// leaving a town: worlds joined to the Molten Frontier by a gate walk back through it; Helix Station uses its shuttle
const exitDoor=key=>key==='helix'?'space':(nodeOf(key)?key:null);

/* Molten Frontier entrances, by world-map node (messages come from world_state.json -> gates) */
const GATE_OPEN={dustara:()=>mDone('M03'),ferrox:()=>mDone('M04')&&!!G.beaten.mf12,thalassa:()=>G.shards>=2,glyphos:()=>G.shards>=4&&mDone('M09'),
 pyros:()=>mDone('M10'),helix:()=>mDone('M12')&&!!G.beaten.mf7,space:()=>mDone('M13')||!!(G.key&&G.key.helix_keycard),umbra:()=>G.shards>=7,starfall:()=>mDone('M17'),arena:()=>mDone('M05')};
const gateOpen=k=>freeRoam()||!GATE_OPEN[k]||GATE_OPEN[k]();
const gateMsg=k=>k==='arena'?'Shuttle tech: The Star Arena only flies out Linkers who hold a Signal Shard.':(WSTATE.gates.find(g=>g.node===k)||{}).blocked_msg||'The way is sealed for now.';

/* your own ship: launch clearance after the first Shard (M05); landing needs the world's requirement */
const shipOK=()=>freeRoam()||mDone('M05');
const SHIP_NO='Your ship needs launch clearance. Win your first Signal Shard.';
const LAND={dustara:()=>true,ferrox:()=>mDone('M04'),sporeholm:()=>G.shards>=1,thalassa:()=>G.shards>=2,neonis:()=>G.shards>=3,glyphos:()=>G.shards>=4,
 pyros:()=>G.shards>=4&&mDone('M10'),glacia:()=>G.shards>=5,helix:()=>mDone('M13'),halo:()=>G.shards>=6&&mDone('M15'),umbra:()=>G.shards>=7,
 starfall:()=>G.shards>=8&&mDone('M17'),apex:()=>!!G.flags.rift,ystra:()=>!!G.flags.champ};
const LAND_MSG={ferrox:'Ferrox control: Landing denied. Prove yourself on the Molten Frontier first.',helix:'Helix Station only accepts its own shuttles. Find a way through the Forge Fortress.',
 halo:'Halo traffic: The sky islands are closed to outsiders right now.',starfall:"The Rift's storm tears at your hull. You'll need all 8 Shards to get through.",
 apex:"Apex Array: Access by Quorum invitation only.",ystra:'The coordinates lead nowhere... yet.'};
const canLand=k=>freeRoam()||!LAND[k]||LAND[k]();
function landMsg(k){if(LAND_MSG[k])return LAND_MSG[k];const p=PL.find(x=>x.key===k);return p?p.name+' control: Landing denied. (Needs '+p.req.s+' Signal Shard'+(p.req.s===1?'':'s')+'.)':'Landing denied.'}

/* wild encounters: legendaries are story encounters only; signature Alienmon wait until their owner is beaten */
const SIG_GATE={Forgemaul:'ferrox',Mycora:'sporeholm',Anchorath:'thalassa',Bassquake:'neonis',Basaltor:'pyros',Glaciryx:'glacia',Mirrix:'halo',Reflix:'halo',Horizar:'umbra'};
function wildOK(name){const s=PROG.species[name]||{};if(s.rarity==='legendary'||s.rarity==='mythic')return false;if(name==='Lumivex')return!!(G.flags&&G.flags.champ);
 if(SIG_GATE[name])return!!G.beaten[SIG_GATE[name]];
 if(['Vexhydra','Bronnix','Thornvoid'].includes(name))return mDone('M19');
 if(['Facetrix','Encorex','Pyrelyth','Citadrake','Firstlight','Oblivite'].includes(name))return!!G.flags.champ;
 if(name==='Zib')return false;return true}   // Zib is one of a kind: never wild
const wildIds=list=>list.filter(id=>wildOK(D[id].name));

/* where you wake up after losing: the last Recovery Bay or Hut you used */
function noteHeal(){if(typeof secOn==='function'&&secOn()){secVisit(G.sec.id);G.lastHeal={sec:G.sec.id,at:[G.sec.x,G.sec.y],planet:G.planet,back:G.secBack||null};return}G.lastHeal=scene==='world'?{w:'bay'}:{p:(PL[G.planet]||PL[0]).key,pos:(G.ppos||[0,0]).slice()}}
function wakeAtLastHeal(){const h=G.lastHeal;
 // section maps: back to the last Recovery Bay counter you used, or home to Mom if you never healed anywhere
 if(h&&h.sec&&SWORLD[h.sec]){B=null;scene='planet';G.planet=h.planet;G.sub=null;G.secBack=h.back||null;enterSection(h.sec,h.at,'up');return}
 if(typeof secOn==='function'&&secOn()&&!(h&&h.p)){B=null;scene='planet';G.planet=pidx('dustara');G.sub=null;G.secBack=null;enterSection('001',SWORLD['001'].spawns.default,'up');return}
 if(G.sec)G.sec=null;
 if(h&&h.w){B=null;toWorld(h.w);return}
 const key=h&&h.p||'dustara',P=PAINT[key];G.planet=pidx(key);B=null;scene='planet';
 if(h&&h.pos)G.ppos=h.pos.slice();else if(P){const bay=P.hot.find(x=>x.k==='bay');G.ppos=bay?[bay.x,bay.y+(bay.ry||bay.r/1.6)+14]:P.start.slice()}}

/* who stands where at each story stage (world_state.json -> npc_states) */
let W_BASE=null,P_BASE=null,PL_BASE=null,wSig='';
const near=(h,x,y,r=30)=>Math.hypot(h.x-x,h.y-y)<r;
function worldStage(){if(!G||!G.quests)return;worldBeats();const sig=QUESTS.filter(q=>q.type==='main'&&mDone(q.id)).length+'|'+G.shards+'|'+(G.flags.rift?1:0)+(G.flags.champ?1:0)+'|'+(freeRoam()?1:0)+'|'+Object.keys(G.beaten).length+'|'+Object.keys(G.caught).length+'|'+JSON.stringify(G.legendGone||{});
 if(sig===wSig)return;wSig=sig;
 if(!W_BASE){W_BASE=JSON.parse(JSON.stringify(WORLD.npcs));P_BASE={};for(const k in PAINT)P_BASE[k]=JSON.parse(JSON.stringify(PAINT[k].hot));PL_BASE=PL.map(p=>p.npc)}
 // Molten Frontier
 const W=JSON.parse(JSON.stringify(W_BASE)),post=mDone('M19');
 for(const e of W){
  if(e.id==='mf7'&&post){e.k='talk';e.t=['Former Helix worker: Helix is finished. I just want to fix things now.']}
  if(e.id==='mf13'&&post)e.t=["Strand: You did it. The crater's quiet."];
  if(e.id==='mf8'&&post)e.t=['Technician: The crater pulse finally stopped.']}
 if(mDone('M11')&&!mDone('M13')){const q=QI.M13,l=(q.dialogue&&q.dialogue.start)||[];W.push({id:'grub_fortress',art:'grub',x:1000,y:300,k:'talk',t:l.length?l:['Grub: Psst. I used to work in that Forge. I know a way in.']})}
 WORLD.npcs.length=0;W.forEach(e=>WORLD.npcs.push(e));
 // towns
 for(const k in P_BASE){let H=JSON.parse(JSON.stringify(P_BASE[k]));
  if(k==='neonis'){H=H.filter(h=>!(near(h,1067,550)&&!mDone('M15'))&&!(near(h,307,518)&&!mDone('M07')));
   for(const h of H)if(near(h,1067,550)||near(h,307,518))h.draw=true}
  if(k==='dustara'){if(mDone('M07'))H=H.filter(h=>!(h.k==='npc'&&near(h,300,348)));
   if(post)H.push({x:1180,y:720,r:20,k:'talk',art:'teo',draw:true,t:["Teo: Home at last. Sola won't stop telling me about you."]},{x:1222,y:724,r:20,k:'talk',art:'sola',draw:true,t:['Sola: Dad\'s home. We did it, Linker.']})}
  addPeople(k,H);addRouteSign(k,H);PAINT[k].hot=H}
 // planet story NPC lines
 PL.forEach((p,i)=>{p.npc=PL_BASE[i];
  if(p.key==='dustara'){if(!mDone('M02'))p.npc="Dr. Vashti: Go find Zib's signal on the bridge!";else if(!mDone('M03'))p.npc="Dr. Vashti: Sola's waiting for you at the trading post!"}
  if(p.key==='apex'&&!mDone('M21'))p.npc='Marisol Fenn: The Quorum waits in four halls. Are you ready?'})}

/* the Helix Forge Fortress interior (a painted map entered from the Frontier; Reclaimed Forge after M19) */
function enterFortress(n){const pi=pidx('helix');G.planet=pi;G.sub='fortress';const P=PAINT.fortress;G.ppos=[P.start[0],P.exitY-30];face='up';
 cut(okI(SCI.helix_arena)?SCI.helix_arena:2,'Entering '+(mDone('M19')?'the Reclaimed Forge':n.n),()=>{scene='planet';banner=90})}
// leaving a sub-map goes back to its door on the Molten Frontier
const SUB_DOOR={fortress:'helix'};

// any Recovery Bay nurse repeats the current story step
function nurseTip(){const q=QUESTS.find(q=>q.type==='main'&&G.quests&&G.quests[q.id]&&G.quests[q.id].state==='active');return q?['Nurse: Your next step: '+qText(q)+'.']:[]}

// one-off story beats tied to stages
function worldBeats(){if(!G||!G.quests)return;grantModules();
 if(mDone('M05')&&!G.flags.ship_clear){G.flags.ship_clear=1;qNotify('M05','ship',[WSTATE.ship.grant_text])}
 const F=PAINT.fortress;if(F){const post=mDone('M19');F.town=post?'Reclaimed Forge':'Helix Forge Fortress';
  if(post&&!F.hot.some(h=>h.k==='shop'))F.hot.push({x:600,y:560,r:24,k:'shop',hint:"Grub's shop",art:'grub',draw:true})}}

/* Molten Frontier trainers: levels follow when the story sends you past them (their map zone alone would make
   Forge Miner Dax a Lv 31 Pyros trainer at M05). Species come from the matching world's tier-1 table. */
const FRONTIER_TR={mf4:{area:'dustara',lv:[5,7]},mf10:{area:'dustara',lv:[7,9]},mf12:{area:'ferrox',lv:[8,10]},mf6:{area:'ferrox',lv:[11,13]},mf7:{area:'glacia',lv:[32,34]}};
function frontierTeam(e){const f=FRONTIER_TR[e.id];if(!f)return null;const t=(PROG.areas[f.area].tier1||[]).filter(x=>wildOK(x.name)&&IDX[x.name]!=null),r=rng(hash(e.id));
 return[[IDX[t[Math.floor(r()*t.length)].name],f.lv[0]],[IDX[t[Math.floor(r()*t.length)].name],f.lv[1]]]}

/* ---------- core rules (docs/world/GAME_RULES_REFERENCE.md) ---------- */
// PP: 5-35 uses per move by power; restored by healing and Ether Gel; Struggle when every move is empty
function maxPP(mi){const m=MV[mi];if(!m)return 20;if(m.sig)return 5;const p=m.p||0;return!p?20:p<=40?35:p<=60?25:p<=80?20:p<=100?15:10}
const ppGet=(m,mi)=>m.ppm&&m.ppm[mi]!=null?m.ppm[mi]:maxPP(mi);
function ppUse(m,mi){m.ppm=m.ppm||{};m.ppm[mi]=Math.max(0,ppGet(m,mi)-1)}
const STRUGGLE={n:'Struggle',t:'None',p:50,a:100,fx:{},struggle:1};
// pick a usable move for the opponent (falls back to Struggle) and spend its PP
function ppPick(a,mv){let mi=MV.indexOf(mv);if(mi<0||ppGet(a,mi)<=0){mi=a.moves.find(x=>ppGet(a,x)>0);if(mi==null)return STRUGGLE;mv=MV[mi]}ppUse(a,mi);return mv}
function actPP(a,d,mv){const L=act(a,d,mv);if(mv.struggle&&a.hp>0){const r=Math.max(1,Math.floor(stat(a,0)/4));a.hp=Math.max(0,a.hp-r);L.push(nm(a)+' is hurt by recoil!');if(a.hp<=0)L.push(nm(a)+' fainted!')}return L}

// running away: classic odds; never from trainers, Keepers, bosses or legendaries
function tryRun(){const e=EM();if(B.sp&&B.sp.immortal){say('There is nowhere to run. Your team stands firm.');return}if(B.tr){say("You can't run from a trainer battle!");return}
 const r=(PROG.species[D[e.id].name]||{}).rarity;if(r==='legendary'||r==='mythic'){say('A powerful presence holds you in place!');return}
 B.runs=(B.runs||0)+1;const ps=es(PM(),'spe'),fs=Math.max(1,es(e,'spe')),ok=ps>=fs||((Math.floor(ps*128/fs)+30*B.runs)%256)>Math.floor(R()*256);
 turn(Object.assign(next=>{if(ok)say('Got away safely!',()=>{const back=B.from||'planet';B.over=true;QWILD=null;scene=back;B=null});else say("Couldn't get away!",next)},{pri:1}))}

// nicknames: offered after a capture, changed at Recovery Bays
function nickPrompt(m,cb){choose('Give '+D[m.id].name+' a nickname?',['Yes','No'],i=>{if(i===0){let v=null;try{v=window.prompt('Nickname for '+D[m.id].name+' (up to 12 letters):',m.nick||'')}catch(e){}
  v=(v||'').replace(/[^\w .'-]/g,'').trim().slice(0,12);if(v){m.nick=v;return say(D[m.id].name+' will be known as '+v+'!',cb)}}cb()},cb)}
function nickMenu(){choose('Nickname which Alienmon?',G.party.map(m=>nm(m)).concat(['Back']),i=>{if(i>=G.party.length)return bayMenu();nickPrompt(G.party[i],nickMenu)},bayMenu)}

// key items: their own Bag entries; can't be used up, sold or thrown away
const KEY_DESC={helix_keycard:'Opens the Fortress Shuttle Pad to Helix Station.',ystra_shardlet:'A sliver of Ystra that hums near the Heartroot.',seedmother_seed:'A seed from the new world-tree of the Seedmother.',
 grapple_line:'Linker module: reach cliff ledges and shortcuts.',hydro_skiff:'Linker module: cross deep water.',heat_shield:'Linker module: walk lava-crossing shortcuts.',
 lumen_beacon:'Linker module: light dark caves.',gravity_lift:'Linker module: ride floating platforms.'};
const KEY_NAME={helix_keycard:'Helix Keycard',ystra_shardlet:'Ystra Shardlet',seedmother_seed:'Seedmother Seed',grapple_line:'Grapple Line',hydro_skiff:'Hydro-skiff',heat_shield:'Heat Shield',lumen_beacon:'Lumen Beacon',gravity_lift:'Gravity Lift'};
const keyList=()=>Object.keys(G.key||{}).filter(k=>G.key[k]).map(k=>({kind:'key',k,n:KEY_NAME[k]||k,c:1,d:KEY_DESC[k]||'A key item.'}));
// Linker Modules arrive with Signal Shards (they open optional areas only, never the main story)
const MODULES=[[2,'grapple_line'],[4,'hydro_skiff'],[5,'heat_shield'],[6,'lumen_beacon'],[7,'gravity_lift']];
function grantModules(){G.key=G.key||{};for(const[s,k]of MODULES)if(G.shards>=s&&!G.key[k]){G.key[k]=1;qNotify('MOD','module',['Your Linker resonates with the Shards. New module: '+KEY_NAME[k]+'!',KEY_DESC[k]])}if(typeof extrasBeats==='function')extrasBeats()}

// autosave after story steps and Signal Shards (never mid-battle)
function autosave(){if(!G||!G.party||!G.party.length)return;if(scene==='battle'||CUT){G._as=1;return}G._as=0;if(save())toast('Saved')}
// first-time tips: one line, never blocks play
let TOAST=null;function toast(t){TOAST={t,n:150}}
const TIPS={bag:'Tip: Items heal between battles. Pods are for wild Alienmon only.',storage:'Tip: Your ship stores every Alienmon beyond 6. Swap them here.',map:'Tip: The Map shows every Relay Gate and world.',
 ship:'Tip: Fly between worlds. Each landing needs enough Signal Shards.',world:'Tip: B jumps. Grass and trails hide wild Alienmon.',town:'Tip: Press B to jump over small gaps and railings.'};
function tip(k){G.tips=G.tips||{};if(G.tips[k])return;G.tips[k]=1;toast(TIPS[k])}
function drawToast(){if(!TOAST)return;if(--TOAST.n<=0){TOAST=null;return}const s=TOAST.t,w=wrap(s,30);box(0,0,160,7+w.length*8,'#1b1424','#7dff6a');w.forEach((l,i)=>txt(l,3,3+i*8,'#7dff6a',6))}

// text speed: instant (default), fast or slow typing
const TEXT_SPD={instant:999,fast:3,slow:1};
const textSpeed=()=>TEXT_SPD[G&&G.opt&&G.opt.text||'instant']||999;

const volMul=()=>[0.5,1,1.6][G&&G.opt&&G.opt.vol!=null?G.opt.vol:1];

/* ---------- town population: trainers with line of sight, apprentices, townsfolk, fixed legendaries ---------- */
const PEOPLE=__PEOPLE__;   // tools/place_people.py -> data/town_people.json
function addPeople(k,H){const P=PEOPLE[k];if(!P)return;
 for(const t of P.trainers)H.push({k:'trainer',id:t.id,x:t.x,y:t.y,r:16,art:t.art,draw:true,face:t.face,cls:t.cls,name:t.name,app:t.app,route:t.route});
 for(const f of P.folk)H.push({k:'talk',x:f.x,y:f.y,r:16,art:f.art,draw:true,t:f.t});
 for(const l of P.legends)if(G.flags.champ&&legendHere(l.mon))H.push({k:'mon',legend:1,mon:l.mon,lvl:l.lv,x:l.x,y:l.y,r:22});
 optReward(k,H)}
// a legendary you defeated (rather than caught) comes back after the next Shard or postgame quest
const progSig=()=>G.shards+':'+QUESTS.filter(q=>/^P/.test(q.id)&&mDone(q.id)).length;
function legendHere(name){const id=IDX[name];if(id==null||G.caught[id])return false;return(G.legendGone||{})[name]!==progSig()}
// trainer teams: size by the world's level band, levels and species from progression.json
function townTrainer(h){const key=(PL[G.planet]||{}).key,a=PROG.areas[key]||{},tl=a.trainer_levels||a.levels||[5,8],hi=tl[1];
 const size=hi<=15?[1,2]:hi<=35?[2,3]:[3,4],r=rng(hash(h.id)),n=h.app?size[1]:size[0]+Math.floor(r()*(size[1]-size[0]+1));
 const t=(wildTable(key)||[]).filter(x=>wildOK(x.name)&&IDX[x.name]!=null);
 const team=Array.from({length:n},(_,i)=>[IDX[t.length?t[Math.floor(r()*t.length)].name:'Fizzle'],(h.app?Math.max(tl[0],hi-2):Math.max(tl[0],Math.min(hi,tl[0]+Math.floor(r()*(hi-tl[0]+1))+i)))+(h.route?2:0)]);
 return{name:h.cls+' '+h.name,art:h.art,intro:h.app?"You'll need to get past us to reach the Keeper!":"Our eyes met! That means a battle!",
  lose:h.app?'Go on, the Keeper is waiting.':'Wow, you two are in sync!',after:h.app?'The Keeper is just ahead.':'Good battle! Keep training out here.',team,bkey:h.id}}
function trainerTalk(h){const tr=townTrainer(h);if(G.beaten[h.id])return say(tr.name+': '+tr.after,null,h.art);
 if(!G.party.some(m=>m.hp>0))return say('Your team needs to heal first.');
 say(tr.name+': '+tr.intro,()=>startBattle(tr.team.map(([id,lv])=>mk(id,lv)),tr),h.art)}
// apprentices must be beaten before the Keeper will battle
function apprenticesLeft(){const k=(PL[G.planet]||{}).key;if(typeof secOn==='function'&&secOn()){const n=secApprentices(k);if(n!==null)return n}return((PEOPLE[k]||{}).trainers||[]).filter(t=>t.app&&!G.beaten[t.id]).length}
// line of sight: walking into a trainer's view triggers the battle
let SPOT=null;
function losCheck(P){if(SPOT||DLG||CH)return false;const[x,y]=G.ppos;
 for(const h of P.hot){if(h.k!=='trainer'||G.beaten[h.id]||!h.face)continue;const dx=x-h.x,dy=y-h.y,along=dx*h.face[0]+dy*h.face[1],side=Math.abs(dx*h.face[1]-dy*h.face[0]);
  if(along>10&&along<150&&side<20){SPOT={h,n:36};return true}}return false}
function spotTick(){if(!SPOT)return false;if(--SPOT.n<=0){const h=SPOT.h;SPOT=null;trainerTalk(h)}return true}
function drawSpot(cx,cy,S,cs){if(!SPOT)return;const h=SPOT.h,x=h.x*S-cx,y=h.y*S-cy-cs-8;box(Math.round(x-4),Math.round(y),9,10,'#fff','#1b1424');txt('!',Math.round(x-1),Math.round(y+2),'#d7262e',7)}
function legendBattle(h){if(!G.party.some(m=>m.hp>0))return say('Your team needs to heal first.');const id=IDX[h.mon];
 say('The air trembles... '+h.mon+' appears!',()=>startBattle([mk(id,h.lvl||60)],null))}
function noteLegendWin(e){const n=D[e.id].name,r=(PROG.species[n]||{}).rarity;if(r==='legendary'||r==='mythic'){G.legendGone=G.legendGone||{};G.legendGone[n]=progSig()}}

/* ---------- space: warp gate art, asteroid field, Helix patrols (until the Rift is sealed) ---------- */
const SPACE=__SPACE__,SPI=lazyImgs(SPACE);
// a fixed asteroid field, placed away from every planet
const ROIDS=(()=>{const r=rng(hash('asteroids')),out=[];for(let i=0;i<70&&out.length<34;i++){const x=Math.floor(r()*1700),y=Math.floor(r()*1200);
 if(PL.every(p=>Math.hypot(p.x-x,p.y-y)>p.r+70)&&Math.hypot(GATE.x-x,GATE.y-y)>90)out.push({x,y,k:'asteroid_'+Math.floor(r()*9),s:10+Math.floor(r()*14),sp:(r()-0.5)*0.02})}return out})();
// Helix patrol ships loop between worlds until M19
const PATROLS=[['helix','starfall'],['helix','pyros'],['umbra','helix']];
function drawSpaceDecor(camx,camy){
 for(const a of ROIDS){const x=a.x-camx,y=a.y-camy;if(x<-30||y<-30||x>190||y>175)continue;const im=SPI[a.k];if(!okI(im))continue;
  ctx.save();ctx.translate(x,y);ctx.rotate(frame*a.sp);ctx.drawImage(im,-a.s/2,-a.s/2,a.s,a.s);ctx.restore()}
 if(!mDone('M19'))PATROLS.forEach(([f,t],i)=>{const A=PL.find(p=>p.key===f),Z=PL.find(p=>p.key===t),u=(Math.sin(frame/(600+i*170)+i*2)+1)/2;
  const x=A.x+(Z.x-A.x)*u-camx,y=A.y+(Z.y-A.y)*u-camy;if(x<-30||y<-30||x>190||y>175)return;const im=SPI.helix_patrol;if(!okI(im))return;
  ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(Z.y-A.y,Z.x-A.x)*(Math.cos(frame/(600+i*170)+i*2)>0?1:-1)+Math.PI/2);ctx.drawImage(im,-9,-9,18,18);ctx.restore()})}
// the Warp Gate wakes up for the postgame finale (P04)
const gateLive=()=>{const s=G.quests&&G.quests.P04;return!!s&&s.state!=='locked'};
function drawWarpGate(gx,gy){const im=SPI[gateLive()?'warpgate_active':'warpgate_dormant'];if(!okI(im))return false;const z=34+(gateLive()?Math.sin(frame/20)*2:0);
 ctx.save();ctx.imageSmoothingEnabled=true;ctx.drawImage(im,Math.round(gx-z/2),Math.round(gy-z/2),z,z);ctx.restore();return true}

/* ---------- Linker Modules open optional areas: ground you can only reach by jumping ---------- */
const MOD_BIOME={dustara:'grapple_line',ferrox:'grapple_line',glyphos:'grapple_line',apex:'grapple_line',sporeholm:'hydro_skiff',thalassa:'hydro_skiff',
 pyros:'heat_shield',glacia:'lumen_beacon',umbra:'lumen_beacon',neonis:'gravity_lift',helix:'gravity_lift',halo:'gravity_lift',starfall:'gravity_lift',ystra:'gravity_lift'};
const OPT={};
// label walkable areas: 1 = reachable on foot from the landing point, 2+ = optional (jump-only) areas
function optInfo(key){if(OPT[key])return OPT[key];const P=PAINT[key];if(!P)return null;const W=P.w/P.cell,H=P.h/P.cell,lab=new Int16Array(W*H),bit=i=>(pmask(P,'walk')[i>>3]>>(i&7))&1;
 let n=0;const fill=(s,id)=>{const st=[s];lab[s]=id;let c=0,sx=0,sy=0;while(st.length){const i=st.pop();c++;sx+=i%W;sy+=Math.floor(i/W);for(const j of[i-1,i+1,i-W,i+W]){if(j<0||j>=W*H||lab[j]||!bit(j)||(Math.abs(j%W-i%W)>1))continue;lab[j]=id;st.push(j)}}return{c,cx:sx/c,cy:sy/c}};
 const s0=Math.floor((P.exitY-30)/P.cell)*W+Math.floor(P.start[0]/P.cell);fill(s0,1);const areas=[];
 for(let i=0;i<W*H;i++)if(!lab[i]&&bit(i)){n++;const a=fill(i,n+1);a.id=n+1;areas.push(a)}
 return OPT[key]={lab,W,areas}}
const optAt=(key,x,y)=>{const o=optInfo(key);if(!o)return 0;const P=PAINT[key],c=Math.floor(y/P.cell)*o.W+Math.floor(x/P.cell);return o.lab[c]>1?o.lab[c]:0};
function modOK(key,x,y){const m=MOD_BIOME[baseKey(key)];if(!m||freeRoam())return true;return!optAt(key,x,y)||!!(G.key&&G.key[m])}
// the largest optional area of each town holds a rare Alienmon (a reward for the module)
function optReward(k,H){const o=optInfo(k);if(!o||!o.areas.length)return;const a=o.areas.reduce((x,y)=>y.c>x.c?y:x);if(a.c<12)return;const P=PAINT[k];
 let best=null,bd=1e9;for(let i=0;i<o.lab.length;i++)if(o.lab[i]===a.id){const d=Math.hypot(i%o.W-a.cx,Math.floor(i/o.W)-a.cy);if(d<bd){bd=d;best=i}}
 const p=PL.find(x=>x.key===k),pool=(p?p.pool.r.concat(p.pool.e):[]).filter(id=>wildOK(D[id].name));if(!pool.length||best==null)return;
 H.push({k:'mon',mon:D[pool[hash(k)%pool.length]].name,x:(best%o.W)*P.cell+4,y:Math.floor(best/o.W)*P.cell+4,r:20,opt:1})}

/* ---------- day and night (device clock): some types prefer the dark, others the sun ---------- */
const isNight=()=>{const h=new Date().getHours();return h>=19||h<6};
// night: Void and Psi Alienmon come out (x3) and Bio/Plasma hide (x0.5); by day it is the other way round
function dayMul(name){const id=IDX[name];if(id==null)return 1;const t=D[id].t||[],n=isNight(),nite=t.includes('Void')||t.includes('Psi'),day=t.includes('Bio')||t.includes('Plasma');
 return(nite&&!day?(n?3:0.5):day&&!nite?(n?0.5:3):1)*(typeof evSwarm==='function'?evSwarm(name):1)}
function nightTint(){if(!isNight()||(G.opt&&G.opt.noNight))return;ctx.fillStyle='rgba(16,18,60,0.22)';ctx.fillRect(0,0,160,144)}

/* ---------- Xenodex: where a caught Alienmon lives ---------- */
function livesIn(id){if(typeof habitatsOf==='function'){const hs=habitatsOf(id);if(hs.length){const seen=new Set(),out=[];for(const h of hs){const k=h.name.replace(/ Part [AB]$| [0-9]F$| B[0-9]$/,'');if(!seen.has(k)){seen.add(k);out.push(k)}}return out}}const n=D[id].name,out=[];for(const k in PROG.areas){const a=PROG.areas[k];if(['tier1','tier2_after_4_shards','tier3_after_champion'].some(t=>(a[t]||[]).some(x=>x.name===n)))out.push((PL.find(p=>p.key===k)||{}).name||k)}return out}

/* ---------- three save slots (copies of the current game) ---------- */
const SLOT=i=>'alienmon_slot_'+i;
function slotMenu(){const info=[1,2,3].map(i=>{try{const g=JSON.parse(localStorage.getItem(SLOT(i))||'null');return g?'Slot '+i+': '+nm(g.party[0]||{id:0})+' Lv'+((g.party[0]||{}).lv||'?')+' ◆'+g.shards:'Slot '+i+': empty'}catch(e){return'Slot '+i+': empty'}});
 choose('Save slots',info.concat(['Back']),i=>{if(i>2)return;choose(info[i],['Save current game here','Load this slot','Cancel'],k=>{
  if(k===0){save();try{localStorage.setItem(SLOT(i+1),JSON.stringify(G));say('Saved to slot '+(i+1)+'.',slotMenu)}catch(e){say('Saving is unavailable in this browser.')}}
  if(k===1&&newOnly())return say('The demo always starts a fresh game, so loading saves is turned off.',slotMenu);
  if(k===1){const s=localStorage.getItem(SLOT(i+1));if(!s)return say('That slot is empty.',slotMenu);choose('Replace your current game?',['Load slot '+(i+1),'Cancel'],c=>{if(c===0){localStorage.setItem('alienmon_save_v2',s);say('Loading...',()=>location.reload())}})}})})}

/* ---------- small friendly Alienmon wandering beside the townsfolk (decoration, can't be caught) ---------- */
function drawDecor(cx,cy,S,ms){const k=(PL[G.planet]||{}).key;if(G.sub||!PEOPLE[k])return;const p=PL.find(x=>x.key===k),pool=p?p.pool.c:[];if(!pool.length)return;
 PEOPLE[k].folk.forEach((f,i)=>{const id=pool[(hash(k)+i)%pool.length],im=OWI[D[id].name];if(!okI(im))return;const t=frame/90+i*2.1,x=(f.x+30+Math.cos(t)*22)*S-cx,y=(f.y+10+Math.sin(t*1.3)*10)*S-cy;
  if(x<-20||x>180||y<-20||y>170)return;const z=Math.round(ms*0.75);ctx.drawImage(im,((frame>>4)&1)*64,0,64,64,Math.round(x-z/2),Math.round(y-z),z,z)})}

/* ---------- landmark reveal: the first time you approach a world's tower ---------- */
const TOWER_NAME={dustara:'The Crater Observatory',glyphos:'The Ancient Obelisk',ystra:'The Crystal Shrine',helix:"Vex's Containment Arena",starfall:'The Rift Spire',apex:'The Great Telescope'};
function landmarkFirst(p,then){G.lm=G.lm||{};const im=SCI[p.key+'_landmark'];if(G.lm[p.key]||!okI(im))return false;G.lm[p.key]=1;
 cut(im,TOWER_NAME[p.key]||(p.name+' Relay Tower'),then);return true}

/* ---------- regions: a second, wild area on each world, reached by a route sign in town ---------- */
const baseKey=k=>(k||'').replace(/_route$/,'');
const routeOf=k=>PAINT[k+'_route'];
function addRouteSign(k,H){const R=routeOf(k);if(R&&R.door)H.push({k:'route',x:R.door.x,y:R.door.y,r:16,hint:R.town})}
function enterRoute(k){const R=routeOf(k);if(!R)return;G.routeBack=G.ppos.slice();
 cut(okI(SCI[k+'_battle'])?SCI[k+'_battle']:2,'Heading into '+R.town,()=>{G.sub=k+'_route';G.ppos=[R.start[0],R.exitY-30];face='up';scene='planet';banner=90})}
function leaveRoute(){const k=baseKey(G.sub),P=PAINT[k];G.sub=null;scene='planet';banner=90;const d=routeOf(k).door;G.ppos=G.routeBack||[d.x,d.y+30];face='down'}
const inRoute=()=>!!(G.sub&&/_route$/.test(G.sub));
function drawRouteSigns(cx,cy,S){const P=paintOf();if(!P)return;for(const h of P.hot){if(h.k!=='route')continue;const x=Math.round(h.x*S-cx),y=Math.round(h.y*S-cy);if(x<-10||x>170||y<-20||y>150)continue;
 rect(x-1,y-10,2,10,'#6b4a2a');box(x-6,y-16,13,8,'#ffd23f','#1b1424');txt('>',x-2,y-15,'#1b1424',6)}}

/* ---------- wild levels follow the story: never far above where the player should be ---------- */
// the next Keeper's ace for each Shard count (progression pack), then the Rift and the postgame
const STAGE_CAP=[12,17,21,25,31,35,41,45,50];
// never above the player's strongest Alienmon (regions get +2 on the story cap, still never above the team)
function wildCap(extra){const lead=Math.max(1,...(G.party||[]).map(m=>m.lv)),stage=G.flags&&G.flags.champ?65:G.flags&&G.flags.rift?55:STAGE_CAP[Math.min(8,G.shards||0)];
 return Math.min(stage+(extra||0),lead)}
// species that evolve into each Alienmon (to swap in an earlier form when the level is too low for the evolved one)
const PREVO={};for(const n in PROG.species){const ev=PROG.species[n].evolves;if(ev&&ev.into&&/^Level/.test(ev.method||'Level'))PREVO[ev.into]={from:n,level:ev.level}}
function clampWild(id,lv,extra){const cap=wildCap(extra);if(lv>cap)lv=Math.max(2,cap-ri(0,2));
 let n=D[id].name;for(let i=0;i<3;i++){const p=PREVO[n];if(!p||lv>=p.level-1||IDX[p.from]==null)break;n=p.from}
 return[IDX[n],lv]}
// the form a visible wild Alienmon takes at the current cap (what's drawn is what you battle)
function shownMon(name,extra){const cap=wildCap(extra);let n=name;for(let i=0;i<3;i++){const p=PREVO[n];if(!p||cap>=p.level-1||IDX[p.from]==null)break;n=p.from}return n}
