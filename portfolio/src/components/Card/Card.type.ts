export interface CardProps {
  title: string;
  tagline?: string;
  description?: string;
  date?: string;
  href: string;
  icon?: React.ReactNode;
  color?: string;
  buttonText?: string;
  photoUrl?: string;
  photoAlt?: string;
  photoPosition?: "left" | "right";
  photoSize?: "small" | "medium" | "large";
  animation?: "fade" | "slide" | "scale" | "bounce";
  gradient?: boolean;
  glow?: boolean;
  style?: React.CSSProperties;
}
