import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCustomLinkBySlug } from "#/lib/db/intakes/customLinks";
import CustomLinkIntakeForm from "./CustomLinkIntakeForm";

export const metadata: Metadata = {
  title: "Private Intake Link",
  robots: {
    index: false,
    follow: false,
  },
};

type CustomLinkPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ServicesCustomLinkIntakePage({
  params,
}: CustomLinkPageProps) {
  const { slug } = await params;

  try {
    const customLink = await getCustomLinkBySlug(slug);

    if (!customLink || customLink.expiresAt < new Date()) {
      notFound();
    }

    const now = new Date();
    const maxAge = Math.floor(
      (customLink.expiresAt.getTime() - now.getTime()) / 1000
    );

    return (
      <CustomLinkIntakeForm
        customLink={{
          id: customLink.id,
          slug: customLink.slug,
          email: customLink.email,
          firstName: customLink.firstName ?? null,
          lastName: customLink.lastName ?? null,
          organizationName: customLink.organizationName ?? null,
          organizationWebsite: customLink.organizationWebsite ?? null,
          hiddenSections: customLink.hiddenSections ?? [],
          expiresAt: customLink.expiresAt,
          token: customLink.token,
          maxAge,
        }}
      />
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[ServicesCustomLinkIntakePage] Error:", error);
    }

    notFound();
  }
}
