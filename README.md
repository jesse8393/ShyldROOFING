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
* `CHECKSUMS.txt`: sha256 for every archive.

This branch holds only these files. It is not meant to be merged.
