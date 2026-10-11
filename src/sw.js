// Alienmon service worker: makes the game installable and playable offline.
// tools/build.js copies this to www/sw.js and fills in the build id.
const BUILD=__BUILD__;
const SHELL='alienmon-shell-'+BUILD;     // the page itself, replaced on every build
const ASSETS='alienmon-assets';          // content-hashed art/audio: never changes, kept across builds
const FONTS='alienmon-fonts';
const SHELL_FILES=['./','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','asset-manifest.json'];

self.addEventListener('install',e=>{e.waitUntil(caches.open(SHELL).then(c=>c.addAll(SHELL_FILES)).then(()=>self.skipWaiting()))});

self.addEventListener('activate',e=>{e.waitUntil((async()=>{
  for(const k of await caches.keys())if(k.startsWith('alienmon-shell-')&&k!==SHELL)await caches.delete(k);
  // drop art from older builds that this build no longer uses
  try{const m=await(await fetch('asset-manifest.json',{cache:'no-store'})).json(),keep=new Set(m.assets.map(a=>new URL(a,self.registration.scope).href));
   const c=await caches.open(ASSETS);for(const r of await c.keys())if(!keep.has(r.url))await c.delete(r)}catch(err){}
  await self.clients.claim()})())});

// a byte range of a cached file, for <audio> which asks for ranges
async function rangeFrom(res,range){const buf=await res.arrayBuffer(),m=/bytes=(\d*)-(\d*)/.exec(range),size=buf.byteLength;
  let a=m&&m[1]?+m[1]:0,b=m&&m[2]?+m[2]:size-1;if(m&&!m[1]&&m[2]){a=size-+m[2];b=size-1}b=Math.min(b,size-1);
  return new Response(buf.slice(a,b+1),{status:206,headers:{'Content-Type':res.headers.get('Content-Type')||'application/octet-stream','Content-Range':`bytes ${a}-${b}/${size}`,'Content-Length':String(b-a+1),'Accept-Ranges':'bytes'}})}

self.addEventListener('fetch',e=>{const req=e.request,url=new URL(req.url);if(req.method!=='GET')return;
  if(url.origin===location.origin&&url.pathname.includes('/assets/')){e.respondWith((async()=>{
    const c=await caches.open(ASSETS),hit=await c.match(req.url),range=req.headers.get('range');
    if(hit)return range?rangeFrom(hit,range):hit;
    if(range)return fetch(req);   // partial audio request: stream it; the offline download stores the whole file
    const res=await fetch(req);if(res.ok)c.put(req.url,res.clone());return res})());return}
  if(url.hostname==='fonts.googleapis.com'||url.hostname==='fonts.gstatic.com'){e.respondWith(caches.open(FONTS).then(async c=>{
    const hit=await c.match(req);if(hit)return hit;const res=await fetch(req);if(res.ok||res.type==='opaque')c.put(req,res.clone());return res}));return}
  if(url.origin===location.origin&&(req.mode==='navigate'||SHELL_FILES.some(f=>url.pathname.endsWith('/'+f.replace('./',''))))){
    // network first so new builds show up straight away; the cached copy when offline
    e.respondWith(fetch(req).then(res=>{if(res.ok&&req.mode==='navigate')caches.open(SHELL).then(c=>c.put('./',res.clone()));return res})
      .catch(async()=>(await caches.match(req,{ignoreSearch:true}))||(await caches.match('./'))));}
});

// "make everything available offline": the page asks once it has started
self.addEventListener('message',e=>{if(!e.data||e.data.type!=='cache-all')return;e.waitUntil((async()=>{
  const m=await(await fetch('asset-manifest.json')).json(),c=await caches.open(ASSETS);let done=0;
  const todo=[];for(const a of m.assets){const u=new URL(a,self.registration.scope).href;if(await c.match(u))done++;else todo.push(u)}
  const report=()=>e.source&&e.source.postMessage({type:'cache-progress',done,total:m.assets.length});
  const worker=async()=>{while(todo.length){const u=todo.shift();try{const r=await fetch(u);if(r.ok)await c.put(u,r)}catch(err){}done++;if(done%25===0)report()}};
  await Promise.all([worker(),worker(),worker()]);report()})())});
