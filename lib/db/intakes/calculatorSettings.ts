import { calculatorSettings } from "../schema/schema.tables";
import { eq, desc } from "drizzle-orm";
import { getDB } from "../client";

export type CalculatorSettingType =
  | "base_rate"
  | "feature_cost"
  | "multiplier"
  | "page_cost"
  | "meta";

export type CreateCalculatorSettingInput = {
  settingType: CalculatorSettingType;
  settingKey: string;
  settingValue: number | Record<string, number | string>;
  displayName: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
};

export type UpdateCalculatorSettingInput = Partial<
  Omit<CreateCalculatorSettingInput, "settingType" | "settingKey">
> & {
  settingType?: CalculatorSettingType;
  settingKey?: string;
};

export const createCalculatorSetting = async (
  input: CreateCalculatorSettingInput
) => {
  const dbClient = await getDB();

  const newSetting = await dbClient
    .insert(calculatorSettings)
    .values({
      settingType: input.settingType,
      settingKey: input.settingKey,
      settingValue: input.settingValue as unknown as Record<string, unknown>,
      displayName: input.displayName,
      description: input.description || null,
      displayOrder: input.displayOrder ?? 0,
      isActive: input.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!newSetting.length) {
    throw new Error("Failed to create calculator setting.");
  }

  return newSetting[0];
};

export const getCalculatorSettings = async (includeInactive = false) => {
  const dbClient = await getDB();

  if (includeInactive) {
    return dbClient
      .select()
      .from(calculatorSettings)
      .orderBy(
        desc(calculatorSettings.displayOrder),
        desc(calculatorSettings.createdAt)
      );
  }

  return dbClient
    .select()
    .from(calculatorSettings)
    .where(eq(calculatorSettings.isActive, true))
    .orderBy(
      desc(calculatorSettings.displayOrder),
      desc(calculatorSettings.createdAt)
    );
};

export const getCalculatorSettingById = async (id: string) => {
  const dbClient = await getDB();

  const setting = await dbClient
    .select()
    .from(calculatorSettings)
    .where(eq(calculatorSettings.id, id))
    .limit(1);

  if (!setting.length) {
    throw new Error("Calculator setting not found.");
  }

  return setting[0];
};

export const updateCalculatorSetting = async (
  id: string,
  input: UpdateCalculatorSettingInput
) => {
  const dbClient = await getDB();

  const updateData: {
    settingType?: string;
    settingKey?: string;
    settingValue?: Record<string, unknown>;
    displayName?: string;
    description?: string | null;
    displayOrder?: number;
    isActive?: boolean;
    updatedAt: Date;
  } = {
    updatedAt: new Date(),
  };

  if (input.settingType !== undefined)
    updateData.settingType = input.settingType;
  if (input.settingKey !== undefined) updateData.settingKey = input.settingKey;
  if (input.settingValue !== undefined)
    updateData.settingValue = input.settingValue as unknown as Record<
      string,
      unknown
    >;
  if (input.displayName !== undefined)
    updateData.displayName = input.displayName;
  if (input.description !== undefined)
    updateData.description = input.description || null;
  if (input.displayOrder !== undefined)
    updateData.displayOrder = input.displayOrder;
  if (input.isActive !== undefined) updateData.isActive = input.isActive;

  const updated = await dbClient
    .update(calculatorSettings)
    .set(updateData)
    .where(eq(calculatorSettings.id, id))
    .returning();

  if (!updated.length) {
    throw new Error("Calculator setting not found or update failed.");
  }

  return updated[0];
};

export const deleteCalculatorSetting = async (id: string) => {
  const dbClient = await getDB();

  const deleted = await dbClient
    .delete(calculatorSettings)
    .where(eq(calculatorSettings.id, id))
    .returning();

  if (!deleted.length) {
    throw new Error("Calculator setting not found.");
  }

  return deleted[0];
};

export const deleteAllCalculatorSettings = async () => {
  const dbClient = await getDB();

  const deleted = await dbClient.delete(calculatorSettings).returning();

  return deleted;
};
