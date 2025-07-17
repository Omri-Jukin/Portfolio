export type AnimatedTextType =
  | "scale"
  | "fade"
  | "scaleUp"
  | "scaleDown"
  | "fadeIn"
  | "fadeOut"
  | "slideUp"
  | "slideDown";

export interface AnimatedTextProps {
  type?: AnimatedTextType | AnimatedTextType[];
  children: React.ReactNode;
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
  scale: (s?: number) => AnimationStyle;
  fade: (o?: number) => AnimationStyle;
  scaleUp: (s?: number) => AnimationStyle;
  scaleDown: (s?: number) => AnimationStyle;
  fadeIn: (o?: number) => AnimationStyle;
  fadeOut: (o?: number) => AnimationStyle;
  slideUp: (y?: number) => AnimationStyle;
  slideDown: (y?: number) => AnimationStyle;
};
