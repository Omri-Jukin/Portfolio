export interface PortfolioSection {
  title: string;
  tagline?: string;
  description: string;
  href: string;
  color?: string;
  icon?: React.ReactNode;
  buttonText?: string;
  photoUrl?: string;
  photoAlt?: string;
  photoPosition?: "left" | "right";
  photoSize?: "small" | "medium" | "large";
  animation?: "fade" | "slide" | "scale" | "bounce";
  transparent?: boolean;
  gradient?: boolean;
  glow?: boolean;
}
