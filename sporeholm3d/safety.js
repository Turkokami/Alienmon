/* Safety net (Nov 25): puts the player back on solid ground if they ever fall through the ground, drop into a gap
   they can't climb out of, or hang stuck in the air (wedged between a wall and a cactus, say).
   Works the same with the keyboard, a controller or the phone joystick. It only reads window.GAME
   (P, groundY, canStand, vel) and moves the player back to the last spot they stood on firmly.

   - Below the ground: more than 0.6 m under the ground height for 0.4 s.
   - Stuck in the air: more than 0.3 m above the ground for 1.6 s without dropping, or airborne for 5 s at all.
   - Fell into a gap: on a spot nobody can stand on and 1.2 m below the last good spot for 0.6 s.
   A jump, the stairs and the canyon paths never trip it: those all land within a second on standable ground. */
(function () {
  var last = null, below = 0, air = 0, airY = 0, airT0 = 0, gap = 0, prev = null, note = null;
  function say(msg) {
    try {
      if (!note) { note = document.createElement('div'); note.style.cssText = 'position:fixed;left:50%;top:22%;transform:translateX(-50%);background:rgba(10,20,30,.82);color:#e8fff8;border:2px solid #5af0e0;border-radius:12px;padding:8px 16px;font:600 15px system-ui,sans-serif;z-index:9999;pointer-events:none;transition:opacity .4s;opacity:0'; document.body.appendChild(note); }
      note.textContent = msg; note.style.opacity = '1'; clearTimeout(note._t); note._t = setTimeout(function () { note.style.opacity = '0'; }, 1800);
    } catch (e) {}
  }
  function rescue(G, P) {
    if (!last) return;
    var y = G.groundY(last.x, last.z, last.y, 1);
    P.position.set(last.x, (isFinite(y) ? y : last.y) + 0.02, last.z);
    if (G.vel && G.vel.set) G.vel.set(0, 0, 0);
    below = 0; air = 0; gap = 0; prev = null;
    say('Back on solid ground');
  }
  function tick() {
    var G = window.GAME, P = G && G.P;
    if (!P || !G.groundY || !G.canStand) return;
    if (!P.visible) { last = null; prev = null; below = 0; air = 0; gap = 0; return; } // cutscenes and flights hide the player: leave those alone
    var p = P.position, x = p.x, z = p.z, y = p.y, dt = 0.1;
    if (!isFinite(x) || !isFinite(y) || !isFinite(z)) { if (last) rescue(G, P); return; }
    // a teleport (travel, doors, cutscenes) moves the player far in one step: start fresh there
    if (prev && Math.hypot(x - prev.x, z - prev.z) > 6) { last = null; below = 0; air = 0; gap = 0; }
    prev = { x: x, z: z };
    var g = G.groundY(x, z, y, 1); // pass the player's height so floors above the terrain (stairs, decks, the tower base) count
    if (!isFinite(g)) return;
    var stand = G.canStand(x, z);
    if (Math.abs(y - g) < 0.12 && stand) { last = { x: x, y: y, z: z }; below = 0; air = 0; gap = 0; return; }
    if (y < g - 0.6) { below += dt; if (below > 0.4) return rescue(G, P); } else below = 0;
    if (y > g + 0.3) {
      if (air === 0) { airY = y; airT0 = 0; }
      air += dt; airT0 += dt;
      if (y < airY - 0.3) { airY = y; airT0 = 0; }
      if (airT0 > 1.6 || air > 5) return rescue(G, P);
    } else air = 0;
    if (!stand && last && y < last.y - 1.2) { gap += dt; if (gap > 0.6) return rescue(G, P); } else gap = 0;
  }
  setInterval(function () { try { tick(); } catch (e) {} }, 100);
})();
