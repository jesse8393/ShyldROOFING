# QA report

Date: September 29, 2026. Everything below was measured on the production build (`npm run build`) served by
`scripts/serve.mjs`, which applies the same clean URL, redirect, and compression rules as the Hostinger `.htaccess`.
Raw Lighthouse JSON reports for the homepage runs and the per template log are in `qa/lighthouse/final/`.
Screenshots at 360, 390, 430, 768, 1024, and 1440 pixels for five templates are in `qa/screenshots/final/`.

## Conditions

| Item | Value |
| --- | --- |
| Lighthouse | 13.5.0 via the Node API |
| Browser | Headless Chromium 141 (Playwright bundle) |
| Mobile preset | Lighthouse default: 412 x 823 at 1.75x, simulated slow 4G (150 ms RTT, 1.6 Mbps), 4x CPU slowdown |
| Desktop preset | 1350 x 940, 40 ms RTT, 10 Mbps, no CPU slowdown |
| Server | Local preview with brotli compression, no CDN |
| Machine | 4 vCPU cloud container. Absolute timings will differ on Hostinger; scores are comparable |

## Homepage, median of three runs

| Preset | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT | Transfer |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Mobile | 99 | 100 | 100 | 100 | 2.03 s | 0 | 0 ms | 296 KB |
| Desktop | 100 | 100 | 100 | 100 | 0.51 s | 0 | 0 ms | 241 KB |

Individual mobile runs each scored 99 for performance with LCP between 1.96 and 2.11 seconds. Earlier runs on the same build without the preload hint scored 99, 99, and 100 with LCP between 1.74 and 1.81 seconds, so the difference is run to run noise. The only
remaining performance audits below full marks are the LCP and FCP timings themselves under simulated slow 4G,
plus two informational insights (a 45 ms forced reflow from the sticky header script and an image delivery
suggestion for the hero on mobile, which already ships as a 640 to 960 px AVIF).

## Every other template, one run each

| Route | Mobile P / A / BP / SEO | Mobile LCP | Desktop P / A / BP / SEO | Desktop LCP |
| --- | --- | --- | --- | --- |
| /roof-replacement | 100 / 100 / 100 / 100 | 1.66 s | 100 / 100 / 100 / 100 | 0.47 s |
| /roofing-franklin | 100 / 100 / 100 / 100 | 1.82 s | 100 / 100 / 100 / 100 | 0.43 s |
| /projects | 100 / 100 / 100 / 100 | 1.81 s | 100 / 100 / 100 / 100 | 0.43 s |
| /about | 100 / 100 / 100 / 100 | 1.66 s | 100 / 100 / 100 / 100 | 0.41 s |
| /contact | 100 / 100 / 100 / 100 | 1.33 s | 100 / 100 / 100 / 100 | 0.34 s |
| /text-us | 100 / 100 / 100 / 100 | 1.36 s | 100 / 100 / 100 / 100 | 0.35 s |
| /roof-replacement-cost-middle-tennessee | 100 / 100 / 100 / 100 | 1.31 s | 100 / 100 / 100 / 100 | 0.36 s |
| /privacy | 100 / 100 / 100 / 100 | 1.27 s | 100 / 100 / 100 / 100 | 0.33 s |

CLS was 0 and total blocking time 0 ms on every run.

## Transfer budgets (homepage, mobile, brotli)

| Budget | Target | Measured |
| --- | --- | --- |
| Initial page | under 1 MB | 296 KB total |
| JavaScript | under 100 KB | 7 KB external plus small inline component scripts |
| Hero image, mobile | under 250 KB | 640 px AVIF about 40 KB, 960 px about 67 KB |
| Hero image, desktop | under 500 KB | 1280 px AVIF 114 KB, 1920 px 161 KB |
| Critical CSS | under 50 KB | Inlined per page, about 17 KB of the 17 KB brotli HTML for the homepage |

## Field data

There is no field data yet. Core Web Vitals at the 75th percentile can only be read from Chrome UX Report or
Search Console after the site has been live with enough traffic. Lighthouse lab numbers do not establish INP.
Recommendation: connect Search Console, then review the Core Web Vitals report after 28 days of traffic.

## Crawl

`npm run crawl` on the build: 30 HTML pages and 137 assets checked. Every page has one h1, a title of 70
characters or fewer, a description between 70 and 160 characters, and an absolute self referencing canonical.
No dashes in visible markup, no exposed implementation comments, no broken internal links or assets.
`/roof-repair.html`, `/roof-repair/`, and `/index.html` redirect once to the clean URL. Unknown paths return 404.

## Forms

`npm run test:form` runs 11 Playwright scenarios with the intake endpoint intercepted, all passing:
accepted request, declined consent, client validation with error summary focus, server rejection keeps values,
backend 500 with phone fallback, offline then retry, timeout not shown as success and retry reuses the request id,
double click sends one request, honeypot forwarded, keyboard tab order, and the text sign up consent flags.

Live delivery: one labelled test request was posted to the production intake endpoint from an allowed origin.
The service returned `{ ok: true }`, the row appeared in the Supabase `leads` table with the expected fields,
`smsSent` was false (no customer message was triggered), and the row was then deleted. The notification email
to the owner inbox was not inspected from this session.

## Accessibility

`node scripts/a11y.mjs`: axe-core 4.10.3 (WCAG 2.2 AA plus best practice rules) reports no violations on 11
templates. Additional checks passed: no horizontal overflow at 360, 390, or 430 px on any route; no overflow at
the equivalent of 200 percent browser zoom; mobile menu opens with Enter, moves focus inside, closes on Escape,
and returns focus; reduced motion leaves every element fully visible and static; the page and forms work with
JavaScript disabled.

Manual review performed by reading the rendered pages: visible focus rings on every control, skip link, one
primary heading per page, landmarks (header, nav, main, footer), labels on every field with required and
optional marked in text, error messages tied to fields with `aria-describedby`, live region for submission
status, 44 px minimum touch targets on buttons, links, and menu items, and the sticky mobile bar hides while a
form or the footer is on screen. Colour pairings were checked against the tokens: ink on paper 14.5:1, muted text
on paper 6.4:1, dark gold labels on paper 5.6:1, ink on gold buttons 7.6:1, gold on ink 7.6:1.

Automated scores never replace a review with a screen reader on a real phone. That has not been done and is
recommended before launch.

## Known limitations

* Five job photos arrived after the audits above and were added to the homepage hero, projects, and service and
  area pages. The homepage was re audited afterwards; see the addendum at the end of this file.

* After the audits above, three CSS only changes were made and verified with the crawl, accessibility, and
  overflow checks but not re audited with Lighthouse: the hero photo width at 1024 px, the header phone label
  between 1000 and 1200 px, and the hero caption width. None of them changes what loads.

* Lighthouse was run locally, not on Hostinger. Server response time and compression on the host may differ.
* The sticky header script produces a small forced reflow warning. It does not affect scores.
* Google rich results eligibility is not claimed. Structured data is valid JSON-LD but was not run through
  Google's tester from this session.

## Addendum: homepage after the second photo batch

Same conditions as above, September 29, 2026, three runs each. The homepage hero, project proof, service page
heroes, and area page hero now use the new job photos. The raw reports in `qa/lighthouse/final/` are from these runs.

| Preset | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT | Transfer |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Mobile | 99 | 100 | 100 | 100 | 1.96 s | 0 | 0 ms | 204 KB |
| Desktop | 100 | 100 | 100 | 100 | 0.51 s | 0 | 0 ms | 210 KB |

Mobile performance runs scored 99, 99, and 99 with LCP between 1.81 and 1.96 seconds. Page weight dropped
because the new hero source is smaller than the metal roof aerial. Crawl and accessibility checks were re run
and pass.
