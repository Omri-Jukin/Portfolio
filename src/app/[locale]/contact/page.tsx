import { redirect } from "next/navigation";

type PageParams = { locale: string };

type PageProps = {
  params: Promise<PageParams>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  redirect(`/${locale}#contact-section`);
}
