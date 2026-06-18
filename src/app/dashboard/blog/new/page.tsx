import { BlogPostEditor } from "../BlogPostEditor";

export default function NewBlogPostPage() {
  return (
    <div className="w-full min-w-0">
      <BlogPostEditor mode="create" />
    </div>
  );
}
