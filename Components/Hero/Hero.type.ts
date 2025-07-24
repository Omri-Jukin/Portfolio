export interface HeroProps {
  onExploreClick?: () => void;
  onAboutClick?: () => void;
}

export interface HeroData {
  title: string;
  subtitle: string;
  exploreButton: string;
  aboutButton: string;
}
