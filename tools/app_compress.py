"""Shrink the store app build (run after `node tools/build.js --app`; `npm run android` does both).

Works on the built www/ folder only; source art and audio are never touched.
- Map backgrounds (assets/sections_game/*.png) become WebP at quality 92: they look the same zoomed 3x, about a quarter the size.
- Voice lines above 64 kbps are re-encoded to 48 kbps mono (most lines already are).
- Music above 128 kbps is re-encoded to 96 kbps stereo.
Results are cached in .appcache/ (keyed by the source file's hash), so only new or changed files are converted again.
Needs ffmpeg on PATH and Pillow.
"""
import hashlib, io, json, os, re, shutil, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WWW, CACHE = os.path.join(ROOT, 'www'), os.path.join(ROOT, '.appcache')
MAP_Q, VOICE_MAX, VOICE_BR, MUSIC_MAX, MUSIC_BR = 92, 64000, '48k', 128000, '96k'


def sha(p):
    return hashlib.sha1(open(p, 'rb').read()).hexdigest()


def bitrate(p):
    r = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=bit_rate', '-of', 'csv=p=0', p],
                       capture_output=True, text=True).stdout.strip()
    return int(r) if r.isdigit() else 0


def cached(src, tag, ext, make):
    """Return the cache file for src converted by `make(src, out)`, building it if needed."""
    out = os.path.join(CACHE, sha(src) + '.' + tag + ext)
    if not os.path.exists(out):
        tmp = out + '.tmp' + ext
        make(src, tmp)
        os.replace(tmp, out)
    return out


def to_webp(src, out):
    Image.open(src).save(out, 'WEBP', quality=MAP_Q, method=6)


def mp3(br, mono):
    def run(src, out):
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-map_metadata', '-1'] + (['-ac', '1'] if mono else []) + ['-b:a', br, out], check=True)
    return run


def main():
    if not shutil.which('ffmpeg'):
        sys.exit('ffmpeg is not on PATH')
    os.makedirs(CACHE, exist_ok=True)
    A = os.path.join(WWW, 'assets')
    jobs, renames = [], {}
    for dirpath, _, files in os.walk(A):
        top = os.path.relpath(dirpath, A).split(os.sep)[0]
        for f in files:
            p = os.path.join(dirpath, f)
            if top == 'sections_game' and f.endswith('.png'):
                jobs.append(('map', p))
            elif top == 'voice' and f.endswith('.mp3'):
                jobs.append(('voice', p))
            elif (top == 'music' or dirpath == A) and f.endswith('.mp3'):
                jobs.append(('music', p))
    before = sum(os.path.getsize(p) for _, p in jobs)

    def work(job):
        kind, p = job
        if kind == 'map':
            c = cached(p, 'q%d' % MAP_Q, '.webp', to_webp)
            new = p[:-4] + '.webp'
            shutil.copyfile(c, new)
            os.remove(p)
            return p, new
        limit, br, mono = (VOICE_MAX, VOICE_BR, True) if kind == 'voice' else (MUSIC_MAX, MUSIC_BR, False)
        if bitrate(p) > limit:
            shutil.copyfile(cached(p, br + ('m' if mono else 's'), '.mp3', mp3(br, mono)), p)
        return None

    with ThreadPoolExecutor(max_workers=os.cpu_count() or 4) as ex:
        for r in ex.map(work, jobs):
            if r:
                renames[r[0]] = r[1]

    # point the game at the new .webp map files (paths in index.html are relative to www/)
    idx = os.path.join(WWW, 'index.html')
    html = open(idx, encoding='utf-8').read()
    rel = {os.path.relpath(a, WWW).replace(os.sep, '/'): os.path.relpath(b, WWW).replace(os.sep, '/') for a, b in renames.items()}
    missing = [a for a in rel if a not in html]
    if missing:
        sys.exit('index.html does not mention %d converted maps, e.g. %s' % (len(missing), missing[0]))
    html = re.sub('|'.join(map(re.escape, sorted(rel, key=len, reverse=True))), lambda m: rel[m.group(0)], html)
    open(idx, 'w', encoding='utf-8', newline='').write(html)

    after = sum(os.path.getsize(p if p not in renames else renames[p]) for _, p in jobs)
    total = sum(os.path.getsize(os.path.join(d, f)) for d, _, fs in os.walk(WWW) for f in fs)
    mb = lambda b: '%.1f MB' % (b / 1048576)
    print('app_compress: %d maps to WebP, media %s -> %s; www is now %s' % (len(renames), mb(before), mb(after), mb(total)))


if __name__ == '__main__':
    main()
