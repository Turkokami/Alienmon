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

  /* Each panel is shown whole ("contain") inside the space between the game's cutscene bars (.lbox, 9vh
     each), never cropped, whatever the window's shape. A blurred, darkened copy of the same panel fills
     the rest of the screen, so a wide or tall window shows no empty bands. The slow pan or zoom moves
     the whole framed picture by at most 4%, and the frame keeps a margin wide enough for that, so the
     edges of the art always stay on screen. While a panel shows, the dialog box drops down onto the
     bottom bar like a subtitle so it covers as little of the picture as possible. */
  const css = document.createElement("style");
  css.textContent = `
#gnLayer{position:fixed;inset:0;z-index:16;background:#05070b;opacity:0;transition:opacity .45s;pointer-events:none;overflow:hidden}
#gnLayer.on{opacity:1}
#gnLayer .gnp{position:absolute;inset:0}
#gnLayer .gnp.out{animation:gnOut .5s ease both}
#gnLayer .gnb{position:absolute;inset:-6%;background:center/cover no-repeat;filter:blur(26px) brightness(.42) saturate(1.15)}
#gnLayer .gnw{position:absolute;top:calc(9vh + 2.4vh);bottom:calc(9vh + 2.4vh);left:2.4vw;right:2.4vw;display:flex;align-items:center;justify-content:center}
#gnLayer .gnc{position:relative;max-width:100%;max-height:100%;aspect-ratio:var(--gnar,1.5);height:100%;will-change:transform}
#gnLayer .gnc.in{animation:gnIn .7s cubic-bezier(.2,.8,.2,1) both}
#gnLayer .gnk{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;border-radius:3px;box-shadow:0 10px 40px rgba(0,0,0,.55);will-change:transform}
#gnLayer .gnf{position:absolute;inset:0;border-radius:3px;box-shadow:inset 0 0 0 5px #f4ecd8,inset 0 0 0 8px #111;opacity:0;animation:gnFrame .9s ease both;pointer-events:none}
@supports not (aspect-ratio:1){#gnLayer .gnc{height:auto;width:100%}#gnLayer .gnk{position:static;height:auto;max-height:76vh}}
body.gn-on #csBox{bottom:max(8px,1.4vh)!important}
body.gn-on #csPt{bottom:calc(max(8px,1.4vh) + 2px)!important}
@keyframes gnIn{0%{clip-path:inset(12% 14% 12% 14% round 4px);transform:scale(.96) rotate(-.6deg);opacity:0}35%{opacity:1}100%{clip-path:inset(0 0 0 0);transform:none;opacity:1}}
@keyframes gnOut{to{opacity:0}}
@keyframes gnFrame{0%{opacity:1}70%{opacity:.8}100%{opacity:0}}
@keyframes gn_zin{from{transform:scale(1)}to{transform:scale(1.04)}}
@keyframes gn_zout{from{transform:scale(1.04)}to{transform:scale(1)}}
@keyframes gn_panl{from{transform:scale(1.03) translateX(1%)}to{transform:scale(1.03) translateX(-1%)}}
@keyframes gn_panr{from{transform:scale(1.03) translateX(-1%)}to{transform:scale(1.03) translateX(1%)}}
@keyframes gn_up{from{transform:scale(1.03) translateY(1%)}to{transform:scale(1.03) translateY(-1%)}}
@keyframes gn_down{from{transform:scale(1.03) translateY(-1%)}to{transform:scale(1.03) translateY(1%)}}
@media (prefers-reduced-motion:reduce){#gnLayer .gnk{animation:none!important}#gnLayer .gnc.in{animation-duration:.01s}}`;
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
    const src = url(id);
    const p = document.createElement("div");
    p.className = "gnp";
    const bg = document.createElement("div");
    bg.className = "gnb";
    bg.style.backgroundImage = "url(" + src + ")";
    const w = document.createElement("div");
    w.className = "gnw";
    const c = document.createElement("div");
    c.className = "gnc in";
    const k = document.createElement("img");
    k.className = "gnk";
    k.alt = "";
    k.decoding = "async";
    k.src = src;
    const setAr = () => { if (k.naturalWidth && k.naturalHeight) c.style.setProperty("--gnar", k.naturalWidth / k.naturalHeight); };
    if (k.complete) setAr(); else k.addEventListener("load", setAr, { once: true });
    k.style.animation = "gn_" + moveFor(id) + " " + ((D.panels[id] && D.panels[id].s) || 14) + "s ease-in-out both";
    const f = document.createElement("div");
    f.className = "gnf";
    c.appendChild(k);
    c.appendChild(f);
    w.appendChild(c);
    p.appendChild(bg);
    p.appendChild(w);
    layer.appendChild(p);
    const old = cur;
    if (old) { old.className = "gnp out"; setTimeout(() => old.remove(), 600); }
    cur = p; curId = id; active = true;
    layer.classList.add("on");
    document.body.classList.add("gn-on");
    const st = document.getElementById("csStill"); if (st) st.style.opacity = "0";
    const i = order.indexOf(id);
    if (i >= 0) { preload(order[i + 1]); preload(order[i + 2]); }
  };
  const hide = () => {
    active = false; curId = null;
    document.body.classList.remove("gn-on");
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
