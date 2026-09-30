// Submit the real website forms on the live site (no interception). Labelled names, deleted afterwards.
import { chromium } from 'playwright';
const stamp = new Date().toISOString().replace(/[:.]/g, '');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const out = [];
async function run(path, { consent, ids }) {
  const page = await browser.newPage();
  const responses = [];
  page.on('response', async (r) => { if (r.url().includes('form-intake') && r.request().method() === 'POST') { try { responses.push(await r.json()); } catch {} } });
  await page.goto('https://shyldroofing.com' + path, { waitUntil: 'networkidle' });
  await page.fill('#' + ids.name, 'Release Test Live ' + (consent ? 'consent' : 'noconsent'));
  await page.fill('#' + ids.phone, consent ? '(000) 000-0022' : '(000) 000-0021');
  if (ids.service) await page.selectOption('#' + ids.service, { index: 1 });
  if (ids.city) await page.fill('#' + ids.city, 'Murfreesboro');
  if (ids.notes) await page.fill('#' + ids.notes, 'release-test live form ' + stamp);
  if (consent) for (const c of ids.consent) await page.check('#' + c);
  await page.click(ids.submit);
  await page.waitForTimeout(6000);
  const status = await page.evaluate(() => Array.from(document.querySelectorAll('[data-status]')).map((e) => e.textContent.trim()).filter(Boolean).join(' | '));
  out.push({ path, consent, responses, statusText: status });
  await page.close();
}
await run('/contact', { consent: false, ids: { name: 'inspection-name', phone: 'inspection-phone', service: 'inspection-service', city: 'inspection-city', notes: 'inspection-notes', consent: ['inspection-consent'], submit: '#inspection [data-submit]' } });
await run('/text-us', { consent: true, ids: { name: 'su-name', phone: 'su-phone', service: 'su-service', consent: ['su-consent-care'], submit: '#sms-signup [data-submit]' } });
await browser.close();
console.log(JSON.stringify(out, null, 2));
