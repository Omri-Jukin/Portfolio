import {
  pricingMultiplierGroups,
  pricingMultiplierValues,
} from "../schema/schema.tables";
import { eq, asc, and } from "drizzle-orm";
import { getDB } from "../client";
import type {
  NewPricingMultiplierGroup,
  NewPricingMultiplierValue,
} from "../schema/schema.tables";

// Groups
export const createPricingMultiplierGroup = async (
  input: NewPricingMultiplierGroup
) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  const result = await db
    .insert(pricingMultiplierGroups)
    .values({
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!result.length) throw new Error("Failed to create multiplier group");
  return result[0];
};

export const getPricingMultiplierGroups = async (includeInactive = false) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  if (includeInactive) {
    return db
      .select()
      .from(pricingMultiplierGroups)
      .orderBy(asc(pricingMultiplierGroups.order));
  }

  return db
    .select()
    .from(pricingMultiplierGroups)
    .where(eq(pricingMultiplierGroups.isActive, true))
    .orderBy(asc(pricingMultiplierGroups.order));
};

export const updatePricingMultiplierGroup = async (
  id: string,
  input: Partial<NewPricingMultiplierGroup>
) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  const result = await db
    .update(pricingMultiplierGroups)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(pricingMultiplierGroups.id, id))
    .returning();

  if (!result.length) throw new Error("Multiplier group not found");
  return result[0];
};

export const deletePricingMultiplierGroup = async (id: string) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  // Also delete all values in this group
  const group = await db
    .select()
    .from(pricingMultiplierGroups)
    .where(eq(pricingMultiplierGroups.id, id))
    .limit(1);

  if (!group.length) throw new Error("Multiplier group not found");

  await db
    .delete(pricingMultiplierValues)
    .where(eq(pricingMultiplierValues.groupKey, group[0].key));

  const result = await db
    .delete(pricingMultiplierGroups)
    .where(eq(pricingMultiplierGroups.id, id))
    .returning();

  return result[0];
};

// Values
export const createPricingMultiplierValue = async (
  input: NewPricingMultiplierValue
) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  const result = await db
    .insert(pricingMultiplierValues)
    .values({
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!result.length) throw new Error("Failed to create multiplier value");
  return result[0];
};

export const getPricingMultiplierValuesByGroup = async (
  groupKey: string,
  includeInactive = false
) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  if (includeInactive) {
    return db
      .select()
      .from(pricingMultiplierValues)
      .where(eq(pricingMultiplierValues.groupKey, groupKey))
      .orderBy(asc(pricingMultiplierValues.order));
  }

  return db
    .select()
    .from(pricingMultiplierValues)
    .where(
      and(
        eq(pricingMultiplierValues.groupKey, groupKey),
        eq(pricingMultiplierValues.isActive, true)
      )
    )
    .orderBy(asc(pricingMultiplierValues.order));
};

export const updatePricingMultiplierValue = async (
  id: string,
  input: Partial<NewPricingMultiplierValue>
) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  const result = await db
    .update(pricingMultiplierValues)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(pricingMultiplierValues.id, id))
    .returning();

  if (!result.length) throw new Error("Multiplier value not found");
  return result[0];
};

export const deletePricingMultiplierValue = async (id: string) => {
  const db = await getDB();
  if (!db) throw new Error("Database not available");

  const result = await db
    .delete(pricingMultiplierValues)
    .where(eq(pricingMultiplierValues.id, id))
    .returning();

  if (!result.length) throw new Error("Multiplier value not found");
  return result[0];
};

