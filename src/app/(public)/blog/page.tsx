import Link from "next/link";
import type { Metadata } from "next";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Chip,
  Container,
  CursorPressLink,
  EmptyState,
  Section,
  SectionHeader,
} from "@/components/ui";
import { getPublishedPosts } from "$/db/blog/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Engineering Notes - Omri Jukin",
  description:
    "Engineering notes from Omri Jukin on full-stack TypeScript systems, architecture, product ownership, and implementation trade-offs.",
  alternates: {
    canonical: "/blog",
  },
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

async function getPosts() {
  try {
    return await getPublishedPosts();
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <Section className="pt-14 sm:pt-20">
        <Container>
          <SectionHeader
            eyebrow="Notes"
            title="Engineering notes"
            subtitle="Short-form technical writing on architecture, full-stack systems, product workflows, and implementation trade-offs."
          />
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          {posts.length === 0 ? (
            <EmptyState>
              Engineering notes are not published yet. For now, review selected
              case studies and project architecture.
            </EmptyState>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <Card key={post.id} className="transition-colors hover:border-accent/40">
                  <CardHeader>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge tone="accent">
                        {post.publishedAt
                          ? dateFormatter.format(post.publishedAt)
                          : dateFormatter.format(post.createdAt)}
                      </Badge>
                      {post.tags?.slice(0, 4).map((tag) => (
                        <Chip key={tag}>{tag}</Chip>
                      ))}
                    </div>
                    <CardTitle>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="underline-offset-4 hover:text-accent hover:underline"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                      {post.excerpt ?? post.content.slice(0, 220)}
                    </p>
                    <CursorPressLink
                      href={`/blog/${post.slug}`}
                      variant="outline"
                      size="sm"
                      className="mt-4"
                    >
                      Read note
                    </CursorPressLink>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
