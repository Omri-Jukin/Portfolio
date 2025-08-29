export interface FooterProps {
  title?: string;
  children?: React.ReactNode;
  linksTitle?: string;
  links?: {
    label: string;
    href: string;
    icon?: string;
  }[];
  socialTitle?: string;
  social?: {
    label: string;
    href: string;
    icon?: string;
  }[];
  contactTitle?: string;
  contact?: {
    label: string;
    href: string;
    icon?: string;
  }[];
  copyright?: string;
}
