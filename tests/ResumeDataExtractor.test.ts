import {
  extractResumeData,
  getAvailableLanguages,
  getLanguageName,
} from "../lib/utils/resumeDataExtractor";

describe("Resume Data Extractor", () => {
  test("should extract resume data for English", () => {
    const data = extractResumeData("en");

    expect(data).toBeDefined();
    expect(data.metadata).toBeDefined();
    expect(data.resume).toBeDefined();
    expect(data.career).toBeDefined();
    expect(data.skills).toBeDefined();
    expect(data.projects).toBeDefined();

    expect(data.metadata.title).toBe("Omri Jukin");
    expect(data.resume.title).toBe("Resume");
    expect(data.career.experiences).toBeInstanceOf(Array);
    expect(data.skills.categories.technical.skills).toBeInstanceOf(Array);
    expect(data.projects.projects).toBeInstanceOf(Array);
  });

  test("should extract resume data for Spanish", () => {
    const data = extractResumeData("es");

    expect(data).toBeDefined();
    expect(data.metadata.title).toBe("Omri Jukin");
    expect(data.resume.title).toBe("Currículum");
  });

  test("should extract resume data for French", () => {
    const data = extractResumeData("fr");

    expect(data).toBeDefined();
    expect(data.metadata.title).toBe("Omri Jukin");
    expect(data.resume.title).toBe("CV");
  });

  test("should extract resume data for Hebrew", () => {
    const data = extractResumeData("he");

    expect(data).toBeDefined();
    expect(data.metadata.title).toBe("עמרי חוקין");
    expect(data.resume.title).toBe("קורות חיים");
  });

  test("should fallback to English for invalid language", () => {
    const data = extractResumeData("invalid");

    expect(data).toBeDefined();
    expect(data.metadata.title).toBe("Omri Jukin");
    expect(data.resume.title).toBe("Resume");
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
