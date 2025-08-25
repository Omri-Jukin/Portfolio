export interface HeroProps {
  onExploreClick?: () => void;
  onAboutClick?: () => void;
  onCareerClick?: () => void;
  profileSrc?: string;
  ownerName?: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
  exploreButton: string;
  resumeButton: string;
  careerButton: string;
}
