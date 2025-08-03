export interface HeroProps {
  onExploreClick?: () => void;
  onAboutClick?: () => void;
  onExamplesClick?: () => void;
}

export interface HeroData {
  title: string;
  subtitle: string;
  exploreButton: string;
  resumeButton: string;
  careerButton: string;
}
