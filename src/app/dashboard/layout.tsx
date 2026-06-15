import * as React from "react";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { canAccessAdminSync } from "#/lib/auth/rbac";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user.role as string) || "visitor";
  if (!canAccessAdminSync(role)) {
    redirect("/403");
  }

  return <AdminShell>{children}</AdminShell>;
}
