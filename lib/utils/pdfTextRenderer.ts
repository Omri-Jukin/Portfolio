/**
 * PDF Text Rendering Utilities
 *
 * Handles rendering of both English (UTF-8) and Hebrew (UTF-8 Unicode) text in jsPDF.
 * Since jsPDF's default fonts don't support Hebrew, we use html2canvas for Hebrew text
 * and native jsPDF text rendering for English text.
 */

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Checks if text contains Hebrew characters
 */
export function containsHebrew(text: string): boolean {
  return /[\u0590-\u05FF]/.test(text);
}

/**
 * Checks if text contains primarily Hebrew (more Hebrew than English)
 */
export function isPrimarilyHebrew(text: string): boolean {
  const hebrewMatches = text.match(/[\u0590-\u05FF]/g) || [];
  const englishMatches = text.match(/[a-zA-Z]/g) || [];
  return hebrewMatches.length > englishMatches.length;
}

/**
 * Detects the primary language of text
 */
export function detectTextLanguage(
  text: string
): "hebrew" | "english" | "mixed" {
  const hasHebrew = containsHebrew(text);
  const hasEnglish = /[a-zA-Z]/.test(text);

  if (hasHebrew && hasEnglish) {
    return isPrimarilyHebrew(text) ? "hebrew" : "mixed";
  }
  if (hasHebrew) return "hebrew";
  if (hasEnglish) return "english";
  return "english"; // default
}

/**
 * Safely converts value to string, preserving all characters including Hebrew
 */
export function safeString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    return value.map((item) => safeString(item)).join(", ");
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

/**
 * Creates an HTML element with proper RTL support for Hebrew text
 */
function createHebrewHTMLElement(
  text: string,
  fontSize: number,
  fontStyle: "normal" | "bold" | "italic" = "normal",
  color: string = "#000000",
  maxWidth: number = 170
): HTMLElement {
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.left = "-9999px";
  div.style.top = "-9999px";
  div.style.width = `${maxWidth}mm`;
  div.style.fontSize = `${fontSize}pt`;
  // Use fonts that support Hebrew
  div.style.fontFamily =
    "Arial, 'Noto Sans Hebrew', 'Assistant', 'Rubik', 'David Libre', 'Frank Ruhl Libre', sans-serif";
  div.style.fontWeight = fontStyle === "bold" ? "bold" : "normal";
  div.style.fontStyle = fontStyle === "italic" ? "italic" : "normal";
  div.style.color = color;

  // Always use RTL if Hebrew is present, even in mixed text
  const hasHebrew = containsHebrew(text);
  div.style.direction = hasHebrew ? "rtl" : "ltr";
  div.style.textAlign = hasHebrew ? "right" : "left";
  // Ensure proper Unicode bidirectional algorithm - use embed, not override
  div.setAttribute("dir", hasHebrew ? "rtl" : "ltr");
  div.setAttribute("lang", hasHebrew ? "he" : "en");
  div.style.unicodeBidi = "embed"; // Use embed to allow proper bidirectional text

  div.style.whiteSpace = "pre-wrap";
  div.style.wordWrap = "break-word";
  div.style.lineHeight = "1.4";
  div.style.padding = "2px";

  // Use textContent to preserve the text exactly as-is (don't reverse it)
  div.textContent = text;
  document.body.appendChild(div);
  return div;
}

/**
 * Renders text to PDF using the appropriate method based on content
 * For Hebrew text, uses html2canvas. For English, uses native jsPDF.
 *
 * @param doc - jsPDF document instance
 * @param text - Text to render
 * @param x - X position in mm
 * @param y - Y position in mm
 * @param maxWidth - Maximum width in mm
 * @param fontSize - Font size in pt
 * @param fontStyle - Font style
 * @param color - Text color
 * @returns New Y position after rendering
 */
export async function renderTextToPDF(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number = 10,
  fontStyle: "normal" | "bold" | "italic" = "normal",
  color: string = "#000000"
): Promise<number> {
  const textStr = safeString(text);

  // For pure English text (no Hebrew at all), use native jsPDF (faster and cleaner)
  // If there's ANY Hebrew, we must use html2canvas for proper RTL rendering
  if (!containsHebrew(textStr)) {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", fontStyle);
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(textStr, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * fontSize * 0.4 + 2;
  }

  // For Hebrew or mixed text, use html2canvas
  try {
    const htmlElement = createHebrewHTMLElement(
      textStr,
      fontSize,
      fontStyle,
      color,
      maxWidth
    );

    const canvas = await html2canvas(htmlElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
      width: htmlElement.offsetWidth,
      height: htmlElement.offsetHeight,
    });

    // Convert canvas to image and add to PDF
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = canvas.width * 0.264583; // Convert px to mm (96 DPI)
    const imgHeight = canvas.height * 0.264583;

    // Calculate how many lines we need
    const lineHeight = fontSize * 0.4;

    // If the image fits in one line, add it directly
    if (imgHeight <= lineHeight * 1.5) {
      doc.addImage(imgData, "PNG", x, y - fontSize * 0.3, imgWidth, imgHeight);
      document.body.removeChild(htmlElement);
      return y + lineHeight + 2;
    }

    // For multi-line text, we need to split and render
    // This is a simplified approach - for better results, split text into chunks
    doc.addImage(imgData, "PNG", x, y - fontSize * 0.3, imgWidth, imgHeight);
    document.body.removeChild(htmlElement);
    return y + imgHeight + 2;
  } catch (error) {
    console.error("Error rendering Hebrew text with html2canvas:", error);
    // Fallback to native rendering
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", fontStyle);
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(textStr, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * fontSize * 0.4 + 2;
  }
}

/**
 * Synchronous version that uses native jsPDF for all text
 * Use this when you can't use async/await or for simple English text
 */
export function renderTextToPDFSync(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number = 10,
  fontStyle: "normal" | "bold" | "italic" = "normal",
  color: string = "#000000"
): number {
  const textStr = safeString(text);
  doc.setFontSize(fontSize);
  doc.setFont("helvetica", fontStyle);
  doc.setTextColor(color);
  const lines = doc.splitTextToSize(textStr, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * fontSize * 0.4 + 2;
}

/**
 * Splits text into chunks that can be rendered separately
 * Useful for long Hebrew text that needs proper line breaks
 */
export function splitTextIntoChunks(
  text: string,
  maxWidth: number,
  fontSize: number,
  doc: jsPDF
): string[] {
  const textStr = safeString(text);

  // For Hebrew text, we need to be more careful with splitting
  if (containsHebrew(textStr)) {
    // Use a simple character-based splitting for Hebrew
    const charsPerLine = Math.floor(maxWidth / (fontSize * 0.5));
    const chunks: string[] = [];
    let currentChunk = "";

    for (let i = 0; i < textStr.length; i++) {
      currentChunk += textStr[i];
      if (
        currentChunk.length >= charsPerLine &&
        (textStr[i] === " " || textStr[i] === "\n")
      ) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }
    }
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
    return chunks.length > 0 ? chunks : [textStr];
  }

  // For English, use jsPDF's built-in splitting
  return doc.splitTextToSize(textStr, maxWidth);
}
