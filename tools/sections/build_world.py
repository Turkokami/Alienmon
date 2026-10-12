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
links = json.load(open(os.path.join(ROOT, 'data/sections/links.json'), encoding='utf-8'))
PLANET_NPCS = {}
for pf in sorted(glob.glob(os.path.join(ROOT, 'data/sections/planets/*.json'))):
    try:
        extra = json.load(open(pf, encoding='utf-8'))
    except (ValueError, OSError) as e:   # another helper may be mid-write: skip it this run
        print('skipping', os.path.basename(pf), e)
        continue
    for k in ('doors', 'stairs', 'gates'):
        links.setdefault(k, []).extend(extra.get(k, []))
    for k in ('objects', 'spawns', 'unlisted', 'ignore_mats', 'zones', 'arrival', 'edge_rows'):
        links.setdefault(k, {}).update(extra.get(k, {}))
    tr = links.setdefault('trainers', {})
    tr.setdefault('apprentices', {}).update(extra.get('apprentices', {}))
    tr.setdefault('tiles', []).extend(extra.get('trainer_tiles', []))
    tr.setdefault('per_section', {}).update(extra.get('trainers_per_section', {}))
    PLANET_NPCS.update(extra.get('npcs', {}))
OUTDOOR = {'town', 'route', 'field', 'landmark'}
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
        if norm(tgt).startswith('arrival'):
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
        if back:
            to_edge, to_rng = back[0]['edge'], back[0]['range']
        else:
            to_edge, to_rng = OPP[ex['edge']], ex['range']
            report['one-way exit (arrival edge assumed opposite)'].append(f"{s['id']} {s['name']} {ex['edge']} → {t['id']} {t['name']}: target lists no exit back")
        conns.append({'from_id': s['id'], 'edge': ex['edge'], 'tile_range': ex['range'], 'to_id': t['id'], 'to_edge': to_edge, 'to_tile': to_rng})
        if s['type'] in OUTDOOR and t['type'] in OUTDOOR and OPP[ex['edge']] == to_edge:
            sec['edges'][ex['edge']] = {'to': t['id'], 'range': ex['range'], 'offset': to_rng[0] - ex['range'][0]}
        else:
            for a, b in zip(edge_tiles(s, ex['edge'], ex['range']), edge_tiles(byid[t['id']], to_edge, to_rng)):
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
        world[i]['warps'].append({'tile': m, 'to': p, 'at': [d['door'][0], d['door'][1] + 1], 'face': 'down', 'kind': 'door'})
    world[i]['spawns']['door'] = [d['mat'][0][0], d['mat'][0][1] - 1]
    world[i]['parent'] = p
    if d.get('confidence') != 'high':
        report['door placement TODO'].append(f"{i} {world[i]['name']} → {p} door {d['door']}: {d.get('why', '')}")
for st in links.get('stairs', []):
    a, b = st['a'], st['b']
    if a in world and b in world:
        world[a]['warps'].append({'tile': st['a_tile'], 'to': b, 'at': [st['b_tile'][0], st['b_tile'][1] + 1], 'face': 'down', 'kind': 'stairs'})
        world[b]['warps'].append({'tile': st['b_tile'], 'to': a, 'at': [st['a_tile'][0], st['a_tile'][1] + 1], 'face': 'down', 'kind': 'stairs'})
        world[b]['spawns'].setdefault('stairs', [st['b_tile'][0], st['b_tile'][1] + 1])
        linked.add(b)
        world[b]['parent'] = world[a].get('parent', a)
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
for sec in world.values():
    if 'default' not in sec['spawns'] and sec['edges']:   # outdoor: just inside the first edge exit
        side, e = next(iter(sec['edges'].items()))
        sec['spawns']['default'] = inward(edge_tiles(sec, side, e['range'])[0], side)[0]
for sec in world.values():
    if 'default' not in sec['spawns']:
        w0 = sec['warps'][0] if sec['warps'] else None   # one step in from this section's own first warp
        own = (inward(w0['tile'], w0['edge'])[0] if w0['edge'] in OPP else [w0['tile'][0], w0['tile'][1] - 1]) if w0 and w0.get('edge') else None
        sec['spawns']['default'] = next(iter(sec['spawns'].values()), None) or own or [sec['tiles'][0] // 2, sec['tiles'][1] // 2]

# townsfolk (data/sections/npcs.json): pinned tiles are kept; the rest go on open ground once a collision file
# exists, never on an exit, door or spawn, never next to one, spread apart, and never where they would cut a path
npc_src = json.load(open(os.path.join(ROOT, 'data/sections/npcs.json'), encoding='utf-8'))
for _k, _v in PLANET_NPCS.items():   # planet townsfolk join the story characters already listed for that section
    npc_src[_k] = npc_src.get(_k, []) + _v


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
        o = {'x': t[0], 'y': t[1], 'art': person['art'], 'face': person.get('face', 'down'), 't': person['t'], **({'name': person['name']} if person.get('name') else {}), **({k: person[k] for k in ('pre', 'story', 'wid', 'after', 'until', 'legend', 'lv', 'flag') if person.get(k)})}
        if person.get('trainer'):
            tr = dict(person['trainer'])
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
    sec['npcs'] = out

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
    base = reach(rows, W, H, next(iter(keys)), block) if keys else set()
    near = sp.get('near') or [W // 2, H // 2]
    want = sp.get('n', 1)
    pts = []
    for _ in range(want):
        best, bs = None, None
        for y in range(H):
            for x in range(W):
                if rows[y][x] not in '.,' or (x, y) in keys or (x, y) in block or (x, y) in pts:
                    continue
                if pts:   # several points: spread them out, each a few tiles from the others
                    gap = min(abs(x - a) + abs(y - b) for a, b in pts)
                    if gap < 3:
                        continue
                    score = -min(gap, 7) * 3 + (abs(x - near[0]) + abs(y - near[1])) * 0.2
                else:
                    score = abs(x - near[0]) + abs(y - near[1])
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
    base = reach(rows, W, H, next(iter(keys)), block) if keys else set()
    mons = []
    for i in range(1 if sec['type'] == 'town' else 2):
        name = src[(int(sid) * 3 + i) % len(src)]
        best, bs = None, None
        for y in range(H):
            for x in range(W):
                if rows[y][x] not in '.,' or (x, y) in keys or (x, y) in block:
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
