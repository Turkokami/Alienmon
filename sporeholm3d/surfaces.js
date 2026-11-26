// ================= OUTDOOR SURFACES (Nov 26 2026): the room kit's surface quality, outdoors =================
// Gives the open maps real surface detail to match the upgraded interiors, without adding a single mesh or draw call:
//  - walls, rocks, stone and roofs get the ex_* textures (colour + normal map, own procedural work, see
//    rigtools/make_ex_textures.py), mapped in world space (triplanar), so a plaster crack or a rock stratum has the same
//    true size on a small hut, a long town wall or a 30 m cliff, and no surface shows a stretched texture
//  - the painted ground keeps its colours and gains a fine detail layer (sand grain, pebbles, ripples, small cracks) with a
//    normal map, so it catches the sun like real ground instead of looking like a flat picture
//  - "detail" mode keeps a surface's own painted colours (the canyon walls' red-to-violet bands) and only adds the
//    texture's light and shade and its bumps
// A world calls ASSETS.surf.apply(THREE, root, rules) once at the end of its build; each rule says which materials it
// upgrades (by the texture they use or the material itself) and how. Materials are changed in place, so merged and
// instanced meshes keep working. Nothing here copies any other game.
ASSETS.surf = (function () {
  const TXV = "ex4", TX = {};
  let THREE = null;
  // phones get the surface textures at half size (a quarter of the memory); up close the normal map still carries the relief
  const PHONE = typeof matchMedia === "function" && (matchMedia("(pointer: coarse)").matches || Math.min(screen.width, screen.height) < 600);
  const tex = (name, srgb, fill) => TX[name] || (TX[name] = (() => {
    const c = document.createElement("canvas"); c.width = c.height = 4; const C = c.getContext("2d"); C.fillStyle = fill; C.fillRect(0, 0, 4, 4);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    const hk = typeof globalThis !== "undefined" && globalThis.NNTEXLOAD; if (hk) { const im = hk(name); if (im) { t.image = im; t.needsUpdate = true; return t; } }
    try { if (typeof Image === "function" && typeof location !== "undefined" && /^https?:/.test(location.protocol)) { const im = new Image(); im.decoding = "async"; im.onload = () => { if (!im.naturalWidth) return; let src = im; if (PHONE && im.naturalWidth > 512) { const c2 = document.createElement("canvas"); c2.width = c2.height = 512; c2.getContext("2d").drawImage(im, 0, 0, 512, 512); src = c2; } t.image = src; t.dispose(); t.needsUpdate = true; }; im.src = "tex/" + name + ".webp?v=" + TXV; } } catch (e) {}
    return t; })());

  // ---- the triplanar shader patch ----
  // TRI_REPLACE: colour comes from the texture (times the material colour); TRI_DETAIL: colour stays the material's own map,
  // times the texture's brightness around its average (triDetail sets how strongly). Both get the texture's normal map.
  const VERT_DECL = "varying vec3 vTriP;\nvarying vec3 vTriN;\n";
  const VERT_BODY = `
  { vec4 trP = vec4(transformed, 1.0); vec3 trN = objectNormal;
    #ifdef USE_INSTANCING
      trP = instanceMatrix * trP; trN = mat3(instanceMatrix) * trN;
    #endif
    trP = modelMatrix * trP; vTriP = trP.xyz; vTriN = normalize(mat3(modelMatrix) * trN); }`;
  const FRAG_DECL = `varying vec3 vTriP;
varying vec3 vTriN;
uniform float triScale;
uniform float triDetail;
uniform float triNS;
uniform sampler2D triMap;
uniform sampler2D triNorm;
vec3 triW(vec3 n) { vec3 b = pow(abs(n), vec3(4.0)); return b / (b.x + b.y + b.z); }
`;
  // colour: sample only the faces that matter (a flat floor reads one picture, a wall two)
  const FRAG_UV = `
  vec3 trWN = normalize(vTriN); vec3 trB = triW(trWN); vec3 trS = step(0.0, trWN) * 2.0 - 1.0;
  vec2 trUX = vec2(vTriP.z * trS.x, vTriP.y) * triScale, trUY = vec2(vTriP.x * trS.y, vTriP.z) * triScale, trUZ = vec2(-vTriP.x * trS.z, vTriP.y) * triScale;
  vec4 trC = vec4(0.0);
  if (trB.x > 0.01) trC += texture2D(triMap, trUX) * trB.x;
  if (trB.y > 0.01) trC += texture2D(triMap, trUY) * trB.y;
  if (trB.z > 0.01) trC += texture2D(triMap, trUZ) * trB.z;
`;
  // replace: the texture is the colour (times the material colour, and the merged statics' per-vertex colour after it)
  const FRAG_REPLACE = FRAG_UV + "  diffuseColor *= trC;\n";
  // detail: whatever colour the surface already worked out (its painted map, or a world's own swatch) times the texture's light and shade
  const FRAG_DETAIL = FRAG_UV + `  float trL = dot(trC.rgb, vec3(0.299, 0.587, 0.114));
  diffuseColor.rgb *= clamp(1.0 + (trL - triDetailMid) * triDetail, 0.35, 1.6);
`;
  // the Dustara and Ferrox swatch shaders (DXTRI / FXTRI in world.js) put their own triplanar block where <map_fragment> was
  const SWATCH_BLOCK = /\{ vec3 bw = pow\(abs\(fxN\)[\s\S]*?diffuseColor \*= tx; \}/;
  // normal: whiteout-blended triplanar normal map, built in world space, then turned into view space
  const FRAG_NORMAL = `
  {
    vec3 tX = texture2D(triNorm, trUX).xyz * 2.0 - 1.0, tY = texture2D(triNorm, trUY).xyz * 2.0 - 1.0, tZ = texture2D(triNorm, trUZ).xyz * 2.0 - 1.0;
    tX.xy *= triNS; tY.xy *= triNS; tZ.xy *= triNS;
    tX.x *= trS.x; tY.x *= trS.y; tZ.x *= -trS.z;
    tX = vec3(tX.xy + trWN.zy, abs(tX.z) * trWN.x);
    tY = vec3(tY.xy + trWN.xz, abs(tY.z) * trWN.y);
    tZ = vec3(tZ.xy + trWN.xy, abs(tZ.z) * trWN.z);
    vec3 trN2 = normalize(tX.zyx * trB.x + tY.xzy * trB.y + tZ.xyz * trB.z);
    normal = normalize((viewMatrix * vec4(trN2, 0.0)).xyz) * faceDirection;
  }
`;

  const upgrade = (mat, o) => {
    if (!mat || mat.userData.surf || !mat.isMeshStandardMaterial) return mat;
    mat.userData.surf = o.d + (o.detail ? ":d" : "");
    const dT = tex(o.d + "_d", true, o.fill || "#d8c0a0"), nT = tex(o.d + "_n", false, "#8080ff");
    mat.defines = Object.assign({}, mat.defines, o.detail ? { TRI_DETAIL: "" } : {});
    // the material keeps its old painted map (other code still reads it, e.g. to bake far-away stand-ins); the shader just stops using it
    if (o.color) mat.color.set(o.color);
    if (o.rough != null) mat.roughness = o.rough;
    if (o.emi != null) mat.emissiveIntensity *= o.emi;
    const sc = 1 / (o.size || 2), dt = o.detail ? (o.amt != null ? o.amt : 1.0) : 0, ns = o.ns != null ? o.ns : 1.0, mid = o.mid != null ? o.mid : 0.5;
    // keep whatever shader patch the material already has (the game's merged statics add their own per-vertex glow): run it first
    const prevOBC = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey;
    mat.onBeforeCompile = (sh, rr) => {
      if (prevOBC) prevOBC.call(mat, sh, rr);
      if (sh.fragmentShader.indexOf("uniform float triScale") >= 0) return; // a merged copy that already runs this patch through its original
      sh.uniforms.triScale = { value: sc }; sh.uniforms.triDetail = { value: dt }; sh.uniforms.triNS = { value: ns };
      sh.uniforms.triMap = { value: dT }; sh.uniforms.triNorm = { value: nT };
      sh.vertexShader = VERT_DECL + sh.vertexShader.replace("#include <project_vertex>", "#include <project_vertex>" + VERT_BODY);
      let f = sh.fragmentShader;
      if (o.detail) f = f.replace("#include <color_fragment>", FRAG_DETAIL + "#include <color_fragment>");
      else if (f.indexOf("#include <map_fragment>") >= 0) f = f.replace("#include <map_fragment>", FRAG_REPLACE);
      else if (SWATCH_BLOCK.test(f)) f = f.replace(SWATCH_BLOCK, FRAG_REPLACE);
      else f = f.replace("#include <color_fragment>", FRAG_REPLACE + "#include <color_fragment>");
      sh.fragmentShader = FRAG_DECL + "#define triDetailMid " + mid.toFixed(3) + "\n" + f.replace("#include <normal_fragment_maps>", FRAG_NORMAL);
    };
    mat.customProgramCacheKey = () => "surf" + (o.detail ? "D" : "R") + mid.toFixed(3) + "|" + (prevKey ? prevKey.call(mat) : "");
    mat.needsUpdate = true;
    return mat;
  };

  // rules: [{ match: (material) => bool, d: "ex_adobe", size: metres per repeat, detail, amt, ns, color, rough, emi }]
  const apply = (T, root, rules) => {
    THREE = T; let n = 0; const seen = new Set();
    root.traverse((m) => {
      if (!m.isMesh || m.userData.noSurf) return;
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      for (const mat of mats) {
        if (!mat || seen.has(mat)) continue; seen.add(mat);
        for (const r of rules) if (r.match(mat, m)) { upgrade(mat, r); n++; break; }
      }
    });
    return n;
  };
  // ---- what each tagged surface becomes. A world tags a painted texture (texture.userData.surfKey, which clones keep) or a
  // ground mesh (mesh.userData.surfKey); the watcher below finds every tagged surface in the scene, whenever and however it
  // was built (areas stream in, interiors and walk-ins build on their own), and upgrades its material once.
  const RULES = {
    // Dustara: cream lime plaster over adobe brick, sandstone blocks, layered red rock, clay barrel tiles, sandy ground grit
    d_adobe: { d: "ex_adobe", size: 2.6, ns: 0.9, rough: 0.9 },
    d_block: { d: "ex_block", size: 1.4, ns: 1.1, rough: 0.88 },
    d_stalk: { d: "ex_block", size: 2.2, ns: 1.0 },
    d_rock: { d: "ex_rock", size: 5, ns: 1.1 },
    d_roof: { d: "ex_roof", size: 1.8, ns: 1.2 },
    d_canyon: { d: "ex_rock", size: 8, detail: true, amt: 0.8, ns: 1.1, mid: 0.42 },
    d_ground: { d: "ex_grit", size: 3, detail: true, amt: 0.8, ns: 0.7, emi: 0.62 },
    d_far: { d: "ex_rock", size: 12, detail: true, amt: 0.7, ns: 1.0, mid: 0.42 }, // the far mesa faces (plain banded colours)
    // Dustara's own swatches (cropped from Kristofer's Dustara sheets, 256 px): the same look, drawn again at full detail
    dx_stone: { d: "ex_dxstone", size: 2.0, ns: 1.8, rough: 0.9 },
    dx_wood: { d: "ex_dxwood", size: 1.6, ns: 1.0 },
    dx_rock: { d: "ex_rock", size: 6, detail: true, amt: 0.55, ns: 1.2, mid: 0.42 },
    dx_sand: { d: "ex_grit", size: 3, detail: true, amt: 0.9, ns: 0.8 },
  };
  const keyOf = (mat, mesh) => (mesh.userData && mesh.userData.surfKey) || mat.userData.surfKey || (mat.map && mat.map.userData && mat.map.userData.surfKey) || null;
  const scan = (root) => {
    let n = 0;
    root.traverse((m) => {
      if (!m.isMesh || m.userData.noSurf) return;
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      for (const mat of mats) { if (!mat || !mat.isMeshStandardMaterial || mat.userData.surf) continue; const k = keyOf(mat, m), r = k && RULES[k]; if (r) { upgrade(mat, r); n++; } }
    });
    return n;
  };
  const watch = () => {
    const tick = () => { try { const G = window.GAME; if (G && G.sc && THREE) scan(G.sc); } catch (e) {} };
    setInterval(tick, 1500);
  };
  if (typeof window !== "undefined") watch();
  return { apply, upgrade, scan, RULES, init: (T) => { THREE = T; }, tex: (T, name, srgb, fill) => { THREE = T; return tex(name, srgb, fill); } };
})();
