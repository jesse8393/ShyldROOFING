# Integrations

## Lead intake (the only delivery path)

Both forms (`InquiryForm` on the homepage, contact, service, area, and article pages, and the SMS sign up on
`/text-us`) POST JSON to the existing intake service:

```
POST https://shyld-ai-agents.vercel.app/api/form-intake
Content-Type: application/json
```

The service lives in the `jesse8393/shyld-ai-agents` repository (`api/form-intake.js`), deployed on Vercel
(project `shyld-ai-agents`, team `jesse8393s-projects`). It only accepts requests whose `Origin` or `Referer`
is `https://shyldroofing.com` or `https://www.shyldroofing.com`, so it cannot be exercised from localhost or a
preview domain without changing `ALLOWED_ORIGINS` in that file.

What the service does with a request:

1. Drops it silently if `website_url` or `company_field` is filled (honeypot), returning `{ ok: true, dropped: "honeypot" }`.
2. Requires a name (`full_name`, `first_name`, `firstName`, or `name`) and `phone`; otherwise `400`.
3. Inserts a row in Supabase project `shyld-roofing` (`aohvafsyxohrknwbvpgg`), table `public.leads`.
4. Emails `shyldroofing@gmail.com` through Resend if `RESEND_API_KEY` is set.
5. Sends a first touch text through Twilio if `TWILIO_*` variables are set.
6. Returns `{ ok: true, ... }` on success or `{ error }` with `4xx`/`5xx`.

The site shows the success message only when the response is `2xx` **and** `ok === true`.

### Fields the site sends

| Field | Stored today | Notes |
| --- | --- | --- |
| `full_name` | `first_name`, `last_name` | Split on the first space by the service |
| `phone` | `phone` | Normalised to E.164 by the service |
| `email` | `email` | Optional |
| `address` | `address` | The site asks for **city** and sends it here so it shows in the notification email |
| `city` | `city` | Also sent separately |
| `service` | `service`, `intent` | When notes are present the site appends `(notes: ...)` so they reach the email. Remove once `notes` is mapped |
| `notes` | not stored | `leads.notes` column exists but the function does not read this key yet |
| `sms_consent` (`yes`/`no`), `sms_consent_promotional`, `sms_consent_at`, `sms_consent_version` | not stored | See required changes |
| `request_id` | not stored | Client generated UUID, reused on retries |
| `form_id`, `source`, `source_url`, `landing_page`, `page_path`, `page_type`, `cta_position` | stored where columns exist | Attribution |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `gbraid`, `wbraid` | stored | Captured from the URL and kept in storage for the session |
| `website_url` | honeypot | Always empty for humans |

### Required changes in `shyld-ai-agents` (not in this repository)

These are needed to meet the brief fully. The site already sends the data.

1. Read `body.notes` and store it in `leads.notes`. Then remove the `(notes: ...)` suffix from `service` in `src/scripts/inquiry-form.ts`.
2. Add columns `sms_consent boolean`, `sms_consent_promotional boolean`, `sms_consent_at timestamptz`,
   `sms_consent_version text`, and store them. Honour `sms_consent = false` by skipping the Twilio first touch text.
3. Add `request_id text unique` and return `ok: true` without inserting when a duplicate arrives (idempotency).
4. Add basic rate limiting per IP (Vercel Firewall or a small in function check).
5. Optionally add `https://preview host` to `ALLOWED_ORIGINS` while previewing.

### Verifying delivery

The Supabase MCP connector and the Vercel MCP connector in this workspace can read the `leads` table and the
function logs. A labelled test submission from the live domain is the only true end to end test.
Do not submit tests with a real customer's phone number; the service may text it.

## Analytics

The site pushes events to `window.dataLayer` only. No GA4 or Tag Manager container is installed on the live site
today, so the events go nowhere until one is added. Events:

| Event | When |
| --- | --- |
| `phone_click` | Any `tel:` link. `cta_position` says where |
| `text_click` | Any `sms:` link |
| `cta_click` | Links with a `data-cta` attribute |
| `service_click`, `project_click` | Links with `data-track` |
| `inspection_start` | First input in a form |
| `inspection_submit` | Form passed validation and was sent |
| `inspection_accepted` | Service confirmed acceptance. Count this as the lead, never `inspection_submit` |
| `inspection_failed` | With `reason`: rejected, failed, timeout, offline |

No names, phone numbers, emails, or addresses are ever pushed. To activate, add a GTM container snippet to
`src/layouts/Base.astro` and create GA4 tags for the events above. Mark `inspection_accepted` as a conversion.
