// Ground check (Nov 26). Paste into the browser console on 3d.alienmon.com (or run through a headless browser) once a world has loaded.
// For every loaded scene group it reports how many plants, pebbles and small props still float above the ground, with the worst ones,
// and how far the player's feet are from the ground under them. Nothing is changed.
(() => {
  const G = window.GAME, T = (window.SEAT && window.SEAT.T) || window.ASSETS.surf.three(), out = { feet: null, groups: [] };
  if (!G || !window.SEAT) return "game or seat.js not loaded";
  const P = G.P.position; out.feet = { at: [+P.x.toFixed(2), +P.z.toFixed(2)], playerY: +P.y.toFixed(3), groundY: +G.groundY(P.x, P.z, 1, 1).toFixed(3) };
  for (const r of G.sc.children) { let n = 0; r.traverse((o) => { if (o.isInstancedMesh) n++; }); if (!n) continue;
    const c = window.SEAT.check(r, G.res.ght, T); out.groups.push({ parts: r.children.length, plants: c.inst, floating: c.instFloat, props: c.props, propsFloating: c.propFloat, worst: c.worst.slice(0, 6) }); }
  return JSON.stringify(out, null, 1);
})();
