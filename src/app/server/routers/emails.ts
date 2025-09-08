import { z } from "zod";
import { router, procedure } from "../trpc";
import { EmailManager } from "#/backend/email/EmailManager";

// Lazy initialization of the email service
let emailService: EmailManager | null = null;

const getEmailService = () => {
  if (!emailService) {
    emailService = new EmailManager();
  }
  return emailService;
};

export const emailsRouter = router({
  // Public endpoint to check email service status (no auth required)
  checkEmailServiceStatus: procedure.query(async () => {
    try {
      const emailService = getEmailService();
      if (!emailService) {
        return {
          status: "unavailable",
          message: "Email service not configured",
        };
      }
      return { status: "available", message: "Email service is ready" };
    } catch (error) {
      console.error("Email service status check failed:", error);
      return { status: "error", message: "Email service check failed" };
    }
  }),

  // Submit contact form and send emails
  submitContactForm: procedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z
          .string()
          .regex(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address"
          ),
        phone: z.string().min(1, "Phone number is required"),
        subject: z.string().min(3, "Subject must be at least 3 characters"),
        message: z.string().min(10, "Message must be at least 10 characters"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const emailService = getEmailService();
        if (!emailService) {
          throw new Error("Email service not available");
        }

        // Send notification to admin
        const adminNotification =
          await emailService.sendContactFormNotification(input);
        if (!adminNotification.success) {
          throw new Error(
            `Failed to send admin notification: ${adminNotification.error}`
          );
        }

        // Send confirmation to user
        const userConfirmation = await emailService.sendContactFormConfirmation(
          input
        );
        if (!userConfirmation.success) {
          console.warn(
            "Failed to send user confirmation:",
            userConfirmation.error
          );
          // Don't fail the entire request if user confirmation fails
        }

        return {
          success: true,
          adminMessageId: adminNotification.messageId,
          userMessageId: userConfirmation.messageId,
        };
      } catch (error) {
        console.error("Failed to send contact form email:", error);
        throw new Error("Failed to send email");
      }
    }),
});
