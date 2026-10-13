
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
 if(G.shards>=3)give('signal_finder',['Dr. Vashti is calling on your Linker!','"Three Shards! Take my Signal Finder. Plenty of Linkers drop things and never find them again."','You received the Signal Finder! Use it in START > Gear to find hidden items.']);
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
 return[{n:'Items',list:items},{n:'Pods',list:pods},{n:'Key Items',list:keyList().concat(eggList())},{n:'Tech Discs',list:discs}]}
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

/* ---- hidden items: a few tiles on every outdoor map and cave hide something (A to search; the Signal Finder points the way) ---- */
const HID={};
const HID_LOOT=[[['gel',2],['cure',2],['stasis',3],['dust',150],['jammer',1]],[['megagel',2],['revive',1],['harmonic',2],['ether',1],['dust',400]],
 [['fullgel',1],['maxrevive',1],['harmonic',3],['jammer',2],['dust',900]],[['singularity',1],['maxrevive',2],['fullgel',2],['dust',2000]]];
const secTier=s=>Math.min(3,Math.floor(Math.max(0,pidx(s.pkey==='arena'?'dustara':s.pkey))/4)+(SEC_FRONTIER.has(s.id)?0:0));
function secHidden(s){if(s.id in HID)return HID[s.id];if(s.type==='interior'||s.type==='arena')return HID[s.id]=[];
 const r=rng(hash('hid'+s.id)),main=secMain(s),busy=new Set();for(const w of s.warps){busy.add(w.tile+'');busy.add(w.at+'')}for(const n of s.npcs||[])busy.add(n.x+','+n.y);for(const m of s.mons||[])busy.add(m.x+','+m.y);
 for(const o of s.objects||[])busy.add(o.tile+'');for(const v of Object.values(s.spawns||{}))if(v)busy.add(v+'');for(const sp of Object.values(SECQ))if(sp.s===s.id){busy.add(sp.x+','+sp.y);for(const p of sp.pts||[])busy.add(p+'')}
 const ok=[...main].filter(k=>{const[x,y]=k.split(',').map(Number);return s.rows[y][x]==='.'&&x>0&&y>0&&x<s.tiles[0]-1&&y<s.tiles[1]-1&&!busy.has(k)}).sort();
 const n=Math.min(ok.length,s.tiles[0]*s.tiles[1]>400?2:1),out=[],tier=secTier(s);
 for(let i=0;i<n;i++){const k=ok.splice(Math.floor(r()*ok.length),1)[0];if(!k)break;const[x,y]=k.split(',').map(Number);
  const disc=r()<(s.type==='cave'||s.type==='landmark'||s.type==='tower'?0.45:0.2),L=HID_LOOT[tier][Math.floor(r()*HID_LOOT[tier].length)];
  out.push({x,y,item:disc?'disc':L[0],n:disc?1:L[1],disc:disc?discPick(r,tier):null})}return HID[s.id]=out}
const hidLeft=s=>secHidden(s).filter(h=>!(G.hid&&G.hid[s.id+':'+h.x+','+h.y]));
function secFieldA(s,x,y){const kd=(KNOCK[s.id]||[]).find(d=>d[0]===x&&d[1]===y);if(kd)return knockDoor(s,kd);
 const h=hidLeft(s).find(h=>h.x===x&&h.y===y);if(!h)return;G.hid=G.hid||{};G.hid[s.id+':'+x+','+y]=1;stashSfx();
 if(h.disc!=null){G.discs=G.discs||{};const had=G.discs[h.disc];G.discs[h.disc]=1;return say(['You found something hidden on the ground!','It\'s a Tech Disc: '+MV[h.disc].n+'!'+(had?' (You already had it, so you sold the spare for 300 Stardust.)':' Teach it from Bag > Tech Discs.')],()=>{if(had)G.dust+=300})}
 if(h.item==='dust'){G.dust+=h.n;return say(['You found something hidden on the ground!',h.n+' Stardust!'])}
 const L=giveAll({[h.item]:h.n},['You found something hidden on the ground!']);say(L)}
GEAR.push({k:'signal_finder',has:()=>!!G.key.signal_finder,label:()=>'Signal Finder',use(){if(!onSurface())return say('The Signal Finder only works on a world\'s surface.');
 const s=SWORLD[G.sec.id],L=hidLeft(s);let world=0;for(const t of Object.values(SWORLD))if(t.pkey===s.pkey)world+=hidLeft(t).length;
 if(!L.length)return say(['...No signal in this area.',world?world+' signal'+(world>1?'s':'')+' left somewhere on this world.':'You found everything hidden on this world!']);
 const h=L.sort((a,b)=>Math.abs(a.x-G.sec.x)+Math.abs(a.y-G.sec.y)-Math.abs(b.x-G.sec.x)-Math.abs(b.y-G.sec.y))[0],dx=h.x-G.sec.x,dy=h.y-G.sec.y,d=Math.abs(dx)+Math.abs(dy);
 const dir=(dy<0?'north':dy>0?'south':'')+(dx&&dy?'-':'')+(dx>0?'east':dx<0?'west':'');
 say([d<=1?'BEEEEEP! It\'s right here! Face it and press A.':d<=4?'Beep-beep-beep! Something is very close, to the '+dir+'.':'Beep... beep... A signal to the '+dir+', about '+d+' steps away.',world+' signal'+(world>1?'s':'')+' left on this world.'])}});

/* ---- Tech Discs: reusable discs that teach a move to any Alienmon of that move's type ---- */
let DISCS=null;
function discAll(){if(DISCS)return DISCS;DISCS=[];MV.forEach((m,i)=>{if(m&&!m.sig&&m.t&&m.t!=='None'&&m.p>=45)DISCS.push(i)});return DISCS}
function discPick(r,tier){const A=discAll().slice().sort((a,b)=>MV[a].p-MV[b].p),q=Math.floor(A.length/4),lo=tier*q,hi=tier>=3?A.length:lo+q*2;return A[Math.min(A.length-1,lo+Math.floor(r()*Math.max(1,hi-lo)))]}
const discFits=(mi,m)=>(D[m.id].t||[]).includes(MV[mi].t);
function discList(){return Object.keys(G.discs||{}).map(Number).filter(mi=>MV[mi]).sort((a,b)=>MV[a].t.localeCompare(MV[b].t)||MV[a].n.localeCompare(MV[b].n))
 .map(mi=>({kind:'disc',mi,n:MV[mi].n,c:'',d:'Tech Disc ('+MV[mi].t+', power '+MV[mi].p+'). Teaches any '+MV[mi].t+'-type Alienmon. Never used up.'}))}
function discUse(e){const mi=e.mi,ok=G.party.filter(m=>discFits(mi,m)&&!m.moves.includes(mi));
 if(!ok.length)return say('None of your team can learn '+MV[mi].n+'. Only '+MV[mi].t+'-type Alienmon can (and not ones that already know it).');
 choose('Teach '+MV[mi].n+' to:',ok.map(m=>nm(m)+' Lv'+m.lv).concat(['Cancel']),i=>{const m=ok[i];if(!m)return;
  if(m.moves.length<4){m.moves.push(mi);return say(nm(m)+' learned '+MV[mi].n+'!')}
  choose('Forget which move?',m.moves.map(x=>MV[x].n).concat(['Cancel']),k=>{if(k>=m.moves.length)return;const old=MV[m.moves[k]].n;m.moves[k]=mi;if(m.ppm)delete m.ppm[mi];say(['1, 2 and... poof!',nm(m)+' forgot '+old+' and learned '+MV[mi].n+'!'])})})}

/* ---- Linker Phone: Linkers you have beaten on the section maps can be called for a rematch ---- */
const phoneList=()=>{const L=[];for(const s of Object.values(SWORLD))for(const n of s.npcs||[])if(n.trainer&&!n.trainer.app&&G.beaten[n.id])L.push({n,s});return L};
const trName=n=>n.trainer.name?((n.trainer.cls?n.trainer.cls+' ':'')+n.trainer.name):(n.t&&n.t[0]||'Linker').split(':')[0];
GEAR.push({k:'phone',has:()=>phoneList().length>0,label:()=>'Linker Phone',use(){const L=phoneList(),day=new Date().toDateString();G.rem=G.rem||{};G.remDay=G.remDay||{};
 const show=L.slice(-12).reverse();choose('Linker Phone',show.map(x=>trName(x.n).slice(0,18)+(G.rem[x.n.id]?' !':'')).concat(['Back']),i=>{const x=show[i];if(!x)return;const who=trName(x.n),where=x.s.name.replace(/^Molten Frontier: /,'');
  if(G.rem[x.n.id])return say(who+': I\'m waiting for you at '+where+'! Hurry up!');
  if(G.remDay[x.n.id]===day)return say(who+': We already talked today! Call me tomorrow.');G.remDay[x.n.id]=day;
  if(R()<0.6){G.rem[x.n.id]=1;return say(['Ring... ring...',who+': Hey, it\'s you! My team has been training hard.','Come find me at '+where+' for a rematch!'])}
  say(['Ring... ring...',who+': '+['I just saw a Prismatic Alienmon! ...It got away.','My partner learned a new move today!','Have you tried the Star Arena leagues yet?','I\'m still training. Call me again soon!'][Math.floor(R()*4)]])})}});
function secRematch(n){delete G.rem[n.id];const who=trName(n),top=Math.max(...G.party.map(m=>m.lv));
 const base=n.trainer.frontier?(frontierTeam({id:n.id})||[]):(townTrainer(secTrainerH(n)).team||[]),team=(base.length?base:[[STARTERS[0],5]]).map(([id,lv],i)=>{const l=Math.max(lv,top-2+(i===base.length-1?1:0));return[evolvedAt(id,l),l]});
 const tr={name:who,art:n.art,intro:'You came! Let\'s see how much we have both grown!',lose:'You\'re still way ahead of me... Call me again!',after:'Call me any time for another rematch.',team,bkey:'rem_'+n.id};
 if(!G.party.some(m=>m.hp>0))return say('Your team needs to heal first.');say(who+': '+tr.intro,()=>startBattle(team.map(([id,lv])=>mk(id,lv)),tr),n.art)}

/* ---- Nursery (Recovery Bay counter): leave an Alienmon, and every so often the nurse finds an Egg ---- */
const NURSE_STEPS=350,EGG_STEPS=500;
function baseForm(id){let n=D[id].name;for(let i=0;i<3;i++){const p=PREVO[n];if(!p||IDX[p.from]==null)break;n=p.from}return IDX[n]}
function nurseryMenu(){const N=G.nurse;
 if(!N)return choose('Nursery',['Leave an Alienmon','What is this?','Back'],i=>{if(i===1)return say(['Nurse: Leave one Alienmon with us. It earns a little EXP for every step you take.','Now and then we find an Egg beside it! Walk with an Egg and it hatches.'],nurseryMenu,'nurse');if(i!==0)return bayMenu();
  if(G.party.length<2)return say('Nurse: You need at least two Alienmon with you to leave one here.',nurseryMenu,'nurse');
  choose('Leave which?',G.party.map(m=>nm(m)+' Lv'+m.lv).concat(['Cancel']),k=>{const m=G.party[k];if(!m)return nurseryMenu();if(legendary(m))return say('Nurse: That one is far too powerful for our little Nursery!',nurseryMenu,'nurse');
   G.party.splice(k,1);G.nurse={m,steps:0,xp:0,egg:0};autosave();say('Nurse: We\'ll take good care of '+nm(m)+'.',null,'nurse')})},null,'nurse');
 const m=N.m;choose('Nursery: '+nm(m),(N.egg?['Collect the Egg']:[]).concat(['Take '+nm(m)+' back','Back']),i=>{const o=(N.egg?['egg']:[]).concat(['take','back'])[i];
  if(o==='egg'){G.eggs=G.eggs||[];if(G.eggs.length>=6)return say('Nurse: You can only carry 6 Eggs at a time!',null,'nurse');G.eggs.push({id:baseForm(m.id),steps:EGG_STEPS});N.egg=0;N.steps=0;autosave();return say(['Nurse: We found this Egg next to '+nm(m)+'!','You received an Alienmon Egg! It is in Bag > Key Items. Walk with it to hatch it.'],null,'nurse')}
  if(o==='take'){const lv=m.lv;if(N.xp){m.xp+=N.xp;while(m.lv<100&&m.xp>=xpFor(m.id,m.lv+1))m.lv++}m.hp=stat(m,0);const w=addMon(m);delete G.nurse;autosave();
   return say(['Nurse: Here is '+nm(m)+'!'+(m.lv>lv?' It grew to Lv'+m.lv+'!':''),nm(m)+' went to '+(w==='party'?'your team':'your Storage')+'.'],null,'nurse')}
  bayMenu()},null,'nurse')}
// every step on the maps: the Nursery Alienmon trains, Eggs warm up and hatch
function eggStep(){let hatched=false;if(G.nurse){const N=G.nurse;N.steps++;N.xp+=1;if(!N.egg&&N.steps>=NURSE_STEPS){N.egg=1;toast('The Nursery found an Egg!')}}
 for(const e of G.eggs||[]){e.steps--;if(e.steps<=0&&!hatched){hatched=true;G.eggs.splice(G.eggs.indexOf(e),1);const m=mk(e.id,5);if(R()<priOdds()*2)m.pri=1;G.seen[m.id]=1;
   say(['Oh? Your Egg is moving...','...','The Egg hatched into '+(m.pri?'a Prismatic ':'')+D[m.id].name+'!'],()=>{const w=addMon(m);if(w==='box')say(D[m.id].name+' was sent to your Storage.');autosave()});if(m.pri)priSfx();else stashSfx()}}return hatched}
const eggList=()=>(G.eggs||[]).map(e=>({kind:'key',n:'Alienmon Egg',c:'',d:e.steps>300?'It barely moves. It will take a while to hatch.':e.steps>100?'Something is moving inside! It should hatch soon.':'It is making sounds! It is about to hatch!'}));

/* ---- knocking on doors: drawn doors with no interior have residents who answer (items, trades, a Xenodex rater, gossip) ---- */
const KNOCK=__KNOCK__;
const KNOCK_CHAT=['Who is it? ...Oh, a Linker! Good luck on your journey!','*A sleepy voice*: Come back later, I\'m napping...','Grandma: In my day we caught Alienmon with our bare hands! ...Well, almost.',
 'Kid: Mom says I can get my own Alienmon next year!','Inventor: Don\'t open the door! My experiment is very, very fragile!','*Nobody answers. You can hear a TV playing an Arena match inside.*',
 'Collector: Did you know some Alienmon only come out at night?','Chef: Something smells good? That\'s Stardust stew. Secret recipe!'];
function knockKind(s,i){const h=hash('knock'+s.id+':'+i)%10;return h<3?'item':h<5?'trade':h<6?'rater':'chat'}
function knockDoor(s,d){const i=KNOCK[s.id].indexOf(d),key=s.id+':'+i,kind=knockKind(s,i),r=rng(hash('kn'+key));G.knock=G.knock||{};doorSfx();
 if(kind==='item'){if(G.knock[key])return say('*Knock knock* Resident: Did you use what I gave you? Good luck!');G.knock[key]=1;const L=HID_LOOT[secTier(s)][Math.floor(r()*4)];
  return say(['*Knock knock*','Resident: Oh! A visitor! Here, take this. I never use it anyway.'].concat(L[0]==='dust'?giveAll({dust:L[1]},[]):giveAll({[L[0]]:L[1]},[])))}
 if(kind==='rater'){const n=Object.keys(G.caught||{}).length;return say(['*Knock knock*','Professor Lyle: Ah, a Linker! Let me rate your Xenodex.','You have registered '+n+' Alienmon. '+(n<10?'A fine start! Get out there and catch more!':n<50?'Impressive progress! Keep it up!':n<150?'Remarkable! Dr. Vashti must be proud.':n<300?'Astonishing! Only a few more to go!':'A complete Xenodex! You are a living legend!')])}
 if(kind==='trade'){if(G.knock[key])return say('*Knock knock* Resident: My new partner and I are so happy. Thank you again!');
  const pool=(wildTable(s.pkey==='arena'?'dustara':s.pkey)||[]).map(x=>x.name).filter(x=>IDX[x]!=null),want=pool[Math.floor(r()*pool.length)];
  const all=Object.values(PROG.areas).flatMap(a=>(a.tier1||[]).map(x=>x.name)).filter(x=>IDX[x]!=null&&x!==want),give=all[Math.floor(r()*all.length)];
  if(!want||!give)return say('*Knock knock* ...Nobody is home.');const mine=G.party.filter(m=>D[m.id].name===want);
  const nick=['Pip','Mochi','Zoom','Bean','Nova','Tofu','Sprocket','Luna'][Math.floor(r()*8)];
  if(!mine.length)return say(['*Knock knock*','Resident: I\'m looking for a '+want+'. If you bring one on your team, I\'ll trade you my '+give+', '+nick+'!']);
  return choose('Trade your '+want+' for '+give+'?',['Trade','No thanks'],k=>{if(k!==0)return say('Resident: Aww. Come back if you change your mind!');const old=mine[0],lv=old.lv,m=mk(IDX[give],lv,{gift:1});m.nick=nick;m.ot='Resident';m.ob='trade';
   G.party[G.party.indexOf(old)]=m;G.knock[key]=1;G.seen[m.id]=G.caught[m.id]=1;autosave();say(['You traded '+nm(old)+' for '+nick+' the '+give+'!','Resident: Take good care of '+nick+'!'])})}
 say(['*Knock knock*',KNOCK_CHAT[Math.floor(r()*KNOCK_CHAT.length)]])}
