import { ResumeData } from "./pdfGenerator";

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

export const extractResumeData = (language: string = "en"): ResumeData => {
  const data = localeData[language as keyof typeof localeData] || localeData.en;

  return {
    metadata: {
      title: data.metadata.title,
      description: data.metadata.description,
    },
    resume: {
      title: data.resume.title,
      description: data.resume.description,
      experience: data.resume.experience,
      professionalSummary: data.resume.professionalSummary,
    },
    career: {
      experiences: data.career.experiences,
    },
    skills: {
      categories: {
        technical: data.skills.categories.technical,
        soft: data.skills.categories.soft,
      },
    },
    projects: {
      projects: data.projects.projects,
    },
    languages: {
      programming: [
        { name: "TypeScript", level: "Advanced" },
        { name: "JavaScript", level: "Advanced" },
        { name: "Java", level: "Intermediate" },
        { name: "C#", level: "Intermediate" },
        { name: "Python", level: "Novice" },
      ],
      spoken: [
        { name: "Hebrew", level: "Native" },
        { name: "English", level: "Professional" },
        { name: "Spanish", level: "Novice" },
      ],
    },
    additionalActivities:
      "Founder of an online community promoting critical and rational thinking and open debates. Engaged in public speaking and live broadcasts on topics related to hard sciences, soft sciences, rational thinking, and technology. Enthusiastic hobbyist magician, using creative skills to engage audiences and encourage curiosity.",
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
