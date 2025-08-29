import { BoxProps } from "@mui/material";

export interface SectionProps extends BoxProps {
  children: React.ReactNode;
  backgroundElements?: React.ReactNode;
}
