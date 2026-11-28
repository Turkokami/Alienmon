"""Wires Glyphos (ASSETS.fn.gmap in sporeholm3d/glyphos.js) into the minified sporeholm3d/game.js and index.html.
Re-applied on live maps-v2 (Nov 28 2026). Every replacement must match exactly once (count asserted), so a
changed game.js shows up as a clear failure. Glyphos is reached the same way as Thalassa and Neonis: the
?world= URL parameter (remembered in localStorage am_world) and the F9 tester-travel world list.
GY1 is the Glyphos flag. It also sets Ne0X, so Glyphos runs on the Neonis map pipeline (scene streaming,
detail batches, stub story, no Dustara NPCs), with its own map function, spawn, sky, fog and light.
Run from the repo root:  python3 tools/glyphos3d/patch_game.py ."""
import sys, re
root = sys.argv[1] if len(sys.argv) > 1 else "."
p = root + '/sporeholm3d/game.js'; s = open(p, encoding="utf8").read()
def rep(a, b, n=1):
    global s
    c = s.count(a)
    assert c == n, (c, a[:80])
    s = s.replace(a, b)
if 'GY1=' in s: sys.exit("game.js already has Glyphos (GY1)")
# world list in the ?world= / localStorage parser
W = 's==="sporeholm"||s==="dustara"||s==="ferrox"||s==="thalassa"||s==="neonis"'
rep(W, W + '||s==="glyphos"')
W2 = 'e==="sporeholm"||e==="dustara"||e==="ferrox"||e==="thalassa"||e==="neonis"'
rep(W2, W2 + '||e==="glyphos"')
# the flag (only when glyphos.js actually loaded), map function, spawn, window flag
rep('Ne0X=np==="neonis",', 'GY1=np==="glyphos"&&!!(window.ASSETS&&ASSETS.fn&&ASSETS.fn.gmap),Ne0X=np==="neonis"||GY1,')
rep('Z0=Ne0X?"nmap"', 'Z0=GY1?"gmap":Ne0X?"nmap"')
rep('sc=Ne0X?[85.5,49]', 'sc=GY1?[55.5,166]:Ne0X?[85.5,49]')
rep('window.NEO=Ne0X;', 'window.NEO=Ne0X;window.GLY=GY1;')
# exposure, fog colour, no Neonis baked ground pictures
rep('s.toneMappingExposure=gs?1.32:Ne0X?1.25', 's.toneMappingExposure=gs?1.32:GY1?1.12:Ne0X?1.25')
rep('e.fog=new xl(Ne0X?"#2a1a4a"', 'e.fog=new xl(GY1?"#d8c49a":Ne0X?"#2a1a4a"')
rep('c=Ne0X?$n.groundN||null', 'c=GY1?null:Ne0X?$n.groundN||null')
# golden dusk over the ruins (map guide: "ancient ruins world at golden dusk") instead of the Neonis neon dusk, no daytime stars, the sun disc instead of the two Neonis moons
rep('L=D.createLinearGradient(0,0,0,512);Ne0X?(L.addColorStop(0,"#0c0628")',
    'L=D.createLinearGradient(0,0,0,512);GY1?(L.addColorStop(0,"#3a5a8a"),L.addColorStop(.28,"#7a9ac0"),L.addColorStop(.42,"#e8c890"),L.addColorStop(.5,"#ffd890"),L.addColorStop(.54,"#e0b070"),L.addColorStop(.6,"#a89060"),L.addColorStop(1,"#4a5a38")):Ne0X?(L.addColorStop(0,"#0c0628")')
rep('!ts||Ne0X){let I=[];for(let oe=0;oe<1800;', '!ts||Ne0X&&!GY1){let I=[];for(let oe=0;oe<1800;')
rep('ts&&!Ne0X?[[-210,70,-150,16,"#fff2c8"]]', 'ts&&(!Ne0X||GY1)?[[-210,70,-150,16,"#fff2c8"]]')
# day light (U(): fog colour, hemisphere ground colour, sun strength and colour)
rep('gs?"#8a5a44":Ne0X?"#3a2860"', 'gs?"#8a5a44":GY1?"#d8c49a":Ne0X?"#3a2860"')
rep('gs?"#605058":Ne0X?"#3a2a5a"', 'gs?"#605058":GY1?"#6a6040":Ne0X?"#3a2a5a"')
rep('gs?2.4:Ne0X?1.5:2.6', 'gs?2.4:GY1?2.3:Ne0X?1.5:2.6')
rep('gs?"#ffe0c4":Ne0X?"#d0b8ff"', 'gs?"#ffe0c4":GY1?"#ffd9a0":Ne0X?"#d0b8ff"')
# help title and the F9 tester-travel world list
rep('v.textContent=Ne0X?"Neonis \\u2014 Neon City"', 'v.textContent=GY1?"Glyphos \\u2014 Sunken Landing":Ne0X?"Neonis \\u2014 Neon City"')
rep('["neonis","Neonis (preview)"]]', '["neonis","Neonis (preview)"],["glyphos","Glyphos (preview)"]]')
open(p, 'w', encoding="utf8").write(s)
# index.html: load glyphos.js (1.5 MB) only when the game is going to Glyphos, right after detailkit.js
p = root + '/sporeholm3d/index.html'; s = open(p, encoding="utf8").read()
if 'glyphos.js' not in s:
    m = re.search(r'<script src="detailkit\.js\?v=[A-Za-z0-9]+"></script>', s); a = m.group(0)
    b = a + '''<script>(function(){var W=["sporeholm","dustara","ferrox","thalassa","neonis","glyphos"],w=null;try{w=new URLSearchParams(location.search).get("world");if(W.indexOf(w)<0)w=localStorage.getItem("am_world")}catch(e){}if(w==="glyphos")document.write('<script src="glyphos.js?v=gy1"><\\/script>')})()</script>'''
    rep(a, b); open(p, 'w', encoding="utf8").write(s)
print('patched')
