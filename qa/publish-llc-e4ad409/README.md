# Legal name publish, commit e4ad409

Owner confirmation, October 2, 2026: SHYLD Roofing LLC is the registered legal entity.

## Source changes (e4ad409, branch claude/jakarta-preview)

| File | Change |
| --- | --- |
| src/data/business.ts | legalName SHYLD Roofing LLC; trade name and name change note removed; sitemap dates for About, Privacy, Terms, Text Us 2026-10-02 |
| src/components/Footer.astro | footer legal line shows SHYLD Roofing LLC (every page) |
| src/layouts/Base.astro | structured data uses legalName SHYLD Roofing LLC instead of alternateName Parker HVAC LLC (every page) |
| src/pages/about.astro | Trade name row removed; Legal entity shows SHYLD Roofing LLC |
| src/data/legal/privacy.html, terms.html | operator identified as SHYLD Roofing LLC; trade name and name change sentences removed; contact block SHYLD Roofing LLC; brand casing SHYLD Roofing |
| src/pages/privacy.astro, terms.astro | Last updated October 2, 2026 |
| src/pages/text-us.astro | consent labels and program disclosure name SHYLD Roofing LLC; consent version text-us-2026-10-02; disclosures otherwise unchanged |

Not added: state of organization, license, insurance, address changes. Contact form consent text and version unchanged.

## Checks before upload

Build 31 pages; astro check 0 errors, 0 warnings, 3 hints; outdated entity terms in build 0; local crawl 30 pages,
245 assets, no problems; accessibility suite on /, /about, /privacy, /terms, /text-us, /contact all passed.

## Backup and upload

* Changed versus live: 31 pages and sitemap.xml. No assets changed.
* Backup 2026-10-02 01:28 UTC: those 32 live files (identical to the previous publish) plus .htaccess (4,009 bytes),
  `backup-live-20261002T012816Z.zip`, sha256 18282f36682d563096a53ace58129d6f7b1b7e69560db752b4e861db3093c439, committed to
  release/artifacts-2026-09-30.
* Upload 02:06:57 to 02:07:17 UTC: 32 uploaded, 0 failed. .htaccess not uploaded; still 4,009 bytes with the LiteSpeed block.
* Rollback: unzip the backup, remove .htaccess from the folder, upload the folder with scripts/release/hostinger-upload.sh.

## Live verification

See live-checks.txt. 294 of 294 built files match live by sha256. 30 sitemap URLs return 200 and the 404 page 404.
Outdated entity references (parker, hvac, trade name, name change; case insensitive) across all 31 pages: 0.
SHYLD Roofing LLC appears on 31 of 31 pages. Structured data legalName SHYLD Roofing LLC, no alternateName.
Retired phone hits 0. Redirects, Google verification file, WordPress, robots unchanged.

## Form tests, 02:09 UTC

| | Contact form | Text Us form (new consent version) |
| --- | --- | --- |
| Intake | ok, saved, consent stored, email sent, SMS skipped (no consent) | ok, saved, consent stored, email sent, SMS skipped (automation disabled) |
| Success panel | shown | shown |
| Resend | delivered 02:09:52 | delivered 02:09:59 |
| Gmail read by this session | INBOX, message 1a0fa6008d231451 | not returned by this session's searches; placement not verified |

## Not completed

Test rows were not removed. The delete statement timed out in the database tool three times across two publishes.
Remaining test rows (all first_name LAUNCH); the two genuine leads are untouched:

```sql
delete from public.leads where first_name = 'LAUNCH' and id in (
  '1969896b-587a-4a67-9b70-056c6497d9ba','18bd6732-456e-4bec-a472-cdc09816bd07',
  '2162c511-262f-4bb1-b218-18fbca9f556c','6e41837e-107e-4aae-8119-1e80c90794bb');
```
