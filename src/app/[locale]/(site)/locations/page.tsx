import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocationIcon } from "@/components/icons/Icons";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { getAllLocations } from "@/lib/locations";
import { buildAlternates, SITE_URL } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LocationsPage" });
  const title = t("title");
  const description = t("intro");

  return {
    title,
    description,
    alternates: buildAlternates("/locations", locale),
    openGraph: { title, description, url: `${SITE_URL}/${locale}/locations`, type: "website" },
  };
}

export default async function LocationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tNav, tCommon, locations] = await Promise.all([
    getTranslations({ locale, namespace: "LocationsPage" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Common" }),
    getAllLocations(),
  ]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs
        locale={locale}
        items={[
          { name: tCommon("home"), href: "/" },
          { name: tNav("locations"), href: "/locations" },
        ]}
      />
      <h1 className="font-heading text-3xl font-bold text-ink">{t("title")}</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted">{t("intro")}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {locations.map((loc) => (
          <Link
            key={loc.id}
            href={`/locations/${loc.slug}`}
            className="flex items-center gap-3 rounded-xl border border-border bg-white p-5 hover:border-primary"
          >
            <LocationIcon className="h-5 w-5 shrink-0 text-accent" />
            <span className="font-heading font-semibold text-ink">{loc.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
