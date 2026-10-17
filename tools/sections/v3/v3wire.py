"""Assemble a world from its V3 plan (tools/sections/v3/plans/<dir>.json). Run from the repo root, then build_world.py.

    python tools/sections/v3/v3wire.py 02_ferrox [more dirs...]

Plan keys
  planet        planet key used by the game (e.g. "ferrox")
  use           {section id: {kit, name, type}}   kit pieces placed in the world. The id may be the kit id itself or an
                old section id that keeps its story wiring (its art and collision are replaced by the kit piece).
  keep          [ids]   existing sections kept as they are (their exits are rewritten from "edges")
  drop          [ids]   old sections removed from this world (their NPCs move per "npc_move")
  edges         [[a, side, b, side, (a_range), (b_range)]]   two outdoor sections joined edge to edge
  doors         [[parent, [x,y], interior, (door2 [x,y])]]   a building door that opens a room; the room's doormat
                (bottom centre) returns you in front of the door
  houses        [[parent, [x,y], room]]   a door into a shared room (several doors may open the same room)
  stairs        [[a, [x,y], b, [x,y]]]    walk onto the tile on a to arrive by the tile on b, and back
  counters      {room: [[x,y,'bay'|'shop'], ...]}
  objects       {id: [objects]}   extra objects (signs, keeper, chests) for a section, replacing its old ones
  spawns        {id: {...}}  arrival / default spawns
  gate          gate entries for links.json (way home) ; arrival: section where the world starts
  quest_spots   {spot key: section id or {s, near}}
  npc_move      {old id: new id}   NPCs (and trainer counts) of a dropped section move here (tile pins dropped)
  walk/block/gr {id: [[x0,y0,x1,y1], ...]}   hand collision fixes (kept in tools/sections/v3/spec/<kit id>.json)
"""
import json, os, re, sys, shutil, glob

HERE = 'tools/sections/v3'
SIDES = {'left': 'rows', 'right': 'rows', 'top': 'columns', 'bottom': 'columns'}
OPP = {'left': 'right', 'right': 'left', 'top': 'bottom', 'bottom': 'top'}


def slug(s): return re.sub(r'[^a-z0-9]+', '_', s.lower()).strip('_')


def load(p, d=None):
    return json.load(open(p, encoding='utf-8')) if os.path.exists(p) else d


def save(p, o): json.dump(o, open(p, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)


def rows_of(i): return json.load(open(f'data/collision/{i}.json'))['rows']


def runs_on(rows, side):
    H, W = len(rows), len(rows[0])
    line = {'left': [rows[y][0] for y in range(H)], 'right': [rows[y][W - 1] for y in range(H)], 'top': list(rows[0]), 'bottom': list(rows[H - 1])}[side]
    out, cur = [], []
    for i, c in enumerate(line + ['#']):
        if c in '.,': cur.append(i)
        elif cur: out.append([cur[0], cur[-1]]); cur = []
    return out


def best_run(rows, side):
    r = runs_on(rows, side)
    if not r: raise SystemExit(f'no walkable run on {side} edge')
    return max(r, key=lambda a: a[1] - a[0])


def apply_rects(i, rects):
    rows = [list(r) for r in rows_of(i)]
    if rects.get('base'): rows = [[rects['base']] * len(rows[0]) for _ in rows]
    for k, ch in (('walk', '.'), ('gr', ','), ('block', '#'), ('walk_after', '.'), ('block_after', '#')):
        for x0, y0, x1, y1 in rects.get(k, []):
            for y in range(y0, y1 + 1):
                for x in range(x0, x1 + 1):
                    if 0 <= y < len(rows) and 0 <= x < len(rows[0]): rows[y][x] = ch
    c = json.load(open(f'data/collision/{i}.json')); c['rows'] = [''.join(r) for r in rows]; c['v3_hand'] = True
    json.dump(c, open(f'data/collision/{i}.json', 'w'))


def mat_of(rows):
    """Doormat of a room: the two centre-most walkable tiles on the lowest row that has any near the middle."""
    H, W = len(rows), len(rows[0]); cx = W // 2
    for y in range(H - 1, 0, -1):
        xs = [x for x in range(cx - 3, cx + 3) if rows[y][x] in '.,']
        if len(xs) >= 2:
            xs.sort(key=lambda x: abs(x - cx + 0.5)); a, b = sorted(xs[:2]); return [[a, y], [b, y]]
    return [[cx - 1, H - 2], [cx, H - 2]]


def seal(sid, d, side, a, b, depth=2):
    """Close a road end at a map edge: a continuous strip of the blocked terrain beside it is copied across the gap
    (picture, soft-faded into the road on the inner side) and the gap is walled."""
    from PIL import Image
    import numpy as np
    f = glob.glob(f'art/sections_game/{d}/{sid}_*.png')[0]; im = np.asarray(Image.open(f).convert('RGBA')).astype(float); T = 16
    rows = [list(r) for r in rows_of(sid)]; H, W = len(rows), len(rows[0])
    n = W if side in ('top', 'bottom') else H; w = b - a + 1
    # work in "edge space": axis 0 = depth from the edge, axis 1 = along the edge
    view = {'top': lambda A: A, 'bottom': lambda A: A[::-1], 'left': lambda A: A.transpose(1, 0, 2), 'right': lambda A: A.transpose(1, 0, 2)[::-1]}[side]
    E = view(im).copy(); D = (depth + 1) * T
    blocked = lambda k0: 0 <= k0 and k0 + w <= n and all(rows[{'top': 0, 'bottom': H - 1}.get(side, 0)][k] == '#' if side in ('top', 'bottom') else rows[k][0 if side == 'left' else W - 1] == '#' for k in range(k0, k0 + w))
    cands = [a - w, b + 1, a - w - 1, b + 2, max(0, a - w), min(n - w, b + 1)]
    k0 = next((c for c in cands if blocked(c)), cands[-2] if cands[-2] >= 0 else cands[-1])
    patch = E[:D, k0 * T:(k0 + w) * T].copy()
    alpha = np.ones((D, 1, 1)); ramp = np.linspace(1, 0, T)[:, None, None]; alpha[depth * T:] = ramp   # last row fades into the road
    side_fade = np.ones((1, w * T, 1)); f6 = np.linspace(0.3, 1, 6)[None, :, None]; side_fade[:, :6] = f6; side_fade[:, -6:] = f6[:, ::-1]
    al = np.minimum(alpha, side_fade) if w > 2 else alpha
    E[:D, a * T:(b + 1) * T] = E[:D, a * T:(b + 1) * T] * (1 - al) + patch * al
    back = {'top': lambda A: A, 'bottom': lambda A: A[::-1], 'left': lambda A: A.transpose(1, 0, 2), 'right': lambda A: A[::-1].transpose(1, 0, 2)}[side]
    Image.fromarray(np.clip(back(E), 0, 255).astype('uint8'), 'RGBA').save(f)
    for j in range(depth):
        for k in range(a, b + 1):
            x, y = {'top': (k, j), 'bottom': (k, H - 1 - j), 'left': (j, k), 'right': (W - 1 - j, k)}[side]; rows[y][x] = '#'
    c = json.load(open(f'data/collision/{sid}.json')); c['rows'] = [''.join(r) for r in rows]; json.dump(c, open(f'data/collision/{sid}.json', 'w'))


def grass_fill(sid, x0, y0, x1, y1):
    from PIL import Image
    import numpy as np
    s = glob.glob(f'art/sections_game/*/{sid}_*.png')[0]; rows = [list(r) for r in rows_of(sid)]; H, W = len(rows), len(rows[0])
    a = np.asarray(Image.open(s).convert('RGB').resize((W * 16, H * 16))).astype(float).reshape(H, 16, W, 16, 3).mean((1, 3))
    x0, y0, x1, y1 = max(0, x0), max(0, y0), min(W - 1, x1), min(H - 1, y1)
    med = np.median(a[y0:y1 + 1, x0:x1 + 1].reshape(-1, 3), 0)
    for y in range(max(1, y0), min(H - 2, y1) + 1):   # never the outer ring (exits live there)
        for x in range(max(1, x0), min(W - 2, x1) + 1):
            if rows[y][x] == '#' and np.abs(a[y, x] - med).max() < 34: rows[y][x] = ','
    c = json.load(open(f'data/collision/{sid}.json')); c['rows'] = [''.join(r) for r in rows]; json.dump(c, open(f'data/collision/{sid}.json', 'w'))


def wire(d):
    P = load(f'{HERE}/plans/{d}.json'); KIT = load(f'{HERE}/kit.json')
    AT = load('art/sections/atlas.json'); L = load('data/sections/links.json')
    A = {s['id']: s for s in AT['sections']}
    pf = glob.glob(f'data/sections/planets/{d[:2]}_*.json'); PF = load(pf[0]) if pf else None
    planet_name = next((s['planet'] for s in AT['sections'] if s.get('file', '').startswith(f'art/sections/{d}/')), d)
    drop = set(P.get('drop', [])); use = P.get('use', {}); ids = set(use) | set(P.get('keep', []))

    # 1. kit pieces: art + collision under the section id, atlas entry
    for sid, u in use.items():
        k = KIT[u['kit']]
        for f in glob.glob(f'art/sections_game/{d}/{sid}_*.png'):
            if os.path.abspath(f) != os.path.abspath(k['file']): os.remove(f)
        dst = f'art/sections_game/{d}/{sid}_{slug(u["name"])}.png'   # the kit store (art/kit) is not shipped; used pieces are copied in
        shutil.copyfile(k['file'], dst)
        if sid != u['kit']: shutil.copyfile(f'data/collision/{u["kit"]}.json', f'data/collision/{sid}.json')
        c = json.load(open(f'data/collision/{sid}.json')); c['id'] = sid; c['name'] = u['name']; json.dump(c, open(f'data/collision/{sid}.json', 'w'))
        A[sid] = {'id': sid, 'planet': planet_name, 'name': u['name'], 'type': u.get('type', k['type']), 'size_px': [k['tiles'][0] * 64, k['tiles'][1] * 64],
                  'tiles': k['tiles'], 'tile_px_render': 64, 'tile_px_game': 16, 'exits': [], 'v3': True, 'kit': u['kit'],
                  'file': f'art/sections/{d}/' + os.path.basename(dst)}
    P['_dropped_names'] = [A[x]['name'] for x in drop if x in A]
    for sid in drop:
        A.pop(sid, None)
        if os.path.exists(f'data/collision/{sid}.json'): os.remove(f'data/collision/{sid}.json')
        for f in glob.glob(f'art/sections_game/{d}/{sid}_*.png'): os.remove(f)
    PL_ = load('data/sections/props_layout.json', {})   # a kit piece brings its own drawn props: old placed props of a replaced map go
    for sid in list(use) + list(drop): PL_.pop(sid, None)
    json.dump(PL_, open('data/sections/props_layout.json', 'w'), indent=0)
    for sid, rects in P.get('fix', {}).items(): apply_rects(sid, rects)
    # dead-end roads closed off with terrain. Kit pieces are re-copied every run, so they are sealed every run; kept maps' art is
    # permanent, so each of their seals is done once (tools/sections/v3/sealed_kept.json remembers which)
    done = load(f'{HERE}/sealed_kept.json', [])
    for s_ in P.get('seal', []):
        key = '|'.join(map(str, s_))
        if s_[0] in use or key not in done:
            seal(s_[0], d, s_[1], s_[2], s_[3], s_[4] if len(s_) > 4 else 2)
            if s_[0] not in use: done.append(key)
        dep = s_[4] if len(s_) > 4 else 2; rr = rows_of(s_[0]); H_, W_ = len(rr), len(rr[0])
        for o in P.get('objects', {}).get(s_[0], []):   # a reward left at the road end moves to just inside the new wall
            x, y = o['tile']; side = s_[1]
            if s_[2] <= (x if side in ('top', 'bottom') else y) <= s_[3]:
                if side == 'bottom' and y > H_ - 1 - dep: o['tile'] = [x, H_ - 1 - dep]
                if side == 'top' and y < dep: o['tile'] = [x, dep]
                if side == 'left' and x < dep: o['tile'] = [dep, y]
                if side == 'right' and x > W_ - 1 - dep: o['tile'] = [W_ - 1 - dep, y]
    save(f'{HERE}/sealed_kept.json', done)
    # painted tall grass the automatic walls missed (only tiles that look like the rest of the patch), and grass/walkable
    # ground that is really lava, water or railings
    for sid_, x0, y0, x1, y1 in P.get('grass_fill', []): grass_fill(sid_, x0, y0, x1, y1)
    for sid_, x0, y0, x1, y1 in P.get('grass_clear', []): apply_rects(sid_, {'block': [[x0, y0, x1, y1]]})

    # 2. exits from edges (both directions written)
    redefined = {}
    for e in P.get('edges', []): redefined.setdefault(e[0], set()).add(e[1]); redefined.setdefault(e[2], set()).add(e[3])
    dropnames = {A[x]['name'] for x in drop if x in A} | {n for n in P.get('_dropped_names', [])}
    V2 = {x['id']: x for x in load(f'{HERE}/atlas_v2.json')['sections']}   # exits as they were before the V3 rebuild (re-runs start from here)
    for sid in ids:   # kit pieces start clean; kept sections lose only the edges this plan redefines or that lead to dropped sections
        if sid in V2 and sid not in use: A[sid]['exits'] = list(V2[sid]['exits'])
        for side in P.get('remove_exits', {}).get(sid, []): A[sid]['exits'] = [e for e in A[sid]['exits'] if not e.startswith(side + ' edge')]
        if sid in use: A[sid]['exits'] = [e for e in A[sid]['exits'] if 'edge' not in e]
        else: A[sid]['exits'] = [e for e in A[sid]['exits'] if not ('edge' in e and (e.split(' ')[0] in redefined.get(sid, ()) or any(e.endswith('→ ' + n) for n in dropnames)))]
    for e in P.get('edges', []):
        a, sa, b, sb = e[:4]
        def clip(rows, side, r):   # an explicit range keeps only its walkable part (collision may have changed since the plan was written)
            if not r: return best_run(rows, side)
            ov = [[max(x0, r[0]), min(x1, r[1])] for x0, x1 in runs_on(rows, side) if x0 <= r[1] and x1 >= r[0]]
            return max(ov, key=lambda q: q[1] - q[0]) if ov else best_run(rows, side)
        ra = clip(rows_of(a), sa, e[4] if len(e) > 4 else None)
        rb = clip(rows_of(b), sb, e[5] if len(e) > 5 else None)
        A[a]['exits'].append(f"{sa} edge, tile {SIDES[sa]} {ra[0]}–{ra[1]} → {A[b]['name']}")
        A[b]['exits'].append(f"{sb} edge, tile {SIDES[sb]} {rb[0]}–{rb[1]} → {A[a]['name']}")
    from collections import Counter
    mine = {A[x]['name'] for x in ids if x in A}
    dup = [n for n, k in Counter(x['name'] for x in A.values()).items() if k > 1 and n in mine]
    if dup: raise SystemExit(f'map names must be unique across all worlds (exits connect by name): {dup}')
    AT['sections'] = list(A.values()); save('art/sections/atlas.json', AT)
    # no ghost exits: a road that runs off an edge with nothing wired there is walled off (reported, so a blocker prop can go there)
    wired = {}
    for e in P.get('edges', []):
        wired.setdefault(e[0], set()).add(e[1]); wired.setdefault(e[2], set()).add(e[3])
    for sid, u in use.items():
        if A[sid]['type'] == 'interior' or sid in P.get('open_edges', []): continue
        rows = [list(r) for r in rows_of(sid)]; H, W = len(rows), len(rows[0]); closed = []
        for side in SIDES:
            keep = None
            if side in wired.get(sid, set()):
                e = next(e for e in P['edges'] if (e[0] == sid and e[1] == side) or (e[2] == sid and e[3] == side))
                keep = (e[4] if e[0] == sid and len(e) > 4 and e[4] else e[5] if e[2] == sid and len(e) > 5 and e[5] else best_run(rows_of(sid), side))
            for a, b in runs_on(rows_of(sid), side):
                if keep and a <= keep[1] and b >= keep[0]: continue
                for k in range(a, b + 1):
                    x, y = {'left': (0, k), 'right': (W - 1, k), 'top': (k, 0), 'bottom': (k, H - 1)}[side]; rows[y][x] = '#'
                closed.append(f'{side} {a}-{b}')
        if closed:
            c = json.load(open(f'data/collision/{sid}.json')); c['rows'] = [''.join(r) for r in rows]; json.dump(c, open(f'data/collision/{sid}.json', 'w'))
            print('  closed', sid, A[sid]['name'], closed)

    # 3. links: clear everything positional for this world's sections, then rebuild
    allids = set(use) | drop   # kept sections keep their doors, objects and spawns; only their exits are rewritten
    kill = lambda x: x in allids
    L['doors'] = [x for x in L.get('doors', []) if not (kill(x['interior']) or kill(x['parent']))]
    L['stairs'] = [x for x in L.get('stairs', []) if not (kill(x['a']) or kill(x['b']))]
    L['warps'] = [w for w in L.get('warps', []) if not kill(w['section'])]
    for k in ('objects', 'ignore_mats', 'unlisted', 'edge_rows', 'spawns'):
        for sid in allids: L.get(k, {}).pop(sid, None)
    L['gates'] = [g for g in L.get('gates', []) if not kill(g['section'])]
    L['trainers']['tiles'] = [t for t in L['trainers']['tiles'] if not kill(t['section'])]
    for d_ in P.get('doors', []):
        par, t, room = d_[:3]; rr = rows_of(room)
        L['doors'] = [x for x in L['doors'] if not (x['parent'] == par and x['door'] == t)]
        L['doors'].append({'interior': room, 'parent': par, 'door': t, **({'door2': d_[3]} if len(d_) > 3 else {}), 'mat': mat_of(rr), 'confidence': 'high', 'why': 'V3 kit door'})
    for par, t, room in P.get('houses', []):
        L['objects'][par] = [o for o in L['objects'].get(par, []) if o['tile'] != t]
        L['objects'].setdefault(par, []).append({'tile': t, 'k': 'house', 'to': room, 'why': 'V3 kit house door'})
        if room not in L.get('shared_rooms', []): L.setdefault('shared_rooms', []).append(room)
        if not any(w['section'] == room and w['to'] == 'back' for w in L['warps']):   # a new room: its doormat leads back out
            mt = mat_of(rows_of(room))
            for t in mt: L['warps'].append({'section': room, 'tile': t, 'to': 'back', 'at': [t[0], t[1] - 1], 'face': 'down', 'kind': 'door', 'parent': par})
            L['spawns'][room] = {'default': [mt[0][0], mt[0][1] - 1]}
    for a, at, b, bt, a_arr, a_face, b_arr, b_face in P.get('warps', []):   # stairs with explicit landings
        L['warps'] = [w for w in L['warps'] if not ((w['section'] == a and w['tile'] == at) or (w['section'] == b and w['tile'] == bt))]   # re-runs replace, never pile up
        L['warps'].append({'section': a, 'tile': at, 'to': b, 'at': b_arr, 'face': b_face, 'kind': 'stairs'})
        L['warps'].append({'section': b, 'tile': bt, 'to': a, 'at': a_arr, 'face': a_face, 'kind': 'stairs'})
    for a, at, b, bt in P.get('stairs', []):
        L['stairs'].append({'a': a, 'a_tile': at, 'b': b, 'b_tile': bt, 'why': 'V3 kit stairs'})
    for room, cs in P.get('counters', {}).items():
        for x, y, kk in cs: L['objects'].setdefault(room, []).append({'tile': [x, y], 'k': kk})
    for sid, objs in P.get('objects', {}).items():
        tiles = [o['tile'] for o in objs]; L['objects'][sid] = [o for o in L['objects'].get(sid, []) if o['tile'] not in tiles] + objs
    for sid, sp in P.get('spawns', {}).items(): L['spawns'][sid] = sp
    L['gates'] += P.get('gate', [])
    L['trainers'].setdefault('per_section', {}).update(P.get('trainers_per_section', {}))
    L['trainers']['tiles'] += P.get('trainer_tiles', [])
    if P.get('arrival'): L['arrival'][P['planet']] = {'section': P['arrival'], 'why': 'V3: ' + P.get('arrival_why', 'world kit arrival')}
    # warp and stair tiles must be walkable (you step onto them)
    need = {}
    for a_, at_, b_, bt_, aa_, af_, ba_, bf_ in P.get('warps', []): need.setdefault(a_, []).extend([at_, aa_]); need.setdefault(b_, []).extend([bt_, ba_])
    for a_, at_, b_, bt_ in P.get('stairs', []): need.setdefault(a_, []).append(at_); need.setdefault(b_, []).append(bt_)
    for sid_, ts in need.items():
        c = json.load(open(f'data/collision/{sid_}.json')); R_ = [list(r) for r in c['rows']]
        for x, y in ts:
            if 0 <= y < len(R_) and 0 <= x < len(R_[0]) and R_[y][x] == '#': R_[y][x] = '.'
        c['rows'] = [''.join(r) for r in R_]; json.dump(c, open(f'data/collision/{sid_}.json', 'w'))
    save('data/sections/links.json', L)

    # 4. NPCs, trainers and quest spots follow their sections
    NP = load('data/sections/npcs.json')
    for sid in P.get('npc_unpin', []):
        for n in NP.get(sid, []): n.pop('tile', None)
    for old, new in P.get('npc_move', {}).items():
        for n in NP.pop(old, []): n.pop('tile', None); NP.setdefault(new, []).append(n)
    for sid, pins in P.get('npc_pins', {}).items():
        for n, t in zip(NP.get(sid, []), pins):
            if t: n['tile'] = t; n['stay'] = True
    save('data/sections/npcs.json', NP)
    if PF:
        for old, new in P.get('npc_move', {}).items():
            for n in PF['npcs'].pop(old, []):
                n.pop('tile', None); PF['npcs'].setdefault(new, []).append(n)
            if old in PF.get('trainers_per_section', {}):
                PF['trainers_per_section'][new] = PF['trainers_per_section'].get(new, 0) + PF['trainers_per_section'].pop(old)
        for sid in allids:
            PF['objects'].pop(sid, None)
            PF['doors'] = [x for x in PF.get('doors', []) if not (kill(x['interior']) or kill(x['parent']))]
        PF['trainer_tiles'] = [t for t in PF.get('trainer_tiles', []) if not kill(t['section'])]
        for sid, objs in P.get('planet_objects', {}).items(): PF['objects'][sid] = objs
        for sid, nps in P.get('npc_pins', {}).items():
            for n, t in zip(PF['npcs'].get(sid, []), nps):
                if t: n['tile'] = t; n['stay'] = True
        PF['unlisted'] = {}
        save(pf[0], PF)
    QS = load('data/sections/quest_spots.json')
    for k, v in P.get('quest_spots', {}).items(): QS[k] = v if isinstance(v, dict) else {'s': v}
    for k, v in QS.items():
        if isinstance(v, dict) and v.get('s') in drop and k not in P.get('quest_spots', {}): print('WARN quest spot still on a dropped section:', k, v)
    save('data/sections/quest_spots.json', QS)
    # 5. wild Alienmon: tables follow the plan (new id <- old id, optionally into another habitat); dropped sections lose theirs
    E = load('data/encounters.json'); HR = load('data/habitat_rules.json'); src = {k: json.loads(json.dumps(v)) for k, v in E.items()}
    src = {**load(f'{HERE}/encounters_v2.json', {}), **src}   # tables from before the V3 rebuild (sections the rebuild removed)
    def fits(types, hab):
        h = HR['habitats'].get(hab)
        if not h: return False
        tol = list(h['tolerated'])
        if hab in ('volcanic', 'volcano', 'sun_forge', 'ash_trail') and 'Bio' in types:
            if not any(t in ('Magma', 'Plasma') for t in types): return False
            tol.append('Bio')
        return all(t not in HR['hard_bans'].get(hab, []) and t in h['native'] + tol for t in types)
    for new, spec in P.get('encounters', {}).items():
        old, hab = (spec, None) if isinstance(spec, str) else (spec[0], spec[1])
        t = json.loads(json.dumps(src[old])); t['name'] = A[new]['name']
        if hab:
            t['habitat'] = hab; t['encounters'] = [e for e in t['encounters'] if fits(e['types'], hab)]
            for e in t['encounters']: e['method'] = 'walk'
        if t['encounters']:
            E[new] = t; HR['sections'][new] = {'planet': t['planet'], 'name': t['name'], 'habitat': t['habitat']}
        else: print('  no species fit', new, hab)
    for sid, extra in P.get('encounter_add', {}).items():
        if sid in E: E[sid]['encounters'] += [x for x in extra if x['name'] not in {e['name'] for e in E[sid]['encounters']}]
    for sid in drop:
        E.pop(sid, None); HR['sections'].pop(sid, None)
    save('data/encounters.json', E); save('data/habitat_rules.json', HR)
    print('wired', d, len(ids), 'sections,', len(P.get('edges', [])), 'edges')


if __name__ == '__main__':
    for d in sys.argv[1:]: wire(d)
