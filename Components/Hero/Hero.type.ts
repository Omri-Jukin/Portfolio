import { StaticImageData } from "next/image";

export interface HeroProps {
  onProjectsClick?: () => void;
  onResumeClick?: () => void;
  onContactClick?: () => void;
  profileSrc?: StaticImageData;
  ownerName?: string;
}

export interface HeroData {
  name: string;
  roleLine: string;
  headline: string;
  subtitle: string;
  resumeButton: string;
  projectsButton: string;
  contactButton: string;
}
