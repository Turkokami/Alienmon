"""Wire V2 map sections (run from repo root on the maps-v2 branch). usage: v2wire.py <planet-prefix>...  e.g. 01
Per planet: atlas exits <- V2 edges (6-tile bands), and every positional link for those sections replaced by WIRE below."""
import json,sys
S='tools/sections/v2/'
A2={s['id']:s for s in json.load(open(S+'atlas_v2.json',encoding='utf-8'))['sections']}
AT=json.load(open('art/sections/atlas.json',encoding='utf-8'));A1={s['id']:s for s in AT['sections']}
L=json.load(open('data/sections/links.json',encoding='utf-8'))
H=lambda x,y:{'tile':[x,y]}
WIRE={'02':{
 'ids':['%03d'%i for i in range(29,41)],
 'doors':[('031','030',[8,4],[9,4],'Rustvale Recovery Bay (big dome, cyan cross)'),('032','030',[15,4],None,'Rustvale Shop (gear sign)'),
          ('033','030',[20,4],[21,4],"Grub's Workshop (crossed-tools sign)")],
 'stairs':[],
 'objects':{
  '029':[],
  '030':[{'tile':[2,4],'k':'house','to':'188','why':'house door: Rustvale home (shared Ferrox Cabin)'},{'tile':[3,4],'k':'house','to':'188','why':'house door: Rustvale home'}],
  '031':[{'tile':[7,4],'k':'bay','why':'Recovery Bay counter'},{'tile':[8,4],'k':'bay','why':'Recovery Bay counter'}],
  '032':[{'tile':[7,4],'k':'shop','why':'shop counter'},{'tile':[8,4],'k':'shop','why':'shop counter'}],
  '037':[{'tile':[3,4],'k':'house','to':'188','why':'Junk Market home (shared Ferrox Cabin)'},{'tile':[21,4],'k':'house','to':'188','why':'Junk Market home'},
         {'tile':[8,4],'k':'house','to':'031','why':'Junk Market Recovery Bay (shared room)'},{'tile':[9,4],'k':'house','to':'031','why':'Junk Market Recovery Bay'},
         {'tile':[15,4],'k':'shop','why':'Junk Market big stall counter'},{'tile':[16,4],'k':'shop','why':'Junk Market big stall counter'}],
  '040':[{'tile':[7,4],'k':'keeper','why':"Keeper's dais in front of the crystal, challenged from (7,5)"}],
 },
 'warps':[],
 'gates':{},
 'gates_new':[{'section':'029','tiles':[[4,4],[5,4]],'node':'dustara','planet':'dustara','label':'the Relay Gate back to Dustara','why':'V2: the Relay Gate ring is the arrival point and the way home'}],
 'atlas_extra':{'039':['top edge, tile columns 6–9 (stairs up) → Ferrox Tower 2F']},
 'trainer_tiles':[{'section':'039','n':0,'tile':[3,11],'face':'right'},{'section':'039','n':1,'tile':[12,11],'face':'left'}],
 'shared':['031','032'],
 'spawns':{'029':{'arrival':[4,6],'default':[4,6]},'188':{'default':[7,12]}},
 'arrival':{'ferrox':{'section':'029','why':'V2: the Relay Gate ring in Gate Plaza'}},
},'01':{
 'ids':['%03d'%i for i in range(1,29)]+['165','166'],
 'doors':[('001','004',[2,4],[3,4],"Hero's house"),('166','004',[6,4],[7,4],'Reyes house'),('005','004',[11,4],[12,4],'Recovery Bay'),
          ('006','004',[16,4],[17,4],'Shop'),('003','004',[20,3],None,"Vashti's observatory, up the steps")],
 'stairs':[('001',[11,4],'002',[11,5]),('001',[12,4],'002',[12,5])],
 'objects':{
  '003':[{'tile':[4,6],'k':'lab','why':"Vashti's starter pods on the lab table"}],
  '005':[{'tile':[7,4],'k':'bay','why':'Recovery Bay counter'},{'tile':[8,4],'k':'bay','why':'Recovery Bay counter'},
         {'tile':[12,4],'k':'ladder','to':'165','at':[4,13],'face':'up','label':'A ladder leads up to the attic.','why':'attic ladder, top right'},
         {'tile':[13,4],'k':'ladder','to':'165','at':[4,13],'face':'up','label':'A ladder leads up to the attic.','why':'attic ladder, top right'}],
  '006':[{'tile':[7,5],'k':'shop','why':'shop counter'},{'tile':[8,5],'k':'shop','why':'shop counter'}],
  '008':[{"tile": [3, 4], "k": "house", "to": "187", "why": "house door: Trading Post dome (shared Dustara home)"}, {"tile": [18, 4], "k": "house", "to": "187", "why": "house door: Trading Post dome (shared Dustara home)"}, {"tile": [8, 4], "k": "house", "to": "005", "why": "Trading Post Recovery Bay (shared room)"}, {"tile": [9, 4], "k": "house", "to": "005", "why": "Trading Post Recovery Bay (shared room)"}, {"tile": [13, 4], "k": "house", "to": "006", "why": "Trading Post shop (shared room)"}, {"tile": [14, 4], "k": "house", "to": "006", "why": "Trading Post shop (shared room)"}],
  '017':[{'tile':[14,3],'k':'bay','door':True,'why':'Palm Isle Recovery Hut (works like the counter)'}],
  '018':[{"tile": [2, 4], "k": "house", "to": "187", "why": "house door: opens Dustara Cottage"}, {"tile": [8, 4], "k": "house", "to": "005", "why": "Port Ember healing centre (shared Recovery Bay room)"}, {"tile": [9, 4], "k": "house", "to": "005", "why": "Port Ember healing centre (shared Recovery Bay room)"}],
 },
 'warps':[{'section':'165','tile':[2,12],'to':'005','at':[12,5],'face':'down','kind':'stairs','parent':'005'},
          {'section':'165','tile':[3,12],'to':'005','at':[12,5],'face':'down','kind':'stairs','parent':'005'}],
 'gates':{'022':[[11,3],[12,3]],'018':[[20,3],[21,3]],'019':[[13,2],[14,2]],'023':[[11,4],[12,4]],'026':[[11,2],[12,2]],'027':[[11,3],[12,3],[13,3]],'028':[[19,7],[19,8]]},
 'spawns':{'004':{'arrival':[3,8],'default':[3,8]},'165':{'default':[4,13]},'166':{'default':[7,13]},'002':{'wake':[7,8]}},
 'arrival':{'dustara':{'section':'004','why':'V2: the landing pad at the left end of the main road'}},
}}
names={k:v['name'] for k,v in A1.items()}
def band(i,side,rng):
    """The V2 band (rows/cols 5-10) trimmed to the run of walkable tiles on that edge that contains 7-8."""
    R=json.load(open(f'data/collision/{i}.json'))['rows'];h=len(R);w=len(R[0])
    at=lambda k:{'left':R[k][0],'right':R[k][w-1],'top':R[0][k],'bottom':R[h-1][k]}[side]
    ok=[k for k in range(rng[0],rng[1]+1) if at(k)!='#']
    if not ok: print('NO WALKABLE EDGE',i,side); return rng
    runs=[];cur=[ok[0]]
    for k in ok[1:]:
        if k==cur[-1]+1: cur.append(k)
        else: runs.append(cur);cur=[k]
    runs.append(cur);r=max(runs,key=lambda r:(7 in r or 8 in r,len(r)))
    return r[0],r[-1]
for pf in sys.argv[1:]:
    W=WIRE[pf];ids=set(W['ids'])
    # atlas: edges from V2 (6-tile bands); other kinds are wired through links
    for i in ids:
        ex=[]
        for e in A2[i]['exits']:
            if e['kind']!='edge': continue
            a,b=band(i,e['side'],e.get('rows') or e.get('cols'));ex.append(f"{e['side']} edge, tile {'rows' if 'rows' in e else 'columns'} {a}–{b} → {names[e['to']]}")
        ex+=W.get('atlas_extra',{}).get(i,[])
        A1[i]['exits']=ex; A1[i]['v2']=True
    keep=lambda e,k='section': e.get(k) not in ids
    L['doors']=[d for d in L['doors'] if d['interior'] not in ids]+[{'interior':i,'parent':p,'door':d,**({'door2':d2} if d2 else {}),'mat':[[7,14],[8,14]],'confidence':'high','why':'V2: '+w} for i,p,d,d2,w in W['doors']]
    L['stairs']=[s for s in L['stairs'] if s['a'] not in ids]+[{'a':a,'a_tile':at,'b':b,'b_tile':bt,'why':'V2 stairs'} for a,at,b,bt in W['stairs']]
    for i in ids:
        L['objects'].pop(i,None);L['ignore_mats'].pop(i,None);L['unlisted'].pop(i,None);L.get('edge_rows',{}).pop(i,None)
    L['objects'].update(W['objects'])
    L['warps']=[w for w in L['warps'] if keep(w)]+W['warps']
    for w in L['warps']:
        if w['section']=='187' and w.get('parent')=='007': w['parent']='018'   # the cottage's only door is now in Port Ember
        if w['section']=='188': w['parent']='030'
    for g in L['gates']:
        if g['section'] in W['gates']: g['tiles']=W['gates'][g['section']]; g['at_dy']=1
    for k,v in W['spawns'].items(): L['spawns'][k]=v
    if 'gates_new' in W: L['gates']=[g for g in L['gates'] if g['section'] not in {x['section'] for x in W['gates_new']}]+W['gates_new']
    if 'trainer_tiles' in W: L['trainers']['tiles']=[t for t in L['trainers']['tiles'] if t['section'] not in ids]+W['trainer_tiles']
    if 'shared' in W: L['shared_rooms']=sorted(set(L.get('shared_rooms',[]))|set(W['shared']))
    L['arrival'].update(W['arrival'])
    if pf=='01': L['shared_rooms']=sorted(set(L.get('shared_rooms',[]))|{'005','006'})
json.dump(AT,open('art/sections/atlas.json','w',encoding='utf-8'),indent=1,ensure_ascii=False)
json.dump(L,open('data/sections/links.json','w',encoding='utf-8'),indent=1,ensure_ascii=False)
print('wired',sys.argv[1:])
