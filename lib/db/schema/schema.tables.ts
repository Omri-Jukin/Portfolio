import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import {
  UserRole,
  UserStatus,
  PostStatus,
  InquiryStatus,
  CertificationCategory,
  CertificationStatus,
  EmploymentType,
  ProjectStatus,
  ProjectType,
  SkillCategory,
  ProficiencyLevel,
  DegreeType,
  EducationStatus,
  ServiceCategory,
  ServiceType,
  PricingType,
} from "./schema.types";
import {
  ProjectArchitecture,
  ProjectProblem,
  ProjectSolution,
} from "#/lib/types";

// Users table - minimal for portfolio admin
export const users = sqliteTable("users", {
  id: text("id").primaryKey().notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").$type<UserRole>().notNull().default("visitor"),
  status: text("status").$type<UserStatus>().notNull().default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// Define indexes separately
export const usersEmailIdx = index("email_idx").on(users.email);
export const usersStatusIdx = index("status_idx").on(users.status);

// Blog posts for portfolio content
export const blogPosts = sqliteTable("blog_posts", {
  id: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  status: text("status").$type<PostStatus>().notNull().default("draft"),
  tags: text("tags", { mode: "json" }).$type<string[]>(),
  imageUrl: text("image_url"),
  imageAlt: text("image_alt"),
  author: text("author").notNull(),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
  publishedAt: integer("published_at", { mode: "timestamp" }),
});

// Define indexes separately
export const blogPostsSlugIdx = index("slug_idx").on(blogPosts.slug);
export const blogPostsStatusIdx = index("status_idx").on(blogPosts.status);
export const blogPostsPublishedAtIdx = index("published_at_idx").on(
  blogPosts.publishedAt
);

// Contact inquiries for portfolio contact form
export const contactInquiries = sqliteTable("contact_inquiries", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").$type<InquiryStatus>().notNull().default("open"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// Define indexes separately
export const contactInquiriesStatusIdx = index("contact_status_idx").on(
  contactInquiries.status
);
export const contactInquiriesCreatedAtIdx = index("contact_created_at_idx").on(
  contactInquiries.createdAt
);

// Certifications table for professional credentials
export const certifications = sqliteTable("certifications", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  description: text("description").notNull(),
  category: text("category").$type<CertificationCategory>().notNull(),
  status: text("status")
    .$type<CertificationStatus>()
    .notNull()
    .default("active"),

  // Skills as JSON array
  skills: text("skills", { mode: "json" }).$type<string[]>().notNull(),

  // Dates
  issueDate: integer("issue_date", { mode: "timestamp" }).notNull(),
  expiryDate: integer("expiry_date", { mode: "timestamp" }),

  // Verification details
  credentialId: text("credential_id"),
  verificationUrl: text("verification_url"),

  // Visual
  icon: text("icon"),
  color: text("color"), // For category color override

  // Display order and visibility
  displayOrder: integer("display_order").notNull().default(0),
  isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),

  // Multi-language support
  nameTranslations: text("name_translations", { mode: "json" }).$type<
    Record<string, string>
  >(),
  descriptionTranslations: text("description_translations", {
    mode: "json",
  }).$type<Record<string, string>>(),
  issuerTranslations: text("issuer_translations", { mode: "json" }).$type<
    Record<string, string>
  >(),

  // Metadata
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
});

// Certification indexes
export const certificationsStatusIdx = index("cert_status_idx").on(
  certifications.status
);
export const certificationsCategoryIdx = index("cert_category_idx").on(
  certifications.category
);
export const certificationsVisibilityIdx = index("cert_visibility_idx").on(
  certifications.isVisible
);
export const certificationsDisplayOrderIdx = index("cert_display_order_idx").on(
  certifications.displayOrder
);
export const certificationsIssueDateIdx = index("cert_issue_date_idx").on(
  certifications.issueDate
);
export const certificationsExpiryDateIdx = index("cert_expiry_date_idx").on(
  certifications.expiryDate
);

// Work Experiences table for career history
export const workExperiences = sqliteTable("work_experiences", {
  id: text("id").primaryKey().notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }), // null for current position
  description: text("description").notNull(),
  achievements: text("achievements", { mode: "json" })
    .$type<string[]>()
    .notNull(),
  technologies: text("technologies", { mode: "json" })
    .$type<string[]>()
    .notNull(),
  responsibilities: text("responsibilities", { mode: "json" })
    .$type<string[]>()
    .notNull(),
  employmentType: text("employment_type").$type<EmploymentType>().notNull(),
  industry: text("industry").notNull(),
  companyUrl: text("company_url"),
  logo: text("logo"),
  displayOrder: integer("display_order").notNull().default(0),
  isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
  isFeatured: integer("is_featured", { mode: "boolean" })
    .notNull()
    .default(false),

  // Multi-language support
  roleTranslations: text("role_translations", { mode: "json" }).$type<
    Record<string, string>
  >(),
  companyTranslations: text("company_translations", { mode: "json" }).$type<
    Record<string, string>
  >(),
  descriptionTranslations: text("description_translations", {
    mode: "json",
  }).$type<Record<string, string>>(),

  // Metadata
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
});

// Work experience indexes
export const workExperiencesStartDateIdx = index("work_exp_start_date_idx").on(
  workExperiences.startDate
);
export const workExperiencesEndDateIdx = index("work_exp_end_date_idx").on(
  workExperiences.endDate
);
export const workExperiencesEmploymentTypeIdx = index(
  "work_exp_employment_type_idx"
).on(workExperiences.employmentType);
export const workExperiencesVisibilityIdx = index("work_exp_visibility_idx").on(
  workExperiences.isVisible
);
export const workExperiencesDisplayOrderIdx = index(
  "work_exp_display_order_idx"
).on(workExperiences.displayOrder);

// Projects table for portfolio showcase
export const projects = sqliteTable("projects", {
  id: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  technologies: text("technologies", { mode: "json" })
    .$type<string[]>()
    .notNull(),
  categories: text("categories", { mode: "json" }).$type<string[]>().notNull(),
  status: text("status").$type<ProjectStatus>().notNull().default("completed"),
  projectType: text("project_type").$type<ProjectType>().notNull(),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  demoUrl: text("demo_url"),
  documentationUrl: text("documentation_url"),
  images: text("images", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  keyFeatures: text("key_features", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  technicalChallenges: text("technical_challenges", { mode: "json" })
    .$type<
      {
        challenge: string;
        solution: string;
      }[]
    >()
    .notNull()
    .default([]),
  codeExamples: text("code_examples", { mode: "json" })
    .$type<
      {
        title: string;
        language: string;
        code: string;
        explanation: string;
      }[]
    >()
    .notNull()
    .default([]),
  teamSize: integer("team_size"),
  myRole: text("my_role"),
  clientName: text("client_name"),
  budget: text("budget"),
  displayOrder: integer("display_order").notNull().default(0),
  isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
  isFeatured: integer("is_featured", { mode: "boolean" })
    .notNull()
    .default(false),
  isOpenSource: integer("is_open_source", { mode: "boolean" })
    .notNull()
    .default(false),

  // Problem-solving details
  problem: text("problem", { mode: "json" }).$type<ProjectProblem>(),
  solution: text("solution", { mode: "json" }).$type<ProjectSolution>(),
  architecture: text("architecture", {
    mode: "json",
  }).$type<ProjectArchitecture>(),

  // Multi-language support
  titleTranslations: text("title_translations", { mode: "json" }).$type<
    Record<string, string>
  >(),
  descriptionTranslations: text("description_translations", {
    mode: "json",
  }).$type<Record<string, string>>(),

  // Metadata
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
});

// Project indexes
export const projectsStatusIdx = index("projects_status_idx").on(
  projects.status
);
export const projectsTypeIdx = index("projects_type_idx").on(
  projects.projectType
);
export const projectsStartDateIdx = index("projects_start_date_idx").on(
  projects.startDate
);
export const projectsVisibilityIdx = index("projects_visibility_idx").on(
  projects.isVisible
);
export const projectsDisplayOrderIdx = index("projects_display_order_idx").on(
  projects.displayOrder
);
export const projectsFeaturedIdx = index("projects_featured_idx").on(
  projects.isFeatured
);

// Skills table for technical competencies
export const skills = sqliteTable("skills", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  category: text("category").$type<SkillCategory>().notNull(),
  subCategory: text("sub_category"),
  proficiencyLevel: integer("proficiency_level").notNull(), // 1-100
  proficiencyLabel: text("proficiency_label")
    .$type<ProficiencyLevel>()
    .notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
  relatedSkills: text("related_skills", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  certifications: text("certifications", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  projects: text("projects", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  lastUsed: integer("last_used", { mode: "timestamp" }).notNull(),
  isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),

  // Multi-language support
  nameTranslations: text("name_translations", { mode: "json" }).$type<
    Record<string, string>
  >(),
  descriptionTranslations: text("description_translations", {
    mode: "json",
  }).$type<Record<string, string>>(),

  // Metadata
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
});

// Skills indexes
export const skillsCategoryIdx = index("skills_category_idx").on(
  skills.category
);
export const skillsProficiencyIdx = index("skills_proficiency_idx").on(
  skills.proficiencyLevel
);
export const skillsVisibilityIdx = index("skills_visibility_idx").on(
  skills.isVisible
);
export const skillsDisplayOrderIdx = index("skills_display_order_idx").on(
  skills.displayOrder
);
export const skillsLastUsedIdx = index("skills_last_used_idx").on(
  skills.lastUsed
);

// Education table for academic background
export const education = sqliteTable("education", {
  id: text("id").primaryKey().notNull(),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  degreeType: text("degree_type").$type<DegreeType>().notNull(),
  fieldOfStudy: text("field_of_study").notNull(),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }),
  status: text("status")
    .$type<EducationStatus>()
    .notNull()
    .default("completed"),
  gpa: text("gpa"),
  achievements: text("achievements", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  coursework: text("coursework", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  projects: text("projects", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  extracurriculars: text("extracurriculars", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  location: text("location").notNull(),
  institutionUrl: text("institution_url"),
  certificateUrl: text("certificate_url"),
  transcript: text("transcript"),
  isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),

  // Multi-language support
  institutionTranslations: text("institution_translations", {
    mode: "json",
  }).$type<Record<string, string>>(),
  degreeTranslations: text("degree_translations", { mode: "json" }).$type<
    Record<string, string>
  >(),
  fieldOfStudyTranslations: text("field_of_study_translations", {
    mode: "json",
  }).$type<Record<string, string>>(),

  // Metadata
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
});

// Education indexes
export const educationStatusIdx = index("education_status_idx").on(
  education.status
);
export const educationDegreeTypeIdx = index("education_degree_type_idx").on(
  education.degreeType
);
export const educationVisibilityIdx = index("education_visibility_idx").on(
  education.isVisible
);
export const educationDisplayOrderIdx = index("education_display_order_idx").on(
  education.displayOrder
);

// Services table for professional offerings
export const services = sqliteTable("services", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  category: text("category").$type<ServiceCategory>().notNull(),
  serviceType: text("service_type").$type<ServiceType>().notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  features: text("features", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  technologies: text("technologies", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  duration: text("duration"), // e.g., "2-4 weeks", "1-3 months"
  complexity: text("complexity"), // e.g., "beginner", "intermediate", "advanced"
  pricingType: text("pricing_type").$type<PricingType>().notNull(),
  basePrice: text("base_price"),
  priceRange: text("price_range"), // e.g., "$500-$2000"
  deliverables: text("deliverables", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  requirements: text("requirements", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  portfolioExamples: text("portfolio_examples", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  isPopular: integer("is_popular", { mode: "boolean" })
    .notNull()
    .default(false),
  displayOrder: integer("display_order").notNull().default(0),

  // Multi-language support
  nameTranslations: text("name_translations", { mode: "json" }).$type<
    Record<string, string>
  >(),
  descriptionTranslations: text("description_translations", {
    mode: "json",
  }).$type<Record<string, string>>(),

  // Metadata
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
});

// Services indexes
export const servicesCategoryIdx = index("services_category_idx").on(
  services.category
);
export const servicesTypeIdx = index("services_type_idx").on(
  services.serviceType
);
export const servicesActiveIdx = index("services_active_idx").on(
  services.isActive
);
export const servicesPopularIdx = index("services_popular_idx").on(
  services.isPopular
);
export const servicesDisplayOrderIdx = index("services_display_order_idx").on(
  services.displayOrder
);
