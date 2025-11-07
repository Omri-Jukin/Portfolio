<!-- 0130e3ac-59b8-4ed3-887c-ad7bc55a22f9 ecc06640-ab6b-4c05-879d-cabc3b84cd4d -->
# Security Hardening Implementation Plan

## Overview

Implement comprehensive RBAC, secure middleware, API protection, security headers, audit logging, and environment validation to harden the portfolio/admin system based on the database schema.

## Current State Analysis

- ✅ RBAC utilities partially implemented (`lib/auth/rbac.ts`) - has `canAccessAdmin` and `canEditContent`, but missing `canEditTable` and `getUserRole`
- ✅ RBAC tests created (`lib/auth/__tests__/rbac.test.ts`)
- ✅ Rate limiting constants defined (`lib/constants.ts`) and utility class exists (`backend/utils/validation.ts`)
- ❌ Auth still hardcodes role as "admin" in callbacks (not fetching from DB)
- ❌ UserRole type still only has "admin" | "visitor" (needs "editor" and "user")
- ❌ Middleware checks cookie existence but doesn't validate role using getToken
- ❌ Admin layout is still client-side with no SSR guard
- ❌ tRPC has protectedProcedure but no role-based procedures (adminProcedure, editorProcedure)
- ❌ Routers still use inconsistent manual role checks (e.g., `user.role !== "admin"`)
- ❌ No security headers implementation
- ❌ No audit logging implementation
- ❌ No env validation implementation
- ✅ Some routers already filter by `isVisible` (projects, skills, certifications, education, workExperiences)

## Role Structure

- **admin**: Full system access (owner only) - OAuth via Google. Can access admin panel and all system configuration.
- **editor**: Future employees - content management access (projects, skills, blog, etc.), but NOT system configuration (intakes, email templates, calculator settings, pricing, admin dashboard). Cannot access admin panel.
- **user**: Customers/employers - simple login for convenience, NO admin panel access, limited to profile/portfolio viewing. Cannot access admin panel.
- **visitor**: Unauthenticated users - public access only.

**Important**: Users with role "user" or "editor" should NEVER have access to admin panel (`/[locale]/admin/**`). Only "admin" role can access admin panel.

## Implementation Steps

[The detailed steps remain the same as before - see full plan file for complete details]

## Notes

- **Breaking changes are acceptable** - no need to maintain backward compatibility
- **User Login System:** Simple authentication for customers/employers (separate from admin OAuth)
- Users should NEVER have access to admin panel (`/[locale]/admin/**`)
- Users can have accounts for ease of use on return visits
- Future: May migrate to PayloadCMS for employee management
- Test thoroughly with each role type
- Rate limiting infrastructure exists but needs integration
- RBAC foundation is partially complete - needs expansion
- Future: Add database audit table, implement CAPTCHA for contact form
- Existing rate limiting in `backend/utils/validation.ts` can be reused

### To-dos

- [ ] Update UserRole type in lib/db/schema/schema.types.ts from 'admin | visitor' to 'admin | editor | user | visitor'
- [ ] Verify lib/db/schema/schema.tables.ts default value remains 'visitor' for new users
- [ ] Update all type imports/exports that reference UserRole
- [ ] Add canEditTable function to lib/auth/rbac.ts with admin-only table logic
- [ ] Add getUserRole function to lib/auth/rbac.ts with safe role extraction
- [ ] Update Role type in rbac.ts to match expanded UserRole: 'admin | editor | user | visitor'
- [ ] Update lib/auth/__tests__/rbac.test.ts with tests for canEditTable and getUserRole
- [ ] Modify jwt callback in auth.ts to fetch user role from users table by email
- [ ] Modify session callback in auth.ts to use role from JWT token
- [ ] Enhance src/middleware.ts to validate roles using getToken and canAccessAdmin for admin routes
- [ ] Create AdminLayoutClient.tsx component for breadcrumbs/page title (client component)
- [ ] Convert admin layout to server component with SSR auth/role check
- [ ] Create adminProcedure in src/app/server/trpc.ts requiring admin role
- [ ] Create editorProcedure in src/app/server/trpc.ts requiring admin or editor role
- [ ] Create adminOnlyTableProcedure function in trpc.ts using canEditTable
- [ ] Replace manual role checks in intakes.ts with adminProcedure
- [ ] Replace manual role checks in emailTemplates.ts with adminProcedure
- [ ] Replace manual role checks in adminDashboard.ts with adminProcedure
- [ ] Replace manual role checks in pricing.ts with adminProcedure
- [ ] Replace manual role checks in projects, skills, certifications, education, workExperiences, services, testimonials, blog with editorProcedure
- [ ] Ensure all mutations verify createdBy matches session user (unless admin)
- [ ] Create lib/security/headers.ts with CSP, HSTS, XFO, Referrer-Policy, Permissions-Policy, X-Content-Type-Options
- [ ] Add async headers() function to next.config.ts returning security headers
- [ ] Create lib/logging/audit.ts with emitAudit function
- [ ] Integrate audit logging into all mutation endpoints
- [ ] Create lib/env.ts with Zod schema to validate AUTH_SECRET, DATABASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- [ ] Verify all public tRPC queries filter by isVisible=true, ensure admin/editor can see all
- [ ] Integrate RateLimiter into contact form submit mutation
- [ ] Add role-based protection to all API routes in src/app/api/**
- [ ] Create tests/middleware.test.ts to test role-based middleware protection
- [ ] Create tests/api/admin-access.test.ts to test admin endpoint protection with different roles