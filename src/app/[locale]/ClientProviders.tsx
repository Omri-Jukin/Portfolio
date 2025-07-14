"use client";

import ThemeProvider from "#/Components/ThemeProvider";
import { ReactNode } from "react";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
