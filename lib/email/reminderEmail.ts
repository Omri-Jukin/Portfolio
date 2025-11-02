import { EmailManager } from "../../backend/email/EmailManager";
import { formatDateTimeDDMMYYYY } from "~/IntakeReview/dateUtils";

const emailManager = new EmailManager();
const EMAIL_FROM = process.env.EMAIL_FROM || "intake@omrijukin.com";
const ADMIN_EMAIL =
  process.env.EMAIL_BCC || process.env.ADMIN_EMAIL || "omrijukin@gmail.com";

/**
 * Render reminder email HTML for admin
 */
function renderReminderEmailHTML(intakeData: {
  id: string;
  email: string;
  contact?: { firstName: string; lastName: string; email: string };
  reminderDate: Date;
  status: string;
  org?: { name?: string };
}): string {
  const orgName =
    intakeData.org?.name ||
    `${intakeData.contact?.firstName || ""} ${
      intakeData.contact?.lastName || ""
    }`.trim() ||
    intakeData.email;

  const reminderDateStr = formatDateTimeDDMMYYYY(intakeData.reminderDate);
  const intakeUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL || "https://omrijukin.com"
  }/admin/review?id=${intakeData.id}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reminder: Follow up on intake</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; color: white;">
          <h1 style="margin: 0; font-size: 24px;">🔔 Reminder: Follow Up Required</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-top: 0;">
            You have a reminder to follow up on a project intake.
          </p>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h2 style="margin-top: 0; color: #667eea;">${orgName}</h2>
            <p style="margin: 10px 0;"><strong>Reminder Date:</strong> ${reminderDateStr}</p>
            <p style="margin: 10px 0;"><strong>Status:</strong> ${intakeData.status}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${intakeData.email}</p>
          </div>

          <div style="margin: 30px 0;">
            <a href="${intakeUrl}" 
               style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: 600;">
              Review Intake →
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

          <p style="color: #666; font-size: 14px; margin-bottom: 0;">
            This is an automated reminder from your intake management system.
          </p>
        </div>
      </body>
    </html>
  `;
}

/**
 * Send reminder email to admin about an intake that needs follow-up
 */
export async function sendReminderEmail(intakeData: {
  id: string;
  email: string;
  reminderDate: Date;
  status: string;
  data: Record<string, unknown>;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const contact = intakeData.data.contact as
      | { firstName?: string; lastName?: string; email?: string }
      | undefined;
    const org = intakeData.data.org as { name?: string } | undefined;

    const emailHtml = renderReminderEmailHTML({
      id: intakeData.id,
      email: intakeData.email,
      contact: contact as
        | { firstName: string; lastName: string; email: string }
        | undefined,
      reminderDate: intakeData.reminderDate,
      status: intakeData.status,
      org,
    });

    const result = await emailManager.sendEmail({
      to: ADMIN_EMAIL,
      from: EMAIL_FROM,
      subject: `🔔 Reminder: Follow up on intake - ${
        org?.name || contact?.firstName || intakeData.email
      }`,
      htmlBody: emailHtml,
    });

    if (!result.success) {
      console.error("Failed to send reminder email:", result.error);
      return {
        success: false,
        error: `Failed to send reminder email: ${result.error}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending reminder email:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error sending reminder email",
    };
  }
}
