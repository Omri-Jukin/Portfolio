import type { Metadata } from "next";
import "../globals.css";
import "flag-icons/css/flag-icons.min.css";
import { NextIntlClientProvider } from "next-intl";
import { anton, inter } from "$/fonts";
import ClientLayout from "&/ClientLayout/ClientLayout";
import ThemeRegistry from "&/ThemeRegistry";
import { getMessages, getTranslations } from "next-intl/server";
import StructuredData from "./structured-data";
import SkipLink from "~/SkipLink";

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
      "full stack developer",
      "software developer",
      "software architect",
      "web development",
      "web developer",
      "react developer",
      "next.js developer",
      "typescript developer",
      "javascript developer",
      "html developer",
      "css developer",
      "tailwind developer",
      "node.js developer",
      "express developer",
      "mongodb developer",
      "mysql developer",
      "postgresql developer",
      "python developer",
      "java developer",
      "c# developer",
      "portfolio",
      "omri jukin",
      "omri jukin portfolio",
      "omri jukin fullstack developer",
      "omri jukin full stack developer",
      "omri jukin web developer",
      "omri jukin react developer",
      "omri jukin next.js developer",
      "omri jukin typescript developer",
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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7C3AED" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Omri Jukin" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <StructuredData />
      </head>
      <body className={`${inter.variable} ${anton.variable} antialiased`}>
        <SkipLink targetId="main-content" label="Skip to main content" />
        <SkipLink targetId="navigation" label="Skip to navigation" />
        <ThemeRegistry>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ClientLayout>{children}</ClientLayout>
          </NextIntlClientProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
