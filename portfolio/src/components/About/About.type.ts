export interface AboutProps {
  onSkillClick?: (skillKey: string) => void;
}

export interface Skill {
  key: string;
  label: string;
}

export interface SkillDetail {
  title: string;
  description: string;
  experience: string;
  technologies: string[];
  examples: string[];
  years: string;
}
