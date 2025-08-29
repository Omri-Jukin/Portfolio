import type {
  Project,
  ProjectDB,
  NewProject,
  UpdateProject,
} from "../schema/schema.types";

export type { Project, ProjectDB, NewProject, UpdateProject };

export interface TechnicalChallenge {
  challenge: string;
  solution: string;
}

export interface CodeExample {
  title: string;
  language: string;
  code: string;
  explanation: string;
}

export interface ProjectFormData {
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  technologies: string[];
  categories: string[];
  status: "completed" | "in-progress" | "archived" | "concept";
  projectType: "professional" | "personal" | "open-source" | "academic";
  startDate: string;
  endDate: string;
  githubUrl: string;
  liveUrl: string;
  demoUrl: string;
  documentationUrl: string;
  images: string[];
  keyFeatures: string[];
  technicalChallenges: TechnicalChallenge[];
  codeExamples: CodeExample[];
  teamSize: number;
  myRole: string;
  clientName: string;
  budget: string;
  displayOrder: number;
  isVisible: boolean;
  isFeatured: boolean;
  isOpenSource: boolean;
}

export interface ProjectStatistics {
  total: number;
  totalVisible: number;
  totalFeatured: number;
  totalOpenSource: number;
  byStatus: Array<{
    status: string;
    count: number;
  }>;
  byType: Array<{
    projectType: string;
    count: number;
  }>;
  byCategory: Array<{
    category: string;
    count: number;
  }>;
  topTechnologies: Array<{
    technology: string;
    count: number;
  }>;
}

export interface ProjectFilters {
  status?: string;
  projectType?: string;
  category?: string;
  technology?: string;
  isVisible?: boolean;
  isFeatured?: boolean;
  isOpenSource?: boolean;
}
