import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createPost, getPostBySlug, updatePost } from "$/db/blog/blog";
import { getDB } from "$/db/client";
import { PublicContentBlockManager } from "$/db/publicContent/PublicContentBlockManager";
import { ProjectManager } from "$/db/projects/ProjectManager";
import { users } from "$/db/schema/schema.tables";
import { projectCreateSchema } from "#/lib/schemas";

const configuredApiKey =
  process.env.OPENCLAW_API_KEY ?? process.env.BLOG_API_KEY ?? "";

const isApiKeyConfigured =
  configuredApiKey.length > 0 &&
  !configuredApiKey.includes("your-secret-api-key-change-in-production");

const BlogPostSchema = z.object({
  type: z.literal("blog.post"),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .max(220)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  excerpt: z.string().max(500).optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  tags: z.array(z.string().min(1).max(60)).default([]),
  imageUrl: z.string().url().nullable().optional(),
  imageAlt: z.string().max(200).nullable().optional(),
});

const PublicContentBlockSchema = z.object({
  type: z.literal("public_content.block"),
  id: z.string().min(1),
  data: z
    .object({
      title: z.string().max(1000).nullable().optional(),
      subtitle: z.string().max(2000).nullable().optional(),
      body: z.string().max(8000).nullable().optional(),
      href: z.string().max(1000).nullable().optional(),
      ctaLabel: z.string().max(200).nullable().optional(),
      items: z.array(z.unknown()).optional(),
      metadata: z.record(z.string(), z.unknown()).optional(),
      displayOrder: z.number().int().min(0).optional(),
      isVisible: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided.",
    }),
});

const PublicContentBlockCreateSchema = z.object({
  type: z.literal("public_content.block.create"),
  data: z.object({
    id: z.string().min(1).max(160),
    page: z.string().min(1).max(100),
    locale: z.string().min(2).max(12).default("en"),
    sectionKey: z.string().min(1).max(100),
    blockKey: z.string().min(1).max(100),
    blockType: z.enum([
      "section",
      "hero",
      "metric",
      "card",
      "link",
      "question",
      "list",
      "cta",
    ]),
    title: z.string().max(1000).nullable().optional(),
    subtitle: z.string().max(2000).nullable().optional(),
    body: z.string().max(8000).nullable().optional(),
    href: z.string().max(1000).nullable().optional(),
    ctaLabel: z.string().max(200).nullable().optional(),
    items: z.array(z.unknown()).default([]),
    metadata: z.record(z.string(), z.unknown()).default({}),
    displayOrder: z.number().int().min(0).default(0),
    isVisible: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
  }),
});

const ProjectCreateRequestSchema = z.object({
  type: z.literal("project.create"),
  data: projectCreateSchema,
});

const ProjectUpdateRequestSchema = z.object({
  type: z.literal("project.update"),
  id: z.string().min(1),
  data: projectCreateSchema.partial(),
});

const RequestSchema = z.discriminatedUnion("type", [
  BlogPostSchema,
  PublicContentBlockSchema,
  PublicContentBlockCreateSchema,
  ProjectCreateRequestSchema,
  ProjectUpdateRequestSchema,
]);

const DeleteRequestSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("public_content.block.delete"),
    id: z.string().min(1),
  }),
  z.object({
    type: z.literal("project.delete"),
    id: z.string().min(1),
  }),
]);

function cleanProjectInput<T extends Record<string, unknown>>(input: T) {
  return {
    ...input,
    githubUrl: input.githubUrl === "" ? undefined : input.githubUrl,
    liveUrl: input.liveUrl === "" ? undefined : input.liveUrl,
    demoUrl: input.demoUrl === "" ? undefined : input.demoUrl,
    documentationUrl:
      input.documentationUrl === "" ? undefined : input.documentationUrl,
    caseStudySlug: input.caseStudySlug === "" ? undefined : input.caseStudySlug,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function unauthorized(message = "Invalid API key") {
  return NextResponse.json({ error: message }, { status: 401 });
}

async function authenticate(request: NextRequest) {
  if (!isApiKeyConfigured) {
    return NextResponse.json(
      { error: "OPENCLAW_API_KEY or BLOG_API_KEY is not configured" },
      { status: 503 }
    );
  }

  const apiKey =
    request.headers.get("x-api-key") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!apiKey || apiKey !== configuredApiKey) {
    return unauthorized();
  }

  return null;
}

async function getAdminAuthor() {
  const db = await getDB();
  const [adminUser] = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
    })
    .from(users)
    .where(eq(users.role, "admin"))
    .limit(1);

  if (!adminUser) {
    throw new Error("No admin user found. Run npm run db:seed first.");
  }

  const displayName = [adminUser.firstName, adminUser.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    id: adminUser.id,
    name: displayName || adminUser.email,
  };
}

async function upsertBlogPost(input: z.infer<typeof BlogPostSchema>) {
  const slug = input.slug ?? slugify(input.title);
  if (!slug) {
    throw new Error("Unable to generate a slug from the title.");
  }

  const author = await getAdminAuthor();

  try {
    const existingPost = await getPostBySlug(slug);
    const updatedPost = await updatePost({
      id: existingPost.id,
      title: input.title,
      slug,
      content: input.content,
      excerpt: input.excerpt,
      status: input.status,
      tags: input.tags,
      imageUrl: input.imageUrl ?? undefined,
      imageAlt: input.imageAlt ?? undefined,
    });

    return { action: "updated", post: updatedPost };
  } catch (error) {
    if (!(error instanceof Error) || error.message !== "Post not found.") {
      throw error;
    }

    const createdPost = await createPost({
      title: input.title,
      slug,
      content: input.content,
      excerpt: input.excerpt,
      status: input.status,
      tags: input.tags,
      imageUrl: input.imageUrl ?? undefined,
      imageAlt: input.imageAlt ?? undefined,
      author: author.name,
      authorId: author.id,
    });

    return { action: "created", post: createdPost };
  }
}

export async function POST(request: NextRequest) {
  const authError = await authenticate(request);
  if (authError) return authError;

  const parsed = RequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    if (parsed.data.type === "blog.post") {
      const result = await upsertBlogPost(parsed.data);

      return NextResponse.json({
        success: true,
        type: parsed.data.type,
        action: result.action,
        post: {
          id: result.post.id,
          title: result.post.title,
          slug: result.post.slug,
          status: result.post.status,
          publishedAt: result.post.publishedAt,
          updatedAt: result.post.updatedAt,
        },
      });
    }

    if (parsed.data.type === "public_content.block.create") {
      const author = await getAdminAuthor();
      const block = await PublicContentBlockManager.create({
        ...parsed.data.data,
        createdBy: author.id,
      });

      return NextResponse.json({
        success: true,
        type: parsed.data.type,
        action: "created",
        block,
      });
    }

    if (parsed.data.type === "public_content.block") {
      const block = await PublicContentBlockManager.update(
        parsed.data.id,
        parsed.data.data
      );

      if (!block) {
        return NextResponse.json(
          { error: "Public content block not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        type: parsed.data.type,
        action: "updated",
        block,
      });
    }

    if (parsed.data.type === "project.create") {
      const author = await getAdminAuthor();
      const project = await ProjectManager.create({
        ...cleanProjectInput(parsed.data.data),
        createdBy: author.id,
      });

      return NextResponse.json({
        success: true,
        type: parsed.data.type,
        action: "created",
        project,
      });
    }

    const project = await ProjectManager.update(
      parsed.data.id,
      cleanProjectInput(parsed.data.data)
    );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      type: parsed.data.type,
      action: "updated",
      project,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process OpenClaw request",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await authenticate(request);
  if (authError) return authError;

  const parsed = DeleteRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    if (parsed.data.type === "public_content.block.delete") {
      const deleted = await PublicContentBlockManager.delete(parsed.data.id);
      if (!deleted) {
        return NextResponse.json(
          { error: "Public content block not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        type: parsed.data.type,
        action: "deleted",
        id: parsed.data.id,
      });
    }

    const deleted = await ProjectManager.delete(parsed.data.id);
    if (!deleted) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      type: parsed.data.type,
      action: "deleted",
      id: parsed.data.id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete OpenClaw resource",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get("resource");
  const id = searchParams.get("id");

  if (resource) {
    const authError = await authenticate(request);
    if (authError) return authError;
  }

  if (resource === "public_content.block") {
    const page = searchParams.get("page") || "home";
    const locale = searchParams.get("locale") || "en";
    const sectionKey = searchParams.get("sectionKey");
    const blocks = sectionKey
      ? await PublicContentBlockManager.getBySection({
          page,
          locale,
          sectionKey,
          visibleOnly: false,
        })
      : await PublicContentBlockManager.getByPage({
          page,
          locale,
          visibleOnly: false,
        });
    const filteredBlocks = id
      ? blocks.filter((block) => block.id === id)
      : blocks;

    return NextResponse.json({
      success: true,
      resource,
      count: filteredBlocks.length,
      blocks: filteredBlocks,
    });
  }

  if (resource === "project") {
    if (id) {
      const project = await ProjectManager.getBySlug(id, false);
      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        resource,
        project,
      });
    }

    const featuredOnly = searchParams.get("featured") !== "false";
    const projects = featuredOnly
      ? await ProjectManager.getFeatured(false)
      : await ProjectManager.getAll(false);

    return NextResponse.json({
      success: true,
      resource,
      count: projects.length,
      projects,
    });
  }

  return NextResponse.json({
    name: "Portfolio OpenClaw Content API",
    url: "/api/openclaw/portfolio",
    auth: {
      header: "x-api-key",
      env: "OPENCLAW_API_KEY",
      fallbackEnv: "BLOG_API_KEY",
    },
    requests: {
      blogPost: {
        type: "blog.post",
        title: "Post title",
        content: "Markdown body",
        slug: "optional-custom-slug",
        excerpt: "Optional short summary",
        status: "draft | published",
        tags: ["tag"],
        imageUrl: null,
        imageAlt: null,
      },
      publicContentBlock: {
        type: "public_content.block",
        id: "home-hero-main",
        data: {
          title: "Updated title",
          subtitle: "Updated subtitle",
          body: "Updated body",
          isVisible: true,
        },
      },
      publicContentBlockCreate: {
        type: "public_content.block.create",
        data: {
          id: "home-example-card",
          page: "home",
          locale: "en",
          sectionKey: "selected-work",
          blockKey: "example-card",
          blockType: "card",
          title: "Example",
          displayOrder: 25,
        },
      },
      projectCreate: {
        type: "project.create",
        data: {
          title: "Project title",
          subtitle: "Short homepage subtitle",
          description: "Project summary",
          technologies: ["Next.js", "TypeScript"],
          categories: ["full-stack"],
          projectType: "personal",
          startDate: "2026-01-01",
          keyFeatures: ["Feature"],
          isVisible: true,
          isFeatured: true,
        },
      },
      projectUpdate: {
        type: "project.update",
        id: "portfolio-platform",
        data: {
          title: "Updated title",
          isFeatured: true,
        },
      },
    },
  });
}
