# Route migration map

Every URL from the live site on September 28, 2026 and where it goes in the rebuild.
Clean URLs were already canonical on the live site through `.htaccess`; the rebuild keeps them.
`.html` addresses redirect permanently to the clean URL, as before.

| Live URL | Rebuild | Status |
| --- | --- | --- |
| `/` | `/` | Kept, rebuilt |
| `/roof-replacement` | `/roof-replacement` | Kept, rewritten |
| `/roof-repair` | `/roof-repair` | Kept, rewritten |
| `/metal-roofing` | `/metal-roofing` | Kept, rewritten |
| `/storm-restoration` | `/storm-restoration` | Kept, rewritten as storm damage assessment |
| `/siding` | `/siding` | Kept, rewritten |
| `/gutters` | `/gutters` | Kept, rewritten |
| `/roofing-murfreesboro` and the other 13 city pages | same | Kept, rewritten with city specific content |
| `/roof-replacement-cost-middle-tennessee` | same | Kept, rewritten without price ranges or insurance deadline claims |
| `/roof-storm-damage-insurance-tennessee` | same | Kept, rewritten without carrier deadline claims |
| `/text-us` | `/text-us` | Kept, form now delivers to the intake service |
| `/privacy` | `/privacy` | Kept, text unchanged |
| `/terms` | `/terms` | Kept, text unchanged |
| `/roofing-manchester` | `301` to `/service-areas` | Never in the sitemap; owner should confirm whether Manchester is served |
| `/roofing-tullahoma` | `301` to `/service-areas` | Same as above |
| `/index.html`, `/index` | `301` to `/` | Previously `/index.html` redirected to `/index`, which was wrong |
| `/anything/` (trailing slash) | `301` to `/anything` | Previously served a duplicate 200 |
| `/preview/`, `/too-late/`, `/website/`, `/zip/` | Not shipped | Old copies of the site in public_html. Delete after launch; robots already disallow them |
| `/shyld-track.js` | Replaced | Tracking is now bundled into the site JavaScript |

New pages:

| URL | Purpose |
| --- | --- |
| `/projects` | Documented work with honest captions |
| `/about` | Company, legal identity, how we work |
| `/contact` | Inspection request form and contact details |
| `/service-areas` | Hub for every location page |
| `/404` (served as `404.html`) | Not found page with links |

Sitemap: `/sitemap.xml` is generated at build time from `src/data/business.ts` and lists 26 URLs with `lastmod` dates taken from `contentDates`.
