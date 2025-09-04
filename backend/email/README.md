# Email Service Configuration

This email service supports multiple providers with automatic fallback. Here are the setup instructions for each provider:

## 🟢 Gmail SMTP (FREE & RECOMMENDED)

Gmail offers free SMTP access with the following limits:

- **500 emails per day** for regular Gmail accounts
- **2000 emails per day** for Google Workspace accounts
- **100 recipients per email**
- **25MB attachment limit**

### Setup Instructions:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:

   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Click "2-Step Verification"
   - Scroll down to "App passwords"
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Configure Environment Variables**:
   ```env
   EMAIL_PROVIDER=gmail
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your_16_character_app_password
   SES_FROM_EMAIL=your-email@gmail.com
   ADMIN_EMAIL=your-email@gmail.com
   ```

### Pros:

- ✅ **Completely FREE**
- ✅ **No credit card required**
- ✅ **High deliverability** (Gmail's reputation)
- ✅ **Easy setup** (just need app password)
- ✅ **Good daily limits** for most use cases

### Cons:

- ❌ **Daily sending limits**
- ❌ **Must use Gmail as sender** (can set reply-to)
- ❌ **Google branding** in email headers

---

## 🟡 AWS SES (PAY-AS-YOU-GO)

Amazon Simple Email Service - Professional grade email service.

### Setup Instructions:

1. **Create AWS Account** and set up SES
2. **Verify your domain** or email address
3. **Request production access** (starts in sandbox mode)
4. **Create IAM credentials** with SES permissions

```env
EMAIL_PROVIDER=ses
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
SES_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

### Pricing:

- **$0.10 per 1,000 emails**
- **First 62,000 emails per month FREE** (if sent from EC2)

---

## 🟡 Resend (RECOMMENDED FOR PRODUCTION)

Modern email API with excellent developer experience.

### Setup Instructions:

1. **Sign up** at [resend.com](https://resend.com)
2. **Verify your domain**
3. **Get API key** from dashboard

```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_resend_api_key_here
SES_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

### Free Tier:

- **3,000 emails per month FREE**
- **100 emails per day**

---

## 🟡 SendGrid (POPULAR CHOICE)

Reliable email delivery service by Twilio.

### Setup Instructions:

1. **Sign up** at [sendgrid.com](https://sendgrid.com)
2. **Verify your domain**
3. **Create API key**

```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
SES_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

### Free Tier:

- **100 emails per day FREE**

---

## 🔴 MailChannels (CLOUDFLARE WORKERS ONLY)

Free email service for Cloudflare Workers.

```env
EMAIL_PROVIDER=mailchannels
MAILCHANNELS_API_KEY=your_mailchannels_api_key_here
```

**Note**: Only works when deployed on Cloudflare Workers.

---

## 🚀 Quick Setup for Development

For quick testing, use Gmail SMTP:

1. **Use your personal Gmail**:

   ```env
   EMAIL_PROVIDER=gmail
   GMAIL_USER=your.personal.email@gmail.com
   GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
   SES_FROM_EMAIL=your.personal.email@gmail.com
   ADMIN_EMAIL=your.personal.email@gmail.com
   ```

2. **Test the contact form** - emails will be sent from your Gmail account

---

## 🔧 Fallback Configuration

The service automatically tries providers in this order:

1. **Primary provider** (configured in `EMAIL_PROVIDER`)
2. **Gmail** (if credentials available)
3. **AWS SES** (if credentials available)
4. **Resend** (if API key available)
5. **SendGrid** (if API key available)
6. **MailChannels** (if API key available)

---

## 🔒 Security Notes

### Gmail:

- ✅ **Use App Passwords** - never use your main password
- ✅ **Enable 2FA** - required for app passwords
- ✅ **Rotate passwords** periodically

### API Keys:

- ✅ **Store in environment variables**
- ✅ **Never commit to git**
- ✅ **Use different keys** for dev/prod
- ✅ **Rotate regularly**

---

## 📊 Recommended Setup by Use Case

### **Personal Portfolio/Blog**:

→ **Gmail SMTP** (500 emails/day is plenty)

### **Small Business**:

→ **Resend** (3,000 emails/month free)

### **Growing Startup**:

→ **AWS SES** (pay-as-you-go, scales infinitely)

### **Enterprise**:

→ **AWS SES** or **SendGrid** (dedicated IPs, advanced features)

---

## 🛠️ Testing

Test your email configuration:

```bash
# Using the built-in test endpoint
curl -X POST http://localhost:3000/api/trpc/emails.checkEmailServiceStatus
```

---

## 📈 Monitoring

The service logs detailed information about:

- ✅ **Successful sends** with message IDs
- ❌ **Failed attempts** with error details
- 🔄 **Fallback attempts** when primary provider fails

Check your application logs for email delivery status.
