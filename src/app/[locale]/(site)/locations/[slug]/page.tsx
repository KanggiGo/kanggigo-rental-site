import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BikeGrid from "@/components/bike/BikeGrid";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { LocationIcon, TruckIcon } from "@/components/icons/Icons";
import { getLocalizedLocationBySlug } from "@/lib/locations";
import { getFeaturedBikes } from "@/lib/bikes";
import { buildAlternates, truncateForMeta, SITE_URL } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const location = await getLocalizedLocationBySlug(slug, locale);
  if (!location) notFound();

  const title = `Scooter & Motorbike Rental in ${location.name}, Bali`;
  const description = location.description
    ? truncateForMeta(location.description)
    : `Rent a scooter or motorbike in ${location.name}, Bali with free delivery and zero deposit.`;
  const path = `/locations/${slug}`;

  return {
    title,
    description,
    alternates: buildAlternates(path, locale),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}${path}`,
      type: "website",
    },
  };
}

export default async function LocationPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [location, t, tNav, tCommon, bikes] = await Promise.all([
    getLocalizedLocationBySlug(slug, locale),
    getTranslations({ locale, namespace: "LocationsPage" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Common" }),
    getFeaturedBikes(locale, 6),
  ]);
  if (!location) notFound();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        locale={locale}
        items={[
          { name: tCommon("home"), href: "/" },
          { name: tNav("locations"), href: "/locations" },
          { name: location.name, href: `/locations/${slug}` },
        ]}
      />

      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted">
        <LocationIcon className="h-4 w-4 shrink-0" />
        Bali
      </p>
      <h1 className="mt-1 font-heading text-3xl font-bold text-ink">
        {t("h1", { location: location.name })}
      </h1>
      {location.description && (
        <p className="mt-2 max-w-2xl text-muted">{location.description}</p>
      )}

      {location.deliveryNote && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-border bg-sand p-4 text-sm text-ink">
          <TruckIcon className="h-5 w-5 shrink-0 text-accent" />
          <p>{location.deliveryNote}</p>
        </div>
      )}

      <h2 className="mt-10 font-heading text-xl font-semibold text-ink">
        {t("bikesAvailable", { location: location.name })}
      </h2>

      <div className="mt-4">
        <BikeGrid bikes={bikes} locale={locale} />
      </div>
    </div>
  );
}
