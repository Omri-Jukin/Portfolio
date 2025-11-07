"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Slider,
} from "@mui/material";
import { api } from "$/trpc/client";
import { calculateEstimate } from "$/pricing/calculate";
import { matchesScope } from "$/pricing/discountScope";
import { Button as MuiButton } from "@mui/material";

export default function PreviewPanel() {
  const { data: pricingModel, isLoading } = api.pricing.getModel.useQuery();

  const [inputs, setInputs] = useState({
    projectTypeKey: "",
    numPages: 5,
    selectedFeatureKeys: [] as string[],
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

  if (isLoading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (!pricingModel) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="error">Failed to load pricing model</Alert>
      </Paper>
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

  const complexityOptions =
    pricingModel.multiplierGroups
      .find((g) => g.key === "complexity")
      ?.options.map((o) => ({ value: o.optionKey, label: o.displayName })) ||
    [];
  const timelineOptions =
    pricingModel.multiplierGroups
      .find((g) => g.key === "timeline")
      ?.options.map((o) => ({ value: o.optionKey, label: o.displayName })) ||
    [];
  const techOptions =
    pricingModel.multiplierGroups
      .find((g) => g.key === "tech")
      ?.options.map((o) => ({ value: o.optionKey, label: o.displayName })) ||
    [];
  const clientTypeOptions =
    pricingModel.multiplierGroups
      .find((g) => g.key === "clientType")
      ?.options.map((o) => ({ value: o.optionKey, label: o.displayName })) ||
    [];

  return (
    <Paper sx={{ p: 3, bgcolor: "background.paper" }}>
      <Typography variant="h6" gutterBottom color="text.primary">
        Live Estimate Preview
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure inputs below to see real-time cost estimates.
      </Typography>

      <Stack spacing={3}>
        {/* Project Type */}
        <FormControl fullWidth>
          <InputLabel>Project Type</InputLabel>
          <Select
            value={inputs.projectTypeKey}
            onChange={(e) =>
              setInputs({ ...inputs, projectTypeKey: e.target.value })
            }
            label="Project Type"
          >
            {projectTypeOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Number of Pages */}
        <Box>
          <Typography gutterBottom color="text.primary">
            Number of Pages: {inputs.numPages}
          </Typography>
          <Slider
            aria-label="Number of Pages"
            value={inputs.numPages}
            onChange={(_, value) => {
              const numValue = Array.isArray(value) ? value[0] : value;
              setInputs({
                ...inputs,
                numPages: numValue,
              });
            }}
            min={1}
            max={50}
            step={1}
            marks={[
              { value: 1, label: "1" },
              { value: 10, label: "10" },
              { value: 20, label: "20" },
              { value: 30, label: "30" },
              { value: 40, label: "40" },
              { value: 50, label: "50" },
            ]}
            sx={{ mb: 2 }}
          />
        </Box>

        {/* Features */}
        <Box>
          <Typography variant="subtitle2" gutterBottom color="text.primary">
            Features
          </Typography>
          <Stack spacing={1}>
            {featureOptions.map((feature) => (
              <FormControlLabel
                key={feature.value}
                control={
                  <Checkbox
                    checked={inputs.selectedFeatureKeys.includes(feature.value)}
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
                              (k) => k !== feature.value
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

        {/* Multipliers */}
        <FormControl fullWidth>
          <InputLabel>Complexity</InputLabel>
          <Select
            value={inputs.complexityKey || complexityOptions[0]?.value || ""}
            onChange={(e) =>
              setInputs({ ...inputs, complexityKey: e.target.value })
            }
            label="Complexity"
          >
            {complexityOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Timeline</InputLabel>
          <Select
            value={inputs.timelineKey || timelineOptions[0]?.value || ""}
            onChange={(e) =>
              setInputs({ ...inputs, timelineKey: e.target.value })
            }
            label="Timeline"
          >
            {timelineOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Tech Stack</InputLabel>
          <Select
            value={inputs.techKey || techOptions[0]?.value || ""}
            onChange={(e) => setInputs({ ...inputs, techKey: e.target.value })}
            label="Tech Stack"
          >
            {techOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Client Type</InputLabel>
          <Select
            value={inputs.clientTypeKey || clientTypeOptions[0]?.value || ""}
            onChange={(e) =>
              setInputs({ ...inputs, clientTypeKey: e.target.value })
            }
            label="Client Type"
          >
            {clientTypeOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Discount Code */}
        <Box>
          <Stack direction="row" spacing={1}>
            <TextField
              label="Discount Code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              fullWidth
              error={!!discountError}
              helperText={discountError || "Enter a discount code to apply"}
            />
            <MuiButton
              variant="outlined"
              onClick={() => setDiscountCode("")}
              sx={{ minWidth: 100 }}
            >
              Clear
            </MuiButton>
          </Stack>
          {discountError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {discountError}
            </Alert>
          )}
          {discountData && !discountError && (
            <Alert severity="success" sx={{ mt: 1 }}>
              Discount applied:{" "}
              {discountData.discountType === "percent"
                ? `${discountData.amount}%`
                : `${discountData.amount} ${discountData.currency}`}
            </Alert>
          )}
        </Box>

        {/* Cost Breakdown */}
        {breakdown && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom color="text.primary">
              Cost Breakdown
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "text.primary" }}>Item</TableCell>
                    <TableCell align="right" sx={{ color: "text.primary" }}>
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ color: "text.primary" }}>
                      Base Cost
                    </TableCell>
                    <TableCell align="right" sx={{ color: "text.primary" }}>
                      {breakdown.baseCost.toLocaleString()} ILS
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "text.primary" }}>
                      Page Cost
                    </TableCell>
                    <TableCell align="right" sx={{ color: "text.primary" }}>
                      {breakdown.pageCost.toLocaleString()} ILS
                    </TableCell>
                  </TableRow>
                  {breakdown.totalFeatureCost > 0 && (
                    <TableRow>
                      <TableCell sx={{ color: "text.primary" }}>
                        Features
                      </TableCell>
                      <TableCell align="right" sx={{ color: "text.primary" }}>
                        {breakdown.totalFeatureCost.toLocaleString()} ILS
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell sx={{ color: "text.primary" }}>
                      Complexity Multiplier
                    </TableCell>
                    <TableCell align="right" sx={{ color: "text.primary" }}>
                      {breakdown.complexityMultiplier.toFixed(2)}x
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "text.primary" }}>
                      Timeline Multiplier
                    </TableCell>
                    <TableCell align="right" sx={{ color: "text.primary" }}>
                      {breakdown.timelineMultiplier.toFixed(2)}x
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "text.primary" }}>
                      Tech Stack Multiplier
                    </TableCell>
                    <TableCell align="right" sx={{ color: "text.primary" }}>
                      {breakdown.techStackMultiplier.toFixed(2)}x
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "text.primary" }}>
                      Client Type Multiplier
                    </TableCell>
                    <TableCell align="right" sx={{ color: "text.primary" }}>
                      {breakdown.clientTypeMultiplier.toFixed(2)}x
                    </TableCell>
                  </TableRow>
                  {breakdown.discountApplied && (
                    <TableRow>
                      <TableCell sx={{ color: "text.primary" }}>
                        <Chip
                          label={`Discount (${breakdown.discountApplied.type})`}
                          size="small"
                          color="success"
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ color: "text.primary" }}>
                        -{breakdown.discountApplied.amount}
                        {breakdown.discountApplied.type === "percent"
                          ? "%"
                          : " ILS"}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell
                      sx={{ color: "text.primary", fontWeight: "bold" }}
                    >
                      Total
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "text.primary", fontWeight: "bold" }}
                    >
                      {breakdown.total.toLocaleString()} ILS
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "text.primary" }}>Range</TableCell>
                    <TableCell align="right" sx={{ color: "text.primary" }}>
                      {breakdown.range.min.toLocaleString()} -{" "}
                      {breakdown.range.max.toLocaleString()} ILS
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
