/* ---------- section maps: Gold/Crystal-style connected screens (data/world.json, 16 px tiles) ----------
 Each section is one pre-rendered image at 16 px per tile, drawn 1:1 into the 160x144 view with nearest-neighbour
 scaling only. Outdoor neighbours sit edge to edge, so walking off an edge carries straight on into the next
 section (it is drawn beside this one while you approach). Interiors, caves and tower floors are reached by warps:
 doors, doormats, stairs and cave mouths. Collision is one char per tile: '.' walk, '#' blocked, ',' tall grass.
 G.sec = {id,x,y} is the player's tile; the old painted town maps stay in use wherever no section is active. */
const SWORLD=__SWORLD__,SECI=lazyImgs(__SECIMG__);
const SEC_STEP=8;               // frames per tile (2 px a frame, Gold/Crystal walking pace)
let SM=null,SFADE=null,SBANNER=0,SDEBUG=false,SBUMP=0,SNEAR=null;
const secOn=()=>!!(G&&G.sec&&SWORLD[G.sec.id]);
const secTile=(s,x,y)=>x<0||y<0||x>=s.tiles[0]||y>=s.tiles[1]?null:s.rows[y][x];
const DIRS={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
function secNpcAt(s,x,y){return(s.npcs||[]).find(n=>n.x===x&&n.y===y)}
function secWalk(s,x,y){const c=secTile(s,x,y);return(c==='.'||c===',')&&!secNpcAt(s,x,y)}
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
// line of sight: step into a trainer's view (up to 5 clear tiles straight ahead of them) and they call you out
let SSPOT=null;
function secLos(){const s=SWORLD[G.sec.id];for(const n of s.npcs||[]){if(!n.trainer||G.beaten[n.id])continue;const[dx,dy]=DIRS[n.face||'down'];
  for(let k=1;k<=5;k++){const x=n.x+dx*k,y=n.y+dy*k;if(x===G.sec.x&&y===G.sec.y){SSPOT={n,t:36};face=({up:'down',down:'up',left:'right',right:'left'})[n.face||'down'];return true}if(!secWalk(s,x,y))break}}return false}
function secArrive(){const s=SWORLD[G.sec.id],w=s.warps.find(w=>w.tile[0]===G.sec.x&&w.tile[1]===G.sec.y);if(w&&w.kind==='gate')return secGate(w);if(w&&SWORLD[w.to])return secWarp(w);
 if(G.grace>0)G.grace--;if(G.jam>0&&stepc%8===0)G.jam--;stepc++;
 if(secLos())return;
 if(secTile(s,G.sec.x,G.sec.y)===','&&!(G.grace>0)&&R()<0.1)wild()}
// Frontier gates: the story gate decides; through it you arrive at that planet's landing edge (its own sections,
// or its classic painted town until that planet's sections are built). Walking back out returns you to the gate.
function secGate(w){const k=w.to.slice(7);if(!gateOpen(w.node)){G.sec.y=w.at[1];face='down';return say(gateMsg(w.node))}
 SFADE={t:0,go:()=>{G.secBack={id:G.sec.id,at:w.at,planet:G.planet};G.planet=pidx(k);G.sub=null;const a=secArrival(k);
  if(a)enterSection(a[0],a[1],'right');else{G.sec=null;const P=PAINT[k];if(P){G.ppos=[P.start[0],P.exitY-30];face='up'}banner=90}doorSfx()}}}
function secBackThroughGate(){const b=G.secBack;if(!b||!SWORLD[b.id])return false;SFADE={t:0,go:()=>{G.planet=b.planet;G.sub=null;enterSection(b.id,b.at,'down');G.secBack=null}};return true}
function secLeaveForShip(){if(G.secBack&&SWORLD[G.secBack.id])return say('The gate back to the Molten Frontier.',()=>choose('Go back through the gate?',['Yes','No'],i=>{if(i===0)secBackThroughGate()}));if(!shipOK())return say(['The landing pad. Your ship sits waiting, but it has no launch clearance yet.',SHIP_NO]);say('This path leads back to the landing pad.',()=>choose('Board your ship?',['Yes','No'],i=>{if(i===0){G.sec=null;teleportToShip()}}))}
function secInteract(){const s=SWORLD[G.sec.id],[dx,dy]=DIRS[face],x=G.sec.x+dx,y=G.sec.y+dy;
 const n=secNpcAt(s,x,y);if(n){n.face=({up:'down',down:'up',left:'right',right:'left'})[face];if(n.trainer)return trainerTalk(secTrainerH(n));if(n.story==='starter'&&!G.party.length)return secStarterTalk();return say(!G.party.length&&n.pre?n.pre:n.t,null,n.por||undefined)}
 const o=(s.objects||[]).find(o=>o.tile[0]===x&&o.tile[1]===y);if(!o)return;
 if(o.k==='keeper')return keeperTalk(PL[G.planet]);if(o.k==='bay'){G.singBuy=0;return bayMenu()}if(o.k==='shop')return shop();
 if(o.k==='lab'&&!G.party.length)return secStarterTalk();if(o.k==='lab')return say(G.party.length?'Three empty pod cradles. Your partner\'s pod used to sit in the middle one.':'Three seed pods hum on the lab table.');
 if(o.t)return say(o.t)}
function updSec(){const s=SWORLD[G.sec.id];if(SBUMP>0)SBUMP--;
 if(SSPOT){if(--SSPOT.t<=0){const n=SSPOT.n;SSPOT=null;trainerTalk(secTrainerH(n))}drawSec();return}
 if(SFADE){SFADE.t++;if(SFADE.t===10){SFADE.go()}if(SFADE.t>=20)SFADE=null;drawSec();return}
 if(SM){SM.t++;if(SM.t>=SEC_STEP){const a=SM.to;SM=null;if(a.s.id!==G.sec.id)enterSection(a.s.id,[a.x,a.y],null);else{G.sec.x=a.x;G.sec.y=a.y}secArrive()}
  if(!SM&&!SFADE&&!DLG&&!CH)secStepHeld();drawSec();return}
 if(P_('start')){scene='menu';menuSel=0;return}
 if(pressed.g){pressed.g=false;SDEBUG=!SDEBUG;toast('Grid overlay '+(SDEBUG?'on':'off'))}
 if(P_('a')){secInteract();drawSec();return}
 secStepHeld();drawSec()}
function secStepHeld(){const d=held.up?'up':held.down?'down':held.left?'left':held.right?'right':null;if(!d)return;face=d;const s=SWORLD[G.sec.id],a=secAhead(s,G.sec.x,G.sec.y,d);
 if(a&&(a.arrival||a.s.id!==s.id)&&!G.party.length&&s.type!=='interior')return say(NO_PARTNER);
 if(a&&a.arrival)return secLeaveForShip();
 if(!a||!secWalk(a.s,a.x,a.y)){bumpSfx();return}
 SM={t:0,dx:DIRS[d][0],dy:DIRS[d][1],to:a}}
// camera: follows the player; it only stops at an edge with nothing beyond it
function secCam(s,px,py){const W=s.tiles[0]*16,H=s.tiles[1]*16,e=s.edges,open=k=>e[k]&&SWORLD[e[k].to];
 let cx=px+8-80,cy=py+8-76;if(!open('left'))cx=Math.max(0,cx);if(!open('right'))cx=Math.min(W-160,cx);if(!open('top'))cy=Math.max(0,cy);if(!open('bottom'))cy=Math.min(H-144,cy);
 if(W<160)cx=(W-160)/2;if(H<144)cy=(H-144)/2;return[Math.round(cx),Math.round(cy)]}
function secDrawImg(id,ox,oy){const im=SECI[id];if(okI(im))ctx.drawImage(im,ox,oy);else{const s=SWORLD[id];rect(ox,oy,s.tiles[0]*16,s.tiles[1]*16,'#1d1433')}}
function drawSec(){const s=SWORLD[G.sec.id],p=SM?SM.t/SEC_STEP:0,px=G.sec.x*16+(SM?SM.dx*16*p:0),py=G.sec.y*16+(SM?SM.dy*16*p:0),[cx,cy]=secCam(s,px,py);
 rect(0,0,160,144,s.type==='interior'||s.type==='cave'?'#000':'#1d1433');ctx.save();ctx.imageSmoothingEnabled=false;
 secDrawImg(s.id,-cx,-cy);
 for(const[k,e]of Object.entries(s.edges)){const t=SWORLD[e.to];if(!t)continue;const o=(e.offset||0)*16;
  if(k==='right')secDrawImg(t.id,s.tiles[0]*16-cx,-o-cy);else if(k==='left')secDrawImg(t.id,-t.tiles[0]*16-cx,-o-cy);else if(k==='bottom')secDrawImg(t.id,-o-cx,s.tiles[1]*16-cy);else secDrawImg(t.id,-o-cx,-t.tiles[1]*16-cy)}
 ctx.restore();
 const people=(s.npcs||[]).map(n=>({y:n.y*16,draw:()=>secDrawChar(n.art,n.face||'down',n.x*16-cx,n.y*16-cy,0)}));
 const kp=PL[G.planet]&&PL[G.planet].keeper;for(const o of s.objects||[])if(o.k==='keeper'&&kp)people.push({y:o.tile[1]*16,draw:()=>secDrawChar(kp.art,'down',o.tile[0]*16-cx,o.tile[1]*16-cy,0)});
 people.push({y:py,me:1,draw:()=>{const k=(G.gender||'boy');secDrawChar(k,face,px-cx,py-cy,SM&&p>0.25&&p<0.75?1:0,true)}});
 people.sort((a,b)=>a.y-b.y).forEach(o=>o.draw());
 if(secTile(s,G.sec.x,G.sec.y)===','){ctx.fillStyle='#3f9d3a';for(let i=0;i<4;i++)ctx.fillRect(Math.round(px-cx+2+i*3),Math.round(py-cy+11-(i%2)),2,5)}
 if(SSPOT){const X=SSPOT.n.x*16-cx+3,Y=SSPOT.n.y*16-cy-20;box(X,Y,10,11,'#fff','#1b1424');txt('!',X+3,Y+2,'#d7262e',7)}
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
// section maps are a preview: on for playtest builds with ?sections in the address or the Options toggle, and for any save already inside one
const SEC_URL=/[?&]sections/.test(location.search);
function secEnabled(){return!!(G&&(G.sec||(G.opt&&G.opt.secMaps)||(SEC_URL&&canFreeRoam())))}
// apprentices in a planet's tower sections must be beaten before its Keeper battles (classic towns keep their own list)
function secApprentices(k){let n=0,any=false;for(const s of Object.values(SWORLD))if(s.pkey===k)for(const p of s.npcs||[])if(p.trainer&&p.trainer.app){any=true;if(!G.beaten[p.id])n++}return any?n:null}
// the opening: wake up at home, Mom sends you to Dr. Vashti's lab, and your partner is chosen at her pod table
const NO_PARTNER=["Wait! It's dangerous out there without an Alienmon.","Dr. Vashti is waiting at her lab: the big dome with the telescope, across the plaza."];
function secWakeUp(){scene='planet';enterSection('002',SWORLD['002'].spawns.wake||SWORLD['002'].spawns.default,'down');
 say(['...','You wake up. Sunlight is pouring over the crater rim.','Today is the day: Dr. Vashti promised you your very first Alienmon partner!'])}
function secStarterTalk(){say(["Dr. Vashti: There you are! Come, come.","Twenty years ago, the sky fell.","Seedpods scattered across the whole Kessler system, onto every world.","What hatched were Alienmon: refugees from a dying planet called Ystra.","Your Linker can bond with them. Three pods hatched this week, and one of them is yours.","Choose your first partner."],()=>{scene='starter';ssel=0},'vashti')}
function secStarterChosen(id){say([D[id].name+' joined you!',"Dr. Vashti: Wonderful. You two already look like you belong together.","Your friend Sola was here at dawn and took one of the others. She's already out training.","Heal for free at the Recovery Bay, stock up at the shop, and when you're ready, head east over the bridge.","The drift grass beyond town hides wild Alienmon. And every world's Keeper guards a Signal Shard. Go see them all!"],null,'vashti')}
