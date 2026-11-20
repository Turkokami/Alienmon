import sys
root=sys.argv[1]
p=root+'/sporeholm3d/game.js'; s=open(p).read()
def rep(a,b,n=1):
    global s
    c=s.count(a)
    assert c==n,(c,a[:80])
    s=s.replace(a,b)
W='s==="sporeholm"||s==="dustara"||s==="ferrox"||s==="thalassa"||s==="neonis"'
rep(W, W+'||s==="glyphos"')
W2='e==="sporeholm"||e==="dustara"||e==="ferrox"||e==="thalassa"||e==="neonis"'
rep(W2, W2+'||e==="glyphos"')
rep('Ne0X=np==="neonis",','GY1=np==="glyphos"&&!!(window.ASSETS&&ASSETS.fn&&ASSETS.fn.gmap),Ne0X=np==="neonis"||GY1,')
rep('Z0=Ne0X?"nmap"','Z0=GY1?"gmap":Ne0X?"nmap"')
rep('sc=Ne0X?[85.5,49]','sc=GY1?[55.5,166]:Ne0X?[85.5,49]')
rep('window.NEO=Ne0X;','window.NEO=Ne0X;window.GLY=GY1;')
rep('s.toneMappingExposure=gs?1.32:Ne0X?1.25','s.toneMappingExposure=gs?1.32:GY1?1.18:Ne0X?1.25')
rep('e.fog=new xl(Ne0X?"#2a1a4a"','e.fog=new xl(GY1?"#b4ccb0":Ne0X?"#2a1a4a"')
rep('c=Ne0X?$n.groundN||null','c=GY1?null:Ne0X?$n.groundN||null')
rep('L=D.createLinearGradient(0,0,0,512);Ne0X?(L.addColorStop(0,"#0c0628")','L=D.createLinearGradient(0,0,0,512);GY1?(L.addColorStop(0,"#4a8ac8"),L.addColorStop(.3,"#8ac0e0"),L.addColorStop(.45,"#d8ecd8"),L.addColorStop(.5,"#f4f0c8"),L.addColorStop(.55,"#b8d0a0"),L.addColorStop(1,"#4a6a48")):Ne0X?(L.addColorStop(0,"#0c0628")')
rep('!ts||Ne0X){let I=[];for(let oe=0;oe<1800;','!ts||Ne0X&&!GY1){let I=[];for(let oe=0;oe<1800;')
rep('ts&&!Ne0X?[[-210,70,-150,16,"#fff2c8"]]','ts&&(!Ne0X||GY1)?[[-210,70,-150,16,"#fff2c8"]]')
rep('he?"#121a34":Ne0X?"#3a2860"','he?"#121a34":GY1?"#b4ccb0":Ne0X?"#3a2860"')
rep('be.groundColor.set(he?"#2a2030":Ne0X?"#3a2a5a"','be.groundColor.set(he?"#2a2030":GY1?"#6a7a48":Ne0X?"#3a2a5a"')
rep('le.intensity=v?.25:he?1.1:Ne0X?1.5:2.6,le.color.set(he?"#b8c8ff":Ne0X?"#d0b8ff"','le.intensity=v?.25:he?1.1:GY1?2.4:Ne0X?1.5:2.6,le.color.set(he?"#b8c8ff":GY1?"#fff0cc":Ne0X?"#d0b8ff"')
rep('v.textContent=Ne0X?"Neonis \\u2014 Neon City"','v.textContent=GY1?"Glyphos \\u2014 Dig Camp":Ne0X?"Neonis \\u2014 Neon City"')
rep('["neonis","Neonis (preview)"]]','["neonis","Neonis (preview)"],["glyphos","Glyphos (preview)"]]')
open(p,'w').write(s)
p=root+'/sporeholm3d/index.html'; s=open(p).read()
import re
m=re.search(r'<script src="world\.js\?v=[a-z0-9]+"></script>',s); a=m.group(0)
b=a+'''<script>(function(){var W=["sporeholm","dustara","ferrox","thalassa","neonis","glyphos"],w=null;try{w=new URLSearchParams(location.search).get("world");if(W.indexOf(w)<0)w=localStorage.getItem("am_world")}catch(e){}if(w==="glyphos")document.write('<script src="glyphos.js?v=g1"><\\/script>')})()</script>'''
rep(a,b); open(p,'w').write(s); print('patched')
