/* ---------- Linker Arena: real-time arena battles (docs/arena/ARENA_BUILD_PLAN.md) ----------
 Phase 1: 1v1 against the computer at level 50, entered from START > Arena. Both Alienmon are copies, so the save's
 party is never touched. Moves fire from the Alienmon's own moveset; cooldowns, wind-ups and shapes come from
 data/arena.json. Damage, type matchups, Traits and status all run through the turn-based act(), so balance has one home.
 Controls: d-pad moves, tap a move in the bottom bar (or keys 1-4 / J K L I) to fire it, A uses the selected move,
 B selects the next move, START pauses.
 Art: art/arena/poses/<Name>_<pose>.png when imported (tools/import_arena_sheet.py), otherwise the battle sprites;
 art/arena/scenes/<planet>_arena.jpg when rendered, otherwise the planet's battle background.
 Online play (Phase 5) needs act() to take a seeded random source; the arena's own choices already use RTA.r. */
const ARJ=__ARENA__,ARA=__ARENAART__;
const ARTLI=lazyImgs(ARA.tiles||{}),ARHZI=lazyImgs(ARA.hazards||{}),ARPI=lazyImgs(ARA.poses),ARSI=lazyImgs(ARA.scenes);const ARFI=lazyImgs(ARA.fx),ARUI=lazyImgs(ARA.uicut||{});
// the owner's arena UI pieces (tools/arena_ui_cut.py -> art/arena/uicut): drawn when loaded, otherwise the plain HUD
function rUi(k,x,y,w,h,a){const i=ARUI[k];if(!okI(i))return false;ctx.save();if(a!=null)ctx.globalAlpha=a;ctx.imageSmoothingEnabled=true;ctx.drawImage(i,x,y,w,h===undefined?w*i.naturalHeight/i.naturalWidth:h);ctx.restore();return true}
const rUiOk=(...ks)=>ks.every(k=>okI(ARUI[k]));
// the owner's arena effect sheets (art/arena/fx/<move>.webp, sig_<move> for signatures): 4x2 cells of 192x256,
// row 1 = the move travelling (projectile loop, or beam start/middle/end), row 2 = the 4-frame impact
function rArtFx(mv){const k=String(mv.n||'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,''),s=mv.sig?'sig_'+k:k;return s in ARA.fx?ARFI[s]:k in ARA.fx?ARFI[k]:null}
const RF={x0:6,y0:20,x1:154,y1:128};   // the arena floor on the 160x144 screen
const RDIFF=[['Easy',27,0.35],['Normal',15,0.18],['Hard',7,0.06]];   // name, ticks between decisions, aim error (radians)
const RREACH={PROJ:100,LOB:90,WAVE:110,BEAM:110,CHAIN:110,ARC:22,CONE:34,BURST:28,DASH:50,ZONE:80,RAIN:80,FIELD:70,AURA:999};
let RTA=null;const RTO={diff:1,arena:0,pick:0};
addEventListener('keydown',e=>{if(scene!=='rta')return;if(e.code==='KeyQ'||e.code==='Tab'){pressed.sw=true;e.preventDefault();return}const k={Digit1:0,Digit2:1,Digit3:2,Digit4:3,KeyJ:0,KeyK:1,KeyL:2,KeyI:3}[e.code];if(k!==undefined){pressed['m'+k]=true;e.preventDefault()}});
// tapping a move in the bar along the bottom of the screen fires it, so phones get all four moves without the B cycle
cv.addEventListener('pointerdown',e=>{if(scene!=='rta'||!RTA||CH||DLG)return;const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*160,y=(e.clientY-r.top)/r.height*144;
 if(y>=126){const i=Math.max(0,Math.min(3,Math.floor(x/40)));pressed['m'+i]=true;e.preventDefault()}});

function rShape(mv){const s=(mv.sig?ARJ.signature:ARJ.moves)[mv.n];if(s)return s[0];const fx=mv.fx||{};
 if(!mv.p)return(fx.self||fx.heal)&&!fx.foe&&!fx.s?'AURA':'FIELD';return mv.p<=45?'PROJ':mv.p<=80?(PHYS.has(mv.t)?'ARC':'PROJ'):'ZONE'}
const rTier=mv=>mv.p?ARJ.tiers.find(t=>mv.p<=t.max):ARJ.status;
const rSpeed=f=>(0.45+Math.min(160,es(f.m,'spe'))/260)*(RTA&&RTA.ter?rTerSpeed(f):1)*(f.hzSlow>0?(f.hzSlow--,0.5):1);   // px per tick
const rFoe=f=>RTA.f[1-f.side];
// every HP change in the arena is scaled (data/arena.json match.scale), never below 1 point
function rScaled(ms,fn){const h0=ms.map(m=>m.hp),r=fn();ms.forEach((m,i)=>{const dh=m.hp-h0[i];if(dh)m.hp=Math.max(0,Math.min(stat(m,0),h0[i]+Math.sign(dh)*Math.max(1,Math.round(Math.abs(dh)*ARJ.match.scale))))});return r}

/* ---- menu and match setup ---- */
const RMODES=['1v1','3v3'];
const rBan=i=>!D[i]||['legendary','mythic'].includes(D[i].r);
// the player's team: chosen party members, or a rental team of three (level 50 copies either way, the save is never touched)
function rMyTeam(){if(RTO.rental){const r=rng(hash('rent'+(RTO.rentSeed||1)));const pool=D.map((d,i)=>i).filter(i=>!rBan(i));const out=[];while(out.length<3){const i=pool[Math.floor(r()*pool.length)];if(!out.includes(i))out.push(i)}return out.map(i=>mk(i,ARJ.match.level))}
 const n=RTO.mode==='3v3'?3:1;let ix=(RTO.team||[]).filter(i=>G.party[i]);if(!ix.length)ix=[RTO.pick];for(let i=0;ix.length<n&&i<G.party.length;i++)if(!ix.includes(i))ix.push(i);return ix.slice(0,n).map(i=>G.party[i])}
function rFoeTeam(n,r,arena,avoid){const pl=PL[arena]||PL[0];let pool=pl.pool.c.concat(pl.pool.e,pl.pool.r).filter(i=>!rBan(i)&&!avoid.includes(i));if(pool.length<n)pool=D.map((d,i)=>i).filter(i=>!rBan(i)&&!avoid.includes(i));
 const out=[];while(out.length<n){const i=pool[Math.floor(r()*pool.length)];if(!out.includes(i)||pool.length<n)out.push(i)}return out}
function rtaMenu(){if(!G.party.length)return say('You need an Alienmon to enter the Arena.');RTO.pick=Math.min(RTO.pick,G.party.length-1);RTO.mode=RTO.mode||'1v1';
 const team=RTO.rental?'Rental team':rMyTeam().map(m=>nm(m)).join(', ');
 choose('Linker Arena',['Fight!','Mode: '+RTO.mode,'Team: '+team,'CPU: '+RDIFF[RTO.diff][0],'Arena: '+rArenaName(RTO.arena),'Cups','Record','How to play','Back'],k=>{
  if(k===0)rtaStart();
  else if(k===1){RTO.mode=RMODES[(RMODES.indexOf(RTO.mode)+1)%RMODES.length];rtaMenu()}
  else if(k===2)rTeamMenu();
  else if(k===3){RTO.diff=(RTO.diff+1)%RDIFF.length;rtaMenu()}
  else if(k===4)rArenaMenu();
  else if(k===5)rCupMenu();
  else if(k===6)rRecord();
  else if(k===7)say(['Arena battles happen in real time. Every Alienmon fights at level 50.','Slide your thumb on the pad to move in any direction. Tap a move button to use it; moves aim at your foe when you face it.','Strong moves need time to recharge, and the biggest ones glow before they hit. Watch for warning rings on the ground and dodge!','In 3v3, press SWAP (or Q) to switch Alienmon. When one is knocked out, the next one beams in.','Heavy hits crack the floor, and every planet has its own hazard. Types, Traits and status all work like normal battles.'],rtaMenu)},()=>{})}
function rTeamMenu(){const n=RTO.mode==='3v3'?3:1;RTO.team=(RTO.team||[RTO.pick]).filter(i=>G.party[i]);
 const opts=G.party.map((m,i)=>(RTO.team.includes(i)?'* ':'  ')+nm(m)+' L'+m.lv).concat([RTO.rental?'* Rental team':'  Rental team','Done']);
 choose('Pick '+n+' Alienmon',opts,k=>{if(k===opts.length-1)return rtaMenu();
  if(k===G.party.length){RTO.rental=!RTO.rental;if(RTO.rental)RTO.rentSeed=(RTO.rentSeed||1)+1;return rTeamMenu()}
  RTO.rental=false;const at=RTO.team.indexOf(k);if(at>=0)RTO.team.splice(at,1);else{RTO.team.push(k);if(RTO.team.length>n)RTO.team.shift()}RTO.pick=RTO.team.length?RTO.team[0]:RTO.pick;rTeamMenu()},rtaMenu)}
const rArenaName=i=>i>=PL.length?'Practice court':PL[i].name;
function rArenaMenu(){choose('Arena',PL.map(p=>p.name).concat(['Practice court']),i=>{RTO.arena=i;rtaMenu()},rtaMenu)}
function rRecord(){const r=G.rta||{w:0,l:0,d:0},c=(r.cups||{});const won=Object.keys(c).filter(k=>c[k]);
 say(['Arena record: '+r.w+' wins, '+r.l+' losses, '+r.d+' draws.','Cups won: '+(won.length?won.map(k=>(RCUPS.find(x=>x.k===k)||{n:k}).n).join(', '):'none yet')+'.'],rtaMenu)}
function rFighter(m,side){const c={...m,lv:ARJ.match.level,st:null,cf:0,moves:(m.moves&&m.moves.length?m.moves:[0]).slice(0,4)};resetStages(c);c.hp=stat(c,0);
 return{m:c,side,x:side?RF.x1-28:RF.x0+28,y:(RF.y0+RF.y1)/2+12,face:side?'left':'right',ax:side?-1:1,ay:0,mx:0,my:0,
  cd:c.moves.map(()=>0),cdm:c.moves.map(()=>1),sel:0,wind:null,atkT:0,hurt:0,kb:[0,0],dash:null,frz:0,imm:0,step:0,aura:0,swapCd:0,next:0,ai:{t:0,mx:0,my:0,str:1}}}
// opts: {mine:[mon], foe:[id or mon], arena, diff, cup:{k,round}}; with no opts the menu's settings are used
function rtaStart(opts){if(typeof opts==='number')opts={foe:[opts]};opts=opts||{};const r=rng(hash('rta'+Date.now())),arena=opts.arena!=null?opts.arena:RTO.arena,pl=PL[arena];
 const mine=opts.mine||rMyTeam(),n=mine.length,foe=(opts.foe||rFoeTeam(n,r,arena,mine.map(m=>m.id))).map(x=>typeof x==='number'?mk(x,ARJ.match.level):x);
 const tm=[mine.map(m=>rFighter(m,0)),foe.map(m=>rFighter(m,1))],f=[tm[0][0],tm[1][0]];
 RTA={key:pl?pl.key:'court',pl:arena,foeIds:foe.map(m=>m.id),opts,r,t:0,t0:0,phase:'count',f,tm,shots:[],areas:[],fx:[],cfx:[],fl:[],log:null,shake:0,diff:RDIFF[opts.diff!=null?opts.diff:RTO.diff],win:-1};
 const names=tm[0].concat(tm[1]).map(x=>D[x.m.id].name);warm(ARTI,names);warm(ARTBI,names);
 for(const x of f)rCpush('common_release',0,x.x,x.y-12,34,30);
 const L=[];entry(f[0].m,f[1].m,L);entry(f[1].m,f[0].m,L);rLog(L);scene='rta'}
// tag battles: bring the next Alienmon in where the last one stood (its cooldowns are kept from when it left)
const rAlive=side=>RTA.tm[side].filter(x=>x.m.hp>0);
function rSwap(side,to){const A=RTA,old=A.f[side],nx=to||A.tm[side].find(x=>x!==old&&x.m.hp>0);if(!nx||nx===old)return false;
 nx.x=old.x;nx.y=old.y;nx.face=old.face;nx.ax=old.ax;nx.ay=old.ay;nx.kb=[0,0];nx.wind=null;nx.dash=null;nx.swapCd=90;nx.next=0;old.wind=null;old.dash=null;
 if(old.m.hp>0)rCpush('common_release',1,old.x,old.y-12,30,18);A.f[side]=nx;rCpush('common_release',0,nx.x,nx.y-12,34,26);
 const L=['Go, '+nm(nx.m)+'!'];entry(nx.m,A.f[1-side].m,L);rLog(L);return true}

/* ---- cups (P3-03): four 3v3 rounds against themed teams, harder each round; a win gives the cup's trophy ---- */
const RCUPS=[{k:'canyon',n:'Canyon Cup',a:'dustara',ty:null},{k:'tide',n:'Tide Cup',a:'thalassa',ty:['Hydro']},{k:'thunder',n:'Thunder Cup',a:'neonis',ty:['Volt','Sonic']},
 {k:'frost',n:'Frost Cup',a:'glacia',ty:['Cryo','Crystal']},{k:'nebula',n:'Nebula Cup',a:'starfall',ty:['Void','Psi','Gravity']},{k:'summit',n:'Summit Cup',a:'apex',ty:null,top:1}];
const rCupDone=k=>!!(G.rta&&G.rta.cups&&G.rta.cups[k]);
function rCupMenu(){const opts=RCUPS.map(c=>(rCupDone(c.k)?'* ':'  ')+c.n+(c.top&&!rCupLocked()?'':c.top?' (locked)':''));
 choose('Cups',opts.concat(['Back']),i=>{if(i>=RCUPS.length)return rtaMenu();const c=RCUPS[i];
  if(c.top&&rCupLocked())return say(['The Summit Cup opens once you win the other five cups.'],rCupMenu);
  say([c.n+': four 3v3 rounds in a row. Your team stays the same, and each round is tougher than the last.'],()=>rCupRound(c,0))},rtaMenu)}
const rCupLocked=()=>RCUPS.some(c=>!c.top&&!rCupDone(c.k));
function rCupFoes(c,round){const r=rng(hash('cup'+c.k+round)),total=s=>D[s].s?D[s].s.reduce((a,b)=>a+b,0):0;
 let pool=D.map((d,i)=>i).filter(i=>!rBan(i)&&(!c.ty||D[i].t.some(x=>c.ty.includes(x))));
 if(c.top)pool=pool.sort((a,b)=>total(b)-total(a)).slice(0,60);else if(round<2)pool=pool.sort((a,b)=>total(a)-total(b)).slice(0,Math.max(12,Math.floor(pool.length*0.6)));
 const out=[];while(out.length<3&&pool.length){const i=pool[Math.floor(r()*pool.length)];if(!out.includes(i))out.push(i)}return out}
function rCupRound(c,round){const keep=RTO.mode;RTO.mode='3v3';const mine=rMyTeam();RTO.mode=keep;const arena=PL.findIndex(p=>p.key===c.a);
 rtaStart({mine,foe:rCupFoes(c,round),arena:arena<0?0:arena,diff:[0,1,1,2][round],cup:{k:c.k,round}})}
function rCupNext(){const A=RTA,cu=A.opts.cup,c=RCUPS.find(x=>x.k===cu.k);
 if(A.win!==0)return say([c.n+': knocked out in round '+(cu.round+1)+'. Train up and try again!'],rtaLeave);
 if(cu.round<3)return say(['Round '+(cu.round+1)+' won! Round '+(cu.round+2)+' of 4 is next.'],()=>rCupRound(c,cu.round+1));
 G.rta.cups=G.rta.cups||{};const first=!G.rta.cups[c.k];G.rta.cups[c.k]=1;if(typeof autosave==='function')autosave();
 say(['You won the '+c.n+'!',first?'The '+c.n+' trophy is yours.':'Another win for the record.'].concat(c.top?['You are the Linker Arena champion!']:[]),rtaLeave)}

/* ---- update ---- */
function rtaUpd(){const A=RTA;A.t++;
 if(A.phase!=='over'&&P_('start')){choose('Paused',['Resume','Forfeit'],k=>{if(k===1)rtaOver(1)},()=>{});rtaDraw();return}
 if(A.phase==='count'){if(A.t>=ARJ.match.countdown){A.phase='fight';A.t0=A.t}A.cfx=A.cfx.filter(x=>++x.t<x.dur);rtaDraw();return}
 if(A.phase==='over'){A.ot++;rStepFx();if(A.ot>50&&(P_('a')||P_('b')))rtaResult();rtaDraw();return}
 for(const s of[0,1]){const f=A.f[s];if(f.m.hp<=0&&rAlive(s).length){if(!f.next)f.next=60;else if(--f.next<=0)rSwap(s)}}
 const[p,e]=A.f;rControl(p);rAI(e,p);for(const f of A.f)rStep(f);rShots();rAreas();rTick();rTerTick();rHazTick();rStepFx();
 const left=ARJ.match.time*60*(A.tm[0].length>1?2:1)-(A.t-A.t0),fr=s=>A.tm[s].reduce((a,x)=>a+x.m.hp/stat(x.m,0),0)/A.tm[s].length,out=[0,1].map(s=>!rAlive(s).length);
 if(out[0]||out[1])rtaOver(out[0]&&out[1]?2:out[0]?1:0);
 else if(left<=0){A.timeout=1;rtaOver(Math.abs(fr(0)-fr(1))<0.01?2:fr(0)>fr(1)?0:1)}
 rtaDraw()}
function rtaOver(win){const A=RTA;if(A.phase==='over')return;A.phase='over';A.ot=0;A.win=win;A.shots=[];A.areas=A.areas.filter(z=>z.kind==='beam');
 G.rta=G.rta||{w:0,l:0,d:0};G.rta[['w','l','d'][win]]++}
function rtaResult(){if(RTA.opts.cup)return rCupNext();choose('Linker Arena',['Rematch','New foe','Leave'],k=>{if(k===0)rtaStart({foe:RTA.foeIds,arena:RTA.pl});else if(k===1)rtaStart();else rtaLeave()},rtaLeave)}
function rtaLeave(){RTA=null;scene='menu';menuMode='root'}

function rControl(f){if(f.swapCd>0)f.swapCd--;if(P_('sw')&&f.swapCd<=0&&f.m.hp>0)rSwap(0);if(PADJ.on){f.mx=PADJ.x;f.my=PADJ.y}else{f.mx=(held.right?1:0)-(held.left?1:0);f.my=(held.down?1:0)-(held.up?1:0)}
 if(P_('b'))f.sel=(f.sel+1)%f.m.moves.length;let use=P_('a')?f.sel:-1;
 for(let i=0;i<4;i++)if(P_('m'+i)&&i<f.m.moves.length){use=i;f.sel=i}
 if(use<0)return;const foe=rFoe(f),dx=foe.x-f.x,dy=foe.y-f.y,d=Math.hypot(dx,dy)||1;let ax=f.ax,ay=f.ay;
 if(!f.mx&&!f.my||ax*dx/d+ay*dy/d>0.5){ax=dx/d;ay=dy/d}   // standing still, or steering within ~60 degrees of the foe: the shot snaps onto it
 rUse(f,use,ax,ay)}
function rUse(f,i,ax,ay){if(f.cd[i]>0||f.wind||f.dash||f.m.st==='freeze'||f.m.hp<=0)return false;const mv=MV[f.m.moves[i]],tier=rTier(mv);
 f.cdm[i]=f.cd[i]=Math.round(tier.cd*(1-Math.min(0.15,es(f.m,'spe')/1000)));
 const L=[];if(!canAct(f.m,L)){rLog(L);rFloat(f,f.m.st==='shock'?'zzt!':'?!','#ffd23f');return false}   // shock and confusion can still spoil a move
 if(L.length)rLog(L);f.wind={i,t:tier.wind,ax,ay};f.atkT=24;if(ax||ay){f.ax=ax;f.ay=ay}if(!tier.wind)rRelease(f);return true}
function rRelease(f){const w=f.wind;f.wind=null;rFire(f,w.i,w.ax,w.ay)}

function rStep(f){const m=f.m;if(m.hp<=0)return;
 for(let i=0;i<f.cd.length;i++)if(f.cd[i]>0)f.cd[i]--;if(f.hurt>0)f.hurt--;if(f.imm>0)f.imm--;if(f.atkT>0)f.atkT--;if(f.aura>0)f.aura--;
 if(m.st==='freeze'){if(f.imm>0)m.st=null;else{if(!f.frz)f.frz=90;if(--f.frz<=0){m.st=null;f.imm=180;rFloat(f,'thawed','#9fd8ff')}}}
 f.x+=f.kb[0];f.y+=f.kb[1];f.kb[0]*=0.82;f.kb[1]*=0.82;
 if(f.dash){f.x+=f.dash.vx;f.y+=f.dash.vy;rHitAt(f.dash.atk,f.x,f.y,10,true);if(--f.dash.t<=0)f.dash=null}
 else if(m.st!=='freeze'&&!f.wind){const l=Math.hypot(f.mx,f.my);if(l){const s=rSpeed(f);f.x+=f.mx/l*s;f.y+=f.my/l*s;f.ax=f.mx/l;f.ay=f.my/l;f.step++;if(f.step%16===0)rCpush('common_movement',1,f.x,f.y-2,12,14);
  f.face=Math.abs(f.mx)>=Math.abs(f.my)?(f.mx<0?'left':'right'):(f.my<0?'up':'down')}}
 if(f.wind&&--f.wind.t<=0)rRelease(f);
 const o=rFoe(f);if(o.m.hp>0){const dx=f.x-o.x,dy=f.y-o.y,d=Math.hypot(dx,dy);if(d<12&&d>0){f.x+=dx/d*0.6;f.y+=dy/d*0.6}}   // bodies don't overlap
 f.x=Math.max(RF.x0+8,Math.min(RF.x1-8,f.x));f.y=Math.max(RF.y0+20,Math.min(RF.y1-2,f.y))}

/* ---- attacks: one attack object per use, each target hit at most once ---- */
function rFire(f,i,ax,ay){const A=RTA,mv=MV[f.m.moves[i]],sh=rShape(mv),atk={f,mv,hit:new Set()},foe=rFoe(f);
 const reach=Math.min(Math.hypot(foe.x-f.x,foe.y-f.y),RREACH[sh]),tx=f.x+ax*reach,ty=f.y+ay*reach;
 if(sh==='AURA'){const h=f.m.hp,b0=rBs(f.m),b1=rBs(foe.m);rLog(rScaled([f.m,foe.m],()=>act(f.m,foe.m,mv)));if(f.m.hp>h){rFloat(f,'+'+(f.m.hp-h),'#9be36b');rCpush('common_heal_shield',0,f.x,f.y-12,28,24)}rBuffFx(f,b0);rBuffFx(foe,b1);f.aura=36;return}
 if(sh==='PROJ'||sh==='LOB')A.shots.push({x:f.x+ax*8,y:f.y-8+ay*8,vx:ax*2.6,vy:ay*2.6,r:4,life:60,t:0,lob:sh==='LOB',atk});
 else if(sh==='WAVE')A.shots.push({x:f.x+ax*8,y:f.y-8+ay*8,vx:ax*1.8,vy:ay*1.8,r:11,life:75,t:0,wave:1,atk});
 else if(sh==='BEAM'||sh==='CHAIN'){const L=RREACH[sh],ex=f.x+ax*L,ey=f.y-8+ay*L;A.areas.push({kind:'beam',x:f.x,y:f.y-8,ex,ey,t:0,dur:16,atk});
  const px=foe.x-f.x,py=foe.y-8-(f.y-8),k=Math.max(0,Math.min(L,px*ax+py*ay));if(Math.hypot(px-ax*k,py-ay*k)<9)rHit(atk,foe)}
 else if(sh==='ARC')rHitAt(atk,f.x+ax*14,f.y-8+ay*14,12,false,true);
 else if(sh==='CONE')rHitAt(atk,f.x+ax*20,f.y-8+ay*20,16,false,true);
 else if(sh==='BURST'){rHitAt(atk,f.x,f.y-8,26,false);rImpact(atk,f.x,f.y-8,1)}
 else if(sh==='DASH'){f.dash={vx:ax*3.4,vy:ay*3.4,t:14,atk};rCpush('common_movement',0,f.x-ax*10,f.y-6,24,16,ax<0)}
 else if(sh==='ZONE')A.areas.push({kind:'zone',x:tx,y:ty,r:16,t:0,delay:30,atk});
 else if(sh==='RAIN')for(let j=0;j<3;j++)A.areas.push({kind:'zone',x:tx+(A.r()-0.5)*30,y:ty+(A.r()-0.5)*18,r:11,t:-j*8,delay:30,atk});
 else A.areas.push({kind:'field',x:tx,y:ty,r:18,t:0,dur:240,atk})}
// ground: test against the feet (zones and fields) instead of the body; fx: show the impact even on a miss
function rHitAt(atk,x,y,r,ground,fx){const t=rFoe(atk.f);if(fx)rImpact(atk,x,y);if(t.m.hp<=0||atk.hit.has(t))return;
 if(Math.hypot(t.x-x,(ground?t.y:t.y-8)-y)<r+7)rHit(atk,t)}
function rHit(atk,t){atk.hit.add(t);const a=atk.f.m,d=t.m,mv=atk.mv,hp0=d.hp,ba=rBs(a),bd=rBs(d);
 const sh=a.st==='shock',cf=a.cf;if(sh)a.st=null;a.cf=0;   // already checked when the move was used
 const L=rScaled([a,d],()=>act(a,d,{...mv,a:1e9}));if(sh&&!a.st)a.st='shock';if(!a.cf)a.cf=cf;   // accuracy is the hitbox's job in real time
 const dmg=hp0-d.hp;rImpact(atk,t.x,t.y-8);rBuffFx(atk.f,ba);rBuffFx(t,bd);
 if(dmg>0){const e=eff(mv.t,D[d.id].t),cr=L.includes('A critical hit!');rCpush(cr||e<1?'common_hit_weak':'common_hit_normal',cr?1:e>1?1:0,t.x,t.y-10,e>1||cr?30:22,14)}
 if(hp0>0&&d.hp<=0)rCpush('common_status_confuse_ko',1,t.x,t.y-8,40,28);
 if(dmg>0){t.hurt=14;const k=Math.min(3,0.8+(mv.p||40)/50),dx=t.x-atk.f.x,dy=t.y-atk.f.y,l=Math.hypot(dx,dy)||1;t.kb=[dx/l*k,dy/l*k];rFloat(t,'-'+dmg,'#ffffff');
  const e=eff(mv.t,D[d.id].t);if(e>1){rFloat(t,'SUPER!','#ffd23f');RTA.shake=8}else if(e<1)rFloat(t,'resist','#a99cc8');if(L.includes('A critical hit!'))rFloat(t,'CRIT!','#ff8a1e');if((mv.p||0)>80)RTA.shake=Math.max(RTA.shake,6)}
 else if(d.hp>hp0){rFloat(t,'+'+(d.hp-hp0),'#9be36b');rCpush('common_heal_shield',0,t.x,t.y-12,28,24)}
 rLog(L)}
function rShots(){const A=RTA;A.shots=A.shots.filter(s=>{s.t++;s.x+=s.vx;s.y+=s.vy;const t=rFoe(s.atk.f);
 if(t.m.hp>0&&!s.atk.hit.has(t)&&Math.hypot(t.x-s.x,t.y-8-s.y)<s.r+7){rHit(s.atk,t);if(!s.wave)return false}
 return s.t<s.life&&s.x>RF.x0-8&&s.x<RF.x1+8&&s.y>RF.y0-16&&s.y<RF.y1+8})}
function rAreas(){const A=RTA;A.areas=A.areas.filter(z=>{z.t++;
 if(z.kind==='zone'){if(z.t===z.delay){rHitAt(z.atk,z.x,z.y,z.r,true);rImpact(z.atk,z.x,z.y-6,1)}return z.t<z.delay+4}
 if(z.kind==='field'&&z.t%10===0)rHitAt(z.atk,z.x,z.y,z.r,true);
 return z.t<z.dur})}
// status and "every turn" Traits: a turn is two seconds of arena time for burn and poison, three for Traits
function rTick(){const A=RTA,t=A.t-A.t0;for(const f of A.f){const m=f.m;if(m.hp<=0)continue;const mx=stat(m,0),tr=TR(m.id),L=[];
 if(t%120===0)rScaled([m],()=>{if(m.st==='burn'){m.hp=Math.max(0,m.hp-Math.max(1,Math.floor(mx/16)));rFloat(f,'burn','#ff8a1e')}if(m.st==='poison'){m.hp=Math.max(0,m.hp-Math.max(1,Math.floor(mx/8)));rFloat(f,'poison','#b45cff')}});
 if(t%180===0&&t){rScaled([m],()=>{if(['heal','guardian','harmonic'].includes(tr.k))heal(m,1/16,L,'restored HP with '+tr.name+'!');if(tr.k==='genesis')heal(m,1/8,L,'restored HP with '+tr.name+'!')});
  if(tr.k==='speed'&&m.bs.spe<6){m.bs.spe++;L.push(nm(m)+"'s "+tr.name+' raised its Speed!')}rLog(L)}}}

/* ---- computer opponent: keep its best move's range, strafe, sidestep shots and warning rings ---- */
function rAI(f,foe){const A=RTA,ai=f.ai,r=A.r;if(f.swapCd>0)f.swapCd--;if(f.m.hp>0&&f.swapCd<=0&&f.m.hp<stat(f.m,0)*0.3&&rAlive(f.side).length>1&&r()<0.004){rSwap(f.side);return}f.mx=ai.mx;f.my=ai.my;if(f.m.hp<=0||foe.m.hp<=0||--ai.t>0)return;ai.t=A.diff[1];
 const dx=foe.x-f.x,dy=foe.y-f.y,d=Math.hypot(dx,dy)||1;let best=-1,bv=0;
 f.m.moves.forEach((mi,i)=>{if(f.cd[i]>0)return;const mv=MV[mi],sh=rShape(mv);let v;
  if(!mv.p){const fx=mv.fx||{};v=fx.heal?(f.m.hp<stat(f.m,0)*0.5?120:0):fx.s?((foe.m.st||immune(foe.m,fx.s))?0:50):fx.self?(Object.keys(fx.self).some(k=>k!=='c'&&f.m.bs[k]>=2)?0:40):fx.foe?35:0}
  else{const dt=TR(foe.m.id);v=mv.p*eff(mv.t,D[foe.m.id].t)*(D[f.m.id].t.includes(mv.t)?1.5:1);if((dt.k==='absorb'&&dt.v===mv.t)||(dt.k==='float'&&mv.t==='Gravity'))v=0}
  if(d>RREACH[sh])v*=0.3;v*=0.7+r()*0.6;if(v>bv){bv=v;best=i}});
 const want=Math.min(70,(best>=0?RREACH[rShape(MV[f.m.moves[best]])]:60)*0.8);let mx=0,my=0;
 if(d>want+6){mx=dx/d;my=dy/d}else if(d<want-10){mx=-dx/d;my=-dy/d}
 if(r()<0.15)ai.str=-ai.str;mx+=-dy/d*0.7*ai.str;my+=dx/d*0.7*ai.str;
 for(const s of A.shots)if(s.atk.f!==f){const sx=f.x-s.x,sy=f.y-8-s.y;if(Math.hypot(sx,sy)<40&&s.vx*sx+s.vy*sy>0){mx-=s.vy*0.8;my+=s.vx*0.8}}
 for(const h of(A.hz&&A.hz.list)||[])if(h.H.e!=='heal'){const zx=f.x-h.x,zy=f.y-h.y,zd=Math.hypot(zx,zy)||1;if(zd<h.H.r+14){mx+=zx/zd*1.5;my+=zy/zd*1.5}}
 for(const z of A.areas)if(z.atk.f!==f&&z.kind!=='beam'){const zx=f.x-z.x,zy=f.y-z.y,zd=Math.hypot(zx,zy)||1;if(zd<z.r+12){mx+=zx/zd*1.5;my+=zy/zd*1.5}}
 if(f.x<RF.x0+16)mx+=1;if(f.x>RF.x1-16)mx-=1;if(f.y<RF.y0+24)my+=1;if(f.y>RF.y1-8)my-=1;
 ai.mx=Math.abs(mx)<0.3?0:Math.sign(mx);ai.my=Math.abs(my)<0.3?0:Math.sign(my);
 if(best>=0&&bv>0&&d<=RREACH[rShape(MV[f.m.moves[best]])]){const ang=Math.atan2(dy,dx)+(r()-0.5)*2*A.diff[2];rUse(f,best,Math.cos(ang),Math.sin(ang))}}

/* ---- terrain (P2-04): heavy hits change the floor; the planet sets the tile art, the move's type the effect; cells heal after 20 s ---- */
const RCELL=12,RTERK={Plasma:'lava',Magma:'lava',Cryo:'ice',Toxin:'spore',Bio:'spore',Hydro:'puddle'};
const RTERC={crater:'#5a3a22',lava:'#ff5a1e',ice:'#9fe6ff',spore:'#b45cff',puddle:'#2e86de'};
function rTerHit(x,y,r,mv){const A=RTA;if(!A.ter)A.ter={};const k=RTERK[mv.t]||'crater';
 for(let cx=Math.floor((x-r-RF.x0)/RCELL);cx<=Math.floor((x+r-RF.x0)/RCELL);cx++)for(let cy=Math.floor((y-r-RF.y0)/RCELL);cy<=Math.floor((y+r-RF.y0)/RCELL);cy++){
  const px=RF.x0+cx*RCELL+RCELL/2,py=RF.y0+cy*RCELL+RCELL/2;if(cx<0||cy<0||px>RF.x1||py>RF.y1||Math.hypot(px-x,py-y)>r+4)continue;
  A.ter[cx+','+cy]={k,x:px,y:py,t:0,v:Math.floor(A.r()*4),big:(mv.p||0)>100}}}
const rTerAt=(x,y)=>RTA.ter&&RTA.ter[Math.floor((x-RF.x0)/RCELL)+','+Math.floor((y-RF.y0)/RCELL)];
const rTerSpeed=f=>{const c=rTerAt(f.x,f.y);return!c?1:c.k==='crater'?0.6:c.k==='puddle'?0.75:c.k==='ice'?1.3:1};
function rTerTick(){const A=RTA;if(!A.ter)return;for(const k in A.ter)if(++A.ter[k].t>1200)delete A.ter[k];
 if(A.t%60)return;for(const f of A.f){const c=rTerAt(f.x,f.y),m=f.m;if(!c||m.hp<=0)continue;
  if(c.k==='lava'){rScaled([m],()=>{m.hp=Math.max(0,m.hp-Math.max(1,Math.floor(stat(m,0)/24)))});rFloat(f,'hot!','#ff8a1e');if(!m.st&&!immune(m,'burn')&&A.r()<0.15)m.st='burn'}
  if(c.k==='spore'&&!m.st&&!immune(m,'poison')&&A.r()<0.2){m.st='poison';rFloat(f,'poisoned','#b45cff')}}}
function rTerDraw(){const A=RTA;if(!A.ter)return;const im=ARTLI[(A.key||'court')+'_tiles'],ok=okI(im);
 for(const c of Object.values(A.ter)){const a=c.t>1020?(1200-c.t)/180:1;
  if(ok){const row=c.k==='crater'?0:c.k==='lava'||c.k==='spore'||c.k==='ice'||c.k==='puddle'?2:1,col=row===2?Math.floor((A.t/8+c.v))%4:row===0?(c.big?3:1+c.v%2):c.v;
   drawCell(im,[col*128,row*128,128,128],c.x,c.y,RCELL*1.7,RCELL*1.7,false,a);if(row===2)rEll(c.x,c.y,RCELL*0.55,RCELL*0.35,RTERC[c.k],0.28*a)}
  else rEll(c.x,c.y,RCELL*0.6,RCELL*0.4,RTERC[c.k],0.55*a)}}

/* ---- planet hazards (P2-05): one on a timer, always shown by its warning marker first ---- */
const RHAZ={dustara:{e:'slow',r:14},ferrox:{e:'hit',r:12},sporeholm:{e:'poison',r:14},thalassa:{e:'push',r:13},neonis:{e:'shock',r:14},glyphos:{e:'hit',r:10},
 pyros:{e:'burn',r:12},glacia:{e:'hit',r:11},helix:{e:'hit',r:12},halo:{e:'gust',r:16},umbra:{e:'dark',r:18},starfall:{e:'portal',r:9},ystra:{e:'heal',r:16}};
function rHazTick(){const A=RTA,H=RHAZ[A.key];if(!H||A.phase!=='fight')return;if(!A.hz)A.hz={next:360,list:[]};const Z=A.hz;
 if(--Z.next<=0){Z.next=420+Math.floor(A.r()*300);const sp=()=>({x:RF.x0+24+A.r()*(RF.x1-RF.x0-48),y:RF.y0+30+A.r()*(RF.y1-RF.y0-40)});
  const h={...sp(),t:0,warn:70,act:48,H,hit:new Set(),gx:A.r()<0.5?-1:1};if(H.e==='portal'){const b=sp();h.bx=b.x;h.by=b.y;h.act=360}Z.list.push(h)}
 Z.list=Z.list.filter(h=>{h.t++;const live=h.t>h.warn;
  if(live)for(const f of A.f){const m=f.m;if(m.hp<=0)continue;const inA=Math.hypot(f.x-h.x,(f.y-h.y)*1.4)<h.H.r+6;
   if(h.H.e==='portal'){if((f.ptp||0)>0){f.ptp--;continue}const inB=Math.hypot(f.x-h.bx,(f.y-h.by)*1.4)<h.H.r+6;if(inA||inB){f.x=inA?h.bx:h.x;f.y=inA?h.by:h.y;f.ptp=60;rCpush('common_release',0,f.x,f.y-12,26,18)}continue}
   if(!inA)continue;
   if(h.H.e==='slow')f.hzSlow=8;
   else if(h.H.e==='gust')f.kb[0]+=h.gx*0.5;
   else if(h.H.e==='dark'){}
   else if(!h.hit.has(f)){h.hit.add(f);const mx=stat(m,0);
    if(h.H.e==='heal'){const h0=m.hp;m.hp=Math.min(mx,m.hp+Math.max(1,Math.floor(mx/14)));if(m.hp>h0)rFloat(f,'+'+(m.hp-h0),'#9be36b')}
    else{const h0=m.hp;m.hp=Math.max(0,m.hp-Math.max(1,Math.floor(mx/14)));f.hurt=12;rFloat(f,'-'+(h0-m.hp),'#ffffff');
     if(h.H.e==='push'){const dx=f.x-h.x,dy=f.y-h.y,l=Math.hypot(dx,dy)||1;f.kb=[dx/l*3,dy/l*3]}
     if(h.H.e==='poison'&&!m.st&&!immune(m,'poison'))m.st='poison';if(h.H.e==='burn'&&!m.st&&!immune(m,'burn'))m.st='burn';
     if(h.H.e==='shock'&&!m.st&&!immune(m,'shock'))m.st='shock'}}}
  return h.t<h.warn+h.act})}
function rHazDraw(top){const A=RTA;if(!A.hz)return;const im=ARHZI[A.key+'_hazard'],ok=okI(im);
 for(const h of A.hz.list){const live=h.t>h.warn,pts=h.H.e==='portal'?[[h.x,h.y],[h.bx,h.by]]:[[h.x,h.y]];
  for(const[x,y]of pts){
   if(!live){if(top)continue;if(ok)drawCell(im,[(Math.floor(h.t/6)%4)*192,256,192,256],x,y-h.H.r*0.8,h.H.r*3,h.H.r*4,false,0.9);else rRing(x,y,h.H.r,h.H.r*0.5,'#ff7a3a',0.8,1)}
   else{if(!top&&h.H.e!=='dark')continue;const k=h.H.e==='portal'?Math.floor(h.t/6)%4:Math.min(3,Math.floor((h.t-h.warn)/h.act*4));
    if(h.H.e==='dark'){if(top)rEll(x,y,h.H.r+4,(h.H.r+4)*0.7,'#05030c',0.82)}
    else if(ok)drawCell(im,[k*192,0,192,256],x,y-h.H.r*1.4,h.H.r*3.2,h.H.r*4.3,false,1);else rEll(x,y,h.H.r,h.H.r*0.5,'#ff5a3a',0.5)}}}}

/* ---- effects and messages ---- */
// the owner's common effect sheets (fx/common_*): 4x2 cells of 192x256, row 0 / row 1 as in prompts/fx/fx_batch_7
function rCF(sheet,row,fr,x,y,w,a,flip){const im=ARFI[sheet];if(!okI(im))return false;drawCell(im,[fr*192,row*256,192,256],x,y,w,w*4/3,!!flip,a==null?1:a);return true}
function rCpush(sheet,row,x,y,w,dur,flip){if(RTA&&ARFI[sheet])RTA.cfx.push({sheet,row,x,y,w,t:0,dur:dur||16,flip})}
const rBs=m=>Object.values(m.bs||{}).reduce((a,b)=>a+b,0);
function rBuffFx(f,before){const d=rBs(f.m)-before;if(d)rCpush('common_buffs',d>0?0:1,f.x,f.y-14,26,30)}
function rImpact(atk,x,y,big){if((atk.mv.p||0)>=80)rTerHit(x,y+8,big||(atk.mv.p||0)>100?18:12,atk.mv);RTA.fx.push({x,y,t:0,dur:big?26:20,big,mv:atk.mv})}
function rFloat(f,s,c){RTA.fl.push({x:f.x,y:f.y-26,s,c,t:0})}
function rLog(L){if(RTA&&L&&L.length)for(const f of RTA.f){const n=TR(f.m.id).name;if(n&&L.some(l=>l.includes(n)))rCpush('common_trait_telegraph',0,f.x,f.y-12,34,22)}
 const s=(L||[]).filter(l=>!/ used /.test(l)&&!/fainted!$/.test(l));if(s.length)RTA.log={s:s[s.length-1],t:150}}
function rStepFx(){const A=RTA;A.fx=A.fx.filter(x=>++x.t<x.dur);A.cfx=(A.cfx||[]).filter(x=>++x.t<x.dur);A.fl=A.fl.filter(x=>++x.t<45);if(A.log&&--A.log.t<=0)A.log=null;
 if(A.phase==='over')A.areas=A.areas.filter(z=>++z.t<z.dur)}

/* ---- drawing ---- */
function rEll(x,y,rx,ry,c,a){ctx.save();ctx.globalAlpha=a;ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();ctx.restore()}
function rRing(x,y,rx,ry,c,a,w){ctx.save();ctx.globalAlpha=a;ctx.strokeStyle=c;ctx.lineWidth=w||1;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.stroke();ctx.restore()}
const rCol=mv=>TC[mv.t]||['#e8e0ff','#ffffff','#a99cc8'];
function rDrawF(f){const m=f.m,name=D[m.id].name,S=26,pose=k=>{const i=ARPI[name+'_'+k];return okI(i)?i:null};
 rEll(f.x,f.y,8,3,'#000',0.35);if(f.wind)rRing(f.x,f.y-10,13+Math.sin(RTA.t/2)*1.5,13,rCol(MV[m.moves[f.wind.i]])[1],0.9,2);
 let im=null,flip=false,rot=0;const atk=f.wind||f.atkT>0;
 if(m.hp<=0){im=pose('ko');if(!im){im=ARTI[name];rot=Math.PI/2}}else if(f.hurt>0)im=pose('hurt');
 if(!im){if(f.face==='up')im=(atk&&pose('atk_back'))||(okI(ARTBI[name])?ARTBI[name]:null);
  else if(f.face==='down')im=(atk&&pose('atk_front'))||ARTI[name];
  else{const sd=!atk&&pose(f.step%24<12?'side_a':'side_b');if(sd){im=sd;flip=f.face==='left'}else{im=(atk&&pose('atk_front'))||ARTI[name];flip=f.face==='right'}}
  if(!okI(im)){im=ARTI[name];flip=f.face==='right'}}
 if(!okI(im)){dspr(m.id,f.x-12,f.y-24,1.5,f.face==='up',m);return}
 const bob=f.mx||f.my?Math.abs(Math.sin(f.step/4))*1.5:0;ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.translate(Math.round(f.x),Math.round(f.y-bob));
 if(m.hp<=0)ctx.globalAlpha=0.75;if(f.hurt>0&&f.hurt%4<2)ctx.filter='brightness(2.6)';else if(m.st==='freeze')ctx.filter='saturate(0.3) brightness(1.5)';
 if(flip)ctx.scale(-1,1);if(rot){ctx.translate(0,-S/4);ctx.rotate(rot)}ctx.drawImage(im,-S/2,-S,S,S);ctx.restore();
 if(f.aura)rRing(f.x,f.y-4,14-f.aura/6,6,rCol(MV[m.moves[f.sel]])[1],f.aura/36,2);
 const SF={burn:['common_status_burn_poison',0],poison:['common_status_burn_poison',1],shock:['common_status_shock_freeze',0],freeze:['common_status_shock_freeze',1]}[m.st],lf=Math.floor(RTA.t/6)%4;
 let drawn=m.hp>0&&SF&&rCF(SF[0],SF[1],m.st==='freeze'?1+(Math.floor(RTA.t/20)%2):lf,f.x,f.y-12,30,0.9);
 if(m.cf>0&&m.hp>0&&rCF('common_status_confuse_ko',0,lf,f.x,f.y-30,18,1))drawn=drawn||'cf';
 if(m.st&&m.hp>0&&!SF)rect(Math.round(f.x)-2,Math.round(f.y)-30,4,4,STC[m.st][1]);if(m.st&&m.hp>0&&SF&&!drawn)rect(Math.round(f.x)-2,Math.round(f.y)-30,4,4,STC[m.st][1]);if(m.cf>0&&m.hp>0&&drawn!=='cf'&&!okI(ARFI.common_status_confuse_ko))txt('?',Math.round(f.x)+5,Math.round(f.y)-31,'#ff74c4',6)}
function rFxCell(mv,which,k,x,y,w,flip,a){const af=rArtFx(mv);if(okI(af)){const r=which==='i'?1:0,f=which==='i'?Math.min(3,Math.floor(k*4)):Math.floor(k*4)%4;drawCell(af,[f*192,r*256,192,256],x,y,w*1.5,w*2,which==='i'?false:flip,a);return}
 const an=mv.an,im=an&&FXI['mv_'+an.r],R=an&&MOVEFX.rows[an.r];
 if(!okI(im)||!R||!R[which]||!R[which].length){const c=rCol(mv);rEll(x,y,w/3,w/3,c[0],a*0.8);rEll(x,y,w/6,w/6,c[1],a);return}
 const L=R[which],c=which==='i'?L[Math.min(an.i,L.length-1)]:L[Math.floor(k*L.length)%L.length];drawCell(im,c,x,y,w*c[2]/Math.max(c[2],c[3]),w*c[3]/Math.max(c[2],c[3]),flip,a)}
function rtaDraw(){const A=RTA,pl=PL[A.pl],sx=A.shake>0?(A.shake--%2?1:-1):0,im=ARSI[A.key+'_arena'],bg=okI(im)?im:SCI[A.key+'_battle'];
 if(okI(bg)){cover(bg,0,0,160,144);if(bg!==im){ctx.fillStyle='rgba(18,12,34,0.4)';ctx.fillRect(0,0,160,144)}}
 else{const e=ENV[pl.env]||ENV.desert;rect(0,0,160,144,e.o2);for(let y=RF.y0;y<RF.y1;y+=16)for(let x=RF.x0;x<RF.x1;x+=16)rect(x,y,Math.min(16,RF.x1-x),Math.min(16,RF.y1-y),((x+y)/16)%2?e.g:e.g2)}
 ctx.save();ctx.translate(sx,0);ctx.strokeStyle='rgba(95,242,255,0.55)';ctx.strokeRect(RF.x0+0.5,RF.y0+0.5,RF.x1-RF.x0-1,RF.y1-RF.y0-1);rTerDraw();rHazDraw(false);
 for(const z of A.areas){const c=rCol(z.atk.mv);
  if(z.kind==='zone'&&z.t>=0&&z.t<z.delay){const k=z.t/z.delay;if(!rCF('common_trait_telegraph',1,Math.floor(A.t/5)%4,z.x,z.y-z.r*0.6,z.r*2.6,0.55+0.45*k)){rEll(z.x,z.y,z.r,z.r*0.5,'#ff5a3a',0.15+0.25*k);rRing(z.x,z.y,z.r*(1.4-0.4*k),z.r*0.5*(1.4-0.4*k),'#ff7a3a',0.9,1)}}
  if(z.kind==='field'){rEll(z.x,z.y,z.r,z.r*0.5,c[0],0.28+0.08*Math.sin(z.t/6));rRing(z.x,z.y,z.r,z.r*0.5,c[1],0.6,1)}}
 const ord=A.f.slice().sort((a,b)=>a.y-b.y);for(const f of ord)rDrawF(f);rHazDraw(true);
 for(const s of A.shots){const c=rCol(s.atk.mv),y=s.lob?s.y-Math.sin(Math.PI*s.t/s.life)*14:s.y;
  if(s.wave){rEll(s.x,s.y+6,s.r,s.r*0.45,c[0],0.55);rRing(s.x,s.y+6,s.r,s.r*0.45,c[1],0.9,2)}else{rEll(s.x,s.y+8,3,1.2,'#000',0.3);rFxCell(s.atk.mv,'p',s.t/8,s.x,y,12,s.vx<0,1)}}
 for(const z of A.areas)if(z.kind==='beam'){const c=rCol(z.atk.mv),a=1-z.t/z.dur;ctx.save();ctx.globalAlpha=a;ctx.lineCap='round';ctx.strokeStyle=c[0];ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(z.x,z.y);ctx.lineTo(z.ex,z.ey);ctx.stroke();ctx.strokeStyle=c[1];ctx.lineWidth=2;ctx.stroke();ctx.restore()}
 for(const x of A.fx){const k=x.t/x.dur;rFxCell(x.mv,'i',k,x.x,x.y,(x.big?40:26)*(0.55+0.45*Math.min(1,k*3)),false,k>0.7?(1-k)/0.3:1)}
 for(const x of A.cfx||[])rCF(x.sheet,x.row,Math.min(3,Math.floor(x.t/x.dur*4)),x.x,x.y,x.w,x.t>x.dur*0.75?(x.dur-x.t)/(x.dur*0.25):1,x.flip);
 for(const x of A.fl){ctx.save();ctx.globalAlpha=x.t>30?(45-x.t)/15:1;txt(x.s,Math.round(x.x-x.s.length*2.5),Math.round(x.y-x.t*0.4),'#1b1424',5);txt(x.s,Math.round(x.x-x.s.length*2.5)-1,Math.round(x.y-x.t*0.4)-1,x.c,5);ctx.restore()}
 ctx.restore();rHud()}
function rHud(){const A=RTA,[p,e]=A.f;
 if(rUiOk('panel_l','panel_r','bar_g','bar_y','bar_r','timer'))for(const[f,x,flip]of[[p,0,false],[e,96,true]])rPanel(f,x,flip);
 else{rect(0,0,160,18,'#120c22');txtFit(nm(p.m),2,2,'#e8e0ff',58,6);hpbar(2,10,64,p.m);txtFit(nm(e.m),94,2,'#e8e0ff',58,6);hpbar(94,10,64,e.m)}
 const T0=ARJ.match.time*60*(A.tm&&A.tm[0].length>1?2:1),left=A.phase==='count'?T0:Math.max(0,T0-(A.t-A.t0)),ts=String(Math.ceil(left/60)).padStart(2,'0');
 if(rUi('timer',69,0,22,22))txt(ts,80-ts.length*3,8,left<600?'#ff8a1e':'#ffd23f',6);else txt(ts,72,5,left<600?'#ff8a1e':'#ffd23f',8);
 rect(0,126,160,18,'#120c22');const art=rUiOk('btn_ready','btn_cool');
 p.m.moves.forEach((mi,i)=>{const x=i*40,mv=MV[mi],c=rCol(mv),k=p.cd[i]/p.cdm[i];
  if(art){rUi(k>0?'btn_cool':i===p.sel?'btn_pressed':'btn_ready',x+1,127,16,16);rUi('ty_'+String(mv.t).toLowerCase(),x+4,130,10,10,k>0?0.45:1);
   if(k>0){ctx.save();ctx.globalAlpha=0.55;ctx.fillStyle='#120c22';ctx.beginPath();ctx.moveTo(x+9,135);ctx.arc(x+9,135,7,-Math.PI/2,-Math.PI/2+Math.PI*2*k);ctx.closePath();ctx.fill();ctx.restore()}
   if(i===p.sel)rect(x+18,141,20,1,'#ffd23f');txtFit(mv.n,x+18,131,k>0?'#a99cc8':'#ffffff',21,5)}
  else{rect(x+1,130,38,13,i===p.sel?'#ffd23f':'#3b2a5c');rect(x+2,131,36,11,'#1b1424');rect(x+2,131,Math.round(36*(1-k)),11,k>0?c[2]:c[0]);txtFit(mv.n,x+3,134,k>0?'#a99cc8':'#ffffff',34,5)}});
 if(A.log){const w=wrap(A.log.s,29).slice(0,2);box(4,121-w.length*7,152,7+w.length*7,'#f8f4ff');w.forEach((l,i)=>txt(l,7,125-w.length*7+i*7,'#1b1424',5))}
 if(A.phase==='count'){const n=3-Math.floor(A.t/(ARJ.match.countdown/4)),s=n>0?String(n):'GO!';if(!rUi(n>0?'cd_'+n:'cd_go',56,44,48)){txt(s,80-s.length*8+1,61,'#1b1424',16);txt(s,80-s.length*8,60,'#ffd23f',16)}}
 if(A.phase==='fight'&&A.t-A.t0<30&&!rUi('cd_go',56,44,48))txt('GO!',57,60,'#ffd23f',16);
 if(A.phase==='over'){if(A.ot<45&&rUi(A.timeout?'cd_time':'cd_ko',52,40,56)){}else{const s=['VICTORY!','TRY AGAIN!','DRAW'][A.win];
  if(!rUi(['res_win','res_lose','res_draw'][A.win],16,48,128)){box(80-s.length*4-10,52,s.length*8+20,30,'#3b2a5c','#ffd23f');txt(s,80-s.length*4,58,'#ffd23f')}
  if(A.ot>50&&frame%40<28)txt('A: continue',47,84,'#e8e0ff',5)}}}
// one HUD panel: portrait in the frame, HP in the slot, team pips (filled for the Alienmon still standing)
function rPanel(f,x,flip){const W=64,H=28,m=f.m,r=Math.max(0,m.hp/stat(m,0));rUi(flip?'panel_r':'panel_l',x,0,W,H);
 const tm=RTA.tm?RTA.tm[f.side]:[f];if(tm.length>1)tm.forEach((q,i)=>{const px=x+((flip?[0.358,0.465,0.568]:[0.432,0.533,0.640])[i])*W,py=0.833*H;rEll(px,py,1.6,1.6,q.m.hp<=0?'#3b2a5c':q===f?'#5ff2ff':'#9be36b',1)});
 const sx=x+(flip?0.054:0.396)*W,sy=0.352*H,sw=0.55*W,sh=0.172*H,bar=ARUI[r>0.5?'bar_g':r>0.2?'bar_y':'bar_r'];
 if(okI(bar)&&r>0){ctx.save();ctx.imageSmoothingEnabled=true;ctx.drawImage(bar,0,0,bar.naturalWidth*r,bar.naturalHeight,flip?sx+sw*(1-r):sx,sy,sw*r,sh);ctx.restore()}
 const im=ARTI[D[m.id].name],px=x+(flip?0.70:0.045)*W,py=0.14*H,ps=0.26*W;if(okI(im))ctx.drawImage(im,px,py,ps,ps);
 txtFit(nm(m),flip?x+2:x+26,H+1,'#e8e0ff',36,5)}

/* ---- touch controls for the arena: four round move buttons replace A/B while a match runs, and the d-pad wears the
 analog-stick art (the owner's move_buttons sheet). Everything returns to normal when the match ends. ---- */
const RTAB=(()=>{const dev=document.querySelector('.device'),ab=document.querySelector('.ab');if(!dev||!ab)return null;
 const u=k=>ARA.uicut&&ARA.uicut[k]?'url('+ARA.uicut[k]+')':'none';
 const st=document.createElement('style');st.textContent=
  'body.in-rta .ab{display:none}.rtab{display:none;grid-area:ab;justify-self:center;align-self:center;grid-template-columns:62px 62px;gap:2px 14px}'+
  'body.in-rta .rtab{display:grid}.rtab button{position:relative;width:62px;height:80px;border:0;background:none;padding:0;font:inherit;color:#e8e0ff;touch-action:none}'+
  '.rtab .ring{position:absolute;left:3px;top:0;width:56px;height:56px;background:'+u('btn_ready')+' center/contain no-repeat}'+
  '.rtab .cool .ring{background-image:'+u('btn_cool')+'}.rtab .on .ring{background-image:'+u('btn_pressed')+'}'+
  '.rtab .ty{position:absolute;left:17px;top:14px;width:28px;height:28px;background:center/contain no-repeat}'+
  '.rtab .cd{position:absolute;left:9px;top:6px;width:44px;height:44px;border-radius:50%;pointer-events:none}'+
  '.rtab .nm{position:absolute;left:-10px;right:-10px;top:56px;font-size:8px;line-height:1.15;text-align:center;white-space:normal;word-break:break-word;color:#fff;text-shadow:0 1px 0 #000;border-top:2px solid var(--tc,#5ff2ff);padding-top:2px}'+
  'body.in-rta .dpad{background:'+u('stick')+' center/120% no-repeat;box-shadow:none}body.in-rta .dpad button{color:transparent}body.in-rta .dpad .c{background:none;box-shadow:none}';
 document.head.appendChild(st);
 const box=document.createElement('div');box.className='rtab';ab.after(box);
 const B=[0,1,2,3].map(i=>{const b=document.createElement('button');b.innerHTML='<div class="ring"></div><div class="ty"></div><div class="cd"></div><div class="nm"></div>';
  b.addEventListener('pointerdown',e=>{e.preventDefault();pressed['m'+i]=true;b.classList.add('on')});
  const up=()=>b.classList.remove('on');b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);box.appendChild(b);
  return{b,ty:b.querySelector('.ty'),cd:b.querySelector('.cd'),nm:b.querySelector('.nm'),last:''}});
 const sw=document.createElement('button');sw.className='sw';sw.innerHTML='<div class="ring"></div><div class="nm">Swap</div>';
 sw.addEventListener('pointerdown',e=>{e.preventDefault();pressed.sw=true});box.appendChild(sw);
 st.textContent+='.rtab .sw{grid-column:1/3;justify-self:center;height:56px;display:none}.rtab .sw .ring{left:9px;width:44px;height:44px;background:'+u('swap')+' center/contain no-repeat}.rtab .sw .nm{top:44px;border:0}body.in-rta.rta-team .rtab .sw{display:block}';
 return{B,on:false,sw}})();
function rTouchUpd(){if(!RTAB)return;const on=scene==='rta'&&!!RTA;if(on!==RTAB.on){document.body.classList.toggle('in-rta',on);RTAB.on=on}document.body.classList.toggle('rta-team',on&&RTA.tm[0].length>1);if(!on)return;
 const p=RTA.f[0];RTAB.B.forEach((x,i)=>{const mi=p.m.moves[i];x.b.style.visibility=mi==null?'hidden':'visible';if(mi==null)return;
  const mv=MV[mi],k=p.cd[i]/p.cdm[i],key=mv.n+'|'+mv.t;
  if(x.last!==key){x.last=key;x.nm.textContent=mv.n;x.b.style.setProperty('--tc',(TC[mv.t]||['#5ff2ff'])[0]);const t=ARA.uicut&&ARA.uicut['ty_'+String(mv.t).toLowerCase()];x.ty.style.backgroundImage=t?'url('+t+')':'none'}
  x.b.classList.toggle('cool',k>0);x.cd.style.background=k>0?'conic-gradient(rgba(18,12,34,0.65) '+Math.round(k*360)+'deg,transparent 0)':'none';
  x.b.style.outline=i===p.sel?'':'';x.ty.style.opacity=k>0?0.45:1})}
