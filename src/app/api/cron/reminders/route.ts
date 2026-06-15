import { NextResponse } from "next/server";
import {
  getIntakesWithDueReminders,
  getIntakesWithReminders,
  markReminderAsSent,
} from "#/lib/db/intakes/reminders";
import { sendReminderEmail } from "#/lib/email/reminderEmail";

/**
 * Cron job endpoint to check and send reminder emails.
 *
 * Production requires `CRON_SECRET` and callers must send it in
 * `X-Cron-Auth`. Do not trust schedule/vendor-looking request headers here:
 * regular clients can spoof those headers.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("X-Cron-Auth");
  const cronSecret = process.env.CRON_SECRET;
  const isDevelopment = process.env.NODE_ENV !== "production";

  if (!cronSecret) {
    if (!isDevelopment) {
      return NextResponse.json(
        { error: "CRON_SECRET is required in production." },
        { status: 503 }
      );
    }

    console.warn("CRON_SECRET is not configured. Allowing cron in development.");
  } else if (!authHeader || authHeader !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const dueIntakes = await getIntakesWithDueReminders();

    if (dueIntakes.length === 0) {
      const allReminders = await getIntakesWithReminders("all");
      const upcomingReminders = allReminders.filter(
        (reminder) => new Date(reminder.reminderDate) > new Date()
      );

      return NextResponse.json({
        success: true,
        message: "No reminders due",
        count: 0,
        debug: isDevelopment
          ? {
              totalReminders: allReminders.length,
              upcomingReminders: upcomingReminders.length,
              note:
                upcomingReminders.length > 0
                  ? `You have ${upcomingReminders.length} reminder(s) set for the future. Set a reminder date in the past or current time to test.`
                  : "No reminders are set.",
            }
          : undefined,
      });
    }

    const results = await Promise.allSettled(
      dueIntakes.map(
        async (intake: {
          id: string;
          email: string;
          reminderDate: Date;
          status: string;
          data: Record<string, unknown>;
        }) => {
          const emailResult = await sendReminderEmail({
            id: intake.id,
            email: intake.email,
            reminderDate: intake.reminderDate,
            status: intake.status,
            data: intake.data,
          });

          if (emailResult.success) {
            await markReminderAsSent(intake.id);
          }

          return {
            intakeId: intake.id,
            success: emailResult.success,
            error: emailResult.error,
          };
        }
      )
    );

    const successful = results.filter(
      (result) => result.status === "fulfilled" && result.value.success
    ).length;
    const failed = results.filter(
      (result) =>
        result.status === "rejected" ||
        (result.status === "fulfilled" && !result.value.success)
    ).length;

    return NextResponse.json({
      success: true,
      message: `Processed ${dueIntakes.length} reminders`,
      sent: successful,
      failed,
      results: results.map((result) =>
        result.status === "fulfilled"
          ? result.value
          : { error: "Failed to process" }
      ),
    });
  } catch (error) {
    console.error("Error processing reminders:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
