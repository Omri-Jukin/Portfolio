import { CertificationCategory } from "./Certifications.type";

export const CERTIFICATIONS_CONSTANTS = {
  SECTION_ID: "certifications-section",
  ANIMATION: {
    INITIAL_DELAY: 0.2,
    STAGGER_DELAY: 0.1,
    DURATION: 0.6,
  },
  SWIPER: {
    SLIDES_PER_VIEW: {
      MOBILE: 1,
      TABLET: 2,
      DESKTOP: 3,
    },
    SPACE_BETWEEN: 24,
  },
  CATEGORIES: {
    TECHNICAL: "technical",
    CLOUD: "cloud",
    SECURITY: "security",
    PROJECT_MANAGEMENT: "project-management",
    DESIGN: "design",
    OTHER: "other",
  } as Record<string, CertificationCategory>,
  CATEGORY_COLORS: {
    technical: "#2196F3",
    cloud: "#FF9800",
    security: "#F44336",
    "project-management": "#4CAF50",
    design: "#9C27B0",
    other: "#607D8B",
  } as Record<CertificationCategory, string>,
  CATEGORY_ICONS: {
    technical: "🔧",
    cloud: "☁️",
    security: "🛡️",
    "project-management": "📊",
    design: "🎨",
    other: "📋",
  } as Record<CertificationCategory, string>,
};
