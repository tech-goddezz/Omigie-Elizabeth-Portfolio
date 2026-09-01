import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function createResume() {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Helper for adding a page
  const pageWidth = 595.28;
  const pageHeight = 841.89; // A4
  const margin = 45;
  const contentWidth = pageWidth - margin * 2;

  // PAGE 1
  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - 45;

  const drawText = (text: string, x: number, currentY: number, size: number, font: any, color = rgb(0.12, 0.12, 0.12)) => {
    page.drawText(text, { x, y: currentY, size, font, color });
  };

  const drawLine = (currentY: number) => {
    page.drawLine({
      start: { x: margin, y: currentY },
      end: { x: pageWidth - margin, y: currentY },
      thickness: 0.75,
      color: rgb(0.7, 0.7, 0.7),
    });
  };

  // Header
  drawText('OMIGIE ELIZABETH', margin, y, 20, fontBold, rgb(0.08, 0.08, 0.08));
  y -= 16;
  drawText('Frontend Developer & AI Product Engineer', margin, y, 11, fontBold, rgb(0.85, 0.35, 0.15));
  y -= 14;
  drawText('Lagos, Nigeria (Open to Remote/Hybrid) - techupwithliz@gmail.com - +234 808 281 7092', margin, y, 9, fontRegular, rgb(0.3, 0.3, 0.3));
  y -= 13;
  drawText('github.com/tech-goddezz - linkedin.com/in/elizabethomigie - elizabeth-personal-website-six.vercel.app', margin, y, 9, fontRegular, rgb(0.3, 0.3, 0.3));
  y -= 15;

  // Section helper
  const addSectionHeader = (title: string) => {
    y -= 8;
    drawText(title, margin, y, 11, fontBold, rgb(0.08, 0.08, 0.08));
    y -= 4;
    drawLine(y);
    y -= 14;
  };

  const addWrappedText = (text: string, x: number, size: number, font: any, color = rgb(0.2, 0.2, 0.2), maxWidth = contentWidth, lineSpacing = 12) => {
    const words = text.split(' ');
    let line = '';
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      const width = font.widthOfTextAtSize(testLine, size);
      if (width > maxWidth && line !== '') {
        drawText(line, x, y, size, font, color);
        y -= lineSpacing;
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) {
      drawText(line, x, y, size, font, color);
      y -= lineSpacing;
    }
  };

  const addBullet = (text: string) => {
    const bulletX = margin + 8;
    const textX = margin + 18;
    drawText('•', bulletX, y, 10, fontBold, rgb(0.2, 0.2, 0.2));
    const words = text.split(' ');
    let line = '';
    const maxWidth = contentWidth - 18;
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      const width = fontRegular.widthOfTextAtSize(testLine, 9);
      if (width > maxWidth && line !== '') {
        drawText(line, textX, y, 9, fontRegular, rgb(0.2, 0.2, 0.2));
        y -= 12;
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) {
      drawText(line, textX, y, 9, fontRegular, rgb(0.2, 0.2, 0.2));
      y -= 12;
    }
    y -= 2;
  };

  // CAREER SUMMARY
  addSectionHeader('CAREER SUMMARY');
  addWrappedText(
    'Frontend Developer and AI Product Engineer with hands-on experience designing and shipping responsive web and mobile applications, improving site performance and client retention, and integrating AI capabilities into real products. Background in Petroleum Engineering (B.Eng, University of Benin) brings a systematic, problem-first approach to building software. Also builds an audience as a technical content creator, translating complex engineering and AI concepts into accessible material for 1,500+ followers.',
    margin,
    9,
    fontRegular,
    rgb(0.2, 0.2, 0.2),
    contentWidth,
    13
  );

  // WORK EXPERIENCE
  addSectionHeader('WORK EXPERIENCE');

  // Job 1
  drawText('Frontend Developer, Product Team Project - Top Universe Community Program', margin, y, 9.5, fontBold, rgb(0.1, 0.1, 0.1));
  y -= 12;
  drawText('Cross-functional team collaboration - April 2026 - July 2026', margin, y, 8.5, fontItalic, rgb(0.4, 0.4, 0.4));
  y -= 12;
  addBullet('Collaborated with a cross-functional team of 2 designers, 1 backend developer, and 1 product manager to build the Instant Transfer Assurance feature for a GTCO GTWorld mobile banking app rebuild, addressing failed and uncertain interbank transfers.');
  addBullet('Owned frontend implementation using React Native, Expo Router, Zustand, and NativeWind, integrating with a Supabase backend.');
  addBullet('Participated in product research and team briefings to ground the feature in real user pain points before development began.');

  // Job 2
  y -= 3;
  drawText('Content Creator, TechUp with LIZ', margin, y, 9.5, fontBold, rgb(0.1, 0.1, 0.1));
  y -= 12;
  drawText('YouTube and Blog - December 2024 - Present', margin, y, 8.5, fontItalic, rgb(0.4, 0.4, 0.4));
  y -= 12;
  addBullet('Create educational videos and articles on frontend development, Web3, and AI, growing a community of 1,500+ followers on LinkedIn.');
  addBullet('Publish tutorials on React development, blockchain fundamentals, and productivity, maintaining high audience retention.');

  // Job 3
  y -= 3;
  drawText('Frontend Developer, promoted to Manager - V3 Design', margin, y, 9.5, fontBold, rgb(0.1, 0.1, 0.1));
  y -= 12;
  drawText('Aug 2024 - March 2025', margin, y, 8.5, fontItalic, rgb(0.4, 0.4, 0.4));
  y -= 12;
  addBullet('Designed and developed responsive web applications using React.js and Tailwind CSS, improving website performance by 35% and increasing client retention by 15%.');
  addBullet('Led an e-commerce redesign that increased user engagement by 25% and conversions by 20%.');
  addBullet('Promoted from Frontend Developer to Manager; led both technical delivery and team management initiatives.');
  addBullet('Used Excel for project tracking, performance analysis, and reporting to support data-driven decisions.');

  // Job 4
  y -= 3;
  drawText('Freelance Frontend Developer', margin, y, 9.5, fontBold, rgb(0.1, 0.1, 0.1));
  y -= 12;
  drawText('Remote - April 2023 - January 2024', margin, y, 8.5, fontItalic, rgb(0.4, 0.4, 0.4));
  y -= 12;
  addBullet('Designed and built responsive client websites, increasing user engagement by up to 30%.');
  addBullet('Developed and maintained a 3D developer portfolio site using React and Three.js with interactive animations.');
  addBullet('Delivered custom web solutions through iterative client feedback loops, achieving 100% client satisfaction.');

  // SELECTED INDEPENDENT PROJECTS
  addSectionHeader('SELECTED INDEPENDENT PROJECTS');
  drawText('DevClarity - AI-Powered Developer Thinking Assistant', margin, y, 9.5, fontBold, rgb(0.1, 0.1, 0.1));
  y -= 12;
  drawText('React, TypeScript, Vite, Groq API (Llama 3.3)', margin, y, 8.5, fontItalic, rgb(0.4, 0.4, 0.4));
  y -= 12;
  addBullet('Built a tool that helps developers structure their reasoning before writing code, using the Groq API with Llama 3.3 rather than functioning as a generic code generator.');
  addBullet('Owned the full build end-to-end - architecture, UI, and AI integration; deployed on Vercel.');

  // PAGE 2
  page = pdfDoc.addPage([pageWidth, pageHeight]);
  y = pageHeight - 45;

  drawText('Coalition Patient Dashboard - Healthcare Analytics', margin, y, 9.5, fontBold, rgb(0.1, 0.1, 0.1));
  y -= 12;
  drawText('React, Chart.js', margin, y, 8.5, fontItalic, rgb(0.4, 0.4, 0.4));
  y -= 12;
  addBullet('Built a healthcare dashboard for visualizing patient data trends using React and Chart.js.');

  y -= 4;
  drawText('Frontend Mentor Challenges - Applied UI Practice', margin, y, 9.5, fontBold, rgb(0.1, 0.1, 0.1));
  y -= 12;
  drawText('React, Tailwind CSS, Responsive Design', margin, y, 8.5, fontItalic, rgb(0.4, 0.4, 0.4));
  y -= 12;
  addBullet('Completed and deployed multiple real-world UI challenges - including a QR code component, four-card feature section, testimonials grid, recipe page, blog preview card, social links profile, and product preview card - each built to match provided design specs precisely.');

  // SKILLS
  addSectionHeader('SKILLS');
  drawText('Languages and Core: ', margin, y, 9, fontBold, rgb(0.1, 0.1, 0.1));
  drawText('JavaScript, TypeScript, HTML5, CSS3', margin + 110, y, 9, fontRegular, rgb(0.2, 0.2, 0.2));
  y -= 15;
  drawText('Frontend: ', margin, y, 9, fontBold, rgb(0.1, 0.1, 0.1));
  drawText('React.js, React Native (Expo Router), Tailwind CSS, NativeWind, Three.js', margin + 110, y, 9, fontRegular, rgb(0.2, 0.2, 0.2));
  y -= 15;
  drawText('State, Data and AI: ', margin, y, 9, fontBold, rgb(0.1, 0.1, 0.1));
  drawText('Zustand, Firebase, Supabase, Groq API, Llama 3.3', margin + 110, y, 9, fontRegular, rgb(0.2, 0.2, 0.2));
  y -= 15;
  drawText('Tools: ', margin, y, 9, fontBold, rgb(0.1, 0.1, 0.1));
  drawText('Git/GitHub, Figma, VS Code, Vite, Vercel, Render, Excel', margin + 110, y, 9, fontRegular, rgb(0.2, 0.2, 0.2));
  y -= 18;

  // ACHIEVEMENTS
  addSectionHeader('ACHIEVEMENTS');
  addBullet('Achieved 30% faster project delivery through optimized development workflows.');
  addBullet('Recognized for simplifying complex technical concepts for a LinkedIn audience of 1,500+ followers.');
  addBullet('Consistently surpassed client expectations across freelance and agency engagements.');

  // EDUCATION AND CERTIFICATIONS
  addSectionHeader('EDUCATION AND CERTIFICATIONS');
  drawText('B.Eng, Petroleum Engineering - University of Benin', margin, y, 9.5, fontBold, rgb(0.1, 0.1, 0.1));
  y -= 12;
  drawText('2018 - 2024', margin, y, 8.5, fontItalic, rgb(0.4, 0.4, 0.4));
  y -= 16;
  drawText('Frontend Web Development Certificate - Udacity', margin, y, 9.5, fontBold, rgb(0.1, 0.1, 0.1));
  y -= 12;
  drawText('February - August 2022', margin, y, 8.5, fontItalic, rgb(0.4, 0.4, 0.4));
  y -= 16;
  drawText('UI/UX Design Certification - Google Career Certificates', margin, y, 9.5, fontBold, rgb(0.1, 0.1, 0.1));
  y -= 12;
  drawText('2023', margin, y, 8.5, fontItalic, rgb(0.4, 0.4, 0.4));

  const pdfBytes = await pdfDoc.save();
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const assetsDir = path.resolve('assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'OMIGIE_ELIZABETH_RESUME.pdf'), pdfBytes);
  fs.writeFileSync(path.join(assetsDir, 'OMIGIE_ELIZABETH_RESUME.pdf'), pdfBytes);
  console.log('PDF generated successfully at public/OMIGIE_ELIZABETH_RESUME.pdf and assets/OMIGIE_ELIZABETH_RESUME.pdf');
}

createResume();
