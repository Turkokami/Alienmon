/* Alienmon 3D: graphic novel cutscenes.
   Story cutscene lines that match an entry in window.COMIC_DATA.lines show that Book 1 panel full screen
   behind the dialog box, with a comic panel reveal and a slow pan or zoom. The panel stays up for the
   following lines until another mapped line, a line mapped to null (back to the 3D scene) or the end of
   the cutscene. game.js calls window.__COMIC.line(text) for every cutscene line and __COMIC.end() when a
   cutscene finishes. Pictures are small WebP files in art/gn/, loaded only when their scene plays.
   Add ?nocomic to the address to turn this off. */
(function () {
  "use strict";
  if (/[?&#]nocomic/.test(location.search + location.hash)) return;
  const D = window.COMIC_DATA || { lines: [], panels: {} };
  const norm = (t) => String(t || "").replace(/\s+/g, " ").trim().toLowerCase();
  const keys = D.lines.map(([k, id]) => [norm(k), id]);
  const order = D.lines.map((l) => l[1]).filter(Boolean);

  const css = document.createElement("style");
  css.textContent = `
#gnLayer{position:fixed;inset:0;z-index:16;background:#05070b;opacity:0;transition:opacity .45s;pointer-events:none;overflow:hidden}
#gnLayer.on{opacity:1}
#gnLayer .gnp{position:absolute;inset:0;background:center/cover no-repeat;will-change:transform,clip-path,opacity}
#gnLayer .gnp.in{animation:gnIn .7s cubic-bezier(.2,.8,.2,1) both}
#gnLayer .gnp.out{animation:gnOut .5s ease both}
#gnLayer .gnk{position:absolute;inset:-4%;background:inherit;background-size:cover;background-position:center;will-change:transform}
#gnLayer .gnf{position:absolute;inset:0;box-shadow:inset 0 0 0 6px #f4ecd8,inset 0 0 0 9px #111;opacity:0;animation:gnFrame .9s ease both;pointer-events:none}
@keyframes gnIn{0%{clip-path:inset(12% 14% 12% 14% round 4px);transform:scale(.96) rotate(-.6deg);opacity:0}35%{opacity:1}100%{clip-path:inset(0 0 0 0);transform:none;opacity:1}}
@keyframes gnOut{to{opacity:0}}
@keyframes gnFrame{0%{opacity:1}70%{opacity:.8}100%{opacity:0}}
@keyframes gn_zin{from{transform:scale(1)}to{transform:scale(1.09)}}
@keyframes gn_zout{from{transform:scale(1.09)}to{transform:scale(1)}}
@keyframes gn_panl{from{transform:scale(1.07) translateX(2.5%)}to{transform:scale(1.07) translateX(-2.5%)}}
@keyframes gn_panr{from{transform:scale(1.07) translateX(-2.5%)}to{transform:scale(1.07) translateX(2.5%)}}
@keyframes gn_up{from{transform:scale(1.07) translateY(2.5%)}to{transform:scale(1.07) translateY(-2.5%)}}
@keyframes gn_down{from{transform:scale(1.07) translateY(-2.5%)}to{transform:scale(1.07) translateY(2.5%)}}
@media (prefers-reduced-motion:reduce){#gnLayer .gnk{animation:none!important}#gnLayer .gnp.in{animation-duration:.01s}}`;
  document.head.appendChild(css);

  let layer = null, cur = null, curId = null, active = false;
  const cache = {};
  const url = (id) => (D.panels[id] && D.panels[id].f) || "art/gn/" + id + ".webp";
  const preload = (id) => { if (!id || cache[id]) return; const im = new Image(); im.decoding = "async"; im.src = url(id); cache[id] = im; };
  const moves = ["zin", "panl", "zout", "panr", "up", "down"];
  const moveFor = (id) => (D.panels[id] && D.panels[id].m) || moves[(parseInt(String(id).slice(-2), 10) || 0) % moves.length];

  const ensure = () => {
    if (layer) return layer;
    layer = document.createElement("div");
    layer.id = "gnLayer";
    document.body.appendChild(layer);
    return layer;
  };
  const show = (id) => {
    if (id === curId) return;
    ensure();
    preload(id);
    const p = document.createElement("div");
    p.className = "gnp in";
    const k = document.createElement("div");
    k.className = "gnk";
    k.style.backgroundImage = "url(" + url(id) + ")";
    k.style.animation = "gn_" + moveFor(id) + " " + ((D.panels[id] && D.panels[id].s) || 14) + "s ease-in-out both";
    p.appendChild(k);
    const f = document.createElement("div");
    f.className = "gnf";
    p.appendChild(f);
    layer.appendChild(p);
    const old = cur;
    if (old) { old.className = "gnp out"; setTimeout(() => old.remove(), 600); }
    cur = p; curId = id; active = true;
    layer.classList.add("on");
    const st = document.getElementById("csStill"); if (st) st.style.opacity = "0";
    const i = order.indexOf(id);
    if (i >= 0) { preload(order[i + 1]); preload(order[i + 2]); }
  };
  const hide = () => {
    active = false; curId = null;
    if (!layer) return;
    layer.classList.remove("on");
    const old = cur; cur = null;
    if (old) setTimeout(() => { if (cur !== old) old.remove(); }, 500);
  };
  /* Lines are listed in story order. Search forward from the last matched line first, so a short
     line that appears in two scenes picks the one that comes next in the story. Short keys must match
     exactly; longer ones may also match the start of a line. */
  let pos = -1;
  const hit = (t, k) => t === k || (k.length >= 24 && t.startsWith(k));
  const find = (text) => {
    const t = norm(text);
    if (!t) return undefined;
    const n = keys.length;
    for (let j = 1; j <= n; j++) {
      const i = (pos + j) % n;
      if (hit(t, keys[i][0])) { pos = i; return keys[i][1]; }
    }
    return undefined;
  };

  window.__COMIC = {
    /* returns true while a panel is showing for this line */
    line(text) {
      const id = find(text);
      if (id === null) hide();
      else if (id) show(id);
      return active;
    },
    end() { hide(); },
    active: () => active,
    data: D,
  };
})();
