import { useState, useMemo } from "react";
import { api } from "$/trpc/client";
import { calculateEstimate } from "$/pricing/calculate";
import { matchesScope } from "$/pricing/discountScope";

export interface PricingInputs {
  projectTypeKey: string;
  numPages: number;
  selectedFeatureKeys: string[];
  complexityKey: string;
  timelineKey: string;
  techKey: string;
  clientTypeKey: string;
}

export function usePricingBreakdown() {
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
  const { data: discountData } = api.discounts.lookupDiscount.useQuery(
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
    if (discountData && discountCode) {
      const applies = matchesScope(discountData.appliesTo, {
        projectTypeKey: inputs.projectTypeKey,
        selectedFeatureKeys: inputs.selectedFeatureKeys,
        clientTypeKey,
      });

      if (applies) {
        const discountType =
          discountData.discountType === "percent" ||
          discountData.discountType === "fixed"
            ? discountData.discountType
            : "percent";
        discount = {
          type: discountType,
          amount: discountData.amount,
        };
        setDiscountError(null);
      } else {
        setDiscountError("Discount does not apply to current selection");
      }
    } else if (discountCode && !discountData) {
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
  }, [pricingModel, inputs, discountCode, discountData]);

  return {
    pricingModel,
    isLoading,
    inputs,
    setInputs,
    discountCode,
    setDiscountCode,
    discountError,
    discountData,
    breakdown,
  };
}
