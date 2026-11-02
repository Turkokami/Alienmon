// Alienmon map editor, part two: the Terrain painter (15-piece autotiles) and the Sprite Studio (sheet slicer -> game sprites).
// Loaded after editor.js and uses its globals (S, ED, MAPS, CLIPS, bake, stampRows, panel, draw, toast...).
// Terrain: each built map keeps one vertex grid per terrain layer ((W+1)x(H+1) corners). A tile's look comes from its four
// corners (NW=1, NE=2, SW=4, SE=8), so painting resolves edges, corners, islands and holes by itself (the "dual grid" autotile).
// A tileset is either 'auto' (any texture or map clip, cut by a procedural edge mask) or 'sheet' (a finished 4x4 sheet in that order).
'use strict';
let TILESETS = [], TSIMG = {};
const TSC = {};   // id -> {fill, rim} 256x256 mask sheets (64 px pieces) or {sheet} image
const tsById = id => TILESETS.find(t => t.id === id);
const corners = i => [i & 1, (i >> 1) & 1, (i >> 2) & 1, (i >> 3) & 1];   // NW, NE, SW, SE

// ---------- edge masks for 'auto' tilesets ----------
function wobble(u, v, seed) {   // periodic in u and v (period 1), so pieces line up on every side whatever sits next to them
  const p = 6.2832, s = seed || 0;
  return 0.5 * Math.sin(p * (2 * u + v) + s) + 0.3 * Math.sin(p * (3 * v - u) + 1.7 + s) + 0.2 * Math.sin(p * (5 * u + 4 * v) + 4.1 + s);
}
function maskSheets(t) {
  if (TSC[t.id] && TSC[t.id].key === t.rough + '|' + t.rim + '|' + t.seed) return TSC[t.id];
  const N = 64, fill = document.createElement('canvas'), rim = document.createElement('canvas'); fill.width = rim.width = fill.height = rim.height = N * 4;
  const fd = fill.getContext('2d').createImageData(N * 4, N * 4), rd = rim.getContext('2d').createImageData(N * 4, N * 4);
  const amp = (t.rough ?? 0.5) * 0.3, rimW = (t.rim ?? 0.5) * 0.09, e = 1.2 / N;
  for (let i = 1; i < 16; i++) { const [a, b, c, d] = corners(i), X = (i % 4) * N, Y = (i >> 2) * N;
    for (let py = 0; py < N; py++) for (let px = 0; px < N; px++) {
      const u = (px + 0.5) / N, v = (py + 0.5) / N, su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v);
      const f = (a * (1 - su) + b * su) * (1 - sv) + (c * (1 - su) + d * su) * sv, k = f - 0.5 + amp * wobble(u, v, t.seed) * (f > 0.02 && f < 0.98 ? 1 : 0);
      const al = f >= 0.999 ? 1 : f <= 0.001 ? 0 : Math.max(0, Math.min(1, (k + e) / (2 * e)));
      const r = rimW > 0 && al > 0 ? Math.max(0, Math.min(1, 1 - (k - e) / rimW)) * al : 0, o = ((Y + py) * N * 4 + X + px) * 4;
      fd.data[o + 3] = Math.round(al * 255); rd.data[o + 3] = Math.round(r * (f >= 0.999 ? 0 : 1) * 255); } }
  fill.getContext('2d').putImageData(fd, 0, 0); rim.getContext('2d').putImageData(rd, 0, 0);
  return (TSC[t.id] = { fill, rim, key: t.rough + '|' + t.rim + '|' + t.seed });
}
function texOf(t) {   // the texture an auto tileset paints with: a map clip (16 px per tile already) or an uploaded picture
  if (t.clip) { const c = clipById(t.clip); return c && clipImg(c); }
  return img(TSIMG[t.id] || t.url);
}
// draw one terrain layer onto a map canvas (g), W x H tiles, from vertex string v
function layerDraw(g, t, v, W, H) {
  const at = (x, y) => v.charCodeAt(y * (W + 1) + x) === 49, idx = (x, y) => (at(x, y) ? 1 : 0) | (at(x + 1, y) ? 2 : 0) | (at(x, y + 1) ? 4 : 0) | (at(x + 1, y + 1) ? 8 : 0);
  const L = document.createElement('canvas'); L.width = W * 16; L.height = H * 16; const l = L.getContext('2d');
  if (t.kind === 'sheet') { const sh = img(TSIMG[t.id] || t.url); if (!ok(sh)) return; const n = sh.naturalWidth / 4; l.imageSmoothingEnabled = true;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = idx(x, y); if (i) l.drawImage(sh, (i % 4) * n, (i >> 2) * n, n, sh.naturalHeight / 4, x * 16, y * 16, 16, 16); } }
  else { const tex = texOf(t); if (!ok(tex)) return; const M = maskSheets(t), sc = t.clip ? 1 : (t.texTiles || 4) * 16 / tex.naturalWidth;
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
function terrRows(id) { if (builtMap(id)) stampRows(id); else paintRows(id); }
function terrainBake(m, g, W, H) { for (const ly of m.terrain || []) { const t = tsById(ly.ts); if (t) layerDraw(g, t, ly.v, W, H); } }
function terrainRows(m, R, W, H) {   // a tile takes its terrain's ground when 3 or 4 of its corners are that terrain (the later layer wins)
  for (const ly of m.terrain || []) { const t = tsById(ly.ts); if (!t || !t.walk) continue; const v = ly.v, at = (x, y) => v.charCodeAt(y * (W + 1) + x) === 49 ? 1 : 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (at(x, y) + at(x + 1, y) + at(x, y + 1) + at(x + 1, y + 1) >= 3) R[y][x] = t.walk; }
}

// ---------- painting ----------
function layerFor(m, ts) { const [W, H] = sec(m.id).tiles; m.terrain = m.terrain || []; let ly = m.terrain.find(l => l.ts === ts);
  if (!ly) { ly = { ts, v: '0'.repeat((W + 1) * (H + 1)) }; m.terrain.push(ly); } return ly; }
let TBAKE = 0;
function terrainPaint(wx, wy) {
  const m = terrTarget(S.view), t = S.terr; if (!m || !t) return; const [W, H] = sec(m.id).tiles, n = S.tbrush || 1;
  const cx = Math.floor(wx / 16), cy = Math.floor(wy / 16); if (cx < 0 || cy < 0 || cx >= W || cy >= H) return;
  const ly = layerFor(m, t), a = ly.v.split(''), x0 = cx - Math.floor((n - 1) / 2), y0 = cy - Math.floor((n - 1) / 2), ch = S.terase ? '0' : '1'; let hit = false;
  for (let y = y0; y <= y0 + n; y++) for (let x = x0; x <= x0 + n; x++) if (x >= 0 && y >= 0 && x <= W && y <= H && a[y * (W + 1) + x] !== ch) { a[y * (W + 1) + x] = ch; hit = true; }
  if (!hit) return; ly.v = a.join('');
  if (!TBAKE) TBAKE = requestAnimationFrame(() => { TBAKE = 0; terrBake(m.id); });
}
function terrainFill(all) { const m = terrTarget(S.view); if (!m || !S.terr) return; const [W, H] = sec(m.id).tiles; snap(); layerFor(m, S.terr).v = (all ? '1' : '0').repeat((W + 1) * (H + 1)); terrBake(m.id); terrRows(m.id); panel(); }
function terrainDown(t, wx, wy) {
  if (S.view === 'outdoor') return toast('Open one map from the map list to paint on it.');
  if (!S.terr) return toast('Pick a terrain on the right first.');
  snap(); S.terrPaint = true; terrainPaint(wx, wy);
}
function terrainUp() { if (!S.terrPaint) return; S.terrPaint = false; const id = S.view; cancelAnimationFrame(TBAKE); TBAKE = 0; terrBake(id); terrRows(id); panel(); }

// ---------- tileset library ----------
function tsPreview(t, size) {   // a small sample patch: an island with a bay and a hole, so every kind of edge shows
  const v = ['00000000', '01111100', '01101110', '01111110', '00111100', '00000000'].join(''), W = 7, H = 5, n = (size || 32) / 16;
  const c = document.createElement('canvas'); c.width = W * 16; c.height = H * 16; const g = c.getContext('2d'); g.fillStyle = '#6b5b45'; g.fillRect(0, 0, W * 16, H * 16);
  layerDraw(g, t, v, W, H); return c.toDataURL();
}
function addTileset(t) { let k = 1; while (tsById('t' + k)) k++; t.id = 't' + k; t.dir = S.planet; t.seed = t.seed ?? Math.round(Math.random() * 60) / 10; snap(); TILESETS.push(t); DIRTY.add('tilesets'); $('#save').classList.add('hot'); S.terr = t.id; panel(); toast(`Terrain "${t.name}" ready. Paint it on a built map.`); }
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

function terrainPanel() {
  const m = S.view !== 'outdoor' && (builtMap(S.view) || DS.paint[S.view] || { id: S.view, terrain: [], over: 1 }), list = TILESETS.filter(t => S.tsAll || t.dir === S.planet), cur = S.terr && tsById(S.terr);
  const prev = cur ? tsPreview(cur, 48) : '';
  return `<div id="preview"><div class="box" id="pbox">${prev ? `<img src="${prev}">` : ''}</div><div class="cap" id="pcap">${cur ? `${cur.name}: the 15 pieces it makes (painting picks them for you)` : 'Pick a terrain to see its pieces'}</div></div>
  <h3>Terrain painter</h3><p class="hint">${m ? 'Pick a terrain, then press and drag on the map. Edges, corners, islands and holes join up by themselves as you paint. Walls and walkable ground follow the terrain.' + (builtMap(S.view) ? '' : ' <b>This is a finished map:</b> the terrain goes on a see-through layer over it, so the picture underneath is never changed.') : '<b>Open one map</b> from the map list to paint on it (a finished map or one you built), or make a new one at the bottom of this panel.'}</p>
  ${m ? `<div class="row"><button class="tool ${!S.terase ? 'on' : ''}" id="tpaint">Paint</button><button class="tool ${S.terase ? 'on' : ''}" id="terase">Erase</button>
    Brush ${[1, 2, 3, 4].map(n => `<button class="tool ${(S.tbrush || 1) === n ? 'on' : ''}" data-tb="${n}">${n}</button>`).join('')}</div>
    <div class="row" style="margin-top:6px"><button id="tfill">Fill the whole map</button><button id="tclear">Clear this terrain</button></div>
    ${(m.terrain || []).length ? `<div class="hint">Layers, bottom to top: ${(m.terrain || []).map((l, i) => `<button data-tup="${i}" title="Move up a layer">${(tsById(l.ts) || {}).name || l.ts} ${i ? '&#8593;' : ''}</button>`).join(' ')}</div>` : ''}` : ''}
  <label class="row"><input type="checkbox" id="tsall" ${S.tsAll ? 'checked' : ''}> show terrains from every world</label>
  <div class="grid">${list.map(t => `<button class="pal ${S.terr === t.id ? 'on' : ''}" data-ts="${t.id}" data-cap="${t.name} · ${{ '.': 'walkable', ',': 'tall grass (wild battles)', '#': 'blocked', '': 'keeps the walls under it' }[t.walk || '']}" title="${t.name}"><img src="${tsPreview(t, 24)}"></button>`).join('') || '<div class="hint">No terrains yet. Make one below.</div>'}</div>
  ${cur ? `<div class="sel" style="margin-top:8px"><b>${cur.name}</b>
    <label>Ground <select id="tswalk">${[['.', 'walkable'], [',', 'tall grass (wild battles)'], ['#', 'blocked (water, lava, cliff)'], ['', 'keep what is under it']].map(([v, n]) => `<option value="${v}" ${(cur.walk || '') === v ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
    ${cur.kind === 'auto' ? `<label>Edge roughness <input type="range" id="tsrough" min="0" max="1" step="0.05" value="${cur.rough ?? 0.5}"></label>
    <label>Edge line <input type="range" id="tsrim" min="0" max="1" step="0.05" value="${cur.rim ?? 0.5}"></label><label>Edge colour <input type="color" id="tsrimc" value="${cur.rimColor || '#2b2216'}"></label>
    ${cur.clip ? '' : `<label>Texture size, tiles <input type="number" id="tstex" min="1" max="16" value="${cur.texTiles || 4}"></label>`}
    <button id="tsseed">New edge shape</button>` : ''}
    <label class="row"><input type="checkbox" id="tsshadow" ${cur.shadow ? 'checked' : ''}> raised (drop shadow under the edge)</label>
    <button id="tsrm">Delete terrain</button></div>` : ''}
  <h3>Make a terrain</h3>
  <label>Name <input id="tsname" placeholder="e.g. Moss, Shallow water, Lava crust"></label>
  <label>Ground <select id="tsnwalk"><option value=".">walkable</option><option value=",">tall grass</option><option value="#">blocked (water, lava, cliff)</option><option value="">keep what is under it</option></select></label>
  <div class="hint"><b>From a map clip</b> (matches this world's art best): clip a patch of ground in Clips mode first.</div>
  <div class="row"><select id="tsclip">${CLIPS.filter(c => c.dir === S.planet || S.tsAll).map(c => `<option value="${c.id}">${c.name} (${c.w}x${c.h})</option>`).join('') || '<option value="">no clips yet</option>'}</select><button id="tsfromclip">Make from clip</button></div>
  <div class="hint"><b>From a seamless texture picture</b> (ChatGPT, SpriteCook or your own):</div>
  <input type="file" id="tstexf" accept="image/*">
  <div class="hint"><b>From a finished 4x4 sheet</b> drawn to the template layout:</div>
  <input type="file" id="tssheetf" accept="image/*">
  <div class="row" style="margin-top:8px"><button id="tstpl">Download blank template</button><button data-prompt="texture">Copy texture prompt</button><button data-prompt="sheet">Copy sheet prompt</button></div>
  <h3>New map to paint on</h3>
  <label>Name <input id="bname" placeholder="e.g. Hidden Canyon"></label>
  <div class="row"><label>Width <input id="bw" type="number" value="24" min="8" max="48" style="width:70px"></label><label>Height <input id="bh" type="number" value="16" min="8" max="48" style="width:70px"></label></div>
  <label>Kind <select id="btype"><option>route</option><option>town</option><option>field</option><option>landmark</option><option value="interior">interior room</option></select></label>
  <input type="hidden" id="bground" value=""><label>Base colour <input id="bcolor" type="color" value="#6b5b45"></label>
  <button id="bmake">Create blank map</button><p class="hint">Paint a base terrain over the whole map with Fill, then paths, water and grass on top.</p>`;
}
function terrainWire() {
  const on = (sel, ev, f) => { const el = $(sel); if (el) el.addEventListener(ev, f); }, cur = () => tsById(S.terr);
  const redo = () => { DIRTY.add('tilesets'); $('#save').classList.add('hot'); for (const m of MAPS.filter(m => m.built).concat(Object.values(DS.paint || {}))) if ((m.terrain || []).some(l => l.ts === S.terr)) { terrBake(m.id); terrRows(m.id); } };
  document.querySelectorAll('[data-ts]').forEach(b => b.onclick = () => { S.terr = b.dataset.ts; panel(); });
  document.querySelectorAll('[data-tb]').forEach(b => b.onclick = () => { S.tbrush = +b.dataset.tb; panel(); });
  document.querySelectorAll('[data-tup]').forEach(b => b.onclick = () => { const m = terrTarget(S.view), i = +b.dataset.tup; if (!i) return; snap(); [m.terrain[i - 1], m.terrain[i]] = [m.terrain[i], m.terrain[i - 1]]; terrBake(m.id); terrRows(m.id); panel(); });
  document.querySelectorAll('[data-prompt]').forEach(b => b.onclick = () => copyPrompt(b.dataset.prompt));
  on('#tpaint', 'click', () => { S.terase = false; panel(); }); on('#terase', 'click', () => { S.terase = true; panel(); });
  on('#tfill', 'click', () => terrainFill(true)); on('#tclear', 'click', () => terrainFill(false));
  on('#tsall', 'change', e => { S.tsAll = e.target.checked; panel(); });
  on('#tswalk', 'change', e => { snap(); cur().walk = e.target.value; redo(); panel(); });
  on('#tsrough', 'change', e => { cur().rough = +e.target.value; redo(); panel(); }); on('#tsrim', 'change', e => { cur().rim = +e.target.value; redo(); panel(); });
  on('#tsrimc', 'change', e => { cur().rimColor = e.target.value; redo(); panel(); }); on('#tstex', 'change', e => { cur().texTiles = Math.max(1, Math.min(16, +e.target.value || 4)); redo(); panel(); });
  on('#tsseed', 'click', () => { cur().seed = Math.round(Math.random() * 60) / 10; redo(); panel(); });
  on('#tsshadow', 'change', e => { cur().shadow = e.target.checked; redo(); panel(); });
  on('#tsrm', 'click', () => { if (MAPS.filter(m => m.built).concat(Object.values(DS.paint || {})).some(m => (m.terrain || []).some(l => l.ts === S.terr))) return toast('That terrain is painted on a map; clear it there first.'); snap(); TILESETS = TILESETS.filter(t => t.id !== S.terr); DIRTY.add('tilesets'); S.terr = null; panel(); });
  const base = () => ({ name: ($('#tsname').value || '').trim() || 'Terrain', walk: $('#tsnwalk').value });
  on('#tsfromclip', 'click', () => { const c = $('#tsclip').value; if (!c) return toast('Clip a patch of ground in Clips mode first.'); addTileset({ ...base(), kind: 'auto', clip: c, rough: 0.5, rim: 0.4, rimColor: '#2b2216' }); });
  on('#tstexf', 'change', async e => { const f = e.target.files[0]; if (!f) return; const u = await readFile(f), t = { ...base(), kind: 'auto', rough: 0.5, rim: 0.4, rimColor: '#2b2216', texTiles: 4 };
    addTileset(t); TSIMG[t.id] = await squash(u, 512); img(TSIMG[t.id]); panel(); });
  on('#tssheetf', 'change', async e => { const f = e.target.files[0]; if (!f) return; const u = await readFile(f), t = { ...base(), kind: 'sheet' };
    addTileset(t); TSIMG[t.id] = await squash(u, 512, true); img(TSIMG[t.id]); panel(); });
  on('#tstpl', 'click', templatePng);
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
    `<label>The first item (top left) is this many tiles wide <input type="number" id="sptiles" min="1" max="8" step="0.5" value="${SP.tiles}"></label>`}
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
  on('#sptiles', 'change', e => { SP.tiles = Math.max(1, +e.target.value || 2); panel(); });
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
    for (const x of SP.items) { if (!x.on) continue; const c = propCanvas(x.b), n = list.reduce((a, p) => Math.max(a, p.n + 1), 0), url = c.toDataURL('image/png');
      list.push({ n, px: [c.width, c.height], url }); SPRITES.push({ kind: 'prop', sheet, n, url, px: [c.width, c.height] }); added++; }
    if (!added) return toast('Tick at least one item.'); DIRTY.add('sprites'); $('#save').classList.add('hot'); S.sheet = sheet;
    toast(`${added} prop(s) added to the ${sheet} sheet in Props. Save writes them into the game.`, 6000); panel(); });
  spAnimate();
}

// ---------- saving ----------
function studioBundle(images, files) {
  for (const t of TILESETS) if (TSIMG[t.id]) images[`art/editor_tiles/${t.id}.png`] = TSIMG[t.id];
  const sheets = {};
  for (const s of SPRITES) if (s.kind === 'char') Object.assign(images, s.files); else { images[`art/props/${s.sheet}/${String(s.n).padStart(2, '0')}.png`] = s.url; sheets[s.sheet] = 1; }
  for (const sh of Object.keys(sheets)) files[`art/props/${sh}/cut.json`] = JSON.stringify(ED.props[sh].map(p => ({ n: p.n, src: [0, 0, p.px[0], p.px[1]], px: p.px })), null, 1);
  return TILESETS.map(({ url, ...t }) => t);
}
