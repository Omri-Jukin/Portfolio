import { Language, ProgrammingLanguage, Education } from "./Resume.type";

export const RESUME_CONSTANTS = {
  LANGUAGES: [
    { name: "Hebrew", level: "Native", flag: "🇮🇱" },
    { name: "English", level: "Semi-Native", flag: "🇺🇸" },
    { name: "Spanish", level: "Novice", flag: "🇪🇸" },
  ] as Language[],

  PROGRAMMING_LANGUAGES: [
    { name: "TypeScript", level: "Proficient", color: "primary" as const },
    { name: "Java", level: "Intermediate", color: "secondary" as const },
    { name: "C#", level: "Intermediate", color: "secondary" as const },
    { name: "Python", level: "Beginner", color: "default" as const },
  ] as ProgrammingLanguage[],

  EDUCATION: [
    {
      degree: "Practical Engineering Diploma",
      field: "Software Engineering",
      institution: "Technological College",
      year: "2017",
    },
  ] as Education[],

  KEY_SKILLS: [
    "Full-Stack Development",
    "Microservices Architecture",
    "API Design & Development",
    "Database Design & Optimization",
    "Cloud Deployment (Cloudflare)",
    "Performance Optimization",
    "Internationalization (i18n)",
    "Responsive Design",
    "TypeScript & Modern JavaScript",
    "React & Next.js",
  ],

  CONTACT: {
    email: "omrijukin@gmail.com",
    availability: "Available for new opportunities",
  },
};
