export type AnimatedTextType =
  | "scaleUp"
  | "scaleDown"
  | "fadeIn"
  | "fadeOut"
  | "slideUp"
  | "slideDown";

export interface AnimatedTextProps {
  type?: AnimatedTextType;
  children: React.ReactNode;
  delay?: number;
  length?: number;
  hoverColor?: string;
  fontSize?: string | number;
  fontWeight?: number;
  scale?: number;
  opacity?: number;
  translateY?: number;
}

export type AnimationStyle = { [selector: string]: React.CSSProperties };

export type AnimationTypes = {
  scaleUp: (s?: number) => AnimationStyle;
  scaleDown: (s?: number) => AnimationStyle;
  fadeIn: (o?: number) => AnimationStyle;
  fadeOut: (o?: number) => AnimationStyle;
  slideUp: (y?: number) => AnimationStyle;
  slideDown: (y?: number) => AnimationStyle;
};
