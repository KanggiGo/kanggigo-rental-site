import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteReview } from "@/lib/actions/reviews";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { StarIcon } from "@/components/icons/Icons";

export default async function AdminReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const reviews = await prisma.review.findMany({
    include: { bike: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold text-ink">Reviews</h1>
        <Link
          href={`/${locale}/admin/reviews/new`}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          + New review
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-heading font-semibold text-ink">{review.customerName}</p>
                  <span className="flex gap-0.5 text-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} className="h-3.5 w-3.5" filled={i < review.rating} />
                    ))}
                  </span>
                </div>
                {review.bike && <p className="text-xs text-muted">Re: {review.bike.name}</p>}
                <p className="mt-2 text-sm text-muted">{review.comment}</p>
              </div>
              <div className="flex items-center gap-3">
                {review.isFeatured && (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    Featured
                  </span>
                )}
                <Link
                  href={`/${locale}/admin/reviews/${review.id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Edit
                </Link>
                <ConfirmDeleteButton id={review.id} action={deleteReview} />
              </div>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
            No reviews yet.
          </p>
        )}
      </div>
    </div>
  );
}
