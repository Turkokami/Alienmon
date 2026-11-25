// ================= ROOM KIT (Nov 25 2026): finished interiors for story rooms =================
// A place that sets `fine` (see defPlace in world.js) is built with this kit instead of the old block walls and painted floor:
//  - a real floor (wood boards or terracotta tile, with normal maps) that is still the walkable "ground"
//  - thin plaster walls along every floor edge, with wood wainscot, baseboard, crown moulding and a dark wood cap on top
//  - real windows cut through the walls: casing, sill, a dark steel grid, glass, a painted canyon view, and where the sun can reach,
//    a slanted beam of light and a bright patch of sun on the floor with the grid's shadow in it
//  - soft contact shadows where floor meets wall
//  - a set of small props (shelves full of books, plants, lamps, frames, cushions, curtains, string lights, speakers...) for dressing
// Everything the kit places goes into a handful of merged meshes per room (one per material), so a dressed room is a few draw calls.
// Textures are the rk_* files under tex/ (own procedural work, see rigtools/make_rk_textures.py). Nothing here copies any other game.
ASSETS.roomKit = function (THREE, env) {
  const TAU = Math.PI * 2, add = env.add, std = env.std, root = env.root;
  let seed = env.seed || 9173; const R = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const RK = ASSETS.roomKit, MATS = RK.mats || (RK.mats = {}), TX = RK.tex || (RK.tex = {}), M = (k, f) => MATS[k] || (MATS[k] = f());
  const cv = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };

  // ---- textures (flat stand-in colour until the picture loads) ----
  const TXV = "rk2";
  const rkTex = (name, srgb, fill) => TX[name] || (TX[name] = (() => { const c = cv(4, 4), C = c.getContext("2d"); C.fillStyle = fill; C.fillRect(0, 0, 4, 4);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    const hk = typeof globalThis !== "undefined" && globalThis.NNTEXLOAD; if (hk) { const im = hk(name); if (im) { t.image = im; t.needsUpdate = true; return t; } }
    try { if (typeof Image === "function" && typeof location !== "undefined" && /^https?:/.test(location.protocol)) { const im = new Image(); im.decoding = "async"; im.onload = () => { if (im.naturalWidth) { t.image = im; t.dispose(); t.needsUpdate = true; } }; im.src = "tex/" + name + ".webp?v=" + TXV; } } catch (e) { }
    return t; })());
  const ctex = (w, h, draw, srgb = true) => { const c = cv(w, h); draw(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
  const V2 = (a) => new THREE.Vector2(a, a);

  // ---- materials (shared by every fine room) ----
  const mat = {
    wall: () => M("wall", () => std({ map: rkTex("rk_plaster_d", true, "#f2e4c8"), normalMap: rkTex("rk_plaster_n", false, "#8080ff"), normalScale: V2(0.7), roughness: 0.94, vertexColors: true })),
    wood: () => M("wood", () => std({ map: rkTex("rk_plank_d", true, "#c08a58"), normalMap: rkTex("rk_plank_n", false, "#8080ff"), normalScale: V2(0.5), roughness: 0.62, vertexColors: true })),
    trim: () => M("trim", () => std({ map: rkTex("rk_plank_d", true, "#c08a58"), roughness: 0.5, vertexColors: true })),
    plank: () => M("plank", () => std({ map: rkTex("rk_plank_d", true, "#c08a58"), normalMap: rkTex("rk_plank_n", false, "#8080ff"), normalScale: V2(0.9), roughness: 0.48 })),
    tile: () => M("tile", () => std({ map: rkTex("rk_tile_d", true, "#b85a36"), normalMap: rkTex("rk_tile_n", false, "#8080ff"), normalScale: V2(1.0), roughness: 0.66 })),
    paint: () => M("paint", () => std({ roughness: 0.72, vertexColors: true })),
    gloss: () => M("gloss", () => std({ roughness: 0.28, vertexColors: true })),
    metal: () => M("metal", () => std({ roughness: 0.38, metalness: 0.75, vertexColors: true })),
    cloth: () => M("cloth", () => std({ map: rkTex("nn_cloth_d", true, "#d8d0c0"), normalMap: rkTex("nn_cloth_n", false, "#8080ff"), normalScale: V2(0.6), roughness: 0.96, vertexColors: true, side: THREE.DoubleSide })),
    leaf: () => M("leaf", () => std({ roughness: 0.62, vertexColors: true, side: THREE.DoubleSide })),
    glow: () => M("glow", () => new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false })),
    glass: () => M("glass", () => std({ color: "#d8eeff", roughness: 0.04, metalness: 0.1, transparent: true, opacity: 0.16, depthWrite: false })),
    view: () => M("view", () => new THREE.MeshBasicMaterial({ map: rkTex("rk_view_d", true, "#bfe0f0") })),
    shade: () => M("shade", () => new THREE.MeshBasicMaterial({ map: ctex(8, 64, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "rgba(0,0,0,0.42)"); gr.addColorStop(0.5, "rgba(0,0,0,0.12)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, w, h); }, false), transparent: true, depthWrite: false, color: "#000000", opacity: 1, polygonOffset: true, polygonOffsetFactor: -2 })),
    beam: () => M("beam", () => new THREE.MeshBasicMaterial({ map: ctex(8, 64, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0.15)"); g.fillStyle = gr; g.fillRect(0, 0, w, h); }, false), color: "#ffd9a0", transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })),
  };

  // ---- merged batches ----
  const BAT = {};
  const BKEYS = { wall: ["wall", 2.2, ""], wood: ["wood", 1.6, ""], trim: ["trim", 1.6, "nocol"], paint: ["paint", 1, "nocol"], fpaint: ["paint", 1, ""], gloss: ["gloss", 1, "nocol"], metal: ["metal", 1, "nocol"],
    cloth: ["cloth", 0.7, "nocol"], fcloth: ["cloth", 0.7, ""], leaf: ["leaf", 1, "nocol"], glow: ["glow", 1, "nocol"], fwood: ["wood", 1.6, ""] };
  let FR = new THREE.Matrix4(); const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _c = new THREE.Color();
  const put = (key, geo, p = [0, 0, 0], r = [0, 0, 0], s = 1, color = "#ffffff", own) => {
    const spec = BKEYS[key], b = BAT[key] || (BAT[key] = { mat: mat[spec[0]], sc: spec[1], name: spec[2], pos: [], nor: [], uv: [], col: [] });
    const g = geo.index ? geo.toNonIndexed() : geo; _e.set(r[0], r[1], r[2]); _q.setFromEuler(_e); const sc = Array.isArray(s) ? s : [s, s, s]; _m.compose(_p.set(p[0], p[1], p[2]), _q, _s.set(sc[0], sc[1], sc[2])); _m.premultiply(FR); g.applyMatrix4(_m);
    const P = g.attributes.position, N = g.attributes.normal, U = g.attributes.uv; _c.set(color);
    for (let i = 0; i < P.count; i++) { const x = P.getX(i), y = P.getY(i), z = P.getZ(i), nx = N.getX(i), ny = N.getY(i), nz = N.getZ(i); b.pos.push(x, y, z); b.nor.push(nx, ny, nz);
      if (own && U) b.uv.push(U.getX(i), U.getY(i)); else { const ax = Math.abs(nx), ay = Math.abs(ny), az = Math.abs(nz); let u, v; if (ay >= ax && ay >= az) { u = x; v = z; } else if (ax >= az) { u = z; v = y; } else { u = x; v = y; } b.uv.push(u / b.sc, v / b.sc); }
      b.col.push(_c.r, _c.g, _c.b); }
    if (g !== geo) geo.dispose(); g.dispose(); };
  const at = (x, y, z, ry, fn) => { const keep = FR.clone(); _e.set(0, ry || 0, 0); _q.setFromEuler(_e); FR = FR.clone().multiply(new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), _q.clone(), new THREE.Vector3(1, 1, 1))); try { fn(); } finally { FR = keep; } };
  const flush = () => { for (const k in BAT) { const b = BAT[k]; if (!b.pos.length) continue; const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(b.pos, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(b.nor, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(b.uv, 2)); g.setAttribute("color", new THREE.Float32BufferAttribute(b.col, 3)); g.computeBoundingSphere();
      const m = new THREE.Mesh(g, b.mat()); m.name = b.name; m.castShadow = k === "wall" || k === "fwood" || k === "fpaint" || k === "wood"; m.receiveShadow = true; root.add(m); delete BAT[k]; } };

  // ---- shapes ----
  const box = (key, w, h, d, x, y, z, c, ry = 0, rx = 0, rz = 0) => put(key, new THREE.BoxGeometry(w, h, d), [x, y, z], [rx, ry, rz], 1, c);
  const cyl = (key, rt, rb, h, x, y, z, c, seg = 12, rx = 0, rz = 0) => put(key, new THREE.CylinderGeometry(rt, rb, h, seg), [x, y, z], [rx, 0, rz], 1, c);
  const ball = (key, r, x, y, z, c, sx = 1, sy = 1, sz = 1, seg = 10) => put(key, new THREE.SphereGeometry(r, seg, Math.max(6, seg - 2)), [x, y, z], [0, 0, 0], [sx, sy, sz], c);
  const lathe = (key, pts, x, y, z, c, seg = 14) => put(key, new THREE.LatheGeometry(pts.map(([a, b]) => new THREE.Vector2(a, b)), seg), [x, y, z], [0, 0, 0], 1, c);
  const pick = (a) => a[Math.floor(R() * a.length)];

  // ---- painted pictures: original desert scenes, star charts, shapes, and posters of Alienmon from the game's own dex art ----
  const ART = RK.art || (RK.art = {});
  const art = (kind, w = 256, h = 320) => ART[kind + w + h] || (ART[kind + w + h] = (() => { const c = cv(w, h), g = c.getContext("2d"); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    const paint = () => { g.clearRect(0, 0, w, h);
      if (kind === "mesa") { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#f2a65a"); gr.addColorStop(0.55, "#ffd9a0"); gr.addColorStop(1, "#c26a3e"); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = "#fff1c8"; g.beginPath(); g.arc(w * 0.68, h * 0.38, w * 0.12, 0, TAU); g.fill();
        for (const [y0, c] of [[0.55, "#b8615a"], [0.66, "#8e3f36"], [0.78, "#5a2626"]]) { g.fillStyle = c; g.beginPath(); g.moveTo(0, h); let x = 0, y = h * y0; g.lineTo(0, y); while (x < w) { const s = 20 + R() * 50; x += s; y = h * y0 + (R() - 0.5) * h * 0.08; g.lineTo(x - s * 0.7, y); g.lineTo(x, y); } g.lineTo(w, h); g.fill(); } }
      else if (kind === "stars") { g.fillStyle = "#14204a"; g.fillRect(0, 0, w, h); for (let k = 0; k < 120; k++) { g.fillStyle = `rgba(255,${230 + R() * 25},${190 + R() * 60},${0.4 + R() * 0.6})`; g.beginPath(); g.arc(R() * w, R() * h, R() * 1.8 + 0.3, 0, TAU); g.fill(); }
        g.strokeStyle = "rgba(127,240,230,0.7)"; g.lineWidth = 1.5; for (let q = 0; q < 3; q++) { g.beginPath(); let x = R() * w, y = R() * h; g.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (R() - 0.5) * 90; y += (R() - 0.5) * 90; g.lineTo(x, y); g.fillStyle = "#fff4d0"; g.fillRect(x - 2, y - 2, 4, 4); } g.stroke(); }
        g.strokeStyle = "rgba(255,210,122,0.5)"; g.beginPath(); g.arc(w / 2, h / 2, w * 0.42, 0, TAU); g.stroke(); }
      else if (kind === "shapes") { g.fillStyle = "#efe3cc"; g.fillRect(0, 0, w, h); const cs = ["#c4572e", "#2a9a96", "#e8b84a", "#3a3456", "#d98a6a"]; for (let k = 0; k < 6; k++) { g.fillStyle = cs[k % cs.length]; const x = R() * w, y = R() * h, r = 20 + R() * 60; if (k % 3 === 0) { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); } else if (k % 3 === 1) { g.beginPath(); g.arc(x, y + r, r, Math.PI, TAU); g.fill(); g.fillRect(x - r, y + r, r * 2, r); } else g.fillRect(x - r / 2, y - r, r, r * 2); } }
      else if (kind === "map") { g.fillStyle = "#e8d4a8"; g.fillRect(0, 0, w, h); g.strokeStyle = "rgba(120,80,40,0.6)"; g.lineWidth = 1; for (let k = 0; k < 9; k++) { g.beginPath(); const cx = R() * w, cy = R() * h; for (let a = 0; a <= TAU + 0.01; a += 0.3) { const r = 20 + k * 2 + 10 * Math.sin(a * 3 + k); g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.8); } g.stroke(); }
        g.strokeStyle = "#2a7a96"; g.lineWidth = 3; g.beginPath(); g.moveTo(0, h * 0.3); g.bezierCurveTo(w * 0.3, h * 0.5, w * 0.6, h * 0.2, w, h * 0.6); g.stroke(); g.fillStyle = "#a8442a"; for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(R() * w, R() * h, 4, 0, TAU); g.fill(); } g.strokeStyle = "#5a3a1a"; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6); }
      else if (kind.startsWith("dex:")) { const [, name, bg] = kind.split(":"); const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, bg || "#2a9a96"); gr.addColorStop(1, "#1a2a3a"); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(255,255,255,0.12)"; for (let k = 0; k < 8; k++) { g.beginPath(); g.arc(w / 2, h * 0.45, 30 + k * 18, 0, TAU); g.fill(); }
        g.fillStyle = "#fff4d8"; g.font = "bold " + Math.round(w * 0.11) + "px sans-serif"; g.textAlign = "center"; g.fillText(name.toUpperCase(), w / 2, h * 0.92);
        const im = ART["img:" + name]; if (im && im.naturalWidth) g.drawImage(im, w * 0.1, h * 0.1, w * 0.8, w * 0.8); }
      t.needsUpdate = true; };
    paint();
    if (kind.startsWith("dex:")) { const name = kind.split(":")[1]; try { if (typeof Image === "function" && /^https?:/.test(location.protocol)) { const im = ART["img:" + name] || (ART["img:" + name] = new Image()); if (!im.src) im.src = "art/dex/" + name + ".png"; const was = im.onload; im.onload = () => { was && was(); paint(); }; } } catch (e) { } }
    return std({ map: t, roughness: 0.6 }); })());

  // ================= the shell: floor, walls, windows =================
  // o: { P, g, at, isFloor, S, ox, oz, W, D, fy, floor: "plank"|"tile", wins: [{ e: "n"|"s"|"e"|"w", at, w, y0, y1, grid, curtains }], wallH, tint, wains: true }
  const shell = (o) => { const { at: cell, ox, oz, W, D } = o, H = o.wallH, fy = o.fy, T = 0.26, wallC = o.tint || "#ffffff", panC = o.panel || "#9a6438", trimC = o.trimC || "#5e3a20";
    const solid = (x, y) => { const c = cell(x, y); return !(o.isFloor(c) || c === "o" || c === "w"); };
    // floor: one quad per floor cell, world-unit UVs, named "ground" so the player walks on it
    { const pos = [], nor = [], uv = [], sc = o.floor === "tile" ? 2.0 : 1.6;
      for (let y = 0; y < D; y++) for (let x = 0; x < W; x++) { if (solid(x, y)) continue; const x0 = ox + x, z0 = oz + y, q = [[x0, z0], [x0, z0 + 1], [x0 + 1, z0 + 1], [x0, z0], [x0 + 1, z0 + 1], [x0 + 1, z0]]; for (const [a, b] of q) { pos.push(a, fy, b); nor.push(0, 1, 0); uv.push(a / sc, -b / sc); } }
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
      const m = new THREE.Mesh(g, o.floor === "tile" ? mat.tile() : mat.plank()); m.name = "ground"; m.receiveShadow = true; root.add(m);
      // a dark plane under everything outside the room, so the gaps around the walls read as solid ground from above
      const vd = add(new THREE.PlaneGeometry(W + 2, D + 2), std({ color: "#2a1a10", roughness: 1 }), [ox + W / 2, -0.02, oz + D / 2], [-Math.PI / 2, 0, 0]); vd.name = "nocol"; }
    // wall runs: every floor-cell edge that faces a solid cell, merged along each line
    const runs = []; { const hz = {}, vt = {};
      for (let y = 0; y < D; y++) for (let x = 0; x < W; x++) { if (solid(x, y)) continue;
        if (solid(x, y - 1)) (hz[(y) + "|1"] = hz[(y) + "|1"] || []).push(x); if (solid(x, y + 1)) (hz[(y + 1) + "|-1"] = hz[(y + 1) + "|-1"] || []).push(x);
        if (solid(x - 1, y)) (vt[(x) + "|1"] = vt[(x) + "|1"] || []).push(y); if (solid(x + 1, y)) (vt[(x + 1) + "|-1"] = vt[(x + 1) + "|-1"] || []).push(y); }
      const mk = (map, axis) => { for (const k in map) { const [L, s] = k.split("|").map(Number), xs = map[k].sort((a, b) => a - b); let a = xs[0], p = a; for (let i = 1; i <= xs.length; i++) { if (i < xs.length && xs[i] === p + 1) { p = xs[i]; continue; } runs.push({ axis, L, s: s, t0: a, t1: p + 1 }); if (i < xs.length) { a = p = xs[i]; } } } };
      mk(hz, "x"); mk(vt, "z"); }
    // edge name of a run as seen from inside: a run along x with the room toward +z is the room's north wall
    const edgeOf = (r) => r.axis === "x" ? (r.s > 0 ? "n" : "s") : (r.s > 0 ? "w" : "e");
    // world placement for local wall coordinates: t along the wall, y up, d into the room (negative = inside the wall)
    const W3 = (r, t, d) => r.axis === "x" ? [ox + t, oz + r.L + r.s * d] : [ox + r.L + r.s * d, oz + t];
    const piece = (key, r, t0, t1, y0, y1, d0, d1, c) => { if (t1 - t0 < 0.005 || y1 - y0 < 0.005 || d1 - d0 < 0.001) return; const [cx, cz] = W3(r, (t0 + t1) / 2, (d0 + d1) / 2);
      if (r.axis === "x") box(key, t1 - t0, y1 - y0, d1 - d0, cx, (y0 + y1) / 2, cz, c); else box(key, d1 - d0, y1 - y0, t1 - t0, cx, (y0 + y1) / 2, cz, c); };
    const sunH = new THREE.Vector2(-0.45, 0.89).normalize(), tanE = 0.9; let sunLights = 0;
    for (const r of runs) { const e = edgeOf(r), ws = (o.wins || []).filter((w) => w.e === e && w.at - w.w / 2 >= r.t0 + 0.2 && w.at + w.w / 2 <= r.t1 - 0.2).map((w) => ({ ...w, t0: w.at - w.w / 2, t1: w.at + w.w / 2, y0: w.y0 ?? 1.05, y1: w.y1 ?? Math.min(H - 0.45, 2.55) })).sort((a, b) => a.t0 - b.t0);
      // plaster body with window holes
      let t = r.t0; for (const w of ws) { piece("wall", r, t, w.t0, fy, H, -T, 0, wallC); piece("wall", r, w.t0, w.t1, fy, w.y0, -T, 0, wallC); piece("wall", r, w.t0, w.t1, w.y1, H, -T, 0, wallC); t = w.t1; } piece("wall", r, t, r.t1, fy, H, -T, 0, wallC);
      // wood cap on top of the wall (what you see from the game camera)
      piece("trim", r, r.t0, r.t1, H, H + 0.07, -T - 0.03, 0.05, trimC);
      // wainscot: boards to chair height, a mid rail, stiles, a cap rail; then the baseboard; crown moulding at the top
      if (o.wains !== false) { piece("wood", r, r.t0, r.t1, fy, fy + 0.92, 0, 0.02, panC); piece("trim", r, r.t0, r.t1, fy + 0.92, fy + 0.98, 0, 0.05, trimC); piece("trim", r, r.t0, r.t1, fy + 0.88, fy + 0.92, 0, 0.035, trimC);
        for (let u = r.t0 + 0.3; u < r.t1 - 0.15; u += 0.62) piece("trim", r, u - 0.03, u + 0.03, fy + 0.16, fy + 0.88, 0.02, 0.034, trimC); piece("trim", r, r.t0, r.t1, fy + 0.46, fy + 0.5, 0.02, 0.034, trimC); }
      piece("trim", r, r.t0, r.t1, fy, fy + 0.15, 0, 0.04, trimC);
      piece("trim", r, r.t0, r.t1, H - 0.1, H, 0, 0.06, trimC); piece("trim", r, r.t0, r.t1, H - 0.17, H - 0.1, 0, 0.03, trimC);
      // contact shadow on the floor along the wall
      { const [cx, cz] = W3(r, (r.t0 + r.t1) / 2, 0.22), L = r.t1 - r.t0, sh = add(new THREE.PlaneGeometry(L, 0.44), mat.shade(), [cx, fy + 0.004, cz], [-Math.PI / 2, 0, r.axis === "x" ? (r.s > 0 ? Math.PI : 0) : (r.s > 0 ? Math.PI / 2 : -Math.PI / 2)]); sh.name = "nocol"; sh.renderOrder = 1; sh.castShadow = false; }
      // the windows
      for (const w of ws) { const wW = w.t1 - w.t0, wH = w.y1 - w.y0, tc = (w.t0 + w.t1) / 2, nb = w.grid ?? Math.max(1, Math.round(wW / 0.42)) - 1, nh = w.rows ?? 2;
        piece("trim", r, w.t0 - 0.11, w.t0, w.y0 - 0.06, w.y1 + 0.02, 0, 0.045, trimC); piece("trim", r, w.t1, w.t1 + 0.11, w.y0 - 0.06, w.y1 + 0.02, 0, 0.045, trimC);
        piece("trim", r, w.t0 - 0.15, w.t1 + 0.15, w.y1, w.y1 + 0.15, 0, 0.055, trimC); piece("trim", r, w.t0 - 0.17, w.t1 + 0.17, w.y1 + 0.15, w.y1 + 0.19, 0, 0.075, trimC);
        piece("trim", r, w.t0 - 0.16, w.t1 + 0.16, w.y0 - 0.06, w.y0, -T * 0.5, 0.13, trimC); piece("trim", r, w.t0 - 0.1, w.t1 + 0.1, w.y0 - 0.18, w.y0 - 0.06, 0, 0.03, trimC);
        // steel grid and frame, glass, the view (inside the wall's thickness so nothing shows outside the room from above)
        const gd0 = -T * 0.55, gd1 = -T * 0.45, gc = "#2b2622"; piece("metal", r, w.t0, w.t0 + 0.05, w.y0, w.y1, gd0, gd1, gc); piece("metal", r, w.t1 - 0.05, w.t1, w.y0, w.y1, gd0, gd1, gc); piece("metal", r, w.t0, w.t1, w.y0, w.y0 + 0.05, gd0, gd1, gc); piece("metal", r, w.t0, w.t1, w.y1 - 0.05, w.y1, gd0, gd1, gc);
        for (let k = 1; k <= nb; k++) { const u = w.t0 + (wW * k) / (nb + 1); piece("metal", r, u - 0.018, u + 0.018, w.y0, w.y1, gd0, gd1, gc); } for (let k = 1; k <= nh; k++) { const v = w.y0 + (wH * k) / (nh + 1); piece("metal", r, w.t0, w.t1, v - 0.018, v + 0.018, gd0, gd1, gc); }
        { const [gx, gz] = W3(r, tc, -T * 0.5), ry = r.axis === "x" ? (r.s > 0 ? 0 : Math.PI) : (r.s > 0 ? Math.PI / 2 : -Math.PI / 2); const gl = add(new THREE.PlaneGeometry(wW, wH), mat.glass(), [gx, (w.y0 + w.y1) / 2, gz], [0, ry, 0]); gl.name = "nocol"; gl.castShadow = false;
          const [vx, vz] = W3(r, tc, -T + 0.015), vg = new THREE.PlaneGeometry(wW, wH), U = vg.attributes.uv, u0 = R() * 0.6, du = wW / 7, fB = 0.84, fT = fB - wH * 0.32; for (let i = 0; i < U.count; i++) U.setXY(i, u0 + U.getX(i) * du, 1 - (fB + (fT - fB) * U.getY(i)));
          const vm = add(vg, mat.view(), [vx, (w.y0 + w.y1) / 2, vz], [0, ry, 0]); vm.name = "nocol"; vm.castShadow = false; }
        // curtains: a rod and two gathered drapes
        if (w.curtains) { const cc = w.curtains, ry = 0; piece("metal", r, w.t0 - 0.35, w.t1 + 0.35, w.y1 + 0.3, w.y1 + 0.33, 0.1, 0.13, "#3a2a1e");
          for (const sd of [-1, 1]) { const cw = 0.42, ch = w.y1 + 0.3 - fy - 0.25, uc = sd < 0 ? w.t0 - 0.12 : w.t1 + 0.12, pg = new THREE.PlaneGeometry(cw, ch, 14, 4), Pp = pg.attributes.position; for (let i = 0; i < Pp.count; i++) Pp.setZ(i, 0.05 * Math.sin((Pp.getX(i) / cw) * TAU * 3.5)); pg.computeVertexNormals();
            const [cx, cz] = W3(r, uc, 0.18); put("cloth", pg, [cx, fy + 0.25 + ch / 2, cz], [0, r.axis === "x" ? (r.s > 0 ? 0 : Math.PI) : (r.s > 0 ? Math.PI / 2 : -Math.PI / 2), 0], 1, cc); } }
        // sunlight: a slanted beam from the window to the floor and the sun patch with the grid's shadow
        const nIn = r.axis === "x" ? new THREE.Vector2(0, r.s) : new THREE.Vector2(r.s, 0);
        if (nIn.dot(sunH) > 0.2 && w.sun !== false) { const P0 = (tt, yy) => { const [x, z] = W3(r, tt, 0.02); return new THREE.Vector3(x, yy, z); }, proj = (v) => new THREE.Vector3(v.x + sunH.x * ((v.y - fy) / tanE), fy + 0.012, v.z + sunH.y * ((v.y - fy) / tanE));
          const c4 = [P0(w.t0, w.y0), P0(w.t1, w.y0), P0(w.t1, w.y1), P0(w.t0, w.y1)], f4 = c4.map(proj), pos = [], uvs = [];
          for (let k = 0; k < 4; k++) { const a = c4[k], b = c4[(k + 1) % 4], fa = f4[k], fb = f4[(k + 1) % 4]; for (const [v, uu, vv] of [[a, 0, 0], [b, 1, 0], [fb, 1, 1], [a, 0, 0], [fb, 1, 1], [fa, 0, 1]]) { pos.push(v.x, v.y, v.z); uvs.push(uu, 1 - vv); } }
          const bg = new THREE.BufferGeometry(); bg.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); bg.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2)); const bm = new THREE.Mesh(bg, mat.beam()); bm.name = "nocol"; bm.renderOrder = 3; root.add(bm);
          const pt = ctex(128, 128, (gg, Wd, Hd) => { gg.fillStyle = "rgba(255,226,170,0.95)"; gg.fillRect(0, 0, Wd, Hd); gg.fillStyle = "rgba(0,0,0,1)"; for (let k = 1; k <= nb; k++) gg.fillRect((Wd * k) / (nb + 1) - 2, 0, 4, Hd); for (let k = 1; k <= nh; k++) gg.fillRect(0, (Hd * k) / (nh + 1) - 2, Wd, 4); gg.fillRect(0, 0, Wd, 5); gg.fillRect(0, Hd - 5, Wd, 5); gg.fillRect(0, 0, 5, Hd); gg.fillRect(Wd - 5, 0, 5, Hd); }, true);
          const sp = [], su = []; for (const [k, uu, vv] of [[0, 0, 0], [1, 1, 0], [2, 1, 1], [0, 0, 0], [2, 1, 1], [3, 0, 1]]) { sp.push(f4[k].x, f4[k].y, f4[k].z); su.push(uu, vv); }
          const sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3)); sg.setAttribute("uv", new THREE.Float32BufferAttribute(su, 2)); const sm = new THREE.Mesh(sg, new THREE.MeshBasicMaterial({ map: pt, transparent: true, opacity: 0.42, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, side: THREE.DoubleSide })); sm.name = "nocol"; sm.renderOrder = 2; root.add(sm);
          if (sunLights < 2) { sunLights++; const cx = (f4[0].x + f4[2].x) / 2, cz = (f4[0].z + f4[2].z) / 2, l = new THREE.PointLight(0xffd6a0, 1.5, 5.5, 1.6); l.position.set(cx, fy + 0.7, cz); root.add(l); } }
        else if (w.sun !== false) { const [lx, lz] = W3(r, tc, 0.9); const l = new THREE.PointLight(0xcfe4ff, 0.7, 4, 1.8); l.position.set(lx, (w.y0 + w.y1) / 2, lz); root.add(l); } } }
    // corner posts where two walls meet around the outside of a room corner
    for (let y = 0; y <= D; y++) for (let x = 0; x <= W; x++) { const f = [!solid(x - 1, y - 1), !solid(x, y - 1), !solid(x - 1, y), !solid(x, y)], n = f.filter(Boolean).length; if (n !== 1) continue; const k = f.indexOf(true), sx = k % 2 === 0 ? 1 : -1, sz = k < 2 ? 1 : -1, cx = ox + x + sx * T / 2, cz = oz + y + sz * T / 2;
      box("wall", T, H - fy, T, cx, (H + fy) / 2, cz, wallC); box("trim", T + 0.08, 0.07, T + 0.08, cx + sx * 0.0, H + 0.035, cz, trimC); }
    return { runs, T, H }; };

  // ================= props =================
  const K = { R, put, box, cyl, ball, lathe, at, flush, art, mat, pick, rkTex };
  // plain plaster (no vertex colours) for parts other code builds, like the header over a door
  K.plasterM = () => M("plasterM", () => std({ map: rkTex("rk_plaster_d", true, "#f2e4c8"), normalMap: rkTex("rk_plaster_n", false, "#8080ff"), normalScale: V2(0.7), roughness: 0.94 }));
  const BOOKC = ["#8a2e2a", "#2a5a7a", "#c8a24a", "#3a6a3a", "#5a3a6a", "#d8c8a8", "#c4572e", "#1e3a4a", "#7a4a2a", "#2a9a96"];
  // a row of books standing, some leaning, sometimes a little stack on its side; u0..u1 along local x at height y, depth d
  K.books = (x0, x1, y, z, d = 0.22, key = "paint") => { let x = x0; while (x < x1 - 0.03) { const r = R(); if (r < 0.1 && x1 - x > 0.3) { let yy = y; for (let k = 0; k < 2 + Math.floor(R() * 3); k++) { const th = 0.03 + R() * 0.02; box(key, 0.22 + R() * 0.05, th, d * (0.8 + R() * 0.2), x + 0.13, yy + th / 2, z, pick(BOOKC), (R() - 0.5) * 0.2); yy += th; } x += 0.3; continue; }
      if (r < 0.16) { x += 0.06 + R() * 0.1; continue; } const bw = 0.025 + R() * 0.035, bh = 0.18 + R() * 0.12, lean = r > 0.94 && x > x0 + 0.1 ? 0.25 : 0; box(key, bw, bh, d * (0.75 + R() * 0.25), x + bw / 2 + (lean ? 0.04 : 0), y + bh / 2, z, pick(BOOKC), 0, 0, -lean); if (R() < 0.3) box(key, bw * 1.02, 0.012, d * 0.8, x + bw / 2, y + bh * 0.8, z + 0.002, "#e8d8a0"); x += bw + 0.003; } };
  // a small potted plant; kind: "leafy" | "snake" | "trail" | "cactus" | "palm"
  K.plant = (x, y, z, s = 1, kind = "leafy", pot = "#b0603a") => { lathe("gloss", [[0.001, 0], [0.12 * s, 0], [0.15 * s, 0.2 * s], [0.16 * s, 0.24 * s], [0.13 * s, 0.24 * s], [0.001, 0.22 * s]], x, y, z, pot);
    const top = y + 0.22 * s, G = ["#3c7a3a", "#4e8a3e", "#2f6a34", "#5a9a44"];
    if (kind === "snake") for (let k = 0; k < 7; k++) { const a = R() * TAU, h = (0.35 + R() * 0.3) * s; put("leaf", new THREE.ConeGeometry(0.03 * s, h, 4), [x + Math.cos(a) * 0.05 * s, top + h / 2, z + Math.sin(a) * 0.05 * s], [(R() - 0.5) * 0.25, a, (R() - 0.5) * 0.25], [1.2, 1, 0.35], pick(["#3e6a3a", "#5a8a46"])); }
    else if (kind === "cactus") { cyl("leaf", 0.06 * s, 0.07 * s, 0.32 * s, x, top + 0.16 * s, z, "#4a8a4a", 8); ball("leaf", 0.06 * s, x, top + 0.32 * s, z, "#4a8a4a"); cyl("leaf", 0.035 * s, 0.035 * s, 0.14 * s, x + 0.08 * s, top + 0.2 * s, z, "#4a8a4a", 6, 0, -0.9); ball("glow", 0.025 * s, x, top + 0.39 * s, z, "#ff7ab0"); }
    else if (kind === "trail") { for (let k = 0; k < 10; k++) { const a = (k / 10) * TAU, L = (0.15 + R() * 0.35) * s; for (let j = 0; j < 5; j++) { const t = j / 4; ball("leaf", 0.035 * s, x + Math.cos(a) * (0.12 + t * 0.08) * s, top - t * L + 0.02, z + Math.sin(a) * (0.12 + t * 0.08) * s, pick(G), 1, 0.4, 1, 6); } } }
    else if (kind === "palm") { cyl("wood", 0.025 * s, 0.03 * s, 0.6 * s, x, top + 0.3 * s, z, "#6a4a2a", 6); for (let k = 0; k < 8; k++) { const a = (k / 8) * TAU + R() * 0.3, L = (0.35 + R() * 0.15) * s; put("leaf", new THREE.PlaneGeometry(L, 0.09 * s, 4, 1), [x + Math.cos(a) * L * 0.45, top + 0.58 * s - 0.08 * s, z - Math.sin(a) * L * 0.45], [0, a, -0.45], 1, pick(G)); } }
    else for (let k = 0; k < 14; k++) { const a = R() * TAU, h = (0.12 + R() * 0.4) * s, rr = (0.05 + R() * 0.12) * s, L = (0.13 + R() * 0.08) * s; put("leaf", new THREE.CircleGeometry(L, 7), [x + Math.cos(a) * rr, top + h, z + Math.sin(a) * rr], [-1.2 + R() * 0.6, a, 0], [0.6, 1, 1], pick(G)); if (k % 3 === 0) cyl("leaf", 0.006, 0.006, h, x + Math.cos(a) * rr * 0.5, top + h / 2, z + Math.sin(a) * rr * 0.5, "#3a5a2a", 4); } };
  // a tall bookcase against a wall (local frame: back at z=-d/2, facing +z)
  K.bookcase = (x, z, ry, w = 1.1, h = 1.9, d = 0.36, wood = "#8a5a34", o = {}) => at(x, o.fy || 0, z, ry, () => { const t = 0.035, n = o.rows || Math.max(3, Math.round(h / 0.38));
    box("fwood", t, h, d, -w / 2 + t / 2, h / 2, 0, wood); box("fwood", t, h, d, w / 2 - t / 2, h / 2, 0, wood); box("fwood", w, t, d, 0, h - t / 2, 0, wood); box("fwood", w, 0.08, d, 0, 0.04, 0, wood); box("wood", w - 0.02, h - 0.02, 0.012, 0, h / 2, -d / 2 + 0.006, "#6a4024"); box("trim", w + 0.06, 0.04, d + 0.04, 0, h + 0.02, 0.01, "#5e3a20");
    for (let k = 1; k < n; k++) { const y = 0.08 + ((h - 0.12) * k) / n; box("wood", w - 2 * t, 0.025, d - 0.01, 0, y, 0, wood); }
    for (let k = 0; k < n; k++) { const y = 0.08 + ((h - 0.12) * k) / n + (k ? 0.013 : 0.0), roll = R(); if (roll < 0.62) K.books(-w / 2 + t + 0.02, w / 2 - t - 0.02, y, -0.01, d * 0.8);
      else { K.books(-w / 2 + t + 0.02, -0.05, y, -0.01, d * 0.8); const ox2 = w * 0.22; if (roll < 0.8) lathe("gloss", [[0.001, 0], [0.06, 0], [0.08, 0.1], [0.04, 0.2], [0.05, 0.22], [0.001, 0.22]], ox2, y, 0, pick(["#2a9a96", "#e8b84a", "#c4572e", "#efe3cc"])); else if (roll < 0.9) K.plant(ox2, y, 0, 0.6, "trail"); else { box("paint", 0.22, 0.12, 0.18, ox2, y + 0.06, 0, "#c8a070"); box("paint", 0.18, 0.08, 0.15, ox2, y + 0.16, 0, "#9a6a4a"); } } } });
  // open wall shelf with brackets and a few things on it
  K.wallShelf = (x, y, z, ry, w = 1.0, items = "mix") => at(x, y, z, ry, () => { box("wood", w, 0.035, 0.24, 0, 0, 0.12, "#8a5a34"); for (const s of [-1, 1]) { box("metal", 0.02, 0.16, 0.02, s * (w / 2 - 0.12), -0.08, 0.02, "#2b2622"); box("metal", 0.02, 0.02, 0.2, s * (w / 2 - 0.12), -0.01, 0.11, "#2b2622"); }
    if (items === "jars" || items === "mix") { let u = -w / 2 + 0.1; while (u < w / 2 - 0.1) { const r = R(); if (r < 0.4) { const hh = 0.1 + R() * 0.1; cyl("gloss", 0.045, 0.045, hh, u, 0.018 + hh / 2, 0.12, pick(["#e8d8b0", "#c87a4a", "#2a9a96", "#efe3cc"]), 10); cyl("paint", 0.047, 0.047, 0.02, u, 0.02 + hh, 0.12, "#6a4a2a", 10); u += 0.12; } else if (r < 0.6) { K.plant(u + 0.05, 0.018, 0.12, 0.55, pick(["trail", "cactus", "snake"])); u += 0.22; } else { K.books(u, Math.min(w / 2 - 0.08, u + 0.25), 0.018, 0.12, 0.18); u += 0.3; } } }
    else if (items === "books") K.books(-w / 2 + 0.06, w / 2 - 0.06, 0.018, 0.12, 0.18); });
  // a framed picture on a wall (local frame faces +z); art: a material from K.art
  K.frame = (x, y, z, ry, w, h, artM, fc = "#2a1e16", mat0 = true) => { at(x, y, z, ry, () => { const b = 0.045; box("trim", w + 2 * b, b, 0.035, 0, h / 2 + b / 2, 0.018, fc); box("trim", w + 2 * b, b, 0.035, 0, -h / 2 - b / 2, 0.018, fc); box("trim", b, h, 0.035, -w / 2 - b / 2, 0, 0.018, fc); box("trim", b, h, 0.035, w / 2 + b / 2, 0, 0.018, fc); if (mat0) box("paint", w, h, 0.01, 0, 0, 0.006, "#f4ecdc"); });
    const pw = mat0 ? w * 0.82 : w, ph = mat0 ? h * 0.82 : h, p = new THREE.Vector3(0, 0, 0.013).applyAxisAngle(new THREE.Vector3(0, 1, 0), ry); const m = add(new THREE.PlaneGeometry(pw, ph), artM, [x + p.x, y, z + p.z], [0, ry, 0]); m.name = "nocol"; m.castShadow = false; return m; };
  // a table lamp: base, stem, fabric shade, warm glow (and a light if asked)
  K.tableLamp = (x, y, z, c = "#efe0c0", light = true, base = "#c4572e") => { lathe("gloss", [[0.001, 0], [0.08, 0], [0.1, 0.06], [0.07, 0.16], [0.03, 0.2], [0.001, 0.2]], x, y, z, base); cyl("metal", 0.01, 0.01, 0.16, x, y + 0.28, z, "#c8a040", 6);
    put("cloth", new THREE.CylinderGeometry(0.1, 0.16, 0.2, 16, 1, true), [x, y + 0.42, z], [0, 0, 0], 1, c); ball("glow", 0.05, x, y + 0.38, z, "#fff0c8"); if (light) { const l = new THREE.PointLight(0xffcf8a, 1.3, 4.5, 1.7); l.position.set(x, y + 0.42, z); root.add(l); } };
  K.floorLamp = (x, z, c = "#efe0c0", light = true, fy = 0) => { cyl("metal", 0.14, 0.16, 0.03, x, fy + 0.015, z, "#2b2622", 16); cyl("metal", 0.012, 0.012, 1.45, x, fy + 0.74, z, "#2b2622", 6); put("cloth", new THREE.CylinderGeometry(0.16, 0.24, 0.3, 18, 1, true), [x, fy + 1.55, z], [0, 0, 0], 1, c); ball("glow", 0.06, x, fy + 1.5, z, "#fff0c8");
    if (light) { const l = new THREE.PointLight(0xffcf8a, 1.6, 5.5, 1.6); l.position.set(x, fy + 1.4, z); root.add(l); } };
  // fairy lights swagged between points along a wall: thin wire, warm bulbs
  K.stringLights = (pts, per = 9, c = "#ffd890") => { for (let k = 0; k + 1 < pts.length; k++) { const a = new THREE.Vector3(...pts[k]), b = new THREE.Vector3(...pts[k + 1]); for (let i = 0; i <= per; i++) { const t = i / per, p = a.clone().lerp(b, t); p.y -= Math.sin(Math.PI * t) * 0.22; ball("glow", 0.022, p.x, p.y - 0.03, p.z, i % 4 === 0 ? "#ffb870" : c, 1, 1.3, 1, 6);
      if (i < per) { const t2 = (i + 1) / per, q = a.clone().lerp(b, t2); q.y -= Math.sin(Math.PI * t2) * 0.22; const m = p.clone().add(q).multiplyScalar(0.5), L = p.distanceTo(q); const geo = new THREE.CylinderGeometry(0.004, 0.004, L, 3); const dir = q.clone().sub(p).normalize(), qq = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir), eu = new THREE.Euler().setFromQuaternion(qq); put("metal", geo, [m.x, m.y, m.z], [eu.x, eu.y, eu.z], 1, "#2a2a2a"); } } } };
  // a soft cushion or pillow
  K.cushion = (x, y, z, w, h, d, c, ry = 0, tilt = 0) => put("cloth", new THREE.SphereGeometry(0.5, 12, 8), [x, y, z], [tilt, ry, 0], [w, h, d], c);
  K.rug = (x, z, w, d, ry, tex, fy = 0) => { const m = add(new THREE.BoxGeometry(w, 0.012, d), std({ map: rkTex(tex, true, "#a8442a"), roughness: 1 }), [x, fy + 0.006, z], [0, ry, 0]); m.name = "nocol"; m.castShadow = false; return m; };
  // a pair of wooden speaker cabinets with painted drivers
  K.speaker = (x, y, z, ry, h = 0.4, c = "#7a4a2a") => at(x, y, z, ry, () => { const w = h * 0.6, d = h * 0.7; box("wood", w, h, d, 0, h / 2, 0, c); box("paint", w * 0.92, h * 0.92, 0.01, 0, h / 2, d / 2 + 0.004, "#2a2622");
    put("gloss", new THREE.CircleGeometry(w * 0.34, 18), [0, h * 0.36, d / 2 + 0.012], [0, 0, 0], 1, "#5a5650"); put("paint", new THREE.CircleGeometry(w * 0.12, 12), [0, h * 0.36, d / 2 + 0.016], [0, 0, 0], 1, "#1a1816"); put("metal", new THREE.CircleGeometry(w * 0.14, 14), [0, h * 0.76, d / 2 + 0.012], [0, 0, 0], 1, "#c8a040"); });
  K.basket = (x, y, z, s = 1, c = "#c8a070") => { lathe("cloth", [[0.001, 0], [0.18 * s, 0], [0.22 * s, 0.26 * s], [0.23 * s, 0.28 * s], [0.21 * s, 0.28 * s], [0.18 * s, 0.03 * s], [0.001, 0.03 * s]], x, y, z, c, 16); };
  K.bowl = (x, y, z, fruit = true) => { lathe("gloss", [[0.001, 0], [0.07, 0], [0.16, 0.08], [0.17, 0.09], [0.15, 0.085], [0.06, 0.012], [0.001, 0.012]], x, y, z, "#2a9a96", 18); if (fruit) for (let k = 0; k < 6; k++) { const a = (k / 6) * TAU + R(); ball("gloss", 0.042, x + Math.cos(a) * 0.07, y + 0.08 + (k > 3 ? 0.04 : 0), z + Math.sin(a) * 0.07, pick(["#e8a03a", "#c83a2a", "#f0d050", "#8ab83a"])); } };
  K.clock = (x, y, z, ry, r = 0.18) => at(x, y, z, ry, () => { put("trim", new THREE.CylinderGeometry(r, r, 0.04, 24), [0, 0, 0.02], [Math.PI / 2, 0, 0], 1, "#5e3a20"); put("paint", new THREE.CircleGeometry(r * 0.86, 24), [0, 0, 0.042], [0, 0, 0], 1, "#f4ecdc");
    for (let k = 0; k < 12; k++) { const a = (k / 12) * TAU; box("paint", 0.01, 0.03, 0.004, Math.sin(a) * r * 0.72, Math.cos(a) * r * 0.72, 0.045, "#2a2622", 0, 0, -a); } box("paint", 0.012, r * 0.5, 0.004, 0.04, r * 0.22, 0.048, "#2a2622", 0, 0, -0.35); box("paint", 0.01, r * 0.7, 0.004, -0.05, -0.08, 0.05, "#2a2622", 0, 0, -2.6); });
  K.cork = (x, y, z, ry, w = 0.9, h = 0.6) => at(x, y, z, ry, () => { box("trim", w + 0.06, h + 0.06, 0.03, 0, 0, 0.015, "#8a5a34"); box("paint", w, h, 0.012, 0, 0, 0.03, "#c49a6a");
    for (let k = 0; k < 7; k++) { const nw = 0.1 + R() * 0.12, nh = 0.1 + R() * 0.1, px = (R() - 0.5) * (w - nw), py = (R() - 0.5) * (h - nh); box("paint", nw, nh, 0.004, px, py, 0.039, pick(["#fff4c0", "#f4ecdc", "#bfe8e0", "#ffd0c0", "#e8f0ff"]), 0, 0, (R() - 0.5) * 0.2); ball("gloss", 0.012, px, py + nh * 0.38, 0.045, pick(["#c83a2a", "#2a6ac8", "#e8b84a"])); } });
  K.mug = (x, y, z, c = "#efe3cc") => { cyl("gloss", 0.04, 0.035, 0.09, x, y + 0.045, z, c, 12); put("gloss", new THREE.TorusGeometry(0.025, 0.007, 6, 10), [x + 0.045, y + 0.05, z], [0, 0, 0], 1, c); };
  K.crate = (x, y, z, ry, s = 0.45, c = "#a8784a") => at(x, y, z, ry, () => { for (const yy of [0.04, s / 2, s - 0.04]) for (const sd of [-1, 1]) { box("wood", s, 0.07, 0.02, 0, yy, sd * (s / 2 - 0.01), c); box("wood", 0.02, 0.07, s, sd * (s / 2 - 0.01), yy, 0, c); } box("wood", s - 0.04, 0.02, s - 0.04, 0, 0.02, 0, c); });
  K.shell = shell;
  return K;
};
