import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/content", label: "Content" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/contact-inquiries", label: "Inquiries" },
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
    <div className="gem-admin min-h-screen overflow-x-clip bg-background text-foreground">
      <header className="gem-band border-b border-border bg-background/90 backdrop-blur">
        <Container className="flex min-h-16 min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
          <Link href="/dashboard" className="font-display font-semibold">
            Omri CMS
          </Link>
          <nav
            aria-label="Dashboard navigation"
            className="order-3 w-full max-w-full overflow-x-auto lg:order-2 lg:w-auto"
          >
            <ul className="flex min-w-max gap-1 px-0.5">
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

      <Container className={cn("min-w-0 py-6 sm:py-8", className)}>
        <div className="mb-6 max-w-3xl space-y-2 sm:mb-8">
          <p className="font-mono text-xs font-medium uppercase text-ruby">
            Admin
          </p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">
            {title}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
      </Container>
    </div>
  );
}
