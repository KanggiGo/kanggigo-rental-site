import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import BikeGrid from "@/components/bike/BikeGrid";
import { getFeaturedBikes } from "@/lib/bikes";

export default async function FeaturedBikes({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Home" });
  const bikes = await getFeaturedBikes(locale);

  if (bikes.length === 0) return null;

  return (
    <section className="bg-surface py-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-ink sm:text-3xl">{t("featuredTitle")}</h2>
            <p className="mt-2 text-muted">{t("featuredSubtitle")}</p>
          </div>
          <Link href="/bikes" className="text-sm font-semibold text-primary hover:underline">
            {t("viewAll")} →
          </Link>
        </div>

        <div className="mt-8">
          <BikeGrid bikes={bikes} locale={locale} />
        </div>
      </div>
    </section>
  );
}
