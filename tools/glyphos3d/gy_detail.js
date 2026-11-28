// ================= GLYPHOS DETAIL PASS (job "gly", Nov 28 2026) =================
// The places Book 1 Ch23-25 and the map guide name that the first build left out or left plain:
//  - the GLYPHOS tablet half-sunk off Sunken Landing, and the Deep Sea Ferry moored at the jetty (its inside is the place gyFerry)
//  - the sea-temple lagoon: temples standing, half-sunk and leaning, roofs carved like waves, pillar tops, pillars leaning in pairs
//  - archaeologists' work spots on the temple steps, lantern poles and map tables in the Dig Camp
//  - the Temple of Voices front: gilded stairs, a gold-covered face, columns carved like trees, Liss's crystal, stone guardians
//  - the Ancient Obelisk at the Mural Overlook with its two murals, the humming obelisks of Glyph Hollow, coral on the Coral Ruins
//  - drift grass with glyph-shaped seed heads, carved fragments, fallen blocks, pebbles and shore stones in every scene
// Each piece is added after a scene's own build. New randomness comes only from hashes (gh, gyQ, nnXR), never R(),
// so nothing the scenes already place moves. Solid pieces stand only on water, building lots or jungle-edge tiles.
const GDGOLD = "#e8b54a", GDGOLD2 = "#f6d27a";
NND.gold = []; NND.brass = []; NND.plank = []; NND.obsid = [];
Object.assign(GYBIN, {
  gold: () => thM("gdGold", () => std({ color: "#ffffff", vertexColors: true, metalness: 0.35, roughness: 0.3, emissive: "#5a3a08", emissiveIntensity: 0.6 })),
  brass: () => thM("gdBrass", () => std({ color: "#ffffff", vertexColors: true, metalness: 0.4, roughness: 0.32, emissive: "#2a1a06", emissiveIntensity: 0.45 })),
  plank: () => gyTri("gdPlank", "plank", 0.5, { vc: true, r: 0.85 }),
  obsid: () => thM("gdObsid", () => std({ color: "#ffffff", vertexColors: true, roughness: 0.26, metalness: 0.15 })) });
GYSOLID.obsid = 1;
NNGEO.gdRing = new THREE.TorusGeometry(1, 0.03, 5, 40).toNonIndexed();
NNGEO.gdArc = new THREE.TorusGeometry(1, 0.03, 5, 20, Math.PI).toNonIndexed();

// ---- tiles and spots ----
const gdAt = (x, z) => at(Math.floor(x), Math.floor(z));
const GDWALK = "pPks.,gfS";
// every sample within r of (x, z) is open water
const gdWet = (x, z, r) => { if (gdAt(x, z) !== "w") return false; for (let a = 0; a < 12; a++) { const c = Math.cos((a * TAU) / 12), s = Math.sin((a * TAU) / 12); for (const f of [0.4, 0.75, 1]) if (gdAt(x + c * r * f, z + s * r * f) !== "w") return false; } return true; };
// no sample within r of (x, z) is a tile people walk on or a building lot
const gdOff = (x, z, r, bad = GDWALK + "b") => { if (bad.includes(gdAt(x, z))) return false; for (let a = 0; a < 12; a++) { const c = Math.cos((a * TAU) / 12), s = Math.sin((a * TAU) / 12); for (const f of [0.5, 1]) if (bad.includes(gdAt(x + c * r * f, z + s * r * f))) return false; } return true; };
const gdNear = (x, y, set) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (set.includes(at(x + dx, y + dy))) return true; return false; };
// run f(X, Y) after a scene's own build
const gdAfter = (id, f) => { const s = SCN[id]; if (!s) return; const b = s.build; s.build = () => { b(); f(s.rect[0], s.rect[1]); }; };

// ---- a base that can be turned and tipped: parts are given in its own frame and pushed into the merged batches ----
// o: { y (world height, else the ground), dy, yaw (front +z turns to (sin yaw, cos yaw)), lean (radians), tip (the way the top falls, same angle sense as yaw) }
const GDV = new THREE.Vector3(), GDQ1 = new THREE.Quaternion(), GDQ2 = new THREE.Quaternion(), GDE = new THREE.Euler(), GDY = new THREE.Vector3(0, 1, 0), GDA = new THREE.Vector3();
const gdB = (x, z, o = {}) => { const [ux, uz] = unwarp(x, z); const y = o.y !== undefined ? o.y : GHT(ux, uz) + (o.dy || 0); const q = new THREE.Quaternion().setFromAxisAngle(GDY, o.yaw || 0);
  if (o.lean) { const t = o.tip || 0; q.premultiply(new THREE.Quaternion().setFromAxisAngle(GDA.set(Math.cos(t), 0, -Math.sin(t)), o.lean)); }
  return { O: { abs: true, x: ux, y, z: uz }, q, x, z, ux, uz, yaw: o.yaw || 0, lean: o.lean || 0 }; };
const gdP = (bin, B, gk, lx, ly, lz, sx, sy, sz, col, rx = 0, ry = 0, rz = 0) => { GDV.set(lx, ly, lz).applyQuaternion(B.q); GDQ2.setFromEuler(GDE.set(rx, ry, rz)).premultiply(B.q); GDE.setFromQuaternion(GDQ2, "XYZ");
  NND[bin].push([gk, B.O, GDV.x, GDV.y, GDV.z, GDE.x, GDE.y, GDE.z, sx, sy, sz, col]); };
const gdBx = (bin, B, x, y0, z, w, h, d, col, ry = 0) => gdP(bin, B, "box", x, y0 + h / 2, z, w, h, d, col, 0, ry, 0);
const gdBeam = (bin, B, a, b, r, col, gk = "cyl8") => { GDV.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]); const L = GDV.length(); if (L < 1e-4) return; GDQ1.setFromUnitVectors(GDY, GDV.normalize()); GDE.setFromQuaternion(GDQ1, "XYZ");
  const ex = GDE.x, ey = GDE.y, ez = GDE.z; gdP(bin, B, gk, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, r * 2, L, r * 2, col, ex, ey, ez); };
// the world spot of a point in a base's frame (for moss clumps, which take a plain spot)
const gdW = (B, lx, ly, lz) => { GDV.set(lx, ly, lz).applyQuaternion(B.q); return [GDV.x, GDV.y, GDV.z]; };
const gdMoss = (B, lx, ly, lz, r) => { const [x, y, z] = gdW(B, lx, ly, lz); gyMoss(B.O, x, y, z, r); };
// a gold spiral of short strokes on a face (the swirling marks), in the base's x-y plane at depth z
const gdSpiral = (B, cx, cy, z, R, turns = 1.7, n = 16, col = GDGOLD, bin = "gold", t = 0.05) => { let px = cx + R, py = cy;
  for (let i = 1; i <= n; i++) { const u = i / n, a = u * turns * TAU, r = R * (1 - u * 0.85), x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r, L = Math.hypot(x - px, y - py);
    gdP(bin, B, "box", (x + px) / 2, (y + py) / 2, z, L + t * 0.6, t, t * 0.6, col, 0, 0, Math.atan2(y - py, x - px)); px = x; py = y; } };
// a glowing glyph on a face: a frame, a stroke and a dot (never letters)
const gdGlyph = (B, x, y, z, w, h, col = GYC.gold) => { gdP("glow", B, "box", x, y, z, w, 0.05, 0.03, col); gdP("glow", B, "box", x, y - h * 0.5, z, 0.05, h, 0.03, col); gdP("glow", B, "box", x - w * 0.3, y - h * 0.75, z, w * 0.4, 0.05, 0.03, col); gdP("glow", B, "sph", x + w * 0.3, y - h * 0.4, z, 0.09, 0.09, 0.04, col); };

// ---- sea temples ----
// a column of drums from y0, h tall, with a carved capital and a gold band (or a broken top)
const gdCol = (B, x, z, y0, h, r, k, cap = true) => { gdP("stone", B, "cyl8", x, y0 + 0.2, z, r * 2.6, 0.4, r * 2.6, stc(B.O, k)); let y = y0 + 0.4, i = 0;
  while (y < y0 + h - 0.05) { const dh = Math.min(0.9, y0 + h - y); gdP("stone", B, "cyl8", x + (gh(B.ux + i, B.uz, k) - 0.5) * 0.04, y + dh / 2, z, r * 2, dh - 0.02, r * 2, stc(B.O, k + 1 + i), 0, gh(B.ux, B.uz + i, k + 3), 0); y += dh; i++; }
  if (cap) { gdP("carve", B, "box", x, y0 + h + 0.17, z, r * 2.8, 0.35, r * 2.8, stc(B.O, k + 20)); gdP("gold", B, "box", x, y0 + h + 0.06, z, r * 2.3, 0.07, r * 2.3, GDGOLD); }
  else { gdP("stone", B, "cyl8", x + r * 0.4, y0 + h + 0.12, z, r * 1.6, 0.3, r * 1.6, stc(B.O, k + 21), 0.35, 0, 0.3); } };
// a roof carved like waves: a row of rolling crests with gold inlay along each, a smaller row above, the crest ends curling in gold
const gdWaveRoof = (B, w, d, y, k) => { const n = Math.max(3, Math.round(w / 1.3)), cw = w / n; gdBx("carve", B, 0, y, 0, w + 0.4, 0.4, d + 0.4, stc(B.O, k));
  for (let i = 0; i < n; i++) { const x = -w / 2 + cw * (i + 0.5); gdP("carve", B, "cyl", x, y + 0.42, 0, cw * 1.04, d + 0.2, 1.1, stc(B.O, k + 1 + (i % 3)), Math.PI / 2, 0, 0); gdP("gold", B, "box", x, y + 0.97, 0, 0.08, 0.05, d + 0.22, GDGOLD);
    gdSpiral(B, x, y + 0.42, d / 2 + 0.12, cw * 0.4, 1.5, 12); }
  for (let i = 0; i < n - 1; i++) gdP("carve", B, "cyl", -w / 2 + cw * (i + 1), y + 0.95, 0, cw * 0.88, d - 0.6, 0.9, stc(B.O, k + 5 + (i % 2)), Math.PI / 2, 0, 0); };
// a temple on a podium that runs down into the water: cella, front colonnade, a carved band with gold and turquoise inlay, a wave roof
const gdTemple = (B, w, d, h, k = 0, o = {}) => { const S = (i) => stc(B.O, k + i), top = 0.1;
  for (let i = 0; i < 3; i++) gdBx("stone", B, 0, -2.6 + i * 0.9, 0, w + 2.2 - i * 0.5, 0.9, d + 2.2 - i * 0.5, S(i));
  if (!o.noStair) for (let j = 0; j < 5; j++) { const t2 = top - j * 0.3; gdBx("carve", B, 0, -2.6, (d + 1.2) / 2 + 0.2 + j * 0.4, Math.min(w * 0.55, 5), t2 + 2.6, 0.4, S(3 + j)); gdBx("gold", B, 0, t2 - 0.05, (d + 1.2) / 2 + 0.41 + j * 0.4, Math.min(w * 0.55, 5) - 0.1, 0.04, 0.02, GDGOLD); }
  gdBx("stone", B, 0, top, 0, w, 0.25, d, S(10)); const f = top + 0.25, cd = d - 2.2, cz = -0.5;
  gdBx("stone", B, 0, f, cz, w - 2.0, h, cd, S(11)); gdBx("glow", B, 0, f, cz + cd / 2 + 0.02, 1.4, Math.min(2.5, h * 0.7), 0.04, "#14100a");
  for (const s of [-1, 1]) gdBx("gold", B, s * 0.76, f, cz + cd / 2 + 0.03, 0.08, Math.min(2.5, h * 0.7) + 0.08, 0.03, GDGOLD); gdBx("gold", B, 0, f + Math.min(2.5, h * 0.7), cz + cd / 2 + 0.03, 1.6, 0.08, 0.03, GDGOLD);
  for (const s of [-1, 1]) for (let i = 0; i < 2; i++) gdGlyph(B, s * (1.4 + i * 1.0), f + h * 0.72, cz + cd / 2 + 0.03, 0.42, 0.6, (i + (s > 0)) % 2 ? GYC.turq : GYC.gold);
  const n = Math.max(4, Math.round(w / 1.7)); for (let i = 0; i < n; i++) { const x = -w / 2 + 0.6 + (i * (w - 1.2)) / (n - 1); if (Math.abs(x) < 1.0) continue; gdCol(B, x, d / 2 - 0.5, f, h, 0.3, k + 30 + i * 3); }
  for (const s of [-1, 1]) for (const z of [-d / 2 + 0.6, 0]) gdCol(B, s * (w / 2 - 0.6), z, f, h, 0.3, k + 50 + (z ? 0 : 5) + (s > 0 ? 2 : 0));
  const eb = f + h + 0.35; gdBx("carve", B, 0, eb, 0, w + 0.3, 0.75, d + 0.3, S(12)); gdBx("gold", B, 0, eb + 0.5, d / 2 + 0.16, w + 0.2, 0.09, 0.03, GDGOLD); gdP("glow", B, "box", 0, eb + 0.22, d / 2 + 0.17, w * 0.9, 0.05, 0.03, GYC.turq);
  for (const s of [-1, 1]) gdSpiral(B, s * w * 0.3, eb + 0.37, d / 2 + 0.17, 0.26, 1.6, 12, GDGOLD2);
  gdWaveRoof(B, w, d, eb + 0.75, k + 13);
  if (!B.lean) for (const [x, z] of [[-w / 2, d / 2], [w / 2 - 0.4, -d / 2 + 0.4], [w * 0.2, d / 2]]) if (gh(B.ux + x, B.uz + z, k + 70) < 0.7) gdMoss(B, x, eb + 1.4, z, 0.45); };
// pillar tops: the pillars of a fallen temple, only their tops out of the water, like the fingers of giants
const gdPillarTops = (x, z, n, k) => { for (let i = 0; i < n; i++) { const a = gh(x, z, k + i) * TAU, r = i ? 0.9 + gh(z, x, k + i) * 1.6 : 0, px = x + Math.cos(a) * r, pz = z + Math.sin(a) * r; if (!gdWet(px, pz, 0.6)) continue;
  const B = gdB(px, pz, { y: -2.3, yaw: gh(px, pz, k + 9) * 3, lean: (gh(pz, px, k + 4) - 0.3) * 0.22, tip: gh(px, pz, k + 5) * TAU }), h = 2.3 + 0.2 + gh(px, pz, k + 6) * 1.5, cap = gh(pz, px, k + 7) < 0.45;
  gdCol(B, 0, 0, 0, h, 0.3 + gh(px, pz, k + 8) * 0.1, k + i * 7, cap); gdMoss(B, 0, 2.2, 0, 0.32); if (!cap && gh(px, pz, k + 11) < 0.5) gdMoss(B, 0, h, 0, 0.3); } };
// two great pillars leaning on each other, like tired old friends, a capstone resting on both
const gdLeanPair = (x, z, dirX, k, L = 4.8) => { const r = 0.34, th = Math.asin((1.3 - r) / L), y0 = -1.0;
  for (const s of [-1, 1]) { const B = gdB(dirX ? x + s * 1.3 : x, dirX ? z : z + s * 1.3, { y: y0, yaw: gh(x, z, k + s) * 2, lean: th, tip: dirX ? (s < 0 ? Math.PI / 2 : -Math.PI / 2) : (s < 0 ? 0 : Math.PI) });
    gdCol(B, 0, 0, 0, L, r, k + (s > 0 ? 9 : 0), true); gdMoss(B, 0, 1.2, 0, 0.35); }
  const M = gdB(x, z, { y: y0, yaw: dirX ? 0 : Math.PI / 2 }); gdBx("carve", M, 0, L * Math.cos(th) + 0.25, 0, 1.5, 0.5, 1.0, stc(M.O, k + 3)); gdBx("gold", M, 0, L * Math.cos(th) + 0.5, 0.51, 1.4, 0.07, 0.02, GDGOLD); gdMoss(M, 0.3, L * Math.cos(th) + 0.75, 0, 0.4); };
// coral heads: branching coral, a brain coral and fans, for the Coral Ruins and the lagoon
const GDCORAL = ["#ff7a6a", "#ff5a8a", "#c86ad8", "#ffb060", "#f0d8c0", "#e8506a"];
const gdCoral = (x, z, k, s = 1) => { const [ux, uz] = unwarp(x, z), B = gdB(x, z, { y: Math.max(-1.2, Math.min(-0.75, GHT(ux, uz))) }), q = gyQ({ x, z }, k), c0 = GDCORAL[Math.floor(q() * GDCORAL.length)];
  gdP("deco", B, "blob", 0, 0.15 * s, 0, 0.9 * s, 0.6 * s, 0.8 * s, GDCORAL[Math.floor(q() * GDCORAL.length)]);
  for (let i = 0; i < 5; i++) { const a = q() * TAU, l = (0.45 + q() * 0.45) * s, ex = Math.cos(a) * l * 0.5, ez = Math.sin(a) * l * 0.5, ey = 0.3 * s + l * 0.9; gdBeam("deco", B, [0, 0.2 * s, 0], [ex, ey, ez], 0.05 * s, c0, "limb"); gdP("deco", B, "sph", ex, ey, ez, 0.09 * s, 0.09 * s, 0.09 * s, c0); }
  const a = q() * TAU; gdP("deco", B, "blob", Math.cos(a) * 0.45 * s, 0.25 * s, Math.sin(a) * 0.45 * s, 0.55 * s, 0.4 * s, 0.5 * s, GDCORAL[(Math.floor(q() * 6) + 2) % GDCORAL.length]); };

// ---- the GLYPHOS tablet: carved on a great stone tablet half-sunk in the water, in letters as tall as Rook, a swirl of marks under it ----
const gdTabletTex = () => thM("gdTabletTex", () => { const W = 1024, Hh = 692, rnd = nnXR(4407), mk = () => { const c = document.createElement("canvas"); c.width = W; c.height = Hh; return c; }, cv = mk(), ev = mk(), g = cv.getContext("2d"), e = ev.getContext("2d");
  g.fillStyle = "#cbbd9b"; g.fillRect(0, 0, W, Hh); for (let i = 0; i < 900; i++) { const x = rnd() * W, y = rnd() * Hh, r = 4 + rnd() * 40; g.fillStyle = `rgba(${rnd() < 0.5 ? "120,100,70" : "236,226,200"},${0.04 + rnd() * 0.08})`; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
  for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(${rnd() < 0.5 ? "70,58,40" : "250,244,226"},${0.12 + rnd() * 0.2})`; g.fillRect(rnd() * W, rnd() * Hh, 1 + rnd() * 2, 1 + rnd() * 2); }
  // the wet foot of the tablet: darker, green weed and barnacles below the waterline (the lower 44 per cent sits under the water)
  const wl = Hh * 0.56, gr = g.createLinearGradient(0, wl - 60, 0, Hh); gr.addColorStop(0, "rgba(60,70,40,0)"); gr.addColorStop(0.25, "rgba(60,80,44,0.55)"); gr.addColorStop(1, "rgba(30,50,40,0.8)"); g.fillStyle = gr; g.fillRect(0, wl - 60, W, Hh - wl + 60);
  for (let i = 0; i < 260; i++) { const x = rnd() * W, y = wl - 20 + rnd() * (Hh - wl), r = 2 + rnd() * 5; g.fillStyle = "rgba(220,214,196,0.8)"; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.fillStyle = "rgba(60,54,44,0.8)"; g.beginPath(); g.arc(x, y, r * 0.4, 0, TAU); g.fill(); }
  e.fillStyle = "#000"; e.fillRect(0, 0, W, Hh);
  // a carved border with a gold inlay line
  for (const [ctx, col, lw] of [[g, "rgba(60,46,28,0.7)", 14], [g, GDGOLD, 5], [e, "#6a4a10", 5]]) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.strokeRect(34, 30, W - 68, wl - 20); }
  // the letters: cut into the stone (a dark inner shadow), filled with gold
  const txt = "GLYPHOS", fy = 222; g.textAlign = e.textAlign = "center"; g.textBaseline = e.textBaseline = "alphabetic"; const font = "bold 176px Georgia, 'DejaVu Serif', serif"; g.font = e.font = font;
  if (g.letterSpacing !== undefined) g.letterSpacing = e.letterSpacing = "14px";
  g.fillStyle = "rgba(40,30,18,0.9)"; g.fillText(txt, W / 2 + 7, fy + 7); g.fillStyle = "rgba(255,246,220,0.35)"; g.fillText(txt, W / 2 - 3, fy - 3);
  const lg = g.createLinearGradient(0, fy - 150, 0, fy); lg.addColorStop(0, "#fff0b0"); lg.addColorStop(0.5, "#e8b84a"); lg.addColorStop(1, "#a8761c"); g.fillStyle = lg; g.fillText(txt, W / 2, fy); e.fillStyle = "#c89a3a"; e.fillText(txt, W / 2, fy);
  // weathering over the gold: chips where the stone has gone soft
  for (let i = 0; i < 160; i++) { g.fillStyle = `rgba(${rnd() < 0.5 ? "180,164,130" : "120,100,70"},${0.3 + rnd() * 0.4})`; g.beginPath(); g.arc(80 + rnd() * (W - 160), fy - 150 + rnd() * 160, 1 + rnd() * 4, 0, TAU); g.fill(); }
  // the swirl of strange swirling marks under the name
  const sw = (ctx, cx, cy, R, dir, col, lw) => { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round"; ctx.beginPath(); for (let t = 0; t <= 1.001; t += 0.02) { const a = dir * t * 3.4 * Math.PI, r = R * (1 - t * 0.85), x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * 0.8; t ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); };
  const row = (ctx, col, lw, dx) => { for (let i = 0; i < 7; i++) { const cx = 150 + i * 121 + dx, cy = 300 + (i % 2) * 18; sw(ctx, cx, cy, 34, i % 2 ? 1 : -1, col, lw); ctx.beginPath(); ctx.moveTo(cx + 36, cy); ctx.bezierCurveTo(cx + 60, cy - 30, cx + 70, cy + 40, cx + 86, cy + (i % 2 ? -18 : 18)); ctx.stroke(); } };
  row(g, "rgba(50,38,22,0.75)", 12, 4); row(g, GDGOLD, 5, 0); row(e, "#7a5410", 5, 0);
  for (let i = 0; i < 40; i++) { const x = rnd() * W, y = rnd() * wl; g.strokeStyle = "rgba(70,56,36,0.5)"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, y); let xx = x, yy = y; for (let s = 0; s < 6; s++) { xx += (rnd() - 0.5) * 30; yy += rnd() * 18; g.lineTo(xx, yy); } g.stroke(); }
  const t = new THREE.CanvasTexture(cv), et = new THREE.CanvasTexture(ev); t.colorSpace = et.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return std({ map: t, emissive: "#ffffff", emissiveMap: et, emissiveIntensity: 0.55, roughness: 0.82 }); });
const gdTablet = (x, z, yaw) => { const [ux, uz] = unwarp(x, z), W = 7.4, Ht = 5.0, D = 1.0, yc = -0.12 - Ht * 0.44 + Ht / 2, side = FXA.gyAsh(), front = gdTabletTex();
  const m = add(new THREE.BoxGeometry(W, Ht, D), [side, side, side, side, front, side], [ux, yc, uz], [-0.05, yaw, 0.025]); m.userData.noLift = m.userData.noSeat = true;
  const B = gdB(x, z, { y: -0.12, yaw }); // weed and moss at the waterline and on the top, a fallen corner chunk, barnacled stones at its foot
  for (let i = 0; i < 4; i++) gdMoss(B, -W / 2 + 0.8 + i * 1.9, Ht * 0.56 + 0.02 - 0.12 - 0.1, 0.1, 0.4 + gh(x + i, z, 41) * 0.25); gdMoss(B, -W / 2 + 0.6, 0.05, D / 2 + 0.05, 0.4); gdMoss(B, W / 2 - 1.2, 0.0, D / 2 + 0.08, 0.45);
  gdP("stone", B, "rock", W / 2 + 0.6, 0.05, 0.6, 1.1, 0.8, 0.9, "#c8b896", 0.3, 0.6, 0.2); gdP("stone", B, "rock", -W / 2 - 0.4, -0.05, 0.9, 0.8, 0.6, 0.7, "#b8a888", 0.1, 1.2, 0.3); };

// ---- the Deep Sea Ferry, moored at the jetty: a big glass bubble held in gleaming brass ribs, brass benches with red velvet cushions,
// a little brass wheelhouse at the top with the wheel and the bell, and the sign hanging off its side ----
const gdFerrySignTex = () => thM("gdFerrySign", () => tex(512, 160, (g, w, h) => { g.fillStyle = "#1c3048"; g.fillRect(0, 0, w, h); g.strokeStyle = "#c8a050"; g.lineWidth = 8; g.strokeRect(6, 6, w - 12, h - 12);
  g.fillStyle = "#f2e6c4"; g.textAlign = "center"; g.font = "bold 52px Georgia, 'DejaVu Serif', serif"; g.fillText("DEEP SEA FERRY.", w / 2, 70); g.font = "bold 40px Georgia, 'DejaVu Serif', serif"; g.fillText("DIVES DAILY.", w / 2, 126);
  const r = nnXR(77); for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(${r() < 0.5 ? "0,0,0" : "255,255,255"},${0.05 + r() * 0.08})`; g.fillRect(r() * w, r() * h, 2, 2); } }));
const gdGlassM = () => thM("gdGlass", () => std({ color: "#dcf6f0", transparent: true, opacity: 0.2, roughness: 0.04, metalness: 0.25, depthWrite: false, side: THREE.DoubleSide }));
const gdFerryOut = (x, z, R = 2.4) => { const [ux, uz] = unwarp(x, z), yc = 1.0, B = gdB(x, z, { y: yc });
  const gm = add(new THREE.SphereGeometry(R, 28, 18), gdGlassM(), [ux, yc, uz], [0, 0, 0], "nocol"); gm.castShadow = false; gm.renderOrder = 2; gm.userData.noLift = gm.userData.noSeat = true;
  // ribs: eight meridians, the equator band and a bumper at the waterline
  for (let i = 0; i < 4; i++) gdP("brass", B, "gdRing", 0, 0, 0, R + 0.02, R + 0.02, R + 0.02, "#d8a850", 0, (i * Math.PI) / 4, 0);
  gdP("brass", B, "gdRing", 0, 0, 0, R + 0.06, R + 0.06, 2.2, "#e0b458", Math.PI / 2, 0, 0); for (const y of [-0.85, 0.75]) { const rr = Math.sqrt(R * R - y * y); gdP("brass", B, "gdRing", 0, y, 0, rr + 0.03, rr + 0.03, rr + 0.03, "#c89a44", Math.PI / 2, 0, 0); }
  gdP("brass", B, "cyl", 0, R + 0.05, 0, 0.5, 0.12, 0.5, "#d8a850"); gdP("brass", B, "dome", 0, R + 0.1, 0, 0.36, 0.25, 0.36, "#e0b458"); gdP("glow", B, "ico0", 0, R + 0.42, 0, 0.12, 0.12, 0.12, "#ffe8a0");
  // the deck, benches round the edge, the wheelhouse step, wheel and bell
  gdP("plank", B, "cyl", 0, -0.72, 0, R * 1.8, 0.12, R * 1.8, "#c89a6a"); for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU + 0.3, bx = Math.cos(a) * R * 0.72, bz = Math.sin(a) * R * 0.72;
    gdP("brass", B, "box", bx, -0.45, bz, 0.9, 0.42, 0.36, "#c89a44", 0, -a + Math.PI / 2, 0); gdP("deco", B, "box", bx, -0.2, bz, 0.86, 0.1, 0.34, "#a8182a", 0, -a + Math.PI / 2, 0); }
  gdP("brass", B, "cyl", 0, 0.9, -0.6, 1.2, 0.08, 1.0, "#c89a44"); gdP("brass", B, "gdRing", 0, 1.38, -0.62, 0.34, 0.34, 0.34, "#e0b458", 0, 0, 0); for (let i = 0; i < 4; i++) gdP("brass", B, "box", 0, 1.38, -0.62, 0.66, 0.03, 0.03, "#e0b458", 0, 0, (i * Math.PI) / 4);
  gdP("brass", B, "cyl", 0, 1.1, -0.58, 0.06, 0.5, 0.06, "#c89a44"); gdP("brass", B, "cone", 0.5, 1.5, -0.5, 0.22, 0.24, 0.22, "#e8c060"); gdP("brass", B, "box", 0.5, 1.66, -0.5, 0.03, 0.12, 0.03, "#c89a44");
  // the sign, hanging off the side toward the shore and the jetty, and the mooring ropes to the jetty edge
  const sa = Math.atan2(0.8, -0.6), sx = Math.sin(sa) * (R + 0.08), sz = Math.cos(sa) * (R + 0.08), [px, , pz] = gdW(B, sx, 0, sz);
  const sm = add(new THREE.PlaneGeometry(1.5, 0.47), std({ map: gdFerrySignTex(), roughness: 0.7 }), [ux + px, yc - 0.42, uz + pz], [0, sa, 0], "nocol"); sm.userData.noLift = sm.userData.noSeat = true;
  gdP("plank", B, "box", sx - Math.sin(sa) * 0.03, -0.42, sz - Math.cos(sa) * 0.03, 1.6, 0.55, 0.05, "#7a5a3a", 0, sa, 0); for (const s of [-0.6, 0.6]) gdBeam("brass", B, [sx + Math.cos(sa) * s, -0.15, sz - Math.sin(sa) * s], [sx * 0.97 + Math.cos(sa) * s * 0.8, 0.02, sz * 0.97 - Math.sin(sa) * s * 0.8], 0.012, "#8a6a3a", "cyl6");
  for (const dz of [-1.2, 1.2]) gdBeam("deco", B, [R * 0.9, 0.1, dz * 0.6], [R + 0.85, -0.6, dz], 0.025, "#c8b080", "cyl6");
  gdP("plank", B, "box", R + 0.45, -0.68, 0, 1.2, 0.08, 0.9, "#a87a4a", 0, 0, -0.12); };

// ---- archaeologists' work spots: a kneeling mat, a string grid pegged out, brushes, a notebook, a magnifying glass, a trowel ----
const gdWork = (x, z, yaw = 0, dy = 0) => { const B = gdB(x, z, { yaw, dy });
  gdBx("deco", B, 0, 0.005, 0.45, 0.85, 0.025, 0.55, "#a8885a"); gdBx("deco", B, 0.3, 0.03, 0.55, 0.24, 0.03, 0.32, "#efe6cc"); gdBx("deco", B, 0.3, 0.06, 0.55, 0.012, 0.012, 0.28, "#e8b030", 0.3);
  for (const [a, b] of [[-0.55, -0.95], [0.55, -0.95], [-0.55, 0.05], [0.55, 0.05]]) gdP("deco", B, "cyl6", a, 0.1, b, 0.04, 0.24, 0.04, "#c8a070");
  for (const zz of [-0.95, -0.45, 0.05]) gdBx("deco", B, 0, 0.17, zz, 1.1, 0.012, 0.012, "#f4ecd8"); for (const xx of [-0.55, 0, 0.55]) gdBx("deco", B, xx, 0.17, -0.45, 0.012, 0.012, 1.0, "#f4ecd8");
  gdBx("deco", B, -0.35, 0.02, 0.3, 0.03, 0.03, 0.26, "#7a5232", 0.5); gdBx("deco", B, -0.38, 0.02, 0.17, 0.06, 0.04, 0.07, "#3a2a1a", 0.5); gdBx("deco", B, -0.1, 0.02, 0.25, 0.022, 0.022, 0.2, "#c8a070", -0.4);
  gdP("brass", B, "ring", 0.05, 0.03, 0.75, 0.18, 0.4, 0.18, "#d8b060"); gdBx("deco", B, 0.15, 0.015, 0.84, 0.03, 0.025, 0.14, "#3a2a1a", 0.8);
  gdBx("deco", B, -0.3, 0.012, -0.3, 0.12, 0.012, 0.18, "#8a8a86", 0.3); gdBx("deco", B, -0.33, 0.02, -0.18, 0.03, 0.03, 0.12, "#6a4a2a", 0.3); gdP("brass", B, "cyl", 0.62, 0.11, 0.55, 0.22, 0.22, 0.22, "#a8a49a"); };

// ---- Dig Camp: lanterns hanging from poles, more tables covered in maps, notebooks and tools ----
const gdLampPole = (x, z, yaw) => { const B = gdB(x, z, { yaw }); gdP("wood", B, "cyl", 0, 1.5, 0, 0.13, 3.0, 0.13, "#7a5a3a"); gdP("wood", B, "box", 0.36, 2.86, 0, 0.82, 0.07, 0.07, "#6a4a2a"); gdBeam("wood", B, [0, 2.5, 0], [0.5, 2.84, 0], 0.03, "#6a4a2a", "cyl6");
  gdP("brass", B, "box", 0.7, 2.66, 0, 0.012, 0.36, 0.012, "#8a6a3a"); gdP("brass", B, "pyr", 0.7, 2.44, 0, 0.28, 0.12, 0.28, "#b08840", 0, Math.PI / 4, 0); gdP("glow", B, "box", 0.7, 2.24, 0, 0.15, 0.24, 0.15, "#ffd68a");
  for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) gdP("brass", B, "box", 0.7 + a * 0.09, 2.24, b * 0.09, 0.02, 0.27, 0.02, "#8a6a3a"); gdP("brass", B, "box", 0.7, 2.1, 0, 0.22, 0.03, 0.22, "#8a6a3a"); };
const gdTableKit = (x, z, yaw) => { const O = { x, z, ry: yaw }; gyTable(O); const B = gdB(x, z, { yaw, dy: 0.8 });
  gdBx("deco", B, -0.45, 0, 0.2, 0.22, 0.04, 0.3, "#efe6cc", 0.2); gdBx("deco", B, -0.42, 0.04, 0.2, 0.2, 0.03, 0.28, "#3a6a8a", 0.25); gdP("brass", B, "ring", 0.5, 0.02, -0.2, 0.2, 0.4, 0.2, "#d8b060"); gdBx("deco", B, 0.62, 0, -0.1, 0.03, 0.025, 0.16, "#3a2a1a", 0.9);
  gdP("deco", B, "cyl6", 0.55, 0.08, 0.25, 0.09, 0.16, 0.09, "#8a6a4a"); for (let i = 0; i < 3; i++) gdP("deco", B, "box", 0.53 + i * 0.02, 0.2, 0.25, 0.012, 0.14, 0.012, ["#e8b030", "#3a6a8a", "#c83a3a"][i], 0.1 * (i - 1), 0, 0.15 * (i - 1)); };

// ---- the Temple of Voices front ----
// a mountain made of steps: wide stairs, each one carved and gilded, climbing to the dark doorway at the top; the whole front covered in gold;
// two columns carved like the trunks of trees with stone branches across the top; the small clear crystal in the wall beside the door
const gdGoldTex = () => thM("gdGoldTex", () => { const W = 1024, Hh = 512, mk = () => { const c = document.createElement("canvas"); c.width = W; c.height = Hh; return c; }, cv = mk(), g = cv.getContext("2d"), rnd = nnXR(5150);
  g.clearRect(0, 0, W, Hh); g.lineCap = g.lineJoin = "round";
  const stroke = (path, lw) => { for (const [col, w] of [["rgba(70,50,12,0.95)", lw + 7], ["#d8b040", lw + 2], ["#fff0a8", lw - 3]]) { g.strokeStyle = col; g.lineWidth = Math.max(1, w); g.beginPath(); path(); g.stroke(); } };
  const spiral = (cx, cy, R, dir) => () => { for (let t = 0; t <= 1.001; t += 0.015) { const a = dir * t * 3.6 * Math.PI, r = R * (1 - t * 0.88), x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; t ? g.lineTo(x, y) : g.moveTo(x, y); } };
  // meander bands top and bottom
  for (const y0 of [18, Hh - 58]) stroke(() => { let x = 0; g.moveTo(0, y0 + 20); while (x < W) { g.lineTo(x, y0); g.lineTo(x + 32, y0); g.lineTo(x + 32, y0 + 28); g.lineTo(x + 14, y0 + 28); g.lineTo(x + 14, y0 + 12); g.lineTo(x + 22, y0 + 12); x += 32; g.moveTo(x, y0 + 40); g.lineTo(x, y0); } }, 7);
  // big linked spirals with S-curves between them, smaller spirals and dots in the gaps
  for (let i = 0; i < 4; i++) { const cx = 128 + i * 256, cy = 256 + (i % 2 ? 40 : -40), dir = i % 2 ? 1 : -1; stroke(spiral(cx, cy, 92, dir), 12);
    stroke(() => { g.moveTo(cx + 92, cy); g.bezierCurveTo(cx + 150, cy + dir * 110, cx + 110, cy - dir * 150, cx + 164, cy - dir * 70); }, 9);
    stroke(spiral(cx + 128, cy + (i % 2 ? -150 : 150) * 0.85, 34, -dir), 7); stroke(spiral(cx - 70, cy + (i % 2 ? 130 : -130), 26, dir), 6); }
  for (let i = 0; i < 70; i++) { const x = rnd() * W, y = 70 + rnd() * (Hh - 140); g.fillStyle = "#ffe68a"; g.beginPath(); g.arc(x, y, 3 + rnd() * 4, 0, TAU); g.fill(); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
  return std({ map: t, transparent: true, alphaTest: 0.35, metalness: 0.4, roughness: 0.3, emissive: "#ffe9a0", emissiveMap: t, emissiveIntensity: 0.22, polygonOffset: true, polygonOffsetFactor: -2 }); });
// one mesh of gold panels: each panel is [cx, y0, y1, x0, x1, z] in the pyramid's frame; the pattern repeats every 4 m by 2 m
const gdGoldPanels = (ux, by, uz, panels) => { const P = [], N = [], U = []; for (const [x0, x1, y0, y1, z] of panels) { const q = [[x0, y0], [x1, y0], [x1, y1], [x0, y0], [x1, y1], [x0, y1]]; for (const [x, y] of q) { P.push(ux + x, by + y, uz + z); N.push(0, 0, 1); U.push(x / 4, y / 2); } }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(P, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(N, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(U, 2));
  const m = add(g, gdGoldTex(), [0, 0, 0], [0, 0, 0], "nocol"); m.castShadow = false; m.userData.noLift = m.userData.noSeat = true; return m; };
// a flight of steps against a face: n steps from (x, y0, zFront) up to (y1, zBack), each step carved, its edge gilded
const gdFlight = (O, x, w, y0, y1, zF, zB, n = 12) => { const rise = (y1 - y0) / n, run = (zF - zB) / n;
  for (let j = 0; j < n; j++) { const zf = zF - j * run, top = y0 + rise * (j + 1), dep = zf - zB; nnBx("carve", O, x, y0 - 0.3, zB + dep / 2, w, top - y0 + 0.3, dep, stc(O, 120 + j)); nnBx("gold", O, x, top - 0.07, zf + 0.012, w - 0.06, 0.06, 0.03, GDGOLD); } };
// a flight that climbs sideways along a face (from x0 at the ground to x1 at y1), d deep from the face at zFace
const gdSideFlight = (O, x0, x1, y0, y1, zFace, d, n = 12) => { const rise = (y1 - y0) / n, run = (x1 - x0) / n;
  for (let j = 0; j < n; j++) { const xc = x0 + run * (j + 0.5), top = y0 + rise * (j + 1); nnBx("carve", O, xc, y0 - 0.4, zFace + d / 2, Math.abs(run) + 0.01, top - y0 + 0.4, d, stc(O, 140 + j)); nnBx("gold", O, xc, top - 0.07, zFace + d + 0.012, Math.abs(run) - 0.02, 0.06, 0.03, GDGOLD); }
  nnBx("carve", O, x1 + Math.sign(run) * 0.6, y1 - 0.5, zFace + d / 2, 1.2, 0.5, d, stc(O, 160)); };
// a stone guardian giant: a calm crowned face, gold eyes, a gold breastplate, a staff with a gold glyph disc
const gdGiant = (O, x, z, y0, s = 1) => { const c = stc(O, 90 + (s > 0)), c2 = stc(O, 92), c3 = "#e6dac2";
  nnBx("stone", O, x, y0, z, 2.0, 0.4, 1.6, c); for (const k of [-1, 1]) { nnBx("stone", O, x + k * 0.38, y0 + 0.4, z + 0.12, 0.5, 0.32, 0.82, c2); nnBx("stone", O, x + k * 0.38, y0 + 0.72, z, 0.46, 1.5, 0.5, c3); }
  nnBx("carve", O, x, y0 + 2.0, z, 1.26, 0.78, 0.64, c2); nnBx("gold", O, x, y0 + 2.66, z + 0.33, 1.28, 0.08, 0.02, GDGOLD); nnBx("stone", O, x, y0 + 2.7, z, 1.3, 1.25, 0.66, c3);
  nnP("stone", O, "sph", x, y0 + 3.86, z, 1.75, 0.55, 0.78, c3); nnBx("gold", O, x, y0 + 2.95, z + 0.34, 0.72, 0.6, 0.02, GDGOLD); nnP("glow", O, "box", x, y0 + 3.25, z + 0.36, 0.34, 0.05, 0.02, GYC.turq);
  nnP("stone", O, "box", x + s * 0.84, y0 + 3.05, z, 0.36, 1.5, 0.4, c3, 0, 0, s * 0.07); nnP("stone", O, "box", x - s * 0.8, y0 + 3.5, z + 0.32, 0.34, 0.95, 0.38, c3, -1.0, 0, 0); nnP("stone", O, "sph", x - s * 0.8, y0 + 3.2, z + 0.72, 0.36, 0.32, 0.36, c3);
  nnCy("stone", O, x - s * 0.8, y0 + 0.4, z + 0.74, 0.07, 4.8, "#cbbd9e", "cyl8"); nnP("gold", O, "cyl", x - s * 0.8, y0 + 5.3, z + 0.74, 0.6, 0.06, 0.6, GDGOLD, Math.PI / 2, 0, 0); nnP("glow", O, "box", x - s * 0.8, y0 + 5.3, z + 0.78, 0.3, 0.04, 0.02, GYC.turq);
  nnBx("stone", O, x, y0 + 4.08, z, 0.36, 0.3, 0.36, c3); nnP("stone", O, "blob", x, y0 + 4.66, z, 0.74, 0.86, 0.74, c3); nnBx("stone", O, x, y0 + 4.82, z + 0.31, 0.6, 0.08, 0.12, "#c8bca8");
  for (const k of [-1, 1]) nnP("glow", O, "sph", x + k * 0.15, y0 + 4.7, z + 0.35, 0.11, 0.07, 0.04, GYC.gold); nnBx("stone", O, x, y0 + 4.42, z + 0.33, 0.12, 0.22, 0.1, c3); nnBx("stone", O, x, y0 + 4.34, z + 0.3, 0.26, 0.04, 0.06, "#c8bca8");
  for (let i = 0; i < 3; i++) nnBx("carve", O, x, y0 + 5.02 + i * 0.18, z, 0.8 - i * 0.18, 0.18, 0.72 - i * 0.16, c2); nnSp("glow", O, x, y0 + 5.62, z, 0.08, GYC.gold); gyMoss(O, x + s * 0.55, y0 + 4.05, z, 0.3); gyMoss(O, x, y0 + 0.4, z + 0.6, 0.35); };
const gdVoicesFront = (X, Y) => { const O = gyO(X, Y, 15, 11), [ux, uz] = unwarp(O.x, O.z), by = Math.max(GHT(ux, uz), -9), hh = 4.8;
  // the stairs: up the first terrace from both sides, two flights up the second face either side of the carved face, one up the third to the door
  for (const s of [-1, 1]) { gdSideFlight(O, s * 11, s * 5.4, 0, hh, 10, 0.9); gdFlight(O, s * 4.2, 2.4, hh, 2 * hh, 10, 8); }
  gdFlight(O, 0, 3.0, 2 * hh, 3 * hh, 8, 6); nnBx("carve", O, 0, 3 * hh, 5.45, 2.6, 0.4, 0.9, stc(O, 170)); nnBx("gold", O, 0, 3 * hh + 0.33, 5.91, 2.5, 0.06, 0.03, GDGOLD);
  // gold over every face: tier fronts at z = 10, 8, 6, 5 (the ground door and the top door left open)
  gdGoldPanels(ux, by, uz, [[-11, -2.9, 0, 4.35, 10.035], [2.9, 11, 0, 4.35, 10.035], [-9, 9, hh, 2 * hh - 0.45, 8.035], [-7, 7, 2 * hh, 3 * hh - 0.45, 6.035],
    [-6, -1.25, 3 * hh, 3 * hh + 4.75, 5.035], [1.25, 6, 3 * hh, 3 * hh + 4.75, 5.035], [-1.25, 1.25, 3 * hh + 3.55, 3 * hh + 4.75, 5.035]]);
  // the two columns carved like tree trunks: a tapering trunk over each tall column, root flares, stone branches spreading across the top, stone leaves
  const tc = "#dccfae", T0 = 3 * hh, T1 = 3 * hh + 4.85, B0 = T1 - 1.5; // the branches stay under the eaves of the shrine roof
  for (const s of [-1, 1]) { const x = s * 1.7, z = 5.4; nnP("carve", O, "limb", x, (T0 + T1) / 2, z, 0.98, T1 - T0, 0.98, tc);
    for (let i = 0; i < 4; i++) { const a = (i / 4) * TAU + 0.4; nnXBeam("carve", O, [x + Math.cos(a) * 0.25, T0 + 0.55, z + Math.sin(a) * 0.25], [x + Math.cos(a) * 0.85, T0 + 0.04, z + Math.sin(a) * 0.7], 0.15, tc, "limb"); }
    const br = [[[x, B0, z + 0.3], [s * 0.3, T1 - 0.25, z + 0.45], 0.16], [[x, B0 + 0.1, z + 0.3], [s * 3.8, T1 - 0.35, z + 0.4], 0.16], [[s * 3.8, T1 - 0.35, z + 0.4], [s * 5.2, T1 - 0.05, z + 0.45], 0.09],
      [[s * 2.5, T1 - 0.75, z + 0.4], [s * 2.9, T1 - 0.1, z + 0.5], 0.08], [[s * 1.0, B0 + 0.55, z + 0.4], [s * 1.05, T1 - 0.1, z + 0.55], 0.07], [[s * 4.6, T1 - 0.2, z + 0.45], [s * 4.9, T1 - 1.0, z + 0.5], 0.06]];
    for (const [a, b, r] of br) nnXBeam("carve", O, a, b, r, tc, "limb");
    for (const [lx, ly, lz, r] of [[s * 0.35, T1 - 0.15, z + 0.55, 0.32], [s * 5.2, T1 - 0.1, z + 0.55, 0.36], [s * 2.9, T1 - 0.05, z + 0.6, 0.3], [s * 1.05, T1 - 0.05, z + 0.62, 0.28], [s * 4.9, T1 - 1.05, z + 0.55, 0.26], [s * 3.8, T1 - 0.3, z + 0.55, 0.3]]) { nnP("carve", O, "blob", lx, ly, lz, r * 1.7, r, r * 1.1, "#d2c5a2"); nnP("gold", O, "oct", lx + 0.15, ly + r * 0.2, lz + r * 0.6, 0.12, 0.2, 0.06, GDGOLD2); } }
  // Liss's crystal: small, clear as water, old and dusty, set into the wall beside the door
  nnBx("carve", O, 2.75, T0 + 1.45, 5.0, 0.52, 0.62, 0.14, "#d8ccb0"); nnP("glow", O, "oct", 2.75, T0 + 1.76, 5.1, 0.18, 0.3, 0.12, "#eef8ff"); nnP("glow", O, "box", 2.75, T0 + 1.76, 5.08, 0.34, 0.42, 0.01, "#7a8a90");
  // the stone guardians on the first terrace, either side of the stairs
  for (const s of [-1, 1]) gdGiant(O, s * 7.6, 9.0, hh, s); };

// ---- the Ancient Obelisk at the Mural Overlook: a towering black monolith carved with glowing glyphs; around it the murals of the shadow
// devouring the planet under the red sun, and of the Seedmother sending her glowing seedpods out into space ----
const gdObTex = () => thM("gdObTex", () => { const W = 1024, Hh = 1536, mk = () => { const c = document.createElement("canvas"); c.width = W; c.height = Hh; return c; }, cv = mk(), ev = mk(), g = cv.getContext("2d"), e = ev.getContext("2d"), rnd = nnXR(6060);
  g.fillStyle = "#16161c"; g.fillRect(0, 0, W, Hh); for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(${rnd() < 0.6 ? "40,44,56" : "8,8,10"},${0.25 + rnd() * 0.35})`; g.beginPath(); g.arc(rnd() * W, rnd() * Hh, 3 + rnd() * 26, 0, TAU); g.fill(); }
  for (let i = 0; i < 60; i++) { g.strokeStyle = `rgba(${rnd() < 0.5 ? "60,90,90" : "90,84,70"},0.35)`; g.lineWidth = 1 + rnd() * 2; g.beginPath(); let x = rnd() * W, y = rnd() * Hh; g.moveTo(x, y); for (let s = 0; s < 10; s++) { x += (rnd() - 0.5) * 50; y += 10 + rnd() * 40; g.lineTo(x, y); } g.stroke(); }
  e.fillStyle = "#000"; e.fillRect(0, 0, W, Hh);
  // four faces of 256 px; each a column of carved glyph cells, the grooves pale, the cuts filled with light
  for (let f = 0; f < 4; f++) for (let i = 0; i < 10; i++) { const cx = f * 256 + 128, cy = 110 + i * 136, col = (i + f) % 3 ? "#5af0e0" : "#ffcf4a", k = Math.floor(rnd() * 5), s = 46;
    for (const [ctx, c, w] of [[g, "rgba(150,150,140,0.55)", 14], [g, "rgba(10,10,12,0.9)", 8], [e, col, 7]]) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.beginPath();
      if (k === 0) { ctx.rect(cx - s, cy - s * 0.8, s * 2, s * 1.6); ctx.moveTo(cx - s * 0.5, cy); ctx.lineTo(cx + s * 0.5, cy); }
      else if (k === 1) { for (let t = 0; t <= 1.001; t += 0.04) { const a = t * 3.2 * Math.PI, r = s * (1 - t * 0.85); t ? ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r) : ctx.moveTo(cx + r, cy); } }
      else if (k === 2) { let x = cx - s, y = cy + s * 0.4; ctx.moveTo(x, y); for (let q = 0; q < 3; q++) { ctx.lineTo(x, y - s * 0.8); x += s / 3; ctx.lineTo(x, y - s * 0.8); ctx.lineTo(x, y); x += s / 3; ctx.lineTo(x, y); } }
      else if (k === 3) { ctx.arc(cx, cy, s * 0.8, 0, TAU); ctx.moveTo(cx + s * 0.3, cy); ctx.arc(cx, cy, s * 0.3, 0, TAU); }
      else { ctx.moveTo(cx, cy - s); ctx.lineTo(cx, cy + s); ctx.moveTo(cx - s * 0.7, cy - s * 0.4); ctx.lineTo(cx + s * 0.7, cy - s * 0.4); ctx.moveTo(cx - s * 0.5, cy + s * 0.5); ctx.lineTo(cx + s * 0.2, cy + s * 0.5); }
      ctx.stroke(); }
    e.fillStyle = col; e.beginPath(); e.arc(cx + s * 0.75, cy + s * 0.65, 6, 0, TAU); e.fill(); }
  const t = new THREE.CanvasTexture(cv), et = new THREE.CanvasTexture(ev); t.colorSpace = et.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return std({ map: t, emissive: "#ffffff", emissiveMap: et, emissiveIntensity: 1.0, roughness: 0.3, metalness: 0.12 }); });
const gdObelisk = (x, z) => { const B = gdB(x, z), [ux, uz] = [B.ux, B.uz], y0 = B.O.y, H = 6.6;
  for (let i = 0; i < 3; i++) gdBx("stone", B, 0, i * 0.3, 0, 2.7 - i * 0.45, 0.3, 2.7 - i * 0.45, stc(B.O, 200 + i)); for (const s of [-1, 1]) { gdBx("gold", B, 0, 0.84, s * 0.91, 1.8, 0.05, 0.02, GDGOLD); gdBx("gold", B, s * 0.91, 0.84, 0, 0.02, 0.05, 1.8, GDGOLD); }
  const g = new THREE.CylinderGeometry(0.42 * Math.SQRT2, 0.62 * Math.SQRT2, H, 4, 1, true); const m = add(g, gdObTex(), [ux, y0 + 0.9 + H / 2, uz], [0, Math.PI / 4, 0]); m.userData.noLift = m.userData.noSeat = true;
  gdP("obsid", B, "pyr", 0, 0.9 + H + 0.45, 0, 0.84 * Math.SQRT2, 0.9, 0.84 * Math.SQRT2, "#1a1a20", 0, Math.PI / 4, 0); gdP("gold", B, "pyr", 0, 0.9 + H + 0.82, 0, 0.3, 0.2, 0.3, GDGOLD, 0, Math.PI / 4, 0);
  gdP("glow", B, "ring", 0, 0.92, 0, 2.2, 0.4, 2.2, "#5af0e0"); gdMoss(B, -1.1, 0.35, 0.9, 0.35); gdMoss(B, 1.0, 0.1, -1.1, 0.4); };
// a mural canvas: weathered plaster, a painted turquoise and gold border, the picture, cracks and flaking
const gdMuralTex = (key, W, Hh, paint) => thM("gdMural" + key, () => { const c = document.createElement("canvas"); c.width = W; c.height = Hh; const g = c.getContext("2d"), rnd = nnXR(7000 + key.length * 13);
  g.fillStyle = "#d6c29a"; g.fillRect(0, 0, W, Hh); for (let i = 0; i < 600; i++) { g.fillStyle = `rgba(${rnd() < 0.5 ? "150,120,80" : "240,228,200"},${0.05 + rnd() * 0.08})`; g.beginPath(); g.arc(rnd() * W, rnd() * Hh, 4 + rnd() * 34, 0, TAU); g.fill(); }
  g.save(); g.beginPath(); g.rect(30, 30, W - 60, Hh - 60); g.clip(); paint(g, W, Hh, rnd); g.restore();
  for (const [col, lw, i] of [["#2f8a84", 18, 15], ["#e0b04a", 6, 30]]) { g.strokeStyle = col; g.lineWidth = lw; g.strokeRect(i, i, W - 2 * i, Hh - 2 * i); }
  for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(214,194,154,${0.5 + rnd() * 0.4})`; g.beginPath(); const x = rnd() * W, y = rnd() * Hh; g.ellipse(x, y, 6 + rnd() * 40, 4 + rnd() * 24, rnd() * 3, 0, TAU); g.fill(); }
  for (let i = 0; i < 24; i++) { g.strokeStyle = "rgba(60,44,28,0.55)"; g.lineWidth = 1 + rnd() * 1.5; g.beginPath(); let x = rnd() * W, y = rnd() * Hh; g.moveTo(x, y); for (let s = 0; s < 8; s++) { x += (rnd() - 0.5) * 60; y += (rnd() - 0.3) * 40; g.lineTo(x, y); } g.stroke(); }
  g.fillStyle = "rgba(240,230,210,0.12)"; g.fillRect(0, 0, W, Hh); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return std({ map: t, roughness: 0.92, emissive: "#ffffff", emissiveMap: t, emissiveIntensity: 0.12, polygonOffset: true, polygonOffsetFactor: -2 }); });
const gdSky = (g, W, Hh, rnd, y1) => { const sk = g.createLinearGradient(0, 0, 0, y1); sk.addColorStop(0, "#1a1c3a"); sk.addColorStop(1, "#3a3a6a"); g.fillStyle = sk; g.fillRect(0, 0, W, y1); };
const gdCrystalWorld = (g, cx, cy, R, rnd) => { const pg = g.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R); pg.addColorStop(0, "#7ad8e8"); pg.addColorStop(0.7, "#2a7aa0"); pg.addColorStop(1, "#16405a"); g.fillStyle = pg; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.fill();
  g.save(); g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.clip(); for (let i = 0; i < 60; i++) { const a = rnd() * TAU, r = rnd() * R * 0.95, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r, h = 8 + rnd() * 22; g.fillStyle = rnd() < 0.5 ? "rgba(230,250,255,0.85)" : "rgba(170,230,250,0.8)"; g.beginPath(); g.moveTo(x, y - h); g.lineTo(x + 3, y); g.lineTo(x - 3, y); g.fill(); }
  g.strokeStyle = "rgba(200,245,255,0.6)"; g.lineWidth = 3; g.beginPath(); g.moveTo(cx - R, cy + R * 0.2); g.bezierCurveTo(cx - R * 0.3, cy - R * 0.1, cx + R * 0.2, cy + R * 0.5, cx + R, cy + R * 0.1); g.stroke(); g.restore(); };
const gdShadowMural = (g, W, Hh, rnd) => { gdSky(g, W, Hh, rnd, Hh); for (let i = 0; i < 160; i++) { const x = rnd() * W * 0.7, y = rnd() * Hh; g.fillStyle = `rgba(255,250,230,${0.4 + rnd() * 0.5})`; g.fillRect(x, y, 2 + rnd() * 2, 2 + rnd() * 2); }
  const sx = W * 0.2, sy = Hh * 0.3, sr = Hh * 0.2, sg = g.createRadialGradient(sx, sy, 2, sx, sy, sr * 1.8); sg.addColorStop(0, "#ffb070"); sg.addColorStop(0.45, "#e0502a"); sg.addColorStop(0.56, "rgba(170,40,20,0.5)"); sg.addColorStop(1, "rgba(120,30,20,0)"); g.fillStyle = sg; g.beginPath(); g.arc(sx, sy, sr * 1.8, 0, TAU); g.fill();
  gdCrystalWorld(g, W * 0.38, Hh * 0.62, Hh * 0.26, rnd);
  // the shadow: no shape, no edges, spreading like ink through water from the right, already touching the edge of the red sun
  for (let i = 0; i < 260; i++) { const t = rnd(), x = W * (1.05 - t * 0.72) + (rnd() - 0.5) * 120, y = Hh * (0.15 + rnd() * 0.75) - t * 40, r = 20 + rnd() * 70 * (1 - t * 0.6); g.fillStyle = `rgba(6,4,10,${0.25 + (1 - t) * 0.5})`; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
  g.strokeStyle = "rgba(6,4,10,0.75)"; g.lineCap = "round"; for (let i = 0; i < 16; i++) { let x = W * (0.55 + rnd() * 0.2), y = Hh * (0.1 + rnd() * 0.8); g.lineWidth = 4 + rnd() * 10; g.beginPath(); g.moveTo(x, y); for (let s = 0; s < 8; s++) { x -= 12 + rnd() * 26; y += (rnd() - 0.5) * 40; g.lineTo(x, y); } g.stroke(); }
  g.strokeStyle = "rgba(6,4,10,0.6)"; g.lineWidth = 10; g.beginPath(); g.moveTo(W * 0.55, Hh * 0.3); g.bezierCurveTo(W * 0.42, Hh * 0.18, W * 0.34, Hh * 0.36, sx + sr * 0.9, sy); g.stroke(); };
const gdSeedMural = (g, W, Hh, rnd) => { gdSky(g, W, Hh, rnd, Hh * 0.75); for (let i = 0; i < 120; i++) { g.fillStyle = `rgba(255,250,230,${0.4 + rnd() * 0.5})`; g.fillRect(rnd() * W, rnd() * Hh * 0.6, 2, 2); }
  const gr = g.createLinearGradient(0, Hh * 0.72, 0, Hh); gr.addColorStop(0, "#3a8ab0"); gr.addColorStop(1, "#1a4a6a"); g.fillStyle = gr; g.fillRect(0, Hh * 0.72, W, Hh * 0.28);
  for (let i = 0; i < 40; i++) { const x = rnd() * W, y = Hh * 0.74 + rnd() * Hh * 0.2, h = 18 + rnd() * 40; g.fillStyle = "rgba(220,248,255,0.8)"; g.beginPath(); g.moveTo(x, y - h); g.lineTo(x + 4, y); g.lineTo(x - 4, y); g.fill(); }
  // the Seedmother: a great tree, her trunk silver bark, roots down into the world, branches out wide, crystal leaves in every colour, her face in the trunk
  const cx = W / 2, ty = Hh * 0.82, tg = g.createLinearGradient(cx - 50, 0, cx + 50, 0); tg.addColorStop(0, "#9aa4b0"); tg.addColorStop(0.5, "#eef2f6"); tg.addColorStop(1, "#8a94a0"); g.fillStyle = tg; g.beginPath(); g.moveTo(cx - 60, ty); g.bezierCurveTo(cx - 40, Hh * 0.6, cx - 36, Hh * 0.4, cx - 30, Hh * 0.28); g.lineTo(cx + 30, Hh * 0.28); g.bezierCurveTo(cx + 36, Hh * 0.4, cx + 40, Hh * 0.6, cx + 60, ty); g.fill();
  g.strokeStyle = "#c8d0d8"; g.lineCap = "round"; for (let i = 0; i < 7; i++) { const a = (i / 6) * Math.PI, ex = cx + Math.cos(a) * 160, ey = ty + 24 + Math.sin(a) * 30; g.lineWidth = 12 - i % 3 * 3; g.beginPath(); g.moveTo(cx, ty - 10); g.quadraticCurveTo((cx + ex) / 2, ty + 10, ex, ey); g.stroke(); }
  const brs = []; for (let i = 0; i < 9; i++) { const a = Math.PI + (i / 8) * Math.PI, L = 160 + rnd() * 120, ex = cx + Math.cos(a) * L * 1.4, ey = Hh * 0.28 + Math.sin(a) * L * 0.6; brs.push([ex, ey]); g.lineWidth = 14 - Math.abs(i - 4) * 2; g.strokeStyle = "#d8dee6"; g.beginPath(); g.moveTo(cx, Hh * 0.32); g.quadraticCurveTo((cx + ex) / 2, Hh * 0.3 + (ey - Hh * 0.3) * 0.2, ex, ey); g.stroke(); }
  for (const [bx, by] of brs) for (let k = 0; k < 14; k++) { const x = bx + (rnd() - 0.5) * 90, y = by + (rnd() - 0.5) * 50; g.fillStyle = `hsla(${rnd() * 360},80%,70%,0.85)`; g.beginPath(); g.moveTo(x, y - 7); g.lineTo(x + 5, y); g.lineTo(x, y + 7); g.lineTo(x - 5, y); g.fill(); }
  // her face: gentle, eyes closed, the sad brave goodbye smile
  g.strokeStyle = "#5a6470"; g.lineWidth = 3; const fy = Hh * 0.5; for (const s of [-1, 1]) { g.beginPath(); g.arc(cx + s * 14, fy, 9, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke(); } g.beginPath(); g.arc(cx, fy + 18, 12, 0.2 * Math.PI, 0.8 * Math.PI); g.stroke();
  // the seedpods: gold, violet and green, lifted from every branch up and away into the stars, like sparks rising from a fire
  for (let i = 0; i < 70; i++) { const [bx, by] = brs[Math.floor(rnd() * brs.length)], t = rnd(), x = bx + (rnd() - 0.5) * 100 + (bx - cx) * t * 0.3, y = by - t * (by - 20), r = 4 + rnd() * 7, col = ["#ffd24a", "#b07aff", "#7aff9a"][i % 3];
    const pg = g.createRadialGradient(x, y, 0, x, y, r * 2.6); pg.addColorStop(0, col); pg.addColorStop(0.4, col); pg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = pg; g.beginPath(); g.arc(x, y, r * 2.6, 0, TAU); g.fill();
    g.strokeStyle = "rgba(255,240,200,0.35)"; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y + r); g.lineTo(x - (bx - cx) * 0.03, y + r + 22); g.stroke(); }
  // the Alienmon gathered round her roots, looking up
  for (let i = 0; i < 18; i++) { const x = cx + (i < 9 ? -1 : 1) * (90 + rnd() * 300), y = Hh * 0.86 + rnd() * Hh * 0.08, r = 8 + rnd() * 10; g.fillStyle = ["#e86a4a", "#4ac8a0", "#c87ae8", "#f0c040", "#5aa0f0"][i % 5]; g.beginPath(); g.ellipse(x, y, r * 1.1, r, 0, 0, TAU); g.fill(); g.fillStyle = "#1a1a22"; g.beginPath(); g.arc(x + (x < cx ? 3 : -3), y - r * 0.3, 2, 0, TAU); g.fill(); } };
const gdMural = (O, u, w, h, key, W, Hh, paint) => { const [ux, uz] = unwarp(O.x, O.z), by = Math.max(GHT(ux, uz), -9), m = add(new THREE.PlaneGeometry(w, h), gdMuralTex(key, W, Hh, paint), [ux + u, by + 0.55 + h / 2, uz + 0.475], [0, 0, 0], "nocol"); m.userData.noLift = m.userData.noSeat = true; return m; };
// the humming obelisks of Glyph Hollow: small black obelisks, turquoise glyph bands, a faint ring of light at the foot, motes in the air
const gdHumObelisk = (x, z, k) => { const B = gdB(x, z, { yaw: gh(x, z, k) * 1.5 }); gdBx("stone", B, 0, 0, 0, 1.5, 0.3, 1.5, stc(B.O, k)); gdBx("stone", B, 0, 0.3, 0, 1.15, 0.25, 1.15, stc(B.O, k + 1));
  for (let i = 0; i < 3; i++) gdBx("obsid", B, 0, 0.55 + i * 1.0, 0, 0.78 - i * 0.12, 1.0, 0.78 - i * 0.12, "#1c1c24"); gdP("obsid", B, "pyr", 0, 3.82, 0, 0.75, 0.55, 0.75, "#1c1c24", 0, Math.PI / 4, 0);
  for (let f = 0; f < 4; f++) { const a = (f * Math.PI) / 2, c = Math.cos(a), s = Math.sin(a); for (let i = 0; i < 3; i++) { const r = 0.39 - i * 0.06 + 0.02, B2 = { O: B.O, q: B.q.clone().multiply(new THREE.Quaternion().setFromAxisAngle(GDY, a)) }; gdGlyph(B2, 0, 1.2 + i * 1.0, r, 0.3 - i * 0.04, 0.42, i % 2 ? GYC.gold : GYC.turq); } }
  gdP("glow", B, "ring", 0, 0.58, 0, 2.0, 0.5, 2.0, "#5af0e0"); const q = gyQ({ x, z }, k); for (let i = 0; i < 7; i++) { const a = q() * TAU, r = 0.9 + q() * 0.7; gdP("glow", B, "ico0", Math.cos(a) * r, 0.8 + q() * 2.6, Math.sin(a) * r, 0.06, 0.06, 0.06, i % 2 ? "#aaffee" : "#ffe8a0"); } gdMoss(B, 0.6, 0.3, 0.6, 0.3); };

// ---- density: drift grass, carved fragments and turquoise shards by the paths, mossy fallen blocks along the jungle edge, pebbles, shore stones ----
const GDDRIFT = ["#ece8c4", "#e2dcb4", "#f2ecd0", "#dcd8b0", "#d4dcb0", "#e8e0bc"];
const gdInGrass = (ux, uz) => TGP.some((p) => ((ux - p.x) / (p.rx + 1.2)) ** 2 + ((uz - p.z) / (p.rz + 1.2)) ** 2 < 1);
const gdDrift = (O, q, s = 1) => { const n = 6 + Math.floor(q() * 4); for (let b = 0; b < n; b++) { const a = q() * TAU, r = q() * 0.22 * s, h = (0.55 + q() * 0.5) * s, rx = Math.cos(a) * (0.1 + q() * 0.3), rz = Math.sin(a) * (0.1 + q() * 0.3), cx = Math.cos(a) * r, cz = Math.sin(a) * r;
    nnXP("deco", O, "pyr", cx, h * 0.45, cz, 0.04, h, 0.025, GDDRIFT[Math.floor(q() * GDDRIFT.length)], rx, 0, rz);
    if (b < 3) { const tx = cx - 0.5 * h * Math.sin(rz), ty = h * 0.45 + 0.5 * h * Math.cos(rz) * Math.cos(rx), tz = cz + 0.5 * h * Math.cos(rz) * Math.sin(rx), yaw = q() * 3; // a glyph-shaped seed head: a stroke and a bar
      nnXP("glow", O, "box", tx, ty + 0.05, tz, 0.022, 0.12, 0.012, "#f2e2a0", 0, yaw, 0); nnXP("glow", O, "box", tx, ty + 0.1, tz, 0.085, 0.02, 0.012, "#f6e8b0", 0, yaw, 0); nnXP("glow", O, "box", tx + 0.03 * Math.cos(yaw), ty + 0.02, tz - 0.03 * Math.sin(yaw), 0.05, 0.018, 0.012, "#efd890", 0, yaw, 0); } } };
const gdDensity = (X, Y, wild) => { const dg = wild ? 0.16 : 0.07;
  for (let y = Y; y < Y + 30; y++) for (let x = X; x < X + 30; x++) { const t = at(x, y), h = gh(x, y, 900);
    if (t === "g" && h < dg && !gdNear(x, y, "pPks,b")) { const px = x + 0.2 + gh(x, y, 901) * 0.6, pz = y + 0.2 + gh(x, y, 902) * 0.6, [ux, uz] = unwarp(px, pz); if (gdInGrass(ux, uz)) continue; const O = { x: px, z: pz }; gdDrift(O, gyQ(O, 3), 0.85 + gh(x, y, 903) * 0.5); }
    else if ((t === "p" || t === ",") && h < 0.07 && gdNear(x, y, "gx.")) { const O = { x: x + 0.15 + gh(x, y, 904) * 0.7, z: y + 0.15 + gh(x, y, 905) * 0.7, ry: gh(x, y, 906) * 3 }; nnXP("deco", O, "box", 0, 0.025, 0, 0.36, 0.05, 0.26, stc(O, 7)); if (h < 0.035) nnXP("glow", O, "box", 0, 0.052, 0, 0.22, 0.008, 0.03, GYC.turq); else nnXP("glow", O, "oct", 0.22, 0.04, 0.1, 0.06, 0.09, 0.05, GYC.turq); }
    else if (t === "x" && h < 0.12 && gdNear(x, y, ".g") && ![at(x - 1, y), at(x + 1, y), at(x, y - 1), at(x, y + 1)].some((c) => "pPks,S".includes(c))) { const O = { x: x + 0.5, z: y + 0.5, ry: gh(x, y, 907) * 3 }; nnBx(h < 0.05 ? "carve" : "stone", O, 0, -0.1, 0, 0.62, 0.55, 0.5, stc(O, 8)); nnP("stone", O, "box", 0.08, 0.6, 0.04, 0.42, 0.28, 0.36, stc(O, 9), 0.1, 0.4, 0.15); gyMoss(O, 0, 0.5, 0, 0.32); }
    else if (t === "." && h < 0.08) { const O = { x: x + 0.5, z: y + 0.5 }, q = gyQ(O, 5); for (let i = 0; i < 4; i++) nnXP("deco", O, "box", (q() - 0.5) * 0.8, 0.02, (q() - 0.5) * 0.8, 0.06 + q() * 0.08, 0.04, 0.05 + q() * 0.06, ["#d8ccb4", "#b8a888", "#e8dcc4", "#8a8070"][i % 4], 0, q() * 3, 0); }
    else if (t === "w" && h < 0.09 && gdNear(x, y, ".gx")) { const px = x + 0.5, pz = y + 0.5, B = gdB(px, pz, { y: -0.35, yaw: h * 40 }); gdP("deco", B, "rock", 0, 0, 0, 0.45 + gh(x, y, 908) * 0.35, 0.45, 0.4 + gh(x, y, 909) * 0.3, ["#b8a888", "#a89878", "#c8b896"][Math.floor(gh(x, y, 910) * 3)]); } } };

// ---- the pieces, scene by scene ----
gdAfter("YL", (X, Y) => { gdTablet(X + 4.2, Y + 27.6, 2.498); gdFerryOut(X + 10.2, Y + 27.6);
  for (const [x, z] of [[X + 13.6, Y + 23.6], [X + 17.2, Y + 23.6]]) gdLampPole(x, z, Math.PI); });
gdAfter("YN", (X, Y) => { gdTemple(gdB(X + 23.5, Y + 4.5, { y: 0, yaw: -Math.PI / 2 }), 6.6, 5.4, 3.8, 10);
  gdTemple(gdB(X + 6, Y + 24.5, { y: -1.6, yaw: 0.35, lean: 0.2, tip: Math.PI / 2 }), 5.0, 4.0, 3.4, 40, { noStair: true });
  gdPillarTops(X + 2.6, Y + 1.3, 3, 300); gdPillarTops(X + 25.5, Y + 27.6, 4, 310); gdPillarTops(X + 3.0, Y + 18.8, 2, 320); gdLeanPair(X + 27.8, Y + 21, false, 330);
  gdWork(X + 16.5, Y + 13.4, Math.PI * 0.85); for (let k = 0; k < 4; k++) { const x = X + 18 + gh(X, Y, k) * 10, z = Y + 1 + gh(Y, X, k) * 4; if (gdWet(x, z, 0.8)) gdCoral(x, z, 340 + k, 0.8); } });
gdAfter("Y7", (X, Y) => { gdTemple(gdB(X + 3.0, Y + 15.5, { y: -1.5, yaw: Math.PI / 2, lean: 0.22, tip: 0 }), 4.4, 3.4, 3.0, 60, { noStair: true });
  gdTemple(gdB(X + 26.2, Y + 5.4, { y: 0, yaw: -Math.PI / 2 }), 4.6, 3.6, 3.2, 80, { noStair: true }); gdLeanPair(X + 11.5, Y + 25.5, false, 350);
  gdPillarTops(X + 5, Y + 1.5, 3, 360); gdPillarTops(X + 21.5, Y + 1.4, 3, 370); gdWork(X + 12, Y + 13.2, Math.PI); gdWork(X + 18.6, Y + 13.0, Math.PI * 1.08); });
gdAfter("YI", (X, Y) => { gdTemple(gdB(X + 3.6, Y + 14.5, { y: 0, yaw: Math.PI / 2 }), 5.4, 4.4, 3.4, 100);
  gdPillarTops(X + 4.5, Y + 1.0, 3, 380); gdPillarTops(X + 10.5, Y + 1.2, 2, 390); gdPillarTops(X + 22, Y + 0.8, 3, 400); gdLeanPair(X + 28.2, Y + 1.6, false, 410); });
gdAfter("YD", (X, Y) => { for (const [x, z] of [[2.5, 16.4], [8.5, 16.4], [20.0, 16.4], [2.3, 9.3], [9.5, 9.3], [20.4, 9.4]]) gdLampPole(X + x, Y + z, z > 12 ? 0 : Math.PI);
  gdTableKit(X + 6.2, Y + 17.3, 0); gyFlag(gyO(X, Y, 1.6, 17.2), 4, GYC.gold); gyFlag(gyO(X, Y, 28.4, 9.2), 4, GYC.turq); gdWork(X + 15, Y + 18.2, 0.2); });
gdAfter("Y9", (X, Y) => { gdVoicesFront(X, Y); gdWork(X + 9.5, Y + 21.6, Math.PI * 0.9); gdWork(X + 20.6, Y + 22.0, Math.PI * 1.1); });
gdAfter("YM", (X, Y) => { gdObelisk(X + 20.6, Y + 8.0); gdMural(gyO(X, Y, 6, 5.5), 2.0, 3.5, 2.2, "seed", 1024, 640, gdSeedMural); gdMural(gyO(X, Y, 18.2, 5.5), 2.9, 5.2, 2.3, "shadow", 1280, 566, gdShadowMural); });
gdAfter("YY", (X, Y) => { gdHumObelisk(X + 8.6, Y + 8.6, 500); gdHumObelisk(X + 21.4, Y + 21.4, 510); });
gdAfter("YO", (X, Y) => { for (let y = Y; y < Y + 30; y++) for (let x = X; x < X + 30; x++) if (at(x, y) === "w" && gh(x, y, 520) < 0.16 && gdWet(x + 0.5, y + 0.5, 0.8)) gdCoral(x + 0.5, y + 0.5, 530 + x * 7 + y, 0.7 + gh(x, y, 521) * 0.5); });
for (const id of Object.keys(TSCN)) gdAfter(id, (X, Y) => gdDensity(X, Y, !(TSCN[id].wild === false)));

// ================= THE DEEP SEA FERRY (place gyFerry): inside the glass bubble, diving =================
// Book 1 Ch23: a big glass bubble held together by gleaming brass ribs, brass benches with red velvet cushions, a little brass wheelhouse
// with a big brass wheel and a bell (ding-ding) and a lever; sunbeams slanting down through blue water, silver fish, plankton glittering
// like a night sky, jellyfish pink and violet and pale gold (some bigger than the ferry), the Old One's long smooth gray back under the
// glass floor with a fin like a sail and rows of pale blue glowing spots; and on the sandy seabed the Sunken Gate, a ring of pale stone
// standing on its edge, crusted with barnacles, coral and sea-grass, every carving glowing, the water turning in its middle.
FXA.gdBrassRib = () => thM("gdBrassRib", () => std({ color: "#d8a850", metalness: 0.45, roughness: 0.3, emissive: "#3a2408", emissiveIntensity: 0.5 }));
PSTY.gyferry = { ebase: "#000", floor: ["#b08458", "#a87c50", "#b88c60"], stone: "#9a7048", wall: "#c89a44", ringE: "#4a3010", ringEI: 0.35, moss: "#8a6a4a", glow: ["#9ae8ff", GYC.gold], wallH: 0.9, flat: 1, clean: 1, planks: 1, ribM: "gdBrassRib" };
NNGEO.gdArcF = new THREE.TorusGeometry(1, 0.012, 5, 40, Math.PI).toNonIndexed(); NNGEO.gdRingF = new THREE.TorusGeometry(1, 0.012, 5, 64).toNonIndexed(); NNGEO.gdArcT = new THREE.TorusGeometry(1, 0.045, 5, 24, Math.PI).toNonIndexed();
const gdDeepM = (k, o) => thM("gdDeep" + k, () => { const m = std(Object.assign({ roughness: 0.6 }, o)); m.fog = false; return m; });
const gdDeep = (geo, mat, p, r = [0, 0, 0], s) => { const m = add(geo, mat, p, r, "nocol"); m.castShadow = false; m.receiveShadow = false; m.userData.noLift = m.userData.noSeat = true; if (s) m.scale.set(...s); return m; };
defPlace("gyFerry", { name: "Deep Sea Ferry", w: 14, d: 14, style: "gyferry", indoor: true, wallH: 0.9, ring: [7, 7, 6, 6],
  grid() { const g = PLW(14, 14); for (let y = 0; y < 14; y++) for (let x = 0; x < 14; x++) if (Math.hypot(x + 0.5 - 7, y + 0.5 - 7) < 5.6) g[y][x] = "."; pRect(g, 6, 2, 7, 2, "o"); /* the wheel */ return g; },
  arrive: { in: [7, 10.6, 0] },
  portals: [{ t: [7, 12.6], to: "out:YL", label: "Leave the Deep Sea Ferry", flat: true }],
  dress({ X, Z, lite }) { const cx = X(7), cz = Z(7), R0 = 6.3, A = (x, z, ry = 0, y = 0) => ({ abs: true, x: X(x), y, z: Z(z), ry });
    // the deck: the floor is see-through outside the bubble and in a round glass window in the middle
    const gm = root.children.filter((m) => m.name === "ground" && Math.abs(m.position.x - cx) < 1 && Math.abs(m.position.z - cz) < 1).pop();
    if (gm) { const c = document.createElement("canvas"); c.width = c.height = 448; const g = c.getContext("2d"), p = 32; g.fillStyle = "#000"; g.fillRect(0, 0, 448, 448); g.fillStyle = "#fff"; g.beginPath(); g.arc(7 * p, 7 * p, 6.15 * p, 0, TAU); g.fill();
      const rg = g.createRadialGradient(7 * p, 7 * p, 2.4 * p, 7 * p, 7 * p, 2.95 * p); rg.addColorStop(0, "#1a1a1a"); rg.addColorStop(1, "#fff"); g.fillStyle = rg; g.beginPath(); g.arc(7 * p, 7 * p, 2.95 * p, 0, TAU); g.fill();
      gm.material.alphaMap = new THREE.CanvasTexture(c); gm.material.transparent = true; gm.material.needsUpdate = true; gm.renderOrder = 1; }
    const glass = thM("gdFerryGlass", () => { const m = std({ color: "#cff4f4", transparent: true, opacity: 0.12, roughness: 0.03, metalness: 0.3, depthWrite: false, side: THREE.DoubleSide }); m.fog = false; return m; });
    gdDeep(new THREE.SphereGeometry(R0, 48, 20, 0, TAU, 0, Math.PI / 2), glass, [cx, 0, cz]).renderOrder = 3; gdDeep(new THREE.SphereGeometry(R0, 48, 14, 0, TAU, Math.PI / 2, Math.PI / 2), glass, [cx, 0, cz]).renderOrder = 3;
    gdDeep(new THREE.CircleGeometry(2.95, 40), glass, [cx, 0.01, cz], [-Math.PI / 2, 0, 0]);
    // brass ribs over and under the bubble, rings round it, the crown on top, the rim of the glass window
    const C = A(7, 7); for (let i = 0; i < 8; i++) { nnP("brass", C, "gdArcF", 0, 0, 0, R0, R0, R0 * 1.6, "#d8a850", 0, (i * Math.PI) / 8, 0); nnP("brass", C, "gdArcF", 0, 0, 0, R0, R0, R0 * 1.6, "#b88a3c", 0, (i * Math.PI) / 8, Math.PI); }
    for (const y of [-3.2, 0.95, 2.4, 4.4]) { const r = Math.sqrt(R0 * R0 - y * y); nnP("brass", C, "gdRingF", 0, y, 0, r, r, r * 1.6, "#e0b458", Math.PI / 2, 0, 0); }
    nnP("brass", C, "cyl", 0, R0 - 0.05, 0, 1.4, 0.25, 1.4, "#d8a850"); nnP("brass", C, "dome", 0, R0 + 0.05, 0, 0.9, 0.5, 0.9, "#e0b458"); nnP("brass", C, "cyl", 0, -R0 + 0.05, 0, 1.6, 0.3, 1.6, "#b88a3c");
    nnP("brass", C, "gdRingF", 0, 0.03, 0, 2.98, 2.98, 4, "#e0b458", Math.PI / 2, 0, 0); for (let i = 0; i < 4; i++) nnP("brass", C, "box", 0, 0.025, 0, 5.9, 0.03, 0.06, "#c89a44", 0, (i * Math.PI) / 4, 0);
    // brass benches with red velvet cushions, round the rail, facing out to the sea
    for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU + Math.PI / 8, bx = 7 + Math.cos(a) * 4.7, bz = 7 + Math.sin(a) * 4.7; if (bz > 10.5 && Math.abs(bx - 7) < 2) continue; if (bz < 3.6 && Math.abs(bx - 7) < 2) continue;
      const O = A(bx, bz, Math.PI / 2 - a + Math.PI); nnBx("lit", O, 0, 0, 0, 1.5, 0.42, 0.5, "#c89a44"); nnBx("deco", O, 0, 0.42, 0, 1.44, 0.1, 0.46, "#a8182a"); nnBx("lit", O, 0, 0.42, -0.24, 1.5, 0.55, 0.06, "#c89a44"); nnBx("deco", O, 0, 0.55, -0.2, 1.4, 0.36, 0.05, "#a01626");
      for (const s of [-0.7, 0.7]) nnBx("brass", O, s, 0.42, 0, 0.05, 0.3, 0.46, "#e0b458"); }
    // the wheelhouse: an arch of brass round the big wheel, the bell hanging over it, the lever beside it, a lamp
    { const O = A(7, 2.9, Math.PI); nnBx("lit", O, 0, 0, 0, 1.5, 0.12, 1.2, "#b88a3c"); nnCy("lit", O, 0, 0.12, 0.1, 0.12, 1.05, "#c89a44"); nnP("brass", O, "gdRing", 0, 1.45, 0.1, 0.62, 0.62, 1.4, "#e0b458"); nnP("brass", O, "cyl12", 0, 1.45, 0.1, 0.22, 0.18, 0.22, "#d8a850", Math.PI / 2, 0, 0);
      for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; nnP("brass", O, "box", 0, 1.45, 0.1, 1.24, 0.045, 0.045, "#d8a850", 0, 0, a); nnP("brass", O, "cyl8", Math.cos(a) * 0.76, 1.45 + Math.sin(a) * 0.76, 0.1, 0.07, 0.24, 0.07, "#e8c060", 0, 0, a - Math.PI / 2); }
      nnP("brass", O, "gdArcT", 0, 0, -0.2, 1.35, 2.6, 1.2, "#d8a850"); nnP("brass", O, "gdArcT", 0, 0, 0.45, 1.35, 2.6, 1.2, "#d8a850"); nnBx("brass", O, 0, 2.55, 0.12, 0.08, 0.08, 0.7, "#c89a44");
      nnBx("brass", O, 0, 2.3, 0.12, 0.03, 0.25, 0.03, "#8a6a3a"); nnP("brass", O, "cone", 0, 2.12, 0.12, 0.36, 0.34, 0.36, "#f0c860"); nnSp("brass", O, 0, 1.92, 0.12, 0.05, "#8a6a3a");
      nnBx("lit", O, 0.95, 0, 0.2, 0.3, 0.6, 0.3, "#b88a3c"); nnP("brass", O, "cyl8", 0.95, 0.95, 0.2, 0.05, 0.75, 0.05, "#d8a850", 0.35, 0, 0); nnSp("deco", O, 0.95, 1.3, 0.33, 0.08, "#a8182a");
      nnBx("brass", O, -0.95, 0, 0.2, 0.06, 2.1, 0.06, "#c89a44"); nnP("brass", O, "pyr", -0.95, 2.25, 0.2, 0.3, 0.14, 0.3, "#b08840", 0, Math.PI / 4, 0); nnBx("glow", O, -0.95, 1.84, 0.2, 0.18, 0.26, 0.18, "#ffd68a"); }
    lite(7, 3.4, "#ffd8a0", 2.2, 9, 2.4); lite(7, 8, "#9ad8ff", 1.6, 13, 4.2);
    // ---- the deep, outside the glass: blue water all round, sunbeams, plankton, fish, jellyfish, the Old One, the seabed and the Sunken Gate ----
    { const g = new THREE.SphereGeometry(90, 32, 18), P = g.attributes.position, col = [], top = new THREE.Color("#7ad0f0"), mid = new THREE.Color("#1a6a9a"), bot = new THREE.Color("#04182c"), c = new THREE.Color();
      for (let i = 0; i < P.count; i++) { const t = P.getY(i) / 90; t > 0 ? c.copy(mid).lerp(top, Math.pow(t, 0.7)) : c.copy(mid).lerp(bot, Math.pow(-t, 0.6)); col.push(c.r, c.g, c.b); } g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
      const m = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false }); gdDeep(g, m, [cx, -6, cz]).renderOrder = -2; }
    { const bm = thM("gdBeam", () => new THREE.MeshBasicMaterial({ color: "#d8f4ff", transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })), q = nnXR(8801);
      for (let i = 0; i < 9; i++) { const a = q() * TAU, r = 12 + q() * 30; gdDeep(new THREE.CylinderGeometry(1.2 + q() * 1.5, 3 + q() * 3, 70, 10, 1, true), bm, [cx + Math.cos(a) * r, 8, cz + Math.sin(a) * r], [0.25 * Math.cos(a), 0, 0.25 * Math.sin(a) - 0.1]).renderOrder = 4; } }
    { const q = nnXR(8811), P = []; for (let i = 0; i < 2600; i++) { const a = q() * TAU, u = q() * 2 - 1, r = 7.5 + Math.pow(q(), 0.7) * 60, s = Math.sqrt(1 - u * u); P.push(cx + Math.cos(a) * s * r, u * r * 0.7 - 3, cz + Math.sin(a) * s * r); }
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(P, 3)); const pm = new THREE.PointsMaterial({ color: "#c8f4ff", size: 0.14, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }); const pts = new THREE.Points(g, pm); pts.name = "nocol"; root.add(pts); }
    // silver fish in three schools
    { const fg = new THREE.ConeGeometry(0.12, 0.5, 5); fg.rotateZ(-Math.PI / 2); fg.scale(1, 1, 0.4); const fm = gdDeepM("fish", { color: "#dfe8f0", metalness: 0.7, roughness: 0.25, emissive: "#4a6a8a", emissiveIntensity: 0.5 }), q = nnXR(8821), N = 90, im = new THREE.InstancedMesh(fg, fm, N), M = new THREE.Matrix4(), Q = new THREE.Quaternion(), V = new THREE.Vector3(), S1 = new THREE.Vector3(1, 1, 1);
      for (let i = 0; i < N; i++) { const sch = i % 3, a0 = [0.6, 2.4, 4.3][sch], r = [11, 15, 9][sch], y = [1.5, -4, 4][sch], a = a0 + (q() - 0.5) * 0.7; V.set(cx + Math.cos(a) * (r + (q() - 0.5) * 3), y + (q() - 0.5) * 2.4, cz + Math.sin(a) * (r + (q() - 0.5) * 3)); Q.setFromAxisAngle(GDY, -a + Math.PI); M.compose(V, Q, S1.setScalar(0.7 + q() * 0.6)); im.setMatrixAt(i, M); }
      im.name = "nocol"; im.castShadow = false; root.add(im); }
    // jellyfish: bells that glow, trailing threads; the big ones far off are bigger than the ferry
    { const bell = new THREE.SphereGeometry(1, 20, 10, 0, TAU, 0, Math.PI * 0.55), q = nnXR(8831), cols = ["#ff8ac8", "#b48aff", "#ffe0a0"];
      const jm = cols.map((c, i) => thM("gdJelly" + i, () => { const m = std({ color: c, emissive: c, emissiveIntensity: 0.5, transparent: true, opacity: 0.38, roughness: 0.3, side: THREE.DoubleSide, depthWrite: false }); m.fog = false; return m; }));
      const lm = cols.map((c, i) => thM("gdJellyL" + i, () => new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0.55, fog: false })));
      for (const [a, r, y, s, k] of [[0.3, 10, 3, 0.8, 0], [1.2, 12, -2, 1.1, 1], [2.0, 9, 5, 0.6, 2], [2.9, 13, 1, 1.3, 0], [3.8, 10, -3, 0.9, 2], [4.6, 12, 4, 0.7, 1], [5.5, 11, -1, 1.0, 0], [1.6, 40, 13, 7, 1], [4.1, 46, 15, 8, 0]]) {
        const x = cx + Math.cos(a) * r, z = cz + Math.sin(a) * r; gdDeep(bell, jm[k], [x, y, z], [(q() - 0.5) * 0.4, 0, (q() - 0.5) * 0.4], [s, s * 0.8, s]).renderOrder = 5;
        const P = []; for (let t = 0; t < 10; t++) { const ta = (t / 10) * TAU, tr = s * 0.75; let px = x + Math.cos(ta) * tr, pz = z + Math.sin(ta) * tr, py = y; for (let j = 0; j < 8; j++) { const nx = px + Math.sin(j * 0.9 + t) * s * 0.12, ny = py - s * 0.45, nz = pz + Math.cos(j * 0.8 + t) * s * 0.12; P.push(px, py, pz, nx, ny, nz); px = nx; py = ny; pz = nz; } }
        const lg = new THREE.BufferGeometry(); lg.setAttribute("position", new THREE.Float32BufferAttribute(P, 3)); const ls = new THREE.LineSegments(lg, lm[k]); ls.name = "nocol"; root.add(ls); } }
    // the Old One, passing under the glass floor: a long smooth gray back, a fin like a sail, rows of pale blue glowing spots
    { const oy = -7.7, om = gdDeepM("old", { color: "#5a6874", roughness: 0.4, metalness: 0.1, emissive: "#16324a", emissiveIntensity: 0.55 });
      gdDeep(new THREE.SphereGeometry(1, 32, 16), om, [cx + 2, oy, cz - 1], [0, 0.35, 0], [18, 2.6, 3.6]); gdDeep(new THREE.SphereGeometry(1, 20, 10), om, [cx - 14.5, oy - 0.2, cz + 4.6], [0, 0.35, 0], [6, 1.8, 2.6]);
      const fin = new THREE.Shape(); fin.moveTo(-3, 0); fin.quadraticCurveTo(-1.5, 4.5, 2.6, 5.4); fin.quadraticCurveTo(1.2, 2.4, 3, 0); fin.lineTo(-3, 0); const fgeo = new THREE.ExtrudeGeometry(fin, { depth: 0.25, bevelEnabled: true, bevelSize: 0.12, bevelThickness: 0.1, bevelSegments: 2 }); fgeo.translate(0, 0, -0.125); fgeo.scale(0.6, 0.45, 1);
      gdDeep(fgeo, om, [cx + 2 - 9 * Math.cos(0.35), oy + 1.75, cz - 1 + 9 * Math.sin(0.35)], [0, 0.35, 0]);
      const sm = gdDeepM("spot", { color: "#bff4ff", emissive: "#9ae8ff", emissiveIntensity: 2.0 }), sg = new THREE.SphereGeometry(0.22, 8, 6), N = 56, im = new THREE.InstancedMesh(sg, sm, N), M = new THREE.Matrix4(), V = new THREE.Vector3(), Q = new THREE.Quaternion(), S1 = new THREE.Vector3(1, 1, 1), ca = Math.cos(0.35), sa = Math.sin(0.35);
      for (let i = 0; i < N; i++) { const row = i % 4, t = Math.floor(i / 4) / 14 - 0.5, ex = t * 30, side = row < 2 ? -1 : 1, up = row % 2, ez = side * (3.6 * Math.sqrt(Math.max(0, 1 - (ex / 18) ** 2)) * (up ? 0.6 : 0.85)), ey = up ? 1.6 * Math.sqrt(Math.max(0, 1 - (ex / 18) ** 2)) : 0.6;
        V.set(cx + 2 + ex * ca + ez * sa, oy + ey, cz - 1 - ex * sa + ez * ca); M.compose(V, Q, S1); im.setMatrixAt(i, M); } im.name = "nocol"; root.add(im); }
    // the seabed, and the Sunken Gate standing on it ahead (north)
    { const by = -13, c = document.createElement("canvas"); c.width = c.height = 512; const g = c.getContext("2d"), rg = g.createRadialGradient(256, 256, 20, 256, 256, 256); rg.addColorStop(0, "#b8b090"); rg.addColorStop(0.3, "#4a6a74"); rg.addColorStop(1, "#04182c"); g.fillStyle = rg; g.fillRect(0, 0, 512, 512);
      const q = nnXR(8841); for (let i = 0; i < 1600; i++) { g.fillStyle = `rgba(${q() < 0.5 ? "240,232,200" : "60,80,90"},${0.08 + q() * 0.12})`; g.beginPath(); g.arc(q() * 512, q() * 512, 1 + q() * 4, 0, TAU); g.fill(); }
      for (let i = 0; i < 40; i++) { g.strokeStyle = "rgba(240,236,210,0.12)"; g.lineWidth = 3; g.beginPath(); const y = q() * 512; g.moveTo(0, y); for (let x = 0; x <= 512; x += 32) g.lineTo(x, y + Math.sin(x * 0.05 + i) * 6); g.stroke(); }
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const gx = cx, gz = cz - 24; gdDeep(new THREE.CircleGeometry(100, 48), gdDeepM("bed", { map: t, roughness: 0.95, color: "#8aa0b0", emissive: "#0a2a40", emissiveIntensity: 0.35 }), [gx, by, gz], [-Math.PI / 2, 0, 0]);
      const R1 = 8, sm = gdDeepM("gate", { color: "#e4dccb", roughness: 0.8, emissive: "#1a4a6a", emissiveIntensity: 0.45 });
      gdDeep(new THREE.TorusGeometry(R1, 1.25, 12, 64), sm, [gx, by + R1 + 0.4, gz]); gdDeep(new THREE.BoxGeometry(5, 1.4, 3.4), sm, [gx, by + 0.3, gz]);
      const gl = gdDeepM("gateGlow", { color: "#bff8ff", emissive: "#7af0f0", emissiveIntensity: 1.6 }), cm = gdDeepM("gateGold", { color: "#ffe6a0", emissive: "#ffcf4a", emissiveIntensity: 1.3 });
      // instanced pieces (one draw call each): the glowing carvings, barnacles, coral, sea-grass
      const IM = (geo, mat, list, cols) => { const im = new THREE.InstancedMesh(geo, mat, list.length), M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(); list.forEach(([p, r, sc], i) => { M.compose(new THREE.Vector3(...p), Q.setFromEuler(E.set(...r)), new THREE.Vector3(...sc)); im.setMatrixAt(i, M); if (cols) im.setColorAt(i, new THREE.Color(cols[i])); }); im.name = "nocol"; im.castShadow = false; im.userData.noLift = im.userData.noSeat = true; root.add(im); return im; };
      const ub = new THREE.BoxGeometry(1, 1, 1), cuts = [[], []];
      for (let i = 0; i < 24; i++) { const a = (i / 24) * TAU; cuts[i % 2].push([[gx + Math.cos(a) * R1, by + R1 + 0.4 + Math.sin(a) * R1, gz + 1.27], [0, 0, a + Math.PI / 2], [0.75, i % 3 ? 0.12 : 0.55, 0.06]]); if (i % 3 === 0) cuts[0].push([[gx + Math.cos(a) * (R1 + 0.35), by + R1 + 0.4 + Math.sin(a) * (R1 + 0.35), gz + 1.27], [0, 0, a], [0.12, 0.6, 0.06]]); }
      IM(ub, gl, cuts[0]); IM(ub, cm, cuts[1]);
      const bar = gdDeepM("barn", { color: "#d8d0c0", roughness: 0.9, emissive: "#1a3a4a", emissiveIntensity: 0.3 }), cor = gdDeepM("coral", { color: "#ffffff", roughness: 0.7, emissive: "#5a2a3a", emissiveIntensity: 0.4 }), bg = new THREE.SphereGeometry(0.22, 7, 5), cg = new THREE.IcosahedronGeometry(0.5, 0);
      const barn = [], crl = [], ccol = []; for (let i = 0; i < 70; i++) { const a = q() * TAU, rr = R1 + (q() - 0.5) * 1.8, p = [gx + Math.cos(a) * rr, by + R1 + 0.4 + Math.sin(a) * rr, gz + (q() - 0.5) * 2.4]; if (i < 46) barn.push([p, [0, 0, 0], [1, 0.6 + q() * 0.6, 1]]); else { crl.push([p, [q(), q(), q()], [0.6 + q(), 0.6 + q(), 0.6 + q()]]); ccol.push(["#ff7a6a", "#ff5a8a", "#c86ad8", "#ffb060"][i % 4]); } }
      IM(bg, bar, barn); IM(cg, cor, crl, ccol);
      const gg = gdDeepM("grass", { color: "#3a8a5a", roughness: 0.8, emissive: "#0a3a2a", emissiveIntensity: 0.4, side: THREE.DoubleSide }), bl = new THREE.PlaneGeometry(0.18, 1, 1, 3); bl.translate(0, 0.5, 0);
      const gr = []; for (let i = 0; i < 90; i++) { const x = gx + (q() - 0.5) * 22, z = gz + (q() - 0.5) * 9; gr.push([[x, by, z], [(q() - 0.5) * 0.4, q() * 3, (q() - 0.5) * 0.4], [1, 1 + q() * 2.2, 1]]); } IM(bl, gg, gr);
      // the water turning in the middle of the ring
      const sc = document.createElement("canvas"); sc.width = sc.height = 256; const s2 = sc.getContext("2d"); s2.clearRect(0, 0, 256, 256); s2.lineCap = "round"; for (let k = 0; k < 5; k++) { s2.strokeStyle = `rgba(${k % 2 ? "190,250,255" : "120,220,240"},0.55)`; s2.lineWidth = 6 - k * 0.6; s2.beginPath(); for (let t = 0; t <= 1.001; t += 0.01) { const a = t * 4 * Math.PI + (k * TAU) / 5, r = 120 * t; const x = 128 + Math.cos(a) * r, y = 128 + Math.sin(a) * r; t ? s2.lineTo(x, y) : s2.moveTo(x, y); } s2.stroke(); }
      const st = new THREE.CanvasTexture(sc); st.colorSpace = THREE.SRGBColorSpace; const swm = new THREE.MeshBasicMaterial({ map: st, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false });
      gdDeep(new THREE.CircleGeometry(R1 - 1.1, 40), swm, [gx, by + R1 + 0.4, gz]).renderOrder = 6; } } });
OUTPORTALS.push({ scene: "YL", at: [53.5, 177.6], arrive: [56.0, 177.6], to: "gyFerry:in", label: "Board the Deep Sea Ferry" });
