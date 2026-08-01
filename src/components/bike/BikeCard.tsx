import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import BikePrice from "./BikePrice";
import BikeImagePlaceholder from "./BikeImagePlaceholder";
import { SeatIcon, HelmetIcon, EngineIcon } from "@/components/icons/Icons";
import type { LocalizedBike } from "@/lib/bikes";

export default async function BikeCard({
  bike,
  locale,
}: {
  bike: LocalizedBike;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "BikeCard" });
  const tCategory = await getTranslations({ locale, namespace: "BikeCategory" });
  const cover = bike.images.find((img) => img.isCoverImage) ?? bike.images[0];

  return (
    <Link
      href={`/bikes/${bike.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.altText || bike.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <BikeImagePlaceholder
            seed={bike.id}
            className="h-full w-full transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute start-3 top-3 flex gap-2">
          <span className="rounded-full bg-ink-overlay px-2.5 py-1 text-xs font-medium text-white">
            {tCategory(bike.category)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{bike.brand}</p>
        <h3 className="font-heading text-base font-semibold leading-snug text-ink">{bike.name}</h3>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
          <span className="inline-flex items-center gap-1">
            <EngineIcon className="h-4 w-4 shrink-0" />
            {t("engineCc", { cc: bike.engineCc })}
          </span>
          <span className="inline-flex items-center gap-1">
            <SeatIcon className="h-4 w-4 shrink-0" />
            {t("seats", { count: bike.seats })}
          </span>
          <span className="inline-flex items-center gap-1">
            <HelmetIcon className="h-4 w-4 shrink-0" />
            {t("helmets", { count: bike.helmetsIncluded })}
          </span>
        </div>

        <div className="mt-auto pt-2">
          <p className="text-xs font-medium text-muted">{t("from")}</p>
          <BikePrice
            price={Number(bike.pricePerDay)}
            locale={locale}
            suffix={t("perDay")}
            className="font-heading text-lg font-semibold text-ink"
          />
        </div>
      </div>
    </Link>
  );
}
