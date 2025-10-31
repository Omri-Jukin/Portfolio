import { intakes } from "../schema/schema.tables";
import { eq, desc } from "drizzle-orm";
import { getDB } from "../client";

export type CreateIntakeInput = {
  email: string;
  data: Record<string, unknown>;
  proposalMd: string;
};

export const createIntake = async (input: CreateIntakeInput) => {
  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const newIntake = await dbClient
    .insert(intakes)
    .values({
      email: input.email,
      data: input.data,
      proposalMd: input.proposalMd,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (!newIntake.length) {
    throw new Error("Failed to create intake.");
  }

  return newIntake[0];
};

export const getIntakes = async () => {
  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const intakeList = await dbClient
    .select()
    .from(intakes)
    .orderBy(desc(intakes.createdAt));

  return intakeList;
};

export const getIntakeById = async (id: string) => {
  let dbClient: Awaited<ReturnType<typeof getDB>> | null = null;
  try {
    dbClient = await getDB();
  } catch (error) {
    console.error("Failed to get database client:", error);
  }

  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const intake = await dbClient
    .select()
    .from(intakes)
    .where(eq(intakes.id, id))
    .limit(1);

  if (!intake.length) {
    throw new Error("Intake not found.");
  }

  return intake[0];
};
