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
  CYBERSECURITY: "cybersecurity",
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
// PDF GENERATOR CONSTANTS
// ========================

/**
 * PDF theme configuration for resume generation
 */
export const PDF_THEMES = {
  // Professional Themes
  corporate: {
    headerBg: [41, 98, 255] as [number, number, number],
    headerAccent: [255, 193, 7] as [number, number, number],
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [41, 98, 255] as [number, number, number],
    rule: [41, 98, 255] as [number, number, number],
    // CSS equivalents for UI
    cssHeaderBg: "rgb(41, 98, 255)",
    cssHeaderAccent: "rgb(255, 193, 7)",
    cssAccent: "rgb(41, 98, 255)",
  },
  executive: {
    headerBg: [25, 25, 25] as [number, number, number],
    headerAccent: [212, 175, 55] as [number, number, number],
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [25, 25, 25] as [number, number, number],
    rule: [25, 25, 25] as [number, number, number],
    cssHeaderBg: "rgb(25, 25, 25)",
    cssHeaderAccent: "rgb(212, 175, 55)",
    cssAccent: "rgb(25, 25, 25)",
  },
  banking: {
    headerBg: [0, 51, 102] as [number, number, number],
    headerAccent: [255, 215, 0] as [number, number, number],
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [0, 51, 102] as [number, number, number],
    rule: [0, 51, 102] as [number, number, number],
    cssHeaderBg: "rgb(0, 51, 102)",
    cssHeaderAccent: "rgb(255, 215, 0)",
    cssAccent: "rgb(0, 51, 102)",
  },

  // Modern Themes
  modern: {
    headerBg: [0, 150, 136] as [number, number, number],
    headerAccent: undefined,
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [0, 150, 136] as [number, number, number],
    rule: [0, 150, 136] as [number, number, number],
    cssHeaderBg: "rgb(0, 150, 136)",
    cssHeaderAccent: undefined,
    cssAccent: "rgb(0, 150, 136)",
  },
  startup: {
    headerBg: [255, 87, 34] as [number, number, number],
    headerAccent: [255, 193, 7] as [number, number, number],
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [255, 87, 34] as [number, number, number],
    rule: [255, 87, 34] as [number, number, number],
    cssHeaderBg: "rgb(255, 87, 34)",
    cssHeaderAccent: "rgb(255, 193, 7)",
    cssAccent: "rgb(255, 87, 34)",
  },
  tech: {
    headerBg: [33, 150, 243] as [number, number, number],
    headerAccent: [76, 175, 80] as [number, number, number],
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [33, 150, 243] as [number, number, number],
    rule: [33, 150, 243] as [number, number, number],
    cssHeaderBg: "rgb(33, 150, 243)",
    cssHeaderAccent: "rgb(76, 175, 80)",
    cssAccent: "rgb(33, 150, 243)",
  },

  // Creative Themes
  creative: {
    headerBg: [156, 39, 176] as [number, number, number],
    headerAccent: [255, 193, 7] as [number, number, number],
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [156, 39, 176] as [number, number, number],
    rule: [156, 39, 176] as [number, number, number],
    cssHeaderBg: "rgb(156, 39, 176)",
    cssHeaderAccent: "rgb(255, 193, 7)",
    cssAccent: "rgb(156, 39, 176)",
  },
  artistic: {
    headerBg: [255, 152, 0] as [number, number, number],
    headerAccent: [233, 30, 99] as [number, number, number],
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [255, 152, 0] as [number, number, number],
    rule: [255, 152, 0] as [number, number, number],
    cssHeaderBg: "rgb(255, 152, 0)",
    cssHeaderAccent: "rgb(233, 30, 99)",
    cssAccent: "rgb(255, 152, 0)",
  },
  design: {
    headerBg: [233, 30, 99] as [number, number, number],
    headerAccent: [255, 193, 7] as [number, number, number],
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [233, 30, 99] as [number, number, number],
    rule: [233, 30, 99] as [number, number, number],
    cssHeaderBg: "rgb(233, 30, 99)",
    cssHeaderAccent: "rgb(255, 193, 7)",
    cssAccent: "rgb(233, 30, 99)",
  },

  // Minimalist Themes
  minimal: {
    headerBg: [96, 125, 139] as [number, number, number],
    headerAccent: undefined,
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [96, 125, 139] as [number, number, number],
    rule: [96, 125, 139] as [number, number, number],
    cssHeaderBg: "rgb(96, 125, 139)",
    cssHeaderAccent: undefined,
    cssAccent: "rgb(96, 125, 139)",
  },
  clean: {
    headerBg: [158, 158, 158] as [number, number, number],
    headerAccent: undefined,
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [158, 158, 158] as [number, number, number],
    rule: [158, 158, 158] as [number, number, number],
    cssHeaderBg: "rgb(158, 158, 158)",
    cssHeaderAccent: undefined,
    cssAccent: "rgb(158, 158, 158)",
  },
  academic: {
    headerBg: [69, 90, 120] as [number, number, number],
    headerAccent: [255, 193, 7] as [number, number, number],
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [69, 90, 120] as [number, number, number],
    rule: [69, 90, 120] as [number, number, number],
    cssHeaderBg: "rgb(69, 90, 120)",
    cssHeaderAccent: "rgb(255, 193, 7)",
    cssAccent: "rgb(69, 90, 120)",
  },

  // Colorful Themes
  teal: {
    headerBg: [0, 121, 107] as [number, number, number],
    headerAccent: undefined,
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [0, 121, 107] as [number, number, number],
    rule: [0, 121, 107] as [number, number, number],
    cssHeaderBg: "rgb(0, 121, 107)",
    cssHeaderAccent: undefined,
    cssAccent: "rgb(0, 121, 107)",
  },
  indigo: {
    headerBg: [63, 81, 181] as [number, number, number],
    headerAccent: undefined,
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [63, 81, 181] as [number, number, number],
    rule: [63, 81, 181] as [number, number, number],
    cssHeaderBg: "rgb(63, 81, 181)",
    cssHeaderAccent: undefined,
    cssAccent: "rgb(63, 81, 181)",
  },
  rose: {
    headerBg: [233, 30, 99] as [number, number, number],
    headerAccent: undefined,
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [233, 30, 99] as [number, number, number],
    rule: [233, 30, 99] as [number, number, number],
    cssHeaderBg: "rgb(233, 30, 99)",
    cssHeaderAccent: undefined,
    cssAccent: "rgb(233, 30, 99)",
  },
  emerald: {
    headerBg: [0, 150, 136] as [number, number, number],
    headerAccent: [76, 175, 80] as [number, number, number],
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [0, 150, 136] as [number, number, number],
    rule: [0, 150, 136] as [number, number, number],
    cssHeaderBg: "rgb(0, 150, 136)",
    cssHeaderAccent: "rgb(76, 175, 80)",
    cssAccent: "rgb(0, 150, 136)",
  },
  violet: {
    headerBg: [103, 58, 183] as [number, number, number],
    headerAccent: [255, 193, 7] as [number, number, number],
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [103, 58, 183] as [number, number, number],
    rule: [103, 58, 183] as [number, number, number],
    cssHeaderBg: "rgb(103, 58, 183)",
    cssHeaderAccent: "rgb(255, 193, 7)",
    cssAccent: "rgb(103, 58, 183)",
  },
  amber: {
    headerBg: [255, 193, 7] as [number, number, number],
    headerAccent: [255, 87, 34] as [number, number, number],
    name: [0, 0, 0] as [number, number, number],
    title: [0, 0, 0] as [number, number, number],
    contacts: [0, 0, 0] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [255, 193, 7] as [number, number, number],
    rule: [255, 193, 7] as [number, number, number],
    cssHeaderBg: "rgb(255, 193, 7)",
    cssHeaderAccent: "rgb(255, 87, 34)",
    cssAccent: "rgb(255, 193, 7)",
  },
  cyan: {
    headerBg: [0, 188, 212] as [number, number, number],
    headerAccent: [255, 193, 7] as [number, number, number],
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [0, 188, 212] as [number, number, number],
    rule: [0, 188, 212] as [number, number, number],
    cssHeaderBg: "rgb(0, 188, 212)",
    cssHeaderAccent: "rgb(255, 193, 7)",
    cssAccent: "rgb(0, 188, 212)",
  },
  lime: {
    headerBg: [139, 195, 74] as [number, number, number],
    headerAccent: [255, 193, 7] as [number, number, number],
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [139, 195, 74] as [number, number, number],
    rule: [139, 195, 74] as [number, number, number],
    cssHeaderBg: "rgb(139, 195, 74)",
    cssHeaderAccent: "rgb(255, 193, 7)",
    cssAccent: "rgb(139, 195, 74)",
  },
  deepOrange: {
    headerBg: [255, 87, 34] as [number, number, number],
    headerAccent: [255, 193, 7] as [number, number, number],
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [255, 87, 34] as [number, number, number],
    rule: [255, 87, 34] as [number, number, number],
    cssHeaderBg: "rgb(255, 87, 34)",
    cssHeaderAccent: "rgb(255, 193, 7)",
    cssAccent: "rgb(255, 87, 34)",
  },
  deepPurple: {
    headerBg: [103, 58, 183] as [number, number, number],
    headerAccent: [255, 193, 7] as [number, number, number],
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [103, 58, 183] as [number, number, number],
    rule: [103, 58, 183] as [number, number, number],
    cssHeaderBg: "rgb(103, 58, 183)",
    cssHeaderAccent: "rgb(255, 193, 7)",
    cssAccent: "rgb(103, 58, 183)",
  },
  brown: {
    headerBg: [121, 85, 72] as [number, number, number],
    headerAccent: [255, 193, 7] as [number, number, number],
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [121, 85, 72] as [number, number, number],
    rule: [121, 85, 72] as [number, number, number],
    cssHeaderBg: "rgb(121, 85, 72)",
    cssHeaderAccent: "rgb(255, 193, 7)",
    cssAccent: "rgb(121, 85, 72)",
  },
  blueGrey: {
    headerBg: [69, 90, 120] as [number, number, number],
    headerAccent: [255, 193, 7] as [number, number, number],
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [69, 90, 120] as [number, number, number],
    rule: [69, 90, 120] as [number, number, number],
    cssHeaderBg: "rgb(69, 90, 120)",
    cssHeaderAccent: "rgb(255, 193, 7)",
    cssAccent: "rgb(69, 90, 120)",
  },
} as const;

/**
 * PDF layout configuration
 */
export const PDF_LAYOUT = {
  A4: { w: 210, h: 297 }, // mm
  MARGINS: { x: 15, y: 10 },
  HEADER_HEIGHT: 30,
  FONT_SIZES: {
    name: 24,
    title: 14,
    sectionHeader: 12,
    body: 10,
    small: 9,
    contacts: 10,
  },
  LINE_HEIGHTS: {
    normal: 1.2,
    tight: 1.0,
  },
  SPACING: {
    sectionGap: 3,
    paragraphGap: 3,
    bulletGap: 3.5,
    experienceGap: 2,
    ruleGap: 5,
  },
};

/**
 * PDF layout variants for different visual styles
 */
export const PDF_LAYOUT_VARIANTS = {
  single: {
    name: "Single Column",
    description: "Traditional single-column layout",
    columns: 1,
    sidebarWidth: 0,
    mainContentWidth: 180,
    spacing: {
      sectionGap: 3.5,
      paragraphGap: 3.5,
      bulletGap: 3.5,
      experienceGap: 2.5,
      ruleGap: 5,
    },
  },
  twoColumn: {
    name: "Two Column",
    description: "Two-column layout with sidebar",
    columns: 2,
    sidebarWidth: 60,
    mainContentWidth: 120,
  },
  sidebar: {
    name: "Sidebar Layout",
    description: "Sidebar with main content area",
    columns: 2,
    sidebarWidth: 70,
    mainContentWidth: 110,
  },
  compact: {
    name: "Compact",
    description: "Dense layout for maximum content",
    columns: 1,
    sidebarWidth: 0,
    mainContentWidth: 180,
    spacing: {
      sectionGap: 2,
      paragraphGap: 2,
      bulletGap: 2.5,
      experienceGap: 1,
      ruleGap: 3,
    },
  },
  spacious: {
    name: "Spacious",
    description: "Generous spacing for readability",
    columns: 1,
    sidebarWidth: 0,
    mainContentWidth: 180,
    spacing: {
      sectionGap: 5,
      paragraphGap: 4,
      bulletGap: 4.5,
      experienceGap: 3,
      ruleGap: 7,
    },
  },
} as const;

/**
 * PDF visual elements configuration
 */
export const PDF_VISUAL_ELEMENTS = {
  icons: {
    enabled: true,
    size: 3, // mm
    spacing: 2, // mm from text
  },
  borders: {
    enabled: true,
    width: 0.5, // mm
    radius: 2, // mm
  },
  shadows: {
    enabled: true,
    offset: { x: 1, y: 1 }, // mm
    blur: 2, // mm
    color: [0, 0, 0, 0.1], // RGBA
  },
  gradients: {
    enabled: true,
    steps: 3,
  },
  patterns: {
    enabled: true,
    types: ["dots", "lines", "diagonal", "grid"] as const,
  },
} as const;

/**
 * PDF typography variants
 */
export const PDF_TYPOGRAPHY_VARIANTS = {
  serif: {
    name: "Serif",
    font: "times",
    description: "Classic serif font for traditional look",
  },
  sansSerif: {
    name: "Sans Serif",
    font: "helvetica",
    description: "Modern sans-serif font",
  },
  monospace: {
    name: "Monospace",
    font: "courier",
    description: "Fixed-width font for technical content",
  },
} as const;

/**
 * Resume template mapping for UI to PDF themes
 */
export const RESUME_TEMPLATE_MAPPING = {
  // Professional Templates
  modern: "modern",
  elegant: "minimal",
  tech: "tech",
  corporate: "corporate",
  executive: "executive",
  banking: "banking",
  startup: "startup",
  academic: "academic",

  // Creative Templates
  creative: "creative",
  artistic: "artistic",
  design: "design",

  // Minimalist Templates
  minimal: "minimal",
  clean: "clean",

  // Colorful Templates
  teal: "teal",
  indigo: "indigo",
  rose: "rose",
  emerald: "emerald",
  violet: "violet",
  amber: "amber",
  cyan: "cyan",
  lime: "lime",
  deepOrange: "deepOrange",
  deepPurple: "deepPurple",
  brown: "brown",
  blueGrey: "blueGrey",
} as const;

export type IntakeFormCurrencyMapping = {
  name: string;
  symbol: string;
  code: string;
};

/**
 * Intake form currency mapping for currencies that we support
 */
export const INTAKE_FORM_CURRENCY_MAPPING: Record<
  string,
  IntakeFormCurrencyMapping
> = {
  ILS: {
    name: "ILS - Israeli Shekel",
    symbol: "₪",
    code: "ILS",
  },
  USD: {
    name: "USD - US Dollar",
    symbol: "$",
    code: "USD",
  },
  EUR: {
    name: "EUR - Euro",
    symbol: "€",
    code: "EUR",
  },
  GBP: {
    name: "GBP - British Pound",
    symbol: "£",
    code: "GBP",
  },
  CAD: {
    name: "CAD - Canadian Dollar",
    symbol: "CA$",
    code: "CAD",
  },
  AUD: {
    name: "AUD - Australian Dollar",
    symbol: "A$",
    code: "AUD",
  },
  JPY: {
    name: "JPY - Japanese Yen",
    symbol: "¥",
    code: "JPY",
  },
  CHF: {
    name: "CHF - Swiss Franc",
    symbol: "CHF",
    code: "CHF",
  },
  CNY: {
    name: "CNY - Chinese Yuan",
    symbol: "¥",
    code: "CNY",
  },
  INR: {
    name: "INR - Indian Rupee",
    symbol: "₹",
    code: "INR",
  },
  BRL: {
    name: "BRL - Brazilian Real",
    symbol: "R$",
    code: "BRL",
  },
  MXN: {
    name: "MXN - Mexican Peso",
    symbol: "MX$",
    code: "MXN",
  },
  ZAR: {
    name: "ZAR - South African Rand",
    symbol: "R",
    code: "ZAR",
  },
  SEK: {
    name: "SEK - Swedish Krona",
    symbol: "kr",
    code: "SEK",
  },
  NOK: {
    name: "NOK - Norwegian Krone",
    symbol: "kr",
    code: "NOK",
  },
  DKK: {
    name: "DKK - Danish Krone",
    symbol: "kr",
    code: "DKK",
  },
  PLN: {
    name: "PLN - Polish Zloty",
    symbol: "zł",
    code: "PLN",
  },
  RUB: {
    name: "RUB - Russian Ruble",
    symbol: "₽",
    code: "RUB",
  },
} as const;

// Currency code type extracted from the mapping keys
export type IntakeFormCurrencyCode = keyof typeof INTAKE_FORM_CURRENCY_MAPPING;

/**
 * Get GMT offset for a timezone
 * Returns format like "GMT+2" or "GMT-5"
 */
export function getGMTOffset(timezone: string): string {
  if (typeof window === "undefined") {
    // Server-side: return placeholder, will be calculated client-side
    return "";
  }

  try {
    const now = new Date();

    // More reliable method: use Intl.DateTimeFormat with formatToParts
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(now);
    const offsetPart = parts.find((part) => part.type === "timeZoneName");

    if (offsetPart) {
      return offsetPart.value.replace("GMT", "GMT");
    }

    // Fallback: calculate offset manually
    const utc = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
    const tz = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
    const offsetMs = tz.getTime() - utc.getTime();
    const offsetHours = offsetMs / (1000 * 60 * 60);
    const sign = offsetHours >= 0 ? "+" : "-";
    const absOffset = Math.abs(offsetHours);
    return `GMT${sign}${Math.floor(absOffset)}`;
  } catch {
    return "";
  }
}

/**
 * Common timezones for intake form
 * Using IANA timezone identifiers
 */
export const COMMON_TIMEZONES = [
  { value: "UTC", label: "UTC", getLabel: () => "UTC (GMT±0)" },
  {
    value: "America/New_York",
    label: "Eastern Time",
    getLabel: () => "Eastern Time (US & Canada) - GMT-5",
  },
  {
    value: "America/Chicago",
    label: "Central Time",
    getLabel: () => "Central Time (US & Canada) - GMT-6",
  },
  {
    value: "America/Denver",
    label: "Mountain Time",
    getLabel: () => "Mountain Time (US & Canada) - GMT-7",
  },
  {
    value: "America/Los_Angeles",
    label: "Pacific Time",
    getLabel: () => "Pacific Time (US & Canada) - GMT-8",
  },
  {
    value: "America/Toronto",
    label: "Eastern Time (Canada)",
    getLabel: () => "Eastern Time (Canada) - GMT-5",
  },
  {
    value: "America/Vancouver",
    label: "Pacific Time (Canada)",
    getLabel: () => "Pacific Time (Canada) - GMT-8",
  },
  { value: "Europe/London", label: "London", getLabel: () => "London - GMT±0" },
  { value: "Europe/Paris", label: "Paris", getLabel: () => "Paris - GMT+1" },
  { value: "Europe/Berlin", label: "Berlin", getLabel: () => "Berlin - GMT+1" },
  { value: "Europe/Rome", label: "Rome", getLabel: () => "Rome - GMT+1" },
  { value: "Europe/Madrid", label: "Madrid", getLabel: () => "Madrid - GMT+1" },
  {
    value: "Europe/Amsterdam",
    label: "Amsterdam",
    getLabel: () => "Amsterdam - GMT+1",
  },
  {
    value: "Europe/Brussels",
    label: "Brussels",
    getLabel: () => "Brussels - GMT+1",
  },
  { value: "Europe/Vienna", label: "Vienna", getLabel: () => "Vienna - GMT+1" },
  { value: "Europe/Zurich", label: "Zurich", getLabel: () => "Zurich - GMT+1" },
  {
    value: "Europe/Stockholm",
    label: "Stockholm",
    getLabel: () => "Stockholm - GMT+1",
  },
  {
    value: "Europe/Copenhagen",
    label: "Copenhagen",
    getLabel: () => "Copenhagen - GMT+1",
  },
  { value: "Europe/Oslo", label: "Oslo", getLabel: () => "Oslo - GMT+1" },
  {
    value: "Europe/Helsinki",
    label: "Helsinki",
    getLabel: () => "Helsinki - GMT+2",
  },
  { value: "Europe/Warsaw", label: "Warsaw", getLabel: () => "Warsaw - GMT+1" },
  { value: "Europe/Prague", label: "Prague", getLabel: () => "Prague - GMT+1" },
  {
    value: "Europe/Budapest",
    label: "Budapest",
    getLabel: () => "Budapest - GMT+1",
  },
  { value: "Europe/Athens", label: "Athens", getLabel: () => "Athens - GMT+2" },
  { value: "Europe/Dublin", label: "Dublin", getLabel: () => "Dublin - GMT±0" },
  { value: "Europe/Lisbon", label: "Lisbon", getLabel: () => "Lisbon - GMT±0" },
  {
    value: "Asia/Jerusalem",
    label: "Jerusalem",
    getLabel: () => "Jerusalem - GMT+2",
  },
  { value: "Asia/Dubai", label: "Dubai", getLabel: () => "Dubai - GMT+4" },
  { value: "Asia/Riyadh", label: "Riyadh", getLabel: () => "Riyadh - GMT+3" },
  { value: "Asia/Kuwait", label: "Kuwait", getLabel: () => "Kuwait - GMT+3" },
  {
    value: "Asia/Bahrain",
    label: "Bahrain",
    getLabel: () => "Bahrain - GMT+3",
  },
  { value: "Asia/Qatar", label: "Qatar", getLabel: () => "Qatar - GMT+3" },
  { value: "Asia/Muscat", label: "Muscat", getLabel: () => "Muscat - GMT+4" },
  {
    value: "Asia/Kolkata",
    label: "Mumbai, Delhi, Kolkata",
    getLabel: () => "Mumbai, Delhi, Kolkata - GMT+5:30",
  },
  {
    value: "Asia/Karachi",
    label: "Karachi",
    getLabel: () => "Karachi - GMT+5",
  },
  { value: "Asia/Dhaka", label: "Dhaka", getLabel: () => "Dhaka - GMT+6" },
  {
    value: "Asia/Colombo",
    label: "Colombo",
    getLabel: () => "Colombo - GMT+5:30",
  },
  {
    value: "Asia/Kathmandu",
    label: "Kathmandu",
    getLabel: () => "Kathmandu - GMT+5:45",
  },
  {
    value: "Asia/Bangkok",
    label: "Bangkok",
    getLabel: () => "Bangkok - GMT+7",
  },
  {
    value: "Asia/Jakarta",
    label: "Jakarta",
    getLabel: () => "Jakarta - GMT+7",
  },
  { value: "Asia/Manila", label: "Manila", getLabel: () => "Manila - GMT+8" },
  {
    value: "Asia/Singapore",
    label: "Singapore",
    getLabel: () => "Singapore - GMT+8",
  },
  {
    value: "Asia/Kuala_Lumpur",
    label: "Kuala Lumpur",
    getLabel: () => "Kuala Lumpur - GMT+8",
  },
  {
    value: "Asia/Hong_Kong",
    label: "Hong Kong",
    getLabel: () => "Hong Kong - GMT+8",
  },
  { value: "Asia/Taipei", label: "Taipei", getLabel: () => "Taipei - GMT+8" },
  { value: "Asia/Seoul", label: "Seoul", getLabel: () => "Seoul - GMT+9" },
  { value: "Asia/Tokyo", label: "Tokyo", getLabel: () => "Tokyo - GMT+9" },
  {
    value: "Asia/Shanghai",
    label: "Shanghai, Beijing",
    getLabel: () => "Shanghai, Beijing - GMT+8",
  },
  { value: "Asia/Sydney", label: "Sydney", getLabel: () => "Sydney - GMT+10" },
  {
    value: "Asia/Melbourne",
    label: "Melbourne",
    getLabel: () => "Melbourne - GMT+10",
  },
  {
    value: "Australia/Brisbane",
    label: "Brisbane",
    getLabel: () => "Brisbane - GMT+10",
  },
  { value: "Australia/Perth", label: "Perth", getLabel: () => "Perth - GMT+8" },
  {
    value: "Australia/Adelaide",
    label: "Adelaide",
    getLabel: () => "Adelaide - GMT+9:30",
  },
  {
    value: "Pacific/Auckland",
    label: "Auckland",
    getLabel: () => "Auckland - GMT+12",
  },
  {
    value: "America/Mexico_City",
    label: "Mexico City",
    getLabel: () => "Mexico City - GMT-6",
  },
  {
    value: "America/Bogota",
    label: "Bogota",
    getLabel: () => "Bogota - GMT-5",
  },
  { value: "America/Lima", label: "Lima", getLabel: () => "Lima - GMT-5" },
  {
    value: "America/Santiago",
    label: "Santiago",
    getLabel: () => "Santiago - GMT-4",
  },
  {
    value: "America/Buenos_Aires",
    label: "Buenos Aires",
    getLabel: () => "Buenos Aires - GMT-3",
  },
  {
    value: "America/Sao_Paulo",
    label: "Sao Paulo",
    getLabel: () => "Sao Paulo - GMT-3",
  },
  {
    value: "Africa/Johannesburg",
    label: "Johannesburg",
    getLabel: () => "Johannesburg - GMT+2",
  },
  { value: "Africa/Cairo", label: "Cairo", getLabel: () => "Cairo - GMT+2" },
  { value: "Africa/Lagos", label: "Lagos", getLabel: () => "Lagos - GMT+1" },
  {
    value: "Africa/Casablanca",
    label: "Casablanca",
    getLabel: () => "Casablanca - GMT+1",
  },
];

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
export type ResumeTemplateKey = keyof typeof RESUME_TEMPLATE_MAPPING;
export type PDFThemeKey = keyof typeof PDF_THEMES;
export type PDFLayoutVariantKey = keyof typeof PDF_LAYOUT_VARIANTS;
export type PDFTypographyVariantKey = keyof typeof PDF_TYPOGRAPHY_VARIANTS;
export type PDFVisualElementKey = keyof typeof PDF_VISUAL_ELEMENTS;
