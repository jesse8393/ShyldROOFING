#!/usr/bin/env python3
"""Measure shared template text across the 44 city pages of a mirrored site.

Usage: python3 -I scripts/audit/city_overlap.py <mirror-dir> [core-slugs-file]

Method (stated so the numbers can be reproduced):
  * text of <main> only, with <script>, <style>, <noscript> and <form> removed
  * HTML entities decoded, whitespace collapsed
  * sentences split at . ! or ? followed by whitespace; only sentences of six
    or more words are counted
  * a sentence is "shared" when the identical string occurs on every city page
  * a sentence is "templated" when it is identical on every page once each
    page's own town name (from the Service areaServed name) is replaced by a
    placeholder; shared sentences are a subset of templated ones
  * uniqueness per page = words outside templated sentences / all counted words
  * as a stricter second measure, the share of each page's eight word shingles
    (every run of eight consecutive words, town name swapped for a placeholder)
    that also occurs on at least one other city page; this catches reworded
    template text that exact sentence matching misses
Prints a markdown summary to stdout.
"""
import glob, html, os, re, sys

mirror = sys.argv[1]
CORE = {'murfreesboro','smyrna','la-vergne','eagleville','christiana','rockvale','franklin',
        'brentwood','nolensville','spring-hill','lebanon','mt-juliet','nashville','shelbyville'}

def main_text(path):
    h = open(path, encoding='utf-8', errors='replace').read()
    m = re.search(r'<main[^>]*>(.*?)</main>', h, re.S)
    body = m.group(1) if m else h
    body = re.sub(r'<(script|style|noscript|form)[^>]*>.*?</\1>', ' ', body, flags=re.S | re.I)
    body = re.sub(r'<br\s*/?>|</(p|li|h[1-6]|div|section|dd|dt|td|th|summary|blockquote)>', '. ', body, flags=re.I)
    body = re.sub(r'<[^>]+>', ' ', body)
    body = html.unescape(body)
    return re.sub(r'\s+', ' ', body).strip()

def sentences(text):
    out = []
    for s in re.split(r'(?<=[.!?])\s+', text):
        s = s.strip().strip('.').strip()
        if len(s.split()) >= 6:
            out.append(s)
    return out

def town_name(path):
    h = open(path, encoding='utf-8', errors='replace').read()
    m = re.search(r'"areaServed":\{"@type":"(?:City|Place)","name":"([^"]+)"', h)
    return html.unescape(m.group(1)) if m else None

pages, towns = {}, {}
for f in sorted(glob.glob(os.path.join(mirror, 'roofing-*.html'))):
    slug = os.path.basename(f)[len('roofing-'):-len('.html')]
    pages[slug] = sentences(main_text(f))
    towns[slug] = town_name(f)

def templ(slug, s):
    t = towns.get(slug)
    if not t:
        return s
    base = t.split(',')[0]
    return re.sub(re.escape(base) + r"(['\u2019]s)?", 'TOWN', s)

shared = set.intersection(*(set(v) for v in pages.values()))
shared_words = sum(len(s.split()) for s in shared)
templated = set.intersection(*(set(templ(k, s) for s in v) for k, v in pages.items()))
templated_words = sum(len(s.split()) for s in templated)

def shingles(slug, sents, n=8):
    out = set()
    for s in sents:
        w = templ(slug, s).lower().split()
        for i in range(len(w) - n + 1):
            out.add(' '.join(w[i:i + n]))
    return out

sh = {slug: shingles(slug, sents) for slug, sents in pages.items()}
rows = []
for slug, sents in pages.items():
    words = sum(len(s.split()) for s in sents)
    uniq_words = sum(len(s.split()) for s in sents if templ(slug, s) not in templated)
    others = set().union(*(v for k, v in sh.items() if k != slug))
    reused = sum(1 for g in sh[slug] if g in others)
    rows.append((slug, 'core' if slug in CORE else 'outer', len(sents), words, round(100 * uniq_words / words),
                 round(100 * (1 - reused / len(sh[slug])))))

def rng(vals): return f"{min(vals)} to {max(vals)}"
print(f"# City page overlap ({len(pages)} pages)\n")
print(f"Sentences (six or more words) identical on all {len(pages)} pages: {len(shared)} ({shared_words} words).")
print(f"Sentences identical once the town name is swapped for a placeholder: {len(templated)} ({templated_words} words). "
      f"Uniqueness below counts words outside these templated sentences.\n")
for grp in ('core', 'outer'):
    g = [r for r in rows if r[1] == grp]
    print(f"* {grp} pages ({len(g)}): {rng([r[2] for r in g])} counted sentences, {rng([r[3] for r in g])} counted words, "
          f"{rng([r[4] for r in g])} percent unique by templated sentences (mean {round(sum(r[4] for r in g)/len(g))}), "
          f"{rng([r[5] for r in g])} percent of eight word shingles not found on any other city page (mean {round(sum(r[5] for r in g)/len(g))}).")
print("\n## Templated sentences (TOWN stands for the page's town)\n")
for s in sorted(templated, key=len, reverse=True):
    print(f"* {s}")
print("\n## Per page\n\n| page | group | sentences | words | percent unique (sentences) | percent unique (shingles) |\n| --- | --- | --- | --- | --- | --- |")
for r in sorted(rows, key=lambda r: (r[1], r[0])):
    print(f"| roofing-{r[0]} | {r[1]} | {r[2]} | {r[3]} | {r[4]} | {r[5]} |")
