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
  drawText(personalInfo.name, margin, y, 20, fontBold, rgb(0.08, 0.08, 0.08));
  y -= 16;
  drawText(personalInfo.title, margin, y, 11, fontBold, rgb(0.85, 0.35, 0.15));
  y -= 14;
  drawText(`${personalInfo.location} - ${personalInfo.email} - ${personalInfo.phone}`, margin, y, 9, fontRegular, rgb(0.3, 0.3, 0.3));
  y -= 13;
  drawText(`${personalInfo.github} - ${personalInfo.linkedin} - ${personalInfo.portfolio}`, margin, y, 9, fontRegular, rgb(0.3, 0.3, 0.3));
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
    careerSummary,
    margin,
    9,
    fontRegular,
    rgb(0.2, 0.2, 0.2),
    contentWidth,
    13
  );

  // WORK EXPERIENCE
  addSectionHeader('WORK EXPERIENCE');
  experience.forEach((job, index) => {
    if (index > 0) y -= 3;
    const titleLine = job.company ? `${job.role} - ${job.company}` : job.role;
    drawText(titleLine, margin, y, 9.5, fontBold, rgb(0.1, 0.1, 0.1));
    y -= 12;
    drawText(job.dateRange, margin, y, 8.5, fontItalic, rgb(0.4, 0.4, 0.4));
    y -= 12;
    job.bullets.forEach((bullet) => addBullet(bullet));
  });

  // SELECTED INDEPENDENT PROJECTS
  addSectionHeader('SELECTED INDEPENDENT PROJECTS');
  const resumeProjects = selectedProjects.filter((p) => p.onPdfResume);
  resumeProjects.forEach((project, index) => {
    if (index === 1) {
      // PAGE 2
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - 45;
    } else if (index > 1) {
      y -= 4;
    }
    const projectTitle = project.subtitle ? `${project.title} - ${project.subtitle}` : project.title;
    drawText(projectTitle, margin, y, 9.5, fontBold, rgb(0.1, 0.1, 0.1));
    y -= 12;
    drawText(project.stack, margin, y, 8.5, fontItalic, rgb(0.4, 0.4, 0.4));
    y -= 12;
    project.bullets?.forEach((bullet) => addBullet(bullet));
  });

  // SKILLS
  addSectionHeader('SKILLS');
  skills.forEach((group) => {
    drawText(group.category, margin, y, 9, fontBold, rgb(0.1, 0.1, 0.1));
    drawText(group.items, margin + 110, y, 9, fontRegular, rgb(0.2, 0.2, 0.2));
    y -= 15;
  });
  y -= 3;

  // ACHIEVEMENTS
  addSectionHeader('ACHIEVEMENTS');
  achievements.forEach((ach) => addBullet(ach));

  // EDUCATION AND CERTIFICATIONS
  addSectionHeader('EDUCATION AND CERTIFICATIONS');
  education.forEach((edu) => {
    const eduLine = edu.institution ? `${edu.degree} - ${edu.institution}` : edu.degree;
    drawText(eduLine, margin, y, 9.5, fontBold, rgb(0.1, 0.1, 0.1));
    y -= 12;
    drawText(edu.dateRange, margin, y, 8.5, fontItalic, rgb(0.4, 0.4, 0.4));
    y -= 16;
  });

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
