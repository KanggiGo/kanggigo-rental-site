import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocationIcon, ScooterIcon } from "@/components/icons/Icons";
import type { LocationOption } from "@/lib/locations";

// Falls back to the plain gradient tile for any location without a photo
// (e.g. one added via admin without an uploaded image).
const LOCATION_IMAGES: Record<string, string> = {
  canggu: "/uploads/locations/canggu.webp",
  seminyak: "/uploads/locations/seminyak.webp",
  uluwatu: "/uploads/locations/uluwatu.webp",
  ubud: "/uploads/locations/ubud.webp",
  sanur: "/uploads/locations/sanur.webp",
  "denpasar-airport": "/uploads/locations/denpasar-airport.webp",
};

const CARD_GRADIENTS = [
  "from-primary to-primary-hover",
  "from-[#0d1c2e] to-accent",
  "from-[#0a1522] to-[#1b3a5b]",
  "from-primary-hover to-[#0a1522]",
];

export default async function ExploreLocations({
  locale,
  locations,
}: {
  locale: string;
  locations: LocationOption[];
}) {
  const t = await getTranslations({ locale, namespace: "Home" });

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="font-heading text-2xl font-bold text-ink sm:text-3xl">{t("exploreTitle")}</h2>
        <p className="mt-2 text-muted">{t("exploreSubtitle")}</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {locations.map((loc, index) => {
          const image = LOCATION_IMAGES[loc.slug];
          return (
            <Link
              key={loc.slug}
              href={`/locations/${loc.slug}`}
              className={`group relative flex aspect-[4/5] items-end overflow-hidden rounded-xl p-3 ${
                image ? "bg-primary" : `bg-gradient-to-br ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]}`
              }`}
            >
              {image ? (
                <>
                  <Image
                    src={image}
                    alt={`${loc.name}, Bali`}
                    fill
                    sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 45vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                </>
              ) : (
                <ScooterIcon className="pointer-events-none absolute -end-4 -top-4 h-20 w-20 text-white/10 transition-transform duration-300 group-hover:scale-110" />
              )}
              <span className="relative z-10 flex items-center gap-1.5 font-heading text-sm font-semibold text-white sm:text-base">
                <LocationIcon className="h-4 w-4 shrink-0" />
                {loc.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
