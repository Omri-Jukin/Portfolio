import { notFound } from "next/navigation";
import { getCustomLinkBySlug } from "#/lib/db/intakes/customLinks";
import CustomLinkIntakeForm from "./CustomLinkIntakeForm";

interface CustomLinkPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

/**
 * Server Component for Custom Link Intake Form
 * Validates the custom link server-side before rendering the form
 */
export default async function CustomLinkIntakePage({
  params,
}: CustomLinkPageProps) {
  const { slug } = await params;

  try {
    // Server-side validation: Get custom link from database
    const customLink = await getCustomLinkBySlug(slug);

    if (!customLink) {
      // Link not found - show custom not-found page
      notFound();
    }

    // Check if link is expired
    if (customLink.expiresAt < new Date()) {
      // Link expired - show custom not-found page
      notFound();
    }

    // Valid custom link - pass token to component
    // The component will call the route handler to set the cookie client-side
    // This avoids the limitation of not being able to set cookies in page components

    // Calculate maxAge server-side (this is consistent for server/client)
    // Using a fixed timestamp calculation to avoid hydration mismatches
    const now = new Date();
    const maxAge = Math.floor(
      (customLink.expiresAt.getTime() - now.getTime()) / 1000
    );

    // Render the dedicated form page
    return (
      <CustomLinkIntakeForm
        customLink={{
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
    // Log error for debugging
    if (process.env.NODE_ENV === "development") {
      console.error("[CustomLinkIntakePage] Error:", error);
    }

    // On error, show not-found page for security
    notFound();
  }
}
