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
}: AdminLayoutProps) {
  // Check session and role server-side
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const role = (session.user.role as string) || "visitor";

  // Check if user has admin access
  if (!canAccessAdminSync(role)) {
    redirect("/403");
  }

  // User is authenticated and has admin role, render layout
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
