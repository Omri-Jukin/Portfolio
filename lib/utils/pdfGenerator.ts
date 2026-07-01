import jsPDF from "jspdf";
import {
  PDF_LAYOUT,
  PDF_LAYOUT_VARIANTS,
  PDF_THEMES,
  PDF_TYPOGRAPHY_VARIANTS,
} from "../constants";
import type {
  EnhancedPDFRenderOptions,
  PDFRenderOptions,
  ResumeData,
  ResumePdfSectionKey,
} from "../types";
import { containsHebrew, renderTextToPDF, safeString } from "./pdfTextRenderer";

//! Re-export types for backward compatibility
export type { ResumeData, PDFRenderOptions as RenderOptions };

const DEFAULT_PDF_SECTION_ORDER: ResumePdfSectionKey[] = [
  "summary",
  "skills",
  "experience",
  "projects",
  "additionalExperience",
  "education",
  "certifications",
];

const RESUME_PDF_LAYOUT = {
  fontSizes: {
    name: 18,
    headline: 10,
    contact: 8.2,
    section: 10.5,
    body: 9.2,
    small: 8.5,
    hook: 8.6,
  },
  spacing: {
    headerGap: 3,
    sectionGap: 3.4,
    titleGap: 1.6,
    paragraphGap: 1.2,
    itemGap: 1.5,
    bulletGap: 0.8,
  },
  colors: {
    text: [20, 24, 31] as [number, number, number],
    muted: [72, 80, 95] as [number, number, number],
    hookBg: [245, 247, 250] as [number, number, number],
  },
} as const;

function getPdfSectionOrder(
  sectionOrder: ResumePdfSectionKey[] | undefined
): ResumePdfSectionKey[] {
  const allowed = new Set<ResumePdfSectionKey>(DEFAULT_PDF_SECTION_ORDER);
  const seen = new Set<ResumePdfSectionKey>();
  const ordered: ResumePdfSectionKey[] = [];

  if (Array.isArray(sectionOrder)) {
    for (const item of sectionOrder) {
      if (allowed.has(item) && !seen.has(item)) {
        ordered.push(item);
        seen.add(item);
      }
    }
  }

  return [
    ...ordered,
    ...DEFAULT_PDF_SECTION_ORDER.filter((item) => !seen.has(item)),
  ];
}

function normalizeUrl(value: string | undefined) {
  if (!value?.trim()) return undefined;
  return value.startsWith("http") ? value : `https://${value}`;
}

function uniqueNonEmpty(values: Array<string | undefined>) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const trimmed = value?.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
  }

  return result;
}

function buildRecruiterSnapshot(data: ResumeData) {
  const content = [
    data.headline,
    data.summary,
    ...(data.coreSkills ?? []).flatMap((category) => category.items),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const stack = [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "Supabase",
  ].filter((skill) => content.includes(skill.toLowerCase()));

  return uniqueNonEmpty([
    stack.join(", ") || data.person.title,
    "frontend, backend, data, CMS/backoffice workflows, internal tooling, CI/CD",
    "product-minded full-stack delivery",
  ]).join(" | ");
}

function getCompactSummary(summary: string) {
  const normalized = summary.replace(/\s+/g, " ").trim();
  if (!normalized) return "";

  const sentences =
    normalized.match(/[^.!?]+[.!?]+/g)?.map((sentence) => sentence.trim()) ?? [
      normalized,
    ];
  const selected: string[] = [];
  const maxChars = 280;

  for (const sentence of sentences) {
    const next = [...selected, sentence].join(" ");
    if (selected.length >= 2 || next.length > maxChars) break;
    selected.push(sentence);
  }

  const result = selected.length > 0 ? selected.join(" ") : sentences[0];
  if (result.length <= maxChars) return result;

  const truncated = result.slice(0, maxChars + 1);
  return `${truncated.slice(0, truncated.lastIndexOf(" ")).trim()}.`;
}

/** Render Resume PDF Function
 * @param data - Resume data
 * @param opts - PDF render options
 * @returns PDF document
 */
export async function renderResumePDF(
  data: ResumeData,
  opts: PDFRenderOptions | EnhancedPDFRenderOptions = {}
): Promise<jsPDF> {
  const themeName = opts.theme ?? "blueGrey";
  const layoutVariantName =
    (opts as EnhancedPDFRenderOptions).layoutVariant ?? "single";
  const typographyName =
    (opts as EnhancedPDFRenderOptions).typography ?? "sansSerif";
  const theme = PDF_THEMES[themeName];
  const layoutVariant = PDF_LAYOUT_VARIANTS[layoutVariantName];
  const typography = PDF_TYPOGRAPHY_VARIANTS[typographyName];
  const margins = PDF_LAYOUT.MARGINS;
  const pageWidth = PDF_LAYOUT.A4.w - margins.x * 2;
  const pageHeight = PDF_LAYOUT.A4.h;
  const isRTL = opts.rtl ?? false;
  const defaultAlign: "left" | "right" = isRTL ? "right" : "left";
  const maxBulletsPerRole = isRTL
    ? Math.min(opts.maxBulletsPerRole ?? 3, 2)
    : opts.maxBulletsPerRole ?? 4;
  const maxProjects = isRTL ? 1 : opts.maxProjects ?? 3;
  const maxExperiences = isRTL ? 2 : data.experience.length;
  const customSpacing = (opts as EnhancedPDFRenderOptions).customSpacing;
  let currentY = margins.y;

  const spacing = {
    sectionGap:
      customSpacing?.sectionGap ??
      ("spacing" in layoutVariant
        ? layoutVariant.spacing?.sectionGap
        : undefined) ??
      RESUME_PDF_LAYOUT.spacing.sectionGap,
    paragraphGap:
      customSpacing?.paragraphGap ?? RESUME_PDF_LAYOUT.spacing.paragraphGap,
    bulletGap: customSpacing?.bulletGap ?? RESUME_PDF_LAYOUT.spacing.bulletGap,
    experienceGap:
      customSpacing?.experienceGap ?? RESUME_PDF_LAYOUT.spacing.itemGap,
    titleGap: RESUME_PDF_LAYOUT.spacing.titleGap,
    headerGap: RESUME_PDF_LAYOUT.spacing.headerGap,
  };

  const doc = new jsPDF({ unit: "mm", format: "a4" });

  if (data.meta?.title) {
    doc.setProperties({
      title: data.meta.title,
      author: data.meta?.author || "Resume",
    });
  }

  const getStartX = (indent = 0, maxWidth = pageWidth) =>
    isRTL
      ? PDF_LAYOUT.A4.w - margins.x - maxWidth - indent
      : margins.x + indent;

  const getLineHeight = (fontSize: number) => fontSize * 0.42;

  const ensurePage = (requiredSpace = 20) => {
    if (currentY + requiredSpace <= pageHeight - margins.y) return;
    doc.addPage();
    currentY = margins.y;
  };

  const addTextBlock = async (
    text: string,
    y: number,
    {
      maxWidth = pageWidth,
      fontSize = RESUME_PDF_LAYOUT.fontSizes.body,
      fontWeight = "normal",
      indent = 0,
      align,
      color,
      afterGap = spacing.paragraphGap,
    }: {
      maxWidth?: number;
      fontSize?: number;
      fontWeight?: "normal" | "bold" | "italic";
      indent?: number;
      align?: "left" | "right" | "center";
      color?: [number, number, number];
      afterGap?: number;
    } = {}
  ): Promise<number> => {
    const content = safeString(text);
    if (!content.trim()) return y;

    const x = getStartX(indent, maxWidth);
    const targetAlign = align || defaultAlign;
    const textColor = color ?? RESUME_PDF_LAYOUT.colors.text;

    if (isRTL || containsHebrew(content)) {
      return (
        (await renderTextToPDF(
          doc,
          content,
          x,
          y,
          maxWidth,
          fontSize,
          fontWeight,
          `rgb(${textColor.join(",")})`
        )) + afterGap
      );
    }

    doc.setFont(typography.font, fontWeight);
    doc.setFontSize(fontSize);
    doc.setTextColor(...textColor);
    const lines = doc.splitTextToSize(content, maxWidth);
    doc.text(lines, x, y, { align: targetAlign });

    return y + lines.length * getLineHeight(fontSize) + afterGap;
  };

  const addSection = async (
    title: string,
    content: () => Promise<void> | void,
    requiredSpace = 18
  ) => {
    ensurePage(requiredSpace);
    currentY += spacing.sectionGap;
    currentY = await addTextBlock(title, currentY, {
      fontSize: RESUME_PDF_LAYOUT.fontSizes.section,
      fontWeight: "bold",
      color: theme.accent,
      afterGap: spacing.titleGap,
    });
    await content();
  };

  const addRecruiterSnapshot = async (text: string) => {
    if (!text.trim()) return;

    const maxWidth = pageWidth - 8;
    doc.setFont(typography.font, "bold");
    doc.setFontSize(RESUME_PDF_LAYOUT.fontSizes.hook);
    const lines = doc.splitTextToSize(text, maxWidth);
    const boxHeight =
      lines.length * getLineHeight(RESUME_PDF_LAYOUT.fontSizes.hook) + 5;

    ensurePage(boxHeight + 4);
    const boxTop = currentY;
    doc.setFillColor(...RESUME_PDF_LAYOUT.colors.hookBg);
    doc.rect(margins.x, boxTop, pageWidth, boxHeight, "F");
    doc.setDrawColor(...theme.accent);
    doc.setLineWidth(0.8);
    doc.line(margins.x, boxTop, margins.x, boxTop + boxHeight);

    currentY = await addTextBlock(text, boxTop + 3.4, {
      fontSize: RESUME_PDF_LAYOUT.fontSizes.hook,
      fontWeight: "bold",
      indent: 4,
      maxWidth,
      afterGap: 0,
    });
    currentY = Math.max(currentY, boxTop + boxHeight) + 2.2;
  };

  const renderHeader = async () => {
    const linksByLabel = new Map(
      (data.links ?? []).map((link) => [link.label.toLowerCase(), link.url])
    );
    const contactLine = uniqueNonEmpty([
      data.person.contacts.phone ? `Phone: ${data.person.contacts.phone}` : "",
      data.person.contacts.email ? `Email: ${data.person.contacts.email}` : "",
      data.person.contacts.location || "",
      normalizeUrl(
        linksByLabel.get("portfolio") ?? data.person.contacts.portfolio
      ),
      normalizeUrl(
        linksByLabel.get("linkedin") ?? data.person.contacts.linkedin
      ),
      normalizeUrl(linksByLabel.get("github") ?? data.person.contacts.github),
    ]).join(" | ");

    currentY = await addTextBlock(data.person.name, currentY, {
      fontSize: RESUME_PDF_LAYOUT.fontSizes.name,
      fontWeight: "bold",
      afterGap: 1.4,
    });
    currentY = await addTextBlock(data.headline ?? data.person.title, currentY, {
      fontSize: RESUME_PDF_LAYOUT.fontSizes.headline,
      color: RESUME_PDF_LAYOUT.colors.muted,
      afterGap: 1.6,
    });
    currentY = await addTextBlock(contactLine, currentY, {
      fontSize: RESUME_PDF_LAYOUT.fontSizes.contact,
      color: RESUME_PDF_LAYOUT.colors.muted,
      afterGap: 2.4,
    });
    await addRecruiterSnapshot(buildRecruiterSnapshot(data));
  };

  const renderSummary = async () => {
    const summary = getCompactSummary(data.summary);
    if (!summary) return;

    if (opts.excludeSections?.includes("Professional Summary")) {
      currentY = await addTextBlock(summary, currentY, {
        fontSize: RESUME_PDF_LAYOUT.fontSizes.body,
      });
      return;
    }

    await addSection("Professional Summary", async () => {
      currentY = await addTextBlock(summary, currentY, {
        fontSize: RESUME_PDF_LAYOUT.fontSizes.body,
      });
    });
  };

  const renderSkills = async () => {
    const skillRows = data.coreSkills?.length
      ? data.coreSkills
          .filter((category) => category.items.length > 0)
          .map((category) => ({
            category: category.category,
            items: category.items,
          }))
      : [
          { category: "Frontend", items: data.tech?.frontend ?? [] },
          { category: "Backend", items: data.tech?.backend ?? [] },
          { category: "Architecture", items: data.tech?.architecture ?? [] },
          { category: "Databases", items: data.tech?.databases ?? [] },
          { category: "Cloud / DevOps", items: data.tech?.cloudDevOps ?? [] },
          { category: "Testing / Tooling", items: data.tech?.aiTools ?? [] },
        ].filter((category) => category.items.length > 0);

    if (skillRows.length === 0) return;

    await addSection("Technical Skills", async () => {
      for (const row of skillRows) {
        currentY = await addTextBlock(
          `${row.category}: ${row.items.join(", ")}`,
          currentY,
          {
            fontSize: RESUME_PDF_LAYOUT.fontSizes.small,
            afterGap: 0.9,
          }
        );
      }
    });
  };

  const renderExperience = async () => {
    if (data.experience.length === 0) return;

    await addSection("Professional Experience", async () => {
      for (const [index, exp] of data.experience.entries()) {
        if (index >= maxExperiences) break;

        ensurePage(25);
        currentY = await addTextBlock(
          `${exp.role} | ${exp.company} | ${exp.period}`,
          currentY,
          {
            fontSize: RESUME_PDF_LAYOUT.fontSizes.body,
            fontWeight: "bold",
            afterGap: 1.1,
          }
        );

        for (const bullet of exp.bullets.slice(0, maxBulletsPerRole)) {
          currentY = await addTextBlock(`- ${bullet}`, currentY, {
            fontSize: RESUME_PDF_LAYOUT.fontSizes.small,
            indent: 3,
            maxWidth: pageWidth - 3,
            afterGap: spacing.bulletGap,
          });
        }

        currentY += spacing.experienceGap;
      }
    }, 35);
  };

  const renderProjects = async () => {
    const resumeProjects = data.projects;
    if (!resumeProjects?.length) return;

    await addSection("Selected Projects", async () => {
      for (const project of resumeProjects.slice(0, maxProjects)) {
        ensurePage(24);
        currentY = await addTextBlock(project.name, currentY, {
          fontSize: RESUME_PDF_LAYOUT.fontSizes.body,
          fontWeight: "bold",
          afterGap: 0.8,
        });
        currentY = await addTextBlock(project.line, currentY, {
          fontSize: RESUME_PDF_LAYOUT.fontSizes.small,
          color: RESUME_PDF_LAYOUT.colors.muted,
          afterGap: 0.9,
        });

        for (const bullet of (project.bullets ?? []).slice(0, 2)) {
          currentY = await addTextBlock(`- ${bullet}`, currentY, {
            fontSize: RESUME_PDF_LAYOUT.fontSizes.small,
            indent: 3,
            maxWidth: pageWidth - 3,
            afterGap: spacing.bulletGap,
          });
        }

        currentY += spacing.experienceGap;
      }
    }, 32);
  };

  const renderAdditionalExperience = async () => {
    if (isRTL) return;

    if (data.additionalExperience?.length) {
      await addSection("Additional Experience", async () => {
        for (const exp of data.additionalExperience ?? []) {
          ensurePage(18);
          currentY = await addTextBlock(
            `${exp.role} | ${exp.company} | ${exp.period}`,
            currentY,
            {
              fontSize: RESUME_PDF_LAYOUT.fontSizes.small,
              fontWeight: "bold",
              afterGap: 0.9,
            }
          );

          for (const bullet of exp.bullets.slice(0, 2)) {
            currentY = await addTextBlock(`- ${bullet}`, currentY, {
              fontSize: RESUME_PDF_LAYOUT.fontSizes.small,
              indent: 3,
              maxWidth: pageWidth - 3,
              afterGap: spacing.bulletGap,
            });
          }

          currentY += spacing.experienceGap;
        }
      }, 24);
      return;
    }

    if (data.additional) {
      await addSection("Additional Activities", async () => {
        currentY = await addTextBlock(data.additional ?? "", currentY, {
          fontSize: RESUME_PDF_LAYOUT.fontSizes.small,
        });
      });
    }
  };

  const renderCertifications = async () => {
    if (!data.certifications?.length) return;

    await addSection("Certifications", async () => {
      for (const certification of data.certifications?.slice(0, 4) ?? []) {
        const issuerLine = [
          certification.name,
          certification.issuer,
          certification.period,
        ]
          .filter(Boolean)
          .join(" | ");

        currentY = await addTextBlock(issuerLine, currentY, {
          fontSize: RESUME_PDF_LAYOUT.fontSizes.small,
          fontWeight: "bold",
          afterGap: 0.8,
        });

        if (certification.skills?.length) {
          currentY = await addTextBlock(
            `Skills: ${certification.skills.slice(0, 4).join(", ")}`,
            currentY,
            {
              fontSize: RESUME_PDF_LAYOUT.fontSizes.small,
              color: RESUME_PDF_LAYOUT.colors.muted,
              afterGap: 1,
            }
          );
        }
      }
    }, 20);
  };

  const renderEducation = async () => {
    if (!data.education.length) return;

    await addSection("Education", async () => {
      const educationList = isRTL ? data.education.slice(0, 1) : data.education;

      for (const edu of educationList) {
        const educationLine = [
          edu.degree,
          edu.institution,
          edu.period,
          edu.gpa ? `GPA: ${edu.gpa}` : undefined,
        ]
          .filter(Boolean)
          .join(" | ");

        currentY = await addTextBlock(educationLine, currentY, {
          fontSize: RESUME_PDF_LAYOUT.fontSizes.small,
          fontWeight: "bold",
          afterGap: 1,
        });
      }
    }, 18);
  };

  await renderHeader();

  const sectionRenderers: Record<ResumePdfSectionKey, () => Promise<void>> = {
    summary: renderSummary,
    skills: renderSkills,
    experience: renderExperience,
    projects: renderProjects,
    additionalExperience: renderAdditionalExperience,
    certifications: renderCertifications,
    education: renderEducation,
  };

  for (const section of getPdfSectionOrder(data.meta?.pdfSectionOrder)) {
    await sectionRenderers[section]();
  }

  return doc;
}
