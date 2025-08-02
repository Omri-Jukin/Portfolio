export type CalendlyProps = {
  url: string;
  text: string;
  backgroundColor?: string;
  textColor?: string;
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "center-left"
    | "center"
    | "center-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  className?: string;
};
