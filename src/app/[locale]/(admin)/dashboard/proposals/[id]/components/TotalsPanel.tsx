"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import type { RouterOutputs } from "$/trpc/client";
import {
  DiscountBreakdown,
  TaxBreakdown,
  formatMoney,
} from "$/pricing/calcProposalTotals";

type Totals = RouterOutputs["proposals"]["calculateTotals"];

interface TotalsPanelProps {
  totals: Totals | undefined;
  loading: boolean;
}

export default function TotalsPanel({ totals, loading }: TotalsPanelProps) {
  if (loading || !totals) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Totals
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2">Subtotal:</Typography>
          <Typography variant="body2" fontWeight="medium">
            {formatMoney(totals.subtotalMinor, totals.currency)}
          </Typography>
        </Box>

        {totals.discountsBreakdown.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Discounts:
            </Typography>
            {totals.discountsBreakdown.map(
              (discount: DiscountBreakdown, idx: number) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    ml: 2,
                  }}
                >
                  <Typography variant="caption">
                    {discount.label} ({discount.scope})
                  </Typography>
                  <Typography variant="caption" color="error">
                    -{formatMoney(discount.amountMinor, totals.currency)}
                  </Typography>
                </Box>
              )
            )}
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2">Pre-tax Total:</Typography>
          <Typography variant="body2" fontWeight="medium">
            {formatMoney(totals.preTaxTotalMinor, totals.currency)}
          </Typography>
        </Box>

        {totals.taxBreakdown.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Taxes:
            </Typography>
            {totals.taxBreakdown.map((tax: TaxBreakdown, idx: number) => (
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
                  {formatMoney(tax.amountMinor, totals.currency)}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Grand Total:</Typography>
          <Typography variant="h6" fontWeight="bold">
            {formatMoney(totals.grandTotalMinor, totals.currency)}
          </Typography>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          Computed at: {new Date(totals.computedAt).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
}
