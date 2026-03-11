"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Card,
  Tabs,
  Tab,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
} from "@mui/material";
import { api } from "$/trpc/client";
import { useRouter, usePathname, useParams } from "next/navigation";
import {
  Save as SaveIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  Share as ShareIcon,
  ContentCopy as CopyIcon,
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { ClientOnly } from "~/ClientOnly";
import { useSnackbar } from "~/SnackbarProvider/SnackbarProvider";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`proposal-tabpanel-${index}`}
      aria-labelledby={`proposal-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PRICE_DISPLAY_MODE_TITLE = "Price display mode";

const ProposalEditorPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = (pathname.split("/")[1] as "en" | "es" | "fr" | "he") || "en";
  const proposalId = params?.id as string;
  const { showSnackbar } = useSnackbar();

  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const createMutation = api.proposals.create.useMutation({
    onSuccess: (data) => {
      showSnackbar("Proposal created successfully", "success");
      router.push(`/${locale}/dashboard/proposals/${data.id}`);
    },
    onError: (error) => {
      showSnackbar(error.message || "Failed to create proposal", "error");
    },
  });

  const {
    data: proposal,
    isLoading,
    error,
    refetch,
  } = api.proposals.getById.useQuery(
    { id: proposalId },
    { enabled: !!proposalId && proposalId !== "new" }
  );

  const updateMutation = api.proposals.update.useMutation({
    onSuccess: () => {
      showSnackbar("Proposal saved successfully", "success");
      void refetch();
    },
    onError: (error) => {
      showSnackbar(error.message || "Failed to save proposal", "error");
    },
  });

  const deleteMutation = api.proposals.delete.useMutation({
    onSuccess: () => {
      showSnackbar("Proposal deleted successfully", "success");
      router.push(`/${locale}/dashboard/proposals`);
    },
    onError: (error) => {
      showSnackbar(error.message || "Failed to delete proposal", "error");
    },
  });

  const generateShareTokenMutation =
    api.proposals.generateShareToken.useMutation({
      onSuccess: (data) => {
        if (data.token) {
          const url = `${window.location.origin}/${locale}/p/${data.token}`;
          setShareUrl(url);
          setShareDialogOpen(true);
        }
      },
      onError: (error) => {
        showSnackbar(error.message || "Failed to generate share link", "error");
      },
    });

  const [formData, setFormData] = useState<{
    title: string;
    clientName: string;
    clientEmail: string;
    status: "draft" | "sent" | "accepted" | "declined" | "expired";
    currency: string;
    priceDisplayMode: "fixed" | "hourly" | "both";
  }>({
    title: "",
    clientName: "",
    clientEmail: "",
    status: "draft",
    currency: "USD",
    priceDisplayMode: "fixed",
  });

  useEffect(() => {
    if (proposal) {
      setFormData({
        title: proposal.title,
        clientName: proposal.clientName,
        clientEmail: proposal.clientEmail,
        status: proposal.status,
        currency: proposal.currency,
        priceDisplayMode: proposal.priceDisplayMode,
      });
    }
  }, [proposal]);

  const handleSave = () => {
    if (proposalId === "new") {
      // Create new proposal
      createMutation.mutate(formData);
    } else if (proposalId) {
      // Update existing proposal
      updateMutation.mutate({
        id: proposalId,
        ...formData,
      });
    }
  };

  const handleSend = () => {
    // TODO: Implement send proposal
    showSnackbar("Send proposal feature coming soon", "info");
  };

  const handleDelete = () => {
    if (proposalId && proposalId !== "new") {
      deleteMutation.mutate({ id: proposalId });
    }
  };

  const handleShare = () => {
    if (proposalId && proposalId !== "new") {
      generateShareTokenMutation.mutate({ id: proposalId });
    }
  };

  const handleCopyShareUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      showSnackbar("Share link copied to clipboard", "success");
    }
  };

  const handleExportPDF = async () => {
    if (!proposal || !proposal.intake) {
      showSnackbar("No intake data available to export", "warning");
      return;
    }

    try {
      // Dynamically import to avoid edge bundling issues
      const { generateIntakePDF } = await import(
        "#/lib/utils/intakePdfGenerator"
      );

      // Generate PDF (now async for Hebrew support)
      const pdf = await generateIntakePDF({
        id: proposal.intake.id,
        email: proposal.intake.email,
        data: proposal.intake.data as Record<string, unknown>,
        proposalMd: proposal.intake.proposalMd,
        status: proposal.intake.status,
        flagged: proposal.intake.flagged,
        estimatedValue: proposal.intake.estimatedValue,
        riskLevel: proposal.intake.riskLevel,
        createdAt: proposal.intake.createdAt,
        updatedAt: proposal.intake.updatedAt,
      });

      // Generate filename
      const clientName = proposal.clientName
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
      const date = new Date().toISOString().split("T")[0];
      const filename = `intake_${clientName}_${date}.pdf`;

      // Save PDF
      pdf.save(filename);
      showSnackbar("PDF exported successfully", "success");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      showSnackbar(
        error instanceof Error ? error.message : "Failed to export PDF",
        "error"
      );
    }
  };

  if (isLoading) {
    return (
      <ClientOnly skeleton>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      </ClientOnly>
    );
  }

  if (error) {
    return (
      <ClientOnly skeleton>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            {error.message || "Failed to load proposal"}
          </Alert>
        </Box>
      </ClientOnly>
    );
  }

  if (!proposal && proposalId !== "new") {
    return (
      <ClientOnly skeleton>
        <Box sx={{ p: 3 }}>
          <Alert severity="warning">Proposal not found</Alert>
        </Box>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly skeleton>
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push(`/${locale}/dashboard/proposals`)}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
            {proposalId === "new" ? "Create Proposal" : "Edit Proposal"}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={updateMutation.isPending || createMutation.isPending}
            >
              {proposalId === "new" ? "Create Proposal" : "Save Draft"}
            </Button>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={handleShare}
              disabled={proposalId === "new"}
            >
              Share
            </Button>
            <Button
              variant="outlined"
              startIcon={<SendIcon />}
              onClick={handleSend}
              disabled={proposalId === "new"}
            >
              Send
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
              disabled={proposalId === "new"}
            >
              Delete
            </Button>
          </Stack>
        </Stack>

        {proposal && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={proposal.status}
              color={
                proposal.status === "accepted"
                  ? "success"
                  : proposal.status === "declined"
                  ? "error"
                  : proposal.status === "sent"
                  ? "info"
                  : "default"
              }
              sx={{ mr: 1 }}
            />
          </Box>
        )}

        {/* Quick Actions */}
        {proposal && proposal.intake && (
          <Card sx={{ mb: 3, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button
                variant="contained"
                startIcon={<EmailIcon />}
                href={`mailto:${
                  proposal.clientEmail
                }?subject=Re: ${encodeURIComponent(proposal.title)}`}
              >
                Reply to Client
              </Button>
              <Button
                variant="outlined"
                startIcon={<CalendarIcon />}
                href={`mailto:${proposal.clientEmail}?subject=Let's Schedule a Call&body=Hi ${proposal.clientName},`}
              >
                Schedule Call
              </Button>
              <Button
                variant="outlined"
                startIcon={<PdfIcon />}
                onClick={handleExportPDF}
              >
                Export Intake PDF
              </Button>
            </Stack>
          </Card>
        )}

        <Card>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
            >
              <Tab label="Details" />
              <Tab label="Content" />
              <Tab label="Charges" />
              <Tab label="Totals" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Stack spacing={3}>
              <TextField
                label="Title"
                fullWidth
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <TextField
                label="Client Name"
                fullWidth
                value={formData.clientName}
                onChange={(e) =>
                  setFormData({ ...formData, clientName: e.target.value })
                }
              />
              <TextField
                label="Client Email"
                fullWidth
                type="email"
                value={formData.clientEmail}
                onChange={(e) =>
                  setFormData({ ...formData, clientEmail: e.target.value })
                }
              />
              <TextField
                label="Currency"
                fullWidth
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
              />
              <FormControl>
                <InputLabel htmlFor="price-display-mode-select">
                  Price Display Mode
                </InputLabel>
                <Select
                  id="price-display-mode-select"
                  title={PRICE_DISPLAY_MODE_TITLE}
                  value={formData.priceDisplayMode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priceDisplayMode: e.target.value,
                    })
                  }
                >
                  <MenuItem value="fixed">Fixed</MenuItem>
                  <MenuItem value="hourly">Hourly</MenuItem>
                  <MenuItem value="both">Both</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="body1" color="text.secondary">
              Content builder coming soon. This will allow you to add sections
              and line items to your proposal.
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="body1" color="text.secondary">
              Charges configuration coming soon. This will allow you to
              configure pricing for your proposal.
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="body1" color="text.secondary">
              Totals preview coming soon. This will show the complete pricing
              breakdown including subtotals, discounts, taxes, and grand total.
            </Typography>
          </TabPanel>
        </Card>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Proposal</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this proposal? This action cannot
              be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
        >
          <DialogTitle>Share Proposal</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Share URL"
              value={shareUrl || ""}
              InputProps={{
                readOnly: true,
              }}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShareDialogOpen(false)}>Close</Button>
            <Button
              onClick={handleCopyShareUrl}
              variant="contained"
              startIcon={<CopyIcon />}
            >
              Copy Link
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ClientOnly>
  );
};

export default ProposalEditorPage;
