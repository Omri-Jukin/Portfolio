import { SECTION_IDS } from "$/constants";

export const HERO_CONSTANTS = {
  SECTION_ID: SECTION_IDS.HERO,
  ANIMATION: {
    TITLE_DURATION: 0.8,
    TITLE_DELAY: 0.1,
    SUBTITLE_DURATION: 0.8,
    SUBTITLE_DELAY: 0.2,
    BUTTONS_DURATION: 0.8,
    BUTTONS_DELAY: 0.3,
  },
  BUTTONS: {
    PRIMARY_CLASS: "primary",
    SECONDARY_CLASS: "secondary",
  },
  ACCESSIBILITY: {
    PROJECTS_LABEL: "View featured projects",
    RESUME_LABEL: "View my resume",
    CONTACT_LABEL: "Contact Omri Jukin",
  },
} as const;
