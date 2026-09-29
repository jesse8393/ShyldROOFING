// Cut a full page screenshot into viewport sized slices for review.
import sharp from 'sharp';
const [file, heightArg] = process.argv.slice(2);
const h = Number(heightArg || 900);
const meta = await sharp(file).metadata();
const n = Math.ceil(meta.height / h);
for (let i = 0; i < n; i++) {
  const top = i * h;
  const height = Math.min(h, meta.height - top);
  await sharp(file).extract({ left: 0, top, width: meta.width, height }).toFile(file.replace('.jpg', `-s${i + 1}.png`));
}
console.log(n, 'slices');
