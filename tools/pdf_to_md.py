"""Convert a story PDF (exported from the saga docs) to Markdown: headings by font size, tables as Markdown tables.
Usage: python tools/pdf_to_md.py <in.pdf> <out.md>"""
import re, sys, collections
import pymupdf


def clean(t):
    return re.sub(r'\s+', ' ', t.replace('​', '')).strip()


def table_md(tb):
    rows = [[clean(c or '') for c in r] for r in tb.extract()]
    rows = [r for r in rows if any(r)]
    if not rows:
        return ''
    n = max(len(r) for r in rows)
    rows = [r + [''] * (n - len(r)) for r in rows]
    esc = lambda c: c.replace('|', r'\|')
    out = ['| ' + ' | '.join(esc(c) for c in rows[0]) + ' |', '| ' + ' | '.join('---' for _ in rows[0]) + ' |']
    out += ['| ' + ' | '.join(esc(c) for c in r) + ' |' for r in rows[1:]]
    return '\n'.join(out)


def convert(src, dst):
    doc = pymupdf.open(src)
    sizes = collections.Counter()
    for page in doc:
        for b in page.get_text('dict')['blocks']:
            for l in b.get('lines', []):
                for s in l['spans']:
                    if s['text'].strip():
                        sizes[round(s['size'], 1)] += len(s['text'])
    body = sizes.most_common(1)[0][0]
    big = sorted({s for s in sizes if s > body + 0.4}, reverse=True)
    level = {s: min(i + 1, 4) for i, s in enumerate(big)}   # largest = '#', next '##', ...
    out, title = [], None
    for pno, page in enumerate(doc):
        tabs = list(page.find_tables())
        tboxes = [pymupdf.Rect(t.bbox) for t in tabs]
        items = [(pymupdf.Rect(t.bbox).y0, 'table', table_md(t)) for t in tabs]
        for b in page.get_text('dict')['blocks']:
            if 'lines' not in b:
                continue
            r = pymupdf.Rect(b['bbox'])
            if any(r.intersects(tb) and (r & tb).get_area() > 0.5 * r.get_area() for tb in tboxes):
                continue
            lines = []
            for l in b['lines']:
                t = clean(''.join(s['text'] for s in l['spans']))
                if not t:
                    continue
                s0 = max(l['spans'], key=lambda s: len(s['text'].strip()))
                lines.append((t, round(s0['size'], 1), bool(s0['flags'] & 16) or 'Bold' in s0['font']))
            if not lines:
                continue
            text = ' '.join(t for t, _, _ in lines)
            if re.fullmatch(r'.*Page \d+ of \d+', text) or (title and text == title):
                continue
            sz = lines[0][1]
            if pno == 0 and title is None and sz == max(sizes):
                title = text
                items.append((r.y0, 'h', '# ' + text))
                continue
            if sz in level:
                items.append((r.y0, 'h', '#' * level[sz] + ' ' + text))
            elif all(bd for _, _, bd in lines) and len(text) < 90:
                items.append((r.y0, 'h', '#### ' + text))
            elif re.match(r'^[•●▪–-]\s', text):
                items.append((r.y0, 'p', '- ' + text[2:].strip()))
            else:
                items.append((r.y0, 'p', text))
        for _, k, t in sorted(items, key=lambda x: x[0]):
            if t:
                out.append(t)
    md = re.sub(r'\n{3,}', '\n\n', '\n\n'.join(out))
    open(dst, 'w', encoding='utf-8').write(md + '\n')
    print(dst, len(md), 'chars,', len(doc), 'pages')


if __name__ == '__main__':
    convert(sys.argv[1], sys.argv[2])
