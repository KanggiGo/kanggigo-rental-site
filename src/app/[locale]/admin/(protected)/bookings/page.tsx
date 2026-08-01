import { prisma } from "@/lib/prisma";
import BookingStatusSelect from "@/components/admin/BookingStatusSelect";

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-amber-100 text-amber-700",
  CONTACTED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { bike: { select: { name: true, slug: true } }, pickupLocation: true, dropoffLocation: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">Bookings</h1>

      <div className="mt-6 space-y-3">
        {bookings.map((booking) => (
          <div key={booking.id} className="rounded-xl border border-border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-heading font-semibold text-ink">{booking.customerName}</p>
                <p className="text-sm text-muted">
                  {booking.email}
                  {booking.phone && ` · ${booking.phone}`}
                </p>
                {booking.bike ? (
                  <p className="mt-1 text-xs font-medium text-muted">Bike: {booking.bike.name}</p>
                ) : (
                  <p className="mt-1 text-xs font-medium text-muted">General inquiry</p>
                )}
                {booking.pickupLocation && (
                  <p className="text-xs text-muted">
                    Pick-up: {booking.pickupLocation.name}
                    {booking.dropoffLocation && ` · Drop-off: ${booking.dropoffLocation.name}`}
                  </p>
                )}
                {booking.bike && (
                  <p className="text-xs text-muted">
                    {booking.startDate.toLocaleDateString()} → {booking.endDate.toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[booking.status]}`}>
                  {booking.status}
                </span>
                <BookingStatusSelect id={booking.id} status={booking.status} />
              </div>
            </div>
            {booking.message && (
              <p className="mt-3 whitespace-pre-line text-sm text-muted">{booking.message}</p>
            )}
            <p className="mt-3 text-xs text-muted">{booking.createdAt.toLocaleString()}</p>
          </div>
        ))}

        {bookings.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
            No bookings yet.
          </p>
        )}
      </div>
    </div>
  );
}
