// Campaign attribution kept compatible with the existing lead intake fields.
// Stores only campaign parameters and page context. Never personal details.

const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid'] as const;
const STORE = 'shyld_utm';
const LANDING = 'shyld_landing';

type Attribution = Partial<Record<(typeof KEYS)[number], string>>;

function read(store: Storage, key: string): string | null {
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}
function write(store: Storage, key: string, value: string) {
  try {
    store.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
}

export function captureAttribution() {
  const qs = new URLSearchParams(window.location.search);
  const found: Attribution = {};
  let any = false;
  for (const k of KEYS) {
    const v = qs.get(k);
    if (v) {
      found[k] = v.slice(0, 200);
      any = true;
    }
  }
  if (any) {
    const existing = getAttribution();
    const merged = JSON.stringify({ ...existing, ...found, _ts: Date.now() });
    write(window.localStorage, STORE, merged);
    write(window.sessionStorage, STORE, merged);
  }
  if (!read(window.localStorage, LANDING)) write(window.localStorage, LANDING, window.location.pathname);
}

export function getAttribution(): Attribution {
  try {
    const raw = read(window.sessionStorage, STORE) || read(window.localStorage, STORE) || '{}';
    const parsed = JSON.parse(raw) as Record<string, string>;
    const out: Attribution = {};
    for (const k of KEYS) if (parsed[k]) out[k] = parsed[k];
    return out;
  } catch {
    return {};
  }
}

export function getLandingPage(): string {
  return read(window.localStorage, LANDING) || window.location.pathname;
}

export function pageContext() {
  const p = window.location.pathname.replace(/\/+$/, '') || '/';
  const ctx: { page_path: string; page_type: string; service: string; city: string } = {
    page_path: p,
    page_type: 'other',
    service: '',
    city: '',
  };
  const services = ['roof-replacement', 'roof-repair', 'storm-restoration', 'metal-roofing', 'siding', 'gutters'];
  if (p === '/') ctx.page_type = 'home';
  else if (p.startsWith('/roofing-')) {
    ctx.page_type = 'city';
    ctx.city = p.slice('/roofing-'.length);
  } else if (services.includes(p.slice(1))) {
    ctx.page_type = 'service';
    ctx.service = p.slice(1);
  } else if (['/privacy', '/terms', '/text-us'].includes(p)) ctx.page_type = 'legal';
  else if (p === '/contact') ctx.page_type = 'contact';
  else if (p === '/projects') ctx.page_type = 'projects';
  else if (p.startsWith('/roof-')) ctx.page_type = 'article';
  return ctx;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Push an analytics event. Nothing here should ever include names, phones, or addresses. */
export function track(event: string, extra: Record<string, unknown> = {}) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...pageContext(), ...extra });
  } catch {
    /* ignore */
  }
}
