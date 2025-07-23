// Footer section types
export const FOOTER_SECTIONS = {
  LINKS: "links",
  SOCIAL: "social",
  CONTACT: "contact",
} as const;

// Default footer configuration
export const FOOTER_DEFAULTS = {
  TITLE: "Portfolio",
  LINKS_TITLE: "Quick Links",
  SOCIAL_TITLE: "Follow Me",
  CONTACT_TITLE: "Contact",
  COPYRIGHT: "© 2024 All rights reserved.",
} as const;

// Social media platforms
export const SOCIAL_PLATFORMS = {
  GITHUB: "github",
  LINKEDIN: "linkedin",
  TWITTER: "twitter",
  INSTAGRAM: "instagram",
  EMAIL: "email",
} as const;

// Icon mappings for social platforms
export const SOCIAL_ICONS = {
  [SOCIAL_PLATFORMS.GITHUB]: "GitHub",
  [SOCIAL_PLATFORMS.LINKEDIN]: "LinkedIn",
  [SOCIAL_PLATFORMS.TWITTER]: "Twitter",
  [SOCIAL_PLATFORMS.INSTAGRAM]: "Instagram",
  [SOCIAL_PLATFORMS.EMAIL]: "Email",
} as const;
