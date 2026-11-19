// Copies the live game (../sporeholm3d, as on maps-v2) into app/game for the desktop build,
// downloads the few models the web build streams from Vercel Blob, and points them at the local copies.
// The game files in ../sporeholm3d are never changed.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SRC = path.join(__dirname, '..', 'sporeholm3d');
const OUT = path.join(__dirname, 'app', 'game');
const CACHE = path.join(__dirname, 'remote-models');   // committed by the fetch-remote-models workflow
const SKIP = new Set(['middleware.js', 'vercel.json', 'README.md']);

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (SKIP.has(e.name) && src === SRC) continue;
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else {
      const st = fs.statSync(s);
      try { const dt = fs.statSync(d); if (dt.size === st.size && dt.mtimeMs >= st.mtimeMs) continue; } catch {}
      fs.copyFileSync(s, d);
    }
  }
}

// curl (built into Windows 10/11, macOS and Linux) follows proxies and redirects for us.
function download(url, dest) {
  const tmp = dest + '.part';
  execFileSync('curl', ['-fsSL', '--retry', '3', '-o', tmp, url], { stdio: 'inherit' });
  fs.renameSync(tmp, dest);
}

(async () => {
  if (!fs.existsSync(path.join(SRC, 'index.html'))) throw new Error('Game folder not found: ' + SRC);
  console.log('Copying game files from', SRC);
  copyDir(SRC, OUT);

  // Models the web build loads from the internet ("url:https://..."): fetch once, store under m/remote/.
  const assetsPath = path.join(OUT, 'assets.js');
  let assets = fs.readFileSync(path.join(SRC, 'assets.js'), 'utf8');
  const urls = [...new Set(assets.match(/https:\/\/[^"'\s]+/g) || [])];
  fs.mkdirSync(CACHE, { recursive: true });
  fs.mkdirSync(path.join(OUT, 'm', 'remote'), { recursive: true });
  for (const u of urls) {
    const name = path.basename(new URL(u).pathname);
    const cached = path.join(CACHE, name);
    if (!fs.existsSync(cached)) { console.log('Downloading', name); try { download(u, cached); } catch (e) { console.error('Could not download ' + name + '. Run the "Desktop app" workflow, or build on a PC with internet.'); process.exit(1); } }
    fs.copyFileSync(cached, path.join(OUT, 'm', 'remote', name));
    assets = assets.split(u).join('m/remote/' + name);
  }
  fs.writeFileSync(assetsPath, assets);

  // Safety check: nothing in the packaged game may point at the internet.
  const left = [];
  for (const f of ['index.html', 'game.js', 'world.js', 'assets.js']) {
    const txt = fs.readFileSync(path.join(OUT, f), 'utf8');
    for (const m of txt.match(/https?:\/\/[^"'\s)]+/g) || []) if (!m.startsWith('http://www.w3.org/')) left.push(f + ': ' + m);
  }
  if (left.length) { console.error('Online links still in the game:\n' + left.join('\n')); process.exit(1); }
  console.log('Game ready in', OUT, '(' + urls.length + ' streamed models now local)');
})().catch(e => { console.error(e); process.exit(1); });
