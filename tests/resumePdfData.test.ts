import type { ResumeData } from "../lib/types";
import {
  DEFAULT_RESUME_PDF_LAYOUT,
  getPdfReadyResumeData,
  getResumePdfSectionOrder,
  parseResumePdfLayout,
} from "../lib/utils/resumePdfData";

const baseResume: ResumeData = {
  meta: {
    title: "Resume",
    author: "Tester",
    pdfDateFormat: "year",
    pdfSectionOrder: ["projects", "summary", "projects", "skills"],
  },
  person: {
    name: "Tester",
    title: "Full-Stack Engineer",
    photoUrl: "/profile-photo.png",
    contacts: {
      phone: "123",
      email: "test@example.com",
    },
  },
  headline: "Full-Stack Engineer",
  summary: "Builds full-stack systems.",
  coreSkills: [{ category: "Languages", items: ["TypeScript"] }],
  experience: [
    {
      role: "Engineer",
      company: "Company",
      period: "Jan 2024 - Mar 2025",
      bullets: ["Built software."],
    },
  ],
  projects: [
    {
      name: "Project",
      line: "Project line.",
    },
  ],
  education: [
    {
      degree: "Course",
      institution: "School",
      location: "",
      period: "Jan 2020 - Dec 2021",
    },
  ],
};

describe("resumePdfData", () => {
  test("uses the visual layout as the public default", () => {
    expect(DEFAULT_RESUME_PDF_LAYOUT).toBe("visual");
  });

  test("parses supported layouts only", () => {
    expect(parseResumePdfLayout("ats")).toBe("ats");
    expect(parseResumePdfLayout("visual")).toBe("visual");
    expect(parseResumePdfLayout("sidebar")).toBeNull();
  });

  test("normalizes section order and removes duplicates", () => {
    expect(getResumePdfSectionOrder(baseResume.meta?.pdfSectionOrder)).toEqual([
      "projects",
      "summary",
      "skills",
      "experience",
      "additionalExperience",
      "education",
      "certifications",
    ]);
  });

  test("applies year-only date formatting without mutating source data", () => {
    const readyResume = getPdfReadyResumeData(baseResume);

    expect(readyResume.experience[0].period).toBe("2024 - 2025");
    expect(readyResume.education[0].period).toBe("2020 - 2021");
    expect(baseResume.experience[0].period).toBe("Jan 2024 - Mar 2025");
  });

  test("preserves optional visual photo metadata", () => {
    expect(getPdfReadyResumeData(baseResume).person.photoUrl).toBe(
      "/profile-photo.png"
    );
  });
});
