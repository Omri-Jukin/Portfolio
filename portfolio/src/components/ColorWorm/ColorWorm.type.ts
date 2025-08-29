export type ColorWormProps = {
  opacity?: number;
  scale?: number;
  y?: number;
  amount?: number;
  size?: number;
  speed?: number;
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
