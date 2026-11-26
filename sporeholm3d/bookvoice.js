/* Book voices: plays story and NPC lines straight from the Book 1 audiobook (ElevenLabs_Alienmon_Book1_V3 chapter files).
   Data is in bookvoice-data.js: BOOKVOICE.ch = chapter number -> mp3 address, BOOKVOICE.map = voice file name -> [chapter, [start,end], ...] in seconds.
   Wraps window.VPLAY: a mapped line seeks the chapter file and plays only those pieces. If the chapter can't load or start
   (offline PC build, slow network), the game's own clip plays instead. Add ?bookvoice=0 to the address to switch it off. */
(function(){
  var BV=window.BOOKVOICE||{map:{},ch:{}};
  var off=/[?&]bookvoice=0\b/.test(location.search);
  var els={};      // one audio element per chapter, reused so seeks stay warm
  var cur=null;    // the line playing now
  function chapterEl(c){
    var a=els[c];
    if(!a){a=new Audio();a.preload="metadata";a.src=BV.ch[c];els[c]=a;}
    return a;
  }
  function wrap(orig){
    return function(file){
      var e=!off&&BV.map[file];
      if(!e||!BV.ch[e[0]]) return orig(file);
      if(cur) cur.stop();
      var handle=new Audio(), inner=null, stopped=false, failed=false, timer=null, raf=0;
      var a=chapterEl(e[0]), pieces=e.slice(1), k=0, started=false;
      function clear(){clearTimeout(timer);cancelAnimationFrame(raf);clearInterval(raf2);a.onseeked=null;a.onerror=null;}
      var raf2=0;
      var line={stop:function(){if(stopped)return;stopped=true;clear();try{a.pause()}catch(x){};if(inner)try{inner.pause()}catch(x){};if(cur===line)cur=null;}};
      function fallback(){
        if(stopped||failed) return; failed=true; clear(); try{a.pause()}catch(x){}
        try{inner=orig(file)}catch(x){}
      }
      function finish(){line.stop();try{handle.dispatchEvent(new Event("ended"))}catch(x){}}
      function watch(){
        if(stopped||failed) return;
        var end=pieces[k][1];
        if(a.currentTime>=end||a.ended){
          k++;
          if(k>=pieces.length){finish();return}
          playPiece();return;
        }
        raf=requestAnimationFrame(watch);
      }
      function playPiece(){
        if(stopped||failed) return;
        var p=pieces[k];
        a.pause();
        a.onseeked=function(){
          a.onseeked=null; if(stopped||failed) return;
          var pr=a.play();
          if(pr&&pr.catch) pr.catch(function(){fallback()});
          started=true; clearTimeout(timer);
          cancelAnimationFrame(raf); raf=requestAnimationFrame(watch);
          clearInterval(raf2); raf2=setInterval(function(){if(document.hidden)watch()},40);
        };
        try{a.currentTime=p[0]}catch(x){fallback()}
      }
      a.onerror=function(){fallback()};
      timer=setTimeout(function(){if(!started)fallback()},4000);   // chapter didn't load in time: use the game's clip
      handle.pause=function(){line.stop()};
      cur=line;
      if(a.readyState>=1) playPiece(); else a.addEventListener("loadedmetadata",function lm(){a.removeEventListener("loadedmetadata",lm);playPiece()});
      return handle;
    };
  }
  var real=window.VPLAY, wrapped=real?wrap(real):null;
  try{
    Object.defineProperty(window,"VPLAY",{configurable:true,get:function(){return wrapped},set:function(f){real=f;wrapped=f?wrap(f):f}});
  }catch(x){ if(real) window.VPLAY=wrapped; }
  window.BOOKVOICE_STOP=function(){if(cur)cur.stop()};
})();
