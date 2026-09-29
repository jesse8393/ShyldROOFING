// Full page screenshots at the widths named in the brief.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const base = process.env.BASE || 'http://localhost:4321';
const routes = (process.env.ROUTES || '/').split(',');
const widths = (process.env.WIDTHS || '360,390,430,768,1024,1440').split(',').map(Number);
const out = process.env.OUT || 'qa/screenshots';
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
for (const route of routes) {
  for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 800 : 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(base + route, { waitUntil: 'networkidle' });
    // Scroll through the page so lazy images load, then return to top.
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = 'auto';
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
      document.querySelectorAll('.rise').forEach((el) => el.classList.add('is-in'));
    });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const name = (route === '/' ? 'home' : route.replace(/^\//, '').replace(/[^a-z0-9-]/gi, '_')) + `-${w}.png`;
    await page.screenshot({ path: `${out}/${name}`, fullPage: process.env.FULL !== '0' });
    console.log('saved', name);
    await ctx.close();
  }
}
await browser.close();
