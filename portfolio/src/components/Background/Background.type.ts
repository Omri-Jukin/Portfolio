export type BackgroundVariant =
  | "floating"
  | "particles"
  | "waves"
  | "geometric"
  | "cosmic"
  | "gradient-orbs"
  | "three-galaxy";

export type BackgroundIntensity = "low" | "medium" | "high";

export type BackgroundSpeed = "slow" | "normal" | "fast";

export type BackgroundColor = "primary" | "secondary" | "accent" | "custom";

export interface BackgroundProps {
  variant?: BackgroundVariant;
  intensity?: BackgroundIntensity;
  speed?: BackgroundSpeed;
  color?: BackgroundColor;
  customColor?: string;
  children?: React.ReactNode;
  className?: string;
}

export interface FloatingElement {
  id: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  animationDelay: number;
  animationDuration: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

export interface Wave {
  id: string;
  amplitude: number;
  frequency: number;
  phase: number;
  color: string;
  opacity: number;
}

export interface GradientOrb {
  id: string;
  x: number;
  y: number;
  size: number;
  color1: string;
  color2: string;
  animationDelay: number;
  animationDuration: number;
  blur: number;
}
