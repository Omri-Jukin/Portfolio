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
    };
  };
  projects: {
    projects: Array<{
      title: string;
      description: string;
      link: string;
    }>;
  };
}

export class PDFGenerator {
  private doc: jsPDF;
  private currentY: number = 20;
  private pageWidth: number;
  private margin: number = 20;
  private lineHeight: number = 7;

  constructor() {
    this.doc = new jsPDF("p", "mm", "a4");
    this.pageWidth = this.doc.internal.pageSize.getWidth();
  }

  generateResume(data: ResumeData, language: string = "en"): void {
    this.currentY = 20;

    // Header
    this.addHeader(data.metadata);

    // Professional Summary
    this.addSection("Professional Summary", data.resume.experience);

    // Technical Skills
    this.addSkillsSection(data.skills);

    // Professional Experience
    this.addExperienceSection(data.career);

    // Projects
    this.addProjectsSection(data.projects);

    // Contact Information
    this.addContactInfo();

    // Language parameter is used for future localization features
    console.log(`Resume generated in ${language}`);
  }

  private addHeader(metadata: ResumeData["metadata"]): void {
    // Name
    this.doc.setFontSize(24);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(metadata.title, this.margin, this.currentY);
    this.currentY += 8;

    // Title
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(
      "Full Stack Developer | Electrical Engineer | Data Management Expert",
      this.margin,
      this.currentY
    );
    this.currentY += 12;

    // Contact Info
    this.doc.setFontSize(10);
    this.doc.text("Email: omrijukin@gmail.com", this.margin, this.currentY);
    this.currentY += 5;
    this.doc.text("Phone: +972 52-334-4064", this.margin, this.currentY);
    this.currentY += 5;
    this.doc.text(
      "LinkedIn: linkedin.com/in/omri-jukin",
      this.margin,
      this.currentY
    );
    this.currentY += 5;
    this.doc.text("GitHub: github.com/Omri-Jukin", this.margin, this.currentY);
    this.currentY += 5;
    this.doc.text("Portfolio: omrijukin.com", this.margin, this.currentY);
    this.currentY += 15;
  }

  private addSection(title: string, content: string): void {
    // Section Title
    this.doc.setFontSize(16);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 8;

    // Section Content
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");

    const lines = this.doc.splitTextToSize(
      content,
      this.pageWidth - 2 * this.margin
    );
    lines.forEach((line: string) => {
      if (this.currentY > 270) {
        this.doc.addPage();
        this.currentY = 20;
      }
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += 5;
    });

    this.currentY += 10;
  }

  private addSkillsSection(skills: ResumeData["skills"]): void {
    this.doc.setFontSize(16);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Technical Skills", this.margin, this.currentY);
    this.currentY += 8;

    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");

    skills.categories.technical.skills.forEach(
      (skill: ResumeData["skills"]["categories"]["technical"]["skills"][0]) => {
        // Skill name and level
        this.doc.setFont("helvetica", "bold");
        this.doc.text(
          `${skill.name} (${skill.level}%)`,
          this.margin,
          this.currentY
        );
        this.currentY += 5;

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
            this.currentY = 20;
          }
          this.doc.text(`  ${line}`, this.margin, this.currentY);
          this.currentY += 5;
        });
        this.currentY += 3;
      }
    );

    this.currentY += 5;
  }

  private addExperienceSection(career: ResumeData["career"]): void {
    this.doc.setFontSize(16);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Professional Experience", this.margin, this.currentY);
    this.currentY += 8;

    career.experiences.forEach(
      (experience: ResumeData["career"]["experiences"][0]) => {
        // Role and Company
        this.doc.setFontSize(12);
        this.doc.setFont("helvetica", "bold");
        this.doc.text(experience.role, this.margin, this.currentY);
        this.currentY += 5;

        this.doc.setFontSize(10);
        this.doc.setFont("helvetica", "normal");
        this.doc.text(
          `${experience.company} | ${experience.time}`,
          this.margin,
          this.currentY
        );
        this.currentY += 8;

        // Details
        experience.details.forEach((detail: string) => {
          if (this.currentY > 270) {
            this.doc.addPage();
            this.currentY = 20;
          }

          const lines = this.doc.splitTextToSize(
            `• ${detail}`,
            this.pageWidth - 2 * this.margin
          );
          lines.forEach((line: string) => {
            if (this.currentY > 270) {
              this.doc.addPage();
              this.currentY = 20;
            }
            this.doc.text(line, this.margin, this.currentY);
            this.currentY += 5;
          });
          this.currentY += 2;
        });

        this.currentY += 5;
      }
    );
  }

  private addProjectsSection(projects: ResumeData["projects"]): void {
    this.doc.setFontSize(16);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Featured Projects", this.margin, this.currentY);
    this.currentY += 8;

    projects.projects.forEach(
      (project: ResumeData["projects"]["projects"][0]) => {
        // Project Title
        this.doc.setFontSize(12);
        this.doc.setFont("helvetica", "bold");
        this.doc.text(project.title, this.margin, this.currentY);
        this.currentY += 5;

        // Project Description
        this.doc.setFontSize(10);
        this.doc.setFont("helvetica", "normal");
        const lines = this.doc.splitTextToSize(
          project.description,
          this.pageWidth - 2 * this.margin
        );
        lines.forEach((line: string) => {
          if (this.currentY > 270) {
            this.doc.addPage();
            this.currentY = 20;
          }
          this.doc.text(line, this.margin, this.currentY);
          this.currentY += 5;
        });

        this.currentY += 5;
      }
    );
  }

  private addContactInfo(): void {
    this.currentY += 10;
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(
      "Languages: English (Native), Spanish (Fluent), French (Intermediate), Hebrew (Native)",
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
