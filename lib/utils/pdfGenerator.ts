import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  processRTLLine,
  processRTLTitle,
  processRTLMixedContent,
} from "./rtlTextProcessor";

export interface ResumeData {
  metadata: {
    title: string;
    description: string;
  };
  resume: {
    title: string;
    description: string;
    experience: string;
    professionalSummary: string;
  };
  career: {
    experiences: Array<{
      role: string;
      company: string;
      time: string;
      details: string[];
    }>;
  };
  skills: {
    categories: {
      technical: {
        skills: Array<{
          name: string;
          level: number;
          technologies: string[];
        }>;
      };
      soft: {
        skills: Array<{
          name: string;
          level: number;
          description: string;
        }>;
      };
    };
  };
  projects: {
    projects: Array<{
      title: string;
      description: string;
      link: string;
    }>;
  };
  languages: {
    programming: Array<{
      name: string;
      level: string;
    }>;
    spoken: Array<{
      name: string;
      level: string;
    }>;
  };
  additionalActivities: string;
}

export type ResumeTemplate =
  | "clean"
  | "classic"
  | "compact"
  | "teal"
  | "indigo"
  | "rose"
  | "stripe"
  | "grid";

export class PDFGenerator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private doc: any;
  private currentY: number = 25;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 8;
  private sidebarWidth: number = 0; // Single-column layout for ATS
  private mainContentWidth: number;
  private lineHeight: number = 7;
  private primaryColor: [number, number, number] = [44, 62, 80]; // Dark blue-gray
  private secondaryColor: [number, number, number] = [52, 73, 94]; // Dark gray
  private accentColor: [number, number, number] = [127, 0, 63]; // Red accent
  private sidebarColor: [number, number, number] = [255, 255, 255]; // No sidebar color needed
  private isRTL: boolean = false;
  private sidebarX: number = 0;
  private mainContentX: number = 0;
  private template: ResumeTemplate = "clean";
  private areFontsEmbedded: boolean = false;
  private isInitialized: boolean = false;

  constructor() {
    // Actual initialization happens in initDoc() at runtime
    this.doc = null;
    this.pageWidth = 0;
    this.pageHeight = 0;
    this.mainContentWidth = 0;
  }

  private async initDoc(): Promise<void> {
    if (this.isInitialized) return;
    if (typeof window === "undefined") return; // Only run on client

    this.doc = new jsPDF("p", "mm", "a4");
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.mainContentWidth = this.pageWidth - 2 * this.margin;

    this.doc.setProperties({
      title: "Omri Jukin - Resume",
      subject: "Professional Resume",
      author: "Omri Jukin",
      creator: "Portfolio Website",
    });

    this.isInitialized = true;
  }

  private async embedFonts(): Promise<void> {
    if (this.areFontsEmbedded) return;
    if (typeof window === "undefined") return;

    const regularUrl = "/Bona_Nova_SC/BonaNovaSC-Regular.ttf";
    const boldUrl = "/Bona_Nova_SC/BonaNovaSC-Bold.ttf";

    try {
      const [regularB64, boldB64] = await Promise.all([
        this.fetchAsBase64(regularUrl),
        this.fetchAsBase64(boldUrl),
      ]);

      this.doc.addFileToVFS("BonaNovaSC-Regular.ttf", regularB64);
      this.doc.addFont("BonaNovaSC-Regular.ttf", "bona-nova", "normal");
      this.doc.addFileToVFS("BonaNovaSC-Bold.ttf", boldB64);
      this.doc.addFont("BonaNovaSC-Bold.ttf", "bona-nova", "bold");

      this.areFontsEmbedded = true;
    } catch {
      this.areFontsEmbedded = false;
    }
  }

  private async fetchAsBase64(url: string): Promise<string> {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    let binary = "";
    const bytes = new Uint8Array(buf);
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    return btoa(binary);
  }

  async generateResume(
    data: ResumeData,
    language: string = "en",
    template: ResumeTemplate = "clean"
  ): Promise<void> {
    await this.initDoc();
    // Set RTL for Hebrew
    this.isRTL = language === "he";
    this.template = template;

    // Apply color palette by template (text prefers dark colors by default)
    this.applyTemplatePalette(template);

    // Ensure required fonts are embedded for browser rendering
    await this.embedFonts();

    // Calculate layout positions based on RTL - sidebar flush with edge
    this.sidebarX = 0;
    this.mainContentX = this.margin;

    this.currentY = this.getTopStartY();

    // Draw decorative background (CSS-like visuals) per template
    this.drawDecorativeBackground();

    // Render by selected template
    switch (this.template) {
      case "classic":
        this.addMainContentClassic(data);
        break;
      case "compact":
        this.addMainContentCompact(data);
        break;
      case "teal":
        this.addMainContentClassic(data);
        break;
      case "indigo":
        this.addMainContentClassic(data);
        break;
      case "rose":
        this.addMainContentClassic(data);
        break;
      case "stripe":
        this.addMainContent(data);
        break;
      case "grid":
        this.addMainContent(data);
        break;
      case "clean":
      default:
        this.addMainContent(data);
        break;
    }

    console.log(
      `Resume generated in ${language} (${
        this.isRTL ? "RTL" : "LTR"
      }) with template ${this.template}`
    );
  }

  private applyTemplatePalette(template: ResumeTemplate): void {
    // Defaults: dark text for readability
    const primary: [number, number, number] = [20, 20, 20];
    const secondary: [number, number, number] = [68, 68, 68];
    let accent: [number, number, number] = [127, 0, 63];

    switch (template) {
      case "teal":
        // keep dark primary; set accent to template color
        accent = [0, 121, 107];
        break;
      case "indigo":
        accent = [63, 81, 181];
        break;
      case "rose":
        accent = [173, 20, 87];
        break;
      case "stripe":
        accent = [127, 0, 63];
        break;
      case "grid":
        accent = [52, 73, 94];
        break;
      default:
        // keep defaults
        break;
    }

    this.primaryColor = primary;
    this.secondaryColor = secondary;
    this.accentColor = accent;
  }

  private getTopStartY(): number {
    switch (this.template) {
      case "teal":
      case "indigo":
      case "rose":
        return 45; // header band height ~35 + padding
      case "grid":
        return 36; // header band ~28 + padding
      case "stripe":
        return 40; // below divider
      case "classic":
      case "compact":
      case "clean":
      default:
        return 40;
    }
  }

  private drawDecorativeBackground(): void {
    // Clear page with white base
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(0, 0, this.pageWidth, this.pageHeight, "F");

    switch (this.template) {
      case "teal":
        // Header band
        this.doc.setFillColor(0, 121, 107);
        this.doc.rect(0, 0, this.pageWidth, 35, "F");
        // Soft blob bottom-right
        this.doc.setFillColor(200, 245, 238);
        this.doc.circle(this.pageWidth - 10, this.pageHeight - 10, 25, "F");
        break;
      case "indigo":
        // Header band
        this.doc.setFillColor(63, 81, 181);
        this.doc.rect(0, 0, this.pageWidth, 35, "F");
        // Subtle accent strip below
        this.doc.setFillColor(242, 244, 252);
        this.doc.rect(0, 35, this.pageWidth, 6, "F");
        break;
      case "rose":
        // Header band
        this.doc.setFillColor(173, 20, 87);
        this.doc.rect(0, 0, this.pageWidth, 35, "F");
        // Corner dots
        this.doc.setFillColor(252, 240, 244);
        for (let i = 0; i < 6; i++) {
          this.doc.circle(8 + i * 10, 8, 1.2, "F");
        }
        for (let i = 0; i < 6; i++) {
          this.doc.circle(
            this.pageWidth - (8 + i * 10),
            this.pageHeight - 8,
            1.2,
            "F"
          );
        }
        break;
      case "stripe":
        // Diagonal stripes (subtle) across background
        this.doc.setDrawColor(245, 246, 248);
        this.doc.setLineWidth(0.4);
        for (
          let x = -this.pageHeight;
          x < this.pageWidth + this.pageHeight;
          x += 8
        ) {
          this.doc.line(x, 0, x + this.pageHeight, this.pageHeight);
        }
        // Header divider
        this.doc.setFillColor(245, 246, 248);
        this.doc.rect(0, 34, this.pageWidth, 1.5, "F");
        break;
      case "grid":
        // Light grid pattern
        this.doc.setDrawColor(245, 246, 248);
        this.doc.setLineWidth(0.2);
        for (let x = 0; x <= this.pageWidth; x += 8) {
          this.doc.line(x, 0, x, this.pageHeight);
        }
        for (let y = 0; y <= this.pageHeight; y += 8) {
          this.doc.line(0, y, this.pageWidth, y);
        }
        // Subtle header band
        this.doc.setFillColor(248, 249, 250);
        this.doc.rect(0, 0, this.pageWidth, 28, "F");
        break;
      default:
        // clean/classic/compact: minimal light divider under header area
        this.doc.setFillColor(245, 246, 248);
        this.doc.rect(0, 34, this.pageWidth, 1.5, "F");
        break;
    }
  }

  // Helper method to handle RTL text properly using the robust RTL processor
  private processRTLText(text: string): string {
    if (!this.isRTL) return text;
    return processRTLLine(text, this.isRTL);
  }

  private drawSidebarBackground(): void {
    // Maintain compatibility; delegate to decorative background so it's applied on new pages
    this.drawDecorativeBackground();
  }

  private addSidebarContent(): void {}

  private addSidebarSection(title: string, y: number): number {
    // Section title in white
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(12);

    if (this.isRTL) {
      this.doc.setFont("bona-nova", "bold");
      const titleX = this.sidebarX + this.sidebarWidth - 5;
      this.doc.text(title, titleX, y, { align: "right" });
    } else {
      this.doc.setFont("helvetica", "bold");
      const titleX = this.sidebarX + 5;
      this.doc.text(title, titleX, y);
    }

    return y + 8;
  }

  private addContactInfoSidebar(y: number): number {
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(9);

    if (this.isRTL) {
      this.doc.setFont("bona-nova", "normal");
    } else {
      this.doc.setFont("helvetica", "normal");
    }

    const contactInfo = [
      { text: "[E] omrijukin@gmail.com", url: "mailto:omrijukin@gmail.com" },
      { text: "[P] +972 52-334-4064", url: "tel:+972523344064" },
      {
        text: "[L] LinkedIn",
        url: "https://linkedin.com/in/omri-jukin",
      },
      {
        text: "[G] GitHub",
        url: "https://github.com/Omri-Jukin",
      },
      { text: "[W] omrijukin.com", url: "https://omrijukin.com" },
      { text: "[I] Israel", url: null },
    ];

    contactInfo.forEach((info) => {
      if (this.isRTL) {
        const textX = this.sidebarX + this.sidebarWidth - 5;

        if (info.url) {
          // Add clickable link
          this.doc.setTextColor(255, 255, 255);
          this.doc.text(info.text, textX, y, { align: "right" });

          // Add underline to indicate it's clickable
          const textWidth = this.doc.getTextWidth(info.text);
          this.doc.setDrawColor(255, 255, 255);
          this.doc.setLineWidth(0.2);
          this.doc.line(textX - textWidth, y + 1, textX, y + 1);

          // Add the link annotation
          this.doc.link(textX - textWidth, y - 3, textWidth, 4, {
            url: info.url,
          });
        } else {
          // Regular text without link
          this.doc.text(info.text, textX, y, { align: "right" });
        }
      } else {
        const textX = this.sidebarX + 5;

        if (info.url) {
          // Add clickable link
          this.doc.setTextColor(255, 255, 255);
          this.doc.text(info.text, textX, y);

          // Add underline to indicate it's clickable
          const textWidth = this.doc.getTextWidth(info.text);
          this.doc.setDrawColor(255, 255, 255);
          this.doc.setLineWidth(0.2);
          this.doc.line(textX, y + 1, textX + textWidth, y + 1);

          // Add the link annotation
          this.doc.link(textX, y - 3, textWidth, 4, { url: info.url });
        } else {
          // Regular text without link
          this.doc.text(info.text, textX, y);
        }
      }

      y += 6;
    });

    return y + 8;
  }

  private addSkillsSidebar(skills: ResumeData["skills"], y: number): number {
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(8);

    if (this.isRTL) {
      this.doc.setFont("bona-nova", "normal");
    } else {
      this.doc.setFont("helvetica", "normal");
    }

    // Create skill tags similar to the image
    const skillTags = [
      "Full Stack Development",
      "React & Next.js",
      "TypeScript",
      "Node.js & Express",
      "Database Design",
      "API Development",
      "DevOps & CI/CD",
      "System Architecture",
      "Data Management",
      "Electrical Engineering",
    ];

    if (this.isRTL) {
      let currentX = this.sidebarX + this.sidebarWidth - 5;
      let currentY = y;
      const tagHeight = 6;

      skillTags.forEach((skill) => {
        const tagWidth = this.doc.getTextWidth(skill) + 8;

        // Check if we need to wrap to next line
        if (currentX - tagWidth < this.sidebarX + 5) {
          currentX = this.sidebarX + this.sidebarWidth - 5;
          currentY += tagHeight + 2;
        }

        // Draw tag background
        this.doc.setFillColor(70, 130, 180);
        this.doc.rect(
          currentX - tagWidth,
          currentY - 4,
          tagWidth,
          tagHeight,
          "F"
        );

        // Draw tag text
        this.doc.setTextColor(255, 255, 255);
        this.doc.text(skill, currentX - 4, currentY, { align: "right" });

        currentX -= tagWidth + 3;
      });

      return currentY + tagHeight + 8;
    } else {
      let currentX = this.sidebarX + 5;
      let currentY = y;
      const tagHeight = 6;

      skillTags.forEach((skill) => {
        const tagWidth = this.doc.getTextWidth(skill) + 8;

        // Check if we need to wrap to next line
        if (currentX + tagWidth > this.sidebarX + this.sidebarWidth - 5) {
          currentX = this.sidebarX + 5;
          currentY += tagHeight + 2;
        }

        // Draw tag background
        this.doc.setFillColor(70, 130, 180);
        this.doc.rect(currentX, currentY - 4, tagWidth, tagHeight, "F");

        // Draw tag text
        this.doc.setTextColor(255, 255, 255);
        this.doc.text(skill, currentX + 4, currentY);

        currentX += tagWidth + 3;
      });

      return currentY + tagHeight + 8;
    }
  }

  private addLanguagesSidebar(
    languages: ResumeData["languages"],
    y: number
  ): number {
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(8);

    if (this.isRTL) {
      this.doc.setFont("bona-nova", "normal");
    } else {
      this.doc.setFont("helvetica", "normal");
    }

    if (this.isRTL) {
      // Programming Languages
      this.doc.setFont("bona-nova", "bold");
      this.doc.text("Programming:", this.sidebarX + this.sidebarWidth - 5, y, {
        align: "right",
      });
      y += 4;

      this.doc.setFont("bona-nova", "normal");
      languages.programming.forEach((lang) => {
        this.doc.text(
          `${lang.name} (${lang.level})`,
          this.sidebarX + this.sidebarWidth - 5,
          y,
          { align: "right" }
        );
        y += 3;
      });

      y += 3;

      // Spoken Languages
      this.doc.setFont("bona-nova", "bold");
      this.doc.text("Spoken:", this.sidebarX + this.sidebarWidth - 5, y, {
        align: "right",
      });
      y += 4;

      this.doc.setFont("bona-nova", "normal");
      languages.spoken.forEach((lang) => {
        this.doc.text(
          `${lang.name} (${lang.level})`,
          this.sidebarX + this.sidebarWidth - 5,
          y,
          { align: "right" }
        );
        y += 3;
      });
    } else {
      // Programming Languages
      this.doc.setFont("helvetica", "bold");
      this.doc.text("Programming:", this.sidebarX + 5, y);
      y += 4;

      this.doc.setFont("helvetica", "normal");
      languages.programming.forEach((lang) => {
        this.doc.text(`${lang.name} (${lang.level})`, this.sidebarX + 5, y);
        y += 3;
      });

      y += 3;

      // Spoken Languages
      this.doc.setFont("helvetica", "bold");
      this.doc.text("Spoken:", this.sidebarX + 5, y);
      y += 4;

      this.doc.setFont("helvetica", "normal");
      languages.spoken.forEach((lang) => {
        this.doc.text(`${lang.name} (${lang.level})`, this.sidebarX + 5, y);
        y += 3;
      });
    }

    return y + 8;
  }

  private addCertificatesSidebar(y: number): number {
    return y;
  }

  private addMainContent(data: ResumeData): void {
    let mainY = this.getTopStartY();

    // Header with name and title
    mainY = this.addMainHeader(data.metadata, mainY);

    // Professional Summary
    mainY = this.addMainSection(
      "Professional Summary",
      data.resume.experience,
      mainY
    );

    // Professional Experience
    mainY = this.addExperienceSection(data.career, mainY);

    // Projects
    mainY = this.addProjectsSection(data.projects, mainY);

    // Additional Activities
    this.addMainSection(
      "Additional Activities",
      data.additionalActivities,
      mainY
    );
  }

  // Classic template: subtle separators and larger headings
  private addMainContentClassic(data: ResumeData): void {
    let y = this.getTopStartY();
    y = this.addMainHeader(data.metadata, y);
    this.drawSeparator(y - 4);
    y = this.addMainSection("Professional Summary", data.resume.experience, y);
    this.drawSeparator(y - 8);
    y = this.addExperienceSection(data.career, y);
    this.drawSeparator(y - 8);
    y = this.addProjectsSection(data.projects, y);
    this.drawSeparator(y - 8);
    this.addMainSection("Additional Activities", data.additionalActivities, y);
  }

  // Compact template: tighter spacing and smaller fonts
  private addMainContentCompact(data: ResumeData): void {
    const originalLineHeight = this.lineHeight;
    const originalFontSize = this.doc.getFontSize();

    this.lineHeight = 5.5;
    this.doc.setFontSize(22);
    let y = this.getTopStartY();
    y = this.addMainHeader(data.metadata, y);

    this.doc.setFontSize(12);
    y = this.addMainSection("Professional Summary", data.resume.experience, y);
    y = this.addExperienceSection(data.career, y);
    y = this.addProjectsSection(data.projects, y);
    this.addMainSection("Additional Activities", data.additionalActivities, y);

    // Restore
    this.lineHeight = originalLineHeight;
    this.doc.setFontSize(originalFontSize);
  }

  private drawSeparator(y: number): void {
    this.doc.setDrawColor(200, 200, 200);
    this.doc.setLineWidth(0.2);
    this.doc.line(
      this.mainContentX,
      y,
      this.mainContentX + this.mainContentWidth,
      y
    );
  }

  private addMainHeader(metadata: ResumeData["metadata"], y: number): number {
    // Name
    this.doc.setTextColor(...this.primaryColor);
    this.doc.setFontSize(24);

    if (this.isRTL) {
      this.doc.setFont("bona-nova", "bold");
      const processedTitle = processRTLTitle(metadata.title, this.isRTL);
      this.doc.text(
        processedTitle,
        this.mainContentX + this.mainContentWidth - 15,
        y,
        { align: "right" }
      );
    } else {
      this.doc.setFont("helvetica", "bold");
      this.doc.text(metadata.title, this.mainContentX, y);
    }
    y += 10;

    // Title - role line
    this.doc.setTextColor(...this.accentColor);
    this.doc.setFontSize(14);

    if (this.isRTL) {
      this.doc.setFont("bona-nova", "normal");
    } else {
      this.doc.setFont("helvetica", "normal");
    }

    const titleText = this.isRTL
      ? this.processRTLText("Full Stack Developer | Data Management")
      : "Full Stack Developer | Data Management";
    const titleWidth = this.doc.getTextWidth(titleText);

    if (this.isRTL) {
      // If title is too wide, split it into multiple lines
      if (titleWidth > this.mainContentWidth) {
        const words = titleText.split(" | ");
        let currentLine = "";
        let lineY = y;

        words.forEach((word) => {
          const testLine = currentLine + (currentLine ? " | " : "") + word;
          if (
            this.doc.getTextWidth(testLine) > this.mainContentWidth &&
            currentLine
          ) {
            this.doc.text(
              currentLine,
              this.mainContentX + this.mainContentWidth,
              lineY,
              { align: "right" }
            );
            lineY += 6;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        });

        if (currentLine) {
          this.doc.text(
            currentLine,
            this.mainContentX + this.mainContentWidth - 15,
            lineY,
            { align: "right" }
          );
          lineY += 6;
        }

        y = lineY + 10;
      } else {
        this.doc.text(
          titleText,
          this.mainContentX + this.mainContentWidth - 15,
          y,
          {
            align: "right",
          }
        );
        y += 15;
      }
    } else {
      // If title is too wide, split it into multiple lines
      if (titleWidth > this.mainContentWidth) {
        const words = titleText.split(" | ");
        let currentLine = "";
        let lineY = y;

        words.forEach((word) => {
          const testLine = currentLine + (currentLine ? " | " : "") + word;
          if (
            this.doc.getTextWidth(testLine) > this.mainContentWidth &&
            currentLine
          ) {
            this.doc.text(currentLine, this.mainContentX, lineY);
            lineY += 6;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        });

        if (currentLine) {
          this.doc.text(currentLine, this.mainContentX, lineY);
          lineY += 6;
        }

        y = lineY + 10;
      } else {
        this.doc.text(titleText, this.mainContentX, y);
        y += 15;
      }
    }

    return y;
  }

  private addMainSection(title: string, content: string, y: number): number {
    // Check if we need a page break
    if (y > this.pageHeight - 50) {
      this.doc.addPage();
      this.drawSidebarBackground();
      y = this.getTopStartY();
    }

    // Section title
    this.doc.setTextColor(...this.primaryColor);
    this.doc.setFontSize(16);

    if (this.isRTL) {
      this.doc.setFont("bona-nova", "bold");
      const processedTitle = this.processRTLText(title);
      this.doc.text(
        processedTitle,
        this.mainContentX + this.mainContentWidth - 15,
        y,
        {
          align: "right",
        }
      );
    } else {
      this.doc.setFont("helvetica", "bold");
      this.doc.text(title, this.mainContentX, y);
    }
    y += 10;

    // Section content
    this.doc.setTextColor(...this.secondaryColor);
    this.doc.setFontSize(10);

    if (this.isRTL) {
      this.doc.setFont("bona-nova", "normal");
    } else {
      this.doc.setFont("helvetica", "normal");
    }

    const lines = this.doc.splitTextToSize(content, this.mainContentWidth);
    lines.forEach((line: string) => {
      if (y > this.pageHeight - 30) {
        this.doc.addPage();
        this.drawSidebarBackground();
        y = this.getTopStartY();
      }

      if (this.isRTL) {
        const processedLine = this.processRTLText(line);
        this.doc.text(
          processedLine,
          this.mainContentX + this.mainContentWidth - 15,
          y,
          {
            align: "right",
          }
        );
      } else {
        this.doc.text(line, this.mainContentX, y);
      }
      y += 6;
    });

    return y + 10;
  }

  private addExperienceSection(
    career: ResumeData["career"],
    y: number
  ): number {
    // Check if we need a page break
    if (y > this.pageHeight - 80) {
      this.doc.addPage();
      this.drawSidebarBackground();
      y = this.getTopStartY();
    }

    // Section title
    this.doc.setTextColor(...this.primaryColor);
    this.doc.setFontSize(16);

    if (this.isRTL) {
      this.doc.setFont("bona-nova", "bold");
      const processedTitle = this.processRTLText("Professional Experience");
      this.doc.text(
        processedTitle,
        this.mainContentX + this.mainContentWidth - 15,
        y,
        { align: "right" }
      );
    } else {
      this.doc.setFont("helvetica", "bold");
      this.doc.text("Professional Experience", this.mainContentX, y);
    }
    y += 8;

    career.experiences.forEach((experience) => {
      // Check if we need a page break before adding experience
      if (y > this.pageHeight - 60) {
        this.doc.addPage();
        this.drawSidebarBackground();
        y = this.getTopStartY();
      }

      // Role
      this.doc.setTextColor(...this.primaryColor);
      this.doc.setFontSize(12);

      if (this.isRTL) {
        this.doc.setFont("bona-nova", "bold");
        const processedRole = this.processRTLText(experience.role);
        this.doc.text(
          processedRole,
          this.mainContentX + this.mainContentWidth - 15,
          y,
          { align: "right" }
        );
      } else {
        this.doc.setFont("helvetica", "bold");
        this.doc.text(experience.role, this.mainContentX, y);
      }
      y += 6;

      // Company and time
      this.doc.setTextColor(...this.accentColor);
      this.doc.setFontSize(10);

      if (this.isRTL) {
        this.doc.setFont("bona-nova", "normal");
        const processedCompanyTime = processRTLMixedContent(
          `${experience.company} | ${experience.time}`,
          this.isRTL
        );
        this.doc.text(
          processedCompanyTime,
          this.mainContentX + this.mainContentWidth - 15,
          y,
          { align: "right" }
        );
      } else {
        this.doc.setFont("helvetica", "normal");
        this.doc.text(
          `${experience.company} | ${experience.time}`,
          this.mainContentX,
          y
        );
      }
      y += 8;

      // Details
      this.doc.setTextColor(...this.secondaryColor);

      if (this.isRTL) {
        this.doc.setFont("bona-nova", "normal");
      } else {
        this.doc.setFont("helvetica", "normal");
      }

      experience.details.forEach((detail) => {
        if (y > this.pageHeight - 30) {
          this.doc.addPage();
          this.drawSidebarBackground();
          y = this.getTopStartY();
        }

        const lines = this.doc.splitTextToSize(
          `• ${detail}`,
          this.mainContentWidth
        );
        lines.forEach((line: string) => {
          if (y > this.pageHeight - 30) {
            this.doc.addPage();
            this.drawSidebarBackground();
            y = this.getTopStartY();
          }

          if (this.isRTL) {
            const processedLine = this.processRTLText(line);
            this.doc.text(
              processedLine,
              this.mainContentX + this.mainContentWidth - 15,
              y,
              {
                align: "right",
              }
            );
          } else {
            this.doc.text(line, this.mainContentX, y);
          }
          y += 5;
        });
        y += 3;
      });

      y += 6;
    });

    return y;
  }

  private addProjectsSection(
    projects: ResumeData["projects"],
    y: number
  ): number {
    // Check if we need a page break
    if (y > this.pageHeight - 80) {
      this.doc.addPage();
      this.drawSidebarBackground();
      y = this.getTopStartY();
    }

    // Section title
    this.doc.setTextColor(...this.primaryColor);
    this.doc.setFontSize(16);

    if (this.isRTL) {
      this.doc.setFont("bona-nova", "bold");
      const processedTitle = this.processRTLText("Featured Projects");
      this.doc.text(
        processedTitle,
        this.mainContentX + this.mainContentWidth - 15,
        y,
        { align: "right" }
      );
    } else {
      this.doc.setFont("helvetica", "bold");
      this.doc.text("Featured Projects", this.mainContentX, y);
    }
    y += 8;

    projects.projects.forEach((project) => {
      // Check if we need a page break before adding project
      if (y > this.pageHeight - 60) {
        this.doc.addPage();
        this.drawSidebarBackground();
        y = this.getTopStartY();
      }

      // Project title
      this.doc.setTextColor(...this.primaryColor);
      this.doc.setFontSize(12);

      if (this.isRTL) {
        this.doc.setFont("bona-nova", "bold");
        const processedTitle = this.processRTLText(project.title);
        this.doc.text(
          processedTitle,
          this.mainContentX + this.mainContentWidth - 15,
          y,
          { align: "right" }
        );

        // Add clickable link if project has a link
        if (project.link) {
          const titleWidth = this.doc.getTextWidth(project.title);
          this.doc.setDrawColor(...this.primaryColor);
          this.doc.setLineWidth(0.3);
          this.doc.line(
            this.mainContentX + this.mainContentWidth - titleWidth,
            y + 1,
            this.mainContentX + this.mainContentWidth,
            y + 1
          );
          this.doc.link(
            this.mainContentX + this.mainContentWidth - titleWidth,
            y - 3,
            titleWidth,
            4,
            {
              url: project.link,
            }
          );
        }
      } else {
        this.doc.setFont("helvetica", "bold");
        this.doc.text(project.title, this.mainContentX, y);

        // Add clickable link if project has a link
        if (project.link) {
          const titleWidth = this.doc.getTextWidth(project.title);
          this.doc.setDrawColor(...this.primaryColor);
          this.doc.setLineWidth(0.3);
          this.doc.line(
            this.mainContentX,
            y + 1,
            this.mainContentX + titleWidth,
            y + 1
          );
          this.doc.link(this.mainContentX, y - 3, titleWidth, 4, {
            url: project.link,
          });
        }
      }

      y += 5;

      // Project description
      this.doc.setTextColor(...this.secondaryColor);
      this.doc.setFontSize(10);

      if (this.isRTL) {
        this.doc.setFont("bona-nova", "normal");
      } else {
        this.doc.setFont("helvetica", "normal");
      }

      const lines = this.doc.splitTextToSize(
        project.description,
        this.mainContentWidth
      );
      lines.forEach((line: string) => {
        if (y > this.pageHeight - 30) {
          this.doc.addPage();
          this.drawSidebarBackground();
          y = this.getTopStartY();
        }

        if (this.isRTL) {
          const processedLine = this.processRTLText(line);
          this.doc.text(
            processedLine,
            this.mainContentX + this.mainContentWidth - 15,
            y,
            {
              align: "right",
            }
          );
        } else {
          this.doc.text(line, this.mainContentX, y);
        }
        y += 4;
      });

      y += 6;
    });

    return y;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getPDF(): any {
    return this.doc;
  }

  save(filename: string): void {
    this.doc.save(filename);
  }
}

export const generateResumePDF = async (
  data: ResumeData,
  language: string = "en",
  template: ResumeTemplate = "clean"
): Promise<unknown> => {
  const generator = new PDFGenerator();
  await generator.generateResume(data, language, template);
  return generator.getPDF();
};

export const generateResumePreviewDataUrl = async (
  data: ResumeData,
  language: string = "en",
  template: ResumeTemplate = "clean"
): Promise<string> => {
  const generator = new PDFGenerator();
  await generator.generateResume(data, language, template);
  return generator.getPDF().output("datauristring");
};
