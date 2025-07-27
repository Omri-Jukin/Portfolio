import { z } from "zod";
import { router, procedure } from "../trpc";
import { EmailService } from "#/backend/email/email.service";

// Lazy initialization to avoid build-time errors
let emailService: EmailService | null = null;

export type EmailServiceStatus = {
  status: "available" | "unavailable" | "error";
  message: string;
  config?: {
    region?: string;
    fromEmail?: string;
    adminEmail?: string;
  };
};

const getEmailService = () => {
  if (!emailService) {
    // Only initialize if we're in a runtime environment with AWS credentials
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      emailService = new EmailService();
    } else {
      throw new Error("AWS credentials not configured for email service");
    }
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

  // Send test email (admin only)
  sendTestEmail: procedure
    .input(
      z.object({
        toEmail: z.string().email("Please enter a valid email address"),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const { user } = opts.ctx;

      // Check if user is admin
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }

      try {
        const result = await getEmailService().sendTestEmail(input.toEmail);

        if (!result.success) {
          throw new Error(result.error || "Failed to send test email");
        }

        return {
          success: true,
          messageId: result.messageId,
          message: "Test email sent successfully",
        };
      } catch (error) {
        console.error("Test email sending failed:", error);
        throw new Error(
          error instanceof Error ? error.message : "Failed to send test email"
        );
      }
    }),

  // Get email service status (admin only)
  getEmailServiceStatus: procedure.query(async (opts) => {
    const { user } = opts.ctx;

    // Check if user is admin
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }
    try {
      const emailService = getEmailService();
      if (!emailService) {
        return {
          status: "unavailable",
          message: "Email service not configured",
        };
      }
      return {
        status: "available",
        message: "Email service is ready",
        config: {
          region: process.env.AWS_REGION || "us-east-1",
          fromEmail: process.env.FROM_EMAIL || "contact@omrijukin.com",
          adminEmail: process.env.ADMIN_EMAIL || "omrijukin@gmail.com",
        },
      };
    } catch (error) {
      console.error("Email service status check failed:", error);
      return {
        status: "error",
        message: "Email service check failed",
        config: undefined,
      };
    }
  }),

  // Test AWS SES connectivity (admin only)
  testSESConnectivity: procedure.mutation(async (opts) => {
    const { user } = opts.ctx;

    // Check if user is admin
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    try {
      // Test SES client creation
      const testClient = new (await import("@aws-sdk/client-ses")).SESClient({
        region: process.env.AWS_REGION || "us-east-1",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      });

      // Test SES API call (GetSendQuota to check connectivity)
      const { GetSendQuotaCommand } = await import("@aws-sdk/client-ses");
      const quotaCommand = new GetSendQuotaCommand({});
      const quotaResult = await testClient.send(quotaCommand);

      return {
        success: true,
        message: "SES connectivity test successful",
        quota: {
          max24HourSend: quotaResult.Max24HourSend,
          maxSendRate: quotaResult.MaxSendRate,
          sentLast24Hours: quotaResult.SentLast24Hours,
        },
      };
    } catch (error) {
      console.error("SES connectivity test failed:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }),
});
