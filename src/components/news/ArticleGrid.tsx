import { getTranslations } from "next-intl/server";
import type { Article } from "@prisma/client";
import ArticleCard from "./ArticleCard";

export default async function ArticleGrid({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  if (articles.length === 0) {
    const t = await getTranslations({ locale, namespace: "NewsPage" });
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <p className="text-sm text-muted">{t("noArticles")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} locale={locale} />
      ))}
    </div>
  );
}
