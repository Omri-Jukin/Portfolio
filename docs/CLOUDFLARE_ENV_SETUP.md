# Cloudflare Environment Variables Setup Guide

This document explains how to configure environment variables for production deployment on Cloudflare.

## Quick Setup

### Step 1: Set Secrets (Sensitive Variables)

These MUST be set as **encrypted secrets** in Cloudflare (never in `wrangler.jsonc`):

```bash
# Via Wrangler CLI (recommended):
npx wrangler secret put DATABASE_URL
npx wrangler secret put JWT_SECRET
npx wrangler secret put BLOG_API_KEY
npx wrangler secret put AWS_ACCESS_KEY_ID
npx wrangler secret put AWS_SECRET_ACCESS_KEY
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put GMAIL_USER
npx wrangler secret put GMAIL_APP_PASSWORD
npx wrangler secret put SMTP_USERNAME
npx wrangler secret put SMTP_PW
npx wrangler secret put GITHUB_PERSONAL_ACCESS_KEY
```

**Or via Cloudflare Dashboard:**

1. Go to Workers & Pages → Your Project
2. Settings → Variables and Secrets
3. Add each secret variable
4. Mark as "Encrypted"

### Step 2: Non-Sensitive Variables

These are already configured in `wrangler.jsonc` in the `vars` section. No action needed unless you need to change values.

## Required Secrets List

| Variable                     | Description                                        | Required                        |
| ---------------------------- | -------------------------------------------------- | ------------------------------- |
| `DATABASE_URL`               | Supabase PostgreSQL connection string (pooler URL) | ✅ Yes                          |
| `JWT_SECRET`                 | Secret key for JWT token signing                   | ✅ Yes                          |
| `BLOG_API_KEY`               | Blog API authentication key                        | ⚠️ Optional                     |
| `AWS_ACCESS_KEY_ID`          | AWS access key for SES                             | ⚠️ Optional (if using SES)      |
| `AWS_SECRET_ACCESS_KEY`      | AWS secret key for SES                             | ⚠️ Optional (if using SES)      |
| `SUPABASE_SERVICE_ROLE_KEY`  | Supabase service role key                          | ⚠️ Optional                     |
| `GMAIL_USER`                 | Gmail address for sending emails                   | ⚠️ Optional (if using Gmail)    |
| `GMAIL_APP_PASSWORD`         | Gmail app password                                 | ⚠️ Optional (if using Gmail)    |
| `SMTP_USERNAME`              | AWS SES SMTP username                              | ⚠️ Optional (if using SES SMTP) |
| `SMTP_PW`                    | AWS SES SMTP password                              | ⚠️ Optional (if using SES SMTP) |
| `GITHUB_PERSONAL_ACCESS_KEY` | GitHub personal access token                       | ⚠️ Optional                     |

## Already Configured in wrangler.jsonc

These non-sensitive variables are in `wrangler.jsonc`:

- `NODE_ENV`: "production"
- `NEXT_PUBLIC_BASE_URL`: "https://omrijukin.com"
- `EMAIL_PROVIDER`: "gmail"
- `EMAIL_FROM`: "intake@omrijukin.com"
- `EMAIL_BCC`: "omrijukin@gmail.com"
- `ADMIN_EMAIL`: "contact@omrijukin.com"
- `SES_FROM_EMAIL`: "noreply@omrijukin.com"
- `AWS_REGION`: "us-east-1"
- `LOG_LEVEL`: "info"
- `SUPABASE_URL`: "https://ocmtnzuhommmsliebcjy.supabase.co"
- Rate limiting variables

## Verification

After setting secrets, verify they're accessible:

1. **Check via Debug Endpoint:**

   ```bash
   curl https://omrijukin.com/api/debug
   ```

   Should show `hasDatabaseUrl: true` if `DATABASE_URL` is set.

2. **Test Database Connection:**

   ```bash
   npm run test:db
   ```

3. **Check in Cloudflare Dashboard:**
   - Workers & Pages → Your Project → Settings → Variables and Secrets
   - Verify all secrets are listed (values are hidden)

## Important Notes

⚠️ **Never commit secrets to:**

- `wrangler.jsonc` (except non-sensitive vars)
- Git repository
- Public files

✅ **Always use:**

- Cloudflare Secrets (encrypted)
- Wrangler CLI `secret put` command
- Environment variables in Cloudflare Dashboard

## Troubleshooting

### Database Connection Fails

1. Verify `DATABASE_URL` is set as a secret:

   ```bash
   npx wrangler secret list
   ```

2. Check connection string format:

   - Must use pooler URL: `postgresql://...@aws-0-eu-north-1.pooler.supabase.com:5432/postgres`
   - NOT direct connection URL

3. Verify secret is available:
   - Check `/api/debug` endpoint
   - Check Cloudflare logs for "DATABASE_URL not available" warnings

### Environment Variable Not Available

- Ensure variable is set in correct environment (Production vs Preview)
- Redeploy after adding new secrets
- Check variable name spelling (case-sensitive)
