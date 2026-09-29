// Click tracking for calls, texts, and CTAs. Pushes to window.dataLayer only.
// A tag manager or GA4 snippet must be added separately for these to reach any destination.
import { captureAttribution, track } from './attribution';

captureAttribution();

document.addEventListener(
  'click',
  (e) => {
    const target = e.target as HTMLElement | null;
    const a = target?.closest<HTMLAnchorElement>('a[href]');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    const cta = a.dataset.cta || '';
    const position = cta.split('_')[0] || 'body';
    if (href.startsWith('tel:')) {
      track('phone_click', { cta_position: position, cta: cta || 'body_call' });
    } else if (href.startsWith('sms:')) {
      track('text_click', { cta_position: position, cta: cta || 'body_text' });
    } else if (cta) {
      track('cta_click', { cta_position: position, cta, link_url: href });
    } else if (a.dataset.track === 'service') {
      track('service_click', { link_url: href });
    } else if (a.dataset.track === 'project') {
      track('project_click', { link_url: href });
    }
  },
  true,
);
