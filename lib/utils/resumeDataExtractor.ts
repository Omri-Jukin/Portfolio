import { RESUME_DATA_EN } from "../data/resumeData";
import type { ResumeData } from "../types";

export const extractResumeData = async (
  language: string = "en"
): Promise<ResumeData> => {
  void language;
  return RESUME_DATA_EN;
};

export const getAvailableLanguages = () => {
  return ["en"];
};

export const getLanguageName = (code: string): string => {
  const languageNames: { [key: string]: string } = {
    en: "English",
  };
  return languageNames[code] || code;
};
