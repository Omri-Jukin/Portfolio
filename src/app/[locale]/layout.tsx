import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import ClientProviders from "./ClientProviders";
import { geistSans, geistMono } from "#/lib/fonts";
import ClientLayout from "./ClientLayout";
import { en, es, fr, he } from "#/locales";

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
  const messages = { en, es, fr, he }[locale] || en;
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientProviders>
            <ClientLayout>{children}</ClientLayout>
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
