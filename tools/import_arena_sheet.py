"""Cut Linker Arena renders (docs/arena/prompts) into game-ready files.
poses: a 1536x1024 pose sheet (3x2 cells, white background) -> art/arena/poses/<Name>_<pose>.png
       All six poses share one scale and stand on the same baseline, so walk and attack frames line up in game.
fx:    an effect, tile or hazard sheet (transparent or flat green/magenta key) -> art/arena/<key>.webp
       Background removed and halved (1536x1024 -> 768x512, sliced by the game as 4x2 cells of 192x256;
       1024x1024 tile sheets -> 512x512, 4x4 cells of 128x128).
Usage:
  python3 tools/import_arena_sheet.py poses art/arena/raw/Zib_arena.png Zib
  python3 tools/import_arena_sheet.py poses --all              (every art/arena/raw/*_arena.png)
  python3 tools/import_arena_sheet.py fx art/arena/raw/fx/static_zap.png fx/static_zap
  python3 tools/import_arena_sheet.py fx --all                 (every png in art/arena/raw/fx, tiles and hazards)
Add --holes to a poses import to clear large enclosed white gaps (same rule as process_art.py)."""
import sys, os, glob
import numpy as np
from PIL import Image
from scipy import ndimage
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')
POSES=['side_a','side_b','atk_front','atk_back','hurt','ko']
SIZE=192

def white_mask(a,holes=False):
    """Background mask for a white-backed cell: near-white regions touching the cell edge (process_art.py rules)."""
    lab,_=ndimage.label(a.min(axis=2)>232)
    edge=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    bg=np.isin(lab,list(edge))
    if holes:
        pure=a.min(axis=2)>244; l2,n2=ndimage.label(pure); sizes=ndimage.sum(pure,l2,range(1,n2+1))
        bg|=np.isin(l2,[i+1 for i,v in enumerate(sizes) if v>2500])
    bg=ndimage.binary_opening(bg,iterations=1)|bg
    return bg|(ndimage.binary_dilation(bg,iterations=2)&(a.min(axis=2)>200))

def poses(src,name,holes=False):
    im=Image.open(src).convert('RGB').resize((1536,1024),Image.LANCZOS); a=np.asarray(im).astype(int)
    cells=[]
    for i in range(6):
        x,y=(i%3)*512,(i//3)*512; c=a[y:y+512,x:x+512]
        bg=white_mask(c,holes); fg=~bg
        lab,n=ndimage.label(fg)   # drop specks: keep pieces at least 2% of the largest
        if n:
            sz=ndimage.sum(fg,lab,range(1,n+1)); fg=np.isin(lab,[j+1 for j,v in enumerate(sz) if v>=sz.max()*0.02])
        ys,xs=np.nonzero(fg)
        if not len(ys): print('  empty cell',POSES[i]); cells.append(None); continue
        rgba=np.dstack([c.astype(np.uint8),np.where(fg,255,0).astype(np.uint8)])
        cells.append(Image.fromarray(rgba,'RGBA').crop((xs.min(),ys.min(),xs.max()+1,ys.max()+1)))
    big=max(max(c.size) for c in cells if c)
    k=SIZE*0.94/big   # one scale for the whole sheet
    out=os.path.join(ROOT,'art/arena/poses'); os.makedirs(out,exist_ok=True)
    for pose,c in zip(POSES,cells):
        if c is None: continue
        w,h=max(1,round(c.size[0]*k)),max(1,round(c.size[1]*k))
        small=c.convert('RGBa').resize((w,h),Image.LANCZOS).convert('RGBA')
        canvas=Image.new('RGBA',(SIZE,SIZE),(0,0,0,0)); canvas.paste(small,((SIZE-w)//2,SIZE-4-h),small)   # bottom-aligned
        arr=np.asarray(canvas).copy(); arr[...,3]=np.where(arr[...,3]>110,255,0)
        q=Image.fromarray(arr,'RGBA').quantize(colors=64,method=Image.Quantize.FASTOCTREE,dither=Image.Dither.NONE)
        q.save(os.path.join(out,f'{name}_{pose}.png'),optimize=True)
    print(name,'->',', '.join(p for p,c in zip(POSES,cells) if c))

def repack(out,grid):
    """Lift every frame out whole and put it in a roomier cell. Renders often spill past the nominal grid lines
    (spray, wave crests, particles), so slicing the sheet on the grid clipped pieces and pulled in bits of neighbours.
    Each separate blob goes to the cell its centre sits in; every cell keeps its nominal centre, so animations stay
    aligned. The new cell size (sheet width / cols) tells the game how much bigger than nominal each cell is."""
    cols,rows=grid; H,W=out.shape[:2]; nw,nh=W/cols,H/rows
    out=out.copy(); out[...,3]=np.where(out[...,3]<8,0,out[...,3])
    lab,n=ndimage.label(ndimage.binary_dilation(out[...,3]>0,iterations=2)); lab=np.where(out[...,3]>0,lab,0)
    slot=np.zeros(n+1,int)-1
    for i,(cy,cx) in enumerate(ndimage.center_of_mass(out[...,3]>0,lab,range(1,n+1)),1):
        if cy==cy: slot[i]=min(rows-1,int(cy//nh))*cols+min(cols-1,int(cx//nw))
    # a blob wider or taller than a cell is frames touching each other (beams, waves): split those on the grid lines
    for i,b in enumerate(ndimage.find_objects(lab),1):
        if b and (b[1].stop-b[1].start>1.15*nw or b[0].stop-b[0].start>1.15*nh): slot[i]=-2
    S=slot[lab]; S[lab==0]=-1
    gy,gx=np.nonzero(S==-2); S[gy,gx]=np.minimum(rows-1,(gy//nh).astype(int))*cols+np.minimum(cols-1,(gx//nw).astype(int))
    ys,xs=np.nonzero(S>=0); s=S[ys,xs]
    ccx=(s%cols+0.5)*nw; ccy=(s//cols+0.5)*nh
    keep=(np.abs(xs-ccx)<nw*0.8)&(np.abs(ys-ccy)<nh*0.8); ys,xs,s,ccx,ccy=ys[keep],xs[keep],s[keep],ccx[keep],ccy[keep]   # cells grow at most 60%
    ex=max(nw/2,np.abs(xs-ccx).max()+3) if len(xs) else nw/2; ey=max(nh/2,np.abs(ys-ccy).max()+3) if len(ys) else nh/2
    cw,ch=int(np.ceil(ex))*2,int(np.ceil(ey))*2; cw+=cw%2; ch+=ch%2   # even, so halving keeps the grid exact
    new=np.zeros((ch*rows,cw*cols,4),np.uint8)
    nx=((s%cols)*cw+cw/2+(xs-ccx)).astype(int); ny=((s//cols)*ch+ch/2+(ys-ccy)).astype(int)
    new[ny,nx]=out[ys,xs]
    return new

def fx(src,key):
    im=Image.open(src).convert('RGBA'); a=np.asarray(im).astype(int)
    if a[...,3].min()<250: alpha=a[...,3]   # already transparent
    else:
        corner=np.median(np.concatenate([a[:8,:8,:3].reshape(-1,3),a[-8:,-8:,:3].reshape(-1,3)]),axis=0)
        d=np.abs(a[...,:3]-corner).max(axis=2)
        alpha=np.clip((d-40)*4,0,255)   # soft key so glows keep their falloff
        rgb=a[...,:3].astype(float); m=(alpha>0)&(alpha<255)   # remove key-color spill on the soft edge
        spill=np.argmax(corner); rgb[...,spill]=np.where(m,np.minimum(rgb[...,spill],rgb[...,[c for c in range(3) if c!=spill]].max(axis=2)),rgb[...,spill])
        a[...,:3]=rgb
    out=np.dstack([a[...,:3],alpha]).astype(np.uint8)
    out=repack(out,(4,4) if key.startswith('tiles/') else (4,2))
    dst=os.path.join(ROOT,'art/arena',key+'.webp'); os.makedirs(os.path.dirname(dst),exist_ok=True)
    Image.fromarray(out,'RGBA').resize((out.shape[1]//2,out.shape[0]//2),Image.LANCZOS).save(dst,quality=88,method=6)
    print(key,'-> art/arena/'+key+'.webp')

if __name__=='__main__':
    args=[x for x in sys.argv[1:] if not x.startswith('--')]; holes='--holes' in sys.argv
    if not args or args[0] not in('poses','fx'): sys.exit(__doc__)
    if '--all' in sys.argv:
        if args[0]=='poses':
            for f in sorted(glob.glob(os.path.join(ROOT,'art/arena/raw/*_arena.png'))): poses(f,os.path.basename(f)[:-len('_arena.png')],holes)
        else:
            for sub in('fx','tiles','hazards'):
                for f in sorted(glob.glob(os.path.join(ROOT,'art/arena/raw',sub,'*.png'))): fx(f,sub+'/'+os.path.splitext(os.path.basename(f))[0])
    elif len(args)==3: (poses(args[1],args[2],holes) if args[0]=='poses' else fx(args[1],args[2]))
    else: sys.exit(__doc__)
