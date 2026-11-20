/* Alienmon 3D story missions for Thalassa (book ch. 15-18), Neonis (ch. 20-22) and Glyphos (ch. 23-25).
   game.js calls window.STORY3(s, e, K, world) in place of its empty story stub for these three worlds.
   s = the world (scene, player, camera, map helpers), e = the RPG (party, battles, banners, save),
   K = three.js classes from the game bundle, world = "thalassa" | "neonis" | "glyphos".
   Every spoken line goes through the game's voice map (window.__VXH -> audio/voice/vx_*.mp3 when listed in extra.json). */
(function () {
  "use strict";
  const WORLDS = {};
  window.STORY3_WORLDS = WORLDS;

  window.STORY3 = function (s, e, K, world) {
    const V = K.V, sc = s.sc, P = s.P, cam = s.cam, S = e.S;
    S.st3 = S.st3 || {};
    const ST = (S.st3[world] = S.st3[world] || { step: "", flags: {}, beat: {} });
    ST.flags = ST.flags || {}; ST.beat = ST.beat || {};
    const FREE = /[?&#]free/.test(location.search + location.hash);
    const save = () => { try { e.save(); } catch (x) {} };

    /* ---------------- HUD and cutscene DOM (same look as the other worlds) ---------------- */
    const css = document.createElement("style");
    css.textContent = `
#objHud{position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:5;font:13px system-ui;color:#eafff4;background:rgba(10,20,30,.7);border:1px solid #c8f06a77;border-radius:12px;padding:6px 14px;display:none;align-items:center;gap:10px;max-width:72vw}
#objHud b{color:#c8f06a}#objArrow{width:22px;height:22px;display:inline-block;transition:transform .15s}#objDist{opacity:.7;font-size:12px}
.lbox{position:fixed;left:0;right:0;height:9vh;background:#000;z-index:18;transition:transform .5s;pointer-events:none}
#csBox{position:fixed;left:50%;bottom:12vh;transform:translateX(-50%);width:min(860px,92vw);z-index:19;display:none;background:rgba(10,18,28,.93);border:2px solid #c8f06a;border-radius:14px;padding:12px 18px;font:17px system-ui;color:#f2fff6;cursor:pointer}
#csBox .who{font-weight:800;color:#c8f06a;margin-bottom:4px;font-size:15px;letter-spacing:.5px}#csBox .nx{float:right;opacity:.6;font-size:12px}
#csBox.hasPt{padding-left:calc(min(150px,17vw) + 20px);min-height:min(110px,13vw)}#csPt{position:fixed;bottom:calc(12vh + 2px);width:min(150px,17vw);aspect-ratio:1;z-index:20;display:none;pointer-events:none;background:center bottom/contain no-repeat;filter:drop-shadow(0 4px 10px #000a)}
#mistFx{position:fixed;inset:0;background:#000;opacity:0;pointer-events:none;z-index:17;transition:opacity .6s}
#endCard{position:fixed;inset:0;display:none;align-items:center;justify-content:center;flex-direction:column;z-index:30;background:rgba(4,8,14,.92);color:#eafff4;font:16px system-ui;text-align:center;padding:0 8vw}
#endCard h1{font:800 40px system-ui;color:#c8f06a;margin:0 0 10px;letter-spacing:2px}
#csTitle{position:fixed;inset:0;z-index:29;background:#000;opacity:0;transition:opacity .8s;pointer-events:none}`;
    document.head.appendChild(css);
    const div = (id, cls) => { const d = document.createElement("div"); if (id) d.id = id; if (cls) d.className = cls; document.body.appendChild(d); return d; };
    const hud = div("objHud"), box = div("csBox"), lbT = div("", "lbox"), lbB = div("", "lbox"), fx = div("mistFx"), endCard = div("endCard"), title = div("csTitle"), pt = div("csPt");
    lbT.style.top = "0"; lbT.style.transform = "translateY(-100%)"; lbB.style.bottom = "0"; lbB.style.transform = "translateY(100%)";
    hud.innerHTML = "<svg id='objArrow' viewBox='0 0 24 24'><path d='M12 2 L20 20 L12 15 L4 20 Z' fill='#c8f06a'/></svg><span><b>Objective</b> <span id='objTxt'></span></span><span id='objDist'></span>";
    const objTxt = hud.querySelector("#objTxt"), objArrow = hud.querySelector("#objArrow"), objDist = hud.querySelector("#objDist");

    /* ---------------- positions ---------------- */
    const near = (x, z) => { // nearest standable spot
      if (s.canStand(x, z)) return [x, z];
      for (let r = 0.5; r < 8; r += 0.5) for (let a = 0; a < 6.28; a += 0.35) { const X = x + Math.cos(a) * r, Z = z + Math.sin(a) * r; if (s.canStand(X, Z)) return [X, Z]; }
      return [x, z];
    };
    // a spot in a scene (outdoor rect, local tile coords) or in a place (interior, local metres)
    const at = (scene, lx, lz, stand = true) => {
      const pl = s.PL[scene]; let x, z;
      if (pl) { x = pl.ox + lx; z = pl.oz + lz; }
      else { const r = s.res.rects[scene]; if (!r) return new V(P.position.x, 0, P.position.z); [x, z] = s.res.unwarp(r[0] + lx, r[1] + lz); }
      if (stand) [x, z] = near(x, z);
      return new V(x, s.groundY(x, z), z);
    };
    const here = () => s.placeAt(P.position.x, P.position.z) || s.sceneAt(P.position.x, P.position.z) || "";
    const inPlace = (k) => s.placeAt(P.position.x, P.position.z) === k;
    const dist = (p) => Math.hypot(p.x - P.position.x, p.z - P.position.z);
    const fwd = () => { const a = P.rotation.y + (s.OFF.idle || 0); return new V(Math.sin(a), 0, Math.cos(a)); };

    /* ---------------- actors and props ---------------- */
    const ACT = {};
    const actor = (id, o) => (ACT[id] = Object.assign({ id, G: null, loading: false, h: 1.6 }, o));
    const bubble = () => {
      const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d");
      g.fillStyle = "#c8f06a"; g.beginPath(); g.arc(32, 32, 26, 0, 6.28); g.fill(); g.fillStyle = "#0a1420"; g.font = "bold 44px system-ui"; g.textAlign = "center"; g.fillText("!", 32, 48);
      const sp = new K.Spr(new K.SprMat({ map: new K.CTex(c), depthTest: false })); sp.scale.set(0.42, 0.42, 1); sp.renderOrder = 9; return sp;
    };
    const spawn = async (a) => {
      if (a.G || a.loading) return; a.loading = true;
      let G = null; let p = a.pos();
      try {
        if (a.build) { G = a.build(a); G.position.copy(p); sc.add(G); }
        else if (a.mon) { G = await e.loadMon(a.mon, p.x, p.z); if (!G.parent) sc.add(G); G.position.set(p.x, p.y + (a.y || 0), p.z); }
        else { G = await s.put(a.model, a.h, p.x, p.z, a.ry || 0); if (a.y != null) G.position.y = p.y + a.y; }
      } catch (x) { console.warn("story3: could not load", a.id, x); }
      a.loading = false;
      if (!G) { a.failed = true; return; }
      if (a.dead) { sc.remove(G); return; }
      if (a.set) { p = a.pos(); G.position.copy(p); }
      a.G = G; a.x = G.position.x; a.z = G.position.z; a.base = G.position.clone();
      if (a.ry != null) G.rotation.y = a.ry;
      if (a.scale) G.scale.multiplyScalar(a.scale);
      if (a.name && !a.nobub) { const b = bubble(); b.position.set(0, (a.h || 1.6) + 0.45, 0); b.visible = false; G.add(b); a.bub = b; }
      if (a.onSpawn) a.onSpawn(a);
    };
    const despawn = (a) => { if (a.G) { sc.remove(a.G); a.G = null; } };
    const place = (a, p, ry) => { if (!a.G) return; a.G.position.copy(p); a.x = p.x; a.z = p.z; a.base = p.clone(); if (ry != null) a.G.rotation.y = ry; };
    const vis = (a) => !!(a && a.G && a.G.visible);
    const actorPos = (id) => () => { const a = ACT[id]; return a && a.G ? a.G.position.clone() : a ? a.pos() : P.position.clone(); };
    const mat = (c, ei = 0, o = {}) => new K.Mat(Object.assign({ color: c, emissive: c, emissiveIntensity: ei, roughness: 0.6 }, o));
    const mesh = (geo, m, x = 0, y = 0, z = 0, parent) => { const M = new K.M(geo, m); M.position.set(x, y, z); if (parent) parent.add(M); return M; };

    /* ---------------- Zib (the scout saucer, same build as the other worlds) ---------------- */
    const zib = (() => {
      const G = new K.G();
      mesh(new K.Cyl(0.17, 0.12, 0.05, 32), new K.Mat({ color: "#eef3fa", metalness: 0.45, roughness: 0.3 }), 0, 0, 0, G);
      const rim = mesh(new K.Tor(0.17, 0.018, 8, 40), new K.Mat({ color: "#f2bf2a", metalness: 0.55, roughness: 0.3, emissive: "#6a4200", emissiveIntensity: 0.3 }), 0, 0, 0, G); rim.rotation.x = Math.PI / 2;
      mesh(new K.Sph(0.075, 20, 14), new K.Mat({ color: "#ffd23a", metalness: 0.05, roughness: 0.45 }), 0, 0.06, 0, G);
      const eye = mesh(new K.Sph(0.045, 16, 12), new K.Mat({ color: "#2a8be8", emissive: "#1a6fd0", emissiveIntensity: 0.4, roughness: 0.15 }), 0, 0.07, 0.05, G); eye.scale.z = 0.6;
      mesh(new K.Sph(0.019, 12, 10), new K.Mat({ color: "#081018", roughness: 0.2 }), 0, 0.072, 0.08, G);
      mesh(new K.Sph(0.1, 20, 12, 0, 6.29, 0, Math.PI / 2), new K.Mat({ color: "#5cc4ff", transparent: true, opacity: 0.42, roughness: 0.05, depthWrite: false }), 0, 0.02, 0, G);
      for (const sx of [-1, 1]) {
        const an = mesh(new K.Cyl(0.004, 0.004, 0.09, 6), new K.Mat({ color: "#c9d2dc", metalness: 0.6, roughness: 0.3 }), sx * 0.035, 0.16, -0.01, G); an.rotation.z = -sx * 0.35;
        mesh(new K.Sph(0.017, 10, 8), new K.Mat({ color: "#ffd23a", emissive: "#ffb000", emissiveIntensity: 1.2 }), sx * 0.052, 0.205, -0.01, G);
      }
      const lights = [];
      for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; lights.push(mesh(new K.Sph(0.014, 8, 6), new K.Mat({ color: "#ffd860", emissive: "#ffd860", emissiveIntensity: 2.2 }), Math.cos(a) * 0.16, 0, Math.sin(a) * 0.16, G)); }
      const pl = new K.PL("#ffd860", 0.8, 2.2, 2); pl.position.y = 0.1; G.add(pl);
      G.scale.setScalar(1.25); G.visible = false; sc.add(G);
      return { G, lights, mood: "gold", t: 0, hidden: false };
    })();
    const MOODS = { gold: ["#ffd860", "#ffb0d0"], red: ["#ff4a4a", "#ff7a4a"], blue: ["#5ab4ff", "#7ad8ff"], dim: ["#7a8090", "#5a6070"], rainbow: null };
    const mood = (m) => (zib.mood = m);

    /* ---------------- cutscenes ---------------- */
    const PT = { Rook: "pt_rook", Kit: "pt_kit", Sola: "pt_sola", Pell: "pt_pell", Strand: "pt_strand" };
    const portrait = (who, txt) => {
      let k = who && PT[who];
      if (k && (who === "Rook" || who === "Kit") && /!/.test(txt)) k += "_alt";
      if (k) { pt.style.backgroundImage = "url(art/cs/" + k + ".webp)"; box.classList.add("hasPt"); pt.style.left = ((box.getBoundingClientRect().left || 0) + 10) + "px"; pt.style.display = "block"; }
      else { pt.style.display = "none"; box.classList.remove("hasPt"); }
    };
    const CS = { on: false, q: [], full: "", shown: 0, done: null, who: null, cam: null, waiting: false, shotKey: null, shot: null };
    const letterbox = (on) => {
      lbT.style.transform = on ? "translateY(0)" : "translateY(-100%)"; lbB.style.transform = on ? "translateY(0)" : "translateY(100%)";
      for (const id of ["help", "rpgHud", "objHud"]) { const d = document.getElementById(id); if (d) d.style.visibility = on ? "hidden" : ""; }
    };
    let voice = null;
    const CRY = { Zib: "zib_bip", Chirpod: "chirpod", Glitchbug: "skitterbit", Lumislug: "lumislug", Skitterdrone: "skitterdrone", Mycelith: "sporix", Sporix: "sporix", Plazmet: "plazmet", Cactling: "cactling" };
    const cry = (k) => { try { const a = new Audio("audio/cries/cry_" + k + ".mp3"); a.volume = 0.8; a.play().catch(() => {}); return a; } catch (x) { return null; } };
    const speak = (txt, who) => {
      if (voice) { try { voice.pause(); } catch (x) {} voice = null; }
      if (who && CRY[who]) { voice = cry(who === "Zib" && /\.\.\./.test(txt) ? "zib_bip_sad" : CRY[who]); return; }
      try { const f = window.__VXH && window.__VXH(txt); if (f && window.__VX && window.__VX[f] && window.VPLAY) voice = window.VPLAY(f); } catch (x) {}
    };
    const draw = () => { box.innerHTML = (CS.who ? "<div class='who'>" + CS.who + "</div>" : "") + "<div>" + CS.full.slice(0, Math.floor(CS.shown)) + "</div><span class='nx'>" + (CS.shown >= CS.full.length ? "E / Ⓐ ▸" : "") + "</span>"; };
    const play = (q, done) => {
      if (CS.on) { CS.q.push(...q); const d0 = CS.done; CS.done = () => { d0 && d0(); done && done(); }; return; }
      CS.on = true; CS.q = q.slice(); CS.done = done || null; letterbox(true); s.hint(false);
      for (const k of ["KeyW", "KeyA", "KeyS", "KeyD", "ShiftLeft", "Space"]) if (s.K) s.K[k] = false;
      next();
    };
    const next = () => {
      while (CS.q.length) {
        const it = CS.q.shift();
        if (typeof it === "function") {
          let r; try { r = it(); } catch (x) { console.error("story3 step", x); }
          if (r && r.then) { CS.waiting = true; r.then(() => { CS.waiting = false; next(); }, (x) => { console.error("story3 step", x); CS.waiting = false; next(); }); return; }
          continue;
        }
        if (it.wait) { CS.waiting = true; setTimeout(() => { CS.waiting = false; next(); }, it.wait * 1000); return; }
        if (it.cam !== undefined) { CS.cam = it.cam; CS.shotKey = null; continue; }
        const t = typeof it === "string" ? it : it.t, m = /^([^:]{1,24}):\s(.*)$/.exec(t);
        CS.who = m ? m[1] : null; CS.full = m ? m[2] : t; CS.shown = 0; box.style.display = "block";
        portrait(CS.who, CS.full); draw(); speak(CS.full, CS.who); return;
      }
      CS.on = false; box.style.display = "none"; pt.style.display = "none"; letterbox(false); CS.cam = null; CS.who = null; CS.shotKey = null; restoreHidden();
      if (voice) { try { voice.pause(); } catch (x) {} voice = null; }
      const d = CS.done; CS.done = null; if (d) d();
    };
    const advance = () => { if (!CS.on || CS.waiting) return; if (CS.shown < CS.full.length) { CS.shown = CS.full.length; draw(); return; } next(); };
    box.addEventListener("click", advance);
    const pause = (sec) => ({ wait: sec });

    /* title card (text, like the Ferrox one) and the end-of-world card */
    const titleCard = (ch, name) => {
      title.style.background = "radial-gradient(circle,#10243a,#000)";
      title.innerHTML = "<div style='position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#bfe8ff;font:800 22px system-ui;letter-spacing:4px'><div style='opacity:.7;font-size:15px'>CHAPTER " + ch + "</div><div style='font-size:38px;margin-top:8px;letter-spacing:2px;color:#f2fbff'>" + name + "</div></div>";
      title.style.opacity = "1"; setTimeout(() => (title.style.opacity = "0"), 3200); setTimeout(() => (title.innerHTML = ""), 4200);
    };
    const fade = (ms = 900) => new Promise((res) => { fx.style.opacity = "1"; setTimeout(() => { try { CS.mid && CS.mid(); } catch (x) {} CS.mid = null; fx.style.opacity = "0"; setTimeout(res, 650); }, ms); });
    // fade to black, run fn while black, fade back in
    const blackout = (fn, ms = 900) => () => { CS.mid = fn; return fade(ms); };
    let endNext = null;
    const showEnd = (h, txt, nxt) => { endCard.innerHTML = "<h1>" + h + "</h1><div style='max-width:640px;line-height:1.5'>" + txt + "</div><div style='margin-top:18px;opacity:.7'>Press E to continue</div>"; endCard.style.display = "flex"; endNext = nxt || null; };
    const toWorld = (w) => { try { localStorage.setItem("am_world", w); } catch (x) {} location.href = location.pathname + "?world=" + w + (/[?&]god/.test(location.search) ? "&god" : ""); };

    /* ---------------- camera framing for cutscenes ---------------- */
    const ray = new K.Ray();
    let hidden = [];
    const restoreHidden = () => { for (const m of hidden) m.visible = true; hidden = []; };
    const ownSet = () => { const set = new Set(); for (const g of [P, zib.G].concat(Object.values(ACT).map((a) => a.G))) if (g) g.traverse((o) => set.add(o)); return set; };
    const frame = (rook, subj, isZib) => {
      const mid = rook.clone().add(subj).multiplyScalar(0.5);
      const d = subj.clone().sub(rook).setY(0); const sep = Math.max(1.5, d.length()); d.normalize();
      if (d.lengthSq() < 0.01) d.copy(fwd());
      const perp = new V(-d.z, 0, d.x), up = new V(0, 1, 0);
      const look = new V(mid.x, mid.y + (isZib ? 1.6 : 1.1), mid.z);
      if (curSet) {
        const st = curSet, c = st.o.clone(), half = st.half || 3, dir = c.clone().sub(mid).setY(0);
        let side = perp.clone(); if (side.dot(dir) < 0) side.negate();
        const cp = mid.clone().addScaledVector(side, Math.min(half - 0.4, 2.2 + sep * 0.5)).addScaledVector(d, -0.4); cp.y = st.o.y + 1.75;
        return { cp, look: new V(mid.x, st.o.y + 1.0, mid.z) };
      }
      // the room: an interior is framed from the room's middle so walls stay behind the camera
      const pk = s.placeAt(P.position.x, P.position.z), pl = pk && s.PL[pk];
      if (pl) {
        const c = new V(pl.ox + pl.w / 2, mid.y, pl.oz + pl.d / 2), dir = c.clone().sub(mid).setY(0);
        if (dir.length() < 1.5) dir.copy(perp); dir.normalize();
        const cp = mid.clone().addScaledVector(dir, Math.min(3.2 + sep * 0.6, Math.max(2.2, Math.min(pl.w, pl.d) / 2 - 0.4))); cp.y = s.groundY(cp.x, cp.z) + 2;
        return { cp, look };
      }
      const own = ownSet(), meshes = [], big = [];
      sc.traverse((o) => {
        if (!o.isMesh || !o.visible || own.has(o) || o.isInstancedMesh || !o.geometry) return;
        if (o.material && o.material.transparent && o.material.opacity < 0.5) return;
        if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
        const R = o.geometry.boundingSphere.radius * Math.max(o.scale.x, o.scale.y, o.scale.z), wp = o.getWorldPosition(new V()), D2 = wp.distanceToSquared(mid);
        if (R < 7 && D2 < 400) meshes.push(o); else if (R >= 7 && R < 30 && D2 < 900) big.push([wp, R * 0.8]);
      });
      const cands = [];
      for (const ang of [0, 0.5, -0.5, 1, -1, Math.PI, Math.PI - 0.6, Math.PI + 0.6]) for (const r of [2.6 + sep * 0.7, 2 + sep * 0.5, 1.5 + sep * 0.3]) cands.push([perp.clone().applyAxisAngle(up, ang).multiplyScalar(r), Math.abs(ang) * 0.15 + (r < 2.6 + sep * 0.7 ? 0.2 : 0)]);
      let best = null, bs = 1e9;
      const targets = [look, rook.clone().setY(rook.y + 1.3), subj.clone().setY(subj.y + 1)];
      for (const [off, base] of cands) {
        const cp = mid.clone().add(off); cp.y = mid.y + 1.4 + sep * 0.12; const gy = s.groundY(cp.x, cp.z) + 1.2; if (cp.y < gy) cp.y = gy;
        let sc0 = base;
        for (const tg of targets) {
          const dv = tg.clone().sub(cp), L = dv.length(); dv.normalize(); ray.set(cp, dv); ray.far = L - 0.2;
          if (ray.intersectObjects(meshes, false).length) sc0 += 3;
          if (s.WALLS && s.WALLS.length) { const h = ray.intersectObjects(s.WALLS, false); if (h.length && h[0].distance < L - 0.6) sc0 += 4; }
          for (const [c, r] of big) { const hit = ray.ray.intersectSphere(new K.Sp(c, r), new V()); if (hit && hit.distanceTo(cp) < L - 0.5 && c.distanceTo(tg) > r) { sc0 += 3; break; } }
        }
        if (sc0 < bs) { bs = sc0; best = cp; } if (bs < 0.01) break;
      }
      // hide the small things still in the way
      restoreHidden();
      for (const tg of targets) {
        const dv = tg.clone().sub(best), L = dv.length(); dv.normalize(); ray.set(best, dv); ray.far = L - 0.3;
        for (const h of ray.intersectObjects(meshes, false)) { const o = h.object; if (o.visible && o.geometry.boundingSphere.radius * Math.max(o.scale.x, o.scale.y, o.scale.z) < 6) { o.visible = false; hidden.push(o); } }
      }
      return { cp: best, look };
    };

    /* ---------------- companions shown beside Rook during cutscenes ---------------- */
    const have = (sp) => S.party.concat(S.box).some((m) => m.sp === sp);
    const crew = []; // [actorId, wantFn]
    const companion = (id, o, want) => { actor(id, Object.assign({ scene: "*", pos: () => P.position.clone(), show: () => false, comp: true }, o)); crew.push([id, want]); };
    companion("cPlaz", { name: "Plazmet", mon: "Plazmet", h: 1.1, nobub: true }, () => have("Plazmet"));
    const stageCrew = (dt) => {
      let n = 0;
      const a0 = P.rotation.y + (s.OFF.idle || 0), side = new V(Math.cos(a0), 0, -Math.sin(a0)), f = new V(Math.sin(a0), 0, Math.cos(a0));
      for (const [id, want] of crew) {
        const a = ACT[id]; if (!a.G) continue;
        const on = CS.on && want() && !e.busy();
        if (on && !a.G.visible) {
          let p = P.position.clone().addScaledVector(side, (n % 2 ? -1 : 1) * (1 + Math.floor(n / 2) * 0.75)).addScaledVector(f, 0.5);
          if (!s.canStand(p.x, p.z)) p = P.position.clone().addScaledVector(f, -(1 + n * 0.5));
          if (curSet) p = P.position.clone().addScaledVector(side, (n % 2 ? -1 : 1) * (1 + Math.floor(n / 2) * 0.75)).addScaledVector(f, 0.5);
          p.y = (curSet ? P.position.y : s.groundY(p.x, p.z)) + (a.fly || 0); place(a, p, a0); a.G.visible = true;
        } else if (!on) a.G.visible = false;
        if (on) n++;
        if (a.G.visible && a.fly) a.G.position.y = a.base.y + Math.sin(T * 2.4) * 0.08;
      }
    };

    /* ---------------- objective HUD ---------------- */
    let objPos = () => null;
    const objective = (txt, posFn) => { ST.obj = txt; objTxt.textContent = txt || ""; objPos = posFn || (() => null); hud.style.display = txt ? "flex" : "none"; save(); };

    /* ---------------- party, battles, items ---------------- */
    const topLv = () => S.party.reduce((m, p) => Math.max(m, p.lv || 1), 1);
    const lvl = (base, d = 0) => Math.max(base, topLv() - 1) + d;
    const species = (name, def) => { if (!e.SPECIES[name]) e.SPECIES[name] = Object.assign({ r: "normal" }, def); };
    const give = (sp, lv, nick) => {
      const m = e.mkMon(sp, lv); if (nick) m.nick = nick;
      if (S.party.length < 6) S.party.push(m); else S.box.push(m);
      s.LOG[sp] = (s.LOG[sp] || 0) + 1; try { s.saveLog(); s.showLog(); } catch (x) {}
      save(); e.showBanner("PARTNER CONFIRMED"); return m;
    };
    const keyItem = (sid, n, d) => { const L = e.KEYITEMS; if (L && !L.some((k) => k.sid === sid)) L.push({ k: "key", sid, n, d }); };
    let fighting = false;
    // a story battle: resolves "win" or "lose"; the team is rested first so a story fight can always start
    const battle = (opts) => new Promise((res) => {
      if (!S.party.length) return res("win");
      try { e.healAll && e.healAll(); } catch (x) {}
      fighting = true;
      const fin = (r) => { fighting = false; save(); res(r); };
      Promise.resolve(e.startTrainer(Object.assign({}, opts, { onWin: () => fin("win"), onLose: () => fin("lose") }))).catch((x) => { console.error("story3 battle", x); fin("win"); });
    });

    /* ---------------- followers (Alienmon trailing behind Rook) ---------------- */
    const followers = []; // actor ids, in order
    const follow = (id, on = true) => { const i = followers.indexOf(id); if (on && i < 0) followers.push(id); if (!on && i >= 0) followers.splice(i, 1); };
    const runFollow = (dt) => {
      let prev = P.position;
      followers.forEach((id, i) => {
        const a = ACT[id]; if (!a || !a.G) return;
        const tgt = prev.clone(), d = a.G.position.clone().sub(tgt).setY(0), L = d.length(), gap = i ? 0.9 : 1.3;
        if (L > gap) {
          const step = Math.min(L - gap, dt * Math.max(3, (L - gap) * 3)); d.normalize();
          const nx = a.G.position.x - d.x * step, nz = a.G.position.z - d.z * step;
          a.G.position.set(nx, s.groundY(nx, nz) + (a.fly || 0) + (a.fly ? Math.sin(T * 3 + i) * 0.06 : 0), nz); a.x = nx; a.z = nz;
          a.G.rotation.y = Math.atan2(-d.x, -d.z);
        }
        if (L > 14) { const p = P.position.clone().addScaledVector(fwd(), -1.2 - i * 0.6); p.y = s.groundY(p.x, p.z) + (a.fly || 0); place(a, p); }
        prev = a.G.position;
      });
    };

    /* ---------------- talking and hints ---------------- */
    const nearest = (r = 2.4) => {
      if (CS.on || e.busy()) return null;
      let best = null, bd = r;
      for (const id in ACT) { const a = ACT[id]; if (!a.G || !a.G.visible || a.comp || !(a.talk || a.trainer)) continue; const d = Math.hypot(a.x - P.position.x, a.z - P.position.z); if (d < bd) { bd = d; best = a; } }
      return best;
    };

    let T = 0, poll = 0, H = null; // H = the world script
    const update = (dt) => {
      T += dt;
      // spawn/despawn by scene, then visibility, facing and "!" bubbles
      const pk = s.placeAt(P.position.x, P.position.z);
      for (const id in ACT) {
        const a = ACT[id];
        const active = a.scene === "*" || (s.PL[a.scene] ? pk === a.scene : !!s.CH[a.scene]);
        if (active && !a.G && !a.failed) spawn(a); else if (!active && a.G) despawn(a);
        if (!a.G) continue;
        if (!a.comp) { const sh = a.show ? !!a.show() : true; if (a.G.visible !== sh) a.G.visible = sh;
          // move the actor when the story moves on (a new step, a room, or the actor's own key), but never while it walks behind Rook
          if (sh && !a.fixed && !followers.includes(id)) { const k = ST.step + "|" + (curSet ? curSet.id : "") + "|" + (a.pkey ? a.pkey() : ""); if (a.lastKey !== k) { a.lastKey = k; const p = a.pos(); if (p.y > -400) place(a, p.clone().setY(p.y + (a.y || 0) + (a.fly || 0)), a.ry); } } }
        if (a.G.visible && (a.model || a.mon) && !a.noface && !a.comp && !followers.includes(id) && Math.hypot(a.x - P.position.x, a.z - P.position.z) < 5) {
          let d = Math.atan2(P.position.x - a.x, P.position.z - a.z) - a.G.rotation.y; while (d > Math.PI) d -= 6.283; while (d < -Math.PI) d += 6.283; a.G.rotation.y += d * Math.min(1, dt * 4);
        }
        if (a.bub) a.bub.visible = !CS.on && a.G.visible && !!(a.mark && a.mark());
        if (a.tick) a.tick(a, dt);
      }
      stageCrew(dt); runFollow(dt);
      // Zib floats beside Rook's cap in cutscenes
      zib.t += dt; zib.G.visible = CS.on && !zib.hidden && !e.busy();
      const zp = P.position.clone().add(new V(Math.cos(P.rotation.y) * 0.55, 1.95 + Math.sin(zib.t * 2.2) * 0.08, -Math.sin(P.rotation.y) * 0.55));
      zib.G.position.lerp(zp, Math.min(1, dt * 3)); zib.G.rotation.y += dt * 1.4;
      const cols = MOODS[zib.mood];
      zib.lights.forEach((l, i) => { const c = cols ? cols[(i + Math.floor(zib.t * 4)) % 2] : "hsl(" + (((i * 45 + zib.t * 160) % 360) | 0) + ",90%,60%)"; l.material.color.set(c); l.material.emissive.set(c); });
      if (CS.on) {
        if (CS.shown < CS.full.length) { CS.shown += dt * 46; draw(); }
        const sp = CS.who ? Object.values(ACT).find((a) => a.name && a.G && a.G.visible && !a.comp && CS.who.startsWith(a.name)) : null;
        const camId = sp ? sp.id : CS.cam;
        let subj = null;
        if (camId === "zib") subj = zib.G.position.clone().setY(P.position.y);
        else if (camId && ACT[camId] && ACT[camId].G && ACT[camId].G.visible) subj = ACT[camId].G.position.clone();
        else if (camId && camId.isVector3) subj = camId.clone();
        const rook = P.position.clone(), tgt = subj || rook.clone().addScaledVector(fwd(), 2);
        // Rook turns toward whoever the scene is about
        if (subj && dist(subj) > 0.6) { let d = Math.atan2(subj.x - rook.x, subj.z - rook.z) - (s.OFF.idle || 0) - P.rotation.y; while (d > Math.PI) d -= 6.283; while (d < -Math.PI) d += 6.283; P.rotation.y += d * Math.min(1, dt * 5); }
        const key = (camId || "") + ":" + Math.round(tgt.x) + "," + Math.round(tgt.z);
        if (CS.shotKey !== key) { CS.shotKey = key; CS.shot = frame(rook, tgt, camId === "zib"); }
        cam.position.lerp(CS.shot.cp, Math.min(1, dt * 2.2)); cam.lookAt(CS.shot.look);
        for (const k of ["KeyW", "KeyA", "KeyS", "KeyD"]) if (s.K) s.K[k] = false;
      }
      if (hud.style.display !== "none") {
        let p = objPos(); try { if (p && window.lqRoute) p = window.lqRoute(p) || p; } catch (x) {}
        if (p) {
          const dx = p.x - P.position.x, dz = p.z - P.position.z, d = Math.hypot(dx, dz), yaw = s.getYaw ? s.getYaw() : 0, base = Math.atan2(-Math.sin(yaw), -Math.cos(yaw)), rel = Math.atan2(dx, dz) - base;
          objArrow.style.transform = "rotate(" + (-rel * 180) / Math.PI + "deg)"; objArrow.style.opacity = "1"; objDist.textContent = d < 4 ? "here" : Math.round(d) + " m";
        } else { objArrow.style.opacity = "0"; objDist.textContent = ""; }
      }
      poll -= dt;
      if (poll <= 0) { poll = 0.25; if (!CS.on && !fighting && !e.busy() && !(e.menu && e.menu()) && endCard.style.display !== "flex" && H && H.tick) { try { H.tick(); } catch (x) { console.error("story3 tick", x); } } }
    };
    const talk = () => {
      if (CS.on) { advance(); return true; }
      if (endCard.style.display === "flex") { endCard.style.display = "none"; const n = endNext; endNext = null; if (n) n(); return true; }
      const a = nearest(); if (!a) return false;
      if (a.talk) { a.talk(a); return true; }
      return false;
    };
    const hint = () => {
      if (CS.on || endCard.style.display === "flex") return null;
      const a = nearest(); if (!a) return null;
      const lab = a.verb ? (typeof a.verb === "function" ? a.verb(a) : a.verb) : "Talk to " + a.name;
      return "E  " + lab + (a.mark && a.mark() ? "  (!)" : "");
    };
    const key = (ev) => {
      if (endCard.style.display === "flex" && ["KeyE", "Enter", "Space"].includes(ev.code)) { ev.preventDefault(); talk(); return true; }
      if (CS.on && ["KeyE", "Enter", "Space"].includes(ev.code)) { ev.preventDefault(); advance(); return true; }
      return false;
    };
    const blockedFns = [];
    const blocked = (x, z) => { if (FREE || ST.free) return false; for (const f of blockedFns) if (f(x, z)) return true; return false; };

    /* ---------------- sets: a room built high above Rook's spot, for scenes inside a place the map has no interior for.
       Only used during cutscenes (the game leaves the player where the story puts him while a cutscene runs). ---------------- */
    const SETS = {};
    let curSet = null;
    const defSet = (id, o) => (SETS[id] = Object.assign({ id, G: null, o: null }, o));
    const setPos = (id, lx, lz, dy = 0) => { const st = SETS[id]; if (!st || !st.o) return P.position.clone().setY(-500); return new V(st.o.x + lx, st.o.y + dy, st.o.z + lz); };
    const enterSet = (id, lx = 0, lz = 0, ry) => {
      const st = SETS[id]; st.back = P.position.clone(); st.backRy = P.rotation.y;
      st.o = new V(P.position.x, P.position.y + 60, P.position.z);
      if (!st.G) { st.G = st.build(); sc.add(st.G); }
      st.G.position.copy(st.o); st.G.visible = true; curSet = st;
      P.position.set(st.o.x + lx, st.o.y, st.o.z + lz); if (ry != null) P.rotation.y = ry;
      for (const a of Object.values(ACT)) if (a.set === id && a.G) place(a, a.pos(), a.ry);
      CS.shotKey = null;
    };
    const leaveSet = () => { const st = curSet; if (!st) return; st.G.visible = false; P.position.copy(st.back); P.rotation.y = st.backRy; curSet = null; CS.shotKey = null; };

    /* ---------------- teleport (outdoors or into a place) ---------------- */
    const travel = (dest) => { try { window.GAME && window.GAME.travel && window.GAME.travel(dest); } catch (x) { console.error("story3 travel", x); } };
    const tp = (p, ry) => { P.position.set(p.x, s.groundY(p.x, p.z), p.z); if (ry != null) P.rotation.y = ry; CS.shotKey = null; };

    // a starter team for anyone who arrives here with an empty party (a direct link to this world)
    if (!S.party.length && !ST.flags.starter) {
      ST.flags.starter = 1;
      for (const [sp, lv] of [["Plazmet", 14], ["Cactling", 13], ["Lumislug", 12]]) if (e.SPECIES[sp]) { const m = e.mkMon(sp, lv); S.party.push(m); s.LOG[sp] = (s.LOG[sp] || 0) + 1; }
      save();
    }

    const X = { cry, s, e, K, V, world, ST, S, save, at, near, here, inPlace, dist, fwd, ACT, actor, place, vis, actorPos, mat, mesh, zib, mood, play, pause, advance, titleCard, fade, blackout, showEnd, toWorld, objective, have, companion, lvl, topLv, species, give, keyItem, battle, follow, followers, blocked: blockedFns, travel, tp, defSet, setPos, enterSet, leaveSet, get curSet() { return curSet; }, get T() { return T; }, CS, FREE };
    const mk = WORLDS[world];
    H = mk ? mk(X) : null;
    keyItem("badge", "Nana Wren's Badge", "R.B. No. 1. Recovery Bay, Number One. It isn't a badge, Nana Wren used to say. It's a promise: never give up on anybody.");
    if (H && H.items) H.items();
    e.KEYITEMS && !e.KEYITEMS.some((k) => k.sid === "free3") && e.KEYITEMS.push({ k: "key", sid: "free3", n: "Free roam (playtest)", d: "Opens every path, ignoring the story gates.", fn: () => ((ST.free = !ST.free), save(), ST.free ? "Free roam is ON: every path is open." : "Free roam is OFF: the story gates are back.") });
    if (H && H.start) setTimeout(() => { try { H.start(); } catch (x) { console.error("story3 start", x); } }, 600);

    window.STORY = { ST, ACT, play, titleCard, blocked, talk, refreshOpen: () => {}, objective, zib, set: (step) => { ST.step = step; save(); H && H.resume && H.resume(); }, get CS() { return CS; }, get objPos() { return objPos(); }, advance, X, nearest };
    return { ST, update, blocked, talk, hint, key, busy: () => CS.on };
  };
})();

/* =====================================================================================================
   THALASSA (book ch. 15-18): Port Saltreach, the ghost ship, the tower attack, Captain's Orders, the Keeper battle
   ===================================================================================================== */
(function () {
  "use strict";
  window.STORY3_WORLDS.thalassa = function (X) {
    const { s, e, K, V, ST, at, actor, ACT, play, pause, objective, fade, blackout, place, mesh, mat } = X;
    const F = ST.flags, P = s.P;
    const R = "Rook", KT = "Kit", Z = "Zib", M = "Captain Marsh", VX = "Admin Vex", PE = "Pell", SN = "Strand", LK = "Linker";
    X.species("Hexcoil", { t: ["Toxin"], s: [78, 88, 72, 84, 70, 86], m: "n4_sludgeviper", h: 1.6 });
    X.species("Brineback", { t: ["Hydro"], s: [112, 82, 108, 78, 96, 40], m: "n4_mossback", h: 1.3 });
    X.species("Mycelith", { t: ["Bio"], s: [86, 72, 92, 70, 92, 46], m: "lo_mycora", h: 1.1 });
    const steps = ["arrive", "dinner", "pier", "ghost", "dawn", "road", "ladder", "vex", "orders", "round", "sunset", "keeper", "done"];
    const past = (k) => steps.indexOf(ST.step) > steps.indexOf(k);
    const is = (...k) => k.includes(ST.step);
    const set = (k) => { ST.step = k; X.save(); goal(); };

    /* ---------- props ---------- */
    const white = () => mat("#eef2f6", 0.05, { metalness: 0.35, roughness: 0.35 }), orange = () => mat("#ff7a1a", 0.6);
    const helixShip = (black) => {
      const G = new K.G(), body = black ? mat("#15161a", 0.02, { metalness: 0.5, roughness: 0.3 }) : white();
      const hull = mesh(new K.Sph(1, 24, 12), body, 0, 0, 0, G); hull.scale.set(black ? 3.2 : 2.0, black ? 1.1 : 0.7, black ? 9 : 5.5);
      if (black) for (let i = -3; i <= 3; i++) { const b = mesh(new K.Tor(1, 0.12, 6, 30), mat("#ffd21a", 0.7), 0, 0, i * 1.9, G); b.scale.set(3.12 * Math.sqrt(1 - (i * 1.9 / 9) ** 2), 1.08 * Math.sqrt(1 - (i * 1.9 / 9) ** 2), 1); }
      else { const st = mesh(new K.Box(0.1, 0.5, 6), orange(), 1.95, 0, 0, G); const st2 = st.clone(); st2.position.x = -1.95; G.add(st2); }
      for (const sx of [-1, 1]) { const w = mesh(new K.Box(black ? 5 : 3, 0.12, black ? 3 : 1.8), body, sx * (black ? 4.5 : 2.6), -0.1, -1, G); w.rotation.z = sx * 0.08; }
      for (const sx of [-1, 1]) mesh(new K.Sph(0.25, 10, 8), mat("#ff3a3a", 2.5), sx * (black ? 6.8 : 4), 0, -1, G);
      mesh(new K.Sph(black ? 1.2 : 0.7, 12, 10), mat("#ff9a3a", 2.2), 0, 0, black ? -8.8 : -5.4, G);
      return G;
    };
    const fleet = new K.G(); s.sc.add(fleet);
    const ships = [helixShip(false), helixShip(false), helixShip(false), helixShip(true)];
    ships.forEach((g) => fleet.add(g));
    const towerTop = () => at("TD", 15, 10, false);
    let shipMode = "circle", shipT = 0, coreMesh = null, coreLift = 0;
    const findCore = () => {
      if (coreMesh || !s.CH.TD) return coreMesh;
      const t = towerTop();
      s.sc.traverse((o) => { if (!coreMesh && o.isMesh && o.geometry && o.geometry.type === "OctahedronGeometry") { const w = o.getWorldPosition(new V()); if (Math.hypot(w.x - t.x, w.z - t.z) < 2 && w.y > 15) coreMesh = o; } });
      return coreMesh;
    };
    const scaffold = () => {
      const G = new K.G(), m = white(), r = 4.6;
      for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283; mesh(new K.Cyl(0.06, 0.06, 14, 6), m, Math.cos(a) * r, 7, Math.sin(a) * r, G); }
      for (let y = 2; y <= 14; y += 3) { const t = mesh(new K.Tor(r, 0.05, 6, 48), m, 0, y, 0, G); t.rotation.x = Math.PI / 2; const p = mesh(new K.Tor(r - 0.3, 0.25, 4, 48), mat("#d8dde2", 0.05), 0, y - 0.15, 0, G); p.rotation.x = Math.PI / 2; p.scale.z = 0.15; }
      for (let i = 0; i < 4; i++) { const a = (i / 4) * 6.283 + 0.4; const ch = mesh(new K.Cyl(0.05, 0.05, 30, 4), mat("#3a3c40", 0.1, { metalness: 0.7 }), Math.cos(a) * 1.4, 41, Math.sin(a) * 1.4, G); ch.name = "chain"; }
      return G;
    };
    const crate = (c = "#e8ecef") => { const G = new K.G(); mesh(new K.Box(1.1, 0.9, 0.9), mat(c, 0.03), 0, 0.45, 0, G); mesh(new K.Box(1.12, 0.15, 0.92), orange(), 0, 0.6, 0, G); return G; };
    const ladder = () => { const G = new K.G(), m = mat("#5a5048", 0.02, { metalness: 0.7, roughness: 0.4 }); for (const sx of [-0.3, 0.3]) mesh(new K.Box(0.06, 3.2, 0.06), m, sx, 1.6, 0, G); for (let y = 0.3; y < 3.2; y += 0.35) mesh(new K.Box(0.6, 0.04, 0.04), m, 0, y, 0, G); return G; };
    const bubbub = () => {
      const G = new K.G(); mesh(new K.Sph(0.75, 20, 14), new K.Mat({ color: "#bfefff", transparent: true, opacity: 0.32, roughness: 0.05, depthWrite: false }), 0, 0.75, 0, G);
      const b = mesh(new K.Sph(0.32, 16, 12), mat("#5ab8e8", 0.1), 0, 0.7, 0, G); b.scale.y = 0.85;
      for (const sx of [-0.12, 0.12]) { mesh(new K.Sph(0.08, 10, 8), mat("#ffffff", 0.2), sx, 0.82, 0.26, G); mesh(new K.Sph(0.04, 8, 6), mat("#101820", 0), sx, 0.83, 0.32, G); }
      for (const sx of [-1, 1]) { const f = mesh(new K.Sph(0.12, 8, 6), mat("#4aa0d0", 0.05), sx * 0.33, 0.62, 0, G); f.scale.set(1.4, 0.4, 0.8); }
      return G;
    };
    const seahorse = () => { const G = new K.G(), m = mat("#3ec48a", 0.25, { metalness: 0.3 }); const b = mesh(new K.Sph(0.32, 14, 10), m, 0, 0.9, 0, G); b.scale.set(0.8, 1.4, 0.9); const h = mesh(new K.Sph(0.22, 12, 10), m, 0, 1.45, 0.12, G); h.scale.z = 1.3; mesh(new K.Cyl(0.05, 0.08, 0.35, 8), m, 0, 1.42, 0.42, G).rotation.x = Math.PI / 2; const t = mesh(new K.Tor(0.16, 0.06, 8, 16, 4.5), m, 0, 0.35, -0.05, G); t.rotation.y = Math.PI / 2; for (const sx of [-1, 1]) { const f = mesh(new K.Plane(0.3, 0.35), mat("#a8ffd8", 0.4, { side: 2, transparent: true, opacity: 0.8 }), sx * 0.26, 1.0, 0, G); f.rotation.y = sx * 0.6; } for (const sx of [-0.1, 0.1]) mesh(new K.Sph(0.05, 8, 6), mat("#101820", 0), sx, 1.52, 0.3, G); return G; };
    const crab = () => { const G = new K.G(), m = mat("#ff8a2a", 0.15); const b = mesh(new K.Sph(0.3, 14, 10), m, 0, 0.22, 0, G); b.scale.y = 0.55; for (const [sx, s0] of [[-1, 0.09], [1, 0.16]]) mesh(new K.Sph(s0, 10, 8), m, sx * 0.38, 0.25, 0.2, G); for (const sx of [-0.08, 0.08]) { mesh(new K.Cyl(0.015, 0.015, 0.15, 4), m, sx, 0.4, 0.15, G); mesh(new K.Sph(0.035, 8, 6), mat("#101820", 0), sx, 0.48, 0.15, G); } return G; };
    const post = () => { const G = new K.G(); mesh(new K.Cyl(0.12, 0.14, 2.2, 8), mat("#6a4a30", 0), 0, 1.1, 0, G); for (const y of [0.5, 0.9]) mesh(new K.Tor(0.2, 0.03, 6, 16), mat("#c8b088", 0), 0, y, 0, G).rotation.x = Math.PI / 2; return G; };

    /* ---------- the two rooms the map has no inside for: the ghost ship's hold and the old boat shed ---------- */
    X.defSet("hold", { half: 4.6, build: () => {
      const G = new K.G(), wall = mat("#2a2420", 0.02, { metalness: 0.5, roughness: 0.7, side: 2 }), dark = mat("#120f0d", 0, { side: 2 });
      mesh(new K.Box(10, 0.1, 10), mat("#2e2a26", 0.02, { metalness: 0.6 }), 0, -0.05, 0, G);
      for (const [x, z, w, d] of [[0, -5, 10, 0.2], [0, 5, 10, 0.2], [-5, 0, 0.2, 10], [5, 0, 0.2, 10]]) mesh(new K.Box(w, 4, d), wall, x, 2, z, G);
      mesh(new K.Box(10, 0.1, 10), dark, 0, 4, 0, G);
      for (let i = 0; i < 4; i++) mesh(new K.Cyl(0.08, 0.08, 10, 6), mat("#4a4038", 0.02, { metalness: 0.6 }), -3 + i * 2, 3.6, 0, G).rotation.x = Math.PI / 2;
      const bars = mat("#7a7a80", 0.05, { metalness: 0.8, roughness: 0.35 });
      for (let row = 0; row < 3; row++) for (let col = 0; col < 7; col++) { // the cages along the far wall, doors hanging open
        const s0 = row === 0 ? 1.1 : row === 1 ? 0.9 : 0.7, x = -4.1 + col * 1.3, y = row === 0 ? 0 : row === 1 ? 1.12 : 2.05, z = -4.3, C = new K.G(); C.position.set(x, y, z); G.add(C);
        for (let b = 0; b <= 5; b++) mesh(new K.Cyl(0.015, 0.015, s0, 4), bars, -s0 / 2 + (b * s0) / 5, s0 / 2, s0 / 2, C);
        for (const yy of [0.01, s0]) mesh(new K.Box(s0, 0.03, s0), bars, 0, yy, 0, C);
        const door = mesh(new K.Box(s0 * 0.9, s0 * 0.9, 0.02), new K.Mat({ color: "#7a7a80", metalness: 0.8, transparent: true, opacity: 0.55 }), -s0 * 0.45, s0 / 2, s0 / 2 + s0 * 0.45, C); door.rotation.y = -1.2;
        if ((row * 7 + col) % 5 === 2) mesh(new K.Box(0.3, 0.06, 0.25), mat("#b8a070", 0), 0, 0.05, 0, C);
      }
      for (let col = 0; col < 7; col++) mesh(new K.Box(1.1, 0.9, 0.05), bars, -4.1 + col * 1.3, 0.45, 4.3, G).visible = col % 2 === 0;
      const blanket = mesh(new K.Box(0.4, 0.08, 0.3), mat("#ffd84a", 0.15), 3.9, 0.06, 3.9, G); blanket.name = "blanket";
      mesh(new K.Box(1.4, 0.8, 0.8), mat("#4a3828", 0), 3.6, 0.4, -2.4, G); // the desk
      const book = mesh(new K.Box(0.5, 0.08, 0.38), mat("#141414", 0), 3.6, 0.85, -2.4, G); mesh(new K.Tor(0.08, 0.015, 6, 16), orange(), 3.6, 0.9, -2.4, G).rotation.x = Math.PI / 2; book.name = "log";
      mesh(new K.Sph(0.08, 8, 6), mat("#fff2c0", 3), 3.6, 2.6, -2.4, G); const bulb = new K.PL("#ffe2a0", 1.2, 6, 2); bulb.position.set(3.6, 2.6, -2.4); G.add(bulb);
      const glow = new K.PL("#a8ff60", 1.6, 9, 2); glow.position.set(0, 1.2, 0); glow.name = "slug"; G.add(glow);
      return G; } });
    X.defSet("shed", { half: 3.6, build: () => {
      const G = new K.G(), wood = mat("#6a4e34", 0.02, { side: 2, roughness: 0.9 });
      mesh(new K.Box(8, 0.1, 8), mat("#4a3a2a", 0.02), 0, -0.05, 0, G);
      for (const [x, z, w, d] of [[0, -4, 8, 0.15], [0, 4, 8, 0.15], [-4, 0, 0.15, 8], [4, 0, 0.15, 8]]) mesh(new K.Box(w, 3.4, d), wood, x, 1.7, z, G);
      mesh(new K.Box(8, 0.1, 8), wood, 0, 3.4, 0, G);
      const p = post(); p.position.set(0, 0, -1.6); G.add(p);
      const lab = mesh(new K.Plane(1.2, 0.4), mat("#ffffff", 0.3, { side: 2 }), 0, 2.4, -3.9, G); lab.name = "label";
      for (let i = 0; i < 6; i++) { const pot = mesh(new K.Cyl(0.35, 0.4, 0.5, 8, 1, true), mat("#7a5a3a", 0, { side: 2, wireframe: true }), 3 - (i % 2) * 0.8, 0.25 + Math.floor(i / 2) * 0.5, 2.8, G); }
      const l = new K.PL("#ffe8c0", 1.1, 9, 2); l.position.set(0, 2.8, 1); G.add(l);
      return G; } });

    /* ---------- people and Alienmon ---------- */
    X.companion("cKit", { name: "Kit", model: "n2_story_kit", h: 1.55, nobub: true }, () => true);
    X.companion("cSpor", { name: "Sporix", mon: "Sporix", h: 0.42, nobub: true }, () => !F.myc && !F.sporOut);
    X.companion("cMyc", { name: "Mycelith", mon: "Mycelith", h: 1.1, nobub: true }, () => !!F.myc && !F.mycOut);
    const visStep = (...k) => () => k.includes(ST.step);
    actor("marsh", { name: M, model: "r2_ranger", h: 1.86, scene: "*", pkey: () => (F.jobGull || 0) + (F.hold ? "h" : ""), pos: () => marshPos(), show: () => !!marshPos(true), talk: () => marshTalk(), mark: () => is("dinner", "orders", "sunset", "keeper") });
    const marshPos = (q) => {
      const k = ST.step;
      if (k === "arrive") return q ? 1 : at("TA", 14.8, 14.6);
      if (k === "dinner") return q ? 1 : at("TD", 15.5, 16.2);
      if (k === "ghost" && F.hold) return q ? 1 : at("TH", 18.2, 16.8);
      if (k === "road" || k === "ladder") return q ? 1 : at("TD", 15.6, 17.2);
      if (k === "orders") return q ? 1 : at("TD", 18.5, 15.0);
      if (k === "round" && F.jobGull === 1) return q ? 1 : at("TE", 16, 18.4);
      if (k === "sunset" || k === "keeper") return q ? 1 : at("TF", 3.6, 15.2);
      return q ? 0 : P.position.clone().setY(-500);
    };
    actor("barnaby", { name: "Old Barnaby", mon: "Brineback", h: 2.6, scale: 2.1, scene: "*", noface: true, pos: () => (is("road", "ladder") ? at("TD", 13.3, 15.6) : at("TF", 9, 21.5, false)), show: () => is("road", "ladder", "sunset", "keeper") });
    actor("fisher", { name: "Old fisherman", model: "r2_fisher", h: 1.62, scene: "TA", pos: () => at("TA", 16.6, 12.4), show: () => is("pier") });
    actor("chirp", { name: "Chirpod", mon: "Chirpod", h: 0.42, scene: "*", fly: 0.0, pos: () => P.position.clone(), show: () => is("dawn") || (!!X.curSet && !!F.chirp && is("ghost")), onSpawn: (a) => a.G.scale.multiplyScalar(0.8) });
    actor("lumi", { name: "Lumislug", mon: "Lumislug", h: 0.4, scene: "*", pos: () => X.setPos("hold", -1.2, 2.6), set: "hold", show: () => !!X.curSet && X.curSet.id === "hold" });
    actor("baby", { name: "", mon: "Chirpod", h: 0.42, scene: "*", pos: () => X.setPos("hold", 0, -1.2), set: "hold", show: () => !!X.curSet && X.curSet.id === "hold" && !F.chirp, noface: true });
    // the tower attack
    const vexOn = () => is("vex");
    actor("vex", { name: VX, model: "n2_inspector", h: 1.8, scene: "TD", pos: () => at("TD", 15, 15.4), show: vexOn });
    actor("pell", { name: PE, model: "n2_story_pell", h: 1.82, scene: "TD", pos: () => at("TD", 12.2, 15.0), show: vexOn });
    actor("strand", { name: SN, model: "n2_story_strand", h: 1.62, scene: "TD", pos: () => at("TD", 18.0, 15.6), show: vexOn });
    actor("crateV", { build: () => crate(), scene: "TD", pos: () => at("TD", 18.9, 14.7, false), show: vexOn });
    actor("scaf", { build: scaffold, scene: "TD", pos: () => at("TD", 15, 10, false), show: () => is("ladder", "vex") });
    actor("hex", { name: "Hexcoil", mon: "Hexcoil", h: 1.6, scale: 1.4, scene: "TD", pos: () => at("TD", 16.6, 13.9), show: () => vexOn() && !!F.hexOut });
    for (let i = 0; i < 4; i++) actor("wk" + i, { name: "Helix worker", model: "n2_story_grunt", h: 1.75, scene: "TD", noface: true, pos: () => at("TD", [10.6, 19.4, 11.4, 18.6][i], [11.5, 11.5, 14.2, 13.4][i]), show: vexOn });
    // the blockade on the cliff road
    for (let i = 0; i < 8; i++) actor("gb" + i, { name: "Helix grunt", model: "n2_story_grunt", h: 1.75, scene: "TD", pos: () => at("TD", 12.6 + (i % 4) * 1.5, i < 4 ? 20.4 : 21.9), show: () => is("road", "ladder") });
    for (let i = 0; i < 3; i++) actor("sd" + i, { name: "", mon: "Skitterdrone", h: 0.9, scene: "TD", pos: () => at("TD", 12.3 + i * 1.6, 17.6 + (i % 2) * 0.8), show: () => is("road", "ladder"), noface: true });
    actor("ladder", { name: "Service ladder", build: ladder, scene: "TD", pos: () => at("TD", 20.2, 24.5), show: () => is("ladder"), talk: () => climb(), verb: "Climb the service ladder", mark: () => true });
    // Captain's Orders: the grunts left behind
    actor("brann", { name: "Brann", model: "n2_story_grunt", h: 1.8, scene: "TA", pos: () => at("TA", 5.2, 16.4), show: () => is("round") && !F.jobPier, talk: () => jobPier(), verb: "Talk to the grunts", mark: () => true });
    actor("pg1", { name: "Helix grunt", model: "n2_story_grunt", h: 1.72, scene: "TA", pos: () => at("TA", 3.6, 16.0), show: () => is("round") && !F.jobPier });
    actor("pg2", { name: "Helix grunt", model: "n2_story_grunt", h: 1.7, scene: "TA", pos: () => at("TA", 6.8, 17.2), show: () => is("round") && !F.jobPier });
    actor("pd1", { name: "", mon: "Skitterdrone", h: 0.9, scene: "TA", noface: true, pos: () => at("TA", 4.6, 17.6), show: () => is("round") && !F.jobPier });
    actor("lhDoor", { name: "Lighthouse door", build: () => { const G = new K.G(); mesh(new K.Box(1.2, 2.1, 0.12), mat("#5a3c26", 0.02), 0, 1.05, 0, G); mesh(new K.Sph(0.05, 8, 6), mat("#d8b04a", 0.4, { metalness: 0.8 }), 0.4, 1.0, 0.08, G); return G; }, scene: "TE", pos: () => at("TE", 16, 17.6), show: () => is("round") && F.jobGull !== 2, talk: () => jobGull(), verb: "Knock on the lighthouse door", mark: () => true });
    actor("gg1", { name: "Helix grunt", model: "n2_story_grunt", h: 1.7, scene: "TE", pos: () => at("TE", 14.6, 19.2), show: () => F.jobGull === 1.5 });
    actor("mina", { name: "Mina", model: "r2_kid", h: 1.25, scene: "TC", pos: () => at("TC", 5.2, 8.2), show: () => is("round") && !F.jobWall, talk: () => jobWall(), mark: () => true });
    actor("splodge", { name: "Splodge", build: bubbub, scene: "TC", pos: () => at("TC", 6.4, 8.6), show: () => is("round") && !F.jobWall });
    actor("wg1", { name: "Helix grunt", model: "n2_story_grunt", h: 1.74, scene: "TC", pos: () => at("TC", 4.6, 5.6), show: () => is("round") && !F.jobWall });
    actor("wg2", { name: "Helix grunt", model: "n2_story_grunt", h: 1.7, scene: "TC", pos: () => at("TC", 5.8, 5.2), show: () => is("round") && !F.jobWall });
    actor("young", { name: "Young grunt", model: "n2_story_grunt", h: 1.62, scene: "TI", pos: () => at("TI", 6.4, 13.4), show: () => is("round") && !F.jobBeach, talk: () => jobBeach(), mark: () => true });
    actor("pip", { name: "Pip", mon: "Skitterdrone", h: 0.9, scale: 0.7, scene: "TI", pos: () => at("TI", 7.2, 13.9), show: () => is("round") && !F.jobBeach });
    actor("shedDoor", { name: "Old boat shed", build: () => { const G = new K.G(); mesh(new K.Box(0.18, 0.24, 0.08), mat("#8a8a90", 0.05, { metalness: 0.9 }), 0, 1.1, 0, G); mesh(new K.Tor(0.07, 0.02, 6, 12, 3.2), mat("#8a8a90", 0.05, { metalness: 0.9 }), 0, 1.25, 0, G); return G; }, scene: "TC", pos: () => at("TC", 17, 23.4), show: () => is("round") && !F.jobShed, talk: () => jobShed(), verb: "Listen at the shed door", mark: () => true });
    actor("tied1", { name: "", build: seahorse, scene: "*", pos: () => X.setPos("shed", -0.5, -1.2), set: "shed", show: () => !!X.curSet && X.curSet.id === "shed" });
    actor("tied2", { name: "", build: crab, scene: "*", pos: () => X.setPos("shed", 0.6, -1.1), set: "shed", show: () => !!X.curSet && X.curSet.id === "shed" });
    actor("netm1", { name: "Fisherman", model: "r2_fisher", h: 1.66, scene: "TA", pos: () => at("TA", 3.4, 8.6), show: () => is("round"), talk: () => jobNets(), mark: () => !F.jobNets, verb: (a) => (F.jobNets ? "Talk to the fisherman" : "Help mend the nets") });
    actor("netm2", { name: "Fisherman", model: "r2_fisher", h: 1.6, scene: "TA", pos: () => at("TA", 1.6, 9.0), show: () => is("round") });

    /* ---------- objectives ---------- */
    const jobs = [["jobPier", "the fish market pier (Saltreach Docks)", () => at("TA", 5, 16.4)], ["jobGull", "the lighthouse on Gull Rock", () => at("TE", 16, 18)], ["jobWall", "the end of the sea wall (Boatyard)", () => at("TC", 5.2, 7.5)], ["jobBeach", "the little beach on the Palm Isles", () => at("TI", 6.4, 13)], ["jobShed", "the old boat shed (Boatyard)", () => at("TC", 17, 23.4)], ["jobNets", "the torn nets on the docks", () => at("TA", 3, 8.5)]];
    const jobDone = (k) => (k === "jobGull" ? F.jobGull === 2 : !!F[k]);
    const goal = () => {
      const k = ST.step;
      const G = {
        dinner: ["Explore Port Saltreach, then meet Captain Marsh at her tower for dinner (Harbor Point)", () => at("TD", 15.5, 16.2)],
        pier: ["Watch the glowing sea from the pier where you landed (Saltreach Docks)", () => at("TA", 14.5, 13.5)],
        ghost: ["Go to the ghost ship at the Fog Bank dock (east of Harbor Point)", () => at("TH", 17.6, 17.2)],
        dawn: ["Take the little Chirpod to the beach on the Pearl Islands at sunrise", () => at("TG", 20, 8)],
        road: ["The bells! Run to the Harbor Tower (the road up Harbor Point)", () => at("TD", 14.5, 26.5)],
        ladder: ["The road is blocked. Climb the service ladder up the cliff", () => ACT.ladder.G ? ACT.ladder.G.position.clone() : at("TD", 20.2, 24.5)],
        orders: ["Talk to Captain Marsh on the tower terrace", () => at("TD", 18.5, 15)],
        sunset: ["Meet Captain Marsh at the Harbor Arena", () => at("TF", 3.6, 15.2)],
        keeper: ["Battle Keeper Captain Delia Marsh (Harbor Arena)", () => at("TF", 3.6, 15.2)],
      };
      if (k === "round") {
        const left = jobs.filter(([f]) => !jobDone(f));
        if (!left.length) return set("sunset");
        let best = left[0], bd = 1e9; for (const j of left) { const d = X.dist(j[2]()); if (d < bd) { bd = d; best = j; } }
        return objective("Captain's Orders (" + (jobs.length - left.length) + " of " + jobs.length + "): help at " + best[1], best[2]);
      }
      const g = G[k]; if (g) objective(g[0], g[1]); else objective("");
      if (ST.step === "pier" || ST.step === "ghost") X.s.setNight && X.s.setNight(true);
    };

    /* ---------- scenes ---------- */
    const arrive = () => play([
      () => { const t = document.getElementById("csTitle"); if (t) { t.innerHTML = ""; t.style.background = "#000 center/cover no-repeat url(art/cs/cs_title_ch15.jpg)"; t.style.opacity = "1"; setTimeout(() => (t.style.opacity = "0"), 3200); } }, pause(3.4),
      { cam: "zib" },
      "Through the harbor gate at Port Ember: the whoosh, the tingle, the flash of blue. And then Rook has to stop the ship in midair.",
      "It is a world made of sea. Turquoise sea in every direction, so clear he can see white sand and coral far below, and schools of silver fish flashing like coins.",
      "Little round islands of white sand are scattered across the water like pearls on a blanket. And arching over the whole sky are rings. Enormous glittering rings, like a bridge made of diamonds.",
      KT + ": Thalassa. Ocean world. Seventh ring. Rook. Rook, look at it.",
      R + ": I'm looking. I'm looking.",
      "They land at the edge of a busy harbor town called Port Saltreach. On a rocky point above the harbor rises a tall white tower with a spiral of blue tiles, and a sea-blue crystal glowing at the top.",
      { cam: "marsh" },
      "A woman comes striding down the pier. Very tall, broad shoulders, short gray hair, a long blue captain's coat with brass buttons. A brass spyglass hangs from her belt.",
      M + ": Captain Delia Marsh. I'm the Keeper here.",
      M + ": I felt that gate wake up from all the way over here. Rattled every window on the island. So I thought, whoever's coming through that gate, I'd better have a look at them.",
      M + ": You're young.",
      R + ": Yes, ma'am. We're here to battle you. For a Signal Shard.",
      M + ": Then I hope you're as tough as you look. Because we may have bigger problems.",
      "She hands Rook the spyglass. Far out past the last island, three long white starships hang low over the water, circling like sharks. Orange rings on their sides, with a slash through them.",
      "Behind them is a fourth ship. Not white. Black, with bold yellow stripes down its sides, like a wasp.",
      M + ": Helix ships have been circling my tower for a week. Waiting for something. I don't know what. And that black one showed up this morning.",
      M + ": I've been sailing these waters for forty years, son. And I know what it looks like when a storm is about to hit.",
      M + ": Dinner's at the tower, up on Harbor Point. Have a look around town first. And stay away from those ships.",
    ], () => set("dinner"));
    const marshTalk = () => {
      const k = ST.step;
      if (k === "dinner") return dinner();
      if (k === "orders") return orders();
      if (k === "sunset" || k === "keeper") return keeper();
      if (k === "round" && F.jobGull === 1) return gullOpen();
      play([{ cam: "marsh" }, M + ": " + (past("keeper") ? "Every fisherman who ever got lost out there found his way home by that light. Keep that Shard safe, son." : past("orders") ? "Six jobs, son. Then we talk." : "Stay away from those ships.")]);
    };
    const dinner = () => play([{ cam: "marsh" },
      M + ": There you are. Fish pie, and two hammocks upstairs. Eat.",
      "Captain Marsh gives them dinner at the tower, and a room with two hammocks, and a long, stern talking-to about not going anywhere near the Helix ships.",
      M + ": I'll be up top with my spyglass. Same as every night this week.",
      blackout(() => { X.s.setNight && X.s.setNight(true); X.tp(at("TA", 14.2, 13.2)); }, 1200),
      { cam: "zib" },
      "Night on Thalassa is even more beautiful than day. The great rings overhead don't sparkle at night. They glow, silver and pale blue and the faintest shimmering pink.",
      "The water glows too. Every wave that breaks on the shore breaks in a flash of soft blue light. Zib skims low over the waves, dipping his saucer in the water, and zooms up to look at the glowing trail behind him.",
      Z + ": Bip! Bip! Biiiiip!",
      "Kit sits beside Rook on the pier with his knees pulled up, eating a fish pie from a paper bag. Sporix is asleep in his lap, snoring tiny snores.",
    ], () => set("pier"));
    const ghostArrives = () => play([{ cam: "cKit" },
      KT + ": Rook. Look.",
      "A ship is drifting into the bay past Harbor Point. An old cargo boat, long and low and dark, with a tall smokestack and two rusty cranes. No engine noise. No horn. No lights. Not one.",
      "Nobody is at the wheel. It slides across the glowing water to the dock at the Fog Bank, bumps against the end of it with a long, low wooden groan, and stops.",
      { cam: "fisher" },
      "Old fisherman: Ghost ship.",
      R + ": Ghost ship?",
      "Old fisherman: Comes in on the tide sometimes. No crew. No lights. No name. Bad luck, lad. Very bad luck. Nobody goes near a ghost ship. Nobody.",
      { cam: "cKit" },
      KT + ": Rook. No.",
      R + ": I just want to look.",
      KT + ": Nobody goes near a ghost ship. He literally just said that. He said it TWICE.",
      R + ": I know. But it's a cargo ship, and it came in from the same direction as the Helix ships. What if it's theirs? What if there's something on it we need to know about?",
      KT + ": ...I hate it when you make sense.",
    ], () => set("ghost"));
    const lights = [];
    const flick = (on) => { for (const l of lights) l.visible = on; };
    const boardShip = () => play([
      () => { const sp = at("TH", 17, 9, false); if (!lights.length) for (let i = 0; i < 5; i++) { const L = new K.PL("#ffe8b0", 0, 10, 2); L.position.set(sp.x - 6 + i * 3, 4.2, sp.z + (i % 2) * 1.5); X.s.sc.add(L); const b = mesh(new K.Sph(0.12, 8, 6), mat("#fff2c0", 3), sp.x - 6 + i * 3, 4.2, sp.z + (i % 2) * 1.5); X.s.sc.add(b); lights.push(L, b); } flick(false); },
      { cam: "cKit" },
      "The ghost ship is much bigger up close. Its rusty sides rise above them like a wall. A rope ladder hangs over the side. Rook climbs. Kit comes up after him, muttering with every rung.",
      "The deck is empty. Ropes lie where they were dropped. A bucket rolls back and forth as the ship rocks. Clunk. Clunk. It looks like everybody stood up and walked away in the middle of whatever they were doing.",
      () => { flick(true); for (const l of lights) if (l.isLight) l.intensity = 2.4; }, "And then the lights come on. All of them, all at once. FZZT.",
      () => { let n = 0; const iv = setInterval(() => { flick(n % 2 === 0); if (++n > 9) { clearInterval(iv); flick(false); } }, 160); }, pause(1.6),
      KT + ": Old wiring. It's just old wiring. Salt gets in the connections. Happens all the time. Totally normal. Totally, totally normal.",
      () => X.cry("chirpod"), "From somewhere deep below their feet comes a sound. Hooooooowl. Long and high and wobbly. The loneliest sound Rook has ever heard.",
      KT + ": That is not old wiring.",
      R + ": That doesn't sound scary. I mean, it does. But it doesn't sound like something that wants to scare us. It sounds like something that's scared.",
      KT + ": Lumislug. You'd better lead.",
      "Lumislug slides out onto the deck, blinks sleepily, and lights up. Its soft lime-green glow spreads across the dark deck, steady and calm. It slides to the edge of the hatch, looks back at them, and starts down the stairs.",
      blackout(() => X.enterSet("hold", 0, 3.2, Math.PI), 1100),
      { cam: "lumi" },
      "Down, down, down into the dark hold. Pipes drip cold water down the backs of their necks. The air smells like rust and old seawater and something sharp, like the inside of a hospital.",
      { cam: "baby" }, () => X.cry("chirpod"),
      "And there, in the middle of the floor, all alone in a little pool of Lumislug's light, is the monster. It is about the size of a grapefruit.",
      "Round and plump, with teal and hot-pink feathers puffed up like a pom-pom, tiny chrome-tipped wings, and a beak shaped exactly like a megaphone. HOOOOOOWL. The pipes rattle.",
      KT + ": Oh. Oh, you poor thing.",
      LK + ": CHIRPOD. SONIC-TYPE. VERY SMALL. VERY LOUD. COPIES ANY SOUND IT HEARS. HOWLS WHEN SEPARATED FROM ITS FLOCK.",
      KT + ": It got left behind. It's just a baby. It's been down here all alone in the dark, howling for somebody to come back.",
      KT + ": Hey. Hey, little one. It's okay. We came. We heard you.",
      () => { F.chirp = 1; X.save(); },
      "The Chirpod hops forward on its tiny chrome feet, one hop, two hops, three, right into Kit's hands. Kit tucks it inside his jacket. It gives one last tiny hiccup, and closes its eyes.",
      Z + ": ...Bip.",
      R + ": A monster. The ghost ship monster. It's a pom-pom.",
      KT + ": The scariest pom-pom in the whole Kessler system.",
      () => X.mood("dim"),
      "Then Lumislug slides deeper into the hold, and its light sweeps across the far walls. Cages. Rows and rows of cages, stacked to the ceiling. Every single one is empty.",
      "A food bowl, tipped over. A scrap of blanket. A single loose feather. And on the bars of one cage, low down, little scratch marks.",
      "On a desk in the corner, under a single bare bulb, lies a big black logbook stamped with an orange ring. Rook opens it to the last page and reads it out loud.",
      R + ": 'Final voyage. Cargo collected from Ferrox, Scrap Route. Sporeholm, Mushroom Maze. Thalassa, outer islands.'",
      R + ": 'Cargo delivered. All captured Alienmon transferred to the Station. Vessel to be abandoned.' 'Approved. Admin V.'",
      KT + ": How many? How many did they take?",
      "Nobody answers. In the very last cage, near the floor, someone has left a tiny knitted blanket of soft yellow wool. Tucked into it is a scrap of paper, in big, round, wobbly handwriting.",
      "For the little one, so it's not cold on the trip. I'm sorry. I'm really sorry. S.",
      "Rook folds the note up very carefully and puts it in his pocket. It feels like something that shouldn't be left behind in the dark.",
      blackout(() => { X.leaveSet(); F.hold = 1; X.mood("gold"); flick(false); X.save(); }, 1100),
      { cam: "marsh" },
      "Captain Marsh is waiting on the dock in her long blue coat with her arms folded. She clearly saw them go. She clearly has a lot to say about it. But when she sees their faces, she doesn't say any of it.",
      "She reads the last page of the logbook by the light of the glowing rings, and her face goes hard. Harder than stone. Then she steers them back to the tower and makes them cocoa, and sits with them until they are ready to sleep.",
      blackout(() => { X.s.setNight && X.s.setNight(false); X.tp(at("TA", 14.2, 13.2)); }, 1400),
      "The next morning, they take the little Chirpod down to the beach at sunrise.",
    ], () => { X.keyItem("note", "Yellow blanket note", "For the little one, so it's not cold on the trip. I'm sorry. I'm really sorry. -S. Found in the ghost ship's last cage."); X.keyItem("logbook", "Helix logbook", "'Cargo delivered. All captured Alienmon transferred to the Station. Vessel to be abandoned.' Approved. Admin V."); X.follow("chirp", true); set("dawn"); });
    const freeChirp = () => play([{ cam: "chirp" },
      "The sky is pink and gold and the rings are fading to silver. Kit holds the Chirpod up in both hands. It blinks at the sand and the sea, and then up at a flock of round teal-and-pink birds circling over the far end of the island.",
      () => X.cry("chirpod"), "Its feathers puff out. And it lets out the loudest, happiest, most enormous howl Rook has ever heard. HOOOOOWL!",
      () => { X.cry("chirpod"); setTimeout(() => X.cry("chirpod"), 300); }, "From the flock comes an answer. Dozens of howls, all together, rolling across the beach like music.",
      () => { X.follow("chirp", false); const a = ACT.chirp; if (a.G) { const b = a.G.position.clone(); let t = 0; const iv = setInterval(() => { t += 0.05; if (!a.G) return clearInterval(iv); a.G.position.set(b.x + t * 3, b.y + t * 4, b.z - t * 2); if (t > 3) { clearInterval(iv); a.G.visible = false; F.chirpGone = 1; } }, 50); } },
      "The Chirpod flaps its tiny wings so hard they blur, wobbles, nearly crashes into the sand, and then rises up into the pink sky toward its family.",
      KT + ": Good luck. Don't get left behind again.",
      "Rook can't stop thinking about the cages. All those Alienmon who weren't left behind. Who were taken to the Station. He is still thinking about it when the bells start.",
      () => { shipMode = "attack"; shipT = 0; }, "CLANG-CLANG-CLANG-CLANG! The big brass harbor bells, the ones that only ring for storms. Out past the last island, the Helix ships aren't circling anymore. They're coming in, low and fast. Heading for the tower.",
      () => X.titleCard(17, "Harbor Under Siege"), pause(3.4),
      KT + ": The crystal! Rook, the scratch on Dr. Moor's crystal, the crack on Dad's, they were TESTING. They were testing how to get them out. That's what they're here for!",
    ], () => set("road"));
    const blockade = () => play([{ cam: "gb1" },
      "The road up to the tower is steep and winding, cut into the cliff. And it is blocked. A dozen Helix grunts in white jumpsuits stand across it in two neat lines. Nobody is shouting. One of them reads out numbers into a radio, calmly.",
      { cam: "barnaby" },
      "Halfway up the cliff road, Captain Marsh is fighting her way toward her tower, her coat flying, her spyglass in one hand like a sword. Beside her rolls the biggest Alienmon Rook has ever seen: old Barnaby, huge and blue, his shell crusted with barnacles.",
      "But every time Barnaby shoves one line back, the other line steps up and closes the gap, calm and tidy, like a door swinging shut. Skitterdrones swarm over his shell like ants.",
      { cam: "marsh" },
      "Captain Marsh sees them. She shouts something over the bells. Rook can't hear it. But he sees her point. Not at the road. Up. At the side of the cliff, where a long iron service ladder runs up to the tower.",
      KT + ": She wants us to go up the back way.",
    ], () => set("ladder"));
    const climb = () => play([{ cam: "ladder" },
      "The ladder is slippery with sea spray and so steep it leans out over the waves. Rook climbs with his heart in his throat, not looking down. The waves smash against the rocks below in great sprays of glowing blue foam.",
      blackout(() => X.tp(at("TD", 21, 12), -Math.PI / 2), 1000),
    ], () => { set("vex"); setTimeout(vexScene, 300); });
    const vexScene = () => play([{ cam: "vex" },
      "They tumble out onto the tower terrace. White Helix scaffolding is wrapped around the whole tower, and workers stand on every level with wrenches and hissing cutters, unbolting the huge brass bolts that hold the core, one by one.",
      () => { shipMode = "hover"; }, "Right over the top of the tower hangs the belly of the black-and-yellow ship, with chains running down through the roof. Waiting. The crystal at the top is flickering, its hum getting fainter.",
      { cam: "pell" }, "Pell and Strand are there too, beside a big crate. Pell calls bolt numbers up to the scaffolding, crisp and steady. Strand keeps his head down.",
      { cam: "vex" }, "Because standing in the middle of it all is someone new. Tall and thin, with perfect posture, and sharp, short hair dyed a bright, startling teal. She doesn't turn around. She doesn't even seem surprised.",
      VX + ": Ah. There you are.",
      VX + ": Admin Vex. And you are Rook. From Dustmere. And the engineer who switched off my harvest in the Maze. Field Agent Pell writes very thorough reports.",
      PE + ": Admin. The boy's partner is an evolved Plasma-type. I'd recommend...",
      VX + ": Twice, Pell. Twice you told me you would bring in the scout. And yet here it is. It walked in on its own.",
      PE + ": Yes, Admin.",
      VX + ": Keep the bolts moving.",
      R + ": Give that core back! That's not yours! It's Captain Marsh's! It's Thalassa's!",
      VX + ": It isn't anybody's. It's a crystal. A very old, very interesting crystal. And the Director needs it more than a fishing village does.",
      () => X.mood("red"), "Her pale eyes flick up, just for a moment, to Rook's cap. To Zib. Something moves in them. Something hungry.",
      R + ": Don't you dare touch him.",
      VX + ": Touch him? I wasn't going to. Not today. The Director says the scout will come to us on its own. When it's time.",
      VX + ": Now run along. I'm working.",
      R + ": Plazmet! Comet Dash! At the chains!",
      () => { F.hexOut = 1; }, { cam: "hex" },
      VX + ": Hexcoil. Deal with them.",
      "Something huge uncoils from behind the crate. A purple snake as big as a tree, with a shovel-shaped head and dripping yellow eyes. It flicks its tail, lazy, like someone swatting a fly. WHAP. Plazmet tumbles across the terrace.",
      "And then it goes for Kit. Not for Plazmet, who is the strongest. Not for Rook, who is shouting. Straight for the smallest, quietest person there. Hissss.",
      KT + ": Sporix! Sporix, no, come here, come back up here, please...",
      "Sporix leaps down off Kit's shoulders and plants its tiny feet between Kit and the Hexcoil. It barely comes up to Kit's knee. It is shaking all over. But it does not move.",
      "The Hexcoil spits. TSSSS. Sporix is knocked flat, a smoking black spot on its cap. And it gets up, and walks back to the exact same spot, and plants its feet again. Then it looks back over its shoulder. Up at Kit.",
      KT + ": Okay. Okay. I'm right here. I'm right behind you.",
      () => { F.sporOut = 0; X.mood("rainbow"); }, { cam: "cSpor" },
      "And Sporix begins to glow. A soft green light, brighter and brighter, until it is glowing like the mushrooms of Sporeholm. And Sporix grows with it.",
      () => { F.myc = 1; for (const m of e.S.party.concat(e.S.box)) if (m.sp === "Sporix") m.sp = "Mycelith"; X.save(); }, { cam: "cMyc" },
      "Taller than Kit, taller than Rook. Its legs become roots that dig into the cracks between the stones. Its cap spreads out wider and wider, until it is as wide as a shield, spreading out over Kit like a roof. The dark scorched spot is still there. It just grew with everything else.",
      LK + ": MYCELITH. BIO-TYPE. EVOLVED FORM.",
      KT + ": Mycelith. Oh. Oh, look at you.",
      () => X.mood("red"), "The Hexcoil hisses and lunges. Mycelith's cap holds. Rook and Plazmet are right there now. It's time to fight back.",
    ], () => vexFight());
    const vexFight = async () => {
      const r = await X.battle({ name: VX, npc: ACT.vex.G, team: [["Hexcoil", X.lvl(15, 3)]], prize: 0, canLose: true, intro: ["Admin Vex's Hexcoil wants to battle!"], winLines: ["The Hexcoil reels back, hissing. Mycelith's roots wrap around its tail and hold on."], loseLines: ["Plazmet is knocked flat. But Mycelith's roots have wrapped around the Hexcoil's tail, and they hold on."] });
      F.vexWin = r === "win" ? 1 : 0; X.save();
      play([{ cam: "vex" },
        KT + ": Mycelith! Don't pull at it! Go down! Under the floor! Follow the holes!",
        "Admin Vex has watched the whole thing without moving a single muscle. Now, for the first time, she turns her head.",
        VX + ": Interesting.",
        VX + ": Release the core. Lift.",
        R + ": No!",
        () => { coreLift = 0.001; shipMode = "lift"; }, "Overhead, the chains go tight. The crystal at the top of the tower rises up out of the roof, glowing deep sea-blue, wrapped in thick black straps, and up into the belly of the black ship. The tower goes dark.",
        () => { F.hexOut = 0; },
        VX + ": We already have what we came for. For now.",
        "Her black-and-yellow cape sweeps around, and she is gone. Strand hesitates by the crate, looking at Kit, at Mycelith, at the scorched spot on its cap.",
        PE + ": Strand. She notices everything. Everything. Don't give her a reason.",
        PE + ": I told you it wouldn't be easy.",
        () => { shipMode = "leave"; shipT = 0; }, "And then the Helix ships are gone, roaring away over the sea. The scaffolding stands empty around a dark tower.",
        { cam: "cMyc" },
        "Kit has both arms wrapped around Mycelith's stalk. Mycelith bends its great cap down over him like an umbrella.",
        KT + ": You protected me. You were so scared. I saw you shaking. And you did it anyway. You always protect me.",
        "Rook takes out the two Signal Shards. They aren't humming their sweet two-part harmony. They are flickering, dimming and brightening, like a candle in a draft. Somewhere out there are eight towers. And now one of them is dark.",
        () => X.titleCard(18, "Captain's Orders"), pause(3.4),
      ], () => { F.coreGone = 1; X.save(); set("orders"); });
    };
    const orders = () => play([{ cam: "marsh" },
      "Captain Marsh comes up onto the terrace very slowly, and looks up at the empty brass cradle where her crystal used to be. She has a cut on her cheek. Her coat is torn. Her knuckles have gone white on the railing.",
      M + ": A hundred and twelve years. That crystal has lit this harbor every single night for a hundred and twelve years. Through storms. Through floods. Through the night the stars fell.",
      M + ": Every fisherman who ever got lost out there in the dark found his way home by that light. And they unbolted it like a lightbulb.",
      M + ": No battles.",
      R + ": What?",
      M + ": You heard me. No battles. No Signal Shards. Not until every last Helix grunt is off my docks. They ran in such a hurry they left half their people behind, and those people are still out there in my town.",
      M + ": A Keeper's job is to keep. Today I didn't do that very well. So until I do, nobody battles anybody.",
      M + ": You can help, if you want to.",
      "They want to. Captain Marsh has a big old cargo barge waiting at the end of the harbor. Anyone who wants to leave Thalassa can take it, straight back through the harbor gate.",
    ], () => set("round"));
    const toBarge = (txt) => blackout(() => {}, 900);
    const jobPier = () => play([{ cam: "brann" },
      "Three grunts on the fish market pier are trying to untie a fishing boat that very clearly does not belong to them.",
      R + ": Excuse me. That's not yours.",
      "Two of them drop the rope and put their hands up. But the third one doesn't. He is older, with a hard, sunburned face, and his hand stays resting on the static-net launcher at his hip. His Skitterdrone's dish wings swivel until they point at Zib.",
      "Brann: We were just leaving. Step aside, kid. You don't want to do this today.",
      KT + ": Not in that boat.",
      "The man looks at Plazmet, whose fire has gone white-hot at the edges. He looks down at Mycelith's pale roots, which have spread out quietly across the wet boards all around them while nobody was watching.",
      "Helix grunt: Brann. Leave it. The ships are gone. Nobody's coming back for us.",
      "For a long second, nobody moves. Then Brann takes his hand off the launcher, one finger at a time, and lets the rope drop into the water. Rook and Kit march all three of them to the barge.",
      toBarge(),
    ], () => { F.jobPier = 1; X.save(); goal(); });
    const jobGull = () => {
      if (F.jobGull === 1) return gullOpen();
      play([{ cam: "lhDoor" },
        "The lighthouse door on Gull Rock is barricaded from the inside. Rook knocks. Nobody answers. But he can hear them in there, sitting on the floor in the dark. Three of them.",
        R + ": We're not going to hurt you. There's a barge.",
        "Helix grunt: Go away! You'll set that sea monster on us!",
        KT + ": They won't come out for us. We need the Captain.",
      ], () => { F.jobGull = 1; X.save(); objective("Fetch Captain Marsh (she is on the way up the Gull Rock path)", () => at("TE", 16, 18.4)); });
    };
    const gullOpen = () => play([{ cam: "marsh" },
      "Captain Marsh herself stomps up the path, bends down, and speaks through the keyhole.",
      M + ": Listen to me. Nobody on my island is going to hurt you. There's a barge at the end of the harbor. You get on it, you go home, and you never come back. That's all.",
      () => { F.jobGull = 1.5; }, "After a long time, the barricade scrapes away and the door creaks open. Three grunts come out blinking into the sunlight, and walk down the path to the barge without a word.",
      toBarge(),
    ], () => { F.jobGull = 2; X.save(); goal(); });
    const jobWall = () => play([{ cam: "mina" },
      "At the very end of the sea wall, two grunts are trapped with their backs to the water. Mina is standing in front of them with a fishing net held out in both hands, and Splodge, her Bubbub, puffed up to twice its size beside her.",
      "Mina: Not bad for landlubbers. I've been waiting all night for this.",
      R + ": Captain Marsh has a barge. They can go home.",
      "Mina lowers the net, a little disappointed. The two grunts let out a long breath, and let Rook and Kit walk them along the sea wall to the barge.",
      toBarge(),
    ], () => { F.jobWall = 1; X.save(); goal(); });
    const jobBeach = () => play([{ cam: "young" },
      "On a little beach on the far side of the island, one grunt sits all by himself on a rock with his helmet off, looking out at the sea. He looks very young, not much older than Rook, and very miserable.",
      "Young grunt: I just wanted a job. There's no work back home. Helix came to our school with a brochure, with pictures of Alienmon on it, all smiling. They said it was research. They said we'd be helping Alienmon.",
      "Young grunt: They gave me him on the first day. I named him Pip. You're not supposed to name them. I didn't know about the cages. I swear I didn't know. Not until yesterday. Not until they made me carry one.",
      R + ": There's a barge. Captain Marsh says anyone can take it home.",
      "The young grunt nods, picks up Pip, and walks with them back to the harbor without anyone having to march him at all. When the barge goes out through the harbor gate, he is the only one who looks back.",
      toBarge(),
    ], () => { F.jobBeach = 1; X.save(); goal(); });
    const jobShed = () => play([{ cam: "shedDoor" },
      "Behind a stack of lobster pots, from the old wooden shed at the back of the boatyard, comes a little whimpering, whining sound. Kit presses his ear against the door, and his face goes hard and angry.",
      "The door is padlocked. Kit has it open in about four seconds with a hairpin and a tiny screwdriver.",
      blackout(() => X.enterSet("shed", 0, 1.8, Math.PI), 900),
      { cam: "tied1" },
      "Inside, in the dim, two Alienmon are tied to a post with rough rope. A seahorse as big as a dog, with glittering green scales and long frilly fins like lace. And a round orange crab with one claw much bigger than the other.",
      "On the wall above them is a Helix label. COLLECTED. AWAITING TRANSFER.",
      KT + ": They were going to take them. They just didn't have time.",
      { cam: "cMyc" },
      "Mycelith steps forward, reaches out with its long, gentle arms of pale woody fiber, and very, very carefully begins to untie the knots. One by one, the way you would untangle a necklace.",
      "When the last rope falls away, the crab scuttles into the corner and hides. The seahorse just stands there trembling, as if it can't believe it is free. So Rook holds out Nana Wren's badge, the little brass cross with the little brass bird.",
      R + ": It's okay. You're safe now. We look after people. It's a promise.",
      { cam: "tied1" },
      "The seahorse stops trembling. It swims forward through the air, slow and graceful, and presses its long nose very gently against the badge.",
      blackout(() => X.leaveSet(), 900),
      "They let both Alienmon go in the turquoise water. The seahorse swims three circles around the dock and dives down into the glittering blue.",
    ], () => { F.jobShed = 1; X.save(); goal(); });
    const jobNets = () => {
      if (F.jobNets) return play([{ cam: "netm1" }, "Fisherman: I'd trade my boat for one of them.", KT + ": Not for sale."]);
      play([{ cam: "netm1" },
        "The grunts tore half the nets in the harbor trying to cut their way through to the boats. The fishermen sit on upturned crates with big wooden needles, mending them, and show Rook and Kit how. A knot. Then another knot. Hundreds of knots.",
        "The fishermen tell stories while they work. About storms and sea serpents, and the time Old Barnaby carried an entire sinking ship back to harbor on his back.",
        { cam: "cMyc" },
        "Mycelith turns out to be wonderful at fixing nets. Its long rope-like fibers tie knots faster than any fisherman on the dock. By the end of the afternoon, a small crowd is standing around it with their mouths open.",
        "Fisherman: I'd trade my boat for one of them.",
        KT + ": Not for sale.",
      ], () => { F.jobNets = 1; X.save(); goal(); });
    };
    const keeper = () => {
      if (ST.step === "sunset") return play([{ cam: "marsh" },
        "By sunset, the docks are safe. The last grunt is on the barge, heading out through the harbor gate. The nets are mended and hanging up to dry. People are out in the streets again, lighting their lanterns.",
        "Captain Marsh looks down at them for a long time. They are covered in fish scales and twine and sunburn and purple Skitterdrone goo. And then, for the first time since Rook met her, Captain Delia Marsh smiles.",
        M + ": Right. Now we battle.",
        "Her arena is out on the water, a wide circle of open sea marked by floating buoys with little bells on them. The whole of Port Saltreach lines the docks with their lanterns up. And into the water swims Old Barnaby.",
        LK + ": BRINEBACK. HYDRO-TYPE. VERY OLD. VERY STRONG.",
        "Water beats fire. Everybody knows that. Rook thinks about sending Plazmet straight away. Then he stops. Think first.",
        R + ": Cactling. You first. Plants beat water. You've got the advantage, buddy. Just don't fall in.",
      ], () => { set("keeper"); keeperFight(); });
      keeperFight();
    };
    const keeperFight = async () => {
      const r = await X.battle({ name: "Keeper Captain Delia Marsh", npc: ACT.marsh.G, team: [["Brineback", X.lvl(16, 2)]], prize: 1800, intro: ["Keeper Captain Delia Marsh wants to battle!"], winLines: ["Plazmet goes straight through the last wave, a white-hot point still burning, and strikes the old Brineback right on top of his great shell.", "When the steam clears, Old Barnaby is floating peacefully on his back, rumbling with something that sounds very much like laughter."] });
      if (r !== "win") { X.s.say && X.s.say("Think first. Cactling has the advantage against water. Save Plazmet for the gap.", 4200); return goal(); }
      play([{ cam: "marsh" },
        "The whole harbor goes wild. Captain Marsh walks across the floating platforms and shakes Rook's hand with that grip like an anchor. Then she presses something into his palm.",
        "It is a Signal Shard. Deep sea-blue, like the tower's crystal used to be. But it is flickering, faint, like a candle at the very end of its wick.",
        M + ": Every Keeper keeps one piece of their tower's heart. I chipped this one off the day I became Keeper, forty years ago. I've worn it on a chain around my neck every day since. You keep it safe, son. You hear me?",
        R + ": I will. I promise.",
        () => { e.showBanner && e.showBanner("THIRD SIGNAL SHARD", "#3ab0ff"); X.keyItem("shard3", "Signal Shard (Thalassa)", "Deep sea-blue, chipped from the Harbor Tower's heart forty years ago by Captain Delia Marsh. It flickers, faint, since the core was taken."); },
        { cam: "zib" },
        "That night, Rook's Linker buzzes. A tiny picture flickers up: their kitchen, the stove, and Mom.",
        R + ": Mom!",
        "Mom: Hi, sweetheart! Oh, look at you! You're sunburned! Are you wearing your hat? You're not wearing your hat. Rook, wear your hat.",
        R + ": I'm wearing it, Mom, Zib's sitting on it.",
        Z + ": Bip!",
        "DX-4: HELLO, ROOK. YOUR MOTHER ASKED ME TO REPAIR THE TOASTER. I HAVE INSTEAD IMPROVED IT. IT NOW HAS ELEVEN SETTINGS.",
        "Mom: It used to have three. I just wanted it to have three.",
        "DX-4: SETTING ELEVEN IS CALLED 'VOLCANO.' I DO NOT RECOMMEND IT.",
        "Mom: Guess who came by today? Sola Reyes. She came all the way back to Dustmere, just for the day, asking all sorts of questions about her dad. Where he used to go. Who he used to talk to.",
        "Mom: She seemed so tired, honey. Tired all the way through. Like she hadn't slept in a week. And so alone.",
        R + ": Mom. Did she say where she was going next?",
        "Mom: She did, actually. It was a bit strange. She said she was going to the Deep Sea Ferry dock, in Port Ember. Tomorrow night. She said somebody was meeting her there.",
      ], () => { set("done"); X.showEnd("THALASSA", "Three Signal Shards. One of them flickering. Next: Neonis, the city world, where something is broadcasting on Zib's frequency.", () => X.toWorld("neonis")); });
    };

    /* ---------- the poll: walk-up triggers ---------- */
    const near = (sc, x, z, r) => X.dist(at(sc, x, z, false)) < r && !!s.CH[sc];
    const tick = () => {
      const k = ST.step;
      if (k === "pier" && near("TA", 14.5, 13.5, 4.5)) return ghostArrives();
      if (k === "ghost" && !F.hold && near("TH", 17.6, 17.2, 3.5)) return boardShip();
      if (k === "dawn" && near("TG", 20, 8, 4)) return freeChirp();
      if (k === "road" && near("TD", 14.5, 26.5, 4)) return blockade();
      if (k === "round") goal();
    };
    // the road through the blockade is shut while the grunts hold it
    X.blocked.push((x, z) => { if (ST.step !== "ladder" || !s.CH.TD) return false; const r = s.res.rects.TD; const a = s.res.unwarp(r[0] + 11.5, r[1] + 18.8), b = s.res.unwarp(r[0] + 18.5, r[1] + 22.8); return x > Math.min(a[0], b[0]) && x < Math.max(a[0], b[0]) && z > Math.min(a[1], b[1]) && z < Math.max(a[1], b[1]); });

    /* ---------- ships: circling out at sea, then the attack ---------- */
    const shipTick = (dt) => {
      const top = towerTop(); shipT += dt;
      const c = top.clone().add(new V(-6, 0, -46)); fleet.visible = !past("vex") && !(shipMode === "gone");
      ships.forEach((g, i) => {
        if (shipMode === "circle") { const a = shipT * 0.08 + i * 1.57, r = i === 3 ? 14 : 22; g.position.set(c.x + Math.cos(a) * r, 18 + i, c.z + Math.sin(a) * r * 0.6); g.rotation.y = -a; }
        else if (shipMode === "attack") { const tgt = i === 3 ? top.clone().add(new V(0, 44, 0)) : top.clone().add(new V(Math.cos(i * 2.1) * 26, 20 + i * 2, Math.sin(i * 2.1) * 26)); g.position.lerp(tgt, Math.min(1, dt * 0.35)); g.lookAt(tgt.x, g.position.y, tgt.z); }
        else if (shipMode === "hover" || shipMode === "lift") { const tgt = i === 3 ? top.clone().add(new V(0, 44, 0)) : top.clone().add(new V(Math.cos(i * 2.1 + shipT * 0.2) * 26, 20 + i * 2, Math.sin(i * 2.1 + shipT * 0.2) * 26)); g.position.lerp(tgt, Math.min(1, dt * 0.8)); if (i === 3) g.rotation.y += dt * 0.05; }
        else if (shipMode === "leave") { g.position.add(new V(0, dt * 3, -dt * 30)); if (shipT > 9) shipMode = "gone"; }
      });
      const cm = findCore();
      if (cm) {
        if (F.coreGone && coreLift === 0) cm.visible = false;
        else if (coreLift > 0 && coreLift < 1) { coreLift = Math.min(1, coreLift + dt * 0.12); cm.position.y += dt * 2.2; if (coreLift >= 1) cm.visible = false; }
      }
      const sc0 = ACT.scaf; if (sc0 && sc0.G) sc0.G.traverse((o) => { if (o.name === "chain") o.visible = !past("vex") && (shipMode === "hover" || shipMode === "lift"); });
    };
    ACT.cKit.tick = () => {};
    actor("shipTicker", { build: () => new K.G(), scene: "*", pos: () => P.position.clone(), show: () => false, tick: (a, dt) => shipTick(dt) });

    const start = () => {
      if (past("vex") || F.coreGone) shipMode = "gone"; else if (is("road", "ladder")) shipMode = "attack"; else if (is("vex")) shipMode = "hover";
      if (is("dawn")) X.follow("chirp", true);
      if (!ST.step) { ST.step = "arrive"; X.save(); return arrive(); }
      if (is("arrive")) return arrive();
      if (is("vex")) { X.tp(at("TD", 21, 12)); return vexScene(); }
      if (is("done")) return objective("");
      goal();
    };
    const items = () => {
      if (F.hold) { X.keyItem("note", "Yellow blanket note", "For the little one, so it's not cold on the trip. I'm sorry. I'm really sorry. -S. Found in the ghost ship's last cage."); X.keyItem("logbook", "Helix logbook", "'Cargo delivered. All captured Alienmon transferred to the Station. Vessel to be abandoned.' Approved. Admin V."); }
      if (past("keeper")) X.keyItem("shard3", "Signal Shard (Thalassa)", "Deep sea-blue, chipped from the Harbor Tower's heart forty years ago by Captain Delia Marsh. It flickers, faint, since the core was taken.");
    };
    return { start, tick, items, resume: goal };
  };
})();

/* =====================================================================================================
   NEONIS (book ch. 20-22): Dr. Vashti's lab, the Glitchbug parade, DJ Static's dishes, the voice on the radio, Battle Night
   ===================================================================================================== */
(function () {
  "use strict";
  window.STORY3_WORLDS.neonis = function (X) {
    const { s, e, K, V, ST, at, actor, ACT, play, pause, objective, blackout, mesh, mat, inPlace } = X;
    const F = ST.flags, P = s.P;
    const R = "Rook", KT = "Kit", Z = "Zib", VA = "Dr. Vashti", SN = "Strand", ST_ = "DJ Static", LK = "Linker";
    X.species("Glitchbug", { t: ["Volt", "Swarm"], s: [48, 60, 46, 72, 50, 98], m: "lo_tiktrill", h: 0.4, st: 1 });
    X.species("Boombastadon", { t: ["Sonic"], s: [125, 96, 112, 72, 86, 34], m: "lo_gongorr", h: 1.3, st: 2 });
    X.species("Mycelith", { t: ["Bio"], s: [86, 72, 92, 70, 92, 46], m: "lo_mycora", h: 1.1, st: 2 });
    const steps = ["arrive", "compass", "bugs", "gather", "garden", "dusk", "squawk", "follow", "dishes", "spire", "crown", "done"];
    const past = (k) => steps.indexOf(ST.step) > steps.indexOf(k);
    const is = (...k) => k.includes(ST.step);
    const set = (k) => { ST.step = k; X.save(); goal(); };
    const pl = () => s.placeAt(P.position.x, P.position.z) || "";

    /* ---------- props ---------- */
    const crates = () => {
      const G = new K.G(), w = mat("#e9eef4", 0.03, { metalness: 0.3, roughness: 0.4 });
      for (const [x, z, y, r] of [[0, 0, 0, 0], [1.25, 0.1, 0, 0.2], [0.6, -1.1, 0, -0.3], [0.3, -0.2, 0.95, 0.1]]) { const c = mesh(new K.Box(1.1, 0.9, 0.9), w, x, y + 0.45, z, G); c.rotation.y = r; mesh(new K.Box(1.12, 0.12, 0.92), mat("#ff7a1a", 0.6), x, y + 0.62, z, G).rotation.y = r; }
      const lid = mesh(new K.Box(1.1, 0.06, 0.9), mat("#2a2420", 0.02), 0.3, 1.9, -0.65, G); lid.rotation.x = -1.3; // burst open, blackened
      mesh(new K.Sph(0.5, 10, 8), mat("#7af0ff", 1.4, { transparent: true, opacity: 0.25, depthWrite: false }), 0.3, 1.6, -0.2, G);
      return G;
    };
    const squawk = () => {
      const G = new K.G(), m = mat("#c8ccd6", 0.05, { metalness: 0.75, roughness: 0.3 });
      mesh(new K.Box(0.42, 0.36, 0.26), m, 0, 0, 0, G);
      mesh(new K.Circ(0.13, 24), mat("#20222a", 0.02), 0, 0, 0.131, G);
      for (let r = 0.04; r < 0.13; r += 0.03) mesh(new K.Tor(r, 0.006, 4, 20), mat("#5a5e6a", 0.05, { metalness: 0.8 }), 0, 0, 0.133, G);
      for (const sx of [-0.06, 0.06]) mesh(new K.Sph(0.022, 8, 6), mat("#7aff9a", 2.2), sx, 0.12, 0.131, G);
      const an = mesh(new K.Cyl(0.006, 0.006, 0.42, 5), m, 0.12, 0.38, 0, G); an.rotation.z = -0.25;
      mesh(new K.Sph(0.025, 8, 6), mat("#ff3a5a", 2.4), 0.17, 0.59, 0, G);
      for (const sx of [-1, 1]) { const w = mesh(new K.Box(0.18, 0.02, 0.12), mat("#9aa0ae", 0.2, { metalness: 0.6 }), sx * 0.28, 0.06, 0, G); w.rotation.z = sx * 0.4; }
      return G;
    };
    const drone = () => {
      const G = new K.G(); mesh(new K.Sph(0.32, 18, 12), mat("#eef2f6", 0.05, { metalness: 0.3, roughness: 0.3 }), 0, 0, 0, G);
      mesh(new K.Sph(0.1, 10, 8), mat("#ff2a2a", 2.6), 0, 0, 0.29, G); const t = mesh(new K.Tor(0.33, 0.03, 6, 24), mat("#ff7a1a", 0.7), 0, 0, 0, G); t.rotation.x = Math.PI / 2;
      const arm = mesh(new K.Cyl(0.02, 0.02, 0.6, 5), mat("#8a8e98", 0.05, { metalness: 0.8 }), 0, -0.35, 0.2, G); arm.rotation.x = 0.6;
      return G;
    };
    const fixPoint = () => { const G = new K.G(); for (let i = 0; i < 4; i++) { const sp = mesh(new K.Sph(0.04, 6, 4), mat("#ffd23a", 3), Math.cos(i * 1.6) * 0.25, 0.8 + i * 0.12, Math.sin(i * 1.6) * 0.25, G); sp.name = "spark"; } return G; };
    const sealVision = () => { // the picture Zib throws into the sky: the sun, fourteen worlds, eight towers joined into a lock
      const G = new K.G(), add = new K.Basic({ color: "#ffd860", transparent: true, opacity: 0.9, blending: 2, depthWrite: false, side: 2 });
      mesh(new K.Sph(1.6, 24, 16), new K.Basic({ color: "#ffcc40", transparent: true, opacity: 0.95, blending: 2, depthWrite: false }), 0, 0, 0, G);
      const cols = ["#d8502a", "#9aa4b0", "#7ad06a", "#3ab0ff", "#ffe23a", "#c8a8ff", "#ff8ad8", "#5af0d0", "#ff9a3a", "#a0c0ff", "#ffffff", "#8aff7a", "#ffb0b0", "#c0c0ff"];
      for (let i = 0; i < 14; i++) { const r = 3 + i * 0.75, a = i * 2.4; const o = mesh(new K.Tor(r, 0.015, 4, 96), new K.Basic({ color: "#8ab8ff", transparent: true, opacity: 0.35, blending: 2, depthWrite: false }), 0, 0, 0, G); o.rotation.x = Math.PI / 2; mesh(new K.Sph(0.28 + (i % 3) * 0.08, 12, 8), new K.Basic({ color: cols[i], transparent: true, opacity: 0.95, blending: 2, depthWrite: false }), Math.cos(a) * r, 0, Math.sin(a) * r, G); }
      const R0 = 9, pts = []; for (let i = 0; i < 8; i++) { const a = (i / 8) * 6.283 + 0.2; pts.push([Math.cos(a) * R0, Math.sin(a) * R0]); }
      const bar = (x0, z0, x1, z1, op) => { const L = Math.hypot(x1 - x0, z1 - z0); const b = mesh(new K.Box(L, 0.08, 0.08), new K.Basic({ color: "#ffe28a", transparent: true, opacity: op, blending: 2, depthWrite: false }), (x0 + x1) / 2, 0.05, (z0 + z1) / 2, G); b.rotation.y = -Math.atan2(z1 - z0, x1 - x0); b.name = "line"; b.visible = false; return b; };
      pts.forEach(([x, z], i) => { const tw = mesh(new K.Sph(0.42, 12, 8), add.clone(), x, 0.1, z, G); tw.name = "tower"; tw.visible = false; if (i === 2) tw.material.opacity = 0.35; const [x1, z1] = pts[(i + 1) % 8]; bar(x, z, x1, z1, i === 1 || i === 2 ? 0.3 : 0.85); bar(x, z, 0, 0, i === 2 ? 0.3 : 0.7); });
      G.rotation.x = -1.15; return G;
    };

    /* ---------- people and Alienmon ---------- */
    X.companion("cKit", { name: "Kit", model: "n2_story_kit", h: 1.55, nobub: true }, () => true);
    X.companion("cMyc", { name: "Mycelith", mon: "Mycelith", h: 1.1, nobub: true }, () => true);
    X.companion("cVash", { name: VA, model: "d004_dr_imogen_vashti", h: 1.66, nobub: true }, () => is("squawk", "follow", "dishes", "spire") && !pl().startsWith("neonLab"));
    actor("vashti", { name: VA, model: "d004_dr_imogen_vashti", h: 1.66, scene: "neonLab", pos: () => at("neonLab", 12, 12.8), show: () => !past("dusk") || is("dusk"), talk: () => vashTalk(), mark: () => is("compass", "dusk") });
    actor("crates", { build: crates, scene: "N4", pos: () => at("N4", 18.6, 19.4, false), show: () => !past("garden") });
    const BUGS = [[11.5, 12.2], [19.2, 12.6], [22.6, 16.6], [19.4, 21.4], [12.2, 21.2], [8.4, 16.2], [15.2, 25.4], [25.2, 21.6]];
    BUGS.forEach(([x, z], i) => actor("gb" + i, { name: "", mon: "Glitchbug", h: 0.4, fly: 0.7 + (i % 3) * 0.4, scene: "*", noface: true, pos: () => (F["g" + i] ? P.position.clone() : at("N4", x, z)), show: () => (is("bugs", "gather") || (is("garden") && !F.released)) && (i === 0 || !!F["g" + i] || is("bugs", "gather")), pkey: () => (F["g" + i] ? 1 : 0), tick: (a, dt) => { if (a.G && a.G.visible && !X.followers.includes(a.id)) { a.G.position.y = a.base.y + Math.sin(X.T * 6 + i) * 0.12; a.G.rotation.y += dt * 2; } } }));
    actor("lumiN", { name: "Lumislug", mon: "Lumislug", h: 0.4, scene: "*", noface: true, pkey: () => (F.lumi ? 1 : 0), pos: () => P.position.clone(), show: () => is("gather", "garden") && !F.released, onSpawn: (a) => { const l = new K.PL("#a8ff60", 2.2, 9, 2); l.position.y = 0.5; a.G.add(l); } });
    actor("strand", { name: SN, model: "n2_story_strand", h: 1.62, scene: "*", noface: false, pkey: () => (F.strandOn ? 1 : 0), pos: () => P.position.clone().add(new V(-3.2, 0, -2.2)), show: () => !!F.strandOn });
    actor("engineer", { name: "Old engineer", model: "n2_technician", h: 1.7, scene: "N3", pos: () => at("N3", 12.6, 12.4), show: () => is("garden") });
    actor("squawk", { name: "Squawkbox", build: squawk, scene: "*", fly: 1.2, noface: false, pkey: () => (F.sqOn ? 1 : 0) + pl(), pos: () => P.position.clone().add(new V(0, 0, 1.6)), show: () => is("follow") || (is("squawk") && !!F.sqOn) || (is("dishes") && pl() === "staticRoof") });
    actor("static", { name: ST_, model: "n2_musician", h: 1.72, scene: "*", pos: () => (pl() === "voltCrown" ? at("voltCrown", 12, 10.5) : at("staticRoof", 6.5, 5.4)), show: () => (pl() === "staticRoof" && is("follow", "dishes", "spire")) || (pl() === "voltCrown" && is("crown", "done")), pkey: pl, talk: () => staticTalk(), mark: () => is("crown") || (is("follow") && pl() === "staticRoof") });
    actor("boom", { name: "Boombastadon", mon: "Boombastadon", h: 2.6, scale: 2.2, scene: "voltCrown", noface: false, pkey: () => (F.boomOut ? 1 : 0), pos: () => at("voltCrown", 12, 7.6), show: () => is("crown", "done") && !!F.boomOut });
    const DISH = [["staticRoof", 21.8, 5.0, "the dish by the water tank"], ["staticRoof", 27.8, 17.2, "the dish on the far roof"], ["staticRoof", 36.8, 16.0, "the tall antenna"], ["staticRoof", 38, 9, "the biggest dish, pointing at the Voltspire"]];
    DISH.forEach(([sc, x, z, nm], i) => actor("dish" + i, { name: "Broken dish", build: fixPoint, scene: sc, pos: () => at(sc, x, z), show: () => is("dishes") && !F["d" + i], talk: () => fixDish(i), verb: () => (i === (F.dn || 0) ? "Fix " + nm : "Fix " + nm), mark: () => i === (F.dn || 0), tick: (a, dt) => { if (a.G && a.G.visible) a.G.children.forEach((c, k) => { c.position.y = 0.8 + ((X.T * 1.5 + k * 0.25) % 1.2); }); } }));
    for (let i = 0; i < 3; i++) actor("dr" + i, { name: "", build: drone, scene: "staticRoof", noface: true, fly: 2.4, pkey: () => (F.droneOut ? 1 : 0), pos: () => at("staticRoof", 25 + i * 1.6, 15.2 + (i % 2)), show: () => !!F.droneOut, tick: (a) => { if (a.G && a.G.visible) a.G.position.y = a.base.y + Math.sin(X.T * 3 + i) * 0.25; } });
    let vision = null, beam = null;

    /* ---------- objectives ---------- */
    const labGoal = (txt) => {
      const p = pl();
      if (p === "vashtiLobby") return objective("Take the lift up to the lab at the top of the tower", () => at("vashtiLobby", 9, 2.6));
      if (p === "neonLab") return objective("Talk to Dr. Vashti", () => at("neonLab", 12, 12.8));
      objective(txt, () => at("N4", 4.5, 11.2));
    };
    const goal = () => {
      const k = ST.step, p = pl();
      if (k === "compass") return labGoal("Follow DX-4's compass to the old glass tower in Hologram Park");
      if (k === "bugs") return objective("Go down to Hologram Park and help the Glitchbugs", () => at("N4", 16, 19.5));
      if (k === "gather") { const left = BUGS.map((b, i) => i).filter((i) => !F["g" + i]); if (!left.length) return; let best = left[0], bd = 1e9; for (const i of left) { const d = X.dist(at("N4", BUGS[i][0], BUGS[i][1], false)); if (d < bd) { bd = d; best = i; } } return objective("Walk Lumislug's glow past every Glitchbug (" + (8 - left.length) + " of 8)", () => at("N4", BUGS[best][0], BUGS[best][1])); }
      if (k === "garden") return objective("Lead the Glitchbugs to the Grid Gardens (the Power Station)", () => at("N3", 12, 13.5));
      if (k === "dusk") return labGoal("It's getting dark. Go back to Dr. Vashti's lab (Hologram Park)");
      if (k === "squawk") return p === "neonLab" || p === "vashtiLobby" ? objective("Go out into the city. Dr. Vashti says Static will find you", () => (p === "neonLab" ? at("neonLab", 11.5, 17.6) : at("vashtiLobby", 8.5, 12.4))) : objective("");
      if (k === "follow") { if (p === "studioStairs") return objective("Climb to the rooftop studio", () => at("studioStairs", 11, 6.8)); if (p === "staticRoof") return objective("Meet DJ Static at the deck", () => at("staticRoof", 6.5, 6.2)); return objective("Follow the Squawkbox to Quiet Court (the Recording Studio)", () => at("NQ", 5.44, 9.6)); }
      if (k === "dishes") { const i = F.dn || 0; if (p !== "staticRoof") return objective("Go back up to DJ Static's rooftops (Quiet Court)", () => at("NQ", 5.44, 9.6)); return objective("Fix the broken dishes (" + i + " of " + DISH.length + "): " + DISH[i][3], () => at(DISH[i][0], DISH[i][1], DISH[i][2])); }
      if (k === "spire") { if (p === "voltHall") return objective("Ride up to the crown of the Voltspire", () => at("voltHall", 16, 3.6)); return objective("Go to the Voltspire for Battle Night (Voltspire Plaza)", () => at("NV", 18, 16.6)); }
      if (k === "crown") return objective("Battle Keeper DJ Static", () => at("voltCrown", 12, 12.6));
      objective("");
    };

    /* ---------- scenes ---------- */
    const arrive = () => play([
      () => X.titleCard(20, "City of Lights"), pause(3.4),
      { cam: "zib" },
      "Before the sun came up, Rook wrote a name on the wing of Fenna's paper lantern, in his best handwriting. Sola. Then he set it on the water at the end of the pier, and watched the tide carry it out to sea.",
      R + ": We're going to find you. I promise. And when we do, I'm going to tell you you're wrong. You don't have to do it alone. Nobody does.",
      R + ": I'm sorry, Zib. About last night. I know you wanted to go with her. But I couldn't lose you. You're one of my best friends in the whole universe.",
      () => X.mood("blue"), Z + ": ...Bip.",
      "It was DX-4's compass that told them where to go next. The needle was swinging between Zib on Rook's cap and somewhere else. Somewhere up, past the pink sky, out among the stars.",
      KT + ": Neonis. The city world. There's a Relay Tower there too. And a Keeper. DJ Static. Something on Neonis is broadcasting on Zib's frequency. Something big.",
      R + ": Then that's where we're going.",
      () => X.mood("rainbow"),
      "Neonis is a city that never goes dark. Towers scrape the clouds, every one covered in moving pictures. Trains float between them on ribbons of light. Music thumps from every window. And it is raining, a soft warm rain, every drop glowing pink and blue and gold.",
      R + ": Whoa.",
      KT + ": WHOA.",
      Z + ": BIP!",
      "The compass needle swings and swings, leading them on. Toward a park with a purple fountain, and an old glass tower with no holograms on it at all.",
    ], () => { X.mood("gold"); set("compass"); });
    const vashTalk = () => {
      if (is("compass")) return reunion();
      if (is("dusk")) return dusk();
      play([{ cam: "vashti" }, VA + ": " + (past("dusk") ? "Go on, you two. Static will find you." : "Somebody's got to help those poor things. Go on.")]);
    };
    const reunion = () => play([{ cam: "vashti" },
      "A round room full of bookshelves and star charts and jars of glowing things and brass gadgets that tick and whir. And in the middle of it all, with a pencil in her mouth and two more stuck in her messy silver bun, is a familiar face.",
      R + ": DR. VASHTI!",
      VA + ": Rook? ROOK!",
      "She hugs him so hard his cap falls off. Her lab coat smells exactly like the Observatory, like old books and dust and peppermint.",
      VA + ": Look at you! You've grown! You're taller! You're sunburned! You've got sea salt in your hair! Oh! Oh, Rook! He evolved! Plazmet! Oh, he's magnificent!",
      R + ": This is Kit. Kit Briggs. Kit's my best friend. And that's Mycelith. It used to be Sporix. The Sporix from your Observatory.",
      { cam: "cMyc" }, "Mycelith gives a slow, gentle bow, its great cap tipping forward, the way you would bow to someone you remembered.",
      { cam: "vashti" },
      VA + ": Oh, my goodness. Oh, my little one. You found somebody. Kit. Thank you. Thank you for looking at it.",
      R + ": But what are you DOING here? I thought you never left the Observatory!",
      VA + ": I didn't. Not for twenty years. But after you left, the signal from the crater started to change. It's been getting stronger, Rook. Much stronger. Every day.",
      VA + ": I couldn't measure it properly from Dustara anymore. It was too close. Too loud. Neonis isn't very quiet. But it has wonderful equipment.",
      "On her machine, a single green line goes up and down, up and down, like a heartbeat. Faster than Rook remembers it.",
      VA + ": Hello, Zib.",
      () => X.mood("blue"), Z + ": Bip.",
      "Her hand moves, just slightly, toward the deepest pocket of her lab coat. The one she never lets anybody see inside. Then it stops.",
      () => { X.mood("red"); document.body.style.filter = "hue-rotate(120deg) contrast(1.4)"; setTimeout(() => (document.body.style.filter = ""), 900); },
      "And just then, the whole city goes BZZZZZZZZZZZT. Every light in the lab flickers. Out the round window, the giant dancing robot starts dancing backwards. The floating trains stop in midair.",
      "In the park at the bottom of the tower, beside the purple fountain, a white Helix transport is sitting on the grass. The top crate at the bottom of its ramp has burst open from the inside.",
      "And pouring out of it are bugs. Hundreds of them. Stubby and striped yellow and black, with huge cyan eyes and crackling antennae. And everywhere they land, the electricity goes haywire.",
      KT + ": Glitchbugs. Volt and Swarm types. They scramble any screen they touch. Helix had them packed in crates. That many, squashed in together, scared... their static must have built up until the locks blew.",
      "Four grunts in white jumpsuits move through the middle of it, netting Glitchbugs and slinging them up the ramp like bags of laundry. Then one touches his helmet, draws a circle in the air, and they all just walk back up the ramp. The transport lifts off and climbs away.",
      R + ": They're just leaving them.",
      VA + ": They took what they needed. Whatever's left over is somebody else's problem.",
      KT + ": Well. Somebody's got to fix this.",
    ], () => { X.mood("gold"); set("bugs"); });
    const bugsScene = () => play([{ cam: "crates" },
      "Glitchbugs are fast. Really fast. Every time Rook gets close to one, it zaps him. Just a little tingly zap, like a static shock off a doorknob. But it makes his hair stand straight up.",
      "Plazmet chases them, and a whole cloud of them turns on him at once. ZZZZZRAKK! His flame goes from gold to blue to a sputtering gray, and he drops onto the wet pavement. He sneezes. A tiny puff of fire, very indignant.",
      R + ": Okay. Okay. Careful. They're scared, not mean.",
      { cam: "cMyc" }, "Mycelith spreads its long fibers out like a net and catches dozens at once, until they all zap it at the same time. KRZZZT! Its whole cap stands up on end, like Rook's hair.",
      { cam: "cKit" },
      KT + ": They're bugs. Bugs like light. Rook! Lumislug!",
      () => { F.lumi = 1; }, "Lumislug slides out onto the wet pavement and turns its glow all the way up, bright as a little lime-green moon. Every Glitchbug in the park stops. Their antennae swivel.",
      R + ": KIT. You are a GENIUS.",
      "Now all they have to do is walk Lumislug very, very slowly past every single one of them.",
    ], () => set("gather"));
    const strandScene = () => play([
      () => { F.strandOn = 1; X.mood("red"); }, { cam: "strand" },
      "It is the slowest parade in the history of Neonis. But street by street, the lights go back to normal. And somebody falls into step behind them. A man in a plain gray rain jacket with the hood up.",
      R + ": Strand.",
      SN + ": I'm not here for him. I'm not here for anything. I saw your ship come in. I just... I told them the crates were too full. Nobody listens to Second Class.",
      R + ": Where is she? Where's Sola?",
      SN + ": She's safe. She's at the Station. They gave her a room with a big window. She's... she's safe. For now.",
      R + ": What does that mean? 'For now'?",
      "On Strand's wrist, a Linker buzzes. PELL. A voice comes out of it, small and flat and perfectly calm.",
      "Pell (Linker): Strand. North pad. Four minutes. Whatever you're doing, finish it.",
      SN + ": I'm sorry. I'm sorry. I can't.",
      () => { F.strandOn = 0; X.mood("gold"); },
      "He turns and walks back into the alley, fast, with his head down, and the glittering rain closes behind him like a curtain.",
      KT + ": The Grid Gardens. The city's oldest power station. Wild Glitchbugs have lived there forever, eating the extra sparks. That's where they'd want to go.",
    ], () => set("garden"));
    const garden = () => play([{ cam: "engineer" },
      "Old engineer: Well, look at that. A slug wearing a coat of Glitchbugs. This is exactly where they'd have wanted to go, if Helix hadn't caught them in the first place.",
      () => { F.released = 1; for (let i = 1; i < 8; i++) { const a = ACT["gb" + i]; X.follow("gb" + i, false); if (a.G) { const b = a.G.position.clone(); let t = 0; const iv = setInterval(() => { t += 0.05; if (!a.G) return clearInterval(iv); a.G.position.set(b.x + Math.sin(t * 3 + i) * t, b.y + t * 3, b.z + Math.cos(t * 3 + i) * t); if (t > 3) { clearInterval(iv); a.G.visible = false; } }, 50); } } },
      "One by one, the Glitchbugs drift off Lumislug's back and float up into the crackling towers and disappear into the sparks, chirping happily. All except one.",
      { cam: "gb0" },
      "The littlest one. Smaller than the others, with a slightly crooked antenna and a mischievous gleam in its eye. All afternoon it has been following Rook. And every time it got close, it zapped him. Right on the top of his cap.",
      R + ": Don't you dare.",
      () => X.cry("skitterbit"), "Zzzt. Right on his cap.",
      () => X.mood("red"), Z + ": BIP!",
      R + ": You want to come with us. Don't you? That's why you keep zapping me. You've been trying to get my attention all day.",
      R + ": I like this one. Want to join the team? You'll have to stop zapping Zib, though.",
      () => X.cry("skitterbit"), "The Glitchbug considers this. Then it zaps Zib, very gently, on the edge of his saucer. And flies straight into the cyan beam.",
      () => { X.mood("rainbow"); X.follow("gb0", false); F.bug = 1; X.give("Glitchbug", X.lvl(16), "Glitchbug"); const a = ACT.gb0; if (a.G) a.G.visible = false; },
      LK + ": GLITCHBUG. PARTNER CONFIRMED.",
      R + ": Welcome to the team, Glitchbug.",
      () => X.mood("gold"), Z + ": Bip.",
    ], () => { X.follow("lumiN", false); set("dusk"); });
    const dusk = () => play([
      () => X.s.setNight && X.s.setNight(true), { cam: "vashti" },
      "It is dark by the time they get back to the lab. Dr. Vashti is standing at the window with her back to them. Very still. She points at the tallest tower in the whole city, a great spiraling needle of glass and silver.",
      VA + ": The Voltspire. The Neonis Relay Tower.",
      "Every screen on every building in the whole city flickers. And on every single one of them, a face appears. Big sparkly sunglasses, enormous headphones, and hair that stands straight up like a lightning bolt.",
      ST_ + ": GOOD EVENING, NEONIS! You're listening to the one, the only, the most illegal voice on the airwaves, DJ STATIC! And tonight, my beautiful glowing city, I'm gonna tell you the truth about that pulse coming out of the Starfall Crater, and what Helix doesn't want you to...",
      () => X.mood("dim"), "BZZZZT. Every screen goes black. The silence is enormous.",
      VA + ": That was a Helix jammer. They're cutting Static off. Children, I think they're coming for this tower next.",
      () => X.titleCard(21, "Pirate Radio"), pause(3.4),
      blackout(() => X.s.setNight && X.s.setNight(false), 1200),
      "The next morning, everyone in Neonis is talking about DJ Static. The noodle seller. The kids at the arcade. Two old ladies on a floating train, arguing so loudly that their fluffy pink Alienmon covers its ears.",
      KT + ": Static's been on the radio every night for fifteen years. Music, news, battle results, all of it. And Static's the Keeper here, too. The Keeper of the Voltspire.",
      VA + ": And lately, Static is the only one on any channel in the whole Kessler system who's been talking about the pulse from the Starfall Crater.",
      R + ": So how do we find Static?",
      VA + ": Oh, that's easy. We let Static find us.",
    ], () => { X.mood("gold"); set("squawk"); });
    const squawkScene = () => play([
      () => { F.sqOn = 1; }, { cam: "squawk" },
      "They have only been walking for ten minutes when a little Alienmon comes zooming down out of the sky and stops in front of them, hovering at the height of Rook's nose. It looks like a tiny flying radio, square and silver, with a round speaker for a face and a long wobbly antenna.",
      "It beeps three times, very fast, and a voice comes crackling out of its speaker-face.",
      "Squawkbox: Kshhh. Hey there, little dudes. Kshhh. Heard about the Glitchbug parade yesterday. Heard about a kid with a fire-comet and a saucer on his hat. Kshhh. Follow the Squawkbox. And for the love of good music, don't let anybody see you.",
    ], () => { X.follow("squawk", true); set("follow"); });
    const staticMeet = () => play([{ cam: "static" },
      "A shack on the very edge of a very tall rooftop, covered in antennas, big ones and small ones, bent ones and straight ones, like a bad haircut. A hand-painted sign on the door says: ON AIR. (OR SHOULD BE.)",
      ST_ + ": Well, come on in, then! Don't just stand there! You're letting the quiet in!",
      "Spiky hair bleached white at the tips. Enormous headphones. Sparkly sunglasses, even though it's dim. A jacket covered in patches and pins and little flashing lights. And a grin so wide it lights up the roof all by itself.",
      ST_ + ": So YOU'RE the fire-comet kid. And YOU'RE the engineer. And you are the famous Dr. Imogen Vashti, who never, ever leaves her Observatory, except apparently she does now. Big week for surprises.",
      ST_ + ": And that must be the little guy who's been making my dishes sing.",
      R + ": Your dishes?",
      ST_ + ": My show goes out to all fourteen worlds. Every night. Dishes, hundreds of them, on every rooftop in this city. About three weeks ago, those dishes started catching something else. A pulse. Coming from the Starfall Crater.",
      ST_ + ": And every once in a while, when it pulses, it sounds like... like a little bip.",
      () => X.mood("blue"),
      ST_ + ": So I started talking about it. On the air. Every night. Because nobody else was. And that's when Helix started breaking my dishes.",
      ST_ + ": Last night they got the big ones. The ones that connect to the Voltspire. I've got a show to do tonight, and I've got no way to send it. They've shut me up. Nobody shuts me up.",
      KT + ": I can fix dishes.",
      "Static gives them a map, scribbled on the back of a record sleeve, showing every broken dish in the city. Twenty-three of them, in a great zigzag across the rooftops, all the way to the foot of the Voltspire.",
    ], () => { X.mood("gold"); F.dn = 0; set("dishes"); });
    const staticTalk = () => {
      if (is("follow") && pl() === "staticRoof") return staticMeet();
      if (is("crown")) return crownFight(true);
      play([{ cam: "static" }, ST_ + ": " + (is("dishes") ? "Twenty-three dishes, kids. Every one of them matters." : past("crown") ? "Now THAT is teamwork, kid." : "Battle Night, fire-comet kid. Top of the Voltspire. Don't be late!")]);
    };
    const fixDish = (i) => {
      const n = F.dn || 0;
      if (i !== n) return play([{ cam: "cKit" }, KT + ": That one's next on the map, but let's go in order. " + DISH[n][3][0].toUpperCase() + DISH[n][3].slice(1) + " first."]);
      const done = () => { F["d" + i] = 1; F.dn = i + 1; X.save(); goal(); };
      if (i === 0) return play([{ cam: "dish0" },
        "At every broken dish, they all have a job. Kit fixes. Kit tightens bolts and splices wires and bends bent antennas back into shape, humming the whole time.",
        "But even fixed, the dish just sits there, cold and dead, because the power has been cut for so long. So Rook lets Glitchbug out, and points.",
        () => X.cry("skitterbit"), "ZZZZT! The dish crackles, and sparks, and hums, and comes back to life. Its little red light blinks on, and it swivels around all on its own and points toward the Voltspire.",
        () => X.mood("red"), "Glitchbug makes a happy popcorn sound and zaps Rook's cap. Zib flashes red at it.",
      ], () => { X.mood("gold"); done(); });
      if (i === 1) return play([{ cam: "dish1" },
        () => { F.droneOut = 1; }, { cam: "dr1" },
        "Helix drones. Little white flying machines, round and humming, with one red eye and a long zapping arm. They don't buzz around like bugs. They come out of the dark in twos and threes, in straight, careful lines. Somebody, somewhere, is steering them.",
        "KZZZAKK! A red bolt hits Plazmet square. His flame goes blue and ragged, and he skids, hissing, through a puddle.",
        R + ": PLAZMET!",
        "Through the steam, Plazmet's ring flares twice. Think first. The drones have to stop and hover, just for a heartbeat, to aim.",
        R + ": Stay down. Wait till they stop. Then go.",
      ], async () => {
        const r = await X.battle({ name: "Helix drones", npc: ACT.dr1.G, team: [["Skitterdrone", X.lvl(17, 0)], ["Skitterdrone", X.lvl(17, 1)]], prize: 0, canLose: true, intro: ["Helix drones are attacking the dish!"] });
        play([{ cam: "dish1" }, r === "win" ? "The drones go spinning off into the night, sparking, and drop onto the gravel. Plazmet sinks onto Rook's shoulder, panting little puffs of steam, and sneezes." : "The drones knock Plazmet down, but Mycelith steps in front of the dish, and the drones peel away into the dark to try somewhere else.", () => { F.droneOut = 0; }, "Kit splices the last wire. Glitchbug zaps it. ZZZZT. Another dish wakes up and swings toward the Voltspire.", R + ": Whoever's steering them has plenty to spare."], done);
      });
      if (i === 2) return play([{ cam: "dish2" },
        "On the next roof, an enormous antenna, tall as a tree, cracks at the base and starts to fall. Toward the street, toward the floating trains, toward the people below.",
        { cam: "cMyc" }, "Mycelith steps forward, wraps its long rope-like arms around the antenna, and holds it. Steady and calm, its roots gripping the rooftop, while Kit welds the base back together.",
        "When Kit is done, Mycelith lets go, very slowly, and the antenna stands straight and tall all on its own.",
        blackout(() => {}, 1200),
        "The night goes on. The rain falls. They jump from rooftop to rooftop across the glowing city. Kit goes first, the toolbelt clanking. Dr. Vashti comes last, holding up the hem of her lab coat, saying 'Oh, my goodness!' every time she jumps, and somehow never once falling.",
        KT + ": That's twenty.",
        () => X.cry("skitterbit"), KT + ": Twenty-one. Twenty-two.",
        "The twenty-third dish is the last one. It's on the highest rooftop of all, the very last building before the Voltspire.",
      ], done);
      if (i === 3) return overheard(done);
    };
    const overheard = (done) => play([{ cam: "dish3" },
      "The dish is the biggest one yet, as wide as the Dandelion, curved like a giant bowl. Helix cut every single one of its wires. Kit kneels down beside it and goes to work.",
      "Dr. Vashti sits on an air vent, catching her breath, with Zib in her lap. Zib has never sat in Dr. Vashti's lap before.",
      KT + ": This is it. The last one. Ready?",
      () => X.cry("skitterbit"), "Kit plugs in the final wire. The dish crackles to life. But it doesn't swivel toward the Voltspire. It swivels up. Past the clouds. Toward the stars. And it catches something.",
      () => X.mood("dim"),
      "Helix radio: Kssshh... Station control, this is Admin office... kssh... core from Thalassa installed in Bay Seven, holding stable... ksshhhh...",
      KT + ": It's Helix. It's a Helix signal. It's coming from the Station.",
      "Sola (radio): Kssh... is he there? You said if I came... kssh... you said you'd take me to him. Is my dad there?",
      R + ": Sola.",
      "And then a man's voice answers her. The quietest voice Rook has ever heard. Gentle, almost. Smooth and soft and patient, like someone talking to a sleepy child. And it makes every hair on Rook's arms stand straight up.",
      "Thorne (radio): Patience, Miss Reyes. You'll see him very soon. Everyone will.",
      "Thorne (radio): Tell Vex the timeline holds. Phase Three begins when the eighth tower cracks.",
      "The signal goes dead. The dish swings slowly back down and points at the Voltspire, as if nothing had happened. Far below, the city glows and hums, and nobody down there has heard a thing.",
      KT + ": Who was that? Rook. Who was that?",
      { cam: "cVash" },
      "Dr. Vashti has gone white. Not pale. White as paper. Her hands are gripping Zib so tightly that he has gone still. She is afraid.",
      VA + ": That was Director Kael Thorne. The head of Helix.",
      blackout(() => X.tp(at("staticRoof", 6.5, 7.4), Math.PI), 1200),
      { cam: "static" },
      "All twenty-three dishes are glowing on Static's control panel. But when they play the recording, Static takes off the sparkly sunglasses and sits down very slowly in the spinning chair and doesn't spin it.",
      ST_ + ": The eighth tower. Cracks.",
      KT + ": Eight towers. Ferrox. Sporeholm. Thalassa. Here. And four more. And Helix is cracking them. Dad's crystal had a crack in it. Dr. Moor's had a scratch. They took Captain Marsh's away completely. What happens when they crack all eight?",
      R + ": Dr. Vashti. How did you know that was him? Nobody knows what he sounds like. Nobody's ever even seen his face. So how did you know his voice?",
      { cam: "cVash" },
      VA + ": Because I knew him, Rook. A long, long time ago.",
      "She reaches into the deepest pocket of her lab coat and closes her hand around something flat and small. But she doesn't take it out.",
      () => X.titleCard(22, "Static on the Line"), pause(3.4),
      () => X.mood("rainbow"), { cam: "static" },
      ST_ + ": GOOOOOD MORNING, NEONIS! Did you miss me? Somebody tried to switch me off last night, but guess what, my beautiful glowing city? NOBODY! SWITCHES! ME! OFF!",
      ST_ + ": They fixed every dish in the city last night, folks. All twenty-three. With their bare hands and a very cheeky Glitchbug. So tonight, live from the top of the Voltspire, broadcasting to all fourteen worlds for the first time in history... the main event is ME against HIM.",
      ST_ + ": LADIES AND GENTLEMEN, ALIENMON OF ALL AGES! TONIGHT IS... BATTLE NIGHT!",
    ], () => { X.mood("gold"); done(); X.keyItem("recording", "Static's recording", "Three voices caught by the highest dish over Quiet Court: Helix's Admin office, Sola, and Director Kael Thorne. 'Phase Three begins when the eighth tower cracks.'"); set("spire"); });
    const crownScene = () => play([
      () => X.s.setNight && X.s.setNight(true), { cam: "static" },
      "The top of the Voltspire is an arena, open to the sky, with the clouds drifting past just below the edge and the stars blazing overhead. The stands are packed. Tens of thousands of people, waving glowsticks, stamping their feet.",
      "And right above it all, floating inside a cage of silver bars, is the crystal. Shaped like a huge icicle, glowing a fierce electric yellow, crackling with little forks of lightning. It hums the same note as the Shards in Rook's satchel. Only much, much louder.",
      VA + ": Oh. Oh, it's beautiful.",
      KT + ": Static's got it guarded. Cameras, sensors, alarms. The works. Helix would have a really hard time getting to this one.",
      R + ": Good.",
      "Somewhere, Rook thinks, Mom is listening. In her kitchen in Dustmere, with flour on her nose. And Hank, in his hangar. And Captain Marsh. And maybe, in a room with a big window on a silver space station, Sola.",
      ST_ + ": LADIES AND GENTLEMEN! IT'S! BATTLE! NIGHT!",
      () => { F.boomOut = 1; }, { cam: "boom" },
      "Static's Alienmon is a speaker. It comes stomping out on four huge stumpy legs, as tall as a house, covered in round speaker cones, with two chrome tusks and a big round dial for a face. Every step makes the stage jump. THOOM.",
      LK + ": BOOMBASTADON. SONIC-TYPE. EXTREMELY LOUD.",
      R + ": No kidding.",
      ST_ + ": Fire-comet kid! Let's see what you've got!",
    ], () => crownFight(false));
    const crownFight = async (again) => {
      if (again) await new Promise((r) => play([{ cam: "boom" }, R + ": We can't win by being louder. We have to be smarter. Everybody. Together.", "Before every big boom, its dial swings right. All its speakers have to pulse together, in time. And every time the beat comes around, it stumbles, just once. A gap.", R + ": Plazmet. Not on the beat. On the gap. Wait for it."], r));
      const r = await X.battle({ name: "Keeper DJ Static", npc: ACT.static.G, team: [["Boombastadon", X.lvl(20, 2)]], prize: 2400, intro: ["Keeper DJ Static wants to battle!"], winLines: ["Plazmet goes into the gap like a key into a lock. KA-WHAMMMM. Fire bursts across every speaker cone at once.", "The Boombastadon lets out one last, long, wobbly BWAAAAAAAAAAMP. And then it sits down. Right in the middle of the stage. Like a dog sitting down when it's told to."] });
      if (r !== "win") { s.say && s.say("Think first. Lumislug's glow can blind it, Cactling can jam the dial, Glitchbug can scramble its wires. Then wait for the gap.", 5200); goal(); return; }
      F.boomWin = 1; X.save();
      play([{ cam: "static" },
        "For one second there is total silence on top of the Voltspire. Then a tiny spark drifts down out of the smoke, and Rook dives across the cracked tiles and catches it. Plazmet sneezes. Pfft. One tiny, proud spark.",
        "Then the crowd goes WILD. Glowsticks fly. Fireworks burst overhead. In the front row, a man with a beard is crying.",
        ST_ + ": Now THAT is teamwork, kid.",
        () => { e.showBanner && e.showBanner("FOURTH SIGNAL SHARD", "#ffe23a"); X.keyItem("shard4", "Signal Shard (Neonis)", "Electric yellow, like the crystal at the top of the Voltspire, crackling with tiny forks of lightning. Handed over by DJ Static on Battle Night."); },
        "It's yellow. Electric yellow, crackling with tiny forks of lightning. And when Rook takes out the other three, they all begin to hum together. A four-part chord, rich and deep, like a choir. The crowd goes quiet. They can hear it too.",
        () => { X.zib.hidden = false; X.mood("rainbow"); const c = at("voltCrown", 12, 3.6, false); vision = sealVision(); vision.position.set(c.x, c.y + 26, c.z + 4); vision.scale.setScalar(0.01); X.s.sc.add(vision); beam = mesh(new K.Cyl(0.08, 0.08, 26, 8, 1, true), new K.Basic({ color: "#9ad8ff", transparent: true, opacity: 0.6, blending: 2, depthWrite: false })); beam.position.copy(P.position).add(new V(0, 15, 0)); X.s.sc.add(beam); },
        { cam: "zib" },
        "Zib floats down off Rook's cap, down to the four Shards, and his eye begins to glow. Brighter than it ever has before. A beam shoots straight up into the night sky over the Voltspire.",
        { cam: at("voltCrown", 12, 3.6, false).add(new V(0, 22, 4)) },
        "And there, enormous, floating over the heads of all those thousands of people, is the Kessler system. The sun in the middle. Fourteen worlds around it.",
        () => { let k = 0; vision.children.filter((c) => c.name === "tower").forEach((t, i) => setTimeout(() => (t.visible = true), 300 * i)); setTimeout(() => vision.children.filter((c) => c.name === "line").forEach((l) => (l.visible = true)), 2700); },
        "On eight of those worlds, towers light up one by one. Ferrox. Sporeholm. Thalassa, faint and flickering. Neonis, blazing yellow. And four more. Then lines of light shoot out between them, and from every tower to the sun.",
        "A circle. With eight points around it. All joined together. It is the drawing on Kit's arm. And it looks exactly like a lock. The kind with a dial, that you spin around and around until it clicks.",
        { cam: "cKit" },
        KT + ": The towers. They're not just towers. They're holding something shut. All eight of them. Together. They're not towers. They're a seal.",
        "On Thalassa, the faint light pulses weakly. One line of the great lock is dimmer than all the others. Like a crack. And in Rook's head, he hears a calm, quiet voice. Phase Three begins when the eighth tower cracks.",
        () => { if (vision) { X.s.sc.remove(vision); vision = null; } if (beam) { X.s.sc.remove(beam); beam = null; } X.mood("gold"); },
        { cam: "cVash" },
        "Dr. Vashti is standing by the elevator with both hands pressed flat over her mouth, looking up at the empty sky. She doesn't say a word. Not on the ride down. Not at dinner. Not for the rest of the night.",
        blackout(() => {}, 1400),
        "Late that night, Rook wakes up on the beanbags in Static's shack. Zib is gone. There is a thin line of light under the door to the little back room.",
        "Dr. Vashti is sitting on an upturned record crate, with Zib in her lap, holding a photograph. Her thumb covers most of it. Her shoulders are shaking.",
        VA + ": I'm sorry. I'm so sorry. I should have told them. I should have told them years ago.",
        () => X.mood("gold"), "Zib's lights pulse, soft and gold, against her lab coat. Rook goes back to the beanbags and lies down, holding his satchel. Inside it, four Signal Shards are humming softly.",
      ], () => { set("done"); X.showEnd("NEONIS", "Four Signal Shards, and a lock made of eight towers. Somewhere on the Molten Frontier, a pink squid in a sailor's hat is waiting beside a round glass ferry that hasn't been allowed to dive in twenty years. Next: Glyphos.", () => X.toWorld("glyphos")); });
    };

    /* ---------- the poll ---------- */
    let lastPl = null;
    const tick = () => {
      const k = ST.step, p = pl();
      if (p !== lastPl) { lastPl = p; goal(); }
      if (vision) { vision.scale.lerp(new V(1, 1, 1), 0.2); vision.rotation.z += 0.004; }
      if (k === "bugs" && s.CH.N4 && X.dist(at("N4", 16, 18, false)) < 8) return bugsScene();
      if (k === "gather") {
        BUGS.forEach(([x, z], i) => { if (!F["g" + i] && s.CH.N4 && X.dist(at("N4", x, z, false)) < 3.6) { F["g" + i] = 1; X.cry("skitterbit"); if (!X.followers.includes("lumiN")) X.follow("lumiN", true); X.follow("gb" + i, true); X.save(); goal(); } });
        if (BUGS.every((b, i) => F["g" + i])) return strandScene();
      }
      if (k === "garden" && !F.released && s.CH.N3 && X.dist(at("N3", 12, 13.5, false)) < 5) return garden();
      if (k === "squawk" && !p && /^N/.test(s.sceneAt(P.position.x, P.position.z) || "")) return squawkScene();
      if (k === "follow" && p === "staticRoof" && X.dist(at("staticRoof", 6.5, 6.2, false)) < 6) return staticMeet();
      if (k === "spire" && p === "voltCrown") { set("crown"); return crownScene(); }
      if (k === "follow" && (p === "studioStairs" || p === "staticRoof")) X.follow("squawk", false);
    };
    const start = () => {
      if (is("gather", "garden") && !F.released) { X.follow("lumiN", true); BUGS.forEach((b, i) => F["g" + i] && X.follow("gb" + i, true)); }
      if (is("follow")) X.follow("squawk", true);
      if (!ST.step) { ST.step = "arrive"; X.save(); return arrive(); }
      if (is("arrive")) return arrive();
      goal();
    };
    const items = () => {
      if (past("dishes")) X.keyItem("recording", "Static's recording", "Three voices caught by the highest dish over Quiet Court: Helix's Admin office, Sola, and Director Kael Thorne. 'Phase Three begins when the eighth tower cracks.'");
      if (F.boomWin) X.keyItem("shard4", "Signal Shard (Neonis)", "Electric yellow, like the crystal at the top of the Voltspire, crackling with tiny forks of lightning. Handed over by DJ Static on Battle Night.");
    };
    return { start, tick, items, resume: goal };
  };
})();

/* =====================================================================================================
   GLYPHOS (book ch. 23-25): the Deep Sea Ferry, Tamsin's dig camp, the Temple of Voices, the Monolets,
   the mirror puzzle, the Chimelet, and the Murals of Ystra
   ===================================================================================================== */
(function () {
  "use strict";
  window.STORY3_WORLDS.glyphos = function (X) {
    const { s, e, K, V, ST, at, actor, ACT, play, pause, objective, blackout, mesh, mat, inPlace } = X;
    const F = ST.flags, P = s.P;
    const R = "Rook", KT = "Kit", Z = "Zib", TA = "Tamsin", SQ = "Squid Sailor", LI = "Liss", MO = "Monolets", LK = "Linker";
    X.species("Monolet", { t: ["Gravity", "Psi"], s: [96, 84, 120, 70, 92, 30], m: "lo_pebblet", h: 0.9, st: 2 });
    X.species("Chimelet", { t: ["Sonic", "Crystal"], s: [55, 40, 60, 82, 76, 70], m: "lo_blinkit", h: 0.5, st: 1 });
    X.species("Mycelith", { t: ["Bio"], s: [86, 72, 92, 70, 92, 46], m: "lo_mycora", h: 1.1, st: 2 });
    const steps = ["arrive", "camp", "temple", "maze", "mirrors", "chime", "hall", "murals", "home", "done"];
    const past = (k) => steps.indexOf(ST.step) > steps.indexOf(k);
    const is = (...k) => k.includes(ST.step);
    const set = (k) => { ST.step = k; X.save(); goal(); };
    const pl = () => s.placeAt(P.position.x, P.position.z) || "";
    const G3 = (x, z, y = 0) => { const p = at("gv3", x, z, false); p.y += y; return p; };

    /* ---------- props ---------- */
    const gold = (ei = 0.4) => mat("#e8b84a", ei, { metalness: 0.7, roughness: 0.3 });
    const glow = (c, op = 0.6) => new K.Basic({ color: c, transparent: true, opacity: op, blending: 2, depthWrite: false });
    const ferry = () => { // a big glass bubble held together with brass ribs, a brass wheelhouse and a little bell on top
      const G = new K.G();
      mesh(new K.Sph(2.6, 28, 18), new K.Mat({ color: "#d8f4ff", transparent: true, opacity: 0.22, roughness: 0.04, metalness: 0.2, depthWrite: false }), 0, 1.6, 0, G);
      for (let i = 0; i < 6; i++) { const r = mesh(new K.Tor(2.62, 0.05, 6, 48), gold(0.3), 0, 1.6, 0, G); r.rotation.y = (i / 6) * Math.PI; }
      const belt = mesh(new K.Tor(2.62, 0.08, 6, 48), gold(0.3), 0, 1.6, 0, G); belt.rotation.x = Math.PI / 2;
      mesh(new K.Cyl(2.2, 2.2, 0.12, 32), mat("#6a4a30", 0.02), 0, 0.5, 0, G);
      for (let i = 0; i < 8; i++) { const a = (i / 8) * 6.283; mesh(new K.Box(0.9, 0.18, 0.4), mat("#b0283a", 0.05), Math.cos(a) * 1.7, 0.75, Math.sin(a) * 1.7, G).rotation.y = -a; }
      mesh(new K.Cyl(0.5, 0.6, 0.6, 12), gold(0.25), 0, 4.3, 0, G); mesh(new K.Cone(0.15, 0.3, 10), gold(0.4), 0, 4.75, 0, G);
      const wheel = mesh(new K.Tor(0.32, 0.04, 6, 20), gold(0.5), 0, 4.4, 0.55, G);
      const sign = new K.G(); G.add(sign); sign.position.set(2.75, 1.2, 0); sign.rotation.y = Math.PI / 2; sign.name = "sign";
      mesh(new K.Box(1.6, 0.5, 0.06), mat("#f2e6c8", 0.05), 0, 0, 0, sign); const tail = mesh(new K.Box(1.6, 0.26, 0.06), mat("#e8c0a0", 0.05), 0, -0.4, 0, sign); tail.name = "tail";
      void wheel; return G;
    };
    const crystal = (big) => { // one of Liss's crystals: clear as water, dusty, waiting
      const G = new K.G(), m = new K.Mat({ color: "#e8f6ff", emissive: "#bfe6ff", emissiveIntensity: 0.15, transparent: true, opacity: 0.85, roughness: 0.1, metalness: 0.1 });
      const c1 = mesh(new K.Cone(0.11 * (big ? 1.4 : 1), 0.32 * (big ? 1.4 : 1), 6), m, 0, 0.16, 0, G); const c2 = mesh(new K.Cone(0.11 * (big ? 1.4 : 1), 0.18 * (big ? 1.4 : 1), 6), m, 0, -0.09, 0, G); c2.rotation.x = Math.PI;
      void c1; mesh(new K.Box(0.36, 0.36, 0.08), mat("#d8ccb0", 0.02), 0, 0.03, -0.08, G);
      const l = new K.PL("#e8f4ff", 0, 6, 2); l.name = "light"; G.add(l); G.userData.m = m; return G;
    };
    const lit = (a, k) => { if (!a || !a.G) return; const m = a.G.userData.m, l = a.G.children.find((c) => c.name === "light"); if (m) m.emissiveIntensity = 0.15 + k * 2.4; if (l) l.intensity = k * 2.2; };
    const mirror = () => { // a round silver mirror in a carved stone frame on a short pillar
      const G = new K.G(), pivot = new K.G(); pivot.name = "pivot"; G.add(pivot);
      mesh(new K.Box(0.5, 0.9, 0.5), mat("#e2d4b8", 0.02), 0, 0.45, 0, G);
      const f = mesh(new K.Tor(0.42, 0.07, 8, 28), mat("#d8c8a8", 0.03), 0, 1.4, 0, pivot); void f;
      const d = mesh(new K.Cyl(0.4, 0.4, 0.04, 28), new K.Mat({ color: "#e6eef2", metalness: 1, roughness: 0.06, emissive: "#ffffff", emissiveIntensity: 0.05 }), 0, 1.4, 0, pivot); d.rotation.x = Math.PI / 2; d.name = "disc";
      for (let k = 0; k < 6; k++) { const a = (k / 6) * 6.283; mesh(new K.Sph(0.035, 6, 4), mat("#e8b84a", 0.6), Math.cos(a) * 0.42, 1.4 + Math.sin(a) * 0.42, 0.05, pivot); }
      return G;
    };
    const wallMirror = () => { const G = mirror(); G.children.filter((c) => c.name !== "pivot").forEach((c) => (c.visible = false)); G.getObjectByName("pivot").position.y = 1.7; return G; };
    const roundDoor = () => { // the great round door, a dark crystal in its middle, hundreds of little holes round its rim like a flute
      const G = new K.G(), roll = new K.G(); roll.name = "roll"; G.add(roll);
      const st = mat("#e2d2b2", 0.03);
      const disc = mesh(new K.Cyl(1.75, 1.75, 0.5, 40), st, 0, 1.78, 0, roll); disc.rotation.x = Math.PI / 2;
      for (const r of [1.6, 1.15, 0.7]) mesh(new K.Tor(r, 0.04, 6, 48), gold(0.35), 0, 1.78, 0.27, roll);
      for (let k = 0; k < 28; k++) { const a = (k / 28) * 6.283; mesh(new K.Circ(0.05, 8), mat("#1a1208", 0), Math.cos(a) * 1.4, 1.78 + Math.sin(a) * 1.4, 0.26, roll); }
      const cm = new K.Mat({ color: "#2a2438", emissive: "#ffd860", emissiveIntensity: 0, roughness: 0.15, metalness: 0.3 });
      const c = mesh(new K.Sph(0.32, 12, 8), cm, 0, 1.78, 0.32, roll); c.scale.set(0.8, 1.2, 0.6); G.userData.cm = cm;
      mesh(new K.Box(4.4, 0.3, 0.9), st, 0, 0.15, 0, G);
      const l = new K.PL("#ffd860", 0, 9, 2); l.position.set(0, 1.8, 1); l.name = "light"; roll.add(l);
      return G;
    };
    const sunShaft = () => { const G = new K.G(); mesh(new K.Cyl(0.22, 0.32, 3.4, 16, 1, true), glow("#ffe8a0", 0.45), 0, 2.6, 0, G); mesh(new K.Circ(0.45, 20), glow("#ffe8a0", 0.7), 0, 0.03, 0, G).rotation.x = -Math.PI / 2; return G; };
    const pebbles = (G) => { // three pebbles on their rings of pink light, like tiny moons
      const ring = new K.G(); ring.name = "ring"; ring.position.y = 0.9; G.add(ring);
      for (let k = 0; k < 3; k++) { const t = mesh(new K.Tor(0.75 + k * 0.08, 0.012, 4, 40), glow("#ff8ad8", 0.7), 0, 0, 0, ring); t.rotation.x = Math.PI / 2 + (k - 1) * 0.5; t.rotation.y = k; const p = mesh(new K.Sph(0.09, 8, 6), mat("#8a7a6a", 0.05), 0.75 + k * 0.08, 0, 0, t); p.name = "peb"; }
      const crack = mesh(new K.Box(0.05, 0.6, 0.02), mat("#a85aff", 0.2), 0, 0.7, 0.42, G); crack.name = "crack";
    };
    const painting = (kind) => { // the last murals, drawn on canvas
      const c = document.createElement("canvas"); c.width = 512; c.height = 360; const g = c.getContext("2d");
      const star = (x, y, r, col) => { g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); };
      if (kind === "scouts") {
        g.fillStyle = "#0b1430"; g.fillRect(0, 0, 512, 360); for (let i = 0; i < 90; i++) star(Math.random() * 512, Math.random() * 360, Math.random() * 1.6, "#cfe0ff");
        for (let i = 0; i < 9; i++) { const x = 60 + i * 50, y = 260 - i * 18 + (i % 2) * 20; star(x, y, 9, "#ffc860"); star(x, y, 15, "rgba(255,200,96,.25)"); }
        for (let i = 0; i < 4; i++) { const x = 330 + i * 40, y = 110 - i * 14; g.fillStyle = "#e8eef6"; g.beginPath(); g.ellipse(x, y, 16, 6, 0, 0, 6.283); g.fill(); star(x, y - 2, 4, "#2ab0ff"); }
      } else if (kind === "door") {
        g.fillStyle = "#070a18"; g.fillRect(0, 0, 512, 360); for (let i = 0; i < 70; i++) star(Math.random() * 512, Math.random() * 300, Math.random() * 1.4, "#aab8e0");
        star(256, 150, 62, "#0a0610"); g.strokeStyle = "#5a4a7a"; g.lineWidth = 4; g.beginPath(); g.arc(256, 150, 62, 0, 6.283); g.stroke();
        const pts = []; for (let i = 0; i < 8; i++) { const a = (i / 8) * 6.283 - 1.57; pts.push([256 + Math.cos(a) * 110, 150 + Math.sin(a) * 110]); }
        g.strokeStyle = "rgba(255,226,138,.85)"; g.lineWidth = 2; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.stroke();
        pts.forEach(([x, y]) => { g.beginPath(); g.moveTo(x, y); g.lineTo(256, 150); g.stroke(); star(x, y, 7, "#fff2b0"); });
        g.fillStyle = "#ffd860"; g.font = "bold 26px serif"; g.textAlign = "center"; g.fillText("୧ ຫ ᩅ ඞ ୧ ⳨ ຫ", 256, 320);
      } else {
        const sky = g.createLinearGradient(0, 0, 0, 220); sky.addColorStop(0, "#0a0a24"); sky.addColorStop(1, "#3a1a3a"); g.fillStyle = sky; g.fillRect(0, 0, 512, 360);
        for (let i = 0; i < 60; i++) star(Math.random() * 512, Math.random() * 180, Math.random() * 1.4, "#e0e0ff");
        g.fillStyle = "#a8482a"; g.fillRect(0, 210, 512, 150); g.fillStyle = "#5a2a6a"; g.beginPath(); g.ellipse(256, 270, 170, 48, 0, 0, 6.283); g.fill();
        star(256, 262, 30, "#c890ff"); g.fillStyle = "#ffd860"; g.beginPath(); g.ellipse(256, 262, 22, 26, 0, 0, 6.283); g.fill(); g.fillStyle = "#e8eef6"; g.beginPath(); g.ellipse(256, 262, 12, 5, 0, 0, 6.283); g.fill(); star(256, 260, 3, "#2ab0ff");
        const kid = (x, h, col, extra) => { g.fillStyle = col; g.fillRect(x - 7, 300 - h, 14, h - 14); star(x, 300 - h - 6, 8, "#e8c8a0"); if (extra) extra(x, 300 - h - 6); };
        kid(160, 66, "#3a4a6a"); kid(200, 54, "#9a3a5a", (x, y) => { g.fillStyle = "#2a1a10"; g.fillRect(x - 10, y, 4, 22); g.fillRect(x + 6, y, 4, 22); });
        kid(312, 56, "#6a7a3a"); kid(352, 52, "#e8e8f0", (x, y) => { g.strokeStyle = "#2a2a2a"; g.lineWidth = 2; g.beginPath(); g.arc(x - 3, y + 1, 3, 0, 6.283); g.arc(x + 4, y + 1, 3, 0, 6.283); g.stroke(); star(x, y - 9, 5, "#5a4a3a"); });
      }
      const G = new K.G(); mesh(new K.Plane(2.2, 1.55), new K.Basic({ map: new K.CTex(c) }), 0, 0, 0, G); return G;
    };
    const beams = new K.G(); s.sc.add(beams);
    const seg = (a, b, col = "#ffe08a", w = 0.045) => { const d = b.clone().sub(a), L = d.length(); if (L < 0.01) return; const m = mesh(new K.Cyl(w, w, L, 6, 1, true), glow(col, 0.85)); m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(new V(0, 1, 0), d.normalize()); beams.add(m); };
    const dot = (p, col = "#ffe08a", r = 0.16) => { const m = mesh(new K.Sph(r, 10, 8), glow(col, 0.9)); m.position.copy(p); beams.add(m); };

    /* ---------- the mirror puzzle (Temple of Voices, 3F) ---------- */
    // the beam: sun shaft -> M0 -> M1 -> M2 (high on the west wall) -> M3 (behind the middle Monolet) -> the door's crystal
    const MIR = [[10.5, 7.0, 1.4], [10.5, 2.4, 1.4], [1.25, 2.4, 3.1], [4.0, 5.2, 1.4]], DOOR = [7.5, 3.75, 1.78], WANT = [2, 1, 3, 2];
    const mirP = (i) => (i < 4 ? G3(MIR[i][0], MIR[i][1], MIR[i][2]) : G3(DOOR[0], DOOR[1] + 0.35, DOOR[2]));
    const rot = (i) => F["r" + i] || 0;
    const drawBeams = () => {
      while (beams.children.length) beams.remove(beams.children[0]);
      if (pl() !== "gv3" || !past("maze") || F.doorOpen) return;
      const top = G3(MIR[0][0], MIR[0][1], 4.2); seg(top, mirP(0), "#fff0b0", 0.12);
      for (let i = 0; i < 4; i++) {
        const a = mirP(i), b = mirP(i + 1);
        if (rot(i) === WANT[i]) { seg(a, b); if (i === 3) dot(b, "#ffd860", 0.3); continue; }
        const d = b.clone().sub(a).setY(0).normalize(), k = rot(i) - WANT[i], ang = k * Math.PI / 2;
        const w = new V(d.x * Math.cos(ang) + d.z * Math.sin(ang), 0, -d.x * Math.sin(ang) + d.z * Math.cos(ang));
        const end = a.clone().addScaledVector(w, 2.4); seg(a, end); dot(end); break;
      }
    };
    const aimMirror = (a, i) => {
      if (!a || !a.G) return; const pv = a.G.getObjectByName("pivot"); if (!pv) return;
      const p = mirP(i), inn = (i === 0 ? new V(0, -1, 0) : p.clone().sub(mirP(i - 1))).setY(0), out = mirP(i + 1).sub(p).setY(0);
      if (inn.length() < 0.01) inn.copy(out).negate(); inn.normalize(); out.normalize();
      const n = out.clone().sub(inn); const base = Math.atan2(n.x, n.z);
      pv.rotation.y = base + (rot(i) - WANT[i]) * (Math.PI / 4);
    };

    /* ---------- people and Alienmon ---------- */
    X.companion("cKit", { name: "Kit", model: "n2_story_kit", h: 1.55, nobub: true }, () => true);
    X.companion("cMyc", { name: "Mycelith", mon: "Mycelith", h: 1.1, nobub: true }, () => true);
    X.companion("cTam", { name: TA, model: "d032_dust_bell_ringer", h: 1.62, nobub: true }, () => past("camp") && !is("home", "done"));
    const jetty = () => (F.jx != null ? new V(F.jx, 0, F.jz) : P.position.clone());
    const ferryPos = () => (F.fx != null ? new V(F.fx, s.groundY(F.fx, F.fz) - 0.6, F.fz) : jetty().add(new V(0, 0, -6)));
    actor("ferry", { build: ferry, scene: "*", fixed: false, noface: true, pkey: () => (F.fx != null ? 1 : 0), pos: ferryPos, show: () => F.fx != null && X.dist(ferryPos()) < 120, tick: (a) => { if (a.G && a.G.visible) a.G.position.y = a.base.y + Math.sin(X.T * 0.9) * 0.08; const t = a.G && a.G.getObjectByName("tail"); if (t) t.visible = !F.signOff; } });
    actor("sailor", { name: SQ, model: "d047_steam_coast_navigator", h: 1.68, scene: "*", pkey: () => (F.jx != null ? 1 : 0), pos: () => { const j = jetty(); const [x, z] = X.near(j.x + 1.6, j.z + 1.2); return new V(x, s.groundY(x, z), z); }, show: () => F.jx != null && X.dist(jetty()) < 90, talk: () => sailorTalk(), mark: () => is("home") });
    actor("tamsin", { name: TA, model: "d032_dust_bell_ringer", h: 1.62, scene: "YD", pos: () => at("YD", 15, 12), show: () => is("camp"), talk: () => tamsinScene(), mark: () => is("camp") });
    const DOOR9 = () => at("Y9", 15, 24.4, false);
    actor("liss0", { name: LI, build: () => crystal(true), scene: "Y9", fly: 1.5, noface: true, pos: () => at("Y9", 16.7, 24.6, false), talk: () => lissTalk(), verb: "Listen to the crystal", mark: () => is("temple"), tick: (a) => lit(a, F.lissOn ? 0.8 + Math.sin(X.T * 2) * 0.2 : 0) });
    actor("liss1", { name: LI, build: () => crystal(false), scene: "gv1", fly: 1.5, noface: true, pos: () => at("gv1", 1.4, 6.6, false), talk: () => lissTalk(1), verb: "Listen to the crystal", tick: (a) => lit(a, X.dist(a.G.position) < 4 ? 1 : 0.05) });
    actor("liss2", { name: LI, build: () => crystal(false), scene: "gv2", fly: 1.5, noface: true, pos: () => at("gv2", 16.6, 6.8, false), talk: () => lissTalk(2), verb: "Listen to the crystal", tick: (a) => lit(a, X.dist(a.G.position) < 4 ? 1 : 0.05) });
    actor("liss3", { name: LI, build: () => crystal(false), scene: "gv3", fly: 3.2, noface: true, pos: () => at("gv3", 12.9, 6.0, false), talk: () => lissTalk(3), verb: "Listen to the crystal", tick: (a) => lit(a, is("chime") ? 1 : 0.1) });
    actor("shaft", { build: sunShaft, scene: "gv3", noface: true, pos: () => G3(MIR[0][0], MIR[0][1]), show: () => !F.doorOpen || is("chime") });
    MIR.forEach(([x, z, y], i) => actor("mir" + i, { name: "Mirror", build: i === 2 ? wallMirror : mirror, scene: "gv3", noface: true, pkey: () => rot(i) + (F.mi || 0) * 10, pos: () => G3(x, z), show: () => true, talk: () => turnMirror(i), verb: () => (i === 2 && !F.hook ? "Reach the high mirror" : i === 3 && !F.lured ? "Get to the last mirror" : "Turn the mirror"), mark: () => is("mirrors") && (F.mi || 0) === i, onSpawn: (a) => aimMirror(a, i), tick: (a) => { if (a.G && a.lastRot !== rot(i)) { a.lastRot = rot(i); aimMirror(a, i); } } }));
    actor("door", { build: roundDoor, scene: "gv3", noface: true, pos: () => G3(DOOR[0], DOOR[1]), tick: (a, dt) => { if (!a.G) return; const r = a.G.getObjectByName("roll"), want = F.doorOpen ? 3.4 : F.crack ? 0.25 : 0; if (r) { r.position.x += (want - r.position.x) * Math.min(1, dt * 0.9); r.rotation.z = -r.position.x / 1.75; } const cm = a.G.userData.cm, l = a.G.getObjectByName("light"); const k = F.lit ? 1.6 + Math.sin(X.T * 3) * 0.3 : 0; if (cm) cm.emissiveIntensity = k; if (l) l.intensity = k * 1.4; } });
    const MONO = [[6.9, 6.2], [4.0, 6.4], [9.1, 5.9]];
    MONO.forEach(([x, z], i) => actor("mono" + i, { name: i === 1 ? "Monolet" : "", mon: "Monolet", h: 1.4, scale: 1.7, scene: "gv3", noface: false, pkey: () => (F.lured && i === 1 ? 1 : 0) + (F.bow ? 2 : 0), pos: () => (F.bow ? G3(4.6 + i * 1.6, 6.4) : F.lured && i === 1 ? G3(2.2, 7.6) : G3(x, z)), onSpawn: (a) => pebbles(a.G), tick: (a, dt) => { if (!a.G) return; const rg = a.G.getObjectByName("ring"); if (rg) rg.rotation.y += dt * (F.bow ? 0.6 : past("maze") ? 3 : 0.2); const c = a.G.getObjectByName("crack"); if (c) { const v = !past("maze") ? 0.05 : F.bow ? 1.2 : 2.2; c.material.emissiveIntensity = v; c.material.color.set(F.bow ? "#ffd860" : "#a85aff"); c.material.emissive.set(F.bow ? "#ffd860" : "#a85aff"); } const tip = i === 2 && F.dizzy && !F.bow; a.G.rotation.x += ((tip ? -1.45 : F.bow ? 0.35 : 0) - a.G.rotation.x) * Math.min(1, dt * 2); }, talk: i === 1 ? () => monoTalk() : null }));
    actor("chime", { name: "Chimelet", mon: "Chimelet", h: 0.6, fly: 0.35, scene: "gv3", noface: false, pkey: () => (F.chimeOut ? 1 : 0), pos: () => (F.chimeOut ? G3(9.4, 6.6) : G3(12.3, 9.4)), show: () => is("chime", "hall", "murals", "home", "done") || past("chime"), tick: (a) => { if (a.G && a.G.visible) a.G.position.y = a.base.y + Math.sin(X.T * 2) * 0.06; } });
    // the Mural Hall: the three great murals on the north wall, then the scouts, the sealed door with eight stars, and the crater
    const MU = [[2.7, 2.3, "the crystal forest"], [9.3, 2.3, "the shadow"], [6.0, 2.3, "the Seedmother"], [1.9, 4.5, "the scouts"], [10.1, 4.5, "the door with eight stars"], [8.6, 7.6, "the last painting"]];
    MU.forEach(([x, z, nm], i) => actor("mu" + i, { name: "Mural", build: () => { const G = new K.G(); mesh(new K.Sph(0.08, 8, 6), glow("#ffd860", 0.9), 0, 0.15, 0, G); const l = new K.PL("#ffd890", 0, 5, 2); l.position.y = 1.6; l.name = "light"; G.add(l); return G; }, scene: "gvMural", noface: true, pos: () => at("gvMural", x, z), talk: () => muralTalk(i), verb: "Look at " + nm, mark: () => is("murals") && (F.mu || 0) === i, tick: (a) => { if (!a.G) return; const l = a.G.getObjectByName("light"); if (l) l.intensity = (F.mu || 0) > i ? 1.2 : (F.mu || 0) === i && is("murals") ? 1.6 + Math.sin(X.T * 3) * 0.5 : 0.1; } }));
    actor("pScouts", { build: () => painting("scouts"), scene: "gvMural", fixed: true, noface: true, ry: Math.PI / 2, pos: () => at("gvMural", 1.08, 4.5, false).add(new V(0, 2.1, 0)) });
    actor("pDoor", { build: () => painting("door"), scene: "gvMural", fixed: true, noface: true, ry: -Math.PI / 2, pos: () => at("gvMural", 10.92, 4.5, false).add(new V(0, 2.1, 0)) });
    actor("pCrater", { build: () => { const G = painting("crater"); G.scale.setScalar(0.7); return G; }, scene: "gvMural", fixed: true, noface: true, ry: Math.PI, pos: () => at("gvMural", 8.6, 8.94, false).add(new V(0, 1.9, 0)) });

    // gates: the temple is sealed until Liss opens it, and the round door only lets you by once it sings
    const approaching = (px, pz, r) => (x, z) => { const d = Math.hypot(x - px, z - pz); return d < r && d < Math.hypot(P.position.x - px, P.position.z - pz); };
    X.blocked.push((x, z) => { if (F.unsealed || !s.res || !s.res.rects || !s.res.rects.Y9) return false; const d = DOOR9(); return approaching(d.x, d.z, 2.8)(x, z); });
    X.blocked.push((x, z) => { if (F.doorOpen || !s.PL.gv3) return false; const d = at("gv3", 7.5, 4.3, false); return approaching(d.x, d.z, 2.6)(x, z); });

    /* ---------- objectives ---------- */
    const goal = () => {
      const k = ST.step, p = pl();
      if (k === "camp") return objective("Walk up the beach to Tamsin's Dig Camp", () => at("YD", 15, 12));
      if (k === "temple") return p.startsWith("gv") ? objective("") : objective(F.lissOn ? "Listen to the crystal by the temple door" : "Climb the temple steps to the great dark doorway", () => DOOR9());
      if (k === "maze") {
        if (p === "gv1") return objective("Follow Liss's crystals: up the stairs in the north-west corner", () => at("gv1", 2.5, 6.4));
        if (p === "gv2") return objective("Keep following Liss: up the stairs in the north-east corner", () => at("gv2", 15.5, 6.4));
        return objective("Enter the Temple of Voices", () => DOOR9());
      }
      if (k === "mirrors") {
        if (p !== "gv3") return objective("Go back up to the round room on the third floor", () => (p === "gv2" ? at("gv2", 15.5, 6.4) : p === "gv1" ? at("gv1", 2.5, 6.4) : DOOR9()));
        const i = F.mi || 0; return objective("Bounce the sunbeam to the door's crystal: turn the mirror the light is hitting (" + i + " of 4)", () => G3(MIR[i][0], MIR[i][1] + (i === 2 ? 0.9 : 0.8)));
      }
      if (k === "chime") return objective("Something small has been hiding behind a pillar. Find it, gently", () => G3(12.3, 9.4));
      if (k === "hall") return p === "gv3" ? objective("Go through the great round door", () => G3(7.5, 4.6)) : objective("Go back to the round door on the third floor", () => DOOR9());
      if (k === "murals") { const i = F.mu || 0; if (p !== "gvMural") return objective("Go back to the Mural Hall", () => G3(7.5, 4.6)); return objective("Look at the murals of Ystra (" + i + " of 6): " + MU[i][2], () => at("gvMural", MU[i][0], MU[i][1] + 0.6)); }
      if (k === "home") return objective("Run back to the Squid Sailor at the jetty", () => ACT.sailor.pos());
      objective("");
    };

    /* ---------- scenes ---------- */
    const arrive = () => play([
      () => X.titleCard(23, "The Deep Sea Ferry"), pause(3.4),
      { cam: "sailor" },
      "Dr. Vashti didn't come with them. Somebody has to keep listening, she said, standing at the window of her lab with a cup of tea she wasn't drinking. She hugged Rook for a long time at the door. Then she knelt down in front of Zib. Be careful, little one. Wherever you're taking them.",
      "They flew back across the stars to the Molten Frontier one more time. And at the end of the longest dock in Port Ember, the Squid Sailor was already there, sitting on its upturned barrel, puffing on its bubble pipe.",
      SQ + ": Heard you on the radio. Battle Night. All fourteen worlds. Very loud. Very impressive. Heard something else, too. Heard there were four Shards humming together at the end.",
      "Rook took them out. The blue one from Ferrox. The green one from Sporeholm. The faint, flickering sea-blue one from Thalassa. And the crackling yellow one from Neonis. They hummed, that four-part chord, and all along the docks people stopped and turned to listen.",
      SQ + ": Four. Four. Forty years I've been waiting for somebody to say that.",
      () => { F.signOff = 1; },
      "It straightened its blue scarf. It put its hat back on at exactly the right jaunty angle. Then it took hold of the bottom of the sign on the round glass ferry, the part that said NOT CURRENTLY DIVING, and tore it right off. All down the docks, people cheered.",
      SQ + ": All aboard! All aboard the Deep Sea Ferry! Next stop, the bottom of the world!",
      { cam: "ferry" },
      SQ + ": Hold onto your hats. Or your caps. Or your saucers.",
      () => X.mood("blue"),
      "The ferry sank. Not a plunge. Slowly, gently, the way a feather sinks through honey. The water rose up the glass, past their knees, past their shoulders, past the top of the bubble. The light went blue, like being inside a sapphire.",
      "Schools of silver fish turned all at once, flashing like a shower of coins. Then the water started to glow from inside, tiny creatures lighting up as the ferry passed, until the whole sea sparkled like a night sky. And then the jellyfish came. Great domes of soft pink and violet light, bigger than the ferry, pulsing like slow heartbeats.",
      KT + ": They look like Tidaloid.",
      "They did. Rook felt a sharp little pain in his chest, and wondered where Sola was right now, and whether she was scared.",
      "Then something moved beneath them. A long, smooth, gray back, wider than the Port Ember harbor. A fin as huge as a sail. And all along its side, rows of soft blue lights, like the windows of a sleeping city. It hummed, so low that Rook felt it in his bones.",
      { cam: "zib" }, Z + ": Bip... bip... bip...",
      SQ + ": That was the Old One. Nobody knows what kind. Nobody knows how old. I've seen her three times in forty years. Count yourselves lucky, mateys.",
      "And at the very bottom of the sea, standing on its edge in the sand, was a ring of blue light, covered in barnacles and coral and waving sea-grass. Every one of its carvings was glowing.",
      SQ + ": The Sunken Gate. Older than all the rest, they say. Only opens for the Ferry. Only opens for four Shards.",
      () => X.mood("rainbow"),
      "Rook held the Shards against the glass. The gate hummed back. The water swirled, and the ferry sailed straight into it. Whoosh. Tingle. A flash of blue, stronger than any gate before. Then they were rising, faster and faster, into golden light, and the ferry burst up out of the sea in a splash of white foam.",
      () => X.mood("gold"),
      "Glyphos. It was carved on a great stone tablet half sunk in the water, in letters as tall as Rook. A world of ruins. Temples rising out of a calm green sea, some standing tall, some half sunk and leaning, some only the tops of their pillars poking out like the fingers of giants. Everything carved with swirling marks and lines of real gold, glinting in the sunshine. Glowing.",
      "On a wide flat island of sand, somebody had set up camp. Canvas tents with little flags. Lanterns on poles. Tables covered in maps. And dozens of people in wide hats, brushing the old stone steps with tiny brushes.",
      KT + ": Archaeologists. People who dig up old stuff and figure out what it means.",
    ], () => set("camp"));
    const tamsinScene = () => play([{ cam: "tamsin" },
      TA + ": Well, well, well. Look who's wearing his Linker the right way up.",
      R + ": TAMSIN!",
      "She stood up off her flat stone, laughing her big warm laugh that made the feather on her hat bounce, and caught him in a hug that smelled like apples and dust and sea salt.",
      TA + ": Look at you! Look at you, look at you! I heard you on the radio! The fire-comet kid! And you found friends. I told you you'd need all the friends you could get.",
      { cam: "zib" }, "Zib floated up off Rook's cap and hovered over Tamsin's shoulder, staring at one patch on her vest. The question mark. Just like he had in the Cactus Gardens, what felt like a hundred years ago.",
      Z + ": Bip.",
      { cam: "tamsin" },
      TA + ": Still like that one, eh? The world I never found. The one they all came from. I've been looking for it for forty years. And I think, little one, this is the closest I've ever been.",
      R + ": What are you doing here?",
      TA + ": Same as everyone else. Trying to figure out what all this is. These ruins are older than anything in the Kessler system. Older than the towers. Older than the gates. Older than people. Nobody knows who built them.",
      TA + ": And these marks. Same as the bridge in Dustmere. Same as every gate. Same language. We've been trying to read it for years. It's like trying to read a book when you don't even know which way is up.",
      "Rook looked at the swirls and loops. He'd seen them on every gate and every tower. And every time, they had glowed for Zib. As if they recognized him.",
      blackout(() => { const p = at("Y9", 15, 28.4); X.tp(p, Math.PI); setTimeout(() => X.tp(at("Y9", 15, 28.4), Math.PI), 900); }, 1300),
      { cam: DOOR9().add(new V(0, 3, 0)) },
      "The biggest temple stood in the middle of all the others, rising out of the green sea like a mountain made of steps. At the very top, a huge dark doorway, with two columns carved like the trunks of trees on either side. And the whole front of it covered in gold, so that it glittered in the sun like a crown.",
      TA + ": The Temple of Voices. That's what the old maps call it. Nobody's ever got further than the front door. It's sealed. Always has been. We've tried everything.",
      { cam: "zib" }, "Zib was floating forward, all by himself. Up the steps, slowly, as if something were pulling him, his lights flickering every color.",
    ], () => set("temple"));
    const templeScene = () => play([{ cam: "liss0" },
      () => { F.lissOn = 1; X.mood("rainbow"); },
      "Set into the stone beside the door was a crystal, about the size of Rook's hand. Clear as water, and old, and dusty. But as Zib floated in front of it, it began to glow. Brighter. Then blazing, and the gold lines on the temple lit up one by one, racing across the stone, until the whole front of the temple was burning with golden light.",
      LI + ": Little scout. You came back.",
      Z + ": BIP! BIP-BIP! BIP-BIP-BIP-BIIIIIIIP!",
      R + ": Who... Who are you?",
      LI + ": I am Liss. An echo. A memory of those who came before. I have been waiting here a very long time. And you have brought him home.",
      R + ": Home? Is this where Zib comes from?",
      LI + ": No, child. Not this place. This place is only a memory of his home. A story, carved in stone, so that it would never be forgotten. The temple has a story to tell you. It is a long story, and a sad one, and an important one. It is the story of where the Alienmon came from. And why.",
      LI + ": But first, you must open its doors.",
      () => { X.titleCard(24, "Temple of Voices"); }, pause(3.2),
      () => { F.unsealed = 1; X.save(); },
      "The huge slab of stone that had blocked the doorway for a thousand years lowered itself down into the floor with a deep, grinding rumble, like a giant clearing its throat. Dust poured off it in clouds.",
      LI + ": Enter. And be brave. The temple will test you.",
      { cam: "cTam" },
      TA + ": FORTY YEARS! FORTY YEARS I've been waiting to see the inside of this thing! Well? What are we waiting for?",
    ], () => { X.mood("gold"); set("maze"); });
    const lissTalk = (n) => {
      if (n == null) return is("temple") ? templeScene() : play([{ cam: "liss0" }, LI + ": " + (past("murals") ? "Go and ask your questions, little ones." : "Enter, little ones. And be brave.")]);
      const L = { 1: "Up the stairs, little ones. Not the other way. That way is only a very long fall.", 2: "Left. Then up. You are close now.", 3: is("chime") ? "It needs a pure note. One single, perfect, ringing note." : past("chime") ? "Come and see where you came from, little scout." : "The light is the key, children. The light is the key." }[n];
      play([{ cam: "liss" + n }, LI + ": " + L]);
    };
    const mazeIntro = () => play([{ cam: "liss1" },
      "The Temple of Voices was a maze of stone. Tall echoing halls, narrow twisting corridors, staircases that went up and down and up again. And it echoed. When Kit sneezed, the sneeze came back nine times.",
      TA + ": It's called the Temple of Voices. Now I know why.",
      "Every so often they passed a small crystal set into the wall, just like the one by the front door. And every time Zib floated past one, it lit up, soft and white, and Liss spoke from it.",
      LI + ": Up the stairs, little ones. Not that way. That way is only a very long fall.",
    ], () => { F.mazeIn = 1; X.save(); goal(); });
    const domeScene = () => play([{ cam: "shaft" },
      "The stairs opened up into a round room under a dome. Set into the walls were mirrors, round mirrors of polished silver in carved stone frames, each one tilted at a slightly different angle. Through a single small hole high in the dome came one thin, perfect beam of sunlight, like a golden string.",
      { cam: "door" },
      "On the far side was a door. A huge, round, stone door. In its very center was set a large crystal, clear and dark. And standing in front of it, side by side, were three standing stones, each with three small pebbles hanging perfectly still in the air on thin rings of pink light.",
      { cam: "mono1" },
      () => X.cry("pebblet"), "Rook took one step into the room. The three cracks down their stone faces lit up, a deep, burning violet. The pebbles began to slide along their rings, faster and faster. And with a grinding rumble, like mountains turning over in their sleep, the three stones turned and faced him.",
      LK + ": MONOLET. GRAVITY/PSI-TYPE. 140 KILOGRAMS EACH. ANCIENT GUARDIAN.",
      KT + ": Oh.",
      MO + ": ONLY... THE WORTHY... MAY PASS.",
      "Rook swallowed. Think first. Even if all three of them fell down, the door would still be closed. So beating them wasn't the point. The point was the door. And the door had a crystal in it. And there was a beam of light. And mirrors all around the walls.",
      R + ": Kit. Can you figure out the door?",
      { cam: "cKit" },
      KT + ": It's a light puzzle. The beam comes down from the hole in the roof. If you put a mirror in the right place, you could bounce it. And again. And again. All the way round the room until it hits that crystal. That's the lock. The light is the key. But they're kind of in the way.",
      R + ": Then I'll handle the Monolets. You figure out the door.",
      TA + ": And I will help the genius.",
      { cam: "mono1" },
      R + ": Okay, team. Here's the thing. We are NOT trying to beat them. They're guardians. They've been standing here for a thousand years, doing their job. They're not bad guys. So we're not going to hurt them. We just keep them busy. Keep them away from Kit.",
    ], () => { F.mi = 0; set("mirrors"); drawBeams(); });
    const monoTalk = () => play([{ cam: "mono1" }, F.bow ? MO + ": YOU ARE WORTHY." : MO + ": ONLY... THE WORTHY... MAY PASS."]);
    const dodgeScene = () => play([{ cam: "mono0" },
      "The first Monolet's pebbles stopped circling. They hung in the air for one heartbeat. Then they flew.",
      R + ": Dodge!",
      "KRAKOOOM. The tiles split in a star of cracks where Plazmet had just been. The third one sent all three of its pebbles skimming low across the floor, heavy as a falling wall.",
      R + ": Jump!",
      "Cactling jumped. The pebbles shaved the tips off two of its needles. Lumislug did not jump, because it was a slug, but it was very low to the ground, and the pebbles skimmed right over the top of it. Lumislug blinked, and kept glowing.",
    ], () => { F.dodged = 1; X.save(); goal(); });
    const hurtScene = () => play([{ cam: "mono2" },
      "Then the Monolets stopped throwing wildly. Their cracks flared together, slow and cold. They were learning. The air beside Cactling went heavy and hard, like a giant hand coming down to swat a fly. WHUMP. Cactling skidded across the floor and hit a pillar.",
      { cam: "cPlaz" },
      "And the third Monolet, the one nobody was watching, shuffled out of the dust. The air on both sides of Plazmet slammed together. BOOOOM. Something tiny and orange dropped out of the empty air and rolled across the tiles.",
      R + ": PLAZMET!",
      "Something hot and furious roared up in Rook's chest. They hurt him. All he had to say was two words. Comet Dash. But one thin thread of Plazmet's fire stretched out and curled around Rook's finger, the way it used to when he was small enough to sleep in Rook's hands. Holding him still. Is that really what we do?",
      R + ": Not yet. We don't hit them. We just don't let them win either. Okay? Can you get up?",
      "Plazmet flared, fsssht, and floated up off the floor, half his size, and turned to face the Monolet.",
      R + ": Lumislug! Brighter! As bright as you can! Right in their faces! Glitchbug, zip around them. Don't zap them. Just buzz.",
      () => { F.dizzy = 1; X.save(); }, { cam: "mono2" },
      "Lumislug glowed so bright the room went green, and the Monolets flinched. Glitchbug zoomed in circles round the third one, so close to its glowing crack that it kept turning and turning to follow it. It spun on the spot. Then it got so dizzy that it tipped over, very slowly, like a falling tree. THOOOM.",
      "Rook laughed out loud. It came out shaky. He couldn't help it.",
    ], () => { F.hurt = 1; X.save(); goal(); });
    const hookScene = () => play([{ cam: "mir2" },
      KT + ": Yes! Tamsin! That one up there! Can you reach it?",
      { cam: "cTam" },
      "Tamsin used her walking stick. She hooked it round the edge of the high mirror and pulled. Click.",
      TA + ": Forty years, and it turns out all you need is a good stick.",
    ], () => { F.hook = 1; X.save(); goal(); });
    const lureScene = () => play([{ cam: "mono1" },
      KT + ": One more! Rook! I need one more! But it's behind the middle one!",
      "The last mirror stood right behind the biggest Monolet. And Rook's whole team was hurt. Cactling was limping. Lumislug's glow had gone dim and patchy. And Plazmet was still only half his size.",
      R + ": Plazmet. I need you to lead it away. Right up close to its face, close enough that it only looks at you. No fire. No hitting. Just make it follow you. It's going to fight. You can't hit back. Can you do that?",
      { cam: "cPlaz" },
      "Plazmet bobbed, once, firmly. He floated right in front of the middle Monolet's face, and then backed away. Slowly. Teasingly. Like a cat with a piece of string. One step. Two. Three. Away from the mirror.",
      () => { F.lured = 1; X.save(); },
      "WHOOOSH. The pebbles missed him by a whisker, and the wind of it blew his flame sideways and nearly out. He steadied, and backed away again.",
      R + ": Hold on. Hold on, hold on, hold on...",
      R + ": PLAZMET! NOW! As bright as you've EVER been!",
      "Plazmet blazed. Not at the Monolet. Just blazed, all the fire he had left, big and white and gold, like a sunrise in a dark room. The Monolet froze, dazzled. And Kit reached up for the last mirror.",
    ], () => goal());
    const doorScene = () => play([{ cam: "door" },
      () => { F.lit = 1; X.mood("gold"); },
      "CLICK. The beam shot down in a perfect straight golden line, and hit the crystal in the center of the great round door. The crystal blazed, bright gold, like the sun itself was trapped inside it, and the light poured out along every carved line until the whole enormous door was glowing.",
      () => { F.bow = 1; X.save(); }, { cam: "mono1" },
      "And the Monolets stopped. All three at once. Then, slowly, the one on its back floated itself upright, and the three of them shuffled into a neat straight row and faced Rook and Kit. Their cracks weren't cold anymore. They were soft gold, like the light from the door. And all three tipped forward together in a slow, deep bow.",
      MO + ": BRAINS. AND HEART. TOGETHER.",
      MO + ": YOU DID NOT STRIKE US. YOU COULD HAVE. YOU DID NOT. MANY HAVE COME TO THIS DOOR, LONG AGO, WITH STRONG FISTS AND NO PATIENCE. THEY DID NOT PASS. YOU ARE WORTHY.",
      { cam: "cPlaz" },
      "Rook held out both hands and caught the tiny spark that was Plazmet. He sneezed. Pfft. One tiny spark. Kit grabbed Rook's arm, laughing and shaking. Tamsin threw her hat in the air.",
      () => { F.crack = 1; X.save(); }, { cam: "door" },
      "And the great round door began to move. It rumbled, it shook, it began to roll to the side like a giant stone wheel. And then it stopped. Open just a crack. And the golden light on it flickered.",
      R + ": What? Why did it stop?",
      { cam: "cKit" },
      KT + ": There's something missing. The light worked. The lock's open. But there are little holes, all along the edges. Hundreds of them. Like a flute. It's supposed to sing. That's how it opens all the way. But nothing's singing. The temple's broken.",
      TA + ": The Temple of Voices. And it's lost its voice.",
      { cam: "zib" }, "Zib floated to the crack in the door and hummed the Spore Choir song. Hmm-mm-mmm. It echoed sweetly round the room. But the door didn't move.",
      { cam: "liss3" },
      LI + ": It needs a pure note. One single, perfect, ringing note. Long ago, the temple keepers had one. But it has been a very long time since anyone rang it.",
    ], () => { drawBeams(); set("chime"); });
    const chimeScene = () => play([{ cam: "chime" },
      "From behind a pillar at the edge of the room, something peeked out. It was small, about as tall as Rook's knee, shaped like a little bell of polished silver, with a shy, round-eyed face under its rim, long teal ribbons, and a ring of thin glass chimes that clinked softly whenever it moved. It had been hiding there the whole time. Too scared to come out.",
      LK + ": CHIMELET. SONIC/CRYSTAL-TYPE. ITS NOTE CAN WAKE ANCIENT THINGS.",
      "Nobody moved. Nobody wanted to scare it. The little bell looked at the great door. It looked at the bowing Monolets. And then it looked at Zib.",
      { cam: "zib" }, () => X.mood("gold"), Z + ": ...Bip.",
      () => { F.chimeOut = 1; X.save(); }, { cam: "chime" },
      "The Chimelet came out. It floated across the room into the middle of the golden beam, so bright it looked like a little sun. It took a breath. Rook didn't know bells could take breaths. This one did. And it swung itself gently, once, and rang.",
      () => X.cry("blinkit"), "Dinnnnnnnnnng. The purest sound Rook had ever heard. And the whole temple sang back. Every wall hummed. Every crystal chimed. The hundreds of little holes round the great door sang at once, like a giant pipe organ, like a choir. Zib spun in circles beside the Chimelet, going BIP! BIP! BIIIIIP! along with the song.",
      () => { F.doorOpen = 1; X.save(); X.mood("rainbow"); }, { cam: "door" },
      "And the great round door rolled open. All the way. Slowly, grandly, like the whole temple letting out a breath it had been holding for a thousand years. Beyond it, stairs climbed into the dark, and something up there was glowing. Faintly. Softly. Pictures.",
      { cam: "liss3" }, LI + ": Come. Come and see where you came from, little scout.",
      { cam: "zib" }, "Zib floated into the doorway and stopped. He looked back over his shoulder at Rook with his huge round eye, and Rook could have sworn he looked scared. Rook walked up and held out his hand. Zib floated down into it.",
      R + ": Together.",
    ], () => { X.mood("gold"); drawBeams(); set("hall"); });
    const hallScene = () => play([
      () => X.titleCard(25, "Murals of Ystra"), pause(3.2), { cam: "mu0" },
      "The hall beyond the door felt like standing outside at night, under a sky with no stars. The walls were covered in paintings, huge and old, the colors faded and cracked like wrinkles on an old face. But every line and every color still shimmered softly in the dark, as if someone had mixed starlight into the paint.",
      "Tamsin had taken off her hat and was holding it against her chest. Kit had pushed his goggles up and was turning round and round in a slow circle. Mycelith bowed its great red cap low. And Zib sat very still in Rook's hands. His lights were off. All of them. Rook had never seen that before.",
      LI + ": This is our story. The story of Ystra.",
    ], () => { F.mu = 0; set("murals"); });
    const MURALS = [
      [{ cam: "mu0" },
        "The first painting lit up from inside, the way the sun comes up. A beautiful round world, covered in forests of crystal. Trees made of glass, tall and thin as church spires, hung with glittering leaves that threw the light back in rainbows. Blue glowing moss. Clear rivers. And everywhere, Alienmon. Thousands of them. And above it all hung a sun, big and round and far too red. It looked tired.",
        R + ": That's my dream. That's my DREAM! From my birthday! I dreamed I was standing in a forest made of glass, and the trees were singing, and there was a big red sun, and someone whispered in my ear. They said, find the one who listens.",
        LI + ": Ystra called out. At the very end, she called out across the stars, as loud as she could, for someone, anyone, who might hear. Someone who would listen. It seems, child, that someone did."],
      [{ cam: "mu1" },
        "The second painting lit up. The same world, the same red sun. But now there was a shadow in the sky. No shape. No edges. No face. Just dark, darker than anything, spreading the way ink spreads through water. And where it went, the stars went out, one by one. It was hungry. It was already touching the edge of the red sun.",
        LI + ": It came from very far away, from the darkest place between the stars. We never knew its name. We never knew what it wanted. Only that it was hungry, and that it never stopped. It ate the light. It ate the stars. And it was coming for Ystra.",
        "In Rook's hands, Zib was trembling. A tiny, fast, frightened trembling, like a bird's heartbeat. Rook held him a little tighter."],
      [{ cam: "mu2" },
        "The third painting lit up. And there she was. The face from Zib's memory on Sporeholm. The face carved into the harbor gate at Port Ember. A tree, the biggest tree Rook had ever imagined, with silver bark and roots that went down to the heart of the world, and branches that brushed the stars. Every Alienmon in the forest was gathered round her roots, looking up at her.",
        "And on every branch there were seedpods, gold and violet and green. Thousands of them. And one by one, she was letting them go, sending them up and away, out into the stars, like dandelion fluff blown from a stem. She was smiling. That sad, brave, goodbye smile. Her eyes were closed. Because she was staying behind.",
        LI + ": She sent her children away, to save them. She could not run. She was too old, and too big, and her roots went too deep. So she gave everything she had left to the seeds. We called her the Seedmother. Every Alienmon you know came from her seeds.",
        KT + ": So the Alienmon. They're not just from somewhere else. They're refugees. They ran away from home. Because something was eating it.",
        TA + ": Ystra. Forty years. Forty years I've been looking for you. And you've got a name.",
        () => X.mood("blue"), { cam: "zib" },
        "In Rook's hands, Zib's lights came back on. Not flashing. Pulsing. Slow and soft and sad, a deep dim blue. Like a heart that hurt. And Rook finally understood. Zib had been one of those seeds. Zib had watched his home go dark.",
        R + ": It's okay, buddy. It's okay. You've got a home now. You've got Dustmere. And my mom, who makes too many pancakes. And DX-4. And Dr. Vashti. And Kit, and Plazmet, and Mycelith, and everybody. And me. You've got us. And we're not going anywhere. I promise.",
        Z + ": ...Bip.",
        () => X.mood("gold"), "They stood like that for a long time, all together, under the painting of the tree-mother with her eyes closed."],
      [{ cam: "mu3" },
        "There were more paintings. Seedpods flying through the dark for years and years. A seedpod landing on a strange new world, and something small and frightened climbing out. And tiny saucers, palm-sized, with one big eye each, flying out ahead of all the others. Searching.",
        LI + ": Scouts. Sent ahead to find the way. To find a place where the seeds could land safely. To listen for a world that would welcome them.",
        "Rook looked down at Zib, sitting in his hands. Little scout, Liss had called him."],
      [{ cam: "mu4" },
        "Then a painting that made Kit stop walking. A great round dark door, floating in empty space between the stars. Shut. And holding it shut, spaced evenly around it, eight bright stars, all joined together with lines. A circle with eight points. The drawing on Kit's arm.",
        KT + ": The seal.",
        R + ": What does it say? Liss? Those words underneath?",
        LI + ": Those words are not mine to speak. They were carried here long ago, inside the very first seed. Written on stone, so that whoever found it would read them first. The ones who found that seed can tell you what it says. Ask them.",
        R + ": But we don't know who found it!",
        "Liss didn't answer."],
      [{ cam: "mu5" },
        KT + ": Rook. ROOK. Come here. Come look at this.",
        "The last painting was newer than the others, smaller, simpler, as if whoever painted it had been in a hurry, or very young. A crater in a red desert, under a dark sky full of stars. The Starfall Crater. And in the middle of it, a seedpod cracked open like an egg, and inside it something small and round and silver, with one big eye.",
        "And standing round the seedpod, looking down into it, were four kids. A tall boy, standing a little apart, with sharp eyes and his hands behind his back. A girl with long dark braids. A boy with a big wide grin and a jacket much too big for him, olive green, with the sleeves rolled up. And a girl with round glasses and a messy bun.",
        R + ": Dusty's story. The four kids who walked out to the crater and found the very first star-seed. It was real. It was all real.",
        KT + ": Rook. Look at their faces. Rook, is that...?",
        "Rook's whole body went cold. He'd seen that girl before, grown up, every week of his life. Standing at the top of one hundred and twelve stone steps, in a lab coat with too many pockets, with pencils stuck in her silver hair.",
        R + ": Tamsin. Do you have paper? Big paper? And charcoal?",
        TA + ": Child, I'm an archaeologist. I never go anywhere without them.",
        () => X.keyItem("rubbings", "Charcoal rubbings", "Rubbings of every mural in the Temple of Voices, tied with the purple ribbon from Dr. Vashti's map: the crystal forest, the shadow, the Seedmother, the scouts, the door with eight stars, and four kids at the Starfall Crater."),
        "They made rubbings of every mural. It took hours. Mycelith held the big sheets up high. Plazmet gave them light. Rook did the last one himself, very slowly, so he wouldn't miss anything. Then he rolled them all up, tied them with the purple ribbon from Dr. Vashti's map, and put them in his satchel next to the four humming Shards.",
        LI + ": Go. Go and ask your questions, little ones. The answers are waiting. And come back to me, scout. When it is time.",
        { cam: "zib" }, "Zib's lights flickered once, gold."],
    ];
    const muralTalk = (i) => {
      const n = F.mu || 0;
      if (!is("murals") || i > n) return play([{ cam: "mu" + i }, i > n ? LI + ": Patience, little one. The story has an order." : "The painting glows softly in the dark."]);
      play(MURALS[i], () => { F.mu = i + 1; X.save(); if (i === MURALS.length - 1) return homeRun(); goal(); });
    };
    const homeRun = () => play([
      () => { set("home"); },
      blackout(() => { const j = ACT.sailor.pos(); X.tp(j.clone().add(new V(-1.4, 0, -1.2))); setTimeout(() => X.tp(j.clone().add(new V(-1.4, 0, -1.2))), 900); }, 1400),
      "They ran. Back through the great hall, through the round door, past the three Monolets, who bowed as they passed, and the little Chimelet, who rang a soft ding goodbye. Down through the echoing maze, with Liss whispering left, right, up the stairs from every crystal. Out into blinding golden sunshine, down the steps three at a time, across the sand, past the tents.",
    ], () => sailorEnd());
    const sailorTalk = () => {
      if (is("home")) return sailorEnd();
      play([{ cam: "sailor" }, SQ + ": " + (past("camp") ? "The ferry'll wait, matey. Go on. That temple's been waiting longer." : "Mind the gangplank. The camp's just up the beach.")]);
    };
    const sailorEnd = () => play([{ cam: "sailor" },
      SQ + ": Back so soon? Find what you were looking for?",
      R + ": We need to go back. Right now. As fast as the ferry can go.",
      "The Squid Sailor looked at his face. Then it took the pipe out of its mouth and stood up.",
      SQ + ": Where to, matey?",
      "Rook looked down at the satchel against his chest. At the rolled-up rubbings tied with purple ribbon. At the girl with the round glasses, hidden inside them.",
      R + ": Neonis. There's someone we need to talk to.",
    ], () => { set("done"); X.showEnd("GLYPHOS", "Four Shards, a seal of eight towers, and the story of Ystra rolled up in a satchel. And four kids at the Starfall Crater, twenty years ago. One of them wears round glasses. To be continued.", null); });

    /* ---------- the mirrors ---------- */
    const turnMirror = (i) => {
      const n = F.mi || 0;
      if (!is("mirrors")) return play([{ cam: "mir" + i }, F.doorOpen ? "The mirror holds the light steady now." : "A round silver mirror in a carved stone frame."]);
      if (i > n) return play([{ cam: "mir" + i }, KT + ": Not that one yet! Follow the light. Turn the one it's hitting."]);
      if (i < n) return play([{ cam: "mir" + i }, KT + ": That one's right. Don't touch it!"]);
      if (i === 2 && !F.hook) return hookScene();
      if (i === 3 && !F.lured) return lureScene();
      F["r" + i] = (rot(i) + 1) % 4; X.save();
      if (rot(i) === WANT[i]) {
        F.mi = n + 1; X.save(); drawBeams(); try { window.chime && window.chime(); } catch (x) {}
        if (i === 0 && !F.dodged) return dodgeScene();
        if (i === 1 && !F.hurt) return hurtScene();
        if (i === 3) return doorScene();
        s.say && s.say("Click. The beam jumps to the next mirror.", 2200); return goal();
      }
      drawBeams(); s.say && s.say("Click. The light hits the wall. Keep turning.", 1800);
    };

    /* ---------- pebbles flying while the puzzle runs ---------- */
    const flying = [];
    let nextThrow = 4;
    const throwPebble = () => {
      const ids = ["mono0", "mono1", "mono2"].filter((id) => ACT[id].G && ACT[id].G.visible && !(id === "mono2" && F.dizzy));
      if (!ids.length) return; const a = ACT[ids[Math.floor(Math.random() * ids.length)]];
      const from = a.G.position.clone().add(new V(0, 1.2, 0)), off = new V(Math.random() - 0.5, 0, Math.random() - 0.5).normalize().multiplyScalar(1.6 + Math.random() * 1.4);
      const to = P.position.clone().add(off); to.y = P.position.y + 0.1;
      const m = mesh(new K.Sph(0.16, 8, 6), mat("#8a7a6a", 0.1)); m.position.copy(from); s.sc.add(m); flying.push({ m, from, to, t: 0 });
    };
    const runPebbles = (dt) => {
      for (let k = flying.length - 1; k >= 0; k--) {
        const f = flying[k]; f.t += dt * 1.4; const t = Math.min(1, f.t);
        f.m.position.lerpVectors(f.from, f.to, t); f.m.position.y += Math.sin(t * Math.PI) * 1.4;
        if (t >= 1) { s.sc.remove(f.m); flying.splice(k, 1); try { s.sparkle && s.sparkle(f.to.x, f.to.y + 0.2, f.to.z, "#c8b8a0", 14); } catch (x) {} if (Math.random() < 0.3) s.say && s.say("KRAKOOOM!", 900); }
      }
    };

    /* ---------- the poll ---------- */
    let lastPl = null, lastT = 0;
    const tick = () => {
      const k = ST.step, p = pl(), now = X.T, dt = Math.min(0.5, now - lastT); lastT = now;
      if (p !== lastPl) { lastPl = p; goal(); drawBeams(); }
      runPebbles(dt);
      if (k === "mirrors" && p === "gv3" && !F.bow) { nextThrow -= dt; if (nextThrow <= 0) { nextThrow = 3 + Math.random() * 4; throwPebble(); } }
      if (k === "camp" && s.CH.YD && X.dist(at("YD", 15, 12, false)) < 5) return tamsinScene();
      if (k === "temple" && !F.lissOn && s.res && s.res.rects && s.res.rects.Y9 && X.dist(DOOR9()) < 5.5) return templeScene();
      if (k === "maze" && p === "gv1" && !F.mazeIn) return mazeIntro();
      if (k === "maze" && p === "gv3") return domeScene();
      if (k === "chime" && p === "gv3" && X.dist(G3(12.3, 9.4)) < 3.4) return chimeScene();
      if (k === "hall" && p === "gvMural") return hallScene();
      if (k === "home" && X.dist(ACT.sailor.pos()) < 4) return sailorEnd();
    };
    const findWater = () => {
      const o = P.position; let best = null;
      for (let r = 4; r <= 16 && !best; r += 1) for (let a = 0; a < 6.28; a += 0.2) { const x = o.x + Math.cos(a) * r, z = o.z + Math.sin(a) * r; if (!s.canStand(x, z) && !s.canStand(x + Math.cos(a) * 2.5, z + Math.sin(a) * 2.5)) { best = [x + Math.cos(a) * 3, z + Math.sin(a) * 3]; break; } }
      return best;
    };
    const start = () => {
      if (F.jx == null) { F.jx = P.position.x; F.jz = P.position.z; const w = findWater(); if (w) { F.fx = w[0]; F.fz = w[1]; } X.save(); }
      if (!ST.step) { ST.step = "arrive"; X.save(); return arrive(); }
      if (is("arrive")) return arrive();
      if (is("mirrors") && !F.dodged && (F.mi || 0) >= 1) F.dodged = 1;
      goal(); drawBeams();
    };
    const items = () => {
      if (past("murals") || (F.mu || 0) >= 6) X.keyItem("rubbings", "Charcoal rubbings", "Rubbings of every mural in the Temple of Voices, tied with the purple ribbon from Dr. Vashti's map: the crystal forest, the shadow, the Seedmother, the scouts, the door with eight stars, and four kids at the Starfall Crater.");
    };
    return { start, tick, items, resume: goal };
  };
})();
