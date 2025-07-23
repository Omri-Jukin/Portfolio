import { PaperProps } from "@mui/material";

export interface QACardProps extends PaperProps {
  question: string;
  answer: string;
  animationDelay?: number;
}
