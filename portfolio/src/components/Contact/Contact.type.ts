export interface ContactProps {
  locale?: string;
  onContactClick?: () => void;
}

export interface ContactData {
  title: string;
  subtitle: string;
  description: string;
  button: string;
}
