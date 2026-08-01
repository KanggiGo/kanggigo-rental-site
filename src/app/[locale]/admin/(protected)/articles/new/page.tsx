import ArticleForm from "@/components/admin/ArticleForm";

export default async function NewArticlePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">New article</h1>
      <div className="mt-6">
        <ArticleForm locale={locale} mode="create" />
      </div>
    </div>
  );
}
