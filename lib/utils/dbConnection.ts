/**
 * Database connection utilities
 * Handles URL encoding for passwords with special characters and SSL configuration
 */

/**
 * Encodes the password in a PostgreSQL connection string and ensures SSL is configured
 * This is necessary because special characters in passwords must be URL-encoded
 * and cloud providers (Supabase/Neon) require SSL connections
 */
export function encodeDatabaseUrl(urlString: string): string {
  try {
    const url = new URL(urlString);
    const password = url.password;

    // If password contains special characters, encode it
    if (password && /[!@#$%^&*()+=\[\]{}|;:'",<>?\/\\]/.test(password)) {
      // Check if already encoded (contains %)
      if (!password.includes("%")) {
        const encodedPassword = encodeURIComponent(password);
        url.password = encodedPassword;
      }
    }

    // Ensure SSL mode is set for cloud providers (Supabase/Neon require SSL)
    if (!url.searchParams.has("sslmode")) {
      url.searchParams.set("sslmode", "require");
    }

    return url.toString();
  } catch {
    // If URL parsing fails, return as-is
    return urlString;
  }
}
