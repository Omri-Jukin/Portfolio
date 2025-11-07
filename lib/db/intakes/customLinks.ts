import { getDB } from "../client";
import { customIntakeLinks } from "../schema/schema.tables";
import { eq, inArray, desc } from "drizzle-orm";

export interface CreateCustomLinkInput {
  slug: string;
  email: string;
  token: string;
  firstName?: string;
  lastName?: string;
  organizationName?: string;
  organizationWebsite?: string;
  hiddenSections?: string[];
  expiresAt: Date;
}

export interface CustomLink {
  id: string;
  slug: string;
  email: string;
  token: string;
  firstName?: string | null;
  lastName?: string | null;
  organizationName?: string | null;
  organizationWebsite?: string | null;
  hiddenSections?: string[] | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export async function createCustomLink(
  input: CreateCustomLinkInput
): Promise<CustomLink> {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;

  try {
    db = await getDB();
  } catch (error) {
    throw new Error(
      `Database connection failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }

  if (!db) {
    throw new Error("Database client is null");
  }

  try {
    const result = await db
      .insert(customIntakeLinks)
      .values({
        slug: input.slug,
        email: input.email,
        token: input.token,
        firstName: input.firstName || null,
        lastName: input.lastName || null,
        organizationName: input.organizationName || null,
        organizationWebsite: input.organizationWebsite || null,
        hiddenSections: input.hiddenSections || [],
        expiresAt: input.expiresAt,
      })
      .returning();

    if (!result || result.length === 0) {
      throw new Error("Failed to create custom link - no data returned");
    }

    const link = result[0];

    return {
      id: link.id,
      slug: link.slug,
      email: link.email,
      token: link.token,
      firstName: link.firstName,
      lastName: link.lastName,
      organizationName: link.organizationName,
      organizationWebsite: link.organizationWebsite,
      hiddenSections: (link.hiddenSections as string[]) || null,
      expiresAt: link.expiresAt,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    };
  } catch (error) {
    // Check if it's a unique constraint violation
    if (
      error instanceof Error &&
      (error.message.includes("unique") ||
        error.message.includes("duplicate") ||
        error.message.includes("violates unique constraint"))
    ) {
      throw new Error(`Custom link with slug "${input.slug}" already exists`);
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(
      `Failed to create custom link with slug "${input.slug}": ${errorMessage}`
    );
  }
}

export async function getCustomLinkBySlug(
  slug: string
): Promise<CustomLink | null> {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;

  try {
    db = await getDB();
  } catch (error) {
    throw new Error(
      `Database connection failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }

  if (!db) {
    throw new Error("Database client is null");
  }

  try {
    const result = await db
      .select()
      .from(customIntakeLinks)
      .where(eq(customIntakeLinks.slug, slug))
      .limit(1);

    if (!result || result.length === 0) {
      return null;
    }

    const link = result[0];

    return {
      id: link.id,
      slug: link.slug,
      email: link.email,
      token: link.token,
      firstName: link.firstName,
      lastName: link.lastName,
      organizationName: link.organizationName,
      organizationWebsite: link.organizationWebsite,
      hiddenSections: (link.hiddenSections as string[]) || null,
      expiresAt: link.expiresAt,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    };
  } catch (error) {
    // Re-throw with more context for debugging
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;

    // Include stack trace in development for debugging
    if (process.env.NODE_ENV === "development") {
      console.error(`[getCustomLinkBySlug] Error details for slug "${slug}":`, {
        errorMessage,
        errorStack,
        error: error, // Log full error object
      });
    }

    throw new Error(
      `Failed to query custom link by slug "${slug}": ${errorMessage}`
    );
  }
}

export async function getAllCustomLinks(): Promise<CustomLink[]> {
  const db = await getDB();

  // Handle build-time scenarios where db might be null
  if (!db) {
    return [];
  }

  try {
    const links = await db
      .select()
      .from(customIntakeLinks)
      .orderBy(desc(customIntakeLinks.createdAt));

    return links.map((link) => ({
      id: link.id,
      slug: link.slug,
      email: link.email,
      token: link.token,
      firstName: link.firstName,
      lastName: link.lastName,
      organizationName: link.organizationName,
      organizationWebsite: link.organizationWebsite,
      hiddenSections: (link.hiddenSections as string[]) || null,
      expiresAt: link.expiresAt,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    }));
  } catch (error) {
    console.error("Failed to get all custom links:", error);
    return [];
  }
}

/**
 * Delete a custom link by ID
 */
export async function deleteCustomLink(id: string): Promise<boolean> {
  const db = await getDB();

  try {
    const result = await db
      .delete(customIntakeLinks)
      .where(eq(customIntakeLinks.id, id))
      .returning();

    return result.length > 0;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(
      `Failed to delete custom link with id "${id}": ${errorMessage}`
    );
  }
}

/**
 * Delete multiple custom links by IDs
 */
export async function deleteCustomLinks(ids: string[]): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }

  const db = await getDB();

  try {
    const result = await db
      .delete(customIntakeLinks)
      .where(inArray(customIntakeLinks.id, ids))
      .returning();

    return result.length;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to delete custom links: ${errorMessage}`);
  }
}

/**
 * Generate a URL-friendly slug from a name
 * Example: "Shay Regev" -> "shay-regev"
 */
export function generateSlugFromName(
  firstName?: string,
  lastName?: string
): string {
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();

  if (!name) {
    // Fallback to timestamp-based slug if no name
    return `client-${Date.now()}`;
  }

  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
