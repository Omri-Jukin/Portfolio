// Rate limiting utilities
export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}
