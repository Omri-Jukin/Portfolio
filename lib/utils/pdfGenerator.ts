import jsPDF from "jspdf";
import {
  PDF_THEMES,
  PDF_LAYOUT,
  PDF_LAYOUT_VARIANTS,
  PDF_VISUAL_ELEMENTS,
  PDF_TYPOGRAPHY_VARIANTS,
} from "../constants";
import type {
  ResumeData,
  PDFRenderOptions,
  EnhancedPDFRenderOptions,
} from "../types";

//! Re-export types for backward compatibility
export type { ResumeData, PDFRenderOptions as RenderOptions };

/** Render Resume PDF Function
 * @param data - Resume data
 * @param opts - PDF render options
 * @returns PDF document
 */

export function renderResumePDF(
  data: ResumeData,
  opts: PDFRenderOptions | EnhancedPDFRenderOptions = {}
): jsPDF {
  const options = {
    rtl: opts.rtl || false,
    theme: opts.theme || "corporate",
    maxBulletsPerRole: opts.maxBulletsPerRole || 3,
    maxProjects: opts.maxProjects || 4,
    // Enhanced options
    layoutVariant: (opts as EnhancedPDFRenderOptions).layoutVariant || "single",
    typography: (opts as EnhancedPDFRenderOptions).typography || "sansSerif",
    visualElements: {
      icons: false, // Disabled by default
      borders: false, // Disabled by default
      shadows: false, // Disabled by default
      gradients: false, // Disabled by default
      patterns: false, // Disabled by default
    },
    customSpacing: (opts as EnhancedPDFRenderOptions).customSpacing,
  };

  const doc = new jsPDF({ unit: "mm", format: "a4" });

  if (data.meta?.title) {
    doc.setProperties({
      title: data.meta.title,
      author: data.meta?.author || "Resume",
    });
  }

  const theme = PDF_THEMES[options.theme];
  const layoutVariant = PDF_LAYOUT_VARIANTS[options.layoutVariant];
  const typography = PDF_TYPOGRAPHY_VARIANTS[options.typography];
  const margins = PDF_LAYOUT.MARGINS;
  const pageWidth = PDF_LAYOUT.A4.w - margins.x * 2;
  const pageHeight = PDF_LAYOUT.A4.h;
  let currentY = margins.y;

  /** Helper function to check if we need a new page
   * @param requiredSpace - Required space
   * @returns boolean
   */
  const checkNewPage = (requiredSpace: number = 20) => {
    return currentY + requiredSpace > pageHeight - margins.y;
  };

  /** Helper function to add a new page
   * @returns void
   */
  const addNewPage = () => {
    doc.addPage();
    currentY = margins.y;
  };

  /** Get spacing configuration with defaults
   * @returns spacing configuration
   */
  const spacing = {
    sectionGap:
      options.customSpacing?.sectionGap ??
      ("spacing" in layoutVariant
        ? layoutVariant.spacing?.sectionGap
        : undefined) ??
      PDF_LAYOUT.SPACING.sectionGap,
    paragraphGap:
      options.customSpacing?.paragraphGap ??
      ("spacing" in layoutVariant
        ? layoutVariant.spacing?.paragraphGap
        : undefined) ??
      PDF_LAYOUT.SPACING.paragraphGap,
    bulletGap:
      options.customSpacing?.bulletGap ??
      ("spacing" in layoutVariant
        ? layoutVariant.spacing?.bulletGap
        : undefined) ??
      PDF_LAYOUT.SPACING.bulletGap,
    experienceGap:
      options.customSpacing?.experienceGap ??
      ("spacing" in layoutVariant
        ? layoutVariant.spacing?.experienceGap
        : undefined) ??
      PDF_LAYOUT.SPACING.experienceGap,
    ruleGap:
      options.customSpacing?.ruleGap ??
      ("spacing" in layoutVariant
        ? layoutVariant.spacing?.ruleGap
        : undefined) ??
      PDF_LAYOUT.SPACING.ruleGap,
  };

  /** Helper functions for visual elements
   * @returns void
   */
  // const drawIcon = (
  //   x: number,
  //   y: number,
  //   iconType: string,
  //   size: number = PDF_VISUAL_ELEMENTS.icons.size
  // ) => {
  //   if (!options.visualElements.icons) return;

  //   // Simple icon drawing - in a real implementation, you'd use actual icon fonts or SVGs
  //   doc.setFontSize(size);
  //   doc.setTextColor(...theme.accent);

  //   switch (iconType) {
  //     case "phone":
  //       doc.text("📞", x, y);
  //       break;
  //     case "email":
  //       doc.text("✉", x, y);
  //       break;
  //     case "location":
  //       doc.text("📍", x, y);
  //       break;
  //     case "github":
  //       doc.text("🐙", x, y);
  //       break;
  //     case "linkedin":
  //       doc.text("💼", x, y);
  //       break;
  //     case "portfolio":
  //       doc.text("🌐", x, y);
  //       break;
  //     default:
  //       doc.text("•", x, y);
  //   }
  // };

  // const drawBorder = (x: number, y: number, width: number, height: number) => {
  //   if (!options.visualElements.borders) return;

  //   doc.setDrawColor(...theme.accent);
  //   doc.setLineWidth(PDF_VISUAL_ELEMENTS.borders.width);
  //   doc.roundedRect(
  //     x,
  //     y,
  //     width,
  //     height,
  //     PDF_VISUAL_ELEMENTS.borders.radius,
  //     PDF_VISUAL_ELEMENTS.borders.radius,
  //     "S"
  //   );
  // };

  const drawShadow = (x: number, y: number, width: number, height: number) => {
    if (!options.visualElements.shadows) return;

    const shadow = PDF_VISUAL_ELEMENTS.shadows;
    doc.setFillColor(...shadow.color);
    doc.roundedRect(
      x + shadow.offset.x,
      y + shadow.offset.y,
      width,
      height,
      PDF_VISUAL_ELEMENTS.borders.radius,
      PDF_VISUAL_ELEMENTS.borders.radius,
      "F"
    );
  };

  const drawGradient = (
    x: number,
    y: number,
    width: number,
    height: number,
    color1: [number, number, number],
    color2: [number, number, number]
  ) => {
    if (!options.visualElements.gradients) return;

    const steps = PDF_VISUAL_ELEMENTS.gradients.steps;
    const stepHeight = height / steps;

    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      const r = Math.round(color1[0] + (color2[0] - color1[0]) * ratio);
      const g = Math.round(color1[1] + (color2[1] - color1[1]) * ratio);
      const b = Math.round(color1[2] + (color2[2] - color1[2]) * ratio);

      doc.setFillColor(r, g, b);
      doc.rect(x, y + i * stepHeight, width, stepHeight, "F");
    }
  };

  /** Calculate header height based on content
   * @returns header height
   */
  const headerHeight = PDF_LAYOUT.HEADER_HEIGHT;

  // Header background with gradient if enabled
  if (options.visualElements.gradients && theme.headerAccent) {
    drawGradient(
      0,
      0,
      PDF_LAYOUT.A4.w,
      headerHeight,
      theme.headerBg,
      theme.headerAccent
    );
  } else {
    doc.setFillColor(...theme.headerBg);
    doc.rect(0, 0, PDF_LAYOUT.A4.w, headerHeight, "F");
  }

  // Add shadow to header if enabled
  if (options.visualElements.shadows) {
    drawShadow(0, 0, PDF_LAYOUT.A4.w, headerHeight);
  }

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
  doc.setFont(typography.font, "bold");
  doc.setFontSize(PDF_LAYOUT.FONT_SIZES.name);
  doc.text(data.person.name, margins.x, 15);

  // Title (2 lines)
  //! 1st line: Full-Stack Software Engineer | Next.js, Node.js & TypeScript
  //! 2nd line: AWS & PostgreSQL | Clean Architecture
  doc.setTextColor(...theme.title);
  doc.setFont(typography.font, "normal");
  doc.setFontSize(PDF_LAYOUT.FONT_SIZES.title);
  doc.text(
    `${data.person.title.split(" | ")[0]} | ${
      data.person.title.split(" | ")[1]
    }`,
    margins.x,
    22
  ); // 1st line
  doc.text(
    `${data.person.title.split(" | ")[2]} | ${
      data.person.title.split(" | ")[3]
    }`,
    margins.x,
    27
  ); // 2nd line

  // Reset text color for contact info (black text for visibility)
  doc.setTextColor(0, 0, 0);
  doc.setFont(typography.font, "normal");
  doc.setFontSize(PDF_LAYOUT.FONT_SIZES.contacts);

  let contactY = 37;
  // const iconSpacing = PDF_VISUAL_ELEMENTS.icons.spacing;

  // Phone and Email
  // Phone (clickable)
  doc.text(`Phone: `, margins.x, contactY);
  doc.textWithLink(data.person.contacts.phone, margins.x + 12, contactY, {
    url: `tel:${data.person.contacts.phone}`,
  });
  contactY += 5;

  // Email (clickable)
  doc.text(`Email: `, margins.x, contactY);
  doc.textWithLink(data.person.contacts.email, margins.x + 11, contactY, {
    url: `mailto:${data.person.contacts.email}`,
  });
  contactY += 5;

  // Portfolio
  if (data.person.contacts.portfolio) {
    doc.text(
      `Portfolio: ${data.person.contacts.portfolio}`,
      margins.x,
      contactY
    );
    contactY += 5;
  }

  // GitHub
  if (data.person.contacts.github) {
    doc.text(`GitHub: ${data.person.contacts.github}`, margins.x, contactY);
    contactY += 5;
  }

  // LinkedIn
  if (data.person.contacts.linkedin) {
    doc.text(`LinkedIn: ${data.person.contacts.linkedin}`, margins.x, contactY);
    contactY += 5;
  }

  // Reset text color for body
  doc.setTextColor(...theme.text);
  currentY = 60; // Start body content after contact info

  // Professional Summary
  if (
    (options as PDFRenderOptions).excludeSections?.includes(
      "Professional Summary"
    )
  ) {
    // Only print content without title
    doc.setFont(typography.font, "normal");
    doc.setFontSize(PDF_LAYOUT.FONT_SIZES.body);
    const summaryLines = doc.splitTextToSize(data.summary, pageWidth);
    summaryLines.forEach((line: string) => {
      doc.text(line, margins.x, currentY);
      currentY += spacing.paragraphGap;
    });
    currentY += spacing.sectionGap; // Add some spacing after content
  } else {
    // Print with title (normal behavior)
    addSection("Professional Summary", () => {
      doc.setFont(typography.font, "normal");
      doc.setFontSize(PDF_LAYOUT.FONT_SIZES.body);
      const summaryLines = doc.splitTextToSize(data.summary, pageWidth);
      summaryLines.forEach((line: string) => {
        doc.text(line, margins.x, currentY);
        currentY += spacing.paragraphGap;
      });
    });
  }

  // Technical Skills
  addSection("Technical Skills", () => {
    doc.setFont(typography.font, "normal");
    doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);

    // Frontend
    if (data.tech.frontend.length > 0) {
      const frontendText = `Frontend: ${data.tech.frontend.join(", ")}`;
      const frontendLines = doc.splitTextToSize(frontendText, pageWidth);
      frontendLines.forEach((line: string) => {
        doc.text(line, margins.x, currentY);
        currentY += spacing.bulletGap;
      });
    }

    // Backend
    if (data.tech.backend.length > 0) {
      const backendText = `Backend: ${data.tech.backend.join(", ")}`;
      const backendLines = doc.splitTextToSize(backendText, pageWidth);
      backendLines.forEach((line: string) => {
        doc.text(line, margins.x, currentY);
        currentY += spacing.bulletGap;
      });
    }

    // Architecture
    if (data.tech.architecture.length > 0) {
      const archText = `Architecture: ${data.tech.architecture.join(", ")}`;
      const archLines = doc.splitTextToSize(archText, pageWidth);
      archLines.forEach((line: string) => {
        doc.text(line, margins.x, currentY);
        currentY += spacing.bulletGap;
      });
    }

    // Databases
    if (data.tech.databases.length > 0) {
      const dbText = `Databases: ${data.tech.databases.join(", ")}`;
      const dbLines = doc.splitTextToSize(dbText, pageWidth);
      dbLines.forEach((line: string) => {
        doc.text(line, margins.x, currentY);
        currentY += spacing.bulletGap;
      });
    }

    // Cloud & DevOps
    if (data.tech.cloudDevOps.length > 0) {
      const cloudText = `Cloud & DevOps: ${data.tech.cloudDevOps.join(", ")}`;
      const cloudLines = doc.splitTextToSize(cloudText, pageWidth);
      cloudLines.forEach((line: string) => {
        doc.text(line, margins.x, currentY);
        currentY += spacing.bulletGap;
      });
    }
  });

  // Professional Experience
  addSection("Professional Experience", () => {
    data.experience.forEach((exp, index) => {
      if (index >= 3) return; // Limit to 3 experiences for space

      // Role and Company
      doc.setFont(typography.font, "bold");
      doc.setFontSize(PDF_LAYOUT.FONT_SIZES.body);
      doc.text(`${exp.role} - ${exp.company}`, margins.x, currentY);
      currentY += spacing.paragraphGap;

      // Period
      doc.setFont(typography.font, "normal");
      doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);
      doc.text(exp.period, margins.x, currentY);
      currentY += spacing.paragraphGap;

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
          currentY += spacing.bulletGap;
        });
      }
      currentY += spacing.experienceGap; // Extra space between experiences
    });
  });

  //! Projects
  if (data.projects && data.projects.length > 0) {
    if (checkNewPage(60)) addNewPage();
    addSection("Key Projects", () => {
      const maxProjects = Math.min(data.projects!.length, options.maxProjects);
      for (let i = 0; i < maxProjects; i++) {
        const project = data.projects![i];

        // Project name
        doc.setFont(typography.font, "bold");
        doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);
        doc.text(`• ${project.name}`, margins.x, currentY);
        currentY += spacing.bulletGap;

        // Project description
        doc.setFont(typography.font, "normal");
        const projLines = doc.splitTextToSize(project.line, pageWidth - 5);
        projLines.forEach((line: string) => {
          doc.text(line, margins.x + 3, currentY);
          currentY += spacing.bulletGap;
        });
        currentY += 1;
      }
    });
  }

  //! Education - Compact version
  if (data.education && data.education.length > 0) {
    addSection("Education", () => {
      data.education.forEach((edu, index) => {
        // Single line format: Degree | Institution | Period | GPA
        doc.setFont(typography.font, "bold");
        doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);

        const degreeText = `${edu.degree}`;
        const institutionText = `${edu.institution}`;
        const periodText = `${edu.period}`;
        const gpaText = edu.gpa ? `GPA: ${edu.gpa}` : "";

        // First line: Degree only
        doc.text(degreeText, margins.x, currentY);
        currentY += 3; // Spacing

        // Second line: Institution
        doc.setFont(typography.font, "normal");
        doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);
        doc.text(institutionText, margins.x, currentY);
        currentY += 3; // Spacing

        // Third line: Period and GPA
        const periodGpaLine = `${periodText}${gpaText ? ` | ${gpaText}` : ""}`;
        doc.text(periodGpaLine, margins.x, currentY);
        currentY += 4; // Slightly more spacing

        // Only show key achievements if they exist and are important
        if (edu.achievements && edu.achievements.length > 0 && index === 0) {
          const achievementsText = edu.achievements.slice(0, 2).join(", "); // Only first 2 achievements
          doc.setFont(typography.font, "normal");
          doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);
          doc.text(`Key: ${achievementsText}`, margins.x, currentY);
          currentY += 4;
        }

        currentY += 4; // Slightly more space between education entries
      });
    });
  }

  //! Additional Activities
  if (data.additional) {
    addSection("Additional Activities", () => {
      doc.setFont(typography.font, "normal");
      doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);
      const additionalLines = doc.splitTextToSize(data.additional!, pageWidth);
      additionalLines.forEach((line: string) => {
        doc.text(line, margins.x, currentY);
        currentY += spacing.bulletGap;
      });
    });
  }

  //! Add section
  function addSection(title: string, content: () => void) {
    // Section title
    currentY += spacing.sectionGap;
    doc.setTextColor(...theme.accent);
    doc.setFont(typography.font, "bold");
    doc.setFontSize(PDF_LAYOUT.FONT_SIZES.sectionHeader);
    doc.text(title, margins.x, currentY);
    currentY += spacing.sectionGap;

    // Rule line with visual enhancements
    doc.setDrawColor(...theme.rule);
    doc.setLineWidth(0.3);

    // Simple underline - no decorative elements
    doc.line(margins.x, currentY, margins.x + pageWidth, currentY);

    currentY += spacing.ruleGap;

    // Reset text color
    doc.setTextColor(...theme.text);

    // Content
    content();
  }

  return doc;
}
