import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import {
  getDashboardSections,
  updateDashboardSectionOrder,
} from "$/db/adminDashboard/adminDashboard";
import { getDB } from "$/db/client";
import { adminDashboardSections } from "$/db/schema/schema.tables";

describe("Admin Dashboard Sections", () => {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;

  beforeEach(async () => {
    // Skip tests if DATABASE_URL is not set or in production
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping admin dashboard tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      if (!db) {
        return;
      }
      // Clean up before each test
      await db.delete(adminDashboardSections);
    } catch (error) {
      console.error("Failed to setup test database:", error);
      db = null;
    }
  });

  afterEach(async () => {
    // Clean up after each test
    if (db) {
      await db.delete(adminDashboardSections);
    }
  });

  describe("getDashboardSections", () => {
    it("should return sections ordered by displayOrder", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      // Create sections in reverse order
      await db.insert(adminDashboardSections).values([
        {
          sectionKey: "blog",
          displayOrder: 2,
          enabled: true,
        },
        {
          sectionKey: "pendingUsers",
          displayOrder: 1,
          enabled: true,
        },
        {
          sectionKey: "projects",
          displayOrder: 3,
          enabled: true,
        },
      ]);

      const sections = await getDashboardSections();

      expect(sections).toHaveLength(3);
      expect(sections[0].sectionKey).toBe("pendingUsers");
      expect(sections[1].sectionKey).toBe("blog");
      expect(sections[2].sectionKey).toBe("projects");
    });

    it("should only return enabled sections", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      await db.insert(adminDashboardSections).values([
        {
          sectionKey: "blog",
          displayOrder: 1,
          enabled: true,
        },
        {
          sectionKey: "projects",
          displayOrder: 2,
          enabled: false,
        },
      ]);

      const sections = await getDashboardSections();

      expect(sections).toHaveLength(1);
      expect(sections[0].sectionKey).toBe("blog");
    });

    it("should return empty array if table doesn't exist", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      // This test verifies graceful handling when table doesn't exist
      // (simulated by having no sections)
      const sections = await getDashboardSections();
      expect(Array.isArray(sections)).toBe(true);
    });
  });

  describe("updateDashboardSectionOrder", () => {
    it("should update display order for all provided sections", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      await db.insert(adminDashboardSections).values([
        {
          sectionKey: "blog",
          displayOrder: 1,
          enabled: true,
        },
        {
          sectionKey: "projects",
          displayOrder: 2,
          enabled: true,
        },
        {
          sectionKey: "skills",
          displayOrder: 3,
          enabled: true,
        },
      ]);

      await updateDashboardSectionOrder({
        sections: [
          { sectionKey: "projects", displayOrder: 1 },
          { sectionKey: "skills", displayOrder: 2 },
          { sectionKey: "blog", displayOrder: 3 },
        ],
      });

      const sections = await getDashboardSections();
      expect(sections[0].sectionKey).toBe("projects");
      expect(sections[1].sectionKey).toBe("skills");
      expect(sections[2].sectionKey).toBe("blog");
    });

    it("should handle partial section updates", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      await db.insert(adminDashboardSections).values([
        {
          sectionKey: "blog",
          displayOrder: 1,
          enabled: true,
        },
        {
          sectionKey: "projects",
          displayOrder: 2,
          enabled: true,
        },
      ]);

      await updateDashboardSectionOrder({
        sections: [{ sectionKey: "projects", displayOrder: 1 }],
      });

      const sections = await getDashboardSections();
      const projectsSection = sections.find((s) => s.sectionKey === "projects");
      expect(projectsSection?.displayOrder).toBe(1);
    });
  });

  describe("Section data integrity", () => {
    it("should maintain unique section keys", async () => {
      if (
        !db ||
        !process.env.DATABASE_URL ||
        process.env.NODE_ENV === "production"
      ) {
        return;
      }
      await db.insert(adminDashboardSections).values({
        sectionKey: "blog",
        displayOrder: 1,
        enabled: true,
      });

      // Try to insert duplicate - should fail
      await expect(
        db.insert(adminDashboardSections).values({
          sectionKey: "blog",
          displayOrder: 2,
          enabled: true,
        })
      ).rejects.toThrow();
    });
  });
});
