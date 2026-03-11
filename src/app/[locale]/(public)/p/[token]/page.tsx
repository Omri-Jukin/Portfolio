"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Divider,
} from "@mui/material";
import { api } from "$/trpc/client";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";
import { ClientOnly } from "~/ClientOnly";
import { useSnackbar } from "~/SnackbarProvider/SnackbarProvider";

const PublicProposalPage = () => {
  const params = useParams();
  const token = params?.token as string;
  const { showSnackbar } = useSnackbar();

  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const {
    data: proposal,
    isLoading,
    error,
    refetch,
  } = api.proposals.getByShareToken.useQuery(
    { token },
    { enabled: !!token, retry: false }
  );

  const acceptMutation = api.proposals.acceptProposal.useMutation({
    onSuccess: () => {
      showSnackbar("Proposal accepted successfully", "success");
      setAcceptDialogOpen(false);
      void refetch();
    },
    onError: (error) => {
      showSnackbar(error.message || "Failed to accept proposal", "error");
    },
  });

  const declineMutation = api.proposals.declineProposal.useMutation({
    onSuccess: () => {
      showSnackbar("Proposal declined", "info");
      setDeclineDialogOpen(false);
      setDeclineReason("");
      void refetch();
    },
    onError: (error) => {
      showSnackbar(error.message || "Failed to decline proposal", "error");
    },
  });

  const handleAccept = () => {
    if (token) {
      acceptMutation.mutate({ token });
    }
  };

  const handleDecline = () => {
    if (token) {
      declineMutation.mutate({ token, reason: declineReason || undefined });
    }
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    showSnackbar("PDF export feature coming soon", "info");
  };

  if (isLoading) {
    return (
      <ClientOnly skeleton>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      </ClientOnly>
    );
  }

  if (error || !proposal) {
    return (
      <ClientOnly skeleton>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            p: 3,
          }}
        >
          <Alert severity="error">
            {error?.message || "Proposal not found or link is invalid."}
          </Alert>
        </Box>
      </ClientOnly>
    );
  }

  const isAccepted = proposal.status === "accepted";
  const isDeclined = proposal.status === "declined";
  const isExpired = proposal.status === "expired";
  const isDraft = proposal.status === "draft";
  const canInteract = proposal.status === "sent" && !isExpired;

  return (
    <ClientOnly skeleton>
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          p: { xs: 2, sm: 3, md: 4 },
          minHeight: "100vh",
        }}
      >
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {proposal.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Client: {proposal.clientName}
                  </Typography>
                  {proposal.validUntil && (
                    <Typography variant="body2" color="text.secondary">
                      Valid Until:{" "}
                      {format(new Date(proposal.validUntil), "PPpp")}
                    </Typography>
                  )}
                </Box>
                <Chip
                  label={proposal.status}
                  color={
                    isAccepted
                      ? "success"
                      : isDeclined
                      ? "error"
                      : isExpired
                      ? "warning"
                      : "info"
                  }
                />
              </Box>

              {isAccepted && (
                <Alert severity="success" icon={<CheckCircleIcon />}>
                  This proposal has been accepted.
                </Alert>
              )}

              {isDeclined && (
                <Alert severity="info" icon={<CancelIcon />}>
                  This proposal has been declined.
                </Alert>
              )}

              {isExpired && (
                <Alert severity="warning">This proposal has expired.</Alert>
              )}

              {isDraft && (
                <Alert severity="info">
                  This proposal is not yet available.
                </Alert>
              )}
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Proposal Details
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Currency
                </Typography>
                <Typography variant="body1">{proposal.currency}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Price Display Mode
                </Typography>
                <Typography variant="body1">
                  {proposal.priceDisplayMode}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Content
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Proposal content sections will be displayed here. Content builder
              coming soon.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Totals
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Pricing breakdown will be displayed here. Totals calculation
              coming soon.
            </Typography>
          </CardContent>
        </Card>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ justifyContent: "center", mb: 3 }}
        >
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<CheckCircleIcon />}
            onClick={() => setAcceptDialogOpen(true)}
            disabled={!canInteract}
            sx={{ flex: { xs: 1, sm: "none" } }}
          >
            Accept Proposal
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="large"
            startIcon={<CancelIcon />}
            onClick={() => setDeclineDialogOpen(true)}
            disabled={!canInteract}
            sx={{ flex: { xs: 1, sm: "none" } }}
          >
            Decline Proposal
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<PdfIcon />}
            onClick={handleExportPDF}
            sx={{ flex: { xs: 1, sm: "none" } }}
          >
            Download PDF
          </Button>
        </Stack>

        <Dialog
          open={acceptDialogOpen}
          onClose={() => setAcceptDialogOpen(false)}
        >
          <DialogTitle>Accept Proposal</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to accept this proposal? This action will
              create a snapshot of the proposal and mark it as accepted.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAcceptDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAccept}
              color="success"
              variant="contained"
              disabled={acceptMutation.isPending}
            >
              {acceptMutation.isPending ? "Accepting..." : "Accept"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={declineDialogOpen}
          onClose={() => setDeclineDialogOpen(false)}
        >
          <DialogTitle>Decline Proposal</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Are you sure you want to decline this proposal?
            </Typography>
            <TextField
              fullWidth
              label="Reason for declining (optional)"
              multiline
              rows={4}
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Please provide any feedback or reason for declining..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeclineDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDecline}
              color="error"
              variant="contained"
              disabled={declineMutation.isPending}
            >
              {declineMutation.isPending ? "Declining..." : "Decline"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ClientOnly>
  );
};

export default PublicProposalPage;
