export interface WorkExperienceFormData {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  technologies: string[];
  responsibilities: string[];
  employmentType:
    | "full-time"
    | "part-time"
    | "contract"
    | "freelance"
    | "internship";
  industry: string;
  companyUrl: string;
  logo: string;
  displayOrder: number;
  isVisible: boolean;
  isFeatured: boolean;
}

export const defaultFormData: WorkExperienceFormData = {
  role: "",
  company: "",
  location: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  description: "",
  achievements: [],
  technologies: [],
  responsibilities: [],
  employmentType: "full-time",
  industry: "",
  companyUrl: "",
  logo: "",
  displayOrder: 0,
  isVisible: true,
  isFeatured: false,
};

export const employmentTypeOptions = [
  { value: "full-time", label: "Full Time", color: "#4CAF50" },
  { value: "part-time", label: "Part Time", color: "#FF9800" },
  { value: "contract", label: "Contract", color: "#2196F3" },
  { value: "freelance", label: "Freelance", color: "#9C27B0" },
  { value: "internship", label: "Internship", color: "#607D8B" },
];
