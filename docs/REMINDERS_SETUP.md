# Reminders System Setup Guide

## How Reminders Work

### 1. Setting Reminders

- Open an intake in the review page
- Click "Advanced Tools" to expand
- Set a reminder date/time
- Click "Set Reminder"

### 2. Automatic Email Notifications

- **Cron Job**: Runs daily at 9 AM UTC
- **Checks**: Finds all intakes with `reminderDate <= now`
- **Action**: Sends email to admin for each due reminder
- **Location**: `/api/cron/reminders`

### 3. Manual Testing

You can test the cron job manually by visiting:

```
https://yourdomain.com/api/cron/reminders
```

Or with curl:

```bash
curl https://yourdomain.com/api/cron/reminders
```

**Response if no reminders due:**

```json
{
  "success": true,
  "message": "No reminders due",
  "count": 0
}
```

This is **normal** - it means either:

- No reminders are set
- All reminders are in the future
- All due reminders have already been processed

## CRON_SECRET Configuration (Optional)

The `CRON_SECRET` is an **optional** security measure for manual testing. It's not needed for Cloudflare cron triggers (they're automatically authenticated).

### If you want to secure manual access:

1. **Generate a random secret:**

   ```bash
   # Generate a random 32-character secret
   node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
   ```

2. **Set it in Cloudflare:**

   ```bash
   npx wrangler secret put CRON_SECRET --name homepage
   ```

   Or via Cloudflare Dashboard:

   - Workers & Pages → Your Project
   - Settings → Variables and Secrets
   - Add `CRON_SECRET` as an encrypted secret

3. **Test manually with secret:**
   ```bash
   curl -H "X-Cron-Auth: your-secret-here" \
        https://yourdomain.com/api/cron/reminders
   ```

### If you don't set CRON_SECRET:

- Cloudflare cron triggers will work normally (automatic daily at 9 AM UTC)
- Manual testing will work without authentication
- The endpoint is still secure (only sends emails, doesn't expose data)

## Reminders Dashboard

Access at: `/admin/review/reminders`

**Features:**

- View all reminders (upcoming, due, past due)
- Filter by status
- Bulk set/clear reminders
- Quick navigation to review intakes

## Testing the System

### 1. Create a Test Reminder

1. Go to `/admin/review`
2. Select an intake
3. Set a reminder for **today or past date**
4. Save

### 2. Trigger Manually

Visit `/api/cron/reminders` to send emails immediately

### 3. Verify Email

Check your admin email (`EMAIL_BCC` or `ADMIN_EMAIL`) for the reminder notification

## Production Deployment

### Checklist:

- ✅ Cron trigger configured in `wrangler.jsonc` (runs daily at 9 AM UTC)
- ✅ Email configuration set (`EMAIL_FROM`, `EMAIL_BCC`, etc.)
- ✅ `CRON_SECRET` set (optional, for manual testing security)
- ✅ Database tables exist (`intakes` table with `reminder_date` field)

### After Deployment:

- Cron job runs automatically
- No manual intervention needed
- Emails sent when reminder dates arrive
