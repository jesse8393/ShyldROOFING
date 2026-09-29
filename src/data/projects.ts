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
    slug: 'architectural-shingle-replacement',
    title: 'Architectural shingle replacement',
    summary: 'Multi building residential property, aerial after completion',
    alt: 'Aerial photo of new charcoal architectural shingles on a multi building brick and siding residential property, with dormers and ridge lines visible',
    service: 'roof-replacement',
    body: [
      'A full replacement across connected residential buildings with multiple gables, dormers, and pipe penetrations. Shot from above after the crew finished so the ridge lines, valleys, and flashing at every penetration are visible.',
      'Projects like this are scheduled in sections so residents keep access, with tear off and dry in completed on each section before the next begins.',
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
