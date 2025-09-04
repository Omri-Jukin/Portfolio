import { ProjectStatus, ProjectType } from "#/lib/db/schema/schema.types";

export interface ProjectFormData {
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  technologies: string[];
  categories: string[];
  status: ProjectStatus;
  projectType: ProjectType;
  startDate: string;
  endDate: string;
  githubUrl: string;
  liveUrl: string;
  demoUrl: string;
  documentationUrl: string;
  images: string[];
  keyFeatures: string[];
  technicalChallenges: { challenge: string; solution: string }[];
  codeExamples: {
    title: string;
    language: string;
    code: string;
    explanation: string;
  }[];
  teamSize: number;
  myRole: string;
  clientName: string;
  budget: string;
  displayOrder: number;
  isVisible: boolean;
  isFeatured: boolean;
  isOpenSource: boolean;
}

export const defaultFormData: ProjectFormData = {
  title: "",
  subtitle: "",
  description: "",
  longDescription: "",
  technologies: [],
  categories: [],
  status: "completed",
  projectType: "personal",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  githubUrl: "",
  liveUrl: "",
  demoUrl: "",
  documentationUrl: "",
  images: [],
  keyFeatures: [],
  technicalChallenges: [],
  codeExamples: [],
  teamSize: 1,
  myRole: "",
  clientName: "",
  budget: "",
  displayOrder: 0,
  isVisible: true,
  isFeatured: false,
  isOpenSource: false,
};

export const statusOptions = [
  { value: "completed", label: "Completed", color: "#4CAF50" },
  { value: "in-progress", label: "In Progress", color: "#FF9800" },
  { value: "archived", label: "Archived", color: "#607D8B" },
  { value: "concept", label: "Concept", color: "#9C27B0" },
];

export const projectTypeOptions = [
  { value: "professional", label: "Professional", color: "#2196F3" },
  { value: "personal", label: "Personal", color: "#4CAF50" },
  { value: "open-source", label: "Open Source", color: "#FF9800" },
  { value: "academic", label: "Academic", color: "#9C27B0" },
];
