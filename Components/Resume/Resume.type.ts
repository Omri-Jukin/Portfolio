export interface CondensedResumeProps {
  className?: string;
}

export interface Language {
  name: string;
  level: string;
  flag: string;
}

export interface ProgrammingLanguage {
  name: string;
  level: string;
  color: "primary" | "secondary" | "default";
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  year: string;
}
