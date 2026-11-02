"""Apply map-editor changes and rebuild the game.

    python tools/editor/apply.py                          # changes saved straight into the folder by the editor
    python tools/editor/apply.py --from editor_changes.json   # a download from the editor (phone, or a browser without folder access)
    python tools/editor/apply.py --push                   # also commit and push (only on the maps-v2 test branch)
    python tools/editor/apply.py --from data/editor/pending.json --stage   # what the GitHub workflow runs for web saves

Writes the editor's files (props layout, people, wild Alienmon, new map pieces and their walls), then runs the usual pipeline:
build_world -> check_sections -> check_reach -> build.js -> check_build. Stops before pushing if any check fails.
"""
import base64, json, os, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(ROOT)


def run(cmd):
    print('>', ' '.join(cmd)); r = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace')
    out = (r.stdout + r.stderr).strip(); print('\n'.join(out.splitlines()[-6:]))
    return r.returncode, out


def unpack(path):
    b = json.load(open(path, encoding='utf-8'))
    os.makedirs('data/editor', exist_ok=True)
    json.dump(b.get('layout', {}), open('data/sections/props_layout.json', 'w'), indent=0)
    json.dump(b.get('npcs', {}), open('data/editor/npcs.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    json.dump(b.get('mons', {}), open('data/editor/mons.json', 'w'), indent=1)
    json.dump(b.get('maps', []), open('data/editor/maps.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    json.dump(b.get('grid', {}), open('data/editor/grid.json', 'w'), indent=1)
    json.dump(b.get('routes', []), open('data/editor/routes.json', 'w'), indent=1)
    json.dump(b.get('doors', {}), open('data/editor/doors.json', 'w'), indent=1)
    json.dump(b.get('clips', []), open('data/editor/clips.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    json.dump(b.get('tilesets', []), open('data/editor/tilesets.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    json.dump(b.get('design', {}), open('data/editor/design.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    enc = b.get('design', {}).get('enc', {})
    if enc:   # wild Alienmon set in the editor go into the real encounter tables, where check_habitats.js checks them
        E = json.load(open('data/encounters.json', encoding='utf-8'))
        for sid, e in enc.items():
            if e.get('encounters'):
                E[sid] = {k: e[k] for k in ('planet', 'name', 'habitat', 'encounters') if k in e}
            else:
                E.pop(sid, None)
        json.dump(E, open('data/encounters.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    for rel, txt in b.get('files', {}).items():   # prop sheets made in the Sprite Studio (their cut.json); nothing outside art/props
        if rel.startswith('art/props/') and rel.endswith('/cut.json') and '..' not in rel:
            os.makedirs(os.path.dirname(rel), exist_ok=True); open(rel, 'w', encoding='utf-8').write(txt)
    for sid, c in b.get('collision', {}).items():
        json.dump(c, open(f'data/collision/{sid}.json', 'w'))
    for m in b.get('maps', []):   # scenes dropped from the scene library: copy the library picture into place
        if m.get('src') and os.path.exists(m['src']) and not os.path.exists(m['img']):
            os.makedirs(os.path.dirname(m['img']), exist_ok=True)
            shutil.copyfile(m['src'], m['img'])
    for rel, url in b.get('images', {}).items():
        if url and url.startswith('data:image/png;base64,') and '..' not in rel and rel.startswith('art/'):
            os.makedirs(os.path.dirname(rel), exist_ok=True)
            open(rel, 'wb').write(base64.b64decode(url.split(',', 1)[1]))
    print('unpacked', path)


def census():
    """Per map: people, roaming Alienmon and stashes in data/world.json, plus quest spots the builder couldn't place."""
    if not os.path.exists('data/world.json'):
        return {}, 0
    W = json.load(open('data/world.json', encoding='utf-8'))['sections']
    c = {k: (len(v.get('npcs') or []), len(v.get('mons') or []), sum(1 for o in v.get('objects') or [] if o.get('k') == 'stash')) for k, v in W.items()}
    rep = open('data/connections_report.md', encoding='utf-8').read() if os.path.exists('data/connections_report.md') else ''
    import re
    m = re.search(r'## quest spots with no room \((\d+)\)', rep)
    return c, int(m.group(1)) if m else 0


def main():
    if '--from' in sys.argv:
        unpack(sys.argv[sys.argv.index('--from') + 1])
    if '--stage' in sys.argv:   # new map images must be tracked or check_build flags them as missing on Vercel
        subprocess.run(['git', 'add'] + [p for p in ('art/sections_game', 'art/editor_clips', 'art/editor_tiles', 'art/characters', 'art/props', 'art/sections_paint', 'art/sections_over_ed', 'data/encounters.json', 'data/collision', 'data/editor', 'data/sections/props_layout.json') if os.path.exists(p)])
    steps = [['python', 'tools/sections/build_world.py'], ['python', 'tools/sections/check_sections.py'],
             ['python', 'tools/sections/check_reach.py'], ['node', 'tools/build.js'], ['node', 'tools/check_build.js']]
    bad = False
    before, q0 = census()
    for st in steps:
        code, out = run(st)
        if st[1].endswith('build_world.py') and before:   # nobody may vanish: an edit that crowds out a person, a roaming Alienmon, a stash or a quest spot stops here
            after, q1 = census(); lost = [f'{k} {n}' for k in before for n, a_, b_ in zip(('people', 'roaming Alienmon', 'stashes'), before[k], after.get(k, (0, 0, 0))) if b_ < a_]
            if lost or q1 > q0:
                print('\nThese maps lost something because the edit filled the spots they stood on (move or remove props there):\n  ' + '\n  '.join(lost + ([f'{q1 - q0} quest spot(s) with no room (see data/connections_report.md)'] if q1 > q0 else [])))
                bad = True
        if code or 'FAIL' in out or 'SYNTAX ERROR' in out or 'unreachable' in out.lower().split('everything reachable')[0][-200:]:
            if code or 'FAIL' in out or 'SYNTAX ERROR' in out:
                bad = True
    if bad:
        print('\nSomething needs fixing before this can be published (see above). Nothing was pushed.'); sys.exit(1)
    print('\nRebuilt OK. Open www/index.html via the local server, or push to publish the test link.')
    if '--push' in sys.argv:
        branch = subprocess.run(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], capture_output=True, text=True).stdout.strip()
        if branch != 'maps-v2':
            print(f'Not pushing: on branch {branch}, editor changes only publish from maps-v2.'); return
        subprocess.run(['git', 'add', 'data/sections/props_layout.json', 'data/editor', 'data/collision', 'data/world.json', 'art/sections_game',
                        'art/editor_clips', 'art/editor_tiles', 'art/characters', 'art/props', 'art/sections_paint', 'art/sections_over_ed', 'data/encounters.json',
                        'data/sections/stashes.json', 'docs/LINKER_STASHES.md', 'data/connections_report.md'])
        subprocess.run(['git', 'commit', '-q', '-m', 'Map editor changes'])
        subprocess.run(['git', 'push', '-q'])
        print('Pushed. The test link updates in a couple of minutes.')


main()
