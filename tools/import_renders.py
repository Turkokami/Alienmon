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

def main():
    src=sys.argv[1]; dry='--dry-run' in sys.argv; force='--force' in sys.argv
    rep={'alienmon':[],'characters':[],'scenes':[],'planets':[],'maps':[],'exists':[],'unmatched':[]}
    for d in ['art/raw','art/sprites','art/characters','art/scenes','art/planets','art/maps_incoming']: os.makedirs(os.path.join(ROOT,d),exist_ok=True)
    files=[f for f in sorted(os.listdir(src)) if f.lower().endswith(('.png','.jpg','.jpeg','.webp'))]
    for f in files:
        p=os.path.join(src,f); base=os.path.splitext(f)[0]; n=norm(base)
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
