import { pricingProjectTypes } from "../schema/schema.tables";
import { eq, asc } from "drizzle-orm";
import { getDB } from "../client";
import type { NewPricingProjectType } from "../schema/schema.tables";

export const createPricingProjectType = async (
  input: NewPricingProjectType
) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  const result = await db
    .insert(pricingProjectTypes)
    .values({
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!result.length) throw new Error("Failed to create project type");
  return result[0];
};

export const getPricingProjectTypes = async (includeInactive = false) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  if (includeInactive) {
    return db
      .select()
      .from(pricingProjectTypes)
      .orderBy(asc(pricingProjectTypes.order));
  }

  return db
    .select()
    .from(pricingProjectTypes)
    .where(eq(pricingProjectTypes.isActive, true))
    .orderBy(asc(pricingProjectTypes.order));
};

export const getPricingProjectTypeById = async (id: string) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(pricingProjectTypes)
    .where(eq(pricingProjectTypes.id, id))
    .limit(1);

  if (!result.length) throw new Error("Project type not found");
  return result[0];
};

export const updatePricingProjectType = async (
  id: string,
  input: Partial<NewPricingProjectType>
) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  const result = await db
    .update(pricingProjectTypes)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(pricingProjectTypes.id, id))
    .returning();

  if (!result.length) throw new Error("Project type not found");
  return result[0];
};

export const deletePricingProjectType = async (id: string) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  const result = await db
    .delete(pricingProjectTypes)
    .where(eq(pricingProjectTypes.id, id))
    .returning();

  if (!result.length) throw new Error("Project type not found");
  return result[0];
};

export const togglePricingProjectTypeActive = async (
  id: string,
  isActive: boolean
) => {
  return updatePricingProjectType(id, { isActive });
};

