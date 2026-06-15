import {
  extractResumeData,
  getAvailableLanguages,
  getLanguageName,
} from "../lib/utils/resumeDataExtractor";

describe("Resume Data Extractor", () => {
  test("should extract resume data for English", async () => {
    const data = await extractResumeData("en");

    expect(data).toBeDefined();
    expect(data.meta).toBeDefined();
    expect(data.person).toBeDefined();
    expect(data.experience).toBeDefined();
    expect(data.projects).toBeDefined();

    expect(data.meta?.title).toBe("Omri Jukin - Resume");
    expect(data.meta?.author).toBe("Omri Jukin");
    expect(data.person.name).toBe("Omri Jukin");
    expect(data.headline).toContain("Full-Stack TypeScript Engineer");
    expect(data.coreSkills).toBeInstanceOf(Array);
    expect(data.coreSkills!.length).toBeGreaterThan(0);
    expect(data.experience).toBeInstanceOf(Array);
    expect(data.projects).toBeInstanceOf(Array);
    expect(data.links).toBeInstanceOf(Array);
    expect(data.additionalExperience).toBeInstanceOf(Array);
  });

  test("should fallback to English for invalid language", async () => {
    const data = await extractResumeData("invalid");

    expect(data).toBeDefined();
    expect(data.meta?.title).toBe("Omri Jukin - Resume");
    expect(data.person.name).toBe("Omri Jukin");
  });

  test("should get available languages", () => {
    const languages = getAvailableLanguages();

    expect(languages).toBeInstanceOf(Array);
    expect(languages).toEqual(["en"]);
  });

  test("should get language names", () => {
    expect(getLanguageName("en")).toBe("English");
    expect(getLanguageName("invalid")).toBe("invalid");
  });
});
