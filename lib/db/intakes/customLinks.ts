import { getDB } from "../client";
import { customIntakeLinks } from "../schema/schema.tables";
import { eq } from "drizzle-orm";

export interface CreateCustomLinkInput {
  slug: string;
  email: string;
  token: string;
  firstName?: string;
  lastName?: string;
  organizationName?: string;
  organizationWebsite?: string;
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
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export async function createCustomLink(
  input: CreateCustomLinkInput
): Promise<CustomLink> {
  const db = await getDB();

  const [link] = await db
    .insert(customIntakeLinks)
    .values({
      slug: input.slug,
      email: input.email,
      token: input.token,
      firstName: input.firstName || null,
      lastName: input.lastName || null,
      organizationName: input.organizationName || null,
      organizationWebsite: input.organizationWebsite || null,
      expiresAt: input.expiresAt,
    })
    .returning();

  return {
    id: link.id,
    slug: link.slug,
    email: link.email,
    token: link.token,
    firstName: link.firstName,
    lastName: link.lastName,
    organizationName: link.organizationName,
    organizationWebsite: link.organizationWebsite,
    expiresAt: link.expiresAt,
    createdAt: link.createdAt,
    updatedAt: link.updatedAt,
  };
}

export async function getCustomLinkBySlug(
  slug: string
): Promise<CustomLink | null> {
  const db = await getDB();

  const link = await db.query.customIntakeLinks.findFirst({
    where: eq(customIntakeLinks.slug, slug),
  });

  if (!link) return null;

  return {
    id: link.id,
    slug: link.slug,
    email: link.email,
    token: link.token,
    firstName: link.firstName,
    lastName: link.lastName,
    organizationName: link.organizationName,
    organizationWebsite: link.organizationWebsite,
    expiresAt: link.expiresAt,
    createdAt: link.createdAt,
    updatedAt: link.updatedAt,
  };
}

export async function getAllCustomLinks(): Promise<CustomLink[]> {
  const db = await getDB();

  const links = await db.query.customIntakeLinks.findMany({
    orderBy: (links, { desc }) => [desc(links.createdAt)],
  });

  return links.map((link) => ({
    id: link.id,
    slug: link.slug,
    email: link.email,
    token: link.token,
    firstName: link.firstName,
    lastName: link.lastName,
    organizationName: link.organizationName,
    organizationWebsite: link.organizationWebsite,
    expiresAt: link.expiresAt,
    createdAt: link.createdAt,
    updatedAt: link.updatedAt,
  }));
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
