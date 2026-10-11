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
function worldBeats(){if(!G||!G.quests)return;
 if(mDone('M05')&&!G.flags.ship_clear){G.flags.ship_clear=1;qNotify('M05','ship',[WSTATE.ship.grant_text])}
 const F=PAINT.fortress;if(F){const post=mDone('M19');F.town=post?'Reclaimed Forge':'Helix Forge Fortress';
  if(post&&!F.hot.some(h=>h.k==='shop'))F.hot.push({x:600,y:560,r:24,k:'shop',hint:"Grub's shop",art:'grub',draw:true})}}
