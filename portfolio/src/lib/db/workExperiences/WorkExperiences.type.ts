import type {
  WorkExperience,
  WorkExperienceDB,
  NewWorkExperience,
  UpdateWorkExperience,
} from "../schema/schema.types";

export type {
  WorkExperience,
  WorkExperienceDB,
  NewWorkExperience,
  UpdateWorkExperience,
};

export interface WorkExperienceFormData {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  technologies: string[];
  responsibilities: string[];
  employmentType:
    | "full-time"
    | "part-time"
    | "contract"
    | "freelance"
    | "internship";
  industry: string;
  companyUrl: string;
  logo: string;
  displayOrder: number;
  isVisible: boolean;
  isFeatured: boolean;
}

export interface WorkExperienceStatistics {
  total: number;
  totalVisible: number;
  totalFeatured: number;
  byEmploymentType: Array<{
    employmentType: string;
    count: number;
  }>;
  byIndustry: Array<{
    industry: string;
    count: number;
  }>;
  totalYearsExperience: number;
  currentPosition: WorkExperience | null;
}

export interface WorkExperienceFilters {
  employmentType?: string;
  industry?: string;
  isVisible?: boolean;
  isFeatured?: boolean;
  isCurrent?: boolean;
}
