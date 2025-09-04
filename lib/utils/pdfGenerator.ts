import jsPDF from "jspdf";
import { PDF_THEMES, PDF_LAYOUT } from "../constants";
import type { ResumeData, PDFRenderOptions } from "../types";

// Re-export types for backward compatibility
export type { ResumeData, PDFRenderOptions as RenderOptions };

export function renderResumePDF(
  data: ResumeData,
  opts: PDFRenderOptions = {}
): jsPDF {
  const options = {
    rtl: opts.rtl || false,
    theme: opts.theme || "corporate",
    maxBulletsPerRole: opts.maxBulletsPerRole || 3,
    maxProjects: opts.maxProjects || 4,
  };

  const doc = new jsPDF({ unit: "mm", format: "a4" });

  if (data.meta?.title) {
    doc.setProperties({
      title: data.meta.title,
      author: data.meta?.author || "Resume",
    });
  }

  const theme = PDF_THEMES[options.theme];
  const margins = PDF_LAYOUT.MARGINS;
  const pageWidth = PDF_LAYOUT.A4.w - margins.x * 2;
  let currentY = margins.y;

  // Calculate header height based on content
  const headerHeight = PDF_LAYOUT.HEADER_HEIGHT;

  // Header background
  doc.setFillColor(...theme.headerBg);
  doc.rect(0, 0, PDF_LAYOUT.A4.w, headerHeight, "F");

  if (theme.headerAccent) {
    doc.setFillColor(
      theme.headerAccent[0],
      theme.headerAccent[1],
      theme.headerAccent[2]
    );
    doc.rect(0, headerHeight, PDF_LAYOUT.A4.w, 2, "F");
  }

  // Name
  doc.setTextColor(...theme.name);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(PDF_LAYOUT.FONT_SIZES.name);
  doc.text(data.person.name, margins.x, 25);

  // Title
  doc.setTextColor(...theme.title);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(PDF_LAYOUT.FONT_SIZES.title);
  doc.text(data.person.title, margins.x, 37);

  // Reset text color for contact info (black text for visibility)
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(PDF_LAYOUT.FONT_SIZES.contacts);

  // Phone and Email
  const contactLine1 = `Phone: ${data.person.contacts.phone} | Email: ${data.person.contacts.email}`;
  doc.text(contactLine1, margins.x, 45);

  // Portfolio
  if (data.person.contacts.portfolio) {
    doc.text(`Portfolio: ${data.person.contacts.portfolio}`, margins.x, 50);
  }

  // GitHub
  if (data.person.contacts.github) {
    doc.text(`GitHub: ${data.person.contacts.github}`, margins.x, 55);
  }

  // LinkedIn
  if (data.person.contacts.linkedin) {
    doc.text(`LinkedIn: ${data.person.contacts.linkedin}`, margins.x, 60);
  }

  // Reset text color for body
  doc.setTextColor(...theme.text);
  currentY = 65; // Start body content after contact info

  // Professional Summary
  addSection("Professional Summary", () => {
    doc.setFontSize(PDF_LAYOUT.FONT_SIZES.body);
    const summaryLines = doc.splitTextToSize(data.summary, pageWidth);
    summaryLines.forEach((line: string) => {
      doc.text(line, margins.x, currentY);
      currentY += 4;
    });
  });

  // Technical Skills
  addSection("Technical Skills", () => {
    doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);

    // Frontend
    if (data.tech.frontend.length > 0) {
      const frontendText = `Frontend: ${data.tech.frontend.join(", ")}`;
      const frontendLines = doc.splitTextToSize(frontendText, pageWidth);
      frontendLines.forEach((line: string) => {
        doc.text(line, margins.x, currentY);
        currentY += 3.5;
      });
    }

    // Backend
    if (data.tech.backend.length > 0) {
      const backendText = `Backend: ${data.tech.backend.join(", ")}`;
      const backendLines = doc.splitTextToSize(backendText, pageWidth);
      backendLines.forEach((line: string) => {
        doc.text(line, margins.x, currentY);
        currentY += 3.5;
      });
    }

    // Architecture
    if (data.tech.architecture.length > 0) {
      const archText = `Architecture: ${data.tech.architecture.join(", ")}`;
      const archLines = doc.splitTextToSize(archText, pageWidth);
      archLines.forEach((line: string) => {
        doc.text(line, margins.x, currentY);
        currentY += 3.5;
      });
    }

    // Databases
    if (data.tech.databases.length > 0) {
      const dbText = `Databases: ${data.tech.databases.join(", ")}`;
      const dbLines = doc.splitTextToSize(dbText, pageWidth);
      dbLines.forEach((line: string) => {
        doc.text(line, margins.x, currentY);
        currentY += 3.5;
      });
    }

    // Cloud & DevOps
    if (data.tech.cloudDevOps.length > 0) {
      const cloudText = `Cloud & DevOps: ${data.tech.cloudDevOps.join(", ")}`;
      const cloudLines = doc.splitTextToSize(cloudText, pageWidth);
      cloudLines.forEach((line: string) => {
        doc.text(line, margins.x, currentY);
        currentY += 3.5;
      });
    }
  });

  // Professional Experience
  addSection("Professional Experience", () => {
    data.experience.forEach((exp, index) => {
      if (index >= 3) return; // Limit to 3 experiences for space

      // Role and Company
      doc.setFont("helvetica", "bold");
      doc.setFontSize(PDF_LAYOUT.FONT_SIZES.body);
      doc.text(`${exp.role} - ${exp.company}`, margins.x, currentY);
      currentY += 4;

      // Period
      doc.setFont("helvetica", "normal");
      doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);
      doc.text(exp.period, margins.x, currentY);
      currentY += 4;

      // Bullets (limited for space)
      const maxBullets = Math.min(
        exp.bullets.length,
        options.maxBulletsPerRole
      );
      for (let i = 0; i < maxBullets; i++) {
        const bullet = `• ${exp.bullets[i]}`;
        const bulletLines = doc.splitTextToSize(bullet, pageWidth - 5);
        bulletLines.forEach((line: string, lineIndex: number) => {
          const x = lineIndex === 0 ? margins.x : margins.x + 3;
          doc.text(line, x, currentY);
          currentY += PDF_LAYOUT.SPACING.bulletGap;
        });
      }
      currentY += PDF_LAYOUT.SPACING.experienceGap; // Extra space between experiences
    });
  });

  // Projects
  if (data.projects.length > 0) {
    addSection("Key Projects", () => {
      const maxProjects = Math.min(data.projects.length, options.maxProjects);
      for (let i = 0; i < maxProjects; i++) {
        const project = data.projects[i];

        // Project name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);
        doc.text(`• ${project.name}`, margins.x, currentY);
        currentY += 3.5;

        // Project description
        doc.setFont("helvetica", "normal");
        const projLines = doc.splitTextToSize(project.line, pageWidth - 5);
        projLines.forEach((line: string) => {
          doc.text(line, margins.x + 3, currentY);
          currentY += 3.5;
        });
        currentY += 1;
      }
    });
  }

  // Additional Activities
  if (data.additional) {
    addSection("Additional Activities", () => {
      doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);
      const additionalLines = doc.splitTextToSize(data.additional!, pageWidth);
      additionalLines.forEach((line: string) => {
        doc.text(line, margins.x, currentY);
        currentY += 3.5;
      });
    });
  }

  function addSection(title: string, content: () => void) {
    // Section title
    currentY += PDF_LAYOUT.SPACING.sectionGap;
    doc.setTextColor(...theme.accent);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(PDF_LAYOUT.FONT_SIZES.sectionHeader);
    doc.text(title, margins.x, currentY);
    currentY += PDF_LAYOUT.SPACING.sectionGap;

    // Rule line
    doc.setDrawColor(...theme.rule);
    doc.setLineWidth(0.3);
    doc.line(margins.x, currentY, margins.x + pageWidth, currentY);
    currentY += PDF_LAYOUT.SPACING.ruleGap;

    // Reset text color
    doc.setTextColor(...theme.text);

    // Content
    content();
  }

  return doc;
}
