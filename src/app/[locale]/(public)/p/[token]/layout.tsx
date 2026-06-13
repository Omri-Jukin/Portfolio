import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Shared Proposal",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SharedProposalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
