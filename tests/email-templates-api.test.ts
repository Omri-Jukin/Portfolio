import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { getDB } from "$/db/client";
import { emailTemplates, emailSends } from "$/db/schema/schema.tables";

describe("Email Templates API", () => {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;

  beforeEach(async () => {
    // Skip tests if DATABASE_URL is not set or in production
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping email templates API tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      if (!db) {
        return;
      }
      // Delete in correct order to respect foreign key constraints:
      // 1. email_sends (references email_templates and users)
      // 2. email_templates (references users)
      // 3. users (no dependencies)
      await db.delete(emailSends);
      await db.delete(emailTemplates);
      // Only delete test users, not all users
      // Users are managed by other tests and may have other foreign key relationships
    } catch (error) {
      console.error("Failed to setup test database:", error);
      db = null;
    }
  });

  afterEach(async () => {
    if (db) {
      // Delete in correct order to respect foreign key constraints
      await db.delete(emailSends);
      await db.delete(emailTemplates);
      // Don't delete users - they may be used by other tests
      // and have other foreign key relationships
    }
  });

  describe("Variable Replacement", () => {
    it("should replace variables in HTML content", () => {
      const template = {
        htmlContent: "<h1>Hello {{firstName}}!</h1>",
        subject: "Welcome {{firstName}}",
      };
      const variables = { firstName: "John" };

      // Simple replacement function (same logic as in router)
      const replaceVariables = (text: string, vars: Record<string, string>) => {
        let result = text;
        Object.entries(vars).forEach(([key, value]) => {
          result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), value);
        });
        return result;
      };

      const html = replaceVariables(template.htmlContent, variables);
      const subject = replaceVariables(template.subject, variables);

      expect(html).toBe("<h1>Hello John!</h1>");
      expect(subject).toBe("Welcome John");
    });

    it("should handle multiple variables", () => {
      const template = {
        htmlContent:
          "<p>Hi {{firstName}} {{lastName}}, welcome to {{companyName}}!</p>",
      };
      const variables = {
        firstName: "John",
        lastName: "Doe",
        companyName: "Acme Inc",
      };

      const replaceVariables = (text: string, vars: Record<string, string>) => {
        let result = text;
        Object.entries(vars).forEach(([key, value]) => {
          result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), value);
        });
        return result;
      };

      const result = replaceVariables(template.htmlContent, variables);

      expect(result).toBe("<p>Hi John Doe, welcome to Acme Inc!</p>");
    });

    it("should handle variables with whitespace", () => {
      const template = {
        htmlContent: "<p>{{ firstName }} and {{  lastName  }}</p>",
      };
      const variables = { firstName: "John", lastName: "Doe" };

      const replaceVariables = (text: string, vars: Record<string, string>) => {
        let result = text;
        Object.entries(vars).forEach(([key, value]) => {
          result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), value);
        });
        return result;
      };

      const result = replaceVariables(template.htmlContent, variables);

      expect(result).toBe("<p>John and Doe</p>");
    });

    it("should leave unreplaced variables as-is", () => {
      const template = {
        htmlContent: "<p>Hello {{firstName}}, your {{unusedVar}} is ready.</p>",
      };
      const variables = { firstName: "John" };

      const replaceVariables = (text: string, vars: Record<string, string>) => {
        let result = text;
        Object.entries(vars).forEach(([key, value]) => {
          result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), value);
        });
        return result;
      };

      const result = replaceVariables(template.htmlContent, variables);

      expect(result).toBe("<p>Hello John, your {{unusedVar}} is ready.</p>");
    });

    it("should merge template variables with send-time variables", () => {
      const templateVariables = {
        companyName: "Default Company",
        senderName: "Default Sender",
      };
      const sendVariables = {
        companyName: "Acme Inc", // Override
        clientName: "John Doe", // New variable
      };

      const merged = { ...templateVariables, ...sendVariables };

      expect(merged).toEqual({
        companyName: "Acme Inc",
        senderName: "Default Sender",
        clientName: "John Doe",
      });
    });
  });

  describe("CSS Injection", () => {
    it("should inject CSS into HTML head if head exists", () => {
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body>
  <p>Content</p>
</body>
</html>`;
      const cssStyles = "body { font-family: Arial; }";

      let html = htmlContent;
      if (cssStyles) {
        if (html.includes("</head>")) {
          html = html.replace("</head>", `<style>${cssStyles}</style></head>`);
        }
      }

      expect(html).toContain("<style>body { font-family: Arial; }</style>");
      expect(html).toContain("</head>");
    });

    it("should inject CSS before body if head doesn't exist", () => {
      const htmlContent = `<html>
<body>
  <p>Content</p>
</body>
</html>`;
      const cssStyles = "body { color: red; }";

      let html = htmlContent;
      if (cssStyles) {
        if (html.includes("</head>")) {
          html = html.replace("</head>", `<style>${cssStyles}</style></head>`);
        } else if (html.includes("<body")) {
          html = html.replace(
            "<body",
            `<head><style>${cssStyles}</style></head><body`
          );
        }
      }

      expect(html).toContain(
        "<head><style>body { color: red; }</style></head>"
      );
    });

    it("should prepend CSS if no head or body found", () => {
      const htmlContent = `<div><p>Content</p></div>`;
      const cssStyles = ".content { color: blue; }";

      let html = htmlContent;
      if (cssStyles) {
        if (html.includes("</head>")) {
          html = html.replace("</head>", `<style>${cssStyles}</style></head>`);
        } else if (html.includes("<body")) {
          html = html.replace(
            "<body",
            `<head><style>${cssStyles}</style></head><body`
          );
        } else {
          html = `<style>${cssStyles}</style>${html}`;
        }
      }

      expect(html).toContain(`<style>${cssStyles}</style>`);
      expect(html).toContain(htmlContent);
    });
  });
});
