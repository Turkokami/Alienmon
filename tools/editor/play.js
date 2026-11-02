// Alienmon map editor, part four: Playtest, wild Encounters, Ground brushes (water, lava, ledges, walk-behind), People and
// trainers, Items and signs, Map settings, and terrain painted over finished maps. Everything lands in DS (data/editor/design.json),
// which tools/build.js, tools/sections/build_world.py and tools/editor/apply.py read. Uses editor.js, studio.js and design.js globals.
'use strict';
const tk = (x, y) => x + ',' + y;
const gnd = id => DS.ground[id] = DS.ground[id] || {};
const hasT = (list, x, y) => (list || []).some(t => t[0] === x && t[1] === y);
const dropT = (list, x, y) => (list || []).filter(t => t[0] !== x || t[1] !== y);

// ---------- ground: water, lava, ledges, walk-behind ----------
function fluidTiles(id, k) {   // water or lava on this map: the game's own (data/sections/fluids) plus the editor's, minus what the editor cleared
  const s = sec(id), R = rowsOf(id), [W, H] = s.tiles, g = DS.ground[id] || {}, out = new Set(), no = new Set((g.no || []).map(t => tk(...t)));
  for (const [x0, y0, x1, y1] of ((s.fluid || {})[k]) || []) for (let y = Math.max(1, y0); y <= Math.min(H - 2, y1); y++) for (let x = Math.max(1, x0); x <= Math.min(W - 2, x1); x++) if ((R[y] || '')[x] === '#' && !no.has(tk(x, y))) out.add(tk(x, y));
  for (const [x, y] of g[k] || []) if ((R[y] || '')[x] === '#') out.add(tk(x, y));
  return out;
}
const behindTiles = id => new Set((sec(id).behind || []).concat((DS.ground[id] || {}).behind || []).map(t => tk(...t)));
const GB = { '~': 'water', '^': 'lava', 'v': 'ledge (hop down only)', 'b': 'walk behind (drawn over the player)', 'x': 'cleared' };
function groundRect() {
  const r = S.gRect; S.gRect = null; const s = sec(r.sid), [W, H] = s.tiles, R = rowsOf(r.sid).map(x => x.split('')), g = gnd(r.sid), b = S.brush, keys = blockedKeys(r.sid); let n = 0;
  snap();
  for (let y = Math.min(r.y0, r.y1); y <= Math.max(r.y0, r.y1); y++) for (let x = Math.min(r.x0, r.x1); x <= Math.max(r.x0, r.x1); x++) {
    if (!R[y] || R[y][x] === undefined) continue;
    if (b === '~' || b === '^') { if (x < 1 || y < 1 || x > W - 2 || y > H - 2 || keys.has(tk(x, y))) continue; const k = b === '~' ? 'water' : 'lava', o = b === '~' ? 'lava' : 'water';
      R[y][x] = '#'; g[o] = dropT(g[o], x, y); g.no = dropT(g.no, x, y); if (!hasT(g[k], x, y)) (g[k] = g[k] || []).push([x, y]); n++; }
    else if (b === 'v') { if (keys.has(tk(x, y))) continue; R[y][x] = 'v'; g.water = dropT(g.water, x, y); g.lava = dropT(g.lava, x, y); n++; }
    else if (b === 'b') { if (!hasT(g.behind, x, y)) { (g.behind = g.behind || []).push([x, y]); n++; } }
    else if (b === 'x') { const was = fluidTiles(r.sid, 'water').has(tk(x, y)) || fluidTiles(r.sid, 'lava').has(tk(x, y));
      g.water = dropT(g.water, x, y); g.lava = dropT(g.lava, x, y); g.behind = dropT(g.behind, x, y); if (was && !hasT(g.no, x, y)) (g.no = g.no || []).push([x, y]); if (R[y][x] === 'v') R[y][x] = '#'; n++; } }
  for (const k of ['water', 'lava', 'behind', 'no']) if (g[k] && !g[k].length) delete g[k];
  ROWS[r.sid] = R.map(x => x.join('')); touch(r.sid);
  toast(`${n} tile(s): ${GB[b]}`); panel(); draw();
}
function wallsExtra() {
  return `<div class="hint" style="margin-top:8px"><b>Ground:</b> water and lava are walls until the player has the Bubbub Ride / Heat Shield. A ledge is a one-way hop: walk down into it and you jump over; from below it's a wall. Walk-behind tiles are drawn over the player (tree tops, roofs, arches): paint the part that should cover them.</div>
    <div class="row">${[['~', 'Water'], ['^', 'Lava'], ['v', 'Ledge'], ['b', 'Walk behind'], ['x', 'Clear ground']].map(([c, n]) => `<button class="tool ${S.brush === c ? 'on' : ''}" data-b="${c}">${n}</button>`).join('')}</div>
    <div class="hint"><span style="color:#5ab0ff">blue</span> water, <span style="color:#ff8a3a">orange</span> lava, <span style="color:#fff">&#8595;</span> ledge, <span style="color:#d79bff">purple stripes</span> walk behind.</div>`;
}

// ---------- people and trainers ----------
function personOf(r) {   // the person as the game will see them: their source data plus any editor changes
  if (r.kind === 'added') return ADDED[r.sid][r.i];
  const n = (sec(r.sid).npcs || []).find(n => n.src === r.src) || {}, ov = ((DS.people[r.sid] || {})[r.src]) || {}, out = Object.assign({}, n);
  for (const [k, v] of Object.entries(ov)) if (v === null) delete out[k]; else out[k] = v;
  return out;
}
function personSet(r, k, v) {
  snap();
  if (r.kind === 'added') { const a = ADDED[r.sid][r.i]; if (v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)) delete a[k]; else a[k] = v; }
  else { const P = DS.people[r.sid] = DS.people[r.sid] || {}, o = P[r.src] = P[r.src] || {}; o[k] = v === undefined ? null : v; }
  touch(r.sid); draw();
}
const DIRS_ = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
function sightOf(sid, p) {   // the tiles a trainer can see: straight ahead, stopped by anything you can't walk on
  const R = rowsOf(sid), [dx, dy] = DIRS_[p.face || 'down'], out = [];
  for (let k = 1; k <= ((p.trainer && p.trainer.sight) || 5); k++) { const x = p.x + dx * k, y = p.y + dy * k, c = (R[y] || '')[x]; if (c !== '.' && c !== ',') break; out.push(tk(x, y)); }
  return out;
}
function peopleWithData(sid) { return npcsOf(sid).map(n => ({ ...n, ...personOf(n.ref), x: n.x, y: n.y, ref: n.ref })); }
const speciesList = () => ED.species.filter(d => !['starter', 'legendary', 'mythic'].includes(d.r));
const esc = v => String(v || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
function personPanel() {
  const r = S.sel; if (!r || (r.kind !== 'npc' && r.kind !== 'added')) return '';
  if (r.kind === 'npc' && !r.src) return `<div class="sel"><div class="hint">This person is placed by the world builder (an automatic route trainer), so they can't be edited here. Add your own person instead.</div></div>`;
  const p = personOf(r), tr = p.trainer || null, team = (tr && tr.team) || [];
  return `<div class="sel"><b>Person details</b>
    ${r.kind === 'npc' ? `<label>Lines (one per line; start with "Name: " to show a name) <textarea id="plines" rows="3">${esc((p.t || []).join('\n'))}</textarea></label>` : ''}
    <div class="row"><label>Faces <select id="pface">${['down', 'up', 'left', 'right'].map(f => `<option ${(p.face || 'down') === f ? 'selected' : ''}>${f}</option>`).join('')}</select></label>
    <label>Moves <select id="pwander">${[[0, 'stands still'], [1, 'strolls (3x3)'], [2, 'strolls (5x5)']].map(([v, n]) => `<option value="${v}" ${(p.wander || 0) == v ? 'selected' : ''}>${n}</option>`).join('')}</select></label></div>
    <label class="row"><input type="checkbox" id="ptrain" ${tr ? 'checked' : ''}> trainer (battles you when you walk into their sight)</label>
    ${tr ? `<div class="row"><label>Class <input id="tcls" value="${esc(tr.cls)}" placeholder="Scrapper" style="width:110px"></label><label>Name <input id="tname" value="${esc(tr.name)}" placeholder="Rolo" style="width:100px"></label><label>Sight <input id="tsight" type="number" min="1" max="8" value="${tr.sight || 5}" style="width:56px"></label></div>
      <label>Before the battle <input id="tintro" value="${esc(tr.intro)}" placeholder="(a random challenge line)"></label>
      <label>When they lose <input id="tlose" value="${esc(tr.lose)}" placeholder="Wow, you two are in sync!"></label>
      <label>Talking to them after <input id="tafter" value="${esc(tr.after)}" placeholder="Good battle! Keep training out here."></label>
      <div class="hint"><b>Team</b> ${team.length ? '' : "(empty = picked from this world's wild Alienmon at the right level)"}</div>
      ${team.map(([sp, lv], i) => `<div class="row"><span style="flex:1">${sp}</span><input type="number" min="1" max="100" value="${lv}" data-tlv="${i}" style="width:64px"><button data-trm="${i}">&#10005;</button></div>`).join('')}
      ${team.length < 6 ? `<div class="row"><input id="tsp" list="splist" placeholder="Add an Alienmon" style="flex:1"><input id="tlv" type="number" min="1" max="100" value="${team.length ? team[team.length - 1][1] : 8}" style="width:64px"><button id="tadd">Add</button></div>
      <datalist id="splist">${speciesList().map(d => `<option value="${d.name}">${d.t.join('/')}</option>`).join('')}</datalist>` : ''}` : ''}</div>`;
}
function personWire() {
  const r = S.sel, on = (sel, ev, f) => { const el = $(sel); if (el) el.addEventListener(ev, f); }; if (!r || (r.kind !== 'npc' && r.kind !== 'added')) return;
  const tr = () => JSON.parse(JSON.stringify(personOf(r).trainer || {})), setTr = (k, v) => { const t = tr(); if (v === '' || v == null) delete t[k]; else t[k] = v; personSet(r, 'trainer', t); };
  on('#plines', 'change', e => personSet(r, 't', e.target.value.split('\n').map(x => x.trim()).filter(Boolean)));
  on('#pface', 'change', e => personSet(r, 'face', e.target.value));
  on('#pwander', 'change', e => personSet(r, 'wander', +e.target.value || null));
  on('#ptrain', 'change', e => { personSet(r, 'trainer', e.target.checked ? { cls: 'Linker', name: '' } : null); panel(); });
  for (const [id, k] of [['#tcls', 'cls'], ['#tname', 'name'], ['#tintro', 'intro'], ['#tlose', 'lose'], ['#tafter', 'after']]) on(id, 'change', e => setTr(k, e.target.value.trim()));
  on('#tsight', 'change', e => setTr('sight', Math.max(1, Math.min(8, +e.target.value || 5))));
  document.querySelectorAll('[data-tlv]').forEach(el => el.onchange = () => { const t = tr(); t.team = t.team.map((x, i) => i === +el.dataset.tlv ? [x[0], Math.max(1, Math.min(100, +el.value || 5))] : x); personSet(r, 'trainer', t); });
  document.querySelectorAll('[data-trm]').forEach(el => el.onclick = () => { const t = tr(); t.team = t.team.filter((x, i) => i !== +el.dataset.trm); if (!t.team.length) delete t.team; personSet(r, 'trainer', t); panel(); });
  on('#tadd', 'click', () => { const n = ($('#tsp').value || '').trim(), d = ED.species.find(d => d.name.toLowerCase() === n.toLowerCase()); if (!d) return toast('Pick an Alienmon from the list.');
    const t = tr(); t.team = (t.team || []).concat([[d.name, Math.max(1, Math.min(100, +$('#tlv').value || 8))]]); personSet(r, 'trainer', t); panel(); });
}

// ---------- items, signs and blocked paths ----------
const OK_ = { stash: 'Linker Stash', chest: 'Chest', hidden: 'Hidden item', sign: 'Sign', stop: 'Blocked-path message' };
const objsOf = id => DS.objs[id] = DS.objs[id] || [];
function itemsPanel() {
  const k = S.okind || 'stash', o = S.osel && (DS.objs[S.osel.sid] || [])[S.osel.i];
  const itemSel = (id, v) => `<select id="${id}">${ED.items.map(i => `<option value="${i.k}" ${v === i.k ? 'selected' : ''}>${i.n}</option>`).join('')}</select>`;
  return `<h3>Items, signs and blocked paths</h3><p class="hint">Pick a kind, then click the map. Click one you placed to change or remove it. Rewards at dead ends and behind detours make exploring worth it (Map Logic Pack).</p>
    <div class="row">${Object.entries(OK_).map(([v, n]) => `<button class="tool ${k === v ? 'on' : ''}" data-ok="${v}">${n}</button>`).join('')}</div>
    ${['stash', 'chest', 'hidden'].includes(k) ? `<div class="row" style="margin-top:6px"><label>Item ${itemSel('oitem', S.oitem || 'gel')}</label><label>How many <input id="on" type="number" min="1" max="99" value="${S.on || 1}" style="width:60px"></label></div>` : `<label>Text <textarea id="ot" rows="2" placeholder="${k === 'sign' ? 'RIMWALK TRAIL - Dustara Plaza ahead' : 'Rockfall! The path is blocked for now.'}">${esc(S.ot)}</textarea></label>`}
    <div class="hint">${{ stash: 'A Linker Stash capsule (solid).', chest: 'A chest the player opens with A. The tile becomes solid.', hidden: 'Invisible: the player finds it by pressing A facing the tile (the end of a fence, a lone rock).', sign: 'Read with A. The tile becomes solid: put it on a sign prop or a wall.', stop: 'Shown when the player bumps the tile. The tile becomes solid.' }[k]}</div>
    ${o ? `<div class="sel"><b>${OK_[o.k]}</b> at ${o.tile.join(',')}
      ${o.item ? `<div class="row"><label>Item ${itemSel('esitem', o.item)}</label><label>How many <input id="esn" type="number" min="1" max="99" value="${o.n || 1}" style="width:60px"></label></div>` : `<label>Text <textarea id="est" rows="2">${esc([].concat(o.t || []).join('\n'))}</textarea></label>`}
      <button id="esdel">Remove</button></div>` : ''}`;
}
function itemsWire() {
  const on = (sel, ev, f) => { const el = $(sel); if (el) el.addEventListener(ev, f); }, o = () => S.osel && DS.objs[S.osel.sid][S.osel.i];
  document.querySelectorAll('[data-ok]').forEach(b => b.onclick = () => { S.okind = b.dataset.ok; S.osel = null; panel(); });
  on('#oitem', 'change', e => S.oitem = e.target.value); on('#on', 'change', e => S.on = Math.max(1, +e.target.value || 1)); on('#ot', 'input', e => S.ot = e.target.value);
  on('#esitem', 'change', e => { snap(); o().item = e.target.value; touch(S.osel.sid); }); on('#esn', 'change', e => { snap(); o().n = Math.max(1, +e.target.value || 1); touch(S.osel.sid); });
  on('#est', 'change', e => { snap(); const lines = e.target.value.split('\n').map(x => x.trim()).filter(Boolean); o().t = o().k === 'stop' ? lines.join(' ') : lines; touch(S.osel.sid); });
  on('#esdel', 'click', () => { snap(); DS.objs[S.osel.sid].splice(S.osel.i, 1); touch(S.osel.sid); S.osel = null; panel(); draw(); });
}
function itemPlace(t) {
  const L = objsOf(t.sid), i = L.findIndex(o => o.tile[0] === t.x && o.tile[1] === t.y);
  if (i >= 0) { S.osel = { sid: t.sid, i }; panel(); draw(); return; }
  const k = S.okind || 'stash', s = sec(t.sid);
  if (s.objects.some(o => o.tile[0] === t.x && o.tile[1] === t.y)) return toast('Something is already there.');
  if (blockedKeys(t.sid).has(tk(t.x, t.y))) return toast('Keep doors, exits and counters clear.');
  const o = { k, tile: [t.x, t.y] };
  if (['stash', 'chest', 'hidden'].includes(k)) { o.item = S.oitem || 'gel'; o.n = S.on || 1; if (k === 'stash') o.tier = 1; }
  else { const txt = (S.ot || '').trim(); if (!txt) return toast('Type the text first.'); o.t = k === 'stop' ? txt.replace(/\n/g, ' ') : txt.split('\n').filter(Boolean); }
  snap(); L.push(o);
  if (k === 'chest' || k === 'sign' || k === 'stop') { const R = rowsOf(t.sid).map(r => r.split('')); if (R[t.y][t.x] !== '#') { R[t.y][t.x] = '#'; ROWS[t.sid] = R.map(r => r.join('')); } }
  S.osel = { sid: t.sid, i: L.length - 1 }; touch(t.sid); panel(); draw();
}

// ---------- wild encounters ----------
const FIRE_ = new Set(['volcanic', 'volcano', 'sun_forge', 'ash_trail']);
function habFit(types, hab) {   // same rule as tools/check_habitats.js: 2 native, 1 tolerated, 0 can't live there
  const h = ED.hab.habitats[hab]; if (!h) return 0; let tol = h.tolerated;
  if (FIRE_.has(hab) && types.includes('Bio')) { if (!types.some(t => t === 'Magma' || t === 'Plasma')) return 0; tol = tol.concat(['Bio']); }
  for (const t of types) { if ((ED.hab.hard_bans[t] || []).includes(hab)) return 0; if (!h.native.includes(t) && !tol.includes(t)) return 0; }
  return types.some(t => h.native.includes(t)) ? 2 : 1;
}
function encOf(id) {
  if (DS.enc && DS.enc[id]) return DS.enc[id];
  const e = ED.enc[id]; if (e) return JSON.parse(JSON.stringify(e));
  const near = Object.entries(ED.enc).find(([k]) => sec(k) && sec(k).dir === sec(id).dir);
  return { planet: sec(id).planet, name: sec(id).name, habitat: near ? near[1].habitat : Object.keys(ED.hab.habitats)[0], encounters: [] };
}
function encSet(id, f) { snap(); DS.enc = DS.enc || {}; const e = JSON.parse(JSON.stringify(encOf(id))); f(e); for (const x of e.encounters) x.rarity = x.weight >= 10 ? 'common' : x.weight >= 5 ? 'uncommon' : 'rare'; DS.enc[id] = e; touch(id); panel(); }
function wildPanel() {
  if (S.view === 'outdoor') return `<h3>Wild Alienmon</h3><p class="hint">Open one map from the map list to set which Alienmon live in its tall grass and water.</p>`;
  const id = S.view, e = encOf(id), R = rowsOf(id).join(''), grass = (R.match(/,/g) || []).length, water = fluidTiles(id, 'water').size, H_ = ED.hab.habitats[e.habitat] || {};
  const tot = m => e.encounters.filter(x => (m === 'surf') === (x.method === 'surf')).reduce((a, x) => a + x.weight, 0);
  const st = settingsOf(id), bad = e.encounters.filter(x => !(habFit(x.types, e.habitat) || (x.method === 'surf' && x.types.includes('Hydro'))));
  return `<h3>Wild Alienmon: ${sec(id).name}</h3>
    <p class="hint">This map has <b>${grass}</b> tall-grass tiles and <b>${water}</b> water tiles${sec(id).type === 'cave' && !grass ? ' (a cave with no grass: the whole floor is wild ground)' : ''}. Encounter rate: ${st.rate == null ? 'normal' : st.rate + 'x'} (change it in Map settings). Paint tall grass with Walls, water with the Ground brushes.</p>
    <label>Habitat <select id="whab">${Object.keys(ED.hab.habitats).sort().map(h => `<option ${h === e.habitat ? 'selected' : ''}>${h}</option>`).join('')}</select></label>
    <div class="hint">${esc(H_.description)} Native: ${(H_.native || []).join(', ') || '-'}. Tolerated: ${(H_.tolerated || []).join(', ') || '-'}.</div>
    ${bad.length ? `<div class="bad">${bad.map(x => x.name).join(', ')} can't live in ${e.habitat}: the build refuses this map until they're removed or the habitat changes.</div>` : ''}
    ${e.encounters.map((x, i) => { const f = x.method === 'surf' && x.types.includes('Hydro') ? 2 : habFit(x.types, e.habitat), share = Math.round(100 * x.weight / (tot(x.method) || 1));
      return `<div class="sel" style="padding:6px"><div class="row"><b style="flex:1">${x.name}</b><span class="hint">${x.types.join('/')}</span><span class="${f ? 'good' : 'bad'}">${f === 2 ? 'native' : f ? 'tolerated' : "can't live here"}</span><button data-wrm="${i}">&#10005;</button></div>
        <div class="row"><label>Weight <input type="number" min="1" max="50" value="${x.weight}" data-ww="${i}" style="width:58px"></label><span class="hint">${share}% of ${x.method === 'surf' ? 'water' : 'grass'} battles</span>
        <label>Lv <input type="number" min="1" max="100" value="${x.levels[0]}" data-wl0="${i}" style="width:54px"></label>-<input type="number" min="1" max="100" value="${x.levels[1]}" data-wl1="${i}" style="width:54px"></div>
        <div class="row"><select data-wm="${i}">${[['walk', 'tall grass'], ['surf', 'water'], ['cave', 'cave floor']].map(([v, n]) => `<option value="${v}" ${x.method === v ? 'selected' : ''}>${n}</option>`).join('')}</select>
        <select data-wt="${i}">${[['any', 'any time'], ['night x2', 'more at night'], ['day x2', 'more by day']].map(([v, n]) => `<option value="${v}" ${x.time === v ? 'selected' : ''}>${n}</option>`).join('')}</select></div></div>`; }).join('') || "<div class=\"hint\">No wild Alienmon set: the world's own pool is used.</div>"}
    <div class="row" style="margin-top:6px"><input id="wsp" list="wsplist" placeholder="Add an Alienmon" style="flex:1"><button id="wadd">Add</button></div>
    <datalist id="wsplist">${speciesList().map(d => `<option value="${d.name}">${d.t.join('/')} · ${['can\'t live here', 'tolerated', 'native'][habFit(d.t, e.habitat)]}</option>`).join('')}</datalist>
    <p class="hint">Weight: 10 = common, 5 = uncommon, 2 = rare. Starters and legendaries can't be wild.</p>`;
}
function wildWire() {
  const id = S.view, on = (sel, ev, f) => { const el = $(sel); if (el) el.addEventListener(ev, f); }; if (id === 'outdoor') return;
  on('#whab', 'change', e => encSet(id, x => x.habitat = e.target.value));
  const each = (attr, f, ev) => document.querySelectorAll(`[${attr}]`).forEach(el => el.addEventListener(ev || 'change', () => encSet(id, e => f(e.encounters[+el.getAttribute(attr)], el, e))));
  each('data-wrm', (x, el, e) => e.encounters.splice(e.encounters.indexOf(x), 1), 'click');
  each('data-ww', (x, el) => x.weight = Math.max(1, Math.min(50, +el.value || 1)));
  each('data-wl0', (x, el) => { x.levels[0] = Math.max(1, +el.value || 1); if (x.levels[1] < x.levels[0]) x.levels[1] = x.levels[0]; });
  each('data-wl1', (x, el) => { x.levels[1] = Math.max(x.levels[0], +el.value || 1); });
  each('data-wm', (x, el) => x.method = el.value); each('data-wt', (x, el) => x.time = el.value);
  on('#wadd', 'click', () => { const n = ($('#wsp').value || '').trim(), d = speciesList().find(d => d.name.toLowerCase() === n.toLowerCase()); if (!d) return toast('Pick an Alienmon from the list.');
    encSet(id, e => { if (e.encounters.some(x => x.name === d.name)) return; const lv = e.encounters.length ? e.encounters[0].levels.slice() : [5, 8]; e.encounters.push({ n: d.n, name: d.name, types: d.t, rarity: 'common', weight: 10, levels: lv, method: d.t.includes('Hydro') && !habFit(d.t, e.habitat) ? 'surf' : sec(id).type === 'cave' ? 'cave' : 'walk', time: 'any' }); });
    if (!habFit(d.t, encOf(id).habitat) && !d.t.includes('Hydro')) toast(`${d.name} can't live in ${encOf(id).habitat}: change the habitat or remove it.`, 6000); });
}

// ---------- map settings ----------
const settingsOf = id => (DS.settings[id] || {});
function settingsPanel() {
  if (S.view === 'outdoor') return `<h3>Map settings</h3><p class="hint">Open one map from the map list.</p>`;
  const id = S.view, s = sec(id), st = settingsOf(id);
  return `<h3>Map settings: ${s.name}</h3>
    <label>Name shown when you enter <input id="mbanner" value="${esc(st.banner)}" placeholder="${esc(s.name)}"></label>
    <label>Music <select id="mmusic"><option value="">this world's theme${s.type === 'cave' ? ' (caves use the cave track)' : ''}</option>${ED.songs.map(k => `<option ${st.music === k ? 'selected' : ''}>${k}</option>`).join('')}</select></label>
    <label>Wild encounter rate <select id="mrate">${[['0', 'none'], ['0.5', 'half'], ['', 'normal'], ['1.5', '1.5x'], ['2', 'double']].map(([v, n]) => `<option value="${v}" ${String(st.rate == null ? '' : st.rate) === v ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
    <label class="row"><input type="checkbox" id="mnight" ${st.noNight ? 'checked' : ''}> no night shading here (always lit)</label>
    <label class="row"><input type="checkbox" id="mweather" ${st.noWeather ? 'checked' : ''}> no Skyfall weather here</label>
    <p class="hint">Kind: ${s.type}, ${s.tiles[0]}x${s.tiles[1]} tiles. The game shows 10x9 tiles at a time.</p>`;
}
function settingsWire() {
  const id = S.view, on = (sel, ev, f) => { const el = $(sel); if (el) el.addEventListener(ev, f); }; if (id === 'outdoor') return;
  const set = (k, v) => { snap(); const st = DS.settings[id] = Object.assign({}, DS.settings[id]); if (v === '' || v == null || v === false) delete st[k]; else st[k] = v; if (!Object.keys(st).length) delete DS.settings[id]; touch(id); };
  on('#mbanner', 'change', e => set('banner', e.target.value.trim())); on('#mmusic', 'change', e => set('music', e.target.value));
  on('#mrate', 'change', e => set('rate', e.target.value === '' ? null : +e.target.value)); on('#mnight', 'change', e => set('noNight', e.target.checked ? 1 : null)); on('#mweather', 'change', e => set('noWeather', e.target.checked ? 1 : null));
}

// ---------- terrain painted over finished maps ----------
const PAINTIMG = {};
function paintTarget(id) {   // a painted (rendered) map gets a see-through layer of terrain on top; its own picture is never changed
  if (!sec(id) || builtMap(id) || id === 'outdoor') return null;
  const p = DS.paint[id] = DS.paint[id] || { id, terrain: [] }; if (!p.base) p.base = rowsOf(id).slice(); return p;
}
function paintBake(id) {
  const p = DS.paint[id], s = sec(id); if (!p) return; const [W, H] = s.tiles, c = document.createElement('canvas'); c.width = W * 16; c.height = H * 16;
  terrainBake(p, c.getContext('2d'), W, H); PAINTIMG[id] = c.toDataURL('image/png'); touch(id); draw();
}
function paintRows(id) {   // tiles under 3+ corners of a terrain take its ground; tiles the terrain left go back to what they were
  const p = DS.paint[id], s = sec(id); if (!p) return; const [W, H] = s.tiles, cur = rowsOf(id).map(r => r.split('')), R = p.base.map(r => r.split(''));
  terrainRows(p, R, W, H);
  const any = new Set(p.touched || []);
  for (const ly of p.terrain) { const v = ly.v, at = (a, b) => v.charCodeAt(b * (W + 1) + a) === 49; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (at(x, y) || at(x + 1, y) || at(x, y + 1) || at(x + 1, y + 1)) any.add(tk(x, y)); }
  p.touched = [...any];
  for (const k of any) { const [x, y] = k.split(',').map(Number); if (cur[y]) cur[y][x] = R[y][x]; }
  ROWS[id] = cur.map(r => r.join('')); touch(id); draw();
}
function paintDraw(s, ox, oy) { const u = PAINTIMG[s.id] || s.paintUrl; if (!u) return; const im = img(u); if (ok(im)) ctx.drawImage(im, ox, oy, s.tiles[0] * 16, s.tiles[1] * 16); }

// ---------- playtest ----------
const KEYS = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right' };
const HELD = {};
function playPanel() {
  const P = S.play;
  return `<h3>Playtest</h3><p class="hint">Walk the map with the game's rules: walls, tall grass, water, ledges, doors, exits, people and trainers' sightlines. <b>Click a tile</b> to start there.
    Keys: arrows or WASD to walk, Space or Enter = A (talk, read, open), Shift or X = B (jump), Esc stops.</p>
    <div class="row"><button id="plstart">${P ? 'Restart at spawn' : "Start at this map's spawn"}</button>${P ? '<button id="plstop">Stop</button>' : ''}</div>
    <label class="row"><input type="checkbox" id="plride" ${S.pride ? 'checked' : ''}> I have the Bubbub Ride (swim on water)</label>
    <label class="row"><input type="checkbox" id="plshield" ${S.pshield ? 'checked' : ''}> I have the Heat Shield (cross lava)</label>
    <label class="row"><input type="checkbox" id="plframe" ${S.pframe !== false ? 'checked' : ''}> show the game screen (10x9 tiles)</label>
    <label class="row"><input type="checkbox" id="plwild" ${S.pwild !== false ? 'checked' : ''}> wild battles in tall grass and water</label>
    ${P ? `<div class="padrow" style="margin-top:8px"><div class="pad"><span></span><button data-pk="up">&#9650;</button><span></span><button data-pk="left">&#9664;</button><span class="c">${esc(sec(P.sid).name.slice(0, 18))}<br>${P.x},${P.y}</span><button data-pk="right">&#9654;</button><span></span><button data-pk="down">&#9660;</button><span></span></div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:20px"><button id="pla" style="min-width:60px;min-height:44px">A</button><button id="plb" style="min-width:60px;min-height:44px">B</button></div></div>
      <div class="hint">${P.log.slice(-6).reverse().map(l => `<div>${esc(l)}</div>`).join('')}</div>` : ''}`;
}
function playWire() {
  const on = (sel, ev, f) => { const el = $(sel); if (el) el.addEventListener(ev, f); };
  on('#plstart', 'click', () => { const id = S.play ? S.play.sid : S.view; if (id === 'outdoor') return toast('Open a map first, or click a tile to start there.'); const s = sec(id), sp = (s.spawns || {}).default || (s.spawns || {}).arrival || firstWalk(id); if (!sp) return toast('No walkable tile on this map.'); playStart(id, sp[0], sp[1]); });
  on('#plstop', 'click', playStop);
  on('#plride', 'change', e => S.pride = e.target.checked); on('#plshield', 'change', e => S.pshield = e.target.checked);
  on('#plframe', 'change', e => { S.pframe = e.target.checked; draw(); }); on('#plwild', 'change', e => S.pwild = e.target.checked);
  document.querySelectorAll('[data-pk]').forEach(b => { const d = b.dataset.pk; b.onpointerdown = () => { HELD[d] = 1; }; b.onpointerup = b.onpointerleave = () => { delete HELD[d]; }; });
  on('#pla', 'click', playA); on('#plb', 'click', playB);
}
function firstWalk(id) { const R = rowsOf(id); for (let y = 0; y < R.length; y++) for (let x = 0; x < R[y].length; x++) if (R[y][x] === '.') return [x, y]; return null; }
function playStart(id, x, y) {
  if (S.view !== id) { S.view = id; views(); }
  S.play = { sid: id, x, y, face: 'down', mv: null, msg: null, back: [], beat: new Set(), log: ['Started on ' + sec(id).name + '.'] };
  if (phone()) { document.documentElement.style.setProperty('--ph', Math.round(innerHeight * 0.22) + 'px'); resize(); }   // phones: small panel, big map, pad over it
  S.zoom = phone() ? Math.max(1, Math.min(cv.clientWidth / 168, cv.clientHeight / 150)) : Math.max(S.zoom, Math.min(4, cv.clientHeight / (144 * 1.6)));   // phones: the game screen fills the map area
  centerPlay(); panel(); playLoop();
}
function playStop() { S.play = null; for (const k in HELD) delete HELD[k]; panel(); draw(); }
function centerPlay() { const P = S.play; if (!P) return; const k = P.mv ? P.mv.t / P.mv.n : 0, px = (P.x + (P.mv ? P.mv.dx * k : 0)) * 16 + 8, py = (P.y + (P.mv ? P.mv.dy * k : 0)) * 16 + 8; S.ox = cv.clientWidth / 2 - px * S.zoom; S.oy = cv.clientHeight / 2 - py * S.zoom; }
function playSay(t) { const P = S.play; P.msg = [].concat(t).join(' '); P.log.push(P.msg); panel(); draw(); }
function solidAt(id, x, y) {   // what blocks a step besides the ground itself
  for (const q of LAYOUT[id] || []) { if (q.solid === false) continue; const b = propBox(q); if (b && x >= q.x && x < q.x + b.w && y >= q.y && y < q.y + b.h) return 'prop'; }
  if (npcsOf(id).some(n => n.x === x && n.y === y)) return 'person'; if (monsOf(id).some(m => m.x === x && m.y === y)) return 'mon';
  if (sec(id).objects.some(o => (o.k === 'stash' || o.k === 'keeper') && o.tile[0] === x && o.tile[1] === y) || (DS.objs[id] || []).some(o => o.k === 'stash' && o.tile[0] === x && o.tile[1] === y)) return 'object';
  return null;
}
function groundAt(id, x, y) { const c = (rowsOf(id)[y] || '')[x]; if (c === undefined) return null; if (c === '#') { if (behindTiles(id).has(tk(x, y))) return ':'; if (fluidTiles(id, 'water').has(tk(x, y))) return '~'; if (fluidTiles(id, 'lava').has(tk(x, y))) return '^'; } return c; }
function canWalk(id, x, y) { const c = groundAt(id, x, y); return (c === '.' || c === ',' || c === ':' || (c === '~' && !!S.pride) || (c === '^' && !!S.pshield)) && !solidAt(id, x, y); }
function playEnter(id, x, y, face, why) { const P = S.play; P.sid = id; P.x = x; P.y = y; if (face) P.face = face; if (S.view !== id) { S.view = id; views(); } P.log.push(why || 'Entered ' + sec(id).name + '.'); P.msg = null; panel(); }
function playStep(d) {
  const P = S.play, s = sec(P.sid), [W, H] = s.tiles, [dx, dy] = DIRS_[d], nx = P.x + dx, ny = P.y + dy; P.face = d;
  if (nx < 0 || ny < 0 || nx >= W || ny >= H) {   // off the edge: across a route into the next map
    const side = dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'bottom' : 'top', e = (s.edges || {})[side], along = dx ? P.y : P.x;
    if (!e || along < e.range[0] - 3 || along > e.range[1] + 3) return playSay('The way is blocked here.');
    const t = sec(e.to); if (!t) return playSay(e.to === 'arrival' ? 'This path leads back to the landing pad.' : 'This exit leads nowhere yet!');
    const k = along + (e.offset || 0), p = side === 'right' ? [0, k] : side === 'left' ? [t.tiles[0] - 1, k] : side === 'bottom' ? [k, 0] : [k, t.tiles[1] - 1];
    if (!canWalk(t.id, p[0], p[1])) return playSay(`Crossing into ${t.name}, but the tile you'd land on (${p.join(',')}) is a wall.`);
    return playEnter(t.id, p[0], p[1], d);
  }
  const door = allDoors(P.sid).find(o => o.x === nx && o.y === ny);
  if (door && !canWalk(P.sid, nx, ny)) { if (!door.to) return playSay('A door that opens nothing.'); if (door.to.startsWith('menu:')) return playSay(door.to === 'menu:bay' ? 'The healing counter: "Welcome! Shall I heal your team?"' : 'The shop counter: "What can I get you?"');
    const t = sec(door.to); if (!t) return playSay('The door is locked. (Its room is missing.)'); P.back.push({ sid: P.sid, x: P.x, y: P.y }); const sp = (t.spawns || {}).default || [Math.floor(t.tiles[0] / 2) - 1, t.tiles[1] - 2]; return playEnter(t.id, sp[0], sp[1], 'up', 'Went in: ' + t.name + '.'); }
  if (d === 'down' && groundAt(P.sid, nx, ny) === 'v') { if (canWalk(P.sid, nx, ny + 1)) { P.mv = { dx: 0, dy: 2, t: 0, n: 14, hop: 1 }; return; } return playSay('A ledge, but nothing to land on below it.'); }
  if (!canWalk(P.sid, nx, ny)) { const c = groundAt(P.sid, nx, ny), so = (DS.objs[P.sid] || []).concat(s.objects).find(o => o.k === 'stop' && o.tile[0] === nx && o.tile[1] === ny);
    if (so) return playSay(so.t); if (c === '~') return playSay('Deep water. You need the Bubbub Ride to swim.'); if (c === '^') return playSay('Lava! You need the Heat Shield.'); return; }
  P.mv = { dx, dy, t: 0, n: 8 };
}
const beatKey = n => n.ref.src || ('a' + n.ref.i);
function playArrive() {
  const P = S.play, s = sec(P.sid), w = (s.warps || []).find(w => w.tile[0] === P.x && w.tile[1] === P.y);
  if (w) { if (w.to === 'back') { const b = P.back.pop(); if (b) return playEnter(b.sid, b.x, b.y, 'down', 'Back outside.');
      const pw = Object.values(ED.sections).find(o => o.dir === s.dir && allDoors(o.id).some(d => d.to === s.id)); if (pw) { const dd = allDoors(pw.id).find(d => d.to === s.id); return playEnter(pw.id, dd.x, dd.y + 1, 'down', 'Back outside.'); }
      return playSay('The doormat leads back outside (no door opens this room yet).'); }
    if (w.to && w.to.includes(':')) return playSay(`A shuttle or gate to ${w.to.split(':')[1]}. (The playtest stays on this world.)`);
    const t = sec(w.to); if (t) { const at = w.at || (t.spawns || {}).default || firstWalk(t.id); return playEnter(t.id, at[0], at[1], w.face || 'down', 'Through to ' + t.name + '.'); } }
  for (const n of peopleWithData(P.sid)) { if (!n.trainer || P.beat.has(beatKey(n))) continue;
    if (sightOf(P.sid, n).includes(tk(P.x, P.y))) { P.beat.add(beatKey(n)); const tr = n.trainer, nm = ((tr.cls || 'Trainer') + ' ' + (tr.name || '')).trim();
      return playSay(`${nm} spotted you! "${tr.intro || "Let's battle!"}" Battle: ${(tr.team || []).map(([a, b]) => a + ' Lv' + b).join(', ') || "a team from this world's wild Alienmon"}.`); } }
  const c = groundAt(P.sid, P.x, P.y), rate = settingsOf(P.sid).rate == null ? 1 : settingsOf(P.sid).rate;
  if (S.pwild !== false && ((c === ',' && Math.random() < 0.1 * rate) || (c === '~' && Math.random() < 0.05 * rate) || (c === '.' && s.type === 'cave' && !rowsOf(P.sid).some(r => r.includes(',')) && Math.random() < 0.06 * rate))) {
    const e = encOf(P.sid), pool = e.encounters.filter(x => c === '~' ? x.method === 'surf' : x.method !== 'surf'), tot = pool.reduce((a, x) => a + x.weight, 0);
    if (!tot) return playSay("A wild Alienmon from this world's pool appeared! (No wild list for this map: see Encounters.)");
    let r = Math.random() * tot, x = pool[0]; for (const p of pool) { r -= p.weight; if (r <= 0) { x = p; break; } }
    playSay(`A wild ${x.name} appeared! Lv ${x.levels[0] + Math.floor(Math.random() * (x.levels[1] - x.levels[0] + 1))}`); }
}
function playA() {
  const P = S.play; if (!P) return; if (P.msg) { P.msg = null; draw(); return; } const [dx, dy] = DIRS_[P.face], x = P.x + dx, y = P.y + dy, s = sec(P.sid);
  const n = peopleWithData(P.sid).find(n => n.x === x && n.y === y);
  if (n) { if (n.trainer) { const tr = n.trainer; return playSay(P.beat.has(beatKey(n)) ? `${tr.cls || 'Trainer'}: "${tr.after || 'Good battle! Keep training out here.'}"` : `${((tr.cls || 'Trainer') + ' ' + (tr.name || '')).trim()}: "${tr.intro || "Let's battle!"}"`); }
    return playSay((n.t || []).length ? n.t : (n.name || 'They') + ' has nothing to say yet.'); }
  const m = monsOf(P.sid).find(m => m.x === x && m.y === y); if (m) return playSay(`A wild ${m.mon} is roaming here. (Battle)`);
  const o = (DS.objs[P.sid] || []).concat(s.objects).find(o => o.tile[0] === x && o.tile[1] === y);
  if (o) { const nm = it => ((ED.items.find(i => i.k === it) || {}).n || it);
    if (o.k === 'stash' || o.k === 'chest') return playSay(`${o.k === 'stash' ? 'A Linker Stash' : 'A chest'}: ${(o.n || 1) > 1 ? o.n + 'x ' : ''}${nm(o.item)}.`);
    if (o.k === 'hidden') return playSay(`You searched the spot... and found ${(o.n || 1) > 1 ? o.n + 'x ' : 'a '}${nm(o.item)}!`);
    if (o.t) return playSay(o.t); if (o.k === 'house') return playSay('A door.'); }
  const d = allDoors(P.sid).find(o => o.x === x && o.y === y); if (d && d.to && d.to.startsWith('menu:')) return playSay(d.to === 'menu:bay' ? 'The healing counter.' : 'The shop counter.');
}
function playB() {   // jump: 2 or 3 tiles straight ahead, landing on open ground (what's in between doesn't matter)
  const P = S.play; if (!P || P.mv) return; const [dx, dy] = DIRS_[P.face], ok_ = k => canWalk(P.sid, P.x + dx * k, P.y + dy * k);
  const n = [2, 3].find(k => ok_(k) && !(k === 3 && ok_(1) && ok_(2))); if (!n) return; P.mv = { dx: dx * n, dy: dy * n, t: 0, n: 14, hop: 1 };
}
let PLRAF = 0;
function playLoop() {
  cancelAnimationFrame(PLRAF); const tick = () => { const P = S.play; if (!P || S.mode !== 'play') return;
    if (P.mv) { P.mv.t++; if (P.mv.t >= P.mv.n) { P.x += P.mv.dx; P.y += P.mv.dy; P.mv = null; P.msg = null; playArrive(); } }
    else if (!P.msg) { const d = ['up', 'down', 'left', 'right'].find(k => HELD[k]); if (d) playStep(d); }
    centerPlay(); draw(); PLRAF = requestAnimationFrame(tick); };
  PLRAF = requestAnimationFrame(tick);
}
function playDraw(ctx) {
  const P = S.play; if (!P || !viewSecs().includes(sec(P.sid))) return; const [ox, oy] = origin(sec(P.sid)), k = P.mv ? P.mv.t / P.mv.n : 0;
  const px = ox + (P.x + (P.mv ? P.mv.dx * k : 0)) * 16, py = oy + (P.y + (P.mv ? P.mv.dy * k : 0)) * 16 - (P.mv && P.mv.hop ? Math.sin(Math.PI * k) * 10 : 0);
  ctx.fillStyle = 'rgba(20,10,20,0.35)'; ctx.beginPath(); ctx.ellipse(px + 8, py + 15, 6, 2, 0, 0, 6.283); ctx.fill();
  const im = img(ED.player[P.face]); if (ok(im)) ctx.drawImage(im, px - 4, py - 9, 24, 24); else { ctx.fillStyle = '#ffd23f'; ctx.fillRect(px + 3, py + 2, 10, 13); }
  if (S.pframe !== false) { const s = sec(P.sid), W = s.tiles[0] * 16, H = s.tiles[1] * 16; let cx = px - ox + 8 - 80, cy = py - oy + 8 - 76;
    cx = W < 160 ? (W - 160) / 2 : Math.max(0, Math.min(W - 160, cx)); cy = H < 144 ? (H - 144) / 2 : Math.max(0, Math.min(H - 144, cy));
    ctx.save(); ctx.strokeStyle = 'rgba(255,210,63,0.9)'; ctx.lineWidth = 2 / S.zoom; ctx.setLineDash([6 / S.zoom, 4 / S.zoom]); ctx.strokeRect(ox + cx, oy + cy, 160, 144); ctx.restore(); }
  if (P.msg) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const w = cv.width, h = cv.height, dp = devicePixelRatio, bw = Math.min(w - 40 * dp, 900 * dp), bx = (w - bw) / 2, fs = 16 * dp;
    ctx.font = `${fs}px system-ui,sans-serif`; const lines = []; let line = ''; for (const wd of P.msg.split(' ')) { if (line && ctx.measureText(line + ' ' + wd).width > bw - 32 * dp) { lines.push(line); line = wd; } else line = line ? line + ' ' + wd : wd; } lines.push(line);
    const bh = lines.length * fs * 1.35 + 28 * dp, by = h - bh - 16 * dp; ctx.fillStyle = 'rgba(27,20,36,0.94)'; ctx.fillRect(bx, by, bw, bh); ctx.strokeStyle = '#5ff2ff'; ctx.lineWidth = 2 * dp; ctx.strokeRect(bx, by, bw, bh);
    ctx.fillStyle = '#fff'; lines.forEach((l, i) => ctx.fillText(l, bx + 16 * dp, by + 10 * dp + fs + i * fs * 1.35)); ctx.fillStyle = '#ffd23f'; ctx.fillText('A', bx + bw - 22 * dp, by + bh - 10 * dp); ctx.restore(); }
}

// ---------- extra Map Logic checks: people, sightlines, door fronts, rewards ----------
function logicExtra(id, add) {
  const ps = peopleWithData(id), seen = new Set(), over = [];
  for (const n of ps) if (n.trainer) { const L = sightOf(id, n); if (!L.length) add(id, 'info', `A trainer at ${n.x},${n.y} faces a wall: nobody can walk into their sight.`, [tk(n.x, n.y)]);
    for (const k of L) { if (seen.has(k)) over.push(k); seen.add(k); } }
  if (over.length) add(id, 'warn', `Two trainers' sightlines overlap on ${over.length} tile(s): the player would be called out by both.`, over);
  const fronts = allDoors(id).map(d => tk(d.x, d.y + 1));
  for (const n of ps) if (n.wander) { const r = Math.min(2, n.wander), hit = fronts.filter(k => { const [x, y] = k.split(',').map(Number); return Math.abs(x - n.x) <= r && Math.abs(y - n.y) <= r; }); if (hit.length) add(id, 'warn', `Someone strolls across a door front at ${hit[0]}.`, hit); }
  const items = (DS.objs[id] || []).filter(o => ['stash', 'chest', 'hidden'].includes(o.k)).length + sec(id).objects.filter(o => o.k === 'stash' || o.k === 'chest').length;
  if (!items && ['route', 'field', 'cave', 'dungeon'].includes(sec(id).type)) add(id, 'info', 'No items on this map. A reward at a dead end or behind a detour makes exploring worth it.');
}

// ---------- hooks (called from design.js) ----------
function designPanel2(m) {
  if (m === 'walls') return wallsExtra();
  if (m === 'items') return itemsPanel();
  if (m === 'wild') return wildPanel();
  if (m === 'settings') return settingsPanel();
  if (m === 'play') return playPanel();
  return '';
}
function designWire2() { const m = S.mode; if (m === 'people') personWire(); if (m === 'items') itemsWire(); if (m === 'wild') wildWire(); if (m === 'settings') settingsWire(); if (m === 'play') playWire(); }
function designDown2(e, t, wx, wy) {
  if (S.mode === 'play') { if (e.button === 0 && !e.altKey && t) { if (canWalk(t.sid, t.x, t.y)) playStart(t.sid, t.x, t.y); else toast('Start on a walkable tile.'); return true; } return false; }
  if (e.button !== 0 || e.altKey || !t) return false;
  if (S.mode === 'walls' && '~^vbx'.includes(S.brush)) { S.gRect = { sid: t.sid, x0: t.x, y0: t.y, x1: t.x, y1: t.y }; draw(); return true; }
  if (S.mode === 'items') { itemPlace(t); return true; }
  return false;
}
function designMove2(e, t) { if (S.gRect) { if (t && t.sid === S.gRect.sid) { S.gRect.x1 = t.x; S.gRect.y1 = t.y; draw(); } return true; } return false; }
function designUp2() { if (S.gRect) groundRect(); }
function designKey2(e) {
  if (S.mode !== 'play' || !S.play) return false;
  if (KEYS[e.key]) { e.preventDefault(); HELD[KEYS[e.key]] = 1; return true; }
  if (e.key === ' ' || e.key === 'Enter' || e.key === 'z' || e.key === 'Z') { e.preventDefault(); playA(); return true; }
  if (e.key === 'Shift' || e.key === 'x' || e.key === 'X') { e.preventDefault(); playB(); return true; }
  if (e.key === 'Escape') { playStop(); return true; }
  return true;
}
function designDraw2(ctx) {
  const showG = S.walls || S.mode === 'walls';
  for (const s of viewSecs()) { const [ox, oy] = origin(s);
    if (showG) { for (const [k, col] of [['water', 'rgba(60,150,255,0.55)'], ['lava', 'rgba(255,120,40,0.6)']]) { ctx.fillStyle = col; for (const t of fluidTiles(s.id, k)) { const [x, y] = t.split(',').map(Number); ctx.fillRect(ox + x * 16, oy + y * 16, 16, 16); } }
      ctx.strokeStyle = 'rgba(215,155,255,0.9)'; ctx.lineWidth = 1 / S.zoom; for (const t of behindTiles(s.id)) { const [x, y] = t.split(',').map(Number); for (let i = 4; i < 16; i += 5) { ctx.beginPath(); ctx.moveTo(ox + x * 16 + i, oy + y * 16); ctx.lineTo(ox + x * 16, oy + y * 16 + i); ctx.stroke(); } ctx.strokeRect(ox + x * 16, oy + y * 16, 16, 16); }
      const R = rowsOf(s.id); ctx.font = '12px sans-serif'; R.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === 'v') { ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(ox + x * 16, oy + y * 16, 16, 16); ctx.fillStyle = '#fff'; ctx.fillText('↓', ox + x * 16 + 4, oy + y * 16 + 13); } }); }
    if (S.mode === 'people' || S.mode === 'play' || S.mode === 'check') for (const n of peopleWithData(s.id)) {
      if (n.trainer) { ctx.fillStyle = 'rgba(255,60,80,0.28)'; for (const k of sightOf(s.id, n)) { const [x, y] = k.split(',').map(Number); ctx.fillRect(ox + x * 16 + 2, oy + y * 16 + 2, 12, 12); } }
      if (n.wander) { const r = Math.min(2, n.wander); ctx.save(); ctx.strokeStyle = 'rgba(95,242,255,0.8)'; ctx.setLineDash([3 / S.zoom, 2 / S.zoom]); ctx.lineWidth = 1 / S.zoom; ctx.strokeRect(ox + (n.x - r) * 16, oy + (n.y - r) * 16, (2 * r + 1) * 16, (2 * r + 1) * 16); ctx.restore(); } }
    if (S.mode === 'items' || S.mode === 'play' || S.mode === 'check') for (const [o, mine, i] of s.objects.map(o => [o, false, -1]).concat((DS.objs[s.id] || []).map((o, i) => [o, true, i]))) {
      const L = { stash: 'S', chest: 'C', hidden: '?', sign: 'i', stop: '!' }[o.k]; if (!L || (o.k === 'stash' && !mine)) continue;
      const on = mine && S.osel && S.osel.sid === s.id && S.osel.i === i; ctx.fillStyle = mine ? (on ? '#ffd23f' : 'rgba(255,210,63,0.75)') : 'rgba(180,180,180,0.7)'; ctx.fillRect(ox + o.tile[0] * 16 + 2, oy + o.tile[1] * 16 + 2, 12, 12);
      ctx.fillStyle = '#1b1424'; ctx.font = 'bold 10px sans-serif'; ctx.fillText(L, ox + o.tile[0] * 16 + 5, oy + o.tile[1] * 16 + 12); }
  }
  if (S.gRect) { const r = S.gRect, [ox, oy] = origin(sec(r.sid)), x0 = Math.min(r.x0, r.x1), y0 = Math.min(r.y0, r.y1); ctx.fillStyle = { '~': 'rgba(60,150,255,0.5)', '^': 'rgba(255,120,40,0.5)', v: 'rgba(255,255,255,0.4)', b: 'rgba(215,155,255,0.5)', x: 'rgba(0,0,0,0.4)' }[S.brush];
    ctx.fillRect(ox + x0 * 16, oy + y0 * 16, (Math.abs(r.x1 - r.x0) + 1) * 16, (Math.abs(r.y1 - r.y0) + 1) * 16); }
  playDraw(ctx);
}
function designBundle2(b) {
  for (const [id, u] of Object.entries(PAINTIMG)) b.images[`art/sections_paint/${id}.png`] = u;
  for (const [id, g] of Object.entries(DS.ground)) { if (!g.behind || !g.behind.length || !sec(id)) continue;   // walk-behind: the map's own pixels on those tiles, drawn again over the player
    const s = sec(id), src = NEWIMG[id] ? img(NEWIMG[id]) : img(s.img); if (!ok(src)) { toast(`${s.name} is still loading; save again to include its walk-behind art.`); continue; }
    const c = document.createElement('canvas'); c.width = s.tiles[0] * 16; c.height = s.tiles[1] * 16; const x2 = c.getContext('2d'), fw = src.naturalWidth / s.tiles[0], fh = src.naturalHeight / s.tiles[1];
    for (const [x, y] of g.behind) x2.drawImage(src, x * fw, y * fh, fw, fh, x * 16, y * 16, 16, 16);
    b.images[`art/sections_over_ed/${id}.png`] = c.toDataURL('image/png'); }
  for (const id of Object.keys(DS.enc || {})) { const s = sec(id); if (s) Object.assign(DS.enc[id], { planet: s.planet, name: s.name }); }
}
function designBoot2() { DS.enc = DS.enc || {}; DS.paint = DS.paint || {}; addEventListener('keyup', e => { if (KEYS[e.key]) delete HELD[KEYS[e.key]]; }); }
function designUndo() { for (const id of Object.keys(DS.paint || {})) if (sec(id)) paintBake(id); for (const id of Object.keys(PAINTIMG)) if (!(DS.paint || {})[id]) delete PAINTIMG[id]; }
