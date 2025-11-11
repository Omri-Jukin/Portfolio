"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Checkbox,
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
  FormControlLabel,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  DragIndicator as DragIndicatorIcon,
} from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
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

type Section = RouterOutputs["proposals"]["getById"]["sections"][0];
type LineItem = RouterOutputs["proposals"]["getById"]["lineItems"][0];

interface ContentBuilderProps {
  proposalId: string;
  sections: Section[];
  lineItems: LineItem[];
  onRefetch: () => void;
}

export default function ContentBuilder({
  proposalId,
  sections,
  lineItems,
  onRefetch,
}: ContentBuilderProps) {
  const createSectionMutation = api.proposals.sections.create.useMutation({
    onSuccess: () => {
      void onRefetch();
    },
  });

  const createLineItemMutation = api.proposals.lineItems.create.useMutation({
    onSuccess: () => {
      void onRefetch();
    },
  });

  const deleteSectionMutation = api.proposals.sections.delete.useMutation({
    onSuccess: () => {
      void onRefetch();
    },
  });

  const deleteLineItemMutation = api.proposals.lineItems.delete.useMutation({
    onSuccess: () => {
      void onRefetch();
    },
  });

  const updateLineItemMutation = api.proposals.lineItems.update.useMutation({
    onSuccess: () => {
      void onRefetch();
      setLineItemDialogOpen(false);
      setEditingLineItem(null);
      setSnackbar({
        open: true,
        message: "Line item updated successfully",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update line item",
        severity: "error",
      });
    },
  });

  const [lineItemDialogOpen, setLineItemDialogOpen] = useState(false);
  const [addLineItemDialogOpen, setAddLineItemDialogOpen] = useState(false);
  const [addLineItemSectionId, setAddLineItemSectionId] = useState<
    string | null
  >(null);
  const [addLineItemTab, setAddLineItemTab] = useState(0);
  const [editingLineItem, setEditingLineItem] = useState<LineItem | null>(null);
  const [lineItemForm, setLineItemForm] = useState({
    label: "",
    description: "",
    quantity: "1",
    unitPriceMinor: "0",
    isOptional: false,
    isSelected: true,
    taxClass: "",
    featureKey: "",
  });
  const [customItemForm, setCustomItemForm] = useState({
    label: "",
    description: "",
    quantity: "1",
    unitPriceMinor: "0",
  });
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: "",
    severity: "info",
  });

  const reorderSectionsMutation = api.proposals.sections.reorder.useMutation({
    onSuccess: () => {
      void onRefetch();
    },
  });

  const sortedSections = [...sections].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortedSections.findIndex((s) => s.id === active.id);
    const newIndex = sortedSections.findIndex((s) => s.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newSections = arrayMove(sortedSections, oldIndex, newIndex);
      reorderSectionsMutation.mutate({
        proposalId,
        sectionOrders: newSections.map((s, idx) => ({
          id: s.id,
          sortOrder: idx,
        })),
      });
    }
  };

  function SortableSection({
    section,
    children,
  }: {
    section: Section;
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
    } = useSortable({ id: section.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <Box
        ref={setNodeRef}
        style={style}
        sx={{
          mb: 3,
          position: "relative",
          boxShadow: isDragging ? 6 : 0,
        }}
      >
        <Box
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          sx={{
            position: "absolute",
            left: -30,
            top: 0,
            cursor: "grab",
            color: "text.secondary",
            display: "flex",
            alignItems: "center",
            height: "100%",
            "&:active": {
              cursor: "grabbing",
            },
            touchAction: "none",
          }}
        >
          <DragIndicatorIcon />
        </Box>
        {children}
      </Box>
    );
  }

  const handleAddSection = () => {
    createSectionMutation.mutate({
      proposalId,
      key: `section-${Date.now()}`,
      label: "New Section",
      sortOrder: sections.length,
    });
  };

  const handleAddLineItem = (sectionId?: string | null) => {
    setAddLineItemSectionId(sectionId || null);
    setAddLineItemDialogOpen(true);
    setAddLineItemTab(0);
    setCustomItemForm({
      label: "",
      description: "",
      quantity: "1",
      unitPriceMinor: "0",
    });
  };

  const { data: proposal } = api.proposals.getById.useQuery(
    { id: proposalId },
    { enabled: !!proposalId }
  );

  const { data: projectTypes } = api.pricing.projectTypes.getAll.useQuery({
    includeInactive: false,
  });
  const { data: features } = api.pricing.features.getAll.useQuery({
    includeInactive: false,
  });

  const handleSelectPricingItem = (item: {
    label: string;
    unitPriceMinor: number;
    featureKey?: string;
    description?: string;
  }) => {
    createLineItemMutation.mutate({
      proposalId,
      sectionId: addLineItemSectionId,
      label: item.label,
      description: item.description || null,
      quantity: 1,
      unitPriceMinor: item.unitPriceMinor,
      featureKey: item.featureKey || null,
    });
    setAddLineItemDialogOpen(false);
  };

  const handleCreateCustomItem = () => {
    if (!customItemForm.label.trim()) {
      setSnackbar({
        open: true,
        message: "Label is required",
        severity: "error",
      });
      return;
    }

    createLineItemMutation.mutate({
      proposalId,
      sectionId: addLineItemSectionId,
      label: customItemForm.label,
      description: customItemForm.description || null,
      quantity: parseFloat(customItemForm.quantity) || 1,
      unitPriceMinor: Math.round(
        parseFloat(customItemForm.unitPriceMinor) * 100
      ),
    });
    setAddLineItemDialogOpen(false);
  };

  const getSectionLineItems = (sectionId: string) => {
    return lineItems.filter((li: LineItem) => li.sectionId === sectionId);
  };

  const getUnsectionedLineItems = () => {
    return lineItems.filter((li: LineItem) => !li.sectionId);
  };

  const handleEditLineItem = (item: LineItem) => {
    setEditingLineItem(item);
    setLineItemForm({
      label: item.label,
      description: item.description || "",
      quantity: Number(item.quantity).toString(),
      unitPriceMinor: (item.unitPriceMinor / 100).toString(),
      isOptional: item.isOptional,
      isSelected: item.isSelected,
      taxClass: item.taxClass || "",
      featureKey: item.featureKey || "",
    });
    setLineItemDialogOpen(true);
  };

  const handleSaveLineItem = () => {
    if (!lineItemForm.label.trim()) {
      setSnackbar({
        open: true,
        message: "Label is required",
        severity: "error",
      });
      return;
    }

    if (!editingLineItem) return;

    updateLineItemMutation.mutate({
      id: editingLineItem.id,
      data: {
        label: lineItemForm.label,
        description: lineItemForm.description || null,
        quantity: parseFloat(lineItemForm.quantity) || 1,
        unitPriceMinor: Math.round(
          parseFloat(lineItemForm.unitPriceMinor) * 100
        ),
        isOptional: lineItemForm.isOptional,
        isSelected: lineItemForm.isSelected,
        taxClass: lineItemForm.taxClass || null,
      },
    });
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h6" gutterBottom={false}>
              Content Builder
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Organize your proposal with sections and line items
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSection}
            size="small"
          >
            Add Section
          </Button>
        </Box>

        {sections.length === 0 && getUnsectionedLineItems().length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              px: 2,
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Typography variant="body1" color="text.secondary" gutterBottom>
              No content yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add a section to start building your proposal
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddSection}
              size="small"
            >
              Create First Section
            </Button>
          </Box>
        )}

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedSections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedSections.map((section) => {
              const sectionItems = getSectionLineItems(section.id);
              return (
                <SortableSection key={section.id} section={section}>
                  <Card variant="outlined" sx={{ pl: 4, position: "relative" }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: sectionItems.length > 0 ? 2 : 0,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {section.label}
                          </Typography>
                          {section.description && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ mt: 0.5, display: "block" }}
                            >
                              {section.description}
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Tooltip title="Add line item">
                            <IconButton
                              size="small"
                              onClick={() => handleAddLineItem(section.id)}
                              color="primary"
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete section">
                            <IconButton
                              size="small"
                              onClick={() =>
                                deleteSectionMutation.mutate({ id: section.id })
                              }
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      {sectionItems.length > 0 && (
                        <Table size="small" sx={{ mt: 2 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "medium" }}>
                                Item
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{ fontWeight: "medium" }}
                              >
                                Qty
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{ fontWeight: "medium" }}
                              >
                                Unit Price
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{ fontWeight: "medium" }}
                              >
                                Total
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ fontWeight: "medium" }}
                              >
                                Optional
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ fontWeight: "medium" }}
                              >
                                Actions
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {sectionItems.map((item) => (
                              <TableRow key={item.id} hover>
                                <TableCell>
                                  <Typography variant="body2">
                                    {item.label}
                                  </Typography>
                                  {item.description && (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      display="block"
                                    >
                                      {item.description}
                                    </Typography>
                                  )}
                                </TableCell>
                                <TableCell align="right">
                                  {Number(item.quantity)}
                                </TableCell>
                                <TableCell align="right">
                                  {(item.unitPriceMinor / 100).toFixed(2)}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ fontWeight: "medium" }}
                                >
                                  {(
                                    (Number(item.quantity) *
                                      item.unitPriceMinor) /
                                    100
                                  ).toFixed(2)}
                                </TableCell>
                                <TableCell align="center">
                                  <Checkbox
                                    checked={item.isOptional}
                                    size="small"
                                    disabled
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: 0.5,
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Tooltip title="Edit">
                                      <IconButton
                                        size="small"
                                        onClick={() => handleEditLineItem(item)}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          deleteLineItemMutation.mutate({
                                            id: item.id,
                                          })
                                        }
                                        color="error"
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                      {sectionItems.length === 0 && (
                        <Box
                          sx={{
                            textAlign: "center",
                            py: 2,
                            border: "1px dashed",
                            borderColor: "divider",
                            borderRadius: 1,
                            mt: 2,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            No items in this section
                          </Typography>
                          <Button
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => handleAddLineItem(section.id)}
                            sx={{ mt: 1 }}
                          >
                            Add Item
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </SortableSection>
              );
            })}
          </SortableContext>
        </DndContext>

        {/* Edit Line Item Dialog */}
        <Dialog
          open={lineItemDialogOpen}
          onClose={() => {
            setLineItemDialogOpen(false);
            setEditingLineItem(null);
          }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit Line Item</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Label"
                fullWidth
                required
                value={lineItemForm.label}
                onChange={(e) =>
                  setLineItemForm({ ...lineItemForm, label: e.target.value })
                }
              />

              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={lineItemForm.description}
                onChange={(e) =>
                  setLineItemForm({
                    ...lineItemForm,
                    description: e.target.value,
                  })
                }
              />

              <TextField
                label="Quantity"
                type="number"
                fullWidth
                required
                value={lineItemForm.quantity}
                onChange={(e) =>
                  setLineItemForm({ ...lineItemForm, quantity: e.target.value })
                }
                inputProps={{ min: 0, step: 0.01 }}
              />

              <TextField
                label="Unit Price"
                type="number"
                fullWidth
                required
                value={lineItemForm.unitPriceMinor}
                onChange={(e) =>
                  setLineItemForm({
                    ...lineItemForm,
                    unitPriceMinor: e.target.value,
                  })
                }
                inputProps={{ min: 0, step: 0.01 }}
                helperText="Price in major units (e.g., 100 for 100.00)"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={lineItemForm.isOptional}
                    onChange={(e) =>
                      setLineItemForm({
                        ...lineItemForm,
                        isOptional: e.target.checked,
                      })
                    }
                  />
                }
                label="Optional"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={lineItemForm.isSelected}
                    onChange={(e) =>
                      setLineItemForm({
                        ...lineItemForm,
                        isSelected: e.target.checked,
                      })
                    }
                  />
                }
                label="Selected"
              />

              <FormControl fullWidth>
                <InputLabel>Tax Class</InputLabel>
                <Select
                  value={lineItemForm.taxClass}
                  label="Tax Class"
                  onChange={(e) =>
                    setLineItemForm({
                      ...lineItemForm,
                      taxClass: e.target.value,
                    })
                  }
                >
                  <MenuItem value="">Standard</MenuItem>
                  <MenuItem value="zero">Zero</MenuItem>
                  <MenuItem value="exempt">Exempt</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setLineItemDialogOpen(false);
                setEditingLineItem(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveLineItem}
              variant="contained"
              disabled={updateLineItemMutation.isPending}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Line Item Dialog */}
        <Dialog
          open={addLineItemDialogOpen}
          onClose={() => setAddLineItemDialogOpen(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Add Line Item</DialogTitle>
          <DialogContent>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
              <Tabs
                value={addLineItemTab}
                onChange={(_, newValue) => setAddLineItemTab(newValue)}
              >
                <Tab label="From Pricing Tables" />
                <Tab label="Custom Billing Item" />
              </Tabs>
            </Box>

            {addLineItemTab === 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                  Project Types
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {projectTypes && projectTypes.length > 0 ? (
                    <Stack spacing={1}>
                      {projectTypes.map((pt) => (
                        <Card
                          key={pt.key}
                          variant="outlined"
                          sx={{
                            cursor: "pointer",
                            "&:hover": { bgcolor: "action.hover" },
                          }}
                          onClick={() =>
                            handleSelectPricingItem({
                              label: pt.displayName,
                              unitPriceMinor: Math.round(pt.baseRateIls * 100),
                              featureKey: pt.key,
                              description: `Base rate for ${pt.displayName.toLowerCase()}`,
                            })
                          }
                        >
                          <CardContent>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Box>
                                <Typography variant="body1" fontWeight="medium">
                                  {pt.displayName}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {pt.key}
                                </Typography>
                              </Box>
                              <Typography variant="h6" color="primary">
                                {proposal?.proposal?.currency || "ILS"}{" "}
                                {pt.baseRateIls.toLocaleString()}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  ) : (
                    <Typography color="text.secondary">
                      No project types available
                    </Typography>
                  )}
                </Box>

                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ mb: 2, mt: 3 }}
                >
                  Features
                </Typography>
                <Box>
                  {features && features.length > 0 ? (
                    <Stack spacing={1}>
                      {features.map((feature) => (
                        <Card
                          key={feature.key}
                          variant="outlined"
                          sx={{
                            cursor: "pointer",
                            "&:hover": { bgcolor: "action.hover" },
                          }}
                          onClick={() =>
                            handleSelectPricingItem({
                              label: feature.displayName,
                              unitPriceMinor: Math.round(
                                feature.defaultCostIls * 100
                              ),
                              featureKey: feature.key,
                              description: `Feature: ${feature.displayName}`,
                            })
                          }
                        >
                          <CardContent>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Box>
                                <Typography variant="body1" fontWeight="medium">
                                  {feature.displayName}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {feature.key}
                                </Typography>
                              </Box>
                              <Typography variant="h6" color="primary">
                                {proposal?.proposal?.currency || "ILS"}{" "}
                                {feature.defaultCostIls.toLocaleString()}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  ) : (
                    <Typography color="text.secondary">
                      No features available
                    </Typography>
                  )}
                </Box>
              </Box>
            )}

            {addLineItemTab === 1 && (
              <Stack spacing={2}>
                <TextField
                  label="Label"
                  fullWidth
                  required
                  value={customItemForm.label}
                  onChange={(e) =>
                    setCustomItemForm({
                      ...customItemForm,
                      label: e.target.value,
                    })
                  }
                />

                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={2}
                  value={customItemForm.description}
                  onChange={(e) =>
                    setCustomItemForm({
                      ...customItemForm,
                      description: e.target.value,
                    })
                  }
                />

                <TextField
                  label="Quantity"
                  type="number"
                  fullWidth
                  required
                  value={customItemForm.quantity}
                  onChange={(e) =>
                    setCustomItemForm({
                      ...customItemForm,
                      quantity: e.target.value,
                    })
                  }
                  inputProps={{ min: 0, step: 0.01 }}
                />

                <TextField
                  label="Unit Price"
                  type="number"
                  fullWidth
                  required
                  value={customItemForm.unitPriceMinor}
                  onChange={(e) =>
                    setCustomItemForm({
                      ...customItemForm,
                      unitPriceMinor: e.target.value,
                    })
                  }
                  inputProps={{ min: 0, step: 0.01 }}
                  helperText="Price in major units (e.g., 100 for 100.00)"
                />
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddLineItemDialogOpen(false)}>
              Cancel
            </Button>
            {addLineItemTab === 1 && (
              <Button
                onClick={handleCreateCustomItem}
                variant="contained"
                disabled={createLineItemMutation.isPending}
              >
                Add Item
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {getUnsectionedLineItems().length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Card variant="outlined">
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Unsectioned Items
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Items not assigned to any section
                    </Typography>
                  </Box>
                </Box>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "medium" }}>Label</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "medium" }}>
                        Qty
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "medium" }}>
                        Unit Price
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "medium" }}>
                        Total
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "medium" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getUnsectionedLineItems().map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>
                          <Typography variant="body2">{item.label}</Typography>
                          {item.description && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              {item.description}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {Number(item.quantity)}
                        </TableCell>
                        <TableCell align="right">
                          {(item.unitPriceMinor / 100).toFixed(2)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "medium" }}>
                          {(
                            (Number(item.quantity) * item.unitPriceMinor) /
                            100
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.5,
                              justifyContent: "center",
                            }}
                          >
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => handleEditLineItem(item)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  deleteLineItemMutation.mutate({ id: item.id })
                                }
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Box>
        )}

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
