export const INTAKE_FORM_DEFAULTS = {
  contact: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    fullName: "",
  },
  org: {
    name: "",
    website: "",
    industry: "",
    size: "",
  },
  project: {
    title: "",
    description: "",
    requirements: [] as string[],
    timeline: "",
    budget: "",
    startDate: "",
    technologies: [] as string[],
    goals: [] as string[],
  },
  additional: {
    preferredContactMethod: "",
    timezone: "",
    urgency: "",
    notes: "",
  },
} as const;
