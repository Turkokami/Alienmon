/* ---------- quests: data/quests.json, rules in docs/quests/QUEST_SYSTEM_SPEC.md ----------
   tools/build.js inlines this file into the game script. Everything here runs inside the game's own scope
   (G, D, PL, IDX, say, choose, startBattle, ...). Gameplay code reports what happened through qEvent();
   the engine decides which quest objectives that moves forward. */
const QUESTS=__QUESTS__,QI={};QUESTS.forEach(q=>QI[q.id]=q);
const QPLACE=__QPLACE__;   // where quest NPCs, props and trainers stand in each town (tools/place_quests.py)
const KEY_ITEMS={helix_keycard:'Helix Keycard',ystra_shardlet:'Ystra Shardlet',seedmother_seed:'Seedmother Seed'};
let QN=[];                 // quest messages waiting for a quiet moment to show
const qs=id=>G.quests[id];

// set up quest state for a new or loaded game (called from the main loop once G exists)
function qInit(){G.quests=G.quests||{};G.key=G.key||{};G.flags=G.flags||{};
 for(const q of QUESTS)if(!G.quests[q.id])G.quests[q.id]={state:'locked',step:0,n:0,got:[]};
 if(!G.qmig){G.qmig=1;qMigrate()}
 if(G.qtrack===undefined)G.qtrack=null;if(typeof storyMigrate==='function')storyMigrate();qUnlock()}

// older saves: credit what the player already did, without paying rewards twice
function qMigrate(){const done=id=>{const s=qs(id);if(s){s.state='done';s.step=QI[id].objectives.length}};
 if(G.party.length)done('M01');
 for(const q of QUESTS){const os=q.objectives;if(!os.length)continue;
  if(os.every(o=>(o.type==='defeat_keeper'&&G.beaten[o.target])||(o.type==='battle_trainer'&&!o.target.includes('|')&&G.beaten[o.target])))done(q.id)}}

const qPrereqsDone=q=>(q.prereq||[]).every(p=>qs(p)&&qs(p).state==='done');
// locked -> available once prerequisites are done; main quests start straight away
function qUnlock(){let again=true;while(again){again=false;
 for(const q of QUESTS){const s=qs(q.id);if(s.state==='locked'&&qPrereqsDone(q)){s.state='available';if(q.type==='main'){qActivate(q);again=true}}}}}

function qActivate(q){const s=qs(q.id);s.state='active';s.step=0;s.n=0;s.got=[];
 if(G.qtrack==null||!qs(G.qtrack)||qs(G.qtrack).state!=='active')G.qtrack=q.id;
 qNotify(q.id,'start',['New '+(q.type==='main'?'story quest':'side mission')+': '+q.title].concat(q.dialogue&&q.dialogue.start||[]));qPassive()}

const qObj=q=>q.objectives[qs(q.id).step];
const qActive=()=>QUESTS.filter(q=>qs(q.id).state==='active');

// which place the player is in, in the terms quests.json uses
function qHere(){return scene==='world'?'molten_frontier':(G.sub||(PL[G.planet]||{}).key)}
function qSameArea(loc){if(!loc)return false;if(typeof secOn==='function'&&secOn())return loc.sec===G.sec.id;const h=qHere();return loc.area==='molten_frontier'?h==='molten_frontier':(loc.planet&&loc.planet===h&&scene!=='world'&&scene!=='space')}
function qPos(){if(typeof secOn==='function'&&secOn())return[G.sec.x*16+8,G.sec.y*16+15];return scene==='world'?G.wpos:G.ppos}
// a quest location, moved onto walkable ground for the painted towns when tools/place_quests.py had to
const QPLACE_FIXED={'M13:1':{area:'fortress',planet:'fortress',x:768,y:222,spot:'Control room terminal'}};
function qLoc(qid,step,loc){if(typeof secOn==='function'&&secOn()){const sl=secQLoc(qid+':'+step,loc);if(sl)return sl}const p=QPLACE_FIXED[qid+':'+step]||QPLACE[qid+':'+step];return p?Object.assign({},loc,p):loc}

function qMatch(q,o,type,target,info){const t=o.type;
 switch(type){
  case'starter':return t==='choose_starter';
  case'talk':if(t==='talk'||t==='deliver'||t==='show'){if(o.target===target||target==='q:'+q.id)return true;const l=qLoc(q.id,qs(q.id).step,o.location);return!!(info.x!=null&&l&&l.x!=null&&qSameArea(l)&&Math.hypot(l.x-info.x,l.y-info.y)<(typeof secOn==='function'&&secOn()?8:56))}return false;
  case'visit':return(t==='visit'||t==='spot_event')&&o.target===target;
  case'prop':return(t==='examine'||t==='collect')&&o.target===target;
  case'catch':return(t==='catch'&&o.target===target)||t==='catch_any'||(t==='catch_type'&&(D[IDX[target]].t||[]).includes(o.target))||(t==='legendary_encounter'&&o.target===target);
  case'win':return(t==='win_battle'&&(o.target===target||o.target===info.area))||(t==='legendary_encounter'&&o.target===target);
  case'trainer':return(t==='battle_trainer'||t==='battle_rival'||t==='defeat_boss')&&(o.target===target||o.target.split('|').includes(target)||(o.target==='quorum_all_rematch'&&/^quorum_/.test(target)));
  case'keeper':return t==='defeat_keeper'&&o.target===target;
  case'use':return t==='use_item'&&o.target===target}
 return false}

// gameplay reports an event; returns true if it moved any quest forward
function qEvent(type,target,info){if(!G||!G.quests)return false;info=info||{};let hit=false;
 for(const q of qActive()){const o=qObj(q);if(!o||!qMatch(q,o,type,target,info))continue;
  if(o.type==='deliver'){const k=o.target;if(!(G.items[k]>0)){qNotify(q.id,'need',['You need a '+itemName(k)+' to hand over.']);continue}G.items[k]--}
  if(o.type==='show'){const ty=o.target.replace(/^(type|mon):/,''),sp=o.target.startsWith('mon:');if(!G.party.some(m=>sp?D[m.id].name===ty:(D[m.id].t||[]).includes(ty))){qNotify(q.id,'need',['Bring '+(sp?'a '+ty:'a '+ty+'-type Alienmon')+' in your party.']);continue}}
  hit=true;qProgress(q,1)}
 return hit}

function qProgress(q,n){const s=qs(q.id),o=qObj(q);s.n+=n;
 if(s.n>=(o.count||1)){s.step++;s.n=0;s.got=[];if(o.then)storyThen(q,o.then);
  if(s.step>=q.objectives.length)qComplete(q);
  else{qNotify(q.id,'step',['Objective complete! Next: '+qText(q)]);if(q.type==='main')autosave();qPassive()}}}

function itemName(k){const it=ITEMS.find(i=>i.k===k)||PODS.find(p=>p.k===k);return it?it.n:(KEY_ITEMS[k]||k)}
function qRewardText(r){const L=[];if(r.dust)L.push(r.dust+' stardust');for(const k in r.items||{})L.push(r.items[k]+'x '+itemName(k));if(r.alienmon_gift)L.push(r.alienmon_gift.name);return L.join(', ')}

function qComplete(q){const s=qs(q.id),r=q.rewards||{};s.state='done';
 QN=QN.filter(m=>!(m.q===q.id&&m.kind==='start'));   // finished before its intro was shown: skip the intro
 if(r.dust)G.dust+=r.dust;
 for(const k in r.items||{}){if(k in G.pods)G.pods[k]+=r.items[k];else if(KEY_ITEMS[k])G.key[k]=1;else G.items[k]=(G.items[k]||0)+r.items[k]}
 for(const f of r.flags||[])G.flags[f]=1;
 // Signal Shards come from the Keeper battles themselves, so the quest's "shard" reward is not paid again
 if(r.alienmon_seen)for(const n of[].concat(r.alienmon_seen))if(IDX[n]!=null)G.seen[IDX[n]]=1;
 let gift=null;if(r.alienmon_gift&&IDX[r.alienmon_gift.name]!=null){const m=mk(IDX[r.alienmon_gift.name],r.alienmon_gift.lv||5);gift=addMon(m)==='box'?' (sent to storage)':''}
 const rt=qRewardText(r);
 qNotify(q.id,'done',(q.dialogue&&q.dialogue.complete||[]).concat(['Quest complete: '+q.title+'!'+(rt?' Received '+rt+(gift||'')+'.':'')]));if(q.epilogue)storyThen(q,q.epilogue);
 if(q.repeatable){s.state='available';s.step=0;s.n=0}
 if(G.qtrack===q.id)G.qtrack=(qActive()[0]||{}).id||null;
 qUnlock();if(q.type==='main')autosave()}

// objectives that complete on their own: already-beaten keepers, items in hand, Xenodex counts, places reached
let qTick=0;
function qPassive(){if(!G||!G.quests)return;
 for(const q of qActive()){const o=qObj(q);if(!o)continue;const s=qs(q.id),loc=qLoc(q.id,s.step,o.location);
  if(o.type==='defeat_keeper'&&G.beaten[o.target])qProgress(q,o.count||1);
  // trainers fight once: one you already beat (S10 before M13, say) counts for the objective; rematch quests don't
  else if(QTRAINER.has(o.type)&&!q.repeatable){const n=Math.min(o.count||1,o.target.split('|').filter(t=>G.beaten[t]).length);if(n>s.n)qProgress(q,n-s.n)}
  else if(o.type==='item'&&G.key[o.target])qProgress(q,1);
  else if(o.type==='xenodex'&&Object.keys(G.caught).length>=(o.count||1))qProgress(q,o.count||1);
  else if(o.type==='cutscene'){if(s.playing)continue;const ca=o.scene?[o.scene,o.title||'']:QCUT_ART[o.target],art=ca&&SCI[ca[0]];
   // wait a few seconds for the scene art to download before falling back to text only
   if(okI(art)&&!DLG&&!CH&&scene!=='battle'){s.playing=1;cut(art,ca[1],()=>{s.playing=0;qNotify(q.id,'scene',storyCutLines(o));qProgress(q,1)})}else if(!okI(art)&&(s.wait=(s.wait||0)+1)>15){qNotify(q.id,'scene',storyCutLines(o));qProgress(q,1)}}
  else if(o.type==='choice'&&!s.asking&&!DLG&&!CH){s.asking=1;choose(qFmt(o.hint||q.title),o.options.map(qFmt),i=>{s.asking=0;G.flags[o.target]=i+1;qProgress(q,1)});if(o.default!=null&&CH)CH.sel=o.default}
  else if(o.type==='legendary_encounter'&&o.skip_if&&(G.flags[o.skip_if.flag]||0)===o.skip_if.value){qNotify(q.id,'scene',o.skip_if.lines||[]);qProgress(q,1)}
  else if(o.type==='visit'||o.type==='spot_event'){const t=o.target||'';
   if(t==='molten_frontier'){if(scene==='world'||(typeof secOn==='function'&&secOn()&&SEC_FRONTIER.has(G.sec.id)))qProgress(q,1)}
   else if(t.startsWith('planet:')){if(scene==='planet'&&qHere()===t.slice(7))qProgress(q,1)}
   else if(t.startsWith('node:')){if(typeof secOn==='function'&&secOn()){if(SEC_NODE[t.slice(5)]===G.sec.id)qProgress(q,1)}else if(scene==='world'){const[n,d]=nearestNode(G.wpos[0],G.wpos[1]);if(n&&n.k===t.slice(5)&&d<70)qProgress(q,1)}}
   else if(loc&&qSameArea(loc)){const p=qPos(),pp=loc.pts&&loc.pts[Math.min(s.n,loc.pts.length-1)],lx=pp?pp[0]*16+8:loc.x,ly=pp?pp[1]*16+15:loc.y;if(lx==null||(p&&Math.hypot(lx-p[0],ly-p[1])<(pp?20:44)))qProgress(q,1)}}}}

// cutscene lines that are not already part of a quest's own dialogue
const QCUT_ART={zib_joins:['dustara_keyart','A signal from the canyon...'],sola_leaves:['thalassa_keyart','The Deep Sea Ferry dock'],sola_joins:['helix_keyart','Helix Station'],novaryx_awakens:['starfall_keyart','The eight Shards sing'],rift_sealed:['starfall_battle','The Rift closes']};
const QCUT={novaryx_awakens:['Your eight Shards rise and resonate. A great signal-winged bird answers the call...']};

function qNotify(q,kind,lines){if(lines&&lines.length)QN.push({q,kind,lines:lines.map(l=>typeof qFmt==='function'?qFmt(l):l)})}
// show waiting quest messages when nothing else is on screen
function qFlush(){if(QN.length&&!DLG&&!CH&&(scene==='planet'||scene==='world')&&!(typeof SFADE!=='undefined'&&SFADE)&&!(typeof SM!=='undefined'&&SM)){const m=QN.shift();const giver=QI[m.q]&&QI[m.q].giver;say(m.lines,null,m.art||giver&&giver.art||undefined)}}

/* ---- quest log text ---- */
function qText(q){const s=qs(q.id),o=qObj(q);if(!o)return'Done';const l=qLoc(q.id,s.step,o.location)||{},spot=l.spot||'',c=o.count||1,cnt=c>1?' ('+s.n+'/'+c+')':'',t=o.target||'';
 if(o.hint)return o.hint+cnt;
 switch(o.type){
  case'choose_starter':return'Choose your partner';
  case'talk':return'Talk: '+(spot||t);
  case'visit':case'spot_event':return'Go to '+(spot||t.replace(/^(planet|node):/,''));
  case'examine':return'Examine '+(spot||t.replace(/_/g,' '))+cnt;
  case'collect':return'Find '+t.replace(/_/g,' ')+cnt;
  case'catch':return'Catch '+t+cnt;case'catch_any':return'Catch any Alienmon'+cnt;case'catch_type':return'Catch a '+t+'-type'+cnt;
  case'win_battle':return'Win battles'+(IDX[t]!=null?' vs '+t:'')+cnt;
  case'battle_trainer':case'battle_rival':case'defeat_boss':return'Battle: '+(spot||t.replace(/_/g,' '))+cnt;
  case'defeat_keeper':return'Beat the Keeper of '+((PL.find(p=>p.key===t)||{}).name||t);
  case'use_item':return'Use a '+itemName(t)+' in battle'+cnt;
  case'deliver':return'Bring a '+itemName(t)+' to '+(QI[q.id].giver.name||'them');
  case'show':return'Show a '+t.replace('type:','')+'-type Alienmon';
  case'xenodex':return'Catch '+c+' kinds ('+Object.keys(G.caught).length+'/'+c+')';
  case'legendary_encounter':return'Face '+t;
  default:return spot||t}}
function qWhere(q){const s=qs(q.id),o=qObj(q),l=(o&&qLoc(q.id,s.step,o.location))||q.location||{};return l.area==='molten_frontier'?'Molten Frontier':((PL.find(p=>p.key===l.planet)||{}).name||'')}

/* ---- things quests put into the world: givers, props, trainers, legendaries ---- */
const QART={sola_1:'sola',admin_vex:'vex',admin_bronn:'bronn',director_thorne:'thorne',orra_venn:'orra',quorum_marisol:'marisol',quorum_harrow:'harrow',quorum_saga:'saga',quorum_ostrander:'ostrander',
 quorum_all_rematch:'marisol',helix_dock_grunt:'strand',helix_spore_grunt:'strand',ferrox_junkers:'technician',pyros_miners:'miner',static_dancers:'civilian'};
const QNAME={sola_1:'Sola',admin_vex:'Admin Vex',admin_bronn:'Admin Bronn',director_thorne:'Director Thorne',orra_venn:'Orra Venn',quorum_marisol:'Marisol Fenn',quorum_harrow:'Duke Harrow',
 quorum_saga:'Saga',quorum_ostrander:'General Ostrander',quorum_all_rematch:'The Quorum',helix_dock_grunt:'Helix Grunt',helix_spore_grunt:'Helix Grunt',ferrox_junkers:'Junker',pyros_miners:'Miner',static_dancers:'Dancer'};
const qTitle=id=>QNAME[id]||id.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
const QTRAINER=new Set(['battle_trainer','battle_rival','defeat_boss']);
// spread several pickups around one spot
const QPROP_GIVES={forge_terminal:'helix_keycard'};
const QSPREAD=[[0,0],[34,10],[-30,14],[12,-26],[-14,30],[40,-18]];

let qEntCache=null,qEntFrame=-1;
function qEnts(){if(qEntFrame===frame&&qEntCache)return qEntCache;qEntFrame=frame;const E=[];if(!G||!G.quests){return qEntCache=E}
 for(const q of QUESTS){const s=qs(q.id);
  if(q.type==='side'&&s.state==='available'&&qPrereqsDone(q)){const l=qLoc(q.id,'giver',q.location);if(l&&l.x!=null&&qSameArea(l))E.push({k:'giver',q,x:l.x,y:l.y,art:q.giver&&q.giver.art,mark:'!'})}
  if(s.state!=='active')continue;const o=qObj(q);if(!o)continue;const l=qLoc(q.id,s.step,o.location);
  if(o.type==='deliver'||o.type==='show'){const g=qLoc(q.id,'giver',q.location);if(g&&g.x!=null&&qSameArea(g))E.push({k:'turnin',q,o,x:g.x,y:g.y,art:q.giver&&q.giver.art,mark:'?'});continue}
  if(!l||l.x==null||!qSameArea(l))continue;
  if(o.type==='talk')E.push({k:'talk',q,o,x:l.x,y:l.y,art:l.art||null,mark:'?'});
  else if(o.type==='examine'||o.type==='collect'){const c=o.count||1;for(let i=0;i<c;i++)if(!s.got.includes(i)){const d=QSPREAD[i%QSPREAD.length],pp=l.pts&&l.pts[i%l.pts.length];E.push({k:'prop',q,o,i,x:pp?pp[0]*16+8:l.x+d[0],y:pp?pp[1]*16+15:l.y+d[1]})}}
  else if(QTRAINER.has(o.type)&&!(o.target.includes('|'))&&!/^mf\d+$/.test(o.target))E.push({k:'trainer',q,o,x:l.x,y:l.y,art:QART[o.target]||(q.giver&&q.giver.art)||'guard',mark:'!'});
  else if(o.type==='legendary_encounter')E.push({k:'legend',q,o,x:l.x,y:l.y,mon:o.target,mark:'!'});
  else if(o.type==='visit'||o.type==='spot_event'){const pp=l.pts&&l.pts[Math.min(s.n,l.pts.length-1)];E.push({k:'beacon',q,o,x:pp?pp[0]*16+8:l.x,y:pp?pp[1]*16+15:l.y})}}
 return qEntCache=E}

function qNear(){const p=qPos();if(!p)return null;let best=null,bd=scene==='world'?14:40;for(const e of qEnts()){if(e.k==='beacon')continue;const d=Math.hypot(e.x-p[0],e.y-p[1]);if(d<bd){bd=d;best=e}}return best}

// story bosses and the rival use the progression levels and lead with their signature Alienmon
const QBOSS={admin_bronn:['bronn','Bronnix',3],admin_vex:['vex','Vexhydra',4],director_thorne:['thorne','Thornvoid',5],orra_venn:['orra','Firstlight',6],
 quorum_marisol:[0,'Facetrix',5],quorum_harrow:[1,'Encorex',5],quorum_saga:[2,'Pyrelyth',5],quorum_ostrander:[3,'Citadrake',5]};
const RIVAL_LV=[7,15,22,36,56,70];
function evolvedAt(id,lv){let n=D[id].name;for(let i=0;i<3;i++){const ev=(PROG.species[n]||{}).evolves;if(ev&&ev.into&&/^Level/.test(ev.method||'Level')&&lv>=ev.level&&IDX[ev.into]!=null)n=ev.into;else break}return IDX[n]}
function bossTeam(q,o){const p=PL[G.planet]||PL[0],pool=p.pool.e.concat(p.pool.c).filter(id=>wildOK(D[id].name)),r=rng(hash(o.target)),fill=(n,lv)=>Array.from({length:n},()=>[evolvedAt(pool[Math.floor(r()*pool.length)],lv),lv]);
 const rv=/^sola_(\d)$/.exec(o.target);
 if(rv){const n=+rv[1],ace=RIVAL_LV[n-1]||7,mine=STARTERS.find(s=>G.caught[s])??STARTERS[0],counter=STARTERS[(STARTERS.indexOf(mine)+1)%3];
  return fill(n-1,Math.max(2,ace-2)).concat([[evolvedAt(counter,ace),ace]])}
 const b=QBOSS[o.target];if(!b)return null;const lv=typeof b[0]==='number'?PROG.bosses.quorum[b[0]]:PROG.bosses[b[0]];
 return fill(b[2]-1,lv-2).concat([[IDX[b[1]]??pool[0],lv]])}
function qTeam(q,o){const bt=bossTeam(q,o);if(bt)return bt;const p=PL[G.planet]||PL[0],lv=(p.lv||[5,8])[1];
 if(o.team&&o.team.length)return o.team.map(([id,l])=>{if(id==='counter_starter'){const mine=STARTERS.find(s=>G.caught[s]);return[STARTERS[(STARTERS.indexOf(mine)+1)%3]??STARTERS[1],l]}return[IDX[id]!=null?IDX[id]:id,l]});
 const pool=p.pool.c.concat(p.pool.e),r=rng(hash(o.target)),boss=o.type==='defeat_boss',n=boss?3:2;
 return Array.from({length:n},(_,i)=>[pool[Math.floor(r()*pool.length)],lv+(boss?3:1)+i])}

function qInteract(e){const q=e.q;
 if(e.k==='giver'){say(((q.dialogue&&q.dialogue.start||[]).length?q.dialogue.start:[q.title]).map(qFmt),()=>choose('Side mission: '+q.title,['Accept','Not now'],i=>{if(i===0){QN=QN.filter(m=>m.q!==q.id);qActivate(q);QN=QN.filter(m=>!(m.q===q.id&&m.kind==='start'));say('Mission accepted: '+q.title+'. '+qText(q)+'.')}}),q.giver&&q.giver.art);return}
 if(e.k==='turnin'||e.k==='talk'){if(!qEvent('talk','q:'+q.id,{x:e.x,y:e.y}))say(((q.dialogue&&q.dialogue.progress)||['Keep at it, Linker.']).map(qFmt),null,e.art||(q.giver&&q.giver.art));return}
 if(e.k==='prop'){const s=qs(q.id);s.got.push(e.i);if(QPROP_GIVES[e.o.target]){G.key=G.key||{};G.key[QPROP_GIVES[e.o.target]]=1}say(e.o.type==='collect'?'You found a '+e.o.target.replace(/_/g,' ')+'!':'You examine the '+(qLoc(q.id,s.step,e.o.location).spot||e.o.target.replace(/_/g,' '))+'.');qEvent('prop',e.o.target);return}
 if(e.k==='trainer'){if(!G.party.some(m=>m.hp>0)){say('Your team needs to heal first.');return}const name=qTitle(e.o.target),team=qTeam(q,e.o);
  const tr={name,art:e.art,intro:qFmt(e.o.intro||'You want to battle? Let\'s go!'),lose:qFmt(e.o.lose||'...You win this time.'),after:'Not bad, Linker.',team,bkey:e.o.target,ally:e.o.ally,sp:e.o.test==='orra'?{orra:1}:null};
  say(name+': '+tr.intro,()=>startBattle(team.map(([id,lv])=>mk(id,lv)),tr),e.art);return}
 if(e.k==='legend'){if(!G.party.some(m=>m.hp>0)){say('Your team needs to heal first.');return}const id=IDX[e.mon];if(id==null)return;
  say('The air hums... '+e.mon+' appears!',()=>{NEXTB=e.o.listen?{immortal:1,listen:1}:null;startBattle([mk(id,e.o.lv||50)],null)});return}}

// markers and quest figures, drawn on painted towns (S = map zoom, cs = character size) and on the world map (S = 1)
function qDraw(cx,cy,S,cs){for(const e of qEnts()){const x=e.x*S-cx,y=e.y*S-cy;if(x<-20||x>180||y<-30||y>170)continue;
  if(e.k==='prop'){const t=(frame+e.i*7)%40;ctx.fillStyle=t<20?'#fff7a8':'#5ff2ff';ctx.fillRect(Math.round(x)-1,Math.round(y-4),3,3);ctx.fillRect(Math.round(x),Math.round(y-7),1,9);ctx.fillRect(Math.round(x-4),Math.round(y-3),9,1);continue}
  if(e.k==='beacon'){if(frame%30<20){ctx.fillStyle='rgba(95,242,255,0.55)';ctx.beginPath();ctx.ellipse(x,y,6*S/0.22*0.22+3,2.5,0,0,6.283);ctx.fill()}continue}
  if(e.k==='legend'){const im=OWI[e.mon];if(okI(im))ctx.drawImage(im,((frame>>4)&1)*64,0,64,64,Math.round(x-cs*0.6),Math.round(y-cs*1.2),Math.round(cs*1.2),Math.round(cs*1.2))}
  else if(e.art&&!qPainted(e))dchar(e.art,Math.round(x-cs/2),Math.round(y-cs-1),cs,cs);
  if(e.mark){const my=Math.round(y-cs-9+Math.sin(frame/8)),done=e.k==='turnin'&&qReady(e);box(Math.round(x-4),my,9,9,e.mark==='!'||done?'#ffd23f':'#d8d0e8','#1b1424');txt(e.mark,Math.round(x-2),my+1,'#1b1424',6)}}}
// a talk target that is already painted into the town art (or is a world NPC) only gets the marker
function qPainted(e){if(typeof secOn==='function'&&secOn())return!!secNpcAt(SWORLD[G.sec.id],Math.floor(e.x/16),Math.floor(e.y/16));if(scene==='world')return WORLD.npcs.some(n=>Math.hypot(n.x-e.x,n.y-e.y)<30);const P=paintOf();return!!(P&&P.hot.some(h=>(h.k==='talk'||h.k==='npc'||h.k==='mon')&&Math.hypot(h.x-e.x,h.y-e.y)<40))}
function qReady(e){const o=e.o;if(o.type==='deliver')return G.items[o.target]>0;if(o.type==='show'){const ty=o.target.replace(/^(type|mon):/,'');return G.party.some(m=>o.target.startsWith('mon:')?D[m.id].name===ty:(D[m.id].t||[]).includes(ty))}return true}

// one-line tracker for the tracked quest
function qTrackerText(){const id=G&&G.qtrack;if(!id||!qs(id)||qs(id).state!=='active')return null;return'▶ '+qText(QI[id])}
function qDrawTracker(y){const t=qTrackerText();if(!t||DLG||CH)return;const s=t.length>30?t.slice(0,29)+'…':t;box(0,y,160,11,'#1b1424','#ffd23f');txt(s,3,y+3,'#ffd23f',6)}

/* ---- START > Quests: Main / Side tabs, details, Track ---- */
function qList(tab){const order={active:0,available:1,done:2},type=tab?'side':'main';
 return QUESTS.filter(q=>q.type===type&&qs(q.id).state!=='locked'&&(type==='main'||qs(q.id).state!=='available'||qPrereqsDone(q)))
  .sort((a,b)=>order[qs(a.id).state]-order[qs(b.id).state])}
function qLogUpd(){const L=qList(B.qtab);
 if(P_('left')||P_('right')){B.qtab=1-B.qtab;B.qsel=0}
 if(L.length){if(P_('up'))B.qsel=(B.qsel+L.length-1)%L.length;if(P_('down'))B.qsel=(B.qsel+1)%L.length}
 if(P_('a')&&L[B.qsel]&&qs(L[B.qsel].id).state==='active')G.qtrack=G.qtrack===L[B.qsel].id?null:L[B.qsel].id;
 if(P_('b')||P_('start'))menuMode='root'}
function qLogDraw(){const L=qList(B.qtab);rect(0,0,160,144,'#120c22');
 box(2,2,156,14,'#1b1424','#5ff2ff');txt((B.qtab?' Main  [Side]':'[Main]  Side ')+'  ◀▶',6,6,'#5ff2ff',6);
 box(2,18,156,70);if(!L.length)txt(B.qtab?'No side missions yet.':'No quests yet.',8,26,'#1b1424',6);
 const top=Math.max(0,Math.min(B.qsel-3,L.length-7));
 L.slice(top,top+7).forEach((q,j)=>{const i=top+j,s=qs(q.id).state,mark=s==='done'?'✓':s==='available'?'!':G.qtrack===q.id?'▶':' ';
  txt((i===B.qsel?'>':' ')+mark+q.title.slice(0,23),6,22+j*9,s==='done'?'#8a7fa8':'#1b1424',6)});
 const q=L[B.qsel];box(2,90,156,52,'#1b1424','#ffd23f');if(!q)return;const s=qs(q.id).state;
 txt(q.title.slice(0,26),6,94,'#ffd23f',6);txt((q.act?q.act+' · ':'')+qWhere(q),6,103,'#a99cc8',6);
 if(s==='active'){const w=wrap(qText(q),28);txt(w[0]||'',6,112,'#ffffff',6);if(w[1])txt(w[1],6,120,'#ffffff',6)}
 else txt(s==='done'?'Complete!':'Talk to '+((q.giver&&q.giver.name)||'them').slice(0,20)+' to start.',6,112,'#ffffff',6);
 const rt=qRewardText(q.rewards||{});if(rt)txt(('Reward: '+rt).slice(0,30),6,130,'#7dff6a',6);
 if(s==='active')txt(G.qtrack===q.id?'A: untrack':'A: track',112,94,'#5ff2ff',6)}
