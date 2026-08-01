import ReviewForm from "@/components/admin/ReviewForm";
import { prisma } from "@/lib/prisma";

export default async function NewReviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const bikes = await prisma.bike.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">New review</h1>
      <div className="mt-6">
        <ReviewForm locale={locale} mode="create" bikes={bikes} />
      </div>
    </div>
  );
}
