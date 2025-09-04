/**
 * Centralized constants for the entire Portfolio application
 * Single source of truth for all shared constants, enums, and configuration values
 */

// ========================
// ANIMATION CONSTANTS
// ========================

/**
 *  Duration constants for animations, Duration is in seconds
 */
export const ANIMATION_DURATIONS = {
  /** Ultra fast animations */
  ULTRA_FAST: 0.1,
  /** Fast animations */
  FAST: 0.3,
  /** Normal duration for most UI transitions */
  NORMAL: 0.6,
  /** Medium duration for content animations */
  MEDIUM: 0.8,
  /** Slow duration for page transitions */
  SLOW: 1.0,
  /** Very slow for complex animations */
  VERY_SLOW: 1.2,
} as const;

/**
 *  Delay constants for staggered animations, Delay is in seconds
 */
export const ANIMATION_DELAYS = {
  /** No delay */
  NONE: 0,
  /** Small delay for staggered animations */
  SMALL: 0.1,
  /** Medium delay */
  MEDIUM: 0.2,
  /** Large delay */
  LARGE: 0.4,
  /** Extra large delay */
  EXTRA_LARGE: 0.6,
  /** Maximum delay */
  MAX: 1.0,
} as const;

/**
 *  Increment constants for staggered animations, Increment is in seconds
 */
export const ANIMATION_INCREMENTS = {
  /** Small increment for staggered animations */
  SMALL: 0.1,
  /** Medium increment */
  MEDIUM: 0.15,
  /** Large increment */
  LARGE: 0.2,
  /** Extra large increment */
  EXTRA_LARGE: 0.3,
} as const;

/**
 *  Easing constants for animations
 */
export const ANIMATION_EASING = {
  LINEAR: "linear",
  EASE_IN: "easeIn",
  EASE_OUT: "easeOut",
  EASE_IN_OUT: "easeInOut",
  CUBIC_BEZIER: "cubic-bezier(0.4, 0, 0.2, 1)",
  BOUNCE: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
} as const;

// ========================
// LAYOUT CONSTANTS
// ========================

/**
 *  Layout types for responsive components
 */
export const LAYOUT_TYPES = {
  MOBILE: "mobile",
  DESKTOP: "desktop",
  AUTO: "auto",
} as const;

/**
 *  Breakpoints for responsive layouts
 */
export const RESPONSIVE_BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200,
  LARGE_DESKTOP: 1440,
} as const;

/**
 *  Layout dimensions for spacing and sizing
 */
export const LAYOUT_DIMENSIONS = {
  HEADER_HEIGHT: 64,
  SIDEBAR_WIDTH: 240,
  MOBILE_SIDEBAR_WIDTH: 280,
  MAX_CONTENT_WIDTH: 1200,
  GRID_SPACING: 24,
} as const;

// ========================
// THEME CONSTANTS
// ========================

/**
 *  Theme modes for dark and light themes
 */
export const THEME_MODES = {
  LIGHT: "light",
  DARK: "dark",
} as const;

/**
 *  Theme configuration values
 */
export const THEME_CONFIG = {
  STORAGE_KEY: "theme-mode",
  DEFAULT_MODE: "light",
  ANIMATION_DURATION: 0.3,
} as const;

// ========================
// TYPOGRAPHY CONSTANTS
// ========================

/**
 *  Typography variants for text
 */
export const TYPOGRAPHY_VARIANTS = {
  H1: "h1",
  H2: "h2",
  H3: "h3",
  H4: "h4",
  H5: "h5",
  H6: "h6",
  BODY1: "body1",
  BODY2: "body2",
  CAPTION: "caption",
  SUBTITLE1: "subtitle1",
  SUBTITLE2: "subtitle2",
  OVERLINE: "overline",
} as const;

/**
 * Typography weights for text
 */
export const TYPOGRAPHY_WEIGHTS = {
  LIGHT: "light",
  NORMAL: "normal",
  MEDIUM: "medium",
  BOLD: "bold",
  EXTRA_BOLD: "extraBold",
} as const;

/**
 *  Typography alignments for text
 */
export const TYPOGRAPHY_ALIGNS = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
  JUSTIFY: "justify",
} as const;

/**
 * Font sizes in rem
 */
export const FONT_SIZES = [
  "0.75rem", // 12px
  "0.875rem", // 14px
  "1rem", // 16px
  "1.125rem", // 18px
  "1.25rem", // 20px
  "1.5rem", // 24px
  "2rem", // 32px
  "2.5rem", // 40px
  "3rem", // 48px
  "4rem", // 64px
  "5rem", // 80px
  "6rem", // 96px
] as const;

// ========================
// BUTTON VARIANTS
// ========================

/**
 * Button variants for different styles
 */
export const BUTTON_VARIANTS = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  OUTLINED: "outlined",
  TEXT: "text",
  CONTAINED: "contained",
  ROUNDED: "rounded",
  PILL: "pill",
  SQUARE: "square",
  GRADIENT: "gradient",
  NEON: "neon",
  GLASS: "glass",
} as const;

/**
 * Button sizes for different sizes
 */
export const BUTTON_SIZES = {
  XS: "xs",
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
  XL: "xl",
} as const;

// ========================
// SOCIAL MEDIA CONSTANTS
// ========================

/**
 * Social media platform constants
 */
export const SOCIAL_PLATFORMS = {
  GITHUB: "github",
  LINKEDIN: "linkedin",
  TWITTER: "twitter",
  INSTAGRAM: "instagram",
  EMAIL: "email",
  PHONE: "phone",
  WHATSAPP: "whatsapp",
  TELEGRAM: "telegram",
} as const;

/**
 * Social media colors for different platforms
 */
export const SOCIAL_COLORS = {
  [SOCIAL_PLATFORMS.GITHUB]: "#181717",
  [SOCIAL_PLATFORMS.LINKEDIN]: "#0077B5",
  [SOCIAL_PLATFORMS.TWITTER]: "#1DA1F2",
  [SOCIAL_PLATFORMS.INSTAGRAM]: "#E4405F",
  [SOCIAL_PLATFORMS.EMAIL]: "#EA4335",
  [SOCIAL_PLATFORMS.PHONE]: "#34A853",
  [SOCIAL_PLATFORMS.WHATSAPP]: "#25D366",
  [SOCIAL_PLATFORMS.TELEGRAM]: "#0088CC",
} as const;

// ========================
// NAVIGATION CONSTANTS
// ========================

/**
 * Navigation items for the header
 */
export const NAVIGATION_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Career", href: "/career" },
  { label: "Projects", href: "/projects" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
] as const;

// ========================
// LOCALE CONSTANTS
// ========================

/**
 * Locale codes for different languages
 */
export const LOCALES = {
  ENGLISH: "en",
  SPANISH: "es",
  FRENCH: "fr",
  HEBREW: "he",
} as const;

export const VALID_LOCALES = Object.values(LOCALES);

// ========================
// SECTION IDS
// ========================

/**
 * Section IDs for different sections
 */
export const SECTION_IDS = {
  HERO: "hero-section",
  ABOUT: "about-section",
  CAREER: "career-section",
  PROJECTS: "projects-section",
  CONTACT: "contact-section",
  SERVICES: "services-section",
  SKILLS: "skills-section",
  RESUME: "resume-section",
} as const;

// ========================
// FORM CONSTANTS
// ========================

/**
 * Form IDs for different forms
 */
export const FORM_IDS = {
  CONTACT_FORM: "contact-form",
  CONTACT_NAME: "contact-form-name",
  CONTACT_EMAIL: "contact-form-email",
  CONTACT_PHONE: "contact-form-phone",
  CONTACT_SUBJECT: "contact-form-subject",
  CONTACT_MESSAGE: "contact-form-message",
  CONTACT_BUTTON: "contact-form-button",
} as const;

/**
 * Form validation rules
 */
export const FORM_VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  SUBJECT_MIN_LENGTH: 3,
  SUBJECT_MAX_LENGTH: 200,
  MESSAGE_MIN_LENGTH: 10,
  MESSAGE_MAX_LENGTH: 2000,
  PASSWORD_MIN_LENGTH: 6,
} as const;

// ========================
// DATA GRID CONSTANTS
// ========================

/**
 * Data grid configuration values
 */
export const DATA_GRID_CONFIG = {
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
  DEFAULT_PAGE_SIZE: 10,
  QUICK_FILTER_DEBOUNCE_MS: 500,
  DEFAULT_HEIGHT: 400,
  ROW_HEIGHT: 52,
} as const;

// ========================
// COLOR PALETTE
// ========================

/**
 * Color palette for the app
 */
export const COLOR_PALETTE = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#FFEAA7", // Yellow
  "#DDA0DD", // Purple
  "#FF8A65", // Orange
  "#81C784", // Light Green
  "#64B5F6", // Light Blue
  "#FFB74D", // Amber
  "#F06292", // Pink
  "#9575CD", // Deep Purple
  "#25D366", // WhatsApp green
  "#0088CC", // Telegram blue
  "#0077B5", // LinkedIn blue
  "#181717", // GitHub black
  "#EA4335", // Email red
  "#34A853", // Phone green
] as const;

// ========================
// ANIMATION MAPPINGS
// ========================

/**
 * Path animation mappings
 */
export const PATH_ANIMATION_MAPPINGS = {
  "": "torusKnot",
  home: "torusKnot",
  about: "dna",
  contact: "stars",
  blog: "polyhedron",
  career: "dna",
  resume: "torusKnot",
  admin: "stars",
} as const;

// ========================
// CAMERA AND LIGHTING CONFIG
// ========================

/**
 * Camera configuration values
 */
export const CAMERA_CONFIG = {
  POSITION: [0, 0, 10] as [number, number, number],
  FOV: 75,
} as const;

/**
 * Lighting configuration values
 */
export const LIGHTING_CONFIG = {
  AMBIENT: {
    DARK: { intensity: 0.2, color: "#001122" },
    LIGHT: { intensity: 0.4, color: "#112244" },
  },
  DIRECTIONAL: {
    DARK: { intensity: 2.0, color: "#00BFFF" },
    LIGHT: { intensity: 1.0, color: "#0066CC" },
  },
} as const;

// ========================
// FILE UPLOAD CONSTANTS
// ========================

/**
 * File upload configuration values
 */
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
} as const;

// ========================
// RATE LIMITING
// ========================

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  CONTACT_FORM: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  EMAIL_SEND: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  API_GENERAL: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
} as const;

// ========================
// DATABASE CONSTANTS
// ========================

/**
 * Database limits
 */
export const DB_LIMITS = {
  TITLE_MAX_LENGTH: 200,
  SUBTITLE_MAX_LENGTH: 300,
  DESCRIPTION_MAX_LENGTH: 1000,
  LONG_DESCRIPTION_MAX_LENGTH: 5000,
  CODE_MAX_LENGTH: 5000,
  URL_MAX_LENGTH: 500,
  NAME_MAX_LENGTH: 100,
  COMPANY_MAX_LENGTH: 200,
  LOCATION_MAX_LENGTH: 100,
  ROLE_MAX_LENGTH: 200,
  TECHNOLOGY_MAX_LENGTH: 50,
  SKILL_MAX_LENGTH: 50,
  CATEGORY_MAX_LENGTH: 50,
  ACHIEVEMENT_MAX_LENGTH: 500,
  RESPONSIBILITY_MAX_LENGTH: 500,
  FEATURE_MAX_LENGTH: 200,
  CHALLENGE_MAX_LENGTH: 1000,
  SOLUTION_MAX_LENGTH: 1000,
  EXPLANATION_MAX_LENGTH: 1000,
  INDUSTRY_MAX_LENGTH: 100,
  BUDGET_MAX_LENGTH: 100,
  CLIENT_MAX_LENGTH: 200,
} as const;

// ========================
// STATUS ENUMS
// ========================

/**
 * User roles
 */
export const USER_ROLES = {
  ADMIN: "admin",
  VISITOR: "visitor",
} as const;

/**
 * User statuses
 */
export const USER_STATUSES = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

/**
 * Post statuses
 */
export const POST_STATUSES = {
  DRAFT: "draft",
  PUBLISHED: "published",
} as const;

/**
 * Inquiry statuses
 */
export const INQUIRY_STATUSES = {
  OPEN: "open",
  CLOSED: "closed",
} as const;

/**
 * Certification categories
 */
export const CERTIFICATION_CATEGORIES = {
  TECHNICAL: "technical",
  CLOUD: "cloud",
  SECURITY: "security",
  PROJECT_MANAGEMENT: "project-management",
  DESIGN: "design",
  OTHER: "other",
} as const;

/**
 * Certification statuses
 */
export const CERTIFICATION_STATUSES = {
  ACTIVE: "active",
  EXPIRED: "expired",
  REVOKED: "revoked",
} as const;

/**
 * Employment types
 */
export const EMPLOYMENT_TYPES = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  CONTRACT: "contract",
  FREELANCE: "freelance",
  INTERNSHIP: "internship",
} as const;

/**
 * Project statuses
 */
export const PROJECT_STATUSES = {
  COMPLETED: "completed",
  IN_PROGRESS: "in-progress",
  ARCHIVED: "archived",
  CONCEPT: "concept",
  DELETED: "deleted",
  CANCELLED: "cancelled",
} as const;

/**
 * Project types
 */
export const PROJECT_TYPES = {
  PROFESSIONAL: "professional",
  PERSONAL: "personal",
  OPEN_SOURCE: "open-source",
  ACADEMIC: "academic",
} as const;

/**
 * Skill categories
 */
export const SKILL_CATEGORIES = {
  TECHNICAL: "technical",
  SOFT: "soft",
  LANGUAGE: "language",
  TOOL: "tool",
  FRAMEWORK: "framework",
  DATABASE: "database",
  CLOUD: "cloud",
} as const;

/**
 * Proficiency levels
 */
export const PROFICIENCY_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
  EXPERT: "expert",
} as const;

// ========================
// ACCESSIBILITY LABELS
// ========================

/**
 * Accessibility labels
 */
export const ACCESSIBILITY_LABELS = {
  EXPLORE_WORK: "Explore my work and projects",
  VIEW_RESUME: "View my resume",
  VIEW_CAREER: "View my career",
  TOGGLE_DARK_MODE: "Toggle dark mode",
  TOGGLE_LIGHT_MODE: "Toggle light mode",
  PORTFOLIO_LOGO: "Portfolio Logo",
  NAVIGATION_MENU: "Navigation menu",
  SKIP_TO_CONTENT: "Skip to main content",
  BACK_TO_TOP: "Back to top",
} as const;

// ========================
// EXPORT TYPES
// ========================

export type LayoutType = (typeof LAYOUT_TYPES)[keyof typeof LAYOUT_TYPES];
export type ThemeMode = (typeof THEME_MODES)[keyof typeof THEME_MODES];
export type SocialPlatform =
  (typeof SOCIAL_PLATFORMS)[keyof typeof SOCIAL_PLATFORMS];
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];
export type PostStatus = (typeof POST_STATUSES)[keyof typeof POST_STATUSES];
export type InquiryStatus =
  (typeof INQUIRY_STATUSES)[keyof typeof INQUIRY_STATUSES];
export type CertificationCategory =
  (typeof CERTIFICATION_CATEGORIES)[keyof typeof CERTIFICATION_CATEGORIES];
export type CertificationStatus =
  (typeof CERTIFICATION_STATUSES)[keyof typeof CERTIFICATION_STATUSES];
export type EmploymentType =
  (typeof EMPLOYMENT_TYPES)[keyof typeof EMPLOYMENT_TYPES];
export type ProjectStatus =
  (typeof PROJECT_STATUSES)[keyof typeof PROJECT_STATUSES];
export type ProjectType = (typeof PROJECT_TYPES)[keyof typeof PROJECT_TYPES];
export type SkillCategory =
  (typeof SKILL_CATEGORIES)[keyof typeof SKILL_CATEGORIES];
export type ProficiencyLevel =
  (typeof PROFICIENCY_LEVELS)[keyof typeof PROFICIENCY_LEVELS];
export type Locale = (typeof LOCALES)[keyof typeof LOCALES];
export type ButtonVariant =
  (typeof BUTTON_VARIANTS)[keyof typeof BUTTON_VARIANTS];
export type ButtonSize = (typeof BUTTON_SIZES)[keyof typeof BUTTON_SIZES];
export type TypographyVariant =
  (typeof TYPOGRAPHY_VARIANTS)[keyof typeof TYPOGRAPHY_VARIANTS];
export type TypographyWeight =
  (typeof TYPOGRAPHY_WEIGHTS)[keyof typeof TYPOGRAPHY_WEIGHTS];
export type TypographyAlign =
  (typeof TYPOGRAPHY_ALIGNS)[keyof typeof TYPOGRAPHY_ALIGNS];
