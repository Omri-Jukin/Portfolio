export interface PortfolioSection {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<any>;
  color: "primary" | "secondary" | "success" | "info" | "warning" | "error";
  untranslatedSection: string;
}
