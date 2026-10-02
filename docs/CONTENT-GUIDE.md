# Content maintenance

Everything editable lives in `src/data`. Layouts and components do not need to change for routine updates.

| Want to change | Edit |
| --- | --- |
| Phone, email, hours, legal name, city | `src/data/business.ts` |
| Service list, form options, navigation, sitemap dates | `src/data/business.ts` |
| Service page copy, FAQs, options, exclusions, warranty wording | `src/data/service-content.ts` |
| City page copy, common needs, nearby links, FAQs | `src/data/location-content.ts` |
| Project photos and captions | `src/data/projects.ts` plus a photo in `src/assets/photos/` |
| Homepage FAQs | `src/data/faqs.ts` |
| Privacy and terms text | `src/data/legal/privacy.html`, `src/data/legal/terms.html` |
| Homepage section copy (hero, process, trust) | `src/components/Hero.astro`, `Process.astro`, `Trust.astro` |
| Articles | `src/pages/roof-replacement-cost-middle-tennessee.astro`, `roof-storm-damage-insurance-tennessee.astro` |

## Adding a project

1. Put the photo in `src/assets/photos/` (JPEG, up to 2880px on the long edge at quality 92, under 2 MB).
2. Add an entry to `src/data/projects.ts` with a slug, title, summary, alt text, service, and one or two paragraphs.
   Describe only what the photo shows. Add the city only when the owner confirms it.
3. Import the photo in `src/pages/projects.astro` and add it to the `images` map.
4. Rebuild.

## Adding a service area

1. Add the town to `areas` in `src/data/business.ts`.
2. Add a full entry to `src/data/location-content.ts`. Write at least three paragraphs that would not make sense if
   the city name were swapped. Real neighbourhoods, real housing stock, real distance from Murfreesboro.
3. Add the town to `areaServed` in `src/layouts/Base.astro`.
4. Rebuild. The route `/roofing-<slug>` and the sitemap entry are generated.

## Writing rules

Typography: one family, Plus Jakarta Sans. h1 and h2 use weight 650 with slight negative tracking; every other
heading, title, and label uses weight 600. Headline text is upright, never italic. Write headlines for meaning
first; do not cut words only to save a line.

No dashes in visible copy. No fake reviews, counts, years, or awards. No response time promises.
No insurance deadline statements. Say what SHYLD actually does. Update the matching date in `contentDates`
when a page changes materially so the sitemap `lastmod` stays honest.

## Photos

Real job photos only. Source photos live in `src/assets/photos/` and are stored at up to 2880 px on the long
edge (never upscaled from a smaller original), JPEG quality 92 with mozjpeg, metadata stripped, under 2 MB each.
That keeps the repository reasonable while 2x displays get full detail. When a sharper original of an existing
photo turns up, replace the file under the same name at those settings; never swap in a different photograph.

Crops such as `src/assets/photos/crops/hero-wide.jpg` and `hero-tall.jpg` are produced by
`node scripts/photo-crops.mjs` from the sources. Each crop rectangle is written against the width the photo had
when the crop was framed (`ref`), and the script scales the rectangle to the source's real size, so a larger
replacement source yields the same framing at higher resolution. Rerun the script after replacing any source.
The social share image and icons come from `node scripts/brand-assets.mjs`. Astro converts every photo to AVIF
and WebP at several widths during the build and never upscales.
