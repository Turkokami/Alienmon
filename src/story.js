
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
Object.assign(KEY_NAME,KEY_ITEMS);
Object.assign(KEY_DESC,{nana_badge:'A brass cross with a glowing blue core, stamped "R.B. No. 1". Mom pinned it on you.',teo_lantern:"Teo Reyes's old mining lantern. It never quite goes out.",
 crystal_map:'Teo\'s crystal map: "the floating gardens beyond the light."',nana_journal:'Nana Wren\'s journal from the night of the Starfall.',codex_page:'A Codex page Thorne copied: "a door that is a road."'});
Object.assign(QNAME,{sola_2:'Sola',sola_3:'Sola',sola_4:'Sola',sola_5:'Sola',sola_6:'Sola',admin_vex_final:'Admin Vex',helix_freighter_crew:'Helix Freighter Crew',helix_tower_crew:'Helix Tower Crew',helix_broadcast_crew:'Helix Broadcast Crew'});
Object.assign(QART,{sola_2:'sola',sola_3:'sola',sola_4:'sola',sola_5:'sola',sola_6:'sola',admin_vex_final:'vex',helix_freighter_crew:'guard',helix_tower_crew:'guard',helix_broadcast_crew:'guard'});

/* ---- your starter line and Sola's (she always takes the one that beats yours) ---- */
function starterLine(id){const L=[];let n=D[id].name;for(let i=0;i<3&&n;i++){L.push(n);const ev=(PROG.species[n]||{}).evolves;n=ev&&ev.into&&IDX[ev.into]!=null?ev.into:null}while(L.length<3)L.push(L[L.length-1]);return L}
function myStarter(){const all=G.party.concat(G.box);for(const s of STARTERS){const ln=starterLine(s);if(all.some(m=>ln.includes(D[m.id].name)))return s}return STARTERS.find(s=>G.caught[s])??STARTERS[1]}
const rivalStarter=()=>STARTERS[(STARTERS.indexOf(myStarter())+1)%3];
function qFmt(s){if(typeof s!=='string'||s.indexOf('{')<0||!G)return s;const a=starterLine(myStarter()),b=starterLine(rivalStarter());
 return s.replace(/\{starter(2|3)?\}/g,(_,n)=>a[(+n||1)-1]).replace(/\{rival(2|3)?\}/g,(_,n)=>b[(+n||1)-1])}

/* ---- things that happen when an objective or a quest completes ---- */
function storyIf(c){if(!c)return true;return Object.entries(c).every(([f,v])=>(G.flags[f]||0)===v)}
function storyThen(q,t){if(!t||!storyIf(t.if))return;const L=(t.lines||[]).slice();
 for(const[f,ls]of Object.entries(t.lines_if||{}))if(G.flags[f])L.push(...ls);
 for(const f of t.flags||[])G.flags[f]=1;
 for(const[k,n]of Object.entries(t.items||{})){if(KEY_ITEMS[k]){G.key[k]=1;L.push('You received '+KEY_ITEMS[k]+'!')}else if(k in G.pods){G.pods[k]+=n;L.push('You received '+n+'x '+itemName(k)+'!')}else{G.items[k]=(G.items[k]||0)+n;L.push('You received '+n+'x '+itemName(k)+'!')}}
 if(t.gift&&IDX[t.gift.name]!=null){const m=mk(IDX[t.gift.name],t.gift.lv||10);if(t.gift.nick)m.nick=t.gift.nick;const w=addMon(m);L.push(t.gift.name+' joined '+(w==='party'?'your team':'your Storage')+'!')}
 if(t.evolve==='starter'){const ln=starterLine(myStarter()),top=IDX[ln[2]],m=G.party.concat(G.box).find(m=>ln.includes(D[m.id].name));
  if(m&&m.id!==top){const was=nm(m);m.id=top;if(!m.nick){}m.hp=stat(m,0);G.seen[top]=G.caught[top]=1;L.push('...'+was+' is glowing!',was+' evolved into '+D[top].name+'!')}}
 if(L.length)QN.push({q:q.id,kind:'then',lines:L.map(qFmt),art:t.art})}

/* ---- section scenes: walk in at the right moment and the scene plays once ---- */
function storyWhen(w){if(!w)return true;if(w.active){const q=QI[w.active];if(!q||qs(w.active).state!=='active')return false;if(w.step!=null&&qs(w.active).step!==w.step)return false}
 if(w.after&&!mDone(w.after))return false;if(w.until&&mDone(w.until))return false;if(w.flag&&!G.flags[w.flag])return false;if(w.key&&!(G.key&&G.key[w.key]))return false;return true}
function storyEnter(id){if(!G||!G.quests)return;G.sseen=G.sseen||{};for(const sc of STORY.scenes||[]){if(sc.sec!==id||G.sseen[sc.id]||!storyWhen(sc.when))continue;G.sseen[sc.id]=1;
  for(const f of sc.flags||[])G.flags[f]=1;QN.push({q:sc.id,kind:'scene',lines:sc.lines.map(qFmt),art:sc.art})}}

/* ---- townsfolk with story extras: a line for when you carry a key item, and nurses who heal ---- */
function storyNpc(n){if(n.keyline&&G.key&&G.key[n.keyline.k]){if(n.story==='heal'){healAll();noteHeal()}say(n.keyline.t.map(qFmt).concat(n.story==='heal'?['Your team is fully healed!']:[]),null,n.por);return true}
 if(n.story==='heal'){healAll();noteHeal();say((n.t||[]).map(qFmt).concat(['Your team is fully healed!']),null,n.por);return true}
 if(n.t&&n.t.some(l=>l.indexOf('{')>=0)){say(n.t.map(qFmt),null,n.por);return true}return false}

/* ---- the Three Pillars test you before they battle (Book 5) ---- */
const PILLAR={Terravox:'strength',Aquelion:'memory',Ignarch:'courage'};
function storyLegend(n){const k=PILLAR[n.legend],go=()=>legendBattle({mon:n.legend,lvl:n.lv||60});if(!k||G.flags['test_'+k])return go();
 const pass=lines=>{G.flags['test_'+k]=1;say(lines.concat([n.legend+' accepts you. Now it tests your bond in battle!']),go)};
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
 if(tr&&tr.ally){const a=tr.ally,base=a.mon==='rival'?rivalStarter():IDX[a.mon];if(base!=null){const lv=a.lv||Math.max(...G.party.map(m=>m.lv));let id=a.mon==='rival'?IDX[starterLine(base)[a.evolve?2:1]]:base;
   const m=mk(id,lv);m.guest=1;m.nick=null;G.party.splice(Math.min(1,G.party.length),0,m);G.seen[id]=1;
   L.push(a.who+' fights beside you!');if(a.evolve&&a.mon==='rival')L.push(a.who+"'s "+starterLine(base)[1]+' is glowing... it evolved into '+D[id].name+'!');L.push(a.who+"'s "+D[id].name+' is ready to swap in from your team!')}}
 if(!tr&&B.team.length&&D[B.team[0].id].name==='Blightling'&&secOn()&&['160','161'].includes(G.sec.id))L.push('...It isn\'t attacking. It\'s reaching for your light. It\'s begging.')}
function storyAllyLeave(){if(G&&G.party.some(m=>m.guest)){G.party=G.party.filter(m=>!m.guest)}}
const storyRunLabel=()=>B&&B.sp&&B.sp.listen&&B.sp.turns>=3?'LISTEN':'RUN';
function storyImmortal(){if(!B||!B.sp||!B.sp.immortal)return;const e=EM();if(e.hp<=0){e.hp=Math.ceil(stat(e,0)*0.5);B.sp.grow=(B.sp.grow||0)+1;e.bs&&e.bs.atk<6&&e.bs.atk++}}
function storyListen(){B.phase='wait';const e=EM();
 say(['You stop the battle and step forward with Zib.','Everybody\'s somebody\'s somebody. You think it as hard as you can.','You ask Oblivane what it lost.','From far away, the Ystran Choir begins to sing. Hmm-mm-mmm.',
  'Oblivane remembers: it was the moon-spirit who carried the dying home as starlight. It never wanted to keep them. It just couldn\'t let go.','Two hundred years of swallowed light pour back into Ystra\'s sky as starlight.','Oblivane is calm. It drifts away, small and silver, toward the Seedmother\'s grove.'],
  ()=>{G.flags.oblivane_calmed=1;B.over=true;const back=B.from||'planet';qEvent('win',D[e.id].name,{});noteLegendWin(e);scene=back;B=null;G.grace=60;autosave()})}
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
function storyTrack(){if(scene==='planet'&&secOn()&&['049','162'].includes(G.sec.id))return'choir';if(scene==='cut'&&CUT&&/Rift closes|Signal song|Choir/.test(CUT.text||''))return'choir';return null}

/* ---- older saves: objectives inserted into a quest move the step on; new story quests count as done if you're past them ---- */
function storyMigrate(){const v=STORY.version||1;if((G.storyv||0)>=v)return;
 if(G.party.length&&(G.storyv||0)<v){for(const sh of STORY.shifts||[]){if((G.storyv||0)>=sh.v)continue;const s=qs(sh.q);if(s&&s.state==='active'&&s.step>=sh.at)s.step+=sh.n}
  for(const nq of STORY.inserted||[]){if((G.storyv||0)>=nq.v)continue;const s=qs(nq.q),nx=qs(nq.next);if(s&&nx&&nx.state!=='locked'){s.state='done';s.step=QI[nq.q].objectives.length}}}
 for(const k of STORY.keys||[])if(mDone(k.after)&&!(G.key&&G.key[k.k])){G.key=G.key||{};G.key[k.k]=1}   // story key items older saves missed
 G.storyv=v}
function storyCutLines(o){const L=(o.lines||QCUT[o.target]||[]).slice();for(const[f,ls]of Object.entries(o.lines_if||{}))if(G.flags[f])L.push(...ls);return L}
