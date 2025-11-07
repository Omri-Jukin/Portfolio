/**
 * Environment variable validation
 * Validates critical environment variables at application startup
 */

import { z } from "zod";

/**
 * Schema for validating critical environment variables
 */
const envSchema = z.object({
  // Authentication
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET must be at least 32 characters long")
    .or(z.string().min(32)), // Also accept NEXTAUTH_SECRET for backward compatibility
  NEXTAUTH_SECRET: z.string().min(32).optional(), // Fallback for backward compatibility

  // Database
  DATABASE_URL: z
    .string()
    .url("DATABASE_URL must be a valid URL")
    .refine(
      (url) => url.startsWith("postgresql://") || url.startsWith("postgres://"),
      "DATABASE_URL must be a PostgreSQL connection string"
    ),

  // Google OAuth
  GOOGLE_CLIENT_ID: z
    .string()
    .min(1, "GOOGLE_CLIENT_ID is required")
    .refine(
      (id) => id.includes(".apps.googleusercontent.com") || id.length > 20,
      "GOOGLE_CLIENT_ID appears to be invalid"
    ),
  GOOGLE_CLIENT_SECRET: z
    .string()
    .min(1, "GOOGLE_CLIENT_SECRET is required")
    .refine(
      (secret) => secret.length >= 20,
      "GOOGLE_CLIENT_SECRET appears to be invalid"
    ),
});

/**
 * Validated environment variables
 * This will throw an error at module load time if validation fails
 */
export const env = (() => {
  // Get AUTH_SECRET with fallback to NEXTAUTH_SECRET
  const authSecret =
    process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "";

  // Prepare environment object for validation
  const envToValidate = {
    AUTH_SECRET: authSecret,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL || "",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  };

  // Check if we're in a build-time context (Next.js static analysis)
  const isBuildTime =
    typeof process !== "undefined" &&
    (process.env.NEXT_PHASE === "phase-production-build" ||
      process.env.NEXT_PHASE === "phase-development-build" ||
      process.env.CI === "true");

  // Only validate at runtime in production, not during build
  // In development/build time, we allow missing values for flexibility
  const shouldValidate =
    !isBuildTime &&
    (process.env.NODE_ENV === "production" ||
      process.env.VALIDATE_ENV === "true");

  if (shouldValidate) {
    try {
      return envSchema.parse(envToValidate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join("\n");

        console.error(
          "❌ Environment variable validation failed:\n",
          errorMessages
        );
        console.error(
          "\nPlease ensure all required environment variables are set correctly."
        );

        // In production runtime (not build), throw to prevent app from starting with invalid config
        if (process.env.NODE_ENV === "production" && !isBuildTime) {
          throw new Error(
            `Environment validation failed:\n${errorMessages}\n\nApplication cannot start with invalid configuration.`
          );
        }
      }
      throw error;
    }
  }

  // In development/build, return the values as-is (may be empty)
  // This allows the app to start even if some env vars are missing
  return {
    AUTH_SECRET: authSecret,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL || "",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  };
})();

/**
 * Validate environment variables and return a result object
 * This is useful for checking env vars without throwing errors
 */
export function validateEnv(): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Get AUTH_SECRET with fallback
  const authSecret =
    process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "";

  // Validate AUTH_SECRET
  if (!authSecret) {
    errors.push("AUTH_SECRET or NEXTAUTH_SECRET is required");
  } else if (authSecret.length < 32) {
    errors.push("AUTH_SECRET must be at least 32 characters long");
  }

  // Validate DATABASE_URL
  if (!process.env.DATABASE_URL) {
    errors.push("DATABASE_URL is required");
  } else {
    try {
      const url = new URL(process.env.DATABASE_URL);
      if (!url.protocol.startsWith("postgres")) {
        errors.push("DATABASE_URL must be a PostgreSQL connection string");
      }
    } catch {
      errors.push("DATABASE_URL must be a valid URL");
    }
  }

  // Validate Google OAuth
  if (!process.env.GOOGLE_CLIENT_ID) {
    errors.push("GOOGLE_CLIENT_ID is required");
  } else if (
    !process.env.GOOGLE_CLIENT_ID.includes(".apps.googleusercontent.com") &&
    process.env.GOOGLE_CLIENT_ID.length <= 20
  ) {
    warnings.push("GOOGLE_CLIENT_ID appears to be invalid");
  }

  if (!process.env.GOOGLE_CLIENT_SECRET) {
    errors.push("GOOGLE_CLIENT_SECRET is required");
  } else if (process.env.GOOGLE_CLIENT_SECRET.length < 20) {
    warnings.push("GOOGLE_CLIENT_SECRET appears to be invalid");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get a validated environment variable
 * Throws if the variable is missing and required
 */
export function getEnvVar(
  key: keyof typeof env,
  required = true
): string | undefined {
  const value = env[key];

  if (required && !value) {
    throw new Error(
      `Required environment variable ${key} is not set or invalid`
    );
  }

  return value;
}
