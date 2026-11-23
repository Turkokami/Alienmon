/* Objective banner sits at the bottom centre, just above where the talk and cutscene boxes appear.
   It fades out while a talk box, cutscene box, battle screen or end card is showing, so it never covers them.
   The "E: talk" hint moves up to sit above the banner. */
(function () {
  var st = document.createElement('style');
  st.textContent =
    '#objHud{top:auto!important;bottom:140px!important;transition:opacity .2s}' +
    '#objHud.ohide{opacity:0!important;pointer-events:none!important}' +
    '#hint{bottom:186px!important}' +
    '@media (max-height:560px){#objHud{bottom:124px!important}#hint{bottom:166px!important}}';
  (document.head || document.documentElement).appendChild(st);
  var shown = function (id) {
    var e = document.getElementById(id); if (!e) return false;
    var cs = getComputedStyle(e);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.05;
  };
  setInterval(function () {
    var hs = document.querySelectorAll('#objHud'); if (!hs.length) return;
    var hide = shown('dlg') || shown('csBox') || shown('btUI') || shown('endCard') || shown('syncUI');
    for (var i = 0; i < hs.length; i++) hs[i].classList.toggle('ohide', hide);
  }, 100);
})();
