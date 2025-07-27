export type VisionRealityBridgeProps = {
  icons?: string[];
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
