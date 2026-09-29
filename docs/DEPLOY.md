# Build, deploy, and roll back

## Requirements

Node 22.19 or newer. Dependencies are pinned in `package-lock.json`.

```
npm ci
npm run build        # writes the whole site to dist/
npm run preview      # serves dist/ at http://localhost:4321 with the same URL rules as the host
npm run check        # Astro and TypeScript diagnostics
npm run crawl        # link, title, canonical, and asset check against the preview server
npm run test:form    # form behaviour tests with the intake endpoint intercepted
npm run lighthouse   # node scripts/lighthouse.mjs 3 /  (runs, routes)
npm run screenshots  # ROUTES=/,/contact WIDTHS=390,1440 node scripts/screenshots.mjs
```

## Hosting

Hostinger shared hosting, LiteSpeed, account `u954297995`, document root
`/home/u954297995/domains/shyldroofing.com/public_html`.
The build is plain HTML, CSS, JavaScript, fonts, and images. No server runtime is needed.

`dist/.htaccess` is part of the build and handles https, non www, clean URLs, `.html` redirects,
trailing slash removal, the two retired city page redirects, the 404 page, compression, and caching.

## Deploy steps

1. `npm ci && npm run build`
2. Run the checks above and confirm the crawl reports no problems.
3. Back up `public_html` first. Hostinger hPanel has a File Manager and backups. At minimum download the
   current `.htaccess`, `sitemap.xml`, and the HTML files.
4. Upload the contents of `dist/` into `public_html`, replacing the existing HTML files, `.htaccess`, `robots.txt`,
   and `sitemap.xml`. Upload the `assets/`, `fonts/`, `brand/`, `og/`, and `js/` folders.
   Either drag the files through hPanel File Manager, use FTP, or zip `dist/` and use hPanel's extract.
5. Delete the old copies of the site in `public_html`: the `zip/`, `website/`, and `too-late/` folders,
   the `.bak*` files, `roofing-manchester.html`, `roofing-tullahoma.html`, and `shyld-track.js`.
   The WordPress files (`wp-*`, `wp-includes/`, `wp-config.php`, `xmlrpc.php`) were already present before this rebuild
   and are not used by the site. Decide with the owner whether to remove them; they are an attack surface if left.
6. Load `https://shyldroofing.com/`, `/roof-repair`, `/roof-repair.html` (expect a redirect), `/roofing-franklin`,
   `/does-not-exist` (expect the 404 page), and `/sitemap.xml`.
7. Submit a test request through the form with a clearly labelled test name and confirm it appears in the
   Supabase `leads` table and the notification email. See `INTEGRATIONS.md`.
8. In Google Search Console, resubmit `https://shyldroofing.com/sitemap.xml` and inspect the homepage and one service page.

## Roll back

Restore the backed up files from step 3 over `public_html`. Because the old site was also static HTML with the
same `.htaccess` conventions, restoring the files is the whole rollback. No database or DNS is involved.
The git history on `main` also contains the mirror of the live site taken on May 26, 2026 (commit `7200663`).

## Preview without touching production

`robots.txt` already disallows `/preview/`. To host a preview on the same account, build with a base path:

```
ASTRO_BASE=/preview npm run build
```

is not configured by default; the simplest safe preview is to run `npm run preview` locally or deploy `dist/`
to any static host (Netlify, Vercel, Cloudflare Pages) under a temporary domain with the same `.htaccess` rules
replaced by that host's clean URL setting.
