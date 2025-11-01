import { getDB } from "../client";
import { adminDashboardSections } from "../schema/schema.tables";
import { eq } from "drizzle-orm";

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
  { sectionKey: "pendingUsers", displayOrder: 1, enabled: true },
  { sectionKey: "blog", displayOrder: 2, enabled: true },
  { sectionKey: "intakes", displayOrder: 3, enabled: true },
  { sectionKey: "emails", displayOrder: 4, enabled: true },
  { sectionKey: "workExperience", displayOrder: 5, enabled: true },
  { sectionKey: "projects", displayOrder: 6, enabled: true },
  { sectionKey: "skills", displayOrder: 7, enabled: true },
  { sectionKey: "education", displayOrder: 8, enabled: true },
  { sectionKey: "certifications", displayOrder: 9, enabled: true },
];

/**
 * Initialize default sections if none exist
 */
export async function initializeDashboardSections(): Promise<void> {
  const db = await getDB();

  try {
    const existing = await db.query.adminDashboardSections.findMany();
    if (existing.length > 0) {
      return; // Already initialized
    }
  } catch {
    // Table doesn't exist yet - we'll let the migration handle it
    // Just return silently to avoid breaking the app
    console.warn("Dashboard sections table not found. Please run migrations.");
    return;
  }

  try {
    await db.insert(adminDashboardSections).values(
      DEFAULT_SECTIONS.map((section) => ({
        sectionKey: section.sectionKey,
        displayOrder: section.displayOrder,
        enabled: section.enabled,
      }))
    );
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

  // Initialize if needed (handles missing table gracefully)
  await initializeDashboardSections();

  try {
    const sections = await db.query.adminDashboardSections.findMany({
      orderBy: (sections, { asc }) => [asc(sections.displayOrder)],
      where: (sections, { eq }) => eq(sections.enabled, true),
    });

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
}

/**
 * Get section by key
 */
export async function getSectionByKey(
  sectionKey: string
): Promise<AdminDashboardSection | null> {
  const db = await getDB();

  await initializeDashboardSections();

  const section = await db.query.adminDashboardSections.findFirst({
    where: eq(adminDashboardSections.sectionKey, sectionKey),
  });

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
