// Section IDs for navigation
export const SECTION_IDS = {
  HERO: "hero-section",
  ABOUT: "about-section",
  QA: "qa-section",
  SERVICES: "services-section",
  PROJECTS: "projects-section",
  CONTACT: "contact-section",
} as const;

// Animation configuration
export const ANIMATION_CONFIG = {
  HERO: {
    TITLE_DELAY: 0.2,
    SUBTITLE_DELAY: 0.6,
    BUTTONS_DELAY: 1.0,
  },
  SECTIONS: {
    TITLE_DELAY: 0.2,
    CONTENT_DELAY: 0.4,
    STAGGER_DELAY: 0.15,
  },
  SKILLS: {
    STAGGER_DELAY: 0.1,
  },
} as const;

// Grid configuration
export const GRID_CONFIG = {
  QA: {
    COLUMNS: {
      xs: "1fr",
      md: "repeat(2, 1fr)",
      lg: "repeat(3, 1fr)",
    },
    MAX_WIDTH: "1200px",
  },
  SERVICES: {
    COLUMNS: {
      xs: "1fr",
      md: "repeat(3, 1fr)",
    },
    MAX_WIDTH: "1200px",
  },
  PROJECTS: {
    COLUMNS: {
      xs: "1fr",
      md: "repeat(2, 1fr)",
    },
    MAX_WIDTH: "1200px",
  },
} as const;

// Skill keys
export const SKILL_KEYS = {
  CODE_CONJURER: "codeConjurer",
  BRAND_ARCHITECT: "brandArchitect",
  DESIGN_DREAMER: "designDreamer",
} as const;

// Service indices for icon mapping
export const SERVICE_ICONS = {
  DEVELOPMENT: 0, // CodeIcon
  DESIGN: 1, // StarIcon
  CONTACT: 2, // EmailIcon
} as const;

// Navigation actions
export const NAVIGATION_ACTIONS = {
  SCROLL_TO_SECTION: "scroll",
  NAVIGATE_TO_PAGE: "navigate",
  SHOW_DEMO: "demo",
} as const;
