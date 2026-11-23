# Idempotent voice fixes for sporeholm3d (built files). Usage: python3 voice_fix.py <sporeholm3d dir>
import json,re,sys,os
D=sys.argv[1]; G=os.path.join(D,'game.js'); VJ=os.path.join(D,'audio','voicebank.json')
# 1) voicebank offsets: every bank file starts with the first clip's 5,846-byte ID3 tag, but the
#    index was built as if it were 44 bytes, so every clip after the first is read 5,802 bytes early.
vb=json.load(open(VJ)); fixed=0
banks=[open(os.path.join(D,'audio',b),'rb').read() for b in vb['b']]
for f,(i,o,n) in vb['f'].items():
    B=banks[i]
    if o>0 and B[o:o+3]!=b'ID3' and B[o+5802:o+5805]==b'ID3':
        vb['f'][f]=[i,o+5802,n]; fixed+=1
    elif o==0 and n+5802<len(B) and B[n:n+3]!=b'ID3' and B[n+5802:n+5805]==b'ID3':
        vb['f'][f]=[i,0,n+5802]; fixed+=1
bad=[f for f,(i,o,n) in vb['f'].items() if banks[i][o:o+3]!=b'ID3']
assert not bad, bad[:5]
json.dump(vb,open(VJ,'w'),separators=(',',':')); print('voicebank entries fixed',fixed)
s=open(G,encoding='utf-8').read(); n0=len(s)
# 2) battle text: "Name: line" was looked up with the name, so trainer and keeper lines were silent.
#    Try the full text, then the text without the speaker name. Return the playing clip.
pat=re.compile(r'window\.VOICELINE=(\w+)=>\{Sr\[\1\]&&qe\(\1\)\};')
def rep(m):
    v=m.group(1)
    return ('window.VOICELINE=%s=>{if(Sr[%s]){qe(%s);return bt}let m=/^([^:]{1,24}):\\s(.*)$/.exec(%s);if(m&&Sr[m[2]]){qe(m[2]);return bt}return null};'%(v,v,v,v))
s,k=pat.subn(rep,s); print('VOICELINE patched',k)
# 3) battle log moved on after 0.9 s and stopped the voice mid-line. Wait for the clip to end.
old='{let w=N.lines.shift();Vt.log.textContent=w;let R=window.VOICELINE;R&&R(w)}N.wait=.9,'
new=('{let w=N.lines.shift();Vt.log.textContent=w;let R=window.VOICELINE,A=R&&R(w);N.wait=.9;'
     'if(A){N.vo=A;N.wait=Math.max(.9,Math.min(14,w.length/11+1.2));let E=()=>{N&&N.vo===A&&N.wait>.4&&(N.wait=.4)};'
     'A.addEventListener("ended",E);A.addEventListener("error",E)}}')
if old in s: s=s.replace(old,new); print('battle wait patched')
# 4) quest lines (ask / thanks / after) never looked for a voice clip.
old='H=typeof L=="string"?{text:L,file:""}:L;'
new='H=typeof L=="string"?(()=>{let f=Sr[L]||"";f&&!$n.audio[f]&&($n.audio[f]="url:audio/voice/"+f);return{text:L,file:f}})():L;'
if old in s: s=s.replace(old,new); print('quest voice lookup patched')
open(G,'w',encoding='utf-8').write(s); print('game.js',n0,'->',len(s))
