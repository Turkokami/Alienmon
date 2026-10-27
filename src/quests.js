/* ---------- quests: data/quests.json, rules in docs/quests/QUEST_SYSTEM_SPEC.md ----------
   tools/build.js inlines this file into the game script. Everything here runs inside the game's own scope
   (G, D, PL, IDX, say, choose, startBattle, ...). Gameplay code reports what happened through qEvent();
   the engine decides which quest objectives that moves forward. */
const QUESTS=__QUESTS__,QI={};QUESTS.forEach(q=>QI[q.id]=q);
const QPLACE=__QPLACE__;   // where quest NPCs, props and trainers stand in each town (tools/place_quests.py)
const KEY_ITEMS={helix_keycard:'Helix Keycard',ystra_shardlet:'Ystra Shardlet',seedmother_seed:'Seedmother Seed'};
let QN=[];                 // quest messages waiting for a quiet moment to show
// a quest added after this save was made has no entry yet: start it as locked instead of crashing
const qs=id=>G.quests[id]||(G.quests[id]={state:'locked',step:0,n:0,got:[]});

// set up quest state for a new or loaded game (called from the main loop once G exists)
function qInit(){G.quests=G.quests||{};G.key=G.key||{};G.flags=G.flags||{};
 for(const q of QUESTS)if(!G.quests[q.id])G.quests[q.id]={state:'locked',step:0,n:0,got:[]};
 if(!G.qmig){G.qmig=1;qMigrate()}
 if(G.qtrack===undefined)G.qtrack=null;if(typeof storyMigrate==='function')storyMigrate();G._qv=QUESTS.length;qUnlock()}

// older saves: credit what the player already did, without paying rewards twice
function qMigrate(){const done=id=>{const s=qs(id);if(s){s.state='done';s.step=QI[id].objectives.length}};
 if(G.party.length)done('M01');
 for(const q of QUESTS){const os=q.objectives;if(!os.length)continue;
  if(os.every(o=>(o.type==='defeat_keeper'&&G.beaten[o.target])||(o.type==='battle_trainer'&&!o.target.includes('|')&&G.beaten[o.target])))done(q.id)}}

const qPrereqsDone=q=>(q.prereq||[]).every(p=>qs(p)&&qs(p).state==='done');
const qRested=q=>!q.cooldown_h||!(G.qcool&&G.qcool[q.id])||Date.now()-G.qcool[q.id]>=q.cooldown_h*3600e3;   // a repeatable mission's rest time
// locked -> available once prerequisites are done; main quests start straight away
function qUnlock(){let again=true;while(again){again=false;
 for(const q of QUESTS){const s=qs(q.id);if(s.state==='locked'&&qPrereqsDone(q)){s.state='available';if(q.type==='main'){qActivate(q);again=true}}}}}

const qPunct=(t,p)=>/[.!?…]$/.test(t)?t:t+p;
const qA=w=>(/^[aeiou]/i.test(w)?'an ':'a ')+w;
function qActivate(q){const s=qs(q.id);s.state='active';s.step=0;s.n=0;s.got=[];qPic(q.id,0,'start');
 if(G.qtrack==null||!qs(G.qtrack)||qs(G.qtrack).state!=='active')G.qtrack=q.id;
 qNotify(q.id,'start',['New '+(q.type==='main'?'story quest':'side mission')+': '+q.title].concat(q.dialogue&&q.dialogue.start||[]),q.giver&&q.giver.art);qPassive()}

const qObj=q=>q.objectives[qs(q.id).step];
const qActive=()=>QUESTS.filter(q=>qs(q.id).state==='active');

// which place the player is in, in the terms quests.json uses
function qHere(){return scene==='world'?'molten_frontier':(G.sub||(PL[G.planet]||{}).key)}
function qSameArea(loc){if(!loc)return false;if(typeof secOn==='function'&&secOn())return loc.sec===G.sec.id;const h=qHere();return loc.area==='molten_frontier'?h==='molten_frontier':(loc.planet&&loc.planet===h&&scene!=='world'&&scene!=='space')}
function qPos(){if(typeof secOn==='function'&&secOn())return[G.sec.x*16+8,G.sec.y*16+15];return scene==='world'?G.wpos:G.ppos}
// a quest location, moved onto walkable ground for the painted towns when tools/place_quests.py had to
const QPLACE_FIXED={'M13:1':{area:'fortress',planet:'fortress',x:740,y:600,spot:'Forge corridor'},'M13:2':{area:'fortress',planet:'fortress',x:768,y:222,spot:'Control room terminal'}};
function qLoc(qid,step,loc){if(typeof secOn==='function'&&secOn()){const sl=secQLoc(qid+':'+step,loc);if(sl)return sl}const p=QPLACE_FIXED[qid+':'+step]||QPLACE[qid+':'+step];return p?Object.assign({},loc,p):loc}

function qMatch(q,o,type,target,info){const t=o.type;
 switch(type){
  case'starter':return t==='choose_starter';
  case'talk':if(t==='talk'||t==='deliver'||t==='show'){if(o.target===target||target==='q:'+q.id)return true;const l=qLoc(q.id,qs(q.id).step,o.location);return!!(info.x!=null&&l&&l.x!=null&&qSameArea(l)&&Math.hypot(l.x-info.x,l.y-info.y)<(typeof secOn==='function'&&secOn()?8:56))}return false;
  case'visit':return(t==='visit'||t==='spot_event')&&o.target===target;
  case'prop':return(t==='examine'||t==='collect')&&o.target===target;
  case'catch':return(t==='catch'&&o.target===target)||(t==='win_battle'&&o.target===target)||t==='catch_any'||(t==='catch_type'&&(D[IDX[target]].t||[]).includes(o.target))||(t==='legendary_encounter'&&o.target===target);
  case'win':return(t==='win_battle'&&(o.target===target||o.target===info.area))||(t==='legendary_encounter'&&o.target===target);
  case'trainer':return(t==='battle_trainer'||t==='battle_rival'||t==='defeat_boss')&&(o.target===target||o.target.split('|').includes(target)||(o.target==='quorum_all_rematch'&&/^quorum_/.test(target)));
  case'keeper':return t==='defeat_keeper'&&o.target===target;
  case'use':return t==='use_item'&&o.target===target}
 return false}

// gameplay reports an event; returns true if it moved any quest forward
function qEvent(type,target,info){if(!G||!G.quests)return false;info=info||{};let hit=false;
 for(const q of qActive()){const o=qObj(q);if(!o||!qMatch(q,o,type,target,info))continue;
  if(o.type==='deliver'){const k=o.target;if(!(G.items[k]>0)){qNotify(q.id,'need',['You need '+qA(itemName(k))+' to hand over.']);continue}G.items[k]--}
  if(o.type==='show'){const ty=o.target.replace(/^(type|mon):/,''),sp=o.target.startsWith('mon:');if(!G.party.some(m=>sp?storyIsMon(m,ty):(D[m.id].t||[]).includes(ty))){qNotify(q.id,'need',['Bring '+(sp?'a '+ty:'a '+ty+'-type Alienmon')+' in your party.']);continue}}
  hit=true;qProgress(q,1)}
 return hit}

function qProgress(q,n){const s=qs(q.id),o=qObj(q);s.n+=n;
 if(s.n>=(o.count||1)){const st=s.step;s.step++;s.n=0;s.got=[];if(o.then)storyThen(q,o.then);qPic(q.id,st,'done');if(s.step<q.objectives.length)qPic(q.id,s.step,'start');
  if(s.step>=q.objectives.length)qComplete(q);
  else{const nx=qObj(q);if(!((nx.type==='cutscene'||nx.type==='choice')&&storyAt(nx))&&!(o.then&&o.then.go))qNotify(q.id,'step',['Objective complete! Next: '+qText(q)]);if(q.type==='main')autosave();qPassive()}}}

function itemName(k){const it=ITEMS.find(i=>i.k===k)||PODS.find(p=>p.k===k);return it?it.n:(KEY_ITEMS[k]||k)}
function qRewardText(r){const L=[];if(r.dust)L.push(r.dust+' stardust');for(const k in r.items||{})L.push(r.items[k]+'x '+itemName(k));const g=r.alienmon_gift;if(g)L.push(g.name==='random_helix_pool'?(g.count||1)+' rescued Alienmon':g.name);return L.join(', ')}

function qComplete(q){const s=qs(q.id),r=q.rewards||{};s.state='done';
 QN=QN.filter(m=>!(m.q===q.id&&m.kind==='start'));   // finished before its intro was shown: skip the intro
 if(r.dust)G.dust+=r.dust;
 for(const k in r.items||{}){if(k in G.pods)G.pods[k]+=r.items[k];else if(KEY_ITEMS[k])G.key[k]=1;else G.items[k]=(G.items[k]||0)+r.items[k]}
 for(const f of r.flags||[])G.flags[f]=1;
 // Signal Shards come from the Keeper battles themselves, so the quest's "shard" reward is not paid again
 if(r.alienmon_seen)for(const n of[].concat(r.alienmon_seen))if(IDX[n]!=null)G.seen[IDX[n]]=1;
 let gift=null,rt=qRewardText(r);const gf=r.alienmon_gift;if(gf&&IDX[gf.name]!=null){const m=mk(IDX[gf.name],gf.lv||5);gift=addMon(m)==='box'?' (sent to storage)':''}
 else if(gf&&gf.name==='random_helix_pool'){const hp=PL.find(p=>p.key==='helix')||PL[G.planet]||PL[0],pool=hp.pool.c.concat(hp.pool.e).filter(id=>wildOK(D[id].name)),lv=gf.lv||(hp.lv||[30,34])[1],got=[];
  for(let i=0;i<(gf.count||1)&&pool.length;i++){const id=pool[Math.floor(Math.random()*pool.length)];const m=mk(id,lv);G.seen[id]=1;G.caught[id]=1;G.box.push(m);got.push(D[id].name)}
  rt=rt.replace((gf.count||1)+' rescued Alienmon',got.join(' and '));gift=' (sent to storage)'}
 qNotify(q.id,'done',(q.dialogue&&q.dialogue.complete||[]).concat(['Quest complete: '+qPunct(q.title,'!')+(rt?' Received '+rt+(gift||'')+'.':'')]),q.giver&&q.giver.art);if(q.epilogue)storyThen(q,q.epilogue);
 if(q.repeatable){s.state='available';s.step=0;s.n=0;if(q.cooldown_h){G.qcool=G.qcool||{};G.qcool[q.id]=Date.now()}}
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
  else if(o.type==='catch'&&o.have&&IDX[o.target]!=null&&G.caught[IDX[o.target]])qProgress(q,o.count||1);   // caught before this step came up (S96: either twin first)
  else if(o.type==='xenodex'&&Object.keys(G.caught).length>=(o.count||1))qProgress(q,o.count||1);
  else if(o.type==='cutscene'){if(s.playing||!storyAt(o)||QN.length||DLG||CH||scene==='battle'||scene==='cut')continue;const ca=o.scene?[o.scene,o.title||'']:QCUT_ART[o.target],art=ca&&SCI[ca[0]];
   // wait a few seconds for the scene art to download before falling back to text only
   const qb=!o.scene&&QBOARD[o.target],bok=qb&&qb.every(([k])=>okI(boardImg(k)));if(bok&&!DLG&&!CH&&scene!=='battle'&&scene!=='cut'&&!CUTQ.length){s.playing=1;cutBoard(qb,()=>{s.playing=0;qNotify(q.id,'scene',storyCutLines(o));qProgress(q,1)})}else if(!qb&&okI(art)&&!DLG&&!CH&&scene!=='battle'&&scene!=='cut'&&!CUTQ.length){s.playing=1;cut(art,ca[1],()=>{s.playing=0;qNotify(q.id,'scene',storyCutLines(o));qProgress(q,1)})}else if(!(qb?bok:okI(art))&&(s.wait=(s.wait||0)+1)>15){qNotify(q.id,'scene',(qb&&o.target==='prophecy_shrine'?qb.flatMap(b=>b[1]):[]).concat(storyCutLines(o)));qProgress(q,1)}}
  else if(o.type==='choice'&&!s.asking&&!DLG&&!CH&&!QN.length&&scene!=='cut'&&scene!=='battle'&&storyAt(o)){s.asking=1;choose(qFmt(o.hint||q.title),o.options.map(qFmt),i=>{s.asking=0;G.flags[o.target]=i+1;qProgress(q,1)});if(o.default!=null&&CH)CH.sel=o.default}
  else if(o.type==='legendary_encounter'&&o.skip_if&&(G.flags[o.skip_if.flag]||0)===o.skip_if.value&&storyAt(o)){qNotify(q.id,'scene',o.skip_if.lines||[]);qProgress(q,1)}
  else if(o.type==='visit'||o.type==='spot_event'){const t=o.target||'';
   if(t==='molten_frontier'){if(scene==='world'||(typeof secOn==='function'&&secOn()&&SEC_FRONTIER.has(G.sec.id)))qProgress(q,1)}
   else if(t.startsWith('planet:')){if(scene==='planet'&&qHere()===t.slice(7))qProgress(q,1)}
   else if(t.startsWith('node:')){if(QNODEPL[t.slice(5)]&&G.flags.ship_clear&&scene==='planet'&&qHere()===QNODEPL[t.slice(5)])qProgress(q,1);else if(typeof secOn==='function'&&secOn()){if(SEC_NODE[t.slice(5)]===G.sec.id)qProgress(q,1)}else if(scene==='world'){const[n,d]=nearestNode(G.wpos[0],G.wpos[1]);if(n&&n.k===t.slice(5)&&d<70)qProgress(q,1)}}
   else if(loc&&qSameArea(loc)){const p=qPos(),pp=loc.pts&&loc.pts[Math.min(s.n,loc.pts.length-1)],lx=pp?pp[0]*16+8:loc.x,ly=pp?pp[1]*16+15:loc.y;if(lx==null||(p&&Math.hypot(lx-p[0],ly-p[1])<(pp?20:44)))qProgress(q,1)}}}}

// a Frontier harbour or tunnel that leads to a world: once you have a ship, flying there counts too
const QNODEPL={thalassa:'thalassa',glyphos:'glyphos',pyros:'pyros',umbra:'umbra',ferrox:'ferrox',helix:'helix',starfall:'starfall'};
// cutscene lines that are not already part of a quest's own dialogue
const QCUT_ART={zib_joins:['dustara_keyart','A signal from the canyon...'],sola_leaves:['cut_26','The Deep Sea Ferry dock'],sola_joins:['helix_keyart','Helix Station'],novaryx_awakens:['starfall_keyart','The eight Shards sing'],rift_sealed:['starfall_battle','The Rift closes']};
// storyboards: pictures with story text, played in place of a single scene image
const QBOARD={prophecy_shrine:[['cut_66',['A shimmering girl made of crystal light is waiting at the shrine, flickering at the edges like a candle.',"Liss: I am Liss, a Ystran echo. What's left of one, anyway. Zib knows my voice."]],['prophecy_mural',['At the third wind shrine, the wind falls silent. Carved across the whole shrine wall is one great picture.']]],   /* Liss waiting at the shrine, then the mural */
 zib_joins:[
 ['zib_bridge_1',["By the time you and {starter} reach the bridge, the long first day is over and night has fallen. DX-4 is still beeping at the canyon.",'Something past the old stone bridge is sending a signal. You click on your flashlight and go, {starter} close behind.']],
 ['zib_bridge_2',['Halfway across the glowing bridge, the canyon wall bursts open!','A tiny silver saucer rockets out in a shower of red rock.']],
 ['zib_bridge_3',['It stops right in front of your nose. Inside the glass dome, one huge eye blinks at you.','"Bip."']],
 ['zib_bridge_4',["{starter} jumps back in surprise. The saucer doesn't flinch. It loops around you, lights flashing gold.","It's an Alienmon called Zib... and it has decided you're its captain."]]]};
const QCUT={novaryx_awakens:[]};   // the Novaryx picture (cut_51) tells it

function qNotify(q,kind,lines,art){if(lines&&lines.length)QN.push({q,kind,art:art||undefined,lines:lines.map(l=>typeof qFmt==='function'?qFmt(l):l)})}
// show waiting quest messages when nothing else is on screen
// story pictures (data/cutscenes.json): shown full screen with their narration when a quest step starts or is done.
// A picture can have a version per starter (<key>_<starter>), picked by boardImg. Each is shown once per save.
const CUTPIC=__CUTPICS__;let CUTQ=[];
function qPic(qid,o,w){if(!G)return;G.seenCut=G.seenCut||{};for(const c of CUTPIC)if(c.q===qid&&c.o===o&&c.w===w&&!G.seenCut[c.k]){if(c.st&&!(typeof myStarter==='function'&&G.party&&G.party.length&&D[myStarter()].name.toLowerCase()===c.st))continue;G.seenCut[c.k]=1;QN.push({q:qid,kind:'pic',pic:c,lines:[c.cap+'.'].concat(c.lines||[]).map(qFmt)})}}
/* each line of a quest message shows the face of whoever speaks it ("Hank: ...", "Teo (recording): ..."); narration has no face.
   A story quest's opening words from someone who isn't here arrive as a Linker message. */
const QSPK={'Dr. Vashti':'vashti','Dr. Imogen Vashti':'vashti','Vashti':'vashti','Dusty':'dusty','Old Dusty':'dusty','Hank Briggs':'hank','Hank':'hank','Kit':'kit','Kit Briggs':'kit','Sola':'sola','Sola Reyes':'sola',
 'Captain Marsh':'marsh','Marsh':'marsh','Dr. Lysa Moor':'moor','Dr. Moor':'moor','DJ Static':'static','Static':'static','Old Basalt':'basalt','Basalt':'basalt','Ingrid Vale':'ingrid','Ingrid':'ingrid','Grub':'grub','Admin Bronn':'bronn','Admin Vex':'vex','Vex':'vex',
 'Director Thorne':'thorne','Thorne':'thorne','Kael Thorne':'thorne','Mortimer Kade':'kade','Kade':'kade','Strand':'strand','Pell':'pell','Helix Grunt Pell':'pell','Orra Venn':'orra','Orra':'orra','Teo Reyes':'teo','Teo':'teo','Mom':'mom','Tamsin':'tamsin','Liss':'liss',
 'Dax':'dax','Forge Miner Dax':'dax','DX-4':'dx4','Mina':'mina','Saga':'saga','Marisol Fenn':'marisol','Duke Harrow':'harrow','General Ostrander':'ostrander','Echo & Iris':'twins','Echo and Iris':'twins','Echo':'twins','Iris':'twins',
 'Nana Wren':'nanawren','Squid Sailor':'squidsailor','Nurse':'nurse','Nurse Coral':'coral','Fenna':'fenna','Bram':'bram','Mr. Abernathy':'abernathy','Guard':'guard','Helix Grunt':'helix_helix_grunt','Grunt':'helix_helix_grunt',
 'Zib':'','Seedmother':'','Codex page':'','Ystran Echo':'ystran','Ystran echo':'ystran'};
const QSYS=/^(New (story quest|side mission)|Objective complete|Quest complete|Mission accepted|Word from|Linker alert|Incoming Linker message|You received)/;
function qSpeaker(l){const m=typeof l==='string'&&!QSYS.test(l)&&l.match(/^([A-Z][\w.'&-]*(?: (?:[A-Z&][\w.'-]*|of|the)){0,3})(?: \([^)]*\))?: /);return m?m[1]:null}   /* a name: capitalised words ("Dr. Vashti", "Echo & Iris") */
const qArtOK=a=>!!(a&&(PORT[a]||TALKI[a]||CHAR[a]));
function qLineArt(l,fb){const sp=qSpeaker(l);if(!sp)return null;if(sp in QSPK)return qArtOK(QSPK[sp])?QSPK[sp]:null;return qArtOK(fb)?fb:null}
function qSpeakerArt(lines){for(const l of[].concat(lines)){const a=qLineArt(l,null);if(a)return a}return null}
// someone (or their portrait) is standing in this section
function qPresent(a){if(!(typeof secOn==='function'&&secOn()))return false;const s=SWORLD[G.sec.id];if(secNpcs(s).some(n=>n.art===a||n.por===a))return true;if(qEnts().some(e=>e.art===a))return true;const kp=PL[G.planet]&&PL[G.planet].keeper;return!!(kp&&kp.art===a&&(s.objects||[]).some(o=>o.k==='keeper'))}
function qSay(m){const runs=[];for(const l of m.lines){const a=qLineArt(l,m.art),r=runs[runs.length-1];if(r&&r.art===a)r.lines.push(l);else runs.push({art:a,lines:[l]})}
 if((m.kind==='start'&&QI[m.q]&&QI[m.q].type==='main')||(m.kind==='done'&&QI[m.q]&&QI[m.q].type==='side'))for(const r of runs)if(r.art&&!qPresent(r.art)&&(m.kind!=='done'||r.art===m.art)){r.lines.unshift('Incoming Linker message from '+qSpeaker(r.lines[0])+'...');break}
 const next=i=>{const r=runs[i];if(!r)return m.after&&m.after();say(r.lines,()=>next(i+1),r.art||undefined)};next(0)}
function qFlush(){if(QN.length&&!DLG&&!CH&&(scene==='planet'||scene==='world'||(scene==='space'&&QN[0].q==='P04'))&&!(typeof SFADE!=='undefined'&&SFADE)&&!(typeof SM!=='undefined'&&SM)){const m=QN[0];
  if(m.go){QN.shift();m.go();return}if(m.credits){QN.shift();if(typeof startCredits==='function')startCredits();return}   /* a move to another place waits for the lines before it */
  if(m.pic){const p=m.pic,ok=okI(boardImg(p.k));if(!ok&&(m.wait=(m.wait||0)+1)<=240)return;QN.shift();if(ok)cutBoard([[p.k,[/[.!?…]$/.test(p.cap)?p.cap:p.cap+'.'].concat(p.lines||[])]],()=>{});else if(m.lines&&m.lines.length)qSay(m);return}   /* a story picture: wait ~4 s for it, else tell it in words */
  QN.shift();if(m.evo&&typeof evoAnimIds==='function'){evoAnimIds(m.evo[0],m.evo[1],m.evo[2],()=>say(m.lines));return}qSay(m)}}

/* ---- quest log text ---- */
function qText(q){const s=qs(q.id),o=qObj(q);if(!o)return'Done';const l=qLoc(q.id,s.step,o.location)||{},spot=l.spot||'',c=o.count||1,cnt=c>1?' ('+s.n+'/'+c+')':'',t=o.target||'';
 const atName=o.at&&typeof SWORLD!=='undefined'&&SWORLD[o.at]?SWORLD[o.at].name.replace(/^Molten Frontier: /,''):'';
 if(o.type==='choice')return atName?'Go to '+atName:'Decide: '+(o.hint||'what to do');
 if(o.type==='cutscene')return atName?'Go to '+atName:(o.title||'Keep going');
 if(o.hint)return o.hint+cnt;
 switch(o.type){
  case'choose_starter':return'Choose your partner';
  case'talk':return'Talk: '+(spot||t);
  case'visit':case'spot_event':if(/^node:/.test(t)&&QNODEPL[t.slice(5)]&&G.flags.ship_clear){const p=PL.find(x=>x.key===QNODEPL[t.slice(5)]);return'Go to '+(spot||t.slice(5))+', or fly to '+(p?p.name:t.slice(5))}if(/^planet:/.test(t)){const pk=t.slice(7),p=PL.find(x=>x.key===pk);return'Fly to '+(p?p.name:pk)+' (START > Ship)'}return'Go to '+(spot||t.replace(/^(planet|node):/,''));
  case'examine':return'Examine '+(spot||t.replace(/_/g,' '))+cnt;
  case'collect':return'Find '+(o.noun||t.replace(/_/g,' '))+cnt;
  case'catch':return'Catch '+t+cnt;case'catch_any':return'Catch any Alienmon'+cnt;case'catch_type':return'Catch a '+t+'-type'+cnt;
  case'win_battle':return'Win battles'+(IDX[t]!=null?' vs '+t:'')+cnt;
  case'battle_trainer':case'battle_rival':case'defeat_boss':return'Battle: '+(spot||t.replace(/_/g,' '))+cnt;
  case'defeat_keeper':return'Beat the Keeper of '+((PL.find(p=>p.key===t)||{}).name||t);
  case'use_item':return'Use a '+itemName(t)+' in battle'+cnt;
  case'deliver':return'Bring '+qA(itemName(t))+' to '+(QI[q.id].giver.name||'them');
  case'show':return'Show a '+t.replace('type:','')+'-type Alienmon';
  case'xenodex':return'Catch '+c+' kinds ('+Object.keys(G.caught).length+'/'+c+')';
  case'legendary_encounter':return'Face '+t;
  default:return spot||t}}
function qWhere(q){const s=qs(q.id),o=qObj(q),l=(o&&qLoc(q.id,s.step,o.location))||q.location||{};return l.area==='molten_frontier'?'Molten Frontier':((PL.find(p=>p.key===l.planet)||{}).name||'')}

/* ---- things quests put into the world: givers, props, trainers, legendaries ---- */
const QART={sola_1:'sola',admin_vex:'vex',admin_bronn:'bronn',director_thorne:'thorne',orra_venn:'orra',quorum_marisol:'marisol',quorum_harrow:'harrow',quorum_saga:'saga',quorum_ostrander:'ostrander',
 quorum_all_rematch:'marisol',helix_dock_grunt:'helix_helix_grunt',helix_spore_grunt:'helix_helix_grunt',fortress_guard:'helix_helix_grunt',ferrox_junkers:'technician',pyros_miners:'miner',static_dancers:'civilian'};
const QNAME={sola_1:'Sola',admin_vex:'Admin Vex',admin_bronn:'Admin Bronn',director_thorne:'Director Thorne',orra_venn:'Orra Venn',quorum_marisol:'Marisol Fenn',quorum_harrow:'Duke Harrow',
 quorum_saga:'Saga',quorum_ostrander:'General Ostrander',quorum_all_rematch:'The Quorum',helix_dock_grunt:'Helix Grunt',helix_spore_grunt:'Helix Grunt',fortress_guard:'Helix Guard',ferrox_junkers:'Junker',pyros_miners:'Miner',static_dancers:'Dancer'};
const qTitle=id=>QNAME[id]||id.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
const QTRAINER=new Set(['battle_trainer','battle_rival','defeat_boss']);
// spread several pickups around one spot
const QPROP_GIVES={forge_terminal:'helix_keycard'};
const QSPREAD=[[0,0],[34,10],[-30,14],[12,-26],[-14,30],[40,-18]];

let qEntCache=null,qEntFrame=-1;
function qEnts(){if(qEntFrame===frame&&qEntCache)return qEntCache;qEntFrame=frame;const E=[];if(!G||!G.quests){return qEntCache=E}
 for(const q of QUESTS){const s=qs(q.id);
  if(q.type==='side'&&s.state==='available'&&qPrereqsDone(q)&&qRested(q)){const l=qLoc(q.id,'giver',q.location);if(l&&l.x!=null&&qSameArea(l))E.push({k:'giver',q,x:l.x,y:l.y,art:q.giver&&q.giver.art,mon:q.giver&&q.giver.mon,mark:'!'})}
  if(s.state!=='active')continue;const o=qObj(q);if(!o)continue;const l=qLoc(q.id,s.step,o.location);
  if(o.type==='deliver'||o.type==='show'){const g=qLoc(q.id,'giver',q.location);if(g&&g.x!=null&&qSameArea(g))E.push({k:'turnin',q,o,x:g.x,y:g.y,art:q.giver&&q.giver.art,mark:'?'});continue}
  if(!l||l.x==null||!qSameArea(l))continue;
  if(o.type==='talk')E.push({k:'talk',q,o,x:l.x,y:l.y,art:l.art||null,mark:'?'});
  else if(o.type==='examine'||o.type==='collect'){const c=o.count||1;for(let i=0;i<c;i++)if(!s.got.includes(i)){const d=QSPREAD[i%QSPREAD.length],pp=l.pts&&l.pts[i%l.pts.length];E.push({k:'prop',q,o,i,x:pp?pp[0]*16+8:l.x+d[0],y:pp?pp[1]*16+15:l.y+d[1]})}}
  else if(QTRAINER.has(o.type)&&!(o.target.includes('|'))&&!/^mf\d+$/.test(o.target)){const tv=o.trainers&&o.trainers[s.n]||{};E.push({k:'trainer',q,o,x:l.x,y:l.y,art:tv.art||QART[o.target]||(q.giver&&q.giver.art)||'guard',mark:'!'})}
  else if(o.type==='legendary_encounter')E.push({k:'legend',q,o,x:l.x,y:l.y,mon:o.target,mark:'!'});
  else if(o.type==='visit'||o.type==='spot_event'){const pp=l.pts&&l.pts[Math.min(s.n,l.pts.length-1)];E.push({k:'beacon',q,o,x:pp?pp[0]*16+8:l.x,y:pp?pp[1]*16+15:l.y})}}
 return qEntCache=E}

function qNear(){const p=qPos();if(!p)return null;let best=null,bd=scene==='world'?14:40;for(const e of qEnts()){if(e.k==='beacon')continue;const d=Math.hypot(e.x-p[0],e.y-p[1]);if(d<bd){bd=d;best=e}}return best}

// story bosses and the rival use the progression levels and lead with their signature Alienmon
// [level key, ace, team size, hall type ('mix' = one of each), signature Alienmon who always come along]
const QBOSS={admin_bronn:['bronn','Bronnix',3],admin_vex:['vex','Vexhydra',4,null,['Hexcoil']],director_thorne:['thorne','Thornvoid',5],orra_venn:['orra','Firstlight',6,'mix'],
 quorum_marisol:[0,'Facetrix',5,'Crystal'],quorum_harrow:[1,'Encorex',5,'Sonic'],quorum_saga:[2,'Pyrelyth',5,'Plasma'],quorum_ostrander:[3,'Citadrake',5,'Gravity']};
const RIVAL_LV=[7,15,22,36,56,70];
const QBOSSPOOL={};function qBossPool(ty){if(QBOSSPOOL[ty])return QBOSSPOOL[ty];const ok=d=>!['legendary','mythic','starter','signature'].includes(d.r)&&!d.name.includes('(')&&wildOK(d.name);   /* no World-Echo forms */
 return QBOSSPOOL[ty]=D.map((d,i)=>i).filter(i=>ok(D[i])&&(D[i].t||[]).includes(ty))}
function evolvedAt(id,lv){let n=D[id].name;for(let i=0;i<3;i++){const ev=(PROG.species[n]||{}).evolves;if(ev&&ev.into&&/^Level/.test(ev.method||'Level')&&lv>=ev.level&&IDX[ev.into]!=null)n=ev.into;else break}return IDX[n]}
function bossTeam(q,o){const p=PL[G.planet]||PL[0],pool=p.pool.e.concat(p.pool.c).filter(id=>wildOK(D[id].name)),r=rng(hash(o.target)),fill=(n,lv)=>Array.from({length:n},()=>[evolvedAt(pool[Math.floor(r()*pool.length)],lv),lv]);
 const rv=/^sola_(\d)$/.exec(o.target);
 if(rv){const n=+rv[1],ace=RIVAL_LV[n-1]||7,mine=STARTERS.find(s=>G.caught[s])??STARTERS[0],counter=STARTERS[(STARTERS.indexOf(mine)+1)%3];
  return fill(n-1,Math.max(2,ace-2)).concat([[o.rival_stage&&typeof starterLine==='function'?IDX[starterLine(counter)[o.rival_stage-1]]:evolvedAt(counter,ace),ace]])}
 const b=QBOSS[o.target];if(!b)return null;const lv=(typeof b[0]==='number'?PROG.bosses.quorum[b[0]]:PROG.bosses[b[0]])+(o.lvup||0);   /* lvup: a stronger rematch */
 const sig=(b[4]||[]).filter(n=>IDX[n]!=null).map(n=>[IDX[n],lv-1]),n=b[2]-1-sig.length,ace=IDX[b[1]]??pool[0],seen=new Set([ace]),one=P=>{for(let k=0;k<40&&P.length;k++){const id=evolvedAt(P[Math.floor(r()*P.length)],lv-2);if(!seen.has(id)){seen.add(id);return[id,lv-2]}}return null};
 const rest=b[3]==='mix'?['Crystal','Sonic','Plasma','Gravity','Psi','Void','Hydro'].filter(t=>!(D[ace].t||[]).includes(t)).map(t=>one(qBossPool(t))).filter(Boolean).slice(0,n)
  :b[3]?Array.from({length:n},()=>one(qBossPool(b[3]))).filter(Boolean):fill(n,lv-2);
 return rest.concat(sig,[[ace,lv]])}
function qTeam(q,o){const bt=bossTeam(q,o);if(bt)return bt;const p=PL[G.planet]||PL[0],lv=(p.lv||[5,8])[1];
 if(o.team&&o.team.length)return o.team.map(([id,l])=>{if(id==='counter_starter'){const mine=STARTERS.find(s=>G.caught[s]);return[STARTERS[(STARTERS.indexOf(mine)+1)%3]??STARTERS[1],l]}return[IDX[id]!=null?IDX[id]:id,l]});
 const pool=p.pool.c.concat(p.pool.e),r=rng(hash(o.target)),boss=o.type==='defeat_boss',n=boss?3:2;
 return Array.from({length:n},(_,i)=>[pool[Math.floor(r()*pool.length)],lv+(boss?3:1)+i])}

function qInteract(e){const q=e.q;
 if(e.k==='giver'){qSay({q:q.id,kind:'offer',art:q.giver&&q.giver.art,lines:((q.dialogue&&q.dialogue.start||[]).length?q.dialogue.start:[q.title]).map(qFmt),after:()=>choose('Side mission: '+q.title,['Accept','Not now'],i=>{if(i===0){QN=QN.filter(m=>m.q!==q.id);qActivate(q);G.qtrack=q.id;QN=QN.filter(m=>!(m.q===q.id&&m.kind==='start'));say('Mission accepted: '+qPunct(q.title,'.')+' '+qPunct(qText(q),'.'))}})});return}
 if(e.k==='turnin'||e.k==='talk'){if(!qEvent('talk','q:'+q.id,{x:e.x,y:e.y})){const pg=((q.dialogue&&q.dialogue.progress)||[]).filter(l=>!/^Keep at it, Linker/.test(l));if(pg.length)qSay({q:q.id,kind:'progress',art:e.art||(q.giver&&q.giver.art),lines:pg.map(qFmt)});else say('Still to do: '+qPunct(qText(q),'.'))}return}
 if(e.k==='prop'){const s=qs(q.id);s.got.push(e.i);if(QPROP_GIVES[e.o.target]){G.key=G.key||{};G.key[QPROP_GIVES[e.o.target]]=1}const sp=qLoc(q.id,s.step,e.o.location).spot||e.o.target.replace(/_/g,' '),tx=e.o.texts&&e.o.texts[e.i];say(tx?[].concat(tx).map(qFmt):e.o.msg?qFmt(e.o.msg):e.o.type==='collect'?'You found '+qA(e.o.noun||e.o.target.replace(/_/g,' '))+'!':'You examine '+(/^(the|a|an) /i.test(sp)||/^[A-Z][\w.-]*'s /.test(sp)?'':'the ')+sp.replace(/^The /,'the ')+'.');qEvent('prop',e.o.target);return}
 if(e.k==='trainer'){if(!G.party.some(m=>m.hp>0)){say('Your team needs to heal first.');return}const o=Object.assign({},e.o,e.o.trainers&&e.o.trainers[qs(q.id).n]||{}),name=o.name||qTitle(o.target),team=qTeam(q,o);
  const tr={name,art:e.art,intro:qFmt(o.intro||'Let\'s see what your team can do!'),lose:qFmt(o.lose||'...You win this time.'),after:'Not bad, Linker.',team,bkey:o.target,ally:o.ally,sp:o.test==='orra'?{orra:1}:null,canLose:!!o.lose_ok,win:o.win&&qFmt(o.win),midEvo:!!o.mid_evo};   /* lose_ok: a story battle the book has you lose; the story goes on either way */
  say(name+': '+tr.intro,()=>startBattle(team.map(([id,lv])=>mk(id,lv)),tr),e.art);return}
 if(e.k==='legend'){if(!G.party.some(m=>m.hp>0)){say('Your team needs to heal first.');return}const id=IDX[e.mon];if(id==null)return;
  say(e.o.appear?qFmt(e.o.appear):'The air hums... '+e.mon+' appears!',()=>{NEXTB=e.o.listen?{immortal:1,listen:1}:null;startBattle([mk(id,e.o.lv||50)],null)});return}}

// markers and quest figures, drawn on painted towns (S = map zoom, cs = character size) and on the world map (S = 1)
function qDraw(cx,cy,S,cs){for(const e of qEnts()){const x=e.x*S-cx,y=e.y*S-cy;if(x<-20||x>180||y<-30||y>170)continue;
  if(e.k==='prop'){const t=(frame+e.i*7)%40;ctx.fillStyle=t<20?'#fff7a8':'#5ff2ff';ctx.fillRect(Math.round(x)-1,Math.round(y-4),3,3);ctx.fillRect(Math.round(x),Math.round(y-7),1,9);ctx.fillRect(Math.round(x-4),Math.round(y-3),9,1);continue}
  if(e.k==='beacon'){if(frame%30<20){ctx.fillStyle='rgba(95,242,255,0.55)';ctx.beginPath();ctx.ellipse(x,y,6*S/0.22*0.22+3,2.5,0,0,6.283);ctx.fill()}continue}
  if(e.k==='legend'){const im=OWI[e.mon];if(okI(im))ctx.drawImage(im,((frame>>4)&1)*64,0,64,64,Math.round(x-cs*0.6),Math.round(y-cs*1.2),Math.round(cs*1.2),Math.round(cs*1.2))}
  else if(e.mon){const im=OWI[e.mon];if(okI(im))ctx.drawImage(im,((frame>>4)&1)*64,0,64,64,Math.round(x-cs/2),Math.round(y-cs-1),cs,cs)}   // a quest giver that is an Alienmon
  else if(e.art&&!qPainted(e))dchar(e.art,Math.round(x-cs/2),Math.round(y-cs-1),cs,cs);
  if(e.mark){const my=Math.round(y-cs-17+Math.sin(frame/8)*1.5),done=e.k==='turnin'&&qReady(e),c=e.mark==='!'||done?'#ffd23f':'#d8d0e8',bx=Math.round(x-5);ctx.fillStyle='#1b1424';ctx.fillRect(bx,my,11,12);ctx.fillRect(bx+4,my+12,3,2);ctx.fillStyle=c;ctx.fillRect(bx+1,my+1,9,10);ctx.fillRect(bx+5,my+11,1,1);txt(e.mark,bx+3,my+3,'#1b1424',6)}}}
// a talk target that is already painted into the town art (or is a world NPC) only gets the marker
function qPainted(e){if(typeof secOn==='function'&&secOn())return!!secNpcAt(SWORLD[G.sec.id],Math.floor(e.x/16),Math.floor(e.y/16));if(scene==='world')return WORLD.npcs.some(n=>Math.hypot(n.x-e.x,n.y-e.y)<30);const P=paintOf();return!!(P&&P.hot.some(h=>(h.k==='talk'||h.k==='npc'||h.k==='mon')&&Math.hypot(h.x-e.x,h.y-e.y)<40))}
function qReady(e){const o=e.o;if(o.type==='deliver')return G.items[o.target]>0;if(o.type==='show'){const ty=o.target.replace(/^(type|mon):/,'');return G.party.some(m=>o.target.startsWith('mon:')?storyIsMon(m,ty):(D[m.id].t||[]).includes(ty))}return true}

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
 const ht=G.qtrack===q.id?'A: untrack':'A: track',tl=25,wh=(q.act?q.act+' · ':'')+qWhere(q),wl=s==='active'?Math.floor((152-ht.length*6-8)/6):25;txt(q.title.length>tl?q.title.slice(0,tl-1)+'…':q.title,6,94,'#ffd23f',6);txt(wh.length>wl?wh.slice(0,wl-1)+'…':wh,6,103,'#a99cc8',6);
 if(s==='active'){const w=wrap(qText(q),28);txt(w[0]||'',6,112,'#ffffff',6);if(w[1])txt(w[1],6,120,'#ffffff',6)}
 else txt(s==='done'?'Complete!':'Talk to '+((q.giver&&q.giver.name)||'them').slice(0,20)+' to start.',6,112,'#ffffff',6);
 const rt=qRewardText(q.rewards||{});if(rt)txt(('Reward: '+rt).slice(0,30),6,130,'#7dff6a',6);
 if(s==='active')txt(ht,154-ht.length*6,103,'#5ff2ff',6)}
