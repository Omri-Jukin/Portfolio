import type { Metadata, Viewport } from "next";
import "./globals.css";
import { inter } from "$/fonts";

const siteDescription =
  "Full-stack TypeScript engineer building production-ready web systems with Next.js, React, Node.js, PostgreSQL, Supabase, tRPC, Drizzle, and Cloudflare. Open to engineering roles.";

export const metadata: Metadata = {
  title: "Omri Jukin — Full-Stack TypeScript Engineer",
  description: siteDescription,
  metadataBase: new URL("https://omrijukin.com"),
  openGraph: {
    title: "Omri Jukin — Full-Stack TypeScript Engineer",
    description:
      "Production-minded full-stack engineer building TypeScript systems across frontend, backend, data, integrations, internal tools, and deployment.",
    url: "https://omrijukin.com",
    siteName: "Omri Jukin",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Omri Jukin — Full-Stack TypeScript Engineer",
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
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
