import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ArticleGrid from "@/components/news/ArticleGrid";
import ArticleImagePlaceholder from "@/components/news/ArticleImagePlaceholder";
import { getArticleBySlug, getRelatedArticles } from "@/lib/articles";
import { formatDate } from "@/lib/utils";
import { buildEnglishOnlyAlternates, newsArticleJsonLd, SITE_URL } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const path = `/news/${article.slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    // Article body is English-only (no ArticleTranslation model yet), so
    // every locale's URL canonicalizes to /en instead of claiming id/ru/fr
    // hreflang alternates that don't exist.
    alternates: buildEnglishOnlyAlternates(path),
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `${SITE_URL}/${locale}${path}`,
      type: "article",
      ...(article.coverImageUrl ? { images: [{ url: article.coverImageUrl }] } : {}),
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [article, t, tNav, tCommon] = await Promise.all([
    getArticleBySlug(slug),
    getTranslations({ locale, namespace: "NewsPage" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Common" }),
  ]);
  if (!article) notFound();

  const related = await getRelatedArticles(article);
  const articleUrl = `${SITE_URL}/${locale}/news/${article.slug}`;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: newsArticleJsonLd({
            headline: article.title,
            description: article.excerpt,
            url: articleUrl,
            image: article.coverImageUrl || undefined,
            datePublished: article.publishedAt.toISOString(),
            dateModified: article.updatedAt.toISOString(),
          }),
        }}
      />

      <Breadcrumbs
        locale={locale}
        items={[
          { name: tCommon("home"), href: "/" },
          { name: tNav("news"), href: "/news" },
          { name: article.title, href: `/news/${article.slug}` },
        ]}
      />

      <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
        <span className="rounded-full bg-sand px-2.5 py-1 text-ink">{article.category}</span>
        {t("publishedOn", { date: formatDate(article.publishedAt, locale) })}
      </p>

      <h1 className="mt-3 font-heading text-3xl font-bold text-ink sm:text-4xl">{article.title}</h1>

      <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-xl">
        {article.coverImageUrl ? (
          <Image src={article.coverImageUrl} alt={article.title} fill sizes="768px" className="object-cover" priority />
        ) : (
          <ArticleImagePlaceholder seed={article.id} className="h-full w-full" />
        )}
      </div>

      <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-ink">{article.body}</div>

      <Link href="/news" className="mt-8 inline-block text-sm font-medium text-muted hover:text-primary">
        ← {t("backToNews")}
      </Link>

      {related.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="font-heading text-lg font-semibold text-ink">{t("relatedTitle")}</h2>
          <div className="mt-4">
            <ArticleGrid articles={related} locale={locale} />
          </div>
        </section>
      )}
    </div>
  );
}
