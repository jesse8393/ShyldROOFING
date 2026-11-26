#!/usr/bin/env python3
"""Site crawler and on-page SEO audit using curl (stdlib only)."""
import subprocess, json, re, sys, os, html as htmlmod, hashlib
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse, urldefrag
from concurrent.futures import ThreadPoolExecutor

OUT = sys.argv[1]
SEEDS = [l.strip() for l in open(sys.argv[2]) if l.strip()]
HOST = 'shyldroofing.com'
RAW = os.path.join(OUT, 'raw'); os.makedirs(RAW, exist_ok=True)
UA = 'Mozilla/5.0 (compatible; SHYLD-seo-audit/1.0)'

def key(u): return hashlib.sha1(u.encode()).hexdigest()[:16]

def fetch(url, body=True):
    b = os.path.join(RAW, key(url) + '.body'); h = os.path.join(RAW, key(url) + '.hdr')
    cmd = ['curl', '-sS', '-m', '60', '-A', UA, '--compressed', '-o', b if body else '/dev/null', '-D', h,
           '-w', '%{http_code}\t%{time_total}\t%{size_download}\t%{redirect_url}\t%{content_type}', url]
    r = subprocess.run(cmd, capture_output=True, text=True)
    parts = (r.stdout.split('\t') + ['', '', '', '', ''])[:5]
    hdrs = {}
    try:
        for line in open(h, errors='replace'):
            if ':' in line and not line.startswith('HTTP/'):
                k, v = line.split(':', 1); hdrs[k.strip().lower()] = v.strip()
    except FileNotFoundError:
        pass
    return {'url': url, 'status': int(parts[0] or 0), 'time': float(parts[1] or 0), 'bytes': int(parts[2] or 0),
            'redirect': parts[3], 'content_type': parts[4], 'headers': hdrs, 'body_path': b if body else None,
            'err': r.stderr.strip()[:200]}

IGNORE = {'script', 'style', 'noscript', 'template', 'svg'}
class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = None; self.in_title = False; self.metas = []; self.links = []; self.h = {'h1': [], 'h2': [], 'h3': []}
        self.cur_h = None; self.imgs = []; self.a = []; self.ld = []; self.in_ld = False; self.ld_buf = ''
        self.text = []; self.stack = []; self.lang = None; self.iframes = []; self.scripts = []; self.forms = 0
        self.sources = []; self.buttons = 0; self.inputs = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs); self.stack.append(tag)
        if tag == 'html': self.lang = a.get('lang')
        elif tag == 'title': self.in_title = True; self.title = ''
        elif tag == 'meta': self.metas.append(a)
        elif tag == 'link': self.links.append(a)
        elif tag in self.h: self.cur_h = tag; self.h[tag].append('')
        elif tag == 'img': self.imgs.append(a)
        elif tag == 'source': self.sources.append(a)
        elif tag == 'a': self.a.append({'href': a.get('href'), 'rel': a.get('rel'), 'target': a.get('target'), 'text': ''})
        elif tag == 'script':
            self.scripts.append(a)
            if (a.get('type') or '').lower() == 'application/ld+json': self.in_ld = True; self.ld_buf = ''
        elif tag == 'iframe': self.iframes.append(a)
        elif tag == 'form': self.forms += 1
        elif tag == 'button': self.buttons += 1
        elif tag == 'input': self.inputs.append(a)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs); self.handle_endtag(tag)
    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
        if tag in self.h: self.cur_h = None
        if tag == 'script' and self.in_ld:
            self.in_ld = False; self.ld.append(self.ld_buf)
        if tag == 'a' and self.a: pass
        while self.stack and self.stack[-1] != tag: self.stack.pop()
        if self.stack: self.stack.pop()
    def handle_data(self, d):
        if self.in_title: self.title += d
        if self.in_ld: self.ld_buf += d; return
        if any(t in IGNORE for t in self.stack): return
        if self.cur_h: self.h[self.cur_h][-1] += d
        if self.a and 'a' in self.stack: self.a[-1]['text'] += d
        self.text.append(d)

def norm(u):
    u, _ = urldefrag(u)
    pr = urlparse(u)
    if pr.path == '': u = u + '/'
    return u

def internal(u):
    n = urlparse(u).netloc.lower(); return n in ('', HOST, 'www.' + HOST)

def parse_page(url, body_path):
    raw = open(body_path, 'rb').read().decode('utf-8', errors='replace')
    p = P(); p.feed(raw)
    meta = {}
    for m in p.metas:
        k = (m.get('name') or m.get('property') or m.get('http-equiv') or '').lower()
        if k: meta.setdefault(k, m.get('content'))
    canon = [l.get('href') for l in p.links if (l.get('rel') or '').lower() == 'canonical']
    hreflang = [(l.get('hreflang'), l.get('href')) for l in p.links if 'alternate' in (l.get('rel') or '').lower() and l.get('hreflang')]
    icons = [l.get('href') for l in p.links if 'icon' in (l.get('rel') or '').lower()]
    ld = []
    for s in p.ld:
        try: ld.append(json.loads(s))
        except Exception as e: ld.append({'_parse_error': str(e)[:120], '_raw': s[:200]})
    def types(o):
        out = []
        if isinstance(o, dict):
            t = o.get('@type')
            if t: out += t if isinstance(t, list) else [t]
            for v in o.values(): out += types(v)
        elif isinstance(o, list):
            for v in o: out += types(v)
        return out
    words = len(re.findall(r"[A-Za-z0-9'’]+", ' '.join(p.text)))
    links_int, links_ext = [], []
    for a in p.a:
        h = a.get('href')
        if not h: links_int.append({'href': None, 'text': a['text'].strip(), 'issue': 'missing href'}); continue
        hl = h.strip().lower()
        if hl.startswith(('mailto:', 'tel:', 'sms:', 'javascript:', '#')): continue
        full = norm(urljoin(url, h.strip()))
        rec = {'href': full, 'text': ' '.join(a['text'].split())[:80], 'rel': a.get('rel'), 'target': a.get('target')}
        (links_int if internal(full) else links_ext).append(rec)
    assets = set()
    for i in p.imgs:
        if i.get('src'): assets.add(urljoin(url, i['src']))
        for part in (i.get('srcset') or '').split(','):
            part = part.strip().split(' ')[0]
            if part: assets.add(urljoin(url, part))
    for s in p.sources:
        for part in (s.get('srcset') or '').split(','):
            part = part.strip().split(' ')[0]
            if part: assets.add(urljoin(url, part))
    for l in p.links:
        r = (l.get('rel') or '').lower()
        if l.get('href') and any(x in r for x in ('stylesheet', 'icon', 'preload', 'manifest', 'modulepreload')): assets.add(urljoin(url, l['href']))
    for s in p.scripts:
        if s.get('src'): assets.add(urljoin(url, s['src']))
    imgs = [{'src': i.get('src'), 'alt': i.get('alt'), 'loading': i.get('loading'), 'w': i.get('width'), 'h': i.get('height'), 'fetchpriority': i.get('fetchpriority')} for i in p.imgs]
    return {
        'title': (p.title or '').strip(), 'lang': p.lang, 'meta': {k: meta.get(k) for k in ['description', 'robots', 'googlebot', 'viewport', 'og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'og:site_name', 'og:locale', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'theme-color', 'geo.region', 'geo.placename', 'author', 'keywords']},
        'canonical': canon, 'hreflang': hreflang, 'icons': icons, 'h1': [' '.join(x.split()) for x in p.h['h1']], 'h2': [' '.join(x.split()) for x in p.h['h2']], 'h3_count': len(p.h['h3']),
        'ld_types': types(ld), 'ld': ld, 'ld_errors': [x['_parse_error'] for x in ld if isinstance(x, dict) and '_parse_error' in x],
        'words': words, 'imgs': imgs, 'img_missing_alt': sum(1 for i in p.imgs if 'alt' not in i),
        'links_int': links_int, 'links_ext': links_ext, 'assets': sorted(assets), 'iframes': [i.get('src') for i in p.iframes],
        'forms': p.forms, 'has_tel': ('tel:+16152958974' in raw) or ('tel:' in raw), 'has_ga': 'googletagmanager.com/gtag/js' in raw, 'ga_id': (re.findall(r"gtag/js\?id=([A-Z0-9-]+)", raw) or [None])[0],
        'has_gtm': 'googletagmanager.com/gtm.js' in raw, 'html_bytes': len(raw.encode()), 'text_sample': ' '.join(' '.join(p.text).split())[:300],
        'nap_phone': bool(re.search(r'\(615\)\s*295[\s-]*8974|615[\s.-]*295[\s.-]*8974', raw)),
        'inline_style_blocks': raw.count('<style'), 'ext_script_count': sum(1 for s in p.scripts if s.get('src')),
    }

pages = {}
queue = list(dict.fromkeys(SEEDS)); seen = set(queue)
with ThreadPoolExecutor(8) as ex:
    while queue:
        batch, queue = queue[:40], queue[40:]
        for res in ex.map(fetch, batch):
            u = res['url']; pages[u] = res
            if res['status'] == 200 and 'text/html' in res['content_type'] and internal(u):
                try: res['page'] = parse_page(u, res['body_path'])
                except Exception as e: res['page_error'] = str(e)[:200]; continue
                for l in res['page']['links_int']:
                    h = l['href']
                    if h and h not in seen and internal(h) and not re.search(r'\.(jpg|jpeg|png|svg|webp|avif|pdf|zip|xml|txt|css|js|ico)$', h, re.I):
                        seen.add(h); queue.append(h)
# follow redirects for internal pages that redirected, to know the destination status
for u, res in list(pages.items()):
    if res['status'] in (301, 302, 307, 308) and res['redirect'] and res['redirect'] not in pages:
        pages[res['redirect']] = fetch(res['redirect'])
        if pages[res['redirect']]['status'] == 200 and 'text/html' in pages[res['redirect']]['content_type']:
            pages[res['redirect']]['page'] = parse_page(res['redirect'], pages[res['redirect']]['body_path'])

assets = set()
for res in pages.values():
    for a in res.get('page', {}).get('assets', []):
        if internal(a): assets.add(a)
og = set()
for res in pages.values():
    pg = res.get('page')
    if pg:
        for k in ('og:image', 'twitter:image'):
            v = pg['meta'].get(k)
            if v: og.add(urljoin(res['url'], v))
assets |= og
with ThreadPoolExecutor(8) as ex:
    asset_res = {r['url']: {k: r[k] for k in ('status', 'bytes', 'content_type', 'time')} | {'cache_control': r['headers'].get('cache-control'), 'content_encoding': r['headers'].get('content-encoding')} for r in ex.map(lambda u: fetch(u, body=False), sorted(assets))}
ext = set()
for res in pages.values():
    for l in res.get('page', {}).get('links_ext', []): ext.add(l['href'])
with ThreadPoolExecutor(6) as ex:
    ext_res = {r['url']: {'status': r['status'], 'redirect': r['redirect'], 'err': r['err']} for r in ex.map(lambda u: fetch(u, body=False), sorted(ext))}

for res in pages.values(): res.pop('body_path', None)
json.dump({'pages': pages, 'assets': asset_res, 'external': ext_res, 'seeds': SEEDS}, open(os.path.join(OUT, 'crawl.json'), 'w'), indent=1, default=str)
print('pages', len(pages), 'assets', len(asset_res), 'external', len(ext_res))
