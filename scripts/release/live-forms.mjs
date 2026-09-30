// Submit the real website forms on the live site (no interception). Labelled names, deleted afterwards.
// Cleanup: delete from public.leads where first_name = 'LAUNCH' and phone like '+1000000004%';
import { chromium } from 'playwright';
const stamp = new Date().toISOString().replace(/[:.]/g, '');
// Set CHROME_PATH to a Chromium binary when Playwright's own browser is not installed (npx playwright install chromium).
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const out = [];
async function run(path, { consent, ids }) {
  const page = await browser.newPage();
  const responses = [];
  page.on('response', async (r) => { if (r.url().includes('form-intake') && r.request().method() === 'POST') { try { responses.push(await r.json()); } catch {} } });
  await page.goto('https://shyldroofing.com' + path, { waitUntil: 'networkidle' });
  await page.fill('#' + ids.name, 'LAUNCH TEST ' + (consent ? 'text us form' : 'contact form'));
  await page.fill('#' + ids.phone, consent ? '+10000000042' : '+10000000041');
  if (ids.service) await page.selectOption('#' + ids.service, { index: 1 });
  if (ids.city) await page.fill('#' + ids.city, 'Murfreesboro');
  if (ids.notes) await page.fill('#' + ids.notes, 'launch test ' + stamp);
  if (consent) for (const c of ids.consent) await page.check('#' + c);
  await page.click(ids.submit);
  await page.waitForTimeout(6000);
  const status = await page.evaluate(() => Array.from(document.querySelectorAll('[data-status]')).map((e) => e.textContent.trim()).filter(Boolean).join(' | '));
  const success = await page.isVisible('#' + ids.root + ' [data-success]').catch(() => false);
  out.push({ path, consent, responses, statusText: status, successShown: success });
  await page.close();
}
await run('/contact', { consent: false, ids: { root: 'inspection', name: 'inspection-name', phone: 'inspection-phone', service: 'inspection-service', city: 'inspection-city', notes: 'inspection-notes', consent: ['inspection-consent'], submit: '#inspection [data-submit]' } });
await run('/text-us', { consent: true, ids: { root: 'sms-signup', name: 'su-name', phone: 'su-phone', service: 'su-service', consent: ['su-consent-care'], submit: '#sms-signup [data-submit]' } });
await browser.close();
console.log(JSON.stringify(out, null, 2));
