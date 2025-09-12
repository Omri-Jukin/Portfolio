export interface EducationProps {
  id?: string;
}

export interface EducationDegree {
  degree: string;
  institution: string;
  location: string;
  period: string;
  gpa?: string;
  achievements: string[];
  coursework: string[];
  projects: string[];
}

export interface EducationCertification {
  name: string;
  issuer: string;
  date: string;
  status: string;
}

export interface EducationData {
  title: string;
  subtitle: string;
  description: string;
  academicBackground: string;
  keyAchievements: string;
  interestedInLearning: string;
  checkOutResume: string;
  viewResume: string;
  degrees: EducationDegree[];
  certifications: EducationCertification[];
}
