# Preview handoff, branch claude/jakarta-preview

Not published. The live site at https://shyldroofing.com still serves the refinement build d2623c5.
Publishing this preview requires the owner's approval.

## What this branch changes

| Commit | Change |
| --- | --- |
| 85fca71 | Plus Jakarta Sans for every heading (h1 and h2 at weight 650), smaller heading scale, Fraunces removed, side by side home hero, headlines rewritten for meaning |
| a957f92 | Defensive and unverified copy removed, cost guide reframed, new service and city headlines, hidden mobile bar removed from keyboard focus, hero image sizes and caption position |
| a4929aa | Cost guide meta description shortened to 131 characters (the crawl flagged 178) |
| e7e562d | About lede reads "personally writes your proposal" instead of assuming the owner's pronouns |

Verification evidence for a4929aa and e7e562d is in `qa/preview-a4929aa/README.md`.

## Claims removed pending confirmation

Removed, not replaced with softer wording. Restore each one once it is confirmed.

| Claim | Where it was | What confirms it |
| --- | --- | --- |
| "Licensed and insured" trust card, and the "Licensing and insurance" row on About | Home trust section, About facts | Tennessee contractor license number and insurance carrier |
| "We work here often" | Franklin | Franklin jobs on record |
| "We have worked within those [review requirements] before" | Franklin | A Franklin HOA or review approval SHYLD completed |
| "We often inspect several streets in a neighborhood in the same week" | Smyrna | Owner confirmation |
| "We can often complete [gable roofs] in a single day" | La Vergne | Owner confirmation |
| "Close by and here often", "serve it regularly", "in the area regularly", "inspect and repair here regularly", "there often" | Nolensville, Spring Hill, Mt. Juliet, Eagleville, Christiana | Jobs on record in each town |
| "We can often get out quickly after weather" | Christiana | Owner confirmation; this also reads as a response time promise, which the writing rules exclude |
| "We see plenty of wind related repair calls" | Rockvale | Owner confirmation |
| "Invent reviews, years in business, or roof counts" | About, "We will not" list | Not a claim; removed as defensive copy |

Kept, because they describe work SHYLD already states elsewhere: free inspections with photos, written proposals
listing materials, per sheet decking price in the proposal, photos of any replaced sheet, written workmanship warranty,
yard protection and daily cleanup, tear off to the deck, the will and will not promises on About.

## Conflicts flagged, left unchanged

1. **Legal name.** The footer, About page and structured data name Parker HVAC LLC, with a note that a change to
   Shyld Roofing LLC has been filed. The Text Us page and the SMS program text name Shyld Roofing LLC.
2. **Phone number resolved.** Owner confirmed the former GHL number is inactive on September 30, 2026. Privacy and Terms now use (615) 295 8974, matching the shared business data, other pages, call links and structured data. Legal page update dates and sitemap dates were refreshed. Production still needs this preview uploaded.
3. **Street address.** Privacy and Terms list 725 Laurel Lane, Murfreesboro. No other page shows a street address.
4. **Text Us page.** It describes promotional, transactional and alert programs, and its success message promises a
   text reply. SMS automation is off. The page and its carrier disclosures are unchanged.

## Outstanding decisions

1. Which legal name the site should show everywhere.
2. Phone number already resolved: (615) 295 8974 throughout this preview. Do not request reconfirmation.
3. Whether 725 Laurel Lane should appear on the site.
4. License number and insurance carrier, to restore the licensed and insured claim.
5. Which city experience claims above are true, to restore them.
6. Whether the Text Us page stays in customer navigation or becomes a registration page only.
7. Approve the side by side hero and this preview for publishing.

## Material still needed

- A sharper original of the home hero photo (likely one of three Drive files over 7 MB the connector cannot download).
- A photo of Jesse for the About page and a short verified biography.
- Two or three documented project stories: city, materials, condition found, work done, result.
- Price examples from real SHYLD jobs with scope, date and exclusions, approved for publishing.
- Google Business Profile link once reviews exist.

## Resumed completion

Phone cleanup and current verification are recorded in `qa/preview-phone-cleanup/README.md`.
Build this branch fresh for publication. Do not reuse the older `site-97b286c.zip` or its rollback procedure.
Back up the currently served site before replacing files; preserve WordPress and the Google verification file.
