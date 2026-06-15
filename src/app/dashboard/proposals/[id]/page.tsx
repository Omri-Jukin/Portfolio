import { ProposalEditorClient } from "../ProposalEditorClient";

export default async function ProposalEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProposalEditorClient proposalId={id} />;
}
