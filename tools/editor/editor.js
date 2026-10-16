// Alienmon map editor: place props, people and wild Alienmon on the section maps, paint walls, and grow a world with new map pieces.
// Loads editor_data.json (written by tools/build.js on prototype builds). Saves straight into the alienmon-app folder (Chrome/Edge
// desktop: File System Access) or downloads editor_changes.json; tools/editor/apply.py turns either into a rebuilt game.
'use strict';
const $ = s => document.querySelector(s);
let ED = null;
const IMGS = {};
const img = u => { if (!u) return null; if (!IMGS[u]) { const i = new Image(); i.onload = () => draw(); i.src = u; IMGS[u] = i; } return IMGS[u]; };
const ok = i => i && i.complete && i.naturalWidth;

// ---------- working state ----------
const S = { planet: null, view: 'outdoor', mode: 'props', zoom: 2, ox: 40, oy: 40, sheet: null, stamp: null, sel: null, walls: false, brush: '#', drag: null, pan: null };
let LAYOUT = {}, MOVES = {}, ADDED = {}, REMOVED = {}, MONS = {}, MAPS = [], ROWS = {}, NEWIMG = {}, GRID = {}, ROUTES = [], DOORS = {}, CLIPS = [], CLIPIMG = {};
const DIRTY = new Set();
const HIST = [];
const edgeSnap = () => Object.fromEntries(Object.values(ED.sections).map(s => [s.id, s.edges]));
function snap() { HIST.push(JSON.stringify({ LAYOUT, MOVES, ADDED, REMOVED, MONS, ROWS, GRID, ROUTES, DOORS, CLIPS, MAPS, EDGES: edgeSnap() })); if (HIST.length > 60) HIST.shift(); }
function undo() { const h = HIST.pop(); if (!h) return toast('Nothing to undo'); let E; ({ LAYOUT, MOVES, ADDED, REMOVED, MONS, ROWS, GRID, ROUTES, DOORS, CLIPS, MAPS, EDGES: E } = JSON.parse(h)); for (const m of MAPS) if (m.built && ED.sections[m.id]) bake(m.id); for (const [k, v] of Object.entries(E || {})) if (ED.sections[k]) ED.sections[k].edges = v; S.sel = null; panel(); draw(); }
function touch(sid) { DIRTY.add(sid); $('#save').classList.add('hot'); }

// ---------- data helpers ----------
const sec = id => ED.sections[id];
const rowsOf = id => ROWS[id] || (sec(id).rows || []);
const planetSecs = () => Object.values(ED.sections).filter(s => s.dir === S.planet);
const viewSecs = () => S.view === 'outdoor' ? planetSecs().filter(s => s.grid) : [sec(S.view)].filter(Boolean);
const gridOf = s => GRID[s.id] || s.grid;
const origin = s => S.view === 'outdoor' ? [gridOf(s)[0] * 16, gridOf(s)[1] * 16] : [0, 0];
const propInfo = p => { const [d, n] = p.split('/'); const m = (ED.props[d] || []).find(m => String(m.n).padStart(2, '0') === n); return m; };
function propBox(q) {
  const m = propInfo(q.p); if (!m) return null; const [pw, ph] = m.px, w = q.w || Math.max(1, Math.round(pw / 16)), h = q.h || 1;
  const X = q.x * 16 + (w * 16 - pw) / 2 + (q.ox || 0), Y = (q.solid === false ? q.y * 16 + Math.round((h * 16 - ph) / 2) : (q.y + h) * 16 - ph) + (q.oy || 0);
  return { X, Y, pw, ph, w, h, url: m.url };
}
function npcsOf(id) {
  const base = (sec(id).npcs || []).filter(n => !(REMOVED[id] || []).includes(n.src)).map(n => {
    const mv = (MOVES[id] || {})[n.src]; return { ...n, x: mv ? mv[0] : n.x, y: mv ? mv[1] : n.y, ref: { kind: 'npc', sid: id, src: n.src } };
  });
  const seen = new Set(); const uniq = base.filter(n => { const k = n.src || Math.random(); if (seen.has(k)) return false; seen.add(k); return true; });
  return uniq.concat((ADDED[id] || []).map((a, i) => ({ x: a.tile[0], y: a.tile[1], art: a.art, name: a.name, added: true, ref: { kind: 'added', sid: id, i } })));
}
const monsOf = id => (MONS[id] || sec(id).mons || []);
function blockedKeys(id) {   // tiles nothing may stand on: doors, warps, counters, spawns and the exit bands
  const s = sec(id), k = new Set(), [W, H] = s.tiles, add = (x, y) => k.add(x + ',' + y);
  for (const w of s.warps) add(...w.tile);
  for (const o of s.objects) if (o.k !== 'stash') { add(...o.tile); if (['house', 'bay', 'shop'].includes(o.k)) add(o.tile[0], o.tile[1] + 1); }
  for (const v of Object.values(s.spawns || {})) if (v) add(...v);
  for (const [side, e] of Object.entries(s.edges || {})) for (let i = e.range[0]; i <= e.range[1]; i++) for (let d = 0; d < 2; d++)
    add(...({ left: [d, i], right: [W - 1 - d, i], top: [i, d], bottom: [i, H - 1 - d] })[side]);
  return k;
}

// ---------- drawing ----------
const cv = $('#map'), ctx = cv.getContext('2d');
function resize() { cv.width = cv.clientWidth * devicePixelRatio; cv.height = cv.clientHeight * devicePixelRatio; draw(); }
function draw() {
  if (!ED) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#0d0a18'; ctx.fillRect(0, 0, cv.width, cv.height);
  const z = S.zoom * devicePixelRatio; ctx.setTransform(z, 0, 0, z, S.ox * devicePixelRatio, S.oy * devicePixelRatio); ctx.imageSmoothingEnabled = false;
  const items = [];
  for (const s of viewSecs()) {
    const [ox, oy] = origin(s), [W, H] = s.tiles, im = NEWIMG[s.id] ? img(NEWIMG[s.id]) : img(s.img);
    if (ok(im)) ctx.drawImage(im, ox, oy, W * 16, H * 16); else { ctx.fillStyle = '#222'; ctx.fillRect(ox, oy, W * 16, H * 16); }
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1 / S.zoom; ctx.strokeRect(ox, oy, W * 16, H * 16);
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(ox, oy, Math.min(W * 16, s.name.length * 5 + 26), 9);
    ctx.fillStyle = '#ffd23f'; ctx.font = '7px monospace'; ctx.fillText(s.id + ' ' + s.name, ox + 2, oy + 7);
    if (S.walls || S.mode === 'walls') { const R = rowsOf(s.id), RE = reachOf(s.id);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const c = (R[y] || '')[x], k = x + ',' + y;
        if (c === '#') ctx.fillStyle = 'rgba(255,40,60,0.38)';
        else if (RE.solid.has(k)) ctx.fillStyle = 'rgba(150,90,255,0.35)';                    // walkable ground under a prop or person
        else if (!RE.seen.has(k)) ctx.fillStyle = 'rgba(255,150,0,0.62)';                    // walkable but cut off: the player can never get here
        else ctx.fillStyle = c === ',' ? 'rgba(40,220,120,0.42)' : 'rgba(80,255,150,0.22)'; // reachable ground / reachable tall grass
        ctx.fillRect(ox + x * 16, oy + y * 16, 16, 16); }
      ctx.strokeStyle = 'rgba(255,255,255,0.10)'; for (let x = 0; x <= W; x++) { ctx.beginPath(); ctx.moveTo(ox + x * 16, oy); ctx.lineTo(ox + x * 16, oy + H * 16); ctx.stroke(); }
      for (let y = 0; y <= H; y++) { ctx.beginPath(); ctx.moveTo(ox, oy + y * 16); ctx.lineTo(ox + W * 16, oy + y * 16); ctx.stroke(); } }
    if (S.view === 'outdoor' && (S.mode === 'routes' || S.mode === 'arrange' || $('#showdoors').checked)) for (const [side, e] of Object.entries(s.edges || {})) {
      const on = S.sel && S.sel.kind === 'route' && S.sel.sid === s.id && S.sel.side === side; ctx.fillStyle = on ? 'rgba(255,210,63,0.95)' : 'rgba(95,242,255,0.85)';
      const a = e.range[0] * 16, b = (e.range[1] + 1) * 16, t = 3;
      if (side === 'left') ctx.fillRect(ox, oy + a, t, b - a); else if (side === 'right') ctx.fillRect(ox + W * 16 - t, oy + a, t, b - a);
      else if (side === 'top') ctx.fillRect(ox + a, oy, b - a, t); else ctx.fillRect(ox + a, oy + H * 16 - t, b - a, t); }
    if (S.mode === 'arrange' && S.view === 'outdoor') { const bad = viewSecs().some(o => o !== s && overlap(s, o)); ctx.strokeStyle = bad ? '#ff5050' : (S.sel && S.sel.kind === 'piece' && S.sel.sid === s.id ? '#ffd23f' : 'rgba(255,255,255,0.7)'); ctx.lineWidth = 2 / S.zoom; ctx.strokeRect(ox, oy, W * 16, H * 16); }
    if (S.mode === 'doors') for (const d of allDoors(s.id)) { ctx.fillStyle = d.fixed ? 'rgba(160,160,160,0.55)' : d.edited ? 'rgba(255,210,63,0.75)' : 'rgba(95,242,255,0.55)'; ctx.fillRect(ox + d.x * 16, oy + d.y * 16, 16, 16);
      ctx.fillStyle = '#000'; ctx.fillRect(ox + d.x * 16 - 2, oy + d.y * 16 - 9, Math.min(110, doorName(d.to).length * 4 + 6), 8); ctx.fillStyle = '#fff'; ctx.font = '6px monospace'; ctx.fillText(doorName(d.to).slice(0, 26), ox + d.x * 16, oy + d.y * 16 - 3); }
    if (S.mode === 'doors' && S.sel && S.sel.kind === 'door' && S.sel.sid === s.id) { ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 2 / S.zoom; ctx.strokeRect(ox + S.sel.x * 16, oy + S.sel.y * 16, 16, 16); }
    if ($('#showdoors').checked) for (const w of s.warps) { ctx.strokeStyle = '#5ff2ff'; ctx.lineWidth = 1.5 / S.zoom; ctx.strokeRect(ox + w.tile[0] * 16 + 1, oy + w.tile[1] * 16 + 1, 14, 14); }
    (LAYOUT[s.id] || []).forEach((q, i) => { const b = propBox(q); if (b) items.push({ y: q.solid === false ? -1e9 : (q.y + b.h - 1) * 16, d: () => { const im = img(b.url); if (ok(im)) ctx.drawImage(im, ox + b.X, oy + b.Y); }, ref: { kind: 'prop', sid: s.id, i }, box: [ox + b.X, oy + b.Y, b.pw, b.ph] }); });
    for (const n of npcsOf(s.id)) { const u = ED.chars[n.art]; items.push({ y: n.y * 16 + 1, d: () => { const im = img(u); if (ok(im)) ctx.drawImage(im, ox + n.x * 16 - 4, oy + n.y * 16 - 8, 24, 24); else { ctx.fillStyle = '#ff8a1e'; ctx.fillRect(ox + n.x * 16 + 4, oy + n.y * 16 + 2, 8, 12); } }, ref: n.ref, box: [ox + n.x * 16 - 4, oy + n.y * 16 - 8, 24, 24] }); }
    monsOf(s.id).forEach((m, i) => { const u = ED.mons[m.mon]; items.push({ y: m.y * 16 + 2, d: () => { const im = img(u); if (ok(im)) ctx.drawImage(im, 0, 0, 64, 64, ox + m.x * 16 - 2, oy + m.y * 16 - 5, 20, 20); }, ref: { kind: 'mon', sid: s.id, i }, box: [ox + m.x * 16 - 2, oy + m.y * 16 - 5, 20, 20] }); });
    for (const o of s.objects) if (o.k === 'stash') { ctx.fillStyle = '#b07cff'; ctx.fillRect(ox + o.tile[0] * 16 + 3, oy + o.tile[1] * 16 + 5, 10, 9); }
  }
  items.sort((a, b) => a.y - b.y).forEach(it => it.d());
  draw.items = items;
  if (S.sel) { const it = items.find(it => same(it.ref, S.sel)); if (it) { ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 1.5 / S.zoom; ctx.setLineDash([3 / S.zoom, 2 / S.zoom]); ctx.strokeRect(...it.box); ctx.setLineDash([]); } }
  if (S.clipRect) { const r = S.clipRect, s = sec(r.sid), [ox, oy] = origin(s), x0 = Math.min(r.x0, r.x1), y0 = Math.min(r.y0, r.y1);
    ctx.fillStyle = 'rgba(95,242,255,0.25)'; ctx.fillRect(ox + x0 * 16, oy + y0 * 16, (Math.abs(r.x1 - r.x0) + 1) * 16, (Math.abs(r.y1 - r.y0) + 1) * 16);
    ctx.strokeStyle = '#5ff2ff'; ctx.lineWidth = 2 / S.zoom; ctx.setLineDash([4 / S.zoom, 3 / S.zoom]); ctx.strokeRect(ox + x0 * 16, oy + y0 * 16, (Math.abs(r.x1 - r.x0) + 1) * 16, (Math.abs(r.y1 - r.y0) + 1) * 16); ctx.setLineDash([]); }
  if (S.mode === 'clips' && S.view !== 'outdoor') { const m = builtMap(S.view); if (m) { const s = sec(S.view);
    (m.stamps || []).forEach((st, i) => { const c = clipById(st.c); if (!c) return; const on = S.sel && S.sel.kind === 'stamp' && S.sel.i === i;
      ctx.strokeStyle = on ? '#ffd23f' : 'rgba(255,255,255,0.35)'; ctx.lineWidth = (on ? 2 : 1) / S.zoom; ctx.strokeRect(st.x * 16, st.y * 16, c.w * 16, c.h * 16); });
    if (S.hover && S.stamp && S.stamp.kind === 'clip') { const c = clipById(S.stamp.c), [h] = S.hover; if (c) { ctx.strokeStyle = '#ffd23f'; ctx.strokeRect(h.x * 16, h.y * 16, c.w * 16, c.h * 16); } } } }
  if (S.wallRect) { const r = S.wallRect, s = sec(r.sid), [ox, oy] = origin(s), x0 = Math.min(r.x0, r.x1), y0 = Math.min(r.y0, r.y1);
    ctx.fillStyle = S.brush === '#' ? 'rgba(255,40,60,0.5)' : S.brush === ',' ? 'rgba(40,220,120,0.5)' : 'rgba(255,255,255,0.45)';
    ctx.fillRect(ox + x0 * 16, oy + y0 * 16, (Math.abs(r.x1 - r.x0) + 1) * 16, (Math.abs(r.y1 - r.y0) + 1) * 16);
    ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 2 / S.zoom; ctx.strokeRect(ox + x0 * 16, oy + y0 * 16, (Math.abs(r.x1 - r.x0) + 1) * 16, (Math.abs(r.y1 - r.y0) + 1) * 16); }
  if (S.routeDrag) { const r = S.routeDrag, s = sec(r.sid), [ox, oy] = origin(s), a = Math.min(r.k0, r.k1) * 16, b = (Math.max(r.k0, r.k1) + 1) * 16; ctx.fillStyle = 'rgba(255,210,63,0.6)';
    if (r.side === 'left' || r.side === 'right') ctx.fillRect(ox + (r.side === 'right' ? s.tiles[0] * 16 - 16 : 0), oy + a, 16, b - a); else ctx.fillRect(ox + a, oy + (r.side === 'bottom' ? s.tiles[1] * 16 - 16 : 0), b - a, 16); }
  if (S.hover && S.stamp) { const [hx, hy] = S.hover; ctx.strokeStyle = 'rgba(255,210,63,0.9)'; ctx.lineWidth = 1 / S.zoom; ctx.strokeRect(hx.ox + hx.x * 16, hx.oy + hx.y * 16, (S.stamp.w || 1) * 16, 16); }
}
const same = (a, b) => a && b && a.kind === b.kind && a.sid === b.sid && a.i === b.i && a.src === b.src;

// ---------- picking tiles ----------
function toWorld(e) { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left - S.ox) / S.zoom, (e.clientY - r.top - S.oy) / S.zoom]; }
function tileAt(wx, wy) {
  for (const s of viewSecs()) { const [ox, oy] = origin(s), [W, H] = s.tiles, x = Math.floor((wx - ox) / 16), y = Math.floor((wy - oy) / 16);
    if (x >= 0 && y >= 0 && x < W && y < H) return { sid: s.id, x, y, ox, oy }; }
  return null;
}
function itemAt(wx, wy) { const its = (draw.items || []).slice().reverse(); return its.find(it => wx >= it.box[0] && wx < it.box[0] + it.box[2] && wy >= it.box[1] && wy < it.box[1] + it.box[3]); }

// ---------- placing / moving ----------
function canStand(sid, x, y, ignore) {
  const R = rowsOf(sid), c = (R[y] || '')[x];
  if (c !== '.' && c !== ',') return 'That tile is a wall.';
  if (blockedKeys(sid).has(x + ',' + y)) return 'Keep doors, exits and counters clear.';
  for (const q of LAYOUT[sid] || []) { if (q.solid === false) continue; const b = propBox(q); if (b && x >= q.x && x < q.x + b.w && y >= q.y && y < q.y + b.h) return 'A prop is there.'; }
  if (npcsOf(sid).some(n => n.x === x && n.y === y && !same(n.ref, ignore))) return 'Someone is standing there.';
  if (monsOf(sid).some((m, i) => m.x === x && m.y === y && !same({ kind: 'mon', sid, i }, ignore))) return 'An Alienmon is there.';
  return null;
}
function canProp(sid, x, y, w, h, flat, self) {
  const k = blockedKeys(sid);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { if (k.has((x + i) + ',' + (y + j))) return 'Keep doors, exits and counters clear.';
    if (!flat && (npcsOf(sid).some(n => n.x === x + i && n.y === y + j))) return 'Someone is standing there.'; }
  return null;
}
function place(t) {
  if (!S.stamp || !t) return;
  const st = S.stamp;
  if (st.kind === 'prop') { const m = propInfo(st.p), w = Math.max(1, Math.round(m.px[0] / 16)), why = canProp(t.sid, t.x, t.y, w, 1, st.flat);
    if (why) return toast(why); snap(); (LAYOUT[t.sid] = LAYOUT[t.sid] || []).push({ p: st.p, x: t.x, y: t.y, ...(st.flat ? { solid: false, h: 2 } : {}) }); S.sel = { kind: 'prop', sid: t.sid, i: LAYOUT[t.sid].length - 1 }; }
  else if (st.kind === 'char') { const why = canStand(t.sid, t.x, t.y); if (why) return toast(why); snap();
    (ADDED[t.sid] = ADDED[t.sid] || []).push({ art: st.art, name: st.name || '', tile: [t.x, t.y], face: 'down', t: [st.line || ((st.name ? st.name + ': ' : '') + 'Nice day, isn\'t it?')] }); S.sel = { kind: 'added', sid: t.sid, i: ADDED[t.sid].length - 1 }; }
  else if (st.kind === 'mon') { const why = canStand(t.sid, t.x, t.y); if (why) return toast(why); snap();
    if (!MONS[t.sid]) MONS[t.sid] = (sec(t.sid).mons || []).map(m => ({ ...m })); MONS[t.sid].push({ mon: st.mon, x: t.x, y: t.y }); S.sel = { kind: 'mon', sid: t.sid, i: MONS[t.sid].length - 1 }; }
  touch(t.sid); panel(); draw();
}
function moveSel(t, dx, dy) {   // to tile t, or by dx,dy tiles
  const r = S.sel; if (!r) return;
  const cur = selPos(); if (!cur) return; const nx = t ? t.x : cur[0] + dx, ny = t ? t.y : cur[1] + dy; if (t && t.sid !== r.sid) return toast('Move it within its own map piece.');
  if (r.kind === 'prop') { const q = LAYOUT[r.sid][r.i], b = propBox(q), why = canProp(r.sid, nx, ny, b.w, b.h, q.solid === false); if (why) return toast(why); q.x = nx; q.y = ny; }
  else { const why = canStand(r.sid, nx, ny, r); if (why) return toast(why);
    if (r.kind === 'npc') { (MOVES[r.sid] = MOVES[r.sid] || {})[r.src] = [nx, ny]; }
    else if (r.kind === 'added') ADDED[r.sid][r.i].tile = [nx, ny];
    else if (r.kind === 'mon') { if (!MONS[r.sid]) MONS[r.sid] = (sec(r.sid).mons || []).map(m => ({ ...m })); MONS[r.sid][r.i].x = nx; MONS[r.sid][r.i].y = ny; } }
  touch(r.sid); panel(); draw();
}
function selPos() { const r = S.sel; if (!r) return null;
  if (r.kind === 'prop') { const q = (LAYOUT[r.sid] || [])[r.i]; return q && [q.x, q.y]; }
  if (r.kind === 'mon') { const m = monsOf(r.sid)[r.i]; return m && [m.x, m.y]; }
  const n = npcsOf(r.sid).find(n => same(n.ref, r)); return n && [n.x, n.y]; }
function delSel() { const r = S.sel; if (!r) return; if (r.kind === 'piece') return; if (r.kind === 'stamp') { snap(); builtMap(r.sid).stamps.splice(r.i, 1); S.sel = null; bake(r.sid); stampRows(r.sid); panel(); return; } if (r.kind === 'route') { snap(); removeRoute(r.sid, r.side); S.sel = null; panel(); draw(); return; } snap();
  if (r.kind === 'prop') LAYOUT[r.sid].splice(r.i, 1);
  else if (r.kind === 'added') ADDED[r.sid].splice(r.i, 1);
  else if (r.kind === 'npc') { if (!confirm('Remove this person from the map? (Story characters may be needed by quests.)')) return; (REMOVED[r.sid] = REMOVED[r.sid] || []).push(r.src); }
  else if (r.kind === 'mon') { if (!MONS[r.sid]) MONS[r.sid] = (sec(r.sid).mons || []).map(m => ({ ...m })); MONS[r.sid].splice(r.i, 1); }
  touch(r.sid); S.sel = null; panel(); draw(); }
function fillRect() {
  const r = S.wallRect; S.wallRect = null; const s = sec(r.sid), keys = blockedKeys(r.sid), R = rowsOf(r.sid).map(x => x.split(''));
  const x0 = Math.min(r.x0, r.x1), x1 = Math.max(r.x0, r.x1), y0 = Math.min(r.y0, r.y1), y1 = Math.max(r.y0, r.y1); let n = 0, kept = 0;
  snap();
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { if (!R[y] || R[y][x] === undefined || R[y][x] === S.brush) continue;
    if (S.brush === '#' && keys.has(x + ',' + y)) { kept++; continue; }   // never wall over a door, exit, counter or spawn
    R[y][x] = S.brush; n++; }
  if (n) { ROWS[r.sid] = R.map(x => x.join('')); touch(r.sid); }
  toast(`${n} tile${n === 1 ? '' : 's'} set to ${{ '#': 'wall', '.': 'walkable', ',': 'tall grass' }[S.brush]}${kept ? ` (${kept} door/exit tile${kept === 1 ? '' : 's'} left open)` : ''}`); panel(); draw();
}
// which walkable tiles the player can actually reach: flood from every exit, door, doormat, spawn and the tile in front of each door
function reachOf(id) {
  const s = sec(id), [W, H] = s.tiles, R = rowsOf(id), solid = new Set();
  for (const q of LAYOUT[id] || []) { if (q.solid === false) continue; const b = propBox(q); if (b) for (let j = 0; j < b.h; j++) for (let i = 0; i < b.w; i++) solid.add((q.x + i) + ',' + (q.y + j)); }
  for (const n of npcsOf(id)) solid.add(n.x + ',' + n.y); for (const m of monsOf(id)) solid.add(m.x + ',' + m.y);
  for (const o of s.objects) if (o.k === 'stash') solid.add(o.tile.join(','));
  const walk = (x, y) => x >= 0 && y >= 0 && x < W && y < H && '.,'.includes((R[y] || '')[x]) && !solid.has(x + ',' + y);
  const seeds = [];
  for (const [side, e] of Object.entries(s.edges || {})) for (let k = e.range[0]; k <= e.range[1]; k++) seeds.push({ left: [0, k], right: [W - 1, k], top: [k, 0], bottom: [k, H - 1] }[side]);
  for (const w of s.warps) seeds.push(w.tile, [w.tile[0], w.tile[1] + 1], [w.tile[0], w.tile[1] - 1]);
  for (const o of s.objects) if (o.k !== 'stash') seeds.push([o.tile[0], o.tile[1] + 1], [o.tile[0], o.tile[1] - 1], [o.tile[0] + 1, o.tile[1]], [o.tile[0] - 1, o.tile[1]]);
  for (const d of DOORS[id] || []) seeds.push([d.tile[0], d.tile[1] + 1]);
  for (const v of Object.values(s.spawns || {})) if (v) seeds.push(v);
  const seen = new Set(), q = [];
  for (const [x, y] of seeds) if (walk(x, y) && !seen.has(x + ',' + y)) { seen.add(x + ',' + y); q.push([x, y]); }
  while (q.length) { const [x, y] = q.shift(); for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = (x + a) + ',' + (y + b); if (!seen.has(k) && walk(x + a, y + b)) { seen.add(k); q.push([x + a, y + b]); } } }
  return { seen, solid };
}
function paint(t) { if (!t) return; const R = rowsOf(t.sid).slice(), row = R[t.y].split(''); if (row[t.x] === S.brush) return;
  if (S.brush !== '#' || !blockedKeys(t.sid).has(t.x + ',' + t.y) || confirm('This tile is a door, exit or spawn. Make it a wall anyway?')) { row[t.x] = S.brush; R[t.y] = row.join(''); ROWS[t.sid] = R; touch(t.sid); draw(); } }

// ---------- mouse / keys ----------
const TOUCH = new Map(); let PINCH = null;
function pinchStart() { const [a, b] = [...TOUCH.values()]; PINCH = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, z: S.zoom, ox: S.ox, oy: S.oy }; }
function cancelGesture() {   // a second finger turns whatever the first finger started into a pan/zoom
  if (S.pieceDrag || S.drag || S.stampDrag) { const keep = S.sel; undo(); S.sel = keep; panel(); }
  S.wallRect = S.clipRect = S.routeDrag = null; S.pan = null; S.drag = false; S.pieceDrag = null; S.propGrab = null; S.stampDrag = null; S.painting = false;
}
cv.addEventListener('pointerdown', e => {
  if (e.pointerType === 'touch') { TOUCH.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (TOUCH.size === 2) { cancelGesture(); pinchStart(); cv.setPointerCapture(e.pointerId); draw(); return; } if (TOUCH.size > 2) return; }
  cv.setPointerCapture(e.pointerId); const [wx, wy] = toWorld(e), t = tileAt(wx, wy);
  if (e.button === 1 || e.button === 2 || e.altKey || !t) { S.pan = [e.clientX - S.ox, e.clientY - S.oy]; return; }
  if (S.mode === 'walls') { S.wallRect = { sid: t.sid, x0: t.x, y0: t.y, x1: t.x, y1: t.y }; draw(); return; }
  if (S.mode === 'clips') {
    const m = S.view !== 'outdoor' && builtMap(S.view);
    if (m && S.stamp && S.stamp.kind === 'clip') { placeStamp(t); return; }
    if (m) { const i = (m.stamps || []).map((st, i) => [st, i]).reverse().find(([st]) => { const c = clipById(st.c); return c && t.x >= st.x && t.x < st.x + c.w && t.y >= st.y && t.y < st.y + c.h; });
      if (i) { snap(); S.sel = { kind: 'stamp', sid: S.view, i: i[1] }; S.stampDrag = { dx: t.x - i[0].x, dy: t.y - i[0].y }; panel(); draw(); return; } }
    S.clipRect = { sid: t.sid, x0: t.x, y0: t.y, x1: t.x, y1: t.y }; draw(); return; }
  if (S.mode === 'doors') { S.sel = { kind: 'door', sid: t.sid, x: t.x, y: t.y }; panel(); draw(); return; }
  if (S.mode === 'arrange') { if (S.view !== 'outdoor') { toWorldView(); return; } const s = sec(t.sid), [ox, oy] = origin(s); snap(); S.sel = { kind: 'piece', sid: t.sid }; S.pieceDrag = { sid: t.sid, dx: wx - ox, dy: wy - oy }; panel(); draw(); return; }
  if (S.mode === 'routes') { if (S.view !== 'outdoor') { toWorldView(); return; } const s = sec(t.sid), [W, H] = s.tiles, side = t.x === 0 ? 'left' : t.x === W - 1 ? 'right' : t.y === 0 ? 'top' : t.y === H - 1 ? 'bottom' : null;
    if (!side) return toast('Start a route on the edge of a map piece, where it meets the next one.');
    const ex = (s.edges || {})[side], k = side === 'left' || side === 'right' ? t.y : t.x; if (ex && k >= ex.range[0] && k <= ex.range[1]) { S.sel = { kind: 'route', sid: s.id, side }; panel(); draw(); return; }
    S.routeDrag = { sid: s.id, side, k0: k, k1: k }; draw(); return; }
  if (S.stamp) {
    if (S.stamp.kind === 'prop') {   // clicking an item already on the map grabs it, so it can be dragged anywhere
      const it = itemAt(wx, wy); if (it && it.ref.kind === 'prop') { S.sel = it.ref; snap(); S.drag = true; S.propGrab = { dx: wx - it.box[0], dy: wy - it.box[1] }; panel(); draw(); return; } }
    const n0 = (LAYOUT[t.sid] || []).length; place(t);   // keep stamping until Esc so rows of lamps are quick
    if (S.stamp.kind === 'prop' && (LAYOUT[t.sid] || []).length > n0) {   // the new item follows the pointer until you let go: drop it at any pixel
      const b = propBox(LAYOUT[t.sid][n0]); S.drag = true; S.propGrab = { dx: b.pw / 2, dy: b.ph / 2 }; dragProp(wx - b.pw / 2, wy - b.ph / 2); }
    return; }
  const it = itemAt(wx, wy);
  if (it) { S.sel = it.ref; snap(); S.drag = true; if (it.ref.kind === 'prop') S.propGrab = { dx: wx - it.box[0], dy: wy - it.box[1] }; panel(); draw(); } else { S.sel = null; S.pan = [e.clientX - S.ox, e.clientY - S.oy]; panel(); draw(); }
});
cv.addEventListener('pointermove', e => {
  if (e.pointerType === 'touch' && TOUCH.has(e.pointerId)) { TOUCH.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (PINCH && TOUCH.size >= 2) { const [a, b] = [...TOUCH.values()], r = cv.getBoundingClientRect(), d = Math.hypot(a.x - b.x, a.y - b.y) || 1, mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const z = Math.max(0.25, Math.min(8, PINCH.z * d / PINCH.d)), wx0 = (PINCH.mx - r.left - PINCH.ox) / PINCH.z, wy0 = (PINCH.my - r.top - PINCH.oy) / PINCH.z;
      S.zoom = z; S.ox = mx - r.left - wx0 * z; S.oy = my - r.top - wy0 * z; draw(); return; }
    if (PINCH) return; }
  const [wx, wy] = toWorld(e), t = tileAt(wx, wy);
  if (S.pan) { S.ox = e.clientX - S.pan[0]; S.oy = e.clientY - S.pan[1]; draw(); return; }
  if (S.painting) { paint(t); return; }
  if (S.clipRect) { if (t && t.sid === S.clipRect.sid) { S.clipRect.x1 = t.x; S.clipRect.y1 = t.y; draw(); } return; }
  if (S.stampDrag && S.sel && S.sel.kind === 'stamp' && t) { const m = builtMap(S.sel.sid), st = m.stamps[S.sel.i], nx = t.x - S.stampDrag.dx, ny = t.y - S.stampDrag.dy; if (nx !== st.x || ny !== st.y) { st.x = nx; st.y = ny; bake(S.sel.sid); } return; }
  if (S.wallRect) { if (t && t.sid === S.wallRect.sid) { S.wallRect.x1 = t.x; S.wallRect.y1 = t.y; draw(); } return; }
  if (S.pieceDrag) { movePiece(wx, wy); return; }
  if (S.routeDrag) { const r = S.routeDrag, s = sec(r.sid), [ox, oy] = origin(s), [W, H] = s.tiles; r.k1 = r.side === 'left' || r.side === 'right' ? Math.max(0, Math.min(H - 1, Math.floor((wy - oy) / 16))) : Math.max(0, Math.min(W - 1, Math.floor((wx - ox) / 16))); draw(); return; }
  if (S.drag && S.propGrab && S.sel && S.sel.kind === 'prop') { dragProp(wx - S.propGrab.dx, wy - S.propGrab.dy); return; }
  if (S.drag && t && S.sel) { const p = selPos(); if (p && (p[0] !== t.x || p[1] !== t.y)) moveSel(t); return; }
  S.hover = t ? [t] : null; if (S.stamp) { if (t) S.hover = [{ ...t }]; draw(); }
  $('#where').textContent = t ? `${t.sid} ${sec(t.sid).name}  tile ${t.x},${t.y}` : '';
});
const touchEnd = e => { if (e.pointerType !== 'touch') return; TOUCH.delete(e.pointerId); if (TOUCH.size < 2 && PINCH) { PINCH = null; if (TOUCH.size === 1) { const [p] = [...TOUCH.values()]; S.pan = [p.x - S.ox, p.y - S.oy]; } } };
cv.addEventListener('pointercancel', touchEnd);
addEventListener('pointerup', e => { const wasPinch = !!PINCH; touchEnd(e); if (wasPinch || PINCH || TOUCH.size) return; if (S.clipRect) makeClip(); if (S.stampDrag) { const id = S.sel && S.sel.sid; S.stampDrag = null; if (id) stampRows(id); } if (S.wallRect) fillRect(); if (S.routeDrag) finishRoute(); S.pan = null; S.drag = false; S.painting = false; S.pieceDrag = null; S.propGrab = null; });
cv.addEventListener('wheel', e => { e.preventDefault(); const r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top, z0 = S.zoom;
  S.zoom = Math.max(0.25, Math.min(8, S.zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15))); S.ox = mx - (mx - S.ox) * S.zoom / z0; S.oy = my - (my - S.oy) * S.zoom / z0; draw(); }, { passive: false });
cv.addEventListener('contextmenu', e => e.preventDefault());
addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
  if (e.key === 'Escape') { S.stamp = null; S.sel = null; panel(); draw(); }
  else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); delSel(); }
  else if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
  else if ((e.ctrlKey || e.metaKey) && e.key === 'c' && S.sel && S.sel.kind === 'prop') { const q = LAYOUT[S.sel.sid][S.sel.i]; S.stamp = { kind: 'prop', p: q.p, flat: q.solid === false }; toast('Copied: click to place copies, Esc to stop'); }
  else if (e.key.startsWith('Arrow') && S.sel) { e.preventDefault(); const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]; nudge(d[0], d[1], e.shiftKey); }
});
function nudge(dx, dy, fine) {   // arrows: one tile (a whole scene moves one tile); fine: one pixel for props, four tiles for scenes
  const r = S.sel; if (!r) return; snap();
  if (r.kind === 'prop' && fine) { const q = LAYOUT[r.sid][r.i]; q.ox = (q.ox || 0) + dx; q.oy = (q.oy || 0) + dy; if (!q.ox) delete q.ox; if (!q.oy) delete q.oy; touch(r.sid); panel(); draw(); }
  else if (r.kind === 'piece') { const g = gridOf(sec(r.sid)).slice(), k = fine ? 4 : 1; GRID[r.sid] = [g[0] + dx * k, g[1] + dy * k]; touch(r.sid); panel(); draw(); }
  else if (r.kind === 'stamp') { const st = builtMap(r.sid).stamps[r.i]; st.x += dx; st.y += dy; bake(r.sid); stampRows(r.sid); panel(); }
  else moveSel(null, dx, dy);
}
function padHtml(fineLabel) {
  const arrow = { '0,-1': '&#9650;', '0,1': '&#9660;', '-1,0': '&#9664;', '1,0': '&#9654;' };
  const b = (dx, dy, f, t) => `<button data-nudge="${dx},${dy},${f ? 1 : 0}" title="${t}">${arrow[dx + ',' + dy]}</button>`;
  const pad = (f, label) => `<div><h4>${label}</h4><div class="pad"><span></span>${b(0, -1, f, label)}<span></span>${b(-1, 0, f, label)}<span class="c">${label}</span>${b(1, 0, f, label)}<span></span>${b(0, 1, f, label)}<span></span></div></div>`;
  return `<div class="padrow">${pad(false, '1 tile')}${fineLabel ? pad(true, fineLabel) : ''}</div>`;
}

// ---------- doors ----------
function doorAt(sid, x, y) {
  const ed = (DOORS[sid] || []).find(d => d.tile[0] === x && d.tile[1] === y); if (ed) return ed.to ? { to: ed.to, edited: true } : null;
  const s = sec(sid), o = s.objects.find(o => o.tile[0] === x && o.tile[1] === y && (o.k === 'house' || o.k === 'bay' || o.k === 'shop'));
  if (o) return { to: o.k === 'house' ? o.to : 'menu:' + o.k };
  const w = s.warps.find(w => w.tile[0] === x && w.tile[1] === y && w.kind === 'door' && w.to !== 'back'); return w ? { to: w.to, fixed: true } : null;
}
const doorName = to => !to ? 'nothing' : to === 'menu:bay' ? 'a healing counter' : to === 'menu:shop' ? 'a shop counter' : to === 'back' ? 'back outside' : ((sec(to) || {}).name || to);
function allDoors(sid) { const s = sec(sid), out = new Map(), add = (x, y) => { const d = doorAt(sid, x, y); if (d) out.set(x + ',' + y, { x, y, ...d }); };
  for (const o of s.objects) if (['house', 'bay', 'shop'].includes(o.k)) add(...o.tile);
  for (const w of s.warps) if (w.kind === 'door' && w.to !== 'back') add(...w.tile);
  for (const d of DOORS[sid] || []) add(...d.tile); return [...out.values()]; }
function setDoor(sid, x, y, to) {
  snap(); DOORS[sid] = (DOORS[sid] || []).filter(d => !(d.tile[0] === x && d.tile[1] === y)); DOORS[sid].push({ tile: [x, y], to: to || null });
  if (to) { const R = rowsOf(sid).map(r => r.split('')); if (R[y]) { R[y][x] = '#'; ROWS[sid] = R.map(r => r.join('')); }   // a door is bumped into, so its tile is solid
    const below = (rowsOf(sid)[y + 1] || '')[x]; if (below !== '.' && below !== ',') toast('Heads up: the tile in front of this door is not walkable. Paint it walkable in Walls so the player can reach it.', 6000); }
  touch(sid); panel(); draw();
}
function roomChoices() {   // rooms on this world first, then everything else
  const mine = [], other = [];
  for (const s of Object.values(ED.sections)) if (s.type === 'interior') (s.dir === S.planet ? mine : other).push(s);
  const o = s => `<option value="${s.id}">${s.id} ${s.name}${s.dir === S.planet ? '' : ' (' + (ED.planets[s.dir] || s.dir) + ')'}</option>`;
  return `<optgroup label="Rooms on this world">${mine.sort((a, b) => a.id.localeCompare(b.id)).map(o).join('')}</optgroup>
    <optgroup label="Counters (no room)"><option value="menu:bay">Healing counter: heals the team at the door</option><option value="menu:shop">Shop counter: opens the shop at the door</option></optgroup>
    <optgroup label="Rooms on other worlds">${other.sort((a, b) => a.id.localeCompare(b.id)).map(o).join('')}</optgroup>`;
}

// ---------- arranging map pieces ----------
function overlap(a, b) { const [ax, ay] = gridOf(a), [bx, by] = gridOf(b); return ax < bx + b.tiles[0] && bx < ax + a.tiles[0] && ay < by + b.tiles[1] && by < ay + a.tiles[1]; }
function toWorldView() {   // moving scenes and drawing routes happen with every outdoor map of the planet laid out together
  S.view = 'outdoor'; S.sel = null; views(); fit(); panel(); draw(); toast('Showing the whole planet. Drag any map piece to move it.');
}
function movePiece(wx, wy) {
  const d = S.pieceDrag, s = sec(d.sid), [W, H] = s.tiles; let gx = Math.round((wx - d.dx) / 16), gy = Math.round((wy - d.dy) / 16);
  const SN = 3;   // snap flush against a neighbour's edge, and line up with its top or left
  for (const o of viewSecs()) { if (o === s) continue; const [ox, oy] = gridOf(o), [ow, oh] = o.tiles;
    const vert = gy < oy + oh + SN && oy < gy + H + SN, horiz = gx < ox + ow + SN && ox < gx + W + SN;
    if (vert && Math.abs(gx - (ox + ow)) <= SN) { gx = ox + ow; if (Math.abs(gy - oy) <= SN) gy = oy; }
    else if (vert && Math.abs(gx + W - ox) <= SN) { gx = ox - W; if (Math.abs(gy - oy) <= SN) gy = oy; }
    if (horiz && Math.abs(gy - (oy + oh)) <= SN) { gy = oy + oh; if (Math.abs(gx - ox) <= SN) gx = ox; }
    else if (horiz && Math.abs(gy + H - oy) <= SN) { gy = oy - H; if (Math.abs(gx - ox) <= SN) gx = ox; } }
  const g = gridOf(s); if (g[0] !== gx || g[1] !== gy) { GRID[s.id] = [gx, gy]; touch(s.id); draw(); }
}
// ---------- travel routes between pieces ----------
const OPP = { left: 'right', right: 'left', top: 'bottom', bottom: 'top' };
function carve(id, side, band) {   // open the edge tiles of a route and carve inward until walkable ground (at most 8 tiles)
  const s = sec(id), [w, h] = s.tiles, R = rowsOf(id).map(r => r.split('')), [dx, dy] = { left: [1, 0], right: [-1, 0], top: [0, 1], bottom: [0, -1] }[side];
  for (let k = band[0]; k <= band[1]; k++) { let [x, y] = { left: [0, k], right: [w - 1, k], top: [k, 0], bottom: [k, h - 1] }[side];
    for (let st = 0; st < 8 && R[y] && R[y][x] !== undefined; st++) { const was = R[y][x]; R[y][x] = '.'; if (st > 0 && was !== '#') break; x += dx; y += dy; } }
  ROWS[id] = R.map(r => r.join('')); touch(id);
}
function finishRoute() {
  const r = S.routeDrag; S.routeDrag = null; const s = sec(r.sid), [sx, sy] = gridOf(s), [W, H] = s.tiles, lo = Math.min(r.k0, r.k1), hi = Math.max(r.k0, r.k1);
  const lr = r.side === 'left' || r.side === 'right';
  const nb = viewSecs().find(o => { if (o === s) return false; const [ox, oy] = gridOf(o), [ow, oh] = o.tiles;
    if (r.side === 'right') return ox === sx + W && oy <= sy + lo && sy + hi < oy + oh;
    if (r.side === 'left') return ox + ow === sx && oy <= sy + lo && sy + hi < oy + oh;
    if (r.side === 'bottom') return oy === sy + H && ox <= sx + lo && sx + hi < ox + ow;
    return oy + oh === sy && ox <= sx + lo && sx + hi < ox + ow; });
  if (!nb) { draw(); return toast('No map piece touches that edge along the whole route. Use Arrange to put them flush first.'); }
  const [nx, ny] = gridOf(nb), sh = lr ? sy - ny : sx - nx, band = [lo, hi], bband = [lo + sh, hi + sh], opp = OPP[r.side];
  snap();
  for (const [id, sd] of [[s.id, r.side], [nb.id, opp]]) { const old = (sec(id).edges || {})[sd]; if (old && old.to !== (id === s.id ? nb.id : s.id)) removeRoute(id, sd, true); }
  s.edges = Object.assign({}, s.edges, { [r.side]: { to: nb.id, range: band } }); nb.edges = Object.assign({}, nb.edges, { [opp]: { to: s.id, range: bband } });
  carve(s.id, r.side, band); carve(nb.id, opp, bband);
  ROUTES = ROUTES.filter(x => !((x.a === s.id && x.side === r.side) || (x.a === nb.id && x.side === opp))); ROUTES.push({ a: s.id, side: r.side, band, b: nb.id, bband });
  S.sel = { kind: 'route', sid: s.id, side: r.side }; toast(`Route: ${s.name} ${r.side} edge (${lo}-${hi}) to ${nb.name}`); panel(); draw();
}
function removeRoute(id, side, quiet) {
  const e = (sec(id).edges || {})[side]; if (!e) return; const t = sec(e.to);
  delete sec(id).edges[side]; if (t && t.edges) delete t.edges[OPP[side]];
  ROUTES = ROUTES.filter(x => !((x.a === id && x.side === side) || (t && x.a === t.id && x.side === OPP[side])));
  ROUTES.push({ a: id, side, b: t ? t.id : null, remove: true }); touch(id); if (t) touch(t.id); if (!quiet) toast('Route removed. Paint walls over the old opening if you want it closed.');
}
// ---------- free prop placement (any pixel) ----------
function dragProp(X, Y) {   // X,Y = wanted top-left of the sprite in world pixels
  const r = S.sel, q = LAYOUT[r.sid][r.i], b = propBox(q), s = sec(r.sid), [ox, oy] = origin(s), [W, H] = s.tiles; X -= ox; Y -= oy;
  const flat = q.solid === false, x = Math.max(0, Math.min(W - b.w, Math.round((X + b.pw / 2 - b.w * 8) / 16)));
  const y = flat ? Math.max(0, Math.min(H - b.h, Math.round((Y - (b.h * 16 - b.ph) / 2) / 16))) : Math.max(0, Math.min(H - b.h, Math.floor((Y + b.ph - 1) / 16) - (b.h - 1)));
  if (!((x !== q.x || y !== q.y) && canProp(r.sid, x, y, b.w, b.h, flat, r))) { q.x = x; q.y = y; }   // a footprint over a door, exit or person keeps the old tile
  q.ox = Math.round(X - (q.x * 16 + (b.w * 16 - b.pw) / 2)); q.oy = Math.round(Y - (flat ? q.y * 16 + Math.round((b.h * 16 - b.ph) / 2) : (q.y + b.h) * 16 - b.ph));
  if (!q.ox) delete q.ox; if (!q.oy) delete q.oy; touch(r.sid); draw();
}

// ---------- side panel ----------
function panel() {
  const P = $('#panel'), m = S.mode; let h = '';
  if (S.sel) h += selPanel();
  const PRE = `<div id="preview"><div class="box" id="pbox"></div><div class="cap" id="pcap">${matchMedia('(pointer:coarse)').matches ? 'Tap an item to see it large' : 'Hover over an item to see it large'}</div><div class="sizes">Item size <input type="range" id="cellsz" min="70" max="300" value="${S.cell || Math.round(Math.max(100, Math.min(200, innerWidth * 0.065)))}"></div></div>`;
  if (m === 'props') {
    h += PRE + `<h3>Props</h3><p class="hint"><b>Add:</b> pick an item below, then press on the map and drag it to the exact spot before letting go. <b>Move or remove:</b> click any item already on the map (including the ones Claude placed), drag it anywhere, or press Remove / Delete.</p>${S.stamp ? '<button id="stopstamp">Stop placing (Esc)</button>' : ''}<label>Sheet <select id="sheet">${Object.keys(ED.props).map(d => `<option ${d === S.sheet ? 'selected' : ''}>${d}</option>`).join('')}</select></label>
      <label class="row"><input type="checkbox" id="flat" ${S.flatNext ? 'checked' : ''}> place as a flat rug (walk over it)</label>
      <div class="grid">${(ED.props[S.sheet] || []).map(p => { const key = S.sheet + '/' + String(p.n).padStart(2, '0'); return `<button class="pal ${S.stamp && S.stamp.p === key ? 'on' : ''}" data-p="${key}" data-cap="${S.sheet} #${p.n} · ${p.px[0]}×${p.px[1]} px · about ${Math.max(1, Math.round(p.px[0] / 16))} tile(s) wide" title="#${p.n}"><img src="${p.url}"></button>`; }).join('')}</div>`;
  } else if (m === 'people') {
    h += PRE + `<h3>People</h3><p class="hint">Pick a character, then click the map. Drag anyone to move them.</p>
      <label>Name (optional) <input id="pname" value="${S.pname || ''}"></label><label>What they say <input id="pline" value="${S.pline || ''}" placeholder="Nice day, isn't it?"></label>
      <div class="grid">${Object.entries(ED.chars).map(([k, u]) => `<button class="pal ${S.stamp && S.stamp.art === k ? 'on' : ''}" data-c="${k}" data-cap="${k}" title="${k}"><img src="${u}"></button>`).join('')}</div>`;
  } else if (m === 'mons') {
    h += PRE + `<h3>Wild Alienmon</h3><p class="hint">Roaming Alienmon you can bump into for a battle. Placing one here replaces the automatic ones on that map piece.</p>
      <input id="msearch" placeholder="Search Alienmon" value="${S.msearch || ''}">
      <div class="grid">${Object.entries(ED.mons).filter(([k]) => !S.msearch || k.toLowerCase().includes(S.msearch.toLowerCase())).map(([k, u]) => `<button class="pal mon ${S.stamp && S.stamp.mon === k ? 'on' : ''}" data-m="${k}" data-cap="${k}" title="${k}"><span style="background-image:url(${u})"></span></button>`).join('')}</div>`;
  } else if (m === 'walls') {
    h += `<h3>Walls and walkable ground</h3><p class="hint">Pick a brush, then click a tile or press and drag to select a block of tiles; letting go fills the whole block. Doors and exits are never walled over.</p>
      <div class="hint"><b>Colours:</b> <span style="color:#7dffa0">green</span> = the player can walk here (darker green = tall grass with wild battles),
      <span style="color:#ffaa33">orange</span> = walkable but cut off (no way to get there: these are the spots to fix),
      <span style="color:#ff6070">red</span> = wall, <span style="color:#b48cff">purple</span> = ground under a prop or person.</div>
      <div class="row">${[['#', 'Wall'], ['.', 'Walkable'], [',', 'Tall grass']].map(([c, n]) => `<button class="tool ${S.brush === c ? 'on' : ''}" data-b="${c}">${n}</button>`).join('')}</div>`;
  } else if (m === 'maps') h += mapPanel();
  else if (m === 'clips') h += (S.mode === 'clips' ? `<div id="preview"><div class="box" id="pbox"></div><div class="cap" id="pcap">Hover over a clip to see it large</div></div>` : '') + clipsPanel();
  else if (m === 'doors') h += `<h3>Doors</h3><p class="hint">Click a door on the map, then choose what it opens. Cyan = doors the game already has, yellow = doors you set, grey = story doors (fixed). Any number of doors can open the same room: leaving it takes the player back out the door they came in by. To add a new Alienmon centre or house, place a building from the Props sheet, then click its door here and pick that world's Recovery Bay or house room.</p>`;
  else if (m === 'arrange') h += `<h3>Move scenes</h3><p class="hint">Every outdoor map of this world is laid out together. <b>Tap a scene</b> on the map or in the list, then <b>drag it</b> or use the <b>arrows</b> to move it. Scenes snap flush to the one beside, above or below. A <span class="bad">red outline</span> means two scenes overlap. Moving only changes the layout: use <b>Routes</b> to let the player walk across. Two fingers pan and zoom.</p>
      <div class="scenes">${planetSecs().filter(s => s.grid).sort((a, b) => a.id.localeCompare(b.id)).map(s => `<button data-scene="${s.id}" class="${S.sel && S.sel.kind === 'piece' && S.sel.sid === s.id ? 'on' : ''}">${s.id} ${s.name}</button>`).join('')}</div>`;
  else if (m === 'routes') h += `<h3>Travel routes</h3><p class="hint">Blue bars are the ways across between map pieces. To add one, press on the edge of a piece where it touches the next piece and drag along that edge to set how wide the opening is (a road is usually 4 to 6 tiles). The opening is cut through the walls on both sides. Click a bar to select it; Delete removes it. Each side of a piece can have one route.</p>
    ${ROUTES.filter(r => !r.remove).map(r => `<div>${r.a} ${r.side} ${r.band[0]}-${r.band[1]} to ${r.b}</div>`).join('')}`;
  h += `<h3>Check</h3><button id="check">Check edited maps</button><div id="checkout"></div>`;
  P.innerHTML = h; wire();
}
function selPanel() {
  const r = S.sel;
  if (r && r.kind === 'door') { const d = doorAt(r.sid, r.x, r.y), s = sec(r.sid);
    if (d && d.fixed) return `<div class="sel"><b>Story door</b><div>${s.name}, tile ${r.x},${r.y} opens ${doorName(d.to)}</div><div class="hint">This door is part of the story wiring. Ask Claude to change it.</div></div>`;
    return `<div class="sel"><b>${d ? 'Door' : 'New door'}</b><div>${s.name}, tile ${r.x},${r.y}${d ? ' opens ' + doorName(d.to) : ''}</div>
      <label>Opens <select id="doorto"><option value="">Choose a room...</option>${roomChoices()}</select></label>
      <div class="row"><button id="doorset">Set door</button>${d ? '<button id="doorrm">Remove door</button>' : ''}${d && d.to && sec(d.to) ? `<button id="dooropen">Open ${doorName(d.to)}</button>` : ''}</div>
      <div class="hint">The door tile becomes solid (you walk into it to go in). The tile in front of it must be walkable.</div></div>`; }
  if (r && r.kind === 'stamp') { const st = builtMap(r.sid).stamps[r.i], c = clipById(st.c); return `<div class="sel"><b>Stamp: ${c ? c.name : st.c}</b><div>at ${st.x},${st.y}</div><div class="hint">Drag to move, or use the arrows</div>${padHtml('')}<button id="del">Remove</button></div>`; }
  if (r && r.kind === 'piece') { const s = sec(r.sid), g = gridOf(s), bad = viewSecs().some(o => o !== s && overlap(s, o)); return `<div class="sel"><b>Moving: ${s.id} ${s.name}</b><div>at ${g[0]}, ${g[1]} (tiles), ${s.tiles[0]}x${s.tiles[1]} ${bad ? '<span class="bad">overlaps another scene</span>' : '<span class="good">no overlap</span>'}</div>
    <div class="hint">Drag it on the map with one finger, or use the arrows. It snaps flush to the scene beside, above or below it.</div>${padHtml('4 tiles')}<div class="row"><button id="pdone">Done</button><button id="pfind">Show it</button></div></div>`; }
  if (r && r.kind === 'route') { const s = sec(r.sid), e = (s.edges || {})[r.side]; return e ? `<div class="sel"><b>Route</b><div>${s.name}, ${r.side} edge ${e.range[0]}-${e.range[1]}, to ${(sec(e.to) || {}).name || e.to}</div><button id="del">Remove route</button></div>` : ''; }
  const p = selPos(); if (!p) return '';
  let name = r.kind === 'prop' ? 'Prop ' + LAYOUT[r.sid][r.i].p : r.kind === 'mon' ? monsOf(r.sid)[r.i].mon : (npcsOf(r.sid).find(n => same(n.ref, r)) || {}).name || 'Townsperson';
  let extra = '';
  if (r.kind === 'prop') { const q = LAYOUT[r.sid][r.i]; extra = `<label>Solid rows (for buildings: how many tiles deep it blocks) <input id="ph" type="number" min="1" max="8" value="${q.h || 1}"></label>`; }
  if (r.kind === 'added') { const a = ADDED[r.sid][r.i]; extra = `<label>Name <input id="ename" value="${a.name || ''}"></label><label>Says <textarea id="eline">${(a.t || []).join('\n')}</textarea></label>`; }
  return `<div class="sel"><b>${name}</b><div>${r.sid} ${sec(r.sid).name} · tile ${p[0]},${p[1]}</div>${extra}
    ${padHtml(r.kind === 'prop' ? '1 pixel' : '')}<div class="hint">Drag to move${r.kind === 'prop' ? ' anywhere, to the pixel (its solid footprint follows the tile under its base)' : ''} · arrows move a tile${r.kind === 'prop' ? ' · Shift+arrows nudge a pixel · Ctrl+C copy' : ''} · Delete removes</div><button id="del">Remove</button></div>`;
}
function mapPanel() {
  const outs = planetSecs().filter(s => s.grid);
  return `<h3>Grow this world</h3><p class="hint">Upload a new map render (same style and scale as the others: 64 px per tile, 1536×1024 wide or 1024×1024 square) and attach it to the edge of an existing map piece.</p>
    <input type="file" id="mfile" accept="image/*">
    <label>Name <input id="mname" placeholder="e.g. Rimwalk Trail Part C"></label>
    <label>Kind <select id="mtype"><option>route</option><option>town</option><option>field</option><option>landmark</option><option value="interior">interior room (Recovery Bay, shop, house...)</option></select></label>
    <label>Attach to <select id="mto">${outs.map(s => `<option value="${s.id}">${s.id} ${s.name}</option>`).join('')}</select></label>
    <label>On its <select id="mside"><option>right</option><option>left</option><option>top</option><option>bottom</option></select> edge</label>
    <label>Opening, tiles <input id="mband" value="5-10" size="6"> (rows for left/right, columns for top/bottom)</label>
    <button id="madd">Add map piece</button>
    <p class="hint">The new piece starts fully walkable inside a wall border with the opening cut on the joining edge. Use Walls to paint its walls, then dress it.</p>
    ${MAPS.length ? '<h4>Added this session</h4>' + MAPS.map(m => `<div>${m.id} ${m.name} → ${m.attach.side} of ${m.attach.to}</div>`).join('') : ''}`;
}
function showPreview(b) {
  const box = $('#pbox'), cap = $('#pcap'); if (!box) return;
  const im = b.querySelector('img'), sp = b.querySelector('span');
  box.innerHTML = im ? `<img src="${im.src}">` : sp ? `<span style="${sp.getAttribute('style')}"></span>` : ''; cap.textContent = b.dataset.cap || '';
}
function wire() {
  const on = (sel, ev, f) => { const el = $(sel); if (el) el.addEventListener(ev, f); };
  document.querySelectorAll('.pal').forEach(b => { b.addEventListener('mouseenter', () => showPreview(b)); b.addEventListener('focus', () => showPreview(b)); });
  const cur = document.querySelector('.pal.on'); if (cur) showPreview(cur);
  on('#cellsz', 'input', e => { S.cell = +e.target.value; document.documentElement.style.setProperty('--cell', S.cell + 'px'); try { localStorage.setItem('ed_cell', S.cell); } catch (x) {} });
  on('#sheet', 'change', e => { S.sheet = e.target.value; panel(); });
  on('#flat', 'change', e => { S.flatNext = e.target.checked; if (S.stamp && S.stamp.kind === 'prop') S.stamp.flat = S.flatNext; });
  document.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { S.stamp = { kind: 'prop', p: b.dataset.p, flat: !!S.flatNext }; S.sel = null; panel(); });
  document.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { S.stamp = { kind: 'char', art: b.dataset.c, name: S.pname, line: S.pline }; S.sel = null; panel(); });
  document.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { S.stamp = { kind: 'mon', mon: b.dataset.m }; S.sel = null; panel(); });
  document.querySelectorAll('[data-b]').forEach(b => b.onclick = () => { S.brush = b.dataset.b; panel(); });
  on('#pname', 'input', e => { S.pname = e.target.value; if (S.stamp) S.stamp.name = S.pname; });
  on('#pline', 'input', e => { S.pline = e.target.value; if (S.stamp) S.stamp.line = S.pline; });
  on('#msearch', 'input', e => { S.msearch = e.target.value; const pos = e.target.selectionStart; panel(); const i = $('#msearch'); i.focus(); i.setSelectionRange(pos, pos); });
  on('#del', 'click', delSel);
  document.querySelectorAll('[data-nudge]').forEach(b => b.onclick = () => { const [dx, dy, f] = b.dataset.nudge.split(',').map(Number); nudge(dx, dy, !!f); });
  document.querySelectorAll('[data-scene]').forEach(b => b.onclick = () => { if (S.view !== 'outdoor') { S.view = 'outdoor'; views(); } S.sel = { kind: 'piece', sid: b.dataset.scene }; centerOn(b.dataset.scene); panel(); });
  on('#pdone', 'click', () => { S.sel = null; panel(); draw(); }); on('#pfind', 'click', () => S.sel && centerOn(S.sel.sid));
  { const cur = document.querySelector('.pal.on'); if (cur) showPreview(cur); }
  on('#stopstamp', 'click', () => { S.stamp = null; panel(); draw(); });
  on('#ename', 'input', e => { const a = ADDED[S.sel.sid][S.sel.i]; a.name = e.target.value; touch(S.sel.sid); });
  on('#eline', 'input', e => { const a = ADDED[S.sel.sid][S.sel.i]; a.t = e.target.value.split('\n').filter(Boolean); touch(S.sel.sid); });
  on('#check', 'click', check);
  document.querySelectorAll('[data-clip]').forEach(b => b.onclick = () => { S.clipSel = b.dataset.clip; S.stamp = builtMap(S.view) ? { kind: 'clip', c: b.dataset.clip } : null; panel(); });
  on('#clipsall', 'change', e => { S.clipsAll = e.target.checked; panel(); });
  on('#cliprm', 'click', () => { if (MAPS.some(m => m.built && (m.ground === S.clipSel || (m.stamps || []).some(st => st.c === S.clipSel)))) return toast('That clip is used on a map; remove those stamps first.'); snap(); CLIPS = CLIPS.filter(c => c.id !== S.clipSel); DIRTY.add('clips'); $('#save').classList.add('hot'); S.clipSel = null; S.stamp = null; panel(); });
  on('#clipground', 'click', () => { const m = builtMap(S.view); snap(); m.ground = S.clipSel; bake(S.view); stampRows(S.view); });
  on('#bmake', 'click', () => { const name = ($('#bname').value || '').trim(); if (!name) return toast('Give the new map a name.'); newBlank(name, Math.max(8, Math.min(48, +$('#bw').value || 24)), Math.max(8, Math.min(48, +$('#bh').value || 16)), $('#btype').value, $('#bground').value, $('#bcolor').value); });
  on('#doorset', 'click', () => { const v = $('#doorto').value; if (!v) return toast('Choose a room first.'); setDoor(S.sel.sid, S.sel.x, S.sel.y, v); toast('Door set: opens ' + doorName(v)); });
  on('#doorrm', 'click', () => setDoor(S.sel.sid, S.sel.x, S.sel.y, null));
  on('#dooropen', 'click', () => { const d = doorAt(S.sel.sid, S.sel.x, S.sel.y); S.view = d.to; S.sel = null; views(); panel(); fit(); });
  on('#ph', 'input', e => { const q = LAYOUT[S.sel.sid][S.sel.i]; snap(); const h = Math.max(1, Math.min(8, +e.target.value || 1)); if (h > 1) q.h = h; else delete q.h; touch(S.sel.sid); draw(); });
  on('#madd', 'click', addMap);
}

// ---------- checks ----------
function check() {
  const out = [];
  for (const id of DIRTY) { const s = sec(id); if (!s || !rowsOf(id).length) continue; const [W, H] = s.tiles, R = rowsOf(id), block = new Set();
    for (const q of LAYOUT[id] || []) { if (q.solid === false) continue; const b = propBox(q); if (b) for (let j = 0; j < b.h; j++) for (let i = 0; i < b.w; i++) block.add((q.x + i) + ',' + (q.y + j)); }
    for (const n of npcsOf(id)) block.add(n.x + ',' + n.y); for (const m of monsOf(id)) block.add(m.x + ',' + m.y);
    const walk = (x, y) => x >= 0 && y >= 0 && x < W && y < H && '.,'.includes((R[y] || '')[x]) && !block.has(x + ',' + y);
    const keys = [...blockedKeys(id)].map(k => k.split(',').map(Number)).filter(([x, y]) => walk(x, y) || s.warps.some(w => w.tile[0] === x && w.tile[1] === y));
    const starts = keys.filter(([x, y]) => walk(x, y)); if (!starts.length) continue;
    const seen = new Set([starts[0].join(',')]), q = [starts[0]];
    while (q.length) { const [x, y] = q.shift(); for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = (x + a) + ',' + (y + b); if (!seen.has(k) && walk(x + a, y + b)) { seen.add(k); q.push([x + a, y + b]); } } }
    const cut = starts.filter(k => !seen.has(k.join(',')));
    out.push(cut.length ? `<div class="bad">${id} ${s.name}: ${cut.length} door/exit tile(s) cut off, e.g. ${cut[0]}</div>` : `<div class="good">${id} ${s.name}: all doors and exits reachable</div>`); }
  $('#checkout').innerHTML = out.join('') || '<div class="hint">No edited maps yet.</div>';
  return !out.some(o => o.includes('class="bad"'));
}

// ---------- growing a world ----------
async function addMap() {
  const f = $('#mfile').files[0], name = ($('#mname').value || '').trim(); if (!f || !name) return toast('Choose an image and give it a name.');
  if ($('#mtype').value === 'interior') return addRoom(f, name);
  const to = $('#mto').value, side = $('#mside').value, band = ($('#mband').value || '5-10').split('-').map(Number), t = sec(to);
  if ((t.edges || {})[side] || MAPS.some(m => m.attach.to === to && m.attach.side === side)) return toast(`${to} already has an exit on its ${side} edge.`);
  const im = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(f); });
  const per = im.naturalWidth >= 600 ? 64 : 16, W = Math.max(8, Math.round(im.naturalWidth / per)), H = Math.max(8, Math.round(im.naturalHeight / per));
  const c = document.createElement('canvas'); c.width = W * 16; c.height = H * 16; const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(im, 0, 0, W * 16, H * 16);
  const used = new Set(Object.keys(ED.sections)); let n = 300; while (used.has(String(n))) n++; const id = String(n);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''), dir = t.dir, url = c.toDataURL('image/png');
  const opp = { left: 'right', right: 'left', top: 'bottom', bottom: 'top' }[side];
  const R = Array.from({ length: H }, (_, y) => Array.from({ length: W }, (_, x) => (x === 0 || y === 0 || x === W - 1 || y === H - 1) ? '#' : '.'));
  // cut the opening on that edge and carve inward until it meets walkable ground (at most 8 tiles), so the join is never a dead wall
  const open = (rows, s2, w, h) => { const [dx, dy] = { left: [1, 0], right: [-1, 0], top: [0, 1], bottom: [0, -1] }[s2];
    for (let k = band[0]; k <= band[1]; k++) { let [x, y] = { left: [0, k], right: [w - 1, k], top: [k, 0], bottom: [k, h - 1] }[s2];
      for (let step = 0; step < 8 && rows[y] && rows[y][x] !== undefined; step++) { const was = rows[y][x]; rows[y][x] = '.'; if (step > 0 && was !== '#') break; x += dx; y += dy; } } };
  open(R, opp, W, H);
  const TR = rowsOf(to).map(r => r.split('')); open(TR, side, ...t.tiles); ROWS[to] = TR.map(r => r.join('')); touch(to);
  const tg = gridOf(t), grid = tg ? { right: [tg[0] + t.tiles[0], tg[1]], left: [tg[0] - W, tg[1]], bottom: [tg[0], tg[1] + t.tiles[1]], top: [tg[0], tg[1] - H] }[side] : null;
  ED.sections[id] = { id, name, planet: t.planet, dir, type: $('#mtype').value, tiles: [W, H], grid, img: url, rows: R.map(r => r.join('')), edges: { [opp]: { to, range: band } }, warps: [], objects: [], spawns: {}, npcs: [], mons: [] };
  t.edges = Object.assign({}, t.edges, { [side]: { to: id, range: band } });
  ROWS[id] = ED.sections[id].rows; NEWIMG[id] = url; touch(id);
  MAPS.push({ id, name, dir, planet: t.planet, type: $('#mtype').value, tiles: [W, H], img: `art/sections_game/${dir}/${id}_${slug}.png`, attach: { to, side, band } });
  toast(`Added ${id} ${name} (${W}×${H} tiles). Paint its walls, then dress it.`); panel(); draw();
}

async function addRoom(f, name) {   // a new interior: walls round the edge, a 2-tile doormat in the middle of the bottom wall
  const im = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(f); });
  const per = im.naturalWidth >= 600 ? 64 : 16, W = Math.max(8, Math.round(im.naturalWidth / per)), H = Math.max(8, Math.round(im.naturalHeight / per));
  const c = document.createElement('canvas'); c.width = W * 16; c.height = H * 16; const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(im, 0, 0, W * 16, H * 16);
  const used = new Set(Object.keys(ED.sections)); let n = 300; while (used.has(String(n))) n++; const id = String(n), dir = S.planet, url = c.toDataURL('image/png');
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''), cx = Math.floor(W / 2) - 1;
  const R = Array.from({ length: H }, (_, y) => Array.from({ length: W }, (_, x) => (x <= 1 || y <= 3 || x >= W - 2 || y >= H - 1) ? '#' : '.'));
  R[H - 1][cx] = R[H - 1][cx + 1] = '.';
  ED.sections[id] = { id, name, planet: ED.planets[dir], dir, type: 'interior', tiles: [W, H], grid: null, img: url, rows: R.map(r => r.join('')), edges: {},
    warps: [{ tile: [cx, H - 1], to: 'back', kind: 'door' }, { tile: [cx + 1, H - 1], to: 'back', kind: 'door' }], objects: [], spawns: { default: [cx, H - 2] }, npcs: [], mons: [] };
  ROWS[id] = ED.sections[id].rows; NEWIMG[id] = url; touch(id);
  MAPS.push({ id, name, dir, planet: ED.planets[dir], type: 'interior', tiles: [W, H], img: `art/sections_game/${dir}/${id}_${slug}.png` });
  S.view = id; views(); fit(); S.mode = 'walls'; document.querySelectorAll('[data-mode]').forEach(x => x.classList.toggle('on', x.dataset.mode === 'walls'));
  toast(`Room ${id} ${name} added (${W}x${H} tiles). Paint its walls and furniture as walls, then use Doors to point doors at it.`, 9000); panel(); draw();
}

// ---------- clips and blank maps built from them ----------
const clipById = id => CLIPS.find(c => c.id === id);
const builtMap = id => MAPS.find(m => m.id === id && m.built);
function clipImg(c) { return img(CLIPIMG[c.id] || c.url); }
function makeClip() {
  const r = S.clipRect; S.clipRect = null; const s = sec(r.sid), x0 = Math.min(r.x0, r.x1), y0 = Math.min(r.y0, r.y1), w = Math.abs(r.x1 - r.x0) + 1, h = Math.abs(r.y1 - r.y0) + 1;
  if (w * h < 2) { draw(); return toast('Drag a box around the piece you want to clip.'); }
  const name = prompt(`Name this clip (${w}x${h} tiles from ${s.name}):`, 'road'); if (!name) { draw(); return; }
  const src = NEWIMG[s.id] ? img(NEWIMG[s.id]) : img(s.img); if (!ok(src)) { draw(); return toast('That map image is still loading, try again.'); }
  const c = document.createElement('canvas'); c.width = w * 16; c.height = h * 16; c.getContext('2d').drawImage(src, x0 * 16, y0 * 16, w * 16, h * 16, 0, 0, w * 16, h * 16);
  const R = rowsOf(s.id), rows = Array.from({ length: h }, (_, j) => (R[y0 + j] || '').slice(x0, x0 + w).padEnd(w, '#'));
  let n = 1; while (clipById('c' + n)) n++; const id = 'c' + n;
  snap(); CLIPIMG[id] = c.toDataURL('image/png'); CLIPS.push({ id, name: name.trim(), dir: s.dir, w, h, rows, from: s.id }); $('#save').classList.add('hot'); DIRTY.add('clips');
  toast(`Clip "${name}" saved (${w}x${h}). It is in the Clips library on the right.`); panel(); draw();
}
function bake(id) {   // redraw a built map: the ground (a clip repeated, or a plain colour), then every stamp in order
  const m = builtMap(id), s = sec(id), [W, H] = s.tiles, cv2 = document.createElement('canvas'); cv2.width = W * 16; cv2.height = H * 16; const g = cv2.getContext('2d');
  g.fillStyle = m.color || '#6b5b45'; g.fillRect(0, 0, W * 16, H * 16);
  const gc = m.ground && clipById(m.ground), gi = gc && clipImg(gc);
  if (gc && ok(gi)) for (let y = 0; y < H; y += gc.h) for (let x = 0; x < W; x += gc.w) g.drawImage(gi, x * 16, y * 16);
  for (const st of m.stamps || []) { const c = clipById(st.c), ci = c && clipImg(c); if (c && ok(ci)) g.drawImage(ci, st.x * 16, st.y * 16); }
  NEWIMG[id] = cv2.toDataURL('image/png'); touch(id); draw();
}
function stampRows(id) {   // collision: the ground clip's walls repeated, then each stamp's walls on top
  const m = builtMap(id), s = sec(id), [W, H] = s.tiles, gc = m.ground && clipById(m.ground);
  const R = Array.from({ length: H }, (_, y) => Array.from({ length: W }, (_, x) => gc ? gc.rows[y % gc.h][x % gc.w] : '.'));
  for (const st of m.stamps || []) { const c = clipById(st.c); if (!c) continue; for (let j = 0; j < c.h; j++) for (let i = 0; i < c.w; i++) { const y = st.y + j, x = st.x + i; if (R[y] && R[y][x] !== undefined) R[y][x] = c.rows[j][i]; } }
  for (const [side, e] of Object.entries(s.edges || {})) for (let k = e.range[0]; k <= e.range[1]; k++) { const [x, y] = { left: [0, k], right: [W - 1, k], top: [k, 0], bottom: [k, H - 1] }[side]; if (R[y]) R[y][x] = '.'; }
  for (const w of s.warps || []) if (R[w.tile[1]]) R[w.tile[1]][w.tile[0]] = '.';
  ROWS[id] = R.map(r => r.join('')); touch(id); draw();
}
function placeStamp(t) {
  const m = builtMap(S.view); if (!m || !t || t.sid !== S.view) return; snap(); (m.stamps = m.stamps || []).push({ c: S.stamp.c, x: t.x, y: t.y });
  S.sel = { kind: 'stamp', sid: S.view, i: m.stamps.length - 1 }; bake(S.view); stampRows(S.view); panel();
}
function newBlank(name, W, H, type, ground, color) {
  const used = new Set(Object.keys(ED.sections)); let n = 300; while (used.has(String(n))) n++; const id = String(n), dir = S.planet;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const outs = planetSecs().filter(x => gridOf(x)), maxX = outs.reduce((a, x) => Math.max(a, gridOf(x)[0] + x.tiles[0]), 0), minY = outs.reduce((a, x) => Math.min(a, gridOf(x)[1]), 0);
  const grid = type === 'interior' ? null : [maxX + 4, minY];
  ED.sections[id] = { id, name, planet: ED.planets[dir], dir, type, tiles: [W, H], grid, img: '', rows: [], edges: {}, warps: [], objects: [], spawns: {}, npcs: [], mons: [] };
  if (grid) GRID[id] = grid;
  const m = { id, name, dir, planet: ED.planets[dir], type, tiles: [W, H], img: `art/sections_game/${dir}/${id}_${slug}.png`, built: true, ground: ground || null, color: color || '#6b5b45', stamps: [] };
  if (type === 'interior') { const cx = Math.floor(W / 2) - 1; ED.sections[id].warps = [{ tile: [cx, H - 1], to: 'back', kind: 'door' }, { tile: [cx + 1, H - 1], to: 'back', kind: 'door' }]; ED.sections[id].spawns = { default: [cx, H - 2] }; }
  MAPS.push(m); bake(id); stampRows(id); ED.sections[id].img = NEWIMG[id];
  S.view = id; views(); fit(); toast(`New map ${id} ${name} (${W}x${H}). Pick clips on the right and click to stamp them.${grid ? ' Then use Arrange and Routes to join it to the world.' : ' Then point doors at it with Doors.'}`, 9000); panel(); draw();
}
function clipsPanel() {
  const m = S.view !== 'outdoor' && builtMap(S.view), list = CLIPS.filter(c => !S.clipsAll ? c.dir === S.planet : true);
  return `<h3>Clips</h3><p class="hint">${m ? 'Click a clip, then click the map to stamp it. Drag a stamp to move it; Delete removes it. Stamps bring their walls and walkable ground with them.' : 'On any map, press and drag a box around a piece (a road, rocks, a cliff, water) to clip it into the library. Clips from the same world blend best.'}</p>
    <label class="row"><input type="checkbox" id="clipsall" ${S.clipsAll ? 'checked' : ''}> show clips from every world</label>
    <div class="grid">${list.map(c => `<button class="pal ${S.stamp && S.stamp.c === c.id ? 'on' : ''}" data-clip="${c.id}" data-cap="${c.name} · ${c.w}x${c.h} tiles · from ${c.from}" title="${c.name}"><img src="${CLIPIMG[c.id] || c.url}"></button>`).join('') || '<div class="hint">No clips yet.</div>'}</div>
    ${S.clipSel ? `<div class="row" style="margin-top:6px"><button id="cliprm">Delete clip ${S.clipSel}</button>${m ? `<button id="clipground">Use ${S.clipSel} as the ground</button>` : ''}</div>` : ''}
    <h3>New map from clips</h3>
    <label>Name <input id="bname" placeholder="e.g. Hidden Canyon"></label>
    <div class="row"><label>Width <input id="bw" type="number" value="24" min="8" max="48" style="width:70px"></label><label>Height <input id="bh" type="number" value="16" min="8" max="48" style="width:70px"></label></div>
    <label>Kind <select id="btype"><option>route</option><option>town</option><option>field</option><option>landmark</option><option value="interior">interior room</option></select></label>
    <label>Ground <select id="bground"><option value="">Plain colour</option>${list.map(c => `<option value="${c.id}">${c.name} (repeated)</option>`).join('')}</select></label>
    <label>Colour <input id="bcolor" type="color" value="#6b5b45"></label>
    <button id="bmake">Create blank map</button>`;
}

// ---------- saving ----------
function bundle() {
  const npcs = { moves: MOVES, added: ADDED, removed: REMOVED };
  const coll = {}; for (const id of Object.keys(ROWS)) coll[id] = { id, name: sec(id).name, tiles: sec(id).tiles, edited: true, legend: { '.': 'walk', '#': 'blocked', ',': 'tall grass' }, rows: ROWS[id] };
  const images = {}; for (const m of MAPS) if (NEWIMG[m.id]) images[m.img] = NEWIMG[m.id];
  for (const c of CLIPS) if (CLIPIMG[c.id]) images['art/editor_clips/' + c.id + '.png'] = CLIPIMG[c.id];
  const clips = CLIPS.map(({ url, ...c }) => c);
  return { version: 1, layout: LAYOUT, npcs, mons: MONS, maps: MAPS, collision: coll, images, grid: GRID, routes: ROUTES, doors: DOORS, clips };
}
let DIR = null;
async function save() {
  if (DIRTY.size && !check() && !confirm('Some doors or exits are cut off on the maps listed under Check. Save anyway?')) return;
  const b = bundle();
  if (!/^(localhost|127\.)/.test(location.hostname)) return webSave(b);   // on the test link: save through Vercel -> GitHub
  if (!window.showDirectoryPicker) { download(b); return; }
  try {
    if (!DIR) { DIR = await showDirectoryPicker({ id: 'alienmon-app', mode: 'readwrite' });
      try { await (await DIR.getDirectoryHandle('tools')).getFileHandle('build.js'); } catch (e) { DIR = null; return toast('Pick the alienmon-app folder (the one with tools and data inside).'); } }
    const put = async (rel, data) => { const parts = rel.split('/'); let d = DIR; for (const p of parts.slice(0, -1)) d = await d.getDirectoryHandle(p, { create: true });
      const fh = await d.getFileHandle(parts[parts.length - 1], { create: true }), w = await fh.createWritable(); await w.write(data); await w.close(); };
    await put('data/sections/props_layout.json', JSON.stringify(b.layout, null, 0));
    await put('data/editor/npcs.json', JSON.stringify(b.npcs, null, 1));
    await put('data/editor/mons.json', JSON.stringify(b.mons, null, 1));
    await put('data/editor/maps.json', JSON.stringify(b.maps, null, 1));
    await put('data/editor/grid.json', JSON.stringify(b.grid, null, 1));
    await put('data/editor/routes.json', JSON.stringify(b.routes, null, 1));
    await put('data/editor/doors.json', JSON.stringify(b.doors, null, 1));
    await put('data/editor/clips.json', JSON.stringify(b.clips, null, 1));
    for (const [id, c] of Object.entries(b.collision)) await put(`data/collision/${id}.json`, JSON.stringify(c));
    for (const [rel, url] of Object.entries(b.images)) await put(rel, await (await fetch(url)).blob());
    DIRTY.clear(); $('#save').classList.remove('hot');
    toast('Saved into the game folder. Run tools\\editor\\apply.cmd (or ask Claude to apply the editor changes) to rebuild and publish.', 9000);
  } catch (e) { if (e.name !== 'AbortError') { console.error(e); toast('Could not save to the folder, downloading the changes instead.'); download(b); } }
}
async function webSave(b) {
  toast('Saving...', 20000);
  try {
    const r = await fetch('/api/editor-save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }), j = await r.json().catch(() => ({}));
    if (!r.ok || !j.ok) { toast((j.error || 'Save failed (' + r.status + ').') + ' Downloading your changes instead so nothing is lost.', 9000); download(b); return; }
    DIRTY.clear(); $('#save').classList.remove('hot');
    toast('Saved. The game rebuilds itself; your changes show on the test link in about 3 to 5 minutes.', 9000);
  } catch (e) { toast('Could not reach the save service. Downloading your changes instead.', 9000); download(b); }
}
function download(b) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(b)], { type: 'application/json' })); a.download = 'editor_changes.json'; a.click();
  toast('Downloaded editor_changes.json. Send it to Claude, or run: python tools/editor/apply.py --from editor_changes.json', 9000); }

// ---------- chrome ----------
let TT = null;
function toast(t, ms = 3000) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(TT); TT = setTimeout(() => el.classList.remove('on'), ms); }
function centerOn(id) { const s = sec(id); if (!s) return; const [ox, oy] = origin(s), [W, H] = s.tiles; S.ox = cv.clientWidth / 2 - (ox + W * 8) * S.zoom; S.oy = cv.clientHeight / 2 - (oy + H * 8) * S.zoom; draw(); }
function fit() { const ss = viewSecs(); if (!ss.length) return; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const s of ss) { const [ox, oy] = origin(s); x0 = Math.min(x0, ox); y0 = Math.min(y0, oy); x1 = Math.max(x1, ox + s.tiles[0] * 16); y1 = Math.max(y1, oy + s.tiles[1] * 16); }
  S.zoom = Math.max(0.25, Math.min(6, Math.min(cv.clientWidth / (x1 - x0 + 40), cv.clientHeight / (y1 - y0 + 40)))); S.ox = 20 - x0 * S.zoom; S.oy = 20 - y0 * S.zoom; draw(); }
function views() { const ss = planetSecs().sort((a, b) => a.id.localeCompare(b.id));
  $('#view').innerHTML = `<option value="outdoor">Whole world (outdoor maps stitched)</option>` + ss.map(s => `<option value="${s.id}" ${S.view === s.id ? 'selected' : ''}>${s.id} ${s.name}${s.grid ? '' : ' (inside)'}</option>`).join(''); $('#view').value = S.view; }
async function boot() {
  ED = await (await fetch('editor_data.json', { cache: 'no-store' })).json();
  LAYOUT = ED.layout || {}; MOVES = (ED.edits.npcs || {}).moves || {}; ADDED = (ED.edits.npcs || {}).added || {}; REMOVED = (ED.edits.npcs || {}).removed || {}; MONS = ED.edits.mons || {}; MAPS = ED.edits.maps || []; GRID = ED.edits.grid || {}; ROUTES = ED.edits.routes || []; DOORS = ED.edits.doors || {}; CLIPS = ED.edits.clips || [];
  const dirs = Object.keys(ED.planets).sort(); S.planet = dirs[0]; S.sheet = Object.keys(ED.props).find(d => d === S.planet) || Object.keys(ED.props)[0];
  $('#planet').innerHTML = dirs.map(d => `<option value="${d}">${ED.planets[d]}</option>`).join('');
  $('#planet').onchange = e => { S.planet = e.target.value; S.view = 'outdoor'; S.sel = null; if (ED.props[S.planet]) S.sheet = S.planet; views(); panel(); fit(); };
  $('#view').onchange = e => { S.view = e.target.value; S.sel = null; fit(); };
  document.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { b.scrollIntoView({ block: 'nearest', inline: 'center' }); S.mode = b.dataset.mode; S.stamp = null; document.querySelectorAll('[data-mode]').forEach(x => x.classList.toggle('on', x === b)); if ((S.mode === 'arrange' || S.mode === 'routes') && S.view !== 'outdoor') toWorldView(); panel(); draw(); });
  $('#walls').onchange = e => { S.walls = e.target.checked; draw(); }; $('#showdoors').onchange = draw;
  $('#zin').onclick = () => { S.zoom = Math.min(8, S.zoom * 1.25); draw(); }; $('#zout').onclick = () => { S.zoom = Math.max(0.25, S.zoom / 1.25); draw(); }; $('#zfit').onclick = fit;
  $('#undo').onclick = undo; $('#save').onclick = save;
  addEventListener('beforeunload', e => { if (DIRTY.size) { e.preventDefault(); e.returnValue = ''; } });
  try { const c = +localStorage.getItem('ed_cell'); if (c) { S.cell = c; document.documentElement.style.setProperty('--cell', c + 'px'); } const w = +localStorage.getItem('ed_panel'); if (w) document.documentElement.style.setProperty('--pw', w + 'px'); } catch (x) {}
  const sz = $('#sizer'); let drag = null;
  const vertical = () => getComputedStyle(sz).cursor === 'row-resize';   // phone layout: the grip resizes the bottom panel
  try { const ph = +localStorage.getItem('ed_ph'); if (ph) document.documentElement.style.setProperty('--ph', ph + 'px'); } catch (x) {}
  sz.addEventListener('pointerdown', e => { const pr = $('#panel').getBoundingClientRect(); drag = { x: e.clientX, y: e.clientY, w: pr.width, h: pr.height, moved: false }; sz.setPointerCapture(e.pointerId); });
  sz.addEventListener('pointermove', e => { if (!drag) return;
    if (vertical()) { if (Math.abs(e.clientY - drag.y) > 4) drag.moved = true; const h = Math.max(90, Math.min(innerHeight * 0.8, drag.h + drag.y - e.clientY)); document.documentElement.style.setProperty('--ph', h + 'px'); }
    else { const w = Math.max(320, Math.min(innerWidth * 0.75, drag.w + drag.x - e.clientX)); document.documentElement.style.setProperty('--pw', w + 'px'); }
    resize(); });
  sz.addEventListener('pointerup', () => { if (!drag) return;
    if (vertical()) { if (!drag.moved) { const steps = [0.22, 0.44, 0.68].map(f => Math.round(innerHeight * f)), nx = steps.find(v => v > drag.h + 10) || steps[0]; document.documentElement.style.setProperty('--ph', nx + 'px'); resize(); }   // a tap steps small / half / tall
      try { localStorage.setItem('ed_ph', Math.round($('#panel').getBoundingClientRect().height)); } catch (x) {} }
    else { try { localStorage.setItem('ed_panel', Math.round($('#panel').getBoundingClientRect().width)); } catch (x) {} }
    drag = null; });
  addEventListener('resize', resize); new ResizeObserver(resize).observe($('#mapwrap')); views(); panel(); resize(); fit();
}
boot().catch(e => { document.body.insertAdjacentHTML('beforeend', `<p style="color:#f66;padding:16px">Could not load the editor data: ${e.message}</p>`); });
