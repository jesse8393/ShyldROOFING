import type { APIRoute } from 'astro';
import { areas, business, contentDates, services } from '../data/business';

const routes: { path: string; priority: string; changefreq: string }[] = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  ...services.map((s) => ({ path: `/${s.slug}`, priority: '0.9', changefreq: 'monthly' })),
  { path: '/projects', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', priority: '0.7', changefreq: 'yearly' },
  { path: '/contact', priority: '0.8', changefreq: 'yearly' },
  { path: '/service-areas', priority: '0.6', changefreq: 'monthly' },
  ...areas.map((a) => ({ path: `/roofing-${a.slug}`, priority: '0.8', changefreq: 'monthly' })),
  { path: '/roof-replacement-cost-middle-tennessee', priority: '0.7', changefreq: 'monthly' },
  { path: '/roof-storm-damage-insurance-tennessee', priority: '0.7', changefreq: 'monthly' },
  { path: '/text-us', priority: '0.5', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
];

export const GET: APIRoute = () => {
  const areaDate = contentDates['/service-areas'];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((r) => {
    const lastmod = contentDates[r.path] || (r.path.startsWith('/roofing-') ? areaDate : undefined);
    return `  <url>
    <loc>${business.url}${r.path === '/' ? '/' : r.path}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
