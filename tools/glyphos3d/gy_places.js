// ================= GLYPHOS INTERIORS (pack section 6): Temple of Trials, Temple of Voices and its Mural Hall, the Relay Tower, the Helix Hideout =================
// Every room is built at true scale (1 tile = 1 metre, the player stands about 1.7 m, doorways 3 m wide) and matches the building it sits in out in the world:
//   Temple of Trials   22 x 18 hall, the arena on its roof                     (scene YV, building 22 x 18)
//   Temple of Voices   four stepped tiers 22x20, 18x16, 14x12, shrine 12x10    (scene Y9, a pyramid of the same tiers)
//   Relay Tower        five floors 18, 17, 16, 15, roof 14 (5.4 m a storey)    (scene YR, a tower of the same floors)
//   Helix Hideout      a 22 x 18 lab dug under the Dig Camp Storehouse         (scene Y4, a cellar hatch beside the storehouse)
// Furniture goes in the merged detail batches at fixed spots ({abs: true}), so a room costs only a handful of draw calls.
NND.floor = []; NND.plate = [];
GYBIN.floor = () => gyTri("gyBFloor", "ashlar", 0.5, { vc: true, r: 0.82 });
GYBIN.plate = () => fxM("rivplate", { c: "#c4ccd0", s: 0.5, m: 0.15, r: 0.55 });
FXA.gyAsh = () => gyTri("gyWAsh", "ashlar", 0.25, { c: "#f0e4cc", r: 0.92 });
FXA.gyAshD = () => gyTri("gyWAshD", "ashlar", 0.25, { c: "#c8b898", r: 0.92 });
FXA.gyLab = () => fxM("rivplate", { c: "#c8d0d4", s: 0.6, m: 0.12, r: 0.6 });
Object.assign(PSTY, {
  gytemple: { ebase: "#1c160c", floor: ["#d8c8a6", "#cbbb98", "#e2d4b6"], stone: "#c8b896", wall: "#efe3cc", moss: "#8a9a6a", glow: [GYC.turq, GYC.gold], wallH: 7, room: 1, flat: 1, clean: 1, fxWall: "gyAsh", ribM: "gyAshD", noRib: 1 },
  gyroof: { ebase: "#000", floor: ["#d8c8a6", "#cbbb98", "#e2d4b6"], stone: "#c8b896", wall: "#efe3cc", moss: "#8a9a6a", glow: [GYC.turq, GYC.gold], wallH: 1.3, room: 1, flat: 1, clean: 1, fxWall: "gyAsh", ribM: "gyAshD", noRib: 1 },
  gylab: { ebase: "#0a1214", floor: ["#4e5458", "#484e52", "#545a5e"], stone: "#3a4044", wall: "#7a8288", moss: "#2a3a3a", glow: ["#7affc8", "#c86aff"], wallH: 3.8, room: 1, flat: 1, clean: 1, fxWall: "gyLab", ribM: "gyLab", noRib: 1 } });

// ---------- helpers ----------
const gpRoom = (w, d) => { const g = PLW(w, d); pRect(g, 1, 1, w - 2, d - 2, "."); return g; };
const gpA = (X, Z) => (x, z, ry = 0, y = 0) => ({ abs: true, x: X(x), y, z: Z(z), ry });
// a spot on an inside wall face, facing into the room (local +z points into the room)
const gpWallAt = (A, W, D, side, u) => side === "n" ? A(u, 1.02) : side === "s" ? A(u, D - 1.02, Math.PI) : side === "w" ? A(1.02, u, Math.PI / 2) : A(W - 1.02, u, -Math.PI / 2);
const gpHash = (x, z, k) => nh(x * 1.7 + k, z * 2.3 - k, k);
// flagstones over every floor tile; runner(x, y) marks the tiles of a carpet of darker inlaid stone
const gpFlags = (A, g, cols, runner) => { for (let y = 0; y < g.length; y++) for (let x = 0; x < g[0].length; x++) { const c = g[y][x]; if (!".,So".includes(c)) continue; const q = gpHash(x, y, 7), run = runner && runner(x, y);
    nnBx("floor", A(x + 0.5, y + 0.5), 0, -0.05, 0, 0.965, 0.08, 0.965, run ? ["#a8906a", "#9c8662", "#b09872"][Math.floor(q * 3)] : cols[Math.floor(q * cols.length)]); } };
const gpPlates = (A, g, cols) => { for (let y = 0; y < g.length; y++) for (let x = 0; x < g[0].length; x++) { if (!".,So".includes(g[y][x])) continue; nnBx("plate", A(x + 0.5, y + 0.5), 0, -0.05, 0, 0.985, 0.08, 0.985, cols[Math.floor(gpHash(x, y, 9) * cols.length)]); } };
// a turquoise inlay line between two points on the floor
const gpInlay = (A, x0, z0, x1, z1, col = GYC.turq) => { const L = Math.hypot(x1 - x0, z1 - z0); nnP("glow", A((x0 + x1) / 2, (z0 + z1) / 2), "box", 0, 0.035, 0, 0.07, 0.012, L, col, 0, Math.atan2(x1 - x0, z1 - z0)); };
const gpRingInlay = (A, cx, cz, rx, rz, n = 40, col = GYC.turq) => { for (let k = 0; k < n; k++) { const a0 = (k / n) * TAU, a1 = ((k + 0.8) / n) * TAU; gpInlay(A, cx + Math.cos(a0) * rx, cz + Math.sin(a0) * rz, cx + Math.cos(a1) * rx, cz + Math.sin(a1) * rz, col); } };
// flat pilaster against a wall, with a turquoise rune strip
const gpPilaster = (O, h) => { nnBx("stone", O, 0, 0, 0.2, 1.0, 0.55, 0.4, "#ece0c8"); nnBx("stone", O, 0, 0.55, 0.14, 0.76, h - 1.25, 0.28, "#f2e8d4"); nnBx("carve", O, 0, h - 0.7, 0.2, 1.06, 0.7, 0.4, "#e8dcc2"); nnP("glow", O, "box", 0, 0.55 + (h - 1.25) / 2, 0.29, 0.07, (h - 1.25) * 0.7, 0.02, GYC.turq); };
// a carved frieze band along the four walls, glyphs every couple of metres
const gpFrieze = (A, W, D, y, h = 0.7, skip) => { for (const side of ["n", "s", "w", "e"]) { const L = side === "n" || side === "s" ? W - 2 : D - 2; for (let u = 1; u < L + 1 - 0.05; u += 1) { const O = gpWallAt(A, W, D, side, u + 0.5); if (skip && skip(side, u + 0.5)) continue; nnBx("carve", O, 0, y, 0.12, 1.0, h, 0.24, (u % 2) ? "#e8dcc2" : "#e2d4b8"); if (u % 2 === 0) gyGlyph(O, 0, y + h * 0.82, 0.25, 0.38, h * 0.6, 0, (u % 4) ? GYC.turq : GYC.gold); } } };
const gpBanner = (O, y, w = 1.2, h = 2.6, col = GYC.turq) => { const cloth = col === GYC.gold ? "#8a5a22" : "#1f5f5c", trim = col === GYC.gold ? GYC.turq : GYC.gold; nnBx("lit", O, 0, y, 0.14, w + 0.3, 0.07, 0.07, "#6a4a2a");
  nnBx("deco", O, 0, y - h, 0.1, w, h, 0.03, cloth); nnP("deco", O, "pyr", 0, y - h - 0.22, 0.1, w * 1.4, 0.45, 0.03, cloth, Math.PI, Math.PI / 4, 0); nnBx("glow", O, 0, y - 0.25, 0.12, w, 0.05, 0.02, trim); gyGlyph(O, 0, y - h * 0.35, 0.125, w * 0.45, h * 0.35, 0, trim); };
const gpSconce = (O, y, col = "#ffd890") => { nnBx("lit", O, 0, y - 0.3, 0.12, 0.12, 0.3, 0.24, "#6a4a2a"); nnP("lit", O, "cyl", 0, y, 0.26, 0.32, 0.12, 0.32, "#8a6a3a"); nnP("glow", O, "cone", 0, y + 0.22, 0.26, 0.22, 0.32, 0.22, col); };
const gpWindow = (O, y, w = 0.7, h = 2.0) => { nnBx("glow", O, 0, y, 0.03, w, h, 0.03, "#bfe8f4"); nnBx("stone", O, 0, y - 0.18, 0.1, w + 0.4, 0.18, 0.22, "#e2d4b6"); nnBx("stone", O, 0, y + h, 0.1, w + 0.4, 0.22, 0.22, "#e2d4b6"); for (const s of [-1, 1]) nnBx("stone", O, s * (w / 2 + 0.1), y, 0.08, 0.2, h, 0.16, "#e8dcc2"); nnBx("lit", O, 0, y + h / 2, 0.05, 0.05, h, 0.05, "#5a4a3a"); };
// stairs rising away from the room into a dark arch in the wall: foot at O, climbing along local -z
const gpStairUp = (O, w = 3, n = 9, rise = 0.4, run = 0.42, wallH = 7) => { for (let k = 0; k < n; k++) { nnBx("stone", O, 0, 0, -k * run - run / 2, w, (k + 1) * rise, run, k % 2 ? "#e8dcc4" : "#f0e6d2"); nnBx("glow", O, 0, (k + 1) * rise - 0.02, -k * run - 0.04, w * 0.8, 0.025, 0.03, GYC.turq); }
  const top = n * rise, back = -n * run; for (const s of [-1, 1]) { nnP("stone", O, "box", s * (w / 2 + 0.18), top / 2 + 0.45, back / 2, 0.36, 0.5, Math.hypot(top, back) + 0.3, "#d8ccb2", Math.atan2(top, -back), 0, 0); nnBx("stone", O, s * (w / 2 + 0.18), 0, -0.1, 0.42, 1.3, 0.42, "#e2d6bc"); nnP("glow", O, "sph", s * (w / 2 + 0.18), 1.42, -0.1, 0.18, 0.18, 0.18, GYC.gold); }
  nnBx("glow", O, 0, top, back - 0.02, w, Math.min(2.6, Math.max(1.8, wallH - top - 0.4)), 0.04, "#0c0a08"); nnBx("carve", O, 0, top + Math.min(2.6, Math.max(1.8, wallH - top - 0.4)), back + 0.1, w + 0.8, 0.5, 0.3, "#e2d4b8"); gyGlyph(O, 0, top + Math.min(2.6, Math.max(1.8, wallH - top - 0.4)) + 0.45, back + 0.27, 0.4, 0.36); };
// a stairwell going down: void tiles in the grid (the floor drops away), steps sinking along local -z, a balustrade on three sides
const gpStairDown = (O, w = 3, d = 3) => { for (let k = 0; k < Math.floor((d - 0.3) / 0.36) + 1; k++) nnBx("stone", O, 0, -0.35 - k * 0.35 - 0.3, -0.25 - k * 0.36, w - 0.1, 0.3, 0.38, k % 2 ? "#cfc2a6" : "#d8ccb2");
  for (const s of [-1, 1]) { nnBx("stone", O, s * (w / 2 + 0.12), 0, -d / 2, 0.24, 0.95, d, "#e8dcc4"); nnBx("carve", O, s * (w / 2 + 0.12), 0.95, -d / 2, 0.34, 0.12, d + 0.1, "#e2d4b8"); } nnBx("stone", O, 0, 0, -d - 0.12, w + 0.48, 0.95, 0.24, "#e8dcc4"); nnBx("carve", O, 0, 0.95, -d - 0.12, w + 0.58, 0.12, 0.34, "#e2d4b8");
  for (let k = 0; k < 4; k++) nnSp("glow", O, (k - 1.5) * (w / 3.5), 1.1, -d - 0.12, 0.06, GYC.turq); };
const gpChest = (O, col = "#7a4a24") => { nnBx("lit", O, 0, 0, 0, 0.95, 0.55, 0.62, col); nnP("lit", O, "cyl", 0, 0.55, 0, 0.62, 0.95, 0.62, col, 0, 0, Math.PI / 2); for (const s of [-0.32, 0.32]) { nnBx("lit", O, s, 0, 0, 0.08, 0.6, 0.66, "#d8a848"); nnP("lit", O, "cyl", s, 0.55, 0, 0.67, 0.08, 0.67, "#d8a848", 0, 0, Math.PI / 2); } nnBx("glow", O, 0, 0.42, 0.32, 0.14, 0.16, 0.03, GYC.gold); };
const gpUrnFern = (O) => { gyUrn(O); };
const gpBowl = (O, y = 0.95, col = GYC.turq) => { nnP("lit", O, "dome", 0, y, 0, 0.6, 0.25, 0.6, "#c89a48", Math.PI, 0, 0); nnP("glow", O, "cyl", 0, y - 0.04, 0, 0.42, 0.02, 0.42, col); };
const gpPedestal = (O, h = 0.9) => { nnBx("stone", O, 0, 0, 0, 0.8, 0.18, 0.8, "#e2d6bc"); nnBx("stone", O, 0, 0.18, 0, 0.56, h - 0.36, 0.56, "#f0e6d2"); nnBx("carve", O, 0, h - 0.18, 0, 0.8, 0.18, 0.8, "#e8dcc2"); };
// a glass case: a transparent box over a pedestal (its own little mesh)
const gpGlass = (x, y, z, w, h, d) => { const m = add(new THREE.BoxGeometry(w, h, d), thM("gyGlass", () => std({ color: "#cfeff0", roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.22, depthWrite: false })), [x, y, z]); m.name = "nocol"; return m; };
const gpLanternHang = (O, x, y, z, top, col = "#ffd890") => { nnBx("deco", O, x, y + 0.5, z, 0.02, top - y - 0.5, 0.02, "#3a2a1a"); nnP("lit", O, "pyr", x, y + 0.55, z, 0.42, 0.22, 0.42, "#8a6a3a"); nnBx("glow", O, x, y, z, 0.26, 0.36, 0.26, col); nnBx("lit", O, x, y - 0.06, z, 0.34, 0.06, 0.34, "#8a6a3a"); };

// ---------- the painted murals of the Mural Hall ----------
const gpCanvasT = (w, h, draw) => { const c = document.createElement("canvas"); c.width = w; c.height = h; const g2 = c.getContext("2d"); draw(g2, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
const gpFresco = (g2, w, h, seed) => { const gr = g2.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#e8d2a8"); gr.addColorStop(1, "#d8be90"); g2.fillStyle = gr; g2.fillRect(0, 0, w, h); for (let k = 0; k < 900; k++) { g2.fillStyle = `rgba(${R() < 0.5 ? "120,90,50" : "255,245,220"},${0.04 + R() * 0.06})`; g2.beginPath(); g2.arc(R() * w, R() * h, 2 + R() * 14, 0, TAU); g2.fill(); } };
const gpFrescoEnd = (g2, w, h) => { g2.strokeStyle = "rgba(70,50,30,0.5)"; g2.lineWidth = 1.5; for (let k = 0; k < 9; k++) { let x = R() * w, y = R() * h; g2.beginPath(); g2.moveTo(x, y); for (let s = 0; s < 12; s++) { x += (R() - 0.5) * 40; y += R() * 26; g2.lineTo(x, y); } g2.stroke(); }
  g2.lineWidth = 22; g2.strokeStyle = "#7a3a20"; g2.strokeRect(11, 11, w - 22, h - 22); g2.lineWidth = 6; g2.strokeStyle = "#2a9a8e"; g2.strokeRect(26, 26, w - 52, h - 52);
  g2.fillStyle = "#e0b040"; for (let x = 40; x < w - 30; x += 46) { g2.fillRect(x, 4, 18, 14); g2.fillRect(x + 14, h - 18, 18, 14); } for (let y = 40; y < h - 30; y += 46) { g2.fillRect(4, y, 14, 18); g2.fillRect(w - 18, y + 14, 14, 18); } };
const gpFig = (g2, x, y, s, col, arms = 1) => { g2.fillStyle = col; g2.beginPath(); g2.arc(x, y - s * 1.55, s * 0.32, 0, TAU); g2.fill(); g2.beginPath(); g2.moveTo(x - s * 0.36, y); g2.lineTo(x - s * 0.22, y - s * 1.2); g2.lineTo(x + s * 0.22, y - s * 1.2); g2.lineTo(x + s * 0.36, y); g2.fill(); g2.lineWidth = s * 0.14; g2.strokeStyle = col; g2.beginPath(); g2.moveTo(x - s * 0.2, y - s * 1.1); g2.lineTo(x - s * 0.65, y - s * (arms ? 1.75 : 0.6)); g2.moveTo(x + s * 0.2, y - s * 1.1); g2.lineTo(x + s * 0.65, y - s * (arms ? 1.75 : 0.6)); g2.stroke(); };
const GPMURAL = {
  sun: (g2, w, h) => { gpFresco(g2, w, h, 1); g2.fillStyle = "#3fb8b0"; g2.fillRect(30, 30, w - 60, h * 0.55); const cx = w / 2, cy = h * 0.3;
    g2.fillStyle = "#f0b830"; for (let k = 0; k < 24; k++) { const a = (k / 24) * TAU; g2.beginPath(); g2.moveTo(cx + Math.cos(a - 0.07) * 70, cy + Math.sin(a - 0.07) * 70); g2.lineTo(cx + Math.cos(a) * (k % 2 ? 150 : 190), cy + Math.sin(a) * (k % 2 ? 150 : 190)); g2.lineTo(cx + Math.cos(a + 0.07) * 70, cy + Math.sin(a + 0.07) * 70); g2.fill(); }
    g2.fillStyle = "#ffd860"; g2.beginPath(); g2.arc(cx, cy, 82, 0, TAU); g2.fill(); g2.fillStyle = "#c8781e"; g2.beginPath(); g2.arc(cx, cy, 58, 0, TAU); g2.fill(); g2.fillStyle = "#ffe8a0"; for (const s of [-1, 1]) { g2.beginPath(); g2.arc(cx + s * 20, cy - 8, 8, 0, TAU); g2.fill(); } g2.fillRect(cx - 18, cy + 20, 36, 6);
    for (const [px, pw, ph] of [[w * 0.2, 170, 120], [w * 0.5, 230, 165], [w * 0.8, 170, 120]]) for (let s = 0; s < 5; s++) { g2.fillStyle = s % 2 ? "#b88a58" : "#c89a64"; const sw = pw * (1 - s / 6), sh = ph / 5; g2.fillRect(px - sw / 2, h * 0.86 - (s + 1) * sh, sw, sh); }
    g2.fillStyle = "#6a8a3a"; g2.fillRect(30, h * 0.86, w - 60, h * 0.14 - 30); for (let k = 0; k < 9; k++) gpFig(g2, 70 + k * ((w - 140) / 8), h * 0.92, 26, k % 2 ? "#5a2a14" : "#7a3a1a", 1); gpFrescoEnd(g2, w, h); },
  seed: (g2, w, h) => { gpFresco(g2, w, h, 2); const cx = w / 2; g2.fillStyle = "#2a6a4a"; g2.fillRect(30, 30, w - 60, h - 60); g2.fillStyle = "#3a8a5a"; for (let k = 0; k < 40; k++) { g2.beginPath(); g2.arc(cx + Math.cos(k * 2.4) * (140 + (k % 5) * 30), h * 0.3 + Math.sin(k * 2.4) * (70 + (k % 4) * 20), 40 + (k % 3) * 14, 0, TAU); g2.fill(); }
    g2.fillStyle = "#6a4426"; g2.beginPath(); g2.moveTo(cx - 70, h - 60); g2.bezierCurveTo(cx - 40, h * 0.6, cx - 30, h * 0.45, cx - 26, h * 0.32); g2.lineTo(cx + 26, h * 0.32); g2.bezierCurveTo(cx + 30, h * 0.45, cx + 40, h * 0.6, cx + 70, h - 60); g2.fill();
    g2.lineWidth = 16; g2.strokeStyle = "#6a4426"; for (const s of [-1, 1]) { g2.beginPath(); g2.moveTo(cx + s * 22, h * 0.42); g2.quadraticCurveTo(cx + s * 120, h * 0.32, cx + s * 210, h * 0.16); g2.stroke(); g2.beginPath(); g2.moveTo(cx + s * 40, h - 70); g2.quadraticCurveTo(cx + s * 160, h - 50, cx + s * 300, h - 44); g2.stroke(); }
    g2.fillStyle = "#e8c070"; g2.beginPath(); g2.arc(cx, h * 0.27, 34, 0, TAU); g2.fill(); g2.fillStyle = "#3a2a14"; for (const s of [-1, 1]) { g2.beginPath(); g2.arc(cx + s * 11, h * 0.26, 4, 0, TAU); g2.fill(); } g2.fillStyle = "#f0d070"; g2.beginPath(); g2.arc(cx, h * 0.27, 52, Math.PI * 1.1, Math.PI * 1.9); g2.lineWidth = 8; g2.strokeStyle = "#f0d070"; g2.stroke();
    for (let k = 0; k < 46; k++) { g2.fillStyle = k % 3 ? "#ffe890" : "#7af0e0"; g2.beginPath(); g2.ellipse(80 + R() * (w - 160), h * 0.4 + R() * h * 0.45, 5, 8, R(), 0, TAU); g2.fill(); }
    for (let k = 0; k < 6; k++) { const x = 90 + k * ((w - 180) / 5), y = h - 56; g2.fillStyle = ["#c86a3a", "#4ab0a0", "#e0a040"][k % 3]; g2.beginPath(); g2.ellipse(x, y, 26, 16, 0, 0, TAU); g2.fill(); g2.beginPath(); g2.arc(x + 20, y - 14, 10, 0, TAU); g2.fill(); } gpFrescoEnd(g2, w, h); },
  tide: (g2, w, h) => { gpFresco(g2, w, h, 3); g2.fillStyle = "#1a2a4a"; g2.fillRect(30, 30, w - 60, h - 60); for (let k = 0; k < 160; k++) { const x = 40 + R() * (w - 80), y = 40 + R() * (h * 0.7), dark = y > h * 0.25 + Math.sin(x / 90) * 40 + (x / w) * h * 0.25; g2.fillStyle = dark ? "rgba(255,240,180,0.25)" : "#fff0b0"; g2.beginPath(); g2.arc(x, y, 1.5 + R() * 3.5, 0, TAU); g2.fill(); }
    g2.fillStyle = "#08080e"; g2.beginPath(); g2.moveTo(30, h - 30); for (let x = 30; x <= w - 30; x += 10) g2.lineTo(x, h * 0.45 + Math.sin(x / 70) * 50 - (x / w) * h * 0.3); g2.lineTo(w - 30, h - 30); g2.fill();
    g2.strokeStyle = "#08080e"; g2.lineWidth = 10; g2.lineCap = "round"; for (let k = 0; k < 11; k++) { let x = 60 + k * ((w - 120) / 10), y = h * 0.45 + Math.sin(x / 70) * 50 - (x / w) * h * 0.3; g2.beginPath(); g2.moveTo(x, y); for (let s = 0; s < 6; s++) { x += (R() - 0.3) * 30; y -= 16 + R() * 14; g2.lineTo(x, y); } g2.stroke(); }
    g2.strokeStyle = "#5a7aa8"; g2.lineWidth = 3; g2.beginPath(); for (let x = 30; x <= w - 30; x += 10) g2.lineTo(x, h * 0.45 + Math.sin(x / 70) * 50 - (x / w) * h * 0.3 - 4); g2.stroke();
    for (let k = 0; k < 5; k++) gpFig(g2, 70 + k * 46, h - 46 - k * 6, 22, "#e8c890", 0); gpFrescoEnd(g2, w, h); } };
const gpMural = (x, y, z, w, h, ry, key) => { const t = gpCanvasT(768, Math.round((768 * h) / w), GPMURAL[key]); const m = add(new THREE.PlaneGeometry(w, h), std({ map: t, roughness: 0.92, emissive: "#ffffff", emissiveMap: t, emissiveIntensity: 0.18 }), [x, y, z], [0, ry, 0]); m.name = "nocol"; return m; };

// ---------- shared dressing for a sandstone room: flagstones, pilasters, frieze, sconces ----------
const gpTempleRoom = (A, g, W, D, wallH, o = {}) => { gpFlags(A, g, ["#e8dcc4", "#e0d2b6", "#ece2cc", "#d8caac"], o.runner);
  const keep = o.keep || (() => true); for (const side of ["n", "s", "w", "e"]) { const L = side === "n" || side === "s" ? W : D, step = o.pil || 3; for (let u = 2.5; u < L - 2; u += step) { if (!keep(side, u)) continue; const O = gpWallAt(A, W, D, side, u); gpPilaster(O, wallH - 0.9); if (o.sconce !== false) gpSconce(O, 2.6); } }
  gpFrieze(A, W, D, wallH - 0.9, 0.7, o.skip); };

// ================= TEMPLE OF TRIALS =================
// the lobby (pack 545): receptionist's desk, benches for the fans, the stair up to the roof arena
defPlace("gtLobby", { name: "Temple of Trials", w: 22, d: 18, style: "gytemple", indoor: true, wallH: 7,
  grid() { const g = gpRoom(22, 18); pRect(g, 10, 17, 12, 17, "S"); pRect(g, 9, 1, 13, 4, "o"); /* stair up */ for (const [x, y] of [[4, 4], [4, 8], [4, 12], [17, 4], [17, 8], [17, 12]]) pRect(g, x, y, x, y, "o"); /* columns */
    pRect(g, 6, 8, 9, 9, "o"); /* desk */ pRect(g, 2, 13, 3, 15, "o"); pRect(g, 18, 13, 19, 15, "o"); /* benches */ pRect(g, 19, 3, 20, 3, "o"); pRect(g, 19, 7, 20, 7, "o"); pRect(g, 19, 11, 20, 11, "o"); /* trial plinths */ pRect(g, 1, 1, 1, 1, "o"); pRect(g, 20, 1, 20, 1, "o"); pRect(g, 1, 16, 1, 16, "o"); pRect(g, 20, 16, 20, 16, "o"); return g; },
  arrive: { in: [11.5, 14.8, 0], up: [11.5, 8.0, Math.PI] },
  portals: [{ t: [11.5, 17.4], to: "out:YV", label: "Leave the Temple of Trials", flat: true }, { t: [11.5, 5.6], to: "gtArena:in", label: "Climb to the Arena", flat: true }],
  trainers: [], npcs: [["Receptionist", 8, 10.4], ["Fan", 6, 14]],
  dress({ X, Z, g, lite }) { const A = gpA(X, Z), W = 22, D = 18;
    gpTempleRoom(A, g, W, D, 7, { runner: (x, y) => x >= 10 && x <= 12 && y >= 5, keep: (s, u) => !(s === "n" && u > 8 && u < 15) && !(s === "s" && u > 8.5 && u < 14.5), skip: (s, u) => s === "n" && u > 8.5 && u < 14.5 });
    for (const z of [5, 17]) { gpInlay(A, 9.95, z, 9.95, z === 5 ? 17 : 5); gpInlay(A, 13.05, 5, 13.05, 17); } gpRingInlay(A, 11.5, 11, 2.2, 2.2, 36, GYC.gold); gyGlyph(A(11.5, 11), 0, 0.045, 0, 1.2, 1.2, 0, GYC.turq);
    gpStairUp(A(11.5, 5.0, 0), 5, 10, 0.42, 0.4, 7); // rises north into the wall
    for (const [x, y] of [[4, 4], [4, 8], [4, 12], [17, 4], [17, 8], [17, 12]]) { gyColumn(A(x + 0.5, y + 0.5), 5.6, 0, 0.42); nnBx("carve", A(x + 0.5, y + 0.5), 0, 6.4, 0, 1.5, 0.6, 1.5, "#e8dcc2"); nnBx("stone", A(x + 0.5, y + 0.5), 0, 6.3, 0, 0.6, 0.1, 0.6, "#e8dcc2"); }
    for (const x of [4.5, 17.5]) nnBx("carve", A(x, 8.5), 0, 6.55, 0, 0.6, 0.45, 8.6, "#e2d4b8"); // beams joining the colonnades
    // receptionist's desk: a curved sandstone counter with a gold top, a bell, the ledger and a trial board
    { const O = A(8, 9, 0); nnBx("stone", O, 0, 0, 0.55, 4.0, 1.05, 0.5, "#ece0c8"); for (const s of [-1, 1]) nnBx("stone", O, s * 1.85, 0, -0.1, 0.5, 1.05, 1.4, "#ece0c8"); nnBx("lit", O, 0, 1.05, 0.5, 4.3, 0.08, 0.7, "#c89a48"); for (const s of [-1, 1]) nnBx("lit", O, s * 1.85, 1.05, -0.1, 0.65, 0.08, 1.5, "#c89a48");
      for (let k = 0; k < 4; k++) gyGlyph(O, -1.4 + k * 0.95, 0.85, 0.82, 0.36, 0.5, 0, k % 2 ? GYC.turq : GYC.gold); nnP("lit", O, "dome", -1.2, 1.13, 0.5, 0.22, 0.16, 0.22, "#d8a848"); nnBx("deco", O, 0.6, 1.13, 0.45, 0.6, 0.06, 0.42, "#8a3a2a", 0.2); nnBx("deco", O, 0.6, 1.19, 0.45, 0.56, 0.01, 0.38, "#f0e4c4", 0.2); nnCy("lit", O, 1.2, 1.13, 0.6, 0.04, 0.22, "#6a4a2a");
      nnBx("lit", O, 0, 0, -0.9, 3.2, 0.5, 0.5, "#8a6a4a"); nnBx("lit", O, 0, 1.3, -1.3, 3.4, 2.0, 0.12, "#6a4a2a"); nnBx("glow", O, 0, 1.45, -1.23, 3.0, 1.7, 0.02, "#1d4a46"); for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) nnBx("glow", O, -1.1 + c * 0.73, 2.75 - r * 0.5, -1.21, 0.5, 0.06, 0.02, r === 0 ? GYC.gold : GYC.turq); }
    // benches for the fans, a fern urn at each corner
    for (const [x, y, ry] of [[3, 13.6, Math.PI / 2], [3, 15.4, Math.PI / 2], [19, 13.6, -Math.PI / 2], [19, 15.4, -Math.PI / 2]]) gyBench(A(x, y, ry)); for (const [x, y] of [[1.5, 1.5], [20.5, 1.5], [1.5, 16.5], [20.5, 16.5]]) gpUrnFern(A(x, y));
    // the three Trials: an emblem over each plinth on the east wall (flame, wave, leaf)
    for (const [y, col, k] of [[3.5, "#ff9a3a", 0], [7.5, GYC.turq, 1], [11.5, GYC.jade, 2]]) { const O = A(19.9, y, -Math.PI / 2); gpPedestal(O, 1.0); if (k === 0) nnP("glow", O, "cone", 0, 1.5, 0, 0.5, 0.9, 0.5, col); else if (k === 1) nnP("glow", O, "oct", 0, 1.45, 0, 0.6, 0.8, 0.3, col); else nnP("glow", O, "pyr", 0, 1.45, 0, 0.5, 0.9, 0.18, col, 0, 0, 0); gpBanner(gpWallAt(A, W, D, "e", y + 0.01), 5.6, 1.1, 2.4, k === 1 ? GYC.turq : GYC.gold); }
    for (const y of [4.5, 9.5, 14.5]) gpBanner(gpWallAt(A, W, D, "w", y), 5.6, 1.2, 2.6, y === 9.5 ? GYC.gold : GYC.turq);
    for (const s of [-1, 1]) gyBrazier(A(11.5 + s * 3.4, 5.4)); for (const s of [-1, 1]) gyChimePost(A(11.5 + s * 2.4, 16.2, s > 0 ? Math.PI : 0));
    for (const [x, y] of [[7.5, 4.5], [15.5, 4.5], [7.5, 13.5], [15.5, 13.5]]) gpLanternHang(A(x, y), 0, 4.4, 0, 6.6);
    nnBx("glow", A(11.5, 17.0), 0, 0, 0.6, 3.0, 4.2, 0.04, "#d8ecf0"); // daylight in the doorway
    lite(11.5, 11, "#ffe0b0", 4, 16, 5.5); lite(5, 5, "#ffd090", 2.4, 11, 4); lite(18, 5, "#ffd090", 2.4, 11, 4); lite(5, 14, "#ffd090", 2.4, 11, 4); lite(18, 14, "#ffd090", 2.4, 11, 4); lite(11.5, 4, "#ffb860", 2.6, 9, 2.2); } });

// the arena on the roof (pack 546): an open-air battle floor, stone stands on three sides, the judge's seat to the north
defPlace("gtArena", { name: "Temple of Trials Arena", w: 22, d: 18, style: "gyroof", indoor: false, wallH: 1.3,
  grid() { const g = gpRoom(22, 18); pRect(g, 10, 14, 12, 16, " "); /* stairwell down */ pRect(g, 1, 1, 3, 16, "o"); pRect(g, 18, 1, 20, 16, "o"); /* side stands */ pRect(g, 4, 1, 17, 2, "o"); /* north stand and judge's seat */ return g; },
  arrive: { in: [11.5, 11.0, 0] },
  portals: [{ t: [11.5, 13.3], to: "gtLobby:up", label: "Go back down to the lobby", flat: true }],
  trainers: [[6.5, 7.8], [16.5, 7.8]],
  dress({ X, Z, g, lite }) { const A = gpA(X, Z), W = 22, D = 18; gpFlags(A, g, ["#e8dcc4", "#e0d2b6", "#ece2cc", "#d8caac"]);
    nnBx("deco", A(11, 7.8), 0, 0.03, 0, 13.6, 0.01, 8.4, "#c8b68e"); gpRingInlay(A, 11, 7.8, 6.4, 3.9, 64, "#f4f0e0"); gpInlay(A, 11, 3.9, 11, 11.7, "#f4f0e0"); gpRingInlay(A, 11, 7.8, 1.1, 1.1, 20, GYC.gold);
    for (const x of [6.5, 15.5]) gpRingInlay(A, x, 7.8, 0.8, 0.8, 16, GYC.gold);
    // stands: three tiers rising away from the battle floor, cushions in turquoise and gold
    const stand = (O, L) => { for (let t = 0; t < 3; t++) { nnBx("stone", O, 0, 0, -t * 0.95 - 0.47, L, 0.45 * (t + 1), 0.95, t % 2 ? "#e8dcc4" : "#f0e6d2"); for (let u = -L / 2 + 0.7; u < L / 2 - 0.4; u += 1.3) nnBx("deco", O, u, 0.45 * (t + 1), -t * 0.95 - 0.5, 0.95, 0.08, 0.55, (Math.round(u * 3) + t) % 2 ? "#1f5f5c" : "#8a5a22"); } };
    stand(A(4.0, 8.5, Math.PI / 2), 15.6); stand(A(18.0, 8.5, -Math.PI / 2), 15.6); stand(A(11, 3.0, 0), 13.6);
    { const O = A(11, 2.2); nnBx("stone", O, 0, 0, -0.6, 2.2, 1.35, 1.3, "#e2d6bc"); nnBx("stone", O, 0, 1.35, -0.6, 2.4, 0.3, 1.4, "#f2e8d4"); nnBx("lit", O, 0, 1.65, -0.8, 1.0, 0.5, 0.7, "#8a5a22"); nnBx("lit", O, 0, 1.65, -1.2, 1.0, 1.5, 0.15, "#8a5a22"); nnBx("glow", O, 0, 2.6, -1.1, 0.5, 0.5, 0.02, GYC.gold); nnP("deco", O, "box", 0, 3.4, -0.4, 3.2, 0.05, 2.2, "#1f5f5c", -0.15, 0, 0); for (const s of [-1, 1]) nnCy("lit", O, s * 1.5, 1.65, 0.4, 0.05, 1.7, "#6a4a2a"); }
    // shade awnings over the side stands, banner masts at the corners, a bronze gong
    for (const s of [-1, 1]) for (const z of [4.5, 12.5]) nnP("deco", A(11 + s * 9.2, z), "box", 0, 3.4, 0, 3.4, 0.05, 6.8, s < 0 ? "#e8dcc0" : "#d8c8a0", 0, 0, s * 0.18);
    for (const s of [-1, 1]) for (const z of [1.5, 8.5, 15.5]) nnCy("lit", A(11 + s * 10.4, z), 0, 0, 0, 0.06, 3.3, "#6a4a2a");
    for (const [x, z, c] of [[1.5, 1.5, GYC.turq], [20.5, 1.5, GYC.gold], [1.5, 16.5, GYC.gold], [20.5, 16.5, GYC.turq]]) gyFlag(A(x, z, x < 11 ? 0 : Math.PI), 6.2, c);
    { const O = A(16.8, 13.4, -0.5); for (const s of [-1, 1]) nnBx("lit", O, s * 0.9, 0, 0, 0.12, 2.4, 0.12, "#6a4a2a"); nnBx("lit", O, 0, 2.3, 0, 2.0, 0.12, 0.14, "#6a4a2a"); nnP("lit", O, "cyl12", 0, 1.35, 0, 1.4, 0.1, 1.4, "#c89a48", Math.PI / 2, 0, 0); nnP("glow", O, "cyl12", 0, 1.35, 0.06, 0.4, 0.02, 0.4, GYC.gold, Math.PI / 2, 0, 0); }
    for (const [x, z] of [[5.3, 13.5], [5.3, 3.8], [16.7, 3.8]]) gyBrazier(A(x, z)); gpStairDown(A(11.5, 13.95, Math.PI), 3, 3);
    lite(11, 7.8, "#fff0d0", 2.4, 18, 7); lite(5.3, 13.5, "#ffb860", 2, 8, 1.6); } });

// ================= TEMPLE OF VOICES (pack 078 to 081): three floors and the Mural Hall in the shrine on top =================
// 1F: the pilgrims' hall under the great carved face of the Voice
defPlace("gv1", { name: "Temple of Voices", w: 22, d: 20, style: "gytemple", indoor: true, wallH: 4.6,
  grid() { const g = gpRoom(22, 20); pRect(g, 10, 19, 12, 19, "S"); pRect(g, 1, 1, 3, 4, "o"); /* stair up, north-west */ for (const [x, y] of [[6, 5], [6, 9], [6, 13], [16, 5], [16, 9], [16, 13]]) pRect(g, x, y, x, y, "o");
    pRect(g, 8, 1, 14, 2, "o"); /* the carved face and its chimes */ for (const [x, y] of [[8, 7], [12, 7], [8, 10], [12, 10]]) pRect(g, x, y, x + 2, y, "o"); /* prayer benches */ pRect(g, 1, 8, 1, 14, "o"); pRect(g, 20, 4, 20, 14, "o"); /* chime racks */ return g; },
  arrive: { in: [11.5, 16.8, 0], up: [2.5, 8.0, Math.PI] },
  portals: [{ t: [11.5, 19.4], to: "out:Y9", label: "Leave the Temple of Voices", flat: true }, { t: [2.5, 5.6], to: "gv2:in", label: "Climb to the second floor", flat: true }],
  trainers: [[11.5, 13.5]], npcs: [["Pilgrim", 4, 16], ["Pilgrim", 18.5, 16]],
  dress({ X, Z, g, lite }) { const A = gpA(X, Z), W = 22, D = 20;
    gpTempleRoom(A, g, W, D, 4.6, { runner: (x, y) => x >= 10 && x <= 12 && y >= 3, pil: 4, keep: (s, u) => !(s === "n" && (u < 4.5 || (u > 7 && u < 16))) && !(s === "s" && u > 8.5 && u < 14.5) && !(s === "w" && u < 5) });
    gpStairUp(A(2.5, 5.0, 0), 3, 8, 0.4, 0.42, 4.6);
    for (const [x, y] of [[6, 5], [6, 9], [6, 13], [16, 5], [16, 9], [16, 13]]) { gyColumn(A(x + 0.5, y + 0.5), 3.5, 0, 0.38); nnBx("carve", A(x + 0.5, y + 0.5), 0, 4.1, 0, 1.3, 0.5, 1.3, "#e8dcc2"); }
    // the Voice: a huge calm face carved into the north wall, gold eyes, chime racks either side
    { const O = A(11.5, 1.1); nnBx("stone", O, 0, 0, 0.6, 6.6, 0.8, 1.2, "#ece0c8"); nnP("stone", O, "blob", 0, 2.55, 0.35, 2.6, 3.1, 1.1, "#f0e6d4", 0, 0, 0); nnBx("stone", O, 0, 2.3, 0.95, 0.42, 0.9, 0.36, "#e8dcc4", -0.2, 0); for (const s of [-1, 1]) { nnBx("stone", O, s * 0.58, 3.0, 0.88, 0.7, 0.1, 0.2, "#c8bca8"); nnP("glow", O, "sph", s * 0.58, 2.82, 0.9, 0.22, 0.16, 0.06, GYC.gold); nnBx("stone", O, s * 1.35, 2.2, 0.55, 0.3, 1.1, 0.6, "#ece0c8"); }
      nnBx("stone", O, 0, 1.72, 0.9, 0.7, 0.1, 0.18, "#c8bca8"); nnP("stone", O, "dome", 0, 3.85, 0.3, 3.0, 0.9, 1.2, "#e2d6bc"); for (let k = 0; k < 7; k++) gyGlyph(O, -2.7 + k * 0.9, 4.35, 0.62, 0.34, 0.36, 0, k % 2 ? GYC.turq : GYC.gold);
      for (const s of [-1, 1]) { nnBx("lit", O, s * 2.6, 0.8, 0.5, 0.14, 3.4, 0.14, "#6a4a2a"); nnBx("lit", O, s * 2.6, 4.1, 0.6, 1.3, 0.12, 0.14, "#6a4a2a"); gyChimes(O, s * 2.6, 4.05, 0.62, 7); } nnBx("glow", O, 0, 0.8, 1.21, 6.2, 0.05, 0.02, GYC.turq); }
    // prayer benches facing the Voice, an offering table, the mosaic of the singing ring
    for (const [x, y] of [[9.5, 7.5], [13.5, 7.5], [9.5, 10.5], [13.5, 10.5]]) { const O = A(x, y); nnBx("stone", O, 0, 0.44, 0, 2.8, 0.14, 0.55, "#f0e8dc"); for (const s of [-1.2, 0, 1.2]) nnBx("stone", O, s, 0, 0, 0.28, 0.44, 0.48, "#e0d8c8"); nnBx("deco", O, 0, 0.58, 0, 2.6, 0.06, 0.46, "#1f5f5c"); }
    gpRingInlay(A, 11.5, 14.5, 2.8, 2.0, 40, GYC.turq); gpRingInlay(A, 11.5, 14.5, 1.6, 1.1, 28, GYC.gold); gyGlyph(A(11.5, 14.5), 0, 0.045, 0, 1.0, 1.0, 0, GYC.gold);
    for (const s of [-1, 1]) { const O = A(11.5 + s * 4.6, 4.2); nnBx("lit", O, 0, 0, 0, 1.2, 0.6, 0.6, "#8a6a4a"); gpBowl(O, 0.75); nnCy("lit", O, 0.35, 0.6, 0.1, 0.04, 0.2, "#e8dcc0"); nnSp("glow", O, 0.35, 0.86, 0.1, 0.05, "#ffd890"); }
    // chime racks along the side walls: rows of bronze tubes that hum when the wind gets in
    for (const [x, y0, y1, ry] of [[1.6, 8.5, 14.5, Math.PI / 2], [20.4, 4.5, 14.5, -Math.PI / 2]]) for (let y = y0; y <= y1; y += 2) { const O = A(x, y, ry); nnBx("lit", O, 0, 0, 0, 1.6, 0.25, 0.5, "#6a4a2a"); for (const s of [-0.7, 0.7]) nnBx("lit", O, s, 0.25, 0, 0.1, 2.4, 0.1, "#6a4a2a"); nnBx("lit", O, 0, 2.6, 0, 1.6, 0.1, 0.14, "#6a4a2a"); gyChimes(O, 0, 2.56, 0, 8); }
    for (const [x, y] of [[8.5, 5.5], [14.5, 5.5], [8.5, 12.5], [14.5, 12.5], [11.5, 16.5]]) gpLanternHang(A(x, y), 0, 3.0, 0, 4.4); for (const s of [-1, 1]) gpUrnFern(A(11.5 + s * 3.6, 18.2));
    nnBx("glow", A(11.5, 19.0), 0, 0, 0.6, 3.0, 3.6, 0.04, "#d8ecf0");
    lite(11.5, 9, "#ffe0b0", 3.2, 14, 3.6); lite(11.5, 3, "#ffd27a", 2.4, 8, 3); lite(4, 15, "#ffd090", 2, 9, 3); lite(18.5, 15, "#ffd090", 2, 9, 3); lite(4, 7, "#9af0e0", 1.6, 8, 3); } });

// 2F: the Hall of Echoes: singing bowls round a still pool, sounding pipes, the rune scholar's scroll niches
defPlace("gv2", { name: "Temple of Voices 2F", w: 18, d: 16, style: "gytemple", indoor: true, wallH: 4.4,
  grid() { const g = gpRoom(18, 16); pRect(g, 1, 1, 3, 3, " "); /* stairwell down, north-west */ pRect(g, 14, 1, 16, 4, "o"); /* stair up, north-east */ pRect(g, 7, 7, 10, 9, "o"); /* pool */
    for (let k = 0; k < 8; k++) { const a = (k / 8) * TAU + 0.39, x = Math.floor(8.5 + Math.cos(a) * 4.1), y = Math.floor(8 + Math.sin(a) * 3.6); pRect(g, x, y, x, y, "o"); } pRect(g, 1, 6, 1, 13, "o"); pRect(g, 16, 7, 16, 13, "o"); /* scroll niches */ pRect(g, 3, 13, 9, 14, "o"); /* sounding pipes */ pRect(g, 12, 12, 14, 13, "o"); /* scholar's desk */ return g; },
  arrive: { in: [2.5, 7.0, Math.PI], up: [15.5, 8.0, Math.PI] },
  portals: [{ t: [2.5, 4.6], to: "gv1:up", label: "Go down to the first floor", flat: true }, { t: [15.5, 5.6], to: "gv3:in", label: "Climb to the third floor", flat: true }],
  trainers: [[12.5, 4.6]], npcs: [["Rune scholar", 13, 11.2]],
  dress({ X, Z, g, lite }) { const A = gpA(X, Z), W = 18, D = 16;
    gpTempleRoom(A, g, W, D, 4.4, { pil: 4, keep: (s, u) => !(s === "n" && (u < 4.5 || u > 13)) && !(s === "w") && !(s === "e" && u > 5) });
    gpStairDown(A(2.5, 4.0, 0), 3, 3); gpStairUp(A(15.5, 5.0, 0), 3, 8, 0.4, 0.42, 4.4);
    // the still pool and the eight singing bowls round it
    { const O = A(9, 8.5); nnBx("stone", O, 0, 0, 0, 4.2, 0.5, 3.2, "#e8dcc4"); nnBx("carve", O, 0, 0.5, 0, 4.4, 0.1, 3.4, "#e2d4b8"); for (let k = 0; k < 6; k++) gyGlyph(O, -1.75 + k * 0.7, 0.42, 1.61, 0.26, 0.26, 0, k % 2 ? GYC.turq : GYC.gold);
      const wm = add(new THREE.PlaneGeometry(3.8, 2.8), std({ color: "#0e4a5a", roughness: 0.04, metalness: 0.5, emissive: "#0a4a5a", emissiveIntensity: 0.6 }), [X(9), 0.61, Z(8.5)], [-Math.PI / 2, 0, 0]); wm.name = "nocol"; nnP("glow", O, "oct", 0, 0.75, 0, 0.3, 0.42, 0.3, GYC.turq); }
    for (let k = 0; k < 8; k++) { const a = (k / 8) * TAU + 0.39, x = Math.floor(8.5 + Math.cos(a) * 4.1) + 0.5, y = Math.floor(8 + Math.sin(a) * 3.6) + 0.5, O = A(x, y); gpPedestal(O, 0.85); gpBowl(O, 1.02, k % 2 ? GYC.gold : GYC.turq); nnBx("lit", O, 0.32, 0.85, 0.2, 0.05, 0.05, 0.4, "#6a4a2a", 0.6); }
    // sounding pipes of every height along the south wall
    for (let k = 0; k < 12; k++) { const x = 3.4 + k * 0.55, h = 1.4 + Math.abs(Math.sin(k * 1.3)) * 2.2; nnCy("lit", A(x, 13.6), 0, 0, 0, 0.17, h, "#b8904a"); nnP("glow", A(x, 13.6), "cyl", 0, h + 0.01, 0, 0.24, 0.02, 0.24, "#1a1206"); nnBx("lit", A(x, 13.6), 0, 0, 0, 0.42, 0.25, 0.42, "#6a4a2a"); }
    // scroll niches in the side walls: shelves of rolled glyph scrolls
    for (const [x, y0, y1, ry] of [[1.05, 6.5, 13.5, Math.PI / 2], [16.95, 7.5, 13.5, -Math.PI / 2]]) for (let y = y0; y <= y1; y += 2) { const O = A(x, y, ry); nnBx("stone", O, 0, 0, 0.3, 1.6, 3.2, 0.6, "#e2d4b8"); for (let r = 0; r < 4; r++) { nnBx("lit", O, 0, 0.35 + r * 0.72, 0.42, 1.4, 0.05, 0.44, "#6a4a2a"); for (let c = 0; c < 5; c++) nnP("lit", O, "cyl", -0.55 + c * 0.27, 0.48 + r * 0.72, 0.45, 0.14, 0.4, 0.14, ["#e8dcb0", "#d8c8a0", "#c8a878"][(c + r) % 3], Math.PI / 2, 0, 0); } }
    { const O = A(13.5, 12.8, Math.PI); gyTable(O, true); nnBx("lit", O, 0, 0, -0.9, 0.5, 0.45, 0.5, "#6a4a2a"); for (let k = 0; k < 3; k++) nnP("lit", O, "cyl", -0.4 + k * 0.4, 0.86, 0.15, 0.1, 0.5, 0.1, "#e8dcb0", Math.PI / 2, 0.3, 0); nnSp("glow", O, 0.6, 0.95, -0.2, 0.08, "#ffd890"); }
    for (const [x, y] of [[5.5, 5.5], [12.5, 5.5], [5.5, 11], [12.5, 11]]) gpLanternHang(A(x, y), 0, 2.9, 0, 4.2); gpUrnFern(A(16.4, 1.6 + 4.0));
    lite(9, 8.5, "#9af0e0", 2.6, 10, 2.4); lite(4.5, 10, "#ffd090", 2, 9, 3); lite(13.5, 10, "#ffd090", 2, 9, 3); lite(9, 3, "#ffe0b0", 1.8, 9, 3); } });

// 3F: the Altar of Voices; the old chimes hang silent above the dais; the stair behind it climbs to the Mural Hall
defPlace("gv3", { name: "Temple of Voices 3F", w: 14, d: 12, style: "gytemple", indoor: true, wallH: 4.2,
  grid() { const g = gpRoom(14, 12); pRect(g, 1, 9, 3, 10, " "); /* stairwell down, south-west */ pRect(g, 6, 1, 8, 3, "o"); /* stair up to the Mural Hall */ pRect(g, 5, 7, 9, 9, "o"); /* the dais */ pRect(g, 2, 4, 2, 4, "o"); /* the altar's stele */ pRect(g, 12, 1, 12, 1, "o"); pRect(g, 12, 10, 12, 10, "o"); return g; },
  arrive: { in: [2.5, 6.0, 0], up: [7.5, 6.6, Math.PI] },
  portals: [{ t: [2.5, 8.3], to: "gv2:up", label: "Go down to the second floor", flat: true }, { t: [7.5, 4.3], to: "gvMural:in", label: "Climb to the Mural Hall", flat: true }],
  trainers: [[11, 5]],
  dress({ X, Z, g, lite }) { const A = gpA(X, Z), W = 14, D = 12;
    gpTempleRoom(A, g, W, D, 4.2, { pil: 4, sconce: true, keep: (s, u) => !(s === "n" && u > 5 && u < 10) && !(s === "s" && u < 4.5), skip: (s, u) => s === "n" && u > 5.5 && u < 9.5 });
    gpStairDown(A(2.5, 9.0, Math.PI), 3, 2); gpStairUp(A(7.5, 4.0, 0), 3, 7, 0.42, 0.42, 4.2);
    // the dais: three steps, an altar stone, two posts and a beam with the silent chimes
    { const O = A(7.5, 8.5); for (let k = 0; k < 3; k++) nnBx("stone", O, 0, k * 0.22, 0, 5.0 - k * 0.8, 0.22, 3.0 - k * 0.5, k % 2 ? "#e8dcc4" : "#f0e6d2"); nnBx("carve", O, 0, 0.66, 0, 1.8, 0.85, 0.9, "#e8dcc2"); nnBx("lit", O, 0, 1.51, 0, 1.9, 0.06, 1.0, "#c89a48"); gyGlyph(O, 0, 1.4, 0.46, 0.5, 0.6, 0, GYC.gold); gpBowl(O, 1.62, GYC.turq);
      for (const s of [-1, 1]) { nnBx("lit", O, s * 2.3, 0, 0, 0.22, 3.9, 0.22, "#5a3a20"); nnSp("glow", O, s * 2.3, 3.95, 0, 0.1, GYC.gold); } nnBx("lit", O, 0, 3.7, 0, 4.9, 0.18, 0.24, "#5a3a20"); for (let k = 0; k < 4; k++) gyChimes(O, -1.65 + k * 1.1, 3.68, 0, 6);
      for (let k = 0; k < 4; k++) nnBx("deco", O, -1.65 + k * 1.1, 3.0, 0.02, 0.9, 0.012, 0.012, "#7a6a5a"); } // the cords are tied up: the chimes cannot ring
    { const O = A(2.5, 4.5, Math.PI / 4); gyStele(O, 2.0); } // "Altar of Voices": WHEN THE BELLS SING, THE GUARDIANS LISTEN
    for (const [x, y] of [[12.5, 1.5], [12.5, 10.5]]) gpUrnFern(A(x, y)); gyBrazier(A(4.6, 10.4)); gyBrazier(A(11.2, 10.4));
    for (const y of [3.5, 7.5]) gpBanner(gpWallAt(A, W, D, "e", y), 3.9, 1.0, 2.0, y < 5 ? GYC.gold : GYC.turq); gpBanner(gpWallAt(A, W, D, "w", 6.5), 3.9, 1.0, 2.0, GYC.turq);
    lite(7.5, 7.5, "#ffd27a", 3, 10, 3.2); lite(3, 4.5, "#9af0e0", 1.6, 7, 2.6); lite(11, 6, "#ffd090", 1.8, 8, 3); } });

// the Mural Hall: the three great murals of the Ystrans on the north wall
defPlace("gvMural", { name: "Mural Hall", w: 12, d: 10, style: "gytemple", indoor: true, wallH: 4.5,
  grid() { const g = gpRoom(12, 10); pRect(g, 5, 7, 6, 8, " "); /* stairwell down */ pRect(g, 1, 7, 1, 8, "o"); pRect(g, 10, 7, 10, 8, "o"); return g; },
  arrive: { in: [6, 4.0, 0] },
  portals: [{ t: [6, 6.4], to: "gv3:up", label: "Go back down", flat: true }],
  npcs: [["Rune scholar", 3, 4], ["Pilgrim", 9, 4]],
  dress({ X, Z, g, lite }) { const A = gpA(X, Z), W = 12, D = 10;
    gpFlags(A, g, ["#e8dcc4", "#e0d2b6", "#ece2cc", "#d8caac"]); gpFrieze(A, W, D, 3.7, 0.7);
    gpStairDown(A(6, 7.0, Math.PI), 2, 2);
    for (const [x, key] of [[2.7, "sun"], [6, "seed"], [9.3, "tide"]]) { gpMural(X(x), 2.15, Z(1.06), 3.0, 2.4, 0, key); const O = A(x, 1.02); nnBx("lit", O, 0, 0.84, 0.06, 3.2, 0.12, 0.12, "#c89a48"); nnBx("lit", O, 0, 3.35, 0.06, 3.2, 0.12, 0.12, "#c89a48"); for (const s of [-1, 1]) nnBx("lit", O, s * 1.56, 0.84, 0.06, 0.1, 2.62, 0.12, "#c89a48"); nnBx("stone", O, 0, 0, 0.2, 3.0, 0.5, 0.4, "#e8dcc4"); for (const s of [-1, 1]) { nnCy("lit", O, s * 1.1, 0.5, 0.3, 0.05, 0.18, "#e8dcc0"); nnSp("glow", O, s * 1.1, 0.74, 0.3, 0.05, "#ffd890"); } }
    for (const x of [4.35, 7.65]) gpPilaster(A(x, 1.02), 3.6); for (const side of ["w", "e"]) for (const y of [3, 6]) { const O = gpWallAt(A, W, D, side, y); nnBx("carve", O, 0, 1.2, 0.1, 1.4, 1.8, 0.2, "#e8dcc2"); gyGlyph(O, 0, 2.6, 0.22, 0.8, 1.1, 0, y === 3 ? GYC.gold : GYC.turq); gpSconce(O, 3.3); }
    for (const x of [4.5, 7.5]) { nnBx("lit", A(x, 3.2), 0, 0, 0, 0.8, 0.1, 0.8, "#c89a48"); nnBx("deco", A(x, 3.2), 0, 0.1, 0, 0.7, 0.12, 0.7, "#2a8a84"); } for (const x of [1.5, 10.5]) gpUrnFern(A(x, 7.5));
    lite(6, 3.4, "#fff0d0", 3.2, 10, 3.2); lite(2.5, 6, "#ffd090", 1.4, 6, 2.6); lite(9.5, 6, "#ffd090", 1.4, 6, 2.6); } });

// ================= RELAY TOWER (pack 886 to 888): five floors up to the beacon on the roof =================
const gpTowerRoom = (A, g, W, D, o = {}) => { gpTempleRoom(A, g, W, D, 5.0, { pil: 4, sconce: false, keep: o.keep, skip: o.skip, runner: o.runner });
  for (const side of ["n", "s", "w", "e"]) { const L = side === "n" || side === "s" ? W : D; for (const u of [L * 0.3, L * 0.7]) { if (o.win && !o.win(side, u)) continue; gpWindow(gpWallAt(A, W, D, side, u), 1.6, 0.7, 2.0); } }
  for (const [x, y, ry] of [[1.6, 1.6, Math.PI / 4], [W - 1.6, 1.6, -Math.PI / 4], [1.6, D - 1.6, 3 * Math.PI / 4], [W - 1.6, D - 1.6, -3 * Math.PI / 4]]) if (!o.corner || o.corner(x, y)) { nnBx("carve", A(x, y, ry), 0, 0, 0, 1.0, 5.0, 1.0, "#e2d4b8"); nnP("glow", A(x, y, ry), "box", 0, 2.5, 0.51, 0.06, 4.0, 0.02, GYC.turq); } };
// 1F (887): the Trial Floor; rows of rune blocks make a winding way to the stair
defPlace("gr1", { name: "Relay Tower Trial Floor", w: 18, d: 18, style: "gytemple", indoor: true, wallH: 5,
  grid() { const g = gpRoom(18, 18); pRect(g, 8, 17, 10, 17, "S"); pRect(g, 13, 1, 15, 4, "o"); /* stair up */ pRect(g, 2, 12, 6, 12, "o"); pRect(g, 11, 12, 15, 12, "o"); pRect(g, 5, 7, 12, 7, "o"); /* rune blocks */ pRect(g, 3, 9, 4, 10, "o"); pRect(g, 13, 9, 14, 10, "o"); /* piers */ pRect(g, 5, 15, 6, 15, "o"); /* lectern */ for (const [x, y] of [[1, 1], [16, 1], [1, 16], [16, 16]]) pRect(g, x, y, x, y, "o"); return g; },
  arrive: { in: [9.5, 15.0, 0], up: [14.5, 8.0, Math.PI] },
  portals: [{ t: [9.5, 17.35], to: "out:YR", label: "Leave the Relay Tower", flat: true }, { t: [14.5, 5.6], to: "gr2:in", label: "Climb to the second floor", flat: true }],
  trainers: [[4, 14.5], [14, 10.9], [3, 4.5]], npcs: [["Rune reader", 7, 14.6], ["Tower aide", 12, 15.6]],
  dress({ X, Z, g, lite }) { const A = gpA(X, Z), W = 18, D = 18;
    gpTowerRoom(A, g, W, D, { keep: (s, u) => !(s === "s" && u > 6.5 && u < 12.5) && !(s === "n" && u > 12), win: (s, u) => !(s === "s" && Math.abs(u - 9) < 3) && !(s === "n" && u > 12) });
    gpStairUp(A(14.5, 5.0, 0), 3, 10, 0.42, 0.4, 5);
    for (const [x0, x1, y] of [[2, 6, 12], [11, 15, 12], [5, 12, 7]]) for (let x = x0; x <= x1; x++) gyGlyphStone(A(x + 0.5, y + 0.5), 0.8);
    for (const [x, y] of [[3, 9], [13, 9]]) { const O = A(x + 1, y + 1); nnBx("stone", O, 0, 0, 0, 2.0, 5.0, 2.0, "#ece0c8"); for (let k = 0; k < 4; k++) gyGlyph(O, 0, 3.6, 0, 0.5, 0.7, (k * Math.PI) / 2 + 0, k % 2 ? GYC.turq : GYC.gold); nnBx("carve", O, 0, 4.4, 0, 2.3, 0.6, 2.3, "#e2d4b8"); }
    // trainer marks on the floor
    for (const [x, y] of [[4, 14.5], [14, 10.9], [3, 4.5]]) gpRingInlay(A, x, y, 0.9, 0.9, 18, GYC.gold);
    // the rune reader's lectern by the door, a tablet the size of a door leaning on the wall
    { const O = A(6, 15.5, -0.3); nnBx("stone", O, 0, 0, 0, 0.7, 1.0, 0.5, "#e8dcc4"); nnP("lit", O, "box", 0, 1.08, 0, 0.9, 0.06, 0.6, "#8a6a4a", -0.35, 0, 0); nnBx("deco", O, 0, 1.12, 0.02, 0.7, 0.01, 0.45, "#e8dcb0", 0, -0.35); }
    { const O = gpWallAt(A, W, D, "w", 6); nnP("carve", O, "box", 0, 1.2, 0.5, 1.6, 2.4, 0.3, "#e2d4b8", -0.15, 0, 0); gyGlyph(O, 0, 2.1, 0.68, 0.7, 1.2, 0, GYC.turq); }
    for (const [x, y] of [[1.5, 1.5], [16.5, 1.5], [1.5, 16.5], [16.5, 16.5]]) gyBrazier(A(x, y)); gpBanner(gpWallAt(A, W, D, "e", 14), 4.4, 1.1, 2.4, GYC.turq); gpBanner(gpWallAt(A, W, D, "w", 12.5), 4.4, 1.1, 2.4, GYC.gold);
    nnBx("glow", A(9.5, 17.0), 0, 0, 0.6, 3.0, 4.0, 0.04, "#d8ecf0");
    lite(9, 9.5, "#ffe0b0", 3, 14, 4.2); lite(3, 3, "#ffb860", 2, 8, 2); lite(15, 15, "#ffb860", 2, 8, 2); lite(14, 3, "#9af0e0", 1.6, 7, 3); } });

// 2F: the Rune Gallery; a great carved rune wheel, tablets on every wall, relics in glass cases
defPlace("gr2", { name: "Relay Tower Rune Gallery", w: 17, d: 17, style: "gytemple", indoor: true, wallH: 5,
  grid() { const g = gpRoom(17, 17); pRect(g, 12, 1, 14, 3, " "); /* stairwell down, north-east */ pRect(g, 1, 12, 3, 15, "o"); /* stair up, south-west */ pRect(g, 6, 7, 10, 9, "o"); /* rune wheel */ for (const [x, y] of [[4, 4], [12, 12], [4, 9], [12, 6]]) pRect(g, x, y, x, y, "o"); /* cases */ return g; },
  arrive: { in: [13.5, 7.0, Math.PI], up: [2.5, 9.0, 0] },
  portals: [{ t: [13.5, 4.6], to: "gr1:up", label: "Go down to the Trial Floor", flat: true }, { t: [2.5, 11.3], to: "gr3:in", label: "Climb to the third floor", flat: true }],
  dress({ X, Z, g, lite }) { const A = gpA(X, Z), W = 17, D = 17;
    gpTowerRoom(A, g, W, D, { keep: (s, u) => !(s === "n" && u > 11) && !(s === "w" && u > 11), win: (s, u) => !(s === "n" && u > 10) && !(s === "w" && u > 10), corner: (x, y) => !(x > 10 && y < 5) && !(x < 5 && y > 10) });
    gpStairDown(A(13.5, 4.0, 0), 3, 3); gpStairUp(A(2.5, 12.0, Math.PI), 3, 9, 0.44, 0.4, 5);
    // the rune wheel: a carved stone disc 3.6 m across on a cradle, rings of glyphs that once turned
    { const O = A(8.5, 8.5); nnBx("stone", O, 0, 0, 0, 5.0, 0.6, 3.0, "#e8dcc4"); for (const s of [-1, 1]) nnBx("stone", O, s * 2.1, 0.6, 0, 0.6, 2.0, 1.2, "#e2d4b8"); nnP("lit", O, "cyl", 0, 2.4, 0, 0.3, 4.6, 0.3, "#8a6a3a", 0, 0, Math.PI / 2);
      nnP("carve", O, "cyl12", 0, 2.4, 0, 3.6, 0.5, 3.6, "#efe3cc", Math.PI / 2, 0, 0); for (const z of [-0.26, 0.26]) { for (let k = 0; k < 12; k++) { const a = (k / 12) * TAU; nnP("glow", O, "box", Math.cos(a) * 1.45, 2.4 + Math.sin(a) * 1.45, z, 0.32, 0.06, 0.02, k % 2 ? GYC.gold : GYC.turq, 0, 0, a); } nnP("glow", O, "ring", 0, 2.4, z, 2.0, 1, 2.0, GYC.turq, Math.PI / 2, 0, 0); nnP("glow", O, "oct", 0, 2.4, z, 0.4, 0.4, 0.06, GYC.gold); } }
    gpRingInlay(A, 8.5, 8.5, 4.3, 3.2, 44, GYC.gold);
    // glass cases with Ystran relics
    for (const [x, y, k] of [[4, 4, 0], [12, 12, 1], [4, 9, 2], [12, 6, 3]]) { const O = A(x + 0.5, y + 0.5); gpPedestal(O, 0.95); if (k === 0) nnP("glow", O, "oct", 0, 1.3, 0, 0.3, 0.4, 0.3, GYC.turq); else if (k === 1) { nnP("lit", O, "cyl", 0, 1.1, 0, 0.3, 0.3, 0.3, "#c89a48"); nnSp("glow", O, 0, 1.35, 0, 0.1, GYC.gold); } else if (k === 2) nnP("stone", O, "blob", 0, 1.2, 0, 0.35, 0.4, 0.35, "#f0e6d4"); else nnBx("carve", O, 0, 0.95, 0, 0.4, 0.5, 0.12, "#e2d4b8"); gpGlass(X(x + 0.5), 1.33, Z(y + 0.5), 0.72, 0.76, 0.72); }
    // tablets on the walls between the windows
    for (const side of ["n", "s", "e", "w"]) for (const u of [8.5]) { const O = gpWallAt(A, W, D, side, u); nnBx("carve", O, 0, 0.9, 0.1, 2.2, 3.0, 0.22, "#e8dcc2"); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) gyGlyph(O, -0.65 + c * 0.65, 3.5 - r * 0.85, 0.22, 0.32, 0.5, 0, (r + c) % 2 ? GYC.turq : GYC.gold); }
    for (const [x, y, ry] of [[8.5, 13.6, Math.PI], [5, 2.5, 0]]) gyBench(A(x, y, ry)); for (const [x, y] of [[1.5, 1.5], [15.5, 15.5]]) gpUrnFern(A(x, y));
    lite(8.5, 8.5, "#ffe0b0", 3, 12, 4.4); lite(4, 13, "#ffd090", 1.8, 8, 3); lite(13, 13, "#9af0e0", 1.6, 8, 3); lite(4, 4, "#ffd090", 1.6, 8, 3); } });

// 3F: the Signal Room; a great brass dish on a turntable, crystal coils in cages, the old relay consoles
defPlace("gr3", { name: "Relay Tower Signal Room", w: 16, d: 16, style: "gytemple", indoor: true, wallH: 5,
  grid() { const g = gpRoom(16, 16); pRect(g, 1, 12, 3, 14, " "); /* stairwell down, south-west */ pRect(g, 1, 1, 3, 3, "o"); /* stair up, north-west */ pRect(g, 6, 6, 9, 9, "o"); /* dish */ for (const [x, y] of [[4, 11], [11, 4], [11, 11], [5, 4]]) pRect(g, x, y, x, y, "o"); /* coils */ pRect(g, 14, 5, 14, 11, "o"); /* consoles */ return g; },
  arrive: { in: [2.5, 9.0, 0], up: [2.5, 7.0, Math.PI] },
  portals: [{ t: [2.5, 11.3], to: "gr2:up", label: "Go down to the Rune Gallery", flat: true }, { t: [2.5, 4.6], to: "gr4:in", label: "Climb to the Chime Loft", flat: true }],
  dress({ X, Z, g, lite }) { const A = gpA(X, Z), W = 16, D = 16;
    gpTowerRoom(A, g, W, D, { keep: (s, u) => !(s === "w") && !(s === "n" && u < 5) && !(s === "e" && u > 4 && u < 12), win: (s, u) => !(s === "w") && !(s === "e"), corner: (x, y) => x > 8 });
    gpStairDown(A(2.5, 12.0, Math.PI), 3, 3); gpStairUp(A(2.5, 4.0, 0), 3, 9, 0.45, 0.33, 5);
    // the dish: a brass bowl tilted at the sky, its feed horn glowing, on a geared turntable
    { const O = A(8, 8); nnP("lit", O, "cyl12", 0, 0.2, 0, 3.6, 0.4, 3.6, "#6a5a4a"); for (let k = 0; k < 24; k++) { const a = (k / 24) * TAU; nnBx("lit", O, Math.cos(a) * 1.85, 0.05, Math.sin(a) * 1.85, 0.25, 0.3, 0.14, "#8a6a3a", -a); } nnP("lit", O, "cyl", 0, 1.1, 0, 0.6, 1.4, 0.6, "#8a6a3a");
      { const dm = add(new THREE.SphereGeometry(2.4, 28, 6, 0, TAU, 0, 0.78), thM("gyDishBrass", () => std({ color: "#c8963a", metalness: 0.45, roughness: 0.35, side: THREE.DoubleSide })), [X(8), 2.0 + 2.4 * Math.cos(0.5), Z(8) - 2.4 * Math.sin(0.5)], [Math.PI - 0.5, 0, 0]); dm.name = "nocol"; } nnP("lit", O, "cyl", 0, 2.65, -0.37, 0.1, 1.5, 0.1, "#6a4a2a", -0.52, 0, 0); nnP("glow", O, "oct", 0, 3.35, -0.78, 0.36, 0.5, 0.36, GYC.turq); nnP("glow", O, "ring", 0, 2.0 + 2.4 * Math.cos(0.5) * (1 - Math.cos(0.78)), -2.4 * Math.sin(0.5) * (1 - Math.cos(0.78)), 3.4, 2, 3.4, GYC.gold, -0.5, 0, 0); }
    // crystal coils: tall crystals in brass cages, cables to the dish
    for (const [x, y] of [[4, 11], [11, 4], [11, 11], [5, 4]]) { const O = A(x + 0.5, y + 0.5); nnCy("lit", O, 0, 0, 0, 0.45, 0.4, "#6a5a4a"); for (let k = 0; k < 4; k++) { const a = (k / 4) * TAU + 0.78; nnCy("lit", O, Math.cos(a) * 0.38, 0.4, Math.sin(a) * 0.38, 0.04, 2.4, "#c89a48"); } for (const y2 of [0.9, 1.7, 2.5]) nnP("lit", O, "ring", 0, y2, 0, 0.82, 1, 0.82, "#c89a48"); nnP("glow", O, "oct", 0, 1.6, 0, 0.42, 1.7, 0.42, (x + y) % 2 ? GYC.turq : "#c8a8ff"); nnP("lit", O, "pyr", 0, 2.95, 0, 0.9, 0.4, 0.9, "#8a6a3a"); const dx = 8 - (x + 0.5), dz = 8 - (y + 0.5), L = Math.hypot(dx, dz) - 2.2; nnP("lit", O, "cyl", dx * 0.5 * (L / (L + 2.2)), 0.06, dz * 0.5 * (L / (L + 2.2)), 0.1, L, 0.1, "#2a2a2a", Math.PI / 2, Math.atan2(dx, dz), 0); }
    // the consoles on the east wall: dark slate desks, glyph screens, brass dials
    for (let k = 0; k < 3; k++) { const O = A(14.4, 5.8 + k * 2.4, -Math.PI / 2); nnBx("lit", O, 0, 0, 0.1, 2.0, 0.9, 0.8, "#3a3530"); nnP("lit", O, "box", 0, 0.95, 0.1, 2.0, 0.08, 0.8, "#4a4038", 0.25, 0, 0); nnBx("lit", O, 0, 1.0, -0.25, 2.0, 1.3, 0.12, "#3a3530"); nnBx("glow", O, 0, 1.15, -0.18, 1.7, 1.0, 0.02, "#1d4a46"); for (let r = 0; r < 4; r++) nnBx("glow", O, -0.3 + (r % 2) * 0.5, 1.95 - r * 0.22, -0.16, 0.7 - (r % 3) * 0.15, 0.04, 0.02, r % 2 ? GYC.gold : GYC.turq); for (const s of [-0.6, 0, 0.6]) { nnP("lit", O, "cyl12", s, 1.0, 0.25, 0.22, 0.04, 0.22, "#c89a48", 0.25, 0, 0); nnSp("glow", O, s, 1.03, 0.28, 0.035, (k + s) > 0 ? "#ff9a3a" : GYC.jade); } }
    // copper pipes up the walls and across the top
    for (const [x, y] of [[8, 1.25], [8, 14.75]]) nnP("lit", A(x, y), "cyl", 0, 4.4, 0, 0.16, 13, 0.16, "#b86a3a", 0, 0, Math.PI / 2); for (const x of [6, 10]) nnCy("lit", A(x, 1.25), 0, 0, 0, 0.08, 4.5, "#b86a3a");
    lite(8, 8, "#9af0e0", 3, 12, 4); lite(4.5, 11.5, "#c8a8ff", 1.8, 7, 2); lite(11.5, 4.5, "#9af0e0", 1.8, 7, 2); lite(13, 8, "#ffd090", 1.6, 7, 2.6); } });

// 4F: the Chime Loft; big bronze bells and a cluster of long chimes hang from the beams, the old bell gears on the wall
defPlace("gr4", { name: "Relay Tower Chime Loft", w: 15, d: 15, style: "gytemple", indoor: true, wallH: 5,
  grid() { const g = gpRoom(15, 15); pRect(g, 1, 1, 3, 3, " "); /* stairwell down, north-west */ pRect(g, 11, 10, 13, 13, "o"); /* stair up to the roof, south-east */ pRect(g, 6, 6, 8, 8, "o"); /* chime cluster */ pRect(g, 6, 1, 8, 1, "o"); /* gear wall */ return g; },
  arrive: { in: [2.5, 7.0, Math.PI], up: [12.5, 7.0, 0] },
  portals: [{ t: [2.5, 4.6], to: "gr3:up", label: "Go down to the Signal Room", flat: true }, { t: [12.5, 9.3], to: "grTop:in", label: "Climb to the Summit", flat: true }],
  dress({ X, Z, g, lite }) { const A = gpA(X, Z), W = 15, D = 15;
    gpTowerRoom(A, g, W, D, { keep: (s, u) => !(s === "n" && (u < 4.5 || (u > 5 && u < 10))) && !(s === "w" && u < 4.5) && !(s === "e" && u > 10) && !(s === "s" && u > 10), win: (s, u) => !(s === "n" && u < 5) && !(s === "w" && u < 5) && !(s === "e" && u > 10) && !(s === "s" && u > 10), corner: (x, y) => (x < 5 && y > 10) || (x > 10 && y < 5) });
    gpStairDown(A(2.5, 4.0, 0), 3, 3); gpStairUp(A(12.5, 10.0, Math.PI), 3, 10, 0.42, 0.38, 5);
    // beams across the top
    for (let k = 0; k < 4; k++) { nnBx("lit", A(1.3 + 4.15 * k, 7.5), 0, 4.35, 0, 0.34, 0.4, 13.2, "#5a3a20"); nnBx("lit", A(7.5, 1.3 + 4.15 * k), 0, 4.75, 0, 13.2, 0.34, 0.3, "#5a3a20"); }
    // the bells: bronze, gold lips, hung on ropes from the beams; the ropes come down to brass cleats
    const bell = (O, s) => { const y0 = 3.4 - 1.5 * s; nnBx("deco", O, 0, 3.4, 0, 0.05, 1.0, 0.05, "#5a4030"); nnP("deco", O, "tcyl", 0, y0 + 0.65 * s, 0, 1.5 * s, 1.3 * s, 1.5 * s, "#b08840"); nnP("deco", O, "dome", 0, y0 + 1.28 * s, 0, 1.04 * s, 0.4 * s, 1.04 * s, "#a07a38"); nnP("deco", O, "cyl12", 0, y0 + 0.04, 0, 1.62 * s, 0.1, 1.62 * s, "#c89a48"); nnP("glow", O, "ring", 0, y0 + 0.1, 0, 1.64 * s, 1, 1.64 * s, GYC.gold); nnSp("deco", O, 0, y0 + 0.15, 0, 0.16, "#6a4a2a"); nnCy("deco", O, 0, y0 + 0.2, 0, 0.03, 1.0 * s, "#6a4a2a"); };
    for (const [x, y, s] of [[3.4, 7.4, 1.0], [11.4, 3.4, 1.15], [3.6, 11.6, 0.85]]) { bell(A(x, y), s); nnBx("deco", A(x, y), 0.4, 0.95, 0, 0.02, 1.3, 0.02, "#c8b088"); nnBx("lit", A(x + 0.4, y), 0, 0, 0, 0.18, 0.95, 0.18, "#6a4a2a"); }
    // the chime cluster: a ring of long tubes round a central striker
    { const O = A(7.5, 7.5); nnBx("stone", O, 0, 0, 0, 3.0, 0.3, 3.0, "#e8dcc4"); nnP("lit", O, "ring", 0, 4.2, 0, 2.6, 2, 2.6, "#8a6a3a"); for (let k = 0; k < 14; k++) { const a = (k / 14) * TAU, L = 2.0 + (k % 5) * 0.32; nnCy("deco", O, Math.cos(a) * 1.25, 4.15 - L, Math.sin(a) * 1.25, 0.06, L, "#d8a848"); nnBx("deco", O, Math.cos(a) * 1.25, 4.15, Math.sin(a) * 1.25, 0.01, 0.1, 0.01, "#3a2a1a"); }
      nnCy("lit", O, 0, 0.3, 0, 0.08, 3.9, "#6a4a2a"); nnSp("lit", O, 0, 2.3, 0, 0.32, "#8a6a3a"); nnSp("glow", O, 0, 4.4, 0, 0.14, GYC.turq); }
    // the old bell gears on the north wall
    { const O = gpWallAt(A, W, D, "n", 7.5); for (const [x, y, r] of [[-1.0, 2.6, 1.3], [1.1, 1.6, 0.8], [1.5, 3.4, 0.55]]) { nnP("lit", O, "cyl12", x, y, 0.2, r * 2, 0.16, r * 2, "#8a6a3a", Math.PI / 2, 0, 0); nnP("lit", O, "ring", x, y, 0.3, r * 2.1, 2, r * 2.1, "#c89a48", Math.PI / 2, 0, 0); for (let k = 0; k < 8; k++) { const a = (k / 8) * TAU; nnBx("lit", O, x + Math.cos(a) * r, y + Math.sin(a) * r, 0.2, 0.22, 0.22, 0.2, "#8a6a3a", 0, 0); } nnSp("glow", O, x, y, 0.32, 0.08, GYC.gold); } nnBx("stone", O, 0, 0, 0.4, 3.2, 0.5, 0.8, "#e2d4b8"); }
    lite(7.5, 7.5, "#ffe0b0", 2.8, 12, 3.6); lite(3.4, 7.4, "#ffd27a", 1.6, 7, 2); lite(11.4, 3.4, "#ffd27a", 1.6, 7, 2); } });

// the Summit (888): the open roof, the glyph beacon and its crystal, a chest by the parapet
defPlace("grTop", { name: "Relay Tower Summit", w: 14, d: 14, style: "gyroof", indoor: false, wallH: 1.2,
  grid() { const g = gpRoom(14, 14); pRect(g, 10, 10, 12, 12, " "); /* stairwell down, south-east */ pRect(g, 6, 6, 7, 7, "o"); /* beacon */ pRect(g, 6, 2, 7, 2, "o"); /* chest */ return g; },
  arrive: { in: [11.5, 7.0, 0] },
  portals: [{ t: [11.5, 9.3], to: "gr4:up", label: "Go back down", flat: true }],
  trainers: [[3.5, 7]],
  dress({ X, Z, g, lite }) { const A = gpA(X, Z), W = 14, D = 14; gpFlags(A, g, ["#e8dcc4", "#e0d2b6", "#ece2cc", "#d8caac"]);
    gpStairDown(A(11.5, 10.0, Math.PI), 3, 3);
    // crenellations on the parapet
    for (const side of ["n", "s", "w", "e"]) for (let u = 1.5; u < 13; u += 2) { const O = gpWallAt(A, W, D, side, u); nnBx("stone", O, 0, 1.2, -0.5, 0.9, 0.8, 1.04, "#ece0c8"); if (Math.round(u) % 4 === 1) nnP("glow", O, "box", 0, 1.6, 0.03, 0.06, 0.5, 0.02, GYC.turq); }
    // the beacon: a stepped plinth, a floating crystal and a turning gold ring
    { const O = A(7, 7); for (let k = 0; k < 3; k++) nnBx("stone", O, 0, k * 0.3, 0, 2.6 - k * 0.6, 0.3, 2.6 - k * 0.6, k % 2 ? "#e8dcc4" : "#f0e6d2"); for (let k = 0; k < 4; k++) { const a = (k / 4) * TAU + 0.78; nnP("carve", O, "box", Math.cos(a) * 0.75, 1.7, Math.sin(a) * 0.75, 0.3, 2.4, 0.5, "#e2d4b8", 0, -a, 0.18 * (k % 2 ? 1 : -1)); }
      nnP("glow", O, "oct", 0, 3.2, 0, 1.2, 2.4, 1.2, GYC.turq); nnP("glow", O, "ring", 0, 3.2, 0, 2.8, 2, 2.8, GYC.gold, 0.35, 0, 0.2); nnP("glow", O, "ring", 0, 3.2, 0, 2.3, 2, 2.3, GYC.gold, -0.3, 0, -0.25); gyGlyph(O, 0, 0.85, 0.71, 0.6, 0.5); }
    gpChest(A(7, 2.5, 0)); for (const [x, y, c] of [[1.5, 1.5, GYC.turq], [12.5, 1.5, GYC.gold], [1.5, 12.5, GYC.gold]]) gyFlag(A(x, y, x < 7 ? 0 : Math.PI), 5, c); for (const [x, y] of [[3, 3], [11, 3], [3, 11]]) gyBrazier(A(x, y));
    lite(7, 7, "#9af0e0", 4, 14, 3.4); } });

// ================= HELIX HIDEOUT (pack 884, 885): a lab dug out under the Dig Camp Storehouse =================
defPlace("gyHelix", { name: "Helix Hideout", w: 22, d: 18, style: "gylab", indoor: true, wallH: 3.8,
  grid() { const g = gpRoom(22, 18); pRect(g, 10, 14, 12, 16, "o"); /* stair up to the storehouse cellar */ for (const [x, y] of [[3, 2], [6, 2], [15, 2], [18, 2]]) pRect(g, x, y, x + 1, y + 1, "o"); /* specimen tanks */ pRect(g, 9, 1, 13, 1, "o"); /* helix wall console */
    pRect(g, 4, 7, 8, 7, "o"); pRect(g, 14, 7, 18, 7, "o"); /* lab benches */ pRect(g, 9, 9, 13, 9, "o"); /* main console, the chest beside it */ pRect(g, 20, 9, 20, 15, "o"); pRect(g, 1, 10, 1, 15, "o"); /* server racks, shelves */ pRect(g, 2, 15, 4, 16, "o"); /* weather station */ return g; },
  arrive: { in: [11.5, 11.0, 0] },
  portals: [{ t: [11.5, 13.3], to: "out:Y4", label: "Climb back up to the Storehouse", flat: true }],
  trainers: [[6, 12], [17, 12]], npcs: [["Helix scientist", 15, 15.8]],
  dress({ X, Z, g, lite }) { const A = gpA(X, Z), W = 22, D = 18; gpPlates(A, g, ["#b8c0c4", "#aeb6ba", "#c2cace"]);
    for (const x of [7.5, 15.5]) for (let y = 3; y < 17; y += 1) nnBx("glow", A(x, y + 0.5), 0, 0.035, 0, 0.06, 0.012, 0.9, "#2ad0a0"); // lit guide strips
    // the stair up, steel this time, into a hatch in the wall
    { const O = A(11.5, 13.95, 0); for (let k = 0; k < 9; k++) { nnBx("lit", O, 0, k * 0.36, k * 0.34 + 0.17, 3.0, 0.08, 0.34, "#5a6268"); nnBx("glow", O, 0, k * 0.36 + 0.08, k * 0.34 + 0.03, 2.6, 0.02, 0.03, "#ffd23a"); } for (const s of [-1, 1]) { nnP("lit", O, "box", s * 1.55, 1.9, 1.6, 0.08, 0.08, 3.9, "#ffd23a", -0.82, 0, 0); for (let k = 0; k < 4; k++) nnCy("lit", O, s * 1.55, k * 0.75, k * 0.75 + 0.2, 0.04, 1.0, "#8a949a"); } nnBx("glow", O, 0, 3.0, 3.1, 3.0, 0.8, 0.04, "#0a0a0a"); }
    // specimen tanks: glass tubes of glowing green, something curled up in each
    for (const [x, y, col] of [[3, 2, "#3affb0"], [6, 2, "#c86aff"], [15, 2, "#3affb0"], [18, 2, "#5ab8ff"]]) { const O = A(x + 1, y + 1); nnP("lit", O, "cyl12", 0, 0.25, 0, 1.6, 0.5, 1.6, "#3a4246"); nnP("lit", O, "cyl12", 0, 2.85, 0, 1.6, 0.4, 1.6, "#3a4246"); nnP("glow", O, "cyl12", 0, 1.15, 0, 1.25, 1.3, 1.25, col); nnP("lit", O, "blob", 0, 1.55, 0, 0.7, 0.8, 0.6, "#1a2a24", 0.4, 0, 0);
      const m = add(new THREE.CylinderGeometry(0.72, 0.72, 2.1, 20, 1, true), thM("gyTankGlass", () => std({ color: "#bff0e8", roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.28, depthWrite: false, side: THREE.DoubleSide })), [X(x + 1), 1.55, Z(y + 1)]); m.name = "nocol";
      for (const s of [-1, 1]) nnP("lit", O, "cyl", s * 0.5, 3.4, 0, 0.12, 0.8, 0.12, "#6a7278"); nnBx("glow", O, 0, 0.32, 0.82, 0.4, 0.12, 0.02, col); }
    // the Helix wall: a double helix of lights over the main console
    { const O = gpWallAt(A, W, D, "n", 11.5); nnBx("lit", O, 0, 0, 0.35, 5.0, 0.9, 0.7, "#3a4246"); nnP("lit", O, "box", 0, 0.95, 0.4, 5.0, 0.08, 0.7, "#4a5258", 0.3, 0, 0); nnBx("glow", O, 0, 1.2, 0.1, 4.4, 1.1, 0.02, "#123a34");
      for (let k = 0; k < 16; k++) { const t = k * 0.55, x = -2.0 + k * 0.27; for (const ph of [0, Math.PI]) nnSp("glow", O, x, 2.9 + Math.sin(t + ph) * 0.45, 0.08 + (Math.cos(t + ph) + 1) * 0.05, 0.07, ph ? "#c86aff" : "#3affb0"); if (k % 2 === 0) nnBx("lit", O, x, 2.9, 0.1, 0.03, Math.abs(Math.sin(t)) * 0.9 + 0.02, 0.03, "#8a949a"); } }
    // lab benches: steel tables of glassware, burners, notebooks
    for (const [x0, y] of [[4, 7], [14, 7]]) { const O = A(x0 + 2.5, y + 0.5); nnBx("lit", O, 0, 0.88, 0, 5.0, 0.06, 0.9, "#c8d0d4"); for (const s of [-2.3, 2.3]) for (const t of [-0.35, 0.35]) nnBx("lit", O, s, 0, t, 0.06, 0.88, 0.06, "#6a7278"); nnBx("lit", O, 0, 0.25, 0, 4.8, 0.04, 0.8, "#6a7278");
      for (let k = 0; k < 7; k++) { const u = -2.1 + k * 0.7, col = ["#3affb0", "#c86aff", "#5ab8ff", "#ffd23a"][k % 4]; if (k % 3 === 0) { nnP("lit", O, "sph", u, 1.06, -0.1, 0.24, 0.22, 0.24, "#d8f0f0"); nnSp("glow", O, u, 1.03, -0.1, 0.08, col); nnCy("lit", O, u, 1.14, -0.1, 0.03, 0.18, "#d8f0f0"); } else { for (let j = 0; j < 3; j++) nnCy("glow", O, u - 0.12 + j * 0.12, 0.91, 0.2, 0.025, 0.12 + j * 0.05, col); nnBx("lit", O, u, 0.91, 0.2, 0.42, 0.04, 0.1, "#3a4246"); } }
      nnBx("deco", O, 1.6, 0.91, -0.25, 0.5, 0.02, 0.36, "#f0f0e8", -0.2); nnCy("lit", O, -1.7, 0.91, 0.25, 0.08, 0.15, "#3a4246"); nnP("glow", O, "cone", -1.7, 1.12, 0.25, 0.08, 0.14, 0.08, "#5ab8ff"); }
    // the main console, the chest of supplies on it
    { const O = A(11, 9.5, Math.PI); nnBx("lit", O, 0, 0, 0, 4.0, 0.95, 0.9, "#3a4246"); nnP("lit", O, "box", 0, 1.0, -0.1, 4.0, 0.08, 0.9, "#4a5258", 0.3, 0, 0); for (let k = 0; k < 3; k++) { nnBx("lit", O, -1.3 + k * 1.3, 1.05, -0.35, 1.1, 0.75, 0.06, "#2a3034", -0.2); nnBx("glow", O, -1.3 + k * 1.3, 1.1, -0.31, 0.95, 0.6, 0.02, ["#123a34", "#2a1a3a", "#123a34"][k], -0.2); nnBx("glow", O, -1.3 + k * 1.3, 1.5, -0.3, 0.6, 0.04, 0.02, k === 1 ? "#c86aff" : "#3affb0", -0.2); } gpChest(A(13.6, 9.5, -Math.PI / 2), "#4a5258"); }
    // server racks along the east wall, blinking
    for (let k = 0; k < 4; k++) { const O = A(20.4, 9.4 + k * 1.6, -Math.PI / 2); nnBx("lit", O, 0, 0, 0, 1.4, 2.6, 0.8, "#2a3034"); for (let r = 0; r < 8; r++) for (let c = 0; c < 4; c++) if (gpHash(k, r * 4 + c, 3) < 0.55) nnBx("glow", O, -0.45 + c * 0.3, 0.4 + r * 0.27, 0.41, 0.05, 0.05, 0.02, gpHash(k, r * 4 + c, 4) < 0.7 ? "#3affb0" : "#ff6a3a"); }
    // shelves of supplies on the west wall
    for (let k = 0; k < 3; k++) { const O = A(1.4, 10.8 + k * 1.9, Math.PI / 2); for (let r = 0; r < 4; r++) nnBx("lit", O, 0, 0.3 + r * 0.6, 0, 1.7, 0.05, 0.5, "#8a949a"); for (const s of [-0.82, 0.82]) nnBx("lit", O, s, 0, 0, 0.05, 2.3, 0.5, "#6a7278"); for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) nnBx("lit", O, -0.5 + c * 0.5, 0.35 + r * 0.6, 0, 0.4, 0.3, 0.38, ["#c8b088", "#5a6a6a", "#e8e0d0"][(r + c + k) % 3]); }
    // the "weather station" the scientist swears this is
    { const O = A(3.5, 16, Math.PI); gyTable(O, false); nnCy("lit", O, 0.4, 0.77, 0, 0.03, 0.9, "#8a949a"); for (let k = 0; k < 3; k++) { const a = (k / 3) * TAU; nnBx("lit", O, 0.4 + Math.cos(a) * 0.2, 1.67, Math.sin(a) * 0.2, 0.4, 0.02, 0.02, "#8a949a", -a); nnP("lit", O, "dome", 0.4 + Math.cos(a) * 0.4, 1.67, Math.sin(a) * 0.4, 0.12, 0.1, 0.12, "#c8d0d4", Math.PI / 2, -a, 0); }
      nnP("lit", O, "cyl12", -0.4, 0.95, 0, 0.5, 0.06, 0.5, "#c89a48", Math.PI / 2, 0, 0); nnP("glow", O, "cyl12", -0.4, 0.95, 0.04, 0.4, 0.02, 0.4, "#e8f0f0", Math.PI / 2, 0, 0); nnBx("deco", O, -0.4, 0.95, 0.06, 0.02, 0.18, 0.01, "#2a2a2a", 0, 0); }
    // pipes and cable trays along the top of the walls, warning stripes by the stair
    for (const [x, y, L, ry] of [[11, 1.3, 19.4, 0], [11, 16.7, 19.4, 0], [1.3, 9, 15.4, Math.PI / 2], [20.7, 9, 15.4, Math.PI / 2]]) { nnP("lit", A(x, y, ry), "cyl", 0, 3.3, 0, 0.22, L, 0.22, "#6a7278", 0, 0, Math.PI / 2); nnP("lit", A(x, y, ry), "box", 0, 3.0, 0.1, L, 0.06, 0.34, "#4a5258"); }
    for (let k = 0; k < 6; k++) nnP("deco", A(9.7 + k * 0.7, 13.6), "box", 0, 0.04, 0, 0.3, 0.01, 0.9, k % 2 ? "#1a1a1a" : "#ffd23a", 0, 0.6, 0);
    for (const [x, y] of [[5.5, 4.5], [16.5, 4.5], [5.5, 12.5], [16.5, 12.5], [11, 7.5]]) { nnBx("lit", A(x, y), 0, 3.5, 0, 1.4, 0.08, 0.3, "#4a5258"); nnBx("glow", A(x, y), 0, 3.44, 0, 1.2, 0.04, 0.2, "#e8fff4"); lite(x, y, "#e8fff4", 2.2, 10, 3.2); }
    lite(11, 7, "#c8fff0", 3, 14, 3.2); lite(4.5, 3, "#3affb0", 2, 7, 1.6); lite(17.5, 3, "#5ab8ff", 2, 7, 1.6); lite(18.5, 12, "#e8fff4", 1.8, 9, 3); lite(4, 13, "#e8fff4", 1.8, 9, 3); } });

// ---------- the doors out in the world ----------
OUTPORTALS.push(
  { scene: "YV", at: [208, 49.7], arrive: [208, 52.4], to: "gtLobby:in", label: "Enter the Temple of Trials" },
  { scene: "Y9", at: [235, -8.3], arrive: [235, -5.6], to: "gv1:in", label: "Enter the Temple of Voices" },
  { scene: "YR", at: [174, 169.7], arrive: [174, 172.4], to: "gr1:in", label: "Enter the Relay Tower" },
  { scene: "Y4", at: [206, 66.2], arrive: [206, 68.8], to: "gyHelix:in", label: "Go down into the Storehouse cellar" });

// ---------- the outsides, built to hold the rooms above ----------
// Temple of Trials: a 22 x 18 hall (7 m inside) with the arena on its roof; front (+z) has a portico of six columns
const gyTrialsHall = (O) => { const w = 22, d = 18, H1 = 7.6, top = H1 + 1.2;
  nnBx("stone", O, 0, -0.8, 0, w, 1.4, d, stc(O, 50)); for (let k = 0; k < 3; k++) nnBx("stone", O, 0, -0.6, d / 2 + 1.25 - k * 0.45, 8.6 - k * 0.5, 0.8 + k * 0.2, 0.45, "#f4ece0");
  nnBx("stone", O, 0, 0.6, -0.4, w - 1.0, H1, d - 1.8, stc(O, 51)); nnBx("carve", O, 0, H1, -0.2, w - 0.4, 1.2, d - 1.2, stc(O, 52)); nnBx("stone", O, 0, top - 0.2, -0.2, w - 0.6, 0.4, d - 1.4, stc(O, 53));
  for (const s of [-1, 1]) for (let z = -d / 2 + 2.2; z < d / 2 - 1.5; z += 3) { nnBx("carve", O, s * (w / 2 - 0.42), 0.6, z, 0.36, H1, 0.9, stc(O, 54)); gyGlyph(gyAt(O, s * (w / 2 - 0.22), z), 0, 5.2, 0, 0.4, 0.6, s * Math.PI / 2, GYC.turq); }
  nnBx("glow", O, 0, 0.6, d / 2 - 1.28, 3.0, 4.4, 0.04, "#14100a"); for (const s of [-1, 1]) nnP("glow", O, "box", s * 1.6, 2.8, d / 2 - 1.25, 0.12, 4.4, 0.05, GYC.gold); nnP("glow", O, "box", 0, 5.05, d / 2 - 1.25, 3.3, 0.12, 0.05, GYC.gold); gyGlyph(O, 0, 6.6, d / 2 - 1.26, 0.9, 1.0, 0, GYC.gold);
  for (const x of [-8.6, -5.6, -2.6, 2.6, 5.6, 8.6]) gyColumn(gyAt(O, x, d / 2 - 0.5), H1 - 0.6, 0, 0.42); nnBx("carve", O, 0, H1, d / 2 - 0.6, w, 1.2, 1.4, stc(O, 55)); for (let i = 0; i < 7; i++) gyGlyph(O, -8.4 + i * 2.8, H1 + 1.0, d / 2 + 0.11, 0.42, 0.6, 0, i % 2 ? GYC.turq : GYC.gold);
  // the arena tier: a parapet round the roof, the top rows of the stands showing above it, awnings and banner masts
  for (const s of [-1, 1]) { nnBx("stone", O, s * (w / 2 - 0.5), top, -0.2, 0.9, 1.4, d - 1.4, stc(O, 56)); nnBx("stone", O, 0, top, s * (d / 2 - 0.9) - 0.2, w - 0.6, 1.4, 0.9, stc(O, 57)); nnBx("stone", O, s * (w / 2 - 2.6), top, -0.2, 2.8, 1.8, d - 3.4, "#ece2cc"); nnP("deco", O, "box", s * (w / 2 - 2.4), top + 3.4, -0.2, 3.4, 0.05, d - 4, s < 0 ? "#e8dcc0" : "#d8c8a0", 0, 0, s * 0.18);
    for (const z of [-6, 0, 6]) nnCy("lit", O, s * (w / 2 - 0.9), top, z, 0.06, 3.4, "#6a4a2a"); nnP("glow", O, "box", 0, top + 1.0, s * (d / 2 - 0.42) - 0.2, w - 2, 0.07, 0.03, s > 0 ? GYC.turq : GYC.gold); }
  for (const [x, z, c] of [[-1, -1, GYC.turq], [1, -1, GYC.gold], [-1, 1, GYC.gold], [1, 1, GYC.turq]]) { const P = gyAt(O, x * (w / 2 - 0.9), z * (d / 2 - 1.2)); nnBx("stone", P, 0, 0.6, 0, 1.8, top + 1.6, 1.8, stc(P, 58)); nnP("carve", P, "pyr", 0, top + 2.6, 0, 2.4, 1.2, 2.4, "#e8dcc2", 0, Math.PI / 4, 0); nnSp("glow", P, 0, top + 3.4, 0, 0.2, c); gyFlag(P, top + 7.2, c); }
  gyVines(gyAt(O, -6, d / 2 - 0.1), 3, H1 * 0.8, 0); gyVines(gyAt(O, 7, d / 2 - 0.1), 2.6, H1 * 0.7, 0); for (const s of [-1, 1]) { gyBrazier(gyAt(O, s * 5.2, d / 2 + 2.4)); gyChimePost(gyAt(O, s * 9.6, d / 2 + 2.2, s < 0 ? 0 : Math.PI)); } };

// Temple of Voices: four stepped tiers (22x20, 18x16, 14x12, the 12x10 shrine), each storey 4.8 m; a carved face over the door; chime frames on the terraces
const gyVoicesPyramid = (O) => { const T = [[22, 20], [18, 16], [14, 12], [12, 10]], hh = 4.8;
  T.forEach(([w, d], i) => { const y0 = i * hh, h = i === 3 ? 5.2 : hh; nnBx(i % 2 ? "carve" : "stone", O, 0, y0 - (i ? 0 : 0.8), 0, w, h + (i ? 0 : 0.8), d, stc(O, 60 + i)); nnBx("carve", O, 0, y0 + h - 0.45, 0, w + 0.3, 0.45, d + 0.3, stc(O, 64 + i));
    for (const s of [-1, 1]) { nnP("glow", O, "box", 0, y0 + h - 0.62, s * (d / 2 + 0.16), w * 0.8, 0.07, 0.03, i % 2 ? GYC.gold : GYC.turq); nnP("glow", O, "box", s * (w / 2 + 0.16), y0 + h - 0.62, 0, 0.03, 0.07, d * 0.8, i % 2 ? GYC.turq : GYC.gold); }
    for (let u = -w / 2 + 1.5; u < w / 2 - 1; u += 2.5) if (Math.abs(u) > 2.5 || i === 3) gyGlyph(O, u, y0 + h * 0.6, d / 2 + 0.02, 0.4, 0.6, 0, (Math.round(u) + i) % 2 ? GYC.turq : GYC.gold);
    if (gh(O.x + i, O.z, 600) < 0.8) gyMoss(O, (gh(O.x, O.z, 601 + i) - 0.5) * w * 0.8, y0 + h, d / 2 - 0.4, 0.6); });
  nnBx("glow", O, 0, 0, 10.02, 3.0, 3.8, 0.04, "#14100a"); for (const s of [-1, 1]) { nnP("glow", O, "box", s * 1.6, 1.9, 10.04, 0.12, 3.9, 0.05, GYC.gold); gyColumn(gyAt(O, s * 2.3, 10.4), 3.6, 0, 0.36); } nnBx("carve", O, 0, 4.0, 10.25, 5.6, 0.8, 0.6, stc(O, 70));
  nnP("stone", O, "blob", 0, 7.0, 8.2, 3.6, 3.6, 1.0, "#f0e6d4"); for (const s of [-1, 1]) { nnBx("stone", O, s * 0.8, 7.6, 8.62, 0.9, 0.12, 0.3, "#c8bca8"); nnP("glow", O, "sph", s * 0.8, 7.35, 8.66, 0.3, 0.2, 0.06, GYC.gold); } nnBx("stone", O, 0, 6.2, 8.66, 1.0, 0.12, 0.25, "#c8bca8");
  nnP("carve", O, "pyr", 0, 3 * hh + 5.2 + 1.6, 0, 12 * 1.45, 3.2, 10 * 1.45, stc(O, 71), 0, Math.PI / 4, 0); nnSp("glow", O, 0, 3 * hh + 5.2 + 3.6, 0, 0.35, GYC.gold); nnBx("glow", O, 0, 3 * hh + 0.4, 5.02, 2.2, 3.0, 0.04, "#14100a"); for (const s of [-1, 1]) gyColumn(gyAt(O, s * 1.7, 5.4), 3 * hh + 4.4, 0, 0.3);
  // chime frames on the second terrace, a bell in each
  for (const [x, z] of [[-8, -7], [8, -7], [-8, 7], [8, 7]]) { const y = hh; for (const [a, b] of [[-0.7, -0.7], [0.7, -0.7], [-0.7, 0.7], [0.7, 0.7]]) nnCy("lit", O, x + a, y, z + b, 0.07, 2.8, "#8a6a3a"); nnP("lit", O, "pyr", x, y + 3.2, z, 2.4, 0.9, 2.4, "#c8a878", 0, Math.PI / 4, 0); nnP("lit", O, "cone", x, y + 2.2, z, 0.8, 0.9, 0.8, "#b08840"); gyChimes(O, x, y + 2.75, z + 0.72, 5); nnSp("glow", O, x, y + 3.8, z, 0.12, GYC.turq); } };

// Relay Tower: five floors of 5.4 m stepping in a metre a floor (18, 17, 16, 15), the 14 m summit with its beacon
const gyRelayTower = (O) => { const fh = 5.4;
  for (let f = 0; f < 4; f++) { const s = 18 - f, y0 = f * fh; nnBx(f % 2 ? "carve" : "stone", O, 0, y0 - (f ? 0 : 0.8), 0, s, fh + (f ? 0 : 0.8), s, stc(O, 80 + f)); nnBx("carve", O, 0, y0 + fh - 0.5, 0, s + 0.5, 0.5, s + 0.5, stc(O, 84 + f));
    for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { nnBx("stone", O, a * (s / 2 - 0.2), y0, b * (s / 2 - 0.2), 1.3, fh - 0.5, 1.3, stc(O, 88 + f)); nnP("glow", O, "box", a * (s / 2 + 0.46), y0 + fh * 0.45, b * (s / 2 - 0.2), 0.02, fh * 0.5, 0.06, GYC.turq); }
    for (const k of [-1, 1]) { const u = k * s * 0.2; for (const [nx, nz] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) { if (f === 0 && nz === 1) continue; const px = nx ? nx * (s / 2 + 0.02) : u, pz = nz ? nz * (s / 2 + 0.02) : u; nnP("glow", O, "box", px, y0 + 2.6, pz, nx ? 0.04 : 0.7, 2.0, nx ? 0.7 : 0.04, "#1a2e30"); nnP("stone", O, "box", px + nx * 0.1, y0 + 1.5, pz + nz * 0.1, nx ? 0.24 : 1.1, 0.18, nx ? 1.1 : 0.24, "#e2d4b6"); nnP("glow", O, "box", px + nx * 0.06, y0 + 1.66, pz + nz * 0.06, nx ? 0.03 : 0.7, 0.04, nx ? 0.7 : 0.03, GYC.turq); } }
    for (let i = 0; i < 4; i++) gyGlyph(O, -s / 2 + 2 + i * ((s - 4) / 3), y0 + fh - 0.12, s / 2 + 0.27, 0.36, 0.3, 0, i % 2 ? GYC.gold : GYC.turq); }
  // the door: a corbelled arch on the south face
  nnBx("glow", O, 0, 0, 9.02, 3.0, 4.2, 0.04, "#14100a"); gyArch(gyAt(O, 0, 9.4), 3.2, 4.0, 0.8);
  // the summit: parapet and merlons, the beacon's crystal and its gold rings, flags
  const top = 4 * fh, s = 14; nnBx("stone", O, 0, top - 0.3, 0, s + 0.6, 0.3, s + 0.6, stc(O, 92)); for (const b of [-1, 1]) { nnBx("stone", O, 0, top, b * (s / 2 - 0.5), s, 1.2, 1.0, stc(O, 93)); nnBx("stone", O, b * (s / 2 - 0.5), top, 0, 1.0, 1.2, s, stc(O, 94)); for (let u = -s / 2 + 1.5; u < s / 2; u += 2) { nnBx("stone", O, u, top + 1.2, b * (s / 2 - 0.5), 0.9, 0.8, 1.0, "#ece0c8"); nnBx("stone", O, b * (s / 2 - 0.5), top + 1.2, u, 1.0, 0.8, 0.9, "#ece0c8"); } }
  for (let k = 0; k < 3; k++) nnBx("stone", O, 0, top + k * 0.3, 0, 2.6 - k * 0.6, 0.3, 2.6 - k * 0.6, "#f0e6d2"); nnP("glow", O, "oct", 0, top + 3.2, 0, 1.2, 2.4, 1.2, GYC.turq); nnP("glow", O, "ring", 0, top + 3.2, 0, 2.8, 2, 2.8, GYC.gold, 0.35, 0, 0.2); nnP("glow", O, "ring", 0, top + 3.2, 0, 2.3, 2, 2.3, GYC.gold, -0.3, 0, -0.25);
  for (const [a, b, c] of [[-1, -1, GYC.turq], [1, -1, GYC.gold], [-1, 1, GYC.gold]]) gyFlag(gyAt(O, a * 5.5, b * 5.5), top + 5, c); for (const s2 of [-1, 1]) gyBrazier(gyAt(O, s2 * 3, 10.6)); };

// the cellar hatch beside the Dig Camp Storehouse: two slanted plank doors in a stone surround
const gyCellarHatch = (O) => { nnBx("stone", O, 0, 0, 0, 3.0, 0.35, 2.4, "#d8ccb4"); for (const s of [-1, 1]) { nnP("lit", O, "box", s * 0.65, 0.6, -0.1, 1.25, 0.08, 2.0, "#7a5a3a", 0.32, 0, s * 0.18); for (const z of [-0.6, 0.4]) nnP("lit", O, "box", s * 0.65, 0.66, z, 1.2, 0.04, 0.1, "#3a3a3a", 0.32, 0, s * 0.18); } nnBx("lit", O, 0, 0.35, -1.05, 2.8, 0.7, 0.3, "#6a4a2a"); nnBx("glow", O, 0, 0.36, 1.21, 1.6, 0.05, 0.02, "#3affb0"); gyLantern(gyAt(O, 1.9, 0.6)); gyCrates(gyAt(O, -2.1, -0.6), 2); };
