// Alienmon 3D desktop app.
// Serves the bundled game from the app's own folder through a private app:// address, so every model,
// texture and sound loads from disk. The game page itself can never reach the internet, and saves
// (localStorage) stay in the user's profile folder between launches. Only the app's own downloader goes
// online: once for the new Alienmon model pack (pack.js) and when you press Update (update.js).
'use strict';
const { app, BrowserWindow, Menu, protocol, session, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const os = require('os');
const { spawn } = require('child_process');
const { Pack } = require('./pack');
const { Updater } = require('./update');

app.setName('Alienmon 3D');
app.commandLine.appendSwitch('ignore-gpu-blocklist');          // use the GPU even on older driver lists
app.commandLine.appendSwitch('force_high_performance_gpu');     // laptops: pick the gaming GPU, not the built-in one
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
// Keeping every built area needs a bigger JavaScript heap than Chrome's default. Budget: half the PC's RAM.
const RAM_MB = Math.round(os.totalmem() / 1048576);
const AREA_MB = 200;                                   // measured: about 100 MB of game data + textures per built area
const CACHE_AREAS = Math.max(6, Math.floor((RAM_MB * 0.5) / AREA_MB));
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=' + Math.min(16384, Math.max(4096, Math.round(RAM_MB * 0.6))));

const HOST = 'alienmon';
const ORIGIN = 'app://' + HOST;
const ROOT = path.join(__dirname, 'app');
const GAME = path.join(ROOT, 'game');
const UI = path.join(ROOT, 'ui');
const WORLDS = [['dustara', 'Dustara'], ['sporeholm', 'Sporeholm'], ['ferrox', 'Ferrox'], ['thalassa', 'Thalassa'], ['neonis', 'Neonis']];

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.css': 'text/css', '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav',
  '.m4a': 'audio/mp4', '.mp4': 'video/mp4', '.webm': 'video/webm', '.wasm': 'application/wasm', '.txt': 'text/plain',
};

protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true, corsEnabled: true },
}]);

const args = process.argv.slice(1);
const selftest = (args.find(a => a.startsWith('--selftest=')) || '').slice(11);   // world,seconds,out.png (used by the build check)
const packtest = (args.find(a => a.startsWith('--packtest=')) || '').slice(11);    // out.json: download the pack, report
const updatetest = (args.find(a => a.startsWith('--updatetest=')) || '').slice(13); // out.json: check, download, apply an update
const blocked = [];
function readJson(f) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } }
const BUILD = Object.assign({ run: 0, tag: null, repo: 'Turkokami/Alienmon' }, readJson(path.join(__dirname, 'build-info.json')) || {});
if (process.env.ALIENMON_BUILD_RUN) BUILD.run = +process.env.ALIENMON_BUILD_RUN;   // the build check pretends to be older
// Downloads use their own session: the game's session blocks every internet address.
const netFetch = (u, o) => session.fromPartition('persist:downloads').fetch(u, Object.assign({ cache: 'no-store' }, o));
let pack, updater;
function json(o) { return new Response(JSON.stringify(o), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' } }); }
function firstPage() { return ORIGIN + (pack.ready() ? '/start' : '/_ui/download.html'); }
function packStatus() { return Object.assign({ ready: pack.ready(), version: pack.manifest && pack.manifest.version }, pack.status); }

// Run the downloaded installer silently over this install; it starts the game again when it is done.
function applyUpdate(installer, env) {
  if (process.platform !== 'win32' || !app.isPackaged) throw new Error('Updates install only in the installed Windows app');
  const dir = path.join(app.getPath('userData'), 'updates');
  fs.writeFileSync(path.join(dir, 'pending.json'), JSON.stringify({ from: BUILD.tag, to: updater.found && updater.found.tag, at: new Date().toISOString() }));
  spawn(installer, ['/S', '--force-run'], { detached: true, stdio: 'ignore', env: env || process.env }).unref();
  setTimeout(() => app.exit(0), 300);
}
const missing = [];

function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath);
  if (p === '/' || p === '') return path.join(UI, 'start.html');
  if (p === '/start') return path.join(UI, 'start.html');
  if (p.startsWith('/_ui/')) { const f = path.normalize(path.join(UI, p.slice(5))); return f.startsWith(UI + path.sep) ? f : null; }
  const f = path.normalize(path.join(GAME, p));
  if (!f.startsWith(GAME + path.sep)) return null;
  if (!path.extname(f) && fs.existsSync(f + '.html')) return f + '.html';   // the web host used clean URLs
  return f;
}

async function serve(request) {
  const url = new URL(request.url);
  if (url.pathname === '/desktop-config.js') {
    const off = /[?&]preload=0\b/.test(url.search) || process.env.ALIENMON_NO_PRELOAD === '1';
    return new Response(`window.AM_DESKTOP=1;window.AM_DESKTOP_RAM_MB=${RAM_MB};window.AM_DESKTOP_CACHE=${CACHE_AREAS};try{var c=+localStorage.getItem('am_desktop_cap');if(c>0&&c<window.AM_DESKTOP_CACHE)window.AM_DESKTOP_CACHE=c}catch(e){}` + (off ? 'window.AM_PRELOAD_OFF=1;' : ''),
      { headers: { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-cache' } });
  }
  if (url.pathname === '/_pack/status') return json(packStatus());
  if (url.pathname === '/_pack/start') { pack.start(); return json(packStatus()); }
  if (url.pathname === '/_update/status') { await updater.check(url.searchParams.has('force')); return json(updater.status); }
  if (url.pathname === '/_update/last') {   // shown once on the start screen after an update
    const f = path.join(app.getPath('userData'), 'updates', 'last-update.json'), last = readJson(f);
    if (last && !last.shown) { last.shown = true; try { fs.writeFileSync(f, JSON.stringify(last)); } catch {} return json(last); }
    return json(null);
  }
  if (url.pathname === '/_update/start') {
    if (updater.status.state === 'available' || updater.status.state === 'error')
      updater.download().then(f => applyUpdate(f)).catch(e => { updater.status.state = 'error'; updater.status.error = String(e && e.message || e); });
    return json(updater.status);
  }
  // Until the pack is complete, the new Alienmon stay switched off (the game runs fine without them).
  if (url.pathname === '/newmons.js' && !pack.ready()) return new Response('/* new Alienmon pack not downloaded yet */', { headers: { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-cache' } });
  const file = url.pathname.startsWith('/pack/') ? pack.file(decodeURIComponent(url.pathname.slice(6))) : resolveFile(url.pathname);
  let st;
  try { st = file && fs.statSync(file); } catch {}
  if (!st || !st.isFile()) { missing.push(url.pathname); return new Response('Not found', { status: 404 }); }
  const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
  const headers = { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' };
  const range = request.headers.get('range');
  const m = range && /bytes=(\d*)-(\d*)/.exec(range);
  if (m && (m[1] || m[2])) {   // the voice bank reads one line at a time with Range requests
    let start = m[1] ? parseInt(m[1], 10) : Math.max(0, st.size - parseInt(m[2], 10));
    let end = m[1] && m[2] ? Math.min(parseInt(m[2], 10), st.size - 1) : st.size - 1;
    if (start >= st.size || start > end) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + st.size } });
    headers['Content-Range'] = `bytes ${start}-${end}/${st.size}`;
    headers['Content-Length'] = String(end - start + 1);
    return new Response(Readable.toWeb(fs.createReadStream(file, { start, end })), { status: 206, headers });
  }
  headers['Content-Length'] = String(st.size);
  return new Response(Readable.toWeb(fs.createReadStream(file)), { status: 200, headers });
}

function worldUrl(w) { return ORIGIN + '/index.html' + (w ? '?world=' + w : ''); }

function buildMenu(win) {
  const go = u => () => win.loadURL(u);
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { label: 'Game', submenu: [
      { label: 'Start screen', accelerator: 'F10', click: go(ORIGIN + '/start') },
      { label: 'Worlds', submenu: WORLDS.map(([k, n]) => ({ label: n, click: go(worldUrl(k)) })) },
      { type: 'separator' },
      { label: 'Full screen', accelerator: 'F11', click: () => win.setFullScreen(!win.isFullScreen()) },
      { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => win.reload() },
      { type: 'separator' },
      { label: 'Open save folder', click: () => shell.openPath(app.getPath('userData')) },
      { role: 'quit', label: 'Quit' },
    ] },
    { label: 'Help', submenu: [{ label: 'Developer tools', accelerator: 'CmdOrCtrl+Shift+I', click: () => win.webContents.toggleDevTools() }] },
  ]));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1600, height: 900, minWidth: 960, minHeight: 600,
    backgroundColor: '#0a0620', title: 'Alienmon 3D', autoHideMenuBar: true, show: !selftest,
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: { backgroundThrottling: false, contextIsolation: true, nodeIntegration: false, spellcheck: false },
  });
  buildMenu(win);
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith(ORIGIN + '/')) e.preventDefault(); });
  win.webContents.on('before-input-event', (e, input) => {    // keys work even with the menu bar hidden
    if (input.type !== 'keyDown') return;
    if (input.key === 'F11') { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
    if (input.key === 'F10') { win.loadURL(ORIGIN + '/start'); e.preventDefault(); }
  });
  return win;
}

if (process.env.ALIENMON_AFTER_UPDATE) {   // the build check: the updated app was started again by the installer
  app.whenReady().then(() => {
    try { fs.writeFileSync(process.env.ALIENMON_AFTER_UPDATE, JSON.stringify({ relaunched: true, build: BUILD, exe: process.execPath, at: new Date().toISOString() })); } catch {}
    app.exit(0);
  });
} else if (!selftest && !packtest && !updatetest && !app.requestSingleInstanceLock()) app.quit();
app.on('second-instance', () => { const w = BrowserWindow.getAllWindows()[0]; if (w) { if (w.isMinimized()) w.restore(); w.focus(); } });

app.whenReady().then(async () => {
  if (process.env.ALIENMON_AFTER_UPDATE) return;
  // First launch after the Update button: note that the update went in (the start screen shows it once).
  const updDir = path.join(app.getPath('userData'), 'updates'), pending = readJson(path.join(updDir, 'pending.json'));
  if (pending) {
    try { fs.writeFileSync(path.join(updDir, 'last-update.json'), JSON.stringify(Object.assign(pending, { running: BUILD.tag, ok: !pending.to || pending.to === BUILD.tag, startedAt: new Date().toISOString(), shown: false }))); } catch {}
    try { fs.unlinkSync(path.join(updDir, 'pending.json')); } catch {}
  }
  pack = new Pack({ manifestPath: path.join(GAME, 'pack-manifest.json'), dir: path.join(app.getPath('userData'), 'packs', 'alienmon'), fetchFn: netFetch });
  updater = new Updater({ build: BUILD, fetchFn: netFetch, dir: path.join(app.getPath('userData'), 'updates') });
  protocol.handle('app', serve);
  if (packtest) {   // build check: download the pack as a first launch would, then once more as a second launch would
    const t0 = Date.now(), report = { readyBefore: pack.ready(), version: pack.manifest && pack.manifest.version, files: pack.status.totalFiles, totalMB: Math.round(pack.status.totalBytes / 1048576) };
    await pack.start();
    Object.assign(report, { state: pack.status.state, error: pack.status.error, fetchedMB: Math.round((pack.status.fetchedBytes || 0) / 1048576), seconds: Math.round((Date.now() - t0) / 1000), readyAfter: pack.ready() });
    const again = new Pack({ manifestPath: path.join(GAME, 'pack-manifest.json'), dir: pack.dir, fetchFn: () => { throw new Error('second launch went online'); } });
    report.secondLaunch = { ready: again.ready(), firstPage: again.ready() ? '/start' : '/_ui/download.html' };
    fs.writeFileSync(packtest, JSON.stringify(report, null, 2));
    app.exit(0); return;
  }
  if (updatetest) {  // build check: pretend to be an older build, find this build on Releases, download it, install it
    const report = { build: BUILD };
    try {
      report.check = Object.assign({}, await updater.check(true), { source: updater.source });
      if (updater.status.state === 'available') {
        const f = await updater.download();
        report.download = { file: path.basename(f), bytes: fs.statSync(f).size, digestChecked: !!updater.found.digest };
        if (process.env.ALIENMON_UPDATE_APPLY) {
          report.applied = true;
          fs.writeFileSync(updatetest, JSON.stringify(report, null, 2));
          const env = Object.assign({}, process.env); delete env.ALIENMON_BUILD_RUN; delete env.ALIENMON_UPDATE_APPLY; if (process.env.ALIENMON_UPDATE_REPORT) env.ALIENMON_AFTER_UPDATE = process.env.ALIENMON_UPDATE_REPORT;
          applyUpdate(f, env); return;
        }
      }
    } catch (e) { report.error = String(e && e.message || e); }
    fs.writeFileSync(updatetest, JSON.stringify(report, null, 2));
    app.exit(0); return;
  }
  // Offline by design: nothing leaves the PC. Blocked addresses are kept for the build check.
  session.defaultSession.webRequest.onBeforeRequest({ urls: ['http://*/*', 'https://*/*', 'ws://*/*', 'wss://*/*'] }, (d, cb) => {
    blocked.push(d.url); cb({ cancel: true });
  });
  const win = createWindow();
  if (!selftest) { win.loadURL(firstPage()); return; }

  // Build check: open one world, let it run, save a screenshot and a report, then quit.
  const [world, secs, out] = selftest.split(',');
  const errors = [];
  win.webContents.on('console-message', (e) => { const lvl = e.level ?? e.params?.level; const msg = e.message ?? e.params?.message; if (lvl === 'error' || lvl === 3) errors.push(msg); });
  win.webContents.on('render-process-gone', (e, d) => errors.push('renderer gone: ' + d.reason));
  win.loadURL(worldUrl(world));
  const t0 = Date.now(), limit = (parseFloat(secs) || 30) * 1000;
  const memMB = () => Math.round(app.getAppMetrics().reduce((a, m) => a + (m.memory ? m.memory.workingSetSize : 0), 0) / 1024);
  let peak = 0;
  const poll = setInterval(async () => {
    peak = Math.max(peak, memMB());
    let pre = null;
    try { pre = await win.webContents.executeJavaScript('window.AM_PRELOAD ? JSON.stringify(window.AM_PRELOAD) : null'); } catch {}
    pre = pre && JSON.parse(pre);
    if (process.env.SELFTEST_VERBOSE && pre) console.log('[selftest]', world, Math.round((Date.now() - t0) / 1000) + 's', pre.built + '/' + pre.total, memMB() + 'MB');
    if (!((pre && pre.done) || Date.now() - t0 > limit)) return;
    clearInterval(poll);
    if (process.env.SELFTEST_TELEPORT) {   // walk into the area farthest from the start, to see a reused area drawn
      try { await win.webContents.executeJavaScript(`(()=>{const G=window.GAME,R=G.res.rects,p=G.P.position;let best=null,bd=-1;for(const k in R){const [x,z]=G.res.unwarp?G.res.unwarp(R[k][0]+15,R[k][1]+15):[R[k][0]+15,R[k][1]+15];const d=Math.hypot(x-p.x,z-p.z);if(d>bd){bd=d;best=[k,x,z]}}p.set(best[1],G.groundY(best[1],best[2]),best[2]);window.__tp=best[0];return best})()`); } catch (e) { errors.push('teleport: ' + e); }
      await new Promise(r => setTimeout(r, 15000));
    }
    await new Promise(r => setTimeout(r, 4000));
    let state = { teleportedTo: await win.webContents.executeJavaScript('window.__tp||null').catch(()=>null), lastLoad: await win.webContents.executeJavaScript('window.GAME&&window.GAME.STAT?JSON.stringify(window.GAME.STAT):null').catch(()=>null), preload: pre, secondsToReady: Math.round((Date.now() - t0) / 1000), memMB: memMB(), peakMemMB: peak };
    try { state.checks = await win.webContents.executeJavaScript(`(async()=>{const out={};const names=${JSON.stringify(fs.existsSync(path.join(GAME,'m','remote'))?fs.readdirSync(path.join(GAME,'m','remote')):[])};let ok=0;for(const n of names){const r=await fetch('m/remote/'+n);const b=new Uint8Array(await r.arrayBuffer());if(r.ok&&String.fromCharCode(b[0],b[1],b[2],b[3])==='glTF')ok++}out.remoteModelsOk=ok+'/'+names.length;out.newAlienmon=Object.keys(window.NEWMONS||{}).length;const ps=await (await fetch('/_pack/status')).json();out.packReady=ps.ready;if(ps.ready){const pm=await (await fetch('pack-manifest.json')).json();let pok=0;for(const f of pm.files.slice(0,10)){const r=await fetch('pack/'+f.name);const b=new Uint8Array(await r.arrayBuffer());if(r.ok&&b.length===f.size&&String.fromCharCode(b[0],b[1],b[2],b[3])==='glTF')pok++}out.packModelsOk=pok+'/'+Math.min(10,pm.files.length)}const G=window.GAME;if(G&&G.STAT&&!window.AM_PRELOAD_OFF){const ks=Object.keys(G.res.rects).filter(k=>!G.CH[k]).slice(0,8);const t=[];for(const k of ks){const a=performance.now();G.loadScene(k);t.push({area:k,ms:Math.round(performance.now()-a),cached:String(G.STAT.last).endsWith('*')});G.unloadScene(k)}out.revisit=t;const ri=G.r.info.memory;out.gpu={textures:ri.textures,geometries:ri.geometries};if(performance.memory)out.jsHeapMB=Math.round(performance.memory.usedJSHeapSize/1048576)}const v=await fetch('audio/voicebank_spo.mp3',{headers:{Range:'bytes=100-199'}});out.rangeStatus=v.status;out.rangeBytes=(await v.arrayBuffer()).byteLength;return out})()`); } catch (e) { state.checkErr = String(e); }
    try {
      Object.assign(state, await win.webContents.executeJavaScript(`({ loadText: (document.getElementById('load')||{}).textContent, loadShown: getComputedStyle(document.getElementById('load')).display !== 'none', hasGame: !!window.GAME, canvases: document.querySelectorAll('canvas').length, gl: (()=>{const c=document.querySelector('canvas');if(!c)return null;const g=c.getContext('webgl2')||c.getContext('webgl');if(!g)return null;const x=g.getExtension('WEBGL_debug_renderer_info');return x?g.getParameter(x.UNMASKED_RENDERER_WEBGL):'webgl'})() })`));
    } catch (e) { state.err = String(e); }
    try { const img = await win.webContents.capturePage(); fs.writeFileSync(out, img.toPNG()); } catch (e) { state.shotErr = String(e); }
    const report = JSON.stringify({ world, state, blocked, missing: [...new Set(missing)], errors: errors.slice(0, 40) }, null, 2);
    try { fs.writeFileSync(out.replace(/\.png$/, '.json'), report); } catch (e) { console.log(report); console.error('[selftest] could not write report:', String(e)); }
    app.exit(0);
    }, 2000);
});

app.on('window-all-closed', () => app.quit());
