import Link from "next/link";
import type { Metadata } from "next";
import { Card, Container, Section, SectionHeader } from "@/components/ui";
import { PROFILE_LINKS } from "$/constants";

export const metadata: Metadata = {
  title: "Private Intake - Omri Jukin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ServicesIntakePage() {
  return (
    <Section className="pt-14 sm:pt-20">
      <Container>
        <SectionHeader
          eyebrow="Private intake"
          title="Use a private intake link or send role context directly."
          subtitle="This route is intentionally unlisted and excluded from public search."
        />
        <Card className="mt-8 max-w-2xl p-5">
          <p className="leading-7 text-muted-foreground">
            Intake forms are opened through private links. For hiring
            conversations, email the role, stack, team context, ownership
            expectations, and interview process.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={`mailto:${PROFILE_LINKS.EMAIL}`}
              className="inline-flex h-10 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Email Omri
            </a>
            <Link
              href="/contact"
              className="inline-flex h-10 items-center rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              Open contact page
            </Link>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
