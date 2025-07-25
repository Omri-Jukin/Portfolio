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

export const SOCIAL_LINKS = {
  EMAIL: "mailto:omrijukin@gmail.com",
  PHONE: "tel:+972523344064",
  WHATSAPP: "https://wa.me/972523344064",
  TELEGRAM: "https://t.me/Agent_OJ",
  LINKEDIN: "https://www.linkedin.com/in/omri-jukin/",
  GITHUB: "https://github.com/Omri-Jukin",
} as const;

export const SOCIALS_COLORS = {
  WHATSAPP: "#25D366", // WhatsApp green
  TELEGRAM: "#0088CC", // Telegram blue
  LINKEDIN: "#0077B5", // LinkedIn blue
  GITHUB: "#181717", // GitHub black
  EMAIL: "#F6F8FA", // Email white
  PHONE: "#F6F8FA", // Phone white
} as const;

// Light and dark mode specific colors
export const SOCIALS_COLORS_LIGHT = {
  WHATSAPP: "#25D366", // WhatsApp green
  TELEGRAM: "#0088CC", // Telegram blue
  LINKEDIN: "#0077B5", // LinkedIn blue
  GITHUB: "#181717", // GitHub black (dark in light mode)
  EMAIL: "#000000", // Email black in light mode
  PHONE: "#000000", // Phone black in light mode
} as const;

export const SOCIALS_COLORS_DARK = {
  WHATSAPP: "#25D366", // WhatsApp green
  TELEGRAM: "#0088CC", // Telegram blue
  LINKEDIN: "#0077B5", // LinkedIn blue
  GITHUB: "#F6F8FA", // GitHub light gray in dark mode
  EMAIL: "#F6F8FA", // Email white in dark mode
  PHONE: "#F6F8FA", // Phone white in dark mode
} as const;

export const SOCIAL_ICONS = {
  EMAIL: <EmailIcon sx={{ fontSize: 40, color: SOCIALS_COLORS.EMAIL }} />,
  PHONE: <PhoneIcon sx={{ fontSize: 40, color: SOCIALS_COLORS.PHONE }} />,
  WHATSAPP: (
    <WhatsAppIcon sx={{ fontSize: 40, color: SOCIALS_COLORS.WHATSAPP }} />
  ),
  TELEGRAM: (
    <TelegramIcon sx={{ fontSize: 40, color: SOCIALS_COLORS.TELEGRAM }} />
  ),
  LINKEDIN: (
    <LinkedInIcon sx={{ fontSize: 40, color: SOCIALS_COLORS.LINKEDIN }} />
  ),
  GITHUB: <GitHubIcon sx={{ fontSize: 40, color: SOCIALS_COLORS.GITHUB }} />,
} as const;

export const SOCIALS = {
  EMAIL: {
    icon: SOCIAL_ICONS.EMAIL,
    link: SOCIAL_LINKS.EMAIL,
    value: SOCIALS_COLORS.EMAIL,
  },
  PHONE: {
    icon: SOCIAL_ICONS.PHONE,
    link: SOCIAL_LINKS.PHONE,
    value: SOCIALS_COLORS.PHONE,
  },
  WHATSAPP: {
    icon: SOCIAL_ICONS.WHATSAPP,
    link: SOCIAL_LINKS.WHATSAPP,
    value: SOCIALS_COLORS.WHATSAPP,
  },
  TELEGRAM: {
    icon: SOCIAL_ICONS.TELEGRAM,
    link: SOCIAL_LINKS.TELEGRAM,
    value: SOCIALS_COLORS.TELEGRAM,
  },
  LINKEDIN: {
    icon: SOCIAL_ICONS.LINKEDIN,
    link: SOCIAL_LINKS.LINKEDIN,
    value: SOCIALS_COLORS.LINKEDIN,
  },
  GITHUB: {
    icon: SOCIAL_ICONS.GITHUB,
    link: SOCIAL_LINKS.GITHUB,
    value: SOCIALS_COLORS.GITHUB,
  },
} as const;
