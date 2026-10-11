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
function expGain(e,p,trainer){const by=spOf(e.id).base_yield||Math.round(D[e.id].s.reduce((a,b)=>a+b,0)*0.25),L=e.lv,Lp=p.lv;
 let x=Math.floor((by*L/5)*Math.pow((2*L+10)/(L+Lp+10),2.5))+1;return trainer?Math.floor(x*1.5):x}
// TP in the defeated species' highest base stat: 1 first stage, 2 middle or single-stage, 3 final stage
function tpGain(e){const s=spOf(e.id),b=D[e.id].s,n=s.stages||1,st=s.stage||1;return[b.indexOf(Math.max(...b)),n>1&&st===n?3:(n===1||st>1)?2:1]}
function addTP(m,i,a){m.tp=m.tp||[0,0,0,0,0,0];const tot=m.tp.reduce((x,y)=>x+y,0);a=Math.max(0,Math.min(a,250-m.tp[i],500-tot));m.tp[i]+=a}
function progAward(e,trainer,steps,skip){const link=!G.opt||G.opt.expLink!==false,parts=new Set([...(B.part||[]),B.pi]);
 const alive=G.party.map((m,i)=>[m,i]).filter(([m,i])=>m.hp>0&&m!==skip);
 const recv=link?alive.map(([m,i])=>[m,i===B.pi?1:0.5]):alive.filter(([m,i])=>parts.has(i)).map(([m])=>[m,1/Math.max(1,alive.filter(([x,i])=>parts.has(i)).length)]);
 const[ti,ta]=tpGain(e);let shared=0;
 for(const[m,share]of recv){const amt=Math.max(1,Math.floor(expGain(e,m,trainer)*share));m.xp+=amt;addTP(m,ti,ta);
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
function learnPrompt(m,mi,cb){if(m.moves.includes(mi))return cb();
 if(m.moves.length<4){m.moves.push(mi);return say(nm(m)+' learned '+MV[mi].n+'!',cb)}
 const skip=()=>say(nm(m)+' did not learn '+MV[mi].n+'.',cb);
 say(nm(m)+' wants to learn '+MV[mi].n+', but it already knows 4 moves.',()=>choose('Forget which move?',m.moves.map(x=>MV[x].n).concat(["Don't learn"]),i=>{
  if(i>=4)return skip();const old=m.moves[i];m.moves[i]=mi;say(['1, 2 and... Poof!',nm(m)+' forgot '+MV[old].n+'...','...and learned '+MV[mi].n+'!'],cb)},skip))}
function moveArchive(){const L=G.party.map(m=>nm(m)+' Lv'+m.lv);choose('Move Archive: 100 stardust',L.concat(['Back']),i=>{if(i>=G.party.length)return bayMenu();const m=G.party[i];
 const opts=[...new Set(learnset(m.id).filter(([l,mi])=>l<=m.lv&&!m.moves.includes(mi)).map(([l,mi])=>mi))];
 if(!opts.length)return say(nm(m)+' has no moves to remember.',moveArchive);
 choose('Relearn which move?',opts.map(mi=>MV[mi].n).concat(['Back']),j=>{if(j>=opts.length)return moveArchive();if(G.dust<100)return say('You need 100 stardust.',moveArchive);
  G.dust-=100;learnPrompt(m,opts[j],moveArchive)},moveArchive)},bayMenu)}

/* evolution: level or Resonance; B cancels */
function evoReady(m){const ev=spOf(m.id).evolves;if(!ev||!ev.into||IDX[ev.into]==null||m.hp<=0||m.lv<(ev.level||999))return false;const how=ev.method||'';
 if(how.startsWith('Level'))return true;if(/Signal Shard 4/.test(how))return G.shards>=4;if(/all 8/.test(how))return G.shards>=8;
 const here=(PL[G.planet]||{}).key;if(/Halo/.test(how))return m.lvUp&&here==='halo';if(/Rift/.test(how))return m.lvUp&&here==='starfall';return false}
function evoSteps(steps){for(const m of G.party)if(evoReady(m))steps.push({fn:cb=>{const into=IDX[spOf(m.id).evolves.into],old=nm(m);
  say('What? '+old+' is evolving!',()=>choose('Let '+old+' evolve?',['Evolve','Stop'],i=>{if(i!==0)return say('Huh? '+old+' stopped evolving!',cb);
   const r=m.hp/stat(m,0);m.id=into;m.hp=Math.max(1,Math.round(stat(m,0)*r));G.seen[m.id]=G.caught[m.id]=1;
   const L=[];say(old+' evolved into '+nm(m)+'!',()=>progRun(learnset(m.id).filter(([l,mi])=>l<=m.lv&&MV[mi].sig).map(([l,mi])=>({fn:c=>learnPrompt(m,mi,c)})),cb))},()=>say('Huh? '+old+' stopped evolving!',cb)))}});
 for(const m of G.party)m.lvUp=0}

/* Shard Sync Limit: gifted, traded and legendary Alienmon above the limit ignore 25% of commands */
const SYNC_LIMIT=[15,20,25,30,35,40,45,50,999];
function disobeys(m){return!!m.ob&&G.party.includes(m)&&m.lv>SYNC_LIMIT[Math.min(8,G.shards||0)]&&R()<0.25}

/* wild Alienmon by world: tier 1, tier 2 after 4 Shards, tier 3 after the Champion */
function wildTable(key){const a=PROG.areas[key];if(!a)return null;return(G.flags.champ&&a.tier3_after_champion)||(G.shards>=4&&a.tier2_after_4_shards)||a.tier1}
function wildPick(key,name){const t=(wildTable(key)||[]).filter(x=>wildOK(x.name));if(!t.length)return null;let e=null;
 if(name&&wildOK(name))e=t.find(x=>x.name===name)||(PROG.areas[key].tier1||[]).find(x=>x.name===name);
 if(!e){let w=t.reduce((s,x)=>s+(x.weight||1),0)*R();for(const x of t){w-=x.weight||1;if(w<=0){e=x;break}}e=e||t[0]}
 const id=IDX[e.name];return id==null?null:[id,ri(e.min,e.max)]}

/* trainers, Keepers, bosses: levels and payouts from the tables */
function keeperTeam(key,k){const t=PROG.keepers[key];if(!t)return k.team;const base=k.team.map(([id])=>id),p=PL.find(x=>x.key===key),extra=p?p.pool.e.concat(p.pool.c):[];
 return t.team_levels.map((lv,i)=>[i<base.length?base[i]:extra[i%extra.length],lv])}
function trainerLevels(key){const a=PROG.areas[key];return a&&a.trainer_levels?a.trainer_levels:null}
function payout(tr,e){if(!tr)return ri(2,6);const lv=Math.max(...tr.team.map(x=>x[1]));return tr.shard?60*lv:20*lv}
// shop stock grows with Signal Shards
const SHOP_TIERS=[[0,['stasis','gel','cure']],[1,['tether','stun']],[2,['harmonic','megagel','ether','jammer']],[3,['revive']],[5,['fullgel']],[6,['singularity']],[8,['maxrevive']]];
const SHOP_PRICE={ether:60,jammer:35,stasis:50,gel:15,cure:20,tether:30,stun:30,harmonic:150,megagel:45,revive:80,fullgel:120,singularity:400,maxrevive:300};
const shopOpen=k=>SHOP_TIERS.some(([s,ks])=>ks.includes(k)&&(G.shards||0)>=s);
