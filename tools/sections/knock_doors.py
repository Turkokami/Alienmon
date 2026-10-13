"""Drawn doors with no interior (listed in data/connections_report.md) become doors you can knock on.
Writes data/sections/knock_doors.json: {section: [[x, y, stand_x, stand_y, face], ...]}.  Usage: python tools/sections/knock_doors.py"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
world = json.load(open(os.path.join(ROOT, 'data/world.json'), encoding='utf-8'))['sections']
rep = open(os.path.join(ROOT, 'data/connections_report.md'), encoding='utf-8').read().splitlines()
out = {}
for line in rep:
    m = re.match(r'- (\d{3}) ', line)
    if not m or 'door' not in line.lower() or 'doormat' in line.lower():
        continue
    sid = m.group(1)
    if sid not in world:
        continue
    sec = world[sid]
    rows = json.load(open(os.path.join(ROOT, 'data/collision', sid + '.json')))['rows']
    W, H = sec['tiles']
    warps = {tuple(w['tile']) for w in sec['warps']}
    taken = {(n['x'], n['y']) for n in sec.get('npcs', [])} | {tuple(o['tile']) for o in sec.get('objects', [])}
    # only the coordinates written right after a door mention
    for seg in re.split(r'(?i)(?=door)', line)[1:]:
        for a, b in re.findall(r'\((\d+)(?:-\d+)?,\s*(\d+)(?:-\d+)?\)', seg.split(';')[0][:60]):
            x, y = int(a), int(b)
            if not (0 <= x < W and 0 <= y < H) or (x, y) in warps or (x, y) in taken or rows[y][x] in '.,':
                continue
            for fx, fy, face in ((0, 1, 'up'), (-1, 0, 'right'), (1, 0, 'left'), (0, -1, 'down')):
                sx, sy = x + fx, y + fy
                if 0 <= sx < W and 0 <= sy < H and rows[sy][sx] in '.,' and (sx, sy) not in taken:
                    out.setdefault(sid, [])
                    if not any(d[0] == x and d[1] == y for d in out[sid]):
                        out[sid].append([x, y, sx, sy, face])
                    break
json.dump(out, open(os.path.join(ROOT, 'data/sections/knock_doors.json'), 'w', encoding='utf-8'), indent=1)
print(sum(len(v) for v in out.values()), 'doors in', len(out), 'sections')
