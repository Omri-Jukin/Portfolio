import jsPDF from "jspdf";
import "jspdf-autotable";

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
  private margin: number = 25;
  private lineHeight: number = 6;
  private primaryColor: [number, number, number] = [44, 62, 80]; // Dark blue-gray
  private secondaryColor: [number, number, number] = [52, 73, 94]; // Dark gray
  private accentColor: [number, number, number] = [231, 76, 60]; // Red accent

  constructor() {
    this.doc = new jsPDF("p", "mm", "a4");
    this.pageWidth = this.doc.internal.pageSize.getWidth();

    // Set document properties
    this.doc.setProperties({
      title: "Omri Jukin - Resume",
      subject: "Professional Resume",
      author: "Omri Jukin",
      creator: "Portfolio Website",
    });
  }

  generateResume(data: ResumeData, language: string = "en"): void {
    this.currentY = 25;

    // Header with enhanced styling
    this.addHeader(data.metadata);

    // Professional Summary
    this.addSection("Professional Summary", data.resume.experience);

    // Technical Skills
    this.addSkillsSection(data.skills);

    // Professional Experience
    this.addExperienceSection(data.career);

    // Projects
    this.addProjectsSection(data.projects);

    // Languages
    this.addLanguagesSection(data.languages);

    // Additional Activities
    this.addSection("Additional Activities", data.additionalActivities);

    // Contact Information
    this.addContactInfo();

    // Language parameter is used for future localization features
    console.log(`Resume generated in ${language}`);
  }

  private addHeader(metadata: ResumeData["metadata"]): void {
    // Background color for header
    this.doc.setFillColor(...this.primaryColor);
    this.doc.rect(0, 0, this.pageWidth, 45, "F");

    // Name with white color
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(28);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(metadata.title, this.margin, this.currentY);
    this.currentY += 10;

    // Title with light color
    this.doc.setTextColor(240, 240, 240);
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(
      "Full Stack Developer | Electrical Engineer | Data Management Expert",
      this.margin,
      this.currentY
    );
    this.currentY += 15;

    // Reset text color for contact info
    this.doc.setTextColor(...this.secondaryColor);
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");

    // Contact info in two columns
    const leftColumn = this.margin;
    const rightColumn = this.pageWidth / 2 + 10;

    this.doc.text("Email: omrijukin@gmail.com", leftColumn, this.currentY);
    this.doc.text("Phone: +972 52-334-4064", rightColumn, this.currentY);
    this.currentY += 6;

    this.doc.text(
      "LinkedIn: linkedin.com/in/omri-jukin",
      leftColumn,
      this.currentY
    );
    this.doc.text("GitHub: github.com/Omri-Jukin", rightColumn, this.currentY);
    this.currentY += 6;

    this.doc.text("Website: omrijukin.com", leftColumn, this.currentY);
    this.doc.text("Location: Israel", rightColumn, this.currentY);
    this.currentY += 20;
  }

  private addSection(title: string, content: string): void {
    // Calculate how much space this section will need
    const titleHeight = 12; // Section title height
    const contentLines = this.doc.splitTextToSize(
      content,
      this.pageWidth - 2 * this.margin
    );
    const contentHeight = contentLines.length * 6 + 12; // Content height + padding
    const totalSectionHeight = titleHeight + contentHeight;

    // Check if we need a page break before adding section
    if (this.currentY + totalSectionHeight > 270) {
      this.doc.addPage();
      this.currentY = 25;
    }

    // Section Title with colored background
    this.doc.setFillColor(...this.primaryColor);
    this.doc.rect(
      this.margin - 5,
      this.currentY - 3,
      this.pageWidth - 2 * this.margin + 10,
      8,
      "F"
    );

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 12;

    // Section Content
    this.doc.setTextColor(...this.secondaryColor);
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");

    contentLines.forEach((line: string) => {
      if (this.currentY > 270) {
        this.doc.addPage();
        this.currentY = 25;
      }
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += 6;
    });

    this.currentY += 8; // Reduced spacing after section content
  }

  private addSkillsSection(skills: ResumeData["skills"]): void {
    // For skills section, we want to keep it on the same page as professional summary
    // Only break if absolutely necessary (very close to page end)
    if (this.currentY > 250) {
      this.doc.addPage();
      this.currentY = 25;
    }

    // Section Title with colored background
    this.doc.setFillColor(...this.primaryColor);
    this.doc.rect(
      this.margin - 5,
      this.currentY - 3,
      this.pageWidth - 2 * this.margin + 10,
      8,
      "F"
    );

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Technical Skills", this.margin, this.currentY);
    this.currentY += 12;

    this.doc.setTextColor(...this.secondaryColor);
    this.doc.setFontSize(10);

    skills.categories.technical.skills.forEach(
      (skill: ResumeData["skills"]["categories"]["technical"]["skills"][0]) => {
        // For skills, we want to keep them together on the same page
        // Only break if we're very close to the end
        if (this.currentY > 260) {
          this.doc.addPage();
          this.currentY = 25;
        }

        // Skill name and level
        this.doc.setFont("helvetica", "bold");
        this.doc.text(
          `${skill.name} (${skill.level}%)`,
          this.margin,
          this.currentY
        );
        this.currentY += 4;

        // Progress bar
        const barWidth = 60;
        const barHeight = 3;
        const progressWidth = (skill.level / 100) * barWidth;

        // Background bar
        this.doc.setFillColor(220, 220, 220);
        this.doc.rect(this.margin, this.currentY, barWidth, barHeight, "F");

        // Progress bar
        this.doc.setFillColor(...this.primaryColor);
        this.doc.rect(
          this.margin,
          this.currentY,
          progressWidth,
          barHeight,
          "F"
        );

        this.currentY += 6;

        // Technologies
        this.doc.setFont("helvetica", "normal");
        const techText = skill.technologies.join(", ");
        const lines = this.doc.splitTextToSize(
          techText,
          this.pageWidth - 2 * this.margin
        );
        lines.forEach((line: string) => {
          if (this.currentY > 270) {
            this.doc.addPage();
            this.currentY = 25;
          }
          this.doc.text(`  ${line}`, this.margin, this.currentY);
          this.currentY += 5;
        });
        this.currentY += 3; // Reduced spacing between skills
      }
    );

    this.currentY += 6; // Reduced final padding
  }

  private addExperienceSection(career: ResumeData["career"]): void {
    // Always start experience section on a new page for better organization
    this.doc.addPage();
    this.currentY = 25;

    // Section Title with colored background
    this.doc.setFillColor(...this.primaryColor);
    this.doc.rect(
      this.margin - 5,
      this.currentY - 3,
      this.pageWidth - 2 * this.margin + 10,
      8,
      "F"
    );

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Professional Experience", this.margin, this.currentY);
    this.currentY += 12;

    this.doc.setTextColor(...this.secondaryColor);

    career.experiences.forEach(
      (experience: ResumeData["career"]["experiences"][0]) => {
        // For experience, we want to keep each job together
        // Only break if we're very close to the end
        if (this.currentY > 260) {
          this.doc.addPage();
          this.currentY = 25;
        }

        // Role and Company
        this.doc.setFontSize(12);
        this.doc.setFont("helvetica", "bold");
        this.doc.setTextColor(...this.primaryColor);
        this.doc.text(experience.role, this.margin, this.currentY);
        this.currentY += 4; // Reduced spacing

        this.doc.setFontSize(10);
        this.doc.setFont("helvetica", "normal");
        this.doc.setTextColor(...this.accentColor);
        this.doc.text(
          `${experience.company} | ${experience.time}`,
          this.margin,
          this.currentY
        );
        this.currentY += 6; // Reduced spacing

        // Details
        this.doc.setTextColor(...this.secondaryColor);
        experience.details.forEach((detail: string) => {
          if (this.currentY > 270) {
            this.doc.addPage();
            this.currentY = 25;
          }

          const lines = this.doc.splitTextToSize(
            `• ${detail}`,
            this.pageWidth - 2 * this.margin
          );
          lines.forEach((line: string) => {
            if (this.currentY > 270) {
              this.doc.addPage();
              this.currentY = 25;
            }
            this.doc.text(line, this.margin, this.currentY);
            this.currentY += 5;
          });
          this.currentY += 1; // Reduced spacing between detail bullets
        });

        this.currentY += 4; // Reduced spacing between experiences
      }
    );
  }

  private addProjectsSection(projects: ResumeData["projects"]): void {
    // Calculate approximate space needed for projects section
    let estimatedHeight = 12; // Section title
    projects.projects.forEach((project) => {
      estimatedHeight += 5; // Project title
      const descLines = this.doc.splitTextToSize(
        project.description,
        this.pageWidth - 2 * this.margin
      );
      estimatedHeight += descLines.length * 5 + 8; // Description + padding
    });

    // Check if we need a page break before adding section
    if (this.currentY + estimatedHeight > 270) {
      this.doc.addPage();
      this.currentY = 25;
    }

    // Section Title with colored background
    this.doc.setFillColor(...this.primaryColor);
    this.doc.rect(
      this.margin - 5,
      this.currentY - 3,
      this.pageWidth - 2 * this.margin + 10,
      8,
      "F"
    );

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Featured Projects", this.margin, this.currentY);
    this.currentY += 12;

    this.doc.setTextColor(...this.secondaryColor);

    projects.projects.forEach(
      (project: ResumeData["projects"]["projects"][0]) => {
        // Calculate space needed for this project
        const descLines = this.doc.splitTextToSize(
          project.description,
          this.pageWidth - 2 * this.margin
        );
        const projectHeight = 5 + descLines.length * 5 + 8; // Title + description + padding

        // Check if we need a page break before adding project
        if (this.currentY + projectHeight > 270) {
          this.doc.addPage();
          this.currentY = 25;
        }

        // Project Title
        this.doc.setFontSize(12);
        this.doc.setFont("helvetica", "bold");
        this.doc.setTextColor(...this.primaryColor);
        this.doc.text(project.title, this.margin, this.currentY);
        this.currentY += 5;

        // Project Description
        this.doc.setFontSize(10);
        this.doc.setFont("helvetica", "normal");
        this.doc.setTextColor(...this.secondaryColor);
        const lines = this.doc.splitTextToSize(
          project.description,
          this.pageWidth - 2 * this.margin
        );
        lines.forEach((line: string) => {
          if (this.currentY > 270) {
            this.doc.addPage();
            this.currentY = 25;
          }
          this.doc.text(line, this.margin, this.currentY);
          this.currentY += 5;
        });

        this.currentY += 8;
      }
    );
  }

  private addLanguagesSection(languages: ResumeData["languages"]): void {
    // Calculate approximate space needed for languages section
    const progLanguages = languages.programming
      .map((lang) => `${lang.name} (${lang.level})`)
      .join(", ");
    const progLines = this.doc.splitTextToSize(
      progLanguages,
      this.pageWidth - 2 * this.margin
    );

    const spokenLanguages = languages.spoken
      .map((lang) => `${lang.name} (${lang.level})`)
      .join(", ");
    const spokenLines = this.doc.splitTextToSize(
      spokenLanguages,
      this.pageWidth - 2 * this.margin
    );

    const estimatedHeight =
      12 + // Section title
      5 + // Programming Languages subtitle
      progLines.length * 5 + // Programming languages
      6 + // Spacing
      5 + // Spoken Languages subtitle
      spokenLines.length * 5 + // Spoken languages
      12; // Final padding

    // Check if we need a page break before adding section
    if (this.currentY + estimatedHeight > 270) {
      this.doc.addPage();
      this.currentY = 25;
    }

    // Section Title with colored background
    this.doc.setFillColor(...this.primaryColor);
    this.doc.rect(
      this.margin - 5,
      this.currentY - 3,
      this.pageWidth - 2 * this.margin + 10,
      8,
      "F"
    );

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Languages", this.margin, this.currentY);
    this.currentY += 12;

    this.doc.setTextColor(...this.secondaryColor);
    this.doc.setFontSize(10);

    // Programming Languages
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(...this.primaryColor);
    this.doc.text("Programming Languages:", this.margin, this.currentY);
    this.currentY += 5;

    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(...this.secondaryColor);
    progLines.forEach((line: string) => {
      if (this.currentY > 270) {
        this.doc.addPage();
        this.currentY = 25;
      }
      this.doc.text(`  ${line}`, this.margin, this.currentY);
      this.currentY += 5;
    });

    this.currentY += 6;

    // Spoken Languages
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(...this.primaryColor);
    this.doc.text("Spoken Languages:", this.margin, this.currentY);
    this.currentY += 5;

    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(...this.secondaryColor);
    spokenLines.forEach((line: string) => {
      if (this.currentY > 270) {
        this.doc.addPage();
        this.currentY = 25;
      }
      this.doc.text(`  ${line}`, this.margin, this.currentY);
      this.currentY += 5;
    });

    this.currentY += 12;
  }

  private addContactInfo(): void {
    this.currentY += 15;

    // Footer line
    this.doc.setDrawColor(...this.primaryColor);
    this.doc.setLineWidth(0.5);
    this.doc.line(
      this.margin,
      this.currentY,
      this.pageWidth - this.margin,
      this.currentY
    );
    this.currentY += 8;

    // Footer text
    this.doc.setTextColor(...this.secondaryColor);
    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(
      "Generated from omrijukin.com - Professional Portfolio",
      this.margin,
      this.currentY
    );
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
