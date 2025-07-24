// Main component exports
export { default as AnimatedBackground } from "./AnimatedBackground";
export { default as AnimatedText } from "./AnimatedText";
export { default as AnimationSwitcher } from "./AnimationSwitcher";
export { default as Card } from "./Card";
export { default as ContactForm } from "../src/app/[locale]/contact";
export { default as DarkModeToggle } from "./DarkModeToggle";
export { default as DNAHelix } from "./DNAHelix";
export { default as Footer } from "./Footer";
export { default as Header } from "./Header";
export { default as LanguageSwitcher } from "./LanguageSwitcher";
export { default as MotionWrapper } from "./MotionWrapper";
export { default as ScrollingSections } from "./ScrollingSections";
export { default as SkillShowcase } from "./SkillShowcase";
export { default as TagChip } from "./TagChip";
export { default as Typography } from "./Typography";

// New section components
export { default as Hero } from "./Hero";
export { default as About } from "./About";
export { default as QA } from "./QA";
export { default as Services } from "./Services";
export { default as Projects } from "./Projects";
export { default as Contact } from "./Contact";

// Provider exports
export * from "./Providers";

// Common exports
export * from "./Common";

// Type exports
export type { AnimationType } from "./AnimatedBackground";
export type { AnimatedTextProps, AnimatedTextType } from "./AnimatedText";
export type { CardProps } from "./Card";
export type {
  ContactFormProps,
  ContactFormData,
} from "../src/app/[locale]/contact";
export type { DarkModeToggleProps } from "./DarkModeToggle";
export type { DNAModelProps } from "./DNAHelix";
export type { FooterProps } from "./Footer";
export type { HeaderProps, TLayout } from "./Header";
export type { LanguageSwitcherProps, Locale } from "./LanguageSwitcher";
export type { MotionWrapperProps } from "./MotionWrapper";
export type { ScrollingSectionsProps } from "./ScrollingSections";
export type {
  SkillShowcaseProps,
  SkillDetail as SkillShowcaseDetail,
} from "./SkillShowcase";
export type { TagChipProps } from "./TagChip";
export type { TypographyProps } from "./Typography";

// New section type exports
export type { HeroProps, HeroData } from "./Hero";
export type { AboutProps, Skill, SkillDetail } from "./About";
export type { QAProps, QAItem } from "./QA";
export type { ServicesProps, Service } from "./Services";
export type { ProjectsProps, Project } from "./Projects";
export type { ContactProps, ContactData } from "./Contact";
