import { IntakeDetailClient } from "./IntakeDetailClient";

export default async function IntakeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <IntakeDetailClient id={id} />;
}
