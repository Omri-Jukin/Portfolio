-- D1 SQLite Migration for Portfolio Website
-- This migration creates the tables needed for the portfolio website

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'visitor',
  "status" TEXT NOT NULL DEFAULT 'pending',
  "created_at" INTEGER NOT NULL DEFAULT (unixepoch()),
  "updated_at" INTEGER
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "status_idx" ON "users" ("status");

-- Blog posts table
CREATE TABLE IF NOT EXISTS "blog_posts" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "content" TEXT NOT NULL,
  "excerpt" TEXT,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "tags" TEXT,
  "image_url" TEXT,
  "image_alt" TEXT,
  "author_id" TEXT NOT NULL,
  "created_at" INTEGER NOT NULL DEFAULT (unixepoch()),
  "updated_at" INTEGER,
  "published_at" INTEGER,
  FOREIGN KEY ("author_id") REFERENCES "users" ("id")
);

-- Create indexes for blog posts
CREATE INDEX IF NOT EXISTS "slug_idx" ON "blog_posts" ("slug");
CREATE INDEX IF NOT EXISTS "blog_status_idx" ON "blog_posts" ("status");
CREATE INDEX IF NOT EXISTS "published_at_idx" ON "blog_posts" ("published_at");

-- Contact inquiries table
CREATE TABLE IF NOT EXISTS "contact_inquiries" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'open',
  "created_at" INTEGER NOT NULL DEFAULT (unixepoch()),
  "updated_at" INTEGER
);

-- Create indexes for contact inquiries
CREATE INDEX IF NOT EXISTS "contact_status_idx" ON "contact_inquiries" ("status");
CREATE INDEX IF NOT EXISTS "contact_created_at_idx" ON "contact_inquiries" ("created_at"); 