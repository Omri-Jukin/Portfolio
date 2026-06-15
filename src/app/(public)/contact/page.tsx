import type { Metadata } from "next";
import { Suspense } from "react";
import { Card, Container, Section, SectionHeader } from "@/components/ui";
import { PROFILE_LINKS } from "$/constants";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact - Omri Jukin",
  description:
    "Contact Omri Jukin for full-stack TypeScript engineering roles, recruiter outreach, and focused technical discussions.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <Section className="pt-14 sm:pt-20">
      <Container>
        <SectionHeader
          eyebrow="Contact"
          title="Send the role, system, or technical context."
          subtitle="Email or LinkedIn are the best paths for recruiter conversations and focused technical discussions."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <Suspense>
            <ContactForm />
          </Suspense>

          <div className="grid content-start gap-4">
            <Card className="p-5">
              <h2 className="font-display text-xl font-semibold">Email</h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                Best for role details, project context, and written technical
                briefs.
              </p>
              <a
                href={`mailto:${PROFILE_LINKS.EMAIL}`}
                className="mt-5 inline-flex text-sm font-medium text-accent underline-offset-4 hover:underline"
              >
                {PROFILE_LINKS.EMAIL}
              </a>
            </Card>
            <Card className="p-5">
              <h2 className="font-display text-xl font-semibold">LinkedIn</h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                Best for recruiter outreach, role fit, and quick scheduling.
              </p>
              <a
                href={PROFILE_LINKS.LINKEDIN}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex text-sm font-medium text-accent underline-offset-4 hover:underline"
              >
                Open LinkedIn
              </a>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
}
