// ================= DETAIL KIT (Nov 20 2026): the Neonis detail system, shared by every world =================
// Each world calls ASSETS.detailKit(THREE, { add, std, unwarp, GHT }, opts) once while it builds. Everything placed with the kit goes into a
// handful of merged, vertex-coloured batches (lit solid, small decoration, glow, leaves, wood, cloth, iron), cut into square chunks so the
// camera can skip the chunks it can't see. A whole world of jungle costs a few dozen draw calls.
// O (the spot a part hangs off): null = world coordinates; {x, z, ry} = a spot on the ground, seated on the terrain when the batches are
// flushed; {abs: true, x, y, z, ry} = a fixed world spot.
// Batches "lit", "wood" and "metal" are solid (the player bumps into them); the rest are "nocol".
ASSETS.detailKit = function (THREE, env, opts = {}) {
  const TAU = Math.PI * 2, add = env.add, std = env.std, unwarp = env.unwarp || ((x, z) => [x, z]), GHT = env.GHT || (() => 0);
  const MATS = ASSETS.detailKit.mats || (ASSETS.detailKit.mats = {}), thM = (k, f) => MATS[k] || (MATS[k] = f()); // materials and textures are shared by every area build
  const CHUNK = opts.chunk || 60;
  const kR = (s) => () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const kRat = (x, z, salt = 0) => kR((Math.floor(x * 59) * 113 + Math.floor(z * 83) * 7 + salt * 7919) | 0);
  const kCv = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
  const kHex = (h, l = 0, s = 0, hu = 0) => { const c = new THREE.Color(h); if (l || s || hu) c.offsetHSL(hu, s, l); return "#" + c.getHexString(); };
  const kH3 = (x, y, z) => { const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return h - Math.floor(h); };
  const kVN = (x, y, z) => { const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), f = (t) => t * t * (3 - 2 * t), u = f(x - xi), v = f(y - yi), w = f(z - zi), L = (a, b, t) => a + (b - a) * t;
    return L(L(L(kH3(xi, yi, zi), kH3(xi + 1, yi, zi), u), L(kH3(xi, yi + 1, zi), kH3(xi + 1, yi + 1, zi), u), v), L(L(kH3(xi, yi, zi + 1), kH3(xi + 1, yi, zi + 1), u), L(kH3(xi, yi + 1, zi + 1), kH3(xi + 1, yi + 1, zi + 1), u), v), w); };

  // ---- textures: the CC0 photo set under tex/ (flat stand-ins until each picture loads) ----
  const TXV = "r4a", TX = ASSETS.detailKit.tex || (ASSETS.detailKit.tex = {});
  const kTex = (name, srgb, fill) => TX[name] || (TX[name] = (() => { const c = kCv(4, 4), C = c.getContext("2d"); C.fillStyle = fill; C.fillRect(0, 0, 4, 4);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    const hk = typeof globalThis !== "undefined" && globalThis.NNTEXLOAD; if (hk) { const im = hk(name); if (im) { t.image = im; t.needsUpdate = true; return t; } }
    try { if (typeof Image === "function" && typeof location !== "undefined" && /^https?:/.test(location.protocol)) { const im = new Image(); im.decoding = "async"; im.onload = () => { if (im.naturalWidth) { t.image = im; t.needsUpdate = true; } }; im.src = "tex/" + name + ".webp?v=" + TXV; } } catch (e) { }
    return t; })());
  // a daylight reflection map (sky above, sea and sand below) so wood, iron and wet leaves pick up the light the way the world does
  const ENV = ASSETS.detailKit.env || (ASSETS.detailKit.env = {}); const kEnv = () => ENV.t || (ENV.t = (() => { const S = 32, ec = opts.env || { top: "#7ac0e8", mid: "#d8f0f0", low: "#3a8a78", gnd: "#8a7a5a" }, faces = [];
    for (let f = 0; f < 6; f++) { const c = kCv(S, S), C = c.getContext("2d"); if (f === 2) { C.fillStyle = ec.top; C.fillRect(0, 0, S, S); } else if (f === 3) { C.fillStyle = ec.gnd; C.fillRect(0, 0, S, S); }
      else { const g = C.createLinearGradient(0, 0, 0, S); g.addColorStop(0, ec.top); g.addColorStop(0.48, ec.mid); g.addColorStop(0.55, ec.low); g.addColorStop(1, ec.gnd); C.fillStyle = g; C.fillRect(0, 0, S, S); } faces.push(c); }
    const t = new THREE.CubeTexture(faces); t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true; return t; })());
  const kEnvd = (m, i) => { m.envMap = kEnv(); m.envMapIntensity = i; return m; };
  // triplanar painted grit for the solid batch (same shader as the Neonis city)
  const PBV = "vec3 pbW(vec3 n) { vec3 b = pow(abs(n), vec3(4.0)); return b / (b.x + b.y + b.z + 1e-5); }\nfloat fxH(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }\nfloat fxVN(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(mix(fxH(i), fxH(i + vec3(1, 0, 0)), f.x), mix(fxH(i + vec3(0, 1, 0)), fxH(i + vec3(1, 1, 0)), f.x), f.y), mix(mix(fxH(i + vec3(0, 0, 1)), fxH(i + vec3(1, 0, 1)), f.x), mix(fxH(i + vec3(0, 1, 1)), fxH(i + vec3(1, 1, 1)), f.x), f.y), f.z); }\n";
  const kPB = (m, sc, o = {}) => { const nrm = o.n ? kTex(o.n, false, "#8080ff") : null, ns = (o.ns ?? 1).toFixed(2), rv = (o.rv ?? 0.3).toFixed(2);
    m.onBeforeCompile = (sh) => { sh.uniforms.fxS = { value: sc }; if (nrm) sh.uniforms.pbN = { value: nrm };
      sh.vertexShader = "varying vec3 fxP; varying vec3 fxN;\n" + sh.vertexShader.replace("#include <project_vertex>", "#include <project_vertex>\n{ vec4 fwp = vec4(transformed, 1.0); vec3 fwn = objectNormal;\n#ifdef USE_INSTANCING\n fwp = instanceMatrix * fwp; fwn = mat3(instanceMatrix) * fwn;\n#endif\n fxP = (modelMatrix * fwp).xyz; fxN = normalize(mat3(modelMatrix) * fwn); }");
      sh.fragmentShader = "uniform float fxS; varying vec3 fxP; varying vec3 fxN;\n" + (nrm ? "uniform sampler2D pbN;\n" : "") + PBV + sh.fragmentShader
        .replace("#include <map_fragment>", "{ vec3 bw = pbW(fxN); vec4 tx = texture2D(map, fxP.zy * fxS) * bw.x + texture2D(map, fxP.xz * fxS) * bw.y + texture2D(map, fxP.xy * fxS) * bw.z; diffuseColor *= tx;\n float m1 = fxVN(fxP * 0.09 + 7.3), m2 = fxVN(vec3(fxP.x * 0.85, fxP.y * 0.11, fxP.z * 0.85)); diffuseColor.rgb *= (0.88 + 0.22 * m1) * (0.93 + 0.1 * m2); }")
        .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\n{ roughnessFactor = clamp(roughnessFactor * (1.0 - " + rv + " + 2.0 * " + rv + " * fxVN(fxP * 2.3 + 1.7)), 0.05, 1.0); }")
        .replace("#include <normal_fragment_maps>", "#include <normal_fragment_maps>\n" + (nrm ? "{ vec3 bw = pbW(fxN); vec3 wN = normalize(fxN); vec3 a = texture2D(pbN, fxP.zy * fxS).xyz * 2.0 - 1.0, b = texture2D(pbN, fxP.xz * fxS).xyz * 2.0 - 1.0, c = texture2D(pbN, fxP.xy * fxS).xyz * 2.0 - 1.0;\n a.xy *= " + ns + "; b.xy *= " + ns + "; c.xy *= " + ns + ";\n a = vec3(a.xy + wN.zy, abs(a.z) * wN.x); b = vec3(b.xy + wN.xz, abs(b.z) * wN.y); c = vec3(c.xy + wN.xy, abs(c.z) * wN.z);\n vec3 nW = normalize(a.zyx * bw.x + b.xzy * bw.y + c.xyz * bw.z); normal = normalize((viewMatrix * vec4(nW, 0.0)).xyz); }" : ""));
    };
    m.customProgramCacheKey = () => "dk-pb" + sc.toFixed(3) + (nrm ? "n" : "") + ns + rv; return m; };
  const mGrit = () => thM("grit", () => kPB(std({ map: kTex("nn_grit_d", true, "#d6d6d6"), vertexColors: true, roughness: 0.7, metalness: 0 }), 0.35, { n: "nn_grit_n", ns: 0.9, rv: 0.4 }));
  const mWood = () => thM("wood", () => kEnvd(std({ map: kTex("nn_wood_d", true, "#c8bca8"), normalMap: kTex("nn_wood_n", false, "#8080ff"), normalScale: new THREE.Vector2(0.8, 0.8), vertexColors: true, roughness: 0.74, metalness: 0 }), 0.35));
  const mCloth = () => thM("cloth", () => kEnvd(std({ map: kTex("nn_cloth_d", true, "#cccccc"), normalMap: kTex("nn_cloth_n", false, "#8080ff"), normalScale: new THREE.Vector2(0.8, 0.8), vertexColors: true, roughness: 0.9, metalness: 0, side: THREE.DoubleSide }), 0.25));
  const mIron = () => thM("iron", () => kEnvd(kPB(std({ map: kTex("nn_grit_d", true, "#d6d6d6"), vertexColors: true, roughness: 0.42, metalness: 0 }), 0.7, { n: "nn_pmet_n", ns: 0.55, rv: 0.3 }), 0.8));
  const mGlow = () => thM("glow", () => new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }));

  // ---- the foliage atlas (512 x 512, grey so vertex colour tints it):
  //  top-left  : broadleaf spray      top-right   : a pinnate frond (palms, ferns, tree ferns)
  //  bottom-left: one giant split leaf (the elephant-ear / monstera shape)    bottom-right: a hanging strand of vine leaves
  const mLeaf = () => thM("leaf", () => { const W = 512, c = kCv(W, W), C = c.getContext("2d"), rnd = kR(4242); C.clearRect(0, 0, W, W);
    const leaf = (x, y, a, L, w, sh) => { C.save(); C.translate(x, y); C.rotate(a); C.fillStyle = `rgb(${sh},${sh},${sh})`; C.beginPath(); C.moveTo(0, 0); C.bezierCurveTo(L * 0.25, -w, L * 0.7, -w * 0.9, L, 0); C.bezierCurveTo(L * 0.7, w * 0.9, L * 0.25, w, 0, 0); C.fill();
      C.fillStyle = "rgba(255,255,255,0.2)"; C.beginPath(); C.moveTo(L * 0.1, -1); C.bezierCurveTo(L * 0.3, -w * 0.8, L * 0.7, -w * 0.7, L * 0.95, -1); C.fill(); C.strokeStyle = "rgba(30,40,30,0.35)"; C.lineWidth = 1.4; C.beginPath(); C.moveTo(0, 0); C.lineTo(L * 0.92, 0); C.stroke(); C.restore(); };
    // broadleaf spray (top-left)
    C.strokeStyle = "rgb(70,60,52)"; C.lineCap = "round"; const tw = [];
    for (let t = 0; t < 4; t++) { const a = t * 1.6 + rnd() * 0.8, L = 70 + rnd() * 40; C.lineWidth = 4; C.beginPath(); C.moveTo(128, 128); C.lineTo(128 + Math.cos(a) * L, 128 + Math.sin(a) * L); C.stroke(); tw.push([a, L]); }
    for (let k = 0; k < 40; k++) { const [a, L] = tw[k % tw.length], f = 0.2 + rnd() * 0.85, s = rnd() < 0.5 ? 1 : -1; leaf(128 + Math.cos(a) * L * f, 128 + Math.sin(a) * L * f, a + s * (0.5 + rnd() * 0.7), 30 + rnd() * 26, 10 + rnd() * 7, Math.floor(150 + rnd() * 105)); }
    for (let k = 0; k < 10; k++) { const a = rnd() * TAU, r = rnd() * 40; leaf(128 + Math.cos(a) * r, 128 + Math.sin(a) * r, rnd() * TAU, 28 + rnd() * 16, 9 + rnd() * 5, Math.floor(120 + rnd() * 70)); }
    // pinnate frond (top-right): a midrib from the stem end to the tip with long leaflets swept forward, shorter toward the tip
    C.lineWidth = 5; C.strokeStyle = "rgb(150,140,110)"; C.beginPath(); C.moveTo(258, 128); C.quadraticCurveTo(380, 120, 506, 128); C.stroke();
    for (let k = 0; k < 64; k++) { const t = 0.04 + (k / 64) * 0.94, x = 262 + t * 240, s = k % 2 ? 1 : -1, L = (1 - Math.pow(t, 1.6) * 0.8) * (96 + rnd() * 18), sh = Math.floor(150 + rnd() * 95);
      C.save(); C.translate(x, 128 + s * 2); C.rotate(s * (0.95 - t * 0.35) + (rnd() - 0.5) * 0.12); C.fillStyle = `rgb(${sh},${sh},${sh})`; C.beginPath(); C.moveTo(0, 0); C.quadraticCurveTo(L * 0.5, -6 - rnd() * 3, L, 0); C.quadraticCurveTo(L * 0.5, 5 + rnd() * 3, 0, 0); C.fill();
      C.strokeStyle = "rgba(255,255,255,0.18)"; C.lineWidth = 1; C.beginPath(); C.moveTo(2, -1); C.lineTo(L * 0.9, -1); C.stroke(); C.restore(); }
    // giant split leaf (bottom-left): heart-shaped blade from the stem at the left to the tip at the right, with splits and windows
    { C.save(); C.translate(6, 384); const L = 244, Wd = 112; C.fillStyle = "rgb(200,200,200)"; C.beginPath(); C.moveTo(0, 0); C.bezierCurveTo(-10, -Wd * 0.9, L * 0.55, -Wd * 1.05, L, 0); C.bezierCurveTo(L * 0.55, Wd * 1.05, -10, Wd * 0.9, 0, 0); C.fill();
      const gr = C.createLinearGradient(0, -Wd, 0, Wd); gr.addColorStop(0, "rgba(255,255,255,0.18)"); gr.addColorStop(0.5, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,0.18)"); C.fillStyle = gr; C.fill();
      C.globalCompositeOperation = "destination-out"; for (let k = 0; k < 7; k++) { const t = 0.2 + k * 0.1, s = k % 2 ? 1 : -1, x = L * t; C.beginPath(); C.moveTo(x + 18, s * Wd * (0.95 - t * 0.6)); C.lineTo(x + 6, s * 18); C.lineTo(x + 12, s * 16); C.lineTo(x + 26, s * Wd); C.fill(); if (k > 1 && k < 6) { C.beginPath(); C.ellipse(x + 10, s * 42, 7, 4, s * 0.5, 0, TAU); C.fill(); } }
      C.globalCompositeOperation = "source-over"; C.strokeStyle = "rgba(255,255,255,0.45)"; C.lineWidth = 4; C.beginPath(); C.moveTo(0, 0); C.lineTo(L * 0.96, 0); C.stroke(); C.lineWidth = 1.6; C.strokeStyle = "rgba(255,255,255,0.25)";
      for (let k = 1; k < 9; k++) for (const s of [-1, 1]) { const x = L * k / 10; C.beginPath(); C.moveTo(x, 0); C.quadraticCurveTo(x + 18, s * 30, x + 30, s * Wd * 0.8 * (1 - k / 11)); C.stroke(); } C.restore(); }
    // hanging vine strand (bottom-right): a stem down the middle, heart leaves all the way down, a few trailing tendrils
    C.strokeStyle = "rgb(120,110,90)"; C.lineWidth = 3; C.beginPath(); C.moveTo(384, 258); C.bezierCurveTo(372, 330, 398, 420, 384, 510); C.stroke();
    for (let k = 0; k < 30; k++) { const t = k / 30, y = 262 + t * 244, x = 384 + Math.sin(t * 9) * 6, s = k % 2 ? 1 : -1, L = 34 - t * 12 + rnd() * 10; leaf(x, y, s > 0 ? 0.6 + rnd() * 0.5 : Math.PI - 0.6 - rnd() * 0.5, L, L * 0.42, Math.floor(140 + rnd() * 110)); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    return std({ map: t, vertexColors: true, alphaTest: 0.45, roughness: 0.62, metalness: 0, side: THREE.DoubleSide }); });

  // ---- geometry: unit shapes, never indexed, so they merge by copying ----
  const GEO = ASSETS.detailKit.geo || (ASSETS.detailKit.geo = {});
  const card = (u0, v0, mode) => { const f = new THREE.PlaneGeometry(1, 1); if (mode === "h") { f.rotateX(-Math.PI / 2); f.translate(0.5, 0, 0); } else if (mode === "v") f.translate(0, -0.5, 0);
    const g = f.toNonIndexed(), U = g.attributes.uv; for (let i = 0; i < U.count; i++) U.setXY(i, u0 + U.getX(i) * 0.5, v0 + U.getY(i) * 0.5); return g; };
  const kGeo = (k) => GEO[k] || (GEO[k] = (() => { let g;
    if (k === "box") g = new THREE.BoxGeometry(1, 1, 1); else if (k === "cyl") g = new THREE.CylinderGeometry(0.5, 0.5, 1, 10); else if (k === "cyl6") g = new THREE.CylinderGeometry(0.5, 0.5, 1, 6);
    else if (k === "cone") g = new THREE.ConeGeometry(0.5, 1, 10); else if (k === "sph") g = new THREE.SphereGeometry(0.5, 9, 6); else if (k === "hemi") g = new THREE.SphereGeometry(0.5, 12, 5, 0, TAU, 0, Math.PI / 2);
    else if (k === "ico") { g = new THREE.IcosahedronGeometry(0.5, 1); if (g.index) g = g.toNonIndexed(); const P = g.attributes.position, d = new THREE.Vector3(); for (let i = 0; i < P.count; i++) { d.fromBufferAttribute(P, i).normalize(); const w = 1 + 0.18 * (kVN(d.x * 2.1 + 3.1, d.y * 2.1, d.z * 2.1) - 0.5) + 0.08 * (kVN(d.x * 4.7, d.y * 4.7 + 9, d.z * 4.7) - 0.5); P.setXYZ(i, d.x * 0.5 * w, d.y * 0.5 * w, d.z * 0.5 * w); } g.computeVertexNormals(); }
    else if (k === "ring") { g = new THREE.TorusGeometry(0.5, 0.05, 4, 24); g.rotateX(Math.PI / 2); } else if (k === "oct") g = new THREE.OctahedronGeometry(0.5, 0); else if (k === "pyr") g = new THREE.ConeGeometry(0.5, 1, 4);
    else if (k === "limb") g = new THREE.CylinderGeometry(0.32, 0.5, 1, 7); else if (k === "limb5") g = new THREE.CylinderGeometry(0.4, 0.5, 1, 5); else if (k === "tube") g = new THREE.CylinderGeometry(0.5, 0.5, 1, 5, 1, true);
    // double-faced cards: the second face is the first turned round, so both sides light from their own side
    else if (k.startsWith("card")) { const q = { card: [0, 0.5, "c"], cardn: [0.5, 0.5, "h"], cardl: [0, 0, "h"], cardv: [0.5, 0, "v"] }[k]; const a = card(q[0], q[1], q[2]), b = a.clone(); if (q[2] === "h") b.rotateX(Math.PI); else b.rotateY(Math.PI);
      const n = a.attributes.position.count * 2, P = new Float32Array(n * 3), Nn = new Float32Array(n * 3), U = new Float32Array(n * 2); let o = 0;
      for (const pg of [a, b]) for (let i = 0; i < pg.attributes.position.count; i++, o++) { P.set([pg.attributes.position.getX(i), pg.attributes.position.getY(i), pg.attributes.position.getZ(i)], o * 3); Nn.set([pg.attributes.normal.getX(i), pg.attributes.normal.getY(i), pg.attributes.normal.getZ(i)], o * 3); U[o * 2] = pg.attributes.uv.getX(i); U[o * 2 + 1] = pg.attributes.uv.getY(i); }
      g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(P, 3)); g.setAttribute("normal", new THREE.BufferAttribute(Nn, 3)); g.setAttribute("uv", new THREE.BufferAttribute(U, 2)); }
    else g = new THREE.BoxGeometry(1, 1, 1);
    return g.index ? g.toNonIndexed() : g; })());

  // ---- the batches ----
  const BINS = ["lit", "deco", "glow", "leaf", "wood", "metal", "fabric"], ND = {}; for (const b of BINS) ND[b] = [];
  const Q = new THREE.Quaternion(), Q2 = new THREE.Quaternion(), E = new THREE.Euler(), UP = new THREE.Vector3(0, 1, 0), V = new THREE.Vector3();
  const kO = (O) => O ? (O._n || (O._n = O.abs ? { abs: true, x: O.x, y: O.y, z: O.z } : { x: O.x, z: O.z, floor: O.floor })) : null;
  const P = (bin, O, gk, lx, ly, lz, sx, sy, sz, col, rx = 0, ry = 0, rz = 0) => { const yaw = (O && O.ry) || 0; let wx = lx, wz = lz;
    if (yaw) { const c = Math.cos(yaw), s = Math.sin(yaw); wx = lx * c + lz * s; wz = -lx * s + lz * c; Q.setFromEuler(E.set(rx, ry, rz)); Q.premultiply(Q2.setFromAxisAngle(UP, yaw)); E.setFromQuaternion(Q, "XYZ"); rx = E.x; ry = E.y; rz = E.z; }
    ND[bin].push([gk, kO(O), wx, ly, wz, rx, ry, rz, sx, sy, sz, col]); return ND[bin][ND[bin].length - 1]; };
  const B = (bin, O, x, y0, z, w, h, d, col, rx = 0, ry = 0, rz = 0) => P(bin, O, "box", x, y0 + h / 2, z, w, h, d, col, rx, ry, rz);
  const C = (bin, O, x, y0, z, r, h, col, gk = "cyl") => P(bin, O, gk, x, y0 + h / 2, z, r * 2, h, r * 2, col);
  const S = (bin, O, x, y, z, r, col, gk = "sph") => P(bin, O, gk, x, y, z, r * 2, r * 2, r * 2, col);
  const Beam = (bin, O, a, b, r, col, gk = "cyl") => { V.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]); const L = V.length(); if (L < 1e-4) return; Q.setFromUnitVectors(UP, V.normalize()); E.setFromQuaternion(Q, "XYZ");
    P(bin, O, gk, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, r * 2, L, r * 2, col, E.x, E.y, E.z); };
  const Ring = (bin, O, x, y, z, r, tube, col) => P(bin, O, "ring", x, y, z, r * 2, tube / 0.1, r * 2, col);
  // a leaf card; cen (local) and crad shade it as part of one soft crown
  const L = (O, gk, lx, ly, lz, sx, sy, sz, col, rx, ry, rz, cen, crad) => { const it = P("leaf", O, gk, lx, ly, lz, sx, sy, sz, col, rx, ry, rz), yaw = (O && O.ry) || 0;
    let cx = cen[0], cz = cen[2]; if (yaw) { const c = Math.cos(yaw), sn = Math.sin(yaw); cx = cen[0] * c + cen[2] * sn; cz = -cen[0] * sn + cen[2] * c; } it.push([cx, cen[1], cz], crad); };
  // a sagging line from a to b (rope, vine, cable) in n straight pieces
  const Sag = (bin, O, a, b, sag, r, col, n = 6, gk = "cyl6") => { let p = a; for (let i = 1; i <= n; i++) { const t = i / n, q = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t - Math.sin(t * Math.PI) * sag, a[2] + (b[2] - a[2]) * t]; Beam(bin, O, p, q, r, col, gk); p = q; } };

  // ---- flush: every batch becomes one mesh per chunk ----
  const flush = (root) => { const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), v = new THREE.Vector3(), n3 = new THREE.Matrix3(), base = new Map(), cc = new THREE.Color(), cv = new THREE.Vector3(), made = [];
    const seat = (O) => { if (!O) return [0, 0, 0]; if (O.abs) return [O.x, O.y, O.z]; const key = O.x + "," + O.z; let b = base.get(key); if (!b) { const [ux, uz] = unwarp(O.x, O.z); const g = GHT(ux, uz); b = [ux, Math.max(Number.isFinite(g) ? g : 0, O.floor === undefined ? -9 : O.floor), uz]; base.set(key, b); } return b; };
    for (const bin of BINS) { const all = ND[bin]; if (!all.length) continue; const isL = bin === "leaf", isU = bin === "wood" || bin === "fabric", uS = bin === "wood" ? 0.7 : 2.2, vS = bin === "wood" ? 1.6 : 2.2;
      const chunks = new Map(); for (const it of all) { const b = seat(it[1]); const key = Math.floor((b[0] + it[2]) / CHUNK) + "," + Math.floor((b[2] + it[4]) / CHUNK); let a = chunks.get(key); if (!a) chunks.set(key, (a = [])); a.push(it); }
      for (const L0 of chunks.values()) { let nv = 0; for (const it of L0) nv += kGeo(it[0]).attributes.position.count;
        const Pp = new Float32Array(nv * 3), N = new Float32Array(nv * 3), Cc = new Float32Array(nv * 3), UV = isL || isU ? new Float32Array(nv * 2) : null; let o = 0;
        for (const [gk, O, wx, ly, wz, rx, ry, rz, sx, sy, sz, col, cen, crad] of L0) { const [bx, by, bz] = seat(O);
          m4.compose(v.set(bx + wx, by + ly, bz + wz), q.setFromEuler(e.set(rx, ry, rz)), s.set(sx, sy, sz)); n3.getNormalMatrix(m4); cc.set(col);
          const paint = bin !== "glow" && !isL, gy = O ? by : null; if (isL) { cv.set(bx + cen[0], by + cen[1], bz + cen[2]); const j = kH3(bx + wx, by + ly, bz + wz); cc.offsetHSL((j - 0.5) * 0.03, 0, (j - 0.5) * 0.08); } if (paint) { const j = kH3(bx + wx, by + ly * 0.37, bz + wz); cc.offsetHSL((j - 0.5) * 0.02, (kH3(bz + wz, bx, ly) - 0.5) * 0.08, (j - 0.5) * 0.07); }
          const g = kGeo(gk), gp = g.attributes.position, gn = g.attributes.normal, gu = g.attributes.uv, hu = kH3(wx + bx, ly + 3.1, wz + bz) * 7.3, hv = kH3(wz + bz, wx + bx, ly) * 5.1;
          for (let i = 0; i < gp.count; i++, o++) { if (isU) { const ax = Math.abs(gn.getX(i)), ay = Math.abs(gn.getY(i)), az = Math.abs(gn.getZ(i)), px = gp.getX(i) * sx, py = gp.getY(i) * sy, pz = gp.getZ(i) * sz; let a, b2, sa, sb; if (ax >= ay && ax >= az) { a = pz; b2 = py; sa = sz; sb = sy; } else if (ay >= az) { a = px; b2 = pz; sa = sx; sb = sz; } else { a = px; b2 = py; sa = sx; sb = sy; } UV[o * 2] = (sa >= sb ? a : b2) * uS + hu; UV[o * 2 + 1] = (sa >= sb ? b2 : a) * vS + hv; }
            v.fromBufferAttribute(gp, i).applyMatrix4(m4); Pp[o * 3] = v.x; Pp[o * 3 + 1] = v.y; Pp[o * 3 + 2] = v.z; let k = 1;
            if (paint) { k = 0.9 + 0.2 * kVN(v.x * 0.9, v.y * 0.9 + 5, v.z * 0.9) + 0.06 * (kVN(v.x * 3.7, v.y * 3.7, v.z * 3.7) - 0.5); if (gy !== null) { const h = Math.min(1, Math.max(0, (v.y - gy) / 0.9)); k *= 0.62 + 0.38 * h * h * (3 - 2 * h); } }
            if (isL) { UV[o * 2] = gu.getX(i); UV[o * 2 + 1] = gu.getY(i); v.sub(cv); const d = v.length() / crad, h = Math.min(1, Math.max(0, d)); k = (0.5 + 0.5 * h * h * (3 - 2 * h)) * (0.92 + 0.16 * kVN(Pp[o * 3] * 1.3, Pp[o * 3 + 1] * 1.3, Pp[o * 3 + 2] * 1.3)) * (v.y > 0 ? 1.06 : 0.94); v.y = v.y * 0.7 + crad * 0.25; v.normalize(); }
            else v.fromBufferAttribute(gn, i).applyMatrix3(n3).normalize(); N[o * 3] = v.x; N[o * 3 + 1] = v.y; N[o * 3 + 2] = v.z; if (paint && v.y > 0.6) k *= 1.04; Cc[o * 3] = cc.r * k; Cc[o * 3 + 1] = cc.g * k; Cc[o * 3 + 2] = cc.b * k; } }
        const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(Pp, 3)); g.setAttribute("normal", new THREE.BufferAttribute(N, 3)); g.setAttribute("color", new THREE.BufferAttribute(Cc, 3)); if (UV) g.setAttribute("uv", new THREE.BufferAttribute(UV, 2)); g.computeBoundingSphere(); g.computeBoundingBox();
        const mat = isL ? mLeaf() : bin === "glow" ? mGlow() : bin === "wood" ? mWood() : bin === "fabric" ? mCloth() : bin === "metal" ? mIron() : mGrit();
        const m = add(g, mat, [0, 0, 0], [0, 0, 0], bin === "lit" || bin === "wood" || bin === "metal" ? null : "nocol", root); m.userData.noLift = true; m.userData.detail = bin; m.castShadow = bin !== "glow" && bin !== "deco"; m.receiveShadow = bin !== "glow";
        if (isL) m.customDepthMaterial = thM("leafD", () => new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: mLeaf().map, alphaTest: 0.45 })); made.push(m); }
      ND[bin] = []; }
    return made; };
  const count = () => { let n = 0; for (const b of BINS) for (const it of ND[b]) n += kGeo(it[0]).attributes.position.count; return n; };

  // ================= FOLIAGE AND JUNGLE BUILDERS =================
  // a clump of broadleaf cards round a twig tip; inner cards darker, top cards lighter
  const Clump = (O, q, x, y, z, r, cols, cen, crad, n = 7, gk = "card") => { for (let k = 0; k < n; k++) { const u = q() * 2 - 1, a = q() * TAU, sq = Math.sqrt(1 - u * u), rr = r * (0.15 + q() * 0.55), s = r * (1.0 + q() * 0.5);
      L(O, gk, x + Math.cos(a) * sq * rr, y + u * rr * 0.7, z + Math.sin(a) * sq * rr, s, s, s, kHex(cols[Math.floor(q() * cols.length)], (u * 0.5 + 0.5) * 0.08 - 0.03 + (q() - 0.5) * 0.06), q() * TAU, q() * TAU, q() * TAU, cen, crad); } };
  // fronds radiating from a point: n fronds, each a frond card arching out and down (a palm crown, a fern, a tree fern)
  const Fronds = (O, q, x, y, z, n, len, cols, cen, crad, lift = 0.35, droop = 0.55, gk = "cardn") => { const a0 = q() * TAU; for (let k = 0; k < n; k++) { const a = a0 + (k / n) * TAU + (q() - 0.5) * 0.35, l = len * (0.8 + q() * 0.35), tilt = lift - q() * droop, col = kHex(cols[Math.floor(q() * cols.length)], (q() - 0.5) * 0.08);
      // two cards per frond: the inner half rises, the outer half bends down, so the frond arches
      L(O, gk, x, y, z, l * 0.55, 1, l * 0.42, col, 0, a, tilt, cen, crad);
      const ex = x + Math.cos(-a) * Math.cos(tilt) * l * 0.52, ey = y + Math.sin(tilt) * l * 0.52, ez = z + Math.sin(-a) * Math.cos(tilt) * l * 0.52;
      L(O, gk, ex, ey, ez, l * 0.5, 1, l * 0.34, kHex(col, -0.03), 0, a, tilt - 0.55 - q() * 0.3, cen, crad); } };
  // a bent trunk through n pieces from y0 to height H, leaning one way; returns the points
  const Trunk = (bin, O, q, y0, H, r0, r1, col, lean, n = 4, gk = "limb") => { const pts = [[0, y0 - 0.1, 0]], la = q() * TAU; for (let k = 1; k <= n; k++) { const f = k / n, w = (q() - 0.5) * 0.15; pts.push([Math.cos(la) * lean * f * f + w, y0 + H * f, Math.sin(la) * lean * f * f - w]); }
    for (let k = 0; k < n; k++) { const r = r0 + (r1 - r0) * (k / n); Beam(bin, O, pts[k], [pts[k + 1][0], pts[k + 1][1] + 0.05, pts[k + 1][2]], r, k % 2 ? kHex(col, 0.03) : col, gk); } return pts; };

  // the rainforest giant: buttress roots, a tall pale trunk, a wide umbrella crown in layered clumps, lianas hanging from it
  const CanopyTree = (O, q, s, cols, o = {}) => { const bark = o.bark || "#8a7a68", H = (o.h || 7) * s, crad = (o.crown || 2.6) * s;
    for (let k = 0; k < 6; k++) { const a = (k / 6) * TAU + q() * 0.5, Lr = (0.9 + q() * 0.6) * s; Beam("wood", O, [0, 0.9 * s, 0], [Math.cos(a) * Lr, -0.05, Math.sin(a) * Lr], 0.11 * s, kHex(bark, -0.04), "limb5"); B("wood", O, Math.cos(a) * Lr * 0.45, -0.05, Math.sin(a) * Lr * 0.45, 0.06 * s, 0.9 * s, Lr * 0.9, kHex(bark, -0.05), 0, -a, 0); }
    const pts = Trunk("wood", O, q, 0, H, 0.3 * s, 0.17 * s, bark, 0.6 * s, 4), top = pts[pts.length - 1], cen = [top[0], top[1] + crad * 0.15, top[2]];
    // moss and a strangler vine wound round the trunk
    if (o.moss !== false) for (let k = 0; k < 7; k++) { const t = 0.15 + k * 0.11, i = Math.min(3, Math.floor(t * 4)), p = pts[i], a = k * 1.9; B("deco", O, p[0] + Math.cos(a) * 0.25 * s, p[1] + (t * 4 - i) * H / 4, p[2] + Math.sin(a) * 0.25 * s, 0.22 * s, 0.4 * s, 0.08 * s, kHex(cols[2] || cols[0], -0.12), 0, -a, 0); }
    const nl = o.limbs || 6; for (let k = 0; k < nl; k++) { const a = (k / nl) * TAU + q() * 0.7, st = pts[3 - (k % 2)], Ll = (1.5 + q() * 0.9) * s * (o.spread || 1), end = [st[0] + Math.cos(a) * Ll, st[1] + (0.6 + q() * 0.5) * s, st[2] + Math.sin(a) * Ll];
      Beam("wood", O, st, end, 0.09 * s, kHex(bark, 0.04), "limb5"); Clump(O, q, end[0], end[1] + 0.25 * s, end[2], 0.95 * s, cols, cen, crad, 9);
      const mid = [(st[0] + end[0]) / 2, (st[1] + end[1]) / 2 + 0.45 * s, (st[2] + end[2]) / 2]; Clump(O, q, mid[0], mid[1], mid[2], 0.8 * s, cols, cen, crad, 6);
      if (q() < (o.vines ?? 0.65)) { const vl = (1.5 + q() * 2.6) * s; L(O, "cardv", end[0], end[1], end[2], 0.55 * s, vl, 1, kHex(cols[1] || cols[0], -0.08), 0, q() * TAU, 0, cen, crad * 1.6); Beam("deco", O, end, [end[0], end[1] - vl * 0.95, end[2]], 0.018 * s, "#4a5a3a", "cyl6"); } }
    Clump(O, q, cen[0], cen[1] + crad * 0.2, cen[2], 1.25 * s, cols, cen, crad, 14); Clump(O, q, cen[0], cen[1] - crad * 0.05, cen[2], 1.6 * s, cols, cen, crad, 8);
    return { top, cen, crad, pts }; };
  // a palm: a ringed curving trunk and a crown of arching fronds, with a cluster of fruit (glowing pods where o.glow)
  const Palm = (O, q, s, cols, o = {}) => { const H = (o.h || 5.2) * s, la = o.lean ?? q() * TAU, lean = (o.bend ?? (0.6 + q() * 1.2)) * s, n = 7, bark = o.bark || "#9a8466"; let p = [0, -0.1, 0];
    for (let k = 1; k <= n; k++) { const f = k / n, q2 = [Math.cos(la) * lean * f * f, H * f, Math.sin(la) * lean * f * f]; Beam("wood", O, p, q2, (0.17 - f * 0.06) * s, k % 2 ? bark : kHex(bark, -0.06), "cyl6"); P("deco", O, "ring", q2[0], q2[1] - 0.05, q2[2], (0.36 - f * 0.12) * s, 0.5, (0.36 - f * 0.12) * s, kHex(bark, -0.12)); p = q2; }
    const cen = [p[0], p[1], p[2]]; Fronds(O, q, p[0], p[1] + 0.1 * s, p[2], o.fronds || 11, (o.flen || 3.0) * s, cols, cen, 2.2 * s, 0.35, 0.7);
    for (let k = 0; k < 4; k++) { const a = q() * TAU; S(o.glow ? "glow" : "lit", O, p[0] + Math.cos(a) * 0.22 * s, p[1] - 0.15 * s, p[2] + Math.sin(a) * 0.22 * s, 0.13 * s, o.glow || "#8a6a32"); }
    return { top: p }; };
  // a tree fern: a shaggy stem with a crown of long fronds
  const TreeFern = (O, q, s, cols) => { const H = (2.2 + q() * 1.2) * s; Trunk("wood", O, q, 0, H, 0.15 * s, 0.12 * s, "#5a4a3a", 0.3 * s, 3, "limb5"); for (let k = 0; k < 6; k++) B("deco", O, (q() - 0.5) * 0.2 * s, H * (0.2 + k * 0.13), (q() - 0.5) * 0.2 * s, 0.32 * s, 0.22 * s, 0.32 * s, "#4a3a2a", 0, q() * 3, 0);
    Fronds(O, q, 0, H + 0.05, 0, 12, 2.4 * s, cols, [0, H, 0], 1.8 * s, 0.4, 0.8); };
  // a ground fern: fronds straight from the ground
  const Fern = (O, q, s, cols, x = 0, z = 0) => Fronds(O, q, x, 0.05, z, 7 + Math.floor(q() * 4), 1.3 * s, cols, [x, 0.3 * s, z], 0.9 * s, 0.75, 0.6);
  // elephant ears: stalks rising out of the ground, each ending in one huge split leaf
  const GiantLeaf = (O, q, s, cols, x = 0, z = 0) => { const n = 3 + Math.floor(q() * 3), cen = [x, 0.9 * s, z]; for (let k = 0; k < n; k++) { const a = q() * TAU, h = (0.7 + q() * 0.9) * s, lx = x + Math.cos(a) * 0.35 * s, lz = z + Math.sin(a) * 0.35 * s, col = kHex(cols[Math.floor(q() * cols.length)], (q() - 0.5) * 0.08);
      Beam("deco", O, [x, 0, z], [lx, h, lz], 0.035 * s, kHex(col, -0.08), "cyl6"); L(O, "cardl", lx, h, lz, (1.1 + q() * 0.7) * s, 1, (0.85 + q() * 0.3) * s, col, 0, -a, -0.35 - q() * 0.4, cen, 1.4 * s); } };
  // a strangler fig / banyan: many roots dropping from wide limbs to a broad crown, big enough to build in
  const Banyan = (O, q, s, cols, o = {}) => { const T = CanopyTree(O, q, s, cols, { h: o.h || 6, crown: 3.4, limbs: 8, spread: 1.35, bark: o.bark || "#7a6a5a", vines: 0.9 });
    for (let k = 0; k < 9; k++) { const a = q() * TAU, r = (1.2 + q() * 2.2) * s, x = Math.cos(a) * r, z = Math.sin(a) * r, h = T.top[1] - 0.6 * s; Beam("wood", O, [x * 0.8, h, z * 0.8], [x, -0.05, z], (0.05 + q() * 0.05) * s, "#7a6a58", "limb5"); }
    return T; };
  // ground cover: tufts of blades and leaf litter
  const Tufts = (O, q, n, r0, r1, y0, cols) => { for (let k = 0; k < n; k++) { const a = q() * TAU, r = r0 + q() * (r1 - r0), cx = Math.cos(a) * r, cz = Math.sin(a) * r, c = cols[Math.floor(q() * cols.length)];
      for (let b = 0; b < 4; b++) { const h = 0.18 + q() * 0.3, ta = q() * TAU, lean = 0.2 + q() * 0.45; P("deco", O, "pyr", cx + Math.cos(ta) * 0.05, y0 + h * 0.45, cz + Math.sin(ta) * 0.05, 0.035, h, 0.035, kHex(c, -0.04 + q() * 0.12), Math.cos(ta) * lean, q() * 3, Math.sin(ta) * lean); } } };
  const Litter = (O, q, n, r0, r1, cols) => { for (let k = 0; k < n; k++) { const a = q() * TAU, r = r0 + q() * (r1 - r0); P("deco", O, "box", Math.cos(a) * r, 0.015, Math.sin(a) * r, 0.1 + q() * 0.08, 0.015, 0.07 + q() * 0.05, kHex(cols[Math.floor(q() * cols.length)], -0.05 + q() * 0.1), 0, q() * 3, 0); } };
  const Rock = (O, q, x, z, r, col) => { P("lit", O, "ico", x, r * 0.35, z, r * (1.4 + q() * 0.5), r * (0.8 + q() * 0.4), r * (1.2 + q() * 0.5), col, 0, q() * TAU, 0); };

  // ---- glowing alien flora ----
  // a lantern stalk: a bending stem with a glowing bulb that hangs like a lamp
  const GlowStalk = (O, q, s, glow, stem = "#3a5a4a", x = 0, z = 0) => { const h = (1.2 + q() * 1.2) * s, a = q() * TAU, tip = [x + Math.cos(a) * 0.5 * s, h, z + Math.sin(a) * 0.5 * s];
    Sag("deco", O, [x, 0, z], tip, -0.3 * s, 0.035 * s, stem, 4); Beam("deco", O, tip, [tip[0], tip[1] - 0.22 * s, tip[2]], 0.012 * s, stem, "cyl6"); P("glow", O, "sph", tip[0], tip[1] - 0.36 * s, tip[2], 0.2 * s, 0.28 * s, 0.2 * s, glow); P("deco", O, "cone", tip[0], tip[1] - 0.18 * s, tip[2], 0.2 * s, 0.1 * s, 0.2 * s, stem, Math.PI, 0, 0); };
  // a glow-cap cluster: little mushrooms with lit caps
  const GlowCaps = (O, q, s, glow, x = 0, z = 0) => { const n = 3 + Math.floor(q() * 5); for (let k = 0; k < n; k++) { const a = q() * TAU, r = q() * 0.45 * s, h = (0.12 + q() * 0.35) * s, cx = x + Math.cos(a) * r, cz = z + Math.sin(a) * r, cr = (0.07 + q() * 0.12) * s;
      C("deco", O, cx, 0, cz, cr * 0.3, h, "#e8e0c8"); P("glow", O, "hemi", cx, h - 0.02, cz, cr * 2, cr * 1.3, cr * 2, kHex(glow, (q() - 0.5) * 0.15)); } };
  // tube anemones: soft tubes out of the ground with glowing tips that sway on land
  const GlowTubes = (O, q, s, glow, body, x = 0, z = 0) => { const n = 5 + Math.floor(q() * 5); for (let k = 0; k < n; k++) { const a = q() * TAU, r = q() * 0.4 * s, h = (0.4 + q() * 0.9) * s, cx = x + Math.cos(a) * r, cz = z + Math.sin(a) * r, lx = Math.cos(a) * 0.25, lz = Math.sin(a) * 0.25;
      P("deco", O, "limb", cx + lx * h * 0.5, h / 2, cz + lz * h * 0.5, 0.11 * s, h, 0.11 * s, body, lz, 0, -lx); P("glow", O, "sph", cx + lx * h, h + 0.03, cz + lz * h, 0.12 * s, 0.08 * s, 0.12 * s, glow); } };
  // a spiral frond: a curled fiddlehead taller than a person, lit along its edge
  const Spiral = (O, q, s, col, glow, x = 0, z = 0) => { const n = 14, H = (1.6 + q() * 1.2) * s, a0 = q() * TAU; let p = [x, 0, z]; for (let k = 1; k <= n; k++) { const t = k / n, ang = a0 + t * 2.2, rr = t < 0.7 ? 0.08 * s : (0.08 + (t - 0.7) * 1.6) * s, y = H * Math.min(1, t / 0.75) - (t > 0.75 ? (t - 0.75) * 0.6 * s : 0);
      const q2 = [x + Math.cos(ang + t * 4) * rr, y, z + Math.sin(ang + t * 4) * rr]; Beam("deco", O, p, q2, (0.07 - t * 0.04) * s, col, "cyl6"); if (k % 3 === 0) P("glow", O, "oct", q2[0], q2[1], q2[2], 0.07 * s, 0.07 * s, 0.07 * s, glow); p = q2; } };

  // ================= CASTAWAY BUILDING: the Swiss-Family-Robinson treehouse kit =================
  // a plank deck at height h: joists, planks with gaps, an edge rope rail on posts; o.r = radius (round deck around a trunk) or o.w/o.d
  const Deck = (O, q, x, y, z, w, d, ry = 0, o = {}) => { const c = Math.cos(ry), sn = Math.sin(ry), at = (lx, lz) => [x + lx * c + lz * sn, z - lx * sn + lz * c], wood = o.wood || "#8a6440";
    for (let i = -1; i <= 1; i += 2) { const [jx, jz] = at(0, i * (d / 2 - 0.15)); B("wood", O, jx, y - 0.32, jz, w, 0.22, 0.18, kHex(wood, -0.12), 0, ry, 0); }
    const n = Math.max(3, Math.round(w / 0.32)); for (let k = 0; k < n; k++) { const lx = -w / 2 + (k + 0.5) * (w / n), [px, pz] = at(lx, 0); B("wood", O, px, y - 0.1, pz, w / n - 0.04, 0.09, d + (q() - 0.5) * 0.15, kHex(wood, (q() - 0.5) * 0.12), 0, ry, (q() - 0.5) * 0.02); }
    if (o.rail !== false) { const pts = [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]], gap = o.gap; for (let e = 0; e < 4; e++) { if (gap === e) continue; const a = pts[e], b = pts[(e + 1) % 4], [ax, az] = at(...a), [bx, bz] = at(...b), segs = Math.max(1, Math.round(Math.hypot(bx - ax, bz - az) / 1.4));
        for (let k = 0; k <= segs; k++) { const t = k / segs, px = ax + (bx - ax) * t, pz = az + (bz - az) * t; C("wood", O, px, y - 0.1, pz, 0.06, 1.05, kHex(wood, -0.08), "cyl6"); }
        for (const hy of [0.55, 0.95]) Sag("deco", O, [ax, y + hy, az], [bx, y + hy, bz], 0.08, 0.025, "#c8b080", segs * 2); } } };
  // a ladder from the ground up to height h at local (x, z), leaning slightly
  const Ladder = (O, x, z, h, ry = 0, col = "#7a5a3a") => { const c = Math.cos(ry), sn = Math.sin(ry); for (const sd of [-0.28, 0.28]) Beam("wood", O, [x + sd * c, 0, z - sd * sn], [x + sd * c, h, z - sd * sn], 0.04, col, "cyl6"); for (let y = 0.35; y < h; y += 0.38) B("deco", O, x, y, z, 0.6, 0.05, 0.06, kHex(col, 0.06), 0, ry, 0); };
  // a castaway hut: walls of ship's planks, a round porthole, a sailcloth roof on a ridge pole, a lantern at the door
  const Hut = (O, q, x, y, z, w, d, ry = 0, o = {}) => { const c = Math.cos(ry), sn = Math.sin(ry), at = (lx, lz) => [x + lx * c + lz * sn, z - lx * sn + lz * c], H = o.h || 1.9, planks = ["#9a7048", "#7a5a3c", "#a88458", "#6a7a7a", "#8a4a32"];
    for (const [lx, lz, len, rot] of [[0, -d / 2, w, 0], [0, d / 2, w, 0], [-w / 2, 0, d, 1], [w / 2, 0, d, 1]]) { const n = Math.round(H / 0.24); for (let k = 0; k < n; k++) { if (lz > 0 && !rot && k < n - 1) { // the door side: planks either side of a doorway
          for (const sd of [-1, 1]) { const ww = (len - 0.8) / 2, [px, pz] = at(sd * (0.4 + ww / 2), lz); B("wood", O, px, y + k * 0.24, pz, ww, 0.22, 0.07, planks[(k + sd + 5) % 5], 0, ry, (q() - 0.5) * 0.03); } continue; }
        const [px, pz] = at(lx, lz); B("wood", O, px, y + k * 0.24, pz, rot ? 0.07 : len, 0.22, rot ? len : 0.07, planks[(k * 3 + (rot ? 1 : 0)) % 5], 0, ry, (q() - 0.5) * 0.03); } }
    for (const [lx, lz] of [[-w / 2, -d / 2], [w / 2, -d / 2], [-w / 2, d / 2], [w / 2, d / 2]]) { const [px, pz] = at(lx, lz); C("wood", O, px, y, pz, 0.08, H + 0.3, "#5a4030", "cyl6"); }
    { const [px, pz] = at(w / 2 + 0.02, 0); P("metal", O, "ring", px, y + H * 0.6, pz, 0.42, 1.6, 0.42, "#b08a40", 0, 0, Math.PI / 2 + 0); P("glow", O, "cyl", px, y + H * 0.6, pz, 0.36, 0.02, 0.36, o.window || "#ffd890", 0, ry, Math.PI / 2); }
    const [rx0, rz0] = at(0, 0), roof = o.roof || "#e8dcc0"; Beam("wood", O, [rx0 - (w / 2 + 0.4) * c, y + H + 0.85, rz0 + (w / 2 + 0.4) * sn], [rx0 + (w / 2 + 0.4) * c, y + H + 0.85, rz0 - (w / 2 + 0.4) * sn], 0.07, "#5a4030", "cyl6");
    for (const sd of [-1, 1]) { const [px, pz] = at(0, sd * (d / 4 + 0.15)); P("fabric", O, "box", px, y + H + 0.42, pz, w + 0.8, 0.04, d / 2 + 0.75, kHex(roof, sd * 0.03), sd * -0.62 * Math.cos(0) * 1, ry, 0); }
    { const [px, pz] = at(0.75, d / 2 + 0.25); Beam("deco", O, [px, y + H + 0.2, pz], [px, y + H - 0.15, pz], 0.01, "#3a3a3a", "cyl6"); P("glow", O, "oct", px, y + H - 0.3, pz, 0.16, 0.24, 0.16, o.lamp || "#ffd27a"); P("metal", O, "cone", px, y + H - 0.12, pz, 0.2, 0.1, 0.2, "#4a3a2a"); } };
  // a rope bridge between two points: planks on two sagging ropes, hand ropes above with ties down to the planks
  const RopeBridge = (O, q, a, b, sag = 0.5, wood = "#8a6440") => { const dx = b[0] - a[0], dz = b[2] - a[2], len = Math.hypot(dx, dz), ry = Math.atan2(-dz, dx), nx = -dz / len, nz = dx / len, n = Math.max(4, Math.round(len / 0.36));
    for (let k = 0; k <= n; k++) { const t = k / n, y = a[1] + (b[1] - a[1]) * t - Math.sin(t * Math.PI) * sag; B("wood", O, a[0] + dx * t, y - 0.05, a[2] + dz * t, 0.26, 0.05, 1.1, kHex(wood, (q() - 0.5) * 0.14), 0, ry, (q() - 0.5) * 0.06);
      if (k % 3 === 0) for (const sd of [-0.58, 0.58]) Beam("deco", O, [a[0] + dx * t + nx * sd, y, a[2] + dz * t + nz * sd], [a[0] + dx * t + nx * sd, y + 0.95 - Math.sin(t * Math.PI) * (sag * 0.2), a[2] + dz * t + nz * sd], 0.018, "#c8b080", "cyl6"); }
    for (const sd of [-0.58, 0.58]) { for (const [h, sg] of [[0, sag], [0.95, sag * 0.8]]) Sag("deco", O, [a[0] + nx * sd, a[1] + h, a[2] + nz * sd], [b[0] + nx * sd, b[1] + h, b[2] + nz * sd], sg, 0.028, "#c8b080", 10); } };
  // the whole treehouse: a great tree, a deck round the trunk, a hut, a crow's nest higher up, a ladder, lanterns, a pulley basket
  const TreeHouse = (O, q, s, cols, o = {}) => { const T = Banyan(O, q, s, cols, { h: 6.4 });
    const dh = (o.deck || 3.6) * s, dw = 4.4 * s; Deck(O, q, 0, dh, 0, dw, dw, q() * 0.4, { gap: 2 }); for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) Beam("wood", O, [x * dw * 0.42, -0.05, z * dw * 0.42], [x * dw * 0.42, dh - 0.3, z * dw * 0.42], 0.11 * s, "#6a5038", "limb5");
    Hut(O, q, -0.4 * s, dh, -0.6 * s, 2.4 * s, 1.9 * s, 0, { roof: o.roof || "#e6d6b6" }); Ladder(O, 0.4 * s, dw / 2 + 0.45, dh, 0);
    const nh = dh + 3.2 * s; Deck(O, q, 0.9 * s, nh, 0.7 * s, 1.7 * s, 1.7 * s, 0.4, { rail: true }); Ladder(O, 0.9 * s, 0.7 * s - 1.05 * s, nh - dh, 0.4); // the crow's nest with a spyglass and a flag
    Beam("wood", O, [0.9 * s, nh, 0.7 * s], [0.9 * s, nh + 2.6 * s, 0.7 * s], 0.05, "#5a4030", "cyl6"); P("fabric", O, "box", 1.35 * s, nh + 2.25 * s, 0.7 * s, 0.9 * s, 0.55 * s, 0.03, o.flag || "#d83a2a");
    for (let k = 0; k < 4; k++) { const a = (k / 4) * TAU + 0.4, r = dw * 0.55; Beam("deco", O, [Math.cos(a) * r, dh + 2.4 * s, Math.sin(a) * r], [Math.cos(a) * r, dh + 1.7 * s, Math.sin(a) * r], 0.01, "#3a3a3a", "cyl6"); P("glow", O, "oct", Math.cos(a) * r, dh + 1.6 * s, Math.sin(a) * r, 0.18, 0.26, 0.18, o.lamp || "#ffd27a"); }
    // the pulley: a rope from a beam to a basket on the ground
    Beam("wood", O, [dw / 2, dh + 1.5, -0.6], [dw / 2 + 1.2, dh + 1.5, -0.6], 0.06, "#5a4030", "cyl6"); C("metal", O, dw / 2 + 1.2, dh + 1.32, -0.6, 0.14, 0.12, "#7a6040", "cyl"); Beam("deco", O, [dw / 2 + 1.2, dh + 1.3, -0.6], [dw / 2 + 1.2, 0.55, -0.6], 0.015, "#c8b080", "cyl6");
    C("wood", O, dw / 2 + 1.2, 0, -0.6, 0.38, 0.5, "#b0905a", "cyl6"); return { T, dh, dw }; };
  // a salvage hut on the ground: an upturned ship's boat as the roof over plank walls, with crates, a barrel and a washing line of sailcloth
  const BoatHut = (O, q, s = 1, o = {}) => { const hull = o.hull || "#6a4a32", W = 3.4 * s, D = 2.4 * s; Hut(O, q, 0, 0, 0, W, D, 0, { h: 1.7 * s, roof: o.roof || "#d8cbb0" });
    // the upturned boat: ribs and strakes over the roof
    for (let k = -4; k <= 4; k++) { const x = k * W / 9; Beam("wood", O, [x, 1.7 * s, -D / 2 - 0.35], [x, 2.6 * s - Math.abs(k) * 0.05, 0], 0.05, kHex(hull, -0.08), "cyl6"); Beam("wood", O, [x, 2.6 * s - Math.abs(k) * 0.05, 0], [x, 1.7 * s, D / 2 + 0.35], 0.05, kHex(hull, -0.08), "cyl6"); }
    for (let k = 0; k < 5; k++) for (const sd of [-1, 1]) { const zz = sd * (0.25 + k * 0.28) * D / 1.5, yy = 2.6 * s - k * 0.2; B("wood", O, 0, yy, zz, W + 0.9 - k * 0.15, 0.08, 0.3, k % 2 ? hull : kHex(hull, 0.06), sd * 0.5, 0, 0); }
    B("wood", O, 0, 2.62 * s, 0, W + 1.1, 0.14, 0.2, kHex(hull, -0.12)); // keel
    for (let k = 0; k < 3; k++) B("wood", O, W / 2 + 0.5, k * 0.5, D / 2 - 0.2 - k * 0.1, 0.55, 0.5, 0.55, kHex("#9a7a52", (q() - 0.5) * 0.12), 0, q() * 0.5, 0);
    C("wood", O, -W / 2 - 0.55, 0, D / 2 - 0.3, 0.3, 0.8, "#7a5a3a"); Ring("metal", O, -W / 2 - 0.55, 0.2, D / 2 - 0.3, 0.31, 0.03, "#4a4a4a"); Ring("metal", O, -W / 2 - 0.55, 0.62, D / 2 - 0.3, 0.31, 0.03, "#4a4a4a");
    const p1 = [-W / 2 - 0.4, 0, D / 2 + 1.6], p2 = [W / 2 + 1.4, 0, D / 2 + 1.2]; for (const p of [p1, p2]) C("wood", O, p[0], 0, p[2], 0.05, 1.9, "#5a4030", "cyl6"); Sag("deco", O, [p1[0], 1.8, p1[2]], [p2[0], 1.8, p2[2]], 0.25, 0.01, "#d8c8a0", 6);
    for (let k = 1; k < 4; k++) { const t = k / 4; P("fabric", O, "box", p1[0] + (p2[0] - p1[0]) * t, 1.42 - Math.sin(t * Math.PI) * 0.22, p1[2] + (p2[2] - p1[2]) * t, 0.6, 0.6, 0.02, ["#e8e0d0", "#d84a3a", "#3a7ab8"][k - 1], 0, Math.atan2(-(p2[2] - p1[2]), p2[0] - p1[0]), 0); } };
  // driftwood, a ship's wheel, a figurehead: castaway clutter along a beach
  const Driftwood = (O, q, x, z, s = 1) => { const a = q() * TAU, l = (1.2 + q() * 1.6) * s; Beam("wood", O, [x - Math.cos(a) * l / 2, 0.12, z - Math.sin(a) * l / 2], [x + Math.cos(a) * l / 2, 0.1, z + Math.sin(a) * l / 2], (0.08 + q() * 0.06) * s, "#b8a890", "limb5"); };
  const ShipWheel = (O, x, y, z, ry = 0, r = 0.5) => { P("wood", O, "ring", x, y, z, r * 2, 1.4, r * 2, "#7a4a2a", Math.PI / 2, ry, 0); for (let k = 0; k < 8; k++) { const a = (k / 8) * TAU; P("wood", O, "cyl6", x + Math.cos(a) * r * 0.65 * Math.cos(ry), y + Math.sin(a) * r * 0.65, z - Math.cos(a) * r * 0.65 * Math.sin(ry), 0.05, r * 1.6, 0.05, "#8a5a32", 0, ry, a + Math.PI / 2); } C("metal", O, x, y - 0.05, z, 0.08, 0.1, "#b08a40"); };

  return { ND, P, B, C, S, Beam, Ring, L, Sag, flush, count, kR, kRat, kHex, kVN, kH3, Clump, Fronds, Trunk, CanopyTree, Palm, TreeFern, Fern, GiantLeaf, Banyan, Tufts, Litter, Rock,
    GlowStalk, GlowCaps, GlowTubes, Spiral, Deck, Ladder, Hut, RopeBridge, TreeHouse, BoatHut, Driftwood, ShipWheel, mats: { mLeaf, mWood, mGrit, mCloth, mIron, mGlow } };
};
