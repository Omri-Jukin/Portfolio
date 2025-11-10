import type { RouterOutputs } from "$/trpc/client";
import { formatMoney } from "$/pricing/calcProposalTotals";

type ProposalData = RouterOutputs["proposals"]["getById"];
type ProposalLineItem = ProposalData extends { lineItems: Array<infer T> }
  ? T
  : never;
type ProposalSection = ProposalData extends { sections: Array<infer S> }
  ? S
  : never;

export interface ProposalEmailOptions {
  shareToken?: string;
  includeInternalNotes?: boolean;
}

export function renderProposalEmailHTML(
  proposalData: ProposalData,
  options: ProposalEmailOptions = {}
): string {
  const { proposal, sections, lineItems, discounts, taxes } = proposalData;
  const shareUrl = options.shareToken
    ? `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/p/${
        options.shareToken
      }`
    : null;

  // Calculate totals (simplified)
  let subtotal = 0;
  for (const item of lineItems.filter(
    (i: ProposalLineItem) => !i.isOptional || i.isSelected
  )) {
    subtotal += Number(item.quantity) * item.unitPriceMinor;
  }

  let discountTotal = 0;
  for (const discount of discounts) {
    if (discount.type === "percent" && discount.percent) {
      discountTotal += Math.round((subtotal * Number(discount.percent)) / 100);
    } else if (discount.type === "fixed" && discount.amountMinor) {
      discountTotal += discount.amountMinor;
    }
  }

  const preTaxTotal = subtotal - discountTotal;

  let taxTotal = 0;
  for (const tax of taxes) {
    if (tax.type === "percent") {
      taxTotal += Math.round((preTaxTotal * Number(tax.rateOrAmount)) / 100);
    } else {
      taxTotal += Math.round(Number(tax.rateOrAmount) * 100);
    }
  }

  const grandTotal = preTaxTotal + taxTotal;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proposal - ${proposal.clientName}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">Proposal</h1>
    <p style="color: white; margin: 10px 0 0 0;">${proposal.clientName}${
    proposal.clientCompany ? ` - ${proposal.clientCompany}` : ""
  }</p>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <div style="background: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
      <h2 style="margin-top: 0; color: #667eea;">Proposal Details</h2>
      <p><strong>Client:</strong> ${proposal.clientName}</p>
      <p><strong>Email:</strong> ${proposal.clientEmail}</p>
      ${
        proposal.clientCompany
          ? `<p><strong>Company:</strong> ${proposal.clientCompany}</p>`
          : ""
      }
      ${
        proposal.validUntil
          ? `<p><strong>Valid Until:</strong> ${new Date(
              proposal.validUntil
            ).toLocaleDateString()}</p>`
          : ""
      }
      <p><strong>Status:</strong> ${proposal.status}</p>
    </div>

    ${sections
      .map((section: ProposalSection) => {
        const sectionItems = lineItems.filter(
          (item: ProposalLineItem) =>
            item.sectionId === section.id &&
            (!item.isOptional || item.isSelected)
        );

        if (sectionItems.length === 0) return "";

        return `
        <div style="background: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #667eea;">${section.label}</h3>
          ${
            section.description
              ? `<p style="color: #666;">${section.description}</p>`
              : ""
          }
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Qty</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Unit Price</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${sectionItems
                .map((item: ProposalLineItem) => {
                  const quantity = Number(item.quantity);
                  return `
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">
                      ${item.label}
                      ${
                        item.description
                          ? `<br><small style="color: #666;">${item.description}</small>`
                          : ""
                      }
                    </td>
                    <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">${quantity}</td>
                    <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">${formatMoney(
                      item.unitPriceMinor,
                      proposal.currency
                    )}</td>
                    <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee; font-weight: bold;">${formatMoney(
                      quantity * item.unitPriceMinor,
                      proposal.currency
                    )}</td>
                  </tr>
                `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      `;
      })
      .join("")}

    <div style="background: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
      <h3 style="margin-top: 0; color: #667eea;">Summary</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px;">Subtotal:</td>
          <td style="padding: 8px; text-align: right; font-weight: bold;">${formatMoney(
            subtotal,
            proposal.currency
          )}</td>
        </tr>
        ${
          discounts.length > 0
            ? `
          <tr>
            <td style="padding: 8px; color: #666;">Discounts:</td>
            <td style="padding: 8px; text-align: right; color: #d32f2f;">
              -${formatMoney(discountTotal, proposal.currency)}
            </td>
          </tr>
        `
            : ""
        }
        <tr>
          <td style="padding: 8px;">Pre-tax Total:</td>
          <td style="padding: 8px; text-align: right; font-weight: bold;">${formatMoney(
            preTaxTotal,
            proposal.currency
          )}</td>
        </tr>
        ${
          taxes.length > 0
            ? `
          <tr>
            <td style="padding: 8px; color: #666;">Taxes:</td>
            <td style="padding: 8px; text-align: right; color: #666;">
              ${formatMoney(taxTotal, proposal.currency)}
            </td>
          </tr>
        `
            : ""
        }
        <tr style="border-top: 2px solid #667eea;">
          <td style="padding: 12px; font-size: 18px; font-weight: bold;">Grand Total:</td>
          <td style="padding: 12px; text-align: right; font-size: 18px; font-weight: bold; color: #667eea;">
            ${formatMoney(grandTotal, proposal.currency)}
          </td>
        </tr>
      </table>
    </div>

    ${
      proposal.notesClient
        ? `
      <div style="background: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #667eea;">Notes</h3>
        <p style="white-space: pre-wrap;">${proposal.notesClient}</p>
      </div>
    `
        : ""
    }

    ${
      shareUrl
        ? `
      <div style="background: #e3f2fd; padding: 20px; border-radius: 5px; text-align: center; margin-bottom: 20px;">
        <p style="margin: 0 0 15px 0;">You can view and respond to this proposal online:</p>
        <a href="${shareUrl}" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          View Proposal Online
        </a>
      </div>
    `
        : ""
    }

    <div style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
      <p>This is an automated email. Please do not reply directly to this message.</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function renderProposalEmailText(
  proposalData: ProposalData,
  options: ProposalEmailOptions = {}
): string {
  const { proposal, sections, lineItems } = proposalData;
  const shareUrl = options.shareToken
    ? `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/p/${
        options.shareToken
      }`
    : null;

  let text = `PROPOSAL\n\n`;
  text += `For: ${proposal.clientName}\n`;
  if (proposal.clientCompany) text += `Company: ${proposal.clientCompany}\n`;
  text += `Email: ${proposal.clientEmail}\n`;
  if (proposal.validUntil) {
    text += `Valid Until: ${new Date(
      proposal.validUntil
    ).toLocaleDateString()}\n`;
  }
  text += `\n`;

  for (const section of sections) {
    const sectionItems = lineItems.filter(
      (item: ProposalLineItem) =>
        item.sectionId === section.id && (!item.isOptional || item.isSelected)
    );

    if (sectionItems.length > 0) {
      text += `${section.label}\n`;
      if (section.description) text += `${section.description}\n`;
      text += `\n`;

      for (const item of sectionItems) {
        const quantity = Number(item.quantity);
        text += `  ${item.label} (${quantity} × ${formatMoney(
          item.unitPriceMinor,
          proposal.currency
        )}) = ${formatMoney(
          quantity * item.unitPriceMinor,
          proposal.currency
        )}\n`;
      }
      text += `\n`;
    }
  }

  if (shareUrl) {
    text += `\nView proposal online: ${shareUrl}\n`;
  }

  return text;
}
