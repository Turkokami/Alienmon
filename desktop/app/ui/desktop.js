// Desktop-only: build every outdoor area of the world once, behind one loading screen, and keep them all.
// The game then reuses the built areas when you walk into them instead of building them on the spot.
// Turned on by window.AM_DESKTOP (set only by the desktop app). Lowering AM_DESKTOP_CACHE in the console
// (or ?preload=0 in the address) gets the website's behaviour back. The app sets AM_DESKTOP_CACHE from the
// PC's memory (about 200 MB per built area, half the RAM at most); areas past that are built nearest first.
(function () {
  'use strict';
  if (!window.AM_DESKTOP) return;
  var off = /[?&]preload=0\b/.test(location.search) || !!window.AM_PRELOAD_OFF;
  var st = window.AM_PRELOAD = { done: false, total: 0, built: 0, ms: 0, skipped: off };
  function frame() { return new Promise(function (r) { requestAnimationFrame(function () { setTimeout(r, 0); }); }); }
  function ready() {
    var G = window.GAME, L = document.getElementById('load');
    return G && G.res && G.res.rects && G.loadScene && G.unloadScene && G.CH && L && getComputedStyle(L).display === 'none';
  }
  function warm(G, group) {     // send the area's textures and shaders to the graphics card now, not on first sight
    var r = G.r, seen = new Set();
    try { if (r.compile && G.cam) r.compile(group, G.cam); } catch (e) {}
    group.traverse(function (o) {
      var ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      ms.forEach(function (m) {
        ['map', 'emissiveMap', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'alphaMap', 'bumpMap'].forEach(function (k) {
          var t = m && m[k];
          if (t && !seen.has(t)) { seen.add(t); try { r.initTexture(t); } catch (e) {} }
        });
      });
    });
  }
  async function run() {
    var G = window.GAME, L = document.getElementById('load'), t0 = performance.now();
    var R = G.res.rects, p = G.P.position, pos = G.res.warpXY ? G.res.warpXY(p.x, p.z) : [p.x, p.z];
    var dist = function (k) { var r = R[k]; return Math.hypot(Math.max(0, r[0] - pos[0], pos[0] - r[0] - 30), Math.max(0, r[1] - pos[1], pos[1] - r[1] - 30)); };
    var all = Object.keys(R), cap = window.AM_DESKTOP_CACHE || 1e9;
    var keys = all.filter(function (k) { return !G.CH[k]; }).sort(function (a, b) { return dist(a) - dist(b); });
    st.areas = all.length; st.cap = cap;
    if (keys.length > cap) keys = keys.slice(0, Math.max(0, cap - Object.keys(G.CH).length));
    var world = (new URLSearchParams(location.search).get('world') || localStorage.getItem('am_world') || 'world');
    world = world.charAt(0).toUpperCase() + world.slice(1);
    st.total = keys.length;
    L.style.display = 'flex';
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      L.textContent = 'Preparing ' + world + '… ' + (i + 1) + ' / ' + keys.length;
      await frame();
      if (G.CH[k]) continue;                       // the player walked into it meanwhile
      try {
        G.loadScene(k);
        if (G.CH[k]) { warm(G, G.CH[k].group); G.unloadScene(k); st.built++; }
      } catch (e) { console.error('preload ' + k, e); }
    }
    st.ms = Math.round(performance.now() - t0);
    st.done = true;
    L.style.display = 'none';
    L.textContent = '';
  }
  // If the graphics card runs out of memory, the page loses its drawing context. Keep half as many areas
  // from then on (remembered on this PC) and restart the world.
  document.addEventListener('webglcontextlost', function () {
    var G = window.GAME, kept = (G && G.CH ? Object.keys(G.CH).length : 0) + Object.keys(window.__AM_HT || {}).length;
    var cap = Math.max(4, Math.floor(Math.min(window.AM_DESKTOP_CACHE || 1e9, kept || 40) / 2));
    try { localStorage.setItem('am_desktop_cap', String(cap)); } catch (e) {}
    setTimeout(function () { location.reload(); }, 300);
  }, true);
  var tries = 0;
  (function wait() {
    if (ready()) { if (off) { st.areas = Object.keys(window.GAME.res.rects).length; st.done = true; } else run(); return; }
    if (++tries > 3600) { st.done = true; st.error = 'game never finished loading'; return; }
    setTimeout(wait, 250);
  })();
})();
