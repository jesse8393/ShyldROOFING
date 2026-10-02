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
  /** Optional second photo of the same job. Key matches the images map in src/pages/projects.astro */
  second?: { key: string; alt: string };
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
    second: { key: 'charcoal-home-angle', alt: 'Second aerial angle of the white board and batten home showing the dormer, the cross gable over the porch, and the rear addition with its brick chimney' },
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
    second: { key: 'blue-ranch-front', alt: 'Front aerial view of the same blue brick ranch with the new charcoal hip roof, gutters reinstalled, and evergreens along the entry' },
  },
  {
    slug: 'charcoal-shingles-brick-ranch',
    title: 'Charcoal shingles on a long brick ranch',
    summary: 'Hip ends, three ridge vent runs, and a brick chimney, straight down and from the side',
    alt: 'Straight down aerial photo of a long brick ranch home with new charcoal architectural shingles, hip ends, three sections of ridge vent, a brick chimney, and a white metal patio cover at the back',
    service: 'roof-replacement',
    body: [
      'A long, low ranch with hips at both ends and a stepped ridge. The overhead view shows what a straight install looks like: courses aligned across the whole length, hip caps meeting cleanly, and ridge vent run in three sections to match the roof shape.',
      'The chimney was reflashed and the existing white metal patio cover at the rear was left in place and tied into the new drip edge. The angled view shows the same roof with the afternoon shadows across it.',
    ],
    second: { key: 'charcoal-ranch-angle', alt: 'Angled aerial view of the same brick ranch with new charcoal shingles, a brick chimney, and the white metal patio cover beside the driveway' },
  },
  {
    slug: 'brown-shingles-brick-dormers',
    title: 'Brown dimensional shingles on a brick home with dormers',
    summary: 'Two story brick home with two front dormers and a metal porch cover, overhead and from the side',
    alt: 'Straight down aerial photo of a brick home with red shutters, two front dormers, a brick chimney, new brown dimensional shingles, and a white metal carport roof',
    service: 'roof-replacement',
    body: [
      'Brown and rust toned shingles to suit the brick and red shutters. The two dormers each add four sidewall flashing lines and a small valley, and the chimney sits right where the rear wing meets the main roof.',
      'The side view shows the same house with the metal cover over the porch, which was flashed to the new shingles rather than replaced.',
    ],
    second: { key: 'brown-dormers-angle', alt: 'Angled aerial view of the same brick home showing the brown shingle roof, dormers, chimney, and metal porch cover' },
  },
  {
    slug: 'weathered-wood-shingles-brick-ranch',
    title: 'Weathered wood shingles on a brick ranch with a covered porch',
    summary: 'Single story brick home with a gabled front porch and carport, aerial after completion',
    alt: 'Aerial photo of a single story brick ranch with new weathered wood colored architectural shingles, a gabled front porch with white columns, a carport, and a white metal cover at the back',
    service: 'roof-replacement',
    body: [
      'A lighter, weathered wood shingle color on a brick ranch, with the gabled porch roof and the main hip roof shingled as one job so the color matches everywhere. Ridge vent runs the length of the main ridge.',
      'The straight down view shows the hip and gable intersections, two ridge vent runs, and the white metal cover over the rear patio that the new roof drains onto.',
    ],
    second: { key: 'weathered-wood-overhead', alt: 'Straight down aerial view of the same brick ranch showing the weathered wood shingles, hip and gable intersections, ridge vents, carport, and rear metal patio cover' },
  },
  {
    slug: 'contemporary-home-skylights',
    title: 'Low slope shingles and skylights on a contemporary home',
    summary: 'Diagonal wood sided home with two skylights and stepped roof levels, aerial after completion',
    alt: 'Aerial photo of a contemporary home with diagonal wood siding, a low slope shingle roof with two skylights, stepped upper roof sections, and a wooded hillside behind',
    service: 'roof-replacement',
    body: [
      'A contemporary home with several roof levels that step up the hillside, a low slope main section, and two skylights. Low slopes need ice and water barrier across the whole deck rather than just the eaves, and each skylight is reflashed with a new curb kit so the new shingles seal to it.',
      'The stepped upper sections drain onto the lower roof, so the wall flashing where they meet gets the same attention as the skylights.',
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
