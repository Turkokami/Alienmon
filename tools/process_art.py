"""Clean ChatGPT Alienmon renders into game-ready sprites.
- removes the white background (flood fill from the edges, keeps interior whites like eye highlights)
- trims, centers on a square canvas with a small margin
- downsamples to SIZE px and reduces to a 64-color palette with alpha
Usage: python3 process_art.py raw_dir out_dir [mapping.json]
In mapping.json, add "|holes" after a name (e.g. "Orbitusk|holes") to also clear big white gaps enclosed by the art."""
import sys, json, os
import numpy as np
from PIL import Image
from scipy import ndimage
SIZE=192
def clean(path,holes=False):
    im=Image.open(path).convert('RGB'); a=np.asarray(im).astype(int)
    light=(a.min(axis=2)>232)
    lab,n=ndimage.label(light)
    edge=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    bg=np.isin(lab,list(edge))
    # large enclosed pure-white gaps (e.g. inside orbit rings) are background too
    pure=(a.min(axis=2)>244); l2,n2=ndimage.label(pure); sizes=ndimage.sum(pure,l2,range(1,n2+1))
    big=[i+1 for i,v in enumerate(sizes) if v>2500]
    if holes: bg|=np.isin(l2,big)
    bg=ndimage.binary_opening(bg,iterations=1)|bg
    # soften: grow background 1px into near-white fringe
    fr=ndimage.binary_dilation(bg,iterations=2)&(a.min(axis=2)>200)
    bg|=fr
    alpha=np.where(bg,0,255).astype(np.uint8)
    rgba=np.dstack([a.astype(np.uint8),alpha]); out=Image.fromarray(rgba,'RGBA')
    bb=out.getbbox(); out=out.crop(bb)
    w,h=out.size; s=int(max(w,h)*1.06)
    canvas=Image.new('RGBA',(s,s),(0,0,0,0)); canvas.paste(out,((s-w)//2,(s-h)//2))
    small=canvas.convert('RGBa').resize((SIZE,SIZE),Image.LANCZOS).convert('RGBA')
    arr=np.asarray(small).copy(); arr[...,3]=np.where(arr[...,3]>110,255,0)  # hard edge like pixel art
    small=Image.fromarray(arr,'RGBA')
    q=small.quantize(colors=64,method=Image.Quantize.FASTOCTREE,dither=Image.Dither.NONE)
    return q
if __name__=='__main__':
    raw,out=sys.argv[1],sys.argv[2]; os.makedirs(out,exist_ok=True)
    mp={f:os.path.splitext(f)[0] for f in os.listdir(raw) if f.lower().endswith('.png')}
    if len(sys.argv)>3: mp.update(json.load(open(sys.argv[3])))
    for f,name in mp.items():
        holes=name.endswith('|holes'); name=name.split('|')[0]
        q=clean(os.path.join(raw,f),holes); p=os.path.join(out,name+'.png'); q.save(p,optimize=True); print(name,os.path.getsize(p))
