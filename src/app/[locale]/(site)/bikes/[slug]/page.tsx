import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import BikeGallery from "@/components/bike/BikeGallery";
import BikePrice from "@/components/bike/BikePrice";
import BikeGrid from "@/components/bike/BikeGrid";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { getBikeBySlug, getSimilarBikes } from "@/lib/bikes";
import { buildAlternates, bikeProductJsonLd, SITE_URL } from "@/lib/seo";
import {
  EngineIcon,
  SeatIcon,
  HelmetIcon,
  CashIcon,
} from "@/components/icons/Icons";
import type { ComponentType } from "react";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const bike = await getBikeBySlug(slug, locale);
  if (!bike) notFound();

  const title = `${bike.name} Rental in Bali`;
  const description = `Rent the ${bike.name} in Bali from $${Math.round(Number(bike.pricePerDay))}/day. Zero deposit, free delivery to your hotel or the airport, helmet included. Book online in minutes.`;
  const path = `/bikes/${bike.slug}`;
  const cover = bike.images[0]?.url;

  return {
    title,
    description,
    alternates: buildAlternates(path, locale),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}${path}`,
      type: "website",
      ...(cover ? { images: [{ url: cover }] } : {}),
    },
  };
}

export default async function BikeDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [bike, t, tCategory, tTransmission, tNav, tCommon, tBooking] = await Promise.all([
    getBikeBySlug(slug, locale),
    getTranslations({ locale, namespace: "BikeDetail" }),
    getTranslations({ locale, namespace: "BikeCategory" }),
    getTranslations({ locale, namespace: "Transmission" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Common" }),
    getTranslations({ locale, namespace: "BookingForm" }),
  ]);
  if (!bike) notFound();

  const similar = await getSimilarBikes(bike, locale);

  const bikeUrl = `${SITE_URL}/${locale}/bikes/${bike.slug}`;
  const whatsappMessage = t("whatsappMessage", { name: bike.name, url: bikeUrl });
  const cover = bike.images[0]?.url;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: bikeProductJsonLd({
            name: bike.name,
            description: bike.description,
            url: bikeUrl,
            image: cover,
            pricePerDay: Number(bike.pricePerDay),
            brand: bike.brand,
          }),
        }}
      />

      <Breadcrumbs
        locale={locale}
        items={[
          { name: tCommon("home"), href: "/" },
          { name: tNav("bikes"), href: "/bikes" },
          { name: bike.name, href: `/bikes/${bike.slug}` },
        ]}
      />

      <Link href="/bikes" className="mb-4 inline-block text-sm font-medium text-muted hover:text-primary">
        ← {t("backToFleet")}
      </Link>

      <BikeGallery
        images={bike.images.map((img) => ({ url: img.url, altText: img.altText || bike.name }))}
        seed={bike.id}
      />

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{bike.brand}</p>
          <h1 className="mt-1 font-heading text-2xl font-bold text-ink sm:text-3xl">{bike.name}</h1>

          <div className="mt-4 flex flex-wrap gap-6">
            <div>
              <p className="text-xs font-medium text-muted">{t("perDay")}</p>
              <BikePrice price={Number(bike.pricePerDay)} locale={locale} showUsdReference className="font-heading text-xl font-semibold text-ink" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted">{t("perWeek")}</p>
              <BikePrice price={Number(bike.pricePerWeek)} locale={locale} className="font-heading text-xl font-semibold text-ink" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted">{t("perMonth")}</p>
              <BikePrice price={Number(bike.pricePerMonth)} locale={locale} className="font-heading text-xl font-semibold text-ink" />
            </div>
          </div>

          <section className="mt-8">
            <h2 className="font-heading text-lg font-semibold text-ink">{t("specifications")}</h2>
            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl border border-border bg-white p-5 sm:grid-cols-3">
              <SpecRow label={t("brand")} value={bike.brand} />
              <SpecRow label={t("category")} value={tCategory(bike.category)} />
              <SpecRow label={t("transmission")} value={tTransmission(bike.transmission)} />
              <SpecRow icon={EngineIcon} label={t("engineCc")} value={`${bike.engineCc}cc`} />
              <SpecRow icon={SeatIcon} label={t("seats")} value={String(bike.seats)} />
              <SpecRow icon={HelmetIcon} label={t("helmets")} value={String(bike.helmetsIncluded)} />
              <SpecRow label={t("reference")} value={bike.id.slice(-8).toUpperCase()} />
            </dl>
          </section>

          <section className="mt-8">
            <h2 className="font-heading text-lg font-semibold text-ink">{t("description")}</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{bike.description}</p>
          </section>

          {similar.length > 0 && (
            <section className="mt-10">
              <h2 className="font-heading text-lg font-semibold text-ink">{t("similarTitle")}</h2>
              <div className="mt-4">
                <BikeGrid bikes={similar} locale={locale} />
              </div>
            </section>
          )}
        </div>

        <aside className="w-full shrink-0 lg:w-96">
          <div className="sticky top-24 space-y-4 rounded-xl border border-border bg-white p-5">
            <WhatsAppButton message={whatsappMessage} label={t("whatsappInquiry")} className="w-full" />
            <p className="flex items-start gap-1.5 rounded-md bg-sand px-3 py-2 text-xs text-ink">
              <CashIcon className="h-4 w-4 shrink-0 text-accent" />
              {tBooking("paymentNote")}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SpecRow({
  icon: Icon,
  label,
  value,
}: {
  icon?: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1 text-xs text-muted">
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
        {label}
      </dt>
      <dd className="text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}
