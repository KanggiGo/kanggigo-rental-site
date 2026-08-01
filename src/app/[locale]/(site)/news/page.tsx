import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ArticleGrid from "@/components/news/ArticleGrid";
import Pagination from "@/components/bike/Pagination";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { getPublishedArticles } from "@/lib/articles";
import { buildEnglishOnlyAlternates, SITE_URL } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "NewsPage" });
  const title = t("title");
  const description = t("intro");

  return {
    title,
    description,
    // Article excerpts on this listing are English-only (no per-locale
    // article content yet), so it canonicalizes to /en rather than
    // claiming translated alternates that don't exist.
    alternates: buildEnglishOnlyAlternates("/news"),
    openGraph: { title, description, url: `${SITE_URL}/${locale}/news`, type: "website" },
  };
}

export default async function NewsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  setRequestLocale(locale);

  const page = pageParam ? Math.max(1, Number(pageParam)) : 1;

  const [t, tCommon, tNav, { articles, totalPages }] = await Promise.all([
    getTranslations({ locale, namespace: "NewsPage" }),
    getTranslations({ locale, namespace: "Common" }),
    getTranslations({ locale, namespace: "Nav" }),
    getPublishedArticles(page),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        locale={locale}
        items={[
          { name: tCommon("home"), href: "/" },
          { name: tNav("news"), href: "/news" },
        ]}
      />

      <h1 className="font-heading text-3xl font-bold text-ink">{t("title")}</h1>
      <p className="mt-3 max-w-2xl text-muted">{t("intro")}</p>

      <div className="mt-8">
        <ArticleGrid articles={articles} locale={locale} />
        <Pagination page={page} totalPages={totalPages} locale={locale} basePath="/news" searchParams={{}} />
      </div>
    </div>
  );
}
