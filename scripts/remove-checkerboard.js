import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function main() {
  const brainDir = 'C:\\Users\\Usuario\\.gemini\\antigravity\\]brain\\36658d56-8992-477f-8791-74ae4ae50186';
  
  // Hardcoded absolute fallback paths first just in case
  const resolvedBrainDir = 'C:/Users/Usuario/.gemini/antigravity/brain/36658d56-8992-477f-8791-74ae4ae50186';

  // Find the latest media__*.jpg or png
  const files = fs.readdirSync(resolvedBrainDir)
    .filter(f => f.startsWith('media__') && (f.endsWith('.jpg') || f.endsWith('.png')))
    .map(f => ({
      name: f,
      time: fs.statSync(path.join(resolvedBrainDir, f)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time);

  if (files.length === 0) {
    console.error('No media files found.');
    process.exit(1);
  }

  const latestFile = path.join(resolvedBrainDir, files[0].name);
  console.log('Processing latest uploaded logo: ' + latestFile);

  const outputPath = path.resolve('public/favicon.png');

  try {
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

    // Flood Fill Algorithm to remove the checkerboard background
    const visited = new Uint8Array(width * height);
    const queue = [];

    // Add corners to the queue
    const addPixel = (x, y) => {
      const idx = y * width + x;
      if (!visited[idx]) {
        visited[idx] = 1;
        queue.push([x, y]);
      }
    };

    // Initialize queue with border pixels
    for (let x = 0; x < width; x++) {
      addPixel(x, 0);
      addPixel(x, height - 1);
    }
    for (let y = 0; y < height; y++) {
      addPixel(0, y);
      addPixel(width - 1, y);
    }

    let head = 0;
    while (head < queue.length) {
      const [cx, cy] = queue[head++];
      
      // Check 4-neighbors
      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1]
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIdx = ny * width + nx;
          if (!visited[nIdx]) {
            const pIdx = nIdx * 4;
            const r = data[pIdx];
            const g = data[pIdx + 1];
            const b = data[pIdx + 2];

            // A pixel is part of the checkerboard background if:
            // 1. It is neutral (R, G, B are very close)
            // 2. It is relatively bright (average R, G, B > 100)
            const maxVal = Math.max(r, g, b);
            const minVal = Math.min(r, g, b);
            const avgVal = (r + g + b) / 3;

            // Checkerboard is neutral shades (white/gray)
            const isNeutral = (maxVal - minVal) < 20;
            const isBright = avgVal > 95;

            if (isNeutral && isBright) {
              visited[nIdx] = 1;
              queue.push([nx, ny]);
            }
          }
        }
      }
    }

    // Apply transparency to all visited pixels
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        if (visited[idx] === 1) {
          const pIdx = idx * 4;
          data[pIdx + 3] = 0; // Set Alpha to 0 (Transparent)
        }
      }
    }

    // Save processed image back as PNG
    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
      .resize(512, 512)
      .png()
      .toFile(outputPath);

    console.log('Successfully saved transparent logo to: ' + outputPath);
  } catch (err) {
    console.error('Error removing checkerboard background:', err);
    process.exit(1);
  }
}

main();
