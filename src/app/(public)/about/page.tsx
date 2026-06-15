import type { Metadata } from "next";
import { Card, Container, Section, SectionHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "About - Omri Jukin",
  description:
    "About Omri Jukin, a full-stack engineer focused on production systems, TypeScript, backend boundaries, internal tools, and practical product ownership.",
  alternates: {
    canonical: "/about",
  },
};

const principles = [
  {
    title: "Ownership over tickets",
    body: "I care about the product flow, data model, API boundaries, operations, and how the work will be maintained after it ships.",
  },
  {
    title: "Typed systems with runtime guardrails",
    body: "TypeScript is the baseline. External boundaries still need parsing, validation, and explicit failure behavior.",
  },
  {
    title: "Pragmatic delivery",
    body: "The best architecture is the one that keeps the current system understandable while leaving room for the next real requirement.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Section className="pt-14 sm:pt-20">
        <Container>
          <SectionHeader
            eyebrow="About"
            title="Full-stack engineer focused on production systems and practical ownership."
            subtitle="I work best where frontend, backend, data, integrations, and operational tooling need to move together."
          />
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            {principles.map((principle) => (
              <Card key={principle.title} className="p-5">
                <h2 className="font-display text-xl font-semibold">
                  {principle.title}
                </h2>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {principle.body}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
