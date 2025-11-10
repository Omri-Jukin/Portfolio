"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Box,
  Divider,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { api } from "$/trpc/client";
import type { RouterOutputs } from "$/trpc/client";
import type { UpdateProposalData } from "#/lib/schemas";
import { ProposalStatus } from "#/lib/db/schema/schema.types";

type Proposal = RouterOutputs["proposals"]["getById"]["proposal"];

export interface DetailsCardRef {
  save: () => Promise<void>;
  hasUnsavedChanges: boolean;
}

interface DetailsCardProps {
  proposal: Proposal;
  onUpdate: (data: UpdateProposalData) => Promise<void>;
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
}

type FieldStatus = "idle" | "saving" | "saved" | "error";

interface FieldState {
  status: FieldStatus;
  error?: string;
}

const DetailsCard = forwardRef<DetailsCardRef, DetailsCardProps>(
  ({ proposal, onUpdate, onUnsavedChangesChange }, ref) => {
    const { data: pricingMeta } = api.pricing.meta.getAll.useQuery();

    // Extract tax profiles from pricing meta
    const taxProfiles =
      (pricingMeta?.find(
        (m: { key: string; value?: unknown }) => m.key === "tax_profiles"
      )?.value as Array<{ key: string; label: string }> | undefined) || [];

    // Original data from proposal (for comparison)
    const originalDataRef = useRef({
      clientName: proposal.clientName,
      clientEmail: proposal.clientEmail,
      clientCompany: proposal.clientCompany || null,
      status: proposal.status,
      currency: proposal.currency,
      taxProfileKey: proposal.taxProfileKey || null,
      priceDisplay: proposal.priceDisplay,
      validUntil: proposal.validUntil
        ? new Date(proposal.validUntil).toISOString().split("T")[0]
        : null,
      notesInternal: proposal.notesInternal || null,
      notesClient: proposal.notesClient || null,
    });

    const [formData, setFormData] = useState({
      clientName: proposal.clientName,
      clientEmail: proposal.clientEmail,
      clientCompany: proposal.clientCompany || "",
      status: proposal.status,
      currency: proposal.currency,
      taxProfileKey: proposal.taxProfileKey || "",
      priceDisplay: proposal.priceDisplay,
      validUntil: proposal.validUntil
        ? new Date(proposal.validUntil).toISOString().split("T")[0]
        : "",
      notesInternal: proposal.notesInternal || "",
      notesClient: proposal.notesClient || "",
    });

    // Track changed fields
    const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
    // Track field statuses (for loading indicators)
    const [fieldStatuses, setFieldStatuses] = useState<
      Record<string, FieldState>
    >({});
    const [isSaving, setIsSaving] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Update form data when proposal changes (reset to original)
    useEffect(() => {
      const original = {
        clientName: proposal.clientName,
        clientEmail: proposal.clientEmail,
        clientCompany: proposal.clientCompany || "",
        status: proposal.status,
        currency: proposal.currency,
        taxProfileKey: proposal.taxProfileKey || "",
        priceDisplay: proposal.priceDisplay,
        validUntil: proposal.validUntil
          ? new Date(proposal.validUntil).toISOString().split("T")[0]
          : "",
        notesInternal: proposal.notesInternal || "",
        notesClient: proposal.notesClient || "",
      };
      setFormData(original);
      originalDataRef.current = {
        clientName: proposal.clientName,
        clientEmail: proposal.clientEmail,
        clientCompany: proposal.clientCompany || null,
        status: proposal.status,
        currency: proposal.currency,
        taxProfileKey: proposal.taxProfileKey || null,
        priceDisplay: proposal.priceDisplay,
        validUntil: proposal.validUntil
          ? new Date(proposal.validUntil).toISOString().split("T")[0]
          : null,
        notesInternal: proposal.notesInternal || null,
        notesClient: proposal.notesClient || null,
      };
      setChangedFields(new Set());
      setFieldStatuses({});
    }, [proposal]);

    // Notify parent of unsaved changes
    useEffect(() => {
      onUnsavedChangesChange?.(changedFields.size > 0);
    }, [changedFields.size, onUnsavedChangesChange]);

    const handleFieldChange = (field: string, value: unknown) => {
      const newFormData = { ...formData, [field]: value };
      setFormData(newFormData);

      // Check if field has actually changed
      const originalValue =
        originalDataRef.current[field as keyof typeof originalDataRef.current];
      let hasChanged = false;

      if (field === "validUntil") {
        const newDate = value
          ? new Date(value as string).toISOString().split("T")[0]
          : null;
        hasChanged = newDate !== originalValue;
      } else if (
        field === "clientCompany" ||
        field === "taxProfileKey" ||
        field === "notesInternal" ||
        field === "notesClient"
      ) {
        // For nullable fields, compare normalized values (empty string = null)
        const normalizedNew = (value as string)?.trim() || null;
        const normalizedOriginal = originalValue || null;
        hasChanged = normalizedNew !== normalizedOriginal;
      } else {
        hasChanged = value !== originalValue;
      }

      // Update changed fields set
      setChangedFields((prev) => {
        const newSet = new Set(prev);
        if (hasChanged) {
          newSet.add(field);
        } else {
          newSet.delete(field);
        }
        return newSet;
      });

      // Clear field status on change
      setFieldStatuses((prev) => {
        const newStatuses = { ...prev };
        delete newStatuses[field];
        return newStatuses;
      });
    };

    // Prepare update data from changed fields only
    const prepareUpdateData = (): UpdateProposalData => {
      const updateData: UpdateProposalData = {};

      for (const field of changedFields) {
        const value = formData[field as keyof typeof formData];

        if (field === "clientName") {
          if (!value || (value as string).trim() === "") {
            throw new Error("Client name is required");
          }
          updateData.clientName = value as string;
        } else if (field === "clientEmail") {
          if (!value || (value as string).trim() === "") {
            throw new Error("Client email is required");
          }
          updateData.clientEmail = value as string;
        } else if (field === "clientCompany") {
          updateData.clientCompany = (value as string)?.trim() || null;
        } else if (field === "status") {
          updateData.status = value as ProposalStatus;
        } else if (field === "currency") {
          updateData.currency = value as string;
        } else if (field === "taxProfileKey") {
          updateData.taxProfileKey = (value as string)?.trim() || null;
        } else if (field === "priceDisplay") {
          updateData.priceDisplay = value as "taxExclusive" | "taxInclusive";
        } else if (field === "validUntil") {
          updateData.validUntil = value ? new Date(value as string) : null;
        } else if (field === "notesInternal") {
          updateData.notesInternal = (value as string)?.trim() || null;
        } else if (field === "notesClient") {
          updateData.notesClient = (value as string)?.trim() || null;
        }
      }

      return updateData;
    };

    const handleSave = async () => {
      if (changedFields.size === 0) return;

      // Cancel any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      // Validate required fields
      try {
        const updateData = prepareUpdateData();

        // Set all changed fields to saving
        setFieldStatuses((prev) => {
          const newStatuses = { ...prev };
          changedFields.forEach((field) => {
            newStatuses[field] = { status: "saving" };
          });
          return newStatuses;
        });
        setIsSaving(true);

        // Call onUpdate with validation
        await onUpdate(updateData);

        // Mark all fields as saved
        setFieldStatuses((prev) => {
          const newStatuses = { ...prev };
          changedFields.forEach((field) => {
            newStatuses[field] = { status: "saved" };
          });
          return newStatuses;
        });

        // Clear changed fields
        setChangedFields(new Set());

        // Clear saved status after 3 seconds
        setTimeout(() => {
          setFieldStatuses((prev) => {
            const newStatuses = { ...prev };
            changedFields.forEach((field) => {
              if (newStatuses[field]?.status === "saved") {
                delete newStatuses[field];
              }
            });
            return newStatuses;
          });
        }, 3000);
      } catch (error) {
        // Mark failed fields
        const errorMessage =
          error instanceof Error ? error.message : "Failed to save";
        setFieldStatuses((prev) => {
          const newStatuses = { ...prev };
          changedFields.forEach((field) => {
            newStatuses[field] = { status: "error", error: errorMessage };
          });
          return newStatuses;
        });
      } finally {
        setIsSaving(false);
        abortControllerRef.current = null;
      }
    };

    const handleRetryField = async (field: string) => {
      // Retry saving just this field
      const singleFieldSet = new Set([field]);
      const originalChangedFields = changedFields;
      setChangedFields(singleFieldSet);

      try {
        await handleSave();
      } catch {
        // Restore original changed fields if retry fails
        setChangedFields(originalChangedFields);
      }
    };

    // Expose save function and state via ref (must be after handleSave is defined)
    useImperativeHandle(ref, () => ({
      save: handleSave,
      hasUnsavedChanges: changedFields.size > 0,
    }));

    // Helper to render field status indicator
    const renderFieldStatus = (field: string) => {
      const status = fieldStatuses[field];
      if (!status) return null;

      if (status.status === "saving") {
        return <CircularProgress size={16} sx={{ ml: 1 }} />;
      } else if (status.status === "saved") {
        return (
          <CheckCircleIcon
            sx={{ ml: 1, color: "success.main", fontSize: 20 }}
          />
        );
      } else if (status.status === "error") {
        return (
          <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
            <Tooltip title={status.error || "Error saving field"}>
              <ErrorIcon sx={{ color: "error.main", fontSize: 20 }} />
            </Tooltip>
            <Tooltip title="Retry">
              <IconButton
                size="small"
                onClick={() => handleRetryField(field)}
                sx={{ ml: 0.5, p: 0.5 }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      }
      return null;
    };

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Proposal Details
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <TextField
              fullWidth
              label="Client Name"
              value={formData.clientName}
              onChange={(e) => handleFieldChange("clientName", e.target.value)}
              margin="normal"
              size="small"
              required
              error={fieldStatuses.clientName?.status === "error"}
            />
            {renderFieldStatus("clientName")}
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <TextField
              fullWidth
              label="Client Email"
              value={formData.clientEmail}
              onChange={(e) => handleFieldChange("clientEmail", e.target.value)}
              margin="normal"
              size="small"
              type="email"
              required
              error={fieldStatuses.clientEmail?.status === "error"}
            />
            {renderFieldStatus("clientEmail")}
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <TextField
              fullWidth
              label="Client Company"
              value={formData.clientCompany}
              onChange={(e) =>
                handleFieldChange("clientCompany", e.target.value)
              }
              margin="normal"
              size="small"
              error={fieldStatuses.clientCompany?.status === "error"}
            />
            {renderFieldStatus("clientCompany")}
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <TextField
              fullWidth
              select
              label="Status"
              value={formData.status}
              onChange={(e) => handleFieldChange("status", e.target.value)}
              margin="normal"
              size="small"
              error={fieldStatuses.status?.status === "error"}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="sent">Sent</MenuItem>
              <MenuItem value="accepted">Accepted</MenuItem>
              <MenuItem value="declined">Declined</MenuItem>
              <MenuItem value="expired">Expired</MenuItem>
              <MenuItem value="revised">Revised</MenuItem>
            </TextField>
            {renderFieldStatus("status")}
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <TextField
              fullWidth
              select
              label="Currency"
              value={formData.currency}
              onChange={(e) => handleFieldChange("currency", e.target.value)}
              margin="normal"
              size="small"
              error={fieldStatuses.currency?.status === "error"}
            >
              <MenuItem value="ILS">ILS</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
            </TextField>
            {renderFieldStatus("currency")}
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <TextField
              fullWidth
              select
              label="Tax Profile"
              value={formData.taxProfileKey}
              onChange={(e) =>
                handleFieldChange("taxProfileKey", e.target.value)
              }
              margin="normal"
              size="small"
              error={fieldStatuses.taxProfileKey?.status === "error"}
            >
              <MenuItem value="">None</MenuItem>
              {taxProfiles.map((profile) => (
                <MenuItem key={profile.key} value={profile.key}>
                  {profile.label}
                </MenuItem>
              ))}
            </TextField>
            {renderFieldStatus("taxProfileKey")}
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <TextField
              fullWidth
              select
              label="Price Display"
              value={formData.priceDisplay}
              onChange={(e) =>
                handleFieldChange("priceDisplay", e.target.value)
              }
              margin="normal"
              size="small"
              error={fieldStatuses.priceDisplay?.status === "error"}
            >
              <MenuItem value="taxExclusive">Tax Exclusive</MenuItem>
              <MenuItem value="taxInclusive">Tax Inclusive</MenuItem>
            </TextField>
            {renderFieldStatus("priceDisplay")}
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <TextField
              fullWidth
              label="Valid Until"
              type="date"
              value={formData.validUntil}
              onChange={(e) => handleFieldChange("validUntil", e.target.value)}
              margin="normal"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              error={fieldStatuses.validUntil?.status === "error"}
            />
            {renderFieldStatus("validUntil")}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ mb: 0, flex: 1 }}
              >
                Internal Notes
              </Typography>
              {renderFieldStatus("notesInternal")}
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={formData.notesInternal}
              onChange={(e) =>
                handleFieldChange("notesInternal", e.target.value)
              }
              margin="normal"
              size="small"
              placeholder="Internal notes (not visible to client)"
              error={fieldStatuses.notesInternal?.status === "error"}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ mb: 0, flex: 1 }}
              >
                Client Notes
              </Typography>
              {renderFieldStatus("notesClient")}
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={formData.notesClient}
              onChange={(e) => handleFieldChange("notesClient", e.target.value)}
              margin="normal"
              size="small"
              placeholder="Notes visible to client"
              error={fieldStatuses.notesClient?.status === "error"}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Save Changes Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              variant="contained"
              startIcon={
                isSaving ? <CircularProgress size={16} /> : <SaveIcon />
              }
              onClick={handleSave}
              disabled={changedFields.size === 0 || isSaving}
              size="small"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            {changedFields.size > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ alignSelf: "center" }}
              >
                {changedFields.size} unsaved change
                {changedFields.size > 1 ? "s" : ""}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }
);

DetailsCard.displayName = "DetailsCard";

export default DetailsCard;
