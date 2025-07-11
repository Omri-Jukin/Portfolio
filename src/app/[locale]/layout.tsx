import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DarkModeToggle from "@/components/DarkModeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Box } from "@mui/material";
import { NextIntlClientProvider, useMessages, useLocale } from "next-intl";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Omri's Portfolio",
  description: "Learn a little about me, my background, skills, and professional journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = useMessages();
  const locale = useLocale();

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2 }}>
            <DarkModeToggle />
            <LanguageSwitcher />
          </Box>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
