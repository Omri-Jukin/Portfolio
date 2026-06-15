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
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <BlogPostEditor mode="edit" postId={id} />
    </div>
  );
}
