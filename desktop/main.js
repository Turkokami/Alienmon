// Alienmon 3D desktop app.
// Serves the bundled game from the app's own folder through a private app:// address, so every model,
// texture and sound loads from disk. Any attempt to reach the internet is blocked, and saves
// (localStorage) stay in the user's profile folder between launches.
'use strict';
const { app, BrowserWindow, Menu, protocol, session, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

app.setName('Alienmon 3D');
app.commandLine.appendSwitch('ignore-gpu-blocklist');          // use the GPU even on older driver lists
app.commandLine.appendSwitch('force_high_performance_gpu');     // laptops: pick the gaming GPU, not the built-in one
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');

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
const blocked = [];
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
  const file = resolveFile(url.pathname);
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

if (!selftest && !app.requestSingleInstanceLock()) app.quit();
app.on('second-instance', () => { const w = BrowserWindow.getAllWindows()[0]; if (w) { if (w.isMinimized()) w.restore(); w.focus(); } });

app.whenReady().then(() => {
  protocol.handle('app', serve);
  // Offline by design: nothing leaves the PC. Blocked addresses are kept for the build check.
  session.defaultSession.webRequest.onBeforeRequest({ urls: ['http://*/*', 'https://*/*', 'ws://*/*', 'wss://*/*'] }, (d, cb) => {
    blocked.push(d.url); cb({ cancel: true });
  });
  const win = createWindow();
  if (!selftest) { win.loadURL(ORIGIN + '/start'); return; }

  // Build check: open one world, let it run, save a screenshot and a report, then quit.
  const [world, secs, out] = selftest.split(',');
  const errors = [];
  win.webContents.on('console-message', (e) => { const lvl = e.level ?? e.params?.level; const msg = e.message ?? e.params?.message; if (lvl === 'error' || lvl === 3) errors.push(msg); });
  win.webContents.on('render-process-gone', (e, d) => errors.push('renderer gone: ' + d.reason));
  win.loadURL(worldUrl(world));
  setTimeout(async () => {
    let state = {};
    try {
      state = await win.webContents.executeJavaScript(`({ loadText: (document.getElementById('load')||{}).textContent, loadShown: getComputedStyle(document.getElementById('load')).display !== 'none', hasGame: !!window.GAME, canvases: document.querySelectorAll('canvas').length, gl: (()=>{const c=document.querySelector('canvas');if(!c)return null;const g=c.getContext('webgl2')||c.getContext('webgl');if(!g)return null;const x=g.getExtension('WEBGL_debug_renderer_info');return x?g.getParameter(x.UNMASKED_RENDERER_WEBGL):'webgl'})() })`);
    } catch (e) { state.err = String(e); }
    try { const img = await win.webContents.capturePage(); fs.writeFileSync(out, img.toPNG()); } catch (e) { state.shotErr = String(e); }
    fs.writeFileSync(out.replace(/\.png$/, '.json'), JSON.stringify({ world, state, blocked, missing: [...new Set(missing)], errors: errors.slice(0, 40) }, null, 2));
    app.exit(0);
  }, (parseFloat(secs) || 30) * 1000);
});

app.on('window-all-closed', () => app.quit());
