import { EmailManager } from "../../backend/email/EmailManager";
import type { RouterOutputs } from "$/trpc/client";
import { renderProposalEmailHTML, renderProposalEmailText } from "./proposal";
import { generateProposalPDF } from "$/utils/proposalPdfGenerator";

const emailManager = new EmailManager();
const EMAIL_FROM = process.env.EMAIL_FROM || "intake@omrijukin.com";

export interface SendProposalEmailOptions {
  proposalData: RouterOutputs["proposals"]["getById"];
  shareToken?: string;
  includePDF?: boolean;
  recipientEmail?: string;
}

/**
 * Send proposal email to client
 */
export async function sendProposalEmail(
  options: SendProposalEmailOptions
): Promise<{ success: boolean; error?: string; emailId?: string }> {
  const {
    proposalData,
    shareToken,
    includePDF = true,
    recipientEmail,
  } = options;

  const { proposal } = proposalData;
  const toEmail = recipientEmail || proposal.clientEmail;

  try {
    const emailHtml = renderProposalEmailHTML(proposalData, { shareToken });
    const emailText = renderProposalEmailText(proposalData, { shareToken });

    // Generate PDF if requested
    let pdfBuffer: Buffer | undefined;
    if (includePDF) {
      const pdf = generateProposalPDF(proposalData);
      pdfBuffer = Buffer.from(pdf.output("arraybuffer"));
    }

    const emailResult = await emailManager.sendEmail({
      to: toEmail,
      from: EMAIL_FROM,
      subject: `Proposal - ${proposal.clientName}${
        proposal.clientCompany ? ` (${proposal.clientCompany})` : ""
      }`,
      htmlBody: emailHtml,
      textBody: emailText,
      attachments: pdfBuffer
        ? [
            {
              filename: `Proposal-${proposal.clientName}-${
                new Date().toISOString().split("T")[0]
              }.pdf`,
              content: pdfBuffer,
              contentType: "application/pdf",
            },
          ]
        : undefined,
    });

    if (!emailResult.success) {
      console.error("Failed to send proposal email:", emailResult.error);
      return {
        success: false,
        error: `Failed to send email: ${emailResult.error}`,
      };
    }

    // Log email send in emailSends table if needed
    // TODO: Implement email tracking

    return {
      success: true,
      emailId: emailResult.messageId,
    };
  } catch (error) {
    console.error("Error sending proposal email:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown error sending email",
    };
  }
}
