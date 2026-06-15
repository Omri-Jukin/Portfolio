import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/content", label: "Content" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/work-experiences", label: "Experience" },
  { href: "/dashboard/skills", label: "Skills" },
  { href: "/dashboard/blog", label: "Blog" },
];

interface AdminShellProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function AdminShell({
  children,
  title = "Dashboard",
  description = "Manage portfolio content and private service workflows.",
  className,
}: AdminShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/90 backdrop-blur">
        <Container className="flex min-h-16 flex-wrap items-center justify-between gap-4 py-3">
          <Link href="/dashboard" className="font-display font-semibold">
            Omri CMS
          </Link>
          <nav aria-label="Dashboard navigation" className="order-3 w-full lg:order-2 lg:w-auto">
            <ul className="flex gap-1 overflow-x-auto">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex h-9 items-center rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="order-2 lg:order-3">
            <ThemeToggle />
          </div>
        </Container>
      </header>

      <Container className={cn("py-8", className)}>
        <div className="mb-8 max-w-3xl space-y-2">
          <p className="font-mono text-xs font-medium uppercase text-accent">
            Admin
          </p>
          <h1 className="font-display text-3xl font-semibold">{title}</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
      </Container>
    </div>
  );
}
