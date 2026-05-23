import { RESUME_DATA_EN } from "./resumeData";
import type { ResumeData } from "../types";

/**
 * Typed English resume — single source of truth for public profile data.
 * Other locales fall back to EN until translated SSOT exists.
 */
export function getResumeData(locale?: string): ResumeData {
  void locale;
  return RESUME_DATA_EN;
}
