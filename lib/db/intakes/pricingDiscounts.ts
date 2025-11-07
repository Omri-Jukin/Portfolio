import { pricingDiscounts } from "../schema/schema.tables";
import { eq, and, or, sql, isNull, lte, gte } from "drizzle-orm";
import { getDB } from "../client";
import { DiscountType } from "../schema/schema.types";

export type CreatePricingDiscountInput = {
  code: string;
  description?: string;
  discountType: DiscountType;
  amount: string; // numeric as string for Drizzle
  currency?: string;
  appliesTo?: {
    projectTypes?: string[];
    features?: string[];
    clientTypes?: string[];
    excludeClientTypes?: string[];
  };
  startsAt?: Date;
  endsAt?: Date;
  maxUses?: number;
  perUserLimit?: number;
  isActive?: boolean;
};

export type UpdatePricingDiscountInput = Partial<
  Omit<CreatePricingDiscountInput, "code">
> & {
  code?: string;
  appliesTo?: {
    projectTypes?: string[];
    features?: string[];
    clientTypes?: string[];
    excludeClientTypes?: string[];
  };
};

export const createPricingDiscount = async (
  input: CreatePricingDiscountInput
) => {
  const dbClient = await getDB();

  const newDiscount = await dbClient
    .insert(pricingDiscounts)
    .values({
      code: input.code,
      description: input.description || null,
      discountType: input.discountType,
      amount: input.amount,
      currency: input.currency || "ILS",
      appliesTo: input.appliesTo || {},
      startsAt: input.startsAt || null,
      endsAt: input.endsAt || null,
      maxUses: input.maxUses || null,
      usedCount: 0,
      perUserLimit: input.perUserLimit ?? 1,
      isActive: input.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!newDiscount.length) {
    throw new Error("Failed to create pricing discount.");
  }

  return newDiscount[0];
};

export const getPricingDiscounts = async (includeInactive = false) => {
  const dbClient = await getDB();

  if (includeInactive) {
    return dbClient.select().from(pricingDiscounts);
  }

  return dbClient
    .select()
    .from(pricingDiscounts)
    .where(eq(pricingDiscounts.isActive, true));
};

export const getPricingDiscountByCode = async (code: string) => {
  const dbClient = await getDB();

  const discount = await dbClient
    .select()
    .from(pricingDiscounts)
    .where(eq(pricingDiscounts.code, code))
    .limit(1);

  if (!discount.length) {
    throw new Error("Pricing discount not found.");
  }

  return discount[0];
};

export const getActivePricingDiscountByCode = async (code: string) => {
  const dbClient = await getDB();

  const now = new Date();
  const discount = await dbClient
    .select()
    .from(pricingDiscounts)
    .where(
      and(
        eq(pricingDiscounts.code, code),
        eq(pricingDiscounts.isActive, true),
        or(
          isNull(pricingDiscounts.startsAt),
          lte(pricingDiscounts.startsAt, now)
        ),
        or(isNull(pricingDiscounts.endsAt), gte(pricingDiscounts.endsAt, now))
      )
    )
    .limit(1);

  if (!discount.length) {
    throw new Error("Active pricing discount not found.");
  }

  return discount[0];
};

export const updatePricingDiscount = async (
  id: string,
  input: UpdatePricingDiscountInput
) => {
  const dbClient = await getDB();

  const updateData: {
    code?: string;
    description?: string | null;
    discountType?: string;
    amount?: string;
    currency?: string;
    appliesTo?: {
      projectTypes?: string[];
      features?: string[];
      clientTypes?: string[];
      excludeClientTypes?: string[];
    };
    startsAt?: Date | null;
    endsAt?: Date | null;
    maxUses?: number | null;
    perUserLimit?: number;
    isActive?: boolean;
    updatedAt: Date;
  } = {
    updatedAt: new Date(),
  };

  if (input.code !== undefined) updateData.code = input.code;
  if (input.description !== undefined)
    updateData.description = input.description || null;
  if (input.discountType !== undefined)
    updateData.discountType = input.discountType;
  if (input.amount !== undefined) updateData.amount = input.amount;
  if (input.currency !== undefined) updateData.currency = input.currency;
  if (input.appliesTo !== undefined) updateData.appliesTo = input.appliesTo;
  if (input.startsAt !== undefined)
    updateData.startsAt = input.startsAt || null;
  if (input.endsAt !== undefined) updateData.endsAt = input.endsAt || null;
  if (input.maxUses !== undefined) updateData.maxUses = input.maxUses || null;
  if (input.perUserLimit !== undefined)
    updateData.perUserLimit = input.perUserLimit;
  if (input.isActive !== undefined) updateData.isActive = input.isActive;

  const updated = await dbClient
    .update(pricingDiscounts)
    .set(updateData)
    .where(eq(pricingDiscounts.id, id))
    .returning();

  if (!updated.length) {
    throw new Error("Pricing discount not found or update failed.");
  }

  return updated[0];
};

export const incrementDiscountUsage = async (id: string) => {
  const dbClient = await getDB();

  const updated = await dbClient
    .update(pricingDiscounts)
    .set({
      usedCount: sql`${pricingDiscounts.usedCount} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(pricingDiscounts.id, id))
    .returning();

  if (!updated.length) {
    throw new Error("Pricing discount not found.");
  }

  return updated[0];
};

export const deletePricingDiscount = async (id: string) => {
  const dbClient = await getDB();

  const deleted = await dbClient
    .delete(pricingDiscounts)
    .where(eq(pricingDiscounts.id, id))
    .returning();

  if (!deleted.length) {
    throw new Error("Pricing discount not found.");
  }

  return deleted[0];
};
