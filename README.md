# Release artifacts, 2026-09-30

Archives for publishing the rebuilt shyldroofing.com and for rolling it back. Instructions live in
`docs/HANDOFF-PUBLISH.md` on the `claude/shyld-rebuild` branch.

* `site-97b286c.zip`: the complete new site, 295 files in five folders plus the root files, built from
  `claude/shyld-rebuild` at commit `97b286c`. Extract its contents into `public_html`.
* `site-97b286c-part1-pages.zip`, `site-97b286c-part2-assets.zip`, `site-97b286c-part3-assets.zip`: the same
  files split in three for uploads that refuse the single file. Extract all three into `public_html`.
* `rollback-live-site-2026-09-29.zip`: the site that was live before launch, 44 files, including `.htaccess`,
  `robots.txt`, `sitemap.xml`, the Google verification file, `shyld-track.js`, the 28 old pages, and their images.
  Extract into `public_html` to restore the previous site, then remove the files that exist only in the new site
  (listed in the handoff).
* `live-site-mirror-2026-11-26.zip`: a byte for byte download of every file the live site served on 2026-11-26
  (60 sitemap pages plus `404.html`, `robots.txt`, `sitemap.xml`, `favicon.ico`, `site.webmanifest`, and all 248
  referenced assets, 313 files). Saved because the build that was published on 2026-10-09 (60 city pages, Google tag
  `G-ME6GFQ4683`) is not on any branch of this repository; the newest branch, `claude/jakarta-preview`, builds 30 pages.
  The server `.htaccess` and the Google verification file could not be downloaded (403) and are not in this archive.
  Paths inside the archive mirror `public_html`, with clean URLs saved as `<slug>.html`.
* `CHECKSUMS.txt`: sha256 for every archive.

This branch holds only these files. It is not meant to be merged.
