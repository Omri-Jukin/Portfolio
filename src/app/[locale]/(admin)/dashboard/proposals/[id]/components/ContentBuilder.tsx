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
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
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
  const [editingLineItem, setEditingLineItem] = useState<LineItem | null>(null);
  const [lineItemForm, setLineItemForm] = useState({
    label: "",
    description: "",
    quantity: "1",
    unitPriceMinor: "0",
    isOptional: false,
    isSelected: true,
    taxClass: "",
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
    createLineItemMutation.mutate({
      proposalId,
      sectionId: sectionId || null,
      label: "New Line Item",
      quantity: 1,
      unitPriceMinor: 0,
    });
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
            mb: 2,
          }}
        >
          <Typography variant="h6">Content</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddSection}
            size="small"
          >
            Add Section
          </Button>
        </Box>

        {sections.length === 0 && getUnsectionedLineItems().length === 0 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">
              No sections or line items yet. Add a section to get started.
            </Typography>
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                      pl: 4,
                    }}
                  >
                    <Typography variant="subtitle1">{section.label}</Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleAddLineItem(section.id)}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() =>
                          deleteSectionMutation.mutate({ id: section.id })
                        }
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {sectionItems.length > 0 && (
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Label</TableCell>
                          <TableCell align="right">Qty</TableCell>
                          <TableCell align="right">Unit Price</TableCell>
                          <TableCell align="right">Total</TableCell>
                          <TableCell>Optional</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sectionItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.label}</TableCell>
                            <TableCell align="right">
                              {Number(item.quantity)}
                            </TableCell>
                            <TableCell align="right">
                              {(item.unitPriceMinor / 100).toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                              {(
                                (Number(item.quantity) * item.unitPriceMinor) /
                                100
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Checkbox
                                checked={item.isOptional}
                                size="small"
                                disabled
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => handleEditLineItem(item)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  deleteLineItemMutation.mutate({ id: item.id })
                                }
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
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

        {getUnsectionedLineItems().length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Unsectioned Items
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Label</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getUnsectionedLineItems().map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.label}</TableCell>
                    <TableCell align="right">{Number(item.quantity)}</TableCell>
                    <TableCell align="right">
                      {(item.unitPriceMinor / 100).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {(
                        (Number(item.quantity) * item.unitPriceMinor) /
                        100
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditLineItem(item)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() =>
                          deleteLineItemMutation.mutate({ id: item.id })
                        }
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
