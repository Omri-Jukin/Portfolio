import { ResumeData } from "./pdfGenerator";
import { EducationManager } from "../db/Education/EducationManager";

// Import locale data
import enData from "../../locales/en.json";
import esData from "../../locales/es.json";
import frData from "../../locales/fr.json";
import heData from "../../locales/he.json";

const localeData = {
  en: enData,
  es: esData,
  fr: frData,
  he: heData,
};

export const extractResumeData = async (
  language: string = "en"
): Promise<ResumeData> => {
  const data = localeData[language as keyof typeof localeData] || localeData.en;

  // Fetch education data from database
  const educationData = await EducationManager.getAll(true);

  // Transform to new PDF generator format
  return {
    meta: {
      title: data.metadata.title,
      author: "Omri Jukin",
    },
    person: {
      name: "Omri Jukin",
      title: data.resume.experience || "Full Stack Developer",
      contacts: {
        phone: "+972 52-334-4064",
        email: "contact@omrijukin.com",
        portfolio: "https://omrijukin.com",
        github: "https://github.com/Omri-Jukin",
        linkedin: "https://linkedin.com/in/omri-jukin",
        location: "Israel",
      },
    },
    summary:
      data.resume.professionalSummary ||
      "Full Stack Developer with 5+ years expertise in scalable web development and modern technologies.",
    tech: {
      frontend: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "HTML5",
        "CSS3",
        "Material-UI",
        "Tailwind CSS",
        "Framer Motion",
      ],
      backend: [
        "Node.js",
        "Express.js",
        "tRPC",
        "Drizzle ORM",
        "PostgreSQL",
        "MongoDB",
        "REST APIs",
        "GraphQL",
      ],
      architecture: [
        "Microservices",
        "Monolithic Systems",
        "API Design",
        "System Integration",
        "Performance Optimization",
        "Scalable Architecture",
      ],
      databases: [
        "PostgreSQL",
        "MongoDB",
        "Data Modeling",
        "Query Optimization",
        "Database Design",
        "Data Architecture",
      ],
      cloudDevOps: [
        "AWS",
        "Vercel",
        "Docker",
        "CI/CD",
        "Deployment",
        "Cloud Infrastructure",
        "Git",
        "Jest",
        "Vitest",
        "Storybook",
        "Testing",
      ],
      softSkills: data.skills?.categories?.soft?.skills?.map(
        (skill) => skill.description || skill.name
      ) || [
        "Team management, mentoring, and project coordination",
        "Analytical thinking and creative solutions",
        "Technical and non-technical stakeholder communication",
        "Quick learning and technology adoption",
      ],
    },
    experience:
      data.career?.experiences?.map((exp) => ({
        role: exp.role,
        company: exp.company,
        location: "Israel",
        period: exp.time,
        bullets: exp.details || [],
        stackLine: (exp as { stackLine?: string }).stackLine,
      })) || [],
    projects:
      data.projects?.projects?.map((project) => ({
        name: project.title,
        line: project.description,
        url: project.link,
      })) || [],
    education: educationData.map((edu) => ({
      degree: edu.degree,
      institution: edu.institution,
      location: edu.location,
      period: `${new Date(edu.startDate).getFullYear()} - ${
        edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"
      }`,
      gpa: edu.gpa || undefined,
      achievements: edu.achievements || [],
      coursework: edu.coursework || [],
      projects: edu.projects || [],
    })),
    additional:
      data.additionalActivities ||
      "Continuous learning in full stack development, contributing to open-source projects, and staying current with modern web technologies and best practices.",
  };
};

export const getAvailableLanguages = () => {
  return Object.keys(localeData);
};

export const getLanguageName = (code: string): string => {
  const languageNames: { [key: string]: string } = {
    en: "English",
    es: "Spanish",
    fr: "French",
    he: "Hebrew",
  };
  return languageNames[code] || code;
};
