import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "From Atoms to Applications",
  description: "No gods, just logic. No bugs, just features.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
