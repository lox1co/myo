import sharp from 'sharp';
import path from 'path';

async function convert() {
  const svgPath = path.resolve('public/favicon.svg');
  const pngPath = path.resolve('public/favicon.png');

  try {
    await sharp(svgPath)
      .resize(512, 512)
      .png()
      .toFile(pngPath);
    console.log('Favicon SVG to PNG conversion complete: ' + pngPath);
  } catch (err) {
    console.error('Error during SVG-to-PNG conversion:', err);
    process.exit(1);
  }
}

convert();
