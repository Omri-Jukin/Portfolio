import { AnimationType } from "../AnimatedBackground";

export interface HeaderProps {
  isDarkMode?: boolean;
  animationType: AnimationType;
  onAnimationTypeChange: (type: AnimationType) => void;
}
