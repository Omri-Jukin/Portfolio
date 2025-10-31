import type { IntakeFormData } from "#/lib/schemas";

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

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Intake - ${orgName}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #dc3545; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">NEW INTAKE RECEIVED</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <div style="background: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
      <h3 style="margin-top: 0; color: #dc3545;">Contact Information</h3>
      <p><strong>Name:</strong> ${intake.contact.firstName} ${
    intake.contact.lastName
  }</p>
      <p><strong>Email:</strong> <a href="mailto:${intake.contact.email}">${
    intake.contact.email
  }</a></p>
      ${
        intake.contact.phone
          ? `<p><strong>Phone:</strong> <a href="tel:${intake.contact.phone}">${intake.contact.phone}</a></p>`
          : ""
      }
    </div>
    
    ${
      intake.org
        ? `
    <div style="background: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
      <h3 style="margin-top: 0; color: #dc3545;">Organization</h3>
      <p><strong>Name:</strong> ${intake.org.name}</p>
      ${
        intake.org.website
          ? `<p><strong>Website:</strong> <a href="${intake.org.website}" target="_blank">${intake.org.website}</a></p>`
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
      <h3 style="margin-top: 0; color: #dc3545;">Project Information</h3>
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
      <h3 style="margin-top: 0; color: #dc3545;">Additional Information</h3>
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
    
    <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #ffc107;">
      <p style="margin: 0;"><strong>Note:</strong> View the full proposal in the admin panel.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
