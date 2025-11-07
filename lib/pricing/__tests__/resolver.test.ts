import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { getPricingModel } from "../resolver";
import { getDB } from "../../db/client";
import {
  pricingProjectTypes,
  pricingBaseRates,
  pricingFeatures,
  pricingMultiplierGroups,
  pricingMultiplierValues,
  pricingMeta,
} from "../../db/schema/schema.tables";

describe("getPricingModel", () => {
  let db: Awaited<ReturnType<typeof getDB>> | null = null;

  beforeEach(async () => {
    // Skip tests if DATABASE_URL is not set or in production
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "production") {
      console.warn(
        "Skipping pricing resolver tests - DATABASE_URL not set or in production"
      );
      return;
    }

    try {
      db = await getDB();
      if (!db) {
        return;
      }
      // Clean up before each test
      await db.delete(pricingMeta);
      await db.delete(pricingMultiplierValues);
      await db.delete(pricingMultiplierGroups);
      await db.delete(pricingFeatures);
      await db.delete(pricingBaseRates);
      await db.delete(pricingProjectTypes);
    } catch (error) {
      console.error("Failed to setup test database:", error);
      db = null;
    }
  });

  afterEach(async () => {
    // Clean up after each test
    if (db) {
      await db.delete(pricingMeta);
      await db.delete(pricingMultiplierValues);
      await db.delete(pricingMultiplierGroups);
      await db.delete(pricingFeatures);
      await db.delete(pricingBaseRates);
      await db.delete(pricingProjectTypes);
    }
  });

  it("should return empty model when no data exists", async () => {
    if (
      !db ||
      !process.env.DATABASE_URL ||
      process.env.NODE_ENV === "production"
    ) {
      return;
    }

    const model = await getPricingModel();
    expect(model.projectTypes).toEqual([]);
    expect(model.baseRates).toEqual([]);
    expect(model.features).toEqual([]);
    expect(model.multiplierGroups).toEqual([]);
    expect(model.meta.pageCostPerPage).toBe(750); // Default value
    expect(model.meta.rangePercent).toBe(0.18); // Default value
    expect(model.meta.defaultCurrency).toBe("ILS"); // Default value
    expect(model.meta.projectMinimums).toEqual({});
  });

  it("should return only active items", async () => {
    if (
      !db ||
      !process.env.DATABASE_URL ||
      process.env.NODE_ENV === "production"
    ) {
      return;
    }

    // Insert active and inactive project types
    await db.insert(pricingProjectTypes).values([
      {
        key: "active-type",
        displayName: "Active Type",
        baseRateIls: 10000,
        order: 0,
        isActive: true,
      },
      {
        key: "inactive-type",
        displayName: "Inactive Type",
        baseRateIls: 20000,
        order: 1,
        isActive: false,
      },
    ]);

    const model = await getPricingModel();
    expect(model.projectTypes).toHaveLength(1);
    expect(model.projectTypes[0].key).toBe("active-type");
  });

  it("should sort items by order", async () => {
    if (
      !db ||
      !process.env.DATABASE_URL ||
      process.env.NODE_ENV === "production"
    ) {
      return;
    }

    // Insert project types in reverse order
    await db.insert(pricingProjectTypes).values([
      {
        key: "type-3",
        displayName: "Type 3",
        baseRateIls: 30000,
        order: 3,
        isActive: true,
      },
      {
        key: "type-1",
        displayName: "Type 1",
        baseRateIls: 10000,
        order: 1,
        isActive: true,
      },
      {
        key: "type-2",
        displayName: "Type 2",
        baseRateIls: 20000,
        order: 2,
        isActive: true,
      },
    ]);

    const model = await getPricingModel();
    expect(model.projectTypes).toHaveLength(3);
    expect(model.projectTypes[0].key).toBe("type-1");
    expect(model.projectTypes[1].key).toBe("type-2");
    expect(model.projectTypes[2].key).toBe("type-3");
  });

  it("should group multiplier values by group", async () => {
    if (
      !db ||
      !process.env.DATABASE_URL ||
      process.env.NODE_ENV === "production"
    ) {
      return;
    }

    // Insert multiplier group and values
    await db.insert(pricingMultiplierGroups).values({
      key: "test-group",
      displayName: "Test Group",
      order: 0,
      isActive: true,
    });

    await db.insert(pricingMultiplierValues).values([
      {
        groupKey: "test-group",
        optionKey: "option-1",
        displayName: "Option 1",
        value: "1.5",
        order: 0,
        isFixed: false,
        isActive: true,
      },
      {
        groupKey: "test-group",
        optionKey: "option-2",
        displayName: "Option 2",
        value: "2.0",
        order: 1,
        isFixed: false,
        isActive: true,
      },
    ]);

    const model = await getPricingModel();
    expect(model.multiplierGroups).toHaveLength(1);
    expect(model.multiplierGroups[0].options).toHaveLength(2);
    expect(model.multiplierGroups[0].options[0].optionKey).toBe("option-1");
    expect(model.multiplierGroups[0].options[0].value).toBe(1.5);
    expect(model.multiplierGroups[0].options[1].optionKey).toBe("option-2");
    expect(model.multiplierGroups[0].options[1].value).toBe(2.0);
  });

  it("should parse meta settings correctly", async () => {
    if (
      !db ||
      !process.env.DATABASE_URL ||
      process.env.NODE_ENV === "production"
    ) {
      return;
    }

    await db.insert(pricingMeta).values([
      {
        key: "pageCostPerPage",
        value: { value: 1000 },
        order: 0,
        isActive: true,
      },
      {
        key: "rangePercent",
        value: { value: 0.25 },
        order: 1,
        isActive: true,
      },
      {
        key: "defaultCurrency",
        value: { value: "USD" },
        order: 2,
        isActive: true,
      },
      {
        key: "projectMinimums",
        value: { website: 10000, app: 30000 },
        order: 3,
        isActive: true,
      },
    ]);

    const model = await getPricingModel();
    expect(model.meta.pageCostPerPage).toBe(1000);
    expect(model.meta.rangePercent).toBe(0.25);
    expect(model.meta.defaultCurrency).toBe("USD");
    expect(model.meta.projectMinimums).toEqual({
      website: 10000,
      app: 30000,
    });
  });
});
