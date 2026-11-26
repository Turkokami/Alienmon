// seat.js: keeps scattered plants, pebbles and small props on the ground in every world (Nov 26).
// Called by each world builder just before it returns: SEAT.run(root, GHT, THREE).
// Surface = the terrain height (GHT) or, where a rock skin covers a steep face, the skin, whichever is higher.
// Instanced scatter: every instance that shares an origin (a blade and its seed tip, a stem and its bloom) moves by one amount,
// set by whichever of them sits lowest, so pairs stay together. Small props are only lowered when they hover over sloped ground,
// so things deliberately set on a table, shelf or wall are left alone.
(function () {
  const S = (window.SEAT = { last: null, calls: [] });
  const CELL = 0.3;
  const skinRaster = (root, THREE) => {
    const map = new Map(), v = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    root.updateMatrixWorld(true);
    root.traverse((o) => {
      if (!o.isMesh || o.isInstancedMesh || !(o.userData.skin || o.name === "obsrock")) return;
      const g = o.geometry, P = g.attributes.position, I = g.index; if (!P) return;
      const n = I ? I.count : P.count;
      for (let t = 0; t < n; t += 3) {
        for (let k = 0; k < 3; k++) v[k].fromBufferAttribute(P, I ? I.getX(t + k) : t + k).applyMatrix4(o.matrixWorld);
        const x0 = Math.min(v[0].x, v[1].x, v[2].x), x1 = Math.max(v[0].x, v[1].x, v[2].x), z0 = Math.min(v[0].z, v[1].z, v[2].z), z1 = Math.max(v[0].z, v[1].z, v[2].z);
        const d = (v[1].z - v[2].z) * (v[0].x - v[2].x) + (v[2].x - v[1].x) * (v[0].z - v[2].z); if (Math.abs(d) < 1e-9) continue;
        for (let i = Math.floor(x0 / CELL); i <= Math.floor(x1 / CELL); i++) for (let j = Math.floor(z0 / CELL); j <= Math.floor(z1 / CELL); j++) {
          const px = (i + 0.5) * CELL, pz = (j + 0.5) * CELL;
          const a = ((v[1].z - v[2].z) * (px - v[2].x) + (v[2].x - v[1].x) * (pz - v[2].z)) / d, b = ((v[2].z - v[0].z) * (px - v[2].x) + (v[0].x - v[2].x) * (pz - v[2].z)) / d, c = 1 - a - b;
          if (a < -0.02 || b < -0.02 || c < -0.02) continue;
          const y = a * v[0].y + b * v[1].y + c * v[2].y, key = i * 100003 + j, old = map.get(key); if (old === undefined || y > old) map.set(key, y);
        }
      }
    });
    return map;
  };
  const three = (T) => T || (window.ASSETS && ASSETS.surf && ASSETS.surf.three && ASSETS.surf.three());
  S.run = (root, GHT, THREE, opt = {}) => {
    THREE = three(THREE); if (!THREE || !root || !GHT) return null; S.T = THREE; // kept for the test probes
    // the rock skins only exist as named meshes while a world is being built, so the builder keeps their raster on its root for the second pass
    const t0 = performance.now(), sk0 = skinRaster(root, THREE), sk = sk0.size ? sk0 : opt.skin || sk0; if (sk0.size) root.userData.seatSkin = sk0;
    const surf = (x, z) => { const g = GHT(x, z); const s = sk.size ? sk.get(Math.floor(x / CELL) * 100003 + Math.floor(z / CELL)) : undefined; return s !== undefined && s > g ? s : g; };
    const ring = (x, z, r) => { let mn = 1e9, mx = -1e9; for (const [dx, dz] of [[0, 0], [r, 0], [-r, 0], [0, r], [0, -r]]) { const y = surf(x + dx, z + dz); if (y < mn) mn = y; if (y > mx) mx = y; } return [mn, mx]; };
    const m4 = new THREE.Matrix4(), mw = new THREE.Matrix4(), p = new THREE.Vector3(), c = new THREE.Vector3(), out = { inst: 0, props: 0, ms: 0 };
    const bottom = (geo, m) => { if (!geo.boundingBox) geo.computeBoundingBox(); const b = geo.boundingBox; let mn = 1e9; for (const x of [b.min.x, b.max.x]) for (const y of [b.min.y, b.max.y]) for (const z of [b.min.z, b.max.z]) { c.set(x, y, z).applyMatrix4(m); if (c.y < mn) mn = c.y; } return mn; };
    root.updateMatrixWorld(true);
    // 1) instanced scatter
    const meshes = []; root.traverse((o) => { if (o.isInstancedMesh && !o.userData.int && !o.userData.noSeat) meshes.push(o); });
    const gap = new Map(), key = (x, z) => Math.round(x * 500) + "," + Math.round(z * 500);
    for (const o of meshes) for (let i = 0; i < o.count; i++) {
      o.getMatrixAt(i, m4); if (Math.abs(m4.elements[0]) + Math.abs(m4.elements[5]) + Math.abs(m4.elements[10]) < 1e-5) continue;
      mw.multiplyMatrices(o.matrixWorld, m4); p.setFromMatrixPosition(mw);
      const bot = bottom(o.geometry, mw), bx = o.geometry.boundingBox, sx = Math.hypot(mw.elements[0], mw.elements[2]), sy = Math.hypot(mw.elements[4], mw.elements[5], mw.elements[6]), r = Math.min(0.5, Math.max(0.08, (bx.max.x - bx.min.x) * sx * 0.4));
      // tiny things (seed tips, motes, fireflies) and flat ground decals never set the amount; they only follow the plant they belong to
      const tiny = Math.max((bx.max.x - bx.min.x) * sx, (bx.max.y - bx.min.y) * sy) < 0.12; if ((bx.max.y - bx.min.y) * sy < 0.04) continue;
      const [mn] = ring(p.x, p.z, r), g = bot - mn; if (tiny && g > 0.6) continue; const k = key(p.x, p.z), was = gap.get(k); if (was === undefined || g < was) gap.set(k, g);
    }
    for (const o of meshes) { let n = 0; const inv = new THREE.Matrix4().copy(o.matrixWorld).invert(), wy = new THREE.Vector3();
      for (let i = 0; i < o.count; i++) { o.getMatrixAt(i, m4); mw.multiplyMatrices(o.matrixWorld, m4); p.setFromMatrixPosition(mw); const g = gap.get(key(p.x, p.z)); if (g === undefined || g < 0.07 || g > 1.8) continue;
        // move in world space by -(g + 0.03), then back into the mesh's own space
        wy.set(0, -(g + 0.03), 0); const t = new THREE.Matrix4().makeTranslation(wy.x, wy.y, wy.z); mw.premultiply(t); m4.multiplyMatrices(inv, mw); o.setMatrixAt(i, m4); n++; }
      if (n) { o.instanceMatrix.needsUpdate = true; if (o.computeBoundingSphere) o.computeBoundingSphere(); out.inst += n; } }
    // 2) small props that hover over sloped ground
    const bb = new THREE.Box3(), sz = new THREE.Vector3();
    for (const o of root.children) {
      if (o.isLight || o.isInstancedMesh || o.name === "ground" || o.name === "grass" || o.name === "water" || o.userData.noLift || o.userData.noSeat || o.userData.skin || o.name === "obsrock") continue;
      bb.setFromObject(o); if (bb.isEmpty()) continue; bb.getSize(sz); if (Math.max(sz.x, sz.z) > 4 || sz.y > 6) continue; bb.getCenter(c);
      const hx = Math.min(sz.x / 2, 1.2) * 0.8, hz = Math.min(sz.z / 2, 1.2) * 0.8; let mn = 1e9, mx = -1e9;
      for (const [dx, dz] of [[0, 0], [hx, hz], [-hx, hz], [hx, -hz], [-hx, -hz]]) { const y = surf(c.x + dx, c.z + dz); if (y < mn) mn = y; if (y > mx) mx = y; }
      const g = bb.min.y - mn; if (mx - mn < 0.1 || g < 0.06 || g > 0.6) continue;
      o.position.y -= g + 0.03; o.updateMatrixWorld(true); out.props++;
    }
    out.ms = Math.round(performance.now() - t0); out.skinCells = sk.size; S.last = out; S.calls.push([root.uuid, out.inst, out.props]); root.userData.seated = out; return out;
  };
  // a scene group's scatter is filled in over the next frames, so the game asks for the pass a moment later, and once more after that
  S.later = (group, GHT, skin) => { for (const ms of [1500, 6000]) setTimeout(() => { try { if (group.parent) S.run(group, GHT, null, { skin }); } catch (e) {} }, ms); };
  // the automatic check: counts what still floats (instances and small props), for the test page and the console
  S.check = (root, GHT, THREE, lim = 0.08, skin) => {
    THREE = three(THREE); const sk0 = skinRaster(root, THREE), sk = sk0.size ? sk0 : skin || (root.userData.seatSkin) || sk0, surf = (x, z) => { const g = GHT(x, z); const s = sk.get(Math.floor(x / CELL) * 100003 + Math.floor(z / CELL)); return s !== undefined && s > g ? s : g; };
    const m4 = new THREE.Matrix4(), mw = new THREE.Matrix4(), p = new THREE.Vector3(), c = new THREE.Vector3(), res = { inst: 0, instFloat: 0, props: 0, propFloat: 0, worst: [] };
    root.updateMatrixWorld(true);
    // a plant's parts (stem, leaves, bloom) share one origin across several meshes: the plant floats only if its lowest part does
    const pairs = new Map();
    root.traverse((o) => { if (!o.isInstancedMesh || o.userData.int || o.userData.noSeat) return; const b = (o.geometry.boundingBox || (o.geometry.computeBoundingBox(), o.geometry.boundingBox));
      for (let i = 0; i < o.count; i++) { o.getMatrixAt(i, m4); if (Math.abs(m4.elements[0]) + Math.abs(m4.elements[5]) + Math.abs(m4.elements[10]) < 1e-5) continue; mw.multiplyMatrices(o.matrixWorld, m4); p.setFromMatrixPosition(mw); let mn = 1e9; for (const x of [b.min.x, b.max.x]) for (const y of [b.min.y, b.max.y]) for (const z of [b.min.z, b.max.z]) { c.set(x, y, z).applyMatrix4(mw); if (c.y < mn) mn = c.y; } const bs = Math.max((b.max.x - b.min.x) * Math.hypot(mw.elements[0], mw.elements[2]), (b.max.y - b.min.y) * Math.hypot(mw.elements[4], mw.elements[5], mw.elements[6])); if (bs < 0.12 || (b.max.y - b.min.y) * Math.hypot(mw.elements[4], mw.elements[5], mw.elements[6]) < 0.04) continue; res.inst++; const g = mn - Math.max(surf(p.x, p.z), surf(p.x + 0.12, p.z), surf(p.x - 0.12, p.z), surf(p.x, p.z + 0.12), surf(p.x, p.z - 0.12)); pairs.set(Math.round(p.x * 500) + "," + Math.round(p.z * 500), Math.min(g, pairs.get(Math.round(p.x * 500) + "," + Math.round(p.z * 500)) ?? 1e9)); }
      });
    for (const [k, g] of pairs) if (g > lim && g < 3) { res.instFloat++; if (res.worst.length < 12) res.worst.push(["inst", k.split(",").map((n) => (n / 500).toFixed(1)).join(","), +g.toFixed(2)]); }
    const bb = new THREE.Box3(), sz = new THREE.Vector3();
    for (const o of root.children) { if (o.isLight || o.isInstancedMesh || o.name === "ground" || o.name === "grass" || o.name === "water" || o.userData.noLift || o.userData.noSeat || o.userData.skin || o.name === "obsrock") continue; bb.setFromObject(o); if (bb.isEmpty()) continue; bb.getSize(sz); if (Math.max(sz.x, sz.z) > 4 || sz.y > 6) continue; bb.getCenter(c); res.props++;
      let mn = 1e9, mx = -1e9; for (const [dx, dz] of [[0, 0], [0.3, 0.3], [-0.3, 0.3], [0.3, -0.3], [-0.3, -0.3]]) { const y = surf(c.x + dx, c.z + dz); mn = Math.min(mn, y); mx = Math.max(mx, y); }
      const g = bb.min.y - mn; if (mx - mn >= 0.1 && g > lim && g < 0.6) { res.propFloat++; if (res.worst.length < 12) res.worst.push(["prop", (o.name || "?") + "@" + c.x.toFixed(1) + "," + c.z.toFixed(1), +g.toFixed(2)]); } }
    return res;
  };
})();
// Nov 26: the player's boot soles sit about 4 cm under the player's origin, so they cut into flat floors. Lift each model under the player once.
setInterval(() => { const P = window.GAME && window.GAME.P; if (!P) return; for (const c of P.children) if (!c.userData.__lift && !c.isLight && !c.isCamera) { c.position.y += 0.04; c.userData.__lift = 1; } }, 1000);
