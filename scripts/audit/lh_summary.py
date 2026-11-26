#!/usr/bin/env python3
import json, sys, collections, statistics
s = json.load(open(sys.argv[1]))
rows = []; agg = collections.defaultdict(list); fails = collections.Counter(); diag = collections.Counter(); failpages = collections.defaultdict(set)
for p in s:
    if 'error' in p: rows.append((p['url'], 'ERROR', p['error'][:80], '', '', '', '')); continue
    sc = p['scores']; m = p['metrics']
    rows.append((p['url'].replace('https://shyldroofing.com', '') or '/', sc['performance'], sc['accessibility'], sc['best-practices'], sc['seo'], f"{m['fcp']} / {m['lcp']} / {m['cls']} / {m['tbt']}".replace('\xa0', ' ')))
    for k, v in sc.items(): agg[k].append(v)
    for cat, lst in p['fails'].items():
        for f in lst:
            if f['weight'] > 0: fails[(cat, f['id'])] += 1; failpages[(cat, f['id'])].add(p['url'])
            else: diag[(cat, f['id'])] += 1
print(f'pages audited: {len(s)}')
print('| category | min | median | max | pages at 100 |'); print('|---|---|---|---|---|')
for k, v in agg.items(): print(f'| {k} | {min(v)} | {int(statistics.median(v))} | {max(v)} | {sum(1 for x in v if x == 100)} of {len(v)} |')
print('\nweighted audits below 100 (count of pages):'); [print(f'- {c}/{a}: {n} pages') for (c, a), n in fails.most_common()] or print('- none')
print('\nzero weight diagnostics flagged (count of pages):'); [print(f'- {c}/{a}: {n}') for (c, a), n in diag.most_common()]
print('\n| page | perf | a11y | best practices | seo | FCP / LCP / CLS / TBT |'); print('|---|---|---|---|---|---|')
for r in rows: print('| ' + ' | '.join(str(x) for x in r) + ' |')
