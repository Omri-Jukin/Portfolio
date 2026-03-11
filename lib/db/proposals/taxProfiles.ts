import { taxProfiles } from "../schema/schema.tables";
import { eq, desc } from "drizzle-orm";
import { getDB } from "../client";

export type CreateTaxProfileInput = {
  name: string;
  description?: string | null;
  taxLines: unknown;
  isDefault?: boolean;
};

export type UpdateTaxProfileInput = Partial<
  Omit<CreateTaxProfileInput, "name">
> & {
  id: string;
};

export const createTaxProfile = async (input: CreateTaxProfileInput) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  // If setting as default, unset other defaults
  if (input.isDefault) {
    await dbClient
      .update(taxProfiles)
      .set({ isDefault: false })
      .where(eq(taxProfiles.isDefault, true));
  }

  const newProfile = await dbClient
    .insert(taxProfiles)
    .values({
      name: input.name,
      description: input.description || null,
      taxLines: input.taxLines as never,
      isDefault: input.isDefault || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!newProfile.length) {
    throw new Error("Failed to create tax profile.");
  }

  return newProfile[0];
};

export const getTaxProfiles = async () => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const profiles = await dbClient
    .select()
    .from(taxProfiles)
    .orderBy(desc(taxProfiles.createdAt));

  return profiles;
};

export const getTaxProfileById = async (id: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const profile = await dbClient
    .select()
    .from(taxProfiles)
    .where(eq(taxProfiles.id, id))
    .limit(1);

  if (!profile.length) {
    throw new Error("Tax profile not found.");
  }

  return profile[0];
};

export const updateTaxProfile = async (input: UpdateTaxProfileInput) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const { id, isDefault, ...updateData } = input;

  // If setting as default, unset other defaults
  if (isDefault) {
    await dbClient
      .update(taxProfiles)
      .set({ isDefault: false })
      .where(eq(taxProfiles.isDefault, true));
  }

  const updatedProfile = await dbClient
    .update(taxProfiles)
    .set({
      ...updateData,
      isDefault: isDefault ?? undefined,
      updatedAt: new Date(),
    })
    .where(eq(taxProfiles.id, id))
    .returning();

  if (!updatedProfile.length) {
    throw new Error("Tax profile not found.");
  }

  return updatedProfile[0];
};

export const deleteTaxProfile = async (id: string) => {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  await dbClient.delete(taxProfiles).where(eq(taxProfiles.id, id));
};
