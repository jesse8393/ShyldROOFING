# Preview verification evidence

Branch claude/jakarta-preview. Measured commit **a4929aa**. Follow up commit **e7e562d** changes one word in the About
lede ("personally writes your proposal"); only about.html differs between the two builds, so e7e562d was rechecked with
the crawl, the accessibility suite on /about, and About screenshots. Lighthouse was not rerun for e7e562d.

All runs used a local build served by scripts/serve.mjs (same clean URL rules as the live host) on this session's
machine, Chromium 141 headless. Local results do not predict field performance on the live host.

## Automated checks

| Check | Source commit | Time (UTC) | Tool and preset | Result | File |
| --- | --- | --- | --- | --- | --- |
| Type check | a4929aa | 2026-09-30 22:08 | astro check | 0 errors, 0 warnings, 3 hints | astro-check.txt |
| Crawl, 30 sitemap pages | a4929aa | 22:08 | scripts/crawl.mjs, http://localhost:4403 | 245 assets, no problems | crawl.txt |
| Accessibility and responsive | a4929aa | 22:08 | scripts/a11y.mjs: axe WCAG 2.2 AA on 11 routes, overflow at 360 to 1440, 200% zoom, menu keyboard, reduced motion, no JS | all passed | a11y.txt |
| Mobile bar keyboard | a4929aa | 22:09 | Playwright, 390x844, http://localhost:4403/ | hidden: inert, aria-hidden, 0 bar links reached in 40 Tabs; visible again: reachable; bar keeps focus visible until focus leaves | mobile-bar-keyboard.txt |
| Hero crop | a4929aa | 22:09 | Playwright, widths 390, 900, 1024, 1280, 1440 | roof inside frame at every width; 70% of photo width shown on desktop (lawn and driveway trimmed); no upscaling at 1x | hero-crop/ |
| Lighthouse | a4929aa | 22:09:41 to 22:12:38 | Lighthouse 13.5.0, mobile and desktop presets, simulated throttling, 3 runs each, http://localhost:4403 on /, /about, /contact, /roofing-franklin | see medians below | lighthouse/ |
| Crawl | e7e562d | 22:13 | scripts/crawl.mjs, http://localhost:4404 | 245 assets, no problems | crawl-e7e562d.txt |
| Accessibility, /about | e7e562d | 22:13 | scripts/a11y.mjs ROUTES=/about | all passed | a11y-e7e562d-about.txt |

Lighthouse medians (performance, accessibility, best practices, SEO | largest contentful paint, layout shift,
blocking time, transfer):

/ mobile: perf 99 a11y 100 bp 100 seo 100 | LCP 2108ms CLS 0 TBT 0ms 236KB
/ desktop: perf 100 a11y 100 bp 100 seo 100 | LCP 505ms CLS 0 TBT 0ms 207KB
/about mobile: perf 100 a11y 100 bp 100 seo 100 | LCP 1657ms CLS 0 TBT 0ms 87KB
/about desktop: perf 100 a11y 100 bp 100 seo 100 | LCP 390ms CLS 0 TBT 0ms 103KB
/contact mobile: perf 100 a11y 100 bp 100 seo 100 | LCP 1211ms CLS 0 TBT 0ms 42KB
/contact desktop: perf 100 a11y 100 bp 100 seo 100 | LCP 331ms CLS 0 TBT 0ms 43KB
/roofing-franklin mobile: perf 100 a11y 100 bp 100 seo 100 | LCP 1509ms CLS 0 TBT 0ms 80KB
/roofing-franklin desktop: perf 100 a11y 100 bp 100 seo 100 | LCP 372ms CLS 0 TBT 0ms 92KB

## Visual review (by eye, not automated)

Screenshots in screens/: before = live https://shyldroofing.com at 2026-09-30T22:09:23Z,
after = preview. Home, About, Contact, Franklin at 1440x900 and 390x844. About after images are from e7e562d.
Reviewed: heading weight and size read firm without looking heavy; side by side hero shows the full roof; caption no
longer covers the house; Franklin headline wraps to 2 lines on desktop and 3 on phones; no clipped text or overlap
seen. Found and fixed during review: a gendered pronoun in the About lede (e7e562d). Known limit: the hero source
is 1320 px wide, so it is soft on high density screens.
