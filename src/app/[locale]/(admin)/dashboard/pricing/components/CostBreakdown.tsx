"use client";

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { usePricingContext } from "./PricingContext";

export default function CostBreakdown() {
  const { breakdown, isLoading } = usePricingContext();

  if (isLoading) {
    return null;
  }

  if (!breakdown) {
    return (
      <Paper
        sx={{
          p: 3,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Configure the proposal to see the cost breakdown.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        bgcolor: "background.paper",
      }}
    >
      <Accordion
        defaultExpanded
        sx={{
          bgcolor: "background.paper",
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="cost-breakdown-content"
          id="cost-breakdown-header"
        >
          <Typography variant="subtitle1" color="text.primary">
            Cost Breakdown
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "text.primary" }}>Item</TableCell>
                    <TableCell align="right" sx={{ color: "text.primary" }}>
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ color: "text.primary" }}>
                      Base Cost
                    </TableCell>
                    <TableCell align="right" sx={{ color: "text.primary" }}>
                      {breakdown.baseCost.toLocaleString()} ILS
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "text.primary" }}>
                      Page Cost
                    </TableCell>
                    <TableCell align="right" sx={{ color: "text.primary" }}>
                      {breakdown.pageCost.toLocaleString()} ILS
                    </TableCell>
                  </TableRow>
                  {breakdown.totalFeatureCost > 0 && (
                    <TableRow>
                      <TableCell sx={{ color: "text.primary" }}>
                        Features
                      </TableCell>
                      <TableCell align="right" sx={{ color: "text.primary" }}>
                        {breakdown.totalFeatureCost.toLocaleString()} ILS
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell sx={{ color: "text.primary" }}>
                      Complexity Multiplier
                    </TableCell>
                    <TableCell align="right" sx={{ color: "text.primary" }}>
                      {breakdown.complexityMultiplier.toFixed(2)}x
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "text.primary" }}>
                      Timeline Multiplier
                    </TableCell>
                    <TableCell align="right" sx={{ color: "text.primary" }}>
                      {breakdown.timelineMultiplier.toFixed(2)}x
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "text.primary" }}>
                      Tech Stack Multiplier
                    </TableCell>
                    <TableCell align="right" sx={{ color: "text.primary" }}>
                      {breakdown.techStackMultiplier.toFixed(2)}x
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "text.primary" }}>
                      Client Type Multiplier
                    </TableCell>
                    <TableCell align="right" sx={{ color: "text.primary" }}>
                      {breakdown.clientTypeMultiplier.toFixed(2)}x
                    </TableCell>
                  </TableRow>
                  {breakdown.discountApplied && (
                    <TableRow>
                      <TableCell sx={{ color: "text.primary" }}>
                        <Chip
                          label={`Discount (${breakdown.discountApplied.type})`}
                          size="small"
                          color="success"
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ color: "text.primary" }}>
                        -{breakdown.discountApplied.amount}
                        {breakdown.discountApplied.type === "percent"
                          ? "%"
                          : " ILS"}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell
                      sx={{ color: "text.primary", fontWeight: "bold" }}
                    >
                      Total
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "text.primary", fontWeight: "bold" }}
                    >
                      {breakdown.total.toLocaleString()} ILS
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: "text.primary" }}>Range</TableCell>
                    <TableCell align="right" sx={{ color: "text.primary" }}>
                      {breakdown.range.min.toLocaleString()} -{" "}
                      {breakdown.range.max.toLocaleString()} ILS
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
}
