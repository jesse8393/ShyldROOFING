# SHYLD Roofing website

Marketing site for SHYLD Roofing, Middle Tennessee. Static site built with Astro and deployed as flat files to
Hostinger `public_html`.

```
npm ci
npm run build      # dist/
npm run preview    # http://localhost:4321
```

Documentation:

- `docs/DEPLOY.md` build, deploy, and roll back
- `docs/MIGRATION.md` every old URL and where it goes
- `docs/INTEGRATIONS.md` lead intake contract and analytics events
- `docs/CONTENT-GUIDE.md` how to edit copy, photos, areas, and services
- `docs/UNRESOLVED-FACTS.md` business facts still waiting on the owner
- `docs/QA-REPORT.md` audit results with tool versions and conditions

Structure:

```
src/data/          business facts, services, areas, projects, FAQs, legal text
src/layouts/       Base.astro (head, schema, header, footer, sticky bar)
src/components/    page sections and the inquiry form
src/pages/         one file per route; roofing-[city].astro generates the 14 area pages
src/scripts/       form delivery, attribution, click tracking, scroll accents
src/styles/        design tokens and global styles
public/            .htaccess, robots.txt, fonts, brand SVGs, icons, share image
scripts/           preview server, crawl, screenshots, Lighthouse, form tests, a11y checks
qa/                generated reports and screenshots
```
