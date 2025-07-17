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
