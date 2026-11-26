// Map v2 for the 3D game: a baked top-down picture of the whole world (map/<world>/), zoom that loads sharp tiles,
// fog over everything you have not walked near yet (saved per world), key places named once found, and an arrow for you.
// Opened through linker.js (M / Map button). Falls back to the old block map when a world has no baked picture.
(() => {
  const worldId = () => { let w = "sporeholm"; try { w = new URLSearchParams(location.search).get("world") || localStorage.getItem("am_world") || w } catch {} return String(w).toLowerCase() };
  let W = null, BASE = "", FOGKEY = "";
  let info = null, over = null, fog = null, fogDirty = false, fogC = null, el = null, cv = null, g = null, view = null;
  let tiles = {}; const CELL = 5, REVEAL = 24;
  // ---- data, loaded for whichever world the game is in
  const ensure = () => { const w = String(window.WORLD || worldId()).toLowerCase(); if (w === W) return; W = w; BASE = "map/" + W + "/"; FOGKEY = "am_fog_" + W; info = null; over = null; fog = null; fogC = null; tiles = {};
    fetch(BASE + "info.json?v=" + Date.now().toString(36).slice(0, -3)).then((r) => (r.ok ? r.json() : null)).then((j) => {
      if (!j || !j.T || W !== w) return; j.ncx = Math.ceil(j.nx * j.T / CELL); j.ncz = Math.ceil(j.nz * j.T / CELL);
      fog = new Uint8Array(j.ncx * j.ncz); try { const s = localStorage.getItem(FOGKEY); if (s) { const b = atob(s); for (let i = 0; i < Math.min(b.length, fog.length); i++) fog[i] = b.charCodeAt(i) } } catch {}
      over = new Image(); over.src = BASE + "overview.webp?v=" + (j.ver || 1); info = j;
    }).catch(() => {}); };
  // ---- fog of war: everything within REVEAL m of where you walk outdoors
  const inside = () => { const G = window.GAME; return !!(G && G.placeAt && G.placeAt(G.P.position.x, G.P.position.z)) };
  const reveal = (x, z, r) => { if (!fog) return; const i0 = Math.max(0, Math.floor((x - r - info.x0) / CELL)), i1 = Math.min(info.ncx - 1, Math.floor((x + r - info.x0) / CELL)), j0 = Math.max(0, Math.floor((z - r - info.z0) / CELL)), j1 = Math.min(info.ncz - 1, Math.floor((z + r - info.z0) / CELL));
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) { const cx = info.x0 + (i + 0.5) * CELL, cz = info.z0 + (j + 0.5) * CELL; if ((cx - x) ** 2 + (cz - z) ** 2 <= r * r && !fog[j * info.ncx + i]) { fog[j * info.ncx + i] = 1; fogDirty = true } } };
  const seen = (x, z) => { if (!fog) return true; const i = Math.floor((x - info.x0) / CELL), j = Math.floor((z - info.z0) / CELL); return i >= 0 && j >= 0 && i < info.ncx && j < info.ncz && !!fog[j * info.ncx + i] };
  let lastSave = 0;
  setInterval(() => { ensure(); const G = window.GAME; if (!info || !G || !G.P || inside()) return; reveal(G.P.position.x, G.P.position.z, REVEAL);
    if (fogDirty && performance.now() - lastSave > 4000) { lastSave = performance.now(); fogDirty = false; fogC = null; try { let s = ""; for (let i = 0; i < fog.length; i++) s += String.fromCharCode(fog[i]); localStorage.setItem(FOGKEY, btoa(s)) } catch {} } }, 700);
  // ---- where you are: outdoors your own spot; inside a building or cave, the door you came in by
  const here = () => { const G = window.GAME, p = G.P.position; const pl = G.placeAt ? G.placeAt(p.x, p.z) : null; if (!pl) return { x: p.x, z: p.z, yaw: G.getYaw ? G.getYaw() : 0, in: null };
    const id = typeof pl === "string" ? pl : pl.id; const d = (info.outPortals || []).find((q) => String(q.to || "").split(":")[0] === id); if (d) { const [x, z] = unwarp(d.at[0], d.at[1]); return { x, z, yaw: null, in: (G.PL[id] && G.PL[id].name) || "" } } return { x: p.x, z: p.z, yaw: null, in: "" } };
  const unwarp = (a, b) => { const U = window.GAME && window.GAME.res && window.GAME.res.unwarp; return U ? U(a, b) : [a, b] };
  const nice = (s) => String(s || "").replace(/^(enter|go in(to)?|go down( into)?|go into|step into|climb (down )?(into|to)|head into|visit)\s+/i, "").replace(/^the\s+/i, "").replace(/^./, (c) => c.toUpperCase());
  const KIND = (id, t) => /^house/.test(id) ? "home" : /shop|mart|bakery|store|market/i.test(t + id) ? "shop" : /arena|coliseum|col[A-Z]|gym|trial/i.test(t + id) ? "arena" : /bay|clinic|center/i.test(t + id) ? "heal" : /cave|tunnel|mine|depth|rim/i.test(t + id) ? "cave" : "place";
  const KCOL = { home: "#5af0e0", shop: "#ffd27a", arena: "#ff8a6a", heal: "#8affa0", cave: "#c9a8ff", place: "#ffe9b0" };
  let LB = null, LBfor = null;
  const labels = () => { if (LBfor === info) return LB; const out = [];
    for (const q of info.outPortals || []) { const id = String(q.to || "").split(":")[0]; let t = nice(q.label); const pn = (info.places || {})[id] || "";
      if (/secret/i.test(pn + " " + q.label)) continue;
      if (!/^(enter|go (down )?into)\b/i.test(String(q.label || "").trim()) && pn) t = pn;
      if (!t || /^go (inside|in|out|down|up)$/i.test(t)) t = pn; if (/^house/.test(id) || /^your house/i.test(pn)) t = "Home";
      t = t.replace(/ (B\d|Lobby|Trial Floor|Depths|Gallery|Reading Loft|Recovery Loft|Loft|Rooms)$/, "").replace(/^the\s+/i, "");
      if (!t) continue; const [x, z] = unwarp(q.at[0], q.at[1]); if (out.some((l) => l.t === t && Math.hypot(l.x - x, l.z - z) < 40)) continue; out.push({ t, x, z, k: KIND(id, t) }) }
    for (const l of info.labels || []) out.push(l); out.sort((a, b) => (b.k === "home") - (a.k === "home")); LBfor = info; LB = out; return out };
  // ---- drawing
  const tileImg = (i, j) => { const k = i + "_" + j; let t = tiles[k]; if (!t) { t = tiles[k] = new Image(); t.onload = () => draw(); t.src = BASE + "t_" + k + ".webp?v=" + (info.ver || 1) } return t };
  const fogCanvas = () => { if (fogC) return fogC; fogC = document.createElement("canvas"); fogC.width = info.ncx; fogC.height = info.ncz; const c = fogC.getContext("2d"), im = c.createImageData(info.ncx, info.ncz);
    for (let i = 0; i < fog.length; i++) { im.data[i * 4] = 6; im.data[i * 4 + 1] = 12; im.data[i * 4 + 2] = 20; im.data[i * 4 + 3] = fog[i] ? 0 : 238 } c.putImageData(im, 0, 0); return fogC };
  const draw = () => { if (!el || el.style.display === "none") return; const dpr = window.devicePixelRatio || 1, Wd = cv.width, Hd = cv.height, s = view.s * dpr, sx = (x) => Wd / 2 + (x - view.cx) * s, sz = (z) => Hd / 2 + (z - view.cz) * s;
    g.fillStyle = "#060c14"; g.fillRect(0, 0, Wd, Hd); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
    const bx = sx(info.x0), bz = sz(info.z0), bw = (info.nx * info.T) * s, bh = (info.nz * info.T) * s;
    if (over && over.complete && over.naturalWidth) g.drawImage(over, bx, bz, bw, bh);
    if (s > (over && over.naturalWidth ? over.naturalWidth / (info.nx * info.T) : 4) * 1.15) { const i0 = Math.max(0, Math.floor((view.cx - Wd / 2 / s - info.x0) / info.T)), i1 = Math.min(info.nx - 1, Math.floor((view.cx + Wd / 2 / s - info.x0) / info.T)), j0 = Math.max(0, Math.floor((view.cz - Hd / 2 / s - info.z0) / info.T)), j1 = Math.min(info.nz - 1, Math.floor((view.cz + Hd / 2 / s - info.z0) / info.T));
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) { if (!(info.has || []).includes(i + "_" + j)) continue; const t = tileImg(i, j); if (t.complete && t.naturalWidth) g.drawImage(t, sx(info.x0 + i * info.T), sz(info.z0 + j * info.T), info.T * s + 0.6, info.T * s + 0.6) } }
    if (fog) g.drawImage(fogCanvas(), bx, bz, info.ncx * CELL * s, info.ncz * CELL * s);
    // key places you have found
    g.font = `700 ${Math.round(13 * dpr)}px system-ui`; g.textAlign = "center"; g.textBaseline = "bottom";
    const boxes = [];
    const vis = labels().filter((l) => seen(l.x, l.z)).map((l) => ({ ...l, X: sx(l.x), Y: sz(l.z) })).filter((l) => l.X > -80 && l.Y > -40 && l.X < Wd + 80 && l.Y < Hd + 40);
    for (const l of vis) { g.fillStyle = KCOL[l.k] || KCOL.place; g.strokeStyle = "#1a1208"; g.lineWidth = 2 * dpr; g.beginPath(); g.arc(l.X, l.Y, (l.k === "home" ? 7 : 5) * dpr, 0, 6.29); g.fill(); g.stroke() }
    for (const l of vis) { const x = l.X, y = l.Y, c = KCOL[l.k] || KCOL.place;
      const w = g.measureText(l.t).width + 12 * dpr, bx = x - w / 2, by = y - 27 * dpr, bh = 19 * dpr;
      if (boxes.some((r) => bx < r[0] + r[2] && bx + w > r[0] && by < r[1] + r[3] && by + bh > r[1])) continue; boxes.push([bx, by, w, bh]);
      g.fillStyle = "rgba(8,16,26,.84)"; g.fillRect(bx, by, w, bh); g.fillStyle = c; g.fillRect(bx, by + bh - 2 * dpr, w, 2 * dpr); g.fillStyle = "#fff4dc"; g.fillText(l.t, x, y - 10 * dpr) }
    // you
    const h = view.me, x = sx(h.x), y = sz(h.z); g.save(); g.translate(x, y);
    g.fillStyle = "rgba(90,240,224,.25)"; g.beginPath(); g.arc(0, 0, 16 * dpr, 0, 6.29); g.fill();
    if (h.yaw != null) { g.rotate(-h.yaw); g.fillStyle = "#5af0e0"; g.strokeStyle = "#062026"; g.lineWidth = 2 * dpr; g.beginPath(); g.moveTo(0, -12 * dpr); g.lineTo(8 * dpr, 9 * dpr); g.lineTo(0, 4 * dpr); g.lineTo(-8 * dpr, 9 * dpr); g.closePath(); g.fill(); g.stroke() }
    else { g.fillStyle = "#5af0e0"; g.beginPath(); g.arc(0, 0, 7 * dpr, 0, 6.29); g.fill() }
    g.restore(); };
  // ---- the panel
  const css = document.createElement("style"); css.textContent = `#mv{position:fixed;inset:0;z-index:41;display:none;background:#060c14;touch-action:none;font:14px system-ui;color:#eafff4}
  #mv canvas{position:absolute;inset:0;width:100%;height:100%}
  #mv .top{position:absolute;left:12px;top:10px;right:12px;display:flex;gap:10px;align-items:center;pointer-events:none}
  #mv .ttl{background:rgba(8,16,26,.85);border:2px solid #5af0e0;border-radius:12px;padding:6px 12px;font:800 15px system-ui}
  #mv .ttl small{display:block;font:600 12px system-ui;color:#9fd8d0}
  #mv .btns{position:absolute;left:12px;bottom:14px;display:flex;flex-direction:column;gap:8px}
  #mv button{width:48px;height:48px;border-radius:12px;border:2px solid #5af0e0;background:rgba(8,16,26,.88);color:#eafff4;font:800 22px system-ui}
  #mv .x{position:absolute;right:12px;top:10px;width:auto;padding:0 14px;font:800 15px system-ui}html.tc #mv .x{display:none}`;
  document.head.appendChild(css);
  const build = () => { el = document.createElement("div"); el.id = "mv"; el.innerHTML = `<canvas></canvas><div class="top"><div class="ttl"></div></div><button class="x">Close</button><div class="btns"><button data-z="1.5">+</button><button data-z="0.667">−</button><button data-me="1">◎</button></div>`; document.body.appendChild(el);
    cv = el.querySelector("canvas"); g = cv.getContext("2d");
    el.querySelector(".x").onclick = () => (window.LINKER ? window.LINKER.close() : hide());
    for (const b of el.querySelectorAll("[data-z]")) b.onclick = () => zoom(+b.dataset.z, cv.clientWidth / 2, cv.clientHeight / 2);
    el.querySelector("[data-me]").onclick = () => { view.cx = view.me.x; view.cz = view.me.z; draw() };
    const pts = new Map(); let pinch = null;
    cv.addEventListener("pointerdown", (e) => { cv.setPointerCapture(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]); if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), s: view.s } } });
    cv.addEventListener("pointermove", (e) => { const p = pts.get(e.pointerId); if (!p) return; if (pts.size === 1) { view.cx -= (e.clientX - p[0]) / view.s; view.cz -= (e.clientY - p[1]) / view.s; pts.set(e.pointerId, [e.clientX, e.clientY]); clampView(); draw(); return }
      pts.set(e.pointerId, [e.clientX, e.clientY]); const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch) { const k = (pinch.s * d / pinch.d) / view.s; zoom(k, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2) } });
    const up = (e) => { pts.delete(e.pointerId); if (pts.size < 2) pinch = null }; cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
    cv.addEventListener("wheel", (e) => { e.preventDefault(); zoom(e.deltaY < 0 ? 1.18 : 1 / 1.18, e.clientX, e.clientY) }, { passive: false });
    addEventListener("resize", () => { if (el.style.display !== "none") { size(); draw() } }); };
  const size = () => { const dpr = window.devicePixelRatio || 1; cv.width = Math.round(cv.clientWidth * dpr); cv.height = Math.round(cv.clientHeight * dpr) };
  const fitS = () => Math.min(cv.clientWidth / (info.nx * info.T), cv.clientHeight / (info.nz * info.T)) * 0.95;
  const clampView = () => { view.cx = Math.min(info.x0 + info.nx * info.T, Math.max(info.x0, view.cx)); view.cz = Math.min(info.z0 + info.nz * info.T, Math.max(info.z0, view.cz)) };
  const zoom = (k, px, py) => { const s0 = view.s, s1 = Math.min(28, Math.max(fitS(), s0 * k)); const wx = view.cx + (px - cv.clientWidth / 2) / s0, wz = view.cz + (py - cv.clientHeight / 2) / s0; view.s = s1; view.cx = wx - (px - cv.clientWidth / 2) / s1; view.cz = wz - (py - cv.clientHeight / 2) / s1; clampView(); draw() };
  const open = () => { ensure(); if (!info || !fog || !window.GAME || !window.GAME.P) return false; if (!el) build(); el.style.display = "block"; size(); const me = here(); reveal(me.x, me.z, me.in == null ? REVEAL : 8);
    view = { cx: me.x, cz: me.z, s: Math.max(fitS(), Math.min(cv.clientWidth, cv.clientHeight) / 110), me };
    const zn = "", nm = W.charAt(0).toUpperCase() + W.slice(1);
    el.querySelector(".ttl").innerHTML = `Linker map · ${nm}<small>${me.in ? "You're inside " + me.in : "Drag to look around, pinch or + to zoom"}${zn}</small>`;
    fogC = null; draw(); return true };
  const hide = () => { if (el) el.style.display = "none" };
  const key = (c) => { if (!view) return; const st = 60 / view.s;
    if (c === "ArrowLeft" || c === "KeyA") view.cx -= st; else if (c === "ArrowRight" || c === "KeyD") view.cx += st; else if (c === "ArrowUp" || c === "KeyW") view.cz -= st; else if (c === "ArrowDown" || c === "KeyS") view.cz += st;
    else if (c === "Equal" || c === "NumpadAdd" || c === "KeyQ" || c === "PageUp") return zoom(1.4, cv.clientWidth / 2, cv.clientHeight / 2);
    else if (c === "Minus" || c === "NumpadSubtract" || c === "KeyR" || c === "PageDown") return zoom(1 / 1.4, cv.clientWidth / 2, cv.clientHeight / 2);
    else return; clampView(); draw() };
  window.MAPVIEW = { open, hide, key, reveal: (r) => { if (info) { for (let i = 0; i < fog.length; i++) fog[i] = 1; fogC = null } }, get info() { return info }, get view() { return view } };
})();
