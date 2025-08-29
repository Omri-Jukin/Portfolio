import { StaticImageData } from "next/image";

export interface HeroProps {
  onExploreClick?: () => void;
  onAboutClick?: () => void;
  onCareerClick?: () => void;
  profileSrc?: StaticImageData;
  ownerName?: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
  exploreButton: string;
  resumeButton: string;
  careerButton: string;
}
