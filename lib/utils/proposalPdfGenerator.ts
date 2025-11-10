import jsPDF from "jspdf";
import { formatMoney } from "$/pricing/calcProposalTotals";
import type { RouterOutputs } from "$/trpc/client";

type ProposalData =
  | RouterOutputs["proposals"]["getById"]
  | {
      proposal: RouterOutputs["proposals"]["getById"]["proposal"];
      sections: RouterOutputs["proposals"]["getById"]["sections"];
      lineItems: RouterOutputs["proposals"]["getById"]["lineItems"];
      discounts: RouterOutputs["proposals"]["getById"]["discounts"];
      taxes: RouterOutputs["proposals"]["getById"]["taxes"];
      events?: RouterOutputs["proposals"]["getById"]["events"];
    };
type ProposalLineItem = RouterOutputs["proposals"]["getById"]["lineItems"][0];
type ProposalSection = RouterOutputs["proposals"]["getById"]["sections"][0];
type ProposalDiscount = RouterOutputs["proposals"]["getById"]["discounts"][0];
type ProposalTax = RouterOutputs["proposals"]["getById"]["taxes"][0];

export interface ProposalPDFOptions {
  includeInternalNotes?: boolean;
  includeClientNotes?: boolean;
  theme?: "light" | "dark";
}

export function generateProposalPDF(
  proposalData: ProposalData,
  options: ProposalPDFOptions = {}
): jsPDF {
  const opts = {
    includeInternalNotes: options.includeInternalNotes ?? false,
    includeClientNotes: options.includeClientNotes ?? true,
    theme: options.theme || "light",
  };

  const { proposal, sections, lineItems, discounts, taxes } = proposalData;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = 210;
  const pageHeight = 297;
  const margins = { left: 20, right: 20, top: 20, bottom: 20 };
  const contentWidth = pageWidth - margins.left - margins.right;
  let currentY = margins.top;

  // Colors
  const colors = {
    primary: opts.theme === "dark" ? "#667eea" : "#1976d2",
    text: opts.theme === "dark" ? "#ffffff" : "#000000",
    secondary: opts.theme === "dark" ? "#999999" : "#666666",
    border: opts.theme === "dark" ? "#444444" : "#e0e0e0",
    background: opts.theme === "dark" ? "#1a1a1a" : "#ffffff",
  };

  // Helper: Check if new page needed
  const checkNewPage = (requiredSpace: number = 20) => {
    return currentY + requiredSpace > pageHeight - margins.bottom;
  };

  // Helper: Add new page
  const addNewPage = () => {
    doc.addPage();
    currentY = margins.top;
  };

  // Helper: Add text with word wrap
  const addText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize: number = 10,
    fontStyle: "normal" | "bold" | "italic" = "normal",
    color: string = colors.text
  ) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", fontStyle);
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * fontSize * 0.4;
  };

  // Header
  doc.setFillColor(colors.primary);
  doc.rect(0, 0, pageWidth, 40, "F");
  addText("PROPOSAL", margins.left, 25, contentWidth, 24, "bold", "#ffffff");
  currentY = 50;

  // Proposal Info
  addText(
    `For: ${proposal.clientName}`,
    margins.left,
    currentY,
    contentWidth,
    14,
    "bold"
  );
  currentY += 7;

  if (proposal.clientCompany) {
    addText(proposal.clientCompany, margins.left, currentY, contentWidth, 12);
    currentY += 6;
  }

  addText(proposal.clientEmail, margins.left, currentY, contentWidth, 10);
  currentY += 8;

  if (proposal.validUntil) {
    addText(
      `Valid until: ${new Date(proposal.validUntil).toLocaleDateString()}`,
      margins.left,
      currentY,
      contentWidth,
      10,
      "normal",
      colors.secondary
    );
    currentY += 6;
  }

  currentY += 5;

  // Sections and Line Items
  for (const section of sections as ProposalSection[]) {
    if (checkNewPage(30)) addNewPage();

    // Section Header
    addText(section.label, margins.left, currentY, contentWidth, 14, "bold");
    currentY += 8;

    if (section.description) {
      addText(
        section.description,
        margins.left,
        currentY,
        contentWidth,
        10,
        "normal",
        colors.secondary
      );
      currentY += 6;
    }

    // Line Items in this section
    const sectionItems = lineItems.filter(
      (item: ProposalLineItem) =>
        item.sectionId === section.id && (!item.isOptional || item.isSelected)
    );

    if (sectionItems.length > 0) {
      // Table header
      const colWidths = {
        label: contentWidth * 0.5,
        qty: contentWidth * 0.15,
        price: contentWidth * 0.15,
        total: contentWidth * 0.2,
      };
      let colX = margins.left;

      addText("Item", colX, currentY, colWidths.label, 10, "bold");
      colX += colWidths.label;
      addText("Qty", colX, currentY, colWidths.qty, 10, "bold");
      colX += colWidths.qty;
      addText("Unit Price", colX, currentY, colWidths.price, 10, "bold");
      colX += colWidths.price;
      addText("Total", colX, currentY, colWidths.total, 10, "bold");
      currentY += 6;

      // Table rows
      for (const item of sectionItems) {
        if (checkNewPage(15)) addNewPage();

        colX = margins.left;
        const quantity = Number(item.quantity);
        const unitPrice = item.unitPriceMinor / 100;
        const total = quantity * unitPrice; // unitPrice is already in major units

        addText(item.label, colX, currentY, colWidths.label, 10);
        colX += colWidths.label;
        addText(quantity.toString(), colX, currentY, colWidths.qty, 10);
        colX += colWidths.qty;
        addText(
          formatMoney(item.unitPriceMinor, proposal.currency),
          colX,
          currentY,
          colWidths.price,
          10
        );
        colX += colWidths.price;
        addText(
          formatMoney(Math.round(total * 100), proposal.currency),
          colX,
          currentY,
          colWidths.total,
          10,
          "bold"
        );
        currentY += 6;

        if (item.description) {
          addText(
            item.description,
            margins.left + 5,
            currentY,
            colWidths.label - 5,
            9,
            "normal",
            colors.secondary
          );
          currentY += 5;
        }
      }
    }

    currentY += 5;
  }

  // Unsectioned items
  const unsectionedItems = lineItems.filter(
    (item: ProposalLineItem) =>
      !item.sectionId && (!item.isOptional || item.isSelected)
  );

  if (unsectionedItems.length > 0) {
    if (checkNewPage(30)) addNewPage();

    addText(
      "Additional Items",
      margins.left,
      currentY,
      contentWidth,
      14,
      "bold"
    );
    currentY += 8;

    for (const item of unsectionedItems) {
      if (checkNewPage(15)) addNewPage();

      const quantity = Number(item.quantity);
      const unitPrice = item.unitPriceMinor / 100;
      const total = quantity * unitPrice;

      addText(
        `${item.label} (${quantity} × ${formatMoney(
          item.unitPriceMinor,
          proposal.currency
        )})`,
        margins.left,
        currentY,
        contentWidth * 0.7,
        10
      );
      addText(
        formatMoney(Math.round(total * 100), proposal.currency),
        margins.left + contentWidth * 0.7,
        currentY,
        contentWidth * 0.3,
        10,
        "bold"
      );
      currentY += 6;
    }

    currentY += 5;
  }

  // Totals Section
  if (checkNewPage(50)) addNewPage();

  // Calculate totals (simplified - would use actual calculation)
  let subtotal = 0;
  for (const item of lineItems.filter(
    (i: ProposalLineItem) => !i.isOptional || i.isSelected
  )) {
    subtotal += Number(item.quantity) * item.unitPriceMinor;
  }

  // Apply discounts
  let discountTotal = 0;
  for (const discount of discounts as ProposalDiscount[]) {
    if (discount.type === "percent" && discount.percent) {
      discountTotal += Math.round((subtotal * Number(discount.percent)) / 100);
    } else if (discount.type === "fixed" && discount.amountMinor) {
      discountTotal += discount.amountMinor;
    }
  }

  const preTaxTotal = subtotal - discountTotal;

  // Apply taxes
  let taxTotal = 0;
  for (const tax of taxes as ProposalTax[]) {
    if (tax.type === "percent") {
      taxTotal += Math.round((preTaxTotal * Number(tax.rateOrAmount)) / 100);
    } else {
      taxTotal += Math.round(Number(tax.rateOrAmount) * 100);
    }
  }

  const grandTotal = preTaxTotal + taxTotal;

  // Draw totals box
  const totalsY = currentY;
  doc.setDrawColor(colors.border);
  doc.setLineWidth(0.5);
  doc.rect(margins.left, totalsY - 5, contentWidth, 60);

  addText("Subtotal:", margins.left + 5, totalsY + 5, contentWidth * 0.6, 10);
  addText(
    formatMoney(subtotal, proposal.currency),
    margins.left + contentWidth * 0.6,
    totalsY + 5,
    contentWidth * 0.4,
    10,
    "bold"
  );
  currentY = totalsY + 10;

  if (discounts.length > 0) {
    addText(
      "Discounts:",
      margins.left + 5,
      currentY,
      contentWidth * 0.6,
      9,
      "normal",
      colors.secondary
    );
    currentY += 5;

    for (const discount of discounts as ProposalDiscount[]) {
      const discountAmount =
        discount.type === "percent" && discount.percent
          ? Math.round((subtotal * Number(discount.percent)) / 100)
          : discount.amountMinor || 0;

      addText(
        `  ${discount.label}:`,
        margins.left + 10,
        currentY,
        contentWidth * 0.5,
        9,
        "normal",
        colors.secondary
      );
      addText(
        `-${formatMoney(discountAmount, proposal.currency)}`,
        margins.left + contentWidth * 0.5,
        currentY,
        contentWidth * 0.5,
        9,
        "normal",
        colors.secondary
      );
      currentY += 4;
    }
    currentY += 2;
  }

  addText("Pre-tax Total:", margins.left + 5, currentY, contentWidth * 0.6, 10);
  addText(
    formatMoney(preTaxTotal, proposal.currency),
    margins.left + contentWidth * 0.6,
    currentY,
    contentWidth * 0.4,
    10,
    "bold"
  );
  currentY += 6;

  if (taxes.length > 0) {
    addText(
      "Taxes:",
      margins.left + 5,
      currentY,
      contentWidth * 0.6,
      9,
      "normal",
      colors.secondary
    );
    currentY += 5;

    for (const tax of taxes as ProposalTax[]) {
      const taxAmount =
        tax.type === "percent"
          ? Math.round((preTaxTotal * Number(tax.rateOrAmount)) / 100)
          : Math.round(Number(tax.rateOrAmount) * 100);

      addText(
        `  ${tax.label}:`,
        margins.left + 10,
        currentY,
        contentWidth * 0.5,
        9,
        "normal",
        colors.secondary
      );
      addText(
        formatMoney(taxAmount, proposal.currency),
        margins.left + contentWidth * 0.5,
        currentY,
        contentWidth * 0.5,
        9,
        "normal",
        colors.secondary
      );
      currentY += 4;
    }
    currentY += 2;
  }

  // Grand Total
  doc.setLineWidth(1);
  doc.setDrawColor(colors.primary);
  doc.line(
    margins.left + 5,
    currentY,
    margins.left + contentWidth - 5,
    currentY
  );
  currentY += 5;

  addText(
    "Grand Total:",
    margins.left + 5,
    currentY,
    contentWidth * 0.6,
    14,
    "bold"
  );
  addText(
    formatMoney(grandTotal, proposal.currency),
    margins.left + contentWidth * 0.6,
    currentY,
    contentWidth * 0.4,
    14,
    "bold"
  );

  currentY += 15;

  // Client Notes
  if (opts.includeClientNotes && proposal.notesClient) {
    if (checkNewPage(30)) addNewPage();

    addText("Notes:", margins.left, currentY, contentWidth, 12, "bold");
    currentY += 6;
    currentY = addText(
      proposal.notesClient,
      margins.left,
      currentY,
      contentWidth,
      10
    );
    currentY += 5;
  }

  // Set document properties
  doc.setProperties({
    title: `Proposal - ${proposal.clientName}`,
    author: "Portfolio",
    subject: "Proposal",
  });

  return doc;
}
