"""Move voices and music from the synced app assets into the install-time asset pack (android/media).
Run after `npx cap sync android`, which copies www/ into android/app/src/main/assets/public. `npm run android` does it all."""
import os, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.path.join(ROOT, 'android', 'app', 'src', 'main', 'assets', 'public', 'assets')
PACK = os.path.join(ROOT, 'android', 'media', 'src', 'main', 'assets', 'public', 'assets')
MOVE = ['voice', 'music']

shutil.rmtree(os.path.dirname(os.path.dirname(PACK)), ignore_errors=True)
os.makedirs(PACK)
size = lambda d: sum(os.path.getsize(os.path.join(r, f)) for r, _, fs in os.walk(d) for f in fs)
for d in MOVE:
    shutil.move(os.path.join(BASE, d), os.path.join(PACK, d))
mb = lambda b: '%.1f MB' % (b / 1048576)
print('app_media_pack: base %s, media pack %s' % (mb(size(os.path.dirname(BASE))), mb(size(PACK))))
