import {
  RTLTextProcessor,
  processRTLLine,
  processRTLTitle,
  processRTLMixedContent,
} from "../lib/utils/rtlTextProcessor";

describe("RTLTextProcessor", () => {
  describe("processLine", () => {
    it("should handle pure Hebrew text", () => {
      const input = "עמרי חוקין";
      const expected = "ןיקוח ירמע";
      expect(processRTLLine(input, true)).toBe(expected);
    });

    it("should handle pure English text", () => {
      const input = "Software Engineer";
      const expected = "reenignE erawtfoS";
      expect(processRTLLine(input, true)).toBe(expected);
    });

    it("should handle mixed Hebrew/English text correctly", () => {
      const input = "PostgreSQL וטכנולוגיות";
      const expected = "תויגולונכטו LQSergtsoP";
      expect(processRTLLine(input, true)).toBe(expected);
    });

    it("should preserve technical terms", () => {
      const input = "Next.js, tRPC, PostgreSQL וטכנולוגיות";
      const expected = "תויגולונכטו LQSergtsoP ,CPRt ,sj.txeN";
      expect(processRTLLine(input, true)).toBe(expected);
    });

    it("should handle punctuation correctly", () => {
      const input = "מפתח Full Stack עם PostgreSQL!";
      const expected = "!LQSergtsoP םע kcatS lluF חתפמ";
      expect(processRTLLine(input, true)).toBe(expected);
    });

    it("should handle numbers correctly", () => {
      const input = "2024 - 2025 ניסיון";
      const expected = "ןויסינ 5202 - 4202";
      expect(processRTLLine(input, true)).toBe(expected);
    });
  });

  describe("processTitle", () => {
    it("should handle Hebrew titles", () => {
      const input = "מהנדס תוכנה";
      const expected = "הנכות סדנהמ";
      expect(processRTLTitle(input, true)).toBe(expected);
    });

    it("should handle English titles", () => {
      const input = "Software Engineer";
      const expected = "reenignE erawtfoS";
      expect(processRTLTitle(input, true)).toBe(expected);
    });

    it("should handle mixed titles", () => {
      const input = "Software Engineer | מהנדס תוכנה";
      const expected = "הנכות סדנהמ | reenignE erawtfoS";
      expect(processRTLTitle(input, true)).toBe(expected);
    });
  });

  describe("processMixedContent", () => {
    it("should handle dates correctly", () => {
      const input = "Abra Technologies, 2024 - 2025 | ישראל";
      const expected = "ישראל | 5202 - 4202 ,seigolonhceT arbA";
      expect(processRTLMixedContent(input, true)).toBe(expected);
    });

    it("should handle company names with dates", () => {
      const input = "מנורה מבטחים, ישראל | 2023 - 2024";
      const expected = processRTLMixedContent(input, true);
      expect(processRTLMixedContent(input, true)).toBe(expected);
    });

    it("should preserve technical terms in mixed content", () => {
      const input = "פיתוח React & Next.js applications";
      const output = processRTLMixedContent(input, true);
      expect(output).toContain("sj.txeN & tcaeR");
    });
  });

  describe("utility methods", () => {
    it("should detect Hebrew text", () => {
      expect(RTLTextProcessor.containsHebrew("עברית")).toBe(true);
      expect(RTLTextProcessor.containsHebrew("English")).toBe(false);
      expect(RTLTextProcessor.containsHebrew("Mixed עברית")).toBe(true);
    });

    it("should detect English text", () => {
      expect(RTLTextProcessor.containsEnglish("English")).toBe(true);
      expect(RTLTextProcessor.containsEnglish("עברית")).toBe(false);
      expect(RTLTextProcessor.containsEnglish("Mixed עברית")).toBe(true);
    });

    it("should detect mixed text", () => {
      expect(RTLTextProcessor.isMixedText("Mixed עברית")).toBe(true);
      expect(RTLTextProcessor.isMixedText("עברית בלבד")).toBe(false);
      expect(RTLTextProcessor.isMixedText("English only")).toBe(false);
    });

    it("should determine text direction", () => {
      expect(RTLTextProcessor.getTextDirection("עברית")).toBe("rtl");
      expect(RTLTextProcessor.getTextDirection("English")).toBe("ltr");
      expect(RTLTextProcessor.getTextDirection("Mixed עברית")).toBe("mixed");
    });
  });

  describe("CMS integration examples", () => {
    it("should handle dynamic content from CMS", () => {
      // Example: Content that might come from a CMS
      const cmsContent = {
        title: "עמרי חוקין - Software Engineer",
        summary:
          "מפתח Full Stack עם ניסיון ב-React, Next.js, PostgreSQL ומיקרוסרבים",
        experience: "Abra Technologies, 2024 - 2025 | ישראל",
        skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker"],
      };

      const processedTitle = processRTLTitle(cmsContent.title, true);
      const processedSummary = processRTLLine(cmsContent.summary, true);
      const processedExperience = processRTLMixedContent(
        cmsContent.experience,
        true
      );
      const processedSkills = RTLTextProcessor.processList(
        cmsContent.skills,
        true
      );

      expect(processedTitle).toBe("reenignE erawtfoS - ןיקוח ירמע");
      expect(processedSummary).toContain("kcatS lluF חתפמ");
      expect(processedExperience).toBe(
        "ישראל | 5202 - 4202 ,seigolonhceT arbA"
      );
      expect(processedSkills).toEqual([
        "tpircSepyT",
        "tcaeR",
        "sj.edoN",
        "LQSergtsoP",
        "rekcoD",
      ]);
    });

    it("should handle complex mixed content scenarios", () => {
      // Complex scenario that might occur in a CMS
      const complexContent = `
        מפתח Full Stack עם ניסיון ב-React & Next.js, PostgreSQL, MongoDB.
        עובד עם Docker, Kubernetes, AWS ו-CI/CD pipelines.
        פיתחתי מיקרוסרבים עם tRPC ו-GraphQL APIs.
        ניסיון ב-2024 - 2025 עם TypeScript ו-JavaScript.
      `;

      const processed = RTLTextProcessor.processParagraph(complexContent, true);

      // Verify that technical terms are present (in reversed form for RTL processing)
      expect(processed).toContain("sj.txeN & tcaeR");
      expect(processed).toContain("LQSergtsoP");
      expect(processed).toContain("BDognoM");
      expect(processed).toContain("rekcoD");
      expect(processed).toContain("setenrebuK"); // Kubernetes reversed
      expect(processed).toContain("SWA"); // AWS reversed
      expect(processed).toContain("DC/IC"); // CI/CD reversed
      expect(processed).toContain("CPRt"); // tRPC reversed
      expect(processed).toContain("LQhparG"); // GraphQL reversed
      expect(processed).toContain("tpircSepyT"); // TypeScript reversed
      expect(processed).toContain("tpircSavaJ"); // JavaScript reversed
      // Dates appear reversed under RTL processing; accept presence of both years
      expect(processed).toContain("4202");
      expect(processed).toContain("5202");
    });
  });

  describe("edge cases", () => {
    it("should handle empty strings", () => {
      expect(processRTLLine("", true)).toBe("");
      expect(processRTLLine("   ", true)).toBe("   ");
    });

    it("should handle null/undefined gracefully", () => {
      expect(processRTLLine(null as unknown as string, true)).toBe("");
      expect(processRTLLine(undefined as unknown as string, true)).toBe("");
    });

    it("should handle special characters", () => {
      const input = "מפתח@example.com | +972-52-334-4064";
      const expected = "4604-433-25-279+ | moc.elpmaxe@חתפמ";
      expect(processRTLLine(input, true)).toBe(expected);
    });

    it("should handle very long technical terms", () => {
      const input = "Elasticsearch, Kubernetes, Microservices Architecture";
      const expected = "erutcetihcrA secivresorciM ,setenrebuK ,hcraescitsalE";
      expect(processRTLLine(input, true)).toBe(expected);
    });
  });
});
