import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

// Simple types for portfolio website
export type UserRole = "admin" | "visitor";
export type UserStatus = "pending" | "approved" | "rejected";
export type PostStatus = "draft" | "published";
export type InquiryStatus = "open" | "closed";

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
