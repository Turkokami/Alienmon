"""Sort a folder of new ChatGPT renders into the Alienmon project.

Usage:  python tools/import_renders.py "C:\\Users\\turko\\Downloads\\Alienmon"  [--dry-run]

What it does (by filename, case-insensitive; numbers/underscores/dashes are ignored):
  * Alienmon name (e.g. "054_Cactling.png", "cactling-final.png")
        -> art/raw/<Name>.png  and a processed sprite in art/sprites/<Name>.png
  * Character key (sola, vashti, hank, boy_down, girl_big, nurse, ...)
        -> art/characters/<key>.png  (background removed, trimmed, resized)
  * Planet + kind (e.g. "pyros_battle_background.png", "thalassa key art.png")
        battle / key art / landing  -> art/scenes/<planet>_<kind>.jpg (1536x1024)
        orb / planet sprite          -> art/planets/<planet>.png
        town / walkable / map        -> art/maps_incoming/<file>  (needs a walk mask, see CLAUDE.md)
  * Anything else -> listed under "unmatched" in import_report.json so a human/Claude can look at it.
Nothing is overwritten unless --force is given (existing files are reported as "exists").
Subfolders are searched too, and the structured render-set layout (see structured()) is recognised first.
"""
import sys, os, re, json, shutil
from PIL import Image
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0,os.path.join(ROOT,'tools'))
from process_art import clean  # same cleaner used for the existing 26 sprites

def norm(s): return re.sub(r'[^a-z]','',s.lower())
mons=json.load(open(os.path.join(ROOT,'data/batches/batch01_kessler/alienmon.json')))
MON={norm(m['name']):m['name'] for m in mons}
CHARKEYS=['boy_big','boy_down','boy_left','boy_right','boy_up','girl_big','girl_down','girl_left','girl_right','girl_up','basalt','civilian','explorer','grub','guard','hank','ingrid','kade','marisol','marsh','miner','moor','nurse','orra','pilgrim','researcher','shop','sola','sporefolk','squidsailor','static','strand','technician','thorne','twins','vashti','vex','wanderer','ystran','teo','bronn','mom','harrow','saga','ostrander','rook']
CHAR={norm(k):k for k in CHARKEYS}
ALIAS={'drimogenvashti':'vashti','imogenvashti':'vashti','solareyes':'sola','hankbriggs':'hank','lysamoor':'moor','drlysamoor':'moor','deliamarsh':'marsh','captaindeliamarsh':'marsh','djstatic':'static','raekim':'static','oldbasalt':'basalt','ingridvale':'ingrid','echoiris':'twins','echoandiris':'twins','mortimerkade':'kade','kaelthorne':'thorne','directorthorne':'thorne','adminvex':'vex','orravenn':'orra','marisolfenn':'marisol','helixstrand':'strand','teoreyes':'teo','adminbronn':'bronn','dukeharrow':'harrow','generalostrander':'ostrander','nursejoy':'nurse','playerboy':'boy_big','playergirl':'girl_big'}
PLANETS=['dustara','ferrox','sporeholm','thalassa','neonis','glyphos','pyros','glacia','helix','halo','umbra','starfall','apex','ystra']
CHAR_SIZE={'big':160,'down':64,'up':64,'left':64,'right':64}

def char_sprite(src,key,out):
    q=clean(src)          # 192px quantized, transparent bg
    size=CHAR_SIZE.get(key.split('_')[-1],128)
    q.convert('RGBA').resize((size,size),Image.LANCZOS).quantize(colors=64,dither=Image.Dither.NONE).save(out,optimize=True)

# ---- structured render sets (the folder layout the render bot produces) ----
# creatures/<front|back|overworld>/NNN_Name_<kind>.png, characters/<battle|overworld>/char_NN_Name_<kind>.png,
# world/<planet>/world_<planet>_NNx_<kind>.png.  Files ending in _v2/_v3... are alternates and are only reported.
CREATURE_RE=re.compile(r'^(?:alienmon_)?\d{3}_([A-Za-z]+)_(front|back|overworld)(_v\d+)?$')
CHAR_RE=re.compile(r'^char_\d+_(.+)_(battle|overworld)$')
WORLD_RE=re.compile(r'^world_([a-z]+)_\d+[a-zA-Z]_(.+)$')
CHAR_FULL={'rookplayer':'boy','solareyes':'sola','drimogenvashti':'vashti','grub':'grub','teodoroteoreyes':'teo',
 'directorkaelthorne':'thorne','adminvex':'vex','adminbronn':'bronn','helixstrandgrunt':'strand','hankbriggs':'hank',
 'drlysamoor':'moor','captaindeliamarsh':'marsh','raedjstatickim':'static','oldbasalt':'basalt','ingridvale':'ingrid',
 'echoandiris':'twins','mortimerkade':'kade','marisolfenn':'marisol','dukeharrow':'harrow','saga':'saga',
 'generalostrander':'ostrander','orravenn':'orra','mom':'mom'}
PLANET_DIR={'helixstation':'helix','starfallrift':'starfall','apexarray':'apex'}
# battle/landing/arena art is drawn into a 640px-wide canvas, so 960x640 keeps it crisp at a third of the bytes
SCENE_MAX=(960,640)
# creatures whose white eyes/lights look like holes to process_art.is_hole(); cleaned without hole removal
NO_AUTO_HOLES={'Bulbit','Filamaw','Zib'}
WORLD_KIND={'battle_background':'battle','landing_key_art':'keyart','keeper_arena_interior':'arena'}

def save_scene(src,dst):
    im=Image.open(src).convert('RGB'); im.thumbnail(SCENE_MAX,Image.LANCZOS); im.save(dst,quality=84,optimize=True)

def walk_frames(src):
    """Split a walk sheet laid out in rows (down, up, left, right) into one frame per direction: the first figure of each row."""
    import numpy as np
    from scipy import ndimage
    a=np.asarray(Image.open(src).convert('RGB')).astype(int)
    ink=ndimage.binary_dilation(a.min(axis=2)<225,iterations=6)
    lab,n=ndimage.label(ink); boxes=[b for b in ndimage.find_objects(lab) if (b[0].stop-b[0].start)>60]
    rows=[]
    for b in sorted(boxes,key=lambda b:(b[0].start+b[0].stop)/2):
        cy=(b[0].start+b[0].stop)/2
        if rows and abs(rows[-1][0]-cy)<60: rows[-1][1].append(b)
        else: rows.append([cy,[b]])
    if len(rows)!=4: raise ValueError(f'expected 4 rows of walk frames, found {len(rows)}')
    im=Image.open(src)
    return [im.crop((b[1].start,b[0].start,b[1].stop,b[0].stop)) for b in (min(r[1],key=lambda b:b[1].start) for r in rows)]

def walk_pair(src,dst,holes=True):
    """The overworld render is two walk frames side by side on white: clean each half and pack them into a 128x64 strip."""
    import tempfile
    im=Image.open(src).convert('RGB'); w,h=im.size; strip=Image.new('RGBA',(128,64),(0,0,0,0))
    for i in range(2):
        t=os.path.join(tempfile.mkdtemp(),'half.png'); im.crop((i*w//2,0,(i+1)*w//2,h)).save(t)
        fr=clean(t,holes='auto' if holes else False).convert('RGBA').resize((64,64),Image.LANCZOS)
        strip.paste(fr,(i*64,0),fr)
    strip.quantize(colors=64,method=Image.Quantize.FASTOCTREE,dither=Image.Dither.NONE).save(dst,optimize=True)

def structured(p,f,dry,force,rep):
    """Handle one file from a structured render set. Returns False if the name does not follow that layout."""
    base=os.path.splitext(f)[0]
    m=CREATURE_RE.match(base)
    if m:
        name=MON.get(norm(m.group(1)))
        if not name: rep['unmatched'].append(p); return True
        if m.group(3): rep['alternates'].append([p,name]); return True
        kind=m.group(2)
        if kind=='overworld':   # two-frame walk strip for wild Alienmon drawn in towns
            rel='art/overworld/'+name+'.png'; dst=os.path.join(ROOT,rel)
            if os.path.exists(dst) and not force: rep['exists'].append([p,rel]); return True
            if not dry: walk_pair(p,dst,name not in NO_AUTO_HOLES)
            rep['overworld'].append([f,rel]); return True
        rel=('art/sprites/' if kind=='front' else 'art/sprites_back/')+name+'.png'; dst=os.path.join(ROOT,rel)
        if os.path.exists(dst) and not force: rep['exists'].append([p,rel]); return True
        if not dry: clean(p,holes=False if name in NO_AUTO_HOLES else 'auto').save(dst,optimize=True)
        rep['alienmon' if kind=='front' else 'alienmon_back'].append([f,rel]); return True
    m=CHAR_RE.match(base)
    if m:
        key=CHAR_FULL.get(norm(m.group(1)))
        if not key: rep['unmatched'].append(p); return True
        if key=='boy':   # the player: portrait from the battle render, four walk frames from the overworld sheet
            outs=['boy_big'] if m.group(2)=='battle' else ['boy_down','boy_up','boy_left','boy_right']
        else:
            if m.group(2)=='overworld': rep['not_used_yet'].append(p); return True
            outs=[key]
        if not dry:
            if m.group(2)=='battle': char_sprite(p,outs[0],os.path.join(ROOT,'art/characters',outs[0]+'.png'))
            else:
                import tempfile
                for k,fr in zip(outs,walk_frames(p)):
                    t=os.path.join(tempfile.mkdtemp(),k+'.png'); fr.save(t); char_sprite(t,k,os.path.join(ROOT,'art/characters',k+'.png'))
        rep['characters'].append([f,outs]); return True
    m=WORLD_RE.match(base)
    if m:
        planet=PLANET_DIR.get(m.group(1),m.group(1)); kind=m.group(2)
        if planet not in PLANETS: rep['not_used_yet'].append(p); return True
        if kind=='planet_sprite':
            rel='art/planets/'+planet+'.png'
            if not dry: clean(p).save(os.path.join(ROOT,rel),optimize=True)
            rep['planets'].append([f,rel])
        elif kind in WORLD_KIND:
            rel=f'art/scenes/{planet}_{WORLD_KIND[kind]}.jpg'; dst=os.path.join(ROOT,rel)
            if os.path.exists(dst) and not force: rep['exists'].append([p,rel]); return True
            if not dry: save_scene(p,dst)
            rep['scenes'].append([f,rel])
        elif kind.startswith('walkable_'):
            rel='art/maps_incoming/'+base+'.jpg'
            if not dry: Image.open(p).convert('RGB').save(os.path.join(ROOT,rel),quality=90,optimize=True)
            rep['maps'].append([f,rel])
        else: rep['not_used_yet'].append(p)
        return True
    return False

def main():
    src=sys.argv[1]; dry='--dry-run' in sys.argv; force='--force' in sys.argv
    rep={'alienmon':[],'alienmon_back':[],'overworld':[],'characters':[],'scenes':[],'planets':[],'maps':[],'exists':[],'alternates':[],'not_used_yet':[],'unmatched':[]}
    for d in ['art/raw','art/sprites','art/sprites_back','art/overworld','art/characters','art/scenes','art/planets','art/maps_incoming']: os.makedirs(os.path.join(ROOT,d),exist_ok=True)
    files=sorted(os.path.join(d,f) for d,_,fs in os.walk(src) for f in fs if f.lower().endswith(('.png','.jpg','.jpeg','.webp')))
    for p in files:
        f=os.path.basename(p)
        if structured(p,f,dry,force,rep): continue
        base=os.path.splitext(f)[0]; n=norm(base)
        mon=next((MON[k] for k in sorted(MON,key=len,reverse=True) if k and k in n),None)
        ck=ALIAS.get(n) or CHAR.get(n) or next((CHAR[k] for k in sorted(CHAR,key=len,reverse=True) if k in n and len(k)>3),None)
        planet=next((pl for pl in PLANETS if pl in n),None)
        if mon and not (planet and any(w in n for w in ['battle','keyart','landing','orb','map','town'])):
            dst=os.path.join(ROOT,'art/sprites',mon+'.png')
            if os.path.exists(dst) and not force: rep['exists'].append([f,'art/sprites/'+mon+'.png']); continue
            if not dry: shutil.copy(p,os.path.join(ROOT,'art/raw',mon+'.png')); clean(p).save(dst,optimize=True)
            rep['alienmon'].append([f,mon])
        elif ck:
            dst=os.path.join(ROOT,'art/characters',ck+'.png')
            if os.path.exists(dst) and not force: rep['exists'].append([f,'art/characters/'+ck+'.png']); continue
            if not dry: char_sprite(p,ck,dst)
            rep['characters'].append([f,ck])
        elif planet:
            kind='battle' if 'battle' in n else 'keyart' if ('keyart' in n or 'landing' in n or 'establish' in n) else 'orb' if ('orb' in n or 'sprite' in n or 'fromspace' in n) else 'map' if any(w in n for w in ['map','town','walk','region','overworld','tileset']) else 'scene'
            if kind=='orb':
                dst=os.path.join(ROOT,'art/planets',planet+'.png')
                if not dry: clean(p).save(dst,optimize=True)
                rep['planets'].append([f,'art/planets/'+planet+'.png'])
            elif kind=='map':
                if not dry: shutil.copy(p,os.path.join(ROOT,'art/maps_incoming',f))
                rep['maps'].append([f,'art/maps_incoming/'+f])
            else:
                dst=os.path.join(ROOT,'art/scenes',f'{planet}_{kind}.jpg')
                if os.path.exists(dst) and not force: rep['exists'].append([f,dst]); continue
                if not dry:
                    im=Image.open(p).convert('RGB'); im.thumbnail((1536,1024),Image.LANCZOS); im.save(dst,quality=84,optimize=True)
                rep['scenes'].append([f,f'art/scenes/{planet}_{kind}.jpg'])
        else: rep['unmatched'].append(f)
    json.dump(rep,open(os.path.join(ROOT,'import_report.json'),'w'),indent=1)
    for k,v in rep.items(): print(f'{k}: {len(v)}')
    print('Details in import_report.json'+(' (dry run, nothing written)' if dry else ''))
if __name__=='__main__': main()
