import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ListingPageContent from "@/components/bike/ListingPageContent";
import { parseSearchParams, toFlatSearchParams } from "@/lib/listing-params";
import { buildAlternates, SITE_URL } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const title = t("fleetTitle");
  const description = t("fleetDescription");

  return {
    title,
    description,
    // Canonical ignores filter/sort query params so filtered views don't
    // compete with the main listing page for the same search intent.
    alternates: buildAlternates("/bikes", locale),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/bikes`,
      type: "website",
    },
  };
}

export default async function BikesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const rawSearchParams = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Nav" });

  return (
    <ListingPageContent
      locale={locale}
      basePath="/bikes"
      title={t("bikes")}
      params={parseSearchParams(rawSearchParams)}
      flatSearchParams={toFlatSearchParams(rawSearchParams)}
    />
  );
}
