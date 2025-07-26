import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
} from "@aws-sdk/client-ses";

export interface EmailData {
  to: string;
  from: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
}

export interface ContactFormEmailData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export class EmailService {
  private sesClient: SESClient;
  private defaultFromEmail: string;

  constructor() {
    // Log environment variables for debugging (without exposing secrets)
    console.log("EmailService initialization:");
    console.log("- AWS_REGION:", process.env.AWS_REGION || "us-east-1");
    console.log(
      "- AWS_ACCESS_KEY_ID:",
      process.env.AWS_ACCESS_KEY_ID ? "SET" : "NOT SET"
    );
    console.log(
      "- AWS_SECRET_ACCESS_KEY:",
      process.env.AWS_SECRET_ACCESS_KEY ? "SET" : "NOT SET"
    );
    console.log(
      "- SES_FROM_EMAIL:",
      process.env.SES_FROM_EMAIL || "noreply@omrijukin.com"
    );
    console.log(
      "- ADMIN_EMAIL:",
      process.env.ADMIN_EMAIL || "omrijukin@gmail.com"
    );

    // Validate required environment variables
    if (!process.env.AWS_ACCESS_KEY_ID) {
      throw new Error("AWS_ACCESS_KEY_ID environment variable is required");
    }
    if (!process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error("AWS_SECRET_ACCESS_KEY environment variable is required");
    }

    this.sesClient = new SESClient({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    this.defaultFromEmail =
      process.env.SES_FROM_EMAIL || "noreply@omrijukin.com";
  }

  /**
   * Send a generic email using AWS SES
   */
  async sendEmail(
    emailData: EmailData
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      console.log("Attempting to send email:");
      console.log("- From:", emailData.from);
      console.log("- To:", emailData.to);
      console.log("- Subject:", emailData.subject);

      const params: SendEmailCommandInput = {
        Source: emailData.from,
        Destination: {
          ToAddresses: [emailData.to],
        },
        Message: {
          Subject: {
            Data: emailData.subject,
            Charset: "UTF-8",
          },
          Body: {
            Html: {
              Data: emailData.htmlBody,
              Charset: "UTF-8",
            },
            ...(emailData.textBody && {
              Text: {
                Data: emailData.textBody,
                Charset: "UTF-8",
              },
            }),
          },
        },
      };

      console.log("SES parameters prepared, sending command...");
      const command = new SendEmailCommand(params);
      const result = await this.sesClient.send(command);

      console.log("Email sent successfully, MessageId:", result.MessageId);
      return {
        success: true,
        messageId: result.MessageId,
      };
    } catch (error) {
      console.error("Email sending failed with detailed error:");
      console.error("- Error type:", error?.constructor?.name);
      console.error(
        "- Error message:",
        error instanceof Error ? error.message : "Unknown error"
      );
      console.error(
        "- Error stack:",
        error instanceof Error ? error.stack : "No stack trace"
      );

      // Log AWS-specific error details
      if (error && typeof error === "object" && "name" in error) {
        console.error("- AWS Error name:", (error as any).name);
      }
      if (error && typeof error === "object" && "code" in error) {
        console.error("- AWS Error code:", (error as any).code);
      }

      // Provide more specific error messages for common SES issues
      let errorMessage = "Unknown error occurred";

      if (error instanceof Error) {
        if (error.message.includes("MessageRejected")) {
          errorMessage =
            "Email rejected by SES. Please check if the sender email is verified.";
        } else if (error.message.includes("MailFromDomainNotVerified")) {
          errorMessage =
            "Sender domain not verified in SES. Please verify your domain.";
        } else if (error.message.includes("MessageTooLarge")) {
          errorMessage = "Email message is too large.";
        } else if (error.message.includes("ConfigurationSetDoesNotExist")) {
          errorMessage = "SES configuration set does not exist.";
        } else if (error.message.includes("InvalidParameterValue")) {
          errorMessage = "Invalid email parameters provided.";
        } else if (error.message.includes("AccountSendingPausedException")) {
          errorMessage = "SES sending is paused for this account.";
        } else if (error.message.includes("SendingPausedException")) {
          errorMessage = "SES sending is paused for this configuration set.";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Send contact form notification to admin
   */
  async sendContactFormNotification(
    contactData: ContactFormEmailData
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const adminEmail = process.env.ADMIN_EMAIL || "omrijukin@gmail.com";

    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>New Contact Form Submission</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1976d2; border-bottom: 2px solid #1976d2; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Contact Details</h3>
              
              <p><strong>Name:</strong> ${contactData.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${
                contactData.email
              }">${contactData.email}</a></p>
              <p><strong>Phone:</strong> <a href="tel:${contactData.phone}">${
      contactData.phone
    }</a></p>
              <p><strong>Subject:</strong> ${contactData.subject}</p>
              
              <div style="margin-top: 20px;">
                <strong>Message:</strong>
                <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px; border-left: 4px solid #1976d2;">
                  ${contactData.message.replace(/\n/g, "<br>")}
                </div>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666;">
              <p>This message was sent from your portfolio contact form.</p>
              <p>Time: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textBody = `
New Contact Form Submission

Contact Details:
- Name: ${contactData.name}
- Email: ${contactData.email}
- Phone: ${contactData.phone}
- Subject: ${contactData.subject}

Message:
${contactData.message}

---
This message was sent from your portfolio contact form.
Time: ${new Date().toLocaleString()}
    `;

    return this.sendEmail({
      to: adminEmail,
      from: this.defaultFromEmail,
      subject: `New Contact Form Submission: ${contactData.subject}`,
      htmlBody,
      textBody,
    });
  }

  /**
   * Send confirmation email to the person who submitted the contact form
   */
  async sendContactFormConfirmation(
    contactData: ContactFormEmailData
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Thank you for your message</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1976d2; border-bottom: 2px solid #1976d2; padding-bottom: 10px;">
              Thank you for your message!
            </h2>
            
            <p>Dear ${contactData.name},</p>
            
            <p>Thank you for reaching out to me. I have received your message and will get back to you as soon as possible.</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Your Message Details</h3>
              <p><strong>Subject:</strong> ${contactData.subject}</p>
              <p><strong>Message:</strong></p>
              <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px; border-left: 4px solid #1976d2;">
                ${contactData.message.replace(/\n/g, "<br>")}
              </div>
            </div>
            
            <p>I typically respond within 24-48 hours. If you have any urgent matters, please don't hesitate to reach out through other channels.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666;">
              <p>Best regards,<br>Omri Jukin</p>
              <p>Full Stack Developer | Electrical Engineer | Data Management Expert</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textBody = `
Thank you for your message!

Dear ${contactData.name},

Thank you for reaching out to me. I have received your message and will get back to you as soon as possible.

Your Message Details:
- Subject: ${contactData.subject}
- Message: ${contactData.message}

I typically respond within 24-48 hours. If you have any urgent matters, please don't hesitate to reach out through other channels.

Best regards,
Omri Jukin
Full Stack Developer | Electrical Engineer | Data Management Expert
    `;

    return this.sendEmail({
      to: contactData.email,
      from: this.defaultFromEmail,
      subject: "Thank you for your message - Omri Jukin",
      htmlBody,
      textBody,
    });
  }

  /**
   * Send a test email to verify SES configuration
   */
  async sendTestEmail(
    toEmail: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Test Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1976d2;">Test Email</h2>
            <p>This is a test email to verify that your AWS SES configuration is working correctly.</p>
            <p>Time sent: ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: toEmail,
      from: this.defaultFromEmail,
      subject: "Test Email - Portfolio Contact System",
      htmlBody,
      textBody:
        "This is a test email to verify that your AWS SES configuration is working correctly.",
    });
  }
}
