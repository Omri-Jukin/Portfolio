import { NextRequest, NextResponse } from "next/server";
import { createPost } from "$/db/blog/blog";
import { getDB } from "$/db/client";
import { eq } from "drizzle-orm";
import { users } from "$/db/schema/schema.tables";

// Simple API key authentication for external clients
const API_KEY =
  process.env.BLOG_API_KEY || "your-secret-api-key-change-in-production";

export async function POST(request: NextRequest) {
  try {
    // Get API key from headers
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey || apiKey !== API_KEY) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    const { title, content, excerpt, tags, imageUrl, imageAlt } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Get database client
    const dbClient = await getDB();

    // Find the first admin user (or create a default one)
    const adminUser = await dbClient.query.users.findFirst({
      where: eq(users.role, "admin"),
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: "No admin user found. Please create an admin user first." },
        { status: 500 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Create the blog post
    const newPost = await createPost({
      title,
      slug,
      content,
      excerpt: excerpt || null,
      status: "published", // Auto-publish posts from API
      tags: tags ? (Array.isArray(tags) ? tags : [tags]) : undefined,
      imageUrl: imageUrl || null,
      imageAlt: imageAlt || null,
      authorId: adminUser.id,
      author: adminUser.id,
    });

    return NextResponse.json({
      success: true,
      post: {
        id: newPost.id,
        title: newPost.title,
        slug: newPost.slug,
        status: newPost.status,
        publishedAt: newPost.publishedAt,
      },
      message: "Blog post published successfully!",
    });
  } catch (error) {
    console.error("API publish error:", error);
    return NextResponse.json(
      { error: "Failed to publish blog post" },
      { status: 500 }
    );
  }
}

// GET method to test the endpoint
export async function GET() {
  return NextResponse.json({
    message: "Blog publish API is working!",
    usage: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "your-api-key",
      },
      body: {
        title: "Your blog post title",
        content: "Your blog post content (supports markdown)",
        excerpt: "Optional excerpt",
        tags: ["tag1", "tag2"],
        imageUrl: "https://example.com/image.jpg",
        imageAlt: "Image description",
      },
    },
  });
}
