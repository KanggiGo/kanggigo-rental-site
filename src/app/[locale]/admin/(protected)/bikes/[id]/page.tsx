import { notFound } from "next/navigation";
import BikeForm from "@/components/admin/BikeForm";
import { prisma } from "@/lib/prisma";
import type { BikeFormValues } from "@/lib/validations";

const LOCALES = ["en", "id", "ru", "fr"] as const;

export default async function EditBikePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const bike = await prisma.bike.findUnique({
    where: { id },
    include: { translations: true, images: { orderBy: { sortOrder: "asc" } } },
  });

  if (!bike) notFound();

  const defaultValues: BikeFormValues = {
    slug: bike.slug,
    brand: bike.brand,
    category: bike.category,
    transmission: bike.transmission,
    engineCc: bike.engineCc,
    seats: bike.seats,
    helmetsIncluded: bike.helmetsIncluded,
    pricePerDay: Number(bike.pricePerDay),
    pricePerWeek: Number(bike.pricePerWeek),
    pricePerMonth: Number(bike.pricePerMonth),
    currency: bike.currency,
    status: bike.status,
    isFeatured: bike.isFeatured,
    translations: LOCALES.map((l) => {
      const match = bike.translations.find((t) => t.locale === l);
      return { locale: l, name: match?.name ?? "", description: match?.description ?? "" };
    }),
    images: bike.images.map((img) => ({
      url: img.url,
      altText: img.altText,
      sortOrder: img.sortOrder,
      isCoverImage: img.isCoverImage,
    })),
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">Edit bike</h1>
      <div className="mt-6">
        <BikeForm locale={locale} mode="edit" bikeId={bike.id} defaultValues={defaultValues} />
      </div>
    </div>
  );
}
