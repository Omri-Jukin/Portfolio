import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
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

// Blog posts for portfolio content
export const blogPosts = pgTable("blog_posts", {
  id: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  status: text("status").$type<PostStatus>().notNull().default("draft"),
  tags: text("tags").array().default([]),
  imageUrl: text("image_url"),
  imageAlt: text("image_alt"),
  author: text("author").notNull(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
});

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
  skills: text("skills").array().notNull().default([]),
  issueDate: timestamp("issue_date", { withTimezone: true }).notNull(),
  expiryDate: timestamp("expiry_date", { withTimezone: true }),
  credentialId: text("credential_id"),
  verificationUrl: text("verification_url"),
  icon: text("icon"),
  color: text("color"),
  displayOrder: integer("display_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  nameTranslations: text("name_translations").$type<Record<string, string>>(),
  descriptionTranslations: text("description_translations").$type<
    Record<string, string>
  >(),
  issuerTranslations: text("issuer_translations").$type<
    Record<string, string>
  >(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
});

// Work Experiences table for career history
export const workExperiences = pgTable("work_experiences", {
  id: text("id").primaryKey().notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }),
  description: text("description").notNull(),
  achievements: text("achievements").array().notNull().default([]),
  technologies: text("technologies").array().notNull().default([]),
  responsibilities: text("responsibilities").array().notNull().default([]),
  employmentType: text("employment_type").$type<EmploymentType>().notNull(),
  industry: text("industry").notNull(),
  companyUrl: text("company_url"),
  logo: text("logo"),
  displayOrder: integer("display_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  roleTranslations: text("role_translations").$type<Record<string, string>>(),
  companyTranslations: text("company_translations").$type<
    Record<string, string>
  >(),
  descriptionTranslations: text("description_translations").$type<
    Record<string, string>
  >(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
});

// Projects table for portfolio showcase
export const projects = pgTable("projects", {
  id: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  technologies: text("technologies").array().notNull().default([]),
  categories: text("categories").array().notNull().default([]),
  status: text("status").$type<ProjectStatus>().notNull().default("completed"),
  projectType: text("project_type").$type<ProjectType>().notNull(),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  demoUrl: text("demo_url"),
  documentationUrl: text("documentation_url"),
  images: text("images").array().notNull().default([]),
  keyFeatures: text("key_features").array().notNull().default([]),
  technicalChallenges: text("technical_challenges")
    .$type<Array<{ challenge: string; solution: string }> | string[]>()
    .notNull()
    .default(sql`'[]'::text`),
  codeExamples: text("code_examples")
    .$type<
      | Array<{
          title: string;
          language: string;
          code: string;
          explanation: string;
        }>
      | string[]
    >()
    .notNull()
    .default(sql`'[]'::text`),
  teamSize: integer("team_size"),
  myRole: text("my_role"),
  clientName: text("client_name"),
  budget: text("budget"),
  displayOrder: integer("display_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  isOpenSource: boolean("is_open_source").notNull().default(false),
  problem: text("problem"),
  solution: text("solution"),
  architecture: text("architecture"),
  titleTranslations: text("title_translations").$type<Record<string, string>>(),
  descriptionTranslations: text("description_translations").$type<
    Record<string, string>
  >(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
});

// Skills table for technical competencies
export const skills = pgTable("skills", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  category: text("category").$type<SkillCategory>().notNull(),
  subCategory: text("sub_category"),
  proficiencyLevel: integer("proficiency_level").notNull(),
  proficiencyLabel: text("proficiency_label")
    .$type<ProficiencyLevel>()
    .notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
  relatedSkills: text("related_skills").array().notNull().default([]),
  certifications: text("certifications").array().notNull().default([]),
  projects: text("projects").array().notNull().default([]),
  lastUsed: timestamp("last_used", { withTimezone: true }).notNull(),
  isVisible: boolean("is_visible").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  nameTranslations: text("name_translations").$type<Record<string, string>>(),
  descriptionTranslations: text("description_translations").$type<
    Record<string, string>
  >(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
});

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
  achievements: text("achievements").array().notNull().default([]),
  coursework: text("coursework").array().notNull().default([]),
  projects: text("projects").array().notNull().default([]),
  extracurriculars: text("extracurriculars").array().notNull().default([]),
  location: text("location").notNull(),
  institutionUrl: text("institution_url"),
  certificateUrl: text("certificate_url"),
  transcript: text("transcript"),
  isVisible: boolean("is_visible").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  institutionTranslations: text("institution_translations").$type<
    Record<string, string>
  >(),
  degreeTranslations: text("degree_translations").$type<
    Record<string, string>
  >(),
  fieldOfStudyTranslations: text("field_of_study_translations").$type<
    Record<string, string>
  >(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
});

// Services table for professional offerings
export const services = pgTable("services", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  category: text("category").$type<ServiceCategory>().notNull(),
  serviceType: text("service_type").$type<ServiceType>().notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  features: text("features").array().notNull().default([]),
  technologies: text("technologies").array().notNull().default([]),
  duration: text("duration"),
  complexity: text("complexity"),
  pricingType: text("pricing_type").$type<PricingType>().notNull(),
  basePrice: text("base_price"),
  priceRange: text("price_range"),
  deliverables: text("deliverables").array().notNull().default([]),
  requirements: text("requirements").array().notNull().default([]),
  portfolioExamples: text("portfolio_examples").array().notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  isPopular: boolean("is_popular").notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
  nameTranslations: text("name_translations").$type<Record<string, string>>(),
  descriptionTranslations: text("description_translations").$type<
    Record<string, string>
  >(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
});

// Testimonials table for client/colleague feedback
export const testimonials = pgTable("testimonials", {
  id: text("id").primaryKey().notNull(),
  quote: text("quote").notNull(),
  author: text("author").notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  authorImage: text("author_image"),
  authorLinkedIn: text("author_linkedin"),
  companyUrl: text("company_url"),
  companyLogo: text("company_logo"),
  rating: integer("rating"),
  isVerified: boolean("is_verified").notNull().default(false),
  verificationDate: timestamp("verification_date", { withTimezone: true }),
  displayOrder: integer("display_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  quoteTranslations: text("quote_translations").$type<Record<string, string>>(),
  authorTranslations: text("author_translations").$type<
    Record<string, string>
  >(),
  roleTranslations: text("role_translations").$type<Record<string, string>>(),
  companyTranslations: text("company_translations").$type<
    Record<string, string>
  >(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
});

// Intakes table for project intake forms
export const intakes = pgTable("intakes", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: text("email").notNull(),
  data: jsonb("data").notNull(),
  proposalMd: text("proposal_md").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Custom intake links table - stores generated custom links with slugs
export const customIntakeLinks = pgTable("custom_intake_links", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  slug: text("slug").notNull().unique(),
  email: text("email").notNull(),
  token: text("token").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  organizationName: text("organization_name"),
  organizationWebsite: text("organization_website"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Email templates table - stores email templates with HTML, CSS, and content
export const emailTemplates = pgTable("email_templates", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  htmlContent: text("html_content").notNull(),
  textContent: text("text_content"),
  cssStyles: text("css_styles"),
  variables: jsonb("variables").$type<Record<string, string>>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdBy: uuid("created_by").references(() => users.id),
});

// Email sends table - tracks sent emails for analytics
export const emailSends = pgTable("email_sends", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  templateId: uuid("template_id")
    .references(() => emailTemplates.id)
    .notNull(),
  recipientEmail: text("recipient_email").notNull(),
  recipientName: text("recipient_name"),
  subject: text("subject").notNull(),
  status: text("status")
    .$type<"sent" | "failed" | "pending">()
    .notNull()
    .default("pending"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  sentBy: uuid("sent_by").references(() => users.id),
});

// Admin dashboard sections order - stores custom order for dashboard cards
export const adminDashboardSections = pgTable("admin_dashboard_sections", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  sectionKey: text("section_key").notNull().unique(),
  displayOrder: integer("display_order").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
