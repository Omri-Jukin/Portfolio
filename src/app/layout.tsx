import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Omri's Portfolio",
  description:
    "Learn a little about me, my background, skills, and professional journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
