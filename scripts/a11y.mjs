// Automated accessibility and responsive checks: axe-core on each template,
// horizontal overflow at narrow widths, mobile menu keyboard behaviour, reduced motion.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const base = process.env.BASE || 'http://localhost:4321';
const routes = (process.env.ROUTES || '/,/roof-replacement,/roofing-franklin,/projects,/about,/contact,/text-us,/privacy,/service-areas,/roof-replacement-cost-middle-tennessee,/404').split(',');
const axeSource = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const browser = await chromium.launch();
let problems = 0;

for (const route of routes) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.addScriptTag({ content: axeSource });
  const results = await page.evaluate(async () => await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] }));
  const serious = results.violations.filter((v) => ['serious', 'critical', 'moderate', 'minor'].includes(v.impact));
  if (serious.length) {
    problems += serious.length;
    console.log(`axe ${route}:`);
    for (const v of serious) console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes) e.g. ${v.nodes[0].target.join(' ')}`);
  } else console.log(`axe ${route}: no violations`);
  await ctx.close();
}

// Horizontal overflow at phone widths
for (const w of [360, 390, 430]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 780 } });
  const page = await ctx.newPage();
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: 'networkidle' });
    const over = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
    if (over > 0) {
      problems++;
      console.log(`overflow ${w}px ${route}: ${over}px wider than viewport`);
    }
  }
  await ctx.close();
}
console.log('overflow check done for 360, 390, 430');

// 200 percent browser zoom equivalent: a 1440px window zoomed to 200% is a 720 CSS px viewport at 2x.
{
  const ctx = await browser.newContext({ viewport: { width: 720, height: 450 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: 'networkidle' });
    const over = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
    if (over > 0) {
      problems++;
      console.log(`200% zoom ${route}: ${over}px horizontal overflow`);
    }
  }
  console.log('200% zoom (720 CSS px at 2x) checked for every route');
  await ctx.close();
}

// Mobile menu keyboard behaviour
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 } });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.focus('[data-menu-btn]');
  await page.keyboard.press('Enter');
  const expanded = await page.getAttribute('[data-menu-btn]', 'aria-expanded');
  const focusedInMenu = await page.evaluate(() => !!document.activeElement?.closest('[data-menu]'));
  await page.keyboard.press('Escape');
  const closed = await page.getAttribute('[data-menu-btn]', 'aria-expanded');
  const focusBack = await page.evaluate(() => document.activeElement?.hasAttribute('data-menu-btn'));
  const okMenu = expanded === 'true' && focusedInMenu && closed === 'false' && focusBack;
  console.log(`mobile menu keyboard: ${okMenu ? 'opens, moves focus, closes on Escape, restores focus' : 'PROBLEM ' + JSON.stringify({ expanded, focusedInMenu, closed, focusBack })}`);
  if (!okMenu) problems++;
  await ctx.close();
}

// Reduced motion: layers illustration fully visible without animation
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelector('[data-layers]').scrollIntoView());
  await page.waitForTimeout(500);
  const opacities = await page.$$eval('[data-layers] .l', (els) => els.map((el) => getComputedStyle(el).opacity));
  const allVisible = opacities.every((o) => Number(o) === 1);
  const animating = await page.$$eval('[data-layers] .l', (els) => els.some((el) => getComputedStyle(el).animationName !== 'none'));
  console.log(`reduced motion: layers ${allVisible && !animating ? 'static and visible' : 'PROBLEM ' + opacities.join(',') + ' animating=' + animating}`);
  if (!allVisible || animating) problems++;
  const riseHidden = await page.$$eval('.rise', (els) => els.filter((el) => Number(getComputedStyle(el).opacity) < 1).length);
  console.log(`reduced motion: ${riseHidden} .rise elements hidden (expect 0)`);
  if (riseHidden) problems++;
  await ctx.close();
}

// No JS: content visible and layers static
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const hidden = await page.$$eval('.rise, [data-layers] .l', (els) => els.filter((el) => Number(getComputedStyle(el).opacity) < 1).length);
  const formVisible = await page.isVisible('#inspection form');
  console.log(`no JavaScript: ${hidden} hidden elements (expect 0), form visible ${formVisible}`);
  if (hidden || !formVisible) problems++;
  await ctx.close();
}

await browser.close();
console.log(problems ? `\n${problems} problem(s)` : '\nAll accessibility and responsive checks passed');
process.exitCode = problems ? 1 : 0;
