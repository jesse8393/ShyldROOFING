import type { AreaSlug } from './business';
import type { Faq } from './faqs';

export interface LocationContent {
  slug: AreaSlug;
  name: string;
  county: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  /** Two or three paragraphs specific to the place. No invented offices or addresses. */
  local: string[];
  /** What the housing stock tends to need */
  needs: { name: string; text: string }[];
  nearby: AreaSlug[];
  faqs: Faq[];
}

const stormFaq = (place: string): Faq => ({
  q: `Do you inspect storm damage in ${place}?`,
  a: `<p>Yes. After hail or high wind in ${place} we inspect, photograph, and give you a written summary you can keep or share with your insurer. Read our <a href="/roof-storm-damage-insurance-tennessee">guide to storm damage and insurance claims</a> before you file anything.</p>`,
});

export const locationContent: Record<AreaSlug, LocationContent> = {
  franklin: {
    slug: 'franklin',
    name: 'Franklin',
    county: 'Williamson County',
    title: 'Roofing Contractor in Franklin, TN | SHYLD Roofing',
    description:
      'Roof replacement, repair, and metal roofing for Franklin, TN homeowners in Westhaven, Fieldstone Farms, Cool Springs, and the historic district. Free inspections.',
    h1: 'Roof repair and replacement in Franklin.',
    intro:
      'Franklin homes ask more of a roofer. Steep pitches, dormers, standing seam accents, and neighborhoods with review committees that care how a roof looks.',
    local: [
      'Franklin’s housing runs from pre war homes near Main Street and the historic district to large planned neighborhoods like Westhaven, Fieldstone Farms, and McKay’s Mill, with Cool Springs and Berry Farms growing quickly on the edges. Each brings its own roof: slate look shingles and metal porch roofs downtown, complex hip and gable layouts with multiple valleys in the newer subdivisions.',
      'Many Franklin neighborhoods have architectural review requirements for exterior changes, including roof color. We can supply the manufacturer product sheets and color samples an approval typically asks for.',
      'Williamson County sees the same spring and summer storms as the rest of Middle Tennessee. Because so many Franklin roofs have complicated shapes, wind damage tends to show up at the transitions first, in the valleys and around dormers.',
    ],
    needs: [
      { name: 'Complex roof shapes', text: 'Multiple valleys, dormers, and dead valleys need careful flashing and ice and water barrier placement. We photograph every one during the inspection.' },
      { name: 'Metal accents', text: 'Standing seam over porches, bays, and entries is common in Franklin. We install those in matching or contrasting metal alongside a shingle main roof.' },
      { name: 'Review committee approvals', text: 'We provide manufacturer product sheets and color samples for HOA or architectural review submissions.' },
    ],
    nearby: ['brentwood', 'nolensville', 'spring-hill', 'nashville'],
    faqs: [
      {
        q: 'Do you work inside Franklin HOA neighborhoods?',
        a: '<p>Yes. Westhaven, Fieldstone Farms, McKay’s Mill, and similar neighborhoods usually require an exterior change request for a new roof color. We supply what the submission needs and schedule around the approval.</p>',
      },
      stormFaq('Franklin'),
    ],
  },

  lebanon: {
    slug: 'lebanon',
    name: 'Lebanon',
    county: 'Wilson County',
    title: 'Roofing Contractor in Lebanon, TN | SHYLD Roofing',
    description:
      'Roof replacement, repair, metal roofing, siding, and gutters for Lebanon and Wilson County homeowners. Free inspections with photos and written proposals.',
    h1: 'Roof repair and replacement in Lebanon.',
    intro:
      'Lebanon mixes older homes around the square with fast growing subdivisions along Highway 109 and out toward Mt. Juliet. Roofs here range from simple gables on ranch homes to metal on farm properties, and we handle both.',
    local: [
      'The area around the Lebanon square and Cumberland University has some of the older housing in Wilson County, where roofs may hide multiple layers or original decking that needs attention during a replacement. Newer development along Highway 109, near the Nashville Superspeedway, and toward Hartmann Drive is dominated by ten to twenty year old architectural shingle roofs now reaching the age where hail and heat start to show.',
      'Wilson County has open land and long roof lines on rural properties, where metal roofing is a practical choice for barns, shops, and homes alike. We install standing seam and exposed fastener panels on both.',
      'Lebanon sits in the path of storms that track northeast out of Rutherford County. When a storm hits, we inspect and photograph the damage, and we note when a roof has simply aged out.',
    ],
    needs: [
      { name: 'Aging subdivision roofs', text: 'Roofs installed during the 2000s growth are reaching replacement age. We inspect, show you photos, and tell you whether to repair or replace.' },
      { name: 'Rural metal roofing', text: 'Long panel runs on farm properties, shops, and homes with simple roof shapes. Formed to length and installed with proper trim.' },
      { name: 'Gutters and drainage', text: 'Larger lots and long eaves need six inch gutters and well placed downspouts to keep water away from foundations.' },
    ],
    nearby: ['mt-juliet', 'nashville', 'smyrna', 'murfreesboro'],
    faqs: [
      {
        q: 'Do you serve rural Wilson County outside Lebanon city limits?',
        a: '<p>Yes. Call with the address and we will confirm. Most of Wilson County is comfortably within our range.</p>',
      },
      stormFaq('Lebanon'),
    ],
  },

  murfreesboro: {
    slug: 'murfreesboro',
    name: 'Murfreesboro',
    county: 'Rutherford County',
    title: 'Roofing Contractor in Murfreesboro, TN | SHYLD Roofing',
    description:
      'SHYLD Roofing is based in Murfreesboro. Roof replacement, repair, metal roofing, siding, and gutters for Rutherford County homeowners. Free inspections with photos.',
    h1: 'Roof repair and replacement in Murfreesboro.',
    intro:
      'Our home base. From the historic homes near the square and MTSU to the subdivisions off Veterans Parkway, Blackman, and Barfield, we know these roofs because we drive past them every day.',
    local: [
      'Murfreesboro grew fast through the 2000s and 2010s, so a large share of its roofs are architectural shingle installations now fifteen to twenty five years old. Neighborhoods in Blackman, Barfield, and along Veterans Parkway are seeing their first replacements, while older homes near downtown and the university often have complicated additions and multiple roof layers.',
      'Rutherford County gets frequent hail and straight line wind, and Murfreesboro homeowners see out of town crews arrive after every event. We are here year round, and our reputation in our own town matters more than any single job.',
      'Because we are based here, Murfreesboro inspections and repairs are the easiest for us to schedule. If water is coming in, call and ask.',
    ],
    needs: [
      { name: 'First replacements in newer neighborhoods', text: 'Many homes are at the age where the original builder grade roof is done. We show you what we find before recommending anything.' },
      { name: 'Additions and layered roofs', text: 'Older homes often have roofs added over roofs. A replacement takes everything down to the deck and fixes the flashing where additions meet.' },
      { name: 'Storm documentation', text: 'Inspection after hail, with photos you keep whether or not you file a claim.' },
    ],
    nearby: ['smyrna', 'la-vergne', 'christiana', 'rockvale', 'eagleville'],
    faqs: [
      {
        q: 'Do you have a showroom in Murfreesboro?',
        a: '<p>No. We are a field company and bring samples to your home during the inspection. Our mailing address is in Murfreesboro and our phone is answered locally.</p>',
      },
      stormFaq('Murfreesboro'),
    ],
  },

  smyrna: {
    slug: 'smyrna',
    name: 'Smyrna',
    county: 'Rutherford County',
    title: 'Roofing Contractor in Smyrna, TN | SHYLD Roofing',
    description:
      'Roof replacement and repair for Smyrna, TN homeowners from a crew based in nearby Murfreesboro. Free inspections with photos and written proposals.',
    h1: 'Roof repair and replacement in Smyrna.',
    intro:
      'Smyrna sits between Murfreesboro and Nashville along Interstate 24, with neighborhoods that have grown up around the Nissan plant, the airport, and Sam Ridley Parkway. We are minutes away.',
    local: [
      'Much of Smyrna’s housing was built in two waves, older ranch and split level homes near the town center and Lowry Street, and larger subdivisions from the 1990s onward around Stewartsboro, Rocky Fork, and Sam Ridley Parkway. The newer homes are reaching first replacement age; the older ones often need flashing and ventilation brought up to current practice during a replacement.',
      'Smyrna and La Vergne share the same weather as Murfreesboro. Hail events that hit one usually hit the others.',
    ],
    needs: [
      { name: 'Ventilation upgrades', text: 'Older Smyrna roofs frequently have turbine or box vents and little intake. A replacement is the time to add ridge and soffit ventilation.' },
      { name: 'Repair versus replace', text: 'Many roofs here are on the fence. We give you photos and a plain explanation of each option so you can decide.' },
      { name: 'Gutters with the roof', text: 'Adding seamless gutters during a replacement saves a second crew visit.' },
    ],
    nearby: ['la-vergne', 'murfreesboro', 'nashville', 'nolensville'],
    faqs: [
      {
        q: 'How far is Smyrna from your base?',
        a: '<p>About fifteen miles from Murfreesboro. Inspections and repairs in Smyrna are easy for us to schedule.</p>',
      },
      stormFaq('Smyrna'),
    ],
  },

  'la-vergne': {
    slug: 'la-vergne',
    name: 'La Vergne',
    county: 'Rutherford County',
    title: 'Roofing Contractor in La Vergne, TN | SHYLD Roofing',
    description:
      'Roof repair, replacement, siding, and gutters for La Vergne homeowners near Percy Priest Lake. Free inspections with photos from a Rutherford County roofing company.',
    h1: 'Roof repair and replacement in La Vergne.',
    intro:
      'La Vergne homes near Percy Priest Lake and along Murfreesboro Road see plenty of wind off the water and the usual Middle Tennessee hail. We inspect, repair, and replace roofs here from our base a few exits down the interstate.',
    local: [
      'La Vergne has a large stock of homes built from the 1980s through the 2000s, many with simple gable roofs that are straightforward to replace well. Neighborhoods like Lake Forest and the subdivisions off Waldron Road and Old Nashville Highway are at or past the age where original shingles are worn.',
      'Lakeside exposure means more wind. We pay extra attention to starter strips, sealing at the eaves, and ridge cap fastening on La Vergne roofs so the first course does not lift.',
    ],
    needs: [
      { name: 'Wind resistance', text: 'Proper starter strip, six nail patterns where the shingle allows, and sealed ridge caps for homes exposed to wind off the lake.' },
      { name: 'Full replacements', text: 'Straightforward gable roofs, the simplest shape to tear off and replace.' },
      { name: 'Siding and gutters', text: 'Older vinyl siding and undersized gutters are common. We can quote them with the roof.' },
    ],
    nearby: ['smyrna', 'murfreesboro', 'nashville', 'mt-juliet'],
    faqs: [
      {
        q: 'Do you handle vinyl siding replacement in La Vergne?',
        a: '<p>Yes. Vinyl, fiber cement, and board and batten, installed with the flashing details that matter where siding meets the roof. See our <a href="/siding">siding page</a>.</p>',
      },
      stormFaq('La Vergne'),
    ],
  },

  nashville: {
    slug: 'nashville',
    name: 'Nashville',
    county: 'Davidson County',
    title: 'Roofing Contractor in Nashville, TN | SHYLD Roofing',
    description:
      'Roof replacement, repair, and metal roofing for Nashville and Davidson County homeowners, from Antioch and Donelson to East Nashville. Free inspections with photos.',
    h1: 'Roof repair and replacement in Nashville.',
    intro:
      'From the bungalows of East Nashville to the newer neighborhoods in Antioch, Donelson, and Bellevue, Nashville roofs come in every age and shape. We serve the city from our base south of town.',
    local: [
      'Nashville’s older neighborhoods, including East Nashville, Inglewood, and parts of West Nashville, have homes from the 1920s through the 1960s with low slopes, additions, and porch roofs that need careful flashing and sometimes a different material on the low pitched sections. Southeast Nashville, Antioch, and Donelson have larger stocks of homes from the 1980s onward with roofs now at replacement age.',
      'Metal roofing has become popular on Nashville’s renovated homes and new builds, particularly standing seam on modern designs and porch roofs on restored bungalows. We install both.',
      'Nashville is the far end of our regular range. We serve Davidson County south and east of downtown most easily. Call with your address and we will tell you what scheduling looks like.',
    ],
    needs: [
      { name: 'Low slope sections', text: 'Porches and additions with pitches too low for shingles need a membrane or metal. We specify the right product for each section.' },
      { name: 'Modern metal', text: 'Standing seam on new builds and renovations, formed to length and installed with concealed fasteners.' },
      { name: 'Older home replacements', text: 'Multiple layers, original decking, and improvised flashing are common. We plan for them in the proposal.' },
    ],
    nearby: ['brentwood', 'la-vergne', 'smyrna', 'mt-juliet'],
    faqs: [
      {
        q: 'Which parts of Nashville do you serve?',
        a: '<p>Mostly southeast and south Nashville, Antioch, Donelson, and neighborhoods within easy reach of Interstate 24 and 65. We do take jobs elsewhere in Davidson County. Call and we will tell you plainly.</p>',
      },
      stormFaq('Nashville'),
    ],
  },

  brentwood: {
    slug: 'brentwood',
    name: 'Brentwood',
    county: 'Williamson County',
    title: 'Roofing Contractor in Brentwood, TN | SHYLD Roofing',
    description:
      'Roof replacement, repair, and standing seam metal for Brentwood, TN homes. Careful work on large, complex roofs with written proposals and a workmanship warranty.',
    h1: 'Roof repair and replacement in Brentwood.',
    intro:
      'Brentwood houses tend to be large, with steep pitches, multiple hips, and details that show from the street. The work has to be done carefully and it has to look right. That is the kind of job we like.',
    local: [
      'Neighborhoods like Governors Club, Brentwood Hills, Raintree Forest, and the estates off Franklin Road and Concord Road have roofs that can run three or four times the area of an average home, with many valleys, dormers, and chimneys. Replacement here is a multi day project that needs proper staging, protection for landscaping, and a crew that understands flashing at every transition.',
      'Premium products are common: heavier architectural or designer shingles, standing seam metal accents, and copper details. We source and install them and document everything in the proposal.',
      'Brentwood is within our regular Williamson County range alongside Franklin and Nolensville.',
    ],
    needs: [
      { name: 'Large, complex roofs', text: 'Careful staging, daily cleanup, and flashing at dozens of transitions. Photographed and documented as the work progresses.' },
      { name: 'Designer shingles and metal accents', text: 'Heavier shingle lines and standing seam accents, with samples brought to the inspection.' },
      { name: 'Landscape protection', text: 'Mature plantings and hardscape are protected before tear off starts.' },
    ],
    nearby: ['franklin', 'nolensville', 'nashville', 'spring-hill'],
    faqs: [
      {
        q: 'How long does a large Brentwood roof take?',
        a: '<p>Several days is typical for larger homes. Your proposal states the plan, and the roof is dried in at the end of every day.</p>',
      },
      stormFaq('Brentwood'),
    ],
  },

  nolensville: {
    slug: 'nolensville',
    name: 'Nolensville',
    county: 'Williamson County',
    title: 'Roofing Contractor in Nolensville, TN | SHYLD Roofing',
    description:
      'Roof replacement, repair, and metal roofing for Nolensville homeowners in Bent Creek, Burkitt Place, and along Nolensville Road. Free inspections with photos.',
    h1: 'Roof repair and replacement in Nolensville.',
    intro:
      'Nolensville has gone from a crossroads to a full town in about fifteen years, and the first wave of roofs from that growth is now due for attention.',
    local: [
      'Bent Creek, Burkitt Place, Winterset Woods, Scales Farmstead, and the newer developments along Nolensville Road and Rocky Fork Road were largely built between 2005 and 2020. Those roofs are entering the window where hail, heat, and builder grade materials start to show, and many homeowners are seeing their first repairs.',
      'Historic Nolensville along the old village strip has older homes with metal and shingle roofs that need a different approach, including care with original details.',
      'Nolensville sits between Brentwood, Franklin, and Smyrna, which puts it near the center of our regular service range.',
    ],
    needs: [
      { name: 'Builder grade roof replacements', text: 'Original three tab or light architectural shingles replaced with a heavier system and better ventilation.' },
      { name: 'Storm repairs', text: 'Open terrain around the newer subdivisions means wind damage is common. We repair the damage and tell you when a claim is worth considering.' },
      { name: 'HOA documentation', text: 'Product and color documentation for neighborhood approvals.' },
    ],
    nearby: ['brentwood', 'franklin', 'smyrna', 'murfreesboro'],
    faqs: [
      {
        q: 'My Nolensville roof is only twelve years old. Could it really need work?',
        a: '<p>It can, especially if it has taken hail. Builder installed roofs vary in quality. An inspection with photos tells you where it actually stands, and we will say so if it is fine.</p>',
      },
      stormFaq('Nolensville'),
    ],
  },

  'spring-hill': {
    slug: 'spring-hill',
    name: 'Spring Hill',
    county: 'Williamson and Maury Counties',
    title: 'Roofing Contractor in Spring Hill, TN | SHYLD Roofing',
    description:
      'Roof repair, replacement, and metal roofing for Spring Hill homeowners on both the Williamson and Maury County sides. Free inspections with photos.',
    h1: 'Roof repair and replacement in Spring Hill.',
    intro:
      'Spring Hill straddles Williamson and Maury Counties and has grown as fast as anywhere in Tennessee. Whole neighborhoods were roofed within a few years of each other, which means whole neighborhoods reach replacement age together.',
    local: [
      'Neighborhoods along Port Royal Road, Buckner Road, and Main Street, including developments near the Crossings and the GM plant, were largely built in the 2000s and 2010s. Many share the same roof age and the same exposure to storms rolling up from the southwest, so we often inspect several homes on one street.',
      'Because Spring Hill spans two counties, permitting and inspection requirements can differ by address. We sort that out as part of the proposal.',
      'Spring Hill is at the southern edge of our regular Williamson County range. Call and we will confirm scheduling for your address.',
    ],
    needs: [
      { name: 'Neighborhood wide replacements', text: 'Homes of the same age with the same builder roof. We inspect each one individually and never assume.' },
      { name: 'Storm damage', text: 'Open, newly developed land means exposure to wind. Photo documentation you can keep.' },
      { name: 'Two county permitting', text: 'We handle the right permit for the right county.' },
    ],
    nearby: ['franklin', 'brentwood', 'nolensville', 'eagleville'],
    faqs: [
      {
        q: 'Do you serve the Maury County side of Spring Hill?',
        a: '<p>Yes. Both sides of the county line are within our range. Call with the address and we will confirm.</p>',
      },
      stormFaq('Spring Hill'),
    ],
  },

  'mt-juliet': {
    slug: 'mt-juliet',
    name: 'Mt. Juliet',
    county: 'Wilson County',
    title: 'Roofing Contractor in Mt. Juliet, TN | SHYLD Roofing',
    description:
      'Roof replacement, repair, siding, and gutters for Mt. Juliet homeowners near Providence and Old Hickory Lake. Free inspections with photos from a local company.',
    h1: 'Roof repair and replacement in Mt. Juliet.',
    intro:
      'Mt. Juliet grew around Providence and Interstate 40 and now stretches toward Old Hickory Lake and Lebanon. Its roofs are mostly under twenty five years old, which makes the next few years busy ones for inspections and first replacements.',
    local: [
      'Subdivisions around Providence Marketplace, along Lebanon Road, and out Nonaville Road and Benders Ferry Road were built through the 2000s and 2010s. Roofs there are reaching the age where original architectural shingles show granule loss and hail bruising. Older homes near Old Hickory Lake see more wind and often have additions with tricky transitions.',
      'Mt. Juliet is on the Wilson County side of our range along with Lebanon.',
    ],
    needs: [
      { name: 'First replacements', text: 'Original roofs from the growth years replaced with heavier shingles and ridge ventilation.' },
      { name: 'Lakeside wind', text: 'Extra attention to sealing and fastening on homes exposed to Old Hickory Lake.' },
      { name: 'Gutters and guards', text: 'Tree cover near the lake makes guards worthwhile on many homes.' },
    ],
    nearby: ['lebanon', 'nashville', 'la-vergne', 'smyrna'],
    faqs: [
      {
        q: 'Do you serve the Old Hickory Lake area of Mt. Juliet?',
        a: '<p>Yes, including the neighborhoods off Nonaville Road and Benders Ferry Road. Call with the address and we will confirm.</p>',
      },
      stormFaq('Mt. Juliet'),
    ],
  },

  shelbyville: {
    slug: 'shelbyville',
    name: 'Shelbyville',
    county: 'Bedford County',
    title: 'Roofing Contractor in Shelbyville, TN | SHYLD Roofing',
    description:
      'Roof replacement, repair, and metal roofing for Shelbyville and Bedford County. Metal for farm properties, shingles for town homes, free inspections with photos.',
    h1: 'Roof repair and replacement in Shelbyville.',
    intro:
      'Shelbyville is horse country and small town Tennessee, with older homes near the square, newer subdivisions on the north side, and plenty of farm properties where metal is the sensible roof. We serve all three.',
    local: [
      'Homes around the Shelbyville square and along Madison Street include older houses with steep pitches and original details, while growth along Highway 231 toward Murfreesboro has added newer subdivisions with standard architectural shingle roofs. Outside town, Bedford County is farms, barns, and long roof lines where exposed fastener and standing seam metal are common.',
      'Shelbyville is the southern end of our service range, about thirty minutes from Murfreesboro. We schedule Bedford County work in blocks so a crew is in the area for several jobs at once.',
    ],
    needs: [
      { name: 'Farm and outbuilding metal', text: 'Exposed fastener panels for barns and shops, standing seam for homes, formed to length.' },
      { name: 'Older town homes', text: 'Steep roofs with original details that need careful tear off and flashing.' },
      { name: 'Storm repairs', text: 'Wind and hail damage inspected and repaired, with photo documentation.' },
    ],
    nearby: ['murfreesboro', 'christiana', 'eagleville', 'rockvale'],
    faqs: [
      {
        q: 'Do you roof barns and shops in Bedford County?',
        a: '<p>Yes. Exposed fastener metal is the usual choice for outbuildings and we install it along with the trim and closures that keep it weathertight.</p>',
      },
      stormFaq('Shelbyville'),
    ],
  },

  eagleville: {
    slug: 'eagleville',
    name: 'Eagleville',
    county: 'Rutherford County',
    title: 'Roofing Contractor in Eagleville, TN | SHYLD Roofing',
    description:
      'Roof replacement, repair, and metal roofing for Eagleville and southwest Rutherford County. Rural homes and farms, with free inspections from a Murfreesboro company.',
    h1: 'Roof repair and replacement in Eagleville.',
    intro:
      'Eagleville is small, rural, and a short drive from our base. Most of the work here is on homes with generous roofs, farm buildings, and the occasional storm repair after weather comes over the ridge from the southwest.',
    local: [
      'Eagleville and the surrounding countryside along Highway 41A and toward College Grove and Chapel Hill have homes on acreage, many with metal roofs already and many more considering metal for the next replacement. Long, simple roof runs make standing seam practical here.',
      'Because storms often enter Rutherford County from this direction, Eagleville sees wind damage before Murfreesboro does.',
    ],
    needs: [
      { name: 'Metal on rural homes', text: 'Standing seam or exposed fastener panels on homes and outbuildings with long runs.' },
      { name: 'Wind repairs', text: 'Lifted shingles and ridge caps after storms, repaired and photographed.' },
      { name: 'Gutters for big roofs', text: 'Six inch gutters and enough downspouts for large roof areas.' },
    ],
    nearby: ['rockvale', 'murfreesboro', 'spring-hill', 'shelbyville'],
    faqs: [
      {
        q: 'How far out of Eagleville do you go?',
        a: '<p>Into College Grove, Chapel Hill, and the surrounding countryside within reason. Call with the address and we will tell you whether we can take the job.</p>',
      },
      stormFaq('Eagleville'),
    ],
  },

  christiana: {
    slug: 'christiana',
    name: 'Christiana',
    county: 'Rutherford County',
    title: 'Roofing Contractor in Christiana, TN | SHYLD Roofing',
    description:
      'Roof repair, replacement, and metal roofing for Christiana and south Rutherford County. Minutes from our Murfreesboro base, with free inspections.',
    h1: 'Roof repair and replacement in Christiana.',
    intro:
      'Christiana is where Murfreesboro’s subdivisions give way to farms along Highway 231 South. It is one of the closest communities to our base.',
    local: [
      'Housing in Christiana ranges from newer subdivisions on the south edge of Murfreesboro, near Epps Mill Road and Barfield Crescent Road, to established homes on acreage along Shelbyville Pike. The subdivision roofs are typical architectural shingles at or near replacement age; the rural homes often have metal or are candidates for it.',
      'Storms that hit Murfreesboro usually hit Christiana too.',
    ],
    needs: [
      { name: 'Quick access', text: 'Christiana is one of the easiest places for us to reach for repairs.' },
      { name: 'Subdivision replacements', text: 'Homes from the 2000s growth with original shingles nearing the end of their life.' },
      { name: 'Rural metal', text: 'Standing seam and exposed fastener metal for homes and outbuildings on larger lots.' },
    ],
    nearby: ['murfreesboro', 'rockvale', 'shelbyville', 'eagleville'],
    faqs: [
      {
        q: 'Is Christiana inside your normal range?',
        a: '<p>Yes. It is minutes from our Murfreesboro base and one of the areas we reach most easily.</p>',
      },
      stormFaq('Christiana'),
    ],
  },

  rockvale: {
    slug: 'rockvale',
    name: 'Rockvale',
    county: 'Rutherford County',
    title: 'Roofing Contractor in Rockvale, TN | SHYLD Roofing',
    description:
      'Roof replacement, repair, metal roofing, and gutters for Rockvale and west Rutherford County. Rural homes and new subdivisions. Free inspections.',
    h1: 'Roof repair and replacement in Rockvale.',
    intro:
      'Rockvale sits west of Murfreesboro along Highway 99, a mix of new subdivisions and older homes on land. It is close to our base, and its open terrain leaves roofs exposed to wind.',
    local: [
      'New development along Highway 99 and Franklin Road has brought subdivisions to Rockvale in the last decade, while much of the area remains farms and homes on acreage. New roofs there are still young, but builder grade materials and open exposure mean the first repairs often come earlier than owners expect.',
      'Rockvale is on the way to Eagleville from Murfreesboro, and we frequently combine work in both.',
    ],
    needs: [
      { name: 'Wind and hail repairs', text: 'Open terrain, frequent wind. Repairs done properly and documented with photos.' },
      { name: 'Rural metal roofing', text: 'Homes and outbuildings with long runs suited to metal panels.' },
      { name: 'Gutters on new homes', text: 'Builder gutters are often undersized. We replace them with properly sized seamless runs.' },
    ],
    nearby: ['murfreesboro', 'eagleville', 'christiana', 'nolensville'],
    faqs: [
      {
        q: 'My new home in Rockvale already has a leak. Is that normal?',
        a: '<p>Not normal, but not rare. Builder roofs are sometimes installed quickly. Check whether the builder warranty still applies first, then call us for an inspection with photos you can use either way.</p>',
      },
      stormFaq('Rockvale'),
    ],
  },
};
