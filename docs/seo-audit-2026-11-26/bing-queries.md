# Bing query evidence, 2026-11-26

Fetched with curl from the audit sandbox (desktop Chrome user agent, `setlang=en`, `cc=US`). For each response: whether Bing's visible "no results" notice (`<li class="b_no">`) was present, the number of organic result blocks (`b_algo`), and the hosts of the first five results.

| Query | No results notice | Organic results | First five result hosts |
| --- | --- | --- | --- |
| `site:shyldroofing.com (first fetch)` | no | 10 | yogajala.com, www.yogajournal.com, fityogaposes.com, www.yogitimes.com, www.tummee.com |
| `site:shyldroofing.com (second fetch)` | no | 10 | www.kbb.com, www.caranddriver.com, www.iseecars.com, www.carsdirect.com, www.cargurus.com |
| `"SHYLD Roofing" Murfreesboro` | no | 10 | en.m.wikipedia.org, www.ladbible.com, www.grunge.com, starsunfolded.com, simple.m.wikipedia.org |
| `site:en.wikipedia.org (control, certainly indexed)` | no | 10 | en.wikipedia.org |
| `site:bbb.org (control, certainly indexed)` | no | 10 | www.bbb.org, corecms.bbb.org |
| `site:hostinger.com (control, certainly indexed)` | no | 10 | www.worldtimebuddy.com, savvytime.com, www.thetimenow.com, timezonebase.com, 24timezones.com |
| `site:parkerconstructioncompany.com (control)` | no | 10 | www.speedtest.net, linksys.speedtest.net, intelligence.speedtest.net, ciscoconnect.speedtest.net, install.speedtest.net |

Reading: two of the four control domains (hostinger.com and parkerconstructioncompany.com) came back with results from unrelated sites and no notice, so a response that lists unrelated sites does not show that a domain is absent from Bing's index. Nothing Bing returned to this client is evidence either way about shyldroofing.com. Check in Bing Webmaster Tools or a normal browser.
