import { describe, it, expect } from "@jest/globals";
import {
  matchesScope,
  type DiscountAppliesTo,
  type DiscountScopeInput,
} from "../discountScope";

describe("matchesScope", () => {
  describe("project type matching", () => {
    it("should return true if no project type restriction", () => {
      const appliesTo: DiscountAppliesTo = {};
      const inputs: DiscountScopeInput = { projectTypeKey: "website" };
      expect(matchesScope(appliesTo, inputs)).toBe(true);
    });

    it("should return true if project type matches", () => {
      const appliesTo: DiscountAppliesTo = { projectTypes: ["website", "app"] };
      const inputs: DiscountScopeInput = { projectTypeKey: "website" };
      expect(matchesScope(appliesTo, inputs)).toBe(true);
    });

    it("should return false if project type doesn't match", () => {
      const appliesTo: DiscountAppliesTo = { projectTypes: ["website", "app"] };
      const inputs: DiscountScopeInput = { projectTypeKey: "ecommerce" };
      expect(matchesScope(appliesTo, inputs)).toBe(false);
    });

    it("should return false if project type restriction exists but input is missing", () => {
      const appliesTo: DiscountAppliesTo = { projectTypes: ["website"] };
      const inputs: DiscountScopeInput = {};
      expect(matchesScope(appliesTo, inputs)).toBe(false);
    });
  });

  describe("feature matching", () => {
    it("should return true if no feature restriction", () => {
      const appliesTo: DiscountAppliesTo = {};
      const inputs: DiscountScopeInput = { selectedFeatureKeys: ["cms"] };
      expect(matchesScope(appliesTo, inputs)).toBe(true);
    });

    it("should return true if at least one feature matches", () => {
      const appliesTo: DiscountAppliesTo = { features: ["cms", "auth"] };
      const inputs: DiscountScopeInput = {
        selectedFeatureKeys: ["payment", "cms", "api"],
      };
      expect(matchesScope(appliesTo, inputs)).toBe(true);
    });

    it("should return false if no features match", () => {
      const appliesTo: DiscountAppliesTo = { features: ["cms", "auth"] };
      const inputs: DiscountScopeInput = {
        selectedFeatureKeys: ["payment", "api"],
      };
      expect(matchesScope(appliesTo, inputs)).toBe(false);
    });

    it("should return false if feature restriction exists but no features selected", () => {
      const appliesTo: DiscountAppliesTo = { features: ["cms"] };
      const inputs: DiscountScopeInput = {};
      expect(matchesScope(appliesTo, inputs)).toBe(false);
    });

    it("should return false if feature restriction exists but empty feature array", () => {
      const appliesTo: DiscountAppliesTo = { features: ["cms"] };
      const inputs: DiscountScopeInput = { selectedFeatureKeys: [] };
      expect(matchesScope(appliesTo, inputs)).toBe(false);
    });
  });

  describe("client type exclusion", () => {
    it("should return true if no exclusion list", () => {
      const appliesTo: DiscountAppliesTo = {};
      const inputs: DiscountScopeInput = { clientTypeKey: "enterprise" };
      expect(matchesScope(appliesTo, inputs)).toBe(true);
    });

    it("should return false if client type is excluded", () => {
      const appliesTo: DiscountAppliesTo = {
        excludeClientTypes: ["enterprise", "large-business"],
      };
      const inputs: DiscountScopeInput = { clientTypeKey: "enterprise" };
      expect(matchesScope(appliesTo, inputs)).toBe(false);
    });

    it("should return true if client type is not excluded", () => {
      const appliesTo: DiscountAppliesTo = {
        excludeClientTypes: ["enterprise"],
      };
      const inputs: DiscountScopeInput = { clientTypeKey: "startup" };
      expect(matchesScope(appliesTo, inputs)).toBe(true);
    });

    it("should return true if exclusion list exists but no client type provided", () => {
      const appliesTo: DiscountAppliesTo = {
        excludeClientTypes: ["enterprise"],
      };
      const inputs: DiscountScopeInput = {};
      expect(matchesScope(appliesTo, inputs)).toBe(true);
    });
  });

  describe("client type inclusion", () => {
    it("should return true if no inclusion list", () => {
      const appliesTo: DiscountAppliesTo = {};
      const inputs: DiscountScopeInput = { clientTypeKey: "startup" };
      expect(matchesScope(appliesTo, inputs)).toBe(true);
    });

    it("should return true if client type matches inclusion list", () => {
      const appliesTo: DiscountAppliesTo = {
        clientTypes: ["startup", "small-business"],
      };
      const inputs: DiscountScopeInput = { clientTypeKey: "startup" };
      expect(matchesScope(appliesTo, inputs)).toBe(true);
    });

    it("should return false if client type doesn't match inclusion list", () => {
      const appliesTo: DiscountAppliesTo = {
        clientTypes: ["startup", "small-business"],
      };
      const inputs: DiscountScopeInput = { clientTypeKey: "enterprise" };
      expect(matchesScope(appliesTo, inputs)).toBe(false);
    });

    it("should return false if inclusion list exists but no client type provided", () => {
      const appliesTo: DiscountAppliesTo = {
        clientTypes: ["startup"],
      };
      const inputs: DiscountScopeInput = {};
      expect(matchesScope(appliesTo, inputs)).toBe(false);
    });
  });

  describe("combined conditions", () => {
    it("should return true if all conditions match", () => {
      const appliesTo: DiscountAppliesTo = {
        projectTypes: ["website"],
        features: ["cms"],
        clientTypes: ["startup"],
      };
      const inputs: DiscountScopeInput = {
        projectTypeKey: "website",
        selectedFeatureKeys: ["cms", "auth"],
        clientTypeKey: "startup",
      };
      expect(matchesScope(appliesTo, inputs)).toBe(true);
    });

    it("should return false if any condition doesn't match", () => {
      const appliesTo: DiscountAppliesTo = {
        projectTypes: ["website"],
        features: ["cms"],
        clientTypes: ["startup"],
      };
      const inputs: DiscountScopeInput = {
        projectTypeKey: "website",
        selectedFeatureKeys: ["cms", "auth"],
        clientTypeKey: "enterprise", // Doesn't match
      };
      expect(matchesScope(appliesTo, inputs)).toBe(false);
    });

    it("should prioritize exclusion over inclusion", () => {
      const appliesTo: DiscountAppliesTo = {
        clientTypes: ["startup", "enterprise"],
        excludeClientTypes: ["enterprise"],
      };
      const inputs: DiscountScopeInput = {
        clientTypeKey: "enterprise",
      };
      // Exclusion should take precedence
      expect(matchesScope(appliesTo, inputs)).toBe(false);
    });

    it("should handle empty arrays correctly", () => {
      const appliesTo: DiscountAppliesTo = {
        projectTypes: [],
        features: [],
        clientTypes: [],
      };
      const inputs: DiscountScopeInput = {
        projectTypeKey: "website",
        selectedFeatureKeys: ["cms"],
        clientTypeKey: "startup",
      };
      // Empty arrays should be treated as no restriction
      expect(matchesScope(appliesTo, inputs)).toBe(true);
    });
  });
});
