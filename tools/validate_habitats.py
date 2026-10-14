"""Fails (exit 1) if any Alienmon is placed in a habitat it can't live in.
Usage: python tools/validate_habitats.py [path/to/encounters.json] [path/to/alienmon.json]"""
import json,sys,os
sys.path.insert(0,os.path.dirname(__file__));from habitat_rules import fit,S
enc=json.load(open(sys.argv[1] if len(sys.argv)>1 else 'data/encounters.json'))
bad=[]
for sid,sec in enc.items():
    for e in sec['encounters']:
        if fit(e['types'],sec['habitat'])==0: bad.append(f"{sid} {sec['name']} ({sec['habitat']}): {e['name']} {'/'.join(e['types'])}")
pyros=[e['name'] for sid,sec in enc.items() if sec['planet']=='Pyros' for e in sec['encounters'] if {'Hydro','Cryo'}&set(e['types'])]
if pyros: bad.append('Water or ice types on Pyros: '+', '.join(pyros))
if bad: print('HABITAT ERRORS:\n'+'\n'.join(bad)); sys.exit(1)
print(f'OK: {sum(len(s["encounters"]) for s in enc.values())} encounter slots across {len(enc)} sections, all in valid habitats.')
