import { pricingFeatures } from "../schema/schema.tables";
import { eq, asc } from "drizzle-orm";
import { getDB } from "../client";
import type { NewPricingFeature } from "../schema/schema.tables";

export const createPricingFeature = async (input: NewPricingFeature) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  const result = await db
    .insert(pricingFeatures)
    .values({
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!result.length) throw new Error("Failed to create feature");
  return result[0];
};

export const getPricingFeatures = async (includeInactive = false) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  if (includeInactive) {
    return db
      .select()
      .from(pricingFeatures)
      .orderBy(asc(pricingFeatures.order));
  }

  return db
    .select()
    .from(pricingFeatures)
    .where(eq(pricingFeatures.isActive, true))
    .orderBy(asc(pricingFeatures.order));
};

export const getPricingFeatureById = async (id: string) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(pricingFeatures)
    .where(eq(pricingFeatures.id, id))
    .limit(1);

  if (!result.length) throw new Error("Feature not found");
  return result[0];
};

export const updatePricingFeature = async (
  id: string,
  input: Partial<NewPricingFeature>
) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  const result = await db
    .update(pricingFeatures)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(pricingFeatures.id, id))
    .returning();

  if (!result.length) throw new Error("Feature not found");
  return result[0];
};

export const deletePricingFeature = async (id: string) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  const result = await db
    .delete(pricingFeatures)
    .where(eq(pricingFeatures.id, id))
    .returning();

  if (!result.length) throw new Error("Feature not found");
  return result[0];
};

export const togglePricingFeatureActive = async (
  id: string,
  isActive: boolean
) => {
  return updatePricingFeature(id, { isActive });
};

