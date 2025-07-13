import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import ThemeProvider from "#/Components/ThemeProvider";
import { geistSans, geistMono } from "#/lib/fonts";

export const metadata: Metadata = {
  title: "Omri's Portfolio",
  description: "Learn a little about me, my background, skills, and journey",
};

export interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  // Load messages directly from the locale file - this was working before
  let messages;
  try {
    messages = (await import(`../../../locales/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    // Fallback to English messages
    messages = (await import(`../../../locales/en.json`)).default;
  }

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
