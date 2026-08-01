import LocationForm from "@/components/admin/LocationForm";

export default async function NewLocationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">New location</h1>
      <div className="mt-6">
        <LocationForm locale={locale} mode="create" />
      </div>
    </div>
  );
}
