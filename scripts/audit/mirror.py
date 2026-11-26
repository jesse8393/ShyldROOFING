#!/usr/bin/env python3
"""Mirror live pages and assets to a local folder for Lighthouse. Only change: the Google tag loader URL is pointed at a local empty stub."""
import json, os, subprocess, sys
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor
S = sys.argv[1]; OUT = os.path.join(S, 'mirror'); os.makedirs(OUT, exist_ok=True)
d = json.load(open(os.path.join(S, 'audit', 'crawl.json')))
pages = d['seeds'] + ['https://shyldroofing.com/404']
files = ['https://shyldroofing.com/robots.txt', 'https://shyldroofing.com/sitemap.xml', 'https://shyldroofing.com/favicon.ico', 'https://shyldroofing.com/site.webmanifest'] + list(d['assets'])
def dest(u, page=False):
    p = urlparse(u).path.lstrip('/')
    if page: p = (p or 'index') + '.html'
    return os.path.join(OUT, p)
def get(u, page=False):
    t = dest(u, page); os.makedirs(os.path.dirname(t), exist_ok=True)
    r = subprocess.run(['curl', '-sS', '-m', '60', '-A', 'Mozilla/5.0 (compatible; SHYLD-seo-audit/1.0)', '--compressed', '-o', t, '-w', '%{http_code}', u], capture_output=True, text=True)
    if page and r.stdout == '200':
        h = open(t, encoding='utf-8', errors='replace').read()
        h2 = h.replace('https://www.googletagmanager.com/gtag/js?id=', '/gtag-stub.js?id=')
        open(t, 'w', encoding='utf-8').write(h2)
    return (u, r.stdout)
with ThreadPoolExecutor(8) as ex:
    res = list(ex.map(lambda u: get(u, True), pages)) + list(ex.map(get, files))
open(os.path.join(OUT, 'gtag-stub.js'), 'w').write('/* local stub for the Google tag loader, used only for offline Lighthouse runs */\n')
bad = [r for r in res if r[1] != '200']
print('mirrored', len(res), 'bad', bad)
