import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteBike } from "@/lib/actions/bikes";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export default async function AdminBikesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;

  const bikes = await prisma.bike.findMany({
    where: q ? { name: { contains: q } } : undefined,
    include: {
      images: { where: { isCoverImage: true }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold text-ink">Bikes</h1>
        <Link
          href={`/${locale}/admin/bikes/new`}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          + New bike
        </Link>
      </div>

      <form className="mt-4" action={`/${locale}/admin/bikes`}>
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by name..."
          className="w-full max-w-sm rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Bike</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price/day (USD)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {bikes.map((bike) => (
              <tr key={bike.id} className="border-b border-border last:border-0">
                <td className="flex items-center gap-3 px-4 py-3">
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-surface">
                    {bike.images[0] && (
                      <Image src={bike.images[0].url} alt="" fill sizes="64px" className="object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-ink">{bike.name}</p>
                    <p className="text-xs text-muted">{bike.brand}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">
                  {bike.category} · {bike.transmission}
                </td>
                <td className="px-4 py-3 text-muted">${Number(bike.pricePerDay).toFixed(2)}</td>
                <td className="px-4 py-3 text-muted">{bike.status}</td>
                <td className="px-4 py-3 text-muted">{bike.isFeatured ? "Yes" : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/${locale}/admin/bikes/${bike.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Edit
                    </Link>
                    <ConfirmDeleteButton id={bike.id} action={deleteBike} />
                  </div>
                </td>
              </tr>
            ))}
            {bikes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  No bikes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
