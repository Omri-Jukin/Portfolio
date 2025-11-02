import { NextResponse } from "next/server";
import {
  getIntakesWithDueReminders,
  getIntakesWithReminders,
  markReminderAsSent,
} from "#/lib/db/intakes/reminders";
import { sendReminderEmail } from "#/lib/email/reminderEmail";

/**
 * Cron job endpoint to check and send reminder emails
 * This should be called by Cloudflare Workers cron trigger
 *
 * Configure in wrangler.jsonc:
 * "triggers": {
 *   "crons": ["0 9 * * *"] // Run daily at 9 AM UTC
 * }
 */
export async function GET(request: Request) {
  // Optional security check for manual testing
  // Cloudflare cron triggers are automatically authenticated by Cloudflare
  // You can set CRON_SECRET to restrict manual access
  const authHeader = request.headers.get("X-Cron-Auth");
  const cronSecret = process.env.CRON_SECRET;

  // Check if this is a Cloudflare cron trigger
  // Cloudflare adds these headers when triggered by cron
  const isCloudflareCron =
    request.headers.get("Cf-Scheduled") === "true" ||
    request.headers.get("cf-scheduled") === "true" ||
    request.headers.get("X-Cloudflare-Scheduled") !== null ||
    request.headers.get("user-agent")?.includes("Cloudflare") ||
    false; // If no headers match, assume manual request

  // Security check for manual requests
  // Cloudflare cron triggers are automatically authenticated, so we skip check for them
  const isDevelopment = process.env.NODE_ENV !== "production";

  if (cronSecret && !isCloudflareCron) {
    // In development, allow without header but log warning
    // In production, require header
    if (isDevelopment) {
      if (!authHeader || authHeader !== cronSecret) {
        console.warn(
          "⚠️ Manual cron request without proper auth header. This will be blocked in production."
        );
        // Still allow in dev for easier testing
      }
    } else {
      // Production: require header
      if (!authHeader || authHeader !== cronSecret) {
        return NextResponse.json(
          {
            error: "Unauthorized. Set X-Cron-Auth header matching CRON_SECRET.",
            hint: "For manual testing, include header: X-Cron-Auth: your-secret",
          },
          { status: 401 }
        );
      }
    }
  }

  try {
    // Get all intakes with reminders that are due
    const dueIntakes = await getIntakesWithDueReminders();

    if (dueIntakes.length === 0) {
      // Check if there are any reminders at all (for debugging)
      const allReminders = await getIntakesWithReminders("all");
      const upcomingReminders = allReminders.filter(
        (r) => new Date(r.reminderDate) > new Date()
      );

      return NextResponse.json({
        success: true,
        message: "No reminders due",
        count: 0,
        debug:
          process.env.NODE_ENV !== "production"
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

    // Send reminder emails for each due intake
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
      (r) => r.status === "fulfilled" && r.value.success
    ).length;
    const failed = results.filter(
      (r) =>
        r.status === "rejected" ||
        (r.status === "fulfilled" && !r.value.success)
    ).length;

    return NextResponse.json({
      success: true,
      message: `Processed ${dueIntakes.length} reminders`,
      sent: successful,
      failed,
      results: results.map((r) =>
        r.status === "fulfilled" ? r.value : { error: "Failed to process" }
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
