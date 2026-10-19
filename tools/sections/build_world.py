"""Turn art/sections/atlas.json (+ data/sections/links.json) into data/world.json and data/connections_report.md.

- Every atlas `exits` line becomes a structured connection {from_id, edge, tile_range, to_id, to_edge, to_tile}.
- Target names are matched against atlas `name` ignoring case and punctuation.
- The arriving edge is the target's own exit that points back at the source; if it has none, the opposite edge
  is assumed and the exit is listed in the report.
- Outdoor sections (town / route / field / landmark) joined on opposite edges are seamless neighbours laid out
  edge to edge on a per-planet grid; everything else (interiors, caves, dungeons, towers, arenas) is a warp.
- Interiors link to a parent door from links.json; unlisted interiors are reported with a guessed parent.

Usage: python tools/sections/build_world.py [planet folder prefixes...]   e.g.  01   (default: every planet)
"""
import json, os, re, sys, glob, hashlib
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
atlas = json.load(open(os.path.join(ROOT, 'art/sections/atlas.json'), encoding='utf-8'))['sections']
# props (data/sections/props_layout.json) are solid: every collision file read below sees their footprints as blocked,
# so NPCs, quest spots, stashes and wild Alienmon are never placed on a prop
import builtins, io, struct
_PROPS = json.load(open(os.path.join(ROOT, 'data/sections/props_layout.json'))) if os.path.exists(os.path.join(ROOT, 'data/sections/props_layout.json')) else {}
_open = builtins.open
def _prop_w(p):
    with _open(os.path.join(ROOT, 'art/props', p + '.png'), 'rb') as f: return max(1, round(struct.unpack('>I', f.read(24)[16:20])[0] / 16))
def open(path, *a, **k):
    sp = os.path.normpath(str(path)).replace(os.sep, '/')
    if '/data/collision/' in sp and sp.endswith('.json') and 'w' not in (a[0] if a else k.get('mode', 'r')):
        sid = os.path.basename(sp)[:-5]
        if _PROPS.get(sid):
            d = json.load(_open(path, encoding='utf-8')); R = [list(r) for r in d['rows']]
            for q in _PROPS[sid]:
                if q.get('solid') is False or not os.path.exists(os.path.join(ROOT, 'art/props', q['p'] + '.png')): continue
                for y in range(q['y'], q['y'] + q.get('h', 1)):
                    for x in range(q['x'], q['x'] + (q.get('w') or _prop_w(q['p']))):
                        if 0 <= y < len(R) and 0 <= x < len(R[y]): R[y][x] = '#'
            d['rows'] = [''.join(r) for r in R]; return io.StringIO(json.dumps(d))
    return _open(path, *a, **k)
links = json.load(open(os.path.join(ROOT, 'data/sections/links.json'), encoding='utf-8'))
# ---- map editor (www/editor.html -> data/editor/*.json) ----
def _ed(name, default):
    pth = os.path.join(ROOT, 'data/editor', name)
    return json.load(open(pth, encoding='utf-8')) if os.path.exists(pth) else default
ED_MAPS, ED_NPCS, ED_MONS = _ed('maps.json', []), _ed('npcs.json', {}), _ed('mons.json', {})
_SIDE_OPP = {'left': 'right', 'right': 'left', 'top': 'bottom', 'bottom': 'top'}
_by_id = {a['id']: a for a in atlas}
for m in ED_MAPS:
    if m['id'] in _by_id:
        continue
    t = _by_id.get((m.get('attach') or {}).get('to'))
    entry = {'id': m['id'], 'planet': m.get('planet') or (t or {}).get('planet', ''), 'name': m['name'], 'type': m.get('type', 'route'),
             'size_px': [m['tiles'][0] * 64, m['tiles'][1] * 64], 'tiles': m['tiles'], 'tile_px_render': 64, 'tile_px_game': 16,
             'exits': [], 'notes': 'Added in the map editor', 'file': 'art/sections/' + m['dir'] + '/' + os.path.basename(m['img'])}
    if t:
        side, (a, b) = m['attach']['side'], m['attach']['band']
        kind = 'rows' if side in ('left', 'right') else 'columns'
        t['exits'] = list(t['exits']) + [f"{side} edge, tile {kind} {a}–{b} → {m['name']}"]
        entry['exits'].append(f"{_SIDE_OPP[side]} edge, tile {kind} {a}–{b} → {t['name']}")
    atlas.append(entry)
    _by_id[m['id']] = entry
# routes drawn in the editor's Routes tool: an edge link between two map pieces (replaces whatever that side had)
for r in _ed('routes.json', []):
    A, B = _by_id.get(r['a']), _by_id.get(r.get('b'))
    if not A:
        continue
    side, opp = r['side'], _SIDE_OPP[r['side']]
    old = [e for e in A['exits'] if e.startswith(side + ' edge')]
    A['exits'] = [e for e in A['exits'] if not e.startswith(side + ' edge')]
    if B is None and old:   # removing: also drop the far side's line that points back here
        tname = old[0].split('→')[-1].strip().lower()
        B = next((x for x in atlas if x['name'].lower() == tname), None)
    if B:
        B['exits'] = [e for e in B['exits'] if not (e.startswith(opp + ' edge') and e.split('→')[-1].strip().lower() == A['name'].lower())]
    if r.get('remove') or not B:
        continue
    kind = 'rows' if side in ('left', 'right') else 'columns'
    A['exits'].append(f"{side} edge, tile {kind} {r['band'][0]}–{r['band'][1]} → {B['name']}")
    B['exits'] = [e for e in B['exits'] if not e.startswith(opp + ' edge')]
    B['exits'].append(f"{opp} edge, tile {kind} {r['bband'][0]}–{r['bband'][1]} → {A['name']}")
PLANET_NPCS = {}
for pf in sorted(glob.glob(os.path.join(ROOT, 'data/sections/planets/*.json'))):
    try:
        extra = json.load(open(pf, encoding='utf-8'))
    except (ValueError, OSError) as e:   # another helper may be mid-write: skip it this run
        print('skipping', os.path.basename(pf), e)
        continue
    for k in ('doors', 'stairs', 'gates'):
        links.setdefault(k, []).extend(extra.get(k, []))
    for sid, objs in extra.get('objects', {}).items():   # a planet file adds to a section's objects (door responses live in links.json)
        links.setdefault('objects', {}).setdefault(sid, []).extend(objs)
    for k in ('spawns', 'unlisted', 'ignore_mats', 'zones', 'arrival', 'edge_rows'):
        links.setdefault(k, {}).update(extra.get(k, {}))
    tr = links.setdefault('trainers', {})
    tr.setdefault('apprentices', {}).update(extra.get('apprentices', {}))
    tr.setdefault('tiles', []).extend(extra.get('trainer_tiles', []))
    tr.setdefault('per_section', {}).update(extra.get('trainers_per_section', {}))
    PLANET_NPCS.update(extra.get('npcs', {}))
OUTDOOR = {'town', 'route', 'field', 'landmark'}
# ---- map editor: rooms uploaded as new interiors, and doors assigned in the Doors tool (data/editor/doors.json) ----
# A door opens a room ('to' = section id), works as a counter ('menu:bay' / 'menu:shop'), or is removed (to = None).
# Rooms opened from editor doors become shared rooms: their doormat returns you to the door you came in by.
_ED_DOORS = _ed('doors.json', {})
_first_door = {}
for _sid, _lst in _ED_DOORS.items():
    for d in _lst:
        if d.get('to') and not str(d['to']).startswith('menu:'):
            _first_door.setdefault(d['to'], _sid)
for m in ED_MAPS:
    if m.get('type') == 'interior' and not m.get('attach'):
        W_, H_ = m['tiles']; c = W_ // 2 - 1
        for x in (c, c + 1):
            links.setdefault('warps', []).append({'section': m['id'], 'tile': [x, H_ - 1], 'to': 'back', 'at': [x, H_ - 2], 'face': 'down', 'kind': 'door',
                                                  **({'parent': _first_door[m['id']]} if m['id'] in _first_door else {})})
        links.setdefault('spawns', {})[m['id']] = {'default': [c, H_ - 2]}
for _sid, _lst in _ED_DOORS.items():
    objs = links.setdefault('objects', {}).setdefault(_sid, [])
    for d in _lst:
        t = list(d['tile'])
        objs[:] = [o for o in objs if not (list(o['tile']) == t and (o.get('k') in ('house', 'bay', 'shop') or o.get('door')))]
        links['warps'] = [w for w in links.get('warps', []) if not (w['section'] == _sid and list(w['tile']) == t)]
        links['doors'] = [x for x in links.get('doors', []) if not (x['parent'] == _sid and (list(x['door']) == t or list(x.get('door2') or []) == t))]
        to = d.get('to')
        if not to:
            continue
        if to in ('menu:bay', 'menu:shop'):
            objs.append({'tile': t, 'k': to[5:], 'door': True, 'why': 'map editor: counter door'})
        else:
            objs.append({'tile': t, 'k': 'house', 'to': to, 'why': 'map editor: door to ' + to})
            links.setdefault('shared_rooms', [])
            if to not in links['shared_rooms']:
                links['shared_rooms'].append(to)
OPP = {'left': 'right', 'right': 'left', 'top': 'bottom', 'bottom': 'top'}
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
byname = {norm(s['name']): s for s in atlas}
byid = {s['id']: s for s in atlas}
folder = {}
for f in glob.glob(os.path.join(ROOT, 'art/sections_game/*/*.png')):
    folder[os.path.basename(f)[:3]] = os.path.relpath(f, ROOT).replace('\\', '/')
OUT = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else None
want = [a for a in sys.argv[1:] if not a.startswith('--') and a != OUT]
planet_dir = {s['id']: os.path.dirname(s['file']).split('/')[-1] for s in atlas}
sel = [s for s in atlas if not want or any(planet_dir[s['id']].startswith(w) for w in want)]
report = defaultdict(list)
moved = set()
EXIT = re.compile(r'(left|right|top|bottom) edge, tile (rows|columns) (\d+)\D+(\d+)(?: \(stairs up\))?\s*→\s*(.+)$')


def parse(s):
    out = []
    for e in s['exits']:
        m = EXIT.match(e.strip())
        if m:
            edge, _, a, b, tgt = m.groups()
            rng = [int(a), int(b)]
            # where the art draws an exit somewhere other than the atlas says, links.json "edge_rows" moves it (reported)
            fix = links.get('edge_rows', {}).get(s['id'], {}).get(edge)
            if fix and fix != rng:
                if (s['id'], edge) not in moved:
                    moved.add((s['id'], edge))
                    report['exits moved to match the art'].append(f"{s['id']} {s['name']} {edge} edge: atlas {rng[0]}-{rng[1]}, art {fix[0]}-{fix[1]}")
                rng = list(fix)
            out.append({'edge': edge, 'range': rng, 'target': tgt.strip(), 'stairs': '(stairs up)' in e, 'text': e})
        elif 'doormat' in e:
            out.append({'edge': 'door', 'text': e})
        else:
            out.append({'edge': '?', 'text': e})
            report['unparsed exit text'].append(f"{s['id']} {s['name']}: `{e}`")
    return out


def edge_tiles(s, edge, rng):
    w, h = s['tiles']
    if edge == 'left': return [[0, r] for r in range(rng[0], rng[1] + 1)]
    if edge == 'right': return [[w - 1, r] for r in range(rng[0], rng[1] + 1)]
    if edge == 'top': return [[c, 0] for c in range(rng[0], rng[1] + 1)]
    return [[c, h - 1] for c in range(rng[0], rng[1] + 1)]


def inward(t, edge):
    """One tile in from an edge tile, and the facing on arrival."""
    x, y = t
    return {'left': ([x + 1, y], 'right'), 'right': ([x - 1, y], 'left'), 'top': ([x, y + 1], 'down'), 'bottom': ([x, y - 1], 'up')}[edge]


world, conns = {}, []
for s in sel:
    w, h = s['tiles']
    world[s['id']] = {'id': s['id'], 'name': s['name'], 'planet': s['planet'], 'dir': planet_dir[s['id']], 'type': s['type'],
                      'img': folder.get(s['id']), 'tiles': [w, h], 'notes': s.get('notes', ''),
                      'edges': {}, 'warps': [], 'objects': [], 'spawns': {}}
    if not folder.get(s['id']):
        report['missing art'].append(f"{s['id']} {s['name']}: no file in art/sections_game")

for s in sel:
    sec = world[s['id']]
    for ex in parse(s):
        if ex['edge'] in ('door', '?'):
            continue
        tgt = ex['target']
        if norm(tgt).startswith('arrival') and not byname.get(norm(tgt)):
            conns.append({'from_id': s['id'], 'edge': ex['edge'], 'tile_range': ex['range'], 'to_id': 'arrival', 'to_edge': None, 'to_tile': None})
            sec['edges'][ex['edge']] = {'to': 'arrival', 'range': ex['range']}
            sec['spawns']['arrival'] = inward(edge_tiles(s, ex['edge'], ex['range'])[0], ex['edge'])[0]
            continue
        t = byname.get(norm(tgt))
        if not t:
            cand = [x for x in atlas if norm(tgt) in norm(x['name']) or norm(x['name']) in norm(tgt)]
            if len(cand) == 1:
                t = cand[0]
                report['fuzzy name match'].append(f"{s['id']} `{tgt}` → {t['id']} {t['name']}")
            else:
                report['unmatched target'].append(f"{s['id']} {s['name']}: `{ex['text']}`")
                continue
        if t['id'] not in world:
            report['links outside this build'].append(f"{s['id']} → {t['id']} {t['name']}")
            continue
        back = [b for b in parse(t) if b['edge'] not in ('door', '?') and byname.get(norm(b['target'])) is s]
        back.sort(key=lambda b: b['edge'] != OPP[ex['edge']])   # two pieces can be joined on more than one side: match the facing edge first
        if back:
            to_edge, to_rng = back[0]['edge'], back[0]['range']
        else:
            to_edge, to_rng = OPP[ex['edge']], ex['range']
            report['one-way exit (arrival edge assumed opposite)'].append(f"{s['id']} {s['name']} {ex['edge']} → {t['id']} {t['name']}: target lists no exit back")
        conns.append({'from_id': s['id'], 'edge': ex['edge'], 'tile_range': ex['range'], 'to_id': t['id'], 'to_edge': to_edge, 'to_tile': to_rng})
        wa, wb = ex['range'][1] - ex['range'][0] + 1, to_rng[1] - to_rng[0] + 1
        lined_up = (int(s['id']) < 868 and int(t['id']) < 868) or (abs(wa - wb) <= 1 and abs((ex['range'][0] + ex['range'][1]) - (to_rng[0] + to_rng[1])) <= 4)   # the later kit pieces join former dead ends: openings rarely match
        if s['type'] in OUTDOOR and t['type'] in OUTDOOR and OPP[ex['edge']] == to_edge and lined_up:
            sec['edges'][ex['edge']] = {'to': t['id'], 'range': ex['range'], 'offset': to_rng[0] - ex['range'][0]}
        else:   # openings that don't line up: step across with a fade instead of showing a mismatched seam
            A_, B_ = edge_tiles(s, ex['edge'], ex['range']), edge_tiles(byid[t['id']], to_edge, to_rng)
            for i_, a in enumerate(A_):
                b = B_[round(i_ * (len(B_) - 1) / max(1, len(A_) - 1))]
                at, face = inward(b, to_edge)
                sec['warps'].append({'tile': a, 'to': t['id'], 'at': at, 'face': face, 'kind': 'stairs' if ex['stairs'] else 'edge', 'edge': ex['edge']})

# interiors: doors from links.json
linked = set()
for d in links['doors']:
    i, p = d['interior'], d['parent']
    if i not in world or p not in world:
        continue
    linked.add(i)
    doors = [d['door']] + ([d['door2']] if d.get('door2') else [])
    for k, dt in enumerate(doors):
        mat = d['mat'][min(k, len(d['mat']) - 1)]
        world[p]['warps'].append({'tile': dt, 'to': i, 'at': [mat[0], mat[1] - 1], 'face': 'up', 'kind': 'door', 'edge': 'up'})
    for m in d['mat']:
        world[i]['warps'].append({'tile': m, 'to': p, 'at': list(d.get('back_at') or [d['door'][0], d['door'][1] + 1]), 'face': d.get('back_face', 'down'), 'kind': 'door'})   # back_at: a door in a bottom wall returns you above it
    world[i]['spawns']['door'] = [d['mat'][0][0], d['mat'][0][1] - 1]
    world[i]['parent'] = p
    if d.get('confidence') != 'high':
        report['door placement TODO'].append(f"{i} {world[i]['name']} → {p} door {d['door']}: {d.get('why', '')}")
for i in links.get('shared_rooms', []):   # rooms several towns' doors open into: the doormat returns you to the door you came in by
    if i in world:
        for w in world[i]['warps']:
            if w.get('kind') == 'door' and w['to'] == world[i].get('parent'): w['to'] = 'back'
for st in links.get('stairs', []):
    a, b = st['a'], st['b']
    if a in world and b in world:
        world[a]['warps'].append({'tile': st['a_tile'], 'to': b, 'at': [st['b_tile'][0], st['b_tile'][1] + 1], 'face': 'down', 'kind': 'stairs'})
        world[b]['warps'].append({'tile': st['b_tile'], 'to': a, 'at': [st['a_tile'][0], st['a_tile'][1] + 1], 'face': 'down', 'kind': 'stairs'})
        world[b]['spawns'].setdefault('stairs', [st['b_tile'][0], st['b_tile'][1] + 1])
        linked.add(b)
        world[b]['parent'] = world[a].get('parent', a)
for w in links.get('warps', []):   # one-off links: gangways, a door on a drawn building, a ladder hatch
    if w['section'] in world and (w['to'] in world or w['to'] == 'back'):   # 'back': a shared house's doormat returns you to the door you came in by
        world[w['section']]['warps'].append({k: w[k] for k in ('tile', 'to', 'at', 'face', 'kind', 'node') if k in w})
        linked.add(w['section'])
        if w.get('parent'):
            world[w['section']]['parent'] = w['parent']
for i, why in links.get('ignore_mats', {}).items():
    if i in world:
        report['doormats left inert'].append(f"{i} {world[i]['name']}: {why}")
# planet gates on the Molten Frontier: stepping on the portal checks the story gate and travels to that planet
for g in links.get('gates', []):
    if g['section'] in world:
        dy = g.get('at_dy', 1)
        for t in g['tiles']:
            w = {'tile': t, 'to': 'planet:' + (g.get('planet') or g['options'][0]['planet']), 'at': [t[0], t[1] + dy], 'face': 'down' if dy > 0 else 'up', 'kind': 'gate'}
            for k in ('node', 'sub', 'label', 'options'):
                if g.get(k):
                    w[k] = g[k]
            world[g['section']]['warps'].append(w)
for lk in links.get('locks', []):   # story locks on ordinary warps: the gate check runs before you step on
    for w in world.get(lk['section'], {}).get('warps', []):
        if w['to'] == lk['to']:
            w['node'] = lk['node']
for k, z in links.get('zones', {}).items():
    if k in world:
        world[k]['zone'] = z
for k, sp in links.get('spawns', {}).items():
    if k in world:
        world[k]['spawns'].update(sp)
for k, objs in links.get('objects', {}).items():
    if k in world:
        world[k]['objects'] += objs
for s in sel:
    if s['type'] == 'interior' and s['id'] not in linked:
        same = [x for x in sel if x['planet'] == s['planet'] and x['type'] in OUTDOOR]
        guess = min(same, key=lambda x: abs(int(x['id']) - int(s['id'])), default=None)
        report['interior with no door yet (TODO)'].append(f"{s['id']} {s['name']}: nearest outdoor parent by id is {guess['id'] + ' ' + guess['name'] if guess else '?'}")
for k, txt in links.get('unlisted', {}).items():
    if k in world:
        report['paths drawn in the art but not in the atlas (left blocked)'].append(f"{k} {world[k]['name']}: {txt}")

# per-planet grid: seamless neighbours edge to edge (tile coordinates), each cluster on its own band
placed, band = {}, defaultdict(int)
for s in sel:
    if s['type'] not in OUTDOOR or s['id'] in placed:
        continue
    d = world[s['id']]['dir']
    stack, clus = [(s['id'], 0, band[d])], []
    while stack:
        i, gx, gy = stack.pop()
        if i in placed:
            continue
        placed[i] = (gx, gy)
        clus.append(i)
        for e, c in world[i]['edges'].items():
            j = c['to']
            if j in world and j not in placed and world[j]['type'] in OUTDOOR:
                wi, hi = world[i]['tiles']
                wj, hj = world[j]['tiles']
                stack.append({'right': (j, gx + wi, gy - c['offset']), 'left': (j, gx - wj, gy - c['offset']),
                              'bottom': (j, gx - c['offset'], gy + hi), 'top': (j, gx - c['offset'], gy - hj)}[e])
    band[d] = max(placed[i][1] + world[i]['tiles'][1] for i in clus) + 4
for i, g in placed.items():
    world[i]['grid'] = list(g)
for i, g in _ed('grid.json', {}).items():   # map pieces arranged by hand in the editor
    if i in world: world[i]['grid'] = list(g)
for sec in world.values():
    if 'default' not in sec['spawns'] and sec['edges']:   # outdoor: just inside the first edge exit
        side, e = next(iter(sec['edges'].items()))
        sec['spawns']['default'] = inward(edge_tiles(sec, side, e['range'])[0], side)[0]
def _snap(sid, t):   # a spawn on a wall moves to the nearest walkable tile
    p_ = os.path.join(ROOT, f'data/collision/{sid}.json')
    if not t or not os.path.exists(p_): return t
    R_ = json.load(open(p_))['rows']; H_, W_ = len(R_), len(R_[0])
    ok_ = lambda x, y: 0 <= x < W_ and 0 <= y < H_ and R_[y][x] in '.,'
    if ok_(*t): return t
    for r_ in range(1, 8):
        c_ = [(t[0] + dx, t[1] + dy) for dx in range(-r_, r_ + 1) for dy in range(-r_, r_ + 1) if max(abs(dx), abs(dy)) == r_ and ok_(t[0] + dx, t[1] + dy)]
        if c_: return list(min(c_, key=lambda q: abs(q[0] - t[0]) + abs(q[1] - t[1])))
    return t
for sec in world.values():
    if 'default' not in sec['spawns']:
        w0 = sec['warps'][0] if sec['warps'] else None   # one step in from this section's own first warp
        own = (inward(w0['tile'], w0['edge'])[0] if w0['edge'] in OPP else [w0['tile'][0], w0['tile'][1] - 1]) if w0 and w0.get('edge') else None
        sec['spawns']['default'] = next(iter(sec['spawns'].values()), None) or own or [sec['tiles'][0] // 2, sec['tiles'][1] // 2]
for sid_, sec in world.items():
    for k_, v_ in list(sec['spawns'].items()):
        if isinstance(v_, list) and len(v_) == 2: sec['spawns'][k_] = _snap(sid_, v_)

# townsfolk (data/sections/npcs.json): pinned tiles are kept; the rest go on open ground once a collision file
# exists, never on an exit, door or spawn, never next to one, spread apart, and never where they would cut a path
npc_src = json.load(open(os.path.join(ROOT, 'data/sections/npcs.json'), encoding='utf-8'))
for _k, _v in npc_src.items():
    if isinstance(_v, list):
        for _i, _p in enumerate(_v):
            if isinstance(_p, dict): _p['src'] = f'n:{_k}:{_i}'
for _k, _v in PLANET_NPCS.items():   # planet townsfolk join the story characters already listed for that section
    for _i, _p in enumerate(_v):
        if isinstance(_p, dict): _p['src'] = f'p:{_k}:{_i}'
    npc_src[_k] = npc_src.get(_k, []) + _v
for _k, _mv in ED_NPCS.get('moves', {}).items():   # map editor: people moved by hand stand exactly there
    for _p in npc_src.get(_k, []):
        if isinstance(_p, dict) and _p.get('src') in _mv:
            _p['tile'] = _mv[_p['src']]; _p['stay'] = True
for _k, _rm in ED_NPCS.get('removed', {}).items():
    npc_src[_k] = [_p for _p in npc_src.get(_k, []) if not (isinstance(_p, dict) and _p.get('src') in _rm)]
for _k, _add in ED_NPCS.get('added', {}).items():
    for _i, _p in enumerate(_add):
        npc_src.setdefault(_k, []).append(dict(_p, stay=True, src=f'e:{_k}:{_i}'))


def reach(rows, W, H, start, block):
    seen, q = {start}, [start]
    while q:
        x, y = q.pop()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            n = (x + dx, y + dy)
            if 0 <= n[0] < W and 0 <= n[1] < H and n not in seen and n not in block and rows[n[1]][n[0]] in '.,':
                seen.add(n); q.append(n)
    return seen


pop = json.load(open(os.path.join(ROOT, 'data/population.json'), encoding='utf-8'))


def lanes(sec, rows):
    """Tiles on any shortest walk between two of the section's exits, doors, warps and counters: the travel lanes."""
    W, H = sec['tiles']
    walk = lambda x, y: 0 <= x < W and 0 <= y < H and rows[y][x] in '.,'
    pts = [tuple(w['tile']) for w in sec['warps']] + [tuple(w['at']) for w in sec['warps']]
    for side, e in sec['edges'].items():   # every tile of every exit, so a two-wide corridor is a lane on both sides
        for k in range(e['range'][0], e['range'][1] + 1):
            pts.append({'left': (0, k), 'right': (W - 1, k), 'top': (k, 0), 'bottom': (k, H - 1)}[side])
    for o in sec.get('objects', []):
        for dx, dy in ((0, 1), (0, -1), (1, 0), (-1, 0)):
            if walk(o['tile'][0] + dx, o['tile'][1] + dy):
                pts.append((o['tile'][0] + dx, o['tile'][1] + dy))
                break
    pts = [p for p in dict.fromkeys(pts) if walk(*p)]
    dist = []
    for p in pts:
        d = {p: 0}
        q = [p]
        for c in q:
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                n = (c[0] + dx, c[1] + dy)
                if n not in d and walk(*n):
                    d[n] = d[c] + 1
                    q.append(n)
        dist.append(d)
    out = set()
    for i in range(len(pts)):
        for j in range(i + 1, len(pts)):
            if pts[j] not in dist[i]:
                continue
            L = dist[i][pts[j]]
            out |= {t for t, a in dist[i].items() if a + dist[j].get(t, 1 << 30) == L}
    return out


GUARDS = {'mf12', 'mf7'}   # Forge Miner Dax and the Helix grunt guard their gates on purpose


def unblock(sec, rows, things, keep_free=()):
    """Move anything standing in a travel lane to the nearest free tile beside it (within 4 tiles), never cutting a path off."""
    W, H = sec['tiles']
    lane = lanes(sec, rows)
    taken = {(t['x'], t['y']) for t in things} | set(keep_free)
    start = next((p for p in lane if p not in taken), None)
    if start is None:
        return
    count = lambda blocked: len(reach(rows, W, H, start, blocked)) if start not in blocked else 0
    keep = {tuple(w['tile']) for w in sec['warps']} | {tuple(w['at']) for w in sec['warps']} | {tuple(v) for v in sec['spawns'].values() if v}
    for side, e in sec['edges'].items():   # every exit tile and the two tiles in from it
        for k in range(e['range'][0], e['range'][1] + 1):
            for d in range(3):
                keep.add({'left': (d, k), 'right': (W - 1 - d, k), 'top': (k, d), 'bottom': (k, H - 1 - d)}[side])
    for o in sec.get('objects', []):
        keep |= {(o['tile'][0] + dx, o['tile'][1] + dy) for dx, dy in ((0, 1), (0, -1), (1, 0), (-1, 0))}
    for t in things:
        here = (t['x'], t['y'])
        if here not in lane or not (0 <= t['x'] < W and 0 <= t['y'] < H) or rows[t['y']][t['x']] not in '.,':
            continue   # out of the lanes already, or standing behind a counter / on scenery
        if t.get('wid') in GUARDS or t.get('stay'):
            continue   # standing in the way is their job until you beat them (or a hand-placed spot)
        best = None
        for r in range(1, max(W, H)):   # nearest free spot beside the lanes, anywhere in the section if need be
            cands = sorted(((x, y) for y in range(t['y'] - r, t['y'] + r + 1) for x in range(t['x'] - r, t['x'] + r + 1)
                            if abs(x - t['x']) + abs(y - t['y']) == r), key=lambda c: (c[1], c[0]))
            for c in cands:
                if not (0 <= c[0] < W and 0 <= c[1] < H) or rows[c[1]][c[0]] not in '.,' or c in lane or c in taken or c in keep:
                    continue
                without = taken - {here}
                base = count(without)
                if c not in reach(rows, W, H, start, without) or count(without | {c}) != base - 1:
                    continue   # standing there would wall off a pocket of ground
                best = c
                break
            if best:
                break
        if best:
            taken.discard(here)
            taken.add(best)
            t['x'], t['y'] = best
        elif not (t.get('wid') or t.get('story') or t.get('trainer') or t.get('name')):
            t['drop'] = 1   # a flavour townsperson with nowhere out of the way to stand
    things[:] = [t for t in things if not t.get('drop')]
PKEY = {'Dustara': 'dustara', 'Ferrox': 'ferrox', 'Sporeholm': 'sporeholm', 'Thalassa': 'thalassa', 'Neonis': 'neonis', 'Glyphos': 'glyphos', 'Pyros': 'pyros',
        'Glacia': 'glacia', 'Helix Station': 'helix', 'Halo': 'halo', 'Umbra': 'umbra', 'Starfall': 'starfall', 'Apex Arena': 'apex', 'Ystra': 'ystra'}


def hname(seed):
    return pop['names'][int(hashlib.md5(seed.encode()).hexdigest()[:8], 16) % len(pop['names'])]


# trainers: route_default on every route/field (minus 'skip'), apprentices per tower floor, optional pinned tiles
tr_rules = links.get('trainers', {})
for sid, sec in world.items():
    pk = sec['dir'].split('_', 1)[1]   # folder name: 12_starfall -> starfall
    sec['pkey'] = pk
    classes = pop['classes'].get(pk, [['Linker', 'explorer']])
    extra = []
    auto = tr_rules.get('route_default', 0) if sec['type'] in ('route', 'field') and sid not in tr_rules.get('skip', []) else 0
    for i in range(tr_rules.get('per_section', {}).get(sid, auto)):
        cls, art = classes[(int(sid) + i) % len(classes)]
        extra.append({'art': art, 'trainer': {'cls': cls, 'route': 1}, 't': []})
    for i in range(tr_rules.get('apprentices', {}).get(sid, 0)):
        cls, art = classes[(int(sid) + i + 2) % len(classes)]
        extra.append({'art': art, 'trainer': {'cls': 'Apprentice', 'app': 1}, 't': []})
    npc_src[sid] = npc_src.get(sid, []) + extra
    if sec['type'] != 'interior':
        for p in npc_src[sid]:
            role = (p.get('t') or [''])[0].split(':')[0].strip()
            if not p.get('trainer') and not p.get('wid') and not p.get('story') and 'Linker' in role and len(role) < 24:
                p['trainer'] = {'cls': role, 'linker': 1}
for t in tr_rules.get('tiles', []):
    lst = [p for p in npc_src.get(t['section'], []) if p.get('trainer')]
    if t['n'] < len(lst):
        lst[t['n']]['tile'] = t['tile']
        if t.get('face'):
            lst[t['n']]['face'] = t['face']

for sid, sec in world.items():
    people = npc_src.get(sid, [])
    cp = os.path.join(ROOT, 'data/collision', sid + '.json')
    if not people:
        continue
    if not os.path.exists(cp):
        report['npcs waiting for collision'].append(f"{sid} {sec['name']}: {len(people)} npcs")
        continue
    rows = json.load(open(cp))['rows']
    W, H = sec['tiles']
    keys = set()
    for w in sec['warps']:
        keys |= {tuple(w['tile']), tuple(w['at'])}
    for side, e in sec['edges'].items():
        for k in range(e['range'][0], e['range'][1] + 1):
            for d in range(3):
                keys.add({'left': (d, k), 'right': (W - 1 - d, k), 'top': (k, d), 'bottom': (k, H - 1 - d)}[side])
    keys |= {tuple(v) for v in sec['spawns'].values() if v}
    # the tiles you stand on to use a counter or talk to a pinned character must stay reachable too
    for t0 in [o['tile'] for o in sec.get('objects', [])] + [p['tile'] for p in people if p.get('tile')]:
        for dx, dy in ((0, 1), (0, -1), (1, 0), (-1, 0)):
            keys.add((t0[0] + dx, t0[1] + dy))
    keys = {k for k in keys if 0 <= k[0] < W and 0 <= k[1] < H and rows[k[1]][k[0]] in '.,'}
    taken = set()
    out = []
    wid_tile = {}
    pinned = {tuple(p['tile']) for p in people if p.get('tile')}
    base = reach(rows, W, H, next(iter(keys)), pinned) if keys else set()
    for n, person in enumerate(people):
        if person.get('wid') in wid_tile and (person.get('after') or person.get('until')):
            t = wid_tile[person['wid']]   # the same character at another story stage stands in the same place
        elif person.get('tile'):
            t = tuple(person['tile'])
        else:
            best, bs = None, -1
            for thr in ((10, 7) if sec['type'] == 'interior' else (13, 8)):   # open ground first, then any roomy spot
              if best:
                break
              for y in range(H):
                  for x in range(W):
                      if rows[y][x] != '.' or (x, y) in taken:
                          continue
                      if min((abs(x - a) + abs(y - b) for a, b in keys), default=9) < 2:
                          continue
                      if sum(1 for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)) if 0 <= x + dx < W and 0 <= y + dy < H and rows[y + dy][x + dx] in '.,') < 3:
                          continue
                      gap = min((abs(x - a) + abs(y - b) for a, b in taken), default=99)
                      # spread out, lean toward the middle of the map, tie-break deterministically per section
                      # open ground only (plazas, clearings, room floors), never a 1-2 tile corridor
                      op = sum(1 for yy in range(y - 2, y + 3) for xx in range(x - 2, x + 3) if 0 <= xx < W and 0 <= yy < H and rows[yy][xx] in '.,')
                      if op < thr and not person.get('near'):
                          continue
                      score = min(gap, 8) * 10 + op * 2 - (abs(x - W / 2) + abs(y - H / 2)) * 0.3 + ((x * 7 + y * 13 + n * 5 + int(sid)) % 10) * 0.05
                      if person.get('near'):   # a placement hint wins over everything but the safety rules
                          score = 1000 - 10 * (abs(x - person['near'][0]) + abs(y - person['near'][1])) + min(gap, 3)
                      if score <= bs:
                          continue
                      if keys:
                          k0 = next(iter(keys))
                          r = reach(rows, W, H, k0, taken | {(x, y)})
                          # never cut anything off: exits, counters, and every other walkable tile stay reachable
                          if not keys <= r or len(r) < len(base) - len((taken - pinned) & base) - 1:
                              continue
                      best, bs = (x, y), score
            if not best:
                report['npcs with no room'].append(f"{sid} {sec['name']}: " + ((person['t'] or [''])[0][:40] or (person.get('trainer') or {}).get('cls', person['art'])))
                continue
            t = best
        taken.add(t)
        if person.get('wid'):
            wid_tile.setdefault(person['wid'], t)
        o = {'x': t[0], 'y': t[1], 'art': person['art'], 'face': person.get('face', 'down'), 't': person['t'], **({'name': person['name']} if person.get('name') else {}), **({k: person[k] for k in ('pre', 'story', 'wid', 'after', 'until', 'legend', 'lv', 'flag', 'stay', 'keyline', 'por', 'src') if person.get(k)})}
        if person.get('trainer'):
            tr = dict(person['trainer'])
            if person.get('face'):
                o['face_pinned'] = 1
            o['id'] = person.get('wid') or f"sec{sid}_{'app' if tr.get('app') else 'tr'}{n}"
            tr.setdefault('name', hname(o['id']))
            o['trainer'] = tr
            if not person.get('face'):   # look down the longest open line: that's where they spot you
                best = None
                for d, (dx, dy) in (('down', (0, 1)), ('left', (-1, 0)), ('right', (1, 0)), ('up', (0, -1))):
                    k = 0
                    while k < 5 and 0 <= t[0] + dx * (k + 1) < W and 0 <= t[1] + dy * (k + 1) < H and rows[t[1] + dy * (k + 1)][t[0] + dx * (k + 1)] in '.,':
                        k += 1
                    if best is None or k > best[1]:
                        best = (d, k)
                o['face'] = best[0]
        out.append(o)
    movable = [o for o in out if not o.get('legend')]
    unblock(sec, rows, movable)
    lane_now = lanes(sec, rows)
    occupied = {(o['x'], o['y']) for o in movable}
    for o in movable:
        if not o.get('trainer') or o.get('wid') in GUARDS or o.get('face_pinned'):
            continue
        best = None
        for d, (dx, dy) in (('down', (0, 1)), ('left', (-1, 0)), ('right', (1, 0)), ('up', (0, -1))):
            k = hits = 0
            while k < 5:
                x, y = o['x'] + dx * (k + 1), o['y'] + dy * (k + 1)
                if not (0 <= x < W and 0 <= y < H) or rows[y][x] not in '.,' or (x, y) in occupied:
                    break
                k += 1
                hits += (x, y) in lane_now
            score = hits * 10 + k
            if best is None or score > best[1]:
                best = (d, score)
        o['face'] = best[0]
    sec['npcs'] = [o for o in out if o.get('legend') or o in movable]

arrivals = dict(links.get('arrival', {}))
for sid, sec in world.items():
    if 'arrival' in sec['spawns'] and sec.get('pkey') and sec['pkey'] not in arrivals:
        arrivals[sec['pkey']] = {'section': sid, 'why': 'atlas exit marked arrival'}
# ---- quest spots (data/sections/quest_spots.json) and visible wild Alienmon ----
QUESTS = {q['id']: q for q in json.load(open(os.path.join(ROOT, 'data/quests.json'), encoding='utf-8'))['quests']}
qsrc = {k: v for k, v in json.load(open(os.path.join(ROOT, 'data/sections/quest_spots.json'), encoding='utf-8')).items() if not k.startswith('_')}
STORY_BOSS = {'helix', 'starfall', 'apex'}   # their "keepers" are story bosses fought through the quest engine
boss_tile = {}
for sid, sec in world.items():
    if sec.get('pkey') in STORY_BOSS:
        for o in [o for o in sec['objects'] if o['k'] == 'keeper']:
            boss_tile[sid] = tuple(o['tile'])
            sec['objects'].remove(o)
CHAR_KINDS = {'giver', 'talk', 'battle_trainer', 'battle_rival', 'defeat_boss', 'legendary_encounter'}


def blocked_set(sec):
    return {(n['x'], n['y']) for n in sec.get('npcs', [])} | {tuple(o['tile']) for o in sec['objects']}


qtaken = defaultdict(set)
spots = {}
for key, sp in qsrc.items():
    sid = sp['s']
    if sid not in world:
        continue
    sec = world[sid]
    cp = os.path.join(ROOT, 'data/collision', sid + '.json')
    if not os.path.exists(cp):
        continue
    rows = json.load(open(cp))['rows']
    W, H = sec['tiles']
    qid, step = key.split(':')
    q = QUESTS.get(qid)
    kind = ('giver' if q and q.get('type') == 'side' else 'main_giver') if step == 'giver' else (q['objectives'][int(step)]['type'] if q and step.isdigit() and int(step) < len(q['objectives']) else '')
    out = {'s': sid}
    if sp.get('art'):
        out['art'] = sp['art']
    if sp.get('npc'):
        hit = [n for n in sec.get('npcs', []) if n.get('wid') == sp['npc']]
        if hit:
            out.update(x=hit[0]['x'], y=hit[0]['y'])
            spots[key] = out
            continue
        report['quest spots: npc not found'].append(f"{key} -> {sid} npc {sp['npc']}")
    if sp.get('boss') and sid in boss_tile:
        out.update(x=boss_tile[sid][0], y=boss_tile[sid][1])
        qtaken[sid].add(boss_tile[sid])
        spots[key] = out
        continue
    keys = {tuple(w['tile']) for w in sec['warps']} | {tuple(w['at']) for w in sec['warps']} | {tuple(v) for v in sec['spawns'].values() if v}
    keys |= {(w['tile'][0] + dx, w['tile'][1] + dy) for w in sec['warps'] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))}   # keep doorways clear
    for side, e in sec['edges'].items():
        for k in range(e['range'][0], e['range'][1] + 1):
            for d in range(2):
                keys.add({'left': (d, k), 'right': (W - 1 - d, k), 'top': (k, d), 'bottom': (k, H - 1 - d)}[side])
    for o in sec['objects']:
        for dx, dy in ((0, 1), (0, -1), (1, 0), (-1, 0)):
            keys.add((o['tile'][0] + dx, o['tile'][1] + dy))
    keys = {k for k in keys if 0 <= k[0] < W and 0 <= k[1] < H and rows[k[1]][k[0]] in '.,'}
    block = blocked_set(sec) | qtaken[sid]
    keys = {k for k in keys if k not in block}   # a key under a prop (e.g. beside a sign) would seed the flood from inside it
    lane = lanes(sec, rows) if kind in CHAR_KINDS else set()
    base = reach(rows, W, H, next(iter(keys)), block) if keys else set()
    near = sp.get('near') or [W // 2, H // 2]
    obj = q['objectives'][int(step)] if q and step.isdigit() and int(step) < len(q['objectives']) else {}
    want = sp.get('n') or (obj.get('count', 1) if obj.get('type') in ('collect', 'examine', 'visit') else 1)   # one point per item to find
    pts = []
    for _ in range(want):
        best, bs = None, None
        for y in range(H):
            for x in range(W):
                if rows[y][x] not in '.,' or (x, y) in keys or (x, y) in block or (x, y) in pts:
                    continue
                if base and (x, y) not in base:   # only ground the player can actually reach
                    continue
                if kind not in CHAR_KINDS and any(abs(x - n['x']) + abs(y - n['y']) <= 1 for n in sec.get('npcs', [])):
                    continue   # an item to find is never drawn on (or right beside) a person
                if pts:   # several points: spread them out, each a few tiles from the others
                    gap = min(abs(x - a) + abs(y - b) for a, b in pts)
                    if gap < 3:
                        continue
                    score = -min(gap, 7) * 3 + (abs(x - near[0]) + abs(y - near[1])) * 0.2
                else:
                    score = abs(x - near[0]) + abs(y - near[1]) + (6 if (x, y) in lane else 0)   # people stand beside the lanes
                if bs is not None and score >= bs:
                    continue
                if kind in CHAR_KINDS and keys:   # people block: never cut anything off
                    r = reach(rows, W, H, next(iter(keys)), block | {(x, y)})
                    if not keys <= r or len(r) < len(base) - 1:
                        continue
                best, bs = (x, y), score
        if not best:
            break
        pts.append(best)
    if not pts:
        report['quest spots with no room'].append(f"{key} -> {sid}")
        continue
    out.update(x=pts[0][0], y=pts[0][1])
    if want > 1:
        out['pts'] = [list(p) for p in pts]
    if kind in CHAR_KINDS:
        qtaken[sid].add(pts[0])
    spots[key] = out

# visible wild Alienmon: the classic towns' and regions' roaming Alienmon, one or two per outdoor section
pm = json.load(open(os.path.join(ROOT, 'data/painted_maps.json'), encoding='utf-8'))
for sid, sec in world.items():
    pk = sec.get('pkey')
    if sec['type'] not in OUTDOOR or not pk or sid in links.get('trainers', {}).get('skip', []) and False:
        continue
    src = [h['mon'] for h in pm.get(pk + ('' if sec['type'] == 'town' else '_route'), pm.get(pk, {})).get('hot', []) if h['k'] == 'mon' and h.get('mon')]
    if not src:
        src = [h['mon'] for h in pm.get(pk, {}).get('hot', []) if h['k'] == 'mon' and h.get('mon')]
    if not src:
        continue
    cp = os.path.join(ROOT, 'data/collision', sid + '.json')
    if not os.path.exists(cp):
        continue
    rows = json.load(open(cp))['rows']
    W, H = sec['tiles']
    keys = {tuple(w['tile']) for w in sec['warps']} | {tuple(w['at']) for w in sec['warps']} | {tuple(v) for v in sec['spawns'].values() if v}
    keys |= {(w['tile'][0] + dx, w['tile'][1] + dy) for w in sec['warps'] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))}   # keep doorways clear
    for side, e in sec['edges'].items():
        for k in range(e['range'][0], e['range'][1] + 1):
            for d in range(3):
                keys.add({'left': (d, k), 'right': (W - 1 - d, k), 'top': (k, d), 'bottom': (k, H - 1 - d)}[side])
    keys = {k for k in keys if 0 <= k[0] < W and 0 <= k[1] < H and rows[k[1]][k[0]] in '.,'}
    block = blocked_set(sec) | qtaken[sid] | {(s2['x'], s2['y']) for s2 in spots.values() if s2['s'] == sid}
    block |= {tuple(p) for s2 in spots.values() if s2['s'] == sid for p in s2.get('pts', [])}   # keep off items to find
    mlane = lanes(sec, rows)
    base = reach(rows, W, H, next(iter(keys)), block) if keys else set()
    mons = []
    for i in range(1 if sec['type'] == 'town' else 2):
        name = src[(int(sid) * 3 + i) % len(src)]
        best, bs = None, None
        for y in range(H):
            for x in range(W):
                if rows[y][x] not in '.,' or (x, y) in keys or (x, y) in block or (x, y) in mlane:
                    continue
                gap = min((abs(x - a) + abs(y - b) for a, b in block), default=9)
                if gap < 3:
                    continue
                score = -min(gap, 8) - (2 if rows[y][x] == ',' else 0) + ((x * 5 + y * 11 + i) % 7) * 0.1
                if bs is not None and score >= bs:
                    continue
                r = reach(rows, W, H, next(iter(keys)), block | {(x, y)}) if keys else set()
                if keys and (not keys <= r or len(r) < len(base) - 1):
                    continue
                best, bs = (x, y), score
        if best:
            block.add(best)
            base = reach(rows, W, H, next(iter(keys)), block) if keys else set()
            mons.append({'x': best[0], 'y': best[1], 'mon': name})
    sec['mons'] = mons
for _k, _ms in ED_MONS.items():   # map editor: hand-placed wild Alienmon (an empty list means none)
    if _k in world:
        world[_k]['mons'] = [{'x': m['x'], 'y': m['y'], 'mon': m['mon']} for m in _ms]

# ---- Linker Stashes: one-time item caches, better items as the story goes on, tucked away from the travel lanes ----
TIER = {'dustara': 1, 'ferrox': 1, 'sporeholm': 2, 'thalassa': 2, 'neonis': 3, 'glyphos': 3, 'pyros': 4, 'glacia': 4,
        'helix': 5, 'halo': 5, 'umbra': 6, 'starfall': 6, 'apex': 7, 'ystra': 7}
FRONTIER_TIER = {**{f'{i:03d}': 1 for i in range(14, 19)}, **{f'{i:03d}': 2 for i in range(19, 23)}, **{f'{i:03d}': 4 for i in range(23, 29)}}
LOOT = {   # (item, count, weight); 'dust' is Stardust
    1: [('stasis', 3, 5), ('gel', 2, 5), ('cure', 2, 3), ('tether', 1, 2), ('stun', 1, 2), ('dust', 150, 3), ('revive', 1, 1)],
    2: [('stasis', 5, 4), ('gel', 3, 3), ('megagel', 1, 3), ('harmonic', 2, 3), ('revive', 1, 2), ('cure', 2, 2), ('jammer', 1, 1), ('dust', 300, 3)],
    3: [('megagel', 2, 4), ('harmonic', 3, 4), ('revive', 2, 3), ('ether', 1, 2), ('stun', 2, 2), ('jammer', 1, 1), ('dust', 500, 3)],
    4: [('megagel', 3, 4), ('fullgel', 1, 2), ('harmonic', 5, 3), ('revive', 2, 3), ('ether', 2, 2), ('jammer', 2, 1), ('dust', 800, 3)],
    5: [('fullgel', 2, 4), ('maxrevive', 1, 2), ('ether', 3, 2), ('harmonic', 5, 2), ('singularity', 1, 1), ('dust', 1200, 3)],
    6: [('fullgel', 3, 4), ('maxrevive', 1, 3), ('singularity', 1, 2), ('ether', 3, 2), ('dust', 1600, 3)],
    7: [('fullgel', 3, 3), ('maxrevive', 2, 3), ('singularity', 2, 2), ('ether', 5, 2), ('dust', 2500, 3)],
}
COUNT = {'route': 2, 'field': 2, 'cave': 1, 'dungeon': 1, 'landmark': 1, 'town': 1, 'tower': 0, 'arena': 0, 'interior': 0}
stash_plan = {}
for sid, sec in world.items():
    n = COUNT.get(sec['type'], 0)
    if sec['type'] == 'tower' and not any(w['kind'] == 'stairs' and w['edge'] == 'top' for w in sec['warps'] if w.get('edge')):
        n = 0
    if sec['type'] in ('cave', 'dungeon') and int(hashlib.md5(sid.encode()).hexdigest(), 16) % 2:
        n += 1
    cp = os.path.join(ROOT, 'data/collision', sid + '.json')
    if not n or not os.path.exists(cp):
        continue
    tier = FRONTIER_TIER.get(sid) or TIER.get(sec.get('pkey'), 1)
    rows = json.load(open(cp))['rows']
    W, H = sec['tiles']
    lane = lanes(sec, rows)
    keys = {tuple(w['tile']) for w in sec['warps']} | {tuple(w['at']) for w in sec['warps']} | {tuple(v) for v in sec['spawns'].values() if v}
    for side, e in sec['edges'].items():
        for k in range(e['range'][0], e['range'][1] + 1):
            for d in range(3):
                keys.add({'left': (d, k), 'right': (W - 1 - d, k), 'top': (k, d), 'bottom': (k, H - 1 - d)}[side])
    for o in sec['objects']:
        keys |= {(o['tile'][0] + dx, o['tile'][1] + dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1)}
    block = blocked_set(sec) | qtaken[sid] | {(s2['x'], s2['y']) for s2 in spots.values() if s2['s'] == sid} | {(m['x'], m['y']) for m in sec.get('mons', [])}
    start = next((p for p in lane if p not in block), None)
    if start is None:
        continue
    base = reach(rows, W, H, start, block)
    chosen = []
    for i in range(n):
        best, bs = None, None
        for (x, y) in base:
            if (x, y) in lane or (x, y) in keys or (x, y) in chosen or (x, y) == start:
                continue
            far = min((abs(x - a) + abs(y - b) for a, b in lane), default=0)   # tucked away from the paths
            gap = min((abs(x - a) + abs(y - b) for a, b in chosen), default=20)
            score = min(far, 6) * 3 + min(gap, 10) + ((x * 7 + y * 13 + i) % 5) * 0.1
            if bs is not None and score <= bs:
                continue
            if len(reach(rows, W, H, start, block | set(chosen) | {(x, y)})) != len(base) - len(chosen) - 1:
                continue   # never wall anything off
            best, bs = (x, y), score
        if not best:
            break
        chosen.append(best)
    for i, t in enumerate(chosen):
        table = LOOT[tier]
        r = int(hashlib.md5(f'stash{sid}{i}'.encode()).hexdigest(), 16)
        total = sum(w for _, _, w in table)
        pick = r % total
        for item, cnt, w in table:
            if pick < w:
                break
            pick -= w
        sec['objects'].append({'tile': list(t), 'k': 'stash', 'item': item, 'n': cnt, 'tier': tier})
        stash_plan.setdefault(sec['planet'], []).append({'section': sid, 'name': sec['name'], 'tile': list(t), 'item': item, 'n': cnt, 'tier': tier})
# ---- final repair: everything a player can talk to, pick up, fight or walk onto must be reachable ----
CHAR_Q = {'giver', 'talk', 'battle_trainer', 'battle_rival', 'defeat_boss', 'legendary_encounter', 'deliver', 'show'}
N4 = ((1, 0), (-1, 0), (0, 1), (0, -1))


def repair(sid, sec):
    cp = os.path.join(ROOT, 'data/collision', sid + '.json')
    if not os.path.exists(cp):
        return
    rows = json.load(open(cp))['rows']
    W, H = sec['tiles']
    ground = lambda x, y: 0 <= x < W and 0 <= y < H and rows[y][x] in '.,'
    keys = {tuple(w['tile']) for w in sec['warps']} | {tuple(w['at']) for w in sec['warps']} | {tuple(v) for v in sec['spawns'].values() if v}
    starts = []   # explore from the way you arrive (edges and spawns first), then doors and warps
    for side, e in sec['edges'].items():
        for k in range(e['range'][0], e['range'][1] + 1):
            starts.append({'left': (0, k), 'right': (W - 1, k), 'top': (k, 0), 'bottom': (k, H - 1)}[side])
            for d in range(3):
                keys.add({'left': (d, k), 'right': (W - 1 - d, k), 'top': (k, d), 'bottom': (k, H - 1 - d)}[side])
    starts += [tuple(v) for v in sec['spawns'].values() if v] + [tuple(w['tile']) for w in sec['warps']]
    fixed = {tuple(o['tile']) for o in sec['objects'] if o['k'] != 'stash'}   # counters, signs, keepers: never move
    exits = set(starts)
    keys |= {(f[0] + dx, f[1] + dy) for f in fixed for dx, dy in N4}   # the tiles you use counters and signs from
    # movable things: [kind, getter, setter, droppable]
    things = []
    for n in sec.get('npcs', []):
        if not ground(n['x'], n['y']) or any((n['x'] + dx, n['y'] + dy) in fixed for dx, dy in N4) and n.get('tile_pinned'):
            continue
        if n.get('wid') in GUARDS or n.get('stay'):
            continue
        flavour = not (n.get('wid') or n.get('story') or n.get('name') or n.get('legend') or (n.get('trainer') or {}).get('app'))
        things.append(['npc', n, flavour])
    for m in sec.get('mons', []):
        things.append(['mon', m, True])
    for o in sec['objects']:
        if o['k'] == 'stash':
            things.append(['stash', o, True])
    use_pts = []
    for key, sp in spots.items():
        if sp['s'] != sid:
            continue
        qid, step = key.split(':')
        q = QUESTS.get(qid, {})
        kind = ('giver' if q.get('type') == 'side' else 'main_giver') if step == 'giver' else q['objectives'][int(step)]['type']
        if kind in CHAR_Q and not any(t[1].get('x') == sp['x'] and t[1].get('y') == sp['y'] for t in things if t[0] == 'npc'):
            things.append(['quest', sp, False])
        elif kind in ('visit', 'spot_event', 'collect', 'examine'):
            for p in sp.get('pts') or [[sp['x'], sp['y']]]:
                use_pts.append((tuple(p), kind in ('collect', 'examine')))
    pos = lambda t: tuple(t[1]['tile']) if t[0] == 'stash' else (t[1]['x'], t[1]['y'])

    def setpos(t, p):
        if t[0] == 'stash':
            t[1]['tile'] = list(p)
        else:
            t[1]['x'], t[1]['y'] = p

    def reachable(occ):
        seed = next((s for s in starts if ground(*s) and s not in occ), None)
        if seed is None:
            return set()
        seen = {seed}
        q = [seed]
        while q:
            x, y = q.pop()
            for dx, dy in N4:
                n = (x + dx, y + dy)
                if n not in seen and ground(*n) and n not in occ:
                    seen.add(n); q.append(n)
        return seen

    def problems(occ, seen):
        out = [t for t in things if not any((pos(t)[0] + dx, pos(t)[1] + dy) in seen for dx, dy in N4)]
        pts_bad = [p for p, adj in use_pts if not (p in seen or (adj and any((p[0] + dx, p[1] + dy) in seen for dx, dy in N4)))]
        return out, pts_bad

    # nobody stands in a narrow strip (a 2-3 tile shore or lane): they line up in single file and wall the player in
    N8 = [(dx, dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1) if dx or dy]
    narrow = lambda p, occ: sum(1 for dx, dy in N8 if ground(p[0] + dx, p[1] + dy) and (p[0] + dx, p[1] + dy) not in occ) < 6 or any((p[0] + dx, p[1] + dy) in occ - fixed for dx, dy in N8)   # ...or right beside someone else
    left_crowded = set()

    reserved = {p for p, _ in use_pts}
    for _ in range(120):
        occ = {pos(t) for t in things} | fixed
        seen = reachable(occ)
        bad_things, bad_pts = problems(occ, seen)
        # something standing on a quest point is the first thing to move
        on_pt = [t for t in things if pos(t) in reserved or pos(t) in keys]
        crowd = [t for t in things if id(t) not in left_crowded and narrow(pos(t), occ - {pos(t)})]
        target = (on_pt or bad_things or crowd or [None])[0]
        crowding = target is not None and not on_pt and not bad_things
        if target is None and bad_pts:
            p = bad_pts[0]   # a point walled off: move whoever stands nearest it
            target = min(things, key=lambda t: abs(pos(t)[0] - p[0]) + abs(pos(t)[1] - p[1]), default=None)
        if target is None:
            return
        here = pos(target)
        others = occ - {here}
        base_seen = reachable(others)
        base_exits = {k for k in exits if k in base_seen}
        cands = sorted((c for c in base_seen if c not in keys and c not in reserved and c != here and ground(*c) and not (crowding and narrow(c, others))),
                       key=lambda c: abs(c[0] - here[0]) + abs(c[1] - here[1]))
        moved = False
        for c in cands[:120]:
            occ2 = others | {c}
            seen2 = reachable(occ2)
            if len(seen2) != len(base_seen) - 1 or not (base_exits <= seen2):   # cut nothing off, no exit lost
                continue
            setpos(target, c)
            b2, p2 = problems(occ2, seen2)
            if target not in b2 and len(b2) + len(p2) < len(bad_things) + len(bad_pts) + (1 if target not in bad_things else 0):
                moved = True   # this one is fixed and nothing got worse
                break
            setpos(target, here)
        if moved:
            continue
        blockers = [t for t in things if t is not target and t[2] and abs(pos(t)[0] - here[0]) + abs(pos(t)[1] - here[1]) <= 2]
        if not target[2] and blockers:   # clear a movable neighbour out of the way first
            b = blockers[0]
            things.remove(b)
            things.insert(0, b)
            (sec['npcs'].remove(b[1]) if b[0] == 'npc' else sec['mons'].remove(b[1]) if b[0] == 'mon' else sec['objects'].remove(b[1]))
            things.remove(b)
            report['moved or dropped to keep everything reachable'].append(f"{sid} {sec['name']}: dropped {b[0]} at {pos(b)} (was crowding a quest figure)")
            continue
        if crowding and not target[2]:   # a named or quest figure with no open ground to go to: leave it be
            left_crowded.add(id(target))
            report['left in a narrow spot (no open ground)'].append(f"{sid} {sec['name']}: {target[0]} at {here}")
            continue
        if target[2]:   # a flavour townsperson, roaming Alienmon or stash with nowhere to go
            if target[0] == 'npc':
                sec['npcs'].remove(target[1])
            elif target[0] == 'mon':
                sec['mons'].remove(target[1])
            else:
                sec['objects'].remove(target[1])
            things.remove(target)
            report['moved or dropped to keep everything reachable'].append(f"{sid} {sec['name']}: dropped {target[0]} at {here}")
        else:
            report['unreachable (needs a hand fix)'].append(f"{sid} {sec['name']}: {target[0]} at {here}")
            things.remove(target)


for sid, sec in world.items():
    repair(sid, sec)
stash_plan = {}
for sid, sec in world.items():
    for o in sec['objects']:
        if o['k'] == 'stash':
            stash_plan.setdefault(sec['planet'], []).append({'section': sid, 'name': sec['name'], 'tile': list(o['tile']), 'item': o['item'], 'n': o['n'], 'tier': o['tier']})
json.dump(stash_plan, open(os.path.join(ROOT, 'data/sections/stashes.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
NAMES = {'stasis': 'Stasis Pod', 'harmonic': 'Harmonic Pod', 'singularity': 'Singularity Pod', 'gel': 'Med Gel', 'megagel': 'Mega Gel',
         'fullgel': 'Full Gel', 'revive': 'Revive Spark', 'maxrevive': 'Max Revive', 'cure': 'Cure Spray', 'tether': 'Tether Pulse',
         'stun': 'Stun Spray', 'ether': 'Ether Gel', 'jammer': 'Signal Jammer', 'dust': 'Stardust'}
doc = ['# Linker Stashes', '', 'One-time item caches hidden around every world, generated by `tools/sections/build_world.py` (edit the `LOOT` and `COUNT` tables there and rebuild).',
       'Items get better with the story: tier 1 (Dustara, Ferrox) up to tier 7 (Apex Array, Ystra). Stashes sit away from the main paths to reward exploring.', '']
total = 0
for planet, lst in stash_plan.items():
    doc += [f'## {planet} ({len(lst)})', '', '| Section | Tile | Item | Tier |', '|---|---|---|---|']
    for st in lst:
        doc.append(f"| {st['section']} {st['name'].replace('Molten Frontier: ', 'Frontier: ')} | {st['tile'][0]},{st['tile'][1]} | {st['n']}x {NAMES.get(st['item'], st['item'])} | {st['tier']} |")
        total += 1
    doc.append('')
doc.insert(4, f'**{total} stashes in total.**\n')
os.makedirs(os.path.join(ROOT, 'docs'), exist_ok=True)
open(os.path.join(ROOT, 'docs/LINKER_STASHES.md'), 'w', encoding='utf-8').write('\n'.join(doc))
print(f'{total} Linker Stashes placed')

def nearest_floor(sid, t):
    rows = json.load(open(os.path.join(ROOT, 'data/collision', sid + '.json')))['rows']
    W, H = world[sid]['tiles']
    if 0 <= t[0] < W and 0 <= t[1] < H and rows[t[1]][t[0]] in '.,':
        return t
    for r in range(1, 4):
        for dy in range(-r, r + 1):
            for dx in range(-r, r + 1):
                x, y = t[0] + dx, t[1] + dy
                if abs(dx) + abs(dy) == r and 0 <= x < W and 0 <= y < H and rows[y][x] in '.,':
                    return [x, y]
    return t


for sid, sec in world.items():
    for w in sec['warps']:
        if w['to'] in world and os.path.exists(os.path.join(ROOT, 'data/collision', w['to'] + '.json')):
            fixed_at = nearest_floor(w['to'], w['at'])
            if fixed_at != w['at']:
                report['warp landings moved off a wall'].append(f"{sid} -> {w['to']}: {w['at']} -> {fixed_at}")
                w['at'] = list(fixed_at)
    # trainers who face straight into a wall turn toward their longest open line
    cp = os.path.join(ROOT, 'data/collision', sid + '.json')
    if os.path.exists(cp):
        rows = json.load(open(cp))['rows']
        W, H = sec['tiles']
        ok = lambda x, y: 0 <= x < W and 0 <= y < H and rows[y][x] in '.,'
        D4 = {'down': (0, 1), 'left': (-1, 0), 'right': (1, 0), 'up': (0, -1)}
        for n in sec.get('npcs', []):
            if not n.get('trainer') or n.get('wid') in GUARDS:
                continue
            dx, dy = D4[n.get('face', 'down')]
            if not ok(n['x'] + dx, n['y'] + dy):
                best = max(D4, key=lambda d: sum(1 for k in range(1, 6) if all(ok(n['x'] + D4[d][0] * j, n['y'] + D4[d][1] * j) for j in range(1, k + 1))))
                n['face'] = best

# widen each join to every row where the road is open on both sides: art roads are often a tile or two wider than
# the planned opening, and the extra rows were invisible walls (tester: "blocked from this path" at the Trading Post)
def _rows(i):
    cp = os.path.join(ROOT, 'data/collision', i + '.json')
    return json.load(open(cp))['rows'] if os.path.exists(cp) else None
for sid, sec in world.items():
    for side, e in sec.get('edges', {}).items():
        t_ = world.get(e.get('to'))
        if not t_ or 'offset' not in e: continue
        A, B = _rows(sid), _rows(e['to'])
        if not A or not B: continue
        (W, H), (TW, TH) = sec['tiles'], t_['tiles']
        def both(a):
            k = a + e['offset']
            if side in ('left', 'right'):
                if not (0 <= a < H and 0 <= k < TH): return False
                return A[a][0 if side == 'left' else W - 1] in '.,:' and B[k][TW - 1 if side == 'left' else 0] in '.,:'
            if not (0 <= a < W and 0 <= k < TW): return False
            return A[0 if side == 'top' else H - 1][a] in '.,:' and B[TH - 1 if side == 'top' else 0][k] in '.,:'
        lo, hi = e['range']
        while both(lo - 1): lo -= 1
        while both(hi + 1): hi += 1
        if [lo, hi] != e['range']:
            report.setdefault('joins widened to the open road', []).append(f"{sid} {side} -> {e['to']}: {e['range']} -> {[lo, hi]}")
            e['range'] = [lo, hi]

# a stairs/door exit on the map border also works from the open tiles beside it in the same doorway
# (arena tunnels are 2 wide but the exit sat on one tile: walking down the other side trapped you)
for sid, sec in world.items():
    R = _rows(sid)
    if not R: continue
    W, H = sec['tiles']
    have = {tuple(w['tile']) for w in sec['warps']}
    for w in list(sec['warps']):
        if w.get('kind') not in ('stairs', 'door'): continue
        tx, ty = w['tile']
        if not (ty in (0, H - 1) or tx in (0, W - 1)): continue
        for a, b in ([(tx - 1, ty), (tx + 1, ty)] if ty in (0, H - 1) else [(tx, ty - 1), (tx, ty + 1)]):
            if 0 <= a < W and 0 <= b < H and R[b][a] in '.,' and (a, b) not in have:
                sec['warps'].append(dict(w, tile=[a, b])); have.add((a, b))
                report['exits widened to the whole doorway'].append(f"{sid} {sec['name']}: {w['tile']} also from {[a, b]}")

# a one-tile cave mouth or stairway whose neighbour is a dead-end pocket in the same opening (rock above and beside,
# open only behind): stepping into that pocket enters too (Red Rock Caves: walking up the right half of the mouth did nothing)
for sid, sec in world.items():
    R = _rows(sid)
    if not R: continue
    W, H = sec['tiles']
    have = {tuple(w['tile']) for w in sec['warps']}
    op = lambda x, y: 0 <= x < W and 0 <= y < H and R[y][x] in '.,'
    for w in list(sec['warps']):
        if w.get('kind') not in ('stairs', 'door'): continue
        tx, ty = w['tile']
        if ty == 0 or op(tx, ty - 1): continue
        if any(tuple(o['tile']) in ((tx - 1, ty), (tx + 1, ty)) and o['to'] == w['to'] for o in sec['warps']): continue   # already a wide doorway
        for a in (tx - 1, tx + 1):
            if not op(a, ty) or (a, ty) in have or op(a, ty - 1): continue
            if sum(op(a + dx, ty + dy) and (a + dx, ty + dy) != (tx, ty) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))) > 1: continue   # not a pocket: a walkway
            sec['warps'].append(dict(w, tile=[a, ty])); have.add((a, ty))
            report['one-tile entrances widened into their pocket'].append(f"{sid} {sec['name']}: {w['tile']} also from {[a, ty]}")

json.dump({'version': 1, 'tile': 16, 'screen_tiles': [10, 9], 'arrival': arrivals, 'quest_spots': spots, 'sections': world, 'connections': conns},
          open(os.path.join(ROOT, OUT or 'data/world.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
lines = ['# Section connections report', '',
         f'{len(world)} sections, {len(conns)} edge connections. Generated by `tools/sections/build_world.py`; fix these in `art/sections/atlas.json` or `data/sections/links.json` and re-run.', '']
if not report:
    lines.append('Every exit matched confidently.')
for k, v in report.items():
    lines += [f'## {k} ({len(v)})', ''] + [f'- {x}' for x in v] + ['']
open(os.path.join(ROOT, (OUT[:-5] + '_report.md') if OUT else 'data/connections_report.md'), 'w', encoding='utf-8').write('\n'.join(lines))
print(f'{len(world)} sections, {len(conns)} connections; report: ' + ', '.join(f'{k} {len(v)}' for k, v in report.items()))
