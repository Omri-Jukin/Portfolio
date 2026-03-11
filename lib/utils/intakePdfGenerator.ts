import jsPDF from "jspdf";
import { safeString, containsHebrew, renderTextToPDF } from "./pdfTextRenderer";

export interface IntakeNote {
  id: string;
  note: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
}

export interface StatusHistoryEntry {
  id: string;
  oldStatus: string | null;
  newStatus: string;
  changedBy?: string | null;
  createdAt: string;
}

export interface CustomLinkInfo {
  id: string;
  slug: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  organizationName: string | null;
  organizationWebsite: string | null;
  hiddenSections: string[];
  expiresAt: string;
  createdAt: string;
}

export interface IntakePdfData {
  id: string;
  email: string;
  data: Record<string, unknown>;
  proposalMd: string;
  status: string;
  flagged: boolean;
  estimatedValue: number | null;
  riskLevel: string | null;
  createdAt: string;
  updatedAt: string;
  // Additional fields
  lastReviewedAt?: string | null;
  reminderDate?: string | null;
  customLink?: CustomLinkInfo | null;
  notes?: IntakeNote[];
  statusHistory?: StatusHistoryEntry[];
}

/**
 * Generates a PDF document from intake data with proper Hebrew and English support
 * Uses async rendering for Hebrew text when html2canvas is available
 * @param intakeData - The intake data to export
 * @returns Promise<jsPDF> document instance
 */
export async function generateIntakePDF(
  intakeData: IntakePdfData
): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // Page dimensions
  const pageWidth = 210;
  const pageHeight = 297;
  const margins = { left: 20, right: 20, top: 20, bottom: 20 };
  const contentWidth = pageWidth - margins.left - margins.right;
  let currentY = margins.top;

  // Helper function to add text with proper Hebrew/English support
  // For Hebrew, uses html2canvas if available; otherwise falls back to native rendering
  const addText = async (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize: number = 10,
    fontStyle: "normal" | "bold" | "italic" = "normal",
    color: string = "#000000",
    align: "left" | "center" | "right" = "left"
  ) => {
    const textStr = safeString(text);
    const hasHebrew = containsHebrew(textStr);

    // For Hebrew text, ALWAYS use html2canvas if available (browser context)
    // jsPDF's native rendering cannot handle RTL properly
    if (hasHebrew) {
      if (typeof window !== "undefined" && typeof document !== "undefined") {
        try {
          return await renderTextToPDF(
            doc,
            textStr,
            x,
            y,
            maxWidth,
            fontSize,
            fontStyle,
            color
          );
        } catch (error) {
          console.error("Failed to render Hebrew with html2canvas:", error);
          // Don't fall back to native for Hebrew - it will render incorrectly
          // Instead, show a warning in the PDF
          doc.setFontSize(fontSize);
          doc.setFont("helvetica", fontStyle);
          doc.setTextColor(255, 0, 0); // Red color for error
          doc.text(
            "[Hebrew text rendering failed - please check console]",
            x,
            y
          );
          return y + fontSize * 0.4 + 2;
        }
      } else {
        // Server-side rendering - can't use html2canvas
        // This shouldn't happen in browser context, but handle it gracefully
        console.warn(
          "Hebrew text detected but html2canvas not available (server-side?)"
        );
      }
    }

    // Native jsPDF rendering (only for pure English text)
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", fontStyle);
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(textStr, maxWidth);

    // Use proper alignment
    const options: { align?: "left" | "center" | "right" } = {};
    if (align !== "left") {
      options.align = align;
    }

    // Render text - jsPDF handles UTF-8 for English
    // Use tighter line spacing for smaller fonts (8pt and below)
    const lineSpacing = fontSize <= 8 ? 0.32 : 0.4;
    doc.text(lines, x, y, options);
    return y + lines.length * fontSize * lineSpacing + 2;
  };

  // Helper function to add section header
  const addSectionHeader = (title: string, y: number) => {
    doc.setFillColor(66, 133, 244);
    doc.rect(margins.left, y, contentWidth, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(title, margins.left + 2, y + 5.5);
    doc.setTextColor(0, 0, 0);
    return y + 10;
  };

  // Helper function to add key-value pair with proper formatting
  const addKeyValue = async (
    key: string,
    value: unknown,
    y: number,
    indent: number = 0
  ) => {
    const x = margins.left + indent;
    const keyText = `${key}:`;
    const valueText = safeString(value);

    // Add key in bold
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const keyY = await addText(
      keyText,
      x,
      y,
      contentWidth - indent,
      10,
      "bold"
    );

    // Add value in normal - preserve all text including Hebrew
    doc.setFont("helvetica", "normal");
    const valueY = await addText(
      valueText || "N/A",
      x + 5,
      keyY,
      contentWidth - indent - 5,
      10,
      "normal"
    );
    return valueY + 2; // Reduced spacing for better fit
  };

  // Helper function to add a list with proper formatting
  const addList = async (
    items: unknown[],
    y: number,
    label: string,
    indent: number = 0
  ) => {
    const x = margins.left + indent;
    let currentY = y;

    // Add label
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    currentY = await addText(
      `${label}:`,
      x,
      currentY,
      contentWidth - indent,
      10,
      "bold"
    );

    // Add items with numbering
    doc.setFont("helvetica", "normal");
    for (const [index, item] of items.entries()) {
      const itemText = safeString(item);
      currentY = await addText(
        `${index + 1}. ${itemText}`,
        x + 5,
        currentY,
        contentWidth - indent - 5,
        10,
        "normal"
      );
    }
    return currentY + 2; // Reduced spacing for better fit
  };

  // Helper function to check if we need a new page
  // Account for footer space (footer is at pageHeight - margins.bottom + 5, so we need space above it)
  const checkNewPage = (requiredSpace: number = 20) => {
    // Reserve space for footer (about 10mm)
    const footerSpace = 10;
    const availableSpace = pageHeight - margins.bottom - footerSpace;
    if (currentY + requiredSpace > availableSpace) {
      doc.addPage();
      currentY = margins.top;
      return true;
    }
    return false;
  };

  // Helper function to add page footer with page numbers
  const addPageFooter = (pageNum: number, totalPages: number) => {
    const footerY = pageHeight - margins.bottom + 8;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(128, 128, 128);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, footerY, {
      align: "center",
    });
    doc.text(`Intake ID: ${intakeData.id}`, margins.left, footerY, {
      align: "left",
    });
    doc.text(
      new Date().toLocaleDateString(),
      pageWidth - margins.right,
      footerY,
      { align: "right" }
    );
    doc.setTextColor(0, 0, 0);
  };

  // Track page numbers (will be updated after generation)

  // ============================================
  // DOCUMENT HEADER
  // ============================================
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Project Intake Form", pageWidth / 2, currentY, { align: "center" });
  currentY += 12;

  // Metadata section
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(128, 128, 128);
  currentY = await addText(
    `Intake ID: ${intakeData.id}`,
    margins.left,
    currentY,
    contentWidth,
    9
  );
  currentY = await addText(
    `Created: ${new Date(intakeData.createdAt).toLocaleString()}`,
    margins.left,
    currentY,
    contentWidth,
    9
  );
  currentY = await addText(
    `Updated: ${new Date(intakeData.updatedAt).toLocaleString()}`,
    margins.left,
    currentY,
    contentWidth,
    9
  );
  currentY += 3; // Reduced spacing
  doc.setTextColor(0, 0, 0);

  // Parse intake data early for Executive Summary
  const intakeFormData = intakeData.data as {
    contact?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      fullName?: string;
      [key: string]: unknown;
    };
    org?: {
      name?: string;
      website?: string;
      industry?: string;
      size?: string;
      [key: string]: unknown;
    };
    project?: {
      title?: string;
      description?: string;
      timeline?: string;
      budget?: string | Record<string, unknown>;
      startDate?: string;
      technologies?: string[];
      requirements?: string[];
      goals?: string[];
      resourceLinks?: Array<{ label: string; url: string }>;
      [key: string]: unknown;
    };
    additional?: {
      preferredContactMethod?: string;
      timezone?: string;
      urgency?: string;
      notes?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };

  // ============================================
  // EXECUTIVE SUMMARY
  // ============================================
  checkNewPage(30);
  currentY = addSectionHeader("Executive Summary", currentY);

  // Get client name
  const contact = intakeFormData.contact;
  const clientName =
    contact?.fullName ||
    (contact?.firstName && contact?.lastName
      ? `${contact.firstName} ${contact.lastName}`
      : contact?.firstName ||
        contact?.lastName ||
        intakeData.email.split("@")[0]);

  const project = intakeFormData.project;
  const org = intakeFormData.org;
  const additional = intakeFormData.additional;

  currentY = await addKeyValue("Client Name", clientName, currentY);
  if (org?.name) {
    currentY = await addKeyValue("Organization", org.name, currentY);
  }
  if (project?.title) {
    currentY = await addKeyValue("Project Title", project.title, currentY);
  }
  currentY = await addKeyValue("Status", intakeData.status, currentY);
  if (
    intakeData.estimatedValue !== null &&
    intakeData.estimatedValue !== undefined
  ) {
    currentY = await addKeyValue(
      "Estimated Value",
      `$${intakeData.estimatedValue.toLocaleString()}`,
      currentY
    );
  }
  if (intakeData.riskLevel) {
    currentY = await addKeyValue("Risk Level", intakeData.riskLevel, currentY);
  }
  if (additional?.urgency) {
    currentY = await addKeyValue("Urgency", additional.urgency, currentY);
  }
  if (intakeData.flagged) {
    currentY = await addKeyValue("Flagged", "Yes", currentY);
  }
  currentY += 3; // Reduced spacing

  // ============================================
  // STATUS & METADATA
  // ============================================
  checkNewPage(25);
  currentY = addSectionHeader("Status & Metadata", currentY);
  currentY = await addKeyValue("Status", intakeData.status, currentY);
  currentY = await addKeyValue(
    "Flagged",
    intakeData.flagged ? "Yes" : "No",
    currentY
  );
  if (
    intakeData.estimatedValue !== null &&
    intakeData.estimatedValue !== undefined
  ) {
    currentY = await addKeyValue(
      "Estimated Value",
      `$${intakeData.estimatedValue.toLocaleString()}`,
      currentY
    );
  }
  if (intakeData.riskLevel) {
    currentY = await addKeyValue("Risk Level", intakeData.riskLevel, currentY);
  }

  // Review Information
  if (intakeData.lastReviewedAt) {
    currentY = await addKeyValue(
      "Last Reviewed",
      new Date(intakeData.lastReviewedAt).toLocaleString(),
      currentY
    );
  }
  if (intakeData.reminderDate) {
    currentY = await addKeyValue(
      "Reminder Date",
      new Date(intakeData.reminderDate).toLocaleString(),
      currentY
    );
  }
  currentY += 3; // Reduced spacing

  // ============================================
  // CUSTOM LINK INFORMATION (if applicable)
  // ============================================
  if (intakeData.customLink) {
    checkNewPage(30);
    currentY = addSectionHeader("Custom Link Information", currentY);
    const link = intakeData.customLink;
    currentY = await addKeyValue("Link Slug", link.slug, currentY);
    currentY = await addKeyValue("Link Email", link.email, currentY);
    if (link.firstName || link.lastName) {
      const linkName = `${link.firstName || ""} ${link.lastName || ""}`.trim();
      if (linkName) {
        currentY = await addKeyValue("Link Contact Name", linkName, currentY);
      }
    }
    if (link.organizationName) {
      currentY = await addKeyValue(
        "Link Organization",
        link.organizationName,
        currentY
      );
    }
    if (link.organizationWebsite) {
      currentY = await addKeyValue(
        "Link Organization Website",
        link.organizationWebsite,
        currentY
      );
    }
    currentY = await addKeyValue(
      "Link Created",
      new Date(link.createdAt).toLocaleString(),
      currentY
    );
    currentY = await addKeyValue(
      "Link Expires",
      new Date(link.expiresAt).toLocaleString(),
      currentY
    );
    if (link.hiddenSections && link.hiddenSections.length > 0) {
      currentY = await addList(
        link.hiddenSections,
        currentY,
        "Hidden Sections",
        0
      );
    }
    currentY += 5;
  }

  // ============================================
  // CONTACT INFORMATION
  // ============================================
  if (intakeFormData.contact) {
    checkNewPage(25);
    currentY = addSectionHeader("Contact Information", currentY);
    const contact = intakeFormData.contact;

    // Standard fields
    if (contact.firstName) {
      currentY = await addKeyValue("First Name", contact.firstName, currentY);
    }
    if (contact.lastName) {
      currentY = await addKeyValue("Last Name", contact.lastName, currentY);
    }
    if (contact.fullName) {
      currentY = await addKeyValue("Full Name", contact.fullName, currentY);
    }
    currentY = await addKeyValue("Email", intakeData.email, currentY);
    if (contact.phone) {
      currentY = await addKeyValue("Phone", contact.phone, currentY);
    }

    // Include any additional contact fields
    for (const key of Object.keys(contact)) {
      if (
        !["firstName", "lastName", "fullName", "email", "phone"].includes(key)
      ) {
        const value = contact[key];
        if (value !== null && value !== undefined && value !== "") {
          currentY = await addKeyValue(
            key.charAt(0).toUpperCase() +
              key.slice(1).replace(/([A-Z])/g, " $1"),
            value,
            currentY
          );
        }
      }
    }

    currentY += 3;
  }

  // ============================================
  // ORGANIZATION INFORMATION
  // ============================================
  if (intakeFormData.org) {
    checkNewPage(25);
    currentY = addSectionHeader("Organization Information", currentY);
    const org = intakeFormData.org;

    // Standard fields
    if (org.name) {
      currentY = await addKeyValue("Organization Name", org.name, currentY);
    }
    if (org.website) {
      currentY = await addKeyValue("Website", org.website, currentY);
    }
    if (org.industry) {
      currentY = await addKeyValue("Industry", org.industry, currentY);
    }
    if (org.size) {
      currentY = await addKeyValue("Organization Size", org.size, currentY);
    }

    // Include any additional org fields
    for (const key of Object.keys(org)) {
      if (!["name", "website", "industry", "size"].includes(key)) {
        const value = org[key];
        if (value !== null && value !== undefined && value !== "") {
          currentY = await addKeyValue(
            key.charAt(0).toUpperCase() +
              key.slice(1).replace(/([A-Z])/g, " $1"),
            value,
            currentY
          );
        }
      }
    }

    currentY += 3;
  }

  // ============================================
  // PROJECT INFORMATION
  // ============================================
  if (intakeFormData.project) {
    checkNewPage(30);
    currentY = addSectionHeader("Project Information", currentY);
    const project = intakeFormData.project;

    // Project Title
    if (project.title) {
      currentY = await addKeyValue("Project Title", project.title, currentY);
    }

    // Description - preserve all text including Hebrew (smaller font for better fit)
    if (project.description) {
      checkNewPage(30);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      currentY = await addText(
        "Description:",
        margins.left,
        currentY,
        contentWidth,
        8,
        "bold"
      );
      doc.setFont("helvetica", "normal");
      // Use multi-line text rendering for description with Hebrew support
      const descText = safeString(project.description);
      if (containsHebrew(descText) && typeof window !== "undefined") {
        // For Hebrew, use async rendering
        currentY = await addText(
          descText,
          margins.left + 5,
          currentY,
          contentWidth - 5,
          8,
          "normal"
        );
      } else {
        // For English, use native rendering with smaller font
        doc.setFontSize(8);
        const descLines = doc.splitTextToSize(descText, contentWidth - 5);
        doc.text(descLines, margins.left + 5, currentY);
        currentY += descLines.length * 8 * 0.35; // Tighter line spacing
      }
      currentY += 3;
    }

    // Timeline
    if (project.timeline) {
      currentY = await addKeyValue("Timeline", project.timeline, currentY);
    }

    // Start Date
    if (project.startDate) {
      currentY = await addKeyValue("Start Date", project.startDate, currentY);
    }

    // Budget - handle both string and object
    if (project.budget) {
      let budgetText = "";
      if (typeof project.budget === "string") {
        budgetText = project.budget;
      } else if (typeof project.budget === "object") {
        const budgetObj = project.budget as Record<string, unknown>;
        if (budgetObj.currency && budgetObj.min && budgetObj.max) {
          budgetText = `${budgetObj.currency} ${budgetObj.min} - ${budgetObj.max}`;
        } else {
          budgetText = JSON.stringify(budgetObj, null, 2);
        }
      } else {
        budgetText = safeString(project.budget);
      }
      currentY = await addKeyValue("Budget", budgetText, currentY);
    }

    // Technologies
    if (project.technologies && project.technologies.length > 0) {
      checkNewPage(20);
      currentY = await addList(
        project.technologies,
        currentY,
        "Technologies",
        0
      );
    }

    // Requirements
    if (project.requirements && project.requirements.length > 0) {
      checkNewPage(25);
      currentY = await addList(
        project.requirements,
        currentY,
        "Requirements",
        0
      );
    }

    // Goals
    if (project.goals && project.goals.length > 0) {
      checkNewPage(25);
      currentY = await addList(project.goals, currentY, "Goals", 0);
    }

    // Resource Links
    if (project.resourceLinks && project.resourceLinks.length > 0) {
      checkNewPage(25);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      currentY = await addText(
        "Resource Links:",
        margins.left,
        currentY,
        contentWidth,
        10,
        "bold"
      );
      doc.setFont("helvetica", "normal");
      for (const link of project.resourceLinks) {
        const linkText = `${safeString(link.label)}: ${safeString(link.url)}`;
        currentY = await addText(
          linkText,
          margins.left + 5,
          currentY,
          contentWidth - 5,
          10,
          "normal"
        );
      }
      currentY += 3;
    }

    // Include any additional project fields
    for (const key of Object.keys(project)) {
      if (
        ![
          "title",
          "description",
          "timeline",
          "startDate",
          "budget",
          "technologies",
          "requirements",
          "goals",
          "resourceLinks",
        ].includes(key)
      ) {
        const value = project[key];
        if (value !== null && value !== undefined && value !== "") {
          checkNewPage(15);
          currentY = await addKeyValue(
            key.charAt(0).toUpperCase() +
              key.slice(1).replace(/([A-Z])/g, " $1"),
            value,
            currentY
          );
        }
      }
    }

    currentY += 3;
  }

  // ============================================
  // ADDITIONAL INFORMATION
  // ============================================
  if (intakeFormData.additional) {
    checkNewPage(25);
    currentY = addSectionHeader("Additional Information", currentY);
    const additional = intakeFormData.additional;

    // Standard fields
    if (additional.preferredContactMethod) {
      currentY = await addKeyValue(
        "Preferred Contact Method",
        additional.preferredContactMethod,
        currentY
      );
    }
    if (additional.timezone) {
      currentY = await addKeyValue("Timezone", additional.timezone, currentY);
    }
    if (additional.urgency) {
      currentY = await addKeyValue("Urgency", additional.urgency, currentY);
    }
    if (additional.notes) {
      checkNewPage(40);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      currentY = await addText(
        "Notes:",
        margins.left,
        currentY,
        contentWidth,
        10,
        "bold"
      );
      doc.setFont("helvetica", "normal");
      const notesText = safeString(additional.notes);
      if (containsHebrew(notesText) && typeof window !== "undefined") {
        currentY = await addText(
          notesText,
          margins.left + 5,
          currentY,
          contentWidth - 5,
          10,
          "normal"
        );
      } else {
        const notesLines = doc.splitTextToSize(notesText, contentWidth - 5);
        doc.text(notesLines, margins.left + 5, currentY);
        currentY += notesLines.length * 10 * 0.4;
      }
      currentY += 3;
    }

    // Include any additional fields
    for (const key of Object.keys(additional)) {
      if (
        !["preferredContactMethod", "timezone", "urgency", "notes"].includes(
          key
        )
      ) {
        const value = additional[key];
        if (value !== null && value !== undefined && value !== "") {
          currentY = await addKeyValue(
            key.charAt(0).toUpperCase() +
              key.slice(1).replace(/([A-Z])/g, " $1"),
            value,
            currentY
          );
        }
      }
    }

    currentY += 3;
  }

  // ============================================
  // ADDITIONAL TOP-LEVEL FIELDS
  // ============================================
  for (const key of Object.keys(intakeFormData)) {
    if (!["contact", "org", "project", "additional"].includes(key)) {
      const value = intakeFormData[key];
      if (value !== null && value !== undefined && value !== "") {
        checkNewPage(20);
        currentY = addSectionHeader(
          key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
          currentY
        );
        if (typeof value === "object" && !Array.isArray(value)) {
          for (const subKey of Object.keys(value as Record<string, unknown>)) {
            currentY = await addKeyValue(
              subKey.charAt(0).toUpperCase() +
                subKey.slice(1).replace(/([A-Z])/g, " $1"),
              (value as Record<string, unknown>)[subKey],
              currentY
            );
          }
        } else {
          currentY = await addKeyValue("Value", value, currentY);
        }
        currentY += 3;
      }
    }
  }

  // ============================================
  // ADMIN NOTES (if any)
  // ============================================
  if (intakeData.notes && intakeData.notes.length > 0) {
    checkNewPage(30);
    currentY = addSectionHeader("Admin Notes", currentY);

    for (const [index, note] of intakeData.notes.entries()) {
      checkNewPage(25);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      const noteHeader = `Note ${index + 1}${
        note.category ? ` (${note.category})` : ""
      }`;
      currentY = await addText(
        noteHeader,
        margins.left,
        currentY,
        contentWidth,
        9,
        "bold"
      );

      if (note.createdBy) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(128, 128, 128);
        currentY = await addText(
          `By: ${note.createdBy} | ${new Date(
            note.createdAt
          ).toLocaleString()}`,
          margins.left + 5,
          currentY,
          contentWidth - 5,
          8,
          "italic"
        );
        doc.setTextColor(0, 0, 0);
      } else {
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(128, 128, 128);
        currentY = await addText(
          new Date(note.createdAt).toLocaleString(),
          margins.left + 5,
          currentY,
          contentWidth - 5,
          8,
          "italic"
        );
        doc.setTextColor(0, 0, 0);
      }

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const noteText = safeString(note.note);
      if (containsHebrew(noteText) && typeof window !== "undefined") {
        currentY = await addText(
          noteText,
          margins.left + 5,
          currentY,
          contentWidth - 5,
          9,
          "normal"
        );
      } else {
        const noteLines = doc.splitTextToSize(noteText, contentWidth - 5);
        doc.text(noteLines, margins.left + 5, currentY);
        currentY += noteLines.length * 9 * 0.4;
      }
      currentY += 5;
    }
    currentY += 3;
  }

  // ============================================
  // STATUS HISTORY (if any)
  // ============================================
  if (intakeData.statusHistory && intakeData.statusHistory.length > 0) {
    checkNewPage(30);
    currentY = addSectionHeader("Status History", currentY);

    // Sort by date (oldest first)
    const sortedHistory = [...intakeData.statusHistory].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    for (const [index, entry] of sortedHistory.entries()) {
      checkNewPage(20);
      const statusChange = entry.oldStatus
        ? `${entry.oldStatus} → ${entry.newStatus}`
        : entry.newStatus;

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      currentY = await addText(
        `${index + 1}. ${statusChange}`,
        margins.left,
        currentY,
        contentWidth,
        9,
        "bold"
      );

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(128, 128, 128);
      const historyDetails = [
        new Date(entry.createdAt).toLocaleString(),
        entry.changedBy ? `Changed by: ${entry.changedBy}` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      currentY = await addText(
        historyDetails,
        margins.left + 5,
        currentY,
        contentWidth - 5,
        8,
        "normal"
      );
      doc.setTextColor(0, 0, 0);
      currentY += 3;
    }
    currentY += 3;
  }

  // ============================================
  // GENERATED PROPOSAL
  // ============================================
  if (intakeData.proposalMd) {
    checkNewPage(50);
    currentY = addSectionHeader("Generated Proposal", currentY);

    // Preserve the proposal markdown text as-is
    // Only remove markdown syntax that would break rendering, but keep the content
    let proposalText = safeString(intakeData.proposalMd);

    // Remove markdown formatting but preserve all text content
    proposalText = proposalText
      .replace(/#{1,6}\s+/g, "") // Remove header markers
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markers
      .replace(/\*(.*?)\*/g, "$1") // Remove italic markers
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Remove link markers, keep text
      .replace(/`([^`]+)`/g, "$1") // Remove inline code markers
      .replace(/```[\s\S]*?```/g, (match) => {
        // Remove code block markers but keep content
        return match.replace(/```[\w]*\n?/g, "").trim();
      })
      .trim();

    // Add proposal text with proper formatting - preserve Hebrew (smaller font for better fit)
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    if (containsHebrew(proposalText) && typeof window !== "undefined") {
      // For Hebrew, use async rendering
      currentY = await addText(
        proposalText,
        margins.left,
        currentY,
        contentWidth,
        8,
        "normal"
      );
    } else {
      // For English, use native rendering with smaller font
      const proposalLines = doc.splitTextToSize(proposalText, contentWidth);
      doc.text(proposalLines, margins.left, currentY);
      currentY += proposalLines.length * 8 * 0.35; // Tighter line spacing
    }
    currentY += 3;
  }

  // Add footer to all pages
  // Get total pages count from jsPDF internal API
  const totalPages =
    (
      doc as { internal?: { getNumberOfPages?: () => number } }
    ).internal?.getNumberOfPages?.() ||
    (doc as { pages?: { length: number } }).pages?.length ||
    1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addPageFooter(i, totalPages);
  }

  // Set document properties
  doc.setProperties({
    title: `Intake Form - ${intakeData.id}`,
    subject: "Intake Form Data Export",
    author: "Portfolio System",
    creator: "Intake PDF Generator",
  });

  return doc;
}
