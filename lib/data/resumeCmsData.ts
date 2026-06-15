import { RESUME_DATA_EN } from "./resumeData";
import { CertificationsService } from "$/db/certifications/certifications";
import { EducationManager } from "$/db/Education/EducationManager";
import { ProjectManager } from "$/db/projects/ProjectManager";
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

export async function getResumeDataFromCms(): Promise<ResumeData> {
  const [
    workExperienceResult,
    topSkillsResult,
    resumeProjectsResult,
    featuredProjectsResult,
    visibleProjectsResult,
    educationResult,
    certificationsResult,
  ] = await Promise.allSettled([
    WorkExperienceManager.getAll(true),
    SkillManager.getTopSkills(40, true),
    ProjectManager.getResumeFeatured(true),
    ProjectManager.getFeatured(true),
    ProjectManager.getAll(true),
    EducationManager.getAll(true),
    CertificationsService.getAll(true),
  ]);

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

  return {
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
  };
}
