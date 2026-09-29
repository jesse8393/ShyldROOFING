// Crawls every internal link from the homepage, checks status codes, titles,
// canonicals, descriptions, single h1, and that every referenced local asset exists.
const base = process.env.BASE || 'http://localhost:4321';
const seen = new Map();
const queue = ['/'];
const problems = [];
const assets = new Set();

function abs(href, from) {
  try {
    const u = new URL(href, base + from);
    if (u.origin !== new URL(base).origin) return null;
    return u.pathname + u.search;
  } catch {
    return null;
  }
}

while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  const res = await fetch(base + path, { redirect: 'manual' });
  seen.set(path, res.status);
  if (res.status >= 300 && res.status < 400) {
    problems.push(`${path} redirects to ${res.headers.get('location')}`);
    continue;
  }
  if (res.status !== 200) {
    problems.push(`${path} returned ${res.status}`);
    continue;
  }
  const type = res.headers.get('content-type') || '';
  if (!type.includes('text/html')) continue;
  const html = await res.text();
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (!title) problems.push(`${path} missing title`);
  if (title && title.length > 70) problems.push(`${path} title ${title.length} chars`);
  if (!desc) problems.push(`${path} missing description`);
  if (desc && (desc.length > 165 || desc.length < 70)) problems.push(`${path} description ${desc.length} chars`);
  if (!canonical) problems.push(`${path} missing canonical`);
  const expected = 'https://shyldroofing.com' + (path === '/' ? '/' : path.replace(/\?.*$/, ''));
  if (canonical && canonical !== expected && !path.startsWith('/404')) problems.push(`${path} canonical ${canonical}`);
  if (h1s !== 1) problems.push(`${path} has ${h1s} h1`);
  if (/—|–/.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) problems.push(`${path} contains a dash character in visible markup`);
  if (/<!--\s*(paste|todo|fixme)/i.test(html)) problems.push(`${path} exposes implementation comment`);
  for (const m of html.matchAll(/(?:href|src|srcset)="([^"]*)"/g)) {
    const raw = m[1];
    const candidates = raw.includes(',') && !raw.startsWith('data:') ? raw.split(',').map((s) => s.trim().split(' ')[0]) : [raw];
    for (const c of candidates) {
      if (!c || c.startsWith('data:') || c.startsWith('mailto:') || c.startsWith('tel:') || c.startsWith('sms:') || c.startsWith('#')) continue;
      const p = abs(c, path);
      if (!p) continue;
      const clean = p.replace(/#.*$/, '');
      if (/\.(css|js|avif|webp|jpe?g|png|svg|ico|woff2|webmanifest|xml|txt)(\?.*)?$/.test(clean)) assets.add(clean);
      else if (!seen.has(clean) && !queue.includes(clean)) queue.push(clean);
    }
  }
}

for (const a of assets) {
  const res = await fetch(base + a, { method: 'HEAD' });
  if (res.status !== 200) problems.push(`asset ${a} returned ${res.status}`);
}

for (const extra of ['/sitemap.xml', '/robots.txt', '/does-not-exist-xyz', '/roof-repair.html', '/roof-repair/', '/index.html']) {
  const res = await fetch(base + extra, { redirect: 'manual' });
  console.log(`${extra} -> ${res.status}${res.headers.get('location') ? ' ' + res.headers.get('location') : ''}`);
}

console.log(`\nCrawled ${seen.size} pages, checked ${assets.size} assets.`);
if (problems.length) {
  console.log('Problems:');
  problems.forEach((p) => console.log(' -', p));
  process.exitCode = 1;
} else console.log('No problems found.');
