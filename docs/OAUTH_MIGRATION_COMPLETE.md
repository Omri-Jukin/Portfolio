# Google OAuth Migration - Complete

## ✅ Migration Status

All code changes have been successfully implemented. The admin authentication system has been migrated from password-based login to Google OAuth.

## What Was Changed

### 1. Database Schema

- ✅ Password field made nullable in `users` table
- ✅ Added OAuth provider fields: `provider`, `providerId`, `image`
- ✅ Migration generated and applied successfully

### 2. Dependencies

- ✅ Installed `next-auth` (v4)
- ✅ Installed `@auth/drizzle-adapter`

### 3. Authentication Configuration

- ✅ Created `lib/auth/config.ts` with NextAuth configuration
- ✅ Created `lib/auth/types.ts` for TypeScript type extensions
- ✅ Configured Google OAuth provider
- ✅ Set up admin-only access (hardcoded: `omrijukin@gmail.com`)

### 4. API Routes

- ✅ Created `/api/auth/[...nextauth]/route.ts` for NextAuth handler
- ✅ Simplified `src/app/server/routers/auth.ts` (removed password mutations)

### 5. UI Changes

- ✅ Updated `src/app/[locale]/login/page.tsx` with "Sign in with Google" button
- ✅ Removed password input fields
- ✅ Added SessionProvider wrapper in layout

### 6. Context & Session Management

- ✅ Updated `src/app/server/context.ts` to use NextAuth sessions
- ✅ Replaced JWT verification with `getServerSession`
- ✅ Wrapped app in `SessionProvider` component

### 7. Configuration Files

- ✅ Updated `wrangler.jsonc` with NextAuth variables
- ✅ Created `.env.example` template
- ✅ Updated documentation

## Next Steps (Required User Action)

### Step 1: Set Up Google OAuth Credentials

Follow the guide: `docs/GOOGLE_OAUTH_SETUP.md`

You need to:

1. Create Google Cloud project (or use existing)
2. Configure OAuth consent screen
3. Create OAuth 2.0 credentials
4. Get your Client ID and Client Secret

### Step 2: Add Local Environment Variables

Add to your `.env.local` file:

\`\`\`env

# Google OAuth (from Step 1)

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth Secret (generate with: openssl rand -base64 32)

NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000

# Existing variables (keep these)

DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
\`\`\`

### Step 3: Test Locally

\`\`\`bash
npm run dev
\`\`\`

1. Navigate to `http://localhost:3000/en/login`
2. Click "Sign in with Google"
3. Authorize with `omrijukin@gmail.com`
4. Verify redirect to `/en/admin`
5. Check that admin dashboard loads correctly

### Step 4: Add Cloudflare Secrets (Production)

\`\`\`bash
npx wrangler secret put GOOGLE_CLIENT_ID

# Paste your Client ID

npx wrangler secret put GOOGLE_CLIENT_SECRET

# Paste your Client Secret

npx wrangler secret put NEXTAUTH_SECRET

# Paste your generated secret (same as local)

\`\`\`

### Step 5: Deploy to Production

\`\`\`bash
npm run lint
npm run build
npm run deploy
\`\`\`

### Step 6: Test Production

1. Navigate to `https://omrijukin.com/en/login`
2. Click "Sign in with Google"
3. Authorize with `omrijukin@gmail.com`
4. Verify redirect to `/en/admin`
5. Test admin functionality

## Security Features

- ✅ Only `omrijukin@gmail.com` can sign in (hardcoded in config)
- ✅ All other emails are rejected at OAuth callback
- ✅ Sessions stored securely in database
- ✅ No more password management needed
- ✅ Leverages Google's security infrastructure

## Removed Features

The following password-based auth endpoints have been removed:

- `auth.login` mutation (replaced by Google OAuth)
- `auth.register` mutation (admin-only, no registration needed)
- `auth.getPendingUsers` query (no user approval workflow needed)
- `auth.approveUser` mutation (no user approval workflow needed)
- `auth.rejectUser` mutation (no user approval workflow needed)
- `auth.refresh` mutation (NextAuth handles session refresh)

Kept endpoints:

- `auth.me` query (returns current user from session)
- `auth.logout` mutation (for backward compatibility, though NextAuth handles this)

## Troubleshooting

### "redirect_uri_mismatch" Error

- Ensure redirect URIs in Google Console match exactly:
  - Dev: `http://localhost:3000/api/auth/callback/google`
  - Prod: `https://omrijukin.com/api/auth/callback/google`

### "Unauthorized" After Google Login

- Check that `omrijukin@gmail.com` is hardcoded in `lib/auth/config.ts`
- Verify the signIn callback is allowing your email

### Database Connection Issues

- Ensure `DATABASE_URL` is still set in Cloudflare secrets
- Check that database migration was applied successfully

### Session Not Persisting

- Verify `NEXTAUTH_SECRET` is set in both local and Cloudflare
- Check that SessionProvider is wrapping the app in layout

## Rollback Plan (If Needed)

If you need to rollback to password-based authentication:

1. Revert files from git:
   \`\`\`bash
   git checkout HEAD~1 -- lib/auth/
   git checkout HEAD~1 -- src/app/server/routers/auth.ts
   git checkout HEAD~1 -- src/app/[locale]/login/page.tsx
   git checkout HEAD~1 -- src/app/server/context.ts
   \`\`\`

2. Remove NextAuth packages:
   \`\`\`bash
   npm uninstall next-auth @auth/drizzle-adapter
   \`\`\`

3. Revert database schema (make password NOT NULL again)

## References

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup Guide](docs/GOOGLE_OAUTH_SETUP.md)
- [Drizzle ORM Adapter](https://authjs.dev/reference/adapter/drizzle)
