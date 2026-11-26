#!/usr/bin/env python3
import json, sys, re, collections
from urllib.parse import urlparse
d = json.load(open(sys.argv[1])); pages = d['pages']; assets = d['assets']; seeds = d['seeds']
HOST='shyldroofing.com'
def path(u): p = urlparse(u).path; return p or '/'
issues = collections.defaultdict(list)   # url -> [(sev, msg)]
site = []  # (sev,msg)
titles = collections.Counter(); descs = collections.Counter(); h1s = collections.Counter()
inbound = collections.Counter()
for u, r in pages.items():
    for l in r.get('page', {}).get('links_int', []):
        if l['href']: inbound[l['href']] += 1
rows = []
for u in seeds + [x for x in pages if x not in seeds]:
    r = pages[u]; pg = r.get('page')
    if r['status'] != 200:
        issues[u].append(('CRITICAL' if u in seeds else 'HIGH', f"status {r['status']} -> {r.get('redirect','')}")); rows.append((path(u), r['status'], '', '', '', '', '', '', '', '')); continue
    if not pg: issues[u].append(('HIGH', 'not parsed: ' + str(r.get('page_error')))); continue
    xr = r['headers'].get('x-robots-tag')
    if xr and 'noindex' in xr: issues[u].append(('CRITICAL', f'X-Robots-Tag {xr}'))
    rob = (pg['meta'].get('robots') or '')
    if 'noindex' in rob and u in seeds: issues[u].append(('CRITICAL', f'meta robots {rob}'))
    t = pg['title']; titles[t] += 1
    if not t: issues[u].append(('CRITICAL', 'missing title'))
    elif len(t) > 60: issues[u].append(('LOW', f'title {len(t)} chars (over 60, may truncate)'))
    elif len(t) < 30: issues[u].append(('LOW', f'title {len(t)} chars (short)'))
    ds = pg['meta'].get('description') or ''; descs[ds] += 1
    if not ds: issues[u].append(('HIGH', 'missing meta description'))
    elif len(ds) > 160: issues[u].append(('LOW', f'description {len(ds)} chars (over 160)'))
    elif len(ds) < 70: issues[u].append(('LOW', f'description {len(ds)} chars (short)'))
    c = pg['canonical']
    if len(c) != 1: issues[u].append(('HIGH', f'canonical count {len(c)}'))
    elif c[0].rstrip('/') != u.rstrip('/'): issues[u].append(('HIGH', f'canonical {c[0]} differs from URL'))
    if not pg['lang']: issues[u].append(('MEDIUM', 'html lang missing'))
    if not pg['meta'].get('viewport'): issues[u].append(('HIGH', 'viewport missing'))
    if len(pg['h1']) != 1: issues[u].append(('MEDIUM', f"h1 count {len(pg['h1'])}: {pg['h1'][:3]}"))
    else: h1s[pg['h1'][0]] += 1
    for k in ('og:title', 'og:description', 'og:image', 'og:url', 'og:type'):
        if not pg['meta'].get(k): issues[u].append(('LOW', f'{k} missing'))
    ou = pg['meta'].get('og:url')
    if ou and c and ou.rstrip('/') != c[0].rstrip('/'): issues[u].append(('LOW', f'og:url {ou} != canonical'))
    if not pg['meta'].get('twitter:card'): issues[u].append(('LOW', 'twitter:card missing'))
    oi = pg['meta'].get('og:image')
    if oi:
        if not oi.startswith('http'): issues[u].append(('MEDIUM', f'og:image not absolute: {oi}'))
        elif assets.get(oi, {}).get('status') not in (200, None): issues[u].append(('HIGH', f"og:image status {assets[oi]['status']}"))
    if pg['ld_errors']: issues[u].append(('HIGH', f"JSON-LD parse errors {pg['ld_errors']}"))
    if not pg['ld_types']: issues[u].append(('MEDIUM', 'no JSON-LD structured data'))
    if pg['img_missing_alt']: issues[u].append(('MEDIUM', f"{pg['img_missing_alt']} img without alt attribute"))
    if pg['words'] < 300 and u in seeds and path(u) not in ('/privacy','/terms','/text-us','/contact'): issues[u].append(('MEDIUM', f"thin content: {pg['words']} words"))
    if not pg['has_ga']: issues[u].append(('INFO', 'no GA tag'))
    if u in seeds and inbound[u] == 0 and u != 'https://shyldroofing.com/': issues[u].append(('MEDIUM', 'orphan: no internal inbound links'))
    for l in pg['links_int']:
        h = l['href']
        if h is None: issues[u].append(('LOW', f"link without href: '{l['text']}'")); continue
        tgt = pages.get(h)
        if tgt is None: continue
        if tgt['status'] in (301, 302, 307, 308): issues[u].append(('LOW', f"internal link redirects: {h} -> {tgt['redirect']} ('{l['text']}')"))
        elif tgt['status'] != 200: issues[u].append(('HIGH', f"broken internal link {h} ({tgt['status']}) text '{l['text']}'"))
    for l in pg['links_ext']:
        if l.get('target') == '_blank' and 'noopener' not in (l.get('rel') or ''): issues[u].append(('LOW', f"external _blank without rel noopener: {l['href']}"))
    for a in pg['assets']:
        ar = assets.get(a)
        if ar and ar['status'] != 200: issues[u].append(('HIGH', f"asset {ar['status']}: {a}"))
    rows.append((path(u), r['status'], len(t), len(ds), len(pg['h1']), pg['words'], len(pg['imgs']), pg['img_missing_alt'], ','.join(sorted(set(pg['ld_types'])))[:70], inbound[u]))
for t, n in titles.items():
    if n > 1: site.append(('HIGH', f'duplicate title x{n}: {t!r}'))
for t, n in descs.items():
    if n > 1 and t: site.append(('HIGH', f'duplicate description x{n}: {t[:80]!r}'))
for t, n in h1s.items():
    if n > 1: site.append(('MEDIUM', f'duplicate H1 x{n}: {t!r}'))
not_in_sitemap = [u for u, r in pages.items() if u not in seeds and r['status'] == 200 and r.get('page') and 'noindex' not in (r['page']['meta'].get('robots') or '')]
if not_in_sitemap: site.append(('MEDIUM', f'indexable pages linked but not in sitemap: {[path(x) for x in not_in_sitemap]}'))
bad_assets = {a: r for a, r in assets.items() if r['status'] != 200}
if bad_assets: site.append(('HIGH', f'assets not 200: {bad_assets}'))
cc = collections.Counter((urlparse(a).path.split('/')[1] if '/' in urlparse(a).path[1:] else 'root', r.get('cache_control')) for a, r in assets.items())
print('# On-page audit summary\n')
print(f"pages fetched: {len(pages)}; sitemap URLs: {len(seeds)}; assets: {len(assets)} (non-200: {len(bad_assets)}); external links: {len(d['external'])}\n")
print('| path | status | title len | desc len | h1 | words | imgs | no-alt | schema types | inbound |'); print('|---|---|---|---|---|---|---|---|---|---|')
for r in rows: print('| ' + ' | '.join(str(x) for x in r) + ' |')
print('\n## Site level'); [print(f'- {s}: {m}') for s, m in site] or print('- none')
print('\n## Per page issues')
sev_order = {'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3, 'INFO': 4}
cnt = collections.Counter()
for u, lst in issues.items():
    for s, m in sorted(lst, key=lambda x: sev_order[x[0]]): print(f'- {path(u)} [{s}] {m}'); cnt[s] += 1
print('\ncounts:', dict(cnt))
print('\n## Asset cache-control by folder'); [print(f'- {k}: {v}') for k, v in cc.most_common()]
print('\n## External link targets'); [print(f"- {u}: {r['status']} {r.get('redirect','')} {r.get('err','')}") for u, r in d['external'].items()]
print('\n## Titles'); [print(f"- {path(u)}: {pages[u]['page']['title']!r} | {pages[u]['page']['meta'].get('description')!r}") for u in seeds if pages[u].get('page')]
