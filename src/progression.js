/* ---------- progression: data/progression.json, rules in docs/PROGRESSION_AND_LEVELING.md ----------
   tools/build.js inlines this file into the game script (same scope as the rest of the game). */
const PROG=__PROGRESSION__;
const spOf=id=>PROG.species[D[id].name]||{};
const SNAMES=['HP','Atk','Def','SpA','SpD','Spe'];

/* growth curves: EXP needed to reach level n */
const CURVES={
 glitch:n=>n<=50?n**3*(100-n)/50:n<=68?n**3*(150-n)/100:n<=98?n**3*Math.floor((1911-10*n)/3)/500:n**3*(160-n)/100,
 swift:n=>0.8*n**3,standard:n=>n**3,steady:n=>1.2*n**3-15*n*n+100*n-140,ancient:n=>1.25*n**3,
 pulse:n=>n<=15?n**3*(Math.floor((n+1)/3)+24)/50:n<=36?n**3*(n+14)/50:n**3*(Math.floor(n/2)+32)/50};
function xpFor(id,n){return n<=1?0:Math.max(0,Math.floor((CURVES[spOf(id).curve]||CURVES.standard)(n)))}
function xpNext(lv,id){return id==null?(lv+1)**3:xpFor(id,lv+1)}
function expFrac(m){if(m.lv>=100)return 1;const a=xpFor(m.id,m.lv),b=xpFor(m.id,m.lv+1);return Math.max(0,Math.min(1,(m.xp-a)/Math.max(1,b-a)))}

/* Potential (0-31 per stat), Temperament (+10% / -10%), Training Points (banked tp, applied tpa) */
const TEMPS=[['Balanced'],['Dreamy'],['Bold',2,1],['Brash',1,2],['Calm',4,1],['Clever',3,1],['Hasty',5,2],['Gentle',4,2],['Fierce',1,3],['Sly',5,3]];
const tmul=(m,i)=>{const t=TEMPS[m.tm||0];return t[1]===i?1.1:t[2]===i?0.9:1};
function stat(m,i){const b=D[m.id].s[i],P=m.pot?m.pot[i]:15,T=m.tpa?m.tpa[i]:0,core=Math.floor((2*b+P+Math.floor(T/4))*m.lv/100);
 return i===0?core+m.lv+10:Math.floor((core+5)*tmul(m,i))}
// starters, gifts and legendaries are guaranteed at least three strong stats
function rollPot(strong){const p=Array.from({length:6},()=>ri(0,31));if(strong){const idx=[0,1,2,3,4,5].sort(()=>R()-0.5).slice(0,3);for(const i of idx)p[i]=Math.max(p[i],ri(20,31))}return p}
const potStars=m=>Math.max(1,Math.min(5,Math.round((m.pot||[15,15,15,15,15,15]).reduce((a,b)=>a+b,0)/186*5)));
function mk(id,lv,o){o=o||{};const r=spOf(id).rarity,legend=r==='legendary'||r==='mythic';
 const m={id,lv,xp:xpFor(id,lv),moves:movesAt(id,lv),st:null,pot:rollPot(o.gift||legend||r==='starter'),tm:ri(0,TEMPS.length-1),tp:[0,0,0,0,0,0],tpa:[0,0,0,0,0,0]};
 if(o.gift)m.ob='gift';if(legend)m.ob='legend';m.hp=stat(m,0);resetStages(m);return m}

// old saves: average Potential, no TP, neutral temperament, EXP moved onto the new curve at the same level
function progMigrate(g){for(const m of g.party.concat(g.box)){if(!m.pot){m.pot=[15,15,15,15,15,15];m.tm=0;m.tp=[0,0,0,0,0,0];m.tpa=[0,0,0,0,0,0]}
  const a=xpFor(m.id,m.lv),b=xpFor(m.id,m.lv+1);if(!(m.xp>=a&&m.xp<b))m.xp=a}
 g.opt=g.opt||{expLink:true};return g}

/* EXP: scaled formula, x1.5 from trainers; EXP Link gives the rest of the party 50% (Classic mode: split among battlers) */
// overall EXP pace: tuned so a starter that fights most battles stays about 2 levels above each Keeper's ace
let EXP_SCALE=0.7;
function expGain(e,p,trainer){const by=spOf(e.id).base_yield||Math.round(D[e.id].s.reduce((a,b)=>a+b,0)*0.25),L=e.lv,Lp=p.lv;
 let x=Math.floor((by*L/5)*Math.pow((2*L+10)/(L+Lp+10),2.5)*EXP_SCALE)+1;return trainer?Math.floor(x*1.5):x}
// TP in the defeated species' highest base stat: 1 first stage, 2 middle or single-stage, 3 final stage
function tpGain(e){const s=spOf(e.id),b=D[e.id].s,n=s.stages||1,st=s.stage||1;return[b.indexOf(Math.max(...b)),n>1&&st===n?3:(n===1||st>1)?2:1]}
function addTP(m,i,a){m.tp=m.tp||[0,0,0,0,0,0];const tot=m.tp.reduce((x,y)=>x+y,0);a=Math.max(0,Math.min(a,250-m.tp[i],500-tot));m.tp[i]+=a}
function progAward(e,trainer,steps,skip){const link=!G.opt||G.opt.expLink!==false,parts=new Set([...(B.part||[]),B.pi]);
 const alive=G.party.map((m,i)=>[m,i]).filter(([m,i])=>m.hp>0&&m!==skip);
 const recv=link?alive.map(([m,i])=>[m,i===B.pi?1:0.5]):alive.filter(([m,i])=>parts.has(i)).map(([m])=>[m,1/Math.max(1,alive.filter(([x,i])=>parts.has(i)).length)]);
 const[ti,ta]=tpGain(e);let shared=0;
 for(const[m,share]of recv){const amt=Math.max(1,Math.floor(expGain(e,m,trainer)*share*(typeof evMul==='function'?evMul('exp'):1)));m.xp+=amt;addTP(m,ti,ta);
  if(share===0.5)shared++;else steps.push({say:[nm(m)+' gained '+amt+' EXP!']})}
 if(shared)steps.push({say:['The rest of your team gained EXP through EXP Link.']});
 for(const[m]of recv)levelSteps(m,steps)}
function levelSteps(m,steps){while(m.lv<100&&m.xp>=xpFor(m.id,m.lv+1)){const before=SNAMES.map((_,i)=>stat(m,i));m.lv++;m.tpa=(m.tp||[0,0,0,0,0,0]).slice();m.lvUp=1;
  const after=SNAMES.map((_,i)=>stat(m,i));if(m.hp>0)m.hp=Math.max(1,m.hp+after[0]-before[0]);
  steps.push({say:[nm(m)+' grew to Lv '+m.lv+'!']},{panel:{name:nm(m),lv:m.lv,rows:after.map((v,i)=>[SNAMES[i],v,v-before[i]])}});
  const lv=m.lv;for(const[l,mi]of learnset(m.id))if(l===lv)steps.push({fn:cb=>learnPrompt(m,mi,cb)})}}

// play a list of {say}, {panel} and {fn(cb)} steps one after another
function progRun(steps,done){const s=steps.shift();if(!s)return done();const next=()=>progRun(steps,done);
 if(s.say)say(s.say,next);else if(s.panel)LVP=Object.assign({cb:next},s.panel);else s.fn(next)}

/* GBA-style level-up stats panel */
let LVP=null;
function drawLvPanel(){const P=LVP;box(84,4,74,86,'#f8f4ff','#1b1424');txt(P.name.slice(0,10),88,8,'#1b1424',6);txt('Lv'+P.lv,136,8,'#3b2a5c',6);
 P.rows.forEach(([n,v,g],i)=>{const y=20+i*11;txt(n,88,y,'#3b2a5c',6);txt(String(v).padStart(3),112,y,'#1b1424',6);txt((g>=0?'+':'')+g,136,y,g>=4?'#ff6a00':'#2e86de',6)})}

/* moves: the player chooses what to forget; the Move Archive relearns older moves */
/* ---- learning a 5th move: a full screen with the Alienmon, its 4 moves plus the new one, and what the highlighted move does ---- */
const STATUSN={burn:'burn',poison:'poison',shock:'shock',freeze:'freeze',confuse:'confuse'};
function moveFxText(mv){const fx=mv.fx||{},c=fx.c!=null?fx.c:1,pc=c>=1?'':Math.round(c*100)+'% chance to ',L=[];
 if(fx.s)L.push(c>=1?'Always '+(STATUSN[fx.s]||fx.s)+'s the foe.':pc+(STATUSN[fx.s]||fx.s)+' the foe.');
 const st=(o,who,chance)=>{for(const k in o){const v=o[k],sh=v>1||v<-1;if(chance&&c<1)L.push(pc+(sh?'sharply ':'')+(v>0?'raise ':'lower ')+who+' '+STN[k]+'.');else L.push((sh?'Sharply ':'')+(sh?(v>0?'raises ':'lowers '):(v>0?'Raises ':'Lowers '))+who+' '+STN[k]+'.')}};
 if(fx.foe)st(fx.foe,"the foe's",1);if(fx.self)st(fx.self,'its own',0);
 if(fx.heal)L.push('Heals '+Math.round(fx.heal*100)+'% of its HP.');if(fx.drain)L.push('Heals by '+Math.round(fx.drain*100)+'% of the damage dealt.');if(fx.crit)L.push('Lands critical hits more often.');
 return L.length?L.join(' '):(mv.p?'A straight attack, no extra effect.':'No extra effect.')}
function drawMoveInfo(mi,y){const mv=MV[mi];box(0,y,160,144-y);const tc=mv.t==='None'?'#3b2a5c':TC[mv.t][2];
 txt(mv.t==='None'?'Basic':mv.t,6,y+4,tc,7);txt(!mv.p?'Status':PHYS.has(mv.t)?'Physical':'Special',64,y+5,'#3b2a5c',6);
 txt('PWR '+(mv.p||'-')+'  ACC '+(mv.a||'-')+'  PP '+maxPP(mi),6,y+13,'#1b1424',6);
 wrap(moveFxText(mv),24).slice(0,2).forEach((l,i)=>txt(l,6,y+21+i*8,'#1b1424',6))}
function drawLearn(){const C=CH,m=C.mon,list=C.list;box(0,0,160,144);dspr(m.id,2,2,3,false,m);
 txtFit(nm(m),54,5,'#1b1424',102);txt('Lv'+m.lv,54,15,'#3b2a5c',6);txt('wants to learn',54,25,'#3b2a5c',6);txtFit(MV[list[4]].n,54,35,'#d7262e',102,7);
 txt('Forget which move?',4,50,'#7a1f6a',6);
 list.forEach((mi,i)=>{const mv=MV[mi],y=60+i*9,sel=i===C.sel;if(sel)rect(2,y-2,156,9,'#ffe0c0');rect(5,y,4,4,mv.t==='None'?'#a99cc8':TC[mv.t][0]);
  txtFit((i===4?'NEW ':'')+mv.n,12,y-1,i===4?'#d7262e':'#1b1424',100,7);txtR(mv.p?String(mv.p):'-',156,y-1,'#3b2a5c',6)});
 drawMoveInfo(list[C.sel],104)}
function learnPrompt(m,mi,cb){if(m.moves.includes(mi))return cb();
 if(m.moves.length<4){m.moves.push(mi);return say(nm(m)+' learned '+MV[mi].n+'!',cb)}
 const skip=()=>say(nm(m)+' did not learn '+MV[mi].n+'.',cb);
 say(nm(m)+' wants to learn '+MV[mi].n+', but it already knows 4 moves.',()=>{choose('Forget which move?',m.moves.map(x=>MV[x].n).concat(['Keep old moves']),i=>{
  if(i>=4)return skip();const old=m.moves[i];m.moves[i]=mi;if(m.ppm)delete m.ppm[mi];say([nm(m)+' lets '+MV[old].n+' fade from its memory...','...and locks in '+MV[mi].n+'!'],cb)},skip);
  CH.draw=drawLearn;CH.mon=m;CH.list=m.moves.concat([mi]);CH.sel=4})}
function moveArchive(){const L=G.party.map(m=>nm(m)+' Lv'+m.lv);choose('Move Archive: 100 stardust',L.concat(['Back']),i=>{if(i>=G.party.length)return bayMenu();const m=G.party[i];
 const opts=[...new Set(learnset(m.id).filter(([l,mi])=>l<=m.lv&&!m.moves.includes(mi)).map(([l,mi])=>mi))];
 if(!opts.length)return say(nm(m)+' has no moves to remember.',moveArchive);
 choose('Relearn which move?',opts.map(mi=>MV[mi].n).concat(['Back']),j=>{if(j>=opts.length)return moveArchive();if(G.dust<100)return say('You need 100 stardust.',moveArchive);
  G.dust-=100;learnPrompt(m,opts[j],moveArchive)},moveArchive)},bayMenu)}

/* evolution animation: the old form glows white and flickers with the new one's outline, faster and faster,
   then a flash reveals the new form with sparkles. A skips ahead once the reveal has started. */
let EVO=null;const EVO_T=260;
function evoAnim(m,into,done){evoAnimIds(m.id,into,m.pri,done)}
function evoAnimIds(a,b,pri,done){warm(ARTI,[D[a].name,D[b].name]);EVO={a,b,pri,t:0,done,sp:[],last:-1};evoVideo(EVO)}
/* evolution videos (art/evo_video/<From>_<To>.mp4, owner renders): full-quality clip over the screen, then the usual reveal; A or B skips */
const EVOVID=__EVOVID__;
function evoVideo(E){const src=EVOVID[D[E.a].name+'_'+D[E.b].name];if(!src||(G&&G.opt&&G.opt.evoVideo===false))return;
 const v=document.createElement('video');v.src=src;v.muted=true;v.playsInline=true;v.setAttribute('playsinline','');v.preload='auto';
 v.style.cssText='position:absolute;inset:10px;width:calc(100% - 20px);height:calc(100% - 20px);object-fit:cover;background:#0b0716;z-index:2;pointer-events:none';
 const host=cv.parentNode;if(getComputedStyle(host).position==='static')host.style.position='relative';host.appendChild(v);E.vid=v;E.vt=0;
 const end=()=>{if(E.vid!==v)return;E.vid=null;v.remove();if(EVO===E)E.t=199};v.onended=end;v.onerror=end;E.vend=end;
 const p=v.play();if(p&&p.catch)p.catch(end)}
const EVOS={};function evoSil(id){const im=ARTI[D[id].name];if(!okI(im))return null;if(EVOS[id])return EVOS[id];const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;
 const g=c.getContext('2d');g.drawImage(im,0,0);g.globalCompositeOperation='source-in';g.fillStyle='#f4fbff';g.fillRect(0,0,c.width,c.height);return EVOS[id]=c}
function evoTone(f,d){try{if(typeof AC!=='undefined'&&AC&&typeof chipTone==='function')chipTone(AC.currentTime,f,d,0.18,'square')}catch(e){}}
function drawEvo(){const E=EVO;if(E.vid){E.vt++;ctx.fillStyle='#0b0716';ctx.fillRect(0,0,160,144);if(E.vt>40&&(P_('a')||P_('b')))E.vend();else if(E.vt>900)E.vend();return}
 const t=++E.t,cx=80,cy=62,s=4.2,z=16*s*1.15;
 const bg=ctx.createRadialGradient(cx,cy,4,cx,cy,110);bg.addColorStop(0,t>200?'#3b6a8a':'#2a1d4a');bg.addColorStop(1,'#0b0716');ctx.fillStyle=bg;ctx.fillRect(0,0,160,144);
 for(let i=0;i<14;i++){const a=i/14*Math.PI*2+t*0.01,r=40+((t*0.6+i*23)%50);ctx.fillStyle='rgba(160,230,255,'+(0.15+0.2*Math.sin(t*0.1+i))+')';ctx.fillRect(cx+Math.cos(a)*r,cy+Math.sin(a)*r*0.8,1,1)}
 const pulse=1+Math.sin(t*0.15)*0.03;
 const drawAt=(id,sil,k)=>{const w=z*k,x=cx-w/2,y=cy-w/2,im=sil?evoSil(id):ARTI[D[id].name];if(!okI(im)&&!(im&&im.getContext))return dspr(id,cx-8*s,cy-8*s,s,false,{pri:E.pri});
  ctx.save();ctx.imageSmoothingEnabled=true;if(!sil)monFilter({pri:E.pri});ctx.drawImage(im,x,y,w,w);ctx.restore()};
 if(t<50){drawAt(E.a,false,1);if(t>20){ctx.globalAlpha=(t-20)/30;drawAt(E.a,true,1);ctx.globalAlpha=1}}
 else if(t<200){const k=(t-50)/150,per=Math.max(2,Math.round(26*(1-k)**1.6)),ph=Math.floor((t-50)/per)%2;
  if(ph!==E.last){E.last=ph;evoTone(260+k*700+(ph?60:0),0.07)}
  const glow=ctx.createRadialGradient(cx,cy,2,cx,cy,44);glow.addColorStop(0,'rgba(255,255,255,'+(0.25+k*0.5)+')');glow.addColorStop(1,'rgba(120,220,255,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,160,144);
  drawAt(ph?E.b:E.a,true,pulse*(ph?1.04:1))}
 else{if(t===200){evoTone(880,0.15);evoTone(1320,0.3);for(let i=0;i<26;i++){const a=Math.random()*Math.PI*2,v=0.6+Math.random()*1.6;E.sp.push({x:cx,y:cy,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:40+Math.random()*30})}}
  drawAt(E.b,false,1);
  for(const p of E.sp){if(p.l<=0)continue;p.x+=p.vx;p.y+=p.vy;p.vy+=0.02;p.l--;ctx.fillStyle=p.l%6<3?'#ffffff':'#ffe27a';ctx.fillRect(p.x,p.y,2,2);ctx.fillRect(p.x-1,p.y+0.5,4,1)}
  if(t<222){ctx.fillStyle='rgba(255,255,255,'+(1-(t-200)/22)+')';ctx.fillRect(0,0,160,144)}}
 if(t>=EVO_T||(t>215&&(P_('a')||P_('b')))){const d=E.done;EVO=null;d()}}

/* evolution: level or Resonance; B cancels */
function evoReady(m){const ev=spOf(m.id).evolves;if(!ev||!ev.into||IDX[ev.into]==null||m.hp<=0||m.lv<(ev.level||999))return false;const how=ev.method||'';
 if(how.startsWith('Level'))return true;if(/Signal Shard 4/.test(how))return G.shards>=4;if(/all 8/.test(how))return G.shards>=8;
 const here=(PL[G.planet]||{}).key;if(/Halo/.test(how))return m.lvUp&&here==='halo'&&nearTower();if(/Rift/.test(how))return m.lvUp&&here==='starfall'&&nearTower();return false}
function evoSteps(steps){for(const m of G.party)if(evoReady(m))steps.push({fn:cb=>{const into=IDX[spOf(m.id).evolves.into],old=nm(m);
  say(old+"'s signal is surging... it's changing!",()=>choose('Let '+old+' evolve?',['Evolve','Stop'],i=>{if(i!==0)return say(old+"'s glow fades. It stays just as it is, for now.",cb);
   evoAnim(m,into,()=>{const r=m.hp/stat(m,0);m.id=into;m.hp=Math.max(1,Math.round(stat(m,0)*r));G.seen[m.id]=G.caught[m.id]=1;
   say(old+' evolved into '+nm(m)+'!',()=>progRun(learnset(m.id).filter(([l,mi])=>l<=m.lv&&MV[mi].sig).map(([l,mi])=>({fn:c=>learnPrompt(m,mi,c)})),cb))})},()=>say(old+"'s glow fades. It stays just as it is, for now.",cb)))}});
 for(const m of G.party)m.lvUp=0}

/* Shard Sync Limit: gifted, traded and legendary Alienmon above the limit ignore 25% of commands */
const SYNC_LIMIT=[15,20,25,30,35,40,45,50,999];
function disobeys(m){return!!m.ob&&G.party.includes(m)&&m.lv>SYNC_LIMIT[Math.min(8,G.shards||0)]&&R()<0.25}

/* wild Alienmon by world: tier 1, tier 2 after 4 Shards, tier 3 after the Champion */
function wildTable(key){const a=PROG.areas[key];if(!a)return null;return(G.flags.champ&&a.tier3_after_champion)||(G.shards>=4&&a.tier2_after_4_shards)||a.tier1}
function wildPick(key,name){const t=(wildTable(key)||[]).filter(x=>wildOK(x.name));if(!t.length)return null;let e=null;
 if(name&&wildOK(name))e=t.find(x=>x.name===name)||(PROG.areas[key].tier1||[]).find(x=>x.name===name);
 if(!e){const wt=x=>(x.weight||1)*dayMul(x.name);let w=t.reduce((s,x)=>s+wt(x),0)*R();for(const x of t){w-=wt(x);if(w<=0){e=x;break}}e=e||t[0]}
 const id=IDX[e.name];return id==null?null:clampWild(id,ri(e.min,e.max),inRoute()?2:0)}   // capped to the story stage (world.js)

/* trainers, Keepers, bosses: levels and payouts from the tables */
function keeperTeam(key,k){const t=PROG.keepers[key];if(!t)return k.team;const base=k.team.map(([id])=>id),p=PL.find(x=>x.key===key),extra=p?p.pool.e.concat(p.pool.c):[];
 return t.team_levels.map((lv,i)=>[i<base.length?base[i]:extra[i%extra.length],lv])}
function trainerLevels(key){const a=PROG.areas[key];return a&&a.trainer_levels?a.trainer_levels:null}
function payout(tr,e){const ev=typeof evMul==='function'?evMul('dust'):1;if(!tr)return ri(2,6)*ev;const lv=Math.max(...tr.team.map(x=>x[1]));return(tr.shard?60*lv:20*lv)*ev}
// shop stock grows with Signal Shards
const SHOP_TIERS=[[0,['stasis','gel','cure','revive']],[1,['tether','stun']],[2,['harmonic','megagel','ether','jammer']],[5,['fullgel']],[6,['singularity']],[8,['maxrevive']]];
const SHOP_PRICE={ether:60,jammer:35,stasis:50,gel:15,cure:20,tether:30,stun:30,harmonic:150,megagel:45,revive:80,fullgel:120,singularity:400,maxrevive:300};
const shopOpen=k=>SHOP_TIERS.some(([s,ks])=>ks.includes(k)&&(G.shards||0)>=s);

// Resonance spots: the Halo tower roof and the Rift vortex both sit at the top of their towns, by the tower
function nearTower(){const P=paintOf(),kh=P&&P.hot.find(h=>h.k==='keeper');return!!(kh&&G.ppos&&Math.hypot(G.ppos[0]-kh.x,G.ppos[1]-kh.y)<260)}
