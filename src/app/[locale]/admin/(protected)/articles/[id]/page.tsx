import { notFound } from "next/navigation";
import ArticleForm from "@/components/admin/ArticleForm";
import { prisma } from "@/lib/prisma";
import type { ArticleFormValues } from "@/lib/validations";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();

  const defaultValues: ArticleFormValues = {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    body: article.body,
    coverImageUrl: article.coverImageUrl,
    category: article.category,
    isPublished: article.isPublished,
    publishedAt: article.publishedAt.toISOString().slice(0, 10),
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">Edit article</h1>
      <div className="mt-6">
        <ArticleForm locale={locale} mode="edit" articleId={article.id} defaultValues={defaultValues} />
      </div>
    </div>
  );
}
