import { type IntakeFormCurrencyCode } from "$/constants";

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
    budget: {
      currency: "USD" as IntakeFormCurrencyCode,
      min: "",
      max: "",
    },
    startDate: "",
    technologies: [] as string[],
    goals: [] as string[],
    resourceLinks: [] as Array<{ label: string; url: string }>,
  },
  additional: {
    preferredContactMethod: "",
    timezone: "",
    urgency: "",
    notes: "",
  },
};
