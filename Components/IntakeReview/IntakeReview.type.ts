import type {
  IntakeStatus,
  IntakeRiskLevel,
  IntakeNoteCategory,
} from "$/db/schema/schema.types";

export interface IntakeData {
  id: string;
  email: string;
  data: Record<string, unknown>;
  proposalMd: string;
  status: IntakeStatus;
  flagged: boolean;
  lastReviewedAt: string | null;
  reminderDate: string | null;
  estimatedValue: number | null;
  riskLevel: IntakeRiskLevel | null;
  createdAt: string;
  updatedAt: string;
  notes?: IntakeNote[];
  statusHistory?: StatusHistoryEntry[];
}

export interface IntakeNote {
  id: string;
  intakeId: string;
  note: string;
  category: IntakeNoteCategory;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
}

export interface StatusHistoryEntry {
  id: string;
  intakeId: string;
  oldStatus: IntakeStatus | null;
  newStatus: IntakeStatus;
  changedBy?: string | null;
  createdAt: string;
}

export interface IntakeListItem {
  id: string;
  email: string;
  name: string;
  status: IntakeStatus;
  flagged: boolean;
  urgency?: string;
  reminderDate: string | null;
  estimatedValue: number | null;
  riskLevel: IntakeRiskLevel | null;
  lastReviewedAt: string | null;
  createdAt: string;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  fullName?: string;
}

export interface OrganizationInfo {
  name: string;
  website?: string;
  industry?: string;
  size?: string;
}

export interface ProjectInfo {
  title: string;
  description: string;
  timeline?: string;
  budget?: string | Record<string, unknown>;
  startDate?: string;
  technologies?: string[];
  requirements?: string[];
  goals?: string[];
}

export interface AdditionalInfo {
  preferredContactMethod?: string;
  timezone?: string;
  urgency?: string;
  notes?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export interface IntakeFilters {
  status?: IntakeStatus[];
  flagged?: boolean;
  searchTerm?: string;
  startDate?: Date;
  endDate?: Date;
}

export type DesignVariant = "glassmorphism" | "admin";

export interface IntakeReviewProps {
  intakeId?: string;
  variant?: DesignVariant;
}
