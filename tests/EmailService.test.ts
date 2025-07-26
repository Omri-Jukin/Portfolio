import { EmailService } from "../backend/email/email.service";

describe("EmailService", () => {
  let emailService: EmailService;

  beforeAll(() => {
    // Set up test environment variables
    process.env.AWS_ACCESS_KEY_ID = "test-access-key";
    process.env.AWS_SECRET_ACCESS_KEY = "test-secret-key";
    process.env.AWS_REGION = "us-east-1";
    process.env.SES_FROM_EMAIL = "test@example.com";
    process.env.ADMIN_EMAIL = "admin@example.com";
  });

  beforeEach(() => {
    emailService = new EmailService();
  });

  afterAll(() => {
    // Clean up environment variables
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;
    delete process.env.AWS_REGION;
    delete process.env.SES_FROM_EMAIL;
    delete process.env.ADMIN_EMAIL;
  });

  describe("constructor", () => {
    it("should initialize with valid environment variables", () => {
      expect(emailService).toBeDefined();
    });

    it("should throw error when AWS credentials are missing", () => {
      const originalAccessKey = process.env.AWS_ACCESS_KEY_ID;
      delete process.env.AWS_ACCESS_KEY_ID;

      expect(() => new EmailService()).toThrow(
        "AWS_ACCESS_KEY_ID environment variable is required"
      );

      process.env.AWS_ACCESS_KEY_ID = originalAccessKey;
    });

    it("should throw error when AWS secret is missing", () => {
      const originalSecretKey = process.env.AWS_SECRET_ACCESS_KEY;
      delete process.env.AWS_SECRET_ACCESS_KEY;

      expect(() => new EmailService()).toThrow(
        "AWS_SECRET_ACCESS_KEY environment variable is required"
      );

      process.env.AWS_SECRET_ACCESS_KEY = originalSecretKey;
    });
  });

  describe("sendContactFormNotification", () => {
    it("should create proper email data for admin notification", async () => {
      const contactData = {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        subject: "Test Subject",
        message: "Test message content",
      };

      // Mock the sendEmail method to avoid actual SES calls
      const mockSendEmail = jest
        .spyOn(emailService, "sendEmail")
        .mockResolvedValue({
          success: true,
          messageId: "test-message-id",
        });

      await emailService.sendContactFormNotification(contactData);

      expect(mockSendEmail).toHaveBeenCalledWith({
        to: "admin@example.com",
        from: "test@example.com",
        subject: "New Contact Form Submission: Test Subject",
        htmlBody: expect.stringContaining("John Doe"),
        textBody: expect.stringContaining("John Doe"),
      });

      mockSendEmail.mockRestore();
    });
  });

  describe("sendContactFormConfirmation", () => {
    it("should create proper email data for user confirmation", async () => {
      const contactData = {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+0987654321",
        subject: "Inquiry",
        message: "Hello, I have a question.",
      };

      // Mock the sendEmail method to avoid actual SES calls
      const mockSendEmail = jest
        .spyOn(emailService, "sendEmail")
        .mockResolvedValue({
          success: true,
          messageId: "test-message-id",
        });

      await emailService.sendContactFormConfirmation(contactData);

      expect(mockSendEmail).toHaveBeenCalledWith({
        to: "jane@example.com",
        from: "test@example.com",
        subject: "Thank you for your message - Omri Jukin",
        htmlBody: expect.stringContaining("Jane Smith"),
        textBody: expect.stringContaining("Jane Smith"),
      });

      mockSendEmail.mockRestore();
    });
  });

  describe("sendTestEmail", () => {
    it("should create proper test email data", async () => {
      const testEmail = "test@example.com";

      // Mock the sendEmail method to avoid actual SES calls
      const mockSendEmail = jest
        .spyOn(emailService, "sendEmail")
        .mockResolvedValue({
          success: true,
          messageId: "test-message-id",
        });

      await emailService.sendTestEmail(testEmail);

      expect(mockSendEmail).toHaveBeenCalledWith({
        to: "test@example.com",
        from: "test@example.com",
        subject: "Test Email - Portfolio Contact System",
        htmlBody: expect.stringContaining("Test Email"),
        textBody: expect.stringContaining("test email to verify"),
      });

      mockSendEmail.mockRestore();
    });
  });
});
