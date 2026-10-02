# Publish of 2889c91 to shyldroofing.com

Deployed source: branch claude/jakarta-preview, commit 2889c915bbd663de3a631a912e49c59de9c5275c (includes the phone
correction 9462524). Built fresh on 2026-10-02 at 00:02 UTC: 31 pages, 295 files. No older archive was reused.

## Before upload (local build)

| Check | Result |
| --- | --- |
| astro check | 0 errors, 0 warnings, 3 hints |
| Retired number (615) 827 9460 in source, public and build, all formats | 0 |
| Fraunces references in build | 0 |
| Crawl, local preview server | 30 pages, 245 assets, no problems |
| Accessibility suite (axe WCAG 2.2 AA, overflow, zoom, menu, no JS) | all passed |
| Mobile bar keyboard | hidden links unreachable; reachable again when visible |

## Hosting

* Hostinger connector access verified by listing public_html (93 files) at 00:01 UTC.
* Live .htaccess had gained a LiteSpeed Cache plugin block since the last publish (4,009 bytes). The block plus
  the build's 3,066 byte file reconstruct it exactly, so .htaccess was not uploaded and is unchanged.
* Backup: see ROLLBACK.md (286 files plus .htaccess, sha256 0bb34790...56d4d).
* Upload 00:08:28 to 00:11:17 UTC: 262 asset files, then 32 pages and sitemap. 294 uploaded, 0 failed, offsets confirmed.
  Nothing deleted. WordPress files, the Google verification file and unrelated files untouched.

## After upload (live, automated)

| Check | Result |
| --- | --- |
| Every built file vs live by sha256 | 294 of 294 match |
| Cache | about returned `cache-control: no-cache`, no stale copy found |
| Sitemap URLs | 30 of 30 return 200 |
| Redirects | .html, trailing slash, /index.html, manchester, tullahoma, www and http all 301 as expected |
| Missing page | 404 |
| robots.txt | 200, lists the sitemap |
| Google verification file | 200, no redirect, body intact |
| wp-login.php | 200 (WordPress present) |
| Retired number on every live page and the 404 page | 0 hits |
| Phone in structured data, Privacy, Terms | +16152958974, (615) 295 8974 |
| Live crawl | 30 pages, 245 assets, no problems |
| Live accessibility suite | all passed |
| Live mobile bar keyboard | hidden links unreachable; reachable when visible |

Full output in live-checks.txt, live-crawl.txt, live-a11y.txt, live-mobile-bar-keyboard.txt. Screens in screens/.

## Forms and notifications (2026-10-02 00:15 UTC)

Labelled tests: "LAUNCH TEST contact form" (+10000000041) and "LAUNCH TEST text us form" (+10000000042).

| Step | Contact form | Text Us form |
| --- | --- | --- |
| Intake response | ok, saved, email sent, SMS skipped (no consent) | ok, saved, email sent, SMS skipped (automation disabled) |
| Success panel shown | yes | yes |
| Row saved in Supabase | yes, id 1969896b... | yes, id 18bd6732... |
| Resend status | delivered 00:15:57 to jesse@parkerconstructioncompany.com | delivered 00:16:04 to the same address |
| Gmail, read by this session | found, INBOX, UNREAD, message 1a0f9f7be10f67d5 | not returned by `in:anywhere` or `in:spam` searches; placement not verified by this session |

Provider "delivered" means the receiving mail server accepted the message. It does not establish inbox placement.

## Not completed

The two test rows were not deleted: both delete statements timed out in the database tool, and a read afterwards
showed all four rows still present (two genuine leads and the two test rows). Remove only these:

```sql
delete from public.leads where id in ('1969896b-587a-4a67-9b70-056c6497d9ba','18bd6732-456e-4bec-a472-cdc09816bd07');
```
