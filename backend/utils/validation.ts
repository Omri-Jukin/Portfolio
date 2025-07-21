import { z } from "zod";
import { RateLimitConfig } from "./types";

export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(private config: RateLimitConfig) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Get existing requests for this identifier
    const requests = this.requests.get(identifier) || [];

    // Filter out requests outside the current window
    const recentRequests = requests.filter(
      (timestamp) => timestamp > windowStart
    );

    // Check if under the limit
    if (recentRequests.length >= this.config.maxRequests) {
      return false;
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    return true;
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    const requests = this.requests.get(identifier) || [];
    const recentRequests = requests.filter(
      (timestamp) => timestamp > windowStart
    );

    return Math.max(0, this.config.maxRequests - recentRequests.length);
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

// Sanitization utilities
export class Sanitizer {
  static sanitizeHtml(html: string): string {
    // Basic HTML sanitization - in production, use a library like DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "");
  }

  static sanitizeText(text: string): string {
    return text
      .trim()
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .replace(/[<>]/g, ""); // Remove potential HTML tags
  }

  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }
}

// Validation helpers
export class ValidationHelper {
  static validateAndSanitize<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    sanitizeFn?: (data: T) => T
  ): { success: true; data: T } | { success: false; errors: string[] } {
    try {
      const validated = schema.parse(data);
      const sanitized = sanitizeFn ? sanitizeFn(validated) : validated;
      return { success: true, data: sanitized };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: z.ZodIssue) => err.message),
        };
      }
      return {
        success: false,
        errors: ["Validation failed"],
      };
    }
  }

  static async validateAsync<T>(
    schema: z.ZodSchema<T>,
    data: unknown
  ): Promise<
    { success: true; data: T } | { success: false; errors: string[] }
  > {
    try {
      const validated = await schema.parseAsync(data);
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.issues.map((err: z.ZodIssue) => err.message),
        };
      }
      return {
        success: false,
        errors: ["Validation failed"],
      };
    }
  }
}
