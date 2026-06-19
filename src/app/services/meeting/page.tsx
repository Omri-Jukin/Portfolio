import type { Metadata } from "next";
import { Card, CardContent, Container, CursorPressLink, Section, SectionHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Private Meeting - Omri Jukin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ServicesMeetingPage() {
  return (
    <Section className="pt-14 sm:pt-20">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <SectionHeader
            eyebrow="Private meeting"
            title="Schedule a scoped project call"
            subtitle="This booking route is intentionally unlisted and excluded from public search."
          />
          <CursorPressLink href="/contact">
            Contact instead
          </CursorPressLink>
        </div>

        <Card className="mt-8 overflow-hidden">
          <CardContent className="p-0">
            <iframe
              title="Schedule a meeting with Omri Jukin"
              src="https://calendly.com/omrijukin/30min"
              className="h-[760px] w-full border-0"
            />
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
