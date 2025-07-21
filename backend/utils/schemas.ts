import { z } from "zod";

// Common validation schemas
export const emailSchema = z
  .string()
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address");

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters")
  .regex(
    /^[a-zA-Z\s\-']+$/,
    "Name can only contain letters, spaces, hyphens, and apostrophes"
  );

export const phoneSchema = z
  .string()
  .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number");

export const urlSchema = z.string().url("Please enter a valid URL").optional();
