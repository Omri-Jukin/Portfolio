# Build Exclusions Guide

This document explains how to exclude files and folders from the build process in this Next.js project.

## Methods Overview

There are several ways to exclude files/folders depending on your needs:

1. **TypeScript Compilation** - Exclude from type checking
2. **Next.js Output File Tracing** - Exclude from serverless bundles
3. **Webpack Bundling** - Exclude from client/server bundles
4. **Git Ignore** - Exclude from version control (also affects some build tools)

---

## 1. TypeScript Compilation Exclusions

**File:** `tsconfig.json`

Files/folders listed in the `exclude` array won't be type-checked by TypeScript.

```json
{
  "exclude": ["node_modules", "docs", "scripts", "tests", ".next", ".open-next"]
}
```

**Use when:** You want to exclude files from TypeScript type checking but they might still be needed at runtime.

---

## 2. Next.js Output File Tracing Exclusions

**File:** `next.config.ts`

Files listed in `experimental.outputFileTracingExcludes` won't be included in serverless function bundles, reducing bundle size.

```typescript
experimental: {
  outputFileTracingExcludes: {
    "*": [
      "scripts/**",
      "docs/**",
      "tests/**",
      "node_modules/**/@swc/core-*/**",
    ],
  },
}
```

**Use when:** You want to reduce serverless bundle size by excluding files that aren't needed at runtime.

---

## 3. Webpack Bundling Exclusions

**File:** `next.config.ts`

### Method A: Prevent Client-Side Imports

Use `resolve.alias` to prevent specific paths from being imported in client-side code:

```typescript
webpack: (config, { isServer }) => {
  if (!isServer) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@/scripts": false, // Prevents importing scripts in client
      "#/scripts": false,
    };
  }
  return config;
};
```

**Use when:** You want to prevent accidental imports of server-only code in client components.

### Method B: Webpack Externals

For server-side code, you can mark modules as external (not bundled):

```typescript
webpack: (config, { isServer }) => {
  if (isServer) {
    config.externals = config.externals || [];
    config.externals.push({
      // Add modules that should not be bundled
    });
  }
  return config;
};
```

---

## 4. Common Exclusions

Based on your project structure, here are common folders you might want to exclude:

- `scripts/` - Build/seed scripts (not needed in production)
- `docs/` - Documentation files
- `tests/` - Test files
- `roadmap/` - Planning documents
- `backups/` - Backup files
- `.cursor/` - IDE configuration
- `prompts/` - Development prompts

---

## 5. OpenNext/Cloudflare Specific

When using OpenNext for Cloudflare deployment, the build process respects:

- `.gitignore` patterns
- `next.config.ts` exclusions
- TypeScript `exclude` patterns

The `outputFileTracingExcludes` in `next.config.ts` is particularly important for Cloudflare Workers as it reduces the bundle size significantly.

---

## Examples

### Exclude Scripts Folder

**tsconfig.json:**

```json
{
  "exclude": ["node_modules", "docs", "scripts"]
}
```

**next.config.ts:**

```typescript
experimental: {
  outputFileTracingExcludes: {
    "*": ["scripts/**"],
  },
},
webpack: (config, { isServer }) => {
  if (!isServer) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "#/scripts": false,
    };
  }
  return config;
}
```

### Exclude Test Files

**tsconfig.json:**

```json
{
  "exclude": ["node_modules", "docs", "tests"]
}
```

**next.config.ts:**

```typescript
experimental: {
  outputFileTracingExcludes: {
    "*": ["tests/**", "**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts"],
  },
}
```

---

## Verification

After making changes, verify exclusions are working:

```bash
# Type check (should not check excluded files)
npm run typecheck

# Build (check bundle size)
npm run build

# Check what's included in the build
ls -la .next/
```

---

## Notes

- Excluding files from TypeScript doesn't prevent them from being imported at runtime
- `outputFileTracingExcludes` only affects serverless function bundles, not static assets
- Webpack aliases set to `false` will throw an error if imported in client code (helpful for preventing mistakes)
- Always test your build after adding exclusions to ensure nothing breaks
