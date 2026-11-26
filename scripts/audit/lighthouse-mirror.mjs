import fs from 'node:fs';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
const S = process.argv[2];
const urls = fs.readFileSync(S + '/sitemap-urls.txt', 'utf8').split('\n').filter(Boolean).concat(['https://shyldroofing.com/404']);
const outDir = S + '/lh/reports'; fs.mkdirSync(outDir, { recursive: true });
const chrome = await chromeLauncher.launch({ chromePath: '/opt/pw-browsers/chromium', chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--no-proxy-server', '--host-resolver-rules=MAP shyldroofing.com 127.0.0.1', '--disable-features=HttpsUpgrades,HttpsFirstBalancedMode,HttpsFirstModeV2'] });
const summary = [];
for (const u of urls) {
  const test = u.replace('https://', 'http://');
  const slug = new URL(u).pathname.replace(/^\//, '') || 'index';
  try {
    const r = await lighthouse(test, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], skipAudits: ['is-on-https', 'redirects-http'] });
    fs.writeFileSync(`${outDir}/${slug}.json`, r.report);
    const lhr = r.lhr;
    const scores = Object.fromEntries(Object.entries(lhr.categories).map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)]));
    const fails = {};
    for (const [cat, c] of Object.entries(lhr.categories)) {
      fails[cat] = c.auditRefs.filter(a => { const au = lhr.audits[a.id]; return au && au.score !== null && au.score < 1 && !['manual', 'informative', 'notApplicable'].includes(au.scoreDisplayMode); })
        .map(a => ({ id: a.id, weight: a.weight, score: lhr.audits[a.id].score, display: lhr.audits[a.id].displayValue || '' }));
    }
    const m = lhr.audits;
    const metrics = { lcp: m['largest-contentful-paint']?.displayValue, fcp: m['first-contentful-paint']?.displayValue, cls: m['cumulative-layout-shift']?.displayValue, tbt: m['total-blocking-time']?.displayValue, si: m['speed-index']?.displayValue };
    summary.push({ url: u, scores, fails, metrics, runtimeError: lhr.runtimeError?.code });
    console.log(slug, JSON.stringify(scores), JSON.stringify(metrics), lhr.runtimeError?.code || '');
  } catch (e) { summary.push({ url: u, error: String(e).slice(0, 300) }); console.log(slug, 'ERROR', String(e).slice(0, 300)); }
  fs.writeFileSync(S + '/lh/summary.json', JSON.stringify(summary, null, 1));
}
await chrome.kill();
console.log('DONE', summary.length);
