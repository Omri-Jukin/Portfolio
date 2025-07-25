import { z } from "zod";
import { router, procedure } from "../trpc";
import { EmailService } from "#/backend/email/email.service";

const emailService = new EmailService();

export const emailsRouter = router({
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
        subject: z.string().min(5, "Subject must be at least 5 characters"),
        message: z.string().min(10, "Message must be at least 10 characters"),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;

      try {
        // Send notification email to admin
        const adminNotification =
          await emailService.sendContactFormNotification(input);

        if (!adminNotification.success) {
          console.error(
            "Failed to send admin notification:",
            adminNotification.error
          );
          throw new Error("Failed to send notification email");
        }

        // Send confirmation email to user
        const userConfirmation = await emailService.sendContactFormConfirmation(
          input
        );

        if (!userConfirmation.success) {
          console.error(
            "Failed to send user confirmation:",
            userConfirmation.error
          );
          // Don't throw error here as admin notification was successful
          // Just log the issue
        }

        return {
          success: true,
          adminMessageId: adminNotification.messageId,
          userMessageId: userConfirmation.messageId,
          message:
            "Contact form submitted successfully. You will receive a confirmation email shortly.",
        };
      } catch (error) {
        console.error("Contact form submission failed:", error);
        throw new Error(
          "Failed to submit contact form. Please try again later."
        );
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
        const result = await emailService.sendTestEmail(input.toEmail);

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
      // Check if required environment variables are set
      const requiredEnvVars = [
        "AWS_ACCESS_KEY_ID",
        "AWS_SECRET_ACCESS_KEY",
        "AWS_REGION",
        "SES_FROM_EMAIL",
      ];

      const missingVars = requiredEnvVars.filter(
        (varName) => !process.env[varName]
      );

      if (missingVars.length > 0) {
        return {
          status: "error",
          message: `Missing environment variables: ${missingVars.join(", ")}`,
          missingVars,
        };
      }

      return {
        status: "ready",
        message: "Email service is properly configured",
        config: {
          region: process.env.AWS_REGION,
          fromEmail: process.env.SES_FROM_EMAIL,
          adminEmail: process.env.ADMIN_EMAIL || "omrijukin@gmail.com",
        },
      };
    } catch (error) {
      console.error("Email service status check failed:", error);
      return {
        status: "error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
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
        config: {
          region: process.env.AWS_REGION || "us-east-1",
          fromEmail: process.env.SES_FROM_EMAIL,
        },
      };
    } catch (error) {
      console.error("SES connectivity test failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        details: {
          errorType: error?.constructor?.name,
          errorCode: (error as { code?: string })?.code,
        },
      };
    }
  }),

  // Send custom email (admin only)
  sendCustomEmail: procedure
    .input(
      z.object({
        to: z.string().email("Please enter a valid recipient email"),
        subject: z.string().min(1, "Subject is required"),
        htmlBody: z.string().min(1, "Email body is required"),
        textBody: z.string().optional(),
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
        const result = await emailService.sendEmail({
          to: input.to,
          from: process.env.SES_FROM_EMAIL || "noreply@omrijukin.com",
          subject: input.subject,
          htmlBody: input.htmlBody,
          textBody: input.textBody,
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to send email");
        }

        return {
          success: true,
          messageId: result.messageId,
          message: "Email sent successfully",
        };
      } catch (error) {
        console.error("Custom email sending failed:", error);
        throw new Error(
          error instanceof Error ? error.message : "Failed to send email"
        );
      }
    }),
});
