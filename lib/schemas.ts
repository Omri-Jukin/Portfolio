/**
 * Centralized Zod validation schemas for the entire Portfolio application
 * Single source of truth for all validation rules and schemas
 */

import { z } from "zod";
import {
  FORM_VALIDATION,
  USER_ROLES,
  USER_STATUSES,
  POST_STATUSES,
  INQUIRY_STATUSES,
  CERTIFICATION_CATEGORIES,
  CERTIFICATION_STATUSES,
  EMPLOYMENT_TYPES,
  PROJECT_STATUSES,
  PROJECT_TYPES,
  SKILL_CATEGORIES,
  PROFICIENCY_LEVELS,
  FILE_UPLOAD,
  DB_LIMITS,
  INTAKE_FORM_CURRENCY_MAPPING,
  IntakeFormCurrencyCode,
} from "./constants";

// ========================
// PRIMITIVE SCHEMAS
// ========================

export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(1, "Email is required")
  .max(254, "Email too long"); // RFC 5321 limit

export const nameSchema = z
  .string()
  .min(
    FORM_VALIDATION.NAME_MIN_LENGTH,
    `Name must be at least ${FORM_VALIDATION.NAME_MIN_LENGTH} characters`
  )
  .max(
    FORM_VALIDATION.NAME_MAX_LENGTH,
    `Name must be less than ${FORM_VALIDATION.NAME_MAX_LENGTH} characters`
  )
  .regex(
    /^[a-zA-Z\s\-']+$/,
    "Name can only contain letters, spaces, hyphens, and apostrophes"
  );

export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(FORM_VALIDATION.PHONE_REGEX, "Please enter a valid phone number");

export const urlSchema = z
  .string()
  .url("Please enter a valid URL")
  .optional()
  .or(z.literal(""));

export const passwordSchema = z
  .string()
  .min(
    FORM_VALIDATION.PASSWORD_MIN_LENGTH,
    `Password must be at least ${FORM_VALIDATION.PASSWORD_MIN_LENGTH} characters`
  )
  .max(128, "Password too long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one lowercase letter, one uppercase letter, and one number"
  );

export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(200, "Slug too long")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain only lowercase letters, numbers, and hyphens"
  );

export const colorSchema = z
  .string()
  .regex(
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    "Color must be a valid hex color code"
  )
  .optional();

export const dateStringSchema = z
  .string()
  .datetime("Invalid date format")
  .or(z.date().transform((date) => date.toISOString()));

export const positiveIntegerSchema = z
  .number()
  .int("Must be an integer")
  .min(0, "Must be positive");

export const displayOrderSchema = z
  .number()
  .int("Display order must be an integer")
  .min(0, "Display order must be positive")
  .default(0);

export const visibilitySchema = z.boolean().default(true);

export const featuredSchema = z.boolean().default(false);

// ========================
// ENUM SCHEMAS
// ========================

export const userRoleSchema = z.enum([
  USER_ROLES.ADMIN,
  USER_ROLES.VISITOR,
] as const);

export const userStatusSchema = z.enum([
  USER_STATUSES.PENDING,
  USER_STATUSES.APPROVED,
  USER_STATUSES.REJECTED,
] as const);

export const postStatusSchema = z.enum([
  POST_STATUSES.DRAFT,
  POST_STATUSES.PUBLISHED,
] as const);

export const inquiryStatusSchema = z.enum([
  INQUIRY_STATUSES.OPEN,
  INQUIRY_STATUSES.CLOSED,
] as const);

export const certificationCategorySchema = z.enum([
  CERTIFICATION_CATEGORIES.TECHNICAL,
  CERTIFICATION_CATEGORIES.CLOUD,
  CERTIFICATION_CATEGORIES.SECURITY,
  CERTIFICATION_CATEGORIES.PROJECT_MANAGEMENT,
  CERTIFICATION_CATEGORIES.DESIGN,
  CERTIFICATION_CATEGORIES.OTHER,
] as const);

export const certificationStatusSchema = z.enum([
  CERTIFICATION_STATUSES.ACTIVE,
  CERTIFICATION_STATUSES.EXPIRED,
  CERTIFICATION_STATUSES.REVOKED,
] as const);

export const employmentTypeSchema = z.enum([
  EMPLOYMENT_TYPES.FULL_TIME,
  EMPLOYMENT_TYPES.PART_TIME,
  EMPLOYMENT_TYPES.CONTRACT,
  EMPLOYMENT_TYPES.FREELANCE,
  EMPLOYMENT_TYPES.INTERNSHIP,
] as const);

export const projectStatusSchema = z.enum([
  PROJECT_STATUSES.COMPLETED,
  PROJECT_STATUSES.IN_PROGRESS,
  PROJECT_STATUSES.ARCHIVED,
  PROJECT_STATUSES.CONCEPT,
] as const);

export const projectTypeSchema = z.enum([
  PROJECT_TYPES.PROFESSIONAL,
  PROJECT_TYPES.PERSONAL,
  PROJECT_TYPES.OPEN_SOURCE,
  PROJECT_TYPES.ACADEMIC,
] as const);

export const skillCategorySchema = z.enum([
  SKILL_CATEGORIES.TECHNICAL,
  SKILL_CATEGORIES.SOFT,
  SKILL_CATEGORIES.LANGUAGE,
  SKILL_CATEGORIES.TOOL,
  SKILL_CATEGORIES.FRAMEWORK,
  SKILL_CATEGORIES.DATABASE,
  SKILL_CATEGORIES.CLOUD,
] as const);

export const proficiencyLevelSchema = z.enum([
  PROFICIENCY_LEVELS.BEGINNER,
  PROFICIENCY_LEVELS.INTERMEDIATE,
  PROFICIENCY_LEVELS.ADVANCED,
  PROFICIENCY_LEVELS.EXPERT,
] as const);

// ========================
// TRANSLATION SCHEMAS
// ========================

export const translationsSchema = z.record(z.string(), z.string()).optional();

// ========================
// FILE UPLOAD SCHEMAS
// ========================

export const imageFileSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileType: z
    .string()
    .refine(
      (type): type is (typeof FILE_UPLOAD.ALLOWED_IMAGE_TYPES)[number] =>
        (FILE_UPLOAD.ALLOWED_IMAGE_TYPES as readonly string[]).includes(type),
      "Invalid file type. Only images are allowed."
    ),
  fileSize: z
    .number()
    .max(FILE_UPLOAD.MAX_SIZE, "File too large. Maximum size is 5MB."),
});

export const documentFileSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileType: z
    .string()
    .refine(
      (type): type is (typeof FILE_UPLOAD.ALLOWED_DOCUMENT_TYPES)[number] =>
        (FILE_UPLOAD.ALLOWED_DOCUMENT_TYPES as readonly string[]).includes(
          type
        ),
      "Invalid file type. Only documents are allowed."
    ),
  fileSize: z
    .number()
    .max(FILE_UPLOAD.MAX_SIZE, "File too large. Maximum size is 5MB."),
});

// ========================
// FORM SCHEMAS
// ========================

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  subject: z
    .string()
    .min(
      FORM_VALIDATION.SUBJECT_MIN_LENGTH,
      `Subject must be at least ${FORM_VALIDATION.SUBJECT_MIN_LENGTH} characters`
    )
    .max(
      FORM_VALIDATION.SUBJECT_MAX_LENGTH,
      `Subject must be less than ${FORM_VALIDATION.SUBJECT_MAX_LENGTH} characters`
    ),
  message: z
    .string()
    .min(
      FORM_VALIDATION.MESSAGE_MIN_LENGTH,
      `Message must be at least ${FORM_VALIDATION.MESSAGE_MIN_LENGTH} characters`
    )
    .max(
      FORM_VALIDATION.MESSAGE_MAX_LENGTH,
      `Message must be less than ${FORM_VALIDATION.MESSAGE_MAX_LENGTH} characters`
    ),
});

// Intake form schema for project intake after Calendly meeting
export const intakeFormSchema = z.object({
  contact: z.object({
    firstName: z.string().min(1, "First name is required").max(100),
    lastName: z.string().min(1, "Last name is required").max(100),
    email: emailSchema,
    phone: phoneSchema.optional(),
    fullName: z.string().optional(),
  }),
  org: z
    .object({
      name: z.string().min(1, "Organization name is required").max(200),
      website: urlSchema.optional(),
      industry: z.string().optional(),
      size: z.string().optional(),
    })
    .optional(),
  project: z.object({
    title: z.string().min(1, "Project title is required").max(200),
    description: z
      .string()
      .min(10, "Project description must be at least 10 characters")
      .max(5000),
    requirements: z.array(z.string()).optional(),
    timeline: z.string().optional(),
    budget: z
      .object({
        currency: z
          .enum(
            Object.keys(INTAKE_FORM_CURRENCY_MAPPING) as [
              IntakeFormCurrencyCode,
              ...IntakeFormCurrencyCode[]
            ]
          )
          .optional(),
        min: z.string().optional(),
        max: z.string().optional(),
      })
      .optional(),
    startDate: z.string().optional(),
    technologies: z.array(z.string()).optional(),
    goals: z.array(z.string()).optional(),
    resourceLinks: z
      .array(
        z.object({
          label: z.string().min(1, "Label is required"),
          url: z.string().url("Must be a valid URL"),
        })
      )
      .optional(),
  }),
  additional: z
    .object({
      preferredContactMethod: z.string().optional(),
      timezone: z.string().optional(),
      urgency: z.string().optional(),
      notes: z.string().max(2000).optional(),
    })
    .optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name too long"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name too long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// ========================
// ENTITY SCHEMAS
// ========================

export const userCreateSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name too long"),
  role: userRoleSchema.default(USER_ROLES.VISITOR),
  status: userStatusSchema.default(USER_STATUSES.PENDING),
});

export const userUpdateSchema = userCreateSchema
  .omit({ password: true })
  .partial()
  .extend({
    id: z.string().uuid(),
  });

export const blogPostCreateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(DB_LIMITS.TITLE_MAX_LENGTH, "Title too long"),
  slug: slugSchema,
  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .max(500, "Excerpt too long"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(50000, "Content too long"),
  status: postStatusSchema.default(POST_STATUSES.DRAFT),
  tags: z.array(z.string().min(1).max(50)).max(10, "Too many tags").default([]),
  featuredImage: urlSchema,
});

export const blogPostUpdateSchema = blogPostCreateSchema.partial().extend({
  id: z.string().uuid(),
});

export const contactInquiryCreateSchema = contactFormSchema.extend({
  status: inquiryStatusSchema.default(INQUIRY_STATUSES.OPEN),
  ipAddress: z.string().optional(),
  userAgent: z.string().max(500).optional(),
});

export const contactInquiryUpdateSchema = z.object({
  id: z.string().uuid(),
  status: inquiryStatusSchema,
  respondedAt: dateStringSchema.optional(),
});

export const workExperienceCreateSchema = z.object({
  role: z
    .string()
    .min(1, "Role is required")
    .max(DB_LIMITS.ROLE_MAX_LENGTH, "Role too long"),
  company: z
    .string()
    .min(1, "Company is required")
    .max(DB_LIMITS.COMPANY_MAX_LENGTH, "Company too long"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(DB_LIMITS.LOCATION_MAX_LENGTH, "Location too long"),
  startDate: z.date(),
  endDate: z.date().optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(DB_LIMITS.DESCRIPTION_MAX_LENGTH * 2, "Description too long"), // Allow longer for work experience
  achievements: z
    .array(z.string().min(1).max(DB_LIMITS.ACHIEVEMENT_MAX_LENGTH))
    .min(1, "At least one achievement is required"),
  technologies: z
    .array(z.string().min(1).max(DB_LIMITS.TECHNOLOGY_MAX_LENGTH))
    .min(1, "At least one technology is required"),
  responsibilities: z
    .array(z.string().min(1).max(DB_LIMITS.RESPONSIBILITY_MAX_LENGTH))
    .min(1, "At least one responsibility is required"),
  employmentType: employmentTypeSchema,
  industry: z
    .string()
    .min(1, "Industry is required")
    .max(DB_LIMITS.INDUSTRY_MAX_LENGTH, "Industry too long"),
  companyUrl: urlSchema,
  logo: z.string().max(DB_LIMITS.URL_MAX_LENGTH).optional(),
  displayOrder: displayOrderSchema,
  isVisible: visibilitySchema,
  isFeatured: featuredSchema,
  roleTranslations: translationsSchema,
  companyTranslations: translationsSchema,
  descriptionTranslations: translationsSchema,
});

export const workExperienceUpdateSchema = workExperienceCreateSchema
  .partial()
  .extend({
    id: z.string().uuid(),
  });

export const technicalChallengeSchema = z.object({
  challenge: z
    .string()
    .min(1, "Challenge is required")
    .max(DB_LIMITS.CHALLENGE_MAX_LENGTH, "Challenge too long"),
  solution: z
    .string()
    .min(1, "Solution is required")
    .max(DB_LIMITS.SOLUTION_MAX_LENGTH, "Solution too long"),
});

export const codeExampleSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(DB_LIMITS.TITLE_MAX_LENGTH, "Title too long"),
  language: z
    .string()
    .min(1, "Language is required")
    .max(DB_LIMITS.TECHNOLOGY_MAX_LENGTH, "Language too long"),
  code: z
    .string()
    .min(1, "Code is required")
    .max(DB_LIMITS.CODE_MAX_LENGTH, "Code too long"),
  explanation: z
    .string()
    .min(1, "Explanation is required")
    .max(DB_LIMITS.EXPLANATION_MAX_LENGTH, "Explanation too long"),
});

export const projectCreateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(DB_LIMITS.TITLE_MAX_LENGTH, "Title too long"),
  subtitle: z
    .string()
    .min(1, "Subtitle is required")
    .max(DB_LIMITS.SUBTITLE_MAX_LENGTH, "Subtitle too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(DB_LIMITS.DESCRIPTION_MAX_LENGTH, "Description too long"),
  longDescription: z
    .string()
    .max(DB_LIMITS.LONG_DESCRIPTION_MAX_LENGTH, "Long description too long")
    .optional(),
  technologies: z
    .array(z.string().min(1).max(DB_LIMITS.TECHNOLOGY_MAX_LENGTH))
    .min(1, "At least one technology is required"),
  categories: z
    .array(z.string().min(1).max(DB_LIMITS.CATEGORY_MAX_LENGTH))
    .min(1, "At least one category is required"),
  status: projectStatusSchema.default(PROJECT_STATUSES.COMPLETED),
  projectType: projectTypeSchema,
  startDate: z.date(),
  endDate: z.date().optional(),
  githubUrl: urlSchema,
  liveUrl: urlSchema,
  demoUrl: urlSchema,
  documentationUrl: urlSchema,
  images: z.array(z.string().url()).default([]),
  keyFeatures: z
    .array(z.string().min(1).max(DB_LIMITS.FEATURE_MAX_LENGTH))
    .min(1, "At least one key feature is required"),
  technicalChallenges: z.array(technicalChallengeSchema).default([]),
  codeExamples: z.array(codeExampleSchema).default([]),
  teamSize: z.number().int().min(1).optional(),
  myRole: z.string().max(DB_LIMITS.ROLE_MAX_LENGTH).optional(),
  clientName: z.string().max(DB_LIMITS.CLIENT_MAX_LENGTH).optional(),
  budget: z.string().max(DB_LIMITS.BUDGET_MAX_LENGTH).optional(),
  displayOrder: displayOrderSchema,
  isVisible: visibilitySchema,
  isFeatured: featuredSchema,
  titleTranslations: translationsSchema,
  descriptionTranslations: translationsSchema,
});

export const projectUpdateSchema = projectCreateSchema.partial().extend({
  id: z.string().uuid(),
});

export const skillCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(DB_LIMITS.SKILL_MAX_LENGTH, "Name too long"),
  category: skillCategorySchema,
  proficiency: proficiencyLevelSchema,
  yearsOfExperience: z
    .number()
    .int("Years of experience must be an integer")
    .min(0, "Years of experience must be positive")
    .max(50, "Years of experience too high"),
  lastUsed: z.date(),
  description: z
    .string()
    .max(DB_LIMITS.DESCRIPTION_MAX_LENGTH, "Description too long")
    .optional(),
  icon: z.string().max(10).optional(),
  color: colorSchema,
  displayOrder: displayOrderSchema,
  isVisible: visibilitySchema,
  isFeatured: featuredSchema,
});

export const skillUpdateSchema = skillCreateSchema.partial().extend({
  id: z.string().uuid(),
});

export const certificationCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(DB_LIMITS.TITLE_MAX_LENGTH, "Name too long"),
  issuer: z
    .string()
    .min(1, "Issuer is required")
    .max(DB_LIMITS.NAME_MAX_LENGTH, "Issuer too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(DB_LIMITS.DESCRIPTION_MAX_LENGTH, "Description too long"),
  category: certificationCategorySchema,
  status: certificationStatusSchema.default(CERTIFICATION_STATUSES.ACTIVE),
  skills: z
    .array(z.string().min(1).max(DB_LIMITS.SKILL_MAX_LENGTH))
    .min(1, "At least one skill is required"),
  issueDate: z.date(),
  expiryDate: z.date().optional(),
  credentialId: z.string().max(100).optional(),
  verificationUrl: urlSchema,
  icon: z.string().max(10).optional(),
  color: colorSchema,
  displayOrder: displayOrderSchema,
  isVisible: visibilitySchema,
  isFeatured: featuredSchema,
});

export const certificationUpdateSchema = certificationCreateSchema
  .partial()
  .extend({
    id: z.string().uuid(),
  });

export const educationCreateSchema = z.object({
  degree: z
    .string()
    .min(1, "Degree is required")
    .max(DB_LIMITS.TITLE_MAX_LENGTH, "Degree too long"),
  field: z
    .string()
    .min(1, "Field is required")
    .max(DB_LIMITS.TITLE_MAX_LENGTH, "Field too long"),
  institution: z
    .string()
    .min(1, "Institution is required")
    .max(DB_LIMITS.COMPANY_MAX_LENGTH, "Institution too long"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(DB_LIMITS.LOCATION_MAX_LENGTH, "Location too long"),
  startDate: z.date(),
  endDate: z.date().optional(),
  gpa: z
    .number()
    .min(0, "GPA must be positive")
    .max(4.0, "GPA too high")
    .optional(),
  achievements: z
    .array(z.string().min(1).max(DB_LIMITS.ACHIEVEMENT_MAX_LENGTH))
    .default([]),
  courses: z.array(z.string().min(1).max(100)).default([]),
  thesis: z.string().max(DB_LIMITS.TITLE_MAX_LENGTH).optional(),
  logo: z.string().max(DB_LIMITS.URL_MAX_LENGTH).optional(),
  displayOrder: displayOrderSchema,
  isVisible: visibilitySchema,
  isFeatured: featuredSchema,
});

export const educationUpdateSchema = educationCreateSchema.partial().extend({
  id: z.string().uuid(),
});

// Education filters schema
export const educationFiltersSchema = z.object({
  degreeType: z.string().optional(),
  status: z.string().optional(),
  isVisible: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

// Bulk update order schema for education
export const educationBulkUpdateOrderSchema = z.object({
  updates: z.array(
    z.object({
      id: z.string().uuid(),
      displayOrder: z.number().int().min(0),
    })
  ),
});

export const serviceCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(DB_LIMITS.TITLE_MAX_LENGTH, "Name too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(DB_LIMITS.DESCRIPTION_MAX_LENGTH, "Description too long"),
  shortDescription: z
    .string()
    .min(1, "Short description is required")
    .max(500, "Short description too long"),
  icon: z.string().min(1, "Icon is required").max(50, "Icon too long"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(DB_LIMITS.CATEGORY_MAX_LENGTH, "Category too long"),
  features: z
    .array(z.string().min(1).max(DB_LIMITS.FEATURE_MAX_LENGTH))
    .min(1, "At least one feature is required"),
  pricing: z.string().max(100).optional(),
  duration: z.string().max(100).optional(),
  deliverables: z
    .array(z.string().min(1).max(200))
    .min(1, "At least one deliverable is required"),
  technologies: z
    .array(z.string().min(1).max(DB_LIMITS.TECHNOLOGY_MAX_LENGTH))
    .default([]),
  displayOrder: displayOrderSchema,
  isVisible: visibilitySchema,
  isFeatured: featuredSchema,
  nameTranslations: translationsSchema,
  descriptionTranslations: translationsSchema,
});

export const serviceUpdateSchema = serviceCreateSchema.partial().extend({
  id: z.string().uuid(),
});

// ========================
// TESTIMONIAL SCHEMAS
// ========================

export const testimonialCreateSchema = z.object({
  quote: z
    .string()
    .min(10, "Quote must be at least 10 characters")
    .max(1000, "Quote must be less than 1000 characters"),
  author: nameSchema,
  role: z
    .string()
    .min(2, "Role must be at least 2 characters")
    .max(100, "Role must be less than 100 characters"),
  company: z
    .string()
    .min(2, "Company must be at least 2 characters")
    .max(100, "Company must be less than 100 characters"),
  authorImage: urlSchema.optional(),
  authorLinkedIn: urlSchema.optional(),
  companyUrl: urlSchema.optional(),
  companyLogo: urlSchema.optional(),
  rating: z.number().int().min(1).max(5).optional(),
  isVerified: z.boolean().default(false),
  verificationDate: dateStringSchema.optional(),
  displayOrder: displayOrderSchema,
  isVisible: visibilitySchema,
  isFeatured: featuredSchema,
  quoteTranslations: translationsSchema.optional(),
  authorTranslations: translationsSchema.optional(),
  roleTranslations: translationsSchema.optional(),
  companyTranslations: translationsSchema.optional(),
});

export const testimonialUpdateSchema = testimonialCreateSchema
  .partial()
  .extend({
    id: z.string().uuid(),
  });

// ========================
// PAGINATION SCHEMAS
// ========================

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().optional(),
});

// ========================
// QUERY SCHEMAS
// ========================

export const idParamSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});

export const slugParamSchema = z.object({
  slug: slugSchema,
});

export const searchQuerySchema = z.object({
  q: z
    .string()
    .min(1, "Search query is required")
    .max(100, "Search query too long"),
  category: z.string().optional(),
  type: z.string().optional(),
});

// ========================
// BULK OPERATION SCHEMAS
// ========================

export const bulkDeleteSchema = z.object({
  ids: z.array(z.string().uuid()).min(1, "At least one ID is required"),
});

export const bulkUpdateVisibilitySchema = z.object({
  ids: z.array(z.string().uuid()).min(1, "At least one ID is required"),
  isVisible: z.boolean(),
});

export const bulkUpdateOrderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        displayOrder: z.number().int().min(0),
      })
    )
    .min(1, "At least one item is required"),
});

// ========================
// ADMIN SCHEMAS
// ========================

export const adminActionSchema = z.object({
  action: z.enum(["approve", "reject", "delete", "archive", "restore"]),
  reason: z.string().max(500).optional(),
});

export const adminStatsQuerySchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  groupBy: z.enum(["day", "week", "month", "year"]).default("day"),
});

// ========================
// EXPORT SCHEMA TYPES
// ========================

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type IntakeFormData = z.infer<typeof intakeFormSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type UserCreateData = z.infer<typeof userCreateSchema>;
export type UserUpdateData = z.infer<typeof userUpdateSchema>;
export type BlogPostCreateData = z.infer<typeof blogPostCreateSchema>;
export type BlogPostUpdateData = z.infer<typeof blogPostUpdateSchema>;
export type ContactInquiryCreateData = z.infer<
  typeof contactInquiryCreateSchema
>;
export type ContactInquiryUpdateData = z.infer<
  typeof contactInquiryUpdateSchema
>;
export type WorkExperienceCreateData = z.infer<
  typeof workExperienceCreateSchema
>;
export type WorkExperienceUpdateData = z.infer<
  typeof workExperienceUpdateSchema
>;
export type ProjectCreateData = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateData = z.infer<typeof projectUpdateSchema>;
export type SkillCreateData = z.infer<typeof skillCreateSchema>;
export type SkillUpdateData = z.infer<typeof skillUpdateSchema>;
export type CertificationCreateData = z.infer<typeof certificationCreateSchema>;
export type CertificationUpdateData = z.infer<typeof certificationUpdateSchema>;
export type EducationCreateData = z.infer<typeof educationCreateSchema>;
export type EducationUpdateData = z.infer<typeof educationUpdateSchema>;
export type ServiceCreateData = z.infer<typeof serviceCreateSchema>;
export type ServiceUpdateData = z.infer<typeof serviceUpdateSchema>;
export type TestimonialCreateData = z.infer<typeof testimonialCreateSchema>;
export type TestimonialUpdateData = z.infer<typeof testimonialUpdateSchema>;
export type PaginationData = z.infer<typeof paginationSchema>;
export type SearchQueryData = z.infer<typeof searchQuerySchema>;
export type BulkDeleteData = z.infer<typeof bulkDeleteSchema>;
export type BulkUpdateVisibilityData = z.infer<
  typeof bulkUpdateVisibilitySchema
>;
export type BulkUpdateOrderData = z.infer<typeof bulkUpdateOrderSchema>;
export type AdminActionData = z.infer<typeof adminActionSchema>;
export type AdminStatsQueryData = z.infer<typeof adminStatsQuerySchema>;
