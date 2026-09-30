# Publish report for shyldroofing.com

Session run 2026-09-30, all times UTC. Procedure: `docs/HANDOFF-PUBLISH.md` plus the publish handoff instructions
given to this session. The site owner (jesse@parkerconstructioncompany.com) authorized the production deployment
in this session after the first attempt was refused by the session permission layer.

Live website: https://shyldroofing.com/

## Summary

The new site (build `97b286c`, archive `site-97b286c.zip`) is live on Hostinger. All 295 files landed in
`public_html`, every fetchable file was verified byte for byte against the live server, the full crawl found no
problems, both live forms stored a lead and produced a notification email to jesse@parkerconstructioncompany.com,
and SMS automation stayed off. Nothing was deleted or renamed on the server. WordPress files and the Google
Search Console verification file are untouched. No rollback was needed. DNS, Vercel, Resend, Supabase and email
settings were not changed.

## Timeline

| Time (UTC) | Event |
| --- | --- |
| 00:41:55 | Started. Repository at `claude/shyld-rebuild`, commit `fe4022f`. |
| 00:42 | Fetched `origin/release/artifacts-2026-09-30`, extracted both archives, checksums matched. |
| 00:42 | Hostinger preflight listing and `.htaccess` read succeeded. Old `.htaccess` saved. |
| 00:42:51 | Baseline checks recorded (old site live: old title, `/about` 404, sitemap 26). |
| 00:43 | First upload attempt refused by the session permission classifier ("Production Deploy"). Stopped, wrote a block report, pushed it. |
| 01:04 | Owner authorized the deployment in this session. Fresh upload URL generated. Server copies of `.htaccess`, `robots.txt`, `sitemap.xml`, `google1e3d794f007288d9.html` saved before any write. |
| 01:05:16 to 01:08:10 | `scripts/release/hostinger-upload.sh /tmp/site` ran. Every file uploaded (see Step 4 for the counter caveat). |
| 01:08 to 01:11 | Server `.htaccess` re read (new file). Every one of the 294 fetchable files verified by sha256 against the live site: 294 match, 0 mismatch. |
| 01:11:44 | HTTP checks run: all expected values observed. |
| 01:12:53 | `BASE=https://shyldroofing.com npm run crawl`: 30 pages, 245 assets, no problems. |
| 01:15:12 to 01:15:30 | Live form tests: `/contact` and `/text-us` both saved and emailed. |
| 01:15 to 01:20 | Rows confirmed in Supabase, notification emails confirmed in Resend (delivered) and Gmail. Test rows deleted. |

## Step 1. Hostinger access

The connector was present (tool prefix `mcp__Hostinger_Connector__` after the servers reconnected; earlier in the
session it appeared under an opaque server id). `search`, `execute` and `multi-execute` worked throughout.

## Step 2. Build and rollback archives

```
git fetch origin release/artifacts-2026-09-30
git show origin/release/artifacts-2026-09-30:site-97b286c.zip > /tmp/site-97b286c.zip
git show origin/release/artifacts-2026-09-30:rollback-live-site-2026-09-29.zip > /tmp/rollback-live-site-2026-09-29.zip
sha256sum /tmp/site-97b286c.zip /tmp/rollback-live-site-2026-09-29.zip
990013dd630e3ec73b03c446dfbf1ccabbb4ba4743d36c2b0a7e121c73d52fcf  /tmp/site-97b286c.zip
4ea3a534ea717083478e93fa970174a2fb96f343da6bd9aebad59d49c4cd1477  /tmp/rollback-live-site-2026-09-29.zip
```

Both checksums match. `/tmp/site`: 295 files (294 regular files plus `.htaccess`; the `js/` folder in the
archive is empty). `/tmp/rollback`: 44 files. The rollback archive was not uploaded and remains on the
`release/artifacts-2026-09-30` branch.

## Step 3. Preflight on the server (before upload)

`hosting_files_list-website-and-directories`, username `u954297995`, domain `shyldroofing.com`, max_depth 1:
90 entries (78 files, 12 directories).

Confirmed present: `index.html` (58585 bytes), `.htaccess` (950 bytes), `google1e3d794f007288d9.html` (53 bytes),
`wp-config.php` (3532 bytes).

Server `.htaccess` read with `hosting_files_website-content`: 28 lines, first line
`# Strip .html extension from URLs`. Saved to `/tmp/htaccess-before.txt`; identical to the copy in the rollback
archive. Server `robots.txt`, `sitemap.xml` (26 `<loc>` entries) and the Google file were also saved before the
upload; the Google file is identical to the rollback archive copy.

## Step 4. Upload

`hosting_files_generate-upload-url` returned `url`, `auth_key`, `rest_auth_key` (not recorded here; they expire
about six hours after issue). Command:

```
URL=<url> AUTH=<auth_key> REST=<rest_auth_key> bash scripts/release/hostinger-upload.sh /tmp/site
```

Started 01:05:16, finished 01:08:10. Script output: `uploaded=0 failed=295`, every line reading
`<path> PATCH offset= size=<n>`. That counter is wrong, not the transfer. This machine reaches the internet
through a local HTTPS proxy, and curl's `%{http_header_json}` captured the proxy's `HTTP/1.1 200 Connection
Established` header block instead of the final `HTTP/2 204` response, so the `upload-offset` header parsed as
empty. A manual POST and PATCH for `site.webmanifest` with `curl -i` showed `HTTP/2 201` then `HTTP/2 204` with
`upload-offset: 323` (the file size). No POST failed (0 lines with `POST` in the log). The script was not rerun;
the verification below is stronger than the counter.

Verification of every file (01:08 to 01:11): for each of the 294 fetchable files in `/tmp/site`, sha256 of the
local file compared with sha256 of the body served by `https://shyldroofing.com/<path>` (html pages fetched at
their clean URL). Result: `verified_match=294 mismatch=0`. The 295th file, `.htaccess`, was read through the
connector: 79 lines, 3066 bytes, first line
`# SHYLD Roofing. Static site built with Astro (build.format = file).`

Effective upload counts: uploaded=295 failed=0. No failed paths.

Server listing after upload: 105 entries (93 files, 12 directories; `js/` was empty in the archive so no folder
was created). Still present and unchanged in size: `wp-config.php` 3532, `google1e3d794f007288d9.html` 53, all
`wp-*.php`, `wp-admin/`, `wp-includes/`, `wp-content/`, `xmlrpc.php`, `readme.html`, `license.txt`, `.private/`,
`preview/`, every `.bak*` file, the old photos, logos, `shyld-track.js`, `shyld-pseo.css`, `shield-fix.js`,
`roofing-manchester.html`, `roofing-tullahoma.html`, `default.php`. Replaced: `index.html` (now 85532), `.htaccess`
(3066), `robots.txt` (192), `sitemap.xml` (5283) and the pages sharing a name with old ones. Added: `404.html`,
`about.html`, `contact.html`, `projects.html`, `service-areas.html`, `site.webmanifest`, icons, `assets/`,
`brand/`, `fonts/`, `og/`.

## Step 5. HTTP checks (01:11:44, after upload)

Expected values in brackets.

```
curl -s -o /dev/null -w '%{http_code}\n' https://shyldroofing.com/
200                                                                        [200]

curl -s https://shyldroofing.com/ | grep -o '<title>[^<]*'
<title>SHYLD Roofing | Roofing Contractor in Middle Tennessee            [same]

curl -s -o /dev/null -w '%{http_code}\n' https://shyldroofing.com/about
200                                                                        [200]

curl -s -o /dev/null -w '%{http_code}\n' https://shyldroofing.com/roof-repair
200                                                                        [200]

curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' https://shyldroofing.com/roof-repair.html
301 https://shyldroofing.com/roof-repair                                   [same]

curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' https://shyldroofing.com/roof-repair/
301 https://shyldroofing.com/roof-repair                                   [same]

curl -s -o /dev/null -w '%{http_code}\n' https://shyldroofing.com/roofing-franklin
200                                                                        [200]

curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' https://shyldroofing.com/roofing-manchester
301 https://shyldroofing.com/service-areas                                 [same]

curl -s -o /dev/null -w '%{http_code}\n' https://shyldroofing.com/does-not-exist
404                                                                        [404]

curl -s https://shyldroofing.com/sitemap.xml | grep -c '<loc>'
30                                                                         [30]

curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' https://shyldroofing.com/google1e3d794f007288d9.html
200                                                                        [200, empty redirect]
body: google-site-verification: google1e3d794f007288d9.html

curl -sL -o /dev/null -w '%{url_effective}\n' http://www.shyldroofing.com/
https://shyldroofing.com/                                                  [same]

curl -s https://shyldroofing.com/ | grep -o '/assets/[^" ]*' | sort -u | head -3   then curl -sI each
/assets/Base.astro_astro_type_script_index_0_lang.CI7pOfax.js         HTTP/2 200  application/x-javascript
/assets/InquiryForm.astro_astro_type_script_index_0_lang.ljHbIahp.js  HTTP/2 200  application/x-javascript
/assets/farmhouse-replacement-in-progress.B-2PAPU2_1Bx50Y.avif        HTTP/2 200  image/avif
(the first three paths alphabetically are two scripts and one image; the crawl below checked all 245 assets)

/contact 200, /text-us 200, /service-areas 200, /projects 200
robots.txt: User-agent: * / Allow: / / Disallow: /preview/ /too-late/ /website/ /zip/ /wp-admin/ /wp-includes/ / Sitemap: https://shyldroofing.com/sitemap.xml
/wp-login.php 200 (WordPress files untouched)
```

Server `.htaccess` after upload, via `hosting_files_website-content`: first line
`# SHYLD Roofing. Static site built with Astro (build.format = file).`

Full crawl (01:12:53), `BASE=https://shyldroofing.com npm run crawl`:

```
/sitemap.xml -> 200
/robots.txt -> 200
/does-not-exist-xyz -> 404
/roof-repair.html -> 301 https://shyldroofing.com/roof-repair
/roof-repair/ -> 301 https://shyldroofing.com/roof-repair
/index.html -> 301 https://shyldroofing.com/
Crawled 30 pages, checked 245 assets.
No problems found.
exit=0
```

## Step 6. Rollback

Not run. Home page 200 with the new title, `/about` 200, sitemap 30. Rollback archive remains available.

## Live form tests (01:15:12 to 01:15:30)

`node scripts/release/live-forms.mjs` against the published site (real submissions, no interception). The first
attempt failed inside Chromium with `ERR_CERT_AUTHORITY_INVALID` because this machine's outbound proxy CA was
not in Chromium's certificate store; the CA bundle was imported into the local NSS store and the script rerun.
That is a property of this session machine, not of the website.

Intake responses captured from the page's own POST to the intake function:

| Form | Name | Phone | ok | dbSaved | consentStored | emailSent | smsSent | smsSkipped | success panel |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/contact` | LAUNCH TEST contact form | +10000000041 | true | true | true | true | false | no_consent | shown |
| `/text-us` | LAUNCH TEST text us form | +10000000042 | true | true | true | true | false | automation_disabled | shown |

`smsSkipped: automation_disabled` on the consented submission confirms SMS automation is still off.

Supabase, project `shyld-roofing` (`aohvafsyxohrknwbvpgg`), before cleanup:

| first_name | last_name | phone | service | city | sms_consent | source | request_id | created_at |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LAUNCH | TEST contact form | +10000000041 | Free Roof Inspection | Murfreesboro | false | shyldroofing.com form | c94ff6d8-8253-4be5-bbe7-f15ace065918 | 2026-09-30 01:15:18 |
| LAUNCH | TEST text us form | +10000000042 | Free Roof Inspection | null | true | shyldroofing.com/text-us | 5cda14f2-565d-4198-8dd4-3150eac55a3b | 2026-09-30 01:15:25 |

Cleanup: `delete from public.leads where first_name = 'LAUNCH' and phone like '+1000000004%'` returned the two
rows above. The two real leads mentioned in the handoff were not touched.

## Email delivery evidence

Recipient unchanged: jesse@parkerconstructioncompany.com. Sender still `onboarding@resend.dev` (Shyld Leads).

Resend (`list-emails`, `get-email`):

| Subject | Status | Sent (UTC) | Resend ID | Message ID |
| --- | --- | --- | --- | --- |
| NEW LEAD: LAUNCH TEST contact form, Free Roof Inspection | delivered | 2026-09-30 01:15:18 | 01a0efe1-5a3b-719b-9e10-b0ded99dfe40 | <010001a0efe15b6d-dba5ee6b-5f59-489e-a879-0efdf5f1c10b-000000@email.amazonses.com> |
| NEW LEAD: LAUNCH TEST text us form, Free Roof Inspection | delivered | 2026-09-30 01:15:25 | 01a0efe1-7496-762d-9701-cb23b1a11be6 | <010001a0efe175c1-25ca66fd-2d65-4652-bbbb-3f58e9822c38-000000@email.amazonses.com> |

Gmail inbox of jesse@parkerconstructioncompany.com:

* Contact form email: received, thread `1a0efe15de57973d`, dated 2026-09-30T01:15:18Z, labels INBOX, UNREAD.
  Body shows the name, sms and tel links for +10000000041, Needs: Free Roof Inspection, Notes with the launch
  test stamp, City Murfreesboro, "Text consent: No", request_id c94ff6d8..., Source: shyldroofing.com form.
* Text us email: CORRECTION. Verified facts only. Resend recorded the message as delivered at 01:15:25. Gmail API searches from this session (subject, phone number, `in:anywhere`, and the exact `rfc822msgid`) at 01:16, 01:17, 01:18, 01:33 and 02:06 returned no result. A direct thread read of Gmail message id 1a0efe178d5c0dda returned "The caller does not have permission". The owner reports that the message is in the Gmail Spam folder under that id. This session did not establish why its searches did not return the message; earlier wording that called it missing, and later wording that said the connector cannot read Spam, both went beyond the evidence and are withdrawn. Inbox placement for these notifications needs attention. Verifying the shyldroofing.com domain in Resend and sending from it may improve deliverability, but it cannot guarantee Inbox placement.

## Settings left alone

* NOTIFY_EMAIL on Vercel: unchanged (jesse@parkerconstructioncompany.com).
* SMS_AUTOMATION_ENABLED: unset (confirmed by `smsSkipped: automation_disabled`).
* Resend sender and domain, DNS, Supabase schema: unchanged.
* No pull request merged; no branch other than `claude/publish-report` pushed.

## Still open after launch (from the handoff, unchanged)

Resend DKIM verification, then the sender switch and NOTIFY_EMAIL decision (PR #3 in `shyld-ai-agents`);
Search Console sitemap resubmit; the server cleanup list in `docs/HANDOFF-PUBLISH.md`; `docs/UNRESOLVED-FACTS.md`.


## Second publish, refinement build (2026-09-30)

Owner authorized publishing the refinements. Deployed commit d2623c5 on claude/shyld-rebuild, which contains the
refinement commit c274758 (typography, headlines, positioning copy, contact layout, sharper photos). Fresh build,
not the earlier archive: site-d2623c5.zip, 295 files, sha256 5773354eef2fe4e94b043eee9967e66d58acb2324561852837805319869a7a46.

Backup before upload: every live file that the upload would overwrite was downloaded (166 files plus .htaccess),
zipped as backup-live-20260930T105620Z.zip, sha256 fa4db74966c9dd01c188bf62389b3ff00752da24e9799af4faa3d6e67d52f0d9.
All 31 live pages matched the 97b286c build byte for byte, so the full 97b286c build is also a valid rollback set.

Upload 11:01 to 11:04 UTC, assets first then pages: uploaded=295 failed=0 (offset confirmed per file). Nothing deleted.

Verification 11:04 to 11:30 UTC:

| Check | Result |
| --- | --- |
| Live files matching the build by sha256 | 294 of 294, .htaccess read through connector unchanged |
| Home, About, Contact | 200; h1s "Roofing worth coming home to.", "Meet Jesse and SHYLD.", "Call, text, or send the form." |
| Typography | h1 Fraunces 64px at 1440; Fraunces italic no longer referenced |
| Contact form top edge | 325px desktop (was 693), 283px phone (was 579) |
| Redirects | /roof-repair.html 301, /roofing-manchester 301 to /service-areas, www to apex, 404 page 404 |
| Google verification file, WordPress files | 200 and present, untouched |
| Sitemap | 30 URLs |
| Crawl of live site | 30 pages, 246 assets, no problems |
| /contact form | saved, email sent, SMS skipped (no consent), success panel shown |
| /text-us form | saved, email sent, SMS skipped (automation_disabled), success panel shown |
| Resend | both delivered 11:27:03 and 11:27:09 to jesse@parkerconstructioncompany.com |
| Gmail placement | contact form email found in INBOX (message 1a0f2116ee187c35); the text us email was not returned by this session's Gmail searches, placement not verified by this session |
| Test rows | both deleted from public.leads |

Rollback: not needed. Unchanged: NOTIFY_EMAIL routing, SMS automation off, DNS, Vercel, Resend, Supabase schema.

Still open: home hero photo remains soft; its original is likely among three Drive files over 7 MB that the
connector cannot download (dji_fly_20260514_162152_127, dji_fly_20260514_162134_126, dji_fly_20250709_105318_5).
Inbox placement for the text us notification (see correction above). A branded sender may help but cannot guarantee Inbox placement.

PUBLISH_OK
