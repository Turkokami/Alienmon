/* Tamsin in the Cactus Gardens (Nov 25).
   Her model loaded, but her spot was inside a clump of cacti, so the scene "An explorer sits on a flat rock eating
   an apple" showed only cactus. This moves her a step toward the trail, clears the cacti right around her, gives
   her a flat sandstone rock to sit on and an apple in her right hand. She sits until the Cactus Garden scene is
   over, then stands for the field test. Only reads window.STORY and window.GAME. */
(function () {
  var LATER = { field: 1, cactling: 1, map: 1, pack: 1, bonfire: 1, tunnel: 1, stowaway: 1, coral: 1, gate: 1, done: 1 };
  var OFF = [-3.0, -3.5], FACE = Math.PI / 4, CLEAR = 1.4; // open dirt just north-west of the paved clearing, facing it
  var cur = null, saved = null, rock = null, apple = null, hooked = false;

  function bones(G) { var b = {}; G.traverse(function (o) { if (o.isBone) b[o.name.replace(/^.*[:|]/, '')] = o; }); return b; }

  function aim(T, b, c, d) {
    if (!b || !c || !b.parent) return;
    var wp = function (o) { return o.getWorldPosition(new T.Vector3()); };
    var d0 = wp(c).sub(wp(b)).normalize();
    var q = new T.Quaternion().setFromUnitVectors(d0, d.clone().normalize());
    var bw = b.getWorldQuaternion(new T.Quaternion()), pw = b.parent.getWorldQuaternion(new T.Quaternion());
    b.quaternion.copy(pw.invert().multiply(q).multiply(bw));
    b.updateMatrixWorld(true);
  }

  function clearAround(T, sc, x, z) {
    var m = new T.Matrix4(), p = new T.Vector3(), s = new T.Vector3(), zero = new T.Matrix4().makeScale(0, 0, 0);
    sc.traverse(function (o) {
      if (!o.visible || o.isSkinnedMesh) return;
      if (o.isInstancedMesh) {
        if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
        var r = o.geometry.boundingSphere.radius, hit = false;
        for (var i = 0; i < o.count; i++) {
          o.getMatrixAt(i, m); p.setFromMatrixPosition(m).applyMatrix4(o.matrixWorld); s.setFromMatrixScale(m);
          var rr = r * s.x; if (rr < 0.15 || rr > 3) continue;
          if (Math.hypot(p.x - x, p.z - z) < CLEAR) { o.setMatrixAt(i, zero); hit = true; }
        }
        if (hit) o.instanceMatrix.needsUpdate = true;
      } else if (o.isMesh && o.geometry) {
        var anc = o; while (anc.parent && anc.parent !== sc) anc = anc.parent;
        if (cur && anc === cur.G) return;
        if (window.GAME.P && anc === window.GAME.P) return;
        if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
        var w = o.getWorldPosition(new T.Vector3()), rad = o.geometry.boundingSphere.radius * o.getWorldScale(new T.Vector3()).x;
        if (rad > 0.25 && rad < 2.5 && Math.hypot(w.x - x, w.z - z) < CLEAR - 0.3) o.visible = false;
      }
    });
  }

  function makeRock(T) {
    var g = new T.DodecahedronGeometry(0.5, 1), a = g.attributes.position, v = new T.Vector3();
    for (var i = 0; i < a.count; i++) {
      v.fromBufferAttribute(a, i);
      var n = 1 + 0.07 * Math.sin(v.x * 9.1 + v.z * 5.3) + 0.05 * Math.cos(v.y * 11.7 - v.x * 4.1);
      v.multiplyScalar(n); if (v.y > 0.18) v.y = 0.18 + (v.y - 0.18) * 0.25; // flat top to sit on
      a.setXYZ(i, v.x * 1.15, v.y * 0.62, v.z * 0.95);
    }
    g.computeVertexNormals();
    var c = new Float32Array(a.count * 3), base = new T.Color('#9a6743'), top = new T.Color('#ae7a50'), low = new T.Color('#6b432c'), col = new T.Color();
    for (var j = 0; j < a.count; j++) { var y = a.getY(j); col.copy(y > 0.09 ? top : y < -0.12 ? low : base).offsetHSL(0, 0, (Math.sin(j * 12.9898) * 0.5) * 0.06); c[j * 3] = col.r; c[j * 3 + 1] = col.g; c[j * 3 + 2] = col.b; }
    g.setAttribute('color', new T.BufferAttribute(c, 3));
    var mesh = new T.Mesh(g, new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: true }));
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.name = 'tamsinRock';
    return mesh;
  }

  function makeApple(T) {
    var grp = new T.Group();
    var body = new T.Mesh(new T.SphereGeometry(0.045, 14, 10), new T.MeshStandardMaterial({ color: '#c62f26', roughness: 0.45 }));
    body.scale.set(1, 0.9, 1);
    var bite = new T.Mesh(new T.SphereGeometry(0.02, 10, 8), new T.MeshStandardMaterial({ color: '#f3e3b8', roughness: 0.8 }));
    bite.position.set(0.03, 0.005, 0.015);
    var stem = new T.Mesh(new T.CylinderGeometry(0.004, 0.005, 0.03, 6), new T.MeshStandardMaterial({ color: '#5a3b1f' }));
    stem.position.y = 0.05;
    var leaf = new T.Mesh(new T.SphereGeometry(0.016, 8, 6), new T.MeshStandardMaterial({ color: '#4f8f3a', roughness: 0.7 }));
    leaf.scale.set(1.4, 0.3, 0.7); leaf.position.set(0.016, 0.058, 0);
    grp.add(body, bite, stem, leaf); grp.name = 'tamsinApple';
    return grp;
  }

  function spawn(a) {
    var GM = window.GAME, T = GM.T, G = a.G; if (!G) return;
    cur = a; saved = null;
    rock = makeRock(T); apple = makeApple(T);
    G.add(rock); G.add(apple);
    var x = G.position.x, z = G.position.z;
    [0, 1500, 5000, 12000].forEach(function (ms) { setTimeout(function () { try { if (cur === a && a.G) clearAround(T, GM.sc, x, z); } catch (e) {} }, ms); });
  }

  function sitting() { var S = window.STORY; return !(S && S.ST && LATER[S.ST.step]); }

  var shot = null;
  function frame(a, GM, sit) {
    // her talk camera: in the open clearing in front of her, a little to one side, never inside the cacti
    var S = window.STORY, cs = S && S.CS; if (!cs || !cs.on || cs.cam !== 'tamsin') return;
    var T = GM.T, G = a.G, ry = sit ? FACE : G.rotation.y, gy = GM.groundY(G.position.x, G.position.z);
    var fx = Math.sin(ry), fz = Math.cos(ry), rx = Math.cos(ry), rz = -Math.sin(ry);
    if (!shot) shot = { cp: new T.Vector3(), look: new T.Vector3() };
    var cx = G.position.x + fx * 2.9 + rx * 0.9, cz = G.position.z + fz * 2.9 + rz * 0.9;
    shot.cp.set(cx, Math.max(GM.groundY(cx, cz), gy) + (sit ? 1.25 : 1.55), cz);
    shot.look.set(G.position.x + fx * 0.3, gy + (sit ? 0.95 : 1.35), G.position.z + fz * 0.3);
    window.__fixCam = shot;
  }

  function pose() {
    var a = cur, GM = window.GAME; if (!a || !a.G || !a.G.parent || !GM) return;
    frame(a, GM, sitting());
    var T = GM.T, G = a.G, b = bones(G);
    var ground = GM.groundY(G.position.x, G.position.z);
    if (!sitting()) {
      if (saved) { for (var k in saved.q) if (b[k]) b[k].quaternion.copy(saved.q[k]); G.position.y = saved.y; saved = null; }
      if (rock) rock.visible = false; if (apple) apple.visible = false;
      return;
    }
    if (!saved) { saved = { y: G.position.y, q: {} }; ['L_Thigh', 'R_Thigh', 'L_Calf', 'R_Calf', 'L_Upperarm', 'R_Upperarm', 'L_Forearm', 'R_Forearm'].forEach(function (k) { if (b[k]) saved.q[k] = b[k].quaternion.clone(); }); }
    G.updateMatrixWorld(true);
    // turn her so her body (not just her group) faces FACE: some rigs are built turned inside their group
    if (b.L_Thigh && b.R_Thigh) {
      var lv = b.L_Thigh.getWorldPosition(new T.Vector3()).sub(b.R_Thigh.getWorldPosition(new T.Vector3())), f = new T.Vector3(-lv.z, 0, lv.x);
      if (f.lengthSq() > 1e-6) { var da = FACE - Math.atan2(f.x, f.z); da = Math.atan2(Math.sin(da), Math.cos(da)); if (Math.abs(da) > 0.02) { G.rotation.y += da; G.updateMatrixWorld(true); } }
    }
    var ry = FACE, fw = new T.Vector3(Math.sin(ry), 0, Math.cos(ry)), rt = new T.Vector3(Math.cos(ry), 0, -Math.sin(ry));
    var down = new T.Vector3(0, -1, 0);
    aim(T, b.L_Thigh, b.L_Calf, fw.clone().add(new T.Vector3(0, -0.12, 0)).addScaledVector(rt, 0.08));
    aim(T, b.R_Thigh, b.R_Calf, fw.clone().add(new T.Vector3(0, -0.12, 0)).addScaledVector(rt, -0.08));
    aim(T, b.L_Calf, b.L_Foot, down.clone().addScaledVector(fw, 0.18));
    aim(T, b.R_Calf, b.R_Foot, down.clone().addScaledVector(fw, 0.05));
    // README 86: both hands rest in her lap, the apple in her right hand. Lifting the hand to her chin pulled the face and chest
    // of the skinned model out of shape, so the arms now only swing a little forward from where the rig holds them.
    aim(T, b.L_Upperarm, b.L_Forearm, down.clone().addScaledVector(fw, 0.32).addScaledVector(rt, 0.1));
    aim(T, b.L_Forearm, b.L_Hand, fw.clone().add(new T.Vector3(0, -0.45, 0)).addScaledVector(rt, -0.15));
    aim(T, b.R_Upperarm, b.R_Forearm, down.clone().addScaledVector(fw, 0.32).addScaledVector(rt, -0.1));
    aim(T, b.R_Forearm, b.R_Hand, fw.clone().add(new T.Vector3(0, -0.4, 0)).addScaledVector(rt, 0.15));
    var hip = b.L_Thigh || b.Hip;
    if (hip) { G.updateMatrixWorld(true); var hy = hip.getWorldPosition(new T.Vector3()).y; G.position.y += (ground + 0.46) - hy; G.updateMatrixWorld(true); }
    if (rock && hip) {
      rock.visible = true;
      var rp = hip.getWorldPosition(new T.Vector3()).addScaledVector(fw, -0.14); rp.y = ground + 0.29;
      rock.position.copy(G.worldToLocal(rp)); rock.rotation.set(0, 0.4, 0);
    }
    if (apple && b.R_Hand) {
      apple.visible = true;
      var hp = b.R_Hand.getWorldPosition(new T.Vector3()).addScaledVector(fw, 0.06).add(new T.Vector3(0, 0.03, 0));
      apple.position.copy(G.worldToLocal(hp));
    }
  }

  function hook() {
    var GM = window.GAME; if (!GM || !GM.sc) return;
    var sc = GM.sc, prev = sc.onBeforeRender;
    sc.onBeforeRender = function () { try { pose(); } catch (e) {} if (prev) return prev.apply(this, arguments); };
    hooked = true;
  }

  function setup() {
    var S = window.STORY, GM = window.GAME;
    if (!S || !S.ACT || !S.ACT.tamsin || !GM || !GM.T || !GM.sc) return false;
    var t = S.ACT.tamsin; if (t.__seat) return true; t.__seat = 1;
    var base = t.pos; t.pos = function () { var p = base().clone(); p.x += OFF[0]; p.z += OFF[1]; return p; };
    t.ry = FACE;
    var prev = t.onSpawn; t.onSpawn = function (a) { if (prev) prev(a); try { spawn(a); } catch (e) { console.warn('tamsin seat', e); } };
    if (t.G) { try { var p = t.pos(); t.G.position.x = p.x; t.G.position.z = p.z; t.G.position.y = GM.groundY(p.x, p.z); t.G.rotation.y = FACE; t.x = p.x; t.z = p.z; t.base = t.G.position.clone(); spawn(t); } catch (e) {} }
    if (!hooked) hook();
    return true;
  }
  setInterval(function () { try { setup(); } catch (e) {} }, 1000); // the story object changes when the world changes, so keep checking
})();
