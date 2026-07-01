import type {
  ResumeData,
  ResumePdfEngine,
  ResumePdfLayoutType,
  ResumePdfSectionKey,
} from "../types";

export const RESUME_PDF_LAYOUTS = ["ats", "visual"] as const;
export const DEFAULT_RESUME_PDF_LAYOUT: ResumePdfLayoutType = "visual";
export const DEFAULT_RESUME_PDF_ENGINE: ResumePdfEngine = "server";

export const DEFAULT_RESUME_PDF_SECTION_ORDER: ResumePdfSectionKey[] = [
  "summary",
  "skills",
  "experience",
  "projects",
  "additionalExperience",
  "education",
  "certifications",
];

const monthPattern =
  /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\b/g;

function withoutMonths(value: string) {
  return value.replace(monthPattern, "$1");
}

function uniqueNonEmpty(values: Array<string | undefined | null>) {
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

export function parseResumePdfLayout(
  value: string | null | undefined
): ResumePdfLayoutType | null {
  return value === "ats" || value === "visual" ? value : null;
}

export function parseResumePdfEngine(
  value: string | null | undefined
): ResumePdfEngine | null {
  return value === "server" || value === "react-pdf" ? value : null;
}

export function getResumePdfSectionOrder(
  sectionOrder: ResumePdfSectionKey[] | undefined
): ResumePdfSectionKey[] {
  const allowed = new Set<ResumePdfSectionKey>(DEFAULT_RESUME_PDF_SECTION_ORDER);
  const seen = new Set<ResumePdfSectionKey>();
  const ordered: ResumePdfSectionKey[] = [];

  if (Array.isArray(sectionOrder)) {
    for (const item of sectionOrder) {
      if (!allowed.has(item) || seen.has(item)) continue;
      ordered.push(item);
      seen.add(item);
    }
  }

  return [
    ...ordered,
    ...DEFAULT_RESUME_PDF_SECTION_ORDER.filter((item) => !seen.has(item)),
  ];
}

export function getPdfReadyResumeData(resume: ResumeData): ResumeData {
  if (resume.meta?.pdfDateFormat !== "year") {
    return resume;
  }

  return {
    ...resume,
    experience: resume.experience.map((item) => ({
      ...item,
      period: withoutMonths(item.period),
    })),
    education: resume.education.map((item) => ({
      ...item,
      period: withoutMonths(item.period),
    })),
    certifications: resume.certifications?.map((item) => ({
      ...item,
      period: item.period ? withoutMonths(item.period) : item.period,
    })),
    additionalExperience: resume.additionalExperience?.map((item) => ({
      ...item,
      period: withoutMonths(item.period),
    })),
  };
}

export function normalizeResumeUrl(value: string | undefined) {
  if (!value?.trim()) return undefined;
  return value.startsWith("http") || value.startsWith("/")
    ? value
    : `https://${value}`;
}

export function getResumeContactItems(resume: ResumeData) {
  const linksByLabel = new Map(
    (resume.links ?? []).map((link) => [link.label.toLowerCase(), link.url])
  );

  return uniqueNonEmpty([
    resume.person.contacts.phone ? `Phone: ${resume.person.contacts.phone}` : "",
    resume.person.contacts.email ? `Email: ${resume.person.contacts.email}` : "",
    resume.person.contacts.location,
    normalizeResumeUrl(
      linksByLabel.get("portfolio") ?? resume.person.contacts.portfolio
    ),
    normalizeResumeUrl(
      linksByLabel.get("linkedin") ?? resume.person.contacts.linkedin
    ),
    normalizeResumeUrl(linksByLabel.get("github") ?? resume.person.contacts.github),
  ]);
}

export function getResumeContactLine(resume: ResumeData) {
  return getResumeContactItems(resume).join(" | ");
}

export function getResumeSkillGroups(resume: ResumeData) {
  if (resume.coreSkills?.length) {
    return resume.coreSkills.filter((group) => group.items.length > 0);
  }

  return [
    { category: "Frontend", items: resume.tech?.frontend ?? [] },
    { category: "Backend", items: resume.tech?.backend ?? [] },
    { category: "Architecture", items: resume.tech?.architecture ?? [] },
    { category: "Databases", items: resume.tech?.databases ?? [] },
    { category: "Cloud / DevOps", items: resume.tech?.cloudDevOps ?? [] },
    { category: "Testing / Tooling", items: resume.tech?.aiTools ?? [] },
  ].filter((group) => group.items.length > 0);
}

export function getCompactResumeSummary(summary: string, maxChars = 260) {
  const normalized = summary.replace(/\s+/g, " ").trim();
  if (!normalized) return "";

  const sentences =
    normalized.match(/[^.!?]+[.!?]+/g)?.map((sentence) => sentence.trim()) ?? [
      normalized,
    ];
  const selected: string[] = [];

  for (const sentence of sentences) {
    const next = [...selected, sentence].join(" ");
    if (selected.length >= 2 || next.length > maxChars) break;
    selected.push(sentence);
  }

  const result = selected.length > 0 ? selected.join(" ") : sentences[0];
  if (result.length <= maxChars) return result;

  const truncated = result.slice(0, maxChars + 1);
  const lastSpace = truncated.lastIndexOf(" ");

  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxChars).trim()}.`;
}

export function getResumePdfFileName(layout: ResumePdfLayoutType) {
  const suffix = layout === "ats" ? "ATS" : "Design";
  return `Omri Jukin - Resume - ${suffix}.pdf`;
}
