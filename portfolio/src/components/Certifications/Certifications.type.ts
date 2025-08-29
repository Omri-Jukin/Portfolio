export interface CertificationsProps {
  onCertificationClick?: (certificationId: string) => void;
}

// Re-export the main Certification type from database types
export type { Certification } from "../../lib/db/schema/schema.types";

export type CertificationCategory =
  | "technical"
  | "cloud"
  | "security"
  | "project-management"
  | "design"
  | "other";
