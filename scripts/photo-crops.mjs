// Deliberate crops per breakpoint. Source photos stay untouched; crops are build inputs.
//
// Rectangles are written against the width the photo had when the crop was framed (`ref`). The script
// reads the source's real width and scales the rectangle by width / ref, so replacing a source with a
// sharper, larger version (up to 2880 px on the long edge) keeps the same framing at higher resolution.
import sharp from 'sharp';
const P = 'src/assets/photos';

async function cut(c) {
  const { width } = await sharp(`${P}/${c.src}`).metadata();
  const k = width / c.ref;
  const r = (n) => Math.round(n * k);
  const box = { left: r(c.left), top: r(c.top), width: r(c.width), height: r(c.height) };
  await sharp(`${P}/${c.src}`).extract(box).jpeg({ quality: 90, mozjpeg: true }).toFile(`${P}/crops/${c.out}`);
  console.log(c.out, box.width + 'x' + box.height, k === 1 ? '' : `(scaled ${k} from ${c.ref} px source)`);
}

const crops = [
  // Hero, wide desktop: the metal roof plane and its seams carry the composition.
  { src: 'standing-seam-metal-aerial.jpg', ref: 1920, out: 'hero-wide.jpg', left: 0, top: 120, width: 1920, height: 840 },
  // Hero, phones: tighter, taller crop centred on the roof.
  { src: 'standing-seam-metal-aerial.jpg', ref: 1920, out: 'hero-tall.jpg', left: 470, top: 0, width: 1080, height: 1080 },
  // Shingle texture detail for service and repair pages.
  { src: 'shingle-replacement-aerial.jpg', ref: 1920, out: 'shingle-detail.jpg', left: 560, top: 300, width: 1000, height: 750 },
  // Metal seam detail.
  { src: 'standing-seam-metal-aerial.jpg', ref: 1920, out: 'metal-detail.jpg', left: 760, top: 80, width: 800, height: 800 },
  // Gutters photo trimmed to the house.
  { src: 'seamless-gutters-brick-home.jpg', ref: 1320, out: 'gutters-wide.jpg', left: 0, top: 120, width: 1320, height: 760 },
  // Siding photo, 4:3 on the gable.
  { src: 'board-and-batten-siding.jpg', ref: 1920, out: 'siding-4x3.jpg', left: 240, top: 120, width: 1600, height: 1200 },
];
for (const c of crops) await cut(c);

// Second batch, September 29 2026.
const crops2 = [
  // New homepage hero: charcoal shingle replacement on a white board and batten home.
  { src: 'home-charcoal-shingles-aerial.jpg', ref: 1320, out: 'hero2-wide.jpg', left: 0, top: 40, width: 1320, height: 590 },
  { src: 'home-charcoal-shingles-aerial.jpg', ref: 1320, out: 'hero2-tall.jpg', left: 300, top: 0, width: 740, height: 740 },
  // Hip roof ridge and shingle texture from the blue ranch.
  { src: 'blue-brick-ranch-hip-roof-aerial.jpg', ref: 1920, out: 'hip-roof-detail.jpg', left: 300, top: 150, width: 1200, height: 900 },
];
for (const c of crops2) await cut(c);
