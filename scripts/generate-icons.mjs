import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const svgPath = path.join(rootDir, 'scripts', 'icon-source.svg');

async function render(outPath, size, { inset = 0 } = {}) {
  await mkdir(path.dirname(outPath), { recursive: true });

  const canvas = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 14, g: 17, b: 23, alpha: 1 } // #0e1117
    }
  });

  const markSize = Math.round(size * (1 - inset * 2));
  const markBuffer = await sharp(svgPath).resize(markSize, markSize).toBuffer();

  await canvas
    .composite([{ input: markBuffer, left: Math.round(size * inset), top: Math.round(size * inset) }])
    .png()
    .toFile(outPath);

  console.log(`wrote ${path.relative(rootDir, outPath)}`);
}

await render(path.join(rootDir, 'public', 'icons', 'icon-192.png'), 192);
await render(path.join(rootDir, 'public', 'icons', 'icon-512.png'), 512);
// Maskable icons need the mark inset ~10% so it survives OS-level circle/squircle cropping
await render(path.join(rootDir, 'public', 'icons', 'icon-512-maskable.png'), 512, { inset: 0.1 });
await render(path.join(rootDir, 'src', 'app', 'icon.png'), 512);
await render(path.join(rootDir, 'src', 'app', 'apple-icon.png'), 180);
