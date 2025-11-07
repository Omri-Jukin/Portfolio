/**
 * Security headers configuration
 * Provides security headers for Next.js application
 */

/**
 * Get security headers for the application
 * @param request - The incoming request (optional, for dynamic CSP)
 * @returns Object with security headers
 */
export function getSecurityHeaders(): Record<string, string> {
  const isProduction = process.env.NODE_ENV === "production";

  // Content Security Policy
  // Allow self, Google OAuth, and common CDNs
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://apis.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com data:",
    "connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com",
    "frame-src 'self' https://accounts.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ];

  // Add report-uri in production if configured
  if (isProduction && process.env.CSP_REPORT_URI) {
    cspDirectives.push(`report-uri ${process.env.CSP_REPORT_URI}`);
  }

  const headers: Record<string, string> = {
    // Content Security Policy
    "Content-Security-Policy": cspDirectives.join("; "),

    // Strict Transport Security (HSTS)
    "Strict-Transport-Security": isProduction
      ? "max-age=31536000; includeSubDomains; preload"
      : "max-age=0",

    // X-Frame-Options (prevent clickjacking)
    "X-Frame-Options": "DENY",

    // X-Content-Type-Options (prevent MIME type sniffing)
    "X-Content-Type-Options": "nosniff",

    // Referrer-Policy (control referrer information)
    "Referrer-Policy": "strict-origin-when-cross-origin",

    // Permissions-Policy (control browser features)
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), interest-cohort=()",

    // X-XSS-Protection (legacy, but still useful for older browsers)
    "X-XSS-Protection": "1; mode=block",
  };

  return headers;
}

/**
 * Get security headers as Next.js Headers object
 * @param request - The incoming request (optional)
 * @returns Headers object compatible with Next.js
 */
export function getSecurityHeadersAsNextHeaders(): Headers {
  const headers = new Headers();
  const securityHeaders = getSecurityHeaders();

  for (const [key, value] of Object.entries(securityHeaders)) {
    headers.set(key, value);
  }

  return headers;
}
