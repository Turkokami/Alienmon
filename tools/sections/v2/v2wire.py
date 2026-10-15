"""Wire V2 map sections (run from repo root on the maps-v2 branch). usage: v2wire.py <planet-prefix>...  e.g. 01
Per planet: atlas exits <- V2 edges (6-tile bands), and every positional link for those sections replaced by WIRE below."""
import json,sys
S='tools/sections/v2/'
A2={s['id']:s for s in json.load(open(S+'atlas_v2.json',encoding='utf-8'))['sections']}
AT=json.load(open('art/sections/atlas.json',encoding='utf-8'));A1={s['id']:s for s in AT['sections']}
L=json.load(open('data/sections/links.json',encoding='utf-8'))
H=lambda x,y:{'tile':[x,y]}
WIRE={'08':{
 'ids':['%03d'%i for i in range(93,105)],
 'doors':[],'stairs':[],
 'objects':{
  '093':[{'tile':[2,3],'k':'house','to':'178','why':'V2: glass-dome house (shared Glacia home)'},{'tile':[3,3],'k':'house','to':'178','why':'V2: glass-dome house'},
         {'tile':[17,3],'k':'house','to':'178','why':'V2: glass-dome house'},{'tile':[18,3],'k':'house','to':'178','why':'V2: glass-dome house'},
         {'tile':[21,3],'k':'house','to':'193','why':'V2: the Ice Lodge (blue crest)'},{'tile':[22,3],'k':'house','to':'193','why':'V2: the Ice Lodge'}],
 },
 'warps':[],
 'gates':{},
 'atlas_extra':{'103':['top edge, tile columns 7–8 (stairs up) → Aurora Tower 2F']},
 'spawns':{'093':{'arrival':[3,7],'default':[3,7]}},
 'arrival':{'glacia':{'section':'093','why':'V2: the landing pad under the glass dome'}},
 'reparent':{'178':'093','193':'093'},
},'07':{
 'ids':['%03d'%i for i in range(82,93)],
 'doors':[],'stairs':[],
 'objects':{
  '082':[{'tile':[3,4],'k':'house','to':'174','why':'V2: miner shack (shared Pyros home)'},{'tile':[4,4],'k':'house','to':'174','why':'V2: miner shack'},
         {'tile':[19,4],'k':'house','to':'174','why':'V2: miner shack'},{'tile':[20,4],'k':'house','to':'174','why':'V2: miner shack'}],
 },
 'warps':[],
 'gates':{},
 'atlas_extra':{'091':['top edge, tile columns 7–9 (stairs up) → Volcano Tower 2F']},
 'spawns':{'082':{'arrival':[3,8],'default':[3,8]}},
 'arrival':{'pyros':{'section':'082','why':'V2: the iron landing pad at the left end of Cinder Hollow'}},
 'reparent':{'174':'082'},
},'06':{
 'ids':['%03d'%i for i in range(72,82)],
 'doors':[],'stairs':[],
 'objects':{
  '073':[{'tile':[2,4],'k':'house','to':'177','why':'V2: expedition tent (shared Glyphos home)'},{'tile':[3,4],'k':'house','to':'177','why':'V2: expedition tent'},
         {'tile':[14,4],'k':'house','to':'183','why':'V2: the big dig tent'},{'tile':[15,4],'k':'house','to':'183','why':'V2: the big dig tent'},
         {'tile':[19,4],'k':'house','to':'177','why':'V2: expedition tent'},{'tile':[20,4],'k':'house','to':'177','why':'V2: expedition tent'}],
 },
 'warps':[{'section':'080','tile':[7,4],'to':'081','at':[7,13],'face':'up','kind':'door'},{'section':'080','tile':[8,4],'to':'081','at':[8,13],'face':'up','kind':'door'},
          {'section':'081','tile':[7,14],'to':'080','at':[7,5],'face':'down','kind':'door','parent':'080'},{'section':'081','tile':[8,14],'to':'080','at':[8,5],'face':'down','kind':'door','parent':'080'}],
 'gates':{},
 'gates_new':[{'section':'072','tiles':[[0,6],[0,7],[0,8]],'at_dy':0,'node':'dustara','planet':'dustara','label':'the Deep Sea Ferry back to the Long Dock','why':'V2: the jetty is the arrival point and the ferry home'}],
 'atlas_extra':{'078':['top edge, tile columns 6–9 (stairs up) → Temple of Voices 2F'],'079':['top edge, tile columns 6–9 (stairs up) → Temple of Voices 3F']},
 'spawns':{'072':{'arrival':[2,7],'default':[2,7]}},
 'arrival':{'glyphos':{'section':'072','why':'V2: the jetty at Sunken Landing'}},
 'reparent':{'177':'073','183':'073'},
},'05':{
 'ids':['%03d'%i for i in range(62,72)]+['170'],
 'doors':[],'stairs':[],
 'objects':{
  '062':[{'tile':[3,4],'k':'house','to':'192','why':'V2: Starport apartment (shared Neonis home)'},{'tile':[4,4],'k':'house','to':'192','why':'V2: Starport apartment'},
         {'tile':[9,4],'k':'house','to':'064','why':'V2: Starport Recovery Bay (shared room)'},{'tile':[10,4],'k':'house','to':'064','why':'V2: Starport Recovery Bay'},
         {'tile':[14,4],'k':'house','to':'065','why':'V2: Starport shop (shared room)'},{'tile':[15,4],'k':'house','to':'065','why':'V2: Starport shop'},
         {'tile':[19,4],'k':'house','to':'192','why':'V2: Starport apartment'},{'tile':[20,4],'k':'house','to':'192','why':'V2: Starport apartment'}],
  '063':[{'tile':[20,4],'k':'house','to':'192','why':'V2: Boulevard apartment (shared Neonis home)'},{'tile':[21,4],'k':'house','to':'192','why':'V2: Boulevard apartment'}],
  '066':[{'tile':[11,3],'k':'house','to':'180','why':'V2: the arcade hall'},{'tile':[12,3],'k':'house','to':'180','why':'V2: the arcade hall'}],
 },
 'warps':[{'section':'063','tile':[14,4],'to':'170','at':[7,13],'face':'up','kind':'door'},{'section':'063','tile':[15,4],'to':'170','at':[8,13],'face':'up','kind':'door'},
          {'section':'170','tile':[7,14],'to':'063','at':[14,5],'face':'down','kind':'door','parent':'063'},{'section':'170','tile':[8,14],'to':'063','at':[15,5],'face':'down','kind':'door','parent':'063'}],
 'gates':{},
 'atlas_extra':{'069':['top edge, tile columns 6–9 (stairs up) → Voltspire 2F'],'070':['top edge, tile columns 6–9 (stairs up) → Voltspire 3F']},
 'spawns':{'062':{'arrival':[3,8],'default':[3,8]},'170':{'default':[7,13]}},
 'arrival':{'neonis':{'section':'062','why':'V2: the landing ring on the starport deck'}},
 'shared':['064','065'],
 'reparent':{'176':'063','192':'063','180':'066'},
},'04':{
 'ids':['%03d'%i for i in range(52,62)]+['167','168','169'],
 'doors':[],'stairs':[],
 'objects':{
  '052':[{'tile':[4,3],'k':'house','to':'191','why':'V2: Saltreach house (shared Thalassa home)'},{'tile':[5,3],'k':'house','to':'191','why':'V2: Saltreach house'},
         {'tile':[20,3],'k':'house','to':'191','why':'V2: Saltreach house'},{'tile':[10,3],'k':'house','to':'054','why':'V2: the dock Recovery Bay (shared room)'},
         {'tile':[11,3],'k':'house','to':'054','why':'V2: the dock Recovery Bay'},{'tile':[16,3],'k':'house','to':'055','why':'V2: the dock shop (shared room)'}],
  '053':[{'tile':[3,4],'k':'house','to':'191','why':'V2: market house (shared Thalassa home)'},{'tile':[19,4],'k':'house','to':'191','why':'V2: market house'}],
 },
 'warps':[{'section':'052','tile':[11,12],'to':'167','at':[7,12],'face':'up','kind':'door','node':'ghost_ship'},
          {'section':'052','tile':[12,12],'to':'168','at':[8,12],'face':'up','kind':'door','node':'helix_freighter'},
          {'section':'167','tile':[7,14],'to':'052','at':[11,11],'face':'up','kind':'door','parent':'052'},{'section':'167','tile':[8,14],'to':'052','at':[11,11],'face':'up','kind':'door','parent':'052'},
          {'section':'168','tile':[7,14],'to':'052','at':[12,11],'face':'up','kind':'door','parent':'052'},{'section':'168','tile':[8,14],'to':'052','at':[12,11],'face':'up','kind':'door','parent':'052'},
          {'section':'053','tile':[19,12],'to':'169','at':[2,7],'face':'right','kind':'door','node':'smuggler_freighter'},
          {'section':'169','tile':[0,7],'to':'053','at':[19,11],'face':'up','kind':'door','parent':'053'}],
 'gates':{},
 'atlas_extra':{'056':['top edge, tile columns 6–9 (stairs up) → Coral Route Part A'],'060':['top edge, tile columns 6–9 (stairs up) → Harbor Tower 2F']},
 'spawns':{'052':{'arrival':[3,7],'default':[3,7]},'167':{'default':[7,12]},'168':{'default':[8,12]},'169':{'default':[2,7]}},
 'arrival':{'thalassa':{'section':'052','why':'V2: the compass landing pad on the Saltreach docks'}},
 'shared':['054','055'],
 'reparent':{'171':'052','191':'052'},
},'03':{
 'ids':['%03d'%i for i in range(41,52)],
 'doors':[],'stairs':[],
 'objects':{
  '041':[{'tile':[3,3],'k':'house','to':'184','why':'V2: the landing dome'},{'tile':[4,3],'k':'house','to':'184','why':'V2: the landing dome'}],
  '042':[{'tile':[3,3],'k':'house','to':'190','why':'V2: Mirefen hut (shared Sporeholm home)'},{'tile':[20,3],'k':'house','to':'190','why':'V2: Mirefen hut (shared Sporeholm home)'}],
  '047':[],
  '049':[{'tile':[15,3],'k':'house','to':'185','why':'V2: the mushroom house by the Spore Pools'}],
 },
 'warps':[],'gates':{},
 'atlas_extra':{'050':['top edge, tile columns 6–9 (stairs up) → Sporeholm Tower 2F']},
 'spawns':{'041':{'arrival':[3,7],'default':[3,7]}},
 'arrival':{'sporeholm':{'section':'041','why':'V2: the landing circle on the giant mushroom cap'}},
 'reparent':{'173':'042','184':'041','185':'049','190':'042'},
},'02':{
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
        if w['section'] in W.get('reparent',{}): w['parent']=W['reparent'][w['section']]
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
