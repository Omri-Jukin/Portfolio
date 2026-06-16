import { RESUME_DATA_EN } from "./resumeData";
import { CertificationsService } from "$/db/certifications/certifications";
import { EducationManager } from "$/db/Education/EducationManager";
import { ProjectManager } from "$/db/projects/ProjectManager";
import { PublicContentBlockManager } from "$/db/publicContent/PublicContentBlockManager";
import { SkillManager } from "$/db/skills/SkillManager";
import { WorkExperienceManager } from "$/db/workExperiences/WorkExperienceManager";
import type { Certification, Education, Skill, WorkExperience } from "$/db/schema/schema.types";
import type { IProject, ResumeData } from "$/types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const skillCategoryLabels: Record<string, string> = {
  cloud: "Cloud & DevOps",
  database: "Databases",
  framework: "Frameworks",
  language: "Languages",
  soft: "Soft Skills",
  technical: "Technical",
  tool: "Tools",
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

function mapWorkExperience(item: WorkExperience): ResumeData["experience"][number] {
  const bullets = [
    ...item.achievements,
    ...item.responsibilities,
  ].filter((value, index, values) => value && values.indexOf(value) === index);

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

function groupSkills(skills: Skill[]): ResumeData["coreSkills"] {
  const groups = new Map<string, string[]>();

  for (const skill of skills) {
    const key = skill.subCategory || skill.category;
    const label = skillCategoryLabels[key] ?? skillCategoryLabels[skill.category] ?? key;
    const existing = groups.get(label) ?? [];

    if (!existing.includes(skill.name)) {
      groups.set(label, [...existing, skill.name]);
    }
  }

  return Array.from(groups.entries()).map(([category, items]) => ({
    category,
    items: items.slice(0, 12),
  }));
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
  links?: unknown;
};

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
    },
    person: {
      ...base.person,
      name: stringValue(metadata.name) ?? base.person.name,
      title: profile?.subtitle ?? base.person.title,
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
    featuredProjectsResult,
    visibleProjectsResult,
    educationResult,
    certificationsResult,
  ] = await Promise.allSettled([
    PublicContentBlockManager.getBySection({
      page: "resume",
      sectionKey: "profile",
      locale: "en",
      visibleOnly: true,
    }),
    WorkExperienceManager.getAll(true),
    SkillManager.getTopSkills(40, true),
    ProjectManager.getResumeFeatured(true),
    ProjectManager.getFeatured(true),
    ProjectManager.getAll(true),
    EducationManager.getAll(true),
    CertificationsService.getAll(true),
  ]);

  const resumeProfileBlocks = settledValue(resumeProfileResult, []);
  const workExperiences = settledValue(workExperienceResult, []);
  const skills = settledValue(topSkillsResult, []);
  const resumeProjects = settledValue(resumeProjectsResult, []);
  const featuredProjects = settledValue(featuredProjectsResult, []);
  const visibleProjects = settledValue(visibleProjectsResult, []);
  const education = settledValue(educationResult, []);
  const certifications = settledValue(certificationsResult, []);

  const selectedProjects =
    resumeProjects.length > 0
      ? resumeProjects
      : featuredProjects.length > 0
        ? featuredProjects
        : visibleProjects;

  return applyResumeProfileBlocks({
    ...RESUME_DATA_EN,
    coreSkills: skills.length > 0 ? groupSkills(skills) : RESUME_DATA_EN.coreSkills,
    experience:
      workExperiences.length > 0
        ? workExperiences.map(mapWorkExperience)
        : RESUME_DATA_EN.experience,
    projects:
      selectedProjects.length > 0
        ? selectedProjects.map(mapProject)
        : RESUME_DATA_EN.projects,
    education:
      education.length > 0 ? education.map(mapEducation) : RESUME_DATA_EN.education,
    certifications:
      certifications.length > 0
        ? certifications.map(mapCertification)
        : RESUME_DATA_EN.certifications,
  }, resumeProfileBlocks);
}
