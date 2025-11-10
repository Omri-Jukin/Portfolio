import { pricingMeta } from "../schema/schema.tables";
import { eq, asc } from "drizzle-orm";
import { getDB } from "../client";
import { incrementOrdersForConflict } from "../utils/orderUtils";

export const getPricingMeta = async (includeInactive = false) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  if (includeInactive) {
    return db.select().from(pricingMeta).orderBy(asc(pricingMeta.order));
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

export const updatePricingMeta = async (key: string, value: unknown) => {
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

/**
 * Upsert pricing meta - creates if not exists, updates if exists
 */
export const upsertPricingMeta = async (
  key: string,
  value: unknown,
  options?: {
    order?: number;
    isActive?: boolean;
  }
) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  // Try to update first
  const updateResult = await db
    .update(pricingMeta)
    .set({
      value: value as Record<string, unknown>,
      updatedAt: new Date(),
      ...(options?.order !== undefined && { order: options.order }),
      ...(options?.isActive !== undefined && { isActive: options.isActive }),
    })
    .where(eq(pricingMeta.key, key))
    .returning();

  if (updateResult.length > 0) {
    return updateResult[0];
  }

  // If update didn't find anything, create it
  const newOrder = options?.order ?? 0;

  // Increment orders for conflicts
  await incrementOrdersForConflict(
    db,
    pricingMeta,
    pricingMeta.order,
    newOrder
  );

  const insertResult = await db
    .insert(pricingMeta)
    .values({
      key,
      value: value as Record<string, unknown>,
      order: newOrder,
      isActive: options?.isActive ?? true,
    })
    .returning();

  return insertResult[0];
};
