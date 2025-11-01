import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Omri Jukin",
  description: "No gods, just logic. No bugs, just features.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
