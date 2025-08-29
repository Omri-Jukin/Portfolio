// Main component exports
export { default as AnimatedBackground } from "./AnimatedBackground";
export { default as AnimatedText } from "./AnimatedText/AnimatedText";
export { default as AnimationSwitcher } from "./AnimationSwitcher/AnimationSwitcher";
export { default as Background } from "./Background/Background";
export { default as BackgroundCard } from "./Background/BackgroundCard";
export { default as Galaxy } from "./GalaxyCard/Galaxy";
export { default as GalaxyCard } from "./GalaxyCard/GalaxyCard";
export { default as GlobeBackground } from "./GlobeBackground/GlobeBackground";
export { default as ResponsiveBackground } from "./ScrollingSections/ResponsiveBackground";
export {
  Button,
  NeonButton,
  GlassButton,
  BrokenGlassButton,
  GradientButton,
} from "./Button";
export { BoxShadowDemo } from "./BoxShadowDemo";
export { GlassPane, GlassPaneDemo } from "./GlassPane";
export { default as BrokenGlass } from "./BrokenGlass/BrokenGlass";
export { default as Card } from "./Card";
export { default as DarkModeToggle } from "./DarkModeToggle";
export { default as DNAHelix } from "./DNAHelix/DNAHelix";
export { default as DNAHelixWrapper } from "./DNAHelix/index";
export { default as Footer } from "./Footer/Footer";
export { default as Header } from "./Header/Header";
export { default as LanguageSwitcher } from "./LanguageSwitcher/LanguageSwitcher";
export { default as MotionWrapper } from "./MotionWrapper/MotionWrapper";
export { default as SkillShowcase } from "./SkillShowcase/SkillShowcase";
export { default as TagChip } from "./TagChip/TagChip";
export { Typography } from "./Typography";
export { default as DataGrid } from "./DataGrid/DataGrid";
export { default as Snackbar } from "./Snackbar/Snackbar";
export { WaveText } from "./WaveText/WaveText";
export { FloatingEmojis } from "./FloatingEmojis/FloatingEmojis";
export { InnovationFlow } from "./InnovationFlow/InnovationFlow";
export { ParticleBridge } from "./ParticleBridge/ParticleBridge";
export { VisionRealityBridge } from "./VisionRealityBridge/VisionRealityBridge";
export { ColorWorm } from "./ColorWorm/ColorWorm";
export { ConnectionLine } from "./ConnectionLine/ConnectionLine";
export { default as ScrollGapAnimator } from "./ScrollGapAnimator/ScrollGapAnimator";
export { CollaborationHub } from "./CollaborationHub/CollaborationHub";
export { default as FloatingProfile } from "./FloatingProfile/FloatingProfile";
export { default as ClientOnly } from "./ClientOnly/ClientOnly";
export { default as Skeleton } from "./Skeleton/Skeleton";

// New section components
export { default as Hero } from "./Hero";
export { default as About } from "./About";
export { default as QA } from "./QA/QA";
export { default as Services } from "./Services";
export { default as Career } from "./Career";
export { default as Certifications } from "./Certifications/Certifications";
export { default as Projects } from "./Projects/Projects";
export { default as Contact } from "./Contact";
export { default as ResumeLanguageSelector } from "./ResumeLanguageSelector/ResumeLanguageSelector";
export { default as CondensedResume } from "./Resume";
export { default as Portfolio } from "./Portfolio/Portfolio";

// Provider exports
export * from "./Providers";

// Common exports
export * from "./Common";

// Additional components that exist
export { default as SearchBar } from "./SearchBar/SearchBar";
export { default as Analytics } from "./Analytics/Analytics";
export { default as BlogPost } from "./BlogPosts/BlogPost";
export { default as ThemeCustomizer } from "./ThemeCustomizer/ThemeCustomizer";
export { default as ContactForm } from "./ContactForm/ContactForm";
export { default as SkillsShowcase } from "./SkillsShowcase/SkillsShowcase";
export { default as SkillsGrid } from "./SkillsGrid/SkillsGrid";
export { default as Badge } from "./Badge/Badge";
export { default as Loading } from "./Loading/Loading";

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
export type { DarkModeToggleProps } from "./DarkModeToggle";
export type { DNAModelProps } from "./DNAHelix/index";
export type { FooterProps } from "./Footer";
export type { HeaderProps, TLayout } from "./Header";
export type { LanguageSwitcherProps, Locale } from "./LanguageSwitcher/index";
export type { MotionWrapperProps } from "./MotionWrapper";
export type { ScrollingSectionsProps } from "./ScrollingSections";
export type {
  SkillShowcaseProps,
  SkillDetail as SkillShowcaseDetail,
} from "./SkillShowcase";
export type { TagChipProps } from "./TagChip/index";
export type { TypographyProps } from "./Typography";
export type { DataGridProps, DataGridAction } from "./DataGrid/index";

// New section type exports
export type { HeroProps, HeroData } from "./Hero";
export type { AboutProps, Skill, SkillDetail } from "./About";
export type { QAProps, QAItem } from "./QA";
export type { ServicesProps, Service } from "./Services";
export type { CareerProps, Experience } from "./Career";
export type { CertificationsProps, Certification } from "./Certifications";
export type { ProjectsProps, Project } from "./Projects";
export type { ContactProps, ContactData } from "./Contact";
export type { ResumeLanguageSelectorProps } from "./ResumeLanguageSelector";
export type { CondensedResumeProps } from "./Resume";
export type { PortfolioProps, Project as PortfolioProject } from "./Portfolio";

// Additional type exports for newly added components
export type { ConnectionLineProps } from "./ConnectionLine";
export type { ScrollGapAnimatorProps } from "./ScrollGapAnimator";
export type { CollaborationHubProps } from "./CollaborationHub";
export type { GlobeBackgroundProps, GlobeMarker } from "./GlobeBackground";
