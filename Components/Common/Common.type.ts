export interface PortfolioSection {
  title: string;
  description: string;
  href: string;
  color: "primary" | "secondary" | "success" | "info" | "warning" | "error";
  untranslatedSection: string;
}
