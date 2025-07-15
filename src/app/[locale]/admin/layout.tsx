import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Admin layout wrapper - add sidebar/nav here if needed */}
      {children}
    </div>
  );
}
