# OAuth Production Troubleshooting Guide

## Quick Diagnosis

Run through this checklist to identify the issue:

### 1. Check Cloudflare Secrets ✅

Verify all required secrets are set in Cloudflare:

```bash
# List all secrets (won't show values, but will show if they exist)
npx wrangler secret list
```

**Required secrets:**

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_SECRET`
- `DATABASE_URL`

If any are missing, set them:

```bash
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler secret put NEXTAUTH_SECRET
npx wrangler secret put DATABASE_URL
```

### 2. Verify Google OAuth Configuration ✅

Go to [Google Cloud Console](https://console.cloud.google.com/):

1. Navigate to **APIs & Services** → **Credentials**
2. Click on your OAuth 2.0 Client ID
3. Verify **Authorized redirect URIs** includes:

   ```
   https://omrijukin.com/api/auth/callback/google
   ```

   ⚠️ Must be HTTPS, not HTTP
   ⚠️ No trailing slash
   ⚠️ Exact match required

4. Verify **Authorized JavaScript origins** includes:
   ```
   https://omrijukin.com
   ```

### 3. Check Database Migration Status ✅

The NextAuth tables must exist in production database:

```bash
# Connect to your production database and run:
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('user', 'account', 'session', 'verificationToken');
```

**Expected tables:**

- `user`
- `account`
- `session`
- `verificationToken`

If missing, apply the migration:

```bash
# Generate migration (if not already generated)
npx drizzle-kit generate

# Push to production database
# Set DATABASE_URL to your production database first
npx drizzle-kit push
```

### 4. Test Production Deployment

Deploy with logging enabled:

```bash
npm run build
npm run deploy
```

Then check logs:

```bash
npx wrangler tail
```

### 5. Common Error Messages & Solutions

#### "redirect_uri_mismatch"

**Problem:** Google OAuth redirect URI doesn't match
**Solution:**

1. Go to Google Console → Credentials
2. Add exact URL: `https://omrijukin.com/api/auth/callback/google`
3. Wait 5-10 minutes for changes to propagate

#### "NEXTAUTH_URL not set"

**Problem:** Environment variable not available
**Solution:**

1. Verify in `wrangler.jsonc`: `"NEXTAUTH_URL": "https://omrijukin.com"`
2. Redeploy: `npm run deploy`

#### "Database connection failed"

**Problem:** DATABASE_URL not set or incorrect
**Solution:**

```bash
npx wrangler secret put DATABASE_URL
# Paste your Supabase connection string
```

#### "Table does not exist"

**Problem:** Migration not applied
**Solution:**

```bash
npx drizzle-kit push
```

#### "Access denied" or "Unauthorized"

**Problem:** Email not whitelisted or signIn callback rejecting
**Solution:**

1. Verify in `lib/auth/config.ts` line 18: `user.email === "omrijukin@gmail.com"`
2. Check production logs for sign-in attempts: `npx wrangler tail`

### 6. Debug Mode - Add More Logging

Temporarily add debug mode to `lib/auth/config.ts`:

```typescript
export const authOptions: NextAuthOptions = {
  debug: true, // Add this line
  adapter: DrizzleAdapter(await getDB()) as Adapter,
  // ... rest of config
};
```

Then deploy and check logs:

```bash
npm run deploy
npx wrangler tail
```

### 7. Verify Production URL Configuration

Check these files:

**wrangler.jsonc:**

```json
"vars": {
  "NEXTAUTH_URL": "https://omrijukin.com",
  "NEXT_PUBLIC_BASE_URL": "https://omrijukin.com"
}
```

**Google OAuth Console:**

- Authorized redirect URIs: `https://omrijukin.com/api/auth/callback/google`
- Authorized JavaScript origins: `https://omrijukin.com`

### 8. Test Login Flow

1. Navigate to: `https://omrijukin.com/en/login`
2. Click "Sign in with Google"
3. Select `omrijukin@gmail.com`
4. Should redirect to: `https://omrijukin.com/en/admin`

### 9. Check Browser Console

Open browser DevTools (F12) and check:

- **Network tab:** Look for failed requests to `/api/auth/*`
- **Console tab:** Look for JavaScript errors
- **Application tab → Cookies:** Check if `next-auth.session-token` cookie is set

### 10. Manual Database Check

If you have database access, verify the tables exist:

```sql
-- Check if NextAuth tables exist
\dt public.user
\dt public.account
\dt public.session
\dt public."verificationToken"

-- After a login attempt, check if data was created
SELECT * FROM public.user WHERE email = 'omrijukin@gmail.com';
SELECT * FROM public.account WHERE provider = 'google';
```

## Deployment Checklist

Before deploying, ensure:

- [x] Database migration applied (`npx drizzle-kit push`)
- [ ] Cloudflare secrets set (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET, DATABASE_URL)
- [ ] Google OAuth URIs configured for https://omrijukin.com
- [ ] wrangler.jsonc has correct NEXTAUTH_URL
- [ ] Code built successfully (`npm run build`)
- [ ] Deployed (`npm run deploy`)
- [ ] Tested login at https://omrijukin.com/en/login

## Quick Fix Script

Run this to set all secrets at once:

```bash
# Create a temporary script
cat > set-production-secrets.sh << 'EOF'
#!/bin/bash
echo "Setting Cloudflare secrets for production..."

echo "Setting GOOGLE_CLIENT_ID..."
npx wrangler secret put GOOGLE_CLIENT_ID

echo "Setting GOOGLE_CLIENT_SECRET..."
npx wrangler secret put GOOGLE_CLIENT_SECRET

echo "Setting NEXTAUTH_SECRET..."
npx wrangler secret put NEXTAUTH_SECRET

echo "Setting DATABASE_URL..."
npx wrangler secret put DATABASE_URL

echo "All secrets set! Now deploy:"
echo "npm run deploy"
EOF

chmod +x set-production-secrets.sh
./set-production-secrets.sh
```

## Still Not Working?

1. Check Cloudflare Workers logs: `npx wrangler tail`
2. Enable debug mode in auth config
3. Verify database connection in production
4. Check if NextAuth tables have data after login attempt
5. Review browser network tab for error responses

## Contact Support

If still having issues, provide:

- Error message from browser console
- Error message from `npx wrangler tail`
- Screenshot of Google OAuth configuration
- Output of `npx wrangler secret list`
