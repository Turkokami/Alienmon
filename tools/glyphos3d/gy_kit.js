// ================= GLYPHOS KIT: jungle, Ystran ruins, the Dig Camp; nearly everything goes into a handful of merged batches =================
// extra batch bins: carved sandstone (solid), fronds and stems (no collision), bark (solid); tree crowns go in the shared leaf-card batch
NND.stone = []; NND.fern = []; NND.bark = [];
const GYBIN = { stone: () => gyTri("gyBStone", "ashlar", 0.25, { vc: true, r: 0.92 }), carve: () => gyTri("gyBCarve", "carve", 0.25, { vc: true, r: 0.92 }), fern: () => gyTri("gyBLeaf", "fern", 0.85, { vc: true, r: 0.78, side: THREE.DoubleSide }), bark: () => gyTri("gyBBark", "bark", 0.7, { vc: true, r: 0.95 }) };
NND.carve = [];
const GYSOLID = { lit: 1, stone: 1, carve: 1, bark: 1 };
// extra shapes for the batches
{ const blob = (det, amp, seed) => { const g = new THREE.IcosahedronGeometry(0.5, det), P = g.attributes.position, N = g.attributes.normal, v = new THREE.Vector3();
    for (let i = 0; i < P.count; i++) { v.fromBufferAttribute(P, i).normalize(); const k = 1 + amp * (Math.sin(v.x * 5.1 + seed) * Math.sin(v.y * 4.3 + seed * 2) * Math.sin(v.z * 4.7 + seed * 3) + 0.5 * Math.sin(v.x * 11 + v.z * 9 + seed)); P.setXYZ(i, v.x * 0.5 * k, v.y * 0.5 * k * (v.y < 0 ? 0.55 : 1), v.z * 0.5 * k); N.setXYZ(i, v.x, v.y, v.z); }
    return g.index ? g.toNonIndexed() : g; };
  NNGEO.ico0 = (() => { const g = new THREE.IcosahedronGeometry(0.5, 0); return g.index ? g.toNonIndexed() : g; })(); NNGEO.limbL = new THREE.CylinderGeometry(0.32, 0.5, 1, 5, 1, true).toNonIndexed(); NNGEO.blob = blob(1, 0.22, 1.3); NNGEO.blobL = blob(0, 0.16, 2.2); NNGEO.blob2 = blob(1, 0.3, 4.1); NNGEO.rock = (() => { const g = blob(1, 0.28, 2.7); g.computeVertexNormals(); return g; })();
  NNGEO.tcyl = new THREE.CylinderGeometry(0.34, 0.5, 1, 7, 1, true).toNonIndexed(); NNGEO.stem = new THREE.CylinderGeometry(0.5, 0.5, 1, 3, 1, true).toNonIndexed(); NNGEO.cyl8 = new THREE.CylinderGeometry(0.5, 0.5, 1, 10).toNonIndexed();
  NNGEO.dome = new THREE.SphereGeometry(0.5, 10, 5, 0, TAU, 0, Math.PI / 2).toNonIndexed(); NNGEO.pyr = new THREE.ConeGeometry(0.71, 1, 4, 1).rotateY(Math.PI / 4).toNonIndexed();
  { const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(1, 0); sh.quadraticCurveTo(0.25, 0.25, 0, 1); sh.lineTo(0, 0); const g = new THREE.ExtrudeGeometry(sh, { depth: 1, bevelEnabled: false, curveSegments: 4 }); g.translate(0, 0, -0.5); NNGEO.wedge = g.index ? g.toNonIndexed() : g; }
  { const g = new THREE.PlaneGeometry(1, 1, 6, 1), P = g.attributes.position; for (let i = 0; i < P.count; i++) { const u = P.getX(i) + 0.5, w = P.getY(i); P.setXYZ(i, u, -0.45 * u * u + Math.abs(w) * 0.12, w * Math.sin(Math.PI * Math.min(1, u * 1.15)) * (1 - u * 0.25)); } g.computeVertexNormals(); NNGEO.frond = g.toNonIndexed(); }
  { const g = new THREE.PlaneGeometry(1, 1, 6, 2), P = g.attributes.position; for (let i = 0; i < P.count; i++) { const u = P.getX(i) + 0.5, w = P.getY(i); P.setXYZ(i, u, -0.25 * u * u - Math.abs(w) * 0.15, w * Math.sin(Math.PI * u) * 1.1); } g.computeVertexNormals(); NNGEO.broad = g.toNonIndexed(); }
}
const GYC = { gold: "#ffcf4a", turq: "#3fe0d0", jade: "#7af0b0", amber: "#ffb347" };
const gh = (x, z, s) => nh(x * 1.37 + 0.3, z * 1.91 + 0.7, s);
// ---- trees and plants ----
const LEAFC = ["#ffffff", "#e8f0d8", "#d8f0e0", "#f4f0c8", "#c8e0c8"];
// a rainforest giant: flared buttress roots, a tall clean trunk, two limbs and a broad layered crown, vines hanging from it
// leaf greens for the jungle; each card is a spray of leaves from the shared Neonis leaf atlas
const GYLEAF = [["#4f8a34", "#62a040", "#3e7a2e", "#79b04e"], ["#5a9440", "#6eaa4a", "#47823a", "#88bc5a"], ["#4a8a4a", "#5ea05a", "#3a7a44", "#7ab468"], ["#6a9a38", "#80ae46", "#5a8a30", "#98c058"], ["#3f8050", "#52966a", "#336e44", "#6aac78"]];
const gyQ = (O, k) => nnXR(Math.floor(O.x * 61 + k * 7) * 109 + Math.floor(O.z * 89) + k);
const gyLeafC = (q) => GYLEAF[Math.floor(q() * GYLEAF.length)];
// a small tuft of leaf cards (moss and creepers on stone, a potted plant)
const gyMoss = (O, x, y, z, r) => { const q = gyQ(O, 11 + Math.floor((x + z) * 7)), cols = gyLeafC(q); nnXClump(O, q, x, y, z, r * 1.2, cols, [x, y - r * 0.3, z], r * 1.6, 4); };
// a jungle giant: buttress roots, a tall leaning trunk, wide flat limbs and leaf-card clumps on every limb
const gyTree = (O, s = 1) => { const q = gyQ(O, 1), cols = gyLeafC(q), S = 2.5 * s, bark = ["#7a6a58", "#6e6252", "#857260"][Math.floor(q() * 3)], bark2 = nnXHex(bark, 0.05);
  for (let k = 0; k < 4; k++) { const a = (k / 4) * TAU + q() * 0.7, L = (0.55 + q() * 0.3) * S; nnXBeam("lit", O, [0, 0.6 * S, 0], [Math.cos(a) * L, -0.02, Math.sin(a) * L], 0.1 * S, bark, "limbL"); }
  const H = (3.3 + q() * 1.3) * S, lean = q() * TAU, lk = 0.07 * S, pts = [[0, -0.05, 0]];
  for (let k = 1; k <= 3; k++) { const f = k / 3, wob = (q() - 0.5) * 0.1 * S; pts.push([Math.cos(lean) * lk * f * f * 3 + wob, H * f, Math.sin(lean) * lk * f * f * 3 - wob]); }
  for (let k = 0; k < 3; k++) { const a = pts[k], b = pts[k + 1]; nnXBeam("lit", O, a, [b[0], b[1] + 0.05, b[2]], (0.17 - k * 0.035) * S, k ? bark2 : bark, "limb"); }
  const top = pts[3], crad = 1.7 * S, cen = [top[0], top[1] + crad * 0.3, top[2]], nl = 5;
  for (let k = 0; k < nl; k++) { const st = pts[2 + (k % 2)], a = (k / nl) * TAU + q() * 0.8, up = 0.5 + q() * 0.35, L = (0.7 + q() * 0.4) * S, end = [st[0] + Math.cos(a) * L, st[1] + up * L, st[2] + Math.sin(a) * L];
    nnXBeam("bark", O, st, end, 0.06 * S, bark2, "limbL"); nnXClump(O, q, end[0], end[1] + 0.2 * S, end[2], 0.7 * S, cols, cen, crad, 10);
    for (let t = 0; t < 2; t++) { const a2 = a + (t ? 0.8 : -0.8), L2 = (0.35 + q() * 0.25) * S; nnXClump(O, q, end[0] + Math.cos(a2) * L2, end[1] + (0.1 + q() * 0.25) * S, end[2] + Math.sin(a2) * L2, 0.55 * S, cols, cen, crad, 6); }
    const mid = [(st[0] + end[0]) / 2, (st[1] + end[1]) / 2 + 0.3 * S, (st[2] + end[2]) / 2]; nnXClump(O, q, mid[0], mid[1], mid[2], 0.55 * S, cols, cen, crad, 5); }
  nnXClump(O, q, cen[0], cen[1] + crad * 0.3, cen[2], 0.8 * S, cols, cen, crad, 10);
  if (q() < 0.6) for (let i = 0; i < 3; i++) { const a = q() * TAU, r = (0.5 + q() * 0.6) * S, L = (0.8 + q() * 1.4) * S; nnBx("deco", O, top[0] + Math.cos(a) * r, top[1] - L, top[2] + Math.sin(a) * r, 0.05, L, 0.05, "#3a6a2a"); } };
// a mid-storey tree: shorter, rounder crown on three limbs
const gyTreeS = (O, s = 1) => { const q = gyQ(O, 2), cols = gyLeafC(q), S = 1.4 * s, bark = "#7e705e", H = (2.2 + q() * 0.9) * S, lean = q() * TAU, top = [Math.cos(lean) * 0.15 * S, H, Math.sin(lean) * 0.15 * S];
  nnXBeam("lit", O, [0, -0.05, 0], top, 0.11 * S, bark, "limb"); const crad = 1.1 * S, cen = [top[0], top[1] + 0.25 * S, top[2]];
  for (let k = 0; k < 3; k++) { const a = (k / 3) * TAU + q() * 0.9, L = (0.6 + q() * 0.35) * S, st = [top[0] * 0.7, H * 0.72, top[2] * 0.7], end = [st[0] + Math.cos(a) * L, st[1] + (0.4 + q() * 0.3) * L, st[2] + Math.sin(a) * L];
    nnXBeam("bark", O, st, end, 0.05 * S, bark, "limbL"); nnXClump(O, q, end[0], end[1] + 0.12 * S, end[2], 0.6 * S, cols, cen, crad, 8); }
  nnXClump(O, q, cen[0], cen[1] + 0.2 * S, cen[2], 0.7 * S, cols, cen, crad, 9); };
const gyPalm = (O, s = 1) => { const k = gh(O.x, O.z, 11), H = (5 + k * 3.5) * s, bend = (0.6 + gh(O.x, O.z, 12) * 0.9) * s, dir = gh(O.x, O.z, 13) * TAU; let px = 0, py = 0;
  for (let i = 0; i < 5; i++) { const t0 = i / 5, t1 = (i + 1) / 5, x0 = Math.sin(t0 * 1.3) * bend, x1 = Math.sin(t1 * 1.3) * bend, y0 = t0 * H, y1 = t1 * H, L = Math.hypot(x1 - x0, y1 - y0), ang = Math.atan2(x1 - x0, y1 - y0);
    nnP("bark", O, "tcyl", Math.cos(dir) * (x0 + x1) / 2, (y0 + y1) / 2, -Math.sin(dir) * (x0 + x1) / 2, (0.34 - i * 0.03) * s, L * 1.04, (0.34 - i * 0.03) * s, "#f4ece0", 0, dir, -ang); px = x1; py = y1; }
  const cx = Math.cos(dir) * px, cz = -Math.sin(dir) * px; nnSp("bark", O, cx, py, cz, 0.28 * s, "#c8b8a0");
  for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU + k * 2, L = (2.4 + gh(O.x, O.z, 70 + i) * 1.1) * s; nnP("fern", O, "frond", cx, py, cz, L, L, 0.75 * s, i % 3 ? "#f0f8e0" : "#e0e8b8", 0, a, 0.35 - gh(O.x, O.z, 80 + i) * 0.5); }
  for (let i = 0; i < 3; i++) nnSp("lit", O, cx + Math.cos(i * 2.1) * 0.25 * s, py - 0.25 * s, cz + Math.sin(i * 2.1) * 0.25 * s, 0.13 * s, "#6a5a2a"); };
// a fern: low arching fronds
const gyFern = (O, s = 1) => { const n = 4 + Math.floor(gh(O.x, O.z, 21) * 3); for (let i = 0; i < n; i++) { const a = (i / n) * TAU + gh(O.x, O.z, 22) * 3, L = (0.9 + gh(O.x, O.z, 90 + i) * 0.6) * s; nnP("fern", O, "frond", 0, 0.05, 0, L, L * 1.2, 0.34 * s, i % 2 ? "#e8ffd0" : "#c8f0b8", 0, a, 0.75 + gh(O.x, O.z, 100 + i) * 0.35); } };
// banana / elephant-ear clump: broad leaves on short stems
const gyBroad = (O, s = 1) => { const n = 4 + Math.floor(gh(O.x, O.z, 23) * 3), h = (0.6 + gh(O.x, O.z, 24) * 0.9) * s; nnCy("fern", O, 0, 0, 0, 0.09 * s, h, "#d8f0b0", "stem");
  for (let i = 0; i < n; i++) { const a = (i / n) * TAU + gh(O.x, O.z, 25) * 3, L = (1.2 + gh(O.x, O.z, 110 + i) * 0.8) * s; nnP("fern", O, "broad", 0, h, 0, L, L, 0.7 * s, i % 2 ? "#f4fff0" : "#d0f0c0", 0, a, 0.5 + gh(O.x, O.z, 120 + i) * 0.4); } };
const gyBush = (O, s = 1) => { const q = gyQ(O, 3), cols = gyLeafC(q), r = 0.95 * s, cen = [0, r * 0.35, 0];
  for (let k = 0; k < 4; k++) { const a = (k / 4) * TAU + q() * 0.6, rr = r * (0.3 + q() * 0.4); nnXClump(O, q, Math.cos(a) * rr, r * (0.2 + q() * 0.4), Math.sin(a) * rr, r * 0.6, cols, cen, r * 1.1, 3); }
  nnXClump(O, q, 0, r * 0.65, 0, r * 0.6, cols, cen, r * 1.1, 3);
  if (gh(O.x, O.z, 28) < 0.3) for (let i = 0; i < 4; i++) nnSp("glow", O, (gh(O.x, O.z, 130 + i) - 0.5) * 1.2 * s, (0.6 + gh(O.x, O.z, 134 + i) * 0.5) * s, (gh(O.x, O.z, 138 + i) - 0.5) * 1.2 * s, 0.07, ["#ff7a9a", "#ffd24a", "#ff9a4a", "#f8f0ff"][Math.floor(gh(O.x, O.z, 29) * 4)]); };
const gyFlowers = (O) => { for (let i = 0; i < 5; i++) { const a = gh(O.x, O.z, 140 + i) * TAU, r = gh(O.x, O.z, 145 + i) * 0.5; nnCy("fern", O, Math.cos(a) * r, 0, Math.sin(a) * r, 0.02, 0.35, "#a8d890", "stem"); nnSp("glow", O, Math.cos(a) * r, 0.38, Math.sin(a) * r, 0.065, ["#ff6a8a", "#ffcf4a", "#fff4f8", "#c87aff", "#ff9a3a"][(i + Math.floor(gh(O.x, O.z, 150) * 5)) % 5], "ico0"); } };
const gyRock = (O, s = 1, col) => nnP("stone", O, "rock", 0, 0.2 * s, 0, 1.3 * s, 0.9 * s, 1.1 * s, col || ["#c8c0b4", "#b8b4a4", "#d0c8b0", "#a8b098"][Math.floor(gh(O.x, O.z, 31) * 4)], 0, gh(O.x, O.z, 32) * 6, 0);
const gyReeds = (O) => { for (let k = 0; k < 7; k++) { const a = gh(O.x, O.z, 160 + k) * 6.28, r = gh(O.x, O.z, 170 + k) * 0.45; nnBx("fern", O, Math.cos(a) * r, 0, Math.sin(a) * r, 0.05, 0.9 + gh(O.x, O.z, 180 + k) * 0.8, 0.05, "#c0e0a0", 0, (gh(O.x, O.z, 190 + k) - 0.5) * 0.3); } };
const gyLily = (x, z) => { const O = { x, z, floor: -0.1 }, s = 0.25 + nh(x, z, 71) * 0.25; nnCy("fern", O, 0, 0, 0, s, 0.03, "#a0d890", "cyl6"); if (nh(x, z, 72) < 0.35) nnSp("glow", O, s * 0.4, 0.08, 0, 0.07, nh(x, z, 73) < 0.5 ? "#ff9ae0" : "#fff4f0"); };
const gyFirefly = (O, y) => nnSp("glow", O, 0, y, 0, 0.045, ["#f0ff8a", "#9affd8", "#ffe28a"][Math.floor(nh(O.x, O.z, 61) * 3)], "ico0");
const gyVines = (O, w, h, d = 0) => { for (let i = 0; i < Math.round(w * 2.5); i++) { const u = (i / (w * 2.5) - 0.5) * w, L = h * (0.3 + gh(O.x + u, O.z, 200 + i) * 0.7); nnBx("fern", O, u, h - L, d, 0.07, L, 0.07, "#a8d890"); if (gh(O.x + u, O.z, 210 + i) < 0.3) gyMoss(O, u, h - L * 0.6, d + 0.1, 0.22); } };

// ---- Ystran ruins (carved sandstone, turquoise inlay, glyphs that still glow gold) ----
const STN = ["#ffffff", "#f4ece0", "#e8e8d8", "#f0e0c8", "#e0e8d0"];
const stc = (O, k) => STN[Math.floor(gh(O.x, O.z, 300 + k) * STN.length)];
const gyGlyph = (O, x, y, z, w, h, ry = 0, col = GYC.gold) => { // a glowing glyph on a face: a frame and a few strokes, never letters
  nnP("glow", O, "box", x, y, z, w, 0.05, 0.03, col, 0, ry); nnP("glow", O, "box", x, y - h * 0.5, z, 0.05, h, 0.03, col, 0, ry); const c2 = Math.cos(ry), s2 = Math.sin(ry);
  nnP("glow", O, "box", x - c2 * w * 0.3, y - h * 0.75, z + s2 * w * 0.3, w * 0.4, 0.05, 0.03, col, 0, ry); nnP("glow", O, "sph", x + c2 * w * 0.3, y - h * 0.4, z - s2 * w * 0.3, 0.09, 0.09, 0.04, col, 0, ry); };
const gyColumn = (O, h = 4, broken = 0, r = 0.42) => { nnBx("stone", O, 0, 0, 0, r * 2.6, 0.4, r * 2.6, stc(O, 1)); const top = broken ? h * (0.35 + broken * 0.4) : h; let y = 0.4, i = 0;
  while (y < top - 0.05) { const dh = Math.min(0.8, top - y); nnP("stone", O, "cyl8", (gh(O.x, O.z, 310 + i) - 0.5) * 0.04, y + dh / 2, 0, r * 2, dh - 0.02, r * 2, stc(O, 10 + i), 0, gh(O.x, O.z, 320 + i), broken && y + dh >= top - 0.05 ? (gh(O.x, O.z, 330) - 0.5) * 0.3 : 0); y += dh; i++; }
  if (!broken) { nnBx("stone", O, 0, h, 0, r * 2.7, 0.35, r * 2.7, stc(O, 2)); nnBx("stone", O, 0, h + 0.35, 0, r * 3.1, 0.25, r * 3.1, stc(O, 3)); nnP("glow", O, "box", 0, h + 0.15, r * 1.36, r * 1.6, 0.06, 0.03, GYC.turq); }
  else { nnP("stone", O, "cyl8", 0.8, 0.22, 0.3, r * 2, 0.8, r * 2, stc(O, 4), Math.PI / 2, gh(O.x, O.z, 340) * 3, 0); gyMoss(O, 0.2, top, 0.1, 0.35); }
  if (gh(O.x, O.z, 350) < 0.5) gyVines(O, 0.8, top, r + 0.05); };
// a ruined wall from (0,0) along +x for L metres, with a ragged top, a carved band and moss
const gyWall = (O, L, h = 2.4, t = 0.8, ruin = 0.6) => { for (let u = 0; u < L - 0.05; ) { const w = Math.min(L - u, 0.9 + gh(O.x + u, O.z, 360) * 0.8), hh = h * (1 - ruin * gh(O.x + u, O.z, 361) * 0.9); const bin = gh(O.x + u, O.z, 362) < 0.25 ? "carve" : "stone";
    nnBx(bin, O, u + w / 2, 0, 0, w - 0.03, hh, t, stc({ x: O.x + u, z: O.z }, 5)); if (hh > 1.2 && gh(O.x + u, O.z, 363) < 0.18) gyGlyph(O, u + w / 2, hh * 0.7, t / 2 + 0.02, 0.36, 0.4, 0, gh(O.x + u, O.z, 364) < 0.5 ? GYC.gold : GYC.turq);
    if (gh(O.x + u, O.z, 365) < 0.35) gyMoss(O, u + w / 2, hh, 0, 0.45); u += w; }
  if (gh(O.x, O.z, 366) < 0.6) gyVines(O, Math.min(L, 3), h * 0.9, t / 2 + 0.04); };
// a corbelled Ystran arch: two piers stepping in to a capstone
const gyArch = (O, w = 4, h = 4.2, t = 1.0) => { const pw = 0.9; for (const s of [-1, 1]) { nnBx("stone", O, s * (w / 2 + pw / 2), 0, 0, pw, h, t, stc(O, 6 + s)); for (let k = 0; k < 3; k++) nnBx("stone", O, s * (w / 2 - 0.25 * k - 0.1), h - 0.6 + k * 0.5, 0, 0.5 + 0.25 * k, 0.5, t, stc(O, 9 + k)); }
  nnBx("carve", O, 0, h + 0.9, 0, w + pw * 2 + 0.2, 0.7, t + 0.1, stc(O, 12)); gyGlyph(O, 0, h + 1.45, t / 2 + 0.07, 0.5, 0.45); nnP("glow", O, "box", 0, h + 0.7, t / 2 + 0.07, w * 0.8, 0.06, 0.03, GYC.turq); if (gh(O.x, O.z, 370) < 0.7) gyVines(O, w + 1, h + 1.2, t / 2 + 0.06); };
const gyStele = (O, h = 2.2) => { nnBx("stone", O, 0, 0, 0, 1.3, 0.3, 0.8, stc(O, 13)); nnBx("carve", O, 0, 0.3, 0, 0.9, h, 0.35, stc(O, 14)); nnP("stone", O, "pyr", 0, 0.3 + h + 0.2, 0, 0.95, 0.4, 0.4, stc(O, 15)); gyGlyph(O, 0, 0.3 + h * 0.8, 0.19, 0.5, 0.9, 0, GYC.gold); };
const gyGlyphStone = (O, s = 1) => { nnBx("carve", O, 0, 0, 0, 1.0 * s, 0.9 * s, 1.0 * s, stc(O, 16), gh(O.x, O.z, 371)); for (let k = 0; k < 4; k++) { const a = gh(O.x, O.z, 371) + k * Math.PI / 2; gyGlyph(O, Math.sin(a) * 0.51 * s, 0.75 * s, Math.cos(a) * 0.51 * s, 0.3 * s, 0.4 * s, a, k % 2 ? GYC.turq : GYC.gold); } };
// a fallen statue head: a calm face half sunk in moss
const gyHead = (O, s = 1.6) => { const c = "#f0e8dc"; nnP("stone", O, "blob", 0, 0.7 * s, 0, 1.5 * s, 1.7 * s, 1.5 * s, c, 0.25, 0, 0.2); nnBx("stone", O, 0, 0.55 * s, 0.68 * s, 0.24 * s, 0.5 * s, 0.3 * s, c, 0, -0.2); for (const k of [-1, 1]) { nnBx("stone", O, k * 0.32 * s, 1.0 * s, 0.62 * s, 0.4 * s, 0.06 * s, 0.12 * s, "#c8bca8", 0, -0.2); nnBx("stone", O, k * 0.7 * s, 0.75 * s, 0, 0.18 * s, 0.6 * s, 0.4 * s, c); }
  nnBx("stone", O, 0, 0.32 * s, 0.6 * s, 0.5 * s, 0.06 * s, 0.1 * s, "#c8bca8", 0, -0.2); nnP("stone", O, "dome", 0, 1.35 * s, -0.05 * s, 1.5 * s, 0.6 * s, 1.5 * s, "#d8d0c0", -0.2, 0, 0); nnP("glow", O, "sph", 0, 1.15 * s, 0.7 * s, 0.14, 0.14, 0.05, GYC.gold); gyMoss(O, -0.5 * s, 1.5 * s, -0.4 * s, 0.6 * s); };
// a stepped pyramid (ziggurat) with a stair up the front (+z), a small shrine on top
const gyPyramid = (O, w = 14, steps = 5, sh = 1.4, shrine = true) => { for (let i = 0; i < steps; i++) { const ww = w * (1 - i / (steps + 1)); nnBx(i % 2 ? "carve" : "stone", O, 0, i * sh, 0, ww, sh, ww, stc(O, 20 + i)); nnP("glow", O, "box", 0, i * sh + sh * 0.55, ww / 2 + 0.02, ww * 0.7, 0.07, 0.03, i % 2 ? GYC.gold : GYC.turq); if (gh(O.x, O.z, 380 + i) < 0.7) gyMoss(O, (gh(O.x, O.z, 390 + i) - 0.5) * ww, (i + 1) * sh, ww / 2 - 0.3, 0.7); }
  const top = steps * sh, tw = w * (1 - steps / (steps + 1)), sl = Math.hypot(top, w / 2 - tw / 2), sa = Math.atan2(top, w / 2 - tw / 2);
  for (let k = 0; k < steps * 3; k++) { const t = (k + 0.5) / (steps * 3); nnBx("stone", O, 0, t * top - top / (steps * 6), w / 2 - t * (w / 2 - tw / 2) + 0.2, 2.6, top / (steps * 3), 0.7, "#f8f0e4"); }
  for (const s of [-1, 1]) nnP("stone", O, "box", s * 1.5, top / 2, w / 2 - (w / 2 - tw / 2) / 2 + 0.2, 0.4, 0.5, sl, "#e8e0d0", sa, 0, 0);
  if (shrine) { const sw = Math.max(2.6, tw * 0.75); for (const s of [-1, 1]) nnBx("stone", O, s * (sw / 2 - 0.3), top, 0, 0.6, 2.4, sw, stc(O, 30)); nnBx("stone", O, 0, top, -sw / 2 + 0.3, sw, 2.4, 0.6, stc(O, 31)); nnBx("carve", O, 0, top + 2.4, 0, sw + 0.4, 0.6, sw + 0.4, stc(O, 32)); nnP("stone", O, "pyr", 0, top + 3.3, 0, sw, 1.2, sw, stc(O, 33));
    nnBx("glow", O, 0, top + 0.6, -sw / 2 + 0.62, 1.0, 1.2, 0.04, GYC.gold); gyGlyph(O, 0, top + 2.95, sw / 2 + 0.22, 0.6, 0.5); } };
// a temple front: plinth steps, a row of columns, a carved entablature and a dark doorway
const gyTemple = (O, w = 12, d = 7, h = 5) => { for (let k = 0; k < 3; k++) nnBx("stone", O, 0, k * 0.3, d / 2 + 1.2 - k * 0.5, w + 1.6 - k * 0.4, 0.3, 1.0, "#f4ece0"); nnBx("stone", O, 0, 0, 0, w, 0.9, d, stc(O, 34));
  nnBx("stone", O, 0, 0.9, -0.4, w - 1.6, h, d - 1.6, stc(O, 35)); nnBx("glow", O, 0, 0.9, d / 2 - 1.18, 1.8, 2.8, 0.04, "#1a1408"); nnBx("deco", O, 0, 0.9, d / 2 - 1.2, 2.2, 3.1, 0.06, "#3a3020");
  const nc = Math.max(4, Math.round(w / 2.2)); for (let i = 0; i < nc; i++) { const x = -w / 2 + 0.8 + (i * (w - 1.6)) / (nc - 1); if (Math.abs(x) < 1.4) continue; gyColumn(gyAt(O, x, d / 2 - 0.6), h, 0, 0.35); }
  nnBx("carve", O, 0, h + 0.9, 0.2, w, 0.9, d - 0.6, stc(O, 36)); for (let k = 0; k < 3; k++) nnBx("stone", O, 0, h + 1.8 + k * 0.5, 0.2, w - 1.2 - k * 2.2, 0.5, d - 1.2 - k * 1.4, stc(O, 37 + k));
  for (let i = 0; i < 5; i++) gyGlyph(O, -w / 2 + 1.5 + i * ((w - 3) / 4), h + 1.6, d / 2 - 0.08, 0.4, 0.5, 0, i % 2 ? GYC.turq : GYC.gold); if (gh(O.x, O.z, 395) < 0.8) gyVines(O, w * 0.6, h + 1.5, d / 2 - 0.05); };
// columns inside gyTemple: shift the column spot by a local offset (the batches only take a grid spot)
const gyAt = (O, lx, lz, ry = 0) => { const c = Math.cos(O.ry || 0), s = Math.sin(O.ry || 0); return { x: O.x + lx * c + lz * s, z: O.z - lx * s + lz * c, ry: (O.ry || 0) + ry }; };
// chimes: a timber post or a stone tower hung with brass tubes; they ring in the wind
const gyChimes = (O, x, y, z, n = 5) => { for (let i = 0; i < n; i++) { const u = (i - (n - 1) / 2) * 0.16, L = 0.5 + (i % 3) * 0.22; nnCy("lit", O, x + u, y - L - 0.08, z, 0.035, L, "#d8a848"); nnBx("deco", O, x + u, y - 0.08, z, 0.012, 0.08, 0.012, "#3a2a1a"); } nnBx("lit", O, x, y - 0.02, z, n * 0.18, 0.06, 0.1, "#6a4a2a"); };
const gyChimePost = (O) => { nnBx("lit", O, 0, 0, 0, 0.18, 2.6, 0.18, "#8a6a4a"); nnBx("lit", O, 0.4, 2.45, 0, 1.1, 0.12, 0.12, "#8a6a4a"); gyChimes(O, 0.55, 2.4, 0, 5); nnSp("glow", O, 0, 2.7, 0, 0.09, GYC.turq); };
const gyChimeTower = (O, h = 7) => { nnBx("stone", O, 0, 0, 0, 2.4, 0.6, 2.4, stc(O, 40)); for (const [a, b] of [[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]]) nnCy("lit", O, a, 0.6, b, 0.09, h, "#b8a070"); for (let y = 2; y < h; y += 2) for (const s of [-1, 1]) { nnBx("lit", O, 0, 0.6 + y, s * 0.9, 1.9, 0.08, 0.08, "#9a7a50"); nnBx("lit", O, s * 0.9, 0.6 + y, 0, 0.08, 0.08, 1.9, "#9a7a50"); }
  nnP("lit", O, "pyr", 0, h + 1.1, 0, 2.8, 1.2, 2.8, "#c8a878"); for (let q = 0; q < 4; q++) gyChimes({ x: O.x, z: O.z, ry: (O.ry || 0) + q * Math.PI / 2 }, 0, h + 0.3, 1.05, 6); nnSp("glow", O, 0, h + 1.8, 0, 0.16, GYC.gold); };
// stone lantern beside the paths, and a brazier for the plazas
const gyLantern = (O) => { nnBx("stone", O, 0, 0, 0, 0.5, 0.25, 0.5, "#e8e0d0"); nnBx("stone", O, 0, 0.25, 0, 0.26, 1.15, 0.26, "#f0e8dc"); nnBx("stone", O, 0, 1.4, 0, 0.5, 0.1, 0.5, "#e0d8c8"); nnBx("glow", O, 0, 1.5, 0, 0.32, 0.36, 0.32, "#ffd890"); nnP("stone", O, "pyr", 0, 2.05, 0, 0.62, 0.36, 0.62, "#e8e0d0"); };
const gyBrazier = (O) => { nnCy("stone", O, 0, 0, 0, 0.35, 0.8, "#e8e0d0"); nnCy("lit", O, 0, 0.8, 0, 0.55, 0.25, "#8a6a3a"); nnP("glow", O, "cone", 0, 1.3, 0, 0.6, 0.6, 0.6, "#ffb347"); nnSp("glow", O, 0, 1.25, 0, 0.25, "#fff0b0"); };
const gyUrn = (O) => { nnP("stone", O, "blob", 0, 0.4, 0, 0.8, 0.8, 0.8, "#e8d8c0"); nnCy("stone", O, 0, 0.7, 0, 0.3, 0.2, "#e0d0b8"); for (let i = 0; i < 7; i++) nnP("fern", O, "frond", 0, 0.85, 0, 0.7, 0.8, 0.26, "#d8f8c0", 0, i * 0.9, 0.5); };
const gyBench = (O) => { nnBx("stone", O, 0, 0.42, 0, 1.8, 0.14, 0.5, "#f0e8dc"); for (const s of [-0.65, 0.65]) nnBx("stone", O, s, 0, 0, 0.3, 0.42, 0.45, "#e0d8c8"); };
// ---- the Dig Camp ----
const gyTent = (O, w = 3.2, d = 2.6, h = 2.2, col = "#f4ead0") => { const sl = Math.hypot(w / 2, h), a = Math.atan2(h, w / 2); for (const s of [-1, 1]) nnP("deco", O, "box", s * w / 4, h / 2, 0, sl, 0.05, d, col, 0, 0, s * -a);
  nnP("lit", O, "pyr", 0, h / 2, -d / 2 + 0.02, w, h, 0.05, "#e8dcc0"); nnBx("glow", O, 0, 0, d / 2, w * 0.35, h * 0.7, 0.03, "#2a2014"); for (const s of [-1, 1]) nnCy("lit", O, 0, 0, s * (d / 2 + 0.05), 0.04, h + 0.15, "#6a4a2a"); nnBx("lit", O, 0, h - 0.04, 0, 0.07, 0.07, d + 0.3, "#6a4a2a");
  for (const s of [-1, 1]) for (const z of [-d / 2, d / 2]) nnP("deco", O, "box", s * (w / 2 + 0.6), 0.55, z, 0.02, 1.4, 0.02, "#c8b088", 0, 0, s * 0.9); };
const gyAwning = (O, w = 5, d = 3, h = 2.4, col = "#e8dcc0") => { for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) nnCy("lit", O, a * w / 2, 0, b * d / 2, 0.06, h + (b < 0 ? 0.3 : 0), "#7a5a3a"); nnP("deco", O, "box", 0, h + 0.15, 0, w + 0.4, 0.04, d + 0.4, col, -0.1, 0, 0); };
const gyTable = (O, maps = true) => { nnBx("lit", O, 0, 0.74, 0, 1.6, 0.06, 0.9, "#8a6a4a"); for (const [a, b] of [[-0.7, -0.38], [0.7, -0.38], [-0.7, 0.38], [0.7, 0.38]]) nnBx("lit", O, a, 0, b, 0.06, 0.74, 0.06, "#6a4a2a"); if (maps) { nnBx("deco", O, -0.2, 0.8, 0, 0.7, 0.01, 0.5, "#e8dcb0", 0.2); nnBx("deco", O, 0.45, 0.8, 0.1, 0.4, 0.01, 0.3, "#d8c8a0", -0.3); nnCy("lit", O, 0.5, 0.8, -0.25, 0.06, 0.2, "#c89a48"); } };
const gyCrates = (O, n = 4) => { for (let i = 0; i < n; i++) { const s = 0.5 + gh(O.x, O.z, 400 + i) * 0.3, a = i * 1.7, r = i ? 0.7 : 0; nnBx("lit", O, Math.cos(a) * r, i === n - 1 && n > 2 ? 0.55 : 0, Math.sin(a) * r, s, s, s, ["#a07a4a", "#8a6a3a", "#b08a5a"][i % 3], gh(O.x, O.z, 410 + i)); } };
const gyBarrow = (O) => { nnBx("lit", O, 0, 0.35, 0, 1.0, 0.35, 0.6, "#5a6a6a", 0, 0.1); nnP("lit", O, "dome", 0, 0.68, 0, 0.9, 0.3, 0.55, "#6a4a2a"); nnP("lit", O, "cyl", 0.6, 0.2, 0, 0.36, 0.06, 0.36, "#2a2a2a", Math.PI / 2, 0, 0); for (const s of [-1, 1]) nnBx("lit", O, -0.75, 0.5, s * 0.22, 0.8, 0.05, 0.05, "#7a5a3a", 0, -0.3); };
const gySieve = (O) => { for (const s of [-1, 1]) nnBx("lit", O, s * 0.8, 0, 0, 0.06, 0.8, 0.06, "#7a5a3a"); nnBx("lit", O, 0, 0.75, 0, 1.6, 0.08, 0.9, "#8a6a4a", 0, 0.12); nnBx("deco", O, 0, 0.8, 0, 1.4, 0.01, 0.7, "#5a5a5a", 0, 0.12); };
const gyDigGrid = (O, w = 4, d = 3) => { nnBx("deco", O, 0, -0.02, 0, w, 0.04, d, "#4a3420"); for (let i = 0; i <= Math.round(w); i++) { const x = -w / 2 + (i * w) / Math.round(w); nnCy("lit", O, x, 0, -d / 2, 0.03, 0.45, "#c8a878"); nnCy("lit", O, x, 0, d / 2, 0.03, 0.45, "#c8a878"); nnBx("deco", O, x, 0.4, 0, 0.012, 0.012, d, "#f0e8d0"); }
  for (let j = 0; j <= Math.round(d); j++) nnBx("deco", O, 0, 0.4, -d / 2 + (j * d) / Math.round(d), w, 0.012, 0.012, "#f0e8d0"); for (let k = 0; k < 4; k++) nnBx("stone", O, (gh(O.x, O.z, 420 + k) - 0.5) * w * 0.8, 0, (gh(O.x, O.z, 424 + k) - 0.5) * d * 0.8, 0.4, 0.15, 0.3, "#e8d8c0", gh(O.x, O.z, 428 + k) * 3);
  nnBx("lit", O, w / 2 + 0.5, 0, 0, 0.05, 1.3, 0.05, "#7a5a3a", 0, 0.3); nnBx("lit", O, w / 2 + 0.6, 1.1, 0, 0.3, 0.3, 0.04, "#8a8a8a", 0, 0.3); };
const gyToolRack = (O) => { nnBx("lit", O, 0, 1.1, 0, 1.6, 0.08, 0.08, "#7a5a3a"); for (const s of [-0.75, 0.75]) nnBx("lit", O, s, 0, 0, 0.08, 1.4, 0.08, "#7a5a3a"); for (let i = 0; i < 4; i++) { const x = -0.5 + i * 0.33; nnBx("lit", O, x, 0.1, 0.06, 0.04, 1.3, 0.04, "#8a6a4a", 0, 0.08); nnBx("lit", O, x, 0.05, 0.08, i % 2 ? 0.22 : 0.5, 0.25, 0.03, "#7a7a7a", 0, 0.08); } };
const gyScaffold = (O, w = 4, h = 4) => { for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) nnCy("lit", O, a * w / 2, 0, b * 0.7, 0.06, h, "#c8b070"); for (let y = 1.3; y < h; y += 1.3) { nnBx("lit", O, 0, y, 0, w + 0.2, 0.1, 1.6, "#a08050"); nnBx("lit", O, 0, y + 0.9, 0.75, w, 0.05, 0.05, "#c8b070"); } nnP("lit", O, "box", 0, h / 2, -0.7, 0.06, Math.hypot(w, h), 0.06, "#c8b070", 0, 0, Math.atan2(w, h)); };
const gyLookout = (O, h = 6) => { for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) nnCy("lit", O, a * 0.9, 0, b * 0.9, 0.09, h, "#c8b070"); nnBx("lit", O, 0, h, 0, 2.4, 0.14, 2.4, "#9a7a4a"); for (const s of [-1, 1]) { nnBx("lit", O, 0, h + 0.9, s * 1.15, 2.4, 0.06, 0.06, "#c8b070"); nnBx("lit", O, s * 1.15, h + 0.9, 0, 0.06, 0.06, 2.4, "#c8b070"); }
  for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) nnCy("lit", O, a * 1.1, h, b * 1.1, 0.05, 1.9, "#c8b070"); nnP("lit", O, "pyr", 0, h + 2.4, 0, 3.2, 1.0, 3.2, "#d8c098"); for (let y = 0.6; y < h; y += 0.55) nnBx("lit", O, 1.0, y, 1.0, 0.04, 0.04, 0.5, "#a08050", Math.PI / 4); nnBx("glow", O, 0.9, h + 1.2, 0.9, 0.18, 0.24, 0.18, "#ffd890"); };
const gyFlag = (O, h = 4, col = GYC.turq) => { const cloth = col === GYC.gold ? "#8a5a22" : "#1f5f5c", trim = col === GYC.gold ? GYC.turq : GYC.gold;
  nnCy("lit", O, 0, 0, 0, 0.06, h, "#6a4a2e"); nnSp("glow", O, 0, h + 0.08, 0, 0.09, col); nnBx("lit", O, 0.5, h - 0.3, 0, 1.15, 0.06, 0.06, "#6a4a2e");
  nnBx("deco", O, 0.55, h - 1.75, 0, 0.9, 1.4, 0.03, cloth); nnP("deco", O, "pyr", 0.55, h - 2.0, 0, 0.9, 0.5, 0.03, cloth, Math.PI, 0, 0);
  nnBx("glow", O, 0.55, h - 0.5, 0.02, 0.9, 0.05, 0.03, trim); for (const z of [0.025, -0.025]) gyGlyph(O, 0.55, h - 1.15, z, 0.5, 0.55, z < 0 ? Math.PI : 0, col); };
const gyCampfire = (O) => { for (let k = 0; k < 8; k++) { const a = (k / 8) * TAU; nnP("stone", O, "rock", Math.cos(a) * 0.6, 0.08, Math.sin(a) * 0.6, 0.35, 0.22, 0.3, "#c8c0b0"); } for (let k = 0; k < 3; k++) nnP("lit", O, "cyl", 0, 0.15, 0, 0.12, 0.9, 0.12, "#4a3020", Math.PI / 2, k * 1.05, 0); nnP("glow", O, "cone", 0, 0.45, 0, 0.5, 0.7, 0.5, "#ffa040"); nnSp("glow", O, 0, 0.3, 0, 0.2, "#ffe0a0"); };
const gyLog = (O) => { nnP("bark", O, "cyl8", 0, 0.25, 0, 0.5, 2.0, 0.5, "#e0d8d0", 0, 0, Math.PI / 2); gyMoss(O, 0.4, 0.5, 0.1, 0.25); nnSp("glow", O, -0.5, 0.48, 0.15, 0.06, "#ffcf9a"); };
const gyBoat = (x, z, ry = 0) => thBoat(x, z, ry, "#8a5a34");
// a quest spot: a carved stele with a floating gold diamond over it
const gyQuest = (x, z, id, label, ry = 0) => { NNQ.push({ id, label, x, z }); const O = { x, z, ry }; gyStele(O, 1.6); nnP("glow", O, "sph", 0, 3.0, 0, 0.45, 0.6, 0.45, "#ffe23a"); nnP("glow", O, "ring", 0, 0.06, 0, 1.0, 1, 1.0, "#ffe23a"); };
// a sign over a walk-in door: a timber board with a turquoise glyph and two lanterns
const gySign = (key, x0, y0, w, d) => { const S2 = SHACK[key]; if (!S2) return; const ST = FXSTY[S2.st] || {}, hw = Math.min(w / 2 - 0.3, S2.wide ? 5 : 4.2), hd = Math.min(d / 2 - 0.15, 3.2), cx = x0 + w / 2, cz = y0 + d / 2 - 0.35, O = { abs: true, x: cx, y: GHT(cx, cz), z: cz };
  nnBx("lit", O, 0, 2.62, hd + 0.33, 1.7, 0.5, 0.08, "#7a5a3a"); gyGlyph(O, 0, 2.98, hd + 0.39, 0.4, 0.34, 0, ST.clinic ? GYC.turq : ST.store ? GYC.gold : GYC.jade); for (const s of [-1, 1]) { nnBx("lit", O, s * 1.25, 2.2, hd + 0.45, 0.05, 0.05, 0.4, "#3a2a1a"); nnBx("glow", O, s * 1.25, 1.88, hd + 0.62, 0.16, 0.24, 0.16, "#ffd890"); } };
Object.assign(TGK, {
  jungle: { lo: "#1e4a1a", hi: "#9ad86a", seed: "#ffe27a", mons: ["lo_chirpod", "lo_sporix", "lo_tiktrill", "lo_mycora"] },
  ruin: { lo: "#3a4a2a", hi: "#d8d07a", seed: "#ffcf4a", mons: ["lo_pebblet", "lo_gleamgrub", "lo_liftant", "lo_dunetrot"] },
  tide: { lo: "#103a3a", hi: "#6ae0c0", seed: "#bff8ff", mons: ["lo_gloopa", "lo_coilet", "lo_mycora", "lo_gloopa"] },
  orchid: { lo: "#3a2a4a", hi: "#e09ae8", seed: "#ffd0f8", mons: ["lo_dreamcap", "lo_blinkit", "lo_sporix", "lo_hivemaw"] } });
