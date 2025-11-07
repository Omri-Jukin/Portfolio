"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { api } from "$/trpc/client";
import { calculateEstimate } from "$/pricing/calculate";
import { matchesScope } from "$/pricing/discountScope";
import type { PricingModel } from "$/pricing/types";

export interface PricingInputs {
  projectTypeKey: string;
  numPages: number;
  selectedFeatureKeys: string[];
  complexityKey: string;
  timelineKey: string;
  techKey: string;
  clientTypeKey: string;
}

interface PricingContextValue {
  pricingModel: PricingModel | undefined;
  isLoading: boolean;
  inputs: PricingInputs;
  setInputs: React.Dispatch<React.SetStateAction<PricingInputs>>;
  discountCode: string;
  setDiscountCode: (code: string) => void;
  discountError: string | null;
  discountData:
    | {
        discountType: "percent" | "fixed";
        amount: number;
        currency?: string;
        appliesTo: unknown;
      }
    | null
    | undefined;
  breakdown: ReturnType<typeof calculateEstimate> | null;
}

const PricingContext = createContext<PricingContextValue | undefined>(
  undefined
);

export function PricingProvider({ children }: { children: React.ReactNode }) {
  const { data: pricingModel, isLoading } = api.pricing.getModel.useQuery();

  const [inputs, setInputs] = useState<PricingInputs>({
    projectTypeKey: "",
    numPages: 5,
    selectedFeatureKeys: [],
    complexityKey: "",
    timelineKey: "",
    techKey: "",
    clientTypeKey: "",
  });

  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState<string | null>(null);

  // Lookup discount
  const { data: rawDiscountData } = api.discounts.lookupDiscount.useQuery(
    { code: discountCode },
    { enabled: discountCode.length > 0 }
  );

  const breakdown = useMemo(() => {
    if (!pricingModel || !inputs.projectTypeKey) return null;

    // Set defaults if not set
    const complexityKey =
      inputs.complexityKey ||
      pricingModel.multiplierGroups.find((g) => g.key === "complexity")
        ?.options[0]?.optionKey ||
      "";
    const timelineKey =
      inputs.timelineKey ||
      pricingModel.multiplierGroups.find((g) => g.key === "timeline")
        ?.options[0]?.optionKey ||
      "";
    const techKey =
      inputs.techKey ||
      pricingModel.multiplierGroups.find((g) => g.key === "tech")?.options[0]
        ?.optionKey ||
      "";
    const clientTypeKey =
      inputs.clientTypeKey ||
      pricingModel.multiplierGroups.find((g) => g.key === "clientType")
        ?.options[0]?.optionKey ||
      "";

    // Check if discount applies
    let discount: { type: "percent" | "fixed"; amount: number } | undefined;
    if (rawDiscountData && discountCode) {
      const applies = matchesScope(rawDiscountData.appliesTo, {
        projectTypeKey: inputs.projectTypeKey,
        selectedFeatureKeys: inputs.selectedFeatureKeys,
        clientTypeKey,
      });

      if (applies) {
        const discountType =
          rawDiscountData.discountType === "percent" ||
          rawDiscountData.discountType === "fixed"
            ? rawDiscountData.discountType
            : "percent";
        discount = {
          type: discountType,
          amount: rawDiscountData.amount,
        };
        setDiscountError(null);
      } else {
        setDiscountError("Discount does not apply to current selection");
      }
    } else if (discountCode && !rawDiscountData) {
      setDiscountError("Discount code not found or expired");
    } else {
      setDiscountError(null);
    }

    return calculateEstimate(
      pricingModel,
      {
        ...inputs,
        complexityKey,
        timelineKey,
        techKey,
        clientTypeKey,
      },
      discount
    );
  }, [pricingModel, inputs, discountCode, rawDiscountData]);

  // Transform discountData to match the expected type
  const transformedDiscountData = rawDiscountData
    ? {
        discountType: (rawDiscountData.discountType === "percent" ||
        rawDiscountData.discountType === "fixed"
          ? rawDiscountData.discountType
          : "percent") as "percent" | "fixed",
        amount: rawDiscountData.amount,
        currency: rawDiscountData.currency,
        appliesTo: rawDiscountData.appliesTo,
      }
    : undefined;

  return (
    <PricingContext.Provider
      value={{
        pricingModel,
        isLoading,
        inputs,
        setInputs,
        discountCode,
        setDiscountCode,
        discountError,
        discountData: transformedDiscountData,
        breakdown,
      }}
    >
      {children}
    </PricingContext.Provider>
  );
}

export function usePricingContext() {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error("usePricingContext must be used within a PricingProvider");
  }
  return context;
}
