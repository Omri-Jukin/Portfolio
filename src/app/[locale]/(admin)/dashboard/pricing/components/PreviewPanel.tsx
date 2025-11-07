"use client";

import React from "react";
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
  Alert,
  CircularProgress,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button as MuiButton } from "@mui/material";
import { usePricingContext } from "./PricingContext";

export default function PreviewPanel() {
  const {
    pricingModel,
    isLoading,
    inputs,
    setInputs,
    discountCode,
    setDiscountCode,
    discountError,
    discountData,
  } = usePricingContext();

  if (isLoading) {
    return (
      <Paper id="preview-panel" sx={{ p: 3 }}>
        <Box
          id="preview-panel-loading"
          sx={{ display: "flex", justifyContent: "center", p: 3 }}
        >
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (!pricingModel) {
    return (
      <Paper id="preview-panel-error" sx={{ p: 3 }}>
        <Alert severity="error">Failed to load pricing model</Alert>
      </Paper>
    );
  }

  const projectTypeOptions = pricingModel.projectTypes.map(
    (pt: { key: string; displayName: string }) => ({
      value: pt.key,
      label: pt.displayName,
    })
  );

  const featureOptions = pricingModel.features.map(
    (f: { key: string; displayName: string }) => ({
      value: f.key,
      label: f.displayName,
    })
  );

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
    <Paper
      id="preview-panel"
      sx={{
        p: 3,
        bgcolor: "background.paper",
        height: "fit-content",
      }}
    >
      <Typography
        id="preview-panel-title"
        variant="h6"
        gutterBottom
        color="text.primary"
      >
        Live Estimate Preview
      </Typography>
      <Typography
        id="preview-panel-description"
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Configure inputs below to see real-time cost estimates.
      </Typography>

      <Stack spacing={2}>
        {/* Proposal Configuration Accordion */}
        <Accordion
          id="preview-panel-proposal-config"
          defaultExpanded
          sx={{
            bgcolor: "background.paper",
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="proposal-config-content"
            id="proposal-config-header"
          >
            <Typography variant="subtitle1" color="text.primary">
              Proposal Configuration
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={3}>
              {/* Project Type */}
              <FormControl id="preview-panel-project-type" fullWidth>
                <InputLabel id="preview-panel-project-type-label">
                  Project Type
                </InputLabel>
                <Select
                  id="preview-panel-project-type-select"
                  value={inputs.projectTypeKey}
                  onChange={(e) =>
                    setInputs({ ...inputs, projectTypeKey: e.target.value })
                  }
                  label="Project Type"
                >
                  {projectTypeOptions.map(
                    (opt: { value: string; label: string }) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>

              {/* Number of Pages */}
              <Box id="preview-panel-number-of-pages">
                <Typography
                  id="preview-panel-number-of-pages-title"
                  gutterBottom
                  color="text.primary"
                >
                  Number of Pages: {inputs.numPages}
                </Typography>
                <Slider
                  id="preview-panel-number-of-pages-slider"
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
              <Box id="preview-panel-features">
                <Typography
                  id="preview-panel-features-title"
                  variant="subtitle2"
                  gutterBottom
                  color="text.primary"
                >
                  Features
                </Typography>
                <Stack
                  id="preview-panel-features-stack"
                  spacing={1}
                  direction="row"
                  overflow="auto"
                  sx={{ flexWrap: "wrap" }}
                >
                  {featureOptions.map(
                    (feature: { value: string; label: string }) => (
                      <FormControlLabel
                        key={feature.value}
                        id="preview-panel-features-form-control-label"
                        control={
                          <Checkbox
                            id="preview-panel-features-checkbox"
                            checked={inputs.selectedFeatureKeys.includes(
                              feature.value
                            )}
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
                    )
                  )}
                </Stack>
              </Box>

              {/* Multipliers */}
              <FormControl fullWidth>
                <InputLabel>Complexity</InputLabel>
                <Select
                  value={
                    inputs.complexityKey || complexityOptions[0]?.value || ""
                  }
                  onChange={(e) =>
                    setInputs({ ...inputs, complexityKey: e.target.value })
                  }
                  label="Complexity"
                >
                  {complexityOptions.map(
                    (opt: { value: string; label: string }) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    )
                  )}
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
                  {timelineOptions.map(
                    (opt: { value: string; label: string }) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Tech Stack</InputLabel>
                <Select
                  value={inputs.techKey || techOptions[0]?.value || ""}
                  onChange={(e) =>
                    setInputs({ ...inputs, techKey: e.target.value })
                  }
                  label="Tech Stack"
                >
                  {techOptions.map((opt: { value: string; label: string }) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Client Type</InputLabel>
                <Select
                  value={
                    inputs.clientTypeKey || clientTypeOptions[0]?.value || ""
                  }
                  onChange={(e) =>
                    setInputs({ ...inputs, clientTypeKey: e.target.value })
                  }
                  label="Client Type"
                >
                  {clientTypeOptions.map(
                    (opt: { value: string; label: string }) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>

              {/* Discount Code */}
              <Box>
                <Stack direction="row" spacing={1}>
                  <TextField
                    label="Discount Code"
                    value={discountCode}
                    onChange={(e) =>
                      setDiscountCode(e.target.value.toUpperCase())
                    }
                    fullWidth
                    error={!!discountError}
                    helperText={
                      discountError || "Enter a discount code to apply"
                    }
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
                      : `${discountData.amount} ${
                          discountData.currency || "ILS"
                        }`}
                  </Alert>
                )}
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Paper>
  );
}
