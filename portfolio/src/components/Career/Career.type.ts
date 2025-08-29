import { ReactNode } from "react";

export interface CareerProps {
  onCareerClick?: () => void;
  children?: ReactNode;
}

export interface Experience {
  role: string;
  company: string;
  time: string;
  details: string[];
}
