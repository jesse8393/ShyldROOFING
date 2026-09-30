# Release artifacts, 2026-09-30

Archives for publishing the rebuilt shyldroofing.com and for rolling it back. Instructions live in
`docs/HANDOFF-PUBLISH.md` on the `claude/shyld-rebuild` branch.

* `site-97b286c.zip`: the complete new site (300 files) built from `claude/shyld-rebuild` at commit `97b286c`.
  Extract its contents into `public_html`.
* `rollback-live-site-2026-09-29.zip`: mirror of the site that was live on 2026-09-29, including its `.htaccess`.
  Extract into `public_html` to restore the previous site.
* `CHECKSUMS.txt`: sha256 for both archives.

This branch holds only these files. It is not meant to be merged.
