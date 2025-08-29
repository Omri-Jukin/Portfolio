export interface ServicesProps {
  onServiceClick?: (serviceIndex: number) => void;
}

export interface Service {
  title: string;
  description: string;
  buttonText: string;
  buttonVariant: string;
}
