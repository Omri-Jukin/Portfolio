---
name: Pre-Production Fix and Deploy
overview: Fix TypeScript build errors in proposals pages, run pre-production checks (lint, typecheck, build, tests), and prepare for deployment.
todos: []
isProject: false
---

# Pre-Production Fix and Deploy Plan

## Problem Summary

The build currently fails due to type errors in two proposals admin pages. The tRPC API returns `createdAt` and `updatedAt` as ISO strings (via `toISOString()`), but the map callbacks explicitly type the parameter as `TaxProfile` / `ProposalTemplate`, which expect `Date` objects.

## Fixes Required

### 1. Fix type errors in proposals pages

**File:** [src/app/[locale]/(admin)/dashboard/proposals/tax-profiles/page.tsx](src/app/[locale]/(admin)/dashboard/proposals/tax-profiles/page.tsx)

- **Lines 54-61:** Remove the explicit `(profile: TaxProfile)` parameter type. The API returns `createdAt`/`updatedAt` as strings; typing as `TaxProfile` causes a mismatch.
- **Change:** Use an untyped parameter and cast dates when constructing the normalized object:

```ts
const normalizedProfiles: TaxProfile[] = (profiles ?? []).map((profile) => ({
  ...profile,
  createdAt: new Date(profile.createdAt as string),
  updatedAt: new Date(profile.updatedAt as string),
  taxLines: profile.taxLines ?? [],
}));
```

**File:** [src/app/[locale]/(admin)/dashboard/proposals/templates/page.tsx](src/app/[locale]/(admin)/dashboard/proposals/templates/page.tsx)

- **Lines 54-61:** Same pattern. Remove `(template: ProposalTemplate)` and ensure date conversion:

```ts
const normalizedTemplates: ProposalTemplate[] = (templates ?? []).map((template) => ({
  ...template,
  createdAt: new Date(template.createdAt as string),
  updatedAt: new Date(template.updatedAt as string),
  content: template.content ?? {},
}));
```

### 2. Address typecheck / .next/types noise (optional)

The `tsconfig.json` includes `.next/types/**/*.ts`. If `.next` is missing or stale, `npm run typecheck` can fail with "File not found" for generated types. Running `npm run build` performs typecheck as part of the build and regenerates `.next`. A clean before build avoids stale artifacts:

```bash
npm run clean
```

### 3. Pre-production procedure order

Execute in this order:


| Step | Command         | Purpose                                       |
| ---- | --------------- | --------------------------------------------- |
| 1    | `npm run clean` | Remove stale `.next`, `.open-next`, `.turcel` |
| 2    | `npm run lint`  | ESLint on source                              |
| 3    | `npm run build` | Full Next.js build (includes typecheck)       |
| 4    | `npm run test`  | Jest tests                                    |


If step 3 passes, typecheck is satisfied. Step 4 may be skipped if tests are not required for deploy, but recommended.

### 4. Deployment readiness

After all checks pass:

- Commit the type fixes (tax-profiles and templates pages)
- Optionally commit staged changes (proposals module) if desired
- Push and deploy per your usual workflow (e.g. `npm run deploy:pages` or CI/CD)

## Risk Notes

- **Staged proposals module:** Adds new DB tables (`proposal_templates`, `tax_profiles`, `proposals`). Ensure migrations are run before deploy if you commit and push these changes.
- **CI workflow deleted:** Staged changes remove `.github/workflows/ci.yml`. If you rely on GitHub Actions for deploy, unstage or restore that file before pushing.

