// Generates favicon, touch icon, and social share image from source assets.
import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const shield = await readFile('public/brand/shyld-shield-gold.svg');

// Favicon (32px) and apple touch icon (180px, warm paper background with shield)
async function icon(size, pad, out, bg) {
  const inner = Math.round(size - pad * 2);
  const shieldPng = await sharp(shield).resize({ height: inner, fit: 'inside' }).png().toBuffer();
  const meta = await sharp(shieldPng).metadata();
  const left = Math.round((size - meta.width) / 2);
  await sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: shieldPng, top: pad, left }])
    .png()
    .toFile(out);
}
await icon(32, 2, 'public/favicon-32.png', { r: 23, g: 24, b: 23, alpha: 1 });
await icon(180, 22, 'public/apple-touch-icon.png', { r: 247, g: 244, b: 238, alpha: 1 });
await icon(192, 24, 'public/icon-192.png', { r: 247, g: 244, b: 238, alpha: 1 });
await icon(512, 64, 'public/icon-512.png', { r: 247, g: 244, b: 238, alpha: 1 });

// favicon.ico: wrap the 32px PNG in an ICO container (PNG-in-ICO is supported by modern browsers).
const png32 = await readFile('public/favicon-32.png');
const header = Buffer.alloc(6 + 16);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt8(0, 8);
header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png32.length, 14);
header.writeUInt32LE(22, 18);
await writeFile('public/favicon.ico', Buffer.concat([header, png32]));

// Social share image 1200x630 from the metal roof aerial with a quiet wordmark strip.
await mkdir('public/og', { recursive: true });
const logo = await readFile('public/brand/shyld-primary-white.svg');
const logoPng = await sharp(logo).resize({ width: 360 }).png().toBuffer();
await sharp('src/assets/photos/home-charcoal-shingles-aerial.jpg')
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .composite([
    { input: Buffer.from('<svg width="1200" height="630"><rect x="0" y="470" width="1200" height="160" fill="#171817" fill-opacity="0.82"/></svg>'), top: 0, left: 0 },
    { input: logoPng, top: 512, left: 64 },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/og/shyld-roofing.jpg');

console.log('brand assets written');
