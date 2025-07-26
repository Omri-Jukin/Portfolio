import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { geistSans, geistMono } from "#/lib/fonts";
import ClientLayout from "&/ClientLayout/ClientLayout";
import { getMessages, getTranslations } from "next-intl/server";
import StructuredData from "./structured-data";

export interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "full stack developer",
      "web development",
      "React",
      "Next.js",
      "TypeScript",
      "portfolio",
    ],
    authors: [{ name: "Omri Jukin" }],
    creator: "Omri Jukin",
    publisher: "Omri Jukin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://omrijukin.com"),
    alternates: {
      canonical: "/",
      languages: {
        en: "/en",
        es: "/es",
        fr: "/fr",
        he: "/he",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: locale,
      siteName: "Omri Jukin Portfolio",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  // Define RTL locales explicitly to avoid hydration issues
  const rtlLocales = ["he", "ar", "fa", "ur"];
  const isRTL = rtlLocales.includes(locale);

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <head>
        <StructuredData />
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
