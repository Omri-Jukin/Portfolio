export const EDUCATION_CONSTANTS = {
  SECTION_ID: "education",
  ANIMATION_DURATION: 0.6,
  STAGGER_DELAY: 0.1,
} as const;

export const EDUCATION_ANIMATIONS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: EDUCATION_CONSTANTS.STAGGER_DELAY,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: EDUCATION_CONSTANTS.ANIMATION_DURATION,
      },
    },
  },
} as const;
