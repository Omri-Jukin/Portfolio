import type { Metadata } from "next";
import { Container, Section, SectionHeader } from "@/components/ui";
import { ProposalSharedView } from "./ProposalSharedView";

export const metadata: Metadata = {
  title: "Private Proposal - Omri Jukin",
  robots: {
    index: false,
    follow: false,
  },
};

type ProposalPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function ServicesProposalPage({
  params,
}: ProposalPageProps) {
  const { token } = await params;

  return (
    <Section className="pt-14 sm:pt-20">
      <Container>
        <SectionHeader
          eyebrow="Private proposal"
          title="Shared proposal"
          subtitle="This page is available only through the private proposal link."
        />
        <div className="mt-8">
          <ProposalSharedView token={token} />
        </div>
      </Container>
    </Section>
  );
}
