/**
 * Centralized types for the entire Portfolio application
 * Single source of truth for all shared TypeScript interfaces and types
 */

import { ReactNode, CSSProperties } from "react";
import type {
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
} from "./constants";

// ========================
// COMMON BASE TYPES
// ========================

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface BaseVisibility {
  isVisible: boolean;
  displayOrder: number;
}

export interface BaseTranslations {
  [locale: string]: string | null;
}

export interface BaseMultiLanguage {
  titleTranslations: BaseTranslations | null;
  descriptionTranslations: BaseTranslations | null;
}

// ========================
// LAYOUT & UI TYPES
// ========================

export interface ResponsiveLayoutProps {
  children: ReactNode;
  isMobile?: boolean;
  forceLayout?: LayoutType;
}

export interface LayoutProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface HeaderProps {
  isDarkMode?: boolean;
  onThemeToggle?: (isDark: boolean) => void;
  isMobile?: boolean;
  forceLayout?: LayoutType;
  onLayoutChange?: (layout: LayoutType) => void;
}

export interface FooterProps {
  className?: string;
  variant?: "simple" | "detailed";
}

// ========================
// ANIMATION TYPES
// ========================

export type AnimationType =
  | "torusKnot"
  | "dna"
  | "stars"
  | "polyhedron"
  | "galaxy"
  | "particles";

export type AnimationVariant =
  | "fadeIn"
  | "fadeOut"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleUp"
  | "scaleDown"
  | "bounce"
  | "rotate";

export type EasingType =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "circIn"
  | "circOut"
  | "circInOut"
  | "backIn"
  | "backOut"
  | "backInOut"
  | "anticipate";

export type EmploymentTypeColor =
  | "primary"
  | "secondary"
  | "warning"
  | "info"
  | "success"
  | "default"
  | "error";

export type ProjectTypeColor =
  | "primary"
  | "secondary"
  | "warning"
  | "info"
  | "success"
  | "default"
  | "error";

export type ProjectStatusColor =
  | "primary"
  | "secondary"
  | "warning"
  | "info"
  | "success"
  | "default"
  | "error";

export interface AnimationConfig {
  variant?: AnimationVariant;
  duration?: number;
  delay?: number;
  ease?: EasingType;
  repeat?: number;
  repeatType?: "loop" | "reverse" | "mirror";
}

export interface MotionWrapperProps extends AnimationConfig {
  children: ReactNode;
  className?: string;
  id?: string;
}

// ========================
// FORM TYPES
// ========================

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export interface ContactFormState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
}

export interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "textarea" | "password";
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
}

// ========================
// TYPOGRAPHY TYPES
// ========================

export interface TypographyProps {
  children: ReactNode;
  variant?: TypographyVariant;
  weight?: TypographyWeight;
  color?: string;
  align?: TypographyAlign;
  className?: string;
  id?: string;
  gutterBottom?: boolean;
  noWrap?: boolean;
  margin?: {
    top?: string | number;
    bottom?: string | number;
    left?: string | number;
    right?: string | number;
  };
}

export interface MarqueeProps {
  text: string;
  className?: string;
  id?: string;
  speed?: number;
  direction?: "left" | "right";
}

// ========================
// BUTTON TYPES
// ========================

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
  gradient?: string;
  neonColor?: string;
  opacity?: string;
  intensity?: "low" | "medium" | "high";
}

// ========================
// CARD TYPES
// ========================

export interface CardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  href?: string;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined" | "glass" | "gradient";
  size?: "small" | "medium" | "large";
}

export interface GalaxyCardProps extends CardProps {
  intensity?: "low" | "medium" | "high";
  animation?: boolean;
}

export type ContactCardType =
  | "email"
  | "phone"
  | "github"
  | "linkedin"
  | "whatsapp"
  | "telegram"
  | "aurora"
  | "fire"
  | "spring"
  | "ocean"
  | "forest"
  | "galaxy"
  | "warm"
  | "coolWarm"
  | "cool"
  | "neutral"
  | "dark"
  | "sunset";

// ========================
// SOCIAL MEDIA TYPES
// ========================

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  label: string;
  icon?: ReactNode;
  color?: string;
  bgColor?: string;
  target?: "_blank" | "_self";
}

export interface SocialMediaProps {
  links: SocialLink[];
  variant?: "horizontal" | "vertical" | "grid";
  size?: "small" | "medium" | "large";
  showLabels?: boolean;
}

// ========================
// NAVIGATION TYPES
// ========================

export interface NavigationItem {
  label: string;
  href: string;
  icon?: ReactNode;
  external?: boolean;
  children?: NavigationItem[];
}

export interface NavigationProps {
  items: NavigationItem[];
  variant?: "horizontal" | "vertical" | "mobile";
  currentPath?: string;
  onItemClick?: (item: NavigationItem) => void;
}

// ========================
// DATA GRID TYPES
// ========================

export interface DataGridColumn<T = Record<string, unknown>> {
  field: keyof T;
  headerName: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  renderCell?: (value: unknown, row: T) => ReactNode;
  type?: "string" | "number" | "date" | "boolean" | "actions";
}

export interface DataGridProps<T = Record<string, unknown>> {
  rows: T[];
  columns: DataGridColumn<T>[];
  pageSize?: number;
  pageSizeOptions?: number[];
  height?: number | string;
  loading?: boolean;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  checkboxSelection?: boolean;
  disableSelectionOnClick?: boolean;
  autoHeight?: boolean;
}

// ========================
// DATABASE ENTITY TYPES
// ========================

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  lastLogin?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: UserSocialLinks;
}

export interface UserSocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  pinterest?: string;
  reddit?: string;
  telegram?: string;
  whatsapp?: string;
}

export interface BlogPost extends BaseEntity {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: PostStatus;
  publishedAt?: string;
  authorId: string;
  tags: string[];
  featuredImage?: string;
  readingTime?: number;
  views?: number;
}

export interface ContactInquiry extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  respondedAt?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface WorkExperience
  extends BaseEntity,
    BaseVisibility,
    BaseMultiLanguage {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements: string[];
  technologies: string[];
  responsibilities: string[];
  employmentType: EmploymentType;
  industry: string;
  companyUrl?: string;
  logo?: string;
  isFeatured: boolean;
  roleTranslations?: BaseTranslations;
  companyTranslations?: BaseTranslations;
}

export interface IProject
  extends BaseEntity,
    BaseVisibility,
    BaseMultiLanguage {
  title: string;
  subtitle: string;
  description: string;
  longDescription: string | null;
  technologies: string[];
  categories: string[];
  status: ProjectStatus;
  projectType: ProjectType;
  startDate: string;
  endDate: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  demoUrl: string | null;
  documentationUrl: string | null;
  images: string[];
  keyFeatures: string[];
  technicalChallenges: TechnicalChallenge[];
  codeExamples: CodeExample[];
  teamSize: number | null;
  myRole: string | null;
  clientName: string | null;
  budget: string | null;
  isFeatured: boolean;
  problem: ProjectProblem | null;
  solution: ProjectSolution | null;
  architecture: ProjectArchitecture | null;
}

export type ProjectProblem = {
  title: string;
  description: string;
  impact: string;
  constraints?: string[];
};

export type ProjectSolution = {
  approach: string;
  methodology: string;
  keyDecisions: string[];
  alternatives?: string[];
};

export type ProjectArchitecture = {
  overview: string;
  components: string[];
  dataFlow: string;
  technologies: string[];
  patterns: string[];
  scalability?: string;
  security?: string;
};

export type TCodeExamples = {
  title: string;
  language: string;
  code: string;
  explanation: string;
}[];

export type TTechnicalChallenges = {
  challenge: string;
  solution: string;
}[];

// Union type for projects that can handle both database and static data
export type UnifiedProject = IProject & {
  problem?: ProjectProblem;
  solution?: ProjectSolution;
  architecture?: ProjectArchitecture;
};

export interface TechnicalChallenge {
  challenge: string;
  solution: string;
}

export interface CodeExample {
  title: string;
  language: string;
  code: string;
  explanation: string;
}

export interface Skill extends BaseEntity, BaseVisibility {
  name: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  yearsOfExperience: number;
  lastUsed: string;
  description?: string;
  icon?: string;
  color?: string;
  isFeatured: boolean;
}

export interface Certification extends BaseEntity, BaseVisibility {
  name: string;
  issuer: string;
  description: string;
  category: CertificationCategory;
  status: CertificationStatus;
  skills: string[];
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  verificationUrl?: string;
  icon?: string;
  color?: string;
  isFeatured: boolean;
}

export interface Education extends BaseEntity, BaseVisibility {
  degree: string;
  field: string;
  institution: string;
  location: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
  achievements: string[];
  courses: string[];
  thesis?: string;
  logo?: string;
  isFeatured: boolean;
}

export interface Service extends BaseEntity, BaseVisibility, BaseMultiLanguage {
  name: string;
  description: string;
  shortDescription: string;
  icon: string;
  category: string;
  features: string[];
  pricing?: string;
  duration?: string;
  deliverables: string[];
  technologies: string[];
  isFeatured: boolean;
}

// ========================
// COMPONENT-SPECIFIC TYPES
// ========================

export interface FloatingEmojisProps {
  emojis?: string[];
  duration?: number;
  delay?: number;
  ease?: EasingType;
  count?: number;
  size?: number;
}

export interface AnimatedTextProps {
  children: ReactNode;
  type?:
    | "scaleUp"
    | "scaleDown"
    | "fadeIn"
    | "fadeOut"
    | "slideUp"
    | "slideDown";
  hoverColor?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  scale?: number;
  opacity?: number;
  translateY?: number;
  className?: string;
}

export interface BrokenGlassProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  intensity?: "low" | "medium" | "high";
  animation?: boolean;
}

export interface GlassPaneProps {
  children: ReactNode;
  className?: string;
  blur?: number;
  opacity?: number;
  border?: boolean;
  rounded?: boolean;
}

export interface ConnectionLineProps {
  startElement: string;
  endElement: string;
  color?: string;
  width?: number;
  animated?: boolean;
  style?: "solid" | "dashed" | "dotted";
}

export interface TagChipProps {
  label: string;
  variant?: "filled" | "outlined" | "soft";
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  size?: "small" | "medium" | "large";
  icon?: ReactNode;
  onDelete?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export interface SkillShowcaseProps {
  skills: Skill[];
  variant?: "grid" | "list" | "cloud";
  showProficiency?: boolean;
  showExperience?: boolean;
  interactive?: boolean;
  groupByCategory?: boolean;
}

// ========================
// BACKGROUND TYPES
// ========================

export type BackgroundVariant =
  | "galaxy"
  | "stars"
  | "particles"
  | "geometric"
  | "gradient"
  | "waves"
  | "dots"
  | "lines";

export interface BackgroundProps {
  variant?: BackgroundVariant;
  intensity?: "low" | "medium" | "high";
  animated?: boolean;
  color?: string;
  className?: string;
}

export interface GlobeBackgroundProps extends BackgroundProps {
  size?: number;
  opacity?: number;
}

// ========================
// THEME TYPES
// ========================

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: number;
  borderRadius: number;
  spacing: number;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  border: string;
  shadow: string;
}

// ========================
// API TYPES
// ========================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
  filters?: Record<string, unknown>;
}

// ========================
// LANGUAGE TYPES
// ========================

export interface Language {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
  direction: "ltr" | "rtl";
}

export interface TranslationKey {
  key: string;
  defaultValue: string;
  namespace?: string;
}

export interface LocaleContent {
  [key: string]: string | LocaleContent;
}

// ========================
// UTILITY TYPES
// ========================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialFields<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type WithId<T> = T & { id: string };
export type WithTimestamps<T> = T & BaseEntity;
export type WithVisibility<T> = T & BaseVisibility;
export type WithTranslations<T> = T & BaseMultiLanguage;

// ========================
// EVENT TYPES
// ========================

export interface CustomEvent<T = unknown> {
  type: string;
  detail: T;
  timestamp: number;
}

export interface ErrorEvent extends CustomEvent {
  detail: {
    error: Error;
    context?: string;
    userId?: string;
  };
}

export interface AnalyticsEvent extends CustomEvent {
  detail: {
    action: string;
    category: string;
    label?: string;
    value?: number;
    userId?: string;
  };
}

// ========================
// RESPONSIVE TYPES
// ========================

export interface BreakpointValues {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface ResponsiveValue<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}

export type ResponsiveProps<T> = T | ResponsiveValue<T>;

// ========================
// PDF GENERATOR TYPES
// ========================

/**
 * Resume data structure for PDF generation
 */
export interface ResumeData {
  meta?: { title?: string; author?: string };
  person: {
    name: string;
    title: string;
    contacts: {
      phone: string;
      email: string;
      portfolio?: string;
      github?: string;
      linkedin?: string;
      location?: string;
    };
  };
  summary: string;
  tech: {
    frontend: string[];
    backend: string[];
    architecture: string[];
    databases: string[];
    cloudDevOps: string[];
    softSkills?: string[];
  };
  experience: Array<{
    role: string;
    company: string;
    location?: string;
    period: string;
    bullets: string[];
    stackLine?: string;
  }>;
  projects: Array<{
    name: string;
    line: string;
    url?: string;
  }>;
  additional?: string;
}

/**
 * PDF render options
 */
export interface PDFRenderOptions {
  rtl?: boolean;
  theme?: PDFTheme;
  maxBulletsPerRole?: number;
  maxProjects?: number;
}

/**
 * PDF theme types - all available themes
 */
export type PDFTheme =
  // Professional Themes
  | "corporate"
  | "executive"
  | "banking"
  // Modern Themes
  | "modern"
  | "startup"
  | "tech"
  // Creative Themes
  | "creative"
  | "artistic"
  | "design"
  // Minimalist Themes
  | "minimal"
  | "clean"
  | "academic"
  // Colorful Themes
  | "teal"
  | "indigo"
  | "rose"
  | "emerald"
  | "violet"
  | "amber"
  | "cyan"
  | "lime"
  | "deepOrange"
  | "deepPurple"
  | "brown"
  | "blueGrey";

/**
 * Resume template types for UI - all available templates
 */
export type ResumeTemplate =
  // Professional Templates
  | "modern"
  | "elegant"
  | "tech"
  | "corporate"
  | "executive"
  | "banking"
  | "startup"
  | "academic"
  // Creative Templates
  | "creative"
  | "artistic"
  | "design"
  // Minimalist Templates
  | "minimal"
  | "clean"
  // Colorful Templates
  | "teal"
  | "indigo"
  | "rose"
  | "emerald"
  | "violet"
  | "amber"
  | "cyan"
  | "lime"
  | "deepOrange"
  | "deepPurple"
  | "brown"
  | "blueGrey";

/**
 * PDF theme configuration structure
 */
export interface PDFThemeConfig {
  headerBg: [number, number, number];
  headerAccent?: [number, number, number];
  name: [number, number, number];
  title: [number, number, number];
  contacts: [number, number, number];
  text: [number, number, number];
  accent: [number, number, number];
  rule: [number, number, number];
  // CSS equivalents for UI
  cssHeaderBg: string;
  cssHeaderAccent?: string;
  cssAccent: string;
}

/**
 * PDF layout variant types
 */
export type PDFLayoutVariant =
  | "single"
  | "twoColumn"
  | "sidebar"
  | "compact"
  | "spacious";

/**
 * PDF typography variant types
 */
export type PDFTypographyVariant = "serif" | "sansSerif" | "monospace";

/**
 * PDF visual element types
 */
export type PDFVisualElement =
  | "icons"
  | "borders"
  | "shadows"
  | "gradients"
  | "patterns";

/**
 * Enhanced PDF render options with new visual features
 */
export interface EnhancedPDFRenderOptions extends PDFRenderOptions {
  layoutVariant?: PDFLayoutVariant;
  typography?: PDFTypographyVariant;
  visualElements?: {
    icons?: boolean;
    borders?: boolean;
    shadows?: boolean;
    gradients?: boolean;
    patterns?: boolean;
  };
  customSpacing?: {
    sectionGap?: number;
    paragraphGap?: number;
    bulletGap?: number;
    experienceGap?: number;
    ruleGap?: number;
  };
}

// ========================
// PERFORMANCE TYPES
// ========================

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage: number;
  bundleSize: number;
}

export interface LazyComponentProps {
  fallback?: ReactNode;
  delay?: number;
  threshold?: number;
}

// ========================
// VALIDATION TYPES
// ========================

export interface ValidationRule<T = unknown> {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: T) => boolean | string;
  message?: string;
}

export interface ValidationSchema {
  [field: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Re-export constants types for convenience
export type {
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
};
