import * as React from "react";
import { PublicShell } from "@/components/site/public-shell";

export default function PublicRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicShell>{children}</PublicShell>;
}
