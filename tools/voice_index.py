# Story voice index: docs/voice_pack/all_lines.csv (the script the owner recorded in ElevenLabs) -> data/voice_lines.json,
# mapping each line's words to its clip in audio/voice. The game matches the line it shows (speaker name stripped, words only),
# so small punctuation or formatting differences don't matter. Lines with a {placeholder} become patterns.
import csv, json, os, re
APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
norm = lambda s: re.sub(r'[^a-z0-9{}]+', ' ', s.lower()).strip()
out = {'exact': {}, 'pattern': []}
for r in csv.DictReader(open(APP + '/docs/voice_pack/all_lines.csv', encoding='utf-8')):
    if not os.path.exists(f"{APP}/audio/voice/{r['file']}"): continue
    t = re.sub(r'^\[[^\]]*\]\s*', '', r['text'])   # delivery tags like [softly] are not on screen
    k = norm(t); f = r['file'][:-4]
    if '{' in k:
        out['pattern'].append(['^' + re.sub(r'\\{[a-z0-9]+\\}', '(?:.+?)', re.escape(k)) + '$', f])
    else:
        out['exact'].setdefault(k, f)
json.dump(out, open(APP + '/data/voice_lines.json', 'w', encoding='utf-8'), indent=0)
print(len(out['exact']), 'lines,', len(out['pattern']), 'patterns')
