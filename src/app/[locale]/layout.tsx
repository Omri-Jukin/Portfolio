import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { geistSans, geistMono } from "#/lib/fonts";
import ClientLayout from "./ClientLayout";
import { en, es, fr, he } from "#/locales";

export interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = { en, es, fr, he }[locale] || en;
  const metadata: Metadata = messages.metadata;
  const isRTL = locale === "he";
  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <head>
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description as string} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientLayout>{children}</ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
