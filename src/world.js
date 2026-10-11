/* ---------- world logic: data/world_state.json, rules in docs/world/STORY_PROGRESSION_MASTER.md ----------
   Gates, ship clearance, landing rules, who stands where at each story stage, wild-encounter gating and
   where you wake up after losing. Inlined by tools/build.js after the quest and progression engines. */
const WSTATE=__WORLDSTATE__;
const mDone=id=>!!(G&&G.quests&&G.quests[id]&&G.quests[id].state==='done');
const freeRoam=()=>!!(G&&G.opt&&G.opt.freeRoam);

/* Molten Frontier entrances, by world-map node (messages come from world_state.json -> gates) */
const GATE_OPEN={dustara:()=>mDone('M03'),ferrox:()=>mDone('M04')&&!!G.beaten.mf12,thalassa:()=>G.shards>=2,glyphos:()=>G.shards>=4&&mDone('M09'),
 pyros:()=>mDone('M10'),helix:()=>mDone('M12')&&!!G.beaten.mf7,space:()=>mDone('M13')||!!(G.key&&G.key.helix_keycard),umbra:()=>G.shards>=7,starfall:()=>mDone('M17')};
const gateOpen=k=>freeRoam()||!GATE_OPEN[k]||GATE_OPEN[k]();
const gateMsg=k=>(WSTATE.gates.find(g=>g.node===k)||{}).blocked_msg||'The way is sealed for now.';

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
function wildOK(name){const s=PROG.species[name]||{};if(s.rarity==='legendary'||s.rarity==='mythic'||name==='Lumivex')return false;
 if(SIG_GATE[name])return!!G.beaten[SIG_GATE[name]];
 if(['Vexhydra','Bronnix','Thornvoid'].includes(name))return mDone('M19');
 if(['Facetrix','Encorex','Pyrelyth','Bastionyx','Firstlight','Oblivite'].includes(name))return!!G.flags.champ;
 if(name==='Zib')return mDone('M05');return true}
const wildIds=list=>list.filter(id=>wildOK(D[id].name));

/* where you wake up after losing: the last Recovery Bay or Hut you used */
function noteHeal(){G.lastHeal=scene==='world'?{w:'bay'}:{p:(PL[G.planet]||PL[0]).key,pos:(G.ppos||[0,0]).slice()}}
function wakeAtLastHeal(){const h=G.lastHeal;
 if(h&&h.w){B=null;toWorld(h.w);return}
 const key=h&&h.p||'dustara',P=PAINT[key];G.planet=pidx(key);B=null;scene='planet';
 if(h&&h.pos)G.ppos=h.pos.slice();else if(P){const bay=P.hot.find(x=>x.k==='bay');G.ppos=bay?[bay.x,bay.y+(bay.ry||bay.r/1.6)+14]:P.start.slice()}}

/* who stands where at each story stage (world_state.json -> npc_states) */
let W_BASE=null,P_BASE=null,PL_BASE=null,wSig='';
const near=(h,x,y,r=30)=>Math.hypot(h.x-x,h.y-y)<r;
function worldStage(){if(!G||!G.quests)return;worldBeats();const sig=QUESTS.filter(q=>q.type==='main'&&mDone(q.id)).length+'|'+G.shards+'|'+(G.flags.rift?1:0)+(G.flags.champ?1:0)+'|'+(freeRoam()?1:0);
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
  PAINT[k].hot=H}
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
function tryRun(){const e=EM();if(B.tr){say("You can't run from a trainer battle!");return}
 const r=(PROG.species[D[e.id].name]||{}).rarity;if(r==='legendary'||r==='mythic'){say('A powerful presence holds you in place!');return}
 B.runs=(B.runs||0)+1;const ps=es(PM(),'spe'),fs=Math.max(1,es(e,'spe')),ok=ps>=fs||((Math.floor(ps*128/fs)+30*B.runs)%256)>Math.floor(R()*256);
 turn(Object.assign(next=>{if(ok)say('Got away safely!',()=>{const back=B.from||'planet';B.over=true;QWILD=null;scene=back;B=null});else say("Couldn't get away!",next)},{pri:1}))}

// nicknames: offered after a capture, changed at Recovery Bays
function nickPrompt(m,cb){choose('Give '+D[m.id].name+' a nickname?',['Yes','No'],i=>{if(i===0){let v=null;try{v=window.prompt('Nickname for '+D[m.id].name+' (up to 12 letters):',m.nick||'')}catch(e){}
  v=(v||'').replace(/[^\w .'-]/g,'').trim().slice(0,12);if(v){m.nick=v;return say(D[m.id].name+' will be known as '+v+'!',cb)}}cb()},cb)}
function nickMenu(){choose('Nickname which Alienmon?',G.party.map(m=>nm(m)).concat(['Back']),i=>{if(i>=G.party.length)return bayMenu();nickPrompt(G.party[i],nickMenu)},bayMenu)}

// key items: their own Bag entries; can't be used up, sold or thrown away
const KEY_DESC={helix_keycard:'Opens the Fortress Shuttle Pad to Helix Station.',ystra_shardlet:'A sliver of Ystra that hums near the Seedmother.',seedmother_seed:'A seed from the Seedmother herself.',
 grapple_line:'Linker module: reach cliff ledges and shortcuts.',hydro_skiff:'Linker module: cross deep water.',heat_shield:'Linker module: walk lava-crossing shortcuts.',
 lumen_beacon:'Linker module: light dark caves.',gravity_lift:'Linker module: ride floating platforms.'};
const KEY_NAME={helix_keycard:'Helix Keycard',ystra_shardlet:'Ystra Shardlet',seedmother_seed:'Seedmother Seed',grapple_line:'Grapple Line',hydro_skiff:'Hydro-skiff',heat_shield:'Heat Shield',lumen_beacon:'Lumen Beacon',gravity_lift:'Gravity Lift'};
const keyList=()=>Object.keys(G.key||{}).filter(k=>G.key[k]).map(k=>({kind:'key',k,n:KEY_NAME[k]||k,c:1,d:KEY_DESC[k]||'A key item.'}));
// Linker Modules arrive with Signal Shards (they open optional areas only, never the main story)
const MODULES=[[2,'grapple_line'],[4,'hydro_skiff'],[5,'heat_shield'],[6,'lumen_beacon'],[7,'gravity_lift']];
function grantModules(){G.key=G.key||{};for(const[s,k]of MODULES)if(G.shards>=s&&!G.key[k]){G.key[k]=1;qNotify('MOD','module',['Your Linker resonates with the Shards. New module: '+KEY_NAME[k]+'!',KEY_DESC[k]])}}

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
