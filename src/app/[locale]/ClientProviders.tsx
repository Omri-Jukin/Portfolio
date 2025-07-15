"use client";

import { Box } from "@mui/system";
import { ReactNode } from "react";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <Box sx={{ minHeight: "100vh" }}>{children}</Box>;
}
