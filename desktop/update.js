// The Update button: looks on this repo's Releases (free) for a newer Windows build than this one, downloads
// its installer, checks it, and runs it silently over this install; the installer starts the game again.
// Saves are in the profile folder, so they are kept. A newer build that brings a new model pack fetches only
// the models that changed, on its first launch.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const TAG = /^desktop-(\d{8})-(\d+)$/;
const ASSET = /^Alienmon-3D-Setup-.*\.exe$/;
const INSTALLER = 'Alienmon-3D-Setup-' + (() => { try { return require('./package.json').version; } catch { return '1.0.0'; } })() + '.exe';

class Updater {
  // build: { run, tag, repo }; fetchFn like fetch; dir: where to keep the downloaded installer
  constructor({ build, fetchFn, dir }) {
    this.build = build;
    this.fetchFn = fetchFn;
    this.dir = dir;
    this.status = { state: 'idle', current: build.tag || 'local build', latest: null, doneBytes: 0, totalBytes: 0, error: null };
    this.found = null;
    this.checkedAt = 0;
  }

  async check(force) {
    const s = this.status;
    if (s.state === 'downloading' || s.state === 'ready') return s;
    if (!force && this.checkedAt && Date.now() - this.checkedAt < 10 * 60 * 1000) return s;
    s.state = 'checking'; s.error = null;
    try {
      let best;
      try { best = await this.fromApi(); }
      catch (e) { best = await this.fromFeed(); }   // the API allows 60 checks an hour per address; the feed has no such limit
      this.checkedAt = Date.now();
      this.found = best && best.run > (this.build.run || 0) ? best : null;
      s.latest = best ? best.tag : null;
      s.title = this.found ? this.found.title : null;
      s.state = this.found ? 'available' : 'current';
    } catch (e) { s.state = 'offline'; s.error = String(e && e.message || e); }
    return s;
  }

  async fromApi() {
    const res = await this.fetchFn('https://api.github.com/repos/' + this.build.repo + '/releases?per_page=30',
      { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'Alienmon-3D-desktop' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const list = await res.json();
    let best = null;
    for (const r of list) {
      const m = TAG.exec(r.tag_name || '');
      const a = m && !r.draft && (r.assets || []).find(x => ASSET.test(x.name) && x.state !== 'starter');
      if (a && (!best || +m[2] > best.run)) best = { run: +m[2], tag: r.tag_name, title: r.name, url: a.browser_download_url, size: a.size, name: a.name, digest: a.digest || null, date: r.published_at };
    }
    this.source = 'api';
    return best;
  }

  // Fallback: the repo's public release feed. The installer keeps the same file name in every release.
  async fromFeed() {
    const res = await this.fetchFn('https://github.com/' + this.build.repo + '/releases.atom', { headers: { 'User-Agent': 'Alienmon-3D-desktop' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const xml = await res.text();
    let best = null;
    for (const entry of xml.split('<entry>').slice(1)) {
      const t = /\/releases\/tag\/([^"<\s]+)/.exec(entry), m = t && TAG.exec(decodeURIComponent(t[1]));
      if (!m || (best && +m[2] <= best.run)) continue;
      const title = (/<title[^>]*>([^<]*)<\/title>/.exec(entry) || [])[1];
      best = { run: +m[2], tag: m[0], title: title ? title.replace(/&amp;/g, '&') : m[0], name: INSTALLER, size: null, digest: null,
        url: 'https://github.com/' + this.build.repo + '/releases/download/' + m[0] + '/' + INSTALLER };
    }
    this.source = 'feed';
    return best;
  }

  // Download the installer next to the profile folder, resuming an earlier try, and check its size and fingerprint.
  async download() {
    const s = this.status, f = this.found;
    if (!f) throw new Error('No update to download');
    s.state = 'downloading'; s.error = null; s.totalBytes = f.size || 0; s.doneBytes = 0;
    fs.mkdirSync(this.dir, { recursive: true });
    for (const n of fs.readdirSync(this.dir)) if (!n.startsWith(f.tag + '-')) try { fs.unlinkSync(path.join(this.dir, n)); } catch {}
    const dest = path.join(this.dir, f.tag + '-' + f.name), part = dest + '.part';
    try {
      for (let attempt = 0; ; attempt++) {
        let have = 0;
        try { have = fs.statSync(part).size; } catch {}
        if (f.size && have > f.size) { fs.unlinkSync(part); have = 0; }
        if (!f.size) { try { fs.unlinkSync(part); } catch {} have = 0; }   // size unknown (feed): no resume
        s.doneBytes = have;
        try {
          if (!f.size || have < f.size) {
            const res = await this.fetchFn(f.url, { headers: have ? { Range: 'bytes=' + have + '-' } : {} });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            if (have && res.status !== 206) { have = 0; s.doneBytes = 0; }
            if (!f.size) { const n = +res.headers.get('content-length'); if (n) s.totalBytes = n; }
            const out = fs.createWriteStream(part, { flags: have ? 'a' : 'w' });
            try {
              const reader = res.body.getReader();
              for (;;) {
                const { done, value } = await reader.read();
                if (done) break;
                if (!out.write(value)) await new Promise(r => out.once('drain', r));
                s.doneBytes += value.length;
              }
            } finally { await new Promise(r => out.end(r)); }
          }
          const size = fs.statSync(part).size;
          if (f.size ? size !== f.size : (s.totalBytes && size !== s.totalBytes) || size < 1048576) throw new Error('size ' + size + ' of ' + (f.size || s.totalBytes));
          if (f.digest && f.digest.startsWith('sha256:')) {
            const h = crypto.createHash('sha256');
            await new Promise((ok, bad) => fs.createReadStream(part).on('data', d => h.update(d)).on('end', ok).on('error', bad));
            if ('sha256:' + h.digest('hex') !== f.digest) { fs.unlinkSync(part); throw new Error('fingerprint did not match'); }
          }
          fs.renameSync(part, dest);
          break;
        } catch (e) {
          if (attempt >= 4) throw e;
          await new Promise(r => setTimeout(r, Math.min(15000, 1000 * 2 ** attempt)));
        }
      }
    } catch (e) { s.state = 'error'; s.error = String(e && e.message || e); throw e; }
    s.state = 'ready';
    this.installer = dest;
    return dest;
  }
}

module.exports = { Updater, TAG };
