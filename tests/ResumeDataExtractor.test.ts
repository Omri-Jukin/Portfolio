import {
  extractResumeData,
  getAvailableLanguages,
  getLanguageName,
} from "../lib/utils/resumeDataExtractor";

describe("Resume Data Extractor", () => {
  const recruiterTitle = "Omri Jukin \u2014 Full-Stack TypeScript Engineer";
  const hebrewName = "\u05e2\u05de\u05e8\u05d9 \u05d7\u05d5\u05e7\u05d9\u05df";

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

  test("should extract resume data for Spanish", async () => {
    const data = await extractResumeData("es");

    expect(data).toBeDefined();
    expect(data.meta?.title).toBe(recruiterTitle);
    expect(data.person.name).toBe("Omri Jukin");
  });

  test("should extract resume data for French", async () => {
    const data = await extractResumeData("fr");

    expect(data).toBeDefined();
    expect(data.meta?.title).toBe(recruiterTitle);
    expect(data.person.name).toBe("Omri Jukin");
  });

  test("should extract resume data for Hebrew", async () => {
    const data = await extractResumeData("he");

    expect(data).toBeDefined();
    expect(data.meta?.title).toBe(recruiterTitle);
    expect(data.person.name).toBe(hebrewName);
  });

  test("should fallback to English for invalid language", async () => {
    const data = await extractResumeData("invalid");

    expect(data).toBeDefined();
    expect(data.meta?.title).toBe(recruiterTitle);
    expect(data.person.name).toBe("Omri Jukin");
  });

  test("should get available languages", () => {
    const languages = getAvailableLanguages();

    expect(languages).toBeInstanceOf(Array);
    expect(languages).toContain("en");
    expect(languages).toContain("es");
    expect(languages).toContain("fr");
    expect(languages).toContain("he");
  });

  test("should get language names", () => {
    expect(getLanguageName("en")).toBe("English");
    expect(getLanguageName("es")).toBe("Spanish");
    expect(getLanguageName("fr")).toBe("French");
    expect(getLanguageName("he")).toBe("Hebrew");
    expect(getLanguageName("invalid")).toBe("invalid");
  });
});
