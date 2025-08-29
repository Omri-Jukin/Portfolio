import { ButtonProps } from "@mui/material";

export interface SkillTagProps extends ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}
