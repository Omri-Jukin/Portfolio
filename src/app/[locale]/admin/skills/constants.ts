export interface SkillFormData {
  name: string;
  category:
    | "technical"
    | "soft"
    | "language"
    | "tool"
    | "framework"
    | "database"
    | "cloud";
  subCategory: string;
  proficiencyLevel: number;
  proficiencyLabel: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience: number;
  description: string;
  icon: string;
  color: string;
  relatedSkills: string[];
  certifications: string[];
  projects: string[];
  lastUsed: string;
  isVisible: boolean;
  displayOrder: number;
}

export const defaultFormData: SkillFormData = {
  name: "",
  category: "technical",
  subCategory: "",
  proficiencyLevel: 50,
  proficiencyLabel: "intermediate",
  yearsOfExperience: 1,
  description: "",
  icon: "",
  color: "",
  relatedSkills: [],
  certifications: [],
  projects: [],
  lastUsed: new Date().toISOString().split("T")[0],
  isVisible: true,
  displayOrder: 0,
};

export const categoryOptions = [
  { value: "technical", label: "Technical", color: "#2196F3" },
  { value: "soft", label: "Soft Skills", color: "#4CAF50" },
  { value: "language", label: "Language", color: "#FF9800" },
  { value: "tool", label: "Tool", color: "#9C27B0" },
  { value: "framework", label: "Framework", color: "#F44336" },
  { value: "database", label: "Database", color: "#607D8B" },
  { value: "cloud", label: "Cloud", color: "#00BCD4" },
];

export const proficiencyOptions = [
  { value: "beginner", label: "Beginner", range: [1, 25] },
  { value: "intermediate", label: "Intermediate", range: [25, 50] },
  { value: "advanced", label: "Advanced", range: [50, 75] },
  { value: "expert", label: "Expert", range: [75, 100] },
];
