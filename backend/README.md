# Backend Services

This directory contains all backend logic and services for the portfolio application.

## Structure

```
backend/
├── email/                 # Email services using AWS SES
│   ├── email.service.ts   # Main email service
│   └── README.md         # Email service documentation
├── utils/                 # Common utilities
│   ├── logger.ts         # Logging utilities
│   └── validation.ts     # Validation and sanitization utilities
├── config/               # Configuration files
│   └── env.example       # Environment variables template
└── README.md            # This file
```

## Services

### Email Service (`email/`)

The email service provides functionality for sending emails using AWS SES.

**Features:**
- Contact form notifications to admin
- Confirmation emails to users
- Test email functionality
- Custom email sending (admin only)
- HTML and text email support
- Error handling and logging

**Usage:**
```typescript
import { EmailService } from "~/backend/email/email.service";

const emailService = new EmailService();

// Send contact form notification
const result = await emailService.sendContactFormNotification({
  name: "John Doe",
  email: "john@example.com",
  subject: "Project Inquiry",
  message: "I'd like to discuss a project..."
});
```

**Required Environment Variables:**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `SES_FROM_EMAIL`
- `ADMIN_EMAIL`

### Utilities (`utils/`)

Common utilities used across backend services.

#### Logger (`logger.ts`)

Structured logging with different log levels and context support.

**Usage:**
```typescript
import { Logger } from "~/backend/utils/logger";

Logger.info("User logged in", { userId: "123", timestamp: new Date() });
Logger.error("Database connection failed", error, { retryCount: 3 });
```

#### Validation (`validation.ts`)

Validation schemas, rate limiting, and sanitization utilities.

**Features:**
- Common Zod schemas (email, name, phone, URL)
- Rate limiting with configurable windows
- HTML and text sanitization
- Validation helpers with sanitization

**Usage:**
```typescript
import { ValidationHelper, emailSchema, Sanitizer } from "~/backend/utils/validation";

// Validate and sanitize data
const result = ValidationHelper.validateAndSanitize(
  emailSchema,
  userInput,
  Sanitizer.sanitizeEmail
);

// Rate limiting
const rateLimiter = new RateLimiter({ maxRequests: 5, windowMs: 60000 });
if (!rateLimiter.isAllowed(userId)) {
  throw new Error("Rate limit exceeded");
}
```

## Configuration

### Environment Variables

Copy `config/env.example` to `.env` and fill in your values:

```bash
# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1

# SES Configuration
SES_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

### AWS SES Setup

1. **Create AWS SES Identity:**
   - Go to AWS SES Console
   - Create a new email identity (domain or email address)
   - Verify the identity

2. **Configure Sending:**
   - If in sandbox mode, verify recipient emails
   - Request production access if needed

3. **Set Environment Variables:**
   - Configure AWS credentials
   - Set the verified email as `SES_FROM_EMAIL`

## Integration with tRPC

The backend services are integrated with tRPC through the `emailsRouter`:

```typescript
// src/app/server/routers/emails.ts
export const emailsRouter = router({
  submitContactForm: procedure
    .input(contactFormSchema)
    .mutation(async (opts) => {
      // Uses EmailService internally
    }),
  
  sendTestEmail: procedure
    .input(z.object({ toEmail: z.string().email() }))
    .mutation(async (opts) => {
      // Admin-only test email functionality
    }),
});
```

## Error Handling

All services include comprehensive error handling:

- **Email Service:** Returns structured error responses
- **Validation:** Provides detailed validation error messages
- **Logging:** Captures errors with context for debugging

## Security Considerations

- **Input Validation:** All inputs are validated using Zod schemas
- **Sanitization:** HTML and text inputs are sanitized
- **Rate Limiting:** Prevents abuse of email services
- **Environment Variables:** Sensitive data stored in environment variables
- **Admin Authorization:** Admin-only functions require proper authentication

## Testing

Each service should include unit tests:

```typescript
// Example test structure
describe("EmailService", () => {
  it("should send contact form notification", async () => {
    // Test implementation
  });
  
  it("should handle SES errors gracefully", async () => {
    // Error handling test
  });
});
```

## Future Enhancements

- **Email Templates:** Template system for different email types
- **Email Queue:** Background processing for email sending
- **Analytics:** Track email delivery and open rates
- **Webhooks:** Handle SES bounces and complaints
- **Caching:** Cache frequently accessed data
- **Monitoring:** Health checks and performance monitoring 