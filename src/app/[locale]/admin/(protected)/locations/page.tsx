import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteLocation } from "@/lib/actions/locations";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export default async function AdminLocationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const locations = await prisma.location.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold text-ink">Locations</h1>
        <Link
          href={`/${locale}/admin/locations/new`}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          + New location
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Airport</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr key={location.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{location.name}</td>
                <td className="px-4 py-3 text-muted">{location.slug}</td>
                <td className="px-4 py-3 text-muted">{location.isAirport ? "Yes" : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/${locale}/admin/locations/${location.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Edit
                    </Link>
                    <ConfirmDeleteButton id={location.id} action={deleteLocation} />
                  </div>
                </td>
              </tr>
            ))}
            {locations.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  No locations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
