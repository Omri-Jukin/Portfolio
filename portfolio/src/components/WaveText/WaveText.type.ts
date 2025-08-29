/**
 * WaveText component
 * @param {WaveTextProps} props - WaveTextProps
 * @returns WaveText component
 */
export type WaveTextProps = {
  text?: string;
  type?: "text" | "dots";
  animationDirection?: "vertical" | "horizontal";
  duration?: number;
  delay?: number;
  repeat?: number;
  repeatType?: "loop" | "reverse" | "mirror";
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
  amplitude?: number;
  frequency?: number;
  phase?: number;
  phaseOffset?: number;
  style?: React.CSSProperties;
};
