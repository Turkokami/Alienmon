// The Alienmon model pack: the big set of new Alienmon models is not inside the installer (that would pass
// the 2 GB installer limit). The app downloads it once, on first launch, into the user's profile folder,
// and plays offline from then on. A new installer with a different pack fetches only what changed.
//
// app/game/pack-manifest.json (written by prepare-game.js): { version, files: [{ name, url, size, sha256 }] }
// <userData>/packs/alienmon/: the files, plus state.json { version } once every file is in place and checked.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function readJson(f) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } }

function sha256File(f) {
  return new Promise((resolve, reject) => {
    const h = crypto.createHash('sha256');
    fs.createReadStream(f).on('data', d => h.update(d)).on('end', () => resolve(h.digest('hex'))).on('error', reject);
  });
}

class Pack {
  // fetchFn(url, { headers }) -> Response-like { ok, status, headers.get, body (web ReadableStream) }
  constructor({ manifestPath, dir, fetchFn, parallel = 3, retries = 4 }) {
    this.manifest = readJson(manifestPath);
    this.dir = dir;
    this.fetchFn = fetchFn;
    this.parallel = parallel;
    this.retries = retries;
    this.status = { state: 'idle', doneBytes: 0, totalBytes: 0, doneFiles: 0, totalFiles: 0, error: null };
    this.running = null;
    if (this.manifest) {
      this.status.totalFiles = this.manifest.files.length;
      this.status.totalBytes = this.manifest.files.reduce((a, f) => a + f.size, 0);
    }
  }

  get needed() { return !!(this.manifest && this.manifest.files.length); }

  // Quick check on every launch: the right version was finished, and every file is still there at full size.
  ready() {
    if (!this.needed) return true;
    const st = readJson(path.join(this.dir, 'state.json'));
    if (!st || st.version !== this.manifest.version) return false;
    for (const f of this.manifest.files) {
      try { if (fs.statSync(path.join(this.dir, f.name)).size !== f.size) return false; } catch { return false; }
    }
    return true;
  }

  file(name) {
    const f = path.normalize(path.join(this.dir, name));
    return f.startsWith(this.dir + path.sep) && !f.endsWith('.part') && !f.endsWith('state.json') ? f : null;
  }

  start() {
    if (!this.needed) { this.status.state = 'done'; return Promise.resolve(this.status); }
    if (this.running) return this.running;
    this.running = this._run().finally(() => { this.running = null; });
    return this.running;
  }

  async _run() {
    const s = this.status;
    Object.assign(s, { state: 'checking', error: null, doneBytes: 0, doneFiles: 0, fetchedBytes: 0 });
    fs.mkdirSync(this.dir, { recursive: true });
    try { fs.unlinkSync(path.join(this.dir, 'state.json')); } catch {}
    const files = this.manifest.files;
    const keep = new Set(files.map(f => f.name));
    const todo = [];
    for (const f of files) {      // keep what is already here and correct (an earlier try, or the last pack)
      const p = path.join(this.dir, f.name);
      let ok = false;
      try { ok = fs.statSync(p).size === f.size && (await sha256File(p)) === f.sha256; } catch {}
      if (ok) { s.doneBytes += f.size; s.doneFiles++; } else todo.push(f);
    }
    s.state = 'downloading';
    const errors = [];
    let next = 0;
    const worker = async () => {
      while (next < todo.length && !errors.length) {
        const f = todo[next++];
        try { await this._get(f); s.doneFiles++; } catch (e) { errors.push(f.name + ': ' + (e && e.message || e)); }
      }
    };
    await Promise.all(Array.from({ length: Math.min(this.parallel, todo.length) }, worker));
    if (errors.length) { s.state = 'error'; s.error = errors[0]; return s; }
    for (const n of fs.readdirSync(this.dir)) {          // models the new pack no longer uses
      if (!keep.has(n) && n !== 'state.json') try { fs.unlinkSync(path.join(this.dir, n)); } catch {}
    }
    fs.writeFileSync(path.join(this.dir, 'state.json'), JSON.stringify({ version: this.manifest.version, at: new Date().toISOString() }));
    s.state = 'done';
    return s;
  }

  // One file: resume a .part left by an earlier try, check its fingerprint, then put it in place.
  async _get(f) {
    const s = this.status, dest = path.join(this.dir, f.name), part = dest + '.part';
    for (let attempt = 0; ; attempt++) {
      let have = 0;
      try { have = fs.statSync(part).size; } catch {}
      if (have > f.size) { fs.unlinkSync(part); have = 0; }
      s.doneBytes += have;
      let counted = have;
      try {
        if (have < f.size) {
          const res = await this.fetchFn(f.url, { headers: have ? { Range: 'bytes=' + have + '-' } : {} });
          if (!res.ok) throw new Error('HTTP ' + res.status);
          if (have && res.status !== 206) { s.doneBytes -= have; counted = 0; have = 0; }   // server ignored the resume
          const out = fs.createWriteStream(part, { flags: have ? 'a' : 'w' });
          try {
            const reader = res.body.getReader();
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;
              if (!out.write(value)) await new Promise(r => out.once('drain', r));
              s.doneBytes += value.length; s.fetchedBytes += value.length; counted += value.length;
            }
          } finally { await new Promise(r => out.end(r)); }
        }
        const size = fs.statSync(part).size;
        if (size !== f.size || (await sha256File(part)) !== f.sha256) {
          fs.unlinkSync(part);
          throw new Error(size !== f.size ? 'size ' + size + ' of ' + f.size : 'fingerprint did not match');
        }
        fs.renameSync(part, dest);
        return;
      } catch (e) {
        s.doneBytes -= counted;
        if (attempt >= this.retries) throw e;
        await new Promise(r => setTimeout(r, Math.min(15000, 1000 * 2 ** attempt)));
      }
    }
  }
}

module.exports = { Pack, sha256File };
