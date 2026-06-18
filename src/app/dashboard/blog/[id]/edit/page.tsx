import { BlogPostEditor } from "../../BlogPostEditor";

type EditBlogPostPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBlogPostPage({
  params,
}: EditBlogPostPageProps) {
  const { id } = await params;

  return (
    <div className="w-full min-w-0">
      <BlogPostEditor mode="edit" postId={id} />
    </div>
  );
}
