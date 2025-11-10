"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
} from "@mui/icons-material";
import { api } from "$/trpc/client";
import type { RouterOutputs } from "$/trpc/client";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Snackbar, { type SnackbarProps } from "~/Snackbar";

type Discount = RouterOutputs["proposals"]["getById"]["discounts"][0];
type Tax = RouterOutputs["proposals"]["getById"]["taxes"][0];
type Section = RouterOutputs["proposals"]["getById"]["sections"][0];
type LineItem = RouterOutputs["proposals"]["getById"]["lineItems"][0];

interface ChargesPanelProps {
  proposalId: string;
  discounts: Discount[];
  taxes: Tax[];
  sections: Section[];
  lineItems: LineItem[];
  onRefetch: () => void;
}

export default function ChargesPanel({
  proposalId,
  discounts,
  taxes,
  sections,
  lineItems,
  onRefetch,
}: ChargesPanelProps) {
  const [tabValue, setTabValue] = useState(0);
  const [discountDialogOpen, setDiscountDialogOpen] = useState(false);
  const [taxDialogOpen, setTaxDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: "",
    severity: "info",
  });

  const [discountForm, setDiscountForm] = useState({
    label: "",
    scope: "overall" as "overall" | "section" | "line",
    type: "percent" as "percent" | "fixed",
    sectionId: "",
    lineItemId: "",
    percent: "",
    amountMinor: "",
  });

  const [taxForm, setTaxForm] = useState({
    label: "",
    scope: "overall" as "overall" | "section" | "line",
    kind: "vat" as "vat" | "surcharge" | "withholding",
    type: "percent" as "percent" | "fixed",
    sectionId: "",
    lineItemId: "",
    rateOrAmount: "",
  });

  const createDiscountMutation = api.proposals.discounts.add.useMutation({
    onSuccess: () => {
      void onRefetch();
      setDiscountDialogOpen(false);
      setDiscountForm({
        label: "",
        scope: "overall",
        type: "percent",
        sectionId: "",
        lineItemId: "",
        percent: "",
        amountMinor: "",
      });
      setSnackbar({
        open: true,
        message: "Discount added successfully",
        severity: "success",
      });
    },
    onError: (error: { message?: string }) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to add discount",
        severity: "error",
      });
    },
  });

  const deleteDiscountMutation = api.proposals.discounts.delete.useMutation({
    onSuccess: () => {
      void onRefetch();
    },
  });

  const createTaxMutation = api.proposals.taxes.add.useMutation({
    onSuccess: () => {
      void onRefetch();
      setTaxDialogOpen(false);
      setTaxForm({
        label: "",
        scope: "overall",
        kind: "vat",
        type: "percent",
        sectionId: "",
        lineItemId: "",
        rateOrAmount: "",
      });
      setSnackbar({
        open: true,
        message: "Tax added successfully",
        severity: "success",
      });
    },
    onError: (error: { message?: string }) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to add tax",
        severity: "error",
      });
    },
  });

  const deleteTaxMutation = api.proposals.taxes.delete.useMutation({
    onSuccess: () => {
      void onRefetch();
    },
  });

  const reorderTaxesMutation = api.proposals.taxes.reorder.useMutation({
    onSuccess: () => {
      void onRefetch();
    },
  });

  const sortedTaxes = [...taxes].sort((a, b) => a.orderIndex - b.orderIndex);

  const handleTaxDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortedTaxes.findIndex((t) => t.id === active.id);
    const newIndex = sortedTaxes.findIndex((t) => t.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newTaxes = arrayMove(sortedTaxes, oldIndex, newIndex);
      reorderTaxesMutation.mutate({
        proposalId,
        taxOrders: newTaxes.map((t, idx) => ({
          id: t.id,
          orderIndex: idx,
        })),
      });
    }
  };

  function SortableTaxItem({
    tax,
    children,
  }: {
    tax: Tax;
    children: React.ReactNode;
  }) {
    const {
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
      isDragging,
      attributes,
      listeners,
    } = useSortable({ id: tax.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <ListItem
        ref={setNodeRef}
        style={style}
        sx={{
          boxShadow: isDragging ? 2 : 0,
          bgcolor: isDragging ? "action.hover" : "transparent",
        }}
      >
        <Box
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          sx={{
            cursor: "grab",
            color: "text.secondary",
            mr: 1,
            display: "flex",
            alignItems: "center",
            "&:active": {
              cursor: "grabbing",
            },
            touchAction: "none",
          }}
        >
          <DragIndicatorIcon fontSize="small" />
        </Box>
        {children}
      </ListItem>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Charges
        </Typography>

        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="Discounts" />
          <Tab label="Taxes" />
        </Tabs>

        {tabValue === 0 && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
              <Button
                startIcon={<AddIcon />}
                size="small"
                onClick={() => setDiscountDialogOpen(true)}
              >
                Add Discount
              </Button>
            </Box>
            {discounts.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No discounts applied
              </Typography>
            ) : (
              <List dense>
                {discounts.map((discount) => (
                  <ListItem
                    key={discount.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() =>
                          deleteDiscountMutation.mutate({ id: discount.id })
                        }
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={discount.label}
                      secondary={`${discount.scope} - ${
                        discount.type === "percent"
                          ? `${discount.percent}%`
                          : `${(discount.amountMinor || 0) / 100}`
                      }`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
              <Button
                startIcon={<AddIcon />}
                size="small"
                onClick={() => setTaxDialogOpen(true)}
              >
                Add Tax
              </Button>
            </Box>
            {taxes.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No taxes applied
              </Typography>
            ) : (
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleTaxDragEnd}
              >
                <SortableContext
                  items={sortedTaxes.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <List dense>
                    {sortedTaxes.map((tax) => (
                      <SortableTaxItem key={tax.id} tax={tax}>
                        <ListItemText
                          primary={tax.label}
                          secondary={`${tax.kind} - ${
                            tax.type === "percent"
                              ? `${tax.rateOrAmount}%`
                              : `${tax.rateOrAmount}`
                          }`}
                        />
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() =>
                            deleteTaxMutation.mutate({ id: tax.id })
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </SortableTaxItem>
                    ))}
                  </List>
                </SortableContext>
              </DndContext>
            )}
          </Box>
        )}

        {/* Add Discount Dialog */}
        <Dialog
          open={discountDialogOpen}
          onClose={() => setDiscountDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Add Discount</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Label"
                fullWidth
                required
                value={discountForm.label}
                onChange={(e) =>
                  setDiscountForm({ ...discountForm, label: e.target.value })
                }
              />

              <FormControl fullWidth>
                <InputLabel>Scope</InputLabel>
                <Select
                  value={discountForm.scope}
                  label="Scope"
                  onChange={(e) =>
                    setDiscountForm({
                      ...discountForm,
                      scope: e.target.value as "overall" | "section" | "line",
                      sectionId: "",
                      lineItemId: "",
                    })
                  }
                >
                  <MenuItem value="overall">Overall</MenuItem>
                  <MenuItem value="section">Section</MenuItem>
                  <MenuItem value="line">Line Item</MenuItem>
                </Select>
              </FormControl>

              {discountForm.scope === "section" && (
                <FormControl fullWidth>
                  <InputLabel>Section</InputLabel>
                  <Select
                    value={discountForm.sectionId}
                    label="Section"
                    onChange={(e) =>
                      setDiscountForm({
                        ...discountForm,
                        sectionId: e.target.value,
                      })
                    }
                  >
                    {sections.map((section) => (
                      <MenuItem key={section.id} value={section.id}>
                        {section.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {discountForm.scope === "line" && (
                <FormControl fullWidth>
                  <InputLabel>Line Item</InputLabel>
                  <Select
                    value={discountForm.lineItemId}
                    label="Line Item"
                    onChange={(e) =>
                      setDiscountForm({
                        ...discountForm,
                        lineItemId: e.target.value,
                      })
                    }
                  >
                    {lineItems.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={discountForm.type}
                  label="Type"
                  onChange={(e) =>
                    setDiscountForm({
                      ...discountForm,
                      type: e.target.value as "percent" | "fixed",
                      percent: "",
                      amountMinor: "",
                    })
                  }
                >
                  <MenuItem value="percent">Percent</MenuItem>
                  <MenuItem value="fixed">Fixed Amount</MenuItem>
                </Select>
              </FormControl>

              {discountForm.type === "percent" ? (
                <TextField
                  label="Percent (%)"
                  type="number"
                  fullWidth
                  required
                  value={discountForm.percent}
                  onChange={(e) =>
                    setDiscountForm({
                      ...discountForm,
                      percent: e.target.value,
                    })
                  }
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                />
              ) : (
                <TextField
                  label="Amount"
                  type="number"
                  fullWidth
                  required
                  value={discountForm.amountMinor}
                  onChange={(e) =>
                    setDiscountForm({
                      ...discountForm,
                      amountMinor: e.target.value,
                    })
                  }
                  inputProps={{ min: 0, step: 0.01 }}
                  helperText="Amount in major units (e.g., 100 for 100.00)"
                />
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDiscountDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (!discountForm.label.trim()) {
                  setSnackbar({
                    open: true,
                    message: "Label is required",
                    severity: "error",
                  });
                  return;
                }

                if (
                  discountForm.type === "percent" &&
                  (!discountForm.percent ||
                    parseFloat(discountForm.percent) <= 0)
                ) {
                  setSnackbar({
                    open: true,
                    message: "Valid percent is required",
                    severity: "error",
                  });
                  return;
                }

                if (
                  discountForm.type === "fixed" &&
                  (!discountForm.amountMinor ||
                    parseFloat(discountForm.amountMinor) <= 0)
                ) {
                  setSnackbar({
                    open: true,
                    message: "Valid amount is required",
                    severity: "error",
                  });
                  return;
                }

                createDiscountMutation.mutate({
                  proposalId,
                  label: discountForm.label,
                  scope: discountForm.scope,
                  type: discountForm.type,
                  sectionId:
                    discountForm.scope === "section" && discountForm.sectionId
                      ? discountForm.sectionId
                      : null,
                  lineItemId:
                    discountForm.scope === "line" && discountForm.lineItemId
                      ? discountForm.lineItemId
                      : null,
                  percent:
                    discountForm.type === "percent"
                      ? parseFloat(discountForm.percent)
                      : null,
                  amountMinor:
                    discountForm.type === "fixed"
                      ? Math.round(parseFloat(discountForm.amountMinor) * 100)
                      : null,
                });
              }}
              variant="contained"
              disabled={createDiscountMutation.isPending}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Tax Dialog */}
        <Dialog
          open={taxDialogOpen}
          onClose={() => setTaxDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Add Tax</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Label"
                fullWidth
                required
                value={taxForm.label}
                onChange={(e) =>
                  setTaxForm({ ...taxForm, label: e.target.value })
                }
              />

              <FormControl fullWidth>
                <InputLabel>Kind</InputLabel>
                <Select
                  value={taxForm.kind}
                  label="Kind"
                  onChange={(e) =>
                    setTaxForm({
                      ...taxForm,
                      kind: e.target.value as
                        | "vat"
                        | "surcharge"
                        | "withholding",
                    })
                  }
                >
                  <MenuItem value="vat">VAT</MenuItem>
                  <MenuItem value="surcharge">Surcharge</MenuItem>
                  <MenuItem value="withholding">Withholding</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Scope</InputLabel>
                <Select
                  value={taxForm.scope}
                  label="Scope"
                  onChange={(e) =>
                    setTaxForm({
                      ...taxForm,
                      scope: e.target.value as "overall" | "section" | "line",
                      sectionId: "",
                      lineItemId: "",
                    })
                  }
                >
                  <MenuItem value="overall">Overall</MenuItem>
                  <MenuItem value="section">Section</MenuItem>
                  <MenuItem value="line">Line Item</MenuItem>
                </Select>
              </FormControl>

              {taxForm.scope === "section" && (
                <FormControl fullWidth>
                  <InputLabel>Section</InputLabel>
                  <Select
                    value={taxForm.sectionId}
                    label="Section"
                    onChange={(e) =>
                      setTaxForm({ ...taxForm, sectionId: e.target.value })
                    }
                  >
                    {sections.map((section) => (
                      <MenuItem key={section.id} value={section.id}>
                        {section.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {taxForm.scope === "line" && (
                <FormControl fullWidth>
                  <InputLabel>Line Item</InputLabel>
                  <Select
                    value={taxForm.lineItemId}
                    label="Line Item"
                    onChange={(e) =>
                      setTaxForm({ ...taxForm, lineItemId: e.target.value })
                    }
                  >
                    {lineItems.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={taxForm.type}
                  label="Type"
                  onChange={(e) =>
                    setTaxForm({
                      ...taxForm,
                      type: e.target.value as "percent" | "fixed",
                    })
                  }
                >
                  <MenuItem value="percent">Percent</MenuItem>
                  <MenuItem value="fixed">Fixed Amount</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label={taxForm.type === "percent" ? "Rate (%)" : "Amount"}
                type="number"
                fullWidth
                required
                value={taxForm.rateOrAmount}
                onChange={(e) =>
                  setTaxForm({ ...taxForm, rateOrAmount: e.target.value })
                }
                inputProps={{
                  min: 0,
                  step: taxForm.type === "percent" ? 0.01 : 0.01,
                }}
                helperText={
                  taxForm.type === "fixed"
                    ? "Amount in major units (e.g., 100 for 100.00)"
                    : undefined
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTaxDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (!taxForm.label.trim()) {
                  setSnackbar({
                    open: true,
                    message: "Label is required",
                    severity: "error",
                  });
                  return;
                }

                if (
                  !taxForm.rateOrAmount ||
                  parseFloat(taxForm.rateOrAmount) <= 0
                ) {
                  setSnackbar({
                    open: true,
                    message: "Valid rate/amount is required",
                    severity: "error",
                  });
                  return;
                }

                const rateOrAmount = parseFloat(taxForm.rateOrAmount);
                const finalRateOrAmount =
                  taxForm.type === "fixed"
                    ? Math.round(rateOrAmount * 100)
                    : rateOrAmount;

                createTaxMutation.mutate({
                  proposalId,
                  label: taxForm.label,
                  kind: taxForm.kind,
                  scope: taxForm.scope,
                  type: taxForm.type,
                  sectionId:
                    taxForm.scope === "section" && taxForm.sectionId
                      ? taxForm.sectionId
                      : null,
                  lineItemId:
                    taxForm.scope === "line" && taxForm.lineItemId
                      ? taxForm.lineItemId
                      : null,
                  rateOrAmount: finalRateOrAmount,
                  orderIndex: taxes.length,
                });
              }}
              variant="contained"
              disabled={createTaxMutation.isPending}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </CardContent>
    </Card>
  );
}
