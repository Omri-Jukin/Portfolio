//! Import locale data - SINGLE SOURCE OF TRUTH
import enData from "../../locales/en.json";
import esData from "../../locales/es.json";
import frData from "../../locales/fr.json";
import heData from "../../locales/he.json";
import type { ResumeData } from "../types";

const localeData = {
  en: enData,
  es: esData,
  fr: frData,
  he: heData,
};

export type ResumeDataType = typeof localeData.en.resume;

export type expType = (typeof localeData.en.career.experiences)[0];

export type projectType = (typeof localeData.en.projects.projects)[0];

export type eduType = (typeof localeData.en.resume.education)[0];

export const extractResumeData = async (
  language: string = "en"
): Promise<ResumeData> => {
  const data = localeData[language as keyof typeof localeData] || localeData.en;

  //! ===================================================
  //! SINGLE SOURCE OF TRUTH - ALL DATA FROM LOCALE FILES
  //! ===================================================
  //! All resume data now comes from locales/[language].json

  const resumeData = data.resume;

  return {
    meta: {
      title: data.metadata.title,
      author: resumeData.personalInfo.name,
    },
    person: {
      name: resumeData.personalInfo.name,
      title: resumeData.personalInfo.title,
      contacts: {
        phone: resumeData.personalInfo.contacts.phone,
        email: resumeData.personalInfo.contacts.email,
        portfolio: resumeData.personalInfo.contacts.portfolio,
        github: resumeData.personalInfo.contacts.github,
        linkedin: resumeData.personalInfo.contacts.linkedin,
        location: resumeData.personalInfo.contacts.location,
      },
    },
    summary: resumeData.professionalSummary,
    tech: {
      frontend: resumeData.technicalSkills.frontend,
      backend: resumeData.technicalSkills.backend,
      architecture: resumeData.technicalSkills.architecture,
      databases: resumeData.technicalSkills.databases,
      cloudDevOps: resumeData.technicalSkills.cloudDevOps,
      softSkills: data.skills.categories.soft.skills.map(
        (skill: { description: string; name: string }) =>
          skill.description || skill.name
      ),
    },
    experience: data.career.experiences.map((exp: expType) => ({
      role: exp.role,
      company: exp.company,
      location: "Israel",
      period: exp.time,
      bullets: exp.details,
    })),
    projects: data.projects.projects
      .filter((project: projectType) => project.title !== "Portfolio Website")
      .map((project: projectType) => ({
        name: project.title,
        line: project.description,
        url: project.link,
      })),
    education: resumeData.education.map((edu: eduType) => ({
      degree: edu.degree,
      institution: edu.institution,
      location: edu.location,
      period: edu.period,
      gpa: edu.gpa || undefined,
      achievements: edu.achievements,
      coursework: edu.coursework,
      projects: edu.projects,
    })),
    additional: data.additionalActivities,
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
