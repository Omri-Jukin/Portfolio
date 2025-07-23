// Form field configurations
export const FORM_FIELDS = {
  NAME: "name",
  EMAIL: "email",
  SUBJECT: "subject",
  MESSAGE: "message",
} as const;

// Validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  MIN_LENGTH: (field: string, min: number) =>
    `${field} must be at least ${min} characters long`,
  MAX_LENGTH: (field: string, max: number) =>
    `${field} must be no more than ${max} characters long`,
} as const;

// Form submission states
export const SUBMISSION_STATES = {
  IDLE: "idle",
  SUBMITTING: "submitting",
  SUCCESS: "success",
  ERROR: "error",
} as const;

// Animation durations
export const ANIMATION_DURATIONS = {
  SUCCESS: 3000,
  ERROR: 5000,
  TRANSITION: 300,
} as const;
