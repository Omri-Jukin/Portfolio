/**
 * Rate limiting utility for tRPC procedures
 * Provides rate limiting based on IP address or user identifier
 */

import { RATE_LIMITS } from "$/constants";
import { getIpAddress } from "$/logging/audit";

/**
 * In-memory rate limiter
 * Note: In a distributed environment, consider using Redis or Cloudflare KV
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(private maxRequests: number, private windowMs: number) {}

  /**
   * Check if a request is allowed
   * @param identifier - Unique identifier (IP address, email, user ID, etc.)
   * @returns true if allowed, false if rate limit exceeded
   */
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing requests for this identifier
    const requests = this.requests.get(identifier) || [];

    // Filter out requests outside the current window
    const recentRequests = requests.filter(
      (timestamp) => timestamp > windowStart
    );

    // Check if under the limit
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    // Clean up old entries periodically (every 1000 requests)
    if (this.requests.size > 1000) {
      this.cleanup();
    }

    return true;
  }

  /**
   * Get remaining requests for an identifier
   */
  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    const requests = this.requests.get(identifier) || [];
    const recentRequests = requests.filter(
      (timestamp) => timestamp > windowStart
    );

    return Math.max(0, this.maxRequests - recentRequests.length);
  }

  /**
   * Get time until rate limit resets (in milliseconds)
   */
  getResetTime(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    const requests = this.requests.get(identifier) || [];
    const recentRequests = requests.filter(
      (timestamp) => timestamp > windowStart
    );

    if (recentRequests.length === 0) {
      return 0;
    }

    const oldestRequest = Math.min(...recentRequests);
    return oldestRequest + this.windowMs - now;
  }

  /**
   * Reset rate limit for an identifier
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  /**
   * Clean up old entries
   */
  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    for (const [identifier, requests] of this.requests.entries()) {
      const recentRequests = requests.filter(
        (timestamp) => timestamp > windowStart
      );

      if (recentRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, recentRequests);
      }
    }
  }
}

// Create rate limiters for different use cases
export const contactFormRateLimiter = new RateLimiter(
  RATE_LIMITS.CONTACT_FORM.maxRequests,
  RATE_LIMITS.CONTACT_FORM.windowMs
);

export const emailSendRateLimiter = new RateLimiter(
  RATE_LIMITS.EMAIL_SEND.maxRequests,
  RATE_LIMITS.EMAIL_SEND.windowMs
);

export const apiGeneralRateLimiter = new RateLimiter(
  RATE_LIMITS.API_GENERAL.maxRequests,
  RATE_LIMITS.API_GENERAL.windowMs
);

/**
 * Get identifier for rate limiting
 * Uses IP address for anonymous users, email for authenticated users
 */
export function getRateLimitIdentifier(
  req: Request | null,
  email?: string | null
): string {
  // Prefer email if available (more stable identifier)
  if (email) {
    return `email:${email.toLowerCase()}`;
  }

  // Fall back to IP address
  const ipAddress = getIpAddress(req);
  if (ipAddress) {
    return `ip:${ipAddress}`;
  }

  // Last resort: use a default identifier (should rarely happen)
  return "anonymous";
}

/**
 * Check rate limit and throw error if exceeded
 */
export function checkRateLimit(
  rateLimiter: RateLimiter,
  identifier: string
): void {
  if (!rateLimiter.isAllowed(identifier)) {
    const resetTime = rateLimiter.getResetTime(identifier);
    const resetSeconds = Math.ceil(resetTime / 1000);

    throw new Error(
      `Rate limit exceeded. Please try again in ${resetSeconds} second${
        resetSeconds !== 1 ? "s" : ""
      }.`
    );
  }
}
