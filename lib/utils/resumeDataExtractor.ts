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
      },
    },
    projects: {
      projects: data.projects.projects,
    },
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
