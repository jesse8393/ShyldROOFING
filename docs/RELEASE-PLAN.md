# Release plan for approval

Prepared 2026-09-29. Nothing in this plan has been applied to production. Production website, the deployed
intake function, the Supabase schema, and every Vercel setting are unchanged. Automated SMS stays off.

Three separate releases, in this order, each with its own verification and rollback:

1. Database migration (Supabase project `shyld-roofing`, table `public.leads`).
2. Intake function (merge `jesse8393/shyld-ai-agents` PR #2, Vercel deploys `main`).
3. Website (upload the Astro build from `jesse8393/ShyldROOFING` PR #2 to Hostinger).

Each release depends on the one before it. Do not reorder.

## What was checked before writing this plan

### 1. Migration reviewed against the live schema

The live `public.leads` table was read directly (28 columns, 2 rows, 3 indexes, 1 policy, 3 recorded migrations).

* `notes` already exists (created in the first migration). The intake branch now stores it in the base insert.
* The migration adds five columns and one partial unique index. It changes no existing column, row, policy,
  grant, or trigger. All statements use `if not exists`, so it is safe to run twice.
* Row level security is enabled with one policy, `anon_insert_only` (insert, with check true). It is untouched.
* `anon` holds table level INSERT and SELECT on `public.leads` (no column level grants), so the new columns are
  insertable by the publishable key with no grant change. This was confirmed with `has_column_privilege` during
  the dry run below.
* Dry run: the full migration was executed inside a single block that was forced to roll back. Result:
  rows before 2, rows after 2, `anon` may insert `sms_consent` and `request_id`, existing rows defaulted to
  `false`, the index existed, policy count unchanged. Nothing persisted.
* Index semantics were proven on a temporary table with the same definition: a second row with the same
  `request_id` raises `unique_violation`; rows with a null `request_id` (all existing leads) are unaffected.
* The migration file now states the apply order (before the function), the grant reasoning, the rollback SQL,
  and ends with `notify pgrst, 'reload schema'` so PostgREST sees the columns immediately.

Code compatibility in both directions:

* Deployed production function with the new schema: it never sends the new columns, so nothing changes.
* New function with the old schema: it saves the lead without consent and reports that loudly (see 2).
* New function with the new schema: consent, timestamp, wording version, notes, and `request_id` are stored.

Backup: the Supabase MCP connection does not expose the project's backup plan. Before applying, export the
current rows with `select * from public.leads` and keep the result outside the repository (it holds personal
data). Two rows exist today. Whether daily backups or point in time recovery are enabled must be read in the
Supabase dashboard under Database, Backups.

Rollback (in the migration file as a comment): drop the index, drop the five columns, notify PostgREST. Lead
rows are never touched by the rollback; only the new columns' contents are lost.

### 2. Consent is never silently discarded

Changes pushed to the intake branch (commit `a86f212`):

* The fallback insert runs only when PostgREST reports a missing column (`PGRST204`). Any other database
  error is treated as a database failure: no fallback, the owner email carries the DB DOWN note.
* When the fallback runs, the response carries `consentStored: false` and `schemaWarning: 'consent_not_stored'`,
  the email subject begins with `ACTION NEEDED, consent not stored.`, and an error log line names the
  request id and the migration to apply.
* Release order removes the case entirely: the migration is applied and verified before the function deploys.
* Post deploy verification (below) reads the stored row back and requires `sms_consent` to match the request,
  `consent_stored=true` in the log line, and no `schema_warning`.

The earlier preview success was incomplete on this point and is treated as such: consent columns were absent
and consent was not stored. That is why the migration comes first.

### 3. Duplicate protection

* Same instance, sequential retry: covered by the in memory guard (unit test, preview test).
* Same instance, two simultaneous requests with one `request_id`: the guard is set synchronously before the
  first `await`, so the second request is answered as a duplicate. New unit test passes.
* Different instances or after a restart: only the database index protects. This cannot be proven with mocks
  and cannot be exercised until the index exists in production. It is a required post migration test (below):
  a retry sent more than ten minutes after the first request lands after the in memory entry has expired, so
  it must reach the database and receive 409.
* Two simultaneous requests across instances: exercised in the same test window by firing two identical
  requests at once from two separate connections. Expected: one row, one email, one `duplicate: true`.

Residual risk, documented and unchanged: if the row is saved but the email provider fails, a retry gets 409
and no email. The lead is in the table; it is not emailed. The response reports `emailSent: false` so the
site could show a call prompt, which it does not do today.

### 4. Automated SMS stays off

* Code: a text requires explicit affirmative consent AND `SMS_AUTOMATION_ENABLED=true` AND Twilio credentials.
  The kill switch defaults to off.
* Configuration: the Vercel API refuses to list this project's environment variable names (403,
  `projectEnvVars:list`). Configuration therefore cannot be verified from this session. Preview responses
  (`smsSkipped: automation_disabled`) show the switch is unset on preview only. Missing Twilio error lines in
  logs are not proof of anything and are not used as proof.
* Required: read access to the environment variable names (values not needed). Either grant the Vercel
  connector a token with environment variable read on project `shyld-ai-agents`, or read the Production
  environment in the Vercel dashboard and confirm which of these names exist: `SMS_AUTOMATION_ENABLED`,
  `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM`, `RESEND_API_KEY`, `NOTIFY_EMAIL`, `NOTIFY_FROM`.
* Post deploy test B (affirmative consent) must return `smsSkipped: automation_disabled` or `not_configured`,
  never `smsSent: true`.

### 5. Notification destination

Evidence: every delivered lead email (production test and three preview tests) went to
`jesse@parkerconstructioncompany.com`, the value of `NOTIFY_EMAIL` on Vercel. The code default is
`shyldroofing@gmail.com` and is not in effect. The sender is `onboarding@resend.dev`. I believe Resend only
delivers from that shared sender to the email address that owns the Resend account; verify this before
expecting delivery to any other inbox. Changing the recipient needs a verified sending domain on Resend and an
env change on Vercel. No recipient change is proposed. Confirmation of the current destination is requested.

### 6. Release separation

Set out below with dependency order, verification, and controlled production tests.

## Release 1: database migration

Preconditions: authorization, backup export taken.

Steps:

1. Export: `select * from public.leads order by created_at` and save the result locally.
2. Apply `supabase/migrations/20260929_consent_and_idempotency.sql` in the Supabase SQL editor (or through the
   MCP `apply_migration` with the same text and the name `consent_and_idempotency`).
3. Verify:
   * `select count(*) from public.leads` equals the exported count.
   * The five columns exist; `sms_consent` is `false` on every existing row; `request_id` is null on all.
   * `leads_request_id_key` appears in `pg_indexes`.
   * `pg_policies` still lists exactly `anon_insert_only`.
   * `has_column_privilege('anon','public.leads','request_id','INSERT')` is true.
   * The production function still accepts a lead (it ignores the new columns): one labelled request, then
     delete the row.
4. Rollback if any check fails: the rollback block in the migration file.

## Release 2: intake function

Preconditions: release 1 verified. Unit tests: 23 pass on `a86f212`.

Steps:

1. Mark PR #2 ready and merge into `main`. Vercel deploys production automatically.
2. Confirm the production deployment is `READY` and serves the new build (the response now contains
   `consentStored`).
3. Controlled production tests, all labelled `release-test` in the name and sent from an allowed origin. Each
   sends a real email to the notification inbox. Rows are deleted at the end.
   * A: `sms_consent: no`. Expect `dbSaved true, consentStored true, smsSkipped no_consent`. Row has
     `sms_consent false`, `request_id` set, `notes` set.
   * B: `sms_consent: yes` with timestamp and version. Expect `consentStored true, smsSkipped
     automation_disabled` (or `not_configured`), `smsSent false`. Row has `sms_consent true`, `sms_consent_at`,
     `sms_consent_version`.
   * B immediate retry, same `request_id`: `duplicate true`, no new row, no new email.
   * B retry after 11 minutes, same `request_id`: `duplicate true` from the database path (409), no new row,
     no new email. This proves protection across restarts and instances.
   * D: two identical requests fired at the same instant from two connections. Expect one row, one email,
     exactly one `duplicate true`.
   * C: `sms_consent: maybe`, `sms_opt_in: yes please`. Expect `no_consent`, row `sms_consent false`.
   * For each: read the row, the Resend record (status delivered, recipient), the Vercel log line
     (`consent_stored=true`, no `schema_warning`), and the inbox.
4. Delete the test rows by `request_id`.
5. Rollback: Vercel instant rollback to the previous production deployment. The old function ignores the new
   columns, so no schema change is needed to roll back.

## Release 3: website

Preconditions: release 2 verified. The site branch no longer appends notes to `service`; it relies on the new
function storing `notes`. Shipping the site before the function would lose notes.

Steps:

1. Build from `claude/shyld-rebuild` (`npm run build`), upload per `docs/DEPLOY.md`, keep the previous
   `public_html` copy for rollback.
2. Controlled production tests from the live site itself:
   * Home page form, consent unchecked, labelled name. Expect success message; row with `sms_consent false`.
   * Text us page, consent checked, labelled name. Expect success; row with `sms_consent true` and
     `sms_consent_version text-us-2026-09-29`; `smsSent false`.
   * Confirm both emails in the inbox, then delete both rows.
3. Crawl the live site for the 26 sitemap URLs and the redirects (`npm run crawl` against the live host).
4. Rollback: restore the previous `public_html` copy per `docs/DEPLOY.md`.

## Required access and open confirmations

1. Vercel: environment variable name read on project `shyld-ai-agents` (currently 403), or owner confirmation
   of which names exist in Production.
2. Supabase: confirmation of the backup plan in the dashboard (not visible through the connection used here).
3. Owner confirmation that `jesse@parkerconstructioncompany.com` is the intended lead inbox.
4. Authorization to run release 1, then 2, then 3, each gated on the previous verification.

## What stays off

`SMS_AUTOMATION_ENABLED` remains unset through all three releases. Enabling it is a separate decision after
release 2 verification and after the Twilio configuration is confirmed by name.

## Execution log, 2026-09-29

* Release 1 applied at 12:18 UTC as migration `20260929121829 consent_and_idempotency`. Backup of the two
  existing rows and the schema was taken first and kept outside the repository. Verified: rows intact, five
  columns, unique index, policy unchanged, anon insert on new columns, duplicate `request_id` returns 409
  through PostgREST, old function still accepted a lead. Test rows deleted.
* Release 2 merged as `f028e0f`; production deployment `dpl_AUL2HaFadiDKe23MXEZSirfAerW5` (previous, for rollback:
  `dpl_FwjBZoD4uqpT5xYBk3CfXXHVXwyD`). Production tests A, B, C, D, immediate retry, retry after 11 minutes
  (database path), and two simultaneous requests all behaved as specified. Consent stored, notes stored,
  four delivered emails, none for duplicates, all in the inbox. SMS: `automation_disabled` on affirmative
  consent, `no_consent` otherwise. Test rows deleted; the table holds the two original leads.
* Release 3 not published. Owner chose a dedicated SHYLD sending domain. `shyldroofing.com` was created in
  Resend (id `2334759b-1d5f-45dc-b52a-ad928d94be7e`) and its four records were added at Hostinger with
  `overwrite=false`: TXT `resend._domainkey`, MX and TXT on `send`, CNAME `rsend`. Root A, AAAA, MX, SPF,
  DMARC, mailbox DKIM, www, ftp, autoconfig, autodiscover, and nameservers are unchanged. All four resolve at
  Cloudflare and Google resolvers. Resend still reports `pending` after two verification triggers.
* Blocked: the Vercel connector cannot read or write environment variables (403 on list and create), so
  `NOTIFY_EMAIL=shyldroofing@gmail.com` cannot be set from this session. `NOTIFY_FROM` is handled by the
  code default in `jesse8393/shyld-ai-agents` PR #3 (`68be5a2`), which must merge only after the domain is
  verified and `NOTIFY_EMAIL` is set.
* Not changed: FieldHorse configuration, nameservers, root MX, `SMS_AUTOMATION_ENABLED` (still unset).
