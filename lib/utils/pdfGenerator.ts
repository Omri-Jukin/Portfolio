import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  RTLTextProcessor,
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

export class PDFGenerator {
  private doc: jsPDF;
  private currentY: number = 25;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 8;
  private sidebarWidth: number = 65;
  private mainContentWidth: number;
  private lineHeight: number = 7;
  private primaryColor: [number, number, number] = [44, 62, 80]; // Dark blue-gray
  private secondaryColor: [number, number, number] = [52, 73, 94]; // Dark gray
  private accentColor: [number, number, number] = [127, 0, 63]; // Red accent
  private sidebarColor: [number, number, number] = [48, 81, 115]; // Dark blue sidebar
  private isRTL: boolean = false;
  private sidebarX: number = 0;
  private mainContentX: number = 0;

  constructor() {
    this.doc = new jsPDF("p", "mm", "a4");
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.mainContentWidth =
      this.pageWidth - this.sidebarWidth - 2 * this.margin;

    // Set document properties
    this.doc.setProperties({
      title: "Omri Jukin - Resume",
      subject: "Professional Resume",
      author: "Omri Jukin",
      creator: "Portfolio Website",
    });

    // Add Bona Nova SC font for Hebrew support
    this.doc.addFont(
      "/Bona_Nova_SC/BonaNovaSC-Regular.ttf",
      "bona-nova",
      "normal"
    );
    this.doc.addFont("/Bona_Nova_SC/BonaNovaSC-Bold.ttf", "bona-nova", "bold");
  }

  generateResume(data: ResumeData, language: string = "en"): void {
    // Set RTL for Hebrew
    this.isRTL = language === "he";

    // Calculate layout positions based on RTL - sidebar flush with edge
    if (this.isRTL) {
      this.sidebarX = 0; // Flush with left edge
      this.mainContentX = this.sidebarWidth + 30; // Match English spacing
    } else {
      this.sidebarX = this.pageWidth - this.sidebarWidth; // Flush with right edge
      this.mainContentX = this.margin;
    }

    this.currentY = 25;

    // Draw sidebar background
    this.drawSidebarBackground();

    // Add sidebar content
    this.addSidebarContent(data);

    // Add main content
    this.addMainContent(data);

    console.log(
      `Resume generated in ${language} (${this.isRTL ? "RTL" : "LTR"})`
    );
  }

  // Helper method to handle RTL text properly using the robust RTL processor
  private processRTLText(text: string): string {
    if (!this.isRTL) return text;
    return processRTLLine(text, this.isRTL);
  }

  private drawSidebarBackground(): void {
    // Draw sidebar background - flush with edge
    this.doc.setFillColor(...this.sidebarColor);
    this.doc.rect(this.sidebarX, 0, this.sidebarWidth, this.pageHeight, "F");
  }

  private addSidebarContent(data: ResumeData): void {
    let sidebarY = 35;

    // Contact Information
    sidebarY = this.addSidebarSection("Contact", sidebarY);
    sidebarY = this.addContactInfoSidebar(sidebarY);

    // Areas of Expertise
    sidebarY = this.addSidebarSection("Areas of Expertise", sidebarY);
    sidebarY = this.addSkillsSidebar(data.skills, sidebarY);

    // Languages
    sidebarY = this.addSidebarSection("Languages", sidebarY);
    sidebarY = this.addLanguagesSidebar(data.languages, sidebarY);

    // Certificates (placeholder for future implementation)
    sidebarY = this.addSidebarSection("Certificates", sidebarY);
    this.addCertificatesSidebar(sidebarY);
  }

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
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(8);

    if (this.isRTL) {
      this.doc.setFont("bona-nova", "normal");
    } else {
      this.doc.setFont("helvetica", "normal");
    }

    const certificates = [
      "FullStack Engineer",
      "C# Developer",
      "TypeScript Developer",
      "Python Developer",
      "Next.js Developer",
      "Node.js Developer",
      "React Developer",
      "Electrical Engineer",
    ];

    if (this.isRTL) {
      certificates.forEach((cert) => {
        this.doc.text(`• ${cert}`, this.sidebarX + this.sidebarWidth - 5, y, {
          align: "right",
        });
        y += 3;
      });
    } else {
      certificates.forEach((cert) => {
        this.doc.text(`• ${cert}`, this.sidebarX + 5, y);
        y += 3;
      });
    }

    return y + 8;
  }

  private addMainContent(data: ResumeData): void {
    let mainY = 35;

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

    // Title - check if it fits within the main content area
    this.doc.setTextColor(...this.accentColor);
    this.doc.setFontSize(14);

    if (this.isRTL) {
      this.doc.setFont("bona-nova", "normal");
    } else {
      this.doc.setFont("helvetica", "normal");
    }

    const titleText =
      "Software Engineer | Electrical Engineer | Data Management Expert";
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
      y = 35;
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
        y = 35;
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
      y = 35;
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
        y = 35;
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
          y = 35;
        }

        const lines = this.doc.splitTextToSize(
          `• ${detail}`,
          this.mainContentWidth
        );
        lines.forEach((line: string) => {
          if (y > this.pageHeight - 30) {
            this.doc.addPage();
            this.drawSidebarBackground();
            y = 35;
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
      y = 35;
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
        y = 35;
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
          y = 35;
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

  getPDF(): jsPDF {
    return this.doc;
  }

  save(filename: string): void {
    this.doc.save(filename);
  }
}

export const generateResumePDF = async (
  data: ResumeData,
  language: string = "en"
): Promise<jsPDF> => {
  const generator = new PDFGenerator();
  generator.generateResume(data, language);
  return generator.getPDF();
};
