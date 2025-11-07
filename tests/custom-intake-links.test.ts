import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import {
  createCustomLink,
  getCustomLinkBySlug,
  getAllCustomLinks,
  generateSlugFromName,
  type CreateCustomLinkInput,
} from "$/db/intakes/customLinks";
import { getDB } from "$/db/client";
import { customIntakeLinks } from "$/db/schema/schema.tables";

describe("Custom Intake Links", () => {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;

  beforeEach(async () => {
    // Skip tests if DATABASE_URL is not set or in production
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping custom intake links tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      if (!db) {
        return;
      }
      await db.delete(customIntakeLinks);
    } catch (error) {
      console.error("Failed to setup test database:", error);
      db = null;
    }
  });

  afterEach(async () => {
    if (db) {
      await db.delete(customIntakeLinks);
    }
  });

  describe("generateSlugFromName", () => {
    it("should generate slug from first and last name", () => {
      const slug = generateSlugFromName("John", "Doe");
      expect(slug).toBe("john-doe");
    });

    it("should handle single name", () => {
      const slug = generateSlugFromName("John", undefined);
      expect(slug).toBe("john");
    });

    it("should handle only last name", () => {
      const slug = generateSlugFromName(undefined, "Doe");
      expect(slug).toBe("doe");
    });

    it("should handle special characters", () => {
      const slug = generateSlugFromName("John O'Reilly", "Smith-Jones");
      expect(slug).toBe("john-o-reilly-smith-jones");
    });

    it("should generate fallback slug when no name provided", () => {
      const slug = generateSlugFromName(undefined, undefined);
      expect(slug).toMatch(/^client-/);
      expect(slug.length).toBeGreaterThan(7); // "client-" + timestamp
    });

    it("should trim hyphens from start and end", () => {
      const slug = generateSlugFromName("---John---", "---Doe---");
      expect(slug).toBe("john-doe");
    });
  });

  describe("createCustomLink", () => {
    it("should create a custom link with all fields", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      const input: CreateCustomLinkInput = {
        slug: "john-doe",
        email: "john.doe@example.com",
        token: "test-token-123",
        firstName: "John",
        lastName: "Doe",
        organizationName: "Acme Inc",
        organizationWebsite: "https://acme.com",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      };

      const link = await createCustomLink(input);

      expect(link).toBeDefined();
      expect(link.slug).toBe(input.slug);
      expect(link.email).toBe(input.email);
      expect(link.token).toBe(input.token);
      expect(link.firstName).toBe(input.firstName);
      expect(link.lastName).toBe(input.lastName);
      expect(link.organizationName).toBe(input.organizationName);
      expect(link.organizationWebsite).toBe(input.organizationWebsite);
      expect(link.expiresAt).toBeInstanceOf(Date);
    });

    it("should create link with minimal fields", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      const input: CreateCustomLinkInput = {
        slug: "minimal-link",
        email: "test@example.com",
        token: "token-123",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      };

      const link = await createCustomLink(input);

      expect(link.slug).toBe(input.slug);
      expect(link.email).toBe(input.email);
      expect(link.firstName).toBeNull();
      expect(link.lastName).toBeNull();
    });
  });

  describe("getCustomLinkBySlug", () => {
    it("should retrieve link by slug", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      const created = await createCustomLink({
        slug: "test-slug",
        email: "test@example.com",
        token: "token-123",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      // Wait a bit to ensure the database has committed the transaction
      await new Promise((resolve) => setTimeout(resolve, 100));

      const retrieved = await getCustomLinkBySlug("test-slug");

      expect(retrieved).toBeDefined();
      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.slug).toBe("test-slug");
    });

    it("should return null for non-existent slug", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      const retrieved = await getCustomLinkBySlug("non-existent");
      expect(retrieved).toBeNull();
    });
  });

  describe("getAllCustomLinks", () => {
    it("should return all custom links ordered by creation date", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      const link1 = await createCustomLink({
        slug: "link-1",
        email: "test1@example.com",
        token: "token-1",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      // Small delay to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));

      const link2 = await createCustomLink({
        slug: "link-2",
        email: "test2@example.com",
        token: "token-2",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      const links = await getAllCustomLinks();

      expect(links.length).toBeGreaterThanOrEqual(2);
      // Should be ordered by createdAt descending (newest first)
      const link2Index = links.findIndex((l) => l.id === link2.id);
      const link1Index = links.findIndex((l) => l.id === link1.id);
      expect(link2Index).toBeLessThan(link1Index);
    });

    it("should return empty array when no links exist", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      const links = await getAllCustomLinks();
      expect(links).toEqual([]);
    });
  });

  describe("Link expiration", () => {
    it("should handle expired links", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      const link = await createCustomLink({
        slug: "expired-link",
        email: "test@example.com",
        token: "token-123",
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      });

      // Wait a bit to ensure the database has committed the transaction
      await new Promise((resolve) => setTimeout(resolve, 100));

      const retrieved = await getCustomLinkBySlug("expired-link");
      expect(retrieved).toBeDefined();
      expect(retrieved).not.toBeNull();
      expect(retrieved?.expiresAt).toBeDefined();
      expect(retrieved?.expiresAt).toBeInstanceOf(Date);
      expect(retrieved?.expiresAt.getTime()).toBeLessThan(Date.now());
      expect(retrieved?.id).toBe(link.id);
      expect(retrieved?.slug).toBe("expired-link");
      expect(retrieved?.email).toBe("test@example.com");
      expect(retrieved?.token).toBe("token-123");
      expect(retrieved?.firstName).toBeNull();
      expect(retrieved?.lastName).toBeNull();
      expect(retrieved?.organizationName).toBeNull();
      expect(retrieved?.organizationWebsite).toBeNull();
    });

    it("should handle future expiration dates", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      const futureDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days
      const link = await createCustomLink({
        slug: "future-link",
        email: "test@example.com",
        token: "token-123",
        expiresAt: futureDate,
      });

      // Wait a bit to ensure the database has committed the transaction
      await new Promise((resolve) => setTimeout(resolve, 100));

      const retrieved = await getCustomLinkBySlug("future-link");
      expect(retrieved).toBeDefined();
      expect(retrieved).not.toBeNull();
      expect(retrieved?.expiresAt).toBeDefined();
      expect(retrieved?.expiresAt).toBeInstanceOf(Date);
      expect(retrieved?.expiresAt.getTime()).toBeGreaterThan(Date.now());
      expect(retrieved?.id).toBe(link.id);
      expect(retrieved?.slug).toBe("future-link");
      expect(retrieved?.email).toBe("test@example.com");
      expect(retrieved?.token).toBe("token-123");
      expect(retrieved?.firstName).toBeNull();
      expect(retrieved?.lastName).toBeNull();
      expect(retrieved?.organizationName).toBeNull();
      expect(retrieved?.organizationWebsite).toBeNull();
    });
  });

  describe("Slug uniqueness", () => {
    it("should enforce unique slugs", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      await createCustomLink({
        slug: "unique-slug",
        email: "test1@example.com",
        token: "token-1",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      // Try to create another link with same slug - should fail
      await expect(
        createCustomLink({
          slug: "unique-slug",
          email: "test2@example.com",
          token: "token-2",
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        })
      ).rejects.toThrow();
    });
  });
});
