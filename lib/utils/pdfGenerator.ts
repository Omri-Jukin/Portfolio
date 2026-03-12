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
      linkUrl,
    }: {
      maxWidth?: number;
      fontSize?: number;
      fontWeight?: "normal" | "bold" | "italic";
      indent?: number;
      align?: "left" | "right" | "center";
      color?: [number, number, number];
      linkUrl?: string;
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
    if (linkUrl && lines.length > 0) {
      doc.textWithLink(lines[0], x, y, { url: linkUrl });
      for (let i = 1; i < lines.length; i++) {
        doc.text(lines[i], x, y + i * fontSize * 0.4, { align: targetAlign });
      }
    } else {
      doc.text(lines, x, y, { align: targetAlign });
    }
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

  // Headline / Title (single line; headline preferred for new format)
  const headlineText = data.headline ?? data.person.title;
  doc.setTextColor(...theme.title);
  doc.setFont(typography.font, "normal");
  doc.setFontSize(PDF_LAYOUT.FONT_SIZES.title);
  await addTextBlock(headlineText, 22, {
    fontSize: PDF_LAYOUT.FONT_SIZES.title,
    align: isRTL ? "center" : undefined,
  });

  // Reset text color for contact info (black text for visibility)
  doc.setTextColor(0, 0, 0);
  doc.setFont(typography.font, "normal");
  doc.setFontSize(PDF_LAYOUT.FONT_SIZES.contacts);

  let contactY = 37;
  // const iconSpacing = PDF_VISUAL_ELEMENTS.icons.spacing;

  // Phone and Email (kept as plain text for ATS parsing)
  contactY = await addTextBlock(
    `Phone: ${data.person.contacts.phone}`,
    contactY,
    { fontSize: PDF_LAYOUT.FONT_SIZES.contacts }
  );

  contactY = await addTextBlock(
    `Email: ${data.person.contacts.email}`,
    contactY,
    { fontSize: PDF_LAYOUT.FONT_SIZES.contacts }
  );

  // Links in header: when data.links exists, defer to Links section at end; else show in header (legacy)
  if (!data.links || data.links.length === 0) {
    const legacyLinks: { label: string; url: string }[] = [];
    if (data.person.contacts.portfolio)
      legacyLinks.push({
        label: "Portfolio",
        url: data.person.contacts.portfolio.startsWith("http")
          ? data.person.contacts.portfolio
          : `https://${data.person.contacts.portfolio}`,
      });
    if (data.person.contacts.github)
      legacyLinks.push({
        label: "GitHub",
        url: data.person.contacts.github.startsWith("http")
          ? data.person.contacts.github
          : `https://${data.person.contacts.github}`,
      });
    if (data.person.contacts.linkedin)
      legacyLinks.push({
        label: "LinkedIn",
        url: data.person.contacts.linkedin.startsWith("http")
          ? data.person.contacts.linkedin
          : `https://${data.person.contacts.linkedin}`,
      });

    if (legacyLinks.length > 0) {
      doc.setFont(typography.font, "normal");
      doc.setFontSize(PDF_LAYOUT.FONT_SIZES.contacts);
      const linkY = contactY;
      const x = getStartX(0, pageWidth);
      let offsetX = 0;
      for (let i = 0; i < legacyLinks.length; i++) {
        const { label, url } = legacyLinks[i];
        doc.setTextColor(0, 0, 139);
        doc.textWithLink(label, x + offsetX, linkY, { url });
        offsetX += doc.getTextWidth(label);
        if (i < legacyLinks.length - 1) {
          doc.setTextColor(0, 0, 0);
          const sep = " | ";
          doc.text(sep, x + offsetX, linkY);
          offsetX += doc.getTextWidth(sep);
        }
      }
      doc.setTextColor(0, 0, 0);
      contactY = linkY + PDF_LAYOUT.FONT_SIZES.contacts * 0.4 + 2;
    }
  }

  // Reset text color for body
  doc.setTextColor(...theme.text);
  currentY = Math.max(60, contactY); // Start body content after contact info

  // Summary
  if (
    (options as PDFRenderOptions).excludeSections?.includes(
      "Professional Summary"
    )
  ) {
    doc.setFont(typography.font, "normal");
    doc.setFontSize(PDF_LAYOUT.FONT_SIZES.body);
    currentY = await addTextBlock(data.summary, currentY, {
      fontSize: PDF_LAYOUT.FONT_SIZES.body,
    });
    currentY += spacing.sectionGap;
  } else {
    await addSection("Summary", async () => {
      doc.setFont(typography.font, "normal");
      doc.setFontSize(PDF_LAYOUT.FONT_SIZES.body);
      currentY = await addTextBlock(data.summary, currentY, {
        fontSize: PDF_LAYOUT.FONT_SIZES.body,
      });
    });
  }

  // Core Skills (category-based) or Technical Skills (legacy flat)
  const skillsSectionTitle = data.coreSkills ? "Core Skills" : "Technical Skills";
  await addSection(skillsSectionTitle, async () => {
    doc.setFont(typography.font, "normal");
    doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);

    if (data.coreSkills && data.coreSkills.length > 0) {
      for (const cat of data.coreSkills) {
        const text = `${cat.category}: ${cat.items.join(", ")}`;
        currentY = await addTextBlock(text, currentY, {
          fontSize: PDF_LAYOUT.FONT_SIZES.small,
        });
      }
    } else if (data.tech) {
      if (data.tech.frontend?.length > 0) {
        currentY = await addTextBlock(
          `Frontend: ${data.tech.frontend.join(", ")}`,
          currentY,
          { fontSize: PDF_LAYOUT.FONT_SIZES.small }
        );
      }
      if (data.tech.backend?.length > 0) {
        currentY = await addTextBlock(
          `Backend: ${data.tech.backend.join(", ")}`,
          currentY,
          { fontSize: PDF_LAYOUT.FONT_SIZES.small }
        );
      }
      if (data.tech.architecture?.length > 0) {
        currentY = await addTextBlock(
          `Architecture: ${data.tech.architecture.join(", ")}`,
          currentY,
          { fontSize: PDF_LAYOUT.FONT_SIZES.small }
        );
      }
      if (data.tech.databases?.length > 0) {
        currentY = await addTextBlock(
          `Databases: ${data.tech.databases.join(", ")}`,
          currentY,
          { fontSize: PDF_LAYOUT.FONT_SIZES.small }
        );
      }
      if (data.tech.cloudDevOps?.length > 0) {
        currentY = await addTextBlock(
          `Cloud & DevOps: ${data.tech.cloudDevOps.join(", ")}`,
          currentY,
          { fontSize: PDF_LAYOUT.FONT_SIZES.small }
        );
      }
      if (data.tech.aiTools?.length) {
        currentY = await addTextBlock(
          `AI & Tools: ${data.tech.aiTools.join(", ")}`,
          currentY,
          { fontSize: PDF_LAYOUT.FONT_SIZES.small }
        );
      }
    }
  });

  // Professional Experience
  await addSection("Professional Experience", async () => {
    for (const [index, exp] of data.experience.entries()) {
      if (index >= maxExperiences) break;

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

  // Selected Projects
  if (data.projects && data.projects.length > 0) {
    if (checkNewPage(60)) addNewPage();
    await addSection("Selected Projects", async () => {
      const maxProjectsCount = Math.min(data.projects!.length, maxProjects);

      for (let i = 0; i < maxProjectsCount; i++) {
        const project = data.projects![i];

        doc.setFont(typography.font, "bold");
        doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);
        currentY = await addTextBlock(`• ${project.name}`, currentY, {
          fontSize: PDF_LAYOUT.FONT_SIZES.small,
          fontWeight: "bold",
        });

        doc.setFont(typography.font, "normal");
        currentY = await addTextBlock(project.line, currentY, {
          fontSize: PDF_LAYOUT.FONT_SIZES.small,
          indent: 3,
          maxWidth: pageWidth - 5,
        });

        if (project.bullets && project.bullets.length > 0) {
          const maxProjectBullets = Math.min(project.bullets.length, 4);
          for (let b = 0; b < maxProjectBullets; b++) {
            const bullet = `  • ${project.bullets[b]}`;
            currentY = await addTextBlock(bullet, currentY, {
              fontSize: PDF_LAYOUT.FONT_SIZES.small,
              indent: 3,
              maxWidth: pageWidth - 5,
            });
          }
        }
        currentY += 1;
      }
    });
  }

  // Education
  if (data.education && data.education.length > 0) {
    await addSection("Education", async () => {
      const educationList = isRTL ? data.education.slice(0, 1) : data.education;

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

        if (edu.achievements && edu.achievements.length > 0 && index === 0) {
          const achievementsText = edu.achievements.slice(0, 2).join(", ");
          doc.setFont(typography.font, "normal");
          doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);
          currentY = await addTextBlock(`Key: ${achievementsText}`, currentY, {
            fontSize: PDF_LAYOUT.FONT_SIZES.small,
          });
        }

        currentY += 4;
      }
    });
  }

  // Additional Experience (structured roles) or Additional Activities (legacy string)
  if (data.additionalExperience && data.additionalExperience.length > 0 && !isRTL) {
    await addSection("Additional Experience", async () => {
      for (const exp of data.additionalExperience!) {
        doc.setFont(typography.font, "bold");
        doc.setFontSize(PDF_LAYOUT.FONT_SIZES.body);
        currentY = await addTextBlock(`${exp.role} - ${exp.company}`, currentY, {
          fontSize: PDF_LAYOUT.FONT_SIZES.body,
          fontWeight: "bold",
        });

        doc.setFont(typography.font, "normal");
        doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);
        currentY = await addTextBlock(exp.period, currentY, {
          fontSize: PDF_LAYOUT.FONT_SIZES.small,
        });

        const maxBullets = Math.min(exp.bullets.length, maxBulletsPerRole);
        for (let i = 0; i < maxBullets; i++) {
          const bullet = `• ${exp.bullets[i]}`;
          currentY = await addTextBlock(bullet, currentY, {
            fontSize: PDF_LAYOUT.FONT_SIZES.small,
            indent: 3,
            maxWidth: pageWidth - 5,
          });
        }
        currentY += spacing.experienceGap;
      }
    });
  } else if (data.additional && !isRTL) {
    await addSection("Additional Activities", async () => {
      doc.setFont(typography.font, "normal");
      doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);
      currentY = await addTextBlock(data.additional!, currentY, {
        fontSize: PDF_LAYOUT.FONT_SIZES.small,
      });
    });
  }

  // Links (visible URLs, clickable)
  if (data.links && data.links.length > 0 && !isRTL) {
    await addSection("Links", async () => {
      doc.setFont(typography.font, "normal");
      doc.setFontSize(PDF_LAYOUT.FONT_SIZES.small);
      for (const link of data.links!) {
        const url = link.url.startsWith("http") ? link.url : `https://${link.url}`;
        const text = `${link.label}: ${url}`;
        doc.setTextColor(0, 0, 139);
        currentY = await addTextBlock(text, currentY, {
          fontSize: PDF_LAYOUT.FONT_SIZES.small,
          linkUrl: url,
        });
        doc.setTextColor(...theme.text);
      }
    });
  }

  // Add section
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
