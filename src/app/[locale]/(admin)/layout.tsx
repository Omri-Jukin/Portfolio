import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { canAccessAdminSync } from "#/lib/auth/rbac";

interface AdminGroupLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

/**
 * Layout for all admin routes
 * This layout protects all routes under (admin) group
 * Only users with admin role can access these routes
 */
export default async function AdminGroupLayout({
  children,
  params,
}: AdminGroupLayoutProps) {
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

  // User is authenticated and has admin role, render children
  return <>{children}</>;
}
