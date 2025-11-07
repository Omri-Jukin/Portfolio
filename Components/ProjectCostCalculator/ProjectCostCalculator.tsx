"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Drawer,
  Fab,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  Paper,
  useMediaQuery,
  useTheme,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Calculate as CalculateIcon,
  Close as CloseIcon,
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { usePathname } from "next/navigation";
import { api } from "$/trpc/client";
import type { CalculatorInputs as DynamicCalculatorInputs } from "$/pricing/types";
import { calculateEstimate } from "$/pricing/calculate";
import { matchesScope } from "$/pricing/discountScope";
import { INTAKE_FORM_CURRENCY_MAPPING } from "#/lib/constants";
import {
  fetchExchangeRates,
  convertCurrency,
  formatCurrency,
} from "#/lib/currency/exchangeRates";
import type { IntakeFormData } from "#/lib/schemas";

interface ProjectCostCalculatorProps {
  intakeId?: string;
  open?: boolean;
  onClose?: () => void;
}

export default function ProjectCostCalculator({
  intakeId,
  open: controlledOpen,
  onClose: controlledOnClose,
}: ProjectCostCalculatorProps) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [internalOpen, setInternalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  // Fetch pricing model
  const { data: pricingModel, isLoading: pricingLoading } =
    api.pricing.getModel.useQuery();

  // Initialize inputs with empty strings (will be set to defaults once model loads)
  const [inputs, setInputs] = useState<DynamicCalculatorInputs>({
    projectTypeKey: "",
    numPages: 5,
    selectedFeatureKeys: [],
    complexityKey: "",
    timelineKey: "",
    techKey: "",
    clientTypeKey: "",
    currency: "ILS",
  });

  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState<string | null>(null);

  // Set default values once pricing model loads
  useEffect(() => {
    if (pricingModel && !inputs.projectTypeKey) {
      const defaultProjectType = pricingModel.projectTypes[0]?.key || "";
      const defaultComplexity =
        pricingModel.multiplierGroups.find((g) => g.key === "complexity")
          ?.options[0]?.optionKey || "";
      const defaultTimeline =
        pricingModel.multiplierGroups.find((g) => g.key === "timeline")
          ?.options[0]?.optionKey || "";
      const defaultTech =
        pricingModel.multiplierGroups.find((g) => g.key === "tech")?.options[0]
          ?.optionKey || "";
      const defaultClientType =
        pricingModel.multiplierGroups.find((g) => g.key === "clientType")
          ?.options[0]?.optionKey || "";

      setInputs({
        projectTypeKey: defaultProjectType,
        numPages: 5,
        selectedFeatureKeys: [],
        complexityKey: defaultComplexity,
        timelineKey: defaultTimeline,
        techKey: defaultTech,
        clientTypeKey: defaultClientType,
        currency: "ILS",
      });
    }
  }, [pricingModel, inputs.projectTypeKey]);

  // Auto-fetch intake data if on intake detail page
  const intakeIdFromPath = pathname.match(/\/admin\/intakes\/([^/]+)/)?.[1];
  const effectiveIntakeId = intakeId || intakeIdFromPath;

  const { data: intake } = api.intakes.getById.useQuery(
    { id: effectiveIntakeId! },
    { enabled: !!effectiveIntakeId }
  );

  useEffect(() => {
    if (intake && intake.data && pricingModel) {
      const data = intake.data as IntakeFormData;
      const project = data.project;

      if (project) {
        // Auto-populate from intake data
        const title = project.title?.toLowerCase() || "";
        let projectTypeKey = inputs.projectTypeKey;
        if (title.includes("ecommerce") || title.includes("shop")) {
          projectTypeKey =
            pricingModel.projectTypes.find((pt) => pt.key === "ecommerce")
              ?.key || projectTypeKey;
        } else if (title.includes("app") || title.includes("application")) {
          projectTypeKey =
            pricingModel.projectTypes.find((pt) => pt.key === "app")?.key ||
            projectTypeKey;
        } else if (title.includes("saas") || title.includes("platform")) {
          projectTypeKey =
            pricingModel.projectTypes.find((pt) => pt.key === "saas")?.key ||
            projectTypeKey;
        }

        const technologies = project.technologies || [];
        let techKey = inputs.techKey;
        if (technologies.length > 5) {
          const advancedOption = pricingModel.multiplierGroups
            .find((g) => g.key === "tech")
            ?.options.find((o) => o.optionKey === "advanced");
          techKey = advancedOption?.optionKey || techKey;
        }

        const requirements = project.requirements || [];
        const selectedFeatureKeys = [...inputs.selectedFeatureKeys];
        if (requirements.some((r) => r.toLowerCase().includes("cms"))) {
          const cmsFeature = pricingModel.features.find((f) => f.key === "cms");
          if (cmsFeature && !selectedFeatureKeys.includes("cms")) {
            selectedFeatureKeys.push("cms");
          }
        }
        if (requirements.some((r) => r.toLowerCase().includes("auth"))) {
          const authFeature = pricingModel.features.find(
            (f) => f.key === "auth"
          );
          if (authFeature && !selectedFeatureKeys.includes("auth")) {
            selectedFeatureKeys.push("auth");
          }
        }
        if (requirements.some((r) => r.toLowerCase().includes("payment"))) {
          const paymentFeature = pricingModel.features.find(
            (f) => f.key === "payment"
          );
          if (paymentFeature && !selectedFeatureKeys.includes("payment")) {
            selectedFeatureKeys.push("payment");
          }
        }

        setInputs((prev) => ({
          ...prev,
          projectTypeKey,
          techKey,
          selectedFeatureKeys,
        }));
      }
    }
  }, [
    inputs.projectTypeKey,
    inputs.selectedFeatureKeys,
    inputs.techKey,
    intake,
    pricingModel,
  ]);

  // Fetch exchange rates dynamically
  const [exchangeRates, setExchangeRates] = React.useState<
    Record<string, number>
  >({});
  const [ratesLoading, setRatesLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    fetchExchangeRates()
      .then((rates) => {
        if (isMounted) {
          setExchangeRates(rates);
          setRatesLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setRatesLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Lookup discount
  const { data: discountData } = api.discounts.lookupDiscount.useQuery(
    { code: discountCode },
    { enabled: discountCode.length > 0 }
  );

  // Calculate cost breakdown
  const costBreakdownILS = useMemo(() => {
    if (!pricingModel || !inputs.projectTypeKey) {
      return null;
    }

    // Check if discount applies
    let discount: { type: "percent" | "fixed"; amount: number } | undefined;
    if (discountData && discountCode) {
      const applies = matchesScope(discountData.appliesTo, {
        projectTypeKey: inputs.projectTypeKey,
        selectedFeatureKeys: inputs.selectedFeatureKeys,
        clientTypeKey: inputs.clientTypeKey,
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

    return calculateEstimate(pricingModel, inputs, discount);
  }, [pricingModel, inputs, discountCode, discountData]);

  // Check if we have exchange rates loaded
  const hasRates = Object.keys(exchangeRates).length > 0 && !ratesLoading;

  // Convert costs to selected currency using exchange rates
  const costBreakdown = useMemo(() => {
    if (!costBreakdownILS) {
      return null;
    }

    return {
      ...costBreakdownILS,
      baseCost: hasRates
        ? convertCurrency(
            costBreakdownILS.baseCost,
            "ILS",
            inputs.currency || "ILS",
            exchangeRates
          )
        : costBreakdownILS.baseCost,
      pageCost: hasRates
        ? convertCurrency(
            costBreakdownILS.pageCost,
            "ILS",
            inputs.currency || "ILS",
            exchangeRates
          )
        : costBreakdownILS.pageCost,
      featureCosts: Object.fromEntries(
        Object.entries(costBreakdownILS.featureCosts).map(([key, value]) => [
          key,
          hasRates
            ? convertCurrency(
                value,
                "ILS",
                inputs.currency || "ILS",
                exchangeRates
              )
            : value,
        ])
      ),
      subtotal: hasRates
        ? convertCurrency(
            costBreakdownILS.subtotal,
            "ILS",
            inputs.currency || "ILS",
            exchangeRates
          )
        : costBreakdownILS.subtotal,
      total: hasRates
        ? convertCurrency(
            costBreakdownILS.total,
            "ILS",
            inputs.currency || "ILS",
            exchangeRates
          )
        : costBreakdownILS.total,
      range: {
        min: hasRates
          ? convertCurrency(
              costBreakdownILS.range.min,
              "ILS",
              inputs.currency || "ILS",
              exchangeRates
            )
          : costBreakdownILS.range.min,
        max: hasRates
          ? convertCurrency(
              costBreakdownILS.range.max,
              "ILS",
              inputs.currency || "ILS",
              exchangeRates
            )
          : costBreakdownILS.range.max,
      },
    };
  }, [costBreakdownILS, hasRates, exchangeRates, inputs.currency]);

  const handleCopyBreakdown = () => {
    if (!costBreakdown) return;

    const currencyInfo = INTAKE_FORM_CURRENCY_MAPPING[inputs.currency || "ILS"];
    const symbol = currencyInfo?.symbol || "$";
    const totalFeatureCost = Object.values(costBreakdown.featureCosts).reduce(
      (a, b) => a + b,
      0
    );
    const text = `Project Cost Estimate (${inputs.currency || "ILS"}):
Base Cost: ${symbol}${Math.round(costBreakdown.baseCost).toLocaleString()}
Features: ${symbol}${Math.round(totalFeatureCost).toLocaleString()}
Pages: ${symbol}${Math.round(costBreakdown.pageCost).toLocaleString()}
Total Estimate: ${symbol}${Math.round(costBreakdown.total).toLocaleString()}
Range: ${symbol}${Math.round(
      costBreakdown.range.min
    ).toLocaleString()} - ${symbol}${Math.round(
      costBreakdown.range.max
    ).toLocaleString()}${
      costBreakdown.discountApplied
        ? `\nDiscount Applied: ${
            costBreakdown.discountApplied.type === "percent"
              ? `${costBreakdown.discountApplied.amount}%`
              : `${symbol}${costBreakdown.discountApplied.amount}`
          }`
        : ""
    }`;

    navigator.clipboard.writeText(text);
  };

  const handleFabClick = () => {
    if (isMobile) {
      if (controlledOpen === undefined) {
        setInternalOpen(true);
      } else {
        controlledOnClose?.();
      }
    } else {
      if (controlledOpen !== undefined) {
        return;
      }
      setInternalOpen(true);
    }
  };

  const handleInternalClose = () => {
    if (controlledOpen === undefined) {
      setInternalOpen(false);
    } else {
      controlledOnClose?.();
    }
  };

  const CalculatorContent = ({ id }: { id: string }) => {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const scrollPositionRef = React.useRef<number>(0);

    const handleScroll = () => {
      if (contentRef.current) {
        scrollPositionRef.current = contentRef.current.scrollTop;
      }
    };

    React.useLayoutEffect(() => {
      if (contentRef.current && scrollPositionRef.current > 0) {
        requestAnimationFrame(() => {
          if (contentRef.current) {
            contentRef.current.scrollTop = scrollPositionRef.current;
          }
        });
      }
    });

    if (pricingLoading) {
      return (
        <Box
          id={id}
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 200,
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    if (!pricingModel) {
      return (
        <Box id={id} sx={{ p: 2 }}>
          <Alert severity="error">Failed to load pricing model</Alert>
        </Box>
      );
    }

    const projectTypeOptions = pricingModel.projectTypes.map((pt) => ({
      value: pt.key,
      label: pt.displayName,
    }));

    const featureOptions = pricingModel.features.map((f) => ({
      value: f.key,
      label: f.displayName,
    }));

    const complexityGroup = pricingModel.multiplierGroups.find(
      (g) => g.key === "complexity"
    );
    const timelineGroup = pricingModel.multiplierGroups.find(
      (g) => g.key === "timeline"
    );
    const techGroup = pricingModel.multiplierGroups.find(
      (g) => g.key === "tech"
    );
    const clientTypeGroup = pricingModel.multiplierGroups.find(
      (g) => g.key === "clientType"
    );

    const complexityOptions =
      complexityGroup?.options.map((o) => ({
        value: o.optionKey,
        label: o.displayName,
      })) || [];

    const timelineOptions =
      timelineGroup?.options.map((o) => ({
        value: o.optionKey,
        label: o.displayName,
      })) || [];

    const techOptions =
      techGroup?.options.map((o) => ({
        value: o.optionKey,
        label: o.displayName,
      })) || [];

    const clientTypeOptions =
      clientTypeGroup?.options.map((o) => ({
        value: o.optionKey,
        label: o.displayName,
      })) || [];

    return (
      <Box
        id={id}
        ref={contentRef}
        onScroll={handleScroll}
        sx={{
          p: 2,
          maxWidth: isMobile ? "100%" : "100%",
          mx: "auto",
          maxHeight: isMobile ? "90vh" : "85vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack
          id="project-cost-calculator-header"
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1.5 }}
        >
          <Typography variant="h6" fontWeight={700}>
            Cost Calculator
          </Typography>
          <IconButton size="small" onClick={handleInternalClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Box
          id="project-cost-calculator-content"
          sx={{ flex: 1, pr: 0.5, mt: "1vh" }}
        >
          {ratesLoading && (
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
              Loading exchange rates...
            </Typography>
          )}
          <Stack spacing={1.5}>
            <FormControl
              id="project-cost-calculator-form-control-project-type"
              fullWidth
              size="small"
              sx={{ mt: 0 }}
            >
              <InputLabel
                id="project-cost-calculator-input-label-project-type"
                sx={{ zIndex: 10 }}
              >
                Project Type
              </InputLabel>
              <Select
                id="project-cost-calculator-select-project-type"
                value={inputs.projectTypeKey}
                label="Project Type"
                onChange={(e) => {
                  setInputs({
                    ...inputs,
                    projectTypeKey: e.target.value,
                  });
                }}
              >
                {projectTypeOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    id={`project-cost-calculator-menu-item-${option.value}`}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction="row" spacing={1}>
              <FormControl
                id="project-cost-calculator-form-control-complexity"
                fullWidth
                size="small"
              >
                <InputLabel id="project-cost-calculator-input-label-complexity">
                  Complexity
                </InputLabel>
                <Select
                  id="project-cost-calculator-select-complexity"
                  value={inputs.complexityKey}
                  label="Complexity"
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      complexityKey: e.target.value,
                    })
                  }
                >
                  {complexityOptions.map((option) => (
                    <MenuItem
                      key={option.value}
                      id={`project-cost-calculator-menu-item-${option.value}`}
                      value={option.value}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                id="project-cost-calculator-text-field-pages"
                label="Pages"
                type="number"
                size="small"
                sx={{ width: 100 }}
                value={inputs.numPages}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    numPages: parseInt(e.target.value) || 0,
                  })
                }
                inputProps={{ min: 1 }}
              />
            </Stack>

            <Box id="project-cost-calculator-box-features">
              <Typography
                id="project-cost-calculator-typography-features"
                variant="caption"
                sx={{ mb: 0.5, display: "block" }}
              >
                Features
              </Typography>
              <Stack id="project-cost-calculator-stack-features" spacing={0.5}>
                {featureOptions.map((feature) => (
                  <FormControlLabel
                    key={feature.value}
                    id={`project-cost-calculator-form-control-label-${feature.value}`}
                    control={
                      <Switch
                        checked={inputs.selectedFeatureKeys.includes(
                          feature.value
                        )}
                        id={`project-cost-calculator-switch-${feature.value}`}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setInputs({
                              ...inputs,
                              selectedFeatureKeys: [
                                ...inputs.selectedFeatureKeys,
                                feature.value,
                              ],
                            });
                          } else {
                            setInputs({
                              ...inputs,
                              selectedFeatureKeys:
                                inputs.selectedFeatureKeys.filter(
                                  (key) => key !== feature.value
                                ),
                            });
                          }
                        }}
                      />
                    }
                    label={feature.label}
                  />
                ))}
              </Stack>
            </Box>

            <Stack direction="row" spacing={1}>
              <FormControl
                id="project-cost-calculator-form-control-timeline-urgency"
                fullWidth
                size="small"
              >
                <InputLabel id="project-cost-calculator-input-label-timeline">
                  Timeline
                </InputLabel>
                <Select
                  id="project-cost-calculator-select-timeline-urgency"
                  value={inputs.timelineKey}
                  label="Timeline"
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      timelineKey: e.target.value,
                    })
                  }
                >
                  {timelineOptions.map((option) => (
                    <MenuItem
                      key={option.value}
                      id={`project-cost-calculator-menu-item-${option.value}`}
                      value={option.value}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                id="project-cost-calculator-form-control-tech-stack-complexity"
                fullWidth
                size="small"
              >
                <InputLabel id="project-cost-calculator-input-label-tech-stack-complexity">
                  Tech Stack
                </InputLabel>
                <Select
                  id="project-cost-calculator-select-tech-stack-complexity"
                  value={inputs.techKey}
                  label="Tech Stack"
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      techKey: e.target.value,
                    })
                  }
                >
                  {techOptions.map((option) => (
                    <MenuItem
                      key={option.value}
                      id={`project-cost-calculator-menu-item-${option.value}`}
                      value={option.value}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack direction="row" spacing={1}>
              <FormControl
                id="project-cost-calculator-form-control-client-type"
                fullWidth
                size="small"
              >
                <InputLabel id="project-cost-calculator-input-label-client-type">
                  Client Type
                </InputLabel>
                <Select
                  id="project-cost-calculator-select-client-type"
                  value={inputs.clientTypeKey}
                  label="Client Type"
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      clientTypeKey: e.target.value,
                    })
                  }
                >
                  {clientTypeOptions.map((option) => (
                    <MenuItem
                      key={option.value}
                      id={`project-cost-calculator-menu-item-${option.value}`}
                      value={option.value}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                id="project-cost-calculator-form-control-currency"
                fullWidth
                size="small"
              >
                <InputLabel id="project-cost-calculator-input-label-currency">
                  Currency
                </InputLabel>
                <Select
                  id="project-cost-calculator-select-currency"
                  value={inputs.currency || "ILS"}
                  label="Currency"
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      currency: e.target.value,
                    })
                  }
                >
                  {Object.entries(INTAKE_FORM_CURRENCY_MAPPING).map(
                    ([code, info]) => (
                      <MenuItem
                        id={`project-cost-calculator-menu-item-currency-${code}`}
                        key={code}
                        value={code}
                      >
                        {info.symbol} {info.code} - {info.name}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Stack>

            {/* Discount Code Input */}
            <TextField
              id="project-cost-calculator-text-field-discount-code"
              label="Discount Code (Optional)"
              size="small"
              fullWidth
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              error={!!discountError}
              helperText={
                discountError || "Enter a discount code if you have one"
              }
            />

            <Divider
              id="project-cost-calculator-divider-cost-breakdown"
              sx={{ my: 0.5 }}
            />

            {costBreakdown && (
              <Paper
                id="project-cost-calculator-paper-cost-breakdown"
                sx={{
                  p: 1.5,
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                }}
              >
                <Stack
                  id="project-cost-calculator-stack-cost-breakdown"
                  spacing={1}
                >
                  <Typography
                    id="project-cost-calculator-typography-cost-breakdown"
                    variant="subtitle2"
                    fontWeight={700}
                  >
                    Cost Breakdown
                  </Typography>
                  <Stack
                    id="project-cost-calculator-stack-cost-breakdown-items"
                    direction="row"
                    justifyContent="space-between"
                    spacing={1}
                    flexWrap="wrap"
                  >
                    <Typography
                      id="project-cost-calculator-typography-cost-breakdown-base"
                      variant="caption"
                    >
                      Base:{" "}
                      {formatCurrency(
                        costBreakdown.baseCost,
                        inputs.currency || "ILS",
                        INTAKE_FORM_CURRENCY_MAPPING
                      )}
                    </Typography>
                    <Typography
                      id="project-cost-calculator-typography-cost-breakdown-features"
                      variant="caption"
                    >
                      Features:{" "}
                      {formatCurrency(
                        Object.values(costBreakdown.featureCosts).reduce(
                          (a, b) => a + b,
                          0
                        ),
                        inputs.currency || "ILS",
                        INTAKE_FORM_CURRENCY_MAPPING
                      )}
                    </Typography>
                    <Typography
                      id="project-cost-calculator-typography-cost-breakdown-pages"
                      variant="caption"
                    >
                      Pages:{" "}
                      {formatCurrency(
                        costBreakdown.pageCost,
                        inputs.currency || "ILS",
                        INTAKE_FORM_CURRENCY_MAPPING
                      )}
                    </Typography>
                  </Stack>
                  {costBreakdown.discountApplied && (
                    <Typography
                      variant="caption"
                      sx={{ color: "success.light" }}
                    >
                      Discount Applied:{" "}
                      {costBreakdown.discountApplied.type === "percent"
                        ? `${costBreakdown.discountApplied.amount}%`
                        : formatCurrency(
                            costBreakdown.discountApplied.amount,
                            inputs.currency || "ILS",
                            INTAKE_FORM_CURRENCY_MAPPING
                          )}
                    </Typography>
                  )}
                  <Divider
                    id="project-cost-calculator-divider-cost-breakdown-items"
                    sx={{ bgcolor: "rgba(255,255,255,0.3)" }}
                  />
                  <Stack
                    id="project-cost-calculator-stack-cost-breakdown-total"
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      id="project-cost-calculator-typography-cost-breakdown-total"
                      variant="h6"
                      fontWeight={700}
                    >
                      {formatCurrency(
                        costBreakdown.total,
                        inputs.currency || "ILS",
                        INTAKE_FORM_CURRENCY_MAPPING
                      )}
                    </Typography>
                    <Button
                      id="project-cost-calculator-button-copy-cost-breakdown"
                      variant="contained"
                      size="small"
                      startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                      onClick={() => {
                        handleCopyBreakdown();
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                      }}
                      sx={{
                        bgcolor: "white",
                        color: "primary.main",
                        minWidth: "auto",
                        px: 1,
                      }}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </Stack>
                  <Typography
                    id="project-cost-calculator-typography-cost-breakdown-range"
                    variant="caption"
                  >
                    Range:{" "}
                    {formatCurrency(
                      costBreakdown.range.min,
                      inputs.currency || "ILS",
                      INTAKE_FORM_CURRENCY_MAPPING
                    )}{" "}
                    -{" "}
                    {formatCurrency(
                      costBreakdown.range.max,
                      inputs.currency || "ILS",
                      INTAKE_FORM_CURRENCY_MAPPING
                    )}
                  </Typography>
                </Stack>
              </Paper>
            )}
          </Stack>
        </Box>
      </Box>
    );
  };

  return (
    <Box id="project-cost-calculator">
      {controlledOpen === undefined && (
        <Fab
          color="primary"
          onClick={handleFabClick}
          aria-label="calculate project cost"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
            "@media (max-width: 600px)": {
              bottom: 16,
              right: 16,
            },
          }}
        >
          <CalculateIcon />
        </Fab>
      )}

      {isMobile && (
        <Drawer
          id="project-cost-calculator-drawer-mobile"
          anchor="right"
          open={open}
          onClose={handleInternalClose}
          slotProps={{
            root: {
              sx: {
                width: "90vw",
                maxWidth: 420,
              },
            },
          }}
        >
          <CalculatorContent id="project-cost-calculator-content-mobile" />
        </Drawer>
      )}

      {!isMobile && open && (
        <Drawer
          id="project-cost-calculator-drawer-desktop"
          anchor="right"
          open={open}
          onClose={handleInternalClose}
          slotProps={{
            root: {
              sx: {
                width: "90vw",
                maxWidth: 420,
              },
            },
          }}
        >
          <CalculatorContent id="project-cost-calculator-content-desktop" />
        </Drawer>
      )}
    </Box>
  );
}
