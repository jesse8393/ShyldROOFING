# Publish handoff for shyldroofing.com

Written 2026-09-30 and revised the same day after an independent review. Read this first in any session that
continues the launch.

## Where things stand

| Item | State |
| --- | --- |
| Database migration | Applied 2026-09-29 (`20260929121829 consent_and_idempotency`). Two real leads intact. |
| Intake function | `jesse8393/shyld-ai-agents`, `main` at `f028e0f`, production deployment `dpl_AUL2HaFadiDKe23MXEZSirfAerW5`. Rollback candidate `dpl_FwjBZoD4uqpT5xYBk3CfXXHVXwyD`. |
| Notification inbox | `jesse@parkerconstructioncompany.com` (Vercel `NOTIFY_EMAIL`). The owner accepted this for launch. |
| Delivery proof | Labelled test 2026-09-30 00:09 UTC, recorded in `docs/DELIVERY-EVIDENCE.md`: row stored, Resend delivered, received in that inbox (thread `1a0efa4d6e801737`). Row deleted. |
| Sender | Still `onboarding@resend.dev`. Resend domain `shyldroofing.com` pending on the DKIM record. PR #3 in `shyld-ai-agents` switches the sender; do not merge until Resend shows verified and `NOTIFY_EMAIL` has been decided. |
| SMS automation | Off. `SMS_AUTOMATION_ENABLED` unset. Leave it. |
| Website | Not published. Build ready at commit `97b286c` of `claude/shyld-rebuild` in `jesse8393/ShyldROOFING`. Later commits on that branch changed only docs and scripts. |
| Blockers | Hostinger connector needs reauthorization at claude.ai connectors. Vercel environment writes return 403. |

## Files to keep

Everything below is committed on the branch `release/artifacts-2026-09-30` of `jesse8393/ShyldROOFING`, together
with `CHECKSUMS.txt` (sha256). The owner also received the same files as chat downloads.

* `site-97b286c.zip`: the complete new site, 295 files in total: the root files (`.htaccess`, `robots.txt`,
  `sitemap.xml`, `site.webmanifest`, icons, all pages) plus `assets/`, `brand/`, `fonts/`, `og/`, and an empty
  `js/` folder (an extract may not create it; that is fine). Its contents go straight into `public_html`.
* `site-97b286c-part1-pages.zip`, `site-97b286c-part2-assets.zip`, `site-97b286c-part3-assets.zip`: the same
  files split in three (part 1 holds the root files and the small folders, parts 2 and 3 hold `assets/`), for
  uploads that refuse the single 31 MiB file. Extracted together they equal the full archive.
* `rollback-live-site-2026-09-29.zip`: the site that was live before launch, 44 files: the 28 old pages under
  their server names (26 sitemap pages plus `roofing-manchester.html` and `roofing-tullahoma.html`), the six old
  photos (`gutters-photo.jpg`, `metal-roofing-photo.jpg`, `roof-repair-photo.jpg`, `roof-replacement-photo.jpg`,
  `siding-photo.jpg`, `silhouette-hero.png`), the five old logos (`primary-logo-dark-no-tagline.svg`,
  `shield-emblem.svg`, `shyld-primary-black.svg`, `shyld-primary-white.svg`, `shyld-shield-black.svg`),
  `shyld-track.js`, `.htaccess`, `robots.txt`, `sitemap.xml`, and `google1e3d794f007288d9.html`.
  Page links were left as served (not rewritten). It was captured over HTTP, so anything the pages do not
  reference (for example `shyld-pseo.css`, `shield-fix.js`, `default.php`, the `.bak` files) is not in it; those
  files stay on the server because this launch deletes nothing.

Getting the files: on GitHub open the branch, click a file, Download raw file. From a clone:
`git fetch origin release/artifacts-2026-09-30 && git show origin/release/artifacts-2026-09-30:site-97b286c.zip > site-97b286c.zip`.

Regenerating the build instead: on `claude/shyld-rebuild`, `npm ci && npm run build`, then
`cd dist && zip -r ../site-<commit>.zip .` (run from inside `dist` so files sit at the archive root and the
hidden `.htaccess` is included; check with `unzip -l ../site-<commit>.zip | grep htaccess`).

## Step 0, before touching hPanel

1. Download `site-97b286c.zip`, `rollback-live-site-2026-09-29.zip`, and `CHECKSUMS.txt`. Run
   `sha256sum --ignore-missing -c CHECKSUMS.txt` (macOS: `shasum -a 256 --ignore-missing -c CHECKSUMS.txt`).
   Expect `rollback-live-site-2026-09-29.zip: OK` and `site-97b286c.zip: OK` and exit code 0. Without the
   ignore missing flag the three part files you did not download print FAILED; that is only noise.
2. In hPanel File Manager, download the current `.htaccess`, `robots.txt`, `sitemap.xml`, and
   `google1e3d794f007288d9.html` from `public_html` to your computer. If `.htaccess` is not listed, first enable
   hidden files (Upload step 2). Optional: create a fresh backup of the site in hPanel (expected under Files,
   Backups). The hPanel wording in this step is from memory; see the note at the top of the Upload section.
3. Do not continue until the rollback archive is on your computer and its checksum said OK.

## Upload through Hostinger hPanel File Manager

Hosting account `u954297995`, document root `/home/u954297995/domains/shyldroofing.com/public_html`. File
Manager may show that path relative to the account root as `domains/shyldroofing.com/public_html`; either way
the destination must end in `public_html`. Everything said here about hPanel (menu names, hidden files, the
extract dialog, overwrite prompts, the upload size limit, renaming a dotfile, backups, whether an FTP account
exists) is written from memory and could not be verified from this repository; step 6 and the verification
section catch a wrong outcome.

1. In hPanel open the hosting management for shyldroofing.com and find File Manager (expected under Files).
   If it opens at the account root, go to `domains/shyldroofing.com/public_html`.
2. If `.htaccess` is not listed, open the File Manager settings (gear icon) and enable showing hidden files.
   This only changes what is displayed.
3. Upload `site-97b286c.zip` into `public_html`. If the upload is refused for size or stalls, upload the three
   part files instead and treat each one exactly like step 4, then delete all three.
4. Right click the zip and choose Extract. Make sure the destination is `public_html` itself, not a new folder
   named after the zip. If asked about existing files, choose replace. If not asked, the files were replaced
   silently; step 6 verifies. If a folder named after the zip appears afterwards (`site-97b286c/`, or
   `site-97b286c-part1-pages/` and so on for the parts), the files landed in a subfolder: move its contents up
   one level, then delete the empty folder.
5. Delete the uploaded zip.
6. Open `.htaccess` in the editor. The first line must begin with `# SHYLD Roofing. Static site built with Astro`.
   If it begins with `# Strip .html extension from URLs`, the old file is still there: select all, paste the full
   contents of `public/.htaccess` from the repository (identical to the archive copy), save. Alternative: on your
   computer rename a copy of the file to `htaccess.txt`, upload it, then rename it to `.htaccess` in File Manager.

Files replaced by the extract: `index.html`, `.htaccess`, `robots.txt`, `sitemap.xml`, and the service,
location, article, legal, and text us pages that share a name with the old ones. Files added: `404.html`,
`about.html`, `contact.html`, `projects.html`, `service-areas.html`, `site.webmanifest`, `apple-touch-icon.png`,
`favicon-32.png`, `favicon.ico`, `icon-192.png`, `icon-512.png`, and the folders `assets/`, `brand/`, `fonts/`,
`js/`, `og/`.

Nothing is deleted during this launch. `docs/DEPLOY.md` step 5 defers to this section for the never delete,
keep, and cleanup lists.

Never delete: anything starting with `wp-` (`wp-admin/`, `wp-includes/`, `wp-content/`, `wp-config.php`, the
other `wp-*.php` files), `xmlrpc.php`, `readme.html` and `license.txt` (WordPress core files, remove only with
the rest of WordPress), `google1e3d794f007288d9.html` (Search Console verification; the new `.htaccess` serves it
untouched), `.private/`, `preview/`.

Keep until the launch is accepted and rollback is no longer wanted, because the old pages load them by name
(all of them are inside the rollback archive): `shyld-track.js`, `gutters-photo.jpg`, `metal-roofing-photo.jpg`,
`roof-repair-photo.jpg`, `roof-replacement-photo.jpg`, `siding-photo.jpg`, `silhouette-hero.png`,
`primary-logo-dark-no-tagline.svg`, `shield-emblem.svg`, `shyld-primary-black.svg`, `shyld-primary-white.svg`,
`shyld-shield-black.svg`.

Cleanup for later, after acceptance (observed in the `public_html` listing on 2026-09-29): `zip/`, `website/`,
`too-late/`, every `.bak*` file, `roofing-manchester.html`, `roofing-tullahoma.html`, `default.php`,
`shyld-pseo.css`, `shield-fix.js`, `primary-logo-light-no-tagline.svg`, `shyld-shield-gold.svg`,
`roof-replacement.webp`, `roofing-photo.jpg`, `sitemap-backup-20260608.xml`, and the files in the keep list
above.

Alternative without hPanel: any FTP client with the hosting FTP account, upload the contents of `dist/` (or the
unzipped archive) into `public_html`, overwrite when asked, hidden files on.

## Verification after upload

Run from any machine. Expected results in brackets.

```
curl -s -o /dev/null -w '%{http_code}\n' https://shyldroofing.com/                          [200]
curl -s https://shyldroofing.com/ | grep -o '<title>[^<]*'      [<title>SHYLD Roofing | Roofing Contractor in Middle Tennessee]
curl -s -o /dev/null -w '%{http_code}\n' https://shyldroofing.com/about                     [200; this page did not exist before]
curl -s -o /dev/null -w '%{http_code}\n' https://shyldroofing.com/roof-repair               [200]
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' https://shyldroofing.com/roof-repair.html   [301 https://shyldroofing.com/roof-repair]
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' https://shyldroofing.com/roof-repair/       [301 https://shyldroofing.com/roof-repair; was 200 before]
curl -s -o /dev/null -w '%{http_code}\n' https://shyldroofing.com/roofing-franklin          [200]
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' https://shyldroofing.com/roofing-manchester [301 https://shyldroofing.com/service-areas]
curl -s -o /dev/null -w '%{http_code}\n' https://shyldroofing.com/does-not-exist            [404]
curl -s https://shyldroofing.com/sitemap.xml | grep -c '<loc>'                              [30; 26 means the old sitemap.xml is still served, re-upload it]
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' https://shyldroofing.com/google1e3d794f007288d9.html [200 and no redirect]
curl -sL -o /dev/null -w '%{url_effective}\n' http://www.shyldroofing.com/                  [https://shyldroofing.com/]
curl -s https://shyldroofing.com/ | grep -o '/assets/[^" ]*\.\(avif\|webp\|jpg\)' | sort -u | head -3   [three image paths; then curl -sI each: 200 with content type image/avif, image/webp, or image/jpeg]
```

Full crawl from the repo: `BASE=https://shyldroofing.com npm run crawl` (the crawler reads the `BASE` environment
variable, default `http://localhost:4321`). Expect the last lines `Crawled 30 pages, checked <n> assets.` and
`No problems found.` A `Problems:` list or exit code 1 is a failure; paste it into the report. The crawler does
not test the manchester or Google file redirects; the curl lines above do.

## Live form tests

Two real submissions through the published site, then delete the rows.

1. `/contact`: name `LAUNCH TEST contact form`, phone `+10000000041`, any service, city Murfreesboro, notes
   `launch test`, consent unchecked. Expect the on page success message. (The form accepts 10 digits or 11
   digits starting with 1; the intake stores the number as `+10000000041`.)
2. `/text-us`: name `LAUNCH TEST text us form`, phone `+10000000042`, a service, the first consent box checked.
   Expect the on page success message.
3. Inbox `jesse@parkerconstructioncompany.com`: two emails titled `NEW LEAD: LAUNCH TEST ...` showing name,
   phone links, service, city, notes, and the consent lines.
4. Supabase, project `shyld-roofing`, SQL editor:
   `select first_name, last_name, phone, service, city, notes, sms_consent, source, request_id from public.leads where first_name = 'LAUNCH';`
   then `delete from public.leads where first_name = 'LAUNCH' and phone like '+1000000004%';`
   Website form rows carry source `shyldroofing.com form` or `shyldroofing.com/text-us`; rows from
   `scripts/release/intake-production-tests.sh` carry source `release-test` and phones `+1000000001x`.
5. Automated version: `node scripts/release/live-forms.mjs` after `npm ci` and `npx playwright install chromium`
   (or set `CHROME_PATH` to a Chromium binary). It submits exactly the names and phones above and prints each
   intake JSON response plus whether the success panel appeared.

## If anything fails

Restore: upload `rollback-live-site-2026-09-29.zip` into `public_html`, extract into `public_html` itself, choose
replace. Apply the same safeguards as Upload step 4: if a `rollback-live-site-2026-09-29/` folder appears, move
its contents up one level and delete it. It puts back `.htaccess`, `robots.txt`, `sitemap.xml`, the 28 old
pages, `shyld-track.js`, and the old photos and logos. If `.htaccess` still begins with `# SHYLD Roofing`, unzip
the rollback archive on your computer, open its `.htaccess`, and paste its content over the server file in the
editor. Then delete the files that exist only in the new site: `404.html`, `about.html`, `contact.html`,
`projects.html`, `service-areas.html`, `site.webmanifest`, `apple-touch-icon.png`, `favicon-32.png`,
`favicon.ico`, `icon-192.png`, `icon-512.png`, and the folders `assets/`, `brand/`, `fonts/`, `js/`, `og/`.
Confirm `.htaccess` now begins with `# Strip .html extension from URLs`, load the home page, and check
`curl -s https://shyldroofing.com/sitemap.xml | grep -c '<loc>'` returns 26. Report the exact failing URL or
form step.

## Notes for the next session

* Connectors needed: Hostinger (reauthorize first), Supabase, Resend, Gmail for the Parker inbox, GitHub.
* Scripts in `scripts/release/`:
  `hostinger-upload.sh DIST_DIR`, run as `URL=... AUTH=... REST=... scripts/release/hostinger-upload.sh /home/user/ShyldROOFING/dist`
  with the three values from the Hostinger operation `hosting_files_generate-upload-url` (file by file upload
  through the TUS upload URL, keeps every other server file);
  `live-forms.mjs` (above); `intake-production-tests.sh` (labelled requests straight to the intake).
* The email switch order in `docs/INTEGRATIONS.md` (Resend domain verified, then `NOTIFY_EMAIL`, then PR #3
  merged, then one controlled inquiry) is a post launch task: publish first with `NOTIFY_EMAIL` unchanged.
  `docs/INTEGRATIONS.md` carries the same 2026-09-30 note.
* After launch, still open: Resend DKIM verification, then `NOTIFY_EMAIL` to `shyldroofing@gmail.com` and PR #3
  merge; Search Console sitemap resubmit; the cleanup list above; `docs/UNRESOLVED-FACTS.md`.
* Do not merge `ShyldROOFING` PR #2 as a deployment step. Hosting is by upload, not by git.
