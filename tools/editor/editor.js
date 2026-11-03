// Alienmon map editor: place props, people and wild Alienmon on the section maps, paint walls, and grow a world with new map pieces.
// Terrain painting and the Sprite Studio live in studio.js; playtest, encounters, people, items, checks and versions in design.js/play.js.
// Loads editor_data.json (written by tools/build.js on prototype builds). Saves straight into the alienmon-app folder (Chrome/Edge
// desktop: File System Access) or downloads editor_changes.json; tools/editor/apply.py turns either into a rebuilt game.
'use strict';
const $ = s => document.querySelector(s);
let ED = null;
const IMGS = {};
const img = u => { if (!u) return null; if (!IMGS[u]) { const i = new Image(); i.onload = () => draw(); i.src = u; IMGS[u] = i; } return IMGS[u]; };
const ok = i => i && i.complete && i.naturalWidth;

// ---------- working state ----------
const S = { planet: null, view: 'outdoor', mode: 'props', zoom: 2, ox: 40, oy: 40, sheet: null, stamp: null, sel: null, walls: false, brush: '.', drag: null, pan: null, clipTool: 'cut', wtool: 'box', ghost: null, hand: false };
let LAYOUT = {}, MOVES = {}, ADDED = {}, REMOVED = {}, MONS = {}, MAPS = [], ROWS = {}, NEWIMG = {}, GRID = {}, ROUTES = [], DOORS = {}, CLIPS = [], CLIPIMG = {};
const DIRTY = new Set();
const HIST = [];
const edgeSnap = () => Object.fromEntries(Object.values(ED.sections).map(s => [s.id, s.edges]));
function snap() { HIST.push(JSON.stringify({ LAYOUT, MOVES, ADDED, REMOVED, MONS, ROWS, GRID, ROUTES, DOORS, CLIPS, MAPS, TILESETS, DS, EDGES: edgeSnap() })); if (HIST.length > 60) HIST.shift(); }
function undo() { const h = HIST.pop(); if (!h) return toast('Nothing to undo'); let E, T, D; ({ LAYOUT, MOVES, ADDED, REMOVED, MONS, ROWS, GRID, ROUTES, DOORS, CLIPS, MAPS, TILESETS: T, DS: D, EDGES: E } = JSON.parse(h)); if (T) TILESETS = T; if (D) DS = D; for (const m of MAPS) if (m.built && ED.sections[m.id]) bake(m.id); designUndo(); for (const k of Object.keys(ED.sections)) if (ED.sections[k]._new && !MAPS.some(m => m.id === k)) { delete ED.sections[k]; if (S.view === k) S.view = 'outdoor'; views(); } for (const [k, v] of Object.entries(E || {})) if (ED.sections[k]) ED.sections[k].edges = v; S.sel = null; panel(); draw(); }
function touch(sid) { DIRTY.add(sid); $('#save').classList.add('hot'); }

// ---------- data helpers ----------
const sec = id => ED.sections[id];
const rowsOf = id => ROWS[id] || (sec(id).rows || []);
const planetSecs = () => Object.values(ED.sections).filter(s => s.dir === S.planet);
const onWorld = s => !!(GRID[s.id] || s.grid || s.vgrid);   // stitched outdoor maps, plus caves/towers shown in a row underneath
const passage = s => !s.grid && s.type !== 'interior';      // reached through a passage, not edge to edge
const viewSecs = () => S.view === 'outdoor' ? planetSecs().filter(onWorld) : [sec(S.view)].filter(Boolean);
const gridOf = s => GRID[s.id] || s.grid || s.vgrid;
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
  if (S.view === 'outdoor') { const vs = viewSecs(), here = new Set(vs.map(s => s.id)); ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = 'rgba(95,242,255,0.7)'; ctx.lineWidth = 1.5 / S.zoom;
    const drawn = new Set(); for (const s of vs) for (const w of s.warps || []) { const t = sec(w.to), pair = [s.id, w.to].sort().join('-'); if (!t || !here.has(t.id) || !(passage(s) || passage(t)) || drawn.has(pair)) continue; drawn.add(pair);
      const [ax, ay] = origin(s), [bx, by] = origin(t); ctx.beginPath(); ctx.moveTo(ax + w.tile[0] * 16 + 8, ay + w.tile[1] * 16 + 8); ctx.lineTo(bx + t.tiles[0] * 8, by + t.tiles[1] * 8); ctx.stroke(); }
    ctx.restore(); }
  for (const s of viewSecs()) {
    const [ox, oy] = origin(s), [W, H] = s.tiles, im = NEWIMG[s.id] ? img(NEWIMG[s.id]) : img(s.img);
    if (ok(im)) ctx.drawImage(im, ox, oy, W * 16, H * 16); else { ctx.fillStyle = '#222'; ctx.fillRect(ox, oy, W * 16, H * 16); }
    paintDraw(s, ox, oy);   // terrain painted over a finished map (play.js)
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1 / S.zoom; ctx.strokeRect(ox, oy, W * 16, H * 16);
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(ox, oy, Math.min(W * 16, s.name.length * 5 + 26), 9);
    ctx.fillStyle = '#ffd23f'; ctx.font = '7px monospace'; ctx.fillText(s.id + ' ' + s.name, ox + 2, oy + 7);
    if (S.view === 'outdoor' && passage(s)) { ctx.save(); ctx.setLineDash([6, 4]); ctx.strokeStyle = '#5ff2ff'; ctx.lineWidth = 2 / S.zoom; ctx.strokeRect(ox, oy, W * 16, H * 16); ctx.restore();
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(ox, oy + 9, 120, 9); ctx.fillStyle = '#5ff2ff'; ctx.font = '6px monospace'; ctx.fillText(s.type + ' · reached through a passage', ox + 2, oy + 16); }
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
  designDraw(ctx); updateTip();
  draw.items = items;
  if (S.sel) { const it = items.find(it => same(it.ref, S.sel)); if (it) { ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 1.5 / S.zoom; ctx.setLineDash([3 / S.zoom, 2 / S.zoom]); ctx.strokeRect(...it.box); ctx.setLineDash([]); } }
  if (S.clipRect) { const r = S.clipRect, s = sec(r.sid), [ox, oy] = origin(s), x0 = Math.min(r.x0, r.x1), y0 = Math.min(r.y0, r.y1);
    ctx.fillStyle = 'rgba(95,242,255,0.25)'; ctx.fillRect(ox + x0 * 16, oy + y0 * 16, (Math.abs(r.x1 - r.x0) + 1) * 16, (Math.abs(r.y1 - r.y0) + 1) * 16);
    ctx.strokeStyle = '#5ff2ff'; ctx.lineWidth = 2 / S.zoom; ctx.setLineDash([4 / S.zoom, 3 / S.zoom]); ctx.strokeRect(ox + x0 * 16, oy + y0 * 16, (Math.abs(r.x1 - r.x0) + 1) * 16, (Math.abs(r.y1 - r.y0) + 1) * 16); ctx.setLineDash([]); }
  if (S.mode === 'clips') for (const s of viewSecs()) { const m = stampHost(s.id); if (!m) continue; const [ox, oy] = origin(s);
    (m.stamps || []).forEach((st, i) => { const c = clipById(st.c); if (!c) return; const on = S.sel && S.sel.kind === 'stamp' && S.sel.sid === s.id && S.sel.i === i;
      ctx.strokeStyle = on ? '#ffd23f' : 'rgba(255,255,255,0.45)'; ctx.lineWidth = (on ? 2 : 1) / S.zoom; ctx.strokeRect(ox + st.x * 16, oy + st.y * 16, c.w * 16, c.h * 16); }); }
  if (S.ghost) { const g = S.ghost, c = clipById(g.c), s = sec(g.sid); if (c && s) { const [ox, oy] = origin(s), X = ox + g.x * 16, Y = oy + g.y * 16, ci = clipImg(c);   // the clip waiting for Apply
    ctx.save(); ctx.globalAlpha = 0.8; if (ok(ci)) ctx.drawImage(ci, X, Y); ctx.restore(); ctx.fillStyle = 'rgba(255,210,63,0.12)'; ctx.fillRect(X, Y, c.w * 16, c.h * 16);
    ctx.strokeStyle = '#000'; ctx.lineWidth = 5 / S.zoom; ctx.strokeRect(X, Y, c.w * 16, c.h * 16); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 3 / S.zoom; ctx.strokeRect(X, Y, c.w * 16, c.h * 16);
    const f = 11 / S.zoom, lab = S.quickStamp ? 'tap to put a copy here' : g.n ? 'drag for another copy' : 'drag me, then Apply'; ctx.font = `bold ${f}px system-ui`; const tw = ctx.measureText(lab).width + 8 / S.zoom, ly = Y > f * 1.6 ? Y - f * 1.5 : Y;
    ctx.fillStyle = '#ffd23f'; ctx.fillRect(X, ly, tw, f * 1.5); ctx.fillStyle = '#1b1424'; ctx.fillText(lab, X + 4 / S.zoom, ly + f * 1.1); } }
  if (S.wallRect) { const r = S.wallRect, s = sec(r.sid), [ox, oy] = origin(s), x0 = Math.min(r.x0, r.x1), y0 = Math.min(r.y0, r.y1);
    ctx.fillStyle = (BRUSHES.find(b => b[0] === S.brush) || [, , 'rgba(255,255,255,0.45)'])[2];
    ctx.fillRect(ox + x0 * 16, oy + y0 * 16, (Math.abs(r.x1 - r.x0) + 1) * 16, (Math.abs(r.y1 - r.y0) + 1) * 16);
    ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 2 / S.zoom; ctx.strokeRect(ox + x0 * 16, oy + y0 * 16, (Math.abs(r.x1 - r.x0) + 1) * 16, (Math.abs(r.y1 - r.y0) + 1) * 16); }
  if (S.routeDrag) { const r = S.routeDrag, s = sec(r.sid), [ox, oy] = origin(s), a = Math.min(r.k0, r.k1) * 16, b = (Math.max(r.k0, r.k1) + 1) * 16; ctx.fillStyle = 'rgba(255,210,63,0.6)';
    if (r.side === 'left' || r.side === 'right') ctx.fillRect(ox + (r.side === 'right' ? s.tiles[0] * 16 - 16 : 0), oy + a, 16, b - a); else ctx.fillRect(ox + a, oy + (r.side === 'bottom' ? s.tiles[1] * 16 - 16 : 0), b - a, 16); }
  if (S.hover && S.stamp && S.stamp.kind !== 'clip') { const [hx, hy] = S.hover; ctx.strokeStyle = 'rgba(255,210,63,0.9)'; ctx.lineWidth = 1 / S.zoom; ctx.strokeRect(hx.ox + hx.x * 16, hx.oy + hx.y * 16, (S.stamp.w || 1) * 16, 16); }
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
function delSel() { const r = S.sel; if (!r) return; if (r.kind === 'piece') return; if (r.kind === 'stamp') { snap(); stampHost(r.sid).stamps.splice(r.i, 1); S.sel = null; terrBake(r.sid); terrRows(r.sid); panel(); return; } if (r.kind === 'route') { snap(); removeRoute(r.sid, r.side); S.sel = null; panel(); draw(); return; } snap();
  if (r.kind === 'prop') LAYOUT[r.sid].splice(r.i, 1);
  else if (r.kind === 'added') ADDED[r.sid].splice(r.i, 1);
  else if (r.kind === 'npc') { if (!confirm('Remove this person from the map? (Story characters may be needed by quests.)')) return; (REMOVED[r.sid] = REMOVED[r.sid] || []).push(r.src); }
  else if (r.kind === 'mon') { if (!MONS[r.sid]) MONS[r.sid] = (sec(r.sid).mons || []).map(m => ({ ...m })); MONS[r.sid].splice(r.i, 1); }
  touch(r.sid); S.sel = null; panel(); draw(); }
function fillRect() {
  const r = S.wallRect; S.wallRect = null; const x0 = Math.min(r.x0, r.x1), x1 = Math.max(r.x0, r.x1), y0 = Math.min(r.y0, r.y1), y1 = Math.max(r.y0, r.y1), tiles = [];
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) tiles.push([x, y]);
  snap(); brushReport(r.sid, tiles, applyBrush(r.sid, tiles, S.brush), S.brush); panel(); draw();
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
  if (!seeds.some(([x, y]) => walk(x, y))) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) seeds.push([x, y]);   // no way in yet (a new map before its routes or doors): nothing counts as cut off
  const seen = new Set(), q = [];
  for (const [x, y] of seeds) if (walk(x, y) && !seen.has(x + ',' + y)) { seen.add(x + ',' + y); q.push([x, y]); }
  while (q.length) { const [x, y] = q.shift(); for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = (x + a) + ',' + (y + b); if (!seen.has(k) && walk(x + a, y + b)) { seen.add(k); q.push([x + a, y + b]); } } }
  return { seen, solid };
}
function paint(t) {   // the freehand Walkable brush: every tile the pointer crosses on the map the stroke started on
  const w = S.painting; if (!t || !w || t.sid !== w.sid || w.seen.has(t.x + ',' + t.y)) return; w.seen.add(t.x + ',' + t.y); w.tiles.push([t.x, t.y]);
  const res = applyBrush(t.sid, [[t.x, t.y]], S.brush); w.n += res.n; w.kept += res.kept; draw(); }
// ---------- mouse / keys ----------
const TOUCH = new Map(); let PINCH = null;
function pinchStart() { const [a, b] = [...TOUCH.values()]; PINCH = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, z: S.zoom, ox: S.ox, oy: S.oy }; }
function cancelGesture() {   // a second finger turns whatever the first finger started into a pan/zoom
  if (S.pieceDrag || S.drag || S.stampDrag || S.terrPaint || S.groupDrag || S.painting) { const keep = S.sel; S.terrPaint = false; S.groupDrag = null; undo(); S.sel = keep; panel(); }
  S.wallRect = S.clipRect = S.routeDrag = S.gRect = S.boxSel = S.ghostDrag = null; S.pan = null; S.drag = false; S.pieceDrag = null; S.propGrab = null; S.stampDrag = null; S.painting = false;
}
cv.addEventListener('pointerdown', e => {
  if (e.pointerType === 'touch') { TOUCH.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (TOUCH.size === 2) { cancelGesture(); pinchStart(); cv.setPointerCapture(e.pointerId); draw(); return; } if (TOUCH.size > 2) return; }
  cv.setPointerCapture(e.pointerId); const [wx, wy] = toWorld(e), t = tileAt(wx, wy);
  if (S.hand && S.mode !== 'play') { S.pan = [e.clientX - S.ox, e.clientY - S.oy]; return; }   // the hand tool: one finger moves the map
  if ((S.mode === 'settings' || S.mode === 'wild') && S.view === 'outdoor' && t && e.button === 0) { openMap(t.sid); return; }   // these work on one map: a tap opens it
  if (designDown(e, t, wx, wy)) return;   // playtest, prop groups, encounter zones, ground brushes, people and items (design.js)
  if (S.stamp && S.stamp.kind === 'scene' && e.button === 0 && !e.altKey) { dropScene(wx, wy); return; }
  if (e.button === 1 || e.button === 2 || e.altKey || !t) { S.pan = [e.clientX - S.ox, e.clientY - S.oy]; return; }
  if (S.mode === 'terrain') { if (S.tsample) { S.clipRect = { sid: t.sid, x0: t.x, y0: t.y, x1: t.x, y1: t.y, terrain: true }; draw(); return; } terrainDown(t, wx, wy); return; }
  if (S.mode === 'walls') { if (S.wtool === 'brush') { snap(); S.painting = { sid: t.sid, seen: new Set(), tiles: [], n: 0, kept: 0 }; paint(t); return; } S.wallRect = { sid: t.sid, x0: t.x, y0: t.y, x1: t.x, y1: t.y }; draw(); return; }
  if (S.mode === 'clips') {   // Copy: drag a box. Stamp: tap to place the picked clip. Move: drag a stamp. Works on one map or the whole world.
    if (S.clipTool === 'stamp') { const g = S.ghost, c = g && clipById(g.c); if (!c) return toast('Pick a clip on the right first.');   // tap or drag moves the preview; Apply puts it down
      const inside = g.sid === t.sid && t.x >= g.x && t.x < g.x + c.w && t.y >= g.y && t.y < g.y + c.h;
      S.ghostDrag = inside ? { dx: t.x - g.x, dy: t.y - g.y } : { dx: Math.floor((c.w - 1) / 2), dy: Math.floor((c.h - 1) / 2) }; ghostTo(t); return; }
    if (S.clipTool === 'move') { const m = stampHost(t.sid), hit = m && (m.stamps || []).map((st, i) => [st, i]).reverse().find(([st]) => { const c = clipById(st.c); return c && t.x >= st.x && t.x < st.x + c.w && t.y >= st.y && t.y < st.y + c.h; });
      if (!hit) { S.sel = null; panel(); draw(); return toast('Tap a stamp you placed to move it.'); }
      snap(); S.sel = { kind: 'stamp', sid: t.sid, i: hit[1] }; S.stampDrag = { dx: t.x - hit[0].x, dy: t.y - hit[0].y }; panel(); draw(); return; }
    S.clipRect = { sid: t.sid, x0: t.x, y0: t.y, x1: t.x, y1: t.y }; draw(); return; }
  if (S.mode === 'doors') { S.sel = { kind: 'door', sid: t.sid, x: t.x, y: t.y }; panel(); draw(); return; }
  if (S.mode === 'arrange') { if (S.view !== 'outdoor') { toWorldView(); return; } const s = sec(t.sid), [ox, oy] = origin(s); snap(); S.sel = { kind: 'piece', sid: t.sid }; S.pieceDrag = { sid: t.sid, dx: wx - ox, dy: wy - oy }; panel(); draw(); return; }
  if (S.mode === 'routes') { if (S.view !== 'outdoor') { toWorldView(); return; } if (passage(sec(t.sid))) return toast('Caves, towers and dungeons are reached through passages (the dashed lines), not routes.'); const s = sec(t.sid), [W, H] = s.tiles, side = t.x === 0 ? 'left' : t.x === W - 1 ? 'right' : t.y === 0 ? 'top' : t.y === H - 1 ? 'bottom' : null;
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
  if (designMove(e, t, wx, wy)) return;
  if (S.painting) { paint(t); return; }
  if (S.terrPaint) { terrainPaint(wx, wy); return; }
  if (S.ghostDrag) { if (t) ghostTo(t); return; }
  if (S.ghost && S.quickStamp && S.mode === 'clips' && t && e.pointerType === 'mouse') { const c = clipById(S.ghost.c); if (c) { S.ghostDrag = { dx: Math.floor((c.w - 1) / 2), dy: Math.floor((c.h - 1) / 2) }; ghostTo(t); S.ghostDrag = null; } }   // quick mode: the box follows the mouse
  if (S.clipRect) { if (t && t.sid === S.clipRect.sid) { S.clipRect.x1 = t.x; S.clipRect.y1 = t.y; draw(); } return; }
  if (S.stampDrag && S.sel && S.sel.kind === 'stamp' && t && t.sid === S.sel.sid) { const m = stampHost(S.sel.sid), st = m.stamps[S.sel.i], nx = t.x - S.stampDrag.dx, ny = t.y - S.stampDrag.dy; if (nx !== st.x || ny !== st.y) { st.x = nx; st.y = ny; terrBake(S.sel.sid); } return; }
  if (S.wallRect) { if (t && t.sid === S.wallRect.sid) { S.wallRect.x1 = t.x; S.wallRect.y1 = t.y; draw(); } return; }
  if (S.pieceDrag) { movePiece(wx, wy); return; }
  if (S.routeDrag) { const r = S.routeDrag, s = sec(r.sid), [ox, oy] = origin(s), [W, H] = s.tiles; r.k1 = r.side === 'left' || r.side === 'right' ? Math.max(0, Math.min(H - 1, Math.floor((wy - oy) / 16))) : Math.max(0, Math.min(W - 1, Math.floor((wx - ox) / 16))); draw(); return; }
  if (S.drag && S.propGrab && S.sel && S.sel.kind === 'prop') { dragProp(wx - S.propGrab.dx, wy - S.propGrab.dy); return; }
  if (S.drag && t && S.sel) { const p = selPos(); if (p && (p[0] !== t.x || p[1] !== t.y)) moveSel(t); return; }
  S.hover = t ? [t] : null; if (S.stamp) { if (t) S.hover = [{ ...t }]; draw(); }
  $('#where').textContent = t ? `${t.sid} ${sec(t.sid).name}  tile ${t.x},${t.y}${S.walls || S.mode === 'walls' ? ' · ' + tileInfo(t.sid, t.x, t.y) : ''}` : '';
});
const touchEnd = e => { if (e.pointerType !== 'touch') return; TOUCH.delete(e.pointerId); if (TOUCH.size < 2 && PINCH) { PINCH = null; if (TOUCH.size === 1) { const [p] = [...TOUCH.values()]; S.pan = [p.x - S.ox, p.y - S.oy]; } } };
cv.addEventListener('pointercancel', touchEnd);
addEventListener('pointerup', e => { const wasPinch = !!PINCH; touchEnd(e); if (wasPinch || PINCH || TOUCH.size) return; if (S.ghostDrag) { S.ghostDrag = null; if (S.quickStamp) applyGhost(); } if (S.clipRect) makeClip(); if (S.stampDrag) { const id = S.sel && S.sel.sid; S.stampDrag = null; if (id) { const m = stampHost(id), st = m.stamps[S.sel.i], c = clipById(st.c); if (c) clearManual(m, st.x, st.y, st.x + c.w - 1, st.y + c.h - 1); terrRows(id); } } if (S.wallRect) fillRect(); if (S.painting) { const w = S.painting; S.painting = false; brushReport(w.sid, w.tiles, w, S.brush); panel(); } if (S.routeDrag) finishRoute(); terrainUp(); designUp(); S.pan = null; S.drag = false; S.painting = false; S.pieceDrag = null; S.propGrab = null; });
cv.addEventListener('wheel', e => { e.preventDefault(); const r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top, z0 = S.zoom;
  S.zoom = Math.max(0.25, Math.min(8, S.zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15))); S.ox = mx - (mx - S.ox) * S.zoom / z0; S.oy = my - (my - S.oy) * S.zoom / z0; draw(); }, { passive: false });
cv.addEventListener('contextmenu', e => e.preventDefault());
addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
  if (designKey(e)) return;
  if (S.ghost && e.key === 'Enter') { e.preventDefault(); applyGhost(); return; }
  if (S.ghost && e.key.startsWith('Arrow')) { e.preventDefault(); const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]; S.ghost.x += d[0]; S.ghost.y += d[1]; draw(); return; }
  if (e.key === 'Escape') { S.stamp = null; S.sel = null; S.tsample = false; S.ghost = null; panel(); draw(); }
  else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); delSel(); }
  else if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
  else if ((e.ctrlKey || e.metaKey) && e.key === 'c' && S.sel && S.sel.kind === 'prop') { const q = LAYOUT[S.sel.sid][S.sel.i]; S.stamp = { kind: 'prop', p: q.p, flat: q.solid === false }; toast('Copied: click to place copies, Esc to stop'); }
  else if (e.key.startsWith('Arrow') && S.sel) { e.preventDefault(); const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]; nudge(d[0], d[1], e.shiftKey); }
});
function nudge(dx, dy, fine) { if (designNudge(dx, dy)) return;   // arrows: one tile (a whole scene moves one tile); fine: one pixel for props, four tiles for scenes
  const r = S.sel; if (!r) return; snap();
  if (r.kind === 'prop' && fine) { const q = LAYOUT[r.sid][r.i]; q.ox = (q.ox || 0) + dx; q.oy = (q.oy || 0) + dy; if (!q.ox) delete q.ox; if (!q.oy) delete q.oy; touch(r.sid); panel(); draw(); }
  else if (r.kind === 'piece') { const g = gridOf(sec(r.sid)).slice(), k = fine ? 4 : 1; GRID[r.sid] = [g[0] + dx * k, g[1] + dy * k]; touch(r.sid); panel(); draw(); }
  else if (r.kind === 'stamp') { const st = stampHost(r.sid).stamps[r.i]; st.x += dx; st.y += dy; terrBake(r.sid); terrRows(r.sid); panel(); }
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
    const below = (rowsOf(sid)[y + 1] || '')[x]; if (below !== '.' && below !== ',') toast('Heads up: the tile in front of this door is not walkable. Paint it walkable in Paint: Walkable so the player can reach it.', 6000); }
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
// ---------- ready-made scenes (art/scene_library) ----------
const sceneById = id => (ED.scenes || []).find(x => x.id === id);
function newId() { const used = new Set(Object.keys(ED.sections)); let n = 300; while (used.has(String(n))) n++; return String(n); }
function dropScene(wx, wy) {   // outdoor scene: becomes a new map piece where you tap, then follows your finger until you let go
  const lib = sceneById(S.stamp.id); if (!lib) return;
  if (S.view !== 'outdoor') { toWorldView(); return toast('Now tap the world map where the scene should go.'); }
  snap(); const [W, H] = lib.tiles, id = newId(), dir = S.planet, slug = lib.id.split('/')[1];
  const R = Array.from({ length: H }, (_, y) => Array.from({ length: W }, (_, x) => (x === 0 || y === 0 || x === W - 1 || y === H - 1) ? '#' : '.').join(''));
  const grid = [Math.round(wx / 16 - W / 2), Math.round(wy / 16 - H / 2)];
  ED.sections[id] = { id, name: lib.name, planet: ED.planets[dir], dir, type: 'route', tiles: [W, H], grid, img: lib.url, rows: R, edges: {}, warps: [], objects: [], spawns: {}, npcs: [], mons: [], _new: true };
  GRID[id] = grid; ROWS[id] = R; NEWIMG[id] = lib.url; touch(id);
  MAPS.push({ id, name: lib.name, dir, planet: ED.planets[dir], type: 'route', tiles: [W, H], img: `art/sections_game/${dir}/${id}_${slug}.png`, src: lib.file });
  S.stamp = null; S.sel = { kind: 'piece', sid: id }; S.pieceDrag = { sid: id, dx: W * 8, dy: H * 8 }; movePiece(wx, wy);
  toast(`${lib.name} added as ${id}. Drag it into place (it snaps to the scene beside it), then use Routes to join it and Paint to set where you can walk.`, 9000); panel(); draw();
}
function addSceneRoom(lib) {   // interior scene: a new room with a 2-tile doormat in the middle of the bottom wall; point a door at it with Doors
  snap(); const [W, H] = lib.tiles, id = newId(), dir = S.planet, slug = lib.id.split('/')[1], cx = Math.floor(W / 2) - 1;
  const R = Array.from({ length: H }, (_, y) => Array.from({ length: W }, (_, x) => (x <= 1 || y <= 3 || x >= W - 2 || y >= H - 1) ? '#' : '.'));
  R[H - 1][cx] = R[H - 1][cx + 1] = '.';
  ED.sections[id] = { id, name: lib.name, planet: ED.planets[dir], dir, type: 'interior', tiles: [W, H], grid: null, img: lib.url, rows: R.map(r => r.join('')), edges: {},
    warps: [{ tile: [cx, H - 1], to: 'back', kind: 'door' }, { tile: [cx + 1, H - 1], to: 'back', kind: 'door' }], objects: [], spawns: { default: [cx, H - 2] }, npcs: [], mons: [], _new: true };
  ROWS[id] = ED.sections[id].rows; NEWIMG[id] = lib.url; touch(id);
  MAPS.push({ id, name: lib.name, dir, planet: ED.planets[dir], type: 'interior', tiles: [W, H], img: `art/sections_game/${dir}/${id}_${slug}.png`, src: lib.file });
  S.stamp = null; S.view = id; views(); fit(); setMode('walls');
  toast(`Room ${id} ${lib.name} added. Paint its walls and furniture as walls, then use Doors to point a door at it.`, 9000); panel(); draw();
}
function scenesPanel() {
  const dirs = [...new Set((ED.scenes || []).map(x => x.dir))].sort(); if (!S.sceneDir || !dirs.includes(S.sceneDir)) S.sceneDir = dirs.includes(S.planet) ? S.planet : dirs[0];
  const list = (ED.scenes || []).filter(x => x.dir === S.sceneDir), cur = S.stamp && S.stamp.kind === 'scene' ? sceneById(S.stamp.id) : null;
  return `<h3>Scenes</h3><p class="hint">Ready-made scenes. <b>Outdoor:</b> tap one, then tap the world map where it should go and drag it into place; it snaps to the scene beside it. Then use <b>Routes</b> to join it and <b>Paint</b> to set where you can walk. <b>Rooms:</b> tap one, then <b>Add as a room</b>, and point a door at it with <b>Doors</b>. New scenes join ${ED.planets[S.planet]}.</p>
    ${cur ? `<div class="sel"><b>${cur.name}</b> <span class="hint">${cur.kind === 'interior' ? 'room' : 'outdoor'}, ${cur.tiles[0]}x${cur.tiles[1]} tiles</span><div class="row">${cur.kind === 'interior' ? '<button id="sroom">Add as a room</button>' : '<span class="good">Now tap the world map where it should go</span>'}<button id="scancel">Cancel</button></div></div>` : ''}
    <label>Scenes from <select id="sdir">${dirs.map(d => `<option value="${d}" ${d === S.sceneDir ? 'selected' : ''}>${ED.planets[d] || d}</option>`).join('')}</select></label>
    ${[['outdoor', 'Outdoor scenes'], ['residential', 'Residential'], ['crossroads', 'Crossroads']].map(([g, t]) => { const xs = list.filter(x => x.kind !== 'interior' && (x.group || 'outdoor') === g); return xs.length ? `<h4>${t}</h4><div class="grid wide">${xs.map(x => `<button class="pal ${cur && cur.id === x.id ? 'on' : ''}" data-libscene="${x.id}" data-cap="${x.name} · ${t.toLowerCase()} · ${x.tiles[0]}x${x.tiles[1]} tiles" title="${x.name}"><img src="${x.url}" loading="lazy"></button>`).join('')}</div>` : ''; }).join('')}
    <h4>Rooms</h4><div class="grid">${list.filter(x => x.kind === 'interior').map(x => `<button class="pal ${cur && cur.id === x.id ? 'on' : ''}" data-libscene="${x.id}" data-cap="${x.name} · room · ${x.tiles[0]}x${x.tiles[1]} tiles" title="${x.name}"><img src="${x.url}" loading="lazy"></button>`).join('') || '<span class="hint">None for this world.</span>'}</div>`;
}
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

// ---------- tabs: six groups along the top (the bottom bar on phones), each with its own tools ----------
const GROUPS = [
  ['paint', '&#128396;', 'Paint', [['terrain', 'Terrain'], ['clips', 'Clips'], ['walls', 'Walkable']]],
  ['place', '&#127793;', 'Place', [['props', 'Props'], ['people', 'People'], ['items', 'Items'], ['mons', 'Roaming Alienmon']]],
  ['world', '&#128506;', 'World', [['arrange', 'Move maps'], ['routes', 'Routes'], ['doors', 'Doors'], ['scenes', 'Scenes'], ['maps', 'New map']]],
  ['info', '&#9881;', 'Map', [['settings', 'Settings'], ['wild', 'Wild Alienmon']]],
  ['test', '&#9654;', 'Test', [['play', 'Playtest'], ['check', 'Check']]],
  ['tools', '&#129520;', 'Tools', [['sprites', 'Sprite Studio'], ['overview', 'All worlds'], ['versions', 'Versions']]]];
const LEAD = {
  terrain: 'Paint the ground: dirt paths, stone roads, grass, tall grass, sand, water. Walkable ground follows what you paint.',
  clips: 'Copy a piece of any map (a bridge, rocks, a doorway) and stamp copies of it anywhere.',
  walls: 'Choose exactly where the player can walk, where wild battles happen, and where water, lava and ledges are.',
  props: 'Add, move and line up objects: lamps, trees, fences, stalls, buildings.',
  people: 'Add townsfolk and trainers, and set what they say, where they face and how they move.',
  items: 'Rewards and puzzles: items on the ground, chests, Linker Stashes, hidden items, signs, and locked ways that open with a key item or a Keeper win.',
  mons: 'Alienmon that roam the map and battle you when you bump into them.',
  arrange: 'Move whole maps on the world layout so their edges line up.',
  routes: 'Open a walkway between two maps that touch.',
  doors: 'Choose which room or counter each door opens.',
  scenes: 'Add a ready-made scene to this world, outdoors or as a room.',
  maps: 'Make a new map: a blank one to paint, or one from a picture.',
  settings: 'Music, the name banner, encounter rate, night and weather for one map.',
  wild: "Which wild Alienmon live in this map's tall grass and water, and how often.",
  play: "Walk the map with the game's rules to try it out.",
  check: 'Find problems using the Map Logic Pack, and fix the safe ones in one go.',
  sprites: 'Turn a generated sprite sheet into walking characters or props.',
  overview: 'Every world at a glance, with its problem count.',
  versions: 'Snapshots of your work, and crash recovery.' };
const groupOf = m => GROUPS.find(g => g[3].some(x => x[0] === m)) || GROUPS[1];
function setMode(m) {
  S.mode = m; S.stamp = null; S.tsample = false; S.ghost = null; if (S.sel && ['stamp', 'route', 'piece', 'door'].includes(S.sel.kind)) S.sel = null; const g = groupOf(m); (S.lastSub = S.lastSub || {})[g[0]] = m;
  document.querySelectorAll('#modes [data-group]').forEach(b => b.classList.toggle('on', b.dataset.group === g[0]));
  if ((m === 'arrange' || m === 'routes') && S.view !== 'outdoor') toWorldView(); panel(); draw();
}
function tabsHtml() { const g = groupOf(S.mode);
  return `<div class="subtabs">${g[3].map(([m, n]) => `<button data-sub="${m}" class="${S.mode === m ? 'on' : ''}">${n}</button>`).join('')}</div><p class="lead">${LEAD[S.mode] || ''}</p>`; }
function tipText() {   // what a tap or drag on the map does right now
  const m = S.mode, st = S.stamp;
  if (S.hand && m !== 'play') return 'Hand is on: drag to move the map. Tap the hand again to edit.';
  if (m === 'terrain') return S.tsample ? 'Drag a box over plain ground to copy it as a terrain' : S.terase ? 'Eraser: drag over painted terrain to remove it' : S.terr && tsById(S.terr) ? `Drag on the map to paint: ${tsById(S.terr).name.split(' (')[0]}` : 'Pick a terrain on the right';
  if (m === 'clips') return S.clipTool === 'move' ? 'Drag a stamp you placed to move it' : S.clipTool === 'stamp' ? (S.ghost ? (S.quickStamp ? 'Tap the map to place a copy' : 'Drag the yellow box where you want it, then Apply') : 'Pick a clip on the right') : 'Drag a box over the map to copy that piece';
  if (m === 'walls') return `${S.wtool === 'brush' ? 'Drag across the map' : 'Tap a tile or drag a box'} to paint: ${brushName(S.brush)}`;
  if (m === 'props') return st && st.kind === 'group' ? 'Tap to paste the group' : st ? 'Tap the map to place it (keeps placing until you stop)' : S.multiMode ? 'Tap props or drag a box to select several' : 'Pick a prop on the right to add it, or drag one on the map to move it';
  if (m === 'people') return st ? 'Tap the map to place this person' : 'Pick someone on the right to add, or tap a person on the map to edit them';
  if (m === 'mons') return st ? 'Tap the map to place this Alienmon' : 'Pick an Alienmon on the right';
  if (m === 'items') return `Tap the map to place: ${OK_[S.okind || 'stash']}${hasItem(S.okind || 'stash') ? ' (' + itemName(S.oitem || 'gel') + ')' : ''}`;
  if (m === 'doors') return 'Tap a door to choose what it opens';
  if (m === 'routes') return 'Drag along the edge where two maps touch';
  if (m === 'arrange') return 'Drag a map to move it';
  if (m === 'scenes') return st ? 'Tap the world map where the scene goes' : 'Pick a scene on the right';
  if (m === 'play') return S.play ? 'Walk: arrows or WASD · A: Space · B: Shift' : 'Tap a walkable tile to start walking there';
  return '';
}
const side = t => phone() ? t.replace(/ on the right/g, ' below') : t;   // phones keep the panel under the map
function updateTip() {
  const el = $('#tip'); if (!el) return; const t = side(tipText()), g = S.ghost && S.mode === 'clips' && !S.quickStamp, key = t + '|' + !!S.stamp + '|' + !!g + (g && S.ghost.n); if (el.dataset.k === key) return; el.dataset.k = key;
  el.innerHTML = t ? `<span>${esc(t)}</span>${g ? `<span class="tipb"><button id="tipok" class="go" title="Put it down here (Enter)">&#10003; Apply here</button><button id="tipgx" title="Esc">${S.ghost.n ? 'Done' : '&#10005; Cancel'}</button></span>` : S.stamp ? '<button id="tipx" title="Stop placing (Esc)">&#10005; Stop</button>' : ''}` : '';
  const x = $('#tipx'); if (x) x.onclick = () => { S.stamp = null; panel(); draw(); };
  const ok2 = $('#tipok'); if (ok2) ok2.onclick = applyGhost; const gx = $('#tipgx'); if (gx) gx.onclick = () => { S.ghost = null; panel(); draw(); };
}

// ---------- side panel ----------
function panel() {
  const P = $('#panel'), m = S.mode; let h = tabsHtml();
  if (S.sel) h += selPanel() + (m === 'people' ? personPanel() : '');   // faces, strolling and trainers (play.js)
  const PRE = `<div id="preview"><div class="box" id="pbox"></div><div class="cap" id="pcap">${matchMedia('(pointer:coarse)').matches ? 'Tap an item to see it large' : 'Hover over an item to see it large'}</div><div class="sizes">Item size <input type="range" id="cellsz" min="70" max="300" value="${S.cell || Math.round(Math.max(100, Math.min(200, innerWidth * 0.065)))}"></div></div>`;
  if (m === 'props') {
    h += PRE + `${how('<li><b>Add:</b> pick an item below, then press on the map and drag it to the exact spot before letting go. It keeps adding copies until you press Stop.</li><li><b>Move or remove:</b> tap any item already on the map, drag it anywhere, or press Remove.</li>')}${S.stamp ? '<button id="stopstamp">Stop placing (Esc)</button>' : ''}<label>Sheet <select id="sheet">${Object.keys(ED.props).map(d => `<option ${d === S.sheet ? 'selected' : ''}>${d}</option>`).join('')}</select></label>
      <label class="row"><input type="checkbox" id="flat" ${S.flatNext ? 'checked' : ''}> place as a flat rug (walk over it)</label>
      <div class="grid">${(ED.props[S.sheet] || []).map(p => { const key = S.sheet + '/' + String(p.n).padStart(2, '0'); return `<button class="pal ${S.stamp && S.stamp.p === key ? 'on' : ''}" data-p="${key}" data-cap="${S.sheet} #${p.n} · ${p.px[0]}×${p.px[1]} px · about ${Math.max(1, Math.round(p.px[0] / 16))} tile(s) wide" title="#${p.n}"><img src="${p.url}"></button>`; }).join('')}</div>`;
  } else if (m === 'people') {
    h += PRE + `${how('<li>Type a name and what they say (optional).</li><li>Pick a character below, then tap the map.</li><li>Drag anyone to move them; tap them to edit.</li>')}
      <label>Name (optional) <input id="pname" value="${S.pname || ''}"></label><label>What they say <input id="pline" value="${S.pline || ''}" placeholder="Nice day, isn't it?"></label>
      <div class="grid">${Object.entries(ED.chars).map(([k, u]) => `<button class="pal ${S.stamp && S.stamp.art === k ? 'on' : ''}" data-c="${k}" data-cap="${k}" title="${k}"><img src="${(ED.charBig || {})[k] || u}"></button>`).join('')}</div>`;
  } else if (m === 'mons') {
    h += PRE + `<p class="hint">Placing one here replaces the automatic ones on that map.</p>
      <input id="msearch" placeholder="Search Alienmon" value="${S.msearch || ''}">
      <div class="grid">${Object.entries(ED.mons).filter(([k]) => !S.msearch || k.toLowerCase().includes(S.msearch.toLowerCase())).map(([k, u]) => `<button class="pal mon ${S.stamp && S.stamp.mon === k ? 'on' : ''}" data-m="${k}" data-cap="${k}" title="${k}"><span style="background-image:url(${u})"></span></button>`).join('')}</div>`;
  } else if (m === 'walls') h += wallsPanel();
  else if (m === 'maps') h += mapPanel();
  else if (m === 'scenes') h += `<div id="preview"><div class="box" id="pbox"></div><div class="cap" id="pcap">Tap a scene to see it large</div></div>` + scenesPanel();
  else if (m === 'clips') h += clipsPanel();
  else if (m === 'doors') h += `<h3>Doors</h3><p class="hint">Click a door on the map, then choose what it opens. Cyan = doors the game already has, yellow = doors you set, grey = story doors (fixed). Any number of doors can open the same room: leaving it takes the player back out the door they came in by. To add a new Alienmon centre or house, place a building from the Props sheet, then click its door here and pick that world's Recovery Bay or house room.</p>`;
  else if (m === 'arrange') h += `<h3>Move scenes</h3><p class="hint">Every outdoor map of this world is laid out together. <b>Tap a scene</b> on the map or in the list, then <b>drag it</b> or use the <b>arrows</b> to move it. Scenes snap flush to the one beside, above or below. A <span class="bad">red outline</span> means two scenes overlap. Moving only changes the layout: use <b>Routes</b> to let the player walk across. Two fingers pan and zoom.</p>
      <div class="scenes">${planetSecs().filter(onWorld).sort((a, b) => a.id.localeCompare(b.id)).map(s => `<button data-scene="${s.id}" class="${S.sel && S.sel.kind === 'piece' && S.sel.sid === s.id ? 'on' : ''}">${s.id} ${s.name}</button>`).join('')}</div>`;
  else if (m === 'routes') h += `<h3>Travel routes</h3><p class="hint">Blue bars are the ways across between map pieces. To add one, press on the edge of a piece where it touches the next piece and drag along that edge to set how wide the opening is (a road is usually 4 to 6 tiles). The opening is cut through the walls on both sides. Click a bar to select it; Delete removes it. Each side of a piece can have one route.</p>
    ${ROUTES.filter(r => !r.remove).map(r => `<div>${r.a} ${r.side} ${r.band[0]}-${r.band[1]} to ${r.b}</div>`).join('')}`;
  if (m === 'terrain') h += terrainPanel(); else if (m === 'sprites') h += spritesPanel();
  h += designPanel(m);
  P.innerHTML = h; updateTip(); wire(); if (m === 'terrain') terrainWire(); else if (m === 'sprites') spritesWire(); designWire();
}
function selPanel() {
  const r = S.sel;
  if (r && r.kind === 'door') { const d = doorAt(r.sid, r.x, r.y), s = sec(r.sid);
    if (d && d.fixed) return `<div class="sel"><b>Story door</b><div>${s.name}, tile ${r.x},${r.y} opens ${doorName(d.to)}</div><div class="hint">This door is part of the story wiring. Ask Claude to change it.</div></div>`;
    return `<div class="sel"><b>${d ? 'Door' : 'New door'}</b><div>${s.name}, tile ${r.x},${r.y}${d ? ' opens ' + doorName(d.to) : ''}</div>
      <label>Opens <select id="doorto"><option value="">Choose a room...</option>${roomChoices()}</select></label>
      <div class="row"><button id="doorset">Set door</button>${d ? '<button id="doorrm">Remove door</button>' : ''}${d && d.to && sec(d.to) ? `<button id="dooropen">Open ${doorName(d.to)}</button>` : ''}</div>
      <div class="hint">The door tile becomes solid (you walk into it to go in). The tile in front of it must be walkable.</div></div>`; }
  if (r && r.kind === 'stamp') { const st = stampHost(r.sid).stamps[r.i], c = clipById(st.c); return `<div class="sel"><b>Stamp: ${c ? c.name : st.c}</b><div>at ${st.x},${st.y}</div><div class="hint">Drag to move, or use the arrows</div>${padHtml('')}<button id="del">Remove</button></div>`; }
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
  const outs = planetSecs().filter(s => s.grid), clips = CLIPS.filter(c => c.dir === S.planet);
  return `<h3>A blank map to paint</h3>
    <label>Name <input id="bname" placeholder="e.g. Hidden Canyon"></label>
    <div class="row"><label>Width <input id="bw" type="number" value="24" min="8" max="48" style="width:70px"></label><label>Height <input id="bh" type="number" value="16" min="8" max="48" style="width:70px"></label><span class="hint">tiles (the game shows 10x9 at a time)</span></div>
    <label>Kind <select id="btype"><option>route</option><option>town</option><option>field</option><option>landmark</option><option value="interior">interior room</option></select></label>
    <label>Start with <select id="bground"><option value="">a plain colour</option>${clips.map(c => `<option value="${c.id}">${esc(c.name)} repeated</option>`).join('')}</select></label>
    <label>Colour <input id="bcolor" type="color" value="#6b5b45"></label>
    <button id="bmake">Create blank map</button>
    <p class="hint">It opens in Paint: Terrain. Fill it with a ground terrain, then paint paths, grass and water. Join it to the world with Move maps and Routes, or point a door at it with Doors.</p>
    <h3>A map from a picture</h3><p class="hint">Upload a new map render (same style and scale as the others: 64 px per tile, 1536×1024 wide or 1024×1024 square) and attach it to the edge of an existing map.</p>
    <input type="file" id="mfile" accept="image/*">
    <label>Name <input id="mname" placeholder="e.g. Rimwalk Trail Part C"></label>
    <label>Kind <select id="mtype"><option>route</option><option>town</option><option>field</option><option>landmark</option><option value="interior">interior room (Recovery Bay, shop, house...)</option></select></label>
    <label>Attach to <select id="mto">${outs.map(s => `<option value="${s.id}">${s.id} ${s.name}</option>`).join('')}</select></label>
    <label>On its <select id="mside"><option>right</option><option>left</option><option>top</option><option>bottom</option></select> edge</label>
    <label>Opening, tiles <input id="mband" value="5-10" size="6"> (rows for left/right, columns for top/bottom)</label>
    <button id="madd">Add map</button>
    <p class="hint">The new map starts fully walkable inside a wall border with the opening cut on the joining edge. Set its walls in Paint: Walkable, then dress it.</p>
    ${MAPS.length ? '<h4>Added this session</h4>' + MAPS.map(m => `<div>${m.id} ${esc(m.name)}${m.attach ? ` → ${m.attach.side} of ${m.attach.to}` : m.built ? ' (blank, painted)' : ''}</div>`).join('') : ''}`;
}
const mapPick = () => `<select id="pickmap"><option value="">Choose a map...</option>${planetSecs().sort((a, b) => a.id.localeCompare(b.id)).map(s => `<option value="${s.id}">${s.id} ${esc(s.name)}</option>`).join('')}</select>`;
function openMap(id) { S.view = id; S.sel = null; views(); fit(); panel(); }
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
  document.querySelectorAll('[data-wt]').forEach(b => b.onclick = () => { S.wtool = b.dataset.wt; panel(); });
  document.querySelectorAll('[data-sub]').forEach(b => b.onclick = () => setMode(b.dataset.sub));
  document.querySelectorAll('[data-ct]').forEach(b => b.onclick = () => { S.clipTool = b.dataset.ct; S.stamp = null; if (b.dataset.ct !== 'stamp') S.ghost = null; else if (S.clipSel && !S.ghost) startGhost(S.clipSel); panel(); draw(); });
  on('#pname', 'input', e => { S.pname = e.target.value; if (S.stamp) S.stamp.name = S.pname; });
  on('#pline', 'input', e => { S.pline = e.target.value; if (S.stamp) S.stamp.line = S.pline; });
  on('#msearch', 'input', e => { S.msearch = e.target.value; const pos = e.target.selectionStart; panel(); const i = $('#msearch'); i.focus(); i.setSelectionRange(pos, pos); });
  on('#del', 'click', delSel);
  document.querySelectorAll('[data-libscene]').forEach(b => b.onclick = () => { const x = sceneById(b.dataset.libscene); S.stamp = { kind: 'scene', id: x.id }; if (x.kind !== 'interior' && S.view !== 'outdoor') toWorldView(); panel(); });
  on('#sdir', 'change', e => { S.sceneDir = e.target.value; panel(); });
  on('#sroom', 'click', () => addSceneRoom(sceneById(S.stamp.id))); on('#scancel', 'click', () => { S.stamp = null; panel(); });
  document.querySelectorAll('[data-nudge]').forEach(b => b.onclick = () => { const [dx, dy, f] = b.dataset.nudge.split(',').map(Number); nudge(dx, dy, !!f); });
  document.querySelectorAll('[data-scene]').forEach(b => b.onclick = () => { if (S.view !== 'outdoor') { S.view = 'outdoor'; views(); } S.sel = { kind: 'piece', sid: b.dataset.scene }; centerOn(b.dataset.scene); panel(); });
  on('#pdone', 'click', () => { S.sel = null; panel(); draw(); }); on('#pfind', 'click', () => S.sel && centerOn(S.sel.sid));
  { const cur = document.querySelector('.pal.on'); if (cur) showPreview(cur); }
  on('#stopstamp', 'click', () => { S.stamp = null; panel(); draw(); });
  on('#ename', 'input', e => { const a = ADDED[S.sel.sid][S.sel.i]; a.name = e.target.value; touch(S.sel.sid); });
  on('#eline', 'input', e => { const a = ADDED[S.sel.sid][S.sel.i]; a.t = e.target.value.split('\n').filter(Boolean); touch(S.sel.sid); });
  on('#check', 'click', check);
  document.querySelectorAll('[data-rk]').forEach(b => b.onclick = () => { S.readyKind = b.dataset.rk; panel(); });
  document.querySelectorAll('[data-clip]').forEach(b => b.onclick = () => { S.clipSel = b.dataset.clip; S.clipTool = 'stamp'; startGhost(S.clipSel); panel(); draw(); });
  on('#clipplace', 'click', () => { S.clipTool = 'stamp'; startGhost(S.clipSel); panel(); draw(); });
  on('#clipapply', 'click', applyGhost); on('#clipquick', 'change', e => { S.quickStamp = e.target.checked; panel(); draw(); });
  on('#clipname', 'change', e => { const c = clipById(S.clipSel); if (!c) return; snap(); c.name = e.target.value.trim() || c.name; DIRTY.add('clips'); $('#save').classList.add('hot'); panel(); });
  on('#clipterr', 'click', () => { const c = clipById(adoptClip(S.clipSel)); if (c) { terrainFromClip(c); toast(`Terrain "${c.name}" made: find it in Paint: Terrain.`, 5000); } });
  on('#clipsall', 'change', e => { S.clipsAll = e.target.checked; panel(); });
  on('#cliprm', 'click', () => { if (MAPS.filter(m => m.built).concat(Object.values(DS.paint || {})).some(m => m.ground === S.clipSel || (m.stamps || []).some(st => st.c === S.clipSel)) || TILESETS.some(t => t.clip === S.clipSel)) return toast('That clip is stamped on a map or used by a terrain; remove those first.'); snap(); CLIPS = CLIPS.filter(c => c.id !== S.clipSel); DIRTY.add('clips'); $('#save').classList.add('hot'); S.clipSel = null; S.ghost = null; panel(); });
  on('#clipground', 'click', () => { const m = builtMap(S.view); S.clipSel = adoptClip(S.clipSel); snap(); m.ground = S.clipSel; bake(S.view); stampRows(S.view); });
  on('#tipx', 'click', () => { S.stamp = null; panel(); draw(); });
  on('#bmake', 'click', () => { const name = ($('#bname').value || '').trim(); if (!name) return toast('Give the new map a name.'); newBlank(name, Math.max(8, Math.min(48, +$('#bw').value || 24)), Math.max(8, Math.min(48, +$('#bh').value || 16)), $('#btype').value, $('#bground').value, $('#bcolor').value); });
  on('#doorset', 'click', () => { const v = $('#doorto').value; if (!v) return toast('Choose a room first.'); setDoor(S.sel.sid, S.sel.x, S.sel.y, v); toast('Door set: opens ' + doorName(v)); });
  on('#doorrm', 'click', () => setDoor(S.sel.sid, S.sel.x, S.sel.y, null));
  on('#dooropen', 'click', () => { const d = doorAt(S.sel.sid, S.sel.x, S.sel.y); S.view = d.to; S.sel = null; views(); panel(); fit(); });
  on('#ph', 'input', e => { const q = LAYOUT[S.sel.sid][S.sel.i]; snap(); const h = Math.max(1, Math.min(8, +e.target.value || 1)); if (h > 1) q.h = h; else delete q.h; touch(S.sel.sid); draw(); });
  on('#madd', 'click', addMap);
  on('#pickmap', 'change', e => e.target.value && openMap(e.target.value));
  document.querySelectorAll('.lead + h3 + p.hint, .lead + #preview + h3 + p.hint').forEach(p => p.onclick = () => p.classList.toggle('full'));
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
  const co = $('#checkout'); if (co) co.innerHTML = out.join('') || '<div class="hint">No edited maps yet.</div>';
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
  toast(`Added ${id} ${name} (${W}×${H} tiles). Set where you can walk in Paint: Walkable, then dress it.`); panel(); draw();
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
  S.view = id; views(); fit(); setMode('walls');
  toast(`Room ${id} ${name} added (${W}x${H} tiles). Paint its walls and furniture as walls, then use Doors to point doors at it.`, 9000); panel(); draw();
}

// ---------- clips and blank maps built from them ----------
const clipById = id => CLIPS.find(c => c.id === id) || readyById(id);
const builtMap = id => MAPS.find(m => m.id === id && m.built);
function clipImg(c) { return img(CLIPIMG[c.id] || c.url); }
function makeClip() {   // the box becomes a clip (picture plus its walls), named for its map; rename it in the panel
  const r = S.clipRect; S.clipRect = null; const s = sec(r.sid), x0 = Math.min(r.x0, r.x1), y0 = Math.min(r.y0, r.y1), w = Math.abs(r.x1 - r.x0) + 1, h = Math.abs(r.y1 - r.y0) + 1;
  if (w * h < 2) { draw(); return toast('Drag a box around the piece you want to copy.'); }
  const src = NEWIMG[s.id] ? img(NEWIMG[s.id]) : img(s.img); if (!ok(src)) { draw(); return toast('That map picture is still loading, try again.'); }
  const fw = src.naturalWidth / s.tiles[0], fh = src.naturalHeight / s.tiles[1], c = document.createElement('canvas'); c.width = w * 16; c.height = h * 16; const g = c.getContext('2d');
  g.drawImage(src, x0 * fw, y0 * fh, w * fw, h * fh, 0, 0, w * 16, h * 16);
  const pu = !builtMap(s.id) && (PAINTIMG[s.id] || s.paintUrl), pi = pu && img(pu); if (ok(pi)) g.drawImage(pi, x0 * 16, y0 * 16, w * 16, h * 16, 0, 0, w * 16, h * 16);   // terrain painted on top comes too
  const R = rowsOf(s.id), rows = Array.from({ length: h }, (_, j) => (R[y0 + j] || '').slice(x0, x0 + w).padEnd(w, '#'));
  let n = 1; while (clipById('c' + n)) n++; const id = 'c' + n, name = r.terrain ? `Ground from ${s.name}` : `${s.name} piece ${n}`;
  snap(); CLIPIMG[id] = c.toDataURL('image/png'); CLIPS.push({ id, name, dir: s.dir, w, h, rows, from: s.id }); $('#save').classList.add('hot'); DIRTY.add('clips');
  if (r.terrain) { terrainFromClip(clipById(id)); draw(); return; }
  S.clipSel = id; S.clipTool = 'stamp'; startGhost(id, { sid: s.id, x: x0 + w < s.tiles[0] - w ? x0 + w + 1 : Math.max(0, x0 - w - 1), y: y0 });
  toast(`Copied ${w}x${h} tiles. Drag the yellow box where you want the copy, then tap Apply.`, 7000); panel(); draw();
}
function bake(id) {   // redraw a built map: the ground (a clip repeated, or a plain colour), then every stamp in order
  const m = builtMap(id), s = sec(id), [W, H] = s.tiles, cv2 = document.createElement('canvas'); cv2.width = W * 16; cv2.height = H * 16; const g = cv2.getContext('2d');
  g.fillStyle = m.color || '#6b5b45'; g.fillRect(0, 0, W * 16, H * 16);
  const gc = m.ground && clipById(m.ground), gi = gc && clipImg(gc);
  if (gc && ok(gi)) for (let y = 0; y < H; y += gc.h) for (let x = 0; x < W; x += gc.w) g.drawImage(gi, x * 16, y * 16);
  terrainBake(m, g, W, H);   // painted terrain layers (studio.js) sit on the ground, under the stamps
  for (const st of m.stamps || []) { const c = clipById(st.c), ci = c && clipImg(c); if (c && ok(ci)) g.drawImage(ci, st.x * 16, st.y * 16); }
  NEWIMG[id] = cv2.toDataURL('image/png'); touch(id); draw();
}
function stampRows(id) {   // collision: the ground clip's walls repeated, then each stamp's walls on top
  const m = builtMap(id), s = sec(id), [W, H] = s.tiles, gc = m.ground && clipById(m.ground);
  const R = Array.from({ length: H }, (_, y) => Array.from({ length: W }, (_, x) => gc ? gc.rows[y % gc.h][x % gc.w] : '.'));
  terrainRows(m, R, W, H);
  for (const st of m.stamps || []) { const c = clipById(st.c); if (!c) continue; for (let j = 0; j < c.h; j++) for (let i = 0; i < c.w; i++) { const y = st.y + j, x = st.x + i; if (R[y] && R[y][x] !== undefined && c.rows[j][i] !== ' ') R[y][x] = c.rows[j][i]; } }   // ' ' in a clip's rows is see-through: the ground under it stays
  for (const [k, ch] of Object.entries(m.manual || {})) { const [x, y] = k.split(',').map(Number); if (R[y] && R[y][x] !== undefined) R[y][x] = ch; }   // Walkable edits made after the terrain and stamps
  for (const [side, e] of Object.entries(s.edges || {})) for (let k = e.range[0]; k <= e.range[1]; k++) { const [x, y] = { left: [0, k], right: [W - 1, k], top: [k, 0], bottom: [k, H - 1] }[side]; if (R[y]) R[y][x] = '.'; }
  for (const w of s.warps || []) if (R[w.tile[1]]) R[w.tile[1]][w.tile[0]] = '.';
  ROWS[id] = R.map(r => r.join('')); touch(id); draw();
}
const stampAt = (t, c) => [t.x - Math.floor((c.w - 1) / 2), t.y - Math.floor((c.h - 1) / 2)];   // a stamp lands centred on the tap
function startGhost(cid, at) {   // the picked clip appears as a yellow preview box in the middle of the view; Apply puts it down
  const c = clipById(cid); if (!c) return; let t = at;
  if (!t) { const r = cv.getBoundingClientRect(), [wx, wy] = toWorld({ clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }), h = tileAt(wx, wy);
    const s = h ? sec(h.sid) : viewSecs()[0]; if (!s) return toast('Open a map first.');
    t = h ? { sid: h.sid, x: h.x - Math.floor(c.w / 2), y: h.y - Math.floor(c.h / 2) } : { sid: s.id, x: Math.floor((s.tiles[0] - c.w) / 2), y: Math.floor((s.tiles[1] - c.h) / 2) }; }
  S.ghost = { c: cid, sid: t.sid, x: t.x, y: t.y, n: 0 }; clampGhost(); S.stamp = null;
  const px = Math.max(c.w, c.h) * 16 * S.zoom; if (px < 90) S.zoom = Math.min(6, 90 / (Math.max(c.w, c.h) * 16));   // zoom in so the preview is big enough to grab
  const s = sec(S.ghost.sid), [ox, oy] = origin(s); S.ox = cv.clientWidth / 2 - (ox + (S.ghost.x + c.w / 2) * 16) * S.zoom; S.oy = cv.clientHeight / 2 - (oy + (S.ghost.y + c.h / 2) * 16) * S.zoom;
}
function clampGhost() { const g = S.ghost, c = clipById(g.c), [W, H] = sec(g.sid).tiles; g.x = Math.max(0, Math.min(Math.max(0, W - c.w), g.x)); g.y = Math.max(0, Math.min(Math.max(0, H - c.h), g.y)); }
function ghostTo(t) { const g = S.ghost, d = S.ghostDrag || { dx: 0, dy: 0 }; if (!g || !t) return; g.sid = t.sid; g.x = t.x - d.dx; g.y = t.y - d.dy; clampGhost(); draw(); }
function applyGhost() {
  const g = S.ghost; if (g) g.c = adoptClip(g.c); const c = g && clipById(g.c); if (!c) return; snap(); const m = stampHost(g.sid, true); if (!m) return; (m.stamps = m.stamps || []).push({ c: c.id, x: g.x, y: g.y });
  clearManual(m, g.x, g.y, g.x + c.w - 1, g.y + c.h - 1); terrBake(g.sid); terrRows(g.sid); g.n++;
  if (!S.quickStamp) { const [W, H] = sec(g.sid).tiles, [ox, oy] = origin(sec(g.sid)), seen = (x, y) => { const X = (ox + x * 16) * S.zoom + S.ox, Y = (oy + y * 16) * S.zoom + S.oy; return X >= 0 && Y >= 0 && X + c.w * 16 * S.zoom <= cv.clientWidth && Y + c.h * 16 * S.zoom <= cv.clientHeight; };
    const to = [[c.w, 0], [-c.w, 0], [0, c.h], [0, -c.h]].map(([dx, dy]) => [g.x + dx, g.y + dy]).find(([x, y]) => x >= 0 && y >= 0 && x + c.w <= W && y + c.h <= H && seen(x, y)); if (to) [g.x, g.y] = to; }   // step the box aside, staying on screen, so the copy you just put down shows
  toast(g.n === 1 ? `Applied ${c.name}. Drag the box again to place another copy, or tap Done.` : `Copy ${g.n} applied.`); panel(); draw();
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
  S.view = id; views(); fit(); setMode('terrain'); toast(`New map ${id} ${name} (${W}x${H}). Paint it with the terrains on the right.${grid ? ' Then join it to the world with World: Move maps and Routes.' : ' Then point a door at it with World: Doors.'}`, 9000);
}
function clipsPanel() {
  const list = CLIPS.filter(c => S.clipsAll || c.dir === S.planet), tool = S.clipTool || 'cut', cur = S.clipSel && clipById(S.clipSel), m = S.view !== 'outdoor' && builtMap(S.view), st = S.stamp && S.stamp.kind === 'clip' && clipById(S.stamp.c);
  const g = S.ghost && clipById(S.ghost.c);
  return `<div id="preview"><div class="box" id="pbox"></div><div class="cap" id="pcap">${list.length ? 'Hover over a clip to see it large' : ''}</div></div>
    <div class="row seg">${[['cut', '&#9986; Copy'], ['stamp', '&#128204; Place'], ['move', '&#10021; Move']].map(([k, n]) => `<button class="tool ${tool === k ? 'on' : ''}" data-ct="${k}">${n}</button>`).join('')}</div>
    <p class="hint">${tool === 'cut' ? '<b>Drag a box over the map</b> to copy that piece. It becomes a clip below.' : tool === 'stamp' ? (g ? (S.quickStamp ? '<b>Tap the map</b> to put a copy down.' : '<b>Drag the yellow box</b> on the map to where you want it, then press <b>Apply</b>.') : '<b>Pick a clip below.</b> It shows on the map as a yellow box.') : '<b>Drag a copy you placed</b> to move it, or tap it and press Remove.'}</p>
    ${g && tool === 'stamp' ? `<div class="sel place"><img src="${CLIPIMG[g.id] || g.url}"><div><b>${esc(g.name)}</b><div class="hint">${g.w}x${g.h} tiles${S.ghost.n ? ` · ${S.ghost.n} placed` : ''}</div>
      ${S.quickStamp ? '' : '<button id="clipapply" class="go">&#10003; Apply here</button>'}</div></div>
      <label class="row"><input type="checkbox" id="clipquick" ${S.quickStamp ? 'checked' : ''}> quick mode: every tap puts a copy down (no Apply)</label>` : ''}
    <h4>Ready-made pieces</h4><p class="hint">Cut in advance from every map in this world${S.view !== 'outdoor' ? ', this map first' : ''}. Tap one, drag the yellow box, Apply.</p>${readyGrid()}
    <h4>Your clips</h4><div class="grid">${list.map(c => `<button class="pal ${S.clipSel === c.id ? 'on' : ''}" data-clip="${c.id}" data-cap="${esc(c.name)} · ${c.w}x${c.h} tiles" title="${esc(c.name)}"><img src="${CLIPIMG[c.id] || c.url}"><small>${esc(c.name)}</small></button>`).join('') || '<div class="hint">No clips yet: press Copy and drag a box over a map.</div>'}</div>
    <label class="row"><input type="checkbox" id="clipsall" ${S.clipsAll ? 'checked' : ''}> show clips from every world</label>
    ${cur ? `<div class="sel">${cur.ready ? `<b>${esc(cur.name)}</b><div class="hint">${cur.w}x${cur.h} tiles. Ready-made: it's saved to Your clips when you place it.</div>` : `<label>Name <input id="clipname" value="${esc(cur.name)}"></label><div class="hint">${cur.w}x${cur.h} tiles, copied from ${cur.from} ${esc((sec(cur.from) || {}).name || '')}</div>`}
      <div class="row">${S.ghost ? '' : '<button id="clipplace" class="go">&#128204; Place on map</button>'}<button id="clipterr" title="Paint with it in Paint: Terrain; its edges blend in">Make it a terrain</button>${m ? `<button id="clipground">Repeat it as this map's ground</button>` : ''}${cur.ready ? '' : '<button id="cliprm">Delete clip</button>'}</div></div>` : ''}
    ${how(`<li><b>Copy</b>: drag a box over any part of a map (a bridge, rocks, a doorway, flowers). It becomes a clip.</li><li><b>Place</b>: pick a clip. A yellow box shows where it will go: drag it into place and press <b>Apply</b>. Its walls and walkable ground come with it.</li><li><b>Move</b>: drag a copy you placed to adjust it, or tap it and Remove.</li>`)}
    ${builtMap(S.view) ? '' : '<p class="hint">On finished maps copies go on a see-through layer, so the picture underneath never changes.</p>'}`;
}
// ---------- saving ----------
function bundle() {
  const npcs = { moves: MOVES, added: ADDED, removed: REMOVED };
  const coll = {}; for (const id of Object.keys(ROWS)) coll[id] = { id, name: sec(id).name, tiles: sec(id).tiles, edited: true, legend: { '.': 'walk', '#': 'blocked', ',': 'tall grass' }, rows: ROWS[id] };
  const images = {}; for (const m of MAPS) if (NEWIMG[m.id]) images[m.img] = NEWIMG[m.id];
  for (const c of CLIPS) if (CLIPIMG[c.id]) images['art/editor_clips/' + c.id + '.png'] = CLIPIMG[c.id];
  const clips = CLIPS.map(({ url, ...c }) => c), files = {}, tilesets = studioBundle(images, files);   // terrains, new sprites and prop sheets
  const out = { version: 1, layout: LAYOUT, npcs, mons: MONS, maps: MAPS, collision: coll, images, grid: GRID, routes: ROUTES, doors: DOORS, clips, tilesets, files };
  designBundle(out); return out;
}
let DIR = null;
async function save() {
  if (DIRTY.size && !check() && !confirm('Some doors or exits are cut off on maps you edited (Test: Check shows where). Save anyway?')) return;
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
    await put('data/editor/tilesets.json', JSON.stringify(b.tilesets, null, 1));
    await put('data/editor/design.json', JSON.stringify(b.design, null, 1));
    for (const [rel, txt] of Object.entries(b.files)) await put(rel, txt);
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
function toast(t, ms = 3000) { const el = $('#toast'); el.textContent = side(t); el.classList.add('on'); clearTimeout(TT); TT = setTimeout(() => el.classList.remove('on'), ms); }
function centerOn(id) { const s = sec(id); if (!s) return; const [ox, oy] = origin(s), [W, H] = s.tiles; S.ox = cv.clientWidth / 2 - (ox + W * 8) * S.zoom; S.oy = cv.clientHeight / 2 - (oy + H * 8) * S.zoom; draw(); }
function fit() { const ss = viewSecs(); if (!ss.length) return; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const s of ss) { const [ox, oy] = origin(s); x0 = Math.min(x0, ox); y0 = Math.min(y0, oy); x1 = Math.max(x1, ox + s.tiles[0] * 16); y1 = Math.max(y1, oy + s.tiles[1] * 16); }
  S.zoom = Math.max(0.25, Math.min(6, Math.min(cv.clientWidth / (x1 - x0 + 40), cv.clientHeight / (y1 - y0 + 40)))); S.ox = 20 - x0 * S.zoom; S.oy = 20 - y0 * S.zoom; draw(); }
function views() { const ss = planetSecs().sort((a, b) => a.id.localeCompare(b.id));
  $('#view').innerHTML = `<option value="outdoor">Whole world (outdoor maps stitched)</option>` + ss.map(s => `<option value="${s.id}" ${S.view === s.id ? 'selected' : ''}>${s.id} ${s.name}${s.grid ? '' : s.type === 'interior' ? ' (inside)' : ' (' + s.type + ')'}</option>`).join(''); $('#view').value = S.view; }
async function boot() {
  ED = await (await fetch('editor_data.json', { cache: 'no-store' })).json();
  LAYOUT = ED.layout || {}; MOVES = (ED.edits.npcs || {}).moves || {}; ADDED = (ED.edits.npcs || {}).added || {}; REMOVED = (ED.edits.npcs || {}).removed || {}; MONS = ED.edits.mons || {}; MAPS = ED.edits.maps || []; GRID = ED.edits.grid || {}; ROUTES = ED.edits.routes || []; DOORS = ED.edits.doors || {}; CLIPS = ED.edits.clips || []; TILESETS = ED.edits.tilesets || []; designBoot();
  const dirs = Object.keys(ED.planets).sort(); S.planet = dirs[0]; S.sheet = Object.keys(ED.props).find(d => d === S.planet) || Object.keys(ED.props)[0];
  $('#planet').innerHTML = dirs.map(d => `<option value="${d}">${ED.planets[d]}</option>`).join('');
  $('#planet').onchange = e => { S.planet = e.target.value; S.view = 'outdoor'; S.sel = null; if (ED.props[S.planet]) S.sheet = S.planet; views(); panel(); fit(); };
  $('#view').onchange = e => { S.view = e.target.value; S.sel = null; fit(); };
  $('#modes').innerHTML = GROUPS.map(([k, i, n, subs]) => `<button data-group="${k}" title="${subs.map(x => x[1]).join(', ')}"><i>${i}</i><span>${n}</span></button>`).join('');
  document.querySelectorAll('[data-group]').forEach(b => b.onclick = () => { const g = GROUPS.find(g => g[0] === b.dataset.group); setMode((S.lastSub || {})[g[0]] || g[3][0][0]); });
  setMode(S.mode);
  $('#walls').onchange = e => { S.walls = e.target.checked; draw(); }; $('#showdoors').onchange = draw;
  $('#zin').onclick = () => { S.zoom = Math.min(8, S.zoom * 1.25); draw(); }; $('#zout').onclick = () => { S.zoom = Math.max(0.25, S.zoom / 1.25); draw(); }; $('#zfit').onclick = fit;
  $('#undo').onclick = undo; $('#save').onclick = save;
  $('#hand').onclick = () => { S.hand = !S.hand; $('#hand').classList.toggle('on', S.hand); draw(); toast(S.hand ? 'Hand on: one finger moves the map. Tap the hand again to edit.' : 'Hand off: one finger edits again.'); };
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
