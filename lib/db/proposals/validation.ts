import { getDB } from "../client";
import {
  proposals,
  users,
  intakes,
  proposalTemplates,
  proposalDiscounts,
  pricingDiscounts,
  pricingMeta,
} from "../schema/schema.tables";
import { eq, and, ne } from "drizzle-orm";
import type { UpdateProposal } from "../schema/schema.types";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validate proposal update to prevent database constraint violations
 */
export async function validateProposalUpdate(
  proposalId: string,
  input: UpdateProposal
): Promise<ValidationResult> {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const errors: ValidationError[] = [];

  // Get current proposal
  const currentProposal = await dbClient
    .select()
    .from(proposals)
    .where(eq(proposals.id, proposalId))
    .limit(1);

  if (!currentProposal.length) {
    errors.push({
      field: "id",
      message: "Proposal not found.",
    });
    return { valid: false, errors };
  }

  const proposal = currentProposal[0];

  // Validate clientUserId exists if provided
  if (input.clientUserId !== undefined && input.clientUserId !== null) {
    const user = await dbClient
      .select()
      .from(users)
      .where(eq(users.id, input.clientUserId))
      .limit(1);

    if (!user.length) {
      errors.push({
        field: "clientUserId",
        message: `User with ID ${input.clientUserId} does not exist.`,
      });
    }
  }

  // Validate intakeId exists if provided
  if (input.intakeId !== undefined && input.intakeId !== null) {
    const intake = await dbClient
      .select()
      .from(intakes)
      .where(eq(intakes.id, input.intakeId))
      .limit(1);

    if (!intake.length) {
      errors.push({
        field: "intakeId",
        message: `Intake with ID ${input.intakeId} does not exist.`,
      });
    }
  }

  // Validate templateId exists if provided
  if (input.templateId !== undefined && input.templateId !== null) {
    const template = await dbClient
      .select()
      .from(proposalTemplates)
      .where(eq(proposalTemplates.id, input.templateId))
      .limit(1);

    if (!template.length) {
      errors.push({
        field: "templateId",
        message: `Template with ID ${input.templateId} does not exist.`,
      });
    }
  }

  // Validate required fields are not empty
  if (input.clientName !== undefined && !input.clientName.trim()) {
    errors.push({
      field: "clientName",
      message: "Client name cannot be empty.",
    });
  }

  if (input.clientEmail !== undefined && !input.clientEmail.trim()) {
    errors.push({
      field: "clientEmail",
      message: "Client email cannot be empty.",
    });
  }

  // Validate email format
  if (input.clientEmail !== undefined && input.clientEmail.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.clientEmail)) {
      errors.push({
        field: "clientEmail",
        message: "Invalid email format.",
      });
    }
  }

  // Validate status transitions (prevent invalid status changes)
  if (input.status !== undefined && input.status !== proposal.status) {
    const validStatuses = ["draft", "sent", "accepted", "declined", "expired"];
    if (!validStatuses.includes(input.status)) {
      errors.push({
        field: "status",
        message: `Invalid status: ${
          input.status
        }. Valid statuses are: ${validStatuses.join(", ")}.`,
      });
    }

    // Prevent changing from accepted/declined back to draft/sent
    if (
      (proposal.status === "accepted" || proposal.status === "declined") &&
      (input.status === "draft" || input.status === "sent")
    ) {
      errors.push({
        field: "status",
        message: `Cannot change status from "${proposal.status}" to "${input.status}". Once a proposal is accepted or declined, it cannot be reverted to draft or sent.`,
      });
    }
  }

  // Validate shareToken uniqueness if provided
  if (input.shareToken !== undefined && input.shareToken !== null) {
    const existing = await dbClient
      .select()
      .from(proposals)
      .where(
        and(
          eq(proposals.shareToken, input.shareToken),
          ne(proposals.id, proposalId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      errors.push({
        field: "shareToken",
        message: `Share token "${input.shareToken}" is already in use by another proposal.`,
      });
    }
  }

  // Validate tax profile exists if provided
  if (
    input.taxProfileKey !== undefined &&
    input.taxProfileKey !== null &&
    input.taxProfileKey !== ""
  ) {
    // Get pricing meta to check tax profiles
    const taxProfilesMeta = await dbClient
      .select()
      .from(pricingMeta)
      .where(eq(pricingMeta.key, "tax_profiles"))
      .limit(1);

    if (taxProfilesMeta.length > 0) {
      const taxProfiles = taxProfilesMeta[0].value as
        | Array<{ key: string; label: string }>
        | undefined;
      if (
        taxProfiles &&
        !taxProfiles.some((p) => p.key === input.taxProfileKey)
      ) {
        errors.push({
          field: "taxProfileKey",
          message: `Tax profile "${input.taxProfileKey}" does not exist.`,
        });
      }
    } else {
      // If tax_profiles meta doesn't exist, warn but don't block
      errors.push({
        field: "taxProfileKey",
        message: `Tax profile "${input.taxProfileKey}" cannot be validated (tax_profiles meta not found).`,
      });
    }
  }

  // Validate currency is valid (basic check)
  if (input.currency !== undefined) {
    const validCurrencies = ["ILS", "USD", "EUR", "GBP"];
    if (!validCurrencies.includes(input.currency)) {
      errors.push({
        field: "currency",
        message: `Invalid currency: ${
          input.currency
        }. Valid currencies are: ${validCurrencies.join(", ")}.`,
      });
    }
  }

  // Validate priceDisplay is valid
  if (input.priceDisplay !== undefined) {
    if (
      input.priceDisplay !== "taxExclusive" &&
      input.priceDisplay !== "taxInclusive"
    ) {
      errors.push({
        field: "priceDisplay",
        message: `Invalid price display: ${input.priceDisplay}. Must be "taxExclusive" or "taxInclusive".`,
      });
    }
  }

  // Validate validUntil is in the future if provided
  if (input.validUntil !== undefined && input.validUntil !== null) {
    const validUntilDate = new Date(input.validUntil);
    const now = new Date();
    if (validUntilDate < now) {
      errors.push({
        field: "validUntil",
        message: "Valid until date must be in the future.",
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate that discounts are compatible with proposal changes
 * This checks if existing discounts would become invalid after an update
 */
export async function validateDiscountCompatibility(
  proposalId: string
): Promise<ValidationResult> {
  const dbClient = await getDB();
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const errors: ValidationError[] = [];

  // Get proposal discounts that reference sourceDiscountId
  const proposalDiscountsList = await dbClient
    .select()
    .from(proposalDiscounts)
    .where(eq(proposalDiscounts.proposalId, proposalId));

  // If no discounts reference sourceDiscountId, no validation needed
  const discountsWithSource = proposalDiscountsList.filter(
    (d) => d.sourceDiscountId !== null
  );

  if (discountsWithSource.length === 0) {
    return { valid: true, errors: [] };
  }

  // Get the source discounts
  const sourceDiscountIds = discountsWithSource
    .map((d) => d.sourceDiscountId)
    .filter((id): id is string => id !== null);

  if (sourceDiscountIds.length === 0) {
    return { valid: true, errors: [] };
  }

  // Fetch source discounts one by one (Drizzle doesn't support ANY easily)
  const sourceDiscounts = [];
  for (const discountId of sourceDiscountIds) {
    const discount = await dbClient
      .select()
      .from(pricingDiscounts)
      .where(eq(pricingDiscounts.id, discountId))
      .limit(1);
    if (discount.length > 0) {
      sourceDiscounts.push(discount[0]);
    }
  }

  // For each source discount, check if it's still compatible
  // Note: This is a simplified check - full validation would require knowing
  // the proposal's project type, features, etc. from the intake or proposal meta
  for (const discount of discountsWithSource) {
    const sourceDiscount = sourceDiscounts.find(
      (sd) => sd.id === discount.sourceDiscountId
    );

    if (!sourceDiscount) {
      errors.push({
        field: "discounts",
        message: `Discount "${discount.label}" references a source discount that no longer exists.`,
      });
      continue;
    }

    // Check if discount is still active
    if (!sourceDiscount.isActive) {
      errors.push({
        field: "discounts",
        message: `Discount "${discount.label}" references an inactive source discount.`,
      });
    }

    // Check if discount has expired
    if (sourceDiscount.endsAt && new Date(sourceDiscount.endsAt) < new Date()) {
      errors.push({
        field: "discounts",
        message: `Discount "${discount.label}" has expired.`,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
