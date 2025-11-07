import { pricingBaseRates } from "../schema/schema.tables";
import { eq, asc, and, isNull } from "drizzle-orm";
import { getDB } from "../client";
import type { NewPricingBaseRate } from "../schema/schema.tables";

export const createPricingBaseRate = async (input: NewPricingBaseRate) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  const result = await db
    .insert(pricingBaseRates)
    .values({
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!result.length) throw new Error("Failed to create base rate");
  return result[0];
};

export const getPricingBaseRates = async (
  includeInactive = false,
  projectTypeKey?: string,
  clientTypeKey?: string | null
) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  const conditions = [];

  if (!includeInactive) {
    conditions.push(eq(pricingBaseRates.isActive, true));
  }

  if (projectTypeKey !== undefined) {
    conditions.push(eq(pricingBaseRates.projectTypeKey, projectTypeKey));
  }

  if (clientTypeKey !== undefined) {
    if (clientTypeKey === null) {
      conditions.push(isNull(pricingBaseRates.clientTypeKey));
    } else {
      conditions.push(eq(pricingBaseRates.clientTypeKey, clientTypeKey));
    }
  }

  const baseQuery = db.select().from(pricingBaseRates);

  if (conditions.length > 0) {
    return baseQuery
      .where(and(...conditions))
      .orderBy(asc(pricingBaseRates.order));
  }

  return baseQuery.orderBy(asc(pricingBaseRates.order));
};

export const getPricingBaseRateById = async (id: string) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(pricingBaseRates)
    .where(eq(pricingBaseRates.id, id))
    .limit(1);

  if (!result.length) throw new Error("Base rate not found");
  return result[0];
};

export const updatePricingBaseRate = async (
  id: string,
  input: Partial<NewPricingBaseRate>
) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  const result = await db
    .update(pricingBaseRates)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(pricingBaseRates.id, id))
    .returning();

  if (!result.length) throw new Error("Base rate not found");
  return result[0];
};

export const deletePricingBaseRate = async (id: string) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  const result = await db
    .delete(pricingBaseRates)
    .where(eq(pricingBaseRates.id, id))
    .returning();

  if (!result.length) throw new Error("Base rate not found");
  return result[0];
};

export const togglePricingBaseRateActive = async (
  id: string,
  isActive: boolean
) => {
  return updatePricingBaseRate(id, { isActive });
};
