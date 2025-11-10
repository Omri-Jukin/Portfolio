"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link as MuiLink,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  Download as DownloadIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { api } from "$/trpc/client";
import { ClientOnly } from "~/ClientOnly";
import Snackbar, { type SnackbarProps } from "~/Snackbar";
import DetailsCard, { type DetailsCardRef } from "./components/DetailsCard";
import ContentBuilder from "./components/ContentBuilder";
import ChargesPanel from "./components/ChargesPanel";
import TotalsPanel from "./components/TotalsPanel";
import { UpdateProposalData } from "#/lib";

export default function ProposalEditorPage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params.id as string;

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientCompany: "",
    currency: "ILS",
    taxProfileKey: "",
    priceDisplay: "taxExclusive" as "taxExclusive" | "taxInclusive",
    status: "draft" as const,
  });

  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: "",
    severity: "info",
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [unsavedChangesDialogOpen, setUnsavedChangesDialogOpen] =
    useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    (() => void) | null
  >(null);
  const [saveAndSendState, setSaveAndSendState] = useState<
    "idle" | "saving" | "sending"
  >("idle");
  const detailsCardRef = useRef<DetailsCardRef>(null);

  // Handle beforeunload (browser close/refresh)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ""; // Chrome requires returnValue to be set
        return ""; // Some browsers require return value
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const {
    data: proposalData,
    isLoading,
    error,
    refetch,
  } = api.proposals.getById.useQuery(
    { id: proposalId },
    { enabled: proposalId !== "new" }
  );

  const updateMutation = api.proposals.update.useMutation({
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Proposal updated successfully",
        severity: "success",
      });
      void refetch();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update proposal",
        severity: "error",
      });
      throw error; // Re-throw so DetailsCard can handle it
    },
  });

  const handleUpdate = async (data: UpdateProposalData) => {
    await updateMutation.mutateAsync({
      id: proposalId,
      data,
    });
  };

  const sendMutation = api.proposals.sendProposal.useMutation({
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Proposal sent successfully",
        severity: "success",
      });
      void refetch();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to send proposal",
        severity: "error",
      });
    },
  });

  const exportPdfMutation = api.proposals.exportPDF.useQuery(
    { id: proposalId },
    { enabled: false }
  );

  const handleSaveAndSend = async () => {
    try {
      setSaveAndSendState("saving");

      // If there are unsaved changes, save first
      if (hasUnsavedChanges && detailsCardRef.current) {
        await detailsCardRef.current.save();
      }

      // Smooth transition to sending state
      setSaveAndSendState("sending");

      // Then send
      await new Promise<void>((resolve, reject) => {
        sendMutation.mutate(
          {
            id: proposalId,
            includePDF: true,
            generateShareToken: true,
          },
          {
            onSuccess: () => {
              setSaveAndSendState("idle");
              resolve();
            },
            onError: (error) => {
              setSaveAndSendState("idle");
              reject(error);
            },
          }
        );
      });
    } catch (error) {
      setSaveAndSendState("idle");
      setSnackbar({
        open: true,
        message:
          error instanceof Error ? error.message : "Failed to save and send",
        severity: "error",
      });
    }
  };

  const handleSendProposal = () => {
    // Auto-save if there are unsaved changes
    if (hasUnsavedChanges) {
      handleSaveAndSend();
      return;
    }

    sendMutation.mutate({
      id: proposalId,
      includePDF: true,
      generateShareToken: true,
    });
  };

  const handleExportPDF = async () => {
    try {
      const result = await exportPdfMutation.refetch();
      if (result.data) {
        // Create download link
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${result.data.pdf}`;
        link.download = result.data.filename;
        link.click();
        setSnackbar({
          open: true,
          message: "PDF downloaded successfully",
          severity: "success",
        });
      }
    } catch (error: unknown) {
      console.error("Failed to export PDF:", error);
      setSnackbar({
        open: true,
        message: "Failed to export PDF",
        severity: "error",
      });
    }
  };

  const createMutation = api.proposals.create.useMutation({
    onSuccess: (newProposal) => {
      const locale = (params.locale as string) || "en";
      router.push(`/${locale}/dashboard/proposals/${newProposal.id}`);
      setSnackbar({
        open: true,
        message: "Proposal created successfully",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to create proposal",
        severity: "error",
      });
    },
  });

  const { data: totals, isLoading: totalsLoading } =
    api.proposals.calculateTotals.useQuery(
      { proposalId },
      {
        enabled: proposalId !== "new" && !!proposalData,
        refetchInterval: 5000, // Refresh totals every 5 seconds
      }
    );

  if (proposalId === "new") {
    const { data: pricingMeta } = api.pricing.meta.getAll.useQuery();
    const taxProfiles =
      (pricingMeta?.find(
        (m: { key: string; value?: unknown }) => m.key === "tax_profiles"
      )?.value as Array<{ key: string; label: string }> | undefined) || [];

    const handleCreate = () => {
      if (!formData.clientName.trim() || !formData.clientEmail.trim()) {
        setSnackbar({
          open: true,
          message: "Client name and email are required",
          severity: "error",
        });
        return;
      }

      createMutation.mutate({
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientCompany: formData.clientCompany || null,
        currency: formData.currency,
        taxProfileKey: formData.taxProfileKey || null,
        priceDisplay: formData.priceDisplay,
        status: formData.status,
      });
    };

    return (
      <ClientOnly>
        <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
          <Typography variant="h4" gutterBottom>
            Create New Proposal
          </Typography>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Client Name"
              fullWidth
              required
              value={formData.clientName}
              onChange={(e) =>
                setFormData({ ...formData, clientName: e.target.value })
              }
            />

            <TextField
              label="Client Email"
              fullWidth
              required
              type="email"
              value={formData.clientEmail}
              onChange={(e) =>
                setFormData({ ...formData, clientEmail: e.target.value })
              }
            />

            <TextField
              label="Client Company"
              fullWidth
              value={formData.clientCompany}
              onChange={(e) =>
                setFormData({ ...formData, clientCompany: e.target.value })
              }
            />

            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select
                value={formData.currency}
                label="Currency"
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
              >
                <MenuItem value="ILS">ILS</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Tax Profile</InputLabel>
              <Select
                value={formData.taxProfileKey}
                label="Tax Profile"
                onChange={(e) =>
                  setFormData({ ...formData, taxProfileKey: e.target.value })
                }
              >
                <MenuItem value="">None</MenuItem>
                {taxProfiles.map((profile) => (
                  <MenuItem key={profile.key} value={profile.key}>
                    {profile.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Price Display</InputLabel>
              <Select
                value={formData.priceDisplay}
                label="Price Display"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priceDisplay: e.target.value as
                      | "taxExclusive"
                      | "taxInclusive",
                  })
                }
              >
                <MenuItem value="taxExclusive">Tax Exclusive</MenuItem>
                <MenuItem value="taxInclusive">Tax Inclusive</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  const locale = (params.locale as string) || "en";
                  router.push(`/${locale}/dashboard/proposals`);
                }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                variant="contained"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Create Proposal"}
              </Button>
            </Box>
          </Stack>

          <Snackbar
            open={snackbar.open}
            message={snackbar.message}
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          />
        </Box>
      </ClientOnly>
    );
  }

  if (isLoading) {
    return (
      <ClientOnly>
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      </ClientOnly>
    );
  }

  if (error || !proposalData) {
    return (
      <ClientOnly>
        <Alert severity="error" sx={{ m: 2 }}>
          {error?.message || "Failed to load proposal"}
        </Alert>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Box sx={{ p: 3 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <MuiLink
            component="button"
            variant="body1"
            onClick={() => router.push("/dashboard/proposals")}
          >
            Proposals
          </MuiLink>
          <Typography color="text.primary">
            {proposalData.proposal.clientName}
          </Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4">
            Proposal: {proposalData.proposal.clientName}
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                if (hasUnsavedChanges) {
                  setPendingNavigation(
                    () => () => router.push("/dashboard/proposals")
                  );
                  setUnsavedChangesDialogOpen(true);
                } else {
                  router.push("/dashboard/proposals");
                }
              }}
            >
              Back
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportPDF}
              disabled={exportPdfMutation.isFetching}
            >
              Export PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={async () => {
                if (detailsCardRef.current) {
                  try {
                    await detailsCardRef.current.save();
                  } catch (error: unknown) {
                    setSnackbar({
                      open: true,
                      message:
                        error instanceof Error
                          ? error.message
                          : "Failed to save changes",
                      severity: "error",
                    });
                  }
                }
              }}
              disabled={!hasUnsavedChanges || updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SendIcon />}
              onClick={handleSendProposal}
              disabled={sendMutation.isPending || updateMutation.isPending}
            >
              {sendMutation.isPending
                ? "Sending..."
                : updateMutation.isPending
                ? "Saving..."
                : "Send Proposal"}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={
                saveAndSendState === "saving" ||
                saveAndSendState === "sending" ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SendIcon />
                )
              }
              onClick={handleSaveAndSend}
              disabled={
                sendMutation.isPending ||
                updateMutation.isPending ||
                (!hasUnsavedChanges && saveAndSendState === "idle")
              }
              sx={{
                transition: "all 0.3s ease-in-out",
                ...(saveAndSendState === "saving" && {
                  backgroundColor: "primary.main",
                }),
                ...(saveAndSendState === "sending" && {
                  backgroundColor: "secondary.main",
                }),
              }}
            >
              {saveAndSendState === "saving"
                ? "Saving..."
                : saveAndSendState === "sending"
                ? "Sending..."
                : "Save & Send"}
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Left Sidebar - Details */}
          <Box sx={{ xs: 12, md: 3 }}>
            <DetailsCard
              ref={detailsCardRef}
              proposal={proposalData.proposal}
              onUpdate={handleUpdate}
              onUnsavedChangesChange={setHasUnsavedChanges}
            />
          </Box>

          {/* Main Content - Sections & Line Items */}
          <Box sx={{ xs: 12, md: 6 }}>
            <ContentBuilder
              proposalId={proposalId}
              sections={proposalData.sections}
              lineItems={proposalData.lineItems}
              onRefetch={refetch}
            />
          </Box>

          {/* Right Panel - Charges & Totals */}
          <Box sx={{ xs: 12, md: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <ChargesPanel
                proposalId={proposalId}
                discounts={proposalData.discounts}
                taxes={proposalData.taxes}
                sections={proposalData.sections}
                lineItems={proposalData.lineItems}
                onRefetch={refetch}
              />
              <TotalsPanel totals={totals} loading={totalsLoading} />
            </Box>
          </Box>
        </Grid>

        <Snackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />

        {/* Unsaved Changes Dialog */}
        <Dialog
          open={unsavedChangesDialogOpen}
          onClose={() => {
            setUnsavedChangesDialogOpen(false);
            setPendingNavigation(null);
          }}
        >
          <DialogTitle>Unsaved Changes</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You have unsaved changes. Are you sure you want to leave? Your
              changes will be lost.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setUnsavedChangesDialogOpen(false);
                setPendingNavigation(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setUnsavedChangesDialogOpen(false);
                if (pendingNavigation) {
                  pendingNavigation();
                  setPendingNavigation(null);
                }
              }}
              color="error"
              variant="contained"
            >
              Leave Without Saving
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ClientOnly>
  );
}
