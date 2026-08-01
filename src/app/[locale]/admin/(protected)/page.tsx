import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [bikeCount, bookingCount, newBookingCount, locationCount, reviewCount, articleCount] = await Promise.all([
    prisma.bike.count(),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "NEW" } }),
    prisma.location.count(),
    prisma.review.count(),
    prisma.article.count(),
  ]);

  const stats = [
    { label: "Bikes", value: bikeCount, href: "/admin/bikes" },
    { label: "Locations", value: locationCount, href: "/admin/locations" },
    { label: "Bookings", value: bookingCount, href: "/admin/bookings" },
    { label: "New requests", value: newBookingCount, href: "/admin/bookings" },
    { label: "Reviews", value: reviewCount, href: "/admin/reviews" },
    { label: "Articles", value: articleCount, href: "/admin/articles" },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={`/${locale}${stat.href}`}
            className="rounded-xl border border-border bg-white p-5 hover:border-primary"
          >
            <p className="text-3xl font-bold text-ink">{stat.value}</p>
            <p className="mt-1 text-sm text-muted">{stat.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
