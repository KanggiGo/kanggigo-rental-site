import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Faq from "@/components/home/Faq";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { buildAlternates, SITE_URL } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FAQPage" });
  const title = t("title");
  const description = t("intro");

  return {
    title,
    description,
    alternates: buildAlternates("/faq", locale),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/faq`,
      type: "website",
    },
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tNav, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "FAQPage" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Common" }),
  ]);

  return (
    <div className="py-6">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          locale={locale}
          items={[
            { name: tCommon("home"), href: "/" },
            { name: tNav("faq"), href: "/faq" },
          ]}
        />
        <h1 className="font-heading text-3xl font-bold text-ink">{t("title")}</h1>
        <p className="mt-3 leading-relaxed text-muted">{t("intro")}</p>
      </div>
      <Faq locale={locale} showHeading={false} />
    </div>
  );
}
