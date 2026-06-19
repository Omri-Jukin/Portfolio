import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge, Chip, Container, CursorPressLink, Section } from "@/components/ui";
import { getPostBySlug } from "$/db/blog/blog";

export const dynamic = "force-dynamic";

type BlogPostParams = {
  params: Promise<{ slug: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

async function getPublishedPost(slug: string) {
  try {
    const post = await getPostBySlug(slug);
    return post.status === "published" ? post : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: BlogPostParams): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) {
    return {
      title: "Engineering note not found - Omri Jukin",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = post.excerpt ?? post.content.slice(0, 160);

  return {
    title: `${post.title} - Omri Jukin`,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} - Omri Jukin`,
      description,
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostParams) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = post.publishedAt ?? post.createdAt;

  return (
    <Section className="pt-14 sm:pt-20">
      <Container>
        <article className="mx-auto max-w-3xl">
          <CursorPressLink href="/blog" size="sm" className="mb-8">
            Back to notes
          </CursorPressLink>

          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent">{dateFormatter.format(publishedDate)}</Badge>
            {post.tags?.map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </div>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            {post.title}
          </h1>

          <p className="mt-4 font-mono text-xs uppercase text-muted-foreground">
            By {post.author}
          </p>

          {post.excerpt ? (
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {post.excerpt}
            </p>
          ) : null}

          <div className="mt-10 whitespace-pre-line text-base leading-8 text-foreground">
            {post.content}
          </div>
        </article>
      </Container>
    </Section>
  );
}
