export interface ResponsiveLayoutProps {
  children: React.ReactNode;
  isMobile?: boolean;
  forceLayout?: ResponsiveLayout;
}

export type ResponsiveLayout = "mobile" | "desktop" | "auto";
