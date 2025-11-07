import AdminLayoutClient from "./components/AdminLayoutClient";

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin UI Layout Component
 * Provides breadcrumbs, page title, and ProjectCostCalculator FAB
 *
 * Note: Authentication and authorization are handled by (admin)/layout.tsx
 * This component only handles the UI layout
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
