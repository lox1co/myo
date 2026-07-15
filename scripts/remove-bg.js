import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function main() {
  const brainDir = 'C:\\Users\\Usuario\\.gemini\\antigravity\\brain\\36658d56-8992-477f-8791-74ae4ae50186';
  
  // Find all media__*.png files
  const files = fs.readdirSync(brainDir)
    .filter(f => f.startsWith('media__') && f.endsWith('.png'))
    .map(f => ({
      name: f,
      time: fs.statSync(path.join(brainDir, f)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time);

  if (files.length === 0) {
    console.error('No user uploaded media files found in brain directory.');
    process.exit(1);
  }

  const latestFile = path.join(brainDir, files[0].name);
  console.log('Using source image: ' + latestFile);

  const outputPath = path.resolve('public/favicon.png');

  try {
    // Read metadata first
    const image = sharp(latestFile);
    const { width, height } = await image.metadata();

    if (!width || !height) {
      throw new Error('Invalid image dimensions');
    }

    // Get raw pixel buffer (RGBA)
    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Process pixels to remove white background with soft anti-aliasing
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Calculate brightness
      const brightness = (r + g + b) / 3;

      // Threshold: if pixel is white or near-white, make it transparent
      if (brightness > 248) {
        // High threshold: fully transparent
        data[i + 3] = 0;
      } else if (brightness > 240) {
        // Smooth transition zone (anti-aliasing)
        const factor = (248 - brightness) / (248 - 240);
        data[i + 3] = Math.min(a, Math.round(factor * 255));
      }
    }

    // Save back to PNG
    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
      .resize(512, 512) // Resize to standard high-res favicon size
      .png()
      .toFile(outputPath);

    console.log('Successfully saved transparent favicon to: ' + outputPath);
  } catch (err) {
    console.error('Error processing background removal:', err);
    process.exit(1);
  }
}

main();
