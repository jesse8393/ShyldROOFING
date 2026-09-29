// Integration tests for the inquiry form against the local preview build.
// The intake endpoint is intercepted so no real lead is created. Each case
// asserts what the homeowner sees and what would have been sent.
import { chromium } from 'playwright';

const base = process.env.BASE || 'http://localhost:4321';
const ENDPOINT = 'https://shyld-ai-agents.vercel.app/api/form-intake';
const browser = await chromium.launch();
let failures = 0;

async function scenario(name, fn) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
  const page = await ctx.newPage();
  const posts = [];
  try {
    await fn(page, posts);
    console.log('PASS', name);
  } catch (e) {
    failures++;
    console.log('FAIL', name, '\n   ', e.message.split('\n')[0]);
  } finally {
    await ctx.close();
  }
}

async function fill(page, { consent = false, notes = '' } = {}) {
  await page.goto(base + '/contact');
  await page.fill('#inspection-name', 'Test Homeowner');
  await page.fill('#inspection-phone', '(615) 555-0142');
  await page.selectOption('#inspection-service', 'Roof Repair');
  await page.fill('#inspection-city', 'Franklin');
  if (notes) await page.fill('#inspection-notes', notes);
  if (consent) await page.check('#inspection-consent');
}

function intercept(page, posts, handler) {
  return page.route(ENDPOINT, async (route) => {
    const body = JSON.parse(route.request().postData() || '{}');
    posts.push(body);
    await handler(route, body);
  });
}

const ok = (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, leadId: true, smsSent: false }) });

await scenario('accepted request shows confirmation only after ok response', async (page, posts) => {
  await intercept(page, posts, ok);
  await fill(page, { consent: true, notes: 'Leak near chimney' });
  await page.click('#inspection [data-submit]');
  await page.waitForSelector('#inspection [data-success]:not([hidden])', { timeout: 5000 });
  const text = await page.textContent('#inspection [data-success]');
  if (!text.includes('reached SHYLD')) throw new Error('confirmation text missing');
  if (!(await page.isHidden('#inspection form'))) throw new Error('form still visible');
  const p = posts[0];
  if (p.full_name !== 'Test Homeowner' || p.phone !== '(615) 555-0142') throw new Error('name/phone not sent');
  if (p.address !== 'Franklin' || p.city !== 'Franklin') throw new Error('city not mapped to address');
  if (!p.service.startsWith('Roof Repair') || !p.service.includes('Leak near chimney')) throw new Error('service/notes mapping wrong: ' + p.service);
  if (p.sms_consent !== 'yes' || p.sms_opt_in !== true || !p.sms_consent_at || !p.sms_consent_version) throw new Error('consent fields missing');
  if (!p.request_id || p.website_url !== '') throw new Error('request id or honeypot wrong');
  const layer = await page.evaluate(() => window.dataLayer.map((e) => e.event));
  if (!layer.includes('inspection_accepted') || !layer.includes('inspection_submit')) throw new Error('tracking events missing: ' + layer.join(','));
  const leak = await page.evaluate(() => JSON.stringify(window.dataLayer));
  if (leak.includes('555-0142') || leak.includes('Test Homeowner')) throw new Error('PII in dataLayer');
});

await scenario('declined SMS consent is sent as no', async (page, posts) => {
  await intercept(page, posts, ok);
  await fill(page, { consent: false });
  await page.click('#inspection [data-submit]');
  await page.waitForSelector('#inspection [data-success]:not([hidden])');
  if (posts[0].sms_consent !== 'no' || posts[0].sms_opt_in !== false || posts[0].sms_consent_at !== '') throw new Error('consent should be no');
});

await scenario('client validation blocks empty required fields and focuses the summary', async (page, posts) => {
  await intercept(page, posts, ok);
  await page.goto(base + '/contact');
  await page.click('#inspection [data-submit]');
  await page.waitForSelector('#inspection [data-error-summary]:not([hidden])');
  const items = await page.$$eval('#inspection [data-error-list] li', (els) => els.length);
  if (items !== 3) throw new Error('expected 3 errors, got ' + items);
  const focused = await page.evaluate(() => document.activeElement?.getAttribute('data-error-summary') !== null);
  if (!focused) throw new Error('summary not focused');
  if (posts.length) throw new Error('request sent despite errors');
  const invalid = await page.getAttribute('#inspection-phone', 'aria-invalid');
  if (invalid !== 'true') throw new Error('aria-invalid missing');
});

await scenario('server rejection keeps values and shows an error, never success', async (page, posts) => {
  await intercept(page, posts, (route) => route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ error: 'first_name and phone required' }) }));
  await fill(page);
  await page.click('#inspection [data-submit]');
  await page.waitForSelector('#inspection [data-status].is-error');
  if (!(await page.isHidden('#inspection [data-success]'))) throw new Error('success shown on rejection');
  if ((await page.inputValue('#inspection-name')) !== 'Test Homeowner') throw new Error('values lost');
  if (await page.isDisabled('#inspection [data-submit]')) throw new Error('button stuck disabled');
});

await scenario('backend 500 shows failure message with phone fallback', async (page, posts) => {
  await intercept(page, posts, (route) => route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Lead capture failed' }) }));
  await fill(page);
  await page.click('#inspection [data-submit]');
  await page.waitForSelector('#inspection [data-status].is-error');
  const t = await page.textContent('#inspection [data-status]');
  if (!t.includes('295 8974')) throw new Error('phone fallback missing');
});

await scenario('offline network failure is reported and retry is possible', async (page, posts) => {
  let calls = 0;
  await page.route(ENDPOINT, async (route) => {
    calls++;
    if (calls === 1) return route.abort('internetdisconnected');
    posts.push(JSON.parse(route.request().postData()));
    return ok(route);
  });
  await fill(page);
  await page.click('#inspection [data-submit]');
  await page.waitForSelector('#inspection [data-status].is-error');
  const first = await page.textContent('#inspection [data-status]');
  if (!first.includes('connection')) throw new Error('offline message wrong: ' + first);
  await page.click('#inspection [data-submit]');
  await page.waitForSelector('#inspection [data-success]:not([hidden])');
  if (calls !== 2) throw new Error('expected 2 calls, got ' + calls);
});

await scenario('timeout is not shown as success and retry reuses the same request id', async (page, posts) => {
  let calls = 0;
  const ids = [];
  await page.addInitScript(() => { window.__TEST_TIMEOUT__ = true; });
  await page.route(ENDPOINT, async (route) => {
    calls++;
    ids.push(JSON.parse(route.request().postData()).request_id);
    if (calls === 1) {
      await new Promise((r) => setTimeout(r, 16500));
      return route.abort();
    }
    return ok(route);
  });
  await fill(page);
  await page.click('#inspection [data-submit]');
  await page.waitForSelector('#inspection [data-status].is-error', { timeout: 20000 });
  const t = await page.textContent('#inspection [data-status]');
  if (!t.includes('did not get a confirmation')) throw new Error('timeout message wrong: ' + t);
  if (!(await page.isHidden('#inspection [data-success]'))) throw new Error('success shown on timeout');
  await page.click('#inspection [data-submit]');
  await page.waitForSelector('#inspection [data-success]:not([hidden])', { timeout: 10000 });
  if (ids[0] !== ids[1]) throw new Error('request id changed between retries');
});

await scenario('double click sends exactly one request', async (page, posts) => {
  await page.route(ENDPOINT, async (route) => {
    posts.push(1);
    await new Promise((r) => setTimeout(r, 600));
    return ok(route);
  });
  await fill(page);
  await page.click('#inspection [data-submit]');
  await page.click('#inspection [data-submit]', { force: true }).catch(() => {});
  await page.keyboard.press('Enter').catch(() => {});
  await page.waitForSelector('#inspection [data-success]:not([hidden])');
  await page.waitForTimeout(800);
  if (posts.length !== 1) throw new Error('expected 1 request, got ' + posts.length);
});

await scenario('honeypot value is forwarded so the intake can drop it', async (page, posts) => {
  await intercept(page, posts, ok);
  await fill(page);
  await page.evaluate(() => { document.querySelector('#inspection-website').value = 'http://spam.example'; });
  await page.click('#inspection [data-submit]');
  await page.waitForSelector('#inspection [data-success]:not([hidden])');
  if (posts[0].website_url !== 'http://spam.example') throw new Error('honeypot not forwarded');
});

await scenario('keyboard only: tab order reaches every field and submit', async (page, posts) => {
  await intercept(page, posts, ok);
  await page.goto(base + '/contact#inspection');
  await page.focus('#inspection-name');
  const order = [];
  for (let i = 0; i < 12; i++) {
    order.push(await page.evaluate(() => document.activeElement?.id || document.activeElement?.tagName));
    await page.keyboard.press('Tab');
  }
  for (const id of ['inspection-name', 'inspection-phone', 'inspection-service', 'inspection-city', 'inspection-email', 'inspection-notes', 'inspection-consent']) {
    if (!order.includes(id)) throw new Error('tab order missed ' + id + ': ' + order.join(','));
  }
  if (order.includes('inspection-website')) throw new Error('honeypot is focusable');
});

await scenario('text-us form sends both consent flags', async (page, posts) => {
  await intercept(page, posts, ok);
  await page.goto(base + '/text-us');
  await page.fill('#su-name', 'Test Homeowner');
  await page.fill('#su-phone', '6155550142');
  await page.selectOption('#su-service', 'Free Roof Inspection');
  await page.check('#su-consent-promo');
  await page.click('#sms-signup [data-submit]');
  await page.waitForSelector('#sms-signup [data-success]:not([hidden])');
  const p = posts[0];
  if (p.sms_consent !== 'no' || p.sms_consent_promotional !== 'yes' || !p.sms_consent_at) throw new Error('consent flags wrong: ' + JSON.stringify(p));
  if (p.source !== 'shyldroofing.com/text-us') throw new Error('source wrong');
});

await browser.close();
console.log(failures ? `\n${failures} scenario(s) failed` : '\nAll form scenarios passed');
process.exitCode = failures ? 1 : 0;
