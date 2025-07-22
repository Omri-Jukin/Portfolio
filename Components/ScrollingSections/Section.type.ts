import { BoxProps } from "@mui/material";

export interface SectionProps extends BoxProps {
  variant: "hero" | "about" | "qa" | "services" | "projects" | "contact";
  children: React.ReactNode;
  backgroundElements?: React.ReactNode;
}
