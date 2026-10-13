/* ---------- section maps: Gold/Crystal-style connected screens (data/world.json, 16 px tiles) ----------
 Each section is one pre-rendered image at 16 px per tile, drawn 1:1 into the 160x144 view with nearest-neighbour
 scaling only. Outdoor neighbours sit edge to edge, so walking off an edge carries straight on into the next
 section (it is drawn beside this one while you approach). Interiors, caves and tower floors are reached by warps:
 doors, doormats, stairs and cave mouths. Collision is one char per tile: '.' walk, '#' blocked, ',' tall grass.
 G.sec = {id,x,y} is the player's tile; the old painted town maps stay in use wherever no section is active. */
const SWORLD=__SWORLD__,SECI=lazyImgs(__SECIMG__),SECQ=__SECQ__;
const SEC_STEP=8;               // frames per tile (2 px a frame, Gold/Crystal walking pace)
let SJ=null,SJBUF=0,SM=null,SFADE=null,SBANNER=0,SDEBUG=false,SBUMP=0,SNEAR=null;
const secOn=()=>!!(G&&G.sec&&SWORLD[G.sec.id]);
const secTile=(s,x,y)=>x<0||y<0||x>=s.tiles[0]||y>=s.tiles[1]?null:s.rows[y][x];
const DIRS={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
const secVis=n=>(!n.after||mDone(n.after))&&(!n.until||!mDone(n.until))&&(!n.flag||!!(G.flags&&G.flags[n.flag]))&&(!n.legend||legendHere(n.legend));
const secNpcs=s=>(s.npcs||[]).filter(secVis);
function secNpcAt(s,x,y){return secNpcs(s).find(n=>n.x===x&&n.y===y)}
function secStashAt(s,x,y){return(s.objects||[]).find(o=>o.k==='stash'&&o.tile[0]===x&&o.tile[1]===y&&!(G.opened&&G.opened[s.id+':'+o.tile]))}
function secWalk(s,x,y){const c=secTile(s,x,y);return(c==='.'||c===',')&&!secNpcAt(s,x,y)&&!secStashAt(s,x,y)&&!(s.id===(G.sec&&G.sec.id)&&(secQAt(x,y,true)||secMonAt(s,x,y)))}
const QCHAR=new Set(['giver','talk','turnin','trainer','legend']);
function secQAt(x,y,chars){if(typeof qEnts!=='function')return null;return qEnts().find(e=>(!chars||QCHAR.has(e.k))&&e.k!=='beacon'&&Math.floor(e.x/16)===x&&Math.floor(e.y/16)===y)}
function secMonAt(s,x,y){return(s.mons||[]).find(m=>m.x===x&&m.y===y&&!(G.monGone&&G.monGone[s.id+':'+m.x+','+m.y]))}
// the section and tile you'd stand on if you stepped from (x,y) in direction d (crossing a seamless edge if needed)
function secAhead(s,x,y,d){const[dx,dy]=DIRS[d],nx=x+dx,ny=y+dy;if(secTile(s,nx,ny)!==null)return{s,x:nx,y:ny};
 const side=dx>0?'right':dx<0?'left':dy>0?'bottom':'top',e=s.edges[side],along=dx?y:x;
 if(!e||along<e.range[0]||along>e.range[1])return null;if(e.to==='arrival')return{arrival:true,side};const t=SWORLD[e.to];if(!t)return null;
 const k=along+(e.offset||0);return side==='right'?{s:t,x:0,y:k}:side==='left'?{s:t,x:t.tiles[0]-1,y:k}:side==='bottom'?{s:t,x:k,y:0}:{s:t,x:k,y:t.tiles[1]-1}}
function secPrefetch(id){const s=SWORLD[id];if(!s)return;SECI[id];const g=(G&&G.gender)||'boy';for(const f of['down','up','left','right'])CHI[g+'_'+f];for(const n of s.npcs||[])CHI[n.art];for(const e of Object.values(s.edges))if(SWORLD[e.to])SECI[e.to];for(const w of s.warps)SECI[w.to]}
function enterSection(id,at,f,quiet){const prev=G.sec&&G.sec.id;G.sec={id,x:at[0],y:at[1]};if(f)face=f;SM=null;secPrefetch(id);
 const s=SWORLD[id];if(!quiet&&(!prev||SWORLD[prev].name!==s.name))SBANNER=100}
function secWarp(w){SFADE={t:0,go:()=>{enterSection(w.to,w.at,w.face);if(w.kind==='door'||w.kind==='stairs')doorSfx()}}}
function doorSfx(){try{if(!AC||musicMode==='off')return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.setValueAtTime(220,t);o.frequency.setValueAtTime(330,t+0.05);g.gain.setValueAtTime(0.035,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+0.13)}catch(e){}}
function bumpSfx(){if(SBUMP>0)return;SBUMP=14;try{if(!AC||musicMode==='off')return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.setValueAtTime(90,t);g.gain.setValueAtTime(0.03,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+0.09)}catch(e){}}
// arriving on a tile: warps (doors, mats, stairs, cave mouths) fire as you step onto them
const secTrainerH=n=>({id:n.id,cls:n.trainer.cls,name:n.trainer.name,art:n.art,app:n.trainer.app,route:n.trainer.route});
// the Molten Frontier's own trainers keep their world ids, lines and story-paced teams
function secTrainerTalk(n){if(n.trainer.linker&&G.beaten[n.id])return say(n.t,null,n.art);if(!n.trainer.frontier)return trainerTalk(secTrainerH(n));const t0=n.t[0]||'',name=t0.split(':')[0],team=frontierTeam({id:n.id})||townTrainer(secTrainerH(Object.assign({},n,{trainer:{cls:name,name:''}}))).team;
 const tr={name,art:n.art,intro:t0.split(': ').slice(1).join(': ')||'Let\'s battle!',lose:'Wow, you two are in sync. Good luck out there!',after:'Keep exploring, Linker. Every region has new Alienmon.',team,bkey:n.id};
 qEvent('talk',n.id,{x:n.x*16+8,y:n.y*16+15});if(G.beaten[n.id])return say(name+': '+tr.after,null,n.art);if(!G.party.some(m=>m.hp>0))return say('Your team needs to heal first.');say(t0,()=>startBattle(team.map(([id,lv])=>mk(id,lv)),tr),n.art)}
// line of sight: step into a trainer's view (up to 5 clear tiles straight ahead of them) and they call you out
let SSPOT=null;
function secLos(){const s=SWORLD[G.sec.id];for(const n of secNpcs(s)){if(!n.trainer||G.beaten[n.id])continue;const[dx,dy]=DIRS[n.face||'down'];
  for(let k=1;k<=5;k++){const x=n.x+dx*k,y=n.y+dy*k;if(x===G.sec.x&&y===G.sec.y){SSPOT={n,t:36,walk:0,steps:k-1};exclaimSfx();face=({up:'down',down:'up',left:'right',right:'left'})[n.face||'down'];return true}if(!secWalk(s,x,y))break}}return false}
function secArrive(){const s=SWORLD[G.sec.id],w=s.warps.find(w=>w.tile[0]===G.sec.x&&w.tile[1]===G.sec.y);if(w&&w.kind==='gate')return secGate(w);if(w&&SWORLD[w.to])return secWarp(w);
 if(G.grace>0)G.grace--;if(G.jam>0&&stepc%8===0)G.jam--;stepc++;
 if(secLos())return;
 if(secTile(s,G.sec.x,G.sec.y)===','&&!(G.grace>0)&&R()<0.1)wild()}
// Frontier gates: the story gate decides; through it you arrive at that planet's landing edge (its own sections,
// or its classic painted town until that planet's sections are built). Walking back out returns you to the gate.
function secGate(w){if(w.options){const back=()=>{G.sec.x=w.at[0];G.sec.y=w.at[1];face=w.face};
  return choose('Shuttle Pad',w.options.map(o=>o.label).concat(['Cancel']),i=>{const o=w.options[i];if(!o)return back();if(!gateOpen(o.node)){back();return say(gateMsg(o.node))}secGate(Object.assign({},w,{options:null,node:o.node,to:'planet:'+o.planet}))},()=>back())}
 const k=w.to.slice(7);if(w.node&&!gateOpen(w.node)){G.sec.x=w.at[0];G.sec.y=w.at[1];face=w.face;return say(gateMsg(w.node))}
 if(w.sub&&PAINT[w.sub]){SFADE={t:0,go:()=>{G.secBack={id:G.sec.id,at:w.at,planet:G.planet};G.planet=pidx(k);G.sub=w.sub;G.sec=null;G.ppos=PAINT[w.sub].start.slice();face='up';banner=90;doorSfx()}};return}
 SFADE={t:0,go:()=>{G.secBack={id:G.sec.id,at:w.at,planet:G.planet};G.planet=pidx(k);G.sub=null;const a=secArrival(k);
  if(a)enterSection(a[0],a[1],'right');else{G.sec=null;const P=PAINT[k];if(P){G.ppos=[P.start[0],P.exitY-30];face='up'}banner=90}doorSfx()}}}
function secBackThroughGate(){const b=G.secBack;if(!b||!SWORLD[b.id])return false;const go=()=>{G.planet=b.planet;G.sub=null;enterSection(b.id,b.at,b.at[1]>=SWORLD[b.id].tiles[1]/2?'down':'down');G.secBack=null;scene='planet'};if(secOn())SFADE={t:0,go};else cut(1,'Back to the Molten Frontier',go);return true}
function secLeaveForShip(){if(G.secBack&&SWORLD[G.secBack.id])return say('The gate back to the Molten Frontier.',()=>choose('Go back through the gate?',['Yes','No'],i=>{if(i===0)secBackThroughGate()}));if(!shipOK())return say(['The landing pad. Your ship sits waiting, but it has no launch clearance yet.',SHIP_NO]);say('This path leads back to the landing pad.',()=>choose('Board your ship?',['Yes','No'],i=>{if(i===0){G.sec=null;teleportToShip()}}))}
function secInteract(){const s=SWORLD[G.sec.id],[dx,dy]=DIRS[face],x=G.sec.x+dx,y=G.sec.y+dy;
 const qe=secQAt(x,y,false);if(qe&&(!secNpcAt(s,x,y)||qe.k==='giver'||qe.k==='turnin'))return qInteract(qe);   // a townsperson who offers or takes back a mission
 const wm=secMonAt(s,x,y);if(wm)return secMonBattle(s,wm);
 const n=secNpcAt(s,x,y);if(n){n.face=({up:'down',down:'up',left:'right',right:'left'})[face];if(n.legend)return legendBattle({mon:n.legend,lvl:n.lv||60});if(n.trainer)return secTrainerTalk(n);if(n.wid)qEvent('talk',n.wid,{x:n.x*16+8,y:n.y*16+15});if(n.story==='starter'&&!G.party.length)return secStarterTalk();return say(!G.party.length&&n.pre?n.pre:n.t,null,n.por||undefined)}
 const o=(s.objects||[]).find(o=>o.tile[0]===x&&o.tile[1]===y);if(!o)return;
 if(o.k==='keeper')return keeperTalk(PL[G.planet]);
 if(o.k==='stash'){G.opened=G.opened||{};const tag=s.id+':'+o.tile;if(G.opened[tag])return;G.opened[tag]=1;const n=o.n||1;
  if(o.item==='dust'){G.dust+=n;return say(['You found a Linker Stash!','Inside: '+n+' Stardust.'])}
  const pod=G.pods&&o.item in G.pods;if(pod)G.pods[o.item]+=n;else G.items[o.item]=(G.items[o.item]||0)+n;const name=(ITEMS.concat(PODS).find(i=>i.k===o.item)||{n:o.item}).n;
  stashSfx();return say(['You found a Linker Stash!','Inside: '+(n>1?n+'x ':'a ')+name+'.'])}
 if(o.k==='chest'){G.opened=G.opened||{};const tag=s.id+':'+o.tile;if(G.opened[tag])return say('The chest is empty.');G.opened[tag]=1;const pod=G.pods&&o.item in G.pods,n=o.n||1;if(pod)G.pods[o.item]+=n;else G.items[o.item]=(G.items[o.item]||0)+n;
  const name=(ITEMS.concat(PODS).find(i=>i.k===o.item)||{n:o.item}).n;return say('You opened the chest... and found '+(n>1?n+'x ':'a ')+name+'!')}if(o.k==='bay'){G.singBuy=0;return bayMenu()}if(o.k==='shop')return shop();
 if(o.k==='lab'&&!G.party.length)return secStarterTalk();if(o.k==='lab')return say(G.party.length?'Three empty pod cradles. Your partner\'s pod used to sit in the middle one.':'Three seed pods hum on the lab table.');
 if(o.t)return say(o.t)}
function updSec(){const s=SWORLD[G.sec.id];if(SBUMP>0)SBUMP--;
 if(SSPOT){if(SSPOT.t>0){SSPOT.t--;if(SSPOT.t===0)SSPOT.walk=0}else{const n=SSPOT.n,[dx,dy]=DIRS[n.face||'down'];
   if(Math.abs(n.x+dx-G.sec.x)+Math.abs(n.y+dy-G.sec.y)===0||SSPOT.steps<=0){SSPOT=null;n.ox=n.oy=0;secTrainerTalk(n)}
   else{SSPOT.walk++;n.ox=dx*16*SSPOT.walk/SEC_STEP;n.oy=dy*16*SSPOT.walk/SEC_STEP;if(SSPOT.walk>=SEC_STEP){n.x+=dx;n.y+=dy;n.ox=n.oy=0;SSPOT.walk=0;SSPOT.steps--}}}drawSec();return}
 if(SFADE){SFADE.t++;if(SFADE.t===10){SFADE.go();if(!secOn()){SFADE=null;return}}if(SFADE.t>=20)SFADE=null;drawSec();return}   // a fade can hand over to a painted map (the Forge Fortress)
 if(SM){if(pressed.b)SJBUF=12;SM.t++;if(SM.t>=SEC_STEP){const a=SM.to;SM=null;if(a.s.id!==G.sec.id)enterSection(a.s.id,[a.x,a.y],null);else{G.sec.x=a.x;G.sec.y=a.y}secArrive()}
  if(!SM&&!SFADE&&!DLG&&!CH&&!SJ){if(SJBUF>0){SJBUF=0;secJump()}else secStepHeld()}drawSec();return}
 if(SJ){SJ.t++;if(SJ.t>=SEC_JUMP_T){G.sec.x=SJ.to[0];G.sec.y=SJ.to[1];SJ=null;secArrive()}drawSec();return}
 if(P_('start')){scene='menu';menuSel=0;return}
 if(SJBUF>0)SJBUF--;
 if(P_('b')){SJBUF=0;secJump();drawSec();return}
 if(pressed.g){pressed.g=false;SDEBUG=!SDEBUG;toast('Grid overlay '+(SDEBUG?'on':'off'))}
 if(P_('a')){secInteract();drawSec();return}
 secStepHeld();drawSec()}
function secStepHeld(){const d=held.up?'up':held.down?'down':held.left?'left':held.right?'right':null;if(!d)return;face=d;const s=SWORLD[G.sec.id],a=secAhead(s,G.sec.x,G.sec.y,d);
 if(a&&(a.arrival||a.s.id!==s.id)&&!G.party.length&&s.type!=='interior')return say(NO_PARTNER);
 if(a&&a.arrival)return secLeaveForShip();
 if(!a||!secWalk(a.s,a.x,a.y)){bumpSfx();return}
 const lw=a.s.warps.find(w=>w.tile[0]===a.x&&w.tile[1]===a.y&&w.node);if(lw&&!gateOpen(lw.node)){bumpSfx();return say(gateMsg(lw.node))}
 SM={t:0,dx:DIRS[d][0],dy:DIRS[d][1],to:a}}
// camera: follows the player; it only stops at an edge with nothing beyond it
function secCam(s,px,py){const W=s.tiles[0]*16,H=s.tiles[1]*16,e=s.edges,open=k=>e[k]&&SWORLD[e[k].to];
 let cx=px+8-80,cy=py+8-76;if(!open('left'))cx=Math.max(0,cx);if(!open('right'))cx=Math.min(W-160,cx);if(!open('top'))cy=Math.max(0,cy);if(!open('bottom'))cy=Math.min(H-144,cy);
 if(W<160)cx=(W-160)/2;if(H<144)cy=(H-144)/2;return[Math.round(cx),Math.round(cy)]}
function secDrawImg(id,ox,oy){const im=SECI[id];if(okI(im))ctx.drawImage(im,ox,oy);else{const s=SWORLD[id];rect(ox,oy,s.tiles[0]*16,s.tiles[1]*16,'#1d1433')}}
function drawSec(){const s=SWORLD[G.sec.id],p=SM?SM.t/SEC_STEP:0,jp=SJ?SJ.t/SEC_JUMP_T:0,px=SJ?(SJ.from[0]+(SJ.to[0]-SJ.from[0])*jp)*16:G.sec.x*16+(SM?SM.dx*16*p:0),py=SJ?(SJ.from[1]+(SJ.to[1]-SJ.from[1])*jp)*16:G.sec.y*16+(SM?SM.dy*16*p:0),[cx,cy]=secCam(s,px,py),hop=SJ?Math.round(Math.sin(Math.PI*jp)*10):0;
 rect(0,0,160,144,s.type==='interior'||s.type==='cave'?'#000':'#1d1433');ctx.save();ctx.imageSmoothingEnabled=false;
 secDrawImg(s.id,-cx,-cy);
 for(const[k,e]of Object.entries(s.edges)){const t=SWORLD[e.to];if(!t)continue;const o=(e.offset||0)*16;
  if(k==='right')secDrawImg(t.id,s.tiles[0]*16-cx,-o-cy);else if(k==='left')secDrawImg(t.id,-t.tiles[0]*16-cx,-o-cy);else if(k==='bottom')secDrawImg(t.id,-o-cx,s.tiles[1]*16-cy);else secDrawImg(t.id,-o-cx,-t.tiles[1]*16-cy)}
 ctx.restore();
 const people=secNpcs(s).map(n=>({y:n.y*16+(n.oy||0),draw:()=>n.legend?secDrawLegend(n.legend,n.x*16-cx,n.y*16-cy):secDrawChar(n.art,n.face||'down',n.x*16+(n.ox||0)-cx,n.y*16+(n.oy||0)-cy,(n.ox||n.oy)&&((frame>>3)&1)?1:0)}));
 const kp=PL[G.planet]&&PL[G.planet].keeper;for(const o of s.objects||[])if(o.k==='keeper'&&kp)people.push({y:o.tile[1]*16,draw:()=>secDrawChar(kp.art,'down',o.tile[0]*16-cx,o.tile[1]*16-cy,0)});
 people.push({y:py,me:1,draw:()=>{const k=(G.gender||'boy');if(hop){ctx.fillStyle='rgba(20,10,20,0.3)';ctx.beginPath();ctx.ellipse(px-cx+8,py-cy+15,5,2,0,0,6.283);ctx.fill()}secDrawChar(k,face,px-cx,py-cy-hop,SM&&p>0.25&&p<0.75?1:0,true)}});
 people.sort((a,b)=>a.y-b.y).forEach(o=>o.draw());
 for(const m of s.mons||[]){if(G.monGone&&G.monGone[s.id+':'+m.x+','+m.y])continue;const im=OWI[shownMon(m.mon,0)];if(!okI(im))continue;const X=m.x*16-cx,Y=m.y*16-cy;if(X<-24||Y<-24||X>176||Y>160)continue;
  ctx.fillStyle='rgba(20,10,20,0.35)';ctx.beginPath();ctx.ellipse(X+8,Y+15,6,2,0,0,6.283);ctx.fill();ctx.save();ctx.imageSmoothingEnabled=true;ctx.drawImage(im,((frame>>4)&1)*64,0,64,64,X-2,Y-5,20,20);ctx.restore()}
 for(const o of s.objects||[])if(o.k==='stash'&&!(G.opened&&G.opened[s.id+':'+o.tile]))secDrawStash(o.tile[0]*16-cx,o.tile[1]*16-cy);
 qDraw(cx,cy,1,24);
 if(secTile(s,G.sec.x,G.sec.y)===','){ctx.fillStyle='#3f9d3a';for(let i=0;i<4;i++)ctx.fillRect(Math.round(px-cx+2+i*3),Math.round(py-cy+11-(i%2)),2,5)}
 if(SSPOT&&SSPOT.t>0){const X=SSPOT.n.x*16-cx+3,Y=SSPOT.n.y*16-cy-20;box(X,Y,10,11,'#fff','#1b1424');txt('!',X+3,Y+2,'#d7262e',7)}
 if(SDEBUG)drawSecDebug(s,cx,cy);
 nightTint();qDrawTracker(SBANNER>0?18:0);
 if(SBANNER>0){SBANNER--;box(0,0,160,18,'#1b1424','#5ff2ff');txt(s.name.replace(/^Molten Frontier: /,''),6,5,'#5ff2ff')}
 if(SFADE){const a=SFADE.t<10?SFADE.t/10:(20-SFADE.t)/10;ctx.fillStyle='rgba(0,0,0,'+a.toFixed(2)+')';ctx.fillRect(0,0,160,144)}
 txt('◆'+G.shards,128,134,'#fff')}
// 16x24 figure standing on its tile (feet on the tile's bottom edge)
function secDrawChar(art,f,x,y,step,me){ctx.fillStyle='rgba(20,10,20,0.35)';ctx.beginPath();ctx.ellipse(x+8,y+15,6,2,0,0,6.283);ctx.fill();
 const k=art+'_'+f,b=step?1:0;if(!dchar(k,Math.round(x-4),Math.round(y-9-b),24,24)&&!dchar(art,Math.round(x-4),Math.round(y-9-b),24,24))kid(Math.round(x+2),Math.round(y-2),f==='left',f==='up',step)}
function drawSecDebug(s,cx,cy){ctx.save();for(let y=0;y<s.tiles[1];y++)for(let x=0;x<s.tiles[0];x++){const c=s.rows[y][x],X=x*16-cx,Y=y*16-cy;if(X<-16||Y<-16||X>160||Y>144)continue;
  if(c==='#'){ctx.fillStyle='rgba(255,0,0,0.33)';ctx.fillRect(X,Y,16,16)}else if(c===','){ctx.fillStyle='rgba(0,255,0,0.25)';ctx.fillRect(X,Y,16,16)}
  ctx.strokeStyle='rgba(255,0,255,0.35)';ctx.lineWidth=0.5;ctx.strokeRect(X+0.25,Y+0.25,15.5,15.5)}
 for(const w of s.warps){ctx.strokeStyle='#5ff2ff';ctx.lineWidth=1;ctx.strokeRect(w.tile[0]*16-cx+1,w.tile[1]*16-cy+1,14,14)}
 for(const o of s.objects||[]){ctx.strokeStyle='#ffd23f';ctx.strokeRect(o.tile[0]*16-cx+2,o.tile[1]*16-cy+2,12,12)}
 ctx.restore();txt(s.id+' '+G.sec.x+','+G.sec.y,2,126,'#fff',6)}
// starting points: a fresh game wakes up upstairs at home; landing on Dustara puts you at the plaza's landing-pad edge
function secArrival(planetKey){const a=(__SECARRIVAL__)[planetKey];if(!a||!SWORLD[a.section])return null;return[a.section,SWORLD[a.section].spawns.arrival||SWORLD[a.section].spawns.default]}
// section maps: on for playtest builds with ?sections in the address or the Options toggle, and for any save already inside one
const SEC_URL=/[?&]sections/.test(location.search);
// the section maps are the game's maps now (the site is tester-only); Options > New maps can switch back to the classic maps
function secEnabled(){if(!G)return false;if(G.sec)return true;return!(G.opt&&G.opt.secMaps===false)}
// apprentices in a planet's tower sections must be beaten before its Keeper battles (classic towns keep their own list)
function secApprentices(k){let n=0,any=false;for(const s of Object.values(SWORLD))if(s.pkey===k)for(const p of s.npcs||[])if(p.trainer&&p.trainer.app){any=true;if(!G.beaten[p.id])n++}return any?n:null}
// the opening: wake up at home, Mom sends you to Dr. Vashti's lab, and your partner is chosen at her pod table
const NO_PARTNER=["Wait! It's dangerous out there without an Alienmon.","Dr. Vashti is waiting at her lab: the big dome with the telescope, across the plaza."];
function secWakeUp(){scene='planet';enterSection('002',SWORLD['002'].spawns.wake||SWORLD['002'].spawns.default,'down');
 say(['...','You wake up. Sunlight is pouring over the crater rim.','Today is the day: Dr. Vashti promised you your very first Alienmon partner!'])}
function secStarterTalk(){say(["Dr. Vashti: There you are! Come, come.","Twenty years ago, the sky fell.","Seedpods scattered across the whole Kessler system, onto every world.","What hatched were Alienmon: refugees from a dying planet called Ystra.","Your Linker can bond with them. Three pods hatched this week, and one of them is yours.","Choose your first partner."],()=>{scene='starter';ssel=0},'vashti')}
function secStarterChosen(id){say([D[id].name+' joined you!',"Dr. Vashti: Wonderful. You two already look like you belong together.","Your friend Sola was here at dawn and took one of the others. She's already out training.","Heal for free at the Recovery Bay, stock up at the shop, and when you're ready, head east over the bridge.","The drift grass beyond town hides wild Alienmon. And every world's Keeper guards a Signal Shard. Go see them all!"],null,'vashti')}
// a visible wild Alienmon: walk up and battle it (the same rules as the classic towns' roaming Alienmon);
// beaten or caught ones are gone until you leave the planet
function secMonBattle(s,wm){if(!G.party.some(m=>m.hp>0))return say('Your team needs to heal first.');const p=PL[G.planet],zk=s.zone||p.key;
 let wp=wildPick(zk,wm.mon);if(wp){const sm=IDX[shownMon(wm.mon,0)],pv=PREVO[D[sm].name];wp=[sm,Math.max(wp[1],pv?pv.level-1:0)]}
 const id=wp?wp[0]:IDX[shownMon(wm.mon,0)];if(id==null)return;QWILD='hotspot_mon_'+({dustara:'dustmere'}[p.key]||p.key);
 G.monGone=G.monGone||{};const tag=s.id+':'+wm.x+','+wm.y;
 say('The wild '+D[id].name+' wants to battle!',()=>{G.monGone[tag]=G.planet;startBattle([mk(...(wp?[id,wp[1]]:clampWild(id,ri(p.lv[0],p.lv[1]),0)))],null)})}
// quest spots on the section maps: tile positions in 16 px space (feet on the tile's bottom edge)
function secQLoc(key,loc){const sp=SECQ[key];if(!sp)return null;return Object.assign({},loc,{sec:sp.s,x:sp.x*16+8,y:sp.y*16+15,pts:sp.pts,art:sp.art||loc&&loc.art})}
// the old Molten Frontier world map's places, now sections: 'visit the Frontier' / 'visit node X' objectives
const SEC_FRONTIER=new Set(['014','015','016','017','018','019','020','021','022','023','024','025','026','027','028']);
const SEC_NODE={dustara:'014',bay:'017',thalassa:'018',glyphos:'019',ferrox:'022',helix:'023',space:'026',starfall:'026',umbra:'027',pyros:'028'};
// a legendary waiting on the map: its overworld sprite, larger than a person, gently bobbing
function secDrawLegend(name,x,y){const im=OWI[name];if(!okI(im))return;ctx.fillStyle='rgba(20,10,20,0.35)';ctx.beginPath();ctx.ellipse(x+8,y+15,9,3,0,0,6.283);ctx.fill();ctx.save();ctx.imageSmoothingEnabled=true;ctx.drawImage(im,((frame>>4)&1)*64,0,64,64,x-8,y-17+Math.round(Math.sin(frame/12)),32,32);ctx.restore()}

/* ---------- tester code: on the public site, testers unlock the new maps with a code (stored only as a hash) ---------- */
const TESTER_HASH='72717560a790f72925a42847538ff598f43d2c5e25971c9ac59a1335ba8c9d8d';
function testerOn(){try{return localStorage.getItem('alienmon_tester')===TESTER_HASH}catch(e){return false}}
async function testerHash(t){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t.trim().toLowerCase()));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')}
function testerUI(){if(BETA||!window.crypto||!crypto.subtle)return;const hint=document.querySelector('.hint');if(!hint)return;
 const btn=document.createElement('button');btn.type='button';btn.style.cssText='display:block;margin:10px auto 0;background:var(--dpad);color:var(--muted);border:0;border-radius:10px;padding:7px 14px;font:inherit;font-size:8px;cursor:pointer';
 const label=()=>{btn.textContent=testerOn()?'TESTER MODE: ON':'TESTER CODE'};label();hint.after(btn);
 btn.addEventListener('click',()=>{const wrap=document.createElement('div');wrap.style.cssText='position:fixed;inset:0;background:#0b0716cc;display:flex;align-items:center;justify-content:center;z-index:50;padding:16px';
  const box=document.createElement('div');box.style.cssText='width:min(320px,100%);background:#1d1433;border:3px solid #5ff2ff;border-radius:12px;padding:18px;color:#e8e0ff;font:inherit;font-size:10px;line-height:1.7;text-align:center;box-shadow:0 10px 40px #000a';
  const on=testerOn();box.innerHTML='<div style="color:#5ff2ff;font-size:12px;margin-bottom:10px">'+(on?'Tester mode is on':'Tester code')+'</div>'+
   (on?'<p style="margin:0 0 14px">New games use the new maps. You can also switch them in START &gt; Options.</p>':'<p style="margin:0 0 10px">Enter your tester code to play the new maps.</p><input id="tcode" autocomplete="off" autocapitalize="off" spellcheck="false" style="width:100%;box-sizing:border-box;font:inherit;font-size:12px;padding:8px;border-radius:6px;border:2px solid #3b2a5c;background:#120c22;color:#fff;text-align:center"><div id="tmsg" style="min-height:18px;margin-top:8px;color:#ff8a1e"></div>')+
   '<div style="display:flex;gap:10px;justify-content:center;margin-top:6px">'+(on?'<button id="toff" type="button">Turn off</button>':'<button id="tok" type="button">Unlock</button>')+'<button id="tcancel" type="button">Close</button></div>';
  for(const b of box.querySelectorAll('button'))b.style.cssText='font:inherit;font-size:9px;border:0;border-radius:8px;padding:8px 14px;cursor:pointer;background:'+(b.id==='tcancel'?'#3b2a5c;color:#e8e0ff':'#ffd23f;color:#1b1424');
  wrap.appendChild(box);document.body.appendChild(wrap);const close=()=>{wrap.remove();label()};
  box.querySelector('#tcancel').onclick=close;wrap.addEventListener('click',e=>{if(e.target===wrap)close()});
  if(on){box.querySelector('#toff').onclick=()=>{try{localStorage.removeItem('alienmon_tester')}catch(e){}close()};return}
  const inp=box.querySelector('#tcode'),msg=box.querySelector('#tmsg');inp.focus();
  const go=async()=>{const h=await testerHash(inp.value);if(h===TESTER_HASH){try{localStorage.setItem('alienmon_tester',h)}catch(e){}
    box.innerHTML='<div style="color:#5ff2ff;font-size:12px;margin-bottom:10px">Welcome, tester!</div><p style="margin:0 0 14px">The new maps are unlocked. Start a New game, or land on any planet in your current game.</p><button type="button" style="font:inherit;font-size:9px;border:0;border-radius:8px;padding:8px 14px;background:#ffd23f;color:#1b1424;cursor:pointer">Let\'s go</button>';box.querySelector('button').onclick=close}
   else{msg.textContent='That code is not right.';inp.select()}};
  box.querySelector('#tok').onclick=go;
  // typing in the box must not move the player (the game listens to keys on the whole page)
  inp.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter')go();if(e.key==='Escape')close()});inp.addEventListener('keyup',e=>e.stopPropagation())})}
// the tester code now lives on the server (middleware.js login screen), so no in-page button

/* ---------- jumping (B): hop two tiles over a ledge, railing, rock or gap, Gold/Crystal style ----------
 You only land on open ground that is part of the section's main walkable area, so a jump never reaches
 places the map seals off on purpose (behind a closed gate) and never skips a story gate or warp lock. */
const SEC_JUMP_T=14;
function secMain(s){if(s._main)return s._main;const W=s.tiles[0],H=s.tiles[1],ok=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&'.,'.includes(s.rows[y][x]),seen=new Set(),q=[];
 const seed=[s.spawns&&s.spawns.default].concat(s.warps.map(w=>w.tile)).concat(Object.entries(s.edges).map(([k,e])=>k==='left'?[0,e.range[0]]:k==='right'?[W-1,e.range[0]]:k==='top'?[e.range[0],0]:[e.range[0],H-1]));
 for(const t of seed)if(t&&ok(t[0],t[1])&&!seen.has(t[0]+','+t[1])){seen.add(t[0]+','+t[1]);q.push(t)}
 while(q.length){const[x,y]=q.pop();for(const[dx,dy]of Object.values(DIRS)){const k=(x+dx)+','+(y+dy);if(!seen.has(k)&&ok(x+dx,y+dy)){seen.add(k);q.push([x+dx,y+dy])}}}return s._main=seen}
function secJump(){const s=SWORLD[G.sec.id],[dx,dy]=DIRS[face];
 const ok=(x,y)=>secTile(s,x,y)!==null&&secWalk(s,x,y)&&secMain(s).has(x+','+y)&&!s.warps.some(w=>w.node&&w.tile[0]===x&&w.tile[1]===y&&!gateOpen(w.node));
 // two tiles is a normal hop; three clears a wider gap; nothing to land on is a bump
 const n=[2,3].find(k=>ok(G.sec.x+dx*k,G.sec.y+dy*k)&&!(k===3&&ok(G.sec.x+dx,G.sec.y+dy)&&ok(G.sec.x+dx*2,G.sec.y+dy*2)));
 if(!n){bumpSfx();return}
 SJ={t:0,from:[G.sec.x,G.sec.y],to:[G.sec.x+dx*n,G.sec.y+dy*n]};jumpSfx()}

// a Linker Stash on the ground: a little gold-and-violet capsule with a cyan light (drawn, so every world gets the same look)
function secDrawStash(x,y){if(x<-16||y<-16||x>160||y>144)return;const b=Math.round(Math.sin(frame/14)),g=frame%60<30;
 ctx.fillStyle='rgba(20,10,20,0.35)';ctx.beginPath();ctx.ellipse(x+8,y+14,5,2,0,0,6.283);ctx.fill();
 ctx.fillStyle='#3b2a5c';ctx.fillRect(x+3,y+5+b,10,8);ctx.fillStyle='#7a3fbf';ctx.fillRect(x+4,y+6+b,8,6);
 ctx.fillStyle='#ffd23f';ctx.fillRect(x+3,y+8+b,10,2);ctx.fillRect(x+7,y+4+b,2,2);
 ctx.fillStyle=g?'#5ff2ff':'#b8fbff';ctx.fillRect(x+7,y+8+b,2,2)}
function stashSfx(){try{if(!AC||musicMode==='off')return;const t=AC.currentTime;[523,659,784,1047].forEach((f,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.value=f;g.gain.setValueAtTime(0.03,t+i*0.07);g.gain.exponentialRampToValueAtTime(0.001,t+i*0.07+0.12);o.connect(g).connect(AC.destination);o.start(t+i*0.07);o.stop(t+i*0.07+0.13)})}catch(e){}}
function exclaimSfx(){try{if(!AC||musicMode==='off')return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.setValueAtTime(880,t);o.frequency.setValueAtTime(1175,t+0.06);g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.16);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+0.17)}catch(e){}}
