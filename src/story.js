
/* ---------- story engine: the book canon (docs/SAGA_MASTER_PLAN.md) on top of the quest system ----------
 Quest data (data/quests.json) can now carry:
   objective.then / quest.epilogue  {lines, art, if:{flag:value}, items, flags, gift:{name,lv}, evolve:'starter'}
                                     shown when that objective (or the whole quest) completes
   cutscene objective                {scene:'<scene art key>', title, lines, lines_if:{flag:[lines]}}
   choice objective                  {options, default}  (G.flags[target] = chosen index + 1)
   legendary_encounter               {skip_if:{flag,value,lines}, listen:1 (cannot be beaten; LISTEN calms it)}
   battle objectives                 {ally:{who,mon,lv,evolve}, intro, lose, test:'orra'}
 Text may use {starter} {starter2} {starter3} (your starter's line) and {rival} {rival2} {rival3} (Sola's).
 Section scenes (data/story_scenes.json) play once when you walk into a section at the right point in the story. */
const STORY=__STORY__;
Object.assign(KEY_ITEMS,{nana_badge:"Nana Wren's Badge",teo_lantern:"Teo's Lantern",crystal_map:"Teo's Crystal Map",nana_journal:"Nana Wren's Journal",codex_page:'Codex Page'});
Object.assign(KEY_ITEMS,{stowaway:'Stowaway',mom_backpack:"Mom's Backpack",teo_journal_page:'Teo\'s Journal Page',prophecy_shrine:'Prophecy Shrine'});Object.assign(KEY_NAME,KEY_ITEMS);
// Kit Briggs's art: until art/characters/kit.png exists, Kit borrows the Technician sprite
if(!CHAR.kit&&CHAR.technician)CHAR.kit=CHAR.technician;
Object.assign(KEY_DESC,{mom_backpack:'Snacks, a map and a spare pair of socks. It feels a little heavier than it should.',nana_badge:'A brass cross with a glowing blue core, stamped "R.B. No. 1". Mom pinned it on you.',teo_lantern:"Teo Reyes's old mining lantern. It never quite goes out.",
 crystal_map:'Teo\'s crystal map: "the floating gardens beyond the light."',nana_journal:'Nana Wren\'s journal from the night of the Starfall.',codex_page:'A Codex page Thorne copied: "a door that is a road."',teo_journal_page:'A page from Teo\'s journal. He copied one damaged line from Vashti\'s Codex: "She is scattered so she may live..." The rest is gone.',prophecy_shrine:'The Prophecy Shrine at Halo\'s third wind shrine: "She is scattered so she may live. Whoever reunites all her children will let the Seedmother grow again, and her world with her." Reunite, not cage.',stowaway:'The starter nobody picked at Dr. Vashti\'s lab. It hides in your bag and only peeks out for snacks.'});
Object.assign(QNAME,{sola_2:'Sola',sola_3:'Sola',sola_4:'Sola',sola_5:'Sola',sola_6:'Sola',admin_vex_final:'Admin Vex',helix_freighter_crew:'Helix Freighter Crew',helix_tower_crew:'Helix Tower Crew',helix_broadcast_crew:'Helix Broadcast Crew'});
Object.assign(QART,{sola_2:'sola',sola_3:'sola',sola_4:'sola',sola_5:'sola',sola_6:'sola',admin_vex_final:'vex',helix_freighter_crew:'guard',helix_tower_crew:'guard',helix_broadcast_crew:'guard'});

/* ---- your starter line and Sola's (she always takes the one that beats yours) ---- */
function starterLine(id){const L=[];let n=D[id].name;for(let i=0;i<3&&n;i++){L.push(n);const ev=(PROG.species[n]||{}).evolves;n=ev&&ev.into&&IDX[ev.into]!=null?ev.into:null}while(L.length<3)L.push(L[L.length-1]);return L}
function myStarter(){if(G.starter!=null&&D[G.starter])return G.starter;const all=G.party.concat(G.box);for(const s of STARTERS){const ln=starterLine(s);if(all.some(m=>ln.includes(D[m.id].name)))return s}return STARTERS.find(s=>G.caught[s])??STARTERS[1]}
const rivalStarter=()=>STARTERS[(STARTERS.indexOf(myStarter())+1)%3];
// the third starter, the one nobody picked: it stows away in your bag, then chooses Kit Briggs on Ferrox
const kitStarter=()=>STARTERS[(STARTERS.indexOf(myStarter())+2)%3];
function qFmt(s){if(typeof s!=='string'||s.indexOf('{')<0||!G)return s;const a=starterLine(myStarter()),b=starterLine(rivalStarter());
 const c=starterLine(kitStarter());return s.replace(/\{starter(2|3)?\}/g,(_,n)=>a[(+n||1)-1]).replace(/\{rival(2|3)?\}/g,(_,n)=>b[(+n||1)-1]).replace(/\{kit(2|3)?\}/g,(_,n)=>c[(+n||1)-1])}

/* ---- things that happen when an objective or a quest completes ---- */
function storyIf(c){if(!c)return true;return Object.entries(c).every(([f,v])=>(G.flags[f]||0)===v)}
function storyThen(q,t){if(!t||!storyIf(t.if))return;const L=(t.lines||[]).slice();storyPick(t,L);
 for(const[f,ls]of Object.entries(t.lines_if||{}))if(G.flags[f])L.push(...ls);
 for(const f of t.flags||[])G.flags[f]=1;
 for(const k of t.hide||[]){G.key=G.key||{};G.key[k]=1}   // given quietly: nobody knows it's there yet
 for(const[k,n]of Object.entries(t.items||{})){if(KEY_ITEMS[k]){G.key[k]=1;L.push('You received '+KEY_ITEMS[k]+'!')}else if(k in G.pods){G.pods[k]+=n;L.push('You received '+n+'x '+itemName(k)+'!')}else{G.items[k]=(G.items[k]||0)+n;L.push('You received '+n+'x '+itemName(k)+'!')}}
 if(t.gift&&IDX[t.gift.name]!=null){const m=mk(IDX[t.gift.name],t.gift.lv||10);if(t.gift.nick)m.nick=t.gift.nick;const w=addMon(m);L.push(t.gift.name+' joined '+(w==='party'?'your team':'your Storage')+'!')}
 if(t.evolve==='starter'){const ln=starterLine(myStarter()),top=IDX[ln[2]],m=G.party.concat(G.box).find(m=>ln.includes(D[m.id].name));
  if(m&&m.id!==top){const was=nm(m),from=m.id;m.id=top;m.hp=stat(m,0);G.seen[top]=G.caught[top]=1;L.push('...'+was+' is glowing!');
   QEVO={q:q.id,kind:'evo',evo:[from,top,m.pri],lines:[was+' evolved into '+D[top].name+'!']}}}
 if(L.length)QN.push({q:q.id,kind:'then',lines:L.map(qFmt),art:t.art});if(QEVO){QN.push(QEVO);QEVO=null}if(t.credits)QN.push({q:q.id,kind:'credits',credits:1});
 if(t.go&&SWORLD[t.go]){const g=SWORLD[t.go],go=()=>{G.sub=null;G.secBack=null;const p=pidx(g.pkey);if(p>=0)G.planet=p;enterSection(g.id,g.spawns.arrival||g.spawns.default,'down');scene='planet';PREV='planet';qPassive()};QN.push({q:q.id,kind:'go',go:()=>{if(secOn())SFADE={t:0,go};else go()}})}}   // walk or fly through to another place (Strand's shuttle, the Vortex to Ystra), once the lines before it are read
let QEVO=null;   // a story evolution plays its animation after the lines that lead up to it

/* ---- section scenes: walk in at the right moment and the scene plays once ---- */
function storyWhen(w){if(!w)return true;if(w.active){const q=QI[w.active];if(!q||qs(w.active).state!=='active')return false;if(w.step!=null&&qs(w.active).step!==w.step)return false}
 if(w.after&&!mDone(w.after))return false;if(w.until&&mDone(w.until))return false;if(w.flag&&!G.flags[w.flag])return false;if(w.key&&!(G.key&&G.key[w.key]))return false;if(w.noflag&&G.flags[w.noflag])return false;if(w.nokey&&G.key&&G.key[w.nokey])return false;return true}
function storyEnter(id){if(!G||!G.quests)return;G.sseen=G.sseen||{};for(const sc of STORY.scenes||[]){if(sc.sec!==id||G.sseen[sc.id]||!storyWhen(sc.when))continue;G.sseen[sc.id]=1;
  for(const f of sc.flags||[])G.flags[f]=1;for(const k of sc.take||[])if(G.key)delete G.key[k];G.seenCut=G.seenCut||{};
  const pc=sc.pic&&CUTPIC.find(c=>c.k===sc.pic.k),L=sc.lines.map(qFmt);   /* a story picture inside the scene replaces the lines it shows (skip) */
  if(pc&&!G.seenCut[pc.k]&&(!pc.st||(typeof myStarter==='function'&&G.party&&G.party.length&&D[myStarter()].name.toLowerCase()===pc.st))){G.seenCut[pc.k]=1;const sk=new Set(sc.pic.skip||[]),a=L.filter((l,i)=>i<sc.pic.at&&!sk.has(i)),b=L.filter((l,i)=>i>=sc.pic.at&&!sk.has(i));
   if(a.length)QN.push({q:sc.id,kind:'scene',lines:a,art:sc.art});QN.push({q:sc.id,kind:'pic',pic:pc,lines:L.filter((l,i)=>sk.has(i)),art:sc.art});if(b.length)QN.push({q:sc.id,kind:'scene',lines:b,art:sc.art})}
  else QN.push({q:sc.id,kind:'scene',lines:L,art:sc.art})}}

/* ---- townsfolk with story extras: a line for when you carry a key item, and nurses who heal ---- */
function storyNpc(n){if(n.keyline&&G.key&&G.key[n.keyline.k]){if(n.story==='heal'){healAll();noteHeal()}say(n.keyline.t.map(qFmt).concat(n.story==='heal'?['Your team is fully healed!']:[]),null,n.por);return true}
 if(n.story==='heal'){healAll();noteHeal();say((n.t||[]).map(qFmt).concat(['Your team is fully healed!']),null,n.por);return true}
 if(n.t&&n.t.some(l=>l.indexOf('{')>=0)){say(n.t.map(qFmt),null,n.por);return true}return false}

/* ---- the Three Pillars test you before they battle (Book 5) ---- */
const PILLAR={Terravox:'strength',Aquelion:'memory',Ignarch:'courage'};
function storyLegend(n){const k=PILLAR[n.legend],go=()=>legendBattle({mon:n.legend,lvl:n.lv||60});if(!k||G.flags['test_'+k])return go();
 const pass=lines=>{G.flags['test_'+k]=1;const all=['strength','memory','courage'].every(x=>G.flags['test_'+x]);say(lines.concat(all&&!G.flags.named_unifier?(G.flags.named_unifier=1,['The Three Pillars bow their great heads together.','The Pillars: Unifier.','You haven\'t caught them all. You\'re thirteen! How can you be the Unifier?','Liss: Nobody said catch.']):[]).concat([n.legend+' accepts you. Now it tests your bond in battle!']),go)};
 if(k==='strength'){const up=G.party.filter(m=>m.hp>0);if(up.length<3)return say(['Terravox lowers its forest-heavy head. A floating island above you groans and starts to fall.','Terravox: No one holds up an island alone. Come back with at least three partners beside you.']);
  return say(['Terravox: Hold it.','A floating island tilts and starts to fall toward the forest below.','You, '+up.map(nm).slice(0,3).join(', ')+' push together. Your arms shake. Nobody lets go.','The island steadies, then rises back into the sky.'],()=>pass(['Terravox: Strength is not one creature lifting. It is many refusing to let go.']))}
 if(k==='memory'){const ask=()=>choose('Aquelion offers to wash away your saddest memory.',['Keep the memory','Let Aquelion erase it'],i=>{
   if(i===1)return say(['The water rises around you... and stops.','Aquelion: If I take it, I take the people who held you through it too. Are you sure?'],ask);
   pass(['You shake your head. That memory is sad, but it has people you love in it.','Aquelion: You would rather hurt and remember. Then you are ready.'])});
  return say(['The sea goes perfectly still. Aquelion rises, and in its glassy eyes you see the saddest moment of your life.','Aquelion: I keep the dreams of the sleeping. I can take this one away. Forever.'],ask)}
 choose('Ignarch: Step into the Forge light alone. No partners.',['Step in alone','Not yet'],i=>{if(i!==0)return say('Ignarch waits. The heat does not move.');
  say(['You leave your partners at the edge and walk into the blinding light.','It is so hot and so bright that you can\'t see your own hands.','Then you hear it: a woman singing, low and kind. Hmm-mm-mmm. The same song the sporefolk sang.','It\'s Nana Wren\'s voice.'],()=>pass(['Ignarch: Courage is going in afraid. Your grandmother did, twenty years ago.']))})}

/* ---- battles: partners who fight beside you, Orra's test, and Oblivane, who can only be calmed ---- */
let NEXTB=null;
function storyBattleStart(tr,L){B.sp=(tr&&tr.sp)||NEXTB||null;NEXTB=null;if(B.sp)B.sp.turns=0;
 if(tr&&tr.ally){const a=tr.ally,base=a.mon==='rival'?rivalStarter():a.mon==='kit'?kitStarter():IDX[a.mon];if(base!=null){const lv=a.lv||Math.max(...G.party.map(m=>m.lv));let id=a.mon==='rival'?IDX[starterLine(base)[a.evolve?2:1]]:a.mon==='kit'?evolvedAt(base,lv):base;
   const m=mk(id,lv);m.guest=1;m.nick=null;G.party.push(m);G.seen[id]=1;
   L.push(a.who+' fights beside you!');if(a.evolve&&a.mon==='rival')L.push(a.who+"'s "+starterLine(base)[1]+' is glowing... it evolved into '+D[id].name+'!');L.push(a.who+"'s "+D[id].name+' is ready to swap in from your team!')}}
 if(B.sp&&B.sp.listen)L.push("Liss (far away): Don't fight it. When the moment comes... listen.");
 if(!tr&&B.team.length&&D[B.team[0].id].name==='Blightling'&&secOn()&&['160','161'].includes(G.sec.id))L.push('...It isn\'t attacking. It\'s reaching for your light. It\'s begging.')}
function storyAllyLeave(){if(G&&G.party.some(m=>m.guest)){const cur=B&&G.party[B.pi];G.party=G.party.filter(m=>!m.guest);
 if(B){const i=G.party.indexOf(cur);B.pi=i>=0?i:Math.max(0,G.party.findIndex(m=>m.hp>0));if(B.part)B.part=new Set([...B.part].filter(j=>j<G.party.length))}}}
const storyRunLabel=()=>B&&B.sp&&B.sp.listen&&B.sp.turns>=3?'LISTEN':'RUN';
function storyImmortal(){if(!B||!B.sp||!B.sp.immortal)return;const e=EM();if(e.hp<=0){e.hp=Math.ceil(stat(e,0)*0.5);B.sp.grow=(B.sp.grow||0)+1;e.bs&&e.bs.atk<6&&e.bs.atk++}}
function storyListen(down){B.phase='wait';const e=EM();
 say((down?['Your last partner falls. Oblivane\'s shadow closes over you...','...but you stand up anyway.']:[]).concat(['You stop the battle and step forward with Zib.','Everybody\'s somebody\'s somebody. You think it as hard as you can.','You ask Oblivane what it lost.','From far away, the Ystran Choir begins to sing. Hmm-mm-mmm.',
  'Oblivane remembers: it was the moon-spirit who carried the dying home as starlight. It never wanted to keep them. It just couldn\'t let go.','Two hundred years of swallowed light pour back into Ystra\'s sky as starlight.','Oblivane is calm. It drifts away, small and silver, toward the empty crater where the Heartroot glows.','Light returns to Ystra\'s sky... but the land stays bare. The job isn\'t finished.','Starlight falls over your team and heals every one of them.']),
  ()=>{G.flags.oblivane_calmed=1;healAll();B.over=true;const back=B.from||'planet';qEvent('win',D[e.id].name,{});noteLegendWin(e);scene=back;B=null;G.grace=60;autosave()})}
function storyMidBattle(){const s=B&&B.sp;if(!s||!s.orra||s.asked||!B.tr||B.ei!==B.team.length-1)return false;const e=EM();if(e.hp>stat(e,0)*0.6&&s.turns<4)return false;
 s.asked=1;B.phase='wait';say(['Orra\'s '+nm(e)+' gathers a blinding attack...','...and aims it straight at Zib!'],()=>choose('Orra is targeting Zib!',['Shield Zib','Attack'],i=>{
  if(i===0){G.flags.shielded_zib=1;say(['You throw yourself in front of Zib.','Orra lowers her hand. The attack fades to nothing.','Orra: That was the test. Could you carry what I carried? You just showed me.'],()=>enemyWin())}
  else{G.flags.shielded_zib=0;say(['You order the attack. Orra\'s eyes narrow, but she fights on.'],()=>B.phase='menu')}}))
 return true}
// Orra yields: the battle counts as won
function enemyWin(){for(const m of B.team)m.hp=0;endBattle(true)}

/* ---- music: the Spore Choir's hum (Book 1) at the Spore Pools, at the sealing and at the Edge of the Void ---- */
CHIP.choir={bpm:66,lead:0.5,chords:'F C Dm Bb F C Bb C',leadWave:'tri',drums:'none',arp:1,
 mel:['A4 - - G4 F4 - - -','G4 - - F4 E4 - - -','D4 - F4 - A4 - - G4','F4 - - - . . . .','A4 - - G4 F4 - - -','C5 - - Bb4 A4 - - -','G4 - Bb4 - A4 - G4 -','F4 - - - . . . .']};
function storyTrack(){if(scene==='planet'&&secOn()&&['714','162'].includes(G.sec.id))return'choir';if(scene==='cut'&&CUT&&/Rift closes|Signal song|Choir/.test(CUT.text||''))return'choir';return null}

/* ---- older saves: objectives inserted into a quest move the step on; new story quests count as done if you're past them ---- */
function storyMigrate(){const v=STORY.version||1;if((G.storyv||0)>=v)return;
 if(G.party.length&&(G.storyv||0)<v){for(const sh of STORY.shifts||[]){if((G.storyv||0)>=sh.v)continue;const s=qs(sh.q);if(s&&s.state==='active'&&s.step>=sh.at)s.step+=sh.n}
  for(const nq of STORY.inserted||[]){if((G.storyv||0)>=nq.v)continue;const s=qs(nq.q),nx=qs(nq.next);if(s&&nx&&nx.state!=='locked'){s.state='done';s.step=QI[nq.q].objectives.length}}}
 for(const k of STORY.keys||[])if(mDone(k.after)&&!(G.key&&G.key[k.k])&&!(k.noflag&&G.flags[k.noflag])){G.key=G.key||{};G.key[k.k]=1}   // story key items older saves missed
 if(v>=7){if(G.key&&G.key.prophecy_mural){delete G.key.prophecy_mural}if(mDone('M16')&&G.key)G.key.prophecy_shrine=1;for(const q of QUESTS){const s=qs(q.id);if(s&&s.state==='active'&&s.step>=q.objectives.length)qComplete(q)}}
 G.storyv=v}
function storyCutLines(o){const L=(o.lines||QCUT[o.target]||[]).slice();for(const[f,ls]of Object.entries(o.lines_if||{}))if(G.flags[f])L.push(...ls);return L}
// any stage of a species' line counts (a Chimelet that evolved into Chimeral still opens the doors)
function storyIsMon(m,name){let n=D[m.id].name;const seen=new Set();for(let i=0;i<3&&n;i++){seen.add(n);n=PREVO[n]&&PREVO[n].from}if(seen.has(name))return true;let b=name;for(let i=0;i<3&&b;i++){if(b===D[m.id].name)return true;const ev=(PROG.species[b]||{}).evolves;b=ev&&ev.into}return false}
// a cutscene or choice with 'at' only plays once you're standing in that section
function storyAt(o){return!o.at||(typeof secOn==='function'&&secOn()&&G.sec.id===o.at)}
// story locks on the Thalassa ships (data/sections/links.json warps with a node)
Object.assign(GATE_OPEN,{ghost_ship:()=>mDone('M07'),helix_freighter:()=>mDone('M17'),smuggler_freighter:()=>mDone('M19')});

/* ---------- the Seedmother revision (docs/SEEDMOTHER_REVISION.md): she is scattered in every Alienmon ----------
 The Heartroot's glow grows with every species you have registered as bonded: caught, or befriended in the story
 (a calmed Novaryx or Oblivane), out of every species in the game, so new generations raise the total. Each sixth of the way, a part of Ystra blooms and a Ystran echo returns.
 The Reunion ending never needs a full Xenodex; completing it is the bonus Unifier epilogue. */
const HEART_TOTAL=D.length,BLOOMS=['the Arrival Fragment','the Floating Continents','the Drowned Seas','the Crystal Ruins','the Blighted Forest','the Seedmother\'s crater'].map((w,i)=>[Math.round(HEART_TOTAL*(i+1)/6),w,i+1]);
function heartCount(){let n=Object.keys(G.caught||{}).length;const f=G.flags||{};
 if(f.novaryx_way===1&&IDX.Novaryx!=null&&!G.caught[IDX.Novaryx])n++;if(f.oblivane_calmed&&IDX.Oblivane!=null&&!G.caught[IDX.Oblivane])n++;return Math.min(HEART_TOTAL,n)}
function heartBeats(){if(!G||!G.flags)return;const n=heartCount();
 for(const[k,where,i]of BLOOMS)if(n>=k&&!G.flags['bloom_'+i]){G.flags['bloom_'+i]=1;if(mDone('P01'))qNotify('HEART','bloom',['Word from Ystra: '+where+' is starting to bloom!','Every Alienmon is a piece of her. '+k+' notes of her song have come home, and a Ystran echo has returned.'])}
 if(n>=HEART_TOTAL&&mDone('P04')&&!G.flags.unifier){G.flags.unifier=1;G.key.gold_dex=1;QN.push({q:'UNIFIER',kind:'scene',lines:[
  'Every kind of Alienmon in the Kessler system has bonded with you.','Under the Seedmother\'s tree, you walk with every Alienmon you have ever met. They hum the song together, each one still itself.',
  'Liss: The legend called for someone who would reunite all her children. Not catch them. Unite them.','You are named the Unifier!','(Your Linker shines gold now: the Unifier\'s Linker.)']})}
 document.body.classList.toggle('unifier',!!G.flags.unifier)}
// START > Xenodex: press A to switch to the Heartroot page
let DEXH=false;
const heartOpen=()=>!!(G&&(mDone('M16')||(G.key&&G.key.prophecy_shrine)));
function drawHeartroot(){const n=heartCount(),t=n/HEART_TOTAL;rect(0,0,160,144,'#0d0a18');box(0,0,160,16,'#1b1424','#9be36b');txt('Heartroot',5,4,'#9be36b',7);txt('A: list',112,5,'#5ff2ff',6);
 txt('Every Alienmon is',6,20,'#e8e0ff',6);txt('a piece of her.',6,29,'#e8e0ff',6);
 const cx=80,cy=104,g=10+t*34+Math.sin(frame/18)*2;ctx.save();const rg=ctx.createRadialGradient(cx,cy-8,2,cx,cy-8,g+14);rg.addColorStop(0,'rgba(155,227,107,'+(0.35+t*0.55).toFixed(2)+')');rg.addColorStop(1,'rgba(95,242,255,0)');ctx.fillStyle=rg;ctx.fillRect(cx-70,cy-70,140,90);ctx.restore();
 rect(40,cy+8,80,6,'#2a1f44');ctx.fillStyle='#6b4f2a';for(const[dx,w]of[[-14,3],[-6,2],[6,2],[13,3]])ctx.fillRect(cx+dx,cy+2,w,10);ctx.fillRect(cx-3,cy-14,6,18);
 const L=Math.floor(t*6);for(let i=0;i<L;i++){const a=-2.6+i*0.55,r=12+(i%2)*5;rect(Math.round(cx+Math.cos(a)*r)-2,Math.round(cy-16+Math.sin(a)*r)-2,5,4,i%2?'#9be36b':'#5ff2ff')}
 txt('Notes of her song',6,40,'#9be36b',6);txt(n+' / '+HEART_TOTAL,6,49,'#ffd23f',7);
 const nx=BLOOMS.find(([k])=>n<k);txt(nx?'Next bloom: '+nx[0]:'Ystra has fully bloomed',6,124,'#a99cc8',6);if(G.flags.unifier)txt('Title: Unifier',6,134,'#ffd23f',6);else txt('Caught + befriended species',6,134,'#6f6390',6)}
// choices whose follow-up lines depend on which option was picked
function storyPick(t,L){if(t&&t.pick){const v=(G.flags||{})[t.pick.flag];const ls=t.pick.lines&&t.pick.lines[v];if(ls)L.push(...ls)}}

/* ---- end credits: after the last epilogue (quest.epilogue.credits), a starfield roll over the ending picture with the main theme ---- */
let CRED=null;
const CRED_LINES=()=>{const tm=(G.party||[]).filter(m=>!m.guest).map(m=>m.nick||D[m.id].name),dex=Object.keys(G.caught||{}).length;
 return['ALIENMON','','Based on','The Alienmon Chronicles','by Kristofer Elling','','Created by','Kristofer Elling','','Story','The Kessler Signal','and the books that follow','','Music','Save the Stars','Let\'s Go, Alienmon!','and the full soundtrack','','Voices','The Alienmon voice cast','','Thanks to','every Linker League tester','who played it first','','Your team',...tm,'','Xenodex: '+dex+' / '+D.length,'','Every Alienmon is','a piece of her.','','Thank you for playing!','','THE END']};
function startCredits(){CRED={t:0,L:CRED_LINES(),im:boardImg('cut_73')&&okI(boardImg('cut_73'))?boardImg('cut_73'):boardImg('cut_62')}}
function drawCredits(){const c=CRED;c.t++;const n=c.L.length,low=66-96-(n-1)*11,top=Math.max(48-c.t*0.35,low),done=top===low;
 if(P_('a')||P_('b')){if(done&&c.t>(c.end||0)+30){CRED=null;return}if(!done)c.t+=150}if(done&&!c.end)c.end=c.t;
 rect(0,0,160,144,'#05030c');for(let i=0;i<40;i++){const x=(i*53)%160,y=(i*97+Math.floor(c.t/(2+i%3)))%144;rect(x,y,1,1,i%5?'#5a4f80':'#ffd23f')}
 if(c.im&&okI(c.im)){ctx.save();ctx.globalAlpha=Math.min(1,c.t/90);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(c.im,0,Math.round(Math.min(0,top)),160,90);ctx.restore()}
 c.L.forEach((l,i)=>{const y=Math.round(top+96+i*11);if(y<-10||y>150||!l)return;const big=i===0||l==='THE END',w=l.length*(big?8:6);txt(l,Math.round(80-w/2),y,big?'#ffd23f':/^(Based on|Created by|Story|Music|Voices|Thanks to|Your team)$/.test(l)?'#9be36b':'#e8e0ff',big?8:6)});
 if(done&&frame%60<40)txt('Press A',59,120,'#ff8a1e',6)}
