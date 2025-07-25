export type GapType =
  | "hero-about"
  | "about-qa"
  | "qa-services"
  | "services-career"
  | "career-projects"
  | "services-projects"
  | "projects-contact"
  | "default";

export interface ScrollGapAnimatorProps {
  sectionId: string;
  gapType?: GapType;
  height?: number;
}
