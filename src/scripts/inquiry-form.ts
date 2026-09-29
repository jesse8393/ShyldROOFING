// Inspection request form. Sends JSON to the SHYLD intake service and shows
// success only after the service confirms acceptance.
import { getAttribution, getLandingPage, pageContext, track } from './attribution';

const TIMEOUT_MS = 15000;

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function digits(v: string) {
  return v.replace(/\D/g, '');
}

function newRequestId() {
  if ('randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function setup(form: HTMLFormElement) {
  const wrap = form.parentElement as HTMLElement;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]')!;
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const summary = form.querySelector<HTMLElement>('[data-error-summary]')!;
  const summaryList = form.querySelector<HTMLElement>('[data-error-list]')!;
  const success = wrap.querySelector<HTMLElement>('[data-success]')!;
  const formId = form.dataset.formId || 'inspection';
  const idleLabel = submitLabel.textContent || 'Send my request';

  // One request id per attempt series. Reused on retry so the intake service
  // can deduplicate once it supports it, and reset only after acceptance.
  let requestId = newRequestId();
  let inFlight = false;
  let started = false;

  form.addEventListener('input', () => {
    if (!started) {
      started = true;
      track('inspection_start', { form_id: formId });
    }
  });

  function fieldWrap(el: Field) {
    return el.closest<HTMLElement>('.field');
  }
  function setError(el: Field, message: string | null) {
    const w = fieldWrap(el);
    const hint = w?.querySelector<HTMLElement>('.hint');
    if (!w) return;
    if (message) {
      w.classList.add('is-invalid');
      el.setAttribute('aria-invalid', 'true');
      if (hint) {
        hint.textContent = message;
        hint.hidden = false;
        el.setAttribute('aria-describedby', hint.id);
      }
    } else {
      w.classList.remove('is-invalid');
      el.removeAttribute('aria-invalid');
      el.removeAttribute('aria-describedby');
      if (hint) {
        hint.hidden = true;
        hint.textContent = '';
      }
    }
  }

  function validate(): { ok: boolean; errors: { el: Field; message: string }[] } {
    const errors: { el: Field; message: string }[] = [];
    const name = form.elements.namedItem('full_name') as HTMLInputElement;
    const phone = form.elements.namedItem('phone') as HTMLInputElement;
    const service = form.elements.namedItem('service') as HTMLSelectElement;
    const email = form.elements.namedItem('email') as HTMLInputElement;

    if (name.value.trim().length < 2) errors.push({ el: name, message: name.dataset.errorMsg! });
    const d = digits(phone.value);
    if (!(d.length === 10 || (d.length === 11 && d.startsWith('1')))) errors.push({ el: phone, message: phone.dataset.errorMsg! });
    if (!service.value) errors.push({ el: service, message: service.dataset.errorMsg! });
    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()))
      errors.push({ el: email, message: email.dataset.errorMsg! });

    for (const el of [name, phone, service, email]) setError(el, null);
    for (const e of errors) setError(e.el, e.message);
    return { ok: errors.length === 0, errors };
  }

  function showSummary(errors: { el: Field; message: string }[]) {
    summaryList.innerHTML = '';
    for (const e of errors) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${e.el.id}`;
      a.textContent = e.message;
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        e.el.focus();
      });
      li.appendChild(a);
      summaryList.appendChild(li);
    }
    summary.hidden = false;
    summary.focus();
  }

  function setStatus(message: string, isError: boolean) {
    status.classList.toggle('is-error', isError);
    status.innerHTML = message;
  }

  function busy(on: boolean) {
    inFlight = on;
    submit.disabled = on;
    submit.setAttribute('aria-disabled', String(on));
    submitLabel.textContent = on ? 'Sending…' : idleLabel;
  }

  const phoneLine =
    'You can also call <a href="tel:+16152958974">(615) 295 8974</a>.';

  function payload() {
    const fd = new FormData(form);
    const get = (k: string) => String(fd.get(k) ?? '').trim();
    const consent = get('sms_consent') === 'yes';
    const notes = get('notes').slice(0, 600);
    const service = get('service');
    const attribution = getAttribution();
    const ctx = pageContext();
    return {
      full_name: get('full_name').slice(0, 120),
      phone: get('phone'),
      email: get('email'),
      // The intake service stores a single "address" field. City is what we ask for.
      address: get('city'),
      city: get('city') || ctx.city,
      // Notes travel inside the service field until the intake service adds a notes column.
      service: notes ? `${service} (notes: ${notes})` : service,
      notes,
      sms_opt_in: consent,
      sms_consent: consent ? 'yes' : 'no',
      sms_consent_promotional: get('sms_consent_promotional') === 'yes' ? 'yes' : 'no',
      sms_consent_at: consent || get('sms_consent_promotional') === 'yes' ? new Date().toISOString() : '',
      sms_consent_version: get('sms_consent_version'),
      request_id: requestId,
      form_id: formId,
      source: get('source'),
      source_url: window.location.href,
      landing_page: getLandingPage(),
      page_path: ctx.page_path,
      page_type: ctx.page_type,
      cta_position: 'body',
      website_url: get('website_url'),
      ...attribution,
    };
  }

  async function send() {
    const body = payload();
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      let data: { ok?: boolean; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      if (res.ok && data.ok === true) return { state: 'accepted' as const };
      if (res.status >= 400 && res.status < 500) return { state: 'rejected' as const, detail: data.error || `HTTP ${res.status}` };
      return { state: 'failed' as const, detail: data.error || `HTTP ${res.status}` };
    } catch (err) {
      const aborted = err instanceof DOMException && err.name === 'AbortError';
      return { state: aborted ? ('timeout' as const) : ('offline' as const) };
    } finally {
      window.clearTimeout(timer);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (inFlight) return;

    const v = validate();
    if (!v.ok) {
      showSummary(v.errors);
      return;
    }
    summary.hidden = true;
    setStatus('', false);
    busy(true);
    track('inspection_submit', { form_id: formId, sms_consent: (form.elements.namedItem('sms_consent') as HTMLInputElement).checked });

    const result = await send();
    busy(false);

    if (result.state === 'accepted') {
      track('inspection_accepted', { form_id: formId, request_id: requestId });
      requestId = newRequestId();
      form.hidden = true;
      success.hidden = false;
      success.focus();
      return;
    }

    const attempt = { form_id: formId, reason: result.state };
    track('inspection_failed', attempt);

    if (result.state === 'rejected') {
      setStatus(`We could not accept that request. Please check your name and phone number and try again. ${phoneLine}`, true);
    } else if (result.state === 'timeout') {
      setStatus(
        `We did not get a confirmation that your request arrived. Your details are still here, so you can try once more. If it happens again, please call. ${phoneLine}`,
        true,
      );
    } else if (result.state === 'offline') {
      setStatus(`It looks like the connection dropped before we could confirm your request. Please try again. ${phoneLine}`, true);
    } else {
      setStatus(`Our request system had a problem and did not confirm your request. Please try again in a moment or call us. ${phoneLine}`, true);
    }
    status.focus?.();
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-inquiry-form]').forEach(setup);
