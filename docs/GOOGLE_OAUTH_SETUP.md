# Google OAuth Setup Guide

## Prerequisites

You need to set up Google OAuth credentials before the authentication will work.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project name and ID

## Step 2: Configure OAuth Consent Screen

1. Navigate to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in the required fields:
   - App name: `Omri Jukin Portfolio Admin`
   - User support email: `omrijukin@gmail.com`
   - Developer contact: `omrijukin@gmail.com`
4. Click **Save and Continue**
5. Add scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
6. Click **Save and Continue**
7. Add test users (if in testing mode):
   - `omrijukin@gmail.com`
8. Click **Save and Continue**

## Step 3: Create OAuth 2.0 Credentials

1. Navigate to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. Select **Web application** as the application type
4. Set the name: `Portfolio Admin Auth`
5. Add **Authorized JavaScript origins**:
   - Development: `http://localhost:3000`
   - Production: `https://omrijukin.com`
6. Add **Authorized redirect URIs**:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://omrijukin.com/api/auth/callback/google`
7. Click **Create**
8. **IMPORTANT**: Copy your **Client ID** and **Client Secret**

## Step 4: Add Environment Variables Locally

Add to your `.env.local` file:

\`\`\`env

# Google OAuth

GOOGLE_CLIENT_ID=your_client_id_from_step_3
GOOGLE_CLIENT_SECRET=your_client_secret_from_step_3

# NextAuth

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here
\`\`\`

To generate a secure NEXTAUTH_SECRET, run:
\`\`\`bash
openssl rand -base64 32
\`\`\`

Or use online generator: https://generate-secret.vercel.app/32

## Step 5: Add Cloudflare Secrets (Production)

Run these commands to add secrets to Cloudflare:

\`\`\`bash
npx wrangler secret put GOOGLE_CLIENT_ID

# Paste your Client ID when prompted

npx wrangler secret put GOOGLE_CLIENT_SECRET

# Paste your Client Secret when prompted

npx wrangler secret put NEXTAUTH_SECRET

# Paste your generated secret when prompted

\`\`\`

Add to `wrangler.jsonc` under `vars`:
\`\`\`json
{
"vars": {
"NEXTAUTH_URL": "https://omrijukin.com"
}
}
\`\`\`

## Step 6: Test Locally

1. Start the dev server: `npm run dev`
2. Navigate to `http://localhost:3000/en/login`
3. Click **Sign in with Google**
4. Authorize with `omrijukin@gmail.com`
5. You should be redirected to `/en/admin`

## Step 7: Deploy to Production

1. Ensure all secrets are set in Cloudflare
2. Run: `npm run deploy`
3. Test at `https://omrijukin.com/en/login`

## Troubleshooting

### "Error 400: redirect_uri_mismatch"

- Make sure the redirect URI in Google Console exactly matches your callback URL
- Check for trailing slashes and http vs https

### "Access blocked: This app's request is invalid"

- OAuth consent screen not configured properly
- Add test users in Google Console

### "Unauthorized" after successful Google login

- Check that your email (`omrijukin@gmail.com`) is hardcoded in `lib/auth/config.ts`
- Verify the signIn callback is allowing your email

## Security Notes

- Only `omrijukin@gmail.com` is allowed to sign in (hardcoded in config)
- All other emails will be rejected
- Sessions are stored in the database
- Passwords are no longer used for admin authentication

## References

- [Google OAuth Documentation](https://support.google.com/cloud/answer/6158849)
- [NextAuth.js Google Provider](https://next-auth.js.org/providers/google)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
