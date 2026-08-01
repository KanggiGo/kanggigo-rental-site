import { notFound } from "next/navigation";
import LocationForm from "@/components/admin/LocationForm";
import { prisma } from "@/lib/prisma";
import type { LocationFormValues } from "@/lib/validations";

const LOCALES = ["en", "id", "ru", "fr"] as const;

export default async function EditLocationPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const location = await prisma.location.findUnique({
    where: { id },
    include: { translations: true },
  });

  if (!location) notFound();

  const defaultValues: LocationFormValues = {
    slug: location.slug,
    isAirport: location.isAirport,
    deliveryNote: location.deliveryNote,
    translations: LOCALES.map((l) => {
      const match = location.translations.find((t) => t.locale === l);
      return { locale: l, name: match?.name ?? "", description: match?.description ?? "" };
    }),
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">Edit location</h1>
      <div className="mt-6">
        <LocationForm locale={locale} mode="edit" locationId={location.id} defaultValues={defaultValues} />
      </div>
    </div>
  );
}
