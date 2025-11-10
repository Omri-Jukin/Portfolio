import * as Tables from "./schema.tables";

export type Post = typeof Tables.blogPosts.$inferSelect;
export type User = typeof Tables.users.$inferSelect;
export type Inquiry = typeof Tables.contactInquiries.$inferSelect;

// Database certification type (what comes from DB)
export type CertificationDB = typeof Tables.certifications.$inferSelect;

// API certification type (what comes through tRPC - dates are strings)
export type Certification = Omit<
  CertificationDB,
  "issueDate" | "expiryDate" | "createdAt" | "updatedAt"
> & {
  issueDate: string;
  expiryDate: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type NewCertification = typeof Tables.certifications.$inferInsert;
export type UpdateCertification = Partial<
  Omit<typeof Tables.certifications.$inferSelect, "id" | "createdAt">
>;

// Work Experience types
export type WorkExperienceDB = typeof Tables.workExperiences.$inferSelect;
export type WorkExperience = Omit<
  WorkExperienceDB,
  "startDate" | "endDate" | "createdAt" | "updatedAt"
> & {
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string | null;
};
export type NewWorkExperience = typeof Tables.workExperiences.$inferInsert;
export type UpdateWorkExperience = Partial<
  Omit<typeof Tables.workExperiences.$inferSelect, "id" | "createdAt">
>;

// Project types
export type ProjectDB = typeof Tables.projects.$inferSelect;
export type Project = Omit<
  ProjectDB,
  "startDate" | "endDate" | "createdAt" | "updatedAt"
> & {
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string | null;
};
export type NewProject = typeof Tables.projects.$inferInsert;
export type UpdateProject = Partial<
  Omit<typeof Tables.projects.$inferSelect, "id" | "createdAt">
>;

// Skill types
export type SkillDB = typeof Tables.skills.$inferSelect;
export type Skill = Omit<SkillDB, "lastUsed" | "createdAt" | "updatedAt"> & {
  lastUsed: string;
  createdAt: string;
  updatedAt: string | null;
};
export type NewSkill = typeof Tables.skills.$inferInsert;
export type UpdateSkill = Partial<
  Omit<typeof Tables.skills.$inferSelect, "id" | "createdAt">
>;

// Education types
export type EducationDB = typeof Tables.education.$inferSelect;
export type Education = Omit<
  EducationDB,
  "startDate" | "endDate" | "createdAt" | "updatedAt"
> & {
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string | null;
};
export type NewEducation = Omit<
  typeof Tables.education.$inferInsert,
  "id" | "createdAt"
>;
export type UpdateEducation = Partial<
  Omit<typeof Tables.education.$inferSelect, "id" | "createdAt">
>;

// Education filters
export interface EducationFilters {
  degreeType?: string;
  status?: string;
  isVisible?: boolean;
  isFeatured?: boolean;
}

// Service types
export type ServiceDB = typeof Tables.services.$inferSelect;
export type Service = Omit<ServiceDB, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string | null;
};
export type NewService = typeof Tables.services.$inferInsert;
export type UpdateService = Partial<
  Omit<typeof Tables.services.$inferSelect, "id" | "createdAt">
>;

// Testimonial types
export type TestimonialDB = typeof Tables.testimonials.$inferSelect;
export type Testimonial = Omit<
  TestimonialDB,
  "createdAt" | "updatedAt" | "verificationDate"
> & {
  createdAt: string;
  updatedAt: string | null;
  verificationDate: string | null;
};
export type NewTestimonial = typeof Tables.testimonials.$inferInsert;
export type UpdateTestimonial = Partial<
  Omit<typeof Tables.testimonials.$inferSelect, "id" | "createdAt">
>;

// UserRole type - roles are stored in the database roles table
// This type provides TypeScript safety, but actual roles are validated against the database
export type UserRole = "admin" | "editor" | "user" | "visitor";
export type UserStatus = "pending" | "approved" | "rejected";
export type PostStatus =
  | "draft"
  | "published"
  | "archived"
  | "scheduled"
  | "deleted";
export type InquiryStatus = "open" | "pending" | "closed" | "deleted";
export type CertificationCategory =
  | "technical"
  | "programming"
  | "cloud"
  | "security"
  | "project-management"
  | "cybersecurity"
  | "design"
  | "other";
export type CertificationStatus =
  | "active"
  | "completed"
  | "in-progress"
  | "planned"
  | "expired"
  | "revoked";
export type EmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "freelance"
  | "internship";
export type ProjectStatus =
  | "completed"
  | "in-progress"
  | "archived"
  | "concept"
  | "deleted"
  | "cancelled";
export type ProjectType =
  | "professional"
  | "personal"
  | "open-source"
  | "academic";
export type SkillCategory =
  | "technical"
  | "soft"
  | "language"
  | "tool"
  | "framework"
  | "database"
  | "cloud"
  | "cybersecurity";
export type ProficiencyLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";
export type DegreeType =
  | "bachelor"
  | "master"
  | "phd"
  | "diploma"
  | "certificate"
  | "bootcamp";
export type EducationStatus =
  | "completed"
  | "in-progress"
  | "transferred"
  | "dropped"
  | "deleted";
export type ServiceCategory =
  | "development"
  | "consulting"
  | "design"
  | "training"
  | "maintenance"
  | "deleted"
  | "cancelled";
export type ServiceType =
  | "hourly"
  | "project"
  | "retainer"
  | "subscription"
  | "deleted"
  | "cancelled";
export type PricingType =
  | "fixed"
  | "hourly"
  | "range"
  | "monthly"
  | "deleted"
  | "cancelled";
export type PersonalInfoSection =
  | "bio"
  | "contact"
  | "social"
  | "preferences"
  | "deleted"
  | "cancelled";
export type DataType =
  | "text"
  | "email"
  | "url"
  | "phone"
  | "json"
  | "deleted"
  | "cancelled";

// Intake types
export type IntakeStatus =
  | "new"
  | "reviewing"
  | "contacted"
  | "proposal_sent"
  | "accepted"
  | "declined";

export type IntakeRiskLevel = "low" | "medium" | "high";

export type IntakeNoteCategory =
  | "follow-up"
  | "waiting-on-client"
  | "budget-concerns"
  | "technical-notes"
  | "general";

export type DiscountType = "percent" | "fixed";

// Proposal types
export type ProposalStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "declined"
  | "expired"
  | "revised";

export type ProposalPriceDisplay = "taxExclusive" | "taxInclusive";

export type ProposalDiscountScope = "overall" | "section" | "line";

export type ProposalTaxKind = "vat" | "surcharge" | "withholding";

export type ProposalTaxScope = "overall" | "section" | "line";

export type ProposalEventType =
  | "created"
  | "sent"
  | "viewed"
  | "accepted"
  | "declined"
  | "expired"
  | "revised";

// Database proposal types (what comes from DB)
export type ProposalDB = typeof Tables.proposals.$inferSelect;
export type ProposalSectionDB = typeof Tables.proposalSections.$inferSelect;
export type ProposalLineItemDB = typeof Tables.proposalLineItems.$inferSelect;
export type ProposalDiscountDB = typeof Tables.proposalDiscounts.$inferSelect;
export type ProposalTaxDB = typeof Tables.proposalTaxes.$inferSelect;
export type ProposalTemplateDB = typeof Tables.proposalTemplates.$inferSelect;
export type ProposalEventDB = typeof Tables.proposalEvents.$inferSelect;

// API proposal types (what comes through tRPC - dates are strings)
export type Proposal = Omit<
  ProposalDB,
  "createdAt" | "updatedAt" | "validUntil"
> & {
  createdAt: string;
  updatedAt: string;
  validUntil: string | null;
};

export type ProposalSection = ProposalSectionDB;

export type ProposalLineItem = ProposalLineItemDB;

export type ProposalDiscount = ProposalDiscountDB;

export type ProposalTax = ProposalTaxDB;

export type ProposalTemplate = Omit<
  ProposalTemplateDB,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export type ProposalEvent = Omit<ProposalEventDB, "occurredAt"> & {
  occurredAt: string;
};

// Insert types
export type NewProposal = typeof Tables.proposals.$inferInsert;
export type NewProposalSection = typeof Tables.proposalSections.$inferInsert;
export type NewProposalLineItem = typeof Tables.proposalLineItems.$inferInsert;
export type NewProposalDiscount = typeof Tables.proposalDiscounts.$inferInsert;
export type NewProposalTax = typeof Tables.proposalTaxes.$inferInsert;
export type NewProposalTemplate = typeof Tables.proposalTemplates.$inferInsert;
export type NewProposalEvent = typeof Tables.proposalEvents.$inferInsert;

// Update types
export type UpdateProposal = Partial<
  Omit<ProposalDB, "id" | "createdAt" | "createdBy">
>;
export type UpdateProposalSection = Partial<
  Omit<ProposalSectionDB, "id" | "proposalId">
>;
export type UpdateProposalLineItem = Partial<
  Omit<ProposalLineItemDB, "id" | "proposalId">
>;
export type UpdateProposalDiscount = Partial<
  Omit<ProposalDiscountDB, "id" | "proposalId">
>;
export type UpdateProposalTax = Partial<
  Omit<ProposalTaxDB, "id" | "proposalId">
>;
export type UpdateProposalTemplate = Partial<
  Omit<ProposalTemplateDB, "id" | "createdAt">
>;

// ============================================
// Logging Types
// ============================================

export type ApplicationLogLevel = "error" | "warn" | "info" | "debug";
export type ApplicationLogCategory =
  | "email"
  | "database"
  | "api"
  | "validation"
  | "performance"
  | "system"
  | "integration"
  | "background_job"
  | "proposal"
  | "pricing"
  | "pdf"
  | "general";
export type AuditLogAction =
  | "create"
  | "update"
  | "delete"
  | "read"
  | "login"
  | "logout"
  | "access_denied"
  | "unauthorized_access";
export type AuditLogResource =
  | "project"
  | "skill"
  | "certification"
  | "education"
  | "work_experience"
  | "blog"
  | "email_template"
  | "intake"
  | "contact"
  | "user"
  | "pricing"
  | "discount"
  | "admin_dashboard"
  | "system"
  | "proposal";

// Database logging types (what comes from DB)
export type ApplicationLogDB = typeof Tables.applicationLogs.$inferSelect;
export type AuditLogDB = typeof Tables.auditLogs.$inferSelect;

// API logging types (what comes through tRPC - dates are strings)
export type ApplicationLog = Omit<ApplicationLogDB, "createdAt"> & {
  createdAt: string;
};

export type AuditLog = Omit<AuditLogDB, "createdAt"> & {
  createdAt: string;
};

// Insert types
export type NewApplicationLog = typeof Tables.applicationLogs.$inferInsert;
export type NewAuditLog = typeof Tables.auditLogs.$inferInsert;

// Update types (not typically used for logs, but available if needed)
export type UpdateApplicationLog = Partial<
  Omit<ApplicationLogDB, "id" | "createdAt">
>;
export type UpdateAuditLog = Partial<Omit<AuditLogDB, "id" | "createdAt">>;
