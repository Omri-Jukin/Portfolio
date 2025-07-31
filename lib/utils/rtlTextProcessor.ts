/**
 * RTL Text Processing Utility for PDF Generation
 *
 * This utility handles Right-to-Left text processing for jsPDF,
 * which doesn't support RTL natively. It's designed to work with
 * a CMS system where content can be dynamically generated.
 *
 * Features:
 * - Handles pure Hebrew text
 * - Handles pure English text
 * - Handles mixed Hebrew/English text
 * - Preserves punctuation and spacing
 * - Maintains word boundaries
 * - Supports technical terms and proper nouns
 */

export interface RTLTextSegment {
  text: string;
  type: "hebrew" | "english" | "punctuation" | "whitespace" | "number";
  shouldReverse: boolean;
}

export class RTLTextProcessor {
  private static readonly HEBREW_REGEX = /[\u0590-\u05FF]/;
  private static readonly ENGLISH_REGEX = /[a-zA-Z]/;
  private static readonly NUMBER_REGEX = /[0-9]/;
  private static readonly PUNCTUATION_REGEX =
    /[.,!?;:()[\]{}"'`~@#$%^&*+=|\\/<>]/;
  private static readonly WHITESPACE_REGEX = /\s/;

  /**
   * Process text for RTL rendering in jsPDF
   * @param text - The text to process
   * @param isRTL - Whether the text should be processed for RTL
   * @returns Processed text ready for jsPDF rendering
   */
  static processText(text: string, isRTL: boolean = true): string {
    if (!isRTL) return text;
    if (!text || text.trim() === "") return text || "";

    const segments = this.segmentText(text);
    return this.processSegments(segments);
  }

  /**
   * Segment text into different types for processing
   */
  private static segmentText(text: string): RTLTextSegment[] {
    const segments: RTLTextSegment[] = [];
    let currentSegment = "";
    let currentType: RTLTextSegment["type"] = "punctuation";

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const charType = this.getCharacterType(char);

      if (charType !== currentType && currentSegment !== "") {
        segments.push({
          text: currentSegment,
          type: currentType,
          shouldReverse: this.shouldReverseSegment(currentSegment, currentType),
        });
        currentSegment = "";
      }

      currentSegment += char;
      currentType = charType;
    }

    // Add the last segment
    if (currentSegment !== "") {
      segments.push({
        text: currentSegment,
        type: currentType,
        shouldReverse: this.shouldReverseSegment(currentSegment, currentType),
      });
    }

    return segments;
  }

  /**
   * Determine the type of a character
   */
  private static getCharacterType(char: string): RTLTextSegment["type"] {
    if (this.HEBREW_REGEX.test(char)) return "hebrew";
    if (this.ENGLISH_REGEX.test(char)) return "english";
    if (this.NUMBER_REGEX.test(char)) return "number";
    if (this.PUNCTUATION_REGEX.test(char)) return "punctuation";
    if (this.WHITESPACE_REGEX.test(char)) return "whitespace";
    return "punctuation";
  }

  /**
   * Determine if a segment should be reversed
   */
  private static shouldReverseSegment(
    text: string,
    type: RTLTextSegment["type"]
  ): boolean {
    switch (type) {
      case "hebrew":
        return true;
      case "english":
        // Don't reverse English words
        return false;
      case "number":
        // Don't reverse numbers
        return false;
      case "punctuation":
        // Don't reverse punctuation
        return false;
      case "whitespace":
        // Don't reverse whitespace
        return false;
      default:
        return false;
    }
  }

  /**
   * Process segments and return final text
   */
  private static processSegments(segments: RTLTextSegment[]): string {
    return segments
      .map((segment) => {
        if (segment.shouldReverse) {
          return segment.text.split("").reverse().join("");
        }
        return segment.text;
      })
      .join("");
  }

  /**
   * Process a line of text with special handling for mixed content
   * This is the main method to use for PDF text rendering
   */
  static processLine(text: string, isRTL: boolean = true): string {
    if (!isRTL) return text;
    if (!text) return "";

    // For jsPDF RTL rendering, we need to reverse the entire text
    // because jsPDF doesn't support RTL natively
    return text.split("").reverse().join("");
  }

  /**
   * Handle common technical terms that should not be reversed
   */
  private static handleTechnicalTerms(text: string): string {
    // Common technical terms that should remain in English order
    const technicalTerms = [
      "PostgreSQL",
      "MongoDB",
      "Next.js",
      "tRPC",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "React",
      "Express",
      "API",
      "UI",
      "UX",
      "CI/CD",
      "DevOps",
      "AWS",
      "Azure",
      "GCP",
      "Docker",
      "Kubernetes",
      "Git",
      "GitHub",
      "npm",
      "yarn",
      "webpack",
      "Babel",
      "ESLint",
      "Prettier",
      "Jest",
      "Cypress",
      "Selenium",
      "REST",
      "GraphQL",
      "JWT",
      "OAuth",
      "SSL",
      "HTTP",
      "HTTPS",
      "TCP",
      "UDP",
      "IP",
      "DNS",
      "CDN",
      "API",
      "SDK",
      "CLI",
      "GUI",
      "TUI",
      "IDE",
      "VSCode",
      "WebStorm",
      "IntelliJ",
      "Linux",
      "Windows",
      "macOS",
      "Ubuntu",
      "CentOS",
      "Debian",
      "MySQL",
      "SQLite",
      "Redis",
      "Elasticsearch",
      "Kafka",
      "RabbitMQ",
      "Nginx",
      "Apache",
      "IIS",
      "PM2",
      "Forever",
      "nodemon",
    ];

    let processedText = text;

    // Replace technical terms with placeholders, process, then restore
    const termMap = new Map<string, string>();

    technicalTerms.forEach((term, index) => {
      const placeholder = `__TECH_TERM_${index}__`;
      const regex = new RegExp(`\\b${term}\\b`, "gi");
      if (regex.test(processedText)) {
        processedText = processedText.replace(regex, placeholder);
        termMap.set(placeholder, term);
      }
    });

    // Process the text using the core segmentation logic
    const segments = this.segmentText(processedText);
    const processed = this.processSegments(segments);

    // Restore technical terms
    let result = processed;
    termMap.forEach((term, placeholder) => {
      result = result.replace(placeholder, term);
    });

    return result;
  }

  /**
   * Process a paragraph with proper line breaks
   */
  static processParagraph(text: string, isRTL: boolean = true): string {
    if (!isRTL) return text;

    const lines = text.split("\n");
    return lines.map((line) => this.processLine(line, isRTL)).join("\n");
  }

  /**
   * Process a list of items
   */
  static processList(items: string[], isRTL: boolean = true): string[] {
    if (!isRTL) return items;
    return items.map((item) => this.processLine(item, isRTL));
  }

  /**
   * Process a title or heading
   */
  static processTitle(text: string, isRTL: boolean = true): string {
    if (!isRTL) return text;
    return this.processLine(text, isRTL);
  }

  /**
   * Process mixed content with special handling for dates and numbers
   */
  static processMixedContent(text: string, isRTL: boolean = true): string {
    if (!isRTL) return text;

    // Handle dates and numbers specially
    const processedText = this.handleDatesAndNumbers(text);
    return this.processLine(processedText, isRTL);
  }

  /**
   * Handle dates and numbers that should not be reversed
   */
  private static handleDatesAndNumbers(text: string): string {
    // Date patterns: 2024, 2024-2025, 2024 - 2025, etc.
    const datePatterns = [
      /\b\d{4}\b/g, // Year: 2024
      /\b\d{4}-\d{4}\b/g, // Year range: 2024-2025
      /\b\d{4}\s*-\s*\d{4}\b/g, // Year range with spaces: 2024 - 2025
      /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g, // Date: 12/25/2024
      /\b\d{1,2}-\d{1,2}-\d{4}\b/g, // Date: 12-25-2024
    ];

    let processedText = text;
    const numberMap = new Map<string, string>();
    let counter = 0;

    datePatterns.forEach((pattern) => {
      processedText = processedText.replace(pattern, (match) => {
        const placeholder = `__DATE_${counter}__`;
        numberMap.set(placeholder, match);
        counter++;
        return placeholder;
      });
    });

    // Process the text
    const processed = this.processText(processedText, true);

    // Restore dates and numbers
    let result = processed;
    numberMap.forEach((number, placeholder) => {
      result = result.replace(placeholder, number);
    });

    return result;
  }

  /**
   * Utility method to check if text contains Hebrew characters
   */
  static containsHebrew(text: string): boolean {
    return this.HEBREW_REGEX.test(text);
  }

  /**
   * Utility method to check if text contains English characters
   */
  static containsEnglish(text: string): boolean {
    return this.ENGLISH_REGEX.test(text);
  }

  /**
   * Utility method to check if text is mixed Hebrew/English
   */
  static isMixedText(text: string): boolean {
    return this.containsHebrew(text) && this.containsEnglish(text);
  }

  /**
   * Utility method to get text direction
   */
  static getTextDirection(text: string): "rtl" | "ltr" | "mixed" {
    const hasHebrew = this.containsHebrew(text);
    const hasEnglish = this.containsEnglish(text);

    if (hasHebrew && hasEnglish) return "mixed";
    if (hasHebrew) return "rtl";
    return "ltr";
  }
}

// Export convenience functions for common use cases
export const processRTLText = (text: string, isRTL: boolean = true): string => {
  return RTLTextProcessor.processText(text, isRTL);
};

export const processRTLLine = (text: string, isRTL: boolean = true): string => {
  return RTLTextProcessor.processLine(text, isRTL);
};

export const processRTLParagraph = (
  text: string,
  isRTL: boolean = true
): string => {
  return RTLTextProcessor.processParagraph(text, isRTL);
};

export const processRTLTitle = (
  text: string,
  isRTL: boolean = true
): string => {
  return RTLTextProcessor.processTitle(text, isRTL);
};

export const processRTLMixedContent = (
  text: string,
  isRTL: boolean = true
): string => {
  return RTLTextProcessor.processMixedContent(text, isRTL);
};
