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
import { renderTextToPDF, safeString, containsHebrew } from "./pdfTextRenderer";

//! Re-export types for backward compatibility
export type { ResumeData, PDFRenderOptions as RenderOptions };

/** Render Resume PDF Function
 * @param data - Resume data
 * @param opts - PDF render options
 * @returns PDF document
 */

export async function renderResumePDF(
  data: ResumeData,
  opts: PDFRenderOptions | EnhancedPDFRenderOptions = {}
): Promise<jsPDF> {
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
  const isRTL = options.rtl;
  const defaultAlign: "left" | "right" = isRTL ? "right" : "left";
  const maxBulletsPerRole = isRTL
    ? Math.min(options.maxBulletsPerRole, 2)
    : options.maxBulletsPerRole;
  const maxProjects = isRTL ? 1 : options.maxProjects;
  const maxExperiences = isRTL ? 2 : data.experience.length;
  let currentY = margins.y;

  // #region agent log
  fetch("http://127.0.0.1:7243/ingest/0d4ffcb5-5a42-4053-a381-750408f58a8a", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H1",
      location: "pdfGenerator.ts:renderResumePDF:start",
      message: "render start",
      data: {
        isRTL,
        languageMeta: data.meta?.title,
        experiences: data.experience.length,
        projects: data.projects?.length ?? 0,
        education: data.education?.length ?? 0,
        maxBulletsPerRole,
        maxProjects,
        maxExperiences,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  /**
   * Compute start X based on RTL and indentation
   */
  const getStartX = (indent = 0, maxWidth = pageWidth) =>
    isRTL
      ? PDF_LAYOUT.A4.w - margins.x - maxWidth - indent
      : margins.x + indent;

  /**
   * Add text with Hebrew-aware rendering
   */
  const addTextBlock = async (
    text: string,
    y: number,
    {
      maxWidth = pageWidth,
      fontSize = PDF_LAYOUT.FONT_SIZES.body,
      fontWeight = "normal",
      indent = 0,
      align,
      color,
    }: {
      maxWidth?: number;
      fontSize?: number;
      fontWeight?: "normal" | "bold" | "italic";
      indent?: number;
      align?: "left" | "right" | "center";
      color?: [number, number, number];
    } = {}
  ): Promise<number> => {
    const content = safeString(text);
    const x = getStartX(indent, maxWidth);
    const targetAlign = align || defaultAlign;
    const fontStyle: "normal" | "bold" | "italic" = fontWeight;
    const colorStr = color ? `rgb(${color.join(",")})` : "#000000";

    if (isRTL || containsHebrew(content)) {
      return renderTextToPDF(
        doc,
        content,
        x,
        y,
        maxWidth,
        fontSize,
        fontStyle,
        colorStr
      );
    }

    doc.setFont(typography.font, fontWeight as "normal" | "bold" | "italic");
    doc.setFontSize(fontSize);
    if (color) doc.setTextColor(...color);
    const lines = doc.splitTextToSize(content, maxWidth);
    doc.text(lines, x, y, { align: targetAlign });
    if (color) doc.setTextColor(...theme.text);
    return y + lines.length * fontSize * 0.4 + 2;
  };

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
  let spacing = {
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

  // Tighter spacing for RTL (Hebrew) without changing font sizes
  if (isRTL) {
    const rtlFactor = 0.55;
    spacing = {
      sectionGap: spacing.sectionGap * rtlFactor,
      paragraphGap: spacing.paragraphGap * rtlFactor,
      bulletGap: spacing.bulletGap * rtlFactor,
      experienceGap: spacing.experienceGap * rtlFactor,
      ruleGap: spacing.ruleGap * rtlFactor,
    };
  }

  // #region agent log
  fetch("http://127.0.0.1:7243/ingest/0d4ffcb5-5a42-4053-a381-750408f58a8a", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H2",
      location: "pdfGenerator.ts:renderResumePDF:spacing",
      message: "spacing computed",
      data: {
        isRTL,
        spacing,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

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
  await addTextBlock(data.person.name, 15, {
    fontSize: PDF_LAYOUT.FONT_SIZES.name,
    fontWeight: "bold",
    maxWidth: pageWidth * (isRTL ? 0.9 : 1),
    align: isRTL ? "center" : undefined,
  });

  // Title (2 lines)
  //! 1st line: Full-Stack Software Engineer | Next.js, Node.js & TypeScript
  //! 2nd line: AWS & PostgreSQL | Clean Architecture
  doc.setTextColor(...theme.title);
  doc.setFont(typography.font, "normal");
  doc.setFontSize(PDF_LAYOUT.FONT_SIZES.title);
  await addTextBlock(
    `${data.person.title.split(" | ")[0]} | ${
      data.person.title.split(" | ")[1]
    }`,
    22,
    {
      fontSize: PDF_LAYOUT.FONT_SIZES.title,
      align: isRTL ? "center" : undefined,
    }
  ); // 1st line
  await addTextBlock(
    `${data.person.title.split(" | ")[2]} | ${
      data.person.title.split(" | ")[3]
    }`,
    27,
    {
      fontSize: PDF_LAYOUT.FONT_SIZES.title,
      align: isRTL ? "center" : undefined,
    }
  ); // 2nd line

  // Reset text color for contact info (black text for visibility)
  doc.setTextColor(0, 0, 0);
  doc.setFont(typography.font, "normal");
  doc.setFontSize(PDF_LAYOUT.FONT_SIZES.contacts);

  let contactY = 37;
  // const iconSpacing = PDF_VISUAL_ELEMENTS.icons.spacing;

  // Phone and Email
  // Phone (clickable)
  contactY = await addTextBlock(
    `Phone: ${data.person.contacts.phone}`,
    contactY,
    { fontSize: PDF_LAYOUT.FONT_SIZES.contacts }
  );

  // Email (clickable)
  contactY = await addTextBlock(
    `Email: ${data.person.contacts.email}`,
    contactY,
    { fontSize: PDF_LAYOUT.FONT_SIZES.contacts }
  );

  // Portfolio
  if (data.person.contacts.portfolio) {
    contactY = await addTextBlock(
      `Portfolio: ${data.person.contacts.portfolio}`,
      contactY,
      { fontSize: PDF_LAYOUT.FONT_SIZES.contacts }
    );
  }

  // GitHub
  if (data.person.contacts.github) {
    contactY = await addTextBlock(
      `GitHub: ${data.person.contacts.github}`,
      contactY,
      { fontSize: PDF_LAYOUT.FONT_SIZES.contacts }
    );
  }

  // LinkedIn
  if (data.person.contacts.linkedin) {
    contactY = await addTextBlock(
      `LinkedIn: ${data.person.contacts.linkedin}`,
      contactY,
      { fontSize: PDF_LAYOUT.FONT_SIZES.contacts }
    );
  }

  // Reset text color for body
  doc.setTextColor(...theme.text);
  currentY = Math.max(60, contactY); // Start body content after contact info

  // Professional Summary
  if (
    (options as PDFRenderOptions).excludeSections?.includes(
      "Professional Summary"
    )
  ) {
    // Only print content without title
    doc.setFont(typography.font, "normal");
    doc.setFontSize(PDF_LAYOUT.FONT_SIZES.body);
    currentY = await addTextBlock(data.summary, currentY, {
      fontSize: PDF_LAYOUT.FONT_SIZES.body,
    });
    currentY += spacing.sectionGap; // Add some spacing after content
  } else {
    // Print with title (normal behavior)
    await addSection("Professional Summary", async () => {
      doc.setFont(typography.font, "normal");
      doc.setFontSize(PDF_LAYOUT.FONT_SIZES.body);
      currentY = await addTextBlock(data.summary, currentY, {
        fontSize: PDF_LAYOUT.FONT_SIZES.body,
      });
    });
  }

  // Technical Skills
  await addSection("Technical Skills", async () => {
    doc.setFont(typography.font, "normal");
    doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);

    // Frontend
    if (data.tech.frontend.length > 0) {
      const frontendText = `Frontend: ${data.tech.frontend.join(", ")}`;
      currentY = await addTextBlock(frontendText, currentY, {
        fontSize: PDF_LAYOUT.FONT_SIZES.small,
      });
    }

    // Backend
    if (data.tech.backend.length > 0) {
      const backendText = `Backend: ${data.tech.backend.join(", ")}`;
      currentY = await addTextBlock(backendText, currentY, {
        fontSize: PDF_LAYOUT.FONT_SIZES.small,
      });
    }

    // Architecture
    if (data.tech.architecture.length > 0) {
      const archText = `Architecture: ${data.tech.architecture.join(", ")}`;
      currentY = await addTextBlock(archText, currentY, {
        fontSize: PDF_LAYOUT.FONT_SIZES.small,
      });
    }

    // Databases
    if (data.tech.databases.length > 0) {
      const dbText = `Databases: ${data.tech.databases.join(", ")}`;
      currentY = await addTextBlock(dbText, currentY, {
        fontSize: PDF_LAYOUT.FONT_SIZES.small,
      });
    }

    // Cloud & DevOps
    if (data.tech.cloudDevOps.length > 0) {
      const cloudText = `Cloud & DevOps: ${data.tech.cloudDevOps.join(", ")}`;
      currentY = await addTextBlock(cloudText, currentY, {
        fontSize: PDF_LAYOUT.FONT_SIZES.small,
      });
    }
  });

  // Professional Experience
  await addSection("Professional Experience", async () => {
    for (const [index, exp] of data.experience.entries()) {
      if (index >= maxExperiences) break; // Limit for space (tighter on RTL)

      // #region agent log
      fetch(
        "http://127.0.0.1:7243/ingest/0d4ffcb5-5a42-4053-a381-750408f58a8a",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: "debug-session",
            runId: "pre-fix",
            hypothesisId: "H3",
            location: "pdfGenerator.ts:experience:entry",
            message: "experience rendered",
            data: {
              isRTL,
              index,
              role: exp.role,
              bullets: exp.bullets.length,
              maxBulletsPerRole,
            },
            timestamp: Date.now(),
          }),
        }
      ).catch(() => {});
      // #endregion

      // Role and Company
      doc.setFont(typography.font, "bold");
      doc.setFontSize(PDF_LAYOUT.FONT_SIZES.body);
      currentY = await addTextBlock(`${exp.role} - ${exp.company}`, currentY, {
        fontSize: PDF_LAYOUT.FONT_SIZES.body,
        fontWeight: "bold",
      });

      // Period
      doc.setFont(typography.font, "normal");
      doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);
      currentY = await addTextBlock(exp.period, currentY, {
        fontSize: PDF_LAYOUT.FONT_SIZES.small,
      });

      // Bullets (limited for space)
      const maxBullets = Math.min(exp.bullets.length, maxBulletsPerRole);
      for (let i = 0; i < maxBullets; i++) {
        const bullet = `• ${exp.bullets[i]}`;
        currentY = await addTextBlock(bullet, currentY, {
          fontSize: PDF_LAYOUT.FONT_SIZES.small,
          indent: 3,
          maxWidth: pageWidth - 5,
        });
      }
      currentY += spacing.experienceGap; // Extra space between experiences
    }
  });

  //! Projects
  if (data.projects && data.projects.length > 0) {
    if (checkNewPage(60)) addNewPage();
    await addSection("Key Projects", async () => {
      const maxProjectsCount = Math.min(data.projects!.length, maxProjects);

      // #region agent log
      fetch(
        "http://127.0.0.1:7243/ingest/0d4ffcb5-5a42-4053-a381-750408f58a8a",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: "debug-session",
            runId: "pre-fix",
            hypothesisId: "H4",
            location: "pdfGenerator.ts:projects:start",
            message: "projects section",
            data: {
              isRTL,
              maxProjectsCount,
              totalProjects: data.projects!.length,
            },
            timestamp: Date.now(),
          }),
        }
      ).catch(() => {});
      // #endregion

      for (let i = 0; i < maxProjectsCount; i++) {
        const project = data.projects![i];

        // Project name
        doc.setFont(typography.font, "bold");
        doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);
        currentY = await addTextBlock(`• ${project.name}`, currentY, {
          fontSize: PDF_LAYOUT.FONT_SIZES.small,
          fontWeight: "bold",
        });

        // Project description
        doc.setFont(typography.font, "normal");
        currentY = await addTextBlock(project.line, currentY, {
          fontSize: PDF_LAYOUT.FONT_SIZES.small,
          indent: 3,
          maxWidth: pageWidth - 5,
        });
        currentY += 1;
      }
    });
  }

  //! Education - Compact version
  if (data.education && data.education.length > 0) {
    await addSection("Education", async () => {
      const educationList = isRTL ? data.education.slice(0, 1) : data.education;

      // #region agent log
      fetch(
        "http://127.0.0.1:7243/ingest/0d4ffcb5-5a42-4053-a381-750408f58a8a",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: "debug-session",
            runId: "pre-fix",
            hypothesisId: "H5",
            location: "pdfGenerator.ts:education:start",
            message: "education section",
            data: {
              isRTL,
              totalEducation: data.education.length,
              educationUsed: educationList.length,
            },
            timestamp: Date.now(),
          }),
        }
      ).catch(() => {});
      // #endregion

      for (const [index, edu] of educationList.entries()) {
        // Single line format: Degree | Institution | Period | GPA
        doc.setFont(typography.font, "bold");
        doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);

        const degreeText = `${edu.degree}`;
        const institutionText = `${edu.institution}`;
        const periodText = `${edu.period}`;
        const gpaText = edu.gpa ? `GPA: ${edu.gpa}` : "";

        // First line: Degree only
        currentY = await addTextBlock(degreeText, currentY, {
          fontSize: PDF_LAYOUT.FONT_SIZES.small,
          fontWeight: "bold",
        });

        // Second line: Institution
        doc.setFont(typography.font, "normal");
        doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);
        currentY = await addTextBlock(institutionText, currentY, {
          fontSize: PDF_LAYOUT.FONT_SIZES.small,
        });

        // Third line: Period and GPA
        const periodGpaLine = `${periodText}${gpaText ? ` | ${gpaText}` : ""}`;
        currentY = await addTextBlock(periodGpaLine, currentY, {
          fontSize: PDF_LAYOUT.FONT_SIZES.small,
        });

        // Only show key achievements if they exist and are important
        if (edu.achievements && edu.achievements.length > 0 && index === 0) {
          const achievementsText = edu.achievements.slice(0, 2).join(", "); // Only first 2 achievements
          doc.setFont(typography.font, "normal");
          doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);
          currentY = await addTextBlock(`Key: ${achievementsText}`, currentY, {
            fontSize: PDF_LAYOUT.FONT_SIZES.small,
          });
        }

        currentY += 4; // Slightly more space between education entries
      }
    });
  }

  //! Additional Activities
  if (data.additional && !isRTL) {
    await addSection("Additional Activities", async () => {
      doc.setFont(typography.font, "normal");
      doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);
      currentY = await addTextBlock(data.additional!, currentY, {
        fontSize: PDF_LAYOUT.FONT_SIZES.small,
      });
    });
  }
  // #region agent log
  fetch("http://127.0.0.1:7243/ingest/0d4ffcb5-5a42-4053-a381-750408f58a8a", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H6",
      location: "pdfGenerator.ts:additional",
      message: "additional activities rendered?",
      data: {
        isRTL,
        rendered: !!data.additional && !isRTL,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  //! Add section
  async function addSection(
    title: string,
    content: () => Promise<void> | void
  ) {
    // Section title
    currentY += spacing.sectionGap;
    doc.setTextColor(...theme.accent);
    doc.setFont(typography.font, "bold");
    doc.setFontSize(PDF_LAYOUT.FONT_SIZES.sectionHeader);
    await addTextBlock(title, currentY, {
      fontSize: PDF_LAYOUT.FONT_SIZES.sectionHeader,
      fontWeight: "bold",
    });
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
    await content();
  }

  return doc;
}
