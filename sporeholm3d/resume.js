/* Resume where you left off: remembers the player's last outdoor spot for the current story step,
   and puts them back there on reload instead of the world's start point.
   Only restores when the story step is unchanged, the spot is outdoors and standable, and no
   cutscene or battle is running. New Game (index.html AM_RESET_SAVE) wipes the key with the rest. */
(function () {
  "use strict";
  const W = () => (new URLSearchParams(location.search).get("world") || localStorage.getItem("am_world") || "sporeholm");
  const KEY = () => "am_pos_" + W();
  const ready = () => window.GAME && window.GAME.P && window.STORY && window.STORY.ST;
  const busy = () => (window.STORY.CS && window.STORY.CS.on) || (window.RPG && window.RPG.B);
  const loading = () => { const l = document.getElementById("load"); return l && l.style.display !== "none" && getComputedStyle(l).display !== "none" };
  const outdoors = (x, z) => { try { return !window.GAME.placeAt || window.GAME.placeAt(x, z) == null } catch { return false } };
  let restored = false, t0 = 0;
  const restore = () => {
    restored = true;
    if (window.AM_NEW_GAME) return;
    let s; try { s = JSON.parse(localStorage.getItem(KEY()) || "null") } catch { s = null }
    if (!s || s.step !== window.STORY.ST.step || busy()) return;
    const P = window.GAME.P.position;
    if (!outdoors(P.x, P.z) || !outdoors(s.x, s.z)) return;
    if (Math.hypot(P.x - s.x, P.z - s.z) < 3) return;
    // The saved spot's area may not be loaded yet, so move there first and check the ground once it has
    // streamed in; if the spot turns out not to be standable, go back to the start point.
    const G = window.GAME, home = [P.x, P.z];
    const put = (x, z) => { try { G.P.position.set(x, G.groundY ? G.groundY(x, z) : G.P.position.y, z); G.vel && G.vel.set(0, 0, 0) } catch {} };
    try { const sc = G.sceneAt && G.sceneAt(s.x, s.z); sc && G.loadScene && G.loadScene(sc) } catch {}
    put(s.x, s.z);
    let tries = 0;
    const check = () => {
      if (!G.canStand) return;
      const Q = G.P.position;
      if (G.canStand(Q.x, Q.z)) { put(Q.x, Q.z); return }
      if (++tries < 6) setTimeout(check, 1000); else put(home[0], home[1]);
    };
    setTimeout(check, 1000);
  };
  const tick = () => {
    if (!ready() || loading()) return;
    if (!restored) { if (!t0) t0 = performance.now(); else if (performance.now() - t0 > 1500) restore(); return; }
    if (busy()) return;
    const P = window.GAME.P.position;
    if (!outdoors(P.x, P.z) || (window.GAME.canStand && !window.GAME.canStand(P.x, P.z))) return;
    try { localStorage.setItem(KEY(), JSON.stringify({ x: +P.x.toFixed(2), z: +P.z.toFixed(2), step: window.STORY.ST.step })) } catch {}
  };
  setInterval(tick, 2000);
})();
