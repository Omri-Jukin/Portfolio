import {
  pgTable,
  text,
  timestamp,
  integer,
  index,
  uuid,
  boolean,
  json,
} from "drizzle-orm/pg-core";
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
  TCodeExamples,
  TTechnicalChallenges,
} from "#/lib/types";

// Users table - minimal for portfolio admin
export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").$type<UserRole>().notNull().default("visitor"),
  status: text("status").$type<UserStatus>().notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  lastLogin: timestamp("last_login", { withTimezone: true }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  sessionId: text("session_id"),
  avatar: text("avatar"),
  bio: text("bio"),
  location: text("location"),
  website: text("website"),
  linkedin: text("linkedin"),
  twitter: text("twitter"),
  github: text("github"),
  facebook: text("facebook"),
  instagram: text("instagram"),
  youtube: text("youtube"),
  tiktok: text("tiktok"),
  pinterest: text("pinterest"),
  reddit: text("reddit"),
  telegram: text("telegram"),
  whatsapp: text("whatsapp"),
});

// Define indexes separately - removed for now to fix generation
// // export const usersEmailIdx = index("email_idx").on(users.email);

// Blog posts for portfolio content
export const blogPosts = pgTable("blog_posts", {
  id: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  status: text("status").$type<PostStatus>().notNull().default("draft"),
  tags: json("tags").$type<string[]>().notNull().default([]),
  imageUrl: text("image_url"),
  imageAlt: text("image_alt"),
  author: text("author").notNull(),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
});

// Define indexes separately - temporarily commented for migration
// // export const blogPostsSlugIdx = index("slug_idx").on(blogPosts.slug);
// // export const blogPostsStatusIdx = index("status_idx").on(blogPosts.status);
// // export const blogPostsPublishedAtIdx = index("published_at_idx").on(
//   blogPosts.publishedAt
// );

// Contact inquiries for portfolio contact form
export const contactInquiries = pgTable("contact_inquiries", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").$type<InquiryStatus>().notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// Define indexes separately - temporarily commented for migration
// // export const contactInquiriesStatusIdx = index("contact_status_idx").on(
//   contactInquiries.status
// );
// // export const contactInquiriesCreatedAtIdx = index("contact_created_at_idx").on(
//   contactInquiries.createdAt
// );

// Certifications table for professional credentials
export const certifications = pgTable("certifications", {
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
  skills: json("skills").$type<string[]>().notNull().default([]),
  // Dates
  issueDate: timestamp("issue_date", { withTimezone: true }).notNull(),
  expiryDate: timestamp("expiry_date", { withTimezone: true }),
  // Verification details
  credentialId: text("credential_id"),
  verificationUrl: text("verification_url"),
  // Visual
  icon: text("icon"),
  color: text("color"), // For category color override
  // Display order and visibility
  displayOrder: integer("display_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  // Multi-language support
  nameTranslations: text("name_translations").$type<Record<string, string>>(),
  descriptionTranslations: text("description_translations").$type<
    Record<string, string>
  >(),
  issuerTranslations: text("issuer_translations").$type<
    Record<string, string>
  >(),
  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
});

// Certification indexes
// export const certificationsStatusIdx = index("cert_status_idx").on(
//   certifications.status
// );
// export const certificationsCategoryIdx = index("cert_category_idx").on(
//   certifications.category
// );
// export const certificationsVisibilityIdx = index("cert_visibility_idx").on(
//   certifications.isVisible
// );
// export const certificationsDisplayOrderIdx = index("cert_display_order_idx").on(
//   certifications.displayOrder
// );
// export const certificationsIssueDateIdx = index("cert_issue_date_idx").on(
//   certifications.issueDate
// );
// export const certificationsExpiryDateIdx = index("cert_expiry_date_idx").on(
//   certifications.expiryDate
// );

// Work Experiences table for career history
export const workExperiences = pgTable("work_experiences", {
  id: text("id").primaryKey().notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }), // null for current position
  description: text("description").notNull(),
  achievements: json("achievements").$type<string[]>().notNull().default([]),
  technologies: json("technologies").$type<string[]>().notNull().default([]),
  responsibilities: json("responsibilities")
    .$type<string[]>()
    .notNull()
    .default([]),
  employmentType: text("employment_type").$type<EmploymentType>().notNull(),
  industry: text("industry").notNull(),
  companyUrl: text("company_url"),
  logo: text("logo"),
  displayOrder: integer("display_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),

  // Multi-language support
  roleTranslations: text("role_translations").$type<Record<string, string>>(),
  companyTranslations: text("company_translations").$type<
    Record<string, string>
  >(),
  descriptionTranslations: text("description_translations").$type<
    Record<string, string>
  >(),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
});

// Work experience indexes
// export const workExperiencesStartDateIdx = index("work_exp_start_date_idx").on(
  workExperiences.startDate
);
// export const workExperiencesEndDateIdx = index("work_exp_end_date_idx").on(
  workExperiences.endDate
);
// export const workExperiencesEmploymentTypeIdx = index(
  "work_exp_employment_type_idx"
).on(workExperiences.employmentType);
// export const workExperiencesVisibilityIdx = index("work_exp_visibility_idx").on(
  workExperiences.isVisible
);
// export const workExperiencesDisplayOrderIdx = index(
  "work_exp_display_order_idx"
).on(workExperiences.displayOrder);

// Projects table for portfolio showcase
export const projects = pgTable("projects", {
  id: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  technologies: json("technologies").$type<string[]>().notNull().default([]),
  categories: json("categories").$type<string[]>().notNull().default([]),
  status: text("status").$type<ProjectStatus>().notNull().default("completed"),
  projectType: text("project_type").$type<ProjectType>().notNull(),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  demoUrl: text("demo_url"),
  documentationUrl: text("documentation_url"),
  images: json("images").$type<string[]>().notNull().default([]),
  keyFeatures: json("key_features").$type<string[]>().notNull().default([]),
  technicalChallenges: json("technical_challenges").$type<TTechnicalChallenges>().notNull().default([]),
  codeExamples: json("code_examples").$type<TCodeExamples>().notNull().default([]),
  teamSize: integer("team_size"),
  myRole: text("my_role"),
  clientName: text("client_name"),
  budget: text("budget"),
  displayOrder: integer("display_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  isOpenSource: boolean("is_open_source").notNull().default(false),
  // Problem-solving details
  problem: text("problem").$type<ProjectProblem | null>(),
  solution: text("solution").$type<ProjectSolution | null>(),
  architecture: text("architecture").$type<ProjectArchitecture | null>(),
  // Multi-language support
  titleTranslations: text("title_translations").$type<Record<string, string>>(),
  descriptionTranslations: text("description_translations").$type<
    Record<string, string>
  >(),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
});

// Project indexes
// export const projectsStatusIdx = index("projects_status_idx").on(
  projects.status
);
// export const projectsTypeIdx = index("projects_type_idx").on(
  projects.projectType
);
// export const projectsStartDateIdx = index("projects_start_date_idx").on(
  projects.startDate
);
// export const projectsVisibilityIdx = index("projects_visibility_idx").on(
  projects.isVisible
);
// export const projectsDisplayOrderIdx = index("projects_display_order_idx").on(
  projects.displayOrder
);
// export const projectsFeaturedIdx = index("projects_featured_idx").on(
  projects.isFeatured
);

// Skills table for technical competencies
export const skills = pgTable("skills", {
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
  relatedSkills: json("related_skills").$type<string[]>().notNull().default([]),
  certifications: json("certifications")
    .$type<string[]>()
    .notNull()
    .default([]),
  projects: json("projects").$type<string[]>().notNull().default([]),
  lastUsed: timestamp("last_used", { withTimezone: true }).notNull(),
  isVisible: boolean("is_visible").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),

  // Multi-language support
  nameTranslations: text("name_translations").$type<Record<string, string>>(),
  descriptionTranslations: text("description_translations").$type<
    Record<string, string>
  >(),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
});

// Skills indexes
// export const skillsCategoryIdx = index("skills_category_idx").on(
  skills.category
);
// export const skillsProficiencyIdx = index("skills_proficiency_idx").on(
  skills.proficiencyLevel
);
// export const skillsVisibilityIdx = index("skills_visibility_idx").on(
  skills.isVisible
);
// export const skillsDisplayOrderIdx = index("skills_display_order_idx").on(
  skills.displayOrder
);
// export const skillsLastUsedIdx = index("skills_last_used_idx").on(
  skills.lastUsed
);

// Education table for academic background
export const education = pgTable("education", {
  id: text("id").primaryKey().notNull(),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  degreeType: text("degree_type").$type<DegreeType>().notNull(),
  fieldOfStudy: text("field_of_study").notNull(),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }),
  status: text("status")
    .$type<EducationStatus>()
    .notNull()
    .default("completed"),
  gpa: text("gpa"),
  achievements: text("achievements")
    .$type<string[]>()
    .$type<string[]>()
    .notNull()
    .default([]),
  coursework: text("coursework")
    .$type<string[]>()
    .$type<string[]>()
    .notNull()
    .default([]),
  projects: text("projects")
    .$type<string[]>()
    .$type<string[]>()
    .notNull()
    .default([]),
  extracurriculars: text("extracurriculars")
    .$type<string[]>()
    .$type<string[]>()
    .notNull()
    .default([]),
  location: text("location").notNull(),
  institutionUrl: text("institution_url"),
  certificateUrl: text("certificate_url"),
  transcript: text("transcript"),
  isVisible: boolean("is_visible").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),

  // Multi-language support
  institutionTranslations: text("institution_translations").$type<
    Record<string, string>
  >(),
  degreeTranslations: text("degree_translations").$type<
    Record<string, string>
  >(),
  fieldOfStudyTranslations: text("field_of_study_translations").$type<
    Record<string, string>
  >(),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
});

// Education indexes
// export const educationStatusIdx = index("education_status_idx").on(
  education.status
);
// export const educationDegreeTypeIdx = index("education_degree_type_idx").on(
  education.degreeType
);
// export const educationVisibilityIdx = index("education_visibility_idx").on(
  education.isVisible
);
// export const educationDisplayOrderIdx = index("education_display_order_idx").on(
  education.displayOrder
);

// Services table for professional offerings
export const services = pgTable("services", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  category: text("category").$type<ServiceCategory>().notNull(),
  serviceType: text("service_type").$type<ServiceType>().notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  features: text("features")
    .$type<string[]>()
    .$type<string[]>()
    .notNull()
    .default([]),
  technologies: text("technologies")
    .$type<string[]>()
    .$type<string[]>()
    .notNull()
    .default([]),
  duration: text("duration"), // e.g., "2-4 weeks", "1-3 months"
  complexity: text("complexity"), // e.g., "beginner", "intermediate", "advanced"
  pricingType: text("pricing_type").$type<PricingType>().notNull(),
  basePrice: text("base_price"),
  priceRange: text("price_range"), // e.g., "$500-$2000"
  deliverables: text("deliverables")
    .$type<string[]>()
    .$type<string[]>()
    .notNull()
    .default([]),
  requirements: text("requirements")
    .$type<string[]>()
    .$type<string[]>()
    .notNull()
    .default([]),
  portfolioExamples: text("portfolio_examples")
    .$type<string[]>()
    .$type<string[]>()
    .notNull()
    .default([]),
  isActive: boolean("is_active").notNull().default(true),
  isPopular: boolean("is_popular").notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),

  // Multi-language support
  nameTranslations: text("name_translations").$type<Record<string, string>>(),
  descriptionTranslations: text("description_translations").$type<
    Record<string, string>
  >(),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
});

// Services indexes
// export const servicesCategoryIdx = index("services_category_idx").on(
  services.category
);
// export const servicesTypeIdx = index("services_type_idx").on(
  services.serviceType
);
// export const servicesActiveIdx = index("services_active_idx").on(
  services.isActive
);
// export const servicesPopularIdx = index("services_popular_idx").on(
  services.isPopular
);
// export const servicesDisplayOrderIdx = index("services_display_order_idx").on(
  services.displayOrder
);

// Testimonials table for client/colleague feedback
export const testimonials = pgTable("testimonials", {
  id: text("id").primaryKey().notNull(),
  quote: text("quote").notNull(),
  author: text("author").notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),

  // Additional details
  authorImage: text("author_image"),
  authorLinkedIn: text("author_linkedin"),
  companyUrl: text("company_url"),
  companyLogo: text("company_logo"),

  // Rating and verification
  rating: integer("rating"), // 1-5 stars
  isVerified: boolean("is_verified").notNull().default(false),
  verificationDate: timestamp("verification_date", { withTimezone: true }),

  // Display and ordering
  displayOrder: integer("display_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),

  // Multi-language support
  quoteTranslations: text("quote_translations").$type<Record<string, string>>(),
  authorTranslations: text("author_translations").$type<
    Record<string, string>
  >(),
  roleTranslations: text("role_translations").$type<Record<string, string>>(),
  companyTranslations: text("company_translations").$type<
    Record<string, string>
  >(),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
});

// Testimonials indexes
// export const testimonialsVisibilityIdx = index(
  "testimonials_visibility_idx"
).on(testimonials.isVisible);
// export const testimonialsFeaturedIdx = index("testimonials_featured_idx").on(
  testimonials.isFeatured
);
// export const testimonialsDisplayOrderIdx = index(
  "testimonials_display_order_idx"
).on(testimonials.displayOrder);
// export const testimonialsRatingIdx = index("testimonials_rating_idx").on(
  testimonials.rating
);
// export const testimonialsVerifiedIdx = index("testimonials_verified_idx").on(
  testimonials.isVerified
);
// export const testimonialsCompanyIdx = index("testimonials_company_idx").on(
  testimonials.company
);
