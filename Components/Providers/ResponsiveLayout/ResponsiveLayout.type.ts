export interface ResponsiveLayoutProps {
  children: React.ReactNode;
  isMobile?: boolean;
  forceLayout?: "mobile" | "desktop" | "auto";
}
