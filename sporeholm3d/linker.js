// Linker add-on for the 3D game: Xenodex registration on new catches, Start menu (Enter), Linker map (M).
// Standalone: reads window.GAME / window.RPG / window.STORY and never edits game.js state except through
// the game's own menu key. Loaded after game.js.
(() => {
  const D = window.LINKER_DATA || { species: {}, zones: {} };
  const TYPE_COL = { Plasma: "#ff7a3a", Hydro: "#4ab4ff", Bio: "#6ee06a", Alloy: "#c0c8d4", Volt: "#ffe14a", Terra: "#c9984a", Gust: "#9ee8ff", Toxin: "#b46aff", Psy: "#ff6ad8", Lumen: "#fff2a8", Umbra: "#7a6a9a", Cryo: "#bff4ff", Star: "#ffd36a" };
  const REG_KEY = "am_linker_reg";
  const css = document.createElement("style");
  css.textContent = `
  .lk-ov{position:fixed;inset:0;z-index:40;display:none;align-items:center;justify-content:center;background:rgba(4,10,18,.55);font:15px system-ui;color:#eafff4}
  .lk-card{width:min(560px,92vw);max-height:88vh;overflow:auto;background:linear-gradient(160deg,#0f2233,#0a1622);border:2px solid #5af0e0;border-radius:18px;box-shadow:0 0 30px #5af0e055;padding:18px 20px}
  .lk-head{display:flex;align-items:center;gap:10px;font:800 13px system-ui;letter-spacing:2px;color:#5af0e0;text-transform:uppercase}
  .lk-head .dot{width:10px;height:10px;border-radius:50%;background:#5af0e0;box-shadow:0 0 10px #5af0e0;animation:lkp 1s infinite alternate}
  @keyframes lkp{from{opacity:.3}to{opacity:1}}
  .lk-reg{display:flex;gap:16px;align-items:center;margin-top:12px}
  .lk-reg img{width:150px;height:150px;image-rendering:auto;background:radial-gradient(circle,#1d3b52,#0a1622 70%);border-radius:14px;flex:none}
  .lk-no{color:#9fb8c8;font:600 13px system-ui}
  .lk-name{font:800 28px system-ui;color:#fff}
  .lk-type{display:inline-block;padding:2px 10px;border-radius:10px;font:700 12px system-ui;color:#0a1420;margin:4px 6px 0 0}
  .lk-lore{margin-top:12px;line-height:1.45;color:#d8ecf4}
  .lk-foot{margin-top:14px;display:flex;justify-content:space-between;color:#9fb8c8;font-size:13px}
  .lk-menu{width:min(320px,86vw)}
  .lk-mi{padding:10px 14px;border-radius:10px;margin-top:6px;cursor:pointer;font:700 17px system-ui;display:flex;justify-content:space-between}
  .lk-mi small{font:500 12px system-ui;color:#9fb8c8;align-self:center}
  .lk-mi.on{background:#5af0e022;outline:2px solid #5af0e0}
  .lk-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px;margin-top:12px}
  .lk-cell{background:#13283a;border-radius:10px;padding:6px;text-align:center;font:600 11px system-ui;cursor:pointer;border:2px solid transparent}
  .lk-cell.on{border-color:#5af0e0}
  .lk-cell img{width:64px;height:64px}
  .lk-cell.seen img{filter:brightness(0) opacity(.55)}
  .lk-cell.unk{color:#56708a;cursor:default}
  .lk-map canvas{width:100%;max-height:calc(88vh - 150px);object-fit:contain;background:#071019;border-radius:12px;display:block;margin-top:10px}
  #lkHint{position:fixed;left:14px;bottom:46px;z-index:5;font:12px system-ui;color:#eafff4;background:rgba(10,20,30,.55);padding:4px 10px;border-radius:8px;pointer-events:none}
  @media (max-width:520px){.lk-reg{flex-direction:column}.lk-reg img{width:120px;height:120px}}
  `;
  document.head.appendChild(css);
  const ov = document.createElement("div"); ov.className = "lk-ov"; document.body.appendChild(ov);
  const hint = document.createElement("div"); hint.id = "lkHint"; hint.textContent = "Enter: Menu · M: Map"; document.body.appendChild(hint);
  let mode = null, sel = 0, items = [], queue = [], gridSel = 0, gridList = [];
  const audio = (src, vol = 0.7) => { try { const a = new Audio(src); a.volume = vol; a.play().catch(() => {}); return a } catch { return null } };
  let voice = null;
  const sfx = (k, v) => audio("audio/" + k, v);
  const loadReg = () => { try { return JSON.parse(localStorage.getItem(REG_KEY) || "null") } catch { return null } };
  const saveReg = r => { try { localStorage.setItem(REG_KEY, JSON.stringify(r)) } catch {} };
  const LOG = () => (window.GAME && window.GAME.LOG) || {};
  const SEEN = () => (window.RPG && window.RPG.S && window.RPG.S.seen) || {};
  const types = sp => { const e = D.species[sp]; if (e && e.t && e.t.length) return e.t; const S = window.RPG && window.RPG.SP; return (S && S[sp] && S[sp].t) || [] };
  const num = sp => { const e = D.species[sp]; return e ? "No. " + String(e.n).padStart(3, "0") : "No. ???" };
  const dexList = () => {
    const S = (window.RPG && window.RPG.SP) || {};
    const names = new Set(Object.keys(D.species));
    for (const k in LOG()) names.add(k);
    for (const k in SEEN()) names.add(k);
    for (const k in S) if (D.species[k]) names.add(k);
    return [...names].sort((a, b) => ((D.species[a] || {}).n || 999) - ((D.species[b] || {}).n || 999) || a.localeCompare(b));
  };
  const busy = () => {
    if (window.STORY && window.STORY.CS && window.STORY.CS.on) return true;
    if (window.RPG && window.RPG.B) return true;
    for (const id of ["btUI", "rpgPanel", "syncUI"]) {
      const el = document.getElementById(id);
      if (el && el.getClientRects().length && getComputedStyle(el).display !== "none" && getComputedStyle(el).visibility !== "hidden" && el.getBoundingClientRect().height > 4) {
        if (id === "btUI" && getComputedStyle(el).opacity === "0") continue;
        return true;
      }
    }
    const ld = document.getElementById("load"); if (ld && ld.style.display !== "none" && ld.getClientRects().length && getComputedStyle(ld).display !== "none") return true;
    return false;
  };
  const close = () => { if (window.MAPVIEW) window.MAPVIEW.hide(); mode = null; ov.style.display = "none"; ov.innerHTML = ""; if (voice) { try { voice.pause() } catch {} voice = null } };
  const typeChips = sp => types(sp).map(t => `<span class="lk-type" style="background:${TYPE_COL[t] || "#9fb8c8"}">${t}</span>`).join("");
  const counts = () => { const L = LOG(), S = SEEN(); const caught = Object.keys(L).filter(k => L[k] > 0).length; const seen = new Set([...Object.keys(S), ...Object.keys(L)]).size; return { caught, seen } };
  const entry = (sp, isNew) => {
    const e = D.species[sp] || {};
    const c = counts(), n = LOG()[sp] || 0;
    mode = "entry";
    ov.innerHTML = `<div class="lk-card"><div class="lk-head"><span class="dot"></span>${isNew ? "Linker updated · New Xenodex entry" : "Xenodex"}</div>
      <div class="lk-reg">${e.img ? `<img src="art/dex/${sp}.png" alt="">` : ""}<div><div class="lk-no">${num(sp)}</div><div class="lk-name">${sp}</div>${typeChips(sp)}
      <div class="lk-no" style="margin-top:6px">${n ? "Caught ×" + n : "Seen in the wild"}</div></div></div>
      ${e.lore ? `<div class="lk-lore">${e.lore}</div>` : ""}
      <div class="lk-foot"><span>Xenodex: ${c.caught} caught · ${c.seen} seen</span><span>E / Enter: OK</span></div></div>`;
    ov.style.display = "flex";
    if (isNew) { sfx("sfx/sfx_link_success.mp3", 0.5); try { window.chime && window.chime() } catch {} }
    if (e.v) setTimeout(() => { if (mode === "entry") voice = audio("audio/dex/" + e.v, 0.95) }, isNew ? 650 : 150);
  };
  // ---- new-catch detection
  let reg = loadReg();
  const poll = () => {
    if (!window.GAME || !window.GAME.LOG) return;
    const L = LOG();
    if (!reg) { reg = {}; for (const k in L) if (L[k] > 0) reg[k] = 1; saveReg(reg) }
    for (const k in L) if (L[k] > 0 && !reg[k]) { reg[k] = 1; saveReg(reg); queue.push(k) }
    if (queue.length && !mode && !busy()) entry(queue.shift(), true);
  };
  setInterval(poll, 400);
  // ---- Start menu
  const openMenu = () => {
    mode = "menu"; sel = 0; sfx("ui/ui_bag_open.mp3", 0.6);
    items = [
      ["Team & Bag", "your Alienmon and items", () => { close(); setTimeout(() => { try { window.RPG.openPanel() } catch { document.body.dispatchEvent(new KeyboardEvent("keydown", { code: "Tab", key: "Tab", bubbles: true })) } }, 30) }],
      ["Xenodex", "every Alienmon you've linked", openDex],
      ["Map", "where you are (M)", openMap],
      ["Controls", "keys and buttons", openHelp],
      ["New game", "start over from the first cutscene", openNewGame],
      ["Close", "back to the game", close],
    ];
    drawMenu();
  };
  const drawMenu = () => {
    const c = counts();
    ov.innerHTML = `<div class="lk-card lk-menu"><div class="lk-head"><span class="dot"></span>Linker · Menu</div>` +
      items.map((it, i) => `<div class="lk-mi${i === sel ? " on" : ""}" data-i="${i}">${it[0]}<small>${i === 1 ? c.caught + " caught" : it[1]}</small></div>`).join("") +
      `<div class="lk-foot"><span>Arrows: move</span><span>Enter: pick · Esc: close</span></div></div>`;
    ov.style.display = "flex";
    ov.querySelectorAll(".lk-mi").forEach(el => el.onclick = () => { sel = +el.dataset.i; items[sel][2]() });
  };
  const openHelp = () => {
    mode = "help";
    ov.innerHTML = `<div class="lk-card"><div class="lk-head"><span class="dot"></span>Controls</div><div class="lk-lore">
      <b>WASD / arrows</b> walk · <b>Shift</b> run · <b>Space</b> jump<br><b>E</b> talk, coax, pick up<br><b>Enter</b> this menu · <b>M</b> Linker map<br>
      <b>Tab</b> team &amp; bag · <b>I</b> items<br>Controller: <b>Start</b> team &amp; bag<br><br>Your game saves by itself as you play. To start over, pick <b>New game</b> in this menu.</div>
      <div class="lk-foot"><span></span><span>Esc: back</span></div></div>`;
    ov.style.display = "flex";
  };
  // ---- New game: Yes/No, No picked first. Yes reloads with ?newgame=1, which index.html turns into a wiped save.
  let ngSel = 1;
  const openNewGame = () => { mode = "newgame"; ngSel = 1; drawNewGame() };
  const drawNewGame = () => {
    ov.innerHTML = `<div class="lk-card lk-menu"><div class="lk-head"><span class="dot"></span>New game</div>
      <div class="lk-lore"><b>Start over?</b> Your current save will be erased. Your settings stay.</div>` +
      ["Yes, start over", "No, keep playing"].map((t, i) => `<div class="lk-mi${i === ngSel ? " on" : ""}" data-i="${i}">${t}</div>`).join("") +
      `<div class="lk-foot"><span>Arrows: move</span><span>Enter: pick · Esc: back</span></div></div>`;
    ov.style.display = "flex";
    ov.querySelectorAll(".lk-mi").forEach(el => el.onclick = () => { ngSel = +el.dataset.i; pickNewGame() });
  };
  const pickNewGame = () => {
    if (ngSel !== 0) { openMenu(); return }
    close();
    if (window.AM_RESET_SAVE) window.AM_RESET_SAVE();
    location.href = location.pathname + "?newgame=1";
  };
  // ---- Xenodex list
  const openDex = () => {
    mode = "dex"; gridList = dexList(); gridSel = Math.min(gridSel, Math.max(0, gridList.length - 1));
    drawDex();
  };
  const drawDex = () => {
    const L = LOG(), S = SEEN(), c = counts();
    ov.innerHTML = `<div class="lk-card" style="width:min(760px,94vw)"><div class="lk-head"><span class="dot"></span>Xenodex · ${c.caught} caught · ${c.seen} seen</div><div class="lk-grid">` +
      gridList.map((sp, i) => {
        const e = D.species[sp] || {}, got = L[sp] > 0, seen = got || S[sp];
        const cls = got ? "" : seen ? "seen" : "unk";
        return `<div class="lk-cell ${cls}${i === gridSel ? " on" : ""}" data-i="${i}">${e.img && seen ? `<img src="art/dex/${sp}.png" alt="">` : `<div style="height:64px;line-height:64px;font-size:28px">?</div>`}<div>${seen ? sp : "???"}</div><div style="color:#9fb8c8">${e.n ? "#" + String(e.n).padStart(3, "0") : ""}${got && L[sp] > 1 ? " ×" + L[sp] : ""}</div></div>`;
      }).join("") + `</div><div class="lk-foot"><span>Enter: open entry</span><span>Esc: back</span></div></div>`;
    ov.style.display = "flex";
    ov.querySelectorAll(".lk-cell").forEach(el => el.onclick = () => { gridSel = +el.dataset.i; openGridEntry() });
    const on = ov.querySelector(".lk-cell.on"); on && on.scrollIntoView({ block: "nearest" });
  };
  const openGridEntry = () => { const sp = gridList[gridSel]; const L = LOG(), S = SEEN(); if (L[sp] > 0 || S[sp]) { entry(sp, false); mode = "dexEntry" } };
  // ---- Map
  const worldName = () => { let w = "sporeholm"; try { w = new URLSearchParams(location.search).get("world") || localStorage.getItem("am_world") || w } catch {} return w.charAt(0).toUpperCase() + w.slice(1) };
  const toMap = (x, z) => {
    const U = window.GAME.res.unwarp; let m = [x, z];
    for (let it = 0; it < 12; it++) {
      const p = U(m[0], m[1]), a = U(m[0] + 0.5, m[1]), b = U(m[0], m[1] + 0.5);
      const j11 = (a[0] - p[0]) / 0.5, j21 = (a[1] - p[1]) / 0.5, j12 = (b[0] - p[0]) / 0.5, j22 = (b[1] - p[1]) / 0.5;
      const ex = x - p[0], ez = z - p[1], det = j11 * j22 - j12 * j21 || 1;
      m = [m[0] + (j22 * ex - j12 * ez) / det, m[1] + (-j21 * ex + j11 * ez) / det];
      if (Math.abs(ex) + Math.abs(ez) < 0.05) break;
    }
    return m;
  };
  const zoneOf = id => { for (const k in D.zones) if (D.zones[k][1].includes(id)) return [k, D.zones[k][0]]; return null };
  const ZCOL = ["#2f6f5a", "#6a5a2f", "#3a4f7a", "#7a3f4f", "#4f6a2f", "#5a3f7a", "#2f5f7a", "#7a5f2f", "#3f7a6a", "#6a2f5a"];
  const openMap = () => {
    if (!window.GAME || !window.GAME.res) return;
    if (window.MAPVIEW && window.MAPVIEW.open()) { mode = "map2"; ov.style.display = "none"; ov.innerHTML = ""; return }
    mode = "map";
    const R = window.GAME.res.rects, P = window.GAME.P.position;
    const keys = Object.keys(R).filter(k => Array.isArray(R[k]));
    let x0 = 1e9, z0 = 1e9, x1 = -1e9, z1 = -1e9;
    for (const k of keys) { const r = R[k]; x0 = Math.min(x0, r[0]); z0 = Math.min(z0, r[1]); x1 = Math.max(x1, r[0] + 30); z1 = Math.max(z1, r[1] + 30) }
    const pm = toMap(P.x, P.z);
    let here = null; for (const k of keys) { const r = R[k]; if (pm[0] >= r[0] && pm[0] < r[0] + 30 && pm[1] >= r[1] && pm[1] < r[1] + 30) here = k }
    const place = window.GAME.placeAt ? window.GAME.placeAt(P.x, P.z) : null;
    const hz = here && zoneOf(here);
    const obj = (document.getElementById("objHud") || {}).textContent || "";
    const W = 900, pad = 20, sc = Math.min((W - pad * 2) / (x1 - x0), 560 / (z1 - z0)), H = Math.round((z1 - z0) * sc + pad * 2);
    ov.innerHTML = `<div class="lk-card lk-map" style="width:min(940px,96vw)"><div class="lk-head"><span class="dot"></span>Linker map · ${worldName()}</div>
      <div style="margin-top:8px;font:700 18px system-ui">You are ${place ? "inside a building in " : "in "}${hz ? hz[1] : "the wilds"}</div>
      ${obj ? `<div class="lk-no" style="margin-top:4px">${obj.replace(/^Objective\s*/, "Objective: ").replace(/\d+\s*m$|here$/, "")}</div>` : ""}
      <canvas width="${W}" height="${H}"></canvas><div class="lk-foot"><span>Blinking dot: you</span><span>M / Esc: close</span></div></div>`;
    ov.style.display = "flex";
    const cv = ov.querySelector("canvas"), g = cv.getContext("2d");
    const X = mx => pad + (mx - x0) * sc, Y = mz => pad + (mz - z0) * sc;
    const zc = {}; let zi = 0; const lab = {};
    for (const k of keys) {
      const r = R[k], z = zoneOf(k), zk = z ? z[0] : "_";
      if (!(zk in zc)) zc[zk] = zk === "_" ? "#24323f" : ZCOL[zi++ % ZCOL.length];
      g.fillStyle = zc[zk]; g.fillRect(X(r[0]) + 1, Y(r[1]) + 1, 30 * sc - 2, 30 * sc - 2);
      if (k === here) { g.strokeStyle = "#5af0e0"; g.lineWidth = 3; g.strokeRect(X(r[0]) + 2, Y(r[1]) + 2, 30 * sc - 4, 30 * sc - 4) }
      if (z) { const l = lab[zk] || (lab[zk] = { n: z[1], x: 0, z: 0, c: 0, cells: [] }); l.x += r[0] + 15; l.z += r[1] + 15; l.c++; l.cells.push([r[0] + 15, r[1] + 15]) }
    }
    g.font = "700 14px system-ui"; g.textAlign = "center"; g.fillStyle = "#eafff4"; g.shadowColor = "#000"; g.shadowBlur = 4;
    for (const k in lab) { const l = lab[k], cx = l.x / l.c, cz = l.z / l.c; let b = l.cells[0], bd = 1e9; for (const c of l.cells) { const d = (c[0] - cx) ** 2 + (c[1] - cz) ** 2; if (d < bd) { bd = d; b = c } } g.fillText(l.n, X(b[0]), Y(b[1]) + 5) }
    g.shadowBlur = 0;
    const draw = t => {
      if (mode !== "map") return;
      const px = X(pm[0]), py = Y(pm[1]);
      g.save(); g.fillStyle = "#ffffff"; g.beginPath(); g.arc(px, py, 6, 0, 6.29); g.fill();
      g.strokeStyle = `rgba(90,240,224,${0.4 + 0.6 * Math.abs(Math.sin(t / 300))})`; g.lineWidth = 3; g.beginPath(); g.arc(px, py, 11, 0, 6.29); g.stroke(); g.restore();
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  };
  // ---- keys (capture phase, so the game never sees keys meant for these panels)
  const moveSel = (d, n) => Math.max(0, Math.min(n - 1, d));
  window.addEventListener("keydown", ev => {
    if (!ev.isTrusted) return;
    const t = ev.target; if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    const c = ev.code, ok = c === "Enter" || c === "KeyE" || c === "Space", back = c === "Escape" || c === "Backspace" || c === "KeyX";
    if (mode) {
      ev.preventDefault(); ev.stopImmediatePropagation();
      if (ev.repeat && !/Arrow|Key[WASD]/.test(c)) return;
      if (mode === "entry") { if (ok || back) { close(); setTimeout(poll, 50) } return }
      if (mode === "dexEntry") { if (ok || back) openDex(); return }
      if (mode === "map") { if (c === "KeyM" || back || ok) close(); return }
      if (mode === "map2") { if (c === "KeyM" || back || ok) close(); else window.MAPVIEW.key(c); return }
      if (mode === "help") { if (back || ok) openMenu(); return }
      if (mode === "newgame") {
        if (/Arrow(Up|Down)|Key[WS]/.test(c)) { ngSel = 1 - ngSel; sfx("ui/ui_move.mp3", 0.4); drawNewGame() }
        else if (ok) { sfx("ui/ui_confirm.mp3", 0.5); pickNewGame() }
        else if (back) { sfx("ui/ui_back.mp3", 0.5); openMenu() }
        return;
      }
      if (mode === "menu") {
        if (c === "ArrowUp" || c === "KeyW") { sel = (sel + items.length - 1) % items.length; sfx("ui/ui_move.mp3", 0.4); drawMenu() }
        else if (c === "ArrowDown" || c === "KeyS") { sel = (sel + 1) % items.length; sfx("ui/ui_move.mp3", 0.4); drawMenu() }
        else if (ok) { sfx("ui/ui_confirm.mp3", 0.5); items[sel][2]() }
        else if (back) { sfx("ui/ui_back.mp3", 0.5); close() }
        return;
      }
      if (mode === "dex") {
        const cols = Math.max(1, Math.round((ov.querySelector(".lk-grid") || { clientWidth: 600 }).clientWidth / 100));
        if (c === "ArrowRight" || c === "KeyD") gridSel = moveSel(gridSel + 1, gridList.length);
        else if (c === "ArrowLeft" || c === "KeyA") gridSel = moveSel(gridSel - 1, gridList.length);
        else if (c === "ArrowDown" || c === "KeyS") gridSel = moveSel(gridSel + cols, gridList.length);
        else if (c === "ArrowUp" || c === "KeyW") gridSel = moveSel(gridSel - cols, gridList.length);
        else if (ok) { openGridEntry(); return }
        else if (back) { openMenu(); return }
        drawDex(); return;
      }
      return;
    }
    if ((c === "Enter" || c === "KeyM") && !ev.repeat && window.GAME && !busy()) {
      ev.preventDefault(); ev.stopImmediatePropagation();
      c === "Enter" ? openMenu() : (sfx("ui/ui_confirm.mp3", 0.4), openMap());
    }
  }, true);
  ov.addEventListener("click", e => { if (e.target === ov) { mode === "dexEntry" ? openDex() : close() } });
  // controller: A or B closes the "New Xenodex entry" card (the game reads the pad itself, not as key presses)
  let padPrev = false;
  setInterval(() => {
    const gp = navigator.getGamepads ? Array.from(navigator.getGamepads()).find(g => g && g.connected) : null;
    const down = !!(gp && gp.buttons && ((gp.buttons[0] && gp.buttons[0].pressed) || (gp.buttons[1] && gp.buttons[1].pressed)));
    if (down && !padPrev && mode === "entry") { close(); setTimeout(poll, 50) }
    padPrev = down;
  }, 60);
  // keep the movement keys from sticking when a panel opens mid-walk
  const unstick = () => { const K = window.GAME && window.GAME.K; if (K) for (const k in K) K[k] = false };
  new MutationObserver(() => { if (ov.style.display === "flex") unstick() }).observe(ov, { attributes: true, attributeFilter: ["style"] });
  window.LINKER = { openMenu, openMap, openDex, entry, close, get mode() { return mode } };
})();
