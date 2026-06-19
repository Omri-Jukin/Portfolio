import type { Metadata } from "next";
import { Card, Container, CursorPressLink, Section, SectionHeader } from "@/components/ui";
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
            <CursorPressLink
              href={`mailto:${PROFILE_LINKS.EMAIL}`}
              variant="solid"
            >
              Email Omri
            </CursorPressLink>
            <CursorPressLink href="/contact">
              Open contact page
            </CursorPressLink>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
