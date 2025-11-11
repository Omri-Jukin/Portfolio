/**
 * Generate proposal from intake data
 * Automatically creates sections and line items based on intake information
 */

import { getIntakeById } from "../db/intakes/intakes";
import { getPricingModel } from "../pricing/resolver";
import { createSection } from "../db/proposals/sections";
import { createLineItem } from "../db/proposals/lineItems";
import type { PricingModel } from "../pricing/types";

interface IntakeProjectData {
  title?: string;
  type?: string;
  requirements?: string[];
  technologies?: string[];
  timeline?: string;
  description?: string;
}

interface IntakeData {
  project?: IntakeProjectData;
  [key: string]: unknown;
}

/**
 * Map project title/type to pricing project type key
 * Uses fuzzy matching based on keywords
 */
function mapProjectTypeToKey(
  pricingModel: PricingModel,
  title?: string,
  type?: string
): string | null {
  const searchText = `${title || ""} ${type || ""}`.toLowerCase();

  // Try exact match first
  for (const projectType of pricingModel.projectTypes) {
    if (
      projectType.key.toLowerCase() === searchText.trim() ||
      projectType.displayName.toLowerCase() === searchText.trim()
    ) {
      return projectType.key;
    }
  }

  // Try keyword matching
  const keywordMap: Record<string, string[]> = {
    landing: ["landing-page", "landing"],
    website: ["website", "web"],
    portfolio: ["portfolio"],
    blog: ["blog"],
    app: ["app", "application", "mvp"],
    ecommerce: ["ecommerce", "e-commerce", "shop", "store"],
    saas: ["saas", "software", "platform"],
  };

  for (const [keyword, keys] of Object.entries(keywordMap)) {
    if (searchText.includes(keyword)) {
      for (const key of keys) {
        const match = pricingModel.projectTypes.find(
          (pt) => pt.key === key || pt.key.includes(key)
        );
        if (match) {
          return match.key;
        }
      }
    }
  }

  // Default to first active project type if no match
  return pricingModel.projectTypes[0]?.key || null;
}

/**
 * Map requirements to feature keys
 * Uses keyword matching
 */
function mapRequirementsToFeatures(
  requirements: string[],
  pricingModel: PricingModel
): string[] {
  const featureKeys: string[] = [];
  const requirementText = requirements.join(" ").toLowerCase();

  for (const feature of pricingModel.features) {
    const featureName = feature.displayName.toLowerCase();
    const featureKey = feature.key.toLowerCase();

    // Check if requirement mentions the feature
    if (
      requirementText.includes(featureName) ||
      requirementText.includes(featureKey) ||
      featureName.includes(requirementText) ||
      featureKey.includes(requirementText)
    ) {
      featureKeys.push(feature.key);
    }
  }

  // Also check for common keywords
  const keywordMap: Record<string, string> = {
    cms: "cms",
    content: "cms",
    management: "cms",
    auth: "auth",
    authentication: "auth",
    login: "auth",
    payment: "payment",
    pay: "payment",
    stripe: "payment",
    api: "api",
    "3rd party": "api",
    "third party": "api",
    realtime: "realtime",
    "real-time": "realtime",
    websocket: "realtime",
    analytics: "analytics",
    tracking: "analytics",
    google: "analytics",
  };

  for (const [keyword, featureKey] of Object.entries(keywordMap)) {
    if (requirementText.includes(keyword)) {
      const feature = pricingModel.features.find((f) => f.key === featureKey);
      if (feature && !featureKeys.includes(feature.key)) {
        featureKeys.push(feature.key);
      }
    }
  }

  return featureKeys;
}

/**
 * Calculate suggested price for project type with multipliers
 */
function calculateProjectBasePrice(
  projectTypeKey: string,
  pricingModel: PricingModel
): number {
  const projectType = pricingModel.projectTypes.find(
    (pt) => pt.key === projectTypeKey
  );
  if (!projectType) {
    return 0;
  }

  const basePrice = projectType.baseRateIls;

  // Apply multipliers if available in intake
  // Note: This is a simplified version - full calculation would use calculateEstimate
  // For now, we'll just use the base rate and let users adjust

  return basePrice;
}

/**
 * Generate proposal from intake data
 */
export async function generateProposalFromIntake(
  intakeId: string,
  proposalId: string
): Promise<{
  sectionsCreated: number;
  lineItemsCreated: number;
}> {
  // Fetch intake data
  const intake = await getIntakeById(intakeId);
  const intakeData = intake.data as IntakeData | undefined;

  if (!intakeData?.project) {
    throw new Error("Intake data does not contain project information");
  }

  const project = intakeData.project;

  // Get pricing model
  const pricingModel = await getPricingModel();

  // Map project type
  const projectTypeKey = mapProjectTypeToKey(
    pricingModel,
    project.title,
    project.type
  );

  // Map features from requirements
  const featureKeys = project.requirements
    ? mapRequirementsToFeatures(project.requirements, pricingModel)
    : [];

  // Create sections
  const sections: Array<{ id: string; key: string; label: string }> = [];

  // Section 1: Project Base
  if (projectTypeKey) {
    const projectType = pricingModel.projectTypes.find(
      (pt) => pt.key === projectTypeKey
    );
    const projectBaseSection = await createSection({
      proposalId,
      key: "project-base",
      label: "Project Base",
      description: projectType
        ? `Base project: ${projectType.displayName}`
        : undefined,
      sortOrder: 0,
    });
    sections.push({
      id: projectBaseSection.id,
      key: "project-base",
      label: "Project Base",
    });
  }

  // Section 2: Features
  if (featureKeys.length > 0) {
    const featuresSection = await createSection({
      proposalId,
      key: "features",
      label: "Features",
      description: "Additional features and functionality",
      sortOrder: 1,
    });
    sections.push({
      id: featuresSection.id,
      key: "features",
      label: "Features",
    });
  }

  // Section 3: Additional Services (always create, can be empty)
  const additionalServicesSection = await createSection({
    proposalId,
    key: "additional-services",
    label: "Additional Services",
    description: "Optional services and add-ons",
    sortOrder: 2,
  });
  sections.push({
    id: additionalServicesSection.id,
    key: "additional-services",
    label: "Additional Services",
  });

  let lineItemsCreated = 0;

  // Create line item for project base
  if (projectTypeKey) {
    const projectType = pricingModel.projectTypes.find(
      (pt) => pt.key === projectTypeKey
    );
    if (projectType) {
      const basePrice = calculateProjectBasePrice(projectTypeKey, pricingModel);
      await createLineItem({
        proposalId,
        sectionId: sections.find((s) => s.key === "project-base")?.id || null,
        featureKey: projectTypeKey,
        label: projectType.displayName,
        description:
          project.description ||
          `Base project setup for ${projectType.displayName}`,
        quantity: 1,
        unitPriceMinor: basePrice * 100, // Convert to minor units
        isOptional: false,
        isSelected: true,
      });
      lineItemsCreated++;
    }
  }

  // Create line items for features
  for (const featureKey of featureKeys) {
    const feature = pricingModel.features.find((f) => f.key === featureKey);
    if (feature) {
      await createLineItem({
        proposalId,
        sectionId: sections.find((s) => s.key === "features")?.id || null,
        featureKey: feature.key,
        label: feature.displayName,
        description: `Add ${feature.displayName} functionality`,
        quantity: 1,
        unitPriceMinor: feature.costIls * 100, // Convert to minor units
        isOptional: true,
        isSelected: true,
      });
      lineItemsCreated++;
    }
  }

  return {
    sectionsCreated: sections.length,
    lineItemsCreated,
  };
}
