import { BoxProps } from "@mui/material";
import { MotionWrapperProps } from "~/MotionWrapper";

export interface SectionCardProps extends BoxProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  id?: string;
  animationDelay?: number;
  animationVariant?: MotionWrapperProps["variant"];
}
