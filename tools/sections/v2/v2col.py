"""V2 collision helper (run from repo root).
Spec: scratchpad/v2spec/<id>.json  {"seed": [[x,y],...], "thr": 14, "tex": 12, "grass": [[x,y],...], "walk": [[x0,y0,x1,y1],...], "block": [...], "gr": [...]}
  seed: tiles on walkable ground; ground grows to 4-neighbours whose mean colour is within thr of any seed colour
  grass seeds grow the same way into ',' tiles; walk/block/gr rects (inclusive) are hand overrides applied last.
usage: v2col.py id [id...] [--write]    writes ov2_<id>.png (always) and data/collision/<id>.json (--write)
"""
import json,sys,os
import numpy as np
from PIL import Image,ImageDraw
from collections import deque
S='tools/sections/v2/'
sys.path.insert(0,'tools/sections')
A={s['id']:s for s in json.load(open('art/sections/atlas.json',encoding='utf-8'))['sections']}
A2={s['id']:s for s in json.load(open(S+'atlas_v2.json',encoding='utf-8'))['sections']}
def edge_seeds(sid):
    W,H=A[sid]['tiles'];out=[]
    for e in A2[sid]['exits']:
        if e['kind']!='edge': continue
        sd=e['side']
        for r in (7,8):
            out.append({'left':[1,r],'right':[W-2,r],'top':[r,1],'bottom':[r,H-2]}[sd])
    return out
def lab(rgb):
    c=rgb/255.0; c=np.where(c>0.04045,((c+0.055)/1.055)**2.4,c/12.92)
    xyz=c@np.array([[0.4124,0.3576,0.1805],[0.2126,0.7152,0.0722],[0.0193,0.1192,0.9505]]).T; xyz/=np.array([0.9505,1.0,1.089])
    f=np.where(xyz>0.008856,np.cbrt(xyz),7.787*xyz+16/116)
    return np.stack([116*f[...,1]-16,500*(f[...,0]-f[...,1]),200*(f[...,1]-f[...,2])],-1)
def tiles(img):
    a=np.asarray(img.convert('RGB'),float);H,W=a.shape[0]//16,a.shape[1]//16
    t=a[:H*16,:W*16].reshape(H,16,W,16,3).transpose(0,2,1,3,4).reshape(H,W,256,3);L=lab(t);m=L.mean(2)
    return m,np.linalg.norm(L-m[:,:,None,:],axis=-1).mean(2)
def grow(m,tex,seeds,thr,texthr,H,W):
    cols=[m[y,x] for x,y in seeds];ok=np.zeros((H,W),bool)
    for c in cols: ok|=np.linalg.norm(m-c,axis=-1)<thr
    ok&=tex<texthr; out=np.zeros((H,W),bool);q=deque()
    for x,y in seeds: out[y,x]=True;q.append((x,y))
    while q:
        x,y=q.popleft()
        for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
            X,Y=x+dx,y+dy
            if 0<=X<W and 0<=Y<H and ok[Y,X] and not out[Y,X]: out[Y,X]=True;q.append((X,Y))
    return out
def run(sid,write):
    s=A[sid];p=s['file'].replace('art/sections/','art/sections_game/');img=Image.open(p);W,H=s['tiles']
    sp=json.load(open(S+f'spec/{sid}.json')) if os.path.exists(S+f'spec/{sid}.json') else {}
    m,tex=tiles(img);g=np.full((H,W),'#')
    if 'seed' not in sp: sp['seed']=edge_seeds(sid)
    if sp.get('seed'): g[grow(m,tex,sp['seed'],sp.get('thr',14),sp.get('tex',14),H,W)]='.'
    if sp.get('grass'): g[grow(m,tex,sp['grass'],sp.get('gthr',12),sp.get('gtex',30),H,W)]=','
    for k,ch in(('walk','.'),('gr',','),('block','#')):
        for x0,y0,x1,y1 in sp.get(k,[]): g[y0:y1+1,x0:x1+1]=ch
    rows=[''.join(r) for r in g]
    Z=4;T=16*Z;base=img.convert('RGBA').resize((W*T,H*T),Image.NEAREST);im=Image.new('RGBA',base.size,(0,0,0,0));d=ImageDraw.Draw(im)
    for y in range(H):
        for x in range(W):
            c=rows[y][x]
            if c=='#': d.rectangle([x*T,y*T,x*T+T-1,y*T+T-1],fill=(255,0,0,55))
            elif c==',': d.rectangle([x*T+3,y*T+3,x*T+T-4,y*T+T-4],outline=(0,255,0,200),width=2)
            d.rectangle([x*T,y*T,x*T+T-1,y*T+T-1],outline=(255,255,255,50))
            if x==0 or y==0: d.text((x*T+3,y*T+3),f'{x if y==0 else ""}{"," if x==0 and y==0 else ""}{y if x==0 else ""}',fill=(255,255,0,255))
    for k,col in(('marks',(0,255,255,255)),):
        for x,y,lbl in sp.get(k,[]): d.rectangle([x*T+4,y*T+4,x*T+T-5,y*T+T-5],outline=col,width=3);d.text((x*T+8,y*T+20),lbl[:7],fill=(255,255,255,255))
    base.alpha_composite(im);base.convert('RGB').save('ov2_'+f'{sid}.png')
    if write:
        p2=f'data/collision/{sid}.json';old=json.load(open(p2)) if os.path.exists(p2) else {}
        json.dump({'id':sid,'name':s['name'],'tiles':[W,H],'edited':True,'v2':True,'legend':{'.':'walk','#':'blocked',',':'tall grass'},'rows':rows},open(p2,'w'))
for sid in [a for a in sys.argv[1:] if not a.startswith('--')]: run(sid,'--write' in sys.argv)
