// Main component exports
export { default as AnimatedBackground } from "./AnimatedBackground";
export { default as AnimatedText } from "./AnimatedText";
export { default as AnimationSwitcher } from "./AnimationSwitcher";
export { default as Background } from "./Background";
export { default as BackgroundCard } from "./Background/BackgroundCard";
export { default as Galaxy } from "./GalaxyCard/Galaxy";
export { default as GalaxyCard } from "./GalaxyCard/GalaxyCard";
export { Button } from "./Button";
export { BoxShadowDemo } from "./BoxShadowDemo";
export { GlassPane, GlassPaneDemo } from "./GlassPane";
export { default as BrokenGlass } from "./BrokenGlass";
export { default as Card } from "./Card";
export { default as ContactForm } from "../src/app/[locale]/contact";
export { default as DarkModeToggle } from "./DarkModeToggle";
export { default as DNAHelix } from "./DNAHelix";
export { DNAHelixWrapper } from "./DNAHelix";
export { default as Footer } from "./Footer";
export { default as Header } from "./Header";
export { default as LanguageSwitcher } from "./LanguageSwitcher";
export { default as MotionWrapper } from "./MotionWrapper";
export { default as SkillShowcase } from "./SkillShowcase";
export { default as TagChip } from "./TagChip";
export { default as Typography } from "./Typography";
export { default as DataGrid } from "./DataGrid";
export { default as Snackbar } from "./Snackbar";
export { WaveText } from "./WaveText/WaveText";
export { FloatingEmojis } from "./FloatingEmojis/FloatingEmojis";
export { InnovationFlow } from "./InnovationFlow/InnovationFlow";
export { ParticleBridge } from "./ParticleBridge/ParticleBridge";
export { VisionRealityBridge } from "./VisionRealityBridge/VisionRealityBridge";
export { ColorWorm } from "./ColorWorm/ColorWorm";
export { ConnectionLine } from "./ConnectionLine";
export { default as ScrollGapAnimator } from "./ScrollGapAnimator";
export { CollaborationHub } from "./CollaborationHub";

// New section components
export { default as Hero } from "./Hero";
export { default as About } from "./About";
export { default as QA } from "./QA";
export { default as Services } from "./Services";
export { default as Career } from "./Career";
export { default as Projects } from "./Projects";
export { default as Contact } from "./Contact";
export { default as ResumeLanguageSelector } from "./ResumeLanguageSelector";

// Provider exports
export * from "./Providers";

// Common exports
export * from "./Common";

// Type exports
export type { AnimationType } from "./AnimatedBackground";
export type { AnimatedTextProps, AnimatedTextType } from "./AnimatedText";
export type {
  BackgroundProps,
  BackgroundVariant,
  BackgroundIntensity,
  BackgroundSpeed,
  BackgroundColor,
  FloatingElement,
  Particle,
  Wave,
} from "./Background/Background.type";
export type { CardProps } from "./Card";
export type { BrokenGlassProps } from "./BrokenGlass";
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
export type { DataGridProps, DataGridAction } from "./DataGrid";

// New section type exports
export type { HeroProps, HeroData } from "./Hero";
export type { AboutProps, Skill, SkillDetail } from "./About";
export type { QAProps, QAItem } from "./QA";
export type { ServicesProps, Service } from "./Services";
export type { CareerProps, Experience } from "./Career";
export type { ProjectsProps, Project } from "./Projects";
export type { ContactProps, ContactData } from "./Contact";
export type { ResumeLanguageSelectorProps } from "./ResumeLanguageSelector";

// Additional type exports for newly added components
export type { ConnectionLineProps } from "./ConnectionLine";
export type { ScrollGapAnimatorProps } from "./ScrollGapAnimator";
export type { CollaborationHubProps } from "./CollaborationHub";
