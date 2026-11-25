/* Cutaway walls (Nov 25): inside the finished rooms (room kit) the wall on the camera's side of the player is hidden, so the
   camera can sit back at its normal distance and show the whole room instead of squeezing in against the wall behind you.
   roomkit.js tags each wall piece with its side (userData.rkEdge = n, s, e or w); game.js lets the camera ray pass through
   tagged walls (the static-mesh merge keeps the tag, one merged mesh per side); this file hides the tagged pieces whose side lies between the player and the camera. */
(function () {
  var list = [], seen = null, t = 0;
  function scan(sc) { list = []; var T = window.THREE || (window.GAME && window.GAME.T); sc.traverse(function (o) { if (o.userData && o.userData.rkEdge && o.geometry) { if (!o.userData.rkBB) { var v = o.visible; o.visible = true; o.userData.rkBB = T ? new T.Box3().setFromObject(o) : (o.geometry.computeBoundingBox(), o.geometry.boundingBox); o.visible = v; } list.push(o); } }); }
  function loop() {
    try {
      var G = window.GAME, sc = G && G.sc, cam = G && G.cam, P = G && G.P;
      if (sc && cam && P) {
        var now = performance.now(); if (sc !== seen || now - t > 1000) { scan(sc); seen = sc; t = now; }
        var c = cam.position, p = P.position;
        for (var i = 0; i < list.length; i++) { var o = list[i], bb = o.userData.rkBB, e = o.userData.rkEdge, hide = false;
          if (e === 's') hide = c.z > bb.min.z && p.z < bb.max.z; else if (e === 'n') hide = c.z < bb.max.z && p.z > bb.min.z;
          else if (e === 'e') hide = c.x > bb.min.x && p.x < bb.max.x; else if (e === 'w') hide = c.x < bb.max.x && p.x > bb.min.x;
          if (hide) { if (o.visible) { o.visible = false; o.userData.rkHid = 1; } } else if (o.userData.rkHid) { o.visible = true; o.userData.rkHid = 0; } }
      }
    } catch (err) {}
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
