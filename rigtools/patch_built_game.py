"""patch.py <game.js> : adds the rigged-model hooks (battle per-move clips, NPC own clips). Each hook must match once."""
import sys
p=sys.argv[1]; g=open(p).read()
R=[
 # battle model: use the rigged copy when one is listed in window.RIGGED
 ('Xe=async(y,w,R)=>{let F=Mn[y].m,U;if(y==="Plazmo"){',
  'Xe=async(y,w,R)=>{let F=window.RIGGED&&window.RIGGED[y]||Mn[y].m,U;if(y==="Plazmo"&&!(window.RIGGED&&window.RIGGED.Plazmo)){'),
 # pass the move name through to the creature controller
 ('vt(y,"lunge",sv.has(R.t)&&!V.test(R.n||"")?"battle attack":"battle special"),setTimeout(()=>{try{vt(w,"hit")}catch{}},380)',
  'vt(y,"lunge",sv.has(R.t)&&!V.test(R.n||"")?"battle attack":"battle special",R.n),setTimeout(()=>{try{vt(w,"hit")}catch{}},(()=>{let t=window.__rigHit||380;return window.__rigHit=0,t})())'),
 ('window.CREATURE=(v,D,M)=>{','window.CREATURE=(v,D,M,MN)=>{'),
 ('(D==="lunge"?(L.mv=M||"",L.lunge=1)','(D==="lunge"?(L.mv=M||"",L.mn=MN||"",L.lunge=1)'),
 # play the clip named after the move; time it so the blow lands when the target flinches
 ('set lunge(z){z&&!k.dead&&(k.mv==="battle special"?go("battle special",1.15):go("battle attack",1.45))}',
  'set lunge(z){if(!z||k.dead)return;let q=(k.mn||"").toLowerCase().replace(/[^a-z0-9]+/g,"_"),gd=o.userData&&o.userData.alienmonGame,ct=gd&&gd.contact&&gd.contact[q];if(c[q]){let ts=ct?Math.min(1.9,Math.max(1,ct[0]/.5)):1.2;go(q,ts),ct&&(window.__rigHit=Math.max(380,Math.min(900,Math.round(ct[0]/ts*1e3))))}else k.mv==="battle special"?go("battle special",1.15):go("battle attack",1.45)}'),
 # NPCs: keep a rigged character's own idle/walk/run clips
 ('if(D!==v){if(!bi.has(D)){let H=await Qf(D);',
  'if(D!==v){if(!bi.has(D)){let H=await Qf(D);{let m={};for(let c of H.animations||[])m[c.name]=c;m.idle_v2&&m.walk_v2&&m.run_v2&&((window.__trC=window.__trC||{})[D]={idle:m.idle_v2,walk:m.walk_v2,run:m.run_v2})}'),
 ('D.startsWith("tr_")&&(H.scene.rotation.y=-(Ct.idle||0))',
  'D.startsWith("tr_")&&(H.scene.rotation.y=window.__trC&&window.__trC[D]?0:-(Ct.idle||0))'),
 ('ji=v=>{let D=Gt.get(v);if(D)return D;',
  'ji=v=>{let D=Gt.get(v);if(D)return D;if(window.__trC&&window.__trC[v])return Gt.set(v,window.__trC[v]),window.__trC[v];'),
 # every spawn (map wanderers, wild battles, trainer teams) uses the rigged copy when one is listed
 ('ns=async(v,D,L,H,I)=>{let B=await ki(v),','ns=async(v,D,L,H,I)=>{v=window.RIGMAP&&window.RIGMAP[v]||v;let B=await ki(v),'),
 # rigged creatures walk with their own legs when they move on the map
 ('get faint(){return 0}};return __brL.push(k),mx.update(.001),k}',
  'get faint(){return 0}};{let wl=c.walk_loop,gd=o.userData&&o.userData.alienmonGame,rs=gd&&gd.walk||0,lp=null,ww=0;wl&&(wl.play(),wl.setEffectiveWeight(0),k.tk=dt=>{let p=new o.position.constructor;o.getWorldPosition(p);let s=lp?Math.hypot(p.x-lp.x,p.z-lp.z)/Math.max(dt,.001):0;lp=p;let t=s>.12&&s<15&&cur===idle&&!k.dead?1:0;ww+=(t-ww)*Math.min(1,dt*6);wl.setEffectiveWeight(ww);cur===idle&&idle&&idle.setEffectiveWeight(1-ww);t&&(wl.timeScale=rs?Math.min(2.2,Math.max(.5,s/(rs*o.scale.x))):1)})}return __brL.push(k),mx.update(.001),k}'),
 ('k.off=0,k.mx.update(v)}','k.off=0,k.tk&&k.tk(v),k.mx.update(v)}'),
 # afterimage trail: clone without the controller (it holds the animation mixer and can't be copied)
 ('kt=(y,w)=>{let R=y.clone(!0);','kt=(y,w)=>{let ud=y.userData,R;y.userData={};try{R=y.clone(!0)}finally{y.userData=ud}'),
]
for a,b in R:
    n=g.count(a); assert n==1,(n,a[:60]); g=g.replace(a,b)
open(p,'w').write(g); print('patched',len(R),'hooks')
