# Production Readiness Checklist

## ✅ Automated Checks (I can verify these)

### Code Quality

- [x] **TypeScript compilation** - `npm run typecheck` ✅ PASSED
- [x] **Linting** - `npm run lint` ✅ PASSED (fixed unused variable)
- [ ] **Build test** - `npm run build` (run this manually to verify)
- [ ] **Database connection** - Test via `/api/test-db` endpoint (admin only)

### Configuration

- [x] **Wrangler config** - `wrangler.jsonc` exists and configured
- [ ] **Environment variables** - Check if all required vars are set in Cloudflare
- [ ] **RLS status** - RLS is enabled on all 31 tables ✅ (from your terminal output)

### Security

- [x] **Security headers** - Configured in `next.config.ts`
- [x] **Rate limiting** - Implemented for contact form, email, API
- [x] **RBAC** - Admin/editor procedures implemented
- [x] **API protection** - Admin routes protected
- [x] **Console logs** - Cleaned (only `console.error` and one `console.warn` remain)

---

## ⚠️ CRITICAL: Manual Checks Required

### 1. **RLS Policies** ⚠️ **CRITICAL - BLOCKING**

**Status**: RLS is enabled but **NO POLICIES EXIST**

**Impact**: Without policies, **ALL database queries will be DENIED** in production.

**Action Required**:

```sql
-- You need to create policies for each table. Example for public read access:
CREATE POLICY "Public read access" ON blog_posts
  FOR SELECT USING (is_visible = true);

-- For admin full access:
CREATE POLICY "Admin full access" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
```

**Tables needing policies** (31 total):

- `blog_posts`, `projects`, `skills`, `certifications`, `education`, `work_experiences`
- `services`, `testimonials`, `roles`, `users`
- `intakes`, `email_templates`, `contact_inquiries`
- `pricing_*` tables (7 tables)
- NextAuth tables: `user`, `account`, `session`, `verificationToken`
- System tables: `admin_dashboard_sections`, `calculator_settings`, etc.

**Where to create**:

- Supabase Dashboard → Authentication → Policies
- OR via SQL migration script

---

### 2. **Environment Variables in Cloudflare** ⚠️ **CRITICAL**

**Required Secrets** (set via `wrangler secret put` or Cloudflare Dashboard):

```bash
# Authentication
AUTH_SECRET (or NEXTAUTH_SECRET) - min 32 characters
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

# Database
DATABASE_URL - PostgreSQL connection string

# Supabase Storage (NEW - for media uploads)
SUPABASE_SERVICE_ROLE_KEY - Get from Supabase Dashboard → Settings → API → service_role key

# Email (choose one provider)
GMAIL_USER
GMAIL_APP_PASSWORD
# OR
RESEND_API_KEY
# OR
SENDGRID_API_KEY
# OR
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY

# Cron Jobs
CRON_SECRET - For cron job authentication
```

**Verify**: Run `wrangler secret list` to check which secrets are set.

---

### 3. **Database Setup** ⚠️ **REQUIRED**

**Actions**:

- [ ] Run migrations: `npm run db:migrate` (if using migrations)
- [ ] OR push schema: `npm run db:push` (if using push)
- [ ] Seed database: `npm run seed:database`
- [ ] Verify data exists: Check via Supabase Dashboard or `npm run db:studio`

**Verify**:

- Default roles exist (admin, editor, user, visitor)
- Dashboard sections initialized
- Pricing tables seeded
- Email templates seeded (if applicable)

---

### 4. **Production Build Test** ⚠️ **REQUIRED**

**Before deploying**, test production build locally:

```bash
npm run build
npm run start  # Test production build
```

**Check**:

- [ ] Build completes without errors
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] Database queries work
- [ ] No console errors

---

### 5. **Deployment Verification** ⚠️ **REQUIRED**

**After deploying to Cloudflare**:

**Deploy commands**:

```bash
# For Cloudflare Pages
npm run deploy:pages

# OR for Cloudflare Workers
npm run deploy:worker
```

**Post-deployment checks**:

- [ ] Site loads at production URL
- [ ] HTTPS is working
- [ ] All routes accessible
- [ ] Authentication redirects work
- [ ] Database queries succeed (check browser console)
- [ ] Email sending works (test contact form)
- [ ] File uploads work (blog media)
- [ ] Cron jobs execute (check Cloudflare logs)

---

### 6. **Functional Testing** ⚠️ **REQUIRED**

**Test these flows manually**:

**Public Pages**:

- [ ] Homepage loads
- [ ] Portfolio pages load
- [ ] Blog posts display
- [ ] Contact form submits
- [ ] Intake forms work

**Authentication**:

- [ ] Google OAuth login works
- [ ] Redirect to `/dashboard` after login
- [ ] Logout works
- [ ] Session persists across page refreshes

**Admin Dashboard**:

- [ ] Can access `/dashboard`
- [ ] All dashboard sections load
- [ ] Can create/edit blog posts
- [ ] Can manage projects, skills, etc.
- [ ] Can upload files (images/videos)
- [ ] Pricing management works
- [ ] DND reordering works

**Security**:

- [ ] Non-admin users redirected to `/403`
- [ ] Admin-only routes protected
- [ ] Rate limiting works (try submitting contact form multiple times)

---

### 7. **Performance & Monitoring** ⚠️ **RECOMMENDED**

**Check**:

- [ ] Page load times acceptable (< 3s)
- [ ] Images optimized
- [ ] No excessive API calls
- [ ] Database queries optimized
- [ ] Error tracking set up (optional: Sentry, LogRocket)

---

### 8. **Content Review** ⚠️ **REQUIRED**

**Manual review**:

- [ ] All text is accurate and proofread
- [ ] All links work (internal and external)
- [ ] Images display correctly
- [ ] Dates are correct
- [ ] Contact information is correct
- [ ] Resume download works (if applicable)

---

### 9. **Cross-Browser Testing** ⚠️ **RECOMMENDED**

**Test in**:

- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Edge (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (iOS)
- [ ] Chrome (Android)

---

### 10. **SSL & Domain** ⚠️ **REQUIRED**

**Verify**:

- [ ] Custom domain configured (`omrijukin.com`)
- [ ] SSL certificate active
- [ ] HTTPS redirects work
- [ ] DNS records correct

---

## 🚨 **BLOCKING ISSUES** (Must fix before production)

1. **❌ RLS Policies Missing** - Without policies, database queries will fail
2. **❌ Environment Variables** - Must be set in Cloudflare before deployment
   - **NEW**: `SUPABASE_SERVICE_ROLE_KEY` required for media uploads
3. **❌ Database Seeding** - Must run `npm run seed:database` before going live
4. **❌ Supabase Storage Bucket** - The `blog-media` bucket will be created automatically on first upload, but ensure `SUPABASE_SERVICE_ROLE_KEY` is set

---

## 📋 **Quick Pre-Deployment Checklist**

Run these commands in order:

```bash
# 1. Code quality
npm run typecheck
npm run lint

# 2. Build test
npm run build

# 3. Database setup
npm run seed:database

# 4. Verify RLS policies exist (check Supabase Dashboard)

# 5. Set Cloudflare secrets
wrangler secret put AUTH_SECRET
wrangler secret put DATABASE_URL
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
# ... (other secrets)

# 6. Deploy
npm run deploy:pages  # or deploy:worker

# 7. Test production site
# Visit https://omrijukin.com and test all functionality
```

---

## 📝 **Notes**

- **RLS Policies**: The most critical missing piece. Without policies, your app will not work in production.
- **Environment Variables**: Must be set in Cloudflare, not just locally.
- **Database Seeding**: Run after migrations but before first production use.
- **Testing**: Test thoroughly in production environment, not just locally.

---

**Last Updated**: After RLS enablement
**Status**: ⚠️ **NOT READY** - RLS policies must be created before production deployment
