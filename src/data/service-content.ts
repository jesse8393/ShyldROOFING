import type { ImageMetadata } from 'astro';
import type { ServiceSlug } from './business';
import type { Faq } from './faqs';
import shingles from '../assets/photos/shingle-replacement-aerial.jpg';
import shingleDetail from '../assets/photos/crops/shingle-detail.jpg';
import metal from '../assets/photos/standing-seam-metal-aerial.jpg';
import metalDetail from '../assets/photos/crops/metal-detail.jpg';
import siding from '../assets/photos/board-and-batten-siding.jpg';
import gutters from '../assets/photos/crops/gutters-wide.jpg';
import charcoalHome from '../assets/photos/home-charcoal-shingles-aerial.jpg';
import farmhouse from '../assets/photos/farmhouse-replacement-in-progress.jpg';
import blueRanch from '../assets/photos/blue-brick-ranch-hip-roof-aerial.jpg';
import blueRanchFront from '../assets/photos/blue-brick-ranch-front-aerial.jpg';
import hipDetail from '../assets/photos/crops/hip-roof-detail.jpg';

export interface ServiceContent {
  slug: ServiceSlug;
  name: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  hero: { image: ImageMetadata; alt: string; caption: string };
  /** Who this is for */
  fit: { heading: string; items: string[] };
  /** What the inspection covers */
  inspection: string[];
  /** Options homeowners choose between */
  options: { name: string; text: string }[];
  /** How the work proceeds */
  sequence: { name: string; text: string }[];
  /** Plain statements of what is not part of a standard scope */
  exclusions: string[];
  warranty: string;
  faqs: Faq[];
  related: { label: string; href: string }[];
  formService: string;
  /** Project on /projects to feature */
  projectSlug?: string;
  detail?: { image: ImageMetadata; alt: string };
}

export const serviceContent: Record<ServiceSlug, ServiceContent> = {
  'roof-replacement': {
    slug: 'roof-replacement',
    name: 'Roof Replacement',
    title: 'Roof Replacement in Middle Tennessee | SHYLD Roofing',
    description:
      'Full tear off roof replacement with shingles or metal, a written proposal that names every layer, and a workmanship warranty. Free inspections.',
    h1: 'Roof replacement, done once, in writing.',
    intro:
      'When repairs stop making sense, a full replacement is the honest answer. We tear the old roof off to the deck, fix what we find, and install a complete system you can see itemized in your proposal.',
    hero: {
      image: charcoalHome,
      alt: 'Aerial view of a white board and batten home with a new charcoal architectural shingle roof, several gables, and a brick chimney, replaced by SHYLD Roofing',
      caption: 'Charcoal architectural shingle replacement on a board and batten home, photographed after completion',
    },
    fit: {
      heading: 'When replacement is the right call',
      items: [
        'Shingles that are curling, cracking, or shedding granules across most of the roof, not just one slope.',
        'Roofs past twenty years old with repeated repairs, especially if the decking has ever been wet.',
        'Storm damage spread widely enough that patching would leave a checkerboard of old and new.',
        'Two or more existing layers. Tennessee code and manufacturer warranties both want them gone.',
        'A sale, a refinance, or an insurance renewal that needs a roof with real life left in it.',
      ],
    },
    inspection: [
      'We walk every slope and photograph the shingles, flashing, boots, and ridge.',
      'We check the decking from the attic where access allows, looking for stains, soft spots, and daylight.',
      'We measure the roof, count the penetrations, and note ventilation, so the proposal is built from real numbers.',
      'You get the photos and a plain read of what they mean, including whether a repair would still make sense.',
    ],
    options: [
      {
        name: 'Architectural asphalt shingles',
        text: 'The most common choice for Middle Tennessee homes. Dimensional shingles from major manufacturers, with color and warranty tier chosen with you.',
      },
      {
        name: 'Standing seam metal',
        text: 'Concealed fastener panels that last decades longer than shingles. Higher cost up front, lower maintenance, and a different look. See our metal roofing page for the details.',
      },
      {
        name: 'Ventilation and accessories',
        text: 'Ridge vent, intake vents, pipe boots, and flashing are specified with the shingles, because a roof system is only as good as its weakest part.',
      },
    ],
    sequence: [
      { name: 'Protect the property', text: 'Tarps over landscaping and along the walls, plywood over delicate surfaces, and a plan for where the dumpster and materials go.' },
      { name: 'Tear off to the deck', text: 'Every layer comes off. Old nails are pulled or driven, and the deck is swept so we can see what we are nailing to.' },
      { name: 'Repair decking', text: 'Soft or rotten sheathing is cut out and replaced. This is priced per sheet in your proposal so it is never a surprise.' },
      { name: 'Dry in', text: 'Ice and water barrier at eaves, valleys, and penetrations, synthetic underlayment over the rest, drip edge at the perimeter.' },
      { name: 'Install the roof', text: 'Starter strip, shingles or panels, new flashing at every wall and penetration, ridge vent and cap.' },
      { name: 'Clean up and walk through', text: 'Magnetic sweep for nails, debris hauled away, and a walkthrough with you before the final invoice.' },
    ],
    exclusions: [
      'Structural framing repairs beyond replacing sheathing. If we find rafter damage we stop, show you, and quote it separately.',
      'Interior drywall or paint repair from earlier leaks.',
      'Gutters, unless included in the proposal. Many homeowners add them because the crew is already there.',
      'Skylight replacement, unless specified. We always reflash existing skylights.',
    ],
    warranty:
      'Every replacement comes with our written workmanship warranty, with the term stated in your proposal, plus the manufacturer warranty on the shingles or panels. We register manufacturer warranties on your behalf where the product allows it.',
    faqs: [
      {
        q: 'How long does a replacement take?',
        a: '<p>Most single family homes are torn off and re roofed within one to three days depending on size, pitch, and weather. We never leave a roof open overnight without it dried in.</p>',
      },
      {
        q: 'Can you install over the existing shingles?',
        a: '<p>We do not recommend it and rarely do it. Layering hides deck problems, adds weight, shortens the life of the new shingles, and can void manufacturer warranties. Tear off costs a little more and is worth it every time.</p>',
      },
      {
        q: 'What if you find rotten decking?',
        a: '<p>We replace it. Your proposal lists a per sheet price for decking so you know the cost before we start. We photograph any sheet we replace.</p>',
      },
      {
        q: 'Do I need a permit?',
        a: '<p>Permit requirements vary by city and county in Middle Tennessee. We handle permitting where it is required and include the cost in the proposal.</p>',
      },
    ],
    related: [
      { label: 'What a roof replacement costs in Middle Tennessee', href: '/roof-replacement-cost-middle-tennessee' },
      { label: 'Metal roofing', href: '/metal-roofing' },
      { label: 'Roof repair', href: '/roof-repair' },
    ],
    formService: 'Roof Replacement',
    projectSlug: 'charcoal-shingles-board-and-batten-home',
    detail: { image: farmhouse, alt: 'Crew installing shingles over synthetic underlayment on a two story farmhouse, photographed from above' },
  },

  'roof-repair': {
    slug: 'roof-repair',
    name: 'Roof Repair',
    title: 'Roof Repair in Middle Tennessee | SHYLD Roofing',
    description:
      'Roof leak and storm damage repair across Middle Tennessee. We find the real source, fix it properly, and say honestly if a repair is worth it.',
    h1: 'Roof repairs that find the real problem.',
    intro:
      'A stain on the ceiling rarely sits under the leak. We trace water back to where it gets in, fix that, and leave you with photos of the before and after. If the roof is too far gone for a repair to be worth your money, we say so.',
    hero: {
      image: hipDetail,
      alt: 'Close aerial view of a hip roof with charcoal architectural shingles, hip caps, pipe boots, and a continuous ridge vent',
      caption: 'Hips, ridges, pipe boots, and chimneys are where most repairs happen',
    },
    fit: {
      heading: 'Repairs we handle',
      items: [
        'Active leaks around chimneys, pipe boots, skylights, and wall flashing.',
        'Missing, lifted, or creased shingles after wind.',
        'Storm damage limited to one area of the roof.',
        'Failed or rusted flashing and step flashing at walls.',
        'Cracked pipe boots and loose ridge caps.',
        'Small sections of rotten decking near valleys or eaves.',
      ],
    },
    inspection: [
      'We start inside if there is a stain, then follow the water uphill on the roof.',
      'We check every penetration and transition near the leak, because water travels along underlayment and rafters before it shows.',
      'We photograph what we find and explain whether a repair will hold or just delay a replacement.',
      'You get a written price for the repair before any work happens.',
    ],
    options: [
      { name: 'Spot repair', text: 'Replacing a handful of shingles, resealing a boot, or reflashing a single penetration. Usually done in one visit.' },
      { name: 'Section repair', text: 'Tearing off and re roofing one slope or one area where damage is concentrated, tied into the existing roof with new underlayment and flashing.' },
      { name: 'Repair now, plan the replacement', text: 'A durable fix to stop damage while you budget or wait on an insurance decision, with a replacement proposal you can act on when ready.' },
    ],
    sequence: [
      { name: 'Confirm the source', text: 'Water testing or a close look in the attic when the leak is not obvious. We do not guess.' },
      { name: 'Open the area', text: 'Shingles around the problem are lifted or removed to expose the flashing and decking underneath.' },
      { name: 'Fix what failed', text: 'New flashing, a new boot, new underlayment, or new decking, then matching shingles woven into the existing roof.' },
      { name: 'Photograph and clean up', text: 'You get photos of the finished repair and the area is left clean.' },
    ],
    exclusions: [
      'Interior repairs to drywall, insulation, or paint.',
      'Repairs to roofs with active manufacturer warranty claims in progress without the manufacturer involved.',
      'Chasing leaks caused by gutters, siding, or windows, though we will tell you when the water is coming from one of those.',
    ],
    warranty:
      'Repairs carry our written workmanship warranty on the work performed, stated on your invoice. We are honest about limits: a repair on a roof near the end of its life is warranted for the repair, not for the rest of the roof.',
    faqs: [
      {
        q: 'How soon can you come out for a leak?',
        a: '<p>Call us. Scheduling depends on weather and the current workload, and we will give you a real answer on the phone rather than a promise on a website. If water is coming in right now, ask about a temporary tarp.</p>',
      },
      {
        q: 'Can you match my existing shingles?',
        a: '<p>Usually close, rarely perfect. Shingles fade and manufacturers change colors. We show you the closest match before installing it. On highly visible slopes, we talk through whether a section replacement would look better.</p>',
      },
      {
        q: 'Is it worth repairing an old roof?',
        a: '<p>Sometimes. A single failed pipe boot on an otherwise sound fifteen year old roof is an easy yes. Widespread brittle shingles are a no, because every repair breaks more shingles around it. We tell you which one you have.</p>',
      },
    ],
    related: [
      { label: 'Storm damage assessment', href: '/storm-restoration' },
      { label: 'Roof replacement', href: '/roof-replacement' },
      { label: 'Gutters', href: '/gutters' },
    ],
    formService: 'Roof Repair',
    projectSlug: 'blue-brick-ranch-hip-roof',
    detail: { image: shingleDetail, alt: 'Close view of architectural shingles, dormers, valleys, and pipe flashing on a residential roof' },
  },

  'metal-roofing': {
    slug: 'metal-roofing',
    name: 'Metal Roofing',
    title: 'Metal Roofing in Middle Tennessee | SHYLD Roofing',
    description:
      'Standing seam and exposed fastener metal roofing across Middle Tennessee. Panels formed to length, and honest advice on whether metal fits your home.',
    h1: 'Metal roofs for homes you plan to keep.',
    intro:
      'A well installed metal roof outlasts two or three shingle roofs. It costs more up front, sheds rain and hail differently, and changes how a house looks. We help you decide whether it fits your home and budget, then install it properly.',
    hero: {
      image: metal,
      alt: 'Aerial view of a charcoal standing seam metal roof with a chimney on a steep pitched two story home, installed by SHYLD Roofing',
      caption: 'Standing seam metal roof on a steep pitched home, aerial photo after completion',
    },
    fit: {
      heading: 'When metal makes sense',
      items: [
        'You plan to be in the home long enough for the longer life to pay for itself.',
        'Simple, steep roof shapes where long panels can run eave to ridge.',
        'Farmhouse, modern, or cabin styles where the look is part of the appeal.',
        'Homes that have replaced shingles more than once because of hail or heat.',
        'Porches, additions, and accent roofs where a metal section pairs with shingles on the main roof.',
      ],
    },
    inspection: [
      'We measure panel runs and look at every transition, because metal is less forgiving of complicated roof shapes than shingles.',
      'We check decking, ventilation, and existing penetrations. Some roofs need penetrations consolidated before metal goes on.',
      'We talk through gauge, panel profile, color, and finish, and show samples.',
      'You get a proposal with panel type, gauge, underlayment, trim, and fasteners listed.',
    ],
    options: [
      { name: 'Standing seam', text: 'Vertical panels with raised seams and concealed clips. No fastener heads exposed to weather. The premium choice for homes.' },
      { name: 'Exposed fastener panels', text: 'Screw down panels with sealing washers. Lower cost and common on barns, shops, and porches. Fasteners need periodic checks.' },
      { name: 'Metal accents', text: 'Standing seam over a porch or bay while the main roof stays shingle. A common way to get the look without the full cost.' },
    ],
    sequence: [
      { name: 'Tear off and deck prep', text: 'Old roofing removed, decking repaired, and a high temperature synthetic underlayment installed across the deck.' },
      { name: 'Trim and flashing first', text: 'Eave trim, drip edge, and valley metal go on before panels so water always runs over a joint, never into one.' },
      { name: 'Panels formed and set', text: 'Panels are cut or formed to the length of each run, set with clips or fasteners, and seamed or sealed at the ridge.' },
      { name: 'Penetrations and ridge', text: 'Boots, chimney crickets, and counter flashing in matching metal. Vented ridge cap closes the system.' },
    ],
    exclusions: [
      'Roofs with many small hips, dormers, and short runs may be quoted in shingles instead, because metal on those shapes costs a great deal and looks busy.',
      'Painting or coating existing metal roofs.',
      'Solar mounting, though standing seam is one of the easiest roofs to clamp solar to later.',
    ],
    warranty:
      'Our written workmanship warranty covers the installation, and the panel manufacturer warrants the finish against chalking and fading for a stated term. Both are documented in your proposal.',
    faqs: [
      {
        q: 'Is a metal roof loud in the rain?',
        a: '<p>Over a solid deck with underlayment and attic insulation, it sounds about like a shingle roof. The loud metal roofs people remember are on barns with nothing under them.</p>',
      },
      {
        q: 'Does metal attract lightning?',
        a: '<p>No. Lightning is attracted to height and location, not material. A metal roof is not more likely to be struck, and if it is, it does not burn.</p>',
      },
      {
        q: 'How much more does metal cost than shingles?',
        a: '<p>Meaningfully more, and the gap depends on panel type, gauge, and roof complexity. We do not publish ranges because they mislead. An inspection produces a real number for your roof, and we are glad to price both options side by side.</p>',
      },
      {
        q: 'Can it go over existing shingles?',
        a: '<p>It can be done, but we recommend a tear off so the deck can be inspected and the panels lie flat. If a homeowner wants an overlay, we explain the trade offs before quoting it.</p>',
      },
    ],
    related: [
      { label: 'Roof replacement', href: '/roof-replacement' },
      { label: 'Standing seam project photo', href: '/projects#standing-seam-metal-roof' },
      { label: 'Gutters for metal roofs', href: '/gutters' },
    ],
    formService: 'Metal Roofing',
    projectSlug: 'standing-seam-metal-roof',
    detail: { image: metalDetail, alt: 'Close view of standing seam panels and a metal wrapped chimney' },
  },

  'storm-restoration': {
    slug: 'storm-restoration',
    name: 'Storm Damage Assessment',
    title: 'Storm Damage Roof Inspection in Middle Tennessee | SHYLD',
    description:
      'Hail and wind damage roof inspections with photos you can share with your insurer. We meet adjusters on site and repair or replace what the storm damaged.',
    h1: 'See what the storm did before you file.',
    intro:
      'Hail bruises and wind creases are invisible from the driveway. We inspect, photograph, and explain what we find in plain terms. You decide whether to file a claim, and we work with your adjuster if you do.',
    hero: {
      image: blueRanchFront,
      alt: 'Aerial view of a single story blue brick home with a new charcoal shingle roof and a stone chimney after replacement',
      caption: 'Replacement on a single story brick home, aerial photo from a SHYLD job',
    },
    fit: {
      heading: 'Call after a storm if you notice',
      items: [
        'Shingle pieces or granules in the yard, gutters, or downspout splash blocks.',
        'Dented gutters, downspouts, window screens, or air conditioner fins. Hail that dents metal usually bruised the shingles too.',
        'Lifted or missing shingles, or shingles that look creased along a line.',
        'Neighbors with roofers in the driveway. If the storm hit them, it probably hit you.',
        'A new stain on a ceiling after heavy rain.',
      ],
    },
    inspection: [
      'We walk every slope and mark hail hits and wind creases so they show in the photos.',
      'We check soft metals, vents, boots, and gutters, which insurers use to judge hail size.',
      'We document the age and condition of the roof honestly. Old wear is not storm damage and we do not call it that.',
      'You receive the photo set and a written summary you can keep or share with your carrier.',
    ],
    options: [
      { name: 'Repair', text: 'When damage is limited, a repair may be all that is needed, with or without a claim.' },
      { name: 'Replacement', text: 'When damage is widespread, a replacement proposal is written to match the scope your carrier approves.' },
      { name: 'Temporary protection', text: 'If water is coming in, we can tarp the damage while decisions are made.' },
    ],
    sequence: [
      { name: 'Inspect and document', text: 'Photos, measurements, and a written summary of what we found.' },
      { name: 'Your decision to file', text: 'You contact your insurer if you choose to. We can explain what to expect but the claim is yours.' },
      { name: 'Adjuster meeting', text: 'We meet the adjuster at the house and walk the roof together so nothing gets missed.' },
      { name: 'Scope and schedule', text: 'Once your carrier issues a scope, we build a proposal to match it and schedule the work.' },
    ],
    exclusions: [
      'We do not decide claim outcomes, negotiate on your behalf as a public adjuster, or promise approval.',
      'We do not waive, absorb, or rebate deductibles. That is insurance fraud in Tennessee and we will not do it.',
      'We do not file claims for pre existing wear.',
    ],
    warranty:
      'Repairs and replacements after a storm carry the same written workmanship warranty and manufacturer warranties as any other SHYLD job.',
    faqs: [
      {
        q: 'Should I call my insurance company before a roofer?',
        a: '<p>We suggest an inspection first so you know whether there is real damage. Filing a claim that finds nothing still goes on your record. Once you know what you have, you can decide.</p>',
      },
      {
        q: 'How long do I have to file a claim?',
        a: '<p>It depends on your policy. Filing windows vary by carrier and by policy language, so read yours or ask your agent. Sooner is better because damage is easier to tie to a specific storm.</p>',
      },
      {
        q: 'Will you handle everything with the insurance company?',
        a: '<p>We inspect, document, and meet the adjuster. We do not act as your representative in the claim. Tennessee law limits what contractors can do in that role, and you should be wary of anyone who says otherwise.</p>',
      },
    ],
    related: [
      { label: 'Guide: storm damage and insurance claims in Tennessee', href: '/roof-storm-damage-insurance-tennessee' },
      { label: 'Roof repair', href: '/roof-repair' },
      { label: 'Roof replacement', href: '/roof-replacement' },
    ],
    formService: 'Storm Damage Assessment',
    projectSlug: 'shingle-and-flat-roof-addition',
    detail: { image: blueRanch, alt: 'Aerial view of a hip roof with new shingles, a stone chimney, and a continuous ridge vent' },
  },

  siding: {
    slug: 'siding',
    name: 'Siding',
    title: 'Siding Installation in Middle Tennessee | SHYLD Roofing',
    description:
      'Siding replacement and installation across Middle Tennessee. Fiber cement, vinyl, and board and batten, with flashing done right where the siding meets the roof.',
    h1: 'Siding by the people who do your roof.',
    intro:
      'Most siding failures start where the siding meets something else: a roof, a window, a deck ledger. Because we roof as well as side, those transitions get the same attention as the panels themselves.',
    hero: {
      image: siding,
      alt: 'Crew installing vertical board and batten siding on a new two story home, ladders against the wall under a blue sky',
      caption: 'Board and batten siding on a new build, photographed during installation',
    },
    fit: {
      heading: 'Siding projects we take on',
      items: [
        'Full replacement of rotten, warped, or hail damaged siding.',
        'Siding on new construction and additions.',
        'Replacing failed wood trim and fascia along with the siding.',
        'Board and batten accents on gables and porches.',
        'Siding replacement paired with a roof replacement, one crew and one schedule.',
      ],
    },
    inspection: [
      'We look for soft or swollen boards, gaps at trim, and staining below windows and roof lines.',
      'We check how the existing siding is flashed at the roof and at windows, which is where most water gets behind it.',
      'We talk through material, profile, and color, with samples.',
      'The proposal lists the siding product, house wrap, flashing, and trim so you know what is going on the house.',
    ],
    options: [
      { name: 'Fiber cement', text: 'Durable, paintable, and resistant to hail and insects. Heavier and more expensive to install than vinyl, and worth it on most homes.' },
      { name: 'Vinyl', text: 'Cost effective and low maintenance. Quality varies widely by thickness; we specify the grade in your proposal.' },
      { name: 'Board and batten', text: 'Vertical boards with battens over the seams, in fiber cement or engineered wood. Popular on modern farmhouse designs.' },
    ],
    sequence: [
      { name: 'Remove and inspect', text: 'Old siding comes off and the sheathing is checked for rot before anything new goes on.' },
      { name: 'Wrap and flash', text: 'House wrap, window and door flashing, and kick out flashing where roofs meet walls.' },
      { name: 'Install siding and trim', text: 'Panels or boards, corner and window trim, and caulking at joints.' },
      { name: 'Finish and clean up', text: 'Paint or touch up where the product calls for it, then a full site cleanup.' },
    ],
    exclusions: [
      'Structural framing repairs beyond replacing sheathing.',
      'Interior work behind walls.',
      'Painting entire homes; we paint or touch up the siding we install.',
    ],
    warranty:
      'Siding work carries our written workmanship warranty along with the manufacturer warranty on the siding product itself, both stated in the proposal.',
    faqs: [
      {
        q: 'Can you do siding and roofing together?',
        a: '<p>Yes, and it is often the best way to do both. The roof goes on first so wall flashing is tied in correctly, then the siding. One schedule, one point of contact.</p>',
      },
      {
        q: 'How long does siding take?',
        a: '<p>A full replacement on an average home runs one to two weeks depending on size, material, and how much rot we find. The proposal states the plan.</p>',
      },
    ],
    related: [
      { label: 'Gutters', href: '/gutters' },
      { label: 'Roof replacement', href: '/roof-replacement' },
      { label: 'Siding project photo', href: '/projects#board-and-batten-siding' },
    ],
    formService: 'Siding',
    projectSlug: 'board-and-batten-siding',
  },

  gutters: {
    slug: 'gutters',
    name: 'Gutters',
    title: 'Seamless Gutters in Middle Tennessee | SHYLD Roofing',
    description:
      'Seamless aluminum gutters, downspouts, and gutter guards installed across Middle Tennessee. Sized for heavy Tennessee rain and pitched to actually drain.',
    h1: 'Gutters that move water where it should go.',
    intro:
      'Gutters are simple until they are not. Undersized, poorly pitched, or badly placed downspouts leave water at the foundation and stain the siding. We size them for the roof they serve and install them so they drain.',
    hero: {
      image: gutters,
      alt: 'Single story brick home with new seamless gutter sections staged on the lawn during installation',
      caption: 'Seamless gutter installation on a brick home, runs formed on site',
    },
    fit: {
      heading: 'Gutter work we handle',
      items: [
        'New seamless aluminum gutters and downspouts.',
        'Replacing sagging, leaking, or undersized gutters.',
        'Gutter guards that fit the gutter and the roof pitch.',
        'Gutters installed with a new roof so the drip edge and gutter apron work together.',
        'Adding downspouts where water pools or overshoots.',
      ],
    },
    inspection: [
      'We measure roof area draining to each run to choose five or six inch gutters and the number of downspouts.',
      'We look at fascia condition, because gutters need something solid to hang from.',
      'We note where water should exit and whether extensions or drains are needed at grade.',
      'The proposal lists gutter size, hanger type and spacing, downspout count, and guard type if chosen.',
    ],
    options: [
      { name: 'Five inch seamless', text: 'The standard residential size, right for most roofs.' },
      { name: 'Six inch seamless', text: 'For large roof areas, steep pitches, or metal roofs that shed water fast.' },
      { name: 'Gutter guards', text: 'Micro mesh or perforated covers to keep leaves out. Not every guard works on every roof, so we match the guard to the pitch and tree cover.' },
    ],
    sequence: [
      { name: 'Remove old gutters', text: 'Old runs come down and fascia is checked and repaired if needed.' },
      { name: 'Form and hang', text: 'Runs are formed on site to the length of each eave and hung on hidden hangers with the right pitch to the outlets.' },
      { name: 'Downspouts and outlets', text: 'Downspouts placed where water needs to leave, with extensions or splash blocks at grade.' },
      { name: 'Guards and test', text: 'Guards installed if chosen, then we run water to confirm everything drains.' },
    ],
    exclusions: [
      'Underground drainage and French drains, though we will tell you if you need one.',
      'Fascia and soffit replacement beyond spot repairs, unless quoted.',
      'Cleaning existing gutters as a standalone service.',
    ],
    warranty: 'Gutter installations carry our written workmanship warranty, stated in the proposal, along with any manufacturer warranty on guards.',
    faqs: [
      {
        q: 'Do I need gutter guards?',
        a: '<p>If you have trees over the roof, guards save you a lot of ladder time. If you do not, plain gutters cleaned once or twice a year are fine. We are honest about which situation you are in.</p>',
      },
      {
        q: 'Should gutters go on before or after a new roof?',
        a: '<p>After, or during the same project. The roof drip edge and the gutter apron need to overlap correctly, which is easiest when the same crew handles both.</p>',
      },
    ],
    related: [
      { label: 'Siding', href: '/siding' },
      { label: 'Roof replacement', href: '/roof-replacement' },
      { label: 'Gutter project photo', href: '/projects#seamless-gutters' },
    ],
    formService: 'Gutters',
    projectSlug: 'seamless-gutters',
  },
};
