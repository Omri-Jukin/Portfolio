import { intakes } from "../schema/schema.tables";
import { lte, and, isNotNull } from "drizzle-orm";
import { getDB } from "../client";

/**
 * Get intakes with reminders that are due (reminder date <= now)
 */
export async function getIntakesWithDueReminders(): Promise<
  Array<{
    id: string;
    email: string;
    reminderDate: Date;
    status: string;
    data: Record<string, unknown>;
  }>
> {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const now = new Date();

  const dueReminders = await dbClient
    .select({
      id: intakes.id,
      email: intakes.email,
      reminderDate: intakes.reminderDate,
      status: intakes.status,
      data: intakes.data,
    })
    .from(intakes)
    .where(
      and(isNotNull(intakes.reminderDate), lte(intakes.reminderDate, now))
    );

  return dueReminders.map((intake) => ({
    id: intake.id,
    email: intake.email,
    reminderDate: intake.reminderDate!,
    status: (intake.status as string) || "unknown",
    data: intake.data as Record<string, unknown>,
  }));
}

/**
 * Get intakes with reminders (upcoming, due, and past)
 */
export async function getIntakesWithReminders(
  filter?: "upcoming" | "due" | "past" | "all"
): Promise<
  Array<{
    id: string;
    email: string;
    reminderDate: Date;
    status: string;
    flagged: boolean;
    data: Record<string, unknown>;
  }>
> {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const now = new Date();
  const results = await dbClient
    .select({
      id: intakes.id,
      email: intakes.email,
      reminderDate: intakes.reminderDate,
      status: intakes.status,
      flagged: intakes.flagged,
      data: intakes.data,
    })
    .from(intakes)
    .where(isNotNull(intakes.reminderDate));

  const filtered = results
    .map((intake) => ({
      id: intake.id,
      email: intake.email,
      reminderDate: intake.reminderDate!,
      status: intake.status as string,
      flagged: intake.flagged,
      data: intake.data as Record<string, unknown>,
    }))
    .filter((intake) => {
      if (!filter || filter === "all") return true;

      const reminderDate = intake.reminderDate;
      const isPast = reminderDate < now;

      if (filter === "past") return isPast;
      if (filter === "due") {
        // Due = within last 24 hours
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return isPast && reminderDate >= dayAgo;
      }
      if (filter === "upcoming") return !isPast;

      return true;
    })
    .sort((a, b) => a.reminderDate.getTime() - b.reminderDate.getTime());

  return filtered;
}

/**
 * Mark reminder as sent (set reminderDateSent field - we'll add this to schema if needed)
 * For now, we'll just return the intakes that need reminders sent
 */
export async function markReminderAsSent(intakeId: string): Promise<void> {
  // In the future, we could add a reminderDateSent field to track which reminders
  // have already been sent. For now, this is a placeholder.
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  // Could update a field like reminderEmailSent: true
  // For now, we'll just log it
  console.log(`Reminder sent for intake ${intakeId}`);
}
