import { EmailManager } from "../../backend/email/EmailManager";
import type { IntakeFormData } from "#/lib/schemas";
import {
  renderClientReceiptHTML,
  renderClientReceiptText,
  renderInternalSummaryHTML,
} from "./intake";

const emailManager = new EmailManager();
const EMAIL_FROM = process.env.EMAIL_FROM || "intake@omrijukin.com";
const EMAIL_BCC = process.env.EMAIL_BCC || "omrijukin@gmail.com";

/**
 * Send intake confirmation emails to client and admin
 */
export async function sendIntakeEmails(
  intake: IntakeFormData,
  proposalMarkdown: string
): Promise<{ success: boolean; error?: string }> {
  const orgName =
    intake.org?.name ??
    intake.contact.fullName ??
    `${intake.contact.firstName} ${intake.contact.lastName}`;

  try {
    // Send to client with BCC to admin
    const clientEmailHtml = renderClientReceiptHTML(intake, proposalMarkdown);
    const clientEmailText = renderClientReceiptText(intake, proposalMarkdown);

    const clientEmailResult = await emailManager.sendEmail({
      to: intake.contact.email,
      from: EMAIL_FROM,
      subject: `Thanks — we received your project intake (${orgName})`,
      htmlBody: clientEmailHtml,
      textBody: clientEmailText,
    });

    if (!clientEmailResult.success) {
      console.error("Failed to send client email:", clientEmailResult.error);
      return {
        success: false,
        error: `Failed to send client email: ${clientEmailResult.error}`,
      };
    }

    // Send internal summary to admin
    const adminEmailHtml = renderInternalSummaryHTML(intake);

    const adminEmailResult = await emailManager.sendEmail({
      to: EMAIL_BCC,
      from: EMAIL_FROM,
      subject: `NEW INTAKE — ${orgName}`,
      htmlBody: adminEmailHtml,
    });

    if (!adminEmailResult.success) {
      console.error("Failed to send admin email:", adminEmailResult.error);
      // Don't fail completely if admin email fails, client email was sent
      console.warn("Client email sent but admin email failed");
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending intake emails:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown error sending emails",
    };
  }
}
