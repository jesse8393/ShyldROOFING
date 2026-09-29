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

## Blockers to a live verification

1. Merge and deploy the `shyld-ai-agents` PR (Vercel deploys `main` to production automatically).
2. Apply the migration in the Supabase SQL editor.
3. Re run one labelled request with consent unchecked and one with it checked from `shyldroofing.com`, then
   read the response fields, the leads rows, the Resend records, and the Vercel log line for each.
4. Keep `SMS_AUTOMATION_ENABLED` unset until steps 1 to 3 pass. Setting it is a Vercel environment change and a
   redeploy, both of which change production.
