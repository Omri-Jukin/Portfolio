"use client";

import * as React from "react";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { TRPCProvider } from "$/trpc/provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TRPCProvider>{children}</TRPCProvider>
    </ThemeProvider>
  );
}
