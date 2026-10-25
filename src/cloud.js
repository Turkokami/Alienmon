/* ---------- Cloud backup (api/cloud-save.js) ----------
 The save stays in this browser as before; with cloud backup on, a copy goes to the server too (at most every 3 minutes
 while playing, and when the app is closed or hidden). The player's Linker backup code is the key: enter it on any
 device (title screen > Restore, or Options > Cloud backup) to bring the game back. No email or personal details. */
const CLOUD_K='alienmon_cloud_code',CLOUD={busy:0,last:0,err:''};
const cloudCode=()=>{try{return localStorage.getItem(CLOUD_K)||''}catch(e){return''}};
const cloudFmt=c=>String(c).replace(/(.{4})(?=.)/g,'$1-');
try{CLOUD.last=+localStorage.getItem('alienmon_cloud_last')||0}catch(e){}
function cloudNewCode(){const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',b=new Uint8Array(16);crypto.getRandomValues(b);return Array.from(b,x=>A[x%32]).join('')}
async function cloudApi(method,q,body){for(const u of['api/cloud-save','/api/cloud-save']){try{
 const r=await fetch(u+(q||''),{method,headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});
 const j=await r.json().catch(()=>null);if(!j){if(r.status===404)continue;return{ok:false,error:'The cloud gave an odd answer ('+r.status+').'}}return Object.assign({ok:r.ok&&j.ok},j)}catch(e){}}
 return{ok:false,error:'Could not reach the cloud. Check your connection.'}}
function cloudInfo(){if(!G||!G.party)return null;const s=G.sec&&typeof SWORLD!=='undefined'&&SWORLD[G.sec.id];
 return{party:G.party.map(m=>nm(m)+' L'+m.lv).join(', '),shards:G.shards||0,dex:Object.keys(G.caught||{}).length,place:s?s.name:''}}
async function cloudUpload(force){const c=cloudCode();if(!c||!G||!G.party||!G.party.length)return null;if(CLOUD.busy){const r=await CLOUD.busy;return force?cloudUpload(true):r}   /* one upload at a time; a forced one runs after */
 if(!force&&Date.now()-CLOUD.last<180000)return null;
 CLOUD.busy=cloudApi('POST','',{code:c,save:JSON.stringify(G),info:cloudInfo()});const r=await CLOUD.busy;CLOUD.busy=0;
 if(r.ok){CLOUD.last=Date.now();CLOUD.err='';try{localStorage.setItem('alienmon_cloud_last',String(CLOUD.last))}catch(e){}}else CLOUD.err=r.error||'Backup failed.';return r}
addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&Date.now()-CLOUD.last>30000){try{if(typeof save==='function')save()}catch(e){}cloudUpload(true)}});
const cloudAgo=t=>{if(!t)return'never';const m=Math.round((Date.now()-t)/60000);return m<1?'just now':m<60?m+' min ago':m<1440?Math.round(m/60)+' h ago':Math.round(m/1440)+' days ago'};
function cloudShowCode(back){const c=cloudCode();tradePanel('Your Linker backup code',
 '<p style="margin:0 0 8px">Write this down or take a screenshot. It is the only key to your game in the cloud. Don\'t share it: anyone with it can load your game.</p>'+
 '<div style="font-size:15px;letter-spacing:2px;color:#ffd23f;margin:10px 0;user-select:all">'+cloudFmt(c)+'</div><div class="msg" style="min-height:14px;color:#9be36b"></div>',
 [['Copy code',async b=>{try{await navigator.clipboard.writeText(cloudFmt(c));b.querySelector('.msg').textContent='Copied!'}catch(e){b.querySelector('.msg').textContent='Select the code and copy it.'}},true],['Done',(b,close)=>{close();if(back)back()}]])}
function cloudRestore(back){tradePanel('Restore from the cloud','<p style="margin:0 0 8px">Type your Linker backup code.</p>'+
 '<input style="'+TA+';height:auto;font-size:14px;letter-spacing:2px;text-transform:uppercase" maxlength="24" placeholder="XXXX-XXXX-XXXX-XXXX"><div class="msg" style="min-height:14px;color:#ff8a1e"></div>',
 [['Find my game',async(b,close)=>{const code=b.querySelector('input').value.toUpperCase().replace(/[^A-Z0-9]/g,''),msg=b.querySelector('.msg');msg.style.color='#e8e0ff';msg.textContent='Looking...';
   const r=await cloudApi('GET','?code='+encodeURIComponent(code));if(!r.ok){msg.style.color='#ff8a1e';msg.textContent=r.error||'Not found.';return}
   const i=r.info||{};msg.style.color='#9be36b';msg.innerHTML='Found it! Saved '+cloudAgo(r.t)+'.<br>'+(i.party?i.party+'<br>':'')+(i.shards|0)+' Shards, '+(i.dex|0)+' Alienmon registered'+(i.place?', at '+i.place:'')+'.';
   const go=document.createElement('button');go.type='button';go.textContent=loadSave()?'Replace the game on this device':'Load this game';
   go.style.cssText='font:inherit;font-size:9px;border:0;border-radius:8px;padding:8px 12px;cursor:pointer;margin-top:8px;background:#ffd23f;color:#1b1424';
   go.onclick=()=>{try{const old=localStorage.getItem('alienmon_save_v2');if(old)localStorage.setItem('alienmon_save_backup_before_restore',old);localStorage.setItem('alienmon_save_v2',r.save);localStorage.setItem(CLOUD_K,code);localStorage.setItem('alienmon_cloud_last',String(r.t||Date.now()))}catch(e){msg.textContent='This device could not store the game.';return}
    msg.textContent='Loaded! Starting...';setTimeout(()=>location.reload(),600)};msg.after(go)},true],['Cancel',(b,close)=>{close();if(back)back()}]])}
function cloudMenu(back){const c=cloudCode();
 if(!c)return say(['Cloud backup keeps a copy of your game safe online.','You get a Linker backup code. With it you can bring your game back on any phone or computer.'],()=>choose('Turn on cloud backup?',['Turn on','Restore from a code','Not now'],k=>{
  if(k===1)return cloudRestore(()=>cloudMenu(back));if(k!==0)return back&&back();
  try{localStorage.setItem(CLOUD_K,cloudNewCode())}catch(e){return say('This device could not turn on cloud backup.',back)}
  if(typeof save==='function')save();say('Backing up...');cloudUpload(true).then(r=>{DLG=null;if(r&&r.ok)say('Cloud backup is on! Here is your Linker backup code.',()=>cloudShowCode(back));else{try{localStorage.removeItem(CLOUD_K)}catch(e){}say(['Backup failed: '+((r&&r.error)||'unknown error'),'Cloud backup was not turned on. Try again later.'],back)}})}));
 choose('Cloud backup (last: '+cloudAgo(CLOUD.last)+')',['Back up now','Show my backup code','Restore from a code','Back'],k=>{
  if(k===0){if(typeof save==='function')save();say('Backing up...');return cloudUpload(true).then(r=>{DLG=null;say(r&&r.ok?'Your game is backed up.':'Backup failed: '+((r&&r.error)||CLOUD.err||'unknown error'),()=>cloudMenu(back))})}
  if(k===1)return cloudShowCode(()=>cloudMenu(back));if(k===2)return cloudRestore(()=>cloudMenu(back));if(back)back()},()=>back&&back())}
