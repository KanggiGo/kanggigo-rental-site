import { getTranslations } from "next-intl/server";
import SearchBar from "./SearchBar";
import { ScooterIcon } from "@/components/icons/Icons";
import type { LocationOption } from "@/lib/locations";

export default async function Hero({
  locale,
  locations,
}: {
  locale: string;
  locations: LocationOption[];
}) {
  const t = await getTranslations({ locale, namespace: "Home" });

  return (
    <section className="relative flex min-h-[560px] items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-hover px-4 py-20 sm:px-6">
      <ScooterIcon className="pointer-events-none absolute -bottom-10 -end-10 h-72 w-72 text-white/5" />
      <ScooterIcon className="pointer-events-none absolute -top-16 -start-16 h-64 w-64 text-white/5" />

      <div className="relative z-10 flex w-full flex-col items-center gap-8 text-center">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/85 sm:text-lg">{t("heroSubtitle")}</p>
        </div>

        <SearchBar locations={locations} />
      </div>
    </section>
  );
}
