import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { StarIcon } from "@/components/icons/Icons";

export default async function Reviews({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Home" });
  const reviews = await prisma.review.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  if (reviews.length === 0) return null;

  return (
    <section className="bg-sand py-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-ink sm:text-3xl">{t("reviewsTitle")}</h2>
          <p className="mt-2 text-muted">{t("reviewsSubtitle")}</p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4" filled={i < review.rating} />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">&ldquo;{review.comment}&rdquo;</p>
              <p className="mt-4 font-heading text-sm font-semibold text-ink">{review.customerName}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
