// Email service implemented using MailChannels API instead of AWS SES

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

export class EmailManager {
  private defaultFromEmail: string;
  private emailProvider: string;

  constructor() {
    this.defaultFromEmail =
      process.env.SES_FROM_EMAIL || "contact@omrijukin.com";
    this.emailProvider = process.env.EMAIL_PROVIDER || "gmail";
  }

  /**
   * Send a generic email using the configured email provider
   */
  async sendEmail(
    emailData: EmailData
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // Try the configured provider first
    const result = await this.sendEmailWithProvider(
      emailData,
      this.emailProvider
    );

    // If it fails, try fallback providers
    if (!result.success) {
      console.warn(
        `Primary email provider '${this.emailProvider}' failed:`,
        result.error
      );

      const fallbackProviders = [
        "gmail",
        "ses",
        "resend",
        "sendgrid",
        "mailchannels",
      ].filter((p) => p !== this.emailProvider);

      for (const provider of fallbackProviders) {
        console.log(`Trying fallback email provider: ${provider}`);
        const fallbackResult = await this.sendEmailWithProvider(
          emailData,
          provider
        );
        if (fallbackResult.success) {
          console.log(
            `Successfully sent email using fallback provider: ${provider}`
          );
          return fallbackResult;
        }
        console.warn(
          `Fallback provider '${provider}' also failed:`,
          fallbackResult.error
        );
      }

      return result; // Return original error if all providers fail
    }

    return result;
  }

  /**
   * Send email using a specific provider
   */
  private async sendEmailWithProvider(
    emailData: EmailData,
    provider: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    switch (provider) {
      case "gmail":
        return this.sendEmailWithGmail(emailData);
      case "ses":
        return this.sendEmailWithSES(emailData);
      case "resend":
        return this.sendEmailWithResend(emailData);
      case "sendgrid":
        return this.sendEmailWithSendGrid(emailData);
      case "mailchannels":
        return this.sendEmailWithMailChannels(emailData);
      default:
        return { success: false, error: `Unknown email provider: ${provider}` };
    }
  }

  /**
   * Send email using Gmail SMTP (Free option)
   */
  private async sendEmailWithGmail(
    emailData: EmailData
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailAppPassword) {
      return { success: false, error: "Gmail SMTP credentials not configured" };
    }

    try {
      // Dynamically import nodemailer to avoid loading it if not needed
      const nodemailer = await import("nodemailer");

      const transporter = nodemailer.default.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use TLS
        auth: {
          user: gmailUser,
          pass: gmailAppPassword, // App-specific password, not your regular password
        },
      });

      const mailOptions = {
        from: `"${emailData.from.split("@")[0]}" <${gmailUser}>`, // Always use the Gmail address as sender
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.htmlBody,
        ...(emailData.textBody && { text: emailData.textBody }),
        // Add reply-to if different from Gmail
        ...(emailData.from !== gmailUser && { replyTo: emailData.from }),
      };

      const info = await transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      return {
        success: false,
        error: `Gmail SMTP error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }

  /**
   * Send email using AWS SES (Primary option)
   */
  private async sendEmailWithSES(
    emailData: EmailData
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const region = process.env.AWS_REGION || "us-east-1";

    if (!accessKeyId || !secretAccessKey) {
      return { success: false, error: "AWS SES credentials not configured" };
    }

    try {
      // Dynamically import AWS SDK to avoid loading it if not needed
      const { SESClient, SendEmailCommand } = await import(
        "@aws-sdk/client-ses"
      );

      const sesClient = new SESClient({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      const command = new SendEmailCommand({
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
      });

      const result = await sesClient.send(command);

      return {
        success: true,
        messageId: result.MessageId,
      };
    } catch (error) {
      return {
        success: false,
        error: `AWS SES error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }

  /**
   * Send email using Resend (Recommended)
   */
  private async sendEmailWithResend(
    emailData: EmailData
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return { success: false, error: "Resend API key not configured" };
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: emailData.from,
          to: [emailData.to],
          subject: emailData.subject,
          html: emailData.htmlBody,
          ...(emailData.textBody && { text: emailData.textBody }),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `Resend API error: ${errorText}` };
      }

      const data = await response.json();
      return { success: true, messageId: data.id };
    } catch (error) {
      return {
        success: false,
        error: `Resend error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Send email using SendGrid
   */
  private async sendEmailWithSendGrid(
    emailData: EmailData
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      return { success: false, error: "SendGrid API key not configured" };
    }

    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: emailData.to }],
            },
          ],
          from: { email: emailData.from },
          subject: emailData.subject,
          content: [
            { type: "text/html", value: emailData.htmlBody },
            ...(emailData.textBody
              ? [{ type: "text/plain", value: emailData.textBody }]
              : []),
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `SendGrid API error: ${errorText}` };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: `SendGrid error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Send email using MailChannels
   */
  private async sendEmailWithMailChannels(
    emailData: EmailData
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(process.env.MAILCHANNELS_API_KEY && {
            Authorization: `Bearer ${process.env.MAILCHANNELS_API_KEY}`,
          }),
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: emailData.to }],
            },
          ],
          from: { email: emailData.from },
          subject: emailData.subject,
          content: [
            { type: "text/html", value: emailData.htmlBody },
            ...(emailData.textBody
              ? [{ type: "text/plain", value: emailData.textBody }]
              : []),
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `MailChannels API error: ${errorText}`,
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: `MailChannels error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Generate the base email template with your brand styling
   */
  private generateEmailTemplate(content: string, title: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <style>
            /* Reset and base styles */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 20px;
            }
            
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            }
            
            .email-header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px 30px;
              text-align: center;
              color: white;
            }
            
            .email-header h1 {
              font-size: 28px;
              font-weight: 700;
              margin-bottom: 10px;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .email-header .subtitle {
              font-size: 16px;
              opacity: 0.9;
              font-weight: 300;
            }
            
            .email-content {
              padding: 40px 30px;
            }
            
            .email-content h2 {
              color: #667eea;
              font-size: 24px;
              margin-bottom: 20px;
              font-weight: 600;
            }
            
            .email-content p {
              margin-bottom: 16px;
              font-size: 16px;
              color: #555;
            }
            
            .highlight-box {
              background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
              border: 1px solid #e3e8ff;
              border-radius: 12px;
              padding: 24px;
              margin: 24px 0;
            }
            
            .highlight-box h3 {
              color: #667eea;
              font-size: 18px;
              margin-bottom: 16px;
              font-weight: 600;
            }
            
            .message-box {
              background: white;
              border-left: 4px solid #667eea;
              padding: 20px;
              border-radius: 8px;
              margin: 16px 0;
              box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
              white-space: pre-wrap;
              line-height: 1.6;
              font-family: inherit;
            }
            
            .contact-info {
              display: inline-block;
              background: #00a6ff;
              color: rgb(255, 255, 255);
              padding: 8px 16px;
              border-radius: 20px;
              text-decoration: none;
              margin: 4px;
              font-size: 14px;
              font-weight: 500;
            }
            
            .contact-info:hover {
              background: #9addff;
              color: rgb(0, 0, 0);
              transform: translateY(-1px);
              transition: all 0.2s ease;
            }
            
            .email-footer {
              background: #f8f9fa;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #e9ecef;
            }
            
            .email-footer p {
              margin-bottom: 8px;
              font-size: 14px;
              color: #6c757d;
            }
            
            .brand-name {
              color: #667eea;
              font-weight: 700;
              font-size: 18px;
            }
            
            .social-links {
              margin-top: 20px;
            }
            
            .social-link {
              display: inline-block;
              width: 40px;
              height: 40px;
              background: #667eea;
              color: white;
              text-decoration: none;
              border-radius: 50%;
              margin: 0 8px;
              text-align: center;
              line-height: 40px;
              font-weight: bold;
              transition: all 0.2s ease;
              font-size: 16px;
            }
            
            .social-link:hover {
              background: #5a6fd8;
              transform: translateY(-2px);
            }
            
            .social-link.github {
              background: #333;
            }
            
            .social-link.github:hover {
              background: #24292e;
            }
            
            .social-link.linkedin {
              background:#00a6ff;
            }
            
            .social-link.linkedin:hover {
              background:#9addff;
            }
            
            .social-link.whatsapp {
              background:rgb(37, 211, 102);
            }
            
            .social-link.whatsapp:hover {
              background:rgb(43, 255, 121);
            }
            
            /* Responsive design */
            @media (max-width: 600px) {
              body {
                padding: 10px;
              }
              
              .email-header {
                padding: 30px 20px;
              }
              
              .email-header h1 {
                font-size: 24px;
              }
              
              .email-content {
                padding: 30px 20px;
              }
              
              .email-footer {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>Omri Jukin</h1>
              <div class="subtitle">Full Stack Developer | Data Management</div>
            </div>
            
            <div class="email-content">
              ${content.replace(/\n/g, "<br>")}
            </div>
            
            <div class="email-footer">
              <p class="brand-name">Omri Jukin</p>
              <p>Full Stack Developer | Data Management</p>
              <p>Building innovative solutions with cutting-edge technology</p>
              
              <div class="social-links">
                <a href="https://github.com/Omri-Jukin" class="social-link github" title="GitHub">G</a>
                <a href="https://www.linkedin.com/in/omri-jukin/" class="social-link linkedin" title="LinkedIn">L</a>
                <a href="https://wa.me/972501234567" class="social-link whatsapp" title="WhatsApp">W</a>
              </div>
              
              <p style="margin-top: 20px; font-size: 12px; color: #adb5bd;">
                This email was sent from your portfolio contact form.<br>
                Time: ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Send contact form notification to admin
   */
  async sendContactFormNotification(
    contactData: ContactFormEmailData
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const adminEmail = process.env.ADMIN_EMAIL || "omrijukin@gmail.com";

    const content = `
      <h2>🎉 New Contact Form Submission</h2>
      
      <p>You've received a new message from your portfolio website!</p>
      
      <div class="highlight-box">
        <h3>👤 Contact Details</h3>
        
        <p><strong>👤 Name:</strong> ${contactData.name}</p>
        <p><strong>📧 Email:</strong> <a href="mailto:${
          contactData.email
        }" style="color: #667eea; text-decoration: none;">${
      contactData.email
    }</a></p>
        <p><strong>📞 Phone:</strong> <a href="tel:${
          contactData.phone
        }" style="color: #667eea; text-decoration: none;">${
      contactData.phone
    }</a></p>
        <p><strong>📝 Subject:</strong> ${contactData.subject}</p>
      </div>
      
      <div class="message-box">
        <h3>💬 Message</h3>
        <div style="white-space: pre-wrap; line-height: 1.6;">
          ${contactData.message.replace(/\n/g, "<br>")}
        </div>
      </div>
      
      <p style="margin-top: 24px;">
        <a href="mailto:${contactData.email}" class="contact-info">Reply to ${
      contactData.name
    }</a>
        <a href="tel:${contactData.phone}" class="contact-info">Call ${
      contactData.name
    }</a>
      </p>
    `;

    const htmlBody = this.generateEmailTemplate(
      content,
      "New Contact Form Submission"
    );

    const textBody = `
🎉 New Contact Form Submission

You've received a new message from your portfolio website!

👤 Contact Details:
- 👤 Name: ${contactData.name}
- 📧 Email: ${contactData.email}
- 📞 Phone: ${contactData.phone}
- 📝 Subject: ${contactData.subject}

💬 Message:
${contactData.message}

---
This message was sent from your portfolio contact form.
Time: ${new Date().toLocaleString()}
    `;

    return this.sendEmail({
      to: adminEmail,
      from: this.defaultFromEmail,
      subject: `🎉 New Contact Form Submission: ${contactData.subject}`,
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
    const content = `
      <h2>✨ Thank you for your message!</h2>
      
      <p>Dear <strong>${contactData.name}</strong>,</p>
      
      <p>Thank you for reaching out to me! I've received your message and I'm excited to connect with you. I'll review your inquiry and get back to you as soon as possible.</p>
      
      <div class="highlight-box">
        <h3>📋 Your Message Details</h3>
        <p><strong>📝 Subject:</strong> ${contactData.subject}</p>
        <p><strong>💬 Message:</strong></p>
        <div class="message-box">
          <div style="white-space: pre-wrap; line-height: 1.6; font-family: inherit;">
            ${contactData.message}
          </div>
        </div>
      </div>
      
      <p>I typically respond within <strong>24-48 hours</strong>. If you have any urgent matters or need immediate assistance, please don't hesitate to reach out through other channels.</p>
      
      <p>In the meantime, feel free to explore my portfolio to learn more about my work and expertise!</p>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="https://omrijukin.com" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.2s ease;">
          👨‍💻 Visit My Portfolio
        </a>
      </div>
      
      <p>Looking forward to our conversation!</p>
    `;

    const htmlBody = this.generateEmailTemplate(
      content,
      "Thank you for your message"
    );

    const textBody = `
✨ Thank you for your message!

Dear ${contactData.name},

Thank you for reaching out to me! I've received your message and I'm excited to connect with you. I'll review your inquiry and get back to you as soon as possible.

📋 Your Message Details:
- 📝 Subject: ${contactData.subject}
- 💬 Message: ${contactData.message}

I typically respond within 24-48 hours. If you have any urgent matters or need immediate assistance, please don't hesitate to reach out through other channels.

In the meantime, feel free to explore my portfolio to learn more about my work and expertise!

👨‍💻 Visit My Portfolio: https://omrijukin.com

Looking forward to our conversation!

      Best regards,
      Omri Jukin
      Full Stack Developer | Data Management
    `;

    return this.sendEmail({
      to: contactData.email,
      from: this.defaultFromEmail,
      subject: "✨ Thank you for your message - Omri Jukin",
      htmlBody,
      textBody,
    });
  }

  /**
   * Send a test email to verify email configuration
   */
  async sendTestEmail(
    toEmail: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const content = `
      <h2>🧪 Test Email</h2>
      
        <p>This is a test email to verify that your mail configuration is working correctly.</p>
      
      <div class="highlight-box">
        <h3>✅ Configuration Status</h3>
        <p><strong>✅ Email Service:</strong> Initialized successfully</p>
        <p><strong>✅ Email Provider:</strong> Connected and ready</p>
        <p><strong>✅ Templates:</strong> Styled and responsive</p>
        <p><strong>🕒 Time sent:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      <p>If you're receiving this email, your contact form email system is working perfectly! 🎉</p>
    `;

    const htmlBody = this.generateEmailTemplate(content, "Test Email");

    return this.sendEmail({
      to: toEmail,
      from: this.defaultFromEmail,
      subject: "🧪 Test Email - Portfolio Contact System",
      htmlBody,
      textBody: `
🧪 Test Email

This is a test email to verify that your mail configuration is working correctly.

✅ Configuration Status:
- ✅ Email Service: Initialized successfully
- ✅ Email Provider: Connected and ready
- ✅ Templates: Styled and responsive
- 🕒 Time sent: ${new Date().toLocaleString()}

If you're receiving this email, your contact form email system is working perfectly! 🎉
      `,
    });
  }
}
