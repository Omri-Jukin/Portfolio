/**
 * Centralized index file for the Portfolio application
 * Single source of truth for all shared constants, types, schemas, and styles
 *
 * This file provides a unified import interface for all centralized resources,
 * making it easy to import what you need from a single location.
 */

// ========================
// CONSTANTS
// ========================

export * from "./constants";
export {
  // Animation constants
  ANIMATION_DURATIONS,
  ANIMATION_DELAYS,
  ANIMATION_INCREMENTS,
  ANIMATION_EASING,

  // Layout constants
  LAYOUT_TYPES,
  RESPONSIVE_BREAKPOINTS,
  LAYOUT_DIMENSIONS,

  // Theme constants
  THEME_MODES,
  THEME_CONFIG,

  // Typography constants
  TYPOGRAPHY_VARIANTS,
  TYPOGRAPHY_WEIGHTS,
  TYPOGRAPHY_ALIGNS,
  FONT_SIZES,

  // Button constants
  BUTTON_VARIANTS,
  BUTTON_SIZES,

  // Social media constants
  SOCIAL_PLATFORMS,
  SOCIAL_COLORS,

  // Navigation constants
  NAVIGATION_ITEMS,

  // Locale constants
  LOCALES,
  VALID_LOCALES,

  // Section IDs
  SECTION_IDS,

  // Form constants
  FORM_IDS,
  FORM_VALIDATION,

  // Data grid constants
  DATA_GRID_CONFIG,

  // Color palette
  COLOR_PALETTE,

  // Animation mappings
  PATH_ANIMATION_MAPPINGS,

  // Camera and lighting
  CAMERA_CONFIG,
  LIGHTING_CONFIG,

  // File upload constants
  FILE_UPLOAD,

  // Rate limiting
  RATE_LIMITS,

  // Database limits
  DB_LIMITS,

  // Status enums
  USER_ROLES,
  USER_STATUSES,
  POST_STATUSES,
  INQUIRY_STATUSES,
  CERTIFICATION_CATEGORIES,
  CERTIFICATION_STATUSES,
  EMPLOYMENT_TYPES,
  PROJECT_STATUSES,
  PROJECT_TYPES,
  SKILL_CATEGORIES,
  PROFICIENCY_LEVELS,

  // Accessibility labels
  ACCESSIBILITY_LABELS,
} from "./constants";

// ========================
// TYPES
// ========================

export * from "./types";
export type {
  // Base types
  BaseEntity,
  BaseVisibility,
  BaseTranslations,
  BaseMultiLanguage,

  // Layout & UI types
  ResponsiveLayoutProps,
  LayoutProps,
  HeaderProps,
  FooterProps,

  // Animation types
  AnimationType,
  AnimationVariant,
  EasingType,
  AnimationConfig,
  MotionWrapperProps,

  // Form types
  ContactFormData,
  ContactFormProps,
  ContactFormState,
  FormFieldProps,

  // Typography types
  TypographyProps,
  MarqueeProps,

  // Button types
  ButtonProps,

  // Card types
  CardProps,
  GalaxyCardProps,
  ContactCardType,

  // Social media types
  SocialLink,
  SocialMediaProps,

  // Navigation types
  NavigationItem,
  NavigationProps,

  // Data grid types
  DataGridColumn,
  DataGridProps,

  // Database entity types
  User,
  BlogPost,
  ContactInquiry,
  WorkExperience,
  IProject,
  TechnicalChallenge,
  CodeExample,
  Skill,
  Certification,
  Education,
  Service,

  // Component-specific types
  FloatingEmojisProps,
  AnimatedTextProps,
  BrokenGlassProps,
  GlassPaneProps,
  ConnectionLineProps,
  TagChipProps,
  SkillShowcaseProps,

  // Background types
  BackgroundVariant,
  BackgroundProps,
  GlobeBackgroundProps,

  // Theme types
  ThemeConfig,
  ColorScheme,

  // API types
  ApiResponse,
  ApiError,
  PaginationParams,

  // Language types
  Language,
  TranslationKey,
  LocaleContent,

  // Utility types
  Optional,
  RequiredFields,
  PartialFields,
  WithId,
  WithTimestamps,
  WithVisibility,
  WithTranslations,

  // Event types
  CustomEvent,
  ErrorEvent,
  AnalyticsEvent,

  // Responsive types
  BreakpointValues,
  ResponsiveValue,
  ResponsiveProps,

  // Performance types
  PerformanceMetrics,
  LazyComponentProps,

  // Validation types
  ValidationRule,
  ValidationSchema,
  ValidationResult,

  // Constants types
  LayoutType,
  ThemeMode,
  SocialPlatform,
  UserRole,
  UserStatus,
  PostStatus,
  InquiryStatus,
  CertificationCategory,
  CertificationStatus,
  EmploymentType,
  ProjectStatus,
  ProjectType,
  SkillCategory,
  ProficiencyLevel,
  Locale,
  ButtonVariant,
  ButtonSize,
  TypographyVariant,
  TypographyWeight,
  TypographyAlign,
} from "./types";

// ========================
// SCHEMAS
// ========================

export * from "./schemas";
export {
  // Primitive schemas
  emailSchema,
  nameSchema,
  phoneSchema,
  urlSchema,
  passwordSchema,
  slugSchema,
  colorSchema,
  dateStringSchema,
  positiveIntegerSchema,
  displayOrderSchema,
  visibilitySchema,
  featuredSchema,

  // Enum schemas
  userRoleSchema,
  userStatusSchema,
  postStatusSchema,
  inquiryStatusSchema,
  certificationCategorySchema,
  certificationStatusSchema,
  employmentTypeSchema,
  projectStatusSchema,
  projectTypeSchema,
  skillCategorySchema,
  proficiencyLevelSchema,

  // Translation schemas
  translationsSchema,

  // File upload schemas
  imageFileSchema,
  documentFileSchema,

  // Form schemas
  contactFormSchema,
  loginSchema,
  registerSchema,

  // Entity schemas
  userCreateSchema,
  userUpdateSchema,
  blogPostCreateSchema,
  blogPostUpdateSchema,
  contactInquiryCreateSchema,
  contactInquiryUpdateSchema,
  workExperienceCreateSchema,
  workExperienceUpdateSchema,
  technicalChallengeSchema,
  codeExampleSchema,
  projectCreateSchema,
  projectUpdateSchema,
  skillCreateSchema,
  skillUpdateSchema,
  certificationCreateSchema,
  certificationUpdateSchema,
  educationCreateSchema,
  educationUpdateSchema,
  serviceCreateSchema,
  serviceUpdateSchema,

  // Pagination schemas
  paginationSchema,

  // Query schemas
  idParamSchema,
  slugParamSchema,
  searchQuerySchema,

  // Bulk operation schemas
  bulkDeleteSchema,
  bulkUpdateVisibilitySchema,
  bulkUpdateOrderSchema,

  // Admin schemas
  adminActionSchema,
  adminStatsQuerySchema,
} from "./schemas";

export type {
  // Schema data types
  ContactFormData as ContactFormSchemaData,
  LoginData,
  RegisterData,
  UserCreateData,
  UserUpdateData,
  BlogPostCreateData,
  BlogPostUpdateData,
  ContactInquiryCreateData,
  ContactInquiryUpdateData,
  WorkExperienceCreateData,
  WorkExperienceUpdateData,
  ProjectCreateData,
  ProjectUpdateData,
  SkillCreateData,
  SkillUpdateData,
  CertificationCreateData,
  CertificationUpdateData,
  EducationCreateData,
  EducationUpdateData,
  ServiceCreateData,
  ServiceUpdateData,
  PaginationData,
  SearchQueryData,
  BulkDeleteData,
  BulkUpdateVisibilityData,
  BulkUpdateOrderData,
  AdminActionData,
  AdminStatsQueryData,
} from "./schemas";

// ========================
// STYLES
// ========================

export * from "./styles";
export {
  // Breakpoint utilities
  breakpoints,

  // Animation keyframes
  animations,

  // Common mixins
  mixins,

  // Component styles
  componentStyles,

  // Theme utilities
  themeUtils,

  // Gradient presets
  gradients,

  // Shadow presets
  shadows,

  // Z-index scale
  zIndex,
} from "./styles";

// ========================
// CONVENIENCE EXPORTS
// ========================

// Re-export commonly used combinations
export const COMMON_ANIMATIONS = {
  FADE_IN: { variant: "fadeIn" as const, duration: 0.8 },
  SLIDE_UP: { variant: "slideUp" as const, duration: 0.8 },
  SCALE_IN: { variant: "scaleIn" as const, duration: 0.3 },
} as const;

export const COMMON_DELAYS = {
  STAGGER_SMALL: 0.1,
  STAGGER_MEDIUM: 0.2,
  STAGGER_LARGE: 0.4,
} as const;

export const FORM_FIELD_PROPS = {
  NAME: {
    name: "contact-form-name",
    minLength: 2,
    maxLength: 100,
  },
  EMAIL: {
    name: "contact-form-email",
    type: "email" as const,
  },
  PHONE: {
    name: "contact-form-phone",
    type: "tel" as const,
  },
  SUBJECT: {
    name: "contact-form-subject",
    minLength: 3,
    maxLength: 200,
  },
  MESSAGE: {
    name: "contact-form-message",
    type: "textarea" as const,
    minLength: 10,
    maxLength: 2000,
  },
} as const;

export const RESPONSIVE_GRID_CONFIGS = {
  CARDS_2_COL: { mobile: 1, tablet: 2, desktop: 2 },
  CARDS_3_COL: { mobile: 1, tablet: 2, desktop: 3 },
  CARDS_4_COL: { mobile: 1, tablet: 2, desktop: 4 },
  SKILLS_GRID: { mobile: 2, tablet: 3, desktop: 4 },
  PROJECTS_GRID: { mobile: 1, tablet: 2, desktop: 3 },
  SERVICES_GRID: { mobile: 1, tablet: 2, desktop: 3 },
} as const;

export const COMMON_BUTTON_CONFIGS = {
  PRIMARY: {
    variant: "primary",
    size: "medium",
  },
  SECONDARY: {
    variant: "secondary",
    size: "medium",
  },
  GRADIENT: {
    variant: "gradient",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  NEON: {
    variant: "neon",
    neonColor: "#181717",
  },
} as const;

// ========================
// VALIDATION HELPERS
// ========================

export const validateWithSchema = <T>(
  schema: { parse: (data: unknown) => T },
  data: unknown
): { success: boolean; data?: T; errors?: string[] } => {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error: unknown) {
    return {
      success: false,
      errors: (error as { issues?: Array<{ message: string }> }).issues?.map(
        (issue) => issue.message
      ) || ["Validation failed"],
    };
  }
};

// ========================
// THEME HELPERS
// ========================

export const getAnimationConfig = (
  variant: "fadeIn" | "slideUp" | "scaleIn",
  delay = 0
) => ({
  variant,
  duration: 0.8,
  delay,
  ease: "ease-in-out",
});

export const getResponsiveSpacing = (theme: {
  spacing: (factor: number) => string;
}) => ({
  mobile: theme.spacing(2),
  tablet: theme.spacing(3),
  desktop: theme.spacing(4),
});

export const getSocialConfig = (platform: string) => ({
  platform,
  color: "#181717", // Default color
  // Add URL mapping here if needed
});

// ========================
// DEFAULT CONFIGURATIONS
// ========================

export const DEFAULT_CONFIGS = {
  ANIMATION: {
    duration: 0.8,
    delay: 0,
    easing: "ease-in-out",
  },
  PAGINATION: {
    page: 1,
    limit: 10,
    sort: "createdAt",
    order: "desc" as const,
  },
  FORM: {
    debounceMs: 300,
    validationMode: "onBlur" as const,
    revalidateMode: "onChange" as const,
  },
  LAYOUT: {
    containerMaxWidth: 1200,
    headerHeight: 64,
    gridSpacing: 24,
  },
} as const;
