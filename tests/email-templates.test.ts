import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import {
  createEmailTemplate,
  getEmailTemplateById,
  getAllEmailTemplates,
  updateEmailTemplate,
  deleteEmailTemplate,
  type CreateEmailTemplateInput,
} from "$/db/emailTemplates/emailTemplates";
import { getDB } from "$/db/client";
import { emailTemplates } from "$/db/schema/schema.tables";
import { users } from "$/db/schema/schema.tables";
import { eq } from "drizzle-orm";

describe("Email Templates", () => {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;
  let testUserId: string;

  beforeEach(async () => {
    // Skip tests if DATABASE_URL is not set or in production
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping email template tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      if (!db) {
        return;
      }

      // Clean up templates and users before each test
      await db.delete(emailTemplates);
      await db.delete(users).where(eq(users.email, "test-admin@example.com"));

      // Create a test user for createdBy
      const testUser = await db
        .insert(users)
        .values({
          email: "test-admin@example.com",
          password: "hashed_password",
          firstName: "Test",
          lastName: "Admin",
          role: "admin",
        })
        .returning();
      testUserId = testUser[0]?.id;

      if (!testUserId) {
        throw new Error("Failed to create test user");
      }
    } catch (error) {
      console.error("Failed to setup test database:", error);
      db = null;
    }
  });

  afterEach(async () => {
    // Clean up after each test
    if (db) {
      await db.delete(emailTemplates);
      await db.delete(users);
    }
  });

  describe("createEmailTemplate", () => {
    it("should create a new email template", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      const input: CreateEmailTemplateInput = {
        name: "Welcome Email",
        subject: "Welcome to {{companyName}}",
        htmlContent: "<h1>Hello {{firstName}}!</h1>",
        textContent: "Hello {{firstName}}!",
        cssStyles: "body { font-family: Arial; }",
        createdBy: testUserId,
        variables: { firstName: "John", companyName: "Acme Inc" },
      };

      const template = await createEmailTemplate(input);

      expect(template).toBeDefined();
      expect(template.id).toBeTruthy();
      expect(template.name).toBe(input.name);
      expect(template.subject).toBe(input.subject);
      expect(template.htmlContent).toBe(input.htmlContent);
      expect(template.textContent).toBe(input.textContent);
      expect(template.cssStyles).toBe(input.cssStyles);
      expect(template.variables).toEqual(input.variables);
      expect(template.createdBy).toBe(testUserId);
      expect(template.createdAt).toBeInstanceOf(Date);
      expect(template.updatedAt).toBeInstanceOf(Date);
    });

    it("should create template without optional fields", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      const input: CreateEmailTemplateInput = {
        name: "Simple Email",
        subject: "Hello",
        htmlContent: "<p>Content</p>",
        createdBy: testUserId,
      };

      const template = await createEmailTemplate(input);

      expect(template).toBeDefined();
      expect(template.id).toBeTruthy();
      expect(template.name).toBe(input.name);
      expect(template.subject).toBe(input.subject);
      expect(template.htmlContent).toBe(input.htmlContent);
      expect(template.textContent).toBeNull();
      expect(template.cssStyles).toBeNull();
      expect(template.variables).toBeNull();
      expect(template.createdBy).toBe(testUserId);
      expect(template.createdAt).toBeInstanceOf(Date);
      expect(template.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe("getEmailTemplateById", () => {
    it("should retrieve template by ID", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      const created = await createEmailTemplate({
        name: "Test Template",
        subject: "Test Subject",
        htmlContent: "<p>Test</p>",
        createdBy: testUserId,
      });

      const retrieved = await getEmailTemplateById(created.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.name).toBe("Test Template");
    });

    it("should return null for non-existent template", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      const retrieved = await getEmailTemplateById(
        "00000000-0000-0000-0000-000000000000"
      );
      expect(retrieved).toBeNull();
    });
  });

  describe("getAllEmailTemplates", () => {
    it("should return all email templates", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      await createEmailTemplate({
        name: "Template 1",
        subject: "Subject 1",
        htmlContent: "<p>Content 1</p>",
        createdBy: testUserId,
      });
      await createEmailTemplate({
        name: "Template 2",
        subject: "Subject 2",
        htmlContent: "<p>Content 2</p>",
        createdBy: testUserId,
      });

      const templates = await getAllEmailTemplates();

      expect(templates).toHaveLength(2);
      expect(templates.map((t) => t.name)).toContain("Template 1");
      expect(templates.map((t) => t.name)).toContain("Template 2");
    });

    it("should return empty array when no templates exist", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      const templates = await getAllEmailTemplates();
      expect(templates).toEqual([]);
    });
  });

  describe("updateEmailTemplate", () => {
    it("should update template fields", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      const created = await createEmailTemplate({
        name: "Original Name",
        subject: "Original Subject",
        htmlContent: "<p>Original</p>",
        createdBy: testUserId,
      });

      const updated = await updateEmailTemplate(created.id, {
        name: "Updated Name",
        subject: "Updated Subject",
        htmlContent: "<p>Updated</p>",
      });

      expect(updated.name).toBe("Updated Name");
      expect(updated.subject).toBe("Updated Subject");
      expect(updated.htmlContent).toBe("<p>Updated</p>");
      expect(updated.id).toBe(created.id);
    });

    it("should update only provided fields", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      const created = await createEmailTemplate({
        name: "Original Name",
        subject: "Original Subject",
        htmlContent: "<p>Original</p>",
        createdBy: testUserId,
      });

      const updated = await updateEmailTemplate(created.id, {
        name: "Updated Name",
      });

      expect(updated.name).toBe("Updated Name");
      expect(updated.subject).toBe("Original Subject");
      expect(updated.htmlContent).toBe("<p>Original</p>");
    });

    it("should update variables", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      const created = await createEmailTemplate({
        name: "Test",
        subject: "Test",
        htmlContent: "<p>Test</p>",
        createdBy: testUserId,
        variables: { oldVar: "oldValue" },
      });

      const updated = await updateEmailTemplate(created.id, {
        variables: { newVar: "newValue" },
      });

      expect(updated.variables).toEqual({ newVar: "newValue" });
    });
  });

  describe("deleteEmailTemplate", () => {
    it("should delete template by ID", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      const created = await createEmailTemplate({
        name: "To Delete",
        subject: "Delete Me",
        htmlContent: "<p>Delete</p>",
        createdBy: testUserId,
      });

      const success = await deleteEmailTemplate(created.id);
      expect(success).toBe(true);

      const retrieved = await getEmailTemplateById(created.id);
      expect(retrieved).toBeNull();
    });

    it("should return false for non-existent template", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      const success = await deleteEmailTemplate(
        "00000000-0000-0000-0000-000000000000"
      );
      expect(success).toBe(false);
    });
  });
});
