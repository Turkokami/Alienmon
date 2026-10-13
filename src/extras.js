
/* ---------- field gear, fast travel and the town map (section maps) ----------
 Gear lives under START > Gear. Each piece registers itself in GEAR with a label and a use function, and only shows
 once you own it. G.visited remembers every section you have stood in (the town map's fog of war and the Warp
 Beacon's list of Recovery Bays come from it). */
const GEAR=[];
const GEAR_NAME={warp_beacon:'Warp Beacon',hover_board:'Hover Board'};
const GEAR_DESC={warp_beacon:'Beams you to any Recovery Bay you have visited. START > Gear.',hover_board:'Glide around twice as fast outdoors. Toggle it in START > Gear.'};
Object.assign(KEY_NAME,GEAR_NAME);Object.assign(KEY_DESC,GEAR_DESC);
function secVisit(id){G.visited=G.visited||{};G.visited[id]=1}
const secOutdoors=s=>!['interior','cave','tower','dungeon'].includes(s.type);
const onSurface=()=>secOn()&&(PREV==='planet'||scene==='planet');
// new gear arrives as the story goes on (checked with the Linker modules, and on every arrival)
function extrasBeats(){if(!G||!G.party||!G.party.length)return;G.key=G.key||{};const give=(k,lines)=>{if(G.key[k])return;G.key[k]=1;qNotify('GEAR','gear',lines)};
 if(G.shards>=1)give('hover_board',['Dr. Vashti is calling on your Linker!','"Congratulations on your first Signal Shard! I\'m sending you my old Hover Board."','You received the Hover Board! Turn it on in START > Gear. It glides twice as fast outdoors.']);
 if(G.shards>=2)give('warp_beacon',['Dr. Vashti is calling on your Linker!','"Two Shards! You\'ll be travelling a lot now, so take this Warp Beacon."','You received the Warp Beacon! It beams you to any Recovery Bay you have visited. START > Gear.']);
 dexBeats();eventBeats();for(const g of GEAR)if(g.beat)g.beat()}
function gearMenu(){extrasBeats();const L=GEAR.filter(g=>g.has());
 if(!L.length)return say('No field gear yet. Gear like the Hover Board turns up as your journey goes on.');
 choose('Gear',L.map(g=>g.label()).concat(['Back']),i=>{if(L[i])L[i].use()})}

/* ---- Warp Beacon: fast travel to any visited Recovery Bay ---- */
const BAYS=Object.values(SWORLD).filter(s=>(s.objects||[]).some(o=>o.k==='bay')).map(s=>s.id).sort();
const bayLabel=id=>{const s=SWORLD[id];return s.pkey==='arena'?'Star Arena':s.name.replace(/ Recovery (Bay|Tent)$/,'')+' ('+s.planet+')'};
// the Frontier gate that leads to a planet, so walking off its landing edge takes you back the way the story does
function gateFor(pk){for(const s of Object.values(SWORLD))for(const w of s.warps)if(w.kind==='gate'&&(w.options?w.options.some(o=>o.planet===pk||o.section&&SWORLD[o.section]&&SWORLD[o.section].pkey===pk):w.to==='planet:'+pk&&!w.sub))return{id:s.id,at:w.at};return null}
function secWarpTo(id){const s=SWORLD[id],home=pidx('dustara'),p=pidx(s.pkey);
 SFADE={t:0,go:()=>{G.sub=null;G.planet=p>=0?p:home;const g=s.pkey==='dustara'?null:gateFor(s.pkey);G.secBack=g?{id:g.id,at:g.at,planet:home}:null;G.hover=G.hover&&secOutdoors(s);
  enterSection(id,s.spawns.default||s.spawns.door,'up');warpSfx();scene='planet';PREV='planet'}}}
function warpSfx(){try{if(!AC||musicMode==='off')return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.setValueAtTime(300,t);o.frequency.exponentialRampToValueAtTime(1400,t+0.35);g.gain.setValueAtTime(0.03,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.4);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+0.41)}catch(e){}}
GEAR.push({k:'warp_beacon',has:()=>!!G.key.warp_beacon,label:()=>'Warp Beacon',use(){
 if(!onSurface())return say('The Warp Beacon only locks on while you are walking on a world.');if(ARENA)return say('Not in the middle of an arena run!');
 const L=BAYS.filter(id=>G.visited&&G.visited[id]&&id!==G.sec.id);if(!L.length)return say('Warp Beacon: no other Recovery Bay is stored yet. Visit one and it is saved here.');
 choose('Warp to...',L.map(bayLabel).concat(['Cancel']),i=>{if(!L[i])return;prevBack();B=null;say('Warp Beacon: locking on to '+bayLabel(L[i])+'...',()=>secWarpTo(L[i]))})}});

/* ---- Hover Board: twice the walking pace outdoors ---- */
const secHoverOn=s=>!!(G.hover&&G.key&&G.key.hover_board&&s&&secOutdoors(s));
const secStepN=s=>secHoverOn(s)?4:SEC_STEP;
GEAR.push({k:'hover_board',has:()=>!!G.key.hover_board,label:()=>'Hover Board: '+(G.hover?'On':'Off'),use(){G.hover=!G.hover;
 say(G.hover?'You hopped on the Hover Board!'+(secOn()&&!secOutdoors(SWORLD[G.sec.id])?' (It works once you are back outdoors.)':''):'You put the Hover Board away.')}});
function secDrawBoard(x,y){const b=Math.round(Math.sin(frame/8));ctx.fillStyle='rgba(20,10,20,0.3)';ctx.beginPath();ctx.ellipse(x+8,y+16,7,2,0,0,6.283);ctx.fill();
 ctx.fillStyle='#1b1424';ctx.fillRect(x+1,y+12+b,14,3);ctx.fillStyle='#5ff2ff';ctx.fillRect(x+2,y+12+b,12,1);ctx.fillStyle=frame%20<10?'#ff8a1e':'#ffd23f';ctx.fillRect(x+2,y+15+b,2,1);ctx.fillRect(x+12,y+15+b,2,1)}

/* ---- the town map: the planet's outdoor sections laid out by their grid, with fog over places you have not been ---- */
const SANCH={};
function secAnchor(id){if(id in SANCH)return SANCH[id];const seen={},go=i=>{const s=SWORLD[i];if(!s||seen[i])return null;seen[i]=1;if(s.grid)return i;
  if(s.parent){const a=go(s.parent);if(a)return a}for(const t of Object.values(SWORLD))if(t.warps.some(w=>w.to===i)){const a=go(t.id);if(a)return a}return null};return SANCH[id]=go(id)}
const secGroup=id=>SWORLD[id].dir+(SEC_FRONTIER.has(id)?'/frontier':'');
function secQuestMarks(){const M={};for(const q of QUESTS){const st=qs(q.id);let key=null;
  if(st.state==='active'){const o=qObj(q);key=o&&(o.type==='deliver'||o.type==='show')?q.id+':giver':q.id+':'+st.step}else if(q.type==='side'&&st.state==='available'&&qPrereqsDone(q))key=q.id+':giver';
  const sp=key&&SECQ[key];if(!sp)continue;const a=secAnchor(sp.s);if(a)M[a]=Math.max(M[a]||0,G.qtrack===q.id?2:1)}return M}
function secMapOpen(){const a=secAnchor(G.sec.id);if(!a){const sc=SWORLD[G.sec.id];return say('You are at '+sc.name+(sc.pkey==='arena'?', floating among the stars.':'.'))}
 const grp=secGroup(a),L=Object.values(SWORLD).filter(s=>s.grid&&secGroup(s.id)===grp);
 let W=0,H=0;for(const s of L){W=Math.max(W,s.grid[0]+s.tiles[0]);H=Math.max(H,s.grid[1]+s.tiles[1])}
 menuMode='secmap';B={L,sel:a,here:a,W,H,marks:secQuestMarks(),title:grp.endsWith('/frontier')?'Molten Frontier':SWORLD[a].planet}}
function secMapGeo(s){const k=Math.min(152/B.W,96/B.H),ox=Math.round((160-B.W*k)/2),oy=Math.round(18+(98-B.H*k)/2);return{k,x:ox+s.grid[0]*k,y:oy+s.grid[1]*k,w:s.tiles[0]*k,h:s.tiles[1]*k}}
function secMapUpd(){if(P_('b')||P_('a')||P_('start')){menuMode='root';B=null;return}
 for(const d of['left','right','up','down'])if(P_(d)){const c=secMapGeo(SWORLD[B.sel]),cx=c.x+c.w/2,cy=c.y+c.h/2;let best=null,bd=1e9;
  for(const s of B.L){if(s.id===B.sel)continue;const g=secMapGeo(s),dx=g.x+g.w/2-cx,dy=g.y+g.h/2-cy,al=d==='left'?-dx:d==='right'?dx:d==='up'?-dy:dy,side=d==='left'||d==='right'?Math.abs(dy):Math.abs(dx);
   if(al<=0.5)continue;const sc=al+side*2;if(sc<bd){bd=sc;best=s.id}}if(best)B.sel=best}
 secMapDraw()}
function secMapDraw(){rect(0,0,160,144,'#120c22');box(0,0,160,16,'#1b1424','#5ff2ff');txt('Map: '+B.title,5,4,'#5ff2ff',7);const V=G.visited||{};
 for(const s of B.L){const g=secMapGeo(s),x=Math.round(g.x),y=Math.round(g.y),w=Math.max(2,Math.round(g.w)),h=Math.max(2,Math.round(g.h));
  if(V[s.id]&&okI(SECI[s.id])){ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(SECI[s.id],x,y,w,h);ctx.restore()}
  else{rect(x,y,w,h,V[s.id]?'#3b2a5c':'#221836');ctx.strokeStyle='#3b2a5c';ctx.lineWidth=0.5;ctx.strokeRect(x+0.25,y+0.25,w-0.5,h-0.5)}
  const mk=B.marks[s.id];if(mk&&frame%40<30){box(x+w/2-3,y+h/2-4,7,9,mk===2?'#ffd23f':'#5ff2ff','#1b1424');txt('!',x+w/2-1,y+h/2-3,'#1b1424',6)}}
 const sg=secMapGeo(SWORLD[B.sel]);ctx.strokeStyle='#ffd23f';ctx.lineWidth=1;ctx.strokeRect(Math.round(sg.x)+0.5,Math.round(sg.y)+0.5,Math.round(sg.w)-1,Math.round(sg.h)-1);
 const hs=SWORLD[B.here],hg=secMapGeo(hs),inside=B.here===G.sec.id;
 if(frame%30<20){const px=Math.round(inside?hg.x+(G.sec.x+0.5)*hg.k:hg.x+hg.w/2),py=Math.round(inside?hg.y+(G.sec.y+0.5)*hg.k:hg.y+hg.h/2);rect(px-2,py-2,5,5,'#ffffff');rect(px-1,py-1,3,3,'#d7262e')}
 const sel=SWORLD[B.sel],known=V[sel.id];box(0,118,160,26,'#1b1424','#5ff2ff');txt(known?sel.name.replace(/^Molten Frontier: /,'').slice(0,26):'???',4,122,'#ffd23f',7);
 txt(B.marks[sel.id]?(B.marks[sel.id]===2?'Tracked quest here!':'A quest waits here.'):(B.sel===B.here?'You are here.':'Arrows: browse  B: back'),4,132,'#e8e0ff',6)}

/* ---- Bag pockets: Items / Pods / Key Items / Tech Discs (left and right switch pockets) ---- */
const POCKETS=['Items','Pods','Key Items','Tech Discs'];
function bagPockets(){const items=[{kind:'quick',n:'Quick heal team',c:'',d:'Uses the smallest Gels that will top up every hurt Alienmon on your team.'}].concat(bagList(false));
 const pods=PODS.map(p=>({kind:'pod',it:p,n:p.n,c:G.pods[p.k]||0,d:(p.d||'A capture pod.')+' Use it in battle.'}));
 const discs=typeof discList==='function'?discList():[];
 return[{n:'Items',list:items},{n:'Pods',list:pods},{n:'Key Items',list:keyList()},{n:'Tech Discs',list:discs}]}
function quickHeal(){const gels=ITEMS.filter(i=>i.heal&&i.k!=='fullgel').sort((a,b)=>a.heal-b.heal),L=[];let used=0;
 for(const m of G.party){if(m.hp<=0)continue;let need=stat(m,0)-m.hp;while(need>0){const g=gels.find(i=>(G.items[i.k]||0)>0&&i.heal>=need)||gels.slice().reverse().find(i=>(G.items[i.k]||0)>0);if(!g)break;G.items[g.k]--;used++;const a=Math.min(g.heal,need);m.hp+=a;need-=a}}
 const fainted=G.party.filter(m=>m.hp<=0).length;
 say(used?['Used '+used+' Gel'+(used>1?'s':'')+'. '+(G.party.every(m=>m.hp<=0||m.hp>=stat(m,0))?'Your team is topped up!':'You ran out of Gels.')].concat(fainted?[fainted+' fainted Alienmon need a Revive Spark or a Recovery Bay.']:[]):
  [G.party.some(m=>m.hp>0&&m.hp<stat(m,0))?'You have no Gels left.':'Your team is already at full health.'])}
function bagDrawP(sel){const PK=bagPockets(),p=PK[B.pk||0];drawBag(p.list,sel,'< '+p.n+' >');if(!p.list.length)txt(p.n==='Tech Discs'?'No Tech Discs yet.':'Nothing here yet.',6,20,'#a99cc8',7)}

/* ---- your lead Alienmon follows one tile behind you ---- */
let SFOL=null;
const followOn=()=>!(G.opt&&G.opt.noFollow)&&G.party.some(m=>m.hp>0);
function secFollowStep(x,y){if(!G.sec)return;SFOL=SFOL&&SFOL.sec===G.sec.id?{sec:G.sec.id,from:SFOL.at,at:[x,y]}:{sec:G.sec.id,from:[x,y],at:[x,y]}}
function secFollowDraw(people,s,cx,cy,p){if(!SFOL||SFOL.sec!==s.id||!followOn())return;const m=G.party.find(m=>m.hp>0),name=D[m.id].name,im=OWI[name];if(!okI(im))return;
 const t=SM?p:1,fx=(SFOL.from[0]+(SFOL.at[0]-SFOL.from[0])*t)*16,fy=(SFOL.from[1]+(SFOL.at[1]-SFOL.from[1])*t)*16;
 if(!SM&&SFOL.at[0]===G.sec.x&&SFOL.at[1]===G.sec.y)return;
 people.push({y:fy-1,draw:()=>{const X=Math.round(fx-cx),Y=Math.round(fy-cy);ctx.fillStyle='rgba(20,10,20,0.35)';ctx.beginPath();ctx.ellipse(X+8,Y+15,6,2,0,0,6.283);ctx.fill();
  ctx.save();ctx.imageSmoothingEnabled=true;if(typeof monFilter==='function')monFilter(m);ctx.drawImage(im,((frame>>4)&1)*64,0,64,64,X-2,Y-5-(SM?Math.round(Math.sin(t*Math.PI)):0),20,20);ctx.restore()}})}
GEAR.push({k:'follow',has:()=>G.party.length>0,label:()=>'Follower: '+(G.opt&&G.opt.noFollow?'Off':'On'),use(){G.opt=G.opt||{};G.opt.noFollow=!G.opt.noFollow;
 say(G.opt.noFollow?'Your Alienmon will ride in its pod.':nm(G.party.find(m=>m.hp>0)||G.party[0])+' is happy to walk with you!')}});

/* ---- gifts: one helper for items, pods, stardust and key items ---- */
function giveAll(gift,L){for(const[k,n]of Object.entries(gift)){if(k==='dust'){G.dust+=n;L.push('You received '+n+' Stardust!')}
  else if(k in GEAR_NAME){G.key[k]=1;L.push('You received the '+(KEY_NAME[k]||k)+'!'+(KEY_DESC[k]?' '+KEY_DESC[k]:''))}
  else{if(G.pods&&k in G.pods)G.pods[k]+=n;else G.items[k]=(G.items[k]||0)+n;L.push('You received '+n+'x '+(ITEMS.concat(PODS).find(i=>i.k===k)||{n:k}).n+'!')}}return L}

/* ---- Xenodex milestones: Dr. Vashti sends a reward each time your registered count passes a mark ---- */
Object.assign(GEAR_NAME,{signal_finder:'Signal Finder',prism_charm:'Prismatic Charm',gold_dex:'Golden Xenodex'});
Object.assign(GEAR_DESC,{signal_finder:'Beeps when a hidden item is near. START > Gear.',prism_charm:'Prismatic Alienmon appear three times as often.',gold_dex:'Proof you registered every Alienmon. Dr. Vashti is speechless.'});
Object.assign(KEY_NAME,GEAR_NAME);Object.assign(KEY_DESC,GEAR_DESC);
const DEX_MS=[[10,{harmonic:5}],[25,{signal_finder:1,dust:1000}],[50,{maxrevive:3,singularity:2}],[100,{prism_charm:1}],[150,{fullgel:5,dust:5000}],[200,{singularity:10}],[250,{maxrevive:5,dust:10000}],[300,{gold_dex:1}]];
function dexBeats(){const n=Object.keys(G.caught||{}).length;G.dexms=G.dexms||0;for(const[k,gift]of DEX_MS){if(n<k||G.dexms>=k)continue;G.dexms=k;
  qNotify('DEX','gear',giveAll(gift,['Dr. Vashti is calling on your Linker!','"'+k+' Alienmon registered in your Xenodex! Here, you\'ve earned this."']))}}

/* ---- Prismatic Alienmon: rare colour variants of wild Alienmon (1 in 400; the Charm and Prismatic Night raise it) ---- */
const PRI_FILTER='hue-rotate(160deg) saturate(1.35) brightness(1.08)';
const priOdds=()=>(1/400)*(G.key&&G.key.prism_charm?3:1)*evMul('pri');
function priSfx(){try{if(!AC||musicMode==='off')return;const t=AC.currentTime;[1319,1568,2093,1568,2637].forEach((f,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(0.03,t+i*0.06);g.gain.exponentialRampToValueAtTime(0.001,t+i*0.06+0.15);o.connect(g).connect(AC.destination);o.start(t+i*0.06);o.stop(t+i*0.06+0.16)})}catch(e){}}
function priTwinkle(x,y,s){for(let i=0;i<4;i++){if((frame>>2)%4===i)continue;const a=frame/10+i*1.57,r=s*8+Math.sin(frame/7+i)*3,X=Math.round(x+s*8+Math.cos(a)*r),Y=Math.round(y+s*8+Math.sin(a)*r*0.8);
  ctx.fillStyle=i%2?'#fff6b0':'#b8fbff';ctx.fillRect(X,Y-1,1,3);ctx.fillRect(X-1,Y,3,1)}}
function monFilter(m){if(m&&m.pri)ctx.filter=PRI_FILTER}

/* ---- weekly events (your local calendar) ---- */
const EVENTS={3:{k:'exp',n:'Training Day',d:'Battles give 1.5x EXP all Wednesday.'},5:{k:'pri',n:'Prismatic Night',d:'Prismatic Alienmon are 4x as common on Friday night (2x by day).'},
 6:{k:'dust',n:'Lucky Day',d:'Every battle pays double Stardust on Saturday.'},0:{k:'swarm',n:'Swarm Sunday',d:'Rare Alienmon turn up 3x as often on Sunday.'}};
const weekEvent=()=>EVENTS[new Date().getDay()]||null;
function evMul(k){const e=weekEvent();if(!e||e.k!==k)return 1;return k==='exp'?1.5:k==='dust'?2:k==='pri'?(isNight()?4:2):1}
function evSwarm(name){const e=weekEvent();if(!e||e.k!=='swarm')return 1;const r=(PROG.species[name]||{}).rarity;return r==='rare'||r==='uncommon'?3:1}
function eventBeats(){const e=weekEvent(),day=new Date().toDateString();if(!e||G.evSeen===day)return;G.evSeen=day;qNotify('EVT','event',['Linker news: today is '+e.n+'!',e.d])}
GEAR.push({k:'calendar',has:()=>G.party.length>0,label:()=>'Events'+(weekEvent()?': '+weekEvent().n:''),use(){const e=weekEvent();
 say([e?'Today: '+e.n+'. '+e.d:'No event today. Check back tomorrow!','Every week: Wednesday Training Day, Friday Prismatic Night, Saturday Lucky Day, Sunday Swarm.',isNight()?'It is night: Void and Psi Alienmon are out in force.':'It is daytime: Bio and Plasma Alienmon are out in force.'])}});

/* ---- Mystery Gift: enter a gift code (stored only as a hash); each code works once per save ---- */
const GIFTS={b6dfe23fa4ee29070a5c902a1de7f028f6e823e53e508ae5994745605d8c3667:{n:'Welcome Linker pack',g:{harmonic:5,megagel:5,revive:2}},
 '83c51c1035f7d0d9b53c0d3cae34025f88446be295c5e9ff08f03a2dc02a9921':{n:'Stardust Rain',g:{dust:2000}},
 e6d0d77078234f38942db15e68e7e39d1fbb60f630fe04837131a8158eb26577:{n:'Prismatic Spark',mon:1}};
GEAR.push({k:'gift',has:()=>G.party.length>0,label:()=>'Mystery Gift',use(){if(!window.crypto||!crypto.subtle)return say('Mystery Gift needs a secure connection.');
 tradePanel('Mystery Gift','<p style="margin:0 0 8px">Enter a gift code.</p><input style="'+TA.replace('height:90px','height:auto')+';text-align:center" autocomplete="off" autocapitalize="characters" spellcheck="false"><div class="msg" style="min-height:14px;color:#ff8a1e"></div>',
  [['Redeem',async(b,close)=>{const h=await testerHash(b.querySelector('input').value),gift=GIFTS[h],msg=b.querySelector('.msg');if(!gift){msg.textContent='That code is not valid.';return}
    G.gifts=G.gifts||{};if(G.gifts[h]){msg.textContent='This save already received that gift.';return}G.gifts[h]=1;close();const L=['Mystery Gift: '+gift.n+'!'];
    if(gift.g)giveAll(gift.g,L);if(gift.mon){const id=STARTERS[Math.floor(Math.random()*STARTERS.length)],m=mk(id,10,{gift:1});m.pri=1;const w=addMon(m);L.push('A Prismatic '+D[id].name+' joined '+(w==='party'?'your team':'your Storage')+'!');priSfx()}
    autosave();say(L)},true],['Cancel',(b,close)=>close()]])}});
