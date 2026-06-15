import type { Metadata, Viewport } from "next";
import "./globals.css";
import { geistDisplay, inter, jetBrainsMono } from "$/fonts";
import { ThemeScript } from "@/components/theme/theme-script";
import { AppProviders } from "./providers/AppProviders";

const siteDescription =
  "Full-stack TypeScript engineer building production-ready web systems with Next.js, React, Node.js, PostgreSQL, Supabase, tRPC, Drizzle, and Cloudflare. Open to engineering roles.";

const siteTitle = "Omri Jukin - Full-Stack TypeScript Engineer";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  metadataBase: new URL("https://omrijukin.com"),
  openGraph: {
    title: siteTitle,
    description:
      "Production-minded full-stack engineer building TypeScript systems across frontend, backend, data, integrations, internal tools, and deployment.",
    url: "https://omrijukin.com",
    siteName: "Omri Jukin",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description:
      "Production-minded full-stack engineer building TypeScript systems across frontend, backend, data, integrations, internal tools, and deployment.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistDisplay.variable} ${inter.variable} ${jetBrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeScript />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
