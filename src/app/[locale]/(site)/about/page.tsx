import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { buildAlternates, truncateForMeta, SITE_URL } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  const title = t("title");
  const description = truncateForMeta(t("intro"));

  return {
    // Overrides the layout's `%s | KanggiGo Rental` template: "title" here
    // already contains the brand name, so applying the template would
    // duplicate it (e.g. "About KanggiGo Rental | KanggiGo Rental").
    title: { absolute: title },
    description,
    alternates: buildAlternates("/about", locale),
    openGraph: { title, description, url: `${SITE_URL}/${locale}/about`, type: "website" },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tNav, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "About" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Common" }),
  ]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs
        locale={locale}
        items={[
          { name: tCommon("home"), href: "/" },
          { name: tNav("about"), href: "/about" },
        ]}
      />
      <h1 className="font-heading text-3xl font-bold text-ink">{t("title")}</h1>
      <p className="mt-4 leading-relaxed text-muted">{t("intro")}</p>
      <p className="mt-4 leading-relaxed text-muted">{t("body")}</p>
    </div>
  );
}
