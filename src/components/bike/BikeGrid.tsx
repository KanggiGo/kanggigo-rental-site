import { getTranslations } from "next-intl/server";
import BikeCard from "./BikeCard";
import type { LocalizedBike } from "@/lib/bikes";

export default async function BikeGrid({
  bikes,
  locale,
}: {
  bikes: LocalizedBike[];
  locale: string;
}) {
  if (bikes.length === 0) {
    const t = await getTranslations({ locale, namespace: "Filters" });
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <p className="font-heading text-lg font-semibold text-ink">{t("noResults")}</p>
        <p className="mt-2 text-sm text-muted">{t("noResultsHint")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {bikes.map((bike) => (
        <BikeCard key={bike.id} bike={bike} locale={locale} />
      ))}
    </div>
  );
}
