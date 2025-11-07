import { pricingMeta } from "../schema/schema.tables";
import { eq, asc } from "drizzle-orm";
import { getDB } from "../client";

export const getPricingMeta = async (includeInactive = false) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  if (includeInactive) {
    return db
      .select()
      .from(pricingMeta)
      .orderBy(asc(pricingMeta.order));
  }

  return db
    .select()
    .from(pricingMeta)
    .where(eq(pricingMeta.isActive, true))
    .orderBy(asc(pricingMeta.order));
};

export const getPricingMetaByKey = async (key: string) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(pricingMeta)
    .where(eq(pricingMeta.key, key))
    .limit(1);

  if (!result.length) throw new Error(`Meta setting '${key}' not found`);
  return result[0];
};

export const updatePricingMeta = async (
  key: string,
  value: unknown
) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  const result = await db
    .update(pricingMeta)
    .set({
      value: value as Record<string, unknown>,
      updatedAt: new Date(),
    })
    .where(eq(pricingMeta.key, key))
    .returning();

  if (!result.length) throw new Error(`Meta setting '${key}' not found`);
  return result[0];
};

