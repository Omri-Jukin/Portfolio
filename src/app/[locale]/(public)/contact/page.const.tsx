import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  Telegram as TelegramIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
} from "@mui/icons-material";

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

// Multi-layer obfuscation for contact information
export const CONTACT_PROTECTION = {
  EMAIL_PARTS: {
    user: ["om", "ri", "ju", "kin"],
    domain: ["gm", "ail"],
    tld: ["co", "m"],
  },
  PHONE_PARTS: {
    country: ["9", "7", "2"],
    area: ["5", "2"],
    prefix: ["3", "3", "4"],
    number: ["4", "0", "6", "4"],
  },
  ENCODED_PARTS: {
    email_user: btoa("omrijukin"),
    email_domain: btoa("gmail"),
    email_tld: btoa("com"),
    phone_full: btoa("972523344064"),
  },
} as const;

export const getProtectedEmail = (): string => {
  // Reconstruct from split parts
  const user = CONTACT_PROTECTION.EMAIL_PARTS.user.join("");
  const domain = CONTACT_PROTECTION.EMAIL_PARTS.domain.join("");
  const tld = CONTACT_PROTECTION.EMAIL_PARTS.tld.join("");
  return `${user}@${domain}.${tld}`;
};

export const getProtectedPhone = (): string => {
  const country = CONTACT_PROTECTION.PHONE_PARTS.country.join("");
  const area = CONTACT_PROTECTION.PHONE_PARTS.area.join("");
  const prefix = CONTACT_PROTECTION.PHONE_PARTS.prefix.join("");
  const number = CONTACT_PROTECTION.PHONE_PARTS.number.join("");
  return `+${country}-${area}-${prefix}-${number}`;
};

export const getProtectedPhoneDigits = (): string => {
  const phone = getProtectedPhone();
  return phone.replace(/[^0-9]/g, "");
};

export const SOCIAL_LINKS = {
  EMAIL: `mailto:${getProtectedEmail()}`,
  PHONE: `tel:${getProtectedPhone()}`,
  WHATSAPP: `https://wa.me/${getProtectedPhoneDigits()}`,
  TELEGRAM: "https://t.me/Agent_OJ",
  LINKEDIN: "https://www.linkedin.com/in/omri-jukin/",
  GITHUB: "https://github.com/Omri-Jukin",
} as const;

// Authentic brand colors for each platform with improved contrast
export const SOCIALS_COLORS = {
  WHATSAPP: "#25D366", // WhatsApp green
  TELEGRAM: "#0088CC", // Telegram blue
  LINKEDIN: "#0077B5", // LinkedIn blue
  GITHUB: "#FFFFFF", // GitHub white for better contrast
  EMAIL: "#EA4335", // Gmail red
  PHONE: "#34A853", // Google green for phone
} as const;

// Light mode colors (darker for better contrast)
export const SOCIALS_COLORS_LIGHT = {
  WHATSAPP: "#25D366", // WhatsApp green
  TELEGRAM: "#0088CC", // Telegram blue
  LINKEDIN: "#0077B5", // LinkedIn blue
  GITHUB: "#181717", // GitHub white for better contrast
  EMAIL: "#EA4335", // Gmail red
  PHONE: "#34A853", // Google green for phone
} as const;

// Dark mode colors (lighter for better contrast)
export const SOCIALS_COLORS_DARK = {
  WHATSAPP: "#25D366", // WhatsApp green
  TELEGRAM: "#0088CC", // Telegram blue
  LINKEDIN: "#0077B5", // LinkedIn blue
  GITHUB: "#FFFFFF", // GitHub white for better contrast
  EMAIL: "#EA4335", // Gmail red
  PHONE: "#34A853", // Google green for phone
} as const;

// Background colors for icon containers
export const SOCIALS_BG_COLORS = {
  WHATSAPP: "#25D366", // WhatsApp green background
  TELEGRAM: "#0088CC", // Telegram blue background
  LINKEDIN: "#0077B5", // LinkedIn blue background
  GITHUB: "#181717", // GitHub dark background with white icon
  EMAIL: "#EA4335", // Gmail red background
  PHONE: "#34A853", // Google green background
} as const;

export const SOCIAL_ICONS = {
  EMAIL: <EmailIcon sx={{ fontSize: 40, color: "#FFFFFF" }} />, // White icon on red background
  PHONE: <PhoneIcon sx={{ fontSize: 40, color: "#FFFFFF" }} />, // White icon on green background
  // White icon on green background
  WHATSAPP: <WhatsAppIcon sx={{ fontSize: 40, color: "#FFFFFF" }} />,
  // White icon on blue background
  TELEGRAM: <TelegramIcon sx={{ fontSize: 40, color: "#FFFFFF" }} />,
  // White icon on blue background
  LINKEDIN: <LinkedInIcon sx={{ fontSize: 40, color: "#FFFFFF" }} />,
  GITHUB: <GitHubIcon sx={{ fontSize: 40, color: "#FFFFFF" }} />, // White icon on dark background
} as const;

export const SOCIALS = {
  EMAIL: {
    icon: SOCIAL_ICONS.EMAIL,
    link: SOCIAL_LINKS.EMAIL,
    value: SOCIALS_COLORS.EMAIL,
    bgColor: SOCIALS_BG_COLORS.EMAIL,
  },
  PHONE: {
    icon: SOCIAL_ICONS.PHONE,
    link: SOCIAL_LINKS.PHONE,
    value: SOCIALS_COLORS.PHONE,
    bgColor: SOCIALS_BG_COLORS.PHONE,
  },
  WHATSAPP: {
    icon: SOCIAL_ICONS.WHATSAPP,
    link: SOCIAL_LINKS.WHATSAPP,
    value: SOCIALS_COLORS.WHATSAPP,
    bgColor: SOCIALS_BG_COLORS.WHATSAPP,
  },
  TELEGRAM: {
    icon: SOCIAL_ICONS.TELEGRAM,
    link: SOCIAL_LINKS.TELEGRAM,
    value: SOCIALS_COLORS.TELEGRAM,
    bgColor: SOCIALS_BG_COLORS.TELEGRAM,
  },
  LINKEDIN: {
    icon: SOCIAL_ICONS.LINKEDIN,
    link: SOCIAL_LINKS.LINKEDIN,
    value: SOCIALS_COLORS.LINKEDIN,
    bgColor: SOCIALS_BG_COLORS.LINKEDIN,
  },
  GITHUB: {
    icon: SOCIAL_ICONS.GITHUB,
    link: SOCIAL_LINKS.GITHUB,
    value: SOCIALS_COLORS.GITHUB,
    bgColor: SOCIALS_BG_COLORS.GITHUB,
  },
} as const;
