/* ---------- Skyfall: the living sky over the 14 worlds (docs/SKYFALL_PLAN.md) ----------
 Fronts:        each world has its own sky event. While one blows (2-hour windows), two types hit 1.3x harder in battles there,
                Alienmon of those types turn up twice as often, and Skyfall pods (from the original Ystra seedpod fall) land on the maps.
 Signal Storms: one world at a time hosts a moving colony of one Alienmon. It shifts to a new map every hour; meet five of
                the colony and its leader comes out (higher level, far better Prismatic odds).
 Signal Diving: with the Bubbub Ride earned, face any water and dive for a signal. A three-pulse timing game; better timing
                pulls rarer Alienmon. The Linker antenna improves at 5 and 10 Shards.
 Shard Resonance: once per battle (Bag), call down an earned Shard's world sky for 5 turns.
 Rift Breaches: at Starfall Rift a tear opens every other window; a corrupted giant comes through (real-time Linker Arena,
                three Linkers at your side). Calm it and it joins you. */
const SKY_H=36e5,OUTDOOR=new Set(['town','landmark','route','field']);
const SKYI=lazyImgs(__SKYART__);   /* the owner's Skyfall art (art/skyfall, cut by tools from art/raw/skyfall); plain shapes until it loads */
const skyImg=(k,x,y,w,h,a)=>{const i=SKYI[k];if(!okI(i))return false;ctx.save();if(a!=null)ctx.globalAlpha=a;ctx.imageSmoothingEnabled=true;ctx.drawImage(i,Math.round(x),Math.round(y),w,h||w*i.naturalHeight/i.naturalWidth);ctx.restore();return true};
let SKYTAG=null;   /* a front's icon in the corner for a moment when you walk into its weather */
const FRONTS={
 dustara:{n:'Dust Tide',t:['Swarm','Gravity'],tint:'rgba(214,170,90,0.16)',fx:'dust',d:'Sand rolls across the canyons.'},
 ferrox:{n:'Magnet Storm',t:['Alloy','Volt'],tint:'rgba(120,150,190,0.14)',fx:'sparks',d:'Scrap shivers and sparks jump between the heaps.'},
 sporeholm:{n:'Spore Bloom',t:['Toxin','Bio'],tint:'rgba(120,200,90,0.14)',fx:'spores',d:'The swamp exhales clouds of glowing spores.'},
 thalassa:{n:'Tide Surge',t:['Hydro','Sonic'],tint:'rgba(60,120,200,0.16)',fx:'rain',d:'Warm rain sweeps in off a rising sea.'},
 neonis:{n:'Grid Blackout',t:['Volt','Psi'],tint:'rgba(20,10,40,0.30)',fx:'blackout',d:'The city grid flickers out; only the neon hums.'},
 glyphos:{n:'Glyph Wind',t:['Psi','Crystal'],tint:'rgba(150,90,200,0.14)',fx:'glyphs',d:'Old runes lift off the ruins and drift on the wind.'},
 pyros:{n:'Ash Fall',t:['Magma','Plasma'],tint:'rgba(230,110,40,0.16)',fx:'embers',d:'Hot ash and embers rain from the vents.'},
 glacia:{n:'Aurora Surge',t:['Cryo','Crystal'],tint:'rgba(120,220,230,0.12)',fx:'aurora',d:'The aurora drops low enough to touch.'},
 helix:{n:'Bloom Cycle',t:['Bio','Alloy'],tint:'rgba(90,210,150,0.12)',fx:'leaves',d:'The station gardens burst into bloom.'},
 halo:{n:'Choir Winds',t:['Sonic','Psi'],tint:'rgba(255,200,230,0.12)',fx:'notes',d:'The winds sing through the cloud spires.'},
 umbra:{n:'Shadow Front',t:['Void','Gravity'],tint:'rgba(10,0,20,0.32)',fx:'shadow',d:'A deeper dark rolls over the dark world.'},
 starfall:{n:'Seedpod Shower',t:['Plasma','Gravity'],tint:'rgba(200,80,200,0.12)',fx:'stars',d:'Seedpods streak across the sky, just like the day the sky fell.'},
 apex:{n:'Prism Flare',t:['Crystal','Plasma'],tint:'rgba(200,230,255,0.12)',fx:'prism',d:'The relay array splits the sunlight into colour.'},
 ystra:{n:'Gravity Drift',t:['Gravity','Void'],tint:'rgba(70,60,140,0.16)',fx:'motes',d:'Rocks lift off the ground and hang in the air.'},
};
const skyWin=()=>Math.floor(Date.now()/(2*SKY_H));
const frontOn=(k,w)=>!!FRONTS[k]&&hash('front:'+k+':'+(w==null?skyWin():w))%100<40;
const secOut=s=>!!s&&OUTDOOR.has(s.type);
const skyKey=s=>s&&(s.pkey||s.zone);
function frontHere(){if(typeof secOn!=='function'||!secOn())return null;const s=SWORLD[G.sec.id];if(!secOut(s))return null;const k=skyKey(s);return frontOn(k)?Object.assign({k},FRONTS[k]):null}
const skyPI=k=>PL.findIndex(p=>p.key===k);
const skyOpenPL=(p,extra)=>((p.req&&p.req.s)||0)<=(G.shards||0)+(extra||0)&&!(p.req&&p.req.f&&!(G.flags&&G.flags[p.req.f]));   // worlds the player can reach
// the biggest level on a map's own encounter list, else the world's range
function skyLv(s){const T=ENC.s[s.id];const L=T&&T.e.length?Math.max(...T.e.map(e=>e[3])):0;const p=PL[skyPI(skyKey(s))];return L||(p?p.lv[1]:10)}
function skyFight(id,lv,lines,pri,lead){const m=mk(id,lv);if(pri&&!m.pri&&R()<priOdds()*pri)m.pri=1;if(lead)m.skyLead=1;
 say(lines,()=>{QWILD='wild_'+(skyKey(SWORLD[G.sec.id])||PL[G.planet].key);startBattle([m],null)})}

/* ---- per-map caches (recomputed when the map or the window changes) ---- */
const SKYC={};
function skyCache(name,key,fn){const c=SKYC[name];if(c&&c.key===key)return c.v;const v=fn();SKYC[name]={key,v};return v}
function skyTileIn(s,seed,ok){const r=rng(hash(seed));for(let i=0;i<60;i++){const x=Math.floor(r()*s.tiles[0]),y=Math.floor(r()*s.tiles[1]);if(ok(secTile(s,x,y)))return{x,y}}return null}

/* ---- Skyfall pods ---- */
function skyPodAt(s){if(!secOut(s)||!frontOn(skyKey(s)))return null;const w=skyWin(),id='p'+w+':'+s.id;
 return skyCache('pod',id,()=>hash('pod:'+id)%100<45?Object.assign({id},skyTileIn(s,'podxy:'+id,c=>c==='.'||c===',')||{x:-1,y:-1}):null)}
function skyPod(s){const p=skyPodAt(s);return p&&!(G.skyp&&G.skyp[p.id])?p:null}
function skyOpenPod(s,p){G.skyp=G.skyp||{};const w='p'+skyWin()+':';for(const k in G.skyp)if(!k.startsWith(w))delete G.skyp[k];G.skyp[p.id]=1;
 const pl=PL[skyPI(skyKey(s))],f=FRONTS[skyKey(s)];
 if(pl&&R()<0.6){const pool=pl.pool.r.concat(pl.pool.e).filter(i=>D[i]&&!['legendary','mythic'].includes(D[i].r));const id=pool[Math.floor(R()*pool.length)];
  if(id!=null){const[i2,lv]=clampWild(id,skyLv(s)+3,3);return skyFight(i2,lv,['A Skyfall pod! It fell in the '+f.n+'.','The pod cracks open... a wild '+D[i2].name+' bursts out!'],3)}}
 const drops=[['gel',3],['megagel',2],['revive',1],['ether',1]],[k,n]=drops[Math.floor(R()*drops.length)],dust=Math.round(ri(100,250)*evMul('dust'));
 G.items[k]=(G.items[k]||0)+n;G.dust+=dust;const it=ITEMS.find(x=>x.k===k);
 say(['A Skyfall pod! It fell in the '+f.n+'.','Inside: '+n+' '+(it?it.n:k)+(n>1?'s':'')+' and '+dust+' Stardust!'])}

/* ---- Signal Storms ---- */
const stormWin=()=>Math.floor(Date.now()/(3*SKY_H));
function stormNow(){const w=stormWin();return skyCache('storm',w+':'+(G.shards||0),()=>{
 const open=PL.filter(p=>skyOpenPL(p)&&FRONTS[p.key]);if(!open.length)return null;const r=rng(hash('storm:'+w));
 const pl=open[Math.floor(r()*open.length)],secs=Object.values(SWORLD).filter(s=>skyKey(s)===pl.key&&secOut(s)&&ENC.s[s.id]&&ENC.s[s.id].e.some(e=>e[4]!=='surf'));
 if(secs.length<1)return null;const wmin={};for(const s of secs)for(const e of ENC.s[s.id].e)if(e[4]!=='surf'&&IDX[e[0]]!=null&&!['legendary','mythic'].includes(D[IDX[e[0]]].r))wmin[e[0]]=Math.min(wmin[e[0]]||99,e[1]);
 const all=Object.keys(wmin),cut=all.map(n=>wmin[n]).sort((a,b)=>a-b)[Math.floor(all.length/2)]||99,N=all.filter(n=>wmin[n]<=cut);if(!N.length)return null;const name=N[Math.floor(r()*N.length)];   // a species from the rarer half of this world's wild list
 const trail=[];const pool=secs.slice();while(trail.length<3&&pool.length)trail.push(pool.splice(Math.floor(r()*pool.length),1)[0].id);
 return{w,key:pl.key,pname:pl.name,name,trail}})}
const stormHour=()=>Math.floor(Date.now()/SKY_H)%3;
function stormSec(st){return st.trail[Math.min(stormHour(),st.trail.length-1)]}
function stormMeet(s){const st=stormNow();G.storm=G.storm&&G.storm.w===st.w?G.storm:{w:st.w,n:0};G.storm.n++;
 const lead=G.storm.n>=6&&!G.storm.lead;if(lead)G.storm.lead=1;
 const[id,lv]=clampWild(IDX[st.name],skyLv(s)+(lead?5:1),lead?5:1);
 skyFight(id,lv,lead?['The whole colony scatters...','The '+st.name+' colony leader charges out!']:['The signal spikes! A '+st.name+' from the colony!'],lead?8:1.5,lead)}

/* ---- Rift Breaches (Starfall Rift) ---- */
const riftOpen=()=>hash('rift:'+skyWin())%2===0;
function riftHere(s){if(skyKey(s)!=='starfall'||!secOut(s)||!riftOpen()||typeof rtaStart!=='function')return null;const w=skyWin();if(G.rift&&G.rift[w])return null;
 return skyCache('rift',w+':'+s.id,()=>{const secs=Object.values(SWORLD).filter(x=>skyKey(x)==='starfall'&&secOut(x)).map(x=>x.id).sort();
  const pick=secs[hash('riftsec:'+w)%secs.length];if(pick!==s.id)return null;return Object.assign({w},skyTileIn(s,'riftxy:'+w,c=>c==='.'||c===',')||{x:-1,y:-1})})}
function riftEnter(s,r){const pl=PL[skyPI('starfall')],pool=pl.pool.r.concat(pl.pool.e).filter(i=>D[i]&&!['legendary','mythic'].includes(D[i].r));
 const boss=pool[hash('riftboss:'+r.w)%pool.length];
 choose('A Rift Breach! Something huge is coming through.',['Stabilise it','Not yet'],k=>{if(k!==0)return;
  say(['Three Linkers race over: "We\'ve got your back!"','A corrupted '+D[boss].name+' tears through the Rift!'],()=>{RTO.back='planet';rtaStart({rift:{w:r.w,boss},arena:skyPI('starfall'),diff:2})})})}

/* ---- the step hook: pods, rifts and storm colonies come before a normal grass roll ---- */
function skyStep(s,ct){skyBeats();
 const p=skyPod(s);if(p&&p.x===G.sec.x&&p.y===G.sec.y){skyOpenPod(s,p);return true}
 const r=riftHere(s);if(r&&r.x===G.sec.x&&r.y===G.sec.y){riftEnter(s,r);return true}
 const st=stormNow();if(st&&stormSec(st)===s.id&&ct===','&&!(G.grace>0)&&R()<0.14){stormMeet(s);return true}
 return false}
// news on the Linker: a new front on this world, a new storm, an open rift (each once per window)
function skyBeats(){if(!G||!G.sec)return;const s=SWORLD[G.sec.id],f=frontHere(),w=skyWin();
 if(f&&G.skyn!==f.k+w){G.skyn=f.k+w;toast(f.n+'! '+f.t.join(' & ')+' boosted');SKYTAG={k:'front_'+f.k,t:0}}
 const st=stormNow();if(st&&G.stormSeen!==st.w){G.stormSeen=st.w;qNotify('SKY','event',['Linker alert! Strong signal: a '+st.name+' colony on '+st.pname+'.','It moves to a new area every hour. Check START > Gear > Sky Report to track it.'])}
 if(riftOpen()&&G.riftSeen!==w&&(G.shards||0)>=9&&typeof rtaStart==='function'){G.riftSeen=w;qNotify('SKY','event',['Linker alert! A Rift Breach is open at Starfall Rift.','Something huge is coming through. Linkers are gathering!'])}
 const t=skyAntenna();if(G.key&&G.key.hydro_skiff&&(G.antenna||0)<t){const up=(G.antenna||0)>0;G.antenna=t;
  qNotify('GEAR','gear',up?['Dr. Vashti is calling on your Linker!','"Your antenna needs an upgrade for deeper signals. Sending it now!"','Linker antenna Mk '+t+'! Signal Dives find rarer Alienmon.']:['Mina is calling on your Linker!','"Splodge found this on the sea floor. It\'s a Linker antenna! Face any water and dive for a signal."','You can now Signal Dive! START > Gear > Signal Dive.'])}}

/* ---- Signal Diving ---- */
const skyAntenna=()=>1+((G.shards||0)>=5?1:0)+((G.shards||0)>=10?1:0);
let DIVE=null;
function skyWaterAhead(){const s=SWORLD[G.sec.id],d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[face]||[0,1];
 return secTile(s,G.sec.x,G.sec.y)==='~'||secTile(s,G.sec.x+d[0],G.sec.y+d[1])==='~'}
function skyDivePick(tier,bonus){const s=SWORLD[G.sec.id],T=ENC.s[s.id];let L=T?T.e.filter(e=>e[4]==='surf').map(e=>[e[0],e[1],e[2],e[3]]):[];
 if(!L.length){const pl=PL[skyPI(skyKey(s))]||PL[G.planet];L=pl.pool.c.concat(pl.pool.e,pl.pool.r).filter(i=>D[i]&&D[i].t.includes('Hydro')).map(i=>[D[i].name,3,pl.lv[0],pl.lv[1]])}
 if(!L.length)return null;const top=Math.max(...L.map(e=>e[1])),k=1+bonus*(0.5+tier*0.5);
 const W=L.map(e=>e[1]*Math.pow(k,2*(1-e[1]/top)));let x=R()*W.reduce((a,b)=>a+b,0);   // better locks favour the rarer (lower-weight) signals
 for(let i=0;i<L.length;i++){x-=W[i];if(x<=0)return L[i]}return L[L.length-1]}
function skyDiveStart(){if(!skyWaterAhead())return say('Face the water (or stand in it) to dive for a signal.');
 const tier=skyAntenna(),tg=skyDivePick(tier,0);if(!tg)return say('No signal here. Try somewhere with more water.');
 DIVE={tier,round:0,hits:0,t:0,x:0,dir:1,zone:0,shown:false,msg:'',target:tg};skyDiveZone();scene='dive'}
function skyDiveZone(){const w=12+DIVE.tier*6;DIVE.zw=w;DIVE.zone=10+Math.floor(R()*(120-w-20));DIVE.x=0;DIVE.dir=1;DIVE.spd=1.6+DIVE.round*0.7}
function skyDiveUpd(){const V=DIVE;if(!V){scene='planet';return}V.t++;drawPlanet();
 if(V.end){if(--V.end<=0){const v=V;DIVE=null;scene='planet';skyDiveDone(v)}else skyDiveDraw();return}
 V.x+=V.spd*V.dir;if(V.x>=120){V.x=120;V.dir=-1}if(V.x<=0){V.x=0;V.dir=1}
 if(P_('b')){DIVE=null;scene='planet';return say('You let the signal go.')}
 if(P_('a')){const hit=V.x>=V.zone&&V.x<=V.zone+V.zw;if(hit)V.hits++;V.msg=hit?'Locked!':'Missed...';V.round++;if(typeof sfx==='function')try{sfx(hit?'ok':'no')}catch(e){}
  if(V.round>=3)V.end=40;else skyDiveZone()}
 skyDiveDraw()}
function skyDiveDraw(){const V=DIVE,x0=20,y0=52,ty=D[IDX[V.target[0]]].t[0],hz=(hash(ty)%5)+2;
 if(!skyImg('dive_panel',8,34,144,72))box(8,34,144,76,'#120c22','#5ff2ff');skyImg('antenna_'+V.tier,128,84,14);txt('Signal Dive  Mk '+V.tier,14,39,'#5ff2ff',6);
 ctx.save();ctx.strokeStyle='#2e86de';ctx.lineWidth=1;ctx.beginPath();for(let i=0;i<=120;i++){const y=y0+14+Math.sin((i+V.t*1.5)/hz)*(ty==='Volt'?9*((i%6)<3?1:-1):8)*(V.round>0?1:0.4);i?ctx.lineTo(x0+i,y):ctx.moveTo(x0+i,y)}ctx.stroke();ctx.restore();
 if(!V.end){rect(x0+V.zone,y0,V.zw,28,'rgba(95,242,255,0.25)');rect(x0+Math.round(V.x),y0-2,2,32,'#ffd23f')}
 const art=okI(SKYI.dive_panel);for(let i=0;i<3;i++){const c=i<V.round?(i<V.hits?'#9be36b':'#ff5a3a'):null;if(art){if(c)rEllS(128+i*8.6,41.5,2.6,2.6,c,1)}else rect(126+i*8,39,6,5,c||'#3b2a5c')}
 txt(V.round>0?'Signal type: '+ty:'Press A in the bright band',14,83,'#e8e0ff',5);
 txt(V.end?(V.hits?'Pulling it up...':'It slipped away...'):(V.msg||'B: let go'),14,92,V.msg==='Missed...'?'#ff8a1e':'#9be36b',5)}
function skyDiveDone(V){if(!V.hits)return say('The signal faded into the deep.');
 const tg=V.hits>=2?skyDivePick(V.tier,V.hits-1)||V.target:V.target,id=IDX[tg[0]];if(id==null)return;
 const[i2,lv]=clampWild(id,ri(tg[2],tg[3])+(V.hits===3?2:0),V.hits===3?2:0);
 skyFight(i2,lv,[V.hits===3?'A perfect lock! Something rises fast...':'You reel the signal in...','A wild '+D[i2].name+' surfaces!'],V.hits===3?2:1)}

/* ---- Shard Resonance (battle Bag) ---- */
function skyShards(){return PL.filter(p=>FRONTS[p.key]&&G.beaten&&G.beaten[p.key])}
function skyReso(){if(B.reso)return say('You already resonated a Shard this battle.');const L=skyShards();if(!L.length)return say('Earn a Signal Shard from a Keeper first.');
 choose('Resonate which Shard?',L.map(p=>p.name+': '+FRONTS[p.key].n).concat(['Back']),i=>{const p=L[i];if(!p){B.phase='bag';return}
  B.reso=1;B.field={k:p.key,turns:5};B.phase='wait';const f=FRONTS[p.key];say(['Your '+p.name+' Shard resonates!','The '+f.n+' sweeps in! '+f.t.join(' and ')+' moves are boosted for 5 turns.'],()=>B.phase='menu')},()=>{B.phase='bag'})}
// battle hooks: a front blowing outside carries into the fight; resonance overrides it for 5 turns
function skyBattleStart(L){if(!B)return;const f=frontHere();if(f){B.field={k:f.k};L.push('The '+f.n+' blows across the battlefield! '+f.t.join(' and ')+' moves are boosted.')}}
const skyMod=t=>{const F=B&&B.field&&FRONTS[B.field.k];return F&&F.t.includes(t)?1.3:1};
function skyEndTurn(L){const F=B&&B.field;if(!F||F.turns==null)return;if(--F.turns<=0){B.field=null;const f=frontHere();if(f)B.field={k:f.k};L.push('The Shard\'s resonance fades.')}}

/* ---- drawing on the map: the front's sky, pods, the rift ---- */
const SKYFX={dust:{c:['#e8c27a','#c9a35c'],vx:1.4,vy:0.2,n:26,s:1},sparks:{c:['#ffd23f','#9fd8ff'],vx:0.3,vy:0.9,n:14,s:1,blink:1},spores:{c:['#b6f26b','#d7a6ff'],vx:0.2,vy:-0.3,n:22,s:2},
 rain:{c:['#9fd8ff'],vx:-0.6,vy:3.2,n:40,s:1,streak:1},blackout:{c:['#ff3fa6','#5ff2ff'],vx:0,vy:0,n:8,s:1,blink:1},glyphs:{c:['#d7a6ff','#ff9be9'],vx:0.4,vy:-0.4,n:12,s:2,glyph:1},
 embers:{c:['#ff8a1e','#ffd23f'],vx:0.3,vy:-0.8,n:24,s:1},aurora:{c:['#ffffff'],vx:0.3,vy:0.6,n:20,s:1,band:1},leaves:{c:['#6be38a','#c7f26b'],vx:0.7,vy:0.5,n:16,s:2},
 notes:{c:['#ffffff','#ffb3dc'],vx:0.6,vy:-0.3,n:10,s:2,glyph:1},shadow:{c:['#3b1a5c'],vx:-0.4,vy:0,n:14,s:3},stars:{c:['#ffffff','#ff9be9','#ffd23f'],vx:2.2,vy:1.1,n:12,s:1,streak:1},
 prism:{c:['#ff5a5a','#ffd23f','#5ff2ff','#b45cff'],vx:0,vy:0.4,n:18,s:1,blink:1},motes:{c:['#c9c2ff','#8a7cd8'],vx:0,vy:-0.25,n:14,s:2}};
function skyGround(s,cx,cy){const pa=skyPodAt(s),p=skyPod(s),r=riftHere(s),t=frame;
 if(pa&&!p&&pa.x>=0)skyImg('pod_open',pa.x*16-cx+1,pa.y*16-cy+5,14);
 if(p&&p.x>=0&&skyImg('pod_'+(Math.floor(t/10)%4),p.x*16-cx+2,p.y*16-cy+1,12)){}else if(p&&p.x>=0){const X=p.x*16-cx+8,Y=p.y*16-cy+11,g=0.5+0.5*Math.sin(t/8);rEllS(X,Y+3,6,2,'#000',0.3);rEllS(X,Y-2-g,4,5,'#ffd23f',0.95);rEllS(X,Y-3-g,2,3,'#ffffff',0.9);rEllS(X,Y-2-g,8+g*2,8+g*2,'#ffd23f',0.15)}
 if(r&&r.x>=0&&skyImg('rift_'+(Math.floor(t/8)%4),r.x*16-cx-2,r.y*16-cy-14,20)){}else if(r&&r.x>=0){const X=r.x*16-cx+8,Y=r.y*16-cy+6;for(let i=0;i<3;i++)rEllS(X,Y,5+i*3+Math.sin(t/6+i)*1.5,10+i*3,['#b45cff','#ff3fa6','#2a0a3c'][i],0.5-i*0.12);rEllS(X,Y,2,7,'#ffffff',0.8)}
}
function skyDraw(s,cx,cy){const t=frame;
 if(SKYTAG&&++SKYTAG.t<180){const a=SKYTAG.t<15?SKYTAG.t/15:SKYTAG.t>150?(180-SKYTAG.t)/30:1;skyImg(SKYTAG.k,136,38,20,20,a)}else SKYTAG=null;
 const st=stormNow();if(st&&stormSec(st)===s.id)skyImg('storm',4,40,14,14,0.6+0.4*Math.sin(t/12));
 if(!secOut(s))return;const f=frontOn(skyKey(s))&&FRONTS[skyKey(s)];if(!f)return;const F=SKYFX[f.fx];
 ctx.fillStyle=f.tint;ctx.fillRect(0,0,160,144);
 if(F.band){for(let i=0;i<3;i++){ctx.save();ctx.globalAlpha=0.16;ctx.fillStyle=['#6bffb8','#5ff2ff','#b45cff'][i];ctx.beginPath();ctx.moveTo(0,10+i*8);for(let x=0;x<=160;x+=8)ctx.lineTo(x,10+i*8+Math.sin(x/20+t/40+i)*5);ctx.lineTo(160,0);ctx.lineTo(0,0);ctx.fill();ctx.restore()}}
 if(f.fx==='blackout'&&(t%180<6||t%180>170)){ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(0,0,160,144)}
 for(let i=0;i<F.n;i++){const h=hash('sky'+i),x=((h%160)+t*F.vx*(0.6+(h%7)/10))%160,y=(((h>>8)%144)+t*F.vy*(0.6+(h%5)/8))%144,X=(x+160)%160,Y=(y+144)%144;
  if(F.blink&&((t+h)%40)>8)continue;ctx.fillStyle=F.c[h%F.c.length];
  if(F.streak)ctx.fillRect(Math.round(X),Math.round(Y),1,F.s*4);else if(F.glyph)txt(f.fx==='notes'?'~':'+',Math.round(X),Math.round(Y),F.c[h%F.c.length],5);else ctx.fillRect(Math.round(X),Math.round(Y),F.s,F.s)}}
function rEllS(x,y,rx,ry,c,a){ctx.save();ctx.globalAlpha=a;ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,Math.max(0.5,rx),Math.max(0.5,ry),0,0,Math.PI*2);ctx.fill();ctx.restore()}

/* ---- World-Echo forms: Alienmon whose seedpods landed on another world (built by tools/build.js from data/echoes.json) ---- */
const ECHOS=D.map((d,i)=>d.echo?i:-1).filter(i=>i>=0);
function echoWild(L,water){const s=SWORLD[G.sec.id];if(!secOut(s))return;const w=skyKey(s),lo=Math.min(...L.map(e=>e[2])),hi=Math.max(...L.map(e=>e[3]));
 for(const i of ECHOS){const d=D[i];if(d.echo.w!==w||(d.t[0]==='Hydro')!==water)continue;L.push([d.name,Math.max(0.2,L.reduce((a,e)=>a+e[1],0)*0.035),lo,hi,water?'surf':'walk','any'])}}   /* about 1 in 30 encounters on its world */

/* ---- Gear: Sky Report and Signal Dive ---- */
GEAR.push({k:'skyreport',has:()=>true,label:()=>'Sky Report',use(){const w=skyWin(),left=Math.ceil(((w+1)*2*SKY_H-Date.now())/6e4);
 const on=PL.filter(p=>frontOn(p.key)&&skyOpenPL(p,1)).map(p=>p.name+': '+FRONTS[p.key].n+' ('+FRONTS[p.key].t.join('/')+')');
 const st=stormNow(),L=['Skyfall fronts now (next change in '+left+' min):'].concat(on.length?on:['Clear skies everywhere.']);
 if(st){const sec=SWORLD[stormSec(st)],m=60-Math.floor((Date.now()%SKY_H)/6e4);L.push('Signal Storm: a '+st.name+' colony on '+st.pname+', near '+(sec?sec.name:'?')+'. It moves in '+m+' min.')}
 if(riftOpen()&&typeof rtaStart==='function'&&(G.shards||0)>=9)L.push('A Rift Breach is open at Starfall Rift!');
 say(L)}});
GEAR.push({k:'skydive',has:()=>!!(G.key&&G.key.hydro_skiff),label:()=>'Signal Dive (Mk '+skyAntenna()+')',use(){if(scene!=='planet'||!secOn())return say('Dive from a map with water.');skyDiveStart()}});
Object.assign(GEAR_DESC,{skyreport:'Today\'s Skyfall fronts, the Signal Storm and any Rift Breach.',skydive:'Face water and dive for a signal.'});
