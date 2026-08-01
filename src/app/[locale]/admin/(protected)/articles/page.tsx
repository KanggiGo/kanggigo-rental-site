import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteArticle } from "@/lib/actions/articles";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export default async function AdminArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const articles = await prisma.article.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold text-ink">News & Articles</h1>
        <Link
          href={`/${locale}/admin/articles/new`}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          + New article
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Article</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-border last:border-0">
                <td className="flex items-center gap-3 px-4 py-3">
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-surface">
                    {article.coverImageUrl && (
                      <Image src={article.coverImageUrl} alt="" fill sizes="64px" className="object-cover" />
                    )}
                  </div>
                  <p className="font-medium text-ink">{article.title}</p>
                </td>
                <td className="px-4 py-3 text-muted">{article.category}</td>
                <td className="px-4 py-3 text-muted">{article.publishedAt.toLocaleDateString()}</td>
                <td className="px-4 py-3 text-muted">
                  {article.isPublished ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-ink">Draft</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/${locale}/admin/articles/${article.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Edit
                    </Link>
                    <ConfirmDeleteButton id={article.id} action={deleteArticle} />
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  No articles yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
