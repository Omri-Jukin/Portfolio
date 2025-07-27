import { z } from "zod";
import { router, procedure } from "../trpc";
import { EmailService } from "#/backend/email/email.service";

// Lazy initialization to avoid build-time errors
let emailService: EmailService | null = null;

const getEmailService = () => {
  // Add debugging to see what environment variables are available
  console.log("=== Email Service Environment Debug ===");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log(
    "AWS_ACCESS_KEY_ID:",
    process.env.AWS_ACCESS_KEY_ID ? "SET" : "NOT SET"
  );
  console.log(
    "AWS_SECRET_ACCESS_KEY:",
    process.env.AWS_SECRET_ACCESS_KEY ? "SET" : "NOT SET"
  );
  console.log("AWS_REGION:", process.env.AWS_REGION);
  console.log("SES_FROM_EMAIL:", process.env.SES_FROM_EMAIL);
  console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
  console.log("========================================");

  if (!emailService) {
    // Only initialize if we're in a runtime environment with AWS credentials
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      console.log("Initializing EmailService...");
      emailService = new EmailService();
      console.log("EmailService initialized successfully");
    } else {
      console.error("AWS credentials not configured for email service");
      throw new Error("AWS credentials not configured for email service");
    }
  }
  return emailService;
};

export const emailsRouter = router({
  // Public endpoint to check email service status (no auth required)
  checkEmailServiceStatus: procedure.query(async () => {
    console.log("=== Checking Email Service Status ===");

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

      console.log("Environment variables check:");
      console.log(
        "- AWS_ACCESS_KEY_ID:",
        process.env.AWS_ACCESS_KEY_ID ? "SET" : "NOT SET"
      );
      console.log(
        "- AWS_SECRET_ACCESS_KEY:",
        process.env.AWS_SECRET_ACCESS_KEY ? "SET" : "NOT SET"
      );
      console.log("- AWS_REGION:", process.env.AWS_REGION);
      console.log("- SES_FROM_EMAIL:", process.env.SES_FROM_EMAIL);
      console.log("- ADMIN_EMAIL:", process.env.ADMIN_EMAIL);

      if (missingVars.length > 0) {
        console.log("Missing environment variables:", missingVars);
        return {
          status: "error",
          message: `Missing environment variables: ${missingVars.join(", ")}`,
          missingVars,
        };
      }

      // Try to initialize the email service
      try {
        const service = getEmailService();
        console.log("Email service initialized successfully");

        return {
          status: "ready",
          message: "Email service is properly configured",
          config: {
            region: process.env.AWS_REGION,
            fromEmail: process.env.SES_FROM_EMAIL,
            adminEmail: process.env.ADMIN_EMAIL || "omrijukin@gmail.com",
          },
        };
      } catch (initError) {
        console.error("Email service initialization failed:", initError);
        return {
          status: "error",
          message: `Email service initialization failed: ${
            initError instanceof Error ? initError.message : "Unknown error"
          }`,
        };
      }
    } catch (error) {
      console.error("Email service status check failed:", error);
      return {
        status: "error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
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
        subject: z.string().min(3, "Subject must be at least 3 characters"), // Changed from 5 to 3
        message: z.string().min(10, "Message must be at least 10 characters"),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;

      console.log("Contact form submission started with input:", {
        name: input.name,
        email: input.email,
        subject: input.subject,
        // Don't log the full message for privacy
      });

      try {
        console.log("Getting email service...");
        const emailServiceInstance = getEmailService();

        console.log("Sending admin notification...");
        // Send notification email to admin
        const adminNotification =
          await emailServiceInstance.sendContactFormNotification(input);

        if (!adminNotification.success) {
          console.error(
            "Failed to send admin notification:",
            adminNotification.error
          );
          throw new Error(
            `Failed to send notification email: ${adminNotification.error}`
          );
        }

        console.log(
          "Admin notification sent successfully, sending user confirmation..."
        );
        // Send confirmation email to user
        const userConfirmation =
          await emailServiceInstance.sendContactFormConfirmation(input);

        if (!userConfirmation.success) {
          console.error(
            "Failed to send user confirmation:",
            userConfirmation.error
          );
          // Don't throw error here as admin notification was successful
          // Just log the issue
        }

        console.log("Contact form submission completed successfully");
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
          `Failed to submit contact form: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
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
        const result = await getEmailService().sendEmail({
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
