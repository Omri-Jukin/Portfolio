import { DbClient, getDB } from "../client";
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

  // Handle build-time scenarios where db might be null
  if (!db) {
    console.warn(
      "Database not available during build, skipping dashboard initialization"
    );
    return;
  }

  try {
    // Type assertion: we know it's a valid Drizzle client
    const dbClient = db as DbClient;
    const existing =
      await // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Type assertion needed for build-time handling
      ((dbClient as any).query as any).adminDashboardSections.findMany({
        orderBy: (
          sections: typeof adminDashboardSections,
          {
            asc,
          }: {
            asc: (
              column: typeof adminDashboardSections.displayOrder
            ) => unknown;
          }
        ) => [asc(sections.displayOrder)],
        where: (
          sections: typeof adminDashboardSections,
          {
            eq,
          }: {
            eq: (
              column: typeof adminDashboardSections.enabled,
              value: boolean
            ) => unknown;
          }
        ) => eq(sections.enabled, true),
      });
    if (existing.length > 0) {
      return; // Already initialized
    }
    await (db as DbClient).insert(adminDashboardSections).values(
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
    if (!("query" in db)) {
      throw new Error(
        "Database connection unavailable. Please try again later."
      );
    }
    // Type assertion: after null/query checks, we know it's a valid Drizzle client
    const sections =
      await // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Type assertion needed for build-time handling
      ((db as any).query as any).adminDashboardSections.findMany({
        orderBy: (
          sections: typeof adminDashboardSections,
          {
            asc,
          }: {
            asc: (
              column: typeof adminDashboardSections.displayOrder
            ) => unknown;
          }
        ) => [asc(sections.displayOrder)],
        where: (
          sections: typeof adminDashboardSections,
          {
            eq,
          }: {
            eq: (
              column: typeof adminDashboardSections.enabled,
              value: boolean
            ) => unknown;
          }
        ) => eq(sections.enabled, true),
      });

    return sections.map((section: typeof adminDashboardSections) => ({
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
  if (!db || !("query" in db)) {
    console.warn(
      "Database not available during build, skipping dashboard section order update"
    );
    return;
  }

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

  // Handle build-time scenarios where db might be null
  if (!db || !("query" in db)) {
    console.warn(
      "Database not available during build, skipping section lookup"
    );
    return null;
  }

  await initializeDashboardSections();

  // Type assertion: after null/query checks, we know it's a valid Drizzle client
  const section =
    await // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Type assertion needed for build-time handling
    ((db as any).query as any).adminDashboardSections.findFirst({
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
