import { BlogPostEditor } from "../BlogPostEditor";

export default function NewBlogPostPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <BlogPostEditor mode="create" />
    </div>
  );
}
