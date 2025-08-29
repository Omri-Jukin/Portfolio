export interface QAData {
  question: string;
  answer: string;
}

export interface ServiceData {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  buttonVariant: "primary" | "secondary";
}

export interface ProjectData {
  title: string;
  description: string;
  link: string;
}

export interface ScrollingSectionsProps {
  qaData?: QAData[];
  servicesData?: ServiceData[];
  projectsData?: ProjectData[];
  locale?: string;
}
