import type { Metadata } from "next";
import "../globals.css";
import "flag-icons/css/flag-icons.min.css";
import { NextIntlClientProvider } from "next-intl";
import ClientLayout from "&/ClientLayout/ClientLayout";
import { getMessages, getTranslations } from "next-intl/server";
import StructuredData from "./structured-data";
import { SessionProvider } from "../providers/SessionProvider";
import AdminFAB from "~/AdminFAB/AdminFAB";

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
      "full-stack engineer",
      "TypeScript engineer",
      "Next.js developer",
      "React developer",
      "Node.js developer",
      "PostgreSQL",
      "Supabase",
      "tRPC",
      "Drizzle",
      "internal tools",
      "Omri Jukin",
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

  const rtlLocales = ["he", "ar", "fa", "ur"];
  const isRTL = rtlLocales.includes(locale);
  const direction = isRTL ? "rtl" : "ltr";

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(locale)};document.documentElement.dir=${JSON.stringify(direction)};`,
        }}
      />
      <StructuredData />
      <SessionProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientLayout>
            {children}
            <AdminFAB />
          </ClientLayout>
        </NextIntlClientProvider>
      </SessionProvider>
    </>
  );
}
