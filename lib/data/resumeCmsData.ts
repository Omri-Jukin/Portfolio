import { RESUME_DATA_EN } from "./resumeData";
import { CertificationsService } from "$/db/certifications/certifications";
import { EducationManager } from "$/db/Education/EducationManager";
import { ProjectManager } from "$/db/projects/ProjectManager";
import { PublicContentBlockManager } from "$/db/publicContent/PublicContentBlockManager";
import { SkillManager } from "$/db/skills/SkillManager";
import { WorkExperienceManager } from "$/db/workExperiences/WorkExperienceManager";
import type { Certification, Education, Skill, WorkExperience } from "$/db/schema/schema.types";
import type { IProject, ResumeData, ResumePdfSectionKey } from "$/types";

const DEFAULT_PDF_SECTION_ORDER = [
  "summary",
  "skills",
  "experience",
  "projects",
  "additionalExperience",
  "education",
  "certifications",
] satisfies NonNullable<ResumeData["meta"]>["pdfSectionOrder"];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const preferredSkillCategories = [
  "Languages",
  "Frontend",
  "Backend",
  "Databases",
  "Cloud / DevOps",
  "Testing / Tooling",
] as const;

const skillCategoryLabels: Record<string, string> = {
  "api design": "Backend",
  backend: "Backend",
  cloud: "Cloud / DevOps",
  "cloud & devops": "Cloud / DevOps",
  "cloud / devops": "Cloud / DevOps",
  "cloud / infrastructure / devops": "Cloud / DevOps",
  database: "Databases",
  databases: "Databases",
  devops: "Cloud / DevOps",
  framework: "Frontend",
  frameworks: "Frontend",
  frontend: "Frontend",
  language: "Languages",
  languages: "Languages",
  testing: "Testing / Tooling",
  "testing / tooling": "Testing / Tooling",
  tool: "Testing / Tooling",
  tooling: "Testing / Tooling",
  tools: "Testing / Tooling",
};

function settledValue<T>(result: PromiseSettledResult<T>, fallback: T): T {
  return result.status === "fulfilled" ? result.value : fallback;
}

function formatMonthYear(value: string) {
  return dateFormatter.format(new Date(value));
}

function formatPeriod(startDate: string, endDate: string | null) {
  return `${formatMonthYear(startDate)} - ${endDate ? formatMonthYear(endDate) : "Present"}`;
}

function uniqueStrings(values: string[]): string[] {
  return values.filter(
    (value, index, allValues) => value.trim() && allValues.indexOf(value) === index
  );
}

function mapWorkExperience(item: WorkExperience): ResumeData["experience"][number] {
  const achievements = uniqueStrings(item.achievements);
  const fallbackBullets = uniqueStrings([
    ...item.responsibilities,
    item.description,
  ]);
  const bullets = achievements.length > 0 ? achievements : fallbackBullets;

  return {
    role: item.role,
    company: item.company,
    location: item.location,
    period: formatPeriod(item.startDate, item.endDate),
    bullets: bullets.length > 0 ? bullets : [item.description],
    stackLine: item.technologies.join(", "),
  };
}

function mapProject(project: IProject): NonNullable<ResumeData["projects"]>[number] {
  const url =
    (project.caseStudySlug ? `/projects/${project.caseStudySlug}` : undefined) ??
    `/projects/${project.id}` ??
    project.liveUrl ??
    project.githubUrl ??
    project.documentationUrl ??
    project.demoUrl ??
    undefined;

  return {
    id: project.caseStudySlug ?? project.id,
    name: project.title,
    line: project.hiringSignal || project.subtitle || project.description,
    url,
    bullets: [
      project.outcome || project.description,
      ...project.decisions,
      ...project.keyFeatures,
      ...(project.caseStudyRole || project.myRole
        ? [`Role: ${project.caseStudyRole || project.myRole}`]
        : []),
    ]
      .filter(Boolean)
      .slice(0, 4),
  };
}

function mapEducation(item: Education): ResumeData["education"][number] {
  const degree =
    item.fieldOfStudy && !item.degree.includes(item.fieldOfStudy)
      ? `${item.degree}, ${item.fieldOfStudy}`
      : item.degree;

  return {
    degree,
    institution: item.institution,
    location: item.location,
    period: formatPeriod(item.startDate, item.endDate),
    ...(item.gpa ? { gpa: item.gpa } : {}),
    ...(item.achievements.length ? { achievements: item.achievements } : {}),
    ...(item.coursework.length ? { coursework: item.coursework } : {}),
    ...(item.projects.length ? { projects: item.projects } : {}),
  };
}

function mapCertification(item: Certification): NonNullable<ResumeData["certifications"]>[number] {
  return {
    name: item.name,
    issuer: item.issuer,
    period: formatMonthYear(item.issueDate),
    url: item.verificationUrl ?? undefined,
    skills: item.skills,
  };
}

function getSkillCategoryLabel(skill: Skill) {
  const rawCategory = skill.subCategory || skill.category;
  const normalized = rawCategory.trim().toLowerCase();

  return skillCategoryLabels[normalized] ?? rawCategory;
}

function groupSkills(skills: Skill[]): ResumeData["coreSkills"] {
  const groups = new Map<string, string[]>();

  for (const skill of skills) {
    const label = getSkillCategoryLabel(skill);
    const existing = groups.get(label) ?? [];

    if (!existing.includes(skill.name)) {
      groups.set(label, [...existing, skill.name]);
    }
  }

  const groupedSkills = Array.from(groups.entries()).map(([category, items]) => ({
    category,
    items: items.slice(0, 10),
  }));
  const preferred = preferredSkillCategories.flatMap((category) =>
    groupedSkills.filter((group) => group.category === category)
  );

  if (preferred.length >= 4) {
    return preferred;
  }

  const fallback = groupedSkills.filter(
    (group) => !preferredSkillCategories.includes(
      group.category as (typeof preferredSkillCategories)[number]
    )
  );

  return [...preferred, ...fallback].slice(0, 6);
}

type ResumeProfileMetadata = {
  name?: unknown;
  title?: unknown;
  phone?: unknown;
  email?: unknown;
  portfolio?: unknown;
  github?: unknown;
  linkedin?: unknown;
  location?: unknown;
  photoUrl?: unknown;
  links?: unknown;
  pdfDateFormat?: unknown;
  pdfSectionOrder?: unknown;
};

const LEGACY_DEFAULT_PROFILE_PHOTO_URL = "/profile-photo.jpg";

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function parseResumeLinks(value: unknown): ResumeData["links"] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const links = value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as { label?: unknown; url?: unknown };
      const label = stringValue(candidate.label);
      const url = stringValue(candidate.url);

      return label && url ? { label, url } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return links.length > 0 ? links : undefined;
}

function normalizeProfilePhotoUrl(
  value: string | undefined,
  fallback: string | undefined
) {
  if (!value || value === LEGACY_DEFAULT_PROFILE_PHOTO_URL) {
    return fallback;
  }

  return value;
}

function parsePdfSectionOrder(value: unknown): ResumePdfSectionKey[] {
  const allowed = new Set<ResumePdfSectionKey>(DEFAULT_PDF_SECTION_ORDER);
  const seen = new Set<ResumePdfSectionKey>();
  const ordered: ResumePdfSectionKey[] = [];

  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item !== "string") continue;
      const section = item as ResumePdfSectionKey;
      if (!allowed.has(section) || seen.has(section)) continue;
      ordered.push(section);
      seen.add(section);
    }
  }

  return [
    ...ordered,
    ...DEFAULT_PDF_SECTION_ORDER.filter((item) => !seen.has(item)),
  ];
}

function applyResumeProfileBlocks(
  base: ResumeData,
  blocks: Awaited<ReturnType<typeof PublicContentBlockManager.getBySection>>
): ResumeData {
  const profile = blocks.find((block) => block.blockKey === "profile");
  const summary = blocks.find((block) => block.blockKey === "summary");
  const metadata = (profile?.metadata ?? {}) as ResumeProfileMetadata;
  const links = parseResumeLinks(metadata.links);

  return {
    ...base,
    meta: {
      ...base.meta,
      title: profile?.title ?? base.meta?.title,
      author: stringValue(metadata.name) ?? base.meta?.author,
      pdfDateFormat:
        stringValue(metadata.pdfDateFormat) === "year"
          ? "year"
          : "month-year",
      pdfSectionOrder: parsePdfSectionOrder(metadata.pdfSectionOrder),
    },
    person: {
      ...base.person,
      name: stringValue(metadata.name) ?? base.person.name,
      title: profile?.subtitle ?? base.person.title,
      photoUrl: normalizeProfilePhotoUrl(
        stringValue(metadata.photoUrl),
        base.person.photoUrl
      ),
      contacts: {
        ...base.person.contacts,
        phone: stringValue(metadata.phone) ?? base.person.contacts.phone,
        email: stringValue(metadata.email) ?? base.person.contacts.email,
        portfolio:
          stringValue(metadata.portfolio) ?? base.person.contacts.portfolio,
        github: stringValue(metadata.github) ?? base.person.contacts.github,
        linkedin:
          stringValue(metadata.linkedin) ?? base.person.contacts.linkedin,
        location:
          stringValue(metadata.location) ?? base.person.contacts.location,
      },
    },
    headline: profile?.body ?? base.headline,
    summary: summary?.body ?? base.summary,
    links: links ?? base.links,
  };
}

export async function getResumeDataFromCms(): Promise<ResumeData> {
  const [
    resumeProfileResult,
    workExperienceResult,
    topSkillsResult,
    resumeProjectsResult,
    educationResult,
    certificationsResult,
  ] = await Promise.allSettled([
    PublicContentBlockManager.getBySection({
      page: "resume",
      sectionKey: "profile",
      locale: "en",
      visibleOnly: true,
    }),
    WorkExperienceManager.getResumeFeatured(true),
    SkillManager.getResumeFeatured(true),
    ProjectManager.getResumeFeatured(true),
    EducationManager.getResumeFeatured(true),
    CertificationsService.getResumeFeatured(true),
  ]);

  const resumeProfileBlocks = settledValue(resumeProfileResult, []).filter(
    (block) => block.isFeatured
  );
  const workExperiences =
    workExperienceResult.status === "fulfilled"
      ? workExperienceResult.value.map(mapWorkExperience)
      : RESUME_DATA_EN.experience;
  const skills =
    topSkillsResult.status === "fulfilled"
      ? groupSkills(topSkillsResult.value)
      : RESUME_DATA_EN.coreSkills;
  const resumeProjects =
    resumeProjectsResult.status === "fulfilled"
      ? resumeProjectsResult.value.map(mapProject)
      : RESUME_DATA_EN.projects;
  const education =
    educationResult.status === "fulfilled"
      ? educationResult.value.map(mapEducation)
      : RESUME_DATA_EN.education;
  const certifications =
    certificationsResult.status === "fulfilled"
      ? certificationsResult.value.map(mapCertification)
      : RESUME_DATA_EN.certifications;

  return applyResumeProfileBlocks({
    ...RESUME_DATA_EN,
    coreSkills: skills,
    experience: workExperiences,
    projects: resumeProjects,
    education,
    certifications,
  }, resumeProfileBlocks);
}
