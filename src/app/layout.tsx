import type { Metadata } from "next";
import "./globals.css";
import { inter } from "$/fonts";

export const metadata: Metadata = {
  title: "Omri Jukin",
  description: "No gods, just logic. No bugs, just features.",
};

// Root layout - must have html and body tags per Next.js requirements
// The [locale]/layout.tsx will set lang and dir attributes via client-side script
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
