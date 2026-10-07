import type { APIRoute } from 'astro';
import { areas, business, services } from '../data/business';

// Plain text summary for AI search tools (llmstxt.org format). Built from the same data as the pages.
export const GET: APIRoute = () => {
  const u = business.url;
  const body = `# ${business.name}

> ${business.legalName} is a roofing company based in ${business.address.locality}, Tennessee, serving ${business.region}. Free roof inspections with photos, written proposals, and a written workmanship warranty.

Phone and text: ${business.phone.display}
Email: ${business.email}
Hours: ${business.hours.map((h) => `${h.days} ${h.open} to ${h.close}`).join('; ')}

## Services

${services.map((s) => `- [${s.name}](${u}/${s.slug}): ${s.short}`).join('\n')}

## Service areas

${areas.map((a) => `- [Roofing in ${a.name}, TN](${u}/roofing-${a.slug}): ${a.county}`).join('\n')}

## Guides

- [Roof replacement cost in Middle Tennessee](${u}/roof-replacement-cost-middle-tennessee): what sets the price of a new roof and how to compare proposals
- [Storm damage and insurance claims in Tennessee](${u}/roof-storm-damage-insurance-tennessee): what to do after hail or wind and how a claim works

## Company

- [About](${u}/about): who we are and how we work
- [Projects](${u}/projects): photos from SHYLD jobs
- [Contact](${u}/contact): request a free inspection
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
