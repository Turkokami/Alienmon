"""Adds the side-quest hooks (window.__SQ) to the Dustara (pv) and Ferrox (yv) story code in sporeholm3d/game.js.
Idempotent: each patch is skipped when it is already in place. Each original string must appear exactly once
inside its story function, or the script stops without writing. The quests themselves live in sporeholm3d/sidequests.js."""
import re, sys, pathlib
p = pathlib.Path(__file__).resolve().parents[2] / "sporeholm3d" / "game.js"
s = p.read_text()

def span(fn):
    hits = [m.start() for m in re.finditer(r"function " + fn + r"\(", s)]
    if len(hits) != 1: sys.exit(f"{fn}: expected 1 definition, found {len(hits)}")
    a = hits[0]; b = s.index("window.STORY={", a) + 120
    return a, b

P = [
 ("pv", 'let te=r.step,y=G.id;return y==="mom"',
        'let te=r.step,y=G.id;if(window.__SQ&&window.__SQ.talk(y,G,te))return!0;return y==="mom"'),
 ("pv", 'return"E  "+(y.startsWith("bolt")',
        'let __h=window.__SQ&&window.__SQ.hint(y,G,te);if(__h)return __h;return"E  "+(y.startsWith("bolt")'),
 ("pv", '||U.trainer&&!r.beat[F]&&o.party.length>0;U.bub.visible=',
        '||U.trainer&&!r.beat[F]&&o.party.length>0||window.__SQ&&window.__SQ.bang(F);U.bub.visible='),
 ("pv", 'window.STORY={ST:r,', 'window.STORY={SQ:{world:"dustara",P,T,ae,save:l},ST:r,'),
 ("yv", 'let Q=r.step,_e=q.id;if(_e.startsWith("cogH")',
        'let Q=r.step,_e=q.id;if(window.__SQ&&window.__SQ.talk(_e,q,Q))return!0;if(_e.startsWith("cogH")'),
 ("yv", 'return"E  "+(q.trainer&&!r.beat[_e]',
        'let __h=window.__SQ&&window.__SQ.hint(_e,q,Q);if(__h)return __h;return"E  "+(q.trainer&&!r.beat[_e]'),
 ("yv", 'window.STORY={ST:r,', 'window.STORY={SQ:{world:"ferrox",P,T,ae,save:l},ST:r,'),
]
for fn, old, new in P:
    a, b = span(fn)
    seg = s[a:b]
    if new in seg: print("already", fn, old[:40]); continue
    n = seg.count(old)
    if n != 1: sys.exit(f"{fn}: '{old[:50]}' found {n} times")
    s = s[:a] + seg.replace(old, new) + s[b:]
    print("patched", fn, old[:40])
p.write_text(s)

# Battle core: a "solo" trainer battle is a lone Alienmon that challenges the player (S03 Pink Gills).
# tr.solo = label shown before the species name ("Pink" -> "Pink Blinkit"); no "sent out" line;
# its own lines for the pod and run buttons.
s = p.read_text()
B = [
 ('N.tr?N.tr.name+"\'s ":"Wild "', 'N.tr?(N.tr.solo?N.tr.solo+" ":N.tr.name+"\'s "):"Wild "'),
 ('.concat([U.name+" sent out "+w+"!"])', '.concat(U.solo?[]:[U.name+" sent out "+w+"!"])'),
 ('"You can\'t run from a Linker battle!"', '(N.tr.noRun||"You can\'t run from a Linker battle!")'),
 ('"You can\'t link with another Linker\'s partner. A link is asked for, never taken."',
  '(N.tr.noLink||"You can\'t link with another Linker\'s partner. A link is asked for, never taken.")'),
]
for old, new in B:
    if new in s: print("already", old[:40]); continue
    n = s.count(old)
    if n != 1: sys.exit(f"battle: '{old[:50]}' found {n} times")
    s = s.replace(old, new); print("patched battle", old[:40])
p.write_text(s)
