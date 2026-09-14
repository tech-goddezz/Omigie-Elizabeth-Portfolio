import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import {
  personalInfo,
  careerSummary,
  experience,
  selectedProjects,
  skills,
  achievements,
  education,
} from '../src/data/resumeData';

async function createResume() {
  const pdfDoc = await PDFDocument.create();

  // Embed standard Helvetica fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const pageWidth = 595.28;  // A4
  const pageHeight = 841.89; // A4
  const margin = 40;
  const contentWidth = pageWidth - margin * 2; // 515.28 pt

  // Two-column layout geometry for Page 1
  const colGap = 20;
  const leftColWidth = 325; // ~63% of content
  const rightColWidth = contentWidth - leftColWidth - colGap; // 170.28 pt (~33%)
  const rightColX = margin + leftColWidth + colGap; // 385 pt

  // Precise color palette matching reference design
  const tealColor = rgb(0.0, 0.47, 0.42);      // #00786C
  const darkCharcoal = rgb(0.08, 0.08, 0.08);
  const bodyColor = rgb(0.18, 0.18, 0.18);
  const subTextColor = rgb(0.35, 0.35, 0.35);
  const lineRuleColor = rgb(0.85, 0.85, 0.85);

  // PAGE 1
  const page1 = pdfDoc.addPage([pageWidth, pageHeight]);
  let headerY = pageHeight - 40;

  // Header helpers (full width across top)
  const drawHeaderText = (
    text: string,
    x: number,
    y: number,
    size: number,
    font: typeof fontRegular,
    color = darkCharcoal
  ) => {
    page1.drawText(text, { x, y, size, font, color });
  };

  // 1. Name & Title
  drawHeaderText(personalInfo.name, margin, headerY, 20, fontBold, darkCharcoal);
  headerY -= 16;
  drawHeaderText(personalInfo.title, margin, headerY, 11, fontBold, tealColor);
  headerY -= 14;

  // 2. Contact Line
  const contactText = `${personalInfo.location}  •  ${personalInfo.email}  •  ${personalInfo.phone}`;
  drawHeaderText(contactText, margin, headerY, 8.5, fontRegular, subTextColor);
  headerY -= 13;

  // 3. Links Line
  const linksText = personalInfo.portfolio2
    ? `${personalInfo.github}  •  ${personalInfo.linkedin}  •  ${personalInfo.portfolio}  •  ${personalInfo.portfolio2}`
    : `${personalInfo.github}  •  ${personalInfo.linkedin}  •  ${personalInfo.portfolio}`;
  drawHeaderText(linksText, margin, headerY, 8.5, fontRegular, subTextColor);
  headerY -= 14;

  // Full-width subtle separator line under header
  page1.drawLine({
    start: { x: margin, y: headerY },
    end: { x: pageWidth - margin, y: headerY },
    thickness: 0.75,
    color: lineRuleColor,
  });
  headerY -= 14;

  // Column-aware text measurement and drawing primitives
  const splitTextIntoLines = (
    text: string,
    maxWidth: number,
    fontSize: number,
    font: typeof fontRegular
  ): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  // Reusable multi-line text drawer returning new bottom y
  const renderWrappedText = (
    targetPage: typeof page1,
    text: string,
    x: number,
    startY: number,
    maxWidth: number,
    fontSize: number,
    font: typeof fontRegular,
    color = bodyColor,
    lineHeight = fontSize + 3.5
  ): number => {
    const lines = splitTextIntoLines(text, maxWidth, fontSize, font);
    let curY = startY;
    for (const line of lines) {
      targetPage.drawText(line, { x, y: curY, size: fontSize, font, color });
      curY -= lineHeight;
    }
    return curY;
  };

  // Reusable bullet drawer returning new bottom y
  const renderBullet = (
    targetPage: typeof page1,
    text: string,
    x: number,
    startY: number,
    maxWidth: number,
    fontSize = 8.5,
    bulletIndent = 10,
    lineHeight = 11.5
  ): number => {
    targetPage.drawText('•', {
      x,
      y: startY,
      size: fontSize,
      font: fontBold,
      color: bodyColor,
    });
    const textX = x + bulletIndent;
    const textWidth = maxWidth - bulletIndent;
    const endY = renderWrappedText(
      targetPage,
      text,
      textX,
      startY,
      textWidth,
      fontSize,
      fontRegular,
      bodyColor,
      lineHeight
    );
    return endY - 2.5; // spacing between bullets
  };

  // Reusable section header drawer returning new y
  const renderSectionHeader = (
    targetPage: typeof page1,
    title: string,
    x: number,
    startY: number,
    width: number
  ): number => {
    targetPage.drawText(title, {
      x,
      y: startY,
      size: 10,
      font: fontBold,
      color: tealColor,
    });
    const lineY = startY - 3;
    targetPage.drawLine({
      start: { x, y: lineY },
      end: { x: x + width, y: lineY },
      thickness: 0.5,
      color: lineRuleColor,
    });
    return lineY - 11;
  };

  // Separate y trackers for Page 1 columns starting at the same top anchor
  let leftY = headerY;
  let rightY = headerY;

  // ==========================================
  // LEFT COLUMN: Summary & Work Experience
  // ==========================================
  leftY = renderSectionHeader(page1, 'CAREER SUMMARY', margin, leftY, leftColWidth);
  leftY = renderWrappedText(
    page1,
    careerSummary,
    margin,
    leftY,
    leftColWidth,
    8.5,
    fontRegular,
    bodyColor,
    12
  );
  leftY -= 6;

  leftY = renderSectionHeader(page1, 'WORK EXPERIENCE', margin, leftY, leftColWidth);
  experience.forEach((job, index) => {
    if (index > 0) leftY -= 4;

    // Role line
    page1.drawText(job.role, {
      x: margin,
      y: leftY,
      size: 9,
      font: fontBold,
      color: darkCharcoal,
    });
    leftY -= 11;

    // Company & Date line
    const subtitle = job.company ? `${job.company}  •  ${job.dateRange}` : job.dateRange;
    page1.drawText(subtitle, {
      x: margin,
      y: leftY,
      size: 8,
      font: fontItalic,
      color: subTextColor,
    });
    leftY -= 11;

    // Bullets
    for (const bullet of job.bullets) {
      leftY = renderBullet(page1, bullet, margin, leftY, leftColWidth, 8, 9, 11);
    }
  });

  // ==========================================
  // RIGHT COLUMN: Skills, Achievements, Education
  // ==========================================

  // 1. SKILLS
  rightY = renderSectionHeader(page1, 'SKILLS', rightColX, rightY, rightColWidth);
  skills.forEach((group, idx) => {
    if (idx > 0) rightY -= 3;
    // Category Name (Bold on its own line)
    page1.drawText(group.category, {
      x: rightColX,
      y: rightY,
      size: 8.5,
      font: fontBold,
      color: darkCharcoal,
    });
    rightY -= 11;
    // Items (wrapped below category name)
    rightY = renderWrappedText(
      page1,
      group.items,
      rightColX,
      rightY,
      rightColWidth,
      8,
      fontRegular,
      subTextColor,
      10.5
    );
  });
  rightY -= 8;

  // 2. ACHIEVEMENTS
  rightY = renderSectionHeader(page1, 'ACHIEVEMENTS', rightColX, rightY, rightColWidth);
  achievements.forEach((ach) => {
    rightY = renderBullet(page1, ach, rightColX, rightY, rightColWidth, 8, 8, 10.5);
  });
  rightY -= 8;

  // 3. EDUCATION AND CERTIFICATIONS
  rightY = renderSectionHeader(
    page1,
    'EDUCATION & CERTIFICATIONS',
    rightColX,
    rightY,
    rightColWidth
  );
  education.forEach((edu, idx) => {
    if (idx > 0) rightY -= 4;

    // Degree / Credential
    const degreeLines = splitTextIntoLines(edu.degree, rightColWidth, 8.5, fontBold);
    for (const dLine of degreeLines) {
      page1.drawText(dLine, {
        x: rightColX,
        y: rightY,
        size: 8.5,
        font: fontBold,
        color: darkCharcoal,
      });
      rightY -= 11;
    }

    // Institution
    if (edu.institution) {
      page1.drawText(edu.institution, {
        x: rightColX,
        y: rightY,
        size: 8,
        font: fontRegular,
        color: subTextColor,
      });
      rightY -= 10;
    }

    // Date
    page1.drawText(edu.dateRange, {
      x: rightColX,
      y: rightY,
      size: 7.5,
      font: fontItalic,
      color: subTextColor,
    });
    rightY -= 10;
  });

  // ==========================================
  // PAGE 2: Full-Width SELECTED INDEPENDENT PROJECTS
  // ==========================================
  const page2 = pdfDoc.addPage([pageWidth, pageHeight]);
  let page2Y = pageHeight - 45;

  page2Y = renderSectionHeader(
    page2,
    'SELECTED INDEPENDENT PROJECTS',
    margin,
    page2Y,
    contentWidth
  );

  const pdfProjects = selectedProjects.filter((p) => p.onPdfResume);

  pdfProjects.forEach((project, index) => {
    if (index > 0) page2Y -= 8;

    // Project Title
    const headerTitle = project.subtitle
      ? `${project.title} — ${project.subtitle}`
      : project.title;
    page2.drawText(headerTitle, {
      x: margin,
      y: page2Y,
      size: 9.5,
      font: fontBold,
      color: darkCharcoal,
    });
    page2Y -= 12;

    // Stack line
    page2.drawText(project.stack, {
      x: margin,
      y: page2Y,
      size: 8.5,
      font: fontItalic,
      color: subTextColor,
    });
    page2Y -= 12;

    // Bullets
    if (project.bullets && project.bullets.length > 0) {
      for (const bullet of project.bullets) {
        page2Y = renderBullet(
          page2,
          bullet,
          margin,
          page2Y,
          contentWidth,
          8.5,
          10,
          12
        );
      }
    }
  });

  // Save generated PDF to public and assets folders
  const pdfBytes = await pdfDoc.save();
  const publicDir = path.resolve('public');
  const assetsDir = path.resolve('assets');

  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  fs.writeFileSync(path.join(publicDir, 'OMIGIE_ELIZABETH_RESUME.pdf'), pdfBytes);
  fs.writeFileSync(path.join(assetsDir, 'OMIGIE_ELIZABETH_RESUME.pdf'), pdfBytes);

  console.log('PDF generated successfully at public/OMIGIE_ELIZABETH_RESUME.pdf and assets/OMIGIE_ELIZABETH_RESUME.pdf');
}

createResume();
