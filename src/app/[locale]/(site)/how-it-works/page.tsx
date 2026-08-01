import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShieldIcon, TruckIcon, EngineIcon, CashIcon } from "@/components/icons/Icons";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { buildAlternates, SITE_URL } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HowItWorksPage" });
  const title = t("title");
  const description = t("intro");

  return {
    title,
    description,
    alternates: buildAlternates("/how-it-works", locale),
    openGraph: { title, description, url: `${SITE_URL}/${locale}/how-it-works`, type: "website" },
  };
}

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tNav, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "HowItWorksPage" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Common" }),
  ]);

  const sections = [
    { icon: EngineIcon, title: t("licenseTitle"), body: t("licenseBody") },
    { icon: TruckIcon, title: t("deliveryTitle"), body: t("deliveryBody") },
    { icon: CashIcon, title: t("paymentTitle"), body: t("paymentBody") },
    { icon: ShieldIcon, title: t("damageTitle"), body: t("damageBody") },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs
        locale={locale}
        items={[
          { name: tCommon("home"), href: "/" },
          { name: tNav("howItWorks"), href: "/how-it-works" },
        ]}
      />
      <h1 className="font-heading text-3xl font-bold text-ink">{t("title")}</h1>
      <p className="mt-4 leading-relaxed text-muted">{t("intro")}</p>

      <div className="mt-10 space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="rounded-xl border border-border bg-white p-6">
            <div className="flex items-center gap-3">
              <section.icon className="h-6 w-6 shrink-0 text-accent" />
              <h2 className="font-heading text-lg font-semibold text-ink">{section.title}</h2>
            </div>
            <p className="mt-3 leading-relaxed text-muted">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
