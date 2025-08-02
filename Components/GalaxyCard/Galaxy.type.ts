export interface GalaxyProps {
  count?: number;
  size?: number;
  radius?: number;
  branches?: number;
  spin?: number;
  randomness?: number;
  randomnessPower?: number;
  insideColor?: string;
  outsideColor?: string;
  rotationSpeed?: number;
  pulseSpeed?: number;
  pulseIntensity?: number;
  animateColors?: boolean;
  animateSpin?: boolean;
  intensity?: "low" | "medium" | "high";
  speed?: "slow" | "normal" | "fast";
  className?: string;
  children?: React.ReactNode;
}
