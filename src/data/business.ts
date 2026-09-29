/**
 * Single source of truth for SHYLD business facts used across every page.
 *
 * Every value here was taken from the live site, the intake service source,
 * or the legal pages as of September 2026. Items listed in
 * docs/UNRESOLVED-FACTS.md still need owner confirmation before launch.
 */

export const business = {
  name: 'SHYLD Roofing',
  shortName: 'SHYLD',
  legalName: 'Parker HVAC LLC',
  legalNote:
    'SHYLD Roofing is the trade name of Parker HVAC LLC, a Tennessee limited liability company. A name change to Shyld Roofing LLC has been filed with the Tennessee Secretary of State.',
  url: 'https://shyldroofing.com',
  phone: {
    display: '(615) 295 8974',
    e164: '+16152958974',
    tel: 'tel:+16152958974',
    sms: 'sms:+16152958974',
  },
  email: 'shyldroofing@gmail.com',
  address: {
    locality: 'Murfreesboro',
    region: 'TN',
    postalCode: '37127',
    country: 'US',
  },
  geo: { latitude: 35.8456, longitude: -86.3903 },
  hours: [
    { days: 'Monday to Friday', open: '7:00 am', close: '6:00 pm', schema: 'Mo-Fr 07:00-18:00' },
    { days: 'Saturday', open: '8:00 am', close: '2:00 pm', schema: 'Sa 08:00-14:00' },
  ],
  region: 'Middle Tennessee',
  founderFirstName: 'Jesse',
} as const;

/** Where the inspection form delivers. Contract documented in docs/INTEGRATIONS.md */
export const intake = {
  endpoint: 'https://shyld-ai-agents.vercel.app/api/form-intake',
  /** Bump when the consent wording below changes. Sent with every submission. */
  consentVersion: '2026-09-29',
  consentText:
    'Optional. Check this box if you would like SHYLD Roofing to text you about scheduling, follow up, and updates on your request. Message and data rates may apply. Message frequency varies. Reply STOP to opt out or HELP for help.',
} as const;

export const services = [
  {
    slug: 'roof-replacement',
    name: 'Roof Replacement',
    short: 'Full tear off and a new architectural shingle or metal roof system.',
  },
  {
    slug: 'roof-repair',
    name: 'Roof Repair',
    short: 'Leaks, missing shingles, flashing, and wind damage diagnosed and fixed.',
  },
  {
    slug: 'metal-roofing',
    name: 'Metal Roofing',
    short: 'Standing seam and exposed fastener metal roofs for homes that want longevity.',
  },
  {
    slug: 'storm-restoration',
    name: 'Storm Damage Assessment',
    short: 'Documented hail and wind inspections you can share with your insurer.',
  },
  {
    slug: 'siding',
    name: 'Siding',
    short: 'Fiber cement, vinyl, and board and batten siding installed with the roof in mind.',
  },
  {
    slug: 'gutters',
    name: 'Gutters',
    short: 'Seamless aluminum gutters, downspouts, and guards sized for Tennessee rain.',
  },
] as const;

export type ServiceSlug = (typeof services)[number]['slug'];

/** Options in the inspection form. Keep wording aligned with the intake service parser. */
export const formServiceOptions = [
  'Free Roof Inspection',
  'Roof Replacement',
  'Roof Repair',
  'Metal Roofing',
  'Storm Damage Assessment',
  'Siding',
  'Gutters',
  'Financing Question',
  'Something Else',
] as const;

export const areas = [
  { slug: 'franklin', name: 'Franklin', county: 'Williamson County' },
  { slug: 'lebanon', name: 'Lebanon', county: 'Wilson County' },
  { slug: 'murfreesboro', name: 'Murfreesboro', county: 'Rutherford County' },
  { slug: 'smyrna', name: 'Smyrna', county: 'Rutherford County' },
  { slug: 'la-vergne', name: 'La Vergne', county: 'Rutherford County' },
  { slug: 'nashville', name: 'Nashville', county: 'Davidson County' },
  { slug: 'brentwood', name: 'Brentwood', county: 'Williamson County' },
  { slug: 'nolensville', name: 'Nolensville', county: 'Williamson County' },
  { slug: 'spring-hill', name: 'Spring Hill', county: 'Williamson and Maury Counties' },
  { slug: 'mt-juliet', name: 'Mt. Juliet', county: 'Wilson County' },
  { slug: 'shelbyville', name: 'Shelbyville', county: 'Bedford County' },
  { slug: 'eagleville', name: 'Eagleville', county: 'Rutherford County' },
  { slug: 'christiana', name: 'Christiana', county: 'Rutherford County' },
  { slug: 'rockvale', name: 'Rockvale', county: 'Rutherford County' },
] as const;

export type AreaSlug = (typeof areas)[number]['slug'];

export const nav = {
  primary: [
    { href: '/#services', label: 'Services' },
    { href: '/projects', label: 'Projects' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
  cta: { href: '/contact#inspection', label: 'Request a Free Inspection' },
} as const;

/** Content dates used for sitemap lastmod. Update when a page's content materially changes. */
export const contentDates: Record<string, string> = {
  '/': '2026-09-29',
  '/roof-replacement': '2026-09-29',
  '/roof-repair': '2026-09-29',
  '/metal-roofing': '2026-09-29',
  '/storm-restoration': '2026-09-29',
  '/siding': '2026-09-29',
  '/gutters': '2026-09-29',
  '/projects': '2026-09-29',
  '/about': '2026-09-29',
  '/contact': '2026-09-29',
  '/service-areas': '2026-09-29',
  '/roof-replacement-cost-middle-tennessee': '2026-09-29',
  '/roof-storm-damage-insurance-tennessee': '2026-09-29',
  '/text-us': '2026-09-29',
  '/privacy': '2026-04-27',
  '/terms': '2026-04-27',
};
