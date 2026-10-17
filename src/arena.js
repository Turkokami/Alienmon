/* ---------- Linker Arena: real-time arena battles (docs/arena/ARENA_BUILD_PLAN.md) ----------
 Phase 1: 1v1 against the computer at level 50, entered from START > Arena. Both Alienmon are copies, so the save's
 party is never touched. Moves fire from the Alienmon's own moveset; cooldowns, wind-ups and shapes come from
 data/arena.json. Damage, type matchups, Traits and status all run through the turn-based act(), so balance has one home.
 Controls: d-pad moves, A uses the selected move, B selects the next move, START pauses; keys 1-4 (or J K L I) fire a move.
 Art: art/arena/poses/<Name>_<pose>.png when imported (tools/import_arena_sheet.py), otherwise the battle sprites;
 art/arena/scenes/<planet>_arena.jpg when rendered, otherwise the planet's battle background.
 Online play (Phase 5) needs act() to take a seeded random source; the arena's own choices already use RTA.r. */
const ARJ=__ARENA__,ARA=__ARENAART__;
const ARPI=lazyImgs(ARA.poses),ARSI=lazyImgs(ARA.scenes);
const RF={x0:6,y0:20,x1:154,y1:128};   // the arena floor on the 160x144 screen
const RDIFF=[['Easy',27,0.35],['Normal',15,0.18],['Hard',7,0.06]];   // name, ticks between decisions, aim error (radians)
const RREACH={PROJ:100,LOB:90,WAVE:110,BEAM:110,CHAIN:110,ARC:22,CONE:34,BURST:28,DASH:50,ZONE:80,RAIN:80,FIELD:70,AURA:999};
let RTA=null;const RTO={diff:1,arena:0,pick:0};
addEventListener('keydown',e=>{if(scene!=='rta')return;const k={Digit1:0,Digit2:1,Digit3:2,Digit4:3,KeyJ:0,KeyK:1,KeyL:2,KeyI:3}[e.code];if(k!==undefined){pressed['m'+k]=true;e.preventDefault()}});

function rShape(mv){const s=(mv.sig?ARJ.signature:ARJ.moves)[mv.n];if(s)return s[0];const fx=mv.fx||{};
 if(!mv.p)return(fx.self||fx.heal)&&!fx.foe&&!fx.s?'AURA':'FIELD';return mv.p<=45?'PROJ':mv.p<=80?(PHYS.has(mv.t)?'ARC':'PROJ'):'ZONE'}
const rTier=mv=>mv.p?ARJ.tiers.find(t=>mv.p<=t.max):ARJ.status;
const rSpeed=f=>0.45+Math.min(160,es(f.m,'spe'))/260;   // px per tick
const rFoe=f=>RTA.f[1-f.side];
// every HP change in the arena is scaled (data/arena.json match.scale), never below 1 point
function rScaled(ms,fn){const h0=ms.map(m=>m.hp),r=fn();ms.forEach((m,i)=>{const dh=m.hp-h0[i];if(dh)m.hp=Math.max(0,Math.min(stat(m,0),h0[i]+Math.sign(dh)*Math.max(1,Math.round(Math.abs(dh)*ARJ.match.scale))))});return r}

/* ---- menu and match setup ---- */
function rtaMenu(){if(!G.party.length)return say('You need an Alienmon to enter the Arena.');RTO.pick=Math.min(RTO.pick,G.party.length-1);
 choose('Arena (beta)',['Fight!','Partner: '+nm(G.party[RTO.pick]),'CPU: '+RDIFF[RTO.diff][0],'Arena: '+PL[RTO.arena].name,'Record','How to play','Back'],k=>{
  if(k===0)rtaStart();
  else if(k===1)choose('Partner',G.party.map(m=>nm(m)+' L'+m.lv),i=>{RTO.pick=i;rtaMenu()},rtaMenu);
  else if(k===2){RTO.diff=(RTO.diff+1)%RDIFF.length;rtaMenu()}
  else if(k===3){RTO.arena=(RTO.arena+1)%PL.length;rtaMenu()}
  else if(k===4){const r=G.rta||{w:0,l:0,d:0};say(['Arena record: '+r.w+' wins, '+r.l+' losses, '+r.d+' draws.'],rtaMenu)}
  else if(k===5)say(['Arena battles happen in real time. Both Alienmon fight at level 50.','D-pad moves. A uses the selected move, B selects the next one (keys 1-4 fire a move directly).','Strong moves need time to recharge, and the biggest ones glow before they hit. Watch for red rings on the ground and dodge!','Types, Traits and status all work like normal battles.'],rtaMenu)},()=>{})}
function rFighter(m,side){const c={...m,lv:ARJ.match.level,st:null,cf:0,moves:(m.moves&&m.moves.length?m.moves:[0]).slice(0,4)};resetStages(c);c.hp=stat(c,0);
 return{m:c,side,x:side?RF.x1-28:RF.x0+28,y:(RF.y0+RF.y1)/2+12,face:side?'left':'right',ax:side?-1:1,ay:0,mx:0,my:0,
  cd:c.moves.map(()=>0),cdm:c.moves.map(()=>1),sel:0,wind:null,atkT:0,hurt:0,kb:[0,0],dash:null,frz:0,imm:0,step:0,aura:0,ai:{t:0,mx:0,my:0,str:1}}}
function rtaStart(fid){const me=G.party[RTO.pick],pl=PL[RTO.arena],r=rng(hash('rta'+Date.now()));
 if(fid===undefined){const ban=i=>!D[i]||['legendary','mythic'].includes(D[i].r)||i===me.id;let pool=pl.pool.c.concat(pl.pool.e,pl.pool.r).filter(i=>!ban(i));
  if(!pool.length)pool=D.map((d,i)=>i).filter(i=>!ban(i));fid=pool[Math.floor(r()*pool.length)]}
 const f=[rFighter(me,0),rFighter(mk(fid,ARJ.match.level),1)];
 RTA={key:pl.key,pl:RTO.arena,fid,r,t:0,t0:0,phase:'count',f,shots:[],areas:[],fx:[],fl:[],log:null,shake:0,diff:RDIFF[RTO.diff],win:-1};
 warm(ARTI,f.map(x=>D[x.m.id].name));warm(ARTBI,f.map(x=>D[x.m.id].name));
 const L=[];entry(f[0].m,f[1].m,L);entry(f[1].m,f[0].m,L);rLog(L);scene='rta'}

/* ---- update ---- */
function rtaUpd(){const A=RTA;A.t++;
 if(A.phase!=='over'&&P_('start')){choose('Paused',['Resume','Forfeit'],k=>{if(k===1)rtaOver(1)},()=>{});rtaDraw();return}
 if(A.phase==='count'){if(A.t>=ARJ.match.countdown){A.phase='fight';A.t0=A.t}rtaDraw();return}
 if(A.phase==='over'){A.ot++;rStepFx();if(A.ot>50&&(P_('a')||P_('b')))rtaResult();rtaDraw();return}
 const[p,e]=A.f;rControl(p);rAI(e,p);for(const f of A.f)rStep(f);rShots();rAreas();rTick();rStepFx();
 const left=ARJ.match.time*60-(A.t-A.t0),fr=m=>m.hp/stat(m,0);
 if(p.m.hp<=0||e.m.hp<=0)rtaOver(p.m.hp<=0&&e.m.hp<=0?2:p.m.hp<=0?1:0);
 else if(left<=0)rtaOver(Math.abs(fr(p.m)-fr(e.m))<0.01?2:fr(p.m)>fr(e.m)?0:1);
 rtaDraw()}
function rtaOver(win){const A=RTA;if(A.phase==='over')return;A.phase='over';A.ot=0;A.win=win;A.shots=[];A.areas=A.areas.filter(z=>z.kind==='beam');
 G.rta=G.rta||{w:0,l:0,d:0};G.rta[['w','l','d'][win]]++}
function rtaResult(){choose('Arena',['Rematch','New foe','Leave'],k=>{if(k===0)rtaStart(RTA.fid);else if(k===1)rtaStart();else rtaLeave()},rtaLeave)}
function rtaLeave(){RTA=null;scene='menu';menuMode='root'}

function rControl(f){f.mx=(held.right?1:0)-(held.left?1:0);f.my=(held.down?1:0)-(held.up?1:0);
 if(P_('b'))f.sel=(f.sel+1)%f.m.moves.length;let use=P_('a')?f.sel:-1;
 for(let i=0;i<4;i++)if(P_('m'+i)&&i<f.m.moves.length){use=i;f.sel=i}
 if(use<0)return;const foe=rFoe(f),dx=foe.x-f.x,dy=foe.y-f.y,d=Math.hypot(dx,dy)||1;let ax=f.ax,ay=f.ay;
 if(ax*dx/d+ay*dy/d>0.82){ax=dx/d;ay=dy/d}   // inside a ~35 degree cone the shot snaps onto the foe
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
 else if(m.st!=='freeze'&&!f.wind){const l=Math.hypot(f.mx,f.my);if(l){const s=rSpeed(f);f.x+=f.mx/l*s;f.y+=f.my/l*s;f.ax=f.mx/l;f.ay=f.my/l;f.step++;
  f.face=Math.abs(f.mx)>=Math.abs(f.my)?(f.mx<0?'left':'right'):(f.my<0?'up':'down')}}
 if(f.wind&&--f.wind.t<=0)rRelease(f);
 const o=rFoe(f);if(o.m.hp>0){const dx=f.x-o.x,dy=f.y-o.y,d=Math.hypot(dx,dy);if(d<12&&d>0){f.x+=dx/d*0.6;f.y+=dy/d*0.6}}   // bodies don't overlap
 f.x=Math.max(RF.x0+8,Math.min(RF.x1-8,f.x));f.y=Math.max(RF.y0+20,Math.min(RF.y1-2,f.y))}

/* ---- attacks: one attack object per use, each target hit at most once ---- */
function rFire(f,i,ax,ay){const A=RTA,mv=MV[f.m.moves[i]],sh=rShape(mv),atk={f,mv,hit:new Set()},foe=rFoe(f);
 const reach=Math.min(Math.hypot(foe.x-f.x,foe.y-f.y),RREACH[sh]),tx=f.x+ax*reach,ty=f.y+ay*reach;
 if(sh==='AURA'){const h=f.m.hp;rLog(rScaled([f.m,foe.m],()=>act(f.m,foe.m,mv)));if(f.m.hp>h)rFloat(f,'+'+(f.m.hp-h),'#9be36b');f.aura=36;return}
 if(sh==='PROJ'||sh==='LOB')A.shots.push({x:f.x+ax*8,y:f.y-8+ay*8,vx:ax*2.6,vy:ay*2.6,r:4,life:60,t:0,lob:sh==='LOB',atk});
 else if(sh==='WAVE')A.shots.push({x:f.x+ax*8,y:f.y-8+ay*8,vx:ax*1.8,vy:ay*1.8,r:11,life:75,t:0,wave:1,atk});
 else if(sh==='BEAM'||sh==='CHAIN'){const L=RREACH[sh],ex=f.x+ax*L,ey=f.y-8+ay*L;A.areas.push({kind:'beam',x:f.x,y:f.y-8,ex,ey,t:0,dur:16,atk});
  const px=foe.x-f.x,py=foe.y-8-(f.y-8),k=Math.max(0,Math.min(L,px*ax+py*ay));if(Math.hypot(px-ax*k,py-ay*k)<9)rHit(atk,foe)}
 else if(sh==='ARC')rHitAt(atk,f.x+ax*14,f.y-8+ay*14,12,false,true);
 else if(sh==='CONE')rHitAt(atk,f.x+ax*20,f.y-8+ay*20,16,false,true);
 else if(sh==='BURST'){rHitAt(atk,f.x,f.y-8,26,false);rImpact(atk,f.x,f.y-8,1)}
 else if(sh==='DASH')f.dash={vx:ax*3.4,vy:ay*3.4,t:14,atk};
 else if(sh==='ZONE')A.areas.push({kind:'zone',x:tx,y:ty,r:16,t:0,delay:30,atk});
 else if(sh==='RAIN')for(let j=0;j<3;j++)A.areas.push({kind:'zone',x:tx+(A.r()-0.5)*30,y:ty+(A.r()-0.5)*18,r:11,t:-j*8,delay:30,atk});
 else A.areas.push({kind:'field',x:tx,y:ty,r:18,t:0,dur:240,atk})}
// ground: test against the feet (zones and fields) instead of the body; fx: show the impact even on a miss
function rHitAt(atk,x,y,r,ground,fx){const t=rFoe(atk.f);if(fx)rImpact(atk,x,y);if(t.m.hp<=0||atk.hit.has(t))return;
 if(Math.hypot(t.x-x,(ground?t.y:t.y-8)-y)<r+7)rHit(atk,t)}
function rHit(atk,t){atk.hit.add(t);const a=atk.f.m,d=t.m,mv=atk.mv,hp0=d.hp;
 const sh=a.st==='shock',cf=a.cf;if(sh)a.st=null;a.cf=0;   // already checked when the move was used
 const L=rScaled([a,d],()=>act(a,d,{...mv,a:1e9}));if(sh&&!a.st)a.st='shock';if(!a.cf)a.cf=cf;   // accuracy is the hitbox's job in real time
 const dmg=hp0-d.hp;rImpact(atk,t.x,t.y-8);
 if(dmg>0){t.hurt=14;const k=Math.min(3,0.8+(mv.p||40)/50),dx=t.x-atk.f.x,dy=t.y-atk.f.y,l=Math.hypot(dx,dy)||1;t.kb=[dx/l*k,dy/l*k];rFloat(t,'-'+dmg,'#ffffff');
  const e=eff(mv.t,D[d.id].t);if(e>1){rFloat(t,'SUPER!','#ffd23f');RTA.shake=8}else if(e<1)rFloat(t,'resist','#a99cc8');if(L.includes('A critical hit!'))rFloat(t,'CRIT!','#ff8a1e');if((mv.p||0)>80)RTA.shake=Math.max(RTA.shake,6)}
 else if(d.hp>hp0)rFloat(t,'+'+(d.hp-hp0),'#9be36b');
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
function rAI(f,foe){const A=RTA,ai=f.ai,r=A.r;f.mx=ai.mx;f.my=ai.my;if(f.m.hp<=0||foe.m.hp<=0||--ai.t>0)return;ai.t=A.diff[1];
 const dx=foe.x-f.x,dy=foe.y-f.y,d=Math.hypot(dx,dy)||1;let best=-1,bv=0;
 f.m.moves.forEach((mi,i)=>{if(f.cd[i]>0)return;const mv=MV[mi],sh=rShape(mv);let v;
  if(!mv.p){const fx=mv.fx||{};v=fx.heal?(f.m.hp<stat(f.m,0)*0.5?120:0):fx.s?((foe.m.st||immune(foe.m,fx.s))?0:50):fx.self?(Object.keys(fx.self).some(k=>k!=='c'&&f.m.bs[k]>=2)?0:40):fx.foe?35:0}
  else{const dt=TR(foe.m.id);v=mv.p*eff(mv.t,D[foe.m.id].t)*(D[f.m.id].t.includes(mv.t)?1.5:1);if((dt.k==='absorb'&&dt.v===mv.t)||(dt.k==='float'&&mv.t==='Gravity'))v=0}
  if(d>RREACH[sh])v*=0.3;v*=0.7+r()*0.6;if(v>bv){bv=v;best=i}});
 const want=Math.min(70,(best>=0?RREACH[rShape(MV[f.m.moves[best]])]:60)*0.8);let mx=0,my=0;
 if(d>want+6){mx=dx/d;my=dy/d}else if(d<want-10){mx=-dx/d;my=-dy/d}
 if(r()<0.15)ai.str=-ai.str;mx+=-dy/d*0.7*ai.str;my+=dx/d*0.7*ai.str;
 for(const s of A.shots)if(s.atk.f!==f){const sx=f.x-s.x,sy=f.y-8-s.y;if(Math.hypot(sx,sy)<40&&s.vx*sx+s.vy*sy>0){mx-=s.vy*0.8;my+=s.vx*0.8}}
 for(const z of A.areas)if(z.atk.f!==f&&z.kind!=='beam'){const zx=f.x-z.x,zy=f.y-z.y,zd=Math.hypot(zx,zy)||1;if(zd<z.r+12){mx+=zx/zd*1.5;my+=zy/zd*1.5}}
 if(f.x<RF.x0+16)mx+=1;if(f.x>RF.x1-16)mx-=1;if(f.y<RF.y0+24)my+=1;if(f.y>RF.y1-8)my-=1;
 ai.mx=Math.abs(mx)<0.3?0:Math.sign(mx);ai.my=Math.abs(my)<0.3?0:Math.sign(my);
 if(best>=0&&bv>0&&d<=RREACH[rShape(MV[f.m.moves[best]])]){const ang=Math.atan2(dy,dx)+(r()-0.5)*2*A.diff[2];rUse(f,best,Math.cos(ang),Math.sin(ang))}}

/* ---- effects and messages ---- */
function rImpact(atk,x,y,big){RTA.fx.push({x,y,t:0,dur:big?26:20,big,mv:atk.mv})}
function rFloat(f,s,c){RTA.fl.push({x:f.x,y:f.y-26,s,c,t:0})}
function rLog(L){const s=(L||[]).filter(l=>!/ used /.test(l)&&!/fainted!$/.test(l));if(s.length)RTA.log={s:s[s.length-1],t:150}}
function rStepFx(){const A=RTA;A.fx=A.fx.filter(x=>++x.t<x.dur);A.fl=A.fl.filter(x=>++x.t<45);if(A.log&&--A.log.t<=0)A.log=null;
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
 if(m.st&&m.hp>0)rect(Math.round(f.x)-2,Math.round(f.y)-30,4,4,STC[m.st][1]);if(m.cf>0&&m.hp>0)txt('?',Math.round(f.x)+5,Math.round(f.y)-31,'#ff74c4',6)}
function rFxCell(mv,which,k,x,y,w,flip,a){const an=mv.an,im=an&&FXI['mv_'+an.r],R=an&&MOVEFX.rows[an.r];
 if(!okI(im)||!R||!R[which]||!R[which].length){const c=rCol(mv);rEll(x,y,w/3,w/3,c[0],a*0.8);rEll(x,y,w/6,w/6,c[1],a);return}
 const L=R[which],c=which==='i'?L[Math.min(an.i,L.length-1)]:L[Math.floor(k*L.length)%L.length];drawCell(im,c,x,y,w*c[2]/Math.max(c[2],c[3]),w*c[3]/Math.max(c[2],c[3]),flip,a)}
function rtaDraw(){const A=RTA,pl=PL[A.pl],sx=A.shake>0?(A.shake--%2?1:-1):0,im=ARSI[A.key+'_arena'],bg=okI(im)?im:SCI[A.key+'_battle'];
 if(okI(bg)){cover(bg,0,0,160,144);if(bg!==im){ctx.fillStyle='rgba(18,12,34,0.4)';ctx.fillRect(0,0,160,144)}}
 else{const e=ENV[pl.env]||ENV.desert;rect(0,0,160,144,e.o2);for(let y=RF.y0;y<RF.y1;y+=16)for(let x=RF.x0;x<RF.x1;x+=16)rect(x,y,Math.min(16,RF.x1-x),Math.min(16,RF.y1-y),((x+y)/16)%2?e.g:e.g2)}
 ctx.save();ctx.translate(sx,0);ctx.strokeStyle='rgba(95,242,255,0.55)';ctx.strokeRect(RF.x0+0.5,RF.y0+0.5,RF.x1-RF.x0-1,RF.y1-RF.y0-1);
 for(const z of A.areas){const c=rCol(z.atk.mv);
  if(z.kind==='zone'&&z.t>=0&&z.t<z.delay){const k=z.t/z.delay;rEll(z.x,z.y,z.r,z.r*0.5,'#ff5a3a',0.15+0.25*k);rRing(z.x,z.y,z.r*(1.4-0.4*k),z.r*0.5*(1.4-0.4*k),'#ff7a3a',0.9,1)}
  if(z.kind==='field'){rEll(z.x,z.y,z.r,z.r*0.5,c[0],0.28+0.08*Math.sin(z.t/6));rRing(z.x,z.y,z.r,z.r*0.5,c[1],0.6,1)}}
 const ord=A.f.slice().sort((a,b)=>a.y-b.y);for(const f of ord)rDrawF(f);
 for(const s of A.shots){const c=rCol(s.atk.mv),y=s.lob?s.y-Math.sin(Math.PI*s.t/s.life)*14:s.y;
  if(s.wave){rEll(s.x,s.y+6,s.r,s.r*0.45,c[0],0.55);rRing(s.x,s.y+6,s.r,s.r*0.45,c[1],0.9,2)}else{rEll(s.x,s.y+8,3,1.2,'#000',0.3);rFxCell(s.atk.mv,'p',s.t/8,s.x,y,12,s.vx<0,1)}}
 for(const z of A.areas)if(z.kind==='beam'){const c=rCol(z.atk.mv),a=1-z.t/z.dur;ctx.save();ctx.globalAlpha=a;ctx.lineCap='round';ctx.strokeStyle=c[0];ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(z.x,z.y);ctx.lineTo(z.ex,z.ey);ctx.stroke();ctx.strokeStyle=c[1];ctx.lineWidth=2;ctx.stroke();ctx.restore()}
 for(const x of A.fx){const k=x.t/x.dur;rFxCell(x.mv,'i',k,x.x,x.y,(x.big?40:26)*(0.55+0.45*Math.min(1,k*3)),false,k>0.7?(1-k)/0.3:1)}
 for(const x of A.fl){ctx.save();ctx.globalAlpha=x.t>30?(45-x.t)/15:1;txt(x.s,Math.round(x.x-x.s.length*2.5),Math.round(x.y-x.t*0.4),'#1b1424',5);txt(x.s,Math.round(x.x-x.s.length*2.5)-1,Math.round(x.y-x.t*0.4)-1,x.c,5);ctx.restore()}
 ctx.restore();rHud()}
function rHud(){const A=RTA,[p,e]=A.f;rect(0,0,160,18,'#120c22');
 txtFit(nm(p.m),2,2,'#e8e0ff',58,6);hpbar(2,10,64,p.m);txtFit(nm(e.m),94,2,'#e8e0ff',58,6);hpbar(94,10,64,e.m);
 const left=A.phase==='count'?ARJ.match.time*60:Math.max(0,ARJ.match.time*60-(A.t-A.t0));txt(String(Math.ceil(left/60)).padStart(2,'0'),72,5,left<600?'#ff8a1e':'#ffd23f',8);
 rect(0,129,160,15,'#120c22');p.m.moves.forEach((mi,i)=>{const x=1+i*40,mv=MV[mi],c=rCol(mv),k=p.cd[i]/p.cdm[i];
  rect(x,130,38,13,i===p.sel?'#ffd23f':'#3b2a5c');rect(x+1,131,36,11,'#1b1424');rect(x+1,131,Math.round(36*(1-k)),11,k>0?c[2]:c[0]);txtFit(mv.n,x+2,134,k>0?'#a99cc8':'#ffffff',34,5)});
 if(A.log){const w=wrap(A.log.s,29).slice(0,2);box(4,121-w.length*7,152,7+w.length*7,'#f8f4ff');w.forEach((l,i)=>txt(l,7,125-w.length*7+i*7,'#1b1424',5))}
 if(A.phase==='count'){const n=3-Math.floor(A.t/(ARJ.match.countdown/4)),s=n>0?String(n):'GO!';txt(s,80-s.length*8+1,61,'#1b1424',16);txt(s,80-s.length*8,60,'#ffd23f',16)}
 if(A.phase==='fight'&&A.t-A.t0<30)txt('GO!',57,60,'#ffd23f',16);
 if(A.phase==='over'){const s=['VICTORY!','TRY AGAIN!','DRAW'][A.win];box(80-s.length*4-10,52,s.length*8+20,30,'#3b2a5c','#ffd23f');txt(s,80-s.length*4,58,'#ffd23f');if(A.ot>50&&frame%40<28)txt('A: continue',47,70,'#e8e0ff',5)}}
