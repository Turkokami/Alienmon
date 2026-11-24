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
  // Every script the page loads is scanned (assets.js, newmons.js and any added later), not just assets.js.
  const pageHtml = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');
  const scripts = [...new Set([...pageHtml.matchAll(/<script src="([^"?]+)/g)].map(m => m[1]))]
    .filter(f => !f.startsWith('desktop') && fs.existsSync(path.join(SRC, f)));
  if (!scripts.includes('assets.js')) scripts.push('assets.js');
  const STREAMED = /https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/[^"'\s]+/g;
  fs.mkdirSync(CACHE, { recursive: true });
  fs.mkdirSync(path.join(OUT, 'm', 'remote'), { recursive: true });
  const urls = new Set();
  for (const f of scripts) {
    let txt = fs.readFileSync(path.join(SRC, f), 'utf8');
    const found = [...new Set(txt.match(f === 'assets.js' ? /https:\/\/[^"'\s]+/g : STREAMED) || [])];
    if (!found.length) continue;
    for (const u of found) {
      const name = path.basename(new URL(u).pathname);
      const cached = path.join(CACHE, name);
      if (!fs.existsSync(cached)) { console.log('Downloading', name); try { download(u, cached); } catch (e) { console.error('Could not download ' + name + '. Run the "Desktop app" workflow, or build on a PC with internet.'); process.exit(1); } }
      fs.copyFileSync(cached, path.join(OUT, 'm', 'remote', name));
      txt = txt.split(u).join('m/remote/' + name);
      urls.add(u);
    }
    fs.writeFileSync(path.join(OUT, f), txt);
    console.log(f + ': ' + found.length + ' streamed models now local');
  }

  // Desktop-only switches. The game keeps a few built areas (0 on Low) after you leave them; the desktop app
  // keeps every one, so desktop.js can build them all up front. Fails loudly if the game code moved.
  const gamePath = path.join(OUT, 'game.js');
  let game = fs.readFileSync(path.join(SRC, 'game.js'), 'utf8');
  const cacheRe = /\bht=\{\},X=([A-Za-z_$][\w$]*\?\d+:[A-Za-z_$][\w$]*\?\d+:\d+),/;
  if (!cacheRe.test(game)) { console.error('Could not find the area cache limit in game.js; update prepare-game.js'); process.exit(1); }
  game = game.replace(cacheRe, (m, orig) => `ht=window.__AM_HT={},X=window.AM_DESKTOP?(window.AM_DESKTOP_CACHE??1e9):(${orig}),`);
  fs.writeFileSync(gamePath, game);
  fs.copyFileSync(path.join(__dirname, 'app', 'ui', 'desktop.js'), path.join(OUT, 'desktop.js'));
  let html = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');
  html = html.replace('<script src="assets.js', '<script src="desktop-config.js"></script><script src="assets.js');
  html = html.replace(/(<script src="game\.js[^"]*"><\/script>)/, '$1<script src="desktop.js"></script>');
  if (!html.includes('desktop.js') || !html.includes('desktop-config.js')) { console.error('Could not add desktop.js to index.html'); process.exit(1); }
  fs.writeFileSync(path.join(OUT, 'index.html'), html);

  // Safety check: nothing in the packaged game may point at the internet.
  const left = [];
  for (const f of ['index.html', 'game.js', ...scripts.filter(x => x !== 'game.js')]) {
    const txt = fs.readFileSync(path.join(OUT, f), 'utf8');
    for (const m of txt.match(/https?:\/\/[^"'\s)]+/g) || []) if (!m.startsWith('http://www.w3.org/')) left.push(f + ': ' + m);
  }
  if (left.length) { console.error('Online links still in the game:\n' + left.join('\n')); process.exit(1); }
  console.log('Game ready in', OUT, '(' + urls.size + ' streamed models now local)');
})().catch(e => { console.error(e); process.exit(1); });
