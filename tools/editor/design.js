// Alienmon map editor, part three: map design tools. Loaded after studio.js and before editor.js; uses editor.js globals.
// Prop groups (select several, line up, space evenly, copy and paste), the Map Logic checker (docs/MAP_LOGIC_PACK.md section 5),
// saved versions with crash recovery, and the all-worlds overview.
'use strict';

// ---------- prop groups ----------
const inMulti = (sid, i) => S.multi && S.multi.sid === sid && S.multi.idx.includes(i);
function multiToggle(sid, i) {
  if (!S.multi || S.multi.sid !== sid) S.multi = { sid, idx: [] };
  const k = S.multi.idx.indexOf(i); if (k >= 0) S.multi.idx.splice(k, 1); else S.multi.idx.push(i);
  if (!S.multi.idx.length) S.multi = null; S.sel = null; panel(); draw();
}
function boxSelect() {
  const r = S.boxSel; S.boxSel = null; const s = sec(r.sid), [ox, oy] = origin(s), x0 = Math.min(r.x0, r.x1) - ox, x1 = Math.max(r.x0, r.x1) - ox, y0 = Math.min(r.y0, r.y1) - oy, y1 = Math.max(r.y0, r.y1) - oy;
  const hit = (LAYOUT[r.sid] || []).map((q, i) => [propBox(q), i]).filter(([b]) => b && b.X < x1 && b.X + b.pw > x0 && b.Y < y1 && b.Y + b.ph > y0).map(([, i]) => i);
  if (!S.multi || S.multi.sid !== r.sid) S.multi = { sid: r.sid, idx: [] };
  for (const i of hit) if (!S.multi.idx.includes(i)) S.multi.idx.push(i);
  if (!S.multi.idx.length) S.multi = null; S.sel = null;
  toast(hit.length ? `${S.multi.idx.length} props selected` : 'No props in that box'); panel(); draw();
}
const feetOf = (q, b) => q.solid === false ? b.Y + b.ph / 2 : b.Y + b.ph;   // where a prop meets the ground
function setFeet(q, b, F) { if (q.solid === false) { q.oy = Math.round(F - b.ph / 2 - (q.y * 16 + Math.round((b.h * 16 - b.ph) / 2))); return; }
  q.y = Math.max(0, Math.floor((F - 1) / 16) - b.h + 1); q.oy = Math.round(F - (q.y + b.h) * 16); }
function setCentre(q, b, cx) { q.x = Math.max(0, Math.round((cx - b.w * 8) / 16)); q.ox = Math.round(cx - (q.x * 16 + b.w * 8)); }
function tidy(q) { if (!q.ox) delete q.ox; if (!q.oy) delete q.oy; }
function groupOp(op) {
  const m = S.multi; if (!m || m.idx.length < 2) return toast('Select two or more props first.');
  const L = LAYOUT[m.sid], items = m.idx.map(i => ({ q: L[i], b: propBox(L[i]) })).filter(x => x.b); snap();
  const cx = x => x.b.X + x.b.pw / 2, a = items[0];   // the first prop picked is the anchor
  if (op === 'row') { const F = feetOf(a.q, a.b); for (const x of items) setFeet(x.q, x.b, F); }
  else if (op === 'col') { const C = cx(a); for (const x of items) setCentre(x.q, x.b, C); }
  else if (op === 'spaceX' || op === 'spaceY') { const key = op === 'spaceX' ? cx : x => feetOf(x.q, x.b), s = items.slice().sort((p, q) => key(p) - key(q));
    if (s.length < 3) return toast('Spacing evenly needs three or more props.'); const lo = key(s[0]), step = (key(s[s.length - 1]) - lo) / (s.length - 1);
    s.forEach((x, i) => { if (!i || i === s.length - 1) return; const v = lo + step * i; if (op === 'spaceX') setCentre(x.q, x.b, v); else setFeet(x.q, x.b, v); x.b = propBox(x.q); }); }
  else if (op === 'mirror') { if (items.length !== 2) return toast('Pick exactly two props to pair them.'); const [p, q] = items, s = sec(m.sid), mid = s.tiles[0] * 8;
    setFeet(q.q, q.b, feetOf(p.q, p.b)); q.b = propBox(q.q); const target = cx(p) < mid ? mid + (mid - cx(p)) : mid - (cx(p) - mid); if (Math.abs(target - cx(q)) > 2 * 16) toast('Lined up on the same row; they sit far from mirror spots, so only the height was matched.'); else setCentre(q.q, q.b, target); }
  for (const x of items) tidy(x.q); touch(m.sid); draw(); panel();
}
function groupMove(dx, dy) { const m = S.multi; if (!m) return; const L = LAYOUT[m.sid], [W, H] = sec(m.sid).tiles;
  if (m.idx.some(i => L[i].x + dx < 0 || L[i].y + dy < 0 || L[i].x + dx >= W || L[i].y + dy >= H)) return toast('That would push a prop off the map.');
  for (const i of m.idx) { L[i].x += dx; L[i].y += dy; } touch(m.sid); draw(); }
function groupCopy() { const m = S.multi; if (!m) return; const L = LAYOUT[m.sid], qs = m.idx.map(i => L[i]), x0 = Math.min(...qs.map(q => q.x)), y0 = Math.min(...qs.map(q => q.y));
  S.stamp = { kind: 'group', items: qs.map(q => ({ ...q, x: q.x - x0, y: q.y - y0 })), w: Math.max(...qs.map(q => q.x)) - x0 + 1 }; S.multi = null;
  toast(`Copied ${qs.length} props. Click any map to paste the group (its top-left goes where you click). Esc stops.`, 6000); panel(); draw(); }
function groupPaste(t) { const [W, H] = sec(t.sid).tiles, L = LAYOUT[t.sid] = LAYOUT[t.sid] || []; snap(); const start = L.length; let skipped = 0;
  for (const q of S.stamp.items) { const x = t.x + q.x, y = t.y + q.y; if (x >= W || y >= H) { skipped++; continue; } L.push({ ...q, x, y }); }
  S.multi = { sid: t.sid, idx: Array.from({ length: L.length - start }, (_, k) => start + k) }; touch(t.sid); panel(); draw();
  if (skipped) toast(`${skipped} prop(s) fell off the edge and were left out.`); }
function groupDelete() { const m = S.multi; if (!m) return; snap(); const L = LAYOUT[m.sid]; m.idx.slice().sort((a, b) => b - a).forEach(i => L.splice(i, 1)); touch(m.sid); S.multi = null; panel(); draw(); }
function groupPanel() {
  const m = S.multi; if (!m) return '';
  return `<div class="sel"><b>${m.idx.length} props selected</b> <span class="hint">(the first one you picked is the anchor)</span>
    <div class="row" style="margin-top:6px"><button data-gop="row" title="Same ground line as the anchor">Line up in a row</button><button data-gop="col" title="Same centre line as the anchor">Line up in a column</button></div>
    <div class="row" style="margin-top:6px"><button data-gop="spaceX">Space evenly across</button><button data-gop="spaceY">Space evenly down</button><button data-gop="mirror" title="Two props: same height, mirrored across the middle of the map">Pair</button></div>
    ${padHtml('')}<div class="row"><button id="gcopy">Copy group (Ctrl+C)</button><button id="gdel">Delete group</button><button id="gclear">Done</button></div>
    <div class="hint">Shift+click adds or removes a prop; Shift+drag draws a box. Drag any picked prop to move the whole group.</div></div>`;
}

// ---------- Map Logic checker (docs/MAP_LOGIC_PACK.md, section 5) ----------
const SIZE_TARGET = { town: [50, 45], route: [50, 90], field: [50, 90], landmark: [50, 45], interior: [14, 11] };
function walkable(c) { return c === '.' || c === ','; }
function logicCheck(ids) {
  const out = [], add = (sid, sev, msg, tiles) => out.push({ sid, sev, msg, tiles: tiles || [] });
  for (const id of ids) { const s = sec(id); if (!s) continue; const R = rowsOf(id); if (!R.length) { add(id, 'warn', 'No walls painted yet.'); continue; }
    const [W, H] = s.tiles, inside = s.type === 'interior', at = (x, y) => (R[y] || '')[x];
    // exits and doors lead somewhere, and back
    for (const [side, e] of Object.entries(s.edges || {})) { const t = sec(e.to);
      if (!t) add(id, 'bad', `The ${side} exit leads nowhere.`); else if (!((t.edges || {})[OPP[side]] && t.edges[OPP[side]].to === id)) add(id, 'bad', `The ${side} exit to ${t.name} has no way back.`); }
    for (const d of allDoors(id)) { if (!d.to) add(id, 'bad', 'A door opens nothing.', [d.x + ',' + d.y]);
      else if (!d.to.startsWith('menu:') && d.to !== 'back' && !sec(d.to)) add(id, 'bad', `A door opens a room that doesn't exist (${d.to}).`, [d.x + ',' + d.y]);
      const side = [[0, 1], [0, -1], [-1, 0], [1, 0]].find(([a, b]) => walkable(at(d.x + a, d.y + b)));   // doors open from below, room exits and counters from any side
      if (!side) add(id, 'bad', 'Nothing to stand on beside a door.', [d.x + ',' + d.y]);
      else if (!inside && !d.to.startsWith('menu:') && side[1] === 1 && !walkable(at(d.x, d.y + 2))) add(id, 'warn', 'A door has only a 1-tile apron (2 wanted).', [d.x + ',' + (d.y + 2)]); }
    for (const w of s.warps || []) if (w.to && w.to !== 'back' && !w.to.includes(':') && !sec(w.to)) add(id, 'bad', `A passage leads to a missing map (${w.to}).`, [w.tile.join(',')]);
    // everything walkable can be reached
    const RE = reachOf(id), cut = []; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (walkable(at(x, y)) && !RE.seen.has(x + ',' + y) && !RE.solid.has(x + ',' + y)) cut.push(x + ',' + y);
    if (cut.length) add(id, 'warn', `${cut.length} walkable tile(s) can never be reached.`, cut);
    if (!inside) {
      // nothing walkable narrower than 3 tiles
      const pinch = []; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!walkable(at(x, y)) || RE.solid.has(x + ',' + y)) continue;
        let a = x, b = x, c = y, d = y; while (walkable(at(a - 1, y))) a--; while (walkable(at(b + 1, y))) b++; while (walkable(at(x, c - 1))) c--; while (walkable(at(x, d + 1))) d++;
        if (Math.min(b - a + 1, d - c + 1) < 3) pinch.push(x + ',' + y); }
      if (pinch.length) add(id, 'warn', `${pinch.length} tile(s) of path narrower than 3 tiles.`, pinch);
      // no empty 10x10 patches
      const empty = []; for (let y0 = 0; y0 + 10 <= H; y0 += 10) for (let x0 = 0; x0 + 10 <= W; x0 += 10) { let walk = 0, stuff = 0;
        for (let y = y0; y < y0 + 10; y++) for (let x = x0; x < x0 + 10; x++) if (walkable(at(x, y))) walk++;
        stuff += (LAYOUT[id] || []).filter(q => q.x >= x0 && q.x < x0 + 10 && q.y >= y0 && q.y < y0 + 10).length + npcsOf(id).filter(n => n.x >= x0 && n.x < x0 + 10 && n.y >= y0 && n.y < y0 + 10).length;
        if (walk >= 60 && !stuff) for (let y = y0; y < y0 + 10; y++) for (let x = x0; x < x0 + 10; x++) empty.push(x + ',' + y); }
      if (empty.length) add(id, 'warn', `${empty.length / 100} open 10x10 area(s) with no props or people.`, empty);
      // every building gets everyday objects around it
      for (const o of s.objects || []) if (['house', 'bay', 'shop'].includes(o.k)) { const n = (LAYOUT[id] || []).filter(q => Math.abs(q.x - o.tile[0]) <= 5 && Math.abs(q.y - o.tile[1]) <= 4).length;
        if (n < 2) add(id, 'warn', `A building has ${n} prop(s) near its door (2 or more wanted).`, [o.tile.join(',')]); }
      // long straight runs: a full-width walkable row or column longer than 20 with no prop on it
      const lane = (x, y) => { let c = y, d = y; while (walkable(at(x, c - 1))) c--; while (walkable(at(x, d + 1))) d++; return d - c + 1 <= 8; };   // a path, not a plaza
      const runs = []; for (let y = 0; y < H; y++) { let run = 0; for (let x = 0; x <= W; x++) { if (x < W && walkable(at(x, y)) && !RE.solid.has(x + ',' + y) && lane(x, y)) run++; else { if (run > 20) for (let k = 0; k < run; k++) runs.push((x - run + k) + ',' + y); run = 0; } } }
      if (runs.length) add(id, 'info', 'A straight stretch of path over 20 tiles long: add a jog, a widening or a prop island.', runs);
    }
    if (typeof logicExtra === 'function') logicExtra(id, add);   // people, sightlines and items (added with the People tools)
  }
  return out;
}
function worldCheck(dir) {   // per world: wildlife zones and a water edge
  const out = [], ss = Object.values(ED.sections).filter(s => s.dir === dir);
  const grass = ss.filter(s => (rowsOf(s.id) || []).join('').split(',').length - 1 >= 36).length, water = ss.filter(s => /~/.test((rowsOf(s.id) || []).join(''))).length;
  if (grass < 2) out.push({ sid: null, sev: 'warn', msg: `Only ${grass} map(s) on this world have a wildlife zone (36+ tiles of tall grass); 2 or more wanted.`, tiles: [] });
  const small = ss.filter(s => { const tg = SIZE_TARGET[s.type === 'interior' ? 'interior' : s.type]; return tg && (s.tiles[0] < tg[0] * 0.5 || s.tiles[1] < tg[1] * 0.5); }).length;
  if (small) out.push({ sid: null, sev: 'info', msg: `${small} map(s) are smaller than the Map Logic Pack sizes (towns about 50x45, routes 50x90, rooms 14x11). The painted renders are 24x16, so this is a note, not a fault.`, tiles: [] });
  if (!water) out.push({ sid: null, sev: 'info', msg: 'No water edge on this world yet (paint water with the Ground brushes).', tiles: [] });
  return out;
}
function logicPanel() {
  const res = S.logic;
  return `<h3>Map Logic check</h3><p class="hint">Checks maps against the Map Logic Pack: exits and doors lead somewhere and back, doors have room in front, every path can be reached and is at least 3 wide, no empty patches, buildings dressed, trainers' sightlines don't overlap, people stay out of door fronts.</p>
    <div class="row"><button id="lgthis">Check this map</button><button id="lgworld">Check the whole world</button></div>
    ${res ? `<div style="margin-top:8px">${res.length ? res.map((r, i) => `<div class="${r.sev === 'bad' ? 'bad' : r.sev === 'warn' ? '' : 'hint'}" style="margin:4px 0">${r.sev === 'bad' ? '&#10060;' : r.sev === 'warn' ? '&#9888;' : '&#8505;'} ${r.sid ? `<b>${r.sid} ${sec(r.sid).name}</b>: ` : ''}${r.msg} ${r.sid ? `<button data-lg="${i}">Show</button>` : ''}</div>`).join('') : '<div class="good">Everything passes.</div>'}</div>` : ''}`;
}
function logicShow(i) { const r = S.logic[i]; if (!r || !r.sid) return; if (S.view !== 'outdoor' || !onWorld(sec(r.sid))) { S.view = r.sid; views(); fit(); } else centerOn(r.sid); S.hl = { sid: r.sid, keys: new Set(r.tiles) }; draw(); }

// ---------- versions and crash recovery (IndexedDB, this browser only) ----------
const VDB = () => new Promise((ok_, no) => { const r = indexedDB.open('alienmon-editor', 1); r.onupgradeneeded = () => r.result.createObjectStore('v'); r.onsuccess = () => ok_(r.result); r.onerror = () => no(r.error); });
async function vput(key, val) { const db = await VDB(); return new Promise(r => { const tx = db.transaction('v', 'readwrite'); val === undefined ? tx.objectStore('v').delete(key) : tx.objectStore('v').put(val, key); tx.oncomplete = r; tx.onerror = r; }); }
async function vall() { const db = await VDB(); return new Promise(r => { const out = [], c = db.transaction('v').objectStore('v').openCursor(); c.onsuccess = () => { const k = c.result; if (k) { out.push([k.key, k.value]); k.continue(); } else r(out); }; c.onerror = () => r(out); }); }
function stateNow(name) { return { name, t: Date.now(), state: JSON.stringify({ LAYOUT, MOVES, ADDED, REMOVED, MONS, ROWS, GRID, ROUTES, DOORS, CLIPS, MAPS, TILESETS, DS, SPRITES, EDGES: edgeSnap() }), imgs: { NEWIMG, CLIPIMG, TSIMG } }; }
function stateLoad(v) {
  const st = JSON.parse(v.state); let E; ({ LAYOUT, MOVES, ADDED, REMOVED, MONS, ROWS, GRID, ROUTES, DOORS, CLIPS, MAPS, EDGES: E } = st); TILESETS = st.TILESETS || []; DS = st.DS || DS; SPRITES = st.SPRITES || [];
  Object.assign(NEWIMG, v.imgs.NEWIMG || {}); Object.assign(CLIPIMG, v.imgs.CLIPIMG || {}); Object.assign(TSIMG, v.imgs.TSIMG || {});
  for (const m of MAPS) if (!ED.sections[m.id]) ED.sections[m.id] = { id: m.id, name: m.name, planet: m.planet, dir: m.dir, type: m.type, tiles: m.tiles, grid: m.type === 'interior' ? null : GRID[m.id] || null, img: NEWIMG[m.id] || '', rows: [], edges: {}, warps: m.type === 'interior' ? [{ tile: [Math.floor(m.tiles[0] / 2) - 1, m.tiles[1] - 1], to: 'back', kind: 'door' }] : [], objects: [], spawns: {}, npcs: [], mons: [], _new: true };
  for (const [k, e] of Object.entries(E || {})) if (ED.sections[k]) ED.sections[k].edges = e;
  for (const s of SPRITES) if (s.kind === 'char') ED.chars[s.name] = s.files[`art/characters/${s.name}.png`]; else { const l = ED.props[s.sheet] = ED.props[s.sheet] || []; if (!l.some(p => p.n === s.n)) l.push({ n: s.n, px: s.px, url: s.url }); }
  for (const id of Object.keys(ROWS)) DIRTY.add(id); DIRTY.add('restored'); $('#save').classList.add('hot'); S.sel = null; S.multi = null; views(); panel(); fit();
}
async function versionsPanelFill() {
  const el = $('#vlist'); if (!el) return; const all = (await vall()).filter(([k]) => k !== 'draft').sort((a, b) => b[1].t - a[1].t);
  el.innerHTML = all.length ? all.map(([k, v]) => `<div class="row" style="margin:3px 0"><span style="flex:1">${v.name} <span class="hint">${new Date(v.t).toLocaleString()}</span></span><button data-vload="${k}">Restore</button><button data-vdel="${k}">&#10005;</button></div>`).join('') : '<div class="hint">No saved versions yet.</div>';
  el.querySelectorAll('[data-vload]').forEach(b => b.onclick = async () => { const v = (await vall()).find(([k]) => k === b.dataset.vload); if (v && confirm(`Go back to "${v[1].name}"? Changes since then stay in Undo until you reload.`)) { snap(); stateLoad(v[1]); toast('Restored. Save to keep it.'); } });
  el.querySelectorAll('[data-vdel]').forEach(b => b.onclick = async () => { await vput(b.dataset.vdel); versionsPanelFill(); });
}
setInterval(() => { try { if (ED && DIRTY.size) vput('draft', stateNow('Unsaved work')); else if (ED) vput('draft'); } catch (e) {} }, 45000);   // crash recovery: a draft while there are unsaved changes
async function recoverDraft() { try { const d = (await vall()).find(([k]) => k === 'draft'); if (d && confirm(`The editor found unsaved work from ${new Date(d[1].t).toLocaleString()}. Bring it back?`)) stateLoad(d[1]); else if (d) vput('draft'); } catch (e) {} }

// ---------- overview of every world ----------
function overviewPanel() {
  return `<h3>All worlds</h3><p class="hint">Every world's outdoor maps, as they are stitched. Tap a world to open it. Numbers: maps, then problems the Map Logic check finds.</p><div id="ovgrid" class="grid wide"></div>`;
}
function overviewFill() {
  const g = $('#ovgrid'); if (!g) return;
  for (const dir of Object.keys(ED.planets).sort()) { const ss = Object.values(ED.sections).filter(s => s.dir === dir && (GRID[s.id] || s.grid));
    if (!ss.length) continue; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const s of ss) { const [gx, gy] = gridOf(s); x0 = Math.min(x0, gx); y0 = Math.min(y0, gy); x1 = Math.max(x1, gx + s.tiles[0]); y1 = Math.max(y1, gy + s.tiles[1]); }
    const c = document.createElement('canvas'), k = Math.min(260 / (x1 - x0), 180 / (y1 - y0)); c.width = Math.ceil((x1 - x0) * k); c.height = Math.ceil((y1 - y0) * k); const cx = c.getContext('2d');
    const paint = () => { cx.fillStyle = '#0d0a18'; cx.fillRect(0, 0, c.width, c.height); for (const s of ss) { const [gx, gy] = gridOf(s), im = NEWIMG[s.id] ? img(NEWIMG[s.id]) : img(s.img);
      if (ok(im)) cx.drawImage(im, (gx - x0) * k, (gy - y0) * k, s.tiles[0] * k, s.tiles[1] * k); else { cx.fillStyle = '#333'; cx.fillRect((gx - x0) * k, (gy - y0) * k, s.tiles[0] * k, s.tiles[1] * k); } } };
    paint(); setTimeout(paint, 1500);
    const probs = logicCheck(Object.values(ED.sections).filter(s => s.dir === dir).map(s => s.id)).filter(r => r.sev !== 'info').length;
    const b = document.createElement('button'); b.className = 'pal'; b.style.flexDirection = 'column'; b.style.height = 'auto'; b.title = ED.planets[dir];
    b.append(c); c.style.maxWidth = '100%'; b.insertAdjacentHTML('beforeend', `<div style="color:#1b1424;font-size:12px">${ED.planets[dir]} · ${ss.length} maps · ${probs ? probs + ' to fix' : 'all clear'}</div>`);
    b.onclick = () => { S.planet = dir; $('#planet').value = dir; S.view = 'outdoor'; views(); fit(); toast(ED.planets[dir]); };
    g.append(b); }
}

// ---------- hooks called from editor.js ----------
let DS = { zones: {}, objs: {}, people: {}, settings: {}, ground: {} };   // design data saved to data/editor/design.json (filled in by the tools below)
function designPanel(m) {
  let h = '';
  if (m === 'props') h += `<label class="row"><input type="checkbox" id="multimode" ${S.multiMode ? 'checked' : ''}> select several (tap props, or drag a box)</label>` + groupPanel();
  if (m === 'check') h += logicPanel();
  if (m === 'overview') h += overviewPanel();
  if (m === 'versions') h += `<h3>Versions</h3><p class="hint">Snapshots of everything you've changed, kept in this browser. Restore one to go back. Unsaved work is also kept here every minute, so a crash or closed tab doesn't lose it.</p>
    <div class="row"><input id="vname" placeholder="e.g. Ferrox before the market" style="flex:1"><button id="vsave">Save version</button></div><div id="vlist" style="margin-top:8px">Loading...</div>`;
  return h + (typeof designPanel2 === 'function' ? designPanel2(m) : '');
}
function designWire() {
  const on = (sel, ev, f) => { const el = $(sel); if (el) el.addEventListener(ev, f); };
  document.querySelectorAll('[data-gop]').forEach(b => b.onclick = () => groupOp(b.dataset.gop));
  on('#multimode', 'change', e => { S.multiMode = e.target.checked; S.stamp = null; panel(); });
  on('#gcopy', 'click', groupCopy); on('#gdel', 'click', groupDelete); on('#gclear', 'click', () => { S.multi = null; panel(); draw(); });
  on('#lgthis', 'click', () => { if (S.view === 'outdoor') return toast('Open one map first (or check the whole world).'); S.logic = logicCheck([S.view]); S.hl = null; panel(); draw(); });
  on('#lgworld', 'click', () => { S.logic = worldCheck(S.planet).concat(logicCheck(planetSecs().map(s => s.id))); S.hl = null; panel(); draw(); });
  document.querySelectorAll('[data-lg]').forEach(b => b.onclick = () => logicShow(+b.dataset.lg));
  on('#vsave', 'click', async () => { const n = ($('#vname').value || '').trim() || 'Version ' + new Date().toLocaleString(); await vput('v' + Date.now(), stateNow(n)); toast('Version saved: ' + n); versionsPanelFill(); });
  if ($('#vlist')) versionsPanelFill(); if ($('#ovgrid')) overviewFill();
  if (typeof designWire2 === 'function') designWire2();
}
function designDown(e, t, wx, wy) {   // true = handled here
  if (typeof designDown2 === 'function' && designDown2(e, t, wx, wy)) return true;
  if (e.button !== 0 || e.altKey) return false;
  if (S.mode !== 'props') return false;
  if (S.stamp && S.stamp.kind === 'group') { if (t) groupPaste(t); return true; }
  const it = itemAt(wx, wy);
  if (e.shiftKey || S.multiMode) { if (it && it.ref.kind === 'prop') multiToggle(it.ref.sid, it.ref.i); else if (t) { S.boxSel = { sid: t.sid, x0: wx, y0: wy, x1: wx, y1: wy }; draw(); } return true; }
  if (S.multi && it && it.ref.kind === 'prop' && inMulti(it.ref.sid, it.ref.i)) { snap(); S.groupDrag = { t0: tileAt(wx, wy), dx: 0, dy: 0 }; return true; }
  if (S.multi && !S.stamp) { S.multi = null; panel(); }
  return false;
}
function designMove(e, t, wx, wy) {
  if (typeof designMove2 === 'function' && designMove2(e, t, wx, wy)) return true;
  if (S.boxSel) { S.boxSel.x1 = wx; S.boxSel.y1 = wy; draw(); return true; }
  if (S.groupDrag) { if (!t || !S.groupDrag.t0) return true; const dx = t.x - S.groupDrag.t0.x - S.groupDrag.dx, dy = t.y - S.groupDrag.t0.y - S.groupDrag.dy; if (dx || dy) { const L = LAYOUT[S.multi.sid], [W, H] = sec(S.multi.sid).tiles;
    if (!S.multi.idx.some(i => L[i].x + dx < 0 || L[i].y + dy < 0 || L[i].x + dx >= W || L[i].y + dy >= H)) { for (const i of S.multi.idx) { L[i].x += dx; L[i].y += dy; } S.groupDrag.dx += dx; S.groupDrag.dy += dy; touch(S.multi.sid); draw(); } } return true; }
  return false;
}
function designUp() { if (typeof designUp2 === 'function') designUp2(); if (S.boxSel) boxSelect(); if (S.groupDrag) { S.groupDrag = null; panel(); } }
function designKey(e) {   // true = handled here
  if (typeof designKey2 === 'function' && designKey2(e)) return true;
  if (!S.multi) return false;
  if (e.key.startsWith('Arrow')) { e.preventDefault(); snap(); const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]; groupMove(d[0], d[1]); return true; }
  if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); groupDelete(); return true; }
  if ((e.ctrlKey || e.metaKey) && e.key === 'c') { groupCopy(); return true; }
  if (e.key === 'Escape') { S.multi = null; return false; }
  return false;
}
function designNudge(dx, dy) { if (!S.multi) return false; snap(); groupMove(dx, dy); return true; }
function designDraw(ctx) {
  if (S.multi) { const s = sec(S.multi.sid), [ox, oy] = origin(s); ctx.save(); ctx.strokeStyle = '#5ff2ff'; ctx.lineWidth = 1.5 / S.zoom; ctx.setLineDash([3 / S.zoom, 2 / S.zoom]);
    S.multi.idx.forEach((i, k) => { const b = propBox(LAYOUT[S.multi.sid][i]); if (!b) return; ctx.strokeStyle = k ? '#5ff2ff' : '#ffd23f'; ctx.strokeRect(ox + b.X, oy + b.Y, b.pw, b.ph); }); ctx.restore(); }
  if (S.boxSel) { const r = S.boxSel; ctx.save(); ctx.fillStyle = 'rgba(95,242,255,0.15)'; ctx.strokeStyle = '#5ff2ff'; ctx.lineWidth = 1 / S.zoom; ctx.fillRect(Math.min(r.x0, r.x1), Math.min(r.y0, r.y1), Math.abs(r.x1 - r.x0), Math.abs(r.y1 - r.y0)); ctx.strokeRect(Math.min(r.x0, r.x1), Math.min(r.y0, r.y1), Math.abs(r.x1 - r.x0), Math.abs(r.y1 - r.y0)); ctx.restore(); }
  if (S.hl && sec(S.hl.sid) && viewSecs().includes(sec(S.hl.sid))) { const [ox, oy] = origin(sec(S.hl.sid)); ctx.save(); ctx.fillStyle = 'rgba(255,210,63,0.45)';
    for (const k of S.hl.keys) { const [x, y] = k.split(',').map(Number); ctx.fillRect(ox + x * 16, oy + y * 16, 16, 16); } ctx.restore(); }
  if (S.hover && S.stamp && S.stamp.kind === 'group') { const [h] = S.hover; ctx.save(); ctx.globalAlpha = 0.6; for (const q of S.stamp.items) { const b = propBox({ ...q, x: h.x + q.x, y: h.y + q.y }); const im = b && img(b.url); if (ok(im)) ctx.drawImage(im, h.ox + b.X, h.oy + b.Y); } ctx.restore(); }
  if (typeof designDraw2 === 'function') designDraw2(ctx);
}
function designBundle(b) { b.design = DS; if (typeof designBundle2 === 'function') designBundle2(b); }
function designBoot() { DS = Object.assign({ zones: {}, objs: {}, people: {}, settings: {}, ground: {} }, ED.edits.design || {}); recoverDraft(); if (typeof designBoot2 === 'function') designBoot2(); }
