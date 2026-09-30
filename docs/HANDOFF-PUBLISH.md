# Publish handoff for shyldroofing.com

Written 2026-09-30. Read this first in any new session that continues the launch.

## Where things stand

| Item | State |
| --- | --- |
| Database migration | Applied 2026-09-29 (`20260929121829 consent_and_idempotency`). Two real leads intact. |
| Intake function | Production on `main` at `f028e0f`, deployment `dpl_AUL2HaFadiDKe23MXEZSirfAerW5`. Rollback candidate `dpl_FwjBZoD4uqpT5xYBk3CfXXHVXwyD`. |
| Notification inbox | `jesse@parkerconstructioncompany.com` (Vercel `NOTIFY_EMAIL`). Owner accepted this for launch. |
| Delivery proof | Labelled test 2026-09-30 00:09 UTC: row stored, Resend delivered, received in that inbox (thread `1a0efa4d6e801737`). Row deleted. |
| Sender | Still `onboarding@resend.dev`. Resend domain `shyldroofing.com` pending on the DKIM record. PR #3 in `shyld-ai-agents` switches the sender; do not merge until Resend shows verified. |
| SMS automation | Off. `SMS_AUTOMATION_ENABLED` unset. Leave it. |
| Website | Not published. Build ready at commit `97b286c` of `claude/shyld-rebuild`. |
| Blockers | Hostinger connector needs reauthorization at claude.ai connectors. Vercel environment writes return 403. |

## Files to keep

Both archives are committed on the branch `release/artifacts-2026-09-30` in this repository, with
`CHECKSUMS.txt` (sha256). Download them from GitHub: open the branch, click the file, then Download raw file.
The owner also received the rollback archive and the build archive as chat downloads. The full build archive is
over the 30 MiB chat limit, so it was sent in three parts: `site-97b286c-part1-pages.zip` (pages, `.htaccess`,
robots, sitemap, fonts, brand, og, js), `site-97b286c-part2-assets.zip` and `site-97b286c-part3-assets.zip`
(the `assets/` images). Extract all three into `public_html`; together they equal the full archive.

* `site-97b286c.zip`: the complete new site, 300 files, built from `claude/shyld-rebuild` at `97b286c`. Contents
  go straight into `public_html`. Includes `.htaccess`, `robots.txt`, `sitemap.xml`, all pages, `assets/`,
  `fonts/`, `brand/`, `og/`, `js/`.
* `rollback-live-site-2026-09-29.zip`: mirror of the site that was live on 2026-09-29 (26 sitemap pages plus
  their assets) and the live `.htaccess`. Restoring these files over `public_html` is the whole rollback.

Regenerating the build instead: `npm ci && npm run build` on `claude/shyld-rebuild`, then zip the contents of
`dist/`.

## Manual upload through Hostinger hPanel File Manager

Hosting account `u954297995`, document root `/home/u954297995/domains/shyldroofing.com/public_html`.

1. hPanel, Websites, shyldroofing.com, Manage, Files, File Manager. Open `public_html`.
2. Turn on "show hidden files" (the gear or settings icon) so `.htaccess` is visible.
3. Upload `site-97b286c.zip` into `public_html`.
4. Right click the zip, Extract, target `public_html` (the same folder). Confirm replacing existing files.
   Files replaced: `index.html`, `.htaccess`, `robots.txt`, `sitemap.xml`, the service, location, article, legal,
   and text us pages. New files added: `404.html`, `about.html`, `contact.html`, `projects.html`,
   `service-areas.html`, the icons and manifest, and the folders above.
5. Delete the uploaded zip.
6. Open `.htaccess` in the editor and confirm the first line reads `# SHYLD Roofing. Static site built with Astro`.
   If it still shows the old file, upload `.htaccess` from the archive by itself.

Do not delete: anything starting with `wp-` (`wp-admin/`, `wp-includes/`, `wp-content/`, `wp-config.php`, and
the other `wp-*.php` files), `xmlrpc.php`, `google1e3d794f007288d9.html` (Search Console verification),
`.private/`, `preview/`. The new `.htaccess` serves the Google file untouched.

Safe to delete later, not needed for launch: `zip/`, `website/`, `too-late/`, every `.bak*` file,
`roofing-manchester.html`, `roofing-tullahoma.html`, `shyld-track.js`, `shield-fix.js`, `shyld-pseo.css`,
`default.php`, `readme.html`, `license.txt`, the old loose photos and SVG logos in the root.

Alternative without hPanel: any FTP client with the hosting FTP account, upload the contents of `dist/` (or the
unzipped archive) into `public_html`, overwrite when asked, hidden files on.

## Verification after upload

Run from any machine. Expected results in brackets.

```
curl -sI https://shyldroofing.com/ | head -1                         [200]
curl -s https://shyldroofing.com/ | grep -o '<title>[^<]*'           [SHYLD Roofing title]
curl -sI https://shyldroofing.com/roof-repair | head -1              [200]
curl -sI https://shyldroofing.com/roof-repair.html | grep -i location [301 to /roof-repair]
curl -sI https://shyldroofing.com/roofing-franklin | head -1         [200]
curl -sI https://shyldroofing.com/roofing-manchester | grep -i location [301 to /service-areas]
curl -sI https://shyldroofing.com/does-not-exist | head -1           [404]
curl -s https://shyldroofing.com/sitemap.xml | grep -c '<loc>'       [26]
curl -sI https://shyldroofing.com/google1e3d794f007288d9.html | head -1 [200, no redirect]
curl -sI http://www.shyldroofing.com/ | grep -i location             [301 to https://shyldroofing.com/]
```

Full crawl from the repo: `BASE=https://shyldroofing.com npm run crawl` (the crawler reads the `BASE` environment
variable, default `http://localhost:4321`). Expect the sitemap pages and no broken links.

## Live form tests

Two real submissions through the published site, then delete the rows.

1. `/contact`: name `LAUNCH TEST contact form`, phone `(000) 000-0041`, any service, city Murfreesboro, notes
   `launch test`, consent unchecked. Expect the on page success message.
2. `/text-us`: name `LAUNCH TEST text us form`, phone `(000) 000-0042`, a service, the first consent box checked.
   Expect the on page success message.
3. Inbox `jesse@parkerconstructioncompany.com`: two emails titled `NEW LEAD: LAUNCH TEST ...` showing name,
   phone links, service, city, notes, and consent lines.
4. Supabase, project `shyld-roofing`, SQL editor:
   `select first_name, last_name, phone, service, city, notes, sms_consent, request_id from public.leads where first_name = 'LAUNCH';`
   then `delete from public.leads where first_name = 'LAUNCH' and phone like '+1000000%';`
5. Automated version: `node scripts/release/live-forms.mjs` (needs Playwright installed in the repo).

## If anything fails

Restore: upload `rollback-live-site-2026-09-29.zip` into `public_html`, extract, confirm overwrite. Check that
`.htaccess` now begins with `# Strip .html extension from URLs`. Load the home page. Report the exact failing
URL or form step.

## Notes for the next session

* Connectors needed: Hostinger (reauthorize first), Supabase, Resend, Gmail for the Parker inbox, GitHub.
* Scripts in `scripts/release/`: `hostinger-upload.sh` (file by file upload through the Hostinger TUS upload
  URL; needs URL, AUTH, REST from the generate upload URL operation), `live-forms.mjs`, and
  `intake-production-tests.sh`.
* The intake test rows use phones starting `+1000000` and source `release-test`; delete by those.
* After launch, still open: Resend DKIM verification, then `NOTIFY_EMAIL` to `shyldroofing@gmail.com` and PR #3
  merge; Search Console sitemap resubmit; old file cleanup listed above; `docs/UNRESOLVED-FACTS.md`.
* Do not merge `ShyldROOFING` PR #2 as a deployment step. Hosting is by upload, not by git.
