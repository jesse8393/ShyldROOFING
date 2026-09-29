// Deliberate crops per breakpoint. Source photos stay untouched; crops are build inputs.
import sharp from 'sharp';
const P = 'src/assets/photos';
const crops = [
  // Hero, wide desktop: the metal roof plane and its seams carry the composition.
  { src: 'standing-seam-metal-aerial.jpg', out: 'hero-wide.jpg', left: 0, top: 120, width: 1920, height: 840 },
  // Hero, phones: tighter, taller crop centred on the roof.
  { src: 'standing-seam-metal-aerial.jpg', out: 'hero-tall.jpg', left: 470, top: 0, width: 1080, height: 1080 },
  // Shingle texture detail for service and repair pages.
  { src: 'shingle-replacement-aerial.jpg', out: 'shingle-detail.jpg', left: 560, top: 300, width: 1000, height: 750 },
  // Metal seam detail.
  { src: 'standing-seam-metal-aerial.jpg', out: 'metal-detail.jpg', left: 760, top: 80, width: 800, height: 800 },
  // Gutters photo trimmed to the house.
  { src: 'seamless-gutters-brick-home.jpg', out: 'gutters-wide.jpg', left: 0, top: 120, width: 1320, height: 760 },
  // Siding photo, 4:3 on the gable.
  { src: 'board-and-batten-siding.jpg', out: 'siding-4x3.jpg', left: 240, top: 120, width: 1600, height: 1200 },
];
for (const c of crops) {
  await sharp(`${P}/${c.src}`).extract({ left: c.left, top: c.top, width: c.width, height: c.height }).jpeg({ quality: 90, mozjpeg: true }).toFile(`${P}/crops/${c.out}`);
  console.log(c.out, c.width + 'x' + c.height);
}
