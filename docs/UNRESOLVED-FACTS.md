# Unresolved business facts

Each item below is either shown on the site with careful wording or left off the site until the owner confirms it.
Nothing here was invented to fill a section.

| Fact | What the site does today | What is needed |
| --- | --- | --- |
| Legal entity name | Privacy and terms say Parker HVAC LLC with a name change to Shyld Roofing LLC in process. The text sign up page and its schema say Shyld Roofing LLC, matching the live page updated in June 2026. | Confirm which name is current with the Secretary of State and the A2P registration, then make all three agree. |
| Street address in legal pages | `725 Laurel Lane, Murfreesboro` appears in the privacy policy and terms contact blocks, carried over unchanged. It is not shown anywhere else and not in schema. | Confirm the owner wants a residential address published. If not, replace with city and state only in `src/data/legal/*.html`. |
| Second phone number `(615) 827 9460` | Not shown anywhere except the privacy and terms contact blocks, which were preserved verbatim. All other pages use `(615) 295 8974`, matching the June 2026 live homepage. The intake service environment example still lists 827 9460 as the SMS number. | Confirm whether 827 9460 still rings anywhere. If it does not, update the legal pages. If it does, decide which number is the public text number. |
| Public email | `shyldroofing@gmail.com` everywhere. `info@shyldroofing.com` from the old service pages was dropped because nothing verified it is monitored. | Confirm, or set up and verify the custom domain address and switch `business.email`. |
| Free inspections | Offered throughout, matching the live site and the intake text templates. | Confirm this is still the policy. |
| Inspection response window | The old site promised 24 to 48 hours and a reply within the hour. The rebuild promises no time window. | If the owner wants a stated window, provide one that is met every week. |
| Written workmanship warranty | Stated everywhere as "term stated in your proposal". | Provide the actual term, for example two years, so it can be stated on the site. |
| Licensed and insured | Stated in the trust section, about page, and footer, carried from the live site. | Provide the Tennessee contractor license number and insurance carrier so the claim is verifiable. Many homeowners search the state license lookup. |
| Financing | Only "financing may be available for qualified homeowners, ask during your inspection" and a form option. The old site's soft credit pull, no prepayment penalty, and lending partner claims were dropped. | Name the finance provider and current terms, then a financing section can be added truthfully. |
| Manufacturer names | Old pages named GAF, Owens Corning, CertainTeed, and James Hardie. The rebuild says "major manufacturers" and describes product types. | Confirm which product lines SHYLD actually installs and any certifications (for example GAF certified contractor) with proof. |
| Project locations and materials | The old homepage captioned the photos Murfreesboro, Smyrna, and La Vergne with product names. The rebuild describes only what is visible in each of the nine photos. | Confirm the city and product for each photo and they can be added to `src/data/projects.ts`. |
| Property protection details | "Tarps, magnetic sweep, daily cleanup, final walkthrough" appear in the process section, carried from the old site. | Confirm these happen on every job. |
| Manchester and Tullahoma | Pages existed on the server but were never in the sitemap and links to them had been removed. They now redirect to the service areas hub. | Confirm whether these towns are served. If yes, add them to `src/data/location-content.ts`. |
| Cookeville | Not on the site. | Add only after service is confirmed. |
| Reviews | None shown. The trust section says public reviews will appear as customers post them. | Share a Google Business Profile link once reviews exist so they can be quoted with permission. |
| Owner imagery | None available. The about page uses job photos. | A photo of the owner on a roof would strengthen the about page. |
| Text message consent storage | The site sends consent fields with every request. The intake service does not store them yet. | Make the changes listed in `INTEGRATIONS.md`. |
| Analytics destination | Events are pushed to `window.dataLayer` but no GA4 or Tag Manager exists. | Provide the GA4 measurement id or GTM container id. |
| WordPress files in `public_html` | Untouched. | Decide whether to delete them. They are not used by the site. |
| Watermark on the farmhouse photo | The in progress farmhouse aerial carried a Parker Construction Company watermark. It was cropped out so no second brand appears on the site. | Nothing, unless the owner wants that brand shown. |
| Stock and generated images | The old site's roofer stock photo (license unknown) and an artificial silhouette image were removed from the repository. | Nothing, unless a license for the stock photo exists and the owner wants it back. |
| Google verification file | `.htaccess` keeps serving any `google*.html` file at the root. | Make sure the verification file is re uploaded after deploying, since it is not part of the build. |
