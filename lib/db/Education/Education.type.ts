import { DegreeType, Education, EducationStatus } from "../schema/schema.types";

export type {
  Education,
  EducationDB,
  NewEducation,
  UpdateEducation,
} from "../schema/schema.types";

// Additional types for education management
export interface EducationFilters {
  degreeType?: DegreeType;
  status?: EducationStatus;
  isVisible?: boolean;
  fieldOfStudy?: string;
}

export interface EducationStatistics {
  total: number;
  totalVisible: number;
  byDegreeType: Array<{
    degreeType: DegreeType;
    count: number;
  }>;
  byStatus: Array<{
    status: EducationStatus;
    count: number;
  }>;
  byFieldOfStudy: Array<{
    fieldOfStudy: string;
    count: number;
  }>;
  averageGpa?: number;
}

export interface EducationSearchResult {
  education: Education[];
  total: number;
}

export interface BulkEducationUpdateResult {
  updated: number;
  failed: number;
  errors: string[];
}

export interface BulkEducationDeleteResult {
  deleted: number;
  failed: number;
  errors: string[];
}

export interface EducationReorderItem {
  id: string;
  displayOrder: number;
}
