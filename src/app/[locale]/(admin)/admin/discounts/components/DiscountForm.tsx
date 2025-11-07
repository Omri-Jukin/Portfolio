"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Autocomplete,
  Chip,
  Typography,
  Alert,
  Box,
} from "@mui/material";
import { api, type RouterOutputs } from "$/trpc/client";

type Discount = RouterOutputs["discounts"]["getAll"][0];

interface DiscountFormProps {
  open: boolean;
  onClose: () => void;
  discount?: Discount | null;
  onSuccess: () => void;
}

export default function DiscountForm({
  open,
  onClose,
  discount,
  onSuccess,
}: DiscountFormProps) {
  const [formData, setFormData] = useState<{
    code: string;
    description: string;
    discountType: "percent" | "fixed";
    amount: number;
    currency: string;
    appliesTo: {
      projectTypes: string[];
      features: string[];
      clientTypes: string[];
      excludeClientTypes: string[];
    };
    startsAt: string;
    endsAt: string;
    maxUses: string;
    perUserLimit: number;
    isActive: boolean;
  }>({
    code: "",
    description: "",
    discountType: "percent",
    amount: 0,
    currency: "ILS",
    appliesTo: {
      projectTypes: [],
      features: [],
      clientTypes: [],
      excludeClientTypes: [],
    },
    startsAt: "",
    endsAt: "",
    maxUses: "",
    perUserLimit: 1,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch pricing model for autocomplete options
  const { data: pricingModel } = api.pricing.getModel.useQuery();

  const checkCodeUnique = api.discounts.checkCodeUnique.useQuery(
    {
      code: formData.code,
      excludeId: discount?.id,
    },
    { enabled: formData.code.length > 0 && open }
  );

  const createMutation = api.discounts.create.useMutation({
    onSuccess: () => {
      onSuccess();
      handleClose();
    },
    onError: (error) => {
      setErrors({ submit: error.message });
    },
  });

  const updateMutation = api.discounts.update.useMutation({
    onSuccess: () => {
      onSuccess();
      handleClose();
    },
    onError: (error) => {
      setErrors({ submit: error.message });
    },
  });

  useEffect(() => {
    if (discount) {
      setFormData({
        code: discount.code,
        description: discount.description || "",
        discountType: discount.discountType as "percent" | "fixed",
        amount: discount.amount,
        currency: discount.currency,
        appliesTo: {
          projectTypes: discount.appliesTo.projectTypes || [],
          features: discount.appliesTo.features || [],
          clientTypes: discount.appliesTo.clientTypes || [],
          excludeClientTypes: discount.appliesTo.excludeClientTypes || [],
        },
        startsAt: discount.startsAt
          ? new Date(discount.startsAt).toISOString().slice(0, 16)
          : "",
        endsAt: discount.endsAt
          ? new Date(discount.endsAt).toISOString().slice(0, 16)
          : "",
        maxUses: discount.maxUses?.toString() || "",
        perUserLimit: discount.perUserLimit,
        isActive: discount.isActive,
      });
    } else {
      setFormData({
        code: "",
        description: "",
        discountType: "percent",
        amount: 0,
        currency: "ILS",
        appliesTo: {
          projectTypes: [],
          features: [],
          clientTypes: [],
          excludeClientTypes: [],
        },
        startsAt: "",
        endsAt: "",
        maxUses: "",
        perUserLimit: 1,
        isActive: true,
      });
    }
    setErrors({});
  }, [discount, open]);

  const handleClose = () => {
    setFormData({
      code: "",
      description: "",
      discountType: "percent",
      amount: 0,
      currency: "ILS",
      appliesTo: {
        projectTypes: [],
        features: [],
        clientTypes: [],
        excludeClientTypes: [],
      },
      startsAt: "",
      endsAt: "",
      maxUses: "",
      perUserLimit: 1,
      isActive: true,
    });
    setErrors({});
    onClose();
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Code is required";
    } else if (
      checkCodeUnique.data &&
      !checkCodeUnique.data.isUnique &&
      formData.code.length > 0
    ) {
      newErrors.code = "Code already exists";
    }

    if (formData.amount <= 0) {
      newErrors.amount = "Amount must be positive";
    }

    if (formData.discountType === "percent" && formData.amount > 100) {
      newErrors.amount = "Percent discount cannot exceed 100%";
    }

    if (formData.startsAt && formData.endsAt) {
      const start = new Date(formData.startsAt);
      const end = new Date(formData.endsAt);
      if (start >= end) {
        newErrors.endsAt = "End date must be after start date";
      }
    }

    if (formData.maxUses && Number(formData.maxUses) <= 0) {
      newErrors.maxUses = "Max uses must be positive";
    }

    if (formData.perUserLimit <= 0) {
      newErrors.perUserLimit = "Per user limit must be positive";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const submitData = {
      code: formData.code.toUpperCase().trim(),
      description: formData.description || undefined,
      discountType: formData.discountType,
      amount: formData.amount,
      currency: formData.currency,
      appliesTo: formData.appliesTo,
      startsAt: formData.startsAt ? new Date(formData.startsAt) : undefined,
      endsAt: formData.endsAt ? new Date(formData.endsAt) : undefined,
      maxUses: formData.maxUses ? Number(formData.maxUses) : undefined,
      perUserLimit: formData.perUserLimit,
      isActive: formData.isActive,
    };

    if (discount) {
      updateMutation.mutate({
        id: discount.id,
        ...submitData,
      });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const projectTypeOptions =
    pricingModel?.projectTypes.map((pt) => pt.key) || [];
  const featureOptions = pricingModel?.features.map((f) => f.key) || [];
  const clientTypeOptions =
    pricingModel?.multiplierGroups
      .find((g) => g.key === "clientType")
      ?.options.map((o) => o.optionKey) || [];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {discount ? "Edit Discount" : "Create Discount"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {errors.submit && <Alert severity="error">{errors.submit}</Alert>}

          <TextField
            label="Code"
            value={formData.code}
            onChange={(e) =>
              setFormData({ ...formData, code: e.target.value.toUpperCase() })
            }
            error={!!errors.code}
            helperText={errors.code}
            required
            fullWidth
          />

          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            multiline
            rows={2}
            fullWidth
          />

          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Discount Type</InputLabel>
              <Select
                value={formData.discountType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountType: e.target.value as "percent" | "fixed",
                  })
                }
                label="Discount Type"
              >
                <MenuItem value="percent">Percent (%)</MenuItem>
                <MenuItem value="fixed">Fixed Amount</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label={
                formData.discountType === "percent" ? "Amount (%)" : "Amount"
              }
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: Number(e.target.value),
                })
              }
              error={!!errors.amount}
              helperText={errors.amount}
              required
              fullWidth
              inputProps={{
                min: 0,
                max: formData.discountType === "percent" ? 100 : undefined,
                step: formData.discountType === "percent" ? 0.1 : 1,
              }}
            />

            {formData.discountType === "fixed" && (
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  label="Currency"
                >
                  <MenuItem value="ILS">ILS</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                </Select>
              </FormControl>
            )}
          </Stack>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Applies To
            </Typography>
            <Stack spacing={2}>
              <Autocomplete
                multiple
                options={projectTypeOptions}
                value={formData.appliesTo.projectTypes || []}
                onChange={(_, newValue) =>
                  setFormData({
                    ...formData,
                    appliesTo: {
                      ...formData.appliesTo,
                      projectTypes: newValue,
                    },
                  })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Project Types" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                    />
                  ))
                }
              />

              <Autocomplete
                multiple
                options={featureOptions}
                value={formData.appliesTo.features || []}
                onChange={(_, newValue) =>
                  setFormData({
                    ...formData,
                    appliesTo: {
                      ...formData.appliesTo,
                      features: newValue,
                    },
                  })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Features" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                    />
                  ))
                }
              />

              <Autocomplete
                multiple
                options={clientTypeOptions}
                value={formData.appliesTo.clientTypes || []}
                onChange={(_, newValue) =>
                  setFormData({
                    ...formData,
                    appliesTo: {
                      ...formData.appliesTo,
                      clientTypes: newValue,
                    },
                  })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Client Types" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                    />
                  ))
                }
              />

              <Autocomplete
                multiple
                options={clientTypeOptions}
                value={formData.appliesTo.excludeClientTypes || []}
                onChange={(_, newValue) =>
                  setFormData({
                    ...formData,
                    appliesTo: {
                      ...formData.appliesTo,
                      excludeClientTypes: newValue,
                    },
                  })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Exclude Client Types" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                    />
                  ))
                }
              />
            </Stack>
          </Box>

          <Stack direction="row" spacing={2}>
            <TextField
              label="Start Date"
              type="datetime-local"
              value={formData.startsAt}
              onChange={(e) =>
                setFormData({ ...formData, startsAt: e.target.value })
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="End Date"
              type="datetime-local"
              value={formData.endsAt}
              onChange={(e) =>
                setFormData({ ...formData, endsAt: e.target.value })
              }
              error={!!errors.endsAt}
              helperText={errors.endsAt}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              label="Max Uses"
              type="number"
              value={formData.maxUses}
              onChange={(e) =>
                setFormData({ ...formData, maxUses: e.target.value })
              }
              error={!!errors.maxUses}
              helperText={errors.maxUses || "Leave empty for unlimited"}
              fullWidth
              inputProps={{ min: 1 }}
            />

            <TextField
              label="Per User Limit"
              type="number"
              value={formData.perUserLimit}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  perUserLimit: Number(e.target.value),
                })
              }
              error={!!errors.perUserLimit}
              helperText={errors.perUserLimit}
              required
              fullWidth
              inputProps={{ min: 1 }}
            />
          </Stack>

          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
            }
            label="Active"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {discount ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
