import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import ClientLayout from "#/styledComponents/ClientLayout";
import { ClientLayoutProps } from "#/styledComponents/ClientLayout/ClientLayout.types";
import { NextIntlClientProvider } from "next-intl";

interface Messages {
  about?: {
    title?: string;
  };
  [key: string]: unknown;
}

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
  description:
    "Learn a little about me, my background, skills, and professional journey",
};

interface Props extends ClientLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  // Load messages with proper error handling - ensure we pass the locale explicitly
  let messages: Messages = {};
  try {
    // Load messages directly from the locale file to ensure correct locale
    messages = (await import(`../../../locales/${locale}.json`)).default;
    console.log(`Loaded messages for locale ${locale}:`, Object.keys(messages));
    console.log(`Sample about title for ${locale}:`, messages.about?.title);
  } catch (error) {
    console.error(`Error loading messages for locale ${locale}:`, error);
    // Fallback to English messages
    try {
      messages = (await import(`../../../locales/en.json`)).default;
      console.log("Fallback to English messages");
    } catch (fallbackError) {
      console.error("Failed to load fallback messages:", fallbackError);
      messages = {};
    }
  }

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider
          messages={messages}
          locale={locale}
          timeZone="UTC"
        >
          <ClientLayout>{children}</ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
