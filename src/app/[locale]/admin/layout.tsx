import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { canAccessAdminSync } from "#/lib/auth/rbac";
import AdminLayoutClient from "./components/AdminLayoutClient";

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps) {
  const { locale } = await params;

  // Check session and role server-side
  const session = await auth();

  if (!session || !session.user) {
    redirect(`/${locale}/login`);
  }

  const role = (session.user.role as string) || "visitor";

  // Check if user has admin access
  if (!canAccessAdminSync(role)) {
    redirect(`/${locale}/403`);
  }

  // User is authenticated and has admin role, render layout
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
