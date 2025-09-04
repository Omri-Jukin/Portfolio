import jsPDF from "jspdf";

export type ResumeData = {
  meta?: { title?: string; author?: string };
  person: {
    name: string;
    title: string;
    contacts: {
      phone: string;
      email: string;
      portfolio?: string;
      github?: string;
      linkedin?: string;
      location?: string;
    };
  };
  summary: string;
  tech: {
    frontend: string[];
    backend: string[];
    architecture: string[];
    databases: string[];
    cloudDevOps: string[];
    softSkills?: string[];
  };
  experience: Array<{
    role: string;
    company: string;
    location?: string;
    period: string;
    bullets: string[];
    stackLine?: string;
  }>;
  projects: Array<{
    name: string;
    line: string;
    url?: string;
  }>;
  additional?: string;
};

export type RenderOptions = {
  rtl?: boolean;
  theme?: "indigo" | "teal" | "rose" | "corporate" | "modern" | "minimal";
  maxBulletsPerRole?: number;
  maxProjects?: number;
};

const A4 = { w: 210, h: 297 }; // mm

const THEMES = {
  corporate: {
    headerBg: [41, 98, 255] as [number, number, number],
    headerAccent: [255, 193, 7] as [number, number, number],
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [41, 98, 255] as [number, number, number],
    rule: [41, 98, 255] as [number, number, number],
  },
  modern: {
    headerBg: [0, 150, 136] as [number, number, number],
    headerAccent: undefined,
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [0, 150, 136] as [number, number, number],
    rule: [0, 150, 136] as [number, number, number],
  },
  minimal: {
    headerBg: [96, 125, 139] as [number, number, number],
    headerAccent: undefined,
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [96, 125, 139] as [number, number, number],
    rule: [96, 125, 139] as [number, number, number],
  },
  teal: {
    headerBg: [0, 121, 107] as [number, number, number],
    headerAccent: undefined,
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [0, 121, 107] as [number, number, number],
    rule: [0, 121, 107] as [number, number, number],
  },
  indigo: {
    headerBg: [63, 81, 181] as [number, number, number],
    headerAccent: undefined,
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [63, 81, 181] as [number, number, number],
    rule: [63, 81, 181] as [number, number, number],
  },
  rose: {
    headerBg: [233, 30, 99] as [number, number, number],
    headerAccent: undefined,
    name: [255, 255, 255] as [number, number, number],
    title: [255, 255, 255] as [number, number, number],
    contacts: [255, 255, 255] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    accent: [233, 30, 99] as [number, number, number],
    rule: [233, 30, 99] as [number, number, number],
  },
};

export function renderResumePDF(
  data: ResumeData,
  opts: RenderOptions = {}
): jsPDF {
  const options = {
    rtl: opts.rtl || false,
    theme: opts.theme || "corporate",
    maxBulletsPerRole: opts.maxBulletsPerRole || 3,
    maxProjects: opts.maxProjects || 4,
  };

  const doc = new jsPDF({ unit: "mm", format: "a4" });

  if (data.meta?.title) {
    doc.setProperties({
      title: data.meta.title,
      author: data.meta?.author || "Resume",
    });
  }

  const theme = THEMES[options.theme];
  const margins = { x: 15, y: 10 };
  const pageWidth = A4.w - margins.x * 2;
  let currentY = margins.y;

  // Calculate header height based on content
  const headerHeight = 40; // Increased to properly cover name and title

  // Header background
  doc.setFillColor(...theme.headerBg);
  doc.rect(0, 0, A4.w, headerHeight, "F");

  if (theme.headerAccent) {
    doc.setFillColor(
      theme.headerAccent[0],
      theme.headerAccent[1],
      theme.headerAccent[2]
    );
    doc.rect(0, headerHeight, A4.w, 2, "F");
  }

  // Name
  doc.setTextColor(...theme.name);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(data.person.name, margins.x, 25);

  // Title
  doc.setTextColor(...theme.title);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.text(data.person.title, margins.x, 37);

  // Reset text color for contact info (black text for visibility)
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);

  // Phone and Email
  const contactLine1 = `Phone: ${data.person.contacts.phone} | Email: ${data.person.contacts.email}`;
  doc.text(contactLine1, margins.x, 45);

  // Portfolio
  if (data.person.contacts.portfolio) {
    doc.text(`Portfolio: ${data.person.contacts.portfolio}`, margins.x, 50);
  }

  // GitHub
  if (data.person.contacts.github) {
    doc.text(`GitHub: ${data.person.contacts.github}`, margins.x, 55);
  }

  // LinkedIn
  if (data.person.contacts.linkedin) {
    doc.text(`LinkedIn: ${data.person.contacts.linkedin}`, margins.x, 60);
  }

  // Reset text color for body
  doc.setTextColor(...theme.text);
  currentY = 65; // Start body content after contact info

  // Professional Summary
  addSection("Professional Summary", () => {
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(data.summary, pageWidth);
    summaryLines.forEach((line: string) => {
      doc.text(line, margins.x, currentY);
      currentY += 4;
    });
  });

  // Technical Skills
  addSection("Technical Skills", () => {
    doc.setFontSize(9);

    // Frontend
    if (data.tech.frontend.length > 0) {
      const frontendText = `Frontend: ${data.tech.frontend.join(", ")}`;
      const frontendLines = doc.splitTextToSize(frontendText, pageWidth);
      frontendLines.forEach((line: string) => {
        doc.text(line, margins.x, currentY);
        currentY += 3.5;
      });
    }

    // Backend
    if (data.tech.backend.length > 0) {
      const backendText = `Backend: ${data.tech.backend.join(", ")}`;
      const backendLines = doc.splitTextToSize(backendText, pageWidth);
      backendLines.forEach((line: string) => {
        doc.text(line, margins.x, currentY);
        currentY += 3.5;
      });
    }

    // Architecture
    if (data.tech.architecture.length > 0) {
      const archText = `Architecture: ${data.tech.architecture.join(", ")}`;
      const archLines = doc.splitTextToSize(archText, pageWidth);
      archLines.forEach((line: string) => {
        doc.text(line, margins.x, currentY);
        currentY += 3.5;
      });
    }

    // Databases
    if (data.tech.databases.length > 0) {
      const dbText = `Databases: ${data.tech.databases.join(", ")}`;
      const dbLines = doc.splitTextToSize(dbText, pageWidth);
      dbLines.forEach((line: string) => {
        doc.text(line, margins.x, currentY);
        currentY += 3.5;
      });
    }

    // Cloud & DevOps
    if (data.tech.cloudDevOps.length > 0) {
      const cloudText = `Cloud & DevOps: ${data.tech.cloudDevOps.join(", ")}`;
      const cloudLines = doc.splitTextToSize(cloudText, pageWidth);
      cloudLines.forEach((line: string) => {
        doc.text(line, margins.x, currentY);
        currentY += 3.5;
      });
    }
  });

  // Professional Experience
  addSection("Professional Experience", () => {
    data.experience.forEach((exp, index) => {
      if (index >= 3) return; // Limit to 3 experiences for space

      // Role and Company
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`${exp.role} - ${exp.company}`, margins.x, currentY);
      currentY += 4;

      // Period
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(exp.period, margins.x, currentY);
      currentY += 4;

      // Bullets (limited for space)
      const maxBullets = Math.min(
        exp.bullets.length,
        options.maxBulletsPerRole
      );
      for (let i = 0; i < maxBullets; i++) {
        const bullet = `• ${exp.bullets[i]}`;
        const bulletLines = doc.splitTextToSize(bullet, pageWidth - 5);
        bulletLines.forEach((line: string, lineIndex: number) => {
          const x = lineIndex === 0 ? margins.x : margins.x + 3;
          doc.text(line, x, currentY);
          currentY += 3.5;
        });
      }
      currentY += 2; // Extra space between experiences
    });
  });

  // Projects
  if (data.projects.length > 0) {
    addSection("Key Projects", () => {
      const maxProjects = Math.min(data.projects.length, options.maxProjects);
      for (let i = 0; i < maxProjects; i++) {
        const project = data.projects[i];

        // Project name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(`• ${project.name}`, margins.x, currentY);
        currentY += 3.5;

        // Project description
        doc.setFont("helvetica", "normal");
        const projLines = doc.splitTextToSize(project.line, pageWidth - 5);
        projLines.forEach((line: string) => {
          doc.text(line, margins.x + 3, currentY);
          currentY += 3.5;
        });
        currentY += 1;
      }
    });
  }

  // Additional Activities
  if (data.additional) {
    addSection("Additional Activities", () => {
      doc.setFontSize(9);
      const additionalLines = doc.splitTextToSize(data.additional!, pageWidth);
      additionalLines.forEach((line: string) => {
        doc.text(line, margins.x, currentY);
        currentY += 3.5;
      });
    });
  }

  function addSection(title: string, content: () => void) {
    // Section title
    currentY += 3;
    doc.setTextColor(...theme.accent);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(title, margins.x, currentY);
    currentY += 3;

    // Rule line
    doc.setDrawColor(...theme.rule);
    doc.setLineWidth(0.3);
    doc.line(margins.x, currentY, margins.x + pageWidth, currentY);
    currentY += 5;

    // Reset text color
    doc.setTextColor(...theme.text);

    // Content
    content();
  }

  return doc;
}
