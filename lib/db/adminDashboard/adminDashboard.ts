import { DbClient, getDB } from "../client";
import { adminDashboardSections } from "../schema/schema.tables";
import { asc, eq } from "drizzle-orm";

export interface AdminDashboardSection {
  id: string;
  sectionKey: string;
  displayOrder: number;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateSectionOrderInput {
  sections: Array<{ sectionKey: string; displayOrder: number }>;
}

// Default sections in default order
export const DEFAULT_SECTIONS = [
  { sectionKey: "publicContent", displayOrder: 1, enabled: true },
  { sectionKey: "resumePdf", displayOrder: 2, enabled: true },
  { sectionKey: "projects", displayOrder: 3, enabled: true },
  { sectionKey: "workExperience", displayOrder: 4, enabled: true },
  { sectionKey: "skills", displayOrder: 5, enabled: true },
  { sectionKey: "blog", displayOrder: 6, enabled: true },
  { sectionKey: "roles", displayOrder: 7, enabled: true },
  { sectionKey: "calculatorSettings", displayOrder: 8, enabled: true },
  { sectionKey: "pricing", displayOrder: 9, enabled: true },
  { sectionKey: "discounts", displayOrder: 10, enabled: true },
  { sectionKey: "intakes", displayOrder: 11, enabled: true },
  { sectionKey: "contactInquiries", displayOrder: 12, enabled: true },
  { sectionKey: "emails", displayOrder: 13, enabled: true },
  { sectionKey: "education", displayOrder: 14, enabled: true },
  { sectionKey: "certifications", displayOrder: 15, enabled: true },
];

/**
 * Initialize default sections if none exist, and add any missing sections
 */
export async function initializeDashboardSections(): Promise<void> {
  const db = await getDB();

  // Handle build-time scenarios where db might be null
  if (!db) {
    console.warn(
      "Database not available during build, skipping dashboard initialization"
    );
    return;
  }

  try {
    const existing = await (db as DbClient)
      .select({ sectionKey: adminDashboardSections.sectionKey })
      .from(adminDashboardSections);

    if (existing.length === 0) {
      // No sections exist, insert all defaults
      await (db as DbClient).insert(adminDashboardSections).values(
        DEFAULT_SECTIONS.map((section) => ({
          sectionKey: section.sectionKey,
          displayOrder: section.displayOrder,
          enabled: section.enabled,
        }))
      );
      return;
    }

    // Some sections exist - check for missing ones and add them
    const existingKeys = new Set(existing.map((s) => s.sectionKey));
    const missingSections = DEFAULT_SECTIONS.filter(
      (section) => !existingKeys.has(section.sectionKey)
    );

    if (missingSections.length > 0) {
      await (db as DbClient).insert(adminDashboardSections).values(
        missingSections.map((section) => ({
          sectionKey: section.sectionKey,
          displayOrder: section.displayOrder,
          enabled: section.enabled,
        }))
      );
      console.log(
        `Added ${missingSections.length} missing dashboard sections:`,
        missingSections.map((s) => s.sectionKey).join(", ")
      );
    }
  } catch (error) {
    // Table might not exist - log but don't throw
    console.warn("Failed to initialize dashboard sections:", error);
  }
}

/**
 * Get all dashboard sections ordered by displayOrder
 */
export async function getDashboardSections(): Promise<AdminDashboardSection[]> {
  const db = await getDB();

  // Handle build-time scenarios where db might be null
  if (!db) {
    console.warn(
      "Database not available during build, returning empty dashboard sections"
    );
    return [];
  }

  // Initialize if needed (handles missing table gracefully)
  await initializeDashboardSections();

  try {
    const sections = await (db as DbClient)
      .select()
      .from(adminDashboardSections)
      .where(eq(adminDashboardSections.enabled, true))
      .orderBy(asc(adminDashboardSections.displayOrder));

    return sections.map((section) => ({
      id: section.id,
      sectionKey: section.sectionKey,
      displayOrder: section.displayOrder,
      enabled: section.enabled,
      createdAt: section.createdAt,
      updatedAt: section.updatedAt,
    }));
  } catch (error) {
    // If table doesn't exist yet, return empty array
    console.warn("Dashboard sections table not found:", error);
    return [];
  }
}

/**
 * Update dashboard section order
 */
export async function updateDashboardSectionOrder(
  input: UpdateSectionOrderInput
): Promise<void> {
  const db = await getDB();

  // Handle build-time scenarios where db might be null
  if (!db) {
    console.warn(
      "Database not available during build, skipping dashboard section order update"
    );
    return;
  }

  try {
    // Update each section's order
    await Promise.all(
      input.sections.map((section) =>
        db
          .update(adminDashboardSections)
          .set({
            displayOrder: section.displayOrder,
            updatedAt: new Date(),
          })
          .where(eq(adminDashboardSections.sectionKey, section.sectionKey))
      )
    );
  } catch (error) {
    console.error("Failed to update dashboard section order:", error);
    throw error;
  }
}

/**
 * Get section by key
 */
export async function getSectionByKey(
  sectionKey: string
): Promise<AdminDashboardSection | null> {
  const db = await getDB();

  // Handle build-time scenarios where db might be null
  if (!db) {
    console.warn(
      "Database not available during build, skipping section lookup"
    );
    return null;
  }

  await initializeDashboardSections();

  const [section] = await (db as DbClient)
    .select()
    .from(adminDashboardSections)
    .where(eq(adminDashboardSections.sectionKey, sectionKey))
    .limit(1);

  if (!section) return null;

  return {
    id: section.id,
    sectionKey: section.sectionKey,
    displayOrder: section.displayOrder,
    enabled: section.enabled,
    createdAt: section.createdAt,
    updatedAt: section.updatedAt,
  };
}
