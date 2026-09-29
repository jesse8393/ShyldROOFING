// Runs Lighthouse (mobile and desktop) against the local preview build.
// Usage: node scripts/lighthouse.mjs [runs] [routes]
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { mkdirSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const base = process.env.BASE || 'http://localhost:4321';
const runs = Number(process.argv[2] || 1);
const routes = (process.argv[3] || '/').split(',');
const out = 'qa/lighthouse';
mkdirSync(out, { recursive: true });

const chrome = await launch({
  chromePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
});

const version = JSON.parse(execSync('npm ls lighthouse --json', { encoding: 'utf8' })).dependencies.lighthouse.version;
const results = [];
const median = (arr) => {
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

for (const route of routes) {
  for (const preset of ['mobile', 'desktop']) {
    const scores = { performance: [], accessibility: [], 'best-practices': [], seo: [] };
    const metrics = { lcp: [], cls: [], tbt: [], fcp: [], si: [], transfer: [] };
    for (let i = 0; i < runs; i++) {
      const flags = { port: chrome.port, output: 'json', logLevel: 'error' };
      const config = preset === 'desktop' ? { extends: 'lighthouse:default', settings: { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } } } : undefined;
      const r = await lighthouse(base + route, flags, config);
      const lhr = r.lhr;
      for (const k of Object.keys(scores)) scores[k].push(Math.round(lhr.categories[k].score * 100));
      metrics.lcp.push(lhr.audits['largest-contentful-paint'].numericValue);
      metrics.cls.push(lhr.audits['cumulative-layout-shift'].numericValue);
      metrics.tbt.push(lhr.audits['total-blocking-time'].numericValue);
      metrics.fcp.push(lhr.audits['first-contentful-paint'].numericValue);
      metrics.si.push(lhr.audits['speed-index'].numericValue);
      metrics.transfer.push(lhr.audits['total-byte-weight'].numericValue);
      const name = `${route === '/' ? 'home' : route.slice(1).replace(/[^a-z0-9-]/gi, '_')}-${preset}-run${i + 1}.json`;
      writeFileSync(`${out}/${name}`, r.report);
      const failing = Object.values(lhr.audits).filter((a) => a.score !== null && a.score < 1 && !['performance-budget', 'timing-budget'].includes(a.id) && a.scoreDisplayMode !== 'informative').map((a) => `${a.id} (${Math.round((a.score || 0) * 100)})`);
      console.log(`${route} ${preset} run ${i + 1}: perf ${scores.performance.at(-1)} a11y ${scores.accessibility.at(-1)} bp ${scores['best-practices'].at(-1)} seo ${scores.seo.at(-1)} | LCP ${Math.round(metrics.lcp.at(-1))}ms CLS ${metrics.cls.at(-1).toFixed(3)} TBT ${Math.round(metrics.tbt.at(-1))}ms bytes ${Math.round(metrics.transfer.at(-1) / 1024)}KB${failing.length ? ' | failing: ' + failing.join(', ') : ''}`);
    }
    results.push({
      route,
      preset,
      runs,
      lighthouse: version,
      median: Object.fromEntries(Object.entries(scores).map(([k, v]) => [k, median(v)])),
      medianMetrics: { lcp_ms: Math.round(median(metrics.lcp)), cls: Number(median(metrics.cls).toFixed(3)), tbt_ms: Math.round(median(metrics.tbt)), fcp_ms: Math.round(median(metrics.fcp)), speed_index_ms: Math.round(median(metrics.si)), transfer_kb: Math.round(median(metrics.transfer) / 1024) },
    });
  }
}
await chrome.kill();
writeFileSync(`${out}/summary.json`, JSON.stringify({ date: new Date().toISOString(), base, results }, null, 2));
console.log('\nMedians:');
for (const r of results) console.log(`${r.route} ${r.preset}: perf ${r.median.performance} a11y ${r.median.accessibility} bp ${r.median['best-practices']} seo ${r.median.seo} | LCP ${r.medianMetrics.lcp_ms}ms CLS ${r.medianMetrics.cls} TBT ${r.medianMetrics.tbt_ms}ms ${r.medianMetrics.transfer_kb}KB`);
