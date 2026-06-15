import { redirect } from "next/navigation";

export default async function ReviewBridgePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  redirect(id ? `/dashboard/intakes/${id}` : "/dashboard/intakes");
}
