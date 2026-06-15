import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PROFILE_LINKS } from "$/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-2xl space-y-4">
            <p className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
              Let&apos;s talk
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              Open to full-stack, frontend platform, and product engineering
              roles where ownership and production judgment matter.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`mailto:${PROFILE_LINKS.EMAIL}`}
                className="text-sm font-medium text-accent underline-offset-4 hover:underline"
              >
                {PROFILE_LINKS.EMAIL}
              </Link>
              <Link
                href="/resume"
                className="text-sm font-medium text-accent underline-offset-4 hover:underline"
              >
                Resume PDF
              </Link>
              <Link
                href={PROFILE_LINKS.GITHUB}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-accent underline-offset-4 hover:underline"
              >
                GitHub
              </Link>
              <Link
                href={PROFILE_LINKS.LINKEDIN}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-accent underline-offset-4 hover:underline"
              >
                LinkedIn
              </Link>
            </div>
          </div>

          <p className="font-mono text-xs leading-6 text-muted-foreground">
            This site: Next.js 15 / tRPC / Drizzle / Postgres / Cloudflare
          </p>
        </div>
      </Container>
    </footer>
  );
}
