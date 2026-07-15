/**
 * Programmatically generates a premium-looking shaded sofa image (base)
 * and its corresponding mask image as Data URLs.
 * This guarantees the project works out-of-the-box without external image files
 * and provides perfect pixel alignment and rich shadows/gradients.
 */

export interface SofaPlaceholders {
  base: string;
  mask: string;
}

export function generateSofaPlaceholders(): SofaPlaceholders {
  const width = 800;
  const height = 600;

  // --- 1. GENERATE BASE SOFA IMAGE ---
  const baseCanvas = document.createElement('canvas');
  baseCanvas.width = width;
  baseCanvas.height = height;
  const ctx = baseCanvas.getContext('2d')!;

  // Clear background (soft cream studio background)
  ctx.fillStyle = '#f5f2eb';
  ctx.fillRect(0, 0, width, height);

  // Studio lighting effect (soft radial light)
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width / 1.5);
  bgGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0.05)');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Soft floor shadow
  ctx.beginPath();
  const shadowGrad = ctx.createRadialGradient(width / 2, height - 120, 20, width / 2, height - 120, 320);
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.25)');
  shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.08)');
  shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = shadowGrad;
  ctx.ellipse(width / 2, height - 120, 320, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw Legs (Not colorized, so they should be excluded from the mask)
  // Left Leg
  ctx.fillStyle = '#bfa38a'; // Light oak wood
  ctx.beginPath();
  ctx.moveTo(250, height - 200);
  ctx.lineTo(230, height - 110);
  ctx.lineTo(245, height - 110);
  ctx.lineTo(270, height - 200);
  ctx.fill();
  // Wooden texture/shadow on leg
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.beginPath();
  ctx.moveTo(230, height - 110);
  ctx.lineTo(235, height - 110);
  ctx.lineTo(255, height - 200);
  ctx.lineTo(250, height - 200);
  ctx.fill();

  // Right Leg
  ctx.fillStyle = '#bfa38a';
  ctx.beginPath();
  ctx.moveTo(550, height - 200);
  ctx.lineTo(570, height - 110);
  ctx.lineTo(555, height - 110);
  ctx.lineTo(530, height - 200);
  ctx.fill();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.beginPath();
  ctx.moveTo(555, height - 110);
  ctx.lineTo(570, height - 110);
  ctx.lineTo(550, height - 200);
  ctx.lineTo(540, height - 200);
  ctx.fill();

  // Helper function to draw sofa parts with standard lighting
  const drawSofaPart = (
    drawFn: (c: CanvasRenderingContext2D) => void,
    baseColor: string,
    highlightOpacity: number,
    shadowOpacity: number
  ) => {
    // Save state
    ctx.save();
    
    // Create path
    ctx.beginPath();
    drawFn(ctx);
    ctx.closePath();
    
    // Fill base gray (neutral gray 200/300) so HSL tint works on standard luminosity
    ctx.fillStyle = baseColor;
    ctx.fill();

    // Highlights (simulate light from top-left)
    const hiGrad = ctx.createLinearGradient(150, 150, 650, 500);
    hiGrad.addColorStop(0, `rgba(255, 255, 255, ${highlightOpacity})`);
    hiGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    hiGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = hiGrad;
    ctx.fill();

    // Shadows (simulate shadow on bottom-right and creasing)
    const shGrad = ctx.createLinearGradient(150, 150, 650, 500);
    shGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    shGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
    shGrad.addColorStop(1, `rgba(0, 0, 0, ${shadowOpacity})`);
    ctx.fillStyle = shGrad;
    ctx.fill();

    ctx.restore();
  };

  // Sofa Part Paths
  const backrestPath = (c: CanvasRenderingContext2D) => {
    // Backrest
    c.roundRect(180, 200, 440, 200, [60, 60, 20, 20]);
  };

  const leftArmrestPath = (c: CanvasRenderingContext2D) => {
    // Left Armrest
    c.roundRect(120, 270, 90, 180, 40);
  };

  const rightArmrestPath = (c: CanvasRenderingContext2D) => {
    // Right Armrest
    c.roundRect(590, 270, 90, 180, 40);
  };

  const seatPath = (c: CanvasRenderingContext2D) => {
    // Seat Cushion
    c.roundRect(160, 360, 480, 100, 30);
  };

  // Draw the sofa parts on Base Canvas (neutral base fabric #b0b5bc)
  const baseGray = '#babec4';
  drawSofaPart(backrestPath, baseGray, 0.45, 0.45);
  drawSofaPart(leftArmrestPath, baseGray, 0.5, 0.35);
  drawSofaPart(rightArmrestPath, baseGray, 0.35, 0.5);
  drawSofaPart(seatPath, baseGray, 0.4, 0.455);

  // Add detail creases / stitching shadows
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.lineWidth = 2.5;
  
  // Cushion crease line
  ctx.beginPath();
  ctx.moveTo(180, 365);
  ctx.lineTo(620, 365);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.moveTo(180, 367);
  ctx.lineTo(620, 367);
  ctx.stroke();

  // Armrest inner shadows
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.beginPath();
  ctx.ellipse(210, 360, 8, 80, 0, 0, Math.PI * 2);
  ctx.ellipse(590, 360, 8, 80, 0, 0, Math.PI * 2);
  ctx.fill();

  const baseDataUrl = baseCanvas.toDataURL('image/png');

  // --- 2. GENERATE MASK IMAGE ---
  // The mask must be solid white (RGB 255, 255, 255) where the sofa body is,
  // and solid black (RGB 0, 0, 0) or transparent elsewhere.
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = width;
  maskCanvas.height = height;
  const mCtx = maskCanvas.getContext('2d')!;

  // Fill black (inactive area)
  mCtx.fillStyle = '#000000';
  mCtx.fillRect(0, 0, width, height);

  // Draw the parts of the sofa to be colored in white
  mCtx.fillStyle = '#ffffff';

  const drawMaskPart = (drawFn: (c: CanvasRenderingContext2D) => void) => {
    mCtx.beginPath();
    drawFn(mCtx);
    mCtx.closePath();
    mCtx.fill();
  };

  // Draw all body parts of the sofa to the mask (excluding legs and floor shadow)
  drawMaskPart(backrestPath);
  drawMaskPart(leftArmrestPath);
  drawMaskPart(rightArmrestPath);
  drawMaskPart(seatPath);

  const maskDataUrl = maskCanvas.toDataURL('image/png');

  return {
    base: baseDataUrl,
    mask: maskDataUrl,
  };
}
