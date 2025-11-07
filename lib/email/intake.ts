import type { IntakeFormData } from "#/lib/schemas";
import { INTAKE_FORM_CURRENCY_MAPPING } from "#/lib/constants";

/**
 * Format budget object into human-readable string
 */
function formatBudget(
  budget:
    | {
        currency?: string;
        min?: string;
        max?: string;
      }
    | string
    | undefined
): string {
  if (!budget) return "Not specified";

  if (typeof budget === "string") {
    return budget;
  }

  const currency = budget.currency || "ILS";
  const currencyInfo = INTAKE_FORM_CURRENCY_MAPPING[currency];
  const symbol = currencyInfo?.symbol || "₪";
  const code = currencyInfo?.code || currency;

  const min = budget.min ? parseFloat(budget.min) : 0;
  const max = budget.max ? parseFloat(budget.max) : 0;

  if (min === 0 && max === 0) {
    return "Budget not specified";
  }

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("he-IL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  if (min > 0 && max > 0 && min !== max) {
    return `${symbol}${formatNumber(min)} - ${symbol}${formatNumber(
      max
    )} ${code}`;
  } else if (min > 0 && max > 0 && min === max) {
    return `${symbol}${formatNumber(min)} ${code}`;
  } else if (min > 0) {
    return `${symbol}${formatNumber(min)}+ ${code}`;
  } else if (max > 0) {
    return `Up to ${symbol}${formatNumber(max)} ${code}`;
  }

  return "Budget not specified";
}

/**
 * Render HTML email template for client receipt
 * Includes full form summary and proposal
 */
export function renderClientReceiptHTML(
  intake: IntakeFormData,
  proposalMarkdown: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Intake Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">Thank You!</h1>
    <p style="color: white; margin: 10px 0 0 0;">We've received your project intake</p>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333; margin-top: 0;">Project Details</h2>
    
    <div style="background: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
      <h3 style="margin-top: 0; color: #667eea;">Contact Information</h3>
      <p><strong>Name:</strong> ${intake.contact.firstName} ${
    intake.contact.lastName
  }</p>
      <p><strong>Email:</strong> ${intake.contact.email}</p>
      ${
        intake.contact.phone
          ? `<p><strong>Phone:</strong> ${intake.contact.phone}</p>`
          : ""
      }
    </div>
    
    ${
      intake.org
        ? `
    <div style="background: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
      <h3 style="margin-top: 0; color: #667eea;">Organization</h3>
      <p><strong>Name:</strong> ${intake.org.name}</p>
      ${
        intake.org.website
          ? `<p><strong>Website:</strong> <a href="${intake.org.website}">${intake.org.website}</a></p>`
          : ""
      }
      ${
        intake.org.industry
          ? `<p><strong>Industry:</strong> ${intake.org.industry}</p>`
          : ""
      }
      ${
        intake.org.size
          ? `<p><strong>Size:</strong> ${intake.org.size}</p>`
          : ""
      }
    </div>
    `
        : ""
    }
    
    <div style="background: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
      <h3 style="margin-top: 0; color: #667eea;">Project Information</h3>
      <p><strong>Title:</strong> ${intake.project.title}</p>
      <p><strong>Description:</strong></p>
      <p style="white-space: pre-wrap;">${intake.project.description}</p>
      ${
        intake.project.timeline
          ? `<p><strong>Timeline:</strong> ${intake.project.timeline}</p>`
          : ""
      }
      ${
        intake.project.budget
          ? `<p><strong>Budget:</strong> ${intake.project.budget}</p>`
          : ""
      }
      ${
        intake.project.startDate
          ? `<p><strong>Start Date:</strong> ${intake.project.startDate}</p>`
          : ""
      }
      ${
        intake.project.technologies && intake.project.technologies.length > 0
          ? `
        <p><strong>Technologies:</strong> ${intake.project.technologies.join(
          ", "
        )}</p>
      `
          : ""
      }
      ${
        intake.project.requirements && intake.project.requirements.length > 0
          ? `
        <p><strong>Requirements:</strong></p>
        <ul>
          ${intake.project.requirements
            .map((req) => `<li>${req}</li>`)
            .join("")}
        </ul>
      `
          : ""
      }
      ${
        intake.project.goals && intake.project.goals.length > 0
          ? `
        <p><strong>Goals:</strong></p>
        <ul>
          ${intake.project.goals.map((goal) => `<li>${goal}</li>`).join("")}
        </ul>
      `
          : ""
      }
    </div>
    
    ${
      intake.additional
        ? `
    <div style="background: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
      <h3 style="margin-top: 0; color: #667eea;">Additional Information</h3>
      ${
        intake.additional.preferredContactMethod
          ? `<p><strong>Preferred Contact:</strong> ${intake.additional.preferredContactMethod}</p>`
          : ""
      }
      ${
        intake.additional.timezone
          ? `<p><strong>Timezone:</strong> ${intake.additional.timezone}</p>`
          : ""
      }
      ${
        intake.additional.urgency
          ? `<p><strong>Urgency:</strong> ${intake.additional.urgency}</p>`
          : ""
      }
      ${
        intake.additional.notes
          ? `<p><strong>Notes:</strong></p><p style="white-space: pre-wrap;">${intake.additional.notes}</p>`
          : ""
      }
    </div>
    `
        : ""
    }
    
    <div style="background: white; padding: 20px; border-radius: 5px; margin-top: 20px;">
      <h3 style="margin-top: 0; color: #667eea;">Proposal</h3>
      <pre style="white-space: pre-wrap; font-family: 'Courier New', monospace; background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto;">${proposalMarkdown}</pre>
    </div>
    
    <p style="margin-top: 30px; text-align: center; color: #666;">
      We'll review your project and get back to you soon!
    </p>
    
    <p style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
      Best regards,<br>
      Omri Jukin
    </p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Render plain text email template for client receipt
 */
export function renderClientReceiptText(
  intake: IntakeFormData,
  proposalMarkdown: string
): string {
  const orgName =
    intake.org?.name ??
    intake.contact.fullName ??
    `${intake.contact.firstName} ${intake.contact.lastName}`;

  let text = `Thank You!\n\nWe've received your project intake for ${orgName}.\n\n`;
  text += `PROJECT DETAILS\n`;
  text += `===============\n\n`;
  text += `Contact Information:\n`;
  text += `Name: ${intake.contact.firstName} ${intake.contact.lastName}\n`;
  text += `Email: ${intake.contact.email}\n`;
  if (intake.contact.phone) text += `Phone: ${intake.contact.phone}\n`;
  text += `\n`;

  if (intake.org) {
    text += `Organization:\n`;
    text += `Name: ${intake.org.name}\n`;
    if (intake.org.website) text += `Website: ${intake.org.website}\n`;
    if (intake.org.industry) text += `Industry: ${intake.org.industry}\n`;
    if (intake.org.size) text += `Size: ${intake.org.size}\n`;
    text += `\n`;
  }

  text += `Project Information:\n`;
  text += `Title: ${intake.project.title}\n`;
  text += `Description: ${intake.project.description}\n`;
  if (intake.project.timeline) text += `Timeline: ${intake.project.timeline}\n`;
  if (intake.project.budget) text += `Budget: ${intake.project.budget}\n`;
  if (intake.project.startDate)
    text += `Start Date: ${intake.project.startDate}\n`;
  if (intake.project.technologies && intake.project.technologies.length > 0) {
    text += `Technologies: ${intake.project.technologies.join(", ")}\n`;
  }
  if (intake.project.requirements && intake.project.requirements.length > 0) {
    text += `Requirements:\n`;
    intake.project.requirements.forEach((req) => (text += `  - ${req}\n`));
  }
  if (intake.project.goals && intake.project.goals.length > 0) {
    text += `Goals:\n`;
    intake.project.goals.forEach((goal) => (text += `  - ${goal}\n`));
  }
  text += `\n`;

  if (intake.additional) {
    text += `Additional Information:\n`;
    if (intake.additional.preferredContactMethod)
      text += `Preferred Contact: ${intake.additional.preferredContactMethod}\n`;
    if (intake.additional.timezone)
      text += `Timezone: ${intake.additional.timezone}\n`;
    if (intake.additional.urgency)
      text += `Urgency: ${intake.additional.urgency}\n`;
    if (intake.additional.notes) text += `Notes: ${intake.additional.notes}\n`;
    text += `\n`;
  }

  text += `PROPOSAL\n`;
  text += `========\n\n`;
  text += proposalMarkdown;
  text += `\n\nWe'll review your project and get back to you soon!\n\n`;
  text += `Best regards,\nOmri Jukin\n`;

  return text;
}

/**
 * Render HTML email template for internal summary (Omri/admin)
 */
export function renderInternalSummaryHTML(intake: IntakeFormData): string {
  const orgName =
    intake.org?.name ??
    intake.contact.fullName ??
    `${intake.contact.firstName} ${intake.contact.lastName}`;

  // Format budget properly
  const budgetDisplay = formatBudget(intake.project.budget);

  // Urgency color coding
  const urgencyColors: Record<string, string> = {
    urgent: "#dc3545",
    high: "#fd7e14",
    medium: "#ffc107",
    low: "#28a745",
  };
  const urgencyLevel = intake.additional?.urgency?.toLowerCase() || "medium";
  const urgencyColor = urgencyColors[urgencyLevel] || urgencyColors.medium;

  // Generate timestamp
  const timestamp = new Date().toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: intake.additional?.timezone || "UTC",
  });

  // Base URL for admin panel (adjust as needed)
  const adminPanelUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://omrijukin.com";
  const adminDashboardLink = `${adminPanelUrl}/admin/dashboard`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Intake - ${orgName}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">🎯 NEW INTAKE RECEIVED</h1>
    <p style="color: rgba(255,255,255,0.95); margin: 8px 0 0 0; font-size: 14px;">${timestamp}</p>
  </div>
  
  <!-- Quick Summary -->
  <div style="background: white; padding: 20px; border-left: 4px solid ${urgencyColor}; margin-bottom: 0;">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
      <div>
        <h2 style="margin: 0 0 8px 0; color: #333; font-size: 20px;">${
          intake.project.title
        }</h2>
        <p style="margin: 0; color: #666; font-size: 14px;">
          <strong style="color: #333;">${orgName}</strong>
        </p>
      </div>
      <div style="text-align: right;">
        <span style="display: inline-block; background: ${urgencyColor}; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
          ${intake.additional?.urgency || "Medium"} Priority
        </span>
      </div>
    </div>
    
    <!-- Key Metrics -->
    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
      <div style="text-align: center; background: linear-gradient(135deg, #f8f9ff 0%, #e8ebff 100%); padding: 15px; border-radius: 8px; border: 1px solid #e0e4ff;">
        <div style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">💰</div>
        <div style="font-size: 11px; color: #667eea; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 6px;">Budget</div>
        <div style="font-size: 15px; font-weight: 700; color: #333; line-height: 1.3;">${budgetDisplay}</div>
      </div>
      <div style="text-align: center; background: linear-gradient(135deg, #fff8f0 0%, #ffe8d0 100%); padding: 15px; border-radius: 8px; border: 1px solid #ffd4a0;">
        <div style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">📅</div>
        <div style="font-size: 11px; color: #fd7e14; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 6px;">Timeline</div>
        <div style="font-size: 15px; font-weight: 700; color: #333; line-height: 1.3;">${
          intake.project.timeline || "To be determined"
        }</div>
      </div>
      <div style="text-align: center; background: linear-gradient(135deg, #f0f8ff 0%, #d0e8ff 100%); padding: 15px; border-radius: 8px; border: 1px solid #a0c4ff;">
        <div style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">📞</div>
        <div style="font-size: 11px; color: #17a2b8; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 6px;">Contact</div>
        <div style="font-size: 15px; font-weight: 700; color: #333; line-height: 1.3;">${
          intake.additional?.preferredContactMethod || "Email"
        }</div>
      </div>
    </div>
  </div>

  <!-- Quick Actions -->
  <div style="background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); padding: 25px 20px; text-align: center; border-bottom: 1px solid #dee2e6;">
    <p style="margin: 0 0 18px 0; font-size: 13px; color: #667eea; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Quick Actions</p>
    <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
      <a href="${adminDashboardLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #5568d3 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3); transition: transform 0.2s, box-shadow 0.2s;">
        📊 View in Admin
      </a>
      <a href="mailto:${intake.contact.email}?subject=Re: ${encodeURIComponent(
    intake.project.title
  )}" style="display: inline-block; background: linear-gradient(135deg, #28a745 0%, #218838 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 6px rgba(40, 167, 69, 0.3);">
        ✉️ Reply to Client
      </a>
      <a href="mailto:${
        intake.contact.email
      }?subject=Let's Schedule a Call&body=Hi ${
    intake.contact.firstName
  }," style="display: inline-block; background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 6px rgba(23, 162, 184, 0.3);">
        📞 Schedule Call
      </a>
    </div>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <!-- Contact Information -->
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 3px solid #667eea;">
      <h3 style="margin: 0 0 15px 0; color: #667eea; font-size: 16px; font-weight: 600;">👤 Contact Information</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px; width: 120px;"><strong>Name:</strong></td>
          <td style="padding: 8px 0; color: #333; font-size: 14px;">${
            intake.contact.firstName
          } ${intake.contact.lastName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Email:</strong></td>
          <td style="padding: 8px 0;"><a href="mailto:${
            intake.contact.email
          }" style="color: #667eea; text-decoration: none; font-size: 14px;">${
    intake.contact.email
  }</a></td>
        </tr>
        ${
          intake.contact.phone
            ? `<tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Phone:</strong></td>
          <td style="padding: 8px 0;"><a href="tel:${intake.contact.phone}" style="color: #667eea; text-decoration: none; font-size: 14px;">${intake.contact.phone}</a></td>
        </tr>`
            : ""
        }
      </table>
    </div>
    
    <!-- Organization -->
    ${
      intake.org
        ? `
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 3px solid #667eea;">
      <h3 style="margin: 0 0 15px 0; color: #667eea; font-size: 16px; font-weight: 600;">🏢 Organization</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px; width: 120px;"><strong>Name:</strong></td>
          <td style="padding: 8px 0; color: #333; font-size: 14px;">${
            intake.org.name
          }</td>
        </tr>
        ${
          intake.org.website
            ? `<tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Website:</strong></td>
          <td style="padding: 8px 0;"><a href="${intake.org.website}" target="_blank" style="color: #667eea; text-decoration: none; font-size: 14px;">${intake.org.website}</a></td>
        </tr>`
            : ""
        }
        ${
          intake.org.industry
            ? `<tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Industry:</strong></td>
          <td style="padding: 8px 0; color: #333; font-size: 14px;">${intake.org.industry}</td>
        </tr>`
            : ""
        }
        ${
          intake.org.size
            ? `<tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Size:</strong></td>
          <td style="padding: 8px 0; color: #333; font-size: 14px;">${intake.org.size}</td>
        </tr>`
            : ""
        }
      </table>
    </div>
    `
        : ""
    }
    
    <!-- Project Information -->
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 3px solid #667eea;">
      <h3 style="margin: 0 0 15px 0; color: #667eea; font-size: 16px; font-weight: 600;">💼 Project Information</h3>
      
      <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
        <p style="margin: 0 0 8px 0; color: #999; font-size: 12px; text-transform: uppercase; font-weight: 600;">Description</p>
        <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${
          intake.project.description
        }</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse;">
        ${
          intake.project.timeline
            ? `<tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px; width: 140px;"><strong>Timeline:</strong></td>
          <td style="padding: 8px 0; color: #333; font-size: 14px;">${intake.project.timeline}</td>
        </tr>`
            : ""
        }
        ${
          intake.project.budget
            ? `<tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Budget:</strong></td>
          <td style="padding: 8px 0; color: #333; font-size: 14px;">${budgetDisplay}</td>
        </tr>`
            : ""
        }
        ${
          intake.project.startDate
            ? `<tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px;"><strong>Start Date:</strong></td>
          <td style="padding: 8px 0; color: #333; font-size: 14px;">${intake.project.startDate}</td>
        </tr>`
            : ""
        }
      </table>
      
      ${
        intake.project.technologies && intake.project.technologies.length > 0
          ? `
      <div style="margin-top: 15px;">
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px; font-weight: 600;">Technologies:</p>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${intake.project.technologies
            .map(
              (tech) =>
                `<span style="background: linear-gradient(135deg, #667eea 0%, #5568d3 100%); color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2); display: inline-block; margin: 2px;">${tech}</span>`
            )
            .join("")}
        </div>
      </div>
      `
          : ""
      }
      
      ${
        intake.project.requirements && intake.project.requirements.length > 0
          ? `
      <div style="margin-top: 15px;">
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px; font-weight: 600;">Requirements:</p>
        <ul style="margin: 0; padding-left: 20px; color: #333; font-size: 14px; line-height: 1.8;">
          ${intake.project.requirements
            .map((req) => `<li style="margin-bottom: 4px;">${req}</li>`)
            .join("")}
        </ul>
      </div>
      `
          : ""
      }
      
      ${
        intake.project.goals && intake.project.goals.length > 0
          ? `
      <div style="margin-top: 15px;">
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px; font-weight: 600;">Goals:</p>
        <ul style="margin: 0; padding-left: 20px; color: #333; font-size: 14px; line-height: 1.8;">
          ${intake.project.goals
            .map((goal) => `<li style="margin-bottom: 4px;">${goal}</li>`)
            .join("")}
        </ul>
      </div>
      `
          : ""
      }
    </div>
    
    <!-- Additional Information -->
    ${
      intake.additional &&
      (intake.additional.notes || intake.additional.timezone)
        ? `
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 3px solid #667eea;">
      <h3 style="margin: 0 0 15px 0; color: #667eea; font-size: 16px; font-weight: 600;">📋 Additional Information</h3>
      <table style="width: 100%; border-collapse: collapse;">
        ${
          intake.additional.timezone
            ? `<tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px; width: 140px;"><strong>Timezone:</strong></td>
          <td style="padding: 8px 0; color: #333; font-size: 14px;">${intake.additional.timezone}</td>
        </tr>`
            : ""
        }
      </table>
      ${
        intake.additional.notes
          ? `
      <div style="margin-top: 15px;">
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px; font-weight: 600;">Notes:</p>
        <div style="background: white; padding: 15px; border-radius: 6px;">
          <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${intake.additional.notes}</p>
        </div>
      </div>
      `
          : ""
      }
    </div>
    `
        : ""
    }
    
    <!-- Next Steps / Admin Note -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px 20px; border-radius: 12px; margin-top: 30px; text-align: center; box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3); position: relative; overflow: hidden;">
      <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -30px; left: -30px; width: 100px; height: 100px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
      <div style="position: relative; z-index: 1;">
        <p style="margin: 0 0 12px 0; color: white; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">📌 Next Steps</p>
        <p style="margin: 0; color: rgba(255,255,255,0.98); font-size: 15px; line-height: 1.7;">
          Review the full proposal in the admin panel and respond to <strong style="color: white;">${
            intake.contact.firstName
          }</strong> within <strong style="color: white;">24-48 hours</strong> to maximize engagement.
        </p>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee; text-align: center;">
      <p style="margin: 0; color: #999; font-size: 12px;">
        This is an automated notification from your portfolio intake system.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
