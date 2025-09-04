import {
  extractResumeData,
  getAvailableLanguages,
  getLanguageName,
} from "../lib/utils/resumeDataExtractor";

describe("Resume Data Extractor", () => {
  test("should extract resume data for English", () => {
    const data = extractResumeData("en");

    expect(data).toBeDefined();
    expect(data.meta).toBeDefined();
    expect(data.person).toBeDefined();
    expect(data.experience).toBeDefined();
    expect(data.tech).toBeDefined();
    expect(data.projects).toBeDefined();

    expect(data.meta?.title).toBe("Omri Jukin");
    expect(data.person.name).toBe("Omri Jukin");
    expect(data.experience).toBeInstanceOf(Array);
    expect(data.tech.frontend).toBeInstanceOf(Array);
    expect(data.projects).toBeInstanceOf(Array);
  });

  test("should extract resume data for Spanish", () => {
    const data = extractResumeData("es");

    expect(data).toBeDefined();
    expect(data.meta?.title).toBe("Omri Jukin");
    expect(data.person.name).toBe("Omri Jukin");
  });

  test("should extract resume data for French", () => {
    const data = extractResumeData("fr");

    expect(data).toBeDefined();
    expect(data.meta?.title).toBe("Omri Jukin");
    expect(data.person.name).toBe("Omri Jukin");
  });

  test("should extract resume data for Hebrew", () => {
    const data = extractResumeData("he");

    expect(data).toBeDefined();
    expect(data.meta?.title).toBe("עמרי חוקין");
    expect(data.person.name).toBe("Omri Jukin");
  });

  test("should fallback to English for invalid language", () => {
    const data = extractResumeData("invalid");

    expect(data).toBeDefined();
    expect(data.meta?.title).toBe("Omri Jukin");
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
