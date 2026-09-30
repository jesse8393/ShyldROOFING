# Lead delivery evidence

Collected September 29, 2026 against the production intake at `https://shyld-ai-agents.vercel.app/api/form-intake`
(Vercel deployment `dpl_FwjBZoD4uqpT5xYBk3CfXXHVXwyD`, commit `f3edbf3` of `jesse8393/shyld-ai-agents`).
One labelled test request was sent from an allowed origin at 01:15:39 UTC with no SMS consent. No secret values
were read; configuration facts below are inferred from provider records and execution logs.

## 1. Lead stored

Verified. Supabase project `shyld-roofing`, table `public.leads`, row `ac1d245e-bb7b-4598-9ae2-87cda9285b2a`
created `2026-09-29 01:15:41 UTC` with `first_name` WEBSITE, `last_name` REBUILD TEST please ignore, `phone`
`+16155550100`, `address` Murfreesboro, `city` Murfreesboro, `service` Free Roof Inspection (notes: ...),
`intent` default, `source` shyldroofing.com form, `form_id` inspection, `page_type` contact, `landing_page`
`/contact`. `notes` was null because the deployed function does not read that field yet. The row was deleted
after verification.

## 2. Notification email received

Verified at the provider and in the inbox.

* Resend record: id `01a0eabb-57f3-731d-bef4-a8b0fb7129fe`, to `jesse@parkerconstructioncompany.com`, subject
  "NEW LEAD: WEBSITE REBUILD TEST please ignore, Free Roof Inspection (...)", status **delivered**, sent
  `2026-09-29 01:15:41 UTC`, from `onboarding@resend.dev`.
* Gmail: the same message is in the inbox of `jesse@parkerconstructioncompany.com`, thread `1a0eabb5a12ce25b`,
  labelled INBOX and IMPORTANT, received `01:15:41 UTC`.
* Vercel runtime logs for the three hour window around the request contain the `POST /api/form-intake 200` line
  and no error lines. The function logs `Resend failed` or `Resend error` on any failure, so none occurred.

So `NOTIFY_EMAIL` is set to the Parker Construction address on Vercel, not the `shyldroofing@gmail.com` default
in the code. The sender is still Resend's onboarding domain, which limits deliverability; a verified sending
domain is recommended before launch. One earlier real lead (September 24) shows the same delivered status.

## 3. Declined consent prevents texting

Deployed function: **not enforced**. `api/form-intake.js` at commit `f3edbf3` never reads a consent field and
sends the Twilio first touch text whenever `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM` exist.
For the test request the response carried `smsSent: false`. The function logs `Twilio failed` or `Twilio error`
whenever a send is attempted and fails; the logs contain neither, so the text was **skipped because Twilio is
not configured**, not failed. That is the only reason no text went out today.

Fix: branch `claude/intake-consent-enforcement` in `jesse8393/shyld-ai-agents` (see the PR link in
`INTEGRATIONS.md`). In the fixed function a text requires explicit affirmative consent (`yes`, `true`, or `on`,
case insensitive; missing, blank, `no`, `maybe`, numbers, arrays, and objects all count as no), plus
`SMS_AUTOMATION_ENABLED=true`, plus Twilio credentials. Unit tests `declined consent ... never calls Twilio even
when fully enabled`, `missing consent field is treated as declined`, and `malformed consent values never send a
text` pass with Twilio fully configured in the test environment. Not yet verified on Vercel: the branch deploys
as a preview behind Vercel SSO, so it can only be exercised end to end after it is merged and deployed, which
waits on approval.

## 4. Approved consent follows configured behaviour

Fixed function, verified by unit tests: with consent `yes` and automation disabled the lead and its consent are
stored, the email says "Yes to texts", and the response reports `smsSkipped: automation_disabled`; with
automation enabled but Twilio unconfigured it reports `not_configured`; with everything configured exactly one
Twilio request goes to the normalised number and `smsSent: true` is returned; a Twilio rejection is reported as
`provider_failed` while the lead is still stored and emailed. The site sends `sms_consent: "yes"` only when the
homeowner checks the box and `"no"` otherwise; the site's form tests cover both states (`accepted request` sends
yes, `declined SMS consent is sent as no`). My earlier note that every request sends "no" was wrong; the test
request I sent by hand had no consent, so it sent "no".

Storage of the actual selection needs the migration in `supabase/migrations/20260929_consent_and_idempotency.sql`
(five nullable or defaulted columns plus a unique index). It has **not** been applied; production is unchanged.
Until it is, the fixed function stores base fields and marks the email "Consent was not stored in the database".

## 5. Retries avoid duplicate notifications

Deployed function: **not enforced**. Every request inserts a row and sends an email.

Fixed function, verified by unit tests: a retry with the same `request_id` on the same warm instance returns
`duplicate: true` and makes no database, email, or Twilio call; a retry that reaches the database after a cold
start receives a 409 from the unique index and likewise sends nothing; different request ids remain separate
leads. The site reuses one `request_id` across retries of a failed or timed out attempt and only rotates it after
a confirmed acceptance (site form test `timeout is not shown as success and retry reuses the same request id`).
The database half depends on the unapplied migration above.

## Live verification of the fixed function on a Vercel preview

The PR branch deployed as preview `dpl_bP97KSNWjNx9viErmbpN1qEEd1xJ`, protected by Vercel Authentication. Using a
temporary Vercel share link, four requests were sent at 02:17:58 to 02:18:00 UTC with the test number
`+16155550100`. The preview uses the same Supabase table, Resend account, and notify address as production, so
each request produced a real row and a real email; the rows were deleted afterward. `SMS_AUTOMATION_ENABLED` is
not set on the project, so no text could be sent by any path.

| Request | Response | Vercel log line |
| --- | --- | --- |
| A, `sms_consent: no` | `ok, dbSaved, emailSent, smsSent false, smsSkipped no_consent` | `db=saved consent_stored=false email=sent sms=skipped:no_consent consent=false` |
| B, `sms_consent: yes` with timestamp and version | `ok, dbSaved, emailSent, smsSent false, smsSkipped automation_disabled` | `... sms=skipped:automation_disabled consent=true` |
| B again, same `request_id` | `ok, duplicate true, dbSaved false, emailSent false, smsSkipped duplicate` | `intake duplicate request_id=preview-test-B-2026-09-29 (memory) no email, no sms` |
| C, `sms_consent: maybe`, `sms_opt_in: yes please` | `ok, smsSkipped no_consent` | `... sms=skipped:no_consent consent=false` |

Supabase held exactly three rows afterward (A, B, C), none for the retry. Resend shows three emails, all
delivered, one per accepted request and none for the retry. Each log line also carried the warning
`stored base fields only; run the consent migration` with PostgREST code `PGRST204` for the missing `request_id`
column, which confirms the migration has not been applied and consent is not yet stored in the table. That
warning also revealed that the fallback insert dropped attribution fields; the branch was updated so the
fallback keeps them (19 unit tests pass), and that update has not been re run on the preview.

Inbox check: all three preview emails (A, B, C) were found in the inbox of `jesse@parkerconstructioncompany.com`.
Test A arrived first (thread `1a0eabb5a12ce25b`); tests B and C appeared a few minutes later (threads
`1a0eaf466e17647e` and `1a0eaf468a95db38`). No email arrived for the retried request, which matches the
Resend records. The three preview rows were deleted from the leads table after the check.

## Blockers to a live verification of production

1. Merge and deploy the `shyld-ai-agents` PR (Vercel deploys `main` to production automatically).
2. Apply the migration in the Supabase SQL editor.
3. Re run one labelled request with consent unchecked and one with it checked from `shyldroofing.com`, then
   read the response fields, the leads rows, the Resend records, and the Vercel log line for each.
4. Keep `SMS_AUTOMATION_ENABLED` unset until steps 1 to 3 pass. Setting it is a Vercel environment change and a
   redeploy, both of which change production.


## Pre publish delivery check, 2026-09-30 00:09 UTC

One labelled request straight to the production intake (`request_id` `launch-test-pre-2026-09-30T00:09:09Z`,
name `LAUNCH TEST pre publish delivery check`, email, city Murfreesboro, notes, consent `no`).

* Response: `dbSaved true, consentStored true, emailSent true, smsSent false, smsSkipped no_consent`.
* Supabase row `ed3bd132-5ec5-4f84-860d-8fa8236af804` held the name, phone, email, service, city, notes,
  `sms_consent false`, and the request id. Deleted afterwards; the table holds the two real leads.
* Resend id `01a0efa4-d2d7-7663-8bf0-34641bdd108c`, status delivered, to `jesse@parkerconstructioncompany.com`.
* Gmail inbox thread `1a0efa4d6e801737`, received 00:09:12 UTC, showing name, phone links, service, notes, city,
  and email.

The owner accepted this inbox for launch. The switch to `shyldroofing@gmail.com` and the verified sender follow
after launch (`docs/HANDOFF-PUBLISH.md`).


## Publication, 2026-09-30

Upload path: the site owner authorized the production deployment in writing. A sibling session created from this
one, with the Hostinger connector loaded, uploaded the build (archive `site-97b286c.zip`, sha256
`990013dd...52fcf`, 295 files) file by file into `public_html` through the Hostinger upload URL. Its interim
status read "294 files deployed, .htaccess confirmed" while it ran its own validation; its report branch
`claude/publish-report` holds the details it publishes. Nothing was deleted on the server. WordPress files and
`google1e3d794f007288d9.html` remain in place (checked below).

Independent verification from this session, 01:08 to 01:16 UTC, against `https://shyldroofing.com`:

| Check | Observed |
| --- | --- |
| Home page | 200, title `SHYLD Roofing | Roofing Contractor in Middle Tennessee` |
| `/about`, `/contact`, `/projects`, `/text-us`, `/roof-repair`, `/roofing-franklin` | 200 |
| `/roof-repair.html`, `/roof-repair/`, `/index.html` | 301 to the clean URL |
| `/roofing-manchester` | 301 to `/service-areas` |
| `/does-not-exist` | 404 |
| `/sitemap.xml` | 30 `<loc>` entries; `robots.txt` points at it |
| `google1e3d794f007288d9.html` | 200, no redirect, verification content intact |
| `http://www.shyldroofing.com/` | ends at `https://shyldroofing.com/` |
| `wp-login.php` | 200 (WordPress files untouched) |
| Home page images (`/assets/*.avif`, `*.jpg`) | 200 with image content types |
| Scripts, fonts, brand SVGs, icons, manifest, og image | 200 |
| `.htaccess` fetched directly | 403 (hidden file not served, as intended) |
| Full crawl (`BASE=https://shyldroofing.com npm run crawl`) | Crawled 30 pages, checked 245 assets. No problems found. |
| Deployed `InquiryForm` script | byte identical to the built file |
| Live contact form inputs | `inspection-name`, `inspection-phone`, `inspection-consent` present |
| Live text us form inputs | `su-consent-care` (`sms_consent`), `su-consent-promo` (`sms_consent_promotional`) present |
| Contact details on the live pages | phone (615) 295 8974 and `shyldroofing@gmail.com` present |
| Form target on the live pages | `https://shyld-ai-agents.vercel.app/api/form-intake` |

Live form submissions through a browser were not run from this session. The sandbox's browser cannot verify
the outbound proxy certificate, and the two ways around that (ignoring certificate errors, or carrying browser
traffic through curl) were refused by the platform's permission layer, which was respected. The form path is
proven end to end by the pre publish delivery check above (same endpoint, same payload shape the live script
sends) and by the eleven browser form tests in `docs/QA-REPORT.md`. The owner's own submission through the live
site, followed by the row and inbox checks in `docs/HANDOFF-PUBLISH.md`, closes that gap.

Notification routing at publication: `jesse@parkerconstructioncompany.com`. SMS automation unset. Sender still
`onboarding@resend.dev` pending the Resend DKIM check; PR #3 unmerged.
