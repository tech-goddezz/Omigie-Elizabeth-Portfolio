const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');

// Register TrueType fonts
GlobalFonts.registerFromPath('/tmp/fonts/InstrumentSerif-Italic.ttf', 'Instrument Serif');
GlobalFonts.registerFromPath('/tmp/fonts/PlusJakartaSans-ExtraBold.ttf', 'Plus Jakarta Sans ExtraBold');
GlobalFonts.registerFromPath('/tmp/fonts/PlusJakartaSans-Bold.ttf', 'Plus Jakarta Sans Bold');
GlobalFonts.registerFromPath('/tmp/fonts/PlusJakartaSans-Medium.ttf', 'Plus Jakarta Sans Medium');

async function buildBanner() {
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. Base dark atmosphere background matching portfolio
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#060609');
  bgGrad.addColorStop(0.45, '#08080D');
  bgGrad.addColorStop(1, '#0C0A14');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle grid/mesh accent in top-left
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.018)';
  ctx.lineWidth = 1;
  for (let x = 40; x < 650; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 40; y < height; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(650, y);
    ctx.stroke();
  }
  ctx.restore();

  // 2. Ambient neon glow behind the subject
  // Purple ambient glow
  const purpleGlow = ctx.createRadialGradient(925, 290, 20, 925, 290, 420);
  purpleGlow.addColorStop(0, 'rgba(124, 58, 237, 0.26)');
  purpleGlow.addColorStop(0.55, 'rgba(124, 58, 237, 0.08)');
  purpleGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = purpleGlow;
  ctx.fillRect(500, 0, 700, height);

  // Warm orange rim glow
  const orangeGlow = ctx.createRadialGradient(1080, 430, 20, 1080, 430, 320);
  orangeGlow.addColorStop(0, 'rgba(255, 77, 26, 0.18)');
  orangeGlow.addColorStop(0.65, 'rgba(255, 77, 26, 0.04)');
  orangeGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = orangeGlow;
  ctx.fillRect(600, 0, 600, height);

  // 3. Load the exact high-res photo of Elizabeth (1920x1080)
  const heroImg = await loadImage('/tmp/hero_so35.jpg');

  // Precise subject cropping to place face and visor at (925, 315) without any distortion or restyling
  // Source frame is 1920x1080. Head starts at y=27, visor at x=865, y=630.
  const sWidth = 1100;
  const sHeight = 1000;
  const sx = 865 - sWidth / 2; // 315
  const sy = 35;

  const dHeight = height; // 630
  const dWidth = Math.round(sWidth * (dHeight / sHeight)); // 693
  const dx = 565; // places visor center at 565 + (865 - 315) * 0.63 = 911
  const dy = 0;

  ctx.drawImage(heroImg, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

  // Seamless natural fade on the left of character so text remains crystal clear
  const blendGrad = ctx.createLinearGradient(dx - 50, 0, dx + 220, 0);
  blendGrad.addColorStop(0, '#060609');
  blendGrad.addColorStop(0.35, '#08080Df2');
  blendGrad.addColorStop(0.7, '#08080D88');
  blendGrad.addColorStop(1, 'rgba(8, 8, 13, 0)');
  ctx.fillStyle = blendGrad;
  ctx.fillRect(dx - 50, 0, 270, height);

  // Atmospheric top and bottom vignette
  const edgeTop = ctx.createLinearGradient(0, 0, 0, 90);
  edgeTop.addColorStop(0, 'rgba(6, 6, 9, 0.9)');
  edgeTop.addColorStop(1, 'rgba(6, 6, 9, 0)');
  ctx.fillStyle = edgeTop;
  ctx.fillRect(0, 0, width, 90);

  const edgeBottom = ctx.createLinearGradient(0, height - 90, 0, height);
  edgeBottom.addColorStop(0, 'rgba(6, 6, 9, 0)');
  edgeBottom.addColorStop(1, 'rgba(6, 6, 9, 0.95)');
  ctx.fillStyle = edgeBottom;
  ctx.fillRect(0, height - 90, width, 90);

  // -------------------------------------------------------------
  // Left Column Content: Portfolio branding & typography
  // -------------------------------------------------------------
  const leftX = 72;

  // 1. Top Brand Row: 4 orange tiles + "Litz." + Opportunities pill
  const logoX = leftX;
  const logoY = 66;
  const tileSize = 8;
  const tileGap = 3;

  ctx.fillStyle = '#FF4D1A';
  ctx.fillRect(logoX, logoY, tileSize, tileSize);
  ctx.fillStyle = '#FF6E38';
  ctx.fillRect(logoX + tileSize + tileGap, logoY, tileSize, tileSize);
  ctx.fillStyle = '#FFA14A';
  ctx.fillRect(logoX, logoY + tileSize + tileGap, tileSize, tileSize);
  ctx.fillStyle = '#FF4D1A';
  ctx.fillRect(logoX + tileSize + tileGap, logoY + tileSize + tileGap, tileSize, tileSize);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 22px "Plus Jakarta Sans ExtraBold", sans-serif';
  ctx.fillText('Litz.', logoX + 28, logoY + 16);

  // Status Pill: "Available for New Opportunities"
  const pillX = logoX + 110;
  const pillY = logoY - 4;
  const pillW = 246;
  const pillH = 30;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, 15);
  ctx.fillStyle = 'rgba(255, 77, 26, 0.08)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 77, 26, 0.32)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Pulsing orange dot
  ctx.beginPath();
  ctx.arc(pillX + 16, pillY + 15, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#FF6E38';
  ctx.shadowColor = '#FF4D1A';
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#E4E4E7';
  ctx.font = '500 12px "Plus Jakarta Sans Medium", sans-serif';
  ctx.fillText('Available for New Opportunities', pillX + 28, pillY + 19);

  // 2. Eyebrow Role Line
  const eyebrowY = 168;
  ctx.fillStyle = '#FF4D1A';
  ctx.fillRect(leftX, eyebrowY - 6, 26, 3);

  ctx.fillStyle = '#FFA14A';
  ctx.font = '700 13px "Plus Jakarta Sans Bold", sans-serif';
  ctx.fillText('AI PRODUCT ENGINEER  •  FRONTEND DEVELOPER', leftX + 38, eyebrowY);

  // 3. Grand Title: "OMIGIE ELIZABETH"
  const nameY = 248;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 58px "Plus Jakarta Sans ExtraBold", sans-serif';
  ctx.fillText('OMIGIE', leftX, nameY);

  const omigieWidth = ctx.measureText('OMIGIE').width;

  // Italic Serif "ELIZABETH" with fiery orange-red gradient
  const lizX = leftX + omigieWidth + 18;
  const nameGrad = ctx.createLinearGradient(lizX, nameY - 40, lizX + 260, nameY);
  nameGrad.addColorStop(0, '#FF4D1A');
  nameGrad.addColorStop(0.5, '#FF6E38');
  nameGrad.addColorStop(1, '#FFA14A');
  ctx.fillStyle = nameGrad;
  ctx.font = 'italic 400 68px "Instrument Serif", serif';
  ctx.fillText('ELIZABETH', lizX, nameY);

  // 4. Headline: "BUILDING DIGITAL EXPERIENCES WITH AI AT THE CORE"
  const tagY = 310;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 17px "Plus Jakarta Sans Bold", sans-serif';
  ctx.fillText('BUILDING DIGITAL EXPERIENCES WITH AI AT THE CORE', leftX, tagY);

  // 5. Bio Statement
  const bioY = 358;
  ctx.fillStyle = '#A1A1AA';
  ctx.font = '500 16px "Plus Jakarta Sans Medium", sans-serif';
  ctx.fillText('I build fast, thoughtful frontends and AI-powered product', leftX, bioY);
  ctx.fillText('experiences — from Figma to shipped code.', leftX, bioY + 26);

  // 6. Footer Badges: Domain Pill + Core Tech Stack
  const footerY = 478;

  // Domain Pill
  const domainPillW = 345;
  const pillHeight = 44;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(leftX, footerY, domainPillW, pillHeight, 12);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Subtle violet indicator dot
  ctx.beginPath();
  ctx.arc(leftX + 20, footerY + 22, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = '#A855F7';
  ctx.shadowColor = '#7C3AED';
  ctx.shadowBlur = 6;
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#F4F4F5';
  ctx.font = '600 14px "Plus Jakarta Sans Bold", sans-serif';
  ctx.fillText('omigie-elizabeth-portfolio.vercel.app', leftX + 36, footerY + 27);

  // Tech stack pills
  const techStack = ['TypeScript', 'React', 'AI Product'];
  let techX = leftX + domainPillW + 14;
  for (const tech of techStack) {
    ctx.font = '600 12.5px "Plus Jakarta Sans Bold", sans-serif';
    const textW = ctx.measureText(tech).width;
    const badgeW = textW + 24;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(techX, footerY, badgeW, pillHeight, 12);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#D4D4D8';
    ctx.fillText(tech, techX + 12, footerY + 27);
    ctx.restore();

    techX += badgeW + 10;
  }

  // 7. Outer frame border for crisp contrast on light/dark social media feeds
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, width - 2, height - 2);
  ctx.restore();

  // Output to public/og-image.png
  const destPath = path.join(process.cwd(), 'public', 'og-image.png');
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(destPath, buffer);
  console.log(`Generated and saved ${destPath} (${buffer.length} bytes, 1200x630px)`);
}

buildBanner().catch(err => {
  console.error(err);
  process.exit(1);
});
