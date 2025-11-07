"use client";

import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import ClientOnly from "~/ClientOnly";
import DiscountTable from "./components/DiscountTable";

export default function DiscountsPage() {
  return (
    <ClientOnly>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }} color="text.primary">
          Discount Management
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }} color="text.secondary">
          Create and manage promotional discount codes with usage limits, date
          ranges, and scope restrictions.
        </Typography>

        <Paper sx={{ p: 3, bgcolor: "background.paper" }}>
          <DiscountTable />
        </Paper>
      </Box>
    </ClientOnly>
  );
}
