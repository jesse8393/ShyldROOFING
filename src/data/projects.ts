/**
 * Documented SHYLD work. Only what is visible in the photo is described.
 * City and product details were not confirmed by the owner and are left out on purpose.
 * See docs/UNRESOLVED-FACTS.md for what to add once confirmed.
 */
export interface Project {
  slug: string;
  title: string;
  summary: string;
  alt: string;
  service: 'roof-replacement' | 'metal-roofing' | 'siding' | 'gutters';
  body: string[];
}

export const projects: Project[] = [
  {
    slug: 'charcoal-shingles-board-and-batten-home',
    title: 'Charcoal architectural shingles on a board and batten home',
    summary: 'Single family home with intersecting gables and a covered porch, aerial after completion',
    alt: 'Aerial photo of a white board and batten home with new charcoal architectural shingles, several intersecting gables, a brick chimney, and a covered porch with wood posts',
    service: 'roof-replacement',
    body: [
      'A full replacement on a home with a lot going on up top: a main gable, a cross gable over the porch, a dormer, and a rear addition with its own ridge and a brick chimney. Every one of those intersections is a valley or a wall transition that needs metal flashing and ice and water barrier underneath.',
      'The dark shingle against the white siding and black trim is a look many homeowners in Middle Tennessee ask for right now. It also shows off the ridge lines cleanly from the street.',
    ],
  },
  {
    slug: 'farmhouse-roof-replacement-in-progress',
    title: 'Farmhouse roof replacement, mid installation',
    summary: 'Crew installing shingles over synthetic underlayment, aerial during the job',
    alt: 'Aerial photo of a crew installing charcoal shingles on a two story white farmhouse, with printed synthetic underlayment visible on the porch roof and ladders against the house',
    service: 'roof-replacement',
    body: [
      'This is what the middle of a replacement looks like. The old roof is off, the synthetic underlayment is down and printed with its overlap lines, and the crew is running shingle courses up the main slopes while the porch roof waits its turn.',
      'Ladders, ropes, and staged bundles are part of a working site. What matters is that the deck was dried in before the shingles started and the yard is cleaned up when the crew leaves each day.',
    ],
  },
  {
    slug: 'blue-brick-ranch-hip-roof',
    title: 'Hip roof replacement on a painted brick ranch',
    summary: 'Single story home with a stone chimney and continuous ridge vent, two aerial views',
    alt: 'Aerial photo of a single story blue painted brick ranch home with a new charcoal shingle hip roof, a stone chimney, a continuous ridge vent, and tall evergreen shrubs along the front',
    service: 'roof-replacement',
    body: [
      'A simple hip roof done properly: clean hip caps on every corner, a continuous ridge vent along the top, new pipe boots, and the flashing around the stone chimney redone. Roofs like this are common across Middle Tennessee and are usually finished in a day.',
      'The second photo shows the same house from the front with the gutters back on and the shingle pattern running straight and even across the long slope.',
    ],
  },
  {
    slug: 'shingle-and-flat-roof-addition',
    title: 'Shingles with a flat roof section on a multi addition home',
    summary: 'Older home with several roof lines and a low slope section, aerial after completion',
    alt: 'Aerial photo of a white home with new charcoal shingles across several intersecting roof sections, a brick chimney, and a dark low slope membrane roof over a two story addition',
    service: 'roof-replacement',
    body: [
      'Older homes that have been added onto over the years end up with roofs that meet at odd angles and, sometimes, a section too flat for shingles. This one has a low slope area over the upper addition that was roofed in a membrane while the rest received architectural shingles.',
      'Getting the transition between the flat section and the shingled slopes watertight is the whole job on a roof like this.',
    ],
  },
  {
    slug: 'standing-seam-metal-roof',
    title: 'Standing seam metal roof',
    summary: 'Steep pitch home with a chimney, aerial after completion',
    alt: 'Aerial photo of a charcoal standing seam metal roof on a steep pitched two story home with a chimney, driveway and mature trees around it',
    service: 'metal-roofing',
    body: [
      'Vertical panels run eave to ridge with concealed fasteners, so nothing penetrates the panel face. The chimney is flashed with a matching metal cricket and counter flashing.',
      'Standing seam suits steep and simple roof shapes like this one, where long uninterrupted panels can be formed to length.',
    ],
  },
  {
    slug: 'architectural-shingle-replacement',
    title: 'Architectural shingle replacement across connected buildings',
    summary: 'Multi building residential property, aerial after completion',
    alt: 'Aerial photo of new charcoal architectural shingles on a multi building brick and siding residential property, with dormers and ridge lines visible',
    service: 'roof-replacement',
    body: [
      'A full replacement across connected residential buildings with multiple gables, dormers, and pipe penetrations. Shot from above after the crew finished so the ridge lines, valleys, and flashing at every penetration are visible.',
      'Projects like this are scheduled in sections so residents keep access, with tear off and dry in completed on each section before the next begins.',
    ],
  },
  {
    slug: 'board-and-batten-siding',
    title: 'Board and batten siding',
    summary: 'New construction exterior during installation',
    alt: 'Crew on ladders installing vertical board and batten siding on a new two story home with a dark shingle roof under a blue sky',
    service: 'siding',
    body: [
      'Vertical board and batten panels on a new build, photographed mid installation with the crew still on ladders. Trim, window flashing, and the transition to the brick water table are all part of the same scope.',
    ],
  },
  {
    slug: 'seamless-gutters',
    title: 'Seamless gutters',
    summary: 'Brick single story home, gutter runs staged on site',
    alt: 'Single story brick home with new seamless gutter sections and downspout boxes staged on the lawn while a crew member works at the eave',
    service: 'gutters',
    body: [
      'Seamless aluminum runs are formed on site to the exact length of each eave, so the only joints are at corners and outlets. Downspouts are placed where water actually needs to leave the house.',
    ],
  },
];
