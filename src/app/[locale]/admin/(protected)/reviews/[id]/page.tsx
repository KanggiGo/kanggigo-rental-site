import { notFound } from "next/navigation";
import ReviewForm from "@/components/admin/ReviewForm";
import { prisma } from "@/lib/prisma";
import type { ReviewFormValues } from "@/lib/validations";

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const [review, bikes] = await Promise.all([
    prisma.review.findUnique({ where: { id } }),
    prisma.bike.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  if (!review) notFound();

  const defaultValues: ReviewFormValues = {
    customerName: review.customerName,
    rating: review.rating,
    comment: review.comment,
    bikeId: review.bikeId,
    isFeatured: review.isFeatured,
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">Edit review</h1>
      <div className="mt-6">
        <ReviewForm locale={locale} mode="edit" reviewId={review.id} bikes={bikes} defaultValues={defaultValues} />
      </div>
    </div>
  );
}
