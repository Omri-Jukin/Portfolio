# Email Service Configuration

This email service supports multiple API-based providers with automatic fallback.

## Resend

Modern email API with a simple developer experience.

```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_resend_api_key_here
SES_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

Free tier:

- 3,000 emails per month
- 100 emails per day

## AWS SES

Amazon Simple Email Service is a low-cost production email service.

```env
EMAIL_PROVIDER=ses
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
SES_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

Setup:

1. Create an AWS account and configure SES.
2. Verify your domain or email address.
3. Request production access if needed.
4. Create IAM credentials with SES send permissions.

## SendGrid

Reliable email delivery service by Twilio.

```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
SES_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

## MailChannels

Free email service for Cloudflare Workers deployments.

```env
EMAIL_PROVIDER=mailchannels
MAILCHANNELS_API_KEY=your_mailchannels_api_key_here
SES_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

## Development Setup

For local development, Resend is the simplest API-based option:

```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_resend_api_key_here
SES_FROM_EMAIL=onboarding@resend.dev
ADMIN_EMAIL=your-email@example.com
```

## Fallback Configuration

The service automatically tries providers in this order:

1. Primary provider configured by `EMAIL_PROVIDER`
2. AWS SES if credentials are available
3. Resend if `RESEND_API_KEY` is available
4. SendGrid if `SENDGRID_API_KEY` is available
5. MailChannels

## Security Notes

- Store API keys in environment variables.
- Never commit secrets to git.
- Use different keys for development and production.
- Rotate keys regularly.

## Testing

Test your email configuration:

```bash
curl -X POST http://localhost:3000/api/trpc/emails.checkEmailServiceStatus
```

The service logs successful sends, failed attempts, and fallback attempts.
