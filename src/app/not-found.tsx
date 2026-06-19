import { Container, CursorPressLink, Section, SectionHeader } from "@/components/ui";

export default function NotFoundPage() {
  return (
    <Section className="min-h-[70vh] pt-20">
      <Container>
        <SectionHeader
          eyebrow="404"
          title="Page not found"
          subtitle="The route does not exist, or it was removed during the portfolio route cleanup."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <CursorPressLink href="/" variant="solid">
            Go home
          </CursorPressLink>
          <CursorPressLink href="/contact">
            Contact Omri
          </CursorPressLink>
        </div>
      </Container>
    </Section>
  );
}
