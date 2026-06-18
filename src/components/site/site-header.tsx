"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { PROFILE_LINKS } from "$/constants";

const navItems = [
  { href: "/#work", label: "Work" },
  { href: "/resume", label: "Resume" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
    >
      <path d="M12 .5A11.5 11.5 0 0 0 8.36 22.9c.58.1.79-.25.79-.56v-2.02c-3.21.7-3.89-1.38-3.89-1.38-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.11-.75.41-1.26.74-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18A11.1 11.1 0 0 1 12 6.08c.98 0 1.95.13 2.87.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.69.42.36.79 1.07.79 2.16v3.04c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
    >
      <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.67H9.34V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.54V9H7.1v11.45ZM22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0Z" />
    </svg>
  );
}

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-200",
        isScrolled
          ? "border-b border-border bg-background/85 backdrop-blur"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <Container className="flex min-h-16 flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 md:flex-nowrap md:py-0">
        <Link
          href="/"
          className="font-display text-sm font-semibold text-foreground"
        >
          Omri Jukin
        </Link>

        <nav
          aria-label="Primary navigation"
          className="order-last -mx-1 w-full overflow-x-auto md:order-none md:mx-0 md:w-auto md:overflow-visible"
        >
          <ul className="flex min-w-max items-center gap-1 px-1 md:min-w-0 md:px-0">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href={PROFILE_LINKS.GITHUB}
            aria-label="GitHub profile"
            target="_blank"
            rel="noreferrer"
            className="hidden h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent/10 hover:text-accent sm:inline-flex"
          >
            <GitHubIcon />
          </Link>
          <Link
            href={PROFILE_LINKS.LINKEDIN}
            aria-label="LinkedIn profile"
            target="_blank"
            rel="noreferrer"
            className="hidden h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent/10 hover:text-accent sm:inline-flex"
          >
            <LinkedInIcon />
          </Link>
          <ThemeToggle />
          <Link
            href="/resume"
            className="hidden h-8 items-center justify-center rounded-md bg-accent px-3 text-xs font-medium text-accent-foreground shadow-[var(--shadow-subtle)] transition-[background-color,transform] duration-150 hover:bg-accent/90 motion-safe:hover:-translate-y-px sm:inline-flex"
          >
            Resume
          </Link>
        </div>
      </Container>
    </header>
  );
}
