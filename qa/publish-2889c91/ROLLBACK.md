# Rollback for the 2889c91 publish

Backup taken 2026-10-02 00:02 UTC, before any file was replaced.

* Archive: `backup-live-20261002T000216Z.zip`, sha256 `0bb34790d3f02ab2bf8e1695a870cb2ddda0d737bfce31198f89122a5ec56d4d`.
  It holds the 286 live files this publish overwrote (all 31 pages, sitemap.xml, robots.txt, icons, and every
  `assets/` file with the same name) plus the live `.htaccess` (4,009 bytes, including the LiteSpeed Cache block).
  The live build it captures is d2623c5 with no phone fix.
* `.htaccess` was not uploaded in this publish. The live file is unchanged.
* Eight files are new in this publish and did not exist before (new hashed assets). Leaving them in place is harmless.

## To roll back

1. Generate an upload URL with the Hostinger operation `hosting_files_generate-upload-url`
   (username u954297995, domain shyldroofing.com).
2. Unzip the archive to a folder, remove `.htaccess` from that folder, and upload the folder with
   `scripts/release/hostinger-upload.sh <folder>` (URL, AUTH and REST from step 1). Upload `assets/` first, pages last.
3. Check: `curl -s https://shyldroofing.com/about | grep -o '<h1[^>]*>[^<]*'` and the home title. Purge LiteSpeed
   cache in hPanel if old and new pages are mixed.

The archive is committed to branch `release/artifacts-2026-09-30` (commit 968e82b) next to CHECKSUMS.txt.
