/* Load-time probe. Only runs with ?perf in the address. Shows a text report in the corner:
   loading phases, when the loading screen went away, long freezes after that and what the GPU
   was doing (shader builds, texture uploads), plus files still downloading after the game started. */
(function () {
  if (!/[?&]perf\b/.test(location.search)) return;
  var T0 = performance.now(), P = { phases: [], hide: 0, lt: [], gl: [], frames: [], res: [], dlg: 0 };
  window.__PERF = P;
  var now = function () { return performance.now(); };
  // GPU work that blocks the page: program link checks (shader compile) and texture uploads
  ['WebGL2RenderingContext', 'WebGLRenderingContext'].forEach(function (k) {
    var C = window[k]; if (!C) return; var pr = C.prototype;
    ['getProgramParameter', 'texImage2D', 'texSubImage2D', 'compressedTexImage2D', 'generateMipmap', 'texStorage2D', 'linkProgram', 'compileShader'].forEach(function (m) {
      var f = pr[m]; if (!f) return;
      pr[m] = function () { var a = now(), r = f.apply(this, arguments), d = now() - a; P.gl.push([a, d, m]); return r; };
    });
  });
  try { new PerformanceObserver(function (l) { l.getEntries().forEach(function (e) { P.lt.push([e.startTime, e.duration]); }); }).observe({ type: 'longtask', buffered: true }); } catch (e) {}
  try { new PerformanceObserver(function (l) { l.getEntries().forEach(function (e) { P.res.push([e.startTime, e.duration, e.transferSize || e.encodedBodySize || 0, e.name.replace(location.origin, '')]); }); }).observe({ type: 'resource', buffered: true }); } catch (e) {}
  var lastF = 0; (function raf(t) { if (lastF) P.frames.push([t, t - lastF]); lastF = t; if (P.frames.length < 20000) requestAnimationFrame(raf); })(0);
  var watch = function () {
    var el = document.getElementById('load'), dl = document.getElementById('dlg'), last = '';
    if (!el) return setTimeout(watch, 20);
    setInterval(function () {
      var t = el.style.display === 'none' ? 'HIDDEN' : el.textContent;
      if (t !== last) { P.phases.push([now(), t]); last = t; if (t === 'HIDDEN' && !P.hide) P.hide = now(); }
      if (!P.dlg && dl && dl.style.display === 'block') P.dlg = now();
    }, 20);
  };
  document.addEventListener('DOMContentLoaded', watch);
  var r1 = function (x) { return Math.round(x); };
  var sumIn = function (arr, a, b, f) { var s = 0, n = 0; arr.forEach(function (e) { if (e[0] >= a && e[0] < b && (!f || f(e))) { s += e[1]; n++; } }); return [r1(s), n]; };
  var report = function () {
    var H = P.hide || now(), L = [];
    L.push('PERF ' + new Date().toISOString().slice(11, 19) + '  since start ' + r1((now() - T0) / 1000) + ' s');
    P.phases.forEach(function (p) { L.push('  ' + (r1(p[0]) / 1000).toFixed(1) + 's  ' + p[1]); });
    L.push('first dialog: ' + (P.dlg ? ((P.dlg - H) / 1000).toFixed(1) + ' s after start screen' : 'none yet'));
    [[-1e9, 0, 'during loading'], [0, 5e3, '0-5 s after'], [5e3, 15e3, '5-15 s after'], [15e3, 45e3, '15-45 s after']].forEach(function (w) {
      var a = H + w[0], b = H + w[1];
      var sh = sumIn(P.gl, a, b, function (e) { return e[2] === 'getProgramParameter' || e[2] === 'linkProgram' || e[2] === 'compileShader'; });
      var tx = sumIn(P.gl, a, b, function (e) { return /tex|Mipmap/.test(e[2]); });
      var lt = sumIn(P.lt, a, b);
      var fr = P.frames.filter(function (f) { return f[0] >= a && f[0] < b; }), slow = fr.filter(function (f) { return f[1] > 100; });
      var mx = fr.reduce(function (m, f) { return Math.max(m, f[1]); }, 0);
      L.push(w[2] + ': freezes ' + lt[0] + ' ms in ' + lt[1] + ' | shaders ' + sh[0] + ' ms | textures ' + tx[0] + ' ms (' + tx[1] + ') | frames ' + fr.length + ', slow ' + slow.length + ', worst ' + r1(mx) + ' ms');
    });
    var big = P.lt.filter(function (e) { return e[0] > H - 1 && e[0] < H + 45e3; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 12);
    L.push('biggest freezes after start (s after, ms):');
    big.forEach(function (e) { var g = sumIn(P.gl, e[0], e[0] + e[1]); var sh = sumIn(P.gl, e[0], e[0] + e[1], function (x) { return /Program|Shader/.test(x[2]); }); L.push('  +' + ((e[0] - H) / 1000).toFixed(1) + '  ' + r1(e[1]) + '  (gpu calls ' + g[0] + ', shaders ' + sh[0] + ')'); });
    var after = P.res.filter(function (e) { return e[0] > H; });
    var bytes = after.reduce(function (s, e) { return s + e[2]; }, 0);
    L.push('files after start: ' + after.length + ', ' + (bytes / 1048576).toFixed(1) + ' MB');
    after.slice().sort(function (a, b) { return b[2] - a[2]; }).slice(0, 8).forEach(function (e) { L.push('  +' + ((e[0] - H) / 1000).toFixed(1) + 's ' + (e[2] / 1024 | 0) + ' KB ' + r1(e[1]) + ' ms ' + e[3].slice(-48)); });
    var before = P.res.filter(function (e) { return e[0] <= H; }), bb = before.reduce(function (s, e) { return s + e[2]; }, 0);
    L.push('files before start: ' + before.length + ', ' + (bb / 1048576).toFixed(1) + ' MB');
    return L.join('\n');
  };
  window.__PERF_REPORT = report;
  var box = null;
  setInterval(function () {
    if (!box && document.body) { box = document.createElement('pre'); box.id = 'perfout'; box.style.cssText = 'position:fixed;left:6px;top:60px;z-index:99;max-width:620px;max-height:80vh;overflow:auto;font:11px/1.25 monospace;background:rgba(0,0,0,.78);color:#9f9;padding:6px;margin:0;pointer-events:none;white-space:pre-wrap'; document.body.appendChild(box); }
    if (box) box.textContent = report();
  }, 2000);
})();
