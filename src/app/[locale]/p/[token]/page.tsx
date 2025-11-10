"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { api } from "$/trpc/client";
import { ClientOnly } from "~/ClientOnly";
import {
  formatMoney,
  calcProposalTotals,
  type ProposalLineItem,
  type ProposalTotalsInput,
} from "$/pricing/calcProposalTotals";
import Snackbar, { type SnackbarProps } from "~/Snackbar";
import { format } from "date-fns";
import type { RouterOutputs } from "$/trpc/client";
import { ProposalDiscount, ProposalTax } from "#/lib/db";

type ProposalSection =
  RouterOutputs["proposals"]["getByShareToken"]["sections"][0];

export default function PublicProposalPage() {
  const params = useParams();
  const token = params.token as string;

  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: "",
    severity: "info",
  });

  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const {
    data: proposalData,
    isLoading,
    error,
  } = api.proposals.getByShareToken.useQuery({ token });

  const { data: pricingMeta, isLoading: isLoadingMeta } =
    api.pricing.meta.getAll.useQuery();

  const acceptMutation = api.proposals.acceptProposal.useMutation({
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Proposal accepted successfully!",
        severity: "success",
      });
      setAcceptDialogOpen(false);
      // Refetch to get updated status
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to accept proposal",
        severity: "error",
      });
    },
  });

  const declineMutation = api.proposals.declineProposal.useMutation({
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Proposal declined",
        severity: "info",
      });
      setDeclineDialogOpen(false);
      setDeclineReason("");
      // Refetch to get updated status
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message || "Failed to decline proposal",
        severity: "error",
      });
    },
  });

  const handleAccept = () => {
    acceptMutation.mutate({ shareToken: token });
  };

  const handleDecline = () => {
    declineMutation.mutate({
      shareToken: token,
      reason: declineReason || null,
    });
  };

  if (isLoading || isLoadingMeta) {
    return (
      <ClientOnly>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        </Container>
      </ClientOnly>
    );
  }

  if (error || !proposalData) {
    return (
      <ClientOnly>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error">
            {error?.message || "Proposal not found or link is invalid"}
          </Alert>
        </Container>
      </ClientOnly>
    );
  }

  const { proposal, sections, lineItems, discounts, taxes } = proposalData;

  // Calculate accurate totals using calcProposalTotals
  const totalsInput: ProposalTotalsInput = {
    currency: proposal.currency,
    priceDisplay: proposal.priceDisplay,
    taxProfileKey: proposal.taxProfileKey,
    sections: sections.map((s: ProposalSection) => ({
      id: s.id,
      sortOrder: s.sortOrder,
    })),
    lineItems: lineItems.map((li: ProposalLineItem) => ({
      id: li.id,
      sectionId: li.sectionId,
      featureKey: li.featureKey,
      label: li.label,
      description: li.description,
      quantity: Number(li.quantity),
      unitPriceMinor: li.unitPriceMinor,
      isOptional: li.isOptional,
      isSelected: li.isSelected,
      taxClass: li.taxClass,
    })),
    discounts: discounts.map((d: ProposalDiscount) => ({
      id: d.id,
      scope: d.scope,
      sectionId: d.sectionId,
      lineItemId: d.lineItemId,
      type: d.type,
      amountMinor: d.amountMinor ?? undefined,
      percent: d.percent ? Number(d.percent) : undefined,
      label: d.label,
    })),
    taxes: taxes.map((t: ProposalTax) => ({
      id: t.id,
      scope: t.scope,
      sectionId: t.sectionId,
      lineItemId: t.lineItemId,
      kind: t.kind,
      type: t.type,
      rateOrAmount: Number(t.rateOrAmount),
      orderIndex: t.orderIndex,
      label: t.label,
    })),
    pricingMeta: pricingMeta || [],
  };

  const totals = calcProposalTotals(totalsInput);

  return (
    <ClientOnly>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Proposal
            </Typography>
            <Typography variant="body1" color="text.secondary">
              For: {proposal.clientName}
              {proposal.clientCompany && ` (${proposal.clientCompany})`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {proposal.clientEmail}
            </Typography>
            {proposal.validUntil && (
              <Typography variant="body2" color="text.secondary">
                Valid until:{" "}
                {format(new Date(proposal.validUntil), "MMM d, yyyy")}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Sections and Line Items */}
          {sections.map((section: ProposalSection) => {
            const sectionItems = lineItems.filter(
              (item: ProposalLineItem) => item.sectionId === section.id
            );
            if (sectionItems.length === 0) return null;

            return (
              <Box key={section.id} sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  {section.label}
                </Typography>
                {section.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {section.description}
                  </Typography>
                )}

                <Box component="table" sx={{ width: "100%", mb: 2 }}>
                  <Box component="thead">
                    <Box component="tr">
                      <Box component="th" sx={{ textAlign: "left", p: 1 }}>
                        Item
                      </Box>
                      <Box component="th" sx={{ textAlign: "right", p: 1 }}>
                        Quantity
                      </Box>
                      <Box component="th" sx={{ textAlign: "right", p: 1 }}>
                        Unit Price
                      </Box>
                      <Box component="th" sx={{ textAlign: "right", p: 1 }}>
                        Total
                      </Box>
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {sectionItems.map((item: ProposalLineItem) => (
                      <Box component="tr" key={item.id}>
                        <Box component="td" sx={{ p: 1 }}>
                          {item.label}
                          {item.description && (
                            <Typography
                              variant="caption"
                              display="block"
                              color="text.secondary"
                            >
                              {item.description}
                            </Typography>
                          )}
                        </Box>
                        <Box component="td" sx={{ textAlign: "right", p: 1 }}>
                          {Number(item.quantity)}
                        </Box>
                        <Box component="td" sx={{ textAlign: "right", p: 1 }}>
                          {formatMoney(item.unitPriceMinor, proposal.currency)}
                        </Box>
                        <Box component="td" sx={{ textAlign: "right", p: 1 }}>
                          {formatMoney(
                            Number(item.quantity) * item.unitPriceMinor,
                            proposal.currency
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            );
          })}

          {/* Totals Summary */}
          <Card sx={{ mt: 4, mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Subtotal:</Typography>
                <Typography>
                  {formatMoney(totals.subtotalMinor, proposal.currency)}
                </Typography>
              </Box>
              {totals.discountsBreakdown.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Discounts:
                  </Typography>
                  {totals.discountsBreakdown.map((discount, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        ml: 2,
                      }}
                    >
                      <Typography variant="caption">
                        {discount.label}
                      </Typography>
                      <Typography variant="caption" color="error">
                        -{formatMoney(discount.amountMinor, proposal.currency)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
              {totals.taxBreakdown.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Taxes:
                  </Typography>
                  {totals.taxBreakdown.map((tax, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        ml: 2,
                      }}
                    >
                      <Typography variant="caption">{tax.label}</Typography>
                      <Typography variant="caption">
                        {formatMoney(tax.amountMinor, proposal.currency)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">
                  {formatMoney(totals.grandTotalMinor, proposal.currency)}
                </Typography>
              </Box>
              {proposal.priceDisplay === "taxInclusive" && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  (Taxes included)
                </Typography>
              )}
              {proposal.priceDisplay === "taxExclusive" && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  (Taxes excluded)
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Client Notes */}
          {proposal.notesClient && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" gutterBottom>
                Notes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {proposal.notesClient}
              </Typography>
            </Box>
          )}

          {/* Actions */}
          {proposal.status === "sent" && (
            <Box
              sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}
            >
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckIcon />}
                onClick={() => setAcceptDialogOpen(true)}
                size="large"
              >
                Accept Proposal
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CloseIcon />}
                onClick={() => setDeclineDialogOpen(true)}
                size="large"
              >
                Decline Proposal
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={async () => {
                  try {
                    // Generate PDF on the client side
                    const { generateProposalPDF } = await import(
                      "$/utils/proposalPdfGenerator"
                    );
                    // Ensure proposalData has events for PDF generation
                    const pdfData = {
                      ...proposalData,
                      events: [],
                    };
                    const pdf = generateProposalPDF(
                      pdfData as unknown as Parameters<
                        typeof generateProposalPDF
                      >[0]
                    );
                    const pdfBlob = pdf.output("blob");
                    const url = URL.createObjectURL(pdfBlob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `Proposal-${proposal.clientName}-${
                      new Date().toISOString().split("T")[0]
                    }.pdf`;
                    link.click();
                    URL.revokeObjectURL(url);
                    setSnackbar({
                      open: true,
                      message: "PDF downloaded successfully",
                      severity: "success",
                    });
                  } catch (error) {
                    console.error("Failed to generate PDF:", error);
                    setSnackbar({
                      open: true,
                      message: "Failed to generate PDF",
                      severity: "error",
                    });
                  }
                }}
                size="large"
              >
                Download PDF
              </Button>
            </Box>
          )}

          {proposal.status === "accepted" && (
            <Alert severity="success" sx={{ mt: 4 }}>
              This proposal has been accepted.
            </Alert>
          )}

          {proposal.status === "declined" && (
            <Alert severity="info" sx={{ mt: 4 }}>
              This proposal has been declined.
            </Alert>
          )}
        </Paper>

        {/* Accept Confirmation Dialog */}
        <Dialog
          open={acceptDialogOpen}
          onClose={() => setAcceptDialogOpen(false)}
        >
          <DialogTitle>Accept Proposal</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to accept this proposal? This action will be
              recorded and cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAcceptDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAccept}
              variant="contained"
              color="success"
              disabled={acceptMutation.isPending}
            >
              {acceptMutation.isPending ? "Accepting..." : "Accept"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Decline Dialog */}
        <Dialog
          open={declineDialogOpen}
          onClose={() => setDeclineDialogOpen(false)}
        >
          <DialogTitle>Decline Proposal</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Please provide a reason for declining this proposal (optional):
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Reason for declining..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeclineDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDecline}
              variant="contained"
              color="error"
              disabled={declineMutation.isPending}
            >
              {declineMutation.isPending ? "Declining..." : "Decline"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </Container>
    </ClientOnly>
  );
}
