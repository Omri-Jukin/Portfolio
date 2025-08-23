import type {
  Skill,
  SkillDB,
  NewSkill,
  UpdateSkill,
} from "../schema/schema.types";

export type { Skill, SkillDB, NewSkill, UpdateSkill };

export interface SkillFormData {
  name: string;
  category:
    | "technical"
    | "soft"
    | "language"
    | "tool"
    | "framework"
    | "database"
    | "cloud";
  subCategory: string;
  proficiencyLevel: number; // 1-100
  proficiencyLabel: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience: number;
  description: string;
  icon: string;
  color: string;
  relatedSkills: string[];
  certifications: string[];
  projects: string[];
  lastUsed: string;
  isVisible: boolean;
  displayOrder: number;
}

export interface SkillStatistics {
  total: number;
  totalVisible: number;
  byCategory: Array<{
    category: string;
    count: number;
    averageProficiency: number;
  }>;
  byProficiencyLevel: Array<{
    proficiencyLabel: string;
    count: number;
  }>;
  topSkills: Array<{
    skill: Skill;
    proficiencyLevel: number;
  }>;
  recentlyUsed: Skill[];
  averageExperience: number;
}

export interface SkillFilters {
  category?: string;
  subCategory?: string;
  proficiencyLabel?: string;
  minProficiency?: number;
  maxProficiency?: number;
  minExperience?: number;
  isVisible?: boolean;
  usedRecently?: boolean; // within last year
}
