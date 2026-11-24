// Copies the live game (../sporeholm3d, as on maps-v2) into app/game for the desktop build,
// downloads the few models the web build streams from Vercel Blob, and points them at the local copies.
// The game files in ../sporeholm3d are never changed.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const crypto = require('crypto');

const SRC = path.join(__dirname, '..', 'sporeholm3d');
const OUT = path.join(__dirname, 'app', 'game');
const CACHE = path.join(__dirname, 'remote-models');   // committed by the fetch-remote-models workflow
const SKIP = new Set(['middleware.js', 'vercel.json', 'README.md']);
// The new Alienmon (newmons.js) are too big to ship inside the installer. They become the model pack: the app
// downloads it on first launch from this repo's Releases (free), tag desktop-pack-<version>. PACK_OUT holds the
// files for the build to publish when that pack is new.
const PACK_SCRIPTS = new Set(['newmons.js']);
const PACK_CACHE = path.join(__dirname, 'pack-cache');
const PACK_OUT = path.join(__dirname, 'pack-out');
const REPO = process.env.GITHUB_REPOSITORY || 'Turkokami/Alienmon';
const sha256 = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');

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

function packName(u) { return path.basename(new URL(u).pathname).replace(/[^A-Za-z0-9._-]/g, '_'); }

// The pack's version comes from its model addresses (a changed model gets a new address on Vercel Blob), so a
// pack that is already on Releases is reused without downloading 2 GB again.
function makePack(found) {
  const names = new Set();
  for (const u of found) { const n = packName(u); if (names.has(n)) throw new Error('Two pack models share the name ' + n); names.add(n); }
  const version = crypto.createHash('sha256').update([...found].sort().join('\n')).digest('hex').slice(0, 12);
  const tag = 'desktop-pack-' + version;
  const base = 'https://github.com/' + REPO + '/releases/download/' + tag + '/';
  try {
    const tmp = path.join(__dirname, 'pack-manifest.prev.json');
    download(base + 'pack-manifest.json', tmp);
    const prev = JSON.parse(fs.readFileSync(tmp, 'utf8'));
    fs.unlinkSync(tmp);
    if (prev.version === version && prev.files.length === found.length) { console.log('Pack ' + version + ' is already on Releases'); return prev; }
  } catch { console.log('Pack ' + version + ' is new; fetching its models'); }
  fs.mkdirSync(PACK_CACHE, { recursive: true });
  fs.mkdirSync(PACK_OUT, { recursive: true });
  const files = [];
  for (const u of found) {
    const name = packName(u), cached = path.join(PACK_CACHE, name);
    if (!fs.existsSync(cached)) { console.log('Downloading', name); try { download(u, cached); } catch (e) { console.error('Could not download ' + name); process.exit(1); } }
    const head = Buffer.alloc(12), fd = fs.openSync(cached, 'r'); fs.readSync(fd, head, 0, 12, 0); fs.closeSync(fd);
    const size = fs.statSync(cached).size;
    if (head.toString('latin1', 0, 4) !== 'glTF' || head.readUInt32LE(8) !== size) { fs.unlinkSync(cached); console.error('Not a whole model file: ' + name); process.exit(1); }
    fs.copyFileSync(cached, path.join(PACK_OUT, name));
    files.push({ name, url: base + name, size, sha256: sha256(cached) });
  }
  const manifest = { version, tag, files };
  fs.writeFileSync(path.join(PACK_OUT, 'pack-manifest.json'), JSON.stringify(manifest));
  fs.writeFileSync(path.join(PACK_OUT, 'TAG'), tag);
  console.log('Pack ' + version + ': ' + files.length + ' models, ' + Math.round(files.reduce((a, f) => a + f.size, 0) / 1048576) + ' MB');
  return manifest;
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
  fs.rmSync(path.join(OUT, 'm', 'remote'), { recursive: true, force: true });   // no leftovers from an older build
  fs.mkdirSync(path.join(OUT, 'm', 'remote'), { recursive: true });
  const urls = new Set();
  fs.rmSync(PACK_OUT, { recursive: true, force: true });
  let pack = null;
  for (const f of scripts) {
    let txt = fs.readFileSync(path.join(SRC, f), 'utf8');
    const found = [...new Set(txt.match(f === 'assets.js' ? /https:\/\/[^"'\s]+/g : STREAMED) || [])];
    if (!found.length) continue;
    if (PACK_SCRIPTS.has(f)) {
      pack = makePack(found);
      for (const u of found) txt = txt.split(u).join('pack/' + packName(u));
      fs.writeFileSync(path.join(OUT, f), txt);
      console.log(f + ': ' + found.length + ' models go in the download-on-first-launch pack ' + pack.version);
      continue;
    }
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
  fs.writeFileSync(path.join(OUT, 'pack-manifest.json'), JSON.stringify(pack || { version: 'none', files: [] }));
  console.log('Game ready in', OUT, '(' + urls.size + ' streamed models now local, ' + (pack ? pack.files.length : 0) + ' in the pack)');
})().catch(e => { console.error(e); process.exit(1); });
