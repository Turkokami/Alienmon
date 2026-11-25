/* Touch controls for phones and tablets (Nov 24).
   Turns on by itself on touch-screen devices (pointer: coarse). Add ?touch=1 to force it on, ?touch=0 to force it off.
   Desktop and the PC build never see any of this: with touch off this file only sets window.__TOUCH = false.

   - Left thumb: a joystick appears where you touch. Push it to walk, push it all the way out to run.
     game.js reads window.__TM ({on, f, s, run}) in its walk step, so the stick steers in any direction, not just 8.
   - Right side: drag to turn the camera, pinch with two fingers to zoom (sent to the game as mouse drags and wheel turns).
   - Buttons: A = talk / catch / OK (E), B = back (Esc), Jump (Space), Bag (Tab), Map (M), Menu (Enter), full screen.
   - Tapping a talk box, a cutscene box or the "talk to" hint does the same as A.
   - Battle menus, the bag, shops and the Linker menu already take taps; this file only sizes them for a phone.
   - Sets window.__PRM so the High/Medium/Low graphics presets keep a sharp picture now that the page uses the phone's
     real screen width (the viewport tag in index.html). The game's frame-rate governor still lowers it if a phone struggles. */
(function () {
  var Q = new URLSearchParams(location.search), force = Q.get('touch');
  var coarse = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
  var ON = force === '1' || (force !== '0' && coarse);
  window.__TOUCH = ON;
  if (!ON) return;
  window.__PRM = Math.max(1, Math.min(2, (window.devicePixelRatio || 1) * 0.75));
  var TM = window.__TM = { on: false, f: 0, s: 0, run: false };
  var root = document.documentElement;
  root.classList.add('tc', 'tc-loading');

  var css = document.createElement('style');
  css.textContent = [
    'html.tc,html.tc body{touch-action:none;overscroll-behavior:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;position:fixed;inset:0;width:100%;height:100%}',
    'html.tc canvas{touch-action:none}',
    'html.tc #help,html.tc #lkHint{display:none!important}',
    'html.tc #fps{top:calc(2px + env(safe-area-inset-top));right:auto;left:50%;transform:translateX(-50%);font-size:9px;opacity:.4;pointer-events:none}',
    'html.tc #rpgHud{top:calc(6px + env(safe-area-inset-top))!important;right:calc(6px + env(safe-area-inset-right))!important;font-size:10px!important;min-width:0!important;max-width:40vw;padding:4px 7px!important;opacity:.88}',
    'html.tc #rpgHud .m{gap:4px!important;margin:2px 0!important}',
    'html.tc.tc-battle #rpgHud{display:none!important}',
    'html.tc #rpgHud div[style*="margin-top:4px"]{display:none}',
    '#tcX{display:none}html.tc #tcX{display:flex;position:absolute;top:-14px;right:-10px;width:34px;height:34px;border-radius:50%;align-items:center;justify-content:center;background:#1a2a36;border:2px solid #c8f06a;color:#c8f06a;font:700 16px system-ui;cursor:pointer}html.tc #dlg{padding-right:30px!important}',
    'html.tc #dlg{left:calc(8px + env(safe-area-inset-left))!important;right:calc(54px + env(safe-area-inset-right));width:auto!important;transform:none!important;bottom:calc(150px + env(safe-area-inset-bottom))!important;padding:8px 12px!important;font-size:14px;cursor:pointer}',
    '#tcTL{position:fixed;left:calc(6px + env(safe-area-inset-left));top:calc(6px + env(safe-area-inset-top));max-width:calc(58vw - 12px);display:flex;flex-direction:column;align-items:flex-start;gap:4px;z-index:5;pointer-events:none}',
    'html.tc #tcTL #objHud{position:static!important;transform:none!important;left:auto!important;top:auto!important;bottom:auto!important;font-size:11px!important;line-height:1.25;padding:4px 8px!important;max-width:100%!important;gap:6px!important;box-sizing:border-box}',
    'html.tc #tcTL #objHud #objArrow{width:34px!important;height:34px!important}',
    'html.tc #tcTL .tcFlog{position:static!important;left:auto!important;bottom:auto!important;font-size:10px!important;padding:3px 8px!important;max-width:100%;box-sizing:border-box;opacity:.85}',
    'html.tc.tc-battle #tcTL,html.tc.tc-loading #tcTL{display:none}',
    'html.tc #hint{bottom:calc(178px + env(safe-area-inset-bottom))!important;pointer-events:auto;font-size:13px;max-width:70vw;text-align:center}',
    'html.tc #csBox{font-size:15px;padding-top:10px;padding-bottom:10px;padding-right:14px}html.tc #csBox:not(.hasPt){padding-left:14px}html.tc #csBox.hasPt{padding-left:calc(min(150px,17vw) + 18px);min-height:calc(min(150px,17vw) + 4px)}',
    'html.tc .hpb{top:calc(6px + env(safe-area-inset-top))!important;min-width:0!important;width:min(46vw,260px);box-sizing:border-box;font-size:11px!important;padding:5px 8px!important}',
    'html.tc #hpL{right:calc(6px + env(safe-area-inset-right))!important}html.tc #hpR{left:calc(6px + env(safe-area-inset-left))!important}',
    'html.tc #btUI{font-size:13px}',
    'html.tc #btUI .log{padding:7px 12px;min-height:0;margin-bottom:6px;width:96vw;box-sizing:border-box}',
    'html.tc #btUI .menu{grid-template-columns:repeat(auto-fit,minmax(112px,1fr));gap:5px;width:96vw;margin-bottom:calc(8px + env(safe-area-inset-bottom))}',
    'html.tc #btUI .menu div{padding:8px 4px;font-size:13px}',
    'html.tc .rpgP .w{padding:10px 10px;width:96vw;max-height:90vh;box-sizing:border-box}',
    'html.tc .rpgP .g{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}',
    'html.tc .rpgP .tabs span[data-tab],html.tc .rpgP .tabs span.on{padding:8px 12px}',
    'html.tc .rpgP .list{max-height:60vh}',
    'html.tc .rpgP .keys,html.tc .lk-foot span:last-child{display:none}',
    '#tcPad,#tcAct,#tcSide{position:fixed;z-index:12;display:none}',
    'html.tc.tc-free #tcPad,html.tc.tc-free #tcAct,html.tc.tc-free #tcSide{display:block}',
    'html.tc.tc-battle #tcAct,html.tc.tc-panel #tcAct,html.tc.tc-linker #tcAct{display:block}',
    'html.tc.tc-battle #tcAct{z-index:16}html.tc.tc-panel #tcAct{z-index:26}html.tc.tc-linker #tcAct{z-index:41}',
    '#tcPad{left:0;top:0;width:0;height:0;pointer-events:none}',
    '#tcBase{position:fixed;width:116px;height:116px;margin:-58px 0 0 -58px;border-radius:50%;border:2px solid rgba(234,255,244,.35);background:radial-gradient(circle,rgba(20,40,50,.25),rgba(20,40,50,.12));opacity:.55;transition:opacity .15s}',
    '#tcBase.on{opacity:1}',
    '#tcKnob{position:absolute;left:50%;top:50%;width:50px;height:50px;margin:-25px 0 0 -25px;border-radius:50%;background:rgba(200,240,106,.55);border:2px solid rgba(255,255,255,.7);box-shadow:0 2px 8px #0008}',
    '#tcBase.run #tcKnob{background:rgba(255,190,80,.75)}',
    '.tcB{position:fixed;display:flex;align-items:center;justify-content:center;border-radius:50%;font:800 15px system-ui;color:#fff;background:rgba(12,24,34,.45);border:2px solid rgba(234,255,244,.45);text-shadow:0 1px 3px #000;box-sizing:border-box;touch-action:none}',
    '.tcB.dn{background:rgba(200,240,106,.55);transform:scale(.94)}',
    '#tcA{width:66px;height:66px;font-size:22px;border-color:rgba(200,240,106,.8);right:calc(16px + env(safe-area-inset-right));bottom:calc(26px + env(safe-area-inset-bottom))}',
    '#tcJ{width:54px;height:54px;font-size:12px;right:calc(94px + env(safe-area-inset-right));bottom:calc(18px + env(safe-area-inset-bottom))}',
    '#tcBk{width:48px;height:48px;font-size:17px;right:calc(26px + env(safe-area-inset-right));bottom:calc(104px + env(safe-area-inset-bottom))}',
    'html.tc-battle #tcJ,html.tc-panel #tcJ,html.tc-linker #tcJ,html.tc-linker #tcA{display:none}',
    'html.tc-battle #tcA{bottom:auto;top:calc(42vh - 33px)}html.tc-battle #tcBk{bottom:auto;top:calc(42vh + 42px)}',
    'html.tc-panel #tcA{display:none}html.tc-panel #tcBk,html.tc-linker #tcBk{bottom:auto;top:calc(8px + env(safe-area-inset-top));right:calc(8px + env(safe-area-inset-right))}',
    '#tcBag{bottom:calc(176px + env(safe-area-inset-bottom))}#tcMap{bottom:calc(214px + env(safe-area-inset-bottom))}#tcMenu{bottom:calc(252px + env(safe-area-inset-bottom))}#tcFs{bottom:calc(290px + env(safe-area-inset-bottom))}',
    '.tcS{position:fixed;right:calc(8px + env(safe-area-inset-right));width:46px;height:30px;border-radius:9px;font:700 11px system-ui;color:#eafff4;background:rgba(12,24,34,.5);border:1px solid rgba(90,240,224,.45);display:flex;align-items:center;justify-content:center;touch-action:none}',
    '.tcS.dn{background:rgba(90,240,224,.4)}',
    '#tcTip{position:fixed;left:50%;top:38%;transform:translate(-50%,-50%);z-index:13;max-width:84vw;background:rgba(10,20,30,.82);border:1px solid #5af0e0;border-radius:12px;padding:10px 14px;font:13px/1.5 system-ui;color:#eafff4;text-align:center;pointer-events:none;transition:opacity .5s}',
    '@media (orientation:landscape) and (max-height:500px){#tcA{width:60px;height:60px}#tcBk{bottom:calc(92px + env(safe-area-inset-bottom))}.tcS{bottom:calc(10px + env(safe-area-inset-bottom))!important}#tcBag{right:calc(160px + env(safe-area-inset-right))}#tcMap{right:calc(212px + env(safe-area-inset-right))}#tcMenu{right:calc(264px + env(safe-area-inset-right))}#tcFs{right:calc(316px + env(safe-area-inset-right))}html.tc #hint{bottom:calc(96px + env(safe-area-inset-bottom))!important}html.tc #csBox{bottom:8px!important}html.tc #csPt{bottom:10px!important}html.tc #dlg{bottom:calc(8px + env(safe-area-inset-bottom))!important;right:calc(372px + env(safe-area-inset-right))}}'
  ].join('\n');
  (document.head || root).appendChild(css);

  // ---------- helpers
  var shown = function (el) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (!el || !el.getClientRects().length) return false;
    var cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.05;
  };
  var key = function (type, code, k) {
    var e = new KeyboardEvent(type, { code: code, key: k, bubbles: true, cancelable: true });
    (document.body || root).dispatchEvent(e);
  };
  var press = function (code, k) { key('keydown', code, k); key('keyup', code, k); };
  var canv = null, canvT = 0;
  var gameCanvas = function () {   // the biggest canvas on the page is the 3D view
    var now = performance.now();
    if (canv && canv.isConnected && now - canvT < 1500) return canv;
    canvT = now; var best = null, ba = 0;
    document.querySelectorAll('canvas').forEach(function (c) { var r = c.getBoundingClientRect(), a = r.width * r.height; if (a > ba) { ba = a; best = c; } });
    return (canv = best);
  };
  var look = function (dx, dy) {   // the game turns its cameras on mouse drags (buttons held, movementX/Y)
    var c = gameCanvas(); if (!c) return;
    var e = new MouseEvent('mousemove', { bubbles: true, cancelable: true, buttons: 1, movementX: dx, movementY: dy });
    try { Object.defineProperty(e, 'movementX', { value: dx }); Object.defineProperty(e, 'movementY', { value: dy }); } catch (er) {}
    c.dispatchEvent(e);
  };
  var zoom = function (d) {
    var c = gameCanvas(); if (!c) return;
    c.dispatchEvent(new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: d, deltaMode: 0 }));
  };
  var goFull = function () {
    var d = document, el = root;
    if (d.fullscreenElement || d.webkitFullscreenElement) return;
    if (window.matchMedia && (matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches)) return;
    try { var p = (el.requestFullscreen || el.webkitRequestFullscreen).call(el, { navigationUI: 'hide' }); p && p.catch && p.catch(function () {}); } catch (er) {}
  };
  var toggleFull = function () {
    var d = document;
    if (d.fullscreenElement || d.webkitFullscreenElement) { try { (d.exitFullscreen || d.webkitExitFullscreen).call(d); } catch (er) {} }
    else goFull();
  };

  // ---------- state: what is on screen decides which controls show
  var mode = 'loading';
  var linkerMode = function () { return window.LINKER && window.LINKER.mode; };
  var calc = function () {
    if (shown('load')) return 'loading';
    if (linkerMode()) return 'linker';
    var R = window.RPG;
    if (R && R.B) return 'battle';
    if (R && R.PN && R.PN.open) return 'panel';
    if (shown('csBox') || shown('endCard') || shown('syncUI')) return 'talk';
    return 'free';
  };
  var setMode = function (m) {
    if (m === mode) return;
    root.classList.remove('tc-' + mode); mode = m; root.classList.add('tc-' + m);
    if (m !== 'free') stickEnd();
  };

  // ---------- build the controls once the page body exists
  var base, knob, tl;
  var build = function () {
    var pad = document.createElement('div'); pad.id = 'tcPad';
    pad.innerHTML = '<div id="tcBase"><div id="tcKnob"></div></div>';
    document.body.appendChild(pad);
    base = document.getElementById('tcBase'); knob = document.getElementById('tcKnob');
    stickHome();
    var act = document.createElement('div'); act.id = 'tcAct';
    act.innerHTML = '<div class="tcB" id="tcA">A</div><div class="tcB" id="tcJ">Jump</div><div class="tcB" id="tcBk">B</div>';
    document.body.appendChild(act);
    var side = document.createElement('div'); side.id = 'tcSide';
    var sb = [['tcBag', 'Bag'], ['tcMap', 'Map'], ['tcMenu', 'Menu'], ['tcFs', '⛶']];
    side.innerHTML = sb.map(function (b) { return '<div class="tcS" id="' + b[0] + '">' + b[1] + '</div>'; }).join('');
    document.body.appendChild(side);
    tl = document.createElement('div'); tl.id = 'tcTL'; document.body.appendChild(tl);

    btn('tcA', function () { aDown(); }, function () { key('keyup', 'KeyE', 'e'); });
    btn('tcJ', function () { key('keydown', 'Space', ' '); }, function () { key('keyup', 'Space', ' '); });
    btn('tcBk', function () { back(); }, function () {});
    btn('tcBag', function () { press('Tab', 'Tab'); }, function () {});
    btn('tcMap', function () { if (window.LINKER && !linkerMode()) window.LINKER.openMap(); }, function () {});
    btn('tcMenu', function () { if (window.LINKER) linkerMode() ? window.LINKER.close() : window.LINKER.openMenu(); }, function () {});
    btn('tcFs', toggleFull, function () {});

    // tapping the "E  Talk to ..." hint or the team box works like A / Bag
    var hint = document.getElementById('hint');
    if (hint) {
      hint.addEventListener('touchend', function (e) { e.preventDefault(); press('KeyE', 'e'); });
      hint.addEventListener('click', function () { press('KeyE', 'e'); });
      new MutationObserver(function () { var t = hint.textContent; if (/^E\s\s/.test(t)) hint.textContent = 'Ⓐ ' + t.replace(/^E\s+/, ''); }).observe(hint, { childList: true, characterData: true, subtree: true });
    }
    var dlg = document.getElementById('dlg');
    if (dlg) {
      dlg.addEventListener('click', function () { press('KeyE', 'e'); });
      var x = document.createElement('div'); x.id = 'tcX'; x.textContent = '\u2715'; x.setAttribute('aria-label', 'Close');
      var shut = function (e) { e.preventDefault(); e.stopPropagation(); closeDlg(); };
      x.addEventListener('touchend', shut, { passive: false }); x.addEventListener('touchstart', function (e) { e.stopPropagation(); }, { passive: true });
      x.addEventListener('click', shut);
      dlg.appendChild(x);
    }
    setInterval(tick, 120); tick();
    tip();
  };
  var btn = function (id, down, up) {
    var el = document.getElementById(id);
    el.addEventListener('touchstart', function (e) { e.preventDefault(); e.stopPropagation(); el.classList.add('dn'); firstTouch(); down(); }, { passive: false });
    var end = function (e) { e.preventDefault(); e.stopPropagation(); el.classList.remove('dn'); up(); };
    el.addEventListener('touchend', end, { passive: false }); el.addEventListener('touchcancel', end, { passive: false });
    el.addEventListener('click', function () { down(); up(); });   // a mouse click (?touch=1 on a computer); real taps never get here because touchstart is cancelled
  };
  var aDown = function () {
    var lm = linkerMode();
    if (lm === 'entry' || lm === 'dexEntry' || lm === 'map' || lm === 'help') { back(); return; }
    key('keydown', 'KeyE', 'e');
  };
  var closeDlg = function () {   // ends a townsperson chat (game.js sets window.__closeDlg); walking away still works too
    if (window.__closeDlg) window.__closeDlg(); else { var d = document.getElementById('dlg'); if (d) d.style.display = 'none'; }
  };
  var back = function () {   // B: the Linker panels ignore made-up key presses, so close them through their own calls
    var L = window.LINKER, lm = linkerMode();
    if (!lm && shown('dlg') && !shown('csBox')) { closeDlg(); return; }
    if (lm) {
      if (lm === 'dexEntry') L.openDex(); else if (lm === 'dex' || lm === 'help' || lm === 'newgame') L.openMenu(); else L.close();
      return;
    }
    press('Escape', 'Escape');
  };

  // ---------- keep the corner HUD tidy: objective and field log stacked top-left, small
  var tick = function () {
    setMode(calc());
    var oh = document.getElementById('objHud');
    if (oh && tl && oh.parentNode !== tl) tl.insertBefore(oh, tl.firstChild);
    if (tl && !tl.querySelector('.tcFlog')) {
      var kids = document.body.children;
      for (var i = 0; i < kids.length; i++) { var k = kids[i]; if (!k.id && k.tagName === 'DIV' && /^Field log/.test(k.textContent || '')) { k.classList.add('tcFlog'); tl.appendChild(k); break; } }
    }
  };

  // ---------- joystick and camera drag
  var R = 54, stick = null, cams = {}, pinch = null, taps = {};
  var stickHome = function () {
    if (!base) return;
    var landscape = innerWidth > innerHeight;
    base.style.left = (landscape ? 96 : 84) + 'px';
    base.style.top = (innerHeight - (landscape ? 96 : 120)) + 'px';
    knob.style.transform = ''; base.classList.remove('on', 'run');
  };
  var stickEnd = function () { stick = null; TM.on = false; TM.f = TM.s = 0; TM.run = false; stickHome(); };
  var stickMove = function (x, y) {
    var dx = x - stick.x, dy = y - stick.y, d = Math.hypot(dx, dy), m = Math.min(1, d / R);
    if (d > R) { dx = dx / d * R; dy = dy / d * R; }
    knob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    if (m < 0.18) { TM.on = true; TM.f = TM.s = 0; TM.run = false; }
    else { TM.on = true; TM.f = -dy / R; TM.s = dx / R; TM.run = m > 0.88; }
    base.classList.toggle('run', TM.run);
  };
  var onCanvas = function (t) { return t && (t.tagName === 'CANVAS' || t === document.body || t === root); };
  var firstDone = false;
  var firstTouch = function () { if (firstDone) return; firstDone = true; goFull(); };
  document.addEventListener('touchstart', function (e) {
    if (mode === 'loading') return;
    var used = false;
    for (var i = 0; i < e.changedTouches.length; i++) {
      var t = e.changedTouches[i];
      if (!onCanvas(t.target)) continue;
      used = true;
      taps[t.identifier] = { x: t.clientX, y: t.clientY, t: performance.now() };
      if (mode === 'free' && !stick && t.clientX < innerWidth * 0.45) {
        var x = Math.max(R + 8, Math.min(innerWidth * 0.45, t.clientX)), y = Math.max(R + 8, Math.min(innerHeight - R - 8, t.clientY));
        stick = { id: t.identifier, x: x, y: y };
        base.style.left = x + 'px'; base.style.top = y + 'px'; base.classList.add('on');
        stickMove(t.clientX, t.clientY);
      } else {
        cams[t.identifier] = { x: t.clientX, y: t.clientY };
      }
    }
    var ids = Object.keys(cams);
    if (ids.length === 2) { var a = cams[ids[0]], b = cams[ids[1]]; pinch = Math.hypot(a.x - b.x, a.y - b.y); }
    if (used) { e.preventDefault(); firstTouch(); }
  }, { passive: false, capture: true });
  document.addEventListener('touchmove', function (e) {
    var used = false;
    for (var i = 0; i < e.changedTouches.length; i++) {
      var t = e.changedTouches[i];
      if (stick && t.identifier === stick.id) { stickMove(t.clientX, t.clientY); used = true; continue; }
      var c = cams[t.identifier]; if (!c) continue;
      used = true;
      var dx = t.clientX - c.x, dy = t.clientY - c.y; c.x = t.clientX; c.y = t.clientY;
      if (Object.keys(cams).length === 1 && (dx || dy)) look(dx * 1.7, dy * 1.4);
    }
    var ids = Object.keys(cams);
    if (ids.length === 2 && pinch) {
      var a = cams[ids[0]], b = cams[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (Math.abs(d - pinch) > 2) { zoom((pinch - d) * 2.2); pinch = d; }
    }
    if (used) e.preventDefault();
  }, { passive: false, capture: true });
  var touchEnd = function (e) {
    for (var i = 0; i < e.changedTouches.length; i++) {
      var t = e.changedTouches[i], tp = taps[t.identifier];
      delete taps[t.identifier];
      if (stick && t.identifier === stick.id) stickEnd();
      if (cams[t.identifier]) { delete cams[t.identifier]; pinch = null; }
      // a quick tap on the 3D view moves talk boxes and battle text along, like A
      if (tp && e.type === 'touchend' && performance.now() - tp.t < 300 && Math.hypot(t.clientX - tp.x, t.clientY - tp.y) < 12) {
        if (mode === 'talk') press('KeyE', 'e');
        else if (mode === 'battle') { var mn = document.querySelector('#btUI .menu'); if (!mn || getComputedStyle(mn).display === 'none') press('KeyE', 'e'); }
      }
    }
  };
  document.addEventListener('touchend', touchEnd, { passive: false, capture: true });
  document.addEventListener('touchcancel', touchEnd, { passive: false, capture: true });
  addEventListener('resize', function () { if (!stick) stickHome(); });
  // no pinch-zoom or double-tap zoom of the page itself
  document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
  document.addEventListener('dblclick', function (e) { e.preventDefault(); });

  // ---------- one-time tip
  var tip = function () {
    var seen = false; try { seen = localStorage.getItem('am_touch_tip') === '1'; } catch (er) {}
    if (seen) return;
    var wait = setInterval(function () {
      if (mode !== 'free') return;
      clearInterval(wait);
      var d = document.createElement('div'); d.id = 'tcTip';
      d.innerHTML = '<b style="color:#c8f06a">Touch controls</b><br>Left thumb: move (push far to run)<br>Drag the right side: look around · Pinch: zoom<br>Ⓐ talk, catch, OK · Ⓑ back · tap boxes to read on';
      document.body.appendChild(d);
      setTimeout(function () { d.style.opacity = '0'; setTimeout(function () { d.remove(); }, 600); }, 7000);
      try { localStorage.setItem('am_touch_tip', '1'); } catch (er) {}
    }, 500);
  };

  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
