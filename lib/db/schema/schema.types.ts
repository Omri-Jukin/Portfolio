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

export type UserRole = "admin" | "visitor";
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
