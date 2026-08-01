import BikeForm from "@/components/admin/BikeForm";

export default async function NewBikePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">New bike</h1>
      <div className="mt-6">
        <BikeForm locale={locale} mode="create" />
      </div>
    </div>
  );
}
