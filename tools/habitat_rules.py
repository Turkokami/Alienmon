B={ # biome: (native, tolerated)
'canyon':(['Gravity','Swarm','Bio','Volt'],['Sonic','Psi','Plasma','Alloy','Crystal','Void']),
'rock_cave':(['Gravity','Void','Crystal','Sonic'],['Swarm','Alloy','Psi','Magma','Toxin']),
'volcanic':(['Magma','Plasma','Gravity'],['Alloy','Crystal','Swarm','Volt','Void','Sonic','Toxin']),
'tropical_shore':(['Hydro','Bio'],['Swarm','Sonic','Gravity','Volt','Psi','Crystal','Toxin']),
'scrapyard':(['Alloy','Volt'],['Gravity','Toxin','Magma','Swarm','Sonic','Void']),
'swamp':(['Bio','Toxin','Hydro','Swarm'],['Psi','Void','Sonic','Gravity']),
'fungal':(['Bio','Toxin','Void'],['Swarm','Psi','Gravity','Sonic']),
'coast':(['Hydro','Sonic'],['Bio','Swarm','Volt','Crystal','Psi','Gravity','Alloy','Void','Toxin']),
'neon_city':(['Volt','Sonic','Alloy'],['Psi','Swarm','Void','Crystal','Gravity','Toxin','Plasma']),
'ruins':(['Crystal','Psi','Gravity'],['Sonic','Void','Bio','Hydro','Toxin']),
'mine_hot':(['Magma','Gravity','Crystal','Alloy'],['Void','Swarm','Sonic','Toxin','Plasma']),
'volcano':(['Magma','Plasma'],['Gravity','Crystal','Alloy','Swarm','Sonic','Void','Toxin']),
'tundra':(['Cryo','Gravity','Crystal'],['Psi','Bio','Void','Sonic','Hydro']),
'ice_cave':(['Cryo','Crystal'],['Gravity','Void','Sonic','Psi','Hydro','Swarm']),
'frozen_falls':(['Cryo','Hydro'],['Crystal','Psi','Sonic']),
'containment':(['Alloy','Toxin','Volt'],['Psi','Void','Gravity','Cryo','Swarm']),
'sky':(['Psi','Sonic','Gravity'],['Crystal','Void','Volt','Hydro','Swarm']),
'sky_garden':(['Psi','Bio'],['Hydro','Sonic','Crystal','Swarm','Gravity']),
'dark_city':(['Void','Gravity'],['Sonic','Psi','Alloy','Swarm','Bio','Toxin']),
'abyss':(['Void','Gravity','Crystal'],['Sonic','Swarm','Toxin','Psi']),
'seedpod_field':(['Plasma','Bio','Gravity'],['Crystal','Psi','Swarm','Volt','Sonic']),
'crater':(['Plasma','Void','Gravity','Crystal'],['Psi','Sonic','Magma','Swarm']),
'summit':(['Crystal','Gravity','Sonic'],['Plasma','Alloy','Psi','Void','Volt','Cryo']),
'floating_land':(['Gravity','Bio','Psi'],['Crystal','Void','Sonic']),
'drowned_sea':(['Hydro','Psi'],['Crystal','Sonic','Bio','Void']),
'sun_forge':(['Plasma','Magma'],['Crystal','Gravity']),
'crystal_ruins':(['Crystal','Psi','Sonic'],['Void','Gravity','Plasma']),
'blighted_forest':(['Void','Bio'],['Toxin','Gravity','Psi']),
'void_edge':(['Void','Gravity'],['Psi','Plasma']),
'aurora':(['Cryo','Gravity'],['Plasma','Psi','Crystal','Sonic','Hydro','Swarm']),
'thermal_vent':(['Magma'],['Hydro','Crystal','Toxin','Sonic','Gravity','Volt']),
'ash_trail':(['Magma','Plasma','Gravity'],['Bio','Swarm','Toxin','Void']),
}
# hard bans: never, regardless of tables
HARD={'Hydro':['ash_trail','volcanic','volcano','mine_hot','sun_forge','canyon','scrapyard','neon_city','containment','summit','seedpod_field','crater'],
      'Cryo':['ash_trail','thermal_vent','volcanic','volcano','mine_hot','sun_forge','canyon','tropical_shore','swamp','fungal','coast','seedpod_field','crater','drowned_sea','neon_city'],
      'Magma':['aurora','tundra','ice_cave','frozen_falls','coast','swamp','fungal','tropical_shore','drowned_sea','sky','sky_garden'],
      'Plasma':['tundra','ice_cave','frozen_falls','coast','swamp','fungal','drowned_sea'],
      'Bio':['mine_hot','containment','void_edge']}
# Bio may live in fire biomes only when the species is also fire-adapted (e.g. Charsprout, Magma/Bio)
FIRE={'volcanic','volcano','sun_forge','ash_trail'}
# encounter sections -> (planet key, biome, order)
S={
'009':('dustara','canyon'),'010':('dustara','canyon'),'011':('dustara','canyon'),'012':('dustara','rock_cave'),'013':('dustara','rock_cave'),
'014':('dustara','volcanic'),'015':('dustara','ash_trail'),'016':('dustara','ash_trail'),'017':('dustara','tropical_shore'),'019':('dustara','tropical_shore'),
'020':('dustara','volcanic'),'021':('dustara','volcanic'),'024':('dustara','volcanic'),'025':('dustara','volcanic'),'027':('dustara','rock_cave'),'028':('dustara','mine_hot'),
'034':('ferrox','scrapyard'),'035':('ferrox','scrapyard'),'036':('ferrox','scrapyard'),'038':('ferrox','scrapyard'),
'045':('sporeholm','swamp'),'046':('sporeholm','swamp'),'047':('sporeholm','fungal'),'048':('sporeholm','fungal'),'049':('sporeholm','swamp'),
'057':('thalassa','coast'),'058':('thalassa','coast'),'059':('thalassa','thermal_vent'),
'066':('neonis','neon_city'),'067':('neonis','neon_city'),'068':('neonis','neon_city'),
'075':('glyphos','ruins'),'076':('glyphos','ruins'),'077':('glyphos','ruins'),
'085':('pyros','volcano'),'086':('pyros','volcano'),'087':('pyros','mine_hot'),'088':('pyros','mine_hot'),'089':('pyros','mine_hot'),'090':('pyros','volcano'),
'096':('glacia','aurora'),'097':('glacia','aurora'),'098':('glacia','ice_cave'),'099':('glacia','ice_cave'),'100':('glacia','ice_cave'),'101':('glacia','tundra'),'102':('glacia','frozen_falls'),
'109':('helix','containment'),'110':('helix','containment'),'111':('helix','containment'),
'118':('halo','sky'),'119':('halo','sky'),'120':('halo','sky_garden'),
'127':('umbra','dark_city'),'128':('umbra','dark_city'),'129':('umbra','abyss'),'130':('umbra','abyss'),'131':('umbra','abyss'),'132':('umbra','abyss'),
'138':('starfall','seedpod_field'),'139':('starfall','seedpod_field'),'141':('starfall','crater'),'142':('starfall','crater'),'143':('starfall','crater'),'144':('starfall','crater'),
'146':('apex','summit'),
'154':('ystra','floating_land'),'155':('ystra','floating_land'),'156':('ystra','drowned_sea'),'157':('ystra','sun_forge'),'158':('ystra','crystal_ruins'),'159':('ystra','crystal_ruins'),
'160':('ystra','blighted_forest'),'161':('ystra','blighted_forest'),'162':('ystra','void_edge'),
}
def fit(types,biome):
    """2 = strong (a native type, rest allowed), 1 = tolerated only, 0 = forbidden"""
    nat,tol=B[biome]
    if biome in FIRE and 'Bio' in types and not ({'Magma','Plasma'}&set(types)): return 0
    if biome in FIRE and 'Bio' in types: tol=tol+['Bio']
    for t in types:
        if biome in HARD.get(t,[]): return 0
        if t not in nat and t not in tol: return 0
    return 2 if any(t in nat for t in types) else 1
