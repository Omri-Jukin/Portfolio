export interface SkillDetail {
  title: string;
  description: string;
  experience: string;
  technologies: string[];
  examples: string[];
  years: string;
}

export interface SkillShowcaseProps {
  skillDetail: SkillDetail;
  open: boolean;
  onClose: () => void;
}
