// Alienmon map editor, part two: the Terrain painter (15-piece autotiles) and the Sprite Studio (sheet slicer -> game sprites).
// Loaded after editor.js and uses its globals (S, ED, MAPS, CLIPS, bake, stampRows, panel, draw, toast...).
// Terrain: each built map keeps one vertex grid per terrain layer ((W+1)x(H+1) corners). A tile's look comes from its four
// corners (NW=1, NE=2, SW=4, SE=8), so painting resolves edges, corners, islands and holes by itself (the "dual grid" autotile).
// A tileset is either 'auto' (any texture or map clip, cut by a procedural edge mask) or 'sheet' (a finished 4x4 sheet in that order).
'use strict';
let TILESETS = [], TSIMG = {};
const TSC = {};   // id -> {fill, rim} 256x256 mask sheets (64 px pieces) or {sheet} image
const tsById = id => TILESETS.find(t => t.id === id) || starters().find(t => t.id === id) || kitById(id);

// ---------- starter terrains: drawn in code, ready on every world (never saved; maps keep their id) ----------
function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function texCanvas(paint, seed) {   // a 128 px seamless texture (8 tiles at game scale): whatever crosses an edge is drawn again on the other side
  const N = 128, c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d'), r = rng(seed);
  const wrap = f => { for (const dx of [-N, 0, N]) for (const dy of [-N, 0, N]) { g.save(); g.translate(dx, dy); f(); g.restore(); } };
  paint(g, r, wrap, N); return c;
}
function speck(g, r, wrap, N, n, cols, s0, s1) { for (let i = 0; i < n; i++) { const x = r() * N, y = r() * N, s = s0 + r() * (s1 - s0), c = cols[(r() * cols.length) | 0]; wrap(() => { g.fillStyle = c; g.fillRect(x, y, s, s); }); } }
const texBase = (g, N, c) => { g.fillStyle = c; g.fillRect(0, 0, N, N); };
const TEX = {
  path: (g, r, w, N) => {texBase(g, N, '#a07d55'); speck(g, r, w, N, 900, ['#8d6b46', '#b38f63', '#96734d', '#c09c70'], 1, 3);
    for (let i = 0; i < 40; i++) { const x = r() * N, y = r() * N, a = 1.5 + r() * 2.5; w(() => { g.fillStyle = '#6e5a46'; g.beginPath(); g.ellipse(x, y + 0.8, a, a * 0.7, 0, 0, 6.29); g.fill(); g.fillStyle = '#b9a58e'; g.beginPath(); g.ellipse(x - 0.4, y - 0.3, a * 0.75, a * 0.5, 0, 0, 6.29); g.fill(); }); } },
  road: (g, r, w, N) => {texBase(g, N, '#5d5a62');
    for (let y = 0; y < N; y += 16) { let x = (y / 16) % 2 ? -9 : 0; while (x < N) { const bw = 14 + Math.floor(r() * 8), c = ['#a19ea8', '#938f9b', '#aaa6b0', '#8c8894'][(r() * 4) | 0], X = x, Y = y;
      w(() => { g.fillStyle = '#47444c'; g.beginPath(); g.roundRect(X + 1.5, Y + 2, bw - 3, 13, 4); g.fill(); g.fillStyle = c; g.beginPath(); g.roundRect(X + 1.5, Y + 1.5, bw - 3, 12, 4); g.fill(); g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(X + 4, Y + 3, bw - 9, 2); }); x += bw; } } },
  grass: (g, r, w, N) => {texBase(g, N, '#5f9b45'); speck(g, r, w, N, 1400, ['#4f8a3a', '#6fae52', '#578f40', '#7cbb5c'], 1, 3); speck(g, r, w, N, 14, ['#f7e27a', '#f0a6c8', '#ffffff'], 2, 2.5); },
  tall: (g, r, w, N) => {texBase(g, N, '#2f6a2c'); const bl = [];
    for (let i = 0; i < 900; i++) bl.push([r() * N, r() * N, 5 + r() * 5, (r() - 0.5) * 4, ['#5aa043', '#6cb84f', '#4b8e3b', '#7fca5e', '#3f7f35'][(r() * 5) | 0]]);
    bl.sort((a, b) => a[1] - b[1]); g.lineWidth = 1.6; g.lineCap = 'round';
    for (const [x, y, h, l, c] of bl) w(() => { g.strokeStyle = c; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l * 0.3, y - h * 0.6, x + l, y - h); g.stroke(); }); },
  sand: (g, r, w, N) => {texBase(g, N, '#e0c98f'); speck(g, r, w, N, 1000, ['#d4bb7f', '#ead6a2', '#cdb176'], 1, 2); g.strokeStyle = 'rgba(160,128,78,0.35)'; g.lineWidth = 1.2;
    for (let k = 0; k < 8; k++) { const y0 = k * 16 + r() * 6; g.beginPath(); for (let x = 0; x <= N; x += 2) g.lineTo(x, y0 + 2.5 * Math.sin(6.2832 * x / N * 2 + k)); g.stroke(); } },
  water: (g, r, w, N) => {texBase(g, N, '#3f86c9'); speck(g, r, w, N, 500, ['#3a7dbd', '#4a92d3', '#357abb'], 2, 5); g.lineWidth = 1.5; g.lineCap = 'round';
    for (let i = 0; i < 34; i++) { const x = r() * N, y = r() * N, a = 3 + r() * 5; w(() => { g.strokeStyle = 'rgba(160,215,250,0.75)'; g.beginPath(); g.arc(x, y, a, 3.6, 5.8); g.stroke(); }); } },
  lava: (g, r, w, N) => {texBase(g, N, '#ff7a22'); speck(g, r, w, N, 300, ['#ffb13b', '#ff9a2e'], 2, 4);
    for (let i = 0; i < 26; i++) { const x = r() * N, y = r() * N, a = 7 + r() * 9, pts = Array.from({ length: 7 }, (_, k) => [Math.cos(k * 0.9) * a * (0.7 + r() * 0.4), Math.sin(k * 0.9) * a * (0.6 + r() * 0.4)]);
      w(() => { g.fillStyle = '#5a2a20'; g.beginPath(); pts.forEach(([u, v]) => g.lineTo(x + u, y + v)); g.fill(); g.fillStyle = 'rgba(255,255,255,0.08)'; g.fillRect(x - a / 2, y - a / 3, a / 2, 1.5); }); } },
  rock: (g, r, w, N) => {texBase(g, N, '#7b7480'); speck(g, r, w, N, 900, ['#6d6672', '#8a8390', '#736c78', '#958e9b'], 1, 4); g.strokeStyle = 'rgba(40,34,46,0.6)'; g.lineWidth = 1;
    for (let i = 0; i < 16; i++) { let x = r() * N, y = r() * N; const p = [[x, y]]; for (let k = 0; k < 4; k++) { x += (r() - 0.5) * 14; y += (r() - 0.5) * 14; p.push([x, y]); } w(() => { g.beginPath(); p.forEach(([u, v]) => g.lineTo(u, v)); g.stroke(); }); } },
  snow: (g, r, w, N) => {texBase(g, N, '#eef4fb'); speck(g, r, w, N, 900, ['#dfe9f5', '#ffffff', '#d5e2f0'], 1, 3); },
  hedge: (g, r, w, N) => {texBase(g, N, '#24491f'); for (let i = 0; i < 260; i++) { const x = r() * N, y = r() * N, a = 3 + r() * 5, c = ['#3d7535', '#4a8a40', '#2f5f2a', '#56994a'][(r() * 4) | 0]; w(() => { g.fillStyle = c; g.beginPath(); g.arc(x, y, a, 0, 6.29); g.fill(); }); } },
  wood: (g, r, w, N) => { for (let y = 0; y < N; y += 16) { g.fillStyle = ['#a8743f', '#9b6a38', '#b27c45'][(y / 16) % 3]; g.fillRect(0, y, N, 16); g.fillStyle = '#5e3c1e'; g.fillRect(0, y + 15, N, 1);
      const off = (y / 16) % 2 ? 32 : 0; for (let x = off; x < N + 64; x += 64) g.fillRect(x % N, y, 1, 15); g.fillStyle = 'rgba(0,0,0,0.08)'; for (let k = 0; k < 6; k++) g.fillRect(r() * N, y + 3 + r() * 9, 10 + r() * 20, 1); } },
  tiles: (g, r, w, N) => {texBase(g, N, '#a69d8b'); for (let y = 0; y < N; y += 16) for (let x = 0; x < N; x += 16) { g.fillStyle = (x + y) / 16 % 2 ? '#d9d2c3' : '#cfc7b6'; g.fillRect(x + 1, y + 1, 14, 14); } },
};
let STARTERS = null;
function starters() {   // [id, name, texture, ground, roughness, edge line, edge colour, raised]
  if (STARTERS) return STARTERS;
  STARTERS = [['s_path', 'Dirt path', 'path', '.', 0.45, 0.35, '#5a4128'], ['s_road', 'Stone road', 'road', '.', 0.1, 0.5, '#3a3640'], ['s_grass', 'Short grass', 'grass', '.', 0.6, 0.25, '#2d5a22'],
    ['s_tall', 'Tall grass (wild battles)', 'tall', ',', 0.7, 0.45, '#1d3f1a'], ['s_sand', 'Sand', 'sand', '.', 0.5, 0.25, '#a8884f'], ['s_snow', 'Snow', 'snow', '.', 0.55, 0.2, '#9fb3c8'],
    ['s_water', 'Water (swim with the Bubbub Ride)', 'water', '~', 0.4, 0.6, '#d8c690'], ['s_lava', 'Lava (cross with the Heat Shield)', 'lava', '^', 0.45, 0.6, '#2a1410'],
    ['s_rock', 'Rock / cliff (blocked)', 'rock', '#', 0.35, 0.5, '#2b2630', 1], ['s_hedge', 'Hedge (blocked)', 'hedge', '#', 0.6, 0.4, '#13280f', 1],
    ['s_wood', 'Wood floor (rooms)', 'wood', '.', 0, 0.2, '#3a2412'], ['s_tiles', 'Tiled floor (rooms)', 'tiles', '.', 0, 0.2, '#6d6556']]
    .map(([id, name, k, walk, rough, rim, rimColor, shadow], i) => ({ id, name, kind: 'auto', walk, rough, rim, rimColor, shadow: !!shadow, seed: i * 1.3, texTiles: 8, starter: true, dir: '*', tex: texCanvas(TEX[k], 7 + i * 31) }));
  return STARTERS;
}
// ---------- this world's ground: plain patches found in its own map art, made seamless, so painting blends into the maps ----------
const KIT = {}, KITWAIT = {}, TEXRT = {}, SEAM = {};
const kitGroup = s => ['interior', 'tower'].includes(s.type) ? 'in' : s.type === 'cave' ? 'cave' : 'out';
const kitById = id => { for (const v of Object.values(KIT)) { const t = (v || []).find(t => t.id === id); if (t) return t; } };
function seamless(src, sx, sy, w, h) {   // shift the patch by half (its old edges meet in the middle), then fade the original back in over the middle
  const a = document.createElement('canvas'); a.width = w; a.height = h; const g = a.getContext('2d'); g.drawImage(src, sx, sy, w, h, 0, 0, w, h);
  const o = document.createElement('canvas'); o.width = w; o.height = h; const q = o.getContext('2d'), hw = w >> 1, hh = h >> 1;
  for (const [dx, dy] of [[0, 0], [-w, 0], [0, -h], [-w, -h]]) q.drawImage(a, dx + hw, dy + hh);
  const A = g.getImageData(0, 0, w, h), B = q.getImageData(0, 0, w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const t = Math.min(1, 2.2 * Math.min(Math.min(x, w - 1 - x) / hw, Math.min(y, h - 1 - y) / hh)), p = (y * w + x) * 4;
    for (let c = 0; c < 3; c++) A.data[p + c] = A.data[p + c] * t + B.data[p + c] * (1 - t); A.data[p + 3] = 255; }
  g.putImageData(A, 0, 0); return a;
}
function kitName(walk, [r, g, b], indoor) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), s = mx ? (mx - mn) / mx : 0, v = mx / 255, d = mx - mn || 1;
  const h = mx === mn ? 0 : mx === r ? 60 * (((g - b) / d + 6) % 6) : mx === g ? 60 * ((b - r) / d + 2) : 60 * ((r - g) / d + 4);
  const grey = s < 0.18, green = h >= 65 && h < 170, blue = h >= 170 && h < 270;
  if (walk === ',') return 'Tall grass'; if (walk === '~') return 'Water'; if (walk === '^') return 'Lava';
  if (walk === '#') return indoor ? 'Wall' : grey ? 'Rock' : green ? 'Thicket' : blue ? (v > 0.75 ? 'Ice wall' : s > 0.6 ? 'Deep water' : 'Dense growth') : 'Cliff';
  if (indoor) return 'Floor';
  return grey ? (v > 0.8 ? 'Snow' : 'Stone ground') : green ? 'Grass' : blue ? (v > 0.75 ? 'Snow' : 'Blue ground') : v > 0.62 ? 'Sand path' : 'Dirt path';
}
function fluidMap(s) {   // water and lava tiles of a map: its fluids file (tiles or boxes) plus Walkable edits
  const fl = {}; for (const [k, ch] of [['water', '~'], ['lava', '^']]) { for (const e of (s.fluid || {})[k] || []) if (e.length === 2) fl[tk(e[0], e[1])] = ch; else for (let y = e[1]; y <= e[3]; y++) for (let x = e[0]; x <= e[2]; x++) fl[tk(x, y)] = ch;
    for (const [x, y] of ((DS.ground || {})[s.id] || {})[k] || []) fl[tk(x, y)] = ch; } return fl;
}
function tileStats(px, TW, TH) {   // colour mean and variance of every 16 px tile
  const mean = [], vari = [];
  for (let y = 0; y < TH; y++) for (let x = 0; x < TW; x++) { const s0 = [0, 0, 0], s1 = [0, 0, 0];
    for (let j = 0; j < 16; j++) for (let i = 0; i < 16; i++) { const p = ((y * 16 + j) * TW * 16 + x * 16 + i) * 4; for (let q = 0; q < 3; q++) { s0[q] += px[p + q]; s1[q] += px[p + q] * px[p + q]; } }
    mean[y * TW + x] = s0.map(v => v / 256); vari[y * TW + x] = s1.map((v, q) => v / 256 - (s0[q] / 256) ** 2); }
  return { mean, vari };
}
function winStat({ mean, vari }, TW, x, y, k) {   // a k x k window: low score = even texture without big shapes (plazas, planks) that would show as a repeat
  const M = [0, 0, 0], Q = [0, 0, 0], V = [0, 0, 0], n = k * k;
  for (let yy = y; yy < y + k; yy++) for (let xx = x; xx < x + k; xx++) { const i = yy * TW + xx; for (let q = 0; q < 3; q++) { M[q] += mean[i][q] / n; Q[q] += mean[i][q] ** 2 / n; V[q] += vari[i][q] / n; } }
  const lf = [0, 1, 2].reduce((a, q) => a + Math.sqrt(Math.max(0, Q[q] - M[q] ** 2)), 0) / 3, sd = [0, 1, 2].reduce((a, q) => a + Math.sqrt(Math.max(0, V[q] + Q[q] - M[q] ** 2)), 0) / 3;
  return { M, sd, score: sd * 0.5 + lf * 2 };
}
function worldKit(dir, grp, only) {   // only: just that map's ground; null while the world's map pictures are still loading (the panel redraws when they arrive)
  const key = dir + '|' + grp + '|' + (only || ''); if (KIT[key]) return KIT[key];
  const secs = Object.values(ED.sections).filter(s => s.dir === dir && s.img && kitGroup(s) === grp && !builtMap(s.id) && (!only || s.id === only)), ims = secs.map(s => img(s.img));
  if (ims.some(i => !ok(i))) { if (!KITWAIT[key]) { KITWAIT[key] = 1; Promise.all(ims.map(i => ok(i) ? 0 : new Promise(r => { i.addEventListener('load', r); i.addEventListener('error', r); })))
    .then(() => { delete KITWAIT[key]; if (S.mode === 'terrain') panel(); }); } return null; }
  const cands = [];
  for (const s of secs) { const im = img(s.img), [TW, TH] = s.tiles, c = document.createElement('canvas'); c.width = TW * 16; c.height = TH * 16;
    const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(im, 0, 0, TW * 16, TH * 16); const rows = rowsOf(s.id), fl = fluidMap(s), st = tileStats(g.getImageData(0, 0, TW * 16, TH * 16).data, TW, TH);
    const at = (x, y) => fl[tk(x, y)] || (rows[y] || '')[x];
    for (const k of [5, 4, 3]) for (let y = 1; y + k < TH; y++) for (let x = 1; x + k < TW; x++) {
      const ch = at(x, y); if (!ch || !'.,~^#'.includes(ch)) continue; const m = ch === '.' || ch === '#' ? 1 : 0; let good = true;   // plain ground and blocked fill must sit well inside their area
      for (let yy = y - m; yy < y + k + m && good; yy++) for (let xx = x - m; xx < x + k + m; xx++) if (at(xx, yy) !== ch) { good = false; break; }
      if (!good) continue; const { M, sd, score } = winStat(st, TW, x, y, k);
      if (ch === '#' && sd > 42) continue;   // buildings and big props, not ground
      cands.push({ ch, k, score: score - k * 2, M, s, x, y, c });
    } }
  const out = [], names = {};
  for (const ch of ['.', ',', '~', '^', '#']) { const got = [];
    for (const c of cands.filter(c => c.ch === ch).sort((a, b) => a.score - b.score)) { if (got.length && c.score > got[0].score * 2 + 15) break;
      if (got.every(g => Math.abs(g.M[0] - c.M[0]) + Math.abs(g.M[1] - c.M[1]) + Math.abs(g.M[2] - c.M[2]) > 60)) got.push(c); if (got.length >= 3) break; }
    for (const c of got) { let nm = kitName(ch, c.M, grp === 'in'); names[nm] = (names[nm] || 0) + 1; if (names[nm] > 1) nm += ' ' + names[nm];
      out.push({ id: `k_${c.s.id}_${c.x}_${c.y}_${c.k}`, name: nm, kind: 'auto', walk: ch, rough: 0.55, rim: ch === '.' ? 0 : 0.3, rimColor: '#' + c.M.map(v => Math.round(v * 0.4).toString(16).padStart(2, '0')).join(''), soft: 0.6, shadow: ch === '#', seed: out.length * 1.7, kit: true, src: c.s.name, texTiles: c.k, tex: seamless(c.c, c.x * 16, c.y * 16, c.k * 16, c.k * 16) }); } }
  return (KIT[key] = out);
}
function kitAdopt() {   // a world-ground terrain is saved as one of your terrains the first time it is painted
  const k = S.terr && kitById(S.terr); if (!k) return; const have = TILESETS.find(t => t.from === k.id); if (have) { S.terr = have.id; return; }
  let n = 1; while (tsById('t' + n)) n++;
  const t = { id: 't' + n, name: k.name, kind: 'auto', walk: k.walk, rough: k.rough, rim: k.rim, rimColor: k.rimColor, soft: k.soft, shadow: k.shadow, seed: k.seed, texTiles: k.texTiles, dir: S.planet, from: k.id };
  TILESETS.push(t); TEXRT[t.id] = k.tex; TSIMG[t.id] = k.tex.toDataURL('image/png'); img(TSIMG[t.id]); DIRTY.add('tilesets'); $('#save').classList.add('hot'); S.terr = t.id;
}
const corners = i => [i & 1, (i >> 1) & 1, (i >> 2) & 1, (i >> 3) & 1];   // NW, NE, SW, SE

// ---------- edge masks for 'auto' tilesets ----------
function wobble(u, v, seed) {   // periodic in u and v (period 1), so pieces line up on every side whatever sits next to them
  const p = 6.2832, s = seed || 0;
  return 0.5 * Math.sin(p * (2 * u + v) + s) + 0.3 * Math.sin(p * (3 * v - u) + 1.7 + s) + 0.2 * Math.sin(p * (5 * u + 4 * v) + 4.1 + s);
}
function maskSheets(t) {
  const key = t.rough + '|' + t.rim + '|' + t.seed + '|' + (t.soft || 0); if (TSC[t.id] && TSC[t.id].key === key) return TSC[t.id];
  const N = 64, fill = document.createElement('canvas'), rim = document.createElement('canvas'); fill.width = rim.width = fill.height = rim.height = N * 4;
  const fd = fill.getContext('2d').createImageData(N * 4, N * 4), rd = rim.getContext('2d').createImageData(N * 4, N * 4);
  const amp = (t.rough ?? 0.5) * 0.3, rimW = (t.rim ?? 0.5) * 0.09, soft = t.soft || 0, e = Math.max(1.2 / N, soft * 0.22);   // soft: a wide, grainy fade into the art under it
  for (let i = 1; i < 16; i++) { const [a, b, c, d] = corners(i), X = (i % 4) * N, Y = (i >> 2) * N;
    for (let py = 0; py < N; py++) for (let px = 0; px < N; px++) {
      const u = (px + 0.5) / N, v = (py + 0.5) / N, su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v);
      const f = (a * (1 - su) + b * su) * (1 - sv) + (c * (1 - su) + d * su) * sv, k = f - 0.5 + amp * wobble(u, v, t.seed) * (f > 0.02 && f < 0.98 ? 1 : 0);
      let al = f >= 0.999 ? 1 : f <= 0.001 ? 0 : Math.max(0, Math.min(1, (k + e) / (2 * e)));
      if (soft && al > 0 && al < 1) { const n = Math.sin(px * 12.9898 + py * 78.233 + i * 3.17) * 43758.5453; al = Math.max(0, Math.min(1, al + (n - Math.floor(n) - 0.5) * 0.7 * soft)); }
      const r = rimW > 0 && al > 0 ? Math.max(0, Math.min(1, 1 - (k - e) / rimW)) * al : 0, o = ((Y + py) * N * 4 + X + px) * 4;
      fd.data[o + 3] = Math.round(al * 255); rd.data[o + 3] = Math.round(r * (f >= 0.999 ? 0 : 1) * 255); } }
  fill.getContext('2d').putImageData(fd, 0, 0); rim.getContext('2d').putImageData(rd, 0, 0);
  return (TSC[t.id] = { fill, rim, key });
}
function texOf(t) {   // the texture an auto tileset paints with: a starter's own canvas, a map clip (16 px per tile already) or an uploaded picture
  if (t.tex) return t.tex; if (TEXRT[t.id]) return TEXRT[t.id];
  if (t.clip) { const c = clipById(t.clip), i = c && clipImg(c); if (!ok(i)) return i; return SEAM[c.id] || (SEAM[c.id] = seamless(i, 0, 0, i.naturalWidth, i.naturalHeight)); }   // a clip repeats without a seam
  return img(TSIMG[t.id] || t.url);
}
// draw one terrain layer onto a map canvas (g), W x H tiles, from vertex string v
function layerDraw(g, t, v, W, H) {
  const at = (x, y) => v.charCodeAt(y * (W + 1) + x) === 49, idx = (x, y) => (at(x, y) ? 1 : 0) | (at(x + 1, y) ? 2 : 0) | (at(x, y + 1) ? 4 : 0) | (at(x + 1, y + 1) ? 8 : 0);
  const L = document.createElement('canvas'); L.width = W * 16; L.height = H * 16; const l = L.getContext('2d');
  if (t.kind === 'sheet') { const sh = img(TSIMG[t.id] || t.url); if (!ok(sh)) return; const n = sh.naturalWidth / 4; l.imageSmoothingEnabled = true;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = idx(x, y); if (i) l.drawImage(sh, (i % 4) * n, (i >> 2) * n, n, sh.naturalHeight / 4, x * 16, y * 16, 16, 16); } }
  else { const tex = texOf(t); if (!tex || !(tex.width && !tex.naturalWidth ? tex.width : ok(tex))) return; const M = maskSheets(t), sc = t.clip ? 1 : (t.texTiles || 4) * 16 / (tex.naturalWidth || tex.width);
    const pat = l.createPattern(tex, 'repeat'); if (pat.setTransform) pat.setTransform(new DOMMatrix([sc, 0, 0, sc, 0, 0]));
    l.fillStyle = pat; l.fillRect(0, 0, W * 16, H * 16);
    const mk = document.createElement('canvas'); mk.width = W * 16; mk.height = H * 16; const m = mk.getContext('2d'); m.imageSmoothingEnabled = true;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = idx(x, y); if (i) m.drawImage(M.fill, (i % 4) * 64, (i >> 2) * 64, 64, 64, x * 16, y * 16, 16, 16); }
    l.globalCompositeOperation = 'destination-in'; l.drawImage(mk, 0, 0); l.globalCompositeOperation = 'source-over';
    if (t.rim > 0) { const rk = document.createElement('canvas'); rk.width = W * 16; rk.height = H * 16; const r = rk.getContext('2d'); r.imageSmoothingEnabled = true;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = idx(x, y); if (i && i < 15) r.drawImage(M.rim, (i % 4) * 64, (i >> 2) * 64, 64, 64, x * 16, y * 16, 16, 16); }
      r.globalCompositeOperation = 'source-in'; r.fillStyle = t.rimColor || '#2b2216'; r.fillRect(0, 0, W * 16, H * 16); l.globalAlpha = 0.75; l.drawImage(rk, 0, 0); l.globalAlpha = 1; } }
  if (t.shadow) { g.save(); g.globalAlpha = 0.35; g.filter = 'brightness(0)'; g.drawImage(L, 0, 2); g.restore(); }   // a raised edge (plateaus, hedges)
  g.drawImage(L, 0, 0);
}
function terrTarget(id) { return builtMap(id) || paintTarget(id); }   // a built map, or a finished map with a terrain layer on top (play.js)
function terrBake(id) { if (builtMap(id)) bake(id); else paintBake(id); }
function terrRows(id) { if (builtMap(id)) stampRows(id); else paintRows(id); terrFluids(id); }
function terrainBake(m, g, W, H) { for (const ly of m.terrain || []) { const t = tsById(ly.ts); if (t) layerDraw(g, t, ly.v, W, H); } }
const fluidCh = w => w === '~' || w === '^';
function terrainRows(m, R, W, H) {   // a tile takes its terrain's ground when 3 or 4 of its corners are that terrain (the later layer wins); water and lava are walls the game lets you cross later
  for (const ly of m.terrain || []) { const t = tsById(ly.ts); if (!t || !t.walk) continue; const v = ly.v, at = (x, y) => v.charCodeAt(y * (W + 1) + x) === 49 ? 1 : 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (at(x, y) + at(x + 1, y) + at(x, y + 1) + at(x + 1, y + 1) >= 3) R[y][x] = fluidCh(t.walk) ? '#' : t.walk; }
}
function terrFluids(id) {   // water and lava terrain also count as the game's water and lava (Bubbub Ride, Heat Shield, surf encounters)
  const m = builtMap(id) || (DS.paint || {})[id]; if (!m) return; const [W, H] = sec(id).tiles, now = { water: [], lava: [] }, cell = Array.from({ length: H }, () => Array(W).fill(null));
  for (const ly of m.terrain || []) { const t = tsById(ly.ts); if (!t || !t.walk) continue; const v = ly.v, at = (x, y) => v.charCodeAt(y * (W + 1) + x) === 49 ? 1 : 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (at(x, y) + at(x + 1, y) + at(x, y + 1) + at(x + 1, y + 1) >= 3) cell[y][x] = t.walk; }
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) if (cell[y][x] === '~' || cell[y][x] === '^') now[cell[y][x] === '~' ? 'water' : 'lava'].push([x, y]);
  const g = gnd(id), old = m.fl || { water: [], lava: [] };
  for (const k of ['water', 'lava']) { const drop = new Set(old[k].map(t => tk(...t))), keep = (g[k] || []).filter(t => !drop.has(tk(...t))), have = new Set(keep.map(t => tk(...t)));
    g[k] = keep.concat(now[k].filter(t => !have.has(tk(...t)))); if (!g[k].length) delete g[k]; }
  m.fl = now; if (!now.water.length && !now.lava.length) delete m.fl;
}
function clearManual(m, x0, y0, x1, y1) { if (!m.manual) return; for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) delete m.manual[tk(x, y)]; }   // a newer terrain or stamp wins over an older Walkable edit

// ---------- painting (works on one map or on the whole stitched world: the stroke stays on the map it started on) ----------
function layerFor(m, ts) { const [W, H] = sec(m.id).tiles; m.terrain = m.terrain || []; let ly = m.terrain.find(l => l.ts === ts);
  if (!ly) { ly = { ts, v: '0'.repeat((W + 1) * (H + 1)) }; m.terrain.push(ly); } return ly; }
let TBAKE = 0;
function terrainPaint(wx, wy) {
  const id = S.tsid, m = id && terrTarget(id), t = S.terr; if (!m || (!t && !S.terase)) return; const s = sec(id), [W, H] = s.tiles, [ox, oy] = origin(s), n = S.tbrush || 1;
  const cx = Math.floor((wx - ox) / 16), cy = Math.floor((wy - oy) / 16); if (cx < 0 || cy < 0 || cx >= W || cy >= H) return;
  const x0 = cx - Math.floor((n - 1) / 2), y0 = cy - Math.floor((n - 1) / 2); let hit = false;
  for (const ly of S.terase ? (m.terrain || []) : [layerFor(m, t)]) { const a = ly.v.split(''), ch = S.terase ? '0' : '1';   // the eraser clears every terrain under it
    for (let y = y0; y <= y0 + n; y++) for (let x = x0; x <= x0 + n; x++) if (x >= 0 && y >= 0 && x <= W && y <= H && a[y * (W + 1) + x] !== ch) { a[y * (W + 1) + x] = ch; hit = true; }
    ly.v = a.join(''); }
  if (!hit) return; clearManual(m, x0 - 1, y0 - 1, x0 + n, y0 + n);
  if (!TBAKE) TBAKE = requestAnimationFrame(() => { TBAKE = 0; terrBake(id); });
}
function terrainFill(all) { const id = S.view !== 'outdoor' ? S.view : S.tsid; if (!id) return toast('Open one map from the map list first.'); const m = terrTarget(id); if (!m || !S.terr) return toast('Pick a terrain first.');
  kitAdopt(); const [W, H] = sec(id).tiles; snap(); layerFor(m, S.terr).v = (all ? '1' : '0').repeat((W + 1) * (H + 1)); if (all) delete m.manual; terrBake(id); terrRows(id); panel(); }
function terrainDown(t, wx, wy) {
  if (!S.terr && !S.terase) return toast('Pick a terrain on the right first.');
  kitAdopt(); S.tsid = t.sid; snap(); S.terrPaint = true; terrainPaint(wx, wy);
}
function terrainUp() { if (!S.terrPaint) return; S.terrPaint = false; const id = S.tsid; cancelAnimationFrame(TBAKE); TBAKE = 0; terrBake(id); terrRows(id); panel(); }

// ---------- tileset library ----------
function tsPreview(t, size) {   // a small sample patch: an island with a bay and a hole, so every kind of edge shows
  const v = ['00000000', '01111100', '01101110', '01111110', '00111100', '00000000'].join(''), W = 7, H = 5, n = (size || 32) / 16;
  const c = document.createElement('canvas'); c.width = W * 16; c.height = H * 16; const g = c.getContext('2d'); g.fillStyle = '#6b5b45'; g.fillRect(0, 0, W * 16, H * 16);
  layerDraw(g, t, v, W, H); return c.toDataURL();
}
function addTileset(t) { let k = 1; while (tsById('t' + k)) k++; t.id = 't' + k; t.dir = S.planet; t.seed = t.seed ?? Math.round(Math.random() * 60) / 10; snap(); TILESETS.push(t); DIRTY.add('tilesets'); $('#save').classList.add('hot'); S.terr = t.id; S.terase = false; panel(); toast(`Terrain "${t.name}" is ready: drag on any map to paint it.`, 5000); }
const readFile = f => new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(f); });
function templatePng() {   // the blank 4x4 layout, for drawing a sheet by hand or attaching to an image generator
  const n = 64, c = document.createElement('canvas'); c.width = c.height = n * 4; const g = c.getContext('2d');
  const t = { id: '_tpl', kind: 'auto', rough: 0, rim: 0.4, rimColor: '#1d4a1d' }, solid = document.createElement('canvas'); solid.width = solid.height = 64; solid.getContext('2d').fillStyle = '#4caf50'; solid.getContext('2d').fillRect(0, 0, 64, 64);
  const M = maskSheets(t);
  for (let i = 0; i < 16; i++) { const X = (i % 4) * n, Y = (i >> 2) * n; g.fillStyle = '#9b7a52'; g.fillRect(X, Y, n, n);
    const p = document.createElement('canvas'); p.width = p.height = n; const pg = p.getContext('2d'); pg.fillStyle = '#4caf50'; pg.fillRect(0, 0, n, n); pg.globalCompositeOperation = 'destination-in'; pg.drawImage(M.fill, X, Y, n, n, 0, 0, n, n);
    g.drawImage(p, X, Y); g.strokeStyle = '#000'; g.strokeRect(X + 0.5, Y + 0.5, n - 1, n - 1); g.fillStyle = '#fff'; g.font = '10px monospace'; g.fillText(String(i), X + 3, Y + 11); }
  const a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = 'alienmon_terrain_template.png'; a.click();
}
const PROMPTS = {
  texture: name => `Seamless tileable top-down ground texture for a cozy 2D monster-collecting RPG: ${name || 'mossy alien grass'}. Painted, soft shading, readable from above, even lighting with no shadows cast across it, no objects, no text, no emblems. Square image, the left edge must continue into the right edge and the top into the bottom. Match the colours and brushwork of the attached Alienmon map.`,
  sheet: name => `Make a top-down terrain autotile sheet for a 2D RPG, ${name || 'alien grass on dirt'}. Use the attached template exactly: a 1024x1024 image, a 4x4 grid of square pieces, every piece in the same place as the template. Green in the template = the new terrain, brown = see-through (transparent background). Keep the outline of every piece exactly as the template so pieces join. Painted Alienmon style, no text, no numbers, no emblems.`,
  char: name => `Sprite sheet for a top-down 2D RPG character: ${name || 'a young alien mechanic'}. 3 columns x 4 rows on a plain flat magenta (#ff00ff) background, every frame the same size and evenly spaced. Rows top to bottom: walking toward the camera (down), walking left, walking right, walking away (up). Columns: standing still, left foot forward, right foot forward. Whole body in every frame, feet on the same line, same height in every frame, chibi proportions (big head), soft painted Alienmon style matching the attached sprite. No text, no emblems, no ball-shaped logos.`,
  props: name => `Sheet of separate top-down 2D RPG props for an alien town: ${name || 'lamps, crates, planters, signposts'}. Each object on its own with plenty of empty space around it, on a plain flat magenta (#ff00ff) background, three-quarter top-down view like the attached map, soft painted Alienmon style, consistent lighting from the top left. No text, no emblems, no ball-shaped logos.`,
};
function copyPrompt(k) { const name = ($('#pname2') || {}).value || ''; const t = PROMPTS[k](name); navigator.clipboard ? navigator.clipboard.writeText(t).then(() => toast('Prompt copied. Paste it into ChatGPT with a reference picture.'), () => prompt('Copy this prompt:', t)) : prompt('Copy this prompt:', t); }

const how = li => `<details class="how" ${phone() ? '' : 'open'}><summary>How it works</summary><ol class="steps">${li}</ol></details>`;
const GROUNDS = [['.', 'walkable'], [',', 'tall grass (wild battles)'], ['~', 'water (swim with the Bubbub Ride)'], ['^', 'lava (cross with the Heat Shield)'], ['#', 'blocked (cliff, hedge, wall)'], ['', 'looks only (keeps the ground under it)']];
const groundName = w => (GROUNDS.find(g => g[0] === (w || '')) || GROUNDS[0])[1];
function terrainPanel() {
  const one = S.view !== 'outdoor', m = one && (builtMap(S.view) || DS.paint[S.view]), cur = S.terr && tsById(S.terr);
  const grp = one && sec(S.view) ? kitGroup(sec(S.view)) : 'out', own = one && !builtMap(S.view) ? worldKit(S.planet, grp, S.view) : null, kit = worldKit(S.planet, grp), hid = new Set(DS.kitHide || []);
  const ownShown = (own || []).filter(t => !hid.has(t.id)), shown = (kit || []).filter(t => !hid.has(t.id) && !ownShown.some(o => o.src === t.src && o.walk === t.walk)), allKit = ownShown.concat(shown);
  const mine = TILESETS.filter(t => (S.tsAll || t.dir === S.planet) && !allKit.some(k => k.id === t.from)), isOn = t => !S.terase && (S.terr === t.id || (cur && cur.from === t.id));
  const pal = t => `<button class="pal ${isOn(t) ? 'on' : ''}" data-ts="${t.id}" data-cap="${esc(t.name)} · ${groundName(t.walk)}" title="${esc(t.name)}"><img src="${tsPreview(t, 24)}"><small>${esc(t.name.split(' (')[0])}</small></button>`;
  return `<div id="preview"><div class="box" id="pbox">${cur ? `<img src="${tsPreview(cur, 48)}">` : ''}</div><div class="cap" id="pcap">${cur ? `${esc(cur.name)} · ${groundName(cur.walk)}` : 'Pick a terrain to see it'}</div></div>
  <div class="row"><button class="tool ${!S.terase ? 'on' : ''}" id="tpaint">&#128396; Paint</button><button class="tool ${S.terase ? 'on' : ''}" id="terase">&#9003; Eraser</button>
    <span class="hint">Brush</span>${[1, 2, 3, 5].map(n => `<button class="tool ${(S.tbrush || 1) === n ? 'on' : ''}" data-tb="${n}">${n}</button>`).join('')}</div>
  ${one ? `<div class="row" style="margin-top:6px"><button id="tfill" ${cur ? '' : 'disabled'}>Fill this whole map${cur ? ' with ' + esc(cur.name.split(' (')[0]) : ''}</button><button id="tclear" ${cur ? '' : 'disabled'}>Remove it from this map</button></div>` : ''}
  ${m && (m.terrain || []).length > 1 ? `<div class="hint">On this map, bottom to top: ${m.terrain.map((l, i) => `<button data-tup="${i}" title="Move up a layer">${esc((tsById(l.ts) || {}).name || l.ts)} ${i ? '&#8593;' : ''}</button>`).join(' ')}</div>` : ''}
  ${one && !builtMap(S.view) ? '<p class="hint">Finished maps keep their picture: terrain goes on a see-through layer on top.</p>' : ''}
  ${how('<li>Pick a terrain below.</li><li>Press and drag on any map to paint it. Edges and corners join up by themselves.</li><li>The ground follows the terrain: paths are walkable, tall grass starts wild battles, water and lava block the way until the player has the gear.</li>')}
  ${own ? `<h4>This map's ground</h4><p class="hint">Cut from ${esc(sec(S.view).name)} itself, so it matches exactly.</p><div class="grid">${ownShown.map(pal).join('') || '<div class="hint">No plain patch big enough on this map.</div>'}</div>` : ''}
  <h4>${own ? 'More from this world' : "This world's ground"}</h4><p class="hint">Cut from ${esc(ED.planets[S.planet] || 'this world')}'s own maps, so it matches. Edges fade into the art under them.</p>
  <div class="grid">${!kit ? '<div class="hint">Looking through this world\'s maps&hellip;</div>' : shown.map(pal).join('') || '<div class="hint">No plain ground found here. Use Copy ground from a map below.</div>'}</div>
  ${(kit || []).concat(own || []).some(t => hid.has(t.id)) ? '<button id="kitshow">Show the ones I hid</button>' : ''}
  <h4>Your terrains</h4><div class="grid">${mine.map(pal).join('') || '<div class="hint">None yet. Copy ground from a map below, or turn a clip (a mountain, a cliff edge) into one.</div>'}</div>
  <label class="row"><input type="checkbox" id="tsall" ${S.tsAll ? 'checked' : ''}> show terrains made on every world</label>
  <details class="how" ${cur && cur.starter ? 'open' : ''}><summary>Plain drawn terrains (don't match the map art)</summary><div class="grid">${starters().map(pal).join('')}</div></details>
  ${cur ? `<div class="sel" style="margin-top:8px"><b>${esc(cur.name)}</b>
    ${cur.kit ? `<div class="hint">Cut from ${esc(cur.src)}. Ground: ${groundName(cur.walk)}. It's saved as one of your terrains when you first paint with it.</div><button id="kithide">Hide this one</button>` : cur.starter ? `<div class="hint">Ground: ${groundName(cur.walk)}. Starter terrains can't be changed.</div><button id="tcopy">Make my own copy to change</button>` : `
    <label>Name <input id="tsrename" value="${esc(cur.name)}"></label>
    <label>Ground <select id="tswalk">${GROUNDS.map(([v, n]) => `<option value="${v}" ${(cur.walk || '') === v ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
    ${cur.kind === 'auto' ? `<label>Edge roughness <input type="range" id="tsrough" min="0" max="1" step="0.05" value="${cur.rough ?? 0.5}"></label>
    <label>Edge line <input type="range" id="tsrim" min="0" max="1" step="0.05" value="${cur.rim ?? 0.5}"></label><label>Edge colour <input type="color" id="tsrimc" value="${cur.rimColor || '#2b2216'}"></label>
    <label>Edge blend (fade into the map) <input type="range" id="tssoft" min="0" max="1" step="0.05" value="${cur.soft || 0}"></label>
    ${cur.clip ? '' : `<label>Texture size, tiles <input type="number" id="tstex" min="1" max="16" value="${cur.texTiles || 4}"></label>`}
    <button id="tsseed">New edge shape</button>` : ''}
    <label class="row"><input type="checkbox" id="tsshadow" ${cur.shadow ? 'checked' : ''}> raised (drop shadow under the edge)</label>
    <button id="tsrm">Delete terrain</button>`}</div>` : ''}
  <h3>Make your own terrain</h3>
  <div class="row"><button id="tsample" class="${S.tsample ? 'on' : ''}">&#9986; Copy ground from a map</button></div>
  <p class="hint">${S.tsample ? '<b>Now drag a box over a patch of plain ground on the map</b> (grass, a road, sand). It becomes a terrain that matches the art.' : 'Want a ground that isn\'t in the list? Drag a box over it on any map (grass, a road, a mountain side) and it becomes a terrain.'}</p>
  <label>Name <input id="tsname" placeholder="e.g. Moss, Shallow water"></label>
  <label>Ground <select id="tsnwalk">${GROUNDS.map(([v, n]) => `<option value="${v}">${n}</option>`).join('')}</select></label>
  <div class="hint"><b>From a seamless picture</b> (ChatGPT, SpriteCook or your own):</div><input type="file" id="tstexf" accept="image/*">
  <div class="hint"><b>From a finished 4x4 sheet</b> drawn to the template layout:</div><input type="file" id="tssheetf" accept="image/*">
  <div class="row" style="margin-top:8px"><button id="tstpl">Download blank template</button><button data-prompt="texture">Copy texture prompt</button><button data-prompt="sheet">Copy sheet prompt</button></div>`;
}
function terrainWire() {
  const on = (sel, ev, f) => { const el = $(sel); if (el) el.addEventListener(ev, f); }, cur = () => tsById(S.terr);
  const redo = () => { DIRTY.add('tilesets'); $('#save').classList.add('hot'); for (const m of MAPS.filter(m => m.built).concat(Object.values(DS.paint || {}))) if ((m.terrain || []).some(l => l.ts === S.terr)) { terrBake(m.id); terrRows(m.id); } };
  document.querySelectorAll('[data-ts]').forEach(b => b.onclick = () => { S.terr = b.dataset.ts; S.terase = false; S.tsample = false; panel(); });
  document.querySelectorAll('[data-tb]').forEach(b => b.onclick = () => { S.tbrush = +b.dataset.tb; panel(); });
  document.querySelectorAll('[data-tup]').forEach(b => b.onclick = () => { const m = terrTarget(S.view), i = +b.dataset.tup; if (!i) return; snap(); [m.terrain[i - 1], m.terrain[i]] = [m.terrain[i], m.terrain[i - 1]]; terrBake(m.id); terrRows(m.id); panel(); });
  document.querySelectorAll('[data-prompt]').forEach(b => b.onclick = () => copyPrompt(b.dataset.prompt));
  on('#tpaint', 'click', () => { S.terase = false; panel(); }); on('#terase', 'click', () => { S.terase = true; S.tsample = false; panel(); });
  on('#tfill', 'click', () => terrainFill(true)); on('#tclear', 'click', () => terrainFill(false));
  on('#tsall', 'change', e => { S.tsAll = e.target.checked; panel(); });
  on('#tcopy', 'click', () => { const c = cur(), t = { name: c.name.replace(/ \(.*/, '') + ' (my copy)', kind: 'auto', walk: c.walk, rough: c.rough, rim: c.rim, rimColor: c.rimColor, shadow: c.shadow, seed: c.seed, texTiles: 8 }; addTileset(t); TSIMG[t.id] = c.tex.toDataURL('image/png'); img(TSIMG[t.id]); panel(); });
  on('#tsrename', 'change', e => { snap(); cur().name = e.target.value.trim() || cur().name; DIRTY.add('tilesets'); $('#save').classList.add('hot'); panel(); });
  on('#tswalk', 'change', e => { snap(); cur().walk = e.target.value; redo(); panel(); });
  on('#tsrough', 'change', e => { cur().rough = +e.target.value; redo(); panel(); }); on('#tsrim', 'change', e => { cur().rim = +e.target.value; redo(); panel(); });
  on('#tsrimc', 'change', e => { cur().rimColor = e.target.value; redo(); panel(); }); on('#tstex', 'change', e => { cur().texTiles = Math.max(1, Math.min(16, +e.target.value || 4)); redo(); panel(); });
  on('#tsseed', 'click', () => { cur().seed = Math.round(Math.random() * 60) / 10; redo(); panel(); });
  on('#tssoft', 'change', e => { cur().soft = +e.target.value; redo(); panel(); });
  on('#kithide', 'click', () => { snap(); DS.kitHide = [...(DS.kitHide || []), S.terr]; S.terr = null; DIRTY.add('design'); $('#save').classList.add('hot'); panel(); });
  on('#kitshow', 'click', () => { snap(); DS.kitHide = []; DIRTY.add('design'); $('#save').classList.add('hot'); panel(); });
  on('#tsshadow', 'change', e => { cur().shadow = e.target.checked; redo(); panel(); });
  on('#tsrm', 'click', () => { if (MAPS.filter(m => m.built).concat(Object.values(DS.paint || {})).some(m => (m.terrain || []).some(l => l.ts === S.terr))) return toast('That terrain is painted on a map; remove it there first.'); snap(); TILESETS = TILESETS.filter(t => t.id !== S.terr); DIRTY.add('tilesets'); S.terr = null; panel(); });
  on('#tsample', 'click', () => { S.tsample = !S.tsample; S.terase = false; panel(); if (S.tsample) toast('Drag a box over plain ground on the map.', 5000); });
  const base = () => ({ name: ($('#tsname').value || '').trim() || 'Terrain', walk: $('#tsnwalk').value });
  on('#tstexf', 'change', async e => { const f = e.target.files[0]; if (!f) return; const u = await readFile(f), t = { ...base(), kind: 'auto', rough: 0.5, rim: 0.4, rimColor: '#2b2216', texTiles: 4 };
    addTileset(t); TSIMG[t.id] = await squash(u, 512); img(TSIMG[t.id]); panel(); });
  on('#tssheetf', 'change', async e => { const f = e.target.files[0]; if (!f) return; const u = await readFile(f), t = { ...base(), kind: 'sheet' };
    addTileset(t); TSIMG[t.id] = await squash(u, 512, true); img(TSIMG[t.id]); panel(); });
  on('#tstpl', 'click', templatePng);
}
function terrainFromClip(c) {   // "Copy ground from a map": the boxed patch becomes a terrain whose ground is what most of the patch was
  const all = c.rows.join(''), cnt = ch => all.split(ch).length - 1, walk = cnt(',') > all.length / 2 ? ',' : cnt('#') > all.length / 2 ? '#' : '.';
  addTileset({ name: c.name, walk, kind: 'auto', clip: c.id, rough: 0.55, rim: 0, soft: 0.6, shadow: walk === '#', rimColor: '#2b2216' }); S.tsample = false; panel();
}
function squash(url, max, keyBg) {   // keep saves small: at most max px, PNG; sheets on a flat background get it keyed out
  return new Promise(r => { const i = new Image(); i.onload = () => { const s = Math.min(1, max / Math.max(i.width, i.height)), c = document.createElement('canvas'); c.width = Math.round(i.width * s); c.height = Math.round(i.height * s);
    const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(i, 0, 0, c.width, c.height); if (keyBg) keyOut(c, 40); r(c.toDataURL('image/png')); }; i.src = url; });
}

// ---------- Sprite Studio ----------
const SP = { src: null, kind: 'char', cols: 3, rows: 4, order: 'down,left,right,up', tol: 40, px: 1, mirror: false, fps: 6, name: '', tiles: 2, frames: null, items: null };
let SPRITES = [];   // what this session made: {kind:'char', name, files:{rel:dataURL}} or {kind:'prop', sheet, n, url, px}
function keyOut(c, tol) {   // flat background (sampled at the corners) -> transparent; leaves sheets that already have alpha alone
  const g = c.getContext('2d'), d = g.getImageData(0, 0, c.width, c.height), a = d.data, W = c.width, H = c.height;
  if ([0, W - 1, (H - 1) * W, H * W - 1].some(p => a[p * 4 + 3] < 250)) return;
  const bg = [0, W - 1, (H - 1) * W, H * W - 1].map(p => [a[p * 4], a[p * 4 + 1], a[p * 4 + 2]]).sort((x, y) => (x[0] + x[1] + x[2]) - (y[0] + y[1] + y[2]))[1];
  const seen = new Uint8Array(W * H), st = [0, W - 1, (H - 1) * W, H * W - 1], near = p => Math.abs(a[p * 4] - bg[0]) + Math.abs(a[p * 4 + 1] - bg[1]) + Math.abs(a[p * 4 + 2] - bg[2]) <= tol * 3;
  while (st.length) { const p = st.pop(); if (seen[p] || !near(p)) continue; seen[p] = 1; a[p * 4 + 3] = 0; const x = p % W;   // flood from the corners, so the same colour inside a sprite stays
    if (x > 0) st.push(p - 1); if (x < W - 1) st.push(p + 1); if (p >= W) st.push(p - W); if (p < W * (H - 1)) st.push(p + W); }
  for (let p = 0; p < W * H; p++) if (!seen[p] && a[p * 4 + 3] && near(p)) { const x = p % W, y = (p / W) | 0;   // soften the fringe left by anti-aliasing
    if ((x && seen[p - 1]) || (x < W - 1 && seen[p + 1]) || (y && seen[p - W]) || (y < H - 1 && seen[p + W])) a[p * 4 + 3] = 90; }
  g.putImageData(d, 0, 0);
}
function detectPixel(c) {   // AI "pixel art" is often blurry and off-grid: blocky art changes colour only every k pixels, so the
  const W = c.width, H = c.height, a = c.getContext('2d').getImageData(0, 0, W, H).data;   // change signal repeats at lag k but not at lag 1
  const dif = (p, q) => Math.abs(a[p] - a[q]) + Math.abs(a[p + 1] - a[q + 1]) + Math.abs(a[p + 2] - a[q + 2]), corr = new Float64Array(17);
  for (let y = 0; y < H; y += 3) { const row = new Float32Array(W); for (let x = 1; x < W; x++) row[x] = dif((y * W + x) * 4, (y * W + x - 1) * 4);
    for (let k = 1; k <= 16; k++) for (let x = 1; x + k < W; x++) corr[k] += row[x] * row[x + k]; }
  for (let x = 0; x < W; x += 3) { const col = new Float32Array(H); for (let y = 1; y < H; y++) col[y] = dif((y * W + x) * 4, ((y - 1) * W + x) * 4);
    for (let k = 1; k <= 16; k++) for (let y = 1; y + k < H; y++) corr[k] += col[y] * col[y + k]; }
  let top = 0; for (let k = 2; k <= 16; k++) top = Math.max(top, corr[k]);
  if (top < corr[1] * 1.5) return 1;   // smooth painted art: neighbouring pixels change together
  for (let k = 2; k <= 16; k++) if (corr[k] >= top * 0.8) return k;
  return 1;
}
function pixelSnap(c, k) { if (k < 2) return c; const w = Math.round(c.width / k), h = Math.round(c.height / k), s = document.createElement('canvas'); s.width = w; s.height = h;
  const g = s.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(c, 0, 0, w, h); const o = document.createElement('canvas'); o.width = w * k; o.height = h * k;
  const og = o.getContext('2d'); og.imageSmoothingEnabled = false; og.drawImage(s, 0, 0, w * k, h * k); return o; }
function bboxOf(c, x0 = 0, y0 = 0, w = c.width, h = c.height) { const a = c.getContext('2d').getImageData(x0, y0, w, h).data; let l = w, t = h, r = -1, b = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (a[(y * w + x) * 4 + 3] > 40) { if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y; }
  return r < 0 ? null : [x0 + l, y0 + t, r - l + 1, b - t + 1]; }
function spPrepare() {   // source picture -> keyed, grid-snapped working canvas
  const i = img(SP.src); if (!ok(i)) return null; const c = document.createElement('canvas'); c.width = i.naturalWidth; c.height = i.naturalHeight; c.getContext('2d').drawImage(i, 0, 0);
  keyOut(c, SP.tol); return pixelSnap(c, SP.px);
}
function spCut() {
  const c = spPrepare(); if (!c) return; SP.work = c;
  if (SP.kind === 'char') { const fw = c.width / SP.cols, fh = c.height / SP.rows, dirs = SP.order.split(','), F = {};
    const pick = SP.cols >= 4 ? [0, 1, 3] : SP.cols === 3 ? [0, 1, 2] : SP.cols === 2 ? [0, 1, 1] : [0, 0, 0];   // stand, step 1, step 2
    let tall = 1; const boxes = {};
    dirs.forEach((d, r) => { if (r >= SP.rows) return; boxes[d] = pick.map(col => bboxOf(c, Math.round(col * fw), Math.round(r * fh), Math.round(fw), Math.round(fh))); for (const b of boxes[d]) if (b) tall = Math.max(tall, b[3]); });
    const scale = 46 / tall;   // one scale for every frame, so the figure never grows or shrinks between steps
    for (const d of ['down', 'up', 'left', 'right']) { let use = boxes[d], flip = false; const empty = u => !u || u.every(b => !b);
      if (d === 'right' && (SP.mirror || empty(use)) && !empty(boxes.left)) { use = boxes.left; flip = true; } if (empty(use)) continue;
      F[d] = use.map(b => { const o = document.createElement('canvas'); o.width = o.height = 48; if (!b) return o; const g = o.getContext('2d'); g.imageSmoothingEnabled = SP.px < 2; g.imageSmoothingQuality = 'high';
        const w = b[2] * scale, h = b[3] * scale; if (flip) { g.translate(48, 0); g.scale(-1, 1); } g.drawImage(c, b[0], b[1], b[2], b[3], Math.round(24 - w / 2), Math.round(47 - h), Math.round(w), Math.round(h)); return o; }); }
    SP.frames = F; SP.items = null;
  } else {   // props: every separate object (opaque blobs, merging pieces closer than a few pixels)
    const W = c.width, H = c.height, a = c.getContext('2d').getImageData(0, 0, W, H).data, lab = new Int32Array(W * H), out = []; let n = 0;
    for (let p = 0; p < W * H; p++) { if (lab[p] || a[p * 4 + 3] <= 40) continue; n++; const st = [p]; let l = W, t = H, r = 0, b = 0, cnt = 0; lab[p] = n;
      while (st.length) { const q = st.pop(), x = q % W, y = (q / W) | 0; cnt++; if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y;
        for (const z of [q - 1, q + 1, q - W, q + W]) if (z >= 0 && z < W * H && !lab[z] && a[z * 4 + 3] > 40 && Math.abs((z % W) - x) <= 1) { lab[z] = n; st.push(z); } }
      if (cnt > 30) out.push([l, t, r - l + 1, b - t + 1]); }
    const gap = Math.max(4, Math.round(Math.max(W, H) / 120)), near = (A, B) => A[0] - gap < B[0] + B[2] && B[0] - gap < A[0] + A[2] && A[1] - gap < B[1] + B[3] && B[1] - gap < A[1] + A[3];
    for (let merged = true; merged;) { merged = false; for (let i = 0; i < out.length && !merged; i++) for (let j = i + 1; j < out.length; j++) if (near(out[i], out[j])) {
      const A = out[i], B = out[j], l = Math.min(A[0], B[0]), t = Math.min(A[1], B[1]); out[i] = [l, t, Math.max(A[0] + A[2], B[0] + B[2]) - l, Math.max(A[1] + A[3], B[1] + B[3]) - t]; out.splice(j, 1); merged = true; break; } }
    out.sort((A, B) => (A[1] - B[1]) || (A[0] - B[0])); const big = out.filter(b => b[2] * b[3] > Math.max(64, W * H / 4000));
    SP.items = big.map(b => ({ b, on: true })); SP.frames = null;
  }
}
function spRows(items) {   // reading order by rows of the sheet, even when the things in a row have different heights
  const hs = items.map(x => x.b[3]).sort((a, b) => a - b), gap = (hs[hs.length >> 1] || 16) * 0.6, rows = [];
  for (const x of items.slice().sort((a, b) => (a.b[1] + a.b[3] / 2) - (b.b[1] + b.b[3] / 2))) { const cy = x.b[1] + x.b[3] / 2, r = rows[rows.length - 1]; if (r && cy - r.cy < gap) r.l.push(x); else rows.push({ cy, l: [x] }); }
  return rows.flatMap(r => r.l.sort((a, b) => a.b[0] - b.b[0]));
}
function propCanvas(b) {   // one cut prop at game scale: the first (top-left) item is SP.tiles tiles wide, the rest keep their size relative to it
  const ref = SP.items[0].b, k = SP.tiles * 16 / ref[2], w = Math.max(4, Math.round(b[2] * k)), h = Math.max(4, Math.round(b[3] * k)), o = document.createElement('canvas'); o.width = w; o.height = h;
  const g = o.getContext('2d'); g.imageSmoothingEnabled = SP.px < 2; g.imageSmoothingQuality = 'high'; g.drawImage(SP.work, b[0], b[1], b[2], b[3], 0, 0, w, h); return o;
}
let SPT = 0;
function spAnimate() {   // walk all four directions in place, at map size and big, on a ground tile
  cancelAnimationFrame(SPT); const cv2 = $('#spcv'); if (!cv2 || !SP.frames) return; const g = cv2.getContext('2d'), seq = [0, 1, 0, 2]; let last = 0, f = 0;
  const tick = t => { if (!document.body.contains(cv2)) return; if (t - last > 1000 / SP.fps) { last = t; f = (f + 1) % 4;
      g.fillStyle = '#6f8f4e'; g.fillRect(0, 0, cv2.width, cv2.height); g.imageSmoothingEnabled = false;
      ['down', 'left', 'right', 'up'].forEach((d, i) => { const fr = SP.frames[d]; if (!fr) return; const im = fr[seq[f]];
        g.drawImage(im, 10 + i * 100, 6, 96, 96); g.drawImage(im, 34 + i * 100, 112, 24, 24); g.fillStyle = '#fff'; g.font = '11px sans-serif'; g.fillText(d, 40 + i * 100, 150); g.fillStyle = '#6f8f4e'; });
    } SPT = requestAnimationFrame(tick); };
  SPT = requestAnimationFrame(tick);
}
function spritesPanel() {
  const fr = SP.frames, it = SP.items, taken = SP.name && (ED.chars[SP.name] || SPRITES.some(s => s.name === SP.name));
  return `<h3>Sprite Studio</h3><p class="hint">Turn a generated sprite sheet into game-ready sprites: the background comes off, blurry AI pixels snap to a clean grid, frames are cut, sized and lined up on the same feet line, and you watch the walk cycle before adding it.</p>
  <div class="row"><button class="tool ${SP.kind === 'char' ? 'on' : ''}" data-spk="char">Character walk sheet</button><button class="tool ${SP.kind === 'props' ? 'on' : ''}" data-spk="props">Props sheet</button></div>
  <label>Sheet picture <input type="file" id="spfile" accept="image/png,image/webp,image/jpeg"></label>
  <label>Background removal strength <input type="range" id="sptol" min="0" max="120" value="${SP.tol}"></label>
  <div class="row"><label>Pixel size <input type="number" id="sppx" min="1" max="16" value="${SP.px}" style="width:64px"></label><button id="spdetect">Detect pixel grid</button><span class="hint">1 = painted art (no snapping)</span></div>
  ${SP.kind === 'char' ? `<div class="row"><label>Columns <input type="number" id="spcols" min="1" max="8" value="${SP.cols}" style="width:60px"></label><label>Rows <input type="number" id="sprows" min="1" max="8" value="${SP.rows}" style="width:60px"></label></div>
    <label>Rows, top to bottom <select id="sporder">${['down,left,right,up', 'down,up,left,right', 'down,right,left,up', 'up,right,down,left', 'down,left,up,right'].map(o => `<option ${SP.order === o ? 'selected' : ''}>${o}</option>`).join('')}</select></label>
    <label class="row"><input type="checkbox" id="spmirror" ${SP.mirror ? 'checked' : ''}> right = the left row flipped</label>
    <div class="hint">Columns: 3 = stand, step, step. 4 = stand, step, stand, step. Missing rows are skipped (a missing right row is flipped from left).</div>` :
    `<label>The first item (top left) is this many tiles wide <input type="number" id="sptiles" min="1" max="8" step="0.5" value="${SP.tiles}"></label>
    <label class="row"><input type="checkbox" id="spturn" ${SP.turn ? 'checked' : ''}> turn sheet: each row shows one object four times (facing down, up, left, right), so Turn can switch between them</label>`}
  <div class="row" style="margin-top:6px"><button id="spcut">Cut the sheet</button></div>
  ${fr ? `<canvas id="spcv" width="410" height="156" style="width:100%;max-width:410px;border-radius:8px;margin-top:8px;image-rendering:pixelated"></canvas>
    <label>Speed <input type="range" id="spfps" min="2" max="14" value="${SP.fps}"></label>
    <label>Name (lowercase, no spaces) <input id="spname" value="${SP.name}" placeholder="e.g. ferrox_welder"></label>${taken ? '<div class="bad">That name is taken: a new name keeps the old sprite.</div>' : ''}
    <button id="spaddc">Add to People</button><div class="hint">Saved as the game's walking sprite: down, up, left and right, each with two steps (48x48, feet on the bottom line).</div>` : ''}
  ${it ? `<div class="hint">${it.length} items found. Untick any you don't want.</div><div class="grid">${it.map((x, i) => `<button class="pal ${x.on ? 'on' : ''}" data-spi="${i}" data-cap="item ${i + 1} · ${Math.round(x.b[2] * SP.tiles * 16 / it[0].b[2])}×${Math.round(x.b[3] * SP.tiles * 16 / it[0].b[2])} px in game"><img src="${propCanvas(x.b).toDataURL()}"></button>`).join('')}</div>
    <button id="spaddp" style="margin-top:6px">Add ticked items to Props (sheet ${S.planet}_studio)</button>` : ''}
  <h3>Prompts for the picture</h3><label>What to draw <input id="pname2" placeholder="e.g. a Ferrox scrap welder with goggles"></label>
  <div class="row"><button data-prompt="char">Copy character sheet prompt</button><button data-prompt="props">Copy props sheet prompt</button></div>
  <p class="hint">Attach an Alienmon sprite or a map picture as the style reference. Magenta backgrounds come off cleanly. Check every result for ball-shaped emblems before adding it.</p>
  ${SPRITES.length ? '<h3>Made this session</h3>' + SPRITES.map(s => `<div>${s.kind === 'char' ? 'Person: ' + s.name : 'Prop: ' + s.sheet + '/' + String(s.n).padStart(2, '0')}</div>`).join('') : ''}`;
}
function spritesWire() {
  const on = (sel, ev, f) => { const el = $(sel); if (el) el.addEventListener(ev, f); }, re = () => { if (SP.src) spCut(); panel(); };
  document.querySelectorAll('[data-spk]').forEach(b => b.onclick = () => { SP.kind = b.dataset.spk; SP.frames = SP.items = null; re(); });
  document.querySelectorAll('[data-prompt]').forEach(b => b.onclick = () => copyPrompt(b.dataset.prompt));
  document.querySelectorAll('[data-spi]').forEach(b => b.onclick = () => { const x = SP.items[+b.dataset.spi]; x.on = !x.on; panel(); });
  on('#spfile', 'change', async e => { const f = e.target.files[0]; if (!f) return; SP.src = await readFile(f); const i = img(SP.src); i.onload = () => { spCut(); panel(); }; });
  on('#sptol', 'change', e => { SP.tol = +e.target.value; re(); }); on('#sppx', 'change', e => { SP.px = Math.max(1, +e.target.value || 1); re(); });
  on('#spdetect', 'click', () => { const i = img(SP.src); if (!ok(i)) return toast('Pick a sheet picture first.'); const c = document.createElement('canvas'); c.width = i.naturalWidth; c.height = i.naturalHeight; c.getContext('2d').drawImage(i, 0, 0);
    SP.px = detectPixel(c); toast(SP.px > 1 ? `Pixel grid: ${SP.px} px blocks. Snapped.` : 'No pixel grid found: this looks like painted art.'); re(); });
  on('#spcols', 'change', e => { SP.cols = +e.target.value || 3; re(); }); on('#sprows', 'change', e => { SP.rows = +e.target.value || 4; re(); });
  on('#sporder', 'change', e => { SP.order = e.target.value; re(); }); on('#spmirror', 'change', e => { SP.mirror = e.target.checked; re(); });
  on('#sptiles', 'change', e => { SP.tiles = Math.max(1, +e.target.value || 2); panel(); }); on('#spturn', 'change', e => { SP.turn = e.target.checked; panel(); });
  on('#spcut', 'click', () => { if (!SP.src) return toast('Pick a sheet picture first.'); re(); });
  on('#spfps', 'input', e => { SP.fps = +e.target.value; });
  on('#spname', 'input', e => { SP.name = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'); });
  on('#spname', 'change', () => panel());
  on('#spaddc', 'click', () => { const n = SP.name; if (!n) return toast('Give the character a name.'); if (ED.chars[n] || SPRITES.some(s => s.name === n)) return toast('That name is taken.');
    const files = {}, F = SP.frames;
    for (const d of Object.keys(F)) { files[`art/characters/${n}_${d}.png`] = F[d][0].toDataURL('image/png'); files[`art/characters/${n}_${d}_w1.png`] = F[d][1].toDataURL('image/png'); files[`art/characters/${n}_${d}_w2.png`] = F[d][2].toDataURL('image/png'); }
    const front = (F.down || Object.values(F)[0])[0].toDataURL('image/png'); files[`art/characters/${n}.png`] = front; if (F.up) files[`art/characters/${n}_up.png`] = F.up[0].toDataURL('image/png');
    SPRITES.push({ kind: 'char', name: n, files }); ED.chars[n] = front; DIRTY.add('sprites'); $('#save').classList.add('hot');
    toast(`${n} added to People. Place them from the People tab; Save writes the sprites into the game.`, 6000); panel(); });
  on('#spaddp', 'click', () => { const sheet = S.planet + '_studio', list = ED.props[sheet] = ED.props[sheet] || []; let added = 0;
    const picked = SP.items.filter(x => x.on), order = SP.turn ? spRows(picked) : picked, made = [];
    for (const x of order) { const c = propCanvas(x.b), n = list.reduce((a, p) => Math.max(a, p.n + 1), 0), url = c.toDataURL('image/png'), p = { n, px: [c.width, c.height], url };
      list.push(p); made.push(p); SPRITES.push({ kind: 'prop', sheet, n, url, px: [c.width, c.height] }); added++; }
    if (SP.turn) for (let i = 0; i + 3 < made.length; i += 4) { const t = made.slice(i, i + 4).map(p => p.n); made.slice(i, i + 4).forEach(p => p.turn = t); }   // four in a row = one object's facings
    if (!added) return toast('Tick at least one item.'); DIRTY.add('sprites'); $('#save').classList.add('hot'); S.sheet = sheet;
    toast(`${added} prop(s) added to the ${sheet} sheet in Props. Save writes them into the game.`, 6000); panel(); });
  spAnimate();
}

// ---------- saving ----------
function studioBundle(images, files) {
  for (const t of TILESETS) if (TSIMG[t.id]) images[`art/editor_tiles/${t.id}.png`] = TSIMG[t.id];
  const sheets = {};
  for (const s of SPRITES) if (s.kind === 'char') Object.assign(images, s.files); else { images[`art/props/${s.sheet}/${String(s.n).padStart(2, '0')}.png`] = s.url; sheets[s.sheet] = 1; }
  for (const sh of Object.keys(sheets)) files[`art/props/${sh}/cut.json`] = JSON.stringify(ED.props[sh].map(p => ({ n: p.n, src: [0, 0, p.px[0], p.px[1]], px: p.px, ...(p.turn ? { turn: p.turn } : {}) })), null, 1);
  return TILESETS.map(({ url, ...t }) => t);
}

// ---------- ready-made pieces: each map's own path, grass, tall-grass patch, pond and cliff edge, cut in advance ----------
const READY = {}, RKIND = [['path', 'Path'], ['grass', 'Grass'], ['tall', 'Tall grass'], ['pond', 'Pond'], ['cliff', 'Cliff edge']];
const readyById = id => { for (const v of Object.values(READY)) { const c = (v || []).find(c => c.id === id); if (c) return c; } };
function readyFor(sid) {   // null until the map picture has loaded
  if (READY[sid]) return READY[sid]; const s = sec(sid), im = s && s.img && img(s.img); if (!ok(im)) return null;
  const [W, H] = s.tiles, fl = fluidMap(s), R = rowsOf(sid), at = (x, y) => x < 0 || y < 0 || x >= W || y >= H ? null : fl[tk(x, y)] || (R[y] || '')[x];
  const cvs = document.createElement('canvas'); cvs.width = W * 16; cvs.height = H * 16; const g = cvs.getContext('2d', { willReadFrequently: true }); g.drawImage(im, 0, 0, W * 16, H * 16);
  const st = tileStats(g.getImageData(0, 0, W * 16, H * 16).data, W, H), out = [];
  const cut = (kind, x, y, w, h, keep) => {   // keep(x, y): the feature's own tiles; the rest of the box is see-through, and the outline fades into the map it is put on
    keep = keep || (() => true); const c = document.createElement('canvas'); c.width = w * 16; c.height = h * 16; const g2 = c.getContext('2d', { willReadFrequently: true });
    g2.drawImage(cvs, x * 16, y * 16, w * 16, h * 16, 0, 0, w * 16, h * 16); const d = g2.getImageData(0, 0, w * 16, h * 16), K = (i, j) => i >= 0 && j >= 0 && i < w && j < h && keep(x + i, y + j), F = 6;
    for (let py = 0; py < h * 16; py++) for (let px = 0; px < w * 16; px++) { const i = px >> 4, j = py >> 4, lx = (px & 15) + 0.5, ly = (py & 15) + 0.5; let r = F;
      if (K(i, j)) for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { if ((!di && !dj) || K(i + di, j + dj)) continue;   // distance to the nearest tile that is not part of it, or the box edge
        const dx = di < 0 ? lx : 16 - lx, dy = dj < 0 ? ly : 16 - ly; r = Math.min(r, di && dj ? Math.hypot(dx, dy) : di ? dx : dy); } else r = 0;
      const n = Math.sin(px * 12.9898 + py * 78.233) * 43758.5453; d.data[(py * w * 16 + px) * 4 + 3] = r >= F ? 255 : Math.max(0, Math.min(255, 255 * (r / F + (n - Math.floor(n) - 0.5) * 0.35))); }
    g2.putImageData(d, 0, 0);
    out.push({ id: `r_${sid}_${kind}`, kind, name: `${RKIND.find(k => k[0] === kind)[1]}, ${s.name}`, dir: s.dir, w, h, from: sid, ready: true, url: c.toDataURL('image/png'),
      rows: Array.from({ length: h }, (_, j) => Array.from({ length: w }, (_, i) => keep(x + i, y + j) ? (R[y + j] || '')[x + i] || '#' : ' ').join('')) }); };
  const near = (ch, x, y) => { for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) if (at(x + i, y + j) === ch) return true; return false; };
  const best = {};   // plain ground: the evenest 3x3 that sits well inside walkable ground, green for grass, anything else for path
  for (let y = 1; y + 4 < H; y++) for (let x = 1; x + 4 < W; x++) { let good = true; for (let j = -1; j < 4 && good; j++) for (let i = -1; i < 4; i++) if (at(x + i, y + j) !== '.') { good = false; break; }
    if (!good) continue; const { M, score } = winStat(st, W, x, y, 3), kind = M[1] > M[0] * 1.05 && M[1] > M[2] ? 'grass' : 'path'; if (!best[kind] || score < best[kind].score) best[kind] = { x, y, score }; }
  for (const k of ['path', 'grass']) if (best[k]) cut(k, best[k].x, best[k].y, 3, 3);
  const comps = test => { const seen = new Set(), list = [];   // connected areas of one kind of ground, with their box
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (seen.has(tk(x, y)) || !test(at(x, y))) continue; const q = [[x, y]], c = { n: 0, x0: x, y0: y, x1: x, y1: y }; seen.add(tk(x, y));
      while (q.length) { const [a, b] = q.pop(); c.n++; c.x0 = Math.min(c.x0, a); c.x1 = Math.max(c.x1, a); c.y0 = Math.min(c.y0, b); c.y1 = Math.max(c.y1, b);
        for (const [u, v] of [[a + 1, b], [a - 1, b], [a, b + 1], [a, b - 1]]) if (!seen.has(tk(u, v)) && test(at(u, v))) { seen.add(tk(u, v)); q.push([u, v]); } }
      list.push(c); } return list; };
  const pick = (list, pad, mw, mh) => list.map(c => ({ ...c, x0: Math.max(0, c.x0 - pad), y0: Math.max(0, c.y0 - pad), x1: Math.min(W - 1, c.x1 + pad), y1: Math.min(H - 1, c.y1 + pad) }))
    .filter(c => c.n >= 4 && c.x1 - c.x0 < mw && c.y1 - c.y0 < mh).sort((a, b) => b.n - a.n)[0];
  const tall = pick(comps(ch => ch === ','), 0, 9, 7); if (tall) cut('tall', tall.x0, tall.y0, tall.x1 - tall.x0 + 1, tall.y1 - tall.y0 + 1, (x, y) => at(x, y) === ',');
  const wet = (x0, y0, x1, y1) => { const m = [0, 0, 0]; let n = 0; for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (at(x, y) === '~') { st.mean[y * W + x].forEach((v, q) => m[q] += v); n++; } return n && m[2] > m[0] && m[2] >= m[1] * 0.8; };   // blue-ish, not a dark cave pool
  const pond = pick(comps(ch => ch === '~').filter(c => wet(c.x0, c.y0, c.x1, c.y1)), 1, 11, 9); if (pond) cut('pond', pond.x0, pond.y0, pond.x1 - pond.x0 + 1, pond.y1 - pond.y0 + 1, (x, y) => near('~', x, y));   // the water and its bank
  else { let sh = null;   // a lake too big to copy whole: a stretch of its shore instead, about half water
    for (let y = 0; y + 5 <= H; y++) for (let x = 0; x + 6 <= W; x++) { let n = 0; for (let j = 0; j < 5; j++) for (let i = 0; i < 6; i++) n += at(x + i, y + j) === '~';
      const d = Math.abs(n / 30 - 0.55); if (n && (!sh || d < sh.d)) sh = { x, y, d }; }
    if (sh && sh.d < 0.25 && wet(sh.x, sh.y, sh.x + 5, sh.y + 4)) cut('pond', sh.x, sh.y, 6, 5, (x, y) => near('~', x, y)); }
  let cl = null; const doors = (s.warps || []).map(w => w.tile).filter(Boolean).concat((s.objects || []).map(o => o.tile).filter(Boolean));   // a cliff or mountain side with the ground at its foot
  for (const [cw, ch] of [[5, 4], [5, 3], [4, 3]]) { if (cl) break;   // the tallest that fits; walkable foot along the bottom
    for (let y = 0; y + ch <= H; y++) for (let x = 0; x + cw <= W; x++) { let good = true; for (let j = 0; j < ch && good; j++) for (let i = 0; i < cw; i++) if (at(x + i, y + j) !== (j < ch - 1 ? '#' : '.')) { good = false; break; }
      if (!good || doors.some(([u, v]) => u >= x && u < x + cw && v >= y && v < y + ch)) continue; const { sd, score } = winStat(st, W, x, y, ch - 1); if (sd > 42) continue;   // skip buildings and doorways
      if (!cl || score < cl.score) cl = { x, y, w: cw, h: ch, score }; } }
  if (cl) cut('cliff', cl.x, cl.y, cl.w, cl.h);
  return (READY[sid] = out);
}
function adoptClip(id) {   // a ready-made piece becomes one of your clips (saved) once you place it or turn it into a terrain
  const r = readyById(id); if (!r) return id; const have = CLIPS.find(c => c.src === r.id); if (have) return have.id;
  let n = 1; while (clipById('c' + n)) n++; const c = { id: 'c' + n, name: r.name, dir: r.dir, w: r.w, h: r.h, rows: r.rows, from: r.from, src: r.id };
  CLIPS.push(c); CLIPIMG[c.id] = r.url; DIRTY.add('clips'); $('#save').classList.add('hot'); if (S.clipSel === id) S.clipSel = c.id; return c.id;
}
function readyGrid() {   // this map's pieces first, then the rest of the world's
  const one = S.view !== 'outdoor' && sec(S.view), grp = one ? kitGroup(one) : 'out', k = S.readyKind || 'path';
  const ids = Object.values(ED.sections).filter(s => s.dir === S.planet && s.img && kitGroup(s) === grp && !builtMap(s.id)).map(s => s.id).sort((a, b) => (b === S.view) - (a === S.view));
  let wait = 0; const list = ids.flatMap(id => { const r = readyFor(id); if (!r) { wait++; return []; } return r.filter(c => c.kind === k); });
  if (wait) Promise.all(ids.map(id => img(sec(id).img)).filter(i => !ok(i)).map(i => new Promise(r => { i.addEventListener('load', r); i.addEventListener('error', r); }))).then(() => { if (S.mode === 'clips') panel(); });
  return `<div class="row seg">${RKIND.map(([v, n]) => `<button class="tool ${k === v ? 'on' : ''}" data-rk="${v}">${n}</button>`).join('')}</div>
    <div class="grid">${list.map(c => `<button class="pal ${S.clipSel === c.id || (clipById(S.clipSel) || {}).src === c.id ? 'on' : ''}" data-clip="${c.id}" data-cap="${esc(c.name)} · ${c.w}x${c.h} tiles" title="${esc(c.name)}"><img src="${c.url}"><small>${esc(sec(c.from).name)}${c.from === S.view ? ' (this map)' : ''}</small></button>`).join('')
      || `<div class="hint">${wait ? 'Cutting pieces from this world\'s maps&hellip;' : 'None of this world\'s maps has one.'}</div>`}</div>`;
}
