import type { IntakeFormData } from "#/lib/schemas";

/**
 * Generate a Markdown proposal from intake form data
 */
export function renderProposal(intakeData: IntakeFormData): string {
  const orgName =
    intakeData.org?.name ??
    intakeData.contact.fullName ??
    `${intakeData.contact.firstName} ${intakeData.contact.lastName}`;
  const contactName = `${intakeData.contact.firstName} ${intakeData.contact.lastName}`;

  let proposal = `# Project Proposal\n\n`;
  proposal += `**Client:** ${orgName}\n`;
  proposal += `**Contact:** ${contactName}\n`;
  proposal += `**Date:** ${new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}\n\n`;
  proposal += `---\n\n`;

  proposal += `## Project Overview\n\n`;
  proposal += `### ${intakeData.project.title}\n\n`;
  proposal += `${intakeData.project.description}\n\n`;

  if (intakeData.project.goals && intakeData.project.goals.length > 0) {
    proposal += `### Project Goals\n\n`;
    intakeData.project.goals.forEach((goal, index) => {
      proposal += `${index + 1}. ${goal}\n`;
    });
    proposal += `\n`;
  }

  if (
    intakeData.project.requirements &&
    intakeData.project.requirements.length > 0
  ) {
    proposal += `## Requirements\n\n`;
    intakeData.project.requirements.forEach((req, index) => {
      proposal += `${index + 1}. ${req}\n`;
    });
    proposal += `\n`;
  }

  if (
    intakeData.project.technologies &&
    intakeData.project.technologies.length > 0
  ) {
    proposal += `## Proposed Technology Stack\n\n`;
    intakeData.project.technologies.forEach((tech) => {
      proposal += `- ${tech}\n`;
    });
    proposal += `\n`;
  }

  proposal += `## Project Details\n\n`;

  if (intakeData.project.timeline) {
    proposal += `**Timeline:** ${intakeData.project.timeline}\n\n`;
  }

  if (intakeData.project.startDate) {
    proposal += `**Preferred Start Date:** ${intakeData.project.startDate}\n\n`;
  }

  if (intakeData.project.budget) {
    proposal += `**Budget Range:** ${intakeData.project.budget}\n\n`;
  }

  if (intakeData.org) {
    proposal += `## Organization Information\n\n`;
    proposal += `**Organization:** ${intakeData.org.name}\n`;
    if (intakeData.org.industry) {
      proposal += `**Industry:** ${intakeData.org.industry}\n`;
    }
    if (intakeData.org.size) {
      proposal += `**Organization Size:** ${intakeData.org.size}\n`;
    }
    if (intakeData.org.website) {
      proposal += `**Website:** ${intakeData.org.website}\n`;
    }
    proposal += `\n`;
  }

  if (intakeData.additional) {
    if (intakeData.additional.urgency) {
      proposal += `**Urgency Level:** ${intakeData.additional.urgency}\n\n`;
    }
    if (intakeData.additional.timezone) {
      proposal += `**Client Timezone:** ${intakeData.additional.timezone}\n\n`;
    }
    if (intakeData.additional.notes) {
      proposal += `## Additional Notes\n\n`;
      proposal += `${intakeData.additional.notes}\n\n`;
    }
  }

  proposal += `---\n\n`;
  proposal += `## Next Steps\n\n`;
  proposal += `1. Review and discuss project requirements in detail\n`;
  proposal += `2. Provide detailed technical proposal and timeline\n`;
  proposal += `3. Finalize project scope and deliverables\n`;
  proposal += `4. Begin project kickoff once approved\n\n`;

  proposal += `---\n\n`;
  proposal += `*This proposal was generated based on the information provided in the intake form. Additional details will be discussed during our scheduled meeting.*\n`;

  return proposal;
}
