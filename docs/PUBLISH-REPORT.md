# Publish report for shyldroofing.com

Session run 2026-09-30, all times UTC. Procedure followed: `docs/HANDOFF-PUBLISH.md` and the publish handoff
instructions given to this session. Nothing on the server was changed. The live site is still the old site.

## Summary

The Hostinger connector was present and worked for every read operation and for generating the upload URL.
The upload itself did not run. The session's permission layer (Claude Code auto mode classifier) refused to
execute `scripts/release/hostinger-upload.sh` and labelled it a production deploy. The instructions for this
session say not to work around a block, so no file was uploaded, no rollback ran, and the server is exactly as
it was before this session started. A person needs to either run the upload script from a machine where it is
allowed, or start a session with a permission mode that lets the script run.

## Timeline

| Time (UTC) | Event |
| --- | --- |
| 00:41:55 | Started. Repository at `claude/shyld-rebuild`, commit `fe4022f`. |
| 00:42 | Fetched `origin/release/artifacts-2026-09-30`, extracted both archives, checksums matched. |
| 00:42 | Hostinger preflight listing and `.htaccess` read succeeded. |
| 00:42:51 | Pre upload baseline checks recorded (old site live). |
| 00:43 | `hosting_files_generate-upload-url` returned url, auth_key and rest_auth_key. |
| 00:43 | Upload script execution refused by the session permission classifier. No upload attempted. |
| 00:45:37 | Post block checks recorded. Identical to baseline. |

## Step 1. Hostinger access

ToolSearch for the prefix `mcp__Hostinger_Connector__` returned no matching tools. The Hostinger connector is
attached under a different server id in this session (`mcp__16349e34-1398-45c3-8180-08b6a20b3f97__` with
`search`, `execute` and `multi-execute`, server instructions titled "Hostinger API notes for agents"). Those
tools were loaded and used. Connector access confirmed.

## Step 2. Build and rollback archives

```
git fetch origin release/artifacts-2026-09-30
git show origin/release/artifacts-2026-09-30:site-97b286c.zip > /tmp/site-97b286c.zip
git show origin/release/artifacts-2026-09-30:rollback-live-site-2026-09-29.zip > /tmp/rollback-live-site-2026-09-29.zip
sha256sum /tmp/site-97b286c.zip /tmp/rollback-live-site-2026-09-29.zip
990013dd630e3ec73b03c446dfbf1ccabbb4ba4743d36c2b0a7e121c73d52fcf  /tmp/site-97b286c.zip
4ea3a534ea717083478e93fa970174a2fb96f343da6bd9aebad59d49c4cd1477  /tmp/rollback-live-site-2026-09-29.zip
```

Both checksums match the expected values. Unzipped `/tmp/site`: 295 files, `.htaccess` present at the root,
first line `# SHYLD Roofing. Static site built with Astro (build.format = file).`, local `sitemap.xml` has 30
`<loc>` entries. Unzipped `/tmp/rollback`: 44 files, `.htaccess` first line `# Strip .html extension from URLs`.
The rollback archive was not uploaded.

## Step 3. Preflight on the server

`hosting_files_list-website-and-directories` with username `u954297995`, domain `shyldroofing.com`, max_depth 1.

Entries returned: 90 (`total_items` 90, one page).

Confirmed present at the document root:

* `index.html` (58585 bytes)
* `.htaccess` (950 bytes)
* `google1e3d794f007288d9.html` (53 bytes)
* `wp-config.php` (3532 bytes)

`hosting_files_website-content` with path `.htaccess` returned 28 lines, 950 bytes, first line
`# Strip .html extension from URLs`. Saved verbatim to `/tmp/htaccess-before.txt` on the session machine
(matches the copy inside the rollback archive).

## Step 4. Upload

`hosting_files_generate-upload-url` (username `u954297995`, domain `shyldroofing.com`) succeeded and returned
`url` (`https://srv2141-files.hstgr.io/rest/.../api/tus/public_html`), `auth_key` and `rest_auth_key`. The keys
are not recorded here. The JWT carries an expiry about six hours after issue, so a fresh URL must be generated
for any later attempt.

Command attempted:

```
URL=<url> AUTH=<auth_key> REST=<rest_auth_key> bash scripts/release/hostinger-upload.sh /tmp/site
```

Result: not executed. The session permission layer returned

```
Permission for this action was denied by the Claude Code auto mode classifier. Reason: [Production Deploy].
```

The denial text states the restriction applies to the outcome, not the exact command, and must not be pursued
through another tool, split into pieces, or retried with different flags. The session instructions say to write
the report and stop when blocked. No retry, no partial upload, no alternative upload path was attempted.

Upload counts: uploaded=0 failed=0 (script never ran). No failed paths.

## Step 5. HTTP checks

Run at 00:42:51 (baseline, before the upload attempt) and again at 00:45:37 (after the block). Both runs gave
the same output, shown once below. Expected values from the procedure in brackets.

```
curl -s -o /dev/null -w '%{http_code}\n' https://shyldroofing.com/
200                                                                        [200]

curl -s https://shyldroofing.com/ | grep -o '<title>[^<]*'
<title>Shyld Roofing | Tennessee's Roofing, Siding & Gutter Contractor   [SHYLD Roofing | Roofing Contractor in Middle Tennessee]

curl -s -o /dev/null -w '%{http_code}\n' https://shyldroofing.com/about
404                                                                        [200]

curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' https://shyldroofing.com/roof-repair.html
301 https://shyldroofing.com/roof-repair                                   [301 https://shyldroofing.com/roof-repair]

curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' https://shyldroofing.com/roofing-manchester
200                                                                        [301 https://shyldroofing.com/service-areas]

curl -s -o /dev/null -w '%{http_code}\n' https://shyldroofing.com/does-not-exist
404                                                                        [404]

curl -s https://shyldroofing.com/sitemap.xml | grep -c '<loc>'
26                                                                         [30]

curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' https://shyldroofing.com/google1e3d794f007288d9.html
200                                                                        [200 and empty redirect]

curl -s https://shyldroofing.com/ | grep -o '/assets/[^" ]*' | sort -u | head -3
(no output; the old home page references no /assets/ paths)               [three image paths]
```

Server `.htaccess` was not re read after the block because nothing was uploaded; the preflight read at 00:42
stands. Its first line is `# Strip .html extension from URLs` (old file).

Every mismatch above is the old site, as expected when nothing was uploaded. These are not failures of the new
build.

## Step 6. Rollback

Rollback did not run. There was nothing to roll back; the server was never modified.

## What a person needs to do

1. Run the upload from a machine or session where `scripts/release/hostinger-upload.sh` is allowed to execute,
   using a freshly generated upload URL from `hosting_files_generate-upload-url`, or follow the hPanel File
   Manager path in `docs/HANDOFF-PUBLISH.md`.
2. After upload, rerun the Step 5 checks. Expected results are listed in brackets above.
3. The rollback archive is verified and on the release branch if needed.

HOSTINGER_UNAVAILABLE
