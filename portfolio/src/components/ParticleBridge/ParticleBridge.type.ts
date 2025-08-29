export type ParticleBridgeProps = {
  opacity?: number;
  scale?: number;
  y?: number;
  x?: number;
  particleCount?: number;
  duration?: number;
  delay?: number;
  ease?:
    | "linear"
    | "easeIn"
    | "easeOut"
    | "easeInOut"
    | "circIn"
    | "circOut"
    | "circInOut"
    | "backIn"
    | "backOut"
    | "backInOut"
    | "anticipate";
};
