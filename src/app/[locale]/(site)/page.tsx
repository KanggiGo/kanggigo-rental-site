import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/home/Hero";
import TrustSection from "@/components/home/TrustSection";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedBikes from "@/components/home/FeaturedBikes";
import ExploreLocations from "@/components/home/ExploreLocations";
import Reviews from "@/components/home/Reviews";
import Faq from "@/components/home/Faq";
import SeoContent from "@/components/home/SeoContent";
import { getPopularLocations } from "@/lib/locations";
import { POPULAR_LOCATION_SLUGS } from "@/lib/constants";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const locations = await getPopularLocations(POPULAR_LOCATION_SLUGS);

  return (
    <>
      <Hero locale={locale} locations={locations} />
      <TrustSection locale={locale} />
      <HowItWorks locale={locale} />
      <FeaturedBikes locale={locale} />
      <ExploreLocations locale={locale} locations={locations} />
      <Reviews locale={locale} />
      <SeoContent locale={locale} />
      <Faq locale={locale} />
    </>
  );
}
